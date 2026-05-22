# System: Assistant Context

> **Naming.** User-facing label is **Assistant Context**. Schema name is `member_self_records` (durable; do not rename in code). This spec was previously titled "Member Assistant Context"; the rename happened 2026-05-11 as part of the platform-wide naming pass — see [`../../CLAUDE.md`](../../CLAUDE.md) § Naming conventions.

**Purpose:** Establish the Assistant Context as the Member-owned, Member-curated, agent-readable document that lets a Person's assistant carry their voice, tastes, refusals, and current focus across sessions and across loops. The Assistant Context is what makes the assistant feel like *the Member's* assistant rather than a generic tool — without making the platform a surveillance layer or the assistant a profile-builder. It is the structural answer to *"how does the agent know me without the platform watching me."*

**Bundles:** b1 (T1 — schema reserved + export/purge actions), b2 (T2 — assistant surfaces, three update pathways, standing-vs-scratch tiers), b3 (T3 — federation portability)

**North stars served:** All five, indirectly — the Assistant Context is what lets the assistant accelerate every loop a Member is in without reducing them to a category. It serves people-first directly: the Member owns their own context.

## What the Assistant Context Is and Why It Matters

The Assistant Context is a small, structured document the Member curates (with assistant assistance) that captures the things they want their assistant to remember about them. Voice. Tone. Tastes. Refusals. Pinned facts. Current focus. It is *not* a profile in the social-media sense — it is never visible to other Members, never visible to other Members' assistants, never input to the discovery feed, never used as training data by the platform.

The argument for the Assistant Context as a first-class system (rather than an LLM "context window dump" or a JSON blob on the Member row) is that it carries weight the platform must respect structurally:

- It is **the Member's instrument**, not the platform's. Treating it as a regular column on `members` invites it to be queried, joined against, surfaced in dashboards, and eventually monetized. A separate primitive with its own access controls keeps the line clean.
- It must be **portable** under Loop 13 federation. When a Member's identity moves to a federated platform, the Assistant Context goes with them — same way passport data goes with the holder, not the country.
- It must be **append-only versioned**. Members should be able to see how their Assistant Context has evolved, undo bad updates, and audit what the assistant has proposed over time. A scalar text column can't do this.
- It must be **distinct from the event log**. The event log records what the Member *did*; the Assistant Context records what they *said about themselves and their preferences*. Conflating them either contaminates objective behavior with subjective claims or buries Member-authored context inside a stream optimized for analytics.

## The three layers, kept structurally apart

The Assistant Context is one of three persistence substrates the assistant reads from. They share no tables and no permissions:

**Event log** (per `item.md`, etc.) — Objective behavior, platform-authored, the substrate of stake accumulation.

**Assistant Context** (this system) — Subjective context, Member-authored with assistant assistance, the substrate of personalization.

**Per-loop scratchpad** (ephemeral, not persisted) — The current session's working memo. Dies with the session unless the Member promotes a fact into the Assistant Context.

The non-negotiable across all three: nothing the Member did not author or confirm can land in the Assistant Context. Inferred patterns from the event log can be *proposed* to the Member as Assistant Context updates, but only the Member's confirmation makes them durable.

## Persistence is standing-gated

Per ADR-6, the Assistant Context's persistence tier is gated on `member_has_standing_presence` (per [`groups.md`](groups.md) — ≥1 active membership in a kind='business' Group OR steward-role membership in any non-business Group). This supersedes the earlier draft's "standing_signal derived view" mechanism — that approach inherited the gameability and opacity problems of the original ADR-3's `maker_signal` and was retired in favor of explicit, Member-declared Group membership per ADR-13. Per ADR-12 **SUPERSEDED 2026-05-12** (`agent-commerce-and-project-amendments.md` §6), the "Maker mode" framing and `members.maker_mode_enabled` column are retired. The "Sell" CTA walks the Member through creating a kind='business' Group; standing-tier is the kind='business' Group membership itself. Ending the owner-role membership starts a 90-day dormancy window per `groups.md`; Assistant Context persistence follows the same Group-lifecycle gate (no separate toggle to pause).

**Scratch tier (default).** A new Member, or a Member doing only ephemeral loops (Wonder posting, Loop 3 newcomer browsing) without standing presence, has an Assistant Context that defaults to a small, transient context — name, preferred locality, optional pronouns. Updates persist across sessions but are intentionally minimal. The assistant is helpful but not deeply personalized.

**Standing tier (Operation-gated).** A Member with at least one active Member Operation — `sole_personal`, `side_personal`, `partner`, `cooperative_member`, `staff`, or `volunteer_organizer` — has access to the full Assistant Context surface: voice samples, tone refusals, taste notes, pinned facts about the Member's work, current-season focus. The Assistant Context affordance prominence and the assistant's update aggressiveness scale with the existence of an Operation, not with inferred behavioral signals.

The gate is `member_has_standing_presence` (per [`groups.md`](groups.md) — ≥1 active membership in a kind='business' Group OR steward-role membership in any non-business Group). Declared, dated, ungameable. A Member promoted to standing tier got there by saying "yes, I'm operating commercially here" or "yes, I'm a steward of this Group," not by having a derivation cross a threshold.

Per ADR-12 **SUPERSEDED 2026-05-12** (`agent-commerce-and-project-amendments.md` §6), the standing-tier path is now the explicit "Sell" CTA, which creates a kind='business' Group with the Member as sole owner-role membership. The original ADR-3's "no separate Maker onboarding" framing remains rejected. Standing-tier is reached when the Member has ≥1 active kind='business' Group membership OR steward-role membership in any non-business Group — no toggle, no profile flag, no `maker_mode_enabled`.

## T1 — MVP Tier

The b1 commitment is **schema reserved, export and purge live, no UI ships.** The substrate exists; nothing reads or writes it yet.

- `member_self_records` table exists with all fields below (one row per Member, created lazily on first write).
- `member_self_record_entries` append-only log table exists.
- Two action-layer handlers ship and are exposed in `/you` settings:
  - `member_self_record.export()` — returns the Member's full Assistant Context + entry history as JSON. Accessible at `/you/data` (the same surface that handles the Member's data export per the platform's privacy commitment).
  - `member_self_record.purge()` — deletes the Assistant Context and all entries atomically. Same surface.
- The platform's default policy posture for the Assistant Context is the protective one (see "Policy posture" below): no aggregate analysis, no cross-Member visibility, no feed input — *unless the Member has explicitly opted in.* This is surfaced on the privacy page and at `/you/data` in plain language.

## T2 — Core Tier

The assistant surfaces ship; Members can author and curate the Assistant Context through the assistant or directly.

- A Assistant Context editor in `/you` exposing each section as a small free-text field with version history. Members can edit directly without the assistant.
- The three update pathways (per ADR-6) are wired:
  - **Explicit teach** — the Member tells the assistant something to remember; the assistant writes it verbatim with `source = explicit`.
  - **Confirmation-derived** — the assistant proposes ("Want me to remember you prefer plainspoken descriptions?"); on accept, written with `source = confirmation_derived`.
  - **Inferred** — the assistant notices a behavioral pattern and surfaces a *suggestion* with the underlying evidence link; on accept, written with `source = inferred`. Rejected suggestions are logged but not retried for 90 days.
- **No silent writes, ever.** Every entry has a `confirmed_at` timestamp; entries without one are proposals, not record. The schema enforces this.
- Standing-vs-scratch persistence tiers surface visibly: a small badge on the Assistant Context page showing the current tier and the standing signals that promote it.
- A "blind this session" toggle in the assistant: the Member can ask the assistant to answer without using the Assistant Context for the current session, without deleting anything. Useful for buying gifts, planning surprises, getting a fresh look.
- Section-level revoke: the Member can delete a single section (voice, tastes, refusals, etc.) without purging the whole Assistant Context.

## T3 — Polish Tier

Federation portability and identity-grade controls.

- **Federation export.** When a Member moves their identity to a federated platform (per Loop 13), the Assistant Context is portable through the federation handoff protocol. Format is a documented JSON schema versioned independently of the platform's internal storage.
- **Per-Skill scoping.** A Member can scope which sections of the Assistant Context a specific Skill is allowed to read (e.g., the bakery-inventory skill reads pinned-facts and current-focus but not voice or tastes). Defaults are sensible; overrides are visible.
- **Diff view.** A timeline showing how each section has evolved, with the assistant's proposed changes annotated.
- **Bulk re-confirm.** A periodic prompt (default annual, configurable) asking the Member to re-confirm the Assistant Context is still accurate. Decay is real; consent should be refreshed.
- **Assistant Context-aware Skills** — Skills that declare which sections they read at install time, surfaced to the Member at subscribe time so the Member knows what the Skill will know.

## Data model implications

**Required at MVP — retrofit is the failure mode.**

**The spine — `member_self_records`** (one row per Member, created lazily):

- `id` (uuid)
- `member_id` (FK to `members`, unique)
- `voice` (text nullable — "writing voice" notes: tone, register, words to use, words to refuse)
- `tastes` (text nullable — categories of Items they're drawn to, scales of gathering they enjoy, kinds of Locations they trust)
- `refusals` (text nullable — explicit don'ts: "never use 'artisan'," "don't suggest events past 9 pm," "no gift-giving prompts in November")
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

The current Assistant Context values in the spine table are a denormalization of the latest `confirmed_at` entry per section, maintained by a trigger. This lets fast reads stay simple while preserving full history.

**Standing-tier gate — `member_has_standing_presence` view.**

A read-only view (per [`groups.md`](groups.md)) returning Members with `member_has_standing_presence = true` (≥1 active kind='business' Group membership OR steward-role membership in any non-business Group). Replaces the earlier `member_standing_signal` derivation (retired alongside ADR-3's `maker_signal` per ADR-8 + ADR-12 + ADR-13). Outputs a single boolean per Member: standing tier (Group declared) or scratch tier (no qualifying Group). The simplicity is deliberate — every previous draft of a behavioral signal drifted, was gameable, or required policing. Declared Groups are clean. **No `maker_mode_enabled` column exists** (dropped per ADR-12 SUPERSEDED 2026-05-12) — the Group membership itself is the signal; ending an owner-role membership starts the 90-day dormancy window per `groups.md`, which is what retracts standing.

**Event log entries (required at MVP):** `self_record.entry_proposed`, `self_record.entry_confirmed`, `self_record.entry_rejected`, `self_record.section_purged`, `self_record.fully_purged`, `self_record.exported`, `self_record.blinded_session` (T2), `self_record.federated_out` (T3).

## Policy posture

Per [`policy.md`](../foundation/policy.md): default is the protective stance; opt-in unlocks richer behavior; every opt-in passes the three filters (helpful? harmless? abuse-resistant?).

**Defaults (no opt-ins active):**

- **Member-owned.** The Assistant Context is conceptually and legally the Member's; the platform is custodian, not owner.
- **Fully exportable.** Single action returns the entire record + entry history as JSON, anytime.
- **Fully deletable.** Single action purges atomically, anytime; deletion cascades to entries; the deletion itself is logged but the content is gone.
- **Not trained on by default.** Assistant Context content is not used as training data for any platform-built model and is not shared with third-party model providers as training data. (Inference-time access by the Member's chosen LLM provider is governed by the Member's own provider relationship, surfaced clearly.)
- **Not feed-fuel by default.** The Assistant Context is not an input to the locality index, the discovery surface, the Trending feed, the recommendation engine, or any surface that decides what other Members see.
- **Not visible to other Members by default.** Not directly, not by inference, not in aggregate. Other Members' assistants cannot read a Member's Assistant Context.

**Available opt-ins (T2 unless noted):**

- **Anonymized aggregate analysis.** A Member can opt in to having their Assistant Context contribute to anonymized aggregate analyses of regional patterns ("plain-language descriptions are common in West Sacramento"). Three-filter analysis: *helpful* — yes, surfaces regional context to Members and federation partners; *harms others* — no, with k-anonymity floor (minimum N≥10 Members per bucket, no quasi-identifier reconstruction); *abusable* — re-identification risk addressed by structural k-anonymity, periodic adversarial review, and the always-available opt-out. Per-section granularity (Member can opt in `tastes` only, not `voice` or `pinned_facts`).
- **Cross-Member sharing of selected sections.** A Member can explicitly share named sections of their Assistant Context with another named Member or a Member's assistant, time-bounded by default. Useful for handing operating notes to a new staff Member, sharing taste profiles for collaboration, onboarding a partner. Three-filter: *helpful* — yes, real workflow value; *harms others* — only the sharing Member's own data is at risk; recipient is named and identifiable; *abusable* — coercion risk mitigated by always-available revoke, time bound, share-history audit; over-broad share mitigated by per-section grain. Default share duration: 90 days, extendable.
- **Opt-in feed input (T3, deferred).** A Member can opt in to having their Assistant Context influence what *they themselves* see (never what other Members see). Three-filter analysis to be completed when the surface is designed; defer to b3 design pass. The categorical refusal of feed input *for other Members* remains permanent.

**Per-Skill scoping (T3):** Members can shrink which sections each subscribed Skill sees, regardless of opt-in posture.

The policy posture is surfaced at `/you/data` and on the privacy page in plain language, not buried in terms of service. Opt-in toggles live alongside their explanations; the three-filter analysis for each opt-in is linked from the toggle so the Member can see the reasoning before consenting.

## What the Assistant Context rules in and rules out

Rules in: an assistant that, after a year of standing presence, knows Maya prefers "naturally leavened" over "artisan," that her market days are Thursday and Saturday, that she doesn't take orders during fire season, and that she's currently piloting a focaccia line she wants to keep quiet about for two more weeks. The same assistant works equally well for her one-off Wonder about a Sunday coffee walk because the Assistant Context applies across loops.

Rules in (T2): Maya opts in to anonymized regional aggregation; the platform can surface "plainspoken descriptions are common among West Sacramento bakers" without exposing her name. Rules in (T2): Maya hands her Saturday-booth operating notes to Sarah for 60 days when Sarah joins as `staff`; Sarah's assistant can read those sections during the share window.

Rules out (defaults, never opt-in): a profile of Maya the platform sells, surfaces to other Members without her opt-in, or feeds into other Members' recommendations. Rules out: silent personalization where the assistant inferred something the Member never confirmed and acted on it for months. Rules out: a Assistant Context that survives the Member — when a Member account is deleted, the Assistant Context is purged in the same transaction. Rules out (permanent, not opt-in): the Assistant Context influencing what other Members see, ever.

## Integration Points

- **Connects to:**
  - **Member** (one-to-one with `members`; per `member.md`)
  - **Delegation** (the `read_self_record`, `propose_self_record_update`, `confirm_self_record_update` scopes are issued via Delegation; per `delegation.md`)
  - **Skills** (Skills declare and scope their Assistant Context reads at install; per `skills.md`)
  - **Federation** (T3 — Assistant Context is portable across federation handoff; per forthcoming `federation.md`)
- **Used by:**
  - The Member's assistant (read on every session bootstrap; subject to "blind this session" toggle)
  - Subscribed Skills (read scoped to declared sections only)
  - The `/you` settings surface (editor + version history + privacy controls)

## Open questions

- **Inference cadence and rate limit.** How often should the assistant be allowed to propose inferred updates? Daily is too noisy; quarterly is too rare. Working answer: surface at most one proposal per session, dismissable, with rejected proposals cooling off 90 days. Confirm at b2 launch.
- **Voice samples vs. voice notes.** Should the `voice` field hold actual writing samples (paragraphs the Member has approved) or just notes describing the voice ("plainspoken, no marketing language")? Working answer: notes only at b2; samples possible at b3 if the assistant integration warrants.
- **Cross-platform Assistant Context.** If a Member uses the same assistant on this platform and on a federated platform, do they share one Assistant Context or two? Working answer: two, with explicit user-controlled sync at T3, never automatic.
- **Assistant Context under Community membership.** Does a Member's Community memberships influence the assistant's defaults? Working answer: no — Community context is read at task time, not baked into the Assistant Context. Communities are joined and left; the Assistant Context is more durable than that.
- **Bulk re-confirm UX.** The annual "is this still accurate" prompt — what triggers it, where does it appear, how does the Member dismiss without confirming? Defer to b3 design.

## Decisions encoded here

This spec is the per-primitive home for the Assistant Context portion of **ADR-6 (Agent assistance)**. The umbrella commitments — loop-shaped not role-shaped, standing-derived persistence, read-automatable/write-confirmed, Member-owned, federation-portable — live in [`../foundation/agent-assistance.md`](../foundation/agent-assistance.md). The cross-cutting pointer is in [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md).

| ADR | Status | What lives here |
|---|---|---|
| ADR-6 (Assistant Context portion) | Accepted, refined by ADR-9 | Member-owned, Member-curated document — voice, tone, tastes, refusals, pinned facts, current focus. Three update pathways (explicit teach, confirmation-derived, inferred-and-proposed). Persistence is standing-derived (gated on `member_has_standing_presence` per [`groups.md`](groups.md)). Fully exportable, fully deletable, never trained on, never input to recommendation surfaces, never visible to other Members or their assistants. Federation-portable at T3. |
| ADR-9 (Assistant Context portion) | Accepted | Opt-in anonymized aggregate analysis (k-anonymity floor N≥10). Opt-in cross-Member sharing (granular, time-bounded). Categorical refusal of feed input *for other Members* is permanent. |

This spec also *encodes* ADR-7 (`self_record.update_propose`, `self_record.update_confirm`, `self_record.export`, `self_record.purge` action handlers).
