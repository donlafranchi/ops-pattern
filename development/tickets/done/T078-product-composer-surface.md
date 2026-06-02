---
id: how-t078-product-composer-surface
purpose: Product composer surface — <ProductComposer> on MultiStepComposer + server actions wrapping item.create + wiring the /you/sell "Add a product" button.
layer: how
status: open
---

# T078 — Product composer surface (`<ProductComposer>` + server actions + /you/sell wiring)

**Scenario:** [F038 — A producer lists a product](../../planning/now/scenario-F038-producer-lists-product.md)
**Binds to:** `product/ui/design-language.md` § Component recipes → Multi-step composer · F038 § Surfaces
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T077 (item handlers) · T071 (MultiStepComposer) · T072 (AddEntityDrawer) · T073 (/you/sell index + SellWalkthrough patterns)
**Repo / branch:** web / `t78`

## Serves

- F038 Then-clauses: "Add a product reachable from Group page + /you"; "Composer writes Item + child + Location in one transaction"; "Skip-provenance path".

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new composer surface — MANDATORY per rebuild rule 5).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Server actions — `src/app/you/sell/product/actions.ts`

- [ ] `'use server'`. `createProductAction({ groupId?, title, description, priceCents?, priceUnit?, photoUrls?, locationId?, scheduleKind?, madeAtPlaceId? })` resolves the auth user (same `requireMemberId` pattern as `sell/actions.ts`), builds an ActionContext, calls `item.create` with `publish: true`, and returns `{ itemId, destinationUrl }`.
- [ ] `destinationUrl`: when filed under a Group, resolve `/p/[…place]/g/[group-slug]/p/[item-slug-suffix]` by reusing the place-path resolution from `sell/actions.ts` (group slug + parent_id walk via `place_for_coords`) and appending `/p/<itemSlug>`. When sold as individual (no group), `/m/[handle]/p/<itemSlug>`. Item slug = `toSlug(title)` + short random hex suffix (mirror group draft-slug pattern).
- [ ] Map `ActionError → SellActionError` (reuse the pattern).

### `<ProductComposer>` — `src/components/sell/ProductComposer.tsx`

- [ ] `'use client'`. Built on `<MultiStepComposer>`. `dialogLabel="Add a product"`.
- [ ] Steps:
  1. **Details** — title (required), description (required), price (number or a "Free" toggle → null), price unit (optional, e.g. "loaf"). Validate title + description non-empty.
  2. **Pickup point** — anchor Location picker. Pre-selects the Group's anchor Location when entered from a Group (passed as prop). Uses `<AddEntityDrawer>` for inline-add (mirror SellWalkthrough's anchor step). Required.
  3. **Where is this made?** (`isOptional: true`) — a Place picker stub for `madeAtPlaceId`. **F038 tests the skip path** — the step renders a "Skip this step" link; skipping leaves `madeAtPlaceId` undefined. (Full Place-picker UX + claim is F039.) finalLabel "Publish product".
- [ ] `onComplete` calls `createProductAction`; returns `{ destinationUrl }` so MultiStepComposer's caller redirects.
- [ ] Free product: price empty/“Free” → `priceCents: null`.

### `/you/sell` wiring

- [ ] Replace the disabled "Add a product" `<button>` (T073 stub) in `src/app/you/sell/page.tsx` with a client island that opens `<ProductComposer>` for that Group (passing groupId + anchorLocationId). Keep `data-testid` + `role=button` + the accessible name `/Add a product/i` (eval depends on it — see T073b note).
- [ ] On publish success, client redirects to `destinationUrl`.

### Tests — `src/components/sell/ProductComposer.test.tsx`

- [ ] Renders step 1 with title/description/price inputs.
- [ ] Validation blocks Continue when title or description empty (field-error testids).
- [ ] Skip path: step 3 renders a `role=link` "Skip this step"; skipping reaches the final submit without `madeAtPlaceId`.
- [ ] Free toggle sets price to null in submitted state (assert via a mocked `onComplete`/action spy).
- [ ] `createProductAction` argument shape unit-checked via a spy mock.

### BUILD-LOG

- [ ] BUILD-LOG T078 line.

## Notes

- Mirror `SellWalkthrough.tsx` for the AddEntityDrawer + anchor-Location-picker pattern; the picker may render empty at b1 (no Member↔Location anchor model post T061) — AddEntityDrawer covers the gap (same as T073).
- Photo upload UI is **out of scope** (F038 § Out of Scope) — the column exists; composer accepts a `photoUrls` prop default `[]`, no upload widget at b1.

## Completion

Date: 2026-06-02
Commit: `845e354` (branch `t77`; merge to main pending PM y/n)
Status: Build complete. 8/8 ProductComposer vitest + 106/106 src GREEN; tsc clean on new files; conformance OK. M2 PROCEED. M3 basic (inherits MultiStepComposer dialog a11y — role=dialog/aria-modal/focus-restore/ESC).
Notes: `<ProductComposer>` (Details → Pickup → optional Where-made [SKIP path] → Review/Publish) + `createProductAction` (wraps `item.create` publish=true) + `<AddProductButton>` replacing the T073 inert button on `/you/sell`. Photo-upload UI deferred (F038 Out-of-Scope); made-step is skip-only (F039 lands the Place picker).
