# pipeline-scaffold — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | user-supplied inputs (project name, app subdir, repo structure, tech stack, north stars) |
| **Writes** | full project skeleton (see Output below) — does not overwrite existing files |
| **Templates** | embedded in this workflow file |
| **Hands to** | `pipeline-router` — first session in the new project |


## Directory layout to produce

```
{project}/                     # Parent (local-only if two-repo, otherwise the repo)
├── CLAUDE.md                  # Thin: project facts only — no pipeline process
├── JOURNAL.md                 # Reverse-chron PM log
├── BUILD-LOG.md               # → symlink to {app}/BUILD-LOG.md (two-repo only)
│
├── product/
│   ├── foundation/            # Mission, north stars, ethics, platform promise
│   ├── exploration/           # Raw ideas, freeform incubation
│   ├── capabilities/          # Atomic user-facing capabilities
│   ├── systems/               # Tiered technical specs (T1/T2/T3)
│   ├── products/              # PM dashboard files (one per major system)
│   ├── specs/                 # Full platform specs
│   └── ui/                    # UI inventory + design language
│
├── AGENTS.md                  # Pipeline definition — project-wide, lives at root
│
├── planning/
│   ├── DECISIONS.md           # Architectural decision log
│   ├── bundles/               # Release packages (b1, b2, b3)
│   ├── scenarios/             # APPROVED scenarios
│   ├── scenarios-backlog/     # DRAFT scenarios
│   └── tech/                  # Technical research notes
│
├── development/
│   ├── DEVIATIONS.md          # Implementation drift log
│   └── tickets/
│       └── done/              # Completed tickets
│
└── {app}/                     # Application code (separate repo if two-repo)
    ├── .git/                  # Its own history (two-repo)
    ├── CLAUDE.md              # Tech stack + commands ONLY (no process)
    └── BUILD-LOG.md           # Source of truth for build state
```

**Notably absent:** no nested `CLAUDE.md` in `product/`, `planning/`, or `development/`. Process lives in skills.

## Steps

1. **Confirm inputs** — project name, app dir, single/two-repo, tech stack, north stars.
2. **Create the tree** — `mkdir -p` for all directories above.
3. **Write the thin root `CLAUDE.md`** — see template below.
4. **Write `JOURNAL.md`** with one initial entry: today's date + "Project scaffolded".
5. **Write `AGENTS.md` at project root** — see template in `templates/agents.md`. Lives at root (not under planning/) because it describes agents that work across product/, planning/, development/, web/.
6. **Write `planning/bundles/b1-mvp.md`** — see template in `templates/bundle.md`.
7. **Touch empty files** — `planning/DECISIONS.md`, `development/DEVIATIONS.md`.
8. **(Two-repo only)** — `cd {app} && git init`. Write `{app}/CLAUDE.md` (tech stack + commands only). Symlink root `BUILD-LOG.md` → `{app}/BUILD-LOG.md`.
9. **Run the verification checklist** in SKILL.md. Report any missing items.
10. **Tell the user** which skills to invoke next: `pipeline-product` to draft initial systems, then `pipeline-plan` to write b1 scenarios.

## Thin root CLAUDE.md template

```markdown
# {Project Name}

## Project Facts

- **Stack:** {framework / language / DB / etc.}
- **Repo structure:** {single-repo | two-repo with separate `{app}/`}
- **App path:** `./{app}`
- **North stars:**
  1. {north star 1}
  2. {north star 2}
  ...

## Pipeline

This project uses the four-agent pipeline. See:
- `pipeline-router` — orientation at session start
- `pipeline-product` — exploration, systems, capabilities
- `pipeline-plan` — scenarios, scope, approval
- `pipeline-build` — TDD ticket implementation
- `pipeline-eval` — acceptance test authoring + execution

## Project-specific patterns

- {Link to design language doc if/when created}
- {Anything genuinely unique to this project}

## Commit rules

{If two-repo: which repo gets which commits. Otherwise: the project's commit conventions.}
```

Keep this file under 60 lines. Anything longer is process leakage — move it to a skill.

## Hand off

**You produced:** the project skeleton.

**Tell the user:**
1. Run `./skills/install.sh` once if the pipeline skills aren't yet symlinked into `~/.claude/skills/`.
2. Open a new session and ask `pipeline-router` for orientation.
3. From there, start the PM cycle with `pipeline-product` — write the first system spec, including a canonical example in `product/needs/use-cases.md`.

**Next skill:** `pipeline-router` — first session in the new project.
