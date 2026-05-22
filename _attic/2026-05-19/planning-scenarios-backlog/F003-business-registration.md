# Scenario: Business Registration — Owner registers in under 5 minutes

**Feature:** F003 (product/systems/business-data.md, product/systems/ownership-classification.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- The user is not yet registered on the platform

### When
- The user navigates to the registration page

### Then
- The user creates an account with email + password (Supabase Auth)
- The user fills out the business registration form:
  - Business name (required)
  - Street address (required)
  - City, state, zip (required)
  - Category (required, open text or taggable — NOT a fixed dropdown, per ADR-2)
  - Ownership type (required, 6-tier selector with descriptions)
  - Story / about (optional, free text)
- On submission:
  - Address is geocoded to lat/lng
  - Business record is created in the database
  - A colored pin appears on the map immediately
  - The user is redirected to their new listing's detail page
- The entire flow (account creation + business registration) completes in under 5 minutes

## Edge Cases

- Invalid address: geocoding fails, user sees clear error with suggestion to check address
- Duplicate address: warn but allow (multiple businesses at same address is valid — e.g. mall)
- Missing optional fields: listing is valid without story
- Ownership type "mission-driven" selected: show additional field for certification type / rationale

## Assumptions

- Auth is basic Supabase email/password
- Geocoding uses Mapbox Geocoding API or similar
- Category field is extensible (not enum) per ADR-2 to accommodate future business types like farms
- No email verification required before pin goes live (speed over gatekeeping for MVP)

## Comments

The registration form must be simple enough that a farmer who isn't tech-savvy can complete it. If it works for a farmer, it works for everyone (ADR-2). The ownership selector needs brief plain-language descriptions for each tier — users won't know what "community challenger" means without context.
