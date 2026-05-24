# F027: Maya claims Locally Made on her sourdough loaves

**Bundle:** b1
**Sub-bundle:** b1.4 — Find & follow
**Work-map item:** b1.4 → 🟢 "Locally Made claim (Tier 0 self-attested) per ADR-21"
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** Maya at Oak Park Sourdough — [`use-cases.md` #13](../../product/needs/use-cases.md)
**Primitive shape:** Person(Maya) → Item(kind=`product`, `made_at_place_id=Oak Park`, `made_at_verification_source='self_attested'`) → "Claimed locally made" badge surfaces conditional on viewer place-interest proximity
**Status:** backlog

## The Person

Maya from F026 is the same baker, with the same Group. Now she's posting her first product Item — a recurring weekly drop of sliced sourdough loaves, $8 each, picked up at the Saturday market or arranged for porch pickup in Oak Park. She wants buyers to know not just that her business is local (the F026 badge does that) but that *the loaves themselves are made here* — by her, in her Oak Park kitchen. *Locally Owned* is about her ownership; *Locally Made* is about where the bread comes out of the oven. Two different signals; a buyer comparing her to a Sacramento-resident reseller of imported textiles needs both.

## The Story

Maya is in the **product composer**, which she reached by tapping **Sell** on the universal composer and then **Product** (her Group is already active per F026). The composer asks for title, description, price (or "ask" for free), location attachment (the Saturday market or her porch as a pickup point), and — newly per ADR-21 — an optional **"Where is this made?"** step.

She picks **Oak Park** from a Place picker (her neighborhood, a `places.kind='neighborhood'` row under Sacramento). The composer tells her, plainly, the badge that will surface: **"Claimed locally made"**. It doesn't ask for documents, doesn't ask where she lives. She publishes the Item.

She lands on her Item's page at `/p/sacramento/oak-park/g/oak-park-sourdough/p/saturday-sourdough`. Below the price, two badges sit side-by-side: "Claimed local owner" (inherited from F026, on the Group) and "Claimed locally made" (this Item's claim). A neighbor browsing nearby Items in the awareness feed sees both badges on her Item card — but a neighbor browsing from Davis (whose `primary_home` is Davis, not Sacramento) sees only the Locally Owned badge, because Davis isn't proximal to Oak Park. The badge tells the truth from each viewer's locality.

## Surfaces

- **Entry point:** The product composer (reached by Sell → Product). The "Where is this made?" step appears between Location attachment and publish. _Why: per `item.md` Provenance claims (per ADR-21) — the badge is a Member-affirmative claim; opt-in surfacing keeps the claim explicit, not inferred._
- **Primary action:** A single Place picker labeled **"Where is this made?"** with an optional **"Skip"** affordance. The picker auto-suggests from the Member's `member_place_interests` (`primary_home` and secondaries) ordered most-specific-first, plus a free search across `places` rows.
- **Composer / interaction:** Place picker with type-ahead search. Below it: a live-preview badge — "Claimed locally made (Oak Park)." Help link: "What does Locally Made mean? How does it differ from Locally Owned?" pointing to a short explainer that names the two signals' separation per ADR-21.
- **Completion:** Item public page with both badges rendered. The Item appears in the awareness feed of Members whose place-interest set includes Oak Park or any ancestor (Sacramento, Sacramento MSA) within the default traversal depth.
- **Discovery:** The Item surfaces in locality-first browse with the Locally Made badge. The badge renders on Item cards only when the viewer's place-interest is proximal to `made_at_place_id`; otherwise the card surfaces without the Locally Made badge (Locally Owned, if present, is unconditional because it's a Group-level attribute and proximity is computed against the Group's anchor Location).

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Where is this made? | `items.made_at_place_id` | optional (skip = no Locally Made badge) |
| Maya's Member ID | `items.member_id` (already set by composer) | yes (implicit) |
| Item kind | `items.kind = 'product'` (composer routes only product Items here) | yes (implicit) |

Implicit (set by the surface, not asked of the user):
- `items.made_at_verification_source = 'self_attested'`
- `item.made_at_set` event fires with `{item_id, place_id, verification_source: 'self_attested'}`

## Acceptance Criteria

### Setting Locally Made during product composition

**Given** Maya is in the product composer, signed in, has confirmed her kind='business' Group (Oak Park Sourdough) as the Item's `group_id`, and has reached the "Where is this made?" step
**When** she picks "Oak Park" from the Place picker and taps Publish
**Then** the Item row is created with `(member_id=Maya, kind='product', made_at_place_id=Oak Park's place_id, made_at_verification_source='self_attested')`. _Why: substrate per `item.md` Provenance claims; `made_at_place_id` is kind='product'-only, enforced by the action handler `item.set_made_at` per ADR-21._
**And** the `item.made_at_set` event is appended to `item_events` in the same transaction. _Why: same-transaction row+event invariant per ADR-7._

### Badge surfaces conditional on viewer place-interest

**Given** Maya's Item is published with `made_at_place_id=Oak Park`
**When** Carol (a viewer whose `member_place_interests` includes `primary_home=Curtis Park` — adjacent to Oak Park, both under Sacramento city) views the Item page
**Then** the "Claimed locally made" badge is visible below the Item's price. _Why: `public.zip_is_proximal_to_location()` returns true via the Place-hierarchy traversal — Curtis Park and Oak Park share an ancestor at the city default traversal depth per `discovery.md` Community-awareness feed Intent._
**And** the badge label is exactly "Claimed locally made" (not "Verified" or "Documented"). _Why: ADR-21 evidence-tier honesty._

**When** Dave (a viewer whose `member_place_interests` is `primary_home=Davis` — a different city in the Sacramento MSA but not nested under Sacramento-the-city) views the same Item page
**Then** the Locally Made badge is **not** visible by default. _Why: Davis is one step further away than the default city traversal; the badge surfaces only when proximal, and "proximal" honors the same default traversal depth Members see in their awareness feed (per `discovery.md` Intent)._
**And** the Locally Owned badge (from F026, on the Group) **is** visible because Group-level locality is unconditional (computed against the Group's anchor Location, not the viewer's place-interest). _Why: the two badges have different proximity contexts — owner-residence is a fact about the seller; product-provenance is a fact about the Item relative to the viewer's locality scope._

### Skip-during-composer is honored

**Given** Maya is in the "Where is this made?" step
**When** she taps "Skip"
**Then** the Item is published with `made_at_place_id=NULL, made_at_verification_source='none'`. No badge surfaces. _Why: ADR-21 default — the claim is Member-affirmative; absence of claim means no badge, not "inferred from somewhere else."_
**And** she sees a non-blocking nudge on the Item-management view: "You can add a Locally Made claim to this Item later." _Why: opt-in commitment per ADR-21; the platform invites the climb, never coerces._

### Editing and removing the provenance claim

**Given** Maya's Item has `made_at_place_id=Oak Park`
**When** she opens Item-management → "Edit Locally Made" and changes the Place to "Sacramento" (city-level, a less-specific claim)
**Then** the row updates with `made_at_place_id=Sacramento's place_id`, `item.made_at_set` fires with `{previous_place_id, new_place_id}`. _Why: audit-trail per ADR-6 — the event log is the audit chain for provenance changes that affect badge rendering for other Members._

**When** she opens "Remove Locally Made"
**Then** `made_at_place_id=NULL, made_at_verification_source='none'`, `item.made_at_removed` fires, and the badge disappears from the Item page and Item cards. _Why: ADR-21 reversibility — opt-in claim, opt-out removal._

### kind='product' constraint enforced

**Given** Maya is composing a kind='service' Item (a home-baking class)
**Then** the "Where is this made?" step does **not** appear in the composer. _Why: services don't have a physical provenance in the same sense — per `item.md` Provenance claims, the column is kind='product'-only at b1 (Open Question 3 in `member-geography-redesign.md` keeps the door open for a service-area extension later, but doesn't ship at b1)._

### Non-existent Place picker rejection

**Given** Maya types "Atlantis" into the Place picker (no matching `places` row)
**Then** the picker shows "No matching place found" and the Confirm button stays disabled. _Why: `places` is platform-curated per ADR-20 — Members structurally cannot declare new Places from the composer. If Atlantis is a real place that needs adding, that's a curation request, not a free-text field._

## Edge Cases

- **Viewer with no `member_place_interests` row** (anonymous visitor or just-onboarded Member who hasn't completed locality): the Locally Made badge falls back to **proximity computed against the viewer's IP-geolocated home Place** (a one-time best-effort), with a tooltip explaining that the badge depends on the viewer's locality. If geolocation is unavailable, the badge is shown unconditionally with the place name spelled out: "Claimed locally made (Oak Park)" — letting the viewer judge proximity themselves. _Why: the badge is honest about the seller's claim; the *viewer-side rendering rule* is a UX courtesy, not a gate on the underlying signal._
- **The "designed in vs. assembled in" question** (Open Question 2 in `member-geography-redesign.md`): out of scope for this scenario. b1 reads on `made_at_place_id` only; "designed in" is a separate future field.
- **Maya changes her Item's `group_id`** (re-files under a different Group): the `made_at_place_id` is independent of `group_id` — it's an Item attribute, not a Group attribute. No re-eval needed.
- **Maya posts the same Item but at a less-specific `made_at_place_id`** (Sacramento city instead of Oak Park neighborhood): the badge still surfaces for Curtis Park viewers (same city); the only behavioral change is that Davis viewers might *now* see the badge if their place-interest traversal reaches Sacramento via a secondary or MSA-depth opt-in. _Why: the Member chose granularity; the system honors it._

## Assumptions

- The product composer already exists (per b1.4 work-map "Product composer"). This scenario adds the Provenance step inside the existing flow.
- `places` table is populated with Oak Park (neighborhood), Curtis Park, Sacramento (city), Sacramento MSA, Davis (city), per `places.md` b1 seed list.
- The viewer-side proximity rule (does the viewer's place-interest match the Item's `made_at_place_id`?) is implemented in the same proximity-test family as `zip_is_proximal_to_location()` — likely a `place_is_proximal_to_place()` helper. The exact function shape lands in the ticket sequence; the scenario asserts behavior.
- `member_place_interests` already lands at b1 per F028 / F029 — F027 *reads* this substrate but does not write it.

## Out of Scope

- **Tier 1 community-attestation surface for Locally Made** — b2+ per ADR-21 (`item.md` Provenance claims, parallel to `business-jurisdiction.md` T2).
- **Tier 2 document upload for Locally Made** — b2+/b3.
- **"Designed in" as a separate signal** — Open Question 2 in `member-geography-redesign.md`; not ratified.
- **Locally Made for kind='service' Items** — Open Question 3 in `member-geography-redesign.md`; not at b1.
- **The Locally Made / Locally Owned comparison-table surface** on the discover page — b1.4 has a 🟢 "discover" page; the badge dimension lands there, but the explicit two-badge comparison view is a later refinement.
