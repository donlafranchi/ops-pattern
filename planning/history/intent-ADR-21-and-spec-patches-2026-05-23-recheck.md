# Intent check (re-run) — ADR-21 + spec patches + verification-ladder reshape

**Date:** 2026-05-23 (re-run; original review [`intent-ADR-21-and-spec-patches-2026-05-23.md`](intent-ADR-21-and-spec-patches-2026-05-23.md))
**Target:** [`planning/adrs/ADR-0021-member-geography-substrate-split.md`](../adrs/ADR-0021-member-geography-substrate-split.md) · [`planning/adrs/ADR-0016-affinity-row-privacy.md`](../adrs/ADR-0016-affinity-row-privacy.md) (now superseded) · [`product/systems/member.md`](../../product/systems/member.md) · [`product/systems/location.md`](../../product/systems/location.md) · [`product/systems/places.md`](../../product/systems/places.md) · [`product/systems/business-jurisdiction.md`](../../product/systems/business-jurisdiction.md) · [`product/systems/groups.md`](../../product/systems/groups.md) · [`product/systems/discovery.md`](../../product/systems/discovery.md) · [`product/systems/item.md`](../../product/systems/item.md) · [`product/foundation/policy.md`](../../product/foundation/policy.md)
**Verdict:** **CLEAN**

**Summary.** All 11 flags from the original review (3 Category-2 escalations + 5 Category-1/5/6 proposes + 2 Category-7 cross-doc + 1 Category-1 numeric on Tier 0 floor) are resolved. PM ratification 2026-05-23 set a soft-framing posture across the three Category-2 absolutes and reshaped the verification ladder (Tier 1 = community-attestation, not SOS API). ADR-16 fully (not partially) superseded by ADR-21. Re-scan finds no new unannotated Category-1–8 statements introduced by the reshape — every newly-landed absolute or constraint carries substantive Intent.

## Closed flags

| ID | Category | Resolution | Landed at |
|---|---|---|---|
| E1 | 2 — refusal | Revised → soft commitment; Intent (Ratified 2026-05-23 — soft commitment) | `member.md` *Not a Location* paragraph |
| E2 | 2 — refusal | Revised → "first signal" + community-corroboration second signal; Intent ratified | `business-jurisdiction.md` *What this system is* + propagated to `groups.md` |
| E3 | 2 — refusal | Revised → soft commitment (computed-not-stored; cache, never engagement-optimized product surface); Intent ratified | `discovery.md` *Community-awareness feed* |
| 1 | 1 — numeric | Soft commitment (≤5 secondary is a starting point); Intent landed | `member.md` Place-interest scope |
| 2 | 1 — numeric + forward note | Label range Intent + new "Search as the load-bearing surface" section spanning b1 → T3 | `member.md` Saved searches + `discovery.md` new section |
| 3 | 1 — numeric / policy | Intent landed as proposed | `discovery.md` Community-awareness feed |
| 4 | 1 — tier assignment | Intent landed against new ladder shape | `business-jurisdiction.md` T1 |
| 5 | 5 — required-constraint | Intent reframed (awareness-default anchor, not scope size) | `member.md` Place-interest DDL |
| 6 | 6 — default | Intent landed against new ladder shape | `item.md` Provenance |
| 7 | 7 — cross-doc | Resolved by full ADR-16 supersession (no disambiguation; cite ADR-21 only) | `member.md` decisions-encoded + RLS sketch |
| 8 | 7 — cross-doc | Resolved by full ADR-16 supersession | `business-jurisdiction.md` decisions-encoded |

## Re-scan for new absolutes introduced by the reshape

Walked the verification-ladder reshape's new surfaces for Category 1–8 candidates:

- **`business-jurisdiction.md` T2 community-attestation** — refusal-shape statements ("Tier 1 is community-attestation … *not* an external government lookup," "the community-attestation surface is the load-bearing T1 by design"). Already covered by the **Intent (Ratified 2026-05-23)** block landed under T2. CLEAN.
- **`item.md` Provenance enum extension** — `made_at_verification_source` now includes `community_attested`. Default `'none'` carries the Flag-6 Intent block. CLEAN.
- **ADR-21 Consequences — ladder reshape paragraph** — descriptive memorial of the PM ratification; the load-bearing rationale lives in the spec-resident T2 Intent block in `business-jurisdiction.md`. Category-7 by shape, but the local contribution is named ("see `business-jurisdiction.md` T2 + Intent block for the load-bearing rationale"). CLEAN.
- **`policy.md` "hard architectural floor" paragraph** — rewrites the floor to cite ADR-21 instead of ADR-16; the load-bearing rationale (private Member geography substrates owner-only at the row level) is named locally in the same paragraph. CLEAN.
- **`rebuild-plan.md` b1 commitments item #8 (ladder reshape)** — procedural / implementation; not a Category 1–8 shape.
- **`discovery.md` "Search as the load-bearing surface" section** — forward-looking vision; no absolutes; describes b1/b2/T3 progression. CLEAN.
- **ADR-16 supersession statements** across specs ("ADR-16 was superseded by ADR-21; cite ADR-21 only") — meta-references, not policy claims. CLEAN.

## Notes for the PM

- The "soft commitment" framing the PM applied to all three Category-2 escalations is now the project's standing pattern for absolute-shaped statements in this substrate. Future ratify-absolute walks on related domains can lean on the same shape (current answer + test-for-future-proposals + observable trigger for revisit).
- Two new tables now reserved at b2+ but not yet ticketed: `member_business_jurisdiction_attestations` and `item_made_at_attestations`. The `rebuild-plan.md` mentions them at the conceptual level; pipeline-plan can scenarioize their substrate without needing further intent work, since they're b2+ and won't ship until the surface is designed.
- The exploration document at [`product/exploration/member-geography-redesign.md`](../../product/exploration/member-geography-redesign.md) still contains historical references to ADR-16 in its original framing. Per `pipeline-product` convention, explorations are historical-record once their ADR lands; not flagged.

## Re-run after

No re-run needed. **Verdict CLEAN.** `pipeline-plan` is unblocked to scenarioize ADR-21's downstream features.
