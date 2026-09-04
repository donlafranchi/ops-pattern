---
purpose: Comparables research on producer/seller signup and profile buildout across ten products, and a proposed v1 field list and step sequence for the producer journey. Companion to audit-vendor-prior-art.md, which covers our own retired vendor surface.
layer: how
status: backlog
---

# Audit: how other products do producer signup — and the v1 boundary

**Raised by:** PM, 2026-09-04. *"What a producer can do in v1, and no more: be found, say a little about themselves, claim a values badge, list what they sell, say where to find them."*
**Mode:** read only. Research + proposal. Nothing ratified here.
**Method:** public documentation and help-centre material for Etsy, Airbnb, Faire, Google Business Profile, Nextdoor, Substack, Bandcamp, Shopify, LocalHarvest/USDA market directories. Cross-read against our own retired vendor surface ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md)).
**Feeds:** [F055](scenario-F055-producer-puts-a-photo-on-what-they-sell.md) · [F056](scenario-F056-producer-gives-their-shop-a-face-and-says-what-they-stand-for.md) · [F057](scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md) · [`decision-producer-values-declaration.md`](decision-producer-values-declaration.md) § 4 (answers the open shape question)

> **The headline.** Every product that gates publishing behind a photo gates it on the **listing**, never on the **seller profile**. Every product lets a thin profile go live and nags afterwards. And our own retired one-page vendor form beat all ten comparables on time-to-live. **The v1 boundary is not a new design — it is the old form's speed, the item-level photo prompt, and a five-box checklist, and nothing else.**

---

## 1. The common shape — where they agree

Ordered by strength of agreement. Agreement is the signal; disagreement is noted in § 2.

| Rank | Pattern | Who does it |
|---|---|---|
| **Unanimous** | **Identity first: a name and a one-line description.** Never a paragraph, never a photo. | Substack (name + URL + one-liner), Faire (brand name), GBP (name + primary category), Nextdoor (name), Etsy (shop name), Bandcamp (artist name), our retired form (name + 120-char tagline) |
| **Unanimous** | **Narrative is deferred past first publish.** Story / bio / About is always optional and always after. | all ten |
| **Unanimous** | **Post-publish completeness nagging.** A checklist, a "setup guide," or a strength meter that names what is missing and links to the fix. | Shopify setup guide, GBP completeness prompts, Nextdoor "optimize your page," Etsy, Airbnb, our retired `/you/vendor` listing-health panel |
| **Strong** | **Category / what-you-do is asked second**, from a curated list, before anything descriptive. | GBP (primary category, checked before continuing), Nextdoor (up to 10), Etsy, Faire, our retired 8-tile grid |
| **Strong** | **Public location is coarse; precise address is optional, storefront-only, or private.** | GBP (storefront *or* service-area), Etsy (region public, address billing-only), Bandcamp (city), Faire (HQ region + where-made) |
| **Strong** | **Links are a flat optional list collected late.** Website + 1–3 handles. Never required, never validated beyond a URL check. | Substack, Bandcamp, Nextdoor, Faire, GBP |
| **Common** | **Self-declared attributes live in a settings surface, not the create flow.** | Faire (brand portal → Shop page → tags), Etsy (profile attributes) |

**The sequence they converge on:** `name + one-liner → category → coarse location → PUBLISH → photo, story, links, attributes, nagged afterwards.`

---

## 2. Who defers what — the photo decision

**This is the question the PM asked, and the comparables answer it cleanly.**

| Product | Photo to publish a **listing/item**? | Photo to publish the **seller profile**? |
|---|---|---|
| **Etsy** | **Required** — minimum one photo, hard gate | **No** — shop goes live without a banner or shop photo |
| **Airbnb** | **Required** — minimum five, hard gate | **No** — host profile photo is separate and prompted |
| **Nextdoor** | n/a | **No** — logo and cover are post-claim "optimization" |
| **Google Business Profile** | n/a | **No** — photos prompted after verification, never gating |
| **Substack** | **No** — a post publishes without an image | **No** — "set up your profile with a photo… you can come back to refresh at any time" |
| **Bandcamp** | Artwork required per release | **No** — bio, photo, banner all editable after the page exists |
| **Faire** | Product images required | **No** — profile polish happens in the brand portal after |
| **Our retired vendor form** | n/a | **No** — cover photo optional, a URL text field labelled *"Upload is coming soon"* |

**Two findings.**

1. **The photo gate lands on the item, never on the seller.** Nobody in the set makes you upload a picture of yourself or your shop before your shop exists. This is unanimous, and it settles F056: the shop image is optional, always.
2. **The item-level gate is real but conditional.** Etsy and Airbnb gate because the photo *is* the product — physical goods and lodging. Substack, GBP, Nextdoor and Bandcamp do not gate, because their unit is text or a place. **Our item kinds span both** — a loaf of bread is Etsy-shaped, a repair service and a gathering are not. **Recommendation: gate nothing; make photo the first field in the composer and let field order do the work.** A hard gate at the one moment a producer is creating value is the wrong place to add friction for a platform with sixteen items. The nag belongs in the checklist ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 2.3), which is where every comparable puts it.

**The thin-publish-then-nag pattern is universal.** Not one product in the set blocks a profile on completeness. All of them then chase it. Substack's phrasing is the model: *come back to refresh at any time.*

---

## 3. How "where to find me" is handled

| Product | Physical | Online |
|---|---|---|
| **GBP** | **A forced binary** — *storefront* (address shown) or *service area* (region only, **no address published**) | Website + phone, on the same screen |
| **Etsy** | Public location is country/region. Full address is billing and tax only, never public | Shop links optional |
| **Nextdoor** | Address, with a 50-mile visibility radius around it | Phone + website, added after claim |
| **Bandcamp** | **City only** — drives Discover and local search | Links sidebar, edited from the profile |
| **Faire** | HQ region + a separate *where products are made* — two coarse fields | Brand portal |
| **Our retired form** | ⛔ **Required street/city/state/ZIP, geocoded at submit, blocking on failure** | Website / Instagram / email, optional |

**What this tells us.**

- **The GBP binary is the pattern worth copying and we already have it.** "Customers come to you" vs "you go to customers" is the same question as *does this producer have a publishable Location, or only a metro*. Our anchor-Location step is the storefront branch; **metro-only is the service-area branch**, and GBP proves shipping a profile with no address at all is normal, not degraded.
- **Coarse-public / precise-private is the convergent rule.** Every comparable publishes city-or-region and keeps anything finer for billing. Our metro-level v1 sits inside the mainstream, and **the retired form was the outlier in the whole set** — it is the only one that required a home address and put it on a public map.
- **Links are uniformly trivial**: a flat optional list, late, unvalidated. Do the same. No oEmbed, no handle verification, no social preview.
- **No comparable displays distance to the viewer on a profile.** Nextdoor comes closest with a visibility radius, and that is a *delivery* rule, not a rendered number. Our no-distance-display rule costs us nothing against the field.

---

## 4. Badges and self-declared attributes

| Product | What is claimed | Where it is claimed | Verified? | How it is displayed |
|---|---|---|---|---|
| **Faire** | Brand value tags — *Handmade*, *Eco-friendly*, *Not on Amazon*, and similar | Brand portal → **Shop page** section, scrolled to the bottom. **Not in setup** | **No.** Faire publishes definitions and makes the brand *"responsible for complying with the definitions and guidelines"* and with applicable law | Chips on the brand profile; **filterable** — retailers search by them |
| **Etsy** | Ownership attributes — women-owned, Black-owned, Latinx-owned, Asian-owned, Native-owned, LGBT-owned, veteran-owned | A tag on the shop profile | **No.** Self-declared | Drives inclusion in search and curated collections |
| **B Corp** | Certified B Corporation | External certifying body, paid assessment | **Yes — third party** | A licensed mark |

**The mechanics are consistent across the self-declared ones:**

- Claimed in a **settings surface after setup**, never in the create flow.
- Rendered as **chips near the name**, not as a section.
- **Unverified**, with the platform publishing definitions and pushing accountability onto the claimant rather than checking.
- Their value comes from being **filterable** — a tag nobody can search by does very little work.
- **B Corp is the counter-example and the boundary marker.** The moment a badge is verified it needs a certifying body, an appeals path, and a revocation path. We are not building that.

**What this means for ours — and it answers [`decision-producer-values-declaration.md`](decision-producer-values-declaration.md) § 4.**

That decision left the shape open: *free text, a fixed set, or tags.* The comparables all use a **fixed set**, because fixed sets filter. **Recommend free text anyway, for v1, for a reason that does not apply to Faire or Etsy:**

> A fixed set requires the platform to author the list of values a producer may claim. For *handmade* and *woman-owned* that list is commercially neutral. For a **political** declaration it is the platform deciding which politics are on the menu — which is a cousin of the harm the never-sourced constraint exists to prevent. Free text keeps the platform out of authoring the vocabulary.

**Accept the cost explicitly: free text is not filterable, so the values declaration does no discovery work in v1.** It is a thing you read on a profile, not a thing you search by. That is the correct trade at sixteen items, and a tag layer can be derived later from what producers actually write — the same derive-don't-invent move [`decision-producer-values-declaration.md`](decision-producer-values-declaration.md) § 3 already made for the report taxonomy.

**Carry from Faire regardless of shape:** publish a short definition line next to the field, and place the claim in the **editor, not the create flow**.

---

## 5. Time to first listing

Steps from "I want to sell" to something a stranger can load.

| Product | Steps | Publicly visible after | Notes |
|---|---|---|---|
| **Our retired vendor form** | **1 page** | **~90 seconds** | One scroll, whole ask visible, live on submit. **Fastest in the set** |
| **Substack** | **3** | **minutes** | Name, URL, one-liner → publication is live |
| **Nextdoor** | 3 + verification | same day | Page exists at claim; categories/logo after |
| **Bandcamp** | ~4 | minutes | Page exists; bio/photo/banner edited after |
| **Faire** | ~6 | after brand review | Value tags and polish come later, in the portal |
| **Airbnb** | **10**, in three phases | after 5 photos | Photo gate is the long pole |
| **Etsy** | ~6 | after **payment + billing + ID verification** and one photo | Publishing is gated behind money and identity |
| **Google Business Profile** | 4 | **days** — video verification since postcards retired | Slowest by an order of magnitude |

**The finding that matters: we already built the fastest flow in the comparable set, and we replaced it with a five-step walkthrough.** ([`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 5.1.) The walkthrough ships and its evals are green, so **this is not a v1 reversal** — but it is the number to defend. Every field added to the create path is spent against a 90-second baseline our own users once had.

---

## 6. Proposed v1 boundary

**Principle: publish is cheap, completion is nagged.** Nothing below gates going live except a name.

### 6.1 Field list

| Field | Required | Where | When | Source |
|---|---|---|---|---|
| Shop name | **✓** | Create — step 1 | Create | ships |
| **Tagline** (≤120, live counter) | — *(strongly prompted)* | Create — step 1, beside the name | Create | **new** `group_businesses.tagline` — [prior art § 2.1](audit-vendor-prior-art.md) |
| Metro / anchor Location | **✓** | Create | Create | ships |
| About (long) | — | Create step 3 **and** editor | Either | ships, becomes editable |
| Shop image | — | **Editor only** | After publish | **new** `group_businesses.image_url` (F056) |
| Values statement (free text, ≤280) | — | **Editor only** | After publish | **new** `group_businesses.values_statement` (F056) |
| Website + up to 2 handles | — | **Editor only** | After publish | **new** — flat text, URL-shape check only |
| Item photo | — *(first field in the composer)* | Item composer | Per item | F055 |
| Item title / price / description / location | per F055 | Item composer | Per item | ships |

**Nine fields. One required beyond what ships today.**

### 6.2 Step sequence

1. **You → Start something → Sell something.** The become-a-producer action. No toggle, no column — the producer state is derived from shop existence, exactly as [F057](scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md) specs it.
2. **The existing five-step walkthrough, plus tagline on step 1.** Name and tagline are one question — *what is it called and what is it* — and belong on one screen.
3. **Publish. The shop is live** with a name, a tagline, and a metro. No photo, no values, no links, no verification.
4. **You now shows the shop row** with *Edit shop* and *Add a product · service · gathering*.
5. **The five-box checklist appears on the producer's own view** — photo · tagline · about · values · one published listing — each linking to the surface that fixes it.
6. **Editor and composer, in any order, forever.** Everything optional.

**Time to live: unchanged from today plus one text field.**

### 6.3 Explicitly out of v1

- **Any verification of anything** — no Tier 1/2 jurisdiction ladder, no certification, no document upload, no ID check.
- **A values taxonomy, values chips, or values filtering.** Free text only (§ 4).
- **Curated category selection** — *unless* the PM buys the half-day in [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md) § 4. **If not bought, drop the category facet from F045** rather than ship a filter over a dimension only seed data populates. Pick one; do not ship both halves broken.
- Street address anywhere; hoods; any distance display *(ratified)*.
- Support / oppose *(deferred)*; public counters of any kind.
- Analytics, sparklines, follower stats — `producer-tools.md` § Growth, b2.
- Bulletins — b2.
- Multiple photos, galleries, cropping beyond a fixed aspect, image reordering.
- Social-handle validation, oEmbed, link previews of the producer's own socials.
- Market schedule, curated market registry, "Next: Saturday" *(the mechanic — [prior art § 3.3](audit-vendor-prior-art.md))*.
- A percentage-complete meter. **Five booleans, not a score** — a score is a platform judgment rendered as a number.
- Slug re-derivation on rename.
- Re-architecting the five-step walkthrough into one page. Real, evidenced (§ 5), **and not v1**.

### 6.4 One addition the research argues for

**The OpenGraph image**, already carried in [prior art § 2.2](audit-vendor-prior-art.md) into F055. The comparables reinforce it: every product in the set treats the profile as a shareable object with a preview. Ours currently renders as a bare grey row in every messaging app, and sharing a link is our stated distribution channel. **Three `generateMetadata` additions reading a column F055 already populates.**

---

## 7. What transfers from the retired vendor code

Full extraction is in [`audit-vendor-prior-art.md`](audit-vendor-prior-art.md). The comparables research **confirms four carries and one leave**, and adds nothing new:

**Transfers — and the field agrees:**

- **The 120-char tagline.** Universal across comparables as the one-line description. Our strongest single carry.
- **The listing-health checklist.** Every comparable has one. Ours already existed, with repair links.
- **Recruitment-as-empty-state.** No comparable has this; it is our own best idea and it is the launch-density answer.
- **The contextual auth-gate modal.** Naming the specific thing you were trying to do.
- **The one-page speed** as a *standard to defend*, not a v1 rebuild.

**Does not transfer:**

- **`ownership_tier` / `OwnershipBadge`.** A platform-assigned judgment computed from data the business did not write — the exact inverse of every self-declared badge in § 4, and forbidden by the never-sourced constraint.
- **Required geocoded street address.** The outlier in the entire comparable set (§ 3).
- **The curated markets multi-select**, the old third-party `reports` shape, the one-listing cap, password auth.

---

## 8. Open questions for the PM

1. **Category — buy the half-day, or drop the F045 facet?** § 6.3. This one needs an answer either way; shipping neither is the only wrong option.
2. **Values shape — ratify free text?** § 4 answers [`decision-producer-values-declaration.md`](decision-producer-values-declaration.md) § 4 with a reason. `weigh` still owns the § 2 absolute.
3. **Tagline required or optional at step 1?** The retired form required it and every comparable asks for it. Proposed above as strongly-prompted-but-optional, on the publish-is-cheap principle. Requiring it is defensible.
