---
purpose: Provenance for the atomized reorg-plan.md (12 items broken into per-item stubs 2026-05-28).
layer: how
status: archived
retired_from: housekeeping/2026-05-28-repo-reorg/reorg-plan.md
---

# reorg-plan.md — atomized 2026-05-28

## What's here

The reorg-plan.md (drafted 2026-05-28) — a 12-item plan to reshape the repo for atomization, archive completed work, and clarify naming.

## Why archived

PM directive: stop carrying half-completed big plans as monolithic docs. Atomize each item so it can be picked up, executed, and archived independently. No "read the big plan to see what's left" — the items themselves ARE what's left.

## Where the 12 items live now

Each item is its own stub in `housekeeping/2026-05-28-repo-reorg/items/`:

| # | Item | Stub |
|---|---|---|
| 1 | Simplify `product/needs/` | `01-simplify-product-needs.md` |
| 2 | Rename `design-philosophy.md` → `community-health-rubric.md` | `02-rename-design-philosophy.md` |
| 3 | Restructure `planning/bundles/` | `03-restructure-planning-bundles.md` |
| 4 | Merge `meta/` + `housekeeping/` | `04-merge-meta-housekeeping.md` |
| 5 | Flag arbitrary metrics | `05-flag-arbitrary-metrics.md` |
| 6 | Move `planning/reviews/` → `planning/adrs/reviews/` | `06-move-reviews-under-adrs.md` |
| 7 | Archive completed items | `07-archive-completed.md` |
| 8 | Atomicity — make everything finishable | `08-atomicity-finishable-docs.md` |
| 9 | Move `planning/outreach/` → `operations/` | `09-move-outreach-to-operations.md` |
| 10 | Rename `JUDGMENT.md` → `AGENT-BOUNDS.md` | `10-rename-judgment-to-agent-bounds.md` |
| 11 | Clean up resolved open questions | `11-clean-resolved-open-questions.md` |
| 12 | YAML `id:` field — stable doc IDs | `12-yaml-doc-ids.md` |

## What survives from the meta-doc

The original reorg-plan also carried:

- **Guiding principle** ("prefer shorter, more specific documents that can be tackled, finished, and moved on from") — already captured in `housekeeping/2026-05-28-repo-reorg/directory-conventions.md` § Principles. Not redundant here.
- **Batch grouping** (4 batches: mechanical moves / content splits / editorial / infrastructure) — preserved in the items/ README as non-binding sequence hints.
- **Execution order** — preserved in the items/ README; each item also names its dependencies.
- **"What this plan does NOT do"** section (does not touch web/, _attic/, skills/, etc.) — applies per-item; mentioned in the relevant stubs where it matters.

## Don't cite this as live

Cite the 12 items in `housekeeping/2026-05-28-repo-reorg/items/` for any reorg work. Cite `housekeeping/2026-05-28-repo-reorg/directory-conventions.md` for target-state directory structure (untouched).

## Companion archive

The `directory-conventions.md` companion stays in place — it's a target-state reference, not a work plan, and the atomization principle does not apply.
