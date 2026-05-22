# Doc Consolidation — phase tickets

*Execution target: **Claude Code**. Each phase is one ticket, one commit. Run R01 → R10 in order.*

## What this is

Ten tickets that execute the **Doc Consolidation** effort. The approved plan is [`../consolidation-plan.md`](../consolidation-plan.md) — read it first; the tickets reference its merge map (section 2) rather than repeating it.

## Execution rules for the Claude Code agent

- **Parent repo only.** Every commit goes to `/Users/don/Projects/movers-makers-shakers/.git`. Never touch the `web/` repo.
- **Run in order.** R01 → R10. Later phases assume earlier moves are done.
- **One commit per phase**, straight to `main`, message `docs(consolidation): phase N — {what}`.
- **Preserve history** — use `git mv` for every move, never delete-and-recreate. If a `git mv` or `rm` fails with "Operation not permitted," you are not in Claude Code — stop and report.
- **The `housekeeping/` folder is committed** as the record of this effort. R01's commit brings it in. After that it is tracked like any other file.
- **Stage deliberately.** Use `git add -u` for edits to tracked files, plus explicit `git add` for new files. Run `git status` before each commit.
- **Merge phases produce drafts.** R05–R08 merge document *content*. That is judgment work — produce a clean first draft, flag anything uncertain with `[PM: confirm]`, and do not invent product strategy. The PM reviews each merge.
- **Stop and report** if a cross-reference grep returns far more hits than the ticket anticipates, or if a step is ambiguous. Do not improvise structural decisions.

## The ten phases

| Phase | Ticket | Risk |
|---|---|---|
| 1 | `R01-consolidate-archives.md` | low — pure moves |
| 2 | `R02-relocate-misplaced-files.md` | low |
| 3 | `R03-consolidate-planning-history.md` | low |
| 4 | `R04-dissolve-notes-scaffold-standards.md` | low |
| 5 | `R05-why-merge.md` | medium — content merge |
| 6 | `R06-systems-merge.md` | medium — content merge |
| 7 | `R07-capabilities-merge.md` | medium — content merge |
| 8 | `R08-build-needs-layer.md` | medium — new content |
| 9 | `R09-registry.md` | medium |
| 10 | `R10-trace-and-final-sweep.md` | medium |

## Rollback

Each phase is one commit. Undo any one with `git revert <hash>`. Undo everything by reverting R10 → R01 in reverse.

## After R10

`needs/people.md`, `needs/needs.md`, and the merged docs from R05–R07 ship as **drafts** for PM refinement. `TRACE.md` and `REGISTRY.md` become docs the PM keeps current. Report the ten commit hashes and any `[PM: confirm]` placeholders left behind.
