# T100: Locally Made claim lifecycle — handlers, composer picker, owner widget (F039 write surface)

**Scenario:** `planning/now/scenario-F039-maya-claims-locally-made.md`
**Status:** Open
**Bundle:** b1 (sub-bundle b1.4 — Find & follow)
**Depends on:** T099 (proximity + read path), T077 (item action-handler spine), T078 (product composer).

**Serves:** F039 beats 1 (composer pick) + 5 (owner edit lifecycle). Loop 7, Loop 9.

## Scope

The write path for the made-at Place claim — set on create, and set/edit/remove post-create.

1. **Handlers (`src/actions/item/set-made-at.ts`)** — two item-owner-only handlers over T064's column, registered in `src/actions/index.ts`:
   - `itemMadeAtSet(ctx, { itemId, placeId })` — guards the Item is the acting member's `kind='product'` (the `items_made_at_only_on_products` CHECK backs this), updates `made_at_place_id`, emits `item.made_at_set` in the same transaction. Non-owner → `AuthorizationError`; missing → `NotFoundError`.
   - `itemMadeAtRemove(ctx, { itemId })` — sets `made_at_place_id = null`, emits `item.made_at_removed`. Idempotent (already-null → no event).

2. **Place lookup (`src/lib/places/list-places.ts`)** — `listSelectablePlaces(supabase)` returns `{ id, displayName, kind, pathLabel }[]` for non-deleted `places` (the typeahead source). `pathLabel` is the display_name with its parent chain for disambiguation ("Oak Park · Sacramento, CA"). Public-read RLS covers it.

3. **Server actions (`src/app/p/[...slug]/made-at-actions.ts`, `'use server'`)** — `setMadeAtAction({ itemId, placeId })` / `removeMadeAtAction({ itemId })`, thin wrappers over the handlers mirroring `claim-actions.ts` (resolve auth user → ActionContext → handler → map `ActionError`).

4. **Composer step 3 (`src/components/sell/ProductComposer.tsx`)** — replace the F038 skip-path placeholder with a real **Place typeahead**: a filter input (`data-testid="made-place-search"`) over `selectablePlaces` (passed as a prop from the composer host) + a listbox of options (`data-testid="made-place-option-{id}"`). Selecting sets `state.madeAtPlaceId`; the step stays optional (skippable → null, unchanged F038 behavior). The host (`src/app/you/sell/product/*`) passes `selectablePlaces` from `listSelectablePlaces`.

5. **Owner widget (`src/components/item/LocallyMadeClaim.tsx`, `'use client'`)** — owner-only management surface on the product page, mirroring `LocallyOwnedClaim`. Props `{ itemId, claim: { placeId, placeName } | …, selectablePlaces, onSet, onRemove }`. States:
   - **Empty** (`placeName === null`): "Claim where this is made to show the Locally Made badge." + `data-testid="made-claim-add"` revealing the typeahead + `data-testid="made-claim-submit"`.
   - **Claimed**: "Made in {placeName}." + `data-testid="made-claim-edit"` + `data-testid="made-claim-remove"` (→ `data-testid="made-claim-remove-confirm"`).
   - After a successful action: `router.refresh()` so the public "Made in" line + badge re-render.
   `ProductPublicPage` renders `<LocallyMadeClaim>` in an owner-only section only when `isOwner` (defense-in-depth — the handler authorizes too).

## Acceptance Criteria

- [ ] **Beat 1 (handler).** `itemMadeAtSet` writes `made_at_place_id` + emits `item.made_at_set` for the owner; non-owner throws `AuthorizationError`. Covered by the F039 eval (live DB) + composer vitest (the made step passes `madeAtPlaceId` to `createProduct`).
- [ ] **Beat 5 (edit).** Owner sets → edits → removes via the widget; the public page re-renders the "Made in" line + badge accordingly.
- [ ] **Owner-gating.** Widget absent for non-owner / anon (the `isOwner` gate).
- [ ] **Skip path preserved.** Composer step 3 skippable → `madeAtPlaceId` null (no regression to F038).
- [ ] **Remove idempotent.** Removing an already-null claim is a no-op (no event).
- [ ] **Tests.** Vitest: handler input schema + `LocallyMadeClaim` render states + `ProductComposer` made-step selection.
- [ ] **a11y (M3).** Widget passes `design:accessibility-review` — typeahead label, listbox roles, `role="status"` feedback.
- [ ] **DLS.** `.btn-primary` / `.btn-secondary` recipes; no hardcoded tokens.
- [ ] **M2** `engineering:code-review` before commit. **DEVIATIONS** entry at close.

## Notes

- Event-kind naming: the scenario says "emits `item.updated`"; T064 added the more-specific `item.made_at_set` / `item.made_at_removed` kinds. We emit the specific kinds (still satisfies the same-transaction row+event invariant). Noted in DEVIATIONS.
- `made_at_verification_source` stays `'self_attested'` is NOT set here — b1 is Tier 0; the column default `'none'` is untouched. (Community/document attestation is b2+.)  The badge derives from proximity, not the verification source.

## Completion

- **Status:** Build complete on branch `t-f039` (web), **not merged**.
- **Date:** 2026-06-04
- **Verification:** F039 eval 6/6 GREEN; F037+F038+F035 14/14 GREEN; 288/288 src unit GREEN; action-layer conformance OK. M2 Approve.
- **Deviations:** `development/deviations/T100.md`.
