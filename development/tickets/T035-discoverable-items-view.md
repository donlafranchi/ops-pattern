> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T035 — Discoverable items materialized view (013_discoverable_items.sql)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** T028–T034 (all Phase 1 tables must exist)
**Status:** open

## Goal

Create the `discoverable_items` materialized view — the denormalized read surface for the locality-first index. Anonymous Loop 3 traffic must never touch base tables on the hot path. This view is the boundary.

## Migration

### `web/supabase/migrations/013_discoverable_items.sql`

```sql
create materialized view public.discoverable_items as
select
  i.id,
  i.kind,
  i.title,
  i.description,
  i.state,
  i.brand_label,
  i.category,
  i.member_id,
  i.community_id,
  i.slug,
  i.created_at,
  -- member display fields
  m.display_name  as member_display_name,
  m.slug          as member_slug,
  m.avatar_url    as member_avatar_url,
  -- nearest approved location
  l.id            as location_id,
  l.label         as location_label,
  l.kind          as location_kind,
  l.lat           as location_lat,
  l.lng           as location_lng,
  l.geography     as location_geography,
  l.schedule_metadata as location_schedule_metadata,
  -- response counts
  (select count(*) from public.item_responses r
   where r.item_id = i.id and r.response_kind = 'follow' and r.withdrawn_at is null)
    as follow_count,
  (select count(*) from public.item_responses r
   where r.item_id = i.id and r.response_kind = 'rsvp' and r.withdrawn_at is null)
    as rsvp_count,
  (select count(*) from public.item_responses r
   where r.item_id = i.id and r.response_kind = 'interest' and r.withdrawn_at is null)
    as interest_count,
  -- primary tag
  (select tag from public.item_tags t
   where t.item_id = i.id and t.is_primary = true limit 1)
    as primary_tag,
  -- brand sibling count (for resolve-up)
  (select count(*) - 1 from public.items s
   where s.member_id = i.member_id
     and s.brand_label = i.brand_label
     and s.brand_label is not null
     and s.state = 'active'
     and s.deleted_at is null)
    as brand_sibling_count
from public.items i
join public.members m on m.id = i.member_id and m.deleted_at is null
left join lateral (
  select l.*
  from public.item_locations il
  join public.locations l on l.id = il.location_id
  where il.item_id = i.id
    and il.status = 'approved'
    and l.deleted_at is null
  order by il.display_order asc
  limit 1
) l on true
where i.state = 'active'
  and i.deleted_at is null;

-- required for REFRESH MATERIALIZED VIEW CONCURRENTLY
create unique index on public.discoverable_items (id);

-- proximity queries
create index on public.discoverable_items using gist (location_geography);

-- browse filters
create index on public.discoverable_items (kind, category);
create index on public.discoverable_items (member_id);
create index on public.discoverable_items (brand_label);

-- anonymous read
grant select on public.discoverable_items to anon, authenticated;
```

No RLS on the view (materialized views cannot have RLS in Postgres). Access control is baked into the view definition via `state='active' and deleted_at is null`.

Create a refresh trigger function in `web/src/lib/db.ts` or as a DB function: call `refresh materialized view concurrently public.discoverable_items` after writes to `items`, `members`, `item_locations`, `locations`, `item_responses`, `item_tags`.

## Acceptance Criteria

- [ ] Materialized view created with all columns listed above
- [ ] Unique index on `id` (required for concurrent refresh)
- [ ] GIST index on `location_geography`
- [ ] Composite index on `(kind, category)`
- [ ] `grant select to anon, authenticated` applied
- [ ] No RLS on the view — access control via view definition
- [ ] Refresh utility created; called after writes to underlying tables
- [ ] Vitest unit test: insert a complete Item chain (item + member + location + item_location + item_response + item_tag), call refresh, assert row appears in view with correct denormalized fields
- [ ] Integration test: insert via app-layer utilities, refresh, query as anon user, confirm visible
- [ ] `EXPLAIN (ANALYZE, BUFFERS)` confirms GIST index is used for the proximity query pattern (documented in PR)
- [ ] `supabase db push` applies cleanly

## Implementation Notes

The locality-first index query pattern (used in T042, Phase 4):
```sql
select * from public.discoverable_items
where ST_DWithin(location_geography,
        ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography,
        $radius_meters)
  and ($kinds is null or kind = any($kinds))
  and ($categories is null or category = any($categories))
order by ST_Distance(location_geography,
           ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography)
limit 50;
```

Refresh latency: concurrent refresh is non-blocking but introduces ~seconds of staleness after a write. Acceptable at b1 MVP load. Use synchronous (non-concurrent) refresh in tests.

Items with no attached Location appear in the view but with null `location_geography` — they will not surface in proximity-filtered queries. Wonders without a Location are intentionally included in the view for non-proximity queries (keyword search, community-scoped browse, future b2 surfaces).

`brand_sibling_count` is a correlated subquery. Monitor its cost as data grows; it may need to be materialized separately at b2 scale.

## Completion

Date:
Commit:
