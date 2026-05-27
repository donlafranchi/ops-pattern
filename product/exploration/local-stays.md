---
purpose: Exploration of short-term rentals as a platform surface — the anti-Airbnb thesis.
layer: what
status: exploration
---

# Local Stays — Short-Term Rentals as a Platform Surface

**Status:** Exploration. Not yet a system spec. This doc names the opportunity, the structural problem it addresses, the design constraints that distinguish it from Airbnb, and how it maps to the platform's existing primitives. It stays freeform until the question becomes load-bearing for a build.

## The problem this addresses

Short-term rental platforms have produced a well-documented harm pattern: investors buy homes in communities not to live in them but to operate them as hotels. The result is predictable — housing prices rise, rental supply shrinks, neighborhoods lose full-time residents, and the economic benefit of tourism flows to absentee owners rather than the community. Airbnb's original pitch was "rent your spare room to travelers." The platform's actual trajectory has been the opposite: professionalized multi-unit operators now dominate listings in most cities.

This is the same structural pattern the platform exists to counter: extractive intermediaries concentrating ownership at the expense of people who live in a place. The diagnosis maps directly to the Slow Economy thesis. The squeeze is housing and hospitality captured by capital; the prescription is coordination that keeps the economic benefit local.

## Why this belongs on this platform

The platform's primitives already model the relationships a local-stays surface needs:

- **Person (Member)** — a real human who lives in a community and has a spare room, a guest house, or a home they travel away from sometimes. The host is a Person first, a host second — the same person who might also sell sourdough at the Saturday market, host a Run Club, and offer yard help on weekends. Hosting is a verb a Person holds, not a role-as-identity.

- **Item (kind='stay')** — a new Item kind. A rental listing is something a Person declares: here is my place, here is what it offers, here is when it's available, here is what it costs. It has a description, a Location, a schedule (availability), a price, responses from other Persons (booking requests, reviews), and a lifecycle (active, booked, withdrawn). The shape is the same as a Product or a Service — a Person declaring something at a Location, discoverable by proximity, with a kind-specific response surface.

- **Location** — the property itself. A permanent Location of kind='residence' or similar. The Location hosts the Item; the Item is what travelers discover and book.

- **Group** — not required for stays. A host doesn't need to be part of a Group to list a rental. But a neighborhood association (kind='place' Group) might eventually want visibility into how many short-term rentals exist in their area — the Group is the natural addressee for that transparency.

The structural fit is clean: a stay is an Item declared by a Person at a Location, varying by kind. No new primitives needed.

## The anti-Airbnb design constraints

These constraints are what make this surface worth building. Without them, it's just another rental platform. With them, it is structurally incapable of producing the harms Airbnb produces.

### 1. Single-unit bias

One listing per Person is frictionless. A second requires manual review and written justification (inherited property, ADU on the same lot). Three or more is not supported. No property management companies. No corporate entities.

This is the load-bearing constraint. Everything else follows from it. If the platform makes it easy to operate at scale, the operators will come and the surface will reproduce Airbnb's failure mode. The friction is the feature.

**Why this works structurally:** The Person primitive already enforces "one real human." The platform does not model corporate shells. A Person who holds two stay Items triggers a review; a Person who attempts a third is told this platform is designed for people who host one place. The same structural decision that keeps the platform from modeling Business entities as corporate shells keeps the stays surface from modeling property portfolios.

### 2. Total cost transparency

The price a traveler sees on the search results page is the price they pay. No cleaning fee revealed at checkout. No service fee hidden behind a click. No "resort fee" or "amenity fee" appended after commitment.

The host sets one all-inclusive nightly rate. Taxes are shown separately (required by law) and clearly labeled. The price breakdown is available on tap: (nightly rate × nights) + applicable taxes = total. That's it.

**Why this matters beyond UX:** Hidden fees are a deception mechanic. They let hosts (and platforms) advertise a low price and extract a higher one after the traveler is psychologically committed. The platform's design philosophy — no dark patterns, no engagement optimization, no information asymmetry — extends to pricing. The number you see is the number you pay.

### 3. Amenity competition, not price competition

Hosts differentiate on what they provide — gourmet coffee from the local roaster, beach cruisers in the garage, a curated neighborhood guide, a stocked fridge, a welcome basket. The listing page highlights these extras prominently. Search results can be filtered by amenities. The default sort is not lowest price.

**Why this matters structurally:** Price competition in rental platforms creates a race to the bottom that rewards operators who minimize per-unit cost through scale. Amenity competition rewards hosts who invest in the guest experience — which correlates with hosts who actually live nearby, know the neighborhood, and care about their place. The competition axis is the selection pressure.

**Platform cross-link:** Amenities can reference other platform Members. "Coffee from [Local Roaster]" links to that Member's profile. "Bikes from [Community Bike Shop]" links to their Items. The stays surface becomes a discovery channel for the platform's Makers and Service Providers. This is the network effect: a traveler who books a stay discovers the neighborhood's independent economy through the host's recommendations.

### 4. Mandatory disclosures — anti-deception by structure

Hosts must disclose known conditions before publishing. The disclosure form is structured, not freeform:

- Nearby construction (yes/no + details)
- Noise sources (airport, highway, nightlife, neighbors)
- Shared spaces (walls, entrance, yard, laundry)
- Access limitations (stairs, parking, narrow roads)
- Checkout expectations (capped — no "do three loads of laundry")

Disclosures are displayed prominently on the listing page — not buried in fine print. Guest reviews specifically ask "Was the listing accurate?" Repeated inaccuracy flags the listing for review.

**Distance claims are computed, not host-asserted.** "5 min walk to the beach" is verified against actual walking routes from the property address. The listing shows the platform-computed distance. The host can add landmarks; the distances are always the platform's.

**Photos are verified.** Uploads require geo-tagged images with recent timestamps. The platform reviews photos against the actual property. Aspirational stock photography is not accepted.

### 5. Community protection mechanics

These are the features that prevent the stays surface from harming the communities it operates in.

**Neighborhood impact visibility.** Each listing shows how many other short-term rentals exist within a configurable radius, and the rental-to-resident ratio for the area. This is transparency, not restriction — travelers see the context, and communities see the concentration.

**Permit compliance.** In municipalities that require short-term rental permits, hosts must upload their permit number. Listings in regulated areas without a valid permit are not published. The platform does not help people circumvent local regulations.

**No instant book for new hosts.** The first three bookings require a message exchange between host and traveler before confirmation. This filters out hosts treating rentals as passive income machines — if you can't be bothered to have a conversation with your guest, this isn't your platform.

**Local residency signal.** Hosts who live in the same city/county as their rental get a "Local Host" badge. Travelers can filter for local hosts only. Hosts who live far away aren't banned but don't get the badge. This maps directly to the platform's existing locality-first trust pattern.

**No algorithmic pricing.** The platform does not suggest prices, run dynamic pricing, or penalize hosts for pricing "too high." Hosts set their own price. No race to the bottom. No surge pricing. The platform's revenue model (if any — see open questions) should not incentivize volume.

**Long-term rental conversion cooling.** If a property was previously a long-term rental (12+ month lease), the host must attest it wasn't converted solely for short-term profit. The platform may require a cooling-off period. This is the most direct anti-displacement mechanic: the platform should not make it profitable to evict a long-term tenant and list the unit as a short-term rental.

**Revenue transparency (later tier).** Aggregate data published periodically per area: how much rental income stayed in the community, how many hosts are local residents, average occupancy. Not individual data — aggregate accountability. The platform publishes its own impact numbers so the community can decide if the surface is helping or hurting.

**Community density threshold (later tier).** If an area reaches a configurable threshold of short-term rentals relative to residences, new listings in that area require community review before going live. The threshold is set in partnership with local governments or community Groups. This prevents saturation.

## How this maps to the loops

The stays surface doesn't map neatly to a single loop — it touches several:

- **Loop 3 (Land here)** — A traveler arriving in a community discovers it through a stay hosted by a local. The host's recommendations and amenity cross-links function as the "landing" surface for someone who might return as a resident, a customer, or a participant.

- **Loop 7 (Make and be found)** — Hosting is a form of making. A host who provides a distinctive local experience — curated, personal, rooted in the neighborhood — is doing the same work as a Maker who crafts sourdough. The stays surface makes them findable.

- **Loop 8 (Follow what you love)** — A traveler who had a great stay follows the host. Next trip, they check the host's availability first. The Follow mechanic works the same as it does for Makers.

- **Loop 9 (Find a local pro)** — The host's local recommendations surface Service Providers and Makers to travelers who wouldn't otherwise discover them. The stays surface amplifies the economic loop for every other Member the host recommends.

The stays surface is not a standalone product bolted onto the platform. It is a new Item kind that activates existing loops for a new audience (travelers) and creates a new economic channel for existing Members (local businesses discovered through stays).

## The Item kind: `stay`

| Schema (`items.kind`) | URL segment | UI label | UI verb (CTA) | Tier |
|---|---|---|---|---|
| `stay` | `…/r/[slug]` | Stay | Host (same verb as Event — a Person hosting something) | TBD |

URL segment `r` for "rental" — short, unambiguous, not taken by existing kinds. (Alternative: `…/stay/[slug]` if single-letter exhaustion is a concern at this point.)

**Kind-specific metadata (JSONB):**
- `property_type` (house, apartment, room, adu, guesthouse)
- `guest_capacity` (int)
- `nightly_rate` (decimal — all-inclusive, no separate fees)
- `cancellation_policy` (strict, moderate, flexible — plain-language description generated from enum)
- `amenities[]` (structured list + freeform descriptions; amenities can carry `linked_member_id` for cross-platform links)
- `disclosures{}` (structured: noise, construction, shared_spaces, access, checkout_rules)
- `photos[]` (with geo-tag and timestamp metadata)
- `availability` (calendar or schedule — TBD, may differ from the recurring-schedule model used by Gatherings)
- `unit_count` (int — for friction gate: 1 = standard, 2 = manual review, 3+ = rejected)
- `permit_number` (nullable — required in regulated areas)

**Kind-specific response surface:**
- Booking request (message exchange for new hosts; instant for established hosts)
- Guest review (accuracy-focused: "Was the listing accurate?")
- Host review of guest (communication, respect for house rules)

**Kind-specific state machine:**
- `active` → `booked` → `completed` → `active` (per booking cycle)
- `active` → `withdrawn` (host removes listing)
- `pending_review` (for second-unit listings awaiting manual review)

## What this is NOT

- **Not a hotel platform.** No corporate entities. No property management companies. No chains.
- **Not a price-competition platform.** No algorithmic pricing. No lowest-price sort. Hosts compete on experience, not on undercutting each other.
- **Not a passive-income platform.** The friction gate, the message-exchange requirement, the no-instant-book-for-new-hosts rule, and the checkout-task limits all select against hosts who want to operate without engagement.
- **Not a housing displacement tool.** The single-unit cap, the long-term-rental cooling period, the neighborhood density threshold, and the permit compliance requirement are structural anti-displacement mechanics.
- **Not a separate app.** It is a new Item kind on the existing platform, discoverable through the same locality-first index, benefiting from the same trust layer, and cross-linking to the same Members and Locations.

## Open questions

1. **Revenue model.** Airbnb takes 3% from hosts and up to 14% from guests. Should this platform charge a flat listing fee (no percentage — aligns incentives away from volume)? A small flat booking fee? Nothing (subsidized by the platform's other revenue)? The revenue model shapes the incentive structure more than any feature.

2. **Payments.** The platform doesn't currently process payments. Stays would require it. Build on Stripe Connect? Require off-platform payment (Venmo, cash)? The payment question is entangled with the revenue model.

3. **Availability model.** Existing Item schedules are recurring (Gatherings) or standing (Products, Services). Stays need calendar-based availability — blocked dates, minimum stays, seasonal rates. This is a new schedule type for the Item primitive.

4. **Photo verification at scale.** Manual photo review works for the first hundred listings. What's the verification process at a thousand? Ten thousand? AI-assisted? Community-attested (guests confirm photos match)?

5. **Timing.** The platform is in b1, focused on Gatherings, Products, Services, and Wonders. Stays is a deeper surface — it involves payments, calendars, and legal compliance (permits). It's naturally a b2 or b3 surface. When in the loop sequence does it make sense to build?

6. **"Main Street Stays" branding.** The platform's working name is Movers, Makers & Shakers. Does the stays surface get a sub-brand ("Main Street Stays" from earlier exploration), or is it just another Item kind with its own UI label? The sub-brand might help with traveler-facing marketing; it might also fragment the platform identity.

7. **Cancellation and dispute resolution.** What happens when a guest arrives and the listing doesn't match the disclosures? Automatic refund? Mediation? Photo evidence comparison? This is a trust-critical flow that doesn't exist for other Item kinds.

8. **Insurance.** Airbnb provides host liability insurance. Does this platform need to? Can it partner with a provider? Is this a Loop 13 spawn candidate (federated insurance for community hosts)?

9. **Interaction with municipality regulations.** Some cities ban short-term rentals. Some require permits. Some have occupancy taxes. The platform's permit-compliance requirement is a start, but the regulatory landscape is complex and varies by jurisdiction. How deep does the platform go?
