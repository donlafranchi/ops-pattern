# ticket — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `planning/next/scenario-F{NNN}-{slug}.md` or `planning/now/scenario-F{NNN}-{slug}.md` (the approved scenario), `development/tickets/` and `done/` (for next T-number), `product/systems/{name}.md` (Data model implications section only), root `CLAUDE.md` |
| **Writes** | `development/tickets/T{NNN}-{slug}.md`; moves scenario (+ review) from `planning/next/` → `planning/now/` on PM approval |
| **Templates** | `templates/ticket.md` |
| **Does NOT read** | `planning/backlog/`, `web/` (code), eval test files, `product/foundation/` |
| **Hands to** | `build` (to implement) — `test` (write mode) runs in parallel from the scenario |

## Inputs you read
- `planning/next/scenario-F{NNN}-{slug}.md` or `planning/now/scenario-F{NNN}-{slug}.md` (the approved scenario you're ticketing)
- `review-F{NNN}.md` in the scenario's lane (`planning/next/` or `planning/now/`) — **required for scenario-driven tickets**; Gate C at step 3b stops ticketing when it is absent. Decision-lane tickets have no F-number and satisfy Gate C via checklist 4 instead; substrate tickets are exempt and must say so. The architecture + design pre-flight from `review`. The review tells you which existing components to reuse, which gaps to flag, and any decisions captured as pattern-doc entries in `playbooks/`.
- `development/tickets/` and `development/tickets/done/` (to assign the next T-number and learn what already exists)
- The project's root `CLAUDE.md` (for stack/path facts)
- The relevant `product/systems/{name}.md` — **only** the "Data model implications" section, for forward-looking schema columns to include even if their feature ships later

## Inputs you do NOT read
- `planning/backlog/` — not approved.
- App code under `web/` (or `{app}/`) — would let you "fix" the spec.
- `product/foundation/` — the planning agent already filtered against the foundation.

## Workflow

1. **Pick the next T-number.** Highest existing across `development/tickets/` and `development/tickets/done/` + 1.
2. **Re-read the scenario.** Identify each distinct unit of work — a schema migration, an API endpoint, a UI component, a notification path, a cron job. Map them to one ticket each, or group small ones.
3. **Gate B — Ratified-Intent pre-flight.** Before drafting any ticket, scan every spec section the tickets will *encode in code* (schema constraints, RLS policies, action-handler refusals, UI affordance removals — anything where a Category-2 absolute becomes literal code) for absolute-language statements. For each match, check the co-located line:
   - `Intent (Ratified YYYY-MM-DD): ...` or `Intent (Deferred until {trigger}; review by {horizon}): ...` → terminal state. Pass; capture the pointer in the ticket's Notes as "Encodes ratified absolute: `{file}:{line}`".
   - `Intent: ...` (no parenthetical tag) or no `Intent` line → **unratified. Gate B fails.**
   - On Gate B failure, **stop**. Do not draft the ticket. Surface the list of unratified absolutes (`file:line` + bullet text) and route to `weigh`. After ratification, re-enter at step 3.
   - Rationale: by the time tickets are written, every absolute the code will encode must already carry PM-approved Intent. The cheapest place to catch an unearned absolute is *before* a ticket asks the build agent to write the constraint that enforces it.
3b. **Gate C — review present, or checklist 4 fired.** The gate asks one question: *did the reviewing function run on this work?* A ticket answers it one of three ways, and its `Scenario:` field decides which — not your judgment.

   **(a) Scenario-driven** — `Scenario:` names a scenario file. Run:

   ```
   ls planning/next/review-F{NNN}.md planning/now/review-F{NNN}.md 2>/dev/null
   ```

   A file in either lane passes. **No file → stop, do not draft tickets.** Route to `review`; re-enter at 3b when it lands.

   **(b) Decision-driven** — `Scenario: decision` (see Decision lane below). There is no F-number, so there is no filename to look for and the `ls` in (a) is **unrunnable, not failed**. The gate here is that **checklist 4 fires and its two design gates are named in the ticket.** Run checklist 4's trigger:

   ```
   git diff --name-only main | grep -E '^src/(app|components)/'
   ```

   Returns anything — or an existing component lands on a route that did not previously render it, or receives a new data shape → **checklist 4 is mandatory on this ticket.** `design:design-critique` and `design:accessibility-review` (M3) are the review this work gets; name both in the ticket, and record M3's verdict the same way a `review-F{NNN}.md` would. Returns nothing *and* neither other trigger fires → the work has no Member-visible surface, so it is substrate, not decision. Re-file under (c) and change the `Scenario:` field.

   **(c) Substrate** — `Scenario: substrate`. No user-facing surface exists, so there is nothing for `review` or M3 to look at. Exempt — but **state the exemption in the ticket's Notes.** An unstated exemption is indistinguishable from a forgotten gate.

   **Every branch ends in a command.** Do not read a review to decide whether it "counts." Do not decide whether a surface "really" needs design attention. The `Scenario:` field selects the branch; the branch names the command.

   **Why (b) exists — and why it is not a loophole.** As first written on 2026-09-04, Gate C was only branch (a). T118 (the Item card media block) came from a ratified PM design decision rather than a scenario, so it had no F-number and no review file could ever exist for it — and it was not substrate either, since substrate is *defined* as having no user-facing surface and T118 changed a card every Member sees. The gate was unrunnable. T118 recorded that in the ticket and in `DEVIATIONS.md` instead of quietly ticking the box, which is the only reason it is being fixed now rather than becoming the first waiver everyone cites. **A gate nobody can run is how gates get waived** — that is the failure this whole amendment set exists to stop, so an unrunnable branch is a defect in the gate, not an exemption for the work. Branch (b) is deliberately *stricter* than a review file in one respect: it makes M3 mandatory and explicit on decision-driven surface work, where before the missing F-number silently took M3 with it.

4. **For each unit, write a ticket** using `templates/ticket.md`:
   - **Scenario:** path to the approved scenario — OR `decision` (see Decision lane below) — OR `substrate` (see Substrate lane below). This field selects the Gate C branch, so set it before step 3b.
   - **Status:** Open.
   - **Bundle:** copy from the scenario.
   - **Serves:** one-line lineage to a north-star loop and the canonical example. If you can't fill this in, the scenario is missing context — escalate to `scope`.
   - **Depends on:** other T-numbers if any.
   - **Acceptance Criteria:** a checklist of *implementable* items — file paths, table names, columns, component names, route paths, test names, BUILD-LOG.md update. Don't restate the scenario's Given/When/Then; restate the *implementation contract*.
   - **Notes:** practical guidance — where code lives, what to reuse, ADRs, gotchas. Include any "Encodes ratified absolute: `file:line`" pointers captured in Gate B.
5. **Sequence the tickets.** Schema migrations first, then APIs, then UI, then notifications/crons. Surface any blocking dependencies in `Depends on`.
6. **If the scenario produces 5+ tickets, stop.** A well-scoped scenario realizes one 🟢 work-map item and fans into 2–5 implementation tickets. 5+ tickets means either (a) the scenario merged two work-map items — escalate to `scope` to split the scenario; or (b) the work-map item itself is too big — escalate to `orient` to split the menu entry. Either way, open a thread in `JOURNAL.md` first; don't quietly carve up the scenario yourself.
7. **Do not commit on behalf of build.** Tickets are written, not built.

## Substrate lane (no-scenario tickets)

Legalized by `pipeline-process-audit-2026-05-22.md` R3 — codifies what T041–T057 did de-facto. Use **only** when a ticket has no user-facing behavior to test against a Given/When/Then:

- Schema floor (tables, columns, constraints, RLS policies, indexes, migrations).
- Action-handler scaffolding without a UI surface.
- Eval-helper infrastructure (test fixtures, helpers, CI gates).
- ADR ratification side-effects that must land in code (e.g. an enum reconciliation).

Substrate-ticket header differs from a scenario-driven ticket on three fields only:

- **Scenario:** `substrate`
- **Serves:** name the system spec section(s) that are the contract — e.g. `product/systems/member.md § Schema`. The system-spec section *is* the Given/When/Then for substrate work.
- **Acceptance Criteria:** mirror the spec section literally — column names, constraint names, RLS policy names. Drift from the spec is a `DEVIATIONS.md` entry, same as any other ticket.

**Gate B still applies to substrate tickets.** Schema and RLS are the canonical Category-2 code surface — if any absolute the substrate will encode lacks a Ratified/Deferred Intent tag, stop and route to `weigh`.

**Substrate is not an escape hatch for skipping scenarios.** If a user-facing surface exists, write a scenario — or, when the work is the direct application of a ratified PM decision, use the **Decision lane** below. The substrate lane is for the floor *under* surfaces, not a back door around the planner. The test is literal: if a Member can see the change, it is not substrate.

**TRACE.md substrate column.** Substrate tickets do not get F-numbers but are still tracked — in `planning/TRACE.md`, log substrate tickets in the dedicated substrate table (an `S-` group by spec section or phase), so schema work has the same visibility as feature work.

## Decision lane (no-scenario tickets that DO have a surface)

The sibling of the substrate lane, and the other half of the no-F-number case. Use when a ticket originates in a **ratified PM decision** — a `playbooks/PLATFORM-PATTERNS.md` / `DEVELOPMENT-PATTERNS.md` entry, or a `planning/*/decision-{slug}.md` — rather than in a scenario, **and it changes something a Member sees.**

The distinction from substrate is the surface, and it is the whole point:

| | Substrate lane | Decision lane |
|---|---|---|
| `Scenario:` field | `substrate` | `decision` |
| Member-visible surface | none | **yes** |
| Bound to | a system-spec section | the ratified decision (pattern entry or `decision-{slug}.md`) |
| Gate C branch | (c) — exempt, exemption stated | **(b) — checklist 4 mandatory** |
| M3 accessibility | n/a | **required, named in the ticket** |

Header fields differ from a scenario-driven ticket on three:

- **Scenario:** `decision` — followed by a pointer to the ratified decision and its ratification date.
- **Serves:** name the decision **and** the spec section it changed (e.g. `product/ui/design-language.md § Card media block`) **and** the loop it serves. All three must resolve to something real; an unfillable lineage field stops the ticket, same as anywhere else.
- **Acceptance Criteria:** mirror the decision's own language. Drift is a `DEVIATIONS.md` entry.

**Gate B still applies.** A ratified decision is exactly where new absolutes appear — if any absolute the ticket will encode in code lacks a State-tagged Intent, stop and route to `weigh`. T118 found two untagged absolutes this way and got them tagged before drafting.

**Gate C is not softened here, it is redirected.** Checklist 4 fires, `design:design-critique` and `design:accessibility-review` both run, and both are named in the ticket. A decision-lane ticket that skips checklist 4 has skipped its review — the same failure as a scenario-driven ticket with no `review-F{NNN}.md`, and it stops the same way.

**The decision lane is not an escape hatch for skipping scenarios.** If the work is a *feature* — a coherent unit of Member-facing behaviour with a Given/When/Then — write a scenario and take branch (a). The decision lane is for work whose whole content is "apply this ratified decision to the surface it governs," where a scenario would restate the decision and add nothing. When in doubt, write the scenario; it is the cheaper mistake.

**Tracking.** Decision-lane tickets get no F-number. Log them in `planning/TRACE.md` against the decision they serve, so decision-driven work has the same visibility as feature work — the same treatment substrate gets in its `S-` table.

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

**Verification.** Before handing the ticket to `build`, walk every acceptance-criteria item. For each item that encodes a judgment call (not pure transcription), confirm it carries a `Why:` line. If you can't write the Why because the scenario didn't supply the rationale, escalate to `scope` to revise — don't guess and don't proceed.

## Escalation

| Situation | Action |
|---|---|
| Scenario is ambiguous on a Then-clause | Annotate in the ticket's Notes; flag in `JOURNAL.md` and ask `scope` to revise the scenario before build starts. |
| Scenario produces 5+ tickets | Stop. If scenario merged two work-map items → `scope` splits the scenario. If one work-map item is genuinely too big → `orient` splits the menu entry. |
| Existing ticket conflicts with this scenario | Surface the conflict; don't silently rewrite the existing ticket. |
| Schema change needed but no system spec covers it | Stop. Ask `explore` to extend the relevant `product/systems/{name}.md` first. |

## Hand off

**STAGE-LEDGER stamp.** Append (or update) the F-number's row in `planning/STAGE-LEDGER.md` Tickets column with the T-number range and today's date. For substrate tickets, stamp the corresponding row in the Substrate table with the new T-number(s).

**You produced:** one or more tickets in `development/tickets/`.

**You hand to (in this order):**

1. `test` (write mode) — translates the **scenario** (not the ticket) into Playwright tests. Tests land in `{app}/evals/features/F{NNN}.spec.ts`. Eval writer reads scenario only; tickets are reference-only.

2. `build` — picks up the ticket, reads the scenario for context, runs the TDD loop (red → green → refactor), commits, updates `BUILD-LOG.md`.

3. `test` (run mode) — runs the F### evals after build completes, reports pass/fail traceably. On fail, hands back to `build` to fix forward.

## Lane advancement (final step)

After tickets are written and the PM approves them, advance the scenario into the active lane:

1. **Check current lane.** If the scenario is already in `planning/now/`, skip — nothing to move.
2. **Propose the move.** Ask: "Ready to advance `scenario-F{NNN}-{slug}.md` from `next/` to `now/`? (y/n)"
3. **On y:** move `planning/next/scenario-F{NNN}-{slug}.md` → `planning/now/scenario-F{NNN}-{slug}.md`. If `planning/next/review-F{NNN}.md` exists, move it to `planning/now/review-F{NNN}.md` alongside the scenario.
4. **On n:** leave files in place. PM directs follow-up.
5. **Include the move in the commit message** — e.g. `docs(pipeline): ticket F{NNN} — wrote T{NNN}–T{NNN}, advanced scenario to now/`.

## Final report

Default report shape (ticket-writer's close-out report — not the ticket file itself):

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Drop running narration ("Now doing X." "Starting Y." "Committing Z."). Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, lane counts, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more."
