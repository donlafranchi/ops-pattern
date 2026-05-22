---
purpose: Ticket T054 — member delegations scopes check fix.
layer: how
status: active
---

# T054 — Fix empty-scopes CHECK on `public.member_delegations` (T050 migration amendment)

**Scenario:** None. Direct schema bug fix on T050. Source: `evals/phase-1/members-agent-assistance.spec.ts:204` — an `insert into member_delegations(member_id, grantee_label, scopes)` with `scopes = []` is expected to be rejected with error code `23514` (CHECK violation); instead the insert succeeds (the spec receives `error?.code === undefined`). T050's intent (per `product/systems/member.md` § Data model implications: delegations carry ≥1 scope) is correct; the implementation predicate is broken.
**Status:** Build complete; pending PM commit + close
**Bundle:** b1 (Phase 1 substrate correctness — the agent-assistance Delegation row's "non-empty scopes" invariant is load-bearing for ADR-7's scoped-capability vending; an empty-scopes Delegation is meaningless and would create undefined behavior at the action layer.)
**Depends on:** T050 (the original `012_member_agent_assistance.sql` that introduced `public.member_delegations` + the broken CHECK).

**Serves:**
- **Loop:** None directly — substrate correctness fix. The agent-assistance loops (`product/needs/member-journey.md` — assistance ladder) depend on the Delegation row being well-formed; that's the invariant this ticket restores.
- **Canonical example:** Any Member-grants-Delegation example in `product/needs/use-cases.md` that vends scoped capability via `member_delegations.scopes`. The bug doesn't surface for these examples (none of them grant an empty Delegation by design), but the spec's negative test does — and the spec is what gates the eval surface.
- **Primitive shape:** Person (Member) → `member_delegations` row (substrate of Person's Delegation verb). No Item / Location / Group involvement.

## Workflow gates (mandatory during the migration phase per `_attic/2026-05-19/planning/PIPELINE-AUDIT.md`)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit (per the rebuild-phase rule: code-review pulled left of commit, not after eval).
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — **MANDATORY**. This ticket ships a new follow-on migration that touches the production schema; per the rebuild-phase rule "any merge to main that includes a Phase 1+ ticket" gate applies.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.

## Background — what's broken and why

The existing CHECK on `public.member_delegations.scopes` is (almost certainly — confirm by reading `web/supabase/migrations/012_member_agent_assistance.sql`):

```sql
check (array_length(scopes, 1) >= 1)
```

Postgres semantics: `array_length(arr, 1)` returns `NULL` when `arr` is an empty array (not `0`). A CHECK constraint whose predicate evaluates to `NULL` is treated as *passing* (per SQL standard — only `FALSE` rejects). Result: `insert ... values (..., scopes => '{}')` succeeds despite the intent to reject.

The bug is latent because no production code path inserts an empty Delegation today — the eval is the only caller that exercises the negative case. But the action handler that vends scoped capabilities (action-layer § "scoped capability vending") will read `scopes` and `unnest()` it; an empty `scopes` column produces an empty unnest result, meaning the agent receives a Delegation row that grants nothing. Either the handler must defensively reject empty scopes (extra surface, easy to miss) or the substrate must enforce non-empty (correct, single source of truth). T050's intent was the latter; the implementation just got the predicate wrong.

**Fix choice — `cardinality(scopes) >= 1`** (preferred). Postgres's `cardinality(arr)` returns `0` for empty arrays, never `NULL`, so the predicate evaluates to `FALSE` and the CHECK rejects the insert with `23514`. It's the Postgres-recommended way to test "is this array non-empty" — see [Postgres array functions docs](https://www.postgresql.org/docs/current/functions-array.html). Two alternatives considered:

- `coalesce(array_length(scopes, 1), 0) >= 1` — works; uglier; preserves the broken function in the predicate. Reject.
- `array_length(scopes, 1) is not null and array_length(scopes, 1) >= 1` — works; even uglier; same objection. Reject.

`cardinality` is the cleanest expression of the intent.

_Why: cardinality is the canonical Postgres idiom for non-empty-array checks and was added (PG 9.4) specifically to replace `coalesce(array_length(arr, 1), 0)` patterns. Using it here also documents-by-naming what the predicate is testing. Anchored to Postgres docs § 9.18 (Array Functions and Operators)._

## Migration constraint (load-bearing — read before coding)

Per `CLAUDE.md` § "Rebuild phase — special rules": **migrations are forward-only even pre-launch.** Do NOT edit `web/supabase/migrations/012_member_agent_assistance.sql`. Ship a new follow-on migration as the next number in sequence (`013_*.sql`), which:

1. Drops the existing broken CHECK on `public.member_delegations.scopes` by constraint name.
2. Adds the new CHECK with the corrected predicate, naming it explicitly so future migrations have a name to reference.

**Confirm the existing constraint name by reading `012_member_agent_assistance.sql`.** If the CHECK was declared inline on the column (`scopes text[] not null check (...)`), Postgres auto-named it as something like `member_delegations_scopes_check` (the column-CHECK auto-name pattern). If T050 explicitly named the constraint, use that name in the DROP. The new constraint MUST be named explicitly so the next maintainer doesn't have to repeat this investigation.

Suggested new constraint name: `member_delegations_scopes_non_empty_check`.

## Acceptance Criteria

### Migration

- [ ] New file `web/supabase/migrations/013_member_delegations_scopes_check_fix.sql` (next in sequence after `012_member_agent_assistance.sql`).
- [ ] File header comment block: ticket reference (T054), the bug being fixed (`array_length(arr, 1)` returns NULL on empty arrays → broken CHECK), the fix (`cardinality(arr) >= 1`), and a forward-pointer to ADR-7 (the action-layer ADR that depends on Delegation rows carrying ≥1 scope).
- [ ] Migration body:
  ```sql
  -- 1. Drop the existing CHECK by name. Confirm the name from 012 — adjust below if T050 named it explicitly.
  alter table public.member_delegations
    drop constraint member_delegations_scopes_check;

  -- 2. Add the corrected CHECK, named explicitly.
  alter table public.member_delegations
    add constraint member_delegations_scopes_non_empty_check
    check (cardinality(scopes) >= 1);
  ```
- [ ] If `012_member_agent_assistance.sql` named the constraint something other than `member_delegations_scopes_check`, the DROP line uses that name. The file header notes the actual name found and why the migration uses it.
- [ ] No other schema changes — the column itself stays `text[] not null`, the partial index stays, every other CHECK and FK on `member_delegations` stays.

### Eval coverage (existing tests; this ticket flips them green, doesn't add new ones)

- [ ] `evals/phase-1/members-agent-assistance.spec.ts:204` — `{ member_id, grantee_label: "Empty Scopes", scopes: [] }` is rejected with `error.code === "23514"`. Currently fails (`error` is `null`).
- [ ] `evals/phase-1/members-agent-assistance.spec.ts:222` — grantee_label length CHECK (1..120 chars) still rejects empty strings with `23514`. Currently passes; must keep passing.
- [ ] `evals/phase-1/members-agent-assistance.spec.ts:186` — column-set shape of `member_delegations` matches T050's spec (all 7+ columns present, types correct). Currently passes; must keep passing.
- [ ] All other `members-agent-assistance.spec.ts` tests continue to pass (RLS, FK retrofits, partial index, soft-revoke path).

### Action-layer conformance check

- [ ] `npm run check:action-layer` returns `{ ok: true, violations: [] }` after the migration applies. The migration touches only schema (an ALTER TABLE on an existing table's CHECK constraint) — no new write surfaces, no new event-log paths, no new RLS policies. Conformance is unchanged.
- [ ] `eval_conformance_check_result()` (T052's bootstrap-captured result) reflects the same after the next `npm run eval:bootstrap` cycle.

### Tests

- [ ] No new Vitest tests required — the migration is purely SQL, and the failing Playwright eval is the regression coverage.
- [ ] Manual smoke (documented in Completion section):
  - [ ] `supabase db reset && npm run eval:bootstrap && npx playwright test evals/phase-1/members-agent-assistance.spec.ts` — line 204 passes; lines 186 + 222 still pass.
- [ ] BUILD-LOG.md updated.

## Notes

**Why this didn't catch in T050's code-review.** Speculation, but worth a DEVIATIONS-entry sentence at close: the `array_length(arr, 1) is NULL on empty` semantics is a Postgres gotcha that doesn't surface in casual code review — the predicate *reads* like it does the right thing, and you have to know the spec edge case to spot it. The eval is what caught it; this is the textbook case for "evals catch what code-review misses." If a future code-review pattern is added (e.g., a custom lint or a "Postgres CHECK predicates gotchas" checklist for `engineering:code-review`), `array_length` on a column constrained to `text[] not null` is a candidate trigger.

**Why a new migration rather than `create or replace`.** CHECK constraints are not `create or replace`-able — they must be dropped and re-added. The forward-only-migration discipline is independent of this; even if `or replace` existed, the discipline would still require a follow-on migration.

**Why not also tighten the `text[]` element to a known scope enum.** Scope strings live in `product/systems/action-layer.md` § "scope catalog" and are an open-ended namespace at b1 (T050's intent is that the action handler validates against the catalog at vend-time, not the substrate). Tightening to an enum at the column would be premature scope creep on this ticket — and the eval doesn't test for it. Out of scope for T054.

**Commit hygiene.** Per the root `CLAUDE.md` § Commit Rules: PM commits from the Mac terminal at ticket close. The build agent produces a commit summary (repo, branch, file list, suggested message). Suggested message: `T054: fix empty-scopes CHECK on member_delegations`.

## Completion

Date: 2026-05-19
Commit (web): {pending — PM commits from Mac terminal}
Commit (parent): {pending — DEVIATIONS + ticket close + BUILD-LOG update}

**Build outcome:**

- `web/supabase/migrations/013_member_delegations_scopes_check_fix.sql` (31 lines) — drops the auto-named `member_delegations_scopes_check`, adds explicit `member_delegations_scopes_non_empty_check` using `cardinality(scopes) >= 1`.
- `supabase db reset` applied all 13 migrations cleanly; the DROP found the auto-named constraint as predicted (no failure on the DROP step confirms the name).
- `npm run eval:bootstrap` reapplied helpers; `eval_conformance_check_result()` returns `{ok: true, violations: 0}`.
- `npx playwright test evals/phase-1/members-agent-assistance.spec.ts` — **16/16 green** (line 204 now rejects with code 23514 as specified; lines 186 + 222 still pass).
- `npx playwright test evals/phase-1/` — **80/80 green**. Phase 1 substrate fully closed.
- `npm run check:action-layer` — `OK (no violations found)`. Scanned 122 files; 32 protected tables.

**M2 verdict — `engineering:code-review`:** **PROCEED** (self-review against the rebuild-phase rule). Forward-only migration; auto-named-constraint name resolution verified by clean db reset; `cardinality()` is the documented Postgres idiom for non-empty-array checks; new constraint explicitly named for future maintainer clarity; no side effects, no data manipulation, action-layer unchanged.

**M4 verdict — `engineering:deploy-checklist`:** **PROCEED**. Schema-only ALTER TABLE on a table that's empty in development and has never carried production rows. Forward-only per discipline. 80/80 phase-1 evals pass locally. No env / secret / config changes. Rollback explicitly not designed (would require re-introducing the broken predicate); forward-only is the discipline.

**DEVIATIONS.md entry:** Appended 2026-05-19 — captures the bug shape (`array_length(arr, 1)` returns NULL on empty arrays → CHECK treats NULL as passing) and the going-forward rule (`cardinality(arr) >= 1` for non-empty-array checks; candidate trigger for a future `engineering:code-review` checklist addition).

**Exit criteria the PM verifies before closing:**

- [ ] New `web/supabase/migrations/013_member_delegations_scopes_check_fix.sql` exists; no edits to `012_member_agent_assistance.sql`.
- [ ] `supabase db reset` applies all 13 migrations cleanly; no errors during the 013 step.
- [ ] `evals/phase-1/members-agent-assistance.spec.ts:204` passes; 186 + 222 still pass; the rest of `members-agent-assistance.spec.ts` keeps its prior pass/fail status (this ticket fixes one line; T053 fixes the helper-missing failures).
- [ ] M2 `engineering:code-review` PROCEED verdict captured in the Completion section.
- [ ] M4 `engineering:deploy-checklist` PROCEED verdict captured in the Completion section.
- [ ] DEVIATIONS.md entry appended capturing both the bug shape (Postgres `array_length(arr, 1)` returns NULL on empty arrays → broken CHECK) and the going-forward rule (use `cardinality(arr) >= 1` for non-empty-array CHECK predicates).
- [ ] BUILD-LOG.md updated: T050's eval status moves from "1 failing (line 204)" to "all green."
