# T074: Public Shop page at /p/[…place]/g/[slug] (F035 read surface)

**Scenario:** `planning/now/scenario-F035-rosa-finds-mayas-shop.md`
**Status:** Complete
**Bundle:** b1 (sub-bundle b1.2 — Business Groups & makers)
**Depends on:** T070 (groups lifecycle_state + draft-aware RLS), T060 (place-scoped catch-all routing), T055 (groups schema), T056 (items schema)

**Serves:**
- **Loop:** 7 (Buy close) + 8 (Follow what you love) — gives a shared/typed URL one page that answers "is this a real local seller, who's behind it, what do they make" and lets the viewer follow.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services); secondary [C1](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love).
- **Primitive shape:** Person(Rosa) → Group(kind='business') → read public surface → optional Person → follow → Group. No shell entity — founder is a Member FK (`groups.founder_member_id`); Items FK to Members.

## Forward-dependency scope (read before implementing)

Two of the scenario's six story beats depend on substrate that does **not** exist at T074 ship. The scenario's own Assumptions section flags both as deferrable. T074 builds the render path and defers the data/persistence:

- **Beat 2 — "Claimed local owner" badge.** Requires `member_business_jurisdictions` + `public.zip_is_proximal_to_location()` (S-jurisdictions, ships with F037). Neither exists. T074 implements the badge **render path** behind a single resolver; the resolver returns "no jurisdiction" until the substrate lands, so the badge does not render. Only the negative branch of Beat 2 is testable now. **DEVIATIONS: downstream-dep on F037/S-jurisdictions.**
- **Beat 4 — Follow persistence.** `member_follows` is member→member only `(follower_member_id, followed_member_id)`; there is no group-follow substrate. Scenario assigns it to F042. T074 renders the Follow CTA affordance (correct label, logged-in vs anonymous variants) and defers the write. **DEVIATIONS + SPEC-PATCHES: the scenario's `member_follows{target_kind='group'}` shape contradicts the shipped member→member schema; needs a `group_follows` table or polymorphic reshape decision.**

This matches the precedent set by T073 (F036 locality step shipped UI-only; substrate deferred to F037).

## Acceptance Criteria

- [ ] **Routing.** `/p/[...slug]/page.tsx` dispatches on a `g` segment: slug split at `'g'` → place segments before, single group slug after. With a `g` segment, render the Shop page; without, render the existing place page (unchanged). Per T060 DEVIATION, group dispatch folds into the catch-all (Next.js forbids a static segment after a catch-all).
- [ ] **Group resolver.** New `src/lib/groups/resolve-shop.ts` → `resolveShop(supabase, slug)` resolves a kind='business' group by `groups.slug` joined to `group_businesses` + founder Member (`groups.founder_member_id` → members display_name/handle/avatar_url). Returns `null` when RLS yields no row (covers draft-to-non-owner, dissolved, nonexistent). Returns `{ lifecycleState: 'draft' }` distinguishable so the page renders the owner draft preview.
- [ ] **Beat 1 — header.** `<h1 data-testid="shop-name">` = `group_businesses.display_name`. Founder block `data-testid="shop-founder"` links to `/m/{handle}` with display name + avatar. Brand description rendered when `public_description` non-empty; absent gracefully otherwise.
- [ ] **Beat 2 — badge render path.** `resolveLocalOwnerBadge(...)` resolver behind a feature-absent guard; returns no badge until S-jurisdictions ships. When present it renders `data-testid="local-owner-badge"` with the "Claimed local owner" label. No negative-space when absent.
- [ ] **Beat 3 — items empty state.** Query `items` where `group_id` = shop + `kind in ('product','service')` + `state='published'`. None at ship → `data-testid="shop-items-empty"` with heading + body ("… hasn't listed anything yet — check back soon"). Visible-but-empty, not hidden.
- [ ] **Beat 4 — follow CTA.** Logged-in + not following → `<button data-testid="follow-shop">` reading "Follow {display_name}". Persistence deferred (see scope note); tap surfaces a non-destructive "coming soon" affordance.
- [ ] **Beat 5 — anonymous.** Page renders fully for anon (no 401/302). Follow CTA becomes `data-testid="follow-shop-signup"` reading "Sign up to follow", links to `/auth/signup`.
- [ ] **Beat 6 — draft.** Non-owner / anon → `notFound()` (RLS returns no row). Founder viewing own draft → draft preview with `data-testid="shop-draft-banner"` ("Draft — not yet public") + "Resume walkthrough" link to `/you/sell`.
- [ ] **Edge — dissolved** group → `notFound()` to everyone (RLS: `dissolved_at` / lifecycle). **Edge — no anchor Location** → render without badge, no 404.
- [ ] **Tests.** Vitest unit tests for `resolveShop` slug-split + RLS-null handling, badge resolver absent-branch, and `ShopPublicPage` rendering (header, empty state, follow variants, draft banner). At least one per Then-clause that is buildable now.
- [ ] **a11y (M3).** Page + new components pass `design:accessibility-review` at the basic level (heading order, link names, button names, avatar alt).
- [ ] **M2** `engineering:code-review` before commit. **DEVIATIONS.md** entry at close. **SPEC-PATCHES** entry for the group-follow schema gap.
- [ ] BUILD-LOG.md updated.

## Notes

- DLS: use `.btn-primary` / `.btn-secondary` recipes; no hardcoded tokens. CTA placement per `product/ui/design-language.md`.
- Founder is read from `groups.founder_member_id` (spine column), not a `group_memberships role='founder'` lookup — the scenario's Data Captured note predates the shipped schema. Minor deviation, logged.
- URL note: scenario writes `/p/sacramento/oak-park/g/…`; shipped place routing prefixes the state USPS code (`/p/ca/sacramento/oak-park/g/…`) per ADR-22/T060. Build to the shipped routing; the scenario example is illustrative.
- RLS does the visibility work: a returned `draft` row implies the viewer is the founder (`founder_member_id = auth.uid()`), so `lifecycleState === 'draft'` ⟹ render owner preview.

## Completion

Date: 2026-06-02
Commit: `76e4143` on branch `t074` (web repo; not yet merged to main — no migration, so M4 not triggered; merge is PM's call).

**Built:** beats 1/3/5/6 fully; beat 2 badge render-path-only (F037/S-jurisdictions forward-dep); beat 4 follow persistence deferred to F042 (no group-follow substrate). 24 new vitest (98/98 src GREEN). tsc clean on T074 files; action-layer conformance OK. **M2** PROCEED (no criticals). **M3** PASS (basic) after decorative-avatar alt fix. DEVIATIONS (4 deviations) + SPEC-PATCHES (group-follow schema gap) logged.

**Next:** `test` skill — write/run the Playwright F035 eval against live Supabase; greens `:167` in F036's suite.
