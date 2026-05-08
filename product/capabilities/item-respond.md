# Item Respond

**Tier:** T1
**Bundle:** b1
**Primitive:** Item
**Loops served:** 1, 2, 7, 8, 9

## What a Member can do

A visitor responds to an Item using the kind-appropriate action: Follow a product, service, or gathering; Save a service for later; RSVP to a gathering; say "I'd be in" on a Wonder. All responses are stored uniformly in `item_responses` as named response verbs. Responses are the substrate that future follow streams, notifications, and social proof features read from — getting them stored correctly at b1 is the foundation.

## T1 scope (ships at b1)

- Follow: products, services, gatherings — stores `response_kind='follow'` in `item_responses`
- Save: services — stores `response_kind='save'`
- RSVP: gatherings — stores `response_kind='rsvp'`; decrements available capacity
- "I'd be in": wonders — stores `response_kind='interest'`; increments `item_wonders.interest_count`
- Auth gate modal for unauthenticated visitors (sign up, then response auto-applied)
- Idempotent: double-tap does not create duplicate rows
- Withdraw: a Member can undo any response (sets `withdrawn_at`)
- Response counts visible on Item page (follow count for products/services, RSVP count for gatherings, interest count for wonders)

## Deferred

- Follow streams and notification feeds (stored at b1; surfaced at b2)
- Pledge / purchase response kinds (reserved in schema; commerce surfaces at b3)
- Response notifications to Item owners (b2)
- Public list of who responded (b2 — privacy question)

## Acceptance signal

An authenticated Member taps "I'd be in" on a Wonder, the interest count increments, an `item_responses` row exists with `response_kind='interest'`, and tapping again withdraws the response.
