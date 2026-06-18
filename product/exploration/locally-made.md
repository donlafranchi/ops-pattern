---
id: what-locally-made
purpose: Exploration of "Locally Made" provenance badge — what it means, which product categories it fits, and how it graduates from self-attestation to verified.
layer: what
status: draft
---

# Exploration: Locally Made

> **Status: exploration, deferred from F039 (2026-06-06).** The proximity model (branch `t-f039`, T099–T101, 6/6 eval GREEN, not merged) answers a geographic question. The real question is about provenance and trust — and that varies by product type. This doc surfaces the questions and proposes directions. It does not lock in decisions.

## The problem

"Locally Made" sounds binary — either someone made this thing here, or they didn't. In practice it's a spectrum.

A jar of honey harvested from backyard hives in Oak Park is unambiguously locally made. A dining table built in a Sacramento garage from lumber sourced at Home Depot (which sources globally) is locally made by any reasonable definition — the craft happened here, the supply chain didn't. A screen-printed t-shirt where the blanks come from Bangladesh and the printing happens in Midtown is locally made in the way that matters to most buyers. A batch of "artisan" candles poured from a kit with pre-mixed wax, pre-tabbed wicks, and pre-blended fragrance oils — all shipped from a warehouse in New Jersey — is harder to call.

The platform needs a framework that:

1. Gives honest producers a way to say "I made this here" and be believed.
2. Doesn't demand supply-chain traceability that even Fortune 500 companies can't deliver.
3. Distinguishes meaningful differences (baked in my kitchen vs. drop-shipped from Shenzhen) without creating a bureaucracy.
4. Serves the buyer who specifically wants to support local makers — Loop 7 (Buy close) and Loop 9 (Make a living locally).

The F039 deferral recognized that a single `made_at_place_id` field plus a proximity test is a sound foundation but an incomplete story. The field answers *where*. This doc explores *what "where" means* across product categories, and proposes the layered framework that makes the badge trustworthy.

## What "Locally Made" actually certifies

Before analyzing categories, nail down the claim. The badge certifies one thing:

> **The final product was made, assembled, or crafted by this person (or their team) within the declared Place.**

What it does NOT certify:

- That every input material was locally sourced. (A baker uses flour from Kansas. A woodworker uses lumber from Oregon. That's normal commerce.)
- That the seller grew, raised, or harvested the raw inputs. (Unless the product *is* the raw input — produce, honey, eggs.)
- That the product was designed locally. (Design provenance is a different, lower-trust signal — interesting but separate.)
- That the seller is a local resident. (That's the "Locally Owned" badge, which runs on `member_business_jurisdictions`. Two badges, two substrates, never collapsed.)

**The line is labor and craft, not supply chain.** If the meaningful transformation — the thing that makes this product what it is — happened at the declared Place, the badge applies. The sourdough was baked here. The table was built here. The shirt was printed here. The honey was harvested here. The candle was poured here.

This matches how real people think about it. When someone buys "locally made soap" at a farmers market, they understand the lye and oils weren't mined in the parking lot. They care that the person standing behind the table made the soap.

### Where the line gets tested

The hard cases aren't about materials. They're about how much transformation counts:

- **Assembly from a kit:** Someone buys a candle-making kit, follows the instructions, sells the result. The labor is local but the craft is debatable. The platform's position: self-attestation still applies. If your hands assembled it, you can claim it. The community-attestation tier (b2+) is where buyers push back if the "making" feels hollow.
- **Print-on-demand / customization:** A designer uploads art to a print-on-demand service. The shirt ships from a warehouse in another state. The design is local; the product isn't. The platform's position: this is not locally made. The physical product was not made at the declared Place. The designer could claim "Designed in Sacramento" as a future provenance signal, but not "Made in Sacramento."
- **Multi-step production across places:** Cheese aged in one county from milk produced in another. Furniture rough-cut in one shop, finished in another. The platform's position at Tier 0: the `made_at_place_id` points to wherever the final product took its finished form. One Place per Item. Multi-place provenance chains are a Tier 2+ problem.

## Product categories

Not all product types relate to "locally made" the same way. Some are clean fits. Some have gray areas. Some don't need the badge at all.

### Clean fits — badge applies naturally

**Baked goods, preserves, and prepared foods.** The clearest case. The transformation (baking, canning, cooking, fermenting) happens in a specific kitchen at a specific place. Inputs are commodity (flour, sugar, jars) — nobody expects them to be local. The badge says "made in this kitchen." Buyers care intensely about this for food. *Now.*

**Farm produce, eggs, honey, and nursery goods.** The product *is* the local output. Grown here, harvested here. The badge is almost redundant — the farmers market context already implies it — but on a digital platform where the market context is absent, it matters. Radius questions come up (a farm 40 miles outside town — is that "local"?), but the `made_at_place_id` pointing to the farm's Place handles this cleanly. *Now.*

**Soaps, candles, and body products.** Similar to baked goods — the transformation (pouring, curing, blending) is the product. Inputs are commodity. Clean fit for the badge. The kit-assembly gray area lives here but doesn't block Tier 0 self-attestation. *Now.*

**Ceramics and pottery.** Unambiguous. Clay is shaped and fired at a specific place. The craft is inherently local to the studio. *Now.*

**Art (original works).** Paintings, sculptures, prints pulled from the artist's own plates — the work was made at the artist's studio. Clean fit. *Now.*

**Furniture and woodworking.** The craft happens in a specific shop. Lumber sourcing is irrelevant to the badge (see "labor and craft, not supply chain"). A table built in a Sacramento garage is locally made in Sacramento, full stop. *Now.*

### Solid fits with minor gray areas

**Textiles — handmade (knitting, quilting, weaving, sewing from raw fabric).** The garment or quilt was made by this person at this place. Clean. The fabric itself was probably manufactured elsewhere — same as flour for a baker. Badge applies. *Now.*

**Jewelry and metalwork.** Handmade jewelry (soldered, forged, cast, beaded) is a clean fit. The gray area: assembled-from-components jewelry (buying pre-made bezels and findings, setting a stone). Still locally made by the "labor and craft" standard — the assembly and design judgment happened here. *Now.*

**Screen printing and custom apparel.** The blank garment comes from elsewhere. The printing, embroidery, or dyeing happens locally. This is the same pattern as a baker using commodity flour. The badge applies to the finished product. *Now.*

### Gray areas — badge applies but needs framing

**3D printing.** The printing happens locally. But if the design file was downloaded from Thingiverse and the only local labor was clicking "print" — is that "made"? The platform's position: if you own or operate the printer and the object came out of it at your place, you can self-attest. The community will sort out whether "I printed someone else's design" carries the same weight as "I designed and printed this." The badge doesn't distinguish; buyer reviews and community attestation (b2+) do. *Now, with the understanding that community norms will calibrate.*

**CNC milling, laser cutting, and digital fabrication.** Same pattern as 3D printing. The fabrication is local. The design may or may not be. Badge applies to fabrication provenance. *Now.*

**Art prints and reproductions.** An artist paints an original in their studio (locally made), then sells giclée prints produced by a print shop across town (still locally made? the print shop is local) or across the country (not locally made). The platform's position: the `made_at_place_id` is where the physical object was produced. If the print shop is local, the print is locally made. If the print shop is in another state, it isn't — even though the original art is local. The artist can note "Original painted in Sacramento" in the listing copy. *Now, but the distinction needs clear guidance in the composer flow.*

**Value-added resale (upcycling, refurbishing).** Someone buys thrift-store furniture and refinishes it. Buys vintage clothing and alters/repairs it. The transformation is local. Badge applies if the transformation is substantial enough that the seller considers it "made." Self-attestation handles this; community attestation refines it. *Now.*

### Does not apply — badge is irrelevant or misleading

**Resale, vintage, and thrift (unmodified).** The seller curates and sells goods they didn't make. "Locally Made" is false. "Locally Sold" or "Locally Curated" might be a future provenance signal, but it's not the same badge. The F039 scenario handles this correctly: a reseller who honestly declares "Made in Hanoi" gets the fact line with no local badge. Tier 0 doesn't punish honesty. *Never for this badge. Possible future "Locally Curated" signal.*

**Drop-shipped goods.** The seller never touches the product. It ships from a warehouse elsewhere. Not locally made by any definition. *Never.*

**Digital goods (templates, patterns, designs, fonts, presets).** No physical product. "Made" doesn't map to a Place in a meaningful way — a Figma template was "made" wherever the designer's laptop was. The badge is designed for physical provenance. *Never for this badge. "Designed by a local creator" is a possible future signal but a different concept entirely.*

**Services.** Services are inherently performed by a person at or near a place. "Locally Made" is meaningless for a haircut or a tax prep session — the service is local by definition. The badge only applies to `kind='product'` Items. *Never — not needed.*

**Gatherings (events).** Same reasoning as services. An event happens at a place. There's no provenance question. *Never — not needed.*

### Edge cases to defer

**Cottage food with commercial co-packing.** A home baker develops recipes at home but uses a commercial kitchen or co-packer for volume production. If the co-packer is local, the badge applies (the product is made locally, just not in the home kitchen). If the co-packer is out of state — the product is no longer locally made, even though the recipe is. This gets complicated and is a Tier 1/2 problem. *Later.*

**Franchise and licensed production.** A local franchise of a national brand "makes" the product locally (sandwiches, smoothies). Technically locally made. But the platform is people-first — a Subway franchise claiming "Locally Made" feels wrong even if technically accurate. The "Locally Owned" badge (via business-jurisdiction) is the right signal for franchises. Whether they also qualify for "Locally Made" is a community-norms question. *Later.*

**Agricultural products with complex provenance.** Wine (grapes from one region, crushed and bottled in another). Cheese (milk from farms in county A, aged in county B). Roasted coffee (beans from abroad, roasted locally). For all of these, the "final transformation" rule works: the wine is made where it's crushed and bottled, the cheese where it's aged, the coffee where it's roasted. But reasonable people disagree. *Now for self-attestation; community attestation (b2+) will refine.*

**Mixed-origin bundles.** A gift basket with some locally made items and some not. A meal kit with local produce and imported spices. The platform's position: the badge applies at the Item level, not the ingredient level. If the assembled basket/kit is the Item, and the assembly happened locally, the seller can self-attest. But this feels thin. *Later — needs design thought about whether baskets/kits need their own provenance model.*

## The two-tier geography concept

The F039 deferral and the `made_at_place_id` field already encode *where* something is made. The open question is how to frame the *distance* between maker and buyer.

### Tier A: Neighborhood-local ("Made in Oak Park")

The product was made within the viewer's locality — roughly the same city, town, or neighborhood cluster. This is the high-trust, high-value tier. It's the farmers market relationship digitized: you could, in principle, visit the maker's workshop.

How it works today: `items.made_at_place_id` points to a `places` row. The platform's place hierarchy (neighborhood → city → county → state) lets a viewer's `member_place_interests` determine proximity. If the made-at Place is within the viewer's local cluster, the "Locally Made" badge renders. If not, only the "Made in {Place}" fact line renders.

This tier is straightforward and already designed. It's the F039 implementation, paused but buildable.

### Tier B: Domestic-local ("Made in USA")

The product was made somewhere in the United States but not near the viewer. This is a different value proposition: it's about supporting American manufacturing, small-batch domestic production, and keeping dollars in the national economy.

This tier matters for categories where neighborhood-local is rare but domestic production is a meaningful differentiator: furniture (vs. imported flat-pack), textiles (vs. overseas fast fashion), electronics/hardware (vs. offshore manufacturing), and specialty tools.

**How it might work:** A second, distinct badge — not a fallback for failing the neighborhood test. "Made in USA" is its own claim with its own verification ladder. The FTC has existing guidelines for "Made in USA" claims (final assembly + "all or virtually all" processing in the US). The platform could align with or simplify those guidelines.

**When to build this:** Not now. The neighborhood-local tier is the wedge — it's what farmers markets and local maker communities care about. The domestic tier serves a broader audience but requires different verification logic and potentially different legal exposure. *Later — probably b2 or b3.*

### Why two tiers, not a spectrum

A continuous-distance model ("this was made 12.7 miles from you") is technically precise and emotionally meaningless. People think in categories: "from my town" vs. "from my country" vs. "from overseas." Two tiers match how people actually talk about provenance. The platform can add a third tier ("Made in {State}") if demand warrants it, but starting with two keeps the mental model simple.

## The supply chain honesty problem

The platform takes a clear position here: **the badge is about the maker's labor, not the maker's supply chain.**

This is the right call for several reasons:

**Full supply chain traceability is impossible for small producers.** A home baker doesn't know where the wheat in their flour was grown. A woodworker doesn't know which forest their lumber came from. A jeweler doesn't know which mine produced their silver wire. Requiring supply chain documentation would exclude exactly the people the platform exists to serve — while large companies with compliance departments could easily produce the paperwork.

**It's what buyers actually care about.** When someone buys "locally made soap" at a farmers market, they're supporting the person who made it. They're not auditing the provenance of the coconut oil. The buyer's mental model is "this person, in this community, made this thing with their hands and their skill." The badge should match that mental model.

**The alternative is dishonest.** If the platform required local sourcing for a "Locally Made" badge, almost no one would qualify. The badge would either be meaningless (never shown) or gamed (sellers lying about inputs). Neither serves anyone.

**Supply chain provenance is a *separate, harder* problem.** If the platform ever wants to surface "made with locally sourced ingredients" — that's a different badge, a different verification process, and a much higher bar. It's valuable (especially for food — "farm-to-table" is a real market signal), but it shouldn't gate the base "Locally Made" claim.

### The honest framing

The badge text and tooltip should make clear what's being claimed:

- **Badge:** "Locally Made" (or "Made in {Place}")
- **Tooltip / info text:** "This seller says they make this product in {Place}."
- **Tier indicator:** "Self-reported" (Tier 0) / "Buyer-confirmed" (Tier 1) / "Verified" (Tier 2)

No implication about ingredients or materials. No implication about "100% local." Just: the person who made this thing made it here, and here's how much evidence backs that claim.

## Verification roadmap

The verification ladder mirrors `business-jurisdiction.md` — same philosophy, same tier structure, applied to a different claim.

### Now: Tier 0 — Self-attestation (b1 substrate, surface deferred)

**What ships:** The `made_at_place_id` field on Items. The composer step that lets a seller pick a Place. The "Made in {Place}" fact line on the product page. The proximity-derived "Locally Made" badge for local viewers.

**What it means:** The seller says they made it here. The platform displays the claim with no additional evidence. Clean, honest, and useful for the majority of cases where the seller *is* telling the truth.

**Gaming risk:** Low-to-moderate. A seller could lie. But the incentive to lie is weak at Tier 0 — the badge is a soft signal, not a ranking factor or a conversion guarantee. And the consequence of being caught lying (at Tier 1, when buyers can challenge) is badge removal. The economics favor honesty.

**What categories are eligible:** All physical product categories in the "clean fits" and "solid fits" sections above. Self-attestation is the broad net. Gray areas are allowed — community norms refine.

### Later: Tier 1 — Community attestation (b2+)

**What ships:** Buyers who've transacted with a seller can confirm or challenge the "Locally Made" claim. A threshold of confirmations (exact number TBD) upgrades the badge to "Buyer-confirmed." A threshold of challenges flags the claim for review.

**What it means:** Other people who've actually bought this product believe the provenance claim. It's the same trust mechanism as eBay seller ratings applied to a specific claim.

**Design questions to resolve:**
- What's the confirmation threshold? (Probably low — 3–5 unique buyers.)
- Can a challenge remove a badge, or only flag it? (Probably flag — removal is a platform action, not a mob action.)
- Does attestation apply per-Item or per-seller? (Per-Item is more precise but higher friction. Per-seller is coarser but more practical. Probably per-seller with per-Item override.)

### Much later: Tier 2 — Document-supported (b3)

**What ships:** Sellers can upload supporting documentation — photos of their workshop, a cottage food permit with an address, a business license showing a local address. The platform stores the document; a review process (human or automated) upgrades the verification level.

**What it means:** The seller has provided evidence beyond their word and their buyers' word. Highest trust tier.

**Design questions to resolve:**
- What documents qualify? (Varies wildly by category. A cottage food permit is meaningful for a baker. A workshop photo is meaningful for a woodworker. A business license is meaningful for anyone. There's no universal document.)
- Who reviews? (Platform team? Community moderators? Automated checks? Probably a combination.)
- What's the cost? (Document review takes labor. Does the platform absorb it? Does the seller pay? Does the community subsidize it?)

This tier is genuinely hard and genuinely far away. But naming it now keeps the architecture honest — the `made_at_verification_source` enum already has the `document_supported` value reserved.

## What doesn't need this badge

Not everything on the platform has a provenance question. The badge applies narrowly:

**Services don't need it.** A service is performed by a person. If you hire a local plumber, the plumbing is inherently local. The "Locally Owned" badge (on the business Group) is the relevant signal — it says the money stays local. "Locally Made" is meaningless for a service.

**Gatherings don't need it.** An event happens at a place. There's no "where was this event made?" question. The event's Location *is* its provenance.

**Ideas, offers, asks, and initiatives don't need it.** These are coordination primitives, not physical goods. Provenance doesn't apply.

**The badge is for `kind='product'` Items only.** This is already encoded in the F039 scope and the `item.md` spec. The composer step for `made_at_place_id` only appears in the product creation flow.

## Open questions

These need answers before the badge surface ships. They don't need answers before the substrate ships (which is already built on `t-f039`).

1. **Radius for "locally made."** The F039 proximity model uses the platform's place hierarchy and `member_place_interests`. But how coarse is too coarse? If a seller declares "Made in Sacramento County" instead of "Made in Oak Park," the badge triggers for a much wider audience. Is that acceptable at Tier 0, or should the platform nudge toward specificity? Working instinct: accept any granularity the seller chooses, display it honestly ("Made in Sacramento County" vs. "Made in Oak Park"), and let buyers judge. The badge is a signal, not a certification.

2. **Composer UX for ambiguous categories.** When a seller creates a product in a gray-area category (3D printing, value-added resale), should the composer provide guidance? ("'Locally Made' means you made this product at this location. It doesn't require that all materials are locally sourced.") Or is that over-explaining? Working instinct: brief helper text in the composer, longer explanation in a help article.

3. **Badge interaction with "Locally Owned."** A seller could have "Locally Owned" (via business-jurisdiction) and "Locally Made" (via made-at-place), both, or neither. The UI needs to handle all four states cleanly. The two badges reinforce each other ("this local business makes its products here") but are independent claims. F037 (Locally Owned) and F039 (Locally Made) were designed as siblings — the surface needs to present them as such.

4. **The "Made in {Place}" fact line vs. the "Locally Made" badge.** F039 distinguishes these: "Made in {Place}" is always visible (a factual statement), while "Locally Made" only renders for proximal viewers (a contextual judgment). Is this distinction clear enough in the UI? Or will sellers be confused that their "Made in Oak Park" claim only shows the badge to some people? Working instinct: the distinction is correct and important — keep it. But the seller's dashboard should show how many viewers see the badge vs. the fact line.

5. **What happens when a seller moves?** Maya makes sourdough in Oak Park, then moves her operation to Roseville. Her existing products still say "Made in Oak Park." Should she update them? Should the platform prompt her? The `made_at_place_id` is per-Item, not per-seller, so this is technically handled — she updates each product's made-at when the reality changes. But the workflow needs design.

## Summary

"Locally Made" is a provenance badge about labor and craft, not supply chain. It applies to physical products (`kind='product'`), not to services, gatherings, or digital goods. It ships in tiers: self-attestation now, community attestation at b2+, document verification at b3. The substrate (`made_at_place_id`, `made_at_verification_source`) is already built on branch `t-f039`. The surface — badge UI, composer step, proximity logic — is the deferred work that this exploration informs.

The framework is: if the person who's selling this thing made it at the place they're claiming, the badge applies. Everything else — supply chain, input sourcing, kit assembly, design provenance — is either out of scope (for now) or a separate, harder problem (for later).

Most product categories are clean fits for Tier 0 self-attestation. The gray areas (3D printing, value-added resale, kit assembly) are manageable — self-attestation covers them, and community attestation refines. The "Made in USA" domestic tier is a real opportunity but a separate effort. Digital goods and unmodified resale don't qualify and never will.

The badge serves Loop 7 (Buy close) and Loop 9 (Make a living locally). It gives honest producers a way to be found by buyers who specifically want to support local makers. It gives buyers a signal they can trust — not because the platform verified every workshop, but because the verification ladder matches the evidence level and says so honestly.
