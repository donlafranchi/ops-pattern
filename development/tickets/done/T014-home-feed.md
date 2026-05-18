# T014: Home Feed — Etsy-style Modular Layout

**Scenario:** planning/scenarios/F008-home-feed.md
**Status:** Complete
**Completed:** 2026-04-24T09:40:49-07:00

## Acceptance Criteria

- [ ] Root route `/` renders the home feed for all users (authenticated + guest)
- [ ] Top app bar: sticky on scroll, contains search field, heart icon (→ `/following`), avatar (→ `/you`)
- [ ] Market pill below top bar: shows "Your Market: [Name]" or "Select your market"; tapping opens market selector (stub button in T014, wired in T015 to F009 modal)
- [ ] Module 1 — **Hero**: fetch the vendor with `is_featured = true` ordered by `featured_at DESC`, render full-width card with cover image, name, tagline, "View Vendor" CTA
- [ ] Module 2 — **Shop by Category**: 8-tile grid (2×4 on mobile), fixed curated imagery per slug, tap → `/explore?category={slug}`
- [ ] Module 3 — **Vendors near you**: horizontal-scroll rail of vendor cards, fetched by proximity to user location OR selected market; 5–10 items; "See all" → `/explore`
- [ ] Module 4 — **Markets near you**: horizontal rail of market cards (name, next date, vendor count)
- [ ] Module 5 — **From vendors you follow**: authenticated users with ≥1 follow only; horizontal rail showing each followed vendor's next upcoming market appearance
- [ ] Module 6 — **Recently viewed**: authenticated users with view history only; stored in `vendor_views` table (create if needed) OR localStorage for b1 simplicity
- [ ] Guest first-time visitor: thesis statement "Every dollar you spend here stays here." renders beneath hero banner
- [ ] Each module renders its own skeleton loader and fails independently (module-level error boundaries)
- [ ] No map on this page
- [ ] Tests: each module renders given its data shape, rails scroll horizontally, category tile navigates with correct query param, market pill opens selector
- [ ] BUILD-LOG.md updated

## Notes

Use Next.js App Router server components for initial data fetch; client components for the horizontal rails (scroll interaction).

Curated category imagery goes in `public/categories/{slug}.jpg` — source 8 stock photos or use simple SVG illustrations for b1.

"Recently viewed" for b1: use localStorage array of vendor IDs (last 10), hydrated client-side after mount. Server-side persistence is b2.

The old map page at `/` moves to `/map` as a temporary route so existing evals/smoke tests don't break. It will be absorbed into `/explore` in T015.

## Completion

Date: 2026-04-24
Commit: 8c6b2bd
