---
name: pipeline-clarify-absolutes
description: DEPRECATED 2026-05-19 — folded into `pipeline-ratify-absolute`. Do not invoke. The walk discipline (per-statement, no batch, PM ratifies each) is preserved in the successor skill; the decision-rule application from the prior `pipeline-review-absolute` is also folded in. See `pipeline-ratify-absolute/SKILL.md`.
---

# pipeline-clarify-absolutes — DEPRECATED

**Folded into [`pipeline-ratify-absolute`](../pipeline-ratify-absolute/SKILL.md) on 2026-05-19.** The successor skill preserves the per-statement walk, advocate invocation on Member-shaped tension, and PM ratification contract — plus the lexicographic decision rule from the retired `pipeline-review-absolute`. Use `pipeline-ratify-absolute` instead.

Original SKILL contents preserved below for git history; do not act on them.

---

# pipeline-clarify-absolutes

Project-resident clarifier. The principle: **no purely-categorical refusal exists in this project.** Every "Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no" carries a *why*, and that *why* is what a downstream agent (ticket-writer, build agent, eval) needs to reason correctly when the literal wording doesn't cover the case in front of them. This skill walks the PM through each absolute and lands the *why* alongside the *what*.

Companion to `pipeline-intent-check` (which scans + flags) and the `Intent:` annotation convention from [`../../_attic/2026-05-19/planning/intent-audit-2026-05-12.md`](../../_attic/2026-05-19/planning/intent-audit-2026-05-12.md) (which is the format).

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
