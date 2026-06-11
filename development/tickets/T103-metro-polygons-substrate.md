---
id: how-t103-metro-polygons-substrate
purpose: Substrate ticket — land `metro_polygons` table (CSA-grain discovery overlay), Census CSA seed for the Sacramento metro, `members.home_metro_id` column + derivation at coordinate-save. Unblocks F031 (place-interest scope — metro-polygon "wider scope" opt-in).
layer: how
status: open
---

# T103 — Metro-polygon discovery overlay + `members.home_metro_id`

**Scenario:** substrate
**Binds to:** `playbooks/PLATFORM-PATTERNS.md` § Layer metro polygons over the place tree as a discovery overlay (D1–D4, all ratified 2026-06-02) · `product/systems/discovery.md` § Community-awareness feed (metro-scope opt-in via `ST_Contains` against `metro_polygons`) · `product/systems/member.md` § Place-interest scope (colloquial-metro scope computed against the `metro_polygons` overlay, not a tree row)
**Status:** Open
**Bundle:** b1 (STAGE-LEDGER row `S-metro`)
**Depends on:** T076 (places polygon + centroid seed — provides seeded place tree + centroid conventions)
**Repo / branch:** web / `t103`

**Serves:**
- **Loop:** 1 + 2 (Discover / Wonder) — gives Members a metro-wide scope option so the community-awareness feed can widen beyond city without manually adding cross-city secondary place-interests.
- **Spec sections:** `discovery.md` § Community-awareness feed — metro-scope opt-in computed against `metro_polygons` via `ST_Contains`; `member.md` § Place-interest scope — "colloquial-metro scope is not a tree row at all — it's computed against the `metro_polygons` discovery overlay"; `PLATFORM-PATTERNS.md` § metro-polygon overlay — D1 (overlay construct), D2 (CSA grain), D3 (polygons own metros, not tree rows), D4 (isochrone deferred to T2).
- **Primitive shape:** `metro_polygons` (platform-curated overlay, adjacent to the place tree) + `members.home_metro_id` (derived FK). No user-created entities; no shell entity.
- **Failure mode this prevents:** F031 cannot be scoped or built until the metro polygon table and the `home_metro_id` derivation exist. Without this substrate, the "wider scope" opt-in has no polygon to widen against.

## Workflow gates

- [x] **M2 — `engineering:code-review`** on the diff before commit. **Verdict: PROCEED** — no required fixes; two non-blocking notes (ST_Contains boundary-exclusive; handler has no live behavioral test, Docker-gated — both inherent to substrate scope).
- [x] **M3 — `design:accessibility-review`** — N/A (no UI in this ticket; F031 owns the surface).
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main (new migration; new table; schema change on `members`). — pending PM merge.
- [x] **DEVIATIONS.md entry** at ticket close — three entries (locality.set path vestigial; approx-bbox polygon; static-shape + SQL contract tests vs live Vitest). Two flag-for-spec-revision → SPEC-PATCHES.

## Acceptance Criteria

### Schema — migration `031_metro_polygons.sql`

- [ ] Create `metro_polygons` table:
  - `id uuid primary key default gen_random_uuid()`
  - `name text not null` — human-readable CSA name, e.g. `'Sacramento-Roseville, CA'`
  - `slug text unique not null` — stable programmatic key, e.g. `'sacramento-roseville-ca'`
    _Why: D1 says metros never appear in URLs, but a slug is still useful for logging, admin tooling, and seed-data idempotency. Unique constraint prevents duplicate metro entries._
  - `csa_code text unique not null` — Census CSA FIPS code, e.g. `'472'` for Sacramento-Roseville
    _Why: D2 ratified CSA grain. The CSA code is the authoritative Census identifier; unique constraint prevents duplicate seeding._
  - `geography geography(Polygon, 4326) not null` — CSA boundary polygon
  - `centroid geography(Point, 4326) not null` — derived from polygon via `ST_Centroid` (or `ST_PointOnSurface` if centroid falls outside polygon, per T076 precedent)
    _Why: centroid enables proximity-ordering when multiple metros are nearby (edge case for future multi-metro markets)._
  - `source text not null default 'Census-CSA-2023'` — provenance string for refresh tracking
  - `metadata jsonb not null default '{}'` — hand-tuning notes, Census vintage, etc.
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`
- [ ] GiST index: `create index idx_metro_polygons_geography on metro_polygons using gist (geography);`
  _Why: `ST_Contains` queries against the polygon are the hot path — feed generation and the `resolve_home_metro` function both hit this index._
- [ ] `alter table members add column home_metro_id uuid references metro_polygons(id) on delete set null;`
- [ ] `create index idx_members_home_metro on members (home_metro_id) where deleted_at is null and home_metro_id is not null;`

### Seed — Sacramento CSA (code 472)

- [ ] Seed one row: the Sacramento-Roseville CSA (code `472`). This CSA comprises six counties — Sacramento, Placer, El Dorado, Yolo, Sutter, Yuba. Source: Census TIGER 2023 CSA boundary shapefile. Polygon stored as `ST_GeomFromGeoJSON(...)` literal in the migration.
  _Why: D2 ratified CSA grain, which is wider than the four-county MSA (CBSA 40900 = Sacramento, Placer, El Dorado, Yolo only). The CSA adds Sutter + Yuba counties — matching how Sacramento-area residents actually think about "the Sacramento metro." This is the launch market polygon._
- [ ] Centroid computed in the same transaction. If `ST_Contains(geography::geometry, ST_Centroid(geography::geometry))` is false, use `ST_PointOnSurface` instead and note the substitution in `metadata.centroid_method` (per T076 precedent).
- [ ] Polygon source documented in migration header comment (Census TIGER 2023 CSA shapefile, exact URL + retrieval date).

### Function — `public.resolve_home_metro(point geography) returns uuid`

- [ ] `STABLE`, `language sql`, `SECURITY INVOKER`.
  _Why: no elevated privileges needed — `metro_polygons` is publicly readable. INVOKER avoids the SECURITY DEFINER audit surface that T075's `zip_is_proximal_to_location` needed (that function joins through RLS-gated tables; this one doesn't)._
- [ ] Returns the `metro_polygons.id` where `ST_Contains(geography, point)` is true. Returns null if no metro contains the point (rural / outside any seeded CSA). Returns null on null input.
- [ ] If multiple polygons contain the point (edge case — CSAs are non-overlapping by Census definition, but defensive against future hand-tuned overlaps): return the smallest by `ST_Area(geography)`.
  _Why: deterministic tiebreak. At national scale with only Census CSAs this never fires, but hand-tuning (D2) could create overlaps._
- [ ] `grant execute on function public.resolve_home_metro to authenticated, anon;`

### Backfill — existing Members

- [ ] Backfill `members.home_metro_id` for all existing Members whose `home_location_id` is not null: join through `locations.geography` and call `resolve_home_metro`. Run in the same migration transaction as the seed so the Sacramento CSA row is available.
  _Why: existing Members who onboarded before this migration get their metro resolved so F031's "wider scope" opt-in works immediately without re-onboarding._

### RLS — `metro_polygons`

- [ ] `alter table metro_polygons enable row level security;`
- [ ] Policy `metro_select_public`: `for select using (true)`. Anonymous + authenticated both readable.
  _Why: metro polygons are a discovery overlay — every user needs to read them for feed generation and the "wider scope" filter (D1). Platform-curated means no client writes._
- [ ] No INSERT / UPDATE / DELETE policies for client roles. All writes are migration-only (platform-curated per D1). Future admin hand-tuning (per D2) uses the service role.

### Handler modification — `member.locality.set`

- [ ] Modify the existing `member.locality.set` action handler: after setting `home_location_id`, resolve `home_metro_id` by calling `resolve_home_metro(location.geography)` and update `members.home_metro_id` in the same transaction.
  _Why: STAGE-LEDGER specifies "home-metro resolution at coordinate-save" as part of S-metro. Keeps derivation in the action layer (per ADR-7) and ensures `home_metro_id` stays in sync without a trigger._
- [ ] If the location has no containing metro (rural), set `home_metro_id = null`.
- [ ] If `home_location_id` is set to null (Member clears locality), set `home_metro_id = null`.

### Tests

- [ ] Vitest `tests/metro-polygons-seed.test.ts`:
  - Sacramento CSA row exists with `csa_code='472'`, non-null geography, non-null centroid.
  - Centroid is inside the polygon (`ST_Contains`).
  - **No `places.kind='region'` row exists for Sacramento** — the D3 invariant (metros live in the overlay, not the tree).
- [ ] Vitest test for `resolve_home_metro`:
  - Point inside Sacramento CSA → returns the metro id.
  - Point outside all seeded CSAs (e.g. NYC coordinates) → returns null.
  - Null input → returns null.
- [ ] Vitest test for handler modification:
  - `member.locality.set` with a Location inside Sacramento CSA → `home_metro_id` populated.
  - `member.locality.set` with a Location outside all metros → `home_metro_id` = null.
- [ ] `npm run check:action-layer && npm run lint && npm test` green.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG.md updated with T103 ship line.
- [ ] STAGE-LEDGER row `S-metro` stamped `building` on start, `built` on commit. F031 row annotated that its substrate gate is closed (do **not** auto-promote out of `planning/backlog/` — PM moves files).

## Notes

- **No UI.** F031 owns the "wider scope" toggle surface. This ticket lands the floor: the table, the seed, the column, the derivation function, and the handler wiring.
- **CSA vs. MSA grain.** T075's `zip_metro_crosswalk` uses CBSA/MSA codes (40900 — four counties) for jurisdiction proximity ("is this ZIP in the same metro as this Location?"). `metro_polygons` uses CSA grain (472 — six counties) for discovery feed widening ("show me what's happening across the whole Sacramento metro"). Different purposes, different grain — the two substrates coexist without conflict.
- **Polygon strategy.** Same approach as T076 — embed as `ST_GeomFromGeoJSON(...)` literal in the migration. CSA polygons are typically simpler than city polygons (fewer vertices), so inline should be fine. If the polygon exceeds ~200KB, split into `031a_metro_polygons_schema.sql` + `031b_metro_polygons_seed.sql`.
- **Hand-tuning (D2).** The spec says metro polygons are "hand-tunable where Census disagrees with how residents think about their metro." At b1, no admin UI ships — hand-tuning is a service-role SQL edit. The `metadata` JSONB column carries notes when hand-tuning occurs. Admin UI is a b2+ concern.
- **Rural fallback.** Per D1: "Rural places have no metro and fall back to radius/isochrone for 'wider than city' scope." This ticket sets `home_metro_id = null` for rural Members. F031 reads the null to decide whether to offer the metro-scope toggle or fall back to radius.
- **Encodes ratified absolutes:**
  - `playbooks/PLATFORM-PATTERNS.md` § metro-polygon overlay — D1 (Ratified 2026-06-02): overlay construct, read-only, never in URLs, never a messaging target, not editable by Members.
  - `playbooks/PLATFORM-PATTERNS.md` § metro-polygon overlay — D2 (Ratified 2026-06-02): CSA grain, Census-sourced, hand-tunable.
  - `playbooks/PLATFORM-PATTERNS.md` § metro-polygon overlay — D3 (Ratified 2026-06-02): colloquial metros belong to `metro_polygons` overlay, not region tree rows.
  - `playbooks/PLATFORM-PATTERNS.md` § metro-polygon overlay — D4 (Deferred until T2; review at isochrone scope): isochrone deferred; radius + metro polygon ship now.
- **What's deliberately deferred:** Isochrone discovery geometry (D4 — T2). National CSA seed (seeds as new metros onboard). Admin hand-tuning UI (b2+). Multiple-metro membership for border-area Members. Metro-level analytics/rollups (T3).

## Completion

Date: 2026-06-11
Commit: {pending PM commit on branch t103}

**Shipped (branch `t103`, worktree `../web-t103`, not merged):**
- Migration `031_metro_polygons.sql` — `metro_polygons` table (CSA grain, D2) + GiST geography index; `public.resolve_home_metro(point geography)` STABLE / SECURITY INVOKER + grants to authenticated/anon; RLS enable + `metro_select_public` public-read, no client writes (D1); `members.home_metro_id` FK (`on delete set null`) + `idx_members_home_metro` partial index; Sacramento-Roseville CSA (code 472) seed with in-transaction centroid derivation (ST_Centroid → ST_PointOnSurface fallback, method in `metadata`); backfill of existing Members from their active `primary_home` Place centroid.
- Handler wiring — `place-interest-add.ts` resolves `home_metro_id` from the new `primary_home` Place's centroid; `place-interest-remove.ts` recomputes (→ null) when the `primary_home` is removed. (Derivation hooks the real `place_interest`→`places.centroid` path, **not** the spec's nonexistent `member.locality.set`/`home_location_id` path — see DEVIATIONS What (1).)
- Tests — `tests/migrations-t103.test.ts` (static-shape: schema, index, RLS, no client writes, function signature/grants/tiebreak, seed, D3 no-region-row, backfill path) + `tests/actions-t103.test.ts` (handler source-shape) + `supabase/tests/resolve_home_metro.sql` (four live-DB contract cases). New tests 27/27 green.

**Verification:**
- `npm test` — new T103 suites 27/27 green; full suite shows only the 6 pre-existing subprocess-spawning CI-enforcement failures (identical on clean main — not introduced by T103).
- `npm run check:action-layer` — OK (284 files, 0 violations).
- `npm run lint` — touched files clean (exit 0); 17 errors are pre-existing on main in unrelated files.
- `npm run build` — TypeScript clean; full `next build` succeeds (with `.env.local` present for prerender).
- `npx tsc --noEmit` — touched files clean; 3 errors pre-existing in unrelated test file.

**Deviations:** 3 (DEVIATIONS.md § T103). 2 flagged to SPEC-PATCHES (`SP-2026-06-11-locality-set-handler-vestigial`, `SP-2026-06-11-metro-csa-fullres-replay`).
