#!/usr/bin/env python3
"""
merge_settings.py <snippet.json> <target settings.json>

Idempotently merges the kit's hook block into a project's settings.json.
Re-running is safe: if a PostToolUse hook already points at run-checks.py we
skip it instead of adding a duplicate. Existing settings are preserved.
"""
import json
import sys
from pathlib import Path


def already_wired(blocks) -> bool:
    for entry in blocks:
        for h in entry.get("hooks", []):
            if "run-checks.py" in h.get("command", ""):
                return True
    return False


def main() -> None:
    snippet_path, target_path = sys.argv[1], sys.argv[2]
    snippet = json.loads(Path(snippet_path).read_text())

    target = {}
    tp = Path(target_path)
    if tp.exists() and tp.read_text().strip():
        target = json.loads(tp.read_text())

    target.setdefault("hooks", {})
    for event, blocks in snippet.get("hooks", {}).items():
        existing = target["hooks"].setdefault(event, [])
        if already_wired(existing):
            print("hook already present for %s; left unchanged" % event)
            continue
        existing.extend(blocks)
        print("added %s hook" % event)

    tp.write_text(json.dumps(target, indent=2) + "\n")


if __name__ == "__main__":
    main()
