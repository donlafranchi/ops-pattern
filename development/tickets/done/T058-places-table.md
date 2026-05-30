# T058: `places` table + launch-locality seed

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, Lane A wave 0)
**Depends on:** —

**Serves:**
- **Spec:** [`product/systems/places.md`](../../product/systems/places.md) § T1 — MVP Tier + § Data model implications.
- **ADRs:** [ADR-0020](../../planning/adrs/ADR-0020-locality-scoped-urls.md) (Accepted 2026-05-23), [ADR-0019](../../planning/adrs/ADR-0019-clean-slate-rebuild.md) (rebuild plan), [ADR-0007](../../planning/adrs/ADR-0007-action-layer.md) (action-layer-only writes), [ADR-0010](../../planning/adrs/ADR-0010-events-from-day-one.md) (event-log invariants).
- **Sprint:** [`planning/bundles/b1.x-substrate-sprint.md`](../../planning/bundles/b1.x-substrate-sprint.md) § A1.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main (schema change).
- [ ] **DEVIATIONS.md entry** appended at close.

## Acceptance Criteria

- [ ] New migration `web/supabase/migrations/017_places.sql`.
- [ ] `public.places` table with columns: `id uuid pk default gen_random_uuid()`, `parent_id uuid null references public.places(id)`, `slug text not null`, `display_name text not null`, `kind text not null check (kind in ('region','state','msa','city','neighborhood'))`, `geography geography(MultiPolygon, 4326) null`, `iso_country_code text null`, `metadata jsonb not null default '{}'::jsonb`, `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()`, `deleted_at timestamptz null`.
  _Why: `MultiPolygon` (not `Polygon`) per places.md § Data model implications — civic boundaries are sometimes multi-polygon (islands, exclaves). Sprint doc says `Polygon`; spec is authoritative — flag this in DEVIATIONS if either side is wrong._
- [ ] `UNIQUE (parent_id, slug)` constraint — and a partial index `UNIQUE (slug) WHERE parent_id IS NULL` to enforce uniqueness at the NULL-parent root.
  _Why: parent-scoped slug uniqueness is the ADR-20 absolute that lets "two Oak Parks" coexist (one in Sacramento, one in Illinois). NULL-parent rows need their own unique constraint because Postgres treats NULLs as distinct under composite UNIQUE._
- [ ] GIST index on `geography` (predicate `WHERE geography IS NOT NULL AND deleted_at IS NULL`).
- [ ] Btree index `(parent_id, kind) WHERE deleted_at IS NULL` for hierarchy walks.
- [ ] RLS enabled. **`places_select_all`** policy: public-read (`USING (true)`). **No INSERT/UPDATE/DELETE policies** — writes via service-role from action layer only.
  _Why: ADR-20 § *Intent annotations* — "Places are platform-curated, not user-created." Public INSERT would let one Member declare their block a city and own the URL namespace. Encodes ratified absolute: `planning/adrs/ADR-0020-locality-scoped-urls.md:173`._
- [ ] `public.place_events` table partitioned monthly per ADR-10 pattern (mirror `item_events` shape from `015_items.sql:374`). `event_kind` CHECK enum: `place.created`, `place.updated`, `place.superseded`, `place.merged`. Audit fields (`acting_member_id`, `acting_user_agent`, `acting_ip`, `correlation_id`) per ADR-7.
- [ ] Seed rows (data-only, in the same migration): California (state, NULL parent), Sacramento–Roseville MSA (parent=California), Sacramento (city, parent=MSA), and the six neighborhoods named in places.md § T1: Oak Park, Curtis Park, East Sacramento, Midtown, West Sacramento, Land Park — each with parent=Sacramento, kind='neighborhood'.
  _Why: B2/F028 cannot insert a `primary_home` against an empty `places` table. Seed is part of A1; not a separate ticket._
- [ ] Vitest: `tests/places-schema.test.ts` — column shape + CHECK enum + the two unique constraints (NULL-parent + (parent_id, slug)) + RLS matrix (anon SELECT yes; anon INSERT rejected; auth INSERT rejected).
- [ ] Vitest: seed rows assertion — exactly 9 seed rows (1 state + 1 msa + 1 city + 6 neighborhoods).
- [ ] `npm run check:action-layer && npm run lint && npm test` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- Migration template: copy the header style + ADR cite block from `011_member_location_affinities.sql:1-26`.
- Postgres extensions: `postgis` already enabled in `001_extensions.sql`. Confirm `pg_trgm` is not required here (slug lookups are exact-match by `(parent_id, slug)`; trigram match is a T2 search concern).
- Soft-delete column is `deleted_at` (places.md § Data model implications) — different from `removed_at` used elsewhere. Mirror places.md vocabulary, not the affinity-table convention.
- Open question (deferred to DEVIATIONS, not this ticket): whether `place_events` ships at this ticket or whether to gate it on the first non-seed write. places.md says event log entries are *required at MVP*. Ship it now to satisfy ADR-10.
- Encodes ratified absolutes: `planning/adrs/ADR-0020-locality-scoped-urls.md:167` (locality-scoped URLs), `:173` (platform-curated), `product/systems/places.md:30` (curation policy block-quote Intent).

## Completion

Date:
Commit:
