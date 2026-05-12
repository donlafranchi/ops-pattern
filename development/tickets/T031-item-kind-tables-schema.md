> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T031 — Item kind child tables (009a–d)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** T030
**Status:** open

## Goal

Create the four kind-specific child tables: `item_products`, `item_services`, `item_gatherings`, `item_wonders`. Each is a 1:1 extension of the `items` spine keyed on `item_id`. Additive only.

## Migrations

### `009a_item_products.sql`
```sql
create table public.item_products (
  item_id       uuid primary key references public.items(id) on delete cascade,
  price_cents   int,
  price_unit    text,           -- "loaf", "dozen", "lb"
  composition   text,           -- ingredients / what it's made of
  photo_urls    text[] not null default '{}',
  available_until timestamptz
);
create index on public.item_products (available_until);
```

### `009b_item_services.sql`
```sql
create table public.item_services (
  item_id                 uuid primary key references public.items(id) on delete cascade,
  rate_model              text check (rate_model in ('hourly', 'flat', 'quote', 'membership')),
  rate_cents              int,
  service_area_geography  geography(Polygon, 4326),
  hours                   jsonb not null default '{}',
  license_info            jsonb,
  on_call                 bool not null default false,
  accepts_new_clients     bool not null default true
);
create index on public.item_services using gist (service_area_geography);
create index on public.item_services (rate_model);
```

### `009c_item_gatherings.sql`
```sql
create table public.item_gatherings (
  item_id         uuid primary key references public.items(id) on delete cascade,
  starts_at       timestamptz,
  ends_at         timestamptz,
  recurrence_rule text,          -- RRULE format; null = one-time
  capacity        int,
  cost_cents      int,           -- null = free
  what_to_bring   text,
  host_member_id  uuid references public.members(id) on delete set null,
  rsvp_cutoff     timestamptz
);
create index on public.item_gatherings (starts_at);
create index on public.item_gatherings (host_member_id);
```

### `009d_item_wonders.sql`
```sql
create table public.item_wonders (
  item_id                uuid primary key references public.items(id) on delete cascade,
  interest_count         int not null default 0,
  expires_at             timestamptz not null default (now() + interval '90 days'),
  conversion_target_kind text check (
    conversion_target_kind in ('gathering', 'initiative') or conversion_target_kind is null
  ),
  converted_to_item_id   uuid references public.items(id) on delete set null
);
create index on public.item_wonders (interest_count desc);
create index on public.item_wonders (expires_at);
```

Add RLS to all four tables (select public, insert/update gated to item owner via join through `items`).

## Acceptance Criteria

- [ ] All four migrations created and apply cleanly in sequence
- [ ] Each child table has `item_id` as PK with FK cascade delete to `items`
- [ ] RLS: public select; owner insert/update (via items.member_id join)
- [ ] GIST index on `item_services.service_area_geography`
- [ ] Indexes on `item_gatherings.starts_at` and `item_gatherings.host_member_id`
- [ ] Indexes on `item_wonders.interest_count desc` and `item_wonders.expires_at`
- [ ] Vitest unit tests: insert a row into each child table, assert constraints; verify reserved kind rows (offer/ask/initiative) in `items` can have no child row without DB error
- [ ] Integration test: create a full gathering Item (spine + child) through the app layer

## Implementation Notes

Child table association with `items.kind` is app-enforced, not DB-enforced. When creating an Item, the app must create the spine row first, then the correct child row. Document the create utility in `web/src/lib/items.ts`.

`item_wonders.interest_count` is a denormalized cache of `count(*) from item_responses where item_id = ? and response_kind = 'interest'`. Increment/decrement in the same transaction as the `item_responses` insert/withdraw in T032. Do not use a DB trigger.

`item_services.service_area_geography` proximity query: `ST_Contains(service_area_geography, ST_SetSRID(ST_MakePoint($lng, $lat), 4326))` — used to surface services that cover a user's location.

## Completion

Date:
Commit:
