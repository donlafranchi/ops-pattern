# Scenario: Map View — Consumer sees colored pins by ownership type

**Feature:** F001 (product/systems/map-system.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- At least 3 businesses exist in the database with different ownership tiers (independent, PE/corporate, mission-driven)
- The user has a modern mobile browser with geolocation enabled

### When
- The user opens the app

### Then
- A full-screen Mapbox map loads centered on the user's location
- Business pins are visible, each colored by ownership tier:
  - Gold for independent
  - Deep green for co-op
  - Amber for local franchise
  - Bright blue for challenger
  - Warm purple for mission-driven
  - Flat grey for PE/corporate
- The user can pan and zoom with standard touch gestures
- At low zoom levels, nearby pins cluster into a single grouped indicator
- Tapping a pin opens the business detail card

## Edge Cases

- Geolocation denied: map defaults to a reasonable fallback (US center or last known location)
- No businesses in viewport: map shows empty state, no error
- Slow network: map tiles load progressively, pins appear when data arrives

## Assumptions

- Mapbox GL JS is the map provider
- Business data is fetched from Supabase on map viewport change
- Pin colors are determined by the `ownership_tier` field

## Comments

Pin colors must be visually distinct and accessible. Consider colorblind-friendly palette. Mobile-first — detail card should slide up from bottom, not a popup.
