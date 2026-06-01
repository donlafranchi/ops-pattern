---
id: how-t073a-sell-locations-column-fix
purpose: T073 fix-forward — SellCta + sellCreateLocationAction reference wrong locations columns.
layer: how
status: complete
---

# T073a: Sell-side `locations` column-name fix-forward

**Scenario:** [`planning/now/scenario-F036-member-creates-business-group-via-sell-walkthrough.md`](../../planning/now/scenario-F036-member-creates-business-group-via-sell-walkthrough.md) (T073 fix-forward; same Then-clauses)
**Status:** Complete
**Bundle:** b1
**Depends on:** T073 (the original ship)

## Why

The F036 fixture seed (`evals/fixtures/F036-maya.ts`, landed 2026-06-01 by `test` skill) was the first writer to consult the live `locations` schema. It surfaced that the original T073 code referenced `locations.display_name` — a column that does not exist. The real column is `label` per `supabase/migrations/007_locations.sql`. The T073 unit tests mocked the supabase chain and never exercised the actual SQL, so the bug shipped clean.

Two surfaces hit:

1. **`src/components/sell/SellCta.tsx`** — anchor-Location picker fetch.
2. **`src/app/you/sell/actions.ts` `sellCreateLocationAction`** — inline-add insert; additionally omitted the `slug` + `geography` NOT NULL columns and the FK `member_id`.

Without this fix the F036 eval breaks at first beat (anchor-Location picker empty no matter what; inline-add raises on NOT NULL).

## Acceptance Criteria

- [x] `SellCta` queries `locations` with `id, label` (not `display_name`) and filters by `member_id`.
  _Why: schema source of truth per 007_locations.sql. The original `display_name` reference produced 200-OK-with-null-data from PostgREST (column doesn't exist → null projection); the picker silently rendered empty._
- [x] `sellCreateLocationAction` inserts the complete required column set: `member_id`, `kind`, `label`, `slug`, `geography`.
  _Why: 007_locations.sql declares all five as NOT NULL. Original insert violated three of them on first call. Slug derived from label with random suffix to satisfy global UNIQUE; geography defaults to midtown-Sacramento WKT for the b1 floor (no map picker yet)._
- [x] Unit test added in `SellCta.test.tsx` that captures `.select()` arg so the wrong column name would fail. Regression guard for the next reader.
- [x] All 43/43 src/ vitest tests GREEN.
- [x] `npm run check:action-layer` OK.
- [x] BUILD-LOG.md + DEVIATIONS.md + ticket Completion updated.

## Notes

- Pattern: T073a follows the same letter-suffix convention as T071a (a fix-forward for T071's M4 punch list). Same-scenario; no new spec.
- The `sellCreateLocationAction` adds an optional `geographyWkt` argument for callers that have a coord. The current `SellWalkthrough` doesn't pass one — that's a downstream UX improvement (map picker), not in T073a scope.
- M2 self-review on the diff: PROCEED. The fix is mechanical schema-alignment; no design-call surface.
- M3: no a11y surface touched.
- M4: web bundle change only; no migration.

## Completion

Date: 2026-06-01
Commit: `ae3b448` (web, branch `t073a`) → merged as `bc92524`; `01a9e29` (parent, main)

**Summary.** Two-file fix-forward (SellCta locations query + sellCreateLocationAction insert) + one regression test. 43/43 src/ vitest GREEN. Action-layer OK. No migration.
