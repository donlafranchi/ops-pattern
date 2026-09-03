# T115: Filter icon, bottom sheet, and active-filter chips on Explore

**Scenario:** `planning/next/scenario-F045-newcomer-filters-explore-via-icon-and-bottom-sheet.md`
**Status:** Done
**Bundle:** b1
**Depends on:** T114

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found) — secondary filters let the newcomer narrow from "what's nearby" to "what's nearby this weekend" without leaving the browse surface.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` materialized view → filtered browse (no schema change)

## Workflow gates (mandatory during the migration phase)

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit. Five fixes applied pre-commit; see DEVIATIONS § T115.
- [x] **M3 — `design:accessibility-review`** — passes WCAG 2.1 AA. Two fixes applied during the audit ("Clear all" contrast + target size); three findings accepted with rationale.
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [x] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [x] Sticky search bar at top of Explore: location pill (left), search icon (center-right), filter icon (right). The filter icon is a three-slider glyph.
  _Why: thesis §5 — "one row, three elements: location pill, search icon, filter button." Compact header maximizes content area._
- [x] Filter icon: when secondary filters (distance, schedule, category, sort) are active, a small dot indicator appears on the icon.
  _Why: the search bar is sticky, so the dot is always visible — the member knows filters are applied even when the chip row scrolls out of view._
- [x] Tapping the filter icon opens a bottom sheet (`<ExploreFilterSheet>` or similar). Half-screen height by default, scrollable internally, never full-screen.
- [x] Bottom sheet contains: distance selector (1 / 5 / 10 / 25 mi), schedule filter (any / this week / this weekend / recurring), category multi-select, sort order. "Show results" button at sheet bottom. "Clear all" link visible when any filter is set.
  _Why: kind filtering is handled by the always-visible pills (T114). The sheet holds the less-frequent secondary filters. This two-layer approach reduces the sheet's cognitive load._
- [x] Tapping "Show results" dismisses the sheet and applies selected filters. Results update.
- [x] Active secondary filters render as removable chips below the sticky search bar, one per active filter, each with ✕ to dismiss. Kind selection is NOT shown as a chip — its state is visible in the bottom pills.
  _Why: chips provide at-a-glance filter state for secondary filters. Kind doesn't need a chip because the pills show it._
- [x] When all chips are removed (or "Clear all" tapped), the chip row disappears entirely — no empty row.
  _Why: zero-filter state = zero chrome. Maximum content density._
- [x] Many active secondary filters: chip row wraps to a second line if needed (no horizontal scroll on chips).
- [x] Filter state (kind + secondary) persists in URL query parameters. Navigating to a URL with filter params restores the filter state.
  _Why: community-platform.md § Explore T1 — "filter state reflected in URL for shareable views."_
- [x] Back navigation from an Item page restores previous filter state (kind pill + secondary filters) and scroll position.
  _Why: community-platform.md § Explore T1 — "Back navigation restores scroll and filter state."_
- [x] Accessibility: filter icon has `aria-label="Open filters"`; bottom sheet is a dialog with focus trap; chips have `aria-label="Remove [filter name] filter"`.
- [x] Desktop viewport: filter icon stays in search bar; bottom sheet becomes a dropdown panel (or remains a sheet — build agent's discretion on the proportionate approach). Kind pills may render below the search row instead of at the bottom.
- [x] BUILD-LOG.md updated.

## Notes

The four filter types already exist per community-platform.md § Explore T1 (kind, category, distance, schedule). This ticket restructures WHERE they live, not what they filter. Existing filter query logic should be reused.

The bottom sheet can use a library like `vaul` (Drawer component for React) or be hand-rolled with a fixed-position overlay + `transform: translateY` + touch-to-dismiss. Keep it simple — the sheet is a container, not a feature.

The search bar is top-anchored and sticky (thesis §5). If the existing Explore page has a different search bar layout, reshape it to match the thesis wireframe. The location pill may already exist from prior Explore work (T015/T016).

The F045 scenario's assumptions said "The bottom nav is 52px tall" — stale. The ratified value is 44px (thesis §2, 2026-09-02). T112 corrects the nav; T114 anchors pills above it at 44px. Build against the corrected value. _F045 itself corrected 2026-09-03._

## Completion

Date: 2026-09-03
Commit: 06bc333 (merged as f4d5512)

Built on branch `t115` in worktree `../web-t115`.

**Shipped.** A sticky top search row (location pill / search icon / three-slider filter icon with dot indicator) replaces the desktop header and the mobile search input. A hand-rolled bottom sheet — right-anchored dropdown panel on desktop — holds distance, schedule, category multi-select and sort. Active secondary filters render as removable chips below the search row; kind never appears as a chip. All of it round-trips through the URL alongside `?kind=`, and scroll position is restored from sessionStorage once the results paint.

**New modules.** `src/lib/explore/filters.ts` (filter model, URL parsing, chip descriptors, week/weekend ranges, haversine, apply + sort), `src/lib/explore/origin.ts` (locality name + centroid), `src/hooks/useScrollRestoration.ts`, and three components under `src/components/explore/`.

**Deviations.** Eight, all accepted or routed — see DEVIATIONS § T115. Two Type B stubs touched: the accent-token contrast decision (new, `planning/backlog/decision-accent-token-contrast.md`) and the existing canonical-URL/place stub, which now also carries the locality picker.

**Tests.** 154 across the files T115 created or touched, all green: `filters.test.ts` (37), `ExploreFilterSheet.test.tsx` (26), `ExplorePage.test.tsx` (34), `items.test.ts` (19), `ExploreSearchBar.test.tsx` (14), `ActiveFilterChips.test.tsx` (7), `query.test.ts` (7), `useScrollRestoration.test.ts` (6), `origin.test.ts` (4). 184 green across the whole Explore + hooks set with T114's `KindFilterPills` (15), `kinds` (5) and T117's `ewkb` (10) untouched.

Full suite: 10 failed / 1319 passed, against a `main` baseline of 10 failed / 1201 passed — the same ten pre-existing failures (`ci-enforcement-rule-1` ×4, `ci-enforcement-rule-4`, `ci-conformance-json`, `eval-bootstrap`, `EmailFirstSignup`), all of which shell out to ESLint and flake under full-suite load; run in isolation they fail identically on both branches. No new failures. Build passes.

**Live verification** at 375×812 and 1280×900 against the seeded database. Sheet is 568px in an 812px viewport (70vh), never full-screen, internally scrollable. Real-keyboard Tab confirms the focus trap wraps both directions, Escape closes and returns focus to the filter icon, and the focus ring paints `outline: 2px solid rgb(15, 171, 142)` at 2px offset. `?distance=1` narrows 16 → 5; `?schedule=recurring` returns the two seeded recurring gatherings; `?category=food&distance=10` → 4 items with two chips and the dot lit; removing both chips returns 16 with no chip row and a bare `/explore`. The bottom stack (controls 663–724, pills 724–768, nav 767–812) shifts by exactly one `--nav-height` when the nav hides, pills taking the bottom edge — T113/T114 behaviour preserved.

**T116 seam.** The mobile List/Map toggle is now the only occupant of `data-testid="bottom-controls"`, a single fixed row; `MOBILE_CONTROLS_HEIGHT` in `ExplorePage.tsx` is the one constant reserving space for it. T116 makes that row inline and deletes both, with no other part of this diff involved. Desktop already renders it inline via `md:static`.
