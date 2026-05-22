# R03 — Consolidate planning history

**Phase:** 3 of 10 · **Repo:** parent · **Risk:** low · **Depends on:** R01, R02.

## Objective

`planning/` has three folders holding the same kind of thing — retrospective process artifacts: `reviews/`, `handoffs/`, `walkthroughs/`. Collapse them into one `planning/history/`. Filenames are already descriptive, so a flat folder is enough.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Create the folder and move contents (`git mv`)

```
mkdir -p planning/history
git mv planning/reviews/*      planning/history/
git mv planning/handoffs/*     planning/history/
git mv planning/walkthroughs/* planning/history/
```

This moves seven files: five `reviews/` (`F018-review.md` + four `agent-assistance-*-review-2026-05-09.md`), one `handoffs/` (`agent-assistance-2026-05-09.md`), one `walkthroughs/` (`F018-pipeline-trace.md`). The three empty source folders disappear — confirm with `ls planning/reviews planning/handoffs planning/walkthroughs 2>/dev/null`.

### 2. Cross-reference sweep

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `planning/reviews/` | `planning/history/` |
| `planning/handoffs/` | `planning/history/` |
| `planning/walkthroughs/` | `planning/history/` |

Likely edits: `JOURNAL.md` (references `planning/reviews/F018-review.md`), `CLAUDE.md` (the forward-looking-docs note points at `planning/handoffs/agent-assistance-2026-05-09.md`), `product/MAP.md`.

### 3. Verification

- `rg --glob '!_attic/**' --glob '!web/**' 'planning/reviews/|planning/handoffs/|planning/walkthroughs/'` returns zero hits.
- `ls planning/history/` shows the seven files.
- The three source folders no longer exist.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git status
git commit -m "docs(consolidation): phase 3 — consolidate planning history into planning/history"
```

## Completion

Date: {YYYY-MM-DD} · Commit: {hash} · Notes: {divergences}
