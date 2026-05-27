# skills-housekeeping — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | every `SKILL.md` and `workflow.md` under `skills/`; `CLAUDE.md` (especially § Agent routing + § Rebuild phase rules); `AGENTS.md`; `REGISTRY.md`; `skills/README.md`; `skills/install.sh`; `~/.claude/skills/` for symlink integrity |
| **Writes** | a single in-session report; on PM ratification per finding: edit skill workflows, `git mv` retired skills to `_attic/`, update routing tables, re-run `skills/install.sh` if needed |
| **Templates** | none |
| **Hands to** | nothing — PM continues |

## Quiescence guard

Same three checks as `doc-housekeeping`. Fail-stop on any. (See that skill's workflow.md.)

## Sweep — eight findings categories

### 1. Retired-skill dirs on disk

`ls skills/` → cross-reference against CLAUDE.md § Agent routing table and AGENTS.md. Any skill directory not listed in the routing table → propose move to `_attic/{date}/retired-skills/`.

### 2. Global symlink integrity

`ls -la ~/.claude/skills/` → for every symlink, confirm the target exists. Broken symlink → propose `rm` + re-run `skills/install.sh`. If a symlink points at a skill that was moved to `_attic/`, the symlink should be removed (the cleanup `skills/install.sh` doesn't do automatically).

### 3. New-mandatory-step coverage

For every rule in CLAUDE.md § Rebuild phase rules tagged `MANDATORY`, identify which skills should enforce it. Confirm each enforcing skill's workflow contains the step.

Example checks (extend as new rules land):
- STAGE-LEDGER stamp → must appear in `pipeline-plan`, `pipeline-review`, `pipeline-ticket`, `pipeline-build`, `pipeline-eval` workflows.
- SPEC-PATCHES append → must appear in `pipeline-build` Hand off.
- Substrate lane contract → must appear in `pipeline-ticket` workflow.
- Drift check → must appear in `pipeline-router` workflow.
- Gate A (unratified absolutes) → must appear in `pipeline-plan` workflow.
- Gate B (unratified absolutes pre-ticket) → must appear in `pipeline-ticket` workflow.
- Sibling-scenario check → must appear in `pipeline-review` workflow.

Surface any skill that lacks a step it should have.

### 4. Broken doc cites in skills

For every `[link](path)` or `\`path\`` reference inside a skill workflow:

- Does the target file exist at the cited path?
- If not, propose either a path fix or removing the cite.

Common drift: skills citing `_attic/2026-05-19/...` for files that moved.

### 5. Cross-skill cite integrity

For every "see `{skill}`" or "route to `{skill}`" in a workflow, confirm the named skill still exists in `skills/`. Skills citing retired siblings → propose update.

### 6. Routing table sync

CLAUDE.md § Agent routing has a table mapping user intent → skill. Walk it:

- Every skill named in the table actually exists in `skills/`.
- Every skill in `skills/` (other than meta-skills like this one) has at least one row in the table.
- Each row's trigger text is consistent with the skill's SKILL.md description.

### 7. SKILL.md description currency

For every `SKILL.md` description field:

- Does it still match what `workflow.md` actually does?
- Does it list trigger phrases that map to current user vocabulary?
- Has it drifted from the workflow's actual scope (workflow grew; description didn't)?

Surface drift; do not auto-rewrite — descriptions are part of the skill's trigger surface.

### 8. Duplicate / overlapping skills

Pairs of skills whose descriptions overlap significantly. Audit-flagged example: `pipeline-clarify-absolutes` + `pipeline-review-absolute` + `pipeline-ratify-absolute` (resolved by retirement). Surface any new overlap that's emerged.

## Report shape

One document, eight sections (one per category). Each finding:

- Skill(s) involved.
- File:line where the issue is.
- One-line description.
- Proposed action.

PM reads top-down; ratifies each.

## Execution

For each ratified finding:

- Workflow edits → edit in place.
- Retired-skill moves → `git mv skills/{name} _attic/{date}/retired-skills/{name}` + remove the global symlink + update CLAUDE.md routing table + update `skills/README.md`.
- Routing-table edits → edit CLAUDE.md.
- Description edits → edit `SKILL.md`.

Commit at end with `docs(skills): {YYYY-MM-DD} skills sweep — {N} findings landed`.

## Refusals

- Refuse to proceed if the quiescence guard fails.
- Refuse to delete a skill. Always archive.
- Refuse to rewrite a SKILL.md description without PM ratification — descriptions affect when the skill triggers.
- Refuse to add new mandatory steps to a skill unless the corresponding rule is already in CLAUDE.md or AGENTS.md. This sweep enforces existing contracts; it doesn't author new ones.

## Hand off

**You produced:** a sweep report; ratified fixes landed in skills/, CLAUDE.md, and possibly global symlinks; one commit.

**Next skill:** none. PM continues.
