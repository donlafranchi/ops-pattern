# Locally-Owned Verification — Ladder, Options, Reasoning

**Status:** **PROMOTED 2026-05-11** — superseded by [`product/systems/business-jurisdiction.md`](../systems/business-jurisdiction.md). This exploration doc is the historical record of the reasoning that produced the spec. Live reference for the verification ladder is now the system spec; this doc is retained for the source-conversation context and the open-questions list that the spec inherits.

**Owners:** PM (this doc, historical) → `pipeline-product` (promoted to `business-jurisdiction.md` on 2026-05-11) → `pipeline-plan` for scoping (next: scenarios in `planning/scenarios-backlog/` per the system spec's "Decisions encoded here" footer).

**Source conversation:** the T045 M2 code review surfaced a missing `locations_owner_read` policy (private Locations unreadable by owners). The follow-on discussion identified the deeper doxxing problem — home-based businesses leaking residential addresses through their public surfaces — and the locality-derivation question: *how does the platform know a business is "local" without forcing the owner to expose their home?*

This doc captures the answer the PM converged on. The system spec at `product/systems/business-jurisdiction.md` is the live ratification; the rest of this doc is the working draft that produced it.

---

## The problem

`groups.md` derives "locally owned" as: a `kind='business'` Group is locally owned when at least one owner Member is locally affiliated (`affinity_kind='lives'` or `'works'`) with the Group's `anchor_location_id`. That derivation reads from `member_location_affinities`, which is Member-declared, private substrate.

Two issues:

1. **Doxxing surface.** If a Member declares `lives` at a Location, that Location is, in effect, their home address. The platform's own derivation needs the affinity to evaluate locality, but exposing the affinity to anyone other than the Member is a doxxing risk. The current b1 plan correctly keeps affinities private — but then *the platform itself* is the only entity that knows whether a Group is locally owned. Any public-facing "locally owned" badge is a derived claim with no exposed evidence.

2. **Fudge surface.** Because the affinity is private and self-asserted, a Member who wants to gain "locally owned" status for marketing reasons could declare `lives` at any Location of their choosing. The platform can't tell. The locally-owned signal becomes a self-attestation with no verification floor.

The PM's framing: *we want a way to anchor locality to something government-verifiable, without forcing exposure of the home address.* Tax-filing ZIP was the first guess.

## What's available in the US tax / business-registration system

| Source | Who has one | Address it carries | Publicly verifiable? | Doxxing risk if disclosed |
|---|---|---|---|---|
| **Form 1040 (personal income tax)** | Anyone with income above filing threshold (~95% of working adults) | Filer's residence (where IRS mails refunds and notices) | No — IRS doesn't expose | **High** — it's the home address |
| **Schedule C (1040 attachment for self-employed)** | Sole props + single-member LLCs + side-hustlers earning ≥ $400 net | "Principal place of business" — often the home for home-based businesses | No | **High** for home-based |
| **Form 1120 (C-corp return)** | C-corps | Corp's principal address | No directly, but most corps also file state SOS | Low if the corp has a non-home address |
| **Form 1120-S / 1065 (S-corp / partnership)** | S-corps, partnerships | Entity's principal address | No directly | Same as above |
| **EIN application (Form SS-4)** | Businesses with employees + most LLC/corp owners + many sole props who chose to get one | Whatever the applicant entered (can be PO Box, registered agent, home) | No — Member would have to share IRS letter | Depends on what was entered |
| **State Secretary of State filings (LLC/corp registration)** | Every LLC, corp, LP in every state | Registered agent address (must be a real in-state physical address) + sometimes principal office address | **Yes** — every state has a public business search | Low if Member used a commercial registered agent |
| **State sales tax permit** | Anyone selling taxable goods | Business location | State-dependent, often public | Medium |
| **Local business license** | Storefronts; spotty for home-based | Business address | Yes — city/county records | Medium |
| **DBA / fictitious name** | Sole props operating under a brand | County-level filing address | Yes | Medium |

**Conclusion on "personal income tax ZIP":** technically every business owner files a 1040 with their business income on it. But the *address* on the 1040 is the home address for home-based businesses. Personal tax ZIP is exactly the doxxing surface, not the answer.

**The single best alternative:** the **state Secretary of State registered agent ZIP**. Public record. Hard to fudge. Doesn't require exposing the home (most LLC owners use a commercial registered agent service in a non-residential ZIP). Two limits:
- Sole props operating under their own legal name don't have an SOS filing.
- The registered agent ZIP may be the agent's commercial address, not the owner's locality — proves jurisdiction, not residence.

## The ladder

Verification level becomes itself a public signal — "Verified local owner" vs "Claimed local owner." Members who can prove it do; Members who can't (or who choose not to for safety reasons) still participate without leaking their address.

**Tier 0 — Self-attested ZIP (b1; ships first).**

Member supplies a ZIP they assert is their business locality. No verification. Stored on the Member or on `group_businesses`. Surfaces a "Claimed local owner" badge. Logged in the Member's event log so the assertion is auditable if challenged later.

The PM's call: *any business without a self-attested ZIP cannot claim local status.* The ladder is opt-in; the consequence of opting out is exclusion from locality-derived surfaces. This is the lever — locality-based discovery is a real benefit, so business owners have an incentive to provide one. Safety-conscious owners can still provide a ZIP that isn't their home (their accountant's, a PO Box, a registered agent ZIP) without uploading documents.

**Tier 1 — Verified via state Secretary of State lookup (b2 or later, when revenue allows).**

Member supplies the LLC/corp legal name + state of formation. Platform queries the state's SOS public business search (free in most states; cheap commercial APIs aggregate, e.g., OpenCorporates) and stores the registered agent ZIP. Member can override with a different ZIP if they want to claim locality somewhere other than the registered agent's ZIP, but the verified ZIP is what's stored as the baseline. Surfaces a "Verified local owner" badge.

Scope: LLC, LP, corp, S-corp. Sole props without an entity registration stay at Tier 0.

**Tier 2 — Document upload (b2+, when manual review or OCR pipeline exists).**

Member uploads an EIN letter, sales tax permit, business license, or DBA filing. Platform extracts ZIP via OCR (or human review at very low volume). Surfaces a "Documented local owner" badge. Covers sole props with any government-issued business doc.

## Schema implications

None of this lands in T045. When it ships, the shape is roughly:

```sql
-- New table (or columns on group_businesses; choice deferred to spec)
create table member_business_jurisdictions (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid not null references members(id) on delete cascade,
  group_id            uuid references groups(id) on delete cascade,
  zip                 text not null check (zip ~ '^[0-9]{5}$'),
  verification_source text not null check (verification_source in ('self_attested','sos_lookup','document_upload')),
  verified_at         timestamptz,
  source_document_id  uuid,  -- FK to a future docs table; nullable
  state               text,  -- 2-letter; populated at sos_lookup
  legal_entity_name   text,  -- populated at sos_lookup or document_upload
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
```

Locality derivation becomes: a `kind='business'` Group is locally owned when at least one owner Member has a `member_business_jurisdiction` row whose ZIP falls within (or within N miles of) the Group's `anchor_location_id`. The N-mile threshold and the ZIP-to-area resolution are open questions.

The action handler set extends with:
- `member.business_jurisdiction.set` (Tier 0 — self-attested)
- `member.business_jurisdiction.verify_via_sos` (Tier 1 — invokes the state SOS lookup)
- `member.business_jurisdiction.upload_document` (Tier 2 — kicks off OCR/review)

## What the PM decided (2026-05-11)

1. **Tier 0 ships at b1 as part of the locality-derivation surface, not now.** Not in T045. Not in T046's RLS fix-forward. A separate scenario in `pipeline-plan` that gets ticketed under Phase 1 or Phase 2.
2. **Any business without a Tier 0 ZIP cannot claim "local" status.** Locality-derived surfaces (the locally-owned badge, the locality-promotion in `groups.md`, the locally-owned filters) skip the Group. This is the lever that makes Tier 0 voluntary-yet-incentivized.
3. **Tiers 1 and 2 add as the platform becomes profitable.** Don't gate b1 on them. Don't build OCR or contract with a SOS API vendor pre-revenue.
4. **The doc model separates locality from address.** Locality (ZIP, state) ≠ address (street, building). The platform never asks for or stores a street address as locality evidence. This is the doxxing-prevention design choice.
5. **The verification-source field is itself a public signal.** "Claimed" vs "Verified" vs "Documented" is shown on the Group's public surface alongside the locally-owned badge. Members aren't punished for being at Tier 0; the platform is honest about the level of evidence.
6. **The doxxing concern surfaced in T045's M2 review is real but not solved by this doc.** The T045 RLS gap (owners can't read their own private Locations) is a schema-correctness fix landing as T046. The deeper doxxing-prevention work — address-visibility separated from row-discoverability, geography fuzzing for residential Locations — is product work parked for a later exploration.

## Open questions parked

1. **ZIP resolution.** A ZIP can span multiple MSAs in rural areas; some MSAs have hundreds of ZIPs. The `groups.md` locality-derivation rule needs to specify "ZIP is within the same MSA as the anchor Location's MSA" — and we need MSA-to-ZIP mapping (USPS public data is canonical but stale; HUD publishes a refreshed crosswalk quarterly).
2. **Multi-jurisdiction owners.** A Member with businesses registered in two states. Two `member_business_jurisdiction` rows. Locality-derived surface shows Group is local in whichever ZIP matches the viewer's locality scope.
3. **Ladder demotion.** What happens when a Verified Member's LLC dissolves? The SOS record goes away. The Member's Tier 1 status should expire and the platform should re-run the SOS check periodically.
4. **Family-business pattern.** Maya bakes; her partner works the booth. Both are owner-role Members of the kind='business' Group. Whose jurisdiction counts? Answer: any owner-role Member's jurisdiction qualifies the Group. Multi-owner is additive, not constraining.
5. **Anti-Nextdoor interaction.** This ladder lets the platform make jurisdiction-based claims about businesses. It does NOT enable any messaging or feed scoped to a jurisdiction (the no-Location-scoped-messaging commitment in `policy-framework.md` holds). Jurisdiction is a property of the Group, not an addressability surface.
6. **Pre-revenue API cost.** A free SOS lookup tier exists for most states (search-by-name returns the registered agent address). Some states (Delaware, Nevada) charge $5-$10 per lookup. OpenCorporates is free for non-commercial use up to N queries/day. Self-hosted scraping is fragile. Decision: at Tier 0-only b1, none of this matters. Revisit at Tier 1 launch.

## What this doc is NOT

- Not a system spec. The system spec for this surface lives in `groups.md` (locality-derivation) and a new `product/systems/business-jurisdiction.md` (or a section of `groups.md`) when `pipeline-product` ratifies the shape.
- Not an ADR. When the entity-shape question (new table vs columns on `group_businesses`) gets decided, write the ADR.
- Not a scenario. `pipeline-plan` writes the scenario when the surface is ready to ticket. Probable scenario names: F02X-locally-owned-claim, F02X-business-jurisdiction-set, F02X-jurisdiction-verify-sos.

## Pipeline routing for the work this doc seeds

1. **Next:** `pipeline-product` reads this doc and writes either a new section in `groups.md` or a new `product/systems/business-jurisdiction.md`. Outcome: a system spec with T1/T2/T3 tiers, data model, action handlers.
2. **Then:** `pipeline-plan` writes scenarios in `planning/scenarios-backlog/` and reviews under the mandatory-review lens. Outcome: 1-3 approved scenarios in `planning/scenarios/`.
3. **Then:** `pipeline-review` runs (rebuild-phase requirement). Verdict + ADR check.
4. **Then:** `pipeline-ticket` breaks scenarios into Phase 1 (schema floor) and Phase 2 (surface) tickets. Likely a schema ticket for `member_business_jurisdictions` table + a surface ticket for the Tier 0 self-attestation flow.
5. **Then:** `pipeline-build` implements TDD.
