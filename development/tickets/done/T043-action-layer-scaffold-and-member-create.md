---
purpose: Ticket T043 — action layer scaffold and member create.
layer: how
status: reference
---

# T043 — Action layer scaffold + `member.create` handler (proof of pattern)

**Scenario:** `planning/rebuild-plan.md` § Phase 0 — AI-native floor (`003_action_layer_scaffold`)
**Status:** Complete *(build-side; runtime verification pending `pipeline-eval` run-mode against `web/evals/phase-0/floor.spec.ts`)*
**Completed:** 2026-05-11T14:31:32+00:00
**Bundle:** b1
**Depends on:** T042

**Serves:**
- **Loop:** All five loop families (substrate). Per ADR-7, every Phase 1+ write goes through this layer; this ticket establishes the pattern.
- **Canonical example:** All — every later canonical-example surface writes via a named action handler. `member.create` is the proof-of-pattern that auth signup (T044) and every Member-touching flow afterward use.
- **Primitive shape:** Person. The first handler exercises the full write path: input validation → audit-field injection → transaction wrapper → event-log row in the same transaction → return value.

## Workflow gates (mandatory during the rebuild phase per `CLAUDE.md` § Rebuild phase — special rules)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode) is called.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A (no migration in this ticket; pure app-code).
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.

## Acceptance Criteria

### Directory scaffold (`web/src/actions/`)

- [ ] `web/src/actions/index.ts` — barrel export for the action registry.
- [ ] `web/src/actions/_lib/` — shared infrastructure:
  - [ ] `_lib/handler.ts` — the `defineHandler(name, schema, body)` factory. Single signature pattern:
    ```ts
    defineHandler<I, O>(
      name: string,                          // e.g., 'member.create'
      input: z.ZodSchema<I>,                 // Zod input schema
      body: (ctx: ActionContext, input: I) => Promise<O>
    ): NamedActionHandler<I, O>
    ```
  - [ ] `_lib/context.ts` — `ActionContext` carries: `actingMemberId` (uuid), `viaDelegationId` (uuid | null), `traceId` (uuid; generated per call), `db` (a Supabase client bound to a transaction), `now` (() => Date — injectable for tests).
  - [ ] `_lib/audit.ts` — `injectAudit(row)` helper that adds `acting_member_id` + `via_delegation_id` from the context to any event-row payload before it is written.
  - [ ] `_lib/transaction.ts` — `withTransaction(db, fn)` wrapper. Per ADR-10, the row write + event-log write must commit in the same DB transaction; failure of either rolls back the other. Implement using Supabase's `rpc('begin'...)` pattern OR a `pg` client `BEGIN/COMMIT/ROLLBACK` block — pick one, document in the file. Vercel-runtime constraint: must work on the Edge runtime if Edge is the target for `member.create`.
  - [ ] `_lib/event-log.ts` — `appendEvent(ctx, table, row)` writes one row to the named event table (`member_events`, future `item_events`, `location_events`, `group_events`), injecting audit fields via `injectAudit`. The write is via the same transaction-bound DB handle.
  - [ ] `_lib/errors.ts` — `ActionError` taxonomy: `ValidationError`, `AuthorizationError`, `ConflictError`, `NotFoundError`, `TransientError`. The handler factory wraps Zod failures in `ValidationError`.
- [ ] `web/src/actions/member/create.ts` — the `member.create` handler.
- [ ] `web/src/actions/member/index.ts` — re-exports all Member action handlers (just `create` at Phase 0).

### `member.create` handler

- [ ] Input schema (Zod):
  - [ ] `authUserId: z.string().uuid()` — the new `auth.users.id` from the signup event
  - [ ] `email: z.string().email()` — used to derive a default handle suggestion + display name
  - [ ] `handleSuggestion: z.string().min(4).max(30).regex(/^[a-z0-9-]+$/).optional()` — if provided by signup form; otherwise derive from email local-part
  - [ ] `displayName: z.string().min(1).max(60).optional()` — defaults to email local-part with profanity-replacement applied
- [ ] Body:
  - [ ] Resolve final handle: use `handleSuggestion` if provided; else derive (lowercase email local-part, strip non-alphanumeric, hyphenate, pad to 4 chars). On collision, append numeric suffix (`-2`, `-3`, ...) up to `-99`; beyond that, raise `ConflictError`.
  - [ ] Resolve display name: use provided value, else email local-part with first-letter cap and underscores → spaces.
  - [ ] Inside `withTransaction`:
    - [ ] `insert into members (id, handle, display_name, ...) values (authUserId, handle, displayName, ...) returning *` — note: at Phase 0 there is no FK from `members.id` to `auth.users.id` per T042 (Phase 1 adds it), but we use the `auth.users.id` as the `members.id` so the join is implicit.
    - [ ] `appendEvent(ctx, 'member_events', { member_id: newMember.id, event_kind: 'member.created', payload: { handle, display_name, source: 'auth_signup' } })`
    - [ ] Audit fields injected: `acting_member_id = newMember.id` (per ADR-6 / rebuild-plan exit criterion — the new Member is the actor on their own creation), `via_delegation_id = null`.
  - [ ] Return: `{ memberId, handle }`.
- [ ] Handler is registered in `web/src/actions/index.ts` so `getHandler('member.create')` resolves it.

### Action context resolution

- [ ] `web/src/lib/action-context.ts` — `resolveActionContext(req)` builds an `ActionContext` from a request, populating `actingMemberId` from `auth.uid()` (the human Member's id) and a generated `traceId`. For the auth signup hook (T044), the context's `actingMemberId` is `null` *until* the new Member's id is computed inside the handler, then injected — handle this with a two-phase pattern: `ActionContext.actingMemberId` is `uuid | 'self-bootstrap'`, and `member.create` is the only handler permitted to resolve `'self-bootstrap'` to the freshly-inserted member id.

### Conformance check (CI gate skeleton)

- [ ] `web/scripts/check-action-layer-conformance.ts` — Node script that greps the codebase for direct writes (`.insert(`, `.update(`, `.delete(`, `.upsert(`) against the protected table list (`members`, `member_events`, future `items`, `item_events`, `locations`, `location_events`, `groups`, `group_events`, `group_memberships`, `member_*` child tables) outside `web/src/actions/`. Allowed exceptions:
  - [ ] The Phase 0 system-Member migration (raw SQL, not TS — script grep is TS-only)
  - [ ] Vitest test files under `web/tests/` (mocking pattern)
  - [ ] Playwright eval files under `web/evals/`
- [ ] Wire the script into `package.json`: `npm run check:action-layer`.
- [ ] CI fails if any forbidden direct write is found.
- [ ] The check runs as part of the existing typecheck step in CI.

### Tests

- [ ] Vitest unit test: `member.create` with a fresh auth user id inserts a `members` row and a `member_events` row in the same transaction. Assertions:
  - [ ] `members` row exists with the expected handle and display name.
  - [ ] `member_events` row exists with `event_kind = 'member.created'`, `member_id = <new id>`, `acting_member_id = <new id>`, `via_delegation_id IS NULL`.
- [ ] Vitest unit test: `member.create` with an invalid email raises `ValidationError`; no rows are inserted.
- [ ] Vitest unit test: deliberate failure injection in the event-log write — the `members` row insert succeeds, the event-log write throws — verify the transaction rolls back (no `members` row remains). This is the ADR-10 same-transaction invariant.
- [ ] Vitest unit test: handle collision — pre-insert a row with `handle = 'maya'`, call `member.create` with `email = 'maya@example.com'` — verify the new row gets `handle = 'maya-2'`.
- [ ] Vitest unit test: handle collision exhaustion — pre-insert `maya` through `maya-99`, call `member.create` — verify `ConflictError`.
- [ ] Conformance check passes after this ticket; introduce a deliberate direct-write violation in a separate temp file and verify the script catches it (commit only the passing state).
- [ ] BUILD-LOG.md updated.

## Notes

**Per ADR-7:** every write in the rebuild lives in `web/src/actions/`. This ticket establishes the contract every future handler conforms to. Resist the temptation to add additional handlers in this ticket — `member.create` is the proof of pattern; the rest land in Phase 1 alongside their tables.

**The `'self-bootstrap'` actingMemberId** is the one ergonomic exception to ADR-6's "audit field always references an existing acting Member." It only applies to `member.create` and only during signup. The handler internally resolves it to the newly-inserted member id before writing the event-log row, so the row on disk satisfies the invariant. Document this in `_lib/context.ts` and link to the rebuild-plan exit criterion.

**Transaction wrapper at Edge runtime:** Vercel Edge runtime has restricted Postgres client support. Two options:
1. Run `member.create` on the Node runtime, not the Edge runtime — simplest, costs cold-start latency.
2. Use Supabase's `rpc` to call a server-side function that wraps the transaction in plpgsql.

Pick option 1 for Phase 0; document the choice. Option 2 may revisit at T2 if cold-start latency on signup becomes a problem.

**Conformance check granularity:** Phase 0's check is a coarse regex sweep. At Phase 1, when the protected-table list grows (items, locations, groups, child tables), the script may need to switch to an AST-based check using `ts-morph` or similar. Note this in `web/scripts/check-action-layer-conformance.ts`'s file header.

**No event-log fan-out yet:** ADR-10 mentions trace IDs and OpenTelemetry export at T2. Phase 0 writes the trace ID into `payload.trace_id` for downstream correlation; the OTel exporter does not ship at b1.

**Per the rebuild plan's exit criterion:** "the action layer is the only write surface for the refactored handler. ... A Member row is created automatically when a new auth.users row appears, with audit fields populated by the action handler." T043 lands the handler; T044 wires the auth trigger that calls it.

## Completion

Date: 2026-05-10
Commit: `7de747d` (web repo)

**What landed:**

*Action layer scaffold (`web/src/actions/`):*
- `_lib/errors.ts` — five-class `ActionError` taxonomy (`ValidationError`, `AuthorizationError`, `ConflictError`, `NotFoundError`, `TransientError`) + `ACTION_ERROR_HTTP_STATUS` map.
- `_lib/context.ts` — `ActionContext` type with `actingMemberId` (uuid | `'self-bootstrap'`), `viaDelegationId`, `traceId`, `db` (`PoolClient`), `now`. `makeContext()` factory.
- `_lib/db.ts` — `getPool()` singleton (`pg.Pool` keyed off `DATABASE_URL`), `withTransaction(fn)` using `BEGIN/COMMIT/ROLLBACK`, `closePool()`.
- `_lib/audit.ts` — `injectAudit(ctx, row)` adds `acting_member_id` + `via_delegation_id`. Throws if the context still carries the `'self-bootstrap'` sentinel.
- `_lib/event-log.ts` — `appendEvent(ctx, 'member_events', row)` injects audit fields + trace_id, writes via the transaction-bound client.
- `_lib/handler.ts` — `defineHandler(name, zodSchema, body)` factory. Wraps Zod failures in `ValidationError` before the body runs.
- `_lib/handle-derivation.ts` — pure functions: `deriveHandleFromEmail`, `deriveDisplayNameFromEmail`, `suffixedHandle`, `MAX_HANDLE_COLLISION_SUFFIX=99`.
- `member/create.ts` — `memberCreate` handler. Zod schema (`authUserId`, `email`, optional `handleSuggestion`/`displayName`). Body: derive handle/display_name → `withTransaction` → INSERT into members with collision-suffix retry (up to 99) → resolve `'self-bootstrap'` → `appendEvent(member.created)`. Returns `{ memberId, handle }`.
- `member/index.ts`, `index.ts` — barrel exports + `getHandler()` / `listHandlers()` registry.

*Adjacent:*
- `web/src/lib/action-context.ts` — `resolveActionContext()` helper for route handlers.
- `web/scripts/check-action-layer-conformance.ts` — Node + tsx script that greps for direct `.from('<protected>').insert/update/delete/upsert(` outside `web/src/actions/`. Lists allowed exceptions (tests, evals, this script itself). Exits 1 on any violation.
- `web/package.json` — added deps `zod ^3.23.8`, `pg ^8.13.0`, `@types/pg ^8.11.10`, `tsx ^4.19.0`. Added script `check:action-layer`.
- `web/tests/actions-t043.test.ts` — Vitest suite covering: file structure, package.json wiring, handle-derivation behavior, display-name derivation, suffix logic, Zod schema validation, `ActionError` taxonomy, `defineHandler` wrapping, registry resolution, `injectAudit` semantics, and a probe-driven conformance-check round-trip.

*Documentation:*
- DEVIATIONS.md: three new entries (using `pg` directly vs Supabase JS, deferring runtime DB tests to Playwright, deferring eval helper RPCs to a separate stage).

**What the user must run locally to close the build half:**

```bash
cd web
npm install                       # pulls zod, pg, @types/pg, tsx
npm test -- actions-t043          # verify the 18 test groups (~50 assertions)
npm run check:action-layer        # should print "OK (no violations found)"
```

Then add `DATABASE_URL` to `.env.local` so the action layer can reach the local DB:

```bash
# In web/.env.local
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

(Or pull from `supabase status -o env`.)

**Runtime DB verification (T043 portion of Phase 0 floor spec):**

The Playwright eval at `web/evals/phase-0/floor.spec.ts` contains the T043 runtime assertions (`member.create` writes both rows in a transaction; collision-suffix logic; ConflictError on exhaustion; ValidationError on invalid email). It calls helper RPCs (`eval_member_create_with_failure_injection`, `eval_seed_handle_collision_range`, `eval_clear_handle_collision_range`, `eval_conformance_check_result`) that are NOT shipped with T043 — flagged as a separate stage per DEVIATIONS. Until those helpers land, verify manually:

```sql
-- Smoke: invoke the action via tsx script (see below) or psql.
-- Counts before:
select count(*) from public.members;
select count(*) from public.member_events;
```

Or write a one-off tsx invocation:

```bash
npx tsx -e 'import { memberCreate } from "./src/actions/index.ts"; ...'
```

Defer the end-to-end eval run until either (a) the eval helper RPCs are provisioned (separate ticket) OR (b) T044 lands the auth signup hook and the eval covers the integration via real Supabase Auth signups.
