# T017: Vendor Profile — Market Schedule + Product Tags

**Scenario:** planning/scenarios/F011-vendor-profile.md
**Status:** Complete
**Completed:** 2026-04-24T09:40:49-07:00

## Acceptance Criteria

- [ ] Route `/vendors/[slug]` renders the vendor profile (new route). Old `/businesses/[id]` redirects here
- [ ] Add `slug` column to `businesses` table (unique, derived from name on insert); backfill existing rows
- [ ] Top: cover photo (full-width header image; placeholder if none)
- [ ] Vendor name (large) + tagline (one sentence)
- [ ] Product category chips (from `vendor_categories`)
- [ ] **Market Schedule section**: for each market in `market_vendors`, show market name, days + hours, and next upcoming date (computed from market's recurring schedule)
- [ ] Tapping a market name opens a brief info tooltip/sheet (market address + "See all vendors at this market" link → `/explore?market={id}`)
- [ ] About section: 2–4 sentences (vendor-supplied; hide if empty)
- [ ] Contact/links: website, Instagram, email (each optional; hide if missing)
- [ ] Follow button (prominent, above the fold) — wired in T018
- [ ] Share button — reuse existing share action from T009
- [ ] OG metadata renders correctly for shareable links (name, tagline, cover photo as `og:image`)
- [ ] Unauthenticated view: profile renders fully, but follow button shows "Sign up to follow [Name]"
- [ ] Vendor with no markets: "Currently not listed at any markets"
- [ ] Tests: profile renders given all vendor data shapes, next-market-date computation correct, slug routing works, OG tags present
- [ ] BUILD-LOG.md updated

## Notes

Next-market-date: for each linked market, find the next occurrence of any `schedule_days` day from today. Simple loop over the next 7 days.

Slug generation: lowercase, strip non-alphanumerics, hyphenate, append a short random suffix on collision. Store in DB, don't recompute on the fly.

This is essentially the old Business Detail Card (T007) reshaped: remove ownership badge, add market schedule + category chips. Reuse the share logic and sign-in prompt components.

## Completion

Date: 2026-04-24
Commit: 8c6b2bd
