---
purpose: Ticket T052 — phase 0 eval helpers.
layer: how
status: reference
---

# T052 — Phase 0 eval helpers: provision the 7 RPCs `floor.spec.ts` waits on

**Scenario:** None. Direct infrastructure unblock. Source: `web/evals/phase-0/floor.spec.ts` (T041–T044 verification spec) calls 7 helper RPCs that don't exist in `web/supabase/migrations/`, so the spec cannot run. The spec's own comments mark each missing helper with `"build provisions"` / `"build adds"` — this ticket lands those provisions.
**Status:** Accepted — ADR-18 ratified 2026-05-17; ready for build
**Bundle:** b1 (Phase 0 verification unblock — enables eval run-mode on T041–T044)
**Depends on:** T041, T042, T043, T044, T051 (the schema and CI surfaces the helpers introspect). All five must have shipped build-side before this ticket starts; that is the case today.

**Serves:**
- **Loop:** All five (substrate). This ticket converts 4 in-limbo "build complete; runtime eval pending" tickets into verified Phase 0 floor.
- **Primitive shape:** None directly. Operates on the eval surface for the Person + event-log substrate.
- **What this unblocks:** `pipeline-eval` run-mode on T041–T044. Phase 0 exit criterion (`spawn fresh auth.users → members row + member.created event with correct audit fields`) verifiable end-to-end after this ships.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit (per the rebuild-phase rule: code-review pulled left of commit, not after eval).
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A. The helpers MUST NOT ship to production; see § Production-safety constraint below. If the build agent puts them anywhere `supabase db push` would apply, that is a stop-and-escalate failure mode.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.

## Background — what already exists

Read before starting:

1. `web/evals/phase-0/floor.spec.ts` — the spec that waits on these helpers. Every helper signature in § Acceptance Criteria below is derived from its call sites here.
2. `planning/rebuild-plan.md` § Phase 0 — what the Phase 0 floor must verify.
3. `product/systems/action-layer.md` § "Policy posture" — relevant for the `eval_conformance_check_result` helper.
4. `web/supabase/migrations/` — the 12 production migrations these helpers introspect (001–012).
5. `web/scripts/check-action-layer-conformance.ts` — T043/T051's CI conformance script that `eval_conformance_check_result` exposes the result of.
6. `web/evals/helpers/auth.ts` — the only existing Node-side eval helper. Whatever Node helpers this ticket adds live alongside it.

## Production-safety constraint (load-bearing)

The helpers MUST NOT be applied to production. Two paths from the existing repo:

- ❌ **NOT** in `web/supabase/migrations/`. Anything in that folder is part of the production schema and will be applied by `supabase db push`. The helpers expose internals (raw `pg_extension`, table shapes, partition metadata) that have no business in a prod schema and would themselves become a CI conformance violation.
- ✅ In `web/supabase/test-helpers/` (new folder). Applied by a dedicated bootstrap script after `supabase start` / `supabase db reset`. Never run against the prod database.

The bootstrap script wires into the existing test toolchain so a developer / CI runner does:

```
supabase start            # production schema applies
npm run eval:bootstrap    # this ticket — applies test-helpers/*.sql to local DB
npx playwright test evals/phase-0
```

`npm run eval:bootstrap` reads a `SUPABASE_ENV` (or equivalent) guard and refuses to run if pointed at a non-local DB. The guard is the load-bearing safety; the folder name is the legibility signal.

## Acceptance Criteria

### Layout

- [ ] New folder `web/supabase/test-helpers/` with one SQL file per logical group:
  - [ ] `00_introspection.sql` — `eval_pg_extensions`, `eval_table_shape`, `eval_is_partitioned`. Pure read-only inspections.
  - [ ] `01_conformance.sql` — `eval_conformance_check_result`. Reads from an `eval_artifacts` table populated by the bootstrap script.
  - [ ] `02_action_failure_injection.sql` — `eval_member_create_with_failure_injection`. Forces a same-transaction event-log failure via a SECURITY DEFINER plpgsql function that exercises the rollback path the action handler relies on. **Note:** this helper does NOT call the Node handler; it reproduces ADR-7's same-transaction invariant in SQL so the spec verifies the invariant *as a property of the DB substrate*. The action handler's own rollback path is already covered by Vitest. See § Helper 5 design note below; full rationale in ADR-18.
  - [ ] `03_handle_collisions.sql` — `eval_seed_handle_collision_range`, `eval_clear_handle_collision_range`.
- [ ] New bootstrap script `web/scripts/bootstrap-eval-helpers.ts` that:
  - [ ] Refuses to run unless the `DATABASE_URL` resolves to `localhost` / `127.0.0.1` / `host.docker.internal` (or `SUPABASE_ENV=local` is set explicitly). Hard exit on any other host.
  - [ ] Applies the four `.sql` files in lexicographic order against the local DB.
  - [ ] Idempotent — uses `create or replace function` and `create table if not exists`. Re-running on an already-bootstrapped DB is a no-op.
- [ ] Wire `bootstrap-eval-helpers.ts` into `package.json` as `"eval:bootstrap": "tsx scripts/bootstrap-eval-helpers.ts"`.
- [ ] Add `web/supabase/test-helpers/` to the action-layer-conformance script's allowlist (it must not flag `pg` imports or service-role usage in the bootstrap script's path, since the bootstrap is a sanctioned non-prod write path).

### Helper signatures

Each function below is exact — match the signature, return type, and behavior. The spec calls them by name with these argument shapes.

#### Helper 1 — `eval_pg_extensions()`

- [ ] `returns table (extname text)` — list of extensions installed in the current DB.
- [ ] Body: `select extname from pg_extension where extname in ('vector','postgis') order by extname`.
- [ ] Spec usage: confirms T041's two extensions (pgvector + postgis) are installed.

#### Helper 2 — `eval_table_shape(p_table text)`

- [ ] `returns table (column_name text, data_type text, is_nullable text)`.
- [ ] Body: `select column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = p_table order by ordinal_position`.
- [ ] Spec usage: introspects `members`, `member_events`, `item_embeddings`, `member_embeddings` shapes against T041/T042 expectations.
- [ ] Note on `data_type` for vector columns: `information_schema.columns` reports `USER-DEFINED` for `vector(n)`. The spec uses `expect(embedding?.data_type).toMatch(/vector/)`. To make this pass, prefer reading from `pg_attribute` + `format_type(atttypid, atttypmod)` instead, which returns `'vector(1536)'` literally. If you switch the source, document the choice in the migration comment so future maintainers know why `information_schema` was rejected.

#### Helper 3 — `eval_is_partitioned(p_table text)`

- [ ] `returns boolean`.
- [ ] Body: `select coalesce((select relkind = 'p' from pg_class join pg_namespace on relnamespace = pg_namespace.oid where nspname = 'public' and relname = p_table), false)`.
- [ ] Spec usage: confirms T042's `member_events` is a partitioned table (range or list parent).

#### Helper 4 — `eval_conformance_check_result()`

This helper exposes the result of `npm run check:action-layer` (T043 + T051's Node script) to the Playwright spec. The conformance check runs in Node, not in Postgres, so the helper reads from a table the bootstrap script populates.

- [ ] Bootstrap script (`bootstrap-eval-helpers.ts`) does, after applying the SQL files:
  - [ ] `npm run check:action-layer --json` (or equivalent — extend the script in T043's tree to support `--json` if it doesn't already; see § Sub-task below).
  - [ ] Captures `{ ok: boolean, violations: Array<...> }` from stdout.
  - [ ] Inserts/upserts into `public.eval_artifacts` (created by `01_conformance.sql`): `(key text primary key, value jsonb, created_at timestamptz)`. Key = `'conformance_check'`. Value = the parsed JSON.
- [ ] `eval_conformance_check_result()` returns `jsonb` — the `value` column from `public.eval_artifacts` where `key = 'conformance_check'`. Raises a clear `exception` if the row is absent ("eval:bootstrap not run — call `npm run eval:bootstrap` before running phase-0 spec").
- [ ] Spec usage: `expect(data).toMatchObject({ ok: true, violations: [] })`.
- [ ] **Sub-task — `check-action-layer-conformance.ts` `--json` flag.** Inspect the script; add a `--json` output mode if missing. Existing exit-code behavior unchanged. Tests for the flag live in T051's existing test files (extend `ci-enforcement-rule-2.test.ts` with a `--json` parsing case) OR in a new `ci-conformance-json.test.ts` — agent's call.

#### Helper 5 — `eval_member_create_with_failure_injection(p_id uuid)`

**Design note (load-bearing — read before coding; full rationale in ADR-18 Decision 2):** the spec's docstring on this helper says "calls the same action handler with a forced event-log write failure." A faithful reading requires invoking the Node handler. But the eval-writer firewall (`floor.spec.ts` line 16) explicitly forbids the spec from importing `web/src/`, and the Postgres function can't directly invoke Node code without an HTTP hop. Two design paths:

- **Path A (chosen — ratified in ADR-18 Decision 2).** The helper reproduces ADR-7's same-transaction invariant **in SQL**: open a transaction, insert into `members`, force an exception in the event-log insert (e.g., violate the `acting_member_id NOT NULL` constraint by passing NULL), confirm the `members` row was rolled back. The spec then verifies the property — "members row + event-log row are written same-transaction, both rollback if either fails" — which is the invariant that matters. The action handler's own rollback path is covered separately by Vitest in `web/src/actions/__tests__/`.
- **Path B (rejected).** Add a `?fail_mode=event_log` query param to `/api/internal/auth-signup`, gated to `NODE_ENV !== 'production'` and a test secret. The helper calls the route via `pg_net.http_post` and inspects the response + DB state. More code in the production surface (even gated) for marginal additional coverage.

**Implement Path A.** Document the choice in the migration body referencing ADR-18. If a future ticket adds non-trivial side effects to the action handler's commit path that SQL-side reproduction can't cover, escalate to add Path B then.

- [ ] `returns jsonb` — `{ rolledBack: boolean, membersRowRemaining: boolean }`.
- [ ] Path A body (sketch — agent refines):
  ```
  begin
    -- Attempt the two writes inside a savepoint so the outer call survives the exception.
    begin
      insert into members (id, handle, display_name) values (p_id, 'fail-probe-' || substr(p_id::text, 1, 8), 'Fail Probe');
      -- Force event-log failure: NOT NULL violation on acting_member_id.
      insert into member_events (id, member_id, event_kind, payload, acting_member_id, via_delegation_id)
      values (gen_random_uuid(), p_id, 'member.created', '{}'::jsonb, NULL, NULL);
    exception when not_null_violation then
      -- Expected. The savepoint rolls back the members insert too.
      null;
    end;
    return jsonb_build_object(
      'rolledBack', true,
      'membersRowRemaining', exists(select 1 from members where id = p_id)
    );
  end
  ```
  Critical: the inner `begin ... exception` block in plpgsql IS a subtransaction. The `members` insert rolls back when the `member_events` insert raises. The returned `membersRowRemaining` should be `false`.
- [ ] Spec usage: `expect(data).toMatchObject({ rolledBack: true, membersRowRemaining: false })`.

#### Helper 6 — `eval_seed_handle_collision_range(p_base text, p_count int)`

- [ ] `returns void`.
- [ ] Inserts `p_count` rows into `members` with handles `{p_base, p_base-2, p_base-3, ..., p_base-{p_count}}`. The first handle is the bare base (no suffix) per the action-layer's collision-suffix rule. Use `gen_random_uuid()` for ids.
- [ ] All inserts in one statement (`insert ... select from generate_series`).
- [ ] Idempotent against retry: if any of the target handles already exist, `on conflict do nothing`. Don't silently overwrite — the test owns the lifecycle.
- [ ] Spec usage: `admin.rpc("eval_seed_handle_collision_range", { p_base: "maya", p_count: 99 })` to saturate the 99-collision window in T043's spec.

#### Helper 7 — `eval_clear_handle_collision_range(p_base text)`

- [ ] `returns void`.
- [ ] Deletes from `member_events` first (FK to members), then from `members`, all rows whose handle matches `^{p_base}(-\d+)?$`.
- [ ] Use parameterized query — do not concatenate `p_base` into the regex without escaping (the action-layer-conformance check in T051 will flag this; you need `// sql-injection-safe: enum-constrained by …` or a literal-only pattern. Easier: use `like` with two patterns — `handle = p_base or handle like p_base || '-%'`).
- [ ] Spec usage: cleanup after `eval_seed_handle_collision_range`.

### Migration body conventions

- [ ] Each `.sql` file opens with a comment block: title, ticket reference (T052), what it provisions, the production-safety reminder.
- [ ] Every function declared `language plpgsql` and `security definer` (so the service-role client can call them).
- [ ] Every function has a `revoke execute ... from public; grant execute ... to service_role;` block so anon and authenticated roles can't reach them. This is the second layer of defense after the test-helpers/ folder separation.
- [ ] Function comments (via `comment on function ...`) state the helper's purpose and the spec file that consumes it.

## Tests

The helpers' own tests are minimal — they are themselves the eval surface. But verify the bootstrap script behaves:

- [ ] `web/tests/eval-bootstrap.test.ts` (Vitest):
  - [ ] **Positive — local DB**: with `DATABASE_URL` pointing at a localhost Postgres, running the bootstrap script applies all four files and the helpers exist (probe `select eval_pg_extensions()`).
  - [ ] **Negative — non-local DB**: with `DATABASE_URL=postgresql://prod.example.com/db`, running the script exits non-zero with a clear message; no SQL is applied.
  - [ ] **Idempotency**: running the bootstrap twice in a row succeeds both times.
- [ ] Manual smoke (documented in the Completion section):
  - [ ] `supabase start && npm run eval:bootstrap && npx playwright test evals/phase-0/floor.spec.ts` — Phase 0 spec passes end-to-end.

## Notes

**Why a separate `test-helpers/` folder instead of `migrations/`.** Three reasons: (1) production safety — the helpers expose introspection surfaces that have no business in prod; (2) ADR-7 — the action layer is the only sanctioned write surface in prod, and `eval_seed_handle_collision_range` directly writes to `members`. Putting it in `migrations/` would itself be a conformance violation; (3) legibility — a developer reading `migrations/` should see only production schema. Test surfaces live in a folder whose name says "test."

**Why the bootstrap script is a hard guard, not a config-driven toggle.** The cost of accidentally applying `eval_seed_handle_collision_range` to production is high (99 garbage rows; FK contamination on member_events). The cost of the guard is one extra `npm run` step. The asymmetry justifies a hard fail over a configurable warning.

**Why Path A on Helper 5.** ADR-7's same-transaction invariant is "members row + event-log row write same-transaction, both rollback if either fails." That invariant is a property of the DB substrate — any well-formed action handler will respect it because plpgsql + the Node `pg.Pool` transaction wrapper both enforce it the same way. Verifying the property in SQL covers any handler that uses the substrate correctly. The Node-side coverage (Vitest) verifies the handler's specific commit sequencing. Together they pin the invariant from both ends. Full rationale in ADR-18 Decision 2.

**Why no migration in `migrations/`.** Repeated for emphasis. If you find yourself reaching for `013_eval_helpers.sql`, stop. That is the failure mode this ticket exists to prevent.

**Future expansion.** Phase 1 will need its own eval helpers (table shapes for `locations`, `member_interests`, `member_follows`, `member_location_affinities`, `member_self_records`, `member_delegations`). Helpers 2 + 3 are already polymorphic on table name — they extend for free. Helpers 4–7 are specific to Phase 0 surfaces and stay scoped here. Phase 1 helpers ship in a follow-up ticket as `web/supabase/test-helpers/04_phase1_*.sql` files.

**Commit hygiene.** Per the root `CLAUDE.md` § Commit Rules: single commit on close, one-line message, no body. Use `T052: phase 0 eval helpers (test-helpers folder + bootstrap script)`.

## Completion

Date: 2026-05-17
Commit (web): TBD — PM commits from Mac terminal
Commit (parent): TBD — `docs(pipeline): T052 ratification` once `pipeline-review` clears.

**What landed:**

- New folder `web/supabase/test-helpers/` with four `.sql` files (`00_introspection.sql`, `01_conformance.sql`, `02_action_failure_injection.sql`, `03_handle_collisions.sql`). All seven helper RPCs defined as SECURITY DEFINER, with `revoke execute … from public; grant execute … to service_role` on every function. Production-safety reminder in each file header pointing at ADR-18.
- New bootstrap script `web/scripts/bootstrap-eval-helpers.ts` with a hard localhost guard (host must be one of `localhost`, `127.0.0.1`, `::1`, `host.docker.internal`; exit code 2 on guard refusal, distinguishing it from pg connect failures which exit 1). Applies the four SQL files in lexicographic order, then runs `check-action-layer --json` and upserts the parsed result into `public.eval_artifacts` under `key='conformance_check'`.
- `web/scripts/check-action-layer-conformance.ts` extended with `--json` mode (emits a single `{ ok: boolean, violations: Violation[] }` object on stdout; exit-code semantics unchanged) and an `ALLOWED_EXCEPTIONS` entry for `scripts/bootstrap-eval-helpers.ts`. Folder allowlist for `supabase/test-helpers/` is implicit (the file lister filters to `.ts`/`.tsx`).
- `web/package.json` gains `"eval:bootstrap": "tsx scripts/bootstrap-eval-helpers.ts"`.
- Tests: `web/tests/eval-bootstrap.test.ts` (Vitest — layout, guard, `--json` contract) + `web/tests/ci-conformance-json.test.ts` (Vitest — `--json` mode against the conformance script directly) + `web/scripts/t052-sandbox-check.mjs` (plain-node mirror; Vitest segfaults under Linux x86_64 per BUILD-LOG T051 note). 59 sandbox checks passing; `npm run check:action-layer` clean.
- **M2 `engineering:code-review` PROCEED 2026-05-17** with two fix-now items applied in the same loop: (a) `02_action_failure_injection.sql` gains `when foreign_key_violation` as a secondary catch (defense-in-depth against future Postgres constraint-evaluation reordering or schema changes); (b) `03_handle_collisions.sql` gains an early-raise precondition on `p_base` length (since `on conflict do nothing` does NOT catch `check_violation` — too-short or too-long bases would fail mid-INSERT in confusing ways).

**Helper 5 design note honored.** Path A per ADR-18 Decision 2 — SQL-side subtransaction reproducing ADR-7's same-transaction invariant via `not_null_violation` on the event-log insert. The handler's own commit-path coverage stays in Vitest. Inline comments in the SQL body cite ADR-7 (not the consolidated-away ADR-10) and ADR-18.

**No new files in `web/supabase/migrations/`.** Production schema list unchanged: 11 files, ending at `012_member_agent_assistance.sql` (T050).

**Exit criteria the PM verifies before closing:**

- [x] `web/supabase/test-helpers/` exists with four `.sql` files; no new entries in `web/supabase/migrations/`.
- [ ] `npm run eval:bootstrap` succeeds against `supabase start`'s local DB; refuses against any non-local DB. — *PM-side: requires `supabase start`.*
- [ ] All 7 helper RPCs callable via service-role; not callable via anon (revoke verified). — *PM-side: requires `supabase start`.*
- [ ] `npx playwright test evals/phase-0/floor.spec.ts` passes end-to-end against a local instance. — *Handed to `pipeline-eval` (run mode).*
- [ ] BUILD-LOG.md updated: T041–T044 move from "Build complete; runtime eval pending" to "Build + eval complete." T051's runtime eval status (Rule 3 RLS coverage) cleared, since it shares the local-DB bootstrap. — *Pending eval-run pass; build-side BUILD-LOG entry landed today.*
- [x] DEVIATIONS.md entry appended.
