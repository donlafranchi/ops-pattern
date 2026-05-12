# Plan: Food Pivot — Full Product Vision Replacement

**Created:** 2026-04-15
**Status:** Ready to execute

## Context

Main Street Market is pivoting from a general local-business ownership transparency platform to a **food-first platform** connecting consumers with local farmers, ranchers, and their food. The `food-pivot-scenarios.md` file defines two founding scenarios (Consumer Sarah, Farmer Jim) with ~20 new capabilities that replace the current general-business vision. This is a clean restart on product definition while preserving compatible infrastructure (map, auth, tech stack).

## What Changes

### 1. Update North Stars
**File:** `product/foundation/north-stars.md`
- Replace current north star with the two food-pivot north stars
- Add strategic framing notes (pro-competition language, food as wedge, DIT framing)

### 2. Archive Existing Capabilities
**Move to:** `product/capabilities/archive/`
- All 13 current capabilities move to archive (business-promotions, business-events, business-updates, consumer-feed, community-impact-badge, community-questions, community-signals, business-detail-view, business-registration, map-search, shareable-listing, landing-page, search-results-list)

### 3. Write New Capabilities (from scenarios)
**Dir:** `product/capabilities/`
One file per capability extracted from the two founding scenarios:

**Consumer-side:**
- `farm-discovery-map` — Browse nearby farms/ranches on a map
- `farm-profile` — Farm detail with story, products, embedded video
- `product-availability` — Current week's offerings, pricing, pickup options
- `brand-transparency-scanner` — Scan barcode, see ownership/sourcing/ingredients
- `local-alternative-suggestions` — Corporate scan → local producer alternative
- `pickup-point-network` — Shared community pickup locations
- `dit-group-buy` — Neighbors organize collective purchases
- `creator-content-integration` — Embedded TikTok/Instagram from creators
- `progressive-engagement` — Incremental swaps, no all-or-nothing
- `social-sharing` — Share farm/product/app links

**Farmer-side:**
- `farm-self-registration` — Mobile-first profile creation in <10 min
- `farm-product-management` — Availability, pricing, quantities from phone
- `farm-pickup-configuration` — On-farm + shared drop points with schedules
- `farm-analytics` — Views, clicks, zip code reach
- `farm-social-auto-pull` — TikTok/Instagram content auto-surfaces on profile
- `creator-connection` — Creators discover and reach out to farmers
- `farmer-controlled-pricing` — Platform never sets/suggests prices
- `customer-relationship-ownership` — Farmer sees/communicates with customers directly

### 4. Write New Systems
**Dir:** `product/systems/`

**New systems:**
- `brand-transparency.md` — Barcode scanning, brand ownership DB, sourcing/ingredient display, local alternative matching (T1: manual brand data + basic scan; T2: UPC API integration; T3: full supply chain tracing)
- `dit-group-buy.md` — Consumer-initiated bulk purchase, farmer fulfillment, split coordination (T1: basic group creation + join; T2: payment splitting; T3: recurring group buys)
- `pickup-network.md` — Shared drop points, multi-farm scheduling, consumer pickup selection (T1: farmer-defined locations; T2: community-nominated points; T3: route optimization)
- `social-content-integration.md` — oEmbed for TikTok/Instagram, auto-pull from farmer accounts, creator content embedding (T1: manual embed links; T2: auto-pull via API; T3: content moderation + featured creators)
- `farm-profile.md` — Farm data model, seasonal availability, product types, growing practices, story + media (T1: basic text profile; T2: rich media + seasonal calendar; T3: farm-to-table partnerships)

**Update existing:**
- `map-system.md` — Repurpose for farm pins instead of business ownership pins
- `business-data.md` → rename to `farm-data.md` — Schema for farms/ranches instead of general businesses

**Archive:**
- `ownership-classification.md` → archive (replaced by farm profiles + brand transparency)
- `community-impact.md` → archive

### 5. Update Product Files
**Dir:** `product/products/`

**Archive existing:** `map.md`, `ownership.md`, `business-data.md`

**Write new:**
- `farm-discovery.md` — Map + farm profiles + product availability
- `brand-transparency.md` — Scanner + ownership display + local alternatives
- `dit-community.md` — Group buys + pickup network + social sharing
- `content-platform.md` — Social embeds + creator connections + progressive engagement

### 6. Rewrite MVP Bundle
**File:** `planning/bundles/b1-mvp.md`
- New hypothesis: food-first, farmer + consumer two-sided
- New features: F001 Farm Discovery Map, F002 Farm Profile, F003 Farm Registration, F004 Product Availability, F005 Brand Scanner (basic), F006 Pickup Points, F007 Social Sharing
- DIT group buys, creator integration, analytics → deferred to b2
- Success metrics: farms registered, consumer orders, pickup points active

### 7. Archive Existing Scenarios
**Move to:** `planning/scenarios/archive/`
- All 11 current F001-F007 scenarios

### 8. Move Founding Scenarios to Product
**Move:** `food-pivot-scenarios.md` → `product/foundation/founding-scenarios.md` (replace existing)

### 9. Write Language Guidelines
**File:** `product/foundation/language-guidelines.md` (new)
- Extract language/framing table from food-pivot-scenarios.md
- DIT terminology, neutral brand scanner language, "know your food" framing

### 10. Update JOURNAL.md
Add entry for 2026-04-15 documenting the food pivot decision.

### 11. Update Root CLAUDE.md
- Update project overview to reflect food-first platform
- Update language/framing table with food-specific terms

### 12. Update planning/DECISIONS.md
- ADR-3 (or next): Food-first pivot — document the strategic decision

## Execution Order

1. Create archive directories (`product/capabilities/archive/`, `product/systems/archive/`, `product/products/archive/`, `planning/scenarios/archive/`)
2. Move archived files
3. Write north stars + language guidelines + founding scenarios
4. Write new capabilities (18 files)
5. Write new systems (5 new + 2 updated)
6. Write new product files (4 files)
7. Rewrite b1 bundle
8. Update JOURNAL.md, root CLAUDE.md, DECISIONS.md
9. Remove `food-pivot-scenarios.md` from root (content distributed)

## Verification

- All archive directories populated with old files
- All new capabilities reference correct bundles
- Systems have T1/T2/T3 tiers
- Product files consolidate capabilities correctly
- b1 bundle scope matches founding scenario capabilities
- JOURNAL.md reflects the pivot
- No orphaned references to old ownership-tier concepts in active files
