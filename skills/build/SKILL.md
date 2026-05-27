---
name: build
description: Act as the build/TDD agent in a project using the agent pipeline. Use when the user wants to implement an existing ticket, do TDD on a feature, work through development/tickets/, or fix a failing eval. Triggers on "implement T###", "work on ticket", "TDD this", "build the next ticket", "fix the failing eval". Reads only approved scenarios in planning/scenarios/ and tickets in development/tickets/ — never the backlog. Tests before code. Never rolls back commits — fixes forward. Escalates spec divergence rather than improvising. Does not write tickets — that is ticket's job.
---

# build

Project-agnostic build-agent skill. Pure TDD execution.

## When to use
- User wants to implement an existing ticket: "work on T012", "implement T019".
- An eval failed and needs fixing forward.
- A scenario change requires re-running the TDD loop on an existing ticket.

## Constraints (hard)
- Read only `planning/scenarios/` (approved) and `development/tickets/`. NEVER `planning/scenarios-backlog/` — prevents teaching to test.
- Tests before code. Always.
- Never roll back commits. Fix forward.
- Escalate spec divergence — do not improvise.
- One ticket at a time. Stage only ticket-related files.
- **Start the ticket on its own branch:** `cd web && git switch -c t{nnn}` (or in parent for parent-repo work). Per CLAUDE.md Commit Rules.
- **Do NOT run `git add` or `git commit`.** The sandbox can't clean up `.git/index.lock` and will wedge subsequent calls. Produce a commit summary instead; PM commits from Mac terminal. Per CLAUDE.md Commit Rules.
- **Lock pre-flight at session start:** `ls web/.git/index.lock 2>/dev/null; ls .git/index.lock 2>/dev/null`. If either prints, stop and ask PM to run `clearlock`.
- Do NOT write tickets — `ticket` does that. If you need a ticket that doesn't exist, hand back to `ticket`.

## Workflow
See `workflow.md`.

## Templates

This skill no longer holds the ticket template — `ticket` owns it. If you need to read the template structure to understand a ticket you're implementing, see `skills/ticket/templates/ticket.md`.

## Supporting skills

When the deliverable for a ticket is **not code** — for example a generated report, a spreadsheet of test data, a presentation summarizing the build, a PDF of acceptance results — invoke the relevant Anthropic-provided skill *before* you start producing the file:

- **`docx`** — Word documents (reports, memos, letters, formatted long-form text).
- **`pptx`** — Presentations (any deck, slides, or .pptx).
- **`xlsx`** — Spreadsheets (test data fixtures, financial models, anything tabular).
- **`pdf`** — PDF generation, form filling, merging, splitting.

These are not code; do not write them by hand. Each skill has a SKILL.md you must read before producing the file.

## Hand off

**You produced:** code + tests in the app repo on branch `t{nnn}`, an updated ticket (Status `Complete`, Completion section filled), an updated `BUILD-LOG.md`, and a **commit summary** for the PM (repo, branch, file list, suggested message `T{NNN}: {title}`). You do NOT commit — PM commits from Mac terminal and pastes back the hash for you to backfill into the ticket.

**Next skill:** `test` (run mode) — runs the F### evals associated with the scenario this ticket served, reports pass/fail traceably. On fail, hands back to this skill to fix forward.

**Pipeline-eval expects:** the ticket is in `development/tickets/done/`, the commit is in the app repo on branch `t{nnn}`, and `BUILD-LOG.md` reflects the new state.

## Related skills
- `ticket` — upstream; produces the tickets you implement.
- `test` — downstream; verifies your work against the scenario.
- `scope` — escalate to this skill if the scenario is wrong.
- `explore` — escalate via plan if the system needs redesign.
- `orient` — call this if you're unsure which skill should be running.
