# DEVIATIONS.md — Implementation Drift Log

When implementation diverges from spec, log it here with context.

## 2026-05-19 — T057 — No spec deviation; eval-RPC column-name mismatch caught at first run

**Deviation:** None against spec. T057 lands the `discoverable_items` view, refresh trigger, and indexes exactly as ticketed.

**Reason:** First eval run had one failing test — the index-existence assertion used `index_name` / `is_unique` as the expected RPC return columns, but `eval_indexes_for_table` returns `indexname` / `indexdef` (verbatim from `pg_indexes`). Build-time error in the spec, not the migration.

**Impact:** None — caught at first run, fixed inline by parsing `indexdef` for `CREATE UNIQUE INDEX` instead. All 10/10 green afterward; full Phase 1 142/142.

**Escalation:** None.

**Resolution:** Eval spec corrected; T057 ships. Note for future eval authoring: `eval_indexes_for_table` returns the `pg_indexes` column names (`indexname`, `indexdef`) — not the Supabase JS client's camelCase guess. When introspecting whether an index is UNIQUE, parse `indexdef` (regex on `CREATE UNIQUE INDEX`) since pg_indexes does not surface a separate is_unique boolean.

## 2026-05-19 — T056 — `items.state` enum reconciliation (drop `'active'`, add `'draft'` + `'published'`)

**Deviation:** `item.md` carried two conflicting state vocabularies — line 99 specifies `(active, fulfilled, withdrawn, closed)` while line 128's publish-event semantics reference `state='draft'` → `state='published'`. T056 ships a single reconciled enum: `('draft','published','withdrawn','fulfilled','closed')`. `'active'` is **dropped**; `'published'` is the lifecycle target for visible Items.

**Reason:** The spec inconsistency was flagged as one of three F018 blockers in the 2026-05-18 pipeline-review. F018 has since been deferred to backlog (2026-05-19 PM call); the rewrite punch list is preserved for the F018 promote. T056 cannot ship the Items schema without picking a state vocabulary, and the publish-event semantics (line 128) are load-bearing for the T057 `discoverable_items` refresh trigger. The cleanest reconciliation is the superset that supports the publish semantics directly (`draft` → `published`) and the terminal states the rest of the spec relies on (`withdrawn`/`fulfilled`/`closed`). `'active'` is functionally equivalent to `'published'` in the spec text — preserving both would create ambiguity at composer write time.

**Impact:** Any future spec or code reference to `state='active'` should be read as `state='published'`. The F018 rewrite (when it promotes) lands the corresponding text edit on `item.md` line 99 alongside the URL `/i/` → `/e/` cleanup. No downstream code today writes `state='active'` (no handlers exist yet); the Phase 2 surface composers will write `state='draft'` on create and `state='published'` via `item.publish` per ADR-10's publish-event semantics.

**Escalation:** None — T056 lands as a build-agent reconciliation; the F018 rewrite (deferred PM work) ratifies the spec text alignment.

**Resolution:** Migration `015_items.sql` ships the reconciled enum; eval `items.spec.ts` includes a negative test confirming `'active'` is rejected (23514); both the migration header and the spec's living state are aligned on the new vocabulary. Going-forward rule: any new Item-aware code should use the five-value enum as canonical; the F018 rewrite will land the matching `item.md` text edit when F018 promotes.

## 2026-05-19 — T055 — Cross-table RLS recursion (SQLSTATE 42P17) — SECURITY DEFINER helper pattern

**Deviation:** None against T055's own spec — T055 lands the design described in its acceptance criteria. This entry captures the implementation pattern that broke at first apply and the going-forward rule for future tables with cross-table membership checks.

**Reason:** The first draft of `014_groups.sql` declared two RLS policies that each subquery the other's table: `groups_select_member` used `id in (select group_id from group_memberships ...)` and `memberships_select_co_member` used `group_id in (select group_id from group_memberships ...)`. When anon SELECTs from `groups`, the policy triggers a subquery on `group_memberships`, which triggers its own RLS, which subqueries `group_memberships` again → infinite loop, SQLSTATE 42P17.

**Impact:** Caught at first eval run (6/25 RLS tests failed); zero rows ever in the broken state.

**Escalation:** None — fix landed in the same ticket. Migration not yet committed at the time of fix.

**Resolution:** Added `public.current_member_explicit_group_ids()` as a SECURITY DEFINER `language sql stable` function. Runs as the function owner (postgres), bypassing RLS on the membership lookup while remaining safe — the body filters strictly on `auth.uid()`. Cross-table policies (`groups_select_member`, `memberships_select_co_member`, `group_events_select_member_of_group`) all use the helper instead of inline subqueries. The function's table reference forces it to be defined *after* `group_memberships` exists, so the file restructured to: tables first (with only non-recursive policies inline), then helper + cross-table policies, then `group_events`, then the view.

**Going-forward rule:** Any RLS policy that needs "is the current Member a member of Group X" (or any similar cross-table membership check) **must use a SECURITY DEFINER helper function**, not an inline subquery. Inline subqueries cascade through the second table's RLS and recurse. The helper isolates the lookup at function-owner privilege. Candidate trigger for a future `engineering:code-review` checklist addition: any RLS policy `using ... in (select ... from <table_with_own_RLS> ...)` is suspect — review for recursion potential.

## 2026-05-19 — T054 — `array_length(arr, 1)` is NULL on empty arrays — broken CHECK predicate

**Deviation:** None against T054's own spec — T054 lands as written. This entry exists to capture the bug T054 fixes (introduced by T050) and the going-forward rule, both per the ticket's "Notes" section.

**Reason:** T050's `012_member_agent_assistance.sql` declared `scopes text[] not null check (array_length(scopes, 1) >= 1)`. Postgres returns NULL (not 0) for `array_length(arr, 1)` when `arr` is empty; CHECK predicates that evaluate to NULL are treated as passing per SQL standard. An empty-scopes Delegation insert succeeded despite the intent to reject — caught by `members-agent-assistance.spec.ts:204`, not by T050's M2 code-review.

**Impact:** Substrate-only. No production rows ever; the action handler that vends scoped capability would have malfunctioned on an empty Delegation (vending nothing), but no path inserts empty Delegations today.

**Escalation:** None — T054 was scoped and approved as a direct schema fix-forward. No upstream spec change.

**Resolution:** T054 ships `013_member_delegations_scopes_check_fix.sql` with `cardinality(scopes) >= 1` (Postgres-recommended idiom for non-empty-array CHECK — returns 0 for empty, never NULL). The original inline CHECK (auto-named `member_delegations_scopes_check`) is dropped; the new explicitly-named `member_delegations_scopes_non_empty_check` replaces it. Phase 1 evals: **80/80 green**.

**Going-forward rule:** For any column-CHECK that tests "array is non-empty," use `cardinality(arr) >= 1`, not `array_length(arr, 1) >= 1`. Candidate trigger for a future `engineering:code-review` checklist addition: flag `array_length(<col>, 1)` in any CHECK predicate as a potential NULL-evaluates-as-passing bug.



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

## 2026-05-18 — T053 — Stale `generate_series` Vitest assertion fixed inline (T052 drift)

**What:** `web/tests/eval-bootstrap.test.ts:132` had an assertion `expect(sql).toMatch(/generate_series/i)` against `03_handle_collisions.sql`. That assertion went stale on 2026-05-18 when T052's ADR-15 fix-forward (this file, entry "Phase 0 spec — ADR-15 compliance fix-forward") rewrote `eval_seed_handle_collision_range` from a `INSERT … SELECT generate_series(...)` shape to a `FOR n IN 1..p_count loop` (the loop was required to thread a per-iteration uuid through `eval_seed_auth_user_only` + the members insert). The static-content check was not updated alongside the SQL rewrite. Replaced inline with `expect(sql).toMatch(/for\s+\w+\s+in\s+1\s*\.\.\s*p_count\s+loop/i)` anchored to the new loop pattern.

**Why:** Surfaced during T053's first vitest run (1/22 failing); the SQL helper itself works correctly — only the test's expectation drifted. Patching inside T053's commit is justified because (a) the file is `web/tests/` (a Vitest unit test, not a Playwright eval — build-tier ownership applies), (b) the fix is mechanically necessary to keep the test suite green for the T053 close, and (c) leaving it broken would mask any future regression on that surface. Anchored to T052's 2026-05-18 ADR-15 entry below + the helper's current FOR-loop implementation.

**Disposition:** accepted-as-is — the corrected assertion captures the actual current implementation; the comment block above the assertion anchors the change to DEVIATIONS + ADR-15 so the next reader understands why `generate_series` is gone. No follow-on work required.

## 2026-05-18 — T053 — locations.spec.ts:254 spec-regex precision (deferred to pipeline-eval)

**What:** `evals/phase-1/locations.spec.ts:254` (T045 — location_areas centroid-sync trigger) asserts `expect(data as unknown as string).toMatch(/POINT\(-121\.49 38\.59\)/)` against the return of `eval_location_geography_text(location_id)`. With the T053 helper now installed and the trigger working as designed, PostGIS `ST_AsText` returns `POINT(-121.49000000190374 38.589999963099324)` — full-precision rendering of the unit-square centroid. The regex was authored assuming 2-decimal rounding, which `ST_AsText(geometry)` does not perform.

**Why:** Pre-existing spec defect masked by the "helper missing" PGRST202 error before T053 landed. The T053 helper is implementing exactly what its docstring and consumer-spec annotation promised — `ST_AsText(geography::geometry)` of the locations row's geography column, with no precision coercion. The brittle assertion is in the eval, not the substrate. Two paths considered: (1) couple the helper to a precision argument (`ST_AsText(geom, 2)`) — rejected because the helper is general-purpose introspection and shouldn't carry spec-specific rounding; (2) relax the eval regex to be precision-tolerant — correct path but crosses the build/eval firewall.

**Disposition:** flag-for-pipeline-eval — T053 closes with 9/10 listed tests green (locations:254 carries this deviation). The eval regex fix is in pipeline-eval's territory; cheapest fix is `/POINT\(-121\.49\d* 38\.59\d*\)/` or equivalent tolerance. No T053 substrate change needed. Suggested follow-up: pipeline-eval write-mode pass over `evals/phase-1/locations.spec.ts` to land the regex relax + any other precision-fragile assertions in the same surface.

**Going-forward rule:** PostGIS `ST_AsText` returns full coordinate precision. Eval assertions against `ST_AsText` output must use precision-tolerant patterns OR call `ST_AsText(geom, N)` with an explicit rounding argument. Default-precision assertions like `/-121\.49 38\.59/` are brittle by construction.

## 2026-05-18 — T053 — Build summary (no spec divergence)

**What:** T053 (Phase 1 eval helpers — 4 introspection RPCs appended to `00_introspection.sql`) shipped exactly as ticketed: Option A layout chosen + justified in the section banner; four helpers (`eval_indexes_for_table`, `eval_foreign_keys_for_table`, `eval_partition_count`, `eval_location_geography_text`) with signatures matching the failing tests' inline `"build adds: …"` annotations verbatim; SECURITY DEFINER + service_role-only grants on every function; T053 marker on every `comment on function`. Suggestion #1 from M2 code review (`order by c.conname` on the FK helper for output determinism + parity with the other ordered helpers) landed in-loop before commit.

**Why:** No spec divergence to log on the T053 helpers themselves — the ticket's spec was the failing tests' inline SQL bodies, and the implementation matched them. The two related deviations above (Vitest stale-assertion fix; locations:254 regex precision) are surfaces T053 exposed but did not cause; logged separately for traceability. CLAUDE.md rebuild-rule #6 requires an entry per ticket, even when the implementation matched the spec exactly — this is that entry.

**Disposition:** accepted-as-is.

## 2026-05-18 — T052 — eval_seed_auth_user_only ignores p_email for auth.users.email slot

**What:** The helper used to thread `p_email` into `auth.users.email`. Combined with `on conflict (id) do nothing` (which only catches id conflicts, not email conflicts), reusing the same `p_email` across test runs (e.g. `maya@example.test` across reruns of the maya-collision spec) silently failed when a prior run had left an orphan row — UNIQUE constraint on `auth.users.email` raised, helper RPC returned an error the spec didn't check, no row was inserted for the new id, and the deferred `members_assert_id_in_auth_users` trigger then rejected the handler's COMMIT with 23503. Fix: always synthesize `eval-<short-uuid>@eval-test.local` for `auth.users.email`. `p_email` is retained as a parameter for API compatibility but ignored for that slot.

**Why:** The handler reads its email from the request payload, not from `auth.users`. Whatever's stored in `auth.users.email` has no observational value to the Phase 0 spec. Synthesizing from the id makes the helper idempotent against repeated runs with the same `p_email`. The alternative — supporting `ON CONFLICT (id) DO NOTHING, ON CONFLICT (email) DO NOTHING` — isn't valid Postgres (one ON CONFLICT clause per INSERT) and would require restructuring as a CTE-based upsert. Anchored to the auth.users schema (email UNIQUE) + the failure mode observed on the 2026-05-18 4th eval run: deferred trigger at COMMIT after seed silently failed.

**Disposition:** accepted-as-is — the parameter retention preserves the helper's API; the behavior change is invisible to the spec because the spec doesn't query `auth.users.email`. If a future test needs the auth.users.email to match a specific value, it should use `admin.auth.admin.createUser` (the canonical real-auth-user path) instead of this seed helper.

## 2026-05-18 — T043 — Handler retry loop: missing SAVEPOINT in handle-collision path

**What:** `web/src/actions/member/create.ts` retry loop did `try { insert } catch { compute next suffix; continue }` with no `SAVEPOINT` / `ROLLBACK TO SAVEPOINT` around each attempt. The first INSERT's constraint failure (23505 on unique handle) aborts the outer transaction; the second INSERT then raises `25P02` ("current transaction is aborted, commands ignored until end of transaction block"). Result: every collision-suffixed handler call crashed with 500 at the second attempt. Fix-forward: wrap each INSERT in `savepoint member_create_handle_attempt`; `release` on success, `rollback to savepoint` on any failure before the catch decides whether to retry or rethrow.

**Why:** Latent bug — T047's constraint trigger was masking it (every INSERT was failing with 23503 before the collision path could exercise the retry). T052 + ADR-15 fix-forward satisfied the trigger; the collision path ran end-to-end for the first time and the missing SAVEPOINT surfaced. The pattern is canonical Postgres for constraint-driven retry inside a single transaction. T043's original Vitest coverage (per BUILD-LOG: "59/60 sandbox-side") used mocks that didn't reproduce Postgres's failed-statement-aborts-transaction semantics — the Playwright eval is what caught this. Anchors to Postgres docs §13.4 (errors and aborted transactions) and `client.query` semantics on the `pg` driver.

**Disposition:** flag-for-spec-revision — the canonical T043 spec body should include "SAVEPOINT around each INSERT attempt" as an explicit acceptance criterion. The pattern is also relevant to every future action handler that retries inside `withTransaction` (e.g., any deduplication-based upsert path). Suggest `pipeline-product` adds a "Retry semantics inside withTransaction" §  in `product/systems/action-layer.md` so the convention is normative, not folklore.

**Going-forward rule:** any action handler that retries an INSERT/UPDATE inside `withTransaction` after a constraint failure MUST wrap each attempt in a SAVEPOINT. The current handler is the canonical reference until the spec catches up.

## 2026-05-18 — Phase 0 spec — T043 collision tests serialized

**What:** `T043 — Action layer scaffold + member.create handler` describe was switched to `test.describe.serial(...)`. The four collision tests inside the describe all use the `maya` handle base — one inserts `members(handle='maya')` and asserts the next member.create derives `maya-2`; another seeds 99 rows including `handle='maya'` + clears `maya%` between assertions. Under `fullyParallel: true` (playwright.config.ts), the four workers race and clobber each other, producing the 2/22 failures the PM observed on the 2026-05-18 second run.

**Why:** The state-sharing is intentional — both tests need a populated `maya` collision space. The cheapest fix is serial mode for just that describe; the other describes (T041, T042, T044, RLS smoke) remain parallel. Alternative — unique handle bases per test — would require changing the email payload to match (`derive_handle_from_email` is keyed on the local-part), which adds surface area for no payoff. Serial-mode is one line.

**Disposition:** accepted-as-is — minimum surface change, parallel-safe everywhere else. If a future Phase-1 test joins the T043 describe with new shared state, the serial-mode discipline already applies.

## 2026-05-18 — Phase 0 spec — ADR-15 compliance fix-forward (constraint trigger added in T047)

**What:** T047 (committed 2026-05-11, `009_members_phase1.sql`) added the constraint trigger `members_assert_id_in_auth_users()` on `public.members` that rejects any insert whose id is not present in `auth.users` (system Member exempted). The Phase 0 spec at `web/evals/phase-0/floor.spec.ts` and the bulk seed helper `eval_seed_handle_collision_range` in `web/supabase/test-helpers/03_handle_collisions.sql` were both authored before T047 landed; they minted random UUIDs and inserted directly into `public.members`, which after T047 raises `23503`. Net effect: 6 of 22 phase-0 floor tests failed against the post-T047 substrate. Fix-forward landed a single new test-helper plus targeted spec edits to seed `auth.users` rows before any direct members insert.

**Why:** ADR-15's invariant is load-bearing — the constraint trigger is the schema-level enforcement of "members.id is real auth identity." The substrate is correct; the test helpers and spec must respect it. Two design options were on the table:

1. **One helper** — `eval_seed_auth_user_only(p_id uuid, p_email text default null)`. Inserts a minimum-viable `auth.users` row. Reusable by both the bulk seed and the per-test probes.
2. **Two helpers** — paired `eval_seed_auth_user_only` + `eval_seed_auth_user_and_member`. The combined form for tests that want both rows in one go.

**Chose option 1.** The two-helper shape would have leaked auth.users-row provisioning concerns into a second helper for marginal API ergonomics (`one extra rpc call per test`). The bulk seed already does its own members-insert in a loop; threading the auth.users seed into the same loop is one line. The per-test probes need only the auth.users row before they call `member.create` (the handler does its own members insert). Two helpers would have duplicated the members insert path for no payoff.

**Hook bypass.** `006_auth_signup_hook.sql` installs `handle_new_auth_user()` (AFTER INSERT on `auth.users`) which calls `net.http_post` to the Next.js route → `member.create`. If the helper just inserted into `auth.users` naively, the hook would race the test's `invokeMemberCreate` call and the action handler would hit `ConflictError` (members row already created by the hook's async path) instead of exercising the fresh-create path. Two options:

1. **Mark the email pattern** the hook skips — e.g., skip `*@eval-test.local`. Brittle (depends on the test using the magic email).
2. **Session-local GUC** — `eval.skip_signup_hook = 'on'` set via `set_config(..., true)` (transaction-local). The hook function reads the GUC and short-circuits when 'on'. **Chosen** because it decouples skip-intent from email shape, the GUC has no platform-side meaning (so production code never sets it), and `set_config` with `is_local=true` clears at end of transaction (no leak).

Mechanism: the test-helper `04_auth_user_seeding.sql` `create or replace`s `handle_new_auth_user()` with a body that's byte-identical to `006_auth_signup_hook.sql` except for a leading `if current_setting('eval.skip_signup_hook', true) = 'on' then return new; end if;` block. Because test-helpers are applied only by `bootstrap-eval-helpers.ts` (localhost-guarded), production never sees the override.

**Why the GUC pattern rather than `session_replication_role = replica`:** the latter requires `SUPERUSER` on Supabase (the `postgres` role isn't superuser), so it's not an option.

**Why not patch the migration:** the migration is committed history. The test-helper override pattern leaves production unchanged and isolates the eval-only concern to a folder that's already gated by localhost-only application.

**Files modified:**
- `web/supabase/test-helpers/04_auth_user_seeding.sql` — new file. (a) `create or replace function public.handle_new_auth_user()` with the GUC-skip leading clause. (b) `eval_seed_auth_user_only(p_id uuid, p_email text default null)` SECURITY DEFINER helper. Both granted to service_role only.
- `web/supabase/test-helpers/03_handle_collisions.sql` — `eval_seed_handle_collision_range` rewritten from single `INSERT … SELECT` to a `FOR n IN 1..p_count` loop, each iteration calling `eval_seed_auth_user_only` before its members insert. `eval_clear_handle_collision_range` captures the doomed ids up front and now also deletes the seeded `auth.users` rows after deleting members.
- `web/evals/phase-0/floor.spec.ts` — six tests now call `admin.rpc("eval_seed_auth_user_only", { p_id: <id> })` before any direct members insert OR before any `invokeMemberCreate` for a fresh auth id. Added a `cleanupAuthUsers(ids)` helper at the bottom that best-effort `admin.auth.admin.deleteUser` per id. The seventh test (anon UPDATE smoke at line 430, not in the original failure list but with the same code shape) was preemptively updated to use the same pattern.

**Disposition:** accepted-as-is — fix-forward is in-scope per the rebuild-phase rules. The Phase 0 spec predates the constraint trigger; the spec edits bring it forward to the current substrate. The new test helper file follows the existing 00–03 conventions (SECURITY DEFINER, service_role grant, header comment, comment on function).

**Going-forward rule:** any test that writes directly to `public.members` from PostgREST/service-role MUST first call `eval_seed_auth_user_only(p_id)`. Any test that drives a `member.create` for a fresh auth user MUST first call `eval_seed_auth_user_only(p_id, p_email)` to provision the auth.users row without firing the signup hook. The hook-firing path is exercised by the dedicated T044 test at `floor.spec.ts:308` (canonical createUser pattern).

## 2026-05-17 — T052 — Fix-forward: Playwright `testDir` widened to `./evals` so phase-0 spec is discoverable

**What:** `web/playwright.config.ts` `testDir` was `./evals/features`, which excluded `evals/phase-0/floor.spec.ts` from Playwright's test discovery. T052 ratified the manual smoke command `npx playwright test evals/phase-0/floor.spec.ts` as the exit criterion but did not update the config. Fix-forward: widened `testDir` to `./evals` so Playwright walks both `features/` and `phase-0/`.

**Why:** Single source of truth — both subfolders are evals, both should be discovered. A narrower fix (separate `playwright.config.phase0.ts`) would multiply configuration without any payoff, since the `webServer` + `mobile-chrome` project apply to both. The widened `testDir` is the minimum surface change. Anchored to T052 § Tests, "Manual smoke" bullet — the command the ticket itself documented could not run against the shipped config.

**Disposition:** accepted-as-is — surfaced at PM verification time; trivially fixable; no spec patch needed (T052's exit-criteria language is unchanged, the config now matches it).

## 2026-05-17 — T052 — Defense-in-depth: secondary `foreign_key_violation` catch in failure-injection helper

**What:** The ticket § Helper 5 design note sketches the body with a single `exception when not_null_violation` clause. The shipped helper adds `when foreign_key_violation` as a secondary catch (still `null` body — substrate did its job either way).

**Why:** Today Postgres evaluates NOT NULL at row construction, before constraint triggers / FK checks — so passing `acting_member_id = NULL` always raises `not_null_violation` first. But the EXCEPTION clause is brittle to that ordering: a future Postgres release that reordered evaluation, or a schema change that dropped NOT NULL but kept the FK (e.g., relaxing `acting_member_id`), would surface `foreign_key_violation` instead and the helper would re-raise instead of returning the expected `{rolledBack:true, membersRowRemaining:false}`. The substrate's same-transaction invariant is the property under test — both rollback paths satisfy it. M2 code-review surfaced the brittleness; fix-now landed in the same loop. Anchored to Postgres constraint-evaluation order (`tablecmds.c` row-construction checks precede `RI_FKey_check` triggers in the current source).

**Disposition:** accepted-as-is — no spec patch needed (the ticket's helper body was sketched, not literal; the EXCEPTION clause is intentionally an implementation detail).

## 2026-05-17 — T052 — Handle-length precondition added to seed helper

**What:** `eval_seed_handle_collision_range(p_base, p_count)` gains two upfront `raise exception` guards: (a) `p_base` length >= 4 (matches `members.handle` CHECK constraint, lower bound); (b) `p_base + '-' + p_count` length <= 30 (upper bound, accounts for the worst-case suffix). The ticket § Helper 6 spec does not call these out; M2 code-review caught the latent silent-corruption risk.

**Why:** `members.handle` has `check (char_length(handle) between 4 and 30)` (002_members.sql line 45). The seed function's `on conflict do nothing` catches *unique* violations only — it does NOT catch *check* violations. A caller passing `p_base='x'` (3 chars) or `p_base='averyverylonghandle', p_count=99` (suffix overflows 30 chars) would raise a hard `check_violation` mid-INSERT, leaving the helper in a confusing state. The early-raise turns the failure mode into a loud, parameterized exception with `errcode 22023` before the INSERT begins. The spec's only consumer passes `p_base='maya', p_count=99` which satisfies both bounds, so b1 behavior is unchanged; the guard is defensive against future callers (Phase 1 helpers may reuse this pattern with different bases). Anchored to Postgres constraint semantics — `ON CONFLICT … DO NOTHING` is unique-only per the SQL standard and the `pg_dump` documentation.

**Disposition:** accepted-as-is — the guard is a pure precondition tightening; the spec's intent ("seed p_count rows successfully") is what's enforced, not the wording.

## 2026-05-17 — T052 — Bootstrap script applies SQL files non-transactionally

**What:** `bootstrap-eval-helpers.ts` `applyHelpers()` runs `await client.query(sql)` on each `.sql` file without wrapping the loop in `BEGIN/COMMIT`. M2 code-review flagged this as a robustness consideration; the build did not switch to a transaction wrapper.

**Why:** Each helper file is independently idempotent (`create or replace function`, `create table if not exists`). A failure mid-loop leaves earlier files applied — but a re-run of `npm run eval:bootstrap` re-applies everything cleanly. Wrapping in a transaction would give all-or-nothing semantics, which is theoretically nicer, but Postgres CREATE FUNCTION + CREATE TABLE inside a single transaction with intervening `client.query(rawSqlBody)` runs into the libpq multi-statement quirk where a syntax error in file N suppresses statements N+1..M with no useful error position. Per-file application surfaces the failing file precisely. Anchored to the libpq multi-statement error-reporting behavior (one statement-level error wins; later statement-level errors are swallowed in the same `PQexec`). Trade-off accepted: partial-state visibility costs less than mystery-file-fails-with-no-position.

**Disposition:** flag-for-spec-revision — the bootstrap-script header notes "each file applied non-transactionally; failure leaves earlier files applied" as a known property. If a future helper requires all-or-nothing application (e.g., a multi-file refactor where file 4 depends on file 3's commit state), reopen.

## 2026-05-17 — T052 — Vitest mirror committed as plain-node sandbox runner

**What:** `web/scripts/t052-sandbox-check.mjs` duplicates the regex set from `web/tests/eval-bootstrap.test.ts` in plain Node. Per T049's pattern (also T047/T048 inline), the sandbox mirror lives alongside the Vitest file rather than as a thin wrapper.

**Why:** Vitest 4 + rolldown segfaults under Linux x86_64 in the build sandbox (BUILD-LOG T051 note). The plain-node mirror is the build-agent's only way to verify red/green inside the sandbox without booting Vitest. Pattern established by T049; T052 extends it. Anchored to BUILD-LOG.md T051 § "Sandbox note."

**Disposition:** accepted-as-is — duplication is the convention until a shared regex inventory exists. Future ticket can refactor; until then, parallel test pair is the right shape.

## 2026-05-17 — T050 — Fix-forward: NOT VALID FK incompatible with partitioned referencing tables

**What:** The ticket § Acceptance Criteria mandates the two-step `not valid` + `validate constraint` pattern for both FK retrofits (`member_events_via_delegation_fkey` and `location_events_via_delegation_fkey`). Postgres rejects this with SQLSTATE 42809 ("cannot add NOT VALID foreign key on partitioned table") because both referencing tables are RANGE-partitioned on `created_at` per ADR-7's append-only invariant. Fix-forward: dropped the `not valid` qualifier and the second `validate constraint` statement; single `ADD CONSTRAINT ... FOREIGN KEY ... ON DELETE SET NULL;` per retrofit. Surfaced at runtime when the user ran `supabase db reset`; build-side file-shape tests passed because they regex-matched the SQL text without exercising Postgres.

**Why:** The two-step pattern is correct muscle memory for populated non-partitioned tables (avoids a table-scan lock during ADD CONSTRAINT). On partitioned referencing tables it's actively rejected — Postgres requires the FK validate immediately so the constraint can be recursively propagated to all existing partitions at creation time. Both `member_events` and `location_events` are empty today (zero rows across all partitions), so the immediate validation that the single-statement shape forces is a no-op. The recursive propagation to partitions created later by the rotation functions happens automatically per Postgres partitioned-table FK semantics. Anchored to Postgres source: `gram.y` + `tablecmds.c` reject `NOT VALID` for any `RELKIND_PARTITIONED_TABLE` referencing side.

**Disposition:** flag-for-ticket-rewrite — T050's § Acceptance Criteria lines for both FK retrofits need to drop the `not valid` + `validate constraint` mandate and add a one-line note that NOT VALID is incompatible with partitioned referencing tables. The M2 code-review pass for T050 also missed this and asserted partitioned-FK + NOT VALID was "safe on Supabase PG15+" — that review heuristic needs revision. Going-forward rule: any FK retrofit on a `*_events` table (all partitioned per ADR-10/ADR-7) uses the single-statement shape. Going-forward rule for the M2 reviewer: partitioned-table referencing-side restrictions are real and need explicit verification, not pattern-matching against non-partitioned precedent.

## 2026-05-17 — T050 — Partial-index predicate simplified (no now() in WHERE)

**What:** `member.md` line 393 declares the partial index `idx_delegations_member_active` with `where revoked_at is null and (expires_at is null or expires_at > now())`. The shipped migration drops the time predicate: `where revoked_at is null` only.

**Why:** Postgres evaluates partial-index predicates at INSERT time, not query time. A row inserted today with `expires_at = today + 1day` enters the index, and tomorrow when `now()` has advanced past `expires_at`, the row is still in the index until the next INSERT recomputes — which it won't, for that row. The predicate is misleading at best, incorrect at worst. The action layer applies the `expires_at` filter at query time. Slightly larger index, but correct. Anchored to Postgres partial-index semantics (predicate is a constant once the row is committed).

**Disposition:** flag-for-spec-revision — `pipeline-product` to patch `member.md` line 393 to match the shipped predicate, or note that the spec line is a behavioral intent ("active = unrevoked AND unexpired") that the index alone cannot enforce and the action layer must filter at query time. Either resolution is fine; spec-vs-implementation drift is the only issue.

## 2026-05-17 — T050 — Consolidated 007g_ + 007h_ from rebuild plan into single 012_*

**What:** `notes/migration-to-primitives.md` § Phase 1 labels the agent-assistance substrate as two files: `007g_member_self_records.sql` + `007h_member_delegations.sql`. The shipped migration consolidates both tables (plus the FK retrofits on `member_events` and `location_events`) into a single `012_member_agent_assistance.sql`.

**Why:** Two reasons converge — (a) Supabase CLI rejects alpha-suffixed numbering (`002a` / `002b` / `007g` / `007h`) and silently skips those files; the going-forward rule from T042 mandates `^\d+_[a-z0-9_]+\.sql$`; (b) the two tables ship together because the FK retrofits on `member_events.via_delegation_id` and `location_events.via_delegation_id` reference `member_delegations(id)` — splitting them would either leave the FK column without its FK for a release cycle or require a third migration just for the retrofit. Single-file is the right shape. Anchored to T042's DEVIATIONS entry that established the alpha-suffix prohibition.

**Disposition:** accepted-as-is — same pattern as T042 (consolidated 002 + 002a + 002b → 002_members.sql) and T047 (rebuild plan's 007_* renumbered to 009_*). The rebuild plan's filename hints are advisory; the constraint is the regex.

## 2026-05-17 — T050 — No bootstrap trigger on members for member_self_records

**What:** Other Member-related tables added in Phase 1 (e.g., `member_privacy` in T047) carry a bootstrap trigger on `public.members` so every signup gets a row with defaults. `member_self_records` deliberately has no such trigger; rows exist only when a Member opts into agent assistance (b2+ surface) via the action handler `member.self_record.update`.

**Why:** Most Members at b1 will never opt into agent assistance — the surface ships b2+. Auto-creating a row per Member at signup would create N empty `'{}'::jsonb` documents for no purpose: storage cost, query-path complexity, and an asymmetry between Members who have a row and Members who don't that downstream consumers would have to defend against. Pattern: row exists when the Member writes to it; absent otherwise. The action handler does insert-or-update on first write. Anchored to ticket § Acceptance Criteria "No bootstrap trigger" and the supporting `_Intent:_` block.

**Disposition:** accepted-as-is — flagged in the migration header (section 2 of the file comment) so future agents reading the schema don't add the trigger thinking it was an oversight.

## 2026-05-17 — T049 — Sandbox smoke runner committed alongside the Vitest suite

**What:** Vitest 4 + rolldown segfaults under Linux x86_64 in the build sandbox (BUILD-LOG T051 note). T049's file-shape assertions live in `web/tests/migrations-t049.test.ts` (Vitest, the user-side suite) and `web/scripts/t049-sandbox-check.mjs` (plain-node mirror that exercises identical regexes). The script is committed so future agents can re-run the ~49 assertions inside the sandbox without booting Vitest.

**Why:** The pattern is already established by T047 / T048 ("sandbox plain-node mirroring `web/tests/migrations-t04N.test.ts`") but prior tickets did not commit the mirror file — each ticket re-derived the regex set inline. Committing the script makes the convention explicit and keeps the sandbox check reproducible. Anchors to `BUILD-LOG.md` T051's "Sandbox note" + ADR-7's CI-enforcement framing.

**Disposition:** accepted-as-is — the script duplicates the test file's regexes by design (independent verification). If a future ticket adds a single shared regex inventory, the script becomes a thin runner over it; the parallel pair is the right shape until then.

## 2026-05-17 — T049 — Functions implemented as `language sql` not `language plpgsql`

**What:** The three SECURITY DEFINER access functions (`member_is_local_to_location`, `count_likes_for_location`, `count_followers_for_location`) use `language sql` with a single-statement body. The ticket doesn't mandate a language; ADR-16 doesn't either. T045's `sync_area_centroid` uses `plpgsql` because it executes an `update` with side effects; T049's functions are pure read scalars.

**Why:** `language sql` is the right shape for inline scalar functions — Postgres inlines them at plan time, which removes one stack frame per `member_is_local_to_location` call inside hot derivation queries (groups.md's locally-owned badge fires on every Group surface). `STABLE` and `set search_path = public` apply identically across both languages, so the ADR-16 guarantees are unchanged. Anchored to Postgres planner inlining behavior (only applies to `language sql` functions, never `plpgsql`).

**Disposition:** accepted-as-is — performance wins; semantics identical. If a future use case needs multi-statement logic inside a function, that function moves to `plpgsql`; existing three stay `sql`.

## 2026-05-17 — T049 — Schema-spec divergence noted but not patched (RLS shape)

**What:** The T049 ticket § Notes flags that `member.md`'s RLS section is sketchier than ADR-16 mandates and that `groups.md`'s locally-owned-derivation pseudocode needs an update to call `public.member_is_local_to_location()` instead of JOINing directly. T049 implements the schema correctly; the spec patches are `pipeline-product`'s job and are recorded here, not landed.

**Why:** Per CLAUDE.md rebuild rule firewall — build agents implement to the ticket and escalate spec divergence rather than rewriting upstream specs. Anchors to ticket § Notes ("Schema-spec divergence — RLS shape") and AGENTS.md escalation table.

**Disposition:** flag-for-spec-revision — `pipeline-product` to patch `member.md` (RLS section), `groups.md` (locally-owned pseudocode), and `policy-framework.md` (anti-doxxing language) against ADR-16. JOURNAL.md entry at ticket close carries the forward-pointer.

## 2026-05-12 — T051 — Rule 4 annotation placement: above the call, not inline-on-interpolation-line

**Deviation:** The ticket spec (§ Rule 4) requires the `// sql-injection-safe: enum-constrained by <TypeName>` annotation "on the same line as the `${...}` interpolation." For a multi-line template literal — which is the only realistic shape for Postgres DDL/DML inside `.query` — the `${table}` interpolation lives on a SQL-syntax line inside the backticks where `//` cannot appear without being parsed as part of the SQL identifier (e.g., `insert into public.${table} // sql-injection-safe...` would resolve as `insert into public.member_events // sql-injection-safe...` which is not valid SQL).

The conformance script accepts the annotation on the call's source line OR on any of the 3 lines immediately above (walking back through whitespace and comment-only lines). `src/actions/_lib/event-log.ts` carries `// sql-injection-safe: enum-constrained by EventTable` on the line immediately above the `ctx.db.query` call.

**Reason:** The ticket's literal placement requirement is impossible to satisfy for multi-line template literals (the realistic case). The looser placement preserves the rule's intent (reviewer-visible annotation pinned to the call) without contradicting valid SQL syntax. A future AST-based check (ts-morph) could enforce the placement at the source-AST level and treat the annotation as a leading comment on the CallExpression — the regex approximation here matches that future shape.

**Impact:** Reviewers reading a flagged annotation see the same annotation text and the same TypeName claim; the diff is only the vertical position. The script's negative-tests verify that the annotation must still match `enum-constrained by [A-Z][A-Za-z0-9_]+` — single-letter TypeNames are still rejected per the ticket's regex.

**Escalation:** None — fix-forward inline. The placement loosening is documented in `web/scripts/check-action-layer-conformance.ts` Rule 4 commentary and in `web/CLAUDE.md` § "Writing a new API route."

**Resolution:** Annotation lives above the call; the script searches a small upward window. `src/actions/_lib/event-log.ts` carries one annotation covering both `${table}` and `${targetColumn}` interpolations — both are constrained by `EventTable` (the enum-narrowed parameter type).

## 2026-05-12 — T051 — Zombie sweep extended to admin/ UI surface (orphans of admin.ts deletion)

**Deviation:** The ticket's Step 0 lists nine API routes for deletion plus `src/lib/admin.ts` "if no surviving code imports it." After deleting the listed routes, `@/lib/admin` was still imported by `src/app/admin/{layout,page,markets/**,vendors/**}.tsx` (six files). Those pages also query `markets` / `businesses` tables that no longer exist in the rebuild schema. Build agent deleted the entire `src/app/admin/` tree to resolve the orphaned imports, exceeding the ticket's literal route-deletion list.

**Reason:** Step 0 explicitly says "Run `npm run lint && npm run build` after deletion to surface any orphaned imports; delete those too." The admin/ UI surface is in the rebuild plan's deletion list (`notes/migration-to-primitives.md` § "What we delete from current web/" — "all routes tied to old schema"). Keeping the orphans would either (a) leak a live `@/lib/admin` import that no longer resolves, breaking `npm run build`, or (b) require re-introducing `src/lib/admin.ts` to keep imports resolving — defeating the deletion. The cleanest path is the rebuild plan's own path.

**Impact:** `/admin`, `/admin/markets`, `/admin/markets/new`, `/admin/markets/[id]`, `/admin/vendors`, `/admin/vendors/[slug]` all 404 going forward. No surviving code references the deleted modules. The pre-rebuild admin panel is gone; the rebuild's admin surfaces (whenever scoped) will be greenfield.

**Escalation:** None — fix-forward extends the ticket's "delete orphans too" directive consistently. The rebuild-phase rule that build agent cannot read `planning/scenarios-backlog/` is still honored — the admin/ surface deletion is plain rebuild-plan execution, not new design.

**Resolution:** `src/app/admin/` deleted (8 files); `src/lib/admin.ts` deleted (1 file). Total zombie sweep: 9 API routes + 1 lib + 8 admin pages = 18 files removed. Documented in the Zombies-deleted section of this T051 report.

## 2026-05-12 — T051 — Vitest 4 + rolldown segfault under sandbox Linux x86_64 (verification deferred to darwin)

**Deviation:** The ticket calls for `npm test -- ci-enforcement` and `npm test -- rls-coverage` to pass green at close. In the Linux build sandbox, Vitest 4.1.4 (which depends on a native rolldown binding) reproduces `Bus error (core dumped)` for any test invocation — even simple file-shape tests that were green on darwin in T048's close. The failure is a binary-compatibility issue between rolldown's prebuilt native module and the sandbox's libc/kernel; it is not a code defect and is not specific to T051's test files.

**Reason:** Build agent's standard practice for T041+ has been to write Vitest assertions, verify them via plain-node parity checks in the sandbox, and rely on the user's darwin terminal to run the actual Vitest suite. T051's test files were written to the same standard and each negative case was reproduced manually by writing the same probe file into the tree, running `npm run check:action-layer` (or `npx eslint`), and observing the matching FAIL output and the expected violation message. Every probe path covered by a Vitest assertion has a matching manual reproduction logged below.

**Impact:** Build-side verification is by-script, not by-Vitest. User darwin run is the truth-y verification stage. If any of the four CI rules' Vitest tests fail on darwin for non-binary reasons, that's a real T051 defect; fix-forward applies.

**Escalation:** Flag for `pipeline-eval` (run mode) — the Playwright eval already runs in CI's Postgres-services container, so Rule 3's `rls-coverage.test.ts` will fire at eval time. Rules 1, 2, 4 are pure-Node and the darwin Vitest run handles them.

**Resolution:** Manual reproductions captured: Rule 1 — `pg` import probe fires `no-restricted-imports`; `SUPABASE_SERVICE_ROLE_KEY` env access fires `no-restricted-syntax`; bare `createClient` import fires `no-restricted-imports` via pattern. Rule 2 — probe route with `POST` but no `@/actions` import fires; probe with `// action-layer:exempt` annotation but no ledger entry fires; probe annotated + ledger entry passes; ledger entry with past `expires_at` fires. Rule 4 — probe with `${userInput}` fires; probe with `// sql-injection-safe: trust me` (bare payload) fires; probe with `// sql-injection-safe: enum-constrained by AllowedTable` passes; probe with `$1` parameterization passes. All four CLI invocations match the expected FAIL/OK shape. Rule 3 — DB test will run when the user invokes `supabase start && npm test -- rls-coverage`.

## 2026-05-11 — T048 — Follow visibility simplified to public-by-default (M2-driven product re-scope)

**Deviation:** The ticket called for `member_follows_public_read` to be gated by `member_privacy.show_following` + `show_followers` (both default `false` per T047), with `member_follows_self_read` always-on for the owner. The shipped migration drops the privacy gate entirely: `member_follows_public_read` is now `using (true)` and the separate self-read policy is removed (subsumed by public_read).

**Reason:** Two forces converged at M2:

1. **Critical RLS bug found.** The original dual-EXISTS pattern referenced `public.member_privacy` from inside the policy's USING clause. `member_privacy`'s own RLS (`member_privacy_owner_read` = `member_id = auth.uid()`) blocks the subquery for any non-owner caller, so the EXISTS returns false in every cross-Member case. Net effect: the spec'd "publicly readable when both endpoints opt in" never fires. The canonical fix is a SECURITY DEFINER function per the pattern at `member.md` lines 295-298 (`public.count_followers_for_location`, `public.member_is_local_to_location`).

2. **Product re-scope from the PM at M2.** Before deciding which fix path to take, the PM pushed back on the privacy posture itself: "Follow graph is social fabric — community members already know who hangs out with whom. The real privacy concern is *where Members live and work* — and only for hostile cross-community actors. The follow-gating is over-locked-down for the actual threat model."

   The product decision: follow visibility becomes public-by-default at b1. The strict ADR-9 opt-out posture lives where it earns its keep — on `member_location_affinities` (T049), where `lives` and `works` affinity rows are owner-only at the row level with SECURITY DEFINER functions for cross-Member computation (the exact pattern `member.md` line 296-298 already specifies). The `member_privacy.show_following` / `show_followers` columns from T047 remain as reserved substrate; the action layer / a future b2 surface composer may wire them in later if real-Member feedback warrants a per-Member opt-out, but the schema does not enforce them at b1.

**Impact:**
- The RLS bug becomes moot — there's nothing to gate.
- Schema simplifies: single permissive SELECT policy on `member_follows`, no SECURITY DEFINER function needed for the follow graph.
- T049 (Location affinities) inherits the harder privacy work. The ticket for T049 should call out the SECURITY DEFINER pattern at member.md lines 295-298 explicitly when it ratifies through `pipeline-plan`.
- `member.md` lines 211-228 still spec `show_following` + `show_followers` as `default false`. The columns + defaults match the spec; the new design call is that the *follow visibility* doesn't enforce them at b1. A one-line flag added to `member.md` under the `member_privacy` section so `pipeline-product` sees the scope shift.

**Escalation:** Product decision is the PM's call (in-conversation 2026-05-11). Flagged in `member.md` for `pipeline-product` to memorialize the shift if the design holds through b2 — at which point the `show_following`/`show_followers` columns can either be deleted (clean removal) or re-wired into the action layer (action-layer-applied gating, not RLS-applied).

**Resolution:** `010_member_interests_follows.sql` updated: dual-policy structure → single `using (true)`. Migration header + table comment + `member.md` flag all carry the same explanation. T049 will pick up the load-bearing privacy work on Location affinities.

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

