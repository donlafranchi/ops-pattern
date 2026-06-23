---
purpose: Verification audit — dry-docs re-run after fix pass
layer: process
status: actionable
---

# dry-docs Verification Audit

**Date:** 2026-06-21
**Mode:** audit (report only — no files modified)
**Scope:** All non-foundation `.md` files under `product/`, `planning/`, `development/`, `standards/`, `playbooks/`, and root load-bearing set. Skipped `_attic/`, `archive/`, `done/`.

## BLUF

**Original audit:** 52 violations across 23 files (12 concepts).
**This verification:** 25 violations across 19 files (10 concepts).
**Net:** 27 violations resolved (52% reduction), 4 files fully cleared.

The fix pass cleaned the easy wins — single-paragraph restatements in high-traffic specs. What remains falls into three clusters: exploration docs that re-derive primitives for new verticals, system specs with multi-sentence Intent blocks that over-explain before linking, and review/scenario docs that re-explain concepts to show conformance checks passed.

## Delta Summary

| Metric | Original | Verification | Change |
|---|---|---|---|
| Total violations | 52 | 25 | -27 |
| Actionable violations | 46 | 24 | -22 |
| Router-exempt (CLAUDE.md) | 4 | 1 | -3 |
| Files with violations | 23 | 19 | -4 |
| Distinct concepts restated | 12 | 10 | -2 |

### Concepts fully cleared

- **role-as-verb** — 0 remaining (was 1)
- **discovery refusals** — 0 remaining (was 1)
- **thesis-page restatements** — 0 remaining (was 3)

### Concepts reduced but not cleared

| Concept | Was | Now | Source |
|---|---|---|---|
| no-business-entity | 11 | 4 | `primitives.md` |
| anti-Nextdoor / accountable-participation | 7 | 4 | `policy.md` |
| groups emergent/optional/chosen | 6 | 0 in isolation; folded into cooperative | `primitives.md` |
| no-separate-cooperative-entity | (counted under groups) | 4 | `primitives.md` |
| wealth-circulation | 5 | 2 | `principles.md` |
| fee-philosophy / earn-before-extract | 6 | 1 | `monetization.md` |
| no-ranking-of-people | 3 | 2 | `people-first.md` |
| no-engagement-optimized-feed | (counted under anti-Nextdoor) | 3 | `people-first.md` |
| five-markers-of-extraction | 1 | 1 | `impact-diagnostic.md` |
| people-first-principle | 2 | 0 | `people-first.md` |

### Possibly new violations (docs created after first audit)

Files that may not have existed during the original audit — violations in these are new introductions, not fix-pass failures:

- `product/exploration/local-stays.md` (2 violations)
- `product/exploration/mehko-home-kitchen.md` (1 violation)
- `product/exploration/reciprocity-and-goodwill.md` (1 violation)
- `planning/now/review-F036.md` (1 violation)
- `planning/now/review-F037.md` (1 violation)
- `planning/now/scenario-F039-maya-claims-locally-made.md` (1 violation)

That's 7 violations in potentially-new docs. Excluding these, the fix pass reduced the original 52 to ~18 — a 65% reduction on the docs it touched.

---

## Remaining Violations (25)

### Cluster 1 — System specs with multi-sentence Intent blocks (9)

These specs link to the foundation doc but then re-explain the concept in 2+ sentences anyway.

| # | File | Lines | Concept | Abbreviated text |
|---|---|---|---|---|
| 1 | `product/systems/location.md` | ~37 | anti-Nextdoor | "Not a complaint surface. The anonymous-complaint-feed failure mode is locatio…" |
| 2 | `product/systems/location.md` | ~265-267 | anti-Nextdoor | "The platform's accountable-participation posture lives in two places that bot…" |
| 3 | `product/systems/groups.md` | ~393 | anti-Nextdoor | "What's refused is auto-enrollment with addressability — putting Members into…" |
| 4 | `product/systems/groups.md` | ~410-416 | no-engagement-feed | "Two refusals here, both targeting the engagement-optimization failure mode…" |
| 5 | `product/systems/groups.md` | ~20, ~402 | no-separate-cooperative | "Cooperative-style coordination in the app (voting, distributions, governance…" |
| 6 | `product/systems/member.md` | ~30 | no-separate-cooperative | "cooperative-style coordination (co-owning, voting, distributing) is deferred…" |
| 7 | `product/systems/payments.md` | ~28-32 | wealth-circulation | "The rail is where the platform's single categorical 'Never' — wealth circulat…" |
| 8 | `product/systems/payments.md` | ~257-276 | fee-philosophy | "The platform collects transaction fees where feasible and non-extractive. The…" |
| 9 | `product/systems/impact-transparency.md` | ~36-37 | five-markers | "The five markers (profit-grows-when-cost-grows, durability suppressed, artifi…" |

**Fix pattern:** Compress to one-sentence pointer + `(see [concept](../foundation/{source}.md))`. Keep the system-specific implication; drop the concept re-derivation.

### Cluster 2 — Exploration docs re-deriving primitives (4)

Exploration docs that re-explain foundation concepts to frame a new vertical.

| # | File | Lines | Concept | Abbreviated text |
|---|---|---|---|---|
| 10 | `product/exploration/local-stays.md` | ~21-30 | four-primitives + role-as-verb | "Person (Member) — a real human who lives in a community and has a spare room…" |
| 11 | `product/exploration/local-stays.md` | ~38-42 | no-business-entity | "No property management companies. No corporate entities… The same structura…" |
| 12 | `product/exploration/mehko-home-kitchen.md` | ~41-43 | no-business-entity | "A MEHKO operator is a person doing work. No corporate shell, no franchise mod…" |
| 13 | `product/exploration/reciprocity-and-goodwill.md` | ~31-33 | no-engagement-feed | "The platform commits to no engagement-optimized feed, no pay-for-visibility…" |

**Fix pattern:** Open with "Applying the platform primitives (see `primitives.md`):" then list only the vertical-specific implications without re-defining Person/Item/Location.

### Cluster 3 — UI docs restating refusals (3)

| # | File | Lines | Concept | Abbreviated text |
|---|---|---|---|---|
| 14 | `product/ui/phase-0-ia-wireframes.md` | ~58-60 | anti-Nextdoor | "This is structurally different from an anonymous neighborhood feed: there is…" |
| 15 | `product/ui/phase-0-ia-wireframes.md` | ~101-102 | no-ranking-of-people | "No reviews, no ratings — the venue's value is shown through what happens ther…" |
| 16 | `product/ui/design-research-thesis.md` | ~362-365 | no-engagement-feed | "No red notification badges. No infinite scroll. No 'you have 3 unread' count…" |

**Fix pattern:** Pointer sentence + link. The UI-specific consequence (what the screen shows instead) stays; the why-we-refuse paragraph goes.

### Cluster 4 — Planning/playbook docs (6)

| # | File | Lines | Concept | Abbreviated text | Notes |
|---|---|---|---|---|---|
| 17 | `playbooks/DECISION-PATTERNS.md` | ~39-49 | wealth-circulation | "When a design move would route value out of the local economy to a third part…" | Borderline — worked applications may belong here |
| 18 | `playbooks/PLATFORM-PATTERNS.md` | ~70-73 | no-separate-cooperative | "Cooperative-coordination mechanics (voting, distributions, governance) defer…" | Two sentences in Intent block |
| 19 | `planning/now/review-F036.md` | ~40 | no-business-entity | "F036 creates a Group of People, not a Business entity. Items will FK to Membe…" | Review conformance check |
| 20 | `planning/now/review-F037.md` | ~60-61 | doxxing-prevention | "Tier 0 self-attested ZIP: helpful (locality discovery), not harmful (ZIP != a…" | Review conformance check |
| 21 | `planning/now/scenario-F039.md` | ~21 | two-signal design | "Owner residence answers 'does the money go to a local owner?'; product proven…" | Scenario rationale |
| 22 | `planning/now/bundle-1-themes.md` | ~265 | no-separate-cooperative | "What the platform does NOT do at b2.2: form the entity, hold money, draft by…" | Scope-boundary narration |

**Fix pattern for reviews:** State verdict + cite source. "Shell-entity smell: clean (per `primitives.md`)" not a paragraph re-deriving why.

### Cluster 5 — Capability + needs docs (2)

| # | File | Lines | Concept | Abbreviated text |
|---|---|---|---|---|
| 23 | `product/capabilities/group-create-join.md` | ~48-54 | no-separate-cooperative | "Cooperative-shape coordination is served by kind='business' Groups with multi…" |
| 24 | `product/needs/producer-roadmap.md` | ~87, ~215 | no-ranking-of-people | "Trust signals are factual claims… not aggregated opinion" (restated twice) |

### Router-exempt (1)

| # | File | Lines | Concept | Abbreviated text |
|---|---|---|---|---|
| 25 | `CLAUDE.md` | ~29-36 | four-primitives + no-business-entity + 4 more | "Person (Member) — a real human. Holds verbs…" through "…never auto-assigned." |

Router docs are exempt — the restatement is intentional for agent context-loading.

---

## Recommendations

1. **Next fix pass priority:** Cluster 1 (system specs) — highest traffic, most drift risk. 9 violations, all follow the same pattern: compress multi-sentence Intent blocks to one-sentence pointers.

2. **Exploration docs:** Consider a template rule — exploration docs open with `Applies: [primitives](../foundation/primitives.md), [people-first](../foundation/people-first.md)` header instead of re-deriving.

3. **Review docs:** Add a review-template convention — conformance checks cite source + verdict, not source + re-derivation + verdict.

4. **Borderline calls:** `DECISION-PATTERNS.md` V17 is borderline — the worked-application bullets may legitimately belong in the playbook as operationalizations. PM call.

5. **Drift watch:** `no-separate-cooperative-entity` is the most stubborn concept (4 violations, appeared in new docs after the fix pass). Likely needs an `explore`-level template fix so new docs don't re-derive it.

---

## Scorecard

| | Original | Verification | Target (zero) |
|---|---|---|---|
| Violations | 52 | 25 | 0 |
| Progress | — | 52% | 100% |

Next: `dry fix` on Cluster 1 (system specs, 9 violations) for the highest-impact second pass, or "expand" for line-level detail on any cluster.
