# T003: Authentication (Sign Up, Login, Sign Out)

**Scenario:** planning/scenarios/F003-registration-auth.md
**Status:** Open

## Acceptance Criteria

- [ ] Sign-up page at `/auth/signup` with email + password form
- [ ] Login page at `/auth/login` with email + password form
- [ ] Account creation via Supabase Auth on sign-up
- [ ] Session persists across page reloads
- [ ] After sign-up, user is redirected to `/register` (business registration)
- [ ] After login, user is redirected to `/` (map)
- [ ] Sign-out button clears session and returns to map in unauthenticated state
- [ ] Invalid email format shows form validation error
- [ ] Password minimum 8 characters with clear error message
- [ ] Email already registered shows error with link to login
- [ ] Auth context/hook (`useAuth`) available app-wide: `user`, `signUp`, `signIn`, `signOut`, `loading`
- [ ] Unauthenticated users can browse map and listings freely
- [ ] Tests passing
- [ ] BUILD-LOG.md updated

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

Date:
Commit:
