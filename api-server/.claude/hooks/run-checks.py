#!/usr/bin/env python3
"""
run-checks.py — portable, stack-auto-detecting check runner for Claude Code.

Two modes:
  --mode fast  (default) : quick check of the single file Claude just edited.
                           Wire this as a PostToolUse hook so Claude gets
                           immediate feedback and self-corrects.
  --mode full            : run the whole project's test suite. Use from a Stop
                           hook or the /auto-deliver loop to gate delivery.

Hook contract (how Claude Code reacts to our exit code):
  exit 0  -> checks passed, or nothing to run  -> stay silent
  exit 2  -> checks FAILED -> stderr is fed back to Claude to fix
  other   -> internal error -> shown to the user, non-blocking

No third-party dependencies. Python 3.8+. The whole point is that you drop this
into ANY repo and it figures out what to run by looking at marker files.
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

EDIT_TOOLS = {"Edit", "Write", "MultiEdit", "NotebookEdit"}
OUTPUT_TAIL = 3000  # only feed the tail of noisy logs back to Claude


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
    """Path to a tool installed in the project's node_modules, or None."""
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


def fail(label: str, output: str, scope: str) -> None:
    tail = output[-OUTPUT_TAIL:]
    sys.stderr.write(
        "[X] {label} FAILED ({scope}).\n"
        "Fix the issue below before continuing, then re-check.\n\n"
        "{tail}\n".format(label=label, scope=scope, tail=tail)
    )
    sys.exit(2)


# ---------------------------------------------------------------- fast mode ---
def fast_check(file_path: str, root: Path):
    """Return (label, rc, output) for a quick single-file check, or None."""
    if not file_path:
        return None
    f = Path(file_path)
    if not f.exists():
        return None
    ext = f.suffix.lower()

    if ext == ".py":
        if have("ruff"):
            rc, out = run(["ruff", "check", str(f)], root)
            return ("ruff", rc, out)
        rc, out = run([sys.executable, "-m", "py_compile", str(f)], root)
        return ("py_compile", rc, out)

    if ext in (".js", ".mjs", ".cjs") and have("node"):
        rc, out = run(["node", "--check", str(f)], root)
        return ("node --check", rc, out)

    if ext in (".ts", ".tsx", ".jsx"):
        eslint = local_bin(root, "eslint")
        if eslint:
            rc, out = run([str(eslint), str(f)], root)
            return ("eslint", rc, out)
        prettier = local_bin(root, "prettier")
        if prettier:
            rc, out = run([str(prettier), "--check", str(f)], root)
            return ("prettier --check", rc, out)
        return None  # no local linter -> defer to full-mode typecheck

    if ext == ".go" and have("gofmt"):
        rc, out = run(["gofmt", "-l", str(f)], root)
        # gofmt -l lists files that are NOT formatted; any output == needs fmt
        if out.strip():
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
    """Return (label, rc, output) for the project's test suite, or None."""
    if makefile_has_test(root) and have("make"):
        rc, out = run(["make", "test"], root)
        return ("make test", rc, out)

    if has_npm_test(root):
        pm = package_manager(root)
        rc, out = run([pm, "test"], root)
        return ("{0} test".format(pm), rc, out)

    py_markers = ["pytest.ini", "pyproject.toml", "setup.cfg", "tox.ini"]
    if (any((root / m).exists() for m in py_markers) or (root / "tests").is_dir()) \
            and have("pytest"):
        rc, out = run(["pytest", "-q"], root)
        return ("pytest", rc, out)

    if (root / "go.mod").exists() and have("go"):
        rc, out = run(["go", "test", "./..."], root)
        return ("go test", rc, out)

    if (root / "Cargo.toml").exists() and have("cargo"):
        rc, out = run(["cargo", "test"], root)
        return ("cargo test", rc, out)

    # No unit-test suite, but a typed project? Type-checking is the next-best
    # automated gate — it catches a huge class of breakage on its own.
    if (root / "tsconfig.json").exists():
        tsc = local_bin(root, "tsc")
        if tsc:
            rc, out = run([str(tsc), "--noEmit"], root)
            return ("tsc --noEmit", rc, out)
        if have("npx"):
            rc, out = run(["npx", "--no-install", "tsc", "--noEmit"], root)
            if rc != 127:  # 127 => npx couldn't find tsc; treat as "nothing to run"
                return ("tsc --noEmit", rc, out)

    return None


# --------------------------------------------------------------------- main ---
def main() -> None:
    mode = "fast"
    if "--mode" in sys.argv:
        i = sys.argv.index("--mode")
        if i + 1 < len(sys.argv):
            mode = sys.argv[i + 1]

    root = project_root()
    data = read_hook_input()

    if mode == "full":
        result = full_check(root)
        if result is None:
            sys.exit(0)  # no recognizable test setup -> don't block
        label, rc, out = result
        if rc != 0:
            fail(label, out, "full test suite")
        sys.exit(0)

    # fast mode (default)
    tool_name = data.get("tool_name", "")
    if data and tool_name not in EDIT_TOOLS:
        sys.exit(0)  # only react to edits
    file_path = (data.get("tool_input") or {}).get("file_path", "")
    result = fast_check(file_path, root)
    if result is None:
        sys.exit(0)
    label, rc, out = result
    if rc != 0:
        fail(label, out, "edited file: " + os.path.basename(file_path))
    sys.exit(0)


if __name__ == "__main__":
    main()
