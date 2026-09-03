# T112: Bottom nav visual refresh — thesis §2 compliance

**Scenario:** `planning/next/scenario-F046-member-scrolls-and-nav-hides.md`
**Status:** Done
**Bundle:** b1
**Depends on:** none

**Serves:**
- **Loop:** 3 (Land here) — the nav bar is the structural backbone of the browse experience; a quieter, tighter nav maximizes content density on every tab.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → any tab surface (no schema change)

## Workflow gates (mandatory during the migration phase)

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit. Verdict Approve; two defects found and fixed pre-commit (stale 64px sticky-CTA offsets; `--nav-height` dropped by `@theme inline`).
- [x] **M3 — `design:accessibility-review`** — PASS (WCAG 2.1 AA). Two fixes applied: tab links stretched to the full 44px bar (were 36.5px); `aria-label="Primary"` added to both nav landmarks.
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration.
- [x] **DEVIATIONS.md entry** appended at ticket close — four deviations (icon spec source, filled-icon technique, scoped tokens, sticky-CTA edits) + the Tailwind-v4 note.

## Acceptance Criteria

- [x] `BottomNav` component height changed from current value to 44px (exclusive of safe-area padding). `env(safe-area-inset-bottom)` padding applied below.
  _Why: thesis §2 (Ratified 2026-09-02) — 44px is the floor that keeps labels legible while maximizing content viewport. Down from 52px._
- [x] Icons: 20px outlined, 1.5px stroke weight. Active icon transitions to filled variant.
  _Why: proportional to the 44px bar height (down from 24px at 52px bar)._
- [x] Labels: 9px/500 (Inter Medium), 3px below icon.
- [x] Active state: icon and label in `--color-charcoal` (#3C3C3C). NOT pistachio.
  _Why: thesis §2 — "charcoal for the active state instead of pistachio: the 'paucity of color' principle." Pistachio is reserved for CTAs and brand moments. Encodes ratified absolute: `design-research-thesis.md:§2 active state`._
- [x] Inactive state: icon and label in `#717171`.
- [x] Top border: 1px `#EBEBEB`.
- [x] Background: white (#FFFFFF), no blur, no transparency.
- [x] Three tabs only: Home, Explore, You. If a fourth tab (Following) still exists from T013, remove it — follows surface lives on `/you/following` per F042.
  _Why: thesis §2 — three-tab nav is the ratified structure._
- [x] Existing scroll-to-top behavior on active-tab re-tap preserved.
- [x] Desktop breakpoint behavior (top nav or hidden bottom nav at ≥768px) preserved.
- [x] BUILD-LOG.md updated.

## Notes

Existing component: `src/components/BottomNav.tsx` (shipped in T013). This ticket is a visual refresh, not a rewrite — update dimensions, icon sizes, and color tokens in place. The lucide-react icon set should have filled variants (or switch to an icon set that supports outlined/filled toggle — lucide supports both via separate imports like `Home` / `HomeIcon`).

Token mapping for Tailwind v4: use `var(--color-charcoal)` syntax (not bare `--color-charcoal`), per T111's Tailwind v4 fix.

The F045 scenario's assumptions section mentions "52px bottom nav" — this is stale; the ratified value is 44px per thesis §2 update 2026-09-02. Build against 44px.

No review exists for F046; PM directed scenario to `next/` without separate review.

## Completion

Date: 2026-09-02
Commit: {pending}
Branch: t112

**Shipped.** `BottomNav` refreshed in place — 44px bar, charcoal #3C3C3C active / #717171 inactive, 20px icons at a uniform 1.5 stroke with the active glyph filled, 9px/500 labels 3px below, 1px #EBEBEB top border, opaque white. Three tabs were already correct from T013; no fourth tab existed to remove. Scroll-to-top re-tap and the `md:hidden` desktop breakpoint are untouched.

**Tokens.** `--color-charcoal`, `--color-nav-inactive`, `--color-nav-border` in `@theme inline`; `--nav-height` in plain `:root` (see the Tailwind-v4 note below).

**Beyond the component.** The sticky mobile CTA strips on `VendorProfilePage` and `BusinessListingPage` were pinned with a hardcoded `calc(64px + env(safe-area-inset-bottom))` to clear the old bar; both now derive from `var(--nav-height)`. Without this the strips would float 20px above the shorter nav. Caught by M2.

**Tailwind v4.** `--nav-height` does not survive inside `@theme inline` — v4 emits only namespaced theme keys, so the variable vanished and the sticky `calc()` computed to `bottom: auto`. Moved to plain `:root`. Neither the unit tests nor the build catch this class of failure; live browser verification did. Same family as T111.

**Verification.** 13 unit assertions in `src/components/BottomNav.test.tsx`, all passing. Full suite: 6 failing files, identical to the pre-change main baseline — none introduced here. Production build compiles. `check:action-layer` clean. ESLint clean on changed files. Computed styles confirmed in a real browser at 375px (bar 44px, targets 44x125, colors, focus ring under keyboard Tab) and the desktop breakpoint at 1024px (bottom nav `none`, top nav `flex`).

**Follow-ups filed.** F046's visual-treatment criterion still carries the retired 24px/10px/4px and 52px numbers — Type A, fix inline at `tidy`. _Resolved 2026-09-03: F046 reconciled to 44px / 20px / 9px / 3px._ Charcoal-ramp migration — Type B, stub at `planning/backlog/decision-charcoal-ramp-migration.md`.
