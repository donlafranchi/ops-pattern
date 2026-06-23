# close — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `development/tickets/T{NNN}-{slug}.md`, `development/tickets/done/`, `development/deviations/T{NNN}.md`, `planning/STAGE-LEDGER.md`, `planning/stage-ledger/{concept}.md`, `planning/now/bundle-1-checklist.md`, `planning/now/scenario-F###-*.md`, `planning/now/review-F###.md`, `web/BUILD-LOG.md`, git log + branch state in `web/` and parent repo |
| **Writes** | Moves ticket → `development/tickets/done/`, updates `planning/STAGE-LEDGER.md`, updates `planning/stage-ledger/{concept}.md`, updates `planning/now/bundle-1-checklist.md`, updates `web/BUILD-LOG.md`. When all tickets for an F-number are done, moves scenario + review → `planning/done/YYYY-MM-DD-f###-{slug}/` |
| **Does NOT write** | Code, specs, JOURNAL. Does not create or edit scenarios — only archives them to `done/`. Does not commit — hands PM the clearlock + commit line. |
| **Does NOT read** | `planning/backlog/` |

---

## Single-ticket mode ("close T###")

### 1. Verify merge

Check that branch `t{nnn}` is merged to main:

```bash
cd web && git branch --merged main | grep -q "t{nnn}"
```

If not merged, stop:
> T### branch `t{nnn}` not merged to main. Run `build` first.

For parent-repo tickets, check the parent repo instead.

### 2. Move ticket

Move `development/tickets/T{NNN}-{slug}.md` → `development/tickets/done/T{NNN}-{slug}.md`.

If already in `done/`, skip and note "ticket already in done/".

### 3. Verify DEVIATIONS entry

Check `development/deviations/T{NNN}.md` exists. Per rebuild rule #6, every ticket close requires an entry — even a one-line "no deviations."

If missing, flag:
> **Missing:** `development/deviations/T{NNN}.md` — rebuild rule requires a deviations entry at every ticket close. Create one before closing.

Do not create it — that's `build`'s job. Stop the close and hand back.

### 4. Stamp STAGE-LEDGER

Find the ticket's F-number (or substrate group) from the ticket frontmatter or Scenario line.

**Per-file ledger** (`planning/stage-ledger/{concept}.md`): append a dated bullet to Stage history:
```
- **{YYYY-MM-DD}** · `done` — T{NNN} closed; branch `t{nnn}` merged to main
```
Update frontmatter: `stage_current: done`, `last_activity: {date}`.

Only advance to `done` if this was the **last** ticket for the concept. If sibling tickets remain open, update the note but leave the stage as `building`.

**Monolith** (`planning/STAGE-LEDGER.md`): find the row for the F-number or substrate group. Update the stage column and clear any "awaiting merge" / "not merged" language. If no row exists, flag:
> **Missing:** No STAGE-LEDGER row for {F-number/substrate}. PM should add one.

### 5. Update checklist

Find the matching line in `planning/now/bundle-1-checklist.md`.

- If all tickets for that feature are now in `done/` → mark `[x]` with date.
- If this ticket closed but siblings remain → update the note to reflect current state (e.g., "2 of 3 tickets done").
- If the line was `[ ]` or `[~]` and this is the last ticket → flip to `[x]`.

### 6. Update BUILD-LOG

Find the T### entry in `web/BUILD-LOG.md`. Ensure it shows:
- The commit hash (from the ticket's Completion section)
- Merged status
- Date

If the entry is missing or incomplete, update it.

### 7. Clean up worktree

Check if the worktree still exists:

```bash
cd web && git worktree list | grep "web-t{nnn}"
```

If it exists, flag:
> **Worktree still exists.** Run from Mac terminal:
> ```
> cd web && git worktree remove ../web-t{nnn} && git branch -d t{nnn}
> ```

Do not remove it — hand the command to the PM.

### 8. Archive scenario + review (if feature complete)

Skip this step if the ticket's Scenario line is `substrate` (no F-number).

**a. Extract F-number.** Read the ticket's `**Scenario:**` line. Extract the F-number (e.g., `F037`).

**b. Check sibling tickets.** Scan `development/tickets/` (excluding `done/`) for any other ticket whose `**Scenario:**` line references the same F-number. If any remain, skip — the scenario stays in `planning/now/` until the feature fully ships.

**c. If all tickets for the F-number are in `done/`, propose the move:**

> All tickets for F{###} are done. Ready to archive scenario + review to `planning/done/`? (y/n)

**d. On yes:** create `planning/done/{YYYY-MM-DD}-f{###}-{scenario-slug}/` and move:
- `planning/now/scenario-F{###}-{slug}.md` → the new dated directory
- `planning/now/review-F{###}.md` → the same directory (if it exists; not every scenario has a review)

Add a `RETIRED.md` in the directory with one line: `Retired from: planning/now/` (matches the existing convention in `planning/done/`).

**e. On no:** skip. The PM directs follow-up.

### 9. Hand PM the commit

Output the commit message + clearlock line for all parent-repo changes:

```
docs(pipeline): close T{NNN} — {ticket title}

# Run from Mac terminal:
clearlock && cd /Users/don/Projects/community && \
  git add development/tickets/done/T{NNN}-{slug}.md \
          planning/STAGE-LEDGER.md \
          planning/stage-ledger/{concept}.md \
          planning/now/bundle-1-checklist.md && \
  git commit -m "docs(pipeline): close T{NNN} — {ticket title}"
```

If step 8 archived a scenario + review, include those paths too:

```
  git add planning/done/{YYYY-MM-DD}-f{###}-{slug}/ \
          planning/now/  # catches the removal of scenario + review from now/
```

Adjust the `git add` paths to include only files that actually changed.

---

## Batch mode ("close all shipped tickets")

### 1. Inventory open tickets

List all files in `development/tickets/` (excluding `done/`). Extract ticket numbers.

### 2. Check merge status

For each ticket:
- Extract the branch name `t{nnn}` from the ticket number.
- Check if branch is merged to main: `cd web && git branch --merged main | grep "t{nnn}"`.
- If no branch found, check the ticket's Completion section for a commit hash. Verify the commit exists on main: `cd web && git log --oneline main | grep "{hash}"`.

### 3. Classify

- **Merged:** branch on main (or commit hash confirmed on main). Run single-ticket sequence.
- **Open:** branch exists but not merged. Genuinely still in progress.
- **Ambiguous:** no branch, no commit hash on main. Flag for PM review.

### 4. Execute

Run the single-ticket sequence (steps 2–8) for every merged ticket.

### 5. Report

```
Status: Done — closed {N} tickets, {M} still open, {K} ambiguous.

Closed: T081, T083, T085
Still open: T090 (branch t090 not merged), T092 (branch t092 not merged)
Ambiguous: T088 (no branch, no commit on main — confirm status?)

Next: Run clearlock + commit for the batch.
Want detail? Say "expand."
```

Then hand PM a single combined commit:

```
docs(pipeline): close T081, T083, T085

# Run from Mac terminal:
clearlock && cd /Users/don/Projects/community && \
  git add development/tickets/done/ \
          planning/STAGE-LEDGER.md \
          planning/stage-ledger/ \
          planning/now/bundle-1-checklist.md \
          planning/done/ \
          planning/now/ && \
  git commit -m "docs(pipeline): close T081, T083, T085"
```

The `planning/done/` and `planning/now/` paths cover any scenarios + reviews archived in step 8.

---

## Final report

Default shape:

```
Status: Done — closed T{NNN} ({ticket title})
Next: {clearlock + commit line, or "none" if PM already ran it}
Want detail? Say "expand."
```

Withhold file lists, per-step trace, and git output until PM says "expand."
