# System: Delegation

**Purpose:** Establish Delegation as the permission primitive that lets a Person authorize an agent — an LLM-based assistant, a federation peer, a Skill running in their assistant context — to read or act on their behalf, with scoped, expiring, revocable grants. Delegation is what keeps the platform people-first when non-human actors transact: every read and write traces back to a Member who explicitly granted the capability, for a stated purpose, for a stated duration. Without it, agent assistance is either impossibly permissive or impossibly clumsy; with it, the same action layer serves the human composer, the in-app assistant, and an external MCP client through one consistent contract.

**Bundles:** b1 (T1 — schema reserved + audit fields), b2 (T2 — assistant surfaces + grant/revoke flow), b3 (T3 — federation-grade delegations)

**North stars served:** All five, indirectly. Delegation is not itself a loop; it is the trust substrate that lets agent assistance accelerate every loop without dissolving the people-first commitment that the loops depend on.

## What Delegation Is and Why It Matters

A Delegation is a scoped, expiring grant from a Person to a non-human actor (the assistant, a Skill, a federation peer) that authorizes a specific set of actions on the Person's behalf. The Person's name remains on every artifact produced; the Delegation records *who actually typed it*. The platform's event log records both.

The argument for Delegation as a primitive (rather than as a feature on the assistant) is that the same machinery has to serve at least three callers that look different from the outside but are identical underneath: the in-app assistant Maya uses to draft a Wonder; a Skill she subscribes to that pulls market-day prep sheets nightly; a federated CDFI app that needs to read her pledged Initiatives to advise her on capital structure. All three are non-human actors performing scoped actions on a Member's behalf. Modeling them separately reproduces the fragmentation primitives.md exists to prevent.

Delegation is also the structural answer to the question *what stops the assistant from becoming the platform's voice instead of the Member's*. A Delegation is granted by the Member, scoped by the Member, revocable by the Member at any time, and visible to the Member as a list of "what's currently allowed to act for me." The platform itself never holds an open delegation against a Member; that asymmetry is the load-bearing trust commitment.

## Delegation kinds

A single Delegation primitive carries three kinds, distinguished by `grantee_kind`:

**Assistant (T2)** — A grant to the Member's own LLM-based assistant. The most common kind. Scopes are loop-shaped (`read_locality`, `draft_wonder`, `propose_self_record_update`, `confirm_publish` — the last requires per-action human confirmation regardless of grant). Default expiry is 90 days, extendable. Revocable from the Member's settings at any time.

**Skill (T2)** — A grant to a specific Skill the Member has subscribed to (per `skills.md`). Scopes are declared by the Skill at install time and confirmed by the Member at subscribe time — the Member sees exactly what the Skill is asking for before the grant is issued. Tied to the subscription: revoking the grant unsubscribes the Skill; unsubscribing the Skill revokes the grant.

**Federation (T3)** — A grant to a federated platform (per Loop 13 in `loops.md`) that needs to read or write on the Member's behalf — a CDFI app reading their Initiatives, a cooperative-services platform writing to their Locations. Scopes are tighter, audit is heavier, expiries shorter, and a federation-grade Delegation surfaces in the Member's federation handoff dashboard.

The kind enum is extensible without schema migration.

## T1 — MVP Tier

The b1 commitment is **schema reserved, scopes defined, audit fields populated.** No surfaces ship.

- `delegations` table exists with all fields below.
- The action-layer handlers (per [`action-layer.md`](action-layer.md) / ADR-7) accept an optional `delegation_id` parameter and write `acting_member_id` + `via_delegation_id` to the event log on every action.
- All MVP-shipped actions populate these fields with the obvious values: `acting_member_id = session.member_id`, `via_delegation_id = NULL`. No agent calls happen yet, but the substrate exists.
- The scope vocabulary is published in code as a constant (TypeScript enum + Postgres enum) and is stable from b1 forward — additions are allowed, removals require migration discipline.
- A read-only `GET /api/me/delegations` endpoint returns the Member's active grants (always empty at b1; non-empty at b2).

## T2 — Core Tier

The assistant surfaces ship; Members can issue, view, and revoke Delegations.

- Member-facing UI: a "Connected Assistants and Skills" page in `/you` listing every active Delegation with kind, grantee label, scopes, expires_at, last-used-at, and a revoke button.
- Grant flow: when a Skill is subscribed (per `skills.md`) or the assistant requests an elevated scope, the Member sees a clear, scope-by-scope confirmation screen before the Delegation is issued. No silent grants.
- Revocation flow: one-tap from the settings page; takes effect on the next action attempt; revoked Delegations remain in the event log for audit.
- **Confirmation-required scopes.** Scopes ending in `_publish` (e.g., `confirm_publish_item`, `confirm_publish_response`, `confirm_publish_pledge`) cannot be exercised without a per-action Member confirmation, regardless of grant. The Delegation lets the assistant *prepare* the action; the Member always presses publish. This is the line the assistant must not cross (per ADR-6).
- Money-flow scopes are off by default and opt-in only (see "Policy posture" below). At b1 they do not exist; at T2 a single tightly-scoped recurring-payment scope ships; pledges and one-time payments remain Member-direct, never via Delegation.
- Delegation expiry is enforced server-side; expired Delegations are rejected at the action handler with a re-grant prompt for the Member.
- The Member's event log surfaces "acted via Assistant" / "acted via {Skill name}" annotations on entries where `via_delegation_id` is non-null, so the Member can see what the assistant did on their behalf.

## T3 — Polish Tier

Federation-grade Delegations and audit-grade transparency.

- Federation Delegations: a federated platform that has been registered with this platform (per the federation protocol forthcoming in `federation.md`) can request a Delegation against a Member; the Member sees a federation-branded grant screen and can issue or refuse.
- Cross-platform Delegation portability: when a Member moves their identity to a federated platform, active Delegations that carry over (per a portability flag on each scope) follow the identity; non-portable ones expire at handoff.
- Audit dashboard: the Member can view a chronological log of every action taken under each Delegation, filterable by date, scope, and grantee.
- Delegation analytics for the Member's own consumption (not the platform's): "your bakery skill drafted 47 follower notes this quarter, you confirmed 41."
- Granular scope reduction: the Member can shrink a Delegation's scopes mid-life without revoking and re-granting (e.g., remove `propose_self_record_update` while keeping `read_locality`).

## Data model implications

**Required at MVP — retrofit is the failure mode.**

**The spine — `delegations`** (one row per active grant):

- `id` (uuid)
- `granting_member_id` (FK to `members`)
- `grantee_kind` (enum: `assistant`, `skill`, `federation` — `skill` and `federation` reserved at MVP)
- `grantee_label` (text — human-readable name shown on the settings page; for assistant, the Member's chosen assistant name; for skill, the skill name; for federation, the partner platform name)
- `grantee_ref` (text — opaque identifier for the grantee: an assistant session id, a `skills.id`, a federation peer id)
- `scopes` (text[] — array of scope strings from the published vocabulary)
- `granted_at` (timestamptz)
- `expires_at` (timestamptz)
- `revoked_at` (timestamptz, nullable)
- `revoke_reason` (enum nullable: `member_revoked`, `skill_unsubscribed`, `expired`, `federation_handoff`)
- `last_used_at` (timestamptz, nullable — updated on each action)

**Audit fields on every action handler** (added to the event log shape):

- `acting_member_id` (FK to `members` — whose name is on the artifact)
- `via_delegation_id` (FK to `delegations`, nullable — null means human composer, non-null means agent)

The two fields are non-redundant: a Skill subscribed by Maya may be developed by another Member; the Skill acts under Maya's Delegation but the *authorship* of the Skill is recorded on the Skill row, not the action. Only the granting Member is ever the acting Member.

**Scope vocabulary (b1 published, additive forever):**

Read scopes — `read_locality`, `read_self_record`, `read_member_items`, `read_member_responses`, `read_member_followers`, `read_event_log_self`.

Draft scopes (produce server-validated drafts the Member must confirm) — `draft_wonder`, `draft_gathering`, `draft_offer`, `draft_ask`, `draft_product`, `draft_service`, `draft_response`, `propose_self_record_update`.

Confirmation scopes (require per-action Member confirmation regardless of grant) — `confirm_publish_item`, `confirm_publish_response`, `confirm_self_record_update`.

Recurring-payment scope (T2, opt-in, see "Policy posture") — `recurring_payment` (single scope; carries per-Delegation caps for max-per-transaction, max-per-month, recipient allowlist, expiry; one-time payments and pledges remain Member-direct, never delegated).

Federation scopes (T3, reserved at MVP) — `federation_read_initiatives`, `federation_read_pledges`, `federation_read_locations`, `federation_handoff_identity`.

**Event log entries (required at MVP):** `delegation.granted`, `delegation.revoked`, `delegation.expired`, `delegation.scope_used` (records grantee_ref + scope on each action; high volume, partition aggressively), `delegation.scope_reduced` (T3), `delegation.handed_off` (T3 federation), `delegation.recurring_payment_executed` (T2 — records amount, recipient, caps in force).

## Policy posture

Per [`policy-framework.md`](../foundation/policy-framework.md): default is the protective stance; opt-in unlocks specific scopes; the three filters apply to every scope.

**Defaults:**

- Read scopes are off by default; the Member opts in by issuing a Delegation that includes them.
- Draft scopes are off by default; same opt-in mechanism.
- Confirmation scopes (publish-tier) are *always* gated on per-action human confirmation — even when granted via Delegation, the assistant cannot exercise them without an explicit confirmation tap from the Member. This is permanent, not opt-in: the publish moment stays human.
- One-time payments and pledges are *categorically* not delegable. Permanent. The Member performs every one-time monetary action directly.
- Recurring payments are off by default at b1 (scope does not exist); opt-in available at T2 with the mitigations below.

**Available opt-in (T2):**

- **`recurring_payment` Delegation.** A Member can grant a tightly-scoped recurring-payment Delegation to enable agent-handled subscription renewals (CSA boxes, recurring service appointments, standing memberships).
  - Three-filter analysis: *helpful* — yes, removes friction for standing commitments the Member already wants to honor, frees the Member from monthly admin chores, fits naturally into the standing-tier Skills surface; *harms others* — only the Member is at financial risk; the recipient is named and allowlisted; *abusable* — significant attack surface, mitigated structurally.
  - **Required mitigations** (schema-enforced at b2, not policy-only):
    - `max_per_transaction_cents` — required, no nullable
    - `max_per_month_cents` — required, no nullable
    - `recipient_allowlist` — required, non-empty array of Member ids or external payee ids
    - `expires_at` — required, default 1 year, max 2 years
    - First transaction to a new recipient — confirmation required even within an active Delegation
    - Any transaction exceeding caps — auto-blocked, surfaced to Member as a re-confirm prompt
  - Per-transaction observability: every execution writes a `delegation.recurring_payment_executed` event the Member can audit at `/you/agents`.
  - Revoke takes effect immediately for future executions; in-flight transactions complete or are reversed per the payment processor's rules.

The recurring-payment scope is the *only* monetary-flow scope. Future monetary scopes (e.g., variable invoicing, agent-initiated refunds) will require their own three-filter analysis and ADR before introduction. Scope creep here is the failure mode the framework exists to prevent; the burden of proof is on the addition, not the restraint.

## What Delegation rules in and rules out

Rules in: a Member's assistant drafts, summarizes, schedules, and prepares actions across every loop, with the Member's identity preserved on every artifact and a one-tap revoke if anything goes wrong. Rules in: a Skill running in the Member's agent context can read what it was granted to read and write what it was granted to draft, with the Member always pressing publish. Rules in: a federated CDFI can read a community's pledged Initiatives through a federation Delegation issued by a steward, without requiring a separate identity system on the partner platform.

Rules in (T2): a Member opts in to a `recurring_payment` Delegation for her standing CSA subscription with a $40-per-transaction cap, a $200-monthly cap, and a single allowlisted recipient — the assistant handles the monthly renewal silently within those bounds, surfaces the transaction in her audit log, and prompts her if anything exceeds the caps.

Rules out: any non-human actor that is not granted a Delegation. The platform itself never holds a Delegation against a Member. Rules out: silent agent action. Rules out: agent-initiated one-time payments or pledges (one-time monetary actions remain Member-direct, no exception). Rules out: recurring-payment Delegations without explicit per-Delegation caps (the schema enforces this at b2). Rules out: Delegations that survive the Member — when a Member account is deleted, all Delegations are revoked atomically.

## Integration Points

- **Connects to:**
  - **Member** (every Delegation is granted by a Member; per `member.md`)
  - **Assistant Context** (the `propose_self_record_update` and `read_self_record` scopes require Delegation; per `assistant-context.md`)
  - **Skills** (Skill subscriptions issue Delegations; per `skills.md`)
  - **Item** (every Item created via assistant carries `via_delegation_id` in its event log entries; per `item.md`)
  - **Federation** (T3 — federation peers transact via Delegation; per forthcoming `federation.md`)
- **Used by:**
  - The action layer ([`action-layer.md`](action-layer.md) — every write handler validates Delegation scope at entry; the runtime trust substrate mints the per-turn capability and enforces the confirmation gate)
  - The MCP server (every tool invocation requires a Delegation token)
  - The `/you` settings surface ("Connected Assistants and Skills" page)
  - The Member's event log audit view
  - Future federation handoff flows

## Open questions

- **Default expiry length.** 90 days for assistant Delegations is a starting point; the right number is empirical and depends on how often Members are re-prompted without it feeling like nagging. Confirm at b2 launch.
- **Delegations across Communities.** A Member who delegates `draft_gathering` — does that Delegation cover gatherings drafted into any Community the Member belongs to, or does each Community require its own grant? Working answer: Member-scoped, not Community-scoped; Communities the Member belongs to are inherited. Revisit if Communities ever gain their own privacy boundaries that warrant separate consent.
- **Cooperative-Member Delegations.** When a cooperative bakery (a Community of Members operating shared Items per `primitives.md`) wants a shared assistant — does each Member grant their own Delegation, or does the Community hold one collectively? Working answer: each Member grants individually; the assistant operates with the union of grants and writes acting-member attribution per action. Revisit when the first cooperative ships.
- **Anonymous Loop 3 traffic.** A newcomer browsing the locality without an account — can they use an assistant at all? Working answer: yes, but only with read scopes against public data, no Delegation required (no Member to grant it). Bridges to a real Delegation if/when the newcomer creates an account mid-session.

## Decisions encoded here

This spec is the per-primitive home for the Delegation portion of **ADR-6 (Agent assistance)**. The umbrella commitments — loop-shaped not role-shaped, standing-derived persistence, read-automatable/write-confirmed, Member-owned, federation-portable — live in [`../foundation/agent-assistance.md`](../foundation/agent-assistance.md). The cross-cutting pointer is in [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md).

| ADR | Status | What lives here |
|---|---|---|
| ADR-6 (Delegation portion) | Accepted, refined by ADR-9 | The scoped, expiring, revocable permission-grant primitive. Confirmation-required scopes (publish, pledge, money flow) require per-action human confirmation regardless of grant. Federation peers transact via Delegation at T3. |
| ADR-9 (Delegation portion) | Accepted | One-time payments and pledges remain categorically not delegable. Opt-in `recurring_payment` scope with schema-enforced caps, recipient allowlist, expiry, and per-execution observability. |

This spec *consumes* ADR-7 (the action-layer contract — Delegation grants flow through the named handlers `delegation.grant` / `delegation.revoke`; every issuance writes an event row in the same transaction as the row insert; runtime enforcement of scope, capability vending, and the confirmation gate is the action layer's job, not Delegation's). ADR-7's full ratification lives in [`action-layer.md`](action-layer.md).
