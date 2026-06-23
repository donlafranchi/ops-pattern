---
id: how-f041-producer-generates-qr-card
purpose: Backlog scenario — a producer generates a print-quality QR card for any of their Items.
layer: how
status: draft
---

# F041: A producer generates a QR card for their item

**Bundle:** b1
**Loops:** 7 (Buy close — farmers-market wedge), adjacent to 8 (Follow what you love).
**Canonical example:** [P2 — adjacent](../../product/needs/use-cases.md#p2-a-producer-posts-bulletins-about-hours-stock-and-location) + [P3 — variable cadence (the farmers market wedge)](../../product/needs/use-cases.md#p3-a-producer-with-variable-cadence-stays-findable-to-followers).
**Primitive shape:** Person (owner) → Item (any kind) → QR card generation → PNG at print-quality DPI; resolves to Item's kind-specific canonical URL.
**Status:** backlog
**New scenario** — no existing F-number. Cross-cutting affordance for any Item kind.

## The Person

The farmers-market seller, the dip vendor, the food-truck operator, the recurring-gathering host — anyone who wants a chalk-on-a-board / tape-to-a-booth artifact that lands the visitor on the Item's page without typing a URL. The canonical use case is the farmers-market booth; the general case is anything Item-shaped.

## The Story

From the Item management page (or as a post-create affordance on any composer), the producer taps **"Get a QR card."** The `item.qr_card.request` action handler fires. A PNG generates server-side at print-quality DPI (300+), encoding the Item's kind-specific canonical URL. The PNG downloads (or is offered as a one-tap save on mobile).

The QR card can be printed at any size; the URL embedded resolves to the Item's place-scoped path: `/p/[…place]/g/[group-slug-suffix]/p/[item-slug-suffix]` for products, `/e/[slug-suffix]` for gatherings, etc.

## Surfaces

- **Entry point:** Item management page → "Get a QR card" button. Secondary entry: post-create screen on any Item composer ("Want a QR card for this? [Get one]").
- **Primary action:** "Get a QR card" → action handler.
- **Composer / interaction:** No composer; single button → server-side generation → download.
- **Completion:** PNG downloads; producer can re-request anytime.
- **Discovery:** N/A — this generates a physical artifact, not a platform surface.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| (None — single action with no user input) | — | — |

Implicit: action handler `item.qr_card.request` fires; PNG is generated (not stored persistently at b1 — re-generated on demand); optionally `items.qr_card_url` populated if we cache the last-generated PNG URL; `item.qr_card_requested` event logs with `acting_member_id=requester`.

## Acceptance Criteria

### Producer requests a QR card on their own Item

**Given** an auth'd Member who owns the Item is on the Item management page
**When** they tap "Get a QR card"
**Then** the `item.qr_card.request` action handler fires; a PNG generates at print-quality DPI (≥300 DPI at 4" × 4" minimum); the PNG downloads (or is offered as save-to-photos on mobile); `item.qr_card_requested` event logs.

### QR resolves to Item's canonical URL

**Given** a generated QR card
**When** scanned by any QR reader
**Then** the embedded URL is the Item's place-scoped canonical URL (e.g., `/p/sacramento/oak-park/g/oak-park-sourdough-7gx9/p/country-sourdough-loaf-4mzx`). Scanner opens the platform in the browser to that page.

### Works across all Item kinds

**Given** the producer owns an Item of any kind (product, service, gathering, wonder, offer, ask, initiative — though only product/service/gathering surface at b1)
**When** they request a QR card
**Then** the PNG generates with the kind-specific URL slot per `item.md` naming table (`/p/[slug]` for product, `/s/[slug]` for service, `/e/[slug]` for gathering, etc.).

### Non-owner cannot request

**Given** an auth'd Member who does NOT own the Item is on the Item page
**When** they look for a "Get a QR card" affordance
**Then** the affordance is not visible. Only the Item's owner can request a QR card at b1.

### Post-create composer affordance

**Given** the producer just published an Item via any composer (F034, F038, F040)
**When** the post-create screen renders
**Then** a "Get a QR card for this" affordance is visible; tapping it fires the same `item.qr_card.request` handler.

## Edge Cases

- **Item is unpublished (`state='draft'`):** affordance hidden — QR cards are for findable Items only.
- **Item is soft-deleted:** affordance hidden; existing printed cards land on a 404.
- **Item slug changes (rare with random suffix):** existing QR cards land on the new URL via redirect if `slug_history` exists for Items (b2 surface; at b1, slug is set on create and immutable).
- **PNG generation fails server-side:** error toast + retry button.
- **Repeated requests:** allowed; each generates a fresh PNG (no rate-limit at b1 unless abuse pattern emerges).

## Assumptions

- Phase 1 substrate: `items` (any kind), action handler `item.qr_card.request` ships with the Phase 2 surface batch.
- PNG generation library available server-side (e.g., `qrcode` npm package or equivalent).
- Random-suffix slugs are stable post-create (no slug regeneration on edit).
- `items.qr_card_url` column may or may not be populated; cached-vs-on-demand is an implementation detail for the build agent.

## Out of Scope

- QR cards for entities other than Items (Member pages, Group pages, venue pages) — schema/affordance not added at b1.
- Custom QR card styling (logo overlay, color theming) — b2 if requested.
- Bulk QR card generation across multiple Items at once — b2.
- Printable letter/A4 PDF with multiple QR codes per page — b2.
- Analytics on QR scans (how many people scanned this card) — b2 (taxonomy § 6 Later — falls under growth dashboard).

## Capabilities unlocked

- **1. Presence & Findability** — QR card generation for any Item — print-quality PNG, resolves to canonical URL.
