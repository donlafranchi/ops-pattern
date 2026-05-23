---
name: skills-housekeeping
description: Periodic sweep of skills/ — audits every skill workflow against the current pipeline contract (CLAUDE.md, AGENTS.md, the live authoritative-docs list). Surfaces skills referencing renamed files, skills missing newly-mandatory steps (e.g. STAGE-LEDGER stamps), skills whose responsibilities now duplicate another skill, retired-skill dirs lingering, broken cross-skill cites, and stale routing table entries. Use when the user says "audit the skills", "are the skills up to date", "skills housekeeping", "did the skills miss the new audit findings", "do any skills reference dead files", or at the end of any quiet period. Refuses to run during active pipeline work — checks quiescence first. Surfaces a single report; PM ratifies fixes one by one.
---

# skills-housekeeping

Project-resident maintenance skill. Sibling to `doc-housekeeping` for the `skills/` tree. Asks: *do all our skills still reflect how the pipeline actually works?*

The audit pattern this addresses: pipeline rules land in CLAUDE.md or a new STAGE-LEDGER, but the individual skill workflows don't get updated to match. Over time, skills drift from the contract they're supposed to enforce. This sweep catches that.

## When to use

- End of a quiet period — quiescence guard satisfied.
- User says "audit the skills", "are skills up to date", "skills housekeeping", "did the skills miss X".
- After a CLAUDE.md or AGENTS.md change that adds a new mandatory step.
- Monthly maintenance cycle, paired with `doc-housekeeping`.
- After absorbing an audit (like the 2026-05-22 one) — confirm every skill that should reflect the absorption actually does.

## When NOT to use

- During active pipeline work — refuses (quiescence guard).
- To investigate one specific skill — read it directly.
- To create or edit a single skill — that's the work of the PM or a focused session, not a sweep.

## Quiescence guard

Same three checks as `doc-housekeeping`:

1. `main` is up to date — no unmerged worktree branches with shippable commits ahead.
2. `planning/scenarios/` has no scenario pending review; `development/tickets/` has no open ticket.
3. `planning/OPEN-QUESTIONS.md` has no entry older than 14 days without a decision.

Fail-stop on any.

## Workflow

See `workflow.md`.

## Related skills

- `doc-housekeeping` — sibling sweep for the doc tree. Usually run first; skills cite docs, so doc cites should be current before auditing skill cites.
- `pipeline-router` — at session start, suggests this skill when quiescence detected.
- `pipeline-prune` — heft-focused; different concern.

## Hand off

**You produced:** a single report with sections per finding category. PM ratifies fixes one at a time; skill executes ratified fixes in the same session. Single commit at end.

**Next skill:** none. The PM continues, or invokes `pipeline-prune` if JOURNAL/DECISIONS heft is also a concern.
