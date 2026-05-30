---
purpose: M4 deploy-checklist for the b1.x substrate sprint merge to main.
layer: how
status: retired
retired_on: 2026-05-30
retired_from: operations/deploy-checklist-b1x.md
---

# Deploy checklist — b1.x substrate sprint

**Date:** 2026-05-25
**Branch:** `t65`
**Target:** `main` (web repo)
**Scope:** T058–T064 (5 migrations + 5 action handlers + 1 SECURITY DEFINER PG function + 1 Next.js route + 11 test files)

## Pre-merge gates

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | All sprint migrations apply cleanly on a fresh `supabase db reset` | ✅ | Verified 2026-05-25; 22 migrations 001–022 applied without error. |
| 2 | `member_events.event_kind` CHECK rewrite chain is order-safe (018 → 019 → 021) | ✅ | Each rewrite is `drop if exists` + `add`. The retire (021) is intentional final state; 018/019 deliberately include the two retired kinds in their intermediate-state allow-list. |
| 3 | `npm run check:action-layer` clean | ✅ | 148 files scanned; 35 protected tables (was 32 + the 4 new — `places`, `place_events`, `member_place_interests`, `member_saved_searches` — minus the retired `member_location_affinities`); 0 violations. |
| 4 | `npx tsc --noEmit` clean for new files | ✅ | Sprint TS files compile clean. |
| 5 | `npx vitest run` on sprint files | ✅ | 107/107 green (5 migration shape + 2 action shape + reverse-geocode + resolve-path). |
| 6 | `npx playwright test evals/phase-1` against local Supabase | ✅ | 181/181 green (includes the 5 new specs: places, member-place-interests, member-saved-searches, reverse-geocode, place-routing). |
| 7 | M2 code review (engineering:code-review) | ✅ | 2 medium findings auto-fixed (existence-vs-auth leak on saved_search update/remove); 5 suggestions logged in DEVIATIONS. Verdict: Approve. |
| 8 | DEVIATIONS entries per ticket | ✅ | Sprint-wide block under § 2026-05-25; per-ticket sub-sections T058 / T059 / T060 / T061 / T062 / T063 / T064. |
| 9 | BUILD-LOG.md updated | ✅ | Sprint progress rows + summary block landed. |
| 10 | STAGE-LEDGER stamped | ✅ | Substrate row at `build-substrate-landed`; doc-patch logged. |

## Production migration prerequisites

**The remote Supabase project (`fuwfeijembuuhfnpomcy.supabase.co` per `web/.env.local`) MUST receive all 22 migrations BEFORE the web deploy lands.** If the deploy beats the migrations, the app will 500 on any path that touches the new tables (`/p/...`, `/you/...` once those land).

| Step | Action |
|---|---|
| P1 | Apply migrations 001–022 to prod Supabase. The user's typical practice (per `web/INFRASTRUCTURE.md`) is to run SQL scripts in the Supabase Studio SQL Editor in order, OR `supabase db push` against the prod project. |
| P2 | Re-run `npm run eval:bootstrap` against prod **only if** the prod environment intends to run evals (typically not). The bootstrap inserts the eval helpers (`eval_*` functions) and is local-only by guard. Skip in prod. |
| P3 | Confirm prod `auth.users` does NOT have orphan members referencing `member_location_affinities`. (The DROP cascades nothing — no FK from `member_location_affinities` to anything that survives — but if prod somehow has rows in this table, they will be lost. Verify via: `select count(*) from public.member_location_affinities`. If zero, safe. If non-zero, escalate to PM before applying 021.) |

## Schema-change risk assessment

| Change | Lock impact | Backfill | Rollback |
|---|---|---|---|
| `017_places.sql` | CREATE TABLE — no lock on existing tables. Seed inserts 9 rows. | n/a (new table) | DROP TABLE places CASCADE. |
| `018_member_place_interests.sql` | CREATE TABLE + partial unique index — no existing-table lock. | n/a (new table) | DROP TABLE member_place_interests. |
| `019_member_saved_searches.sql` | CREATE TABLE + 3 indexes + 1 trigger — no existing-table lock. | n/a (new table) | DROP TABLE member_saved_searches. |
| `020_items_made_at.sql` | ADD COLUMN with DEFAULT 'none' on `items`. Postgres ≥ 11 supports this as metadata-only (no row rewrite). ADD CONSTRAINT with VALIDATE walks rows. At b1 `items` row count = 0 locally; production count assumed low. | DEFAULT 'none' backfills existing rows automatically. | DROP COLUMN + DROP CONSTRAINT. |
| `021_retire_member_location_affinities.sql` | DROP TABLE — exclusive lock briefly. Drops 3 SECURITY DEFINER functions first. | Data loss if prod has rows (see P3). | NON-TRIVIAL — recreating the table requires re-applying T049's SQL. The PM ratified the retirement 2026-05-25; rollback would require restoring from a pre-021 snapshot. |
| `022_places_reverse_geocode.sql` | CREATE OR REPLACE FUNCTION — no lock. | n/a (function only) | DROP FUNCTION place_for_coords. |

## Environment variables

No new required vars. `MAPBOX_GEOCODING_TOKEN` is **optional** — the reverse-geocoder gracefully returns `null` when absent (Mapbox fallback skipped). When the polygon library is populated at b2, Layer 1 (polygon containment) covers most queries.

| Var | Required? | Where | Notes |
|---|---|---|---|
| `MAPBOX_GEOCODING_TOKEN` | Optional at b1.x | Server only (`process.env`) | Server-side token, distinct from `NEXT_PUBLIC_MAPBOX_TOKEN`. Configure separately in Vercel for the prod environment. Do NOT reuse the public Mapbox token (different rate/billing surface). |

## Known limits flagged in DEVIATIONS

- **Next.js routing constraint** (§ T060): the catch-all `/p/[...slug]/page.tsx` cannot have static segments after it. When b1.1 ships Groups under place URLs, the dispatch must fold into the same page.tsx.
- **TOCTOU on secondary cap** (§ T062): low-severity Member-scoped race; resolved when contention surfaces.
- **`created_at` resets on resurrect** (§ T062): trade-off acknowledged; first-ever history available through the event log.
- **Pre-existing `migrations-tXXX.test.ts` brittle pattern** broken since T055 — not introduced by this sprint, independently fixable.

## Rollback plan

If a production issue surfaces post-deploy:

1. **Web rollback (fast):** revert the web repo merge commit. Next.js redeploys to the previous build. Substrate stays in place — readers don't break.
2. **Schema rollback (slow):** prod DBA applies inverse migrations 022 → 017 in reverse order. Migration 021 cannot be inversely scripted (re-creating `member_location_affinities` from T049's SQL is manual). Acceptable because the table has no active consumers.

## Sign-off

- [ ] PM confirms migrations applied to prod Supabase **before** the web deploy.
- [ ] PM ratifies the `member_location_affinities` drop is safe against current prod data (P3).
- [ ] PM merges branch `t65` → `main`.
- [ ] PM monitors error rate for ~30 min post-deploy.
