---
name: tidy
description: Anti-sprawl sweeper. Three modes — triage-inbox (drain `_inbox/` one doc at a time), sweep-docs (periodic doc-tree audit for rot / drift / propagation gaps), sweep-skills (periodic skills/ audit for retired dirs / broken cites / mandatory-step coverage). Use when the user says "tidy", "sweep the docs", "audit the skills", "triage the inbox", "drain inbox", "anything rotting", "anything to archive", "where should this doc go", "is anything stale", or at the end of any quiet period. Refuses to run sweep-docs / sweep-skills during active pipeline work (quiescence guard). One doc / one finding at a time — never batch. Reads the doc tree, skills/, REGISTRY.md, MAP.md, TRACE.md, CLAUDE.md, AGENTS.md, git log, `~/.claude/skills/` symlinks. Writes nothing without PM ratification.
---

# tidy

Project-resident anti-sprawl skill. Folds in `doc-home-finder`, `doc-housekeeping`, and `skills-housekeeping` as three callable modes.

**The one question.** *What's stale, and what folds into what?*

## Modes

| Mode | Trigger | Quiescence required |
|---|---|---|
| **triage-inbox** | "triage the inbox", "drain inbox", "where does this go", "is this its own doc or part of X", `_inbox/` non-empty | No — runs anytime |
| **sweep-docs** | "sweep the docs", "doc housekeeping", "anything rotting", "propagation check", "anything to archive" | Yes |
| **sweep-skills** | "audit the skills", "skills housekeeping", "are the skills up to date", "do any skills reference dead files" | Yes |

When the user says just "tidy" without a mode hint: ask which mode, or default to triage-inbox if `_inbox/` is non-empty.

## Quiescence guard (sweep modes only)

Hard precondition for sweep-docs and sweep-skills. Refuses to proceed unless all three hold:

1. **`main` is up to date** — no unmerged worktree branches with shippable commits ahead of `main`.
2. **No in-flight features** — `planning/scenarios/` has no scenario whose review is pending; `development/tickets/` has no open (non-`done/`) ticket.
3. **Kanban lanes are coherent** — `planning/proposed/` doesn't hold items PM has already ratified; `planning/now/` doesn't hold stalled work. Lane membership is the state; PM moves files when ready.

If any fail, name the blocker, stop, do not proceed. triage-inbox runs without this guard.

## When NOT to use

- During active pipeline work for sweep modes — quiescence guard refuses.
- The doc is clearly an active spec / ADR / ticket / scenario — write it directly to its home.
- The doc is a draft of an ADR — invoke `memo` instead.
- The doc is a code file — wrong skill.
- To investigate one specific doc/skill — read it directly.

## Workflow

See [`workflow.md`](workflow.md) for the three sub-routines.

## Related skills

- `orient` — session-start drift check; will recommend tidy when quiescence + drift suggest it.
- `memo` — if a doc in `_inbox/` is an architectural decision, route there.
- `explore` — if a doc is a new system spec proposal, route there to write it properly.

## Hand off

**You produced:** depends on mode.

- **triage-inbox** — one doc moved (or folded), references updated, REGISTRY.md current.
- **sweep-docs** — a six-section report; PM-ratified fixes landed in same session; one commit (`docs(housekeeping): {YYYY-MM-DD} doc sweep`).
- **sweep-skills** — an eight-section report; PM-ratified fixes landed; one commit (`docs(skills): {YYYY-MM-DD} skills sweep`).

**Next skill:** none. PM continues, or chains tidy modes (often triage-inbox → sweep-docs → sweep-skills as a maintenance triplet).
