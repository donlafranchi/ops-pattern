# build — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `development/tickets/T{NNN}-{slug}.md`, `planning/now/scenario-F{NNN}-{slug}.md` (the approved scenario the ticket references — lane check at step 2 enforces this), `product/systems/{name}.md` (Data model implications only), `product/ui/design-language.md` (for UI work), `web/` (code, tests), `BUILD-LOG.md` |
| **Writes** | `web/` (code + unit tests), `development/tickets/{T-file}` (Completion section, including the commit hash you produce), moves ticket → `development/tickets/done/`, updates `BUILD-LOG.md`. Runs `git add` + `git commit` after PM `y` on the permission prompt (per CLAUDE.md Commit Rules). |
| **Branch** | One per ticket: `t{nnn}`, **in its own worktree** at `../web-t{nnn}/` (or `../community-t{nnn}/` for parent-repo work). Agent creates at session start via `git worktree add`; agent merges to `main` and removes the worktree at ticket close after PM `y` on the merge-permission prompt. Worktrees isolate concurrent agents so uncommitted edits in one ticket can't be overwritten by another agent committing in the shared `web/` tree. |
| **Templates** | none — ticket template lives in `ticket/`; build implements, doesn't author specs |
| **Does NOT read** | `planning/backlog/`, eval test files (write-mode evals are an external oracle), `product/foundation/` |
| **Does NOT run** | `git push`, `git rebase`, anything that rewrites history. `git add` + `git commit` only fire after PM `y` on the permission prompt at ticket close. Worktree creation happens at session start. |
| **Calls in** | `docx`/`pptx`/`xlsx`/`pdf` (Anthropic) for non-code deliverables |
| **Hands to** | `sync` (post-build mode) → `test` (run mode). After merge, sync updates the three progress-tracking surfaces (per-file ledger, monolith, checklist) before handing to test for eval verification. |
| **Pre-commit gate** | `engineering:code-review` (M2) — MANDATORY between green and the PM permission prompt per CLAUDE.md rebuild-phase rule #3. The reviewed state is what you commit; fixes happen in the same loop, not as follow-up commits. Then `simplify-review` — structural pass on the staged diff; Approve to continue, Request changes → fix forward (in-scope) or log to DEVIATIONS (out-of-scope). |

## TDD loop (every ticket)

0. **Lock pre-flight.** Run `ls web/.git/index.lock web/.git/worktrees/*/index.lock .git/index.lock .git/worktrees/*/index.lock 2>/dev/null`. If any prints a path, stop and ask the PM to run `clearlock` before continuing. Do NOT attempt to remove the lock yourself — the sandbox lacks the permission and silent failure here wedges every later git call. Per CLAUDE.md Commit Rules.
1. **Start the ticket worktree.** From the main `web/` working tree run `git worktree add ../web-t{nnn} -b t{nnn}` (or `git worktree add ../community-t{nnn} -b t{nnn}` from the parent repo for parent-repo work). Then `cd ../web-t{nnn}` and do all subsequent work there. Worktrees share the underlying `.git/` but have independent working trees and indices — uncommitted edits in `../web-t{nnn}/` cannot be overwritten by an agent committing in `web/` or in a sibling worktree. PM merges back at close and removes the worktree (`git worktree remove ../web-t{nnn}`).
2. **Scenario lane check.** Read the ticket's `Scenario:` reference to get the F-number and slug. Verify the scenario file exists in `planning/now/`. Substrate tickets (`Scenario: substrate`) skip this check.
   - **In `planning/now/`** → proceed.
   - **In `planning/next/`** → flag: *"Scenario is in next/ but should be in now/ before build starts. The ticket skill should have moved it — run close or manually move it."* Do not proceed until resolved.
   - **In `planning/backlog/`** → hard stop: *"Scenario is still in backlog/ — this violates the build firewall. Cannot proceed."*
   - **Not found in any lane** → stop and escalate: the scenario reference in the ticket may be stale or misspelled.
3. Read `BUILD-LOG.md` for current state.
4. Read the ticket in `development/tickets/T{NNN}-{slug}.md`.
5. Read the approved scenario at `planning/now/scenario-F{NNN}-{slug}.md` referenced by the ticket.
6. Read the relevant `product/systems/{name}.md` "Data model implications" section *only* — for forward-looking schema columns to include at MVP.
7. Read the project's design language doc (if it has one) for any UI work.
8. Write failing tests (red). Tests must trace back to a Then-clause in the scenario or an item in the ticket's checklist.
9. Run tests — confirm FAIL.
10. Write minimal code to pass.
11. Run tests — confirm PASS (green).
12. Refactor if needed.
13. **M2 — `engineering:code-review` MANDATORY before commit.** Invoke the skill against the diff (`git diff` + `git diff --cached` for this ticket's files). Verdicts: PROCEED → continue; REQUEST → land the requested fixes in the same loop, re-run tests, re-invoke M2; BLOCK → stop, escalate via DEVIATIONS + `scope`. Pre-commit placement is load-bearing — issues caught here land as fix-now (clean first commit) instead of fix-forward. Per CLAUDE.md rebuild-phase rule #3.
14. **`simplify-review` — structural pass before commit.** Run `/simplify-review` on the staged diff. Verdict **Approve** → continue. Verdict **Request changes**: (a) if the findings are *inside* this ticket's scope, fix forward, re-run tests, re-run `/simplify-review`, loop until Approve; (b) if the findings are *outside* this ticket's scope, log each to `development/DEVIATIONS.md` with the ticket ID, the lens, and a one-line note, commit the ticket as-is, and surface to the PM in the next journal entry. The build agent does not autonomously expand ticket scope — the skill identifies structural debt; the PM decides whether to triage now or later.
15. Update the ticket's Completion section (Date filled in; commit hash gets filled at step 19, after you commit).
16. Move the ticket file to `development/tickets/done/`.
17. Update `BUILD-LOG.md`.
18. **Ask PM permission to commit.** Output one line, verbatim:

    ```
    Ready to commit T{NNN} on branch t{nnn} with message "T{NNN}: {Title}"? (y/n)
    ```

    On **y**: re-run the lock pre-flight (`ls web/.git/index.lock web/.git/worktrees/*/index.lock 2>/dev/null`); if clean, run `git add <files> && git commit -m "T{NNN}: {Title}"` inside the worktree. If a lock prints, stop and ask the PM to run `clearlock` first. On **n**: do not commit — PM either amends the message (re-prompt) or defers (leave the worktree dirty, hand off).

19. **Backfill the commit hash** into the ticket's Completion section using the hash printed by `git commit`. Same session — never leave `{pending}`.

20. **Ask PM permission to merge.** Output one line, verbatim:

    ```
    Ready to merge t{nnn} into main and remove the worktree? (y/n)
    ```

    On **y**: re-run the lock pre-flight; if clean, run `cd web && git switch main && git merge --no-ff t{nnn} && git worktree remove ../web-t{nnn} && git branch -d t{nnn}` (substitute `cd ..` and parent-repo paths for parent-repo work). Backfill the merge commit hash alongside the ticket commit hash in the Completion section. On **n**: leave the branch and worktree in place — PM directs follow-up.

## What you do NOT do
- Write tickets. (`ticket` does.)
- Write scenarios. (`scope` does.)
- Write evals. (`test` does, *before* you start.)
- Read `planning/backlog/`. Ever.
- Roll back a commit. Fix forward.

## Reference-only reads (consult, do not change)

- The project's design language doc (if it has one) — for any UI work.
- The relevant `product/systems/{name}.md` — for any schema change. Read its "Data model implications" section and include forward-looking columns at MVP.
- The project's surface file (e.g. `product/ui/community-platform.md`) — for page roles and capability tiers.

## When the deliverable is not code

If the ticket's deliverable is a Word doc, presentation, spreadsheet, or PDF, invoke the matching Anthropic-provided skill before producing the file:

| Deliverable | Skill |
|---|---|
| .docx report or memo | `docx` |
| .pptx deck | `pptx` |
| .xlsx spreadsheet, fixtures, model | `xlsx` |
| .pdf — generation, form-fill, merge, OCR | `pdf` |

Read that skill's SKILL.md first. Do not hand-write these formats.

## Escalation rules

| Situation | Action |
|---|---|
| Cannot implement as specced | Annotate in `development/DEVIATIONS.md` with the spec divergence, hand back to `scope`. Do not improvise. |
| Scenario logic is wrong | Stop. Annotate in `DEVIATIONS.md`, escalate to `scope`. |
| Need a new ticket (current ticket grew) | Hand to `ticket`. Do not write the ticket yourself. |
| Need to reprioritize | Escalate to `scope`. |
| Feature needs redesign | Escalate to `scope` → `explore`. |
| Eval failure that requires the scenario to change | Stop. Escalate to `scope`. Do not silently update tests. |

## Commit conventions

**You run the commit; PM grants permission via the y/n prompt at ticket close.** Per CLAUDE.md Commit Rules. The permission gate is the message-approval moment, not the git execution. PM does not run git on your behalf.

Message format:

```
T{NNN}: {Title}
```

One line. No body. No co-author tag. The ticket and the journal carry the long form. For a single-file commit, prefer the single-call form `git commit -m "T{NNN}: {Title}" path/to/file` over `git add` + `git commit` — halves the lock-acquisition window.

## Co-locate `why` with `what` (per AGENTS.md → PIPELINE-AUDIT F13)

Every entry in `development/DEVIATIONS.md` carries its **why** alongside its **what** — mandatory per CLAUDE.md rebuild rule #6, which already requires an entry per ticket (even a one-line *"no deviations"*). The Why-discipline extends that: when an entry exists, it explains *what changed*; the Why explains *why this deviation was necessary* — the constraint that forced the path, the spec ambiguity that required a judgment call, the implementation surprise that revealed a hidden assumption.

**Why this matters.** A `DEVIATIONS.md` entry without its Why is a record that something diverged. With its Why, it's a record that future agents (or future-you) can read to understand *the constraint*, which is what determines whether the deviation should be reverted, generalized, or flagged for spec revision. Without the Why, every revisit re-derives the constraint from the code — lossy and drift-prone, exactly the F13 failure mode.

**Where to apply.** Every DEVIATIONS.md entry. Also: any line in the ticket's **Completion** section where you departed from the literal acceptance-criteria language (renamed a function, moved a file, used a different pattern than the ticket suggested). The acceptance text itself doesn't change; the Completion note records the deviation.

**Format.**

```markdown
### T{NNN}: {one-line summary of the deviation}

**What:** {one sentence on what diverged from the spec.}

**Why:** {one to two sentences on the constraint that forced the deviation — the implementation surprise, the spec ambiguity, the upstream-system property the spec didn't account for. Anchor to the file / handler / ADR that constrains the choice.}

**Disposition:** {one of: accepted-as-is | flag-for-spec-revision | flag-for-ticket-rewrite | revert-on-next-pass.}
```

### `flag-for-spec-revision` — classify and route

When the disposition is `flag-for-spec-revision`, classify the deviation into one of two types and route accordingly. No SPEC-PATCHES entry in either case.

**Type A — Upstream authoring error.** The scenario or ticket misquoted a spec value (wrong enum, wrong table, wrong field name). The spec and code are correct. The fix is a one-line correction to the source doc. Route: note `Type: A` in the deviation entry. `tidy` fixes the doc on its next pass.

**Type B — Real architectural decision.** The build agent correctly deviated because the spec described something that doesn't exist yet, or there's a genuine gap between spec intent and implementation reality. Route: note `Type: B` in the deviation entry. Drop a `decision-{slug}.md` stub directly into `planning/backlog/` with the question, the options the build agent considered, and a pointer to the DEVIATIONS entry. The decision enters the normal Kanban flow from there.

**Format for `flag-for-spec-revision` entries:**

```markdown
**Disposition:** flag-for-spec-revision
**Type:** {A (upstream authoring error) | B (real architectural decision)}
**Route:** {A: "`tidy` fixes {file}" | B: "decision stub at `planning/backlog/decision-{slug}.md`"}
```

The "no deviations" entry still requires a Why — even if the Why is *"the ticket implementation matched the spec exactly; no design judgment required."* Empty Why is the same failure mode as a missing entry.

**Example (Type B).**

> ### T051: Used Postgres trigger instead of action-handler middleware for same-transaction event-row commit
>
> **What:** Per the ticket's literal acceptance criterion, the same-transaction guarantee was to be enforced by middleware in `web/lib/action-layer/middleware.ts`. Implementation uses a Postgres trigger on `members` instead.
>
> **Why:** The middleware doesn't fire on bulk inserts (per `web/lib/action-layer/middleware.ts` line 47 — single-row paths only). The trigger is the only point that catches every insert path, including the future migration-time bulk seeds. Acceptable per the same-transaction invariant because trigger is single-purpose and event-row writes are idempotent.
>
> **Disposition:** flag-for-spec-revision — `action-layer.md` should clarify whether the same-transaction guarantee is enforced at the application or database layer; the spec is ambiguous.
> **Type:** B (real architectural decision)
> **Route:** decision stub at `planning/backlog/decision-action-layer-enforcement-point.md`

**Example (Type A).**

> ### T063: Ticket referenced `items.status` enum value `archived` — actual enum value is `inactive`
>
> **What:** Ticket acceptance criterion used `status = 'archived'`; the schema defines `'inactive'` for this state.
>
> **Why:** The scenario misquoted the enum from `item.md`. Code uses the correct value `'inactive'`.
>
> **Disposition:** flag-for-spec-revision
> **Type:** A (upstream authoring error)
> **Route:** `tidy` fixes `planning/now/scenario-F063-item-lifecycle.md`

**Verification.** Before completing the ticket: confirm `DEVIATIONS.md` carries an entry for this T-number, the entry has both a What and a Why line, and the Why anchors to a specific constraint (file:line, ADR, system-spec section, or observed test failure). If the entry is "no deviations," confirm the Why says *why* nothing diverged in one sentence. Empty Why → not done.

## Hand off

**`sync` (post-build mode).** After a successful merge to main, call `sync` with the ticket ID and F-number (or substrate slug). Sync updates the per-file ledger, monolith row, and checklist item. This replaces the manual STAGE-LEDGER stamp — sync handles all three surfaces in one pass.

**STAGE-LEDGER stamp (legacy — now handled by `sync`).** If `sync` is unavailable, fall back to the manual stamp: when the first commit lands for a scenario's tickets, flip the F-number's row to `building` with today's date. When the last ticket closes and evals are green, flip to `done`. For substrate tickets, stamp the corresponding row in the Substrate table.

**Spec-deviation routing (replaces SPEC-PATCHES).** Build no longer appends to `planning/SPEC-PATCHES.md` — that document is archived. Instead, every `flag-for-spec-revision` deviation is classified at the point of deviation: Type A (upstream authoring error) routes to `tidy`; Type B (real architectural decision) gets a `decision-{slug}.md` stub dropped into `planning/backlog/`. See the `flag-for-spec-revision` classification rules in the DEVIATIONS format section above.

**Commit-hash backfill is non-optional.** Per audit H4, T055/T056/T057 still carry `{pending}` placeholders. Immediately after you run `git commit`, edit the ticket Completion section to fill in the hash — do not defer.

## Final report

Default report shape is three lines:

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Drop running narration ("Now doing X." "Starting Y." "Committing Z."). Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, lane counts, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more."

The TDD loop body keeps its narration discipline; this governs the *final* close-out report only.

**You produced:** code + tests on branch `t{nnn}` (committed by you after PM `y`), updated ticket (Completion section filled with the commit hash), a `DEVIATIONS.md` entry with `Why:` and `Disposition:` lines, updated `BUILD-LOG.md`.

**Commit-hash backfill.** Immediately after you run `git commit`, edit the ticket's Completion section to fill in the hash printed by git. Same session — do not defer.

**You hand to:** `sync` (post-build mode) → `test` (run mode). Sync reconciles the three tracking surfaces against the merge you just landed; test then confirms F### evals pass against the scenario this ticket served.

**On eval failure:** evaluator hands back to you. Run the TDD loop again — fix forward, never roll back. New iteration stays on the same `t{nnn}` branch; you commit each pass after PM `y` on the permission prompt.

**On eval pass:** the loop closes. Merge already happened at ticket close (step 20). Pick the next scenario or ask `ticket` for the next ticket.

**On partial-pass with named forward-deps:** evals run on `main` after merge can have failing tests when DEVIATIONS-accepted-as-is entries name unbuilt upstream. The merge still lands — main reflects shipped state honestly, including the gaps the DEVIATIONS entries explain. The row in STAGE-LEDGER flips to `eval` (not `done`) until forward-deps ship and evals fully green.
