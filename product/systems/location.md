# System: Location

**Status:** Drafted 2026-05-10 — pending PM final read. The third foundational primitive (per [`primitives.md`](../foundation/primitives.md)). Fills the gap previously referenced as "forthcoming" across `member.md`, `item.md`, `groups.md`, and `b1-primitives.md`. Independent architectural review pass complete; remaining REVISE items are migration-plan reconciliation (Phase 1 spine+child enumeration) which is the next session's work.

**Purpose:** Establish Location as the platform's primitive for *physical places where things happen*. Three kinds — permanent, recurring-temporary, area — share a spine with kind-specific child tables, mirroring the Item and Group primitives. The platform's grammar becomes legible at the data layer: **People form Groups to do things using Items, attached to Locations.** Locations are where the attaching happens.

**Bundles:** b1 (T1 — all three kinds, full surface), b2 (T2 — claim flow, photo galleries, sub-venues surface, contributor tracking), b3 (T3 — federation, vector-embedded natural-language queries, intelligence-layer rollups).

**Companion specs:** [`primitives.md`](../foundation/primitives.md) · [`item.md`](item.md) · [`member.md`](member.md) · [`groups.md`](groups.md) · [`policy.md`](../foundation/policy.md) · [`discovery.md`](discovery.md)

**Decisions encoded:** ADR-2 (bottom-anchored mobile-first UI — relevant to the locality-default affordance per ADR-4) · ADR-4 (locality default = geolocate then city pick, mutable from any surface — `members.home_location_id` references this primitive) · ADR-5 (a market is a Gathering Item, not a Location-of-kind=gathering — this spec encodes the corollary that markets ARE Locations of kind=recurring-temporary, and the gathering side lives on Items attached) · ADR-6 (audit fields on every event row) · ADR-7 (action layer is the only write surface) · ADR-9 (policy framework, opt-out default, three-filter test for any Location surface that exposes Member presence). **ADR-14 pending formal write-up** — the spine+child decision parallel to the Item/Group split (paired with ADR-13 from groups.md, also pending). Both ADRs deferred to the migration plan rewrite session per the user's sequencing decision.

**North stars served:** All five families. Locations are present on at least one side of every loop that involves doing-something-somewhere. Specific kinds map to specific surfaces (permanent → standing presence, recurring-temporary → market booths and recurring gatherings, area → service radii and neighborhood scopes), but the primitive itself is shared infrastructure.

**Canonical examples this spec serves:** Drake's hosting the Run Club and Barn Movie Night (permanent, with sub-venue) · the Sacramento farmers market the Quarterly Dip Vendor visits (recurring-temporary) · Ferrari Fisheries' boat dock pickup point (recurring-temporary, intermittent) · the food truck's sequence of stops (area + recurring-temporary stops) · a plumber's service radius (area) · West Sacramento as a city scope for locality default (area) · **Concerts in the Park** — a Member follows multiple parks across the Sacramento MSA and gets a feed of outdoor live-music gathering Items attached to those parks (permanent, multi-Location follow, taste-profile filtered). Per [`canonical-examples.md`](../foundation/canonical-examples.md).

---

## What a Location is

A Location is the platform's record of one physical place where things happen on the platform. It has a name, a geography (point or polygon), an optional description, and a creator-of-record (the Member who added it). It carries no purpose of its own — purpose comes from the Items attached to it and the Groups anchored to it.

A Location is the structural alternative to "venue," "neighborhood," "service area," "address," and "region" being four separate systems. A market booth, a bar, a community garden, a polygon-shaped neighborhood, a 30-minute service radius — all the same primitive, varying by kind. The schematic similarity that makes the platform feel coherent across these surfaces depends on Location being one primitive, not four.

## What a Location is NOT

The boundaries here are load-bearing. Each negation is a structural commitment.

- **Not a Group.** West Sacramento is a Location of kind=area — a polygon, a name, a geometry. The West Sac school-parents Group is a different record entirely; it may *anchor* to West Sacramento but it is not equal to it. People affiliate with *Groups*; they have *affinities* with Locations (live, work, play, visit, follow — see Person↔Location relationship below). The two are not the same.
- **Not a complaint surface.** This is the structural anti-Nextdoor commitment. Nextdoor's failure mode is location-scoped commenting/messaging, which attracts complaint posts and erodes the surface. The platform's response is two-fold and lives outside Location structure: (1) when messaging surfaces ship (b2+), they are scoped to Items or Groups only — never to Locations. There is no Location wall, no Location feed, no Location DM. (2) Complaint-style content in any feed surface can be downvoted and removed from circulation. The platform's affordance for "I have a problem with this place" is to create an Item — a Wonder ("would folks be into fixing the broken playground?") or an Initiative ("let's organize the playground rebuild") — and lead the fix. Per [`policy.md`](../foundation/policy.md).
- **Not a Person.** A Member's `home_location_id` is a soft pointer to their preferred locality scope (per ADR-4). It is not their address. The platform does not store addresses for Members. A Member's relationships to Locations beyond home (places they work, play, visit, follow) live in `member_location_affinities` (see member.md), not as columns on `members`.
- **Not a Business.** A storefront is a Location. The Member who operates there is a Member. The Group they operate through is a kind='business' Group anchored to that Location. Three records, three primitives, one place. The platform never collapses them into a single "business listing" record — that is the directory failure mode named in `principles.md`.
- **Not auto-discovered.** The platform does not pre-populate Locations from third-party data sources (Google Places, OpenStreetMap, public business registries) at b1. Every Location row exists because a Member added it. The integrity guarantee is the same one Groups carry: presence on the platform reflects deliberate human declaration, not scraped inference. Auto-population from authoritative sources is a T2/T3 question, gated on policy review.
  **Intent:** Pre-populating from Google Places would make the Location surface look "filled in" at b1, but at the cost of every Location row being a third-party-controlled fact — and once the rows exist, the platform inherits the third party's errors, biases, and update cadence. Forcing Member declaration keeps the deliberate-presence guarantee that everything else in the platform inherits (no auto-assignment, no scraped identities). The b1 cost is real (fewer rows on day one); the integrity payoff is permanent.

## Location kinds

Three kinds at b1, fixed. The kind is set at creation and **does not transition** — same rule as Item kind and Group kind. A market that becomes a permanent shop is a new Location of kind=permanent; the old Location keeps its history.

**Permanent.** A fixed physical place with a single coordinate. A shop, a home, a community garden, a park, a bar, a school. The most common kind. Geometry is a Point (lat/lng + PostGIS `geography`).

**Recurring-temporary.** A coordinate that hosts activity on a recurring cadence — a market booth at a parking lot Saturdays 8-1, a bar where a Run Club meets Thursdays evenings, a parking lot that becomes a food-truck rally one Friday a month. The Location's geometry is still a Point (where the activity happens), but the Location carries an operating schedule (when the *Location itself* is active). This is distinct from `item_locations.schedule_metadata` (per `item.md`), which describes when a *specific Item* appears at this Location.

**Area.** A polygonal region — a neighborhood boundary, a service radius, a city scope. Geometry is a Polygon (PostGIS `geography(Polygon)`). Used for service-area inclusion queries (does this plumber serve this address?), for locality scopes (does this Member's home Location fall within this neighborhood?), and for browse filters (Items in West Sacramento). Areas have a representative Point (auto-computed centroid) so they participate in the same proximity queries as the other kinds without special-casing.

The kind enum is intentionally narrow at b1. Future candidates if real cases warrant: `route` (a recurring path — a delivery route, a foot-race course), `mobile` (an ambulatory operator without a fixed point — the truly nomadic food truck) — not in scope at b1. The food-truck canonical example (#4) is modeled at b1 as a Member with multiple recurring-temporary Locations they post to in sequence; route/mobile become valuable when that pattern stops being expressive enough.

## T1 — MVP Tier (b1)

**Identity.**
- `label` (required, text, 1–120 chars). The Location's display name. Member-authored, written naturally. ("Drake's", "California Family Fitness Parking Lot", "West Sacramento", "30-mile radius from Folsom").
  **Intent:** 120 chars sits above "name" length (≈40) and below "tagline" length (≈200+) — the upper bound is deliberately positioned to leave room for "California Family Fitness Parking Lot" but discourage promotional copy in what's meant to be a declarative locator field. If a future proposal wants a taglines or short-bio field on Location, that's a different column — not a wider label.
- `slug` (required, unique, lowercased alphanumeric + hyphen, derived from label at create with disambiguation). Powers the canonical Location URL `/l/[slug]`.
- `description` (optional, text up to 1000 chars, written naturally for human + future embedding readability). What this place is, what happens here, what newcomers should know. Not a marketing pitch.
- `kind` (required, enum: `permanent` / `recurring_temporary` / `area`).

**Geometry.**
- `geography` (required, `geography(Point, 4326)`). Always a Point. For permanent and recurring-temporary, this is the place. For area, this is the polygon's auto-computed centroid (synced by trigger on the child polygon).
- The Point in the spine is what powers the locality-first proximity queries — the `discoverable_items` materialized view, the `/explore` distance filter, every "near me" surface — uniformly across kinds.
- Area polygons live in the `location_areas` child table (below). Inclusion queries (`ST_Contains`) JOIN to that table; they only run when the user asks an inclusion question.

**Lifecycle.**
- Soft-delete via `deleted_at`. Hard deletes never ship.
- A Location with attached Items or anchored Groups cannot be hard-deleted; soft-delete sets `deleted_at` and the Location stops surfacing in search but its history remains for the Items and Groups that reference it.
- No status enum at b1 (no `active`/`closed`/`dormant` machinery). A Location either exists or is soft-deleted. Closures of permanent Locations (a shop closing) are surfaced through the absence of recent active Items, not through a Location-state column. T2 may revisit if the signal is too soft.

**Creator-of-record.**
- `member_id` (required, FK to `members.id`). The Member who added this Location row. This is a *platform-record stewardship* relation, not an ownership claim — Drake's the bar is a real-world establishment that exists independent of whoever clicked "Add Location" on the platform.
- The creator can edit the Location's label, description, and (for kind=area) polygon. They cannot move a permanent Location's coordinates without flagging the change for review (the address-drift problem — small movements look like fixes; large jumps look like vandalism). The action layer enforces a same-coords-or-flag rule on update.
- **Locations are not transferred.** If the original creator stops maintaining a Location, the T2 claim flow (below) lets another Member become the maintainer. No transfer surface ships at b1.
  **Intent:** Transfer flows are the surface adversarial actors use to take over established records — submit a transfer request for "Drake's" with a plausible cover story and the platform becomes the question's arbiter. The b1 cost of "creator-of-record can't hand off" is small (a T2 claim flow exists for the legitimate handoff case); the b1 risk of "anyone can claim Drake's by submitting a form" is large (one bad transfer corrupts the trust the locality index depends on). The T2 claim flow ships when the verification path is designed; until then, no transfer.

**Person↔Location relationship — multi-belonging.**

People belong to multiple Locations. A Member lives in West Sacramento, works in Folsom, plays in midtown Sacramento. The platform models that as **affinities**, not memberships — the term distinction matters because affinities don't grant addressability (you can't be DMed because you "live in West Sac"; messaging is item-or-group-scoped only) and don't create a constituency (a Location doesn't have a feed, doesn't have moderators, doesn't accumulate a wall of complaints).

- `member_location_affinities` (per [`member.md`](member.md)) — Member ↔ Location with `affinity_kind` enum: `lives`, `works`, `plays`, `visits`, `follows`, `liked`. b1 substrate; surface b2.
- `members.home_location_id` stays as the single locality default (per ADR-4) — the Location used for "near me" defaults when the Member hasn't picked a different scope. It is not the Member's only affinity, just the default scope.
- `lives` / `works` / `plays` are Member-declared affinities. `visits` is Member-declared, lighter weight. `follows` is the standing relationship that drives notifications when new Items get attached at that Location (the "concerts in the park" surface). `liked` is a save/bookmark — surfaces in the Member's "Locations I like" list without driving notifications.
- A Member can hold any number of affinities of any kind across any number of Locations.
- **No `location_memberships` table.** Memberships are a Group concept. The semantic distinction (affinity vs. membership) is what keeps the platform from sliding into Nextdoor's pattern, but the structural prevention lives in the messaging-scope and complaint-downvote commitments above, not in the absence of this table.

**Sub-venues** (schema reserved at b1, surface at T2).
- `parent_location_id` (nullable, FK to `locations.id` — self-reference). Drake's barn is a sub-venue of Drake's. The Folsom market's section-B-stall-7 is a sub-venue of the Folsom market. Reserved at b1 so the canonical-example #5 (Barn Movie Night) lands cleanly when sub-venue surface ships at T2. At b1, sub-venues exist as siblings (separate Location rows) rather than as nested.

**Discoverability.**
- `discoverability` (enum: `listed` / `unlisted` / `private`, default `listed`). Mirrors the Group enum for consistency.
- `listed` Locations appear in the index, in suggestions, in proximity searches.
- `unlisted` Locations exist (have a URL) but do not appear in index/suggestions. Useful for personal Locations a Member uses but doesn't want browseable (a home address used as porch-pickup point).
- `private` Locations are visible only to the creator. Used as scratch entries during composer flows. RLS enforces.

**Brand label.**
- `brand_label` (nullable text). Same denormalization pattern as `items.brand_label`: when a Location's display name carries a recognizable label ("Drake's", "Oak Park Sourdough HQ"), this column powers the resolve-up rendering on the Location page (per the `community-platform.md` Venue page pattern). When a kind='business' Group anchors here, the Group's `group_businesses.display_name` is the canonical brand source; `locations.brand_label` is the Location-level fallback for places that aren't Group-anchored.

## T2 — Core Tier

- **Photo galleries.** Multiple photos per Location with captions, one set as primary. Per-Location gallery surfaces on the Location page; producer-facing gallery management lives on [`producer-tools.md`](producer-tools.md) for the Locations a producer Member maintains.
- **Claim flow.** A Member can claim maintainership of a Location whose original creator is inactive (no edits in 12 months and no recent Items attached). Claim is a one-tap action handler that fires a `location.claim_requested` event; resolution happens via the original creator's notification with a 14-day response window. Confirmed claims rotate `member_id` to the new maintainer.
- **Community pin flagging.** Any authenticated Member can flag a Location's pin as "wrong location" via a one-tap action (`location.pin_flagged`). Flag carries an optional note ("pin is across the street," "Location has moved"). Flagged Locations surface to the maintainer's dashboard for review; multiple flags from distinct Members escalate to platform review. Absorbed from the retired `vendor-self-service.md` (re-anchor 2026-05-11) — same pattern, Member-Location-scoped rather than vendor-scoped.
- **Sub-venue surface.** The reserved `parent_location_id` becomes user-facing — sub-venues render under their parent on the Location page; Items attached to a sub-venue surface on the parent's page with a sub-venue chip.
- **Contributor tracking.** A `location_contributors` table records Members who have edited the Location's metadata over time, surfacing trust signal ("this Location's record is maintained by 4 active Members"). Schema reserved at b1.
- **Public hours.** For kind=permanent, structured public-hours JSONB (per-day open/close intervals). Renders on the Location page. The migration plan's `schedule_metadata` JSONB on the spine is the b1 placeholder; T2 promotes it to a typed shape per kind.
- **Recurring schedule formalization.** For kind=recurring-temporary, the operating schedule moves from JSONB to a structured RRULE (matching the Item/Gathering pattern). The b1 JSONB shape (`{ days, start_time, end_time }`) is round-trippable into RRULE so this is non-breaking.

## T3 — Polish Tier

- **Vector embeddings** for Location descriptions. `locations.embedding_id` reserved at b1; the parallel `location_embeddings` table fills at T3 when natural-language search ships ("places near me where families gather", "venues that host evening events").
- **Federation.** `federation_origin` reserved on the spine at b1. T3 adds Locations sourced from federated platforms (per Loop 13 in `loops.md`). A Location originating from a partner platform surfaces here with provenance and links back; the platform's own Locations remain authoritative for proximity.
- **Intelligence-layer rollups.** Per-Location analytics — Items hosted, gatherings held, follower fan-out, response density. Producer-facing for Location maintainers ("12 gatherings hosted at Drake's this quarter"). Reads from the event log — entries land at b1, surface at T3.
- **Auto-population from authoritative sources.** Optional, opt-in. A Member adding a Location can pull description and hours from a third-party source (Google Places, OpenStreetMap) with explicit consent and provenance recorded. Gated on policy review per ADR-9.

## Spine + child data model

Mirrors `item.md` and `groups.md`. One spine, kind-specific child tables for kinds that need extra structure.

**The spine — `locations`** (one row per Location, all kinds):

```sql
create table locations (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid not null references members(id),
  kind                text not null check (kind in ('permanent','recurring_temporary','area')),
  label               text not null,
  slug                text unique not null,
  description         text,
  geography           geography(Point, 4326) not null,  -- Point for all kinds; centroid for area
  parent_location_id  uuid references locations(id) on delete set null,  -- sub-venue, T2 surface
  brand_label         text,
  discoverability     text not null default 'listed'
    check (discoverability in ('listed','unlisted','private')),
  ambient_extras      jsonb not null default '{}',  -- small extras, never queried
  -- Reserved at b1, populated later:
  embedding_id        uuid,
  federation_origin   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz
);

create index idx_locations_geog on locations using gist (geography) where deleted_at is null;
create index idx_locations_kind on locations (kind) where deleted_at is null;
create index idx_locations_member on locations (member_id) where deleted_at is null;
create index idx_locations_parent on locations (parent_location_id) where deleted_at is null;
create index idx_locations_brand on locations (brand_label) where brand_label is not null and deleted_at is null;
```

**Kind-specific child tables** (1:1 with `locations` where `locations.kind` matches; FK = `location_id`):

- **`location_permanent`** — `location_id` PK FK, `street_address` (text, nullable — Member-authored, not normalized at b1), `public_hours` (JSONB nullable — `{day: [{open, close}, ...]}`), `accessibility_notes` (text nullable). Reads sparingly at b1 (the spine carries enough for index + page render); fills out at T2.

- **`location_recurring_temporary`** — `location_id` PK FK, `recurrence_rule` (text, RRULE format, nullable at b1), `session_start_time` (time, nullable), `session_end_time` (time, nullable). At b1 the recurrence is stored as JSONB on the spine's `ambient_extras` (`{days, start_time, end_time}`); T2 promotes to typed columns + RRULE. **No QR-card columns on Locations** — QR cards are an Item-level Member-requestable affordance per [`item.md`](item.md), not a Location property. A Member who wants a QR card to be found requests it on their Item; it resolves to the Item's page, not to a Location.

- **`location_areas`** — `location_id` PK FK, `polygon` (`geography(Polygon, 4326)` not null), `area_kind` (enum: `service_radius`, `neighborhood`, `city`, `region`, `custom`), `radius_meters` (int, nullable — populated when `area_kind = 'service_radius'` and the area is a circle around a point). On insert/update, a trigger computes the polygon's centroid and writes it to the spine's `geography` column so proximity queries work uniformly across kinds.

**Action handlers (per ADR-7).** Every write goes through a named handler. Initial set at b1:

- `location.create` — validates label, generates unique slug, accepts kind + geometry, inserts spine row + appropriate child row in one transaction, fires `location.created`.
- `location.update_metadata` — label, description, brand_label, discoverability. Fires `location.updated`.
- `location.move` — coordinate update for permanent or recurring-temporary. Same-coords-or-flag rule: small movements (under 100m) auto-apply; larger movements set a `flagged_for_review` bit and require re-confirmation. Fires `location.moved` with `{from_geog, to_geog}` payload.
- `location.update_polygon` — kind=area only. Polygon edit; trigger recomputes centroid. Fires `location.polygon_updated`.
- `location.set_hours` — kind=permanent or recurring-temporary. Writes child-table schedule fields. Fires `location.hours_updated`.
- `location.delete` — soft-delete; rejects if active Items are attached and `force=false`. Fires `location.deleted`.
- `location.restore` — clears `deleted_at`. Fires `location.restored`.
- `location.claim_request` (T2) — fires `location.claim_requested`.
- `location.claim_resolve` (T2) — fires `location.claim_resolved` with outcome.

**Event log entries (required at b1):** `location.created`, `location.updated`, `location.moved`, `location.polygon_updated`, `location.hours_updated`, `location.deleted`, `location.restored`. Reserved at b1, surfaced at T2: `location.claim_requested`, `location.claim_resolved`, `location.contributor_added`, `location.followed`, `location.unfollowed` (these last two paired with `member_location_affinities` row writes per `member.md`). Append-only, partitioned monthly per ADR-10. Audit fields per ADR-6 (every row carries `acting_member_id` + `via_delegation_id`).

**RLS.** Public read for `deleted_at IS NULL AND discoverability != 'private'`. Owner write (creator-of-record only at b1; T2 expands to confirmed claimants). Private Locations readable only by `member_id = auth.uid()`. The matrix passes the anon/auth-self/auth-other smoke test required by Phase 1 exit (per `planning/rebuild-plan.md`).

## Locality semantics

The Location primitive is the spatial substrate of the platform. Three things ride on it.

**Proximity queries** — every "near me" surface (the locality-first index, the `/explore` distance filter, the home-feed nearby band) reads `locations.geography` via the GIST index. Because area Locations also carry a centroid Point, the same query works without per-kind branching.

**Inclusion queries** — "is this Member's home Location inside the West Sacramento polygon?" — JOIN `locations` to `location_areas` and run `ST_Contains(polygon, point)`. Only kind=area participates; no special-casing required at the query site.

**Locality default (per ADR-4)** — `members.home_location_id` references this primitive. The locality default is set at onboarding via geolocation (preferred) or city pick from a list. The "city pick" list is populated from kind=area Locations with `area_kind='city'` near launch (Sacramento metro and surrounding cities). Mutation is one tap from any locality-dependent surface; the affordance is bottom-anchored per ADR-2.

**Promotion-locality (interaction with `groups.md`)** — `groups.md` defines locally-owned-and-operated as a derivable property: a kind='business' Group is locally owned when at least one owner Member is locally affiliated with the Group's `anchor_location_id`. The proximity check uses the Member's `member_location_affinities` (any of `lives` / `works`) — not just `home_location_id` — because a Member who works in Folsom is a real local owner of a Folsom business even when their home is elsewhere. The Location primitive is what makes the derivation tractable; the affinity table is what makes it accurate.

**Member-following-Location (the "Concerts in the Park" surface)** — Members can follow Locations they care about (`member_location_affinities` row with `affinity_kind='follows'`). When a new Item attaches to a followed Location — a concert posted at Capitol Mall, a market session at Cesar Chavez Plaza, a class at the community center — the follower's feed surfaces it. Combined with Member taste profile (extended `member_interests`), this enables MSA-scoped browse like "places near Sacramento that host outdoor live music." The follow substrate ships at b1 (per `member.md`); the surface ships at b2.

## Integration points

- **Member** — `members.home_location_id` (nullable, FK) per ADR-4. Soft pointer, never an address. `member_location_affinities` (per `member.md`) holds the multi-Location belonging — `lives` / `works` / `plays` / `visits` / `follows` / `liked` — for every Member, with no cap on the number of affinities. Members are the creators-of-record for Location rows; affinities are separate from creation.
- **Item** — `item_locations` (per `item.md`) attaches Items to Locations with a per-attachment schedule. An Item can attach to multiple Locations (the Quarterly Dip Vendor's appearances at three different markets); a Location can host many Items across many Members. Items also carry their own QR-card affordance (Member-requestable, resolves to Item page) — see `item.md`. Locations do not carry QR cards.
- **Group** — `groups.anchor_location_id` (per `groups.md`) lets a Group anchor to a Location. A `place`-kind Group anchored to West Sacramento; an `event_anchored` Group born from a recurring Gathering at Drake's; a `business`-kind Group whose storefront is a permanent Location. Locations have no symmetrical pointer back; Groups discover their anchored Location via the FK, the Location page lists anchored Groups via reverse query.
- **Action layer** (ADR-7) — every Location write goes through a named handler.
- **Event log** (ADR-6) — every Location event row carries `acting_member_id` + `via_delegation_id`.
- **Discovery** — `discoverable_items` materialized view JOINs to nearest Location for every row; the view's locality column is populated from `locations.geography`. The Venue page pattern (per `community-platform.md`) is the Location's user-facing surface — header layout, sections, primary "Host something here" CTA. The b2 follow-Location feed reads from `member_location_affinities` joined to `item_locations` for surfaced Items.
- **Messaging (forward-looking, b2+)** — when DM and other messaging surfaces ship, **none are scoped to Locations.** Messaging is item-or-group only per the no-Location-messaging commitment in `policy.md`. There is no Location DM channel, no Location wall, no Location-scoped feed. This is the structural prevention against Nextdoor's complaint-attractor pattern.

## Policy posture

Per [`policy.md`](../foundation/policy.md):

**Default:** Locations are public records of physical places. They are visible to anyone with the URL when `discoverability='listed'`. Member presence at a Location is *not* derivable from the Location row alone — that requires Items the Member created with this Location attached, which carry their own privacy.

**Three-filter analysis:**

1. *Helpful?* Yes — Locations make the locality-first index possible, give Items and Groups a stable place-anchor, give newcomers a way to find what's happening near them without prior context (Loop 3), and let Members declare their multi-place lives (Concerts in the Park, the parks I follow, the venues I work near).
2. *Harms others?* Limited surface area. Vectors: (a) a malicious Member adding another Member's home address as a `permanent` Location with `discoverability='listed'` — mitigated by the same-coords-or-flag rule on `location.move`, by the soft-delete affordance, and by T2 takedown flows; (b) area polygons drawn to encompass private property — mitigated by the polygon being Member-authored and visible (anyone can see what was drawn); (c) a Member declaring affinity (`lives` / `works`) to a Location they don't actually have — low harm because affinities are not addressable (you don't get DM'd because you "live" somewhere) and don't grant any authority over the Location.
3. *Abusable?* The biggest risk a Location-shaped surface usually carries — a complaint wall — is structurally absent here. Messaging is item-or-group only; no Location feed exists. The remaining vector is bulk-creation of fake Locations to spam the index, mitigated by `member.create` rate limits and the same-coords-or-flag rule.

**Personal Locations (homes, porch-pickup points).** Members posting from a home address have the `discoverability='unlisted'` option — the Location exists, has a URL, but is not browseable. The pickup-point use case (Maya's porch on Tuesdays) routes through this path: the Location is unlisted; the Item references it; followers and direct visitors reach the Location through the Item. Stranger walks down the index and never encounters Maya's home.

**No address normalization at b1.** `street_address` is Member-authored free text. The platform does not run addresses through a geocoder, does not validate against postal records, and does not auto-correct. This keeps the platform from becoming an address-canonicalization service and avoids the privacy footprint of a normalized address store. T2 may revisit if the signal-to-noise ratio degrades.

## What does not ship at b1

- Auto-population from third-party sources (Google Places, OSM, public registries) — T3, opt-in only, gated on policy review.
- Photo galleries beyond a single optional photo on the Location page header — T2.
- Sub-venue user-facing surface — schema reserved at b1, surfaces at T2.
- Claim flow for inactive maintainers — T2.
- Contributor tracking / multi-maintainer surface — T2.
- Federation — `federation_origin` reserved at b1, fills at T3.
- Vector embeddings — `embedding_id` reserved at b1, fills at T3.
- Public-hours typed JSONB — at b1 lives in `ambient_extras`; T2 promotes to per-kind columns.
- Status enum (`active`/`closed`/`dormant`) — not at b1; closure inferred from absence of recent active Items.
- Address normalization / geocoding — not at b1.

## Open questions

1. **Polygon authoring UI.** Drawing a polygon for an area Location is a real UX challenge. b1 ships with a small set of pre-defined city/neighborhood polygons (loaded as seed data at launch — Sacramento metro and surrounding areas). User-drawn polygons defer until the surface is designed. Tracked: how many area-creation attempts hit "polygon I want isn't here" in the first month.

2. **Sub-venue creation flow.** Schema reserves `parent_location_id` at b1 but no surface composes it. When sub-venue surface ships at T2, the flow likely lives on the parent Location page ("Add a sub-venue") rather than as a kind picker on the create flow. Confirm with first canonical case (Drake's barn).

3. **Recurring-temporary Locations vs. Items with recurring schedules.** A Location of kind=recurring-temporary carries the Location's *operating schedule* (the market is open Saturdays 8-1). An Item attached there carries the Item's *appearance schedule* (the dip vendor is at the market the first Saturday of the month). Both are real and distinct, but the surface area where they overlap (a market that's also an Item of kind=gathering?) needs a clear modeling rule. Working answer: a market is a Location of kind=recurring-temporary; the market's vendors are Items of kind=product attached via `item_locations` with their own appearance schedules. The market itself is *not* an Item of kind=gathering. Per ADR-5.

4. **Address normalization at scale.** b1 ships free-text `street_address`. If duplicate Locations proliferate (two Members each add "Drake's, West Sac" with slightly different lat/lng and label spelling), the dedup story gets harder. Open whether T2 introduces a soft-merge surface ("you might be adding a Location that already exists") or stays out of normalization entirely. Defer until first 100 Locations are added and the duplicate rate is measured.

5. **City picker source.** The onboarding city picker (per ADR-4) reads from kind=area Locations with `area_kind='city'`. Open whether that list is platform-curated (a known, vetted set) or accepts Member additions. Working answer: platform-curated at launch; revisit if Members start adding their own cities. Affects the locality-default UX more than the data model.

6. **Sub-venue depth.** Reserved `parent_location_id` is a self-reference, allowing arbitrary depth. Practical question: do we surface only direct parent (Drake's barn → Drake's) or full ancestry (Drake's barn → Drake's → West Sacramento)? Working answer: direct parent only at T2; ancestry deferred until use case appears.

7. **Mobile/route as future kinds.** The food-truck canonical example currently models as a Member with multiple recurring-temporary Locations. If that pattern stops being expressive (a truck with no fixed stops, a roving service, a delivery route), `mobile` and `route` become candidate kinds. Don't add them until a real case can't be modeled; the kind enum stays narrow on purpose.

## Comments

The Location primitive is structurally the smallest of the three core primitives, and that is correct. Person carries identity, verbs, history, and policy. Item carries the platform's grammar across loops. Location carries *where* — and "where" benefits from being thin. A Location is a record of a place; it does not need to know what happens there. The Items and Groups attached, and the Members affiliated, do that work.

The platform's anti-Nextdoor posture lives in two places that both sit *outside* Location structure: messaging scope (item-or-group only, never Location-scoped) and complaint downvote/removal in any feed surface. The structural prevention is "no Location wall, no Location feed, no Location DM." That is what keeps the platform from sliding into the comment-board pattern Nextdoor inhabits — not the absence of Location memberships. People belong to many Locations; the platform records that belonging through `member_location_affinities` because it is true. The constraint is on *what those affinities can be used to send into*, not on whether the affinities exist.

The Location follow surface is the affirmative side of the same posture. A Member who follows Capitol Park, Cesar Chavez Plaza, and Land Park gets a feed of *what is happening there* — the Items that have attached to those Locations. They do not get a feed of *what people are saying about there*. The platform makes Locations findable, plannable, and inhabit-able; it does not turn them into a constituency to be addressed.

## Decisions encoded here

This spec is the live home for the following architectural decision. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register.

| ADR | Status | What lives here |
|---|---|---|
| ADR-14 | **Pending formal write-up** — this status banner is the ratification | Location spine + child architecture. `location_permanent`, `location_recurring_temporary`, `location_areas`. PostGIS geography on spine (Point for all kinds; centroid for area). Three kinds locked at create. |

This spec also *encodes* (but does not own) ADR-2 (bottom-anchored UI surfaces), ADR-4 (locality default via `members.home_location_id`), ADR-5 (markets are Gathering Items, not Locations of a special kind), ADR-6 (action handlers + audit fields), ADR-7 (action layer), ADR-9 (anti-Nextdoor: messaging-scope item-or-group-only). Those live cross-cutting in `DECISIONS.md`.
