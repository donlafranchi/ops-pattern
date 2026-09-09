# sync

**Tool:** Cowork. **Merges the retired** `close`, `sync`, `tidy`.

**Reads:** `socialus-web` Issues + git log (read-only), `planning/*.md` frontmatter, `HANDOFF.md`, `STATUS.md`, `ROADMAP.md`.

**Writes:** `STATUS.md` (overwrite), `ROADMAP.md`, `HANDOFF.md`, `planning/*.md` (`status` field; deletes shipped scenarios), root `.md` files (anti-sprawl).

**Does not write:** anything in `socialus-web`.

## What it does, in one pass

1. **Reconcile scenario status against Issue labels.** A scenario whose Issues are all `shipped` gets deleted — git holds it via the `archive-2026-09` tag and every commit since. A scenario with Issues still open stays `building`.
2. **Refresh STATUS.md.** Overwrite in place — what's true now, one screen. Never append.
3. **Refresh ROADMAP.md and HANDOFF.md** to match what actually shipped, is approved, or is still draft.
4. **Sweep for sprawl.** Any root `.md` outside the eight named in CLAUDE.md's target tree, any `planning/*.md` missing `status:`, any dead link — fix or flag to Don.
5. **Run `scripts/lint.sh`.** Clean before reporting done.

## Rules this skill lives inside

STATUS.md is overwritten, never appended (a dated section proposal gets refused). `DECISIONS.md` is append-only. Anything not in CLAUDE.md's target tree is not current.
