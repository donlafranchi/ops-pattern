# T{NNN}: {Ticket Title}

**Scenario:** `planning/next/scenario-F{NNN}-{slug}.md` (or `planning/now/scenario-F{NNN}-{slug}.md`)
**Status:** Open / In Progress / Complete
**Bundle:** b1 / b2 / b3
**Depends on:** T{NNN} (omit if none)

**Serves:**
- **Loop:** {N} ({loop name from loops.md}) — one-sentence justification of how this advances the loop's stated pain point.
- **Canonical example:** {name from canonical-examples.md} — link to the section. Must not be a TODO placeholder.
- **Primitive shape:** Person → Item(kind=…) → Location(…). Confirm: no shell entity owns these Items.

If any of the three Serves lines cannot be filled in, escalate to `scope` before writing acceptance criteria.

## Workflow gates (mandatory during the migration phase per `_attic/2026-05-19/planning/PIPELINE-AUDIT.md`)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `test` (run mode) is called.
- [ ] **M3 — `design:accessibility-review`** if this ticket introduces a new page or component.
- [ ] **M4 — `engineering:deploy-checklist`** if this ticket is part of a merge to main that touches T028+ migration tickets.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.
- [ ] **Close-out reconciliation** at ticket close: every `decision-{slug}.md` stub this ticket produced is written **and** committed, and every spec / scenario / ticket line this ticket's changes made false is corrected (or logged Type A). "Nothing invalidated" is a valid answer; silence is not.

## Acceptance Criteria

- [ ] {Concrete, implementable item — file path, table name, column, component name, route, test name}
- [ ] {Database changes if any: table/column names, types, constraints, RLS policies}
- [ ] {API/server changes if any: endpoints, server actions, external service calls}
- [ ] {UI changes if any: component names, user-visible behavior, surface placement}
- [ ] {Test names — at least one per Then-clause in the scenario}
- [ ] BUILD-LOG.md updated

## Notes

{Implementation guidance: where code lives, what to reuse, what patterns to follow, relevant decisions from `playbooks/PLATFORM-PATTERNS.md` / `playbooks/DEVELOPMENT-PATTERNS.md`. Practical, not tutorial.}

## Completion

Date: {YYYY-MM-DD}
Commit: {git hash}
