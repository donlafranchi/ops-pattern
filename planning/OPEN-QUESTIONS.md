---
purpose: Items requiring PM judgment that no agent can resolve. Surfaced by the 2026-05-22 audit + 2026-05-23 end-to-end coverage pass.
layer: how
status: active
---

# OPEN-QUESTIONS — PM-decision queue

> Items from `pipeline-process-audit-2026-05-22.md` and the 2026-05-23 end-to-end coverage pass that **could not be implemented by an agent** because they require PM judgment, destructive ops outside the parent repo, or work in the `web/` repo (not in scope from the parent worktree).
>
> Each entry: what · why agent couldn't · proposed disposition · audit reference.

---

## 1 · Resolve F018 (audit R2)

**What.** F018 is the project's advertised flagship walkthrough (`AGENTS.md` line 18 → `_attic/2026-05-27/planning-history/F018-pipeline-trace.md`). The scenario is deferred. Its tickets (T036–T040) are in `tickets/archive/`. The trace doc claims "reproducible" — it is not. URLs in the trace (`/i/[slug]`) predate the 2026-05-11 naming pass (`/e/`).

**Why agent couldn't.** Either path (re-promote F018 with REVISE punch list done, or formally retire it as flagship and replace) is a PM decision about what the canonical example *should be*. Agent cannot pick a substitute concept.

**Proposed disposition options.**
- (a) Re-promote F018; rerun review; regenerate trace against live artifacts.
- (b) Retire F018 from flagship status; pick a Phase 1 substrate run (T041–T053) or a forthcoming Phase 2 surface scenario as the new trace; update `AGENTS.md` line 18.

**Audit ref:** R2, E1.

## 2 · BUILD-LOG.md prose cleanup (audit R7)

**What.** `web/BUILD-LOG.md` ticket table is current (142/142). Surrounding prose has rotted:
- Header cites `b1-mvp.md` (does not exist; active is `b1-primitives-plan.md`).
- "Remaining b1 MVP Work" lists T025/T026 as remaining though both are ✅ Complete.
- "Latest Commits" stops at T046 (11 tickets behind).
- "Notes" says "51/51 passing" (Phase 1 is 142/142).

**Why agent couldn't.** File lives in the separate `web/` repo (not accessible from the parent worktree). PM owns commits in `web/` from the Mac terminal.

**Proposed disposition.** Edit `web/BUILD-LOG.md` in the web repo: correct the bundle link, delete the four stale prose sections (or auto-generate from the table). Stale prose is worse than no prose.

**Audit ref:** R7, E3, F9.

## 3 · Web-side cleanups (audit R8 partial)

**What.** Two items in the audit's R8 cleanups live in the web repo:
- `web/evals/features/` graveyard — 10 spec files for scrapped F001–F005 + deferred F018. Real evals now live in `web/evals/phase-0/` and `phase-1/`.
- Shared sandbox harness (R10): replace per-ticket `tNNN-sandbox-check.mjs` with a single `web/scripts/sandbox-check.mjs`.

**Why agent couldn't.** `web/` repo, separate commits, PM-owned.

**Proposed disposition.** PM clears `web/evals/features/`; opens a substrate ticket for the shared sandbox harness.

**Audit ref:** R8 (partial), R10, E4, E5.

## 4 · Remove stale worktrees (audit E8)

**What.** `git worktree list` shows three worktrees:
- `clever-chaplygin-e82474` (active — this session)
- `jolly-hermann-31c513` (stale — older skill set, lacks `orient` and `weigh`)
- `laughing-shirley-5b1cc9` (stale — needs verification)

**Why agent couldn't.** `git worktree remove` is destructive and outside the active worktree's scope. PM call.

**Proposed disposition.** From the parent (`/Users/don/Projects/mainstreetmarket`):

```
git worktree remove .claude/worktrees/jolly-hermann-31c513
git worktree remove .claude/worktrees/laughing-shirley-5b1cc9
```

Verify each is on a branch you don't need first. `.claude` is already in `.gitignore`, so the directories are not tracked — but `git worktree` machinery still records them.

**Audit ref:** R8, E8, F11.

## 5 · Global skill-symlink cleanup (audit H6 follow-on)

**What.** The 2026-05-23 coverage pass moved retired skills `weigh` and `weigh` to `_attic/2026-05-19/retired-skills/`. The global symlinks in `~/.claude/skills/` likely still point at the old paths (now non-existent).

**Why agent couldn't.** Edits outside the project. Cleanup runs in the user's home directory.

**Proposed disposition.** Run:

```
rm -f ~/.claude/skills/pipeline-clarify-absolutes
rm -f ~/.claude/skills/pipeline-review-absolute
```

(Optionally re-run `skills/install.sh` to confirm the live set is clean.)

**Audit ref:** R8, H6.

## 6 · Backfill T055/T056/T057 commit hashes (audit H4)

**What.** `development/tickets/done/T055*.md`, `T056*.md`, `T057*.md` still carry `Commit (web): {pending}` / `Commit (parent): {pending}`. The hashes exist:
- web: `7f427b8` (T055), `f5e7e5a` (T056), `6090f71` (T057)
- parent: `1cf6a2b` (T055), `9fdec35` (T056), `47d03fe` (T057)

**Why agent couldn't.** Audit names these specific tickets but the audit author has not verified hashes against the current state of the worktree — and I'm in a fresh worktree. PM should verify and backfill (mechanical edit; takes 2 minutes).

**Audit ref:** R1 (drift-check item), H4.

## 7 · First DEVIATIONS rotation (audit R6 follow-on)

**What.** The rotation **policy** is now in `development/DEVIATIONS.md`. The file itself is still 611 lines / 49 entries spanning 2026-05-10 → 2026-05-19.

**Why agent couldn't.** Splitting requires deciding what counts as the "current rebuild phase." Phase 1 is closing; Phase 2 has not opened. Natural rotation point is the Phase 1→2 boundary — a PM-owned decision.

**Proposed disposition.** At the Phase 1→2 boundary, rotate all Phase 1 entries (T041–T057) to `development/archive/DEVIATIONS-phase-1.md`; live file resets to Phase 2 entries only.

**Audit ref:** R6, E2.

---

## How this file works

- Entries added by the audit pass + any agent that hits a "PM-only" decision.
- PM resolves entries inline (annotate with the decision + date) or removes when done.
- `orient` reads this file at session start and surfaces unresolved entries older than 14 days.
