---
id: what-business-jurisdiction
purpose: Three-tier locally-owned verification without exposing addresses.
layer: what
status: active
---

# System: Business Jurisdiction (locality verification ladder)

**Purpose:** Give kind='business' Groups a way to anchor their "locally owned and operated" claim to a government-verifiable signal — without forcing the owner to expose a home address. The system models a **verification ladder** (self-attested → state-verified → document-verified) whose tier is itself a public signal. The platform's locality-derivation surface (per `groups.md`) reads this signal; without a jurisdiction record on at least one owner Member, a Group cannot claim "local" status.

**Bundles:** b1 (T1) · b2 (T2) · b3 (T3 optional)

**North stars served:** Buy Close (Loop 9, Trade family) — the platform's most consequential discovery affordance is the locally-owned-and-operated index. The verification ladder is what keeps that index *honest* without forcing every business owner to publish their home address.

**Decisions encoded:** This spec is the home of the verification-ladder decision ratified 2026-05-11 (formerly captured in `_attic/2026-05-19/product-exploration/locally-owned-verification.md`). Cross-cutting: the opt-out default and three-filter test · the Member↔Geography substrate split (the locally-owned derivation now reads this spec's substrate as the first signal, with community-attestation as the second signal at b2+) · the people-first refusal of address-as-locality.

**Companion specs:** [`groups.md`](groups.md) (the locality-derivation surface that consumes this signal) · [`member.md`](member.md) (the owner Member who holds the jurisdiction record) · [`location.md`](location.md) (the anchor Location whose proximity is tested) · [`policy.md`](../foundation/policy.md) (doxxing-prevention posture).

**Canonical examples this spec serves:** Maya at Oak Park Sourdough (home-based; LLC registered to a commercial agent; wants the "locally owned" badge without publishing the kitchen address) · Bob's two McDonald's franchises (separate jurisdictions, separate locality tests per franchise) · Ferrari Fisheries (sole prop fishing operation; no LLC; uses Tier 0 self-attested ZIP at b1, climbs to Tier 2 document-verified when the platform's doc pipeline lands).

---

## What this system is

A `kind='business'` Group's "locally owned and operated" claim is derived from one or more signals about whether at least one owner Member is local to the Group's `anchor_location_id`. The **first signal** at b1 is this spec's substrate — `member_business_jurisdictions`, tested against the anchor Location via `public.zip_is_proximal_to_location()`. The prior affinity-based path retires with the six-kind `member_location_affinities` table.

The Business Jurisdiction substrate is the **first signal** for the locally-owned claim — the public, evidence-tiered floor a seller declares about their own business. The platform stores a ZIP (or ZIP-equivalent locality token) plus the **source** of the ZIP. The source becomes the public signal: a Group can be a "Claimed local owner" (Tier 0, self-attested), a "Community-confirmed local owner" (Tier 1, community-attested), or a "Documented local owner" (Tier 2, document-supported). Members aren't punished for being at Tier 0; the platform is transparent about the evidence level.

A **second signal** — *community-member corroboration* — comes online as the platform's interaction graph matures (b2+). Neighbors who interact with a Group / Member provide implicit signals — proximity-based interaction patterns, vouching, dispute flags — that can corroborate or challenge a declared claim. This is **peer pressure for the greater good**: a seller whose declared locality is corroborated by community interaction carries stronger signal than one whose declaration sits unchallenged or is contradicted by neighbors' behavior. The platform surfaces *both* signals when both are present; the badge tier reflects what the evidence shows. The mechanism design depends on having enough Member-Location interaction data to be meaningful, which is a post-critical-mass milestone; until then, jurisdiction is the floor and the badge speaks honestly about that.

A kind='business' Group without a jurisdiction record from any owner simply doesn't surface the locally-owned badge — the derivation skips it. The Group still appears in awareness feeds, search, and every other locality surface; only the affirmative *badge* is gated on a declaration. The platform doesn't punish absence; it just doesn't claim what hasn't been claimed.

> **Intent (Ratified 2026-05-23 — soft commitment with two-signal extension):** The locally-owned claim is grounded in two signals, designed to reinforce rather than compete: (1) **the seller's first-person declaration** with an evidence ladder (Tier 0 self-attested → Tier 1 community-attested → Tier 2 document-supported; opt-in; b1 ships Tier 0; Tier 1 lands at b2+ when the interaction graph reaches density); (2) **community-member corroboration** is *embedded inside the ladder itself* — Tier 1 *is* the community-attestation tier (per the T2 section below). The first signal lets the platform ship the badge at b1 without external integrations; the climb to Tier 1 *is* the community confirming or challenging the declaration. The two-signal shape is open to extension — alternate evidence forms (a third signal, a different evidence ladder) land when defined benefit emerges. **Test for future proposals:** does the proposal want to add a parallel locality-derivation that bypasses both signals (a side channel that escapes the public evidence tier)? If yes, refuse — extend the signal set or extend an existing signal's evidence ladder. Does it want to add a third signal with its own evidence story (e.g., a federation peer's verification record)? Welcome.

A Group with no jurisdiction record at all cannot make a "local" claim — the locality-derivation surface skips it. This is the **lever**: locality-based discovery is a real benefit, so business owners have an incentive to provide at least Tier 0. Safety-conscious owners can provide a ZIP that isn't their home (their accountant's, a PO Box, a registered agent's ZIP) without uploading documents. **Locality (ZIP, state) is separated from address (street, building) by design.** The platform never asks for, stores, or surfaces a street address as locality evidence.

---

## T1 — MVP Tier (b1): Self-attested ZIP

The b1 surface is the smallest version that lets a kind='business' Group make a locally-owned claim with a public floor of evidence. At b1, the floor is opt-in self-attestation.

> **Intent (Ratified 2026-05-23):** Tier 0 (self-attested) is the b1 floor because (a) the public evidence-tier itself is the platform's transparency answer — "Claimed local owner" is materially weaker than "Community-confirmed" or "Documented," and the badge speaks honestly about that; (b) the b2+ Tier 1 path (community-attestation, per the T2 section below) depends on a critical-mass interaction graph that doesn't exist at b1, so shipping it earlier would either trip on sparse-data thresholds or invite gaming. Tier 0 is the *honest* answer for b1 — declarations exist, they're labeled "Claimed," and the community climbs them up the ladder as the platform earns the interaction graph. **Test for future proposals:** does the proposal want to ship Tier 1 community-attestation earlier (at b1)? Walk through the interaction-graph-density question first — if the proposal carries a story for how thresholds avoid sparse-data gaming and how attestor eligibility doesn't degenerate to "first 5 friends to attest," welcome.

**Behavior.** Any owner-role Member of a kind='business' Group can set a self-attested ZIP for that Group. The ZIP is stored on a new `member_business_jurisdictions` row scoped to (`member_id`, `group_id`). The `verification_source` is `'self_attested'`. The Group's public surface displays "Claimed local owner" alongside the locally-owned badge when the ZIP passes the proximity test against the anchor Location.

**Multiple owner-role Members — OR aggregation across all active owners.** Each owner can have their own jurisdiction record. The Group qualifies as locally owned if **any** active `role='owner'` Member's jurisdiction ZIP passes the proximity test against the Group's anchor Location. There is no founder-privileged source, no per-Group designated owner-of-record for locality, no requirement that every owner be local — the badge sources from the union across all current owners. Multi-owner is additive, not constraining — Maya bakes and her partner works the booth; either's jurisdiction qualifies the Group. The rule survives owner additions, removals, and transitions: as long as at least one active owner's jurisdiction proximizes, the badge applies; the day no remaining active owner's jurisdiction proximizes, it drops.

> **Intent (Ratified 2026-05-31):** The Locally-Owned promise answers a single Member question — *does this entity have local-community ownership stake*. One local owner is sufficient evidence: a partnership with one local + two non-local owners is still locally-owned in the way that matters for community-support decisions. Requiring unanimity loses the partnership case; privileging the founder loses the post-founder-transition case (and conflicts with the platform's commitment that membership is the only access-granting verb for kind='business' Groups — see [`playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) § "Membership is the only access-granting verb for kind='business' Groups"). The OR-across-owners rule is the simplest honest answer.

**Surfaces.**
- **Composer.** The kind='business' Group walkthrough (per `groups.md`) adds an optional "where is this business based?" step. Self-attested ZIP only; no document upload at b1.
- **Group settings.** Owners can edit/add/remove their jurisdiction record from the kind='business' Group's settings surface.
- **Group public surface.** The badge "Claimed local owner" surfaces alongside the locally-owned indicator. No street address is ever shown.

**Locality derivation (the upgrade to `groups.md`).** The rule in `groups.md` (Locality and promotion) reads:

```sql
-- A kind='business' Group is locally owned when ANY active owner Member
-- holds a jurisdiction record whose ZIP proximizes the Group's anchor
-- Location. OR aggregation across all role='owner' memberships — no
-- founder-privileged source, no per-Group designated owner-of-record.
select exists (
  select 1
  from group_memberships gm
  join member_business_jurisdictions mbj
    on mbj.member_id = gm.member_id
    and mbj.group_id = gm.group_id
  where gm.group_id = $group_id
    and gm.role = 'owner'
    and gm.ended_at is null
    and mbj.removed_at is null
    and public.zip_is_proximal_to_location(mbj.zip, $anchor_location_id)
);
```

The query reads every active owner's jurisdiction row in parallel; `exists` short-circuits on the first proximal owner. There is no ordering, no priority, no "primary" jurisdiction — the badge surfaces when any active owner satisfies the predicate.

The `public.zip_is_proximal_to_location(zip text, location_id uuid) returns boolean` function is a public-callable SECURITY DEFINER that compares the ZIP's metro/MSA against the anchor Location's metro/MSA, returning true within the proximity threshold (same threshold spec'd in `groups.md`).

**Note on the retired `member_location_affinities` substrate.** The six-kind `member_location_affinities` table is retired entirely. The locally-owned derivation now reads `member_business_jurisdictions` (this spec) as the first signal, and community-attestation rows (a sibling table at b2+) as the second signal. Seller locality has one structured ladder; this is it.

**Companion claim — "Locally Made."** Owner residence (this spec) is one of two sibling badges. The other is product-provenance — "Locally Made" — which lives on `items.made_at_place_id` (per [`item.md`](item.md), kind='product' only). Same evidence-ladder shape, different signal: jurisdiction answers "does the money go to a local owner?"; provenance answers "is the product made here?" Designed together so the platform never has to retrofit one against the other.

---

## T2 — Core Tier (b2+): Community-attested

**Ladder shape revised 2026-05-23 (per PM ratification).** Tier 1 was originally framed as SOS API lookup — external government-record verification. That framing is retired. The new Tier 1 is **community-attestation**: peer pressure for the greater good, anchored in the platform's own interaction graph.

When the platform's interaction graph reaches enough density to be meaningful (b2+), Tier 1 lands. A seller's locality claim is corroborated — or contradicted — by buyers and other community Members who have actually transacted or interacted with the kind='business' Group.

**Behavior.** After a Member interacts with a kind='business' Group's owner Member (a purchase, a visit at a recurring-temporary Location, a sustained presence in the Group's stream), the platform surfaces an optional, friction-light attestation prompt: *"Does {Seller Group} operate locally?"* The buyer's response is recorded as a per-attestation row that joins to the seller's `member_business_jurisdictions` row. A jurisdiction with sufficient confirming attestations (threshold TBD; design at b2 entry) climbs from "Claimed" to "Community-confirmed" tier.

**Dissent matters.** Buyers can also attest that a claim is *not* corroborated — they bought from "Maya's Sourdough" and the product shipped from out-of-state, or the operating Member is clearly not local. Sufficient dissent (threshold TBD) flags the jurisdiction for review and demotes the badge; the seller can request reconsideration.

**Why community-attestation, not SOS lookup.** SOS-of-convenience (Delaware, Nevada LLCs operating elsewhere) is a known evasion path for SOS-based verification; community Members who actually transact with a seller have ground-truth that SOS records don't carry. The platform also avoids the integration cost + per-lookup fee of state SOS APIs and the brittleness of name-matching against public records that change. The trade-off: community attestation depends on a critical-mass interaction graph that doesn't exist at b1 — which is fine, because Tier 0 (self-attested) is the b1 floor and Tier 1 lands when the graph is there.

**Surfaces.**
- **Buyer-side prompt.** After a qualifying interaction, the buyer sees a friction-light attestation card in their feed / receipt. One tap to confirm; one tap to dissent (with optional note).
- **Group public surface.** "Community-confirmed local owner" badge replaces "Claimed local owner" when attestation thresholds are met. The badge tier reflects what the community has shown.
- **Group settings.** Sellers see attestation counts (anonymized aggregate, never individual attestor identity) and can request reconsideration when a dissent threshold flags their badge.

**Scope.** Covers every kind='business' Group with active commerce on the platform. The widest Tier 1 path on the new ladder — every seller with buyers has a path here. Replaces the prior SOS-restricted Tier 1, which was only available to LLC/corp filers.

**Maintenance.** Attestation rows have a freshness window (working answer: 12 months). A seller's badge reflects current attestations; old confirmations from buyers who no longer interact roll off. Dissent flags trigger reconsideration, not automatic demotion — the platform doesn't let a single dissent torpedo a claim, and surfaces the threshold honestly.

> **Intent (Ratified 2026-05-23):** Tier 1 is community-attestation — *peer pressure for the greater good* — not an external government lookup. Buyers who actually transact with a seller carry the ground-truth a public records database can't, and the substrate is the platform's own to build. The b2+ deferral is because the interaction graph needs density to be meaningful, not because of integration cost; if the graph matures faster than expected, the surface can land earlier. **Test for future proposals:** does the proposal want to add a parallel external-verification Tier (SOS API, third-party data broker)? Treat it as a *third signal* with its own evidence story (per the two-signal commitment in *What this system is*), not as a replacement for community-attestation. The community-attestation surface is the load-bearing T1 by design.

---

## T3 — Polish Tier (b2+ or b3): Document upload

When the platform has manual-review capacity (or an OCR pipeline) and a more rigorous evidence requirement justifies the cost.

**Behavior.** Member uploads an EIN letter, sales tax permit, business license, DBA filing, or equivalent government-issued business document. Platform extracts the ZIP via OCR (or queues for human review at very low volume); the `verification_source` becomes `'document_upload'`. The document itself is stored in a private blob store keyed by `source_document_id`; only the platform and the Member can access the document.

**Surfaces.**
- **Settings.** A "Upload business document" CTA opens a flow: pick document type → upload (image/PDF) → wait for OCR/review → confirm extracted ZIP.
- **Group public surface.** "Documented local owner" badge replaces lower tiers. The verification source is shown; the document itself is **never** shown publicly.

**Scope.** Covers sole props, DBAs, and any government-issued business doc that carries a ZIP. The widest tier.

**Failure modes.** OCR low-confidence or human-review rejection: the upload is rejected and the Member is notified with a reason. The previous tier (Tier 0 or Tier 1) remains intact; only the climb to Tier 2 fails.

---

## Data model implications (build with this in mind from day one)

`member_business_jurisdictions` table — keyed by (`member_id`, `group_id`). One row per (owner Member, business Group) pair. The ZIP is the locality token; the source is the verification tier.

```sql
create table member_business_jurisdictions (
  id                   uuid primary key default gen_random_uuid(),
  member_id            uuid not null references members(id) on delete cascade,
  group_id             uuid not null references groups(id) on delete cascade,
  zip                  text not null check (zip ~ '^[0-9]{5}$'),
  state                text check (state ~ '^[A-Z]{2}$'),  -- 2-letter; populated at document_upload (T3)
  legal_entity_name    text,  -- populated at document_upload (T3)
  verification_source  text not null
    check (verification_source in ('self_attested','community_attested','document_upload')),
  verified_at          timestamptz,
  source_document_id   uuid,  -- FK to a future docs table; nullable
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  removed_at           timestamptz,
  primary key_constraint_note text generated always as (
    'one active row per (member_id, group_id); historical rows soft-deleted via removed_at'
  ) stored
);

create unique index ux_jurisdiction_member_group_active
  on member_business_jurisdictions (member_id, group_id)
  where removed_at is null;

create index idx_jurisdiction_zip_active
  on member_business_jurisdictions (zip)
  where removed_at is null;
```

**Event log.** Every write fires a `member.business_jurisdiction.*` event (same-transaction row+event invariant). Events: `member.business_jurisdiction_set` (Tier 0), `member.business_jurisdiction_community_attested` (Tier 1, b2+), `member.business_jurisdiction_documented` (Tier 2, b2+/b3), `member.business_jurisdiction_removed`. Tier-1 community-attestation also fires per-attestor events on a sibling substrate when the b2 attestation table lands; the jurisdiction row's `verification_source` flips to `community_attested` when thresholds are met. Each event carries the diff (old → new ZIP, old → new source). The event log is the audit trail for any later challenge.

**Soft delete.** `removed_at` is the standard pattern. Historical rows preserve the audit chain even after a Member changes their declared jurisdiction.

**Proximity computation.** The `public.zip_is_proximal_to_location()` function reads a `zip_metro_crosswalk` table (USPS / HUD ZIP-to-MSA mapping, refreshed quarterly). The function returns true when the input ZIP's MSA matches the anchor Location's MSA (or matches within a configurable proximity radius for rural cases).

**RLS.** `member_business_jurisdictions` SELECT is public for `removed_at IS NULL` rows — the jurisdiction record is meant to be a *public* claim on the Group's surface, by deliberate contrast with the private Member-geography substrates (`member_place_interests`, `member_saved_searches`) which are owner-only. The ZIP and source columns are intentionally readable; the document blob (T3) is private. INSERT/UPDATE/DELETE goes through action handlers only.

---

## Action handlers

- `member.business_jurisdiction.set(group_id, zip, [state], [legal_entity_name])` — Tier 0 write. Inserts or soft-replaces the active row for (`member_id`, `group_id`). `verification_source = 'self_attested'`, `verified_at = null`. Validates the Member is an active owner-role membership in the Group; rejects otherwise.
- `member.business_jurisdiction.attest_community(group_id)` (b2+) — Tier 1 write triggered by the attestation-threshold worker, not directly by a Member. When confirming attestations on a jurisdiction cross the threshold, the platform sets `verification_source = 'community_attested'`, `verified_at = now()`. Demotion path also lives here when dissent thresholds flag a claim. The buyer-side attestation surface (the friction-light "Does this Group operate locally?" prompt) writes to a separate `member_business_jurisdiction_attestations` table — substrate lands at b2 alongside the surface.
- `member.business_jurisdiction.upload_document(group_id, document_blob_id, document_type)` — Tier 2 write. Records the document reference, queues OCR/human review. On confirmation, updates row to `verification_source = 'document_upload'`, `verified_at = now()`, `source_document_id = ...`.
- `member.business_jurisdiction.remove(group_id)` — soft-deletes the active row. Fires `member.business_jurisdiction_removed`. The Group's "local" claim drops if this was the only qualifying jurisdiction across its owners.

All four handlers are scoped capabilities (per `action-layer.md`): Member-on-self only; never delegable to a third party (categorical refusal of delegating identity claims).

---

## Policy posture

This system touches public visibility and the locally-owned claim. Three-filter analysis:

**Default state.** No jurisdiction record exists. A new kind='business' Group has no "local" claim and cannot be promoted by the locality-first index. The Member must explicitly set a jurisdiction; the platform does not auto-derive from the Member's `home_location_id` or affinities.

**Available opt-ins.**
1. **Tier 0 self-attested ZIP (b1).** Granular: per (Member, Group) pair. Member chooses any ZIP they assert is the business's locality.
2. **Tier 1 community-attestation (b2+).** Granular: per (Member, Group) pair. Triggered by buyer/community confirming attestations; not directly opt-in for the seller (the seller's role is to be a seller; the community's role is to confirm or contradict).
3. **Tier 2 document upload (b2+ / b3).** Granular: per (Member, Group) pair. Member chooses to escalate further.

**Three-filter analysis.**

*Tier 0 — self-attested ZIP.*
- **Helpful?** Yes. Locality-based discovery (the locally-owned-and-operated badge, locality filters, proximity-sorted browse) is the platform's most consequential commercial affordance for kind='business' Groups. Tier 0 is the minimum bar to participate.
- **Harms others?** No. The ZIP is not an address; the platform never collects or stores a street address as locality evidence. Members declare a ZIP they choose, including ZIPs that aren't their home (accountant's office, PO Box, registered agent). The fudge surface exists at Tier 0 but is bounded: an out-of-metro fudge fails the proximity test (the proximity check is platform-computed, not platform-trusted to the Member); an in-metro fudge gains the badge but is competitively meaningless because the Group still actually operates where it operates. The "Claimed" label is the abuse-resistance ceiling.
- **Abusable?** Limited. Vectors: (a) **fake jurisdiction for marketing.** Mitigated by the `verification_source` field being a *public* signal — "Claimed" is materially weaker than "Verified" or "Documented" on the surface; competitive pressure pushes Members up the ladder. (b) **jurisdiction-hopping to chase locality-based discovery in multiple metros.** Mitigated by the one-active-row-per-(Member, Group) constraint — a Member can have multiple kind='business' Groups, each with its own jurisdiction, but cannot claim a single Group in multiple metros simultaneously. (c) **competitor claims a Group's jurisdiction is false.** Out of scope for the platform's automated moderation at b1; manual review per `policy.md` if the report flow flags it.

*Tier 1 — community-attestation.*
- **Helpful?** Yes. The "Community-confirmed local owner" badge is a credible competitive signal precisely because *the community confirmed it* — buyers who actually transacted with the seller corroborated the locality claim. More honest than any external lookup because the attestors have ground-truth.
- **Harms others?** No. Attestor identity stays private (anonymized aggregates to the seller); the seller sees confirming-count and dissent-count, never names. Buyers face no platform consequences for confirming or dissenting; the threshold pattern (working answer: design at b2 entry) prevents single-actor attacks from flipping a badge.
- **Abusable?** Vectors: (a) **collusive attestation rings** (a seller's friends all confirm locality without real interaction). Mitigated by the attestation-prompt eligibility — only Members with qualifying interactions (purchase, repeat visit, sustained Group-stream presence) can attest; manufactured-interaction patterns are detectable and de-weight attestations from suspect accounts. (b) **retaliatory dissent** (a competitor or grievance-holder dissents to flag a badge). Mitigated by dissent thresholds (single dissent doesn't demote), reconsideration paths for sellers, and the same eligibility gate as confirmation. (c) **sleeper-attestation farms** (accounts that build interaction histories over months specifically to gain attestation eligibility). Lower-volume risk at platform scale; design at b2 entry addresses with reputation-decay + interaction-volume thresholds.

*Tier 2 — document upload.*
- **Helpful?** Yes. Covers sole props who don't have an LLC, the widest tier. "Documented local owner" is the strongest badge for the smallest businesses.
- **Harms others?** No. Documents are stored privately; only ZIP is extracted for public display. The document blob is never publicly accessible.
- **Abusable?** Vectors: (a) **forged document.** Mitigated by human review at low volume; OCR-flag patterns at higher volume. (b) **uploading a document for someone else's business.** Mitigated by the document's content needing to match the legal entity name on the Group's settings — if the Group's display name is "Maya's Sourdough" and the EIN letter is for "Bob's Plumbing," the upload is rejected.

**Visibility & revocation.** The Member sees their jurisdiction record on their Group's settings surface. They can edit (Tier 0 → climb to Tier 1/2) or remove (`member.business_jurisdiction.remove`) at any time. Removal soft-deletes the row (historical rows preserved for audit); the Group's "local" claim drops immediately if the removed row was the only qualifying jurisdiction across owners.

---

## Integration Points

**Connects to:**

- **Group** — `member_business_jurisdictions` is keyed by `group_id`. The locality-derivation surface in `groups.md` consumes the jurisdiction signal (via `public.zip_is_proximal_to_location()`) to compute the locally-owned-and-operated claim.
- **Member** — `member_business_jurisdictions` is keyed by `member_id`. Only owner-role Members of a kind='business' Group can hold a jurisdiction record for that Group; the role check is enforced in the action handler.
- **Location** — the anchor `location_id` on the Group is the proximity target for the ZIP check. The ZIP-to-MSA crosswalk and the Location's MSA are both substrates here.
- **`member_place_interests` / `member_saved_searches`** (per `member.md`) — **separate, private substrates.** Place-interests are the Member's awareness scope; saved-searches are the Member's subscriptions. Both are owner-only at the row level. Jurisdictions (this spec) are *public* and serve the Group's locality claim. The retired `member_location_affinities` table tried to be all of these at once; the substrate split keeps each in its right home.
- **Action layer** — every write through `member.business_jurisdiction.*` handlers.
- **Event log** — every write fires a `member.business_jurisdiction_*` event.

**Used by:**

- **Group public surface** — renders the "Claimed / Verified / Documented local owner" badge.
- **Locality-first index** (Cluster 3) — promotion weight depends on jurisdiction tier + proximity pass.
- **Locally-owned filter / badge** — surfaces in browse, search, Explore tab.
- **Producer growth dashboard** (per `producer-tools.md`) — surfaces "your locality claim is at Tier N — climb the ladder to surface higher" as an opt-in nudge at T2+.

---

## What does not ship at b1

- **Tier 1 community-attestation.** Requires the platform's interaction graph to reach enough density for attestations to be meaningful + the buyer-side attestation surface design. Defer to b2; substrate (`member_business_jurisdiction_attestations` table) lands at b2 alongside the surface.
- **Tier 2 document upload.** Requires an OCR pipeline or manual review capacity. Defer to b2+/b3.
- **Attestation-threshold worker.** The job that flips a jurisdiction's `verification_source` to `community_attested` when thresholds are met, and demotes when dissent thresholds flag a claim. Defer to b2 alongside the attestation surface.
- **Document blob storage table.** Reserve the `source_document_id` column; build the docs table when T3 ships.
- **Public verification-source filter** (e.g., "show me only Documented-tier local owners"). The verification source is *displayed* on Group surfaces at b1 but is not a filter dimension until b2+.
- **Multi-jurisdiction owners** (a Member with businesses registered in two states). Schema supports it (each kind='business' Group is its own row); surface affordance for managing multiple jurisdictions at scale is b2.
- **Family-business co-jurisdiction recording.** Each owner-role Member has their own jurisdiction record at b1; the surface that aggregates "this Group is locally owned via [Member A, Member B, ...]" is b2 UI work.

---

## Open questions

1. **ZIP-to-MSA proximity threshold.** Working answer: same MSA passes; cross-MSA fails. Rural ZIPs that span multiple MSAs need a tie-break rule. Confirm against the first 50 canonical Sacramento-area Groups at index time.
2. **HUD vs USPS crosswalk source.** USPS publishes the canonical mapping but stale; HUD publishes a refreshed crosswalk quarterly. Decision: HUD quarterly refresh. Confirm before b1 ships.
3. **Confirming and dissent thresholds for Tier 1.** How many confirming attestations promote a seller to "Community-confirmed"? How many dissents flag for review? Working answer: design at b2 entry with first-principles + early-data. Likely a function of seller's transaction volume (more buyers = higher threshold to prevent low-bar promotion at scale; lower threshold for new sellers with few interactions to avoid stranding them indefinitely).
4. **Attestation eligibility — what counts as a qualifying interaction?** Working answer: a purchase via `items.kind='product'` or `'service'`; an RSVP-then-attendance at a kind='business' Group's recurring gathering; sustained presence in the Group's stream (repeated engagement over time). Manufactured-interaction patterns get de-weighted via reputation signals. Design at b2 entry.
5. **Attestation freshness window.** Working answer: 12 months. Old confirmations decay; the badge tier reflects what the community shows *now*, not historical interactions. Confirm at b2 design.
6. **Anti-Nextdoor interaction.** This system makes jurisdiction-based claims about kind='business' Groups. It does NOT enable any messaging or feed scoped to a jurisdiction; jurisdiction is a property of the Group, not an addressability surface. The no-Location-scoped-messaging commitment in `policy.md` is unaffected.
7. **Federation (Loop 13, T3).** A jurisdiction record is portable across federated platforms in principle — the ZIP + verification source travel with the Member. The signature / trust mechanism for verified jurisdictions across federation peers is a T3 concern, parked.

---

## Comments

This system is the structural answer to the "how does the platform know a business is local without forcing the owner to expose a home address" question. Member-geography substrates are owner-only — correct for doxxing-prevention but unverifiable from the outside on their own; the jurisdiction system answers that gap by adding a public floor of evidence — a ZIP, anchored to a public source, separated from address by design. This spec is the *first signal* the locally-owned derivation reads at b1; a second signal (community-member corroboration) layers in at b2+ when the interaction graph matures, and the two together carry the badge.

The ladder is the load-bearing idea. A monolithic "locally owned" badge with one definition fails two ways: too strict (sole props can't qualify), or too lax (anyone can claim it). The ladder lets the platform say *yes* at every level — "you participated, here's the badge with the appropriate evidence level shown" — without ever lying about the strength of the claim. The Tier 0 → Tier 1 → Tier 2 climb is voluntary; the public signal differentiates climbers from non-climbers; the platform's job is to surface the distinction honestly.

The deliberate separation of locality from address is the structural commitment that lets safety-conscious owners (home-based businesses, vulnerable populations, anyone with stalking risk) participate without exposing their home. The platform never sees, stores, or surfaces a street address as locality evidence. ZIPs, MSAs, registered-agent addresses, EIN-letter ZIPs — these are the evidence floor. The Member's home Location stays as the private `members.home_location_id` and never participates in the public locality claim; the prior pattern of recording residence as a `lives` affinity row retires with the affinity substrate.

---

## Decisions encoded here

This spec is the live home for the locality-verification-ladder decision (ratified 2026-05-11; formerly captured in `_attic/2026-05-19/product-exploration/locally-owned-verification.md`). See [`../../playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) for the cross-cutting register.

This spec also *encodes* (but does not own) the policy posture (the policy-posture section above is the three-filter analysis), the Member↔Geography substrate split (this spec is the *first signal* the locally-owned derivation reads; community-corroboration is the second signal at b2+), and the people-first refusal of address-as-locality.

When a kind='business' Group's locality-claim surface formally ratifies (likely scenario F02X-locally-owned-claim under `scope`), the b1 ticket sequence will land:
- A schema ticket creating `member_business_jurisdictions` + `zip_metro_crosswalk` + the `public.zip_is_proximal_to_location()` function.
- A surface ticket landing the Tier 0 self-attestation flow in the Maker walkthrough + Group settings.
- A surface ticket landing the public "Claimed local owner" badge on Group pages.
- An update to `groups.md` locality-derivation pseudocode (Locality and promotion section) to read the jurisdiction table.
