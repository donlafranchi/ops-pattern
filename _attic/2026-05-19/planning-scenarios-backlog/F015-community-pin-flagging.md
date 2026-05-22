# Scenario: Community Pin Flagging — Users flag incorrectly placed pins

**Feature:** F015 (product/systems/vendor-self-service.md)
**Severity:** Important
**Bundles:** b2

## Acceptance Criteria

### Given
- A business listing exists on the map with a placed pin
- A logged-in user is viewing the business detail card (F002)

### When
- The user taps "Report a problem" (or similar) on the detail card

### Then
- A bottom sheet or modal appears with flagging options:
  - "Wrong location" (pin is in the wrong place)
  - "Business closed or moved"
  - "Other issue"
- If the user selects "Wrong location":
  - An optional text field appears: "Where should this pin be?" (free text, e.g., "It's actually on 5th and Main")
  - A submit button sends the flag
- On submit:
  - The flag is recorded: `pin_flags` table with business_id, user_id, flag_type, note, created_at
  - The user sees a confirmation: "Thanks — we've let the owner know."
  - The user cannot flag the same business again for the same issue within 30 days

### And When
- A business owner views their dashboard and has ≥1 location flag

### Then
- A notification/badge appears: "[N] people flagged your location"
- Tapping opens a review screen showing:
  - Current pin on a map
  - List of flag notes (anonymized — no usernames shown)
  - "Update location" button that opens the drag-to-correct flow (same as F014 adjust mode)
- After the owner updates, all existing "wrong location" flags for that business are resolved/cleared

### And When
- A business accumulates ≥3 unresolved "wrong location" flags

### Then
- The pin gets a subtle visual indicator on the map (e.g., a small warning dot or dimmed opacity) — visible to all users
- The owner receives an email notification (if email is on file) in addition to the dashboard badge

### And When
- A guest (not logged in) views the business detail card

### Then
- The "Report a problem" option is not shown (must be authenticated to flag)

## Edge Cases

- User flags their own business: allowed — this is a valid way for an owner to remind themselves to fix the pin
- Business with no owner account (community-submitted listing): flags accumulate but there's no owner to notify — flags surfaced in admin review (T3)
- Rapid flag spam from one user: 30-day cooldown per business per flag type prevents abuse
- Owner resolves flags but pin is still wrong: users can re-flag after the 30-day cooldown
- Flag note contains inappropriate content: stored as-is in b2; moderation is b3

## Assumptions

- The "Report a problem" button is added to the existing business detail card layout (F002)
- Pin flags are stored in a new `pin_flags` table, not in the existing community signals (hearts/concerns) — different purpose and lifecycle
- Owner dashboard already exists from F003 registration — this adds a notifications section
- Email notification uses the same email channel as auth (Supabase)
- The 3-flag threshold for visual indicator is configurable (not hardcoded)
- Anonymous flagging is not allowed — authentication prevents drive-by abuse

## Comments

This is the community-powered accuracy layer. It works because users who visit a business in person will immediately notice if the pin is wrong — and now they have a low-friction way to report it. The owner notification loop means most flags self-resolve without any admin intervention.

The visual indicator at ≥3 flags is a gentle pressure mechanism — it signals to the owner that people are noticing, and signals to consumers that the location may not be exact.
