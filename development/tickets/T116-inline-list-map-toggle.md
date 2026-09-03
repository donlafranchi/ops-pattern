# T116: Inline list/map toggle on Explore

**Scenario:** `planning/next/scenario-F044-newcomer-toggles-list-map-via-floating-pill.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T114

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found) — the toggle lets the newcomer switch between card-browsing and geographic-browsing of the same result set without losing context.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` materialized view → browse (no schema change)

## Workflow gates (mandatory during the migration phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — yes, this introduces a new interactive component (tablist).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Remove any existing full-width List/Map segmented control that renders as a fixed element on the Explore page (if one exists from prior work).
- [ ] Create `<ListMapToggle>` component (e.g. `src/components/explore/ListMapToggle.tsx`). Renders compact inline text: `[List] · [Map]`. Not a button group or floating element — inline within the results flow.
  _Why: thesis §5 appendix — "List/Map toggle inline with content (scrolls with results), not fixed." A fixed control would be the fourth fixed layer on Explore (sticky search, pills, nav); inline takes zero fixed layout space._
- [ ] Toggle is positioned inline in the results list after the initial batch of result cards (3–5 cards). Centered horizontally. 24px vertical spacing above and below (matching card gaps per thesis §4).
  _Why: positioned where the member is already scrolling, giving context before offering the view-switch._
- [ ] The toggle scrolls with content — it is part of the document flow, not fixed or floating. Does not occlude cards at any scroll position.
- [ ] Active state: `var(--color-charcoal-700)` fill, white text. Inactive state: white fill, `var(--color-charcoal-900)` text, 1px `var(--color-charcoal-100)` border.
- [ ] Tapping "Map" transitions the view to the map (same result set as kind-color-coded pins). Toggle state updates to show Map as active.
- [ ] Tapping "List" transitions back to the scrollable card list. Toggle state updates.
- [ ] Transition between views: crossfade (CSS opacity transition), not a page navigation. No URL change — toggle is ephemeral session state.
  _Why: the same result set in two renderings is the existing spec (community-platform.md § Explore T1); only the toggle affordance changes._
- [ ] Selected view persists for the session (React state). Resets to List on next session.
- [ ] No results: toggle still renders (the map shows the search area even with no results).
- [ ] Desktop viewport: toggle renders inline, centered in the content column.
- [ ] Accessibility: `role="tablist"` with two `role="tab"` children, `aria-selected` reflecting current state.
- [ ] BUILD-LOG.md updated.

## Notes

The map view already exists per community-platform.md § Explore T1 ("Map toggle: same result set rendered as kind-color-coded pins"). This ticket changes the toggle affordance, not the map implementation. Reuse the existing map component and its pin-rendering logic.

The toggle's position "after 3–5 cards" can be implemented as a React component rendered at a fixed index in the results list (e.g. after index 4). If results are fewer than that, render the toggle after the last card.

The crossfade transition: when toggling to map, fade out the card list and fade in the map container (and vice versa). A simple CSS transition on opacity with 200ms duration is sufficient. The map container should be pre-rendered (hidden) so the transition is smooth — or lazy-loaded on first toggle tap with a skeleton placeholder.

This ticket depends on T114 (kind-filter pills) because the scrollable results area is bounded by the sticky search bar at top and the pill row at bottom. The toggle lives within that scrollable area.

## Completion

Date:
Commit:
