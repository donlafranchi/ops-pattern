> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T036: `item.published` event + `discoverable_items` refresh trigger

**Scenario:** `planning/scenarios-backlog/F018-brian-declares-run-club.md` (still in backlog — moved to `scenarios/` after EXTEND clears)
**Review:** `planning/reviews/F018-review.md`
**Status:** Open
**Bundle:** b1
**Serves:** Loop 1 (Find your people), Loop 4 (Gather regularly); canonical example: Run Club at Drake's
**Depends on:** T030 (items spine schema), T031 (item kind tables schema), T033 (item-event-log schema), T035 (discoverable_items view)

## Acceptance Criteria

- [ ] `item_events` table accepts a new event type literal: `item.published` (extend the CHECK constraint or enum, per migration `011_item_event_log.sql`)
- [ ] Trigger `on_item_published_refresh_discoverable` on `item_events` fires when an `item.published` row is inserted; refreshes the `discoverable_items` materialized view CONCURRENTLY (so it doesn't block reads)
- [ ] Helper SQL function `publish_item(item_id uuid)` that atomically (a) updates `items.state` from `'draft'` to `'published'`, (b) appends an `item.published` event, (c) lets the trigger fire
- [ ] Tests: insert a draft item, call `publish_item`, assert (1) state changed, (2) event row exists, (3) `discoverable_items` includes the item within the next read
- [ ] BUILD-LOG.md updated

## Notes

The materialized view refresh is the slowest part of publish. CONCURRENTLY refresh keeps reads non-blocking but requires a unique index on the view (already in T035). Confirm the index exists before merging.

The 60-second SLA in the F018 scenario translates to: trigger fires synchronously inside the transaction, view refresh runs asynchronously via NOTIFY/LISTEN or a job queue. At b1 we can do synchronous refresh — view is small at MVP scale. Switch to async at T2 when traffic grows.

## Completion

Date:
Commit:
