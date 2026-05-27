# test — workflow

## Cheat sheet

| | |
|---|---|
| **Reads (write mode)** | `planning/scenarios/F{NNN}-{slug}.md` only — the approved scenario |
| **Writes (write mode)** | `{app}/evals/features/F{NNN}-{slug}.spec.ts` (one spec per scenario) |
| **Reads (run mode)** | `{app}/evals/features/`, `{app}/evals/results/`, the referenced scenario for traceability |
| **Writes (run mode)** | `{app}/evals/results/F{NNN}-{YYYY-MM-DD}.md` |
| **Templates** | `templates/playwright-spec.md`, `templates/results.md` |
| **Does NOT read (write mode)** | `web/` source code, tickets, scenarios-backlog — the firewall that makes evals trustworthy |
| **Does NOT do** | fix failing tests — that's `build`'s job |
| **Hands to (write mode)** | `build` — implements without seeing the eval file |
| **Hands to (run mode, pass)** | PM — loop closes |
| **Hands to (run mode, fail)** | `build` (impl wrong) or `scope` (scenario wrong) |

## When called to write evals

1. Read the scenario at `planning/scenarios/F{NNN}-{slug}.md`.
2. For each Given/When/Then block, translate into a test:
   - **Given** → setup / fixtures / seeded state.
   - **When** → user action or API call under test.
   - **Then** → assertion — must be exact, no fuzzy matches.
3. Place tests under the project's eval directory (typical: `{app}/evals/features/F{NNN}.spec.ts` or framework equivalent).
4. Preserve any `data-testid` / `data-extractive` attributes — evals may depend on them.

## Co-locate `why` with `what` in tests (write mode, per AGENTS.md → PIPELINE-AUDIT F13)

Every test you write carries its **why** alongside its **what**. The test's `name` / `it(...)` / `test(...)` string encodes the *what* (the assertion). A comment immediately above any non-obvious assertion encodes the *why* (the design intent the assertion is protecting). Without the Why, a future agent maintaining the test sees only the assertion — and when the surface text the test verifies changes, the agent silently updates the test to match the new surface, which deletes the protection the test was offering.

**Where to apply.** Every assertion that verifies a *design choice* rather than a mechanical fact. *"Then the page returns 200"* is mechanical — no Why comment needed. *"Then the date 'Thursday, May 14, 6:00 PM' is visible"* encodes a timezone choice (venue's tz, not viewer's) that the literal text doesn't reveal — needs a Why comment.

**Format.** A `// Why: {one sentence on what design intent this protects, anchored to the scenario clause's `Why:` line if one exists, or to a foundation/system doc if not}.` immediately above the assertion.

**Example.**

> *Without:*
> ```ts
> await expect(page.getByText('Thursday, May 14, 6:00 PM')).toBeVisible();
> ```
>
> *With:*
> ```ts
> // Why: timezone is the venue's, not the viewer's — verifies F018 Then-clause #3 against the design intent in primitives.md, not just the literal text. If the rendered date drifts to the viewer's tz, this test must fail (and a future agent must NOT silently update the expected string to match — escalate to scope).
> await expect(page.getByText('Thursday, May 14, 6:00 PM')).toBeVisible();
> ```

**Inheriting from the scenario.** If the scenario clause carries a `Why:` annotation (per `scope`'s discipline), copy or paraphrase it into the test's Why comment — don't restate from scratch. The scenario's Why is the authority; the test's Why is the propagation.

**Verification.** Before declaring the spec done: walk every assertion. For each one that verifies a design choice, confirm a `// Why:` comment exists immediately above it. If the scenario clause that the assertion traces to has a `Why:` annotation, confirm the test's Why preserves the same intent. Missing Why on a non-obvious assertion → not done.

## When called to run evals

1. Run the project's eval command — typically:
   - `npm run eval -- --grep "F{NNN}"` (Playwright)
   - `pytest tests/F{NNN}_*.py` (Python)
   - or the project-specific equivalent from the root `CLAUDE.md`.
2. Report:
   - File and scenario it traces to.
   - Pass/fail per Given/When/Then block.
   - For failures: the exact assertion that failed and the observed state.
3. If a test fails: do NOT fix it. Report and let `build` fix forward.

## When called after a ticket completes

1. Find the scenario referenced in the ticket's `Scenario:` field.
2. Run only that scenario's evals.
3. Confirm pass/fail. Update the ticket's Completion section if you have authority; otherwise hand back to the build agent.

## Edge cases

- **No evals exist for this scenario yet.** Write them first, then run them. Note this in the report.
- **Scenario has changed since evals were written.** Flag the drift, do not silently update tests — escalate to planning.
- **Test passes but scenario behavior is wrong.** Escalate to `scope`. The scenario or the ticket is out of sync with intent.

## Hand off

**STAGE-LEDGER stamp.** Write mode: stamp the F-number's Eval-spec column with today's date. Run mode pass: flip stage to `done` with date. Run mode fail: leave stage at `eval` and append the fail date.

**Write mode → `build`.** Tests land in `{app}/evals/features/F{NNN}.spec.ts`. Build agent implements without reading them.

**Run mode, pass → PM.** The loop closes. PM picks the next scenario or asks `ticket` for the next ticket.

**Run mode, fail → `build`.** Build fixes forward. Never roll back. Never silently update tests.

**Run mode, scenario-is-wrong → `scope`.** Annotate the divergence; plan revises the scenario; cycle restarts.
