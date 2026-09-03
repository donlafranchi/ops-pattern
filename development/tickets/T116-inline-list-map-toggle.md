# T116: Inline list/map toggle on Explore

**Scenario:** `planning/next/scenario-F044-newcomer-toggles-list-map-via-floating-pill.md`
**Status:** Done
**Bundle:** b1
**Depends on:** T114

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found) — the toggle lets the newcomer switch between card-browsing and geographic-browsing of the same result set without losing context.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` materialized view → browse (no schema change)

## Workflow gates (mandatory during the migration phase)

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [x] **M3 — `design:accessibility-review`** — passes WCAG 2.1 AA. Found and fixed an invisible focus ring on the selected tab of *both* tablists (this one and T114's kind pills).
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [x] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [x] Remove any existing full-width List/Map segmented control that renders as a fixed element on the Explore page (if one exists from prior work).
- [x] Create `<ListMapToggle>` component (e.g. `src/components/explore/ListMapToggle.tsx`). Renders compact inline text: `[List] · [Map]`. Not a button group or floating element — inline within the results flow.
  _Why: thesis §5 appendix — "List/Map toggle inline with content (scrolls with results), not fixed." A fixed control would be the fourth fixed layer on Explore (sticky search, pills, nav); inline takes zero fixed layout space._
- [x] Toggle is positioned inline in the results list after the initial batch of result cards (3–5 cards). Centered horizontally. 24px vertical spacing above and below (matching card gaps per thesis §4).
  _Why: positioned where the member is already scrolling, giving context before offering the view-switch._
- [x] The toggle scrolls with content — it is part of the document flow, not fixed or floating. Does not occlude cards at any scroll position.
- [x] Active state: `var(--color-charcoal-700)` fill, white text. Inactive state: white fill, `var(--color-charcoal-900)` text, 1px `var(--color-charcoal-100)` border.
- [x] Tapping "Map" transitions the view to the map (same result set as kind-color-coded pins). Toggle state updates to show Map as active.
- [x] Tapping "List" transitions back to the scrollable card list. Toggle state updates.
- [x] Transition between views: crossfade (CSS opacity transition), not a page navigation. No URL change — toggle is ephemeral session state.
  _Why: the same result set in two renderings is the existing spec (community-platform.md § Explore T1); only the toggle affordance changes._
- [x] Selected view persists for the session (React state). Resets to List on next session.
- [x] No results: toggle still renders (the map shows the search area even with no results).
- [x] Desktop viewport: toggle renders inline, centered in the content column.
- [x] Accessibility: `role="tablist"` with two `role="tab"` children, `aria-selected` reflecting current state.
- [x] BUILD-LOG.md updated.

## Notes

The map view already exists per community-platform.md § Explore T1 ("Map toggle: same result set rendered as kind-color-coded pins"). This ticket changes the toggle affordance, not the map implementation. Reuse the existing map component and its pin-rendering logic.

The toggle's position "after 3–5 cards" can be implemented as a React component rendered at a fixed index in the results list (e.g. after index 4). If results are fewer than that, render the toggle after the last card.

The crossfade transition: when toggling to map, fade out the card list and fade in the map container (and vice versa). A simple CSS transition on opacity with 200ms duration is sufficient. The map container should be pre-rendered (hidden) so the transition is smooth — or lazy-loaded on first toggle tap with a skeleton placeholder.

This ticket depends on T114 (kind-filter pills) because the scrollable results area is bounded by the sticky search bar at top and the pill row at bottom. The toggle lives within that scrollable area.

## Completion

Date: 2026-09-03
Commit: 060ee79 (merged as 76aaab6)

Built on branch `t116` in worktree `../web-t116`.

**Shipped.** `ListMapToggle` — a compact `[List] · [Map]` tablist that lives in the document flow and scrolls with the results. In list view it interrupts the card grid after four cards; in map view it sits below a `70vh` map, on screen without a scroll. The fixed control cluster is gone, so Explore's bottom is now just the kind pills and the nav. The view is session state — no longer written to or read from the URL, per F044 § Out of Scope.

**Deviations.** Six, all accepted — see DEVIATIONS § T116. The notable ones: `?view=` is deliberately removed (AC-mandated, costs shareable map links); the transition is a fade-in on the incoming pane rather than a true overlapping crossfade, which the ticket's own note allows.

**Caught by M3.** The selected tab in both this tablist and T114's kind pills had an invisible focus ring — neither set `outline-color`, so it fell to the UA default `currentColor`, which on a selected pill is white against a white page. Both now set the accent colour unconditionally with only style and offset under `focus-visible:`, so the value is measurable whether or not the element is focused. Verified under a real keyboard Tab.

**Tests.** 127 across the Explore component set and 209 across Explore + lib + hooks, all green. New: `ListMapToggle.test.tsx` (16), plus 14 added to `ExplorePage.test.tsx` and one regression test each in `KindFilterPills.test.tsx` and `query.test.ts`. Full suite 13 failed / 1347 passed; the failures are the same ESLint-shelling CI-conformance and auth specs that flake on `main`, and in isolation `t116`'s failing set is a strict subset of `main`'s. Build passes.

**Live verification** at 375×812 and 1280×900 against the seeded database. Mobile: toggle after 4 cards at static position inside `#explore-results`, 24px margins top and bottom, 86×44 and 91×44 targets, active 11.03:1 and inactive 14.16:1. With three results the toggle follows the last card; with zero it still renders below the empty state. Map view paints 16 pins with the toggle at 669–713, clear of the pills at 724. Desktop: toggle centred at 640 in a 1280 column, inline after the first row of four. No `view=` in any URL the page writes, and `?view=map` on load opens the list.

**Flagged, not fixed.** Neither F044 nor F045 has a `review-F###.md`; both went `plan-approved` → `ticketed` on 2026-09-02 without the mandatory `review` gate. Nothing in either build surfaced a problem review would have caught, but the gap is real.

## Bearing on the Explore-absorbs-Home merge (noted 2026-09-03, not acted on)

Direction ratified in principle after this ticket landed: Explore absorbs Home. Nothing in T116 was refactored toward it. What this ticket learned that the merge scenario will need:

**Nothing in T116 conflicts with the direction.** The toggle, the filter sheet, the chip row and the pill row all live on the surviving surface. T116's rationale strengthens rather than weakens: its whole argument was refusing a fourth fixed layer, and the merged surface inherits Home's chrome on top of the three Explore already carries (sticky search 61px + kind pills 44px + nav 44px ≈ 149px of an 812px viewport). Home's scope picker is the obvious fourth-layer candidate; the filter sheet is where it belongs instead.

**One constant is genuinely layout-coupled.** `TOGGLE_AFTER_CARDS = 4` in `ExplorePage.tsx` is chosen because 4 completes a row at both `grid-cols-2` and `lg:grid-cols-4`. Home's feed renders `max-w-3xl` at a different column count; if the merged grid changes, that number needs re-deriving. It is the only number in T116 that depends on the surrounding layout.

**URL params: no name collision, but two semantic ones.** Home's entire public URL surface is `?place=<slug>`; interest tags, member `primary_home` and limit are all server-derived and never serialized. Explore owns `q`, `kind`, `category`, `distance`, `schedule`, `sort`. The names do not overlap. Two deeper conflicts do:

1. **`?place=` would silently not move Explore's distance origin.** `fetchExploreOrigin` (T115) calls `resolveFeedPlace(client, {})` with neither `memberPlaceId` nor `requestedSlug`, so it always resolves the launch-locality default. Home calls the same function with both. On a merged surface, changing place would move the feed while leaving "within 5 mi" measured from the wrong point, with no visible symptom. T115's DEVIATIONS deferred this to "an Explore place scope" — the merge *is* that scope, and this is the first thing it has to wire.
2. **`?sort=` and the RPC ranking are two ranking authorities over one list.** `locality_feed_items(p_place_id, p_tags, p_limit)` orders server-side with tag weighting; Explore's `sort` re-orders client-side over an already-fetched page. The merge has to decide whether relevance becomes a fourth `sort` value that defers to the RPC, or the RPC grows a sort parameter.

**Two read paths over the same MV.** Home reads through the `locality_feed_items` RPC (ranked, no kind parameter); Explore selects `discoverable_items` directly (filterable, server-side `kind`, `EXPLORE_LIMIT = 100`, no paging). Both sit on the same materialized view. Worth stating plainly: Explore's category / distance / schedule / sort filters narrow *the first 100 rows*, not the corpus. That is already true, and the merge makes it matter more, because on a ranked feed "the first 100" is a meaningful cut rather than an arbitrary one.

**Two tablists already share one results region.** The kind pills (T114) and the view toggle (T116) both point `aria-controls` at `#explore-results`. That is defensible at two. If the merged surface adds ranking tabs, the panel should become a plain labelled `region` rather than a tabpanel with three claimants.
