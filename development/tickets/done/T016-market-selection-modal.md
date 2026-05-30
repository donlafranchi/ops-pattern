---
id: how-t016-market-selection-modal
purpose: Ticket T016 — market selection modal.
layer: how
status: reference
---

# T016: Market Selection Modal

**Scenario:** planning/scenarios/F009-market-selection.md
**Status:** Complete
**Completed:** 2026-04-24T09:40:49-07:00

## Acceptance Criteria

- [ ] Component `src/components/MarketSelector.tsx` — a bottom sheet (mobile) / modal (desktop) opened from the market pill
- [ ] Uses upward-opening animation from the pill's position per F013 cross-cutting rule (the pill is at the top, so it animates down — but any bottom-anchored invocation opens upward)
- [ ] Search field at top filters the list by market name or city
- [ ] Each market row: name, "City, State", schedule (days + hours), vendor count
- [ ] Sorted by distance from user (nearest first) if location available; else alphabetical
- [ ] "Near You" section (within 25 mi) shown above "Other Markets" when location available
- [ ] Tapping a market closes the modal, updates market pill, and filters feed/explore to that market
- [ ] Market selection persists:
  - Authenticated: stored in `user_preferences(user_id, selected_market_id)` table or on the profile row
  - Guest: stored in localStorage under `msm.selectedMarketId`
- [ ] Opening selector when a market is already selected pre-highlights it and shows a "Clear" option
- [ ] One-market-in-area: auto-suggest on first visit with a prompt ("Looks like you're near [Name] — set as your market?")
- [ ] React context `MarketContext` provides `selectedMarket` + `setSelectedMarket` to the whole app
- [ ] Guest market migrates to user profile on sign-up
- [ ] Tests: list renders seeded markets, search filters, selection updates context and persists, guest→auth migration works
- [ ] BUILD-LOG.md updated

## Notes

Use Radix UI `Dialog` with `<Dialog.Content>` positioned as a bottom sheet on mobile (via Tailwind classes) and centered modal on desktop.

Distance calculation: Haversine between user coords and market coords, client-side. If geolocation denied, omit distance and fall back to alphabetical.

Auto-suggest runs once per device (flag stored in localStorage) to avoid pestering.

## Completion

Date: 2026-04-24
Commit: 8c6b2bd
