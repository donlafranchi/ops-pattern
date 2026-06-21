---
id: why-community-health-rubric
purpose: Scored 0–3 rubric grading platform decisions against community-health theory.
layer: why
status: active
---

# Community Design Philosophy — Movers, Makers & Shakers

> **Status:** Foundational measuring stick. The structured 0–3 scored rubric used to evaluate every platform decision and periodically audit community health. When this document and another foundation doc conflict on a principle, the principle in [`principles.md`](principles.md) wins (this document is the *how-to-grade*; `principles.md` is the *what we have committed to*). When this document and a system spec conflict on a structural mechanism (schema, action handler, accountable-participation surface rule), the system spec wins — that's where the platform's *how* lives. Read alongside [`principles.md`](principles.md) (the P1–P8 constitution, the People-First Principle, the binary Decision Test, the categorical failures), [`policy.md`](policy.md) (the three filters + accountable-participation commitments + opt-out default), [`platform-promise.md`](platform-promise.md) (the public-facing commitments), [`member-journey.md`](../needs/member-journey.md) (the 13 loops this document scores), and [`primitives.md`](primitives.md) (Person / Item / Location / Group, the data spine every checklist item is graded against). Scoped to the platform's *what we are building toward*; the linked docs encode the *what we have refused at the schema and policy layer*.

> **Scoring scheme is subject to change.** The 0–3 scale, the five sections, and the per-item weighting are working defaults — useful for a structured measuring stick, not load-bearing as written. As real Members + real communities surface what's actually measurable (and what isn't), expect the rubric to evolve: items may collapse or split, sections may reweight, scores may shift to qualitative grades. The *pattern* — periodic structured audit complementing the per-proposal binary Decision Test — is what's load-bearing; the specific instrument is iterable.

A working document for evaluating platform design decisions against what makes communities actually work. Use this as a rubric, a feature roadmap lens, and a gut-check when building.

---

## 1. Healthy Community Attributes

### Principles

Healthy communities share structural traits that sociologists, cooperative theorists, and community designers have studied for decades. The short version: people need to feel **seen**, **heard**, **useful**, and **safe** — and they need to believe the system is **fair**.

Key frameworks drawn on here:

- **Dunbar's layers** — People maintain ~5 intimate, ~15 close, ~50 good, ~150 casual relationships. Platform design should respect these natural group sizes rather than pushing "scale everything."
- **Ostrom's commons governance** — Elinor Ostrom's 8 principles for managing shared resources without top-down control: clear boundaries, proportional costs/benefits, collective choice, monitoring, graduated sanctions, conflict resolution, self-determination, and nested enterprises.
- **Oldenburg's Third Places** — Communities need spaces that aren't home or work — low-stakes gathering spots where status is leveled and conversation flows. Digital equivalents matter.
- **Putnam's social capital** — Bonding capital (tight in-group trust) and bridging capital (cross-group connections) are both essential. Too much bonding without bridging creates cliques. Too much bridging without bonding creates shallow networks.
- **Cooperative identity principles (ICA)** — Voluntary membership, democratic control, member economic participation, autonomy, education, cooperation among cooperatives, concern for community.

### Checklist

Score each 0 (absent) → 1 (emerging) → 2 (strong) → 3 (thriving):

| # | Attribute | Score |
|---|-----------|-------|
| 1.1 | **Belonging** — New members can find "their people" within the first session | |
| 1.2 | **Visibility** — Members can see each other's contributions, not just consume content | |
| 1.3 | **Voice** — Every member has a channel to raise concerns or propose ideas | |
| 1.4 | **Agency** — Members can initiate things (events, groups, proposals) without asking permission | |
| 1.5 | **Fairness** — Rules apply equally; power is distributed, not concentrated | |
| 1.6 | **Proportional influence** — Those who contribute more have more say, but can't dominate | |
| 1.7 | **Transparency** — Decisions, finances, and rule changes are visible to all affected | |
| 1.8 | **Safety** — Members can participate without fear of harassment, exploitation, or retaliation | |
| 1.9 | **Bridging** — Cross-group connections exist; it's not just isolated cliques | |
| 1.10 | **Shared identity** — Members can articulate what this community is about and why it matters | |
| 1.11 | **Manageable scale** — Groups stay small enough for real relationships (Dunbar-appropriate) | |
| 1.12 | **Rhythm** — Recurring events, rituals, or cadences create predictability and anticipation | |

### Platform Implications

- Design for small groups first, federation second. Don't default to "everyone sees everything."
- Build contribution visibility into every surface — who did what, who helped whom.
- Provide proposal/initiative tools at the member level, not just admin level.
- Make governance records (meeting notes, votes, financial reports) default-visible within a community.
- Create natural "third place" spaces — low-stakes, informal, not transactional.
- Build cross-community discovery so bonding capital doesn't calcify into silos.

> **How this is encoded in the platform.** The Item primitive ([`../systems/item.md`](../systems/item.md)) makes member contribution structurally visible. Group ([`../systems/groups.md`](../systems/groups.md)) is opt-in and self-selected — no auto-assigned community membership. The accountable-participation commitments in [`policy.md`](policy.md) (messaging-scope item-or-group-only, every action tied to a real identity, complaint downvote/removal, "fix it" path) are the structural enforcement of attributes 1.5, 1.7, and 1.8.

---

## 2. Member Journey — Bottom Up

### Principles

Start from the individual and build upward. A platform that only thinks in terms of "the community" will design features that serve the collective but alienate the individual. The member journey is: **Discover → Join → Participate → Contribute → Lead → Own.**

Each stage has needs that must be met before the next stage becomes possible. Skip a stage and you get disengagement or, worse, resentful compliance.

> **The platform's 13 loops in [`member-journey.md`](../needs/member-journey.md) are this arc made concrete.** Family 1 (Gathering, loops 1–4) covers Discover and Join. Family 2 (Sharing, loops 5–6) covers Participate. Family 3 (Trade, loops 7–9) covers Contribute. Family 4 (Pooling, loops 10–12) covers Lead. Family 5 (Federation, loop 13) covers Own.

### 2a. What a Member Needs to Engage

Before someone joins anything, they need:

- **Legibility** — They can understand what this place is and whether it's for them within 30 seconds.
- **Low-risk entry** — They can lurk, browse, or attend one thing without committing.
- **A face** — They see real people, not just an interface. Names, photos, activity.
- **A reason to return** — Something upcoming, something unfinished, something they care about.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 2.1 | First-visit experience communicates purpose, people, and next step | |
| 2.2 | Members can observe before participating (lurk-friendly) | |
| 2.3 | Profile creation is lightweight — name and neighborhood, not a form interrogation | |
| 2.4 | "What's happening" surface shows upcoming events, active discussions, recent activity | |
| 2.5 | Member can find at least one person or group they relate to within first session | |

**Platform implications:** Onboarding should surface people and activity, not features. Show the community, not the product.

### 2b. Joining and Creating Groups

Groups are the atomic unit of community. They should be easy to join, easy to create, and easy to leave.

- **Joining** should be one action with optional introductions.
- **Creating** should require minimal overhead — a name, a purpose, and at least one other person.
- **Leaving** should be frictionless and carry no stigma.

Groups should have natural size limits. A "group" of 500 is a broadcast channel, not a group. Encourage splitting at natural thresholds (~50 active members) rather than unlimited growth.

> **Soft target — 2026-05-30.** The ~50 number cites Dunbar's "good relationships" layer as a working order of magnitude, not a contract. No platform enforcement, no flag if a Group grows past it. The principle is "encourage splitting at natural thresholds"; the specific number is illustrative.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 2.6 | Members can create a group in under 2 minutes | |
| 2.7 | Groups have clear stated purpose visible to potential joiners | |
| 2.8 | Group size is surfaced; large groups are encouraged to spawn sub-groups | |
| 2.9 | Members can belong to multiple groups without confusion | |
| 2.10 | Group discovery surfaces groups by interest, neighborhood, and activity level | |
| 2.11 | Inactive groups are visibly marked or archived, not left as ghost towns | |

**Platform implications:** Group creation is a first-class action, not an admin feature. Build in size awareness and natural splitting tools. Show group health metrics (activity, engagement, new member rate) to group organizers.

> **In the platform.** Six Group kinds at b1 ([`../systems/groups.md`](../systems/groups.md)) — five affiliate (place / interest / practice / event_anchored / family) + one operate (business). Groups are emergent and optional; no Member is ever auto-assigned. Items at Locations carry loops 1, 3, 4, 7, 8, 9 *without* requiring Group membership — the platform works for the unaffiliated and rewards the affiliated.

### 2c. Having Voice and Say in Decisions

Voice means more than "post a comment." It means structured mechanisms for input to matter:

- **Proposals** — Any member can propose something (an event, a rule change, a project).
- **Discussion** — Proposals get visible, time-bounded discussion.
- **Voting/consensus** — Decisions use transparent processes with clear outcomes.
- **Feedback loops** — Members see what happened with their input.

The danger zone: building "feedback" features that are actually suggestion boxes where nothing happens. That's worse than no voice at all.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 2.12 | Any member can create a proposal (not just admins/leaders) | |
| 2.13 | Proposals have structured discussion with visible participation | |
| 2.14 | Decision mechanisms exist (voting, consent, ranked choice — appropriate to context) | |
| 2.15 | Decision outcomes are recorded and visible | |
| 2.16 | Members can see what happened with past proposals (accepted, rejected, modified) | |
| 2.17 | Escalation paths exist for unresolved disagreements | |

**Platform implications:** Build a proposal → discussion → decision pipeline as core infrastructure. Every decision should leave a visible trail. Provide multiple decision mechanisms (simple majority, consent-based, ranked choice) so groups can pick what fits.

### 2d. Building Reputation and Trust

Reputation should be **earned, visible, contextual, and portable** (within the platform).

- **Earned** — Through actions, not claims. Completed transactions, kept commitments, peer endorsements.
- **Visible** — Others can see your track record before engaging with you.
- **Contextual** — Being a great event organizer doesn't automatically make you a trusted seller.
- **Portable** — Your reputation in one group should partially transfer to another, but not fully (context matters).

Avoid the trap of reducing trust to a single number. A "4.7 star" rating flattens all the useful signal. Instead, surface specific trust indicators: "completed 23 trades, all on time" or "organized 8 events, average 15 attendees."

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 2.18 | Reputation is built through verified actions, not self-reported claims | |
| 2.19 | Trust indicators are contextual (trade reputation ≠ event reputation ≠ governance reputation) | |
| 2.20 | Members can see specific trust evidence, not just aggregate scores | |
| 2.21 | New members have a credible path to building reputation quickly | |
| 2.22 | Reputation is partially portable across groups within the platform | |
| 2.23 | Reputation can recover — past mistakes don't permanently brand someone | |
| 2.24 | Endorsements from trusted members carry more weight than anonymous ratings | |

**Platform implications:** Build a multi-dimensional reputation system. Track actions (trades completed, events hosted, proposals passed, commitments kept) and let context determine which dimensions are visible. Provide a "new member boost" pathway — perhaps through vouching, mentorship, or verified introductory activities.

> **In the platform.** [`principles.md`](principles.md) Part 2 (The People-First Principle) refuses ranking of people — "No ranking of people. We review *treatment*, not the person." Star-rating leaderboards are the Yelp / Angi failure mode and are categorically refused; treatment reviews (the four pillars: Customers / Employees / Community / Planet) surface as peer-pressure for good behavior without producing a price-of-being-found column. The action layer ([`../systems/action-layer.md`](../systems/action-layer.md)) audits every action with `acting_member_id` + `via_delegation_id`, giving every Member an earned, contextual track record by construction.

---

## 3. Healthy Peer Pressure & Self-Regulation

### Principles

Top-down moderation doesn't scale and breeds resentment. The goal is a community that mostly regulates itself through social mechanisms — the same way healthy neighborhoods, cooperatives, and professional communities have always worked.

This draws on Ostrom's graduated sanctions, restorative justice principles, and the sociological concept of "informal social control" — the idea that most people behave well not because of rules, but because of relationships.

Key insight: **People behave better when they're known.** Anonymity enables bad behavior. Persistent identity within a community is the single most powerful self-regulation mechanism.

### 3a. Social Accountability Mechanisms

- **Persistent identity** — Every action is tied to a real, known community member. Not necessarily legal-name public, but known within their groups.
- **Visible track record** — Your history of interactions is part of your profile. Not a surveillance log — a track record, like a small-town reputation.
- **Mutual obligation** — Members have duties to each other, not just rights. Joining a group means accepting its norms.
- **Peer endorsement and flagging** — Members can vouch for good actors and flag concerning behavior, creating distributed sensing.

### 3b. Graduated Consequences (Community-Driven)

Following Ostrom, consequences should escalate proportionally and be administered by the community, not a distant platform:

1. **Informal reminder** — A peer reaches out privately. "Hey, that's not how we do things here."
2. **Visible notation** — A pattern of flags results in a visible (to group members) note on the member's profile. Not punitive — informational.
3. **Temporary restrictions** — The group (not an admin) votes to restrict a member's participation for a defined period.
4. **Removal from group** — The group decides, through its own governance process, to remove a member.
5. **Platform-level action** — Only for serious violations (fraud, safety threats, legal issues). This is the platform's role, not the community's.

The critical distinction: steps 1–4 are **community decisions**. The community sets its norms, enforces them, and decides consequences. The platform only intervenes at step 5.

### 3c. Transparency as Regulation

Bad behavior thrives in darkness. Make actions visible:

- Transaction histories are visible to both parties.
- Group decisions are logged and visible to members.
- Financial flows within community enterprises are transparent to participants.
- Dispute resolutions are recorded (anonymized if needed) so patterns are visible.

### Checklist

| # | Item | Score |
|---|------|-------|
| 3.1 | All actions are tied to persistent, known identities within groups | |
| 3.2 | Member track records are visible and contextual | |
| 3.3 | Peers can flag concerns privately before they become formal | |
| 3.4 | Groups can define and enforce their own behavioral norms | |
| 3.5 | Consequences escalate gradually (reminder → notation → restriction → removal) | |
| 3.6 | Consequence decisions are made by the community, not platform admins | |
| 3.7 | Transparency defaults are high — actions, decisions, and finances are visible | |
| 3.8 | Dispute resolution exists at the group level before escalating to platform | |
| 3.9 | Restorative paths exist — members can make amends and re-earn trust | |
| 3.10 | Platform intervention is reserved for safety, fraud, and legal violations only | |

### Platform Implications

- Build identity at the group level — members are known within their communities.
- Provide flagging tools that go to group leadership, not a platform moderation queue.
- Give groups governance tools for managing their own membership (voting on restrictions, setting norms documents, etc.).
- Build dispute resolution workflows: member-to-member → group mediation → platform arbitration (last resort).
- Create transparency dashboards for group finances, decisions, and activity.
- Make the restorative path explicit — what does a member need to do to recover from a violation?

> **In the platform.** The accountable-participation commitments in [`policy.md`](policy.md) — messaging-scope item-or-group-only, every action tied to a real identity, community downvote/removal as the affirmative replacement for moderation-by-deletion, "create an Item to lead the fix" replacing the complaint surface — are the structural answer for 3.4, 3.6, and 3.10. The Group's role-per-kind system in [`../systems/groups.md`](../systems/groups.md) gives groups governance tooling without imposing it.

---

## 4. Community Ownership Arc

### Principles

The most important thing a community platform can do is get out of the way of communities building real wealth and real power. The arc goes: **Participate → Collaborate → Co-invest → Co-own → Self-determine.**

This draws on:

- **Cooperative economics** — Member-owned enterprises where surplus returns to members, not investors.
- **Community land trusts** — Collectively owned property held in perpetuity for community benefit.
- **Community wealth building** — The Cleveland Model, Mondragon, Emilia-Romagna — real-world examples of communities that built lasting economic power through cooperative structures.
- **Platform cooperativism** — The idea that platforms themselves should be owned by their users, not extractive shareholders.

### 4a. From Participation to Collaboration

First, people do things together informally:

- Neighbors share tools, skills, and time.
- Groups organize events, cleanups, mutual aid.
- Members trade goods and services peer-to-peer.

This stage builds the social capital and trust that makes economic cooperation possible later.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 4.1 | Peer-to-peer exchange is easy and visible (tool sharing, skill trading, goods) | |
| 4.2 | Group projects can be organized and tracked (events, cleanups, initiatives) | |
| 4.3 | Mutual aid mechanisms exist (requests, offers, matching) | |
| 4.4 | Collaboration history is tracked and contributes to reputation | |

**Platform implications:** Build exchange, project coordination, and mutual aid as core features — not afterthoughts. These are the roots of the ownership tree.

### 4b. Community-Owned Businesses

When a group has enough trust and shared purpose, they may want to run a business together:

- A neighborhood co-op store.
- A collectively owned food truck.
- A shared workshop or maker space.
- A group buying club that negotiates bulk pricing.

The platform should make this possible without requiring an MBA or a lawyer:

- **Entity formation guides** — Walk groups through creating LLCs, cooperatives, or informal partnerships appropriate to their scale.
- **Shared treasury** — Group-controlled funds with transparent accounting, defined contribution and withdrawal rules, and multi-signature authorization.
- **Revenue sharing** — Configurable models for how surplus is distributed (equal shares, proportional to contribution, reinvested, donated).
- **Governance templates** — Pre-built structures for decision-making, officer roles, meeting cadences, and conflict resolution.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 4.5 | Groups can create shared treasuries with transparent accounting | |
| 4.6 | Multiple revenue/surplus distribution models are supported | |
| 4.7 | Entity formation guidance is accessible within the platform | |
| 4.8 | Governance templates are available for community enterprises | |
| 4.9 | Multi-signature authorization exists for financial decisions | |
| 4.10 | Business performance dashboards are visible to all members of the enterprise | |

**Platform implications:** Financial infrastructure is the unlock here. Shared wallets, transparent ledgers, configurable distribution rules, and governance tooling for economic entities.

> **In the platform.** [`../systems/groups.md`](../systems/groups.md) treats kind='business' Groups with multiple owner-role memberships as the cooperative-shape primitive at b1. The platform deliberately does not yet move money or file paperwork — co-owning, voting, distributing are off-platform verbs the platform records but doesn't drive. See `groups.md` § "What the platform drives versus what it records."

### 4c. Community-Owned Property

The highest-stakes and highest-impact form of community ownership:

- **Community land trusts** — Collectively owned land held for permanent community benefit (affordable housing, community gardens, shared spaces).
- **Shared spaces** — Co-working spaces, commercial kitchens, event venues owned by the community that uses them.
- **Equipment libraries** — Collectively owned tools, vehicles, and equipment managed by the community.

This requires serious governance, financial infrastructure, and legal scaffolding. The platform's role is to make this achievable by providing the tools and templates, not to own or control the assets.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 4.11 | Asset registry exists for community-owned property | |
| 4.12 | Usage scheduling and access management for shared assets | |
| 4.13 | Maintenance tracking and cost-sharing for shared property | |
| 4.14 | Legal templates for community ownership structures | |
| 4.15 | Investment/contribution tracking for members | |

**Platform implications:** Build asset management tools — registry, scheduling, maintenance tracking, cost allocation. Partner with legal resources to provide templates for CLTs, co-ops, and shared ownership structures.

### 4d. Wealth-Building Mechanisms

Community ownership should build wealth for members, not just create shared resources:

- **Equity accumulation** — Members build ownership stakes over time through patronage, labor, or investment.
- **Surplus distribution** — Community enterprises return surplus to members proportionally.
- **Appreciation sharing** — As community assets appreciate, that value accrues to members, not external investors.
- **Skills and credentials** — Participation builds verifiable skills and reputation that have economic value.
- **Group purchasing power** — Collective bargaining for insurance, supplies, services, and wholesale goods.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 4.16 | Members can build equity stakes in community enterprises | |
| 4.17 | Surplus distribution is transparent and proportional | |
| 4.18 | Skills/credentials gained through participation are portable and verifiable | |
| 4.19 | Group purchasing/negotiation tools exist | |
| 4.20 | Financial education resources help members understand ownership and wealth-building | |

**Platform implications:** Track member contributions and equity positions. Build surplus distribution engines. Create verifiable skill/credential records. Provide group negotiation tools and financial literacy resources.

### 4e. The Cooperative Evolution

The endgame: communities that are fully self-determining. They set their own rules, manage their own economies, and shape their own futures. The platform becomes infrastructure they use, not a landlord they depend on.

Indicators that a community has reached this stage:

- They generate their own revenue and manage their own finances.
- They elect their own leadership and make their own governance decisions.
- They resolve their own disputes.
- They create new sub-communities and enterprises autonomously.
- They could, in theory, leave the platform and continue operating.

That last point is critical: **the platform should never create lock-in that prevents communities from being self-sufficient.** Data portability, open standards, and exportable governance records are not just nice features — they're ethical requirements.

**Checklist:**

| # | Item | Score |
|---|------|-------|
| 4.21 | Communities can export all their data (members, transactions, decisions, assets) | |
| 4.22 | Governance is fully community-controlled (platform doesn't override community decisions) | |
| 4.23 | Revenue generation and financial management are self-service | |
| 4.24 | Communities can spawn sub-communities and enterprises without platform approval | |
| 4.25 | Community identity and culture are distinct from platform brand | |

**Platform implications:** Build for data portability from day one. Use open standards. Make export easy. Design governance tools that the platform doesn't have override access to. Let communities develop their own brand, culture, and identity within (and eventually beyond) the platform.

> **In the platform.** [`member-journey.md`](../needs/member-journey.md) Family 5 (Federation, loop 13) is this stage in the platform's roadmap — when a Community grows deep enough infrastructure (banking, insurance, intelligence), it *spawns into a separate federated platform*. Mondragon is the model. The platform's structural commitment to data portability and federation-portability is encoded in [`agent-assistance.md`](agent-assistance.md) and the action-layer event log invariants ([`../systems/action-layer.md`](../systems/action-layer.md)).

---

## 5. Platform as Enabler

### Principles

The platform is **infrastructure, not government.** It provides services that no single community would build for itself, but that all communities benefit from. Think of it like a municipal utility: it maintains the pipes, but it doesn't tell you how to use the water.

The platform's legitimate roles:

- **Trust infrastructure** — Identity verification, reputation frameworks, dispute resolution as a last resort.
- **Technical infrastructure** — Hosting, payments, communication tools, data management.
- **Cross-community services** — Discovery, federation, shared resources, inter-community trade.
- **Standards and interoperability** — Common formats, protocols, and interfaces so communities can interact.
- **Safety floor** — Enforcing legal requirements and preventing the most serious harms (fraud, abuse, illegal activity). Not behavioral policing.
- **Education and templates** — Governance templates, financial literacy, cooperative formation guides, best practices.
- **Insights and data** — Aggregate analytics that help communities understand themselves without exposing individual data.

The platform's illegitimate roles:

- **Deciding community governance** — Communities govern themselves.
- **Overriding community decisions** — Unless legal/safety violations are involved.
- **Extracting disproportionate value** — Platform fees should be transparent, proportional, and reinvested.
- **Creating dependency** — Communities should be able to function without the platform if they choose.
- **Picking winners** — The platform doesn't favor certain communities, businesses, or members.

### 5a. Infrastructure Services

What the platform provides that communities wouldn't build alone:

- **Identity and verification** — Confirm that members are real people in real locations without requiring communities to build their own KYC.
- **Payment processing** — Handle money movement, tax reporting, escrow, and compliance so communities don't have to.
- **Communication infrastructure** — Messaging, notifications, video, event management — the plumbing that every community needs.
- **Data storage and management** — Secure, backed-up, and compliant data infrastructure.
- **Mobile and web access** — The actual applications members use.

### 5b. Cross-Community Services

The unique value of a platform with multiple communities:

- **Discovery** — Help members find communities, groups, businesses, and people across the platform.
- **Inter-community trade** — Enable transactions between members of different communities.
- **Shared resource pools** — Communities can share equipment, spaces, or services with each other.
- **Federation** — Communities can form alliances, share governance structures, or create meta-communities.
- **Cross-pollination** — Surface relevant activity from adjacent communities to prevent siloing.

### 5c. Trust Frameworks

Trust that spans communities requires platform-level infrastructure:

- **Reputation portability** — A member's track record in one community carries (appropriate, partial) weight in another.
- **Dispute resolution** — When community-level mediation fails, a platform-level arbitration process.
- **Fraud detection** — Pattern recognition across communities that no single community could do alone.
- **Verified credentials** — Platform-verified badges (real identity, local resident, licensed professional) that communities can rely on.

### 5d. Data and Insights

Aggregate intelligence that helps communities without compromising individuals:

- **Community health metrics** — Activity trends, engagement patterns, growth rates — available to community leaders.
- **Benchmarking** — How does this community compare to similar ones? (opt-in, anonymized)
- **Economic insights** — Local spending patterns, demand signals, opportunity identification.
- **Impact measurement** — Quantified community impact (jobs created, money circulated locally, assets owned).

### Checklist

| # | Item | Score |
|---|------|-------|
| 5.1 | Platform provides identity/verification without communities building their own | |
| 5.2 | Payment infrastructure handles compliance, escrow, and tax reporting | |
| 5.3 | Communication tools are built-in and don't require third-party services | |
| 5.4 | Cross-community discovery surfaces relevant people, groups, and businesses | |
| 5.5 | Inter-community trade and resource sharing is supported | |
| 5.6 | Reputation is portable across communities with appropriate context | |
| 5.7 | Platform-level dispute resolution exists as a last resort | |
| 5.8 | Fraud detection operates across communities | |
| 5.9 | Community health dashboards are available to leaders | |
| 5.10 | Economic impact measurement is built in | |
| 5.11 | Platform fees are transparent, proportional, and clearly communicated | |
| 5.12 | Data portability and export are available at any time | |
| 5.13 | Platform governance itself is transparent and accountable to communities | |
| 5.14 | No single community or member gets preferential treatment | |
| 5.15 | Platform decisions that affect communities are communicated in advance with input mechanisms | |

### Platform Implications

- Build shared infrastructure that creates genuine network effects — things that get better with more communities, not things that create lock-in.
- Keep platform fees transparent and tied to real costs. If the platform becomes a cooperative itself, even better.
- Invest in cross-community features early — this is the moat, and it's also the value proposition. A community that's connected to 50 other communities is more valuable than one that stands alone.
- Build the safety floor (fraud detection, legal compliance, identity) so communities don't have to, but keep the ceiling open — don't cap what communities can do.
- Make platform governance itself transparent. If you're asking communities to be transparent, the platform must lead by example.

> **In the platform.** [`platform-promise.md`](platform-promise.md) is the public-voice version of this section: the fee philosophy, "your relationships with your customers belong to you," "you will never pay for visibility," "your growth is the metric." [`policy.md`](policy.md) encodes the three-filter test that every revenue line and data-sharing surface must survive. [`principles.md`](principles.md) Categorical Failures rules out the illegitimate roles structurally (no engagement-shaped ad injection, no data-as-product, no gatekeeping ratings, no founder-as-CEO patterns, no centralized override).

---

## Scoring Guide

**Total possible: 75 points** (25 items × 3 max each... well, there are more than 25 items above, but you get the idea — score each item 0–3).

Add up all checklist scores and evaluate:

| Range | Assessment |
|-------|-----------|
| 0–25% of max | **Foundation missing** — Core community infrastructure isn't there yet. Focus on basics: identity, groups, communication, transparency. |
| 25–50% | **Emerging** — Building blocks exist but gaps prevent the community from self-sustaining. Identify the weakest section and prioritize. |
| 50–75% | **Functional** — Community can operate but isn't reaching its potential. Focus on the ownership arc and self-regulation — that's where the magic is. |
| 75–100% | **Thriving** — Community infrastructure is strong. Now focus on cross-community features and the cooperative evolution. |

Use this rubric quarterly. Compare scores over time. The goal isn't perfection — it's intentional, visible progress toward communities that own their own destinies.

---

## Quick Reference: What to Build When

**Phase 1 — Foundation (Sections 1 + 2a–2b)**
Identity, profiles, groups, activity feeds, events, basic exchange.

**Phase 2 — Voice & Trust (Sections 2c–2d + 3)**
Proposals, voting, reputation system, peer flagging, dispute resolution.

**Phase 3 — Economic Infrastructure (Sections 4a–4b + 5a–5b)**
Shared treasuries, payment processing, group businesses, cross-community trade.

**Phase 4 — Ownership (Sections 4c–4e + 5c–5d)**
Asset management, equity tracking, data portability, community self-governance, impact measurement.

Each phase builds on the trust and social capital established in the previous one. Don't skip ahead — a community that tries to co-own property before it's figured out basic governance will fail.
