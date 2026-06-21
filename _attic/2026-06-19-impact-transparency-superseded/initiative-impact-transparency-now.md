---
purpose: Immediate doc cleanup — retire old ownership-tier framing from load-bearing docs
layer: planning
status: draft
created: 2026-06-21
---

# Initiative: Impact Transparency — Immediate Doc Cleanup

Retire the six-tier green-to-gray ownership spectrum from the DLS, foundation docs, system specs, and planning docs. Replace with the Impact Transparency framing. Anchor the "benefits the few → benefits the many" principle in a foundation doc.

**Working frame:** 1 = "Benefits the few" → 5 = "Benefits the many." Final label naming pending PM decision.

---

## Scope

**In:** All non-code doc references to ownership-tier framing that are marked "replace" or "fold-in" in the audit. DLS source of truth, foundation docs, system specs, planning docs.

**Out:** Code changes (web/ — that's the `later` initiative). Wireframe/mockup HTML updates (that's the `next` initiative). Archived files in `_attic/` and `development/tickets/done/` (already retired). Exploration docs with "keep-as-input" disposition (narrative language that survives unchanged).

---

## Tasks

### DLS updates (`product/ui/design-language.md`)

- [ ] Replace `### Ownership tier spectrum` section (line 75) with new `### Impact Transparency scale` section
- [ ] Replace green-to-gray semantic axis (line 77) with "benefits the few → benefits the many" axis
- [ ] Replace six-tier color table (lines 81–86) with new 1–5 impact scale tiers and colors
- [ ] Replace `data-extractive="true"` visual treatment (line 88) with new harmful-end treatment
- [ ] Define new badge token names (replacing `--color-ownership-*` naming convention)

### Foundation doc updates

- [ ] **`product/foundation/anti-extraction.md`** — Reframe the five-marker extraction diagnostic as one input dimension to the impact scale. Retitle or restructure to reflect its new role as methodology input rather than standalone classification. Add cross-reference to impact scale spec.
- [ ] **`product/foundation/people-first.md`** (line 24) — Reframe "impersonality is the extractive vector (the corporate-shell)" from local-vs-corporate to impact framing. The people-first principle survives; the supporting rationale shifts.
- [ ] **`product/foundation/principles.md`** — Add the "benefits the few → benefits the many" principle as a new first-principle entry (or fold into an existing one). People-first framing updates from local-vs-corporate to impact language.
- [ ] **`product/foundation/platform-promise.md`** (line 90) — Review "absorbed into extractive national systems" phrasing for fit with new model. Likely keep-as-input (narrative), but confirm.
- [ ] **`product/foundation/community-health-rubric.md`** (line 252) — Review "not extractive shareholders" phrasing. Cooperative framing survives; confirm no ownership-tier-specific language leaks.

### System spec updates

- [ ] **`product/systems/groups.md`** — Reframe "structural refusal of corporate personhood" (line 32) and "locally owned and operated" promotion semantics (lines 72, 90–91) to impact framing. Locality stays as one input. Update OR-across-owners badge rule to reference new impact badge. Update "wealth created here now flows out" framing (lines 297–333) and "people-first commitment" / "corporate personhood" refs (lines 463, 469).
- [ ] **`product/systems/business-jurisdiction.md`** — Reframe the three-tier verification ladder (Claimed / Community-confirmed / Documented local owner) as one input dimension to impact scale. Verification ladder stays; its framing shifts from standalone badge to input signal.
- [ ] **`product/systems/item.md`** (lines 104–107) — Update made-at provenance ownership tier references. Provenance stays; tier framing replaced.
- [ ] **`product/systems/location.md`** (lines 199, 223) — Update "Locally-owned derivation reads this spec's substrate" terminology.
- [ ] **`product/systems/places.md`** (lines 165, 195) — Update locally-owned derivation through places.
- [ ] **`product/systems/member.md`** (line 32) — Update locally-owned derivation from member locations.
- [ ] **`product/systems/agent-assistance.md`** (line 228) — Rename `prefer_local` boolean on `bounded_purchase` Delegation to impact-aware preference. "Extractive intermediaries" (line 218) likely survives as wealth-circulation language.
- [ ] **`product/systems/payments.md`** — Review ~12 references to "extractive wealth" vs "circulative wealth." The one absolute survives. Confirm no ownership-tier-classification language leaks (wealth-flow language is separate from the old six-tier system).
- [ ] **`product/systems/producer-tools.md`** — Reframe Tier 0/1/2 nudge on producer dashboard for impact scale.

### Planning doc updates

- [ ] **`planning/now/review-F037.md`** (line 83) — Update "Ownership tier spectrum in DLS" reference to match new DLS section name.
- [ ] **`planning/now/bundle-1-checklist.md`** (lines 29, 36–37, 63) — Update "Jurisdiction badges substrate — powers the 'Locally Owned' badge" to reflect new model.
- [ ] **`planning/now/mvp-goal.md`** (line 33) — Update "Tier 0 self-attested locality badges" language.
- [ ] **`planning/now/plan-b1-surface-sequence.md`** (line 44) — Update F037 sequence entry if badge name changes.
- [ ] **`planning/now/scenario-F037-maya-claims-locally-owned.md`** — Review throughout; badge framing may evolve but scenario structure stays.
- [ ] **`planning/now/scenario-F039-maya-claims-locally-made.md`** (lines 16, 21, 113) — Sibling update to F037.
- [ ] **`planning/now/scenario-F036-member-creates-business-group-via-sell-walkthrough.md`** (lines 20, 110) — Update Locally Owned claim references in sell walkthrough.

### Skills & root doc updates

- [ ] **`skills/test/workflow.md`** (line 26) — Update `data-testid` / `data-extractive` preservation note when attribute name changes.
- [ ] **`web/CLAUDE.md`** (line 44) — Update `data-extractive` attribute reference.

### Verification

- [ ] Grep `ownership.tier|ownership_tier|Ownership.Tier|green-to-gray|six-tier|OwnershipTier` across non-archived, non-code docs — zero hits outside `_attic/` and `development/tickets/done/`.
- [ ] Confirm the one absolute ("wealth circulation over wealth extraction") remains intact in `playbooks/DECISION-PATTERNS.md`, `CLAUDE.md`, `AGENTS.md`, `skills/weigh/`.

---

## Done criteria

All load-bearing doc references to the old six-tier ownership spectrum updated to Impact Transparency framing. The DLS defines the new scale as source of truth. The "benefits the few → benefits the many" principle is anchored in `product/foundation/principles.md`. Grep verification passes.

## Depends on

- PM decision on final label names for the 1–5 scale (working frame: "benefits the few → benefits the many"; proceed with this and update labels when PM decides).

## Retires when

All tasks checked, verification grep clean, file moves to `planning/done/`.
