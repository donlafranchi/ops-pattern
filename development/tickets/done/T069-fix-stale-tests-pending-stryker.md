---
id: how-t069-fix-stale-tests-pending-stryker
purpose: Cleanup ticket — fix the pre-existing stale tests T068 surfaced and excluded from Stryker, then remove their exclude entries.
layer: how
status: draft
---

# T069 — Fix stale tests deferred from T068

**Scenario:** substrate — test maintenance, no user-facing surface.
**Status:** Open
**Bundle:** b1 (tooling, not gated).
**Depends on:** T068 (which surfaces and excludes the stale tests; T069 fixes them and removes the excludes).
**Repo / branch:** web / `t69`

**Serves:**
- **Loop:** all five (substrate). Once T068 widened Stryker's test include, the pre-existing stale tests in `tests/` became visible as a behavioral-coverage gap — Stryker can't run them, so the mutation score under-reports. T069 closes the gap.
- **Primitive shape:** none directly.
- **Failure mode this prevents:** silent rot of `tests/` suites. Each stale assertion is a test that's been green-by-skip in CI for some unknown window. The longer they sit excluded, the more divergent the assertion gets from reality and the harder the fix.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A (no migration; test code only).
- [ ] **DEVIATIONS.md entry** at ticket close.

## Background

T068 widened `web/vitest.stryker.config.ts` to include `tests/**/*.test.ts(x)`. Running `npx vitest run tests/` against the widened set surfaced N pre-existing stale tests — suites whose assertions reference frozen project state (e.g., a hardcoded migration count, a frozen file list, a stale schema column name) that no longer matches the current repo.

T068 excluded each stale file from Stryker with an inline `// stale — T069` comment, allowing the mutation run to complete. T069 walks that exclude list, fixes each assertion, removes the exclude entry, and re-runs the suite.

The known head of the list (from the T068 dry run that motivated this ticket):
- `tests/auth-signup-route-t044.test.ts` — line 67, "T044 — Phase 0 migrations directory state" asserts a frozen 5-migration list; the project has 22 migrations now.

The full list lives in `web/vitest.stryker.config.ts` under the `// stale — T069` comment block once T068 lands.

## Acceptance criteria

### 1 — Identify the work

- [ ] Read `web/vitest.stryker.config.ts`. List every exclude entry suffixed `// stale — T069`. This is the work surface.

### 2 — Fix each stale test

For each file in the T069 list:

- [ ] Read the test. Identify the assertion that no longer matches reality. Typical patterns: hardcoded migration counts, frozen file-name lists, fixed row counts that grew, schema columns since renamed.
- [ ] Decide the fix per the test's *intent*, not its *current shape*:
  - If the test was asserting "the migration directory exists and contains files" — replace the hardcoded list with a length/glob check.
  - If the test was asserting "this specific file is in the list" — keep the membership check; drop the exhaustive enumeration.
  - If the test was asserting "exactly these files and no others" — preserve the strict shape but switch the literal list to a snapshot or a programmatically-derived expected set. Don't downgrade strictness silently.
- [ ] Run `npx vitest run path/to/the-test.test.ts` standalone. Must pass.
- [ ] Run `npx vitest run tests/` in full. Must not break any sibling test.

### 3 — Remove excludes + re-baseline

- [ ] For each fixed file, remove its line from the `exclude` array in `web/vitest.stryker.config.ts` (and the leading comment lines if the whole block goes empty).
- [ ] `cd web && npm run mutate` completes cleanly.
- [ ] Record the new total mutation score in the Completion section. Compare to T068's post-fix baseline — score should rise (more tests running = more mutants killed) or hold; a drop is unexpected and worth investigating before commit.

### 4 — Documentation

- [ ] `web/BUILD-LOG.md` — T069 row with the count of tests fixed and the post-fix mutation score.
- [ ] `development/DEVIATIONS.md` — entry noting any test whose intent was unclear and got a judgment-call fix; flag for PM review if non-trivial.

## Notes

**Why not fix these inline in T068.** T068 is a one-line config change with a clean single-purpose commit. Folding stale-test fixes into it would conflate "narrow Stryker scope" with "fix N unrelated test assertions" — different concerns, different M2 review surfaces, harder to revert independently. T069 is the dedicated cleanup pass.

**Don't downgrade strictness.** The temptation when fixing a "list of 5 migrations is now 22" assertion is to delete the test or weaken it to `expect(migrations.length).toBeGreaterThan(0)`. Resist. The original assertion expressed *some* intent — recover it (programmatically derive the expected list, or snapshot it) rather than gut it. If the intent is genuinely obsolete, delete the whole `it()` block with a comment explaining why, not the assertion alone.

**Stop and escalate if any "stale" exclude turns out to be a Stryker-isolation issue.** If, after fixing the assertion, the test passes under plain `npx vitest run` but fails under Stryker's per-test isolation, that's the category T065's warning covered — escalate to PM rather than re-excluding silently.

**Commit hygiene.** Single commit, one-liner: `T069: fix stale tests pending under T068 Stryker exclude`. PM commits.

## Completion

Date:
Commit (web):
Commit (parent):

**Files fixed:**
- (list of test files + one-line summary of each assertion fix)

**Mutation score after T069:**
- Total: __% (T068 baseline was __%)
- Runtime: __

**Judgment-call fixes (worth PM review):**
- (or "none")

**Workflow gates:**
- [ ] M2 code-review — invoked, verdict:
- [n/a] M3 a11y — no UI surface.
- [n/a] M4 deploy checklist — no migration.
- [ ] DEVIATIONS.md entry appended.
