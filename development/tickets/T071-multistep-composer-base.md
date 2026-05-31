---
id: how-t071-multistep-composer-base
purpose: Shared `<MultiStepComposer>` base component, the substrate for F036/F034/F038/F040 composers.
layer: how
status: open
---

# T071: `<MultiStepComposer>` base component

**Scenario:** `planning/scenarios/F036-member-creates-business-group-via-sell-walkthrough.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T070 (lifecycle_state + draft handlers)

**Serves:**
- **Loop:** 9 (Make a living locally) — the Sell walkthrough is the structural enabling step; this ticket is the shared composer infrastructure that makes Loop-9 surfaces (and Loop-4 gathering) ship without forking UI.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Group(kind='business'). No shell entity owns the Group; founder Member is the accountable human.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `test` (run mode).
- [ ] **M3 — `design:accessibility-review`** — yes, new interactive component (keyboard nav, focus management, ARIA on step indicator).
- [ ] **M4 — `engineering:deploy-checklist`** — yes, web bundle.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

- [ ] Component file `web/components/composer/MultiStepComposer.tsx` exporting a generic `<MultiStepComposer>` per `product/ui/design-language.md § Component recipes → Multi-step composer`.
- [ ] Props:
  - `steps: Step[]` — array of step definitions; each step carries `{ id, title, helper?, isOptional?: boolean, render: (state, setState) => ReactNode, validate: (state) => Validation }`.
  - `onAdvance: (stepId, state) => Promise<void>` — fires on each Continue tap; consumer wires this to `group.update_draft` (or the analogous draft-update handler for non-Group composers).
  - `onComplete: (state) => Promise<{ destinationUrl: string }>` — fires on final-step submit; consumer wires this to `group.activate` (or analogous).
  - `onAbandon: () => void` — fires on X tap; consumer is responsible for any toast/copy.
  - `resumeFromStep?: number` — caller passes the last-completed-step index if a draft exists; composer jumps there with prior fields populated.
  - `initialState?: object` — caller hydrates from the draft row.
- [ ] Renders the container per spec: bottom-anchored drawer on mobile (≤768px viewport), modal on desktop. Uses existing `Drawer` / `Modal` primitives if present in `web/components/ui/`; create them if absent (cite as deviation).
  _Why: per ADR-2 + Principle #6, primary controls anchor to the viewport bottom on mobile so they're thumb-reachable._
- [ ] Step indicator: horizontal dots row with "Step k of N" counter. Completed dots are clickable (jump back); upcoming dots inert. ARIA: `role="progressbar"` with `aria-valuenow` / `aria-valuemax`.
- [ ] Navigation row: `[← Back]` (text link, hidden on step 1) / `[Skip this step]` (text link, shown only when current step `isOptional === true`) / `[Continue]` (Button — primary, right). Final-step primary CTA label comes from `steps[N-1].finalLabel` prop on the step itself (e.g., "Create my shop").
- [ ] Tap-outside-to-dismiss disabled. X button (top-right) calls `onAbandon`.
  _Why: composer is in edit-against-half-built-thing mode; "lose your changes" framing is wrong because the substrate already holds the work._
- [ ] Validation: field-level on blur (responsibility of step's `render` function), step-level on Continue tap (composer calls `step.validate(state)`; if errors, blocks advance + surfaces inline below failing fields per the step's render — composer does not render top-of-form summary).
- [ ] Loading-on-submit: Continue button shows spinner + stays disabled during `onAdvance` / `onComplete` await; other navigation disables for the duration.
- [ ] Submit-error: inline error in `--color-danger` below navigation row; navigation re-enables; state preserved.
- [ ] Storybook / dev page at `web/app/(dev)/composer-demo/page.tsx` exercising a 3-step demo composer to verify the recipe in isolation.
- [ ] Unit tests (Vitest): step advance, step back, skip optional step, validation block, resume from step k, abandon callback fires.
- [ ] BUILD-LOG.md updated.

## Notes

- This is the canonical multi-step composer. F034 (gathering), F038 (product), F040 (service) will consume it. Do not inline composer logic into any kind-specific wrapper.
- The composer is presentational + control-flow only; persistence is the consumer's responsibility (via `onAdvance` / `onComplete` callbacks). This is what lets the same component back four different entity types.
- Animation: slide-up on open, slide-down on dismiss. Use existing motion tokens (`--motion-snap` for transitions per DLS § Motion).
- Accessibility: focus traps to the drawer/modal when open; focus restores to the originating CTA on dismiss. Step-indicator dots are buttons (keyboard-navigable). Form fields chain in DOM order; Continue / Back are last in tab order.
- If `Drawer` / `Modal` primitives don't yet exist in `web/components/ui/`, create thin wrappers using existing motion + overlay tokens; flag as deviation (a future ticket can promote them to first-class DLS recipes).

## Completion

Date: {YYYY-MM-DD}
Commit: {git hash}
