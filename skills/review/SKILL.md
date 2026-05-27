---
name: review
description: Act as the architecture and design reviewer in a project using the agent pipeline. Use when an approved scenario is about to enter ticket writing and you want a pre-flight check that the scenario fits existing systems and the design language. Triggers on "review F###", "architecture check on F###", "design review F###", "does F### need new schema/components", "is F### consistent with existing surfaces". Reads approved scenarios, product systems, the design language doc, and existing UI inventory. Writes a review document at planning/history/F{NNN}-review.md that the ticket writer reads. Does not write tickets, scenarios, or code. Does not block — produces a recommendation; PM decides whether to proceed, revise the scenario, or extend the system.
---

# review

Project-agnostic architecture-and-design reviewer. Pre-flight check between approved scenario and ticket writing.

## When to use

- An approved scenario is about to enter ticket writing.
- A scenario touches a system or surface for the first time.
- A scenario looks like it might need a new component, new event type, new table, or a new UI pattern.
- You're unsure whether the scenario can be built without extending the underlying systems.

## When NOT to use

- The scenario is small and obviously fits an existing pattern (e.g., adding a new field to an existing form). Skip review; go straight to ticket writing.
- The scenario hasn't been approved yet — that's `scope`'s domain.
- The scenario is implemented and you want a code review — that's a different concern; use `security-review` (Anthropic skill) or a code-review subagent.

This stage is **optional but recommended for any scenario that introduces a new surface, a new event, a new table, or a new component**.

## Constraints (hard)

- Read only `planning/scenarios/` (approved), `product/systems/`, `product/ui/`, `product/foundation/`, `planning/DECISIONS.md`. Never code, never the backlog, never tickets.
- Produce a review document at `planning/history/F{NNN}-review.md` — never edit the scenario itself.
- Recommend, don't decide. The PM decides whether to revise the scenario, extend a system spec, or proceed with ticket writing.
- Do NOT write tickets — that is `ticket`'s job.
- Do NOT redesign the feature — that is `explore`'s job. If you find a gap that needs new product thinking, escalate up.

## Workflow
See `workflow.md`.

## Templates
- `templates/review.md` — structured review document with separate Architecture and Design sections, plus a verdict.

## Hand off

**You produced:** a review document at `planning/history/F{NNN}-review.md` with a verdict — **PROCEED** (ticket writing can start), **REVISE** (scenario needs changes; back to `scope`), or **EXTEND** (a system or design doc needs to grow first; back to `explore`).

**Next skill (on PROCEED):** `ticket` — reads both the approved scenario AND your review when scoping tickets, so it knows which existing systems/components to reuse and which gaps to flag.

**Next skill (on REVISE):** `scope` — revises the scenario; cycle returns here.

**Next skill (on EXTEND):** `explore` — extends the relevant `product/systems/{name}.md` or `product/ui/design-language.md`; then `scope` re-confirms the scenario; then back here.

## Related skills

- `scope` — upstream; produces approved scenarios you review.
- `ticket` — downstream; reads your review alongside the scenario.
- `explore` — escalate to if a system or design doc needs to be extended.
- `orient` — call this if you're unsure which skill should be running.
