# ADR-0018: Eval helpers — folder boundary and failure-injection strategy

**Status:** Accepted
**Date:** 2026-05-17
**Deciders:** PM
**Scope:** Phase 0 verification surface for T041–T044, with forward-compatible extensions for Phase 1+
**Touches:** `web/supabase/test-helpers/` (new folder), `web/scripts/bootstrap-eval-helpers.ts` (new), `web/scripts/check-action-layer-conformance.ts` (existing — gains `--json`), `development/tickets/T052-phase-0-eval-helpers.md`

## Decision

Two coupled decisions for the eval-helper substrate.

**Decision 1 — Helpers location.** Eval-only Postgres helpers (introspection RPCs, failure-injection RPCs, seed/teardown RPCs) live in a new `web/supabase/test-helpers/` folder, applied by `web/scripts/bootstrap-eval-helpers.ts` via `npm run eval:bootstrap`. The script hard-exits if `DATABASE_URL` resolves to anything other than `localhost`, `127.0.0.1`, or `host.docker.internal` (or `SUPABASE_ENV=local` is set). `web/supabase/migrations/` continues to hold production schema only; nothing in `test-helpers/` is reachable by `supabase db push`.

**Decision 2 — Failure-injection path.** `eval_member_create_with_failure_injection` reproduces ADR-7's same-transaction invariant in plpgsql via subtransaction + constraint violation. The Node action handler is not invoked from the eval helper. The handler's own commit-path coverage stays in Vitest.

## Options considered

### Decision 1 — Helpers location

| Option | Where helpers live | Prod-safety guard | Verdict |
|---|---|---|---|
| **A — Chosen** | `web/supabase/test-helpers/` + bootstrap script | Script refuses non-local DBs; folder excluded from `supabase db push` by location | Chosen |
| B | `web/supabase/migrations/013_eval_helpers.sql` (a normal migration) | Comment header + developer discipline | Rejected |
| B′ | A normal migration, gated by `IF current_setting('app.env') = 'local'` | Postgres-side guard on every function | Rejected |
| C | Inline in each spec file via raw SQL strings | None — helpers vanish at test boundary | Rejected |

### Decision 2 — Failure-injection path

| Option | What gets verified | Where the failure is injected | Verdict |
|---|---|---|---|
| **A — Chosen** | The same-transaction property as a substrate invariant | Inside plpgsql via `NOT NULL` constraint violation | Chosen |
| B | Full handler path including Node-side commit sequencing | `?fail_mode=event_log` query param on `/api/internal/auth-signup`, gated to non-prod | Rejected |
| C | Both A and B | Both injection paths | Rejected (unjustified at b1) |

## Trade-offs

**Decision 1.** Option A separates production schema from eval surface at the folder level. A developer reading `migrations/` sees only what will hit prod. The cost of accidentally applying `eval_seed_handle_collision_range` to production is high — 99 garbage rows in `members`, FK contamination in `member_events`, and a CI conformance violation under T043/T051 (since `test-helpers/` writes directly to `members` and `member_events`, the exact pattern the action-layer-conformance check forbids in production code paths). Folder separation makes that contamination unreachable rather than discouraged.

Option B's failure mode is silent. `supabase db push` would apply the helpers; the conformance script would flag them on the next CI run, but only *after* shipping. Option B′ pushes the guard into Postgres but still leaves test-only entry points in `migrations/`, inverting the principle that the safest guard is the one that prevents the code from being there at all. Option C trades clarity for portability — Phase 1's helpers would each reinvent the wheel.

**Decision 2.** The invariant under test is stated in `action-layer.md` line 87: "Eval-runners assert the same-transaction property via deliberate failure injection (force the event-log insert to fail and verify the row insert rolls back) on every Cluster 1+ ticket." The contract names a property — not a code path. Either option satisfies the literal contract.

Path A asserts the property *as a substrate invariant*. Postgres's subtransaction semantics + `NOT NULL` enforcement + the action handler's reliance on the pg client's transaction wrapper together produce the rollback; verifying the substrate behavior covers any well-formed handler that uses the substrate correctly. The handler's own commit sequencing is already covered by Vitest, which sees the Node code directly and can mock failure modes the SQL helper can't reach.

Path B is faithful to the docstring's literal wording. The cost: a new query-param surface on `/api/internal/auth-signup` that exists only for tests, plus a test-secret gate, plus an HTTP hop from the spec. The query param is dead code in production by gate, but it is still production-surface code that an attacker reads, an auditor questions, and a future refactor must preserve.

The eval-writer firewall (`floor.spec.ts` line 16: spec cannot import `web/src/`) is what forces the choice. The spec cannot call the handler directly in process. It must either go through HTTP (Path B) or verify the property via the substrate (Path A). The HTTP hop costs more than the substrate verification, and the substrate verification covers the same property.

Path C (both) is rigorous but unjustified at b1. Add Path B if a future commit-path change introduces non-trivial Node-side state that SQL-side reproduction can't reach (e.g., a multi-statement handler that holds intermediate state in application memory between writes). That trigger doesn't exist today.

## Consequences

**From Decision 1:**

- T052 ships four files in `web/supabase/test-helpers/`: `00_introspection.sql`, `01_conformance.sql`, `02_action_failure_injection.sql`, `03_handle_collisions.sql`. Lexicographic-order application; idempotent via `create or replace function` and `create table if not exists`.
- `web/scripts/bootstrap-eval-helpers.ts` is the only sanctioned path to apply them. The script's host check is the load-bearing guard; the folder name is the legibility signal.
- The action-layer-conformance script (`web/scripts/check-action-layer-conformance.ts`, T043/T051) gains an allowlist entry for `web/supabase/test-helpers/` so the `pg` import and direct-write patterns in the bootstrap path don't trip ADR-7's "no service-role writes outside named handlers" rule. **This allowlist entry is the one place where the conformance rule has a hole; the hole is explicit, named, and confined to a single path.**
- The Phase 0 eval workflow becomes: `supabase start && npm run eval:bootstrap && npx playwright test evals/phase-0`. This sequence belongs in the eval-running README; T052 includes a manual-smoke step that walks it.
- Forward-compatible. Phase 1 helpers ship as additional `web/supabase/test-helpers/04_phase1_*.sql` files. The bootstrap script picks them up via lexicographic ordering; no new infrastructure is required.
- Foreclosure. This decision forecloses a path where eval helpers live in `migrations/` for tooling-convenience reasons. Reversible at non-trivial cost — every helper would need re-homing — but the reverse direction is the one this ADR exists to prevent.

**From Decision 2:**

- T052 implements Path A. The plpgsql body lives in `web/supabase/test-helpers/02_action_failure_injection.sql`. The function comment references this ADR by name.
- The `floor.spec.ts` assertion against Helper 5 reads as: *"the substrate enforces row-and-event same-transaction commit; the handler is built on the substrate; therefore the handler inherits the property."* This reasoning chain belongs in a comment on the spec's Helper 5 call site.
- Vitest unit tests in `web/src/actions/__tests__/member-create.test.ts` (or equivalent — T044 owns the handler) continue to cover the handler's commit sequencing, including the Node-side branches Path A can't see. The two coverage surfaces pin the invariant from both ends.
- Foreclosure (soft). A future ticket that changes the action handler's commit path to add non-trivial Node-side state must escalate to add Path B. The escalation trigger lives in `development/DEVIATIONS.md` as a precondition: "any handler that adds Node-side state between row insert and event insert ratchets Helper 5 from Path A to Path A + Path B."
- The T052 ticket previously referenced "ADR-10's same-transaction invariant" in its Helper 5 design note. **ADR-10 was consolidated into ADR-7 on 2026-05-10** per `DECISIONS.md`. T052 update flips those references to "ADR-7's same-transaction invariant" as part of the ratification commit.

## Action Items

1. [x] PM ratifies this ADR (Status flipped from Proposed → Accepted, 2026-05-17).
2. [x] Add pointer line to `../DECISIONS.md` pointer index.
3. [ ] Update T052 Status line: "Draft — awaiting `pipeline-review` PROCEED" → "Accepted — ADR-18 ratified; ready for build."
4. [ ] Fix T052's stale ADR-10 references to ADR-7 (Helper 5 design note, § Notes "Why Path A on Helper 5", and the Path A body's inline comment).
5. [ ] Build picks up T052 via `pipeline-build`.
6. [ ] When Phase 1 introduces new failure-injection helpers, revisit Path A vs Path B per the escalation trigger above.
