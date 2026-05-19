# ADR-0006: Agent assistance is first-class — three primitives, five commitments

**Status:** Accepted (refined by ADR-9 anti-Nextdoor framing 2026-05-12)
**Date:** 2026-05-09
**Deciders:** PM
**Scope:** How AI agents (Claude / future LLMs / federation peers) act on a Member's behalf — the persistence model, the consent model, the trust model, the federation portability commitment
**Touches:** [`product/foundation/agent-assistance.md`](../../product/foundation/agent-assistance.md) (canonical home — umbrella commitments, the long-form prose), [`product/systems/delegation.md`](../../product/systems/delegation.md) (Delegation primitive — bounded scopes, schema-enforced caps), [`product/systems/assistant-context.md`](../../product/systems/assistant-context.md) (Member-Owned Context primitive), [`product/systems/skills.md`](../../product/systems/skills.md) (Skill subscriptions, sandboxed execution), [`product/systems/action-layer.md`](../../product/systems/action-layer.md) (ADR-7 — agent writes flow through the same action handlers as human writes), [`product/systems/member.md`](../../product/systems/member.md) (`member_delegations`, `member_self_records`)

## Decision

Agent assistance is a first-class part of the platform's grammar — not an add-on, not a "power user" surface, not a separate product. The substrate ships at b1; agent-facing surfaces ship at b2; federation-grade interop ships at b3.

Three primitives constitute the agent surface:

- **Delegation** — a Member's bounded grant of authority to an agent for a specific scope. Schema-enforced caps (e.g., `bounded_purchase` per ADR-17). Revocable at any time. Audit-logged.
- **Assistant Context** (Member-Owned Context) — `member_self_records`: the persistent, Member-controlled state an agent reads to act coherently across turns. Member-owned, Member-editable, never platform-mined, never sold.
- **Skills** — installable, sandboxed agent capabilities. Member-installed; platform-curated catalog free forever; community/peer/federation Skills default to off-platform payment with no platform cut.

Five umbrella commitments bind all three:

1. **Loop-shaped, not role-shaped.** Agents serve loops (Land here, Wonder, Buy close, Gather, Build together, etc.), not "the producer assistant" or "the buyer assistant." A Member uses the same agent surface in every loop they touch.
2. **Persistence is standing-derived, not toggle-derived.** What an agent remembers across sessions is a function of the Member's standing in a Group or relationship — not a privacy toggle the Member has to remember to set.
3. **Read can be automated; writes require human confirmation.** Reading from the action layer can be agent-initiated. Writing to the action layer requires a Member's confirmation gate per ADR-7's approval-gate substrate.
4. **Member-owned, never platform-owned.** Assistant Context, Delegations, and Skill subscriptions belong to the Member. The platform does not aggregate, sell, or train on this data.
5. **Federation-portable.** Every agent surface is designed to survive a Member moving to a federated peer without rebuilding state from scratch. The Member-owned data structures travel.

The full prose lives in [`agent-assistance.md`](../../product/foundation/agent-assistance.md). This ADR is the canonical index entry.

## Trade-offs

The alternative — agent assistance as a post-MVP add-on layered on top of a human-only platform — was rejected because the action layer (ADR-7), the bounded-purchase delegation (ADR-17), and the affinity-row privacy (ADR-16) all encode agent-aware invariants at the substrate level. Retrofitting agent-awareness onto a non-agent-aware substrate would mean rewriting the substrate. Better to write it once, agent-aware from day one, even though the surfaces don't ship until b2.

The five-commitment framing is load-bearing because the failure modes the framing prevents are real and recurring in the broader industry:

- A platform that lets agents accumulate role-bound persistence ("you are the producer's assistant") eventually models the Member as a vector of roles rather than a person. The platform's "people-first" commitment ([`people-first.md`](../../product/foundation/people-first.md)) is incompatible with role-shaped agents.
- A platform that lets agents write without human confirmation eventually produces a system where the Member's relationship with the platform is mediated by an agent the Member did not consciously consent to. The "writes require confirmation" commitment puts a human in the loop where stake exists.
- A platform that owns the Member's Assistant Context can train on it, sell access to it, or shape the Member's behavior through it. Member-owned context is the structural prevention.

The cost: agent assistance is more expensive to build than a non-agent platform would be, even at the substrate level. The action layer's runtime trust substrate (six concerns in [`action-layer.md`](../../product/systems/action-layer.md)) exists *because* of this ADR; without it the action layer could ship simpler.

ADR-9's anti-Nextdoor framing was softened 2026-05-12 in ways that refined this ADR — Member-Location relationships are not refused per se; what's refused is Location-scoped messaging and feeds. Agent assistance built on `member_location_affinities` (e.g., a Concerts-in-the-Park surface assistant) inherits that refinement.

## Consequences

- The action layer ([`action-layer.md`](../../product/systems/action-layer.md), ADR-7) is the only write surface for both humans and agents — agents do not get a back door.
- Schema reservations at b1 (`member_self_records`, `member_delegations`) per [`notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md) Phase 1 (007 series). Surfaces ship b2.
- ADR-17 (`bounded_purchase` scope) is the first concrete Delegation scope and the prototype for all future scopes — caps, recipient_scope, category_scope, reversibility window, first-recipient confirmation.
- Member-Owned Context is not a "settings page" — it is a primitive. UI label is "Assistant Context" per the naming-conventions table in root `CLAUDE.md`.
- Skills sandboxing is mandatory — every Skill runs in a sandbox per [`skills.md`](../../product/systems/skills.md). No exception for "trusted" Skills.
- The platform never mines `member_self_records` for cross-Member analytics, training, advertising signals, or feature shaping. Per Commitment 4. RLS enforces this at the database level (per ADR-16's row-privacy pattern, applied to Assistant Context).
- This ADR forecloses a path where agent assistance is bolted on as a third-party integration after b1 ships. Reversible at significant cost; the foreclosure preserves the Member-owned-by-design property.

## Action Items

1. [x] Decision ratified 2026-05-09.
2. [x] [`agent-assistance.md`](../../product/foundation/agent-assistance.md) umbrella commitments section is the user-facing ratification.
3. [x] Pointer line in [`../DECISIONS.md`](../DECISIONS.md) pointer index.
4. [x] [`delegation.md`](../../product/systems/delegation.md), [`assistant-context.md`](../../product/systems/assistant-context.md), [`skills.md`](../../product/systems/skills.md) are the per-primitive homes.
5. [x] ADR-9 refinement 2026-05-12 — anti-Nextdoor framing narrowed to messaging-scope; this ADR's federation-portability commitment is unaffected.
6. [ ] Phase 1 migrations land the substrate (`member_self_records`, `member_delegations`); surfaces deferred to b2.
7. [ ] ADR-17 (`bounded_purchase`) is the first applied Delegation scope; further scopes require their own ADRs.
