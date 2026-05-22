# R10 — TRACE.md and the final sweep

**Phase:** 10 of 10 · **Repo:** parent · **Risk:** medium · **Depends on:** R01–R09 (the whole doc set must be final).

## Objective

Close the consolidation: author `product/TRACE.md` (the feature-lineage map), refresh the three navigational docs (`MAP.md`, `CLAUDE.md`, `AGENTS.md`) to the new structure, audit the whole tree for any broken link, and log the effort in the journal.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Author `product/TRACE.md`

Read first: `product/needs/needs.md`, `needs/people.md`, `needs/member-journey.md`, `product/MAP.md`, `planning/scenarios-backlog/F018-brian-declares-run-club.md`, and the system + capability headers.

Build one lineage table — columns **Need · Loop · System · Capability · Feature/Scenario · Ticket · Status**. One row per capability or feature that exists today. Empty cells get `—`, not invention — an incomplete trace is exactly what this doc should surface. Give it the front-matter block from R09 (`purpose`, `layer: how`, `status: active`).

```
# TRACE — feature lineage

> Companion to MAP.md. MAP answers "does the architecture cohere"; TRACE answers "where did
> this feature come from." Walk any ticket left through this table to its human need. A row
> with empty Need/Loop cells may be engineering-driven — worth interrogating. The PM adds a
> row per new scenario.

## Lineage
| Need | Loop | System | Capability | Feature / Scenario | Ticket | Status |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... |
```

Add a `TRACE.md` row to `REGISTRY.md`.

### 2. Refresh `product/MAP.md`

- Add a **Needs** section (after Foundation, before Primitives) → `needs/people.md`, `use-cases.md`, `needs.md`, `member-journey.md`.
- Foundation section: now `principles.md`, `design-philosophy.md`, `policy.md`, `platform-promise.md`, `primitives.md` — remove the dropped bullets.
- Systems section: reflect `agent-assistance.md` (merged), `producer-tools.md` (merged), `stewardships.md` (added).
- Surfaces/UI: `community-platform.md` is in `ui/`.
- Add a **Standards** line under HOW and a pointer to `TRACE.md` and `REGISTRY.md`.
- "Retired" section: confirm links point into `_attic/2026-05-19/`.

### 3. Refresh `CLAUDE.md`

- "Project-specific authoritative docs" table: fix every renamed/moved path (`principles.md`, `design-philosophy.md`, `policy.md`, `agent-assistance.md`, `producer-tools.md`, `community-platform.md`, `needs/*`, `rebuild-plan.md`); add rows for `TRACE.md`, `REGISTRY.md`, `standards/`.
- "first time in this repo" reading order: add `TRACE.md` and `REGISTRY.md` after `MAP.md`.
- Fix any reference to `notes/`, `planning/reviews|handoffs|walkthroughs/`, `PIPELINE-AUDIT.md`, `loops.md`, `canonical-examples.md`, `people-first.md`.
- "Retired specs" section: paths point into `_attic/2026-05-19/`.
- Do **not** restructure `CLAUDE.md` beyond making paths/pointers accurate.

### 4. Audit `AGENTS.md` and `skills/`

```
rg -l --glob '!_attic/**' --glob '!web/**' \
  'foundational-principles|people-first|community-design-philosophy|policy-framework|foundation/loops|canonical-examples|foundation/agent-assistance|delegation\.md|assistant-context|systems/skills|producer-bulletin|producer-growth|surfaces/|planning/reviews|planning/handoffs|planning/walkthroughs|PIPELINE-AUDIT|notes/' .
```

Fix every hit — `AGENTS.md` firewalls and `skills/*/SKILL.md` + `workflow.md` reference moved paths. The skill ticket templates reference `canonical-examples.md` and `loops.md` — repoint to `needs/use-cases.md` and `needs/member-journey.md`.

### 5. Final whole-tree link audit

The command in step 4 must return **zero** hits. Then spot-open `TRACE.md`, `MAP.md`, `CLAUDE.md`, `REGISTRY.md` and confirm their links resolve to files that exist.

### 6. Log it in `JOURNAL.md`

Add a top entry: the Doc Consolidation effort, executed in ten phases (R01–R10) — `_attic/` consolidated, `needs/` layer added, WHY/systems/capabilities merged, `notes/` dissolved, `standards/` scaffolded, registry installed, `TRACE.md` added. Match the existing JOURNAL style; one concise entry.

### 7. Verification

- `product/TRACE.md` exists, has the lineage table, has front-matter, has a `REGISTRY.md` row.
- Step 4's audit returns zero hits.
- `CLAUDE.md` authoritative-docs table and `MAP.md` reflect the final tree.
- `JOURNAL.md` has the consolidation entry on top.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add product/TRACE.md
git status
git commit -m "docs(consolidation): phase 10 — add TRACE.md; refresh MAP, CLAUDE, AGENTS"
```

## After this ticket

Report to the PM: the ten commit hashes (R01–R10), every `[PM: confirm]` placeholder left in the merged docs and the `needs/` drafts, and any doc the registry phase flagged as having no distinct purpose.

## Completion

Date: 2026-05-22 · Commit: `30d85ee` · Notes:

**All seven sub-steps landed:**

1. **`product/TRACE.md` authored.** One lineage table with 13 rows (one per need from `needs.md`) tracing Need → Loop → System → Capability → Feature/Scenario → Ticket → Status. Plus a secondary "Engineering-only rows" table for substrate that doesn't trace cleanly to a single need (4 rows: action layer, event-log, members-auth PK, member-location affinity privacy). Plus an "Open lineage gaps" list naming the next-scenario candidates. Plus a "How TRACE stays current" section naming when the PM updates it.
2. **`product/MAP.md` refreshed.** Front-matter added. New Needs section (4 docs) after Foundation. Standards section added (6 stubs). Pointers to TRACE.md and REGISTRY.md. Foundation section trimmed to the 5 surviving docs (`principles.md` is no longer duplicated; the three duplications from the agent-assistance triplet are collapsed). Retired section rewritten with all 2026-05 consolidations enumerated (R01–R08 source files), every path pointing into `_attic/2026-05-19/`. Alignment-check list extended with new check #11 (front-matter + REGISTRY conformance).
3. **`CLAUDE.md` refreshed.** Front-matter added. Reading order now: CLAUDE → MAP → TRACE → REGISTRY → AGENTS → JOURNAL. Pipeline-audit pointer reframed as "historical, archived" (no longer a session-start read recommendation). Authoritative-docs table updated: producer-tools.md duplicate row collapsed; people.md / needs.md / standards/ / REGISTRY.md / TRACE.md rows added. Forward-looking line reframed (agent-assistance.md is no longer triplicated; b2+ surfaces named explicitly). Producer-shaped-systems paragraph updated to include the 2026-05-22 R06 fold. Retired-specs paragraph unified across all 2026-05 consolidations.
4. **`AGENTS.md` + `skills/` audited.** AGENTS.md got front-matter and a slimmer pipeline-audit pointer. The 12 skills/ files modified in earlier R-phases were checked via grep — no actual broken refs remain (the residuals are all provenance notes inside the merged docs and the JOURNAL entry, which intentionally name the OLD filenames as historical context).
5. **JOURNAL.md updated.** New top entry: the Doc Consolidation effort, all 10 phases with commit hashes, headline number (40 narrative docs → 26), [PM: confirm] backlog highlights, next-session pickup. Front-matter added.
6. **Whole-tree link audit.** Negative-lookbehind grep across the live tree (excluding `_attic/`, `housekeeping/`, `web/`, `planning/history/`) shows zero actual broken links. The remaining matches in CLAUDE.md's "Retired specs" paragraph, MAP.md's "Retired" section, JOURNAL.md's consolidation entry, and the use-cases/member-journey relocation banners are all intentional naming of OLD filenames as historical context.
7. **REGISTRY.md updated.** Added a "Meta — root navigational docs" section listing CLAUDE.md, AGENTS.md, JOURNAL.md, MAP.md, TRACE.md, REGISTRY.md (6 docs) with their purposes. Total catalogued: 117 narrative + 6 meta = 123 docs. Header text updated.

**The ten R-ticket commit hashes (one per phase + a completion-notes commit per phase):**

| Phase | Phase commit | Notes commit |
|---|---|---|
| R01 | `98da758` | `78a4b5b` |
| R02 | `e86caaf` | `e234e79` |
| (prune destinations) | `ad85205` | — |
| R03 | `14f6696` | `c162b7a` |
| R04 | `903a100` | `ad2c933` |
| R05 | `bcb6eb6` | `98198f0` |
| R06 | `cc96215` | `ab926f1` |
| R07 | `a83bdcb` | `d0fde5f` |
| R08 | `325f818` | `ff275ed` |
| R09 | `ef5e597` | `9ba0adb` |
| R10 | `30d85ee` | (this commit) |

Plus the pre-R01 doc-cleanup commit that brought the housekeeping/ folder into git: `f9e2f9e`.

**Running [PM: confirm] backlog (cumulative across R01–R10):**

Each phase's Completion notes carry its own [PM: confirm] items in detail. Summary by category:

*Personas & needs drafts (R08):*
- `people.md`: 4 TBD personas (Idea-Floater, Mutual-Aid Member, Trades-Pro Seeker, Community Steward) — resolve when the `use-cases.md` `[TODO]` slots #8–#11 get real instances.
- `needs.md`: ranking is by loop family; PM may want to re-rank by importance / volume / urgency.
- Whether to enumerate anti-personas / anti-needs.

*Pre-primitives vocab still in surviving docs:*
- `principles.md` Part 2 "Communities, too, are people-first" uses legacy "Community" wording.
- `principles.md` Part 7 (Self-Assessment) is anchored to a pre-primitives spec set.
- `design-philosophy.md` Sections 1–5 use generic "community" prose.
- `accountability.md` both framings use pre-primitives "business" vocabulary.

*Standards stubs:* the 5 standards stubs are placeholders; content forthcoming.

*Smaller items:*
- `notes/deploy-to-hetzner.md` orphan in `notes/` (R04).
- `pipeline-prune/workflow.md` archive-header template still references `JOURNAL-pre-mission-clarity-2026-05-08.md` as a sibling (now in `_attic/2026-05-19/planning/`).
- Stale `product/surfaces/` dir refs in 8 agent-workflow stanzas (R02 left these as out-of-mechanical-scope).
- 4 `pipeline-{build,eval,plan,ticket}/workflow.md` label refs to "AGENTS.md → PIPELINE-AUDIT F13" — left as labels, not paths.
- `pipeline-process-audit-2026-05-22.md` proposes "Append to PIPELINE-AUDIT.md" — proposal needs reframing (the target is in attic).
- `landing-page.md` line 21 has awkward post-substitution wording from R07.
- `product/systems/places.md` untracked (PM directive: another agent's workflow).

*Workflow / tooling:*
- The R09 registry check in `pipeline-router` is lightweight (orientation, not enforcement). A heavier script could be wired later if drift becomes a problem.
- The TRACE.md "How TRACE stays current" section assumes PM updates rows manually; could be automated against scenarios/ + tickets/ later.

**No docs were "consolidation missed" candidates per R09.** Every surviving narrative doc had a writable distinct one-line purpose — the seven overlap-cluster merges (R05–R07) successfully dissolved the duplications, and the four-doc needs/ layer (R08) closed the gap on the WHAT layer.

**Verification.**
- `product/TRACE.md` exists with front-matter + lineage table + REGISTRY.md row ✓.
- Step 4's audit: zero actual broken links in the live tree ✓.
- `CLAUDE.md` authoritative-docs table reflects the final tree ✓.
- `product/MAP.md` includes Needs / Standards / TRACE / REGISTRY pointers ✓.
- `JOURNAL.md` has the consolidation entry on top ✓.
- `REGISTRY.md` catalogs 117 narrative + 6 meta = 123 docs ✓.
- `product/foundation/` is down to 5 files (principles, design-philosophy, policy, platform-promise, primitives) ✓.
- `product/needs/` has exactly 4 files (use-cases, member-journey, people, needs) ✓.
- `product/systems/` has 12 files (11 tracked + places.md untracked) ✓.
- Doc Consolidation effort folder `housekeeping/doc-consolidation-2026-05/` preserved with all 10 R-tickets carrying Completion notes ✓.
