---
name: orient
description: Orient at the start of a session in any project using the cowork pipeline. Reads JOURNAL, the active bundle, the stage ledger, the spec-patches queue, and runs the audit-derived drift checklist. Folds in two former skills as sub-routines — JOURNAL/DECISIONS pruning (when heavy) and bundle/work-map resync (when a sub-bundle has closed). Use when the user says "where are we", "what's the state of this project", "what's next", "what needs attention", "what drifted since last session", "prune the journal", "resync the work map", or at the start of any pipeline work to determine which downstream skill applies. Reads root CLAUDE.md, JOURNAL.md, active bundle, AGENTS.md, STAGE-LEDGER, SPEC-PATCHES, planning kanban (`proposed/`, `next/`, `now/`, `later/`), DECISIONS, work-map, BUILD-LOG, recent done tickets, `_inbox/`. Writes nothing by default; on PM ratification, the folded sub-routines may write JOURNAL / DECISIONS / archive files (prune) or `bundle-themes.md` / `b{N}-work-map.md` (resync).
---

# orient

Project-agnostic orientation skill. Routes work to the right pipeline role. Folds in two former skills (`pipeline-prune`, `pipeline-bundle-resync`) as sub-routines that fire when the session-start checklist flags heaviness or sub-bundle drift.

## When to use

- Start of any session in a project that uses the cowork pipeline.
- User asks "what's going on", "what's next", "where did we leave off", "what drifted".
- User asks "prune the journal", "DECISIONS is heavy", "resync the work map", "what's drifted since last sub-bundle" — these route here and trigger the folded sub-routines.
- Before invoking `explore`, `scope`, `build`, or `test` — confirm the right role first.

The session-start check includes a **registry-conformance step**: if the project has a `REGISTRY.md` at the root, verify every narrative `.md` carries front-matter (`purpose` + `layer` + `status`), has a row in the registry, and that no row points at a missing file. Surface gaps as flags — lightweight orientation, not enforcement.

## Workflow

See [`workflow.md`](workflow.md). The two folded sub-routines (steps 10 + 11) only fire on PM ratification.

## Related skills

- `explore` — exploration, systems, capabilities
- `scope` — scenarios, scope, approval
- `weigh` — close-call adjudication, absolute ratification, Intent gap audit, dialectic
- `review` — architecture + design + security + a11y pre-flight on approved scenarios
- `memo` — decision memos (ADR-shaped)
- `ticket` — break approved scenarios into implementable tickets
- `build` — TDD ticket implementation
- `test` — acceptance test authoring + execution
- `tidy` — anti-sprawl sweeper (triage-inbox / sweep-docs / sweep-skills)
- `scaffold` — set up a new project with this pipeline

## Hand off

**You produced:** orientation. Possibly an updated `JOURNAL.md` entry if you observed drift. In folded prune mode (step 10): trimmed JOURNAL.md / DECISIONS.md + archive files. In folded resync mode (step 11): updated `bundle-themes.md` + `b{N}-work-map.md`.

**Next skill:** whichever the routing table in `workflow.md` points to. Do not implement; route and hand off.
