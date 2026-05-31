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

## 2026-05-31 — T070 — Groups lifecycle_state + draft handlers — M2 trail

**Verdict:** M2 `engineering:code-review` returned **REQUEST CHANGES** with 2 criticals + 7 suggestions. PM disposition stamped in [`planning/reviews/F036-review.md` § "T070 M2 code-review (2026-05-31)" § "PM disposition (2026-05-31)"](../planning/reviews/F036-review.md). All criticals applied pre-commit (fix-now per Rebuild Phase rule 3); three suggestions folded in the same loop; four deferred. Final state: 40/40 vitest GREEN, action-layer conformance OK, zero new tsc errors in T070 files.

### Applied — Critical #1: TOCTOU re-assertion of `lifecycle_state = 'draft'` in `update_draft` UPDATEs

**What:** Both UPDATEs in `web/src/actions/group/update-draft.ts` now carry `AND lifecycle_state = 'draft'` in their WHERE clauses — the `groups` UPDATE inline, the `group_businesses` UPDATE via an EXISTS subquery against the parent row. `rowCount === 0` surfaces a concurrent `group.activate` race as `ValidationError`.

**Why:** Without the re-assertion, a concurrent `group.activate` between the handler's initial `SELECT … lifecycle_state` check and the subsequent UPDATE would silently mutate an *active* row. `activate.ts` already had the symmetric guard on its own promote UPDATE; `update_draft` was missing it. Surfaced by [F036-review.md § Findings #1](../planning/reviews/F036-review.md).

**Disposition:** accepted-as-is (fold-in mandatory). Matches the TOCTOU pattern in `member.create` and `activate.ts`.

### Applied — Critical #2: Random 4-byte hex suffix on draft slugs

**What:** `web/src/actions/group/create.ts` and `update-draft.ts` append a 4-byte random hex suffix to every draft `groups.slug` value (via `node:crypto.randomBytes(4).toString('hex')`).

**Why:** `groups.slug` is `NOT NULL UNIQUE` (per migration 014_groups.sql line 51). Two Members opening the Sell walkthrough concurrently with the same brand name would collide on the second INSERT with Postgres 23505. ADR-22's user-visible random-suffix scheme applies to *activated* rows; draft rows need their own collision avoidance because they hit the same UNIQUE constraint. Draft slugs aren't publicly addressable (RLS hides drafts), so the user-facing shape is irrelevant — what matters is no 23505. Surfaced by [F036-review.md § Findings #2](../planning/reviews/F036-review.md).

**Disposition:** accepted-as-is (fold-in mandatory). The user-visible final slug for activated Groups is a follow-up patch on `group.activate` per ADR-22 — flagged for the next pass; this ticket's responsibility ends at the draft state machine.

### Folded — Suggestion #3: `group.member_removed` removed from migration's CHECK

**What:** Migration `023_groups_lifecycle_state.sql` previously extended `group_events.event_kind` CHECK with `'group.member_removed'`. The extension has been reverted; the CHECK now lists only the kinds with a producer in T070's scope. Inline note in the migration directs the future `group.member_remove` handler ticket to extend the CHECK in its own migration.

**Why:** Per [F036-review.md § Findings #3](../planning/reviews/F036-review.md), pre-creating an event slot without a producer is misleading and risks an orphan kind in the CHECK. One-line edit; free window before commit.

**Disposition:** accepted-as-is (fold-in suggestion).

### Folded — Suggestion #5 + #7: Extracted `GROUP_KINDS` + `DRAFT_NAME_PLACEHOLDER` to `src/actions/group/constants.ts`

**What:** New file `web/src/actions/group/constants.ts` exports `GROUP_KINDS` (closed enum of the six kinds) + `GroupKind` type + `DRAFT_NAME_PLACEHOLDER`. `create.ts` and `activate.ts` now import from `./constants` instead of declaring locally.

**Why:** Per [F036-review.md § Findings #5 + #7](../planning/reviews/F036-review.md), the kind list duplicated the migration's `groups.kind` CHECK and was referenced from multiple handlers; the placeholder was duplicated between `create.ts` and `activate.ts`. Single source of truth pre-empts schema drift if a new kind ever lands.

**Disposition:** accepted-as-is (fold-in suggestion).

### Deferred — Suggestions #4, #6, #8, #9

Per [F036-review.md § PM disposition](../planning/reviews/F036-review.md):

- **#4** — Owner-check race comment in `update-draft.ts` is theoretical at b1 (no `group.member_remove` handler exists). Add the comment when that handler lands.
- **#6** — Conditional `UPDATE` after `INSERT` for `anchor_location_id` in `create.ts` is one extra DB round-trip per draft create on a low-traffic path. Not worth re-running M2.
- **#8** — Cleaner test-context construction via `makeContext` helper is low-value polish.
- **#9** — `create.ts` hardcoding `lifecycle_state = 'draft'` is YAGNI; flag when a real caller needs `'active'` at create time.

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
