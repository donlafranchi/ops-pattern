# Scenario: Search / Explore — List and Map views with product search and filters

**Feature:** F010
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- Vendors exist in the database with product categories and market associations
- The user taps the Search bar (from Home feed) OR the Search/Explore tab in the bottom nav

### When
- The Search screen loads (empty state)

### Then
- A search field is focused at the top with placeholder "Search vendors, products, markets"
- Below the search field: a row of filter chips
  - Market (defaults to "Your Market" if set, else "Any Market")
  - Category
  - Day of week
- Below the filters: a **view toggle** (segmented control) with two options: **List** (default) and **Map**
- In the empty state (no search yet), the screen shows:
  - **Trending searches** — a horizontal rail of chips (e.g., "sourdough", "honey", "tomatoes", "soap")
  - **Popular categories** — an 8-tile grid (same categories as Home feed's Shop by Category)
  - **Recent searches** (authenticated users with history) — a vertical list, each row with a clear (×) button

### And When
- The user types into the search field

### Then
- A dropdown suggests matching categories and vendor names as they type
- Tapping a suggestion or submitting runs the search

### And When
- The user submits a search

### Then
- Results are shown in the currently selected view (List or Map)
- **List view:**
  - Vertical scrollable list of vendor cards
  - Each card: photo, name, product tagline, next market day, distance (if location available), follow button
  - Result count shown at top (e.g., "12 vendors match 'honey'")
  - Sorted by relevance → distance → name
- **Map view:**
  - Full-screen map with vendor pins
  - Pins are color-coded by primary product category (e.g., green = produce, amber = honey/jams, brown = bread, blue = soap/body, purple = crafts). Ownership badge coloring deprecated for this product — all farmers market vendors are independent by definition
  - Tapping a pin opens a mini card at the bottom with vendor photo, name, tagline, and a "View Profile" CTA
  - A small "List" button floats top-right to toggle back to List

### And When
- The user changes any filter chip

### Then
- Results update immediately in both views
- Active filters show filled chip state; inactive filters are outlined
- A "Clear all" option appears when any filter is active

### And When
- The user toggles from List to Map (or back) after running a search

### Then
- The same result set is shown in the new view
- Filters, search term, and scroll/map position are preserved where possible

### And When
- Search returns zero results

### Then
- The view shows: "No vendors match [term] with your current filters"
- Suggestions: "Try clearing filters" or "Search all markets"

## Edge Cases

- Empty search submission: show trending searches, do not run a real search
- Map view with no location permission: map defaults to the selected market's location, or a geographic center if no market set
- Very short search term (1–2 chars): show suggestions dropdown only, don't submit
- Map pins clustering: clusters at lower zoom levels (existing behavior from T005 preserved)
- Network slow: List skeleton loaders; Map shows loading spinner centered

## Assumptions

- Search matches on vendor product tags, category, and name (case-insensitive, partial)
- List is the default view on mobile; Map is one tap away
- Map tile provider is Mapbox (existing integration from T004)
- Pins link to vendor profiles (F011); tapping does NOT open a full-screen modal in b1

## Comments

This replaces the old map-first F007 scenario. The Search tab is the second-most-important screen (after Home feed). Etsy has no map because their sellers aren't geographically bound — ours are. Map is an equal-weight view to List, toggleable per search. Default view is List (mobile-first).
