# T059: Reverse-geocoder service (lat/lon → place_id)

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, Lane A wave 1)
**Depends on:** T058

**Serves:**
- **Spec:** [`product/systems/places.md`](../../product/systems/places.md) § Data model implications → *Reverse-geocoder contract* + § T1 — MVP Tier (Edge-Function bullet).
- **ADRs:** [ADR-0020](../../planning/adrs/ADR-0020-locality-scoped-urls.md) § *Anchoring rules* + § *Costs*.
- **Sprint:** [`planning/bundles/b1x-substrate-sprint.md`](../../planning/bundles/b1x-substrate-sprint.md) § A2.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **DEVIATIONS.md entry** appended at close.

## Acceptance Criteria

- [ ] New module `web/src/lib/places/reverse-geocode.ts` exporting `reverseGeocodeToPlace(lat: number, lon: number): Promise<{ placeId: string; resolvedKind: PlaceKind; source: 'polygon' | 'mapbox' } | null>`.
- [ ] Layer 1 — Postgres-side polygon containment via a SECURITY DEFINER function `public.place_for_coords(lat double precision, lon double precision)` returning `(place_id uuid, kind text)`. Walks `places.geography` with `ST_Contains`; returns the row with the smallest containing polygon (neighborhood beats city beats MSA beats state).
  _Why: containment lookup runs server-side to avoid pulling polygon geometries over the wire. Most-specific-match-wins implemented via `ORDER BY ST_Area(geography) ASC LIMIT 1` over containing matches — the smallest polygon is the most specific._
- [ ] Layer 2 — Mapbox reverse-geocode fallback. Calls `https://api.mapbox.com/geocoding/v5/mapbox.places/{lon},{lat}.json` with `types=neighborhood,locality,place,region` and the `MAPBOX_GEOCODING_TOKEN` env var. Maps the highest-specificity returned admin level to a `places` row by `(parent_id walk, slug match against display_name slugified)`.
  _Why: places.md § Data model implications calls the fallback "brittle" and warns name-matching is heuristic. Restrict matching to slug-of-display-name on the immediate parent so a Mapbox "Curtis Park" resolves to the Sacramento neighborhood, not (hypothetically) a Bay Area Curtis Park._
- [ ] In-memory LRU cache (1k entries, 24h TTL) keyed by `${lat.toFixed(4)},${lon.toFixed(4)}` (10m precision — sufficient for place granularity; pre-quantize the key so neighbors hit the cache).
- [ ] Cache miss + Mapbox fallback returning no usable admin match → returns `null`. Caller decides the disposition.
- [ ] Vitest: `tests/reverse-geocode.test.ts` — (a) a known coordinate inside the seeded Oak Park polygon resolves to Oak Park's `place_id` with `source: 'polygon'`; (b) a coordinate covered only by the seeded Sacramento city polygon (i.e., outside any seeded neighborhood) resolves to Sacramento with `source: 'polygon'`; (c) two calls with the same coordinate yield one Mapbox fetch (cache-hit assertion via mocked fetch); (d) Mapbox 500 → fallback returns null, no throw.
- [ ] Test fixtures: in `tests/fixtures/place-polygons.ts`, supply tiny synthetic polygons for Oak Park + Sacramento + California — *seed via the test setup, not the production migration* (production polygons are deferred to T2 per places.md; the seed migration ships rows without geometry, the test inserts geometry into specific rows for assertion).
  _Why: places.md § T2 — populated polygon library is a T2 deliverable; b1 ships polygon *capacity* but not the polygon *library*. Tests fake the polygons so they can assert containment without blocking on civic GIS sourcing._
- [ ] `npm run check:action-layer && npm run lint && npm test` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- The action-layer Rule-1 credential boundary lets a `src/lib/` module call Supabase only via the `@supabase/ssr` helpers — the reverse-geocoder runs in a server context invoked by action handlers (e.g., a future `member.place_interest.add`). It does **not** call `process.env.SUPABASE_SERVICE_ROLE_KEY` from inside `src/lib/`. Polygon containment runs as the calling Member; the function is SECURITY DEFINER so RLS doesn't matter, but the connection is the session connection.
- Mapbox token: `MAPBOX_GEOCODING_TOKEN` — confirm it's documented in `web/INFRASTRUCTURE.md` (add a line if missing); the existing `NEXT_PUBLIC_MAPBOX_TOKEN` is browser-exposed and should not be reused for server-side geocode billing.
- No new database events fire from this ticket — the geocoder is a read primitive. The first writer that consumes it (B2 `member.place_interest.add` handler) emits its own event.

## Completion

Date:
Commit:
