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
- `planning/history/F{NNN}-review.md` if it exists — the architecture + design pre-flight from `pipeline-review`. The review tells you which existing components to reuse, which gaps to flag, and any decisions captured for `DECISIONS.md`.
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
3. **Gate B — Ratified-Intent pre-flight.** Before drafting any ticket, scan every spec section the tickets will *encode in code* (schema constraints, RLS policies, action-handler refusals, UI affordance removals — anything where a Category-2 absolute becomes literal code) for absolute-language statements. For each match, check the co-located line:
   - `Intent (Ratified YYYY-MM-DD): ...` or `Intent (Deferred until {trigger}; review by {horizon}): ...` → terminal state. Pass; capture the pointer in the ticket's Notes as "Encodes ratified absolute: `{file}:{line}`".
   - `Intent: ...` (no parenthetical tag) or no `Intent` line → **unratified. Gate B fails.**
   - On Gate B failure, **stop**. Do not draft the ticket. Surface the list of unratified absolutes (`file:line` + bullet text) and route to `pipeline-ratify-absolute`. After ratification, re-enter at step 3.
   - Rationale: by the time tickets are written, every absolute the code will encode must already carry PM-approved Intent. The cheapest place to catch an unearned absolute is *before* a ticket asks the build agent to write the constraint that enforces it.
4. **For each unit, write a ticket** using `templates/ticket.md`:
   - **Scenario:** path to the approved scenario — OR `substrate` (see Substrate lane below).
   - **Status:** Open.
   - **Bundle:** copy from the scenario.
   - **Serves:** one-line lineage to a north-star loop and the canonical example. If you can't fill this in, the scenario is missing context — escalate to `pipeline-plan`.
   - **Depends on:** other T-numbers if any.
   - **Acceptance Criteria:** a checklist of *implementable* items — file paths, table names, columns, component names, route paths, test names, BUILD-LOG.md update. Don't restate the scenario's Given/When/Then; restate the *implementation contract*.
   - **Notes:** practical guidance — where code lives, what to reuse, ADRs, gotchas. Include any "Encodes ratified absolute: `file:line`" pointers captured in Gate B.
5. **Sequence the tickets.** Schema migrations first, then APIs, then UI, then notifications/crons. Surface any blocking dependencies in `Depends on`.
6. **If the scenario produces 5+ tickets, stop.** A well-scoped scenario realizes one 🟢 work-map item and fans into 2–5 implementation tickets. 5+ tickets means either (a) the scenario merged two work-map items — escalate to `pipeline-plan` to split the scenario; or (b) the work-map item itself is too big — escalate to `pipeline-bundle-resync` to split the menu entry. Either way, open a thread in `JOURNAL.md` first; don't quietly carve up the scenario yourself.
7. **Do not commit on behalf of build.** Tickets are written, not built.

## Substrate lane (no-scenario tickets)

Legalized by `pipeline-process-audit-2026-05-22.md` R3 — codifies what T041–T057 did de-facto. Use **only** when a ticket has no user-facing behavior to test against a Given/When/Then:

- Schema floor (tables, columns, constraints, RLS policies, indexes, migrations).
- Action-handler scaffolding without a UI surface.
- Eval-helper infrastructure (test fixtures, helpers, CI gates).
- ADR ratification side-effects that must land in code (e.g. an enum reconciliation).

Substrate-ticket header differs from a scenario-driven ticket on three fields only:

- **Scenario:** `substrate`
- **Serves:** name the system spec section(s) + ADR(s) that are the contract — e.g. `product/systems/member.md § Schema; ADR-7`. The system-spec section *is* the Given/When/Then for substrate work; the ADR(s) supply the rationale.
- **Acceptance Criteria:** mirror the spec section literally — column names, constraint names, RLS policy names. Drift from the spec is a `DEVIATIONS.md` entry, same as any other ticket.

**Gate B still applies to substrate tickets.** Schema and RLS are the canonical Category-2 code surface — if any absolute the substrate will encode lacks a Ratified/Deferred Intent tag, stop and route to `pipeline-ratify-absolute`.

**Substrate is not an escape hatch for skipping scenarios.** If a user-facing surface exists, write a scenario. The substrate lane is for the floor *under* surfaces, not a back door around the planner.

**TRACE.md substrate column.** Substrate tickets do not get F-numbers but are still tracked — in `planning/TRACE.md`, log substrate tickets in the dedicated substrate table (an `S-` group by spec section or phase), so schema work has the same visibility as feature work.

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

## Co-locate `why` with `what` (per AGENTS.md → PIPELINE-AUDIT F13)

Every acceptance-criteria item that encodes a design choice carries its **why** alongside its **what**. Mechanical implementation steps (file paths, table names, column types) don't need a Why — they're transcription. Items that encode a *judgment call* (which library, which pattern, which trade-off) do — without the Why, the build agent reading the ticket weeks later (or a future PM revisiting it) has to reconstruct the design intent from the surface text and risks getting it plausibly wrong.

**Where to apply.** Any acceptance-criteria item that names *one specific approach when multiple would satisfy the literal requirement*. *"[ ] `members` table has `display_name` column, varchar(60), NOT NULL"* is mechanical — no Why. *"[ ] Use Postgres trigger (not action-layer middleware) to enforce same-transaction event-row commit"* encodes a choice between two paths that both satisfy the spec — needs a Why.

**Format.** Italic line under the checkbox item, prefixed `_Why: {one-sentence rationale, anchored to an ADR / system spec / DECISIONS row / observed code constraint}._`

**Example.**

> *Without:*
> - [ ] `<NextOccurrence>` component renders next computed occurrence using `formatGatheringDate`.
>
> *With:*
> - [ ] `<NextOccurrence>` component renders next computed occurrence using `formatGatheringDate`.
>   _Why: timezone correctness depends on the venue's tz, not the viewer's — `formatGatheringDate` already handles this; rolling our own date logic would re-introduce the bug fixed in T029._

**Verification.** Before handing the ticket to `pipeline-build`, walk every acceptance-criteria item. For each item that encodes a judgment call (not pure transcription), confirm it carries a `Why:` line. If you can't write the Why because the scenario didn't supply the rationale, escalate to `pipeline-plan` to revise — don't guess and don't proceed.

## Escalation

| Situation | Action |
|---|---|
| Scenario is ambiguous on a Then-clause | Annotate in the ticket's Notes; flag in `JOURNAL.md` and ask `pipeline-plan` to revise the scenario before build starts. |
| Scenario produces 5+ tickets | Stop. If scenario merged two work-map items → `pipeline-plan` splits the scenario. If one work-map item is genuinely too big → `pipeline-bundle-resync` splits the menu entry. |
| Existing ticket conflicts with this scenario | Surface the conflict; don't silently rewrite the existing ticket. |
| Schema change needed but no system spec covers it | Stop. Ask `pipeline-product` to extend the relevant `product/systems/{name}.md` first. |

## Hand off

**STAGE-LEDGER stamp.** Append (or update) the F-number's row in `planning/STAGE-LEDGER.md` Tickets column with the T-number range and today's date. For substrate tickets, stamp the corresponding row in the Substrate table with the new T-number(s).

**You produced:** one or more tickets in `development/tickets/`.

**You hand to (in this order):**

1. `pipeline-eval` (write mode) — translates the **scenario** (not the ticket) into Playwright tests. Tests land in `{app}/evals/features/F{NNN}.spec.ts`. Eval writer reads scenario only; tickets are reference-only.

2. `pipeline-build` — picks up the ticket, reads the scenario for context, runs the TDD loop (red → green → refactor), commits, updates `BUILD-LOG.md`.

3. `pipeline-eval` (run mode) — runs the F### evals after build completes, reports pass/fail traceably. On fail, hands back to `pipeline-build` to fix forward.
