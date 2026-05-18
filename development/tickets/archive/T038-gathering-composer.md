> **STALE 2026-05-09 — pending re-write under the corrected migration plan.** This ticket pre-dates ADR-6/7/8/9/10/11, the new `member.md`, the AI-native floor (Phase 0), and the post-audit ticket re-sequencing. Do **not** implement as written. The corrected plan is in [`/notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md); the per-ticket disposition list is in [`/planning/PIPELINE-AUDIT.md`](../../planning/PIPELINE-AUDIT.md) and the ticket-audit findings in `JOURNAL.md` (2026-05-09 entry). Re-write via `pipeline-ticket` against the corrected plan once Phase 0 (action layer skeleton, system Member, audit fields, pgvector) lands.

# T038: Gathering composer drawer + publish flow

**Scenario:** `planning/scenarios-backlog/F018-brian-declares-run-club.md`
**Review:** `planning/reviews/F018-review.md`
**Status:** Open
**Bundle:** b1
**Serves:** Loop 1 (Find your people), Loop 4 (Gather regularly); canonical example: Run Club at Drake's
**Depends on:** T036 (`publish_item` SQL function), T037 (venue page CTA opens this drawer)

## Acceptance Criteria

- [ ] `<GatheringComposer>` component renders inside the existing `<Drawer>` from the design language
- [ ] Asks "What kind of thing?" with three radio options in user language: **one-time event**, **recurring gathering**, **open meetup**. (NEVER displays "Product / Service / Gathering / Wonder" labels.) All three map internally to `kind=gathering` with different schedule patterns
- [ ] Required fields: title, description, schedule (date+time for one-time; recurrence rule via `<RecurrencePicker>` for recurring), location (pre-filled from invocation surface)
- [ ] Optional fields: capacity (number), cost (number, null = free), what to bring (text), RSVP cutoff (datetime), hashtags (`<HashtagInput>` with autocomplete from existing `item_hashtags`)
- [ ] `<RecurrencePicker>` component (new — see design-language extension): generates an RRULE string from a friendly "every Thursday at 6pm" UI
- [ ] `<HashtagInput>` autocomplete hits a new endpoint `GET /api/hashtags/suggest?q={prefix}` returning the top 10 most-used hashtags with that prefix
- [ ] Submit flow: validate → call `POST /api/items/gathering` server action → server inserts spine row, child row, `item_locations`, `item_hashtags`, calls `publish_item(id)` → returns the new slug → client redirects to `/i/[slug]`
- [ ] Loading state during submit: spinner + "Publishing…" text on the submit button (button disabled)
- [ ] Error state: toast with message + retry option. On retry, re-runs the same payload
- [ ] Validation: title required, description required, location required, recurrence start in the future (not the past). Inline error messages
- [ ] Tests: open composer, fill required fields for recurring, submit, assert (1) spine row, (2) gathering row with RRULE, (3) `item.published` event, (4) navigated to `/i/[slug]`. Plus negative test: past start date → validation error, no insert
- [ ] BUILD-LOG.md updated

## Notes

The composer is shared across all "host a gathering" entry points (venue page, Maker page "things you host", later /you "host something"). Keep `<GatheringComposer>` decoupled from the surface — it accepts `defaultLocationId` as a prop.

`<RecurrencePicker>` and the design-language additions for venue-page CTAs are prerequisites tracked in F018-review.md EXTEND verdict.

The autocomplete endpoint should cap result count and not allow `q=''` to dump the whole hashtag table.

## Completion

Date:
Commit:
