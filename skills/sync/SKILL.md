---
id: how-sync-skill
name: sync
description: Reconcile the three progress-tracking surfaces (bundle checklist, monolith STAGE-LEDGER.md, per-file stage-ledger/) against git ground truth. Use when the user says "sync the scoreboard", "sync progress", "update the checklist", "are the tracking docs current", "reconcile the ledger", or after any merge to main. Also fires as the final step of `build` after a successful merge. Reads git log/branch state in web/, the bundle checklist, both stage ledgers, and the active bundle. Writes corrections to all three surfaces — only with PM ratification in standalone mode; automatically in post-build mode.
---

# sync

Reconciles progress-tracking docs against git ground truth. Three surfaces, one pass, zero drift.

## The problem this solves

The project tracks MVP progress in three places: the bundle checklist (human scoreboard), the monolith stage ledger (legacy table), and the per-file stage ledger (canonical per-concept files). These drift apart because `build` commits code but doesn't always update the scoreboard, merges happen without flipping "awaiting merge" to "done," and the per-file and monolith entries fall out of step with each other.

This skill closes that gap by treating git as the single source of truth and correcting all three surfaces to match.

## When to use

- After `build` merges a ticket to main — as the final step, before handing to `test`.
- User asks "sync the scoreboard", "update progress", "are the tracking docs current".
- `orient` flags ledger drift at session start — route here to fix it.
- After a batch of merges (like today's cleanup).

## Two modes

**Post-build mode.** Called by `build` right after a successful merge. Scope is narrow: update the one F-number or substrate group that just shipped. No PM ratification needed — the merge itself was the approval gate. Appends the stage transition to the per-file ledger, updates the monolith row, and checks off the corresponding checklist item if the feature is end-to-end done.

**Standalone mode.** Called directly by the PM. Full reconciliation pass across all active entries. Shows a diff of proposed changes. PM ratifies before writes land.

## Workflow

See [`workflow.md`](workflow.md).

## What counts as "done" for a checklist item

A checklist row gets `[x]` only when all of these are true:
1. The feature's code is merged to `main` in the web repo.
2. Evals are green (or the feature has no eval — substrate-only items check off when merged).
3. The stage ledger per-file shows `done` or will be set to `done` by this pass.

Items that are merged but haven't run evals yet get `[~]` with a note.

## Related skills

- `build` — upstream; calls sync in post-build mode after merge.
- `orient` — upstream; flags drift that routes here.
- `tidy` — sibling; handles doc-tree sprawl while sync handles progress-tracking accuracy.
- `test` — downstream; after sync updates the scoreboard, test runs the evals.

## Hand off

**You produced:** updated `planning/now/bundle-{N}-checklist.md`, updated `planning/STAGE-LEDGER.md`, updated `planning/stage-ledger/{concept}.md`. Commit message: `docs(pipeline): sync progress tracking — {summary}`.

**Next skill:** In post-build mode → `test` (run mode). In standalone mode → none; PM continues.
