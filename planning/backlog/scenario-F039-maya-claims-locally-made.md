---
id: how-f039-maya-claims-locally-made
purpose: Owner (Maya) declares where a product was made; the platform surfaces the "Locally Made" badge when the made-at Place is local.
layer: how
status: backlog
---

# F039: Maya claims Locally Made

**Bundle:** b1
**Sub-bundle:** b1.4 — Find & follow (the maker payoff)
**Work-map item:** b1.2 → 🟡 "Claim the 'Locally Made' badge" (from `bundle-1-checklist.md`)
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [P4 — A locally-owned, locally-made producer earns and displays both badges](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) (provenance half).
**Primitive shape:** Person(Maya) → Item(kind='product', `made_at_place_id`) → proximity test against the viewer's locality interest → "Locally Made" badge.
**Status:** backlog
**Substrate gates (two):** (1) S-jurisdictions substrate (`items.made_at_place_id` column + the `places` lookup). (2) F038 (product composer — without a product surface, there's nothing to claim on). Scenario cannot promote until both ship.

> **Why this shape?** The Locally Made claim is the sibling of Locally Owned. Owner residence answers "does the money go to a local owner?"; product provenance answers "is the product made here?" Per `business-jurisdiction.md` they're designed together so the platform never has to retrofit one against the other. F039 is intentionally narrow: a single field on the product composer + a badge-render rule on the product page.

## The Person

**Maya** — Oak Park Sourdough. She bakes her bread in her home kitchen in Oak Park. She wants the platform to mark her products "Locally Made" so a Sacramento browser searching for local sourdough finds hers ahead of mass-produced bread that happens to be sold locally.

## The Story

When Maya creates a product via F038's composer, an optional "Where is this made?" step asks her to pick a Place from a typeahead (suggests Oak Park, Sacramento, Sacramento County — `made_at_place_id` is a `places` row, so the colloquial metro is not a pickable value). She picks Oak Park. The product saves with `items.made_at_place_id = oak-park-place-uuid`.

On the product's public page (the read surface from F038), the platform renders "Made in Oak Park" near the product header and a "Locally Made" badge if Oak Park passes the proximity test against the viewer's place-interest set (per `member_place_interests`). A viewer browsing from Sacramento sees the badge; a viewer browsing from another metro doesn't (though they still see "Made in Oak Park" — the provenance fact is public; only the badge is locality-relative).

Post-create, Maya can edit the made-at Place from the same owner-side widget that manages other product fields (deferred to F038 owner view; F039 ships the field, not a standalone edit surface).

## Surfaces

- **Entry point (set):** Optional step in the F038 product composer ("Where is this made?" — Place typeahead, skippable).
- **Entry point (edit):** Product owner view's edit affordance (lives inside F038's surface).
- **Primary action:** Pick a Place from the typeahead. Skippable.
- **Composer / interaction:** Typeahead over `places` filtered by viewer's locality context (suggests nearby Places first).
- **Completion:** Product saves with `made_at_place_id`. Public page renders "Made in {place name}" + badge if proximal.
- **Discovery:** Future locality-feed surface ranks Locally Made products higher in the viewer's locality results — F039 ships the underlying field; the discovery ranking is downstream.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Where is this made? | `items.made_at_place_id` (foreign key to `places.id`) | optional |

Implicit:
- The badge-render predicate at view time: `public.zip_is_proximal_to_location()` (or the Place-hierarchy equivalent) tested between the viewer's place-interest Places and the item's `made_at_place_id`.
- `item.updated` event when the field changes.

## Acceptance Criteria

### Story beat 1 — Maya picks a made-at Place during product create

**Given** Maya is in F038's product composer at the "Where is this made?" optional step
**When** she types "Oak Park" and selects Oak Park, Sacramento, CA from the typeahead
**Then** the product saves with `items.made_at_place_id` set to Oak Park's Place UUID. _Why: per `business-jurisdiction.md` line 84, "Locally Made lives on `items.made_at_place_id`" — the column is the source of truth. Eval verifies the row write._

### Story beat 2 — "Made in {place}" renders on the product page for all viewers

**Given** the product has `made_at_place_id` set to Oak Park
**When** any viewer (anonymous or logged in, regardless of locality) loads the product page
**Then** "Made in Oak Park" displays near the product header. _Why: the provenance fact is public — viewers from other metros still see where the product was made. Only the badge is locality-relative._

### Story beat 3 — "Locally Made" badge renders for proximal viewers

**Given** the product has `made_at_place_id` set to Oak Park AND the viewer holds a `member_place_interests` row whose Place is proximal to Oak Park (either Oak Park itself, any ancestor in the Place hierarchy — Sacramento city, Sacramento County — or co-membership in the same `metro_polygons` overlay per D3)
**When** the page renders
**Then** the "Locally Made" badge displays. _Why: per `business-jurisdiction.md` P4 table and the awareness-feed model in C2, locality is relative to the viewer's place-interest set. Eval verifies the badge renders for a Sacramento-interest viewer AND does NOT render for a viewer whose place-interests are entirely outside the proximity threshold._

**And** an anonymous viewer (no place-interest set) sees the badge based on a default proximity context — IP-geolocated or unset, in which case the badge does not render (the platform doesn't assume locality).

### Story beat 4 — Skip path produces no made-at row

**Given** Maya skips the "Where is this made?" step in the composer
**When** the product saves
**Then** `items.made_at_place_id` is NULL and no badge ever renders. The "Made in" line is omitted entirely from the product page (no negative-space copy). _Why: per the design language commitment to clean absence, "Made in unknown" is worse than no line at all. Eval verifies the page omits the entire provenance row when the column is NULL._

### Story beat 5 — Maya edits the made-at Place post-create

**Given** the product is published with `made_at_place_id` set
**When** Maya navigates to her product's owner view and edits the made-at field to a different Place
**Then** the action layer updates the column and emits `item.updated`. The public page re-renders with the new "Made in" copy and badge state.

## Edge Cases

- **Place not in the typeahead:** The `places` table is platform-curated. If Maya needs a Place that doesn't exist, the typeahead suggests the closest match (parent Place) — she can pick Sacramento if Oak Park isn't yet in the lookup. Adding new Places is a platform-curation operation, not a Member surface.
- **made-at Place is a coarse Place (e.g., Sacramento County rather than the Oak Park neighborhood):** `made_at_place_id` is always a `places` row; the proximity test runs against that Place's curated polygon centroid or boundary. Colloquial metros are not pickable here — they live in the `metro_polygons` discovery overlay (per D3), not the `places` tree.
- **Product made at one Place but sold from many:** F039 captures the one made-at Place. The Item's location attachments (where it's sold) live on a separate table per `item.md`.
- **Reseller case** (per P4's reseller row): A producer reselling imported textiles sets `made_at_place_id` to the import origin (e.g., Hanoi). The "Made in Hanoi" line renders; the "Locally Made" badge never renders to any local viewer because Hanoi fails proximity. Tier 0 doesn't punish honesty — the platform reports what the producer declared.
- **Provenance lie:** Maya could enter a false Place. Tier 0 is self-attested and gaming-prone per `business-jurisdiction.md` line 327; community-attestation at b2+ corroborates or challenges. Out of scope for F039.

## Assumptions

- **S-jurisdictions substrate is live.** Specifically: `items.made_at_place_id` column, `places` lookup table, the proximity test function. Per STAGE-LEDGER, S-jurisdictions is `product` stage and gates this.
- **F038 has shipped.** The product composer surface is where F039's field lives; the product page is where its badge renders. Without F038, there is no surface to attach to. F039 cannot ticket until F038 lands; the scenario ratifies the contract that F038's composer + page must accommodate.
- The `places` table is seeded with Sacramento-region Places (per T058 polygon-seed substrate work) sufficient for the canonical examples (Oak Park, East Sacramento, West Sacramento, Sacramento County).

## Out of Scope

- **Tier 1 community-attestation of provenance.** b2+, depends on the interaction graph.
- **Tier 2 document-uploaded provenance** (organic certifications, made-in-USA paperwork). b3.
- **Provenance for `kind='service'` Items.** Locally Made applies to physical products only per `business-jurisdiction.md` Companion claim section. Services don't carry the badge.
- **Discovery ranking by provenance.** F039 writes the column; ranking + filtering surfaces are downstream (b1.4 Find & Follow surface work continues in F042 + downstream feed scenarios).
- **Multi-Place provenance** (a product made partly here, partly elsewhere). Out of scope at b1.

## Capabilities unlocked

- **Producer locality claim (provenance half).** Completes P4's provenance side. Realizes the `business-jurisdiction.md` Companion claim section.
- **Buy Close discovery affordance — the "made here" signal** (sibling to F037's "owned here" signal). Together, F037 + F039 give the locality-first index the full Locally Owned / Locally Made answer the bundle hypothesis depends on.

## Gate A summary (Cowork pre-flight)

| Spec section | Absolute(s) cited | State |
|---|---|---|
| `business-jurisdiction.md` § Companion claim — Locally Made | provenance column = `items.made_at_place_id`; sibling to jurisdiction | ✓ Ratified 2026-05-23 (Intent line 34) |
| `item.md` § Provenance | (referenced; verify section is intact when F038 lands) | ✓ Assumed ratified — flag for re-check at promotion time |
| Tier 0 self-attested floor | b1 ships Tier 0 only | ✓ Ratified 2026-05-23 (Intent line 44) |

**Gate A verdict: PASS pending `item.md` § Provenance section re-check at substrate-ship time.** Two substrate gates (S-jurisdictions + F038) prevent promotion regardless.
