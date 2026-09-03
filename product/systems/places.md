---
id: what-places
purpose: Places primitive — recognized geographic scope for locality URLs.
layer: what
status: active
---

# System: Places

**Purpose:** Establish Places as the platform's primitive for *recognized geographic scope* — region, state, county, city, neighborhood. Places are the platform's curated hierarchy of geographies that everything else anchors to: Locations sit *inside* a place; Groups carry a place anchor; Items inherit one from their Group; URLs nest under the place tree (per [PLATFORM-PATTERNS](../../playbooks/PLATFORM-PATTERNS.md)). Places are deliberately distinct from Locations — a Location is a specific point a Member declared (Drake's Bar at 38.58° N); a place is an infrastructural scope nobody declares (the neighborhood Oak Park, the city Sacramento, the county Sacramento County).

**Bundles:** b1 (T1 — primitive + URL plumbing + reverse-geocode anchor), b2 (T2 — admin curation surface, neighborhood polygon library), b3 (T3 — federation-aware place identity, cross-region browse).

**North stars served:** All five families through *locality-first* — places are the substrate that makes the platform's locality commitment durable. Without them, slug-uniqueness forces URLs like `/p/tamarind-chutney-12` and the discovery surfaces have no native hierarchy to walk.

**Source decisions:**
- [locality-scoped URLs](../../playbooks/PLATFORM-PATTERNS.md) — the parent decision this spec implements.
- [`principles.md`](../foundation/principles.md) P1 — locality-first.
- [`policy.md`](../foundation/policy.md) — the accountable-participation commitment (places are scope-for-discovery, never scope-for-messaging).

---

## What a Place Is and Why It Matters

A place is a recognized geographic scope that the platform treats as a discovery and addressing primitive. It exists to answer two questions structurally:

1. **Where does this URL belong?** Every public resource (Location, Group, Item filed under a Group) anchors under a place. The URL path walks the place tree from outermost to innermost.
2. **What's near me?** The locality-first index (Cluster 3) browses by place-containment: "what's in Oak Park," "what's in Sacramento," "what's in Sacramento County." Places are the granularity at which "near" is defined.

Places are **platform-curated, not user-created.** This is a deliberate constraint. A "city" is a unit of recognized civic geography; if Members could declare cities, one person could declare their block a city and own the URL namespace forever. User-declared geographic scopes are handled by `locations.kind='area'` — service areas, custom polygons, neighborhood-shaped Locations that aren't infrastructural. The platform's curation of places is what makes the URL hierarchy and the locality index trustworthy.

> **Intent:** Places carry authority that user-declared Locations cannot. Reverting the platform-curation rule means the URL namespace becomes a land-grab; the locality index becomes a popularity contest; the place hierarchy becomes a debate. Curation by the platform is what keeps locality a stable discovery aid rather than a contested resource.

---

## The Hierarchy

Places are self-referential — each place has a parent. The hierarchy is variable-depth: not every place uses every level.

**Kind enum** (b1):

| Kind | Example | Parent kind |
|---|---|---|
| `region` | Pacific Northwest, Sacramento Valley | `country` (reserved at b1; root if absent) or another `region` |
| `state` | California, Oregon | `country` or `region` |
| `county` | Sacramento County, Yolo County | `state` (or `region`) |
| `city` | Sacramento, Davis, San Francisco | `county` or `state` |
| `neighborhood` | Oak Park (Sacramento), Mission (San Francisco) | `city` |

Granularities can be skipped. A small town's `city` row can parent directly to `state`, skipping `county`, where the county adds no navigational value. Some neighborhoods don't have universally-recognized boundaries and never get a `neighborhood` row; their Locations anchor to the parent city directly.

**Country is reserved** as a top-level kind for the federation horizon (T3). At b1 the platform launches U.S.-only; country can be NULL on the root row.

**`places.parent_id`** is the single source of hierarchy. There is no separate "containment polygon" table — a place's polygon (optional) is one data point; the parent_id is the authoritative claim.

**Parent-scoped slug uniqueness.** A place's `slug` is unique under its parent: `UNIQUE (parent_id, slug)`. Two distinct Oak Parks (Sacramento neighborhood, Illinois city) are two rows with different parents; neither needs a name-mangling suffix. Sacramento's `oak-park` and Illinois's `oak-park` don't collide because their `parent_id`s differ.

> **Intent:** Parent-scoping preserves the cleanest possible slug at every level. "Oak Park" is the natural slug for "the neighborhood in Sacramento" — flattening to `oak-park-sacramento` to dodge a collision leaks state into a name that shouldn't carry it. The hierarchy carries the disambiguation; the slug stays legible.

---

## T1 — MVP Tier

- A `places` table exists with the kind enum, parent_id, slug, display_name, optional polygon, and audit fields.
- The platform seeds a starter set of places sufficient to launch the b1 markets — at minimum: California (state), Sacramento County, Sacramento (city), and a small set of Sacramento neighborhoods (Oak Park, Curtis Park, East Sacramento, Midtown, Land Park; the exact list is a curation call at launch time). West Sacramento is seeded as a separate `city` under Yolo County — it is a distinct incorporated city across the county line, not a Sacramento neighborhood.
- `locations.place_id` (nullable FK to `places`) — every Location anchors to a place at create-time. Reverse-geocoded from the Location's coordinates against the seeded polygon library; falls back to the parent city when the neighborhood is undetermined.
- `groups.place_id` (derived view or stored column — see Data model implications) — inherited from `anchor_location_id` for Groups with an anchor; computed at create-time for federation Groups (smallest common ancestor of Member home Locations).
- URL routing reads `places` to resolve `/p/[…segments]/...` and dispatches to the right resource handler.
- A reverse-geocoder Edge Function or server route translates `(lat, lon)` → `place_id` using the seeded polygons + a Mapbox fallback when polygons are absent.
- An admin-only seed/update path for places (no public composer; places are infrastructural).

---

## T2 — Core Tier

- Place landing pages at `/p/[…path]` — a curated surface per place that lists Locations / Groups / recent Items in that scope. Cluster 3 (browse) reads this surface heavily.
- A populated neighborhood polygon library for the launch markets (Sacramento + Davis + a couple Bay Area cities). Polygons are sourced from civic GIS data + manual curation.
- An admin curation surface — a privileged Member can propose new places (region, neighborhood, county) that the platform reviews and admits. This is a curation workflow, not a public composer.
- Place-aware search: query "near Sacramento" interprets "Sacramento" against `places.slug` first, then falls back to coordinate matching.
- URL-history table per resource type (`groups_url_history`, `locations_url_history`, `items_url_history` if applicable) for 301-redirect after a place anchor moves.

---

## T3 — Polish Tier

- Country-level rows fully populated as the federation horizon opens. Cross-country browse: places carry an `iso_country_code` for federation peering.
- Federation-aware place identity — a place row references its peer place on a federated platform, enabling cross-platform browse ("the Run Club in Portland — Portland-the-place is hosted on a sibling platform").
- Place-aware search at scale: vector embeddings on place display names + descriptions, so "Sac" resolves to Sacramento, "the Bay" resolves to the Bay Area (a `metro_polygons` overlay, not a place row).
- Place-aware recommendation: surfaces "places you might browse next" based on a Member's affinities + Group memberships.

---

## Data model implications

**Required at MVP — retrofit is the failure mode.**

### `places` table

- `id` UUID PK
- `parent_id` (nullable FK to `places.id`) — self-referential. NULL only for top-level rows (typically country or region).
- `slug` text — parent-scoped unique (`UNIQUE (parent_id, slug)`).
- `display_name` text — human-readable; can differ from slug ("Sacramento County" display vs `sacramento-county` slug).
- `kind` enum — `region`, `state`, `county`, `city`, `neighborhood`. (Extensible. `country` reserved at b1 for the federation horizon.)
- `geography` geography(MultiPolygon, 4326) NULL — optional polygon for containment lookups. Counties, cities, and neighborhoods carry one when GIS is available; regions may stay coordinate-free if a polygon would be unwieldy.
- `iso_country_code` text NULL — reserved for federation (T3).
- `msa_code` text NULL — HUD CBSA code; source = `zip_metro_crosswalk`. Populated for CBSA-40900 county subtrees only at b1; nullable until national backfill. Added by T075 migration `025_zip_metro_crosswalk.sql`.
- `metadata` jsonb — population estimate (informational only), GIS source attribution, etc.
- `created_at`, `updated_at`, `deleted_at` (soft-delete; places do not get hard-deleted — they get superseded or merged).

### `locations.place_id`

Every Location anchors to its closest matching place. NULL only during a brief window between insert and the reverse-geocoder result (the action handler at Phase 2 ensures resolution before commit; the FK can be `NOT NULL` from the action layer's perspective even though the column is nullable for catastrophic-failure recovery).

### `groups.place_id` (or derived)

Two implementation options — pick one at Phase 2 ticket-time:

- **Stored column.** Materialized at Group create-time from `anchor_location_id`. Recomputed on anchor change. Pros: cheap reads. Cons: drift potential if the underlying Location moves.
- **Derived view.** Compute on every read by walking `anchor_location_id → places`. Pros: never drifts. Cons: every Group-page read hits the view.

Working assumption: stored column with a trigger that recomputes on `anchor_location_id` change. Drift is bounded because Locations rarely move.

### Item URL parent

An Item's **URL parent** is either a Group (place inherited via the Group) or a Member (handle-anchored). Group-filed Items take the Group's place path; Items with no Group anchor under `/m/[handle]`.

*Corrected 2026-09-03:* this section previously read "Items don't carry a place column directly … orphan Items explicitly opt out of place-scoping." Both halves are superseded. Items **do** carry stored place levels — the Member enters a location at creation (address, neighborhood, or Online) and it resolves once into a stored hierarchy on the Item, which is the only query path for discovery. And an Item with no Group does **not** opt out of place-scoping — it carries whatever its creator entered. See [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Location is entered at creation and § Location resolution. The URL shape above is unaffected: discovery hierarchy and URL parent are separate concerns, and a handle-anchored URL no longer implies a place-less Item.

### Slug-uniqueness rewrites

- `places`: `UNIQUE (parent_id, slug)` — parent-scoped. Top-level rows (NULL parent) are unique within the NULL group.
- `locations`: `UNIQUE (place_id, slug)` — replaces the prior global `UNIQUE (slug)`. Each place has its own Location-slug namespace.
- `groups`: `UNIQUE (place_id, slug)` — same shape.
- `items`: `UNIQUE (group_id, kind, slug)` when filed; `UNIQUE (member_id, kind, slug)` otherwise. Partial unique indexes per the two cases.

### URL-history (deferred to T2)

When a place anchor changes (rare — a Group relocates, a neighborhood is reclassified), the resource's URL changes. A `groups_url_history` / `locations_url_history` table records the old path → new path mapping; redirect middleware reads it on 301. Deferring this to T2 keeps b1 simple; at b1 the platform doesn't move resources between places.

### Reverse-geocoder contract

The platform needs a deterministic `(lat, lon) → place_id` resolution path. Two layers:

1. **Polygon containment** — when a place has `geography`, point-in-polygon resolves. Most specific match wins (neighborhood > city > county > state).
2. **Mapbox fallback** — when polygons are absent or the point lies outside all known polygons, reverse-geocode via Mapbox Geocoding API; map the returned admin levels onto place rows by name match.

The fallback path is brittle (name matching is heuristic) and only fires when the polygon library is incomplete. The b1 polygon seed for Sacramento + surrounding markets should be complete enough that fallback is rare.

### Event log entries (required at MVP)

- `place.created` — admin seeds a new place row.
- `place.updated` — display name, polygon, parent change.
- `place.superseded` — one place row supersedes another (e.g., a place boundary redrawn or reclassified). Records the new place ID.
- `place.merged` — two place rows merge into one (rare; reserved for curation correction).

Append-only, audit-field-bearing per the same-transaction row+event invariant. Partitioned monthly per the established pattern.

---

## Integration Points

### Connects to

- **[`location.md`](location.md)** — every Location anchors to a place via `locations.place_id`. The Location's address is the human-readable form; the place is the addressable form.
- **[`groups.md`](groups.md)** — every Group inherits a place anchor (from `anchor_location_id` when set; from founder home Location for anchorless Groups; smallest common ancestor for federation Groups).
- **[`item.md`](item.md)** — Items filed under a Group inherit the Group's place anchor for URL routing. Member-owned Items (no Group) use the Member-anchored URL form. *Corrected 2026-09-03:* "and bypass places entirely" is retired — every Item carries a stored place hierarchy from its creation-entered location regardless of URL form.
- **[`member.md`](member.md)** — Member `home_location_id` resolves a Member's home place for breadcrumb / display purposes. The `member_privacy.locality_precision` enum (`city` / `neighborhood` / `none`) controls how much of the place hierarchy surfaces on the Member's public profile. `member_place_interests` (one `primary_home` Place + up to 5 `secondary` Places) is the substrate for the Member's community-awareness scope and references `places.id` directly; it is **owner-only at the row level**. Aggregate "how many Members opted into Sacramento as a place-interest?" computations land as named SECURITY DEFINER functions if and when a consumer surface earns them.
- **[`business-jurisdiction.md`](business-jurisdiction.md)** — the locally-owned-verification ladder uses ZIP-based locality matching, which is **distinct from** the places primitive. ZIPs are the verification surface (they're tied to documents, SOS filings, and Member-attestation); places are the discovery and URL surface. A kind='business' Group anchors to a place for its URL and to a ZIP (or set of ZIPs) for its jurisdiction claim. The two coordinate but stay separate primitives — the jurisdictions evidence ladder doesn't determine the URL, and the URL doesn't determine the jurisdiction. See the [`business-jurisdiction.md`](business-jurisdiction.md) spec for the verification rules.

### Used by

- The locality-first index (Cluster 3) — every browse query filters by `place_id` containment first.
- The URL router — every public path that starts with `/p/` resolves the place tree.
- The reverse-geocoder — Location-create writes call into the resolver.
- Group / Location / Item action handlers — at create-time, the handler stamps the resource's `place_id` from the resolver.
- The Member's `/you` locality picker — the Member chooses a home Location; the place is derived. The picker can also browse the place tree as a discovery aid ("nearby cities" lists sibling places under the same parent).

---

## Open questions

- **Neighborhood granularity policy.** How small is too small for a `neighborhood` row? A single block? A school district? A historic district? The b1 working answer: a neighborhood ships when it has *a recognized civic boundary* (city-published polygon, postal code-aligned, or community-board-recognized) and *active platform demand* (≥3 Locations or ≥1 kind='business' Group present). Below either threshold, the parent city is the anchor. Revisit when the b1 launch markets are fully seeded.
- **County tier — RESOLVED 2026-05-25.** The tier between `state` and `city` is `county`, not `msa`. Counties and county-equivalents (Louisiana parishes, Alaska boroughs, independent cities) tile the entire U.S. via FIPS codes with no coverage gaps; MSAs left ~1,200 rural counties with no anchor. **Colloquial metros ("the Bay Area," "Greater Sacramento") belong exclusively to the `metro_polygons` discovery overlay (per [PLATFORM-PATTERNS § metro-polygon overlay](../../playbooks/PLATFORM-PATTERNS.md), D1–D3 ratified 2026-06-02), NOT to `kind='region'` tree rows.** `region`-kind is reserved for URL-browsable regions only; if no such use case materializes in b1, `region` drops from the tree. The exact b1 seed list is still a launch-curation call.
- **Reverse-geocoder boundary handling.** What happens when a Member declares a Location whose coordinates fall on a neighborhood polygon boundary (within ~50m of two neighborhoods)? Working answer: pick the neighborhood whose centroid is closer; surface the call in the Location's `metadata.geocode_diagnostic` for admin review.
- **User-perceived place vs computed place.** A Member says "I'm in Oak Park" but their geocoded home Location resolves to "Curtis Park" (adjacent neighborhood, boundary ambiguity). Should the platform let the Member override? Working answer: at b1 no — the geocoded place is authoritative. At T2, an "I disagree" affordance can route to admin review without letting the Member self-assign. The locality-precision privacy enum (`city` / `neighborhood` / `none`) is the b1 escape hatch — a Member who feels mis-bucketed can drop precision to city.
- **Place-name aliases.** "SF" → San Francisco; "Sac" → Sacramento; "the Bay" → Bay Area. Should these resolve at the URL layer or only at the search layer? Working answer: only at search. URLs are canonical; aliases are search affordances. Deferred to T3 search work.
- **Polygon source-of-truth and licensing — RESOLVED (launch market).** Census TIGER/Line 2023 (counties/state/places) + City of Sacramento Open Data (neighbourhoods), all public-domain / open-licence; embedded as approximations pending S-metro full-res replay. Resolved by T076 (`024_places_polygon_centroid_seed.sql`).
- **What happens at the federation horizon (T3) when two platforms disagree about a place?** Place identity peers across platforms via federation. If Sacramento-the-place exists on this platform and on a sibling platform, do they share an ID or are they distinct? Working answer: distinct rows with a peer reference (`places.peer_place_id` reserved at T3). Resolution at peer-time, not at platform-launch.

---

## Comments

Places are the substrate that makes the platform's locality-first promise structurally durable. The decision to model them as a hierarchical, platform-curated primitive — rather than computing them from `(lat, lon)` on every query or storing them as opaque strings — is a one-time complexity cost that pays back at every URL routed, every discovery query filtered, and every share link that survives a relocation.

The deliberate separation from `locations` is load-bearing. Locations are user-declared specific points; places are infrastructural scopes. Conflating them either makes Locations carry curation authority they shouldn't have (every Drake's Bar declaration would force a place reckoning) or makes places user-declarable, which destroys the URL namespace's stability. Two primitives, two surfaces, one well-defined join (`locations.place_id`).

The coordination with [`business-jurisdiction.md`](business-jurisdiction.md) is the most subtle integration point. The platform's "locally owned and operated" claim is a *verification* surface — it cares about evidence (SOS filings, document uploads, ZIP attestation), not about URL hierarchy. The places primitive is a *discovery* surface — it cares about URL hierarchy and browse, not about evidence quality. The two share a vocabulary ("local"), share an underlying geography, and stay separate primitives so neither has to compromise its purpose for the other's. A kind='business' Group has a place anchor (for `/p/sacramento/oak-park/g/adaezes-kitchen`) **and** a jurisdiction tier (for the "Documented local owner" badge). Both, never one-as-the-other.

Finally: the federation horizon (T3) is the hardest test of this design. A place row that peers with a sibling platform's place row is the substrate that makes cross-platform browse honest. The b1 design reserves the column (`peer_place_id`) without surfacing it, the same way it reserves embedding columns without building embeddings yet. The schema commitment is what keeps the federation door open without paying for it at b1.

---

## Decisions encoded here

This spec is the live home for:

| Decision | Status | What lives here |
|---|---|---|
| Locality-scoped URLs | Accepted 2026-05-23 — see [PLATFORM-PATTERNS](../../playbooks/PLATFORM-PATTERNS.md) | Places as a hierarchical, platform-curated primitive; kind enum; parent-scoped slug uniqueness; URL hierarchy walks the place tree; reverse-geocode anchoring; smallest-common-ancestor for federation Groups; default neighborhood-when-available for business Groups. The decision lives cross-cutting; this spec has the *substrate*. |
| County tier | Accepted 2026-05-25 — see [PLATFORM-PATTERNS](../../playbooks/PLATFORM-PATTERNS.md) | The `kind` tier between `state` and `city` is `county` (`msa` retired). Amends the locality-scoped-URLs kind enum. (Colloquial metros moved to the `metro_polygons` overlay, not `region` rows — D3 ratified 2026-06-02.) |

This spec also *encodes* (but does not own) the audit-fields commitment (audit fields on every `place_events` row), the action-layer contract (action-layer-only writes to `places` — admin handler, not public), and the curation policy (it reflects the opt-out / three-filter posture by being platform-curated rather than user-claimable). Those live cross-cutting in `DECISIONS.md`.
