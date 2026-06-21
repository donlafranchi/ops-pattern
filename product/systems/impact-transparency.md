---
id: what-impact-transparency
purpose: Two-layer societal impact score (public record + member intelligence) replacing the ownership tier spectrum. Data-driven, continuous-confidence, alternatives-first.
layer: what
status: draft
---

# System: Impact Transparency

**Purpose:** Replace the 6-tier ownership tier spectrum (coop → pe-corporate, green-to-gray) with a broader, data-driven signal: **how much does this organization help the many vs. help the few?** The axis shifts from *local vs. non-local* to *societal benefit vs. societal harm*. Locality remains a positive signal — but it becomes one input among several, not the whole story. A glass-bottle recycling nonprofit in Louisiana that helps everyone scores high even though it's not local to the viewer. A PE-rolled-up veterinary chain that lobbies against price transparency scores low even if the clinic down the street carries its flag.

**Bundles:** b2 (T1 substrate + worst-offender index), b2+ (T2 alternatives engine + member tips pipeline + continuous-confidence model), b3 (T3 attestations + emergent patterns + federated scoring)

**North stars served:** Loop 9 (Find a local pro) — the discovery surface that helps Members choose where to spend. Loop 8 (Follow what you love) — the standing relationship with aligned producers. Family 4 (Pooling) — the case for building alternatives becomes concrete when Members can see why.

**Does NOT gate b1.** The b1 build ships without impact scores. The existing locally-owned badge (per [`business-jurisdiction.md`](business-jurisdiction.md)) continues to operate at b1 and becomes one input to the Impact Transparency score at b2.

**Companion specs:** [`impact-diagnostic.md`](../foundation/impact-diagnostic.md) (the diagnostic this system operationalizes) · [`business-jurisdiction.md`](business-jurisdiction.md) (locality signal becomes one input) · [`groups.md`](groups.md) (kind='business' Group surface consumes the score) · [`design-language.md`](../ui/design-language.md) (DLS section this system replaces) · [`principles.md`](../foundation/principles.md) (people-first, no extraction) · [`policy.md`](../foundation/policy.md) (data-sourcing posture)

**Retires:** The "Ownership tier spectrum" section in `design-language.md` (the 6-tier green-to-gray ramp and the `data-extractive` grayscale treatment). Replacement visual treatment defined in this spec's DLS section.

---

## What this system is

A **two-layer, evidence-sourced score** that tells Members how an organization's behavior affects society — from "actively harmful to the many" to "actively helpful to the many."

**Layer 1 — Public record** forms the foundation. Government enforcement data, financial disclosures, certifications. Objective, cited, reproducible. This layer sets the floor. It can never be overridden by member input.

**Layer 2 — Member intelligence** modulates the score within bounds. Members contribute three tiers of signal — tips, attestations, and emergent patterns — each weighted by a continuous-confidence model (see § Two-Layer Scoring Model below). Member intelligence alone can flag an entity for review but cannot move a score below 3 without platform verification.

The two layers reinforce each other. When both point the same direction, confidence is high. When they diverge, the divergence itself is a signal worth surfacing.

The platform does not try to score every entity. It starts with the worst offenders — organizations whose public record shows clear patterns of societal harm — and the clear alternatives. The middle is left unscored until the signal quality earns it.

This is the operational expression of the anti-extraction diagnostic ([`impact-diagnostic.md`](../foundation/impact-diagnostic.md)). The five markers (profit-grows-when-cost-grows, durability suppressed, artificial switching costs, information asymmetry captured, regulatory capture) become queryable data rather than abstract categories.

### What this system is not

- **Not a review system.** No Member-submitted star ratings, no opinion aggregation. The score is derived from public records, verifiable evidence, and verified member intelligence — not from likes or thumbs-up.
- **Not a voting system.** Member intelligence accumulates like evidence in a case, not like votes crossing a finish line. There are no hard thresholds — three reports don't "trigger" anything that two reports don't. Each contribution adds marginal confidence on a smooth curve.
- **Not a boycott list.** The platform never tells Members "don't shop here." It says "here's what the public record shows, and here are alternatives." The Member decides.
- **Not an editorial judgment.** The scoring methodology is published, the data sources are cited, and the score is reproducible. This is transparency, not opinion.
- **Not a replacement for locality.** Being locally owned is good — it means profits stay in the community. It's one of several positive signals, not the only one.

---

## The 1–5 Scale

The scale measures **societal impact** — the degree to which an organization's operations help the many vs. concentrate benefit among the few.

| Score | Label | Meaning | Example archetypes |
|---|---|---|---|
| 1 | **Harmful** | Public record shows a pattern of societal harm: heavy lobbying against consumer/worker/environmental protections, significant regulatory violations, PE extraction pattern, documented labor abuses. | PE-rolled-up hospital chain with lobbied-for certificate-of-need moats; pesticide manufacturer with EPA violations + congressional lobbying against regulation |
| 2 | **Extractive** | Business model structured to extract value: profit-scales-with-customer-cost (MLR pattern), artificial switching costs, captured information asymmetry. May not have violations but the structure is extractive by design. | Large health insurer (MLR perverse incentive); dealer-franchise-protected auto dealership chain; proprietary-parts-locked equipment manufacturer |
| 3 | **Neutral** | No clear signal in either direction, or mixed signals. Not scored — the platform does not display a score for entities it can't substantiate. The absence of a score is itself honest. | Most businesses. The vast middle that hasn't been indexed. |
| 4 | **Beneficial** | Positive signals: locally owned, B Corp or PBC certification, worker-ownership, documented community reinvestment, transparent pricing, right-to-repair commitment. | Local independent shop with verified locality (jurisdiction ladder); B Corp-certified outdoor company; worker-owned cooperative |
| 5 | **Regenerative** | Organization's core purpose is societal benefit: community reinvestment as operating model, environmental remediation, worker empowerment as structure (not marketing), open-source or commons contribution at scale. | Glass Bottle Recyclers of Louisiana (environmental remediation, community jobs, cross-geography benefit); credit union returning surplus to members; community land trust; mutual aid organization |

**Score 3 is the honest default — unscored.** The platform does not display a numeric score or badge for entities in the neutral/unscored band. This prevents the system from implying judgment where evidence is absent. An entity without a score is not "average" — it's unindexed.

**Scores 1–2 and 4–5 require cited evidence.** Every score outside the neutral band links to the public-record sources that produced it. A Member can tap the score and see the receipts: "Lobbying spend: $X (OpenSecrets, 2024)" / "EPA violations: N (EPA ECHO database, 2019–2024)" / "B Corp certified since 2018."

> **Intent:** The two-tail approach (score the worst + the best, leave the middle unscored) avoids the trap of implying universal coverage the platform can't deliver. It also focuses the system's value where it matters most: helping Members avoid actively harmful entities and discover actively beneficial ones. The middle earns a score when the evidence pipeline earns it. **Test for future proposals:** does the proposal want to auto-score the unindexed middle via heuristic or inference? Refuse — inferred scores without cited evidence violate the transparency commitment. Expand the evidence pipeline instead.

---

## Signal Sources

The score is derived from **publicly available, verifiable data.** Each signal source has a polarity (positive or negative), a weight, and a citation requirement.

### Negative signals (push score toward 1–2)

| Signal | Source | What it measures |
|---|---|---|
| Congressional lobbying spend | OpenSecrets (opensecrets.org) — bulk data, updated annually | Money spent influencing legislation. High spend + anti-consumer/anti-worker/anti-environmental bill targets = strong negative signal. |
| Environmental violations | EPA ECHO database (echo.epa.gov) | Formal enforcement actions, significant non-compliance. Count + severity + recency. |
| OSHA violations | OSHA inspection database | Workplace safety violations. Repeat/willful violations weighted heavily. |
| PE ownership | PitchBook, Crunchbase, SEC filings | Private equity or hedge fund ownership. PE ownership is a structural extraction signal (per `impact-diagnostic.md` marker 1 — profit grows when cost grows). |
| Anti-competitive enforcement | FTC/DOJ antitrust actions | Documented anticompetitive behavior — price-fixing, market allocation, monopoly maintenance. |
| Right-to-repair opposition | Advocacy group tracking (iFixit, PIRG) | Active lobbying or legal action against right-to-repair legislation (marker 2 — repair and durability suppressed). |
| Animal welfare violations | USDA APHIS inspection reports | For agricultural and food-industry entities. Documented AWA violations. |

### Positive signals (push score toward 4–5)

| Signal | Source | What it measures |
|---|---|---|
| Locally owned (jurisdiction ladder) | Platform's own `business-jurisdiction.md` substrate | Verified locality — the existing three-tier ladder (self-attested → community-attested → document-verified). Positive signal; weight scales with verification tier. |
| B Corp / PBC certification | B Lab directory (bcorporation.net) | Third-party-verified social and environmental performance. |
| Worker ownership | NCEO database, cooperative directories, public filings | Worker-owned cooperatives, ESOPs with >50% employee ownership. |
| Community reinvestment evidence | CDFI Fund, CRA reporting, public filings | Documented reinvestment of surplus into the community served. |
| Environmental remediation | EPA Brownfields, state environmental agencies | Active environmental cleanup or remediation operations. |
| Open-source / commons contribution | Public repositories, Creative Commons licensing | Meaningful contribution to shared infrastructure (not greenwashing PRs). |
| Fair-trade / direct-trade certification | Fair Trade USA, Direct Trade registries | Supply-chain transparency and producer-fair pricing. |
| Credit union / mutual structure | NCUA, state regulators | Member-owned financial institution returning surplus to members. |

### Signal quality tiers

Not all signals carry equal weight. The scoring engine applies a quality hierarchy:

1. **Government enforcement data** (EPA, OSHA, FTC, USDA) — highest confidence. These are formal findings of law by agencies with subpoena power and legal process. Layer 1 only.
2. **Financial disclosure data** (SEC, OpenSecrets, PitchBook) — high confidence. Audited or legally required filings. Layer 1 only.
3. **Third-party certification** (B Corp, Fair Trade, cooperative directories) — medium-high confidence. Verified by independent bodies with published methodologies. Layer 1 only.
4. **Platform-verified member intelligence** (verified attestations, emergent patterns, jurisdiction ladder) — medium confidence. Platform's own verification processes applied to member-contributed signals. Layer 2 weighted by continuous-confidence model (§ Two-Layer Scoring Model).
5. **Unverified member tips** — low confidence. Leads for the evidence pipeline to investigate. Never standalone scoring inputs; weight accrues only through verification, corroboration, and member standing.
6. **Self-reported data** (press releases, marketing claims) — lowest confidence. Used only as leads for higher-quality sources, never as standalone scoring evidence.

> **Intent:** The hierarchy exists because the system's credibility depends on being right, not fast. A score sourced from an EPA enforcement action is worth more than one sourced from a press release claiming environmental responsibility. The scoring engine never promotes a self-reported claim to the weight of a government finding. **Test for future proposals:** does the proposal want to score an entity based on self-reported claims alone? Refuse — the claim becomes a lead for the evidence pipeline to verify, not a scoring input.

---

## Two-Layer Scoring Model

The impact score is composed of two layers. Public record is the foundation; member intelligence modulates within bounds.

### Layer 1 — Public record (the foundation)

Government enforcement data, financial disclosures, and certifications — the signal sources enumerated above. This layer is objective, cited, and reproducible. Any person with access to the same public databases can arrive at the same score.

Public record carries the dominant weight. It sets the floor and the ceiling. Member intelligence cannot override a government enforcement finding, an audited financial disclosure, or a verified certification. A company with three EPA enforcement actions and documented lobbying against environmental regulation does not get rehabilitated by member attestations.

### Layer 2 — Member intelligence

Members contribute signal through three tiers, each with different trust characteristics:

**Tips** — any Member can flag something ("this company was just bought by PE," "they're lobbying against right-to-repair in our state"). Tips go into a review queue and are verified against primary sources before affecting the score. Low initial trust, high value as leads. A tip is an invitation to look, not a finding.

**Attestations** — Members with standing (active tenure on the platform, verified identity) can attest to things they've witnessed firsthand ("I worked there, they suppress repair," "I'm a supplier, they squeeze margins"). An attestation carries more weight than a tip — like a sworn statement vs. an anonymous tip. Standing is continuous, not a binary gate: a Member with two years of active, verified participation weighs more than one who signed up last week, but there is no bright line where "not standing" becomes "standing."

**Patterns** — when multiple independent Members report the same signal about the same entity without coordination, the system surfaces it as an emergent pattern. This is the whistleblower mechanism: scattered individual knowledge becomes collective intelligence. Independence matters — reports from Members who follow each other or share Group memberships are partially correlated and weigh less than reports from unconnected Members.

### Continuous confidence — no hard thresholds

This is a load-bearing design principle. The system does **not** use hard numeric thresholds (e.g., "3 reports triggers X" or "4 attestations = verified"). Instead:

Each member contribution adds **marginal confidence** on a smooth, asymptotic curve. A single tip from a new Member barely moves the needle. The same tip from a long-standing verified Member moves it more. A second independent report compounds the first. But there is never a cliff edge where N−1 reports means nothing and N reports means everything.

The curve is **asymptotic** — member intelligence approaches but never quite reaches the weight of a government enforcement finding. Ten independent attestations from verified, long-standing Members might approach the confidence of a single EPA enforcement action, but they don't equal it and they don't exceed it. The public record layer remains the foundation.

**Factors that increase weight continuously:**

- **Member standing.** Time on platform, verification tier, activity history. Continuous, not stepped.
- **Independence.** Reports from unconnected Members (no follow relationships, no shared Group memberships) weigh more than reports from Members in the same social graph.
- **Specificity.** A tip with a source URL weighs more than a general claim. An attestation naming dates, roles, and verifiable details weighs more than a vague assertion.
- **Cross-signal corroboration.** One Member flags PE ownership; another flags labor issues; a third flags price increases. Different angles on the same entity compound each other — the signals triangulate, increasing confidence faster than repeated reports of the same signal.

> **Intent:** "Member intelligence accumulates like evidence in a case, not like votes crossing a finish line." Hard thresholds create gaming targets (astroturf exactly N reports to trigger a score change) and cliff edges (N−1 is invisible, N is a verdict). The continuous model treats each contribution as marginal evidence whose weight depends on source quality, independence, and corroboration — the same epistemology courts use, not the one elections use. **Test for future proposals:** does the proposal introduce a magic number (3 reports to flag, 5 attestations to verify, 10 patterns to promote)? Refuse — replace with a continuous-weight factor that compounds without a threshold.

### Relative weight between layers

Public record forms the foundation and carries the dominant weight. Member intelligence modulates the score within bounds. The exact weighting is flexible, not pinned to hard percentages — it evolves as the member intelligence pipeline matures and earns trust.

**Constraints on layer interaction:**

- Member intelligence alone (no public record) can flag an entity for platform review but cannot assign a score below 3. The flag itself is surfaced to the review queue, not to the public score.
- When public record and member intelligence agree, confidence in the score increases — the score is more resistant to future challenge.
- When public record and member intelligence diverge, the divergence is itself a signal. The platform surfaces the divergence rather than resolving it mechanically: "Public record suggests [X]; member reports suggest [Y]." This is an invitation for deeper investigation, not an error state.
- Member intelligence can push a score that's already outside the neutral band further in the same direction (a score-2 entity with heavy member corroboration trends toward 1), but the movement is bounded — the public-record foundation determines the neighborhood; member intelligence adjusts within it.

---

## How Scores Interact with Discovery

Three rules govern how the score affects what Members see.

### Rule 1 — Never recommend a harmful entity

The platform's discovery surfaces (search, explore feed, map, category browse) **never promote** entities scored 1 or 2. They do not appear in "recommended," "featured," "nearby," or algorithmically surfaced lists. This is not suppression — the entity is not hidden. It is a refusal to *recommend*. The platform's voice says "here are great options" and the harmful ones are not among them.

### Rule 2 — Always surface when directly searched

If a Member searches for a specific entity by name — "Monsanto," "Blackstone portfolio companies," the PE-owned vet clinic — the platform returns the result. The result carries the score badge and a clear, factual summary: "Impact score: 2/5 — Extractive. Based on: $X lobbying spend (OpenSecrets), N EPA violations (ECHO)." Below the entity's profile, the alternatives section appears.

This serves the researcher use case: a Member comparing their current provider against alternatives. The platform helps them see clearly, not by hiding information but by contextualizing it.

### Rule 3 — Promote beneficial and regenerative entities everywhere

Entities scored 4–5 receive discovery preference. They appear first in category listings, they surface in "alternatives" sections, they're eligible for "featured" placement. A regenerative glass-recycling nonprofit in Louisiana surfaces to a Member in Sacramento browsing environmental organizations — because the axis is societal impact, not proximity. Locality is a *bonus* signal in discovery ranking, not a *filter*.

> **Intent:** The three rules embody the platform's people-first stance without becoming paternalistic. The platform doesn't block access — it shapes defaults. A Member who wants to find a harmful entity can. A Member who's browsing gets the beneficial ones first. This is the same pattern as the anti-extraction diagnostic applied to discovery: the platform scaffolds the alternative rather than prohibiting the incumbent.

---

## The Alternatives Pattern

When a Member views an entity scored 1 or 2, the platform surfaces a **"Consider these alternatives"** section below the entity's profile. The section contains entities scored 4–5 that serve the same category, industry, or need — with preference for local alternatives when available.

**Shape:**
- Section header: "Alternatives in [category]" — e.g., "Alternatives in veterinary care" or "Alternatives in home insurance."
- Card list: standard card recipe (per `design-language.md`), ordered by score (5 first, then 4), then by locality proximity within score tier.
- Each card shows: entity name, score badge, one-line "why" (the strongest positive signal — "Worker-owned cooperative" / "B Corp certified" / "Locally owned, verified").
- Maximum 6 cards. If fewer than 3 local alternatives exist, backfill with non-local high-scoring entities in the same category. If fewer than 3 alternatives exist in any geography, show what's available and surface a "Know a great [category] provider? Tell us" link (T3 — Member-contributed evidence pipeline).

**When the entity is not on the platform:**
The alternatives pattern also works for entities the platform has indexed from public data but that don't have their own platform presence (no Member-created Group). The entity gets a "public profile" page sourced entirely from public records — no user-generated content, no reviews, just the scored signals and the alternatives section. This is the "research a company" surface.

> **Intent:** The alternatives pattern is the system's core value proposition for Members. "Here's what the public record says about this company; here are better options" is more useful than a score alone. The score without alternatives is a complaint; the score with alternatives is a tool. The pattern also creates a flywheel: producers scored 4–5 get discovery traffic from the alternatives section, which incentivizes platform participation by aligned businesses.

---

## How Locality Becomes One Input

The existing locality verification ladder (per [`business-jurisdiction.md`](business-jurisdiction.md)) does not retire. It becomes one positive signal feeding the impact score, weighted by verification tier:

| Jurisdiction tier | Impact signal weight | Rationale |
|---|---|---|
| Tier 0 (self-attested) | Low positive | Declared but unverified; the claim itself is a signal of intent. |
| Tier 1 (community-attested, b2+) | Medium positive | Community members have corroborated the claim. |
| Tier 2 (document-verified, b3) | High positive | Government-sourced evidence of local registration. |

Locality is a positive signal because locally owned businesses circulate wealth locally — profits stay in the community rather than flowing to distant shareholders. This is the mechanism behind the wealth-circulation absolute. But locality alone is insufficient: a locally owned business can still lobby against consumer protections, violate environmental regulations, or structure its pricing extractively. The impact score captures the full picture.

**The locally-owned badge survives.** A kind='business' Group with a verified jurisdiction record continues to display the "Locally owned" badge (per `business-jurisdiction.md`). The impact score is a separate, additional signal — not a replacement for the locality badge. Both can coexist on the same entity profile.

---

## Non-Local-but-Helpful Surfacing

Entities scored 4–5 that are not local to the viewer still surface in relevant discovery contexts. The glass-bottle recycling nonprofit in Louisiana appears when a Sacramento Member browses environmental organizations, recycling services, or sustainability resources — because the score axis is societal impact, not proximity.

**Discovery ranking for scored entities:** Score tier first, then locality as a tiebreaker within the same score tier. Between two score-5 entities, the local one ranks higher. Between a score-5 non-local entity and a score-4 local entity, the score-5 entity ranks higher — impact trumps proximity.

**Category and need matching:** Non-local high-scoring entities surface through category tags, industry classification, and need-matching (the same infrastructure that powers the alternatives pattern). A credit union in Iowa surfaces in "financial services" results for a Member in California if it serves that geography and scores 5.

> **Intent:** This is the design move that breaks the "local-only" frame. The platform's mission is wealth circulation over extraction — and a regenerative organization that helps the many should be discoverable by the many, regardless of where it sits. The Louisiana glass recyclers help everyone who recycles glass. Hiding them from Sacramento Members because they're not local would subordinate the mission to the frame.

---

## DLS Replacement — Visual Treatment

The ownership tier spectrum (6-tier green-to-gray ramp, `data-extractive` grayscale treatment) retires. The replacement:

### Score badge (entities scored 1–2 or 4–5 only)

A compact badge rendered in the text zone below cards (never over photos, per DLS principle #4). Unscored entities (score 3 / unindexed) display no badge.

| Score | Badge text | Color treatment |
|---|---|---|
| 5 | "Regenerative" | `--color-success` text (#2D6A4F, forest) on `--color-bg` (white) |
| 4 | "Beneficial" | `--color-success` text at 70% opacity on `--color-bg` |
| 2 | "Extractive" | `--color-fg-muted` text (#717171) on `--color-bg` |
| 1 | "Harmful" | `--color-danger` text (#B4513C, terracotta) on `--color-bg` |

**No background fills, no pills, no colored rectangles.** The badge is text-only, using semantic colors already in the DLS, rendered in 11px/600 weight below the card title. This keeps the visual treatment within the DLS's restraint principles (one accent color, no candy-colored badges).

### Map pin treatment

Scored entities on the map use the same semantic color for their pin accent:

| Score | Pin accent |
|---|---|
| 5 | `--color-success` dot |
| 4 | `--color-success` dot, 70% opacity |
| 3 / unscored | Standard pin (no accent) |
| 2 | `--color-fg-muted` dot |
| 1 | `--color-danger` dot |

### Retired treatments

- The 6-tier green-to-gray hex ramp (coop through pe-corporate) retires.
- The `data-extractive="true"` attribute and its `grayscale(0.6) + opacity 0.78` filter retire. Low-scoring entities are not visually punished in the feed — they're simply not recommended. When directly searched, they render at full fidelity with the score badge.
- The `--ownership-*` token set retires.

> **Intent:** The old treatment encoded a judgment in the visual layer — extractive entities literally faded out. The new treatment is factual, not theatrical: the score badge states what the public record shows, in the same typographic system as every other label. Members who want to investigate tap the badge and see the cited evidence. The platform's editorial voice lives in discovery ranking (rules 1–3), not in visual punishment.

---

## T1 — Substrate + Worst-Offender Index (b2)

The minimum viable version: the data pipeline that ingests public records and the worst-offender index that flags the clearest cases.

**Data pipeline.** A batch-process ingestion layer that pulls from OpenSecrets, EPA ECHO, OSHA, PitchBook (or equivalent PE-ownership source), and B Lab. Runs on a scheduled cadence (weekly for government enforcement data, monthly for financial/certification data). Outputs structured records into the `entity_impact_signals` table.

**Worst-offender index.** The first scored entities are the easiest calls — organizations where the public record is unambiguous: heavy lobbying + multiple enforcement actions + PE ownership. These are scored 1 or 2 with full citation. The index starts small (hundreds of entities, not millions) and grows as the evidence pipeline matures.

**Best-alternative index.** Simultaneously, entities with clear positive signals (B Corp, credit union, worker-owned cooperative, verified locally owned) are scored 4 or 5. These are the supply side of the alternatives pattern.

**Surfaces.** The score badge renders on entity profiles. The alternatives section renders on profiles of entities scored 1–2. Discovery ranking rules (1–3) take effect. No public-facing "browse all scores" surface at T1 — the score is encountered in context, not sought out.

## T2 — Alternatives Engine + Member Intelligence Foundation (b2+)

**Category mapping.** Entities are classified by industry/category (NAICS or a platform-native taxonomy) to power the alternatives pattern. A score-1 veterinary chain surfaces score-4+ veterinary practices as alternatives.

**Signal expansion.** Additional Layer 1 data sources come online: FTC/DOJ antitrust actions, USDA APHIS inspections, right-to-repair tracking, fair-trade certification directories. The scoring model gains nuance as the signal set widens.

**Member tips pipeline.** Layer 2 begins here. Members can submit tips — flagging PE acquisitions, lobbying activity, labor issues, or positive signals the public-record pipeline hasn't caught. Tips enter a review queue and are verified against primary sources before contributing marginal confidence to the score. The continuous-confidence model launches at this tier: each verified tip adds weight based on member standing, specificity, and independence. No hard thresholds.

**Entity matching.** The platform builds the linkage between unindexed on-platform entities (kind='business' Groups created by Members) and indexed public-record entities. A Member's "Sacramento Pet Hospital" Group gets linked to the corporate parent's public record when the parent has a score. The linkage is surfaced transparently: "This business is part of [Parent Corp] (Impact score: 2/5)."

**Methodology publication.** The scoring methodology, signal weights, continuous-confidence curve parameters, and data sources are published on a platform page accessible to anyone. Full transparency — the score is reproducible by anyone with access to the same public data and the published weighting model.

## T3 — Attestations, Patterns + Federated Scoring (b3)

**Attestations.** Members with standing can attest to firsthand knowledge. Attestations carry more weight than tips on the continuous-confidence curve — a verified attestation from a long-standing Member with relevant professional context (former employee, supplier, community neighbor) moves the needle more than a tip, though still less than a government enforcement finding. Standing is continuous: the system weighs tenure, verification tier, activity, and relevance — no binary "has standing / doesn't have standing" gate.

**Emergent patterns.** When multiple independent Members report the same signal about the same entity, the system surfaces it as a pattern. Independence is measured continuously — reports from Members with no social-graph overlap (no follows, no shared Groups) contribute more than reports from connected Members. Patterns are the whistleblower mechanism: scattered individual knowledge becomes collective intelligence. The pattern itself is surfaced to the review queue and, if corroborated, adds confidence to the score.

**Federated scoring.** Partner organizations (environmental groups, consumer advocacy orgs, labor organizations) can contribute scored assessments through a federation protocol. Each federation partner's methodology is published alongside their contributed scores. Members see the provenance: "Scored by [Partner Org] based on [methodology]." Federation assessments enter the Layer 1 quality hierarchy at the third-party-certification tier.

**Score challenge.** Entities (including their on-platform representatives) can challenge a score with evidence. Challenges enter a review queue and are resolved against the published methodology. The challenge and resolution are themselves transparent — published alongside the score.

**Expanded coverage.** With member intelligence and federated evidence pipelines, the scoring system moves beyond the worst-offender / best-alternative tails toward broader coverage. Score 3 (unscored) entities begin receiving scores as member intelligence and public-record evidence accumulate — always through the continuous-confidence model, never through a threshold count of reports.

---

## Data model implications (build with this in mind from day one)

These tables and columns should be added at b1 even though the scoring surfaces ship at b2. Cheap now, expensive to backfill.

**Tables:**

- `entity_impact_profiles` — the scored entity. Fields: `id`, `name`, `entity_type` (enum: 'organization', 'brand', 'corporate_parent'), `naics_code`, `impact_score` (1–5, nullable — null = unscored), `score_computed_at`, `methodology_version`, `created_at`, `updated_at`. An entity may or may not map to a platform Group — the linkage is separate.

- `entity_impact_signals` — individual evidence records. Fields: `id`, `entity_id` (FK → `entity_impact_profiles`), `signal_type` (enum: 'lobbying_spend', 'epa_violation', 'osha_violation', 'pe_ownership', 'antitrust_action', 'rtr_opposition', 'animal_welfare_violation', 'locality_verified', 'bcorp_certified', 'worker_owned', 'community_reinvestment', 'environmental_remediation', 'open_source_contribution', 'fair_trade_certified', 'credit_union_mutual'), `polarity` (enum: 'positive', 'negative'), `signal_quality_tier` (1–6 per the quality hierarchy), `source_url`, `source_name`, `source_date`, `evidence_summary` (text), `raw_data` (jsonb), `ingested_at`, `expires_at` (nullable — some signals are periodic), `created_at`.

- `entity_group_links` — maps platform Groups to scored entities. Fields: `id`, `entity_id` (FK → `entity_impact_profiles`), `group_id` (FK → `groups`), `link_type` (enum: 'is', 'subsidiary_of', 'franchise_of', 'brand_of'), `linked_by` (enum: 'platform', 'member', 'entity'), `verified_at` (nullable), `created_at`.

- `entity_alternatives` — precomputed alternatives for the alternatives pattern. Fields: `id`, `entity_id` (FK — the low-scoring entity), `alternative_entity_id` (FK — the high-scoring alternative), `category_match_score` (float), `computed_at`, `created_at`. Materialized view refreshed on scoring runs.

- `member_intelligence_contributions` (T2+). The unified table for all member-contributed signals. Fields: `id`, `entity_id` (FK → `entity_impact_profiles`), `contributor_id` (FK → `members`), `contribution_type` (enum: 'tip', 'attestation', 'pattern_seed'), `claim_text` (text — what the member is reporting), `source_url` (nullable — tips with sources weigh more), `specificity_score` (float, 0–1 — computed from presence of dates, names, URLs, verifiable details), `contributor_standing_at_submission` (float — snapshot of the contributor's continuous standing score at time of submission), `status` (enum: 'pending_review', 'verified', 'partially_verified', 'unverifiable', 'rejected'), `confidence_weight` (float — the marginal confidence this contribution adds to the entity's score, computed by the continuous-confidence model), `reviewed_by`, `reviewed_at`, `verification_notes` (text), `created_at`.

- `member_intelligence_independence` (T3). Tracks social-graph distance between contributors to the same entity for independence weighting. Fields: `id`, `entity_id` (FK → `entity_impact_profiles`), `contributor_a_id` (FK → `members`), `contributor_b_id` (FK → `members`), `independence_score` (float, 0–1 — 1.0 = no social-graph overlap; decays with shared follows, shared Group memberships, interaction history), `computed_at`, `created_at`.

- `member_intelligence_patterns` (T3). Emergent patterns surfaced from independent convergent reports. Fields: `id`, `entity_id` (FK → `entity_impact_profiles`), `pattern_signal` (text — the convergent claim), `contributing_ids` (array of FK → `member_intelligence_contributions`), `independence_weighted_confidence` (float — aggregate confidence accounting for contributor independence), `pattern_status` (enum: 'emerging', 'surfaced', 'corroborated', 'declined'), `surfaced_at`, `reviewed_at`, `created_at`.

- `member_standing_snapshots` (T2+). Continuous standing score for members contributing intelligence. Fields: `id`, `member_id` (FK → `members`), `standing_score` (float, 0–1 — computed from tenure, verification tier, activity, contribution-acceptance history), `tenure_days` (int), `verification_tier` (int), `activity_score` (float), `contribution_accuracy_rate` (float — ratio of accepted contributions to total), `computed_at`, `created_at`. Recomputed on contribution events, not on a fixed schedule.

**Columns on existing tables:**

- `groups.entity_link_id` (FK → `entity_impact_profiles`, nullable) — shortcut for the most common lookup: "what's this Group's impact score?" Populated when `entity_group_links` establishes an `is` or `subsidiary_of` link.

**Event-sourcing patterns:**

- `entity_score_changed` events — immutable log of every score change with before/after values, the signals that drove the change, and the methodology version. This is the audit trail that makes the system's decisions reproducible and challengeable.

- `entity_signal_ingested` events — log of every signal ingestion, successful or rejected, for pipeline debugging and transparency.

- `member_intelligence_submitted` events — log of every member contribution (tip, attestation, pattern seed) with the contributor's standing score at submission time, the computed confidence weight, and the independence context.

- `member_intelligence_verified` events — log of every review-queue resolution, with the reviewer's decision, verification notes, and the resulting confidence-weight adjustment. The before/after confidence state of the entity's score is captured for auditability.

---

## Policy posture

Per `product/foundation/policy.md`. This system touches data sharing and visibility.

1. **Default state.** Entities are unscored (score 3 / null) until evidence is ingested and the scoring engine produces a score outside the neutral band. No entity is scored without cited public-record evidence.

2. **Available opt-ins.** None for the scored entity at T1/T2 — the score is derived from public records, not from the entity's participation. At T3, entities can submit evidence (positive or negative) and challenge scores — both are opt-in actions with published review processes.

3. **Three-filter analysis.**
   - **Helpful?** Yes — Members gain visibility into the societal impact of organizations they patronize, enabling informed economic decisions aligned with the wealth-circulation absolute. The member intelligence layer adds a collective-knowledge dimension that public records alone can't capture.
   - **Harmful?** Risk: an incorrect score could damage an entity's reputation. Mitigation: Layer 1 (public record) carries dominant weight and requires cited evidence at government-enforcement or financial-disclosure quality tiers; Layer 2 (member intelligence) modulates within bounds and cannot override Layer 1; the scoring methodology is published and reproducible; the challenge process (T3) provides recourse.
   - **Abusable?** Risk: astroturfing the member intelligence layer (coordinated false reports to game a score). Mitigation: the continuous-confidence model weights independence — coordinated reports from socially connected Members are partially correlated and weigh less than independent reports; member intelligence is asymptotic to public-record weight and cannot override it; there are no hard thresholds to target (attackers can't identify a magic number of reports that triggers a score change); the review queue verifies tips and attestations against primary sources before they affect scores.

4. **Visibility & revocation.** The scoring methodology is published on a public platform page. Entity profiles display the score badge with a tap-to-see-evidence affordance. Entities can challenge scores at T3. There is no "opt out" of being scored from public records — the records are public; the platform's contribution is aggregation and citation, not origination. An entity that believes the public record is wrong disputes the record at the source agency, not on the platform.

---

## What this means for existing commitments

### People-first principle
Impact Transparency strengthens the people-first stance. The old ownership tier encoded a judgment about business *structure* (local vs. corporate); the new system encodes evidence about business *behavior* (helps the many vs. helps the few). A locally owned business that lobbies against worker protections is not people-first just because it's local. The impact score catches what locality alone misses.

### Anti-extraction diagnostic
The five markers in `impact-diagnostic.md` become queryable. "Profit grows when customer cost grows" maps to PE ownership + MLR-pattern signals. "Repair and durability suppressed" maps to right-to-repair opposition signals. "Switching costs artificial" maps to antitrust enforcement signals. "Information asymmetry captured" maps to pricing-transparency signals. "Regulatory environment captured" maps to lobbying-spend signals. The diagnostic is no longer a conceptual framework — it's a data pipeline.

### Wealth circulation absolute
The scoring system's core axis — helps the many vs. helps the few — is a direct expression of the wealth-circulation absolute. Entities that circulate wealth (cooperatives, credit unions, locally owned businesses reinvesting in their communities) score high. Entities that extract wealth (PE rollups extracting margin, lobbyers capturing regulation for private benefit) score low. The system makes the abstract concrete.

### The locally-owned badge
Unchanged at b1. At b2+, the locality signal from `business-jurisdiction.md` feeds the impact score as one positive input. The badge itself persists as a standalone surface — a kind='business' Group can simultaneously display "Locally owned (verified)" and "Impact: Beneficial (4/5)." The two signals reinforce rather than replace each other.

---

## Integration points

- **Connects to:** `business-jurisdiction.md` (locality signal input), `groups.md` (kind='business' Group profiles consume the score), `design-language.md` (DLS token replacement), `impact-diagnostic.md` (the diagnostic this operationalizes), `community-platform.md` (discovery surfaces implement rules 1–3), `policy.md` (data-sourcing posture)
- **Used by:** Discovery/search ranking, entity profile pages, alternatives section, map pin rendering, the "research a company" surface
- **Depends on:** External data sources (OpenSecrets, EPA ECHO, OSHA, PitchBook, B Lab) — all publicly available, no paid API dependencies at T1
