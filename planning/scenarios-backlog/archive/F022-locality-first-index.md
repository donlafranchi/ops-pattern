# Scenario: Locality-First Index — Browse Items near a point without login

**Feature:** F022
**Bundle:** b1
**System:** Item / Location
**Loops:** 3, 7, 9
**Status:** backlog

## Summary

An anonymous visitor browses Items near a stated location without logging in. The locality-first index queries the `discoverable_items` materialized view exclusively — base tables are never touched on the anonymous read path. This is Loop 3 (Land here).

## Scenarios

### Anonymous browse near a stated location

**Given** a user (authenticated or guest) navigates to `/explore` with a location previously set
**When** the index loads
**Then** a filterable list of active Items is shown, sorted by proximity (nearest first), with Gathering Items within the next 7 days boosted to the top of their distance band — no login required

**Given** a user selects the "Gathering" kind filter
**When** results update
**Then** only Items of `kind='gathering'` are shown; the URL updates to `/explore?kind=gathering` so the filtered view is shareable; back navigation preserves filters and scroll position

**Given** a user selects distance = 5 mi and category = "Bread"
**When** results update
**Then** only Items within 5 miles tagged with the Bread category are shown; active filters appear as removable chips above results

### Location prompt when no location is set

**Given** no location has been set and the user navigates to `/explore`
**When** the page loads
**Then** a location prompt appears (not a modal — page chrome is visible): "Where should we look?" with a text search field and "Use my location" button — results do not render until a location is provided

**Given** the user types into the location search field
**When** they select a suggestion
**Then** autocomplete suggestions (city, neighborhood, zip) appear from the geocoding service, results update for the new center, and the selected location persists for future visits

### Map toggle

**Given** results are showing in list view
**When** the user taps the map toggle
**Then** the same result set renders as a map with pins color-coded by kind; tapping a pin opens a compact Item card; tapping the card navigates to the Item page

**When** the user toggles back to list view
**Then** scroll position and active filters are preserved; URL reflects `?view=list`

### Empty state

**Given** the active filters return no results for the stated location
**When** results render
**Then** an empty state reads "Nothing here yet — be the first to declare something in [location name]" with a "Declare something" CTA linking to `/new`

### Performance boundary

**Given** the locality index query runs
**When** it executes
**Then** it queries `discoverable_items` via a `ST_DWithin` proximity query — no query against `items`, `members`, or `locations` base tables is issued on the anonymous read path

## Acceptance Criteria

- [ ] `/explore` renders for unauthenticated users — no redirect, no auth wall
- [ ] Results are drawn from `discoverable_items` materialized view; no base table queries on the anonymous read path
- [ ] Kind, category, distance, and schedule filters work and produce correct result sets
- [ ] Active filters appear as removable chips; "Clear all" clears all filters
- [ ] URL reflects active filter state (shareable filtered view)
- [ ] Back navigation from an Item page restores scroll position and filters
- [ ] Location prompt (not modal) appears when no location is set
- [ ] Geocoding autocomplete surfaces city/neighborhood/zip suggestions
- [ ] Map toggle switches the same result set to a pin map; back to list preserves state
- [ ] Pagination at 20 results; "Show more" at the bottom
- [ ] Empty state with "Declare something" CTA when no results

## Out of Scope

- Personalized / algorithmic ranking (b2)
- Saved searches (b2)
- Items with no Location attached (do not appear in the proximity index — separate Wonder/keyword search path is b2)
- Full-screen map as a primary route (map is a toggle inside Explore, not `/map`)
