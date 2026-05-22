# System: Main Street Stays

**Purpose:** Short-term rental marketplace with single-unit host bias, full cost transparency, and amenity-driven differentiation

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

**Extends:** Main Street core platform (`product/systems/platform-core.md`). Inherits identity/auth, owner profiles, map layer, and community trust. This file covers what the Stays category vertical adds on top of the core — specialized listing type, onboarding, booking, disclosures, and amenities.

## T1 — MVP Tier

### Host Onboarding
- Natural person verification via platform core Identity & Auth (no LLCs/corps)
- Single property registration with address, type (house, apartment, ADU, room)
- Photo upload with geo-tag and timestamp metadata
- Amenity checklist (structured) + custom amenity freeform entries
- Mandatory disclosure form: noise, construction, shared spaces, access limitations, actual distances to landmarks
- Cancellation policy selection (strict, moderate, flexible) — shown in plain language
- Nightly rate input — all-inclusive, no separate cleaning/service fees
- Host profile: name, photo, short bio, how long they've lived in the area

### Multi-Unit Friction Gate
- First listing: standard onboarding (minutes)
- Second listing: manual review queue, written justification required (inherited property, ADU on same lot, etc.), 48-hour minimum review period
- Third+ listing: rejected. Platform does not support 3+ properties per host.
- Detection: address matching, tax record lookup (T3), behavioral signals (identical listing language, same photos style)

### Listing Page
- Hero photos (verified)
- Total nightly cost (prominent, largest text on page)
- Amenity showcase section — visual grid with icons, host descriptions ("Locally roasted coffee from [Roaster Name]", "Two beach cruisers in the garage")
- Mandatory disclosures section — structured, not buried. Construction? Noise? Shared walls? All visible before booking.
- Cancellation policy in plain English
- "Local Host" badge if host lives in same city/county
- Map showing actual walking/driving distances to key landmarks (computed, not host-claimed)
- House rules section
- Checkout expectations (capped — no onerous tasks)

### Traveler Search
- Location-based search with map view
- Date picker for check-in/check-out
- Total cost shown on every search result card (not "per night + fees")
- Filter by: amenities, property type, guest count, Local Host badge
- Sort by: amenities match, distance, newest (NOT by lowest price as primary sort)
- Each result card shows: photo, total cost, top 3 amenities, cancellation policy, Local Host badge

### Booking Flow
- New hosts (first 3 bookings): message exchange required before confirmation
- Established hosts: request-to-book or instant book (host choice)
- Payment: full amount shown at booking, no surprise fees
- Confirmation includes: check-in instructions, house rules, host contact, neighborhood tips

## T2 — Community Tier

### Reviews
- Guest reviews host: accuracy (did listing match reality?), communication, amenities quality, neighborhood
- Host reviews guest: communication, house rules compliance, respectfulness
- Review prompts specifically ask about disclosure accuracy ("Was the noise level as described?")
- No review gating — both parties can review independently

### Neighborhood Context
- Walkability score (computed from OSM data)
- Transit proximity
- Short-term rental density in area (how many other STRs within 0.5 mi)
- Rental-to-resident ratio for the block
- Noise indicators (airport proximity, highway, nightlife district)

### Local Recommendations
- Host-curated list of local businesses, restaurants, activities
- Links to Movers, Makers & Shakers listings where available
- "This host recommends 5 independent businesses" as a listing signal

### Community Impact Score
- Composite score based on: host is local resident, property was not converted from long-term rental, host recommends local businesses, guest reviews confirm positive neighborhood impact
- Displayed on listing as a simple badge (not a number — avoids gaming)

## T3 — Trust & Scale Tier

### Permit Verification
- Integration with municipal permit databases where available
- Host uploads permit; platform cross-references
- Listings in regulated areas without valid permit are unpublished
- Periodic re-verification

### Dynamic Availability
- Calendar management for hosts
- Blocked dates, minimum stay requirements
- Seasonal pricing (host-set, no algorithmic suggestions)

### Revenue Transparency
- Quarterly aggregate reports: total rental income in community, % local hosts, average occupancy
- Published publicly per city/region
- Platform accountability metric

### Community Veto
- Configurable STR density threshold per municipality
- New listings in saturated areas require community board review
- Partnership with local governments for threshold setting

### Dispute Resolution
- Structured mediation flow
- Photo evidence comparison (booking photos vs. check-in photos)
- Refund policies enforced automatically based on disclosure accuracy

## Integration Points

- **Platform Core:** Identity & Auth, Owner Profile, Map & Discovery, Community Trust (see `product/systems/platform-core.md`)
- **Cross-vertical:** Business listings (amenity cross-links, local recommendations via Cross-Vertical Links capability)
- **Map System:** Rental pins on shared map (house icon shape), neighborhood context overlay
- **External:** Municipal permit databases, OSM/mapping data, payment processor
