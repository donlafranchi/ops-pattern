# R05 — WHY merge: principles, design-philosophy, policy

**Phase:** 5 of 10 · **Repo:** parent · **Risk:** medium (content merge) · **Depends on:** R01–R04.

## Objective

The WHY layer (`product/foundation/`) has three docs doing one job — grading proposals — with `people-first.md` duplicating `foundational-principles.md` verbatim. Consolidate to a clean split: one constitution + test (`principles.md`), one research grounding (`design-philosophy.md`), one applied filter (`policy.md`).

This is **content work**. Produce a clean draft; flag anything you are unsure how to merge with `[PM: confirm]`. Do not drop a single unique commitment, principle, or refusal — when in doubt, keep it and flag it. The PM reviews the result.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`. Read all three source docs fully before writing anything.

### 1. Build `product/foundation/principles.md`

```
git mv product/foundation/foundational-principles.md product/foundation/principles.md
```

Then merge into it:
- **From `people-first.md`:** everything. It is one principle of the constitution, today duplicated almost verbatim — fold it in as a named principle/section, delete the duplication, keep the unique framing (the no-corporate-shell commitment, the FK-to-a-person rule).
- **From `community-design-philosophy.md`:** only the **decision rubric / scored test** — the part that grades a proposal. The five-section checklist and any "score every decision against this" machinery moves here so there is exactly one decision test in the repo.

Result: `principles.md` = P1–P8 (or the current principle set) + the people-first principle + the single binary decision test + categorical failures + the privacy/metrics/monetization baselines already there. One constitution.

```
git rm product/foundation/people-first.md     # content now lives in principles.md
```

### 2. Build `product/foundation/design-philosophy.md`

```
git mv product/foundation/community-design-philosophy.md product/foundation/design-philosophy.md
```

Strip it to the **theory grounding only** — the research basis (Dunbar / Ostrom / Putnam / Oldenburg / ICA / Cleveland Model / Mondragon) and the reasoning behind the rules. Remove the scored rubric (it moved to `principles.md` in step 1). Add a line near the top: "The decision test that operationalizes this theory lives in `principles.md`." This doc becomes the read-once "why the rules are the rules" reference.

### 3. Rename `policy-framework.md` → `policy.md`

```
git mv product/foundation/policy-framework.md product/foundation/policy.md
```

Content unchanged — it is the applied three-filter test (helpful? harmless? abuse-resistant?), distinct from the constitution. Just the rename.

### 4. Cross-reference sweep

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `foundational-principles.md` | `principles.md` |
| `people-first.md` | `principles.md` |
| `community-design-philosophy.md` | `design-philosophy.md` |
| `policy-framework.md` | `policy.md` |

`people-first.md` links should point at `principles.md` (optionally at its people-first section anchor). This sweep is broad — many specs cite these. Trust the grep. Edit live files only.

### 5. Verification

- `product/foundation/` contains: `principles.md`, `design-philosophy.md`, `policy.md`, `platform-promise.md`, `primitives.md`, and still `agent-assistance.md`, `loops.md`, `canonical-examples.md` (those three leave in R06/R08).
- `foundational-principles.md`, `people-first.md`, `community-design-philosophy.md`, `policy-framework.md` no longer exist.
- `rg --glob '!_attic/**' --glob '!web/**' 'foundational-principles|people-first|community-design-philosophy|policy-framework'` returns zero hits.
- `principles.md` contains exactly one decision test. `design-philosophy.md` contains no scored rubric.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add product/foundation/principles.md
git status
git commit -m "docs(consolidation): phase 5 — merge WHY layer into principles, design-philosophy, policy"
```

## Completion

Date: 2026-05-22 · Commit: `bcb6eb6` · Notes:

**Course correction mid-phase.** The original ticket plan was to *move CDP's rubric INTO principles.md and slim design-philosophy.md to theory only.* The PM intervened mid-phase: *"design philosophy is mostly good. just change or remove the part that doesn't align with the primitives and note that this color scheme [sic — scoring scheme] is subject to change if necessary to mention."* The rubric therefore stayed in design-philosophy.md; principles.md was rolled back from the rubric merge before the commit. Net result vs. ticket plan: people-first.md still folded into principles.md (per Section 2); design-philosophy.md kept its 5-section 0–3 rubric, modernized references (renamed file paths, primitive-aligned status banner), added subject-to-change note on the scoring scheme; policy.md is a pure rename. principles.md has 10 parts (renumbered after Part 4-rubric-removal).

**[PM: confirm] items left in the new docs:**

- `principles.md` Part 2 sub-section "Communities, too, are people-first" uses legacy "Community" terminology that pre-dates the 2026-05-10 Groups ratification. Substance applies equally to Groups; preserved verbatim per "do not drop a single unique commitment" rule.
- `principles.md` Part 6 (Self-Assessment of Existing System Specs) is anchored to a pre-primitives working set (`community.md`, `initiatives.md`, `service-provider.md` — all retired). Banner explicitly flags this; refresh against current spec set belongs in a post-R10 pass.
- `design-philosophy.md` Sections 1–5 use generic "community" / "communities" prose throughout (rubric-language, not primitive-reference); kept as-is per "mostly good" guidance. Reframe if the primitives terminology pivot needs to land there too.
- `design-philosophy.md` Section 5's "In the platform" callout says "no ad injection" — slightly inconsistent with the post-2026-05-12 narrower "engagement-shaped ad injection" framing in principles.md Part 4. Minor wording, easy fix.

**Files inside `product/systems/places.md` (still untracked, owned by another agent) reference `foundational-principles.md` and `policy-framework.md`** — those refs will resolve themselves when that file gets committed and the PM (or other agent) runs a path-update pass on it.

**Verification.** All four old filenames (`foundational-principles.md`, `people-first.md`, `community-design-philosophy.md`, `policy-framework.md`) return zero live-file hits via cross-reference sweep (excluding intentional provenance notes inside the new docs and the untracked `places.md`). `product/foundation/` now contains: `principles.md`, `design-philosophy.md`, `policy.md`, `platform-promise.md`, `primitives.md`, plus `agent-assistance.md` + `loops.md` + `canonical-examples.md` (those three leave in R06/R08).
