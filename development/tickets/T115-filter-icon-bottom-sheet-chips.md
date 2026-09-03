# T115: Filter icon, bottom sheet, and active-filter chips on Explore

**Scenario:** `planning/next/scenario-F045-newcomer-filters-explore-via-icon-and-bottom-sheet.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T114

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found) — secondary filters let the newcomer narrow from "what's nearby" to "what's nearby this weekend" without leaving the browse surface.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` materialized view → filtered browse (no schema change)

## Workflow gates (mandatory during the migration phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — yes, this introduces a bottom sheet dialog and interactive chip controls.
- [ ] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Sticky search bar at top of Explore: location pill (left), search icon (center-right), filter icon (right). The filter icon is a three-slider glyph.
  _Why: thesis §5 — "one row, three elements: location pill, search icon, filter button." Compact header maximizes content area._
- [ ] Filter icon: when secondary filters (distance, schedule, category, sort) are active, a small dot indicator appears on the icon.
  _Why: the search bar is sticky, so the dot is always visible — the member knows filters are applied even when the chip row scrolls out of view._
- [ ] Tapping the filter icon opens a bottom sheet (`<ExploreFilterSheet>` or similar). Half-screen height by default, scrollable internally, never full-screen.
- [ ] Bottom sheet contains: distance selector (1 / 5 / 10 / 25 mi), schedule filter (any / this week / this weekend / recurring), category multi-select, sort order. "Show results" button at sheet bottom. "Clear all" link visible when any filter is set.
  _Why: kind filtering is handled by the always-visible pills (T114). The sheet holds the less-frequent secondary filters. This two-layer approach reduces the sheet's cognitive load._
- [ ] Tapping "Show results" dismisses the sheet and applies selected filters. Results update.
- [ ] Active secondary filters render as removable chips below the sticky search bar, one per active filter, each with ✕ to dismiss. Kind selection is NOT shown as a chip — its state is visible in the bottom pills.
  _Why: chips provide at-a-glance filter state for secondary filters. Kind doesn't need a chip because the pills show it._
- [ ] When all chips are removed (or "Clear all" tapped), the chip row disappears entirely — no empty row.
  _Why: zero-filter state = zero chrome. Maximum content density._
- [ ] Many active secondary filters: chip row wraps to a second line if needed (no horizontal scroll on chips).
- [ ] Filter state (kind + secondary) persists in URL query parameters. Navigating to a URL with filter params restores the filter state.
  _Why: community-platform.md § Explore T1 — "filter state reflected in URL for shareable views."_
- [ ] Back navigation from an Item page restores previous filter state (kind pill + secondary filters) and scroll position.
  _Why: community-platform.md § Explore T1 — "Back navigation restores scroll and filter state."_
- [ ] Accessibility: filter icon has `aria-label="Open filters"`; bottom sheet is a dialog with focus trap; chips have `aria-label="Remove [filter name] filter"`.
- [ ] Desktop viewport: filter icon stays in search bar; bottom sheet becomes a dropdown panel (or remains a sheet — build agent's discretion on the proportionate approach). Kind pills may render below the search row instead of at the bottom.
- [ ] BUILD-LOG.md updated.

## Notes

The four filter types already exist per community-platform.md § Explore T1 (kind, category, distance, schedule). This ticket restructures WHERE they live, not what they filter. Existing filter query logic should be reused.

The bottom sheet can use a library like `vaul` (Drawer component for React) or be hand-rolled with a fixed-position overlay + `transform: translateY` + touch-to-dismiss. Keep it simple — the sheet is a container, not a feature.

The search bar is top-anchored and sticky (thesis §5). If the existing Explore page has a different search bar layout, reshape it to match the thesis wireframe. The location pill may already exist from prior Explore work (T015/T016).

The F045 scenario's assumptions say "The bottom nav is 52px tall" — this is stale. The ratified value is 44px (thesis §2, 2026-09-02). T112 corrects the nav; T114 anchors pills above it at 44px. Build against the corrected value.

## Completion

Date:
Commit:
