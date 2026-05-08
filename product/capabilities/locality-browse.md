# Locality Browse

**Tier:** T1
**Bundle:** b1
**Primitive:** Item / Location
**Loops served:** 3, 7, 9

## What a Member can do

An anonymous visitor browses Items near a stated location without creating an account. This is Loop 3 — Land here. The Quarterly Dip Vendor showing up at the farmers market, the Drake's Run Club gathering at the bar, Ferrari Fisheries' irregular fish drop — all of these surface in one index filtered by proximity, kind, and category. No login required, no personalization, no algorithmic feed. Just what's near you, declared by real people.

## T1 scope (ships at b1)

- Browse at `/explore` without authentication — no redirect, no signup wall
- Proximity sort via PostGIS `ST_DWithin` against `discoverable_items` materialized view — base tables never queried on the anonymous read path
- Filters: kind (product / service / gathering / wonder), category (multi-select), distance (1/5/10/25 mi), schedule (any / this week / this weekend / recurring)
- Active filters as removable chips; filter state reflected in URL for shareable views
- Map toggle: same result set rendered as kind-color-coded pins; tap pin → compact card → Item page
- Location prompt (non-modal) when no location is set; geocoding autocomplete for city/neighborhood/zip
- Pagination at 20; "Show more" at bottom
- Empty state with "Declare something" CTA when no results
- Back navigation restores scroll and filter state

## Deferred

- Personalized / algorithmic ranking (b2)
- Saved searches (b2)
- Items with no Location (do not appear in the proximity index; keyword search path at b2)
- Full-screen map as a primary route (map is a toggle, not a separate page)

## Acceptance signal

An unauthenticated visitor navigates to `/explore`, enters a location, sees a list of nearby Items without being prompted to sign up, and can reach an Item page in two taps.
