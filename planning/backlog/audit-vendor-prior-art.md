---
purpose: Prior-art extraction from the retired vendor surface — what the old producer flow collected, showed, and got right; what carries forward into the producer journey; what must not; and where the old design was wrong for the item-and-location model rather than merely old.
layer: how
status: backlog
---

# Audit: the vendor surface as prior art for the producer journey

**Raised by:** PM, 2026-09-04. *"Vendor and producer are essentially the same concept — producer is broader, but categorically the same thing."* Correct, and it means the retired code is design work already done, not waste.
**Mode:** read only. Nothing deleted, edited, or moved.
**Method:** read `/register-vendor`, `/vendors/[slug]` + `VendorProfilePage`, `VendorCard`, `RecruitmentGrid`, `BusinessDetailCard`, `/you`'s Saved / Following / Settings tabs, `/you/vendor` (the producer dashboard), `/join`, `lib/categories.ts`, `lib/types.ts`, and `scripts/001-create-tables.sql`. Cross-checked every field against the live schema in `supabase/migrations/`.
**Companion:** [`audit-vendor-market-retirement.md`](audit-vendor-market-retirement.md) — the deletion inventory. **This audit changes its timing** (§ 6).
**Companion:** [`audit-producer-signup-comparables.md`](audit-producer-signup-comparables.md) — the same questions asked of ten outside products, plus the proposed v1 field list and step sequence. It confirms four of this audit's carries and the one big leave.

> **The headline.** The old surface answered questions the new one has not been asked yet, and it answered several of them well. It also encoded the previous thesis — grading businesses by extractiveness — and asked producers for their home street address. **Both halves matter.** The parts worth taking are mostly *mechanisms* (a completeness nudge, a recruitment-as-empty-state pattern, a one-line tagline, an OG image); the parts to leave are mostly *judgments the platform made about people*.

---

## 1. What the old flow actually was

### `/register-vendor` — one page, one scroll, "about 90 seconds"

**Not a walkthrough.** A single form, everything visible at once, submit at the bottom. Fields, in order:

| Field | Required | Note |
|---|---|---|
| Vendor name | ✓ | |
| **Tagline** | ✓ | **max 120 chars, with a live counter.** Load-bearing — see § 2.1 |
| Categories | ✓ | multi-select from **8 curated slugs**, rendered as a 4-column grid of emoji tiles; if >1 selected, a second row picks the **primary** |
| Markets | ✓ | multi-select checklist of curated markets with day/time shown |
| Street / City / State / ZIP | ✓ | **geocoded at submit**; failure blocks the form |
| Story | — | free textarea, "tell customers who you are, how you got started" |
| **Cover photo URL** | — | a **text field for a URL**, hinted *"Upload is coming soon."* |
| Website / Instagram / Contact email | — | |

On submit: geocode → `businesses` insert → `vendor_categories` rows → `market_vendors` rows → redirect to the public profile. **One listing per account**, hard-capped, with *"editing and deletion are coming soon."*

### `/vendors/[slug]` — the public profile

A **cover-photo hero** (falling back to the primary category's emoji on a gradient), an overlapping white card with name + tagline + category chips + Follow, then **Market Schedule** (each market with days, times, and a computed *"Next: Saturday"*), then **About**, then **Contact**. A **sticky mobile Follow button** pinned above the nav.

### `VendorCard` — the browse unit

Fixed-width horizontal-scroll card: cover photo or category emoji at 4:3-ish, name, tagline (2-line clamp), *"Midtown · Saturday"*, and an inline Follow.

### `RecruitmentGrid` — the cold-start surface

**The most interesting artifact in the set.** Ten producer categories (Food Makers, Growers, Home & Body, Textile & Fiber, Wood & Metal, Repair & Restoration, Traditional Trades, Teachers & Workshops, Animal Products, Local Service Providers). Each is a horizontal row of three **dashed-outline "open spot" cards** — *"Home Baker · No one listed yet in Sacramento · List here — it's free"* — followed by one **worked example card** with a real-sounding name and tagline and a *"Sign up like this"* button. Above them, one **featured example listing** rendered at full fidelity, badged *"Example listing,"* with *"Free · 90 seconds · No fees, ever."*

**It is already conditional:** `{!hasVendor && <RecruitmentGrid />}` on `/you`. The condition was right; the placement was wrong — it is stapled below the saved/following/settings tabs rather than being the page.

### `/you/vendor` — the producer dashboard

Follower count, 7-day profile views / support clicks / bulletin opens, sparklines, week-over-week deltas, a follower list. Plus a **"Listing health" checklist**: cover photo ✓/✗, story ≥200 chars, tagline, listed at a market, bulletin in last 30 days — each with a **"fix" link to the exact place that repairs it**, and a "Top tasks" panel surfacing the next incomplete one.

### `/join` — the recruitment landing page

*"For vendors — Sell at a farmers market? Get listed free."* Then a numbered **How it works**: create an account (10 seconds) → tell customers who you are (90 seconds) → your profile goes live → customers follow you.

---

## 2. Carry forward — and why

### 2.1 The tagline — the single highest-value missing field ⭐

A required **120-character one-liner**, separate from the long story. The old code used it in four places: the card subtitle, the profile subhead, the `<meta name="description">`, and the **OpenGraph description**.

**The new model has no equivalent.** `group_businesses` has `public_description` — an untruncated textarea whose placeholder invites a paragraph. A card cannot render a paragraph, and neither can a link preview.

> **Carry it.** Add `tagline text` (≤120, with a counter) to `group_businesses` and collect it in the shop walkthrough's step 1 beside the brand name. It is one small field that fixes the card, the profile, and every share.

This also **strengthens the case for a walkthrough step-1 change** the current scope did not consider: brand name and tagline together are one question — *"what's it called and what is it?"* — and belong on the same screen.

### 2.2 The OG image — the finding that changes what photo upload is for ⭐⭐

The old vendor page set:

```
openGraph: { title, description, url, images: [vendor.cover_photo_url || '/og-default.png'] }
```

**Grep result: `openGraph` appears in exactly two files in the entire application — `/vendors/[slug]` and `/business/[slug]`. Both are in the delete list.** Every page the new model ships — every Item, every shop, every Member page — has a `generateMetadata` with a title and a description and **no OpenGraph block and no image at all.** (`og-default.png` is referenced by the old code and does not exist in `public/`.)

The platform's own stated sharing model is *phone to phone: a link, copied or sent.* **Right now every one of those links renders as a bare grey text row in iMessage, WhatsApp and Signal.**

> **This reframes photo upload.** Its most valuable consumer is not the feed card — it is the link preview, which is the platform's primary distribution channel and currently renders nothing. **An Item with a photo and an OG tag is a share that looks like something.** Carry the OG block forward and wire it to the uploaded image.

**Cost: very small.** A `generateMetadata` addition on three route files, reading a column that F055 populates. **Value: disproportionate**, and it is invisible until someone shares a link and sees the difference.

### 2.3 The listing-health checklist ⭐

Five binary checks, each with a repair link, plus a "next task" nudge. **This is the mechanism that gets producers to actually upload a photo** — a field nobody is prompted to fill is a field most people skip, and an always-present media block that falls back to a glyph gives the platform no way to ask.

> **Carry the mechanism, shrink the list.** For v1: photo ✓, tagline ✓, description ✓, one listing published ✓, values statement ✓. Five checks, each linking to the surface that fixes it, shown on the producer's own view of their shop. **Not** a dashboard, **not** analytics — the analytics half is `producer-tools.md` § Growth and stays b2.

### 2.4 Recruitment-as-empty-state ⭐ — and this is the PM's IA change, already half-built

The grid's design is exactly what the PM described: *the recruitment grid stops being a permanent fixture stapled to the bottom of the page and becomes the pre-producer state of the page itself.* The old code already computed the right condition (`!hasVendor`); it just rendered the result in the wrong place.

**What the design gets right and is worth keeping:**

- **It makes emptiness legible as opportunity.** Dashed "open spot" cards read as *vacancies*, not as *nothing here* — the single hardest problem a launch-density local platform has.
- **It teaches by worked example.** A card with a real-sounding name and tagline shows a newcomer what a good listing looks like far better than any instruction. This is the journey audit's finding — *"the first frame that teaches anything teaches by example rather than by explanation"* — already solved once.
- **It names the ask in the person's own vocabulary.** "Home Baker," "Bicycle Mechanic," "Sewing & Mending Teacher" — not "vendor," not "business."
- **It sets expectations numerically.** *"Free · 90 seconds · No fees, ever."*

**What must change:** the ten categories are hardcoded to Sacramento and to *selling*. The new model's producer also **hosts** and **offers services**, so the rows need a gathering and a service lane; and the copy has to come from the locality rather than a constant. **Reuse the shape, not the array.**

### 2.5 The auth-gate modal ⭐

`AuthGateModal` takes an `intent`, a `headline`, and a `subtext`: *"Sign up to support Clara's Kitchen — Hearted businesses save to your profile and let owners see what you care about."* **Contextual**, naming the specific thing and the specific benefit.

The journey audit found the sign-in prompt to be the largest single drop in the funnel, arriving cold. The old code solved that. **Carry the pattern** — a response prompt that names what you were trying to do beats a generic sign-in page.

### 2.6 Smaller carries

- **The category-tile grid.** Emoji tiles with a primary-selection row is a good mobile taxonomy picker. See § 4 for the live gap it answers.
- **"Next: Saturday."** A computed next-occurrence string is far more useful than a recurrence rule rendered raw. The gathering surfaces should read the same way.
- **The sticky mobile primary CTA** above the nav on a profile page — consistent with the DLS's bottom-anchored-controls rule.
- **Share-to-clipboard with a toast** on the detail card.
- **The `/join` "How it works" ladder** — four numbered steps with honest time estimates. The framing is wrong (§ 3.1) but the *structure* is the clearest explanation of the product anywhere in the codebase, and the journey audit's top finding is that nothing explains the product.

---

## 3. Do not carry — and why not

### 3.1 `ownership_tier` and `OwnershipBadge` — this is the old thesis, not an old field ⛔

Six values: `independent`, `coop`, `local-franchise`, `challenger`, `mission-driven`, `pe-corporate`. Rendered as a badge on every business, driving map pin colour from deep green to near-black, with `BusinessDetailCard` emitting `data-extractive="true"` for the bottom tier and surfacing parent company and location count as evidence.

**This is a platform-assigned judgment about a person's business, computed from data the business did not write.** The new model replaced it deliberately: self-declared values plus self-attested Tier 0 locality badges. Carrying any part of it resurrects exactly what the never-sourced constraint forbids — *a values label the Member did not write, attached to a person the platform can place on a map.*

> **Leave it entirely.** Not the enum, not the badge, not the pin ramp, not the parent-company disclosure. `OwnershipTier` survives on disk only because `map-config.ts` types `PIN_COLORS` with it — and `ExploreMap`, the live map, reads only `MAP_DEFAULTS` and carries a comment saying `PIN_COLORS` is reserved. **No live surface renders an ownership tier.** Keep it that way.

### 3.2 Required street address, geocoded at submit ⛔ — and it is the same harm as the EXIF one

The old form **required** street, city, state and ZIP, explained as *"your home, farm, or studio address — used to pin your listing on the map,"* geocoded it at submit, and blocked the form if geocoding failed.

**A home baker's answer to that field is their home address, and the product then pinned it on a public map.**

This is precisely the harm A1 exists to prevent, arriving through the form instead of through the photo's EXIF block. The new model already refuses it in two places: `location.md` defers address normalization with a State-tagged Intent, and `business-jurisdiction.md` chose **ZIP, not address** for the locality claim specifically as a doxxing-prevention measure — which is why the shop walkthrough's step 4 asks for five digits and nothing more.

> **Leave it.** The shop walkthrough's anchor-Location step is the correct replacement: a producer picks or creates a Location they are willing to publish, rather than being required to disclose where they live. **This is the clearest case in the whole audit of the old design being wrong for the new model rather than merely old** — and finding it beside the EXIF work is not a coincidence. Both are the same mistake at different layers.

### 3.3 Markets, `market_vendors`, and the market schedule ⛔ *(as a mechanic)*

The old model's spine was *vendor attends market*: a curated market list, a required multi-select, a schedule section, a "Next: Saturday," and market-attendance notifications.

**The new model is items with locations.** A farmers market is a `recurring-temporary` Location, or a `place`-kind Group. The *question* — "where and when can people find you?" — survives and is answered by the anchor Location plus each Item's own location and schedule. **The mechanic — tick your markets from a curated list the platform maintains — does not**, and reviving it would put the platform back in the business of curating a market registry.

**One thing to salvage from it:** the profile's *"here is where and when to find this person"* section is genuinely missing from the new shop page, which lists Items but never summarizes the producer's own rhythm. Rebuild it from Item locations and schedules — **not** from a markets table.

### 3.4 The old `reports` table ⛔

`pillar` (`customers` / `employees` / `community` / `planet`), `description`, `source_url`, `personal_witness`. **That is a third-party attestation shape** — a structured claim by one person about another's conduct, with a cited source and a witness flag. It is the *inverse* of self-declaration.

The v1 report path is a private message to the operator. Same word, opposite thing. Already binding note 5 in the review; the reason is now sharper than "different columns."

### 3.5 One listing per account ⛔

Hard-capped, with editing "coming soon." The new model supports several `kind='business'` Groups per Member and `/you/sell` already renders one row each. **The cap was a shortcut around having no editor. Building the editor is the fix.**

### 3.6 Already-decided leaves

- **`supports` / `SupportButton`** — support and oppose are deferred by ratified decision.
- **The analytics dashboard** — `vendor_stats_daily`, sparklines, week-over-week. This is `producer-tools.md` § Growth and it is b2. **Do not let the listing-health checklist (§ 2.3) drag it in** — the checklist is five booleans, not a metrics surface.
- **Bulletins** — `producer-tools.md` § Bulletin, b2.
- **Password auth** — `/join` still advertises *"email and password."* The platform is magic-link only.

---

## 4. One live gap the prior art exposes

**No composer collects a category, so no producer-created Item has one.**

- `items.category` exists on the spine (migration `015`). `item_tags` exists and is commented *"controlled vocabulary… curated by the platform."*
- The seed file writes `items.category`. **No action handler does** — `itemCreateInput` has no `category` field, and nothing writes `item_tags`.
- Explore's category facet derives its options **from the result set** (`categoryOptions()` maps over returned rows). Seeded rows have categories; anything a real producer creates has `null`.

**So the shipped category filter narrows a set that only seed data can populate, and the first real producer's listing is uncategorized forever.** F045's bottom sheet ships a category multi-select over it.

The old model solved this: eight curated slugs, emoji, labels, pin colours, a mobile-friendly tile picker, and a primary-category concept — sitting on disk in `lib/categories.ts`, imported only by vendor-era files.

> **Recommendation: add one category selection to the composers, reusing the old tile grid.** One optional field on `item.create`, one column that already exists, one component adapted. **Roughly half a day**, and it makes an already-shipped filter do something.
>
> **Stated honestly: this is scope, and the month is already over-subscribed.** It is listed here as a finding with a recommendation, not folded silently into a scenario. If it does not fit, the alternative is to say so and **drop the category facet from F045** rather than ship a filter over an empty dimension.

---

## 5. Where the old flow beat the new one

Recorded because the new surfaces are shipped and green, and re-litigating them is not v1 work — but the comparison should not be lost.

1. **One page beat five steps.** Registration was a single scroll with the whole ask visible and an honest *"about 90 seconds."* The shop walkthrough is five steps, and a producer cannot see what they are agreeing to until step 5. For someone standing at a market on a phone, the old shape is arguably better. **Not worth reversing in v1** — the walkthrough ships, its evals are green, and the tagline addition (§ 2.1) is a step-1 change, not a re-architecture.
2. **The old product knew it needed upload and said so.** A cover-photo field shipped from day one with the label *"Upload is coming soon."* The rebuild removed the field along with the stopgap, so the honest placeholder became silence.
3. **The old product explained itself.** `/join`'s four-step ladder is the clearest statement of what this is anywhere in the tree. The rebuild has no equivalent, which is the journey audit's single biggest finding.
4. **The old profile answered "when can I find you."** The new shop page lists Items and never summarizes the producer's rhythm.

---

## 6. Consequence for the retirement sweep — timing changes

[`audit-vendor-market-retirement.md`](audit-vendor-market-retirement.md) § 7 Phases 3–5 delete 51 files. [`decision-photo-upload.md`](decision-photo-upload.md) § 7 recommended deferring them past launch as hygiene.

**Revised, on the PM's instruction and on this audit's evidence:** the deletes happen **after the producer journey is specced and built**, not merely "after launch." Git history preserves the code either way, but **convenient beats recoverable while you are actively designing against it** — and this audit found four things worth copying (the tagline's usage, the OG block, the health-checklist shape, the recruitment grid's card design) that are far easier to read on disk than to reconstruct from a diff.

**Concretely:**

- **Do not delete anything until T125 and T126 have merged.** The recruitment grid, the vendor profile page, and the dashboard's checklist are the reference material for those two tickets.
- The one carve-out stands: **`/following` gets its redirect now** — it is a live, routable duplicate of a shipped surface, and a redirect deletes nothing.
- After T126, Phases 3–5 run as written. **`lib/categories.ts` joins the delete list only if § 4's recommendation is rejected**; if accepted, it is carried forward and pruned instead.

---

## 7. What changes in the scoped work

| Artifact | Change |
|---|---|
| [F057](scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md) | Rewritten as a **modification behind a become-a-producer action**, not a rebuild. Recruitment grid becomes the pre-producer state. |
| [T125](../../development/tickets/T125-you-gains-a-producer-state.md) | Rescoped to match. Materially smaller. |
| [F056](scenario-F056-producer-gives-their-shop-a-face-and-says-what-they-stand-for.md) / [T126](../../development/tickets/T126-edit-shop-image-and-values.md) | Gain the **tagline** field and the **listing-health checklist**. |
| [F055](scenario-F055-producer-puts-a-photo-on-what-they-sell.md) / [T121](../../development/tickets/T121-product-composer-photo-field.md) | Gain the **OpenGraph image** criterion — the highest-leverage consumer of the uploaded photo. |
| [`decision-photo-upload.md`](decision-photo-upload.md) § 7 | Cut list and schedule revised: You is cheaper than assumed. |
| [`audit-vendor-market-retirement.md`](audit-vendor-market-retirement.md) § 7 | Delete phases gated on T126 rather than on a date. |
