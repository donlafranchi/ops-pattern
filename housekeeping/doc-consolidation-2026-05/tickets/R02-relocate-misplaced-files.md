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

Date: {YYYY-MM-DD} · Commit: {hash} · Notes: {divergences}
