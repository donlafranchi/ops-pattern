# T057 — Phase 1: `discoverable_items` materialized view + refresh trigger (`016_discoverable_items.sql`)

**Scenario:** None. Phase 1 substrate — opens against `product/systems/item.md` § "Discoverable-items refresh trigger" + ADR-10 (event-log invariants — same-transaction refresh) + ADR-7 (action-layer conformance).
**Status:** Build complete; closed 2026-05-19. **Closes Phase 1 substrate.**
**Bundle:** b1 (Phase 1 substrate — closes Phase 1 schema).
**Depends on:** T055 (groups — display join), T056 (items — spine + events + responses + tags).

**Serves:**
- **Loops:** 1, 3, 4, 7, 8, 9 — every locality-discovery loop reads through this view. Loop 3 (Land here — no-login) is the load-bearing case: anon traffic hits exactly one query.
- **Primitive shape:** Materialized denormalization across all four primitives. Read-only surface; the action layer writes through `item_events` and the trigger maintains the view.
- **Absolutes encoded:** none fresh. The view's underlying SELECT *filters down* to public surface (`state='published' AND deleted_at IS NULL AND (group_id IS NULL OR group is listed and not dissolved)`) — Absolute 4 (family-private) is enforced by exclusion at query time, not by a fresh constraint.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — N/A.**
- [ ] **M4 — `engineering:deploy-checklist`** — MANDATORY.
- [ ] **DEVIATIONS.md entry** at close — minimum a one-liner.

## What ships

**One migration file:** `web/supabase/migrations/016_discoverable_items.sql`.

1. `public.discoverable_items` materialized view — denormalized join of Item + Member + Location + Group, filtered to public-readable rows only.
2. `unique_idx_discoverable_items` on `(item_id)` — pre-condition for `REFRESH MATERIALIZED VIEW CONCURRENTLY`.
3. Supporting indexes for browse — `(kind)`, `(category)`, `(group_id) where group_id is not null`, GIST on `nearest_location_geography`.
4. `public.refresh_discoverable_items_on_publish()` `SECURITY DEFINER` trigger function — runs as postgres so it can read base tables across RLS contexts.
5. `trg_refresh_discoverable_items` `AFTER INSERT` row-level trigger on `public.item_events`, filtered by `WHEN (NEW.event_kind = 'item.published')`. Calls the refresh function inside the same transaction (synchronous at b1 per ADR-10; async transition is a T2 concern).
6. GRANT SELECT on `discoverable_items` to `anon` and `authenticated`.

## View shape

```sql
create materialized view public.discoverable_items as
  select
    i.id                                                       as item_id,
    i.member_id,
    m.handle                                                   as member_handle,
    m.display_name                                             as member_display_name,
    i.kind                                                     as item_kind,
    i.title,
    i.description,
    i.category,
    i.brand_label,
    i.group_id,
    g.name                                                     as group_name,
    g.kind                                                     as group_kind,
    gb.display_name                                            as group_business_display_name,
    -- Nearest Location: earliest-attached, non-removed, status=approved.
    nearest.location_id                                        as nearest_location_id,
    l.label                                                    as nearest_location_label,
    l.slug                                                     as nearest_location_slug,
    l.geography                                                as nearest_location_geography,
    -- Response counts (active only).
    coalesce(rc.response_count, 0)                             as response_count,
    -- Primary tag: lexicographic min of attached tags (deterministic).
    pt.tag                                                     as primary_tag,
    -- Latest item.published timestamp for ordering recency feeds.
    i.updated_at                                               as published_at
  from public.items i
  join public.members m
    on m.id = i.member_id
   and m.deleted_at is null
  left join public.groups g
    on g.id = i.group_id
  left join public.group_businesses gb
    on gb.group_id = g.id
   and g.kind = 'business'
  left join lateral (
    select il.location_id
      from public.item_locations il
     where il.item_id = i.id
       and il.removed_at is null
       and il.status = 'approved'
     order by il.created_at asc
     limit 1
  ) nearest on true
  left join public.locations l
    on l.id = nearest.location_id
   and l.deleted_at is null
  left join lateral (
    select count(*) as response_count
      from public.item_responses r
     where r.item_id = i.id
       and r.withdrawn_at is null
  ) rc on true
  left join lateral (
    select tag
      from public.item_tags t
     where t.item_id = i.id
     order by t.tag asc
     limit 1
  ) pt on true
  where
    i.state = 'published'
    and i.deleted_at is null
    and (
      i.group_id is null
      or (g.discoverability = 'listed' and g.dissolved_at is null)
    );
```

## Trigger

```sql
create or replace function public.refresh_discoverable_items_on_publish()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  -- Synchronous CONCURRENT refresh per ADR-10. The unique index on
  -- (item_id) is required for CONCURRENTLY; created before this function.
  refresh materialized view concurrently public.discoverable_items;
  return null;
end;
$$;

create trigger trg_refresh_discoverable_items
  after insert on public.item_events
  for each row
  when (NEW.event_kind = 'item.published')
  execute function public.refresh_discoverable_items_on_publish();
```

## Acceptance Criteria

### Migration

- [ ] New file `web/supabase/migrations/016_discoverable_items.sql`.
- [ ] Materialized view exists with the column set above.
- [ ] `unique_idx_discoverable_items` exists on `(item_id)`.
- [ ] Supporting indexes per spec.
- [ ] Trigger function is `SECURITY DEFINER`.
- [ ] Trigger fires only on `event_kind='item.published'`.
- [ ] `grant select on public.discoverable_items to anon, authenticated;`.
- [ ] File header documents the synchronous-refresh decision per ADR-10 and the T2 transition trigger (p99 > 30s for one week → async).

### Eval coverage

New file `web/evals/phase-1/discoverable-items.spec.ts`:

- [ ] **View exists** — `eval_table_shape` (or `eval_is_relation`) returns the column set.
- [ ] **Unique index exists** — `eval_indexes_for_table` confirms `unique_idx_discoverable_items` on `(item_id)`.
- [ ] **Anon read works** — `grant select` test: anon can SELECT from `discoverable_items` (the view is a public-read surface).
- [ ] **A draft Item is NOT in the view.**
- [ ] **A published standalone Item IS in the view after publish event fires.**
- [ ] **A published Item filed under a listed Group IS in the view.**
- [ ] **A published Item filed under a private Group is NOT in the view.**
- [ ] **A published Item soft-deleted disappears after the next publish event refreshes** (note: soft-delete itself doesn't fire `item.published`; the test publishes a *second* Item to force refresh, and confirms the soft-deleted Item is no longer in the view).
- [ ] **Refresh trigger fires on `item.published` event** — insert a draft Item, no view row; insert `item.published` event row, view now has the Item.
- [ ] **Refresh does NOT fire on other event kinds** — insert `item.updated` event, view unchanged (insert a published-Item-not-yet-refreshed and confirm `item.updated` doesn't pick it up).

### Conformance + integration

- [ ] `npm run check:action-layer` — `OK`.
- [ ] `supabase db reset && eval:bootstrap && playwright test evals/phase-1/discoverable-items.spec.ts` — all green.
- [ ] Full `evals/phase-1/` green (132 prior + new test count).

## Notes

**Why nearest-location is "earliest-attached" rather than geographically nearest.** At b1 the locality-first index runs distance computation in the query layer (PostGIS `ST_Distance` between query point and `nearest_location_geography`), not in the view. The view stores one Location per Item for cheap reads; the query layer picks the "right" Item-Location pair per query. T2's multi-location Items + distance-resolved nearest is a surface concern not a substrate one.

**Why `published_at = items.updated_at`.** The materialized view is refreshed on `item.published` event, so at refresh time `items.updated_at` reflects the most recent publish (the action handler at Phase 2 sets `updated_at=now()` when transitioning to `published`). A dedicated `published_at` column on `items` is a Phase-2 concern if we need to distinguish "last edit" from "first publish" for ordering.

**Why SECURITY DEFINER on the trigger function.** `REFRESH MATERIALIZED VIEW` requires read access to all base tables; under RLS the calling Member would see only their own rows. Running as the function owner (postgres) bypasses RLS for the refresh, which is correct because the view's own WHERE clause already filters to public-readable rows.

**Commit hygiene.** `T057: discoverable_items view + refresh trigger (016_discoverable_items.sql + discoverable-items.spec.ts)`.

## Completion

Date: 2026-05-19
Commit (web): {pending}
Commit (parent): {pending}

**Build outcome:**

- `web/supabase/migrations/016_discoverable_items.sql` (~130 lines) — materialized view + unique index + 5 supporting browse indexes + SECURITY DEFINER refresh function + row-level AFTER INSERT trigger on `item_events` filtered by `event_kind='item.published'` + GRANT SELECT to anon/authenticated.
- `web/evals/phase-1/discoverable-items.spec.ts` (~330 lines, 10 tests) — anon-read works, unique index exists, draft NOT in view, published-standalone IS in view, published-in-listed-group IS in view with `group_business_display_name`, published-in-family-group NOT in view, soft-delete removes on next refresh, non-publish events do NOT refresh, multi-location uses earliest-attached approved row, response_count reflects active only.
- `supabase db reset` → clean apply.
- `npm run eval:bootstrap` → conformance OK.
- **10/10 disc-items tests green on first run.** One spec mismatch (using `index_name` instead of `indexname` — the helper RPC's actual column) fixed inline; the recovered test confirms `CREATE UNIQUE INDEX` via `indexdef` regex.
- Full Phase 1: **142/142 green** (132 prior + 10 new).
- `npm run check:action-layer` → `OK`. 125 files; 32 protected tables.

**M2 verdict — `engineering:code-review`:** **PROCEED**. Materialized-view WHERE clause filters to exactly the public-readable subset (`state='published' AND not soft-deleted AND (no group OR listed-and-not-dissolved group)`); unique index landed before the trigger (CONCURRENTLY pre-condition); SECURITY DEFINER on the trigger function is correct (refresh needs RLS-bypass on base reads, view's own WHERE is the gate); row-level trigger on partitioned `item_events` works (PG 11+ propagates to all partitions); GRANT SELECT to anon is the right surface because materialized views don't honor RLS.

**M4 verdict — `engineering:deploy-checklist`:** **PROCEED**. Phase 1+ migration; forward-only; full eval pass; no env / secret / config changes. **Phase 1 substrate is now complete.**

**DEVIATIONS.md entry:** Appended 2026-05-19 — one-liner noting the `indexname` vs `index_name` RPC mismatch caught at first run and resolved inline. No spec deviation.
