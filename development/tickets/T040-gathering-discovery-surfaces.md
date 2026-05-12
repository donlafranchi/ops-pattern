> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T040: Gathering surfaces in venue page + locality-first index

**Scenario:** `planning/scenarios-backlog/F018-brian-declares-run-club.md`
**Review:** `planning/reviews/F018-review.md`
**Status:** Open
**Bundle:** b1
**Serves:** Loop 1 (Find your people), Loop 3 (Land here), Loop 4 (Gather regularly); canonical example: Run Club at Drake's, Newcomer in Bryte
**Depends on:** T036 (refresh on publish), T037–T039 (publish path producing the data)

## Acceptance Criteria

- [ ] `/l/[slug]` venue page shows a "What's happening here" section listing all `kind=gathering` items at this location with `next_occurrence` in the next 30 days, sorted by next occurrence
- [ ] Locality-first home (`/`) supports a "this week" filter that surfaces gathering Items within ~10 miles whose next occurrence falls in the next 7 days, sorted per `discovery.md` T1 score (proximity + time-to-event)
- [ ] Both surfaces query `discoverable_items` only — never base tables on the anonymous read path
- [ ] Anonymous users can view both surfaces without sign-in
- [ ] Tests: publish a recurring gathering at Drake's via the publish flow (T036+T038), within 60s assert it appears (1) on Drake's venue page, (2) on `/` with the "this week" filter applied
- [ ] BUILD-LOG.md updated

## Notes

The 60-second SLA is the F018 acceptance bar. T036's synchronous-refresh approach should hit it comfortably at b1 scale. If the eval is flaky, it's a refresh-trigger issue — escalate to T036, do not loosen the test.

## Completion

Date:
Commit:
