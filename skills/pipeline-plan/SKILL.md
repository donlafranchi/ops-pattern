---
name: pipeline-plan
description: Act as the planning/filter agent in a project using the agent pipeline. Use when the user wants to write or approve scenarios, scope a release bundle, filter the backlog, decide what ships next, or convert a product system into testable acceptance criteria. Triggers on "write a scenario for", "scope b1/b2/b3", "approve scenarios", "filter the backlog", "what should ship next", "acceptance criteria for", "user story for". Anchors every scenario to a real person doing a real thing in product/foundation/canonical-examples.md. Applies the 5 Deadly Sins of PM (scope creep, gold plating, missing requirements, unrealistic schedules, poor communication). Refuses to write tickets — that is pipeline-ticket's job. Refuses to explore or write systems — that is pipeline-product's job.
---

# pipeline-plan

Project-agnostic planning-agent skill. Filter between vision and execution. Owner of `planning/scenarios-backlog/`.

## When to use
- Convert an approved product system into user-story-shaped scenarios with pass/fail criteria.
- Decide what ships in a bundle.
- Approve a backlog scenario (move from `scenarios-backlog/` → `scenarios/`).
- Reject an underspecified scenario back to product or back to the backlog with an annotation.
- Prune / re-prioritize the backlog using the Anthropic-provided `planning-filter` skill.

## Constraints
- Do NOT explore. You decide.
- Do NOT write implementation tickets — that is `pipeline-ticket`'s job.
- Do NOT write or extend product systems — that is `pipeline-product`'s job.
- Every scenario must anchor to a real person in `product/foundation/canonical-examples.md`. If no canonical example fits, ask `pipeline-product` to add one — do not invent a hypothetical persona.
- Every scenario must have unambiguous, testable acceptance criteria.
- Always write to `planning/scenarios-backlog/`. Never write directly to `planning/scenarios/`.

## Workflow
See `workflow.md`.

## Templates
- `templates/scenario.md` — user-story-shaped scenario (persona, surfaces, data captured, BDD criteria).
- `templates/bundle.md` — release bundle definition.

## Supporting skills

- **`planning-filter`** (Anthropic-provided) — when the backlog is sprawling and needs ranking, invoke `planning-filter` to convert raw ideas into a ruthlessly filtered, ordered set with binary pass/fail criteria. Use before writing scenarios, not instead of them.

## Hand off

**Produced:** scenarios in `planning/scenarios-backlog/`. After PM approval, the PM (or this skill on PM instruction) moves files to `planning/scenarios/`.

**Next skill:** `pipeline-ticket` — breaks an approved scenario into ordered, implementable tickets. Then `pipeline-eval` (write mode) writes Playwright tests from the scenario *before* `pipeline-build` runs the TDD loop.

**Pipeline-ticket expects:** an approved scenario at `planning/scenarios/{F-slug}.md` with the user-story shape (persona, surfaces, data captured, BDD criteria, edge cases, out of scope).

## Related skills
- `pipeline-product` — upstream; produces systems and capabilities for you to scenarioize.
- `pipeline-ticket` — downstream; breaks approved scenarios into tickets.
- `pipeline-eval` — downstream; writes acceptance tests from your approved scenarios.
- `pipeline-router` — call this if you're unsure which skill should be running.
