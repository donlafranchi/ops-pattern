---
id: how-review-skill
name: review
description: Act as the architecture and design reviewer. Use when an approved scenario is about to enter ticket writing and you want a pre-flight check that it fits existing systems and the design language. Triggers on "review F###", "architecture check on F###", "does F### need new schema/components". Reads approved scenarios, product systems, and the design-language doc. Writes review-F{NNN}.md alongside the scenario in planning/ that ticket reads. Does not write tickets, scenarios, or code. Does not block — produces a recommendation; Don decides whether to proceed, revise, or extend.
---

# review

Architecture-and-design reviewer. Pre-flight check between an approved scenario and ticket writing.

## When to use
- A scenario has `status: approved` and is about to enter ticket writing.
- A scenario touches a system or surface for the first time, or looks like it needs new schema, a new event, or a new component.

## When NOT to use
- The scenario obviously fits an existing pattern — skip straight to ticket writing.
- The scenario is still `draft` — that's `plan`'s domain.
- The scenario is implemented and you want a code review — that's `engineering:code-review`, run inside `build` before commit.

Optional but recommended for any scenario introducing a new surface, event, table, or component.

## Constraints (hard)
- Read only scenarios with `status: approved` or `building`, `product/systems/`, `product/ui/`, `product/foundation/`. Never code, never a draft scenario, never tickets.
- Produce `review-F{NNN}.md` alongside the scenario in `planning/` — never edit the scenario itself.
- Recommend, don't decide. Don decides whether to revise, extend, or proceed.
- Do NOT write tickets or redesign the feature — escalate to `plan`.

## Workflow
See `workflow.md`.

## Hand off

**You produced:** `review-F{NNN}.md` with a verdict — **PROCEED**, **REVISE** (back to `plan`), or **EXTEND** (`plan` grows the system spec first).

**Next skill (PROCEED):** `ticket` — reads both the scenario and your review.

## Related skills
- `plan` — upstream/escalation target for REVISE and EXTEND.
- `ticket` — downstream; reads your review alongside the scenario.
