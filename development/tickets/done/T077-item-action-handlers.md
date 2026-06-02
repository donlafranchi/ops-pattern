---
id: how-t077-item-action-handlers
purpose: Item action handlers (item.create / item.publish / item.attach_location) + event-log item_events/location_events extension + registry. The write substrate F038's product composer calls.
layer: how
status: open
---

# T077 — Item action handlers (`item.create` / `item.publish` / `item.attach_location`)

**Scenario:** [F038 — A producer lists a product](../../planning/now/scenario-F038-producer-lists-product.md)
**Binds to:** `product/systems/item.md` § Data model implications · `product/systems/action-layer.md` § Same-transaction row+event invariant · ADR-7 · ADR-10
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T056 (items + item_products + item_locations + item_events schema) · T070 (group handler pattern + group_businesses) · T064 (made_at columns)
**Repo / branch:** web / `t77`

## Serves

- **Loop:** 7 (Buy close), 9 (Make a living locally).
- F038 Then-clause "Composer writes Item + child + Location in one transaction." This ticket is the handler layer the composer's server action calls.
- **Primitive shape:** Person → Item(kind='product', optional group_id) → Location(pickup).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — N/A** (no UI; T078 owns the surface).
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **SPEC-PATCHES** if `schedule_kind='permanent'` drift (see AC) needs a spec edit.

## Acceptance Criteria

### `_lib/event-log.ts` — extend EventTable

- [ ] Add `'item_events'` and `'location_events'` to the `EventTable` union.
- [ ] Add `targetColumnFor` cases: `item_events → item_id`, `location_events → location_id`.

### `item.create` — `src/actions/item/create.ts`

- [ ] Zod input: `memberId` (uuid), `kind` (literal `'product'` at b1 — schema reserves others), `title` (1–200), `description` (default `''`), `groupId?` (uuid), `priceCents?` (int ≥0, null = free), `priceUnit?`, `photoUrls?` (string[]), `locationId?` (uuid), `scheduleKind?` (enum, default `'ongoing'`), `madeAtPlaceId?` (uuid, optional — F039 territory; F038 skip-path leaves null), `publish?` (boolean, default false).
- [ ] One `withTransaction`: insert `items` (kind, member_id, group_id, title, description, brand_label, state); insert `item_products` (price_cents, price_unit, photo_urls); if `locationId` → insert `item_locations` (schedule_kind, status='approved'); if `publish` → set state='published'; emit `item.created`, plus `item.location_attached` when a location is attached, plus `item.published` when published — all same transaction.
- [ ] **brand_label derivation:** when `groupId` is set, resolve `group_businesses.display_name` for that group and write it to `items.brand_label`. When no group, `brand_label` is null. _Encodes F038 "brand resolve-up" + naming-conventions Seller rule._
- [ ] **Owner-of-group check:** if `groupId` supplied, the caller must hold an active `role='owner'` membership in that Group (kind='business'). Reject `AuthorizationError` otherwise. Mirror `group/update-draft.ts` owner check.
- [ ] **made_at on products only:** `madeAtPlaceId` accepted only when kind='product' (schema CHECK `items_made_at_only_on_products` already enforces; handler passes through).
- [ ] Returns `{ itemId, state }`.

### `item.publish` — `src/actions/item/publish.ts`

- [ ] Zod input: `itemId` (uuid).
- [ ] Validates caller owns the Item (`items.member_id = actingMemberId`) → `AuthorizationError` otherwise; `NotFoundError` if no row.
- [ ] One transaction: `update items set state='published'` where state != 'published' (idempotent guard); emit `item.published`. No-op (no event) if already published.

### `item.attach_location` — `src/actions/item/attach-location.ts`

- [ ] Zod input: `itemId` (uuid), `locationId` (uuid), `scheduleKind` (enum `one_time|recurring|ongoing|by_appointment`, default `'ongoing'`).
- [ ] Validates caller owns the Item → `AuthorizationError`; `NotFoundError` if no Item.
- [ ] One transaction: insert `item_locations` (status='approved'); emit `item.location_attached`.

### Registry + barrel

- [ ] `src/actions/item/index.ts` barrel exports the three handlers + input schemas + types.
- [ ] `src/actions/index.ts` registers `item.create`, `item.publish`, `item.attach_location`.

### Tests — `tests/actions-t077.test.ts`

- [ ] File-shape: the four new files exist.
- [ ] Registry: `listHandlers()` contains the three item handlers; `getHandler` resolves each.
- [ ] Zod validation: item.create accepts a minimal valid product input; rejects unknown kind, non-uuid memberId, negative priceCents, title > 200. item.publish/attach_location reject non-uuid ids.
- [ ] Source-shape: create.ts inserts `items` + `item_products`, emits `item.created`, derives `brand_label` from `group_businesses`, owner-check via `AuthorizationError`; publish.ts emits `item.published` with idempotent guard; attach-location.ts inserts `item_locations` + emits `item.location_attached`.
- [ ] event-log.ts source carries `item_events` + `location_events`.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T077 line. STAGE-LEDGER F038 row → `building`.

## Notes

- **No migration.** All tables exist (015_items, 020_items_made_at). Pure TS substrate.
- **`schedule_kind='permanent'` drift:** F038's Data-Captured table says `schedule_kind='permanent'`, but `item_locations.schedule_kind` CHECK is `one_time|recurring|ongoing|by_appointment`. A permanent pickup point maps to `'ongoing'`. Handler default = `'ongoing'`; log DEVIATION + SPEC-PATCHES against the scenario's Data-Captured row.
- **DB behavior** (transaction atomicity, RLS, event rows) is verified by the F038 Playwright eval against live Supabase — not vitest (Vitest can't reach a live DB in the build sandbox; handler tests are file-shape + zod + source-regex, same as T070).

## Completion

Date: 2026-06-02
Commit: `5a23f70` (branch `t77`; merge to main pending PM y/n)
Status: Build complete. 24/24 T077 vitest + 152/152 src GREEN; tsc clean on new files; `check:action-layer` OK (35 protected tables). M2 PROCEED (2 low-sev suggestions logged in DEVIATIONS). No migration needed (015/020 schema sufficient).
Notes: `EventTable` extended with `item_events`/`location_events`. `schedule_kind='permanent'` (F038 Data-Captured) mapped to `'ongoing'` — DEVIATIONS + SPEC-PATCHES filed.
