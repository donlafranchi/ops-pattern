---
purpose: Reorg item — rename `design-philosophy.md` to `community-health-rubric.md` to match the doc's actual content.
layer: how
status: stub
---

# Reorg Item 2 — Rename `design-philosophy.md` → `community-health-rubric.md`

## What this is

The file at `product/foundation/design-philosophy.md` is a scored 0–3 rubric for auditing community health. Its purpose frontmatter already calls it "Scored 0–3 rubric grading platform decisions against community-health theory." The filename ("design philosophy") is misleading — it's a measuring stick, not a philosophy.

## Actions

- `git mv product/foundation/design-philosophy.md product/foundation/community-health-rubric.md`
- Update CLAUDE.md authoritative-docs table reference.
- Update REGISTRY.md entry.
- Update back-references in:
  - `JUDGMENT.md` L1 anchors
  - `principles.md` status banner
  - any other doc that grep'd against "design-philosophy.md"

## Side effects

- Cite-stability: any historical doc / commit message mentioning "design-philosophy.md" still resolves through git history. Going-forward citations use the new name.

## Risk

Low. Pure rename + path updates. Verify with grep.

## Advance this by

1. PM ratifies the new name.
2. `grep -r design-philosophy.md` to enumerate refs.
3. `git mv` + bulk-update refs.
4. Commit as a single `docs(reorg): rename design-philosophy → community-health-rubric` change.

## Source

Reorg-plan.md §2.
