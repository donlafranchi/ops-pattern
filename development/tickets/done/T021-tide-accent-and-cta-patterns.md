---
id: how-t021-tide-accent-and-cta-patterns
purpose: Ticket T021 — tide accent and cta patterns.
layer: how
status: reference
---

# T021 — Tide accent + CTA pattern rollout

**Status:** Complete
**Completed:** 2026-04-25T13:54:31-07:00

## Goal
Adopt the new Tide (`#0FAB8E`) accent across the app and ship the Airbnb-modeled CTA placement patterns documented in `product/ui/design-language.md` (§ "CTA placement patterns"). Goal #1 of the product is **member signup** (shoppers and producers); this ticket aligns the visual chrome and conversion surfaces with that goal.

## References
- DLS: `product/ui/design-language.md`
- Current accent (`#1B7A3D` "civic green") replaced everywhere by Tide (`#0FAB8E`)
- `coop` ownership tier color stays at `#0E6B2E` — independent of accent token

## Scope

### 1. Color token swap
Update `web/src/app/globals.css`:
- `--color-accent` → `#0FAB8E`
- `--color-accent-hover` → `#0A8A72`
- Add `--color-accent-tint` → `#E8F7F2`

Sweep these emerald usages (Tailwind classes) and replace with `--color-accent` / token-driven utilities:
- `bg-emerald-600`, `bg-emerald-700`, `text-emerald-700`, `border-emerald-700`, `bg-emerald-50`, `from-emerald-200/100/50`, `text-emerald-800`, `ring-emerald-600`, `border-emerald-200`, `hover:bg-emerald-50/100`
- Files known to use these: `BottomNav.tsx`, `HomeFeed.tsx`, `ExplorePage.tsx`, `you/page.tsx`, `OwnershipBadge.tsx` (verify), `globals.css` `.input` focus ring

Don't touch `--color-ownership-coop` (`#0E6B2E`) — it's separate.

### 2. Two-track persistent nav (TopNavDesktop)
`web/src/components/BottomNav.tsx` → `TopNavDesktop`:
- Left: `Main Street` logo (accent color)
- Center: `Home` / `Explore` / `You` (text links, current pattern)
- Right cluster (logged out):
  - Text link: `List your business →` (links to `/join`)
  - Text link: `Log in`
  - **Filled accent button**: `Sign up` (links to `/auth/signup`)
- Right cluster (logged in):
  - Text link: `List your business →` (only if `!hasVendor`)
  - Avatar / "You" link
- One filled-accent button per screen — `Sign up` is it on logged-out global nav

### 3. Auth-gate modal pattern
Create `web/src/components/AuthGateModal.tsx`:
- Props: `open`, `onClose`, `headline` (e.g. "Sign up to support Acme Farms"), `subtext` (optional), `intent` (`"support" | "follow" | "save"` for telemetry)
- Body: `[Sign up]` (primary, accent), `[Log in]` (secondary), small "Free, takes 30 seconds" microcopy under primary
- Producer footer line: small text `Are you a business owner? List your business →`
- On signup/login success, return user to where they were and re-attempt the gated action (not in scope for this ticket — for now, just route to `/auth/signup?next=<current>`)

Wire it in:
- `SupportButton` — when `!user`, open modal instead of routing
- `FollowButton` — same
- Any "Sign in to support / Sign in to report" link in `BusinessDetailCard` and `BusinessListingPage` — replace with modal trigger

### 4. Recruitment section at bottom of Home + Explore
Repurpose / extend `RecruitmentGrid.tsx`:
- Full-width editorial panel
- Headline: "Own a local business? Get on the map."
- Subhead: "Free listing. No fees. You keep every customer."
- Photo or illustration left, primary CTA right: `[List your business — free →]` → `/join`
- Place at bottom of `HomeFeed` (above `Explore all categories →` button) and bottom of `ExplorePage` empty state

### 5. Sticky mobile primary CTA on profile pages
`web/src/app/business/[slug]/BusinessListingPage.tsx` and `web/src/app/vendors/[slug]/VendorProfilePage.tsx`:
- On mobile only: render a fixed bottom bar above `BottomNav` with the primary action (`Support` / `Follow`)
- If logged out, the sticky bar's primary CTA opens the `AuthGateModal`
- Hide the inline primary CTA on mobile when sticky bar is visible (avoid duplicate)

### 6. Trust microcopy
Add a short friction-remover line directly under each major primary CTA:
- Sign up: "Free, takes 30 seconds."
- List your business: "Free listing. No fees, ever."
- Support: nothing (the action speaks for itself)

## Acceptance criteria
- [ ] Tide accent appears as the only brand-action color across nav, buttons, focus rings, and active filter chips. No `emerald-*` Tailwind classes remain in app code (grep clean).
- [ ] Logged-out desktop top nav shows `List your business →` (text), `Log in` (text), `Sign up` (filled accent) — exactly one filled-accent button.
- [ ] Logged-in desktop top nav shows avatar/You and `List your business →` (only if user has no vendor).
- [ ] Tapping `Support` or `Follow` while logged out opens the `AuthGateModal` (not a route navigation).
- [ ] `AuthGateModal` shows context-specific headline ("Sign up to support [Vendor]") and the producer footer line.
- [ ] Bottom of Home and bottom of Explore (empty state) render the producer recruitment panel.
- [ ] Mobile profile pages have a sticky bottom CTA bar above the BottomNav.
- [ ] No screen has two filled-accent primary buttons visible at once.
- [ ] Build passes (`npm run build`); no test regressions.

## Out of scope
- Resuming the gated action after signup (just route with `?next=`)
- "You" page restructure (separate ticket — see `planning/scenarios-backlog/`)
- Home vs Explore page-role split (separate ticket)
- Touching ownership tier colors or the desaturation treatment

## Notes
This is primarily a presentation-layer ticket. No schema changes. No new evals — existing `data-testid`s on `SupportButton`, `FollowButton`, `signup-link`, etc. should remain intact and passing.

## Completion

Date: 2026-04-25
Status: Complete

**Delivered:**
- Tide accent tokens in `globals.css` (`--color-accent`, `--color-accent-hover`, `--color-accent-tint`); swept all `emerald-*` classes (17 files).
- `AuthCtaButtons.tsx` rebuilt: logged-out shows `List your business →` text + `Log in` text + `Sign up` filled accent; logged-in shows `List your business →` only when user has no vendor (Supabase check). Compact variant for mobile header.
- New `AuthGateModal.tsx` — intent-tagged (`support` / `follow` / `save` / `generic`), preserves return path via `?next=`, producer footer line links to `/join`.
- `FollowButton`, `BusinessDetailCard`, `BusinessListingPage` switched to `AuthGateModal` for logged-out gating.
- Mobile sticky CTA bars on `BusinessListingPage` and `VendorProfilePage` positioned above BottomNav (`bottom: calc(64px + env(safe-area-inset-bottom))`); inline desktop CTAs hidden on mobile to avoid duplication.
- `RecruitmentGrid` rendered at bottom of `HomeFeed` (also retained on Explore empty state).
- Trust microcopy "Free, takes 30 seconds." in `AuthGateModal`; "No fees, ever." in signup banner.

**Verification:**
- `npm run build` ✅
- `npm run test` ✅ 51/51 passing
- `grep -r "emerald-" web/src` ✅ zero matches
