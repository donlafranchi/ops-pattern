# Playwright spec template (one per scenario file)

Place at: `{app}/evals/features/F{NNN}-{slug}.spec.ts`

The structure mirrors the scenario's BDD beats one-to-one — every `### Story beat` in the scenario becomes a `test.describe` block; every `**Given** / **When** / **Then**` becomes a single `test()` whose body sets up state, performs the action, and asserts the outcome.

```ts
import { test, expect } from "@playwright/test";

// F{NNN}: {Persona} {does the thing}
// Source: planning/scenarios/F{NNN}-{slug}.md
//
// One test per Given/When/Then beat. The eval writer never reads code
// under {app}/ — these tests are written from the scenario alone.

test.describe("F{NNN} — {persona} {does the thing}", () => {
  test.beforeEach(async ({ page }) => {
    // Reset to a known seed if the project's eval harness supports it.
    // Do not write app helpers here — anything you call must be in the
    // eval-only utilities directory ({app}/evals/utils/).
  });

  test.describe("{Story beat 1 — short heading}", () => {
    test("Given {state} | When {action} | Then {outcome}", async ({ page }) => {
      // Given — fixture setup
      // (seed users, items, locations as the scenario describes)

      // When — user action
      await page.goto("{starting URL named in the scenario's Surfaces section}");
      // ... interactions

      // Then — assertion. Be exact; no fuzzy matches.
      await expect(page.getByRole("button", { name: /Host something here/i })).toBeVisible();
    });
  });

  test.describe("{Story beat 2}", () => {
    test("Given … | When … | Then …", async ({ page }) => {
      // …
    });
  });
});
```

## Naming conventions

- **File:** `F{NNN}-{slug}.spec.ts` — slug matches the scenario filename slug.
- **Describe block:** `F{NNN} — {persona} {does the thing}` — copies the scenario H1.
- **Inner describe:** the scenario's `### Story beat` heading verbatim.
- **Test name:** `Given {…} | When {…} | Then {…}` — copy from the scenario, abbreviate only if a clause is genuinely long.

## What you can rely on (project conventions to confirm before writing)

- Test selectors: prefer `getByRole`, `getByLabel`, `getByText`. Fall back to `data-testid` if the project uses one.
- Auth helpers: the project's eval harness should expose `loginAs(role)` or similar — check `{app}/evals/utils/`. If none exists, escalate (do not stub authentication in the test file).
- Seed/fixture: check for `{app}/evals/fixtures/` or a per-test seed function. If none exists, escalate to `pipeline-plan` to clarify the scenario's "Assumptions" section.

## What you do NOT do

- Do not import from `{app}/src/` or any code under the app's source tree. Eval tests are an external oracle.
- Do not write helpers that paper over scenario ambiguity. If a Then-clause is unclear, escalate to `pipeline-plan`.
- Do not skip Then-clauses. Every assertion in the scenario must have a corresponding `expect()` in the spec.

## When to add data-testid attributes to the app

You don't. The build agent does. If you write a test that needs a stable hook the build agent hasn't created yet, write the test using a semantic selector (`getByRole`, `getByText`) and leave a `// TODO: build agent — add data-testid="…" if this becomes flaky` comment for traceability.
