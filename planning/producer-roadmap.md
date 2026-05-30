---
id: how-producer-roadmap
purpose: Producer/seller/business capabilities organized by business function — the producer roadmap lens.
layer: what
status: active
---

# Producer Capability Taxonomy

**Date:** 2026-05-27
**Status:** Active. Updated as capabilities ship or scope changes.

**What this is.** Local businesses need to do specific things day-to-day. This doc organizes producer capabilities by business function — the categories a sole prop, maker, or small business owner thinks in. For each category: what the platform offers now (Phase 2), what comes later, and what we explicitly won't do (and why).

**How to read it.** Each category is one business function. Inside each: **Now** (ships with Phase 2), **Later** (planned for b2+), **Won't** (out of scope by design, with the reason).

**Companion docs:** [`use-cases.md`](use-cases.md) (situations these capabilities serve), [`phase-2-scenario-strategy.md`](../../planning/phase-2-scenario-strategy.md) (Phase 2 scenario ordering), [`../systems/producer-tools.md`](../systems/producer-tools.md) (Bulletin + Growth spec).

---

## 1. Presence & Findability

*Being found by the right people in the right place.*

**Now (Phase 2):**
- Business Group public page at a clean, place-scoped URL (`/p/.../g/[slug]`)
- Member public page at `/m/[handle]` showing Items and Group memberships
- Items appear in the locality-first awareness feed via place-interest × interest-tag matching
- QR card generation for any Item — print-quality PNG, resolves to canonical URL
- Place-scoped URLs (ADR-20) so every page is shareable and chalk-on-a-board-able

**Later:**
- `/explore` — the no-login locality-first browse index (Phase 3)
- LLM-enhanced search — natural-language queries like "sourdough near me Saturday" (b2+, per `discovery.md` T3)
- SEO-optimized public pages with structured data for Google (b2)
- Saved-search surface — members subscribe to filters like "new products in Oak Park" and get notified (b2)

**Won't:**
- Paid placement or advertising in feed or search results. The awareness feed ranks by locality + interest match, not by payment. Per `principles.md` — the platform never sells attention.
- Generic global directory listing. Every surface is locality-first. A producer without a Place anchor has no feed presence by design.

---

## 2. Product & Service Listing

*Declaring what you sell and making it browsable.*

**Now (Phase 2):**
- Product composer — title, description, price (or free), location attachment, optional Group filing
- Service composer — title, description, service area (radius-from-point), pricing model (flat/hourly/per-session/free)
- Item pages at kind-specific URLs (`/p/.../p/[slug]` for products, `/s/[slug]` for services)
- Items filed under a business Group resolve-up with the Group's brand name
- Items can also attach to a Member directly (sell as an individual, no Group required)

**Later:**
- Richer service fields — appointment availability, scope of work, prerequisites (b2+, per P5 deferral)
- Service-area polygon editor vs. radius-from-point (b2+)
- Item state management — draft/active/paused/archived lifecycle with surface controls (b2)
- Inventory / stock indicators — "3 left" or "sold out" (b2+)
- Scheduling view — aggregates upcoming Items across Locations for ambulatory producers (b2)
- Bundle / package Items — group related products or services together (b2+)

**Won't:**
- Full e-commerce catalog with variants, SKUs, and cart. The platform is a coordination layer, not a storefront. Producers who need deep catalog management use Shopify/Square and link from their Group page.
- Automated pricing or dynamic pricing tools. Price is the producer's decision; the platform stores and displays it.

---

## 3. Locality & Trust Signals

*Proving you're local and earning the badges that say so.*

**Now (Phase 2):**
- "Claimed local owner" badge — Tier 0 self-attested ZIP on the business Group; badge surfaces when viewer's locality is proximal
- "Claimed locally made" badge — Tier 0 self-attested Place on kind='product' Items; badge surfaces conditional on viewer place-interest proximity
- Badge labels reflect evidence tier honestly — "Claimed" at Tier 0, never "Verified"
- Edit / remove jurisdiction and provenance claims in Group settings and Item management
- Doxxing prevention — no address or street-level data revealed; badges derive from ZIP and Place, not from `home_location_id`

**Later:**
- Tier 1 community-attested badges — other members vouch for Locally Owned / Locally Made claims (b2+, paired with C5 attestation surface)
- Tier 2 document-supported badges — producer uploads SOS filing or similar evidence (b2+/b3)
- Badge rendering comparison table on the discover page — side-by-side Locally Owned vs. Locally Made (b2)
- "Designed in" as a separate signal from "Made at" (open question — historical context: `_attic/2026-05-28-reorg/product-exploration/member-geography-redesign.md`, exploration concluded; ADR-21 accepted)

**Won't:**
- Ratings or star scores of any kind. Per `principles.md` — the platform does not rank people. Trust signals are factual claims (ownership, provenance) with tiered evidence, not aggregated opinion.
- Automated verification via government API scraping. The verification ladder is human-driven (self-attest → community-attest → document-upload). The platform never silently checks a producer's claims against a government database.

---

## 4. Marketing & Outreach

*Reaching your followers and telling them what's new.*

**Now (Phase 2):**
- (Nothing ships at Phase 2. The follow substrate exists — members can follow a producer — but there is no producer-initiated broadcast channel yet.)

**Later:**
- Producer Bulletin composer — write a post, push to followers in-app + email (b2, per `producer-tools.md`)
- Social-link import — link an Instagram/TikTok/Facebook post as a bulletin body without writing twice (b2)
- Bulletin scheduling — write now, send later (b2 T2)
- Bulletin segmentation — target by follower locality or interest tags (b2 T3)
- Rich bulletin composition — images, multiple Items, event callouts (b2 T2)

**Won't:**
- Mass email marketing tools (drip campaigns, A/B testing, open-rate analytics). The bulletin is a one-to-many post, not an email marketing suite. Producers who need Mailchimp-level tools use Mailchimp.
- Push notifications to non-followers. The platform never spams. Bulletins reach followers only.
- Paid promotion or boosted posts. See Presence & Findability § Won't.

---

## 5. Customer & Community Relationships

*Connecting with the people who buy from you and show up for you.*

**Now (Phase 2):**
- Members can follow a producer (member-to-member follow via S3/S13)
- Members can follow a business Group (writes `group_memberships`)
- Members can follow a venue where the producer operates (saved-search substrate)
- Follow counts visible on public pages (member count on Group page)

**Later:**
- Follow-stream notifications — followers get notified of new Items and bulletins (b2)
- DMs — direct messaging between members, including producer ↔ customer (b2, substrate b1)
- Customer inquiries via Item-level contact affordance (b2)
- Follower list management for the producer (b2, per `producer-tools.md` Growth spec)

**Won't:**
- CRM features (customer records, purchase history, contact management). The platform is not Salesforce. Producers who need CRM use a CRM.
- Automated chatbots or auto-replies on behalf of producers. Every message is human-to-human.
- Community messaging feeds scoped to a Location (the anti-Nextdoor commitment — per `location.md` and `policy.md`).

---

## 6. Analytics & Insights

*Understanding who finds you and how your business is doing on the platform.*

**Now (Phase 2):**
- (Nothing ships at Phase 2. The event-log substrate captures every follow, RSVP, and page view, but no producer-facing dashboard exists yet.)

**Later:**
- Growth dashboard — follower count, follower trend, profile health score, peer benchmarks (b2, per `producer-tools.md` Growth T1)
- Weekly digest email — summary of new followers, RSVP trends, Item views (b2 Growth T1)
- Peer benchmarks — anonymous comparison against similar producers in the same locality (b2 Growth T2)
- Competitive intelligence — what similar producers in adjacent localities are doing (b3 Growth T3)

**Won't:**
- Individual visitor tracking or analytics on who viewed your page. The platform does not expose per-visitor data to producers. Aggregate counts only.
- Ad performance metrics. There are no ads.

---

## 7. Operations & Logistics

*Running your day-to-day — hours, locations, scheduling.*

**Now (Phase 2):**
- Anchor Location on the business Group (where you operate)
- Location attachment on each Item (pickup point, service area, venue)
- Recurring schedule on gathering Items (RRULE — weekly/monthly/custom)
- Service area as radius-from-point on service Items

**Later:**
- Hours of operation on the business Group page (b2)
- Multi-location management — a producer operating at multiple venues or markets (b2, related to P3 scheduling view)
- Ambulatory route / stop-sequence surface — "Tuesday here, Wednesday there" as a first-class view (b2)
- Sub-venue support — "Drake's barn" as a sub-location of Drake's (b2 T2, schema reserved at b1)

**Won't:**
- Inventory management system (stock levels, reorder points, warehouse tracking). The platform surfaces what a producer declares; it doesn't manage their supply chain.
- Point-of-sale or checkout integration. Per Payments § Won't — the platform coordinates; payment rails are a separate concern.
- Appointment booking or calendar sync. The platform may link to external booking (Calendly, Acuity) but won't build its own.

---

## 8. Payments & Commerce

*Getting paid for what you sell.*

**Now (Phase 2):**
- (Nothing ships at Phase 2. Price display on Items exists, but no transaction capability.)

**Later:**
- Closed-loop ledger + ACH via chartered partner (b2, per `payments.md`)
- Card on-ramp with friction — intentionally not the default; nudges toward ACH/direct (b2)
- Zero platform transaction fees on member commerce (b2, per `payments.md` wealth-circulation rubric)
- Stablecoin payment path (b3 T3, gated)

**Won't:**
- Platform-custodied funds for the platform's own benefit. Per `payments.md` — the platform never custodies for itself; float goes to the chartered partner or the member.
- Subscription billing or recurring charges managed by the platform. Producers who need recurring billing use Stripe/Square.
- Lending, credit, or financing. The platform surfaces demand and structures pledges (long-horizon per O6); it does not lend money.
- Platform transaction fees on member-to-member commerce. The wealth-circulation rubric in `payments.md` is load-bearing: zero fees is the commitment.

---

## 9. Reputation & Social Proof

*Building trust beyond self-attestation.*

**Now (Phase 2):**
- Tier 0 self-attested badges (Locally Owned, Locally Made) — honest labeling, no "Verified" claim
- Standing-presence badge on member public page (per `member.md`)
- Group member count visible on the business Group page

**Later:**
- Community attestation (Tier 1) — other members vouch for a producer's claims (b2+)
- Document-supported verification (Tier 2) — SOS filing, business license upload (b2+/b3)
- Treatment-review surface — customers review the *treatment* received, not the provider as a person (b2+, per the no-ranking-of-people corollary in `principles.md`)
- References — a producer lists references; those members confirm (b2+)

**Won't:**
- Star ratings or numeric scores. Per `principles.md` — the platform does not rank people. Trust is conveyed through factual claims with tiered evidence and qualitative attestation, not through aggregated numbers.
- Review responses or reputation management tools. The platform is not Yelp. There is no producer-vs-reviewer dynamic to manage.

---

## 10. Collaboration & Staffing

*Working with other people in your business.*

**Now (Phase 2):**
- Founder = operating owner on the business Group (immutable at creation)
- Sole-prop shape — one owner, one Group

**Later:**
- Multi-owner / partnership business Groups — co-owners with shared management (b2+)
- Staff confirmation flows — employees of a business Group, with the business confirming the relationship (b2)
- Stewardship transition — a community stewardship Group evolves into a business Group (b1.6/b2, per the stewardships theme)

**Won't:**
- Payroll, HR, or employee management. The platform records who is associated with a business Group; it doesn't manage employment.
- Cooperative governance tooling (voting, treasury, distributions). Per `CLAUDE.md` — indefinitely deferred. Kind='business' Groups with multiple owner-role memberships serve the cooperative shape without formal governance tooling.

---

## Summary: what a producer can do after Phase 2

A producer who signs up and completes the Sell walkthrough has: a business Group with a clean URL, a public page with optional Locally Owned badge, the ability to list products and services (each with their own page and URL), an optional Locally Made badge on products, a QR card for any Item (the farmers-market onboarding affordance), and all of their Items appearing in the locality-first awareness feed for nearby members. They can be followed by members, and their Items appear on venue pages where they operate.

What they can't yet do: broadcast to followers (bulletins are b2), see analytics about their reach (growth dashboard is b2), accept payment through the platform (b3+), or earn community-verified badges (Tier 1+ is b2+). The Phase 2 producer surface is *findability and presence*; the b2 surface adds *outreach and insight*; b3+ adds *commerce*.

---

**Buy close. Build community. Build the future together.**
