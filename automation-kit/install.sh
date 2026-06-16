#!/usr/bin/env bash
#
# install.sh — set up the automation kit.
#
#   ./install.sh global         Install the /auto-deliver skill + run-checks.py
#                               into ~/.claude so EVERY project can use them.
#   ./install.sh project [dir]  Scaffold the hook, plan/spec templates, and
#                               settings.json wiring into one project
#                               (defaults to the current directory).
#
set -euo pipefail
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-help}"

install_global() {
  mkdir -p "$HOME/.claude/skills/auto-deliver" "$HOME/.claude/hooks"
  cp "$KIT_DIR/skills/auto-deliver/SKILL.md" "$HOME/.claude/skills/auto-deliver/SKILL.md"
  cp "$KIT_DIR/hooks/run-checks.py" "$HOME/.claude/hooks/run-checks.py"
  chmod +x "$HOME/.claude/hooks/run-checks.py"
  echo "[ok] /auto-deliver skill + run-checks.py installed to ~/.claude"
  echo "     The skill is now available in every project via /auto-deliver."
}

install_project() {
  local target="${1:-$PWD}"
  local dest="$target/.claude"
  mkdir -p "$dest/hooks" "$dest/templates"
  cp "$KIT_DIR/hooks/run-checks.py" "$dest/hooks/run-checks.py"
  chmod +x "$dest/hooks/run-checks.py"
  cp "$KIT_DIR/templates/"*.md "$dest/templates/"
  python3 "$KIT_DIR/merge_settings.py" "$KIT_DIR/settings.snippet.json" "$dest/settings.json"
  echo "[ok] scaffolded automation into $dest"
  echo "     - hooks/run-checks.py        (fast per-file checks after each edit)"
  echo "     - templates/PLAN_TEMPLATE.md, SPEC_TEMPLATE.md"
  echo "     - settings.json              (PostToolUse hook wired)"
}

case "$MODE" in
  global)  install_global ;;
  project) install_project "${2:-$PWD}" ;;
  *)
    grep '^#' "$0" | sed 's/^# \{0,1\}//'
    ;;
esac
