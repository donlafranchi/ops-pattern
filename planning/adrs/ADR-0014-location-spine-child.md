# ADR-0014: Location spine + child architecture — three kinds, locked at create, PostGIS on spine

**Status:** Accepted
**Date:** 2026-05-10
**Deciders:** PM
**Scope:** The Location primitive's table architecture and the three-kind enumeration at b1
**Touches:** `product/systems/location.md` (canonical home — long-form text lives here), `product/foundation/primitives.md` (Location is one of three core primitives), `product/systems/member.md` (`home_location_id` references Location; multi-Location affinities live in `member_location_affinities`), `product/systems/item.md` (Item attaches to Location), `product/systems/groups.md` (Group anchors to Location), `web/supabase/migrations/` (Phase 1 spine + child tables)

## Decision

The Location primitive uses a spine + child architecture mirroring [`item.md`](../../product/systems/item.md) and [`groups.md`](../../product/systems/groups.md):

- **Spine:** `public.locations` — id, name, kind, creator-of-record, PostGIS `geography` column (Point for all kinds; for area kinds the Point is the centroid; the polygon lives in the area child table), audit fields.
- **Child tables (one per kind, three at b1):**
  - `location_permanent` — fixed physical place with a single coordinate. Shops, homes, parks, schools.
  - `location_recurring_temporary` — repeating presence at a place (market booths, food-truck stops, recurring gatherings).
  - `location_areas` — polygon-shaped scopes (neighborhoods, service radii, city scopes).

**Kind is locked at create.** A Location does not transition kind. A market that becomes a permanent shop is a *new* Location of kind=permanent; the old Location keeps its history. Same rule as Item and Group kinds.

PostGIS `geography(Point, 4326)` on the spine for all kinds. Polygons for areas live in the area child table; spine carries the centroid. This means every Location has a queryable Point regardless of kind, and area queries can use the polygon when needed.

## Trade-offs

The alternative — one table per kind, no shared spine — was rejected because it would fragment Member↔Location and Item↔Location relationships across three foreign-key targets. Every query asking "what's near this Member?" or "what Items attach to places in this area?" would have to UNION across three tables. The spine collapses that to one query path.

The alternative — single table, kind-discriminator column, kind-specific fields nullable on the spine — was rejected because it would make the schema lie about which fields apply when. A `polygon_geometry` column nullable on the spine would be NULL for permanent and recurring-temporary kinds, present only for area kinds; the schema wouldn't enforce the relationship. Spine + child puts the kind-specific fields in the child table; the schema encodes the relationship.

Locking kind at create was the trade-off most discussed. Allowing transitions would let a market that becomes a shop preserve its identity. Locking prevents the same Location's history from carrying confusing kind-change events; it pushes the "this place is now a permanent shop" use case into a *new* Location with its own history. The cost (identity discontinuity for the rare transition) is judged smaller than the cost (audit-trail and query-shape complexity) of allowing kind transitions.

## Consequences

- `location.md` is the live home for the long-form spec. The spec's Status banner is the user-facing ratification; this ADR is the canonical record.
- Phase 1 of the rebuild plan (`notes/migration-to-primitives.md`) introduces the four tables: `locations` spine + `location_permanent` + `location_recurring_temporary` + `location_areas`.
- Every other primitive's Location reference points at the spine (`location_id uuid references public.locations(id)`). Joins fan out to child tables only when kind-specific fields are needed.
- Member↔Location relationships beyond `home_location_id` live in `member_location_affinities` (six `affinity_kind` values: `lives`, `works`, `plays`, `visits`, `follows`, `liked`). Per ADR-16, those rows are owner-only at the row level. The locality-derivation function (`public.member_is_local_to_location()`) is the only public read path.
- The three-kind enumeration is locked for b1. A fourth kind requires a new ADR or an amendment to this one. Candidates parked: indoor venues with sub-spaces (might collapse into permanent with a sub-venue child), mobile-route Locations (might collapse into recurring-temporary with a route polyline).
- Auto-population from third-party sources (Google Places, OSM) is **out of scope at b1** per the "Not auto-discovered" boundary in `location.md`. Every Location row exists because a Member added it.
- Foreclosure: this ADR forecloses a path where Locations are auto-populated from authoritative sources at b1. Reversible at non-trivial cost (would require a provenance column, dedup logic, and a Member-presence guarantee that survives third-party drift). The foreclosure preserves the deliberate-presence guarantee the rest of the platform inherits.

## Action Items

1. [x] Decision ratified 2026-05-10.
2. [x] `location.md` Status banner is the user-facing ratification.
3. [x] Pointer line in `../DECISIONS.md` pointer index.
4. [x] `member.md`, `item.md`, `groups.md` cross-references updated.
5. [ ] Phase 1 of the rebuild plan implements the four tables (per `notes/migration-to-primitives.md`).
6. [ ] Quarterly check on whether the locked three-kind enumeration is forcing awkward modeling.
