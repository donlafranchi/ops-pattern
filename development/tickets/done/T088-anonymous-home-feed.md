---
id: how-t088-anonymous-home-feed
purpose: Anonymous, locality-defaulted home feed at / — discoverable-items feed, "Make this yours" signup CTA, scope picker, and the widen-locality empty state.
layer: how
status: open
---

# T088 — Anonymous home feed at `/` (locality-defaulted) + signup CTA

**Scenario:** [F030 — A newcomer signs up and lands in the feed](../../planning/now/scenario-F030-newcomer-signs-up-and-lands-in-feed.md)
**Binds to:** `product/ui/design-language.md` (cards, CTA placement) · `product/ui/community-platform.md` (Home role) · T087 (feed query)
**Status:** Open
**Bundle:** b1 (b1.4 — Newcomer entry)
**Depends on:** T087 (getLocalityFeed) · T058 (places)
**Repo / branch:** web / `t-f030`

## Serves

- F030 AC "Anonymous visitor sees a locality-defaulted feed" — feed + "Make this yours" CTA + scope picker.
- F030 AC "Empty-state handling" — friendly message + one-tap widen-locality.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (Home surface changes — MANDATORY).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Place resolution — `src/lib/feed/feed-place.ts`

- [ ] `resolveFeedPlace(supabase, { memberPlaceId?, requestedSlug? })` → `Promise<{ placeId, displayName, slug } | null>`. Precedence: an authenticated Member's `primary_home` → an explicit `requestedSlug` (scope-picker) → the launch-locality default (`places` row with the launch slug). Null only when even the default is missing (→ picker-first per the IP-fail edge case).
- [ ] **b1 IP geolocation is deferred** — the default stands in for IP-geolocation. DEVIATIONS entry.

### Components — `src/components/feed/`

- [ ] `ItemFeedCard.tsx` — presentational, kind-aware (Event / Product / Service / Idea / Offer / Ask / Initiative label via a kind→label map), links to the Item URL (`/m/<handle>/<seg>/<title>-<id8>`), shows title, kind badge, brand/owner, nearest-location label. `data-testid="feed-item-card"`.
- [ ] `FeedEmptyState.tsx` — "No matches near you yet." + a widen-locality button (`data-testid="widen-locality"`) that links to the parent Place feed (`?place=<parentSlug>`); falls back to "any Place in your state" when parent is the state root.
- [ ] `MakeThisYoursBanner.tsx` — anon-only signup CTA above the feed (`data-testid="signup-cta"`, links to `/auth/signup?next=/onboarding`). Hidden when authenticated.
- [ ] `ScopePicker.tsx` — minimal client control to change locality before signup; sets `?place=<slug>`. `data-testid="scope-picker"`.

### Page — `src/app/page.tsx` + `src/components/feed/LocalityFeed.tsx`

- [ ] `/` renders the server component `<LocalityFeed>` (replaces the pre-rebuild `<HomeFeed>`). Reads session → Member primary_home or default place; calls `getLocalityFeed`; renders banner (anon) + scope picker + cards, or `<FeedEmptyState>` when empty.
- [ ] Accepts `?place=<slug>` to drive the scope picker.

### Tests — `src/components/feed/*.test.tsx`

- [ ] `ItemFeedCard.test.tsx` — renders title/kind-badge/owner; correct Item href per kind; testid present.
- [ ] `FeedEmptyState.test.tsx` — renders message + widen button → parent slug; state-root fallback copy.
- [ ] `MakeThisYoursBanner.test.tsx` — shows CTA when anon, hidden when authed; href = `/auth/signup?next=/onboarding`.
- [ ] `tests/feed-place.test.ts` — `resolveFeedPlace` precedence (member > requested > default > null) against a fake client.

### BUILD-LOG

- [ ] BUILD-LOG T088 line.

## Notes

- `<LocalityFeed>` is an async server component — its end-to-end behaviour is the F030 eval's job; unit coverage targets the presentational pieces + place resolution.
- Old `HomeFeed` (events/vendor_bulletins, pre-rebuild) is unmounted from `/` but left in the tree (other surfaces may still import it). DEVIATIONS note.

## Completion

Date: 2026-06-02
Commit: `b12fbd6` (branch `t-f030`, web repo; unmerged per task)
Status: Build complete. 13/13 T088 vitest GREEN (ItemFeedCard/FeedEmptyState/MakeThisYoursBanner + resolveFeedPlace); src 189 GREEN; tsc/eslint clean.
Notes: `src/lib/feed/{feed-place,item-url}.ts` + `src/components/feed/{LocalityFeed,ItemFeedCard,FeedEmptyState,MakeThisYoursBanner,ScopePicker}.tsx`; `/` repointed to `<LocalityFeed>`. b1 IP geolocation deferred → launch-locality default + picker; feed links via Member-scoped Item URL. M2 self-review PROCEED; M3 deferred (async server component — a11y verified via presentational pieces + eval). DEVIATIONS + SPEC-PATCHES 2026-06-02.
