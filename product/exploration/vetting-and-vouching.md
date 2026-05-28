---
purpose: Early-stage thinking on a community-powered vetting and vouching system for producers and products.
layer: what
status: exploration
---

# Exploration: Vetting and Vouching

> **Status:** Exploration, not spec. Builds on the accountability exploration (Framing 2 — four pillars + sliding scale) and the attestation use case (C5). This doc asks a different question than accountability: not "is this business treating people right?" but "**can I trust what this producer claims, and is there something better?**"

> **Relationship to accountability.md:** Accountability handles structured concern reports against the four pillars (Customers / Employees / Community / Planet) with admin verification and a sliding-scale standing. Vetting and vouching handles the murkier space of *claims verification*, *community knowledge sharing*, and *alternatives discovery* — the things that happen in a group chat or at a coffee counter today. The two systems share substrate (the kind='business' Group as subject, the Member as contributor, the action-layer audit trail) but ask different questions and surface different answers.

---

## The problem

A Member is about to spend money, time, or trust on a producer — and they have a question. Not a complaint. A question.

- "Has anyone dealt with this breeder? They say they follow ethical standards but something feels off."
- "This dish soap says cruelty-free on the label. Is that actually true?"
- "I'm looking for a plumber. The one I found online has no reviews anywhere I trust."
- "This farm says pasture-raised but someone told me they're not."

Today these questions get answered in Facebook groups, Nextdoor threads, group texts, and over the fence. The answers are scattered, unsearchable, and unrepeatable — the next person with the same question starts from zero. The platform can be the place where these answers accumulate and compound.

---

## Two anchoring scenarios

### Scenario A — The dog breeder

**Setup.** A Member in Sacramento is looking at a breeder who claims to follow ethical breeding practices — health testing, proper socialization, no puppy-mill conditions. The breeder has a slick website and good photos. Something feels off but the Member can't articulate what.

**What happens on the platform:**

1. **The ask.** The Member searches for the breeder on the platform (or posts a question to a Group — kind='interest', dogs/pets). "Has anyone dealt with [Breeder Name]? They claim [X, Y, Z]. Can anyone vouch for them?"

2. **Community knowledge surfaces.** Three kinds of responses come in, each tagged by the contributor for source quality:
   - **First-hand experience.** "I bought a puppy from them in 2024. The dog had genetic issues they didn't disclose. I have vet records." *(direct experience, evidence available)*
   - **Second-hand report.** "My neighbor got a dog from them and said the conditions at pickup were concerning — too many dogs, small cages." *(heard from someone they know, no evidence)*
   - **Investigated claim.** "I looked into their AKC registration and it's expired. Their 'health guarantee' language doesn't match standard breed club requirements." *(research, verifiable)*

3. **Trust signal aggregates.** The breeder's profile (if they're on the platform as a kind='business' Group) or their external listing (if they're not) accumulates a visible indicator: "3 Members have shared concerns about this producer. 0 Members have vouched."

4. **Alternatives surface.** The platform shows: "Members in Sacramento who breed [this breed] and have vouches: [List]." Or: "Members who've had positive experiences with breeders in this area: [List with context]."

5. **The breeder can respond.** If the breeder is on the platform, they see that concerns have been raised (not the individual reports — the category) and can respond: "Here are our current health testing records, our facility photos from [date], our breed club membership."

### Scenario B — Dawn dish soap (product ethics)

**Setup.** A Member is buying dish soap. They've heard Dawn does animal testing but aren't sure. They want to know before they buy, and they want alternatives if it's true.

**What happens on the platform:**

1. **The query.** The Member searches "Dawn dish soap" or scans a barcode (future). The platform surfaces what's known.

2. **Community-contributed knowledge.** Members have tagged Dawn's parent company (Procter & Gamble) with claims:
   - "P&G conducts animal testing on household products." *(sourced: P&G's own disclosure page, PETA database)*
   - "P&G donates to [political causes some members care about]." *(sourced: OpenSecrets, FEC filings)*
   - "Dawn is used in wildlife oil-spill cleanup." *(sourced: news articles)*

3. **The platform does NOT judge.** It surfaces the claims with their sources and lets the Member decide what matters to them. The Member who cares about animal testing sees the relevant claim. The Member who cares about wildlife rescue sees that claim. Neither claim is ranked higher.

4. **Values-aligned alternatives.** The Member indicates "I care about animal testing." The platform surfaces: "Dish soaps available from local sellers on this platform that are certified cruelty-free: [List]." Or: "Members in your area who make cleaning products: [List]." The alternatives pathway is where the platform's locality-first index earns its keep — it doesn't just flag the problem, it routes the Member to a local solution.

5. **The knowledge compounds.** The next Member who searches for Dawn sees the accumulated knowledge without anyone having to re-research it.

---

## How Members CONTRIBUTE knowledge

### Three tiers of contribution

The system distinguishes contribution quality. Not all knowledge is equal, and the platform should surface this distinction without making it a credibility contest.

**Tier 1 — First-hand experience.** "I dealt with this producer directly." The contributor attests to personal, direct interaction. The platform tracks: when, what happened, whether evidence is attached (photos, receipts, vet records, correspondence).

**Tier 2 — Second-hand report.** "Someone I know dealt with them" or "I heard from a trusted source." Lower evidentiary weight. The platform tags it as second-hand. Useful for pattern detection (if five people independently report hearing the same thing, the signal strengthens) but never treated as verified.

**Tier 3 — Investigated claim.** "I researched this." The contributor links to external evidence — regulatory filings, certification databases, news reports, the producer's own disclosures. The platform treats this as research, not experience. The linked source does the evidentiary work; the contributor is the curator.

### Contribution mechanics

- **Structured form, not freeform review.** The contributor selects: tier (first-hand / second-hand / researched), category (quality, ethics, claims accuracy, business practices, alternatives), and writes a brief factual description. Optional: attach evidence (photos, links, documents).
- **No star ratings.** Consistent with `principles.md` Part 2 and the categorical failure on gatekeeping ratings.
- **Not anonymous, but contributor-visible only to the platform by default.** The contributor is a known Member (persistent identity per `design-philosophy.md` §3a). Their contribution is attributed in aggregate ("3 Members shared concerns") but their identity is not public on the producer's profile unless they opt in. The platform knows who said what (for abuse prevention); the public sees patterns, not names.
- **Contributors can withdraw.** A contribution can be retracted at any time. If the contributor learns they were wrong, the knowledge base self-corrects.

### What contributors CANNOT do

- Rate the producer on a numeric scale.
- Post freeform "reviews" (the Yelp surface).
- Flag a producer for beliefs, political views, or identity — only for actions, practices, and claims accuracy (the Framing 1 principle from `accountability.md`: actions, not beliefs).

---

## How Members ASK about producers

### Three query patterns

**Pattern 1 — Direct search.** "Tell me about [Producer Name]." The Member searches for a specific producer. The platform surfaces: any accumulated knowledge (aggregated by tier and category), the producer's own claims and responses, and alternatives if concerns exist.

**Pattern 2 — Category search with values filter.** "Show me [product/service category] that meets [criteria]." Example: "Dish soap, cruelty-free, available locally." The platform filters Items by declared attributes and surfaces community-verified claims alongside producer-declared claims.

**Pattern 3 — Pre-purchase query.** A Member is looking at a specific Item (product, service) and wants to know: "Is what this producer claims true?" The platform surfaces relevant community knowledge inline on the Item page — not as a review section, but as a trust-signal indicator. "Community knowledge available" with a tap-to-expand.

### What the query surface looks like

- **Default state (no knowledge):** Nothing. No badge, no indicator. Absence of signal is neutral.
- **Knowledge exists, no concerns:** "Vouched by [N] Members" — warm indicator. Tap to see vouching context (not individual vouches, but aggregate: "Members vouch for product quality, claims accuracy, business practices").
- **Knowledge exists, mixed:** "Community knowledge available" — neutral indicator. Tap to see the balance of vouches vs. concerns by category.
- **Knowledge exists, concerns dominate:** "Concerns raised by [N] Members" — amber indicator (same visual language as accountability.md's "Concerns Raised" threshold). Tap to see categories of concern.
- **Alternatives available:** Whenever concerns surface, the platform appends: "Looking for alternatives? [N] [category] producers in your area have community vouches."

---

## How the system AGGREGATES trust signals

### Not a score. Not a rating. A knowledge surface.

The aggregation model avoids the two failure modes named in `principles.md`:
- **No star-rating leaderboard** (gatekeeping ratings categorical failure).
- **No ranking of people** (People-First Principle corollary).

Instead, the system aggregates along two axes:

**Axis 1 — Vouches vs. concerns.** A simple ratio, never displayed as a number. Visualized as a warm/cool indicator (consistent with accountability.md's sliding scale). The ratio informs the indicator state but is never the indicator itself.

**Axis 2 — Categories.** Knowledge is bucketed by what it's about: product quality, claims accuracy (does the producer do what they say?), business practices (how they treat people), sourcing/ethics (supply chain, environmental, animal welfare). A producer can have strong vouches on quality and concerns on sourcing — the system doesn't flatten this into a single signal.

### Aggregation rules

- **One Member, one contribution per category per producer.** Prevents ballot-stuffing. A Member can vouch for quality AND raise a concern about sourcing, but can't vouch for quality twice.
- **Tier weighting.** First-hand experience carries more weight than second-hand reports in the aggregate calculation. Investigated claims with linked sources carry weight proportional to source quality (a regulatory filing outweighs a blog post). The weighting is internal — the public surface shows categories and counts, not weighted scores.
- **Recency.** Contributions age. A concern from three years ago carries less weight than one from three months ago. Producers change. The system reflects this by decaying old contributions (not deleting — decaying their influence on the aggregate indicator).
- **Threshold for visibility.** A single contribution doesn't change the public indicator. Minimum threshold (probably 3–5 contributions in a category) before the indicator shifts from default/neutral. This prevents a single disgruntled person from moving the needle.
- **Admin verification for escalation.** If concern volume crosses a higher threshold (or if a contribution includes evidence of fraud/illegality), the platform's admin review process activates — same pipeline as accountability.md's verification flow.

---

## How ALTERNATIVES get recommended

This is where vetting and vouching earns its platform keep. The insight: surfacing a problem without offering a solution is Yelp. Surfacing a problem AND routing the Member to a better option is what a neighbor does.

### The alternatives engine

When a Member sees concerns about a producer, the platform offers: "Members in [your area] who offer [same category] and have community vouches."

The recommendation is:
- **Locality-first.** Local producers surface before distant ones. The platform's place-hierarchy does the work.
- **Vouch-weighted.** Producers with more community vouches surface higher (within the locality constraint). This is not a leaderboard — it's a relevance signal in a specific alternatives context.
- **Values-matched.** If the Member indicated a values filter (cruelty-free, locally made, organic, etc.), alternatives filter by those criteria.
- **Category-specific.** If the concern is about animal testing, the alternatives surface producers with vouches specifically on ethics/sourcing, not just generic vouches.

### What this is NOT

- Not a competitor-attack vector. The alternatives engine surfaces producers who have earned vouches, not producers who paid for placement. No pay-for-visibility (principles.md).
- Not a recommendation algorithm. No engagement optimization. No "you might also like." The alternatives surface only when concerns exist and only in the specific category of concern.

---

## How this maps to existing primitives

| Primitive | Role in vetting and vouching |
|---|---|
| **Member** | The contributor (vets, vouches, asks), the producer (subject of vetting). Persistent identity is the trust anchor. |
| **Item** | The product/service being vetted. Claims attached to the Item ("cruelty-free," "locally made," "AKC registered") are what vouching verifies or challenges. |
| **Group (kind='business')** | The producer entity. Knowledge aggregates at the Group level (all Items under a business Group share the Group's trust profile). |
| **Group (kind='interest'/'practice')** | The asking context. A dogs/pets interest Group is where Scenario A's question gets asked. The Group's membership is the trusted pool of potential answerers. |
| **Location** | Locality anchor for alternatives. "Breeders in Sacramento" uses the place-hierarchy. |

### New substrate this would require

- **`member_producer_knowledge`** — a row per contribution. Columns: `contributor_member_id`, `subject_group_id` (or `subject_external_id` for off-platform producers), `tier` (first_hand / second_hand / researched), `category` (quality / claims_accuracy / business_practices / sourcing_ethics), `sentiment` (vouch / concern / neutral_info), `description` (brief text), `evidence_urls` (array), `created_at`, `withdrawn_at`.
- **`producer_trust_aggregates`** — materialized view or computed cache. Per-Group, per-category vouch/concern counts, recency-weighted. Drives the public indicator.
- **`member_producer_queries`** — optional. Tracks what Members searched for (for alternatives engine relevance, not surveillance). Governed by the same privacy baseline as `member_interests` — never publicly visible.

---

## Abuse prevention

The system assumes adversarial use (P7). Named threats and mitigations:

**Competitor sabotage.** A rival producer organizes false concern reports to tank a competitor.
- Mitigation: threshold before visibility (single reports don't move the needle), contributor identity is known to the platform, pattern detection (multiple new accounts reporting the same producer in a short window triggers admin review), the producer can respond.

**Shill vouching.** A producer recruits friends/family to flood vouches.
- Mitigation: one contribution per Member per category per producer, contributor account-age and activity-level weighting (a brand-new account's vouch counts less than a 2-year Member's), pattern detection (cluster of vouches from related accounts).

**Weaponized values.** A Member reports a producer for political donations, religious views, or identity rather than actions.
- Mitigation: the contribution form constrains to actions/practices/claims (not beliefs). The "actions, not beliefs" line from accountability.md Framing 1 is load-bearing here. Admin review catches attempts to smuggle beliefs into the actions framing.

**Harassment via vetting.** A Member uses the system to target a specific person, not a business practice.
- Mitigation: contributions attach to the kind='business' Group, not the Member personally. The system reviews treatment of the business's practices, not the person. Persistent-identity accountability means the contributor is known and can be held accountable for abuse.

**Stale knowledge.** Outdated concerns from years ago unfairly drag down a producer who has changed.
- Mitigation: recency decay. Old contributions lose influence on the aggregate. Producers can respond with "here's what we changed" and admin can verify the change.

**Off-platform producers.** The Dawn scenario involves producers not on the platform. How do you give a non-Member producer the right to respond?
- Mitigation: knowledge about off-platform producers is surfaced as "community-contributed information about [Producer Name]" with a clear label that the producer has not responded and is not on the platform. If the producer later joins, they inherit the knowledge profile and can respond. No standing change happens for off-platform producers — the system is informational only, not adjudicative.

---

## Relationship to accountability.md

The two systems are complementary layers of the same community-knowledge infrastructure:

| | Accountability (four pillars) | Vetting and vouching |
|---|---|---|
| **Question** | "Is this business treating people right?" | "Can I trust what this producer claims?" |
| **Trigger** | A concern about behavior (mistreatment, harm) | A question about claims, quality, or practices |
| **Subject** | On-platform kind='business' Groups | On-platform Groups AND off-platform producers/products |
| **Input** | Structured concern reports (four pillars) | Tiered knowledge contributions (experience, reports, research) |
| **Output** | Standing indicator (Questionable ↔ Exemplary) | Trust indicator (vouched ↔ concerns raised) + alternatives |
| **Positive signal** | Heart/support | Vouch |
| **Verification** | Admin verification of concern reports | Community attestation + admin escalation at threshold |
| **Scope** | Business behavior toward stakeholders | Claims accuracy, product quality, sourcing ethics |

At spec time, the PM decides whether these are two surfaces on one system or two separate systems sharing substrate. The natural merge point is the kind='business' Group profile: one section showing accountability standing (four pillars), another showing community knowledge (vetting and vouching). Or they could be tabs. Or they could be a single blended indicator. That's a spec-time call.

---

## Relationship to C5 (attestation use case)

C5 in `use-cases.md` is the atomic primitive this exploration composes into a system. C5 says: "A Member vouches for a producer or attests to another Member." Vetting and vouching is the *system* that makes C5 vouches accumulate, compound, and surface alternatives. C5 is the verb; this exploration is the noun.

The attestation surface, reputation discipline, and abuse prevention named as open in C5's deferral statement are partially answered here. The remaining open question is whether attestation is a standalone Item kind (per C5's proposal) or a row in the `member_producer_knowledge` table proposed above. The latter is simpler and avoids a new Item kind for what is fundamentally metadata about a producer, not a declaration by a Member. But both shapes work.

---

## Open questions

1. **Off-platform producers at scale.** The Dawn scenario requires knowledge about producers who will never join the platform (P&G, Unilever, etc.). How much of the system serves this use case vs. focusing on local, on-platform producers? The alternatives engine is strongest when it routes to local sellers — the off-platform knowledge is the setup; the on-platform alternative is the payoff.

2. **Barcode/product-lookup integration.** Should the platform integrate with product databases (Open Food Facts, EWG, PETA's cruelty-free list) to pre-populate knowledge about mass-market products? This would accelerate the Dawn scenario but introduces third-party data dependency and maintenance burden.

3. **Group-scoped vs. platform-scoped knowledge.** Does knowledge contributed in a dogs/pets interest Group stay scoped to that Group, or does it aggregate platform-wide? Platform-wide compounding is more powerful but raises context-collapse risks (a concern relevant in Sacramento may not apply in Portland).

4. **Agent-native queries (P8).** An agent acting on a Member's behalf could query the vetting system before a purchase: "Check if [producer] has community concerns before I buy." The agent-assistance substrate (action-layer scoped capabilities, `bounded_purchase` delegation scope) is the natural integration point. How does the agent present nuanced trust signals (not a score) in a delegated purchase flow?

5. **The "just asking" vs. "reporting" line.** Scenario A starts as a question ("has anyone dealt with them?") and only becomes a concern report if the answers warrant it. The system needs a clean path from "I'm curious" to "I'm concerned" without forcing the Member to commit to a concern report before they know what they'll learn.

6. **Producer opt-in vs. opt-out for knowledge profiles.** Does a producer on the platform automatically get a knowledge profile that Members can contribute to? Or do they opt in? Opt-in protects producers but creates a gap where the most concerning producers are the least likely to opt in. The accountability.md precedent (concern reports exist regardless of producer consent) suggests the knowledge profile is inherent to having a public-facing presence on the platform.

7. **How much structure vs. how much community?** The structured contribution form (tier, category, sentiment) imposes order. But the richest knowledge often comes from unstructured conversation in Groups ("oh yeah, I know that breeder, here's the deal..."). Does the system capture knowledge from Group conversations, or only from the structured form? The former is more natural; the latter is more aggregatable.

8. **Bundle assignment.** This is probably b2+ given the dependency on the accountability substrate, the attestation primitive (C5), and the alternatives engine (which requires a critical mass of producers with vouches). The "just asking" Group-conversation pattern could land earlier as a lightweight b1 surface — but only if it doesn't require the aggregation engine.

---

## What this is NOT

- **Not a review system.** No stars, no rankings, no "top 10 breeders in Sacramento." Consistent with `principles.md` categorical failure on gatekeeping ratings.
- **Not a boycott tool.** The system surfaces information and alternatives. It does not tell Members what to care about or where to spend. Consistent with accountability.md Framing 1: "Transparency, not judgment."
- **Not a competitor marketplace.** The alternatives engine surfaces producers who earned vouches, not producers who paid. No pay-for-visibility.
- **Not a political scorecard.** Actions, not beliefs. A producer's political donations are out of scope. A producer's animal testing practices are in scope.
- **Not a surveillance system.** Contributors are known to the platform (persistent identity) but not publicly named. Members are not tracked for what they search. The system serves the asker, not the platform's data appetite.
