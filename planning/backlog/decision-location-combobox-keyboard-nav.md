---
purpose: Decision stub — whether the address combobox needs full arrow-key/aria-activedescendant navigation now, and an open contrast check.
layer: how
status: draft
---

# Decision: location combobox keyboard pattern + contrast check

**Raised by:** T142 (`development/tickets/done/T142-location-step-address-and-neighbourhood.md`), M3 accessibility pass, logged in `development/DEVIATIONS.md`.

## Item 1 — combobox keyboard pattern

`src/components/locations/LocationPlaceFields.tsx` renders address suggestions as real `<button>` elements inside a `role="listbox"`, individually Tab-reachable — functionally keyboard-accessible, but not the full ARIA 1.2 combobox authoring pattern (no arrow-key navigation between suggestions, no `aria-activedescendant` on the input). `design-language.md` has no combobox recipe yet — this component was built ahead of one, named explicitly in the component's own header comment.

**Not decided:** whether to add the full keyboard pattern now (more work, not yet blocking any known user), or treat this as the first case design-language's eventual combobox recipe should standardize, revisited then.

## Item 2 — contrast check

The mode-toggle links (`text-[var(--color-accent)] underline`) and the address-error text (`text-[var(--color-danger)]`) reuse existing DLS tokens already used elsewhere in the codebase, but their contrast against this specific background was not measured in a live render — no browser was available in the session that built this.

**Not decided:** who verifies this and when. Cheap to check (open the drawer, inspect computed styles) — flagging so it happens before this ships past the dogfood test, not assuming the existing tokens are automatically fine in this context.
