---
purpose: Scenario — a producer edits their shop after creating it: a shop image, a public description, and a self-declared values statement. Introduces the first producer-side edit surface and the two update handlers the action layer is missing.
layer: how
status: backlog
---

# F056: A producer gives their shop a face and says what they stand for

**Bundle:** b1 (SocialUs v1)
**Sub-bundle:** v1 workstream 5 (producer minimal profile) + workstream 10 (photo upload, second consumer)
**Work-map item:** [`bundle-1.md`](../now/bundle-1.md) § What ships in v1 — workstream 5, *"Producer minimal profile, including the values declaration."*
**Loops:** 7 (Buy close), 9 (Make a living locally), 8 (Follow what you love — the shop page is the follow target)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
**Primitive shape:** Person → Group(kind='business') with an image and a self-authored values statement. **No shell entity** — the values statement is a column on `group_businesses`, a child of a Group of people, not a property of a corporate record.
**Spec contract:** [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) §§ 2.1, 2.3 (tagline + listing health) · [`decision-producer-values-declaration.md`](../archive/backlog/decision-producer-values-declaration.md) §§ 2, 4 · [`decision-photo-upload.md`](decision-photo-upload.md) §§ 3, 6 · [`groups.md`](../../product/systems/groups.md) § kind='business' · [`bundle-1.md`](../now/bundle-1.md) § Positioning
**Status:** backlog — **moved back from `next/` 2026-09-07, same day it rode there.** Gate B is clear (both upload absolutes ratified in `policy.md` § Uploaded images; the values-sourcing absolute dropped as moot with the feature) but Gate A is not: the review's EXTEND — `groups.md` owes a § Editing an active business Group — is still open. It advanced alongside F055 and F058 by mistake, not by ruling; F055 and F058 had no EXTEND and correctly stay in `next/`. Returns to `next/` once the Groups spec section lands.

## The Person

Maya's shop exists. It has a name, an anchor Location, and one loaf with a photo on it. The shop page itself is a name and a list. There is no picture of the bakery, no sentence about who she is, and nothing that says what she cares about — which is the whole reason the v1 positioning claims a values badge means something.

She also cannot change any of it. The five-step walkthrough that created the shop is over and there is no way back into it. **There is no editor for any producer field anywhere in the application.** The public description she typed at step 3 is now permanent; if she skipped it, it is permanently empty.

## The Story

From **You**, under her shop's name, Maya taps **Edit shop**.

A single page — not a walkthrough, not a modal. Four things on it:

- A **shop image** field, the same photo control as the composer, cropped square instead of 4:3.
- **Shop name**, prefilled.
- **About** — the public description, prefilled with what she wrote at step 3, or empty.
- **What we stand for** — an empty text area with a short line above it: *"In your own words. This is yours to write — we never fill it in for you, and we never get it from anywhere else."* A counter shows 280 characters.

She adds a photo of the kitchen bench. She writes two sentences about sourdough and about paying the person who helps her on Saturdays a real wage. She taps **Save.**

Her public shop page now leads with the image, her name, the About paragraph, and — under a quiet heading — the sentences she wrote, rendered as her words, attributed to her, with nothing around them that looks like a platform rating.

## Surfaces

- **Entry point:** `/you` → the shop row → **Edit shop**. *(The producer surface on `/you` is [F057](../next/scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md); this scenario assumes the row exists and adds the control to it.)*
- **Primary action:** edit four fields, save once.
- **Interaction:** a plain form. **Not** a multi-step composer — this is editing something that already exists, and a walkthrough is the wrong shape for revision.
- **Completion:** save writes through the action layer and returns to `/you` with the change visible on the public shop page.
- **Discovery:** the shop image and the values statement render on the public shop page (`/p/[…place]/g/[slug]`), which already ships (F035).

## Data Captured

| Field | Where | Notes |
|---|---|---|
| Shop image URL | **new** `group_businesses.image_url text` | Object in `item-media`, path `{member_id}/{uuid}.webp`. Same bucket, same policies as F055 — one bucket, not two. |
| Values statement | **new** `group_businesses.values_statement text` | Free text, ≤280 chars, nullable. **No source column, no provenance column, no import path** — there is nowhere to record an external origin because there is never one. |
| **Tagline** | **new** `group_businesses.tagline text` (≤120) | **Carried from the retired vendor model** ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 2.1), where it was required and drove the card subtitle, the profile subhead, the meta description, and the OG description. The new model has no equivalent — `public_description` is an untruncated textarea whose placeholder invites a paragraph, and **a card cannot render a paragraph and neither can a link preview.** |
| Public description | `group_businesses.public_description` (exists) | Currently write-once at walkthrough step 3. This scenario makes it editable. |
| Shop name | `group_businesses.display_name` / `groups.name` (exist) | Editable. Slug does **not** re-derive on rename — see Edge Cases. |

**New action handler:** `group.update_business` — the first non-draft Group write in the registry. Every existing Group handler is create-or-draft-shaped (`group.create`, `group.update_draft`, `group.activate`, `member_join`, `member_leave`).

## Acceptance Criteria

### The producer can edit a shop that already exists

**Given** a Member with an active `kind='business'` Group
**When** they open **Edit shop**
**Then** the form renders prefilled with the current name, description, image, and values statement, and saving persists all four. _Why: this is the missing half of the producer surface. F036 shipped a create path and no edit path, so every field a producer set during the five-step walkthrough is currently permanent. Everything else in this scenario depends on this existing._

### Writes go through the action layer

**Given** a save
**When** the write executes
**Then** it runs through a named `group.update_business` handler emitting a `group_events` row in the same transaction, with `acting_member_id` set. _Why: [`action-layer.md`](../../product/systems/action-layer.md) — the action layer is the only write surface, and this is a Group state change, not a profile preference. `bundle-1.md` § Non-negotiable data-model commitments lists the same-transaction row+event invariant as binding on every ticket._

### Only an owner can edit

**Given** a Member who is not an active `role='owner'` member of the Group
**When** they attempt the write
**Then** it is rejected with an authorization error. _Why: `item.create` already enforces exactly this check for Group-filed Items; the same check, not a second convention._

### The values statement is written by the Member it describes — structurally, not just by policy

**Given** the shipped schema and handler
**When** anything attempts to populate `values_statement`
**Then** the only path is the owning Member's own editor: the column has no companion source or provenance field, the handler accepts no third-party or import parameter, and no seed, migration, backfill, or scheduled job writes it. _Why: the ratified constraint ([`decision-producer-values-declaration.md`](../archive/backlog/decision-producer-values-declaration.md) § 2) is that the platform never sources, infers, or attaches a values label from voter records, donation databases, purchased files, or inferred affinity. **The way to keep a commitment like this is to build a system in which the other thing is not expressible** — a column with nowhere to record a source is a stronger guarantee than a rule saying not to use one. Items carry locations; a label the Member did not write, attached to a person the platform can place on a map, is a targeting record._

### The statement renders as the producer's words

**Given** a shop with a values statement
**When** an anonymous visitor opens the public shop page
**Then** it renders under a heading that attributes it to the producer, with no score, no counter, no platform endorsement, and no comparison to other producers. _Why: § Positioning holds that the badge only carries information if it can vary and if it is legibly the producer's own claim. Platform chrome around it — a checkmark, a rating, a "verified values" treatment — converts a self-declaration into a platform judgment, which is the thing the never-sourced constraint exists to prevent._

### The shop image uses the same upload primitive as F055

**Given** the shop image field
**When** a producer picks a photo
**Then** it is downscaled, re-encoded to WebP, EXIF-stripped, and stored in the same bucket under the same path convention and the same policies as F055. _Why: one primitive, two consumers. A second bucket or a second upload component is how the EXIF guarantee ends up holding in one place and not the other._

### Replacing the shop image deletes the old object

**Given** a producer replaces the shop image
**When** the new object is stored
**Then** the previous object is deleted. _Why: unlike an Item photo, a shop image will be replaced repeatedly over a shop's life. This is the surface where orphan accumulation is most likely._

### The shop has a one-line tagline, separate from its description

**Given** the editor
**When** a producer fills it in
**Then** a ≤120-character tagline is captured with a live counter, and it — not the long description — is what renders on the shop card, the profile subhead, and the shared-link preview. _Why: [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 2.1. The retired registration form required this field and used it in four places; the rebuild dropped it and left only a paragraph field, which no card and no link preview can use. **One small field fixes the card, the profile, and every share.**_

### The producer is told what their shop is still missing

**Given** a producer viewing their own shop
**When** any of photo, tagline, description, values statement, or a published listing is absent
**Then** a short checklist shows which, each item linking to the surface that fixes it. _Why: **this is the mechanism that gets a photo uploaded at all.** A field nobody is prompted to fill is a field most people skip, and an always-present media block that quietly falls back to a glyph gives the platform no way to ask. The retired producer dashboard solved this with exactly five binary checks and a repair link each ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 2.3). **Five booleans and five links — not a dashboard**; the analytics half of that surface is `producer-tools.md` § Growth and stays b2._

### Every field is optional and an empty shop still works

**Given** a producer who saves with no image and no values statement
**When** the public shop page renders
**Then** it renders correctly without either, with no empty heading and no placeholder prompting a visitor about a missing declaration. _Why: an empty-state that nags a visitor about something the producer chose not to write makes absence look like a failing. A producer who declines to declare has declared something._

## Edge Cases

- **Renaming the shop does not change its URL.** `groups.slug` is set at create with a random suffix and is not re-derived here. A rename that moved a public URL would break every link already shared. Flag for a later decision; do not silently re-slug.
- **A Member with two shops** — one row per shop on `/you`, one editor per shop.
- **Values statement at exactly 280 characters** — accepted. 281 — rejected client-side and server-side.
- **A statement that is only whitespace** — normalized to null, so the section does not render.
- **Multi-owner Group** — any active owner can edit. Partnership Groups are b2 (`/you/sell` already says so), so this is a single-owner case in practice.
- **Accessibility** — a real `<form>` with labelled inputs, a character counter wired via `aria-describedby`, and a save confirmation announced in a live region. M3 fires: this is a new page.

## Assumptions

- F055 has landed the bucket, policies, and upload component. **This scenario does not stand up storage; it consumes it.**
- `/you` has a shop row to hang **Edit shop** on — F057. If F057 slips, this scenario needs a temporary entry point and should say so rather than inventing a route.
- The public shop page (`ShopPublicPage`, F035) is live and renders Group fields. **Verified.**
- `members.avatar_url` and `members.bio` exist and render on `/m/[handle]` with no editor. **Member-level profile editing is deliberately not in this scenario** — see Out of Scope.

## Out of Scope

- **Member profile editing** (`display_name`, `bio`, `avatar_url` on `/m/[handle]`). A real gap — the audit named it, and "Edit profile" on the Member page currently links to `/you`, which has no editor. It is a *second* editor with a *third* update handler, and the v1 journey is the producer journey. **Cut deliberately, recorded as a gap, not forgotten.**
- **A fixed values vocabulary, tags, or a picker.** Free text only. The taxonomy, if ever warranted, gets derived from what people write.
- **Any consumer response to the declaration** — support, oppose, counts, endorsements. Deferred, not rejected ([`decision-producer-values-declaration.md`](../archive/backlog/decision-producer-values-declaration.md) § 3).
- **Whether the declaration is visible to logged-out visitors.** This scenario renders it publicly, matching the rest of the shop page. If the PM wants it gated, that is a decision, not an implementation detail.
- **Verification of anything in the statement.** Tier 1 and Tier 2 are out of v1 and this field is not on that ladder at all.
- **Cropping UI.** Square `object-cover` centre-crop.
- **Producer analytics** — followers, profile views, sparklines, week-over-week. The retired dashboard bundled these with the listing-health checklist; **only the checklist carries.** `producer-tools.md` § Growth, b2.
- **`ownership_tier` and ownership badges.** [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 3.1 — a platform-assigned judgment computed from data the business did not write. It is the inverse of a self-declared values statement and must not travel beside it.

## Capabilities unlocked

- **Producer self-service** — steps 3 and 4 of the ratified journey, and the first time a producer can change anything about themselves after signup.
- **The v1 positioning made legible** — the values declaration is what lets the audience be focused while the mechanic stays open. Without it, the positioning is a marketing choice with no product surface.
