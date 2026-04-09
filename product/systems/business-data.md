# System: Business Data

**Purpose:** Storage, retrieval, and management of business listings

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

## T1 — MVP Tier

- Supabase Postgres table: businesses
- Fields: name, address, city, state, zip, lat/lng, category, ownership_tier, story, owner_name, owner_since, source, verified, claimed
- Basic CRUD via Supabase client
- SSR-friendly detail page queries
- Row-level security: owners can edit own listings

## T2 — Core Tier

- Community-submitted listings (source: community, unverified badge)
- Claim flow: owner verifies and takes ownership of community-submitted listing
- Categories taxonomy (restaurant, retail, services, healthcare, etc.)
- Business hours, phone, website fields
- Photo uploads (Supabase Storage)

## T3 — Polish Tier

- Ownership history timeline (acquired dates, previous owners)
- PE parent company database (NVA, Smile Brands, etc.)
- Bulk import for community seeders
- Business analytics dashboard for owners

## Integration Points

- Connects to: Ownership Classification, Auth
- Used by: Map System, Business Registration, Visit Interaction, Flagging
