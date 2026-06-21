---
id: what-mehko-home-kitchen
purpose: Exploration of MEHKOs (Microenterprise Home Kitchen Operations) as an early-adopter producer segment, with Sacramento outreach playbook.
layer: what
status: exploration
---

# Exploration: MEHKO Home Kitchen Operations

> **Status:** Exploration, not spec. Grounded in web research (May 2026) and mapped against the platform's primitives. Companion to [`vetting-and-vouching.md`](vetting-and-vouching.md) — permit verification is the trust-signal thread that connects the two docs. Relevant use cases: P1 (producer creates profile + lists), P3 (variable cadence), P4 (locality badges), C1 (discovery feed).

---

## What MEHKOs are

A Microenterprise Home Kitchen Operation (MEHKO) is a food facility operated out of a private residence, authorized under California AB 626 (signed 2018, effective January 1, 2019). The law allows a resident to prepare, cook, and serve food to consumers directly from their home kitchen — effectively a legal home restaurant.

**Key regulations:**

- Up to 30 meals/day, 90 meals/week.
- Annual gross revenue cap of $100,000 (adjusted for inflation; ~$110,000 in 2026).
- Food must be prepared, cooked, and served on the same day — no batch-and-freeze.
- Operator must hold a food safety manager certification; all helpers must complete food handler training.
- Only one MEHKO per residence, and it must be the operator's primary home.
- No outdoor signage or advertising displays at the residence.
- Sales via delivery, takeout, or dine-in at the home. Third-party delivery (DoorDash, Uber Eats) is restricted or prohibited in most counties.
- Cannot sell at farmers markets, temporary events, or to other food facilities.
- Subject to initial inspection and routine follow-up inspections by county environmental health.

**Adoption status (May 2026):** ~19 jurisdictions (17 counties + Berkeley + Long Beach) have authorized MEHKO programs. Over 1,000 permitted MEHKOs operate statewide. LA County alone has issued 100+ permits. But adoption is a patchwork — major counties including Sacramento, San Francisco, and Orange still have no MEHKO program.

**Sacramento County specifically:** No MEHKO program. The Board of Supervisors has not voted to opt in. There is an active advocacy coalition (Sacramento County MEHKO Advocates, visible on Instagram) and a petition on Action Network calling for the county to begin issuing permits. The Alchemist Microenterprise Academy provides some support for food entrepreneurs, but through commercial kitchen incubators, not home-kitchen permits.

---

## Why MEHKOs matter to this platform

MEHKOs are the purest expression of the platform's thesis: a real person, making real food, in a real place, selling to real neighbors. They exercise the exact primitives the platform is built on and they are structurally underserved by every existing discovery channel.

**Alignment with principles:**

- **P1 (serves people).** A MEHKO operator is a person doing work — no corporate shell, no franchise, no middleman. The data model's refusal of impersonal Business entities (see [`../foundation/primitives.md`](../foundation/primitives.md)) is tailor-made for this producer segment.
- **P2 (materially better off).** MEHKOs create income for people who face barriers to traditional restaurant entry — immigrants, stay-at-home parents, people with disabilities, retirees. The COOK Alliance reports roughly a third of early operators were first-generation immigrants.
- **P4 (circulate wealth).** Every dollar spent at a MEHKO stays hyperlocal — the operator lives in the neighborhood where they sell. This is the tightest possible wealth-circulation loop.
- **P7 (bad actors fail).** The permit system provides a government-verified trust anchor the platform can surface without building its own verification infrastructure.

**Alignment with the loops:**

- **Loop 7 (Buy close).** A MEHKO is the closest possible purchase — literally from a neighbor's kitchen.
- **Loop 8 (Follow what you love).** MEHKO operators have small, passionate followings. The platform's follow-and-notify substrate is exactly what turns a word-of-mouth customer into a retained one.
- **Loop 9 (Make a living locally).** MEHKOs are micro-businesses with a $110K revenue cap — the definition of making a living locally.

---

## How MEHKOs map to the primitives

| Primitive | MEHKO mapping |
|---|---|
| **Person (Member)** | The MEHKO operator. Holds the permit. Prepares the food. Is the business. |
| **Item (kind='product')** | Each dish or menu offering. Posted daily or on the operator's cadence. Price, dietary info, allergen tags, pickup window. |
| **Item (kind='gathering')** | A dine-in evening or pop-up meal event at the operator's home — a gathering where the food IS the gathering. |
| **Group (kind='business')** | The operator's kitchen brand ("Rosa's Tamales," "Auntie's Filipino Kitchen"). Optional — an operator could list Items directly as a Member. But the Group gives them a brandable page, a clean URL, and a follower surface. |
| **Location** | The operator's home (as a Location of kind='area' or approximate point — never street address, consistent with the doxxing-prevention design in `business-jurisdiction.md`). Pickup radius. Delivery area. |

**The variable-cadence fit (P3).** MEHKOs are the quintessential variable-cadence producer. They don't cook every day. They cook when they have ingredients, energy, and orders. The platform's Item composer with irregular cadence — "I have tamales today, pickup 5–7pm" — is built for exactly this pattern. The bulletin push-to-followers substrate (b2) completes the circuit.

**The locality-badge fit (P4).** A MEHKO operator is, by legal definition, cooking in their primary residence. Tier 0 self-attested "Locally Owned" and "Locally Made" are both trivially true. The permit itself is a stronger signal than self-attestation — it's government-verified locality. This is the natural first case for a "Permitted" badge tier that sits between self-attested (Tier 0) and community-attested (Tier 1).

---

## What the platform could offer MEHKO operators

### Discovery and findability

This is the acute pain point. MEHKO operators face a structural discovery problem:

- No outdoor signage allowed (regulation).
- Cannot sell at farmers markets or temporary events (regulation).
- Third-party delivery platforms (DoorDash, Uber Eats) restricted or prohibited (regulation).
- No dedicated discovery platform exists at scale. COOK Connect (the nonprofit marketplace from COOK Alliance, formerly Foodnome) is the closest, but it's invitation-only and small. MEHKO Finder is a directory but not a transactional or social platform.
- Most operators rely on Instagram, Facebook, word-of-mouth, and neighborhood group chats.

**What the platform does:** a locality-first page at a clean URL (`/p/sacramento/oak-park/g/rosas-tamales`) that appears in the awareness feed for every Member whose place-interests include Oak Park or Sacramento. The operator doesn't need to master social media algorithms. They need to declare "I have tamales today" and have it reach the people who live nearby and care.

The QR card (shipping at Phase 2) is especially valuable here — an operator can hand a printed card to a pickup customer that resolves to their Group page. The customer follows; the next time tamales are available, they know.

### Trust signals

Consumer trust is the second-biggest barrier after discovery. People are wary of buying food from a stranger's home kitchen. Current trust signals are weak: word-of-mouth, Instagram follower count, maybe a photo of a permit taped to a wall.

**What the platform does:**

- **Permit verification badge.** The operator's MEHKO permit number is a public, verifiable fact. The platform can surface a "Permitted Home Kitchen" badge — initially self-attested (Tier 0: operator enters their permit number), later verifiable against county records if public APIs or FOIA data become available. This connects directly to the [`vetting-and-vouching.md`](vetting-and-vouching.md) exploration — the permit is a Tier 3 (researched/documented) trust signal that doesn't require community attestation to be meaningful.
- **Inspection status.** Counties that run MEHKO programs conduct inspections. If inspection results are public (as restaurant inspections are in many counties), the platform can surface "Last inspected: [date]" as a factual signal.
- **Community vouching.** The vetting-and-vouching system's vouch mechanic — "I've eaten Rosa's tamales, they're excellent, her kitchen is spotless" — provides social proof that compounds over time. First-hand-experience vouches (Tier 1) from repeat customers are the richest signal.
- **Allergen and dietary transparency.** Structured fields on each Item: ingredients list, common allergens (nuts, dairy, gluten, shellfish), dietary tags (vegan, halal, kosher, gluten-free). This is a trust signal in itself — a producer who takes the time to list allergens signals care and professionalism.

### Menu and item listing

MEHKO menus change daily. The operator cooks what's available, what's in season, what they feel like making. The platform needs to support this cadence without making the operator maintain a static catalog.

**What the platform does:**

- **Daily-menu composer.** A lightweight Item creation flow: "What are you making today? → Title, description, price, pickup window, dietary tags → Post." One screen, under 60 seconds. The Item is a daily declaration, not a catalog entry.
- **Recurring favorites.** Items the operator makes regularly can be saved as templates and re-posted with one tap. "Rosa's Tamales (pork, chicken, or veggie) — $15/dozen" is a template; she activates it on the days she cooks.
- **Photos.** Food is visual. The composer should make photo upload frictionless. A good photo of today's tamales is worth more than any written description.

### Order coordination

MEHKO operators handle orders informally — DMs on Instagram, text messages, sometimes a Google Form. This works at 10 orders/day; it breaks at 30.

**What the platform could do (later, not now):**

- **Pickup-window declaration.** The operator sets "Pickup today 5–7pm at [approximate location]." Members who order see the window.
- **Simple order intent.** Not a cart-and-checkout system (that's Shopify territory and violates the Won't in `product/needs/producer-roadmap.md` §2). Instead: "I want 2 dozen tamales" → the operator confirms or adjusts → the Member picks up and pays in person (cash, Venmo, whatever the operator prefers). The platform coordinates intent; it doesn't process payment at b1.
- **Delivery radius.** The operator declares "I deliver within 3 miles." Members within the radius see a delivery option; others see pickup only.

### Community among MEHKO operators

MEHKO operators are isolated. They work alone in their kitchens. They don't have a break room, a trade association local chapter, or a supply chain. The challenges they face — sourcing ingredients at small scale, navigating permit renewals, marketing without signage — are shared.

**What the platform does:**

- **kind='practice' Group for home cooks.** A Group where MEHKO operators in the Sacramento region share tips, coordinate bulk ingredient purchases, swap recipes, discuss permit issues, and mentor new operators. This is Loop 1 (Find your people) applied to producers.
- **Collective purchasing.** A group of 10 MEHKO operators buying flour, oil, and packaging together gets better pricing than any one of them buying alone. The platform doesn't need to build procurement tooling — it needs to provide the Group surface where the coordination happens. The operators organize the buy; the platform hosts the conversation.
- **Peer mentorship.** An experienced operator who's navigated the permit process, built a customer base, and figured out same-day-prep logistics is invaluable to a new operator. The platform surfaces these connections through Group membership.

---

## Outreach strategy: finding and recruiting MEHKO operators in Sacramento

### The Sacramento paradox

Sacramento County hasn't authorized MEHKOs yet. This is both a constraint and an opportunity:

- **Constraint:** There are no permitted MEHKO operators in Sacramento to recruit today.
- **Opportunity:** There are home cooks in Sacramento who ARE selling food informally (through Instagram, Facebook groups, word-of-mouth) and who WOULD get permitted if the county allowed it. These are the early adopters. They're already doing the work without the legal framework. They're the most motivated potential users of a platform that makes their work findable and legitimate.

Additionally, there are permitted MEHKO operators in nearby counties (Riverside, San Bernardino, Solano, Contra Costa, Alameda) who could be early platform users and proof points.

### Outreach playbook

**Phase A — Pre-MEHKO Sacramento (now)**

1. **Find the informal home cooks.** They're on Instagram (search #SacFood, #SacFoodie, #HomeCookedSac, #SacTamales, #SacramentoFood + home cook variations). They're in Facebook groups (Sacramento Food Scene, Oak Park Community, specific ethnic community groups). They're on anonymous neighborhood apps. They take orders via DM and text.

2. **Join the advocacy.** The Sacramento County MEHKO Advocates Coalition is active on Instagram. The Action Network petition for Sacramento MEHKO authorization is live. The platform should be visibly supportive of MEHKO legalization in Sacramento — not as a political statement, but as a practical alignment: the platform exists to serve these producers, and the permit system is the trust anchor that makes it work.

3. **Partner with COOK Alliance.** The COOK Alliance is the nonprofit that championed AB 626, runs COOK Academy (training for aspiring MEHKO operators), and operates COOK Connect (the nonprofit marketplace). They are not a competitor — they're an advocacy and education organization. The platform offers something COOK Connect doesn't: locality-first discovery embedded in a broader community platform. Partnership shape: the platform recommends COOK Academy to aspiring operators; COOK Alliance recommends the platform to permitted operators seeking local customers.

4. **Connect with the Alchemist Microenterprise Academy.** Sacramento's existing food-entrepreneur incubator. They serve a related but different population (commercial kitchen users, not home kitchen operators). They know who the aspiring food entrepreneurs in Sacramento are.

5. **Identify adjacent-county operators.** Solano County (authorized), Contra Costa County (authorized), and Alameda County (authorized) are all within the Sacramento metro commute shed or close to it. Operators in these counties can be early platform users and proof-of-concept case studies.

**Phase B — When Sacramento authorizes MEHKOs**

6. **County permit records as a lead source.** When Sacramento opts in, permit applications become public-ish records. The county environmental health division will have a list of applicants and permitted operators. This is the cleanest lead source — every name on that list is a home cook who has invested time and money in getting legal. The platform's value proposition (discovery, findability, trust signals) is most compelling to someone who just got permitted and is asking "now how do I find customers?"

7. **First-week onboarding blitz.** When the first Sacramento MEHKO permits are issued, the platform should be ready with: a "Sacramento Home Kitchen" launch page, a Group for Sacramento MEHKO operators, and direct outreach to every newly permitted operator with a specific offer: "Set up your page in 5 minutes. Here's your QR card. Your neighbors are looking for you."

8. **Local media tie-in.** Sacramento's first legal home restaurant is a story. The Sacramento Bee, Sactown Magazine, local TV — they'll cover it. The platform should be part of that story as the place where you find these home cooks.

**Phase C — Ongoing recruitment**

9. **Operator-to-operator referral.** The most credible recruiter for a MEHKO operator is another MEHKO operator. Build a referral program: when Rosa signs up and her neighbor Maria asks "how do I get on there?", Rosa can send an invite link. The platform tracks the referral for community-building context (not for a referral bonus — that's an engagement-optimization pattern).

10. **Community events.** Host or sponsor a "Home Cook Showcase" — a pop-up event where MEHKO operators serve samples and the platform provides the QR cards and Group pages. This exercises Loop 4 (Gather regularly) and creates a natural onboarding moment.

### The lead-with value proposition

Different for different audiences:

| Audience | Lead message |
|---|---|
| **Permitted MEHKO operator** | "Your neighbors are looking for exactly what you make. Get a page, get found, get followed." |
| **Informal home cook (pre-permit)** | "When Sacramento authorizes home kitchen permits, you'll want customers ready. Start building your following now." |
| **COOK Alliance / advocacy orgs** | "We're building the discovery layer your operators need. Let's make sure every permitted cook is findable." |
| **Customers / eaters** | "Want to eat your neighbor's cooking? Follow home cooks in your area and know the moment they're serving." |

---

## Connection to vetting-and-vouching

The MEHKO permit is the strongest near-term case for the trust-signal infrastructure explored in [`vetting-and-vouching.md`](vetting-and-vouching.md):

- **The permit is a Tier 3 (researched/documented) signal** — a government-issued authorization that can be verified against county records. Unlike self-attestation or community vouching, it has an external authority backing it.
- **Inspection records are a recurring trust signal** — not a one-time badge but an ongoing stream of verified compliance.
- **Community vouching layers on top.** The permit says "this kitchen passed inspection." Community vouches say "this food is amazing, the portions are generous, Rosa remembers your order." The two signals are complementary, not redundant.
- **The "Permitted Home Kitchen" badge** is the natural first instance of a verification tier that sits between Tier 0 (self-attested) and Tier 1 (community-attested). It's document-backed but doesn't require the full document-upload ladder designed in `business-jurisdiction.md` — the permit number itself is the evidence.

This suggests an amendment to the badge/trust-signal architecture: a "Permit" tier (Tier 0.5 or a named variant) where the claim is "I hold permit #X from [County]" and the platform surfaces this alongside the Locally Owned / Locally Made badges. Design-time question for `explore` when the trust-signal architecture is specced.

---

## What's buildable now vs. later vs. won't do

### Now (Phase 2 surfaces serve this)

- **Business Group page** for the MEHKO operator at a clean URL. Ships.
- **Product Items** for menu offerings with price, description, location. Ships.
- **Gathering Items** for dine-in events. Ships.
- **Locality badges** (Tier 0 Locally Owned, Locally Made). Ships.
- **QR card** for any Item — the farmers-market-equivalent onboarding affordance. Ships.
- **Follow substrate** — customers follow the operator's Group. Ships.
- **Awareness feed** — the operator's Items appear for Members with matching place-interests. Ships.

### Later (b2+)

- **Bulletin push to followers.** "I'm cooking tamales today, pickup 5–7pm." This is the killer feature for MEHKO operators but it's b2 per `producer-tools.md`.
- **Permit verification badge.** Requires the trust-signal architecture from vetting-and-vouching to be specced and built.
- **Community vouching on MEHKO operators.** Requires the C5 attestation surface.
- **Daily-menu template system.** Recurring-Item templates for operators who make the same dishes on a regular rotation.
- **Order-intent coordination.** Lightweight "I want X" → operator confirms flow. Not a cart. Not checkout.
- **MEHKO operator practice Group** with collective-purchasing coordination.
- **Allergen and dietary structured fields** on product Items (could be Phase 2 if the Item composer supports it; otherwise b2).

### Won't do

- **Payment processing.** The platform coordinates; the operator handles payment (cash, Venmo, Zelle, whatever they prefer). Per `product/needs/producer-roadmap.md` §8 — platform payment rails are b2+, and even then MEHKOs may prefer their existing payment methods.
- **Order management / POS system.** That's Square or Toast territory. The platform is a coordination layer.
- **Delivery logistics.** No route optimization, no driver dispatch, no delivery-app integration. The operator delivers themselves or the customer picks up.
- **Menu compliance checking.** The platform does not verify whether a MEHKO operator's menu complies with food safety regulations. That's the county's job.
- **Permit application assistance.** The platform surfaces trust signals from existing permits. It doesn't help people get permitted — that's COOK Alliance's and COOK Academy's role.

---

## Concrete scenario: Rosa in Oak Park

Rosa lives in Oak Park, Sacramento. She makes tamales — pork, chicken, and vegetarian — from recipes her grandmother taught her. She's been selling informally through Instagram for two years. Her followers are mostly people who've eaten her tamales at neighborhood gatherings and their friends. She takes orders via DM, cooks to order, and does porch pickup from her house.

**Her problems:**

- She can't grow beyond ~200 Instagram followers because the algorithm doesn't surface local food content to local people.
- New neighbors who'd love her tamales don't know she exists.
- Every customer asks "is this safe? do you have a permit?" and she has to explain AB 626 and the fact that Sacramento County hasn't opted in yet.
- She spends 2 hours a week managing DM orders and loses track of who ordered what.
- She'd love to connect with other home cooks — she has questions about sourcing masa at bulk pricing — but doesn't know any.

**What happens when Sacramento authorizes MEHKOs and Rosa gets her permit:**

1. Rosa creates a Member account. Sets Oak Park as her home Place.
2. Rosa creates a kind='business' Group: "Rosa's Tamales." Clean URL: `/p/sacramento/oak-park/g/rosas-tamales`. She uploads a photo of her tamales as the Group avatar.
3. Rosa claims Locally Owned (Tier 0 — she lives in Oak Park). She claims Locally Made (Tier 0 — she cooks in Oak Park). She enters her MEHKO permit number.
4. Rosa posts her first Item: "Pork Tamales — $15/dozen. Pickup today 5–7pm. Contains: pork, corn, lard. Allergens: none of the big 8." The Item appears in the awareness feed for every Member whose place-interests include Oak Park.
5. A neighbor three blocks away — a Member who set Oak Park as their home and tagged "food" as an interest — sees Rosa's tamales in their feed. They've never heard of Rosa. They tap through to her Group page, see the Locally Owned badge, the permit number, and three vouches from other Members who've eaten her food. They place a text order (or use whatever coordination the platform offers) and pick up tamales at 6pm.
6. The neighbor follows Rosa's Group. The next time Rosa posts tamales, the neighbor gets notified.
7. Rosa prints her QR card and tapes it to the bag when customers pick up. The card resolves to her Group page. Customers scan, follow, and come back.
8. Rosa joins the "Sacramento Home Cooks" practice Group. She finds out three other MEHKO operators in the Arden area buy masa from the same supplier and split bulk orders. She joins their next buy and saves 30% on her biggest ingredient cost.
9. Over six months, Rosa's follower count grows from 200 (Instagram ceiling) to 600 (platform + Instagram combined). Her weekly order volume doubles. She's hitting the 30-meals/day cap on Saturdays.

**What Rosa DOESN'T need from the platform:** a POS system, a delivery service, a payment processor, a menu compliance checker, or an advertising budget. She needs to be findable by the people who live near her and want what she makes. That's the platform's job.

---

## Open questions

1. **Sacramento MEHKO timeline.** When will Sacramento County authorize MEHKOs? The advocacy coalition is active but there's no public timeline. The platform's MEHKO strategy is partly contingent on this. Mitigation: start with adjacent-county operators and informal Sacramento home cooks; be ready when the county moves.

2. **Permit verification mechanics.** How does the platform verify a self-attested permit number? Options: manual spot-check against county records, FOIA/public-records request for permitted operator lists, API integration if counties publish permit data (unlikely near-term). The cheapest first step is self-attestation with a "Claimed" label (consistent with Tier 0 badge labeling) and a flag for community challenge if someone disputes it.

3. **Dine-in events and liability.** A MEHKO operator hosting a dine-in meal at their home is a gathering. The platform surfaces it as an Item of kind='gathering'. Does the platform need to surface any liability disclaimers? The operator's permit covers food safety; premises liability is the operator's responsibility. The platform should not insert itself into this — but should it disclaim? Design-time question.

4. **Same-day preparation constraint.** The MEHKO regulation requires food to be prepared and served on the same day. This means menu items can't be posted days in advance with a "pre-order" flow — the item is only real on the day it's cooked. The daily-menu composer pattern handles this, but the platform should not encourage pre-orders that might push operators into regulatory non-compliance.

5. **Cottage Food Operations overlap.** California also has the Cottage Food Operations law (AB 1616 / AB 1510) which allows shelf-stable foods (jams, baked goods, dried herbs) to be sold from home with fewer restrictions. Some producers hold both a Cottage Food permit and a MEHKO permit. The platform should handle both badge types without confusion.

6. **Scale ceiling.** MEHKOs have a legal cap (~$110K revenue, 90 meals/week). A successful MEHKO operator will hit this ceiling. What then? The platform can surface the path: commercial kitchen (the Alchemist Academy), food truck, brick-and-mortar. But the platform doesn't build tools for the transition — it hosts the operator wherever they are on that journey.

---

## Research sources

- [mehko.org](https://mehko.org/) — community information hub for MEHKO operators
- [CDPH MEHKO Program](https://www.cdph.ca.gov/Programs/CEH/DFDCS/Pages/FDBPrograms/FoodSafetyProgram/MicroenterpriseHomeKitchenOperations.aspx) — California Department of Public Health official page
- [COOK Alliance](https://www.cookalliance.org/) — nonprofit advocacy org, runs COOK Connect marketplace and COOK Academy
- [COOK Connect / Foodnome](https://foodnome.com/) — nonprofit marketplace for home-cooked food
- [MEHKO Finder](https://mehkofinder.com/) — directory of permitted MEHKOs across California
- [MEHKO county authorization list](https://mehko.org/list-california-counties-mehko-accepting-applications/) — which counties have opted in
- [The Food Corridor — MEHKOs in 2026](https://www.thefoodcorridor.com/blog/mehkos-2026-2/) — status report
- [CAMEO Network](https://cameonetwork.org/news/supporting-micro-enterprise-home-kitchens/) — microenterprise support org
- [Sacramento County MEHKO petition](https://actionnetwork.org/petitions/allow-the-sale-of-home-cooked-meals-in-sacramento-county) — Action Network advocacy petition
- [Chase Law Group — MEHKO expansion](https://chaselawmb.com/california-mehko-expansion/) — legal overview of AB 377 expansion
- [Civil Eats — Home chef legalization](https://civileats.com/2020/06/30/its-now-legal-for-home-chefs-in-california-to-sell-meals-will-more-cities-get-on-board/) — journalism on early MEHKO adoption
- [Institute for Justice — Homemade food in CA](https://ij.org/issues/economic-liberty/homemade-food-seller/california/) — legal landscape overview
