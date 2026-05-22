# Capability: Search Results List

**Description:** Search results appear as a scrollable list below the map, with filter/sort controls between map and list

**Bundles:** b1

**User Story:**
As a consumer, I want to search for a business type and see results as a list below the map sorted by proximity, so I can quickly compare options and their ownership status.

**Scope:**
- Split-screen layout: map (top ~40%) + results list (bottom ~60%)
- Search by business type (e.g., "coffee") uses geolocation to find nearby matches
- Results list shows: name, distance, category, ownership badge
- Tapping a result highlights pin on map and opens detail card
- Filter/sort toolbar between map and list:
  - Sort: distance, name, ownership type
  - Filter: ownership type (independent, franchise, PE, corporate)
  - Filter: category
- Pagination or infinite scroll for large result sets
- Empty state when no results match

**Out of Scope:**
- Full-text search across business names/descriptions (b2)
- Saved searches (b2)
- Search history (b2)
- Brand-specific filter (b2)

**Related Capabilities:**
- Map Search (map portion of split view)
- Business Detail View (tap result to open)
