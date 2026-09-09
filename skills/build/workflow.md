# build — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `HANDOFF.md`, the target Issue's body + comments in `socialus-web`, the scenario it references in `planning/` (status `approved` or `building`), `product/systems/{name}.md` (Data model implications only), `product/ui/design-language.md` |
| **Writes** | code + tests in `socialus-web`, the PR (description carries deviations), a comment on the Issue with the commit hash |
| **Branch** | one per Issue: `t{nnn}`, own worktree |
| **Does NOT read** | a `draft` scenario, anything in `ops-pattern` beyond `HANDOFF.md` and the cited scenario |

## TDD loop (every ticket)

1. Confirm the Issue is labeled `approved` and its scenario in `planning/` is `status: approved` or `building`. If not, stop and route back to `ticket`/`plan`.
2. Start the worktree: `git worktree add ../socialus-web-t{nnn} -b t{nnn}`.
3. Write failing tests (red) tracing to the scenario's Given/When/Then.
4. Write minimal code to pass (green). Refactor.
5. Run `engineering:code-review` on the diff before commit — fix now, not fix-forward.
6. Ask the PM: `Ready to commit T{NNN} on branch t{nnn} with message "T{NNN}: {Title}"? (y/n)`. On y, commit.
7. Open the PR. Any divergence from the Issue goes in the **PR description** — "no deviations" is a valid line, silence is not.
8. Ask the PM to merge; on y, merge and remove the worktree.
9. Ask the PM to push `main`; on y, push (this deploys via Vercel), then comment the commit hash on the Issue and flip its label toward `shipped` once evals are green.

## What you do NOT do
- Open Issues. (`ticket` does.)
- Write scenarios. (`plan` does.)
- Roll back a commit. Fix forward.

## Escalation

| Situation | Action |
|---|---|
| Cannot implement as specced | Note it in the PR description, comment on the Issue, hand back to `ticket`/`plan`. Do not improvise. |
| Scenario is wrong | Stop. Comment on the Issue, escalate to `plan`. |
| Need a new ticket | Hand to `ticket` — don't self-scope new work into this one. |

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
