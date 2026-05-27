---
purpose: 2026-05-23 absorption pass — source materials for the end-to-end pipeline coverage effort.
layer: how
status: complete
---

# 2026-05-23 Pipeline Coverage Absorption

> The work product from the 2026-05-23 absorption pass. Three input docs were folded into the live pipeline; this directory preserves them for trace.
>
> **Status:** complete. The findings are now load-bearing in `CLAUDE.md`, `AGENTS.md`, `planning/STAGE-LEDGER.md`, `planning/SPEC-PATCHES.md`, `planning/JUDGMENT.md`, `planning/OPEN-QUESTIONS.md`, and the seven pipeline-skill workflows. Do not cite these source docs as live authority — cite the absorbed location instead.

## Source materials

| File | What it is | Absorbed into |
|---|---|---|
| `pipeline-process-audit-2026-05-22.md` | Second audit of the agent pipeline (~2 weeks after the 2026-05-09 audit). Identified R1–R10. | `STAGE-LEDGER.md` (R4), `SPEC-PATCHES.md` (R5), substrate lane in `pipeline-ticket` (R3), drift check in `pipeline-router` (R1), DEVIATIONS rotation policy (R6), sibling-scenario check in `pipeline-review` (R9), cleanups (R8). |
| `agent_response_techniques.html` | Decision matrix — four moves to shrink the founder bottleneck (triage upstream, constraint-first elicitation, standing defaults, compression). | `planning/JUDGMENT.md` § Agent response discipline. |
| `human_judgment_document_architecture.html` | Three-layer judgment doc design (Intent / Bounds / Casebook) + refinement loop. | `planning/JUDGMENT.md` (the whole structure). |

## Why this directory exists and not `_attic/`

`_attic/` is for **superseded specs** — docs that were once live in `product/` or `planning/` and got replaced. These three were **work-product drafts** that got absorbed into the pipeline. `housekeeping/` is the right archive for completed meta-work efforts.

Pattern: `housekeeping/YYYY-MM-DD-{slug}/` per discrete consolidation or absorption effort. Predecessor: `housekeeping/doc-consolidation-2026-05/`.
