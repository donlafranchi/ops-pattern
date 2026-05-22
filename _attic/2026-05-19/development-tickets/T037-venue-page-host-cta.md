> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T037: Venue-page primary CTA — "Host something here"

**Scenario:** `planning/scenarios-backlog/F018-brian-declares-run-club.md`
**Review:** `planning/reviews/F018-review.md`
**Status:** Open
**Bundle:** b1
**Serves:** Loop 1 (Find your people), Loop 4 (Gather regularly); canonical example: Run Club at Drake's
**Depends on:** Design-language doc extension (venue-page section) per F018-review EXTEND verdict

## Acceptance Criteria

- [ ] Route `/l/[slug]` (venue page) renders a `<VenueHeader>` component with the venue name, address, and a primary CTA button below the header
- [ ] Primary CTA reads exactly **"Host something here"** and uses the existing `<PrimaryButton>` component from the design language
- [ ] CTA is visible above the fold on mobile (~640px viewport) — verified by snapshot test
- [ ] Tapping the CTA opens the gathering composer drawer (T038) with the venue pre-attached as the location
- [ ] If the user is unauthenticated, tapping the CTA navigates to `/sign-in?return=/l/[slug]?compose=gathering`
- [ ] Tests: render Drake's venue page, find the CTA by accessible name, tap it, assert the composer opens with `location_id` pre-filled
- [ ] BUILD-LOG.md updated

## Notes

The design language addition (venue-page header + primary-CTA placement) must land as a doc update before this ticket starts. Once it lands, follow the spec exactly — do not invent a new CTA position or button variant.

Slug for Drake's is `drakes-the-barn`. Use that for the test fixture.

## Completion

Date:
Commit:
