---
purpose: Provenance for the retired housekeeping/ top-level dir.
layer: how
status: retired
retired_on: 2026-05-30
retired_from: housekeeping/
---

# Retired — housekeeping/

`housekeeping/` top-level dir retired 2026-05-30 by `planning/done/reorg-04-retire-meta-and-housekeeping.md`. Under the new flow (`_inbox/` → planning kanban → `playbooks/`), dated work-products go directly to `_attic/YYYY-MM-DD-{slug}/` (per ADR-25); in-flight project-shaping work lives in the planning kanban; ratified patterns live in `playbooks/`. No parallel `housekeeping/` lane.

## What landed here

- `housekeeping-README.md` — the original top-level README. Its "What does NOT belong here" list referenced `meta/` and `planning/adrs/` — both retired or frozen.
- `2026-05-28-repo-reorg/` — the in-flight reorg whose 12 items were dispositioned 2026-05-30 and either promoted to kanban or archived. The README inside lists every item's landing path.

## Per-item disposition (recap from `2026-05-28-repo-reorg/items/README.md`)

| # | Item | Landed at |
|---|---|---|
| 1 | Simplify `product/needs/` | Shipped — `planning/done/reorg-01-simplify-product-needs.md` |
| 2 | Rename `design-philosophy.md` → `community-health-rubric.md` | Shipped — `planning/done/reorg-02-rename-design-philosophy.md` |
| 3 | Restructure `planning/bundles/` | Parked — `planning/later/reorg-03-restructure-bundles-pending-pattern-shift.md` |
| 4 | Retire `meta/` + `housekeeping/` | **Shipped by this very retirement** — `planning/done/reorg-04-retire-meta-and-housekeeping.md` |
| 5 | Soft-target arbitrary metrics | Shipped — `planning/done/reorg-05-soft-target-arbitrary-metrics.md` |
| 6 | Move `planning/reviews/` → `planning/adrs/reviews/` | Stale — `_attic/2026-05-30-reorg-item-disposition/06-…-STALE.md` |
| 7 | Archive completed items | Shipped — `planning/done/reorg-07-archive-completed.md` |
| 8 | Atomicity (DEVIATIONS rotation, 8c only) | Shipped — `planning/done/reorg-08-deviations-rotation.md` |
| 9 | Move `planning/outreach/` → `operations/` | Done 2026-05-30 — `_attic/2026-05-30-reorg-item-disposition/09-…-DONE.md` |
| 10 | Rename `JUDGMENT.md` → `AGENT-BOUNDS.md` | Done 2026-05-30 — `_attic/2026-05-30-reorg-item-disposition/10-…-DONE.md` |
| 11 | Drain `OPEN-QUESTIONS.md` and retire | Shipped — `planning/done/reorg-11-drain-open-questions.md` |
| 12 | YAML `id:` field — stable doc IDs | Parked — `planning/later/reorg-12-yaml-doc-ids.md` (auto-flips to `next/` when reorg-04 closes) |

## What replaces this dir

| Old role | New home |
|---|---|
| In-flight project-shaping work | `planning/` kanban (`proposed/` / `next/` / `now/` / `later/`) |
| Dated work-products awaiting close | `_attic/YYYY-MM-DD-{slug}/` directly (per ADR-25) |
| Atomization stubs | `planning/proposed/` (per `atomize` skill) |
