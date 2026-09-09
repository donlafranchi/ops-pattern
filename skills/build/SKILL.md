---
id: how-build-skill
name: build
description: Act as the build/TDD agent for socialus-web. Use when the user wants to implement an Issue, do TDD on a feature, or fix a failing eval. Triggers on "implement T###", "work on issue #", "TDD this", "build the next ticket", "fix the failing eval". Reads HANDOFF.md for what's approved and the target Issue's body + comments in socialus-web — never a scenario still in draft. Tests before code. Never rolls back commits — fixes forward. Escalates spec divergence rather than improvising. Does not open Issues — that is ticket's job.
---

# build

Build-agent skill for `socialus-web`. Pure TDD execution.

## When to use
- User wants to implement an open Issue: "work on #12", "implement T019".
- An eval failed and needs fixing forward.

## Constraints (hard)
- Read `HANDOFF.md` (ops-pattern) for what's approved, and the Issue body + architecture note in `socialus-web` for what to build. Never start on a scenario that's still `status: draft`.
- Tests before code. Always.
- Never roll back commits. Fix forward.
- Escalate spec divergence — do not improvise; comment on the Issue and stop.
- **A PR whose behavior differs from its scenario's Acceptance stops** — comment on the Issue asking for a scenario change first. Do not ship a different behavior than what was approved.
- One Issue at a time. Branch per ticket, worktree per branch.
- **You run the commit and the merge, each with PM permission** — same y/n pattern as before. Format: `T{NNN}: {Title}`.
- Deviations from the Issue go in the **PR description**, not a separate file — even "no deviations."
- Do NOT open Issues — `ticket` does that.

## Workflow
See `workflow.md`.

## Hand off

**You produced:** code + tests on branch `t{nnn}`, the PR (description carries any deviations), the commit hash pasted into the Issue.

**Next skill:** `test` (run mode) — runs the evals tied to the Issue's scenario.

## Related skills
- `ticket` — upstream; opens the Issues you implement.
- `plan` — escalate here if the scenario is wrong or a system needs redesign.
