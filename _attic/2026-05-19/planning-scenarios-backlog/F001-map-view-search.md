# Scenario: Map View — User searches for a type of business

**Feature:** F001 (product/systems/map-system.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- Businesses exist in the database across multiple categories (vet, mechanic, restaurant, grocery, etc.)
- The user is viewing the map

### When
- The user taps the search bar at the bottom of the screen

### Then
- The search bar expands / receives focus (keyboard opens on mobile)
- The user can type a category (e.g., "vet", "mechanic", "grocery") or a location (e.g., "downtown", "Austin TX")
- As the user types, autocomplete suggestions appear above the search bar:
  - Category matches (e.g., "Veterinary" for "vet")
  - Location matches (e.g., "Austin, TX" for "austin")
- On selection or submit:
  - Map pins filter to show only matching businesses
  - If a location was entered, the map pans to that area
  - A clear/reset button appears to restore all pins

### And When
- The user taps the clear/reset button

### Then
- All pins are restored
- Search bar returns to collapsed state

## Edge Cases

- No results for category in current viewport: show "No [category] businesses found in this area" message, do not clear map
- Misspellings: fuzzy matching on common categories (e.g., "vetrinarian" → "Veterinary")
- Combined search: "vet in Austin TX" should filter category AND pan to location
- Empty search submitted: no-op, all pins remain

## Assumptions

- Categories are derived from the business registration `category` field (open/taggable per ADR-2)
- Location search uses Mapbox Geocoding API for place-to-coordinates
- Category matching is a simple text search against existing categories in the database
- Autocomplete is debounced (300ms) to reduce API calls

## Comments

UX must follow established patterns from Google Maps and Apple Maps:
- Bottom-anchored search bar, thumb-reachable
- Search suggestions appear as a list above the bar, pushing content up
- Map remains visible behind the search overlay
- Tapping outside the search dismisses it
- All primary navigation stays at the bottom — never at the top of the viewport
- Detail cards, search, and navigation all slide up from the bottom

This is not full-text search across business names/descriptions (that's b2). This is category + location filtering — the minimum needed so Maria can find a vet without scrolling past coffee shops.
