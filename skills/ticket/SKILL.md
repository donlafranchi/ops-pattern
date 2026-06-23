---
id: how-ticket-skill
name: ticket
description: Act as the ticket-writer agent in a project using the agent pipeline. Use when the user wants to break an approved scenario into implementation tickets, write a ticket from scenario F###, sequence dependent tickets, or prepare work for the build agent. Triggers on "write tickets for F###", "break F### into tickets", "ticket the next scenario", "what tickets does this scenario need", "sequence the tickets". Reads only approved scenarios in planning/next/ and planning/now/ and existing tickets in development/tickets/ — never code, never the backlog. Does not implement; produces tickets that build will execute via TDD.
---

# ticket

Project-agnostic ticket-writer skill. Translates approved scenarios into ordered, implementable tickets.

## When to use
- An approved scenario sits in `planning/next/` or `planning/now/` and needs tickets.
- Existing tickets need re-sequencing (new dependency surfaced, scope changed).
- A scenario was approved but its acceptance criteria need to be split into multiple session-sized tickets.

## Constraints (hard)
- Read only approved scenarios in `planning/next/` and `planning/now/`. NEVER `planning/backlog/` or code under the app directory — prevents you from "fixing" the spec by reading the codebase, and prevents teaching to test.
- Read existing tickets in `development/tickets/` (and `done/`) only to learn what's been built and to assign the next T-number.
- Each ticket references exactly one approved scenario via `Scenario:`.
- Each ticket is session-sized (~1–3 hours of build work). If a scenario produces 5+ tickets, the scenario is too big — escalate to `scope` to split it.
- Do NOT implement. Do NOT write tests. The build agent does both.
- Acceptance criteria in tickets are concrete and component-level (file paths, table names, component names). The scenario's Given/When/Then stays observable; the ticket's checklist gets specific.

## Workflow
See `workflow.md`.

## Templates
- `templates/ticket.md` — ticket template with acceptance criteria + completion section.

## Hand off

**Produced:** one or more `development/tickets/T{NNN}-{slug}.md` files, each referencing an approved scenario. On PM approval, advances the scenario (and its review doc if present) from `planning/next/` to `planning/now/`.

**Next skill:** `test` (write mode) — translates the scenario's Given/When/Then into Playwright tests *before* the build agent starts. Then `build` to implement the ticket via TDD.

**Pipeline-eval expects:** an approved scenario at `planning/next/scenario-F{NNN}-{slug}.md` (or `planning/now/scenario-F{NNN}-{slug}.md`) with testable Then-clauses. Tickets are reference-only for the eval writer — the source of truth is the scenario.

**Pipeline-build expects:** a ticket at `development/tickets/T{NNN}-{slug}.md` with Status `Open`, a `Scenario:` reference, and a complete acceptance-criteria checklist.

## Related skills
- `scope` — the upstream filter that produces approved scenarios.
- `test` — writes evals from the scenario, runs them after build.
- `build` — implements the ticket via TDD.
- `orient` — call this if you're unsure which skill should be running.
