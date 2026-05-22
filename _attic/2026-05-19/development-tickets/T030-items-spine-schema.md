> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T030 — Items spine schema (009_items.sql)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** T028, T029
**Status:** open

## Goal

Create the `items` spine table — the keystone primitive. Shared columns across all kinds. Kind-specific child tables ship in T031. Additive only.

## Migration

### `web/supabase/migrations/009_items.sql`

```sql
create table public.items (
  id                uuid primary key default gen_random_uuid(),
  member_id         uuid not null references public.members(id) on delete cascade,
  kind              text not null check (kind in (
                      'product', 'service', 'gathering', 'wonder',
                      'offer', 'ask', 'initiative'  -- reserved; no UI at b1
                    )),
  title             text not null,
  description       text,
  state             text not null default 'active' check (state in ('active', 'fulfilled', 'withdrawn', 'closed')),
  community_id      uuid,              -- FK added in T034
  brand_label       text,              -- "Oak Park Sourdough" on the Item, never on the Member
  category          text,
  ambient_extras    jsonb not null default '{}',
  slug              text unique not null,
  -- reserved columns (always null until future tiers)
  parent_item_id    uuid references public.items(id) on delete set null,
  collection_id     uuid,
  federation_origin text,
  embedding_id      uuid,
  deleted_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index on public.items (member_id);
create index on public.items (kind);
create index on public.items (state);
create index on public.items (brand_label);
create index on public.items (category);
create index on public.items (deleted_at);
create index on public.items (member_id, brand_label);  -- resolve-up sibling query

create trigger set_updated_at
  before update on public.items
  for each row execute function update_updated_at_column();

alter table public.items enable row level security;

-- anonymous reads: only active, non-deleted
create policy "items_public_read" on public.items
  for select using (state = 'active' and deleted_at is null);

-- owner: read all own items (including withdrawn/closed)
create policy "items_owner_read_all" on public.items
  for select using (
    member_id in (select id from public.members where auth_user_id = auth.uid())
  );

-- owner: insert/update
create policy "items_owner_write" on public.items
  for all using (
    member_id in (select id from public.members where auth_user_id = auth.uid())
  );
-- no delete policy — use soft delete (deleted_at)
```

## Acceptance Criteria

- [ ] Table has all columns including all reserved columns (parent_item_id, collection_id, federation_origin, embedding_id)
- [ ] `kind` check constraint includes reserved values: offer, ask, initiative
- [ ] No `business_name` column anywhere in this migration
- [ ] `brand_label` is on items — not on members
- [ ] Composite index on `(member_id, brand_label)` exists for resolve-up queries
- [ ] RLS: anonymous reads only `state='active' and deleted_at is null`; owner reads all own items; no delete via RLS
- [ ] `community_id` column present (FK constraint added in T034)
- [ ] `supabase db push` applies cleanly
- [ ] Vitest unit test: insert one item per kind in the enum; verify constraint rejects invalid kind; verify anon cannot read withdrawn items
- [ ] Integration test: create item via app layer, confirm visible to anon

## Implementation Notes

`community_id` and the FK to `communities` will be enforced in T034. Use a deferred FK or add the constraint there.

`offer`, `ask`, `initiative` in the kind enum prevents a schema migration later when b2 surfaces them. No UI reaches these values at b1; the check constraint is the only surface they appear on.

`brand_label` is a free-text column. The resolve-up query is: `select * from items where member_id = $1 and brand_label = $2 and state = 'active' and deleted_at is null and id != $3`. No Brand table, no Brand ID FK — this is the people-first constraint enforced in the schema design.

## Completion

Date:
Commit:
