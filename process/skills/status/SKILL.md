---
id: how-status-skill
name: status
description: Use when Don asks where the project is — "status", "regenerate STATUS", "where are we", "how stale is this", "refresh status", "what shipped". Runs scripts/state.sh against socialus-web read-only, reads scenario frontmatter, ROADMAP and the newest DECISIONS lines, and overwrites STATUS.md with a dated report. Never invents progress: anything it cannot verify from a source, it prints under "What this run could not verify".
---

# status

**Tool:** Cowork. **Owns one file:** `STATUS.md`.

**Reads:** `scripts/state.sh` (which itself reads `socialus-web` via `git` and
`gh`, read-only), `planning/scenario-*.md` frontmatter, `ROADMAP.md`, the newest
lines of `DECISIONS.md`, and the previous `STATUS.md` — for its Waiting-on-Don
list only, which is carried forward and labelled as unverified.

**Writes:** `STATUS.md`, whole, every time.

**Does not write:** anything in `socialus-web`. Never `DECISIONS.md` — `plan`
owns it. Never a scenario's `status` field — `sync` owns that.

## What it does, in one pass

1. **Run `bash scripts/state.sh`.** It fetches both repos, refuses to run if
   `gh` is unauthenticated, and emits open issues, PRs merged in the last 14
   days, and tickets whose numbers appear on main. **Do not reimplement any of
   this by grepping** — the four guard rails in that script are encoded
   mistakes (`socialus-web` #96).
2. **Count scenarios by `status:`** across `planning/scenario-*.md`. Name the
   ones marked `building`.
3. **Read `ROADMAP.md`** for the launch date and the current fortnight.
4. **Read the newest `DECISIONS.md` lines** — enough to say what was settled
   recently, not a summary of the file.
5. **Carry forward the previous `STATUS.md`'s Waiting-on-Don list**, verbatim in
   substance, under a heading that says it was not re-verified.
6. **Overwrite `STATUS.md`.** Never patch a section; never append.
7. **Run `scripts/lint.sh`.** Report anything it finds that this run caused.

## The shape of the file it writes

- **A generated-on date and time at the very top, in a block quote**, so
  staleness is the first thing read.
- **What it was derived from** — named sources with the `origin/main` sha the
  facts came from.
- **"Disposable. Regenerating replaces this file wholesale"**, stated in the
  file, plus how to ask for a refresh.
- **One screen.** It answers *where is this project*, not *what tickets exist*.
  The ticket list is `gh issue list`, which is always right; do not copy it in.
- **A closing "What this run could not verify" section.** Never empty by
  default — if everything really was verifiable, say that explicitly.

## Never invent progress

This skill exists because the document it replaces was hand-maintained and went
wrong: the deleted `HANDOFF.md` listed the metro waitlist as awaiting build
while it was already live.

- **A commit naming a ticket is not proof the ticket is done.** `state.sh`
  surfaces these as *check these*; carry that framing through. Never write that
  something shipped because a ticket number appeared in a commit message.
- **`status: building` in frontmatter is a claim, not evidence.** Nothing checks
  it against branches. Say so.
- **If a fact has no source in this run, it goes under "could not verify."**
  Carrying a line forward from the previous file is allowed; presenting it as
  freshly checked is not.
- **No estimates, no percentages, no "on track"** unless `ROADMAP.md` states
  them and they are attributed to it.

## Related skills

- `sync` — reconciles shipped work back into `ROADMAP.md` and retires scenarios.
  It also writes `STATUS.md` today; when the two disagree, `status` is the
  regenerator and `sync` should stop touching the file.
- `plan` — owns `DECISIONS.md`, which this only reads.
- `trim` — the `product/` spine, which this does not touch.
