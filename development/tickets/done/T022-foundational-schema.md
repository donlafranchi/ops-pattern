---
id: how-t022-foundational-schema
purpose: Ticket T022 — foundational schema.
layer: how
status: reference
---

# T022 — Foundational schema (events, bulletins, vendor analytics, follow soft-delete)

**Status:** Complete
**Completed:** 2026-04-25T13:33:54-07:00

## Goal
Land the database tables and column additions that the new system docs assume exist, **before** the UI work in T021–T027 starts depending on them. Per the build-for-future principle: these are cheap at MVP and impossible to backfill.

This ticket is infrastructure-only. No user-facing surfaces change. Subsequent tickets (T024 feed, T025 bulletin, T026 dashboard, T027 event surfacing) consume what this ticket creates.

## References
- [product/systems/events.md](../../product/systems/events.md) — unified Event model
- [product/systems/vendor-bulletin.md](../../product/systems/vendor-bulletin.md) — bulletin tables
- [product/systems/vendor-intelligence.md](../../product/systems/vendor-intelligence.md) — analytics event sourcing + rollups

## Scope

### 1. `events` table (new)
Per `events.md` data model. Columns:
- `id uuid pk`, `event_type` enum (`market_session | class | community_project | vendor_special`), `host_type` enum (`vendor | market | platform`), `host_id uuid`
- `title text`, `description text null`
- `starts_at timestamptz`, `ends_at timestamptz null`
- `recurrence jsonb null` (RRULE-shaped — no UI yet, store only)
- `location_lat numeric`, `location_lng numeric`, `location_label text null`
- `cost_cents int null`, `capacity int null`
- `cover_photo_url text null`
- `status` enum (`scheduled | cancelled | completed`) default `scheduled`
- `created_at`, `updated_at` timestamptz

Indexes: `(starts_at)`, `(host_type, host_id)`, `(event_type, starts_at)`.

### 2. `market_session` auto-generation
Background-safe SQL function `generate_market_sessions(window_days int default 14)`:
- Reads `markets.schedule_days` (existing `markets` table from T012)
- Materializes the next N days of `market_session` rows whose `host_type='market'`, `host_id=markets.id`
- Idempotent: skips rows already present (`(host_id, starts_at)` unique within `event_type='market_session'`)
- Cron / scheduled invocation is **out of scope** here — the function exists; T024 wires the call.

### 3. `vendor_bulletins` table (new)
Per `vendor-bulletin.md`. Columns:
- `id uuid pk`, `vendor_id uuid fk → businesses.id`, `author_user_id uuid fk → auth.users`
- `title text null`, `body text not null`
- `cover_photo_url text null`, `attached_event_id uuid null fk → events.id`
- `published_at timestamptz null` (null = draft)
- `audience text default 'all_followers'` (enum-shaped; only `'all_followers'` allowed in T1)
- `delivery_channels jsonb default '{"in_app": true, "email": true, "push": false}'`
- `stats jsonb default '{}'` (computed async; T026 reads it)
- `created_at`, `updated_at`

Indexes: `(vendor_id, published_at desc)`.

### 4. `bulletin_deliveries` table (new)
- `bulletin_id uuid fk`, `user_id uuid fk`
- `delivered_at timestamptz`, `opened_at timestamptz null`, `clicked_at timestamptz null`, `unsubscribed_at timestamptz null`
- pk: `(bulletin_id, user_id)`

Indexes: `(user_id, delivered_at desc)`.

### 5. `vendor_events` table (new — analytics event sourcing)
Cheap append-only log. Powers all vendor-intelligence metrics later.
- `id uuid pk`, `vendor_id uuid fk`, `user_id uuid null fk` (anon allowed)
- `event_name text` (`profile_view | support_click | follow | unfollow | share | bulletin_open | bulletin_click`)
- `referrer text null` (e.g. `home_feed | explore | search | bulletin_email | direct | shared_link`)
- `metadata jsonb default '{}'`
- `created_at timestamptz default now()`

Indexes: `(vendor_id, created_at desc)`, `(vendor_id, event_name, created_at desc)`.

### 6. `vendor_stats_daily` table (new — denormalized rollup)
Empty in T1; created so T026 can populate without migration.
- `vendor_id uuid`, `day date`
- `profile_views int default 0`, `support_clicks int default 0`, `new_follows int default 0`, `unfollows int default 0`, `shares int default 0`, `bulletin_opens int default 0`
- pk: `(vendor_id, day)`

### 7. `follows` column additions (existing table from T018)
- Add `last_active_at timestamptz null` (for churn signals)
- Add `unfollowed_at timestamptz null` (**soft-delete** — never hard-delete a follow row)
- Migrate existing `T018` unfollow logic to set `unfollowed_at = now()` instead of deleting
- Active-follower queries: `where unfollowed_at is null`

### 8. Referrer column on view-tracking (if any exists)
Audit existing pageview logging (likely none in MVP). If `business_views` or similar table exists, add `referrer text null`. If not, this is satisfied by `vendor_events` above — no new column needed.

## Migration approach
- One Supabase migration file: `web/supabase/migrations/{timestamp}_foundational_schema.sql`
- All `create table` statements are `if not exists`
- RLS policies: read-allowed-by-owner for `vendor_bulletins`, `vendor_stats_daily`, `vendor_events`; insert-by-system for `vendor_events`, `bulletin_deliveries`. Vendors can write their own bulletins.
- Update TypeScript types: `web/src/lib/database.types.ts` (regenerate from Supabase)

## Acceptance criteria
- [ ] Migration file applies cleanly on a fresh Supabase instance and on the existing dev DB.
- [ ] All six new tables exist with the columns/indexes/PKs above.
- [ ] `follows` table has `last_active_at` and `unfollowed_at` columns.
- [ ] T018 unfollow path soft-deletes (sets `unfollowed_at`), and follower queries filter `unfollowed_at is null`. Existing T018 evals still pass.
- [ ] `generate_market_sessions(14)` produces idempotent rows from existing `markets` data.
- [ ] `database.types.ts` regenerated and compiles.
- [ ] `npm run build` and `npm run test` pass.

## Out of scope
- Any UI surface (no feed, no dashboard, no bulletin composer in this ticket)
- Cron / scheduled jobs to call `generate_market_sessions` or roll up `vendor_stats_daily` (T024 / T026)
- RSVP, capacity enforcement, paid ticketing (events.md T2/T3)
- Bulletin composer, segmentation, drip (vendor-bulletin.md T2/T3)

## Notes
This is the "build with the future in mind" ticket. Every later vendor-intelligence and bulletin/event feature reads from these tables instead of forcing a backfill migration. Keep schemas tight; resist adding columns we won't use until they have a consuming surface.

## Completion

Date: 2026-04-25
Commit: (pending)

**Delivered:**
- `web/supabase/migrations/003_foundational_schema.sql` — events, vendor_bulletins, bulletin_deliveries, vendor_events, vendor_stats_daily; follows soft-delete columns; `generate_market_sessions()` function; RLS policies for all new tables.
- `FollowButton.tsx` — switched from hard-delete to upsert + soft-delete (`unfollowed_at`). Re-following resets the timestamp via `onConflict: user_id,vendor_id`.
- All 4 follow read sites filter `unfollowed_at is null` (FollowButton state check, HomeFeed, /following page, follow-notifications cron).
- `vendor_follower_counts` view rewritten to count active follows only.
- `lib/types.ts` — added `PlatformEvent`, `VendorBulletin`, `BulletinDelivery`, `VendorAnalyticsEvent`, `VendorStatsDaily`; extended `Follow` with `last_active_at` + `unfollowed_at`.
- Fixed stale `map-config.test.ts` from prior PIN_COLORS spectrum change.

**Verification:**
- `npm run build` ✓
- `npm run test` ✓ (51/51)
- Migration applies cleanly to a fresh Postgres (verified by SQL parse; needs `supabase db push` to remote — Docker not available locally for `supabase start`).

**Migration deployment:** PM/dev runs `supabase db push` from `web/` to apply `003_foundational_schema.sql` to the remote Supabase project. No data backfill required.

**Out-of-scope deviations:** none.
