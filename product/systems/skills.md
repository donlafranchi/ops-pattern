# System: Skills

**Purpose:** Establish Skills as composable, versioned, distributable capability bundles that a Member's assistant can subscribe to and load — domain-specific guidance and tooling that turn the generic assistant into a baker's assistant, a plumber's assistant, a run-club organizer's assistant, a steward's assistant. Skills are how this platform gives community business owners and standing organizers the asymmetric tooling that chains and major players currently monopolize: bookkeeping, customer follow-up, market-day prep, license tracking, RSVP digests, follower notes — the hundred small admin chores that quietly determine whether a personal business survives.

**Bundles:** b1 (T1 — schema reserved + scope vocabulary published), b2 (T2 — platform-curated skill catalog ships, subscription flow ships), b3 (T3 — community-authored skills, federation-provided skills, peer sharing)

**North stars served:** Family 3 (Trade) most directly — Skills are what let Make-and-be-found, Find-a-pro, and Follow-what-you-love sustain real working businesses, not casual hobbies. Family 4 (Pooling) second — Steward and Pool benefit heavily from administrative skills around shared assets and capital. Families 1 and 2 secondarily — even the Run Club organizer benefits from a gathering-rsvp-digest skill.

## What a Skill Is and Why It Matters

A Skill is a packaged capability bundle the Member's assistant loads when subscribed. Each Skill carries:

- **Instructions** — domain-specific guidance the assistant follows when the Skill's surface is invoked (how to draft a follower note, how to structure a market-day prep sheet, how to summarize a license-renewal status).
- **Declared scopes** — the Delegation scopes the Skill needs to do its work, presented to the Member at subscribe time. The Member sees exactly what the Skill is asking for and can decline.
- **Optional tooling** — references to MCP tools, external integrations (calendars, weather, mapping), or scheduled-job hooks the Skill uses. Tooling runs in the Member's agent context, not on the platform's servers.
- **Optional templates** — text templates, structured-form templates, or message templates the Skill produces (a market-day prep sheet, a follower-digest format, an invoice draft).
- **Versioning** — Skills are versioned semantically; Member subscriptions pin a version and update only on explicit re-confirm.

The argument for Skills as a primitive (rather than as in-app features the platform builds and ships) is competitive and structural at once:

**Competitive.** A baker on Etsy has access to thousands of seller plugins, third-party tools, and admin extensions. A baker on Yelp has none. The difference is composability: Etsy made the seller surface programmable; Yelp kept it monolithic. This platform's people-first commitment is hollow if it ships only what a small team can build in-house. Skills are how a Sacramento Independent Bakers' Guild can publish a sourdough-pricing skill that fifty bakers subscribe to overnight, without the platform's product team writing a line of code.

**Structural.** Skills make the Loop 13 federation thesis concrete one tier earlier than federation itself. A CDFI doesn't have to wait for a fully-spawned cooperative-services platform to start helping a community — it can publish a Skill (loan readiness assessment, capital structure proposal, pledge accounting) that Members subscribe to today. The same architectural commitment that lets a federated platform plug into the Member's agent context also lets a community organization, a peer Member, or the platform itself publish capabilities through one consistent surface.

**Personal.** A Skill authored by Maya — "how I run my Saturday market booth" — is the platform's answer to *master-craftsperson knowledge* in a form that doesn't reduce it to advice content. It's executable, distributable, attributable, and revocable. Maya owns the Skill; subscribers see her name on it; she can update it as her practice evolves.

## Skill kinds

A single Skill primitive carries kinds distinguished by `source_kind`:

**Platform (T2)** — Skills authored and maintained by the platform team. Free, curated, vetted. The seed catalog (per "What ships at b2" below).

**Community (T3)** — Skills authored by named Communities (a guild, an association, a co-op). Surface the authoring Community on the Skill page. Free or paid at the Community's discretion (revenue does not flow through the platform; payment integration is the Community's responsibility).

**Peer (T3)** — Skills authored by individual Members and shared with one or more other Members. Maya writes a market-day-prep skill and shares it with her two friends; later she lists it publicly. Surface the authoring Member on the Skill page; same revenue posture as Community.

**Federation (T3)** — Skills published by federated platforms (per Loop 13). A CDFI publishes a loan-readiness skill that runs in the Member's agent context but resolves against the CDFI's own systems. Surface the federation peer on the Skill page.

The kind enum is extensible without schema migration.

## T1 — MVP Tier

The b1 commitment is **schema reserved, scope-declaration vocabulary published, no Skills ship.** No subscription surface, no execution surface, no catalog. The substrate exists.

- `skills` table exists with all fields below.
- `skill_subscriptions` table exists.
- The Skill manifest format is published as a documented JSON schema (versioned independently of the platform schema).
- The Delegation scope vocabulary (per `delegation.md`) is the same vocabulary Skills declare against — additive forever, stable from b1.
- A read-only `GET /api/skills` endpoint returns the (empty) catalog; same for `GET /api/me/skill-subscriptions`.

## T2 — Core Tier

The platform-curated skill catalog ships, the subscription flow ships, the assistant executes Skills.

- A small, curated seed catalog of platform Skills (~10-15 at launch), spanning the loops. Initial set targets the standing-presence cluster:

  - **Maker skills**: market-day prep, follower digest, pricing reconnaissance, inventory rollover, photo-listing assistant.
  - **Service-provider skills**: incoming-ask intake, license-renewal tracker, service-area performance summary, endorsement nudge.
  - **Gathering organizer skills**: RSVP digest, recurring-event reminder, weather check, new-attendee welcome.
  - **Steward skills (deferred to b2 late or b3)**: shared-resource maintenance schedule, rotation reminders.

- A skill catalog page at `/skills` browsable by all Members. Filterable by loop family, by source kind (T3), and by subscriber count.
- A skill detail page at `/skills/[slug]` showing: description, declared scopes (the exact Delegation scopes the skill will request), version, source, subscriber count, "what this Skill does for you" plain-language summary.
- Subscription flow:
  - Member taps Subscribe.
  - Member sees a single confirmation screen listing the Skill's declared scopes, plain-language ("this Skill will read your products and propose follower notes — it cannot publish without your tap").
  - Member confirms; a Delegation is issued (per `delegation.md`); the subscription row is created.
  - Skill is now active; the assistant loads its instructions and tooling on relevant tasks.
- Unsubscription: one-tap from `/you/skills`; revokes the Delegation atomically; subscription row is soft-deleted.
- Skill update flow: when an author publishes a new version, subscribers see a notification with a diff of changes (especially scope changes). The Member's pinned version stays active until they explicitly re-confirm to the new version. Scope additions in a new version *always* require re-confirm; scope removals do not.
- The assistant surfaces "powered by [Skill name]" annotations when a Skill contributed to a task, so the Member knows what they're getting and from whom.

## T3 — Polish Tier

Community-authored, peer-shared, federation-provided Skills; richer distribution and discovery.

- **Community-authored Skills.** A named Community can publish Skills under its name. Authoring requires a moderation step at the Community level (steward approval) and a one-time platform review for scope abuse.
- **Peer-shared Skills.** A Member can publish a Skill under their own name. Distribution can be private (shared with explicit Members), unlisted (link-only), or listed publicly in the catalog.
- **Federation-provided Skills.** A federated platform can publish Skills that run in the Member's agent context but resolve external tooling against the federation peer. Surfaced with federation branding.
- **Skill bundles** — a set of related Skills published together (a "bakery starter pack," a "first-year service provider pack"), subscribable as a unit.
- **Skill discovery via Operations** — the assistant can suggest Skills relevant to the Member's declared Operations and current activity ("you've declared a `volunteer_organizer` Operation for your repair café — want to try the RSVP-digest skill"). Suggestions, never auto-subscriptions. Surfaced only to Members with at least one active Operation; casual Members are not nudged toward Skills they don't need.
- **Skill-level Assistant Context scoping** (per `assistant-context.md`) — the Member sees and controls which Assistant Context sections each Skill can read.
- **Skill execution analytics for the Member** (not the platform) — "the bakery-inventory skill drafted 47 prep sheets this quarter, you used 41" — so the Member can prune Skills that aren't earning their place.

## Data model implications

**Required at MVP — retrofit is the failure mode.**

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
- `requested_scopes` (text[] — Delegation scope strings the Skill declares; presented to the Member at subscribe)
- `manifest_url` (text — pointer to the versioned manifest JSON)
- `loop_families` (text[] — `gathering`, `sharing`, `trade`, `pooling`, `federation`; for catalog filtering)
- `published_at` (timestamptz)
- `deprecated_at` (timestamptz nullable — Skill is still loadable but no new subscriptions allowed)
- `removed_at` (timestamptz nullable — Skill is unloadable; existing subscriptions are revoked atomically with notification)

**Skill versions** (`skill_versions`) — one row per published version, immutable:

- `id` (uuid)
- `skill_id` (FK)
- `version` (text — semver)
- `manifest_url` (text)
- `requested_scopes` (text[] — at this version)
- `changelog` (text — what changed from previous version)
- `published_at` (timestamptz)

**Subscriptions** (`skill_subscriptions`):

- `id` (uuid)
- `member_id` (FK to `members`)
- `skill_id` (FK to `skills`)
- `pinned_version` (text — the version the Member confirmed)
- `delegation_id` (FK to `delegations` — the issued Delegation backing this subscription)
- `subscribed_at` (timestamptz)
- `unsubscribed_at` (timestamptz nullable)
- `update_available_version` (text nullable — newer version the Member has not yet re-confirmed to)

**Event log entries (required at MVP):** `skill.published`, `skill.version_published`, `skill.deprecated`, `skill.removed`, `skill.subscribed`, `skill.unsubscribed`, `skill.version_updated`, `skill.executed` (records skill_id + version + Member, for the Member's own analytics; aggressive partition).

## Skill execution model

Skills run in the **Member's agent context**, not on the platform's servers. The platform hosts the manifest, mediates subscription, issues Delegations, and audits scope use — but the actual instructions and tooling execute wherever the Member's assistant runs (the in-app assistant at b2; an external MCP client at b3 federation).

This is a deliberate choice with consequences:

- The platform doesn't see what the Skill does with the Member's data once it has been read under a Delegation. That's the price of the privacy posture in `assistant-context.md` and the people-first commitment in general.
- The platform *does* see every scope use (`delegation.scope_used` event log entries) and can detect a Skill that requests scopes it never uses (suggesting over-broad asks) or that's flagged by Members as misbehaving.
- The platform reserves the right to deprecate or remove a Skill at any time for scope abuse, deceptive behavior, or violation of platform principles. The deprecation surfaces to subscribers; the removal revokes Delegations atomically.

## Revenue posture

Per [`policy.md`](../foundation/policy.md): default is the protective stance for both Member and Skill author; opt-in unlocks platform-mediated payment; the three filters apply.

**Defaults:**

- **Platform-curated Skills are free, always.** The platform never charges Members for capability published by the platform itself. This is structural: the platform does not sell discovery or capability to its Members. (This default is permanent, not opt-in.)
- **Community, peer, and federation Skills are off-platform-paid by default.** The Skill author handles payment outside the platform (Stripe, Square, invoice, free); the platform mediates only the manifest, subscription, and Delegation. The platform takes no cut.

**Available opt-in (Skill author opts in, T2 late or T3):**

- **Platform-mediated payment with a transparent cut.** A community, peer, or federation Skill author can opt in to letting the platform handle payment for their Skill in exchange for a published cut (target: 5–10%, capped publicly, governance commitment to never raise without 90-day notice and re-opt-in). The cut funds platform maintenance and Skill-catalog operations.
  - Three-filter analysis: *helpful* — yes, lowers payment friction for both author and Member, lets authors who don't want to run their own payment infrastructure participate, generates aligned platform revenue from value created on it; *harms others* — no, opt-in for the author, the Member sees the same price either way; *abusable* — platform raising the cut over time (mitigated by published cap + re-opt-in requirement on changes), platform favoring its own Skills in catalog (mitigated by separate "platform" badge and no algorithmic ranking — sort by subscriber count and recency only).
  - The opt-in is per Skill, revocable by the author (with subscriber notification and a clean transition to off-platform payment if continuing to charge).
  - Free Skills authored by community/peer/federation never trigger this option — there's nothing to take a cut from.

- A Skill's catalog page surfaces price (if any), payment handler (platform-mediated or off-platform), and the cut (if platform-mediated) clearly. The Member sees the full picture before subscribing.

This posture preserves the platform's revenue thesis ("Revenue flows from buyers, sponsors, and federation partners" per [`principles.md`](../foundation/principles.md)) while adding a Member-author-controlled, transparent, capped revenue stream from value created on the platform — which is structurally different from the "pay-for-visibility" model the foundation rejects.

## What Skills rule in and rule out

Rules in: a baker subscribes to a market-day-prep skill on Friday night, the assistant generates the Saturday prep sheet against her current product Items and the Saturday Gathering Item her booth attaches to, she reviews and adjusts in 90 seconds. Rules in: a plumber subscribes to a license-renewal skill that quietly tracks his California state board renewal and prompts him 60 days out. Rules in: the Sacramento Independent Bakers' Guild publishes a sourdough-pricing skill informed by their own data; fifty regional bakers subscribe; pricing across the region rises out of the race-to-the-bottom over six months without the platform doing anything.

Rules in (T2 late / T3): a community-authored Skill author opts in to platform-mediated payment with a published cut, lowering friction for Members and generating aligned platform revenue from value created on it. Rules in (T2): a Member subscribes to a recurring-payment Skill that auto-renews her CSA subscription monthly under a tightly-scoped `recurring_payment` Delegation she granted (per `delegation.md`).

Rules in (T2, per `agent-commerce-and-project-amendments.md` §8 + `delegation.md` + `payments.md`): a Skill can declare the `bounded_purchase` scope at install time and, with the Member's grant, find and complete one-time purchases on the Member's behalf within stated bounds. Canonical use: a "find local eggs and buy them" Skill that searches the locality-first index for `category:product:food` matches inside the Member's `recipient_scope` and `max_per_transaction_cents`, executes the purchase via the action layer, and writes the audit trail. The Skill never modifies the caps or scope; only the Member can, via re-grant. The reversibility window applies. Both buyer and seller are visible in the audit; the Skill itself is recorded as `via_delegation_id`, not as a party.

Rules out: Skills that auto-publish or move money without explicit Member confirmation per action where the scope demands it (publish-tier scopes require per-action confirmation regardless of grant; monetary-flow Delegations require per-Delegation grant with schema-enforced caps and scopes). Rules out: a platform that *requires* its cut on community-authored value — the platform-mediated payment opt-in is always opt-in, off-platform payment is always available. Rules out: Skills imposed on Members by the platform — every Skill is opt-in, even platform-authored ones. Rules out: pay-for-visibility — the cut funds maintenance, not catalog ranking. Rules out: Skills that route monetary actions to recipients outside the Member's stated `recipient_scope` — the action layer enforces this; a non-compliant Skill is auto-blocked at execution.

## Integration Points

- **Connects to:**
  - **Delegation** (every subscription issues a Delegation; per `delegation.md`)
  - **Assistant Context** (Skills declare and scope their Assistant Context reads at install; per `assistant-context.md`)
  - **Member** (subscriptions belong to Members; per `member.md`)
  - **Community** (T3 — Communities author Skills; per `community.md`)
  - **Item** (Skills read and draft Items via the action layer; per `item.md`)
  - **Federation** (T3 — federation peers publish Skills; per forthcoming `federation.md`)
- **Used by:**
  - The assistant (loads subscribed Skills' instructions + tooling on relevant tasks)
  - The `/you/skills` settings surface (subscription management)
  - The `/skills` catalog (browse + subscribe)
  - The action layer (every Skill-driven action carries the Skill's id + version in the event log via the Delegation)

## Open questions

- **Scope inflation policing.** Skills that request more scopes than they use are a concrete abuse pattern. Working answer: track scope-use vs. scope-declared per Skill, surface unused scopes to the Member as "this Skill asked for X but never used it," allow the Member to revoke unused scopes without unsubscribing. Confirm at b2.
- **Skill conflict.** Two subscribed Skills proposing conflicting actions (one says use this template, one says use that template). Working answer: the assistant surfaces the conflict to the Member and asks which to prefer; the answer becomes a Assistant Context entry. Revisit if conflict frequency warrants a structural rule.
- **Skill author accountability.** A peer-authored Skill that misbehaves — what's the recourse? Working answer: Member-level revoke is always available; platform reserves removal for abuse; the authoring Member's standing is unaffected by Skill behavior unless platform-level removal happens. Confirm with first peer-authored Skills at T3.
- **Cooperative Skill ownership.** A cooperative bakery (a Community of Members) wants to publish a Skill — who is the author of record? Working answer: the Community is the author; cooperative authorship is logged in the Skill manifest history; revenue (if any) flows to the Community's chosen recipient. Revisit when the first cooperative ships.
- **Skill discoverability vs. spam.** Once peer-shared Skills are possible, the catalog risks flooding. Working answer: subscriber count + recency surfaces quality without an algorithmic feed; reports for abuse; no paid promotion. Confirm at first sign of catalog noise.

## Decisions encoded here

This spec is the per-primitive home for the Skills portion of **ADR-6 (Agent assistance)**. The umbrella commitments — loop-shaped not role-shaped, standing-derived persistence, read-automatable/write-confirmed, Member-owned, federation-portable — live in [`../foundation/agent-assistance.md`](../foundation/agent-assistance.md). The cross-cutting pointer is in [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md).

| ADR | Status | What lives here |
|---|---|---|
| ADR-6 (Skills portion) | Accepted, refined by ADR-9 | Composable, versioned, distributable capability bundles. Sources: platform-curated (free, vetted), community-authored, peer-shared, federation-provided. Skills declare Delegation scopes at install; the Member confirms. Skills run in the Member's agent context, not on platform servers. |
| ADR-9 (Skills portion) | Accepted | Platform-curated Skills remain free permanently. Community/peer/federation Skills default to off-platform payment with no platform cut. Opt-in available T2-late / T3: platform-mediated payment with a published, capped cut (target 5–10%) for authors who choose it. The cut funds maintenance, not catalog ranking. No paid promotion ever. |

This spec also *encodes* ADR-7 (Skill subscribe/unsubscribe flow through action handlers).
