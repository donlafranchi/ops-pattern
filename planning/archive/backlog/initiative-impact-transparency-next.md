---
purpose: Spec-level integration — weave Impact Transparency into system specs, wireframes, and design foundations
layer: planning
status: draft
created: 2026-06-21
---

# Initiative: Impact Transparency — Spec-Level Integration

After the immediate doc cleanup lands the new DLS section and foundation-level principle, this initiative weaves Impact Transparency into system specs that govern discovery/ranking/surfacing, updates wireframe and mockup HTML to reflect the new badge treatment, and specs the alternatives pattern in the discovery system.

**Working frame:** 1 = "Benefits the few" → 5 = "Benefits the many." Final label naming pending PM decision.

---

## Scope

**In:** System specs that reference how entities are ranked, surfaced, or badged. Wireframe/mockup HTML files. Design foundation and research docs. Discovery system spec for the alternatives pattern. DLS token definitions for the new badge component.

**Out:** Code changes (web/ — that's the `later` initiative). Foundation docs and DLS source-of-truth updates (that's the `now` initiative — must land first). Archived files.

---

## Tasks

### Discovery & ranking spec work

- [ ] Spec the Impact Transparency scoring model in `product/systems/` (new file or section): inputs (locality verification, ownership structure, labor practices, community engagement, wealth circulation), weighting, the 1–5 output scale, and the three rules (transparent by default, community-attestable, alternatives always surfaced).
- [ ] Spec the **alternatives pattern** in the discovery system: when a member views a low-scoring entity, the UI surfaces higher-scoring alternatives in the same category and place. Define the query shape, ranking logic, and the "see local alternatives" affordance.
- [ ] Update `product/ui/community-platform.md` — integrate impact scoring into feed ranking, explore filters, and discovery surfaces. Define where badges appear (card, detail page, search results) and where they don't.

### System spec integration

- [ ] **`product/systems/groups.md`** — Spec how a kind='business' Group's impact score is derived (inputs: jurisdiction verification tier, ownership structure, member attestations). Define the badge display rules on Shop pages and Group cards.
- [ ] **`product/systems/item.md`** — Spec how Items inherit or derive impact signals (via parent Group, via `made_at` provenance, via direct attestation). Define badge display on Item cards and detail pages.
- [ ] **`product/systems/location.md`** — Spec how Locations relate to impact scoring (venue ownership, entity-at-location relationships).
- [ ] **`product/systems/business-jurisdiction.md`** — Integrate the verification ladder as an input dimension to impact scoring. Define how Tier 0/1/2 maps to impact score components. The ladder stays; its output feeds the score rather than standing alone as a badge.
- [ ] **`product/systems/producer-tools.md`** — Update the Growth dashboard spec: replace ownership-tier nudge with impact-score visibility. Spec the "improve your score" guidance surface.

### Wireframe & mockup HTML updates

- [ ] **`product/ui/wireframes/mobile-screens.html`** (lines 37, 271, 692) — Replace `--locally-owned: #1B7A3D` CSS variable and green "Locally Owned" badge on cards and Shop header with new impact badge treatment.
- [ ] **`product/ui/wireframes/create-sheet-and-item-pages.html`** (lines 32, 407) — Replace `--locally-owned` variable and badge on product detail page.
- [ ] **`product/ui/wireframes/hifi-home-feed.html`** (lines 32, 179) — Replace `--locally-owned` variable and badge on product card.
- [ ] **`product/ui/mockups/design-comparison.html`** (lines 629–641, 1081–1355) — Replace `.tier-badge` CSS system (`.independent`, `.coop` classes) and all tier-badge instances on cards. Update the analysis section referencing "ownership tier badge" as trust signal.
- [ ] **`product/ui/mockups/mockup-mobile-b1.html`** (line 670) — Replace "Want a verified 'Locally Owned' badge later?" in sell walkthrough with new impact badge language.
- [ ] **`product/ui/mockups/mockup-mobile-b1-original.html`** (line 670) — Same update.
- [ ] **`product/ui/mockups/mockup-mobile-b1-pistachio.html`** (line 676) — Same update.
- [ ] **`product/ui/mockups/mockup-mobile-b1-pistachio-v2.html`** (line 646) — Same update.

### Design foundation & research doc updates

- [ ] **`product/ui/phase-1-design-foundations.md`** (lines 130–132) — Replace "Ownership badges: Per DLS ownership tier spectrum. Green-to-gray semantic axis" with new impact model reference.
- [ ] **`product/ui/phase-1-design-foundations.md`** (line 177) — Update "Locally Owned badge (#1B7A3D background)" contrast check for new badge color.
- [ ] **`product/ui/phase-1-design-foundations.md`** (line 220) — Rename `OwnershipBadge` component reference to new component name.
- [ ] **`product/ui/design-research-thesis.md`** (line 96) — Update "the ownership tier spectrum — exists as a system resource" to reference impact scale.
- [ ] **`product/ui/phase-0-ia-wireframes.md`** (lines 112, 273–309) — Update "Locally Owned" badge on Shop page wireframe and Tier 0 locality claim in sell walkthrough.

### DLS token updates

- [ ] Define new badge component tokens in `product/ui/design-language.md` (after `now` initiative lands the new section): impact-score color ramp (5 values), badge shape/size, badge text treatment, "see alternatives" link style.
- [ ] Define `data-impact-score` attribute semantics (replaces `data-extractive`): which scores trigger the "faded" visual treatment, what the neutral/positive treatments look like.

### Exploration & needs doc updates

- [ ] **`product/exploration/locally-made.md`** (lines 38, 104, 202, 218) — Update "Locally Owned" as sibling badge to Locally Made; both become inputs to impact score.
- [ ] **`product/needs/use-cases.md`** (lines 57, 62, 120, 176, 187, 283–307) — Update P4 canonical: "A locally-owned, locally-made producer earns and displays both badges" to reference new impact model.
- [ ] **`product/needs/producer-roadmap.md`** (lines 74–78) — Update "Claimed local owner" badge at Tier 0 to reference impact input.

### Verification

- [ ] Every system spec that references entity ranking or surfacing cites the impact scoring model.
- [ ] Every wireframe/mockup HTML uses the new badge CSS/class names — zero references to `--locally-owned`, `.tier-badge.independent`, `.tier-badge.coop`.
- [ ] The alternatives pattern is fully specced with query shape, ranking logic, and UI affordance.

---

## Done criteria

All system specs reference Impact Transparency scoring as the model for entity ranking and badging. Wireframes and mockups render the new badge treatment. The alternatives pattern is specced in the discovery system. Design foundation docs reference the new model.

## Depends on

- `initiative-impact-transparency-now` completed (DLS source of truth and foundation principle must land first — this initiative references them).

## Retires when

All tasks checked, verification passes, file moves to `planning/done/`.
