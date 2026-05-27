# doc-housekeeping — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | every `.md` and `.html` under `product/`, `planning/`, `development/`, `standards/`, `housekeeping/`, and root; `REGISTRY.md`, `product/MAP.md`, `product/TRACE.md`, `CLAUDE.md`; `git log` for change dates |
| **Writes** | a single in-session report; on PM ratification per finding: `git mv`, frontmatter fixes, REGISTRY edits, archive moves |
| **Templates** | none |
| **Hands to** | `skills-housekeeping` (sibling sweep), then `pipeline-prune` (heft) |

## Quiescence guard

Before reading anything else, run these three checks. Fail-stop on any.

1. `git -C {parent} status -uno` shows clean working tree on `main`; `git -C {parent} branch -v` shows no unmerged worktree branches with commits ahead of `main`.
2. `ls planning/scenarios/*.md` returns empty (or every file in there has a corresponding `planning/history/F{NNN}-review.md` with verdict landed); `ls development/tickets/*.md` (top level, not `done/`) returns empty.
3. `planning/OPEN-QUESTIONS.md` has no entry older than 14 days without a `Decided:` or `Deferred:` annotation.

If any fail: name the blocker (which check, which file), stop, do not proceed to the sweep.

## Sweep — six findings categories

Walk in order. Report per category.

### 1. Untracked root docs

`ls *.md *.html` at repo root. Allowed set: `CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md` (if present at root rather than product/), `TRACE.md` (same), `REGISTRY.md`, `BUILD-LOG.md` (symlink). Anything else → propose move to `_inbox/` for triage by `doc-home-finder`, or directly to a home if obvious.

### 2. Frontmatter validity

For every `.md` under `product/`, `planning/`, `development/`, `standards/`, `housekeeping/`:

- Has YAML frontmatter at top? (Excluding `_attic/`, `web/`, `skills/`, `.claude/`.)
- Has `purpose:` line? Non-empty?
- Has `layer:` line? Value in `{why, what, how}`?
- Has `status:` line? Value in `{draft, active, deferred, complete, historical, triage}`?

Surface per-file violations as a single list.

### 3. REGISTRY drift

- Every doc that should be in REGISTRY (per the criteria in `pipeline-router` step 9) has a row?
- Every REGISTRY row points at an existing file?
- Every row's `purpose` matches the file's frontmatter `purpose`?

Surface mismatches as: "doc missing from REGISTRY", "REGISTRY row points at moved file", "REGISTRY purpose drifted from frontmatter."

### 4. Naming consistency

Walk every doc and check against the naming convention in CLAUDE.md:

- Active specs: `kebab-case.md`, no date.
- Dated work products: `housekeeping/YYYY-MM-DD-{slug}/`.
- ADRs: `ADR-NNNN-{slug}.md`.
- Tickets: `T###-{slug}.md`.
- Reviews: `F###-review.md`.

Surface violations as proposed renames. Do not auto-rename — many cites would break.

### 5. Completed housekeeping efforts

Walk `housekeeping/*/README.md`. Any directory whose README has `status: complete` AND no file has been modified in >30 days → propose archive to `_attic/{date}/housekeeping-{slug}/`. Do not auto-move — the PM may still cite the absorption history.

### 6. Propagation check

This is the new mechanism. For every doc under `product/` and `planning/` (the spec layer):

- Read `git log -1 --format=%cI {file}` — get the last modified date.
- Grep the repo for cites of the file's path or filename.
- For every cite, check the citing file's last-modified date. If the citing file is **older than** the cited file's last modification, surface as a possible propagation gap: *"`{spec}` changed on YYYY-MM-DD; `{cite-source}` (last touched YYYY-MM-DD) cites it and may need review."*

Do not auto-update. Many cites are stable (a ticket's `Scenario:` line doesn't need updating when the scenario body changes). The PM judges which to follow.

**Reverse propagation:** for every cite in CLAUDE.md, AGENTS.md, MAP.md, TRACE.md, REGISTRY.md, confirm the target file exists. Broken cite → surface for fix.

## Report shape

Single document, six sections (one per category above). Each finding includes:

- File(s) involved.
- One-line description of the issue.
- Proposed action.

No prose preamble. PM reads top-down and ratifies (or skips) each finding.

## Execution

For each ratified finding:

- Frontmatter fixes → edit in place.
- File moves → `git mv` + update REGISTRY + grep-and-update back-references.
- Archive moves → `git mv` to `_attic/` + leave a one-line stub if anything cites the original path.
- Propagation acknowledgments → no file change; PM may write a JOURNAL entry confirming reviewed-no-action.

Commit at the end with `docs(housekeeping): {YYYY-MM-DD} doc sweep — {N} findings landed`.

## Refusals

- Refuse to proceed if the quiescence guard fails.
- Refuse to auto-rename. Renames break cites; propose, don't execute.
- Refuse to delete. Always archive, never delete.
- Refuse to act on a finding without PM ratification.

## Hand off

**You produced:** a report of six categories of findings, with PM-ratified fixes landed in the same session, a commit, and an updated REGISTRY.md.

**Next skill:** `skills-housekeeping` to sweep the skill workflows for the same kinds of drift, then `pipeline-prune` if JOURNAL or DECISIONS is heavy.
