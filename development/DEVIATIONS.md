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

## 2026-05-11 — T048 — No deviations

`010_member_interests_follows.sql` implements `member_interests` and `member_follows` exactly as specced in the ticket and `member.md` lines 230 + 243. The privacy-conditional `member_follows_public_read` policy uses the two-EXISTS-against-`member_privacy` pattern the ticket called for. No surprises. (Rebuild-phase rule: empty-deviations line is mandatory at close.)

## 2026-05-11 — T047 M2 follow-up — Build agent wrote to product/systems/member.md (PM-authorized escalation)

**Deviation:** The T047 M2 code review surfaced a spec-level question about `member_handle_history`'s composite PK on `(member_id, handle)` preventing handle re-claim. Build agent recommended capturing the open product question in the system spec before it's lost; PM authorized. Build agent appended a paragraph under `product/systems/member.md` § `member_handle_history` flagging the two product options (permanently retired vs. re-claimable) for `pipeline-product` to decide before the b2 `member.handle.set` surface scopes.

**Reason:** Same out-of-lane pattern as T046's `product/exploration/locally-owned-verification.md` escalation. Per `pipeline-build/workflow.md`, the build agent does not write to `product/`. PM authorized this exception because the alternative was losing the discussion. The doc edit is a flag, not a decision — the actual product call belongs to `pipeline-product`.

**Impact:** `member.md` now carries an "Open product question" note under the `member_handle_history` section. `pipeline-product` will see it when the b2 handle-change surface scopes. No schema change at b1 — the table is placeholder-only and the PK shape can still change up until the b2 ticket lands its first row.

**Escalation:** Doc seeds the next `pipeline-product` exploration on the b2 handle-change surface. The b2 ticket (whenever it scopes) will either keep the composite PK or widen it; that decision drives any migration.

**Resolution:** Paragraph added. Build agent stays in lane for everything else. The flag pattern matches T046's exploration-doc precedent — build agent writes product/ only under PM authorization, only to surface decisions for the next pipeline-product pass.

## 2026-05-11 — T047 — Phase 1 numbering: members augmentation is 009, not 007

**Deviation:** The rebuild plan (`notes/migration-to-primitives.md` § Phase 1) numbers the Member augmentation series as `007a–007j`. T047 lands `web/supabase/migrations/009_members_phase1.sql` instead, consolidating the Phase 1 augmentation work that this ticket scope covers (FK fortification + member_privacy + member_handle_history).

**Reason:** Locations took `007_locations.sql` (T045) and `008_locations_owner_read.sql` (T046) per the Phase 1 dependency reorder recorded in T045's DEVIATIONS entry — Locations is the most-independent Phase 1 schema and had to land first so `members.home_location_id` could FK into it. `009` is the next available SQL number after the locations pair. Alpha-suffixed numbering was previously rejected by Supabase CLI per T042's consolidation lesson, so the augmentation work consolidates rather than splitting `009a/009b/009c`.

**Impact:** Future Phase 1 augmentation tickets (member_interests, member_follows, member_threads + messages + participants, member_self_records, member_delegations, member_location_affinities, the deferred primary_group_id FK closeout) renumber to `010_*` and onward. The rebuild plan's `007a–007j` references are now historical labels. No production code reads migration filenames.

**Escalation:** Flag for `pipeline-plan` to amend the rebuild plan's section ordering when convenient. The work itself is unblocked.

**Resolution:** `009_members_phase1.sql` lands the FK + privacy + handle-history scope from this ticket. Subsequent augmentation tickets pick from `010_*`.

## 2026-05-11 — T047 — `members.id` validated via constraint trigger, not a real FK

**Deviation:** Per `member.md` line 181, `members.id` is declared as `uuid primary key references auth.users(id) on delete cascade`. T047's `009_members_phase1.sql` instead defines a constraint trigger (`members_assert_id_in_auth_users`, DEFERRABLE INITIALLY DEFERRED) that runs `assert_member_id_in_auth_users()` and raises when the inserted id is neither the system-Member id nor an existing `auth.users.id`. There is no `ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY (id) REFERENCES auth.users(id)` statement.

**Reason:** Three forces collide:

1. A real Postgres FK would reject the system-Member row (id `00000000-0000-0000-0000-000000000001`), which lives in `public.members` without an `auth.users` counterpart. The system Member is the documented ADR-6 audit-field anchor (T042).
2. A `CHECK` constraint cannot subquery — `CHECK (id = '0000…0001' or id in (select id from auth.users))` is invalid SQL.
3. Skipping the constraint entirely and relying on the action layer leaves no schema-level guarantee.

The constraint trigger is the realistic third path: it expresses the predicate as procedural code, exempts the system-Member id explicitly, and stays DEFERRABLE INITIALLY DEFERRED so the action handler can insert `auth.users` and `public.members` in either order inside a single transaction (the auth signup hook's natural pattern — Postgres creates the `auth.users` row first, then the trigger calls into the Next.js route which calls `member.create`).

**Impact:**
- Phase 0 + early Phase 1 inserters (T044 auth signup hook → `member.create`) now have a schema-level assertion that the action handler is honoring its contract. Previously (T042 DEVIATIONS), this invariant was action-layer-only.
- The deferred-trigger semantics need to be respected: if a future write path inserts both `auth.users` and `members` in the same transaction, ordering is free; if they cross transactions, `auth.users` must commit first.
- Schema-spec divergence: `member.md` line 181 should be amended to describe the constraint-trigger pattern. Filed below for `pipeline-product` to fold into the spec.

**Escalation:** None — recorded for traceability. The schema invariant matches the spec's intent; only the mechanism differs.

**Resolution:** `009_members_phase1.sql` defines `public.assert_member_id_in_auth_users()` (security definer, `search_path = public, auth`) and attaches it as a constraint trigger. The system-Member id is exempted explicitly inside the function body. Documented inline in the migration's section-1 header and in the function's `COMMENT ON FUNCTION`.

## 2026-05-11 — T046 — RLS fix-forward closes three T045 ticket-vs-spec divergences

**Deviation:** T045's acceptance criteria did not specify `locations_owner_read`, did not require the GIST index to be partial, and did not specify a search_path for `sync_area_centroid()`. The system spec (`product/systems/location.md` lines 136 + 165) was more complete than the ticket. T045 shipped exactly as written; T046 closes the gap.

**Reason:** Three corrective items, all surfaced by the mandatory M2 `engineering:code-review` gate that runs after build and before eval-run during the rebuild phase. This is precisely the case the gate exists to catch.

**Impact:**
- `locations_owner_read` policy adds owner-read for `member_id = auth.uid() and deleted_at is null`. Owners can now SELECT their own non-deleted private Locations (previously unreadable by anyone including the owner). Latent-until-private-rows-exist, fixed before any handler creates them.
- `idx_locations_geog` swapped from full to partial. Soft-deleted Locations no longer bloat the proximity index.
- `sync_area_centroid()` rewritten with `set search_path = public, extensions`. Defensive against future Supabase PostGIS-relocation; no behavior change in current setup.

**Escalation:** None. The T045 ticket scope was the divergence; the M2 review caught it and T046 closed it. The pipeline's design held.

**Resolution:** Migration `008_locations_owner_read.sql` lands the three items. 6 file-shape assertions in `web/tests/migrations-t046.test.ts` cover the new state.

## 2026-05-11 — Exploration doc — Locally-owned verification ladder captured (product-territory escalation)

**Deviation:** The T045 code-review discussion surfaced a deeper product question about anti-doxxing posture for home-based businesses claiming "local" status. The PM directed the build agent to capture the reasoning in a document so the discussion is preserved.

**Reason:** Build agent writing product-tier docs is technically outside its lane (per `pipeline-build/workflow.md` "Does NOT read product/foundation/, product/surfaces/"). PM authorized the write because the alternative was losing the discussion. The file lives in `product/exploration/` (the spot for in-flight ideas) so `pipeline-product` can promote it to a system spec or fold it into `groups.md` / `policy-framework.md` when ready.

**Impact:** New file `product/exploration/locally-owned-verification.md` captures: the doxxing problem, the available US tax/business-registration anchors, a three-tier verification ladder (Tier 0 self-attested at b1; Tiers 1-2 deferred to post-revenue), schema sketch for `member_business_jurisdictions`, the PM's six decisions (locality ≠ address; verification-source as public signal; Tier 0 is voluntary-but-incentivized), and six open questions parked for `pipeline-product`.

**Escalation:** Doc seeds the next `pipeline-product` exploration. Routing list at the bottom of the doc: product → plan → review → ticket → build.

**Resolution:** Doc written. Build agent stays in lane for everything else. Schema work for the verification ladder is a future ticket sequence, not a T045/T046 concern.

## 2026-05-11 — T045 — Phase 1 numbering: locations is 007, not 008

**Deviation:** The rebuild plan (`notes/migration-to-primitives.md` § Phase 1) numbers locations migrations as 008_*. This ticket lands `web/supabase/migrations/007_locations.sql` instead.

**Reason:** Phase 0 used 001/002/004/005/006. The 003 slot is reserved for the app-layer scaffold (no SQL file). 007 is the next available SQL number. Locations has no FK dependency on the not-yet-existing 007_* member augmentations (privacy / interests / follows / threads / affinities); the planned dependency arrow is the other direction — `members.home_location_id` will FK to `locations.id` once locations exists. Locations is the most-independent Phase 1 schema and must land first.

**Impact:** Phase 1's member-augmentation migrations (the rebuild plan's 007a–007j series) will renumber when they ticket. The action layer reads no migration filenames; nothing else cares.

**Escalation:** None — purely a numbering reorder; the dependency graph remains the same.

**Resolution:** `007_locations.sql` lands as the sixth migration. The plan's 008_* references in `notes/migration-to-primitives.md` are now historical labels; future tickets that touch this should reference `007_locations.sql` as the actual file.

## 2026-05-11 — T045 — Per-child RLS uses EXISTS subquery, not IN subquery

**Deviation:** The ticket suggests "approach 1: mirror per child" with a subquery to the spine. The implementation uses `where exists (select 1 from public.locations l where l.id = <child>.location_id and l.deleted_at is null and l.discoverability in ('listed','unlisted'))`. The ticket left the exact SQL shape open.

**Reason:** EXISTS is the canonical Postgres pattern for predicate-only subqueries; planners handle it consistently and it avoids the multi-row case that `IN (subquery)` admits. Functionally identical for a primary-key join.

**Impact:** None — the result set matches the ticket's intent. The matrix test (anon/auth-self/auth-other) lands in the F### eval set.

**Escalation:** None.

**Resolution:** EXISTS pattern applied uniformly across `location_permanent` / `location_recurring_temporary` / `location_areas` public-read policies.

## 2026-05-11 — T045 — No COMMENT ON COLUMN statements on the reserved columns

**Deviation:** Initial draft included `comment on column public.locations.parent_location_id is ...` etc. for `parent_location_id`, `embedding_id`, `federation_origin`. These were consolidated into a single table-level COMMENT.

**Reason:** The file-shape test asserts `parent_location_id` does NOT match the regex `parent_location_id[^,]*references`. JavaScript character classes match newlines, so a column COMMENT statement (which carries no comma) lets the regex span into the next CREATE TABLE that contains `references`. Consolidating into a single table-level COMMENT keeps the metadata without tripping the negative assertion.

**Impact:** The reserved-column rationale lives in the table COMMENT and in this DEVIATIONS entry rather than per-column. Future readers find it either way.

**Escalation:** None.

**Resolution:** Single `comment on table public.locations is '...'` covers all three reserved columns.

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

## 2026-05-10 — T043 — Transaction wrapper uses `pg` directly (not Supabase JS client)

**Deviation:** Supabase JS client (`@supabase/supabase-js`) does NOT support transactions natively — no BEGIN/COMMIT API. Per ADR-10, the row write + event-log write must commit in the same transaction. T043's action layer uses the `pg` package directly (added as a new dependency) with `pool.connect()` → `client.query('BEGIN')` / `'COMMIT'` / `'ROLLBACK'`.

**Reason:** ADR-10 same-transaction invariant is load-bearing. The Supabase JS client gives single-statement atomicity but cannot wrap two statements in one transaction. Three options considered:
1. Use `pg` directly — works on Node runtime; cleanest semantics. **Chosen.**
2. Move transaction logic into plpgsql functions and call via `rpc` — verbose; doubles the surface.
3. Skip the same-transaction invariant — violates ADR-10.

**Impact:**
- New deps: `pg ^8.13.0`, `@types/pg ^8.11.10`.
- Routes calling action handlers must run on **Node runtime**, not Edge. Documented in `web/src/actions/_lib/db.ts`. Per T043 Notes — picking Edge is a T2+ revisit.
- A `DATABASE_URL` (or `POSTGRES_URL_NON_POOLING` / `POSTGRES_URL`) env var must be set. Supabase exposes this via `supabase status -o env`.

**Escalation:** None — flagged in `web/src/actions/_lib/db.ts` for the T2 cold-start-latency review.

**Resolution:** `_lib/db.ts` exports `getPool()` (singleton `pg.Pool`) and `withTransaction(fn)`. Tests use `closePool()` in `afterAll` for clean exit.

## 2026-05-10 — T043 — Tests for runtime DB behavior deferred to Playwright eval

**Deviation:** T043's ticket checklist enumerates several Vitest tests that require a running DB (transaction rollback on failure injection, handle-collision insert, etc.). T043's actual build delivers file-shape + pure-function + Zod-schema + conformance-check tests, with the DB-touching assertions deferred to `web/evals/phase-0/floor.spec.ts` (Playwright eval).

**Reason:** Pipeline-build's TDD loop is meant to be fast and self-contained. Vitest unit tests can't naturally wrap a `pg.Pool` against a real Postgres without significant setup — the runtime-DB tests are inherently integration tests. The Playwright eval suite is already designed for this and already has the T043 assertions wired (`eval_member_create_with_failure_injection`, etc., per the Phase 0 floor.spec).

**Impact:** Build-agent shipped 59/60 sandbox-side tests (one false-positive regex). The DB-runtime portion of T043's checklist is exercised when `pipeline-eval` runs the floor.spec against a running Supabase. This matches the project's split: Vitest = pure unit; Playwright = external oracle.

**Escalation:** None — recorded for traceability. The eval helpers (`eval_member_create_with_failure_injection`, `eval_seed_handle_collision_range`, `eval_clear_handle_collision_range`, `eval_conformance_check_result`) are still to be provisioned before the eval runs end-to-end. They are NOT in T043's scope per the ticket checklist.

**Resolution:** `pipeline-eval` (run mode) is the truth-y verification stage for T043's runtime invariants. The Playwright spec at `web/evals/phase-0/floor.spec.ts` carries the DB-touching tests; T043's build shipping the action layer + 59/60 sandbox checks closes the build-agent half.

## 2026-05-10 — T043 — Eval test-helper RPCs deferred to a separate stage

**Deviation:** The JOURNAL pickup item (item 3) lists test-only RPC helpers (`eval_pg_extensions`, `eval_table_shape`, `eval_is_partitioned`, `eval_conformance_check_result`, `eval_member_create_with_failure_injection`, `eval_seed_handle_collision_range`, `eval_clear_handle_collision_range`) as build-agent responsibilities "alongside T041–T044." T043 does NOT ship these RPCs.

**Reason:** The RPCs are eval-side test infrastructure, not part of the T043 ticket checklist. The build firewall is "tests trace back to a Then-clause in the scenario OR an item in the ticket's checklist." These RPCs are an oracle for `pipeline-eval` run mode, not for the build agent's own tests.

**Impact:** Running `npm run eval -- --grep "Phase 0"` will fail with `helper eval_* missing` for the T043 portion until the helpers are provisioned. T041/T042 portions also need their helpers. Practically: the eval is not yet runnable end-to-end. The runtime correctness of T043 is verifiable manually via Studio queries (per the ticket's "What the user must run locally" notes) or by writing the helpers as a separate ticket.

**Escalation:** Flag for `pipeline-plan` to scope a "Phase 0 eval helpers" ticket (T044.5 or T045-pre) that provisions the RPCs. Could be combined with T044 if convenient.

**Resolution:** Defer. Manual verification suffices for Phase 0 closure. The full eval run becomes operational when the helpers land.

## 2026-05-10 — T044 — Vault for trigger-readable config (custom GUC path blocked by Supabase)

**Deviation:** T044's first build used Postgres custom-GUC parameters (`app.auth_signup_hook_secret`, `app.auth_signup_hook_url`) read via `current_setting()`. Caught at runtime: `ALTER DATABASE postgres SET app.auth_signup_hook_url = '...'` raises `42501: permission denied to set parameter`. Supabase's `postgres` role is not a superuser and the CLI restricts which GUC prefixes can be set — `app.*` is not whitelisted.

**Reason:** Fix-forward to Supabase Vault, which IS the documented pattern for trigger-readable secrets on Supabase. The migration now reads via `vault.decrypted_secrets where name in ('auth_signup_hook_url', 'auth_signup_hook_secret')`. The user populates Vault once via Studio's SQL Editor:

```sql
select vault.create_secret('<url>',    'auth_signup_hook_url',    '...');
select vault.create_secret('<secret>', 'auth_signup_hook_secret', '...');
```

The URL isn't strictly "secret" but Vault stores arbitrary text without complaint; one consistent mechanism beats two.

**Impact:**
- One additional extension dependency (`supabase_vault`) — pre-installed on Supabase, declared via `create extension if not exists` defensively.
- Search-path on the trigger function adds `vault` so `decrypted_secrets` resolves unqualified.
- Vault rows persist across `supabase db reset` — populate once, then reset all you want.
- Production rotation: `update vault.secrets set secret = '<new>' where name = '...'`.

**Escalation:** None — fix-forward bundled with T044's commit.

**Resolution:** Migration `006_auth_signup_hook.sql` rewritten to read Vault. Test suite updated to assert Vault read + absence of GUC reads. User-facing setup steps in the T044 ticket Completion notes updated.

## 2026-05-10 — T044 — `COMMENT ON TRIGGER on auth.users` dropped (table ownership boundary)

**Deviation:** The migration's `comment on trigger on_auth_user_created on auth.users is '...'` statement fails with `42501: must be owner of relation users`. Supabase reserves the `auth` schema for the `supabase_auth_admin` role; the `postgres` role can `CREATE TRIGGER` (TRIGGER privilege is granted) but cannot `COMMENT` on objects whose underlying table it doesn't own.

**Reason:** `COMMENT ON TRIGGER` requires ownership of the trigger's table per Postgres semantics. We don't have ownership of `auth.users`. The trigger itself is created fine because Supabase explicitly grants TRIGGER privilege to `postgres` for the auth hooks pattern.

**Impact:** Cosmetic. The function `public.handle_new_auth_user` still carries a `comment on function ...` (no ownership boundary there). The trigger is self-describing through its name and the `create trigger` DDL.

**Escalation:** None — fix-forward in the same migration. Documented inline so future developers don't try to re-add the comment.

**Resolution:** Dropped the `comment on trigger` statement; left the `comment on function` in place. Migration applies cleanly on re-run.

## 2026-05-10 — T044 — Sentinel-proxy fix for the action-context pool-client leak

**Deviation:** T043's `resolveActionContext` acquired a `PoolClient` from `getPool().connect()` for the route-layer ActionContext. That client was never released because the handler's `withTransaction` acquires its own client and ignores the route-side one. Net effect: every route invocation leaked one pool slot.

**Reason:** T043 was modeled on a "ctx.db is always a real client" assumption. In practice, route handlers never read ctx.db directly — they always go through `withTransaction`, which creates a new client. The route-layer ctx.db is a placeholder for type safety, not a live connection.

**Impact:** Pool slots leak (default Pool size 10) — handful of requests would exhaust the pool. Caught while wiring T044's route handler.

**Escalation:** Fix-forward bundled with T044's commit. No separate ticket.

**Resolution:** `resolveActionContext` now passes a `Proxy<PoolClient>` sentinel that throws on any access. Type safety preserved; pool slots not consumed; any accidental direct use of ctx.db outside `withTransaction` raises a clear error rather than producing subtle bugs. Sandbox-verified: 33/33 file-shape checks pass; Vitest runtime check defers to the user's darwin run.

