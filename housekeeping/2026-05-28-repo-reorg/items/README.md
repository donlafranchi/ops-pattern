---
purpose: Index for the 12 reorg items extracted from reorg-plan.md (atomized 2026-05-28).
layer: how
status: active
---

# Repo Reorg Items

> **All 12 items dispositioned 2026-05-30.** This dir holds only this README now; items have all moved to `planning/next/`, `planning/later/`, or `_attic/`. The dir wraps up entirely when [`planning/next/reorg-04-retire-meta-and-housekeeping.md`](../../../planning/next/reorg-04-retire-meta-and-housekeeping.md) executes.

## Dispositions (2026-05-30)

| # | Item | Disposition |
|---|---|---|
| 1 | Simplify `product/needs/` | → [`planning/next/reorg-01-simplify-product-needs.md`](../../../planning/next/reorg-01-simplify-product-needs.md) |
| 2 | Rename `design-philosophy.md` → `community-health-rubric.md` | → [`planning/next/reorg-02-rename-design-philosophy.md`](../../../planning/next/reorg-02-rename-design-philosophy.md) |
| 3 | Restructure `planning/bundles/` | **Parked** → [`planning/later/reorg-03-restructure-bundles-pending-pattern-shift.md`](../../../planning/later/reorg-03-restructure-bundles-pending-pattern-shift.md) (bundle → kanban transition pending) |
| 4 | Retire `meta/` + `housekeeping/` (PM-expanded scope) | → [`planning/next/reorg-04-retire-meta-and-housekeeping.md`](../../../planning/next/reorg-04-retire-meta-and-housekeeping.md) |
| 5 | Soft-target arbitrary metrics (PM-softened scope) | → [`planning/next/reorg-05-soft-target-arbitrary-metrics.md`](../../../planning/next/reorg-05-soft-target-arbitrary-metrics.md) |
| 6 | Move `planning/reviews/` → `planning/adrs/reviews/` | **Stale** → [`_attic/2026-05-30-reorg-item-disposition/`](../../../_attic/2026-05-30-reorg-item-disposition/) (no longer capturing ADRs) |
| 7 | Archive completed items | → [`planning/next/reorg-07-archive-completed.md`](../../../planning/next/reorg-07-archive-completed.md) |
| 8 | Atomicity — DEVIATIONS rotation (8c only; 8a/8b no-op) | → [`planning/next/reorg-08-deviations-rotation.md`](../../../planning/next/reorg-08-deviations-rotation.md) |
| 9 | Move `planning/outreach/` → `operations/` | **Done 2026-05-30** → archived |
| 10 | Rename `JUDGMENT.md` → `AGENT-BOUNDS.md` | **Done 2026-05-30** → archived |
| 11 | Drain `OPEN-QUESTIONS.md` and retire (PM-reframed scope) | → [`planning/next/reorg-11-drain-open-questions.md`](../../../planning/next/reorg-11-drain-open-questions.md) |
| 12 | YAML `id:` field — stable doc IDs | **Parked** → [`planning/later/reorg-12-yaml-doc-ids.md`](../../../planning/later/reorg-12-yaml-doc-ids.md) (parked pending structural churn settling) |

Originals of items 4 + 5 (pre-rewrite) preserved at [`_attic/2026-05-30-reorg-item-rewrites/`](../../../_attic/2026-05-30-reorg-item-rewrites/).

---

## Original framing (preserved for context)

12 per-item stubs extracted from [`../reorg-plan.md`](../reorg-plan.md) (now archived). Each item is its own ratify-and-execute artifact. Pick one up, ratify it, execute it, archive it. Independent lifecycles.

## What's here

| # | Item | File | Batch | Risk |
|---|---|---|---|---|
| 1 | Simplify `product/needs/` | [`01-simplify-product-needs.md`](01-simplify-product-needs.md) | 3 | low |
| 2 | Rename `design-philosophy.md` → `community-health-rubric.md` | [`02-rename-design-philosophy.md`](02-rename-design-philosophy.md) | 1 | low |
| 3 | Restructure `planning/bundles/` | [`03-restructure-planning-bundles.md`](03-restructure-planning-bundles.md) | 2 | medium |
| 4 | Merge `meta/` + `housekeeping/` | [`04-merge-meta-housekeeping.md`](04-merge-meta-housekeeping.md) | 1 | low |
| 5 | Flag arbitrary metrics | [`05-flag-arbitrary-metrics.md`](05-flag-arbitrary-metrics.md) | 3 | low |
| 6 | Move `planning/reviews/` → `planning/adrs/reviews/` | [`06-move-reviews-under-adrs.md`](06-move-reviews-under-adrs.md) | 1 | low |
| 7 | Archive completed items | [`07-archive-completed.md`](07-archive-completed.md) | 1 | low |
| 8 | Atomicity — make everything finishable | [`08-atomicity-finishable-docs.md`](08-atomicity-finishable-docs.md) | 2 | medium |
| 9 | Move `planning/outreach/` → `operations/` ✅ done 2026-05-30 | [`09-move-outreach-to-operations.md`](09-move-outreach-to-operations.md) | 1 | low |
| 10 | Rename `JUDGMENT.md` → `AGENT-BOUNDS.md` ✅ done 2026-05-30 | [`10-rename-judgment-to-agent-bounds.md`](10-rename-judgment-to-agent-bounds.md) | 1 | low |
| 11 | Clean up resolved open questions | [`11-clean-resolved-open-questions.md`](11-clean-resolved-open-questions.md) | 3 | low |
| 12 | YAML `id:` field — stable doc IDs | [`12-yaml-doc-ids.md`](12-yaml-doc-ids.md) | 4 | medium |

## Batches

The original reorg plan grouped items into 4 batches (mechanical moves, content splits, editorial, infrastructure). The batches are non-binding now — each item can ship on its own. Use batch tags only as a rough indicator of cohesion + sequence.

## Atomization principle

Each item file carries enough context to ratify and execute independently. The original `reorg-plan.md` had value as a meta-overview but its 12 items are mixed-state (none executed yet) — leaving them inside one doc means the full doc has to be re-read every time. Atomized: each item is one file, picked up + executed + archived independently.

Done items move to `_attic/`; the dir shrinks naturally. When all items archive, this dir itself archives.

## Source

- Original: [`../reorg-plan.md`](../reorg-plan.md) (archived alongside this atomization).
- Companion (target-state reference, untouched): [`../directory-conventions.md`](../directory-conventions.md).
