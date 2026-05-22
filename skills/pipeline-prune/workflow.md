# pipeline-prune — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `JOURNAL.md`, `planning/DECISIONS.md`, `product/MAP.md`, `product/foundation/*.md`, all `product/systems/*.md` status banners + "Decisions encoded here" footers, `web/BUILD-LOG.md`, `development/DEVIATIONS.md` |
| **Writes** | `JOURNAL.md` (trims), `planning/DECISIONS.md` (collapses to pointers / archives), `_attic/journal/JOURNAL-YYYY-MM.md` (rotates), `_attic/decisions/DECISIONS-superseded-YYYY-MM-DD.md` (when ADRs supersede), `product/MAP.md` (alignment checks if new invariants surface), one or more `product/foundation/*.md` or `product/systems/*.md` (footers, banners) if a silently-load-bearing decision needs a home there. Never edits scenarios, tickets, or BUILD-LOG.md. |
| **Templates** | Banner formats below (archive header, journal-archive entry, decision-pointer row, alignment-check line). |
| **Hands to** | nothing. End of run. |

## Output

Light JOURNAL.md (top entry + pinned pickup), light DECISIONS.md (cross-cutting full + pointer index), new archive file(s) under `_attic/journal/` and/or `_attic/decisions/`, memorialized invariants in their durable homes, link integrity preserved.

## Process

### 1. Triage — what kind of prune is this?

Ask if not stated. Three modes:

- **journal-only** — JOURNAL.md is heavy; DECISIONS is fine. Most common.
- **decisions-only** — an ADR superseded today; collapse it. Or DECISIONS has accumulated full ADRs that have a home elsewhere.
- **both** — quarterly sweep.

Pick the mode. Do not silently expand scope.

### 2. Inventory before cutting

For the file(s) in scope:

- **JOURNAL.md** — list every dated entry below the top one. For each, name the dominant theme in one phrase. Note which entries already mention "RESOLVED", "DONE", "shipped", "merged", "approved" — those are the safe-archive candidates.
- **DECISIONS.md** — list every active ADR (cross-cutting + pointer index). For each, name its home (this file vs. system spec vs. foundation doc vs. UI doc vs. ops doc). Note status (Accepted, Refined-by-N, Superseded, Pending).

### 3. Identify silently-load-bearing decisions

This is the load-bearing step of the skill. Before pruning any entry, find the decisions inside it that are **silently load-bearing**.

A decision is silently load-bearing if **all four** are true:

1. **Forgetting it would not produce a test failure, type error, or runtime error.** The compiler / linter / test suite is silent on it.
2. **It is not stated as a principle in any active foundation, system, UI, or ops doc.** No spec carries it; no MAP alignment check names it.
3. **Violating it would create contradiction with another live decision.** Forgetting it doesn't just produce a regression — it produces inconsistency with something else the platform has committed to.
4. **A new contributor reading only the code would not infer it.** The decision restricts the design space (often a "we will NOT do X") in a way the data model doesn't.

A few canonical project examples to calibrate against:

- *Silently load-bearing:* "No `role` column on `members`." Code has no `members.role`, so a new contributor seeing two role-shaped flags elsewhere might cheerfully add one. The decision is enforced only by `people-first.md`'s principle, and by this assertion if it's in MAP.md.
- *Silently load-bearing:* "Messaging is item-or-group scoped, never Location-scoped." `policy-framework.md` carries the principle now (and `member.md` adds RLS enforcement per ADR-16); was silently load-bearing before either landed.
- *Not silently load-bearing:* "Action layer is the only write surface." Enforced by CI assertion + code review per ADR-7. Visible in code.
- *Not silently load-bearing:* "Same-transaction event-row commit." Enforced by eval-runners on every ticket per ADR-7.

If a decision is silently load-bearing and has no home, **memorialize it before archiving the entry that named it.** Skip step 4 only if step 3 found none.

### 4. Memorialize — pick the right home, in order

For each silently-load-bearing decision, pick the *first* of the following that fits:

1. **MAP.md alignment-check line** — if it's a binary "always true" assertion ("every X is Y"). Cheap to add; high signal at session start. Preferred.
2. **Foundation doc** (`people-first.md`, `policy-framework.md`, `agent-assistance.md`, etc.) — if it's a principle that fits an existing foundation theme.
3. **System spec "Decisions encoded here" footer** — if it shapes one spec and the spec already has a footer.
4. **New short foundation doc** under `product/foundation/` — only if the decision doesn't fit any existing home. Rare. Justify in writing.
5. **New cross-cutting ADR** in DECISIONS.md — only when the decision is genuinely cross-cutting and has no doc home anywhere. Even rarer. Re-check: is the goal really to add an ADR, or to retire the heaviness?

**Never memorialize into the JOURNAL itself.** The journal is reverse-chron narrative; it is the wrong substrate.

**Never memorialize into auto-memory** (`~/.../memory/`) without explicit user direction — memory is per-user-conversation, not project-resident.

### 5. Rotate the journal

For JOURNAL.md, the cut policy:

- **Keep:** the top entry plus the pinned "Next session pickup."
- **Archive:** everything older, into `_attic/journal/JOURNAL-YYYY-MM.md` (month of the entry's date, not today). Create or append.
- **Refresh "Next session pickup"** — verify each numbered item is still live; drop ones the top entry says are done; carry forward any that are not.

If two top entries collide on the "top" slot (e.g., two sessions on the same day), keep both as siblings under one date heading. Don't try to merge into one.

Archive header format (the very top of each monthly archive file):

```markdown
# JOURNAL — YYYY-MM archive

> Archived from the active [`../../JOURNAL.md`](../../JOURNAL.md) on YYYY-MM-DD. The active JOURNAL keeps only the current top entry and a pinned "Next session pickup." Older entries live here for trace.

For pre-mission-clarity entries, see [`JOURNAL-pre-mission-clarity-2026-05-08.md`](JOURNAL-pre-mission-clarity-2026-05-08.md).

---
```

### 6. Trim DECISIONS

For DECISIONS.md, the cut policy:

- **Keep full text in DECISIONS:** ADRs that are cross-cutting AND have no other doc home.
- **Collapse to pointer in the index table:** ADRs whose decision is already stated in a system spec / foundation doc / UI doc / ops doc. The pointer row names the home + a one-line shape.
- **Archive:** SUPERSEDED ADRs in full, into `_attic/decisions/DECISIONS-superseded-YYYY-MM-DD.md`. Add anchored cross-links from the pointer index.

Pointer row format:

```markdown
| ADR-N | Status | Lives in [link] | One-line shape now |
```

Superseded archive header:

```markdown
## ADR-N: {original title}

**Status:** SUPERSEDED YYYY-MM-DD. {one-sentence supersession reason and live-successor pointer.}

**Original date:** YYYY-MM-DD
**Original status:** {what it was}

[Original Context / Decision / Consequences preserved below, unedited]
```

### 7. Update MAP.md if anything new lands

If step 4 added an alignment check to MAP.md, also:

- Re-read the alignment-check section end-to-end to make sure the new check doesn't contradict any existing check.
- If it does, surface the contradiction to the PM. Do not silently resolve.

Alignment-check format (one line, present-tense, binary):

```markdown
N. Every {X} {verb}s {Y}. {Brief why, only if non-obvious.}
```

### 8. Verify

Before declaring done:

- All links resolve (relative paths under `_attic/journal/`, `_attic/decisions/`, `product/foundation/`, `product/systems/`, etc.).
- JOURNAL.md no longer carries entries past the cut policy.
- DECISIONS.md pointer index has a row for every ADR-N (including superseded; pointer goes to archive).
- Every memorialized invariant has a home doc (not just a JOURNAL mention).
- BUILD-LOG.md is unchanged.

Run `wc -l` on the trimmed files; report before/after to the PM.

### 9. Commit guidance

This is a pipeline-doc change. Commit message format per the project's CLAUDE.md commit rules:

```
docs(pipeline): prune {what} — archive {dated archive file(s)}, memorialize {N} invariants
```

Do not auto-commit — surface the diff and let the PM commit.

## Heuristics — judgment calls the skill must make

### How heavy is "heavy"?

Working thresholds (not hard rules):

- **JOURNAL.md** — heavy when > 100 lines or > 5 dated entries. Past that, the top entry stops being scannable.
- **DECISIONS.md** — heavy when > 250 lines or > 10 ADRs with full text. The pointer index can hold any number of pointers; the heaviness is in unfolded ADRs.

### Is this entry a play-by-play or a load-bearing record?

Heuristics for "play-by-play" (safe to archive):

- Names tickets that have already shipped per BUILD-LOG.md.
- Says "approved", "merged", "ratified", "done" of items the rest of the tree confirms.
- References scenarios that have closed.
- Has no novel principle, no design refusal, no new invariant.

Heuristics for "load-bearing" (memorialize before archiving):

- Names a decision the platform will not re-litigate ("we will NOT do X", "this is always true").
- Refuses a capability or surface that would otherwise be tempting.
- Names a separation between two layers that the data model alone does not enforce.
- The PM has stated this commitment more than once in the journal (smell — should have a home).

### Should this go in MAP.md or a foundation doc?

- MAP.md alignment-check — one line, binary, structural. "Every Item ultimately FKs to a Member."
- Foundation doc — needs a paragraph of context, names a principle, applies to many specs. Goes into `people-first.md` / `policy-framework.md` / etc.

If the decision can be expressed in one binary sentence, MAP.md is enough. If it needs explanation, it's a foundation doc.

### When to stop pruning

- The live file passes a 30-second scan test: a fresh reader can name the current state and the next action.
- No silently-load-bearing decision is unmemorialized.
- Every archive cross-link resolves.

Past that, more pruning is just churn.

## Don'ts

- **Don't delete entries.** Everything moves to archive.
- **Don't memorialize decisions that are already enforced by code.** The code is the memo. Adding a redundant principle line creates the kind of duplication this skill exists to reduce.
- **Don't add alignment checks to MAP.md unless their absence creates real contradiction risk.** The list is load-bearing precisely because it's short.
- **Don't touch active scenarios, tickets, BUILD-LOG.md, or DEVIATIONS.md.** Those are operational state, owned by the pipeline stages.
- **Don't run during an open scenario phase.** Surface and defer.
- **Don't merge entries from different sessions into one.** Reverse-chron is the contract.
- **Don't auto-commit.** Surface the diff; the PM commits.
