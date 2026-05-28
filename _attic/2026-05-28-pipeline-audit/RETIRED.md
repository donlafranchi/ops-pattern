---
purpose: Provenance for the Phase 2 pipeline audit (drafted + resolved + archived 2026-05-27 / 2026-05-28).
layer: how
status: archived
retired_from: planning/phase-2-pipeline-audit.md
---

# phase-2-pipeline-audit.md — archived 2026-05-28

## What's here

The pipeline audit checklist drafted 2026-05-27 to wire three new patterns into the pipeline: scenario template `## Capabilities unlocked` section, build-status column in `use-cases.md`, and `producer-capability-taxonomy.md`. 8 items total — 5 actionable, 3 declared no-action at audit time.

## Why archived

All items resolved. No work remaining.

| # | Item | Resolution |
|---|---|---|
| 1 | scenario template `## Capabilities unlocked` | ☑ DONE — template line 68 carries the section with required-marker + taxonomy-tracing instructions (commit `dd2df49`). |
| 2 | AGENTS.md `scope` reads list | ☑ DONE — AGENTS.md line 96 names `producer-capability-taxonomy.md` as mandatory `scope` reading with "Won't"-refusal note. |
| 3 | CLAUDE.md authoritative-docs row | ☑ DONE — CLAUDE.md line 208 carries the row. |
| 4 | REGISTRY.md entries (taxonomy + strategy doc) | ☑ DONE — REGISTRY.md lines 47 + 142 carry both entries; strategy doc status updated to `active` 2026-05-28. |
| 5 | MAP.md Needs section | ☑ DONE — MAP.md line 35 carries the taxonomy. |
| 6 | use-cases.md build-status pipeline wiring | ✓ N/A — manual PM update at scenario ship time; no automation needed at b1. |
| 7 | TRACE.md update | ✓ N/A — taxonomy is a classification artifact, not a pipeline feature. |
| 8 | STAGE-LEDGER.md conflict check | ✓ N/A — build-status column (per use-case) is orthogonal to STAGE-LEDGER (per F-number). |

Items 1–5 verified in place 2026-05-28. Items 6–8 declared no-action at audit time (2026-05-27).

## Lesson learned

The original audit was itself a "big plan with mixed-state items" — left as a single doc with checkbox-style status would have been hard to track once partially completed. The current archival reflects the project's atomization principle: when items resolve, the meta-doc archives.

## Don't cite this as live

Cite the resolved-in-place files directly:
- `skills/scope/templates/scenario.md` for the `## Capabilities unlocked` pattern
- `AGENTS.md` line 96 for `scope` reads
- `CLAUDE.md` line 208 for the authoritative docs entry
- `REGISTRY.md` for the registry entries
- `product/MAP.md` line 35 for the taxonomy in the Needs section
