# T126: Edit shop — image, description, and the values declaration

**Scenario:** `planning/next/scenario-F056-producer-gives-their-shop-a-face-and-says-what-they-stand-for.md`
**Status:** Open — **BLOCKED, Gate B (two absolutes) and the F056 EXTEND.**
**Bundle:** b1 (v1 workstreams 5 + 10)
**Depends on:** T120 (upload primitive), T125 (the shop row this hangs off)
**Prior art:** [`planning/backlog/audit-vendor-prior-art.md`](../../planning/backlog/audit-vendor-prior-art.md) §§ 2.1, 2.3, 3.1. Read `src/app/register-vendor/page.tsx` (the tagline field and its counter) and `src/app/you/vendor/page.tsx` (the listing-health checklist) before writing this — both are on disk and must not be deleted first.

**Serves:**
- **Loop:** 9 (Make a living locally) — a shop with a face and a sentence is a different proposition from a name and a list.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Group(kind='business') with an image and a self-authored values statement. **No shell entity** — a sentence a Member wrote about themselves, stored against the set of people they organize with.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F055-F058-self-serve-producer.md`. **Verdict on F056 is EXTEND, not PROCEED** — see below.
- [ ] **Gate B — ⛔ NOT CLEAR. Two absolutes.**
  1. **A1** (EXIF/GPS), via the shared upload primitive. `decision-photo-upload.md` § 4.
  2. **The never-sourced constraint:** *"A values declaration is written by the Member it describes. The platform never sources it, never infers it, and never attaches it from voter registration records, donation databases, purchased consumer files, inferred affinity, or any other external dataset."* `decision-producer-values-declaration.md` § 2 — flagged there since 2026-09-04 as requiring `weigh` before any ticket encodes the field, and it has not run. **This ticket is that ticket.**
- [ ] **EXTEND unmet.** The review requires `groups.md` to gain § *Editing an active business Group* before build: who may edit, what is editable, that edits emit `group_events`, and **that the slug does not re-derive on rename.** `groups.md` currently has no section for writing to an *active* Group at all — every shipped handler is create-or-draft-shaped. **Blocks the start.**
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec last-changed dates.** `product/systems/groups.md` — `Fri Sep 4 04:18:14 2026 -0700` (**will change when the EXTEND lands — re-check**). `product/foundation/policy.md` — `Tue Sep 1 08:27:03 2026 -0700` (**will change when `weigh` lands — re-check**).
- [x] **Governing DLS recipe named.** `design-language.md` § *Input*, § *Card*, plus the image-picker recipe from T121 at 1:1 instead of 4:3. **A plain form page, not a composer.**

## What changes

Two columns, one handler, one page, two sections on the public shop page.

## Acceptance Criteria

- [ ] Migration `0NN_group_business_profile.sql`: `group_businesses.image_url text` and `group_businesses.values_statement text`, both nullable. **`values_statement` has no companion source, provenance, origin, or import column** — and none is ever added. *(The way to keep a commitment like this is to build a system in which the other thing is not expressible.)*
- [ ] `CHECK (char_length(values_statement) <= 280)`.
- [ ] **`group_businesses.tagline text`** with `CHECK (char_length(tagline) <= 120)`, collected in the editor with a live counter, and rendered as the shop card subtitle, the profile subhead, the meta description, and the **OG description**. *(Carried from the retired registration form, which required it and used it in exactly those four places. The rebuild dropped it and left only an untruncated paragraph field — which no card and no link preview can use.)*
- [ ] `group.update_business` handler — **the first non-draft Group write in the registry.** Patches `display_name`, `public_description`, `image_url`, `values_statement`; emits a `group_events` row in the same transaction with `acting_member_id`.
- [ ] **Owner-only.** Active `role='owner'` membership with `left_at is null` on a `kind='business'` Group. Reuse the exact check `item.create` already performs for Group-filed Items — **the same check, not a second convention.**
- [ ] **The handler accepts no third-party, imported, or externally-sourced value for `values_statement`**, and no seed, migration, backfill, or scheduled job writes the column. **Test it:** assert the column is absent from every seed file and that the handler's Zod input has no source-shaped field.
- [ ] `/you/shop/[groupId]/edit` (or equivalent): a plain form — shop image (1:1 picker), name, About, and **What we stand for** with the line *"In your own words. This is yours to write — we never fill it in for you, and we never get it from anywhere else"* and a live character counter wired via `aria-describedby`.
- [ ] Save persists all four and returns to `/you`.
- [ ] Replacing the shop image **deletes the previous object** via T120's `deleteImage`. *(Unlike an Item photo, a shop image is replaced repeatedly over a shop's life — this is where orphan accumulation is most likely.)*
- [ ] Public shop page renders the image and, under a quiet heading, the statement as the producer's words — **no score, no counter, no checkmark, no platform endorsement, no comparison to other producers.** *(Platform chrome around a self-declaration converts it into a platform judgment, which is the thing the never-sourced constraint exists to prevent.)*
- [ ] All fields optional. A shop with neither renders correctly — **no empty heading, no placeholder prompting a visitor about a missing declaration.** *(A producer who declines to declare has declared something.)*
- [ ] Whitespace-only statement normalizes to null.
- [ ] **Listing-health checklist** on the producer's own view of the shop: photo, tagline, description, values statement, ≥1 published listing — five booleans, each linking to the surface that repairs it. *(This is the mechanism that gets a photo uploaded at all. Model it on `/you/vendor`'s "Listing health" panel, which is on disk. **Five checks and five links — not a dashboard**: the analytics half of that surface is `producer-tools.md` § Growth and stays b2. Do not let the checklist drag it in.)*
- [ ] **No `ownership_tier`, no ownership badge, no extractiveness treatment** anywhere in this ticket. *(The retired profile rendered a platform-assigned tier badge computed from data the business did not write. It is the inverse of a self-declared values statement and must not ship beside one — `audit-vendor-prior-art.md` § 3.1.)*
- [ ] **Renaming does not change `groups.slug`.** Every public shop URL and every shared link depends on it. Assert it in a test.
- [ ] Tests: handler happy path; non-owner rejected; event row written; 280-char boundary at 280 and 281; slug stability on rename; old image deleted on replace; the public page's empty case.
- [ ] Screenshot at 375×812 of the editor and of a public shop page with a statement.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **Gate B** (two absolutes) — blocks the start.
- [ ] **EXTEND** (`groups.md` § Editing an active business Group) — blocks the start.
- [ ] **Checklist 4** — fires. All five items.
- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3 `design:accessibility-review`** — fires. New page, new form, character counter, save confirmation in a live region.
- [ ] **M4 `engineering:deploy-checklist`** — fires. New migration.
- [ ] **DEVIATIONS entry.**
- [ ] **Close-out reconciliation.** `decision-producer-values-declaration.md` § 4 lists the declaration's shape as undecided — **it is decided** (`decision-photo-upload.md` § 3: free text, ≤280, on the producer profile, not in business creation). Correct § 4 in place.

## Notes

- **A form, not a composer.** The walkthrough is the create path; this is the revise path, and a multi-step wizard is the wrong shape for revision. It is also why the declaration is **not** a sixth walkthrough step: asking a person to articulate what they stand for at the moment they are trying to get a shop open is the highest-friction placement available for the least urgent field, and the field is the one a producer will most want to change later.
- **Free text, not tags.** Same argument the report path won on — at this density we learn more from what people write than from categories guessed in advance. A vocabulary can be derived later; one invented now describes a population that does not exist.
- **Member profile editing** (`display_name`, `bio`, `avatar_url` on `/m/[handle]`) is a real gap — "Edit profile" on the Member page links to `/you`, which has no editor. It is a **second** editor with a **third** update handler and it is deliberately out of v1. Recorded, not forgotten.
- **Do not build a crop UI.** Square `object-cover` centre-crop.
- **`design:ux-copy` on the values field.** The prompt has to invite a sentence without steering what the sentence says.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
