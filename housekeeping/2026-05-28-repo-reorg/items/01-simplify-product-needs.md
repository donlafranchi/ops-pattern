---
purpose: Reorg item — simplify product/needs/ to two files (member-journey.md + use-cases.md); fold/move/archive others.
layer: how
status: stub
---

# Reorg Item 1 — Simplify `product/needs/`

## What this is

`product/needs/` has 5 files with significant overlap. Reduce to 2 load-bearing files (`use-cases.md`, `member-journey.md`); fold / archive / move the rest.

## Actions

- **Keep:** `use-cases.md` (real situations + progressive build status), `member-journey.md` (the 13 loops — north star).
- **Move:** `product/needs/producer-capability-taxonomy.md` → `planning/producer-roadmap.md` (it's a Now/Later/Won't roadmap lens, not a human need).
- **Fold + archive:** `product/needs/people.md` — fold the three role definitions (Member / Producer / Convener) + "types to design for" lists into a new ~20-line section at the top of `use-cases.md`; then archive the standalone file to `_attic/2026-05-28-reorg/product-needs/people.md`.
- **Archive:** `product/needs/needs.md` (draft, never ratified; every entry traces back to `member-journey.md` + `use-cases.md` already) → `_attic/2026-05-28-reorg/product-needs/needs.md`.

## Side effects

- Every reference to `producer-capability-taxonomy.md` must update to the new path (`planning/producer-roadmap.md`). Refs exist in: `CLAUDE.md` line 208, `AGENTS.md` line 96, `REGISTRY.md` line 47, `product/MAP.md` line 35, scenario template `scope/templates/scenario.md` line 70, all 14 F030–F043 scenarios.
- Every reference to `people.md` and `needs.md` must update to point at the new `use-cases.md` role section (or simply be removed).
- `REGISTRY.md` entries removed for archived files.

## Risk

Low. Mostly path updates + one fold. Easy to verify with grep before/after.

## Advance this by

1. PM ratifies the rename (`producer-capability-taxonomy.md` → `planning/producer-roadmap.md`).
2. Run `grep -r producer-capability-taxonomy` to enumerate refs; bulk-update.
3. Author the 20-line role section to prepend to `use-cases.md` (extract from `people.md`).
4. Move + archive files; write `_attic/2026-05-28-reorg/RETIRED.md` provenance note.
5. Update REGISTRY.md entries.
6. Commit as a single `docs(reorg): simplify product/needs/` change.

## Source

Reorg-plan.md §1.
