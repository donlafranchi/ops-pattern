# Policy Framework

**Status:** Foundational. Read alongside [people-first.md](people-first.md), [loops.md](loops.md), and [primitives.md](primitives.md). Every system spec that touches privacy, revenue, monetary flow, data sharing, or third-party access is governed by this document.

## What this document does

This is the framework every Main Street Market policy — written or proposed — passes through before it becomes an enforced behavior in the platform. It is not a list of policies; it is the test the policies have to pass and the posture they have to start from.

The document exists because the architecture is wide enough to invite well-meaning over-strictness on one side ("never share anything, ever, with anyone") and well-meaning under-strictness on the other ("aggregate it all, the platform needs the data"). Neither serves Members. The framework is the middle path: protective defaults, Member-controlled opt-in, and a three-question test that every relaxation must survive.

## The three filters

Every policy — every proposed default, every proposed opt-in, every proposed exception — must pass three questions in order:

1. **Is this helpful economically or socially to community members?**

   The first filter is purpose. A policy that does not produce real economic or social benefit to the Members of this platform does not earn its place in the architecture, regardless of how clever, defensible, or industry-standard it sounds. Helpfulness is the entry condition.

2. **Does it harm anyone else?**

   The second filter is externalities. A policy that benefits the Members who opt in but harms others — other Members, other Communities, surrounding non-participants, the broader public — fails. *It shouldn't harm anyone else.* This filter is strict and applied broadly. Harm includes obvious things (data exposure, financial loss, manipulation) and subtle things (eroded norms, asymmetric advantages, pressure to participate).

3. **Can this be abused by bad actors?**

   The third filter is robustness. Every policy must be analyzed against the failure mode where someone — a malicious Member, a hostile federation peer, a captured platform operator, a future version of the platform under different ownership — tries to use the policy as a vector for harm. If the policy depends entirely on good intentions to remain safe, it fails. Mitigations (caps, audit, transparency, time bounds, scope narrowness) are the burden of the policy, not the burden of the abused.

   > **Intent:** Every prior wave of social platforms passed Filters 1 and 2 at launch and failed Filter 3 over time. Threat-modeling at design time (rather than after a bad-actor pattern emerges in the wild) is cheaper by orders of magnitude — once the surface ships, the cost is incident response, trust loss, and retrofitted moderation. "We'll add safeguards when we see abuse" is the failure mode this filter names and refuses.

A policy that passes all three filters earns its place. A policy that fails any of them is rejected, revised, or constrained until it passes.

## The opt-out default

The platform's default posture for any non-essential data sharing, monetary flow, agent permission, or relaxed protection is **off**. Members are protected by default. Anything that benefits them at the cost of relaxing protection is **opt-in**, with the relaxation visible, granular, time-bounded where reasonable, and revocable.

> **Intent:** "Opt-out default" is the inverse of what every platform that ate its users started with ("opt-in if you care"). Naming it as the *posture* (not a UX preference) is what makes "but the law only requires…" arguments inadmissible — the platform's compliance floor is its own framework, not a regulatory minimum. When a feature proposes a less-protective default in service of frictionless onboarding, this section is the structural answer: the friction is the feature.

This is the structural posture, not a UX preference:

- **Default off, Member opts in.** A relaxation that the Member did not actively choose has not been chosen at all. Pre-checked boxes, dark patterns, "by using this product you consent" clauses, and inferred consent from behavior are all rejected.
- **Granular.** A Member opting in to one thing has not opted in to anything else. Sharing a section of their Assistant Context with one other Member does not share it with the platform. Allowing aggregate analysis does not allow individual identification. Granting a recurring-payment Delegation for one operator does not authorize payments to others.
- **Visible.** Active opt-ins are listed in a place the Member can find — `/you/data` for data sharing, `/you/agents` for Delegations, `/you/skills` for Skill subscriptions. The Member can see what they have allowed without searching for it.
- **Revocable.** Every opt-in is revocable. The cost of revocation is borne by the platform (cleaning up state, notifying counterparties), not the Member.
- **Time-bounded where appropriate.** Sensitive opt-ins (recurring payments, cross-Member sharing) carry expiry by default; the Member can extend but the platform never assumes durability.

The opt-out default is what lets the platform offer real benefits to Members who want them without coercing the rest. A baker who chooses to participate in regional pricing analysis benefits from it; a baker who declines is not penalized, surveilled, or quietly enrolled anyway.

## Why this works for a people-first platform

The people-first commitment in [people-first.md](people-first.md) refuses several things outright: no Business entity, no role-as-identity, no engagement-optimized feed, no pay-for-visibility, no auto-assigned Communities. Those are categorical refusals at the data-model and incentive level, and they remain in force.

The policy framework here covers the *next* layer of decisions: where the architecture *could* offer a useful capability that involves data sharing, monetary flow, or agent action, *what posture does the platform take*. The answer is consistent with people-first: the Member is the decision-maker. The platform is the custodian. Defaults are protective. Opt-ins are real choices. The three filters keep choices honest.

This framework also keeps the platform out of two failure modes that have eaten every comparable project:

- **Paternalistic over-strictness** — refusing useful capabilities on principle because they could theoretically be abused, even when the Member is the only one at risk and the abuse vector is mitigatable. This treats Members as incapable of judgment and forces them off-platform to get the capability somewhere worse.
- **Permissive defaults dressed up as user choice** — letting the platform default to the loose behavior on the theory that the Member can opt out if they care. This is how every social platform got where it is. The framework refuses it categorically: defaults are the protective posture, period.

## How the framework is applied

Each system spec that introduces a policy surface (data sharing, revenue, monetary flow, agent action) carries a **Policy posture** section that:

1. States the default — almost always the protective version.
2. States the available opt-ins — what the Member can choose to enable, with what scope.
3. Walks each opt-in through the three filters — explicitly, in writing, in the spec itself.
4. Names the mitigations that make the opt-in pass the third filter (caps, audit, time bounds, transparency, granularity).

This means the opt-in design and the abuse-resistance design land in the spec together. A policy that cannot articulate its three-filter answer in the spec does not ship.

## Governance

New policies, and revisions to existing policies, follow the same path:

1. The proposal lands in the relevant system spec under "Policy posture."
2. The three-filter analysis is written in the spec.
3. An ADR in [planning/DECISIONS.md](../../planning/DECISIONS.md) captures any cross-spec implications.
4. The PM reviews; the planning-filter can pressure-test scope; security/privacy review can pressure-test mitigations.

Policy changes that affect existing Members' opt-in state require explicit re-confirmation from each affected Member; policy changes that only affect future opt-ins do not. The platform never silently expands what it does with existing opt-ins.

## What this rules in and rules out

**Rules in:** opt-in cross-Member sharing of Assistant Context sections, opt-in participation in anonymized aggregate analysis, opt-in recurring-payment Delegations with caps, opt-in platform-mediated Skill payments with a transparent cut, and any future capability that survives the three filters with protective defaults.

**Rules out:** any default-on data sharing, any silent expansion of opt-ins, any policy that depends on good intentions for safety, any "users consented in the ToS" rationalization, any capability that benefits Members at the cost of harm to others, and any opt-in that lacks granular scope, visibility, revocation, or appropriate time bounds.

The framework is what lets the platform say *yes* to Members who want richer participation and *no* to the failure modes that turned every comparable platform into the thing it set out to replace.

---

## The anti-Nextdoor commitments (design intent, structural)

Three commitments encode the platform's response to Nextdoor's complaint-attractor failure mode. Framing softened 2026-05-12 per `agent-commerce-and-project-amendments.md` §4 — the design intent is sound; the prior absolutism was wrong. These commitments shape current surface decisions and constrain future ones; they are not categorical "never"s, with the exception of the privacy commitment enforced by ADR-16 (RLS owner-only on `member_location_affinities`), which stays as a hard architectural floor.

### 1. Messaging is item-or-group only at b1 — Location-scoped surfaces are designed carefully when they appear

Through b1, every DM, threaded comment, and feed channel is scoped to either an Item or a Group. The platform may surface what is happening at a Location, who is making things there, and how to participate. The platform does not currently build location-as-constituency feeds, location DMs scoped to "everyone with `lives` affinity," or location walls. If future surfaces along these lines are designed, they ship with active push-back on complaint-only behavior (per §2) and clear opt-out from being addressable by location.

The platform's structural orientation: Locations are how the platform organizes *what is happening where*; Items and Groups are how Members address each other as constituencies, because Items have an author who chose to be the focal point and Groups have members who chose to be addressable.

**The hard architectural floor — ADR-16 RLS owner-only on `member_location_affinities`.** This is a privacy commitment, not an anti-feed commitment, and it stays as an absolute. No peer Member, anon visitor, or query path can `SELECT` another Member's affinity rows under any condition. Cross-Member computation flows through three named SECURITY DEFINER functions (`count_likes_for_location`, `count_followers_for_location`, `member_is_local_to_location`) whose outputs are counts or booleans — never per-Member identity. A future engineer who tries to JOIN against `member_location_affinities` to build a send-to list is blocked by the database itself, not by code review. Any future Location-scoped surface must respect this floor — it can use the aggregate functions, never the underlying rows.

Surfaces that touch this design space pass through the three-filter test in the system spec. The privacy floor in ADR-16 is non-negotiable; everything above it is a design conversation.

### 2. The platform pushes back on complaint-only behavior

The platform actively pushes back on complaint-only behavior. A Member who wants to surface a problem is welcome to — and is offered, in the same composer, the affordance to declare an Item that leads toward a solution (a Wonder, an Initiative, an Ask, a Gathering). Complaints paired with a solution-shaped declaration get full circulation. Complaints alone get a gentle nudge to add the second piece, and reduced circulation if the Member declines. The platform does not silently delete complaint content; it shapes the incentive toward action.

The specific mechanic — community downvote, ranking-weight reduction, surface-level nudge, soft-throttle — is per-surface design and not locked in at the policy level. What is locked in: complaint-only is not the dominant surface; complaint-with-solution is. The platform takes action only when content crosses categorical lines (illegal, threatening, child-safety); those use a separate report flow with explicit moderator review.

The commitment passes the three filters: helpful (it lets the community shape its own feeds and converts grievance into agency), no broad harm (the author retains visibility of their own content; circulation reflects whether they paired the complaint with a fix-it path), abuse-resistant (any downvote-style mechanic requires a threshold of distinct Members, preventing single-actor takedown; T2 may add reputation-weighted thresholds; the platform never blocks posts from circulating entirely on a single Member's say-so).

### 3. The "fix it" path is offered, not forced

When a Member has a problem with a Place, a Member, or a thing happening in their neighborhood, the platform's composer **offers** — does not force — a path to lead the fix. A Wonder ("would folks be into fixing the broken playground at Capitol Park?"), an Initiative ("let's organize the playground rebuild"), an Ask ("looking for a contractor who'd quote a fix"), or a Gathering ("Saturday morning playground cleanup, bring gloves") — each puts the Member who cares about the problem in the position of leading something, with stake and accountability.

The composer suggests pairing the complaint with one of these forms. The Member decides whether to add it. A Member who refuses to add a fix-it pairing is not blocked from posting; their post simply circulates less broadly than one paired with a solution. The platform does not censor frustration, does not require positivity, and does not refuse complaint-shaped content. It declines to *build a surface designed to attract complaint* as the primary mode, and it makes the alternative — declaring an Item to address the problem — frictionless and visible.

The specific UX (where the "Wonder how to fix this" CTA appears, what proportion of the composer space the fix-it pairing occupies, what circulation-reduction thresholds apply where) is per-surface design.

### What this means for b1

The b1 substrate respects all three commitments by the absence of any contrary surface. The DM substrate (`member_threads`, `member_thread_participants`, `member_messages` per `member.md`) is constrained at b1 to same-Community only, and threads carry no Location reference. The Item response surface (per `item.md`) and the Member follow surface (per `member.md`) are the only Member-to-Member content paths at b1; both are item-or-group scoped. No Location-scoped feed exists at b1. The push-back-on-complaint-only mechanic is reserved at b1 (the Item response `response_kind` enum can be extended at b2 with a `downvote` or `solution_paired` flag, or a parallel mechanic introduced; this section reserves the design space without locking in implementation).

## Decisions encoded here

This file is the live home for the following architectural decision. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register; this entire document *is* the long-form ratification of ADR-9.

| ADR | Status | What lives here |
|---|---|---|
| ADR-9 | Accepted (anti-Nextdoor framing softened 2026-05-12 per `agent-commerce-and-project-amendments.md` §4) | The three-filter test (helpful? harmless? abuse-resistant?). The opt-out default (protective stance is default; Member opts in to relax). The "Policy posture" requirement on every system spec touching privacy, revenue, monetary flow, or data sharing. The anti-Nextdoor design intent (messaging item-or-group at b1; Location-scoped surfaces designed carefully when they appear; push-back-on-complaint-only behavior; fix-it path offered not forced). The ADR-16 RLS commitment on `member_location_affinities` stays as a hard architectural floor inside ADR-9's scope. Concrete opt-in shapes: `assistant-context.md` (k-anonymity floor N≥10; cross-Member sharing); `skills.md` (platform-mediated payment with capped cut); `delegation.md` (`recurring_payment` scope with required caps + allowlist + expiry; `bounded_purchase` scope with required caps + recipient_scope + category_scope + reversibility window per `agent-commerce-and-project-amendments.md` §8b and `payments.md`). |

This file also *encodes* (but does not own) ADR-16 (per-row privacy on `member_location_affinities`): the anti-Nextdoor commitment §1 above is upgraded by ADR-16 from a policy commitment to a structural RLS enforcement. ADR-16 lives cross-cutting in [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md); its data-model home is [`member.md`](../systems/member.md); its derivation-path home is [`groups.md`](../systems/groups.md).
