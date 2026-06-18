# Build agent hook for simplify-review

Drop this into `development/CLAUDE.md` in the build repo. It inserts one step into the existing TDD workflow.

## Where it goes

In the TDD workflow, between "tests pass" and "commit".

## The step

```
After tests pass (red → green) and before commit:

1. Run /simplify-review on the staged diff.
2. If verdict is Approve: commit, update BUILD-LOG.md, move ticket to done.
3. If verdict is Request changes:
   a. If findings are inside the ticket's scope: fix forward, re-run tests,
      re-run /simplify-review. Loop until verdict is Approve.
   b. If findings are outside the ticket's scope: log each finding to
      development/DEVIATIONS.md with the ticket ID, the lens, and a one-line
      note. Commit the ticket as-is. Surface to the PM in the next journal entry.

The build agent does not autonomously expand ticket scope.
The skill identifies structural debt; the PM decides whether to triage now or later.
```

## Why fix-forward, not rollback

Matches your existing build-agent discipline: never rollback commits, always fix forward. The simplify-review verdict is just another signal alongside test failures. Same response shape.

## Why escalate out-of-scope findings instead of fixing them

The skill is allowed to call out "this file already does four things" even when the diff only touched one of them. Letting the build agent autonomously decompose a file the ticket didn't ask it to touch breaks the planning firewall. Log it, escalate it, let the PM decide if it becomes a follow-up ticket.

## Install path

```
movers/.claude/skills/simplify-review/SKILL.md
```

The build agent picks it up automatically when working in the repo.

## Cowork mirror (optional)

If you want the same skill available in chat for pre-merge spot checks, zip the `simplify-review/` directory as `simplify-review.skill` and install it as a Cowork plugin. The Markdown is identical. The only difference is who invokes it — agent vs you.
