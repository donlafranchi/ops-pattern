# F019: Aaron posts a Ferrari Fisheries fish drop

**Bundle:** b1
**Loops:** 7 (Make and be found), 8 (Follow what you love)
**Canonical example:** [Ferrari Fisheries](../../product/foundation/canonical-examples.md#2-ferrari-fisheries)
**Primitive shape:** Person → Item(kind=product, irregular) → Location(boat dock or pickup point, recurring-temporary)

**Status:** backlog

## The Person

Aaron runs Ferrari Fisheries. He fishes wild off the California coast and sells direct to neighbors. Supply is irregular — depends on the catch. Today he came back with salmon. He needs to alert his customers in the next 30 minutes that there's salmon available, where he'll be, and until when. Today he sends a mass text. The list is in his phone. New customers can only join the list if they already know his number.

## The Story

Aaron opens the platform on his phone. He lands on his Maker page (`/m/ferrari-fisheries` or `/you` if it's his own). The most prominent action on his Maker page is **"Drop something now"** — a one-tap path to declare he has product available right now.

He taps it. The composer is product-shaped from the start. It pre-fills his name (Ferrari Fisheries) and asks: **what's available, where, until when, and how much.**

He enters: **Wild king salmon**, **today only**, pickup at **Sutter Health Park parking lot, 4–6 PM**, **$28/lb**. He optionally adds a photo of the catch. He hits publish.

The platform does three things at once: posts the drop to his Maker page (visible to anyone), sends a push/email to his **47 followers** ("Aaron has wild king salmon today, until 6 PM"), and surfaces the drop on the locality-first index for anyone in Sacramento browsing today.

A neighbor, Maya, sees the notification, taps through, and follows him for the future. She gets the next drop too.

## Surfaces

- **Entry point:** Aaron's Maker page (`/m/[slug]` or his `/you` page) — primary CTA: **"Drop something now."** Also: secondary entry from a global "What do you want to share?" on `/you`, but the canonical case is the Maker-page CTA.
- **Primary action button:** "Drop something now" (urgent, time-bound, product-shaped — never "Create Item.")
- **Composer:** product-shaped from the moment it opens. Asks: what is it, where, when (until), price. Photo upload optional. No four-kind picker — the surface picks the kind.
- **Completion:** Aaron lands on `/i/[slug]` — the public drop page with a countdown to expiry.
- **Discovery:**
  - Pushed to all 47 followers (push if app installed, email otherwise) within 60 seconds of publish.
  - Aaron's Maker page lists it under "Available now" until expiry.
  - Locality index includes it for users browsing today, with proximity ranking.
  - Sutter Health Park as a Location lists "Today: Aaron's wild salmon, 4–6 PM."

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| What's available | `items.title` | yes |
| Description | `items.description` | optional |
| Pickup location | `item_locations` → existing or new Location (recurring-temporary kind) | yes |
| Available until | `item_products.available_until` | yes |
| Price | `item_products.price_cents` + `price_unit` (e.g., per lb) | yes |
| Quantity hint | `items.description` (free text — "about 30 lbs total") | optional |
| Photo | `item_products.photo_urls` | optional |
| Hashtags | `item_hashtags` | optional |

Implicit: `items.kind = 'product'`, `items.member_id = Aaron`, `items.brand_label = 'Ferrari Fisheries'`, `items.state = 'published'`, `item.created` event logged.

## Acceptance Criteria

### Aaron sees the urgent-drop CTA on his own Maker page

**Given** Aaron is authenticated and on his own Maker page
**When** the page loads
**Then** a primary CTA labeled "Drop something now" is visible above the fold

### Composer opens product-shaped, brand-attached

**Given** Aaron taps "Drop something now"
**When** the composer loads
**Then** the kind is `product` (no kind picker), `brand_label` is pre-filled with "Ferrari Fisheries," and required fields are: title, location, available-until time, price + unit

### Publish writes the spine + product child + event

**Given** Aaron has filled the required fields and submits
**When** the form is submitted
**Then** an `items` row (kind=product), an `item_products` row, and an `item.created` event are written in one transaction; Aaron is redirected to `/i/[slug]`

### Followers receive notification within 60 seconds

**Given** the Item is published and Aaron has 47 followers
**When** publish completes
**Then** within 60 seconds, each follower receives a push (if app installed) or email (otherwise) with the title, location, and expiry time, and a link to the Item page

### The drop appears on Maker page and locality index

**Given** the Item is published with `available_until` in the future
**When** anyone visits Aaron's Maker page
**Then** the Item appears under "Available now"

**And When** a user within ~30mi browses the locality index filtered to "today"
**Then** the Item appears in the list with proximity ranking

### The drop expires automatically

**Given** the Item's `available_until` has passed
**When** any surface that filters on availability is rendered
**Then** the Item no longer appears as "available now" — it remains on Aaron's Maker page under "Past drops" for 30 days

## Edge Cases

- **Aaron has zero followers:** publish still succeeds; no notifications dispatched.
- **Pickup location is new:** composer offers an inline "add a pickup location" path that creates a Location of kind=recurring-temporary; this is its own ticket but blocks the canonical case if missing.
- **Aaron edits the drop after publishing** (lower price, extend time, sold out): edits write an `item.updated` event; followers get a follow-up notification only if `available_until` is *extended* or it's marked "sold out."
- **Aaron marks "sold out" before expiry:** Item state moves to `sold_out`; locality index hides it; Maker page shows "Sold out at [time]."
- **Notification dedupe:** a follower must not receive multiple notifications for the same Item. Tracked in a `notifications_sent` table.
- **Expiry time in the past at submit:** validation error — `available_until` must be at least 30 minutes in the future.

## Assumptions

- Aaron is a Member with an established Maker page and `brand_label = 'Ferrari Fisheries'`.
- The follow primitive exists (covered by F012 / shipped under `follows` table; will migrate to `item_responses` per migration plan).
- Push notifications: at b1, email-only (push deferred to b2). The acceptance criteria above are framed for the b2 case; at b1, replace "push or email" with "email only."
- Locality index (`discoverable_items` materialized view) refreshes on item publish.
- Sutter Health Park exists in `locations` or is creatable inline.

## Out of Scope

- In-app payment / checkout (b3 — `item_products.price_cents` is informational at b1).
- Inventory tracking ("3 lbs left, then 0 lbs").
- Customer-side reservation / hold ("save me a fillet").
- Aaron's recurring-schedule drops (separate scenario — irregular drops are the wedge for b1).
