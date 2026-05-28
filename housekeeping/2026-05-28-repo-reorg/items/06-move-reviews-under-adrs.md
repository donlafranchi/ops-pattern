---
purpose: Reorg item — move planning/reviews/ under planning/adrs/reviews/ (reviews are part of the decision record).
layer: how
status: stub
---

# Reorg Item 6 — Move `planning/reviews/` → `planning/adrs/reviews/`

## What this is

`planning/reviews/` holds 6 intent-review files. These are decision artifacts that review ADRs and spec patches. They belong under the ADR umbrella, not as a sibling directory.

## Actions

- `git mv planning/reviews/ planning/adrs/reviews/`
- Update `adrs/README.md` to mention the `reviews/` subdirectory + the `intent-{slug}-{date}.md` naming pattern.
- Update CLAUDE.md references that point at `planning/reviews/`.
- Update REGISTRY.md entries (6 review file paths).

## Side effects

- Any link in JOURNAL.md / DECISIONS.md / etc. that points at `planning/reviews/intent-…` must update to `planning/adrs/reviews/intent-…`.

## Risk

Low. Mechanical move + path updates. Verify with grep before / after.

## Advance this by

1. PM ratifies (this is a low-stakes structural cleanup).
2. `grep -r planning/reviews/` to enumerate refs.
3. `git mv` + bulk-update refs.
4. Update `adrs/README.md` with the new subdir convention.
5. Commit as `docs(reorg): move planning/reviews/ under planning/adrs/`.

## Source

Reorg-plan.md §6.
