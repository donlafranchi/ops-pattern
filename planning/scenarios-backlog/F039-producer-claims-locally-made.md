---
purpose: Backlog scenario — a producer claims the Tier 0 self-attested Locally Made provenance badge on a product Item.
layer: how
status: draft
---

# F039: A producer claims Locally Made on their product

**Bundle:** b1
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [P4 — A locally-owned, locally-made producer earns and displays both badges](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) — the provenance-claim half (Locally Made). Locally Owned is F037.
**Primitive shape:** Person(owner) → Item(kind='product', `made_at_place_id`, `made_at_verification_source='self_attested'`) → derivation: viewer's `member_place_interests` proximity to `made_at_place_id` → "Claimed locally made" badge.
**Status:** backlog
**Replaces:** F027 (archived 2026-05-28 — drop personas; F027's focused provenance-claim scope stays intact; product composer was extracted to F038).

## The Person

Maya has listed her sourdough (F038). Now she wants the "Claimed locally made" badge — the platform's affirmation that the loaf was baked in Oak Park, not imported from elsewhere. She heard a customer ask "is this actually local?" at the market last week.

## The Story

From the Item management page for her sourdough loaf (or during product composition in F038's optional step), Maya taps the **"Where is this made?"** field. A Place picker opens. She selects "Oak Park, Sacramento." The action layer updates `items.made_at_place_id` to Oak Park's `places.id` and sets `items.made_at_verification_source = 'self_attested'`.

The Item page now surfaces the **"Claimed locally made"** badge conditionally on viewer locality. For a viewer in Sacramento (whose `member_place_interests` resolves to a Place containing or proximal to Oak Park), the badge renders. For a viewer in Boise, no badge.

The label is "Claimed locally made" — never "Verified." Honest evidence tier. Tap to reveal the tier.

She can edit or remove the claim via Item management. Provenance is per-Item; she can claim Oak Park for sourdough and decline to claim for the Vietnamese imported textile she resells (per the P4 persona example table).

The kind constraint is enforced: services (kind='service') do not get the Locally Made step. Only kind='product' Items.

## Surfaces

- **Entry point:** Item management page → "Where is this made?" field (primary). Secondary entry: F038 composer optional step.
- **Primary action:** "Claim Locally Made" (writes `items.made_at_place_id` + `made_at_verification_source`).
- **Composer / interaction:** Single Place picker with typeahead over `places`. Edit + remove controls in Item management.
- **Completion:** Stays on Item management; Item page refreshes; badge renders per viewer locality.
- **Discovery:** N/A — the badge is the discovery affordance; this scenario writes the claim, the Item page reads it.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Where is this made? | `items.made_at_place_id` (FK to `places.id`) | yes (for claim) |
| Evidence tier (auto) | `items.made_at_verification_source = 'self_attested'` | yes (auto at b1) |

Implicit: only kind='product' Items get this step. Events: `item.made_at_set` (and `.removed` on remove).

## Acceptance Criteria

### Maya claims provenance + the row writes

**Given** Maya is on her product's Item management page
**When** she selects "Oak Park" in the "Where is this made?" Place picker and confirms
**Then** in one transaction: `items.made_at_place_id` updates to Oak Park's `places.id`; `items.made_at_verification_source = 'self_attested'`; `item.made_at_set` event logs with `acting_member_id=Maya`.

### Badge surfaces conditionally on viewer place-interest proximity

**Given** Maya's product has `made_at_place_id = Oak Park`
**When** a viewer whose `member_place_interests` resolves to a Place proximal to Oak Park (Oak Park itself, Sacramento city, Sacramento metro) loads the Item page
**Then** the "Claimed locally made" badge renders on the Item page.

### Badge does not surface for distant viewers

**Given** Maya's product has `made_at_place_id = Oak Park`
**When** a viewer whose `member_place_interests` does not resolve to a Place proximal to Oak Park loads the Item page
**Then** no badge renders. The claim still exists; it just doesn't render for that viewer.

### kind constraint enforced (services excluded)

**Given** Maya has a service Item (kind='service')
**When** she loads the Item management page
**Then** the "Where is this made?" field is not rendered. Only kind='product' Items get this step.

### Edit / remove work

**Given** a claim exists on a product
**When** Maya updates the Place (e.g., changes from "Oak Park" to "Sacramento") or taps "Remove"
**Then** edit path: `made_at_place_id` updates, event logs. Remove path: `made_at_place_id = NULL`, `made_at_verification_source = 'none'`; `item.made_at_removed` event logs; badge stops rendering.

### Label is "Claimed" not "Verified" at Tier 0

**Given** any badge rendering at b1
**When** the Item page loads
**Then** the badge label is exactly "Claimed locally made" — never "Verified." Tier 1 community-attested (b2+) and Tier 2 document-supported (b2+/b3) use different labels.

## Edge Cases

- **Maya picks a Place outside her Group's anchor metro:** allowed — provenance is independent of jurisdiction (P4 persona example #4: out-of-state designer labeling products from Sacramento). Honest preview optional but not blocking.
- **Place picker returns no results:** typeahead expands; if still no match, Maya can request adding a Place (b2 surface).
- **Member is not the founder of the Item's Group (or not the Member who owns the Item):** only the Item owner can claim. Multi-owner expansion: b2.
- **Provenance set, then product Group changes:** provenance survives (made_at is per-Item, not per-Group).

## Assumptions

- F038 ships before this scenario (product exists to claim provenance against).
- Substrate ticket S-jurisdictions ships: `items.made_at_place_id` column + `items.made_at_verification_source` enum/text + indexes.
- `places` table populated to neighborhood depth for the relevant Sacramento places.
- Action handlers: existing `item.update` accepts `made_at_place_id` writes (no new handler needed; the column is part of the spine).

## Out of Scope

- Tier 1 community-attested provenance (other members confirm a product was made at the claimed Place) — b2+, paired with C5.
- Tier 2 document-supported provenance — b2+/b3.
- "Designed in" as a separate signal from "Made at" — open question (historical context: `_attic/2026-05-28-reorg/product-exploration/member-geography-redesign.md`); out of scope at b1.
- Cross-claim aggregation surfaces ("show me all Locally Made products in Oak Park") — b2.
- Service-provider trust signals — F040 covers service composer, but services don't get Locally Made.

## Capabilities unlocked

- **3. Locality & Trust Signals** — "Claimed locally made" badge — Tier 0 self-attested Place on kind='product' Items.
- **3. Locality & Trust Signals** — Badge surfaces conditional on viewer place-interest proximity.
- **3. Locality & Trust Signals** — Edit / remove provenance claims in Item management.
- **3. Locality & Trust Signals** — Doxxing prevention — provenance derives from Place, not from street address.
