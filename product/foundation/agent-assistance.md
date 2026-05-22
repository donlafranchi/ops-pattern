# Agent Assistance

**Status:** Foundational. Read alongside [`principles.md`](principles.md), [`policy.md`](policy.md), [`loops.md`](loops.md), and [`primitives.md`](primitives.md). This document is the umbrella for the three Member primitives that implement agent assistance — [`delegation.md`](../systems/delegation.md), [`assistant-context.md`](../systems/assistant-context.md), [`skills.md`](../systems/skills.md) — and the runtime substrate that enforces them — [`action-layer.md`](../systems/action-layer.md). It owns the cross-cutting commitments; the system specs own the per-primitive (and per-substrate) detail.

## What this document does

The current technology landscape is built around forms-and-fields UI. LLM-based assistants are routinely asked to act on humans' behalf and struggle with that surface. A people-first platform that ignores agent assistance cedes the asymmetric tooling advantage to chains and aggregators — exactly the structural posture [`principles.md`](principles.md) exists to refuse.

Agent assistance is a first-class architectural concern, not a bolted-on feature. It ships in three primitives — Delegation, Assistant Context, Skills — and inherits the people-first commitments of the data model. This document names the **umbrella commitments** that bind the three primitives. Each commitment is enforced structurally (data model, action layer, policy posture), not by hope or convention.

## The three primitives

1. **Delegation** ([`delegation.md`](../systems/delegation.md)) — the scoped, expiring, revocable permission grant from a Person to a non-human actor. Every read or write performed by an assistant, a Skill, or a federation peer carries a Delegation; the event log records both the acting Member and the Delegation used. Confirmation-required scopes (publish, pledge, money flow) require per-action human confirmation regardless of grant.

2. **Assistant Context** ([`assistant-context.md`](../systems/assistant-context.md)) — the Member-owned, Member-curated document carrying voice, tone, tastes, refusals, pinned facts, and current focus across sessions and across loops. Three update pathways (explicit teach, confirmation-derived, inferred-and-proposed). Persistence is standing-derived: the full-tier Assistant Context is gated on `member_has_standing_presence` (≥1 active membership in a kind='business' Group OR steward-role membership in any non-business Group, per [`groups.md`](../systems/groups.md)).

3. **Skills** ([`skills.md`](../systems/skills.md)) — composable, versioned, distributable capability bundles the Member's assistant subscribes to and loads. Sources: platform-curated (free, vetted), community-authored, peer-shared, federation-provided. Skills declare their Delegation scopes at install; the Member confirms. Skills run in the Member's agent context, not on platform servers.

## The umbrella commitments

The five commitments below are what make the three primitives a coherent architecture rather than three loosely-related features. They are not aspirational — each is enforced structurally and each is testable.

### 1. Agents are loop-shaped, not role-shaped

A single Member uses agent assistance across many loops — finding their people, floating an idea, listing a product, organizing a gathering, leading an initiative. The assistant specializes contextually (by which loop the Member is in, with which Skills loaded), not by identity. There is no Maker-Agent or Vendor-Agent or Organizer-Agent type. There is the Member's assistant, doing whatever loop the Member is currently in.

This mirrors the role-as-verb commitment in [`principles.md`](principles.md): the platform refuses identity-as-claim throughout, including at the agent layer.

### 2. Persistence is standing-derived, not toggle-derived

Agent context depth scales with the standing presence the Member has accumulated, not with a setting they flip. A Member with one casual gathering posted gets a scratch-tier Assistant Context (enough to maintain conversational continuity across a session); a Member with active business-Group memberships or steward roles gets a full standing-tier Assistant Context (a durable assistant context spanning loops).

> **Intent:** A toggle ("enable advanced assistant context") would let any Member opt into chains-and-aggregators-level tooling instantly, which collapses the *earn before extract* disposition into a paywall in disguise. Tying depth to demonstrated standing keeps the asymmetric-tooling gift aimed at the Members the platform exists to strengthen — the ones who have actually invested participation. If a future proposal wants to surface deeper context to Members who haven't earned standing yet, the answer isn't a toggle; it's a new way to earn standing.

This closes the asymmetric-tooling gap with chains and aggregators — giving "the tools of the major players" to community business owners — without modeling a Business entity, claiming a role, or auto-assigning anyone to anything.

The standing-tier view (`member_has_standing_presence`) is defined in [`groups.md`](../systems/groups.md) and is the same gate used by [`assistant-context.md`](../systems/assistant-context.md) and the b2+ surfaces of [`skills.md`](../systems/skills.md).

### 3. Read can be automated; write requires human confirmation

Reading public data, drafting Items, querying the locality index, proposing Assistant Context updates — all automatable under a Delegation. Publishing an Item, sending a response, granting another Delegation, transferring money — all require per-action human confirmation, regardless of what grant the assistant holds.

> **Intent:** This is the substantive trust commitment, not a UX flourish. An agent that can publish without confirmation can be prompt-injected into publishing on the Member's behalf — which compromises every loop the platform exists to surface (trust between neighbors, durability of pledges, integrity of money flows). The read/write asymmetry is what lets the platform be genuinely agent-friendly without becoming agent-controlled. Future proposals to "let the agent post for you when X is true" should be read as proposals to convert a structural commitment into a heuristic, and rejected.

Money flows are the strictest tier. Outside an active monetary-flow Delegation, every monetary action is Member-direct. The two schema-enforced monetary-flow scopes (per [`policy.md`](policy.md), [`../systems/delegation.md`](../systems/delegation.md), [`../systems/payments.md`](../systems/payments.md), and `agent-commerce-and-project-amendments.md` §8) are: `recurring_payment` (caps + recipient allowlist + expiry + per-execution observability) and `bounded_purchase` (per-transaction + per-period caps + `recipient_scope` + `category_scope` + reversibility window + first-recipient confirmation + per-execution audit). Pledges remain Member-direct until a pledge-shaped scope passes its own three-filter test. Each monetary-flow scope is opt-in, schema-enforced, and per-execution observable; caps cannot be modified by the agent.

The confirmation-required scopes are not a UX convention — they are a hard schema-level constraint on Delegation use. Code review rejects any action handler that lets the confirmation gate be bypassed.

The assistant never holds the credential it acts under. The action layer ([`../systems/action-layer.md`](../systems/action-layer.md)) mints a scoped capability per turn, bound to the stated intent, and applies it at the network edge as the call crosses into the handler — the capability never enters the agent's context window, never appears in tool arguments. This is what makes prompt injection structurally non-exfiltrating: a malicious user-content payload cannot leak credentials the agent never had. Read/write asymmetry is the *policy*; per-turn credential vending is the *enforcement*.

### 4. Member-owned, never platform-owned

The Assistant Context is the Member's property. It is fully exportable (one-click `/you/data` action), fully deletable (one-click purge with cascade through the action layer), never trained on, never input to recommendation surfaces, never visible to other Members or their assistants without explicit per-section opt-in sharing.

Skill subscriptions are equally Member-owned. The platform-curated catalog is free forever; community/peer/federation Skills default to off-platform payment with no platform cut. The opt-in platform-mediated payment (capped 5–10%, per ADR-9) is the Member's choice for each Skill they install, not a default.

This is the relational realization of `principles.md`'s refusal of the surveillance-and-ranking model. The Member's context is theirs, not the platform's product.

### 5. Federation-portable

Under Loop 13 federation, identity, Assistant Context, and (where flagged) Delegations follow the Member to spawned platforms. The agent layer is a federation peer that happens to represent one Member; the same protocols serve both human handoff and assistant handoff.

This is what keeps the platform from becoming a trap. A Member who joins a federated cooperative-services platform takes their assistant context with them. The platform does not hold their attention or their memory captive.

## What ships at b1

**Substrate only.** No agent-assistance surfaces ship at b1. What lands:

- The three tables: `member_delegations` (with the scope enum populated), `member_self_records` (one row per Member, default scratch-tier), and `member_skill_subscriptions` (empty at b1, fillable from `/you/skills` at b2).
- The audit fields `acting_member_id NOT NULL` and `via_delegation_id` (nullable) on every `*_events` row, populated by the action layer (per ADR-7). The system Member is the `acting_member_id` for platform-emitted events; Members are the `acting_member_id` for their own writes; Delegation-mediated writes (b2+) carry the granted Delegation's id.
- The `/you/data` export action (one-click JSON of the Member's full data envelope including Assistant Context) and the `/you/data` purge action (cascade-delete via the action layer).

**No surfaces at b1.** No assistant chat panel, no `/you/skills` catalog browsing, no Skill subscription flow, no Assistant Context editor UI. Members at b1 know none of this exists — but every write they perform populates the audit trail that lets the b2+ stack land cleanly without retrofit.

## What ships at b2

The assistant surfaces. The platform-curated Skill catalog at `/skills`. The subscription flow with explicit Delegation grant per Skill. The three Assistant Context update pathways (explicit teach via `/you/agents`, confirmation-derived via task completion, inferred-and-proposed at one-per-session cadence). The export and purge surfaces become visible (the actions exist at b1; the UI surfaces them at b2).

## What ships at b3

Federation-grade Delegations. Community/peer/federation-authored Skills. Assistant Context federation portability. The opt-in platform-mediated Skill payment (per ADR-9, opt-in for authors who choose it; capped 5–10%; funds maintenance, not ranking).

## Decisions encoded here

This file is the live home for the following architectural decision. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register; this entire document *is* the long-form ratification of ADR-6.

| ADR | Status | What lives here |
|---|---|---|
| ADR-6 | Accepted, refined by ADR-9 | Agent assistance is first-class. Three primitives (Delegation, Assistant Context, Skills). Five umbrella commitments: loop-shaped not role-shaped · persistence is standing-derived · read can be automated, write requires human confirmation · Member-owned, never platform-owned · federation-portable. b1 ships substrate only; surfaces ship b2; federation-grade ships b3. |

The per-primitive details live in [`delegation.md`](../systems/delegation.md), [`assistant-context.md`](../systems/assistant-context.md), and [`skills.md`](../systems/skills.md). Each carries a footer pointing back to this document.
