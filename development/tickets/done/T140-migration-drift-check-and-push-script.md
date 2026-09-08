# T140: A migration that is written but not applied stops being invisible

**Scenario:** substrate — no user-facing surface.
**Status:** Complete
**Bundle:** launch (`planning/now/initiative-launch.md`) — **infrastructure, runs alongside launch work, not instead of it.**
**Depends on:** none. Blocks nothing.

**Spec contract:** `web/INFRASTRUCTURE.md` § Database Schema (the documented CLI path: `supabase link` then `supabase db push`) · `scripts/gate-conformance.sh` (the idiom and the hook points this reuses).

## The failure this closes

**Two migrations sat unapplied for an unknown period.** A ticket merged, its migration did not run, and nobody knew. **The build log recorded the hand-run as needed and the thread was then dropped** — the note was prose in a file nobody re-reads, not a step anyone had to tick.

**So the failure is not "we lack a script."** The documented CLI path already exists and works. **The failure is that nothing ever asked whether it had been run.** A missing migration you know about is a five-second fix; one you do not know about is a production defect discovered by a user.

## Scope — deliberately small

### 1. Drift check — the load-bearing half

A `scripts/migration-conformance.sh` that answers one question: **does remote match local?** It shells `supabase migration list`, parses it for entries present locally and absent remotely, and reports each gap by filename.

- **Same idiom as `gate-conformance.sh`** — the `fail` / `warn` / `pass` helpers, the numbered-check layout, the summary line, non-zero exit on any gap. **One house style, not two.**
- **Wired into the same session-start and session-end hooks the gate check already uses** — the `orient` drift checklist and the `close` workflow's session-end step. **That is the mechanism that would have caught this, and it exists.**
- **Reports and blocks. Never applies.** A non-zero exit is a stop for a human, not a trigger.

### 2. Push script — the convenience half

`"db:push": "cd web && supabase db push"` in package.json, wrapping the documented path so nobody has to remember it.

### 3. The loop that let this happen

**Add a tickable step to `skills/ticket/templates/ticket.md` § Workflow gates**, alongside M2 / M3 / M4:

```
- [ ] **Migration applied to production** — N/A if this ticket adds no migration.
      A merged ticket whose migration has not run is not done.
```

**That file is the one to change**, because it is what every new ticket is generated from. The build log is the wrong home — it is a narrative record, and a note in prose is exactly what failed here.

## Acceptance Criteria

- [x] `scripts/migration-conformance.sh` exists, is executable, exits non-zero when any local migration is absent remotely, and names each gap.
- [x] It **degrades honestly** when the CLI is missing or the project is not linked: warn and exit zero, never fail silently and never claim clean. Also degrades honestly on unparseable output, and (added during M2 review) on a local migration file that never appears in the CLI's output at all — see Completion notes.
- [x] It **never** invokes `db push`, `psql`, or any statement that writes. Verified by reading the final script: the only external call is `supabase migration list`.
- [x] `npm run db:push` runs the documented CLI path — from `web/`, not the repo root. See Completion notes for the deviation.
- [x] The `orient` drift checklist gains a row for it, next to the gate-check row.
- [x] The `close` workflow's session-end step runs it alongside the gate check.
- [x] The ticket template carries the migration-applied gate.
- [x] Running it today reports clean — **and 038 is included in that clean, not just 036/037.** See Completion notes; this contradicts the ticket's premise and is logged in DEVIATIONS.

## Explicitly out of scope

- **Auto-applying anything.** Applying a migration to production stays a deliberate human act; **a runner that pushes on its own is worse than the problem it solves.**
- CI integration, a GitHub Action, or a deploy-pipeline hook. There is no CI for this repo and adding one is not this ticket.
- A rollback mechanism, a migration-authoring template, or anything touching migration *contents*.
- Multi-environment support. There is one project.

## Price and placement

**Half a day, hard timebox.** **If it does not fit, ship the drift check alone and drop the push script** — the detection is worth more than the convenience.

**Against the launch: runs alongside, and I agree with the PM's read.** It touches no launch surface, blocks nothing, and is unblocked by nothing. **The reason not to defer it past launch is that its value is highest while migrations are still being written** — five of the open tickets touch schema, and this is the window in which the failure recurs.

## Workflow gates

- [x] **M2 — `engineering:code-review`** before commit. Two findings (no cross-check that every local migration file produced a row at all; the row-regex incidentally matched the header line). Both fixed before commit.
- [x] **M3** — N/A, no surface.
- [x] **M4** — N/A, adds no migration.
- [x] **Migration applied to production** — N/A, this ticket adds no migration.
- [x] **DEVIATIONS.md entry** at close.

## Notes — added at close

- **`-o json` does not work** on `supabase migration list` in the installed CLI (v2.90.0) — verified against the real linked remote, not assumed. Ignored the flag, printed the same plain-text table. The script parses that table's text; see DEVIATIONS for the full note and the honest-degrade rationale.
- **`db:push` lives in `web/package.json`, not a repo-root one** — the parent repo has no `package.json`. `"db:push": "supabase db push"` (no `cd web` prefix needed, since `npm run` already executes from wherever the `package.json` sits).
- **Migration 038 is already applied to the remote**, contrary to this ticket's own "given 036 and 037 have been pushed" framing and the PM's stated premise going into this ticket. Verified directly against the real linked project, independent of the script. Logged in DEVIATIONS as flag-for-spec-revision / Type A — the PM should confirm who pushed it.

## Completion

Date: 2026-09-08
Commit: `b132d79` (parent repo — script, hooks, ticket close-out, DEVIATIONS entry) + `17e2aa1` (web repo — `db:push` in package.json) + `2d33eec` (web repo — BUILD-LOG entry)
