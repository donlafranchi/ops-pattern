---
id: how-t080-generalize-item-create
purpose: Prep — generalize item.create + the /you/sell button row so F040 (service composer) and F034 (gathering composer) can branch in parallel without conflicting on the shared spine.
layer: how
status: open
---

# T080 — Generalize `item.create` for multi-kind support

**Scenario:** substrate
**Binds to:** `product/systems/item.md` § Data model implications (per-kind child tables `item_products` / `item_services` / `item_gatherings`) · `product/systems/action-layer.md` § Same-transaction row+event invariant
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T077 (item handlers) · T078 (product composer surface)
**Repo / branch:** web / `t80`

## Why (prep, not a feature)

F040 (producer lists a service) and F034 (member hosts a recurring gathering) both extend `item.create` and the `/you/sell` button row. Today both are product-only:

- `item.create` pins `kind` to `z.literal('product')` and hard-codes a single `item_products` insert.
- `/you/sell` hard-codes one `AddProductButton` plus a placeholder paragraph.

If F040 and F034 branch off that shape, they collide on the same two files. This ticket widens the seam **once** — the kind enum, a kind-branched child insert, and a data-driven button list — so the two composer tickets land their own branch arm without touching each other's. No new user-facing surface; product behavior is unchanged.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — N/A** (no new page/component; the sell row is refactored in place, same accessible names).
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### `item.create` — `src/actions/item/create.ts`

- [ ] Widen `kind` from `z.literal('product')` to `z.enum(['product','service','gathering'])`.
- [ ] Add optional kind-specific input fields (all `.optional()`, ignored for kinds that don't use them):
  - service: `rateModel` (enum `hourly|flat|quote|membership`), `rateCents` (int ≥0, nullable).
  - gathering: `startsAt`, `endsAt` (ISO strings), `recurrenceRule` (string), `capacity` (int >0, nullable), `costCents` (int ≥0, nullable).
- [ ] Spine insert writes `input.kind` (not a hard-coded `'product'`).
- [ ] Branch the child-table insert on `kind`:
  - `product` → `item_products` (price_cents, price_unit, photo_urls) — unchanged.
  - `service` → `item_services` (rate_model defaults `'quote'`, rate_cents).
  - `gathering` → `item_gatherings` (starts_at, ends_at, recurrence_rule, capacity, cost_cents, host_member_id = member_id).
- [ ] `item.created` event payload carries `kind: input.kind`.
- [ ] `made_at_place_id` stays product-only (schema CHECK already enforces; pass through only for product to avoid a guaranteed constraint failure on service/gathering).
- [ ] Group owner-check, brand_label resolve-up, optional location attachment, and publish logic stay kind-agnostic (unchanged).
- [ ] Returns `{ itemId, state }` — unchanged.

### `/you/sell` — `src/app/you/sell/page.tsx`

- [ ] Replace the hard-coded `AddProductButton` + placeholder `<p>` with a data-driven list of composer entries, so adding the service/gathering entry later is a one-line array change, not a JSX edit inside the row.
- [ ] The product entry keeps `AddProductButton` and its eval-relied-on `role=button` + `/Add a product/i` accessible name (T073b).
- [ ] Drop the "Service and gathering composers land in upcoming bundles (F040, F034)" placeholder paragraph; the data-driven list is the seam those tickets extend.

## Out of scope

- The actual service/gathering composer surfaces and their server actions (F040 / F034 own those).
- Any service/gathering eval coverage beyond input-validation + branch-shape unit assertions.
- PostGIS `service_area_geography`, `hours`, RSVP — composer-ticket territory.

## Completion

- **Status:** Implemented on branch `t80` (worktree `../web-t80`), not merged.
- **Tests:** `tests/actions-t080.test.ts` (new, 9 cases) + repurposed the stale T077 "product-only" assertion to reject `wonder`. F035/F036/F038 suites (resolve-shop, resolve-product, getDraftGroup, ProductComposer, SellWalkthrough, ProductPublicPage, ShopPublicPage, actions-t070, actions-t077) all green — 144 cases. Full-suite failures (15) are pre-existing migration-snapshot + flaky CI-enforcement subprocess tests; identical set on clean `main`.
- **M2 code-review:** Approve. Two low/note suggestions (implicit gathering `else`; owner-check now gates service/gathering filings) deferred to F040/F034.
- **DEVIATIONS:** "no deviations" entry filed.
- **Files:** `src/actions/item/create.ts`, `src/app/you/sell/page.tsx`, `tests/actions-t077.test.ts`, `tests/actions-t080.test.ts`.
