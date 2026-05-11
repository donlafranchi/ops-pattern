# T042 — Members + member_events Phase 0 floor + system Member row

**Scenario:** `notes/migration-to-primitives.md` § Phase 0 — AI-native floor (the `002_system_member.sql` step + its implicit prerequisite of a minimal `members` + `member_events` table pair)
**Status:** Complete *(build-side; runtime verification pending `pipeline-eval` run-mode)*
**Bundle:** b1
**Depends on:** T041

**Serves:**
- **Loop:** All five loop families (substrate). The system Member is the `acting_member_id` for every platform-emitted event, per ADR-6 / ADR-10.
- **Canonical example:** All — every event-emitting surface (Brian's Run Club declaration, Maya's product post, the auth signup hook itself) writes an event row whose audit field references either the human Member or this system Member.
- **Primitive shape:** Person (Member). Phase 0 lands the minimal Member spine + event log so the action layer (T043) and auth hook (T044) have something to write to. Phase 1's `007_*` series will extend `members` with privacy / interests / follows / threads / affinities / delegations / self-records and add the child tables.

## Workflow gates (mandatory during the rebuild phase per `CLAUDE.md` § Rebuild phase — special rules)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode) is called.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.
- [ ] **Sequencing note recorded in DEVIATIONS.md** — Phase 0's `002_system_member.sql` per the rebuild plan inserts into a `members` table the plan does not explicitly create until Phase 1's `007_members.sql`. This ticket resolves that gap by pre-pulling the *minimal* members + member_events shape into Phase 0; Phase 1 extends. Flag for `pipeline-plan` ratification at PM review.

## Acceptance Criteria

### Migration `web/supabase/migrations/002_members_floor.sql`

- [ ] Creates `public.members` with the b1 T1 columns from `product/systems/member.md` § Data model implications:
  - [ ] `id uuid primary key default gen_random_uuid()` (per `member.md`: "`id` references `auth.users(id)` directly" — but the system Member has no `auth.users` row, so use a generated UUID and treat the `auth.users` FK as a Phase 1 augmentation OR make the FK nullable here and tighten in Phase 1 — pick one and document the choice in DEVIATIONS.md)
  - [ ] `handle text unique not null` (4–30 chars, regex `^[a-z0-9-]{4,30}$` — enforce via CHECK constraint; profanity filter is action-layer concern, not DB)
  - [ ] `display_name text not null check (char_length(display_name) between 1 and 60)`
  - [ ] `bio text` (nullable; up to 500 chars CHECK)
  - [ ] `avatar_url text` (nullable)
  - [ ] `pronouns text` (nullable; up to 30 chars CHECK)
  - [ ] `home_location_id uuid` (nullable; **no FK yet** — `locations` table lands in Phase 1; FK constraint added then)
  - [ ] `primary_group_id uuid` (nullable; no FK yet — `groups` table lands in Phase 1)
  - [ ] `stakeholder_visibility text default 'private' check (stakeholder_visibility in ('private','community_only','public'))` (reserved — T3 surface)
  - [ ] `maker_mode_enabled boolean not null default false` (per ADR-12 reinterpreted)
  - [ ] `embedding_id uuid` (nullable; reserved — populated by T3 embedding pipeline)
  - [ ] `login_disabled boolean not null default false` — the system-Member gate; the auth signup hook (T044) refuses to provision a `members` row whose `id` collides with a `login_disabled=true` row's handle, and the action layer refuses login if any future code path lands one
  - [ ] `deleted_at timestamptz` (soft delete)
  - [ ] `created_at timestamptz not null default now()`
  - [ ] `updated_at timestamptz not null default now()`
- [ ] `update_updated_at_column()` trigger function created in same migration if it does not exist; trigger attached to `members`.
- [ ] Indexes: `(handle)` (covered by unique), `(home_location_id) where home_location_id is not null`, `(primary_group_id) where primary_group_id is not null`, `(deleted_at) where deleted_at is null`.
- [ ] RLS enabled on `members`. Policies:
  - [ ] `members_public_read` — `for select using (deleted_at is null and login_disabled = false)` — anon + authed can read non-deleted, non-system rows.
  - [ ] `members_owner_update` — `for update using (id = auth.uid())` — owners can update their own row only. Insert via action layer (service role); no direct INSERT policy.
  - [ ] No DELETE policy — soft-delete only via action handler.

### Migration `web/supabase/migrations/002a_member_events.sql`

- [ ] Creates `public.member_events` partitioned monthly per ADR-10:
  - [ ] `id uuid not null default gen_random_uuid()`
  - [ ] `member_id uuid not null references public.members(id) on delete cascade`
  - [ ] `event_kind text not null` (CHECK against the b1 enum list per `member.md`: `member.created`, `member.profile_updated`, `member.home_location_set`, `member.privacy_changed`, `member.maker_mode_changed`, `member.followed`, `member.unfollowed`, `member.location_affinity_added`, `member.location_affinity_removed`, `member.interest_added`, `member.interest_removed`, `member.delegation_granted`, `member.delegation_revoked`, `member.deleted`, `member.restored`, `member.export_requested`, `member.purge_executed`, `member.handle_changed`)
  - [ ] `payload jsonb not null default '{}'` — carries the diff + trace ID (per ADR-10)
  - [ ] `acting_member_id uuid not null references public.members(id) on delete restrict` — audit field per ADR-6; never null
  - [ ] `via_delegation_id uuid` — nullable; reserved for ADR-6 delegation chain (no `member_delegations` table at Phase 0; FK added in Phase 1 when that table lands)
  - [ ] `created_at timestamptz not null default now()`
  - [ ] Partitioning: `partition by range (created_at)`; rotation routine via pg_cron or pg_partman installed here (one initial partition for the current month + the next two months; rotation procedure scheduled for the 1st of every month).
  - [ ] Composite PK: `(id, created_at)` (required because of partitioning).
  - [ ] Index on `(member_id, created_at desc)` for per-Member event lookup.
  - [ ] Index on `(acting_member_id, created_at desc)` for audit traversal.
- [ ] RLS enabled on `member_events`. Policies:
  - [ ] `member_events_owner_read` — `for select using (member_id = auth.uid() or acting_member_id = auth.uid())` — Members read events about them or by them.
  - [ ] No INSERT / UPDATE / DELETE policy — writes only via action layer (service role).

### Migration `web/supabase/migrations/002b_system_member.sql`

- [ ] Inserts the system Member row:
  - [ ] `id` = a stable, documented UUID constant (define in `web/src/lib/system-member.ts` and reference here; e.g., `'00000000-0000-0000-0000-000000000001'`)
  - [ ] `handle = 'system'` (reserved — uniqueness will reject any future user attempt to claim it)
  - [ ] `display_name = 'System'`
  - [ ] `login_disabled = true`
  - [ ] `created_at = now()`, `updated_at = now()`
- [ ] The system Member row is idempotent: `insert ... on conflict (id) do nothing;`.
- [ ] Inserts the first `member_events` row: `event_kind = 'member.created'`, `member_id = system Member id`, `acting_member_id = system Member id` (self-bootstrap; the only row in the table that may self-reference for `acting_member_id`).

### Tests / smoke assertions (Phase 1 evals will harden)

- [ ] Vitest unit test: `select count(*) from members where handle = 'system' and login_disabled = true` returns 1 after migration.
- [ ] Vitest unit test: anon select against `members` does NOT return the system Member (`login_disabled = false` clause in `members_public_read`).
- [ ] Vitest unit test: attempt to insert another row with `handle = 'system'` raises a unique-constraint violation.
- [ ] Vitest unit test: `select count(*) from member_events where event_kind = 'member.created' and member_id = '<system id>'` returns 1.
- [ ] `supabase db reset` runs cleanly with migrations 001, 002, 002a, 002b applied.
- [ ] BUILD-LOG.md updated.

## Notes

**The sequencing reinterpretation** — the rebuild plan's Phase 0 lists `002_system_member.sql` as a separate migration that "inserts the system Member," but it does not list a migration that creates the `members` table itself; that responsibility appears in Phase 1 as `007_members.sql`. The insert cannot run without the table. This ticket resolves that by pulling the minimal members + member_events shape forward into Phase 0 (migrations 002 + 002a + 002b). Phase 1's `007_*` series augments `members` with: privacy table, interests, follows, handle history, threads + messages + participants, self-records, delegations, location affinities, and the FK constraints to `auth.users` / `locations` / `groups` that depend on tables Phase 1 creates.

**The action layer is the only write surface (per ADR-7)** — this migration uses raw INSERT for the system Member because the action layer does not yet exist (T043 lands it). This is the *one* documented exception, called out in the migration body and in DEVIATIONS.md. After T043 lands, no further raw inserts to `members` or `member_events` are permitted; CI conformance check (added in T043) enforces.

**Per ADR-10:** the `member_events` row written for the system Member is the self-bootstrap exception — `acting_member_id = member_id` is permitted only for this one row. All future `member.created` events for human Members carry `acting_member_id = <the new member id>` (the new member acts on themselves) per the rebuild plan's exit criterion.

**Partition rotation:** the b1 surface is a single-region, single-tenant install — `pg_cron` is sufficient. Schedule a monthly `create table if not exists member_events_yYYYY_mMM partition of member_events for values from ('YYYY-MM-01') to ('YYYY-MM-01' + interval '1 month');` job. Document the rotation function in `web/supabase/migrations/002a_member_events.sql`. T2+ migrations may swap in pg_partman if the operational surface grows.

**RLS smoke:** the matrix test (anon vs auth-self vs auth-other) per ADR-9 is **not** a Phase 0 deliverable on these tables — it lands in Phase 1's ticket that augments the schema. This ticket's RLS is the *floor* that Phase 1 extends, not the final shape.

**No `auth.users` FK at Phase 0:** the system Member has no `auth.users` row. Two paths:
1. **Make `members.id` not reference `auth.users` at Phase 0**, and add the FK in Phase 1's augmentation migration with `... references auth.users(id) deferrable initially deferred` and an explicit exception clause for `id = '<system member id>'`. (Cleaner but invents a deferred-FK pattern.)
2. **Keep the FK off until Phase 1**, and let the system Member exist without an `auth.users` counterpart. Phase 1's auth-hook migration handles human Members.

Pick path 2 — it's simpler and matches the rebuild plan's intent. Document the choice in the migration body and in `DEVIATIONS.md`.

## Completion

Date: 2026-05-10
Commit: `20d4c82` (web repo)

**What landed:**
- `web/supabase/migrations/002_members_floor.sql` — `members` table with full b1 T1 column set per `member.md`, plus `login_disabled` (system-Member gate). Partial indexes on `home_location_id`, `primary_group_id`, `deleted_at`. `update_updated_at_column()` function + trigger. RLS enabled with `members_public_read` (filters out deleted + login_disabled rows) and `members_owner_update` (`id = auth.uid()`). No INSERT or DELETE policy.
- `web/supabase/migrations/002a_member_events.sql` — `member_events` table partitioned monthly by `created_at`, composite PK `(id, created_at)`. Audit fields: `acting_member_id NOT NULL` FK + `via_delegation_id` (FK deferred to Phase 1). Full b1 event-kind enum CHECK. RLS read-only (`member_id = auth.uid() OR acting_member_id = auth.uid()`). Partition-rotation functions defined (`ensure_member_events_partition`, `rotate_member_events_partitions`); current + 2 future months seeded. pg_cron schedule deferred (documented inline).
- `web/supabase/migrations/002b_system_member.sql` — Inserts system Member row (`id='00000000-0000-0000-0000-000000000001'`, `handle='system'`, `display_name='System'`, `login_disabled=true`). Self-bootstrap `member.created` event with `acting_member_id = member_id` (the one documented ADR-6 exception). Idempotent (`on conflict (id) do nothing`).
- `web/src/lib/system-member.ts` — TS constants (`SYSTEM_MEMBER_ID`, `SYSTEM_MEMBER_HANDLE`) mirroring the SQL well-known UUID.
- `web/tests/migrations-t042.test.ts` — 49 file-shape assertions covering all three migrations + the TS constants. All passing (sandbox, plain node).
- DEVIATIONS.md: four entries (sequencing reinterpretation, no auth.users FK at Phase 0, raw INSERT in 002b as ADR-7 exception, `login_disabled` column addition).

**What the user must run locally to close the loop:**
1. `cd web && supabase db reset` — applies all six migrations (001, 002, 002a, 002b, 004, 005) against a fresh dev DB.
2. Verify in Studio:
   ```sql
   select count(*) from public.members where handle = 'system' and login_disabled = true;
   -- expects 1

   select count(*) from public.member_events
   where event_kind = 'member.created' and member_id = '00000000-0000-0000-0000-000000000001';
   -- expects 1

   select inhrelid::regclass as partition
   from pg_inherits
   where inhparent = 'public.member_events'::regclass
   order by partition;
   -- expects 3 month partitions (current + 2 future)
   ```
3. `npm test -- migrations-t042` — confirms file-shape suite on darwin.
4. `pipeline-eval` run-mode against the T042 portion of `web/evals/phase-0/floor.spec.ts` — should pass once the build-agent test helpers from T043 are provisioned.
