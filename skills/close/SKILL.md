---
id: how-close-skill
name: close
description: Post-merge bookkeeping — move ticket to done, stamp ledger, update checklist, verify branch cleanup. Use when "close T###", "wrap T###", "clean up T###", or after any ticket merge that left paperwork behind. Also handles batch mode — "close all shipped tickets" to reconcile the board.
---

# close

One-pass post-merge cleanup. Handles everything between "code merged" and "ticket closed on the board."

## When to use
- PM says "close T###", "wrap T###", "clean up T###".
- After a merge that left paperwork behind.
- "Close all shipped tickets" — batch mode reconciles every open ticket against main.

## Constraints (hard)
- Does NOT commit — hands PM a commit message + clearlock line (Cowork-side skill).
- Does NOT run tests, modify code, or read backlog/unapproved scenarios.
- Refuses to close a ticket whose branch isn't merged. Build first.
- Reads git history but does not run `git push`, `git rebase`, or any history-rewriting command.

## Workflow
See `workflow.md`.

## Reads
- `development/tickets/` and `development/tickets/done/`
- `development/deviations/T###.md`
- `planning/STAGE-LEDGER.md`
- `planning/stage-ledger/*.md` (per-file ledger)
- `planning/now/bundle-1-checklist.md`
- `planning/now/scenario-F###-*.md` and `planning/now/review-F###.md`
- `web/BUILD-LOG.md`
- git log + branch state in `web/` and parent repo

## Writes
- Moves ticket file to `development/tickets/done/`
- Updates `planning/STAGE-LEDGER.md`
- Updates `planning/now/bundle-1-checklist.md`
- Updates `web/BUILD-LOG.md`
- When all tickets for an F-number are done: moves scenario + review from `planning/now/` to `planning/done/YYYY-MM-DD-f###-{slug}/`

## Does NOT
- Run tests or evals (`test` does that)
- Modify code
- Read `planning/backlog/`
- Commit — hands the PM a clearlock + commit line

## Hand off

**You produced:** ticket moved to done, ledger stamped, checklist updated, BUILD-LOG updated, worktree status flagged. If feature complete: scenario + review archived to `planning/done/`.

**Next skill:** `test` (run mode) if evals haven't run yet. Otherwise, none — ticket is fully closed.

## Related skills
- `build` — upstream; merges the code you're closing out.
- `sync` — sibling; full reconciliation pass. `close` is the single-ticket fast path.
- `test` — downstream; verifies evals after close.
- `orient` — flags stale tickets that route here.
