---
purpose: Drain planning/OPEN-QUESTIONS.md into the kanban + ops checklist, then retire the file.
layer: how
status: ratified
source: housekeeping/2026-05-28-repo-reorg/items/11-clean-resolved-open-questions.md (original — clean five mechanical entries; PM directional shift 2026-05-30 makes the whole file redundant under the new flow)
risk: low
---

# Drain OPEN-QUESTIONS.md and retire the file

## PM directional context — 2026-05-30

> *"New tickets go to inbox then planning and after implementation end up in playbooks as a pattern."*

Under the new flow, `planning/OPEN-QUESTIONS.md` is the old way of tracking PM-decision queue and PM-only mechanical tasks. The kanban (`planning/proposed/` / `next/` / `later/` / `done/`) replaces it for decision-bearing items; an operations checklist or direct execution covers the mechanical PM-only tasks. The doc itself should go away after its remaining 7 entries are dispositioned.

## Actions

Walk the 7 live entries in [`planning/OPEN-QUESTIONS.md`](../OPEN-QUESTIONS.md) and disposition each:

| # | Entry | Disposition |
|---|---|---|
| 1 | Resolve F018 (flagship walkthrough decision) | **Decision-bearing.** Promote to `planning/proposed/F018-flagship-decision.md` — PM picks (a) re-promote or (b) retire-and-replace. The stub captures both paths from the OPEN-QUESTIONS entry. |
| 2 | `web/BUILD-LOG.md` prose cleanup | **Mechanical, web repo.** PM executes from the web worktree: correct bundle link, delete the four stale prose sections. No kanban entry needed — record the cleanup in the web commit message. |
| 3 | Web-side cleanups (`evals/features/` graveyard + shared sandbox harness) | **Mixed.** The graveyard clear is PM-mechanical in web. The shared sandbox harness is a substrate ticket. Open a web-repo substrate ticket under `development/tickets/` for the harness; PM clears the graveyard inline. |
| 4 | Remove stale worktrees | **PM-mechanical, outside repo.** PM runs `git worktree remove` for `jolly-hermann-31c513` and `laughing-shirley-5b1cc9` after verifying branches. No kanban entry needed. |
| 5 | Global skill-symlink cleanup | **Stale.** The two named skills (`pipeline-clarify-absolutes`, `pipeline-review-absolute`) already collapsed into `weigh`. Verify the symlinks are gone (`ls -la ~/.claude/skills/`); if anything stale remains, `rm -f` it. |
| 6 | Backfill T055/T056/T057 commit hashes | **Mechanical.** PM (or `build`) edits the three ticket files in `development/tickets/done/` with the hashes already listed in the OPEN-QUESTIONS entry. ~2 minutes. |
| 7 | First DEVIATIONS rotation | **Superseded.** Now owned by [`planning/next/reorg-08-deviations-rotation.md`](reorg-08-deviations-rotation.md). Delete this row from OPEN-QUESTIONS. |

## Retirement

After all 7 entries are dispositioned (entries removed or moved to kanban/tickets):

1. Archive `planning/OPEN-QUESTIONS.md` to `planning/archive/2026-MM-DD-open-questions-retired/` with a `RETIRED.md` pointer to the kanban + ops conventions that replace it.
2. Update `CLAUDE.md`'s authoritative-docs table — remove the OPEN-QUESTIONS row.
3. Update `orient`'s drift check — drop the OPEN-QUESTIONS staleness scan.
4. Update `AGENTS.md` if it references OPEN-QUESTIONS as a routing input.

## Side effects

- One new kanban entry in `planning/proposed/F018-flagship-decision.md`.
- Possibly one new substrate ticket in `development/tickets/` for the shared sandbox harness (item #3 partial).
- CLAUDE.md, AGENTS.md, and `orient` drift check shrink.

## Risk

Low. Each entry's disposition is independent; the retirement is the last step after the dispositions land.

## Source

Housekeeping reorg item 11. PM's 2026-05-30 directional statement reframed the scope: not "clean up 5 of 8" but "drain the doc and retire it under the new flow."
