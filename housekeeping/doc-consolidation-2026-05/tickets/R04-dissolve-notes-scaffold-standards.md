# R04 — Dissolve `notes/`, scaffold `standards/`

**Phase:** 4 of 10 · **Repo:** parent · **Risk:** low · **Depends on:** R01–R03.

## Objective

Retire the `notes/` folder — its three files each have a real home elsewhere. Create `standards/`, the home for cross-cutting quality concerns (safety, security, accessibility, performance, responsiveness) — the "100 other things" that are not about what people do in the app.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Relocate the one live notes file

```
git mv notes/migration-to-primitives.md planning/rebuild-plan.md
```

It is the clean-slate rebuild plan — a HOW doc that belongs in `planning/`. The new name says what it is.

### 2. Archive the two dead notes files

```
git mv notes/eval-helpers-architecture.md  _attic/2026-05-19/notes/eval-helpers-architecture.md
git mv notes/cowork-sandbox-git-bug.md     _attic/2026-05-19/notes/cowork-sandbox-git-bug.md
```

`eval-helpers-architecture.md` is a dead redirect stub. `cowork-sandbox-git-bug.md` documented user error, not a real issue (PM confirmed) — archive it. After these moves `notes/` is empty and disappears. Confirm: `ls notes 2>/dev/null` shows nothing.

### 3. Scaffold `standards/`

```
mkdir -p standards
```

Create five stub files: `standards/safety.md`, `standards/security.md`, `standards/accessibility.md`, `standards/performance.md`, `standards/responsiveness.md`. Each is a one-section placeholder, identical shape:

```
# {Concern}

> **Stub — created 2026-05-19.** Placeholder for the {concern} standard. To be written:
> what the build must satisfy for {concern}, how it is verified, which ADRs and M-gates
> enforce it. Until written, treat existing scattered {concern} guidance in
> principles.md / policy.md / design-language.md as authoritative.

## Scope

(to be written)

## Requirements

(to be written)

## Verification

(to be written)
```

Also create `standards/README.md`:

```
# Standards

Cross-cutting qualities the build must satisfy — not "what people do in the app," but how
well it is built. Each file states requirements + how they are verified. Referenced by
ADRs, pipeline reviews, and the M-gates. New concern → new file here + a REGISTRY.md row.
```

### 4. Cross-reference sweep

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `notes/migration-to-primitives.md` | `planning/rebuild-plan.md` |
| `migration-to-primitives.md` | `rebuild-plan.md` |
| `notes/cowork-sandbox-git-bug.md` | `_attic/2026-05-19/notes/cowork-sandbox-git-bug.md` |
| `notes/eval-helpers-architecture.md` | `_attic/2026-05-19/notes/eval-helpers-architecture.md` |

Likely edits: `CLAUDE.md` (the "Active rebuild" pointer and the Commit-Rules section that links the cowork-git-bug doc), `product/MAP.md`, `JOURNAL.md`, `planning/adrs/ADR-0019-clean-slate-rebuild.md` (cites the rebuild plan).

### 5. Verification

- `notes/` no longer exists.
- `planning/rebuild-plan.md` exists; `standards/` has six files (five stubs + README).
- `rg --glob '!_attic/**' --glob '!web/**' 'notes/migration-to-primitives|notes/cowork-sandbox|notes/eval-helpers'` returns zero hits.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add standards/
git status
git commit -m "docs(consolidation): phase 4 — dissolve notes; scaffold standards"
```

## Completion

Date: 2026-05-22 · Commit: `903a100` · Notes:

- **`notes/` did NOT disappear.** A fourth file, `notes/deploy-to-hetzner.md`, was added in the initial pre-R01 doc-cleanup commit (`f9e2f9e`) — after the consolidation plan was written. R04's plan only covers three files and the ticket assumes empty-after-moves. `deploy-to-hetzner.md` left in place; `notes/` remains as a single-file directory. **[PM: confirm]** disposition — `operations/DEPLOY.md`? `planning/deploy-to-hetzner.md`? Or expand `standards/` to cover deploy?
- **`standards/` created** with 5 stubs (safety, security, accessibility, performance, responsiveness) + README per the ticket's template.
- **32-file cross-reference sweep** for `migration-to-primitives.md` → `rebuild-plan.md` succeeded with one bulk sed pass plus a separate pass for the two archived dead files. Negative-lookbehind verification confirms no live `notes/` references remain (the only `notes/migration-to-primitives` / `notes/cowork-sandbox` / `notes/eval-helpers` strings now live in `_attic/2026-05-19/`).
- **`places.md` still untracked.** Per PM ("part of another agent's workflow"), left untouched.
