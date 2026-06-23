---
id: how-f033-viewer-finds-venue-page
purpose: Backlog scenario — a viewer lands on a venue (Location) page, sees what the venue itself hosts, discovers nearby activity, and follows the venue.
layer: how
status: approved
---

# F033: A viewer finds a venue page and sees what's happening there

**Bundle:** b1
**Sub-bundle:** b1.3 (Gather — venue pages surface alongside gatherings)
**Work-map item:** What gatherers can do → Find a venue's public page and follow it
**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly), 8 (Follow what you love)
**Canonical example:** [O1 — A group meets at a regular time and place](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) (viewer side) + [O2 — A venue's recurring program becomes findable alongside everything nearby](../../product/needs/use-cases.md#o2-a-venues-recurring-program-becomes-findable-alongside-everything-nearby).
**Primitive shape:** Person (viewer) → `locations` (read) + `items` filtered by venue-owning Group (`items.group_id` = anchored Group) × `item_locations` (read).
**Status:** approved
**New scenario** — no existing F-number. The Drake's venue page was assumed-to-exist in F018 (deferred Run Club) but never specified.

## The Person

Someone who walked past Drake's, saw a chalkboard advertising a weekly trivia night, and searched the platform for "Drake's." Or someone who tapped through from a gathering Item attached to Drake's and wants the venue context: where is this place, what else does Drake's itself host, and how do I stay in the loop?

## The Story

The viewer opens `/p/[…place]/l/[slug]` for Drake's. A header shows: hero image (optional), venue name, address, and distance from the viewer's locality. For an auth'd Member, distance derives from their primary home Place centroid (`member_place_interests` where `scope_kind='primary_home'` → `places.centroid`). For an anonymous visitor, IP-geolocation or distance is omitted.

Below the header, a primary CTA — **"Follow this venue"** — lets the viewer subscribe to future activity at this Location. For auth'd Members, tapping writes a `member_saved_searches` row. For anon visitors, tapping opens the auth flow with a return URL.

The page's main content section — **"What's happening here"** — shows only Items hosted by the venue's owning Group. The owning Group is the kind='business' Group whose `anchor_location_id` matches this Location. Drake's trivia night (hosted by Drake's Group, with Drake's as both Host and Venue) appears. A birthday party that happens to be *at* Drake's (where the Member is the Host, Drake's is just the Venue) does not — that event lives on the Host's own page.

**Key distinction: Host vs. Venue.** Every Item has a Host (the organizer — a Member or a Group, via `items.group_id` or `items.member_id`) and optionally a Venue (the physical Location, via `item_locations`). These are distinct roles. The venue page's "What's happening here" is scoped by Host (the owning Group), not by Venue attachment alone.

A secondary affordance — **"What's happening nearby"** — is a button or expandable section (not always visible, not competing with the venue's own content). It surfaces public Items geographically close to this Location but hosted by someone other than the venue's owning Group. The Thursday Run Club at Drake's (hosted by the Run Club Group) appears here. Private events at Drake's (a birthday party with non-public discoverability) appear nowhere on this page — they live only on the Host's page.

Below the Items sections, an **About** block shows the Member-authored description, accessibility notes, and the Location kind tag (permanent / recurring-temporary / area).

A secondary CTA — **"Host something here"** — opens the gathering composer (F034) with this Location pre-attached. Secondary because most venue-page visitors are browsing or following, not creating.

## Surfaces

- **Entry point:** `/p/[…place]/l/[slug]` — reachable from any Item attached to this Location, the locality feed, and direct link.
- **Primary action:** "Follow this venue" (writes `member_saved_searches` row with `location_id`).
- **Secondary action:** "Host something here" (opens F034 gathering composer with Location pre-attached).
- **Composer / interaction:** No composer on this page. "Follow" is a single-tap write; "Host something here" navigates to the gathering composer.
- **Completion:** Read surface — completion is the viewer's onward action (tap an Item, follow the venue, host something).
- **Discovery:** N/A — this IS the discovery surface for the venue.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Follow this venue | `member_saved_searches(member_id, location_id, label='Drake's')` — default label derived from venue name | yes (write on tap) |

Read-side joins for "What's happening here": `locations` → `groups` (where `groups.anchor_location_id = locations.id` AND `groups.kind = 'business'`) → `items` (where `items.group_id = groups.id` AND `items.state = 'published'`) × `item_locations` (where `item_locations.location_id = locations.id`).

Read-side joins for "What's happening nearby": `item_locations` × `locations` (proximity query on `geography`) → `items` (where `items.group_id != venue_owning_group.id` OR `items.group_id IS NULL`) with `items.state = 'published'`. Excludes Items where discoverability is `private` or `unlisted`.

Implicit: `member.saved_search.created` event with default `label` and `location_id` populated, `place_id`/`interest_tags`/`item_kinds` null at b1.

## Acceptance Criteria

### Anonymous visitor reads the venue page

**Given** an anonymous visitor opens `/p/[…place]/l/[slug]` for a listed Location
**When** the page loads
**Then** the header renders venue name, address, and About section; no auth required.
_Why: Loop 3 (Land here) — the venue page must be fully readable without login, same as the locality feed. The newcomer with zero context is the highest-value visitor._

### Distance displays from the viewer's primary home Place centroid

**Given** an auth'd Member whose `member_place_interests` row with `scope_kind='primary_home'` resolves to a Place with a centroid
**When** they view the venue page
**Then** the header shows distance derived from that Place's centroid to the venue's coordinates.
_Why: `home_location_id` is a vestigial soft pointer to a specific Location. Distance reflects the Member's community-awareness scope (Place-level), not a raw Location coordinate. `member_place_interests` is the community-awareness feed's source, so distance is consistent with that scope._

### Anon visitor distance is omitted or IP-derived

**Given** an anonymous visitor with no `member_place_interests` row
**When** the venue page loads
**Then** distance is derived from IP-geolocation if available, or omitted entirely; the rest of the page renders normally.
_Why: the platform does not require location disclosure from anonymous visitors. Omission is the safe default per `policy.md` opt-out posture._

### "What's happening here" shows only venue-hosted Items

**Given** Drake's Location has Items attached via `item_locations`:
- Trivia Night (kind='gathering', `items.group_id` = Drake's business Group) — Host and Venue are the same entity
- Thursday Run Club (kind='gathering', `items.group_id` = Run Club Group) — Host is Run Club, Venue is Drake's
- A private birthday party (kind='gathering', `items.member_id` set, `items.group_id` = NULL, discoverability not public)
**When** the venue page loads
**Then** only Trivia Night appears in "What's happening here." The Run Club and the birthday party do not.
_Why: the venue page is the venue's own storefront — it shows what the venue itself hosts, not everything that happens to occur at the venue's coordinates. The Run Club's event lives on the Run Club's Group page and in the locality feed. This preserves the Host/Venue distinction: `items.group_id` determines Host; `item_locations.location_id` determines Venue._

### "What's happening nearby" shows public non-venue-hosted Items

**Given** public Items exist at Locations geographically close to Drake's, hosted by Groups or Members other than Drake's business Group
**When** the viewer expands the "What's happening nearby" section
**Then** those public Items appear, sorted by proximity and next-occurrence date. Private or unlisted Items do not appear.
_Why: secondary discovery affordance — a viewer interested in Drake's is likely interested in the surrounding area. This section must not compete with the venue's own content ("What's happening here"), which is why it's collapsed or secondary by default._

### Private events at a venue do not surface on the venue page

**Given** a Member hosts a private birthday party at Drake's (the Item's `item_locations` attaches it to Drake's, but the Item is not public and is not hosted by Drake's Group)
**When** the venue page loads
**Then** the private event appears in neither "What's happening here" nor "What's happening nearby."
_Why: private events surface only on the Host's own page. The venue page is a public discovery surface; surfacing private events there violates the Host's privacy expectation and the opt-out default in `policy.md`._

### "Follow this venue" is the primary CTA

**Given** an auth'd Member on the venue page who has not yet followed this venue
**When** they tap "Follow this venue"
**Then** a `member_saved_searches` row writes with `(member_id, location_id, label=<venue name>, interest_tags=NULL, item_kinds=NULL, removed_at=NULL)`; `member.saved_search.created` event logs; CTA flips to "Following" with unfollow affordance.
_Why: most venue-page visitors are consuming (browsing, following), not creating. "Follow" serves Loop 8 (Follow what you love) — the standing relationship that turns a one-time visit into recurring awareness. "Host something here" is the minority action and lives secondary. Per `principles.md` people-first — the primary CTA serves the majority visitor._

### Anonymous tap on "Follow this venue" opens sign-in flow

**Given** an anonymous visitor taps "Follow this venue"
**When** the tap fires
**Then** auth opens with return URL set; on successful sign-in, the saved-search row writes and the CTA flips to "Following."
_Why: follow requires auth (writes a `member_saved_searches` row). The return-URL pattern ensures the visitor lands back on the venue page with their follow active, not on a generic home screen._

### "Host something here" opens the gathering composer with Location pre-attached

**Given** an auth'd Member on the venue page
**When** they tap "Host something here"
**Then** the F034 gathering composer opens with this Location's `location_id` pre-attached as `item_locations.location_id`; the Member can change the Location but it's the default.
_Why: verb-first composer commitment — the entry point is the venue, not `/new` with a kind picker. The Location pre-attachment reduces friction for the most natural use case ("I want to host something at this specific venue")._

### Anonymous tap on "Host something here" opens sign-in flow

**Given** an anonymous visitor taps "Host something here"
**When** the tap fires
**Then** auth opens with return URL set; on successful sign-in, the composer opens with the Location still pre-attached.

### Venue with no venue-hosted Items shows empty state

**Given** a listed venue Location with a kind='business' Group anchored but no published Items with `group_id` matching that Group
**When** the venue page loads
**Then** "What's happening here" renders an empty state ("Nothing scheduled yet.") and the "Follow this venue" CTA remains prominent.
_Why: the empty state must not suggest the viewer should host something — the venue owner creates their own content. The follow CTA stays primary because the viewer's most useful action is to follow and be notified when the venue does post something._

### Venue with no anchored business Group shows minimal page

**Given** a listed venue Location with no kind='business' Group whose `anchor_location_id` matches this Location
**When** the venue page loads
**Then** "What's happening here" is absent (no owning Group to scope against); the "What's happening nearby" affordance may appear if nearby public Items exist; "Follow this venue" and "Host something here" CTAs both render.
_Why: not every Location has an owning business Group. A public park, a community center, or a bar that hasn't yet created a business Group can still have a useful venue page — just without the venue-scoped "What's happening here" section._

## Edge Cases

- **Venue is `discoverability='private'`:** 404 to non-owner viewers.
- **Anon viewer with no IP-geolocation match:** distance line omitted; rest of page renders.
- **Soft-deleted Location:** 404; if handle-history-equivalent exists for Locations, redirect (b2 surface).
- **Venue-owning Group is dissolved:** "What's happening here" section is absent (no active Group to scope against); page still renders with About and CTAs.
- **Multiple kind='business' Groups anchored at the same Location:** edge case at b1 scale — use the first active Group; flag for resolution at b2 if collisions occur.
- **Item attached to venue but Host Group is dissolved:** Item does not appear in "What's happening here" (no active matching Group); may appear in "What's happening nearby" if still public.

## Assumptions

- Phase 1 substrate: `locations` + child tables, `items`, `item_locations`, `groups` with `anchor_location_id`.
- S-saved-search substrate landed (T102: `<FollowVenueButton>`, `followVenueAction`/`unfollowVenueAction` built). Gate closed 2026-06-11.
- Place-scoped URL routing is wired (the `/p/[…place]/l/[slug]` resolver works).
- `member_place_interests` with `scope_kind='primary_home'` rows exist for auth'd Members (shipped with F030).
- `places.centroid` exists (shipped with S-polygon / T076).

## Out of Scope

- Sub-venue support ("Drake's barn" as a sub-Location of Drake's) — schema reserved at b1 via `locations.parent_location_id`; surface at b2.
- Venue-page bulletin or announcement section — venues don't broadcast; that's a producer-tools concern (b2).
- Venue claim / steward flow (a venue regular asking to manage the page) — b2.
- Saved-search composer UI for editing filters/label after the default write — b2.
- The "What's happening nearby" radius and sorting algorithm — the scenario specifies the affordance exists and shows public Items by proximity; the exact radius and ranking are implementation decisions for `ticket`.

## Capabilities unlocked

- **1. Presence & Findability** — venue public pages at place-scoped URLs (`/p/[…]/l/[slug]`).
- **5. Customer & Community Relationships** — members can follow a venue (saved-search substrate).
- **7. Operations & Logistics** — anchor Location surfaces with "What's happening here" aggregation scoped to venue-hosted Items.
