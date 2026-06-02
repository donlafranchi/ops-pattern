---
id: how-t079-product-item-page
purpose: Public product Item page — dispatch in the /p catch-all for /g/<group>/p/<item> + the /m/<handle>/p/<item> individual path + resolver + ProductPublicPage component.
layer: how
status: open
---

# T079 — Public product Item page

**Scenario:** [F038 — A producer lists a product](../../planning/now/scenario-F038-producer-lists-product.md)
**Binds to:** `product/systems/item.md` · ADR-20 (place-scoped URLs) · ADR-22 · CLAUDE.md § Naming conventions (Item URL column)
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T077 (handlers write the rows) · T060 (place catch-all + resolve-path) · T074 (resolve-shop split pattern)
**Repo / branch:** web / `t79`

## Serves

- F038 Then-clauses: "Item URL follows place-scoped + random-suffix pattern"; "Item page shows brand resolve-up + owner"; "Skip-provenance path" (no Locally Made badge when made_at null).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** (new public page — MANDATORY).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Resolver — `src/lib/items/resolve-product.ts`

- [ ] `splitItemSlug(segments)` — extends the T074 `g`-split: returns `{ placeSegments, groupSlug, itemSlug }` when the catch-all path is `…/g/<group>/p/<item>`; returns null otherwise. (A bare `…/g/<group>` with no `/p/` stays the Shop page.)
- [ ] `resolveProduct(supabase, { groupSlug?, handle?, itemSlug })` → resolves the published `items` row (kind='product', state='published', deleted_at null) by matching slug-suffix, joining `item_products`, the owner Member (handle, display_name), the Group's `group_businesses.display_name` (brand_label) when filed, the pickup `item_locations`→`locations` (label + geography for the map pin), and `made_at_place_id`. Returns null → 404. RLS (items_select_published) is the visibility gate.
- [ ] Returns `{ itemId, title, description, priceCents, priceUnit, photoUrls, brandLabel, groupSlug, owner:{handle,displayName}, pickup:{label, lat, lon} | null, madeAtPlaceId }`.

### Dispatch — `src/app/p/[...slug]/page.tsx`

- [ ] Before the existing `splitGroupSlug` Shop branch, check `splitItemSlug`; when it matches, resolve the product and render `<ProductPublicPage>`; null → `notFound()`. (Folded into the catch-all per the T060 Next.js constraint.)
- [ ] `generateMetadata` mirrors: product title + brand in `<title>`.

### Individual path — `src/app/m/[handle]/p/[slug]/page.tsx`

- [ ] New route. Resolves a product sold as individual (no group) by `handle` + `itemSlug`; renders `<ProductPublicPage>`; null → `notFound()`.

### `<ProductPublicPage>` — `src/components/item/ProductPublicPage.tsx`

- [ ] Renders title, description, price (or "Free" when priceCents null), photo (if any), pickup point with a map pin (reuse the map component pattern; static marker OK at b1), brand label linking to the Group page (when filed), owner display name linking to `/m/<handle>`.
- [ ] **No Locally Made badge** when `madeAtPlaceId` is null (F038 skip-path). The badge render-path is present but data-gated (mirror `resolveLocalOwnerBadge` seam) — F039 lands the claim.
- [ ] `data-testid` on title, price, brand-link, owner-link, pickup, and the (absent) made-badge slot.

### Tests

- [ ] `src/lib/items/resolve-product.test.ts` — `splitItemSlug` returns the item split for `…/g/<g>/p/<i>`, null for bare `…/g/<g>` and bare place paths; `resolveProduct` maps a mocked Supabase row to the result shape (free product → priceCents null; no group → brandLabel null).
- [ ] `src/components/item/ProductPublicPage.test.tsx` — renders title/price/brand/owner; "Free" when null price; no made-badge when madeAtPlaceId null; brand link points at the Group, owner link at `/m/<handle>`.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T079 line. STAGE-LEDGER F038 row → `eval` after merge (Playwright eval verifies end-to-end).

## Notes

- Item slug-suffix matching: the composer (T078) builds `toSlug(title)-<hex>`. The resolver matches the full stored slug; store the item slug on the row (see T077/T078 — item slug is derived in the server action and used in the URL; if not persisted on `items`, resolve by the suffix → add a `slug` write in T078's action). **Decision:** persist the generated slug; `items` has no slug column at b1 → resolve by `items.id`-free path is impossible, so T078 encodes the slug into the URL as `toSlug(title)-<short-id>` where `<short-id>` is the first 8 chars of `items.id`; the resolver parses the trailing id fragment. Log this in DEVIATIONS (no slug column on items; id-fragment addressing chosen over a migration at b1).

## Completion

Date: 2026-06-02
Commit: `2ea68a3` (branch `t77`; merge to main pending PM y/n)
Status: Build complete. 15/15 T079 vitest + 121/121 src GREEN; tsc clean on new files; conformance OK. M2 PROCEED (id8-collision 1-in-4B noted); M3 basic.
Notes: `resolveProduct` + `<ProductPublicPage>` + item dispatch in the `/p` catch-all (checked **before** the Group split) + `/m/[handle]/p/[slug]` route. id8-fragment addressing (no `slug` column on `items` at b1) — DEVIATIONS filed. Locally Made badge data-gated on `made_at_place_id` (empty on F038 skip-path; F039 populates).
