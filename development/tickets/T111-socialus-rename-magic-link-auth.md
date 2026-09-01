# T111: SocialUs rename + magic-link-only auth

**Scenario:** substrate — PM-directed. No approved scenario; the rename and the auth
collapse were both directed live on 2026-08-31. Written retroactively against the work
as shipped.
**Status:** Complete
**Bundle:** b1
**Binds to:** [`PROJECT.md`](../../PROJECT.md) (canonical name) and
[`product/systems/member.md`](../../product/systems/member.md) — Member is the anchor
primitive and the auth surface is its front door.
**Depends on:** T110 (the `socialus-db` project this now authenticates against).

**Serves:**
- **Loop:** entry to all 13 — a Member cannot reach any loop without signing in.
- **Standard:** [`standards/`](../../standards/) — accessibility (new surface),
  security (auth method surface reduction).
- **Primitive shape:** no new entity. Member acquisition path only.

## Problem

Three separate things, all surfaced in one session.

1. **Stale brand.** Every metadata title read "Movers, Makers & Shakers" and the nav
   wordmark read "Main Street". The canonical name is **SocialUs**. `PROJECT.md` still
   said "the Project" and had never been updated.

2. **Four-door auth.** `/auth/signup` and `/auth/login` were separate pages offering
   Google OAuth, email+password, and magic link, plus a returning-user email-detection
   step via the `email_is_registered` RPC. Supabase's `signInWithOtp` defaults
   `shouldCreateUser: true` — an unknown email gets an account, a known one gets a
   session — so the separate signup page was never load-bearing. PM directive: one door,
   no other options, until the flow is nailed down.

3. **Every accent-colored control rendered invisible.** Tailwind v4 dropped the v3
   bare-variable arbitrary syntax `bg-[--color-accent]`, which the codebase used in 185
   places. It resolves to `transparent`, so white-on-accent buttons were white-on-white.
   A second, independent instance of the same class of bug: v4 also silently drops
   arbitrary-value color utilities inside `@apply`, which left `.btn-primary`,
   `.btn-secondary`, `.chip`, `.chip-selected`, and `.input` with no `background-color`
   at all — the design-system recipes themselves.

## Fix

1. `Movers, Makers & Shakers` → `SocialUs` across all metadata titles and prose;
   `Main Street` wordmark → `SocialUs`. `PROJECT.md` records the canonical name and the
   Supabase project ref.
2. `/auth/login` is the single door: one email field, one button, backed by a new
   `MagicLinkForm` component. `/auth/signup` becomes a redirect so existing inbound links
   keep working. `AuthMethods.tsx` deleted. Every dual "Log in / Sign up" CTA pair across
   nav, gate modal, `/you`, `/following`, and the home banner collapses to one "Sign in".
3. `bg-[--color-x]` → `bg-[var(--color-x)]` across 185 call sites. The six component
   recipes in `globals.css` are rewritten so token colors are **plain CSS declarations**,
   not `@apply` — `@apply` is kept only for layout and spacing.
4. `/auth/callback` handles `error_description`, `token_hash` (for non-PKCE links), and a
   missing-token case, each redirecting to `/auth/login?error=` rather than silently
   succeeding.

**`/auth/password` is deliberately retained and deliberately unlinked.** The Playwright
evals establish sessions by driving the UI with a password, and cannot read an inbox. The
public flow has no password affordance and nothing links to this route. See Deviations —
this is the one compromise against "no other options."

## Files

- `web/src/components/auth/MagicLinkForm.tsx` (new)
- `web/src/app/auth/login/page.tsx`, `signup/page.tsx`, `password/page.tsx` (new), `callback/route.ts`
- `web/src/components/AuthMethods.tsx` (deleted)
- `web/src/components/AuthCtaButtons.tsx`, `AuthGateModal.tsx`, `BottomNav.tsx`, `feed/MakeThisYoursBanner.tsx`
- `web/src/app/globals.css` (component recipes)
- `web/src/hooks/useAuth.ts` (`shouldCreateUser` made explicit)
- `web/evals/helpers/auth.ts` + F030 / F035 specs (repointed at `/auth/password`)
- ~30 further files for the rename and the Tailwind syntax fix
- `PROJECT.md` (parent repo)

## Workflow gates (mandatory during rebuild phase)

- [ ] **M2 — `engineering:code-review`** — **NOT RUN.** Pushed at PM direction ahead of
      the gate. Outstanding.
- [ ] **M3 — `design:accessibility-review`** — **NOT RUN.** Required: this ticket
      introduces a new component (`MagicLinkForm`) and a new page (`/auth/password`).
      Outstanding.
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration, no schema change.
- [x] **DEVIATIONS entry** — `development/deviations/T111.md` (5 deviations).

## Acceptance Criteria

- [x] No occurrence of "Movers", "Makers & Shakers", or "Main Street" as a brand string
      anywhere in `web/src`.
- [x] `/auth/login` renders exactly one input and one button. No OAuth, no password field.
- [x] `/auth/signup?next=/x` redirects to `/auth/login?next=/x`, preserving only
      same-origin `next` values.
- [x] A magic-link request for an unregistered email creates the `auth.users` row —
      verified live: `mrlafranchi@gmail.com` created at 2026-08-31 23:42:33Z with
      `email_confirmed_at` null, from a first-time OTP request with no prior signup.
- [x] `.btn-primary` computes a non-transparent `background-color` in the browser
      (checked against the live stylesheet, not just the source).
- [x] All 346 component unit tests pass.
- [ ] Full Playwright eval suite re-run against the repointed `/auth/password` helper —
      **not run.** The helpers are rewritten but unexercised.

## Completion

Shipped 2026-08-31 on branch `t110`. Sign-in verified end-to-end up to the click: the
form submits, Supabase accepts the OTP request, and the account is created. The emailed
link itself was not opened.

**Known constraint, not a defect.** The browser client uses PKCE, so the code verifier
lives in the browser that requested the link. A link requested on desktop and opened on a
phone will fail the exchange. The documented remedy is switching the Supabase email
template from `{{ .ConfirmationURL }}` to a `{{ .TokenHash }}` link — the callback already
handles `token_hash`, so it is a dashboard-only change. Deferred to PM.

**Rate limit.** The built-in Supabase sender is capped near 2 emails/hour. `RESEND_API_KEY`
is already in the environment; custom SMTP is unwired. Will bite during any repeated
sign-in testing.
