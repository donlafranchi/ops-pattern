---
purpose: Home for project-shaping efforts — reorgs, consolidations, audits, pivots. In-flight only; archived to `_attic/` on close.
layer: how
status: active
---

# Housekeeping

This folder holds **project-shaping work** — reorganizations, consolidations, audits, pivots. The work that reshapes *how the project is organized*, as distinct from the platform work itself.

When a cleanup is in flight, its planning docs and tickets live here. **When it closes, the whole folder moves to `_attic/{close-date}/{slug}/`.** `housekeeping/` itself only contains in-flight efforts.

## Pattern for a new effort

1. Create `housekeeping/YYYY-MM-DD-{slug}/` (ISO date prefix is load-bearing for sort order).
2. Inside: a `README.md` with `purpose / layer / status` frontmatter (status starts `in-flight`), a plan, and any `tickets/` it produces.
3. When done, flip status to `complete`, then archive: `git mv housekeeping/YYYY-MM-DD-{slug} _attic/{close-date}/{slug}` — leaves a clean tree.

Closed efforts that lived here previously are now under `_attic/2026-05-27/` (the 2026-05-23 pipeline-coverage absorption and the 2026-05 doc consolidation). The pattern is fixed; future cleanups follow the same shape.

## In-flight

*(none)*

## What does NOT belong here

- Process docs about how to build any project (those go under [`meta/`](../meta/)).
- Architectural decisions (those are ADRs in [`planning/adrs/`](../planning/adrs/)).
- Active spec edits (those go in `product/` / `planning/` directly).
