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

A policy that passes all three filters earns its place. A policy that fails any of them is rejected, revised, or constrained until it passes.

## The opt-out default

The platform's default posture for any non-essential data sharing, monetary flow, agent permission, or relaxed protection is **off**. Members are protected by default. Anything that benefits them at the cost of relaxing protection is **opt-in**, with the relaxation visible, granular, time-bounded where reasonable, and revocable.

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

## The anti-Nextdoor commitments (forward-looking, structural)

Three forward-looking commitments encode the platform's structural response to Nextdoor's complaint-attractor failure mode. The commitments are categorical refusals at the policy and product-design level, ratified now so future surface decisions can be checked against them. None of these are surfaces that ship at b1; they are commitments the b1 substrate respects so b2/b3 surface decisions don't have to re-litigate them.

### 1. Messaging is item-or-group only — never Location-scoped

When DM, threaded comments, or any other messaging surface ships (b2+), every channel is scoped to either an Item or a Group. **No surface in the platform is ever Location-scoped.** No Location wall, no Location feed, no Location DM, no "comment on this Location" affordance. A Member with `lives` affinity to West Sacramento (per `member_location_affinities`) cannot be sent to as a "West Sac resident" because no surface routes messages by Location affinity. The `member_location_affinities` action handler exposes no read API for messaging-target purposes — affinities can be written and surfaced in the Member's own profile, but never used to construct a send-to list.

This is the structural prevention of the Nextdoor pattern. Locations are how the platform organizes *what is happening where*; they are not how the platform organizes *who is talking to whom*. Items and Groups are where conversation lives — because Items have an author who chose to be the focal point, and Groups have members who chose to be addressable as a constituency.

The commitment is enforced at **four** layers: (1) at the data-model layer, by the absence of a `location_messages` or equivalent table; (2) at the action-layer (per ADR-7), by no handler accepting a Location as a messaging target; (3) **at the row-level-security layer (per ADR-16), by `member_location_affinities` being owner-only — no peer Member, anon visitor, or query path can `SELECT` another Member's affinity rows under any condition.** Cross-Member computation flows through three named SECURITY DEFINER functions (`count_likes_for_location`, `count_followers_for_location`, `member_is_local_to_location`) whose outputs are counts or booleans — never per-Member identity. Backend services (recommendations, embeddings) compute over the full row set but emit anonymized aggregates only; (4) at the policy layer, by this section, which any future spec proposing a Location-scoped messaging surface must override (and which review per `pipeline-review` will challenge).

**The upgrade in posture (per ADR-16):** the no-Location-messaging commitment and the absence of per-Member location disclosure are now **structurally enforced by RLS, not by platform discipline.** A future engineer who tries to JOIN against `member_location_affinities` to build a send-to list is blocked by the database itself, not by code review.

### 2. Complaint-style content is downvote-able and removed from circulation

Any feed surface — Item responses, Group surfaces (b2), Member-following streams (b2), the locality-first index — supports community downvote of complaint-style content. Sustained downvote (threshold + cadence specified at surface-design time) hides the content from circulation: it remains on the author's profile so the author can see what they posted, but does not surface in others' feeds, does not push notifications, does not appear in proximity browse.

This is the affirmative replacement for the moderation-by-deletion pattern. The platform does not silently delete content. The platform does not require centralized moderator review for every flag. The community downvotes; the content stops circulating. The author is told. The author can edit, withdraw, or accept. The platform takes action only when content crosses categorical lines (illegal, threatening, child-safety) — those use a separate report flow with explicit moderator review.

The commitment respects the three filters: helpful (it lets the community shape its own feeds), no broad harm (the author retains visibility of their own content; only circulation is throttled), abuse-resistant (downvote requires a threshold of distinct Members, preventing single-actor takedown; T2 may add reputation-weighted thresholds).

### 3. The "fix it" path replaces the complaint surface

When a Member has a problem with a Place, a Member, or a thing happening in their neighborhood, the platform's affordance is **create an Item to lead the fix** — not post a complaint about it. A Wonder ("would folks be into fixing the broken playground at Capitol Park?"), an Initiative ("let's organize the playground rebuild"), an Ask ("looking for a contractor who'd quote a fix"), or a Gathering ("Saturday morning playground cleanup, bring gloves") — each puts the Member who cares about the problem in the position of leading something, with stake and accountability.

This is a structural alternative to the comment-board pattern, not a moralistic substitution. The platform does not refuse complaint-shaped content; it does not censor frustration; it does not require positivity. It declines to *build a surface designed to attract complaint*, and it makes the alternative — declaring an Item to address the problem — frictionless and primary.

The phrase "if we ever decide to do that" applies: this commitment shapes future surface decisions but does not script them. The downvote mechanic and the Wonder/Initiative path together define the platform's behavioral posture; the specific UX (where the "Wonder how to fix this" CTA appears, what downvote thresholds apply where) is per-surface design.

### What this means for b1

The b1 substrate respects all three commitments by the absence of any contrary surface. The DM substrate (`member_threads`, `member_thread_participants`, `member_messages` per `member.md`) is constrained at b1 to same-Community only, and threads carry no Location reference. The Item response surface (per `item.md`) and the Member follow surface (per `member.md`) are the only Member-to-Member content paths at b1; both are item-or-group scoped. No Location-scoped feed exists. The downvote surface is reserved at b1 (the Item response `response_kind` enum can be extended at b2 with a `downvote` value, or a parallel mechanic introduced; this section reserves the design space).

## Decisions encoded here

This file is the live home for the following architectural decision. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register; this entire document *is* the long-form ratification of ADR-9.

| ADR | Status | What lives here |
|---|---|---|
| ADR-9 | Accepted | The three-filter test (helpful? harmless? abuse-resistant?). The opt-out default (protective stance is default; Member opts in to relax). The "Policy posture" requirement on every system spec touching privacy, revenue, monetary flow, or data sharing. The anti-Nextdoor commitments (messaging-scope item-or-group-only; complaint downvote/removal; "create an Item to lead the fix" replacement). Concrete opt-in shapes: `assistant-context.md` (k-anonymity floor N≥10; cross-Member sharing); `skills.md` (platform-mediated payment with capped cut); `delegation.md` (`recurring_payment` scope with required caps + allowlist + expiry). |

This file also *encodes* (but does not own) ADR-16 (per-row privacy on `member_location_affinities`): the anti-Nextdoor commitment §1 above is upgraded by ADR-16 from a policy commitment to a structural RLS enforcement. ADR-16 lives cross-cutting in [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md); its data-model home is [`member.md`](../systems/member.md); its derivation-path home is [`groups.md`](../systems/groups.md).
