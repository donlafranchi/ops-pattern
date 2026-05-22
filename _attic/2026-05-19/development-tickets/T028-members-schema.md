> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T028 — Members schema (007_members.sql)

**Bundle:** b1
**Phase:** 1 — Schema floor
**Depends on:** none
**Status:** open

## Goal

Create the `members` table — the new first-class human actor extracted from `auth.users`. Additive only; no existing tables modified. No UI changes.

## Migration

### `web/supabase/migrations/007_members.sql`

```sql
create table public.members (
  id                    uuid primary key default gen_random_uuid(),
  auth_user_id          uuid unique not null references auth.users(id) on delete cascade,
  display_name          text not null,
  slug                  text unique not null,
  avatar_url            text,
  bio                   text,
  contact_prefs         jsonb not null default '{}',
  primary_community_id  uuid,              -- FK added in T034 (communities not yet created)
  deleted_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- no business_name column — brand is an Item-level concern (people-first hard constraint)

create index on public.members (auth_user_id);
create index on public.members (slug);
create index on public.members (deleted_at);

create trigger set_updated_at
  before update on public.members
  for each row execute function update_updated_at_column();

alter table public.members enable row level security;

-- public: read display name + avatar only
create policy "members_public_read" on public.members
  for select using (deleted_at is null);

-- owner: full read/write
create policy "members_owner_write" on public.members
  for update using (auth_user_id = auth.uid());
```

## Acceptance Criteria

- [ ] Migration `007_members.sql` exists in `web/supabase/migrations/`
- [ ] Table has: id, auth_user_id, display_name, slug, avatar_url, bio, contact_prefs, primary_community_id, deleted_at, created_at, updated_at
- [ ] No `business_name` column — hard constraint
- [ ] `auth_user_id` is unique with a cascade delete
- [ ] RLS: public can select non-deleted rows; owner can update own row; no direct insert via RLS (service role only)
- [ ] Indexes on auth_user_id, slug, deleted_at
- [ ] `updated_at` trigger fires on update
- [ ] `supabase db push` applies cleanly with zero errors
- [ ] Vitest unit test: insert via service role utility, assert all columns, assert `deleted_at` is null
- [ ] Integration test: create a member through the Next.js app layer, confirm row visible via anon select with display_name only

## Implementation Notes

Slug generation: lowercase display_name, spaces → `-`, strip non-alphanumeric. Uniqueness enforced at DB level; application retries with a numeric suffix on collision.

`primary_community_id` is a nullable forward reference — the FK constraint is added in T034 when the `communities` table exists. Either use a deferred FK here or add the constraint in `012_communities.sql`.

The `contact_prefs` jsonb structure: `{ website: string, instagram: string, email: string, show_email: boolean }`. Define a TypeScript interface in `web/src/lib/types/member.ts`.

## Completion

Date:
Commit:
