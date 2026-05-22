> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T029 — Locations schema (008_locations.sql)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** T028
**Status:** open

## Goal

Create the `locations` table with PostGIS support. Locations are places; they have no members — that distinction is the structural anti-Nextdoor stance. Additive only.

## Migration

### `web/supabase/migrations/008_locations.sql`

```sql
create extension if not exists postgis;

create table public.locations (
  id                 uuid primary key default gen_random_uuid(),
  member_id          uuid not null references public.members(id) on delete cascade,
  kind               text not null check (kind in ('permanent', 'recurring_temporary', 'area')),
  label              text not null,
  slug               text unique not null,
  description        text,
  lat                numeric,
  lng                numeric,
  geography          geography(Point, 4326),  -- computed from lat/lng
  polygon            geography(Polygon, 4326), -- for area kind
  schedule_metadata  jsonb not null default '{}',
  qr_code_url        text,
  deleted_at         timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- no community_id — locations have no members (structural constraint)

create index on public.locations using gist (geography);
create index on public.locations (member_id);
create index on public.locations (kind);
create index on public.locations (slug);
create index on public.locations (deleted_at);

create trigger set_updated_at
  before update on public.locations
  for each row execute function update_updated_at_column();

alter table public.locations enable row level security;

create policy "locations_public_read" on public.locations
  for select using (deleted_at is null);

create policy "locations_owner_write" on public.locations
  for all using (
    member_id in (
      select id from public.members where auth_user_id = auth.uid()
    )
  );
```

## Acceptance Criteria

- [ ] PostGIS extension enabled
- [ ] Table has: id, member_id, kind, label, slug, description, lat, lng, geography, polygon, schedule_metadata, qr_code_url, deleted_at, created_at, updated_at
- [ ] No `community_id` column — locations have no members
- [ ] GIST index on `geography` for proximity queries
- [ ] `kind` check constraint covers exactly: permanent, recurring_temporary, area
- [ ] RLS: public read for non-deleted rows; owner full access
- [ ] `geography` populated from lat/lng on insert/update (DB trigger or app-layer utility — document which)
- [ ] `supabase db push` applies cleanly
- [ ] Vitest unit test: insert a permanent and an area location; assert geography populated; assert proximity query returns permanent location within 1 km
- [ ] Integration test: insert through app-layer utility, confirm row visible to anon

## Implementation Notes

`geography` trigger: on insert/update set `geography = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography`. Implement as a DB trigger (preferred for defensiveness) or in the app-layer insert utility.

`schedule_metadata` structure: `{ days: ['sat','sun'], start_time: '08:00', end_time: '13:00' }` — consistent with how recurring_temporary locations are queried in the locality index.

`polygon` is for area Locations (service radius, neighborhood boundary). Use `ST_Contains(polygon, ST_SetSRID(ST_MakePoint(lng, lat), 4326))` for area-inclusion queries against service Items.

## Completion

Date:
Commit:
