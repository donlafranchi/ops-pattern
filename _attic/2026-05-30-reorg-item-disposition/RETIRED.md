---
purpose: Provenance for the 2026-05-30 PM-disposition pass over the reorg items.
layer: how
status: retired
retired_on: 2026-05-30
---

# Retired — 2026-05-30 reorg-item dispositions

PM reviewed the 12 reorg items in `housekeeping/2026-05-28-repo-reorg/items/` and dispositioned them. This dir holds items that were neither promoted to `planning/next/` nor parked to `planning/later/` — items that were already done or had been superseded.

- `06-move-reviews-under-adrs-STALE.md` — Stale. The repo is no longer capturing ADRs (patterns land in `playbooks/` per the 2026-05-30 migration). The `planning/adrs/reviews/` target dir is no longer the right home; the planning/reviews/ source was largely drained by the 2026-05-30 archive sweep (`planning/archive/2026-05-30-intent-reviews/`).
- `09-move-outreach-to-operations-DONE.md` — Done 2026-05-30; `planning/outreach/outreach-list.md` moved to `operations/outreach-list.md`.
- `10-rename-judgment-to-agent-bounds-DONE.md` — Done 2026-05-30; `planning/JUDGMENT.md` renamed to `planning/AGENT-BOUNDS.md`.

Other dispositions from the same pass:
- Items **1, 2, 7, 8** → `planning/next/` (approved as-stub).
- Items **4, 5** → `planning/next/` (rewritten — see [`_attic/2026-05-30-reorg-item-rewrites/`](../2026-05-30-reorg-item-rewrites/) for originals).
- Item **3** → `planning/later/reorg-03-restructure-bundles-pending-pattern-shift.md` (parked pending bundle → kanban shift).
- Items **11, 12** — not addressed in this pass; remain in `housekeeping/2026-05-28-repo-reorg/items/` for later disposition.
