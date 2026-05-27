# R01 — Consolidate archives into one `_attic/`

**Phase:** 1 of 10 · **Repo:** parent · **Risk:** low (pure moves) · **Depends on:** nothing — run first.

## Objective

Sweep every scattered `archive/` subfolder, plus a few individually dead files, into one dated graveyard `_attic/2026-05-19/`. This phase's commit also brings the `housekeeping/` folder into git as the record of this effort.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Create the attic

```
mkdir -p _attic/2026-05-19
```

### 2. Move every `archive/` folder (`git mv`)

```
git mv product/exploration/archive        _attic/2026-05-19/product-exploration
git mv product/systems/archive            _attic/2026-05-19/product-systems
git mv product/capabilities/archive       _attic/2026-05-19/product-capabilities
git mv product/surfaces/archive           _attic/2026-05-19/product-surfaces
git mv product/foundation/archive         _attic/2026-05-19/product-foundation
git mv planning/scenarios-backlog/archive _attic/2026-05-19/planning-scenarios-backlog
git mv planning/bundles/archive           _attic/2026-05-19/planning-bundles
git mv planning/archive                   _attic/2026-05-19/planning
git mv development/tickets/archive        _attic/2026-05-19/development-tickets
git mv notes/archive                      _attic/2026-05-19/notes
```

If a source path does not exist, note it and continue — do not fail the phase.

### 3. Move the individually dead/historical files

```
git mv product/capabilities/item-create.md            _attic/2026-05-19/product-capabilities/item-create.md
git mv planning/PIPELINE-AUDIT.md                      _attic/2026-05-19/planning/PIPELINE-AUDIT.md
git mv product/exploration/local-food-network.md      _attic/2026-05-19/product-exploration/local-food-network.md
git mv product/exploration/small-business-incubator.md _attic/2026-05-19/product-exploration/small-business-incubator.md
```

`item-create.md` is self-marked superseded. `PIPELINE-AUDIT.md` is a one-time audit whose findings already live in `AGENTS.md` / `CLAUDE.md`. The two exploration docs are stale pre-primitives framing. **Do not** move `business-intelligence-platform.md` — it is kept (handled in R07).

### 4. Cross-reference sweep

For each OLD path, find every live `.md` that links to it and rewrite to NEW:

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `planning/archive/` | `_attic/2026-05-19/planning/` |
| `planning/PIPELINE-AUDIT.md` | `_attic/2026-05-19/planning/PIPELINE-AUDIT.md` |
| `product/systems/archive/` | `_attic/2026-05-19/product-systems/` |
| `product/capabilities/archive/` | `_attic/2026-05-19/product-capabilities/` |
| `product/exploration/archive/` | `_attic/2026-05-19/product-exploration/` |
| `product/surfaces/archive/` | `_attic/2026-05-19/product-surfaces/` |
| `product/foundation/archive/` | `_attic/2026-05-19/product-foundation/` |
| `planning/scenarios-backlog/archive/` | `_attic/2026-05-19/planning-scenarios-backlog/` |
| `planning/bundles/archive/` | `_attic/2026-05-19/planning-bundles/` |
| `development/tickets/archive/` | `_attic/2026-05-19/development-tickets/` |
| `capabilities/item-create.md` | `_attic/2026-05-19/product-capabilities/item-create.md` |
| `exploration/local-food-network.md` | `_attic/2026-05-19/product-exploration/local-food-network.md` |
| `exploration/small-business-incubator.md` | `_attic/2026-05-19/product-exploration/small-business-incubator.md` |

Known files needing edits (trust the grep, not this list): `CLAUDE.md` ("Retired specs" section, the PIPELINE-AUDIT references), `product/MAP.md` ("Retired" section), `JOURNAL.md` (JOURNAL-archive links), `planning/DECISIONS.md`, the `skills/pipeline-*/` workflow files that cite `PIPELINE-AUDIT.md`. Edit live files only — never edit anything now inside `_attic/`.

### 5. Verification

- `find . -type d -name archive -not -path './web/*'` returns nothing.
- `rg --glob '!_attic/**' --glob '!web/**' 'planning/archive/|systems/archive/|PIPELINE-AUDIT|capabilities/item-create'` returns zero hits.
- `ls _attic/2026-05-19/` shows the moved folders.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add _attic/ housekeeping/
git status     # confirm only intended paths are staged
git commit -m "docs(consolidation): phase 1 — consolidate archives into _attic; file the housekeeping record"
```

## Completion

Date: 2026-05-22 · Commit: `98da758` · Notes:

- **Repo-path correction.** Ticket referenced `/Users/don/Projects/movers-makers-shakers`; actual path is `/Users/don/Projects/mainstreetmarket` (project rename). Used the correct path; no semantic change.
- **`housekeeping/` already in git.** Step "R01's commit brings it in" no longer applicable — the `housekeeping/` tree was committed earlier today in the pre-R01 doc-cleanup commit (`f9e2f9e`). R01's commit is moves + edits only.
- **Three `skills/pipeline-{build,eval,ticket}/workflow.md` files** contain the prose label "AGENTS.md → PIPELINE-AUDIT F13" (a cross-reference signal, not a path). Per the ticket's mechanical rule, these were left untouched — no path to rewrite. **[PM: confirm]** whether to reframe these label references now that `PIPELINE-AUDIT.md` is in `_attic/`.
- **`pipeline-prune/workflow.md` writes future archives to `planning/archive/`** (the destination of `git mv`'d folder). All such literal-string template paths got mechanically rewritten to `_attic/2026-05-19/planning/…`, which is semantically wrong for *new* archive writes the prune skill would do. **[PM: confirm]** the destination convention going forward — restore an empty `planning/archive/` for future writes, or change the prune skill to write somewhere else. Affects: `skills/pipeline-prune/workflow.md` (multiple lines), `skills/pipeline-prune/SKILL.md`.
- **`pipeline-process-audit-2026-05-22.md`** says "Append as a dated section to `planning/PIPELINE-AUDIT.md`" — after the mechanical rewrite, this reads "Append … to `_attic/2026-05-19/planning/PIPELINE-AUDIT.md`," which is nonsensical (you don't append to an attic doc). **[PM: confirm]** the disposition: either move that recommendation forward into AGENTS.md/CLAUDE.md, or re-home the audit-history file.
- **`CLAUDE.md` line 14** still tells session-start agents to "read [`PIPELINE-AUDIT.md`] (read once at session start when revisiting process)." The consolidation-plan framing is that PIPELINE-AUDIT findings now live in `AGENTS.md`/`CLAUDE.md`. Mechanical rewrite updated the link; the *recommendation* to read it is stale and should be removed in a follow-up pass (out of R01 scope).
- **Verification results.** (a) No `archive/` dirs remain in the live tree outside `_attic/`, `web/`, `.git/`, `.claude/worktrees/`. (b) Negative-lookbehind grep for OLD paths returned zero hits. (c) `_attic/2026-05-19/` contains all 10 expected subfolders.
