# T120: Image storage substrate and the upload primitive

**Scenario:** `planning/backlog/scenario-F055-producer-puts-a-photo-on-what-they-sell.md` — **substrate portion.** No user-visible surface ships in this ticket.
**Status:** Open — **BLOCKED, Gate B. Not buildable.**
**Bundle:** b1 (v1 workstream 10)
**Depends on:** nothing
**Blocks:** T121, T122, T124, T126

**Serves:**
- **Loop:** 7 (Buy close) — a listing that cannot carry a picture of the thing is a discovery failure before it is an aesthetic one. T118 shipped the card; this is what fills it.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Item, with an image as a column on the Item. **No new entity. No shell entity.**

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/backlog/review-F055-F058-self-serve-producer.md`. Verdict PROCEED on F055 with five binding notes; notes 1, 2 and 3 are binding on *this* ticket.
- [ ] **Gate B — ratified absolutes. ⛔ NOT CLEAR. THIS TICKET IS NOT BUILDABLE.**
  This ticket encodes **A1** in code:
  > *"An uploaded image is stripped of its embedded metadata before it is stored. The platform never stores or serves an image carrying the GPS coordinates of the person who took it."*
  `decision-photo-upload.md` § 4 carries it as `Intent (NEEDS WEIGH)`. Per rebuild rule 11 Gate B, **ticketing stops until `weigh` lands a State-tagged Intent in `product/foundation/policy.md`.** Drafted anyway, at PM request, so the full planning tier landed in one pass — **recorded as a deliberate Gate B deviation, not a waiver.** Do not start this ticket until the tag exists.
- [x] **All three `Serves` lines resolve.** Loop 7 in `member-journey.md`; P1 in `use-cases.md`; the primitive shape adds no entity.
- [x] **Cited spec last-changed dates.** `product/systems/item.md` — `Thu Sep 3 17:13:47 2026 -0700`. `product/systems/action-layer.md` — `Sun Jun 21 18:27:51 2026 -0700`. `product/foundation/policy.md` — `Tue Sep 1 08:27:03 2026 -0700` (**will change when `weigh` lands A1 — re-check before building**).
- [x] **Governing DLS recipe.** **None needed — this ticket renders nothing.** The picker's recipe is a precondition of T121, not of this ticket (review binding note 4).

## What changes

Three things, none of them visible.

1. **A storage bucket and its policies.** `supabase/config.toml` currently has `[storage] enabled = true` with the bucket block commented out, and no migration creates a bucket. Add `item-media`: public read, `file_size_limit = 5MB`, `allowed_mime_types = ['image/webp']`.
2. **RLS on `storage.objects`** for that bucket: public SELECT; INSERT/UPDATE/DELETE only where `(storage.foldername(name))[1] = auth.uid()::text`.
3. **One upload module**, `src/lib/media/upload-image.ts`, plus its tests: take a `File`, downscale via canvas to a 1600px max edge, re-encode WebP, upload to `item-media` under `{member_id}/{uuid}.webp`, return the public URL. Plus `deleteImage(url)`.

## Acceptance Criteria

- [ ] Migration `0NN_item_media_bucket.sql` creates the `item-media` bucket with `public = true`, `file_size_limit` 5 MB, `allowed_mime_types = ['image/webp']`. `supabase/config.toml` mirrors it for local dev.
- [ ] Three policies on `storage.objects` scoped to `bucket_id = 'item-media'`: SELECT to `anon` + `authenticated`; INSERT, UPDATE and DELETE to `authenticated` where the first path segment equals `auth.uid()::text`.
- [ ] `src/lib/media/upload-image.ts` exports `uploadImage(file, memberId)` → `{ url }` and `deleteImage(url)`. **One module. Every caller uses it** — review binding note 1: a second upload path is how the EXIF guarantee holds in one place and not the other.
- [ ] Resize: longest edge ≤ 1600px, aspect preserved, **no upscaling** of images already smaller.
- [ ] Encode: `canvas.toBlob(..., 'image/webp', 0.82)`. Quality is a named constant, not a literal at the call site.
- [ ] **Byte-level EXIF test (review binding note 2).** A fixture JPEG carrying a real EXIF GPS block goes through `uploadImage`; the resulting blob's bytes are inspected and contain **no EXIF GPS**. *A test asserting that the resize function was called does not satisfy this criterion and must not be written in its place.*
- [ ] **Bucket-rejection test (review binding note 3).** A direct upload of (a) a raw JPEG, (b) an SVG, (c) a 40 MB file, each with a valid member token bypassing the client module, is rejected **by the storage API**. Not by application code.
- [ ] **Cross-member write test.** Member A writing under member B's prefix is rejected by policy.
- [ ] `deleteImage` removes the object and is a no-op on a URL outside this bucket.
- [ ] Failure surface: `uploadImage` throws typed errors for too-large, wrong-type, network, and canvas-unavailable, so callers can render distinct messages.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **Gate B** — see above. **Blocks the start of this ticket.**
- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3** — does not fire. `git diff --name-only main | grep -E '^src/(app|components)/'` returns nothing: this ticket touches `src/lib/`, `supabase/migrations/` and `supabase/config.toml` only. **Stated, not waived.**
- [ ] **M4 `engineering:deploy-checklist`** — fires. New migration.
- [ ] **DEVIATIONS entry**, including the § 5.2 residual: *a deliberately crafted WebP can carry an EXIF chunk; the MIME restriction moves this from "every phone upload leaks by default" to "constructed on purpose", and the server-side re-encode that closes it is deferred.*
- [ ] **Close-out reconciliation.**

## Notes

- **Public-read is deliberate.** A feed screen renders ~24 images; re-signing URLs per render is not viable against a materialized view that stores a URL string. Public read, unguessable path, authenticated write. Do not "harden" this into signed URLs without reopening the decision.
- **`{member_id}` first in the path** is what makes the RLS policy expressible via `storage.foldername`. Do not reorder to `{item_id}/…` — the Item does not exist yet at upload time.
- **Do not add `sharp`.** Server-side re-encode is deferred (`decision-photo-upload.md` § 5.2).
- **Do not introduce `next/image`.** The card uses a plain `<img>` with an eslint-disable; switching adds Vercel image-optimization billing for a benefit the client-side downscale already delivers.
- The canvas re-encode **is** the EXIF strip. It is not a side effect to be optimized away — if someone later swaps in a library that preserves metadata, the privacy commitment silently breaks. Comment it at the call site.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
