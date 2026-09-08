# T121: The product composer gets a photo field, end to end to the card

**Scenario:** F055 — producer puts a photo on what they sell — **DEFERRED with its scenario.**
**Status:** **DEFERRED 2026-09-07.** Not open, not blocked — held by PM ruling.

> **Deferred with its scenario.** Pages get photos now, Items get photos later. The scenario returned to `planning/backlog/`, so this ticket points outside the approved lanes **by design** — the gate check reports it as a deferred pair, not as a firewall breach. **Do not start.**
>
> **The substrate this depended on is no longer blocked** — T120 re-bound to F061 and is buildable. When this resumes, the bucket (renamed `media`), the upload module, the metadata strip and the picker recipe all already exist, and what remains is a composer field.
**Bundle:** b1 (v1 workstream 10)
**Depends on:** T120 (upload primitive), and the image-picker DLS recipe (review binding note 4)
**Prior art:** [`planning/backlog/audit-vendor-prior-art.md`](../../planning/backlog/audit-vendor-prior-art.md) § 2.2 — the OG block. Read `src/app/vendors/[slug]/page.tsx` before writing it.
**Blocks:** T124, T126
**Release gate:** **must not deploy to production without T122.** See § Release gate.

**Serves:**
- **Loop:** 7 (Buy close) — the first time in this product's life that a listing can show the thing it is selling.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Group(kind='business') → Item(kind='product') with one image on `items.photo_url`.

> **This is the demonstrable moment.** When this merges, a real photograph appears on a real card in the live feed. Everything before it is plumbing; everything after it is breadth.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F055-F058-self-serve-producer.md`. PROCEED on F055; binding notes 1, 2, 4 apply here.
- [ ] **Gate B — ⛔ NOT CLEAR** via T120's A1. Same deviation record. Do not start until the State tag lands in `policy.md`.
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec last-changed dates.** `product/ui/design-language.md` — `Fri Sep 4 02:16:26 2026 -0700` (**will change when the picker recipe lands — re-check**). `product/systems/item.md` — `Thu Sep 3 17:13:47 2026 -0700`.
- [ ] **Governing DLS recipe named.** ⛔ **`design-language.md` has no image-picker recipe.** Review binding note 4 routes this to `explore` as a gap rather than letting build invent one. **This item is unticked on purpose and blocks the start of the ticket** — it is the T088 failure (a component specified as a list of fields with no recipe, now shared by three surfaces) and this picker also lands on three surfaces.

## What changes

One field, inside the composer's **existing first step**. **No new step.**

`ProductComposer`'s `details` step gains a photo field above the title input. `createProductAction` passes the resulting URL into `item.create`, which writes `items.photo_url`.

## Acceptance Criteria

- [ ] `ImagePickerField` in `src/components/media/`, built to the DLS recipe: empty, uploading, filled, and error states; **Replace** and **Remove** on the filled state; 4:3 preview matching the card's crop.
- [ ] It is a `<button>` wrapping a visually-hidden `<input type="file" accept="image/*">`. The **button** carries the accessible name *"Add a photo"*.
- [ ] Upload state is announced in a polite live region (*"Uploading photo"* → *"Photo added"*). A spinner with no live region leaves a screen-reader user with an apparently frozen form.
- [ ] The field is in the **existing `details` step**. `ProductComposer`'s step list stays four steps. *A photo step would make the shortest path from "I make hot sauce" to "it is listed" nine screens across walkthrough + composer.*
- [ ] The composer completes with no photo. The card falls back to the T118 kind glyph. **Unchanged behaviour, explicitly re-tested.**
- [ ] `item.create` receives the URL. **Write `items.photo_url`, not `item_products.photo_urls`** — `photo_url` is the general any-kind column the MV coalesces first; `photo_urls` stays reserved as the future gallery. `itemCreateInput` gains `photoUrl: z.string().url().optional()`.
- [ ] **Replace deletes the object it replaced**, via `deleteImage`. **Remove** deletes it and clears state.
- [ ] Abandoning the composer after an upload leaves an orphan. **Known and accepted** — record it in DEVIATIONS; do not build a cleanup job in this ticket.
- [ ] Upload failure: error rendered in the field, composer does not advance, retry works, continuing without a photo works.
- [ ] `ItemFeedCard`'s `alt` becomes the Item title instead of `""`. **M3 requires it** — empty alt is correct for a decorative glyph and wrong for producer-supplied content. `ProductPublicPage`'s hero image likewise.
- [ ] **OpenGraph image on the Item page** — `generateMetadata` gains an `openGraph` block with `title`, `description`, `url`, and `images: [photo_url]`, plus a sane fallback when there is no photo. Verify with a real paste into a messaging app, not only by reading the HTML. *(`openGraph` currently appears in **two files in the entire application**, both vendor-era and both in the delete list. Every page the new model ships renders as a bare text row when shared — and "phone to phone: a link, copied or sent" is the platform's stated distribution channel. See `planning/backlog/audit-vendor-prior-art.md` § 2.2; the old implementation is on disk at `src/app/vendors/[slug]/page.tsx`.)*
- [ ] **End-to-end proof:** create a product with a photo in the composer → the item page shows it → **Home's feed card shows it**, in one pass, without a manual MV refresh. *(The photo is written on the same `item.create` that publishes, so `discoverable_items` is correct on its first refresh. This criterion is what proves the six-layer pipe joins up.)*
- [ ] Unit tests on the picker's four states; a `ProductComposer` test asserting the field is present and optional.
- [ ] Screenshot at 375×812 attached to Completion.
- [ ] `BUILD-LOG.md` updated.

## Release gate

**T121 must not reach production without T122.** The moment a photo field is live on a public deployment, the platform is accepting user-supplied images — and A2 says the platform never serves an image it cannot take down. Today the operator's only removal path is hand-editing Postgres and the storage API. **Merge T121 and T122 together, or merge T122 first.** This is not a preference; it is A2's operational content.

## Workflow gates

- [ ] **Gate B** — blocks the start.
- [ ] **DLS picker recipe** — blocks the start.
- [ ] **Checklist 4 — changing a surface.** Fires: `git diff --name-only main | grep -E '^src/(app|components)/'` returns `src/components/sell/ProductComposer.tsx`, `src/components/media/ImagePickerField.tsx`, `src/components/feed/ItemFeedCard.tsx`. All five items, no bare N/A.
- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3 `design:accessibility-review`** — fires. New interactive element on an existing surface. **"It's inside an existing step" is not a valid N/A** — that is the T117 failure this rule exists to close.
- [ ] **M4 `engineering:deploy-checklist`** — fires with T120's migration.
- [ ] **DEVIATIONS entry**, including the abandoned-upload orphan and one line on appearance.
- [ ] **Close-out reconciliation.** T118's DEVIATIONS entry states the media block has never rendered a photo. **That sentence becomes false with this ticket — correct it.**

## Notes

- `MultiStepComposer`'s `onAdvance` is already `async` per step, so the upload can be awaited inside the existing step with no composer changes. Verified — do not modify `MultiStepComposer`.
- Everything goes through `uploadImage` / `deleteImage` from T120. **No second upload path** (review binding note 1).
- Do not add a caption field. Alt derives from the title; a caption is a second question in a flow whose goal is fewer questions.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
