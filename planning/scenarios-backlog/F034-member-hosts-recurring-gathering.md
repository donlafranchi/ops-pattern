---
id: how-f034-member-hosts-recurring-gathering
purpose: Backlog scenario — a member hosts a recurring gathering at an existing venue via the "Host something here" CTA.
layer: how
status: draft
---

# F034: A member hosts a recurring gathering at a venue

**Bundle:** b1
**Loops:** 1 (Find your people), 4 (Gather regularly)
**Canonical example:** [O1 — A group meets at a regular time and place](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) — Run Club at Drake's.
**Primitive shape:** Person → Item(kind='gathering', recurring) → Location(permanent, pre-attached); optional kind='event_anchored' Group emergence reserved for b2.
**Status:** backlog
**Replaces:** F018 (archived; reframed). Fixes the three review blockers from the 2026-05-18 REVISE verdict: (1) `item.md` state enum reconciliation (now `draft/published/withdrawn/fulfilled/closed`), (2) design-language component recipes for kind picker / Share-link / Event-page recurring surface, (3) `/i/` → `/e/` URL slot + kind-label harmonization. URLs now follow ADR-20 + ADR-22 (place-scoped + random-suffix slug).

## The Person

A regular at a recurring informal meetup — the Thursday-night runners at Drake's, the Sunday board-gamers at a brewery, the weekly book club rotating between members' homes. They want a single shareable URL anyone can text, chalk on a board, drop into a group chat — replacing the three-app sprawl of "DM the lead, ask the regulars, walk in and see."

## The Story

They open the venue's page (F033) and tap **"Host something here."** The composer that opens already knows the Location. It asks **what kind of thing** in user language — one-time event, recurring gathering, open meetup. They pick "recurring gathering."

Fields: title, description, recurrence (every Thursday, 6:00 PM, ongoing), optional capacity, optional cost, optional what-to-bring, optional hashtags. They tap publish.

They land on the kind-specific Item URL — `/p/[…place]/l/[location-slug]/e/[slug]-[random4]` (when filed under the venue) or `/m/[handle]/e/[slug]-[random4]` (when filed under the Member directly, no venue scope). The page shows next occurrence as a human-readable date, the recurring pattern, Location with map pin, description, hashtags. A "Share link" affordance copies the URL or invokes the native share sheet.

The Item now appears under "What's happening here" on the venue page and in the locality-first awareness feed for Members within scope.

## Surfaces

- **Entry point:** venue page primary CTA "Host something here" (F033). Secondary entry: `/you` "Host a gathering" affordance.
- **Primary action:** "Host something here" → composer.
- **Composer / interaction:** Location pre-attached. Kind picker in user language (one-time / recurring / open meetup), revealing the right fields. No four-kind Product/Service/Gathering/Wonder picker.
- **Completion:** Lands on `/p/[…place]/l/[location-slug]/e/[slug-suffix]` (or `/m/[handle]/e/[slug-suffix]`) with a Share-link affordance.
- **Discovery:** Item surfaces under "What's happening here" on the venue page + in the locality-first feed for Members within scope.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| What you're calling it | `items.title` | yes |
| Description | `items.description` | yes |
| Where (auto, editable) | `item_locations(item_id, location_id, schedule_kind='recurring')` | yes |
| One-time / recurring / open meetup | drives recurrence pattern below | yes |
| Day(s) + time | `item_gatherings.starts_at` (first occurrence), `item_gatherings.recurrence_rule` (RRULE) | yes if recurring |
| End time | `item_gatherings.ends_at` | optional |
| Capacity | `item_gatherings.capacity` | optional |
| Cost | `item_gatherings.cost_cents` (null = free) | optional |
| What to bring | `item_gatherings.what_to_bring` | optional |
| Hashtags | `item_hashtags` (autocomplete from existing) | optional |

Implicit: `items.kind='gathering'`, `items.member_id=<host>`, `items.state='published'`, `item.created` + `item.published` events with `acting_member_id`, `items.group_id=NULL` (Group emergence b2).

## Acceptance Criteria

### "Host something here" opens composer with Location pre-attached

**Given** an auth'd Member on the venue page taps "Host something here"
**When** the composer loads
**Then** Drake's (the venue) is pre-attached as `item_locations.location_id`; the Member can change it, but it's the default.

### Composer asks "what kind" in user language

**Given** the composer is open
**When** the Member starts
**Then** they see three options — one-time event, recurring gathering, open meetup — not a four-way Product/Service/Gathering/Wonder picker. Each selection reveals the appropriate fields.

### Recurring gathering writes Item + child + events in one transaction

**Given** the Member has selected "recurring gathering" and filled title, day, time, description
**When** they tap publish
**Then** in one transaction: `items` row (kind='gathering', state='published') writes, `item_gatherings` row (with RRULE) writes, `item_locations` row writes, `item.created` + `item.published` events log with `acting_member_id`. Member is redirected to the kind-specific Item URL.

### Item URL follows place-scoped + random-suffix pattern

**Given** the gathering is published under a venue
**When** the URL is generated
**Then** the URL takes the shape `/p/[…place]/l/[location-slug]/e/[title-slug]-[4-char-random]` per ADR-20 + ADR-22. If no venue is attached (composer entered from `/you`), URL falls back to `/m/[handle]/e/[title-slug]-[4-char-random]`.

### Item page shows next occurrence + Share-link

**Given** the gathering exists
**When** any viewer (anon or auth) loads the page
**Then** the page shows title, description, next-occurrence as a human-readable date, recurring pattern in human terms ("every Thursday, 6:00 PM"), Location with map pin + address, hashtags as clickable chips, and a "Share link" affordance that copies the canonical URL (and invokes the native share sheet on mobile).

### Item appears on venue page + locality feed

**Given** the gathering is published
**When** any viewer loads the venue page or the locality feed (matched by place-interest + tag)
**Then** the Item appears under "What's happening here" on the venue page with the next-occurrence date, and in the locality feed sorted by upcoming occurrence.

## Edge Cases

- **Unauthenticated host attempt:** "Host something here" → auth flow with return URL; composer opens after sign-in with Location still pre-attached.
- **Recurrence in the past:** validation error — first occurrence must be in the future.
- **Slug collision:** the random suffix is collision-resistant by construction (per ADR-22); on the unlikely collision, regenerate suffix.
- **Member cancels a single occurrence:** out of scope at b1; recurrence is uninterruptible until edit-gathering ships (b2).
- **Member edits the gathering after publish:** at b1, edit covers title, description, hashtags, recurrence, capacity, cost, what-to-bring — not host, kind, or Location.

## Assumptions

- Phase 1 substrate: `items` (spine + `item_gatherings`), `item_locations`, `item_hashtags`, `discoverable_items` view.
- F033 (venue page with "Host something here" CTA) ships before or alongside this scenario.
- Hashtag autocomplete pulls from existing `item_hashtags` rows.
- Action handlers: `item.create`, `item.publish`, `item.attach_location` (per Phase 2 plan).
- Component recipes for kind picker, Share-link affordance, and event-page recurring surface are added to `design-language.md` before ticket (per the 2026-05-18 REVISE punch list).

## Out of Scope

- RSVP / attendance tracking (b2 — `item_responses` substrate exists at b1 but no RSVP UI ships).
- Photo upload for gatherings (schema reserves the column at b1).
- Open Graph / rich social card previews beyond basic share — b2.
- Edit-gathering flow — separate scenario (b2).
- Single-occurrence cancellation — separate scenario (b2).
- Group attachment / `kind='event_anchored'` Group emergence — schema reserved at b1, surface at b2.
- QR card for the gathering — covered in F041 (cross-cutting QR card scenario).

## Capabilities unlocked

- **1. Presence & Findability** — Items appear in the locality-first awareness feed; place-scoped URL is shareable + chalk-on-a-board-able.
- **2. Product & Service Listing** — gathering composer (the third Item-kind composer; aligns with product + service composers).
- **7. Operations & Logistics** — Recurring schedule on gathering Items (RRULE — weekly/monthly/custom); Location attachment.
