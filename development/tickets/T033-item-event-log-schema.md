# T033 — Item event log schema (011_item_event_log.sql)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** T028, T030
**Status:** open

## Goal

Create the `item_events` append-only log, partitioned by month. This table is the source of truth for the stakeholder dashboard, state machines, AI search, and b2 follow streams. Missing entries become retrofit work — getting it right from day one is the entire point of Phase 1.

## Migration

### `web/supabase/migrations/011_item_event_log.sql`

```sql
create table public.item_events (
  id          uuid not null default gen_random_uuid(),
  item_id     uuid not null references public.items(id) on delete cascade,
  member_id   uuid references public.members(id) on delete set null,  -- actor; null = system
  event_name  text not null,
  payload     jsonb not null default '{}',
  created_at  timestamptz not null default now()
) partition by range (created_at);

-- initial partitions (extend monthly via runbook)
create table public.item_events_2026_05
  partition of public.item_events
  for values from ('2026-05-01') to ('2026-06-01');

create table public.item_events_2026_06
  partition of public.item_events
  for values from ('2026-06-01') to ('2026-07-01');

-- indexes on each partition (Postgres auto-inherits on new partitions if created with template)
create index on public.item_events (item_id, created_at desc);
create index on public.item_events (member_id, created_at desc);
create index on public.item_events (event_name, created_at desc);

-- append-only: no update or delete RLS policies
alter table public.item_events enable row level security;

create policy "item_events_owner_read" on public.item_events
  for select using (
    item_id in (
      select id from public.items
      where member_id in (select id from public.members where auth_user_id = auth.uid())
    )
  );
-- inserts: service role only (no authenticated insert policy)
```

## Acceptance Criteria

- [ ] `item_events` table created with monthly range partitioning on `created_at`
- [ ] Two initial partitions created (current month + next month)
- [ ] Indexes on `(item_id, created_at desc)`, `(member_id, created_at desc)`, `(event_name, created_at desc)`
- [ ] RLS: no insert via authenticated users (service role only); owner can select own item's events
- [ ] No update or delete RLS policy — append-only enforced
- [ ] `logItemEvent(itemId, memberId, eventName, payload)` utility created in `web/src/lib/events.ts`
- [ ] Required event names documented in `events.ts`: item.created, item.updated, item.published, item.location_attached, item.location_removed, item.responded, item.response_withdrawn, item.state_changed, item.fulfilled, item.deleted, item.community_changed, item.brand_label_changed
- [ ] Vitest unit test: call `logItemEvent` for each required event name; assert row inserted; assert no update path exists
- [ ] Integration test: create an Item through the app layer, confirm `item.created` event in `item_events`
- [ ] Partition creation runbook documented in this ticket's notes
- [ ] BUILD-LOG.md updated

## Implementation Notes

Events are written from application code, not DB triggers. Triggers hide side effects and make the log unreliable as a business-logic source of truth.

Partition runbook (manual at b1; automate with pg_partman at b2):
1. On the last day of each month, run: `create table public.item_events_YYYY_MM partition of public.item_events for values from ('YYYY-MM-01') to ('YYYY-MM+1-01');`
2. Set a reminder in the team calendar.

`payload` is typed in TypeScript via interfaces in `events.ts`, even though the DB column is jsonb. Example:
```ts
interface ItemStateChangedPayload { from: string; to: string }
```

Event rows are immutable. If a bad event was logged, add a compensating event — do not update or delete the original. Document this constraint in `events.ts`.

## Completion

Date:
Commit:
