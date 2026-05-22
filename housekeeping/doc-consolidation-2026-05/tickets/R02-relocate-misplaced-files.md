# R02 — Relocate the misplaced files

**Phase:** 2 of 10 · **Repo:** parent · **Risk:** low · **Depends on:** R01.

## Objective

Two files sit in the wrong place. `stewardships.md` is a system spec parked in `planning/bundles/`. `community-platform.md` is the lone file in `product/surfaces/`. Move both home; retire the empty `surfaces/` folder.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Move `stewardships.md` into systems

```
git mv planning/bundles/stewardships.md product/systems/stewardships.md
```

Add a banner at the very top of `product/systems/stewardships.md`, above its existing heading:

```
> **Relocated 2026-05-19** from `planning/bundles/`. Still bundle-shaped (schema delta +
> ship-theme framing). Parked here as the canonical home for the stewardship system; needs
> a rewrite into proper system-spec form. Until then treat the schema and constraints as
> authoritative and the ship-theme framing as legacy.
```

Leave the rest of the file untouched.

### 2. Move `community-platform.md` into ui

```
git mv product/surfaces/community-platform.md product/ui/community-platform.md
```

### 3. Retire the empty `surfaces/` folder

After R01 moved `surfaces/archive/` and step 2 moved the last file, `product/surfaces/` is empty and disappears. Confirm: `ls product/surfaces 2>/dev/null` shows nothing. If anything remains, stop and report.

### 4. Cross-reference sweep

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `planning/bundles/stewardships.md` | `product/systems/stewardships.md` |
| `bundles/stewardships.md` | `systems/stewardships.md` |
| `product/surfaces/community-platform.md` | `product/ui/community-platform.md` |
| `surfaces/community-platform.md` | `ui/community-platform.md` |

Keep relative-link depth correct for each file. Likely edits: `CLAUDE.md` (authoritative-docs table), `product/MAP.md` (Surfaces section), `planning/bundles/bundle-themes.md` (its b1.6 section), `planning/bundles/b1-work-map.md`.

### 5. Verification

- `rg --glob '!_attic/**' --glob '!web/**' 'surfaces/community-platform|bundles/stewardships'` returns zero hits.
- `product/systems/stewardships.md` exists, starts with the relocation banner.
- `product/ui/community-platform.md` exists; `product/surfaces/` is gone.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git status
git commit -m "docs(consolidation): phase 2 — relocate stewardships and community-platform"
```

## Completion

Date: 2026-05-22 · Commit: `e86caaf` · Notes:

- **`product/surfaces/` deleted explicitly.** After step 2's `git mv`, the dir was empty but still on disk; `rmdir` removed the stub so `surfaces/` truly disappears.
- **`bundle-themes.md` had three bare `stewardships.md` references** (lines 5, 217, 231) that the ticket's OLD→NEW table didn't catch (no `bundles/` or `planning/bundles/` prefix — just the bare filename, because the file was previously in the same directory). Fixed with surgical edits to `../../product/systems/stewardships.md` so the relative depth resolves from `planning/bundles/`.
- **Stale `product/surfaces/` (directory) references intentionally left untouched** — the ticket's OLD→NEW table only covers file paths, not the bare dir. Out-of-mechanical-scope hits remain in: `AGENTS.md:56` (project-paths list), `skills/pipeline-build/workflow.md:11,61` (build agent's "does not read" list), `skills/pipeline-product/workflow.md:8,21,30` (product agent's writes column), `development/DEVIATIONS.md:380` (historical note), `planning/pending-ratifications.md:300,447`, `product/exploration/business-intelligence-platform.md:221`. **[PM: confirm]** disposition — most of these are agent-workflow stanzas that need a single coordinated edit (remove `product/surfaces/` from agent-read lists since the dir is now retired). Worth a follow-up sweep separate from R03.
- **Untracked file appeared mid-task.** `product/systems/places.md` (~200 lines, references ADR-0020) showed up untracked between the initial commit and R02's commit — mtime 2026-05-22 10:44, after my prior `git add -A` snapshot. R02 used `git add -u` (modifications only), so this file was left alone. **[PM: confirm]** whether to commit it standalone or whether it belongs to a different effort.
