# Product: Map

**One-line description:** Interactive map displaying businesses as colored pins by ownership type

**Hypothesis:** If consumers can visually distinguish independent businesses from PE-owned ones on a map, they'll choose local — and they'll do it in under 2 minutes.

**Bundle Assignment:** b1 (T1), b2 (T2), b3 (T3)

**Platform Layer:** Core. The map is the primary discovery surface for Main Street. At T2, it extends to show category vertical listings (stays, harvest) alongside businesses. See `product/systems/platform-core.md` for how the map evolves with verticals.

## Capabilities

| ID | Name | Tier | Status | Scenario Ref |
|----|------|------|--------|--------------|
| C1 | Map Search | T1 | Design | — |
| C2 | Business Detail View | T1 | Design | — |
| C3 | Shareable Listing | T1 | Design | — |
| C4 | Ownership Filters | T2 | Design | — |
| C5 | Travel Browse | T2 | Design | — |
| C6 | Save / Bookmark | T2 | Design | — |

## Tier Summary

### T1 (MVP)
Full-screen map with colored pins, tap-to-view detail card, SSR shareable URLs.
- C1: Map Search
- C2: Business Detail View
- C3: Shareable Listing

### T2 (Core)
Filter by ownership type, city/region browse, saved lists.
- C4: Ownership Filters
- C5: Travel Browse
- C6: Save / Bookmark

### T3 (Polish)
Heatmap overlay, route planning, offline caching, dark mode.

## Open Questions

- Should clustering show ownership breakdown (e.g., "3 independent, 1 PE")?
- What's the right default zoom level for a city with sparse listings?

## Changelog

**2026-04-09** — Initial product design
