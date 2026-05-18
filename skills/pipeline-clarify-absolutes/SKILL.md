---
name: pipeline-clarify-absolutes
description: Walk the PM through every absolute-language statement (Never / won't / doesn't / cannot / will not / refuses / no X / deliberately no / always / must / categorically) in a target spec, ADR, or planning doc, and land a `Why:` / `Intent:` annotation (plus bullet revision when the original wording is misleading) on each. Use when the user says "clarify the absolutes in {file}", "review every never-statement", "go over the won't statements in X", "audit the absolutes in {ADR/spec}", "every absolute needs intent", "let's review the never/won't/doesn't statements". Conversational — walks one statement at a time; PM ratifies each; skill lands the change before moving to the next. Refuses to batch-process; refuses to land without ratification. Reads the target file plus related foundation/system specs and recent JOURNAL entries; writes directly to the target file after PM ratifies each statement.
---

# pipeline-clarify-absolutes

Project-resident clarifier. The principle: **no purely-categorical refusal exists in this project.** Every "Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no" carries a *why*, and that *why* is what a downstream agent (ticket-writer, build agent, eval) needs to reason correctly when the literal wording doesn't cover the case in front of them. This skill walks the PM through each absolute and lands the *why* alongside the *what*.

Companion to `pipeline-intent-check` (which scans + flags) and the `Intent:` annotation convention from [`../../planning/archive/intent-audit-2026-05-12.md`](../../planning/archive/intent-audit-2026-05-12.md) (which is the format).

## When to use

- User says "clarify the absolutes in {file}" / "review every never-statement in X" / "audit the won't statements" / "every absolute needs Intent" / "let's go over the never/won't/doesn't statements."
- `pipeline-intent-check` ran on a spec and surfaced Category-2 (refusal) statements; PM wants to ratify each interactively.
- A new ADR or system spec is about to be ratified and contains absolute-language refusals; clarify before merging.
- During a `pipeline-prune` pass, when memorializing a silently-load-bearing decision that contains an absolute, route through here first.

## When NOT to use

- During an open scenario phase, ticket implementation, or active TDD — surface the request, defer until the phase closes.
- For statements that aren't absolutes (descriptive rules, conditional behaviors, metric thresholds — those are Category 1 / 5 / 6 in the archived intent audit, handled by other Intent shapes).
- For batch processing without PM ratification — skill refuses to land without per-statement confirmation.
- During an active build agent loop — never interrupt TDD execution.

## Workflow

See [`workflow.md`](workflow.md).

## Related skills

- `pipeline-intent-check` — escalates Category-2 absolutes here when its scan finds them.
- `pipeline-prune` — when memorializing a silently-load-bearing decision that contains an absolute, route through here first to ensure the absolute lands with its *why*.
- `pipeline-router` — orient before invoking; confirm no open phase is in flight.

## Hand off

**You produced:** revised bullet text (when the original wording was misleading) + `Intent:` annotations landed directly in the source file for each ratified statement; one JOURNAL entry per session summarizing what was clarified, with `file:line` pointers.

**Next skill:** none. PM owns what comes next. Common follow-ups: re-run `pipeline-intent-check` on the same file to confirm the clarifications land cleanly; expand to the next file the PM has queued.
