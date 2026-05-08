# T034 — Communities schema (012_communities.sql)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** T028, T029
**Status:** open

## Goal

Create `communities` and `community_memberships` tables, and add deferred FK constraints to `members` and `items`. The tables ship empty and remain empty until a Member explicitly creates a Community. No backfill step creates Communities. Additive only.

## Migration

### `web/supabase/migrations/012_communities.sql`

```sql
create table public.communities (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text unique not null,
  kind                 text not null default 'general' check (
    kind in ('general', 'neighborhood', 'interest', 'market_regular')
  ),
  anchor_location_id   uuid references public.locations(id) on delete set null,
  parent_community_id  uuid references public.communities(id) on delete set null,
  founder_member_id    uuid not null references public.members(id) on delete restrict,
  description          text,
  discoverability      text not null default 'listed'
                       check (discoverability in ('listed', 'unlisted', 'invite_only')),
  fund_id              uuid,  -- reserved, always null at b1
  dormant_at           timestamptz,
  dissolved_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index on public.communities (anchor_location_id);
create index on public.communities (discoverability);

create table public.community_memberships (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references public.communities(id) on delete cascade,
  member_id     uuid not null references public.members(id) on delete cascade,
  role          text not null default 'member' check (role in ('member', 'steward')),
  source        text not null check (
    source in ('explicit', 'soft_via_follow', 'soft_via_attendance')
  ),
  joined_at     timestamptz not null default now(),
  left_at       timestamptz,
  unique (community_id, member_id)
);

create index on public.community_memberships (community_id, left_at);
create index on public.community_memberships (member_id, left_at);

-- add deferred FKs to members and items
alter table public.members
  add constraint members_primary_community_id_fk
  foreign key (primary_community_id) references public.communities(id) on delete set null;

alter table public.items
  add constraint items_community_id_fk
  foreign key (community_id) references public.communities(id) on delete set null;

-- RLS
alter table public.communities enable row level security;
alter table public.community_memberships enable row level security;

create policy "communities_public_read" on public.communities
  for select using (discoverability in ('listed', 'unlisted') and dissolved_at is null);

create policy "communities_owner_write" on public.communities
  for all using (
    founder_member_id in (select id from public.members where auth_user_id = auth.uid())
  );

create policy "memberships_own_read" on public.community_memberships
  for select using (
    member_id in (select id from public.members where auth_user_id = auth.uid())
  );

create policy "memberships_self_write" on public.community_memberships
  for all using (
    member_id in (select id from public.members where auth_user_id = auth.uid())
  );
```

Also add to `web/src/lib/events.ts`: `logCommunityEvent(communityId, memberId, eventName, payload)` with event names: community.created, community.joined, community.left, community.steward_transferred, community.dormant, community.revived, community.dissolved.

## Acceptance Criteria

- [ ] `communities` and `community_memberships` tables created
- [ ] Both tables are empty at deploy — no auto-created Communities anywhere
- [ ] `source` enum includes `explicit`, `soft_via_follow`, `soft_via_attendance` — only `explicit` written at b1
- [ ] Deferred FK `members.primary_community_id → communities.id` added cleanly
- [ ] Deferred FK `items.community_id → communities.id` added cleanly
- [ ] `founder_member_id` uses `on delete restrict` — community persists after founder deletion until stewardship is transferred
- [ ] `fund_id` column present and null — no funds table created
- [ ] RLS: listed/unlisted communities readable by public; private (`invite_only`) not selectable by non-members
- [ ] `logCommunityEvent` utility in `events.ts`
- [ ] Vitest unit test: create a community, add an explicit member, assert membership row; assert no `soft_*` rows are created by any code path in this ticket; assert `dissolved_at` prevents community from appearing in public select
- [ ] `supabase db push` applies cleanly including the alter table statements

## Implementation Notes

Hard constraint: Communities are never auto-created or auto-assigned. No code path in this ticket — or any ticket that depends on it — should create a Community based on follows, geography, or attendance.

`soft_via_follow` and `soft_via_attendance` source values are in the schema for future soft-affiliation inference. At b1, write only `source='explicit'`. If any code path in Phase 1 writes a `soft_*` row, that is a bug.

`founder_member_id on delete restrict`: if a founder soft-deletes their Member account, the Community must be transferred first. Add a check in the Member delete utility: if the member is the sole steward of any non-dissolved Community, block deletion with an error message: "Transfer stewardship of [Community names] before deleting your account."

## Completion

Date:
Commit:
