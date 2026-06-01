---
id: how-f040-producer-lists-service
purpose: Backlog scenario — a producer lists a service Item via the service composer.
layer: how
status: draft
---

# F040: A producer lists a service

**Bundle:** b1
**Loops:** 9 (Find a local pro), 9 (Make a living locally)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services) — the service half. P5 is the long-form deferred case; this b1 scenario ships the minimal substrate.
**Primitive shape:** Person → Item(kind='service', service area as radius-from-point) → Location(optional anchor; service may be area-wide).
**Primitive shape:** Person → Item(kind='service', `item_services.service_area_geography`) → optional Group(kind='business') filing.
**Status:** backlog
**New scenario** — no existing F-number. Completes the three b1 Item composers (gathering, product, service).

## The Person

A piano teacher, a plumber, a hairdresser, an in-home dog trainer. They want a public page that says what service they offer, where they offer it, and what it costs — without the platform pretending to be Yelp or Angi. The b1 surface is "post a service, be findable." Richer fields (appointment availability, scope of work, prerequisites) are deferred to b2+ per P5.

## The Story

From the Group page or `/you`, the producer taps **"Add a service."** The service composer opens.

Fields: title ("Piano lessons — 30 min"), description, service area (radius-from-point — they pick a center point and a mile/km radius), pricing model (flat / hourly / per-session / free), optional anchor Location (their home, the studio, or area-wide).

They publish. Land on `/p/[…place]/g/[group-slug]/s/[slug-suffix]` (filed under business Group) or `/m/[handle]/s/[slug-suffix]` (sold as individual).

The service appears in the locality-first awareness feed for Members within scope (place-interest × interest tags). Service Items do NOT get the Locally Made step (kind='product' only per `item.md`).

## Surfaces

- **Entry point:** Group page primary CTA "Add a service" (after F036). Secondary entry: `/you` "Add a service" affordance.
- **Primary action:** "Add a service" → composer.
- **Composer / interaction:** Single-page composer. Service area as radius-from-point at b1 (polygon editor deferred to b2 per taxonomy § 2 Later).
- **Completion:** Lands on `/p/[…place]/g/[group-slug]/s/[slug-suffix]` or `/m/[handle]/s/[slug-suffix]`.
- **Discovery:** Item surfaces in the locality feed; on the Group page Items section.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Title | `items.title` | yes |
| Description | `items.description` | yes |
| Service area (center + radius) | `item_services.service_area_geography` (PostGIS circle via center point + radius) | yes |
| Pricing model | `item_services.rate_model` enum (flat / hourly / per-session / free) | yes |
| Rate | `item_services.rate_cents` (null if free) | yes if not free |
| Anchor Location (optional) | `item_locations.location_id` | optional |
| File under (Group, auto-default) | `items.group_id` | optional (null = sold as individual) |

Implicit: `items.kind='service'`, `items.member_id=<seller>`, `items.state='published'`, `items.brand_label` derived from Group's display_name if filed, `item.created` + `item.published` events with `acting_member_id`. No `made_at_place_id` step (services are excluded by kind).

## Acceptance Criteria

### "Add a service" reachable from Group page + /you

**Given** an auth'd Member with a business Group (or selling as individual)
**When** they tap "Add a service"
**Then** the composer opens; Group is pre-attached if entered from the Group page.

### Composer writes Item + child in one transaction

**Given** the Member fills title, description, service area (center + radius), pricing model, rate
**When** they tap publish
**Then** in one transaction: `items` row writes (kind='service', state='published', group_id, brand_label derived); `item_services` row writes with `service_area_geography` (PostGIS circle); optional `item_locations` row if anchor Location set; `item.created` + `item.published` events log with `acting_member_id`. Member is redirected to the kind-specific Item URL.

### Item URL follows place-scoped + random-suffix pattern

**Given** the service is filed under a business Group
**When** the URL is generated
**Then** the URL is `/p/[…place]/g/[group-slug-suffix]/s/[title-slug-suffix]` per ADR-20 + ADR-22. If sold as individual, URL is `/m/[handle]/s/[title-slug-suffix]`.

### Item page shows brand + service area + pricing

**Given** the service is published
**When** any viewer loads the Item page
**Then** the page shows title, description, pricing model + rate, service area (rendered as a circle on a map), brand resolve-up (if filed under Group), and owner Member link.

### No Locally Made step on services

**Given** the composer is open for kind='service'
**When** the composer renders
**Then** the "Where is this made?" field is not present. Only kind='product' Items get the provenance step.

### Service appears in locality feed when its area intersects the viewer's place-interest

**Given** a service is published with a service area centered at point P with radius R
**When** a Member's awareness feed query runs and the Member's `member_place_interests` resolve to a Place whose geometry intersects the service area circle
**Then** the service appears in the feed.

## Edge Cases

- **Service area extends beyond available `places` rows:** allowed; service surfaces for any Member whose place-interest intersects the circle.
- **Free service:** `rate_cents = NULL`, `rate_model = 'free'`; page renders "Free."
- **No anchor Location:** allowed — service is area-only. No "available here" surface anchor.
- **Edit service:** at b1, covers title, description, service area, pricing model, rate — not member, kind, or Group.

## Assumptions

- F036 ships before this scenario (business Group exists — optional, but the path is canonical).
- Phase 1 substrate: `items` + `item_services` (with `service_area_geography` PostGIS column), `item_locations`, action handlers `item.create`, `item.publish`.
- PostGIS service-area-circle generation from center point + radius is implemented.

## Out of Scope

- Richer service fields — appointment availability, scope of work, prerequisites — b2+ per P5 deferral.
- Service-area polygon editor (vs. radius-from-point) — b2+ per taxonomy § 2 Later.
- Appointment booking / calendar sync — b2 link-out only per taxonomy § 7 Won't (no built-in booking).
- Attestation surface for service-provider trust — b2+ per P5.
- Treatment-review surface — b2+ per `principles.md` no-ranking-of-people corollary.
- Verification badges (license, insurance) — Service Provider T2.

## Capabilities unlocked

- **2. Product & Service Listing** — Service composer — title, description, service area (radius-from-point), pricing model (flat/hourly/per-session/free).
- **2. Product & Service Listing** — Item pages at kind-specific URLs (`/s/[slug]` for services).
- **2. Product & Service Listing** — Items filed under a business Group resolve-up with the Group's brand name.
- **2. Product & Service Listing** — Items can also attach to a Member directly (sell as individual).
- **1. Presence & Findability** — Items appear in the locality-first awareness feed via place-interest × interest-tag matching.
- **7. Operations & Logistics** — Service area as radius-from-point on service Items.
