# Pipeline skills

Project-agnostic skills implementing the four-agent pipeline (Product → Planning → Development → Evaluation).

## Where to run these — Claude Code vs Cowork

The pipeline-* skills are project-local — they live in `skills/` and are exposed globally via `./skills/install.sh` symlinks. **Claude Code** auto-discovers them; **Cowork** does NOT — Cowork sees only its plugin marketplace (`anthropic-skills`, `engineering`, `design`, `brand-voice`, etc.) and any session-uploaded skills. So which tool to run a pipeline-* skill in is a function of friction, not capability:

- **Run in Claude Code** when the skill needs the user's shell (npm, supabase CLI, playwright, git ops with no lock-file friction), runs tests against localhost services, or edits/commits app code. The `pipeline-build` TDD loop and `pipeline-eval` run-mode are the canonical Claude Code skills — Cowork's sandbox can't reach the user's local Supabase or commit cleanly without the `clearlock` dance.
- **Run in Cowork** when the skill is markdown-heavy spec work (scenario writing, ticket authoring, ADRs, dialectic skills) and you want the surrounding tooling — MCP connectors (Slack, Notion, Linear, Granola, etc.), doc/sheet/deck generation, scheduled tasks, live artifacts, brand-voice and design-* plugin skills, web research. Cowork doesn't auto-load the project-local skill, so invoke its bundled `anthropic-skills:<name>` equivalent or paste the workflow inline.
- **Either** works for most markdown-only skills — pick by whether you need surrounding tooling (Cowork) or repo proximity (Claude Code).

The two columns in the table below capture the recommendation. *"Both"* means the skill is markdown-only and the choice is preference.

## Skills

| Skill | Role | Best home |
|---|---|---|
| `pipeline-router` | Session-start orientation. Reads JOURNAL, bundle, north stars; routes to the right downstream skill. | Both — slight Cowork preference (MCPs handy for status checks) |
| `pipeline-product` | Dreamer. Writes capabilities, tiered systems (T1/T2/T3), product files. | Cowork (research-heavy; web search + connectors useful) |
| `pipeline-plan` | Filter. Applies 5 Deadly Sins; writes user-story-shaped scenarios anchored to canonical examples. | Cowork (markdown-only; plays well with brainstorming skills) |
| `pipeline-review` | Architecture + design pre-flight on an approved scenario. Optional. Verdicts: PROCEED, REVISE, EXTEND. | Both — Cowork pairs naturally with `engineering:architecture` + `design:design-critique` plugin skills |
| `pipeline-ticket` | Sequencer. Breaks approved scenarios into ordered, session-sized tickets. Reads scenarios + the review (if any), never code. | Both — Cowork if you want the doc tooling alongside; Claude Code if you're about to go straight to build |
| `pipeline-build` | Builder. TDD implementation of existing tickets. Does not write tickets. | **Claude Code (mandatory in practice)** — needs shell, tests, git without lock friction |
| `pipeline-eval` | Verifier. Translates Given/When/Then into automated tests; runs and reports. Write mode never reads code. | **Claude Code** — write mode benefits from repo context; run mode needs local Supabase reachable |
| `pipeline-scaffold` | Bootstraps a new project with the pipeline structure. | Claude Code (creates directory tree + git repos + symlinks) |
| `pipeline-prune` | Journal / DECISIONS hygiene — rotate, memorialize, prune. | Cowork (pure markdown work; doc-generation skills handy for the rotated archive) |
| `pipeline-bundle-resync` | Sub-bundle work-map maintenance after sub-bundle slip. | Cowork (markdown-only) |
| `pipeline-intent-check` | Audit markdown for Category-2 absolutes missing `Intent:` annotations. | Cowork (markdown-only) |
| `pipeline-adr` | Write or supersede an ADR; manage the `planning/adrs/` index. | Both — Cowork if pairing with research; Claude Code if mid-build |
| `pipeline-ratify-absolute` | Single adjudicator for unratified absolutes. Walks one or many; invokes member + platform advocates on Member-shaped tension; applies the lexicographic decision rule (Gate 1 platform survival → maximize net member benefit); lands a State-tagged `Intent` line on each. Backstops Gate A (`pipeline-plan`) and Gate B (`pipeline-ticket`). Replaces the retired `pipeline-clarify-absolutes` + `pipeline-review-absolute` (2026-05-19). | Both |
| `pipeline-member-advocate` | Dialectic: advocate for the Member's perspective on a decision. | Cowork (no shell needed; brainstorm-shaped) |
| `pipeline-platform-advocate` | Dialectic: advocate for the platform's perspective on a decision. | Cowork (no shell needed; brainstorm-shaped) |
| `loop-designer` | Translate a vague self-improvement idea into a runnable Loop Spec (Karpathy-Loop framework). | Cowork (research + spec-writing; loop framework is bundled with anthropic-skills) |

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
