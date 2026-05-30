---
purpose: Retire both meta/ and housekeeping/ top-level dirs; codify the new _inbox → planning → playbooks flow.
layer: how
status: ratified
source: housekeeping/2026-05-28-repo-reorg/items/04-merge-meta-housekeeping.md (original — merge-only scope; PM expanded 2026-05-30 to full retirement)
risk: medium
---

# Retire meta/ and housekeeping/

## PM ratification — 2026-05-30

Both `meta/` and `housekeeping/` go away entirely. The new flow is:

> **`_inbox/` → `planning/` (proposed → next → now → later → done) → `playbooks/` (pattern entry as long-term home)**

`meta/` and `housekeeping/` were holding work-in-progress process docs and dated reorg artifacts respectively. Under the new flow, both roles are covered: active work lives in the planning kanban; ratified patterns live in playbooks; dated work-products that need provenance go to `_attic/` or directory-local archives per ADR-25.

## Actions

1. **Audit `meta/` contents** — `meta/cowork-pipeline/` currently holds `DECISION-PATTERNS.md` (already migrated 2026-05-30 to `playbooks/DECISION-PATTERNS.md`), `DEV-PATTERN.md` (absorbed into `playbooks/DEVELOPMENT-PATTERNS.md`), `HANDOFF-TO-CLAUDE-CODE.md`, `README.md`, plus a 2026-05-30-dev-pattern archive subdir. For each remaining live file: fold into the appropriate `playbooks/` doc, then archive the original.
2. **Audit `housekeeping/` contents** — `housekeeping/2026-05-28-repo-reorg/` is the only live work-product (this very item lives there originally). Its 12 items either ship via `planning/next/` (items 1, 2, 4, 5, 7, 8) or get retired (items 3, 6, 9, 10, 11, 12 depending on disposition). When `housekeeping/2026-05-28-repo-reorg/items/` is empty, archive the parent reorg dir to `_attic/2026-05-28-repo-reorg/` with a `RETIRED.md` pointing at where each item landed.
3. **Delete both dirs once empty** — `rmdir meta/` and `rmdir housekeeping/`. CLAUDE.md's file-naming table loses both rows; the dated-work-product pattern shifts to "park in `_inbox/` if untriaged, kanban-promote if ratified, archive to `_attic/YYYY-MM-DD-{slug}/` if dated and done."
4. **Land the new flow as a pattern entry** in `playbooks/DEVELOPMENT-PATTERNS.md`. One Decision/Intent/Touches block titled something like "Route work through `_inbox/` → `planning/` kanban → `playbooks/` — no parallel `meta/` or `housekeeping/` lanes." Decision: kill the parallel lanes. Intent: every work item has exactly one path from raw idea to long-term pattern; no shadow dirs hold mid-state work. Touches: this file's execution.
5. **Update CLAUDE.md** — remove the `housekeeping/YYYY-MM-DD-{slug}/` and `meta/{slug}/` rows from the file-and-directory naming table; remove anti-sprawl rule references; replace with the kanban lane rows that already exist.
6. **Update REGISTRY.md** — remove any entries pointing into `meta/` or `housekeeping/`.

## Side effects

- The atomize skill's archive target (`_attic/YYYY-MM-DD-{slug}/`) stays correct — `_attic/` is the dated-work-product home now, not `housekeeping/`.
- Any pipeline skill that referenced `meta/cowork-pipeline/` needs the playbooks path instead.
- This file itself originated in `housekeeping/`; its execution wraps up its own source dir.

## Risk

Medium. Touches CLAUDE.md, REGISTRY.md, and any skill workflow that cites `meta/` or `housekeeping/`. Mostly mechanical once the playbook pattern entry lands, but the dir deletions are irreversible without git.

## Source

Housekeeping reorg item 4 (original: "merge meta + housekeeping under meta/"). PM expanded scope 2026-05-30: both dirs go away, the kanban + playbooks flow replaces them.
