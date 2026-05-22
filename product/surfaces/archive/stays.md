# Product: Main Street Stays

**One-line description:** Short-term rental marketplace that favors single-property local hosts over multi-unit operators, with full cost transparency and amenity-driven competition.

**Hypothesis:** If travelers can find rentals from locals who own one property, with no hidden fees and clear conditions, they'll choose that over Airbnb — and the host community will self-select for quality over scale.

**Bundle Assignment:** b1 (T1), b2 (T2), b3 (T3)

**Category Vertical:** Main Street Stays is a category vertical extending the Main Street core platform. It inherits identity, owner profiles, map discovery, and community trust from the core (see `product/products/platform.md` and `product/systems/platform-core.md`). This file covers stays-specific capabilities only — everything a rental listing needs beyond what a standard business listing already provides.

## Core Principles

**Single-unit bias.** The platform is designed for hosts who rent one property. Listing a second unit is possible but introduces friction (manual review, longer onboarding, no bulk tools). Listing 3+ is not supported. This is a feature, not a limitation.

**Total cost upfront.** The search results page shows the final price. No cleaning fees revealed at checkout. No service fees hidden behind a click. The number a traveler sees first is the number they pay.

**Amenity competition, not price competition.** Hosts differentiate on what they offer — gourmet coffee, beach cruisers, a curated restaurant guide, a stocked fridge. The listing page highlights these extras prominently. Sort/filter by amenities, not by lowest price.

**Anti-deception by design.** Mandatory disclosures: construction nearby, shared walls, noise caveats, actual walking distance to landmarks (not "5 min to beach" when it's 20). Photo verification. No aspirational descriptions without matching reality.

**Community-first guardrails.** The platform actively limits behaviors that harm local housing markets. No corporate entities. Host must be a natural person. Property must not be in a municipality where short-term rentals are restricted unless the host has a valid permit on file.

## Inherited from Core Platform

These come from Main Street core — not reimplemented for Stays:

| Core Service | What Stays Uses It For |
|-----------|----------------------|
| Owner Profile | Host profile with name, photo, bio, social links, local residency badge |
| Identity Verification | Natural person attestation (b1), government ID check (b2) |
| Map & Discovery | Rental pins on shared map (house icon at T2), neighborhood exploration |
| Community Trust | Support/report signals, "Local Host" badge, ownership standing |
| Cross-Category Links | Amenity → business listing, local recommendations → business listings |

See `product/capabilities/platform-*.md` and `product/systems/platform-core.md` for details.

## Stays-Specific Capabilities

| ID | Name | Tier | Status | Scenario Ref |
|----|------|------|--------|--------------|
| S1 | Host Onboarding (Single Unit) | T1 | Design | — |
| S2 | Listing Creation | T1 | Design | — |
| S3 | Traveler Search & Browse | T1 | Design | — |
| S4 | Total Cost Display | T1 | Design | — |
| S5 | Booking Flow | T1 | Design | — |
| S6 | Mandatory Disclosures | T1 | Design | — |
| S7 | Amenity Showcase | T1 | Design | — |
| S8 | Host Verification | T1 | Design | — (uses platform Identity Verification) |
| S9 | Multi-Unit Friction | T1 | Design | — |
| S10 | Guest Reviews | T2 | Design | — |
| S11 | Host Reviews of Guests | T2 | Design | — |
| S12 | Neighborhood Context | T2 | Design | — |
| S13 | Local Recommendations | T2 | Design | — |
| S14 | Community Impact Score | T2 | Design | — |
| S15 | Permit Verification | T3 | Design | — |
| S16 | Dynamic Availability Calendar | T3 | Design | — |

## Tier Summary

### T1 (MVP)
Single-unit host onboarding, listing with mandatory disclosures, traveler search with total cost visible, booking request flow, amenity showcase, photo verification, multi-unit friction gate.
- S1–S9

### T2 (Community)
Two-way reviews, neighborhood context (walkability, noise, transit), host-curated local recommendations, community impact scoring (does this rental help or hurt the neighborhood?).
- S10–S14

### T3 (Trust & Scale)
Permit verification integration with municipalities, dynamic pricing/availability calendar, dispute resolution, insurance integration.
- S15–S16

## Community Protection: Items & Services That Favor Locals

This is the list of platform policies and features that actively protect local communities from the harms caused by rental platform scale.

1. **Single-unit cap.** One property per host is frictionless. Two requires manual review and justification (e.g., inherited property, ADU on same lot). Three+ is not supported. No property management companies.

2. **Natural person requirement.** Host must be an individual, not an LLC, corporation, or trust. This blocks institutional investors from using the platform.

3. **Local residency signal.** Hosts who live in the same city/county as their rental get a "Local Host" badge. Travelers can filter for local hosts only. Hosts who live far away aren't banned but don't get the badge.

4. **Permit compliance.** In municipalities that require short-term rental permits, hosts must upload their permit. Listings without permits in regulated areas are not published.

5. **Neighborhood impact disclosure.** Each listing shows: how many other short-term rentals are within 0.5 miles, the rental-to-resident ratio for the block/neighborhood, and whether the area has expressed community concern about short-term rentals.

6. **No instant book for new hosts.** First 3 bookings require host-traveler message exchange before confirmation. This filters out hosts treating rentals as passive income machines.

7. **Revenue transparency (T3).** Aggregate data (not individual) published quarterly: how much rental income stayed in the community, how many hosts are local residents, average nights booked. Keeps the platform accountable.

8. **Local business integration.** Amenity showcase can link to Movers, Makers & Shakers businesses. "Coffee from [Local Roaster]" links to their MSM listing. Rentals become a channel for local business discovery.

9. **No algorithmic pricing pressure.** The platform does not suggest prices, run dynamic pricing, or penalize hosts for pricing "too high." Hosts set their own price. No race to the bottom.

10. **Community veto (T3).** If a neighborhood reaches a threshold of short-term rentals (configurable per municipality), new listings in that area require community board approval before going live. Prevents saturation.

11. **Long-term rental preference.** If a property was previously a long-term rental (12+ month lease), the host must attest it wasn't converted solely for short-term profit. Platform may require a cooling-off period.

12. **Host tax reporting assistance.** Help hosts report rental income correctly. Good hosts want to be compliant; make it easy. Bad actors avoid platforms that make compliance visible.

## Anti-Deception Features

- **Verified photos only.** Host uploads photos; platform verifies they match the actual property (photo review process, geo-tagged timestamps).
- **Distance claims audited.** "5 min walk to beach" is verified against actual walking routes, not straight-line distance. Listing shows the real number.
- **Cleaning fee ban.** There is no cleaning fee line item. Cleaning cost is included in the nightly rate. The price you see is the price you pay.
- **Checkout task limits.** Hosts cannot require guests to do laundry, take out trash, strip beds, etc. beyond reasonable expectations. Onerous checkout requirements are flagged.
- **Cancellation clarity.** Cancellation policy shown in plain language on the search results card, not buried in terms. "Free cancellation until May 1" or "Non-refundable" — no ambiguity.

## Open Questions

- How do we verify single-unit claims? Property records lookup? Honor system with spot checks?
- Should we charge hosts a flat listing fee (no percentage) to align incentives?
- How do we handle vacation homes (owner lives there part-time, rents part-time)?
- ~~What's the right relationship between Main Street Stays and the Movers, Makers & Shakers map?~~ **RESOLVED: Same app, shared platform core, separate vertical. See `product/products/platform.md`.**
- How do we handle markets where Airbnb is deeply entrenched? Do we need a supply-first or demand-first launch strategy?

## Changelog

**2026-04-20** — Initial product design
