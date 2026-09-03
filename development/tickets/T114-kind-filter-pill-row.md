# T114: Kind-filter pill row on Explore

**Scenario:** `planning/next/scenario-F045-newcomer-filters-explore-via-icon-and-bottom-sheet.md`
**Status:** Done
**Bundle:** b1
**Depends on:** T113

**Serves:**
- **Loop:** 3 (Land here), 7 (Make and be found) — kind filtering is the primary browse dimension; bottom-anchored pills put the most common filter in the thumb zone.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → `discoverable_items` materialized view → filtered browse (no schema change)

## Workflow gates (mandatory during the migration phase)

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit. Four fixes applied pre-commit (focus follows arrow-key selection; selected pill scrolls into view; row height single-sourced from `KIND_PILL_ROW_HEIGHT`; padding constant documented).
- [x] **M3 — `design:accessibility-review`** — PASS (WCAG 2.1 AA). One fix applied during the audit: `::before` grows each 32px pill's hit area to the full 44px row. Two minor findings accepted — see DEVIATIONS.
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration, no schema, no env change.
- [x] **DEVIATIONS.md entry** appended at ticket close — four entries; one escalated to PM (Explore is still vendor-backed), three accepted-as-is.

## Acceptance Criteria

- [x] Create `<KindFilterPills>` component (e.g. `src/components/explore/KindFilterPills.tsx`). Renders a horizontally scrollable row of pills: `[All] [Events] [Products] [Services] [Ideas] [Offers] [Asks]`. "All" selected by default.
- [x] Pill row is `position: fixed`, anchored above the bottom nav. Row height: 44px. 1px hairline top border (`var(--color-charcoal-100)` / `#E8E8E8` — the thesis §3 ramp value, not the legacy `#EBEBEB` this line first named; see DEVIATIONS § T114 What (4)).
  _Why: thesis §5 — "kind-filter pills anchored at the bottom, above the nav bar." Thumb reachability for a frequent-tap interaction._
- [x] Selected pill: `var(--color-charcoal-700)` fill (#3C3C3C), white text. Unselected: white fill, 1px `var(--color-charcoal-100)` border, `var(--color-charcoal-900)` text.
- [~] Tapping a kind pill filters results immediately — no bottom sheet, no confirmation. `items.kind` mapping: Events → `gathering`, Products → `product`, Services → `service`, Ideas → `wonder`, Offers → `offer`, Asks → `ask`. All → no kind filter.
  _Why: kind is the primary browse dimension; it should be instant, not gated behind a sheet._
- [x] The pill row consumes `navVisible` state from T113's hook/context. When nav is visible: `bottom: calc(44px + env(safe-area-inset-bottom))`. When nav is hidden: `bottom: env(safe-area-inset-bottom)`. Transition matches nav timing (~200ms ease-out).
  _Why: PM ratified 2026-09-02 — pills stay fixed when nav hides. The pills become the new bottom edge._
- [x] Explore page content area has `padding-bottom` accounting for both pill row and nav bar so content is never occluded.
- [x] Pill row renders only on Explore (`/explore`), not on Home or You.
- [x] Accessibility: pills have `role="tablist"` with each pill as `role="tab"`, `aria-selected` reflecting current state.
- [x] Kind selection state reflected in URL query parameter (e.g. `?kind=gathering`) so the filter composes with secondary filters (T115) and is shareable.
- [~] If existing dedicated filter buttons (market selector, category, day buttons) are rendered between the search bar and results, remove them. Their functionality moves to the bottom sheet (T115).
  _Why: thesis §5 — three separate filter buttons consume a full row of vertical space between search and results._
- [x] BUILD-LOG.md updated.

## Notes

The pill row is a separate fixed element from the nav — not a child of `BottomNav`. This structural independence is what makes "pills stay, nav hides" work cleanly: the nav's `translateY` doesn't affect the pills.

The kind-to-label mapping (gathering→Events, wonder→Ideas) follows the naming conventions in CLAUDE.md § Naming conventions. Schema terms in code, UI labels in the component.

If the existing Explore page has top-positioned filter chips or a segmented control for kind, remove them. The pill row replaces that functionality at the bottom.

The "All" pill is at the far left, always visible without scrolling. Additional pills scroll horizontally if needed on narrow viewports.

## Completion

Date: 2026-09-02
Commit: `d176b4a` (merge `fe63bb9`)
Branch: `t114` (merged to `main`)

**Shipped.** `KindFilterPills` — a fixed 44px tablist of seven pills anchored to the safe area and lifted one `--nav-height` while the nav is on screen, structurally independent of `BottomNav` so the nav slides out from beneath it. Vocabulary in `src/lib/explore/kinds.ts` (schema terms in code, UI labels per the naming conventions; unknown `?kind=` falls back to All). URL serialization extracted to `src/lib/explore/query.ts`. Charcoal ramp steps in use added to `globals.css`. The mobile market/category/day chip row is removed; the remaining control cluster stacks above the pills and rides the same shift.

**Live verification** at mobile 375x812. Nav visible: controls 625–768, pills 724–768, nav 768–812. Nav hidden: pills take the bottom edge at 768–812. Tapping Events writes `?kind=gathering`; loading `?kind=ask` restores the selection and scrolls the pill into view; the tabpanel's `aria-labelledby` tracks the selected tab.

**Two criteria partial (`~`), both escalated in DEVIATIONS.**
- *Instant filtering* — the component, `?kind=` state, and filter seam ship, but `/explore` still lists vendors (`businesses`), which carry no `items.kind`, so non-All kinds resolve to zero rows and show the existing empty state. Making Explore items-backed is a Type B decision with no ticket; T115 and T116 both assume that surface exists.
- *Removing the dedicated filter buttons* — done on mobile, where the pills replace them. Desktop keeps its chips until T115 lands the dropdown panel; removing them now would leave desktop with no filters at all.

**Tests:** 25 green — `KindFilterPills.test.tsx` (15), `kinds.test.ts` (5), `query.test.ts` (5). Lint clean on every touched file (one pre-existing unused-import warning untouched); production build passes. Full suite matches the `main` baseline: the same script-shelling suites flake under parallel load, and `EmailFirstSignup` T090 plus one `ci-conformance-json` assertion fail identically on `main`.
