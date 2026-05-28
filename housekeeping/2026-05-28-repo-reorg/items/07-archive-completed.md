---
purpose: Reorg item — archive files sitting in active directories that should be in _attic/ or done/.
layer: how
status: stub
---

# Reorg Item 7 — Archive completed items

## What this is

Several files sit in active directories despite being complete. Move them to their proper archive home so active directories shrink and the "what's left" question gets easier.

## Actions

| File | Why complete | Move to |
|---|---|---|
| `planning/bundles/b1.x-substrate-sprint.md` | Phase 1 substrate sprint done (T058–T066 shipped) | `planning/bundles/done/` |
| `planning/bundles/b1.x-spec-drain-sprint.md` | Spec drain done | `planning/bundles/done/` |
| `operations/deploy-checklist-b1x.md` | b1.x deploy done | `_attic/2026-05-28-reorg/operations/` |
| `development/tickets/T054–T066` | Several appear shipped — check each; shipped ones move | `development/tickets/done/` |
| `product/exploration/member-geography-redesign.md` | Drove ADR-21 which is accepted; exploration concluded | `_attic/2026-05-28-reorg/product-exploration/` |

## Side effects

- T-numbered tickets that move to `done/` should carry their commit hashes (per OPEN-QUESTIONS #6 — backfill missing hashes for T055/T056/T057 if not yet done).
- Each archived file needs a `retired_from:` frontmatter entry per archive convention.

## Risk

Low. Mechanical moves once each file's "done" status is verified.

## Advance this by

1. For each ticket T054–T066: verify shipped status via `web/BUILD-LOG.md` or grep for commit. Move shipped ones to `done/`; leave open ones in place.
2. PM verifies the other items are truly complete (sprints, deploy, exploration).
3. Move + add `retired_from:` frontmatter.
4. Write `_attic/2026-05-28-reorg/RETIRED.md` provenance note.
5. Commit as `docs(reorg): archive completed sprints + exploration`.

## Source

Reorg-plan.md §7.
