# CLAUDE.md — mainstreetmarket

Read this first every session. Your role depends on which agent you are.

## Project Overview

**Main Street Market** is a map-based platform that helps consumers find independently owned local businesses and distinguishes them from PE-acquired or corporate-owned competitors.

**Core hypothesis:** The free market only works when there's real competition. If consumers can see who owns what, they'll choose independent businesses — and those businesses will survive.

---

## Two-Repo Structure

```
mainstreetmarket/              ← Parent repo (LOCAL ONLY — never pushed)
├── product/
├── planning/
├── development/
├── notes/
├── BUILD-LOG.md               ← symlink → web/BUILD-LOG.md
└── web/                       ← SEPARATE REPO (pushed to GitHub)
    ├── .git/                  ← its own git history
    ├── BUILD-LOG.md           ← actual file (source of truth)
    └── ...
```

**Parent repo:** Product, planning, development docs. Local only.
**web repo:** App code. Pushed to GitHub.

**Commit rules:**
- Working in `web/` → commit to web repo (`cd web && git commit`)
- Working in `product/planning/development/` → commit to parent repo
- Never cross-commit between repos

---

## Key Files Explained

### JOURNAL.md
Your PM's "start here" file. A reverse-chronological log of decisions, blockers, and progress. Read this first every session to understand the project state.

### product/products/
Your PM dashboard. One file per major system consolidating capabilities, hierarchy, and status. Use this to understand the full product scope at a glance.

### BUILD-LOG.md
Development agent's build progress tracker (linked from web/BUILD-LOG.md). NOT the PM's resume point—tracks which tickets are done, what tests pass, current blockers in implementation. Different from JOURNAL.md (product/strategy).

---

## Agent Pipeline

Four agents handle the development lifecycle:

```
Scenario Writer → Ticket Writer → Build Agent → Evaluator
```

**PM approves scenarios** by moving from `planning/scenarios-backlog/` → `planning/scenarios/`

See `planning/AGENTS.md` for detailed agent instructions.

---

## Systems & Bundles

**Systems** define tiered implementations of major platforms/subsystems. Each system has T1/T2/T3 tiers.

**Bundles** define what ships together:
- `b1-mvp.md` — MVP (map + registration)
- `b2-community.md` — Community seeding + travel
- `b3-moderation.md` — Flagging + admin

**Workflow:** Write scenarios against bundle requirements. Systems stay stable; bundles are assembly instructions.

---

## Directory Structure

```
mainstreetmarket/
├── CLAUDE.md                  # This file — root router
├── JOURNAL.md                 # PM's reverse-chron log (start here each session)
├── BUILD-LOG.md               # → symlink to web/BUILD-LOG.md
├── .gitignore                 # Excludes web/ (separate repo)
│
├── product/
│   ├── CLAUDE.md              # Product agent instructions
│   ├── foundation/            # Fixed principles: mission, ethics
│   ├── exploration/           # Raw ideas, incubation (freeform)
│   │   └── archive/
│   ├── capabilities/          # Atomic user-facing capabilities
│   ├── systems/               # Tiered technical system design
│   ├── products/              # Product files (one per major system)
│   ├── specs/                 # Full platform specs
│   │   └── archive/
│   └── ui/                    # UI inventory and design references
│
├── planning/
│   ├── CLAUDE.md              # Planning agent instructions
│   ├── AGENTS.md              # Agent pipeline definitions
│   ├── DECISIONS.md           # Architectural decision log
│   ├── bundles/               # Release packages
│   ├── scenarios/             # APPROVED scenarios (ready for dev)
│   ├── scenarios-backlog/     # DRAFT scenarios (not yet approved)
│   └── tech/                  # Technical research and notes
│
├── development/
│   ├── CLAUDE.md              # Build agent instructions
│   ├── DEVIATIONS.md          # Implementation drift log
│   └── tickets/
│       └── done/              # Completed tickets
│
├── notes/                     # PM workflow docs
│
└── web/                       # SEPARATE REPO (pushed to GitHub)
    ├── .git/                  # Its own git history
    ├── CLAUDE.md              # App-specific instructions
    ├── BUILD-LOG.md           # Development progress (source of truth)
    └── ...                    # App code
```

---

## Scenario Locations (Important!)

| Location | Status | Who Reads |
|----------|--------|-----------|
| `planning/scenarios-backlog/` | Backlog | Scenario Writer (write), PM (review) |
| `planning/scenarios/` | Approved | Ticket Writer, Build Agent, Evaluator |

**Build Agent must NOT read `planning/scenarios-backlog/`** — prevents teaching to test.

---

## When Working in product/

1. Dream without constraints — explore the full possibility space
2. Write systems (tiered feature concepts) to `product/systems/`
3. Write capabilities (atomic user actions) to `product/capabilities/`
4. Maintain product files in `product/products/` (one per major system)
5. Do NOT make release decisions — that's planning's job
6. Do NOT write scenarios — that's planning's job

## When Working in planning/

1. Read `planning/bundles/b1-mvp.md` for MVP scope
2. Read `product/systems/` for feature concepts
3. Write scenarios in Given/When/Then format to `planning/scenarios-backlog/`
4. PM approves by moving scenarios to `planning/scenarios/`
5. Focus on WHAT (behavior), not HOW (implementation)

## When Working in development/

1. Read `development/CLAUDE.md` for TDD workflow
2. Only read `planning/scenarios/` (approved)
3. Follow ticket acceptance criteria
4. Tests before code

## When Evaluating

1. Read `planning/scenarios/` (approved criteria)
2. Write Playwright tests in `web/evals/features/`
3. Run: `cd web && npm run eval -- --grep "F{N}"`

---

## Language & Framing

Pro-competition, pro-free-market language throughout. This product is for all Americans.

| Avoid | Use instead |
|---|---|
| Oligarchy | Rigged market / crony capitalism |
| Corporate greed | Market consolidation |
| Anti-capitalist | Pro-competition / pro-free-market |
| Progressive values | American values / community values |
| Resist | Take back / reclaim |
| PE is bad | Wall Street buying Main Street |
| Ethical spending | Smart spending / voting with your wallet |
