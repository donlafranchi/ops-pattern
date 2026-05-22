# ADR-0017: `bounded_purchase` Delegation scope — agent-mediated one-time purchases within Member-stated bounds

**Status:** Accepted
**Date:** 2026-05-12
**Deciders:** PM
**Scope:** A new monetary-flow Delegation scope authorizing a Member's assistant (or a subscribed Skill) to find and complete one-time purchases within stated bounds; schema-enforced, not policy-enforced
**Touches:** `product/systems/agent-assistance.md` (Policy posture + `bounded_purchase` scope), `product/systems/action-layer.md` (scope catalog + handler invariants), `product/systems/agent-assistance.md` (money-flow umbrella commitment), `product/systems/member.md` (Delegation-scopes Policy posture), `product/foundation/policy.md` (ADR-9 status table), `product/systems/agent-assistance.md` (declarable-scopes vocabulary), `product/systems/payments.md` (rail integration), `notes/agent-commerce-and-project-amendments.md` (the §8b amendment that introduced this scope)

## Decision

A new monetary-flow Delegation scope, `bounded_purchase`, authorizes a Member's assistant (or a subscribed Skill) to find and complete one-time purchases on the Member's behalf within stated bounds. The scope is schema-enforced (not policy-enforced): every Delegation row carries the required fields, and the action-layer handler validates each field against the live grant on every execution.

Required schema fields per Delegation (no nullable):

- `max_per_transaction_cents` — absolute cap per individual purchase
- `max_per_period_cents` — rolling cap per period
- `period_window` — period the rolling cap applies over (day / week / month / year)
- `recipient_scope` — one or more of: `community_members`, `locality`, `specific_members`, `specific_groups`, `external_recipients`. Non-empty
- `category_scope` — Item kind/category filter; required where the recipient is a Member or Group
- `expires_at` — required (default subject to deep-dive ratification per the §7a Pending Ratifications list)
- `reversibility_window_hours` — buyer's-remorse window; default 24–72 hours configurable at grant time
- `first_recipient_confirmation` — boolean, default true
- `prefer_local` — boolean, default true

Required execution semantics:

- Any transaction exceeding caps, scope, or category → auto-blocked at the action layer; surfaced as re-confirm.
- Per-execution event: `delegation.bounded_purchase_executed` (records `amount_cents`, `recipient_ref`, `recipient_kind`, `item_id`, `caps_in_force`, `via_delegation_id`).
- Reversal within the reversibility window: one-tap; writes `delegation.bounded_purchase_reversed`; recipient notified.
- Both buyer and seller are identified in the audit trail. The agent (or Skill) is recorded as `via_delegation_id`, not as a party.
- Caps and scope are immutable by the agent — only the Member can change them, via re-grant.

## Consequences

- `agent-assistance.md` Policy posture carries the full `bounded_purchase` opt-in section (parallel to `recurring_payment`) with the three-filter analysis. Rules in / Rules out updated.
- `action-layer.md` adds `delegation.bounded_purchase` to the closed-world scope catalog with handler invariants (cap enforcement, recipient validation against `recipient_scope`, category validation against `category_scope`, first-recipient-confirmation gate, reversibility-window state seeding, per-execution audit).
- `agent-assistance.md` rewrites the money-flow umbrella commitment to name `recurring_payment` + `bounded_purchase` as the two schema-enforced monetary-flow scopes; pledges remain Member-direct.
- `member.md` Delegation-scopes Policy posture mentions both scopes; the prior "categorically not delegable for one-time payments and pledges" framing is retired.
- `policy.md` ADR-9 status table includes `bounded_purchase` in the concrete opt-in shapes.
- `agent-assistance.md` declarable-scopes vocabulary includes `bounded_purchase`; Rules in adds the "find local eggs and buy them" pattern.
- `payments.md` Integration with agent commerce section is the rail for honoring this scope; the rail decision (closed-loop + chartered-partner ACH at b2) makes the scope economical at agent scale.
- The introducing authority is `agent-commerce-and-project-amendments.md` §8b. That amendment is temporary; this ADR (plus the per-spec edits it ratifies) is the permanent record.
- This ADR forecloses a path where agent-mediated one-time monetary actions are categorically refused. Other monetary scopes (variable invoicing, agent-initiated refunds, pledge scopes) still require their own three-filter analysis and ADR before introduction.

## Action Items

1. [x] Decision ratified 2026-05-12 via `agent-commerce-and-project-amendments.md` §8b.
2. [x] Pointer line in `../DECISIONS.md` pointer index.
3. [x] Per-spec edits landed across `agent-assistance.md`, `action-layer.md`, `agent-assistance.md`, `member.md`, `policy.md`, `agent-assistance.md`, `payments.md`.
4. [ ] Default `expires_at` value ratified per §7a Pending Ratifications.
5. [ ] Future ADRs for variable invoicing / agent-initiated refunds / pledge scopes each carry their own three-filter analysis.
