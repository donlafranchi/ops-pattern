# pipeline-build — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `development/tickets/T{NNN}-{slug}.md`, `planning/scenarios/{F-slug}.md` (the scenario the ticket references), `product/systems/{name}.md` (Data model implications only), `product/ui/design-language.md` (for UI work), `web/` (code, tests), `BUILD-LOG.md` |
| **Writes** | `web/` (code + unit tests), `development/tickets/{T-file}` (Completion section), moves ticket → `development/tickets/done/`, updates `BUILD-LOG.md`. Produces a **commit summary** for the PM — does NOT run git itself (per CLAUDE.md Commit Rules). |
| **Branch** | One per ticket: `t{nnn}`. Agent creates at session start (`git switch -c t{nnn}`); PM merges to `main` at close. |
| **Templates** | none — ticket template lives in `pipeline-ticket/`; build implements, doesn't author specs |
| **Does NOT read** | `planning/scenarios-backlog/`, eval test files (write-mode evals are an external oracle), `product/foundation/` |
| **Does NOT run** | `git add`, `git commit`, `git push`. Branch creation (`git switch -c`) is fine — that doesn't touch `.git/index`. |
| **Calls in** | `docx`/`pptx`/`xlsx`/`pdf` (Anthropic) for non-code deliverables |
| **Hands to** | `pipeline-eval` (run mode) — verifies F### evals pass against the scenario |
| **Pre-commit gate** | `engineering:code-review` (M2) — MANDATORY between green and the commit-summary handoff per CLAUDE.md rebuild-phase rule #3. The reviewed state is what gets handed to PM for commit; fixes happen in the same loop, not as follow-up commits. |

## TDD loop (every ticket)

0. **Lock pre-flight.** Run `ls web/.git/index.lock 2>/dev/null; ls .git/index.lock 2>/dev/null`. If either prints a path, stop and ask the PM to run `clearlock` before continuing. Do NOT attempt to remove the lock yourself — the sandbox lacks the permission and silent failure here wedges every later git call. Per CLAUDE.md Commit Rules.
1. **Start the ticket branch.** `cd web && git switch -c t{nnn}` (or in parent for parent-repo work). Confirms a clean working slate and isolates this ticket's commits from main. PM merges back at close.
2. Read `BUILD-LOG.md` for current state.
3. Read the ticket in `development/tickets/T{NNN}-{slug}.md`.
4. Read the approved scenario at `planning/scenarios/{F-slug}.md` referenced by the ticket.
5. Read the relevant `product/systems/{name}.md` "Data model implications" section *only* — for forward-looking schema columns to include at MVP.
6. Read the project's design language doc (if it has one) for any UI work.
7. Write failing tests (red). Tests must trace back to a Then-clause in the scenario or an item in the ticket's checklist.
8. Run tests — confirm FAIL.
9. Write minimal code to pass.
10. Run tests — confirm PASS (green).
11. Refactor if needed.
12. **M2 — `engineering:code-review` MANDATORY before commit.** Invoke the skill against the diff (`git diff` + `git diff --cached` for this ticket's files). Verdicts: PROCEED → continue; REQUEST → land the requested fixes in the same loop, re-run tests, re-invoke M2; BLOCK → stop, escalate via DEVIATIONS + `pipeline-plan`. Pre-commit placement is load-bearing — issues caught here land as fix-now (clean first commit) instead of fix-forward. Per CLAUDE.md rebuild-phase rule #3.
13. Update the ticket's Completion section (Date filled in; Commit hash left blank — PM backfills after committing).
14. Move the ticket file to `development/tickets/done/`.
15. Update `BUILD-LOG.md`.
16. **Produce commit summary for PM.** Do NOT run `git add` or `git commit` yourself — the sandbox can't clean up `.git/index.lock` after them. Instead, output a block the PM can paste-and-go:

    ```
    **Commit summary — T{NNN}**
    Repo:     web   (or parent)
    Branch:   t{nnn}
    Files:    <newline-separated list of files to stage>
    Message:  T{NNN}: {Title}

    Suggested command (PM runs from Mac terminal):
      cd web && clearlock && git add <files> && git commit -m "T{NNN}: {Title}"
    ```

    PM commits, pastes back the resulting hash. You backfill the hash into the ticket's Completion section in a follow-up edit (which is a file write, not a git call — safe).

## What you do NOT do
- Write tickets. (`pipeline-ticket` does.)
- Write scenarios. (`pipeline-plan` does.)
- Write evals. (`pipeline-eval` does, *before* you start.)
- Read `planning/scenarios-backlog/`. Ever.
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
| Cannot implement as specced | Annotate in `development/DEVIATIONS.md` with the spec divergence, hand back to `pipeline-plan`. Do not improvise. |
| Scenario logic is wrong | Stop. Annotate in `DEVIATIONS.md`, escalate to `pipeline-plan`. |
| Need a new ticket (current ticket grew) | Hand to `pipeline-ticket`. Do not write the ticket yourself. |
| Need to reprioritize | Escalate to `pipeline-plan`. |
| Feature needs redesign | Escalate to `pipeline-plan` → `pipeline-product`. |
| Eval failure that requires the scenario to change | Stop. Escalate to `pipeline-plan`. Do not silently update tests. |

## Commit conventions

**The agent does not commit — PM does, from Mac terminal.** Per CLAUDE.md Commit Rules. The agent's job is to produce a clean **commit summary** at ticket close (see TDD-loop step 16).

Message format the PM uses:

```
T{NNN}: {Title}
```

One line. No body. No co-author tag. The ticket and the journal carry the long form. When committing a single file, PM prefers the single-call form `git commit -m "T{NNN}: {Title}" path/to/file` over `git add` + `git commit` — halves the lock-acquisition window.

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

The "no deviations" entry still requires a Why — even if the Why is *"the ticket implementation matched the spec exactly; no design judgment required."* Empty Why is the same failure mode as a missing entry.

**Example.**

> ### T051: Used Postgres trigger instead of action-handler middleware for same-transaction event-row commit
>
> **What:** Per the ticket's literal acceptance criterion, the same-transaction guarantee was to be enforced by middleware in `web/lib/action-layer/middleware.ts`. Implementation uses a Postgres trigger on `members` instead.
>
> **Why:** The middleware doesn't fire on bulk inserts (per `web/lib/action-layer/middleware.ts` line 47 — single-row paths only). The trigger is the only point that catches every insert path, including the future migration-time bulk seeds. Acceptable per ADR-7's same-transaction invariant because trigger is single-purpose and event-row writes are idempotent.
>
> **Disposition:** flag-for-spec-revision — `action-layer.md` should clarify whether the same-transaction guarantee is enforced at the application or database layer; the spec is ambiguous.

**Verification.** Before completing the ticket: confirm `DEVIATIONS.md` carries an entry for this T-number, the entry has both a What and a Why line, and the Why anchors to a specific constraint (file:line, ADR, system-spec section, or observed test failure). If the entry is "no deviations," confirm the Why says *why* nothing diverged in one sentence. Empty Why → not done.

## Hand off

**STAGE-LEDGER stamp.** When the first commit lands for a scenario's tickets, flip the F-number's row to `building` with today's date. When the last ticket for the scenario closes and evals are green, flip to `done`. For substrate tickets, stamp the corresponding row in the Substrate table.

**SPEC-PATCHES queue.** If you flagged a `product/` spec for `pipeline-product` patching in DEVIATIONS, also append an entry to `planning/SPEC-PATCHES.md` with the spec path, section, what's wrong, and the ticket that caught it. The DEVIATIONS entry is the audit trail; SPEC-PATCHES is the queue that ensures the patch lands.

**Commit-hash backfill is non-optional.** Per audit H4, T055/T056/T057 still carry `{pending}` placeholders. After PM commits, immediately edit the ticket Completion section to fill in the hash — do not defer.

**You produced:** code + tests on branch `t{nnn}`, updated ticket, a `DEVIATIONS.md` entry with `Why:` and `Disposition:` lines, updated `BUILD-LOG.md`, and a **commit summary** for the PM. You did NOT commit — PM commits from Mac terminal and pastes back the hash.

**Commit-hash backfill.** After PM commits and confirms the hash, you (in the same session, or the next) edit the ticket's Completion section to fill in the hash. That edit is a file write, not a git call — safe to do from the sandbox.

**You hand to:** `pipeline-eval` (run mode) — confirms F### evals pass against the scenario this ticket served.

**On eval failure:** evaluator hands back to you. Run the TDD loop again — fix forward, never roll back. New iteration stays on the same `t{nnn}` branch; PM commits each pass.

**On eval pass:** the loop closes. PM merges `t{nnn}` to `main` (`git switch main && git merge --no-ff t{nnn} && git branch -d t{nnn}`) and picks the next scenario or asks `pipeline-ticket` for the next ticket.
