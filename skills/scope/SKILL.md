---
id: how-scope-skill
name: scope
description: Act as the planning/filter agent in a project using the agent pipeline. Use when the user wants to write or approve scenarios, scope a release bundle, filter the backlog, decide what ships next, or convert a product system into testable acceptance criteria. Triggers on "write a scenario for", "scope b1/b2/b3", "approve scenarios", "filter the backlog", "what should ship next", "acceptance criteria for", "user story for". Anchors every scenario to a real person doing a real thing in product/needs/use-cases.md. Applies the 5 Deadly Sins of PM (scope creep, gold plating, missing requirements, unrealistic schedules, poor communication). On PM approval, advances scenarios from backlog/ to next/ via a y/n confirmation prompt. Refuses to write tickets — that is ticket's job. Refuses to explore or write systems — that is explore's job.
---

# scope

Project-agnostic planning-agent skill. Filter between vision and execution. Owner of scenario drafts in `planning/backlog/`.

## When to use
- Convert an approved product system into user-story-shaped scenarios with pass/fail criteria.
- Decide what ships in a bundle.
- Approve a backlog scenario and advance it from `planning/backlog/` → `planning/next/` on PM confirmation.
- Reject an underspecified scenario back to product or back to the backlog with an annotation.
- Prune / re-prioritize the backlog using the Anthropic-provided `planning-filter` skill.

## Constraints
- Do NOT explore. You decide.
- Do NOT write implementation tickets — that is `ticket`'s job.
- Do NOT write or extend product systems — that is `explore`'s job.
- Every scenario must anchor to a real person in `product/needs/use-cases.md`. If no canonical example fits, ask `explore` to add one — do not invent a hypothetical persona.
- Every scenario must have unambiguous, testable acceptance criteria.
- Always write scenario drafts to `planning/backlog/` as `scenario-F{NNN}-{slug}.md`. Never write directly to `planning/next/` — promotion goes through the lane-advance prompt (`backlog/` → `next/`) with explicit PM confirmation.

## Workflow
See `workflow.md`.

## Templates
- `templates/scenario.md` — user-story-shaped scenario (persona, surfaces, data captured, BDD criteria).
- `templates/bundle.md` — release bundle definition.

## Supporting skills

- **`planning-filter`** (Anthropic-provided) — when the backlog is sprawling and needs ranking, invoke `planning-filter` to convert raw ideas into a ruthlessly filtered, ordered set with binary pass/fail criteria. Use before writing scenarios, not instead of them.

## Hand off

**Produced:** scenario drafts in `planning/backlog/`. After PM approval, scope moves files to `planning/next/` on PM confirmation via the lane-advance prompt.

**Next skill:** `ticket` — breaks an approved scenario into ordered, implementable tickets. Then `test` (write mode) writes Playwright tests from the scenario *before* `build` runs the TDD loop.

**Pipeline-ticket expects:** an approved scenario at `planning/next/scenario-F{NNN}-{slug}.md` (or `planning/now/scenario-F{NNN}-{slug}.md`) with the user-story shape (persona, surfaces, data captured, BDD criteria, edge cases, out of scope).

## Related skills
- `explore` — upstream; produces systems and capabilities for you to scenarioize.
- `ticket` — downstream; breaks approved scenarios into tickets.
- `test` — downstream; writes acceptance tests from your approved scenarios.
- `orient` — call this if you're unsure which skill should be running.
