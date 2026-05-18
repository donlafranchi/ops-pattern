# T010: Support Button (Heart)

**Scenario:** planning/scenarios/F005-support-button.md
**Status:** Complete
**Completed:** 2026-04-09T19:26:22-07:00

## Acceptance Criteria

- [x] Authenticated user sees a heart button on the business detail card
- [x] Tapping heart toggles support: filled/active state, count increments by 1
- [x] Tapping again removes support: unfilled state, count decrements by 1
- [x] Support is persisted to the `supports` table (user_id + business_id)
- [x] Support state is remembered across sessions (heart shows filled if user previously supported)
- [x] Unauthenticated user taps support: prompted to sign in
- [x] Rapid toggling is debounced — only final state is persisted
- [x] Support count displays correctly on the detail card
- [x] Tests passing
- [x] BUILD-LOG.md updated

## Notes

Create:
- `src/components/SupportButton.tsx` — heart toggle component
- `src/hooks/useSupport.ts` — manages support state, optimistic UI updates, Supabase mutations

Optimistic UI: update the heart state and count immediately on tap, then persist to Supabase. If the mutation fails, revert.

Query pattern:
- Check if current user has supported: `select from supports where user_id = X and business_id = Y`
- Toggle on: `insert into supports`
- Toggle off: `delete from supports where user_id = X and business_id = Y`
- Count: `select count(*) from supports where business_id = Y`

Debounce: 500ms after last tap before sending the mutation. Track pending state to avoid double-submits.

The heart should feel warm and responsive — instant visual feedback, no waiting for server round-trip.

## Completion

Date: 2026-04-09
Commit: e1b1e95
