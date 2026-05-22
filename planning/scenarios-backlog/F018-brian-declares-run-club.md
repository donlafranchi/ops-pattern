# F018: Brian declares the Run Club

**Bundle:** b1
**Loops:** 1 (Find your people), 4 (Gather regularly)
**Canonical example:** [Run Club at Drake's](../../product/needs/use-cases.md#1-the-unofficial-run-club-at-drakes)
**Primitive shape:** Person → Item(kind=gathering, recurring) → Location(Drake's, permanent)
**Status:** deferred (2026-05-18) — needs rewrite; do not promote until the b1 implementation plan recommends pulling it in. The 2026-05-18 review ([`../history/F018-review.md`](../history/F018-review.md)) lands a REVISE verdict with three blockers (item.md state-enum reconciliation, design-language.md component recipes for kind picker / Share-link / Event-page recurring surface, `/i/` → `/e/` + kind-label harmonization). The rewrite should incorporate those fixes and re-anchor against the post-2026-05-11 naming pass. T045–T049 (the Phase 1 schema tickets) do not depend on F018; they open against system specs directly.

## The Person

Brian is one of the regulars at the Thursday-night Run Club at Drake's in West Sacramento. There's no website, no calendar, no flyer. Newcomers find out by being there on a Thursday. Brian wants a single shareable URL he can text to friends, drop into the WhatsApp group, chalk on the board at Drake's, and put on a flyer if he wants — so a stranger searching the platform for "what's happening near Drake's this week" can find it and show up Thursday. He doesn't want to host a Substack or run a WhatsApp group — he wants a public page that exists.

## The Story

Brian opens the platform on his phone and goes to the page for Drake's. He's been there as a customer; he's seen the venue page before. There's a clearly labeled action below the venue header: **"Host something here."** He taps it.

The composer that opens is shaped for hosting at this venue. It already knows the location is Drake's. It asks what kind of thing he's hosting — but in his language: a one-time event, a recurring gathering, or an open meetup. He picks "recurring gathering."

He enters: **Unofficial Run Club**. Description: *"5K easy pace, all welcome, beer after."* Recurrence: **every Thursday**, 6:00 PM, ongoing. He optionally adds hashtags (`#running`, `#westsac`). He hits publish.

He lands on `/i/unofficial-run-club-drakes` (or similar). The page shows: title, recurring time, Drake's as the location with a map pin, the description, hashtags. A "Share link" affordance lets him copy the URL to his clipboard or trigger the native share sheet on mobile — he texts it to two regulars and pastes it into the WhatsApp group. The page is also now listed on Drake's venue page under "What's happening here," and surfaces in the locality-first index for anyone within 10 miles browsing "this week."

## Surfaces

- **Entry point:** Drake's venue page (`/l/[location-slug]`) — primary CTA below the venue header: **"Host something here."** A secondary entry point lives on Brian's `/you` page ("Things you host"), but for the canonical Run Club case the venue-page entry is the path.
- **Primary action button:** "Host something here." (verb-first, surface-anchored — never "Create Item.")
- **Composer:** opens with the location pre-attached. Asks **what kind of thing** in user language — "one-time event," "recurring gathering," "open meetup" — and reveals the right fields. No four-kind picker. The composer is gathering-shaped because the surface is.
- **Completion:** lands on `/i/[slug]` — the public Item page. "Share link" affordance copies the URL or invokes the native share sheet.
- **Discovery:**
  - Drake's venue page lists this under "What's happening here" with the next occurrence date.
  - Locality-first index surfaces it for users within ~10mi browsing "this week."
  - Hashtag pages (`/h/running`, `/h/westsac`) include it.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| What you're calling it | `items.title` | yes |
| Description | `items.description` | yes |
| Where it happens | `item_locations` → Drake's (already in DB) | yes |
| One-time or recurring? | drives recurrence pattern below | yes |
| Day(s) and time | `item_gatherings.starts_at` (first occurrence), `item_gatherings.recurrence_rule` (RRULE) | yes if recurring |
| End time | `item_gatherings.ends_at` | optional |
| Capacity | `item_gatherings.capacity` | optional |
| Cost | `item_gatherings.cost_cents` (null = free) | optional, default null |
| What to bring | `item_gatherings.what_to_bring` | optional |
| Hashtags | `item_hashtags` (autocomplete from existing) | optional |

Implicit (not user-facing fields, but the schema sets them): `items.kind = 'gathering'`, `items.member_id = Brian`, `items.state = 'published'`, `item.created` event logged, `group_id = null` (Run Club is not a Group — see [`groups.md`](../../product/systems/groups.md); the regulars can choose to become a kind='event_anchored' Group later, but the Item works without it).

## Acceptance Criteria

### Brian discovers the entry point on the venue page

**Given** an authenticated Member is on the Drake's venue page
**When** the page loads
**Then** a primary CTA labeled "Host something here" is visible below the venue header — no requirement to navigate to `/new` or any kind picker

### The composer is location-aware and verb-shaped

**Given** Brian taps "Host something here" on Drake's venue page
**When** the composer loads
**Then** Drake's is pre-attached as the location (he can change it but it's the default), and the composer asks "What kind of thing?" with three options in user language: one-time event, recurring gathering, open meetup — not a four-way Product/Service/Gathering/Wonder picker

### Recurring gathering creates a published Item with an RRULE

**Given** Brian has selected "recurring gathering" and filled title, day, time, description
**When** he submits
**Then** an `items` row (kind=gathering, state=published) and an `item_gatherings` row (with RRULE) are written, an `item.created` event is appended, and Brian is redirected to `/i/[slug]`

### The Item page shows next occurrence and supports sharing

**Given** Brian is on `/i/unofficial-run-club-drakes`
**When** the page loads
**Then** the page shows title, description, the next occurrence as a human-readable date (e.g., "Thursday, May 14, 6:00 PM"), the location as a map pin and address, hashtags as clickable chips, and a "Share link" affordance that copies the canonical URL to the clipboard (and invokes the native share sheet on mobile if available)

### The Item appears on the venue page and locality index

**Given** the Item is published
**When** another user opens Drake's venue page
**Then** the Item appears under "What's happening here" with the next occurrence date

**And When** a user within 10 miles opens the locality-first index filtered to "this week"
**Then** the Item appears in the list, sorted by upcoming occurrence

## Edge Cases

- **Brian is unauthenticated:** "Host something here" prompts sign-in with a return URL.
- **Drake's doesn't exist as a Location yet:** the venue-page entry isn't reachable. Covered by a separate scenario for declaring at a new Location.
- **Brian wants to cancel a single occurrence:** out of scope at b1 — recurrence is uninterruptible. Defer.
- **Brian renames the gathering or moves it to a new venue:** edit flow — separate scenario. At b1, edit-gathering touches title, description, hashtags, recurrence, capacity, cost, what to bring; not the host or kind.
- **Slug collision** (someone else already created `/i/unofficial-run-club-drakes`): append a short suffix (`-2`, `-3`).
- **Recurrence in the past:** validation error — first occurrence must be in the future.

## Assumptions

- Drake's exists in `locations` (geocoded, slugged).
- Brian is an authenticated Member.
- Hashtag autocomplete pulls from existing `item_hashtags` rows.
- The locality-first index (`discoverable_items` materialized view) is in place — see [`b1-primitives.md`](../bundles/b1-primitives.md).
- "Host something here" CTA on venue pages is a separate ticket; this scenario depends on it.

## Out of Scope

- RSVP / attendance tracking (b2).
- Notifications to Drake's followers when a new gathering is posted at the venue (b2).
- Photo upload for gatherings (separate ticket — schema reserves the column at b1).
- Embed-to-social and rich social card previews (Open Graph beyond the basics) — not at b1; the canonical URL plus a basic share affordance is the b1 surface.
- QR card or printable PDF for the gathering — explicitly out of scope. QR cards are Item-level Member-requestable per [`qr-onboarding.md`](../../product/capabilities/qr-onboarding.md); gatherings share by URL at b1.
- Group attachment (Run Club regulars don't need to be a Group to use this surface — see [`groups.md`](../../product/systems/groups.md); Group formation is emergent and optional).
