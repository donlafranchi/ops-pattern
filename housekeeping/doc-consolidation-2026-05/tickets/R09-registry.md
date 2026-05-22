# R09 — The document registry

**Phase:** 9 of 10 · **Repo:** parent · **Risk:** medium · **Depends on:** R01–R08 (the doc set must be in its final shape first).

## Objective

Install the anti-sprawl system: a `purpose` front-matter tag on every doc, a `REGISTRY.md` catalog, and a check that flags drift. After this, a doc with no distinct one-line purpose cannot quietly exist.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Add front-matter to every narrative doc

For every `.md` under `product/`, `planning/`, `development/`, `standards/`, and the repo root (`CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md`/`TRACE.md` come in R10) — **excluding** `_attic/`, `housekeeping/`, `web/`, and `skills/` — add a YAML front-matter block at the very top:

```
---
purpose: One line, 12 words or fewer — the single job this doc does.
layer: why | what | how
status: active | draft | reference | historical
---
```

Write each `purpose` freshly from the doc's actual content — it must distinguish this doc from every other. `layer` follows the lens: `product/foundation/` = why; `product/needs|systems|capabilities|ui/` = what; `planning/`, `development/`, `standards/` = how. If two docs would get the same `purpose`, that is a merge the consolidation missed — stop and report it rather than writing a vague purpose.

The `doc-inventory.md` in this effort folder has a researched one-line essence for most docs — use it as raw material, but tighten to 12 words.

### 2. Create `REGISTRY.md` at the repo root

One catalog, grouped by layer:

```
# Document registry

> Every narrative doc in this repo, its purpose, and its status. If a doc is not here, it
> should not exist. If you cannot write a distinct one-line purpose for a new doc, fold it
> into an existing one instead. Generated from each doc's `purpose` front-matter.

## WHY — product/foundation/
| Doc | Purpose | Status |
|---|---|---|
| product/foundation/principles.md | ... | active |

## WHAT — product/needs · systems · capabilities · ui
...

## HOW — planning · development · standards · meta
...

## Tooling
| skills/ | The agent-pipeline skill bundle (17 skills) — not catalogued per-file | active |
```

Every doc that got front-matter in step 1 gets a row, with `purpose` and `status` copied from its front-matter.

### 3. Wire the check into `pipeline-router`

`pipeline-router` runs at session start. Add a registry-conformance step to `skills/pipeline-router/SKILL.md` (and `workflow.md` if it has one): verify that every `.md` outside `_attic/`, `housekeeping/`, `web/`, and `skills/` has front-matter with `purpose` + `layer`, that every such doc has a `REGISTRY.md` row, and that no row points at a missing file. On failure, surface the specific docs at session start. Keep it a lightweight check, not a heavy script.

### 4. Verification

- Every in-scope `.md` has a `purpose` + `layer` + `status` front-matter block.
- `REGISTRY.md` exists at the repo root; its row count equals the number of front-mattered docs.
- No two `purpose` lines are identical.
- `pipeline-router` describes the registry check.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add REGISTRY.md
git status
git commit -m "docs(consolidation): phase 9 — install the document registry"
```

## Completion

Date: {YYYY-MM-DD} · Commit: {hash} · Notes: {report any docs where a distinct purpose was hard to write — candidates the consolidation missed}
