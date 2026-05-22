> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T039: Item page rendering + share-link action (gathering kind)

**Scenario:** `planning/scenarios-backlog/F018-brian-declares-run-club.md`
**Review:** `planning/reviews/F018-review.md`
**Status:** Open
**Bundle:** b1
**Serves:** Loop 1 (Find your people), Loop 4 (Gather regularly); canonical example: Run Club at Drake's
**Depends on:** T038 (publish flow creates the page's data)

**Scope change (2026-05-08):** This ticket originally included a "Print QR card" action that generated a downloadable PDF for the gathering. That action has been **removed** — QR cards are reserved for vendor-booth onboarding only (Loop 7). Gatherings share by URL. The ticket is now Item-page rendering plus a share-link affordance. The QR PDF format spec dependency is dropped.

## Acceptance Criteria

- [ ] Route `/i/[slug]` renders the public Item page; works for unauthenticated visitors (no sign-in wall)
- [ ] For `kind=gathering`, page shows: title, description, **next occurrence in human form** (e.g., "Thursday, May 14, 6:00 PM" — computed from RRULE + venue tz), location with map pin and address, hashtag chips (clickable to `/h/[hashtag]`)
- [ ] `<NextOccurrence>` helper computes the next future occurrence from `recurrence_rule` (RRULE string) + `starts_at` in the venue's tz. Tests: `FREQ=WEEKLY;BYDAY=TH` + current Wednesday 8pm returns Thursday 6pm
- [ ] "Share link" affordance copies the canonical `/i/[slug]` URL to the clipboard (using the Clipboard API) and shows a brief "Copied" confirmation
- [ ] On mobile (touch viewport), the same affordance invokes `navigator.share()` if available, falling back to clipboard copy
- [ ] No tracking parameters appended to the canonical URL (people-first stance)
- [ ] Tests: render Run Club page anonymously, assert all fields present, assert "Share link" button present and triggers clipboard write of the canonical URL
- [ ] BUILD-LOG.md updated

## Notes

The earlier `@react-pdf/renderer` dependency proposed for QR PDF generation is no longer needed. Do not add it.

The canonical URL must contain no query parameters and no tracking codes — people-first stance.

## Completion

Date:
Commit:
