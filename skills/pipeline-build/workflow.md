# pipeline-build — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `development/tickets/T{NNN}-{slug}.md`, `planning/scenarios/{F-slug}.md` (the scenario the ticket references), `product/systems/{name}.md` (Data model implications only), `product/ui/design-language.md` (for UI work), `web/` (code, tests), `BUILD-LOG.md` |
| **Writes** | `web/` (code + unit tests), `development/tickets/{T-file}` (Completion section), moves ticket → `development/tickets/done/`, updates `BUILD-LOG.md` |
| **Templates** | none — ticket template lives in `pipeline-ticket/`; build implements, doesn't author specs |
| **Does NOT read** | `planning/scenarios-backlog/`, eval test files (write-mode evals are an external oracle), `product/foundation/`, `product/surfaces/` |
| **Calls in** | `docx`/`pptx`/`xlsx`/`pdf` (Anthropic) for non-code deliverables |
| **Hands to** | `pipeline-eval` (run mode) — verifies F### evals pass against the scenario |
| **Pre-commit gate** | `engineering:code-review` (M2) — MANDATORY between green and commit per CLAUDE.md rebuild-phase rule #3. The reviewed state is what commits; fixes happen in the same loop, not as follow-up commits |

## TDD loop (every ticket)

1. Read `BUILD-LOG.md` for current state.
2. Read the ticket in `development/tickets/T{NNN}-{slug}.md`.
3. Read the approved scenario at `planning/scenarios/{F-slug}.md` referenced by the ticket.
4. Read the relevant `product/systems/{name}.md` "Data model implications" section *only* — for forward-looking schema columns to include at MVP.
5. Read the project's design language doc (if it has one) for any UI work.
6. Write failing tests (red). Tests must trace back to a Then-clause in the scenario or an item in the ticket's checklist.
7. Run tests — confirm FAIL.
8. Write minimal code to pass.
9. Run tests — confirm PASS (green).
10. Refactor if needed.
11. **M2 — `engineering:code-review` MANDATORY before commit.** Invoke the skill against the diff (staged + unstaged files for this ticket). Verdicts: PROCEED → continue; REQUEST → land the requested fixes in the same loop, re-run tests, re-invoke M2; BLOCK → stop, escalate via DEVIATIONS + `pipeline-plan`. Pre-commit placement is load-bearing — issues caught here land as fix-now (clean first commit) instead of fix-forward (amend / extra commit churn). Per CLAUDE.md rebuild-phase rule #3.
12. Update the ticket's Completion section (Date, Commit hash — the hash gets filled in after step 15).
13. Move the ticket file to `development/tickets/done/`.
14. Update `BUILD-LOG.md`.
15. Commit (to app repo if two-repo setup): `T{NNN}: {Title}` — one line, no body. Backfill the commit hash into the ticket's Completion section.

## What you do NOT do
- Write tickets. (`pipeline-ticket` does.)
- Write scenarios. (`pipeline-plan` does.)
- Write evals. (`pipeline-eval` does, *before* you start.)
- Read `planning/scenarios-backlog/`. Ever.
- Roll back a commit. Fix forward.

## Reference-only reads (consult, do not change)

- The project's design language doc (if it has one) — for any UI work.
- The relevant `product/systems/{name}.md` — for any schema change. Read its "Data model implications" section and include forward-looking columns at MVP.
- The project's surface file (e.g. `product/surfaces/{name}.md`) — for page roles and capability tiers.

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

```
T{NNN}: {Title}
```

One line. No body. No co-author tag. The ticket and the journal carry the long form.

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

**You produced:** code, tests, updated ticket, a `DEVIATIONS.md` entry with `Why:` and `Disposition:` lines, updated `BUILD-LOG.md`, and a commit.

**You hand to:** `pipeline-eval` (run mode) — confirms F### evals pass against the scenario this ticket served.

**On eval failure:** evaluator hands back to you. Run the TDD loop again — fix forward, never roll back.

**On eval pass:** the loop closes. PM picks the next scenario or asks `pipeline-ticket` for the next ticket.
