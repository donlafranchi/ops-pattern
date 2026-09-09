---
id: how-review-skill
name: review
description: Act as the architecture and design reviewer. Use when a draft scenario is about to move to approved and you want a pre-flight check that it fits existing systems and the design language. Triggers on "review F###", "architecture check on F###", "does F### need new schema/components". Reads the draft scenario, product systems, and the design-language doc. On PROCEED, sets the scenario's status to approved and fills in its `approved:` line — no separate review file. Does not write tickets or code. Does not block — produces a recommendation; Don decides whether to proceed, revise, extend, or split.
---

# review

Architecture-and-design reviewer. Pre-flight check between a draft scenario and approval.

## When to use
- A scenario is `status: draft` and close to ready — a pre-flight check before it becomes buildable.
- A scenario touches a system or surface for the first time, or looks like it needs new schema, a new event, or a new component.

## When NOT to use
- The scenario obviously fits an existing pattern — approve it directly, no review needed.
- The scenario is implemented and you want a code review — that's `engineering:code-review`, run inside `build` before commit.

Optional but recommended for any scenario introducing a new surface, event, table, or component. Every scenario is ≤40 lines with three sections (Story, Acceptance, Not this) — read the whole thing; there's nothing else to read.

## Constraints (hard)
- Read the target scenario, `product/systems/`, `product/ui/`, `product/foundation/`. Never code, never tickets.
- **Check the shape first.** ≤40 lines, exactly three `##` sections, Story 5–8 lines about one person with no system names, Acceptance ≤5 checks each answerable yes/no by using the app. A situation that can't fit is **SPLIT** — back to `plan` for fresh F-numbers linked by `depends:`, never a longer file.
- **No separate review file.** On PROCEED, edit the scenario's frontmatter directly: `status: approved`, `approved: <date> — <≤15-word note>`. A real constraint the review surfaces goes into the scenario's own Not this section or a `DECISIONS.md` line — never a review doc nobody reads again.
- Recommend, don't decide. Don decides whether to revise, extend, split, or proceed.
- Do NOT write tickets or redesign the feature — escalate to `plan`.

## Workflow
See `workflow.md`.

## Hand off

**You produced:** the scenario, either unchanged with a verdict reported (REVISE / EXTEND / SPLIT — back to `plan`) or edited in place (PROCEED — `status: approved` + the `approved:` line).

**Next skill (PROCEED):** `ticket`.

## Related skills
- `plan` — upstream/escalation target for REVISE, EXTEND, and SPLIT; writes drafts and owns `DECISIONS.md`.
- `ticket` — downstream; reads the approved scenario.
- `sync` — deletes the scenario once every Issue on its F-number is closed. Nothing else to clean up: there is no review file.
