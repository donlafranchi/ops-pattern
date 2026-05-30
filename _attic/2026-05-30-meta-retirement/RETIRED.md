---
purpose: Provenance for the retired meta/ top-level dir.
layer: how
status: retired
retired_on: 2026-05-30
retired_from: meta/
---

# Retired — meta/

`meta/` top-level dir retired 2026-05-30 by `planning/done/reorg-04-retire-meta-and-housekeeping.md`. The new flow — *`_inbox/` → planning kanban (`proposed/` / `next/` / `now/` / `later/` / `done/`) → `playbooks/` as long-term pattern* — leaves no role for a parallel `meta/` lane. Process patterns now land directly in `playbooks/`.

## Per-file disposition (per the reorg-04 stub)

- `cowork-pipeline/DECISION-PATTERNS.md` — Already migrated 2026-05-30 to `playbooks/DECISION-PATTERNS.md` before this retirement ran. (Not present in the dir at retirement time — its archive subdir captures the migration trace.)
- `cowork-pipeline/DEV-PATTERN.md` — Already absorbed 2026-05-30 into `playbooks/DEVELOPMENT-PATTERNS.md` § Pipeline patterns + § Pipeline anti-patterns. (Not present in the dir at retirement time — see `cowork-pipeline/archive/2026-05-30-dev-pattern/` for the original.)
- `cowork-pipeline/HANDOFF-TO-CLAUDE-CODE.md` — Historical scaffolding (one-shot prompt that drove the 2026-05-26 skill consolidation). Work done; skills exist. Archived as-is.
- `cowork-pipeline/README.md` — Indexed the other three; auto-stale once they were gone. Archived as-is.
- `cowork-pipeline/archive/2026-05-30-dev-pattern/` — The migration trace for `DEV-PATTERN.md`. Preserved here under `cowork-pipeline/archive/` to keep the local-archive trail.

## Replacement homes

| What it was | Where it lives now |
|---|---|
| Cross-project decision patterns | [`playbooks/DECISION-PATTERNS.md`](../../playbooks/DECISION-PATTERNS.md) |
| Pipeline-shape patterns | [`playbooks/DEVELOPMENT-PATTERNS.md`](../../playbooks/DEVELOPMENT-PATTERNS.md) § Pipeline patterns |
| In-flight process work | `planning/` kanban lanes |
| Dated work products | `_attic/YYYY-MM-DD-{slug}/` (per ADR-25) |
