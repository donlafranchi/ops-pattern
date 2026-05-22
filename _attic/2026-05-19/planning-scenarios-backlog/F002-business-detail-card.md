# Scenario: Business Detail — Consumer views business information

**Feature:** F002 (product/systems/business-data.md, product/systems/ownership-classification.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- A business exists with: name, address, category, ownership tier, and story

### When
- The user taps a pin on the map

### Then
- A detail card slides up from the bottom of the screen (mobile) or appears as a panel (desktop)
- The card displays:
  - Business name
  - Address (street, city, state)
  - Category
  - Ownership tier badge (colored dot + label, e.g. "🟡 Independent" or "🟣 Mission-driven: B Corp")
  - Owner story / about text
  - ❤️ Support count
  - ❤️ Support button (if user is authenticated)
  - Report a concern button (if user is authenticated)
  - Share button (copies listing URL)
- For PE/corporate listings: parent company name and location count are shown
- For mission-driven listings: certification type (B Corp, PBC) or rationale is shown

## Edge Cases

- Business with no story: story section is absent, not empty
- Very long story: truncated with "Read more" link to full detail page
- Unauthenticated user: support and report buttons show "Sign in to support" prompt

## Assumptions

- Detail card is a component shared between map view and full detail page
- Ownership tier badge colors match pin colors exactly

## Comments

The detail card is the first thing a consumer reads after tapping a pin. It must load fast and communicate ownership status instantly — the badge should be the most prominent element after the business name.
