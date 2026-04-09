# AGENTS.md — Development Pipeline

Four specialized agents handle the full development lifecycle.

## Pipeline Overview

```
Scenario Writer → Ticket Writer → Build Agent → Evaluator
```

## 1. Scenario Writer

**Model:** Claude Opus (creative, comprehensive)

**Reads:**
- `planning/bundles/`
- `product/systems/`
- `product/capabilities/`

**Writes:**
- `planning/scenarios-backlog/`

**Does NOT Read:**
- `development/tickets/`
- `web/`
- `planning/scenarios/`

**Task:** Convert bundle requirements and product systems into detailed scenarios with Given/When/Then acceptance criteria.

---

## 2. Ticket Writer

**Model:** Claude Opus (systematic, clear)

**Reads:**
- `planning/scenarios/` (APPROVED ONLY)
- `development/tickets/` (to check what exists)

**Writes:**
- `development/tickets/`

**Does NOT Read:**
- `planning/scenarios-backlog/`
- `web/` (code)

**Task:** Break scenarios into implementation tickets with clear acceptance criteria and acceptance tests.

---

## 3. Build Agent

**Model:** Claude Sonnet (fast, execution-focused)

**Reads:**
- `development/tickets/`
- `planning/scenarios/` (for acceptance criteria)
- `web/` (code, tests)

**Writes:**
- `web/` (code and tests)
- `development/tickets/` (completion)

**Does NOT Read:**
- `planning/scenarios-backlog/` (not approved)
- `product/` (no redesign authority)

**Task:** Implement tickets using TDD. Never roll back; fix forward. Escalate ambiguity.

---

## 4. Evaluator

**Model:** Claude Opus (comprehensive, thorough)

**Two Modes:**

### Mode 1: Write (after scenarios approved, before build)

**Reads:**
- `planning/scenarios/`

**Writes:**
- `web/evals/features/`

**Does NOT Read:**
- `web/` (source code — no peeking at implementation)

**Task:** Write Playwright tests that verify scenarios without seeing the implementation.

### Mode 2: Run (after feature complete)

**Reads:**
- `web/evals/`
- `web/evals/results/`

**Writes:**
- `web/evals/results/`

**Task:** Run tests, verify they pass, document results.

---

## PM Workflow

1. **Approve scenarios:** Review `planning/scenarios-backlog/`, move approved to `planning/scenarios/`
2. **Write evals (BEFORE build):** Trigger Evaluator for approved scenarios
3. **Write tickets:** Trigger Ticket Writer to break scenarios into tasks
4. **Build feature:** Trigger Build Agent for each ticket in sequence
5. **Run evals (AFTER build):** Trigger Evaluator to run tests, loop if needed

**Key insight:** Evals are written BEFORE build (preventing bias), run AFTER build (proving correctness).

---

## Escalation Contacts

- **Product questions** → Escalate to Product Agent (via PM)
- **Spec ambiguity** → Flag in `development/DEVIATIONS.md` and escalate to Planning
- **Reprioritization** → Escalate to Planning
- **Feature redesign** → Escalate to Planning → Product
