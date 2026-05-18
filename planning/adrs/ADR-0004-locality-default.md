# ADR-0004: Locality default — geolocate, then city-pick, mutable from any surface

**Status:** Accepted
**Date:** 2026-05-08
**Deciders:** PM
**Scope:** Anonymous and authenticated locality resolution; the city-pick fallback; locality mutability across all surfaces that depend on it
**Touches:** `product/systems/member.md` (locality default + `home_location_id`), `product/ui/design-language.md` (locality affordance + bottom-anchored placement per ADR-2)

## Decision

The default locality is the user's geolocation, if granted. If denied or unavailable, the platform prompts for a city pick (Sacramento metro and surrounding cities at launch, expandable). The chosen locality is mutable — the user can change it at any time, both for moves and travel. The change affordance is visible from surfaces that depend on locality (Home, Explore), not buried in `/you` only.

## Consequences

- Anonymous Home triggers a one-time geolocation prompt; decision persists in a cookie.
- Authenticated Members get the same flow on first sign-up; choice writes to `members.home_location_id` and remains editable.
- Locality affordance lives in or near the bottom-anchored search per ADR-2.
- Multi-locality ("home + while traveling") is a T3 concern; at b1 it's a single mutable scope.
- Privacy: geolocation is requested but never required. The city-pick fallback must always be available.
- Multi-Location belonging (Member living/working/playing/following multiple Locations) is a separate substrate — `member_location_affinities` per [`member.md`](../../product/systems/member.md). `home_location_id` is the locality default; affinities are additive.

## Action Items

1. [x] Decision ratified 2026-05-08.
2. [x] Pointer line in `../DECISIONS.md` pointer index.
3. [x] `member.md` Identity / Locality section encodes `home_location_id` mutability.
