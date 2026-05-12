# Pipeline skills

Project-agnostic skills implementing the four-agent pipeline (Product → Planning → Development → Evaluation).

## Skills

| Skill | Role |
|---|---|
| `pipeline-router` | Session-start orientation. Reads JOURNAL, bundle, north stars; routes to the right downstream skill. |
| `pipeline-product` | Dreamer. Writes capabilities, tiered systems (T1/T2/T3), product files. |
| `pipeline-plan` | Filter. Applies 5 Deadly Sins; writes user-story-shaped scenarios anchored to canonical examples. |
| `pipeline-review` | Architecture + design pre-flight on an approved scenario. Optional. Verdicts: PROCEED, REVISE, EXTEND. |
| `pipeline-ticket` | Sequencer. Breaks approved scenarios into ordered, session-sized tickets. Reads scenarios + the review (if any), never code. |
| `pipeline-build` | Builder. TDD implementation of existing tickets. Does not write tickets. |
| `pipeline-eval` | Verifier. Translates Given/When/Then into automated tests; runs and reports. Write mode never reads code. |
| `pipeline-scaffold` | Bootstraps a new project with the pipeline structure. |

## Install (global)

These skills live in this project but are exposed globally via symlink so any project on this machine can use them.

```bash
# Project pipeline skills only:
./skills/install.sh

# Project pipeline skills + Cowork plugin skills the pipeline calls
# (engineering, design, product-management, anthropic-skills):
./skills/install.sh --with-plugins

# Verify:
ls -la ~/.claude/skills/ | grep pipeline-
claude plugin list   # if --with-plugins was used
```

The install script is idempotent — safe to re-run after adding a new pipeline skill or updating an existing one. If it reports `skip` for a name, a real file (not a symlink) is in the way; remove it manually if you want to replace it.

External skills the pipeline calls in (architecture, code-review, accessibility-review, write-spec, etc.) are documented in [`EXTERNAL-SKILLS.md`](EXTERNAL-SKILLS.md).

## Usage

Skills auto-trigger on intent in any project. The user does not need to read any nested CLAUDE.md.

- "what's the state of this project" → `pipeline-router`
- "explore X" / "write a system for Y" → `pipeline-product`
- "write a scenario for Z" / "approve scenarios" / "user story for" → `pipeline-plan`
- "review F018" / "architecture check on F018" / "design review F018" → `pipeline-review`
- "write tickets for F018" / "break F018 into tickets" → `pipeline-ticket`
- "implement T012" / "TDD this" → `pipeline-build`
- "write evals for F003" / "run evals" → `pipeline-eval`
- "scaffold a new project" → `pipeline-scaffold`

## The PM cycle

```
product → plan → review (optional) → eval-write ┐
                                                ├→ build → eval-run
                                       ticket ──┘            ↓
                              ┌───── on fail ─────  fix forward (build)
                              ↓
                          on pass: PM picks next
```

- `pipeline-review` is optional but recommended for any scenario that introduces a new surface, component, event type, or schema. Verdicts: PROCEED (continue), REVISE (back to plan), EXTEND (back to product).
- `pipeline-eval` (write) and `pipeline-ticket` run in parallel, both from the approved scenario. Eval doesn't see tickets or code; ticket doesn't see the eval spec. That separation is what makes evals trustworthy.

## Project-specific config

Each project keeps a single thin `CLAUDE.md` at its root (under 60 lines) holding only project facts: name, tech stack, repo structure, north stars. The skills read this for project-specific context. Nested CLAUDE.md files in `product/`, `planning/`, `development/` are not needed — process lives in skills.
