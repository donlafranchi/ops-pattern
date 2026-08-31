# T110: RLS on event-log partitions + reserved embedding tables

**Scenario:** substrate — no user-facing surface. Security hotfix surfaced by the Supabase
security advisor against the newly provisioned `socialus-db` project, 2026-08-31.
**Status:** Complete
**Bundle:** b1
**Binds to:** [`product/systems/action-layer.md`](../../product/systems/action-layer.md) — ADR-7
(action-layer-only writes) and ADR-10 (append-only event log). The gap below defeats both at
the database boundary.
**Depends on:** none. Applies against the current schema (migrations 001–034).

**Serves:**
- **Standard:** [`standards/`](../../standards/) — security. Member data protection, tier 3 of
  the lexicographic rule in [`playbooks/DECISION-PATTERNS.md`](../../playbooks/DECISION-PATTERNS.md).
- **Primitive shape:** no new entity. Closes a hole in existing substrate.

## Problem

The five `ensure_*_events_partition()` helpers (`member`, `location`, `group`, `item`, `place`)
create each monthly partition with `create table ... partition of ...` and never enable RLS on
it. A partition does **not** inherit the parent's `rowsecurity` flag, and PostgREST exposes every
`public`-schema partition as its own endpoint.

Confirmed against the live database: `anon` held **both SELECT and INSERT** on all 15 existing
partitions. The append-only audit log was directly readable and forgeable with the publishable
key, bypassing the parent tables' policies entirely.

This recurs. `rotate_*_partitions()` runs monthly and reopens the hole with each new partition —
silently, after launch, with no failing test. Patching the helpers is the load-bearing half;
the backfill only closes today's instance.

Separately, `item_embeddings` and `member_embeddings` have never had RLS enabled.

## Fix

1. Each of the five helpers gains `alter table ... enable row level security` after the
   `create table`. Idempotent.
2. Backfill RLS on existing partitions via `pg_inherits` discovery — not a hardcoded month list,
   so it stays correct however many partitions have been rotated in.
3. Enable RLS on `item_embeddings` and `member_embeddings`.
4. Add `spatial_ref_sys` to the `ALLOWLIST` in `tests/rls-coverage.test.ts`.

**No policies are added, deliberately.** RLS with zero policies is deny-all for non-bypass roles,
which is the correct end state: every legitimate read goes through the parent table where the
existing policies apply, and the action layer connects as `postgres`, which carries `BYPASSRLS`
(verified, along with `service_role`). No application code references a partition by name —
only the `format()` calls that generate them. **Reviewer note: this is intentional, not an
incomplete migration.**

`spatial_ref_sys` is deliberately untouched — owned by `supabase_admin`, so the `ALTER` fails as
`postgres`, and it holds PostGIS coordinate-system reference data with no privacy surface.
Allowlisting is the only available disposition.

## Files

- `web/supabase/migrations/035_partition_rls.sql` (new)
- `web/tests/rls-coverage.test.ts` (allowlist)

## Workflow gates (mandatory during rebuild phase)

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — N/A; no page or component.
- [x] **M4 — `engineering:deploy-checklist`** — required, this ticket carries a migration.
- [x] **DEVIATIONS entry** appended at ticket close — `development/deviations/T110.md` (3 deviations).

## Acceptance Criteria

- [x] Migration applies cleanly against the current schema (001–034 applied).
- [x] All 15 existing partitions report `relrowsecurity = true` post-migration.
- [x] `item_embeddings` and `member_embeddings` report `relrowsecurity = true` with zero policies.
- [x] `anon` can no longer SELECT or INSERT on any partition (re-check `has_table_privilege`
      alongside the RLS flag — the grant persists; RLS is what denies).
- [x] A newly rotated partition is created with RLS already enabled — verify by calling
      `public.rotate_member_events_partitions()` and checking the next month's partition.
- [x] `tests/rls-coverage.test.ts` passes with `spatial_ref_sys` allowlisted and no other entries.
- [x] Supabase security advisor reports zero `rls_disabled_in_public` findings except
      `spatial_ref_sys`.
- [x] The three `security_definer_view` advisor findings remain — they are deliberate and
      documented in `029_member_public_projections.sql`. Not in scope; do not "fix."

## Pre-apply verification (by Code, before this ticket was written)

Partition-discovery query confirmed exactly 15 partitions, all RLS-off. The DO block's control
flow was dry-run against the live database in DDL-string mode (building the statements, executing
none) and parsed clean.

## Carry-forward (separate from this ticket)

`.gitignore` gained a bare `.env*` during Vercel setup, which will silently block a future
`.env.example` from being tracked. Needs a `!.env*.example` negation. Not urgent.

## Completion

Applied 2026-08-31 against `socialus-db` (`khghdkdsicoeafyuvewl`).

**Verified on the live database:**
- Tables with RLS disabled: **1** (`spatial_ref_sys`, allowlisted). Was 18.
- Partition tables with RLS enabled: **16/16**. The 48 `pg_inherits` rows still showing
  `rowsecurity = false` are partitioned *indexes*, where the flag is meaningless — checked
  explicitly by `relkind`, not assumed.
- `item_embeddings` / `member_embeddings`: RLS on, **0 policies** — the intended deny-all.
- Recurrence fixed: `ensure_member_events_partition('2026-11-01')` produced
  `member_events_y2026m11` with `relrowsecurity = true` at creation.
- Security advisor `rls_disabled_in_public`: **18 → 1**. The 3 `security_definer_view` ERRORs
  remain and are deliberate (documented in `029_member_public_projections.sql`). The 18 new
  INFO-level `rls_enabled_no_policy` notices are the intended end state, not a regression.
- `anon` still *holds* the SELECT/INSERT grant on partitions — RLS is what denies the rows.
  Revoking the grants as well would be belt-and-braces; not done, flagged as optional.

**`tests/rls-coverage.test.ts` passes** — run 2026-08-31 with `DATABASE_URL` pointed at
`postgres.khghdkdsicoeafyuvewl` (verified as the correct project before running). Confirmed the
test actually executed rather than silently skipping: with `DATABASE_URL` unset the same command
reports `1 skipped`; with it set, `1 passed`. This test is `describe.skipIf(!DATABASE_URL)`, so a
bare `npm test` will always report it green-by-absence — it needs the env var to mean anything.

**Migration ledger repaired** (deviation 1 closed). `supabase migration repair` was run by the
PM; the remote ledger now reads `001`–`035` with `035 partition_rls` and no stray timestamp row,
matching the local filenames.
