---
purpose: Reorg item — rename JUDGMENT.md to AGENT-BOUNDS.md to clarify its purpose vs. DECISIONS.md.
layer: how
status: done
done_at: 2026-05-30
---

> **DONE 2026-05-30** — `git mv planning/JUDGMENT.md planning/AGENT-BOUNDS.md` complete; CLAUDE.md refs updated (authoritative docs table + pipeline-audit history line); reorg items README ticked.

# Reorg Item 10 — Rename `JUDGMENT.md` → `AGENT-BOUNDS.md`

## What this is

`JUDGMENT.md` defines the boundaries of agent autonomy — when can agents decide alone vs. escalate. The name is confusing because "judgment" sounds like it should contain judgments / decisions. Renaming to `AGENT-BOUNDS.md` clarifies the purpose.

`DECISIONS.md` and `JUDGMENT.md` should NOT merge — they serve different purposes:

| Doc | What it is | Analogy |
|---|---|---|
| `DECISIONS.md` | Pointer index to ADRs — "what did we decide" | Case law index |
| `JUDGMENT.md` (→ `AGENT-BOUNDS.md`) | Bounds for agent autonomy — "when can agents decide alone vs. escalate" | Operating manual for the staff |

## Actions

- `git mv planning/JUDGMENT.md planning/AGENT-BOUNDS.md`
- Update CLAUDE.md references.
- Update AGENTS.md references.
- Update pipeline skill references (`orient`, `weigh`, `scope`, `review`, `ticket`, `build`, etc.).
- Update REGISTRY.md entry.

## Side effects

- Every pipeline skill workflow that reads JUDGMENT.md needs the path updated.
- Cite-stability: anything historical that names `JUDGMENT.md` still resolves through git history.

## Risk

Low. Mechanical rename + path updates. Comprehensive grep recommended.

## Advance this by

1. PM ratifies (the rename is reversible if `AGENT-BOUNDS.md` doesn't land well).
2. `grep -r JUDGMENT.md` to enumerate refs.
3. `git mv` + bulk-update refs (including inside skill workflows).
4. Update REGISTRY.md.
5. Commit as `docs(reorg): rename JUDGMENT.md to AGENT-BOUNDS.md`.

## Source

Reorg-plan.md §10.
