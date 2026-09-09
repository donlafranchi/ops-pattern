---
id: F059
title: A newcomer browses one surface, of Pages and gatherings
status: approved
date: 2026-09-10
depends: [F061]
approved: 2026-09-10 — rewritten to the Page model per DECISIONS.md 2026-09-09
---
## Story

A newcomer opens the app and lands on one browse surface — Pages and gatherings, nearest-first, with search, kind filters, and a map toggle in the thumb zone. They filter to "This weekend" and "Events"; results narrow without reordering. A friend's shared link opens scoped to Midtown with their filters intact; back-navigation returns to the same scroll position.

## Acceptance

1. `/` shows one merged surface (search, filters, map) with no separate Explore tab; `/explore` redirects preserving query params.
2. Filtering narrows the result set without ever re-ordering what's already server-ranked.
3. The place switcher actually moves a signed-in member's feed (today it's inert for them).
4. Results are scoped to the active metro, with a named fallback for a member outside every seeded metro.
5. Browse drops past-dated gatherings and shows each Page's own name, not a business-only brand label.

## Not this

The bottom-anchored chrome rework (carries today's top-anchored search row as a stated, accepted violation for one release). Hood-band ranking inside the metro. Server-side filtering beyond the fetched page.
