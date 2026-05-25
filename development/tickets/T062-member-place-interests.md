# T062: `member_place_interests` table + action handlers

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, Lane B wave 1)
**Depends on:** T058 (FK → places); T061 retiring affinities not strictly required (parallel-safe — different table) but order so migration numbers stay clean.

**Serves:**
- **Spec:** [`product/systems/member.md`](../../product/systems/member.md) § Place-interest scope.
- **ADRs:** [ADR-0021](../../planning/adrs/ADR-0021-member-geography-substrate-split.md) (Ratified 2026-05-23), [ADR-0007](../../planning/adrs/ADR-0007-action-layer.md), [ADR-0010](../../planning/adrs/ADR-0010-events-from-day-one.md).
- **Sprint:** [`planning/bundles/b1x-substrate-sprint.md`](../../planning/bundles/b1x-substrate-sprint.md) § B2.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main.
- [ ] **DEVIATIONS.md entry** appended at close.

## Acceptance Criteria

- [ ] New migration `web/supabase/migrations/018_member_place_interests.sql`.
- [ ] `public.member_place_interests` table: composite PK `(member_id, place_id, scope_kind)`. Columns: `member_id uuid not null references public.members(id) on delete cascade`, `place_id uuid not null references public.places(id) on delete restrict`, `scope_kind text not null check (scope_kind in ('primary_home','secondary'))`, `created_at timestamptz not null default now()`, `removed_at timestamptz null`, `metadata jsonb not null default '{}'::jsonb`.
- [ ] Unique partial index: `CREATE UNIQUE INDEX uniq_primary_home_active ON public.member_place_interests (member_id) WHERE scope_kind='primary_home' AND removed_at IS NULL`.
  _Why: ADR-21 absolute — at most one active `primary_home` per Member. The partial index enforces it at the DB level so a buggy action handler can't double-write. Encodes ratified absolute: ADR-21 absolutes ratified 2026-05-23 ([`planning/history/intent-ADR-21-and-spec-patches-2026-05-23-recheck.md`](../../planning/history/intent-ADR-21-and-spec-patches-2026-05-23-recheck.md))._
- [ ] Btree index `(member_id, scope_kind) WHERE removed_at IS NULL` for Member-scoped reads.
- [ ] RLS enabled. **`member_place_interests_owner_read`** policy: `USING (member_id = auth.uid())`. **No INSERT/UPDATE/DELETE policies** — action-layer-only writes per ADR-7.
  _Why: ADR-21 owner-only at row level. Encodes ratified absolute: ADR-21 Consequences (recheck CLEAN 2026-05-23). The retired table (T061) was the prior owner of this absolute; ownership transfers here._
- [ ] Extend `public.member_events` `event_kind` CHECK to include `member.place_interest_added`, `member.place_interest_removed`, `member.place_interest_promoted`, `member.place_interest_demoted`. (Promoted = secondary→primary_home with atomic swap of prior primary; demoted = primary_home→secondary, which only happens during a promotion swap.)
  _Why: events-from-day-one (ADR-10). Promotion is a two-row mutation (atomic swap) but emits one logical event per row affected — keeps the event log a faithful log of what happened._
- [ ] New action handlers under `web/src/actions/member/`:
  - `place-interest-add.ts` — `member.place_interest.add` — inputs `{ placeId, scopeKind: 'primary_home' | 'secondary' }`. Validates: place exists + not deleted; for `primary_home` swaps the existing primary to secondary in the same transaction; for `secondary` enforces the ≤5 active secondaries guard (count of active secondaries for this member; reject with `ConflictError('member.place_interest.secondary_limit_exceeded')` at the 6th).
    _Why: ≤5 is a tuneable cap (soft commitment per ADR-21 / member.md § Place-interest scope Intent). Encoded as an action-layer constant `SECONDARY_LIMIT = 5`, not a DB check, so it can be raised without a migration._
  - `place-interest-remove.ts` — `member.place_interest.remove` — `{ placeId, scopeKind }`. Soft-remove (set `removed_at = now()`). Idempotent on already-removed.
  - Barrel-export from `web/src/actions/member/index.ts`.
- [ ] Vitest: `tests/member-place-interests-schema.test.ts` — column shape, the partial unique index rejects a second active `primary_home`, the FK to places rejects a bad id, RLS matrix (owner sees own rows; second auth member does not see them; anon does not see them).
- [ ] Vitest: `tests/member-place-interests-handlers.test.ts` — (a) add primary_home with no existing primary → 1 row; (b) add primary_home when one exists → 1 active primary (the new one), 1 active secondary (the demoted one), both events emitted in one transaction; (c) add 6th secondary → `ConflictError`; (d) remove sets removed_at and emits event; (e) re-add after remove resurrects (insert a fresh row with new created_at).
- [ ] `npm run check:action-layer && npm run lint && npm test` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- Promotion atomic swap pattern: within `withTransaction`, `UPDATE ... SET scope_kind='secondary' WHERE member_id=$1 AND scope_kind='primary_home' AND removed_at IS NULL`, then `INSERT ... scope_kind='primary_home'`. Emit `member.place_interest_demoted` for the old, `member.place_interest_added` for the new. The unique partial index is *deferred-immediate* friendly — without DEFERRABLE, the swap order matters; do the UPDATE first.
- Encodes ratified absolutes (Gate B captures):
  - ADR-21 `member_place_interests` owner-only RLS → `planning/adrs/ADR-0021-member-geography-substrate-split.md:65` (ratification cite via recheck file).
  - At-most-one `primary_home` → ADR-21 + `member.md § Place-interest scope` Intent.
- No URL surface ships with this ticket — the `/you/locality` page is F029 (b1.2 surface). Substrate only.

## Completion

Date:
Commit:
