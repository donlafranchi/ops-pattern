# Capability: Platform Map Discovery

**Description:** The shared map showing all listing categories — businesses, rentals, farms — with pins differentiated by shape (category) and color (trust/ownership tier).

**Bundles:** b1 (businesses only), T2 (multi-category)

**Platform Layer:** Core (extended at T2 when verticals launch)

**User Story:**
As a traveler, I want to see rentals, local businesses, and farms on the same map, so I can find a place to stay, discover the neighborhood's shops, and buy local food in one view.

**Scope (b1 — core only):**
- Existing Map Search capability: colored pins, search, clustering
- Single listing category on map (businesses)

**Scope (T2 — multi-category):**
- Pin shape distinguishes category: circle = business, house = stay, leaf = harvest
- Pin color follows existing trust/ownership scheme within each category
- Category filter: show all, or filter to one category
- Tap pin → routes to category-specific detail card
- Clustering handles mixed listing types
- "Explore neighborhood" mode: all listing types in a radius

**Out of Scope:**
- Heatmap overlays (T3)
- Offline caching (T3)

**Related Capabilities:**
- Map Search (existing — business-specific search, core)
- Traveler Search & Browse (stays-specific search, Stays vertical)
- Owner Profile (tap owner name on any pin → profile)

**Note:** This capability extends, not replaces, the existing Map Search capability. Map Search handles business-specific search/filter. This capability adds the multi-category layer when verticals arrive.
