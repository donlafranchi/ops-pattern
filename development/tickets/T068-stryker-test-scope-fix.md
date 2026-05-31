---
id: how-t068-stryker-test-scope-fix
purpose: Substrate ticket — narrow the Stryker test-runner exclude list so existing unit tests in web/tests/ participate in mutation runs, then re-baseline.
layer: how
status: open
---

# T068 — Stryker test-runner scope fix

**Scenario:** substrate — dev tooling, no user-facing surface.
**Status:** Open
**Bundle:** b1 (tooling, not gated).
**Depends on:** T065 (Stryker install + initial baseline). Touches only the Stryker test-runner config; no source code, no new tests.
**Repo / branch:** web / `t68`

**Serves:**
- **Loop:** all five (substrate). Restores behavioral-coverage signal to the existing test suite so future tickets in `src/lib/` get a meaningful mutation score on PR.
- **Primitive shape:** none directly.
- **Failure mode this prevents:** misreading the T065 baseline as a "no tests" problem. The 30% total / 0% per-file scores for `places/*`, `slugify`, `geocoding`, `categories`, `map-config`, `action-context` reflect Stryker not running the tests that already cover those files, not absence of tests. Acting on the misread (writing duplicate tests as siblings) would double the test surface for no coverage gain.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A (no migration; local-only script).
- [ ] **DEVIATIONS.md entry** at ticket close — record the T065 config drift this corrects, even if just "no further deviations."

## Background

T065 installed Stryker and captured a 30% mutation score over 162 mutants on `src/lib/**`. Per-file:
- `market-dates.ts` 82.5% (sibling test `src/lib/market-dates.test.ts`)
- `action-context.ts`, `categories.ts`, `geocoding.ts`, `slugify.ts`, `places/resolve-path.ts`, `places/reverse-geocode.ts` — all 0%

A walk through `web/tests/` shows tests *do* exist for most of the zero-score files:
- `tests/places-resolve-path.test.ts` (T060)
- `tests/reverse-geocode.test.ts` (T059)
- `tests/geocoding.test.ts`
- `tests/slugify.test.ts` + `tests/slugify-extended.test.ts`
- `tests/map-config.test.ts`

T065's `vitest.stryker.config.ts` (line 14) excludes `tests/**` wholesale to dodge the 12 pre-existing failing `tests/migrations-T0NN.test.ts` suites (DB-bound; no DB available during a Stryker run). The exclude was correct for migration tests but too broad — it also excluded the unit tests that cover the very files Stryker mutates.

Narrowing the exclude to `tests/migrations-*.test.ts` keeps the DB-bound suites out (they would fail under Stryker regardless) while letting the pure-logic tests participate. Result: the existing test suite kills mutants it already could have killed.

**Why this isn't "write more tests."** The tests authored in T059/T060 cover the high-complexity files (`places/resolve-path.ts` 3-tier walk + slug regex guard; `places/reverse-geocode.ts` validation + cache + polygon + Mapbox fallback). Writing sibling `src/lib/` tests for the same behaviors would duplicate coverage without finding new bugs. The right move is to point Stryker at the tests that already exist.

## Acceptance criteria

### 1 — Discover stale tests in `tests/` (run before editing the config)

- [ ] From the worktree root: `cd web && npx vitest run tests/ 2>&1 | tee /tmp/t068-vitest-tests.log`.
- [ ] List every test FILE that fails (one entry per file, even if multiple specs in it fail). Skip `tests/migrations-*.test.ts` — those are knowingly DB-bound and will be excluded regardless.
- [ ] If a failure is a Stryker-isolation issue (rare; happens when a test mutates module-level state that survives reset) **and** the same test passes under plain `npx vitest run tests/`, stop and escalate. That category is what T065's "do not silently quarantine" warning covered.
- [ ] All other failures are pre-existing stale assertions surfaced by widening Stryker's include. Defer the fix to T069.

### 2 — Config fix

- [ ] Edit `web/vitest.stryker.config.ts`. Update the `include` line to pick up `tests/` unit tests:
  ```ts
  include: [
    'src/**/*.test.ts', 'src/**/*.test.tsx',
    'tests/**/*.test.ts', 'tests/**/*.test.tsx',
  ],
  ```
- [ ] Replace the current exclude line. Each stale test file from step 1 gets its own entry with an inline `// stale — T069` comment so T069 has a clean grep target:
  ```ts
  exclude: [
    'node_modules/**',
    '.stryker-tmp/**',
    'reports/**',
    'evals/**',
    // DB-bound migration tests need a live Postgres; they cannot run under
    // Stryker. Permanent exclusion — see T068 Notes § Migration exclusion.
    'tests/migrations-*.test.ts',
    // Stale assertions surfaced by widening the Stryker include. Each entry
    // is a pre-existing bug, not a Stryker-isolation issue. T069 will fix
    // the assertion and remove the exclude.
    'tests/auth-signup-route-t044.test.ts', // stale — T069
    // ...one line per stale file from step 1, suffix `// stale — T069`
  ],
  ```
- [ ] Update the file's header comment to reflect the new scope (currently says "excludes the /tests directory"; should say "excludes only DB-bound migration suites + pre-existing stale tests pending T069").

### 3 — Verify it runs end-to-end

- [ ] `cd web && npm run mutate` completes without configuration errors on branch `t68`.
- [ ] No NEW test-runner errors in the Stryker log beyond the files excluded in step 2. If a *new* test fails under Stryker that passed under plain vitest in step 1, **stop and escalate** — that's the Stryker-isolation category and the "do not silently quarantine" rule applies.
- [ ] HTML report writes to `web/reports/mutation/index.html`.

### 4 — Capture the new baseline

- [ ] Record the post-fix scores in the Completion section:
  - Total mutation score (was 30% / 162 mutants).
  - Per-file scores for: `places/resolve-path.ts`, `places/reverse-geocode.ts`, `slugify.ts`, `geocoding.ts`, `map-config.ts`, `categories.ts`, `action-context.ts`, `market-dates.ts`.
  - Runtime delta vs. T065's ~3 minutes.
  - Count of stale tests excluded for T069.
- [ ] If any file ends up materially below the rest after the fix (e.g., `categories.ts` or `action-context.ts` still at 0%), note it. **Do not write new tests in this ticket** — file a follow-up if the residual gap is worth closing.

### 5 — Documentation

- [ ] `web/CLAUDE.md` — if the "Mutation testing" subsection from T065 references the exclude scope, update it to reflect the narrowed scope. Otherwise leave alone.
- [ ] `web/BUILD-LOG.md` — standard T-ticket update with the new baseline numbers.
- [ ] `development/DEVIATIONS.md` — two entries:
  - T065's too-broad exclude as `flag-for-spec-revision` (the spec didn't specify what to do with `tests/` — the build agent chose conservatively; T068 corrects). Disposition: `corrected-in-t068`.
  - The N stale test files surfaced by step 1, listed by name. Disposition: `deferred-to-t069`.

## Notes

**Why a separate ticket and not an amend of T065.** T065 is shipped and committed (commit `1c2270c` on branch `t65` per its Completion section). Amending would rewrite the published history of a closed ticket. T068 records the config evolution cleanly: T065 installed Stryker with a conservative exclude; T068 narrows the exclude once we confirmed which tests are truly DB-bound. Two commits, two tickets, clean lineage.

**What this ticket does *not* do.**
- Does not write new test files. Tests already exist for the files Stryker mutates.
- Does not move tests from `tests/` to `src/lib/` siblings. The repo currently uses both conventions (`src/lib/market-dates.test.ts` lives next to its module; everything else lives in `tests/`). A convention decision is out of scope here; T068 just makes Stryker honor whichever convention the file uses.
- Does not adjust `thresholds.break`. The point of this ticket is to learn the *real* baseline; threshold-setting is a follow-up.
- Does not address residual 0% scores on `action-context.ts` (sentinel Proxy — defensive scaffolding, low ROI to test) or `categories.ts` (mostly static data + a 1-line fallback). File follow-up tickets if the post-fix numbers say they matter.

**Migration test exclusion is permanent.** The `tests/migrations-*.test.ts` exclude isn't a temporary patch — those tests run real SQL against a live Supabase database that Stryker's per-mutant isolation cannot provide. Document this in the config comment so the next agent doesn't try to "fix" the exclude by removing it.

**Commit hygiene.** Single commit, one-liner: `T068: Stryker scope fix — include tests/, defer stale suites to T069`. PM commits per the parent CLAUDE.md commit rules; agent produces a summary, does not run `git add`/`git commit`.

**Follow-up ticket.** T069 walks the `// stale — T069` entries in the post-T068 exclude list, fixes each assertion (typically a hardcoded count/list out of sync with the current repo state), and removes the exclude entry. Final state of T069: every `// stale — T069` line is gone from `vitest.stryker.config.ts`, the migration-glob exclude is the only `tests/` exclude remaining.

## Completion

Date: 2026-05-31
Commit (web): cfbbc91 (branch `t68`)
Commit (parent): {pending}

**What landed:**
- `web/vitest.stryker.config.ts` — widened `include` to pick up `tests/**/*.test.ts(x)`; narrowed `exclude` to `tests/migrations-*.test.ts` (permanent, DB-bound) + 5 named pre-existing stale files (deferred to T069). Header comment updated.
- `web/CLAUDE.md` — Mutation testing subsection updated to reflect the new scope.
- `web/BUILD-LOG.md` — T068 row added with new baseline.
- `development/DEVIATIONS.md` — one entry covering both the T065 config drift (`corrected-in-T068`) and the 5 stale tests (`deferred-to-T069`).

**New baseline (post-fix run):**
- Total mutation score: **58.05%** (was 30%) — 155 killed / 63 survived / 49 no-coverage / 121 errors / 0 timeout, over 388 mutants on 8 files.
- Runtime: **5m59s** (was ~3min).
- Per file:
  - `places/resolve-path.ts`: **72.22%** (was 0%)
  - `places/reverse-geocode.ts`: **63.53%** (was 0%)
  - `slugify.ts`: **30.43%** (was 0%)
  - `geocoding.ts`: **60.00%** (was 0%)
  - `map-config.ts`: not in Stryker's mutate set (excluded by `stryker.config.mjs`, unchanged from T065).
  - `categories.ts`: **0.00%** (was 0%) — no test file exists; mostly static data.
  - `action-context.ts`: **0.00%** (was 0%) — no test file exists; sentinel Proxy scaffolding.
  - `market-dates.ts`: **82.50%** (unchanged).
- Stale tests excluded for T069 (5):
  - `tests/auth-signup-route-t044.test.ts` — frozen "5 migrations" list, dir has 22.
  - `tests/ci-conformance-json.test.ts`
  - `tests/ci-enforcement-rule-1.test.ts`
  - `tests/ci-enforcement-rule-4.test.ts`
  - `tests/eval-bootstrap.test.ts`

**Residual gaps worth a follow-up ticket:**
- `action-context.ts` 0% — defensive sentinel Proxy; low ROI to add tests. Skip unless a real bug surfaces.
- `categories.ts` 0% — mostly a static array + a 1-line fallback. Low ROI. Skip.
- `slugify.ts` 30.43% — lowest non-zero file. The existing tests miss the DB-collision path (`{base}-{count}` branch). A focused 1–2 test addition would lift it considerably. Worth folding into T069 or a sibling follow-up.

**Workflow gates:**
- [ ] M2 code-review — pending invocation before commit (per rebuild rule 3).
- [n/a] M3 a11y — no UI surface.
- [n/a] M4 deploy checklist — no migration.
- [x] DEVIATIONS.md entry appended.
