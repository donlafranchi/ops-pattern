# T{NNN}: {Ticket Title}

**Scenario:** F{NNN} — {plain-English title} (link to `planning/scenario-F{NNN}-{slug}.md`)
**Depends on:** T{NNN} (omit if none)

Any ticket touching schema, RLS, or routes: a ≤20-line architecture note here, above the checklist.

## Acceptance Criteria

- [ ] {Concrete, implementable item — file path, table name, column, component name, route, test name}
- [ ] {Database changes if any: table/column names, types, constraints, RLS policies}
- [ ] {API/server changes if any: endpoints, server actions, external service calls}
- [ ] {UI changes if any: component names, user-visible behavior, surface placement}
- [ ] {Test names — at least one per Then-clause in the scenario}

## Notes

{Implementation guidance: where code lives, what to reuse, relevant lines from `DECISIONS.md`. Practical, not tutorial.}
