---
purpose: Log of project-name consolidation — all prior working names replaced with "the Project" / "CDP".
layer: how
status: done
---

# Rename Log — 2026-08-14

Canonical name: **the Project**. Abbreviation: **CDP** (Community Development Project). Source of truth: `PROJECT.md` (new, at repo root).

## Files changed (20 files, 30 replacements)

### Root

| File | Line(s) | Old | New |
|---|---|---|---|
| `CLAUDE.md` | 7 | `# Movers, Makers & Shakers` | `# The Project (CDP)` + PROJECT.md pointer |
| `CLAUDE.md` | 16 | `Parent movers-makers-shakers/ is local-only` | `Parent community/ is local-only` |

### product/

| File | Line(s) | Old | New |
|---|---|---|---|
| `product/MAP.md` | 8 | `# Movers, Makers & Shakers — Architecture Map` | `# CDP — Architecture Map` |
| `product/capabilities/landing-page.md` | 10 | `introduces Movers, Makers & Shakers` | `introduces the Project` |
| `product/capabilities/landing-page.md` | 19 | `what Movers, Makers & Shakers is` | `what the Project is` |
| `product/foundation/principles.md` | 13 | `# Movers, Makers & Shakers — The Constitution` | `# The Project (CDP) — The Constitution` |
| `product/foundation/community-health-rubric.md` | 10 | `— Movers, Makers & Shakers` | `— CDP` |
| `product/foundation/policy.md` | 18 | `every Movers, Makers & Shakers policy` | `every Project policy` |
| `product/exploration/accountability.md` | 133 | `Movers, Makers & Shakers can be` | `The Project can be` |
| `product/exploration/accountability.md` | 221 | `business on Movers, Makers & Shakers` | `business on the Project` |
| `product/exploration/local-stays.md` | 160 | `working name is Movers, Makers & Shakers` | `canonical name is the Project (CDP)` |
| `product/systems/item.md` | 10 | `primitives of Movers, Makers & Shakers` | `primitives of the Project` |
| `product/systems/discovery.md` | 16 | `Movers, Makers & Shakers is a place-based` | `The Project is a place-based` |
| `product/systems/producer-tools.md` | 191 | `For Main Street the answer` | `For the Project the answer` |
| `product/systems/producer-tools.md` | 310 | `1 year on Main Street` | `1 year on the Project` |
| `product/templates/idea-intake.md` | 10 | `for **movers-makers-shakers**` | `for **the Project**` |
| `product/ui/phase-0-ia-wireframes.md` | 9 | `Movers, Makers & Shakers PWA` | `CDP PWA` |
| `product/ui/phase-0-ia-wireframes.md` | 137–138 | `Movers Makers & Shakers` (ASCII wireframe) | `CDP` |
| `product/ui/design-language.md` | 8 | `# Main Street DLS` | `# CDP Design Language System` |
| `product/ui/design-language.md` | 225 | `Main Street has two member types` | `The Project has two member types` |
| `product/ui/phase-1-design-foundations.md` | 194 | `aria-label="Main Street logo"` | `aria-label="CDP logo"` |
| `product/ui/design-evolution-report.md` | 54 | `Airbnb vs Main Street` | `Airbnb vs CDP` |

### planning/

| File | Line(s) | Old | New |
|---|---|---|---|
| `planning/backlog/decision-platform-extensibility-posture.md` | 12 | `*Movers, Makers & Shakers* commits` | `*the Project* commits` |

### operations/

| File | Line(s) | Old | New |
|---|---|---|---|
| `operations/outreach-list.md` | 9 | `participants on Movers, Makers & Shakers` | `participants on the Project` |
| `operations/DEPLOY.md` | 7 | title `— Movers, Makers & Shakers` | `— CDP` |
| `operations/DEPLOY.md` | 59, 67 | commit message `"Rename to Movers, Makers & Shakers"` | `"Rename to CDP"` |

### playbooks/

| File | Line(s) | Old | New |
|---|---|---|---|
| `playbooks/deployment-pipeline.md` | 18 | Supabase project `movers-makers-shakers` | `community` |

### _inbox/

| File | Line(s) | Old | New |
|---|---|---|---|
| `_inbox/savannah-seed-market-research.md` | 3 | `Movers, Makers & Shakers launch decision` | `CDP launch decision` |
| `_inbox/savannah-seed-market-research.md` | 311 | `what Movers, Makers & Shakers would provide` | `what the Project would provide` |
| `_inbox/savannah-seed-market-research.md` | 338 | `what MMS does` | `what CDP does` |
| `_inbox/harness-audit-2026-07-15.md` | 9 | `the Movers, Makers & Shakers project` | `the Project (CDP)` |
| `_inbox/ship-readiness-2026-08-14.md` | 103 | `Movers, Makers & Shakers <onboarding@…>` | `CDP <onboarding@…>` |
| `_inbox/madison-seed-market-research.md` | 3 | `on Movers, Makers & Shakers` | `on CDP` |

### New file

| File | Purpose |
|---|---|
| `PROJECT.md` | Single source of truth for project identity |

---

## Skipped — flagged for PM decision

### 1. `operations/DEPLOY.md` — stale path and repo-name references

Lines 21–22, 27, 46–47, 53–54, 57, 60, 65, 68, 93, 96, 147–149, 160, 168 reference `movers-makers-shakers` (GitHub repo names) and `mainstreetmarket` (older folder name). The actual folder is now `community`. These are operational commands with real paths/URLs — updating them is a broader DEPLOY.md rewrite, not a find-and-replace. **Recommend a separate pass to modernize the whole runbook.**

### 2. `development/DEVIATIONS.md` (line 581) and `development/deviations/T093.md` (line 21)

Both reference `'https://movers-makers-shakers.com'` as a fallback domain in code. Changing the doc without changing the code (`web/`) would make the deviation record inaccurate. **Update after the code-level domain is decided.**

### 3. `playbooks/deployment-pipeline.md` — `mms-staging` Supabase project name

Lines 17 and 42 reference `mms-staging` as the actual Supabase project name. This is infrastructure naming, not doc prose. **Update when the Supabase project is renamed.**

### 4. `.claude/worktrees/` — stale worktree snapshots

Four stale worktree directories contain copies of old docs with the old name. These are Claude Code artifacts, not active docs. **Clean up with `git worktree prune` or delete the directories.**

### 5. `development/tickets/done/T021-tide-accent-and-cta-patterns.md`

References `Main Street` logo in a completed ticket. Skipped per "leave `planning/done/` alone" — same logic for done tickets.

### 6. `_inbox/boise-seed-market-research.md`

References "Meridian Main Street Market" — this is a real market name, not the project name. No change needed.
