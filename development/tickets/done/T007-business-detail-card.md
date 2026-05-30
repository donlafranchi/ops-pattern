---
id: how-t007-business-detail-card
purpose: Ticket T007 — business detail card.
layer: how
status: reference
---

# T007: Business Detail Card

**Scenario:** planning/scenarios/F002-business-detail-card.md
**Status:** Complete
**Completed:** 2026-04-09T19:09:58-07:00

## Acceptance Criteria

- [x] Tapping a pin on the map opens a detail card that slides up from the bottom (mobile) or appears as a side panel (desktop)
- [x] Card displays: business name, address (street, city, state), category, ownership tier badge (colored dot + label), owner story/about text
- [x] Card displays support count and support button (button wired in T010)
- [x] Card displays "Report a concern" button (wired in T011)
- [x] Card displays "Share" button (copies URL, wired in T009)
- [x] Ownership badge colors match pin colors exactly
- [x] PE/corporate listings show parent company name and location count
- [x] Mission-driven listings show certification type or rationale
- [x] Business with no story: story section is absent, not empty
- [x] Long story: truncated with "Read more" link
- [x] Unauthenticated user: support and report buttons show "Sign in to support" / "Sign in to report" prompt
- [x] Tests passing
- [x] BUILD-LOG.md updated

## Notes

Create:
- `src/components/BusinessDetailCard.tsx` — the card component
- `src/components/OwnershipBadge.tsx` — colored dot + tier label, reusable

The detail card is a shared component used on both the map view (slide-up) and the full listing page (T009). Build it to accept a `business` prop.

Badge labels with descriptions for each tier:
- Independent: "Locally owned and operated"
- Co-op: "Worker or member owned"
- Local Franchise: "Locally owned franchise"
- Challenger: "Competing against market consolidation"
- Mission-driven: "B Corp / Public Benefit Corporation"
- PE/Corporate: "Private equity or corporate owned"

Card layering: z-index above search bar. Tapping outside or swiping down dismisses it.

Support count: query `supports` table count for the business. Display as "N supporters".

## Completion

Date: 2026-04-09
Commit: 63d5efc
