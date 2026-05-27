# cowork-pipeline

Project-agnostic agent pipeline for a solo founder running Cowork + Claude Code. Ten skills, one decision rule, one anti-pattern log. Install once globally; reuse across every project on every workstation.

> First time? Read [DEV-PATTERN.md](DEV-PATTERN.md) for the working pattern, then [DECISION-PATTERNS.md](DECISION-PATTERNS.md) for the close-call rule. This README is the map.

---

## The team in ten skills

Each skill is a role on a tight 5-person team. One question forces the work.

| Skill | Role | Tool | The one question |
|---|---|---|---|
| `orient` | PM at session start | Cowork | What drifted since last session |
| `explore` | Product researcher | Cowork | Whose need is this, who else is solving it |
| `scope` | Planning / scoping | Cowork | What's the smallest version that proves the bet |
| `weigh` | Tech-lead judgment call | Cowork | Which option stays reversible, who bears the cost |
| `review` | Architecture + design + security gate | Cowork | Will it scale, is it accessible, is it safe |
| `memo` | Decision recorder (ADR) | Cowork | What rationale will future-us need |
| `ticket` | Sequencer | Claude Code | Smallest unit with a clear done condition |
| `test` | QA — write + run | Claude Code | Would a stranger know if this broke |
| `build` | Engineer — TDD | Claude Code | Simplest code that passes, fastest |
| `tidy` | Anti-sprawl sweeper | Cowork | What's stale, what folds into what |

**Hard firewall.** Each stage runs in one tool only. No more "Both." If a stage feels like it needs the other tool, the workflow has drifted — fix the workflow, not the firewall.

**Two folded sub-routines** — not standalone skills.
- **Security** lives inside `review`. Auth, RLS, payment flows, PII surfaces.
- **User-voice** lives inside `explore`. Pulls from `use-cases.md` (or whatever the project calls its real-situation catalog) before any new system spec is written.

---

## The flow

```
orient → explore → scope → weigh ┐
                           memo ─┤
                         review ─┤
                                 ↓
                            ticket ┐
                              test ┼─→ build → (commit) → tidy
                                  ─┘
```

`weigh`, `memo`, `review` fire as needed inside the scope→ticket gap. `test` and `ticket` run in parallel against the same approved scope, eyes-closed to each other (that separation is what makes the test trustworthy). `tidy` runs on a cadence — end of session, end of bundle, or when `orient` flags drift.

---

## Install

```bash
git clone https://github.com/{you}/cowork-pipeline.git ~/code/cowork-pipeline
cd ~/code/cowork-pipeline
./install.sh                  # symlinks skills/* into ~/.claude/skills/
./install.sh --with-plugins   # also installs the Cowork plugin skills the pipeline calls
```

The install script is idempotent. Re-run after adding a new skill or pulling an update. Claude Code auto-discovers; Cowork does not (Cowork sees only its plugin marketplace plus session-uploaded skills — see [EXTERNAL-SKILLS.md](EXTERNAL-SKILLS.md) for the Cowork-side equivalents the pipeline leans on).

---

## Migrating from the old names

The earlier iteration had 19 skill directories with verbose names. The new shape is 10 plus 2 utilities. Old → new mapping:

| Old directory | New name | Note |
|---|---|---|
| `pipeline-router` | `orient` | Absorbs the session-start drift check, `prune`, and `bundle-resync` |
| `pipeline-product` | `explore` | `user-voice` is now a sub-routine inside it |
| `pipeline-plan` | `scope` | |
| `pipeline-intent-check`, `pipeline-ratify-absolute`, `pipeline-member-advocate`, `pipeline-platform-advocate` | `weigh` | Four merged into one; sub-routines preserved as workflow steps |
| `pipeline-review` | `review` | `security` is now a sub-routine inside it |
| `pipeline-adr` | `memo` | "Decision memo" is industry-standard; ADR was jargon |
| `pipeline-ticket` | `ticket` | Now Claude Code only (was Both) |
| `pipeline-eval` | `test` | Clearer than `eval` to outsiders |
| `pipeline-build` | `build` | |
| `doc-home-finder`, `doc-housekeeping`, `skills-housekeeping` | `tidy` | Three merged into one with three modes |
| `pipeline-prune`, `pipeline-bundle-resync` | — | Folded into `orient` |
| `pipeline-scaffold`, `loop-designer` | (utilities) | Kept as-is; not part of the cycle |

Retired skills are not deleted on day one. Mark them deprecated for two weeks; if nothing breaks, remove. Reversible per the project's own decision rule.

---

## Repo layout

```
cowork-pipeline/
├── README.md              # this file — the map
├── DEV-PATTERN.md         # the working pattern (continuously updated)
├── DECISION-PATTERNS.md   # the close-call rule + the one absolute
├── EXTERNAL-SKILLS.md     # Cowork plugin skills the pipeline calls in
├── install.sh             # global symlink installer
└── skills/
    ├── orient/
    ├── explore/
    ├── scope/
    ├── weigh/
    ├── review/
    ├── memo/
    ├── ticket/
    ├── test/
    ├── build/
    ├── tidy/
    ├── scaffold/          # utility — new project bootstrapper
    └── loop-designer/     # utility — Karpathy-loop spec writer
```

Each skill directory has a `SKILL.md` (description + triggers) and a `workflow.md` (the steps). Templates live alongside.

---

## How to update

This repo is meant to evolve. Three commits a month is healthy; three commits a day means the pattern is unstable.

- New friction surfaces → add a named anti-pattern to `DEV-PATTERN.md` § Anti-patterns.
- A new skill earns its keep over two consecutive bundles → promote from a sub-routine to its own directory.
- A skill hasn't fired in three bundles → demote to a sub-routine inside the nearest sibling, or remove.
- The decision rule changes → land the change in `DECISION-PATTERNS.md` with a date, and update `weigh/workflow.md`.

Pull requests welcome from your own workstations.
