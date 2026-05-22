# Product: Main Street

**One-line description:** A local business discovery platform with category verticals — the core is finding and supporting independent businesses; verticals like Stays and Harvest add specialized listing types for rentals, farms, and more.

**Hypothesis:** Local businesses, rental hosts, and food producers share the same structural problem: they're invisible next to well-funded corporate competitors. A single platform with a common trust layer and map-based discovery creates network effects — a traveler who finds a rental also discovers the neighborhood's independent shops, and a customer who finds a local butcher also finds the ranch that supplies them.

## Architecture: Core + Verticals

**Main Street is the platform.** It is local business discovery — the map, the ownership badges, the community trust layer, the profiles. This is what exists today and what b1 ships.

**Verticals are specialized categories** that extend the core with their own listing types, onboarding flows, detail pages, and domain-specific features. They are not separate apps or sibling products. They inherit everything from the core and add on top of it.

```
Main Street (core platform)
├── Local business listings, map, ownership, community trust
├── Identity, profiles, auth
│
├── Main Street Stays (vertical)
│   └── Short-term rentals: booking, availability, amenities, disclosures
│
├── Main Street Harvest (vertical)
│   └── Local farms, ranches, food producers: products, seasons, pickup/delivery
│
└── Future verticals
    └── Services, trades, artisans, etc.
```

### What the Core Provides (all verticals inherit)

| Service | Description |
|---------|-------------|
| Identity & Auth | Single account, natural person verification, Supabase email auth |
| Owner Profile | Name, photo, bio, contact info, social links, local residency badge |
| Map & Discovery | Shared map with pins for all listing types, location search, geolocation |
| Community Trust | Ownership classification, community signals (support/report), standing indicators |
| Listing Base | Every listing has an owner, an address, a map pin, and a trust/ownership signal |
| **Producer Growth** | Cross-cutting service for makers — founder dashboard, bulletins, follower analytics, listing health, peer benchmarks. See [systems/vendor-intelligence.md](../systems/vendor-intelligence.md) and [foundation/platform-promise.md § Our Promise to Producers](../foundation/platform-promise.md). |

**Producer growth is intentionally a cross-cutting service, not a vertical.** It applies to every listing type — a farmer in Harvest gets the same dashboard a coffee shop in core gets. This is the platform's structural commitment to the producer covenant.

### What Verticals Add

Each vertical defines:
- A specialized **listing type** with its own fields (a rental has availability + amenities; a farm has products + seasons)
- A specialized **onboarding flow** (a host discloses noise and sets nightly rates; a rancher lists cuts and pickup windows)
- A specialized **detail page** (rental shows total cost and disclosures; farm shows product catalog and CSA options)
- Specialized **search/filter** (stays filters by dates and amenities; harvest filters by product type and pickup distance)
- Domain-specific **policies** (stays has single-unit friction; harvest might have food safety attestation)

### How Verticals Connect

- A Stays host stocks coffee from a local roaster → links to that business's Main Street listing
- A Harvest producer sells at a local restaurant → links to that restaurant's Main Street listing
- A traveler browses the map and sees businesses, rentals, and farm stands in the same area
- One account, one profile — a person can be a shop owner, a rental host, AND a farm operator
- Community trust signals use the same framework across all listing types

### What the Core Is NOT

- Not a generic listing framework. Each vertical has its own data model and UX.
- Not a constraint on vertical UX. Rental search (dates, guests) looks nothing like farm browse (products, seasons).
- Not a requirement that verticals ship together. Core ships first (b1). Stays ships when ready. Harvest ships later.

## Verticals

| Vertical | Name | Listing Type | Status |
|----------|------|-------------|--------|
| Core | Main Street | Local businesses (shops, restaurants, services) | In progress — b1 MVP |
| Vertical 1 | Main Street Stays | Short-term rentals from single-unit local hosts | Design |
| Vertical 2 | Main Street Harvest | Local farms, ranches, food producers | Naming only |

## Product Files (index)

This is the canonical list. **When a new system is added that warrants a product file, add it here.**

**Platform overview:**
- `product/products/platform.md` — This file. Architecture overview + core services + product file index.
- `product/products/community-platform.md` — Home / Explore / You page roles + capability tier map. Anchor for any feed/profile/discovery work.

**Core platform services:**
- `product/products/map.md` — Map discovery
- `product/products/business-data.md` — Business listing data
- `product/products/ownership.md` — Ownership classification & trust

**Verticals:**
- `product/products/stays.md` — Main Street Stays
- `product/products/harvest.md` — Main Street Harvest (TBD)

**Cross-cutting services without dedicated product files** (system docs are the source of truth):
- Producer Growth → `product/systems/vendor-intelligence.md`
- Vendor → Follower broadcast → `product/systems/vendor-bulletin.md`
- Events (markets, classes, projects, specials) → `product/systems/events.md`

## System Files

- `product/systems/platform-core.md` — Shared services: identity, profiles, map, trust, data model
- `product/systems/stays.md` — Stays-specific system design
- `product/systems/harvest.md` — Harvest-specific system design (TBD)

## Open Questions

- How does bottom navigation evolve? Tab per vertical? Unified map with category filters?
- Should verticals share the same bundle sequence (b1/b2/b3) or each get their own?
- How do we name future verticals? Main Street ___? (Services, Trades, Crafts?)
- Should the map distinguish listing types visually (pin shape) or just use category filters?

## Changelog

**2026-04-20** — Architecture reframed: Main Street is the core platform (local business discovery), verticals (Stays, Harvest) extend it with specialized categories. Replaces earlier "sibling verticals" model.
**2026-04-20** — Initial platform architecture (superseded by reframe above).
