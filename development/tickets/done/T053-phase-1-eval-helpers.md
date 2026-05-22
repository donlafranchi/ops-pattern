---
purpose: Ticket T053 — phase 1 eval helpers.
layer: how
status: reference
---

# T053 — Phase 1 eval helpers: provision four introspection RPCs the T045–T050 specs wait on

**Scenario:** None. Direct substrate unblock. Source: `web/evals/phase-1/*.spec.ts` (the Phase 1 verification specs from T045/T047/T048/T049/T050) call four helper RPCs that don't exist in `web/supabase/test-helpers/`, so 11 of 80 tests in `evals/phase-1/` fail with PGRST202 `Could not find the function`. Each failing test's `expect(error, "helper … missing — build adds: …").toBeNull()` annotation includes the exact `CREATE FUNCTION` body the spec author wanted shipped.
**Status:** Complete
**Bundle:** b1 (Phase 1 verification unblock — closes the substrate eval surface before Phase 2 starts)
**Depends on:** T045, T047, T048, T049, T050 (the schema surfaces these helpers introspect), T052 (the `web/supabase/test-helpers/` folder + `bootstrap-eval-helpers.ts` script + bootstrap idempotency pattern these new helpers extend). All six must have shipped build-side before this ticket starts; that is the case today.

**Serves:**
- **Loop:** All five (substrate). This ticket converts the Phase 1 substrate from "build complete; eval partially red" to "build + eval complete" for T045 / T047 / T048 / T049 / T050 — same shape as T052 did for Phase 0 / T041–T044.
- **Canonical example:** None directly — this is substrate. The introspection helpers it adds serve every Phase 1 canonical example by way of unblocking their evals.
- **Primitive shape:** None directly. Operates on the eval surface for Location + Person augmentation primitives.
- **What this unblocks:** The 10 currently-failing `evals/phase-1/*.spec.ts` tests listed in § Acceptance Criteria. Phase 1 exit criterion ("all tables exist; RLS matrix passes; action-handler conformance check passes; audit fields populated by handlers") becomes verifiable end-to-end after this ships.

## Workflow gates (mandatory during the migration phase per `_attic/2026-05-19/planning/PIPELINE-AUDIT.md`)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit (per the rebuild-phase rule: code-review pulled left of commit, not after eval).
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A. The helpers MUST NOT ship to production; same production-safety constraint as T052 — `web/supabase/test-helpers/` is the bootstrap-only path. If the build agent puts anything in `web/supabase/migrations/`, that is a stop-and-escalate failure mode.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.

## Background — what already exists

Read before starting:

1. `web/supabase/test-helpers/00_introspection.sql` — already provisions `eval_pg_extensions`, `eval_table_shape`, `eval_is_partitioned`. The new index / FK / partition-count helpers belong in this file (or a new sibling file, see § Layout decision).
2. `web/supabase/test-helpers/04_auth_user_seeding.sql` — T052 + ADR-15 fix-forward. Sets the "new helper file appended to the bootstrap set" precedent and the lexicographic-order convention `bootstrap-eval-helpers.ts` relies on.
3. `web/scripts/bootstrap-eval-helpers.ts` — the bootstrap script. New SQL files in `test-helpers/` are picked up automatically (it `readdirSync`s the folder and applies in lex order); no edit to the script itself is required.
4. `web/evals/phase-1/*.spec.ts` — the spec files that wait on these helpers. Every helper signature in § Acceptance Criteria below is derived from its call sites.
5. T052's ticket header § "Production-safety constraint (load-bearing)" and § "Future expansion" — both apply verbatim. T052 explicitly anticipated this ticket: *"Phase 1 will need its own eval helpers (table shapes for `locations`, `member_interests`, `member_follows`, `member_location_affinities`, `member_self_records`, `member_delegations`). Helpers 2 + 3 are already polymorphic on table name — they extend for free. Helpers 4–7 are specific to Phase 0 surfaces and stay scoped here. Phase 1 helpers ship in a follow-up ticket as `web/supabase/test-helpers/04_phase1_*.sql` files."* — that prediction is fulfilled by this ticket; the filename differs because slot `04_` was consumed by the ADR-15 fix-forward.

## Production-safety constraint (load-bearing — same as T052)

All new helpers MUST land in `web/supabase/test-helpers/` only. NOT in `web/supabase/migrations/`. The bootstrap script's localhost guard is the load-bearing safety. Every new function carries `revoke execute … from public; grant execute … to service_role;` so anon and authenticated roles cannot reach them.

## Layout decision

Two acceptable placements; the build agent picks one and documents the choice in the file header:

- **Option A — append to `00_introspection.sql`.** Helpers 1–3 below are pure-catalog reads with no extension dependencies; they belong with the existing `eval_table_shape` and `eval_is_partitioned`. Helper 4 (geography) has a PostGIS dependency that is cleanly handled inside the function body via `set search_path = public, extensions, pg_catalog`; the search_path declaration makes the dependency local to the helper, not the file.
- **Option B — Helpers 1–3 in `00_introspection.sql`, Helper 4 in new `05_geography.sql`.** Cleaner topological isolation if Phase 2 adds more PostGIS-touching helpers; otherwise marginal.

Prefer **Option A** unless Phase 2 work-map already shows ≥2 future PostGIS helpers — the single-helper-per-file shape is overkill for the current load. Whichever the agent picks, the file header comment justifies the choice in one line so the next reader knows.
_Why: bootstrap lex-order is satisfied by either layout; the readability tradeoff is what discriminates. Lock the decision in the file header so the next test-helper author doesn't have to re-derive it._

## Acceptance Criteria

### Helper signatures

Each function below is exact — match the signature, return type, and behavior. The spec calls them by name with these argument shapes; the SQL bodies are taken verbatim from the failing test's `expect(error, "build adds: …").toBeNull()` annotation.

#### Helper 1 — `eval_indexes_for_table(p_table text)`

- [ ] `returns table (indexname text, indexdef text)`.
- [ ] Body:
  ```sql
  select indexname::text, indexdef::text
  from pg_indexes
  where schemaname = 'public' and tablename = p_table
  order by indexname
  ```
- [ ] `language sql security definer`, `set search_path = public, pg_catalog`.
- [ ] `revoke execute … from public; grant execute … to service_role;`.
- [ ] `comment on function public.eval_indexes_for_table(text) is 'Phase 1 eval helper — pg_indexes wrapper for the named public table. T053.';`
- [ ] Spec usage: `evals/phase-1/locations.spec.ts:98`, `members-affinities.spec.ts:90`, `members-agent-assistance.spec.ts:240`, `members-interests-follows.spec.ts:60`, `members-interests-follows.spec.ts:113` — five tests verify partial-index predicates, GIST-partial composition, and follow-direction partial existence.

#### Helper 2 — `eval_foreign_keys_for_table(p_table text)`

- [ ] `returns table (constraint_name text, column_name text, referenced_table text, referenced_column text, delete_action text)`.
- [ ] Body:
  ```sql
  select
    c.conname::text,
    a.attname::text,
    cl.relname::text,
    af.attname::text,
    case c.confdeltype
      when 'a' then 'NO ACTION'
      when 'r' then 'RESTRICT'
      when 'c' then 'CASCADE'
      when 'n' then 'SET NULL'
      when 'd' then 'SET DEFAULT'
    end
  from pg_constraint c
  join pg_class src on src.oid = c.conrelid
  join pg_namespace srn on srn.oid = src.relnamespace
  join pg_class cl on cl.oid = c.confrelid
  join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
  join pg_attribute af on af.attrelid = c.confrelid and af.attnum = c.confkey[1]
  where c.contype = 'f' and srn.nspname = 'public' and src.relname = p_table
  ```
- [ ] `language sql security definer`, `set search_path = public, pg_catalog`.
- [ ] `revoke execute … from public; grant execute … to service_role;`.
- [ ] `comment on function public.eval_foreign_keys_for_table(text) is 'Phase 1 eval helper — pg_constraint wrapper exposing FKs + ON DELETE action for the named public table. T053.';`
- [ ] Spec usage: `evals/phase-1/members-augmentation.spec.ts:39` (members.home_location_id → locations on delete set null), `members-agent-assistance.spec.ts:307` (member_events.via_delegation_id → member_delegations on delete set null), `members-agent-assistance.spec.ts:333` (same for location_events).
- [ ] **Note on single-column-FK limitation.** The body indexes `c.conkey[1]` / `c.confkey[1]` — it only surfaces the first column of a multi-column FK. Phase 1's three FK-introspection call sites are all single-column; the limitation is acceptable for b1. If a future ticket needs composite-FK introspection, this helper extends to return one row per constituent column (use `unnest(c.conkey)` + `unnest(c.confkey)`); document the extension when it lands.
  _Why: matches the body the spec annotation specified verbatim; deviating to a more-general form would diverge from the spec text without payoff at b1._

#### Helper 3 — `eval_partition_count(p_parent text)`

- [ ] `returns integer`.
- [ ] Body:
  ```sql
  select count(*)::integer
  from pg_inherits i
  join pg_class c on c.oid = i.inhparent
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = p_parent
  ```
- [ ] `language sql security definer`, `set search_path = public, pg_catalog`.
- [ ] `revoke execute … from public; grant execute … to service_role;`.
- [ ] `comment on function public.eval_partition_count(text) is 'Phase 1 eval helper — count of child partitions for the named public partition parent. T053.';`
- [ ] Spec usage: `evals/phase-1/locations.spec.ts:378` — verifies T045's `rotate_location_events_partitions()` seeded current + 2 future months (≥3 leaf partitions) at migration time.

#### Helper 4 — `eval_location_geography_text(p_location_id uuid)`

- [ ] `returns text`.
- [ ] Body:
  ```sql
  select ST_AsText(geography::geometry)
  from public.locations
  where id = p_location_id
  ```
- [ ] `language sql security definer`, **`set search_path = public, extensions, pg_catalog`** (PostGIS lives in `extensions` schema on Supabase per the project's extension layout; `ST_AsText` won't resolve without it).
  _Why: T041 / `001_extensions.sql` installs PostGIS into `extensions`; every PostGIS-touching function in the action layer carries the same three-element search_path. Match the convention; don't import a non-schema-qualified `ST_AsText` and let it resolve via session search_path._
- [ ] `revoke execute … from public; grant execute … to service_role;`.
- [ ] `comment on function public.eval_location_geography_text(uuid) is 'Phase 1 eval helper — ST_AsText of the locations row''s geography column. T053.';`
- [ ] Spec usage: `evals/phase-1/locations.spec.ts:254` — verifies T045's centroid-sync trigger writes `ST_Centroid(polygon)` of a `location_areas` row into the spine `locations.geography` column.

### Bootstrap script integration

- [ ] No changes to `web/scripts/bootstrap-eval-helpers.ts`. The script already iterates `web/supabase/test-helpers/*.sql` in lexicographic order; new files are picked up automatically.
- [ ] No changes to `web/scripts/check-action-layer-conformance.ts`. The four new helpers READ from `public.*` (catalogs + the locations table); they do not write to any event-log table, so they do not require allowlisting beyond the existing `web/supabase/test-helpers/` entry from T052.

### File header convention

- [ ] Whichever file the new helpers land in, the file header carries a comment block: ticket reference (T053), what it provisions, the production-safety reminder ("MUST NOT be applied to production — bootstrap script enforces this via localhost guard"), and the layout-decision justification (Option A vs B from § Layout decision above).

## Tests

The helpers' own tests are minimal — they are themselves the eval surface. But verify:

- [ ] Extend `web/tests/eval-bootstrap.test.ts` (Vitest, exists from T052):
  - [ ] **Positive — local DB**: after bootstrap, all four new helpers exist (probe each via `select to_regprocedure(...)` or by invoking with a benign argument).
  - [ ] **Idempotency**: re-running bootstrap with the new helpers in place is a no-op (the `create or replace function` pattern guarantees this; the test just confirms exit-zero on second run).
- [ ] Manual smoke (documented in Completion section):
  - [ ] `supabase db reset && npm run eval:bootstrap && npx playwright test evals/phase-1/` — the 10 tests listed below pass that previously failed.
- [ ] BUILD-LOG.md updated.

### Tests that must pass after this ticket ships

All ten currently fail with PGRST202 `Could not find the function`:

- [ ] `evals/phase-1/locations.spec.ts:98` (`eval_indexes_for_table` — locations indexes incl. GIST partial)
- [ ] `evals/phase-1/locations.spec.ts:254` (`eval_location_geography_text` — centroid-sync trigger)
- [ ] `evals/phase-1/locations.spec.ts:378` (`eval_partition_count` — location_events partition seeding)
- [ ] `evals/phase-1/members-affinities.spec.ts:90` (`eval_indexes_for_table` — three partial-index predicates on member_location_affinities)
- [ ] `evals/phase-1/members-agent-assistance.spec.ts:240` (`eval_indexes_for_table` — `idx_delegations_member_active` partial predicate)
- [ ] `evals/phase-1/members-agent-assistance.spec.ts:307` (`eval_foreign_keys_for_table` — member_events.via_delegation_id FK)
- [ ] `evals/phase-1/members-agent-assistance.spec.ts:333` (`eval_foreign_keys_for_table` — location_events.via_delegation_id FK)
- [ ] `evals/phase-1/members-augmentation.spec.ts:39` (`eval_foreign_keys_for_table` — members.home_location_id FK)
- [ ] `evals/phase-1/members-interests-follows.spec.ts:60` (`eval_indexes_for_table` — `idx_member_interests_tag`)
- [ ] `evals/phase-1/members-interests-follows.spec.ts:113` (`eval_indexes_for_table` — two follow-direction partial indexes)

## Notes

**Why these helpers were missing from T045 / T047 / T048 / T049 / T050.** The eval-bootstrap pattern (T052) wasn't in place when T045 was authored. The Phase 1 specs were written with inline SQL bodies in `expect(error, "build adds: …")` annotations — a forward-looking contract for the helpers that the build agent was supposed to ship alongside the migrations. T052 then established `test-helpers/` as the correct home but only shipped the four Phase 0 helpers (matching its scope). Nothing back-filled the Phase 1 helpers into `test-helpers/`; this ticket is that backfill.

**Why these helpers belong in the test-helpers/ bootstrap set and not in the spec files themselves.** The spec firewall (`evals/phase-1/floor.spec.ts:33-35`) says: *"All DB reads via service-role + RPC helpers in web/supabase/test-helpers/."* Inlining the helpers as transient `create function` calls inside the spec would (a) violate the firewall, (b) require write-time setup per test that the spec layer is explicitly not allowed to perform, and (c) duplicate the SECURITY DEFINER / grant pattern. The bootstrap is the right surface.

**Why no migration in `migrations/`.** Repeated for emphasis per T052 § Notes. If you find yourself reaching for `013_phase1_eval_helpers.sql`, stop. These are eval-only surfaces.

**Commit hygiene.** Per the root `CLAUDE.md` § Commit Rules: PM commits from the Mac terminal at ticket close. The build agent produces a commit summary (repo, branch, file list, suggested message). Suggested message: `T053: phase 1 eval helpers (4 introspection RPCs in test-helpers/)`.

## Completion

Date: 2026-05-18
Commit (web): `b677293` — merged to main via `--no-ff` merge commit
Commit (parent): `d69bef5` — merged to main via `--no-ff` merge commit

**What landed:**

- `web/supabase/test-helpers/00_introspection.sql` — appended +157 lines (Option A layout per § Layout decision). Four new SECURITY DEFINER helpers (`eval_indexes_for_table`, `eval_foreign_keys_for_table`, `eval_partition_count`, `eval_location_geography_text`) following the established T052 convention: `language plpgsql`, `set search_path` scoped per function, `revoke execute … from public; grant execute … to service_role;` pair, `comment on function` with T053 marker + consumer-spec path. `eval_location_geography_text` carries `set search_path = public, extensions, pg_catalog` so PostGIS `ST_AsText` resolves at definition time. `eval_foreign_keys_for_table` indexes `conkey[1]`/`confkey[1]` (single-column FKs only — documented limitation) and orders by `c.conname` for deterministic output (M2 suggestion #1, landed in-loop).
- `web/tests/eval-bootstrap.test.ts` — appended +78 lines (new T053 describe block with 6 static-content assertions covering signature, single-column conkey indexing, pg_inherits join, PostGIS search_path, revoke/grant pairs, T053 comment markers). Also modified the existing T052 `03_handle_collisions.sql` assertion to retire a stale `/generate_series/` regex (T052's 2026-05-18 ADR-15 fix-forward rewrote the seed helper from `INSERT … SELECT` to a `FOR n IN 1..p_count` loop); new assertion is `/for\s+\w+\s+in\s+1\s*\.\.\s*p_count\s+loop/i` anchored to the loop pattern.
- No changes to `web/supabase/migrations/` (production schema list unchanged at 12 files — `001_extensions` through `012_member_agent_assistance`).
- No changes to `web/scripts/bootstrap-eval-helpers.ts` — the lexicographic-order helper iteration picks up the appended T053 helpers automatically.

**M2 `engineering:code-review` PROCEED 2026-05-17** (verdict captured in conversation). Three non-blocking suggestions surfaced; #1 (`order by c.conname` on FK helper) landed in-loop before commit per "fix-now beats fix-forward" discipline. #2 (`else null` on confdeltype case) and #3 (loop-bound identifier-tolerance on the Vitest assertion) deferred — both are defensive-only improvements with no current-day impact.

**Verification (PM-side, against local Supabase):**

- ✅ `supabase db reset` clean (12 migrations applied in sequence).
- ✅ `npm run eval:bootstrap` clean — bootstrap output: `conformance_check.ok=true violations=0`.
- ✅ `npx playwright test evals/phase-1/`: **78/80 pass** (up from 69/80). The 10 listed T053 acceptance tests:
  - 9 flipped from PGRST202 red → green (locations:98, members-affinities:90, members-agent-assistance:240, members-agent-assistance:307, members-agent-assistance:333, members-augmentation:39, members-interests-follows:60, members-interests-follows:113, locations:378).
  - 1 (locations:254) flipped from "helper missing" to "helper works correctly but spec regex too tight" — this is a NEW SURFACE of a pre-existing spec bug, not a T053 defect. Logged in DEVIATIONS for pipeline-eval fix-forward.
- ✅ `npm test tests/eval-bootstrap.test.ts`: **22/22 pass** (all 6 new T053 assertions green + the rehabilitated T052 collision-helper assertion green).

**Exit criteria PM verifies before closing:**

- [x] Four new helper RPCs exist in `00_introspection.sql`, with `revoke execute … from public; grant execute … to service_role;` on each.
- [x] No new entries in `web/supabase/migrations/` (production schema list unchanged).
- [x] `supabase db reset && npm run eval:bootstrap` succeeds.
- [x] 9 of 10 listed Phase 1 tests pass; 10th (locations:254) deviation logged.
- [x] M2 `engineering:code-review` PROCEED verdict captured.
- [x] DEVIATIONS.md entry appended (see 2026-05-18 — T053).
- [x] BUILD-LOG.md updated: T045 / T047 / T048 / T049 / T050 rows reflect new eval status; T053 row added.
