# T051 — Action layer CI enforcement: four structural rules

**Scenario:** None. Direct security hardening on ADR-7 / `product/systems/action-layer.md`. Source: audit conversation 2026-05-12 against the McKinsey/Lily failure mode (22-of-200 endpoints shipped without auth; SQL injection vector). The action-layer spec already commits to these protections in prose; this ticket lands the CI assertions that enforce them.
**Status:** Ready for build (pipeline-review PROCEED after revisions 2026-05-12)
**Bundle:** b1 (Phase 0 hardening — extends T043's conformance script)
**Depends on:** T043 (action-layer scaffold), T044 (auth signup hook). All current write paths must go through `web/src/actions/` before this ticket lands, OR each pre-action-layer route must be added to the exemption list with a `// action-layer:exempt` annotation and a follow-up ticket to migrate it. Agent: verify by running the existing `npm run check:action-layer` and resolving any violations before starting Rule 2 work.

**Serves:**
- **Loop:** All five (substrate). This ticket is the structural defense that keeps every loop's write path on the action layer when the codebase grows beyond what a solo founder can hold in their head.
- **Primitive shape:** None directly. Operates on the action-layer substrate per ADR-7.
- **Failure mode this prevents:** the exact pair from the McKinsey/Lily incident — (a) unauthenticated endpoints that write to production, (b) SQL injection through string-concatenated queries. Both are spec-prohibited today; this ticket makes them build-fail.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode).
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — N/A (no migration; pure tooling).
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations."

## Background — what already exists

Read before starting:

1. `product/systems/action-layer.md` — the full ADR-7 ratification. Specifically: § "Policy posture" (closed-world catalog), § "T1 — MVP Tier" (CI assertion line), § "What this rules in and rules out."
2. `web/src/actions/_lib/handler.ts` — `defineHandler` factory; Zod validation is already un-bypassable.
3. `web/src/actions/_lib/db.ts` — the only sanctioned `pg.Pool` instance.
4. `web/scripts/check-action-layer-conformance.ts` — T043's grep-based conformance script. This ticket *extends* it, doesn't replace it.

The four rules below are additive to T043's existing check (which forbids direct `.from(...).insert/update/delete/upsert(` outside the action layer). Together they form the full McKinsey-failure-mode protection.

## Acceptance Criteria

### Rule 1 — No service-role / raw-pg imports outside `_lib/`

The ESLint config forbids any code path outside `web/src/actions/_lib/` from acquiring a credential or connection that bypasses RLS or the action-layer transaction wrapper.

- [ ] Add ESLint rule (`no-restricted-imports` + `no-restricted-syntax`) in `web/eslint.config.mjs`:
  - [ ] Disallow `import ... from 'pg'` outside `web/src/actions/_lib/**` and `web/scripts/**`.
  - [ ] Disallow references to `process.env.SUPABASE_SERVICE_ROLE_KEY` outside `web/src/actions/_lib/**`, `web/scripts/**`, and `web/supabase/migrations/**` (migrations may not import TS but the grep applies anyway — keep the rule scoped to `.ts`/`.tsx` files).
  - [ ] Disallow `import { createClient } from '@supabase/supabase-js'` outside `web/src/actions/_lib/**` and `web/src/lib/supabase-server.ts` (the existing session-bound client). The bare `createClient` is the service-role escape hatch; force it through one file.
- [ ] Update `web/src/lib/supabase-server.ts` if it currently re-exports a service-role client; the service-role client moves to `web/src/actions/_lib/supabase-admin.ts` (new file). `supabase-server.ts` keeps only session-bound clients.
- [ ] Tests (Vitest, `web/tests/ci-enforcement-rule-1.test.ts`):
  - [ ] **Positive**: running `npx eslint web/src` on the current `main` passes (after the rule is added — adjust any sanctioned import locations first).
  - [ ] **Negative**: write a temp file `web/src/__lint_probe__/probe-rule-1.ts` that imports `pg`, run `npx eslint web/src/__lint_probe__/probe-rule-1.ts` (flat config is auto-loaded from `web/eslint.config.mjs`; do not pass `--no-eslintrc` — that flag is legacy-config-only and errors under flat config). Expect non-zero exit and the rule name (`no-restricted-imports`) in stderr along with the probe path. Wrap the run in `try { ... } finally { fs.unlinkSync(probePath) }` so the probe is deleted even if assertions throw. Commit only the passing state.

### Rule 2 — Every non-GET API route must import from `@/actions/`

A `route.ts` under `web/src/app/api/**` that exports any of `POST | PUT | PATCH | DELETE` must contain an `import ... from '@/actions/...'` statement. This is the structural answer to McKinsey's 22-of-200 unauthenticated endpoints: a route physically cannot write without going through a handler that requires an `ActionContext`.

- [ ] Extend `web/scripts/check-action-layer-conformance.ts` with a second check (`checkRouteHandlerImports`):
  - [ ] Glob `web/src/app/api/**/route.ts`.
  - [ ] For each file, parse the export list (regex is acceptable at Phase 0 — `export\s+(const|async\s+function)\s+(GET|POST|PUT|PATCH|DELETE)`).
  - [ ] If any of POST/PUT/PATCH/DELETE is exported, assert the file contains a line matching `from\s+['"]@/actions(/|['"])`.
  - [ ] Allow per-file exemption via top-of-file comment annotation: `// action-layer:exempt — {reason}`. Exempt files are logged but pass.
  - [ ] Maintain an exemption ledger at `web/scripts/action-layer-exemptions.json` listing each exempt route with `{ path, reason, expires_at, follow_up_ticket }`. CI fails if a file annotation exists without a ledger entry, or if `expires_at` is in the past.
- [ ] Initial exemption ledger entries — populate by running `npm run check:action-layer` after T044 has landed and Rule 2 is wired. For each route the new rule flags, decide per the "Migration path for old routes" section below: prefer delete; only add a ledger entry if the route must survive this ticket. The ledger lands only entries for routes that survive — never placeholder `TBD-*` follow-up-ticket names (those would themselves fail validation). If every flagged route is deletable, the ledger ships empty.
- [ ] Exemption ledger entry schema (validated by the conformance script):
  - [ ] `path` — string, repo-relative path to the `route.ts`.
  - [ ] `reason` — non-empty string, ≥ 10 chars.
  - [ ] `expires_at` — ISO-8601 date string. Missing, malformed, or in the past → fail.
  - [ ] `follow_up_ticket` — string matching `T\d{3}` (an existing ticket). Missing or non-matching → fail.
- [ ] Wire the new check into the existing `npm run check:action-layer` script — same exit code, same CI integration.
- [ ] Tests (`web/tests/ci-enforcement-rule-2.test.ts`):
  - [ ] **Positive**: the check passes on the current tree (after pre-populating the ledger).
  - [ ] **Negative — missing import**: create temp file `web/src/app/api/__probe__/route.ts` exporting a `POST` handler with no `@/actions/` import. Run `npm run check:action-layer`. Expect exit code 1 and the probe path in stderr. Delete probe.
  - [ ] **Negative — annotation without ledger entry**: same probe with a `// action-layer:exempt — testing` annotation but no ledger entry. Expect exit code 1. Delete probe.
  - [ ] **Positive — annotation with ledger entry**: same probe with annotation AND a temp ledger entry (mutate `action-layer-exemptions.json`, run the check, restore the ledger). Expect exit code 0. Restore ledger and delete probe.

### Rule 3 — RLS on every public table

Belt-and-suspenders. Even if Rules 1 and 2 are bypassed somehow, RLS at the DB layer is the floor.

- [ ] New Vitest integration test `web/tests/rls-coverage.test.ts`:
  - [ ] Connects to the local Supabase DB using `DATABASE_URL` (the same one `_lib/db.ts` uses).
  - [ ] Runs `select tablename from pg_tables where schemaname = 'public' and rowsecurity = false`.
  - [ ] Allowance list (these tables may legitimately have RLS disabled — keep tight):
    - [ ] None at Phase 0. Every public table — `members`, `member_events`, `member_interests`, `member_follows`, `member_location_affinities`, `locations`, `location_*`, future `items`, `groups` — must have RLS enabled.
  - [ ] Test fails if the query returns any row not in the allowance list.
- [ ] Add the test to the existing CI Vitest run; do not create a new CI job.
- [ ] If the test fails on current `main`, that is a **stop-and-escalate** condition — do not silently enable RLS on tables without a policy attached. Log the failing tables to DEVIATIONS.md and surface to the PM. (Per `member.md`'s ownership-only RLS posture and ADR-16, every existing table should already have RLS enabled with a policy. If it doesn't, that's a real gap, not a tooling gap.)

### Rule 4 — No template-literal SQL with interpolations

Prevents SQL injection via string-concatenated queries. Parameterized `$1, $2` is the only sanctioned write path.

- [ ] Extend `web/scripts/check-action-layer-conformance.ts` with a third check (`checkParameterizedQueries`):
  - [ ] Glob `web/src/**/*.ts` and `web/src/**/*.tsx`.
  - [ ] Match the pattern `\.(query|rpc)\s*\(\s*`` — i.e., `.query(` or `.rpc(` followed by an opening backtick.
  - [ ] For each match, examine the template literal between the backticks. If it contains `${` (any interpolation), flag it.
  - [ ] Allow exemption via inline comment on the same line as the `${...}` interpolation, with required form: `// sql-injection-safe: enum-constrained by {TypeName}` — the annotation MUST name the TypeScript union or enum that constrains the interpolated identifier. A bare `// sql-injection-safe: trust me` passes the regex but defeats the rule; the conformance script rejects annotations whose payload does not match `enum-constrained by [A-Z][A-Za-z0-9_]+`.
  - [ ] The only legitimate use is interpolating table or column identifiers from a closed TypeScript union type (Postgres cannot parameterize identifiers).
  - [ ] Allowed-identifier whitelist: `_lib/event-log.ts`'s table-name interpolation. Constrain the parameter type to a named union (e.g., `type EventTableName = 'member_events' | 'item_events' | ...`) and annotate the interpolation `// sql-injection-safe: enum-constrained by EventTableName`. Code review verifies the union is exhaustive against the schema.
- [ ] Tests (`web/tests/ci-enforcement-rule-4.test.ts`):
  - [ ] **Positive**: the check passes on the current tree (after annotating `_lib/event-log.ts`).
  - [ ] **Negative**: create temp file with `client.query(\`select * from t where id = ${'${userInput}'}\`)`. Run the check. Expect exit code 1. Delete probe.
  - [ ] **Positive — sanctioned annotation**: same probe with `// sql-injection-safe: enum-constrained` on the line. Expect exit code 0. Delete probe.
  - [ ] **Positive — proper parameterization**: `client.query(\`select * from t where id = $1\`, [userInput])`. Expect exit code 0.

### Documentation

- [ ] Add a "CI enforcement" subsection to `product/systems/action-layer.md` § "Policy posture" — three sentences referencing this ticket. The substance is unchanged; this just makes the existing prose claim ("CI assertion: no service-role SQL writes from controllers") legible.
- [ ] Add `web/CLAUDE.md` § "Writing a new API route" — short checklist: parameterize all SQL; non-GET routes import from `@/actions/`; service-role lives only in `_lib/`. One paragraph, no nesting.
- [ ] Update `BUILD-LOG.md` per the standard T-ticket pattern.

## Tests — full inventory

The tests above are itemized per rule; restating here for the agent's TDD planning. All four test files live in `web/tests/`:

- `ci-enforcement-rule-1.test.ts` — ESLint positive + negative (probe).
- `ci-enforcement-rule-2.test.ts` — Route-import positive + 3 negative variants (probe).
- `rls-coverage.test.ts` — pg_tables RLS coverage; runs against the local DB.
- `ci-enforcement-rule-4.test.ts` — SQL interpolation grep positive + 3 negative variants (probe).

Each probe file goes under `web/src/__lint_probe__/` or `web/src/app/api/__probe__/` and is created + deleted within the test. Wrap every probe lifecycle in `try { /* write probe, run check, assert */ } finally { fs.rmSync(probePath, { force: true }) }` so a failed assertion never leaves a probe in the tree (which would break subsequent test runs and CI). Probe directories themselves stay out of git (add to `.gitignore`).

## Notes

**Why now, not at b2.** Every additional API route makes this more expensive to retrofit. At Phase 0 the surface is one handler (`member.create`) and a handful of pre-rebuild routes slated for deletion. The four rules cost about half a day to write; retrofitting them after 30+ handlers ship doubles or triples that. The rebuild plan's deletion of old routes is the right moment.

**The bonus rule from the audit (route manifest with declared auth posture) is intentionally not in this ticket.** It's worth revisiting at b2 once route count exceeds ~15. Adding it now is over-engineering — the four rules here close the McKinsey failure mode without it.

**Do not refactor existing handlers in this ticket.** Scope is CI enforcement only. If Rules 1/4 surface legitimate violations in `_lib/`, fix in place (one-line annotation or move to `_lib/`); do not refactor handler bodies. If a violation is non-trivial, stop and escalate per `AGENTS.md` — log to DEVIATIONS.md, open a follow-up ticket, do not silently work around.

**Migration path for old routes.** Routes under `src/app/api/admin/`, `src/app/api/vendor/`, `src/app/api/bulletins/` predate the action layer and are slated for deletion per `notes/migration-to-primitives.md` § "What we delete from current `web/`." The pragmatic path:
1. If the route is in the deletion list AND has no in-flight feature work, delete it now in this ticket. Cleaner than exempting.
2. If the route is still serving a surface that exists today (admin panel, vendor bulletins), add to the exemption ledger with `expires_at` set to the rebuild's Phase 1 completion target and a `follow_up_ticket` field. Migrate in a separate ticket.

Agent: when in doubt, prefer delete over exempt. The exemption ledger is a temporary scaffold, not a long-term home.

**ESLint config syntax.** `web/eslint.config.mjs` is the flat-config format (ESLint 9+). `no-restricted-imports` and `no-restricted-syntax` both work in flat config. Reference: https://eslint.org/docs/latest/rules/no-restricted-imports. For path-based scoping ("only forbid in files outside `_lib/`"), use ESLint's `files` / `ignores` selectors on the config object, not inline conditionals.

**RLS test against local DB.** The Vitest test needs a live Postgres. Locally: `supabase start` first. In CI: the existing CI Postgres service should already be up for the T043 tests. If not, add a `services.postgres` block to the CI workflow; do not introduce a separate test-database container.

**Failure messages matter.** When a probe fires the rule, the error message the agent sees must name the rule and the file. A generic "ESLint error" or "check failed" is not enough — the failure-under-deadline scenario is exactly when the agent needs to know what to fix without re-reading the spec. Test the failure message text explicitly in the negative tests.

**Commit hygiene.** Per the root `CLAUDE.md` § Commit Rules: single commit on close, one-line message, no body. Use `T051: action layer CI enforcement (four rules)`. If incremental local commits help during development, squash before push — do not ship a multi-commit history.

## Completion

Date: _(filled in by build agent)_
Commit: _(filled in by build agent — list each rule's commit hash)_

**What landed:**

_(filled in by build agent)_

**What the user must run locally to verify:**

```bash
cd web
npm install
npm run check:action-layer    # all four checks; expect "OK"
npm test -- ci-enforcement    # Vitest probes for Rules 1, 2, 4
npm test -- rls-coverage      # Rule 3 (requires `supabase start`)
npm run lint                  # ESLint config picks up Rule 1
```

**Exit criteria the PM verifies before closing:**

- [ ] All four `npm` commands pass on the current tree.
- [ ] The exemption ledger (`web/scripts/action-layer-exemptions.json`) lists every routes-side exemption with an `expires_at` and `follow_up_ticket`.
- [ ] `product/systems/action-layer.md` § "Policy posture" references this ticket.
- [ ] `web/CLAUDE.md` § "Writing a new API route" exists.
- [ ] DEVIATIONS.md entry appended.
