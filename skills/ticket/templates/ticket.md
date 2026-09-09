# T{NNN}: {Ticket Title}

**Scenario:** F{NNN} — {plain-English title} *(or `substrate — no user-facing surface`)*

> **Cite the number, never the path.** Lanes change by design — a scenario moves `backlog/` → `next/` → `now/` → `done/` as it progresses, and every path written into a ticket is stale the moment it advances. The number is stable for the life of the work; the gate check matches on it. **Same rule for reviews: `review F{NNN}`, not a path.**
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
- [ ] **Migration applied to production** — N/A if this ticket adds no migration. A merged ticket whose migration has not run is not done; verify with `bash scripts/migration-conformance.sh` (T140) before closing.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.

### Verification gates — two rules, both ratified 2026-09-07

- [ ] **A test that cannot run fails the run; it does not skip quietly.** A criterion covered only by a skipped test is **unmet**. A ticket in that state closes as **built, unverified**, naming what is unverified in one sentence a non-engineer can read — **it does not close as done.**
- [ ] **Nothing that enforces an access boundary reaches production on inspection alone.** Storage policies, row-level security, authorization checks. **Application-side tests do not substitute** — the boundary exists for the case where the application is bypassed.

> **Why these are here rather than in a doc.** Both were learned the same day, from the same shape of failure twice: **the gate check reported clean while structurally unable to see an approved scenario with an open EXTEND, and the test suite reported green while structurally unable to see itself skipping.** A check that cannot fail is not evidence of anything.
>
> **So the working habit: before trusting that a check passed, confirm it can fail.** Break it on purpose once. That applies to any gate added to this pipeline, not only to tests.
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
