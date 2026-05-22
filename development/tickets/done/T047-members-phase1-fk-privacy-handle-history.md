# T047 — Members augmentation: FK fortification + privacy + handle history (`009_members_phase1.sql`)

**Scenario:** `planning/rebuild-plan.md` § Phase 1 — Member surface (007 series in the plan; renumbered to 009 per the Phase 1 dependency ordering — locations took 007/008).
**Status:** Complete
**Completed:** 2026-05-11T17:12:59-07:00
**Bundle:** b1
**Depends on:** T042 (members floor), T045 (locations spine — for `home_location_id` FK target), T046 (locations RLS fix-forward — kept paired for clean migration sequencing)

**Serves:**
- **Loop:** All five loop families indirectly — Members are the anchor primitive every other Item / Group / Location ultimately points at. Privacy controls and the audited handle-history substrate are pre-requisites for Loop 8 (Follow people) and the Loop 1-12 surface set that exposes Member-authored content.
- **Canonical example:** Any Member-shaped row in the canonical example set — Brian's Run Club host, Maya's sourdough Maker, Aaron's pickup ringleader. All require the augmented Member surface to land before their Items / Groups / Locations can be wired in.
- **Primitive shape:** Person (Member) → … The anchor primitive itself. No shell entity owns these Members.

## Workflow gates (mandatory during the rebuild phase per `CLAUDE.md` § Rebuild phase — special rules)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode).
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies.
- [ ] **DEVIATIONS.md entry** appended at ticket close. Expected items: (a) FK-via-trigger pattern for `members.id → auth.users.id` with system-Member exception (Postgres CHECK can't subquery); (b) renumbering from rebuild plan's `007_*` to `009_*` because locations took `007/008`.

## Acceptance Criteria

### Migration `web/supabase/migrations/009_members_phase1.sql`

**`public.members` augmentations — three changes:**

- [ ] Add FK `home_location_id → public.locations(id) on delete set null`. T042 reserved the column without FK; T045 made the target available. Use `alter table public.members add constraint members_home_location_fkey foreign key (home_location_id) references public.locations(id) on delete set null not valid;` then `alter table public.members validate constraint members_home_location_fkey;` — the two-step pattern avoids a table scan locking writes (a defensive default even at b1 when there's no data).
- [ ] Add CHECK constraint enforcing `members.id` either equals the system-Member id OR exists in `auth.users`. CHECK cannot subquery, so implement via a **constraint trigger** (NOT NULL DEFERRABLE INITIALLY DEFERRED) that runs `select 1 from auth.users where id = new.id` and raises if not found and `new.id != '00000000-0000-0000-0000-000000000001'`. Function name: `public.assert_member_id_in_auth_users()` with `security definer set search_path = public, auth`. Trigger fires `after insert or update of id` on `public.members`.
- [ ] Do **NOT** add `primary_group_id` FK to `public.groups(id)`. Groups doesn't exist yet — that FK lands in a later "Phase 1 Members FK closeout" ticket once T0NN-groups ships.

**`public.member_privacy` (per `member.md` § Data model implications):**

- [ ] Table with columns: `member_id uuid primary key references public.members(id) on delete cascade`, `profile_visibility text not null default 'public' check (profile_visibility in ('public','unlisted','members_only'))`, `show_items_on_profile boolean not null default true`, `show_following boolean not null default false`, `show_followers boolean not null default false`, `allow_direct_messages boolean not null default true`, `locality_precision text not null default 'city' check (locality_precision in ('city','neighborhood','none'))`, `updated_at timestamptz not null default now()`.
- [ ] Updated-at trigger reusing `public.update_updated_at_column()` (defined in `002_members.sql`).
- [ ] RLS enabled. Policies: `member_privacy_owner_read` (`for select using (member_id = auth.uid())`), `member_privacy_owner_update` (`for update using (member_id = auth.uid())`). No INSERT/DELETE policy — action-layer-only writes; inserts happen via the bootstrap trigger below.
- [ ] **Bootstrap trigger on `public.members`:** function `public.create_member_privacy_defaults()` fires `after insert on public.members for each row` and inserts a `member_privacy` row with default values keyed by `new.id`. `security definer set search_path = public`. On conflict do nothing so the bootstrap is idempotent.
- [ ] **Backfill** for the system-Member row inserted in `002_members.sql`: `insert into public.member_privacy (member_id) values ('00000000-0000-0000-0000-000000000001') on conflict do nothing;`. The bootstrap trigger fires only on future inserts; existing rows (the system Member) need an explicit backfill.

**`public.member_handle_history` (T2 placeholder per `member.md` line 294):**

- [ ] Table: `member_id uuid not null references public.members(id) on delete cascade`, `handle text not null check (char_length(handle) between 4 and 30 and handle ~ '^[a-z0-9-]+$')`, `changed_at timestamptz not null default now()`, composite PK on `(member_id, handle)`. No index beyond the PK.
- [ ] RLS enabled. `member_handle_history_owner_read` (`for select using (member_id = auth.uid())`). No INSERT/UPDATE/DELETE policy.
- [ ] No bootstrap trigger — handle changes are an action-handler-driven write (`member.handle.set`) that will land at the T2 surface.

### Tests / build-side assertions

- [ ] `web/tests/migrations-t047.test.ts` — file-shape suite (~30 assertions across: directory state has 009, members FK additions present, constraint trigger function defined, member_privacy table shape + RLS, bootstrap trigger function defined + attached, system-Member backfill present, member_handle_history shape + RLS, no `primary_group_id` FK in this migration).
- [ ] Sandbox `node` smoke run matches the Vitest suite.
- [ ] `supabase db reset` runs cleanly with all eight migrations (001, 002, 004, 005, 006, 007, 008, 009).
- [ ] Studio smoke verification (after build):
  - [ ] `\d public.members` — confirms `home_location_id` has FK; `id` does NOT have an FK constraint (the check is via trigger).
  - [ ] `select count(*) from public.member_privacy;` — returns 1 (system Member backfilled).
  - [ ] Insert a row directly into `public.members` with a valid `auth.users` id (in a test transaction) — verify `member_privacy` row is auto-created. Rollback.
  - [ ] Insert a row into `public.members` with a non-existent `id` — verify the trigger raises `member id not in auth.users (and not system)`.
- [ ] BUILD-LOG.md updated.

## Notes

**Why a constraint trigger, not a real FK.** Postgres FK to `auth.users` would reject the system-Member row that lives in `public.members` without an `auth.users` counterpart. CHECK constraints can't subquery. The realistic patterns are: (a) a constraint trigger that subqueries explicitly (this ticket's choice), or (b) skip the constraint entirely and rely on the action layer. Option (a) preserves the schema-level guarantee while admitting the system-Member exception. The trigger is `DEFERRABLE INITIALLY DEFERRED` so the action handler can insert the auth.users row and the members row in any order within a single transaction.

**Why `not valid` + `validate` for the locations FK.** Zero rows today, so the validation is a no-op. The pattern is muscle memory for future Member-augmentation migrations that may run against a populated members table. Cheap to learn now; expensive to forget later.

**Privacy bootstrap pattern.** Mirrors how `member_privacy` rows must exist for every Member from the day they sign up. The action handler `member.create` (T043) creates the `members` row; the bootstrap trigger then creates `member_privacy`. The action handler doesn't need to know about `member_privacy` — the table is auto-populated. This keeps action-handler bodies small and the privacy invariant DB-enforced.

**Handle history is placeholder only at b1.** No surface, no write triggers. The action handler `member.handle.set` (T2) will write rows here. The table exists at b1 so its FK target is in place when the T2 handler ships.

**Schema-spec divergence — `id` FK.** `member.md` line 181 declares `id uuid primary key references auth.users(id) on delete cascade`. This ticket deviates: no straight FK, constraint-trigger instead. Reason: system-Member exception. Record in DEVIATIONS at close.

**Numbering.** Rebuild plan numbered members augmentation `007a–007d`. Renumbered to `009_members_phase1.sql` (single consolidated migration) because (a) locations took 007/008 per the Phase 1 dependency reorder recorded in T045's DEVIATIONS, and (b) Supabase CLI rejects alpha-suffixed numbering per T042's consolidation lesson. Record in DEVIATIONS at close.

**Forward-looking columns not addressed here:** `embedding_id` reservation on `members` (already in T042). `via_delegation_id` FK on `member_events` lands in T050 alongside `member_delegations`.

## Completion

Date: 2026-05-11
Commit: (web/) T047 — see web repo HEAD

**Files shipped:**
- `web/supabase/migrations/009_members_phase1.sql` — three logical sections (members augmentations, member_privacy + bootstrap, member_handle_history). M2 polish applied in fast-follow commit (suggestions 1–3 from the code review).
- `web/tests/migrations-t047.test.ts` — 27 file-shape Vitest assertions across 5 describe blocks (directory state, members FK additions, member_privacy table, bootstrap trigger + comment on function, member_handle_history).

**Build-side verification:**
- Plain-node smoke run (sandbox): 27/27 passing. Vitest in the sandbox was unrunnable (`@rolldown/binding-linux-x64-gnu` missing — the install was darwin-side); the plain-node script `/Users/don/.../outputs/t047-smoke.mjs` mirrors the test file's regex assertions one-for-one.

**M2 code review (engineering:code-review, 2026-05-11) — PROCEED with three non-blocking suggestions, all incorporated in fast-follow:**
1. `member_privacy_owner_update` policy now has an explicit `with check (member_id = auth.uid())` clause in addition to `using`. Defensive against future Postgres semantics drift; reads more clearly.
2. `create_member_privacy_defaults()` function now carries a `comment on function`, matching the convention used for `assert_member_id_in_auth_users()`.
3. Migration header now documents the trigger ordering on `public.members` AFTER INSERT — bootstrap runs immediately (regular row trigger); constraint trigger runs at COMMIT (DEFERRABLE INITIALLY DEFERRED). A rollback from the constraint trigger correctly rolls back the privacy row created by the bootstrap.

**Runtime verification (deferred to local + eval):**
- `supabase db reset` end-to-end with all eight migrations — the user runs this locally; the file-shape pass is the build-agent's contract per T043 DEVIATIONS pattern.
- Studio smoke queries (`\d public.members`, system-Member backfill row count, bootstrap-trigger insert behavior, constraint-trigger raise on invalid id) — covered by the F### eval run (`pipeline-eval` next).

**Workflow gates:**
- [x] **M2 — `engineering:code-review`** — PROCEED 2026-05-11; suggestions 1–3 incorporated.
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — pending; invoke before any merge to main.
- [x] **DEVIATIONS.md entry** appended at ticket close — two entries (constraint-trigger pattern for `members.id`; renumber 007 → 009).

**Carried over from the M2 review (not a T047 fix):**
- Item 4 — `member_handle_history` composite PK on `(member_id, handle)` prevents a Member from re-claiming a previously-used handle. b1 spec-aligned (placeholder schema only); flagged for `pipeline-product` when the b2 `member.handle.set` surface scopes. See JOURNAL.md for the decision on timing.
