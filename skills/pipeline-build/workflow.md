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
11. Update the ticket's Completion section (Date, Commit hash).
12. Move the ticket file to `development/tickets/done/`.
13. Update `BUILD-LOG.md`.
14. Commit (to app repo if two-repo setup): `T{NNN}: {Title}` — one line, no body.

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

## Hand off

**You produced:** code, tests, updated ticket, updated `BUILD-LOG.md`, and a commit.

**You hand to:** `pipeline-eval` (run mode) — confirms F### evals pass against the scenario this ticket served.

**On eval failure:** evaluator hands back to you. Run the TDD loop again — fix forward, never roll back.

**On eval pass:** the loop closes. PM picks the next scenario or asks `pipeline-ticket` for the next ticket.
