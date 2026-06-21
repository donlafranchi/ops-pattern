---
purpose: Audit of old ownership-tier framing references across the repo
status: draft
created: 2026-06-21
---

# Audit: Ownership Tier Framing

The platform is moving from a local-vs-non-local ownership ranking (six-tier green-to-gray spectrum) to a broader "helpful to harmful for humanity" impact scale. This audit catalogs every reference to the old framing so we know what to update.

**Summary:** 43 live files, 20+ archived files, ~180 distinct references. The old framing is load-bearing in 3 code files, 1 DLS spec, and 1 TypeScript type definition. The "Locally Owned" badge and the "wealth circulation over extraction" absolute survive into the new model but need reframing.

---

## A. Design Language System (DLS)

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `product/ui/design-language.md` | 75 | `### Ownership tier spectrum (badges + map pins only)` | **replace** — new impact-scale section | **YES** — DLS source of truth |
| `product/ui/design-language.md` | 77 | `green = local, gray/black = extractive` semantic axis | **replace** — new color logic | **YES** |
| `product/ui/design-language.md` | 81–86 | Six-tier table: coop `#0E6B2E`, independent `#1B7A3D`, mission-driven `#5A8F66`, local-franchise `#97A89A`, challenger `#B0B0B0`, pe-corporate `#2A2A2A` | **replace** — new tier definitions + colors | **YES** |
| `product/ui/design-language.md` | 88 | `data-extractive="true"` → `grayscale(0.6)` + `opacity 0.78` + "Wall Street fades into the background" | **replace** — new visual treatment for harmful end of scale | **YES** |

## B. System Specs (live product/)

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `product/systems/groups.md` | 32 | "structural refusal of corporate personhood" | keep-as-input — people-first principle survives, needs reframing from local-vs-corporate to helpful-vs-harmful | |
| `product/systems/groups.md` | 72, 90–91 | "locally owned and operated" promotion semantics; OR-across-owners rule for the Locally-Owned badge | keep-as-input — badge survives, inputs into new model | |
| `product/systems/groups.md` | 297, 299, 323, 331, 333 | locality derivation, "wealth created here now flows out" framing | fold-in — locality stays as one input to impact scale | |
| `product/systems/groups.md` | 463, 469 | "people-first commitment" and "corporate personhood" framing | keep-as-input — reframe from local-vs-corporate to impact | |
| `product/systems/business-jurisdiction.md` | 3–278 (throughout) | Three-tier verification ladder: Claimed / Community-confirmed / Documented local owner | keep-as-input — verification ladder becomes one input to impact scale | |
| `product/systems/item.md` | 104–107 | made-at provenance ownership tier references | fold-in — provenance stays, tier framing replaced | |
| `product/systems/location.md` | 199, 223 | "Locally-owned derivation reads this spec's substrate" | fold-in — derivation stays, terminology changes | |
| `product/systems/places.md` | 165, 195 | locally-owned derivation through places | fold-in | |
| `product/systems/member.md` | 32 | locally-owned derivation from member locations | fold-in | |
| `product/systems/agent-assistance.md` | 218 | "extractive intermediaries" | keep-as-input — wealth-circulation language survives | |
| `product/systems/agent-assistance.md` | 228 | `prefer_local` boolean on bounded_purchase Delegation | fold-in — rename to impact-aware preference | |
| `product/systems/payments.md` | 18, 32, 34, 58, 61, 82, 232, 262, 264, 266, 277, 497 | "extractive wealth" vs "circulative wealth" — the one absolute; non-extractive fee shapes; wealth-circulation rubric | keep-as-input — the absolute survives; "extractive" language here is about wealth flow, not ownership classification | |
| `product/systems/producer-tools.md` | (via business-jurisdiction ref) | Tier 0/1/2 nudge on producer dashboard | fold-in — reframe nudge for impact scale | |

## C. Foundation Docs

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `product/foundation/anti-extraction.md` | 1–69 (entire file) | Five-marker extraction diagnostic + treatment toolkit | **fold-in** — diagnostic becomes one input to the new impact scale; file may become the impact-scoring methodology | **YES** — defines the extraction diagnostic |
| `product/foundation/people-first.md` | 24 | "impersonality is the extractive vector (the corporate-shell that hides the human)" | keep-as-input — reframe from corporate-vs-local to impact | |
| `product/foundation/platform-promise.md` | 90 | "absorbed into extractive national systems" | keep-as-input — narrative language, not classification | |
| `product/foundation/community-health-rubric.md` | 252 | "not extractive shareholders" (platform cooperativism) | keep-as-input — cooperative framing survives | |
| `product/foundation/principles.md` | (via CLAUDE.md ref) | "People-first, not business-first" | keep-as-input — principle survives, reframe from local-vs-corporate to helpful-vs-harmful | |

## D. Wireframes & Mockups (HTML)

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `product/ui/wireframes/mobile-screens.html` | 37, 271, 692 | `--locally-owned: #1B7A3D`; green "Locally Owned" badge on cards and Shop header | **replace** — update badge name/color per new model | |
| `product/ui/wireframes/create-sheet-and-item-pages.html` | 32, 407 | `--locally-owned: #1B7A3D`; badge on product detail page | **replace** | |
| `product/ui/wireframes/hifi-home-feed.html` | 32, 179 | `--locally-owned: #1B7A3D`; badge on product card | **replace** | |
| `product/ui/mockups/design-comparison.html` | 629–641 | `.tier-badge.independent { background: #1B7A3D }`, `.tier-badge.coop { background: #0E6B2E }` | **replace** — full tier-badge CSS system | |
| `product/ui/mockups/design-comparison.html` | 1081, 1126, 1172 | `<span class="tier-badge independent">Independent</span>`, `<span class="tier-badge coop">Co-op</span>` on cards | **replace** |  |
| `product/ui/mockups/design-comparison.html` | 1275, 1317, 1345, 1355 | Analysis: "ownership tier badge" as unique trust signal replacing star ratings (4 references) | **replace** — reframe for impact model | |
| `product/ui/mockups/design-comparison-v2.html` | 1207, 1239, 1241 | "Ownership tier in text below card"; documents decision to REMOVE tier badges from photo overlays | keep-as-input — v2 already moved away from tier badges | |
| `product/ui/mockups/mockup-mobile-b1.html` | 670 | "Want a verified 'Locally Owned' badge later?" (sell walkthrough) | **replace** — update badge name | |
| `product/ui/mockups/mockup-mobile-b1-original.html` | 670 | Same | **replace** | |
| `product/ui/mockups/mockup-mobile-b1-pistachio.html` | 676 | Same | **replace** | |
| `product/ui/mockups/mockup-mobile-b1-pistachio-v2.html` | 646 | Same | **replace** | |

## E. Design Foundations & Research

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `product/ui/phase-1-design-foundations.md` | 130–132 | "Ownership badges: Per DLS ownership tier spectrum. Green-to-gray semantic axis communicates alignment without explanation." | **replace** — update to new impact model | |
| `product/ui/phase-1-design-foundations.md` | 177 | "Locally Owned badge (#1B7A3D background, white text): 5.5:1" contrast check | **replace** — update color + name if changed | |
| `product/ui/phase-1-design-foundations.md` | 220 | `OwnershipBadge` component reference | **replace** — rename component | |
| `product/ui/design-research-thesis.md` | 96 | "the ownership tier spectrum — exists as a system resource" | **replace** — update terminology | |
| `product/ui/phase-0-ia-wireframes.md` | 112, 273–309 | "Locally Owned" badge on Shop page wireframe; Tier 0 locality claim in sell walkthrough | fold-in — badge stays, framing updates | |

## F. Planning Docs (live)

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `planning/now/review-F037.md` | 83 | "Ownership tier spectrum in DLS: green axis for local/independent" | fold-in — review references current DLS; update when DLS updates | |
| `planning/now/scenario-F037-maya-claims-locally-owned.md` | throughout | F037 scenario: Maya claims the Locally Owned badge | fold-in — scenario stays, badge name/framing may evolve | |
| `planning/now/scenario-F039-maya-claims-locally-made.md` | 16, 21, 113 | sibling to F037 | fold-in | |
| `planning/now/scenario-F036-member-creates-business-group-via-sell-walkthrough.md` | 20, 110 | Shop walkthrough references Locally Owned claim | fold-in | |
| `planning/now/bundle-1-checklist.md` | 29, 36–37, 63 | "Jurisdiction badges substrate — powers the 'Locally Owned' badge" | fold-in | |
| `planning/now/mvp-goal.md` | 33 | "Tier 0 self-attested locality badges (Locally Owned, Locally Made)" | fold-in | |
| `planning/now/plan-b1-surface-sequence.md` | 44 | F037 sequence entry | fold-in | |
| `planning/done/2026-05-30-pending-ratifications/pending-ratifications.md` | 314 | "Ownership tier colors live only on badges" | fold-in — scoping rule still valid, terminology changes | |
| `planning/done/2026-05-30-pending-ratifications/pending-ratifications.md` | 461 | "The single 'Never' — extractive wealth over circulative wealth — is RATIFIED" | keep-as-input — the absolute survives | |

## G. Source Code (web/)

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `web/src/app/globals.css` | 37–43 | Six `--color-ownership-*` CSS custom properties with hex values | **replace** — new scale colors | **YES** — consumed by components |
| `web/src/app/globals.css` | 94–103 | `[data-extractive="true"]` CSS rule: `grayscale(0.6)` + `opacity: 0.78` + "Wall Street fades" comment | **replace** — new visual treatment | **YES** |
| `web/src/lib/types.ts` | 1–7, 199–230 | `OwnershipTier` type union (6 tiers) + `OWNERSHIP_TIERS` const with labels, colors, descriptions. PE/corporate: "Absent owner, money leaving town" | **replace** — new type definitions | **YES** — imported across app |
| `web/src/lib/map-config.ts` | 16–23 | `PIN_COLORS` record with all six hex values | **replace** — new pin color logic | **YES** — consumed by Map.tsx |
| `web/src/components/OwnershipBadge.tsx` | 1–36 | Badge component: colored dot + label per tier. Descriptions: independent = "Locally owned and operated", pe-corporate = "Private equity or corporate owned" | **replace** — new component for impact model | **YES** |
| `web/src/components/OwnershipSelector.tsx` | 1–50 | Radio selector with six tier options + descriptions | **replace** — new selector for impact model | **YES** |
| `web/src/components/BusinessDetailCard.tsx` | 39 | `data-extractive={business.ownership_tier === 'pe-corporate' ? 'true' : undefined}` | **replace** — new harm treatment | **YES** |
| `web/src/app/business/[slug]/BusinessListingPage.tsx` | 42, 46 | `const isExtractive = business.ownership_tier === 'pe-corporate'`; `data-extractive` attribute | **replace** — new harm treatment | **YES** |
| `web/CLAUDE.md` | 44 | "Preserve `data-testid` and `data-extractive` attributes — evals depend on them" | **replace** — update when attribute changes | |
| `web/src/components/group/LocallyOwnedClaim.tsx` | 1–7 | Claim widget component | fold-in — widget may stay with updated naming | |
| `web/src/components/group/LocallyOwnedClaim.test.tsx` | 1–38 | Test for claim widget | fold-in | |
| `web/src/components/group/ShopPublicPage.tsx` | 107–110 | Renders LocallyOwnedClaim widget | fold-in | |
| `web/src/app/p/[...slug]/claim-actions.ts` | 3–5 | Server actions for the claim | fold-in | |
| `web/src/lib/groups/resolve-shop.ts` | 188–193 | `resolveLocalOwnerBadge` function | fold-in | |
| `web/evals/features/F037-maya-claims-locally-owned.spec.ts` | throughout | Playwright eval for F037 | fold-in | |

## H. Skills & Development Docs

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `skills/test/workflow.md` | 26 | "Preserve any `data-testid` / `data-extractive` attributes — evals may depend on them" | **replace** — update when attribute changes | |
| `CLAUDE.md` | 14 | "People-first, not business-first" | keep-as-input — principle survives | |
| `CLAUDE.md` | 36 | "never owned by a corporate shell" | keep-as-input — structural principle survives | |
| `CLAUDE.md` | 192, 214 | "wealth circulation over wealth extraction" (the one absolute) | keep-as-input — absolute survives | |
| `AGENTS.md` | 134 | "wealth circulation over wealth extraction" | keep-as-input | |
| `playbooks/DECISION-PATTERNS.md` | 37, 39, 41, 47, 49, 78 | The one absolute: wealth circulation over extraction; no advertising marketplace; extraction surface area | keep-as-input — absolute survives into new model | |
| `skills/weigh/SKILL.md` | 20 | "wealth circulation over wealth extraction" | keep-as-input | |
| `skills/weigh/workflow.md` | 35 | "Wealth circulation over wealth extraction" | keep-as-input | |
| `playbooks/DEVELOPMENT-PATTERNS.md` | 50 | "non-local DATABASE_URLs" (eval helper guard) | not related — this is about database URLs, not ownership | |

## I. Exploration & Needs Docs

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `product/exploration/locally-made.md` | 38, 104, 202, 218 | "Locally Owned" as sibling badge to Locally Made | fold-in — badge name may evolve | |
| `product/exploration/mehko-home-kitchen.md` | 67, 191, 202, 243, 245 | MEHKO operator Locally Owned/Made badges | fold-in | |
| `product/exploration/market-intelligence.md` | 35 | "the privacy and anti-extraction commitments are not optional" | keep-as-input | |
| `product/exploration/brand-strategy-and-naming.md` | 49 | "the anti-extraction posture made literal" | keep-as-input | |
| `product/exploration/project-arc-overview.md` | 44, 52 | "anti-extraction posture"; "anti-extraction stories" | keep-as-input | |
| `product/exploration/local-stays.md` | 16, 92 | "extractive intermediaries concentrating ownership"; "revenue transparency" | keep-as-input | |
| `product/needs/member-journey.md` | 18 | "hollowed out by extractive intermediaries" | keep-as-input — narrative language, not classification | |
| `product/needs/use-cases.md` | 57, 62, 120, 176, 187, 283–307 | P4 canonical: "A locally-owned, locally-made producer earns and displays both badges" | fold-in — example updates with new model | |
| `product/needs/producer-roadmap.md` | 74–78 | "Claimed local owner" badge at Tier 0 | fold-in | |

## J. Done Tickets (reference only)

| File | Line(s) | What it says | Disposition | Load-bearing? |
|---|---|---|---|---|
| `development/tickets/done/T001-project-init.md` | 21, 39–44 | Tailwind ownership tier tokens (OLDER gold/amber/blue/purple scheme) | archive — superseded | |
| `development/tickets/done/T002-database-schema.md` | 16, 23, 37 | `ownership_tier` text column; six tier values | archive — schema will change | |
| `development/tickets/done/T004-map-view-colored-pins.md` | 19, 35, 40–45 | Pin color by ownership tier (OLDER hex values) | archive — superseded | |
| `development/tickets/done/T007-business-detail-card.md` | 17, 21–23, 39–44 | Ownership tier badge, badge colors, PE/corporate display, tier descriptions | archive | |
| `development/tickets/done/T008-business-registration.md` | 17, 19–20, 41–47 | 6-tier selector with descriptions | archive | |
| `development/tickets/done/T009-shareable-listing.md` | 18–19 | Ownership tier badge in OG metadata | archive | |
| `development/tickets/done/T015-explore-search-map.md` | 35 | "ownership-tier coloring deprecated for this product" | archive — documents deprecation | |
| `development/tickets/done/T017-vendor-profile-update.md` | 39 | "remove ownership badge" | archive — documents removal | |
| `development/tickets/done/T021-tide-accent-and-cta-patterns.md` | 18–19, 33, 95 | coop `#0E6B2E` preserved; ownership tier colors untouched by accent migration | archive | |

## K. Archived Files (_attic/)

20+ files in `_attic/2026-05-19/` with extensive ownership-tier references. These are already retired. Key files:

| File | What it contains | Disposition |
|---|---|---|
| `_attic/2026-05-19/product-systems/ownership-classification.md` | Full six-tier system spec (the original source) | already archived |
| `_attic/2026-05-19/product-surfaces/ownership.md` | Product dashboard for ownership classification | already archived |
| `_attic/2026-05-19/product-systems/community-impact.md` | Simpler three-color scheme (green/amber/gray) | already archived |
| `_attic/2026-05-19/product-capabilities/community-impact-badge.md` | Three-color badge capability | already archived |
| `_attic/2026-05-19/planning/JOURNAL-pre-mission-clarity-2026-05-08.md` | Historical evolution of tier colors + data-extractive treatment | already archived |
| `_attic/2026-05-19/product-exploration/original-scenarios.md` | Original scenarios with ownership badges as core differentiator | already archived |
| `_attic/2026-05-19/product-exploration/thesis.md` | "PE firms buy up Main Street" / "Wall Street" framing | already archived |
| `_attic/2026-05-19/planning-scenarios-backlog/F001-F010` | Six retired scenarios referencing ownership tiers/badges | already archived |

## L. _inbox Files

| File | Line(s) | What it says | Disposition |
|---|---|---|---|
| `_inbox/mascot-comparison-penguin-vs-crow.html` | 244 | "people-first, no-extractive-cut" | keep-as-input |
| `_inbox/cooperative-engine-explorations/02-cooperative-formation-templates.md` | 40 | "extractive vendors" | keep-as-input |
| `_inbox/cooperative-engine-explorations/05-ai-serves-people.md` | 34, 55 | "Anti-extraction by design"; "anti-misuse" | keep-as-input |

---

## Disposition Key

| Tag | Meaning |
|---|---|
| **replace** | Must be rewritten with new impact-scale framing before shipping |
| **fold-in** | Content survives but needs terminology/framing update; locality becomes one input to impact scale |
| **keep-as-input** | Language about wealth extraction, people-first, anti-extraction survives into new model; review for fit but likely unchanged |
| **archive** | Already in done/ or _attic/; no action needed unless we want to update for consistency |
| **not related** | Grep hit on a keyword but unrelated to ownership-tier framing |

---

## Counts

| Category | Files | Distinct references | Load-bearing |
|---|---|---|---|
| DLS (design-language.md) | 1 | 4 sections | **YES** — source of truth |
| System specs (product/systems/) | 8 | ~30 references | 1 (anti-extraction.md) |
| Foundation docs | 5 | ~8 references | 1 (anti-extraction.md) |
| Wireframes (HTML) | 3 | 6 references | |
| Mockups (HTML) | 5 | ~15 references | |
| Design foundations/research | 3 | 5 references | |
| Planning (live) | 8 | ~15 references | |
| Source code (web/) | 15 | ~25 references | **YES** — 8 files |
| Skills & root docs | 6 | ~10 references | |
| Exploration & needs | 8 | ~15 references | |
| Done tickets | 9 | ~30 references | |
| Archived (_attic/) | 20+ | 50+ references | |
| _inbox | 3 | 4 references | |
| **TOTAL** | **~94 files** | **~217 references** | **10 load-bearing files** |

---

## Critical Path (load-bearing files that would break if just deleted)

These 10 files contain the definitions that other files consume. They must be **replaced** (not just deleted) before downstream references can update:

1. **`product/ui/design-language.md`** (lines 75–88) — DLS spec; every badge, wireframe, and component references this
2. **`product/foundation/anti-extraction.md`** — extraction diagnostic; folding into impact methodology
3. **`web/src/lib/types.ts`** — `OwnershipTier` type; imported by every component that renders ownership info
4. **`web/src/lib/map-config.ts`** — `PIN_COLORS`; consumed by map components
5. **`web/src/app/globals.css`** (lines 37–43, 94–103) — CSS tokens + `[data-extractive]` rule
6. **`web/src/components/OwnershipBadge.tsx`** — badge rendering component
7. **`web/src/components/OwnershipSelector.tsx`** — registration form selector
8. **`web/src/components/BusinessDetailCard.tsx`** — applies `data-extractive` attribute
9. **`web/src/app/business/[slug]/BusinessListingPage.tsx`** — applies `data-extractive` attribute
10. **`web/src/components/group/LocallyOwnedClaim.tsx`** — claim widget (may survive with updated naming)

---

## What survives into the new model

1. **"Wealth circulation over wealth extraction"** — the one absolute. Language and principle unchanged.
2. **The Locally Owned badge concept** — survives as one input to the impact scale (locality verification ladder remains).
3. **Anti-extraction diagnostic** — the five markers fold into the new impact-scoring methodology.
4. **People-first principle** — reframed from "local vs corporate" to "helpful vs harmful for humanity."
5. **Locality verification ladder** (business-jurisdiction.md) — Tier 0/1/2 stays as one input dimension.
6. **The structural refusal of corporate personhood** — Groups are FK'd to Members, not legal entities. This is load-bearing architecture, not just framing.
