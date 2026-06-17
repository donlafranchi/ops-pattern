---
id: how-T106-mv-starts-at-column
purpose: Add starts_at to the discoverable_items MV so discovery surfaces can filter past gatherings and sort by next occurrence.
layer: how
status: open
ticket: T106
scenario: substrate
system_spec: product/systems/item.md
created: 2026-06-16
---

# T106: Add `starts_at` to `discoverable_items` MV

**Scenario:** substrate (no user-facing surface — MV schema change)
**Depends on:** T057 (original MV), T105 (venue nearby RPC that consumes the MV)
**Spec anchor:** `product/systems/item.md` § Discoverable-items MV; SPEC-PATCHES 2026-06-16 entry

## Problem

The `discoverable_items` MV has no schedule column. Gathering schedules live in the `item_gatherings` child table. Any surface that reads the MV (locality feed, venue nearby) cannot filter out past gatherings or sort by next occurrence. A trivia night from last month that's still `published` shows up alongside tomorrow's events.

## Deliverables

### 1. Migration: add `starts_at` to the MV definition

Rebuild the MV with an additional column:

```sql
left join lateral (
  select ig.starts_at
    from public.item_gatherings ig
   where ig.item_id = i.id
   order by ig.starts_at asc
   limit 1
) gs on true
```

Add `gs.starts_at as starts_at` to the SELECT list. Add an index:

```sql
create index idx_discoverable_items_starts_at
  on public.discoverable_items (starts_at asc nulls last)
  where starts_at is not null;
```

The MV must be dropped and recreated (Postgres doesn't support adding columns to MVs). The dependent RPCs (`locality_feed_items`, `venue_nearby_items`) reference the MV by name, not by column, so they survive the rebuild — but they're updated in step 2 anyway.

### 2. Update `venue_nearby_items` to filter and sort by `starts_at`

```sql
-- Add to WHERE:
and (di.starts_at is null or di.starts_at >= now())

-- Change ORDER BY to:
order by st_distance(...) asc,
         di.starts_at asc nulls last,
         di.published_at desc
```

Past gatherings excluded. Non-gathering items (products, services) pass through (`starts_at is null`). Sort: distance → next occurrence → recency.

### 3. Update `locality_feed_items` to sort by `starts_at`

Same pattern — gatherings with upcoming `starts_at` sort before stale `published_at`. Exact ORDER BY TBD (existing tag-boost logic stays; `starts_at` inserts after the tag-boost CASE).

## Acceptance

1. A gathering with `starts_at` in the past does not appear in `venue_nearby_items` results.
2. A gathering with `starts_at` tomorrow sorts before a gathering with `starts_at` next week at the same distance.
3. A product (no `starts_at`) still appears in both RPCs — the null passes through.
4. The locality feed sorts upcoming gatherings before older non-gathering items at the same tag-match level.
5. `REFRESH MATERIALIZED VIEW CONCURRENTLY` still works (unique index on `item_id` preserved).

## Out of scope

- Recurring-event next-occurrence calculation (b2 — `item_gatherings` stores the single next `starts_at` at b1).
- Past-event filtering on the hosted section (`venue_hosted_items` reads base tables, already joins `item_gatherings` directly — it can add the filter independently if needed).
- MV refresh trigger changes (existing `item.published` trigger is sufficient).

## Gates

- [x] M2 — `engineering:code-review` before commit. Verdict: **Approve** (no code changes — visibility gate reproduced verbatim; CONCURRENT-refresh precondition preserved; upcoming-only filter is regression-free for non-gathering items).
- [x] Tests pass, build clean. 10/10 static-shape guards (`tests/migrations-t106.test.ts`) GREEN; related suites GREEN (incl. `feed-locality`); `check:action-layer` OK; eslint clean. No TS changes (RPC return signatures unchanged), so `next build` is unaffected.
- [x] DEVIATIONS entry → [`development/deviations/T106.md`](../deviations/T106.md) (2 deviations + 1 note). **M4 deploy-checklist required before merge** (MV rebuild + index/grant recreation).

## Completion

Date: 2026-06-16
Commit: {pending PM approval — committed together with T105}

Single migration `034_discoverable_items_starts_at.sql`: drops + rebuilds the MV with a `starts_at` column (lateral join to `item_gatherings`, earliest occurrence; null for non-gatherings), recreates the unique `item_id` index + all five browse/GiST indexes + a new partial `idx_discoverable_items_starts_at` + the anon/authenticated grant, then `CREATE OR REPLACE` all three discovery RPCs with a uniform **hard-exclusion** filter (PM-directed): `(starts_at is null OR starts_at >= now()) AND (kind <> 'gathering' OR starts_at is not null)` — past + dateless gatherings excluded, non-gatherings pass. `venue_nearby_items` sorts distance→next-occurrence→recency; `venue_hosted_items` (orig. 033) gets the same base-table filter; `locality_feed_items` keeps the tag boost then `starts_at asc nulls last` then recency (interim bucket CASE removed). Resolves T105 deviation 1; drains the SPEC-PATCHES 2026-06-16 MV-schedule-column entry.
