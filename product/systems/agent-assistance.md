---
id: what-agent-assistance
purpose: Delegation + Assistant Context + Skills with five umbrella commitments.
layer: what
status: active
---

# System: Agent Assistance

**Purpose:** Establish agent assistance as a first-class architectural concern, not a bolted-on feature. The platform ships three Member primitives — **Delegation** (scoped, expiring, revocable permission grants), **Assistant Context** (Member-owned context document), **Skills** (versioned, distributable capability bundles) — bound by five umbrella commitments and enforced by the runtime trust substrate ([`action-layer.md`](action-layer.md)). Agent assistance is what lets the platform give community business owners and standing organizers the asymmetric tooling that chains and aggregators monopolize, *without* dissolving the people-first commitment that the platform exists to protect.

**Bundles:** b1 (T1 — substrate only: schema reserved, scope vocabulary published, audit fields live, export + purge wired), b2 (T2 — assistant surfaces, three update pathways, platform-curated Skill catalog, standing-vs-scratch tiers, monetary-flow scopes), b3 (T3 — federation-grade Delegations, community-/peer-/federation-authored Skills, Assistant Context federation portability)

**North stars served:** All five, indirectly. Agent assistance is not itself a loop; it is the substrate that lets the assistant accelerate every loop without reducing the Member to a category. Family 3 (Trade) most directly via Skills — Make-and-be-found, Find-a-pro, and Follow-what-you-love sustain real working businesses, not casual hobbies. Family 4 (Pooling) second — stewards benefit heavily from administrative Skills. Loop 13 federation is what Delegation portability and Assistant Context portability serve at T3.

This doc is the canonical home for agent-assistance — commitments, the Delegation permission primitive, the Assistant Context document, and Skills capability bundles.

---

## What this document does

The current technology landscape is built around forms-and-fields UI. LLM-based assistants are routinely asked to act on humans' behalf and struggle with that surface. A people-first platform that ignores agent assistance cedes the asymmetric tooling advantage to chains and aggregators — exactly the structural posture [`../foundation/principles.md`](../foundation/principles.md) exists to refuse.

This document names the **umbrella commitments** that bind the three primitives, then specs each primitive in turn. Each commitment is enforced structurally (data model, action layer, policy posture), not by hope or convention.

## The three primitives

1. **Delegation** — the scoped, expiring, revocable permission grant from a Person to a non-human actor. Every read or write performed by an assistant, a Skill, or a federation peer carries a Delegation; the event log records both the acting Member and the Delegation used. Confirmation-required scopes (publish, pledge, money flow) require per-action human confirmation regardless of grant. Full spec below in § Delegation.

2. **Assistant Context** — the Member-owned, Member-curated document carrying voice, tone, tastes, refusals, pinned facts, and current focus across sessions and across loops. Three update pathways (explicit teach, confirmation-derived, inferred-and-proposed). Full spec below in § Assistant Context.

3. **Skills** — composable, versioned, distributable capability bundles the Member's assistant subscribes to and loads. Sources: platform-curated (free, vetted), Group-authored, peer-shared, federation-provided. Skills declare their Delegation scopes at install; the Member confirms. Skills run in the Member's agent context, not on platform servers. Full spec below in § Skills.

## The umbrella commitments

The five commitments below are what make the three primitives a coherent architecture rather than three loosely-related features. They are not aspirational — each is enforced structurally and each is testable.

### 1. Agents are loop-shaped, not role-shaped

A single Member uses agent assistance across many loops — finding their people, floating an idea, listing a product, organizing a gathering, leading an initiative. The assistant specializes contextually (by which loop the Member is in, with which Skills loaded), not by identity. There is no Maker-Agent or Vendor-Agent or Organizer-Agent type. There is the Member's assistant, doing whatever loop the Member is currently in.

This mirrors the role-as-verb commitment in [`../foundation/principles.md`](../foundation/principles.md): the platform refuses identity-as-claim throughout, including at the agent layer.

### 2. Persistence is standing-derived, not toggle-derived

Agent context depth scales with the standing presence the Member has accumulated, not with a setting they flip. A Member with one casual gathering posted gets a scratch-tier Assistant Context (enough to maintain conversational continuity across a session); a Member with active business-Group memberships or steward roles gets a full standing-tier Assistant Context (a durable assistant context spanning loops).

> **Intent:** A toggle ("enable advanced assistant context") would let any Member opt into chains-and-aggregators-level tooling instantly, which collapses the *earn before extract* disposition into a paywall in disguise. Tying depth to demonstrated standing keeps the asymmetric-tooling gift aimed at the Members the platform exists to strengthen — the ones who have actually invested participation. If a future proposal wants to surface deeper context to Members who haven't earned standing yet, the answer isn't a toggle; it's a new way to earn standing.

This closes the asymmetric-tooling gap with chains and aggregators — giving "the tools of the major players" to community business owners — without modeling a Business entity, claiming a role, or auto-assigning anyone to anything.

### 3. Read can be automated; write requires human confirmation

Reading public data, drafting Items, querying the locality index, proposing Assistant Context updates — all automatable under a Delegation. Publishing an Item, sending a response, granting another Delegation, transferring money — all require per-action human confirmation, regardless of what grant the assistant holds.

> **Intent:** This is the substantive trust commitment, not a UX flourish. An agent that can publish without confirmation can be prompt-injected into publishing on the Member's behalf — which compromises every loop the platform exists to surface (trust between neighbors, durability of pledges, integrity of money flows). The read/write asymmetry is what lets the platform be genuinely agent-friendly without becoming agent-controlled. Future proposals to "let the agent post for you when X is true" should be read as proposals to convert a structural commitment into a heuristic, and rejected.

Money flows are the strictest tier. Outside an active monetary-flow Delegation, every monetary action is Member-direct. The two schema-enforced monetary-flow scopes (per [`../foundation/policy.md`](../foundation/policy.md), § Delegation below, and [`payments.md`](payments.md)) are `recurring_payment` and `bounded_purchase` — each opt-in, schema-enforced, per-execution observable; caps cannot be modified by the agent.

The confirmation-required scopes are not a UX convention — they are a hard schema-level constraint on Delegation use. Code review rejects any action handler that lets the confirmation gate be bypassed.

The assistant never holds the credential it acts under. The action layer ([`action-layer.md`](action-layer.md)) mints a scoped capability per turn, bound to the stated intent, and applies it at the network edge as the call crosses into the handler — the capability never enters the agent's context window, never appears in tool arguments. This is what makes prompt injection structurally non-exfiltrating: a malicious user-content payload cannot leak credentials the agent never had. Read/write asymmetry is the *policy*; per-turn credential vending is the *enforcement*.

### 4. Member-owned, never platform-owned

The Assistant Context is the Member's property. It is fully exportable (one-click `/you/data` action), fully deletable (one-click purge with cascade through the action layer), never trained on, never input to recommendation surfaces, never visible to other Members or their assistants without explicit per-section opt-in sharing.

Skill subscriptions are equally Member-owned. The platform-curated catalog is free forever; Group/peer/federation Skills default to off-platform payment with no platform cut. The opt-in platform-mediated payment (capped 5–10%, per ADR-9) is the Member's choice for each Skill they install, not a default.

This is the relational realization of `principles.md`'s refusal of the surveillance-and-ranking model. The Member's context is theirs, not the platform's product.

### 5. Federation-portable

Under Loop 13 federation, identity, Assistant Context, and (where flagged) Delegations follow the Member to spawned platforms. The agent layer is a federation peer that happens to represent one Member; the same protocols serve both human handoff and assistant handoff.

This is what keeps the platform from becoming a trap. A Member who joins a federated cooperative-services platform takes their assistant context with them. The platform does not hold their attention or their memory captive.

## Shared substrate (consolidated definitions)

The three primitives share three pieces of substrate. Defined once here; referenced by name in the sections below rather than re-defined.

### The standing-tier gate — `member_has_standing_presence`

A read-only view (per [`groups.md`](groups.md)) returning Members with `member_has_standing_presence = true` (≥1 active membership in a kind='business' Group OR steward-role membership in any non-business Group). Replaces the earlier `member_standing_signal` derivation (retired alongside ADR-3's `maker_signal` per ADR-8 + ADR-12 + ADR-13). Outputs a single boolean per Member: standing tier (Group declared) or scratch tier (no qualifying Group). The simplicity is deliberate — every previous draft of a behavioral signal drifted, was gameable, or required policing. Declared Groups are clean.

The standing-tier path is the explicit "Sell" CTA, which creates a kind='business' Group with the Member as sole owner-role membership. No `maker_mode_enabled` column exists; the Group membership itself is the signal. Ending the owner-role membership starts a 90-day dormancy window per `groups.md`; persistence across all three primitives follows the same Group-lifecycle gate (no separate toggle to pause).

### The Delegation scope vocabulary

Published as code constants (TypeScript enum + Postgres enum) and stable from b1 forward; additions are allowed, removals require migration discipline. Used by Delegation (definitions), by Assistant Context (the `read_self_record` / `propose_self_record_update` / `confirm_self_record_update` scopes), and by Skills (declared at install time).

**Read scopes.** `read_locality`, `read_self_record`, `read_member_items`, `read_member_responses`, `read_member_followers`, `read_event_log_self`.

**Draft scopes** (produce server-validated drafts the Member must confirm). `draft_wonder`, `draft_gathering`, `draft_offer`, `draft_ask`, `draft_product`, `draft_service`, `draft_response`, `propose_self_record_update`.

**Confirmation scopes** (require per-action Member confirmation regardless of grant). `confirm_publish_item`, `confirm_publish_response`, `confirm_self_record_update`.

**Monetary-flow scopes (T2, opt-in).**
- `recurring_payment` — carries per-Delegation caps for max-per-transaction, max-per-month, recipient allowlist, expiry.
- `bounded_purchase` — authorizes one-time purchases within Member-stated caps and scopes; carries `max_per_transaction_cents`, `max_per_period_cents`, `period_window`, `recipient_scope`, `category_scope`, `expires_at`, `reversibility_window_hours`, `first_recipient_confirmation`, `prefer_local`. Full shape in § Delegation Policy posture below.

**Federation scopes** (T3, reserved at MVP). `federation_read_initiatives`, `federation_read_pledges`, `federation_read_locations`, `federation_handoff_identity`.

### The action-layer contract

Every action — read, draft, confirm, monetary — flows through the named handlers defined in [`action-layer.md`](action-layer.md) (ADR-7). Every write writes its row and its event in the same transaction. Every Delegation-mediated action populates `acting_member_id` (the granting Member) and `via_delegation_id` (the active grant) in the event log. Per-turn capability vending is the runtime trust substrate; the assistant never holds the credential it acts under.

---

## Delegation

The scoped, expiring, revocable grant mechanism. Originally specced in the prior delegation system spec (now retired; this section is its canonical home).

### What Delegation Is and Why It Matters

A Delegation is a scoped, expiring grant from a Person to a non-human actor (the assistant, a Skill, a federation peer) that authorizes a specific set of actions on the Person's behalf. The Person's name remains on every artifact produced; the Delegation records *who actually typed it*. The platform's event log records both.

The argument for Delegation as a primitive (rather than as a feature on the assistant) is that the same machinery has to serve at least three callers that look different from the outside but are identical underneath: the in-app assistant Maya uses to draft a Wonder; a Skill she subscribes to that pulls market-day prep sheets nightly; a federated CDFI app that needs to read her pledged Initiatives to advise her on capital structure. All three are non-human actors performing scoped actions on a Member's behalf. Modeling them separately reproduces the fragmentation primitives.md exists to prevent.

Delegation is also the structural answer to the question *what stops the assistant from becoming the platform's voice instead of the Member's*. A Delegation is granted by the Member, scoped by the Member, revocable by the Member at any time, and visible to the Member as a list of "what's currently allowed to act for me." The platform itself never holds an open delegation against a Member; that asymmetry is the load-bearing trust commitment.

### Delegation kinds

A single Delegation primitive carries three kinds, distinguished by `grantee_kind`:

**Assistant (T2)** — A grant to the Member's own LLM-based assistant. The most common kind. Scopes are loop-shaped (`read_locality`, `draft_wonder`, `propose_self_record_update`, `confirm_publish` — the last requires per-action human confirmation regardless of grant). Default expiry is 90 days, extendable. Revocable from the Member's settings at any time.

**Skill (T2)** — A grant to a specific Skill the Member has subscribed to (per § Skills below). Scopes are declared by the Skill at install time and confirmed by the Member at subscribe time — the Member sees exactly what the Skill is asking for before the grant is issued. Tied to the subscription: revoking the grant unsubscribes the Skill; unsubscribing the Skill revokes the grant.

**Federation (T3)** — A grant to a federated platform (per Loop 13 in `member-journey.md`) that needs to read or write on the Member's behalf — a CDFI app reading their Initiatives, a cooperative-services platform writing to their Locations. Scopes are tighter, audit is heavier, expiries shorter, and a federation-grade Delegation surfaces in the Member's federation handoff dashboard.

The kind enum is extensible without schema migration.

### Delegation — T1 (MVP)

The b1 commitment is **schema reserved, scopes defined, audit fields populated.** No surfaces ship.

- `delegations` table exists with all fields below.
- The action-layer handlers (per ADR-7) accept an optional `delegation_id` parameter and write `acting_member_id` + `via_delegation_id` to the event log on every action.
- All MVP-shipped actions populate these fields with the obvious values: `acting_member_id = session.member_id`, `via_delegation_id = NULL`. No agent calls happen yet, but the substrate exists.
- The scope vocabulary (above) is published in code as a constant and is stable from b1 forward.
- A read-only `GET /api/me/delegations` endpoint returns the Member's active grants (always empty at b1; non-empty at b2).

### Delegation — T2 (Core)

The assistant surfaces ship; Members can issue, view, and revoke Delegations.

- Member-facing UI: a "Connected Assistants and Skills" page in `/you` listing every active Delegation with kind, grantee label, scopes, expires_at, last-used-at, and a revoke button.
- Grant flow: when a Skill is subscribed (per § Skills) or the assistant requests an elevated scope, the Member sees a clear, scope-by-scope confirmation screen before the Delegation is issued. No silent grants.
- Revocation flow: one-tap from the settings page; takes effect on the next action attempt; revoked Delegations remain in the event log for audit.
- **Confirmation-required scopes.** Scopes ending in `_publish` (e.g., `confirm_publish_item`, `confirm_publish_response`, `confirm_publish_pledge`) cannot be exercised without a per-action Member confirmation, regardless of grant. The Delegation lets the assistant *prepare* the action; the Member always presses publish. This is the line the assistant must not cross (per ADR-6).
- Money-flow scopes are off by default and opt-in only (see § Policy posture below).
- Delegation expiry is enforced server-side; expired Delegations are rejected at the action handler with a re-grant prompt for the Member.
- The Member's event log surfaces "acted via Assistant" / "acted via {Skill name}" annotations on entries where `via_delegation_id` is non-null.

### Delegation — T3 (Polish)

Federation-grade Delegations and audit-grade transparency.

- Federation Delegations: a federated platform that has been registered with this platform can request a Delegation against a Member; the Member sees a federation-branded grant screen and can issue or refuse.
- Cross-platform Delegation portability: when a Member moves their identity to a federated platform, active Delegations that carry over (per a portability flag on each scope) follow the identity; non-portable ones expire at handoff.
- Audit dashboard: the Member can view a chronological log of every action taken under each Delegation, filterable by date, scope, and grantee.
- Delegation analytics for the Member's own consumption (not the platform's): "your bakery skill drafted 47 follower notes this quarter, you confirmed 41."
- Granular scope reduction: the Member can shrink a Delegation's scopes mid-life without revoking and re-granting.

### Delegation — data model

**The spine — `delegations`** (one row per active grant):

- `id` (uuid)
- `granting_member_id` (FK to `members`)
- `grantee_kind` (enum: `assistant`, `skill`, `federation` — `skill` and `federation` reserved at MVP)
- `grantee_label` (text — human-readable name shown on the settings page)
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

**Event log entries (required at MVP):** `delegation.granted`, `delegation.revoked`, `delegation.expired`, `delegation.scope_used` (records grantee_ref + scope on each action; high volume, partition aggressively), `delegation.scope_reduced` (T3), `delegation.handed_off` (T3 federation), `delegation.recurring_payment_executed` (T2 — records amount, recipient, caps in force), `delegation.bounded_purchase_executed` (T2 — records `amount_cents`, `recipient_ref`, `recipient_kind`, `item_id`, `caps_in_force`, `via_delegation_id`), `delegation.bounded_purchase_reversed` (T2 — records the reversal within the reversibility window).

### Delegation — Policy posture

Per [`../foundation/policy.md`](../foundation/policy.md): default is the protective stance; opt-in unlocks specific scopes; the three filters apply to every scope.

**Defaults:**

- Read scopes are off by default; the Member opts in by issuing a Delegation that includes them.
- Draft scopes are off by default; same opt-in mechanism.
- Confirmation scopes (publish-tier) are *always* gated on per-action human confirmation — even when granted via Delegation, the assistant cannot exercise them without an explicit confirmation tap from the Member.
- One-time payments and pledges are off by default. The `bounded_purchase` opt-in (T2 — see below) is the schema-enforced scope that authorizes agent-mediated one-time purchases within stated caps and scopes; outside an active `bounded_purchase` Delegation, every one-time monetary action remains Member-direct.
- Recurring payments are off by default at b1 (scope does not exist); opt-in available at T2 with the mitigations below.

**Available opt-in (T2): `recurring_payment` Delegation.** A Member can grant a tightly-scoped recurring-payment Delegation to enable agent-handled subscription renewals (CSA boxes, recurring service appointments, standing memberships).

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

**Available opt-in (T2): `bounded_purchase` Delegation.** Per `payments.md`. Authorizes the Member's assistant to find and complete one-time purchases on the Member's behalf within stated bounds. Canonical use: *"find me organic eggs from a producer in my community, under $20, and buy them when you find a match"* — or *"contribute up to $200 across the next year to verified local nonprofits I've allowlisted."*

- Three-filter analysis: *helpful* — converts intent into action for routine purchases, gives Members the asymmetric tooling advantage aggregators monopolize but routes the agentic-commerce vector to community recipients (Members, Groups of Members, identified external recipients) instead of extractive intermediaries; expands the addressable buyer pool for producers and identified recipients; makes Buy Close operational at agent scale. *Harms others* — risks (producers flooded beyond fulfillment capacity, money routed to misrepresented external recipients, agent-vs-agent bidding) are mitigated by producer-side rate limits on Item availability per `item.md`, Member-managed allowlists for `external_recipients`, and transparent caps. *Abusable* — significant attack surface, mitigated structurally (see below).
- **Required schema-enforced fields** (no nullable; same-transaction with grant):
  - `max_per_transaction_cents` — absolute cap per individual purchase
  - `max_per_period_cents` — rolling cap per period
  - `period_window` — period the rolling cap applies over (day / week / month / year)
  - `recipient_scope` — one or more of: `community_members` (Members in any Community the granting Member belongs to), `locality` (Members local to the granting Member's `home_location`), `specific_members` (allowlist of Member ids), `specific_groups` (allowlist of Group ids), `external_recipients` (allowlist of identified non-Member recipients). The Member sets the scope; the agent operates inside it. Non-empty.
  - `category_scope` — Item kind/category filter (e.g., `product:food`, `service:repair`). Required where the recipient is a Member or Group; optional for `external_recipients` since those are pre-identified.
  - `expires_at` — required; default subject to deep-dive ratification per the Pending Ratifications list.
  - `reversibility_window_hours` — buyer's-remorse window during which the Member can unilaterally reverse the purchase. Default subject to ratification; per `payments.md` §8 the default range is 24–72 hours configurable at grant time.
  - `first_recipient_confirmation` — boolean, default true; first purchase from any new recipient requires per-action confirmation even within an active Delegation.
  - `prefer_local` — boolean, default true; when multiple matches exist, the agent surfaces locally-owned options first (computed per `groups.md`'s locality derivation, which reads `member_business_jurisdictions` via `public.zip_is_proximal_to_location()` per `business-jurisdiction.md` — the only locality path under ADR-21).
- **Required execution semantics:**
  - Any transaction exceeding caps, scope, or category → auto-blocked; surfaced as a re-confirm prompt.
  - Per-execution event: `delegation.bounded_purchase_executed` with `amount_cents`, `recipient_ref`, `recipient_kind` (member / group / external), `item_id` (if applicable), `caps_in_force`, `via_delegation_id`.
  - Reversal within the reversibility window: one-tap; writes `delegation.bounded_purchase_reversed`; recipient is notified.
  - Anomaly detection: schema-compliant transactions matching unusual patterns surface a soft prompt without blocking.
- **What `bounded_purchase` does NOT do:**
  - Does not allow recipients outside the Member's stated `recipient_scope`.
  - Does not allow caps or scopes to be modified by the agent — only the Member, via re-grant.
  - Does not allow the platform to take a cut. Fee structure for agent-mediated commerce lives in `payments.md` §9; nothing in this scope predetermines it.
- **Visibility of the human.** Seller and buyer always see each other in the audit trail: the seller's view shows the buyer's identity; the buyer's view shows the seller's identity. The agent is recorded as `via_delegation_id`, not as a party. Agents are unnamed labor; the relationship is the primitive.
- **Abuse vectors and mitigations:**
  - *Compromised assistant exhausts caps* — caps are hard ceilings; the reversibility window lets the Member undo unauthorized purchases; first-recipient confirmation prevents drainage to a single new recipient.
  - *Malicious Skill drafts purchases to attacker-allowlisted recipients* — `recipient_scope` is set by the Member, not by the Skill; an attacker would have to manipulate the Member into allowlisting before the Skill could route there.
  - *Prompt-injection from listings* — the action layer's per-turn capability vending (per `action-layer.md`) prevents credential exfiltration. A prompt-injected agent produces malformed tool calls; it cannot exceed caps, scope, or category.
  - *Platform raises caps unilaterally* — caps are per-Delegation, set by the Member, immutable by the platform without re-grant. Schema-enforced.

Any future monetary scope (e.g., variable invoicing, agent-initiated refunds) requires its own three-filter analysis and ADR before introduction.

### Delegation — what it rules in and rules out

Rules in: a Member's assistant drafts, summarizes, schedules, and prepares actions across every loop, with the Member's identity preserved on every artifact and a one-tap revoke if anything goes wrong. Rules in: a Skill running in the Member's agent context can read what it was granted to read and write what it was granted to draft, with the Member always pressing publish. Rules in: a federated CDFI can read a community's pledged Initiatives through a federation Delegation issued by a steward, without requiring a separate identity system on the partner platform.

Rules in (T2): a Member opts in to a `recurring_payment` Delegation for her standing CSA subscription with a $40-per-transaction cap, a $200-monthly cap, and a single allowlisted recipient — the assistant handles the monthly renewal silently within those bounds, surfaces the transaction in her audit log, and prompts her if anything exceeds the caps.

Rules in (T2): a Member opts in to a `bounded_purchase` Delegation with `max_per_transaction_cents = 2000` ($20), `recipient_scope = ['locality', 'specific_groups: oak-park-sourdough']`, `category_scope = 'product:food'`, and the agent finds and buys eggs matching her intent — within bounds, with reversibility, with both parties visible in the audit trail.

Rules out: any non-human actor that is not granted a Delegation. The platform itself never holds a Delegation against a Member. Rules out: silent agent action. Rules out: agent-mediated one-time purchases outside an active `bounded_purchase` Delegation. Rules out: monetary-flow Delegations (`recurring_payment` or `bounded_purchase`) without the schema-enforced fields. Rules out: caps or scope being modified by the agent — only the Member, via re-grant. Rules out: Delegations that survive the Member — when a Member account is deleted, all Delegations are revoked atomically.

### Delegation — open questions

- **Default expiry length.** 90 days for assistant Delegations is a starting point; the right number is empirical. Confirm at b2 launch.
- **Delegations across Groups.** Working answer: Member-scoped, not Group-scoped; Groups the Member belongs to are inherited. Revisit if Groups gain their own privacy boundaries that warrant separate consent.
- **Shared-assistant Delegations.** When a kind='business' Group with multiple owner-role memberships (a cooperative bakery) wants a shared assistant. Working answer: each Member grants individually; the assistant operates with the union of grants and writes acting-member attribution per action. Revisit when the first cooperative ships.
- **Anonymous Loop 3 traffic.** Working answer: read scopes against public data, no Delegation required; bridges to a real Delegation if/when the newcomer creates an account mid-session.

---

## Assistant Context

The Member-owned, Member-curated, agent-readable document. Originally specced in the prior assistant-context system spec (now retired; this section is its canonical home).

> **Naming.** User-facing label is **Assistant Context**. Schema name is `member_self_records` (durable; do not rename in code). See [`../../CLAUDE.md`](../../CLAUDE.md) § Naming conventions.

### What the Assistant Context Is and Why It Matters

The Assistant Context is a small, structured document the Member curates (with assistant assistance) that captures the things they want their assistant to remember about them. Voice. Tone. Tastes. Refusals. Pinned facts. Current focus. It is *not* a profile in the social-media sense — it is never visible to other Members, never visible to other Members' assistants, never input to the discovery feed, never used as training data by the platform.

The argument for the Assistant Context as a first-class system (rather than an LLM "context window dump" or a JSON blob on the Member row) is that it carries weight the platform must respect structurally:

- It is **the Member's instrument**, not the platform's. Treating it as a regular column on `members` invites it to be queried, joined against, surfaced in dashboards, and eventually monetized. A separate primitive with its own access controls keeps the line clean.
- It must be **portable** under Loop 13 federation. When a Member's identity moves to a federated platform, the Assistant Context goes with them.
- It must be **append-only versioned**. Members should be able to see how their Assistant Context has evolved, undo bad updates, and audit what the assistant has proposed over time.
- It must be **distinct from the event log**. The event log records what the Member *did*; the Assistant Context records what they *said about themselves and their preferences*.

### The three persistence layers, kept structurally apart

The Assistant Context is one of three persistence substrates the assistant reads from. They share no tables and no permissions:

**Event log** (per `item.md`, etc.) — Objective behavior, platform-authored, the substrate of stake accumulation.

**Assistant Context** (this section) — Subjective context, Member-authored with assistant assistance, the substrate of personalization.

**Per-loop scratchpad** (ephemeral, not persisted) — The current session's working memo. Dies with the session unless the Member promotes a fact into the Assistant Context.

The non-negotiable across all three: nothing the Member did not author or confirm can land in the Assistant Context. Inferred patterns from the event log can be *proposed* to the Member as Assistant Context updates, but only the Member's confirmation makes them durable.

### Persistence is standing-gated

Per ADR-6 and the umbrella commitment above, the Assistant Context's persistence tier is gated on `member_has_standing_presence` (defined in § Shared substrate).

**Scratch tier (default).** A new Member, or a Member doing only ephemeral loops (Wonder posting, Loop 3 newcomer browsing) without standing presence, has an Assistant Context that defaults to a small, transient context — name, preferred locality, optional pronouns. Updates persist across sessions but are intentionally minimal. The assistant is helpful but not deeply personalized.

**Standing tier.** A Member with `member_has_standing_presence = true` has access to the full Assistant Context surface: voice samples, tone refusals, taste notes, pinned facts about the Member's work, current-season focus. The affordance prominence and the assistant's update aggressiveness scale with declared Group membership, not with inferred behavioral signals.

### Assistant Context — T1 (MVP)

The b1 commitment is **schema reserved, export and purge live, no UI ships.**

- `member_self_records` table exists with all fields below (one row per Member, created lazily on first write).
- `member_self_record_entries` append-only log table exists.
- Two action-layer handlers ship and are exposed in `/you` settings:
  - `member_self_record.export()` — returns the Member's full Assistant Context + entry history as JSON. Accessible at `/you/data`.
  - `member_self_record.purge()` — deletes the Assistant Context and all entries atomically. Same surface.
- The platform's default policy posture for the Assistant Context is the protective one (see § Policy posture below).

### Assistant Context — T2 (Core)

The assistant surfaces ship; Members can author and curate the Assistant Context through the assistant or directly.

- An Assistant Context editor in `/you` exposing each section as a small free-text field with version history. Members can edit directly without the assistant.
- The three update pathways (per ADR-6) are wired:
  - **Explicit teach** — the Member tells the assistant something to remember; the assistant writes it verbatim with `source = explicit`.
  - **Confirmation-derived** — the assistant proposes ("Want me to remember you prefer plainspoken descriptions?"); on accept, written with `source = confirmation_derived`.
  - **Inferred** — the assistant notices a behavioral pattern and surfaces a *suggestion* with the underlying evidence link; on accept, written with `source = inferred`. Rejected suggestions are logged but not retried for 90 days.
- **No silent writes, ever.** Every entry has a `confirmed_at` timestamp; entries without one are proposals, not record. The schema enforces this.
- Standing-vs-scratch persistence tiers surface visibly: a small badge on the Assistant Context page showing the current tier and the standing signals that promote it.
- A "blind this session" toggle in the assistant: the Member can ask the assistant to answer without using the Assistant Context for the current session, without deleting anything.
- Section-level revoke: the Member can delete a single section (voice, tastes, refusals, etc.) without purging the whole Assistant Context.

### Assistant Context — T3 (Polish)

Federation portability and identity-grade controls.

- **Federation export.** When a Member moves their identity to a federated platform (per Loop 13), the Assistant Context is portable through the federation handoff protocol. Format is a documented JSON schema versioned independently of the platform's internal storage.
- **Per-Skill scoping.** A Member can scope which sections of the Assistant Context a specific Skill is allowed to read.
- **Diff view.** A timeline showing how each section has evolved, with the assistant's proposed changes annotated.
- **Bulk re-confirm.** A periodic prompt (default annual, configurable) asking the Member to re-confirm the Assistant Context is still accurate.

### Assistant Context — data model

**The spine — `member_self_records`** (one row per Member, created lazily):

- `id` (uuid)
- `member_id` (FK to `members`, unique)
- `voice` (text nullable — "writing voice" notes: tone, register, words to use, words to refuse)
- `tastes` (text nullable — categories of Items they're drawn to, scales of gathering they enjoy, kinds of Locations they trust)
- `refusals` (text nullable — explicit don'ts)
- `pinned_facts` (text nullable — small standing facts: service area, kid's school district, days they don't take work)
- `current_focus` (text nullable — what they're working on this season; expected to churn)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

All text fields are nullable, default null, and intentionally small (recommended ≤ 2000 characters per field; soft-enforced in the editor, hard-enforced at the column level if needed at b3). The Assistant Context is a document a Member could read in two minutes, not a profile a recruiter could mine.

**Append-only entry log — `member_self_record_entries`:**

- `id` (uuid)
- `member_id` (FK)
- `section` (enum: `voice`, `tastes`, `refusals`, `pinned_facts`, `current_focus`)
- `proposed_content` (text — the new value being proposed for the section)
- `previous_content` (text nullable — the value being replaced)
- `source` (enum: `explicit`, `confirmation_derived`, `inferred`, `member_direct_edit`)
- `via_delegation_id` (FK to `delegations`, nullable — null only when source = `member_direct_edit`)
- `evidence_event_ids` (uuid[] — for `inferred` source, the event log entries the inference was based on)
- `proposed_at` (timestamptz)
- `confirmed_at` (timestamptz nullable — null = pending proposal; non-null = accepted and applied)
- `rejected_at` (timestamptz nullable — non-null = rejected; do not re-propose for 90 days)
- `rejected_reason` (text nullable)

The current Assistant Context values in the spine table are a denormalization of the latest `confirmed_at` entry per section, maintained by a trigger.

**Event log entries (required at MVP):** `self_record.entry_proposed`, `self_record.entry_confirmed`, `self_record.entry_rejected`, `self_record.section_purged`, `self_record.fully_purged`, `self_record.exported`, `self_record.blinded_session` (T2), `self_record.federated_out` (T3).

### Assistant Context — Policy posture

Per [`../foundation/policy.md`](../foundation/policy.md): default is the protective stance; opt-in unlocks richer behavior; every opt-in passes the three filters.

**Defaults (no opt-ins active):**

- **Member-owned.** The Assistant Context is conceptually and legally the Member's; the platform is custodian, not owner.
- **Fully exportable.** Single action returns the entire record + entry history as JSON, anytime.
- **Fully deletable.** Single action purges atomically, anytime; deletion cascades to entries.
- **Not trained on by default.** Assistant Context content is not used as training data for any platform-built model and is not shared with third-party model providers as training data.
- **Not feed-fuel by default.** The Assistant Context is not an input to the locality index, the discovery surface, the Trending feed, the recommendation engine, or any surface that decides what other Members see.
- **Not visible to other Members by default.** Not directly, not by inference, not in aggregate. Other Members' assistants cannot read a Member's Assistant Context.

**Available opt-ins (T2 unless noted):**

- **Anonymized aggregate analysis.** A Member can opt in to having their Assistant Context contribute to anonymized aggregate analyses of regional patterns. Three-filter: *helpful* — surfaces regional context; *harms others* — no, with k-anonymity floor N≥10; *abusable* — re-identification risk addressed by structural k-anonymity, periodic adversarial review, and the always-available opt-out. Per-section granularity.
- **Cross-Member sharing of selected sections.** A Member can explicitly share named sections with another named Member or a Member's assistant, time-bounded by default. Default share duration: 90 days, extendable.
- **Opt-in feed input (T3, deferred).** A Member can opt in to having their Assistant Context influence what *they themselves* see (never what other Members see). The categorical refusal of feed input *for other Members* remains permanent.

**Per-Skill scoping (T3):** Members can shrink which sections each subscribed Skill sees, regardless of opt-in posture.

### Assistant Context — what it rules in and rules out

Rules in: an assistant that, after a year of standing presence, knows Maya prefers "naturally leavened" over "artisan," that her market days are Thursday and Saturday, that she doesn't take orders during fire season, and that she's currently piloting a focaccia line she wants to keep quiet about for two more weeks. The same assistant works equally well for her one-off Wonder about a Sunday coffee walk because the Assistant Context applies across loops.

Rules in (T2): Maya opts in to anonymized regional aggregation; the platform can surface "plainspoken descriptions are common among West Sacramento bakers" without exposing her name. Rules in (T2): Maya hands her Saturday-booth operating notes to Sarah for 60 days when Sarah joins as `staff`; Sarah's assistant can read those sections during the share window.

Rules out (defaults, never opt-in): a profile of Maya the platform sells, surfaces to other Members without her opt-in, or feeds into other Members' recommendations. Rules out: silent personalization where the assistant inferred something the Member never confirmed and acted on it for months. Rules out: an Assistant Context that survives the Member — when a Member account is deleted, the Assistant Context is purged in the same transaction. Rules out (permanent, not opt-in): the Assistant Context influencing what other Members see, ever.

### Assistant Context — open questions

- **Inference cadence and rate limit.** Working answer: surface at most one proposal per session, dismissable, with rejected proposals cooling off 90 days. Confirm at b2 launch.
- **Voice samples vs. voice notes.** Working answer: notes only at b2; samples possible at b3 if the assistant integration warrants.
- **Cross-platform Assistant Context.** Working answer: two, with explicit user-controlled sync at T3, never automatic.
- **Assistant Context under Group membership.** Working answer: no — Group context is read at task time, not baked into the Assistant Context. Groups are joined and left; the Assistant Context is more durable than that.

---

## Skills

Composable, versioned, distributable capability bundles. Originally specced in the prior skills system spec (now retired; this section is its canonical home).

### What a Skill Is and Why It Matters

A Skill is a packaged capability bundle the Member's assistant loads when subscribed. Each Skill carries:

- **Instructions** — domain-specific guidance the assistant follows when the Skill's surface is invoked.
- **Declared scopes** — the Delegation scopes (from § Shared substrate) the Skill needs to do its work, presented to the Member at subscribe time.
- **Optional tooling** — references to MCP tools, external integrations, or scheduled-job hooks the Skill uses. Tooling runs in the Member's agent context, not on the platform's servers.
- **Optional templates** — text templates, structured-form templates, or message templates the Skill produces.
- **Versioning** — Skills are versioned semantically; Member subscriptions pin a version and update only on explicit re-confirm.

The argument for Skills as a primitive (rather than as in-app features the platform builds and ships) is competitive and structural at once:

**Competitive.** A baker on Etsy has access to thousands of seller plugins. A baker on Yelp has none. The difference is composability. This platform's people-first commitment is hollow if it ships only what a small team can build in-house.

**Structural.** Skills make the Loop 13 federation thesis concrete one tier earlier than federation itself. A CDFI doesn't have to wait for a fully-spawned cooperative-services platform — it can publish a Skill (loan readiness assessment, capital structure proposal, pledge accounting) that Members subscribe to today.

**Personal.** A Skill authored by Maya — "how I run my Saturday market booth" — is the platform's answer to *master-craftsperson knowledge* in a form that doesn't reduce it to advice content. It's executable, distributable, attributable, and revocable. Maya owns the Skill; subscribers see her name on it; she can update it as her practice evolves.

### Skill kinds

A single Skill primitive carries kinds distinguished by `source_kind`:

**Platform (T2)** — Skills authored and maintained by the platform team. Free, curated, vetted. The seed catalog.

**Group (T3)** — Skills authored by named Groups (a guild, an association, a co-op). Surface the authoring Group on the Skill page. Free or paid at the Group's discretion (revenue does not flow through the platform; payment integration is the Group's responsibility).

**Peer (T3)** — Skills authored by individual Members and shared with one or more other Members. Maya writes a market-day-prep skill and shares it with her two friends; later she lists it publicly. Surface the authoring Member on the Skill page.

**Federation (T3)** — Skills published by federated platforms (per Loop 13). A CDFI publishes a loan-readiness skill that runs in the Member's agent context but resolves against the CDFI's own systems.

The kind enum is extensible without schema migration.

### Skills — T1 (MVP)

The b1 commitment is **schema reserved, scope-declaration vocabulary published, no Skills ship.** No subscription surface, no execution surface, no catalog. The substrate exists.

- `skills` table exists with all fields below.
- `skill_subscriptions` table exists.
- The Skill manifest format is published as a documented JSON schema (versioned independently of the platform schema).
- The Delegation scope vocabulary (per § Shared substrate) is the same vocabulary Skills declare against — additive forever, stable from b1.
- A read-only `GET /api/skills` endpoint returns the (empty) catalog; same for `GET /api/me/skill-subscriptions`.

### Skills — T2 (Core)

The platform-curated skill catalog ships, the subscription flow ships, the assistant executes Skills.

- A small, curated seed catalog of platform Skills (~10-15 at launch), spanning the loops. Initial set targets the standing-presence cluster:
  - **Seller skills**: market-day prep, follower digest, pricing reconnaissance, inventory rollover, photo-listing assistant.
  - **Service-offering skills**: incoming-ask intake, license-renewal tracker, service-area performance summary, endorsement nudge.
  - **Gathering organizer skills**: RSVP digest, recurring-event reminder, weather check, new-attendee welcome.
  - **Steward skills (deferred to b2 late or b3)**: shared-resource maintenance schedule, rotation reminders.
- A skill catalog page at `/skills` browsable by all Members. Filterable by loop family, by source kind (T3), and by subscriber count.
- A skill detail page at `/skills/[slug]` showing: description, declared scopes, version, source, subscriber count, "what this Skill does for you" plain-language summary.
- Subscription flow:
  - Member taps Subscribe.
  - Member sees a single confirmation screen listing the Skill's declared scopes, plain-language.
  - Member confirms; a Delegation is issued (per § Delegation); the subscription row is created.
  - Skill is now active; the assistant loads its instructions and tooling on relevant tasks.
- Unsubscription: one-tap from `/you/skills`; revokes the Delegation atomically; subscription row is soft-deleted.
- Skill update flow: when an author publishes a new version, subscribers see a notification with a diff of changes (especially scope changes). Scope additions in a new version *always* require re-confirm; scope removals do not.
- The assistant surfaces "powered by [Skill name]" annotations when a Skill contributed to a task.

### Skills — T3 (Polish)

Group-authored, peer-shared, federation-provided Skills; richer distribution and discovery.

- **Group-authored Skills.** A named Group can publish Skills under its name. Authoring requires a moderation step at the Group level (steward approval) and a one-time platform review for scope abuse.
- **Peer-shared Skills.** A Member can publish a Skill under their own name. Distribution can be private (shared with explicit Members), unlisted (link-only), or listed publicly in the catalog.
- **Federation-provided Skills.** A federated platform can publish Skills that run in the Member's agent context but resolve external tooling against the federation peer.
- **Skill bundles** — a set of related Skills published together, subscribable as a unit.
- **Skill discovery via standing presence** — the assistant can suggest Skills relevant to the Member's declared Group memberships and current activity. Suggestions, never auto-subscriptions. Surfaced only to Members with `member_has_standing_presence`.
- **Skill-level Assistant Context scoping** (per § Assistant Context T3).
- **Skill execution analytics for the Member** (not the platform).

### Skills — data model

**The spine — `skills`** (one row per Skill, all source kinds):

- `id` (uuid)
- `slug` (text unique — used in URLs)
- `name` (text)
- `description` (text — plain language, what the Skill does for the Member)
- `version` (text — semver: `MAJOR.MINOR.PATCH`)
- `source_kind` (enum: `platform`, `group`, `peer`, `federation` — `group`, `peer`, `federation` reserved at MVP)
- `author_member_id` (FK to `members`, nullable — set for `peer`)
- `author_group_id` (FK to `groups`, nullable — set for `group`; replaces the prior `author_community_id` per the 2026-05-10 Groups ratification)
- `author_federation_id` (FK to `federation_peers`, nullable — set for `federation`, T3)
- `requested_scopes` (text[] — Delegation scope strings the Skill declares)
- `manifest_url` (text — pointer to the versioned manifest JSON)
- `loop_families` (text[] — `gathering`, `sharing`, `trade`, `pooling`, `federation`)
- `published_at` (timestamptz)
- `deprecated_at` (timestamptz nullable — Skill is still loadable but no new subscriptions allowed)
- `removed_at` (timestamptz nullable — Skill is unloadable; existing subscriptions are revoked atomically with notification)

**Skill versions** (`skill_versions`) — one row per published version, immutable: `id`, `skill_id` (FK), `version`, `manifest_url`, `requested_scopes`, `changelog`, `published_at`.

**Subscriptions** (`skill_subscriptions`): `id`, `member_id` (FK), `skill_id` (FK), `pinned_version`, `delegation_id` (FK), `subscribed_at`, `unsubscribed_at`, `update_available_version`.

**Event log entries (required at MVP):** `skill.published`, `skill.version_published`, `skill.deprecated`, `skill.removed`, `skill.subscribed`, `skill.unsubscribed`, `skill.version_updated`, `skill.executed`.

### Skills — execution model

Skills run in the **Member's agent context**, not on the platform's servers. The platform hosts the manifest, mediates subscription, issues Delegations, and audits scope use — but the actual instructions and tooling execute wherever the Member's assistant runs (the in-app assistant at b2; an external MCP client at b3 federation).

Consequences:

- The platform doesn't see what the Skill does with the Member's data once it has been read under a Delegation.
- The platform *does* see every scope use (`delegation.scope_used` event log entries) and can detect a Skill that requests scopes it never uses (suggesting over-broad asks) or that's flagged by Members as misbehaving.
- The platform reserves the right to deprecate or remove a Skill at any time for scope abuse, deceptive behavior, or violation of platform principles.

### Skills — revenue posture

Per [`../foundation/policy.md`](../foundation/policy.md): default is the protective stance for both Member and Skill author; opt-in unlocks platform-mediated payment.

**Defaults:**

- **Platform-curated Skills are free, always.** The platform never charges Members for capability published by the platform itself. (Permanent, not opt-in.)
- **Group, peer, and federation Skills are off-platform-paid by default.** The Skill author handles payment outside the platform; the platform mediates only the manifest, subscription, and Delegation. The platform takes no cut.

**Available opt-in (Skill author opts in, T2 late or T3):**

- **Platform-mediated payment with a transparent cut.** A Group, peer, or federation Skill author can opt in to letting the platform handle payment for their Skill in exchange for a published cut (target: 5–10%, capped publicly, governance commitment to never raise without 90-day notice and re-opt-in).
  - Three-filter analysis: *helpful* — yes, lowers payment friction; *harms others* — no, opt-in for the author, the Member sees the same price either way; *abusable* — platform raising the cut over time (mitigated by published cap + re-opt-in requirement on changes), platform favoring its own Skills in catalog (mitigated by separate "platform" badge and no algorithmic ranking — sort by subscriber count and recency only).
  - The opt-in is per Skill, revocable by the author.
  - Free Skills authored by Group/peer/federation never trigger this option.

This posture preserves the platform's revenue thesis while adding a Member-author-controlled, transparent, capped revenue stream from value created on the platform — structurally different from the "pay-for-visibility" model the foundation rejects.

### Skills — what they rule in and rule out

Rules in: a baker subscribes to a market-day-prep skill on Friday night, the assistant generates the Saturday prep sheet against her current product Items and the Saturday Gathering Item her booth attaches to, she reviews and adjusts in 90 seconds. Rules in: a plumber subscribes to a license-renewal skill that quietly tracks his California state board renewal and prompts him 60 days out. Rules in: the Sacramento Independent Bakers' Guild publishes a sourdough-pricing skill informed by their own data; fifty regional bakers subscribe; pricing across the region rises out of the race-to-the-bottom over six months without the platform doing anything.

Rules in (T2 late / T3): a Group-authored Skill author opts in to platform-mediated payment with a published cut, lowering friction for Members and generating aligned platform revenue from value created on it. Rules in (T2): a Skill can declare the `bounded_purchase` scope at install time and, with the Member's grant, find and complete one-time purchases on the Member's behalf within stated bounds (per § Delegation Policy posture). The Skill never modifies the caps or scope; only the Member can, via re-grant.

Rules out: Skills that auto-publish or move money without explicit Member confirmation per action where the scope demands it. Rules out: a platform that *requires* its cut on Group-authored value — the platform-mediated payment opt-in is always opt-in, off-platform payment is always available. Rules out: Skills imposed on Members by the platform — every Skill is opt-in, even platform-authored ones. Rules out: pay-for-visibility — the cut funds maintenance, not catalog ranking. Rules out: Skills that route monetary actions to recipients outside the Member's stated `recipient_scope` — the action layer enforces this; a non-compliant Skill is auto-blocked at execution.

### Skills — open questions

- **Scope inflation policing.** Skills that request more scopes than they use. Working answer: track scope-use vs. scope-declared per Skill, surface unused scopes to the Member, allow the Member to revoke unused scopes without unsubscribing. Confirm at b2.
- **Skill conflict.** Working answer: the assistant surfaces the conflict to the Member and asks which to prefer; the answer becomes an Assistant Context entry.
- **Skill author accountability.** Working answer: Member-level revoke is always available; platform reserves removal for abuse; the authoring Member's standing is unaffected by Skill behavior unless platform-level removal happens.
- **Cooperative Skill ownership.** Working answer: the Group is the author; cooperative authorship is logged in the Skill manifest history; revenue (if any) flows to the Group's chosen recipient.
- **Skill discoverability vs. spam.** Working answer: subscriber count + recency surfaces quality without an algorithmic feed; reports for abuse; no paid promotion.

---

## What ships at b1

**Substrate only.** No agent-assistance surfaces ship at b1. What lands:

- The three tables: `delegations` (with the scope enum populated), `member_self_records` (one row per Member, default scratch-tier), and `skill_subscriptions` (empty at b1, fillable from `/you/skills` at b2). Plus `skills` (the manifest spine) and `skill_versions`.
- The audit fields `acting_member_id NOT NULL` and `via_delegation_id` (nullable) on every `*_events` row, populated by the action layer (per ADR-7). The system Member is the `acting_member_id` for platform-emitted events; Members are the `acting_member_id` for their own writes; Delegation-mediated writes (b2+) carry the granted Delegation's id.
- The `/you/data` export action (one-click JSON of the Member's full data envelope including Assistant Context) and the `/you/data` purge action (cascade-delete via the action layer).

**No surfaces at b1.** No assistant chat panel, no `/you/skills` catalog browsing, no Skill subscription flow, no Assistant Context editor UI. Members at b1 know none of this exists — but every write they perform populates the audit trail that lets the b2+ stack land cleanly without retrofit.

## What ships at b2

The assistant surfaces. The platform-curated Skill catalog at `/skills`. The subscription flow with explicit Delegation grant per Skill. The three Assistant Context update pathways (explicit teach via `/you/agents`, confirmation-derived via task completion, inferred-and-proposed at one-per-session cadence). The export and purge surfaces become visible (the actions exist at b1; the UI surfaces them at b2). The `recurring_payment` and `bounded_purchase` Delegation scopes ship with their schema-enforced mitigations.

## What ships at b3

Federation-grade Delegations. Group-/peer-/federation-authored Skills. Assistant Context federation portability. The opt-in platform-mediated Skill payment (per ADR-9, opt-in for authors who choose it; capped 5–10%; funds maintenance, not ranking). Per-Skill Assistant Context section scoping.

---

## Integration Points

- **Connects to:**
  - **Member** ([`member.md`](member.md)) — every Delegation is granted by a Member; the Assistant Context is one-to-one with `members`; subscriptions belong to Members.
  - **Group** ([`groups.md`](groups.md)) — `member_has_standing_presence` is defined here; Group-authored Skills (T3) author through it.
  - **Item** ([`item.md`](item.md)) — every Item created via assistant carries `via_delegation_id` in its event log entries.
  - **Action Layer** ([`action-layer.md`](action-layer.md)) — every Delegation grant flows through the named handlers; every Skill subscription issues a Delegation through it; runtime trust substrate (capability vending, confirmation gate, per-turn binding) is the action layer's job.
  - **Payments** ([`payments.md`](payments.md)) — `recurring_payment` and `bounded_purchase` Delegations resolve against the payment rail.
  - **Federation** (T3 — federation peers transact via Delegation, author Skills, accept Assistant Context handoff; per forthcoming `federation.md`).
- **Used by:**
  - The MCP server (every tool invocation requires a Delegation token).
  - The Member's assistant (loads subscribed Skills' instructions + tooling on relevant tasks; reads Assistant Context on session bootstrap).
  - The `/you` settings surfaces ("Connected Assistants and Skills" page, Assistant Context editor, `/you/skills` subscription management).
  - The Member's event log audit view.
  - Future federation handoff flows.

---

## Decisions encoded here

This spec is the live home for the architectural decisions below. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register.

| ADR | Status | What lives here |
|---|---|---|
| ADR-6 | Accepted, refined by ADR-9 | Agent assistance is first-class. Three primitives (Delegation, Assistant Context, Skills). Five umbrella commitments: loop-shaped not role-shaped · persistence is standing-derived · read can be automated, write requires human confirmation · Member-owned, never platform-owned · federation-portable. b1 ships substrate only; surfaces ship b2; federation-grade ships b3. |
| ADR-9 (Delegation portion) | Accepted | Opt-in monetary-flow scopes with schema-enforced mitigations: `recurring_payment` and `bounded_purchase`. Outside an active monetary-flow Delegation, one-time monetary actions remain Member-direct. Pledges are not delegable at this writing; revisit if a pledge-shaped scope passes its own three-filter test. |
| ADR-9 (Assistant Context portion) | Accepted | Opt-in anonymized aggregate analysis (k-anonymity floor N≥10). Opt-in cross-Member sharing (granular, time-bounded). Categorical refusal of feed input *for other Members* is permanent. |
| ADR-9 (Skills portion) | Accepted | Platform-curated Skills remain free permanently. Group/peer/federation Skills default to off-platform payment with no platform cut. Opt-in available T2-late / T3: platform-mediated payment with a published, capped cut (target 5–10%) for authors who choose it. The cut funds maintenance, not catalog ranking. No paid promotion ever. |
| `bounded_purchase` Delegation scope | Ratified | Scope shape, mitigations, and three-filter analysis live in this spec under § Delegation Policy posture. |

This spec *consumes* ADR-7 (the action-layer contract — Delegation grants flow through the named handlers `delegation.grant` / `delegation.revoke`; every issuance writes an event row in the same transaction as the row insert; runtime enforcement of scope, capability vending, and the confirmation gate is the action layer's job, not this spec's). ADR-7's full ratification lives in [`action-layer.md`](action-layer.md).

This spec also *encodes* ADR-7 portions for: the `self_record.update_propose` / `self_record.update_confirm` / `self_record.export` / `self_record.purge` handlers; the Skill subscribe/unsubscribe flow through action handlers.
