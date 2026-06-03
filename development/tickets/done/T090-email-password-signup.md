---
id: how-t090-email-password-signup
purpose: Email-first signup/login page with returning-user detection — new users set a password, returning users enter one; magic-link secondary.
layer: how
status: done
---

# T090 — Email/password signup with returning-user detection

**Scenario:** [F030 — A newcomer signs up and lands in the feed](../../planning/now/scenario-F030-newcomer-signs-up-and-lands-in-feed.md)
**Binds to:** `product/systems/member.md` · Supabase Auth · CLAUDE.md § action-layer CI rules
**Status:** Done
**Bundle:** b1 (b1.4 — Newcomer entry)
**Depends on:** T089 (onboarding `next=/onboarding`) · T044 (signup hook → member.create)
**Repo / branch:** web / `t-f030`

## Auth-method decision (PM-directed, supersedes the T089 magic-link-primary call)

Email/password is now the **primary** b1 auth method, surfaced through a single email-first page. Magic-link is the **secondary** option below the password field. Email confirmation: Supabase default for production (confirm before full access); local dev auto-confirms (`config.toml` `enable_confirmations=false`).

## Serves

- F030 AC2 "Signup → … onboarding flow" — the signup entry point that lands a new Member in `/onboarding`.

## Acceptance Criteria

### Returning-user detection — `028_email_is_registered.sql` + `useAuth.checkEmailRegistered`

- [x] `public.email_is_registered(p_email)` — SECURITY DEFINER, reads `auth.users` (members has no email column), case-insensitive, granted anon+authenticated.
- [x] `useAuth().checkEmailRegistered(email)` calls the RPC.

### Email-first page — `src/components/auth/EmailFirstSignup.tsx` + `src/app/auth/signup/page.tsx`

- [x] Single email step → on Continue, classify: unknown → "Set a password" (`signUp`); registered → "Enter password" (`signInWithPassword`).
- [x] Magic-link is a secondary button on both password phases (`signInWithOtp`).
- [x] `signUp` with a live session → redirect to `next` (default `/onboarding`); no session (prod confirmation) → "confirm your email" state.
- [x] `signUp` "already registered" race → fall back to the enter-password phase.
- [x] Testids: `email-input`, `password-input`, `submit-button`, `set-password-heading`, `enter-password-heading`, `magic-link-secondary`, `signup-form`, `auth-error`.

### Tests

- [x] `src/components/auth/EmailFirstSignup.test.tsx` — 9 cases (phases, detection, signUp/signIn, weak-password, confirm-email, race, magic-link, error).
- [x] F030 eval AC2/AC3 rewritten to drive the real email/password signup (new user) + returning-user detection (NADIA); helpers `signUpWithPassword` / `signInViaEmailFirst`.
- [x] `evals/features/F003-registration-auth.spec.ts` rewritten from the stale pre-rebuild surface to the email-first flow.

## Completion

Date: 2026-06-02
Commit: `c421679` (branch `t-f030`, web repo; unmerged)
Status: Build complete. 9/9 T090 vitest + 198/198 src GREEN; tsc/eslint/conformance clean.
Notes: Email-first page replaces the old AuthMethods-based signup (login page still uses AuthMethods). RPC enumeration tradeoff documented (DEVIATIONS). Evals authored; live run is the downstream `test` step. M2 self-review PROCEED.
