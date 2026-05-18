# T023 — You page restructure (identity hub: saves, follows, market, vendor mode)

**Status:** Complete
**Completed:** 2026-04-25T14:03:31-07:00

## Goal
Make `/you` the single identity surface. Move scattered controls (heart-saved-list, "Your Market" selector) here so Home and Explore stay focused on discovery. Add a vendor mode entry point so producers see their dashboard from the same page.

Etsy is the model: "You" = a hub of tabs (Saved, Following, Settings, [Vendor]).

## References
- [product/surfaces/community-platform.md](../../product/surfaces/community-platform.md) — page roles
- [product/ui/design-language.md](../../product/ui/design-language.md) — tabs, list rows, empty states
- T021 — auth gate + nav patterns (this ticket assumes T021 is done)

## Scope

### 1. Move "Your Market" selector to `/you`
- Remove the Your Market button/affordance from any global header location
- Add a "Your Market" row at the top of `/you` showing current market name + city, with `[Change]` button that opens existing `MarketSelectionModal`
- Keep market state in the same store/context — only the entry point moves

### 2. Move Heart / Saved list to `/you`
- Remove the heart/saves icon from the global top nav (it currently lives near the search bar / top-right depending on viewport)
- Add a `Saved` tab on `/you` showing the user's hearted businesses as a card grid (use existing `VendorCard`)
- The heart **action** stays on listings/cards; only the list view moves

### 3. `/you` tab layout
Tabs along the top of the page (DLS chip pattern, `chip-selected` for active):
- `Saved` — hearted businesses
- `Following` — vendors the user follows (use existing T018 follow data; filter `unfollowed_at is null` per T022)
- `Settings` — profile, notification prefs, sign out

Default tab: `Saved`. Tab state in URL search param `?tab=saved|following|settings` for shareable / refresh-stable views.

### 4. Vendor mode entry
If the logged-in user owns at least one business (`businesses.owner_user_id = user.id`):
- Show a persistent "Switch to vendor mode" link/button at the top of `/you`
- Clicking routes to `/you/vendor` (placeholder page in this ticket — actual dashboard is T026)
- Multi-vendor case: show vendor picker on `/you/vendor` (out of scope for layout; just route correctly)

If the user owns no business:
- Show the recruitment microcopy from T021 ("Own a local business? List it free →") at the bottom of `/you`

### 5. Empty states
- Saved empty: "No saved businesses yet. Tap the heart on any listing to save it." `[Explore →]`
- Following empty: "Not following anyone yet. Follow vendors to see their bulletins and updates." `[Explore →]`

## Acceptance criteria
- [ ] `/you` renders three tabs: Saved, Following, Settings — chip-styled per DLS.
- [ ] `?tab=` query param drives the active tab and survives refresh.
- [ ] Your Market selector is visible only on `/you` (no global header instance), and `[Change]` opens `MarketSelectionModal`.
- [ ] Heart/Saved entry in global nav is removed; saved listings appear under `/you?tab=saved`.
- [ ] Following tab lists vendors with `follows.unfollowed_at is null`.
- [ ] If user owns a business, "Switch to vendor mode" link routes to `/you/vendor` (placeholder OK).
- [ ] If user owns no business, the recruitment panel renders at the bottom of `/you`.
- [ ] Empty states match copy above and link to Explore.
- [ ] Existing `data-testid`s for saved/follow actions on listings remain intact.
- [ ] `npm run build` and existing evals pass.

## Out of scope
- The vendor dashboard itself (T026)
- Notifications inbox (deferred)
- Profile photo upload UX changes
- Multi-vendor picker UI

## Notes
This is a structural move ticket. No new data, no new actions — just relocating existing surfaces so Home and Explore can be discovery-only. T021's two-track nav is a hard prerequisite (the global heart/market controls need to be gone first).

## Completion

Date: 2026-04-25
Status: Complete

**Delivered:**
- `/you` rebuilt with three chip-styled tabs (Saved / Following / Settings); `?tab=` query param drives active tab and survives refresh.
- "Your Market" row at top of `/you` with `[Change]` opening `MarketSelector` modal (state shared via `useMarket` context).
- Saved tab pulls from `supports` table; Following tab pulls from `follows` filtered by `unfollowed_at IS NULL` (T022 soft-delete). Both render `VendorCard` grid.
- Empty states match copy ("No saved businesses yet…", "Not following anyone yet…") with `[Explore →]` CTA.
- "Switch to vendor mode" link rendered in header when user owns a business; routes to `/you/vendor` placeholder (full dashboard = T026).
- `RecruitmentGrid` shown at bottom of `/you` for users with no vendor.
- Removed `MarketPill` and Heart icon from `HomeFeed` mobile header — replaced with brand mark + `User` icon → `/you`. Explore retains `MarketPill` as a discovery filter.

**Verification:**
- `npm run build` ✅ (new `/you/vendor` route builds)
- `npm run test` ✅ 51/51 passing
