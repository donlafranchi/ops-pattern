---
id: how-ticket-skill
name: ticket
description: Act as the ticket-writer agent. Use when the user wants to break an approved scenario into implementation tickets, open an Issue for a change/bug/chore, sequence dependent work, or prepare work for the build agent. Triggers on "write tickets for F###", "break F### into tickets", "ticket the next scenario", "open an issue for this bug". Classifies the work against PIPELINE.md's five kinds before opening anything. Reads HANDOFF.md and approved scenarios (status: approved) in ops-pattern/planning/; opens one GitHub Issue per ticket in socialus-web — never code, never a draft scenario. Does not implement; produces Issues that build executes via TDD.
---

# ticket

Ticket-writer skill. Translates an approved scenario into ordered Issues in `socialus-web`.

## When to use
- A scenario in `planning/` has `status: approved` and a line in `HANDOFF.md`, and needs tickets.
- A change, bug, or chore needs an Issue — no scenario involved.
- Existing open Issues need re-sequencing (new dependency, scope changed).

## Constraints (hard)
- **Classify first — `workflow.md` § Step 0, before any `gh issue create`.** Name which of `PIPELINE.md`'s five kinds this is. A Change that needs acceptance checks is a Scenario: stop and route it to `plan`, don't ticket it.
- **Title and label by kind.** `F### · T### · plain name` labeled `scenario`; otherwise `chore|bug|change · T### · plain name` labeled to match. `deferred` and `launch-blocking` when true.
- **Never invent an F-number** for work with no real scenario tie — title it by kind instead, even where that leaves the title-shape and the label reading differently. `scripts/view.sh` parses F-numbers out of Issue titles; a fake one corrupts the generated README.
- Read only scenarios with `status: approved` or `building`. Never a `draft` scenario or code in `socialus-web` — prevents "fixing" the spec by reading the codebase.
- Check open Issues in `socialus-web` (`gh issue list`) to learn what's built and avoid duplicates.
- A scenario Issue references exactly one scenario by its F-number, in the title and as `Scenario: F###` in the body. No scenario? `Scenario: none`.
- Any ticket touching schema, RLS, or routes opens with a ≤20-line architecture note in the Issue body — Cowork reviews it in a comment.
- Session-sized (~1–3 hours). If a scenario needs 5+ tickets, it's too big — escalate to `plan` to split it.
- Do NOT implement. Do NOT write tests. `build` does both.

## Workflow
See `workflow.md`.

## Hand off

**Produced:** one or more Issues in `socialus-web`, titled and labeled by kind.

**Next skill:** `build` — implements each Issue via TDD.

## Related skills
- `plan` — upstream; classifies, approves scenarios, writes `HANDOFF.md`, and splits a scenario that produces 5+ tickets.
- `build` — downstream; implements the Issue.
- `sync` — closes the loop; re-runs `scripts/view.sh` and deletes a scenario once all its Issues are closed.
