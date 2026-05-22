# Scenario: Vendor Pin Confirmation — Vendor verifies or adjusts pin placement during registration

**Feature:** F014 (product/systems/vendor-self-service.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The vendor is on the business registration form (F003)
- The vendor has entered a street address, city, state, and zip

### When
- The vendor submits the address (or the address fields lose focus)

### Then
- The address is geocoded to lat/lng via Mapbox Geocoding API
- A map preview appears below (or adjacent to) the address fields, showing:
  - A pin at the geocoded location
  - Enough zoom to show surrounding streets/landmarks (approx zoom 16–17)
  - The resolved address displayed as text beneath the map ("We placed your pin at: [resolved address]")
- The vendor sees a confirmation prompt: "Is this the right location?"
- Two actions are available:
  1. **Confirm** — accepts the geocoded pin as-is
  2. **Adjust** — enables drag mode on the pin

### And When
- The vendor taps "Confirm"

### Then
- The pin coordinates are saved as `pin_source: geocoded`
- Registration continues to the next step (or submits, per F003 flow)

### And When
- The vendor taps "Adjust" and drags the pin to a new location

### Then
- The pin is draggable on the map
- As the pin moves, the lat/lng updates in real time (no visible coordinates — internal only)
- When the vendor releases the pin, a "Confirm adjusted location" button appears
- On confirm, coordinates are saved as `pin_source: vendor_adjusted`
- Registration continues

### And When
- The geocode returns low confidence (ambiguous match, partial match, or multiple candidates)

### Then
- The map preview still appears with the best-guess pin
- A yellow warning banner reads: "We couldn't find an exact match. Please verify or drag your pin to the right spot."
- The pin starts in drag mode (adjust is the default for low-confidence results)

### And When
- The geocode fails entirely (no results)

### Then
- No map preview appears
- An error message reads: "We couldn't find that address. Please check your address and try again."
- The vendor cannot proceed until the address geocodes successfully or they manually place a pin
- A fallback option appears: "Place your pin manually" — opens a zoomable map centered on the city/state, vendor drops a pin
- Manual placement saved as `pin_source: manual`

## Edge Cases

- Address is a PO Box: geocode may succeed but pin lands on the post office — vendor must adjust to actual business location
- Address is inside a mall or multi-tenant building: pin lands on the building — acceptable at T1, vendor can adjust if needed
- Vendor on slow connection: map preview shows a skeleton loader; confirm button disabled until map tiles load
- Vendor on mobile: map preview is full-width, pin drag uses standard touch gestures
- Vendor enters address with typo, geocode finds a close match: show the resolved address clearly so vendor notices the discrepancy

## Assumptions

- Mapbox Geocoding API is already available (same account as Mapbox GL map)
- Low confidence is determined by the geocode response's `relevance` score (Mapbox returns 0–1; threshold TBD, suggest < 0.8)
- The map preview uses the same Mapbox GL instance/style as the main map
- Pin confirmation is a new step inserted into the existing F003 registration flow, not a separate page
- `pin_source` is a new column on the businesses table: enum of `geocoded`, `vendor_adjusted`, `manual`

## Comments

This is the primary accuracy mechanism for b1. The vendor knows where their business is — we just need to give them a chance to verify. The key UX insight: don't make them type coordinates, don't make them fill out more forms — just show them a map and ask "is this right?"

The manual fallback for failed geocodes is important for rural businesses, farms, and market stalls that may not have a standard street address.
