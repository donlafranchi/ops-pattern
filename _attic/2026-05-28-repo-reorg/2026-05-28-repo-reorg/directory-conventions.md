---
purpose: Canonical directory structure — where everything goes, when it moves, where it moves to.
id: how-directory-conventions
layer: how
status: draft
---

# Directory Conventions

> The blueprint. A new contributor opens this and knows where to put anything.
> Approved version replaces the file-naming rules in CLAUDE.md.

---

## Principles

1. **Every file has one home.** If you can't pick one, the file is trying to be two files.
2. **Every doc is finishable.** If it can't be marked done and archived, it's too big. Split it.
3. **300-line rule.** Any doc approaching 300 lines gets examined for splits. Anything spanning multiple bundles, phases, or concerns gets split at those boundaries.
4. **Active docs move when done.** Nothing sits in an active directory after its job is finished.
5. **Archive is cheap. Deletion is forever.** When in doubt, archive.

---

## Target tree

```
community/                              # Parent repo — LOCAL ONLY, never pushed
│
├── .gitignore                          # See § Gitignored below
│
│  ╔══ LOAD-BEARING ROOT FILES (never rename, never move) ══╗
├── CLAUDE.md                           # Router — agent entry point
├── AGENTS.md                           # Pipeline firewalls, read/write permissions
├── JOURNAL.md                          # PM's reverse-chron session log
├── REGISTRY.md                         # Doc catalog: id → path → purpose
│  ╚═════════════════════════════════════════════════════════╝
│
│  ╔══ PRODUCT — what we're building (the "why" and "what") ══╗
├── product/
│   ├── MAP.md                          # 100k-foot architecture — one sentence per system
│   ├── TRACE.md                        # Feature lineage: need → loop → system → ticket
│   │
│   ├── foundation/                     # WHY layer — rarely changes
│   │   ├── principles.md              # P1–P8, People-First, Decision Test
│   │   ├── primitives.md             # Person / Item / Location / Group spine
│   │   ├── policy.md                 # Three-filter test, anti-Nextdoor, opt-out default
│   │   ├── community-health-rubric.md # Scored 0–3 audit rubric (was design-philosophy.md)
│   │   └── platform-promise.md       # Public-voice commitments for thesis page
│   │
│   ├── needs/                          # WHAT people need — the demand side
│   │   ├── member-journey.md          # The 13 loops, five families (north star)
│   │   └── use-cases.md              # Real situations + role definitions (Member/Producer/Convener)
│   │
│   ├── systems/                        # WHAT we build — one file per primitive/system
│   │   ├── member.md
│   │   ├── item.md
│   │   ├── location.md
│   │   ├── places.md
│   │   ├── groups.md
│   │   ├── discovery.md
│   │   ├── action-layer.md
│   │   ├── agent-assistance.md
│   │   ├── business-jurisdiction.md
│   │   ├── payments.md
│   │   ├── producer-tools.md
│   │   └── stewardships.md
│   │
│   ├── capabilities/                   # Atomic user-facing actions — one file each
│   │   ├── event-host.md
│   │   ├── group-create-join.md
│   │   ├── item-respond.md
│   │   ├── item-view.md
│   │   ├── landing-page.md
│   │   ├── member-profile.md
│   │   └── qr-onboarding.md
│   │
│   ├── ui/                             # UI architecture and design tokens
│   │   ├── community-platform.md      # Home / Explore / You surface spec
│   │   └── design-language.md         # DLS tokens, component recipes, CTA patterns
│   │
│   ├── exploration/                    # Ideas under investigation — freeform
│   │   ├── accountability.md
│   │   ├── affinity-derived-groups.md
│   │   ├── local-stays.md
│   │   ├── market-intelligence.md
│   │   └── reciprocity-and-goodwill.md
│   │
│   └── templates/                      # Paste-in templates for idea intake
│       └── idea-intake.md
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ PLANNING — what ships when, how we decide ══╗
├── planning/
│   ├── DECISIONS.md                    # Pointer index: ADR# → status → file path
│   ├── AGENT-BOUNDS.md                 # Agent autonomy bounds (was JUDGMENT.md)
│   ├── OPEN-QUESTIONS.md               # PM-decision queue — items agents can't resolve
│   ├── STAGE-LEDGER.md                 # Pipeline stage tracker: F### → current stage + date
│   ├── SPEC-PATCHES.md                 # Build → Product return queue
│   ├── RELEASES.md                     # One line per shipped user-visible version
│   ├── pending-ratifications.md        # Unratified absolutes awaiting PM decision
│   ├── producer-roadmap.md             # Producer capabilities: Now/Later/Won't (was in needs/)
│   │
│   ├── adrs/                           # Architectural Decision Records
│   │   ├── README.md                  # Format guide, lifecycle, how to add
│   │   ├── _template.md              # Blank ADR template
│   │   ├── ADR-NNNN-{slug}.md        # One file per decision
│   │   └── reviews/                   # Intent/architecture reviews of ADRs + specs
│   │       └── intent-{slug}-{date}.md
│   │
│   ├── bundles/                        # Release planning — the "what ships" layer
│   │   ├── rebuild-plan.md            # Overview: decisions, keep/delete, phase index
│   │   ├── phase-1-substrate.md       # Phase 1 detail (status: done → archive)
│   │   ├── phase-2-surfaces.md        # Phase 2 detail (status: active)
│   │   ├── phase-3-explore.md         # Phase 3 detail (status: planned)
│   │   ├── phase-4-polish.md          # Phase 4 detail (status: planned)
│   │   ├── b1-primitives-plan.md      # b1 scope definition (what ships, loop coverage)
│   │   ├── b1-deferrals.md            # What b1 explicitly defers and why
│   │   ├── b1-themes.md              # b1.0–b1.6 sub-bundle sequencing
│   │   ├── b2-themes.md              # b2 sub-bundle sequencing (reference)
│   │   ├── b3-themes.md              # b3 sub-bundle sequencing (reference)
│   │   ├── work-maps/                # One file per sub-bundle — the menu of work
│   │   │   ├── b1.0-show-up.md
│   │   │   ├── b1.1-groups.md
│   │   │   ├── b1.2-items.md
│   │   │   ├── b1.3-producer.md
│   │   │   ├── b1.4-follow.md
│   │   │   ├── b1.5-thesis.md
│   │   │   └── b1.6-stewardship.md
│   │   └── done/                     # Completed sprints/phases before full archival
│   │       ├── b1.x-substrate-sprint.md
│   │       └── b1.x-spec-drain-sprint.md
│   │
│   ├── scenarios/                      # APPROVED scenarios — ready for tickets
│   │   └── README.md
│   │
│   └── scenarios-backlog/              # DRAFT scenarios — not yet approved
│       ├── USER-STORY-TEMPLATE.md
│       └── F###-{slug}.md
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ DEVELOPMENT — tickets and build tracking ══╗
├── development/
│   ├── DEVIATIONS.md                   # Current-phase implementation drift log
│   ├── tickets/                        # Open tickets
│   │   ├── T###-{slug}.md
│   │   └── done/                      # Completed tickets (reference)
│   │       └── T###-{slug}.md
│   └── archive/                        # Rotated logs from prior phases
│       └── DEVIATIONS-phase-1.md
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ OPERATIONS — running the thing ══╗
├── operations/
│   ├── DEPLOY.md                       # Deploy + phone-dev runbook
│   └── outreach-list.md                # User recruitment targets (was planning/outreach/)
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ PLAYBOOKS — decisions in force + how-to-write ══╗
├── playbooks/                          # The "what we've decided + how we work" canon
│   ├── PLATFORM-PATTERNS.md            # What the platform IS or refuses to be (decisions in force)
│   ├── DEVELOPMENT-PATTERNS.md         # How we build (action layer, pipeline patterns, M-gates)
│   ├── DECISION-PATTERNS.md            # Close-call rule + the one absolute (wealth circulation)
│   ├── writing-docs.md                 # Style rules + templates (capability / pattern entry / JOURNAL)
│   ├── repo-tidying.md                 # What `tidy` looks for — ten findings + dispositions
│   └── memos/                          # Reversal memos — only when prior decisions are reversed
│       └── memo-NNNN-{slug}.md
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ STANDARDS — cross-cutting build qualities ══╗
├── standards/
│   ├── README.md
│   ├── accessibility.md
│   ├── performance.md
│   ├── responsiveness.md
│   ├── safety.md
│   └── security.md
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ SKILLS — pipeline agent workflows ══╗
├── skills/                             # Keep name (they ARE skills, not patterns)
│   ├── README.md                      # Which skill, which tool, when
│   ├── EXTERNAL-SKILLS.md             # Cowork plugin skill setup
│   ├── install.sh                     # Global symlink installer
│   ├── orient/                        # Session-start orientation
│   ├── explore/                       # Dreamer — systems, capabilities
│   ├── scope/                         # Filter — scenarios from specs
│   ├── review/                        # Architecture + design pre-flight
│   ├── memo/                          # ADR authoring
│   ├── weigh/                         # Absolute-language adjudicator
│   ├── ticket/                        # Scenario → tickets
│   ├── build/                         # TDD implementation
│   ├── test/                          # Eval writing + running
│   ├── tidy/                          # Doc sweep, archive, prune
│   ├── scaffold/                      # New project bootstrap
│   └── loop-designer/                 # Self-improvement loop spec
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ META — process docs about how we build ══╗
├── meta/
│   ├── README.md                      # What meta/ is for
│   └── cowork-pipeline/               # Pipeline process docs
│       ├── DECISION-PATTERNS.md       # Close-call rule, the one absolute
│       ├── DEV-PATTERN.md             # Working pattern, commit choreography
│       ├── HANDOFF-TO-CLAUDE-CODE.md  # Cowork ↔ Claude Code handoff
│       └── README.md                  # Pipeline overview
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ TRIAGE + ARCHIVE ══╗
├── _inbox/                             # Untriaged — anything without a home yet
│   └── README.md
│
├── _attic/                             # Archive — everything that's done
│   └── YYYY-MM-DD-{slug}/            # One dated folder per archived batch
│       └── {files with retired_from: in frontmatter}
│  ╚════════════════════════════════════════════════════════════╝
│
│  ╔══ SEPARATE REPOS ══╗
├── web/                                # App code — separate git repo, pushed to GitHub
│   └── (see web/CLAUDE.md)
│
└── supabase/                           # Supabase local state (migrations tracked)
```

---

## Lifecycle rules

### What goes IN → what triggers a MOVE → where it MOVES TO

#### product/

| Subfolder | Goes in | Trigger to move | Moves to |
|---|---|---|---|
| `foundation/` | Platform constitution, data spine, policy. Changes rarely. | Superseded by a new foundation doc | `_attic/` with `retired_from:` |
| `needs/` | Human needs and real situations. Two files only. | Never moves — these are the north star | — |
| `systems/` | One spec per primitive/system. Grows by system addition. | System retired or merged into another | `_attic/` |
| `capabilities/` | One file per atomic user-facing action. | Capability shipped and stable (no more changes) | Stays (reference). Archive only if the capability is removed. |
| `ui/` | UI architecture and design tokens. | Superseded | `_attic/` |
| `exploration/` | Freeform ideas. No structure required. | Idea → drove an ADR or system spec, exploration concluded | `_attic/` |
| `templates/` | Paste-in templates for conversations. | Template obsolete | Delete or `_attic/` |

#### planning/

| Subfolder | Goes in | Trigger to move | Moves to |
|---|---|---|---|
| `adrs/` | One ADR per decision. Immutable once accepted. | Superseded by a later ADR | File stays, status flips to "Superseded by ADR-NNNN" |
| `adrs/reviews/` | Intent/architecture review of an ADR or spec. | Review verdict acted on; no further changes | Stays (reference). Bulk-archive with the ADR's bundle. |
| `bundles/` | Bundle plans, phase files, theme files, work maps. | Bundle ships → `status: done` | Plan + artifacts → `_attic/YYYY-MM-DD-vN-{slug}/` |
| `bundles/work-maps/` | One file per sub-bundle. | Sub-bundle ships | → `bundles/done/` (then `_attic/` with parent bundle) |
| `bundles/done/` | Completed sprints and sub-bundles awaiting full bundle archival. | Parent bundle archives | → `_attic/` with the bundle |
| `scenarios/` | Approved scenarios — ready for tickets. | All tickets for this scenario are done + evals green | → `_attic/` with the bundle that shipped it |
| `scenarios-backlog/` | Draft scenarios — not yet approved. | PM approves | → `scenarios/` |
| Root files (`DECISIONS.md`, etc.) | Living indexes and queues. | Never moves — these are infrastructure | Entries get resolved/removed; files stay |

#### development/

| Subfolder | Goes in | Trigger to move | Moves to |
|---|---|---|---|
| `tickets/` | Open tickets. One file per ticket. | Ticket done (all acceptance criteria green) | → `tickets/done/` |
| `tickets/done/` | Completed tickets. Reference only. | Bundle archives | → `_attic/` with the bundle |
| `archive/` | Rotated phase logs (DEVIATIONS, etc.) | Never — this is the archive | — |
| `DEVIATIONS.md` | Current-phase drift log. | Phase boundary | Rotate entries → `archive/DEVIATIONS-phase-N.md`; reset file |

#### operations/

| File | Goes in | Trigger to move | Moves to |
|---|---|---|---|
| `DEPLOY.md` | Runbook. Updated in place. | Never moves | — |
| `outreach-list.md` | Recruitment targets. | Campaign complete or obsolete | `_attic/` |
| `deploy-checklist-*.md` | Per-deploy checklist. | Deploy done | `_attic/` |

#### playbooks/

| File | Goes in | Trigger to move | Moves to |
|---|---|---|---|
| `PLATFORM-PATTERNS.md` / `DEVELOPMENT-PATTERNS.md` | Decision-in-force entries (Decision / Intent / Touches). Append as new patterns land. | Pattern superseded by a reversal memo | Entry stays + carries a "superseded by `memo-NNNN`" line; never delete |
| `DECISION-PATTERNS.md` | Close-call rule + the one absolute. | Never moves — updated in place | — |
| `writing-docs.md` / `repo-tidying.md` | How-to-write style + tidy rules. | Never moves — updated in place | — |
| `memos/memo-NNNN-{slug}.md` | One memo per reversal — appended only when a prior pattern entry needs to be reversed by user feedback. | Memo superseded by a later memo | File stays; status flips to "Superseded by memo-NNNN" |

#### skills/

| Subfolder | Goes in | Trigger to move | Moves to |
|---|---|---|---|
| `{skill-name}/` | One dir per pipeline skill (SKILL.md + workflow.md + templates/). | Skill retired | `_attic/YYYY-MM-DD-retired-skills/` |

#### meta/

| Subfolder | Goes in | Trigger to move | Moves to |
|---|---|---|---|
| `cowork-pipeline/` | Process docs about how the pipeline works. | Process changes; old doc superseded | `_attic/` |

#### _inbox/

| Goes in | Trigger to move | Moves to |
|---|---|---|
| Anything without a clear home. Untriaged drafts, one-off notes, uploads. | `tidy` runs and files it | Proper home per this tree, or `_attic/` if stale |

#### _attic/

| Goes in | Trigger to move | Moves to |
|---|---|---|
| Everything that's done. One dated folder per batch. | Never — this is the graveyard | — |
| Naming: `YYYY-MM-DD-{slug}/` for work products. `YYYY-MM-DD-vN-{slug}/` for shipped versions. | | |
| Every archived file carries `retired_from:` in frontmatter for provenance. | | |

---

## Gitignored

```gitignore
web/                    # Separate repo
.DS_Store
*.log
node_modules/
.claude/                # Agent worktrees, session state
.env.local
.idea/
*.swp
supabase/.branches/
supabase/.temp/
supabase/snippets/
test-results/           # Playwright run output
```

**Everything else is tracked.** Including `meta/`, `playbooks/`, `skills/`, `_attic/`, `_inbox/`, `operations/`. Process docs are load-bearing for agent workflows — gitignoring them breaks the pipeline.

---

## Naming quick-reference

| Kind | Pattern | Example |
|---|---|---|
| System spec | `kebab-case.md` | `action-layer.md` |
| ADR | `ADR-NNNN-{slug}.md` | `ADR-0021-member-geography-substrate-split.md` |
| Review | `intent-{slug}-{date}.md` | `intent-ADR-21-and-spec-patches-2026-05-23.md` |
| Scenario | `F###-{slug}.md` | `F018-brian-declares-run-club.md` |
| Ticket | `T###-{slug}.md` | `T056-items-schema.md` |
| Bundle plan | `b{N}-{slug}-plan.md` | `b1-primitives-plan.md` |
| Phase file | `phase-{N}-{slug}.md` | `phase-2-surfaces.md` |
| Theme file | `b{N}-themes.md` | `b1-themes.md` |
| Work map | `b{N}.{x}-{slug}.md` | `b1.0-show-up.md` |
| Sprint | `b{N}.x-{slug}-sprint.md` | `b1.x-substrate-sprint.md` |
| Deploy checklist | `deploy-checklist-{slug}.md` | `deploy-checklist-b1x.md` |
| Archive folder | `YYYY-MM-DD-{slug}/` | `2026-05-28-reorg/` |
| Shipped version | `YYYY-MM-DD-vN-{slug}/` | `2026-06-15-v1-primitives/` |

---

## The test

For any new file, answer three questions:

1. **Where does it go?** → Find the folder in the tree above.
2. **When is it done?** → Name the trigger that moves it out of active.
3. **Where does it go when done?** → `done/`, `_attic/`, or stays as reference.

If you can't answer all three, the file is either in the wrong folder or trying to be two files.
