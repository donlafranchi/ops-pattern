# Scenario: Home Feed — Etsy-style modular feed with local market anchor

**Feature:** F008
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The user has opened the app (authenticated or guest)
- The user's location is known OR a market has been previously selected (or neither — see edge cases)

### When
- The home screen loads

### Then
- A **top app bar** is visible and sticky on scroll, containing:
  - A search field (full-width-ish) with placeholder "Search vendors, products, markets"
  - A favorites (heart) icon linking to followed vendors
  - A profile/avatar icon
- Below the top bar, a **market pill** reads "Your Market: [Name]" or "Select your market" if unset — tappable to open market selector (F009)
- The main content is a vertical scroll of modules, in this order:
  1. **Hero banner** — one featured vendor, full-width card with cover image, vendor name, tagline, "View Vendor" button
  2. **Shop by Category** — an 8-tile visual grid (2 columns × 4 rows on mobile), each tile shows a category name + icon/image (Bread, Produce, Honey & Jams, Soap & Body, Candles, Plants & Flowers, Crafts, Meat & Eggs); tapping a tile opens search results filtered to that category
  3. **Vendors near you** — a horizontal-scroll rail of vendor cards (5–10 items), each card: photo, name, product tagline, next market day chip; tapping opens the vendor profile
  4. **Markets near you** — a horizontal-scroll rail of market cards (3–6 items), each card: market name, next date, vendor count; tapping filters feed to that market
  5. **From vendors you follow** (authenticated users with ≥1 followed vendor only) — horizontal rail of followed vendors' next market appearances
  6. **Recently viewed** (authenticated users with history only) — horizontal rail of vendors the user has recently viewed
  7. **Explore all categories** — a link/button to the full category taxonomy
- Every module has a section header (H2) and, where appropriate, a "See all" link on the right

### And When
- The user taps a Shop by Category tile

### Then
- They are taken to Search results (F010) with that category pre-filtered, market filter applied if set

### And When
- The user taps a vendor card in any rail

### Then
- The vendor profile (F011) opens
- On back navigation, scroll position of the feed is preserved

### And When
- No market is selected AND no location is available

### Then
- The feed still loads with a generic nationwide set of vendors
- A non-blocking banner at the top of the feed reads: "Select your market to see what's local" with a "Select Market" CTA

### And When
- The user is a first-time visitor (guest, no history)

### Then
- "From vendors you follow" and "Recently viewed" modules are hidden entirely
- A one-line thesis statement is shown beneath the hero banner: "Every dollar you spend here stays here."

## Edge Cases

- Empty category: tile still shown; tapping leads to empty state in search results with alternative suggestions
- No vendors near user: hero falls back to a platform-wide featured vendor; "Vendors near you" is replaced with "Vendors across the country"
- Very slow network: each module renders skeleton loaders independently (progressive load)
- User has deeply customized preferences: recommendations module ranks by category affinity (deferred — b2)

## Assumptions

- The feed is composed of independently-loaded modules (any one can fail without breaking the page)
- Horizontal rails snap to card boundaries on mobile touch scroll
- "Shop by Category" tiles have fixed, curated imagery (not user-supplied)
- Hero featured vendor rotates daily based on manual curation in b1: admin sets `is_featured = true` and `featured_at` timestamp on a vendor; the feed picks the vendor with the most recent `featured_at` where `is_featured = true`
- Bottom navigation (F013) is present on this screen but specified separately

## Comments

This is a direct copy of Etsy's mobile home pattern — vertical scroll of modules, horizontal rails inside each. The key local-first additions are the market pill (top) and the "Markets near you" module. Map view is NOT on this screen — it lives on the Explore tab (F010).
