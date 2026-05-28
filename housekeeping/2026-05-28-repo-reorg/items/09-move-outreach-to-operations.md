---
purpose: Reorg item — move planning/outreach/ → operations/ (it's operational, not planning).
layer: how
status: stub
---

# Reorg Item 9 — Move `planning/outreach/` → `operations/`

## What this is

`planning/outreach/outreach-list.md` is a list of potential users to recruit. That's operational (getting users in the app), not planning (deciding what to build).

## Actions

- `git mv planning/outreach/outreach-list.md operations/outreach-list.md`
- Delete `planning/outreach/` (empty after move).
- Update REGISTRY.md entry (path change).
- Update any back-references (likely few; this is a recruiter list, not a frequently cross-cited doc).

## Side effects

- `operations/` already exists with `DEPLOY.md`. Outreach fits there alongside other run-the-app artifacts.

## Risk

Low. Mechanical move.

## Advance this by

1. PM ratifies.
2. `git mv` + delete empty dir.
3. Update REGISTRY.md.
4. Commit as `docs(reorg): move outreach-list from planning/ to operations/`.

## Source

Reorg-plan.md §9.
