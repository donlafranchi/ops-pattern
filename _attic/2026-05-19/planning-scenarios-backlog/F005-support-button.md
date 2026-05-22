# Scenario: Community Signals — User supports a business

**Feature:** F005 (product/capabilities/community-signals.md)
**Severity:** Critical
**Bundles:** b1

## Acceptance Criteria

### Given
- A business exists on the map
- The user is authenticated

### When
- The user taps the ❤️ Support button on the business detail card

### Then
- The heart toggles to a filled/active state
- The support count increments by 1
- The support is persisted to the database
- Tapping again removes the support (toggle off), count decrements

### And Given
- The user has already supported the business

### When
- The user views the business detail card again (later session)

### Then
- The heart shows as filled/active (support state is remembered)

## Edge Cases

- Unauthenticated user taps support: prompted to sign in, support is applied after auth completes
- User supports then immediately removes: count returns to original, no lingering state
- Business owner supports their own business: allowed but does not count toward total (or: blocked entirely — open question)
- Rapid toggling: debounced, only final state is persisted

## Assumptions

- Support is stored as a join table: user_id + business_id
- Support count is a computed aggregate, not a denormalized field (or cached with eventual consistency)
- No rate limiting needed for MVP beyond standard auth

## Comments

Support is a stance, not a review. The UI should feel warm and affirmative — not transactional. Think Instagram heart, not Yelp star.
