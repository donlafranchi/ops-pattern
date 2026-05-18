# T024 — Events-driven Home feed (Nextdoor-style local feed)

**Status:** Complete
**Completed:** 2026-04-25T14:53:30-07:00

## Goal
Reframe Home as a **local feed scoped to the user's market**, sorted by what's happening soon. The feed reads from the unified `events` table (T022) so all event types — market sessions, vendor specials, future classes/projects — flow through one surface.

This replaces the current Home implementation that mixes ad-hoc card types. Explore stays the catalog/discovery surface (untouched by this ticket).

## References
- [product/surfaces/community-platform.md](../../product/surfaces/community-platform.md) — Home page role
- [product/systems/events.md](../../product/systems/events.md) — event model
- T022 — schema (hard prerequisite)
- T021 — DLS + recruitment panel (assumed done)

## Scope

### 1. Feed data source
- Query `events` where `status='scheduled'` and `starts_at >= now()` and within 30 days
- Filter by user's saved market: events within ~25mi radius of `markets.lat/lng`, plus all events with `host_type='market' AND host_id=user.market_id`
- Sort: `starts_at asc`
- Limit 50, paginate with cursor on `(starts_at, id)`

### 2. Server-side market_session generation
- Add a Supabase Edge Function or scheduled cron that calls `generate_market_sessions(14)` from T022 once nightly
- Until cron is wired, also call it lazily on the first Home request per day (cheap, idempotent)
- Track last-run in a tiny `system_runs` table or via `pg_cron` — implementer's choice; document in code

### 3. Feed UI
- Card-type chips at top (DLS chips): `All` (default) | `Markets` | `Vendor Specials`
- Each card uses a consistent `EventCard` component:
  - Cover photo (event's `cover_photo_url` or fallback to host's photo)
  - Title, host name (linked to host profile), date/time, location_label or distance
  - Tap → host profile (no event detail page in T1; per `events.md`)
- Empty state: "No upcoming events near {market}. [Explore vendors →]"

### 4. Pinned bulletin section (only if user follows vendors with recent bulletins)
- If any followed vendor published a bulletin in the last 7 days, show a top section "From vendors you follow" with their bulletin cards
- Reads `vendor_bulletins where vendor_id in (followed) and published_at > now() - 7d`
- This is a thin reader — actual bulletin compose is T025; if no bulletins exist yet, the section just doesn't render

### 5. Recruitment panel at bottom (from T021)
- Keep the recruitment panel from T021 — bottom-of-feed, after pagination exhausts

### 6. Telemetry
- On every event card render in viewport: insert `vendor_events` row with `event_name='profile_view'` only when card is **clicked** (not impression — keeps writes cheap in T1)
- Include `referrer='home_feed'` per T022

## Acceptance criteria
- [ ] Home reads from `events` and shows upcoming events near the user's market, sorted by `starts_at`.
- [ ] `market_session` rows are auto-populated for the next 14 days from existing `markets.schedule_days`.
- [ ] Card-type chips filter the feed (All / Markets / Vendor Specials).
- [ ] If the user follows a vendor with a bulletin published in the last 7 days, "From vendors you follow" renders at the top.
- [ ] Tapping an event card navigates to the host's profile.
- [ ] Tapping records a `vendor_events` row with `referrer='home_feed'`.
- [ ] Empty state shows when no events exist within range.
- [ ] Recruitment panel renders at bottom.
- [ ] Existing Home `data-testid`s preserved where reasonable; new ones added: `event-card`, `feed-filter-chip`, `bulletin-pinned-section`.
- [ ] `npm run build` and evals pass.

## Out of scope
- Event detail pages (per `events.md` T1)
- RSVP / "I'm going" (T2 in events.md)
- Bulletin compose UI (T025)
- Cross-market browsing while traveling (deferred)
- Push notifications

## Notes
The point: one Event object means we don't rebuild the feed when classes and community projects ship later — they just appear when the data shows up. Don't take shortcuts that special-case `market_session` in the UI; treat all events uniformly and key off `event_type` only for icon/label.

## Completion

Date: 2026-04-25
Status: Complete

**Delivered:**
- New `EventCard` component renders any `event_type` uniformly (icon + label keyed off type only). Click → host profile (vendor or market filtered Explore).
- `HomeFeed` rewritten as event-driven local feed: queries `events` where `status='scheduled'`, `starts_at >= now()`, within 30 days, sorted asc, limit 50.
- Filter chips at top: All / Markets / Vendor Specials (`feed-filter-chip` testid).
- Pinned bulletin section "From vendors you follow" renders only when followed vendors have `vendor_bulletins.published_at` in last 7 days (`bulletin-pinned-section` testid).
- Empty state with `[Explore vendors →]` CTA when no events match.
- `RecruitmentGrid` retained at bottom.
- Click telemetry inserts `vendor_events` row with `event_name='profile_view'`, `referrer='home_feed'`, `metadata.event_id` for vendor-hosted events.
- Lazy daily generation: new `/api/jobs/generate-market-sessions` POST endpoint calls `generate_market_sessions(14)` if last run > 20h ago; HomeFeed fires it on mount. Backed by new `system_runs` table (migration 004).

**Verification:**
- `npm run build` ✅ (new route appears in build output)
- `npm run test` ✅ 51/51 passing

**Deployment:**
- Run `supabase db push` to apply migration 004.
- Wire a real cron (Vercel Cron or pg_cron) to hit `/api/jobs/generate-market-sessions` daily — lazy-on-load is the fallback.
