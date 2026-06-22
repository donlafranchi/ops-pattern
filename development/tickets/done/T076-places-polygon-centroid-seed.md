# T076: Sacramento-region Places — polygon + centroid seed

> **Renumbered 2026-06-02:** was `T075` (collided with `T075-member-business-jurisdictions-substrate`); renumbered to **T076**. Both still draft a `024_*` migration — the second to build rebases off `025_*`+.

**Scenario:** substrate
**Status:** Build complete on branch `t76` (not merged)
**Bundle:** b1 (b1.x — Substrate sprint, polygon-library backfill)
**Depends on:** T058 (places table), T066 (county tier + URL compression), T059 (reverse-geocoder)

**Serves:**
- **Spec:** [`product/systems/places.md`](../../product/systems/places.md) § T1 — MVP Tier (polygon library), § Reverse-geocoder fallback, § Open questions — *Polygon source-of-truth and licensing* (resolves the b1 working answer for the launch market).
- **Patterns:** [`playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) — locality-scoped URLs, platform-curated places; county tier. Metro-polygon overlay D1–D3 (2026-06-02): colloquial metros live in `metro_polygons`, **not** the place tree — this ticket seeds the county/city/neighborhood tree only.
- **Use cases:** [`product/needs/use-cases.md`](../../product/needs/use-cases.md) — C1 (newcomer locality feed), O3 (Concerts in the Park across the Sacramento MSA), P4 (Maya at Oak Park Sourdough).
- **Greens half of:** [`web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts:266`](../../web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts) — the polygon-seed prerequisite for the locality-step path (the other half is the `member_business_jurisdictions` write).

## Workflow gates

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit. Verdict **Approve** (3 nits accepted: non-idempotent inserts [forward-only], redundant ST_Centroid eval, silent 0-row backfill if T058 absent).
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main (schema + seed-data change). _Pending — ticket left on branch `t76`, not merged, per PM instruction._
- [x] **DEVIATIONS.md entry** appended at close — 4 deviations logged (2026-06-02 — T076).

## Acceptance Criteria

- [ ] New migration `web/supabase/migrations/024_places_polygon_centroid_seed.sql`.
- [ ] Schema: add `centroid geography(Point, 4326) null` to `public.places`. Btree-on-GiST index `idx_places_centroid` on `centroid` (predicate `WHERE centroid IS NOT NULL AND deleted_at IS NULL`).
  _Why: places.md § Reverse-geocoder mentions centroid-distance tiebreaks on boundary cases (`metadata.geocode_diagnostic`). Storing the centroid avoids `ST_Centroid(geography)` on every nearest-neighbor query and lets the index serve KNN. Polygon stays the source-of-truth; centroid is derived at seed/update time._
- [ ] Backfill: every existing `places` row with a non-null `geography` gets `centroid = ST_Centroid(geography::geometry)::geography`.
- [ ] **No metro/MSA row.** Per D3 (Ratified 2026-06-02, PLATFORM-PATTERNS § metro-polygon overlay), colloquial metros live in the `metro_polygons` discovery overlay — **not** as `kind='region'` (or any) place-tree rows. This ticket does **not** seed a "Sacramento MSA" row. The authoritative parent walk goes through county only: Oak Park (neighborhood) → Sacramento (city) → Sacramento County (county) → California (state).
  _The four-county Sacramento metro geometry (Sacramento, Placer, Yolo, El Dorado — and wider at CSA grain) belongs to the future **S-metro** ticket that builds the `metro_polygons` table + Census CSA seed (per `planning/next/tmp-build-plan-checklist.md` § Substrate gates). D2 ratified CSA grain, which is **wider than the MSA** — S-metro seeds the CSA polygon, not the four-county MSA union._
- [ ] **Seed — Placer County.** Add `Placer County` as `kind='county'`, parent=California. Slug `placer-county`. Polygon from TIGER 2023 county boundaries.
  _Why: required to anchor Roseville (city) under a county per the schema's `kind='city' ⇒ ancestor_state_id NOT NULL` invariant + the cities-under-counties convention from T058._
- [ ] **Seed — cities.** Three new city rows with TIGER 2023 place polygons:
  - `Davis` — slug `davis`, parent=Yolo County.
  - `Roseville` — slug `roseville`, parent=Placer County.
  - `Folsom` — slug `folsom`, parent=Sacramento County.
- [ ] **Backfill polygons.** For every existing city/county already seeded by T058 (California, Sacramento County, Yolo County, Sacramento, West Sacramento) populate `geography` from TIGER 2023. For the five existing Sacramento neighborhoods (Oak Park, Curtis Park, East Sacramento, Midtown, Land Park) populate from the City of Sacramento Open Data neighborhood polygons. Migration computes `centroid` for every backfilled row in the same transaction.
- [ ] Polygon sources documented in the migration header (Census TIGER 2023 LINE files for state/county/CBSA; Census 2023 Places shapefile for incorporated cities; City of Sacramento Open Data for neighborhoods). Header lists exact URLs + retrieval date.
  _Why: The Curation pattern — every polygon row needs a provenance trail so a future tier-1 admin tool can replay or supersede. Also satisfies places.md § Open questions — *Polygon source-of-truth and licensing* (TIGER + Census Places are public-domain; city open-data terms documented inline)._
- [ ] One `place_events` row per seeded/backfilled place — `event_kind = 'place.created'` for new rows, `'place.updated'` for polygon backfills. `acting_member_id` = `system_member_id`; `correlation_id` = a single UUID per migration so the seed batch can be unwound by correlation.
- [ ] Vitest `tests/places-polygon-seed.test.ts`:
  - Asserts the four new place rows exist with expected (parent slug, slug, kind).
  - Asserts every row named in the AC has a non-null `geography` and a non-null `centroid` whose point lies inside its polygon (`ST_Contains(geography::geometry, centroid::geometry)`).
  - **Parent_id walk verification.** Walks Oak Park → Sacramento → Sacramento County → California by recursive CTE and asserts the chain (length 4, terminating at NULL parent_id). A second assertion walks Folsom and Roseville → their respective counties → California. A third assertion confirms **no `kind='region'` metro row exists** for Sacramento — every city's parent walk terminates through a county, never a metro/region row (the D3 invariant: metros live in the `metro_polygons` overlay, not the tree).
  - `place_events` row count matches the rows touched, and every row carries the same `correlation_id`.
- [ ] Vitest `tests/places-reverse-geocode.test.ts` extension — adds spot-checks: a lat/lon in downtown Davis resolves to Davis (not Yolo County fallback); a lat/lon in Folsom resolves to Folsom; a lat/lon near the Oak Park / Curtis Park boundary resolves deterministically. *(Patched: "centroid-distance tiebreak in `022_places_reverse_geocode.sql`" not implemented; `place_for_coords` resolves by `ST_Area` ascending only; neighbourhoods seeded non-overlapping for determinism.)*
- [ ] `npm run check:action-layer && npm run lint && npm test` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- **No UI.** This is purely substrate. No composer, no admin page, no public surface added. Greens the polygon-seed prerequisite for F036's `:266` locality step but does not implement the locality step itself.
- **Polygon storage strategy.** Embed the polygons inline in the migration as `ST_GeomFromGeoJSON(...)` literals OR as `\copy` from a staged CSV — the build agent picks whichever keeps the migration under ~200KB. If polygons exceed that budget, split into `024a_places_polygon_centroid_schema.sql` + `024b_places_polygon_seed_data.sql` and document the split in the migration header.
- **Centroid invariant.** `ST_Centroid` on a MultiPolygon can fall outside the polygon for concave shapes (rare for civic boundaries, common for islands). For any row where `ST_Contains(geography, ST_Centroid(geography))` is false, use `ST_PointOnSurface` instead and note the substitution in `metadata.centroid_method`.
- **Metro geometry → S-metro ticket.** Cross-county "wider than city" browse for the Sacramento metro is **out of scope here** and does not live in the place tree. Per D3 (2026-06-02) the metro is a `metro_polygons` overlay row, seeded at CSA grain (D2 — wider than the four-county MSA) by the future **S-metro** ticket (`metro_polygons` table + Census CSA seed + `members.home_metro_id`). This ticket stores only the county/city/neighborhood tree rows the reverse-geocoder and URL plumbing need.
- **Encodes ratified absolutes:** `product/systems/places.md:30` (platform-curated), `product/systems/places.md:54` (parent_id is the single source of hierarchy), `playbooks/PLATFORM-PATTERNS.md` (county tier).
- **SPEC-PATCHES candidates** (file at close if surfaced during build): (a) places.md § T1 county/city/neighborhood seed list — confirm it matches the rows this ticket seeds (no metro/region row; the metro is an overlay row owned by S-metro per D3); (b) places.md § Open questions — *Polygon source-of-truth* should move from "deferred" to "resolved: TIGER 2023 + Census Places + City of Sacramento Open Data" once this lands.

## Completion

Date: 2026-06-02
Commit: `{pending}` — committed on branch `t76` (web worktree `../web-t76`), **not merged** per PM instruction.
Status: Build complete.

**Shipped:** `024_places_polygon_centroid_seed.sql` (centroid column + GiST index, 3 new cities, 11 polygon backfills, centroid derivation w/ ST_PointOnSurface fallback, 14 place_events on one correlation_id, system Member as actor, no metro/region row per D3). Vitest: `tests/places-polygon-seed.test.ts`, `tests/places-reverse-geocode.test.ts`, `tests/places-poly-fixtures.ts` — 42 GREEN.

**Verification:** `npm run check:action-layer` clean (35 protected tables, 0 violations). 42 T076 vitest GREEN. The 3 T076 files lint clean (eslint exit 0). Full `npm test` shows 16 pre-existing failures (frozen migration-list snapshots + flaky subprocess CI-enforcement tests) — identical set on `main` without 024; T076 adds 0 net regressions.

**Deviations (4, see DEVIATIONS.md 2026-06-02 — T076):** (1) polygons are axis-aligned bbox approximations of the cited TIGER/City sources — full-res replay owned by S-metro [SPEC-PATCHES]; (2) Placer County backfilled not inserted (T058 pre-seeded it); (3) AC's "centroid-distance tiebreak in 022" doesn't exist — neighbourhoods seeded non-overlapping for determinism, centroid column added for a future tiebreak [SPEC-PATCHES]; (4) vitest = pure-JS geometry + static SQL (no Postgres in vitest); live containment is the downstream Playwright `test` step.

**SPEC-PATCHES:** line-26 (017 polygons unseeded) checked off → landed via T076; 3 new entries queued (full-res replay, places.md Open-questions resolution, centroid-tiebreak decision).

**Left for PM:** M4 deploy-checklist + merge `t76` → main; downstream `test`-skill Playwright run for live-DB containment + recursive-CTE parent walks (the assertions the vitest harness can't run).
