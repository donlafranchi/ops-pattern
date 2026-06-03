---
id: how-t093-qr-card-lib-and-handler
purpose: Pure QR-card lib (canonical-URL assembly + print-DPI PNG generation) + the item.qr_card.request action handler + registry wiring — the write/generate side of F041.
layer: how
status: open
---

# T093 — QR card lib + `item.qr_card.request` handler

**Scenario:** [F041 — A producer generates a QR card for their item](../../planning/now/scenario-F041-producer-generates-qr-card.md)
**Binds to:** `product/systems/item.md` (Item URL pattern, ADR-20 + ADR-22) · ADR-7 (action-layer-only) · ADR-10 (same-transaction row+event)
**Status:** Open
**Bundle:** b1
**Depends on:** T077/T080 (item handlers + multi-kind) · T079/T083/T085 (item-page resolvers + canonical URL shape) — all shipped. `qrcode` npm dep already present. `item.qr_card_requested` event_kind already in the `item_events` CHECK (015 + 020) — no migration.
**Repo / branch:** web / `t-f041`

## Serves

- F041 AC "Producer requests a QR card on their own Item": handler fires, a PNG generates at print DPI (≥300 DPI @ 4"×4" ⇒ ≥1200px), `item.qr_card_requested` event logs.
- F041 AC "QR resolves to Item's canonical URL": embedded URL is the Item's place-scoped canonical URL (group-filed) or Member-scoped path (individual), per kind segment.
- F041 AC "Works across all Item kinds": kind → URL segment map covers product/service/gathering (and the rest of the kind table).
- F041 AC "Non-owner cannot request": handler is owner-only (AuthorizationError).
- F041 Edge "Item is unpublished / soft-deleted": handler refuses (ConflictError / NotFoundError).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Pure lib — `src/lib/items/qr-card.ts`

- [ ] `memberScopedItemPath({ handle, kind, slug })` → `/m/<handle>/<seg>/<slug>` using `KIND_SEGMENTS` (reuse from `feed/item-url.ts`).
- [ ] `groupScopedItemPath({ placePath, groupSlug, kind, slug })` → `/p/<placePath>/g/<groupSlug>/<seg>/<slug>`.
- [ ] `buildItemSlug(title, itemId)` → `${toSlug(title) || 'item'}-${itemId.slice(0,8)}` (matches the composer's slug mint, T078/T084).
- [ ] `qrCardFilename(kind, slug)` → e.g. `qr-<slug>.png`.
- [ ] `generateQrCardPng(url, opts?)` → `Promise<Buffer>` — wraps `qrcode.toBuffer` at `width: 1200` (4in @ 300 DPI), `margin: 4`, `errorCorrectionLevel: 'M'`. Returns a valid PNG (8-byte PNG signature; IHDR width ≥ 1200).

### Handler — `src/actions/item/qr-card.ts`

- [ ] `itemQrCardRequestInput = z.object({ itemId: z.string().uuid() })`.
- [ ] `itemQrCardRequest(ctx, { itemId })` — inside `withTransaction`:
  - Reject the `'self-bootstrap'` sentinel actingMemberId.
  - Load the item (`member_id, kind, state, deleted_at, title, group_id`); `NotFoundError` if absent or `deleted_at` is set.
  - Owner-only: `item.member_id !== ctx.actingMemberId` → `AuthorizationError`.
  - Refuse non-published: `state !== 'published'` → `ConflictError` (QR cards are for findable Items).
  - Resolve the canonical URL: group-filed → recursive place-path CTE (mirror `you/sell/product/actions.ts` `resolveDestinationUrl`) → `groupScopedItemPath`; fall back to the owner's handle → `memberScopedItemPath` when no group / place unresolved.
  - `generateQrCardPng(absoluteOrRelativeUrl)` — encode the **canonical path** (the route layer makes it absolute against the request origin; storing the path keeps the handler origin-agnostic and testable).
  - `appendEvent('item_events', { item_id, event_kind: 'item.qr_card_requested', payload: { kind, url } })`.
  - Returns `{ itemId, kind, url, pngBase64, filename }`.

### Wiring

- [ ] Barrel export in `src/actions/item/index.ts`.
- [ ] Registry entry `item.qr_card.request` in `src/actions/index.ts`.

### Tests

- [ ] `src/lib/items/qr-card.test.ts` (vitest): path builders for each kind segment; `buildItemSlug` shape + empty-title fallback; `generateQrCardPng` returns a PNG (signature bytes) with IHDR width ≥ 1200; deterministic for same input.
- [ ] `tests/actions-t093.test.ts` (vitest): file-shape + zod (`itemQrCardRequestInput` accepts uuid, rejects non-uuid) + registry surfaces `item.qr_card.request` + source-shape (`AuthorizationError`, `ConflictError`, `event_kind: 'item.qr_card_requested'`). DB-touching behavior verified by the F041 eval (T094) — same split as T077.

### STAGE-LEDGER

- [ ] STAGE-LEDGER F041 row advances to `build` (handler/lib half).

## Notes

- No migration. `item.qr_card_requested` already allow-listed in `item_events_event_kind_check`.
- DPI: `qrcode` writes no physical-DPI PNG chunk; "≥300 DPI @ 4in" is satisfied by a ≥1200px raster printed at 4in. The eval/lib asserts pixel width, the print size is the producer's choice.
- Keep the place-path CTE identical to `resolveDestinationUrl` so group-filed and individual Items mint the same canonical URL the composer redirected to.

## Completion (2026-06-02 — `t-f041`, not merged)

- **Built:** `src/lib/items/qr-card.ts` (+ `absoluteItemUrl` for scanner-openable URLs) · `src/actions/item/qr-card.ts` (`item.qr_card.request`) · barrel + registry. No migration.
- **Tests:** `src/lib/items/qr-card.test.ts` (11) + `tests/actions-t093.test.ts` (10) GREEN. tsc/eslint/`check:action-layer` clean.
- **Gates:** M2 self-review PROCEED. DEVIATIONS filed (abs-URL design; PNG-in-tx + CTE-dup tech-debt flagged for a follow-up ticket).
- Commit `7ce9b89` on `t-f041`.
