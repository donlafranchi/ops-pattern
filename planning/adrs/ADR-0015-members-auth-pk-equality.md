# ADR-0015: `public.members.id = auth.users.id`; Supabase Auth is the only path to Member creation

**Status:** Accepted
**Date:** 2026-05-11
**Deciders:** PM
**Scope:** Every `public.members` row's identity; the only sanctioned write path to `members`; the auth coupling that every RLS policy reads from
**Touches:** `product/systems/member.md` (Identity section + Integration Points), every RLS policy in the schema (via `auth.uid()` directly), `web/supabase/migrations/` (Phase 0 floor + the `on_auth_user_created` trigger), `web/src/app/api/internal/auth-signup/route.ts` (internal route the trigger POSTs to), `product/systems/action-layer.md` (ADR-7 — the trigger invokes the `member.create` action handler), T042, T043, T044 (the Phase 0 floor tickets that implemented this)

## Decision

Every `public.members` row has `id = auth.users.id` — PK equality, 1:1, lifetime-stable. There is no separate `auth_user_id` foreign key on `members`; the PK *is* the auth coupling. RLS policies across the schema reference `auth.uid()` directly and resolve owner-of-row by equality against `members.id`.

The **only** path to a `public.members` row is the post-signup trigger on `auth.users`. The trigger (`on_auth_user_created`, AFTER INSERT) fires a `SECURITY DEFINER` function (`handle_new_auth_user`) that POSTs an HMAC-SHA256-signed payload to an internal Next.js route (`/api/internal/auth-signup`); the route validates the signature, resolves an `ActionContext` with `actingMemberId = 'self-bootstrap'`, and invokes the `member.create` action handler. The action handler is the same canonical write path the rest of the platform uses (per ADR-7). No code path other than the trigger creates Member rows — there is no admin "create user" surface, no seed script that inserts directly into `members`, no Supabase Dashboard write.

The system Member (the platform's actor for ADR-7 audit fields) is an exception: it is inserted directly during the floor migration and carries `login_disabled = true` so the trigger's defensive skip recognizes it as not-a-real-human.

Idempotency is enforced by the `members.id` unique constraint (which is the PK). A retried trigger call resolves to `ConflictError → HTTP 409` and is logged, not retried at the action layer.

## Consequences

- `member.md` Identity section encodes "One Member per real human" as PK equality; the Integration Points line "**Auth** — `members.id = auth.users.id`; Supabase Auth is the identity floor" is the load-bearing surface. The ADR-15 reference belongs in `member.md`'s "Decisions encoded" header (added 2026-05-11).
- Every RLS policy in the schema written against `auth.uid()` is correct without an extra lookup: `auth.uid() = members.id` and `auth.uid() = owner_member_id` resolve directly. The schema does not need a `select id from members where auth_user_id = auth.uid()` subquery anywhere — earlier tickets that used that pattern (T028, T029, T030, T033, T034) are stale and superseded by the PK-equality pattern landed in T042+.
- Member creation is asynchronous from the auth event. `pg_net.http_post` is async; the Next.js route returns 200 long after the auth signup commits. Failure modes:
  - **Hook unreachable.** No `members` row gets created. Mitigated by (a) a nightly reconciliation sweep deferred to Phase 1 (per `planning/rebuild-plan.md`); (b) an ops alert when `auth.users` count diverges from `members` count by >1% or >10 rows.
  - **Signature invalid.** HTTP 401, no row, no retry. The trigger swallows the failure; the reconciliation sweep is the recovery path.
  - **Action handler error.** `ConflictError → 409` (idempotent retry observed; no-op), `ValidationError → 400` (logged; no row), `UnknownError → 500` (logged; the reconciliation sweep picks it up).
- The trigger is read-coupled to Supabase Vault secrets (`auth_signup_hook_url`, `auth_signup_hook_secret`). The `postgres` role cannot `ALTER DATABASE ... SET app.*` on Supabase-hosted projects — Vault is the documented Supabase pattern. Quarterly secret rotation per ADR-9; the rotation runbook lives in `notes/`.
- The PK-equality choice forecloses a Supabase-replacement path that uses a non-Supabase auth provider. If the platform ever migrates off Supabase Auth (e.g., to a self-hosted Postgres + custom auth), `members.id` becomes the system-of-record and a new `auth_provider_id` column carries the foreign identity. The migration is non-trivial but bounded — every `auth.uid()` reference becomes a session-derived `members.id`. Reversible with cost; the foreclosure is acceptable for b1.
- The PK-equality also makes the schema **federation-portable** at b3 (per Loop 13). A spawned platform with its own Supabase project can mirror a Member by mirroring the PK; the audit-field chain (acting_member_id, via_delegation_id) stays coherent across boundaries.
- `T044` (the build-side ratification) is `done`. T042 + T043 + T044 together are the Phase 0 floor for this ADR. No further ticket is required to ratify; this ADR documents the decision that those tickets implemented.

## Action Items

1. [x] Decision ratified 2026-05-11.
2. [x] T042 + T043 + T044 implement.
3. [x] Pointer line in `../DECISIONS.md` pointer index.
4. [x] `member.md` Decisions-encoded header references ADR-15.
