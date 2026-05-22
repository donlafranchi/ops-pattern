# T027 — Event surfacing on vendor & market profiles

> **ARCHIVED 2026-05-09 — superseded by the primitives migration.** Per the ticket audit: builds further on the doomed `events`/`vendor_events`/`businesses`/`markets` substrate. Every capability re-emerges in the new tickets:
> - "upcoming on vendor profile" → "Items of `kind=gathering` on `/m/[handle]` page" (Phase 3 Member-page ticket)
> - "vendor's market sessions" → `item_locations` join from a Maker's Item to a market Location
> - "vendor special composer" → surface-specific composers per loop (per the revised migration plan)
>
> Nothing in T027 needs to ship before the migration; everything in it ships *as part of* the migration via the Item / Member / Location primitives.

**Status:** Archived

## Goal
Now that `events` exists (T022) and Home reads it (T024), surface upcoming events on vendor and market profile pages so a visitor lands on a profile and immediately sees "what's next."

## References
- [product/systems/events.md](../../product/systems/events.md)
- T022 — `events` table (hard prerequisite)
- T024 — feed already consumes events; this ticket adds profile-side consumption

## Scope

### 1. Vendor profile: "Upcoming" section
On `web/src/app/vendors/[slug]/VendorProfilePage.tsx` (or equivalent business profile):
- Section heading: `Upcoming`
- Query `events where host_type='vendor' and host_id=vendor.id and starts_at >= now() and status='scheduled' order by starts_at asc limit 5`
- Render with the same `EventCard` component from T024
- If empty: hide the section entirely (no empty state — keeps profiles clean for vendors who haven't added events yet)

### 2. Vendor's market sessions
Vendors that attend specific markets should appear in the market's session list:
- Add a join: `event_attendees(event_id, vendor_id)` table — **add to T022 schema if not already present**, OR add it as an addendum migration in this ticket (called out in PR description)
- For each `market_session` event a vendor confirms attending, insert a row
- On vendor profile, also surface upcoming `market_session`s the vendor is attending

> **Implementer note:** if `event_attendees` requires a new migration, write it as `web/supabase/migrations/{timestamp}_event_attendees.sql` and update `database.types.ts`. Document the addition in DEVIATIONS.md if it differs from T022 scope.

### 3. Vendor "Add an upcoming day" composer
Inline composer on `/you/vendor` (Overview tab footer) and on the public profile (owner-only):
- Form fields: title, date+time, optional location_label, optional description
- Creates `events` row with `event_type='vendor_special'`, `host_type='vendor'`, `host_id=vendor.id`
- Defaults `location_lat/lng` to vendor's lat/lng

### 4. Market detail page: "All upcoming"
Lightweight market detail page at `/markets/[slug]` (if it doesn't already exist):
- Header: market name, address, schedule_days
- "Upcoming sessions" — list of `market_session` events for next 30 days
- For each session, show attending vendors (via `event_attendees`)

### 5. Mark attendance UI
On the vendor profile (owner mode) or `/you/vendor`:
- "Markets I attend" — list of nearby markets with `[I attend this]` toggle
- Toggling on → inserts `event_attendees` rows for the next 14 days of that market's sessions
- Toggling off → removes future `event_attendees` rows for that market

## Acceptance criteria
- [ ] Vendor profile shows `Upcoming` section when at least one future event exists; hidden otherwise.
- [ ] Owner of a vendor can add a `vendor_special` event from `/you/vendor` and see it appear on the public profile.
- [ ] Vendor can mark attendance at a market; their card appears under that market's session in `/markets/[slug]`.
- [ ] Market detail page lists upcoming sessions and attending vendors.
- [ ] Tapping any event card on a profile records a `vendor_events` row with `referrer='vendor_profile'` (or `'market_detail'`).
- [ ] `event_attendees` table exists (created here or in T022) and has RLS.
- [ ] Non-owners cannot create `vendor_special` events for vendors they don't own.
- [ ] `npm run build` and evals pass.

## Out of scope
- Recurrence UI for vendor specials (T2 in events.md)
- Event detail page (T2)
- RSVP / attendance count (T2)
- Cover photos for events (T2 — uses host photo for now)
- Class / community_project event types (T2)

## Notes
The shape of this ticket is "make event data visible where users already look." Don't build new pages we won't drive traffic to. Market detail page is the one new surface, and only because it has clear utility (consumers already ask "what's at this market this week").
