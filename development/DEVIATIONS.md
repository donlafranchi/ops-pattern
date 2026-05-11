# DEVIATIONS.md — Implementation Drift Log

When implementation diverges from spec, log it here with context.

**Format:**

```markdown
## {Date} — {Ticket} — {Title}

**Deviation:** {What differs from spec}

**Reason:** {Why}

**Impact:** {What changes for downstream?}

**Escalation:** Escalated to {Planning / Product}

**Resolution:** {How was it resolved?}
```

(Log entries as they occur)

## 2026-05-10 — T041 — Migrations wipe absorbed into Phase 0 (rebuild-plan ordering bug)

**Deviation:** The rebuild plan (`notes/migration-to-primitives.md`) places the "drop all existing migrations" pre-step in Phase 1, but the existing `web/supabase/migrations/001_initial_schema.sql` through `006_rollup_vendor_stats.sql` collide with Phase 0's new 001–006 numbering. T041 cannot land its migrations without the wipe happening first.

**Reason:** The rebuild plan was drafted before the new 001–006 numbering was finalized. The plan's Phase 1 pre-step language ("drop all existing migrations") logically must precede Phase 0's first migration; the placement in Phase 1 is a sequencing oversight.

**Impact:** T041 now performs the migrations-directory wipe as an explicit first pre-step before writing 001_extensions.sql / 004_item_embeddings.sql / 005_member_embeddings.sql. The development database must be reset (`supabase db reset`) after T041's pre-step. No app code under `web/src/` is touched in T041 — Phase 1+ tickets handle code deletion of routes / business-logic / components that referenced the legacy schema.

**Escalation:** Flagged for `pipeline-plan` to amend the rebuild plan's section ordering when convenient. The work itself is unblocked.

**Resolution:** T041 pre-step deletes the six legacy migration files. T041's three new migrations land in their place. The Phase 0 invariant spec at `web/evals/phase-0/floor.spec.ts` is the runtime oracle; the build-side file-shape assertions are in `web/tests/migrations-phase-0.test.ts` (15/15 passing 2026-05-10).

## 2026-05-10 — T041 — No FK to items/members on embedding tables (deferred)

**Deviation:** `item_embeddings.item_id` and `member_embeddings.member_id` are declared as plain `uuid` columns at Phase 0, without foreign-key constraints to `items(id)` / `members(id)`.

**Reason:** The rebuild plan numbers Phase 0 migrations 001–006 before Phase 1's full schema (007+ for items/members augmentation). The `items` table does not exist until Phase 1's items-spine ticket. T042 lands the minimal `members` table immediately after T041; the `member_embeddings` FK could be added by T042 or deferred to Phase 1 alongside the items FK addition.

**Impact:** Embedding-row inserts are technically possible without a parent row at Phase 0. Acceptable because (a) no embedding-write surface ships at b1 — these tables are reserved substrate; (b) the FK lands before any T3 embedding pipeline runs.

**Escalation:** None — recorded for traceability. The deferred FK addition is documented inline in both migration files as a `-- alter table ... add constraint ...` comment block.

**Resolution:** FK constraints added by the Phase 1 ticket that creates `items` (for item_embeddings) and either T042 or the Phase 1 members-augmentation ticket (for member_embeddings).

## 2026-05-10 — T042 — Phase 0 pre-pulls minimal members + member_events from Phase 1

**Deviation:** The rebuild plan (`notes/migration-to-primitives.md`) lists `002_system_member.sql` as a Phase 0 migration that inserts the system Member, but does NOT list a migration that creates the `members` table — that responsibility appears only in Phase 1 as `007_members.sql`. The insert cannot run without the table.

**Reason:** Plan-level sequencing oversight. T042 resolves the gap by pulling a minimal `members` + `member_events` shape forward into Phase 0 (migrations 002 + 002a + 002b). Phase 1's `007_*` series augments — adds `member_privacy`, `member_interests`, `member_follows`, `member_handle_history`, `member_threads` + messages + participants, `member_self_records`, `member_delegations`, `member_location_affinities`, and the FK constraints to `auth.users` / `locations` / `groups` that depend on tables Phase 1 creates.

**Impact:** T042 lands a working `members` table at Phase 0. Phase 1's `007_*` series gets shaped as ALTER additions rather than fresh table creation. The b1 T1 column set from `member.md` Data-model-implications is ALL present at Phase 0 (handle, display_name, bio, avatar, pronouns, home_location_id, primary_group_id, stakeholder_visibility, maker_mode_enabled, embedding_id, soft-delete, timestamps) — only the FK constraints to other tables wait.

**Escalation:** Flagged for `pipeline-plan` to amend the rebuild plan's section ordering when convenient. The work itself is unblocked.

**Resolution:** Three Phase 0 migrations: `002_members_floor.sql`, `002a_member_events.sql`, `002b_system_member.sql`. T041 + T042 migrations apply cleanly. 49/49 file-shape tests passing 2026-05-10.

## 2026-05-10 — T042 — members.id has no FK to auth.users at Phase 0

**Deviation:** Per `member.md` Data-model-implications, `members.id` is `uuid primary key references auth.users(id) on delete cascade`. T042's `002_members_floor.sql` declares `id uuid primary key default gen_random_uuid()` with NO FK.

**Reason:** The system Member (handle='system', login_disabled=true) has no `auth.users` counterpart — it's a platform-side actor for ADR-6 audit-field references. With the FK in place, the system Member row cannot exist. Two paths considered (T042 Notes); path 2 chosen — keep FK off at Phase 0, add in Phase 1 with an explicit exception clause for the system-Member id.

**Impact:** Phase 0 + early Phase 1 work writes `members.id` from the action handler with the `auth.users.id` value, but without the DB-level constraint that the auth row exists. Acceptable because (a) the only Phase-0 inserter is the auth signup hook in T044, which by construction passes the new `auth.users.id`; (b) the system Member is the one row that legitimately violates the FK shape.

**Escalation:** None — Phase 1's members-augmentation migration adds the FK. Documented in `002_members_floor.sql` comments + `web/src/lib/system-member.ts`.

**Resolution:** Phase 1's `007_*` augmentation migration adds the FK with a `not valid` / `validate constraint` two-step OR with an exception clause for the system Member id.

## 2026-05-10 — T042 — Raw INSERT in 002b_system_member.sql (ADR-7 exception)

**Deviation:** Per ADR-7, the action layer is the only write surface to `members` and `member_events`. `002b_system_member.sql` uses raw `INSERT` to land the system Member row + bootstrap event.

**Reason:** The action layer (T043) does not exist yet — T042 lands the substrate it needs. Catch-22 resolved by treating this ONE migration as the documented exception. The system Member is also unique in that its bootstrap `member.created` event self-references (`acting_member_id = member_id`), which is otherwise forbidden by ADR-6.

**Impact:** The CI action-layer conformance check (added in T043) must whitelist `002b_system_member.sql` as an allowed direct-write path. After T043 lands, no further raw inserts to `members` or `member_events` are permitted.

**Escalation:** None — recorded for traceability and for the T043 conformance-check whitelist.

**Resolution:** The conformance check in T043 lists `web/supabase/migrations/002b_system_member.sql` as the one explicit exception. The self-reference exception in `member_events` (acting_member_id = member_id) applies only to the bootstrap row and is documented in `002b_system_member.sql` comments.

## 2026-05-10 — T042 — Added `login_disabled` column not in member.md

**Deviation:** `member.md` Data-model-implications does not list a `login_disabled` column. T042 adds `login_disabled boolean not null default false` to `members`.

**Reason:** The system Member needs a way to be queryable as "this row exists for audit-field references but cannot be logged in as." The `members_public_read` RLS policy filters on `login_disabled = false`, keeping the system Member invisible to anon and authed clients. The auth signup hook (T044) and the action layer login path refuse to provision a session for any `login_disabled = true` row.

**Impact:** None for human Members (default `false`). The column exists primarily for the system Member and future automation accounts.

**Escalation:** None — flag for `member.md` to incorporate `login_disabled` in its T1 column list at the next spec-tree cleanup.

**Resolution:** Column documented in `002_members_floor.sql` comments. The `members_public_read` RLS policy enforces visibility. Forward fix: PM adds `login_disabled` to `member.md` Data-model-implications.

## 2026-05-10 — T042 (fix-forward) — Consolidated 002+002a+002b into single 002_members.sql (Supabase CLI rejects alpha suffixes)

**Deviation:** T042's original three migration files (`002_members_floor.sql`, `002a_member_events.sql`, `002b_system_member.sql`) were silently skipped on `supabase db reset` because the CLI rejects filenames that don't match `<integer>_name.sql`. Output observed:

```
Skipping migration 002a_member_events.sql... (file name must match pattern "<timestamp>_name.sql")
Skipping migration 002b_system_member.sql... (file name must match pattern "<timestamp>_name.sql")
```

Result: only the `members` table got created — `member_events` table did NOT exist, and the system Member row was NOT inserted.

**Reason:** The Supabase CLI's migration parser allows short numeric prefixes (`001`, `002`) but rejects alpha suffixes (`002a`, `002b`). The error is informational only; the migration is skipped rather than failing the run, which makes the bug easy to miss.

**Impact:** Fix-forward: consolidate the three Phase 0 Members migrations into a single `002_members.sql` (semantically atomic anyway — the system Member insert depends on both tables existing). T041's commit `923d2ef` remains in history; T042's original commit `20d4c82` also remains; the fix-forward commit lands the consolidated file + deletes the three originals.

**Escalation:** None — fix-forward is in-scope per the pipeline-build workflow.

**Resolution:** `002_members.sql` consolidates the three files. Tests updated (`web/tests/migrations-t042.test.ts` — 38 assertions, all passing). The consolidated file applies cleanly when the user runs `supabase db reset` — verified by re-reading the output.

**Going-forward rule for the project:** all migration filenames must match `^\d+_[a-z0-9_]+\.sql$`. No alpha-suffixed numbering. If two migrations need to land semantically together, either consolidate into one file OR use sequential integers (`002`, `003`, etc.) and renumber downstream. The test suite enforces this with a per-file regex check.

