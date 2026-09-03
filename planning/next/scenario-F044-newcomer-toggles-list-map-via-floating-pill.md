---
purpose: Scenario — replace full-width List/Map segmented control on Explore with an inline toggle that scrolls with content.
layer: how
status: next
---

# F044: Newcomer toggles between list and map via an inline toggle

**Bundle:** b1
**Sub-bundle:** integration-test prep (post b1.4 — polish pass on shipped Explore surface)
**Work-map item:** No direct checklist entry — serves the unchecked integration test ("A newcomer can complete the full journey… without getting stuck") by reducing Explore UI clutter and maximizing content density. Suggest adding a "Explore density parity with Home" line to the checklist.
**Loops:** 3 (Land here), 7 (Make and be found — discovery side)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → `discoverable_items` materialized view → browse (no schema change)
**Spec contract:** design-research-thesis.md §5 (Explore wireframe — inline toggle), community-platform.md § Explore T1
**Status:** next

## The Person

A newcomer to Sacramento who just set their home Location to Oak Park (the C1 persona). They open Explore to see what's nearby. Today a full-width List/Map segmented control sits between the search bar and the results, consuming vertical space and creating visual clutter that makes Explore feel heavier than Home.

## The Story

The newcomer taps Explore from the bottom nav. The sticky search bar sits at the top — location on the left, search icon, filter icon on the right (per thesis §5). Results fill the screen below. Cards scroll freely with 24px vertical gaps between them. After a batch of result cards, an inline `[List] · [Map]` toggle appears within the content flow — it scrolls with the results, not fixed to any edge. They tap "Map"; the view crossfades to the map with kind-color-coded pins. They tap "List"; back to cards. The toggle is lightweight text — not a floating button, not a fixed control — just part of the content rhythm.

## Surfaces

- **Entry point:** Explore tab (`/explore`)
- **Primary action:** Tap the inline toggle to switch between list and map views
- **Interaction:** The toggle is inline text (e.g., `[List] · [Map]`) positioned within the results flow. It scrolls with content. Active state: charcoal-700 fill, white text. Inactive state: white fill, charcoal-900 text, 1px charcoal-100 border. Transition between views is a crossfade, not a page navigation.
- **Completion:** The selected view persists for the session. No URL change — the toggle is ephemeral state.
- **Discovery:** No new discovery surface; this changes how existing results render.

## Data Captured

No new data. This is a pure presentation-layer change.

## Acceptance Criteria

### The inline toggle replaces the segmented control

**Given** the Explore page is loaded
**When** the page renders
**Then** no full-width List/Map segmented control is visible as a fixed element; instead, a compact `[List] · [Map]` toggle appears inline within the results content, scrolling with the cards. _Why: thesis §5 wireframe and appendix specify "List/Map toggle inline with content (scrolls with results), not fixed." A fixed control — whether a segmented bar or a floating FAB — consumes permanent vertical space or occludes content. The inline toggle takes zero fixed layout space and respects the thesis's content-is-the-design principle (§9, #1)._

### Toggling to map view

**Given** the Explore page is showing list results
**When** the newcomer taps "Map" on the inline toggle
**Then** the view transitions to the map (same result set as kind-color-coded pins), and the toggle state updates to reflect map is active. _Why: the same result set in two renderings is the existing spec (community-platform.md § Explore T1); only the toggle affordance changes._

### Toggling back to list view

**Given** the Explore page is showing the map
**When** the newcomer taps "List" on the toggle
**Then** the view transitions back to the scrollable card list, and the toggle state updates.

### Toggle does not consume fixed layout space

**Given** the Explore page is loaded in list view
**When** the newcomer scrolls through results
**Then** the toggle scrolls with content — it is part of the document flow, not fixed or floating. It does not occlude cards at any scroll position. _Why: thesis §5 specifies the toggle is inline, not fixed. The Explore page has three fixed layers already (sticky search at top, kind pills at bottom, nav at bottom); a fourth fixed element would compress the scrollable area._

### Toggle position in the content flow

**Given** the Explore page with results
**When** the page renders
**Then** the toggle appears after the initial batch of result cards (e.g., after cards 3-5), centered horizontally in the content area, with 24px vertical spacing above and below (matching card gaps per thesis §4). _Why: the toggle appears where the member is already scrolling, not at an edge they'd have to reach for. Positioning after initial results gives the member context before offering the view-switch._

## Edge Cases

- **No results:** toggle still renders (the map shows the search area even with no results).
- **Desktop viewport:** toggle renders inline, centered in the content column.
- **Accessibility:** toggle has `role="tablist"` with two `role="tab"` children, `aria-selected` reflecting current state.

## Assumptions

- The map view already exists (community-platform.md § Explore T1 confirms "Map toggle").
- The search bar is top-anchored and sticky (thesis §5). Kind-filter pills are bottom-anchored above the nav (thesis §5).

## Out of Scope

- Full-screen map as a primary route (deferred per community-platform.md § Explore).
- Persisting the toggle preference across sessions (b2).
- Floating pill / FAB pattern (rejected per thesis — inline is the specified approach).

## Capabilities unlocked

- **Presence & Findability** — refines the existing locality-first browse surface (no new capability; polish on the Phase 2 browse index).
