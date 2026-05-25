# T061: Retire `member_location_affinities` table + functions

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, Lane B wave 0 — parallel-safe with A1)
**Depends on:** —

**Serves:**
- **Spec:** ADR-21 § *Supersedes* (retires the table installed by ADR-16); [`planning/rebuild-plan.md`](../../planning/rebuild-plan.md) b1 rule 7.
- **ADRs:** [ADR-0021](../../planning/adrs/ADR-0021-member-geography-substrate-split.md) (Ratified 2026-05-23), [ADR-0016](../../planning/adrs/ADR-0016-affinity-row-privacy.md) (fully superseded).
- **Sprint:** [`planning/bundles/b1x-substrate-sprint.md`](../../planning/bundles/b1x-substrate-sprint.md) § B1.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main (DROP-table migration).
- [ ] **DEVIATIONS.md entry** appended at close.

## Acceptance Criteria

- [ ] New migration `web/supabase/migrations/021_retire_member_location_affinities.sql`. Contents (in this order):
  1. `drop function if exists public.member_is_local_to_location(uuid, uuid)`
  2. `drop function if exists public.count_likes_for_location(uuid)`
  3. `drop function if exists public.count_followers_for_location(uuid)`
  4. `drop table if exists public.member_location_affinities`
  _Why: functions drop first because they may reference the table; CASCADE on the drop-table would also work but explicit ordering keeps the migration self-documenting._
- [ ] Retire dead event kinds from `member_events` CHECK if present — grep migrations for `member.location_affinity_added`/`removed`. If found in an active CHECK, the migration must rewrite the CHECK (Postgres CHECK is not partially droppable — `alter table ... drop constraint` then `add constraint` with the trimmed list).
  _Why: T056 was the last to touch CHECK constraints; T049 may have left this event-kind in `member_events`. Cosmetic dead enums can be left in DEVIATIONS notes, but **only if** no consumer asserts against them — the floor eval may. Check before assuming cosmetic._
- [ ] Retire `web/evals/phase-1/members-affinities.spec.ts` — full delete. The test file was T049's eval; the table it tests is gone.
- [ ] Patch `web/evals/phase-1/floor.spec.ts` — remove `"member_location_affinities"` from the table-presence list (line 97) and the ADR-16 cite list (line 131). Remove the cite-comment at line 67.
- [ ] Patch `web/evals/phase-1/members-interests-follows.spec.ts:131` — the comment cites the affinities table by analogy; rewrite the comment to cite `member_place_interests` (T062) instead, OR delete the comment if its content is purely historical.
- [ ] Vitest: `tests/retire-affinities.test.ts` — assert (via `information_schema`) that the table does not exist; assert that the three functions do not exist (`pg_proc` lookup).
- [ ] Full Phase 1 eval suite passes after the migration: `npm run eval -- --grep "phase-1"` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- The sprint doc verified "nothing FK-references it; the 3 SECURITY DEFINER functions are defined only in `011` and have no callers in `web/src`." Independent grep at ticket-time confirmed: only `web/evals/` references the table — the action-handler layer was never wired to `member.location_affinity.*` events (the planned handlers per `011_member_location_affinities.sql:80-82` were never written). Clean DROP.
- The cosmetic stale comment in `002_members.sql` / `010_member_interests_follows.sql` (if any) referencing the affinities table can be patched in a follow-up doc-housekeeping ticket, NOT this one. Migrations are append-only; rewriting old migration comments is out-of-band.
- Encodes ratified absolutes: ADR-21's "private Member-geography substrates are owner-only at the row level" is **enforced by absence** in this ticket — the dropped table is the prior owner of that absolute; ownership transfers to T062 (`member_place_interests`).

## Completion

Date:
Commit:
