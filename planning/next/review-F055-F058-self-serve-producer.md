---
purpose: Review — F055–F058, the self-serve producer journey and photo upload. Verdict PROCEED with five binding notes and one EXTEND. The gate F044 and F045 both skipped.
layer: how
status: next
---

# Review — F055–F058: the self-serve producer journey

**Scenarios:** [F055](scenario-F055-producer-puts-a-photo-on-what-they-sell.md) · [F056](scenario-F056-producer-gives-their-shop-a-face-and-says-what-they-stand-for.md) · [F057](../next/scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md) · [F058](scenario-F058-a-member-reports-an-image-and-the-operator-takes-it-down.md)
**Decision doc:** [`decision-photo-upload.md`](decision-photo-upload.md)
**Prior art:** [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) — **revised this review; see § Prior-art pass.**
**Reviewer:** `review`
**Date:** 2026-09-04
**Bundle:** b1 (SocialUs v1)
**Verdict:** **PROCEED on F055, F057, F058. EXTEND on F056.** **Seven** binding notes; two hard blockers named.

> **F057 split out 2026-09-07.** F057 advanced to `next/` while F055, F056 and F058 stayed in `backlog/` behind Gate B, and a review lives in its scenario's lane. Its portion now lives at [`../next/review-F057.md`](../next/review-F057.md). **This file remains authoritative for F055, F056 and F058**, and for the shared reasoning all four rest on.

> **Revised 2026-09-04** after a prior-art pass over the retired vendor surface and the PM's read that You is a modification rather than a rebuild. Two binding notes added (6 and 7); F057's risk profile dropped materially; the design verdict is unchanged.

> **Why this review exists.** F044 and F045 both reached `ticketed` with no review file — their own ledger rows record it, and Gate C was written afterwards to stop exactly that. This scope change is the largest single addition to v1 and introduces the project's first storage substrate, its first operator-privileged write, and its first two non-draft update handlers. It is not going to be the third.

---

## Verdict summary

The four scenarios fit the existing systems better than expected, because most of the substrate is already there and unused: `items.photo_url` exists and is coalesced into the feed's materialized view, the card renders it, the composers are already async-per-step, and the shop walkthrough already writes through the action layer. **The genuinely new surface is one storage bucket, one client-side image pipeline, and three action handlers.**

**One scenario needs extending before it is ticketed.** F056 adds two columns to `group_businesses` and introduces `group.update_business` — the first non-draft Group write in the registry — and neither `groups.md` nor `policy.md` currently says anything about either. That is a spec gap, not a scenario defect.

**Two blockers are outside engineering and both are on the critical path:**

1. **`weigh` has not run** on A1 (EXIF/GPS), A2 (takedown-before-upload), or the never-sourced values constraint. **Gate B stops ticketing on every upload ticket** until it does. *(Tickets T120–T126 are written; they carry the gate unticked and cannot be built.)*
2. **The report destination and response commitment are unnamed.** A ship condition for workstream 9 since 2026-09-04, and now a precondition for F055.

**Next skill:** `weigh`, then `build`. Not `ticket` — tickets are already written.

---

## Architecture check

### Systems touched

| System | What this scope reaches |
|---|---|
| [`item.md`](../../product/systems/item.md) | § *Per-kind typed columns* ("Embedded media") — the spec anticipates images; migration `036` built the column; nothing has ever written it. |
| [`groups.md`](../../product/systems/groups.md) | `kind='business'` and `group_businesses`. **Two new columns and the first post-activation write.** See EXTEND below. |
| [`action-layer.md`](../../product/systems/action-layer.md) | Three new handlers. Same-transaction row+event invariant applies to all three. **First operator-privileged write in the project.** |
| [`policy.md`](../../product/foundation/policy.md) | Two new commitments belong here (A1, and the never-sourced constraint), beside the coarse-location and accountable-participation commitments they rhyme with. |
| [`principles.md`](../../product/foundation/principles.md) | People-First Principle — F057 is the correction of its most visible current violation. |
| [`design-language.md`](../../product/ui/design-language.md) | **No recipe exists for an image-picker field.** See binding note 4. |

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables | **one** — `reports` (F058) | Name collides with a **pre-rebuild** `reports` table that is in the deletion sweep and does not exist in the live lineage. Different shape, different lineage. **Binding note 5.** |
| New columns | **two** — `group_businesses.image_url`, `group_businesses.values_statement` (F056) | Both nullable, both on an existing child table. No spine change. |
| New event types | **two** — a `group_events` kind for the business update, an `item_events` kind for photo removal | Both fit the existing partitioned event tables and the same-transaction helper. No new event infrastructure. |
| New handlers | **three** — `group.update_business`, `item.remove_photo`, and the report write | Registry is a two-line addition each (`src/actions/index.ts`). |
| Storage substrate | **new, and it is the real addition** | One bucket, three RLS policies on `storage.objects`. `config.toml` § `[storage]` is `enabled = true` with the bucket block commented out; **no migration creates a bucket.** |
| Forward-tier impact | **clear** | `item_products.photo_urls` stays reserved for a gallery. One image per Item forecloses nothing — a gallery is additive and `photo_url` becomes the hero. |
| Shell-entity smell | **clean, and worth stating** | `values_statement` sits on `group_businesses`, a child of a Group of people. It is a sentence a Member wrote about themselves, stored against the set of people they organize with. Nothing here creates a corporate record or an `*_id` pointing at one. |
| Loop fidelity | **matched** | Loops 7 and 9 are the producer loops and their stated pain is being findable and making a living locally. A listing that cannot carry a picture of the thing is a Loop 7 failure before it is an aesthetic one — and T118 already shipped the card that proves it, rendering a glyph field on all sixteen published Items because no photo can exist. |
| Policy posture present | **yes, and it is the reason this review is long** | Uploaded photos carry GPS. Producers may operate from home. Item locations are already published. Three facts that are individually fine and jointly a doxxing vector. F055's EXIF criterion is the mitigation and A1 is the commitment behind it. |

### Cross-system consistency

**`item.md` ↔ what shipped — the spec was right and the product never caught up.** § *Per-kind typed columns* names embedded media, migration `036` added `items.photo_url` for every kind with a comment explaining the precedence rule, `discoverable_items` coalesces it, and `ItemFeedCard` reads it. **Five layers of a six-layer pipe are built.** F055 is the sixth. No spec change is owed here — this is the spec finally being executed.

**`groups.md` ↔ F056 — a real gap, and the reason for the EXTEND.** `groups.md` describes `kind='business'` Groups, the brand resolve-up, and the standing tier. It says nothing about a business Group being **editable after activation**. Every shipped Group handler is create-or-draft-shaped: `group.create`, `group.update_draft` (draft only), `group.activate`, `member_join`, `member_leave`. F056 introduces the first write to an *active* Group, and `groups.md` has no section for it — no statement of who may edit, what is editable, whether edits are events, or whether renaming is allowed. **The scenario answers all four correctly. The spec should carry the answers, not only the code.**

**`policy.md` ↔ A1 and the never-sourced constraint — both belong there and neither is there.** `decision-producer-values-declaration.md` § 2 already says the never-sourced constraint belongs in `policy.md`; it has not landed. A1 is the same shape and the same file. **Two paragraphs, one `weigh` session, and Gate B clears.**

**`decision-surfaces.md` ↔ F057 — consistent, and materially lower-risk since the prior-art pass.** F057 is now a two-state modification over a page that mostly works, not a rebuild: the producer condition is a query `/you/sell` already runs, and the pre-producer state is a component already on disk. **One deliberate divergence remains, flagged in the scenario itself.** F057 implements the You half of the ratified two-tab model and explicitly does **not** implement the Explore→Home fold or the persistent nav **+**, on the recommendation in `decision-photo-upload.md` § 7. **That is a divergence from a ratified decision and it is correctly surfaced rather than assumed.** It needs the PM's ruling, not the reviewer's — but the reviewer's read is that splitting the merge is right, for a reason the decision doc does not state: **the two halves have different risk profiles.** The You half adds a surface and reverses nothing. The Explore half reverses three tickets merged inside 48 hours and strands two approved scenarios. Bundling a low-risk item with a high-risk one means the low-risk one waits.

**`decision-photo-upload.md` § 5.4 ↔ soft delete — consistent, and the honesty is the load-bearing part.** Items soft-delete; the row and the URL survive; the file stays publicly fetchable. F055 states it, F058 states that the two removal paths behave differently, and both impose a copy obligation. **This is the correct v1 position and the correct way to hold it.** The failure mode would have been to leave it unstated and let a producer believe a deleted listing deletes its photo.

### Architecture verdict

**PROCEED on F055, F057, F058. EXTEND on F056.**

> **EXTEND — F056.** Before tickets are *built* (they are already written), `groups.md` needs a short § *Editing an active business Group*: who may edit (active owners), what is editable (`display_name`, `public_description`, `image_url`, `values_statement`), that edits emit `group_events`, and that **the slug does not re-derive on rename.** That last one is not cosmetic — `groups.slug` is set at create with a random suffix and every public shop URL and every shared link depends on it. The scenario flags it as an Edge Case; the spec should carry it as a rule, because the next person to touch a rename will not read this scenario.

---

## Design check

### Surfaces touched

| Surface | Existing / new | M3 fires? |
|---|---|---|
| Product / Service / Gathering composer, step 1 | existing, **new field** | **yes** — new interactive element |
| `/you` | existing, **two states over a modification** | **yes** |
| Edit shop | **new page** | **yes** |
| Public shop page | existing, two new sections | **yes** — new content region |
| Item detail page | existing, **new ⋯ menu** | **yes** |
| Report sheet | **new** | **yes** |
| `ItemFeedCard` | existing, unchanged | no — but its `alt` changes |

**M3 (`design:accessibility-review`) fires on every ticket in this set except the substrate one.** This is not a judgment call: `git diff --name-only main | grep -E '^src/(app|components)/'` returns files for six of seven tickets. Checklist 4 fires with it.

### Components required

| Component | In the design language? | Disposition |
|---|---|---|
| Image-picker field | **No. Nothing in `design-language.md` covers a file input, an upload progress state, or a filled/empty media field inside a form.** | **Binding note 4 — this is an `explore` gap and it must be filled before build, not invented at build time.** |
| Bottom sheet | **Yes** — shipped in T115 | Reuse for the report sheet. |
| ⋯ overflow menu | **No** | Small, but it is a new pattern and it will spread. Name it in the DLS with the picker. |
| Multi-step composer | Yes | Unchanged. The photo field lives *inside* an existing step, adding no step. |
| Plain form (Edit shop) | Partially | `.input` and `.card` exist; a form page layout is not recipe'd. Low risk. |
| Card media block | Yes (T118) | **Unchanged.** F055 changes what fills it, not how it renders. |

### The composer's shape is preserved, and that matters

F055 adds a field to an existing first step rather than a new step. **This is the right call and the review wants it protected in the ticket.** The product composer is four steps, the service composer four, the gathering composer four; the sell walkthrough is five. Adding a photo *step* to each would make the shortest path from "I make hot sauce" to "it is listed" nine screens. The PM's stated v1 goal is that people are not got in the way of. **A field, not a step.**

### Design verdict

**PROCEED, conditional on binding note 4.** Every surface either reuses a shipped recipe or is a plain form — except the image picker, which has no recipe at all and appears on three surfaces. That is precisely the T088 failure the checklist calls out: *"specified `ItemFeedCard` as a list of fields with no recipe — that is why three surfaces now share a card nobody ever designed."* An image picker with no recipe would be the same mistake on the same number of surfaces.

---

## Prior-art pass — what reading the retired vendor code changed

The PM's premise is right: vendor and producer are the same concept at different breadths, and the retired surface is design work already done. Reading it changed three things in this set and surfaced one gap nobody had named.

**1. It moved photo upload's centre of gravity.** The old vendor page set an OpenGraph image from the cover photo. **`openGraph` appears in exactly two files in the whole application, and both are in the delete list.** Every page the new model ships — Item, shop, Member — has a title and a description and no OG block, so every shared link renders as a bare text row. Against a stated distribution model of *phone to phone: a link, copied or sent*, **the link preview is a more valuable consumer of an uploaded photo than the feed card is**, and it costs a `generateMetadata` addition on three files. Added to F055 and T121.

**2. It found two fields the rebuild dropped without noticing.** A required ≤120-character **tagline** — which the old code used in four places including the OG description, and which the new model replaced with an untruncated paragraph field no card can render — and a **listing-health checklist** with a repair link per item, which is the only mechanism in either product that actually prompts a producer to add a photo. Both added to F056 and T126, the checklist deliberately shrunk to five booleans so it does not drag the b2 analytics surface in with it.

**3. It confirmed the PM's You read, with evidence.** `/you` already computed `{!hasVendor && <RecruitmentGrid />}`. **The condition was right and the placement was wrong** — recruitment was stapled under the saved/following/settings stack rather than being the page's pre-producer state. F057 is therefore a modification, not a rebuild, and T125 shrank accordingly.

**4. It found a live gap.** No composer collects a category, so `items.category` is null on every producer-created Item, while Explore's category facet derives its options from the returned rows and F045 ships a category multi-select over it. **The shipped filter narrows a dimension only seed data populates.** [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 4 recommends carrying the old eight-slug taxonomy and its tile picker (~half a day); **this review does not fold it into any scenario** — it is a fifth thing in an over-subscribed month and it is the PM's call. **If it is declined, F045 must lose its category facet** rather than ship a filter over an empty dimension.

**What the pass explicitly refused to carry**, and the reason matters more than the list: `ownership_tier` and its badge — six tiers from `independent` to `pe-corporate`, driving pin colour and a `data-extractive` attribute. **That is the platform grading a person's business from data the business did not write**, which is the exact shape the never-sourced values constraint forbids. It must not ship beside a self-declared values statement. Likewise the required geocoded **street address**: the old form asked a home baker for their home address and pinned it publicly — **the same harm A1 addresses, arriving through the form instead of through the photo's EXIF block.** Finding those two beside each other is not a coincidence; they are one mistake at two layers.

## Binding notes — the ticket and the build carry these

1. **One bucket, one upload component, one code path.** F055 and F056 both upload; they must share the bucket, the path convention, the client-side resize, and the MIME/size limits. **A second upload path is how the EXIF guarantee ends up holding on Items and not on shop images.** The privacy property must be a property of the one function everything calls.

2. **The EXIF test asserts on bytes, not on intent.** The test that proves A1 must fetch the stored object back and inspect it for an EXIF GPS block. A test that asserts "we called the resize function" proves nothing about what is in the bucket. **This is the one criterion in the whole set where a green test that does not test the real thing is actively dangerous** — it would licence the claim that producers' home coordinates are safe.

3. **`allowed_mime_types` is the enforcement, and the residual is recorded.** Client-side validation is advisory; a member's own token addresses the storage endpoint directly. Restricting the bucket to `image/webp` is what makes the canvas path the only way in — and it closes the SVG-with-script vector on a public bucket at the same time. **The residual (a deliberately crafted WebP can carry an EXIF chunk) goes in DEVIATIONS at close, not in a comment.**

4. **`design-language.md` gains an image-picker recipe before build.** Empty state, filled state, uploading state, error state, replace/remove affordances, aspect ratio per surface (4:3 Item, 1:1 shop), and the accessible-name pattern for a button-wrapping-a-hidden-input. **Escalate to `explore` rather than inventing it in a ticket** — it renders on three surfaces and it will render on more.

5. **The new `reports` table is a new lineage, not a revival.** A pre-rebuild `reports` table exists in `web/scripts/001-create-tables.sql` — the script `INFRASTRUCTURE.md` still tells new developers to run, and which opens with three `cascade` drops. It is in the deletion sweep. **The new table must not be created by editing that file, must not reuse its columns (`pillar`, `personal_witness`, `source_url` — a values-attestation shape from the retired product, not a report shape), and its migration must be a normal forward migration in `supabase/migrations/`.** Same word, unrelated thing.


6. **Read the prior art before writing T121, T125 and T126 — and do not delete it first.** `RecruitmentGrid.tsx`, `/vendors/[slug]/page.tsx` (the OG block), `register-vendor/page.tsx` (the tagline field), and `/you/vendor/page.tsx` (the health checklist) are reference material for three tickets in this set. **Gate the retirement's delete phases on T126 rather than on a date** — git preserves the code either way, but convenient beats recoverable while you are designing against it.

7. **Carry mechanisms, not judgments.** The line through everything worth taking from the vendor surface is that it is a *mechanism* — a completeness nudge, a recruitment-as-empty-state pattern, a one-liner, an OG tag. The line through everything to leave is that it is a *judgment the platform made about a person* — an ownership tier, an extractiveness flag, a four-pillar conduct report, a home address on a map. **When a reviewer is unsure whether a piece of the old surface should come across, that is the test.**

---

## Sibling check — what else this set touches

- **F044 and F045** (`planning/next/`) — both target `/explore` and both lack a Gate C review. **F045 is additionally stale on its own terms:** its acceptance criteria hardcode `distance (1 / 5 / 10 / 25 mi)` in three places, and `decision-surfaces.md` § *Distance is out* (Ratified 2026-09-03) deletes that control. **F045 needs revision before ticketing regardless of what happens to the merge.**
- **F046** — unaffected. Global scroll behaviour over any tab count.
- **T118** — unchanged, and finally true. Its media block has rendered a glyph on every Item in production since it merged.
- **T119** — F058's ⋯ menu lands on the Item detail pages T119 fixed. No conflict; the resolvers are untouched.
- **The vendor sweep** — F057 rewrites `/you` (audit § 7 Phase 2) and adds the `/following` redirect. It explicitly does **not** delete the 51 files, which stay reachable-but-orphaned until after launch.

## Accessibility (M3) — pre-flight

Run properly at build, per ticket. Three things flagged now because they are cheap to design in and expensive to retrofit:

- **The `alt` change is the whole M3 story on the card.** `alt=""` is correct for a decorative glyph and wrong for producer-supplied content. Deriving it from the Item title is correct, costs no new field, and asks the producer nothing.
- **The file input needs a real accessible name.** A `<button>` wrapping a visually-hidden `<input type="file">` is the pattern; the button's name must be *"Add a photo"*, not the input's default.
- **Upload state must be announced.** A visual spinner with no live region leaves a screen-reader user with a form that appears frozen. Announce "uploading" and "photo added."

## Handoff

**Owed after this set builds, and not before:**

- `groups.md` gains § *Editing an active business Group* (the EXTEND).
- `policy.md` gains A1 and the never-sourced constraint as State-tagged commitments — **via `weigh`, before build, not after.**
- `design-language.md` gains the image-picker and ⋯-menu recipes — **before build** (binding note 4).
- `item.md` needs nothing. The spec was already right.

**Next skill:** **`weigh`.** Two absolutes plus the never-sourced constraint. Gate B is the only thing standing between written tickets and buildable ones.
