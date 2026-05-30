---
id: how-t003-auth
purpose: Ticket T003 — auth.
layer: how
status: reference
---

# T003: Authentication (Sign Up, Login, Sign Out)

**Scenario:** planning/scenarios/F003-registration-auth.md
**Status:** Complete
**Completed:** 2026-04-09T16:45:56-07:00

## Acceptance Criteria

- [x] Sign-up page at `/auth/signup` with email + password form
- [x] Login page at `/auth/login` with email + password form
- [x] Account creation via Supabase Auth on sign-up
- [x] Session persists across page reloads
- [x] After sign-up, user is redirected to `/register` (business registration)
- [x] After login, user is redirected to `/` (map)
- [x] Sign-out button clears session and returns to map in unauthenticated state
- [x] Invalid email format shows form validation error
- [x] Password minimum 8 characters with clear error message
- [x] Email already registered shows error with link to login
- [x] Auth context/hook (`useAuth`) available app-wide: `user`, `signUp`, `signIn`, `signOut`, `loading`
- [x] Unauthenticated users can browse map and listings freely
- [x] Tests passing
- [x] BUILD-LOG.md updated

## Notes

Use `@supabase/ssr` for Next.js App Router auth. Create:
- `src/app/auth/signup/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/hooks/useAuth.ts` — wraps Supabase auth state
- `src/components/AuthGuard.tsx` — optional wrapper for protected routes
- Middleware in `src/middleware.ts` for session refresh

No email verification for MVP. No OAuth. No password reset. These are all b2.

Auth is a gate to write actions (support, report, register) — not to read. Map and listings are fully public.

## Completion

Date: 2026-04-09
Commit: ec311df
