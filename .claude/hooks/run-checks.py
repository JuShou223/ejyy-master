#!/usr/bin/env python3
"""
run-checks.py — portable, stack-auto-detecting check runner for Claude Code.

Monorepo-aware: from a single session at the repo root it figures out which
subproject an edited file belongs to (nearest package.json/tsconfig/go.mod...)
and runs that subproject's checks with that subproject's own tools.

Two modes:
  --mode fast  (default) : quick check of the single file Claude just edited,
                           scoped to its owning subproject. Wire as a
                           PostToolUse hook so Claude self-corrects immediately.
  --mode full            : delivery gate. Walks every subproject and runs each
                           one's test/typecheck suite. Use from /auto-deliver.

Hook contract (how Claude Code reacts to our exit code):
  exit 0  -> checks passed, or nothing to run  -> stay silent
  exit 2  -> checks FAILED -> stderr is fed back to Claude to fix
  other   -> internal error -> shown to the user, non-blocking

No third-party dependencies. Python 3.8+.
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

EDIT_TOOLS = {"Edit", "Write", "MultiEdit", "NotebookEdit"}
OUTPUT_TAIL = 3000  # only feed the tail of noisy logs back to Claude
# Files that mark the root of a buildable subproject inside a monorepo.
PROJECT_MARKERS = ("package.json", "tsconfig.json", "go.mod", "Cargo.toml")


def project_root() -> Path:
    return Path(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd())


def read_hook_input() -> dict:
    """PostToolUse passes JSON on stdin. When run by hand, stdin is empty."""
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except Exception:
        return {}


def have(cmd: str) -> bool:
    return shutil.which(cmd) is not None


def local_bin(root: Path, name: str):
    """Path to a tool installed in the subproject's node_modules, or None."""
    p = root / "node_modules" / ".bin" / name
    return p if p.exists() else None


def run(cmd, cwd) -> tuple:
    try:
        p = subprocess.run(cmd, cwd=str(cwd), capture_output=True,
                           text=True, timeout=600)
        return p.returncode, (p.stdout or "") + (p.stderr or "")
    except subprocess.TimeoutExpired:
        return 1, "[run-checks] timed out: " + " ".join(map(str, cmd))
    except FileNotFoundError:
        return 127, "[run-checks] command not found: " + str(cmd[0])


# ------------------------------------------------------------- monorepo glue ---
def find_subproject_root(file_path: str, repo_root: Path) -> Path:
    """Walk up from the edited file to the nearest subproject; fall back to repo
    root. This is what makes one root-level hook cover front- AND back-end."""
    repo = repo_root.resolve()
    try:
        d = Path(file_path).resolve().parent
    except Exception:
        return repo_root
    if d != repo and repo not in d.parents:
        return repo_root  # edited file lives outside the repo
    while True:
        if any((d / m).exists() for m in PROJECT_MARKERS):
            return d
        if d == repo:
            return repo_root
        d = d.parent


def discover_projects(repo_root: Path):
    """Every buildable subproject. If the root itself is a project, that's the
    only one; otherwise scan immediate children (a typical monorepo layout)."""
    root = repo_root.resolve()
    if any((root / m).exists() for m in PROJECT_MARKERS):
        return [root]
    projects = []
    for child in sorted(root.iterdir()):
        if not child.is_dir() or child.name.startswith(".") \
                or child.name == "node_modules":
            continue
        if any((child / m).exists() for m in PROJECT_MARKERS):
            projects.append(child)
    return projects or [root]


# ---------------------------------------------------------------- fast mode ---
def fast_check(file_path: str, root: Path):
    """Return (label, rc, output) for a quick single-file check, or None.
    `root` is the file's owning subproject, so local tools resolve correctly."""
    if not file_path:
        return None
    f = Path(file_path)
    if not f.exists():
        return None
    ext = f.suffix.lower()

    if ext == ".py":
        if have("ruff"):
            return ("ruff",) + run(["ruff", "check", str(f)], root)
        return ("py_compile",) + run([sys.executable, "-m", "py_compile", str(f)], root)

    # JS/TS/Vue: prefer the subproject's own eslint, then prettier, then a cheap
    # node syntax check for plain JS. .vue/.ts have no node --check fallback.
    if ext in (".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".vue"):
        eslint = local_bin(root, "eslint")
        if eslint:
            return ("eslint",) + run([str(eslint), str(f)], root)
        prettier = local_bin(root, "prettier")
        if prettier:
            return ("prettier --check",) + run([str(prettier), "--check", str(f)], root)
        if ext in (".js", ".mjs", ".cjs") and have("node"):
            return ("node --check",) + run(["node", "--check", str(f)], root)
        return None  # no local linter for this subproject -> defer to full gate

    if ext == ".go" and have("gofmt"):
        rc, out = run(["gofmt", "-l", str(f)], root)
        if out.strip():  # gofmt -l lists files that are NOT formatted
            return ("gofmt", 1, "Not gofmt-formatted:\n" + out)
        return ("gofmt", 0, "")

    return None  # unknown / heavy stack -> nothing fast to do


# ---------------------------------------------------------------- full mode ---
def package_manager(root: Path) -> str:
    if (root / "pnpm-lock.yaml").exists() and have("pnpm"):
        return "pnpm"
    if (root / "yarn.lock").exists() and have("yarn"):
        return "yarn"
    return "npm"


def has_npm_test(root: Path) -> bool:
    pkg = root / "package.json"
    if not pkg.exists():
        return False
    try:
        data = json.loads(pkg.read_text())
        return bool(data.get("scripts", {}).get("test"))
    except Exception:
        return False


def makefile_has_test(root: Path) -> bool:
    mk = root / "Makefile"
    if not mk.exists():
        return False
    try:
        return any(line.startswith("test:") for line in mk.read_text().splitlines())
    except Exception:
        return False


def full_check(root: Path):
    """Return (label, rc, output) for ONE subproject's suite, or None."""
    if makefile_has_test(root) and have("make"):
        return ("make test",) + run(["make", "test"], root)

    if has_npm_test(root):
        pm = package_manager(root)
        return ("{0} test".format(pm),) + run([pm, "test"], root)

    py_markers = ["pytest.ini", "pyproject.toml", "setup.cfg", "tox.ini"]
    if (any((root / m).exists() for m in py_markers) or (root / "tests").is_dir()) \
            and have("pytest"):
        return ("pytest",) + run(["pytest", "-q"], root)

    if (root / "go.mod").exists() and have("go"):
        return ("go test",) + run(["go", "test", "./..."], root)

    if (root / "Cargo.toml").exists() and have("cargo"):
        return ("cargo test",) + run(["cargo", "test"], root)

    # No unit tests, but a typed project? Type-checking is the next-best gate.
    if (root / "tsconfig.json").exists():
        tsc = local_bin(root, "tsc")
        if tsc:
            return ("tsc --noEmit",) + run([str(tsc), "--noEmit"], root)
        if have("npx"):
            rc, out = run(["npx", "--no-install", "tsc", "--noEmit"], root)
            if rc != 127:  # 127 => npx couldn't find tsc; nothing to run
                return ("tsc --noEmit", rc, out)

    return None


def run_full_gate(repo_root: Path) -> int:
    """Run every subproject's gate; aggregate failures into one report."""
    failures = []
    ran = []
    for proj in discover_projects(repo_root):
        result = full_check(proj)
        if result is None:
            continue
        label, rc, out = result
        name = proj.name if proj != repo_root else "(root)"
        ran.append("{0}: {1}".format(name, label))
        if rc != 0:
            failures.append((name, label, out[-OUTPUT_TAIL:]))

    if not ran:
        return 0  # nothing recognizable to gate on -> don't block
    if failures:
        sys.stderr.write("[X] delivery gate FAILED in {0} subproject(s):\n\n".format(
            len(failures)))
        for name, label, out in failures:
            sys.stderr.write("--- {0} ({1}) ---\n{2}\n\n".format(name, label, out))
        sys.stderr.write("Fix the above before continuing, then re-check.\n")
        return 2
    return 0


# --------------------------------------------------------------------- main ---
def main() -> None:
    mode = "fast"
    if "--mode" in sys.argv:
        i = sys.argv.index("--mode")
        if i + 1 < len(sys.argv):
            mode = sys.argv[i + 1]

    repo_root = project_root()

    if mode == "full":
        sys.exit(run_full_gate(repo_root))

    # fast mode (default): check just the edited file, in its own subproject
    data = read_hook_input()
    if data and data.get("tool_name", "") not in EDIT_TOOLS:
        sys.exit(0)
    file_path = (data.get("tool_input") or {}).get("file_path", "")
    subroot = find_subproject_root(file_path, repo_root)
    result = fast_check(file_path, subroot)
    if result is None:
        sys.exit(0)
    label, rc, out = result
    if rc != 0:
        tail = out[-OUTPUT_TAIL:]
        sys.stderr.write(
            "[X] {0} FAILED ({1} in {2}).\n"
            "Fix the issue below before continuing, then re-check.\n\n{3}\n".format(
                label, os.path.basename(file_path), subroot.name, tail))
        sys.exit(2)
    sys.exit(0)


if __name__ == "__main__":
    main()
