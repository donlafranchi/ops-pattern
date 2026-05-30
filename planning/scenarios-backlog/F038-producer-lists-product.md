---
purpose: Backlog scenario — a producer lists a product Item via the product composer.
layer: how
status: draft
---

# F038: A producer lists a product

**Bundle:** b1
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services) (the listing half) + [P3 — A producer with variable cadence stays findable to followers](../../product/needs/use-cases.md#p3-a-producer-with-variable-cadence-stays-findable-to-followers) (the Item is the unit of findability).
**Primitive shape:** Person → Item(kind='product', optional `group_id` for business Group filing) → Location(pickup point).
**Status:** backlog
**New scenario** — split from a prior broadening of F027. Product composer is its own scenario; the Locally Made claim is F039.

## The Person

Maya wants to list her sourdough loaves. She has a business Group (F036). She has a freezer of loaves ready for the next farmers market. She wants a public Item page she can share with neighbors and customers — title, photo, price, pickup point.

## The Story

From her Group page or from `/you`, Maya taps **"Add a product."** The product composer opens.

Fields: title ("Country Sourdough Loaf"), description, price (or free), photos (optional at b1), location attachment (pickup point — her anchor Location is the default), optional Group filing (her business Group is the default if she's coming from the Group page). She fills it in and taps publish.

The composer includes an optional **"Where is this made?"** step — a Place picker for `made_at_place_id`. F038 tests the skip path (claim is F039's territory). If she skips, the Item ships without a Locally Made badge; she can return to claim provenance later via Item management.

She lands on `/p/[…place]/g/[group-slug]/p/[slug-suffix]` (when filed under her business Group) or `/m/[handle]/p/[slug-suffix]` (when sold as individual, no Group filed). The page shows title, description, photo, price, pickup point, brand resolve-up (her Group's display_name), and her as the owner Member.

The product appears in the locality-first awareness feed for Members within scope.

## Surfaces

- **Entry point:** Group page primary CTA "Add a product" (after F036). Secondary entry: `/you` "Add a product" affordance for Members with ≥1 active business Group OR selling-as-individual path.
- **Primary action:** "Add a product" → composer.
- **Composer / interaction:** Single-page composer with optional photo, optional Locally Made provenance step (test skip path here).
- **Completion:** Lands on `/p/[…place]/g/[group-slug]/p/[slug-suffix]` or `/m/[handle]/p/[slug-suffix]`.
- **Discovery:** Item surfaces in the locality feed; on the Group page Items section; on the pickup Location's "Items available here" if surface present at b1.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Title | `items.title` | yes |
| Description | `items.description` | yes |
| Price (or Free) | `item_products.price_cents`, `item_products.price_unit` (null = free) | yes |
| Photos | `item_products.photo_urls` | optional at b1 |
| Pickup point (auto, editable) | `item_locations.location_id, schedule_kind='permanent'` | yes |
| File under (Group, auto-default) | `items.group_id` | optional (null = sold as individual) |
| Where is this made? (optional, opens F039) | `items.made_at_place_id` | optional (covered by F039) |

Implicit: `items.kind='product'`, `items.member_id=<seller>`, `items.state='published'`, `items.brand_label` derived from Group's display_name if filed, `item.created` + `item.published` events with `acting_member_id`.

## Acceptance Criteria

### "Add a product" reachable from Group page + /you

**Given** Maya has a business Group
**When** she taps "Add a product" on her Group page or `/you`
**Then** the composer opens with her Group pre-attached as `items.group_id` (when entered from Group page).

### Composer writes Item + child + Location in one transaction

**Given** Maya fills title, description, price, pickup point and taps publish
**When** the submit fires
**Then** in one transaction: `items` row writes (kind='product', state='published', group_id, brand_label derived); `item_products` row writes; `item_locations` row writes with schedule_kind='permanent'; `item.created` + `item.published` events log with `acting_member_id=Maya`. She is redirected to the kind-specific Item URL.

### Item URL follows place-scoped + random-suffix pattern

**Given** the product is filed under a business Group with anchor Location resolving to a place path
**When** the URL is generated
**Then** the URL is `/p/[…place]/g/[group-slug-suffix]/p/[title-slug-suffix]` per ADR-20 + ADR-22. If sold as individual (no Group filing), URL is `/m/[handle]/p/[title-slug-suffix]`.

### Item page shows brand resolve-up + owner

**Given** Maya's product is filed under Oak Park Sourdough
**When** any viewer loads the Item page
**Then** the page shows title, description, price, photo (if any), pickup point with map pin, the Group's display_name as brand label with link to Group page, and Maya's display name with link to her Member page.

### Skip-provenance path

**Given** Maya skips the "Where is this made?" step
**When** the composer publishes
**Then** the Item ships with `made_at_place_id = NULL`; no Locally Made badge surfaces on the Item page; Maya can return to claim provenance via Item management (F039 covers).

### Product appears in locality feed

**Given** the product is published
**When** a Member's awareness feed query runs and the Member's `member_place_interests` × `member_interests` intersect with this product's Location's place + tags
**Then** the product appears in the feed.

## Edge Cases

- **Sell as individual** (no business Group): Item attaches to Member directly; brand_label = NULL; URL falls back to `/m/[handle]/p/[slug-suffix]`.
- **Photo upload fails:** Item still publishes without photo; toast surfaces; Maya can edit later.
- **Pickup point doesn't exist:** sub-flow opens to add new Location; composer resumes on save.
- **Free product:** `price_cents = NULL`, `price_unit = NULL`; page renders "Free" instead of a number.
- **Member edits product after publish:** at b1, edit covers title, description, price, photos, pickup point, made_at_place_id — not member, kind, or Group.

## Assumptions

- F036 ships before this scenario (business Group exists).
- Phase 1 substrate: `items` + `item_products`, `item_locations`, action handlers `item.create`, `item.publish`, `item.attach_location`.
- ADR-20 + ADR-22 URL generation is wired.
- Locality feed (F030) reads from `discoverable_items` so new products surface on next feed query.

## Out of Scope

- The Locally Made claim lifecycle — F039.
- Photo upload UI — schema reserves the column at b1; full upload UX may be deferred to b2 depending on complexity.
- Inventory tracking, sold-out states — b2 per `planning/producer-roadmap.md` § 2 Later.
- Bundle / package Items (multiple products grouped) — b2+.
- Variants / SKUs — explicitly out per taxonomy § 2 Won't.
- Cart / checkout — explicitly out per taxonomy § 8 Won't.
- Edit-product flow — separate scenario.

## Capabilities unlocked

- **2. Product & Service Listing** — Product composer — title, description, price (or free), location attachment, optional Group filing.
- **2. Product & Service Listing** — Item pages at kind-specific URLs (`/p/.../p/[slug]` for products).
- **2. Product & Service Listing** — Items filed under a business Group resolve-up with the Group's brand name.
- **2. Product & Service Listing** — Items can also attach to a Member directly (sell as an individual, no Group required).
- **1. Presence & Findability** — Items appear in the locality-first awareness feed via place-interest × interest-tag matching.
