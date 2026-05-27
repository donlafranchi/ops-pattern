---
name: pipeline-ratify-absolute
description: Walk the PM through every unratified absolute-language statement (Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no) in a target spec, ADR, or section, invoke the member + platform advocates on each one that has Member-shaped tension, apply the lexicographic decision rule (platform-survival hard gate → maximize net member benefit), and land a State-tagged `Intent` line directly in the source file. Use when the user says "ratify the absolutes in {file}", "review every never-statement in X", "audit our absolutes", "is this absolute earned", "decide or defer on F### intents", or "every absolute needs Intent". Handles two scopes — one statement or a whole file/section — same workflow. Conversational and per-statement; refuses to batch-process; refuses to land without PM ratification; refuses Defer without an observable trigger. Reads principles.md, policy.md, principles.md, the target file, and any cited foundation docs. Writes the Intent line directly to the source file on PM ratification, plus one JOURNAL entry per session.
---

# pipeline-ratify-absolute

The single skill for adjudicating absolutes. Folds in the prior `pipeline-clarify-absolutes` (walk discipline) and `pipeline-review-absolute` (decision rule) — same job at different zoom levels, now collapsed.

**The principle.** There is no purely-categorical refusal in this project. Every "Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no X" carries a *why*, and that *why* is what a downstream agent (ticket-writer, build agent, eval) needs to reason correctly when the literal wording doesn't cover the case in front of them.

**The State marker.** Every absolute has exactly one State, readable from one line co-located with the bullet:

| Line in spec | State |
|---|---|
| No `Intent:` line | **Unratified de-facto** — agent-authored, never PM-approved. Blocks downstream pipeline. |
| `Intent: {why}` (no parenthetical tag) | **Drafted** — proposed but not yet adjudicated. Blocks downstream pipeline. |
| `Intent (Ratified YYYY-MM-DD): {why}` | **Ratified** — terminal. Downstream agents rely on the Intent to reason about edge cases. |
| `Intent (Deferred until {trigger}; review by {date or bundle gate}): {interim posture}` | **Deferred** — terminal until trigger fires. Downstream treats the absolute as the current default but expects re-decision when trigger fires. |

Rejected absolutes are removed from the spec; the JOURNAL entry records the removal and reason. There is no `Intent (Rejected)` line — the absence of the bullet is the signal.

## When to use

- "Ratify the absolutes in {file}" / "review every never-statement in X" / "audit our absolutes"
- `pipeline-intent-check` surfaced Category-2 (refusal) statements without ratified Intent
- `pipeline-plan` Gate A or `pipeline-ticket` Gate B refused to proceed because cited spec sections contained unratified absolutes
- A new ADR or system spec contains absolute-language refusals; ratify before merging
- During a `pipeline-prune` pass, when memorializing a silently-load-bearing decision

## When NOT to use

- During an open scenario phase, ticket implementation, or active TDD — surface the request, defer until the phase closes.
- For statements that aren't absolutes (descriptive rules, conditional behaviors, metric thresholds — Categories 1 / 5 / 6 in the archived intent audit; route to `pipeline-intent-check`).
- For batch processing without PM ratification — refuses to land without per-statement confirmation.
- To replace PM judgment. The skill structures the adjudication; it does not adjudicate.

## Workflow

See [`workflow.md`](workflow.md).

## Related skills

- `pipeline-intent-check` — scans for unratified absolutes; escalates here. Read-only; this skill is the writer.
- `pipeline-member-advocate` + `pipeline-platform-advocate` — invoked on every Member-shaped tension; produce the bullets this skill adjudicates.
- `pipeline-plan` — Gate A caller; refuses scenarios whose cited spec sections contain unratified absolutes.
- `pipeline-ticket` — Gate B caller; refuses tickets whose touched specs contain unratified absolutes.
- `pipeline-router` — orient before invoking; confirm no open phase is in flight.

## Hand off

**You produced:** `Intent` line landed in the source file with the appropriate State tag on each ratified statement (or absolute removed for Rejected); one JOURNAL entry per session summarizing what was ratified / deferred / rejected, with `file:line` pointers.

**Next skill:** none. PM owns what comes next. Common follow-ups: `pipeline-intent-check` on the same file to confirm the State tags land cleanly; `pipeline-plan` or `pipeline-ticket` re-runs the gate it previously failed.
