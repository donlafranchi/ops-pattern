---
purpose: Provenance for the retired OPEN-QUESTIONS.md PM-queue file.
layer: how
status: retired
retired_on: 2026-05-30
retired_from: planning/OPEN-QUESTIONS.md
---

# Retired — OPEN-QUESTIONS.md PM-decision queue

`planning/OPEN-QUESTIONS.md` retired 2026-05-30 by `planning/done/reorg-11-drain-open-questions.md`. Under the new flow — *new tickets go to `_inbox/` → planning kanban (`proposed/` / `next/` / `now/` / `later/` / `done/`) → `playbooks/` as long-term pattern* — there is no parallel PM-queue doc. Decision-bearing items become kanban entries; mechanical PM-only tasks execute directly.

## Disposition of the 7 live entries

| # | Entry | Disposition | Where it landed |
|---|---|---|---|
| 1 | Resolve F018 (flagship walkthrough decision) | Promoted to kanban | [`planning/proposed/F018-flagship-decision.md`](../../proposed/F018-flagship-decision.md) — `route: scope` |
| 2 | `web/BUILD-LOG.md` prose cleanup | PM-mechanical, web repo | Executes inline next time PM works in `web/` — not tracked in parent kanban |
| 3 | Web-side cleanups (`evals/features/` graveyard + shared sandbox harness) | Mixed | Graveyard clear is PM-mechanical in web; shared sandbox harness becomes a web substrate ticket whenever Phase 2 substrate work resumes — not tracked in parent kanban |
| 4 | Remove stale worktrees | PM-mechanical, outside repo | PM runs `git worktree remove` from `/Users/don/Projects/mainstreetmarket` for the named prunable worktrees — not tracked in parent kanban |
| 5 | Global skill-symlink cleanup | Verified clean 2026-05-30 | Symlinks for `pipeline-clarify-absolutes` / `pipeline-review-absolute` do not exist in `~/.claude/skills/` — already gone |
| 6 | Backfill T055/T056/T057 commit hashes | Done 2026-05-30 by reorg-07 | Hashes backfilled inline (web + parent) in the three ticket files in `development/tickets/done/` |
| 7 | First DEVIATIONS rotation | Done 2026-05-30 by reorg-08 | Phase 1 entries rotated to `development/archive/DEVIATIONS-phase-1.md`; live file reset for Phase 2 |

## Sources

The original file [`OPEN-QUESTIONS.md`](OPEN-QUESTIONS.md) is preserved here for historical trace. The audit references it cites (`pipeline-process-audit-2026-05-22.md` R1/R6/R7/R8 + H4/H6 + E1/E2/E3/E4/E5/E8) are at `_attic/2026-05-27/2026-05-23-pipeline-coverage/`.
