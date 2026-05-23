---
name: doc-housekeeping
description: Periodic sweep of the documentation tree — finds untracked root docs, broken or missing frontmatter, REGISTRY drift, naming inconsistencies, completed housekeeping efforts ready to archive, and propagation gaps (spec changed but cites weren't updated). Use when the user says "doc housekeeping", "sweep the docs", "is anything rotting", "any docs need attention", "propagation check", "what changed and what needs to follow", "anything to archive", or at the end of any quiet period. Reads every .md and .html in product/, planning/, development/, standards/, housekeeping/, and root. Cross-references REGISTRY.md, MAP.md, TRACE.md, and git log. Refuses to run during active pipeline work — checks quiescence first. Surfaces a single report; PM ratifies fixes one by one.
---

# doc-housekeeping

Project-resident maintenance skill. Periodic sweep that finds doc rot — untracked drift, stale cites, completed efforts ripe for archive, naming inconsistencies. Sibling to `pipeline-prune` (which focuses on JOURNAL + DECISIONS heft) and `skills-housekeeping` (which audits skills against the live pipeline contract).

## When to use

- End of a quiet period — no active scenario, no open tickets, branches caught up.
- User says "doc housekeeping", "sweep the docs", "what's rotting", "propagation check".
- Monthly maintenance cycle.
- Before any consolidation effort — sweep first to know the starting state.

## When NOT to use

- During active pipeline work — the quiescence guard refuses. Drain the work, then sweep.
- When `_inbox/` is non-empty — run `doc-home-finder` first; this skill assumes triage is current.
- To investigate one specific doc — read that doc directly.

## Quiescence guard

Hard precondition. Refuses to proceed unless all three hold:

1. **`main` is up to date** — no unmerged worktree branches with shippable commits ahead of `main`.
2. **No in-flight features** — `planning/scenarios/` has no scenario whose review is pending; `development/tickets/` has no open (non-`done/`) ticket.
3. **`planning/OPEN-QUESTIONS.md` is drained** — every entry annotated with a PM decision, or no entry older than 14 days.

If any precondition fails, name what's blocking and stop. The PM resolves the blocker, then re-invokes.

## Workflow

See `workflow.md`.

## Related skills

- `pipeline-router` — at session start, the router can suggest invoking this skill when it detects quiescence.
- `doc-home-finder` — single-doc triage. Run before this skill if `_inbox/` is non-empty.
- `skills-housekeeping` — sibling sweep for skills/. Often run in the same maintenance window.
- `pipeline-prune` — heft-focused. Different concern (JOURNAL + DECISIONS scannable weight); often paired.

## Hand off

**You produced:** a single report with sections per finding category. Each finding has a proposed action; PM ratifies actions one at a time. The skill executes ratified actions in the same session.

**Next skill:** likely `skills-housekeeping` next, then `pipeline-prune`. Run as a triplet during quiet maintenance windows.
