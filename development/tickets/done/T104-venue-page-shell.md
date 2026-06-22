# T104: Venue page shell — route, header, CTAs, About, auth gating

**Scenario:** `planning/next/scenario-F033-viewer-finds-venue-page.md`
**Status:** Open
**Bundle:** b1
**Depends on:** none (T102 shipped `FollowVenueButton` + actions; place-path resolver shipped with T060)

**Serves:**
- **Loop:** 3 (Land here) — "what's happening within walking distance this week, that they could just show up to." The venue page is the venue-scoped version of this surface; the shell makes it reachable and readable before login.
- **Canonical example:** [O2 — A venue's recurring program becomes findable alongside everything nearby](../../product/needs/use-cases.md#o2-a-venues-recurring-program-becomes-findable-alongside-everything-nearby) — Drake's venue page as the public face of the place.
- **Primitive shape:** Person (viewer) → Location (read) × Group (owning business, resolved via `anchor_location_id`). No shell entity.

## Workflow gates

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit. Verdict: Approve (1 perf finding applied — gate the distance/follow reads on `loggedIn`).
- [x] **M3 — `design:accessibility-review`** — new page with multiple interactive elements. WCAG 2.1 AA PASS (1 minor fixed — guard the empty address `<p>`; no critical/major).
- [ ] **M4 — `engineering:deploy-checklist`** if merging to main with this ticket. **Required before merge** — includes a new migration (`032_venue_distance.sql`) to apply.
- [x] **DEVIATIONS.md entry** appended at ticket close → [`development/deviations/T104.md`](../deviations/T104.md) (6 deviations + 1 decision note).

## Acceptance Criteria

### Pre-step: DLS update (doc-only, mandatory pre-condition from review-F033)

- [ ] Update `product/ui/design-language.md` § Venue page (`/l/[slug]`):
  - Primary CTA changed from "Host something here" to **"Follow this venue"** (`Button — primary`).
  - Secondary CTA: **"Host something here"** (`Button — secondary`).
  - Section 1 renamed/rewritten: **"What's happening here"** — scoped to venue-hosted Items (where `items.group_id` matches the owning kind='business' Group AND `item_locations.location_id` = this Location). Replaces the current "gatherings ≤ 30 days" description.
  - Section 2 added: **"What's happening nearby"** — expandable secondary section, public Items by proximity excluding the venue's owning Group.
  - Section 3: **About** — unchanged.
  - Remove "Items here" as a separate section (subsumed by "What's happening here").
  - Add the "no anchored business Group → minimal page" variant.
  - Remove the empty-state copy "Be the first." (replaced by "Nothing scheduled yet." — no call-to-action pushing the viewer to host).
  _Why: review-F033 mandates DLS update before build. The CTA hierarchy reversal (Follow primary, Host secondary) reflects the scenario's people-first reasoning: most venue-page visitors consume, not create._

### Route

- [ ] Create `web/src/app/p/[...place]/l/[slug]/page.tsx`.
  _Why: parallel to the existing `/p/[...place]/g/[slug]/page.tsx` (Group page, T074). The `[...place]` catch-all resolves the Place hierarchy; `/l/[slug]` resolves the Location within that Place. Same resolver pattern — no new routing infrastructure._

### Data fetching

- [ ] Fetch the Location by resolving the place path + slug: `locations` WHERE `place_id` = resolved Place AND `slug` = param AND `deleted_at IS NULL`.
- [ ] If Location `discoverability = 'private'`, return 404 (Next.js `notFound()`).
  _Why: private Locations are invisible to non-owners. The venue page is a public discovery surface; gating at the page level prevents data leakage._
- [ ] If Location is soft-deleted (`deleted_at IS NOT NULL`), return 404.
- [ ] Resolve the owning Group: `SELECT * FROM groups WHERE anchor_location_id = location.id AND kind = 'business' AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1`.
  _Why: `ORDER BY created_at ASC LIMIT 1` gives deterministic resolution when multiple business Groups anchor at the same Location. Edge case acknowledged in the scenario; b2 revisits if collisions occur._
- [ ] For auth'd Members, fetch distance: `member_place_interests` WHERE `member_id` = current user AND `scope_kind = 'primary_home'` → join `places` for `centroid` → `ST_Distance(places.centroid, locations.geography)`.
- [ ] For anon visitors, distance is omitted (no IP-geolocation at b1).

### Header

- [ ] Hero image: render if `locations` has an associated image (from Location creation). 16:9 desktop / 4:3 mobile, `--radius-md` corners. If no image, hero space collapses entirely — no empty container, no ARIA role on absent element.
  _Why: DLS § photography principle. Empty image containers create a11y noise and visual dead space._
- [ ] Venue name: 26px / 700 type slot.
- [ ] Address: 14px / 400 muted. From `location_permanent.street_address` (for kind='permanent') or Location description fallback.
- [ ] Distance line: same row as address, separated by `·`. Text-based, in normal document flow. Omitted for anon visitors and for auth'd Members with no `primary_home` Place interest.
- [ ] Hairline below address row (`--color-border`, 1px).
- [ ] Hero image `alt` text: venue name (e.g., "Photo of Drake's"). If no image, nothing renders.

### CTAs

- [ ] Primary CTA: `<FollowVenueButton locationId={location.id} locationLabel={location.label} />` — drop-in from T102. Renders below header, above content sections. Accent-filled, `Button — primary` recipe.
  _Why: T102 already handles the follow/unfollow toggle, `member_saved_searches` write, `aria-pressed` state, and "Following" flip. No reimplementation needed._
- [ ] Secondary CTA: **"Host something here"** — `Button — secondary` recipe. Links to the F034 gathering composer route with `locationId` query param pre-attached.
- [ ] Anon tap on "Follow this venue": `<FollowVenueButton>` already handles this (routes to sign-in with return URL, per T102). Verify the return-URL pattern sets `action=follow`.
- [ ] Anon tap on "Host something here": route to `/sign-in?return=/p/[…place]/l/[slug]&action=host`. After auth, redirect to gathering composer with Location pre-attached.
  _Why: return-URL pattern ensures the visitor lands back on the venue page with intent preserved, not on a generic home screen._
- [ ] Focus management after auth: on return from sign-in, focus lands on the CTA that triggered the flow (or the page body if the action auto-completes).

### About section

- [ ] Render below the CTA area (exact position depends on whether content sections exist — see T105).
- [ ] Content: Location description, accessibility notes (from `location_permanent.accessibility_notes`), Location kind tag (permanent / recurring-temporary / area).
- [ ] If description is empty, About section still renders with kind tag.

### Edge cases

- [ ] Venue-owning Group dissolved (`deleted_at IS NOT NULL`): owning Group resolves to `null`. "What's happening here" section is absent (handled in T105). CTAs still render. About still renders.
- [ ] No hero image: hero space collapses. Page starts at venue name.
- [ ] Location kind = `area` or `recurring_temporary`: page renders normally. Address line adapts (area may show centroid-derived label; recurring-temporary may show schedule context from `location_recurring_temporary`).

### Build artifact

- [ ] `BUILD-LOG.md` updated with T104 status.

## Notes

- **Reuse the place-path resolver** from `web/src/app/p/[...place]/g/[slug]/page.tsx` (T074). The `/l/[slug]` segment is structurally identical to `/g/[slug]` — same `[...place]` catch-all, different terminal entity type. Likely extract a shared `resolvePlacePath` utility if one doesn't already exist, or reuse the existing one.
- **`<FollowVenueButton>`** from T102 handles: toggle state, `aria-pressed`, `member_saved_searches` write, event logging, anon-auth gating. Drop it in — don't rewrite.
- **Distance display**: the locality feed (F030/T088) already computes distance from `member_place_interests` primary_home → `places.centroid`. Reuse the same distance utility.
- **Pattern-doc entry** (captured in review-F033): Host/Venue distinction — venue pages scope "What's happening here" to the Host (`items.group_id`), not to all Items at the Location. The pattern-doc entry should land in `playbooks/PLATFORM-PATTERNS.md` alongside or after this ticket. Not a code deliverable of this ticket.
- **Accessibility (M3)**: new page, multiple interactive elements. Review-F033 § Accessibility notes 1–7 apply. Key: hero image alt text, focus return after auth, FollowVenueButton aria-pressed verification.
- **DLS pre-existing concern** (review-F033 § a11y note 8): white text on `--pistachio-500` may not meet WCAG AA 4.5:1 contrast. Platform-wide, not F033-specific. Flag during M3 if it fails; don't block this ticket.

## Completion

Date: 2026-06-16
Commit: {pending PM approval}

**Shipped (shell scope — route, header, CTAs, About, auth gating):**
- DLS § Venue page rewritten (CTA hierarchy reversed: Follow primary / Host secondary; sections restructured; minimal-page variant; honest empty-state copy; URL/catch-all note). — `product/ui/design-language.md`
- `splitLocationSlug` + `resolveVenue` + `venueDistanceMeters` + `existingVenueSavedSearchId` — `web/src/lib/locations/resolve-venue.ts` (+ 16 unit tests).
- `<VenuePublicPage>` shell — hero (collapsing), name, address+distance, hairline, `<FollowVenueButton>` (primary), Host secondary CTA, About (kind tag + description + accessibility notes). — `web/src/components/venue/VenuePublicPage.tsx` (+ 14 unit tests).
- `/l/` dispatch folded into the `p/[...slug]` catch-all (metadata + render). — `web/src/app/p/[...slug]/page.tsx`
- `venue_distance_meters` security-invoker RPC. — `web/supabase/migrations/032_venue_distance.sql`
- Build-blocker fix: extracted `buildVenueFollowLabel` out of T102's `'use server'` file. — `web/src/lib/saved-search/venue-follow-label.ts`

**Verification:** 43 unit tests pass (resolver + component + saved-search); `next build` succeeds; eslint clean; `tsc` clean (pre-existing `migrations-t042` es2018 errors unrelated); action-layer conformance OK. The full-suite "failures" are CPU-contention timeouts in the heavyweight T051/T052 conformance suites — each passes in isolation. Live-DB row/RPC assertions are the downstream `test`/deploy step (no local Postgres).

**Deferred to T105:** owning-Group resolution + "What's happening here" / "What's happening nearby" sections (+ empty-state / minimal-page frames). See deviation 5.

**Deviations:** 6 + 1 decision note — [`development/deviations/T104.md`](../deviations/T104.md). Key: route folds into catch-all (T060 limit); distance needed a new RPC (ticket's "no new migrations / reuse distance util" premise was wrong); Location resolves by unique slug (no `place_id`); hero always collapses (no image column).
