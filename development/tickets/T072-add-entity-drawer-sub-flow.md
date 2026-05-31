---
id: how-t072-add-entity-drawer-sub-flow
purpose: Shared `<AddEntityDrawer>` secondary-drawer sub-flow for picker steps inside composers.
layer: how
status: open
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

Date: {YYYY-MM-DD}
Commit: {git hash}
