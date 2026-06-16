# automation-kit

A portable skeleton for running Claude Code as an automated **plan → code →
test → deliver** pipeline. Drop it into any repo. Nothing here is tied to a
single project or language — the hook auto-detects the stack.

## What's inside

```
automation-kit/
├── hooks/run-checks.py        # auto-detecting check runner (fast + full modes)
├── templates/
│   ├── SPEC_TEMPLATE.md       # clarify the requirement before coding
│   └── PLAN_TEMPLATE.md       # human-gated, TDD-friendly task list
├── skills/auto-deliver/       # /auto-deliver — loop-friendly test→commit→PR
├── settings.snippet.json      # the PostToolUse hook wiring
├── merge_settings.py          # idempotent settings.json merger
└── install.sh                 # global + per-project installer
```

## The three pieces

| Piece | What it does | When it fires |
|-------|--------------|---------------|
| **Fast hook** | After every `Edit`/`Write`, lints/syntax-checks the one file. Fails → Claude sees it and fixes immediately. | `PostToolUse`, automatic |
| **Plan/Spec templates** | Force a clear spec + a human-approved, checkbox task list before code. | You, in plan mode |
| **/auto-deliver loop** | Runs the full test suite; green → logical commits + PR; red → reports. | `/loop 10m /auto-deliver` |

The hook's two modes are the heart of it: `--mode fast` keeps the inner
edit loop tight and cheap; `--mode full` is the delivery gate. See the exit-code
contract in `hooks/run-checks.py`.

## Install

Both layers, per your setup (`两者都要`):

```bash
# 1) Global: make /auto-deliver + run-checks.py available to ALL projects
./automation-kit/install.sh global

# 2) Per project: wire the fast hook + drop in the templates
./automation-kit/install.sh project /path/to/your/repo   # defaults to $PWD
```

`install project` is **idempotent** — re-running won't duplicate the hook.

## Monorepo mode

Install once at the **repo root** and a single Claude session covers every
subproject. The fast hook walks up from each edited file to its nearest
`package.json`/`tsconfig.json`/`go.mod`/`Cargo.toml` and runs *that* subproject's
tools (its own `node_modules/.bin/eslint`, etc.). The full gate iterates over all
discovered subprojects and aggregates failures into one report. No per-subproject
config needed — front-end and back-end are checked from the same root session.

## Auto-detected stacks

| Marker | Fast (per file) | Full (suite) |
|--------|-----------------|--------------|
| `.py` | `ruff` or `py_compile` | `pytest -q` |
| `.js/.mjs/.cjs` | `node --check` | `npm/pnpm/yarn test` |
| `.ts/.tsx/.jsx` | local `eslint` if present | (npm test) |
| `.go` | `gofmt -l` | `go test ./...` |
| `Cargo.toml` | — | `cargo test` |
| `Makefile` w/ `test:` | — | `make test` |

Unknown stack → the hook exits 0 silently. It never blocks on something it
doesn't understand, so it's safe to leave on everywhere.

## Typical end-to-end flow

1. `claude` in plan mode → fill `SPEC_TEMPLATE.md`, get it reviewed.
2. Turn it into `PLAN_TEMPLATE.md` (checkbox steps). **Human approves.**
3. Implement step by step. The **fast hook** catches breakage as you edit.
4. `/loop 10m /auto-deliver` → tests run, green changes get committed + a PR
   opens. Merging stays a human decision.

## Tuning

- Slow suites? Point the **full** check at a Stop hook instead of every edit,
  or scope `pytest`/`go test` to the affected package inside `run-checks.py`.
- Want type-checking on save for TS? Add a `tsc --noEmit` branch in
  `fast_check()` (note it's whole-project, so weigh the latency).
- Stricter delivery? Edit `skills/auto-deliver/SKILL.md` rails (e.g. require a
  clean `git status` or a passing lint before PR).
