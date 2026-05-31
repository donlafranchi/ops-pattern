---
id: how-t072-add-entity-drawer-sub-flow
purpose: Shared `<AddEntityDrawer>` secondary-drawer sub-flow for picker steps inside composers.
layer: how
status: complete
---

# T072: `<AddEntityDrawer>` secondary-drawer sub-flow

**Scenario:** `planning/scenarios/F036-member-creates-business-group-via-sell-walkthrough.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T071 (MultiStepComposer base)

**Serves:**
- **Loop:** 9 (Make a living locally) — anchor-Location step in F036 needs this; future composers reuse for any inline entity creation.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** generic — Person → Location (or other referenced entity).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `test` (run mode).
- [ ] **M3 — `design:accessibility-review`** — yes, stacked-drawer focus management is the load-bearing concern.
- [ ] **M4 — `engineering:deploy-checklist`** — yes, web bundle.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Component file `web/components/composer/AddEntityDrawer.tsx` exporting `<AddEntityDrawer>` per `product/ui/design-language.md § Surface patterns → Add new entity inside a composer`.
- [ ] Props:
  - `title: string` — e.g., "Add a Location".
  - `render: (state, setState) => ReactNode` — single-form body.
  - `validate: (state) => Validation`.
  - `onSave: (state) => Promise<{ id: string }>` — consumer wires this to the entity's create handler (e.g., `location.create`); returns the new entity's id.
  - `onCancel: () => void`.
  - `onSaved: (newEntityId: string) => void` — called after `onSave` resolves; consumer uses this to pre-select the new entity in the parent picker step.
- [ ] Renders as a secondary drawer/modal stacked over the parent composer: parent stays mounted at `-8px` vertical offset and 60% opacity per the DLS spec.
  _Why: signals "paused, not gone" so the Member doesn't think they lost the parent flow's state._
- [ ] Header: `title` in the 22px / 600 slot. No step indicator (this is a single-form sub-flow, not multi-step).
- [ ] Navigation row: `[Cancel]` (text link, left) · `[Add and select]` (Button — primary, right). No Skip; no Continue.
- [ ] On Save primary tap: validates → calls `onSave` (await) → calls `onSaved(newEntityId)` → dismisses the secondary drawer. Parent composer remains on the same step; selection updates.
- [ ] On Cancel: dismisses secondary drawer, no side effects.
- [ ] **Refuse to nest deeper.** Component checks via React context whether it's already mounted inside another `<AddEntityDrawer>`; if yes, throws a dev-time error ("Cannot nest AddEntityDrawer; escalate the entity model instead per design-language.md § Add new entity inside a composer").
  _Why: stacked drawers beyond two deep are the smell the design pattern explicitly refuses; surfacing the violation at runtime catches accidental nesting in code review._
- [ ] Focus management: focus traps to the secondary drawer when open; on dismiss, focus restores to the parent composer's picker input (not the originating result-list row — the picker is the resumable surface).
- [ ] Storybook / dev page at `web/app/(dev)/add-entity-demo/page.tsx` demonstrating the pattern with a stub "Add a Location" sub-flow.
- [ ] Unit tests (Vitest): save flow updates parent state, cancel flow leaves parent state untouched, nesting throws.
- [ ] BUILD-LOG.md updated.

## Notes

- First production user: the anchor-Location step in `<SellWalkthrough>` (T073). The picker step there renders existing Locations the Member has authored + a "+ Add a new Location" row at the bottom; tapping opens this drawer.
- Reusable wherever a composer step needs inline entity creation. Do not fork; extend if a new use case needs additional capability.
- The "+ Add new" row in the parent picker is the *parent composer's* responsibility, not this component's — this component is just the drawer that opens after the row is tapped. The parent picker decides where to put the row (always at the bottom of the result list per DLS — never at the top).

## Completion

Date: 2026-05-31
Commit: 3276666 (merged to main as 08d7667)
Branch: t072 (worktree removed at close)

**Files landed:**
- `web/src/components/composer/AddEntityDrawer.tsx` (new — secondary-drawer sub-flow per the DLS pattern)
- `web/src/components/composer/AddEntityDrawer.test.tsx` (new — 10 vitest specs)
- `web/src/app/(dev)/add-entity-demo/page.tsx` (new — dev-route verification at `/add-entity-demo`, auto-gated by T071a's `(dev)/layout.tsx`)
- `web/BUILD-LOG.md` (entry added in a follow-up commit `75ca692`)

**Verification:**
- `npm test -- src/components/composer/AddEntityDrawer.test.tsx` → 10/10 GREEN.
- `npx tsc --noEmit` → no new errors in T072 files.
- `npx eslint` on touched files → clean.
- `npm run check:action-layer` → OK (161 files scanned; no violations).

**M2 — `engineering:code-review`:** self-review pre-commit; verdict PROCEED after one a11y addition: `role="alert"` + `aria-live="assertive"` on the submit-error region (was missing).

**M3 — `design:accessibility-review`:** scoped to the secondary-drawer surface. Implemented: `role="dialog"` + `aria-modal` + `aria-labelledby` title; ESC dismisses; tap-outside-to-dismiss OFF; X-button labeled "Close"; submit error is an alert-live region; focus restored to opener on unmount. Full focus-trap and the DLS-specified parent-pause styling (-8px offset + 60% opacity) deferred — see DEVIATIONS.

**M4 — `engineering:deploy-checklist`:** Pure additive web bundle. No DB, no env vars, no breaking changes. `/add-entity-demo` is auto-gated by T071a's `(dev)/layout.tsx`. Standard staging-verify-then-prod path.

**DEVIATIONS:** 2 entries logged (parent-pause -8px/60% styling deferred — requires a parent↔drawer coupling decision; full focus-trap deferred per the shared a11y follow-up flagged in T071).

**Not in scope (handled elsewhere):**
- Parent composer's "paused" visual appearance (-8px offset + 60% opacity) per the DLS spec — defer pending a decision on whether the parent reads a context flag or the drawer reaches up.
- Full focus-trap (Tab/Shift+Tab cycling within the drawer) — covered in the same future a11y ticket that T071 flagged.
