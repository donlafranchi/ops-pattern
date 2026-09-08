---
purpose: Scenario — a producer attaches one photo while listing a product, service, or gathering; it is downscaled and EXIF-stripped in the browser, stored in Supabase Storage, and renders on the feed card and the public page.
layer: how
status: next
---

# F055: A producer puts a photo on the thing they're selling

**Bundle:** b1 (SocialUs v1)
**Sub-bundle:** v1 workstream 10 — photo upload (added 2026-09-04)
**Work-map item:** [`bundle-1.md`](../now/bundle-1.md) § What ships in v1 — workstream 10. Also completes workstream 3 (card fix and populated content): T118 shipped a card whose media block has never once rendered a photo, because no photo can exist.
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
**Primitive shape:** Person → Group(kind='business') → Item(kind='product' | 'service' | 'gathering') with one attached image. **No new entity. No shell entity.** The image is a column on the Item, not a thing of its own.
**Spec contract:** [`decision-photo-upload.md`](decision-photo-upload.md) §§ 4, 5, 6 · [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 2.2 (the OG-image carry) · [`design-language.md`](../../product/ui/design-language.md) § Card media block · [`item.md`](../../product/systems/item.md) § Per-kind typed columns ("Embedded media") · [`action-layer.md`](../../product/systems/action-layer.md) § Same-transaction row+event invariant
**Status:** next — **approved 2026-09-07.** Gate B cleared: both upload absolutes ratified in `policy.md` § Uploaded images; the values-sourcing absolute dropped as moot with the feature.

## The Person

Maya bakes sourdough in a home kitchen and sells it at the Sunday market. She has already opened a shop on the platform — five steps, brand name, anchor Location — and listed one product: *Country loaf, $9.* On her phone, her own listing looks like every other listing: a grey field with a small box icon where a picture of the bread should be. She has forty photos of that bread on this phone. She has no way to put one of them on the page.

**This is the specific complaint the scope change answers.** It is not that the card design is wrong — T118 shipped the right card. It is that the product has never been able to fill it.

## The Story

Maya taps **Add a product** on her shop. The composer opens as it does today — title, price, unit. There is now a photo field at the top of that first step: a wide, tappable area reading **Add a photo**, with a small line under it saying *"Optional. One photo."*

She taps it. Her phone's own photo picker opens. She chooses the loaf.

For a second she sees the picture appear in the field, slightly dimmed, with a progress indicator over it. Then it settles, sharp and cropped to the same 4:3 shape it will have on the card, with a small **Replace** control in the corner. She never sees a file name, a size, a format, or a percentage. She continues to price, pickup point, review — the rest of the composer is unchanged — and taps **List it.**

Her product page opens with the photo at the top. She taps Home. Her loaf is in the feed, in a grid of grey glyph cards, and it is the only one with a picture on it.

**What she never saw, and never should:** the browser resized her 4.2 MB, 4032×3024 JPEG down to a 1600px-wide WebP of about 190 KB, and in re-encoding it through a canvas it discarded the EXIF block — including the GPS coordinates of her kitchen, which is her home.

## Surfaces

- **Entry point:** the first step of the product, service, and gathering composers (`ProductComposer`, `ServiceComposer`, `GatheringComposer`), reached from `/you/sell`.
- **Primary action:** tap the photo field → the OS picker → the image appears in place.
- **Interaction:** one photo. Tapping a filled field offers **Replace** and **Remove**. There is no gallery, no ordering, no carousel.
- **Completion:** the photo is stored and the Item is published in the same composer submit that exists today. The photo is part of create.
- **Discovery:** the photo renders in three places already built — `ItemFeedCard` on Home and Explore, the item detail page, and the shop page's item list. **No new render surface.**

## Data Captured

| Field | Where | Notes |
|---|---|---|
| Image object | Supabase Storage, bucket `item-media`, path `{member_id}/{uuid}.webp` | Public-read bucket. The member-id-first prefix is what makes the write policy expressible. |
| Public URL | `items.photo_url` (exists, migration `036`, nullable, any kind) | **Not** `item_products.photo_urls` — that column is product-only and stays reserved as the future gallery. `discoverable_items` already coalesces `photo_url` first. |

**No new table. No new column. No new event type.** `item.created` already carries the Item's shape; a photo is a property of the row, not a declaration of its own.

## Acceptance Criteria

### One photo, optional, on all three shipped composers

**Given** a producer with an active `kind='business'` Group opens the product, service, or gathering composer
**When** the first step renders
**Then** a photo field is present, labelled **Add a photo**, marked optional, and the composer can be completed without touching it. _Why: v1's stated goal is that people are not got in the way of. A producer with no photo to hand must still be able to list. The card already degrades correctly to a kind glyph (T118), so the empty case is designed, not broken._

### The image is downscaled and re-encoded in the browser before it leaves the device

**Given** the producer picks an image of any size or format their phone offers
**When** the file is selected
**Then** it is drawn to a canvas, scaled so its longest edge is at most 1600px, and re-encoded as WebP before any network request is made. _Why: this single step buys three things at once — egress stays cheap, the upload is fast on a market's mobile signal, and the canvas re-encode discards the EXIF block. See the next criterion; the privacy property is a consequence of this one._

### No stored image carries GPS coordinates

**Given** a producer uploads a photo taken on a phone with location services enabled — the default
**When** the object is fetched back from storage and its bytes inspected
**Then** it contains no EXIF GPS data. _Why: **A1**, [`decision-photo-upload.md`](decision-photo-upload.md) § 4. Producers on this platform may be operating from home, and every Item carries a location the platform already publishes. A photo that also carries the exact coordinates of the kitchen turns a listing into an address. This criterion is tested against real bytes, not against the intent of the code._

### The bucket refuses anything that is not a WebP under 5 MB

**Given** a request that bypasses the client entirely and POSTs a raw JPEG, a PNG, an SVG, or a 40 MB file directly to the storage endpoint with a valid member token
**When** the storage API processes it
**Then** it is rejected by the bucket's own `allowed_mime_types` and `file_size_limit`, not by application code. _Why: client-side validation is advisory — a member's own token can address the storage endpoint directly. Restricting the bucket to `image/webp` means the only path in is the canvas path, which has already stripped EXIF; it also closes the SVG-with-embedded-script vector, which matters because this bucket is public. Recorded residual: WebP can technically carry an EXIF chunk, so a deliberately crafted file could smuggle one. That moves the risk from "every phone upload leaks by default" to "you would have to do it on purpose," and the full fix (server-side re-encode) is deferred with the reason recorded._

### A member can only write into their own folder

**Given** member A is signed in
**When** A attempts to write an object under member B's path prefix
**Then** the storage RLS policy rejects it. Read is public for everyone. _Why: the bucket is public-read because feed cards render 24 images per screen and re-signing URLs per render is not viable against a materialized view that stores a URL string. Public read is the right trade; unrestricted write is not._

### The photo reaches the feed card without a second refresh

**Given** a producer completes a composer with a photo attached
**When** they navigate to Home
**Then** their Item's card renders the photo. _Why: `discoverable_items` refreshes on the `item.published` event. Because the photo is written on the same `item.create` call that publishes, the MV is correct on its first refresh. **This is why the photo is part of create rather than a later edit** — a photo attached after publish would not appear until something else triggered a refresh. Any future edit path must refresh the MV itself._

### A shared link renders the photo

**Given** an Item with a photo
**When** its URL is pasted into iMessage, WhatsApp, Signal, or Slack
**Then** the preview shows the photo, the title, and a one-line description. _Why: **this is the highest-leverage consumer of an uploaded photo and the one nobody has noticed is missing.** `openGraph` appears in exactly two files in the whole application — `/vendors/[slug]` and `/business/[slug]` — and both are in the delete list. Every page the new model ships has a title and a description and **no OpenGraph block and no image at all**, so every shared link currently renders as a bare grey text row. The platform's own stated sharing model is *phone to phone: a link, copied or sent*. The old vendor page did this correctly and the pattern is on disk ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 2.2). Cost: a `generateMetadata` addition on three route files reading a column this scenario populates._

### Replacing a photo deletes the one it replaced

**Given** a producer replaces a photo during a composer session
**When** the new object is stored
**Then** the previous object is deleted from the bucket. _Why: without this, every abandoned attempt accumulates permanently in a bucket nothing ever reconciles. One line, and it prevents the only unbounded growth this feature has._

### The image has an accessible name

**Given** a card or item page rendering a producer-supplied photo
**When** a screen reader reaches it
**Then** the image's `alt` is the Item's title, not empty. _Why: `ItemFeedCard` renders `alt=""` today, which is correct for a decorative glyph field and wrong for producer-supplied content. M3 fails it otherwise. Deriving alt from the title costs no new field and no question in the composer, and is accurate — the photo is of the thing the title names._

### Upload failure leaves the composer usable

**Given** the upload fails — offline, timeout, rejected by the bucket
**When** the producer is on the photo step
**Then** an error is shown in the field, the composer does not advance, and the producer can retry or continue without a photo. _Why: this composer is used at a farmers market on mobile data. A failed upload must not strand a half-created listing or silently publish one the producer thinks has a picture._

## Edge Cases

- **Producer picks a non-image file** (some pickers allow it) — rejected client-side with a plain message before any resize is attempted.
- **Very large image** (48 MP phone camera) — the canvas resize handles it; the pre-resize file never leaves the device, so the 5 MB bucket cap applies to the *output*, not the input.
- **Very small image** (a 200px thumbnail) — upscaling is not attempted. Stored as-is if it is already under the max edge.
- **Animated GIF** — rejected by MIME restriction. Not a v1 case.
- **Producer removes the photo before submitting** — no object is left behind; if one was already uploaded it is deleted.
- **Slow connection** — the progress indicator is the only feedback; there is no cancel in v1. Navigating away abandons the upload and leaves an orphan (see § Out of Scope).
- **Desktop** — the same field, the same OS picker, drag-and-drop **not** in scope.
- **Accessibility** — the field is a `<button>` wrapping a visually-hidden `<input type="file">`, with a live region announcing "uploading" and "photo added."

## Assumptions

- Supabase Storage is enabled (`config.toml` § `[storage]` is `enabled = true`) but **no bucket exists** — the bucket and its policies ship in this scenario.
- `items.photo_url` exists and is already coalesced into `discoverable_items` (migration `036`). **Verified, not assumed.**
- The card renders a photo when one is present (T118, shipped). **Verified.**
- The composers are `MultiStepComposer`-based with an async `onAdvance` per step, so an upload can be awaited inside an existing step without new composer machinery. **Verified.**
- `next/image` is **not** used and will not be introduced (see [`decision-photo-upload.md`](decision-photo-upload.md) § 5.6).

## Out of Scope

- **More than one image per Item.** Cost is not the reason — storage for five images per item is negligible. The reason is composer surface: ordering, delete-one-of-many, and a detail-page carousel are a gallery product, not a photo field. `item_products.photo_urls` stays reserved.
- **Producer profile and shop images.** Same upload primitive, different consumer, and it needs action handlers that do not exist. **F056.**
- **Cropping.** `object-cover` centre-crop to 4:3. A crop UI is a week.
- **Server-side re-encode** (`sharp`). Deferred with the residual recorded in the bucket-restriction criterion.
- **Editing a photo on an already-published Item.** Requires an `item.update` handler and an MV refresh. **F058 ships the operator's removal path; producer-side editing is not v1.**
- **Deleting the storage object when an Item is soft-deleted.** Items soft-delete; the row and the URL survive; the file stays publicly fetchable. **This is the v1 position and it must be said in copy, not implied.** A `deleted_at`-keyed cleanup sweep is deferred.
- **Upload rate limiting.** Auth-required insert plus the size cap covers the ordinary case.
- **Moderation.** **F058**, and it is a dependency of this scenario, not a follow-on.

## Capabilities unlocked

- **Presence & Findability** — a listing that looks like the thing it is. The first version of the feed that does not read as an empty platform.
- **Producer self-service** — step 4 of the ratified journey; the only step with no existing substrate at all.
