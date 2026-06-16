---
name: auto-deliver
description: Loop-friendly delivery step. Runs the full project test suite; if green, stages logical commits on a feature branch and opens/updates a PR; if red, summarizes the failures so the next loop pass can fix them. Designed to be driven by /loop for hands-off delivery. Use when the user wants to automate test-and-ship for the current working changes.
argument-hint: [optional scope or branch note]
user-invocable: true
allowed-tools: Bash, Read
---

# /auto-deliver

One safe pass of the **test → commit → PR** stage of the pipeline. Built to be
run repeatedly under `/loop` (e.g. `/loop 10m /auto-deliver`) so it advances
delivery a little on each tick and stops cleanly when there is nothing to do.

## Safety rails (never violate)
- **Never commit or push on `main`/`master`.** If the current branch is one of
  these, create a feature branch first (`auto/<short-topic>`).
- **Never `git push --force`** and never rewrite published history.
- **Never delete branches, stash, or `git reset --hard`** — no destructive ops.
- **Do not merge the PR.** Merging to production stays a human gate.
- If the tree is clean (nothing to commit) and the PR is up to date, report
  "nothing to do" and stop — do not create empty commits.

## Procedure
1. **Survey.** `git status --porcelain`, `git branch --show-current`,
   `git log --oneline -5`. If not a git repo, report that and stop.
2. **Branch.** If on `main`/`master`, create/switch to `auto/<topic>` based on
   the changes (use the arg as the topic if given).
3. **Full checks.** Run the test suite via the project's run-checks hook:
   `python3 .claude/hooks/run-checks.py --mode full`.
   - If it exits non-zero (red): summarize the failure concisely, do **not**
     commit, and stop. The next loop pass (or you, now) fixes the code; the
     fast hook plus this gate keep you honest.
4. **Commit.** Green → stage and commit in **logical units** (group related
   files; keep unrelated changes in separate commits) with clear messages.
   End each message with the repo's attribution line if configured.
5. **Push & PR.** Push the feature branch. Open a PR with `gh pr create` (fill
   title/body from the commits + plan), or update the existing PR if one is
   open for this branch.
6. **Report.** Print: branch, what was committed, test status, PR URL (or why
   you stopped). Keep it to a few lines so loop output stays scannable.

## Stopping conditions (so the loop doesn't thrash)
- Nothing to commit and PR current → stop.
- Tests red and unchanged since last pass → report and stop; don't loop on the
  same failure forever.
- Anything ambiguous or destructive → stop and surface it for a human.
