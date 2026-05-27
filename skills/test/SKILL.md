---
name: pipeline-eval
description: Act as the evaluator agent in a project using the agent pipeline. Use when the user wants to write acceptance tests from approved scenarios, run evals against a feature, verify a ticket meets its scenario, or close the loop after build. Triggers on "write evals for F###", "run evals", "verify acceptance criteria", "test the F###", "did this pass". Reads only planning/scenarios/ (approved) — never the backlog. Translates Given/When/Then into automated tests. Reports pass/fail with traceability back to the scenario.
---

# pipeline-eval

Project-agnostic evaluator-agent skill. Closes the loop between specs and shipped code.

## When to use
- An approved scenario exists and needs automated tests.
- A ticket is implemented and needs verification.
- The user asks "did the F### scenario pass" or "run evals for F###".

## Constraints
- Read only `planning/scenarios/` (approved). NEVER `planning/scenarios-backlog/`.
- Tests must trace back to a specific Given/When/Then clause.
- Report results with the scenario file referenced — pass/fail per acceptance criterion.

## Workflow
See `workflow.md`.

## Templates
- `templates/playwright-spec.md` — one spec file per scenario; mirrors BDD beats.
- `templates/results.md` — per-run results report with traceability back to the scenario.

## Hand off

**Two modes; two different hand-offs.**

### Write mode (before build)
**You produced:** Playwright (or framework equivalent) tests in `{app}/evals/features/F{NNN}.spec.ts`, traceable line-by-line to the scenario's Given/When/Then clauses.

**Next skill:** `pipeline-build` — implements the ticket via TDD. Build does not read your test file (no peeking at test internals); it writes its own unit tests against the ticket's checklist and lets your evals validate from the outside.

### Run mode (after build)
**You produced:** a pass/fail report per scenario, with the failing assertions named.

**Next skill (on pass):** none — the loop closes; PM picks up.

**Next skill (on fail):** `pipeline-build` — fixes forward. Never roll back. Never silently update tests to match a wrong implementation.

**You DO NOT:** fix failing tests. Fix-forward is build's job.

## Related skills
- `pipeline-plan` — upstream; produces approved scenarios you read from.
- `pipeline-ticket` — sibling; reads same scenario you do, in parallel.
- `pipeline-build` — downstream (write mode) or downstream-on-fail (run mode).
- `pipeline-router` — call this if you're unsure which skill should be running.
