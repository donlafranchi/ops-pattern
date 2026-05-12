# pipeline-eval — workflow

## Cheat sheet

| | |
|---|---|
| **Reads (write mode)** | `planning/scenarios/F{NNN}-{slug}.md` only — the approved scenario |
| **Writes (write mode)** | `{app}/evals/features/F{NNN}-{slug}.spec.ts` (one spec per scenario) |
| **Reads (run mode)** | `{app}/evals/features/`, `{app}/evals/results/`, the referenced scenario for traceability |
| **Writes (run mode)** | `{app}/evals/results/F{NNN}-{YYYY-MM-DD}.md` |
| **Templates** | `templates/playwright-spec.md`, `templates/results.md` |
| **Does NOT read (write mode)** | `web/` source code, tickets, scenarios-backlog — the firewall that makes evals trustworthy |
| **Does NOT do** | fix failing tests — that's `pipeline-build`'s job |
| **Hands to (write mode)** | `pipeline-build` — implements without seeing the eval file |
| **Hands to (run mode, pass)** | PM — loop closes |
| **Hands to (run mode, fail)** | `pipeline-build` (impl wrong) or `pipeline-plan` (scenario wrong) |

## When called to write evals

1. Read the scenario at `planning/scenarios/F{NNN}-{slug}.md`.
2. For each Given/When/Then block, translate into a test:
   - **Given** → setup / fixtures / seeded state.
   - **When** → user action or API call under test.
   - **Then** → assertion — must be exact, no fuzzy matches.
3. Place tests under the project's eval directory (typical: `{app}/evals/features/F{NNN}.spec.ts` or framework equivalent).
4. Preserve any `data-testid` / `data-extractive` attributes — evals may depend on them.

## When called to run evals

1. Run the project's eval command — typically:
   - `npm run eval -- --grep "F{NNN}"` (Playwright)
   - `pytest tests/F{NNN}_*.py` (Python)
   - or the project-specific equivalent from the root `CLAUDE.md`.
2. Report:
   - File and scenario it traces to.
   - Pass/fail per Given/When/Then block.
   - For failures: the exact assertion that failed and the observed state.
3. If a test fails: do NOT fix it. Report and let `pipeline-build` fix forward.

## When called after a ticket completes

1. Find the scenario referenced in the ticket's `Scenario:` field.
2. Run only that scenario's evals.
3. Confirm pass/fail. Update the ticket's Completion section if you have authority; otherwise hand back to the build agent.

## Edge cases

- **No evals exist for this scenario yet.** Write them first, then run them. Note this in the report.
- **Scenario has changed since evals were written.** Flag the drift, do not silently update tests — escalate to planning.
- **Test passes but scenario behavior is wrong.** Escalate to `pipeline-plan`. The scenario or the ticket is out of sync with intent.

## Hand off

**Write mode → `pipeline-build`.** Tests land in `{app}/evals/features/F{NNN}.spec.ts`. Build agent implements without reading them.

**Run mode, pass → PM.** The loop closes. PM picks the next scenario or asks `pipeline-ticket` for the next ticket.

**Run mode, fail → `pipeline-build`.** Build fixes forward. Never roll back. Never silently update tests.

**Run mode, scenario-is-wrong → `pipeline-plan`.** Annotate the divergence; plan revises the scenario; cycle restarts.
