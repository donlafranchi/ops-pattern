# System: Map System

**Purpose:** Interactive map displaying businesses as colored pins based on ownership tier

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

## T1 — MVP Tier

- Mapbox GL JS full-screen map, mobile-first
- Colored pins by ownership tier (gold, deep green, amber, bright blue, warm purple, flat grey)
- Pan/zoom with standard gestures
- Tap pin → opens business detail card (slides up from bottom)
- Browser geolocation for initial viewport
- Cluster pins at low zoom levels
- Bottom navigation bar with search, modeled after Google Maps / Apple Maps UX patterns
- Search bar: filter by business category (vet, mechanic, grocery, restaurant, etc.) and/or location
- All primary UI controls anchored to bottom of viewport (thumb-friendly, mobile-first)

## T2 — Core Tier

- Filter pins by ownership type
- City/region browse (drop map to a city)
- Saved map views / bookmarks
- "Zero listings" state for unseeded cities
- Search history / recent searches

## T3 — Polish Tier

- Heatmap overlay showing independent business density
- Route planning between saved businesses
- Offline map caching for travel mode
- Custom map styles / dark mode

## Integration Points

- Connects to: Business Data, Ownership Classification
- Used by: Map Search, Travel Browse, Community Seeding
