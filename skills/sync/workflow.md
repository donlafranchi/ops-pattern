# sync — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `web/` git log + branch state, `planning/now/bundle-{N}-checklist.md`, `planning/STAGE-LEDGER.md`, `planning/stage-ledger/*.md`, `planning/now/bundle-{N}.md` (active bundle), `development/tickets/done/` (for commit hashes + completion dates) |
| **Writes** | `planning/now/bundle-{N}-checklist.md`, `planning/STAGE-LEDGER.md`, `planning/stage-ledger/{concept}.md` |
| **Does NOT write** | Code, tickets, scenarios, specs, JOURNAL. If the reconciliation reveals a deeper problem (missing scenario, orphaned ticket), flag it — don't fix it. |
| **Commit** | `docs(pipeline): sync progress tracking — {summary}` in the parent repo. Never commits to web/. |

---

## Post-build mode

Triggered by `build` after a successful merge to main. Input: the ticket ID and F-number (or substrate slug) that just shipped.

1. **Read the per-file ledger** for the concept (`planning/stage-ledger/{F###}.md` or `{slug}.md`).

2. **Append the stage transition.** Add a dated bullet to the "Stage history" section:
   ```
   - **{YYYY-MM-DD}** · `done` — merged to main (`{branch}`); {commit hash}
   ```
   Update frontmatter: `stage_current: done`, `last_activity: {date}`.

3. **Update the monolith.** Find the concept's row in `planning/STAGE-LEDGER.md`. Update the Stage column and remove any "not merged" / "awaiting merge" / "merge pending" language from the Notes column. If the row references an old branch name, replace with the merge commit hash.

4. **Update the checklist.** Find the corresponding line in `planning/now/bundle-{N}-checklist.md`:
   - If evals are green → mark `[x]`.
   - If merged but evals haven't run → mark `[~]` with note "merged, eval pending".
   - If the item is a substrate foundation row → mark `[x]` (substrate has no eval).

5. **Update the "Where we are right now" prose** at the bottom of the checklist if the change materially shifts the summary (e.g., a whole section is now complete).

6. **Report.** One-line BLUF: "Synced {concept} → done. Checklist: {item} checked off."

No PM ratification needed — the merge was the gate.

---

## Standalone mode

Triggered by the PM directly. Full reconciliation pass.

### Step 1 — Gather git ground truth

Run these in the web repo:

```bash
# All branches and their merge status relative to main
cd web && git branch --merged main
cd web && git branch --no-merged main

# Recent merge commits on main (last 30)
cd web && git log --merges --oneline -30 main

# Current HEAD
cd web && git rev-parse --short HEAD
```

Build a map: `{branch_name → merged|unmerged}` and `{merge_commit → branch_name, date}`.

### Step 2 — Read all three surfaces

- Read `planning/now/bundle-{N}-checklist.md`.
- Read `planning/STAGE-LEDGER.md` (the monolith — active features + active substrate tables).
- Glob `planning/stage-ledger/*.md` and read each file's frontmatter (`stage_current`, `last_activity`).

### Step 3 — Reconcile

For each active concept (F-number or substrate slug), compare:

| Check | Source of truth | Fix |
|---|---|---|
| Per-file says "not merged" but branch is merged to main | git | Update per-file → `done` (or appropriate stage) |
| Per-file says `building` / `built` but merge commit exists on main | git | Advance to `done` if evals green, or `eval` if evals pending |
| Monolith row disagrees with per-file stage | per-file (canonical) | Update monolith to match per-file |
| Monolith contains "awaiting merge" / "not merged" but branch is merged | git | Remove stale merge language |
| Checklist item unchecked but concept is `done` | per-file | Check off `[x]` |
| Checklist item unchecked but concept is `building`/`eval` and merged | git | Mark `[~]` with note |
| Per-file `stage_current` doesn't match the latest Stage history bullet | per-file body | Fix frontmatter to match body |
| Monolith row references ticket numbers that don't match per-file | per-file | Update monolith |

### Step 4 — Propose changes

Present a diff summary to the PM:

```
Proposed sync — {N} changes across {M} files:

Per-file ledger:
  F032: building → done (branch t095 merged 2026-06-03)
  S-metro: product → done (branch t103 merged 2026-06-11)

Monolith:
  F032: removed "awaiting merge to main"
  S-metro: stage → done

Checklist:
  [x] Find another Member's profile and follow them (was unchecked)
  [x] Metro polygons (was unchecked)

Ratify? (y/n)
```

### Step 5 — Apply on ratification

On PM `y`:
1. Write all changes.
2. Update the "Where we are right now" prose in the checklist.
3. Stage and commit: `docs(pipeline): sync progress tracking — {summary}`.
4. Push the parent repo.

On PM `n`: PM specifies which changes to keep or amend. Apply the subset, re-confirm.

---

## Edge cases

**Concept has no per-file entry.** Create one using the README template in `planning/stage-ledger/README.md`. Backfill stage history from the monolith row and git log.

**Branch was deleted but never merged.** Flag as "branch missing, not on main — confirm deferred?" Don't auto-defer.

**Eval status unknown.** If you can't determine whether evals ran, mark the checklist item `[~]` with "merged, eval status unknown" and flag for the PM.

**Monolith "frozen" header.** The monolith says "frozen as of 2026-06-03" but active entries are still being updated there (as confirmed today). Continue updating both surfaces until the PM explicitly retires the monolith tables.

## What this skill does NOT do

- Does not run evals. That's `test`.
- Does not move scenarios between kanban lanes. That's `scope` or PM.
- Does not create or modify tickets. That's `ticket`.
- Does not assess architecture or design quality. That's `review`.
- Does not fix code. That's `build`.

This skill only reconciles tracking docs against reality. If reality is wrong, that's a different skill's problem.
