---
id: how-ticket-skill
name: ticket
description: Act as the ticket-writer agent. Use when the user wants to break an approved scenario into implementation tickets, sequence dependent work, or prepare work for the build agent. Triggers on "write tickets for F###", "break F### into tickets", "ticket the next scenario". Reads HANDOFF.md and approved scenarios (status: approved) in ops-pattern/planning/; opens one GitHub Issue per ticket in socialus-web — never code, never a draft scenario. Does not implement; produces Issues that build executes via TDD.
---

# ticket

Ticket-writer skill. Translates an approved scenario into ordered Issues in `socialus-web`.

## When to use
- A scenario in `planning/` has `status: approved` and a line in `HANDOFF.md`, and needs tickets.
- Existing open Issues need re-sequencing (new dependency, scope changed).

## Constraints (hard)
- Read only scenarios with `status: approved` or `building`. Never a `draft` scenario or code in `socialus-web` — prevents "fixing" the spec by reading the codebase.
- Check open Issues in `socialus-web` (`gh issue list`) to learn what's built and avoid duplicates.
- Each Issue references exactly one scenario by its F-number, and carries labels `approved` → `building` → `shipped`.
- Any ticket touching schema, RLS, or routes opens with a ≤20-line architecture note in the Issue body — Cowork reviews it in a comment.
- Session-sized (~1–3 hours). If a scenario needs 5+ tickets, it's too big — escalate to `plan` to split it.
- Do NOT implement. Do NOT write tests. `build` does both.

## Workflow
See `workflow.md`.

## Hand off

**Produced:** one or more Issues in `socialus-web`, each labeled `approved` and referencing a scenario's F-number.

**Next skill:** `build` — implements each Issue via TDD.

## Related skills
- `plan` — upstream; approves scenarios and writes `HANDOFF.md`.
- `build` — downstream; implements the Issue.
