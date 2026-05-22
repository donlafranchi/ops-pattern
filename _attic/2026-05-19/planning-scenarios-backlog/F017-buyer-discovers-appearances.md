# Scenario: Buyer Discovers Appearances — Sees upcoming dates on a producer profile and a market's lineup

**Feature:** F017
**Severity:** Important
**Bundles:** b1

## Acceptance Criteria

### Given
- One or more vendors have `vendor_appearances` rows (or qualify under the default-attending rule from F016)
- Upcoming `market_session` events exist for the next ~30 days
- A buyer is browsing the app (authenticated or not — appearances are public)

### When
- The buyer views a vendor profile (F011)

### Then
- An **"Upcoming appearances"** section appears on the profile, between the Market Schedule section and the About section
- The section lists the vendor's next 1–3 confirmed appearances, ordered soonest first
- Each appearance row displays:
  - Day + date (e.g., "Sat May 2")
  - Market name (e.g., "Folsom Farmers Market")
  - Time window (e.g., "8am–1pm")
  - One-off badge if `is_one_off = true` (small "Pop-up" or "One-off" tag)
  - Optional vendor note inline if present (e.g., "Bringing the waffle cart!")
- Tapping an appearance row opens the corresponding market session view (deep-linked market detail at that date)

### And When
- A vendor has no upcoming appearances (no affiliations, all skipped, or no future sessions)

### Then
- The section header is hidden entirely (no empty-state copy on the public profile)
- The Market Schedule section above still renders normally if the vendor has affiliations

### And When
- The buyer views a market detail page (F009 or successor) for an upcoming session

### Then
- A **"This Saturday's lineup"** section (label adapts to the next session's day, e.g., "This Wednesday's lineup") shows the vendors confirmed for that session
- The lineup grid/list shows each vendor as a card:
  - Vendor photo (or initials placeholder)
  - Vendor name
  - Up to 3 product category chips
  - One-off badge if applicable
- The lineup is sorted: regular affiliated vendors first (alphabetical), one-offs last
- A category filter chip-row at the top of the lineup lets the buyer narrow to a single category (e.g., "Bread", "Coffee")

### And When
- The buyer scrolls past the next session on a market detail page

### Then
- Subsequent upcoming sessions appear stacked below (e.g., "Sat May 9", "Sat May 16"), each with its own lineup
- Each session lineup is collapsed by default (vendor count + "Tap to expand") past the next one
- The next session is always expanded

### And When
- The buyer views a past market session (via deep link, history, or scrolling back)

### Then
- The lineup shows the vendors who were confirmed at that historical session
- A "Past" badge is visible at the top of the section
- Vendor cards are still tappable and link to the current vendor profile
- This supports the **rediscovery** job: the buyer remembers a market day, scrolls the lineup, recognizes the cart

### And When
- The buyer is following a vendor with an upcoming appearance within 3 days

### Then
- The home feed (F008) surfaces a card: "[Vendor Name] is at [Market] this [Day]"
- Tapping the card opens the vendor profile, scrolled to the Upcoming appearances section
- (Email notification logic is owned by F012; this scenario only covers the in-app feed surface)

## Edge Cases

- **Market session with zero confirmed vendors:** lineup section shows "Vendor list updates closer to market day" — never an empty grid
- **One-off vendor at an unaffiliated market:** appears in that market's lineup with a "Pop-up" badge; the vendor's profile shows the same appearance with the same badge
- **Vendor skipped a session their followers expected:** their card simply doesn't appear in that session's lineup; no "skipped" indicator surfaces to buyers (intentional — skip is a private signal between vendor and platform)
- **Long category chip list on a vendor card:** truncate to 3 chips, no "+more" expander on lineup cards (keeps the grid scannable)
- **Two markets same day, vendor at both:** the vendor appears in both lineups; their profile lists both appearances stacked
- **Buyer on slow connection:** lineup loads progressively — vendor cards lazy-render as they scroll into view
- **Duplicate appearances (data integrity bug):** dedupe on (vendor_id, event_id) at render time; the unique constraint on `vendor_appearances` should prevent this server-side

## Assumptions

- The Upcoming appearances section on the profile is a **new** section additive to F011, not a replacement for the Market Schedule section. Schedule = recurring pattern; Appearances = specific upcoming dates with vendor confirmation.
- Market session views (the destination of appearance rows) may be a new sub-route like `/markets/[slug]/sessions/[date]`, or the market detail page may simply default to showing the next session prominently with a date selector.
- Historical session retention: `events` rows for past `market_session` are not deleted; `vendor_appearances` rows for past sessions are kept indefinitely. This is a hard requirement for the rediscovery use case.
- The "next 1–3 appearances" cap on the profile is a UI default; a "See all upcoming" link can expand to a full list.
- Following-driven feed surfacing reuses F012's notification cron logic for the in-app feed card; no new scheduling primitives.

## Comments

This is the **rediscovery surface**. The buyer's primary job in this app is not "what's at the market today" — it's "I saw someone at the market and want to find them again." Two surfaces serve that job:

1. **Vendor profile** answers "I remember the name (or someone told me) — when can I see them next?"
2. **Market lineup** answers "I remember the market and the day — who was that waffle cart?"

The market lineup with historical retention is the visual memory aid that competes with "I'll just search Instagram for it." A buyer scrolls Saturday's lineup, recognizes a photo, taps in.

The category filter on the lineup is what keeps the experience usable as markets scale past ~30 vendors per session. It's also the seed of category-based recall ("there was this bread person…").

This scenario depends on **F016** for the data and **F011** for the host profile page. It extends but does not modify F009 (market detail) — the lineup section is additive.
