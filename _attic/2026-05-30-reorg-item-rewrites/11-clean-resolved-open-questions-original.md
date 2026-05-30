---
purpose: Reorg item — clean up OPEN-QUESTIONS.md (resolve 5 mechanical items; keep 3 truly open).
layer: how
status: stub
---

# Reorg Item 11 — Clean up resolved open questions

## What this is

`OPEN-QUESTIONS.md` has 8 items. Five are mechanical (do them, remove the entry); three are truly open (PM decisions still pending).

## Actions

| # | Item | Action |
|---|---|---|
| 1 | F018 re-anchoring | Still open. Keep. (F034 in `scenarios-backlog/` is the natural replacement candidate; PM call.) |
| 2 | BUILD-LOG prose cleanup | Mechanical fix in web repo. **Do it and remove the entry.** |
| 3 | Web-side cleanups | Still open (web repo). Keep. |
| 4 | Remove stale worktrees | **Do it and remove.** Verify worktrees still exist first. |
| 5 | Global skill-symlink cleanup | **Do it and remove.** 30-second task. |
| 6 | Backfill T055/T056/T057 commit hashes | **Do it and remove.** 2-minute edit. |
| 7 | First DEVIATIONS rotation | Phase 1→2 boundary is now. **Do it and remove.** Coordinates with item 8c (DEVIATIONS rotation). |
| 8 | F025 re-anchoring | Item is now N/A — F025 archived 2026-05-28; folded into F032. **Remove the entry** with a one-line note. |

After: 3 items remain (1, 3 plus one of 8's replacements if any). File shrinks from ~126 lines to ~40.

## Side effects

- Item 7 overlaps with reorg item 8c (DEVIATIONS rotation) — execute once and update both pointers.
- Item 8 (F025) is already resolved by the archival earlier this session — just remove the entry.

## Risk

Low. Items 2, 4, 5, 6 are mechanical 5-minute tasks (some in the web repo). Item 7 is a structured rotation. Item 8 is a one-line removal.

## Advance this by

1. PM verifies each item's status (the audit may already be stale).
2. Execute the mechanical items in any order (small ticket each).
3. Update `OPEN-QUESTIONS.md` to remove resolved items.
4. Commit as `docs(reorg): close 5 mechanical OPEN-QUESTIONS items`.

## Related — `pending-ratifications.md`

Same pattern: walk each PENDING item, flip status / trim if the decision has been made elsewhere. Don't keep history of resolved items in the active file. (Not part of this reorg item but worth scheduling alongside.)

## Source

Reorg-plan.md §11.
