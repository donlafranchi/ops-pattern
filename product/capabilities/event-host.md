---
id: what-event-host
purpose: Members host events from a venue-page CTA.
layer: what
status: active
---

# Event Host

> **Naming.** User-facing label is **Event**. Schema name is `items.kind = 'gathering'` (durable; do not rename in code). URL is `/e/[slug]`. See [`../../CLAUDE.md`](../../CLAUDE.md) § Naming conventions.

**Tier:** T1
**Bundle:** b1
**Primitive:** Item (kind=gathering) at a Location
**Loops served:** 1 (Find your people), 4 (Gather regularly)
**Canonical example:** [O1 — A group meets at a regular time and place](../needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) (Run Club at Drake's); [O2 — A venue's recurring program becomes findable](../needs/use-cases.md#o2-a-venues-recurring-program-becomes-findable-alongside-everything-nearby) (Barn Movie Night at Drake's)

## What a Member can do

A Member hosts an Event at a known Location. The composer is invoked from a *surface-specific* CTA — most often the Location's venue page ("Host something here") — never from a generic `/new` route. The composer asks for the Event's shape (one-time, recurring, open meetup) in user language, then collects the fields appropriate to that shape: title, description, schedule, capacity, what to bring, optional cost, optional hashtags.

The result is a public Event page at `/e/[slug]` — a stable, shareable URL the host can text, post in a group chat, chalk on a board, or include on a flyer. Discovery happens through the locality search and the venue page, not through scanning. The Event appears on the venue's page under "What's happening here," in the locality-first index for users browsing nearby this week, and on hashtag pages.

## T1 scope (ships at b1)

- Surface-specific entry from the venue page (`/l/[slug]` → "Host something here") and from the Member's `/m/[handle]` page ("Things you host").
- Composer pre-attaches the location when invoked from a venue page.
- Three shape options in user language: one-time, recurring, open meetup. Maps internally to schedule patterns; the user never sees `kind`.
- Required fields: title, description, schedule (date+time, plus recurrence rule for recurring), location.
- Optional fields: capacity, cost (null = free), what to bring, RSVP cutoff, hashtags.
- Public Event page at `/e/[slug]` with a "Share link" affordance (copy URL, native share sheet on mobile).
- Surfaces in: venue page (`/l/[slug]`), locality-first index (`/`), hashtag pages (`/h/[tag]`).
- Optional Group scoping (`group_id` defaults to the Member's `primary_group_id` if set, else null; per [`../systems/groups.md`](../systems/groups.md)).

## Deferred

- RSVP / attendance tracking (b2).
- Notifications to venue followers when a new Event is posted (b2).
- Photo upload for Events (schema column reserved at T1; upload flow is its own ticket).
- Editing the host (transferring ownership) (b2).
- Cancelling a single occurrence of a recurring Event (b2).

## Acceptance signal

Brian (a regular at the Run Club) opens Drake's venue page on his phone, taps "Host something here," fills in title + recurring schedule + description in under 90 seconds, hits publish, and lands on `/e/unofficial-run-club-drakes`. He copies the URL and texts it to the WhatsApp group; one regular chalks it on the board at Drake's. A stranger searching the locality for "what's happening near me Thursday evening" finds the Event on the venue page and in the locality feed.

## Related capabilities

- `event-attend` (b2) — RSVP / "I'm coming" affordance.
- [Home — Locality Feed](../ui/community-platform.md) — the surface where Events are discovered by strangers.
- [Explore — Locality Browse](../ui/community-platform.md) — the search/filter surface.
- `following` — venue followers and host followers receive notifications when the host publishes a new Event at their venue.

## Related scenarios

- [`scenario-F018-brian-declares-run-club.md`](../../planning/backlog/scenario-F018-brian-declares-run-club.md) — the canonical example, fully specced.
- (future) Movie-Night-at-Drake's variant — same capability, different Event shape (one-time vs recurring).

## Changelog

**2026-05-11** — Renamed from `gathering-host.md` → `event-host.md` as part of the platform-wide naming pass. User-facing label switched from "gathering" to "Event." URL switched from `/i/[slug]` to `/e/[slug]`. Schema enum value `items.kind = 'gathering'` is preserved (two-name pattern per CLAUDE.md § Naming conventions).
