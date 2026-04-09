# Scenario: Shareable Listing — Business has a unique URL with social metadata

**Feature:** F004 (product/capabilities/shareable-listing.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- A business exists in the database

### When
- A user (or anyone on the internet) navigates to `/business/{slug}`

### Then
- A server-rendered detail page loads with:
  - Business name, address, category
  - Ownership tier badge (colored + labeled)
  - Owner story
  - ❤️ Support count
  - Map preview showing the pin location
- The page includes OpenGraph metadata:
  - `og:title` = business name
  - `og:description` = ownership tier label + category + city
  - `og:image` = generated or default image with ownership badge
  - `og:url` = canonical listing URL
- The page is fully rendered server-side (no client-side loading spinner for content)

### And When
- A user taps the "Share" button on a detail card

### Then
- The listing URL is copied to clipboard
- A confirmation toast appears

## Edge Cases

- Business slug collision: slugs must be unique (append numeric suffix if needed)
- Business with no story: OG description falls back to ownership + category + city
- Social media crawler: page must return full HTML without JavaScript execution

## Assumptions

- Next.js App Router SSR handles the server rendering
- Slugs are generated from business name at registration time
- OG image can be a generic branded image with ownership tier color for MVP (custom per-business is b2)

## Comments

This is how businesses like Carlos (Scenario 2) share their listing on Facebook. The OG metadata must be correct on first deploy — broken social cards kill shareability.
