---
id: how-t065-mutation-testing-stryker
purpose: Ticket T065 — Stryker mutation testing for pure-logic surface.
layer: how
status: draft
---

# T065 — Mutation testing (Stryker) on `src/lib/` pure logic

**Scenario:** `substrate` — dev tooling, no user-facing surface.
**Status:** Build complete 2026-05-25; awaiting PM commit + close.
**Bundle:** b1 (any sub-bundle; tooling, not gated).
**Depends on:** none. T051 is the structural-defense lineage; this adds a behavioral-coverage check (tests that pass against broken code) on top of T051's posture-checks. Independent: can land before or after any in-flight ticket.

**Serves:**
- **Loop:** All five (substrate). Mutation testing protects every loop's logic against the failure mode where a test is green but does not actually assert the behavior it claims to.
- **Primitive shape:** None directly.
- **Failure mode this prevents:** silent test rot — tests that exercise a code path but assert nothing meaningful, or assert against a constant that equals the input. Vitest coverage % does not catch this; mutation score does.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A (no migration; local-only script).
- [ ] **DEVIATIONS.md entry** at ticket close (even "no deviations").

## Background

`web/` runs Vitest for unit tests and Playwright for evals. Coverage today is statement/branch via Vitest; there is no behavioral-quality signal. Stryker runs mutation testing on top of the existing Vitest suite — it perturbs the source (`x + y` → `x - y`, `>` → `>=`, drop a conditional, etc.) and re-runs the suite per mutant. A mutant "killed" by a failing test means the suite catches that class of bug; a "survived" mutant means the code path is untested or the assertion is too weak.

Stryker's `@stryker-mutator/vitest-runner` reuses the existing `vitest.config.ts` and runs in-process per mutant. The `@stryker-mutator/typescript-checker` plugin pre-rejects mutants that don't typecheck — cuts runtime substantially on a TS codebase.

**Scope chosen (PM, 2026-05-25):** pure-logic only — `src/lib/**/*.ts` excluding clients (`supabase*.ts`), the `types.ts` type-only file, and `*.test.ts`. Action handlers, React components, and route handlers are out of scope at b1 (would require DB-bound test scaffolding to make mutation runs cheap enough).

**Local-only at b1.** No CI gate. PM runs `npm run mutate` manually. CI integration deferred until the baseline mutation score is known and a sensible threshold can be set.

## Acceptance criteria

### 1 — Install + config

- [ ] Add devDependencies in `web/package.json`:
  - `@stryker-mutator/core`
  - `@stryker-mutator/vitest-runner`
  - `@stryker-mutator/typescript-checker`
- [ ] Create `web/stryker.config.mjs`:
  - `testRunner: 'vitest'`
  - `checkers: ['typescript']`
  - `tsconfigFile: 'tsconfig.json'`
  - `mutate`: include `src/lib/**/*.ts`; exclude `src/lib/**/*.test.ts`, `src/lib/supabase.ts`, `src/lib/supabase-server.ts`, `src/lib/types.ts`, `src/lib/map-config.ts` (pure config constants — nothing to mutate meaningfully).
  - `reporters: ['progress', 'clear-text', 'html']`
  - `htmlReporter.fileName: 'reports/mutation/index.html'`
  - `coverageAnalysis: 'perTest'` (lets Stryker skip irrelevant tests per mutant — biggest speed win).
  - `timeoutMS: 10000`, `concurrency: 4` (tune after first run).
  - No `thresholds.break` set at b1 (local-only). `thresholds.high: 80, low: 60` for the report colour-coding only.
- [ ] Add npm script: `"mutate": "stryker run"`.
- [ ] Gitignore: add `web/reports/mutation/` and `web/.stryker-tmp/`.

### 2 — Verify it runs end-to-end

- [ ] `cd web && npm install && npm run mutate` completes without configuration errors on the current `main`.
- [ ] HTML report writes to `web/reports/mutation/index.html` and opens in a browser.
- [ ] Mutation score is reported in stdout (any number is acceptable; we are not gating on it).
- [ ] Record the baseline score and runtime in the Completion section so the next ticket has a starting point.

### 3 — One smoke mutant survives + one is killed

A sanity check that the runner is wired correctly. After the first run:

- [ ] Pick one file with surviving mutants (likely `slugify.ts` or `market-dates.ts`). Inspect the surviving mutant in the HTML report.
- [ ] If every surviving mutant in that file represents a real coverage gap, log it to DEVIATIONS as a `flag-for-spec-revision` (test-quality gap, not a build bug).
- [ ] Confirm at least one mutant was killed in the run — proves the suite is actually executing per mutant.

### 4 — Documentation

- [ ] `web/CLAUDE.md` — add a one-paragraph "Mutation testing" subsection: when to run, how to read the report, where the config lives. No nesting.
- [ ] `web/BUILD-LOG.md` — standard T-ticket update.
- [ ] `standards/safety.md` — add one bullet under (to-be-written) Verification: "Mutation testing (Stryker) on `src/lib/**` — local-only at b1; CI gate deferred." This is the only spec touch; do not expand the stub.

## Notes

**Why mutation testing here, not coverage thresholds.** Coverage % is satisfied by any test that calls the function. Mutation testing requires the test to actually assert correctness — which is the property the McKinsey/Lily failure mode (T051) prevents *structurally* but not *behaviorally*. T051 says "every write goes through the action layer." Mutation testing says "the tests around that layer catch real bugs." They compose.

**Why `src/lib/` only, not actions.** Action handlers need a live DB to run their tests; mutation testing re-runs the suite many times, so the per-mutant cost is roughly N × (DB setup + handler test time). At b1 that's prohibitive. The pure-logic surface in `src/lib/` runs in jsdom without I/O — Stryker's per-test isolation is cheap there. Extending to actions is a follow-up ticket once we have a `npm run test:unit` that runs only the I/O-free subset.

**Why no CI gate yet.** The first run's mutation score is unknown. Setting `thresholds.break` before we know the baseline either fails CI from day one (annoying) or sets a too-easy threshold (no signal). Land the tool, learn the number, then ratchet up in a later ticket.

**Stryker + Vitest 4.** The `@stryker-mutator/vitest-runner` documents Vitest 3 compatibility; this repo runs Vitest 4. If the runner errors on the installed Vitest version, **stop and escalate** — do not pin Vitest backwards. Either Stryker has a 4.x-compatible release (check npm), or this ticket is deferred until they ship one. Document in DEVIATIONS either way.

**Commit hygiene.** Single commit, one-liner: `T065: Stryker mutation testing on src/lib/`. PM commits per the parent CLAUDE.md commit rules; agent produces a summary, does not run `git add`/`git commit`.

## Completion

Date: 2026-05-25
Commit (web): `1c2270c` — `T065: Stryker mutation testing on src/lib/` (branch `t65`, awaiting merge to main)
Commit (parent): `9ad8b59` — `docs(pipeline): T065 mutation-testing ticket + safety standard`

**What landed:**

*Tooling (web):*
- `package.json` — devDeps `@stryker-mutator/core@9.6.1`, `@stryker-mutator/vitest-runner@9.6.1`, `@stryker-mutator/typescript-checker@9.6.1`; npm script `"mutate": "stryker run"`.
- `stryker.config.mjs` — testRunner vitest, checkers ['typescript'], `vitest.configFile: 'vitest.stryker.config.ts'`, `tsconfigFile: 'tsconfig.stryker.json'`, mutate scope = `src/lib/**/*.ts` minus tests/clients/types/map-config, `coverageAnalysis: 'perTest'`, reports html+progress+clear-text, thresholds high 80 / low 60 / break null.
- `tsconfig.stryker.json` — extends base; narrows `include` to `src/**`; bumps target to ES2018 (clears two pre-existing baseline TS errors documented in DEVIATIONS).
- `vitest.stryker.config.ts` — scopes the Stryker-driven Vitest to `src/**/*.test.ts(x)`, excludes `tests/` (where 12 pre-existing failures live).
- `vitest.config.ts` — added `.stryker-tmp/**` and `reports/**` to exclude so leftover sandboxes never poison `npm test`.
- `.gitignore` — `reports/mutation/`, `.stryker-tmp/`.

*Docs:*
- `web/CLAUDE.md` — "Mutation testing" subsection (one paragraph, no nesting).
- `web/BUILD-LOG.md` — T065 row.
- `standards/safety.md` — Verification bullet (single line).
- `development/DEVIATIONS.md` — T065 entry covering the two narrowed-config drifts.

**Baseline (first run):**
- Total mutation score: **30%** over 162 mutants (33 killed, 6 survived, 71 no-coverage, 52 TS-checker rejected).
- Per file: `market-dates.ts` **82.5%**; `action-context.ts`, `categories.ts`, `geocoding.ts`, `slugify.ts` all **0%**.
- Runtime: ~3 minutes (M-series Mac, concurrency 4).
- HTML report: `web/reports/mutation/index.html`.

**Surviving mutants of interest:**
- `market-dates.ts` has 6 surviving mutants despite high coverage — worth a look for assertion-quality gaps, not coverage gaps.
- The 0%-score files are pure no-coverage. Real follow-up: add sibling `*.test.ts` next to each. Out of scope for T065 (which is tooling-only).

**Workflow gates:**
- [x] M2 code-review — pending PM run before commit (per rebuild rule 3).
- [n/a] M3 a11y review — no UI surface.
- [n/a] M4 deploy checklist — no migration; local-only script.
- [x] DEVIATIONS.md entry appended.

**PM commit summary:**

*web repo* — branch `t65`, one commit, message `T065: Stryker mutation testing on src/lib/`:
```
web/.gitignore
web/BUILD-LOG.md
web/CLAUDE.md
web/package-lock.json
web/package.json
web/stryker.config.mjs
web/tsconfig.stryker.json
web/vitest.config.ts
web/vitest.stryker.config.ts
```

*parent repo* — message `docs(pipeline): T065 mutation-testing ticket + DEVIATIONS + safety standard`:
```
development/DEVIATIONS.md
development/tickets/T065-mutation-testing-stryker.md
standards/safety.md
```

(Move ticket to `development/tickets/done/` after PM commits, then paste commit hashes back here.)

