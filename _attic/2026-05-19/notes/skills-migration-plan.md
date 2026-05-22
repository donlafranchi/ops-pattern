# Skills Migration Plan

Convert the project's design → plan → develop → test pipeline (currently encoded in 5 nested `CLAUDE.md` files plus `~/.claude/templates/`) into a project-agnostic set of Claude skills usable from any project.

## Goals

1. Process lives in skills, not in nested `CLAUDE.md` files.
2. Skills are project-agnostic — no Main Street references.
3. Each project keeps **one** thin root `CLAUDE.md` holding only project facts (name, tech stack, paths, north stars).
4. Skills auto-trigger on intent ("write a scenario for X", "implement T123") rather than requiring manual reads.

## Inventory: what gets converted

| Current source | Becomes | Notes |
|---|---|---|
| Root `CLAUDE.md` (router, scaffold rules, pipeline overview) | `pipeline-router` skill + thin per-project `CLAUDE.md` | Process moves to skill; project facts stay in CLAUDE.md |
| `product/CLAUDE.md` (dreamer role, system/capability templates) | `pipeline-product` skill | |
| `planning/CLAUDE.md` (5 Deadly Sins filter, scenario template, naming rules) | `pipeline-plan` skill | Named `pipeline-plan` to avoid collision with existing `planning-filter` skill |
| `development/CLAUDE.md` (TDD workflow, ticket template, escalation rules) | `pipeline-build` skill | |
| `web/CLAUDE.md` (tech stack, commands) | Stays as project file, simplified | This is genuinely project-specific |
| Evaluator agent (defined in `planning/AGENTS.md`) | `pipeline-eval` skill | |
| `~/.claude/templates/scaffold-new-project.md` | `pipeline-scaffold` skill | |
| `~/.claude/templates/agent-pipeline-example.md` | Reference doc inside `pipeline-router` skill | |

## Target skill set (6 skills, all prefixed `pipeline-`)

| Skill | Triggers when user says... | Replaces |
|---|---|---|
| `pipeline-router` | "what's the pipeline", "how does this project work", on session start | Root CLAUDE.md (process portion) |
| `pipeline-product` | "explore", "write a system / capability / product file", "dream up" | product/CLAUDE.md |
| `pipeline-plan` | "write a scenario", "filter the backlog", "approve scenarios", "scope a bundle" | planning/CLAUDE.md |
| `pipeline-build` | "implement T###", "work on ticket", "TDD this" | development/CLAUDE.md |
| `pipeline-eval` | "write evals", "run evals for F###", "verify acceptance criteria" | Evaluator role from AGENTS.md |
| `pipeline-scaffold` | "scaffold a new project", "set up the agent pipeline", "start a new project" | ~/.claude/templates/scaffold-new-project.md |

## Skill structure

Each skill is a directory under `skills/` with this layout:

```
skills/pipeline-{role}/
├── SKILL.md          # YAML frontmatter + description + when-to-trigger
├── workflow.md       # Step-by-step process
├── templates/        # File templates (scenario, ticket, system, etc.)
└── references.md     # Links to canonical patterns the skill expects
```

**SKILL.md frontmatter shape:**

```yaml
---
name: pipeline-{role}
description: {Trigger-rich description — what the user says to invoke this}
---
```

Descriptions must be **trigger-rich** and **project-agnostic**: list the verbs and nouns a user would say in any project (e.g., "scenarios", "acceptance criteria", "TDD", "tickets") — never "Main Street" or specific feature names.

## Project-specific config: thin root CLAUDE.md

Each project keeps a single `CLAUDE.md` at the root with this shape:

```markdown
# {Project Name}

## Project Facts
- **Stack:** {tech stack}
- **App path:** {./web, ./mobile, etc.}
- **Repo structure:** {single-repo / two-repo with separate {app}/}
- **North stars:** {1-5 bullet points unique to this project}

## Pipeline
This project uses the agent pipeline. See:
- `pipeline-router` skill for orientation
- `pipeline-product`, `pipeline-plan`, `pipeline-build`, `pipeline-eval` for role-specific work
- `pipeline-scaffold` to bootstrap new projects

## Project-specific patterns
- {Link to design language doc, if any}
- {Link to system docs, if any}
- {Anything genuinely unique to this project}
```

That's it. No nested CLAUDE.md files. No re-stating the pipeline. No template duplication.

## Migration steps

### Phase 1 — scaffold skills (this session)
1. Create `skills/` at project root with 6 subdirectories.
2. Each gets a `SKILL.md` stub: name, draft description, placeholders for workflow/templates.
3. Symlink `skills/` → `~/.claude/skills/pipeline-*` so they're globally available.

### Phase 2 — fill skill bodies (per-skill, one at a time)
For each skill in this order — `pipeline-plan`, `pipeline-build`, `pipeline-product`, `pipeline-eval`, `pipeline-router`, `pipeline-scaffold`:

1. Move the corresponding `CLAUDE.md`'s **process content** into the skill (workflow, templates, naming conventions, escalation rules).
2. Strip Main Street references — generalize names ("the app", "the project").
3. Move templates (scenario, ticket, system, capability) into `skills/pipeline-{role}/templates/`.
4. Test by invoking from another project (or a fresh test directory) and verify the skill triggers correctly without project-specific context.

### Phase 3 — collapse the nested CLAUDE.md files
1. Replace root `CLAUDE.md` with the thin version (project facts only).
2. Delete `product/CLAUDE.md`, `planning/CLAUDE.md`, `development/CLAUDE.md`.
3. Simplify `web/CLAUDE.md` to tech stack + commands only (no process duplication).
4. Update `JOURNAL.md` with the migration entry.

### Phase 4 — verify
1. Open a fresh session. Confirm skills auto-trigger on the right phrases.
2. Walk one full pipeline lap (write capability → write scenario → approve → write ticket → implement → eval) using only skills.
3. Open a different project, run `pipeline-scaffold`, verify a new project boots correctly with only the thin root CLAUDE.md.

## Acceptance criteria

- [ ] 6 skills exist under `skills/` and are symlinked into `~/.claude/skills/`.
- [ ] Every skill triggers on its target phrases without manual `Read` of any CLAUDE.md.
- [ ] Skills contain zero references to "Main Street", "movers-makers-shakers", or specific feature names.
- [ ] Project root has exactly one `CLAUDE.md` (under 60 lines).
- [ ] `product/CLAUDE.md`, `planning/CLAUDE.md`, `development/CLAUDE.md` are deleted.
- [ ] `web/CLAUDE.md` contains only tech-stack + commands (no pipeline process).
- [ ] `pipeline-scaffold` produces a working pipeline directory in a fresh project.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Skill description too narrow → fails to trigger | After Phase 2, run skill-creator's eval mode against trigger phrases |
| Project facts leak into skills | Code review pass after Phase 2; grep for project name |
| Existing `planning-filter` Anthropic skill collides with our planning role | Use `pipeline-plan` name; keep `planning-filter` for raw idea filtering as it currently does |
| Two-repo structure assumption baked into skills | Make repo structure a parameter; `pipeline-build` should ask "single or two-repo?" if not stated |
| Losing the design language reference (web/CLAUDE.md) | Keep that file; it's project-specific, not process |

## Out of scope

- Converting individual product files (mission, north-stars, etc.) — those are content, not process.
- Plugin marketplace packaging — global symlinks first; revisit if multi-machine sharing becomes a need.
- Replacing the existing Anthropic `planning-filter` skill — that's a different tool with a different purpose.
