# System: Platform Core (Main Street)

**Purpose:** The foundation of Main Street — local business discovery with identity, profiles, map, ownership classification, and community trust. This is the core app. Verticals (Stays, Harvest) extend it with specialized listing types and workflows.

**Bundles:** b1 (T1 — ships as the core app), evolves as verticals launch

## T1 — MVP Tier (the core app)

This is what exists today: local business listings on a map with ownership badges.

### Identity & Auth
- Supabase email auth
- Single account per person
- Role flags: consumer, business_owner (extensible — `host`, `producer` added by verticals)
- Session management, password reset

### Owner Profile
- One profile per person, regardless of how many listing types they have
- Fields: display name, photo, bio, contact email, phone (optional), social links
- "Member since" date
- Local residency: city/county where the person lives
- Profile page shows all listings (businesses now; vertical listings added as they launch)

### Map & Discovery
- Mapbox GL JS, mobile-first
- Colored pins by ownership tier (6-tier color system)
- Geolocation for initial viewport
- Clustering at low zoom
- Tap pin → business detail card
- Bottom nav search bar: search by category and/or location
- At T1, map shows one listing type: businesses

### Community Trust
- Ownership classification (6-tier: independent → PE/corporate)
- Community signals: support (heart) and report (concern with pillar category)
- Standing indicator derived from signals
- Natural person verification
- "Local" badge: person lives in same city/county as their listing(s)

### Business Listings (core listing type)
- Registration form: name, address, category, ownership type, story
- Business detail card: name, address, badge, story, support/report
- SSR shareable URLs with OG metadata
- Row-level security: owners edit own listings

## T2 — Vertical Extension Tier (when first vertical ships)

New capabilities needed when the platform gains its first vertical (Stays).

### Identity & Auth
- OAuth providers (Google, Apple)
- Two-factor authentication
- New role flags added by verticals (host, producer)
- Account linking (merge duplicate accounts)

### Owner Profile
- Verified identity badge (government ID check via third-party)
- Per-vertical activity: response rate, listings count by type
- Activity history across all listing types
- Profile page sections by listing type ("My Businesses", "My Rental", "My Farm")

### Map & Discovery
- Pin shape/icon distinguishes listing category (circle = business, house = stay, leaf = harvest)
- Pin color still represents ownership/trust tier within each category
- Category filter on map: show all, or filter to one category
- Clustering handles mixed listing types
- Tap pin → routes to category-specific detail card
- Saved locations / bookmarks (cross-category)
- "Explore neighborhood" mode: all listing types in a radius

### Community Trust
- Two-way review framework (adapts per category)
  - Businesses: support/report with pillar tagging
  - Stays: accuracy reviews, host/guest reviews
  - Harvest: quality reviews, freshness, pickup experience
- Review aggregation on owner profile (cross-category reputation)
- Community impact score (local residency + review quality + cross-links to other local listings)

### Cross-Category Links
- Stays amenity → business listing ("Coffee from [Local Roaster]")
- Stays local recommendations → business listings
- Harvest producer → restaurant that serves their products
- Business detail → "Stay nearby" or "Local producers" suggestions
- Owner profile → all listings across categories

## T3 — Scale Tier

### Identity & Auth
- Delegated access (e.g., property manager on behalf of host — limited, reviewed)
- Account suspension/ban (cross-category)

### Map & Discovery
- Heatmap overlays: independent business density, STR density, farm coverage
- Offline caching
- Custom map styles / dark mode

### Community Trust
- Automated ownership change detection
- Public transparency reports per city (business mix, STR density, local food coverage)
- Community veto system for STR-saturated neighborhoods

## Data Model Concept

```
accounts
├── id, email, password_hash, created_at
├── display_name, photo_url, bio, phone
├── city, state (residency)
├── roles[] (consumer, business_owner, host, producer)
└── verified (identity check)

listings (polymorphic base — shared fields)
├── id, account_id, category (business | stay | harvest)
├── name, address, city, state, zip, lat, lng
├── status (active, pending_review, suspended)
├── created_at, updated_at
└── → category-specific detail table

business_details
├── listing_id, business_category, ownership_tier, story
├── owner_since, community_badge
└── hours, phone, website (T2)

stay_details (added when Stays vertical ships)
├── listing_id, property_type, guest_capacity
├── nightly_rate (all-inclusive), cancellation_policy
├── disclosures{}, amenities[], checkout_rules
└── availability_calendar (T3)

harvest_details (added when Harvest vertical ships)
├── listing_id, farm_type, products[]
├── seasons[], pickup_options, delivery_radius
└── certifications (organic, grass-fed, etc.)

reviews
├── id, listing_id, reviewer_id, category
├── category-specific fields (accuracy for stays, pillar for businesses, quality for harvest)
└── created_at

community_signals
├── id, listing_id, account_id
├── type (support | report)
├── pillar, description (for reports)
└── created_at
```

## Integration Points

- **Verticals extend this:** Stays (product/systems/stays.md), Harvest (TBD)
- **Existing systems on this core:** Business Data, Map System, Ownership Classification
- **External:** Supabase (auth + DB), Mapbox (maps), identity verification provider (T2)
