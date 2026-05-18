# T006: Map Search by Category and Location

**Scenario:** planning/scenarios/F001-map-view-search.md
**Status:** Complete
**Completed:** 2026-04-09T19:03:28-07:00

## Acceptance Criteria

- [x] Bottom-anchored search bar visible on the map view (per ADR-3)
- [x] Tapping search bar expands it / gives focus, keyboard opens on mobile
- [x] User can type a category (e.g., "vet", "grocery") or location (e.g., "Austin TX")
- [x] Autocomplete suggestions appear above the search bar as user types
- [x] Category matches show categories from existing businesses in the database
- [x] Location matches use Mapbox Geocoding API
- [x] On selection/submit: map pins filter to matching businesses; if location entered, map pans to that area
- [x] Clear/reset button appears when search is active
- [x] Tapping clear restores all pins and collapses search bar
- [x] No results: show "No [category] businesses found in this area" message
- [x] Fuzzy matching on common categories (e.g., "vetrinarian" matches "Veterinary")
- [x] Combined search "vet in Austin TX" filters category AND pans to location
- [x] Empty search submitted: no-op
- [x] Tapping outside search dismisses it
- [x] Autocomplete debounced at 300ms
- [x] Tests passing
- [x] BUILD-LOG.md updated

## Notes

Create:
- `src/components/SearchBar.tsx` — bottom-anchored, expands upward on focus
- `src/hooks/useSearchSuggestions.ts` — fetches category matches from Supabase + location matches from Mapbox Geocoding API
- `src/lib/geocoding.ts` — wrapper for Mapbox Geocoding API calls

Category search: query distinct categories from `businesses` table with `ilike` filter. For fuzzy matching, use Postgres trigram similarity or simple `ilike '%term%'`.

Location search: hit Mapbox Geocoding API (`https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json`).

Combined search parsing: split on " in " to separate category from location. If no " in ", try both category and location matching.

Search bar z-index must be above map but below detail card. Follow ADR-3 — all controls at bottom of viewport.

## Completion

Date: 2026-04-09
Commit: aadef3b
