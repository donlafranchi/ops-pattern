# sync

**Tool:** Cowork. **Merges the retired** `close`, `sync`, `tidy`.

**Reads:** `socialus-web` Issues + git log (read-only), `planning/*.md` frontmatter, `HANDOFF.md`, `STATUS.md`, `ROADMAP.md`.

**Writes:** `STATUS.md` (overwrite), `ROADMAP.md`, `HANDOFF.md`, `DECISIONS.md` (strike-through resolutions only), `planning/*.md` (`status` field; deletes shipped scenarios), `README.md` (generated, via `scripts/view.sh` — never by hand).

**Does not write:** anything in `socialus-web`.

## What it does, in one pass

1. **Delete scenarios whose Issues are all closed.** Check every Issue tied to a `building` scenario's F-number (`gh issue list --state all --search "F060"`) — all closed means shipped. Delete the scenario and its review; git holds it via the `archive-2026-09` tag and every commit since.
2. **Prune DECISIONS.md.** Walk the "not settled" section against every dated line above it. A contradiction a newer line resolves gets struck through inline (`~~text~~ RESOLVED YYYY-MM-DD — {one clause}`), same pattern already used in the file. Never delete or rewrite a settled line — append only.
3. **Refresh STATUS.md.** Overwrite in place — what's true now, one screen. Never append.
4. **Refresh ROADMAP.md and HANDOFF.md** to match what actually shipped, is approved, or is still draft.
5. **Regenerate the view.** Run `scripts/view.sh` — it writes `README.md` from data. Never hand-edit `README.md`.
6. **Sweep for sprawl.** Any root `.md` outside the nine `scripts/lint.sh` allows, any `planning/*.md` missing `status:`, any dead link — fix or flag to Don.
7. **Run `scripts/lint.sh`.** Clean before reporting done.

## Rules this skill lives inside

STATUS.md is overwritten, never appended (a dated section proposal gets refused). `DECISIONS.md` is append-only. Anything not in CLAUDE.md's target tree is not current.
