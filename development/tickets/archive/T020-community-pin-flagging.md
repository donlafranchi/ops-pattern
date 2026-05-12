# T020: Community Pin Flagging

> **ARCHIVED 2026-05-09 — superseded by the primitives migration.** Per the ticket audit: operates on `businesses`; the flagging mechanic is closer to Loop 8/12 stewardship than to b1's reachable loops. Self-marked "b2 scope" in original Notes. Re-consider at b2 against `locations` once moderation surfaces designed alongside `member.md` open questions land.

**Scenario:** planning/scenarios/F015-community-pin-flagging.md
**Status:** Archived

## Acceptance Criteria

- [ ] New table `pin_flags`: id, business_id, user_id, flag_type (enum: `wrong_location`, `closed_moved`, `other`), note (text, nullable), resolved_at (timestamptz, nullable), created_at
- [ ] Unique constraint: one unresolved flag per user per business per flag_type within 30 days
- [ ] RLS: authenticated users can insert own flags; owners can read flags on their businesses; flags not publicly readable
- [ ] "Report a problem" button on business detail card — visible to authenticated users only, hidden for guests
- [ ] Bottom sheet with flag type selector + optional note field + submit button
- [ ] On submit: insert flag, show confirmation toast "Thanks — we've let the owner know"
- [ ] Owner dashboard: notification badge showing "[N] people flagged your location" when ≥1 unresolved `wrong_location` flag exists
- [ ] Flag review screen: shows current pin on map + anonymized flag notes + "Update location" button
- [ ] "Update location" opens drag-to-correct map (reuse draggable pin from T019)
- [ ] On owner pin update: resolve (set `resolved_at`) all unresolved `wrong_location` flags for that business
- [ ] Visual indicator: pins with ≥3 unresolved `wrong_location` flags get a subtle warning dot overlay on the map
- [ ] Flag threshold (3) stored as app config constant, not hardcoded in queries
- [ ] Email notification to owner when flag count reaches threshold (use existing Supabase email setup)
- [ ] Tests: flag creation, 30-day cooldown enforcement, owner resolve flow, visual indicator threshold, guest cannot flag
- [ ] BUILD-LOG.md updated

## Notes

This is b2 scope. Depends on T019 (draggable pin component is reused for owner correction flow).

The `pin_flags` table is separate from community signals (hearts/concerns from F005) — different lifecycle and purpose.

The visual indicator for flagged pins should be minimal — a small colored dot at the bottom-right of the pin, not a full pin style change. Don't alarm consumers; just signal that accuracy may be off.

Owner dashboard already exists from registration flow. This adds a new section/tab for location flags.

## Completion

Date:
Commit:
