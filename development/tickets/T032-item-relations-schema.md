# T032 — Item relations schema (010_item_relations.sql)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** T028, T029, T030
**Status:** open

## Goal

Create `item_locations`, `item_responses`, `item_tags`, and `item_hashtags`. These connect Items to Locations, people, categories, and free-form labels. Additive only.

## Migration

### `web/supabase/migrations/010_item_relations.sql`

```sql
-- Item ↔ Location
create table public.item_locations (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references public.items(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  status      text not null default 'approved'
              check (status in ('pending', 'approved', 'declined')),
  display_order int not null default 0,
  created_at  timestamptz not null default now(),
  unique (item_id, location_id)
);
create index on public.item_locations (location_id);
create index on public.item_locations (item_id, status);

-- Uniform response verbs
create table public.item_responses (
  id            uuid primary key default gen_random_uuid(),
  item_id       uuid not null references public.items(id) on delete cascade,
  member_id     uuid not null references public.members(id) on delete cascade,
  response_kind text not null check (
    response_kind in ('interest', 'rsvp', 'follow', 'save', 'pledge', 'purchase', 'support')
  ),
  created_at    timestamptz not null default now(),
  withdrawn_at  timestamptz,
  unique (item_id, member_id, response_kind)
);
create index on public.item_responses (item_id, response_kind);
create index on public.item_responses (member_id, response_kind);

-- Controlled vocabulary categories
create table public.item_tags (
  id         uuid primary key default gen_random_uuid(),
  item_id    uuid not null references public.items(id) on delete cascade,
  tag        text not null,
  is_primary bool not null default false,
  created_at timestamptz not null default now(),
  unique (item_id, tag)
);
create index on public.item_tags (tag);

-- Free-form user-generated hashtags (distinct from controlled categories)
create table public.item_hashtags (
  item_id    uuid not null references public.items(id) on delete cascade,
  hashtag    text not null,  -- normalized: lowercase, no leading #, no whitespace
  created_at timestamptz not null default now(),
  primary key (item_id, hashtag)
);
create index on public.item_hashtags (hashtag);
create index on public.item_hashtags (hashtag, created_at desc);  -- trending
```

RLS on all four tables: public select for approved/active; owner insert/delete.

## Acceptance Criteria

- [ ] All four tables created and apply cleanly
- [ ] `item_locations`: unique `(item_id, location_id)`; status enum includes pending/approved/declined
- [ ] `item_responses`: unique `(item_id, member_id, response_kind)`; `withdrawn_at` nullable (not hard delete)
- [ ] `item_tags`: unique `(item_id, tag)`; index on `tag`
- [ ] `item_hashtags`: composite PK `(item_id, hashtag)`; indexes on `(hashtag)` and `(hashtag, created_at desc)`
- [ ] RLS: item_locations public read for approved; item_responses public cannot read individual responders; item_tags/hashtags public read
- [ ] Vitest unit test: insert a response, verify unique constraint blocks duplicate; test withdrawn_at flow; insert a hashtag and verify PK blocks duplicate
- [ ] Integration test: attach a location to an item via app layer, confirm item_locations row with status='approved'

## Implementation Notes

`item_hashtags` vs `item_tags`: tags are controlled vocabulary (bounded category index, LLM filter-mapping surface). Hashtags are free-form, user-generated, normalized at the app layer before insert. Both exist from day one per the b1-primitives data model floor.

Hashtag normalization (app layer, before insert): `hashtag.toLowerCase().replace(/^#/, '').replace(/\s+/g, '')`. The DB PK enforces uniqueness on the already-normalized value.

`response_kind='follow'` replaces the old `follows` table semantically. During Phase 2 backfill, existing `follows` rows become `item_responses` rows with `response_kind='follow'`. The old `follows` table is untouched in Phase 1.

`pledge` and `purchase` response kinds are reserved — no commerce UI at b1. Present in the schema to avoid a later migration altering the check constraint.

## Completion

Date:
Commit:
