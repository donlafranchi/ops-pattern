---
id: how-t046-locations-rls-fixes
purpose: Ticket T046 — locations rls fixes.
layer: how
status: reference
---

# T046 — Locations RLS fix-forward (`008_locations_owner_read.sql`)

**Scenario:** Fix-forward from T045 M2 code-review. Three corrective items the review surfaced as spec divergences or robustness gaps.
**Status:** Complete
**Completed:** 2026-05-11T12:38:05-07:00
**Bundle:** b1
**Depends on:** T045 (`007_locations.sql`)

**Serves:**
- **Loop:** All five loop families. Same surface as T045 — Locations are the "where" of every Item.
- **Canonical example:** Maya's home-kitchen Location stored with `discoverability='private'` so her residential address isn't in the proximity index. Today's RLS prevents Maya from reading her own row back — this ticket closes that gap.
- **Primitive shape:** unchanged from T045. Schema-correctness fix.

## Workflow gates (mandatory during the rebuild phase)

- [ ] **M2 — `engineering:code-review`** invoked on the T046 diff before `pipeline-eval` (run mode).
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies.
- [x] **DEVIATIONS.md entry** appended at ticket close — single entry covering all three corrective items.

## Acceptance Criteria

### Migration `web/supabase/migrations/008_locations_owner_read.sql`

**New RLS policy on `public.locations`:**

- [ ] `create policy locations_owner_read on public.locations for select using (member_id = auth.uid() and deleted_at is null);` — completes the RLS matrix per `product/systems/location.md` line 165 ("Private Locations readable only by `member_id = auth.uid()`"). Combined with the existing `locations_public_read`, owners can read all of their own non-deleted Locations (including `private`) and anyone can read non-private listed/unlisted Locations.

**Partial GIST index swap:**

- [ ] `drop index if exists idx_locations_geog;`
- [ ] `create index idx_locations_geog on public.locations using gist (geography) where deleted_at is null;` — matches `product/systems/location.md` line 136 ("create index idx_locations_geog on locations using gist (geography) where deleted_at is null;"). Soft-deleted rows no longer participate in proximity queries.

**Extended search_path on `sync_area_centroid()`:**

- [ ] `create or replace function public.sync_area_centroid()` with `set search_path = public, extensions` — defensive against Supabase's relocation of PostGIS to the `extensions` schema in newer Postgres distributions. Function body unchanged.

### Tests / build-side assertions

- [ ] `web/tests/migrations-t046.test.ts` — file-shape suite covering the three changes (~10 assertions; small ticket).
- [ ] Sandbox `node` smoke run matches the Vitest suite.
- [ ] `supabase db reset` runs cleanly with all seven migrations (001, 002, 004, 005, 006, 007, 008).
- [ ] Studio smoke verification (after build):
  - [ ] `select polname from pg_policies where tablename = 'locations';` — returns three rows (`locations_public_read`, `locations_owner_update`, `locations_owner_read`).
  - [ ] `select indexdef from pg_indexes where indexname = 'idx_locations_geog';` — confirms `WHERE` clause present.
  - [ ] `select proconfig from pg_proc where proname = 'sync_area_centroid';` — confirms `search_path=public, extensions`.
- [ ] BUILD-LOG.md updated.

## Notes

**Why a separate migration, not an amendment to 007.** Migrations are immutable once shipped, even in development. `supabase db reset` re-runs them in order from a fresh state, so amending 007 would work — but the audit trail is cleaner if 008 captures the corrective. T045's commit (`fab7fd9`) stays unchanged; T046's commit shows exactly what shifted post-review.

**Spec divergence from T045 ticket.** T045's acceptance criteria did not list `locations_owner_read` or the partial GIST. The ticket was implemented exactly as written. The system spec (`location.md`) was more complete than the ticket. This is a spec-divergence pattern the rebuild phase's mandatory M2 review is designed to catch — the review found it and now T046 closes it. Recorded in DEVIATIONS.

**Doxxing prevention — out of scope.** The M2 review discussion surfaced the broader doxxing problem (home addresses leaking through public Locations attached to home-based businesses). The verification-ladder design is captured in `product/exploration/locally-owned-verification.md` and queued for `pipeline-product`. T046 stays scoped to the schema-correctness fix.

## Completion

Date: 2026-05-11
Commit: 23c8c69

**What shipped:**
- `web/supabase/migrations/008_locations_owner_read.sql` — adds `locations_owner_read` policy, swaps `idx_locations_geog` to partial, rewrites `sync_area_centroid()` with `search_path = public, extensions`.
- `web/tests/migrations-t046.test.ts` — 6 file-shape assertions across two describe blocks. All passing (sandbox plain-node).

**Sandbox smoke run:** 6/6 pass.

**Commit ceremony (manual):**

```
cd web
git add supabase/migrations/008_locations_owner_read.sql tests/migrations-t046.test.ts BUILD-LOG.md
git commit -m "T046: Locations RLS fix-forward (008_locations_owner_read.sql)"

cd ..
git add development/DEVIATIONS.md development/tickets/done/T046-locations-rls-fixes.md product/exploration/locally-owned-verification.md
git commit -m "docs(pipeline): T046 close + locally-owned-verification exploration"
```

Backfill the `web/` commit hash into the `Commit:` line above.

**What the user must run locally:**
1. `cd web && supabase db reset` — applies all seven migrations cleanly.
2. Studio verification:
   - `select polname from pg_policies where tablename = 'locations';` → 3 rows (`locations_public_read`, `locations_owner_update`, `locations_owner_read`).
   - `select indexdef from pg_indexes where indexname = 'idx_locations_geog';` → confirms `WHERE` clause.
   - `select proconfig from pg_proc where proname = 'sync_area_centroid';` → confirms `search_path=public, extensions`.
