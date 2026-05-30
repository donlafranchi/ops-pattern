---
purpose: Reorg item — restructure planning/bundles/ to support per-bundle and per-sub-bundle atomization.
layer: how
status: parked
parked_on: 2026-05-30
parked_reason: PM signaled directional shift away from bundles toward proposed/next/later/done kanban. The 3a/3c/3d/3e splits assumed bundles stay load-bearing; if the kanban supersedes bundles, this whole item needs re-scoping rather than executing as-drafted.
---

# Reorg Item 3 — Restructure `planning/bundles/`

> **PARKED 2026-05-30.** Re-scope or retire after the bundle → kanban transition lands. Do not execute the splits as-drafted.

## What this is

`planning/bundles/` currently mixes the active bundle's plan + work map + cross-bundle themes + completed sprints. This item proposes per-bundle theme files, splits `b1-primitives-plan.md` by concern, and atomizes the work map by sub-bundle.

## Actions

### 3a. Move completed sprints into `done/`
- `planning/bundles/b1.x-substrate-sprint.md` → `planning/bundles/done/` (Phase 1 substrate complete).
- `planning/bundles/b1.x-spec-drain-sprint.md` → `planning/bundles/done/` (spec drain complete).

### 3b. Move rebuild-plan into bundles (or skip — already archived)
**Status:** SUPERSEDED 2026-05-28. `rebuild-plan.md` was archived to `_attic/2026-05-28-rebuild-plan/`. This sub-item is no-op.

### 3c. Split `bundle-themes.md` (700+ lines spanning b1/b2/b3)
- `planning/bundles/bundle-themes.md` → split into:
  - `b1-themes.md` (b1.0–b1.6 sub-bundle themes; status: active)
  - `b2-themes.md` (b2.0–b2.6; status: reference / planned)
  - `b3-themes.md` (b3.0–b3.5; status: reference / planned)

### 3d. Split `b1-primitives-plan.md` (500+ lines)
- `planning/bundles/b1-primitives-plan.md` → split into:
  - `b1-primitives-plan.md` (scope only — what ships; shrinks to ~150 lines)
  - `b1-deferrals.md` (what was explicitly deferred and why — archivable when b2 opens)

### 3e. Split `b1-primitives-work-map.md` per sub-bundle
- `planning/bundles/b1-primitives-work-map.md` → split into per-sub-bundle files:
  - `planning/bundles/work-maps/b1.0-show-up.md`
  - `planning/bundles/work-maps/b1.1-groups.md`
  - `planning/bundles/work-maps/b1.2-items.md`
  - `planning/bundles/work-maps/b1.3-producer.md`
  - `planning/bundles/work-maps/b1.4-follow.md`
  - `planning/bundles/work-maps/b1.5-thesis.md`
  - `planning/bundles/work-maps/b1.6-stewardship.md`

## Risk

Medium. The splits affect every doc that cross-references `bundle-themes.md`, `b1-primitives-plan.md`, or `b1-primitives-work-map.md`. Plan the grep + bulk-update before executing. The `b1-themes.md` split also affects the F030–F043 scenarios that cite sub-bundle work-map items.

## Advance this by

1. PM ratifies the split structure (3c / 3d / 3e are independent — each can be done separately).
2. Start with 3a (mechanical move of done sprints — zero risk).
3. Then 3c (`bundle-themes.md` split) — touches the most refs; do this in one commit.
4. Then 3d + 3e together — the b1 plan + work-map splits are coupled.
5. Update CLAUDE.md authoritative-docs table after each split.

## Source

Reorg-plan.md §3.
