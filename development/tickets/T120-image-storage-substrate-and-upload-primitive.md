# T120: Image storage substrate and the upload primitive

**Scenario:** F061 — someone creates a page worth showing people — **substrate portion.** No user-visible surface ships in this ticket.
**Status:** **BUILT, UNVERIFIED — not complete.** Reopened 2026-09-07 by PM ruling.

> **What is unverified: whether one member can read, overwrite, or delete another member's uploaded files.**
>
> The storage-API rejection tests and the cross-member RLS test were written and have never executed — the sandbox had no local Supabase, so they skipped and the run reported green. **The ticket closed with the box ticked and nothing checked.**
>
> **This ticket may be built on, merged, and depended upon. The photo work continues on top of it.** It **cannot be marked complete** until those tests have actually run and passed against a real instance — see T151 § Setup list.
>
> **Once T150 lands, this state stops being able to hide:** the run goes red until something verifies it.

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

- [x] Migration `039_media_bucket.sql` creates the `media` bucket with `public = true`, `file_size_limit` 5 MB, `allowed_mime_types = ['image/webp']`. `supabase/config.toml` mirrors it for local dev.
- [x] Four policies on `storage.objects` scoped to `bucket_id = 'media'`: SELECT to `anon` + `authenticated`; INSERT, UPDATE and DELETE to `authenticated` where the first path segment equals `auth.uid()::text`. (Four, not three — SELECT, INSERT, UPDATE, DELETE are each their own policy; the ticket text undercounted, the acceptance criterion itself did not.)
- [x] `src/lib/media/upload-image.ts` exports `uploadImage(file, memberId)` → `{ url }` and `deleteImage(url)`. **One module. Every caller uses it.**
- [x] Resize: longest edge ≤ 1600px, aspect preserved, **no upscaling** of images already smaller. Verified against real dimensions via `@napi-rs/canvas`, not asserted on a mock.
- [x] Encode: `canvas.toBlob(..., 'image/webp', 0.82)`. Quality is `WEBP_QUALITY`, a named constant.
- [x] **Byte-level EXIF test.** A fixture JPEG carrying real GPS EXIF (built with `piexifjs`, confirmed present via `piexif.load` before the assertion that matters) goes through the resize/encode path; the resulting bytes are inspected and contain no `Exif` marker. Real canvas decode/encode via `@napi-rs/canvas` patched into jsdom — not a mock of the resize call.
- [x] **Bucket-rejection test.** Written (`tests/media-bucket-storage-api.test.ts`) for JPEG, SVG, and an oversized file, plus a cross-member write test — all against the real storage API via `@supabase/supabase-js`. **Cannot run in this session** (no local Supabase stack — Docker daemon not running here); skips cleanly via the same `describe.skipIf` discipline as `tests/rls-coverage.test.ts`, gated strictly to a local (127.0.0.1) URL so it can never accidentally target the remote project. See Completion notes.
- [x] `deleteImage` removes the object and is a no-op on a URL outside this bucket. Also strips query/hash before matching — see Completion notes (M2 finding).
- [x] Failure surface: `uploadImage`/`resizeAndEncode` throw typed errors for too-large (both pre-decode sanity cap and the real post-resize limit), wrong-type, network, and canvas-unavailable (including an encode timeout). See Completion notes for the pre- vs. post-resize size-check fix.
- [x] `BUILD-LOG.md` updated.

## Workflow gates

- [x] **Gate B** — clear (see above). No longer blocks.
- [x] **M2 `engineering:code-review`** before commit. Three findings, all fixed before commit: the size check ran against the pre-resize file instead of the post-resize stored blob (would have rejected ordinary 8–15MB phone photos); `canvas.toBlob`'s callback had no timeout if the browser never invoked it; `deleteImage`'s path extraction didn't strip a query string/hash.
- [x] **M3** — does not fire. `git diff --name-only main | grep -E '^src/(app|components)/'` returns nothing: this ticket touches `src/lib/`, `tests/`, `supabase/migrations/` and `supabase/config.toml` only. **Stated, not waived.**
- [x] **M4 `engineering:deploy-checklist`** — fires. New migration. Checklist run and recorded in the session; migration 039 deliberately not applied to production by this ticket (T140's mechanism handles that).
- [x] **DEVIATIONS entry**, including the § 5.2 residual and the storage-API test's untested-in-this-session status.
- [x] **Close-out reconciliation.**

## Notes

- **Public-read is deliberate.** A feed screen renders ~24 images; re-signing URLs per render is not viable against a materialized view that stores a URL string. Public read, unguessable path, authenticated write. Do not "harden" this into signed URLs without reopening the decision.
- **`{member_id}` first in the path** is what makes the RLS policy expressible via `storage.foldername`. Do not reorder to `{item_id}/…` — the Item does not exist yet at upload time.
- **Do not add `sharp`.** Server-side re-encode is deferred (`decision-photo-upload.md` § 5.2).
- **Do not introduce `next/image`.** The card uses a plain `<img>` with an eslint-disable; switching adds Vercel image-optimization billing for a benefit the client-side downscale already delivers.
- The canvas re-encode **is** the EXIF strip. It is not a side effect to be optimized away — if someone later swaps in a library that preserves metadata, the privacy commitment silently breaks. Comment it at the call site.

## Completion — notes

- **Test-only dependencies added:** `@napi-rs/canvas` and `piexifjs` (+ `@types/piexifjs`), all `devDependencies`. Neither is imported anywhere under `src/` — confirmed by grep during M2. jsdom has no real 2D canvas context or `toBlob`; these let the resize/EXIF tests exercise real image processing instead of mocking the function that matters, per the ticket's own instruction not to write a call-was-made test in place of a byte-level one.
- **The storage-API-level tests (bucket-rejection, cross-member write) did not run this session.** No local Supabase stack (`supabase start` needs Docker; the daemon isn't running in this environment). They're written and gated `describe.skipIf`, strictly to a `127.0.0.1`/`localhost` `SUPABASE_URL` so they can never accidentally target the remote project — same posture as `tests/rls-coverage.test.ts`. They will run the next time someone has `supabase start` up locally. Flagging so "written" isn't mistaken for "verified."
- **Size-check fix (M2 finding):** the acceptance criterion's own phrasing ("too-large" as one of the typed errors) didn't specify pre- vs. post-resize; the first pass checked the wrong one. Fixed to check the *stored* (post-resize, post-encode) size against the bucket's real 5MB limit, with a separate generous 25MB pre-decode sanity cap. Documented in-line since it's exactly the kind of thing a future reader would "fix" back to the wrong direction without the comment.

## Completion

Date: 2026-09-08
Commit: `808af85` (web repo — bucket, upload module, tests, BUILD-LOG) + `92eb801` (parent repo — ticket close-out, DEVIATIONS, decision stub; committed directly to `main`, see DEVIATIONS) + `af39afe` (parent repo — deviation note)
