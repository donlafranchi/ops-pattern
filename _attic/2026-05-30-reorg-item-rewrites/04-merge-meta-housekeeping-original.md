---
purpose: Reorg item — merge housekeeping/ into meta/ (both are process artifacts).
layer: how
status: stub
---

# Reorg Item 4 — Merge `meta/` + `housekeeping/`

## What this is

`meta/cowork-pipeline/` has 4 process docs (DECISION-PATTERNS, DEV-PATTERN, HANDOFF-TO-CLAUDE-CODE, README). `housekeeping/` has a README + dated work-product subdirs. Both are process artifacts; consolidate under `meta/`.

## Actions

- Move `housekeeping/README.md` content into `meta/README.md` (or merge into a single top-level meta README).
- For dated work-products (`housekeeping/YYYY-MM-DD-{slug}/`): decision — keep the existing `housekeeping/YYYY-MM-DD-{slug}/` pattern but relocate under `meta/housekeeping/YYYY-MM-DD-{slug}/`, OR use `_inbox/` for untriaged + `_attic/` for archived (skipping `meta/housekeeping/` entirely). The directory-conventions doc proposes the latter.
- Delete `housekeeping/` as a top-level dir once content is relocated.

## Side effects

- The 2026-05-28-repo-reorg/ subdir (which holds this very item's stubs) needs to be relocated. Either move to `meta/housekeeping/2026-05-28-repo-reorg/` or to `_inbox/2026-05-28-repo-reorg/` (then `_attic/` when complete).
- CLAUDE.md or AGENTS.md references to `housekeeping/` must update.
- No gitignore change — process docs are load-bearing and stay tracked.

## Risk

Low. Mechanical moves + path updates. The trickiest part is the in-flight reorg subdir itself — it must relocate without breaking the references in its own stub files.

## Advance this by

1. PM ratifies the target structure (likely: kill `housekeeping/`, use `_inbox/` for untriaged work-products → `_attic/` on archive; reserve `meta/` for stable process docs only).
2. Move the 2026-05-28-repo-reorg/ subdir last (after all the other items in this very reorg have executed or been retired).
3. Update the meta README to describe the simplified structure.
4. Commit as a single `docs(reorg): merge housekeeping into meta + relocate work-products` change.

## Source

Reorg-plan.md §4.
