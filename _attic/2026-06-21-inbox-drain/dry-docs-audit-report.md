---
purpose: DRY audit — restatements of foundation-owned concepts in downstream docs
status: inbox
created: 2026-06-21
---

# dry-docs audit report

**52 violations across 23 files restating ~12 distinct concepts.**
4 router-exempt (CLAUDE.md). 2 borderline (playbook how-docs). 46 actionable.

**Top 3 most-restated concepts:**
1. No Business entity (primitives.md) — 11 violations across 8 files
2. Anti-Nextdoor commitments (policy.md) — 7 violations across 7 files
3. Groups are emergent/optional/chosen/not assigned (primitives.md) — 6 violations across 6 files

---

## By concept

### No Business entity
Source: `product/foundation/primitives.md` § Why no Business entity

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/groups.md` | ~31-34 | load-bearing | "This is the platform's structural refusal of corporate personhood. US law treats LLCs..." |
| `product/systems/groups.md` | ~354-356 | load-bearing | "items.member_id NOT NULL is the schema-level enforcement of the no-imperso..." |
| `product/systems/groups.md` | ~462-463 | load-bearing | "The structural refusal of corporate personhood is encoded throughout. Items always FK..." |
| `product/systems/location.md` | ~39 | cosmetic | "Not a Business. A storefront is a Location. The Member who operates there is a Membe..." |
| `product/systems/member.md` | ~30-31 | load-bearing | "A Member is not a business. Per principles.md, there is no Business entity in the..." |
| `product/systems/member.md` | ~706-708 | load-bearing | "One Member per real human, no role column, no Business shell. The temptation will be..." |
| `product/systems/item.md` | ~278 | cosmetic | "Finally: no Business entity. A Person's Items belong to that Person, filed optionally..." |
| `product/ui/phase-0-ia-wireframes.md` | ~90 | cosmetic | "because a Person who makes sourdough is still a Person, not a Business..." |
| `planning/now/mvp-goal.md` | ~77 | load-bearing | "Business serves people, not the other way around. No Business entity, no business_..." |
| `planning/now/plan-b1-surface-sequence.md` | ~99 | load-bearing | "Business serves people, not the other way around. No Business entity. No business_..." |
| `planning/now/bundle-1.md` | ~32 | cosmetic | "Cooperative-style coordination deferred until real-world need..." |

### Anti-Nextdoor commitments
Source: `product/foundation/policy.md` § The anti-Nextdoor commitments

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/location.md` | ~37 | load-bearing | "Not a complaint surface. This is the structural anti-Nextdoor commitment. Nextdoor's..." |
| `product/systems/location.md` | ~93-94 | cosmetic | "the structural prevention lives in the messaging-scope and complaint-downvote commit..." |
| `product/systems/location.md` | ~265-267 | load-bearing | "The platform's anti-Nextdoor posture lives in two places that both sit outside Locat..." |
| `product/systems/action-layer.md` | ~38-44 | cosmetic | "The closed-world property is load-bearing: anti-Nextdoor commitments (per policy.md)..." |
| `product/ui/community-platform.md` | ~66 | cosmetic | "The locality-aware-but-not-Location-scoped property is structural: the feed surfaces..." |
| `planning/now/bundle-1.md` | ~20 | cosmetic | "The anti-Nextdoor commitment lives in messaging scope, not in absence of Member-L..." |
| `planning/backlog/initiative-phase-3-explore-no-login-index.md` | ~25 | cosmetic | "Anti-Nextdoor: no comments, no Location-scoped messaging visible to anon..." |

### Groups are emergent/optional/chosen/not assigned
Source: `product/foundation/primitives.md` § Group

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/needs/use-cases.md` | ~208-210 | cosmetic | "The 'Groups cannot be auto-assigned' boundary holds — geography is suggestion, the c..." |
| `product/capabilities/group-create-join.md` | ~5-12 | load-bearing | "Groups are emergent and self-selected — never auto-assigned by polygon or attendance..." |
| `product/ui/phase-0-ia-wireframes.md` | ~96 | cosmetic | "Groups are emergent, not prerequisite — the page exists because people chose to form..." |
| `planning/now/mvp-goal.md` | ~78 | load-bearing | "Groups are emergent, optional, never auto-assigned. The platform never enrolls a Me..." |
| `planning/now/plan-b1-surface-sequence.md` | ~100 | load-bearing | "Groups are emergent, optional, never auto-assigned. The platform never enrolls a Me..." |
| `CLAUDE.md` | ~34 | router-exempt | "A named, intentional, self-selected set of People organized to do things together..." |

### Wealth circulation over extraction (the one absolute)
Source: `product/foundation/principles.md` (the one refusal); applied via `playbooks/DECISION-PATTERNS.md`

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/payments.md` | ~28-36 | load-bearing | "The single 'Never' of the project, restated for clarity: We will never support extra..." |
| `product/systems/impact-transparency.md` | ~369-371 | cosmetic | "The wealth-circulation absolute — the platform's single categorical 'Never' — applie..." |
| `product/needs/member-journey.md` | ~94 | cosmetic | "This is where the squeeze is most directly answered: ownership concentration is the..." |
| `AGENTS.md` | ~134 | cosmetic | "The single absolute — wealth circulation over wealth extraction — is invoked only wh..." |
| `playbooks/DECISION-PATTERNS.md` | ~39-49 | borderline | "There is exactly one categorical commitment in this project: prefer wealth circulati..." |

### Role-as-verb not role-as-identity
Source: `product/foundation/primitives.md` § Person

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/member.md` | ~28-29 | cosmetic | "A Member is not a role. Per primitives.md, the platform models verbs, not identiti..." |

### No ranking of people / treatment reviews
Source: `product/foundation/people-first.md` § The Corollaries

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/needs/producer-roadmap.md` | ~87-88 | cosmetic | "Ratings or star scores of any kind. Per principles.md — the platform does not rank..." |
| `product/needs/producer-roadmap.md` | ~215 | cosmetic | "Star ratings or numeric scores. Per principles.md — the platform does not rank peo..." |
| `product/ui/phase-0-ia-wireframes.md` | ~102 | cosmetic | "No reviews, no ratings — the venue's value is shown through what happens there..." |

### People-first principle
Source: `product/foundation/people-first.md`

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/impact-transparency.md` | ~363-365 | cosmetic | "The people-first principle — the platform exists to serve the people who work, not..." |
| `product/ui/phase-0-ia-wireframes.md` | ~90 | cosmetic | "This is the people-first principle in code: every page traces to a Person..." |

### Five markers of extraction
Source: `product/foundation/impact-diagnostic.md` (explicit `owns:`)

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/impact-transparency.md` | ~366-367 | cosmetic | "The anti-extraction diagnostic — five markers of extraction (fee opacity, data resal..." |

### Fee philosophy / earn-before-extract / revenue refusals
Source: `product/foundation/monetization.md` + `principles.md`

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/payments.md` | ~262-266 | load-bearing | "The platform collects transaction fees where feasible and non-extractive. The shape..." |
| `product/systems/payments.md` | ~276-282 | cosmetic | "Visibility fees, ranking fees, promoted listings — categorically excluded per princi..." |
| `product/systems/payments.md` | ~493-498 | load-bearing | "Non-extractive fee shapes on Member-to-Member commerce. The line every comparable pl..." |
| `product/systems/producer-tools.md` | ~310-314 | cosmetic | "No ad sales or sponsored placement. The whole point is to give producers leverage w..." |
| `product/systems/agent-assistance.md` | ~46-49 | cosmetic | "A toggle ('enable advanced assistant context') would let any Member opt into chains..." |
| `product/needs/producer-roadmap.md` | ~192-195 | cosmetic | "Platform-custodied funds for the platform's own benefit. Per payments.md... Platform..." |

### The four primitives
Source: `product/foundation/primitives.md`

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `planning/now/mvp-goal.md` | ~14 | load-bearing | "A coordination layer for a place — a Person declares an Item (product, service, ga..." |
| `planning/now/mvp-goal.md` | ~76 | load-bearing | "Person declares Item at Location; other Persons respond. People form Groups when th..." |
| `planning/now/plan-b1-surface-sequence.md` | ~98 | load-bearing | "Person declares Item at Location; other Persons respond. People form Groups when th..." |
| `CLAUDE.md` | ~30-34 | router-exempt | "Person (Member) — a real human. Holds verbs... Item — anything declared... Location..." |

### Three-filter test / opt-out default
Source: `product/foundation/policy.md`

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `playbooks/PLATFORM-PATTERNS.md` | ~60-62 | borderline | "Every policy surface (data sharing, revenue, monetary flow, visibility, agent action..." |

### Discovery refusals (no ranking by business size)
Source: `product/foundation/principles.md`

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `product/systems/discovery.md` | ~19-21 | cosmetic | "Never rank by business size, follower count alone, or anything that amplifies corpor..." |

### Thesis-page public-facing restatements
Source: multiple foundation docs

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `planning/backlog/initiative-phase-3-thesis-page.md` | ~29-31 | cosmetic | "What we commit to. The non-negotiables — no platform fees on Member commerce, n..." |
| `product/needs/member-journey.md` | ~18 | cosmetic | "The platform exists so ordinary people can take ownership of their economic and civi..." |
| `product/needs/member-journey.md` | ~23-28 | cosmetic | "This platform is not designed to grow like Facebook. It does not need to absorb ever..." |

### Lexicographic close-call rule
Source: `playbooks/DECISION-PATTERNS.md`

| File | Lines | Severity | Text (abbreviated) |
|---|---|---|---|
| `AGENTS.md` | ~127-134 | cosmetic | "Apply the lexicographic rule from DECISION-PATTERNS.md: 1. Member safety 2. Platfo..." |

---

## By file (most violations first)

| File | Violations | Concepts restated |
|---|---|---|
| `product/systems/payments.md` | 4 | Wealth circulation (1), Fee philosophy (3) |
| `product/systems/location.md` | 4 | Anti-Nextdoor (3), No Business entity (1) |
| `planning/now/mvp-goal.md` | 4 | Four primitives (2), No Business entity (1), Groups emergent (1) |
| `product/systems/groups.md` | 3 | No Business entity (3) |
| `product/systems/member.md` | 3 | Role-as-verb (1), No Business entity (2) |
| `product/systems/impact-transparency.md` | 3 | People-first (1), Five markers (1), Wealth circulation (1) |
| `product/needs/member-journey.md` | 3 | Everything serves people (1), Federation (1), Wealth circulation (1) |
| `product/needs/producer-roadmap.md` | 3 | No ranking (2), Fee philosophy (1) |
| `product/ui/phase-0-ia-wireframes.md` | 3 | People-first/No Business (1), Groups emergent (1), No ranking (1) |
| `planning/now/plan-b1-surface-sequence.md` | 3 | Four primitives (1), No Business entity (1), Groups emergent (1) |
| `CLAUDE.md` | 4 | Four primitives (1), Anti-Nextdoor (1), Groups emergent (1), No Business (1) — all router-exempt |
| `AGENTS.md` | 2 | Lexicographic rule (1), Wealth circulation (1) |
| `planning/now/bundle-1.md` | 2 | Anti-Nextdoor (1), No Business entity (1) |
| `product/systems/action-layer.md` | 1 | Anti-Nextdoor (1) |
| `product/systems/agent-assistance.md` | 1 | Earn-before-extract (1) |
| `product/systems/discovery.md` | 1 | Discovery refusals (1) |
| `product/systems/item.md` | 1 | No Business entity (1) |
| `product/systems/producer-tools.md` | 1 | Revenue refusals (1) |
| `product/capabilities/group-create-join.md` | 1 | Groups emergent (1) |
| `product/needs/use-cases.md` | 1 | Groups emergent (1) |
| `product/ui/community-platform.md` | 1 | Anti-Nextdoor (1) |
| `planning/now/bundle-1-themes.md` | 1 | P1 lightweight/evolvable (1) |
| `planning/backlog/initiative-phase-3-thesis-page.md` | 1 | Multiple foundation concepts (1) |
| `planning/backlog/initiative-phase-3-explore-no-login-index.md` | 1 | Anti-Nextdoor (1) |
| `playbooks/DECISION-PATTERNS.md` | 1 | Wealth circulation (borderline) |
| `playbooks/PLATFORM-PATTERNS.md` | 1 | Three-filter test (borderline) |

---

## Recommendations

### 1. Foundation docs needing `owns:` frontmatter

Only `impact-diagnostic.md` has an explicit `owns:` field. Add to:

| Foundation doc | Suggested `owns:` entries |
|---|---|
| `principles.md` | `member-flourishing`, `everything-serves-people`, `wealth-circulation-over-extraction`, `the-decision-test` |
| `primitives.md` | `four-primitives`, `no-business-entity`, `groups-emergent-optional-chosen`, `role-as-verb`, `four-build-clusters` |
| `policy.md` | `three-filter-test`, `opt-out-default`, `anti-nextdoor-commitments`, `owner-only-rls-member-geography` |
| `people-first.md` | `people-first-principle`, `no-ranking-of-people`, `three-part-question`, `social-capital-anchored-on-member` |
| `metrics.md` | `flourishing-measurement`, `anti-metrics`, `flourishing-failure-states` |
| `monetization.md` | `multi-source-revenue`, `no-vc`, `earn-before-extract`, `constrained-advertising`, `revenue-refusals` |
| `platform-promise.md` | `producer-commitments`, `fee-philosophy`, `relationships-belong-to-you`, `never-pay-for-visibility` |
| `community-health-rubric.md` | `scored-rubric`, `community-ownership-arc` |

### 2. Concepts without a clear source-of-truth doc

All major concepts trace to an existing foundation doc. No orphan concepts found.

### 3. Priority fixes

**Load-bearing (fix first — drift here causes confusion):**
- `payments.md` wealth-circulation restatement (lines ~28-36) — self-labels as "restated for clarity" but will drift from the authoritative version in `principles.md`
- `groups.md` three restatements of no-Business-entity — each carries slightly different framing; already drifting from `primitives.md` canonical version
- `mvp-goal.md` + `plan-b1-surface-sequence.md` — near-identical "Non-negotiables" block duplicated verbatim; fix once in `mvp-goal.md`, pointer from sequence doc
- `group-create-join.md` — "This is a hard constraint, not a preference" restates `primitives.md` with emphasis that could drift

**Cosmetic (clean up when touching the file):**
- Everything else. Most are one-paragraph context blocks that re-explain before linking. Replace the explanation with a one-sentence pointer; keep the contextual sentence.

### 4. CLAUDE.md assessment

The 4 router-exempt violations are **stable pointers** with one drift risk: the Group summary dropped the canonical third pair ("chosen, not assigned"), saying only "Emergent and optional." A pointer table would be more stable than prose summaries, but the current form is functional for routing. No urgent action.

### 5. Pattern observation

The "Non-negotiables" block (3 bullets: primitive grammar, no-Business, Groups-emergent) appears verbatim in `mvp-goal.md` and `plan-b1-surface-sequence.md`. The cleanest fix: keep it in `mvp-goal.md`, replace in `plan-b1-surface-sequence.md` with "Non-negotiables per [`mvp-goal.md`](mvp-goal.md) § Non-negotiables." Even the surviving copy should tighten to one-sentence pointers with foundation-doc links.
