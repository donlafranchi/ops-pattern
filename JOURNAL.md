# JOURNAL.md — PM Reverse-Chronological Log

**Latest entries at top.** Start here every session to understand project state.

---

## 2026-04-09 — Community Accountability Model: BBB With Teeth

**What's Done:**
- Added `product/exploration/community-accountability-model.md` — the definitive interaction model
- Replaces "I visited here" entirely

**Key Decisions:**
- **❤️ Endorse** replaces visit/check-in. One tap, means "this business and its people are worth supporting." Not a visit, not a review — a stance.
- **Report a concern** replaces text notes. Structured around four pillars: Customers, Employees, Community, Planet. Private, never displayed individually. Pattern + volume triggers review.
- **Business Standing** system: Good Standing → Concerns Raised → Under Review → Questionable → Cleared. One person can never damage a business. Only verified concerns change standing.
- No public text, no reviews, no stars, no check-ins. Ever.

**b1 impact:** F005 "Visit Interaction" needs to become "Endorse + Report" in the bundle, capabilities, and scenarios. The founding scenarios (Maria's "I visited here" note) need updating to use the endorse model instead.

**Supersedes:** `community-signals.md` (earlier exploration, now outdated by this model)

---

## 2026-04-09 — Product Identity: We Are Not Yelp

**What's Done:**
- Added `product/exploration/business-accountability.md` — public record transparency (verifiable actions only, not opinions)
- Added `product/exploration/product-identity-what-we-are-not.md` — foundational product strategy doc

**Key Decision:**
Main Street Market classifies businesses by ownership structure and verifiable facts. It does NOT rate businesses on subjective experience. The one-line test: "Is this about structure/facts or opinions?" If opinions, it doesn't belong.

**Product Identity:**
- We are an ownership transparency platform, not a review platform
- Core unit = structure (who owns it), not opinion (was it good)
- No public reviews, no star ratings, no subjective comments — ever
- Behavior signals (if added in b3) must be private/aggregate or based on public records only
- Revenue must come from consumers, not businesses — selling visibility to businesses poisons trust

**Revenue direction:** Consumer subscription, city sponsorship, data licensing, incubator/food-network transaction fees. NOT Yelp-style pay-for-visibility.

---

## 2026-04-09 — New Ownership Tier: Mission-Driven

**What's Done:**
- Added 6th ownership tier: **Mission-driven** (warm purple) — for B Corps, public benefit corporations, and large companies with demonstrated commitment to customers/community (Patagonia, REI, Costco)
- Updated `product/systems/ownership-classification.md`, `product/products/ownership.md`, `product/foundation/founding-scenarios.md`

**Rationale:**
Not every big company is the enemy. Some are genuinely trying to do right — B Corp certified, registered as PBCs, or just consistently pro-customer. Consumers want to know about these too. They're not gold-pin independent, but they're not grey-pin extractive either. Warm purple = "honorable mention."

**Open Question:**
What qualifies? B Corp certification and PBC registration are verifiable. But companies like Costco have no formal certification — just reputation. Need clear criteria before b1 ships.

---

## 2026-04-09 — Exploration: Incubator + Local Food Network

**What's Done:**
- Added `product/exploration/small-business-incubator.md` — community demand signaling and crowdfunding for aspiring independent business owners. Demand signaling (no money) is b2, crowdfunding is b3.
- Added `product/exploration/local-food-network.md` — "know your farmer" infrastructure connecting consumers with local food producers. Strong b2 candidate.

**Key Decision:**
Local Food Network is a strategic priority for b2. The b1 data model and architecture MUST be built with extensibility toward food producers in mind. See ADR-2 in planning/DECISIONS.md. No b1 ticket should create a schema, category system, or business model that would require a rewrite to accommodate farms, ranches, and seasonal food producers.

**What Needs Attention:**
- Scenario Writer and Build Agent need to see ADR-2 so b1 implementation stays extensible
- Review b1 systems (business-data, ownership-classification) for food-network compatibility before writing scenarios

**What's Next:**
- Proceed to Scenario Writer for b1 MVP

---

## 2026-04-09 — Project Scaffolding

**What's Done:**
- Initialized project structure per agent pipeline template
- Created CLAUDE.md files (root, product, planning, development, web)
- Set up planning/AGENTS.md with four-agent pipeline
- Created planning/bundles/b1-mvp.md with MVP scope (F001–F005)
- Wrote 3 systems: map-system, business-data, ownership-classification
- Wrote 5 capabilities: map-search, business-detail-view, business-registration, shareable-listing, visit-interaction
- ADR-1: Tech stack — Next.js + Tailwind + Supabase + Mapbox + Vercel
- Copied founding scenarios to product/foundation/

**What Needs Attention:**
- Write product files to `product/products/` (one per major system)
- Populate product/foundation/ with mission and guiding principles
- Review systems and capabilities for completeness before scenario writing

**What's Next:**
1. Write product files for map, business data, ownership systems
2. Hand off to Scenario Writer to create scenarios for b1 MVP
3. PM reviews and approves scenarios (move to `planning/scenarios/`)
4. Evaluator writes tests
5. Ticket Writer creates tickets
6. Build Agent implements
