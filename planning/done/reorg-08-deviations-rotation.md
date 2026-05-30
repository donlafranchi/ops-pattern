---
purpose: Reorg item — apply the atomicity principle (every doc finishable) to specific biggest offenders.
layer: how
status: stub
---

# Reorg Item 8 — Atomicity (make everything finishable)

## What this is

The atomicity principle ("every doc is finishable; if it can't be marked done and archived, it's too big — split it") applied to specific big docs. Some sub-items overlap with item 3 (planning/bundles/ restructure).

## Actions

### 8a. `rebuild-plan.md` → overview + per-phase files
**Status:** SUPERSEDED 2026-05-28. `rebuild-plan.md` was archived to `_attic/2026-05-28-rebuild-plan/`. Phase 2 work continues via `phase-2-scenario-strategy.md` + F030–F043 scenarios; Phase 3 items split into `planning/phase-3-items/`. This sub-item is no-op.

### 8b. `bundle-themes.md` / `b1-primitives-plan.md` / `b1-primitives-work-map.md` splits
**Status:** OVERLAPS WITH ITEM 3. See [`03-restructure-planning-bundles.md`](03-restructure-planning-bundles.md). This sub-item is no-op (handled there).

### 8c. `DEVIATIONS.md` rotation (611 lines, 49 entries)
- Rotate Phase 1 entries → `development/archive/DEVIATIONS-phase-1.md`.
- Reset live file to empty for Phase 2.
- Pointer at top of live file to the archive.
- Already called out in OPEN-QUESTIONS #7; this reorg is the right moment.

### 8d. `use-cases.md` (474 lines) — watch but don't split yet
- Currently 16 cases. Manageable.
- If it grows past ~20 cases, split by category (consumer / producer / organizer) into three files.
- No action now; just a watchpoint.

### 8e. General rule going forward
- Any doc approaching 300 lines gets examined for splits.
- Any doc spanning multiple bundles, phases, or concerns gets split at those boundaries.
- This rule already lives in `housekeeping/2026-05-28-repo-reorg/directory-conventions.md` § Principles #3. No new artifact needed; just enforce.

## Side effects

- DEVIATIONS rotation: existing build agents read the live file; the rotation must preserve the going-forward log shape so build agents don't need re-instruction.
- `use-cases.md` is referenced by every F### scenario; future splits must update those refs.

## Risk

Low (8a / 8b are no-ops; 8c is a one-time mechanical rotation; 8d is a watchpoint; 8e is policy).

## Advance this by

1. Execute 8c (DEVIATIONS rotation) — likely a 5-minute mechanical task. Coordinate with OPEN-QUESTIONS #7 to dedupe.
2. Confirm 8a / 8b are no-ops (close them out).
3. Track 8d as a watchpoint — no action until growth threshold.
4. Commit 8c as `docs(reorg): rotate DEVIATIONS for Phase 2 boundary`.

## Source

Reorg-plan.md §8.
