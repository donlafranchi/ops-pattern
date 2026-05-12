# Scenario: Search Results — User searches by business type and sees list results

**Feature:** F007
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- Businesses exist in the database with categories and coordinates
- The user is viewing the map
- The user's location is known (geolocation granted)

### When
- The user types a business type (e.g., "coffee") in the search bar and submits

### Then
- The map pans to show nearby matching businesses as colored pins
- A results list appears below the map showing matching businesses:
  - Business name
  - Distance from user (e.g., "0.3 mi")
  - Category
  - Ownership badge (colored dot or label: independent/franchise/PE/corporate)
- Results are sorted by distance (nearest first) by default
- A filter/sort toolbar appears between the map and the results list

### And When
- The user taps a result in the list

### Then
- The corresponding pin is highlighted on the map
- The business detail card slides up

### And When
- The user taps a sort option (e.g., "Ownership")

### Then
- Results re-sort: independent first, then franchise, then PE, then corporate
- Map pins remain visible (no filtering from sort)

### And When
- The user taps a filter (e.g., "Independent only")

### Then
- Results list filters to show only independent businesses
- Map pins filter to show only independent pins
- Active filter is visually indicated (chip, highlight, etc.)
- A "Clear filters" option is available

### And When
- The user scrolls down past the visible results

### Then
- Additional results load (pagination or infinite scroll)
- Map remains visible and interactive above the list

## Edge Cases

- No results for search term in area: show "No [term] businesses found nearby" with suggestion to zoom out or search a different area
- Location not available: search returns results without distance sorting, show "Enable location for distance" prompt
- Very long results list (50+): paginate in batches of 20
- Searching while a filter is active: clear filters and apply new search

## Assumptions

- Distance is calculated client-side from user coordinates and business lat/lng
- Search matches against the `category` field (case-insensitive, partial match)
- Sort/filter state resets on new search
- Map viewport adjusts to fit search results (bounds fitting)

## Comments

UI layout reference: similar to Yelp mobile — map on top, scrollable list below, filter chips between them. The filter toolbar should be sticky so it stays visible while scrolling results.

Key sort options for b1: Distance (default), Ownership type.
Key filter options for b1: Ownership type (multi-select chips).
Category and brand filters deferred to b2.
