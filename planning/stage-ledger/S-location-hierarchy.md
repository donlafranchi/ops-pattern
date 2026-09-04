---
id: stage-S-location-hierarchy
purpose: Pipeline stage for S-location-hierarchy — geocode once at entry, store place levels on the Item, query the stored levels.
layer: how
status: active
concept_kind: substrate
stage_current: product
last_activity: 2026-09-03
---

# S-location-hierarchy — geocode once, store a hierarchy

**Spec contract:** community-platform.md § Location resolution — geocode once, store a hierarchy (Ratified 2026-09-03); decision-surfaces.md § Location resolution
**Substrate lane** per rebuild-phase rule 14 — no user-facing surface, binds to a spec section rather than a Given/When/Then.

## Scope

1. Store resolved place levels on the Item (hood, city, county, metro, state), written once at creation.
2. Make the stored levels the only proximity query path — nothing computes at read time.
3. Retire `discoverable_items.nearest_location_id` (today the *oldest* attached venue via `order by il.created_at asc limit 1`, migration `034`; migration `033` already routes around it). The hierarchy removes the premise rather than fixing the query.
4. Decide where hood→metro resolution happens — `decision-surfaces.md` open question 8. Decides where the null-metro (rural) case is handled.

**Do not rebuild:** the `places` tree, `locations.place_id` / `place_for_coords()`, `metro_polygons` + `members.home_metro_id` (migration `031`), the community-awareness feed's ancestor traversal. All live.

**Does not change:** `location.md` § What does not ship at b1 defers address normalization with a State-tagged Intent (Ratified 2026-05-23). That deferral stands — this resolves coordinates to a place hierarchy and stands up no normalized-address store.

## Stage history (append-only)

- **2026-09-03** · `product` — scoped by `scope` alongside F048–F053. Not written as a scenario (no surface). Gates F051; recommended b2 per `plan-location-model-sequence.md`. Open: which columns hold the levels, backfill strategy for existing Items, MV + RPC rewrite scope.
