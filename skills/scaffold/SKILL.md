---
name: scaffold
description: Scaffold a brand-new project that uses the four-agent pipeline (Product → Planning → Development → Evaluation). Use when the user says "start a new project", "scaffold a new project with the pipeline", "set up the agent pipeline here", "bootstrap project structure". Produces the directory tree, initial files (CLAUDE.md, JOURNAL.md, AGENTS.md, b1 bundle, DECISIONS.md, DEVIATIONS.md), and confirms the layout. Asks for project name, app subdirectory name, single-vs-two-repo, and tech stack before scaffolding. Never overwrites existing files without confirmation.
---

# scaffold

Project-agnostic skill that bootstraps a project for the four-agent pipeline.

## When to use
- User starts a new project and wants the pipeline structure.
- User has an existing project but no pipeline scaffold.

## Required inputs (ask before scaffolding)

1. **Project name** (kebab-case, used for the directory name).
2. **App subdirectory name** (typically `web`, `mobile`, `api`).
3. **Repo structure** — single repo or two-repo (parent local + app pushed).
4. **Tech stack** — short description (framework, language, DB).
5. **North stars** — 1–5 short statements of what this project is for.

## Workflow
See `workflow.md`.

## Output
- Directory tree per the layout in `workflow.md`.
- Thin root `CLAUDE.md` (project facts only — no pipeline process; that lives in skills).
- `JOURNAL.md` with an initial entry.
- `AGENTS.md`, `planning/DECISIONS.md`, `planning/bundles/b1-{name}.md`.
- `development/DEVIATIONS.md`.
- Empty directories: `product/{foundation,exploration,capabilities,systems,products,specs,ui}`, `planning/{scenarios,scenarios-backlog,tech}`, `development/tickets/done/`.
- (If two-repo) `BUILD-LOG.md` symlink at root → `{app}/BUILD-LOG.md`.

## Verification checklist
After scaffolding, confirm:

- [ ] Single root `CLAUDE.md` (under 60 lines, project facts only).
- [ ] `JOURNAL.md` with initial entry.
- [ ] `AGENTS.md` with the four-agent pipeline definitions.
- [ ] `planning/bundles/b1-*.md` with hypothesis, scope, deferred, success metrics.
- [ ] `planning/scenarios/` and `planning/scenarios-backlog/` exist (empty).
- [ ] `development/tickets/done/` exists.
- [ ] `product/{foundation,exploration,capabilities,systems,products}` exist.
- [ ] (Two-repo) `{app}/.git/` exists and `BUILD-LOG.md` symlink resolves.
- [ ] No nested `CLAUDE.md` files in `product/`, `planning/`, `development/` — process lives in skills.

## Hand off

**You produced:** the project skeleton — directories, `CLAUDE.md`, `JOURNAL.md`, `AGENTS.md`, `bundles/b1-*.md`, `DECISIONS.md`, `DEVIATIONS.md`, optional `BUILD-LOG.md` symlink.

**Next skill:** `orient` — orient a session in the new project. From there, the PM cycle starts with `explore` writing the first system spec.

**You do NOT:** install the pipeline skills globally on the user's machine — that's a one-time `./skills/install.sh` from the user. Surface the install command if the user hasn't run it yet.

## Related skills
- `orient` — invoked first in any new session in the scaffolded project.
- `explore` — writes the first system specs.
