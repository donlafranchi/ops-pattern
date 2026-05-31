---
id: how-deviations
purpose: Per-ticket log of implementation-vs-spec drift across the build.
layer: how
status: active
---

# DEVIATIONS.md — Implementation Drift Log

When implementation diverges from spec, log it here with context.

## Rotation policy

Fulfills `pipeline-process-audit-2026-05-22.md` **R6** — the audit's E2 finding (605-line single file, unreadable in one pass, no archive policy). Mirrors `JOURNAL.md`'s pattern.

- **Live file** carries entries for the **current rebuild phase** only.
- **At each phase boundary**, the PM rotates closed-phase entries to `development/archive/DEVIATIONS-phase-{N}.md` and resets the live file's TOC.
- **Soft cap on live file:** ~400 lines. `pipeline-router` flags above that.
- **Empty entries are still mandatory** per the rebuild rule — a one-line "no deviations" with a `Why:` qualifies as an entry.
- **Archive index:** a short table below links every archived phase file.

## Archive

| Phase | Tickets covered | File |
|---|---|---|
| Phase 1 (substrate floor + b1.x sprint close) | T041 → T066 | [`archive/DEVIATIONS-phase-1.md`](archive/DEVIATIONS-phase-1.md) |

---

## Phase 2 entries

## 2026-05-31 — T068 — Stryker test-runner scope fix

**Deviation:** Two items.

1. **T065 too-broad exclude — `flag-for-spec-revision`.** T065's `vitest.stryker.config.ts` excluded the entire `tests/**` directory to dodge 12 DB-bound `migrations-*.test.ts` failures. The blanket exclude also dropped the pure-logic suites in `tests/` that already cover the files Stryker mutates (`places-resolve-path.test.ts`, `reverse-geocode.test.ts`, `geocoding.test.ts`, `slugify.test.ts`, etc.). Result: the T065 baseline (30%) misread "tests not being run" as "tests don't exist." Disposition: **corrected-in-T068** — narrowed exclude to `tests/migrations-*.test.ts`. Post-fix baseline: 58.05% total.

2. **5 pre-existing stale test files surfaced — `deferred-to-T069`.** Widening Stryker's include surfaced 5 stale assertion failures that also fail under plain `npx vitest run tests/` (not Stryker-isolation, pre-existing bugs):
   - `tests/auth-signup-route-t044.test.ts` — frozen "5 migrations" list, dir has 22.
   - `tests/ci-conformance-json.test.ts`
   - `tests/ci-enforcement-rule-1.test.ts`
   - `tests/ci-enforcement-rule-4.test.ts`
   - `tests/eval-bootstrap.test.ts`

   Each added to `vitest.stryker.config.ts` exclude with `// stale — T069` suffix for a clean grep target. Disposition: **deferred-to-T069** (fix assertions, remove excludes).

**Why:** T068's scope was config-narrowing + re-baseline. Fixing 5 unrelated stale tests in the same ticket would have been scope creep; quarantining them without note would have violated the "do not silently quarantine" rule. Each named entry + DEVIATIONS pointer keeps the trail visible.

**Impact:** `npm run mutate` now exercises the real test suite. Residual 0% on `action-context.ts` (sentinel Proxy, low-ROI) and `categories.ts` (static data + 1-line fallback) are honest gaps, not artifacts of test runner config.

**Escalation:** None. Build agent applied the config change; T069 is a follow-up ticket for the stale assertions.

**Resolution:** Config landed in `vitest.stryker.config.ts`. New baseline captured in T068 Completion + BUILD-LOG.

---

## 2026-05-30 — T067 — No deviations

**Deviation:** None against spec. All 12 listed workflow.md files updated with identical Final Report block; CLAUDE.md § Report shape, playbook entry, and AGENTS.md cross-ref landed exactly as scoped.

**Why:** No skill needed a custom report shape — the template applies uniformly. The build/workflow.md "You produced" replacement preserved the surrounding Hand off context. No drift surfaced during execution.

---

**Format:**

```markdown
## {Date} — {Ticket} — {Title}

**Deviation:** {What differs from spec}

**Reason:** {Why}

**Impact:** {What changes for downstream?}

**Escalation:** Escalated to {Planning / Product}

**Resolution:** {How was it resolved?}
```

(Log entries as they occur)
