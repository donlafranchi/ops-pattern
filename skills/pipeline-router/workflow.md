# pipeline-router — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | root `CLAUDE.md`, `JOURNAL.md`, `planning/bundles/{active}.md`, optionally root `AGENTS.md` |
| **Writes** | nothing — orientation only (may suggest a `JOURNAL.md` entry but does not write one) |
| **Templates** | none |
| **Hands to** | whichever pipeline skill the request matches (see routing table below) |

Session-start check (project-agnostic):

1. **Read `JOURNAL.md`** at project root — top entry tells you what just changed.
2. **Read the root `CLAUDE.md`** — project facts (stack, repo structure, north stars).
3. **Read the active bundle** at `planning/bundles/` (default `b1-*.md`) — current scope and hypothesis.
4. **Confirm the task is in scope.** If the user's request isn't in the bundle's scope, surface that and ask whether to proceed or escalate.
5. **Confirm the task serves a north star.** If you can't name which north star (loop, capability, or canonical example) the work serves, ask the user before starting.
6. **Surface stuck approved scenarios.** Glance at `planning/scenarios/` and `planning/scenarios-backlog/`. If any approved scenario in tickets references a backlog file (`planning/scenarios-backlog/F###`), the build firewall is being violated — surface this as a blocker before any build work. Equally: if any scenario in `planning/scenarios/` has its `Canonical example:` field pointing at a TODO placeholder section of `use-cases.md`, surface as a blocker.
7. **Surface stale BUILD-LOG.md.** If `web/BUILD-LOG.md` (or equivalent) is more than two weeks behind the most recent ticket close, flag it.
8. **Surface unsynced sub-bundle.** Glance at `planning/bundles/b{N}-work-map.md` and the last few `development/tickets/done/T*.md` files. If a sub-bundle has closed (all its 🟢 items shipped) but `bundle-themes.md` / `b{N}-work-map.md` has not been touched since, suggest running `pipeline-bundle-resync` before any new scenario writing.
9. **Registry conformance check (lightweight).** If a `REGISTRY.md` exists at project root, verify three things:
   - Every `.md` under `product/`, `planning/`, `development/`, `standards/` (and the root `pipeline-process-audit-*.md` audit files), excluding `_attic/`, `housekeeping/`, `web/`, `skills/`, and the R10-reserved root docs (`CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md`, `TRACE.md`), carries YAML front-matter with `purpose` + `layer` + `status`.
   - Every such doc has a corresponding row in `REGISTRY.md`.
   - No `REGISTRY.md` row points at a missing file.
   On failure, surface the specific docs at session start. If `REGISTRY.md` does not exist, skip the check silently (older projects may not have run R09).
   - **Lightweight = name the gaps, don't gate.** The router is orientation, not enforcement. A failing registry check is a flag, not a stop.

After step 5, route:

| If the user wants to... | Invoke skill |
|---|---|
| Explore, ideate, write a system / capability / product file | `pipeline-product` |
| Scope a release, write/approve scenarios, filter the backlog | `pipeline-plan` |
| Architecture or design pre-flight on a scenario | `pipeline-review` |
| Break an approved scenario into tickets | `pipeline-ticket` |
| Implement a ticket via TDD | `pipeline-build` |
| Write or run acceptance tests | `pipeline-eval` |
| Set up a brand-new project with this pipeline | `pipeline-scaffold` |
| Reflect on / merge / prune memory | `consolidate-memory` |
| Re-sync the work map / sub-bundle sequence against shipped reality | `pipeline-bundle-resync` |

## The PM cycle (read once, internalize)

The pipeline runs in a strict order per feature. Each step has one input and one output. If you're skipping a step, you're improvising.

```
1. pipeline-product   →  writes/updates product/systems/{name}.md
                          (with Data model implications + canonical anchor)

2. pipeline-plan      →  writes scenarios in planning/scenarios-backlog/
                          (PM reviews, moves approved to planning/scenarios/)

3. pipeline-review    →  (optional but recommended) architecture + design
                          pre-flight on the approved scenario. Verdict:
                          PROCEED, REVISE, or EXTEND. Output:
                          planning/history/F{NNN}-review.md.

4. pipeline-eval      →  writes Playwright tests from the approved scenario
   (write mode)           BEFORE build — this is the firewall against
                          teaching to test. Reads scenario only, never
                          the review or the code.

5. pipeline-ticket    →  breaks the approved scenario into ordered,
                          session-sized tickets in development/tickets/.
                          Reads scenario AND the review document if one
                          exists.

6. pipeline-build     →  implements one ticket at a time via TDD.
                          Commits to app repo. Updates BUILD-LOG.md.

7. pipeline-eval      →  runs the F### evals against the new build.
   (run mode)             Reports pass/fail with scenario traceability.

8. On pass: PM picks the next scenario or ticket.
   On fail: pipeline-build fixes forward. Loop returns to step 6.
   On scenario-is-wrong: escalate to pipeline-plan; loop returns to step 2.
   On review verdict EXTEND/REVISE: cycle returns to step 1 or 2.
```

**Steps 4 (eval-write) and 5 (ticket) run in parallel** — both consume the approved scenario. Eval-write does so without seeing tickets or code; ticket writer does so without seeing the eval spec. Both feed into step 6 (build).

**Key rule:** evals are written *before* build (step 3, against the scenario only — eval writer never reads code) and *run* after build (step 6). This separation is what makes the pipeline trustworthy. Skipping step 3 means the build agent could be writing tests that match its own implementation rather than the scenario.

## Pipeline reference (read once, internalize)

```
Product (dream) → Planning (filter) → Eval-write (oracle) → Ticket (sequence) → Build (execute) → Eval-run (verify)
```

- **Information firewalls:** each role has explicit can-read / cannot-read sets.
  - `pipeline-build` never reads `planning/scenarios-backlog/` (prevents teaching to test).
  - `pipeline-eval` (write mode) never reads code (prevents test-to-implementation matching).
  - `pipeline-ticket` never reads code (prevents "fixing" the spec via the codebase).
- **Unidirectional flow:** upstream agents never implement; downstream agents never redesign.
- **Escalation over improvisation:** divergence from spec → document and escalate, do not autonomously redesign.

## Expected project layout

A project using this pipeline has:

```
{project}/
├── CLAUDE.md                  # Thin project facts only (stack, paths, north stars)
├── JOURNAL.md                 # Reverse-chron PM log
├── AGENTS.md                  # Pipeline definition — project-wide, lives at root
├── product/                   # Vision (foundation, exploration, capabilities, systems, products)
├── planning/                  # Scope (bundles, scenarios, scenarios-backlog, DECISIONS.md)
├── development/               # Execution (tickets, DEVIATIONS.md)
└── {app}/                     # Code (separate repo if two-repo setup)
```

If any of these are missing, suggest `pipeline-scaffold`.

## Hand off

**You produced:** orientation. Possibly an updated `JOURNAL.md` entry if you observed drift.

**Next skill:** whichever entry in the routing table fits the user's request. You do not implement; you route once and step back. If the user's request is ambiguous, ask one clarifying question rather than guessing — routing the wrong skill costs more than a clarifying question.
