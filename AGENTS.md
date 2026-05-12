# AGENTS.md — Development Pipeline

> Project-wide pipeline definition. Lives at root (alongside `CLAUDE.md` and `JOURNAL.md`) because it describes agents that work across `product/`, `planning/`, `development/`, and `web/` — it is not a planning-stage concern. See [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) for the rationale and the full audit.

Seven specialized roles handle the full development lifecycle. Each is implemented as a skill in [`skills/`](skills/) and routed by `pipeline-router`. Process lives in skills, not in nested CLAUDE.md files.

## Pipeline Overview

```
Product (dream) → Planning (filter) → Review (pre-flight, optional) ──┐
                                                                       ├→ Build (execute) → Eval-run (verify)
                                            Eval-write (oracle) ───────┤
                                            Ticket (sequence) ─────────┘
```

The PM cycle is strict. Each role has one input, one output, and explicit firewalls. **Review** is optional but strongly recommended for any scenario that introduces a new surface, component, event type, or schema. **Eval-write** and **Ticket** run in parallel from the approved scenario; both feed Build.

For a worked example tracing F018 through every role with real artifacts at each stage, see [`planning/walkthroughs/F018-pipeline-trace.md`](planning/walkthroughs/F018-pipeline-trace.md).

## 0. Router

**Skill:** `pipeline-router`
**Model:** Claude Sonnet (orientation, no production work)

**Reads:**
- Root `CLAUDE.md`
- `JOURNAL.md`
- `planning/bundles/{active}.md`

**Task:** Session-start orientation. Identify what the user wants and route to the right downstream skill.

---

## 1. Product Agent

**Skill:** `pipeline-product`
**Model:** Claude Opus (creative, comprehensive)

**Reads:**
- `product/foundation/` (loops, primitives, people-first, canonical-examples)
- `product/exploration/`
- `product/specs/`

**Writes:**
- `product/capabilities/`
- `product/systems/` (with mandatory "Data model implications" section)
- `product/surfaces/`
- `product/exploration/`
- `product/templates/`
- `product/foundation/canonical-examples.md` (extends with new real situations)

**Does NOT Read:**
- `planning/`
- `development/`
- `web/`

**Task:** Explore unconstrained. Write tiered systems (T1/T2/T3), capabilities, product files. Refuses to prioritize, write tickets, or write scenarios — those are downstream.

---

## 2. Scenario Writer (Planning)

**Skill:** `pipeline-plan`
**Model:** Claude Opus (filter, comprehensive)

**Reads:**
- `product/foundation/canonical-examples.md` (mandatory anchor)
- `product/foundation/loops.md`
- `product/foundation/primitives.md`
- `product/systems/`
- `product/capabilities/`
- `planning/bundles/`

**Writes:**
- `planning/scenarios-backlog/` (PM moves approved → `planning/scenarios/`)
- `planning/bundles/`

**Does NOT Read:**
- `development/tickets/`
- `web/`
- `planning/scenarios/` (only for reference; never modifies)

**Task:** Convert systems into user-story-shaped scenarios anchored to canonical examples. Apply the 5 Deadly Sins filter (scope creep, gold plating, missing requirements, unrealistic schedules, poor communication). Refuses to write tickets or explore.

**Calls in:** Anthropic-provided `planning-filter` skill when ranking a sprawling backlog.

---

## 2.5. Reviewer (Architecture + Design pre-flight)

> **MANDATORY during the primitives rebuild.** Until Phase 4 of [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) (the rebuild plan) completes, every approved scenario goes through review. Optional only for trivial copy/CTA changes on existing surfaces. Rationale: [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) F3.

**Skill:** `pipeline-review`
**Model:** Claude Opus (cross-system check, comprehensive)
**Calls in:** `design:design-critique`, `design:design-system`, `design:accessibility-review` (mandatory on every new surface), `engineering:architecture` (re-evaluates ADR fit when one exists).

**Reads:**
- `planning/scenarios/` (the approved scenario)
- `product/systems/`
- `product/ui/`
- `product/foundation/`
- `planning/DECISIONS.md`
- `planning/bundles/{active}.md`

**Writes:**
- `planning/reviews/F{NNN}-review.md`

**Does NOT Read:**
- `web/` (code)
- `development/tickets/`
- `planning/scenarios-backlog/`

**Task:** Architecture check (does this scenario fit existing systems? new schema/events/columns required?) + Design check (does the surface fit the design language? new components needed? CTA placement consistent?). Output: a review document with verdict **PROCEED** (continue), **REVISE** (back to plan), or **EXTEND** (back to product to extend a system or design doc).

**When to invoke:** any scenario that introduces a new surface, component, event type, table, column, or design pattern. Skip for trivial additions to existing forms/pages.

---

## 3. Eval Writer (Pre-build oracle)

**Skill:** `pipeline-eval` (write mode)
**Model:** Claude Opus (comprehensive, thorough)

**Reads:**
- `planning/scenarios/` (approved only)

**Writes:**
- `web/evals/features/F{NNN}.spec.ts` (or framework equivalent)

**Does NOT Read:**
- `web/` source code (no peeking at implementation)
- `planning/scenarios-backlog/`
- `development/tickets/`

**Task:** Translate every Given/When/Then in the approved scenario into an automated test. Tests must trace line-by-line back to scenario clauses.

**Critical firewall:** runs *before* the build agent starts. This is what prevents teaching to test.

---

## 4. Ticket Writer

**Skill:** `pipeline-ticket`
**Model:** Claude Opus (systematic, clear)

**Reads:**
- `planning/scenarios/` (approved only)
- `planning/reviews/F{NNN}-review.md` if it exists (the architecture + design pre-flight from `pipeline-review`)
- `development/tickets/` and `development/tickets/done/` (for the next T-number and to learn what exists)
- `product/systems/{relevant-system}.md` (only the "Data model implications" section)

**Writes:**
- `development/tickets/`

**Does NOT Read:**
- `planning/scenarios-backlog/`
- `web/` (code)
- Eval test code

**Task:** Break each approved scenario into ordered, session-sized tickets (~1–3 hours, one cohesive commit each). Each ticket references exactly one scenario via `Scenario:`. If a scenario produces 5+ tickets, escalate to `pipeline-plan` to split.

---

## 5. Build Agent

**Skill:** `pipeline-build`
**Model:** Claude Sonnet (fast, execution-focused)

**Reads:**
- `development/tickets/`
- `planning/scenarios/` (the scenario the ticket references)
- `product/systems/{name}.md` (Data model implications only)
- `product/ui/design-language.md` (for any UI work)
- `web/` (code, tests)

**Writes:**
- `web/` (code and tests)
- `development/tickets/` (Completion section, then move to `done/`)
- `BUILD-LOG.md`

**Does NOT Read:**
- `planning/scenarios-backlog/` (not approved — prevents teaching to test)
- `product/` outside the system spec referenced by the ticket
- Eval test code (write mode evals are an external oracle; build writes its own unit tests)

**Task:** Implement one ticket at a time via TDD (red → green → refactor). Never roll back; fix forward. Escalate ambiguity to `pipeline-plan`. Does NOT write tickets — `pipeline-ticket` does.

**Mandatory at ticket close** (see [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) F8/F9):
- Append a single-line entry to `development/DEVIATIONS.md` — even "no deviations." Empty is no longer the default.
- Update `web/BUILD-LOG.md` with current ticket status.
- Run `engineering:code-review` on the diff before invoking `pipeline-eval` (run mode). This is the M2 solo-team multiplier.

**Calls in:** Anthropic-provided `docx`, `pptx`, `xlsx`, `pdf` skills when the deliverable is a non-code file. `engineering:debug` during reproduction. `engineering:code-review` mandatory before eval-run.

---

## 6. Eval Runner

**Skill:** `pipeline-eval` (run mode)
**Model:** Claude Opus (comprehensive, thorough)

**Reads:**
- `web/evals/`
- `web/evals/results/`
- `planning/scenarios/` (for traceability)

**Writes:**
- `web/evals/results/`

**Task:** Run F### evals after build, report pass/fail per Given/When/Then clause. On fail, hand back to `pipeline-build` to fix forward. On scenario-is-wrong, hand back to `pipeline-plan`. Does NOT fix failing tests.

---

## PM Workflow

```
1. "Write/extend system for X"               → pipeline-product
2. "Write scenarios for F###"                → pipeline-plan
3. PM reviews, moves to planning/scenarios/  (manual; or pipeline-plan on instruction)
4. "Review F###"                             → pipeline-review (optional)
   On EXTEND: → pipeline-product, then re-review.
   On REVISE: → pipeline-plan, then re-review.
   On PROCEED: continue.
5. "Write evals for F###"                    → pipeline-eval (write mode)
6. "Write tickets for F###"                  → pipeline-ticket
   (steps 5 and 6 run in parallel from the approved scenario)
7. "Implement T###"                          → pipeline-build
8. "Run evals for F###"                      → pipeline-eval (run mode)
9. On pass: PM picks next.
   On fail: pipeline-build fixes forward.
   On scenario-is-wrong: pipeline-plan revises; cycle restarts at step 4.
```

**Key invariant:** evals are *written* before build (step 5) and *run* after build (step 8). The split is what makes the pipeline trustworthy. The review stage (step 4) prevents architectural and design drift from sneaking into the build stage.

---

## Escalation Contacts

- **Product questions** → escalate to `pipeline-product` (via PM).
- **Spec ambiguity** → flag in `development/DEVIATIONS.md` and escalate to `pipeline-plan`.
- **Architecture / design drift suspected** → `pipeline-review`.
- **Reprioritization** → escalate to `pipeline-plan`.
- **Feature redesign** → escalate to `pipeline-plan` → `pipeline-product`.
- **Eval failure that requires scenario change** → `pipeline-plan` revises; cycle restarts at review.
- **Migration / auth / RLS change** → consider invoking Anthropic's `security-review` skill before commit (build agent).
- **Non-code deliverables** (report, deck, spreadsheet, PDF) → build agent invokes the matching Anthropic skill (`docx`, `pptx`, `xlsx`, `pdf`).
