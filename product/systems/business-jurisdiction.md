# System: Business Jurisdiction (locality verification ladder)

**Purpose:** Give kind='business' Groups a way to anchor their "locally owned and operated" claim to a government-verifiable signal — without forcing the owner to expose a home address. The system models a **verification ladder** (self-attested → state-verified → document-verified) whose tier is itself a public signal. The platform's locality-derivation surface (per `groups.md`) reads this signal; without a jurisdiction record on at least one owner Member, a Group cannot claim "local" status.

**Bundles:** b1 (T1) · b2 (T2) · b3 (T3 optional)

**North stars served:** Buy Close (Loop 9, Trade family) — the platform's most consequential discovery affordance is the locally-owned-and-operated index. The verification ladder is what keeps that index *honest* without forcing every business owner to publish their home address.

**Decisions encoded:** This spec is the home of the verification-ladder decision ratified 2026-05-11 (formerly captured in `_attic/2026-05-19/product-exploration/locally-owned-verification.md`). Cross-cutting: ADR-9 (opt-out default, three-filter test) · ADR-16 (per-row privacy on affinity substrate) · the people-first refusal of address-as-locality.

**Companion specs:** [`groups.md`](groups.md) (the locality-derivation surface that consumes this signal) · [`member.md`](member.md) (the owner Member who holds the jurisdiction record) · [`location.md`](location.md) (the anchor Location whose proximity is tested) · [`policy-framework.md`](../foundation/policy-framework.md) (doxxing-prevention posture).

**Canonical examples this spec serves:** Maya at Oak Park Sourdough (home-based; LLC registered to a commercial agent; wants the "locally owned" badge without publishing the kitchen address) · Bob's two McDonald's franchises (separate jurisdictions, separate locality tests per franchise) · Ferrari Fisheries (sole prop fishing operation; no LLC; uses Tier 0 self-attested ZIP at b1, climbs to Tier 2 document-verified when the platform's doc pipeline lands).

---

## What this system is

A `kind='business'` Group's "locally owned and operated" claim is derived: at least one owner Member must be local to the Group's `anchor_location_id`. The locality test runs through `public.member_is_local_to_location()` (per ADR-16), which reads the Member's `lives` / `works` affinities — substrate that is owner-only at the row level and self-asserted.

Self-asserted affinity alone is **fudge-able**: a Member who wants the locally-owned badge for marketing reasons could declare `lives` at any Location of their choosing. The platform can't tell from the affinity table whether the assertion is genuine.

The Business Jurisdiction system adds a **second signal** alongside affinity: a ZIP (or ZIP-equivalent locality token) anchored to something *external* to the platform — government-verified business records. The platform stores not just the ZIP but the **source** of the ZIP. The source becomes the public signal: a Group can be a "Claimed local owner" (Tier 0), a "Verified local owner" (Tier 1), or a "Documented local owner" (Tier 2). Members aren't punished for being at Tier 0; the platform is transparent about the evidence level.

A Group with no jurisdiction record at all cannot make a "local" claim — the locality-derivation surface skips it. This is the **lever**: locality-based discovery is a real benefit, so business owners have an incentive to provide at least Tier 0. Safety-conscious owners can provide a ZIP that isn't their home (their accountant's, a PO Box, a registered agent's ZIP) without uploading documents. **Locality (ZIP, state) is separated from address (street, building) by design.** The platform never asks for, stores, or surfaces a street address as locality evidence.

---

## T1 — MVP Tier (b1): Self-attested ZIP

The b1 surface is the smallest version that lets a kind='business' Group make a locally-owned claim with a public floor of evidence. At b1, the floor is opt-in self-attestation.

**Behavior.** Any owner-role Member of a kind='business' Group can set a self-attested ZIP for that Group. The ZIP is stored on a new `member_business_jurisdictions` row scoped to (`member_id`, `group_id`). The `verification_source` is `'self_attested'`. The Group's public surface displays "Claimed local owner" alongside the locally-owned badge when the ZIP passes the proximity test against the anchor Location.

**Multiple owner-role Members.** Each owner can have their own jurisdiction record. The Group qualifies as locally owned if **any** owner's jurisdiction ZIP passes the proximity test. Multi-owner is additive, not constraining — Maya bakes and her partner works the booth; either's jurisdiction qualifies the Group.

**Surfaces.**
- **Composer.** The kind='business' Group walkthrough (per `groups.md`; ADR-12 superseded 2026-05-12 per `agent-commerce-and-project-amendments.md` §6) adds an optional "where is this business based?" step. Self-attested ZIP only; no document upload at b1.
- **Group settings.** Owners can edit/add/remove their jurisdiction record from the kind='business' Group's settings surface.
- **Group public surface.** The badge "Claimed local owner" surfaces alongside the locally-owned indicator. No street address is ever shown.

**Locality derivation (the upgrade to `groups.md`).** The rule in `groups.md` (Locality and promotion) reads:

```sql
-- Pseudocode: a kind='business' Group is locally owned at b1 when
-- at least one owner Member has a jurisdiction record whose ZIP
-- falls within proximity of the Group's anchor_location_id.
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

The `public.zip_is_proximal_to_location(zip text, location_id uuid) returns boolean` function is a public-callable SECURITY DEFINER that compares the ZIP's metro/MSA against the anchor Location's metro/MSA, returning true within the proximity threshold (same threshold spec'd in `groups.md`).

**Note on relationship to `member_location_affinities`.** The affinity table records "where the Member declares they belong" (live, work, play, etc.) — substrate for the Member's own surfaces. The jurisdiction table records "where the Member's *business* is registered" — substrate for the locality-promotion claim. They serve different purposes and are not interchangeable. A Member's `lives` affinity is owner-only per ADR-16 and is *not* used for Group-locality derivation post-ADR-16; the jurisdiction record is the public floor instead.

---

## T2 — Core Tier (b2+): SOS-verified

When platform revenue allows the integration work and ongoing API costs, Tier 1 lands. Members can verify their jurisdiction against the state Secretary of State public business search.

**Behavior.** Member supplies the LLC/corp/LP legal name + state of formation. The platform queries the state SOS public business search (free in most states; cheap commercial APIs like OpenCorporates aggregate for non-commercial use). The lookup returns the registered agent address, from which the ZIP is extracted and stored. The `verification_source` becomes `'sos_lookup'`. The Member can override the verified ZIP with a different ZIP if they want to claim locality somewhere other than the registered agent's ZIP (e.g., the registered agent is in Sacramento but the Member operates in Folsom) — the verified ZIP remains the baseline, the override is a separate row noting the divergence.

**Surfaces.**
- **Settings.** A "Verify your business" CTA in the kind='business' Group's settings opens a flow: enter legal name + state → platform queries SOS → confirm or override the returned ZIP → record committed.
- **Group public surface.** "Verified local owner" badge replaces "Claimed local owner." The verified-vs-claimed distinction is visible on the Group's public page alongside the locally-owned indicator.

**Scope.** LLC, LP, corp, S-corp. Sole props operating under their own legal name without an SOS filing stay at Tier 0 (or climb to Tier 2 via document upload).

**Maintenance.** The platform re-queries the SOS periodically (working answer: quarterly) and demotes the Tier 1 status if the entity is no longer found (dissolved, lapsed). The demotion writes to the event log and the Member is notified; the jurisdiction row's `verified_at` is cleared and the badge reverts to "Claimed."

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
  state                text check (state ~ '^[A-Z]{2}$'),  -- 2-letter; populated at sos_lookup / document_upload
  legal_entity_name    text,  -- populated at sos_lookup / document_upload
  verification_source  text not null
    check (verification_source in ('self_attested','sos_lookup','document_upload')),
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

**Event log.** Every write fires a `member.business_jurisdiction.*` event (per ADR-7 — same-transaction row+event invariant). Events: `member.business_jurisdiction_set`, `member.business_jurisdiction_verified`, `member.business_jurisdiction_documented`, `member.business_jurisdiction_removed`. Each carries the diff (old → new ZIP, old → new source). The event log is the audit trail for any later challenge ("you claimed local in 2027, then moved in 2028 — when did you update?").

**Soft delete.** `removed_at` is the standard pattern. Historical rows preserve the audit chain even after a Member changes their declared jurisdiction.

**Proximity computation.** The `public.zip_is_proximal_to_location()` function reads a `zip_metro_crosswalk` table (USPS / HUD ZIP-to-MSA mapping, refreshed quarterly). The function returns true when the input ZIP's MSA matches the anchor Location's MSA (or matches within a configurable proximity radius for rural cases).

**RLS.** `member_business_jurisdictions` SELECT is public for `removed_at IS NULL` rows — the jurisdiction record is meant to be a *public* claim on the Group's surface, unlike `member_location_affinities` which is owner-only per ADR-16. The ZIP and source columns are intentionally readable; the document blob (T3) is private. INSERT/UPDATE/DELETE goes through action handlers only.

---

## Action handlers (per ADR-7)

- `member.business_jurisdiction.set(group_id, zip, [state], [legal_entity_name])` — Tier 0 write. Inserts or soft-replaces the active row for (`member_id`, `group_id`). `verification_source = 'self_attested'`, `verified_at = null`. Validates the Member is an active owner-role membership in the Group; rejects otherwise.
- `member.business_jurisdiction.verify_via_sos(group_id, legal_entity_name, state)` — Tier 1 write. Invokes the SOS lookup, records returned `zip` + `state` + `legal_entity_name`, sets `verification_source = 'sos_lookup'`, `verified_at = now()`.
- `member.business_jurisdiction.upload_document(group_id, document_blob_id, document_type)` — Tier 2 write. Records the document reference, queues OCR/human review. On confirmation, updates row to `verification_source = 'document_upload'`, `verified_at = now()`, `source_document_id = ...`.
- `member.business_jurisdiction.remove(group_id)` — soft-deletes the active row. Fires `member.business_jurisdiction_removed`. The Group's "local" claim drops if this was the only qualifying jurisdiction across its owners.

All four handlers are scoped capabilities (per `action-layer.md`): Member-on-self only; never delegable to a third party (per ADR-9 categorical refusal of delegating identity claims).

---

## Policy posture (per ADR-9)

This system touches public visibility and the locally-owned claim. Three-filter analysis:

**Default state.** No jurisdiction record exists. A new kind='business' Group has no "local" claim and cannot be promoted by the locality-first index. The Member must explicitly set a jurisdiction; the platform does not auto-derive from the Member's `home_location_id` or affinities.

**Available opt-ins.**
1. **Tier 0 self-attested ZIP (b1).** Granular: per (Member, Group) pair. Member chooses any ZIP they assert is the business's locality.
2. **Tier 1 SOS verification (b2+).** Granular: per (Member, Group) pair. Member chooses to escalate.
3. **Tier 2 document upload (b2+ / b3).** Granular: per (Member, Group) pair. Member chooses to escalate further.

**Three-filter analysis.**

*Tier 0 — self-attested ZIP.*
- **Helpful?** Yes. Locality-based discovery (the locally-owned-and-operated badge, locality filters, proximity-sorted browse) is the platform's most consequential commercial affordance for kind='business' Groups. Tier 0 is the minimum bar to participate.
- **Harms others?** No. The ZIP is not an address; the platform never collects or stores a street address as locality evidence. Members declare a ZIP they choose, including ZIPs that aren't their home (accountant's office, PO Box, registered agent). The fudge surface exists at Tier 0 but is bounded: an out-of-metro fudge fails the proximity test (the proximity check is platform-computed, not platform-trusted to the Member); an in-metro fudge gains the badge but is competitively meaningless because the Group still actually operates where it operates. The "Claimed" label is the abuse-resistance ceiling.
- **Abusable?** Limited. Vectors: (a) **fake jurisdiction for marketing.** Mitigated by the `verification_source` field being a *public* signal — "Claimed" is materially weaker than "Verified" or "Documented" on the surface; competitive pressure pushes Members up the ladder. (b) **jurisdiction-hopping to chase locality-based discovery in multiple metros.** Mitigated by the one-active-row-per-(Member, Group) constraint — a Member can have multiple kind='business' Groups, each with its own jurisdiction, but cannot claim a single Group in multiple metros simultaneously. (c) **competitor claims a Group's jurisdiction is false.** Out of scope for the platform's automated moderation at b1; manual review per `policy-framework.md` if the report flow flags it.

*Tier 1 — SOS verification.*
- **Helpful?** Yes. The "Verified local owner" badge is a credible competitive signal — it requires the Member to have a real LLC/corp in a real state and to provide the legal name + state for lookup. Members who can climb to Tier 1 benefit; the platform's locally-owned index becomes more honest.
- **Harms others?** No. SOS records are public by design — the platform is exposing what is already publicly searchable, just doing so with less friction. The Member's home address is still never disclosed (the SOS record carries the registered agent's address, which is typically a commercial agent).
- **Abusable?** Vectors: (a) **stolen legal-entity name.** Mitigated by the lookup happening through public SOS records, not user-supplied data — the platform queries the state's official database; the Member can't supply fake LLC data. (b) **SOS-of-convenience (Delaware, Nevada).** A Member who registers an LLC in Delaware for non-locality reasons (tax / liability) but operates elsewhere would have a Delaware ZIP returned, which fails the Sacramento proximity test, which fails the locality claim. The Tier 1 verification *correctly* doesn't qualify them as locally owned in Sacramento — the system is doing its job.

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
- **`member_location_affinities`** (per `member.md`) — **separate substrate.** Affinities are owner-only per ADR-16 and serve the Member's own surfaces. Jurisdictions are public and serve the Group's locality claim. Do not confuse them.
- **Action layer** (per ADR-7) — every write through `member.business_jurisdiction.*` handlers.
- **Event log** — every write fires a `member.business_jurisdiction_*` event.

**Used by:**

- **Group public surface** — renders the "Claimed / Verified / Documented local owner" badge.
- **Locality-first index** (Cluster 3) — promotion weight depends on jurisdiction tier + proximity pass.
- **Locally-owned filter / badge** — surfaces in browse, search, Explore tab.
- **Producer growth dashboard** (per `producer-growth.md`) — surfaces "your locality claim is at Tier N — climb the ladder to surface higher" as an opt-in nudge at T2+.

---

## What does not ship at b1

- **Tier 1 SOS verification.** Requires an integration with state SOS APIs and ongoing per-lookup costs. Defer to b2 when revenue allows.
- **Tier 2 document upload.** Requires an OCR pipeline or manual review capacity. Defer to b2+/b3.
- **Periodic SOS re-verification** (the quarterly recheck that demotes dissolved LLCs). Defer to b2 alongside Tier 1.
- **Document blob storage table.** Reserve the `source_document_id` column; build the docs table when T3 ships.
- **Public verification-source filter** (e.g., "show me only Documented-tier local owners"). The verification source is *displayed* on Group surfaces at b1 but is not a filter dimension until b2+.
- **Multi-jurisdiction owners** (a Member with businesses registered in two states). Schema supports it (each kind='business' Group is its own row); surface affordance for managing multiple jurisdictions at scale is b2.
- **Family-business co-jurisdiction recording.** Each owner-role Member has their own jurisdiction record at b1; the surface that aggregates "this Group is locally owned via [Member A, Member B, ...]" is b2 UI work.

---

## Open questions

1. **ZIP-to-MSA proximity threshold.** Working answer: same MSA passes; cross-MSA fails. Rural ZIPs that span multiple MSAs need a tie-break rule. Confirm against the first 50 canonical Sacramento-area Groups at index time.
2. **HUD vs USPS crosswalk source.** USPS publishes the canonical mapping but stale; HUD publishes a refreshed crosswalk quarterly. Decision: HUD quarterly refresh. Confirm before b1 ships.
3. **Sole-prop Tier 1 path.** Sole props without an LLC have no SOS record; they're stuck at Tier 0 until Tier 2 lands. Is there an interim Tier 1.5 (e.g., DBA filing lookup, which is county-level)? Defer; revisit at b2 design.
4. **Tier demotion when SOS shows entity dissolved.** Working answer: the Tier 1 status reverts to Tier 0 with the previously-verified ZIP retained as self-attested. The Member is notified. The event log records the demotion. Confirm the user-facing copy before b2 ships.
5. **Pre-revenue SOS API cost.** Free for most states; $5-$10/lookup for Delaware, Nevada. OpenCorporates is free for non-commercial up to N queries/day. At Tier 0-only b1, none of this matters. Revisit at b2 launch.
6. **Anti-Nextdoor interaction (per ADR-9 §1).** This system makes jurisdiction-based claims about kind='business' Groups. It does NOT enable any messaging or feed scoped to a jurisdiction; jurisdiction is a property of the Group, not an addressability surface. The no-Location-scoped-messaging commitment in `policy-framework.md` is unaffected.
7. **Federation (Loop 13, T3).** A jurisdiction record is portable across federated platforms in principle — the ZIP + verification source travel with the Member. The signature / trust mechanism for verified jurisdictions across federation peers is a T3 concern, parked.

---

## Comments

This system is the structural answer to the "how does the platform know a business is local without forcing the owner to expose a home address" question. The locality test in `groups.md` reads affinity substrate that is now owner-only per ADR-16 — which is correct for doxxing-prevention but leaves the locality claim unverifiable from the outside. The jurisdiction system adds the public floor of evidence: a ZIP, anchored to a public source, separated from address by design.

The ladder is the load-bearing idea. A monolithic "locally owned" badge with one definition fails two ways: too strict (sole props can't qualify), or too lax (anyone can claim it). The ladder lets the platform say *yes* at every level — "you participated, here's the badge with the appropriate evidence level shown" — without ever lying about the strength of the claim. The Tier 0 → Tier 1 → Tier 2 climb is voluntary; the public signal differentiates climbers from non-climbers; the platform's job is to surface the distinction honestly.

The deliberate separation of locality from address is the structural commitment that lets safety-conscious owners (home-based businesses, vulnerable populations, anyone with stalking risk) participate without exposing their home. The platform never sees, stores, or surfaces a street address as locality evidence. ZIPs, MSAs, registered-agent addresses, EIN-letter ZIPs — these are the evidence floor. The home address stays in the Member's `member_location_affinities` as a `lives` row, owner-only per ADR-16, and never participates in the public locality claim.

---

## Decisions encoded here

This spec is the live home for the locality-verification-ladder decision (ratified 2026-05-11; formerly captured in `_attic/2026-05-19/product-exploration/locally-owned-verification.md`). See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register.

This spec also *encodes* (but does not own) ADR-9 (the policy-posture section above is the three-filter analysis), ADR-16 (the separation between affinity substrate and jurisdiction substrate is the load-bearing surface — affinity is owner-only and serves the Member's own surfaces; jurisdiction is public and serves the Group's locality claim), and the people-first refusal of address-as-locality.

When a kind='business' Group's locality-claim surface formally ratifies (likely scenario F02X-locally-owned-claim under `pipeline-plan`), the b1 ticket sequence will land:
- A schema ticket creating `member_business_jurisdictions` + `zip_metro_crosswalk` + the `public.zip_is_proximal_to_location()` function.
- A surface ticket landing the Tier 0 self-attestation flow in the Maker walkthrough + Group settings.
- A surface ticket landing the public "Claimed local owner" badge on Group pages.
- An update to `groups.md` locality-derivation pseudocode (Locality and promotion section) to read the jurisdiction table.
