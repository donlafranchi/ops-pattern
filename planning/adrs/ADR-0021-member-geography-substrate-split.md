---
purpose: ADR-21 — retire member_location_affinities; split into three substrates by purpose.
layer: how
status: active
---

# ADR-0021: Member↔Geography substrate split

**Status:** Accepted
**Date:** 2026-05-23
**Deciders:** PM
**Scope:** Retire `member_location_affinities` and its six-kind enum (`lives`, `works`, `plays`, `visits`, `follows`, `liked`); replace with three purpose-owned substrates — jurisdiction (seller locality), place-interests (community awareness), and saved-searches (follow / interest-in-a-Place). Add an Item-level "Locally Made" provenance claim as a sibling to "Locally Owned."
**Touches:** [`product/systems/member.md`](../../product/systems/member.md) · [`product/systems/location.md`](../../product/systems/location.md) · [`product/systems/places.md`](../../product/systems/places.md) · [`product/systems/business-jurisdiction.md`](../../product/systems/business-jurisdiction.md) · [`product/systems/groups.md`](../../product/systems/groups.md) · [`product/systems/discovery.md`](../../product/systems/discovery.md) · [`product/systems/item.md`](../../product/systems/item.md) · [`product/exploration/member-geography-redesign.md`](../../product/exploration/member-geography-redesign.md) (source exploration) · `planning/pending-ratifications.md` §7c #19 · ADR-0016 (scope change)

**Supersedes:** ADR-0016 (in full). The owner-only-RLS posture for private Member geography substrates — owner-only SELECT, action-handler-only writes, service-role bypass for backend pipelines — now belongs to this ADR outright and applies to `member_place_interests` and `member_saved_searches`. The target table ADR-0016 protected (`member_location_affinities`) dissolves; its three named SECURITY DEFINER functions (`count_likes_for_location`, `count_followers_for_location`, `member_is_local_to_location`) retire because no consumer survives the substrate split. Cite this ADR only; ADR-0016 is the historical record.

## Decision

The six-kind `member_location_affinities` enum modeled the wrong thing. Three distinct threads were fused into one table — seller locality (public claim with public evidence), community awareness (private attention scope, Place-shaped not Location-shaped), and follow (a subscription, which is naturally a saved-search shape). Each thread has a different unit, lifecycle, RLS posture, and consumer surface. The redesign separates them:

1. **Seller locality** is fully served by `member_business_jurisdictions` (existing — owner-residence-as-ZIP, public evidence ladder) plus a new `items.made_at_place_id` column (Item-level product provenance, kind='product' only). "Locally Owned" reads jurisdiction; "Locally Made" reads provenance. Both are public claims with public evidence tiers — designed as sibling badges. The `lives`/`works` affinity kinds exit the schema entirely; no surface consumes them under the redesign.

2. **Community awareness** is computed at query time from a new `member_place_interests` table (one `primary_home` Place + up to 5 `secondary` Places per Member) crossed with the existing `member_interests` tag vocabulary. The `places.parent_id` hierarchy handles within-hierarchy traversal (city → MSA); the secondary set handles cross-hierarchy interests (work city, hometown). No stored follow row drives the awareness feed. The `plays`, `visits`, `liked` affinity kinds dissolve — they had no consumer surface.

3. **Follow** is served by the existing `member_follows` (Member → Member) and `group_memberships.source='soft_via_follow'` (Member → Group), plus a new `member_saved_searches` table that generalizes "follow an interest-in-a-Place" and absorbs the "follow this venue" affordance. A saved-search carries a Member-authored label and any combination of `place_id` / `location_id` / `interest_tags` / `item_kinds` filters; fan-out is pull-shaped (match-at-fire) at b1. The `follows` affinity kind retires; the Location-follow UI affordance survives as a saved-search pre-fill.

ADR-0016's privacy posture carries over to the new tables: `member_place_interests` and `member_saved_searches` are owner-only at the row level. ADR-0016's three named functions retire because no consumer survives — `member_is_local_to_location` is replaced by `business-jurisdiction.md`'s `public.zip_is_proximal_to_location()`; the count rollups on the Location page are dropped (speculative; never earned a consumer).

The full spec-patch table and substrate DDL live in the source exploration ([`product/exploration/member-geography-redesign.md`](../../product/exploration/member-geography-redesign.md)); this ADR ratifies the split as architecture.

## Options considered

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen** | Three purpose-owned substrates: jurisdiction (existing, public), place-interests (new, private, Place-shaped), saved-searches (new, private, general). Six-kind enum retires; `member_location_affinities` table never lands. | Chosen |
| B | Keep `member_location_affinities`; drop only `plays` / `visits` / `liked`; route `lives` / `works` reads through jurisdiction; keep `follows` for venue subscriptions. | Rejected — leaves the private/public mismatch in place and keeps a half-empty table whose only surviving kind (`follows`) is a thinner version of saved-search. The half-fix carries the audit-and-RLS complexity of the full table without the conceptual clarity. |
| C | Replace the enum with two booleans (`is_resident`, `is_following`) on a slimmer affinity table. | Rejected — same shape problem as A's diagnosis: residence and follow are different units (Place vs. Location-or-Place-or-interest), different lifecycles (residence is durable, follow is a subscription), different RLS postures (residence is half-public via jurisdiction; follow is fully private). One table can't carry both honestly. |
| D | Defer the redesign; keep the table and the six-kind enum as-is, with `member_is_local_to_location()` doing the public derivation. | Rejected — that *is* the status quo, and `pending-ratifications.md` #19 already verdicted SOFTEN-redesign on the basis that the enum models the wrong thing. Defer-without-decision keeps the audit-and-RLS complexity costed against features that never needed `plays`/`visits`/`liked`. |

## Trade-offs

The chosen split costs three things and earns four.

**Costs.** (1) Three substrates instead of one — more surface area in the schema. (2) The "Locally Made" badge is genuinely new policy ground; its evidence ladder is now designed (per the PM ratification pass 2026-05-23 — see Consequences) but the surface still needs ratification before pipeline-plan can scenarioize it. (3) ADR-0016's named functions disappear, which means the migration ticket sequence drops three RLS-helper-related steps that were in flight — verify nothing else depends on them before retiring.

**Earnings.** (1) Each thread's substrate carries exactly its right unit (jurisdiction → ZIP, place-interest → Place, saved-search → labeled filter set). (2) The public/private split is no longer mediated by a SECURITY DEFINER escape hatch — `member_business_jurisdictions` is structurally public, `member_place_interests` and `member_saved_searches` are structurally private, and the platform never has to reach across the boundary. (3) The "Locally Made" claim earns its existence as a sibling badge designed alongside "Locally Owned," rather than being retrofitted later when a seller asks. (4) Future geographic features (service area, delivery zone, custom-named place affinity) have a clear question to answer at design time — *which substrate owns this?* — and a clear answer pattern (its own substrate, modeled after the posture of one of the three).

The diagnosis the exploration documents (the enum fused three threads with different shapes) is what makes the rejected alternatives fail. Option B keeps the fusion partial; Option C tries to compress the differences into one table again; Option D pretends the diagnosis isn't there. Only Option A treats each thread as the distinct primitive it is.

The biggest unknown is the "Locally Made" verification ladder shape (Open Question 1 in the exploration). The ADR ratifies the *column* (`items.made_at_place_id`) and the *verification-source enum*; it does not ratify the badge surface, the document evidence requirements at higher tiers, or the policy around "designed in / assembled in" edge cases. Those route back through `pipeline-product` once a real seller case forces the question. Reserving the column at b1 keeps the door open without paying for it.

## Consequences

- `product/systems/member.md` — *Multi-Location belonging* section retires. Replaced with *Place-interest scope* (`member_place_interests` substrate, `primary_home` / `secondary` semantics, RLS) and *Saved searches* (`member_saved_searches` substrate, b1-substrate-only). RLS sketch updates. Decisions-encoded banner updates to mark ADR-0016 partially superseded by this ADR.
- `product/systems/location.md` — *Person↔Location relationship* section rewrites: drop the six-kind enum; relationships flow through Items attached, Groups anchored, and saved-searches. *Member-following-Location* subsection rewrites as a UI affordance over saved-searches. "N Members follow this Location" rollup is dropped.
- `product/systems/places.md` — adds an *Integration* note: `member_place_interests` references `places.id`; place-interest scope is the substrate for community-awareness feeds; private per the ADR-0016-style posture carried over.
- `product/systems/business-jurisdiction.md` — drops the *Note on relationship to `member_location_affinities`* paragraph (moot). Adds a reference to the "Locally Made" companion claim in `item.md`.
- `product/systems/groups.md` — *Locality and promotion* derivation rewrites: drop the `any of lives / works` path; the only derivation reads `member_business_jurisdictions` via `zip_is_proximal_to_location()`. Drop the `public.member_is_local_to_location()` reference.
- `product/systems/discovery.md` — adds a *Community-awareness feed* section to T1: candidate set scoped by `member_place_interests` + traversal up `places.parent_id` to city by default + filtered by `member_interests` and Item kind. Drops the `affinity_kind='follows'` substrate references.
- `product/systems/item.md` — adds a *Provenance claims — "Locally Made"* section: `made_at_place_id`, `made_at_verification_source` enum (`none` / `self_attested` / `community_attested` / `document_supported`), action handlers (`item.set_made_at`, `item.remove_made_at`, `item.attest_made_at_community` b2+, `item.verify_made_at_document` b2+/b3), event log entries. Substrate at b1; Tier 0 (self-attested) surface ratification deferred; Tier 1 (community-attested) substrate + surface ship at b2 alongside the parallel `member_business_jurisdiction_attestations` substrate.
- **Verification-ladder reshape (PM ratification 2026-05-23).** Both "Locally Owned" (jurisdiction) and "Locally Made" (provenance) share a three-tier ladder: Tier 0 self-attested → Tier 1 **community-attested** → Tier 2 document-supported. The original Tier 1 framing (SOS API lookup for jurisdiction) is retired — community-attestation is "peer pressure for the greater good," anchored in the platform's own interaction graph rather than external government records. Sellers self-attest at b1; buyers and other community Members attest at b2+ via friction-light prompts on their purchase/interaction surfaces. The substrate (`member_business_jurisdiction_attestations` + `item_made_at_attestations`) and the attestation-threshold worker land at b2 when the interaction graph reaches density. See `business-jurisdiction.md` T2 + Intent block for the load-bearing rationale.
- `planning/rebuild-plan.md` — the migration ticket sequence updates: don't create `member_location_affinities`; do create `member_place_interests`, `member_saved_searches`, and the two new columns on `items`. Drop the three RLS-helper migration steps tied to ADR-0016's named functions.
- `planning/pending-ratifications.md` §7c #19 — entry updates to RATIFIED with pointer to this ADR; entries for the dropped enum values move out of pending.
- ADR-0016 — status flips to *partially superseded by ADR-0021* in `DECISIONS.md` pointer index. The privacy posture survives; the table-specific text retires.
- `pipeline-intent-check` queue: this ADR's absolutes ("the Member never declares `lives`/`works` for any platform purpose," "no stored follow row drives the awareness feed," "`member_place_interests` is owner-only at the row level," "`member_saved_searches` is owner-only at the row level") need State-tagged `Intent:` lines once the spec patches land. Schedule the check after the patches.
- **Foreclosed:** a future per-Member "places I belong to" private list with browsable surface. That use case had no consumer at b1; reopening it requires a new ADR. The cost is a one-time-pad surface that never existed; the gain is structural clarity.
- **Preserved:** the doxxing-prevention guarantee ADR-0016 established. `member_place_interests` and `member_saved_searches` are owner-only; the platform never exposes another Member's geographic attention scope. The anti-Nextdoor commitments in `policy.md` (no Location-scoped messaging, no Location wall, no Location feed) are unchanged.

## Action Items

1. [x] PM ratified 2026-05-23.
2. [ ] Add pointer line to [`../DECISIONS.md`](../DECISIONS.md) — ADR-21 row; update ADR-16 row to mark partial supersession.
3. [ ] Land the seven spec patches per the table in [`product/exploration/member-geography-redesign.md`](../../product/exploration/member-geography-redesign.md) § Spec-patch summary.
4. [ ] Update [`planning/pending-ratifications.md`](../pending-ratifications.md) §7c #19 to RATIFIED with this ADR as the pointer.
5. [ ] Run `pipeline-intent-check` on the patched specs + this ADR. Route any flagged absolutes through `pipeline-ratify-absolute`.
6. [ ] Extend [`product/needs/use-cases.md`](../../product/needs/use-cases.md) with a "Locally Made" canonical anchor (Maya at Oak Park Sourdough — both badges, separately verified) if not already present in the shape pipeline-plan needs.
7. [ ] Update [`planning/rebuild-plan.md`](../rebuild-plan.md) ticket sequence: retire-before-ship `member_location_affinities`; add tickets for `member_place_interests`, `member_saved_searches`, `items.made_at_place_id`.
8. [ ] After all of the above, hand off to `pipeline-plan` for scenario writing.

<!-- After PM ratification, flip Status to Accepted and commit. -->
