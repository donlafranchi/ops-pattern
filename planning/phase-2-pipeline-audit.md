---
purpose: Checklist of pipeline updates needed after Phase 2 scenario strategy changes (2026-05-27).
layer: how
status: active
---

# Phase 2 Pipeline Audit — What Needs Updating

**Date:** 2026-05-27
**Trigger:** Three new patterns introduced: "Capabilities unlocked" sections in scenarios, build-status column in `use-cases.md`, and `producer-capability-taxonomy.md`.

---

## Checklist

### 1. Scenario template — add "Capabilities unlocked" section

**File:** `skills/scope/templates/scenario.md`
**What:** The template ends at `## Out of Scope`. Add a `## Capabilities unlocked` section after it. Each bullet: one capability a member gains when this scenario ships. This is what makes capabilities grep-able across scenarios.
**Who:** PM manual edit.
**Priority:** High — every scenario written from this template will lack the section until fixed.
**Status:** ☐ TODO

### 2. AGENTS.md § scope — add read entry for producer taxonomy

**File:** `AGENTS.md`, line ~96 (the `scope` reads list)
**What:** Add `product/needs/producer-capability-taxonomy.md` to the `scope` reads list. The scope skill needs to know what producer capabilities exist (Now/Later/Won't) when writing producer-facing scenarios to avoid scope creep into "Won't" territory.
**Who:** PM manual edit.
**Priority:** Medium — prevents scope from accidentally writing scenarios for capabilities the taxonomy marks as "Won't."
**Status:** ☐ TODO

### 3. CLAUDE.md — add producer taxonomy to authoritative docs table

**File:** `CLAUDE.md`, "Project-specific authoritative docs" table
**What:** Add row: `product/needs/producer-capability-taxonomy.md` | "Anything producer-capability-shaped — the Now/Later/Won't taxonomy by business function. Read when scoping or reviewing producer-facing scenarios."
**Who:** PM manual edit.
**Priority:** Medium — without this, agents don't know the doc exists.
**Status:** ☐ TODO

### 4. REGISTRY.md — add entries for new files

**File:** `REGISTRY.md`
**What:** Add two entries:
- `product/needs/producer-capability-taxonomy.md` — layer: what, status: active, purpose: "Producer capabilities organized by business function — Now/Later/Won't across 10 categories."
- `planning/phase-2-scenario-strategy.md` — layer: how, status: draft, purpose: "Strategy for structuring Phase 2 scenarios before writing begins."
**Who:** `tidy` (REGISTRY maintenance is its job).
**Priority:** Medium.
**Status:** ☐ TODO

### 5. MAP.md — add producer taxonomy to Needs section

**File:** `product/MAP.md`
**What:** Add `producer-capability-taxonomy.md` alongside `use-cases.md`, `member-journey.md`, `people.md`, `needs.md` in the Needs section. One sentence: "Producer capabilities by business function — what the platform offers now, later, and won't."
**Who:** `tidy` or PM manual edit.
**Priority:** Low.
**Status:** ☐ TODO

### 6. Use-cases.md build-status — wire into pipeline

**File:** `product/needs/use-cases.md` (the Build column added today)
**What:** No pipeline wiring needed *now*. The build-status column is a PM-maintained indicator, not an automated gate. When a scenario ships (moves through `build` → tests pass), PM manually updates the use-case's build status from ⬜→🟨→🟩. This is analogous to how STAGE-LEDGER is manually stamped. Consider automating at b2 if the manual update becomes a bottleneck.
**Who:** PM (manual, at scenario ship time).
**Priority:** None — no action needed. Documenting the decision not to automate.
**Status:** ☐ N/A

### 7. TRACE.md — no update needed

**File:** `product/TRACE.md`
**What:** TRACE tracks need→ticket lineage. The producer taxonomy is a classification artifact, not a feature in the pipeline. The phase-2 strategy doc is a planning artifact. Neither needs a TRACE entry.
**Status:** ✓ No action.

### 8. STAGE-LEDGER.md — no conflict

**File:** `planning/STAGE-LEDGER.md`
**What:** The build-status column in `use-cases.md` (🟩/🟨/⬜ per use-case) is orthogonal to STAGE-LEDGER (pipeline stage per F-number). No overlap, no conflict.
**Status:** ✓ No action.

---

## Summary

| # | File | Action | Who | Priority |
|---|---|---|---|---|
| 1 | `skills/scope/templates/scenario.md` | Add `## Capabilities unlocked` | PM | High |
| 2 | `AGENTS.md` | Add taxonomy to `scope` reads | PM | Medium |
| 3 | `CLAUDE.md` | Add taxonomy to authoritative docs table | PM | Medium |
| 4 | `REGISTRY.md` | Add entries for 2 new files | `tidy` | Medium |
| 5 | `product/MAP.md` | Add taxonomy to Needs section | `tidy` / PM | Low |
| 6 | `use-cases.md` build column | Manual update at ship time; no automation | PM | N/A |
| 7 | `product/TRACE.md` | No action | — | — |
| 8 | `planning/STAGE-LEDGER.md` | No action | — | — |

Items 1–3 should land before the next `scope` session so scenario-writing picks up the new pattern. Items 4–5 can ride the next `tidy` sweep.
