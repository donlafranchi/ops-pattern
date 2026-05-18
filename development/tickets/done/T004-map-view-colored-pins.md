# T004: Map View with Colored Ownership Pins

**Scenario:** planning/scenarios/F001-map-view-colored-pins.md
**Status:** Complete
**Completed:** 2026-04-09T18:28:02-07:00

## Acceptance Criteria

- [x] Full-screen Mapbox map loads on `/` (home page)
- [x] Map centers on user's geolocation on first load
- [x] Geolocation denied: map defaults to US center (39.8283, -98.5795, zoom 4)
- [x] Business pins render with colors by ownership tier: gold (independent), deep green (co-op), amber (local franchise), bright blue (challenger), warm purple (mission-driven), flat grey (PE/corporate)
- [x] Pins are loaded from Supabase based on map viewport (bounding box query)
- [x] User can pan and zoom with standard touch/mouse gestures
- [x] Tapping a pin opens the business detail card (stub for now — T007 implements the card)
- [x] No businesses in viewport: map shows empty, no error
- [x] Map tiles load progressively on slow network
- [x] Tests passing
- [x] BUILD-LOG.md updated

## Notes

Use `mapbox-gl` directly (not react-map-gl) for full control. Create:
- `src/components/Map.tsx` — main map component
- `src/lib/map-config.ts` — style, default center, zoom levels, pin colors
- `src/hooks/useMapBusinesses.ts` — fetches businesses within bounding box from Supabase

Pin rendering: use Mapbox GeoJSON source + circle/symbol layers. Color is driven by `ownership_tier` property using a `match` expression.

Bounding box query: on map `moveend` event, get bounds and query Supabase with `latitude`/`longitude` filters. Debounce to avoid excessive queries (300ms).

Pin color map (must match Tailwind tokens from T001):
- independent: #D4A017
- coop: #1B7A3D
- local-franchise: #E8A317
- challenger: #2196F3
- mission-driven: #9C27B0
- pe-corporate: #9E9E9E

## Completion

Date: 2026-04-09
Commit: f31d0d0
