# T007: Business Detail Card

**Scenario:** planning/scenarios/F002-business-detail-card.md
**Status:** Open

## Acceptance Criteria

- [ ] Tapping a pin on the map opens a detail card that slides up from the bottom (mobile) or appears as a side panel (desktop)
- [ ] Card displays: business name, address (street, city, state), category, ownership tier badge (colored dot + label), owner story/about text
- [ ] Card displays support count and support button (button wired in T010)
- [ ] Card displays "Report a concern" button (wired in T011)
- [ ] Card displays "Share" button (copies URL, wired in T009)
- [ ] Ownership badge colors match pin colors exactly
- [ ] PE/corporate listings show parent company name and location count
- [ ] Mission-driven listings show certification type or rationale
- [ ] Business with no story: story section is absent, not empty
- [ ] Long story: truncated with "Read more" link
- [ ] Unauthenticated user: support and report buttons show "Sign in to support" / "Sign in to report" prompt
- [ ] Tests passing
- [ ] BUILD-LOG.md updated

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

Date:
Commit:
