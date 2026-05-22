# pipeline-intent-check — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | The target file(s): one or more of `product/foundation/*.md`, `product/systems/*.md`, `planning/DECISIONS.md` (ADR text), or a pipeline-doc that has just changed. Also reads [the archived intent audit](../../planning/archive/intent-audit-2026-05-12.md) for the eight categories. |
| **Writes** | One review file: `planning/reviews/intent-{target}-{YYYY-MM-DD}.md`. The `{target}` slug is the filename (e.g., `groups`, `policy-framework`, `ADR-18`). |
| **Templates** | Review-file template at the bottom of this doc; proposed-Intent shape inline per category. |
| **Hands to** | nothing — the PM lands or defers. Re-run after landing. |

## Output

A single review file with a top-line verdict (**CLEAN** / **PROPOSE** / **BLOCK**) and, for each flagged statement, the line in question + the category it matches + a proposed Intent line in the audit's voice. No edits to the target file are made by this skill.

## Process

### 1. Scope — what is being checked?

The user names the target. Three shapes:

- **One file** — "intent check on systems/groups.md" or "intent check on ADR-18."
- **A feature's docs** — "intent check on F034." Walk the scenario(s) under `planning/scenarios/F034-*.md` → identify which foundation or system docs they touch → check those.
- **A directory** — "intent check on foundation/." Treat every `.md` file in the directory as a target; emit one review file per target or one rolled-up file (ask the PM, default = rolled-up for foundation-wide passes).

If the target is unclear, ask once. Do not silently expand scope.

### 2. Re-read the audit categories

Before scanning, re-read [the archived intent audit](../../planning/archive/intent-audit-2026-05-12.md) §"Categories of statements that need Intent." The eight categories are the *only* shapes this skill flags. If a missing rationale doesn't fit one of the eight, do not flag it — the audit exists to keep the convention bounded.

The eight, abbreviated:

1. **Numeric thresholds, caps, expiries, defaults** — any unjustified number.
2. **Refusals, negations, "deliberately no X"** — every "we will NOT do this" needs a local Intent so the chain to the strong-form rationale is one-step.
3. **Schema / URL / UI naming splits** — every place the three-layer mapping introduces a split that reads arbitrary.
4. **Tier assignments (T1 / T2 / T3)** — every deferral that's *scope discipline* vs. *prerequisite-blocked* and not labeled which.
5. **Required vs optional vs nullable** — every constraint that encodes identity vs incidental.
6. **Behavioral defaults (boolean defaults, opt-in vs opt-out)** — every toggle whose default exceptions the general posture.
7. **Cross-doc structural commitments stated locally** — every "per ADR-N" or "the anti-Nextdoor commitment" reference whose *local* contribution isn't named.
8. **"Mirrors" / "Parallels" / "Same as" claims** — every structural-symmetry claim whose *why preserve the symmetry* is implicit.

### 3. Scan — locate candidate statements

For each target file, walk top-to-bottom. For every statement that matches one of the eight shapes:

1. Note the line(s).
2. Identify the category (1–8).
3. Check whether an Intent annotation (inline `**Intent:**` or block-quoted `> **Intent:**`) is *adjacent* (immediately following on the next non-blank line, indented under the same bullet, or in the same `> ` block).
4. If present and substantive — fine. Skip.
5. If present but vacuous ("this is important," "for safety," "by design") — flag as **shallow Intent**. Same posture as missing.
6. If absent — flag as **missing Intent**.

A statement is *substantive* when the Intent line tells a downstream agent **how to break ties when the literal rule doesn't cover the case**. "Don't change this number — it was tuned for X" is substantive. "This is important for the platform" is not.

Be conservative. Better to over-flag and let the PM dismiss than to under-flag and let a load-bearing decision drift.

### 4. Propose Intent shapes

For each flagged statement, propose a one-line Intent shape, structured as:

```
**Intent:** {what the decision is protecting against} — {how a downstream agent should reason about it} — {when the rule's literal wording doesn't apply, this is the disposition}.
```

Match the audit's voice: declarative, structural, anchored in *what failure mode this prevents* rather than *why this is good*. Do not paste the audit's proposed lines verbatim if the audit already wrote one — instead, cite "see the archived intent audit §`{file}`" and recommend the audit's wording be used.

For Category 1 (numeric thresholds), propose the shape that names which side of the range matters and why:

```
**Intent:** {N} is {load-bearing | a hand-tune | a placeholder} because {load-bearing-reason | tuning-context | data-needed-to-finalize}. Adjust only when {condition}.
```

For Category 2 (refusals), do **not** propose Intent inline in this skill's review file. Per the corrected addendum in the archived intent audit (2026-05-12, revised same-day), there is no purely-categorical refusal in this project — every absolute deserves PM-ratified Intent (and possibly bullet revision), which requires the interactive walk pattern this skill cannot provide. **Hand off Category-2 candidates to `pipeline-ratify-absolute`** — list each in the review file under a "Category 2 escalations" section with file:line and the surface text, and direct the PM to invoke `pipeline-ratify-absolute` on the file. The clarify-absolutes skill walks each statement interactively; this skill's job for Category 2 is detection + escalation, not proposal.

For Category 7 (cross-doc commitments stated locally), propose the local-contribution clause:

```
**Intent:** {`per ADR-N` / `the X commitment`} is enforced *here* by {specific surface this doc owns}; the broader commitment is enforced across {other surfaces} per {their docs}.
```

### 5. Assign verdict

- **CLEAN** — zero missing Intent annotations of substance AND zero unannotated Category-2 absolutes.
- **PROPOSE** — one or more missing Intent annotations on Categories 1, 3, 4, 5, 6, 7, or 8. PM lands the proposed lines; pipeline proceeds.
- **ESCALATE** — at least one Category-2 absolute (refusal / negation / "deliberately no X") is unannotated or carries a shallow Intent. Downstream pipeline pauses until the PM walks the Category-2 candidates through `pipeline-ratify-absolute`. The review file lists the Category-2 escalations; the clarify-absolutes skill ratifies each interactively.
- **BLOCK** — at least one missing Intent on a non-Category-2 *load-bearing* structural decision (a schema-level commitment in Categories 5 or 8, or a cross-doc commitment in Category 7 whose local scope is unclear). Downstream pipeline pauses until the Intent line lands directly.

A decision is load-bearing if forgetting it would create silent contradiction with another live decision (the same test `pipeline-prune` uses to identify silently-load-bearing decisions). For Category 2, *every* statement is treated as load-bearing — the ESCALATE verdict applies whenever any Category-2 absolute lacks substantive Intent. The earlier "categorical refusal can pass without Intent" outcome is removed per the archived intent audit's revised addendum.

### 6. Write the review file

One file per run, at `planning/reviews/intent-{target}-{YYYY-MM-DD}.md`. The template:

```markdown
# Intent check — {target}

**Date:** YYYY-MM-DD
**Target:** {file path(s) or feature ID}
**Verdict:** **CLEAN** | **PROPOSE** | **BLOCK**

{One-paragraph summary: scope checked, count of flags by category, headline finding.}

---

## Flagged statements

### 1. {file}:{line} — Category {N} ({short category name})

> {Exact quote from the target, ≤200 chars. Use ellipsis if longer.}

**Why flagged.** {One sentence: which shape this matches and why the Intent is missing/shallow.}

**Proposed Intent.**
> **Intent:** {proposed line in the audit's voice, ≤2 sentences.}

**Load-bearing?** Yes / No. {One sentence on which way the contradiction would point if forgotten.}

---

{repeat per flag}

---

## Notes for the PM

{Anything cross-cutting: patterns across flags, a single load-bearing miss that drives the BLOCK verdict, recommended consolidation if multiple flags share an Intent.}

## Re-run after

{What needs to land before re-running. Usually: "PM lands or revises proposed Intent lines for flags 1, 3, 5; then re-run."}
```

### 7. Verify

Before declaring done:

- The review file exists at `planning/reviews/intent-{target}-{YYYY-MM-DD}.md` and renders.
- The verdict line at the top matches the body (a BLOCK verdict must have at least one Yes-load-bearing flag; a CLEAN verdict has zero flags).
- Each flagged statement quotes the target exactly (no paraphrasing) so the PM can search-and-find the line.
- Each proposed Intent line is in the audit's voice — anchored in failure mode, not in "this is good design."
- No edits to the target file have been made by this skill.
- If the target was a pipeline-doc change (a PR-style diff) and the verdict is BLOCK, the review file is referenced from the PR / JOURNAL entry / DECISIONS row that introduced the change. Surface this to the PM if the cross-link is missing.

## What this skill does NOT do

- Write Intent lines into the target file. (Proposes; PM lands.)
- Edit code, BUILD-LOG.md, or scenario files.
- Re-litigate the audit's categories. The eight shapes are the bounded surface; if a statement doesn't match, this skill says nothing.
- Run during an open pipeline phase. Out-of-band only — surface and defer.
