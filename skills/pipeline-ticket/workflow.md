# pipeline-ticket — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `planning/scenarios/F{NNN}-{slug}.md` (the approved scenario), `development/tickets/` and `done/` (for next T-number), `product/systems/{name}.md` (Data model implications section only), root `CLAUDE.md` |
| **Writes** | `development/tickets/T{NNN}-{slug}.md` |
| **Templates** | `templates/ticket.md` |
| **Does NOT read** | `planning/scenarios-backlog/`, `web/` (code), eval test files, `product/foundation/` |
| **Hands to** | `pipeline-build` (to implement) — `pipeline-eval` (write mode) runs in parallel from the scenario |

## Inputs you read
- `planning/scenarios/F{NNN}-{slug}.md` (the approved scenario you're ticketing)
- `planning/reviews/F{NNN}-review.md` if it exists — the architecture + design pre-flight from `pipeline-review`. The review tells you which existing components to reuse, which gaps to flag, and any decisions captured for `DECISIONS.md`.
- `development/tickets/` and `development/tickets/done/` (to assign the next T-number and learn what already exists)
- The project's root `CLAUDE.md` (for stack/path facts)
- The relevant `product/systems/{name}.md` — **only** the "Data model implications" section, for forward-looking schema columns to include even if their feature ships later

## Inputs you do NOT read
- `planning/scenarios-backlog/` — not approved.
- App code under `web/` (or `{app}/`) — would let you "fix" the spec.
- `product/foundation/` — the planning agent already filtered against the foundation.

## Workflow

1. **Pick the next T-number.** Highest existing across `development/tickets/` and `development/tickets/done/` + 1.
2. **Re-read the scenario.** Identify each distinct unit of work — a schema migration, an API endpoint, a UI component, a notification path, a cron job. Map them to one ticket each, or group small ones.
3. **For each unit, write a ticket** using `templates/ticket.md`:
   - **Scenario:** path to the approved scenario.
   - **Status:** Open.
   - **Bundle:** copy from the scenario.
   - **Serves:** one-line lineage to a north-star loop and the canonical example. If you can't fill this in, the scenario is missing context — escalate to `pipeline-plan`.
   - **Depends on:** other T-numbers if any.
   - **Acceptance Criteria:** a checklist of *implementable* items — file paths, table names, columns, component names, route paths, test names, BUILD-LOG.md update. Don't restate the scenario's Given/When/Then; restate the *implementation contract*.
   - **Notes:** practical guidance — where code lives, what to reuse, ADRs, gotchas.
4. **Sequence the tickets.** Schema migrations first, then APIs, then UI, then notifications/crons. Surface any blocking dependencies in `Depends on`.
5. **If the scenario produces 5+ tickets, stop.** The scenario is too big. Open a thread in `JOURNAL.md` and ask `pipeline-plan` to split it.
6. **Do not commit on behalf of build.** Tickets are written, not built.

## Ticket sizing

A ticket should be:
- **~1–3 hours** of focused build work.
- **One commit's worth** in the app repo (not necessarily *one* commit, but cohesive).
- **Independently testable** — has at least one Then-clause from the scenario it can verify on its own.

If a ticket is bigger than that, split it. If it's smaller, fold it into an adjacent ticket — not every line of code needs its own number.

## Acceptance-criteria style

The scenario writes outcomes; the ticket writes the implementation contract. Compare:

**Scenario Then-clause:** *"the next occurrence is shown as a human-readable date (e.g., 'Thursday, May 14, 6:00 PM')"*

**Ticket acceptance:**
- [ ] `<NextOccurrence>` component renders next computed occurrence using the project's date util (`formatGatheringDate`)
- [ ] Component takes `recurrence_rule` (RRULE string) + `starts_at` and returns the next future occurrence in the venue's tz
- [ ] Test: given RRULE `FREQ=WEEKLY;BYDAY=TH` and current time Wednesday 8pm, returns Thursday 6pm of the same week

## Escalation

| Situation | Action |
|---|---|
| Scenario is ambiguous on a Then-clause | Annotate in the ticket's Notes; flag in `JOURNAL.md` and ask `pipeline-plan` to revise the scenario before build starts. |
| Scenario produces 5+ tickets | Stop. Ask `pipeline-plan` to split. |
| Existing ticket conflicts with this scenario | Surface the conflict; don't silently rewrite the existing ticket. |
| Schema change needed but no system spec covers it | Stop. Ask `pipeline-product` to extend the relevant `product/systems/{name}.md` first. |

## Hand off

**You produced:** one or more tickets in `development/tickets/`.

**You hand to (in this order):**

1. `pipeline-eval` (write mode) — translates the **scenario** (not the ticket) into Playwright tests. Tests land in `{app}/evals/features/F{NNN}.spec.ts`. Eval writer reads scenario only; tickets are reference-only.

2. `pipeline-build` — picks up the ticket, reads the scenario for context, runs the TDD loop (red → green → refactor), commits, updates `BUILD-LOG.md`.

3. `pipeline-eval` (run mode) — runs the F### evals after build completes, reports pass/fail traceably. On fail, hands back to `pipeline-build` to fix forward.
