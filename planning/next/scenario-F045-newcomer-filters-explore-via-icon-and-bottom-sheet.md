---
purpose: Scenario — consolidate Explore filters into a filter icon + bottom sheet for secondary filters, with kind-filter pills anchored above bottom nav.
layer: how
status: next
---

# F045: Newcomer filters Explore via icon, kind pills, and bottom sheet

**Bundle:** b1
**Sub-bundle:** integration-test prep (post b1.4 — polish pass on shipped Explore surface)
**Work-map item:** No direct checklist entry — serves the unchecked integration test ("A newcomer can complete the full journey… without getting stuck") by de-cluttering the Explore default view. Suggest adding a "Explore density parity with Home" line to the checklist.
**Loops:** 3 (Land here), 7 (Make and be found — discovery side)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → `discoverable_items` materialized view → filtered browse (no schema change)
**Spec contract:** design-research-thesis.md §5 (Explore — bottom pills, top-right search/filter), community-platform.md § Explore T1
**Status:** next

## The Person

The same C1 newcomer. They want to narrow Explore results — find just the farmers markets this weekend, or just services nearby. Today three separate filter buttons (market selector, category, day) sit in a row beneath the search bar, consuming vertical space and requiring the newcomer to parse three affordances before they can start browsing.

## The Story

The newcomer opens Explore. The top of the screen shows a compact, sticky search row: location on the left ("West Sacramento"), search icon center-right, filter icon (three-slider glyph) on the right. Results fill the middle. At the bottom, anchored just above the nav bar, a horizontally scrollable row of kind-filter pills reads: `[All] [Events] [Products] [Services] [Ideas] [Offers] [Asks]`. "All" is selected by default.

The newcomer taps "Events" — results filter instantly to gatherings only. They want this weekend's events specifically, so they tap the filter icon in the search bar. A bottom sheet slides up with secondary filters: distance (1 / 5 / 10 / 25 mi), schedule (any / this week / this weekend / recurring), category (multi-select), and sort. They pick "this weekend," tap "Show results," and the sheet dismisses. A removable chip below the search bar reads "This weekend." They see three events. They tap ✕ on the chip; results return to all upcoming events.

**Two filter layers:** kind pills are always visible at the bottom (frequent-tap, thumb-zone); secondary filters live behind the icon (less frequent, full filter set).

## Surfaces

- **Entry point:** Explore tab (`/explore`)
- **Kind-filter pills:** Fixed row at the bottom, 44px tall, anchored above the 52px bottom nav. Horizontally scrollable. Selected pill: charcoal-700 fill, white text. Unselected: white fill, 1px charcoal-100 border, charcoal-900 text. "All" pill at far left (default).
- **Filter icon:** Three-slider glyph at the right edge of the sticky search bar. Dot indicator when secondary filters are active.
- **Bottom sheet:** Slides up on filter icon tap. Contains: distance selector, schedule filter, category multi-select, sort order. "Show results" button at bottom, "Clear all" link when filters are set.
- **Active filter chips:** Removable chips below the search bar for active secondary filters (not for kind — the pill shows kind state). Chip row disappears when no secondary filters are active.
- **Completion:** Filtered results render in the main list/map view. Filter state reflected in URL for shareable views.

## Data Captured

No new data. Filter parameters are the same as today (kind, category, distance, schedule per community-platform.md § Explore T1). The change is structural — kind moves from the bottom sheet to always-visible pills; the remaining filters stay in the sheet.

## Acceptance Criteria

### Kind-filter pills anchor above bottom nav

**Given** the Explore page is loaded
**When** the page renders
**Then** a horizontally scrollable row of kind-filter pills (All, Events, Products, Services, Ideas, Offers, Asks) is anchored above the bottom nav bar, fixed at the bottom of the viewport. The row has a 1px hairline top border (charcoal-100). "All" is selected by default. _Why: thesis §5 — "kind-filter pills anchored at the bottom, above the nav bar." Thumb reachability (the pills are a frequent-tap interaction; the bottom is the natural thumb zone per Hoober's research, thesis §8). Thesis principle §9 #7: "Bottom for action, top for orientation."_

### Filter icon replaces dedicated filter buttons

**Given** the Explore page is loaded
**When** the page renders
**Then** no dedicated filter buttons (market selector, category, day) are visible as separate controls; instead, a filter icon (three-slider glyph) sits at the right edge of the sticky top search bar. _Why: thesis §5 — the search row is "one row, three elements: location pill, search icon, filter button." Three separate filter buttons consume a full row of vertical space between search and results._

### Bottom sheet opens with secondary filters

**Given** the Explore page with the kind pills at bottom
**When** the newcomer taps the filter icon in the search bar
**Then** a bottom sheet slides up containing: distance selector (1 / 5 / 10 / 25 mi), schedule filter (any / this week / this weekend / recurring), category multi-select, and sort order. A "Show results" button anchors to the bottom of the sheet. A "Clear all" link is visible when any filter is set. _Why: kind filtering is handled by the always-visible pills. The bottom sheet holds the less-frequent filters that refine within a kind. This two-layer approach (pills for kind, sheet for refinement) reduces the sheet's cognitive load and keeps the most common filter (kind) always one tap away._

### Kind pill selection filters results instantly

**Given** the Explore page showing "All" results
**When** the newcomer taps the "Events" pill
**Then** results filter immediately to `items.kind = 'gathering'` only. The "Events" pill shows the selected state (charcoal-700 fill, white text). The "All" pill reverts to unselected. No bottom sheet opens — pill selection is direct. _Why: kind is the primary browse dimension. It should be instant, not gated behind a sheet. The always-visible pills mean the member always knows which kind they're viewing._

### Active secondary filters render as removable chips

**Given** the newcomer has applied secondary filters (e.g., schedule=this weekend)
**When** the bottom sheet dismisses
**Then** removable chips appear below the sticky search bar, one per active secondary filter, each with ✕ to remove. The kind selection is NOT shown as a chip — its state is visible in the bottom pills. _Why: chips provide at-a-glance filter state for the secondary filters that aren't otherwise visible. Kind doesn't need a chip because the pills already show it._

### Chip row disappears when no secondary filters are active

**Given** the newcomer has active secondary filter chips
**When** they remove all chips (or tap "Clear all" in the sheet)
**Then** the chip row disappears entirely — no empty row, no placeholder. _Why: zero-filter state should show zero chrome. Maximum content density when no secondary filters are applied._

### Filter state persists in URL

**Given** the newcomer has applied kind and/or secondary filters
**When** they copy or share the current URL
**Then** the URL includes query parameters reflecting all active filters (kind + secondary), and navigating to that URL restores the same filter state. _Why: per community-platform.md § Explore T1 — "filter state reflected in URL for shareable views."_

### Back navigation restores filters

**Given** the newcomer has active filters, taps into an Item page, then navigates back
**When** the Explore page re-renders
**Then** the previous filter state (kind pill + secondary filters) and scroll position are restored. _Why: per community-platform.md § Explore T1 — "Back navigation restores scroll and filter state."_

### Dot indicator on filter icon when secondary filters are active

**Given** the newcomer has active secondary filters (distance, schedule, category, or sort)
**When** the Explore page renders
**Then** a small dot appears on the filter icon indicating active filters. _Why: the member needs to know filters are applied even when the chip row scrolls out of view (the search bar is sticky, so the dot is always visible)._

## Edge Cases

- **Many active secondary filters:** chip row wraps to a second line if needed; never horizontally scrolls.
- **Bottom sheet height:** half-screen by default; scrollable internally if needed; never full-screen.
- **Kind pill + secondary filter interaction:** selecting a kind that has no results for the active secondary filters shows the empty state for that kind+filter combo.
- **Accessibility:** filter icon has `aria-label="Open filters"`; bottom sheet is a dialog with focus trap; pills have `role="tablist"` with `role="tab"` per pill; chips have `aria-label="Remove [filter name] filter"`.
- **Desktop viewport:** filter icon stays in the search bar; bottom sheet becomes a dropdown panel; kind pills may move to a horizontal bar below the search row.

## Assumptions

- All four filter types already exist (community-platform.md § Explore T1 confirms kind, category, distance, schedule).
- The search bar is top-anchored and sticky (thesis §5).
- The bottom nav is 52px tall (thesis §2).

## Out of Scope

- Saved searches / saved filter presets (b2 per community-platform.md).
- Additional filter types (e.g., price range, Group membership) — b2.
- Filter count badge on the icon (the dot indicator is sufficient at b1).

## Capabilities unlocked

- **Presence & Findability** — refines the existing locality-first browse surface (no new capability; polish on the Phase 2 browse filters).
