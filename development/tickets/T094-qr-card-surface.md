---
id: how-t094-qr-card-surface
purpose: Server-action wrapper + owner-only "Get a QR card" button wired into the product/service/gathering Item pages + the F041 Playwright eval — the surface side of F041.
layer: how
status: open
---

# T094 — QR card surface ("Get a QR card" button) + eval

**Scenario:** [F041 — A producer generates a QR card for their item](../../planning/now/scenario-F041-producer-generates-qr-card.md)
**Binds to:** `product/ui/design-language.md` (`.btn-secondary`) · F041 § Surfaces
**Status:** Open
**Bundle:** b1
**Depends on:** T093 (lib + handler) · T079/T083/T085 (item pages — product/service/gathering)
**Repo / branch:** web / `t-f041`

## Serves

- F041 AC "Producer requests a QR card on their own Item": owner taps "Get a QR card" → PNG downloads.
- F041 AC "Non-owner cannot request": affordance hidden to non-owners and anonymous viewers.
- F041 AC "Works across all Item kinds": button present on product, service, and gathering pages.
- F041 Edge "PNG generation fails": error toast/state + retriable button.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new component — `QrCardButton`).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Ownership helper — `src/lib/items/is-item-owner.ts`

- [ ] `isItemOwner(supabase, itemId, userId | null)` → `Promise<boolean>` — `select 1 from items where id=$1 and member_id=$2 and deleted_at is null` via the session client. `false` for anon. (members.id === auth uid, per T078.)

### Server action — `src/app/m/[handle]/qr-actions.ts`

- [ ] `'use server'`. `requestQrCardAction({ itemId })`:
  - Resolve the auth'd user (`createClient().auth.getUser()`); throw "You must be signed in." if anon.
  - `resolveActionContext({ actingMemberId })` → invoke `item.qr_card.request` handler; map `ActionError` → `throw new Error(err.message)`.
  - Returns `{ pngBase64, filename, url }`.

### Client component — `src/components/item/QrCardButton.tsx`

- [ ] `'use client'`, `data-testid="qr-card-button"`, `.btn-secondary`, QR/printer icon, label "Get a QR card", `aria-label`.
- [ ] On click: call `requestQrCardAction({ itemId })`; on success build a `data:image/png;base64,…` href on a hidden `<a download={filename}>` and trigger `.click()` (browser download). Show a transient "Generating…" busy state.
- [ ] On error: render an inline error message + leave the button retriable.

### Page wiring (owner-only)

- [ ] Product page (`m/[handle]/p/[slug]/page.tsx`): resolve `isOwner`; pass `isOwner` + `itemId` to `ProductPublicPage`; render `<QrCardButton>` only when `isOwner`.
- [ ] Service page (`…/s/[slug]`): same, via `ServicePublicPage`.
- [ ] Gathering page (`…/e/[slug]`): same, via `GatheringPublicPage` (alongside the existing share link).

### Eval — `evals/features/F041-producer-generates-qr-card.spec.ts`

- [ ] Seed (reuse F038/F040 fixtures or a small F041 fixture): a published product owned by the seller, signed-in owner vs. anon/non-owner.
- [ ] Beat — owner sees the button: signed-in owner loads their published product page → `qr-card-button` visible.
- [ ] Beat — non-owner/anon does NOT: anonymous load of the same page → `qr-card-button` count 0.
- [ ] Beat — clicking downloads a PNG: owner clicks → `page.waitForEvent('download')` resolves; suggested filename ends `.png`; saved file starts with the PNG signature bytes.
- [ ] Beat — works across kinds: button present on a published service (and/or gathering) owned by the same seller.

### STAGE-LEDGER

- [ ] STAGE-LEDGER F041 row advances to `build` (surface half) → `eval` on green.

## Notes

- The button encodes nothing client-side — generation is server-side via the handler (credential boundary + event log stay server-side).
- Download mechanism: data-URI anchor avoids a route handler (keeps Rule-2 surface area at zero) and works headless in Playwright (`waitForEvent('download')`).
- Post-create composer affordance (F041 AC "Post-create composer affordance") is satisfied transitively: composers already redirect to the Item page where the owner sees the button. A dedicated post-create CTA is deferred unless the eval/PM asks for it (avoid gold-plating).

## Completion (2026-06-02 — `t-f041`, not merged)

- **Built:** `src/lib/items/is-item-owner.ts` (+ test) · `src/app/m/[handle]/qr-actions.ts` · `src/components/item/QrCardButton.tsx` · owner-only wiring into product/service/gathering pages (member-scoped `/m/[handle]/{p,s,e}` + place-scoped `/p/[...slug]`).
- **Eval:** `evals/features/F041-…spec.ts` **4/4 GREEN** (owner sees button on product + service; anon does not; click downloads a valid PNG). 17/17 F038+F040+F034 regression evals still GREEN.
- **Gates:** M2 + M3 self-review PROCEED. DEVIATIONS filed (post-create CTA satisfied transitively).
- Commit `7ce9b89` on `t-f041`.
