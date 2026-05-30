---
id: how-t015-explore-search-map
purpose: Ticket T015 — explore search map.
layer: how
status: reference
---

# T015: Explore — Search with List/Map Toggle

**Scenario:** planning/scenarios/F010-product-search-filter.md
**Status:** Complete
**Completed:** 2026-04-24T09:40:49-07:00

## Acceptance Criteria

- [ ] Route `/explore` renders the Search/Explore screen
- [ ] Top: search field (focused on mount), placeholder "Search vendors, products, markets"
- [ ] Below search: filter chips — Market (defaults to "Your Market"), Category, Day of week
- [ ] Below filters: segmented control toggle — **List** (default) | **Map**
- [ ] Empty state (no query yet): renders Trending searches rail + Popular categories grid + Recent searches list (auth users)
- [ ] Typed query shows suggestion dropdown (matching categories + vendor names)
- [ ] Submitted query renders results in current view
  - **List**: vertical scrollable vendor cards with photo, name, tagline, next market day, distance, follow button. Sorted relevance → distance → name. Result count at top.
  - **Map**: full-screen Mapbox map with pins color-coded by primary category; tapping pin opens a mini card at the bottom with photo/name/tagline + "View Profile" CTA. "List" button floats top-right to return.
- [ ] Changing filter chips updates results immediately in both views
- [ ] Toggle between List/Map preserves filters, search term, and position
- [ ] Zero results: "No vendors match [term]..." message with "Clear filters" and "Search all markets" CTAs
- [ ] URL reflects state: `/explore?q=honey&category=honey-jams&market=folsom&view=list`
- [ ] Absorb the old map page (T004–T006); the `/map` route redirects to `/explore?view=map`
- [ ] Tests: search returns expected vendors, filters narrow results, toggle preserves state, URL query params round-trip
- [ ] BUILD-LOG.md updated

## Notes

Reuse the existing Mapbox integration from T004–T006. Pin color logic changes: `getPinColor(vendor.primary_category)` replaces ownership-tier coloring for this product. Keep the ownership color utility for reference but don't wire it into the map here.

Search implementation for b1: Postgres `ILIKE` across `vendors.name`, `vendor_categories.category_slug`, and a future `vendors.tags text[]` column. No full-text search engine in b1.

Recent searches: localStorage for guests, DB table `recent_searches(user_id, query, created_at)` for authenticated users (last 10).

URL state management: use `useSearchParams` + `router.replace` to reflect filters in the URL without full reloads.

## Completion

Date: 2026-04-24
Commit: 8c6b2bd
