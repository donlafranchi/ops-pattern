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

Date: {YYYY-MM-DD} · Commit: {hash} · Notes: {divergences}
