---
id: what-places
purpose: Places primitive — recognized geographic scope for locality URLs. Why platform-curated, not user-declared.
layer: what
status: active
---

# Places

A place is a recognized geographic scope — region, state, county, city, neighborhood — that everything else anchors to: a Location sits inside a place, a Page carries a place anchor, an Item inherits one, URLs nest under the place tree. Places answer two structural questions: where does a URL belong, and what counts as "near me."

**Places are platform-curated, not user-created — deliberately.** A "city" is a unit of recognized civic geography; if Members could declare one, someone could declare their block a city and own the URL namespace forever. User-declared geographic scope has its own primitive (`locations.kind='area'`) for service areas and custom polygons that aren't infrastructural. Curation by the platform is what keeps the URL hierarchy and the locality index trustworthy rather than a land-grab or a popularity contest.

**Deliberately separate from Locations.** A Location is a specific point a Member declared (Drake's Bar, at its actual coordinates); a place is an infrastructural scope nobody declares (the neighborhood it's in). Conflating them either gives every Location curation authority it shouldn't have, or makes places user-declarable and destroys the URL namespace's stability.

**Parent-scoped slug uniqueness.** A place's slug is unique under its parent, not globally — two distinct Oak Parks (a Sacramento neighborhood, an Illinois city) are two rows with different parents and neither needs a name-mangling suffix. The hierarchy carries the disambiguation so the slug stays legible.

**Granularities can be skipped.** A small town's city row can parent directly to state; some neighborhoods have no universally-recognized boundary and never get their own row — their Locations anchor to the parent city. The hierarchy is variable-depth by design, not every place uses every level.

**Distinct from the business-jurisdiction ladder.** Places are a discovery/URL surface; jurisdiction (`business-jurisdiction.md`) is an evidence surface using ZIPs, not place rows. A business Group carries both a place anchor (for its URL) and a jurisdiction tier (for its badge) — never one standing in for the other.
