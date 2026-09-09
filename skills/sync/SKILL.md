# sync

**Tool:** Cowork. **Merges the retired** `close`, `sync`, `tidy`.

**Reads:** `socialus-web` Issues + git log (read-only), `planning/*.md` frontmatter, `HANDOFF.md`, `STATUS.md`, `ROADMAP.md`.

**Writes:** `STATUS.md` (overwrite), `ROADMAP.md`, `HANDOFF.md`, `planning/*.md` (`status` field; deletes retired scenarios), `README.md` (generated, via `scripts/view.sh` — never by hand).

**Does not write:** anything in `socialus-web`. Never `DECISIONS.md` — `plan` owns it.

## What it does, in one pass

1. **Retire scenarios whose Issues are all closed.** For each scenario, check every Issue tied to its F-number (`gh issue list --state all --search "F060"`). All closed means shipped: **delete the scenario file — and nothing else.** There is no review file to delete; `review` writes into the scenario itself. Nothing is archived in-tree; git holds the history via tag `archive-2026-09` and every commit since.
2. **Refresh STATUS.md.** Overwrite in place — what's true now, one screen. Never append.
3. **Refresh ROADMAP.md and HANDOFF.md** to match what actually shipped, is approved, or is still draft.
4. **Regenerate the view.** Run `scripts/view.sh` — **every time you touch a scenario or `ROADMAP.md`**, no exceptions. It writes `README.md` from git and Issue data: Built = scenarios whose Issues are all closed; Building = open and not `deferred`; Next/Later = pulled from `ROADMAP.md`; Deferred = labeled `deferred`. **Nobody hand-edits `README.md`, ever** — if it's wrong, the data or the script is wrong.
5. **Sweep for sprawl.** Any root `.md` outside the nine `scripts/lint.sh` allows, any `planning/*.md` missing `status:`, any dead link — fix or flag to Don. `product/` docs drifting long or describing schema are not a `sync` fix: call `trim`.
6. **Run `scripts/lint.sh`.** Clean before reporting done.

## Rules this skill lives inside

STATUS.md is overwritten, never appended (a dated section proposal gets refused). `DECISIONS.md` is append-only and belongs to `plan`. Anything not in CLAUDE.md's target tree is not current.

## Related skills

- `plan` — owns `DECISIONS.md` and the scenario shape.
- `trim` — the judgment half of the sprawl sweep, for `product/`.
- `ticket` — the Issue titles and labels this reads. A fake F-number in a title corrupts `README.md`.
