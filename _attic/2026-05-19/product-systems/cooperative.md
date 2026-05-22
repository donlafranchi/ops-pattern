# System: Cooperative

> **🚨 RETIRING (2026-05-10) — deferred indefinitely per [`groups.md`](groups.md).**
>
> Cooperative-style coordination (co-owning, voting, distributing) involves verbs that happen *off-platform* — securities filings, formal votes, distribution checks, governance under operating agreements. The platform's role re those verbs is not yet well-understood, and shipping schema for them now risks painting into a corner.
>
> **What changes vs. ADR-11.** The prior plan was to reserve schema at b1 (`cooperative_cohort` Item kind, empty `cooperatives` and `cooperative_assets` tables) and surface the full pattern at b3. That reservation is **dropped.** No schema lands at b1; the Item kind enum does not include `cooperative_cohort`. ADR-11 is fully superseded by the Groups ratification.
>
> **What still serves the use case in the meantime.** Members who are co-owners of an off-platform cooperative can represent that on-platform as a kind='business' Group with multiple `owner`-role memberships — the partnership shape is the closest fit. The Group records the co-ownership; the platform does not custody the legal entity, the votes, or the distributions. When the platform's relationship to off-platform legal coordination has clarified, a future spec will revisit cooperative-specific affordances.
>
> **Status of this file.** Stays in tree as historical reference. Do not extend or cite as a planned deliverable. The "co-owner ↔ co-owners" framing remains a real platform aspiration, but it is not modeled. Cross-references in `member.md`, `b1-primitives.md`, `notes/migration-to-primitives.md`, and `planning/DECISIONS.md` (ADR-11) will be re-pointed during the migration plan rewrite.

**Status:** RETIRING — see banner above. Deferred indefinitely.

**Purpose (retained for historical context):** Establish the **Cooperative** primitive — the registered legal entity through which Members co-own productive assets — distinct from but anchored to the Community primitive (the affinity group) and the Member-Operations primitive (the per-Member capacity declaration). Real estate first, expanding over time to other co-owned forms. Anchored locally, federated regionally and eventually nationally. This is the system that converts the platform's stakeholder framing from a participation record into literal proportional ownership of community assets. It establishes **co-owner ↔ co-owners** as a third structural relationship, alongside maker ↔ follower (commerce) and initiator ↔ supporters (agency).

**Bundles:** b1 (schema reservation only — `cooperative_cohort` reserved as an `items.kind` value, `cooperatives` and `cooperative_assets` tables created empty). b3 (T1 surface). Unbundled at T2 and T3. Depends on Member, Community, Initiatives, and the Item primitive being live and mature, with at least one Initiative cohort having reached active state. Schema-reservation pattern follows the same logic as the Self-Record / Delegation substrate (per ADR-6) — ship empty at b1 to avoid retrofit failure mode at b3.

**Companion specs:** [`primitives.md`](../foundation/primitives.md) · [`people-first.md`](../foundation/people-first.md) · [`community.md`](community.md) (Cooperative is distinct from the Community-of-`kind=cooperative` affinity wrapper) · [`member.md`](member.md) · [`member-operations.md`](member-operations.md) (`cooperative_member` capacity links a Member to a Cooperative through their Operation) · [`item.md`](item.md) (`cooperative_cohort` is an Item kind reserved at b1) · `initiatives.md` (forthcoming — an Initiative may graduate into a Cooperative)

**Decisions encoded:** ADR-6 (audit fields on every event) · ADR-7 (action layer is the only write surface) · ADR-9 (policy framework, opt-out default, three-filter test for capital + governance surfaces) · ADR-11 (Cooperative as separate entity from Community) · ADR-12 (Maker is an explicit, toggle-able role declaration — the `cooperative_member` Operation is one path through the "Become a Maker" walkthrough). Co-ownership is a verb declared via Operation, not a stored identity.

**North stars served:** Buy Close (primary — co-owned local real estate is the durable form of community wealth retention), Belong (primary — proportional ownership is the deepest possible stake in a place), Learn and Build Together (secondary — co-op formation is itself a learning project for participating Members).

> Map to numbered north stars from `product/foundation/north-stars.md` before scenario approval.

## What Cooperatives Are and How They Differ From Initiatives

A Cooperative is a legal entity — typically a Limited Cooperative Association or an LLC operating under a cooperative agreement — that holds productive assets on behalf of its Member-owners. Members hold proportional shares; benefits (income distributions, appreciation, sometimes use rights) flow through proportionally; governance is one-Member-one-vote regardless of share size, per cooperative principle.

Cooperatives is distinct from Initiatives, and the distinction is load-bearing:

| Dimension | Initiative | Cooperative |
|---|---|---|
| Output | An operating business (or other economic capacity) | A legal entity holding co-owned assets |
| Time horizon | Months to a few years to formation | Years to a decade+ of ongoing operation |
| Member relationship | Initiator + supporters who help launch | Co-owners with permanent proportional stake |
| Capital structure | Pledges, often informal; the business itself raises capital | Member equity contributions into the entity; entity may also borrow |
| Legal exposure | Low until capital actually moves | Securities law applies from the moment shares are offered |
| Exit | Initiative succeeds (becomes a business) or closes | Members redeem shares per operating agreement; entity persists |
| Governance | Initiator-led during formation | Member-governed in perpetuity |

An Initiative can *graduate into* a Cooperative — a community organizes around starting a worker-owned bakery, and the bakery is structured as a worker co-op. A Cooperative can also form independently of any Initiative — twenty members of a community decide to form a Real Estate Cooperative to acquire a single neighborhood building, with no operating business attached. The two systems are siblings, not parent-child.

The relational primitive — **co-owner ↔ co-owners** — is the third in the platform's primitive set. Maker ↔ follower describes commerce. Initiator ↔ supporters describes agency. Co-owner ↔ co-owners describes durable shared ownership of the means by which a community holds wealth. All three are required for the platform's full claim about itself; without Cooperatives, Members can spend locally and start things locally but cannot *own* locally at any meaningful scale.

## The Three-Tier Federated Architecture

This is the structural commitment that makes Cooperatives faithful to the movement rather than a community-flavored REIT. Each tier has distinct legal status, governance, and platform responsibilities.

**Local — the Cooperative.** A single legal entity formed by Members of one (or a few adjacent) Communities, holding one or a small number of co-owned assets in a defined geography. Members hold direct shares in this entity. Decisions about its assets are made by these Members. This is the unit of ownership; everything federates upward from here. There is no centralized Cooperative — only many local ones.

**Regional — the Federation.** Multiple local Cooperatives in a region (city, metro, or state) federate to share infrastructure without merging. Three federation functions: shared back-office (one bookkeeper, one attorney, one compliance officer serves twenty Cooperatives at fractional cost per Cooperative), opt-in cross-investment (a Member of Oak Park's Cooperative can allocate a portion of capital to a regional fund holding positions across federated Cooperatives, for diversification), and risk pooling (shared property insurance, eventual emergency fund, eventual community-wide insurance offerings — including the independent-medical-practice insurance pattern). Federation members are Cooperatives, not individual Members. Each Cooperative retains full local sovereignty over its own assets; federation membership is opt-in and reversible.

**National — the Federation of Federations.** Multi-decade build, modeled on Mondragon's federation structure and the existing US cooperative federation infrastructure (Cooperative Fund of New England, Shared Capital Cooperative). Functions: legal templates and counsel network, capital aggregation through CDFI partnerships, standards for cooperative governance and financial reporting, advocacy. The national tier holds no assets itself — it provides infrastructure that lowers the cost and risk of forming and operating local Cooperatives.

The platform's relationship to each tier is different. At the Local tier, the platform is the cohort formation surface and (eventually) the member-facing share ledger and governance interface. At the Regional tier, the platform is the federation directory and the member-facing surface for cross-investment opt-ins. At the National tier, the platform is a publishing and template surface; the institution itself sits adjacent to the platform, partnering with it.

## T1 — MVP Tier (the miniscule starting point)

The smallest version that makes Members into co-owners with real proportional stake and real financial participation. Every line below is a deliberate constraint to keep activation energy low.

**The miniscule starting point: one local Real Estate Cooperative, one income-producing property, twelve to twenty-five Members, capital contributions of $500 to $5,000 per Member.**

Total Member equity in the range of $25k–$100k, combined with conventional or community-lender debt, supports acquisition of a single small property — a duplex, a small commercial building, a single-family rental, a vacant lot with development potential. Members receive proportional rental income distributions (or, for non-income properties, hold shares against appreciation only). The Cooperative is a real legal entity; Members are real co-owners with real shares; financial security is modest but real and compounding.

The platform's role at T1 is the cohort formation, structured pledge, and public record surface. The actual entity formation, securities filing, capital custody, and asset acquisition happen off-platform with counsel. The platform tracks the cohort and publishes the outcome.

- **Cooperative cohort posting** — a Member can post a Cooperative cohort within their Community (a sixth post type, sibling to Initiative). Required fields: name, geography, asset type (real estate at MVP; enum reserves worker, consumer, multi-stakeholder for future), target Member count range, target capital range per Member, narrative ("what this Cooperative is for, what asset class, what we don't yet know"). Linked first **Gathering** required, identical to Initiative.
- **Two response kinds**, identical primitives to Initiative: **Encouragement** (lightweight signal) and **Pledge** (capital intent at a specific dollar range, non-binding, free-text body for terms or questions). Pledges are explicitly framed as non-binding intent; the legal commitment happens later when the entity is formed and the subscription agreement is signed.
- **Off-platform handoff prompts.** When a cohort reaches a configurable threshold (working default: 10 Members with Pledges totaling at least $25k of intent), the platform surfaces a structured handoff to legal counsel — a recommendation to engage Sustainable Economies Law Center or equivalent, a pre-built document checklist, and a pause point for the cohort to take the next step off-platform. The platform does not custody capital, does not file securities, and does not draft operating agreements at T1.
- **Cooperative record.** Once an off-platform Cooperative is formed and an asset is acquired, the cohort's posting transitions to a **Cooperative record** — a public read-only page noting: entity name, formation date, Member count, asset type, asset address (when public), and a free-text periodic update field maintained by a designated Cooperative liaison. Share counts and distribution amounts are not displayed publicly at T1.
- **Member co-ownership badge.** A Member who is on record as a co-owner in a registered Cooperative receives a badge on their Member profile. Visibility settings inherit from `members.stakeholder_visibility` (per Member system T3), defaulting to Community-only.
- **Securities-law guardrails baked into the surface.** Every Pledge interaction surfaces a brief, plain-language disclaimer that Pledges are non-binding intent and that any actual investment requires a separate legal process with counsel. The platform deliberately uses the language "intent to invest" rather than "investment" or "commitment." Working assumption: this combined with no capital custody and the off-platform handoff keeps the T1 surface outside the active reach of securities law. **Confirm with counsel before launch.**
- Cohort postings inherit Community's flag-and-hide moderation and cross-visibility (per Community), but with an expanded default cross-visibility radius (working default: same metro region rather than same city) because cohort formation often crosses neighborhoods.

## T2 — Core Tier

- **Member share ledger** — read-only mirror of the off-platform legal entity's cap table, displayed on the Member's profile (private by default, semi-public on opt-in). Member sees their share count, capital contributed, current valuation estimate (where available), and distribution history. Source of truth remains the off-platform entity's actual cap table; the platform's display is a synced read view.
- **Distributions surface** — when a Cooperative makes a distribution to Members, it can be recorded on the platform and surfaced to the receiving Member as part of their stakeholder dashboard.
- **Governance surface** — Member voting on Cooperative governance items (operating agreement amendments, asset acquisitions, budget approvals). One-Member-one-vote per cooperative principle, regardless of share size. Voting is binding under the Cooperative's operating agreement; the platform is the voting interface.
- **Cooperative templates.** Pre-vetted templates for the most common patterns at T2: single-property residential rental Cooperative, single-property commercial Cooperative, vacant-land hold Cooperative, worker Cooperative for a single trade, consumer Cooperative for a single shared resource (commercial kitchen, tool library at scale).
- **Federation surface** — local Cooperatives can join a Regional Federation (working name; user-facing label TBD) and access shared back-office, group purchasing, and cross-Cooperative coordination. Federation membership is a separate legal step requiring its own counsel.
- **Cross-investment opt-in** — Members of any federated local Cooperative can allocate a portion of new capital contributions to a Regional cross-investment vehicle that holds positions across federated Cooperatives. This is the diversification path for Members who want real estate exposure beyond a single asset.

## T3 — Polish Tier

- **National federation tier** — federation directory, template library, CDFI partnership infrastructure, shared advocacy and research surfaces. Multi-decade build aligned with the Mondragon timeline.
- **Risk pooling at scale** — shared insurance products across federated Cooperatives, including the independent-medical-practice protection pattern (per the platform's broader long-term vision). Requires substantial regulatory and actuarial infrastructure; almost certainly via partnership with existing cooperative insurers (e.g., Cooperative Insurance Companies).
- **Secondary market for shares** — within the constraints of cooperative principles and securities law, a structured intra-Cooperative or intra-Federation mechanism for Members to redeem or transfer shares without forced liquidation of underlying assets. This is the liquidity solution to the lock-up problem; almost certainly slow, structured, and limited.
- **Cooperative-of-Cooperatives capital products** — federated capital products that allow a Member to hold a diversified position across many Cooperatives nationally, structured to remain within cooperative principles rather than drifting into REIT logic.
- **Public Cooperative pages** — recruitment surface for prospective Members exploring Cooperative formation in their area.

## Data model implications

**Required at MVP — retrofit is the failure mode.** The Cooperatives system is the highest-risk retrofit surface on the platform because shares, distributions, and governance votes are legally consequential records. Every column reserved at T1 saves a regulatory and audit headache later.

**Three-row separation, not three-rows-in-one.** The Cooperative system relies on three distinct rows that are easy to conflate but architecturally separate:

1. **The Item of `kind=cooperative_cohort`** — the cohort *posting* during formation. Lives in `items` + `item_cooperative_cohorts` (1:1 child table, mirroring `item_products` etc per `item.md`'s spine + child-table architecture). Has a public page at `/i/[slug]`, has `item_responses` for encouragements and pledges. Deleted-or-archived once the off-platform formation completes and the Cooperative record is created.
2. **The `cooperatives` row** — the registered legal entity. Created when off-platform formation completes. Holds the cap-table mirror, the asset list, the federation membership.
3. **The Member's `cooperative_member` Operation** (per `member-operations.md`) — the Member's per-capacity declaration that they hold co-ownership in this specific Cooperative. The `member_operations` row carries `community_id` for the affinity wrapper Community (if one exists) and a new `cooperative_id` FK to the Cooperative entity. **The Member's relationship to the Cooperative is carried entirely on `member_operations`.** There is no separate `cooperative_memberships` table — that would duplicate Operations.

**Schema additions (b1 — schema reservation only, no rows written):**

- Extend `items.kind` enum to include `cooperative_cohort` (alongside `product`, `service`, `gathering`, `wonder`, and the reserved `offer`, `ask`, `initiative`).
- Table `item_cooperative_cohorts` (1:1 with `items` where `kind='cooperative_cohort'`, FK = `item_id`):
  - `item_id` PK FK, `state` (`forming` / `legal_handoff` / `formed` / `closed` / `withdrawn` — at T1 only `forming`, `legal_handoff`, `formed`, and `closed` are used), `asset_kind` (enum: `real_estate`; reserve `worker`, `consumer`, `multi_stakeholder`), `target_member_count_min`, `target_member_count_max`, `target_contribution_min_cents`, `target_contribution_max_cents`, `formed_cooperative_id` (nullable FK to `cooperatives` — populated when the cohort completes formation).
  - Pledges and encouragements use `item_responses` with `response_kind` extended to include `pledge_intent` (already partially reserved per `item.md` line 100; clarify `pledge` vs `pledge_intent` semantic in the migration). The `item_responses.metadata` JSONB carries `{intent_amount_min_cents, intent_amount_max_cents, body, is_anonymous}` for `pledge_intent` rows. **Language: `intent_amount` not `pledge_amount`** — deliberate and consistent with the securities-law posture.
- Table `cooperatives` (b1: schema reserved; no rows until b3):
  - `id` uuid PK, `cohort_item_id` (FK to `items.id`, nullable — a Cooperative may form without a cohort post in some edge cases), `legal_name`, `entity_kind` (enum: `lca`, `llc_coop_agreement`, `other`), `state_of_formation`, `formed_at`, `liaison_member_id` (FK to `members.id`), `dissolved_at` (nullable). The registered entity record. Created when an off-platform formation completes.
- Table `cooperative_assets` (b1: schema reserved; no rows until b3):
  - `id` uuid PK, `cooperative_id` FK, `asset_kind` (enum: `real_estate_residential`, `real_estate_commercial`, `real_estate_land`, `equipment`, `business_equity`, `other`), `description`, `address` (nullable), `acquired_at`, `disposed_at` (nullable). Multiple assets per Cooperative supported from MVP.
- Extend `member_operations` (per `member-operations.md`) with:
  - `cooperative_id` (nullable FK to `cooperatives.id` — populated for `cooperative_member` capacity Operations).
  - `share_count` (nullable int — T2 ledger; b1 reserved column only).
  - `capital_contributed_cents` (nullable bigint — T2 ledger; b1 reserved column only).
  - `last_distribution_at` (nullable timestamptz — T2 distributions; b1 reserved column only).
- **Forward-looking columns reserved at b1 (T1 surfaces none of them, no rows written, but the column exists so the schema doesn't have to migrate at b3):**
  - `cooperatives.federation_id` (T2 regional federation)
  - `cooperatives.template_kind` (T2 templates)
  - `cooperative_assets.current_valuation_cents` and `valuation_as_of` (T2 valuation display)
- Table `cooperative_distributions` (reserved at b1, no rows written until T2):
  - `id`, `cooperative_id`, `distributed_at`, `total_amount_cents`, `description`, `recorded_by_member_id`.
- Table `cooperative_governance_votes` (reserved at b1, no rows written until T2):
  - `id`, `cooperative_id`, `proposal_text`, `opens_at`, `closes_at`, `passed` (nullable bool).
- **Event log entries (required at b1, partition setup per ADR-10):** `cooperative.formed`, `cooperative.dissolved`, `cooperative.asset_acquired`, `cooperative.asset_disposed`. Plus existing `item_events` covers the cohort lifecycle: `item.created` (cohort posted), `item.responded` with `response_kind='pledge_intent'`, `item.state_changed` (cohort transitions through `forming` → `legal_handoff` → `formed`), `item.fulfilled` (cohort becomes a `cooperatives` row). **A separate `cooperative_events` table** is created at b1 (alongside `member_events` and `community_events` per ADR-10) for cooperative-entity-scoped events that don't fit the cohort Item lifecycle. All event rows carry `acting_member_id` + `via_delegation_id` per ADR-6.
- **Action handlers (per ADR-7) — b1 reserves the names, b3 implements them:** `cooperative_cohort.create`, `cooperative_cohort.transition_state`, `cooperative.formalize` (the off-platform-handoff completion that creates the `cooperatives` row), `cooperative.add_asset`, `cooperative_member_operation.declare` (extends `member.operation.declare` for cooperative capacity), `cooperative.dissolve`. The MCP-server-as-thin-wrapper-over-action-layer (per ADR-7) gets these for free at b3.

## Policy posture (per ADR-9)

The Cooperative system touches monetary flow, capital pooling, governance, data sharing, and visibility. Every surface walks the three filters: helpful? harmless? abuse-resistant? The protective stance is the default; Members opt in to relax.

**Cohort visibility — default `community-only`.**
- Helpful: cohort posters need their affinity Community to see the cohort; broadcasting publicly invites speculative attention from outside the platform's intended user base.
- Harmless: Members of the affinity Community already share a real-world tie; visibility within that scope mirrors how cooperative formation actually happens.
- Abuse-resistant: cross-Community visibility is opt-in by the cohort poster, time-bounded, and revocable. Public discovery of formed Cooperatives (b3 surface) is a separate opt-in per Cooperative.

**Pledge intent — non-binding by structure, not policy.**
- Helpful: the cohort needs early signal of capital commitment to know if formation is viable.
- Harmless: pledges are explicitly non-binding *intent*, named as such in every UX surface. The legal commitment happens off-platform via the subscription agreement after the entity forms.
- Abuse-resistant: the platform never custodies capital at any tier. Off-platform legal handoff to counsel (Sustainable Economies Law Center or equivalent) is structural, not optional. The "intent_amount" naming is enforced in every action handler and surface label; "pledge" appearing in user-facing copy without "intent" qualifier is a code-review reject.

**Cap-table mirror visibility — default `private to the Member`.**
- Helpful: Members want to see their own share count, contribution, and distribution history; T2 share-ledger surfaces this on the Member's own profile.
- Harmless: defaulting private prevents inadvertent reveal of co-ownership stakes to other Members within the same Cooperative (which can be socially or financially sensitive).
- Abuse-resistant: cooperative-internal visibility (other Members of the same Cooperative seeing share counts) is opt-in per Member, with the opt-in itself transparent to the Cooperative steward. Federation-level visibility (other Cooperatives in the same Regional Federation seeing roll-ups) is a separate opt-in.

**Distributions surface — default `private notification to the receiving Member`.**
- Helpful: the Member needs to know when a distribution arrived; the Cooperative steward needs to record it for cap-table consistency.
- Harmless: distribution amounts are not aggregated publicly without explicit Cooperative-level opt-in.
- Abuse-resistant: distribution recording is the steward's action, audited via `cooperative.distributed` events with `acting_member_id` + `via_delegation_id`. The Member can dispute via a separate action handler, also audited.

**Governance voting — default `binding under the Cooperative's operating agreement`.**
- Helpful: voting is the structural realization of cooperative governance; it must be binding for the cooperative principle (one-Member-one-vote) to mean anything.
- Harmless: voting is bounded by the operating agreement scope; the platform does not facilitate votes outside that scope.
- Abuse-resistant: every vote audited via `cooperative.vote_cast` events. Vote results are immutable post-close. Member who casts a vote sees their own ballot; the steward sees the aggregate; the platform sees the audit log. **Delegation of voting is categorically not permitted at any tier** (per ADR-6's confirmation-required scope pattern, extended).

**Federation participation — default `off`.**
- Helpful: federation membership unlocks shared back-office, cross-investment opt-ins, risk pooling.
- Harmless: federation membership is a Cooperative-level decision, made by Member vote per the Cooperative's operating agreement.
- Abuse-resistant: federation membership is reversible (the Cooperative votes to leave). Federation cannot bind individual Members beyond what the Cooperative itself has consented to.

## Integration Points

- **Connects to:**
  - **Member** (a Cooperative co-ownership is carried on the Member's `cooperative_member` Operation per `member-operations.md`; the co-ownership badge surfaces on the Member profile per `member.md` T3 stakeholder visibility settings).
  - **Community** (the *affinity wrapper* — a Community of `kind=cooperative` per `community.md` line 76 is the *we* that operates the Cooperative; the Cooperative is the *entity that holds title*. The Community may exist before the Cooperative and continues to exist after; they are linked but neither owns the other).
  - **Item** (a Cooperative cohort is an Item of `kind=cooperative_cohort` per `item.md`; lives at `/i/[slug]`; uses `item_responses` for pledges and encouragements).
  - **Member Operations** (the `cooperative_member` capacity links a Member to a specific Cooperative via the `cooperative_id` FK on `member_operations`).
  - **Initiatives** (an Initiative may graduate into a Cooperative — the Initiative reaches funded state and the chosen legal structure is a cooperative entity; system supports this via `cooperatives.cohort_item_id` accepting either a `cooperative_cohort` or an `initiative` Item).
  - **Gatherings** (every Cooperative cohort requires a linked Gathering Item at T1, inheriting Initiative's discipline that the meetup is the point).
  - **Action layer** (per ADR-7 — every Cooperative write goes through a named action handler).
  - **Event log** (per ADR-6 — every Cooperative event row carries `acting_member_id` + `via_delegation_id`).
- **Used by:**
  - The Member profile (`/m/[handle]` — co-ownership badges via active Operations, T2 share ledger, T3 stakeholder dashboard).
  - The Community page (`/c/[slug]` — Cooperative cohorts and formed Cooperatives surface as community-anchored entities).
  - The Item page (`/i/[slug]` for cohort items — public formation surface, encouragement/pledge actions).
  - The eventual Intelligence layer (Cooperative formation, asset acquisition, and Member co-ownership are the strongest possible signals of community wealth retention).
- **Future systems:**
  - **Federations** (separate spec, b3+) — Regional and National federation entities and their distinct governance.
  - **Distributions and Treasury** (separate spec, T2+) — financial flows machinery once Cooperatives are operating at scale.
  - **Administrative Services** (referenced in Initiatives and Service Provider docs) — the federated cooperative services layer that supports operating businesses; deeply intertwined with Federation infrastructure here.

## Open questions

- **Naming.** Internal data model term: Cooperative. Public-facing language is open and likely warmer ("Co-op," "Community Holding," "Member Ownership" — all have tradeoffs). User pushed back on "community equity" because of overlap with finance terminology; current working internal term avoids that overlap. Resolve before launch.
- **Securities-law posture at T1.** The working assumption is that non-binding "intent to invest" Pledges with no capital custody and an explicit off-platform handoff sit safely outside active securities regulation. This is the single most consequential legal question in the spec and **must be confirmed with counsel before any T1 surface is built, not just before launch.** Sustainable Economies Law Center is the right first call.
- **Cross-Cooperative privacy.** The federation surface at T2 surfaces other Cooperatives in a region. How much detail (Member counts, asset descriptions, contribution ranges) is visible to Members of other federated Cooperatives vs. private to each Cooperative? Lean toward generous visibility within a federation, on the theory that federations work because their members trust each other; defer to T2.
- **Reconciliation between platform record and legal cap table at T1.** The platform's `member_operations` rows for `cooperative_member` capacity (carrying `cooperative_id` + `share_count` + `capital_contributed_cents`) is the on-platform record; the off-platform entity's cap table is the legal source of truth. At T1, reconciliation is a manual liaison responsibility. This is fine for the first dozen Cooperatives but won't scale; partner integration with cap-table providers (Carta, Pulley, or cooperative-specific tools like Northcap) needs scoping before T2.
- **Geography model.** A Cooperative is anchored to one or more Communities, but its assets are at specific addresses. A Cooperative might hold assets across a city even if it formed within one neighborhood. The data model supports many assets per Cooperative; the open question is how cross-neighborhood Cooperatives surface in the cross-visibility system. Probably expand the cross-visibility radius for Cooperative cohorts and records (working default: metro region rather than city).
- **Liquidity and the lock-up problem.** Real estate is illiquid; Member capital is functionally locked for years. T3 secondary-market design is unsolved and potentially the single hardest design question in the entire system. Defer, but be honest with Members at T1 that capital is locked.
- **Cooperative vs. Trust.** For some asset patterns (especially permanently affordable housing on land the community wants to remove from speculation forever), a Community Land Trust is the correct legal structure rather than a cooperative. CLTs don't fit the share-and-distribution model — they're permanent stewardship. Open whether CLTs are a separate system entirely or a specialized template within Cooperatives. Lean separate system if and when serious CLT demand emerges; for now, route CLT-shaped Initiatives off-platform to Burlington-style CLT consultants.
- **Minimum viable Cooperative size.** The miniscule starting point is twelve to twenty-five Members; below twelve, governance overhead per asset becomes disproportionate; above twenty-five, social cohesion within a single Cooperative starts to fray. These are working numbers, not hard limits — calibrate post-launch.
- **Cohort Pledge → subscription agreement conversion rate.** A Pledge is non-binding intent. Counsel will tell us what fraction of Pledges typically convert to actual subscriptions when an entity forms. If conversion is much lower than cohort sizing assumes, the threshold for off-platform handoff needs to be higher. Calibrate against the first three to five Cooperatives that form.

## Comments

This is the system that makes the stakeholder framing literal. Member's stakeholder dashboard (T3) is the platform-side rendering of accumulated participation; Cooperatives is the off-platform-anchored, on-platform-surfaced rendering of accumulated *ownership*. The two together describe the full arc from "neighbor who shows up" to "neighbor who owns a piece of the place." Without Cooperatives, the platform's claim about stakeholder community is participatory and cultural. With Cooperatives, it becomes proportional and financial as well.

The federated three-tier architecture is the structural protection against the platform's own success. The reflexive shape for a successful real-estate-investment surface is a single national fund with proportional share ownership — that is, a REIT in cooperative clothing. This shape is rejected on principle: it reproduces the extractive logic the platform exists to displace. Mondragon, Laboral Kutxa, US credit unions, the Cooperative Fund of New England, and East Bay Permanent Real Estate Cooperative all share the federated shape precisely because federation is what allows scale without centralization. The platform's role is to make that federation easy to compose; the platform itself never holds member capital, never owns assets, and never centralizes governance. Every Cooperative is locally chartered, locally governed, locally beneficiary.

The miniscule starting point is deliberately tiny. Twelve to twenty-five Members, $25k–$100k of Member equity, one small property. This is roughly the smallest meaningful unit in real estate co-ownership and roughly the largest unit that fits comfortably under California's §25102(n) intrastate exemption with simple compliance. It is far smaller than what most people imagine when they hear "community real estate fund." It is precisely large enough that Members are real co-owners with real proportional cash flow and appreciation participation. It is intentionally designed so that the first Cooperative the platform helps form can be modeled on East Bay Permanent Real Estate Cooperative's first acquisition rather than on something venture-scale.

The off-platform legal handoff at T1 is a structural humility. The platform is the cohort formation surface; counsel does the legal work. Sustainable Economies Law Center has spent a decade building the model documents and cooperative-formation expertise required to do this safely in California. The platform's job is to send cohorts to them well-prepared and well-organized; not to replicate, in software, work that has correctly resisted being replicated in software. As volume grows, partnering more deeply with SELC and similar entities — possibly funding a full-time cooperative-formation attorney shared across cohorts — is the right scaling path. Building the legal work into the platform is not.

The relationship to Initiatives is symmetric and deliberate. An Initiative is verbal — let's start something. A Cooperative is nominal — the something we collectively own. The two systems describe complementary halves of the same long arc: how a community goes from organizing to owning. Most Cooperatives at T1 will form independently of any Initiative (a group of neighbors decides to buy a building together), and most Initiatives at T1 will not graduate into Cooperatives (a bakery initiator forms a single-owner LLC). The intersection — Initiatives that graduate into worker cooperatives — is the strategically most important pattern over time, because it produces both new local businesses *and* new co-owned local assets in a single arc. The data model supports this intersection from MVP via `cooperatives.cohort_item_id` accepting either source.

A note on caution. Cooperatives is the system on the platform with the highest legal-risk surface area and the slowest path to right. Resist the impulse to ship it earlier than b3. The other systems must be working — Member, Community, Initiatives all proven in real Sacramento communities — before the platform takes on the responsibility of helping people put real money into co-owned legal entities. The lower-tier systems also generate the cohort-formation muscle that Cooperatives depends on; without active Initiative cohorts converting into Cooperative cohorts, the surface has no users. The miniscule starting point is small precisely because the right first Cooperative is small, slow, well-counseled, and learns publicly. The architecture above is built to scale; the first Cooperative is built to teach.
