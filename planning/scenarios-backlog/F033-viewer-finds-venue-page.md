---
id: how-f033-viewer-finds-venue-page
purpose: Backlog scenario — a viewer lands on a venue (Location) page and sees what's happening there.
layer: how
status: draft
---

# F033: A viewer finds a venue page and sees what's happening there

**Bundle:** b1
**Loops:** 1 (Find your people), 4 (Gather regularly)
**Canonical example:** [O1 — A group meets at a regular time and place](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) (viewer side) + [O2 — A venue's recurring program becomes findable alongside everything nearby](../../product/needs/use-cases.md#o2-a-venues-recurring-program-becomes-findable-alongside-everything-nearby).
**Primitive shape:** Person (viewer) → `locations` (read) + `items` × `item_locations` (read).
**Status:** backlog
**New scenario** — no existing F-number. The Drake's venue page was assumed-to-exist in F018 (deferred Run Club) but never specified.

## The Person

Someone who walked past Drake's, took a photo of a chalkboard with a recurring event scrawled on it, and searched the platform for "Drake's" — or someone tapped through from an Item attached to Drake's and wants the venue context: where is this, what else is happening here, who runs the place.

## The Story

`/p/[…place]/l/[slug]` loads. Header: hero image (optional), venue name, address with distance from the viewer's locality (anon: IP-geolocated; auth: `home_location_id`), public hours if set. Below the header, a primary CTA — **"Host something here"** — opens the gathering composer (F034) with this Location pre-attached.

Sections below the CTA:
- **What's happening here** — Items attached to this Location, sorted by next-occurrence date; gatherings show their recurring schedule; products and services show as "available here."
- **About** — Member-authored description, accessibility notes, the kind tag (permanent / recurring-temporary / area).
- A secondary CTA — **"Follow this venue"** — writes a default-labeled `member_saved_searches` row with `location_id` set (per ADR-21). Auth-gated for write; visible to anon with sign-in prompt.

## Surfaces

- **Entry point:** `/p/[…place]/l/[slug]` — reachable from any Item attached to this Location, the locality feed, and direct link.
- **Primary action:** "Host something here" (opens F034 gathering composer with Location pre-attached).
- **Secondary action:** "Follow this venue" (writes `member_saved_searches` row).
- **Completion:** Read surface — completion is the viewer's onward action (tap an Item, follow the venue, host something).
- **Discovery:** N/A — this IS the discovery surface for the venue.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Follow this venue | `member_saved_searches(member_id, location_id, label='Drake's')` — default label derived from venue name | yes (write on tap) |

Read-side: `locations` (spine + child table per kind), `items` × `item_locations` join, `discoverable_items` view for the "What's happening here" section to keep the read off base tables.

Implicit: `member.saved_search.created` event with default `label` and `location_id` populated, `place_id`/`interest_tags`/`item_kinds` null at b1; future b2 saved-search composer lets the Member edit label + add filters.

## Acceptance Criteria

### Anonymous visitor can read the venue page

**Given** an anonymous visitor opens `/p/[…place]/l/[slug]`
**When** the page loads
**Then** header (name, address, distance from IP-geo locality), "What's happening here" Items, and About section render; no auth required.

### "Host something here" CTA opens the gathering composer with Location pre-attached

**Given** an auth'd Member on the venue page
**When** they tap "Host something here"
**Then** the F034 gathering composer opens with this Location's `location_id` pre-attached as `item_locations.location_id`; the Member can change the Location but it's the default.

### Anonymous tap on "Host something here" → sign-in flow

**Given** an anonymous visitor taps "Host something here"
**When** the tap fires
**Then** auth opens with return URL set; on successful sign-in, the composer opens with the Location still pre-attached.

### "Follow this venue" writes a saved-search row

**Given** an auth'd Member on the venue page
**When** they tap "Follow this venue"
**Then** a `member_saved_searches` row writes with `(member_id, location_id, label=<venue name>, interest_tags=NULL, item_kinds=NULL, removed_at=NULL)`; `member.saved_search.created` event logs; CTA flips to "Following" with unfollow affordance.

### "What's happening here" reads from `discoverable_items`

**Given** Items are attached to this Location
**When** the venue page loads
**Then** the "What's happening here" section reads from `discoverable_items` materialized view (not base tables), sorted by next-occurrence date; gatherings show recurring schedule; product/service Items show as "available here."

## Edge Cases

- **Venue has no Items attached:** empty-state ("Nothing posted here yet. Be the first to host something!") with the same primary CTA.
- **Venue is `discoverability='private'`:** 404 to non-owner viewers.
- **Anon viewer with no IP-geolocation match:** distance line omitted; rest of page renders.
- **Soft-deleted Location:** 404; if `handle_history`-equivalent exists for Locations, redirect (b2 surface).

## Assumptions

- Phase 1 substrate: `locations` + child tables, `items`, `item_locations`, `discoverable_items` view.
- S-saved-search substrate ticket lands before this scenario goes to ticket — table + `member.saved_search.*` action handlers + events.
- Place-scoped URL routing per ADR-20 is wired (the `/p/[…place]/l/[slug]` resolver works).

## Out of Scope

- Sub-venue support ("Drake's barn" as a sub-Location of Drake's) — schema reserved at b1 via `locations.parent_location_id`; surface at b2.
- Venue-page bulletin or announcement section — venues don't broadcast; that's a producer-tools concern.
- Venue claim / steward flow (a venue regular asking to manage the page) — b2.
- Saved-search composer UI for editing filters/label after the default write — b2 per ADR-21.

## Capabilities unlocked

- **1. Presence & Findability** — venue public pages at place-scoped URLs (`/p/[…]/l/[slug]`).
- **5. Customer & Community Relationships** — members can follow a venue (saved-search substrate).
- **7. Operations & Logistics** — anchor Location surfaces with "What's happening here" aggregation.
