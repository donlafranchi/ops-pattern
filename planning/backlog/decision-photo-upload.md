---
purpose: Decision — photo upload enters v1. Carries the ratify-checklist run on the scope change, the storage/privacy/moderation shape, the four non-optional companions, and the absolutes that need `weigh` before any ticket encodes them.
layer: how
status: backlog
---

# Decision: photo upload, and the self-serve producer journey it belongs to

**Raised by:** PM scope ratification, 2026-09-04. *"Photo upload moves into v1, and the self-serve producer journey is now core v1 scope. A member signs themselves up, creates a business, uploads images, and describes what they sell — without anyone doing it for them."*
**Type:** B — a real architectural decision. Substrate that does not exist today.
**Blocks:** v1 workstreams 3 (populated content), 5 (producer minimal profile), 9 (report path — see § 5).
**Gate B applies.** Two absolutes in § 4 must carry State-tagged Intent before a ticket encodes them.

---

## 1. Checklist 1 — ratifying a decision

Run 2026-09-04 against [`../../playbooks/process-checklists.md`](../../playbooks/process-checklists.md) § 1.

### ☑ Name what already ships that this contradicts

Grepped `web/src` and `web/supabase`. **Nothing is contradicted. Everything is absent.** That is a different and in some ways worse finding — there is no shipped decision to overturn, so there is also no shipped shape to inherit.

| Thing | State on `main` |
|---|---|
| Any `<input type="file">` | **Zero occurrences** in `web/src`. |
| Any `supabase.storage` call | **Zero occurrences** in `web/src`. |
| Any storage bucket | **None.** `supabase/config.toml` § `[storage]` is `enabled = true` with the bucket block **commented out**. No migration creates one. |
| `items.photo_url` | **Exists** (migration `036`), nullable, on the spine, any kind. `discoverable_items` coalesces it, then `item_products.photo_urls[1]`. Nothing writes either. |
| `item_products.photo_urls text[]` | **Exists** (migration `015`). `item.create` accepts a `photoUrls` input — **no caller passes it.** Every seed row is `array[]::text[]`. |
| `members.avatar_url`, `members.bio` | **Exist** (migration `002`). `MemberPublicPage` renders both. **No editor anywhere in the app.** |
| `group_businesses` image column | **Does not exist.** |
| `ItemFeedCard` media block | **Ships** (T118). Renders a photo when `photoUrl` is set, a kind glyph when not. **It has never once rendered a photo in production** — there is no photo to render. |
| `item.update` / `item.delete` handler | **Do not exist.** The registry (`src/actions/index.ts`) holds 19 handlers; every Item handler is create-shaped (`item.create`, `item.publish`, `item.attach_location`). |
| `member.update_profile` handler | **Does not exist.** `saveProfileAction` writes `display_name` directly via RLS, outside the action layer, by design (profile edits are not declarations). |

**The load-bearing consequence:** T118 shipped a card designed around an image the product cannot produce. Upload is what makes T118 true rather than aspirational — and until it lands, the always-present media block is a glyph field, which is exactly the "empty platform" appearance the card work was meant to fix.

### ☑ List in-flight tickets on the affected surface

```
grep -L -iE '^\*\*Status:\*\* *(Done|Complete)' development/tickets/*.md
```

→ **empty.** Nine tickets sit in `development/tickets/` unarchived; all nine are Done. **No in-flight ticket is invalidated by this scope change.** T119 closed and deployed earlier today.

### ☑ List approved scenarios on the affected surface

Three scenarios sit in `planning/next/`. **All three are on the Explore surface, and the scope change reaches all three through the Home/Explore merge.** Dispositions, given here rather than left for build:

| Scenario | Disposition | Why |
|---|---|---|
| **F044** — inline list/map toggle on Explore | **Hold, and re-scope to Home if the merge lands.** Also **missing its Gate C review** — cannot be ticketed as-is regardless of this decision. | Targets `/explore`. Survives intact if the Explore→Home fold defers (§ 7 recommends it does). |
| **F045** — filter icon + bottom sheet on Explore | **Revise before ticketing — stale on its own terms, independent of this decision.** Also **missing its Gate C review.** | Its acceptance criteria hardcode `distance (1 / 5 / 10 / 25 mi)` in three places. `decision-surfaces.md` § *Distance is out* (Ratified 2026-09-03) deletes that control. F045 encodes a filter the platform has decided not to have. |
| **F046** — nav hides on scroll | **Proceed unchanged.** | Global scroll behaviour over any tab count. Neither the merge nor upload touches it. |

**The merge-scoping invalidation the PM named is real and it is these three rows.** F044 and F045 were written against a three-tab Explore; the ratified two-tab model retires that tab. They are coherent only under one of two futures, and § 7 picks one.

### ☑ Land the State-tagged Intent line

Two absolutes need `weigh` before ticketing. Both are stated in § 4 with the tag slot empty and marked `NEEDS WEIGH`. **Gate B stops ticketing on T-numbers that encode them** — which is every upload ticket.

### ☑ Mark the supersession in the doc being overridden

Applied in place: [`../now/bundle-1.md`](../now/bundle-1.md) § *What ships in v1* gains workstream 10 and a supersession note; § *Schedule risk* is rewritten against the enlarged list. `mvp-goal.md` § *In scope* already defers to `bundle-1.md` and needs no edit.

### ☐ Commit it

Commit line at the end of this session's report. **This checklist item is not satisfied until the parent repo is pushed.**

---

## 2. The journey, step by step — what exists, what is missing

The ratified journey is one continuous path. Each step is a drop-off point.

### Step 1 — sign up

**Exists and works.** Magic-link only (`/auth/login`; `/auth/signup` redirects to it), `/auth/callback` → `/onboarding`. F030 shipped, evals green.

**Missing.** Onboarding asks exactly one question — `"What should we call you?"` — and ends. `completeOnboardingAction` defaults the home locality server-side to a hardcoded `DEFAULT_HOME_PLACE_ID`; the Member is never asked where they live. Nothing explains what the platform is.
**Drop-off:** the email round-trip. A magic link means leaving the app; no screen acknowledges it. This is the largest single drop in the funnel and it is structural, not fixable with copy.
**Owner:** already v1 workstreams 7 (onboarding copy) and 8 (metro-only location). **This scope change adds nothing here** — it raises the stakes, because a producer who bounces at step 1 never reaches the part we are building.

### Step 2 — create a business

**Exists and works, and is unreachable by design.** `SellWalkthrough` is five steps — brand name → anchor Location → about (optional) → locality ZIP (optional) → review — writing through `group.create` / `group.update_draft` / `group.activate`. F036 shipped, evals green.

**Missing: the door, not the room.** The only entry is `SellCta`, which is mounted on `src/app/you/page.tsx` — a page that also renders "Your Market", a `MarketSelector`, saved/followed **vendor** tabs, and a signed-out shell reading *"Sign in to follow vendors and save your market."* Four of the tables that page queries do not exist. A member who signs up and wants to start selling lands on a vendor-era account page and has to find one button in it.

**This is the finding that reshapes the month.** The self-serve journey's step 2 needs **no new engineering** — it needs the front door that [`audit-vendor-market-retirement.md`](audit-vendor-market-retirement.md) § 7 Phase 2 already scopes as "the You rebuild." That phase was already v1 workstream 4. **The scope change does not add a workstream here; it makes an existing one load-bearing and pins its acceptance criteria.** See F057.

### Step 3 — declare values

**Does not exist.** No column, no surface, no handler. `group_businesses` carries `display_name`, `public_description`, `legal_entity_kind`, `state_of_formation`, `formed_at` — nothing values-shaped.
**Decided here:** § 3. **Placement decided here:** not in business creation. See § 3.

### Step 4 — upload images

**Does not exist in any form.** See § 1's table. This is the whole of the new substrate.

### Step 5 — list what you sell

**Exists and works for three of seven kinds.** `ProductComposer` (F038), `ServiceComposer` (F040), `GatheringComposer` (F034) — all shipped, evals green, all reached from `/you/sell`, which redirects to `/you` unless the Member already has an active `kind='business'` Group. `item.create` rejects `wonder` / `offer` / `ask` / `initiative` at the Zod enum.

**Missing: an image step.** Grepped every composer's `StepDef` list — product is details → pickup → made → review; service is details → pricing → area → review; gathering is kind → details → when → review. **No composer has an image step.** `item.create` accepts `photoUrls` for products only, and nothing passes it.
**Also missing:** anything writes `items.photo_url` — the general, any-kind column T118's card actually reads first.

### Step 6 — see it live in the feed

**Exists and is correct.** `item.publish` refreshes `discoverable_items`; the MV coalesces `items.photo_url` then `item_products.photo_urls[1]`; `ItemFeedCard` renders it. **The pipe is built end to end and has never carried water.**

**One constraint this imposes on the design, and it is binding:** the MV refreshes on `item.published` events. If a photo is attached *after* publish, the card does not update until something else triggers a refresh. **Therefore the photo is part of create, not a later edit** — unless an `item.update` handler ships and refreshes the MV itself. § 6 sequences accordingly.

---

## 3. Where the values declaration lives — DECIDED

**Not in business creation. On the producer profile, editable, after the shop exists.**

`decision-producer-values-declaration.md` § 4 left the shape undecided. Decided here:

- **Placement:** the producer profile editor, reachable from `/you`, with an empty-state prompt on the public shop page. **The Sell walkthrough stays five steps.**
- **Shape:** free text, one field, ~280 characters. Not tags, not a fixed set.
- **Storage:** one nullable `values_statement text` column on `group_businesses`.

**Why not a sixth walkthrough step.** The walkthrough already has an optional step people skip (locality ZIP). Asking a person to articulate what they stand for at the moment they are trying to get a shop open is the highest-friction placement available for the least urgent field, and the PM's stated v1 goal is that people *"aren't got in the way of."* The declaration is also the field a producer will most want to revise — a create-only field on a flow they will never see again is the wrong home for it. And an edit surface has to be built regardless: **there is no editor for any producer field today.** Building the editor is the work; the walkthrough step would be extra work on top of it.

**Why free text.** Same argument the report path already won on: at this density the operator learns more from what people write than from categories guessed in advance. A fixed set can be derived later from the free text. A fixed set invented now is a taxonomy of a population that does not exist yet.

**Self-declared-only is enforced structurally, not by policy alone.** One column, written only by the owning Member through their own editor, with **no source column, no import path, and no handler that accepts a third-party value.** There is nowhere to put a sourced value even if someone wanted to. That is the shape the § 4 absolute requires.

---

## 4. The absolutes — NEEDS WEIGH before any ticket

> **A1. An uploaded image is stripped of its embedded metadata before it is stored. The platform never stores or serves an image carrying the GPS coordinates of the person who took it.**
> `Intent (NEEDS WEIGH — Gate B blocks ticketing)`

Rationale for `weigh` to test: this platform places producers on a map at known times, and the ratified positioning is that a values label the Member did not write is a doxxing vector. **A photo taken in a home kitchen carries the home's coordinates in EXIF by default.** That is the same harm arriving through a different door, and arriving from the producer's own phone rather than from a purchased dataset. This reads as a commitment rather than a bet: no observation would justify serving GPS-bearing images. Sits beside the coarse-location and never-sourced commitments in [`../../product/foundation/policy.md`](../../product/foundation/policy.md).

> **A2. The platform never serves an image it cannot take down. A takedown path exists before the first upload is accepted.**
> `Intent (NEEDS WEIGH — Gate B blocks ticketing)`

Rationale for `weigh` to test: a public local app accepting user images will receive something inappropriate. The answer may legitimately be *"the operator handles it via the report path"* — but that answer is only true if the operator **can**. Today they cannot: there is no `item.update`, no `item.delete`, no storage delete path, and no report path. "The operator edits Postgres by hand" is a stated answer and an honest one; "we will deal with it" is not an answer. This absolute forces the choice to be made before exposure rather than during an incident.

---

## 5. What arrives with upload and is not optional

Five items. Each is mandatory in the sense that shipping upload without it produces a specific, nameable harm — not in the sense that it would be nice.

### 5.1 Moderation — and it converts workstream 9 from cheap to blocking

**The answer is: the operator handles it via the report path.** That is a legitimate v1 answer for a solo operator. It has two preconditions that do not exist:

1. **The report path itself** (v1 workstream 9). Not built. Its own decision doc names an operating gate — a real destination and a rough response commitment — that the PM has not yet named.
2. **A takedown mechanism.** Not built, and not a copy problem. Removing a photo requires an action handler that clears `items.photo_url` / `item_products.photo_urls`, deletes the storage object, and refreshes the MV. None of that exists.

> **The consequence, stated plainly: the report path stops being the cheapest item on the v1 list and becomes a hard dependency of the largest new one.** `bundle-1.md` currently calls it *"the smallest item here and the only one whose absence has no workaround."* Both halves are still true; what changed is that its absence now blocks something else. It cannot be the item that slips.

**Minimum viable moderation for v1** — deliberately small, and complete:
- A report affordance on Items and producer profiles (workstream 9, unchanged in scope).
- An operator-only takedown: one handler, `item.remove_photo`, that nulls the column, deletes the object, and refreshes the MV. **~half a day. It is the whole of A2's cost.**
- A written runbook line naming who looks and how fast. Not code.

**Explicitly out:** automated classification, a moderation queue UI, appeals, a strike system, hash matching. None of those are v1 at this density and none should be implied by "we handle moderation."

### 5.2 EXIF stripping — mandatory, and free if the resize is done client-side

**Drawing an image to a `<canvas>` and re-encoding discards all EXIF, including GPS, as a side effect of the encode.** So the client-side downscale that keeps egress cheap (§ 5.4) *is* the privacy control. One mechanism buys both.

**But client-side stripping is advisory** — a Member's own token can POST straight to the storage endpoint. The server-side enforcement is the bucket itself:

> Set the bucket's `allowed_mime_types` to `['image/webp']`.

A raw camera JPEG — the format that actually carries GPS from every phone — is then **rejected by the storage API**, not by our code. The only way to get a file in is through the canvas path, which has already stripped it. This is real server-side enforcement with no new dependency and no `sharp`.

**Honest limit, and it should be stated rather than glossed:** WebP can carry an EXIF chunk. A deliberately crafted file could still smuggle one. The MIME restriction moves the risk from *"every phone upload leaks the producer's home coordinates by default"* to *"you would have to construct it on purpose."* For v1, that is the line. Server-side re-encode with `sharp` closes it completely and costs a dependency, a cold-start budget, and a serverless memory bump — **defer, and record the residual.**

### 5.3 File size and format limits — mandatory, enforced at the bucket

- `file_size_limit = 5MB` on the bucket (below the global `50MiB` in `config.toml`, which is a ceiling, not a policy).
- `allowed_mime_types = ['image/webp']` — see 5.2. **This also closes the SVG-with-embedded-script vector**, which matters because the bucket is public and serves whatever is in it.
- A client-side pre-check for a friendly error message. **Advisory only** — the bucket is the enforcement.

### 5.4 Orphaned images — the answer is "they are not deleted," and it must be said out loud

**Items soft-delete.** `items.deleted_at` is set; the row survives; the URL in `photo_url` survives with it. Soft-deleted rows drop out of `discoverable_items`, so **nothing in the product renders the image** — but the file stays at a public URL, fetchable forever by anyone who has it.

That is an acceptable v1 position. **What is not acceptable is leaving it unstated**, because a producer who removes a listing will reasonably believe the photo is gone. Two things follow:

- **Copy obligation.** Wherever a producer removes a listing or replaces a photo, the interface does not claim the image is deleted.
- **A cleanup sweep is deferred, not forgotten.** A later job keyed on `deleted_at` reconciles the bucket. Out of v1; record it.

**Replacement is different from deletion and is in scope:** when a producer replaces a photo, the old object should be deleted at that moment. That is one line in the same handler and it prevents the bucket accumulating every draft attempt.

### 5.5 Alt text — mandatory, and it is an M3 failure if skipped

`ItemFeedCard` renders `alt=""` today. That is correct for a decorative glyph field and **wrong the moment the image is producer-supplied content**. `design:accessibility-review` (M3, mandatory on any new surface) will fail it.

**Cheapest correct answer: derive the alt from the Item title.** No new field, no new question in the composer, no producer burden, and it is accurate — the photo is of the thing the title names. An optional caption field is the richer answer and is not v1.

### 5.6 Also flagged — real, and deliberately *not* called mandatory

- **Upload rate limiting.** A public app with an authenticated upload endpoint is a free CDN. Auth-required insert + a 5 MB cap covers the ordinary case; a per-member daily cap is a later item. **Not v1.**
- **Upload failure mid-composer.** The multi-step composer's `onAdvance` is already async and already surfaces errors, so the machinery exists — but a half-uploaded photo on a flaky mobile connection needs one defined state. **In scope, as an acceptance criterion, not a workstream.**
- **No CSP exists** (`next.config.ts` sets no headers, there is no middleware). So no `img-src` allowlist blocks the storage origin. Worth knowing; **nothing to do.**
- **Do not introduce `next/image`.** The card uses a plain `<img>` with an eslint-disable. Switching to `next/image` adds Vercel image-optimization billing for a benefit the client-side downscale already delivers. **Keep the plain `<img>`.**

---

## 6. Cost, honestly — and the two questions asked

### The shape

Storage is not the cost. **Egress is.** At a 1600px max edge encoded WebP, a photo is roughly 150–250 KB.

| | Storage | Egress |
|---|---|---|
| 1,000 items × 1 image | ~200 MB | — |
| 1,000 items × 5 images | ~1 GB | — |
| 10,000 feed loads × 24 cards | — | **~48 GB** |

Supabase Pro includes 100 GB storage and 250 GB egress, with per-GB overage beyond; the free tier is 1 GB and 5 GB. *(Working figures — confirm against current pricing before relying on them for a budget.)* **A v1 in one metro does not approach either ceiling.** The number that grows is feed egress, and it grows with *views*, not with *uploads*.

### ☑ "Is one image per item meaningfully cheaper than several?"

**Not in money. Meaningfully cheaper in scope.**

Five images per item instead of one moves storage from 200 MB to 1 GB — irrelevant at this scale — and does not change feed egress at all, because the card renders one image either way. What several images actually costs is **product surface**: a gallery component, ordering, delete-one-of-many, a carousel on the detail page, and a composer step that is a file *manager* rather than a file picker.

**Recommendation: one image per Item at v1**, written to `items.photo_url` — the general, any-kind column. Leave `item_products.photo_urls` alone as the reserved gallery slot. **The reason is composer complexity and review surface, not hosting cost, and the doc should say so** so that nobody later "optimizes" by removing a gallery we never built.

### ☑ "Are producer-profile images the same job or a second one?"

**One primitive, two consumers — and the second consumer is only cheap after the first lands.**

**Shared (~70%):** the bucket, the RLS policies, the client-side downscale-and-re-encode, the size and MIME limits, the EXIF property, the picker component, the error states.

**Genuinely different (~30%), and it is the expensive 30%:**

1. **It writes to a row that has no update handler.** Item photos ride along on `item.create`, which exists. A profile image writes `members.avatar_url` or a new `group_businesses` column — **and neither has an update path in the action layer today.** That is new handler work, not new upload work.
2. **It is an edit, not a create.** Replace-and-delete-old is required from day one; item create is not.
3. **Aspect ratio.** Avatars are square, item photos are 4:3. Either a crop step or an accepted `object-cover` centre-crop. (Recommend `object-cover`. A crop UI is a week.)

**So: not the same job, and not two jobs either.** Call it one primitive plus a second surface that is cheap in upload terms and expensive in action-layer terms. **It belongs with the producer-profile editor (F056), not with item upload (F055)** — because the editor is where the missing handlers get built anyway.

---

## 7. The scope collision — the PM's recommendation, tested

> **Revised 2026-09-04**, twice in one day: first against the PM's recommendation to defer the delete phases, then again after the prior-art pass ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md)) and the PM's read that You is a modification rather than a rebuild. **The second revision gave the month back about two days.** It softens the conclusion; it does not reverse it.

### The deletions: correct, with one carve-out, and now gated on work rather than on a date

**Correct on the facts.** [`audit-vendor-market-retirement.md`](audit-vendor-market-retirement.md) § 7 splits into six phases. Phase 0 closed 2026-09-03. Phases 3, 4 and 5 are the deletions and the shared-file prunes: mechanical, no user-visible behaviour, and safe to defer — with `MarketProvider` unhooked from the root layout, the whole dead subtree hangs off `/you` alone.

**Carve-out.** `/following` is a live, routable, vendor-era duplicate of the shipped `/you/following`. Two Following surfaces both reachable is user-perceivable and contradicts a shipped scenario. **One line in `next.config.ts`, now, not a phase.**

**Revised timing — this is the change.** The deletes now happen **after the producer journey is built (T126), not merely after launch.** The prior-art pass found four things worth copying out of that code — the OpenGraph block, the tagline field and its four consumers, the listing-health checklist, the recruitment grid's card design — and three tickets in this set name specific vendor-era files as reference material. Git history preserves it either way; **convenient beats recoverable while you are actively designing against it.**

**And the thing the recommendation understated is now smaller but still real.** Phase 2 is not a delete phase — it is the You change, and the ratified journey routes step 2 straight through `/you`, whose only door to business creation sits amid the previous product. **Deferring the deletions is safe; deferring the You change breaks the journey.**

### What the You re-read gave back

The earlier version of this section assumed the You work was a rebuild — three to four days. It is not. The PM's read is right and the code agrees: `/you` already computed `{!hasVendor && <RecruitmentGrid />}`. **The condition was right; the placement was wrong.** Making the producer surface conditional on a deliberate act, and promoting the invitation from a footer to the page's pre-producer state, is **one to one and a half days**, reusing a query that already exists and a component already on disk.

### The arithmetic, revised

| Work | Cost |
|---|---|
| Storage bucket, policies, upload primitive, EXIF/limits | 2–3 days |
| Product composer wired, card verified, **plus the OpenGraph block** | 1–1.5 days |
| Two more composers (service, gathering) | 0.5 day |
| Takedown handler | 0.5 day |
| Producer editor: values, **tagline**, **health checklist**, two missing handlers | 3–4 days |
| You: two states over a modification *(was 3–4 as a rebuild)* | **1–1.5 days** |
| Gates — `weigh` ×3, `review`, M3 on new surfaces, M2 | 2–3 days |
| **Total** | **10.5–14 days** against ~19, solo |

Deferring the 51 deletions still buys one to two days and still carries no gate time. **The cut is right, it is worth more now that it also preserves the reference material, and it is still not sufficient on its own.**

### What I would cut instead — revised

**1. Defer the Explore→Home fold; keep the You change.** *Unchanged, and now for a cleaner reason.* Workstream 4 is **(a)** fold Explore into Home and retire the tab, and **(b)** the You change. When (b) looked like a rebuild that would touch the nav anyway, the two halves were entangled; **as a modification, (b) does not touch the nav at all, so the split is clean rather than surgical.** Defer (a): three tabs stay for v1, the largest single engineering item goes, the item that reverses T114/T115/T116 goes, and **F044 and F045 stop being stranded.**

**2. Populated content → a fixed seed set.** Unchanged, and now doubly load-bearing: the seed set is what makes both the feed cards *and* the shared-link previews look like something.

**3. Group events — promoted from "cut" to "probably free."** *This is the second thing the re-read changed.* Its blocker was a create path for a gathering outside the Sell walkthrough. **T125's pre-producer invitation covers gatherings by acceptance criterion**, so the route falls out of that ticket rather than needing its own. **Do not cut it; do not staff it separately either.** Verify it after T125 and close it if it works.

**4. The values declaration's *shape* work** — not the field, not the display. Free text, one column, one textarea. Unchanged, and the `weigh` pass in front of it is still the thing to schedule first.

**Now plausible where it was not: the category gap.** [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 4 — no composer collects a category, so every producer-created Item is uncategorized forever while Explore ships a category filter over the dimension. Carrying the retired eight-slug taxonomy and its tile picker is **about half a day**, and the two days the You re-read returned is where it would come from. **PM's call. If declined, F045 loses its category facet** rather than shipping a filter over an empty dimension.

**Still must not be cut: the report path.** It is a precondition for shipping upload at all (§ 5.1).

### The honest read

Before the re-read: five or six of ten. **After it: six of ten, and group events likely a seventh for free** — conditional, as before, on `weigh` running on the three absolutes and the PM naming the report destination **in the first week rather than the last**. Both are an hour of decision each and both block days of work. Nothing else on the list is gated that cheaply.

## 8. What this does not decide

- The report path's destination and response commitment. **Still the PM's, still a ship condition, and now on the critical path of a second workstream.**
- Whether the values declaration is visible to logged-out visitors.
- Whether a `kind='business'` Group carries a declaration separately from the Member who owns it. (§ 3 puts the column on `group_businesses`, which answers it for v1 by construction: the Group carries it.)
- Whether the deferred server-side re-encode (§ 5.2) ever ships.
- The orphan-cleanup sweep (§ 5.4).

## 9. Next steps

1. **`weigh` on A1 and A2** (§ 4). Gate B blocks every upload ticket until both carry State tags. **Do this first — it is the only thing that cannot be parallelised.**
2. **PM names the report destination and response commitment.** Now blocking two workstreams.
3. **PM rules on § 7** — specifically the Home/Explore split, which changes what F044/F045/F046 are for.
4. **PM's call on the category gap** ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 4) — carry it, or drop F045's category facet.
5. `scope` has written F055–F058; `review` has produced the combined review including the prior-art pass; `ticket` has written T120–T126. All three are done as of this session.
