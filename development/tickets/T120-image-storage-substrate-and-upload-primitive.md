# T120: Image storage substrate and the upload primitive

**Scenario:** F061 — someone creates a page worth showing people — **substrate portion.** No user-visible surface ships in this ticket.
**Status:** Open — **UNBLOCKED 2026-09-07. Buildable.**

> **Re-bound 2026-09-07.** This ticket was written under the Item-photo scenario, which is now deferred — **Pages get photos first**, so the substrate lands with them. Gate B has since cleared: both upload absolutes carry State-tagged Intent in `policy.md` § Uploaded images. Gate C is satisfied by review F061 (PROCEED).
>
> **Two changes to the scope below, both from F061 review binding note 1:**
> 1. **The bucket is `media`, not `item-media`.** It now serves Pages first and Items later; a name that says "item" would mislead every future reader. The bucket does not exist yet, so this is free now and expensive later.
> 2. **The path prefix and every policy stay exactly as written** — member id first, which is what makes the write policy expressible.
>
> Everything else below stands unchanged, including the byte-level metadata test and the storage-API rejection test.
**Bundle:** b1 (v1 workstream 10)
**Depends on:** nothing
**Blocks:** T145 (Page photo step + takedown), and later T126 (F056's shop-image editor) when it builds.

**Serves:**
- **Loop:** 9 (Make a living locally), 7 (Buy close) — a Page with no face is a discovery failure before it is an aesthetic one. Pages are now the first consumer of this substrate; Items (T118's card) are the second, deferred.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Page, with an image as a column on the Page. **No new entity. No shell entity.**

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** review F061. Verdict PROCEED, six binding notes; notes 1 (bucket naming), 2 (byte-level EXIF test) and 3 (bucket-rejection test) are binding on *this* ticket.
- [x] **Gate B — clear.** `policy.md:143` (metadata stripped, Ratified 2026-09-07), `policy.md:151` (takedown before first upload, Ratified 2026-09-07). Both landed the same session this ticket was unblocked.
- [x] **All three `Serves` lines resolve.** Loop 9 in `member-journey.md`; P1 in `use-cases.md`; the primitive shape adds no entity.
- [x] **Cited spec last-changed dates.** `product/systems/groups.md` — updated 2026-09-07 (§ *A photo, or art that admits it isn't one*). `product/foundation/policy.md` — updated 2026-09-07 (§ Uploaded images, both absolutes ratified).
- [x] **Governing DLS recipe.** **None needed — this ticket renders nothing.** The picker's recipe (`design-language.md` § Image picker) is a precondition of T145, not of this ticket.

## What changes

Three things, none of them visible.

1. **A storage bucket and its policies.** `supabase/config.toml` currently has `[storage] enabled = true` with the bucket block commented out, and no migration creates a bucket. Add `media`: public read, `file_size_limit = 5MB`, `allowed_mime_types = ['image/webp']`.
   _Why `media`, not `item-media`: F061 review binding note 1 — Pages are the first consumer now, Items the deferred second; a name that says "item" misleads every future reader, and the bucket doesn't exist yet so renaming is free._
2. **RLS on `storage.objects`** for that bucket: public SELECT; INSERT/UPDATE/DELETE only where `(storage.foldername(name))[1] = auth.uid()::text`.
3. **One upload module**, `src/lib/media/upload-image.ts`, plus its tests: take a `File`, downscale via canvas to a 1600px max edge, re-encode WebP, upload to `media` under `{member_id}/{uuid}.webp`, return the public URL. Plus `deleteImage(url)`.

## Acceptance Criteria

- [ ] Migration `0NN_media_bucket.sql` creates the `media` bucket with `public = true`, `file_size_limit` 5 MB, `allowed_mime_types = ['image/webp']`. `supabase/config.toml` mirrors it for local dev.
- [ ] Three policies on `storage.objects` scoped to `bucket_id = 'media'`: SELECT to `anon` + `authenticated`; INSERT, UPDATE and DELETE to `authenticated` where the first path segment equals `auth.uid()::text`.
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

- [x] **Gate B** — clear (see above). No longer blocks.
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
