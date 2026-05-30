---
id: plan-b1-surface-sequence
purpose: Active sequence for the remaining b1 user-surface work. Replaces the archived b1-primitives-sequence.md.
layer: how
status: queued
---

# b1 surface build — remaining work

> Triaged from `_inbox/b1-primitives-sequence.md` on 2026-05-30. Historical record at [`planning/archive/2026-05-30-b1-primitives-sequence/RETIRED.md`](../archive/2026-05-30-b1-primitives-sequence/RETIRED.md).
>
> All Phase 0 + Phase 1 substrate is complete (T041–T064). What follows is the user-surface work for b1 plus three substrate gates that must land before specific scenarios open.

## Anchors

- Scenarios: 14 drafts in [`planning/scenarios-backlog/`](../scenarios-backlog/) (F030–F043). None approved.
- Stage tracker: [`planning/STAGE-LEDGER.md`](../STAGE-LEDGER.md).
- Scoping doc (still load-bearing): [`planning/bundles/b1-primitives-plan.md`](../bundles/b1-primitives-plan.md).
- Use-case source of truth: [`product/needs/use-cases.md`](../../product/needs/use-cases.md).

## Substrate gates — block specific scenarios

| Gate | Spec contract | Blocks | Current state |
|---|---|---|---|
| **S-metro** — `metro_polygons` table + Census CSA seed + `members.home_metro_id` + home-metro resolution at coordinate-save | `discovery.md` (per playbooks/PLATFORM-PATTERNS.md § metro-polygon overlay); ADR-24 migrated to playbook 2026-05-30 | F031 | Decision ratified; substrate not built. No `metro_polygons` table in `web/supabase/migrations/`. |
| **S-saved-search** — surface enablement | `member.md` § Saved searches; ADR-21 | F033, F042 | Table `member_saved_searches` exists (migration 019). Action handlers `member.saved_search.create / .update / .remove` and "Follow this venue" CTA not yet wired. |
| **S-jurisdictions** — `member_business_jurisdictions` Tier 0 + `public.zip_is_proximal_to_location()` | `business-jurisdiction.md`; ADR-21 | F037, F039 | `items.made_at_place_id` + `items.made_at_verification_source` columns ship (migration 020). `member_business_jurisdictions` table and proximity function not built. |

## Sequence — order of approval

Approval order is the dependency order. Tickets inside a scenario can interleave; the order in which scenarios *open* is the contract.

| F# | Title | Anchor | Depends on | Substrate gate |
|---|---|---|---|---|
| F036 | Member creates business Group via Sell walkthrough | P1 | — | — |
| F038 | Producer lists a product | P1 + P3 | F036 | — |
| F040 | Producer lists a service | P1 + P5 | F036 | — |
| F034 | Member hosts recurring gathering | O1 | F036 | — |
| F035 | Viewer finds Group public page | O1 + P1 | F036, F038, F040 | — |
| F033 | Viewer finds venue page | O1 + O2 | F034 | **S-saved-search** |
| F030 | Newcomer signs up and lands in feed | C1 | F036, F038, F040, F034 | — |
| F032 | Viewer finds Member page and follows | C1 | F030 | — |
| F042 | Member follows producer, Group, venue | C1 | F032, F035, F033 | **S-saved-search** |
| F037 | Producer claims Locally Owned (Tier 0) | P4 | F036 | **S-jurisdictions** |
| F039 | Producer claims Locally Made (Tier 0) | P4 | F038 | **S-jurisdictions** |
| F031 | Member manages place-interest scope | C2 | F030 | **S-metro** |
| F041 | Producer generates QR card for Item | P2 + P3 | F038 (any Item kind) | — |
| F043 | Newcomer completes journey under target | cross-cutting | all above | — |

Rationale: producer surfaces ship before consumer surfaces so the feed has content. Within producers, the Sell walkthrough (F036) creates the Group; product/service Items hang off it; the gathering Item is the wedge demo. Consumer entry (F030) lands after the feed has things to display. Badges (F037, F039) attach to Items/Groups that already exist. Multi-Place awareness (F031) needs items declared across enough Locations to make multi-Place selection meaningful. F043 is the integration test — gates b1 close.

## What's explicitly NOT in b1

Carried over from the archived sequence — these remain out of scope for the active work:

- Wonder, Offer, Ask, Initiative surfaces (schema reservations stay).
- Bulletin composer + push-to-followers (P2 surface; substrate at b1, surface at b2).
- Saved-search composer + fan-out worker (substrate at b1; surface at b2).
- Tier 1 (community-attested) and Tier 2 (document-supported) verification.
- Group composers for kind='place', kind='interest', kind='practice', kind='family' beyond schema.
- Payments / commerce rails.
- Reviews and ratings (permanently deferred).
- Affinity-first Group discovery (C6 — Defers to b2 pending design).
- Attestation surface (C5 — b2; gates Tier 1).
- Service-provider trust signals (C3 / P5 — b2).
- Stewardship tooling (O5 — b2).
- Cafe Capricho case (O6 — far horizon).

## Open inconsistencies to resolve

1. **P2 status mismatch in `use-cases.md`.** P2 is tagged "MVP (b1)" in the Status column but "⬜ Not built — bulletin composer + delivery are b2" in the Build column. Treat P2 as **substrate-at-b1, surface-at-b2** — no F-number in this sequence. The push-to-followers that P3 depends on does not ship at b1; followers see new Items via the locality feed on refresh. PM decision: re-tag the use-cases.md row to "MVP substrate; surface deferred" to match this treatment.

2. **`region`-kind in `places`.** ADR-24 (now in playbooks) notes `region` may drop out of the tree entirely if no URL-browsable region surfaces in b1. This sequence does not introduce one. PM decision at F043 close: drop `region` kind in a follow-on patch if no use case has materialized.

## Doc-tidy follow-ons

- `b1-primitives-plan.md` § Suggested build sequence currently points at `bundle-themes.md`. Update to point at this doc once F036 opens.
- `bundle-themes.md` (cross-bundle sequencer with `b1.0`–`b1.6` slices) and `b1-primitives-work-map.md` (menu of work per sub-bundle) survive as historical sub-bundle slicings. Reconcile their tag-level items into the F-numbered sequence above, or formally retire both, once F036 lands.

## Eval coverage per scenario

Each scenario produces Playwright + RLS-matrix evals. Specific expectations called out:

- **F036, F038, F040, F034** — composer flow timing target (<90 seconds is the working target; treat as a smell, not a contract); public page reachability; kind-specific metadata persistence; action-handler conformance (no direct writes).
- **F035** — Group page rendering (community kinds + business kind); resolve-up rendering of owner Member and brand label.
- **F033** — venue page surfaces gatherings from multiple independent hosts; "Follow this venue" writes a default-labeled `member_saved_searches` row.
- **F030** — anonymous Loop 3 path (no-login `/explore` works); place-interest × interest-tag feed math; signup → onboarding → populated feed under 60s.
- **F032** — Member page renders public profile; Follow CTA writes correctly to `member_follows`.
- **F042** — unified `/you/following` shows Member + Group + Venue follows.
- **F037** — Tier 0 ZIP claim writes `member_business_jurisdictions` row with `verification_source='self_attested'`; badge surfaces conditionally on proximity test.
- **F039** — `made_at_place_id` round-trips; viewer-side proximity rendering for the Locally Made badge.
- **F031** — secondary place-interest cap enforced (≤5); promote/demote atomic-swap holds unique-primary-home invariant; metro-polygon "wider scope" works inside a metro and falls back to radius outside one.
- **F041** — QR card renders to print-quality PNG; resolves to canonical URL.
- **F043** — end-to-end integration: organizer path + producer path complete without getting stuck.

## Non-negotiables — every PR upholds

1. **Person declares Item at Location; other Persons respond. People form Groups when they decide they are a group.** Code reads like the grammar.
2. **Business serves people, not the other way around.** No Business entity. No `business_name` column on Members. No "Brand" abstraction beyond `brand_label` and `group_businesses.display_name`.
3. **Groups are emergent, optional, never auto-assigned.** The platform never enrolls a Member in a Group based on geography, follows, or attendance.

Deviations from these escalate to the PM, not to the data model.
