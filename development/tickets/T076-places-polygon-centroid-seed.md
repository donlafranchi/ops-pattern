# T076: Sacramento-region Places — polygon + centroid seed

> **Renumbered 2026-06-02:** was `T075` (collided with `T075-member-business-jurisdictions-substrate`); renumbered to **T076**. Both still draft a `024_*` migration — the second to build rebases off `025_*`+.

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, polygon-library backfill)
**Depends on:** T058 (places table), T066 (county tier + URL compression), T059 (reverse-geocoder)

**Serves:**
- **Spec:** [`product/systems/places.md`](../../product/systems/places.md) § T1 — MVP Tier (polygon library), § Reverse-geocoder fallback, § Open questions — *Polygon source-of-truth and licensing* (resolves the b1 working answer for the launch market).
- **Patterns:** [`playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) — ADR-0020 (locality-scoped URLs, platform-curated places), ADR-0022 (county tier, region for colloquial groupings).
- **Use cases:** [`product/needs/use-cases.md`](../../product/needs/use-cases.md) — C1 (newcomer locality feed), O3 (Concerts in the Park across the Sacramento MSA), P4 (Maya at Oak Park Sourdough).
- **Greens half of:** [`web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts:266`](../../web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts) — the polygon-seed prerequisite for the locality-step path (the other half is the `member_business_jurisdictions` write).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main (schema + seed-data change).
- [ ] **DEVIATIONS.md entry** appended at close — minimum the one-line "no deviations."

## Acceptance Criteria

- [ ] New migration `web/supabase/migrations/024_places_polygon_centroid_seed.sql`.
- [ ] Schema: add `centroid geography(Point, 4326) null` to `public.places`. Btree-on-GiST index `idx_places_centroid` on `centroid` (predicate `WHERE centroid IS NOT NULL AND deleted_at IS NULL`).
  _Why: places.md § Reverse-geocoder mentions centroid-distance tiebreaks on boundary cases (`metadata.geocode_diagnostic`). Storing the centroid avoids `ST_Centroid(geography)` on every nearest-neighbor query and lets the index serve KNN. Polygon stays the source-of-truth; centroid is derived at seed/update time._
- [ ] Backfill: every existing `places` row with a non-null `geography` gets `centroid = ST_Centroid(geography::geometry)::geography`.
- [ ] **Seed — region row.** Add `Sacramento MSA` as `kind='region'`, parent=California (state). Slug `sacramento-msa`. Polygon: union of the four-county MSA per Census 2023 CBSA (Sacramento, Placer, Yolo, El Dorado).
  _Why: ADR-0022 — "Greater Sacramento" is a `region` row that **groups** counties; it is **not** part of the parent_id walk for cities below it. Honors the audit-trail's request for an "MSA" anchor without violating the single-source-of-hierarchy rule in places.md:54._
  _Spec deviation: the user-facing scope said "Oak Park → Sacramento → MSA." Per places.md:54 the authoritative parent walk goes through county, not region — so the encoded chain is Oak Park (neighborhood) → Sacramento (city) → Sacramento County (county) → California (state). Sacramento MSA is a sibling region row. If this drifts from PM intent, flag in DEVIATIONS and route to SPEC-PATCHES._
- [ ] **Seed — Placer County.** Add `Placer County` as `kind='county'`, parent=California. Slug `placer-county`. Polygon from TIGER 2023 county boundaries.
  _Why: required to anchor Roseville (city) under a county per the schema's `kind='city' ⇒ ancestor_state_id NOT NULL` invariant + the cities-under-counties convention from T058._
- [ ] **Seed — cities.** Three new city rows with TIGER 2023 place polygons:
  - `Davis` — slug `davis`, parent=Yolo County.
  - `Roseville` — slug `roseville`, parent=Placer County.
  - `Folsom` — slug `folsom`, parent=Sacramento County.
- [ ] **Backfill polygons.** For every existing city/county already seeded by T058 (California, Sacramento County, Yolo County, Sacramento, West Sacramento) populate `geography` from TIGER 2023. For the five existing Sacramento neighborhoods (Oak Park, Curtis Park, East Sacramento, Midtown, Land Park) populate from the City of Sacramento Open Data neighborhood polygons. Migration computes `centroid` for every backfilled row in the same transaction.
- [ ] Polygon sources documented in the migration header (Census TIGER 2023 LINE files for state/county/CBSA; Census 2023 Places shapefile for incorporated cities; City of Sacramento Open Data for neighborhoods). Header lists exact URLs + retrieval date.
  _Why: ADR-0020 § Curation — every polygon row needs a provenance trail so a future tier-1 admin tool can replay or supersede. Also satisfies places.md § Open questions — *Polygon source-of-truth and licensing* (TIGER + Census Places are public-domain; city open-data terms documented inline)._
- [ ] One `place_events` row per seeded/backfilled place — `event_kind = 'place.created'` for new rows, `'place.updated'` for polygon backfills. `acting_member_id` = `system_member_id`; `correlation_id` = a single UUID per migration so the seed batch can be unwound by correlation.
- [ ] Vitest `tests/places-polygon-seed.test.ts`:
  - Asserts the four new place rows exist with expected (parent slug, slug, kind).
  - Asserts every row named in the AC has a non-null `geography` and a non-null `centroid` whose point lies inside its polygon (`ST_Contains(geography::geometry, centroid::geometry)`).
  - **Parent_id walk verification.** Walks Oak Park → Sacramento → Sacramento County → California by recursive CTE and asserts the chain (length 4, terminating at NULL parent_id). A second assertion walks Folsom and Roseville → their respective counties → California. A third assertion confirms `Sacramento MSA` has `parent_id = California.id` and is **not** referenced as the parent of any city row (the region/grouping invariant).
  - `place_events` row count matches the rows touched, and every row carries the same `correlation_id`.
- [ ] Vitest `tests/places-reverse-geocode.test.ts` extension — adds spot-checks: a lat/lon in downtown Davis resolves to Davis (not Yolo County fallback); a lat/lon in Folsom resolves to Folsom; a lat/lon near the Oak Park / Curtis Park boundary resolves deterministically per the centroid-distance tiebreak in `022_places_reverse_geocode.sql`.
- [ ] `npm run check:action-layer && npm run lint && npm test` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- **No UI.** This is purely substrate. No composer, no admin page, no public surface added. Greens the polygon-seed prerequisite for F036's `:266` locality step but does not implement the locality step itself.
- **Polygon storage strategy.** Embed the polygons inline in the migration as `ST_GeomFromGeoJSON(...)` literals OR as `\copy` from a staged CSV — the build agent picks whichever keeps the migration under ~200KB. If polygons exceed that budget, split into `024a_places_polygon_centroid_schema.sql` + `024b_places_polygon_seed_data.sql` and document the split in the migration header.
- **Centroid invariant.** `ST_Centroid` on a MultiPolygon can fall outside the polygon for concave shapes (rare for civic boundaries, common for islands). For any row where `ST_Contains(geography, ST_Centroid(geography))` is false, use `ST_PointOnSurface` instead and note the substitution in `metadata.centroid_method`.
- **MSA vs region tension.** If the PM later decides the colloquial "Sacramento MSA" should appear as the URL anchor for cross-county browse (e.g. `/p/sacramento-msa`), the region row already exists — the URL plumbing is an ADR-0020 separate decision. This ticket only stores the row.
- **Encodes ratified absolutes:** `product/systems/places.md:30` (platform-curated), `product/systems/places.md:54` (parent_id is the single source of hierarchy), `playbooks/PLATFORM-PATTERNS.md` ADR-0022 (county tier).
- **SPEC-PATCHES candidates** (file at close if surfaced during build): (a) places.md § T1 currently lists "Sacramento County" but not the four-county MSA seed — patch to acknowledge the b1 region row; (b) places.md § Open questions — *Polygon source-of-truth* should move from "deferred" to "resolved: TIGER 2023 + Census Places + City of Sacramento Open Data" once this lands.

## Completion

Date:
Commit:
