# Scenario: Market Selection — User selects their local market

**Feature:** F009
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The user is on the home feed
- No market has been selected yet (first visit or cleared)

### When
- The user taps "Select your market" pill

### Then
- A modal or bottom sheet opens showing a searchable list of markets
- Each market entry shows:
  - Market name (e.g., "Folsom Farmers Market")
  - City and neighborhood (e.g., "Folsom, CA")
  - Market days (e.g., "Saturdays 8am–1pm")
  - Number of vendors on the platform (e.g., "14 vendors")
- A search field at the top of the list allows filtering by market name or city
- Markets are sorted by distance from the user's location (nearest first) if location is available; otherwise alphabetical

### And When
- The user taps a market

### Then
- The modal closes
- The "Your Market" pill updates to show the selected market name (truncated if needed)
- The home feed filters to show vendors who attend that market
- The selection persists across sessions (stored in user profile if authenticated, localStorage if guest)

### And When
- The user taps the "Your Market: [Name]" pill when a market is already selected

### Then
- The same modal opens with the current market pre-selected/highlighted
- The user can switch to a different market or tap "Clear" to remove market filter

### And When
- The user has location access and opens market selection

### Then
- Markets within 25 miles are shown first under a "Near You" section
- Markets beyond 25 miles are shown under "Other Markets"

## Edge Cases

- No markets in database: show "No markets listed yet — check back soon"
- Only one market in area: auto-suggest it with a prompt ("Looks like you're near Folsom Farmers Market — want to set that as your market?")
- User travels to a different city: they can manually select any market regardless of location

## Assumptions

- Markets are seeded by the platform, not user-created (in b1)
- A user can only have ONE active market selection at a time in b1 (multiple markets deferred to b2)
- Market data includes: name, city, state, lat/lng, schedule (days + hours), and a vendor count
- Guest market selection persists in localStorage and is migrated to user profile on sign-up

## Comments

Start with Sacramento/Folsom markets seeded for launch. The market list is the anchor that makes the feed feel local. Without it, the product is just a generic vendor directory.
