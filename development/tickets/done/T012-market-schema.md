# T012: Market Schema + Seed Data

**Scenario:** planning/scenarios/F009-market-selection.md
**Status:** Complete

## Acceptance Criteria

- [ ] New table `markets`: id, name, city, state, lat, lng, schedule_days (array: mon..sun), schedule_start_time, schedule_end_time, description, created_at
- [ ] New table `market_vendors` (many-to-many): id, market_id, vendor_id, created_at (unique on pair)
- [ ] New table `vendor_categories` (many-to-many): id, vendor_id, category_slug, is_primary, created_at
- [ ] New table `follows`: id, user_id, vendor_id, created_at (unique on pair)
- [ ] Add column `is_featured boolean default false` and `featured_at timestamptz` on `businesses` (vendor table)
- [ ] Seed 3 Sacramento-area markets: Folsom Farmers Market, Sacramento Central Farmers Market, Roseville Farmers Market — with real coordinates and schedules
- [ ] Seed 8 canonical category slugs: bread, produce, honey-jams, soap-body, candles, plants-flowers, crafts, meat-eggs
- [ ] Seed 6–10 mock vendors across the 3 markets with categories assigned
- [ ] Types regenerated in `src/lib/database.types.ts`
- [ ] RLS policies: markets readable by all; market_vendors/vendor_categories readable by all, writable only by vendor owner; follows readable by owner, writable by owner
- [ ] Tests: migrations run clean, seed data inserts, type-check passes
- [ ] BUILD-LOG.md updated

## Notes

Migrations live in `web/supabase/migrations/`. Seed script in `web/supabase/seed.sql` or a `scripts/seed.ts`.

The existing `businesses` table serves as the vendor table — we're extending it, not replacing. Rename in UI copy only ("business" → "vendor"), keep the table name to avoid migration churn.

Category slugs must match exactly what the home feed Shop by Category tiles use (F008 module 2).

For markets, `schedule_days` is a Postgres text[] of day slugs: `['sat']` for Folsom, etc. Hours are stored as local time strings (e.g., "08:00", "13:00") — no timezone math in b1.

## Completion

Date: 2026-04-24
Commit: 8c6b2bd
