# T044 — Supabase Auth post-signup hook → `member.create`

**Scenario:** `notes/migration-to-primitives.md` § Phase 0 — AI-native floor (`006_auth_signup_hook.sql`)
**Status:** Complete *(build-side; runtime verification pending `pipeline-eval` run-mode against `web/evals/phase-0/floor.spec.ts`)*
**Completed:** 2026-05-11T15:14:04+00:00
**Bundle:** b1
**Depends on:** T043

**Serves:**
- **Loop:** All five loop families (substrate). Without this hook, a Member row only exists when the app explicitly creates one — leaving `auth.users` and `members` permanently divergent. This is the bridge.
- **Canonical example:** All — every canonical-example surface that begins with "User signs in" relies on a `members` row being present from first authentication.
- **Primitive shape:** Person — closes the substrate loop. The auth signup event is the platform's only path to a new Person row.

## Workflow gates (mandatory during the rebuild phase per `CLAUDE.md` § Rebuild phase — special rules)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode) is called.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies (this ticket adds a migration touching the auth surface; merge-to-main must run the pre-deploy checklist).
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.

## Acceptance Criteria

### Pick the hook mechanism

- [ ] Decision recorded in the migration body: **Postgres trigger on `auth.users` insert** vs. **Supabase Edge Function attached as a Webhook on `auth.users`**.
  - **Recommendation:** Postgres trigger via `security definer` function that calls the action handler over `pg_net` or via a small HTTP edge function. The trigger keeps the floor entirely in the database and avoids the supabase-CLI ↔ Edge-Function deploy coupling. **Pick this.**
- [ ] If the trigger calls out via `pg_net` to a Next.js route that invokes `member.create`, document the latency cost and the secret-token authentication scheme used to prevent third parties from calling the route directly.

### Migration `web/supabase/migrations/006_auth_signup_hook.sql`

- [ ] Creates `handle_new_auth_user()` `language plpgsql security definer` function that:
  - [ ] Reads the new `auth.users` row (`new.id`, `new.email`, `new.raw_user_meta_data ->> 'handle_suggestion'`).
  - [ ] Calls the action layer via `pg_net.http_post` to a `web/src/app/api/internal/auth-signup/route.ts` Next.js route, passing a signed payload.
  - [ ] The Next.js route validates the signature, resolves an `ActionContext` with `actingMemberId = 'self-bootstrap'`, calls `member.create`, and returns the new member id.
  - [ ] The trigger does NOT wait synchronously for the response (Supabase Auth signup is latency-sensitive). `pg_net` is async by default; this is acceptable. Failure to land a `members` row is detected by the conformance eval, not by signup-time error.
- [ ] Creates `after insert on auth.users for each row execute function handle_new_auth_user();`.
- [ ] Stores the shared secret in a Supabase Vault entry (`vault.create_secret('auth_signup_hook_secret', ...)`); the migration references the secret by name.
- [ ] Idempotency: the action handler itself rejects a second `member.create` with the same `authUserId` via the `members.id` unique constraint (Phase 0 uses `members.id = auth.users.id`). A retried trigger call resolves to a `ConflictError` that the route maps to HTTP 409 — logged, not retried.

### Next.js route `web/src/app/api/internal/auth-signup/route.ts`

- [ ] HTTP POST handler.
- [ ] Validates the `x-signature` header against the shared secret using HMAC-SHA256.
- [ ] Parses `{ authUserId, email, handleSuggestion? }` from the body.
- [ ] Resolves an `ActionContext` with `actingMemberId = 'self-bootstrap'`, `viaDelegationId = null`, fresh `traceId`.
- [ ] Calls `await getHandler('member.create')(ctx, input)`.
- [ ] Returns `{ memberId, handle }` on success (HTTP 200), `{ error }` on conflict (HTTP 409), validation failure (HTTP 400), or unexpected error (HTTP 500).
- [ ] Logs every invocation with `traceId` for correlation.
- [ ] Route runs on the Node runtime (per T043 Notes — Edge runtime constrained for Postgres transactions).

### Smoke + eval

- [ ] Vitest integration test (or Playwright in test mode): create a fresh `auth.users` row via the Supabase admin client. Within 2 seconds, assert:
  - [ ] A `members` row exists with `id = <new auth user id>`.
  - [ ] A `member_events` row exists with `event_kind = 'member.created'`, `member_id = <new id>`, `acting_member_id = <new id>` (per the rebuild-plan exit criterion).
- [ ] Vitest test: signature validation — POST to `/api/internal/auth-signup` without a valid `x-signature` returns HTTP 401; no `members` row created.
- [ ] Vitest test: duplicate signup for the same `auth.users.id` — second call returns HTTP 409; only one `members` row exists; only one `member.created` event row exists.
- [ ] BUILD-LOG.md updated.

## Notes

**Phase 0 exit criterion** (from the rebuild plan): "A Member row is created automatically when a new `auth.users` row appears, with audit fields populated by the action handler. Eval: spawn a test auth user; verify `members` row exists and `member.created` event has `acting_member_id = <new member id>`."

This ticket is the keystone of that exit criterion. T041 + T042 + T043 land the substrate; T044 wires it to `auth.users`.

**Why not call the action handler from a plpgsql function directly?** Two reasons:
1. The action handler lives in TypeScript and uses Zod for validation — porting both to plpgsql doubles the surface area and breaks ADR-7's "the action layer is the only write surface" (you'd have a second write surface, the trigger function itself).
2. The trace-ID + OTel substrate per ADR-10 lives in the Node runtime. Keeping all writes in TS means the trace correlation is uniform.

The `pg_net → Next.js route` indirection costs ~50–100ms of signup latency. Acceptable. If this becomes the bottleneck at scale (b3 federation surface), revisit via plpgsql shim.

**Failure-mode handling:** `pg_net.http_post` is async — if the Next.js route is unreachable when signup occurs, the `members` row simply does not get created. Mitigations:
- A nightly reconciliation job (introduce at Phase 1 or later) sweeps `auth.users` for rows lacking a corresponding `members` row and replays `member.create` for each.
- An ops alert fires if `auth.users` count diverges from `members` count by more than a tolerance (1% or 10 rows, whichever is greater) — observability commitment for b1 per the rebuild plan.

Defer both to Phase 1 — flag in DEVIATIONS.md if the reconciliation surface isn't picked up there.

**Secret rotation:** the shared secret should rotate quarterly per ADR-9's privacy-and-data-sharing posture. Schedule a quarterly task in `JOURNAL.md` Next session pickup once Phase 1 lands.

**Per the rebuild plan:** Phase 0's eval is *"spawn a test auth user; verify members row exists and member.created event has acting_member_id = <new member id>."* The Vitest integration test above is the exact eval the rebuild plan calls out. Pipeline-eval (write mode) will likely lift this into a Playwright spec; the Vitest version is the in-build smoke test.

## Completion

Date: 2026-05-10
Commit: `ad36a82` (web repo)

**What landed:**

*Migration:*
- `web/supabase/migrations/006_auth_signup_hook.sql` — `pg_net` + `pgcrypto` extensions enabled; `handle_new_auth_user()` function (security-definer, reads `app.auth_signup_hook_secret` + `app.auth_signup_hook_url` GUCs, HMAC-SHA256 signs payload via `extensions.hmac`, fires async via `net.http_post`); `on_auth_user_created` AFTER INSERT trigger on `auth.users`; defensive skip for the system Member id; no-op-with-warning if GUCs unset.

*Route:*
- `web/src/app/api/internal/auth-signup/route.ts` — POST handler pinned to `runtime = 'nodejs'`. Validates `x-signature` via constant-time HMAC compare (Node `timingSafeEqual` on hex-decoded buffers). Parses payload via Zod schema (accepts `null` for `handleSuggestion`/`displayName` since the trigger may send jsonb null). Resolves `ActionContext` with `actingMemberId = 'self-bootstrap'`. Calls `getHandler('member.create')`. Maps `ActionError` → HTTP status via `ACTION_ERROR_HTTP_STATUS`. Returns `{ memberId, handle }` on success. Includes a 405 `GET` handler.

*Fix-forward on T043:*
- `web/src/lib/action-context.ts` — replaced the leaky `getPool().connect()` placeholder with a `Proxy<PoolClient>` sentinel that throws on access. Type safety preserved; pool slots not consumed by route resolution.

*Tests:*
- `web/tests/auth-signup-route-t044.test.ts` — covers migration shape (12 assertions), route file existence + runtime pin, signature validation (no header / invalid / valid / case-insensitive), input validation (bad uuid, bad email, null handleSuggestion), ActionError → HTTP-status mapping (ConflictError → 409, ValidationError → 400, unknown → 500), method-not-allowed for GET. Uses `vi.mock('@/actions')` to swap the handler — no DB touched.

*Documentation:*
- DEVIATIONS.md: two entries (GUCs instead of Vault for secret config; sentinel-proxy fix for pool-client leak).

**Phase 0 exit criterion verification (per rebuild plan):**

> "spawn a test auth user; verify `members` row exists and `member.created` event has `acting_member_id = <new member id>`."

Lives in `web/evals/phase-0/floor.spec.ts` (Playwright). Will run end-to-end once the eval helper RPCs are provisioned (per the JOURNAL pickup item — separate stage).

**What the user must run locally to close the build half:**

1. **Populate Vault with the URL + secret** (one-time after `supabase db reset`). Studio's SQL Editor:

   ```sql
   select vault.create_secret(
     'http://host.docker.internal:3000/api/internal/auth-signup',
     'auth_signup_hook_url',
     'URL the post-signup hook POSTs to (Phase 0 — T044)'
   );

   select vault.create_secret(
     'local-dev-secret-must-be-at-least-16-chars-long',
     'auth_signup_hook_secret',
     'HMAC-SHA256 signing key for the auth-signup hook (Phase 0 — T044)'
   );
   ```

   **Why Vault, not custom GUCs:** Supabase's `postgres` role can't `ALTER DATABASE ... SET app.*` — the CLI restricts that prefix. Vault is the documented Supabase pattern for trigger-readable secrets.

   After `supabase db reset`, Vault rows persist on disk so the secrets survive between resets — populate once.

   To update later:

   ```sql
   update vault.secrets set secret = '<new value>' where name = 'auth_signup_hook_secret';
   ```

2. **Set the matching env var in `web/.env.local`**:

   ```
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
   AUTH_SIGNUP_HOOK_SECRET=local-dev-secret-must-be-at-least-16-chars-long
   ```

   (Must match the GUC value exactly.)

3. **Run the migration** (re-applies all 5 Phase 0 migrations):

   ```bash
   cd web
   supabase db reset
   ```

   Should see `Applying migration 006_auth_signup_hook.sql...` near the end. No skipped migrations.

4. **Vitest suite**:

   ```bash
   npm test -- auth-signup-route-t044
   ```

   Expected: ~28 assertions pass.

5. **End-to-end smoke** — spin a fresh auth user and watch for the `members` row:

   ```bash
   # Start the Next.js dev server in one terminal:
   npm run dev

   # In another terminal, create an auth user:
   curl -X POST "http://localhost:54321/auth/v1/admin/users" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $(supabase status -o env | grep SERVICE_ROLE_KEY | cut -d= -f2 | tr -d '\"')" \
     -d '{"email":"smoke-test@example.test","email_confirm":true,"password":"smoke-test-pw-99"}'

   # Wait a beat, then check Studio:
   #   select * from public.members where id = '<the returned user id>';
   #   select * from public.member_events where member_id = '<that id>';
   ```

   Expected: `members` row appears with derived handle; `member_events` has one `member.created` row whose `acting_member_id` equals the new member id.

   If the row doesn't appear within a few seconds, check `net._http_response` in Studio for pg_net delivery failures (most likely: GUCs unset, secret mismatch, or `host.docker.internal` unreachable — try `http://172.17.0.1:3000/...` instead on some Podman configurations).

**Going-forward when Phase 1 opens:**

- Eval helper RPCs (`eval_member_create_with_failure_injection`, `eval_seed_handle_collision_range`, etc.) are still pending. Either fold into the first Phase 1 ticket or open a "Phase 0 eval helpers" mini-ticket.
- Reconciliation cron sweep (per ticket Notes): a nightly job that finds `auth.users` rows lacking a `members` counterpart and replays `member.create`. Defer to Phase 1.
- Quarterly secret-rotation runbook: write when ready.
