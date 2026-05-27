---
purpose: Member-requestable printable QR card for any Item.
layer: what
status: active
---

# QR Card (Item-on-demand affordance)

**Tier:** T1
**Bundle:** b1
**Primitive:** Item
**Loops served:** 7 (Make and be found), 8 (Follow what you love), and any loop where being-findable-in-the-physical-world matters.

**Scope note (revised 2026-05-10):** QR cards are an **Item-level Member-requestable affordance** — any Member can request a QR card for any Item they own so people in the physical world can find that Item. The card resolves to the Item's page. There is no Location-level QR card, no participating-market gating, no kind-restricted issuance. The original "vendor-booth-only" framing is retired; the use case (a Maker at a farmers market booth) is the canonical first instance, not the only one.

## What a Member can do

A Member with an Item can request a QR card. The card encodes a URL that resolves to the Item's kind-specific page (`/e/`, `/p/`, `/s/`, `/i/`, `/o/`, `/a/`, `/initiative/[slug]` per [`../systems/item.md`](../systems/item.md) naming table). The Member prints it, sticks it on their booth, their porch sign, their truck window, the back of a flyer, the side of a tip jar — wherever physical findability matters for that Item.

The product Maker at the farmers market gets a QR card and tapes it to her booth — scan resolves to her sourdough Item page where new visitors can follow her, see her schedule, and find her next time.

The food truck operator generates QR cards for each of his menu Items and sticks them on the side of the truck — scan resolves to the dish, where regulars can save it and follow the truck's schedule.

The Run Club host generates a QR card for the Thursday Run Club gathering Item and chalks the URL plus QR on a board outside Drake's — passers-by scan, see the schedule, and decide whether they'll show up.

The plumber leaves a QR card on a fridge after a service call — scan resolves to her service Item page where the homeowner can save the contact and follow.

## T1 scope (ships at b1)

- A Member can request a QR card for any Item they own from the Item's edit page or the composer's post-create screen.
- The QR encodes the Item's canonical kind-specific URL (per [`../systems/item.md`](../systems/item.md) naming table).
- The card image is generated server-side and stored as `items.qr_card_url` (text, nullable on `items` per `item.md`).
- The Member can re-generate (replaces the URL? no — Item slugs are stable, so re-generation is a re-render of the same QR; useful only for design refresh).
- Card-image format: PNG at print-quality DPI; downloadable from the Item edit screen. The Member prints; the platform doesn't fulfill physical cards.
- Scan flow: scanner lands on the Item's kind-specific page like any other URL visitor. Anonymous browse is allowed (Loop 3 / `b1-primitives-plan.md`); the visitor sees the Item, can respond (RSVP / follow / save / "I'd be in") with auth-gate prompt at response time.
- The 90-second target — for the canonical farmers-market case where the Maker is creating their first Item *and* requesting the QR card in one flow — composer to printable QR in 90 seconds. Achieved by the QR generation being a single button on the post-create confirmation screen, not a separate tool.

## Deferred

- NFC alternative (b2).
- Dynamic QR codes that track scan counts and convert them into the Item's response surface (b2; reads from `item_events`).
- Printed card design / fulfillment tooling (operations concern, not platform code).
- Bulk QR generation across a Member's whole catalog (b2 — useful for the food-truck multi-Item case).
- QR cards for Member profiles (deferred — Members share their handle URL via standard share affordances; QR for profiles isn't load-bearing yet).
- QR cards for Groups (deferred for the same reason; Groups are URL-shareable).

## Explicitly NOT in scope

- **No Location-level QR cards.** Locations are physical places; QR cards are a way to find an Item declared by a Member. A Location may host many Members' Items; printing one Location-level QR makes no sense (which Item does it resolve to?). The Maker prints their own QR; the Location does not print QRs on the Maker's behalf.
- **No participating-market gating.** Any Member can request a QR for any Item. The platform does not maintain a partnership list with markets, does not generate QR cards on a market's behalf, and does not require any Location to "opt in" before its Items can carry QR cards.
- **No location_recurring_temporary.qr_card_url column.** Per the location.md revision, Locations carry no QR-card columns. The column lives on `items` only.

## Acceptance signal

A Member at the Folsom Farmers Market creates a product Item, taps "Get a QR card for this," downloads the PNG, prints it on a sheet of paper, and tapes it to her booth. A passer-by scans, lands on her Item page, follows her, and finds her again the following Saturday.
