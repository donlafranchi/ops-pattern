# T114: Kind-filter pill row on Explore

**Scenario:** `planning/next/scenario-F045-newcomer-filters-explore-via-icon-and-bottom-sheet.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T113

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found) — kind filtering is the primary browse dimension; bottom-anchored pills put the most common filter in the thumb zone.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` materialized view → filtered browse (no schema change)

## Workflow gates (mandatory during the migration phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — yes, this introduces a new interactive component.
- [ ] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Create `<KindFilterPills>` component (e.g. `src/components/explore/KindFilterPills.tsx`). Renders a horizontally scrollable row of pills: `[All] [Events] [Products] [Services] [Ideas] [Offers] [Asks]`. "All" selected by default.
- [ ] Pill row is `position: fixed`, anchored above the bottom nav. Row height: 44px. 1px hairline top border (`#EBEBEB`).
  _Why: thesis §5 — "kind-filter pills anchored at the bottom, above the nav bar." Thumb reachability for a frequent-tap interaction._
- [ ] Selected pill: `var(--color-charcoal-700)` fill (#3C3C3C), white text. Unselected: white fill, 1px `var(--color-charcoal-100)` border, `var(--color-charcoal-900)` text.
- [ ] Tapping a kind pill filters results immediately — no bottom sheet, no confirmation. `items.kind` mapping: Events → `gathering`, Products → `product`, Services → `service`, Ideas → `wonder`, Offers → `offer`, Asks → `ask`. All → no kind filter.
  _Why: kind is the primary browse dimension; it should be instant, not gated behind a sheet._
- [ ] The pill row consumes `navVisible` state from T113's hook/context. When nav is visible: `bottom: calc(44px + env(safe-area-inset-bottom))`. When nav is hidden: `bottom: env(safe-area-inset-bottom)`. Transition matches nav timing (~200ms ease-out).
  _Why: PM ratified 2026-09-02 — pills stay fixed when nav hides. The pills become the new bottom edge._
- [ ] Explore page content area has `padding-bottom` accounting for both pill row and nav bar so content is never occluded.
- [ ] Pill row renders only on Explore (`/explore`), not on Home or You.
- [ ] Accessibility: pills have `role="tablist"` with each pill as `role="tab"`, `aria-selected` reflecting current state.
- [ ] Kind selection state reflected in URL query parameter (e.g. `?kind=gathering`) so the filter composes with secondary filters (T115) and is shareable.
- [ ] If existing dedicated filter buttons (market selector, category, day buttons) are rendered between the search bar and results, remove them. Their functionality moves to the bottom sheet (T115).
  _Why: thesis §5 — three separate filter buttons consume a full row of vertical space between search and results._
- [ ] BUILD-LOG.md updated.

## Notes

The pill row is a separate fixed element from the nav — not a child of `BottomNav`. This structural independence is what makes "pills stay, nav hides" work cleanly: the nav's `translateY` doesn't affect the pills.

The kind-to-label mapping (gathering→Events, wonder→Ideas) follows the naming conventions in CLAUDE.md § Naming conventions. Schema terms in code, UI labels in the component.

If the existing Explore page has top-positioned filter chips or a segmented control for kind, remove them. The pill row replaces that functionality at the bottom.

The "All" pill is at the far left, always visible without scrolling. Additional pills scroll horizontally if needed on narrow viewports.

## Completion

Date:
Commit:
