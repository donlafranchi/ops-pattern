# T019: Geocoding Pipeline + Pin Confirmation UI

> **ARCHIVED 2026-05-09 — superseded by the primitives migration.** Per the ticket audit (`planning/PIPELINE-AUDIT.md` and JOURNAL 2026-05-09): operates on the doomed `businesses` table, bypasses ADR-7 (action layer), pre-dates `locations` (T029) which is the new home for pin coordinates. The geocode-and-confirm UX *pattern* survives — re-open as a sub-task inside the Location composer (a Phase 3 ticket, currently unwritten) against `location.create` / `location.update` action handlers.

**Scenario:** planning/scenarios/F014-vendor-pin-confirmation.md (also archived)
**Status:** Archived

## Acceptance Criteria

- [ ] Add `pin_source` column to `businesses` table: text enum (`geocoded`, `vendor_adjusted`, `manual`), default `geocoded`
- [ ] Integrate Mapbox Geocoding API: server-side utility function `geocodeAddress(address, city, state, zip)` → `{ lat, lng, relevance, resolvedAddress }`
- [ ] Registration form (F003): after address fields are filled, trigger geocode on blur or explicit "Find on map" button
- [ ] Map preview component: renders below address fields showing pin at geocoded location, zoom ~16, resolved address text beneath
- [ ] Confirm/Adjust UI: two buttons — "Yes, this is correct" (saves `pin_source: geocoded`) and "Adjust location" (enables pin drag)
- [ ] Draggable pin: in adjust mode, pin is draggable via Mapbox GL drag events; on release, show "Confirm adjusted location" button; saves `pin_source: vendor_adjusted`
- [ ] Low-confidence handling: if Mapbox `relevance` < 0.8, show yellow warning banner and default to adjust mode (pin starts draggable)
- [ ] Geocode failure: show error message, display "Place your pin manually" fallback — opens map centered on city/state for manual pin drop, saves `pin_source: manual`
- [ ] Store both raw address string (as entered) and resolved lat/lng in the businesses record
- [ ] Mapbox Geocoding API key stored in environment variables (not client-side exposed — geocode calls go through server action or API route)
- [ ] Tests: geocode success → confirm flow, geocode success → adjust flow, geocode low confidence → warning shown, geocode failure → manual fallback
- [ ] BUILD-LOG.md updated

## Notes

Mapbox Geocoding API: use the `mapbox.places` endpoint. The `relevance` field in the response (0–1) determines confidence. Docs: https://docs.mapbox.com/api/search/geocoding/

The map preview should use the same Mapbox GL style as the main explore map. Reuse the existing Mapbox GL setup from the map view.

This extends the existing registration form from T003 (or wherever F003 was implemented). The pin confirmation step is inserted between address entry and final submission — it's not a separate page.

For the draggable pin, use Mapbox GL's `Marker` with `draggable: true`. Listen to `dragend` event to capture new coordinates.

Server action for geocoding (Next.js server action or API route) to keep the Mapbox token server-side.

## Completion

Date:
Commit:
