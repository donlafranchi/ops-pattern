# T112: Bottom nav visual refresh — thesis §2 compliance

**Scenario:** `planning/next/scenario-F046-member-scrolls-and-nav-hides.md`
**Status:** Open
**Bundle:** b1
**Depends on:** none

**Serves:**
- **Loop:** 3 (Land here) — the nav bar is the structural backbone of the browse experience; a quieter, tighter nav maximizes content density on every tab.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → any tab surface (no schema change)

## Workflow gates (mandatory during the migration phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — yes, this modifies the primary navigation component.
- [ ] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] `BottomNav` component height changed from current value to 44px (exclusive of safe-area padding). `env(safe-area-inset-bottom)` padding applied below.
  _Why: thesis §2 (Ratified 2026-09-02) — 44px is the floor that keeps labels legible while maximizing content viewport. Down from 52px._
- [ ] Icons: 20px outlined, 1.5px stroke weight. Active icon transitions to filled variant.
  _Why: proportional to the 44px bar height (down from 24px at 52px bar)._
- [ ] Labels: 9px/500 (Inter Medium), 3px below icon.
- [ ] Active state: icon and label in `--color-charcoal` (#3C3C3C). NOT pistachio.
  _Why: thesis §2 — "charcoal for the active state instead of pistachio: the 'paucity of color' principle." Pistachio is reserved for CTAs and brand moments. Encodes ratified absolute: `design-research-thesis.md:§2 active state`._
- [ ] Inactive state: icon and label in `#717171`.
- [ ] Top border: 1px `#EBEBEB`.
- [ ] Background: white (#FFFFFF), no blur, no transparency.
- [ ] Three tabs only: Home, Explore, You. If a fourth tab (Following) still exists from T013, remove it — follows surface lives on `/you/following` per F042.
  _Why: thesis §2 — three-tab nav is the ratified structure._
- [ ] Existing scroll-to-top behavior on active-tab re-tap preserved.
- [ ] Desktop breakpoint behavior (top nav or hidden bottom nav at ≥768px) preserved.
- [ ] BUILD-LOG.md updated.

## Notes

Existing component: `src/components/BottomNav.tsx` (shipped in T013). This ticket is a visual refresh, not a rewrite — update dimensions, icon sizes, and color tokens in place. The lucide-react icon set should have filled variants (or switch to an icon set that supports outlined/filled toggle — lucide supports both via separate imports like `Home` / `HomeIcon`).

Token mapping for Tailwind v4: use `var(--color-charcoal)` syntax (not bare `--color-charcoal`), per T111's Tailwind v4 fix.

The F045 scenario's assumptions section mentions "52px bottom nav" — this is stale; the ratified value is 44px per thesis §2 update 2026-09-02. Build against 44px.

No review exists for F046; PM directed scenario to `next/` without separate review.

## Completion

Date:
Commit:
