# System: Events

**Purpose:** Provide a single, time-stamped object that powers the Home feed, vendor profiles, and Explore filters. An "event" is anything happening at a specific time and location: a market session, a class, a community project, a vendor's special day.

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

**Core Principle:** Events are first-class from the start so we never retrofit them. The data model is unified across event types — only the `event_type` discriminator and a few type-specific fields differ. This avoids the trap of building one-off "markets" and "classes" tables and then discovering they want to behave the same way in the feed.

---

## Data model (target — design from day one even if T1 only populates a subset)

```
events
├── id (uuid)
├── event_type (enum: 'market_session' | 'class' | 'community_project' | 'vendor_special')
├── host_type (enum: 'vendor' | 'market' | 'platform')
├── host_id (uuid — refs vendors.id or markets.id depending on host_type)
├── title (text)
├── description (text, nullable)
├── starts_at (timestamptz)
├── ends_at (timestamptz, nullable)
├── recurrence (jsonb, nullable — RRULE-like for recurring markets)
├── location_lat, location_lng (numeric — defaults to host's location)
├── location_label (text — "Midtown Plaza" overrides host name)
├── cost_cents (int, nullable — null = free)
├── capacity (int, nullable — for class signups)
├── cover_photo_url (text, nullable)
├── status (enum: 'scheduled' | 'cancelled' | 'completed')
├── created_at, updated_at
```

A `market_session` event is auto-generated from `markets.schedule_days` so the feed has content from day one with no vendor input required.

---

## T1 — MVP Tier

### Event types implemented
- **market_session** (auto-generated, recurring weekly per `markets.schedule_days`)
- **vendor_special** ("we'll have peaches Saturday" — uses existing `business-updates` capability semantics, but written as an event with a date)

Vendor classes and community projects are *not* in T1 — they need richer hosting + capacity + (eventually) RSVP.

### Generation
- Background job (or on-read query) materializes the next 14 days of `market_session` events from `markets.schedule_days`
- Vendors create `vendor_special` events through the existing business-updates form, with an optional date field

### Surfaces
- Home feed: events sorted by `starts_at` ascending, scoped to user's saved market
- Vendor profile: upcoming events for that vendor
- Market detail page (future): all upcoming sessions

### Out of scope at T1
- RSVP, attendance count, capacity enforcement
- Recurring event UI (markets are auto-recurring; vendors don't get recurrence yet)
- Event detail pages (cards in feed link to host profile, not a separate event page)
- Cover photos for events (use host's photo)

---

## T2 — Core Tier

### New event types
- **class** — vendor-hosted workshops. Adds: capacity, cost, signup link (external in T2)
- **community_project** — hosted by a vendor, market, or "platform" (admin-curated in T2). Adds: volunteer slots, contact info

### Event detail page
- Dedicated `/events/[id]` route
- Full description, cover photo, host card, RSVP button (T2 RSVP is "I'm interested" without payment)
- "Add to calendar" download (.ics)
- Share button (deep link)

### RSVP (lightweight)
- "I'm going" / "Interested" buttons
- Attendee count visible (no list of names — privacy-by-default)
- Notification to host when someone RSVPs to their class/project

### Recurrence UI
- Vendors creating a class can mark it recurring (weekly/monthly)
- Stored as RRULE in `recurrence` column

### Host model expansion
- Markets become first-class hosts (already are; just exposed in event composer)
- Platform can host events (admin tool — for community projects without a clear vendor host)

### Filters in feed and Explore
- Card-type chips at top of Home feed: All / Markets / Classes / Projects / Updates
- Explore gets an "Events" tab alongside Vendors/Markets

---

## T3 — Polish Tier

### Paid classes / ticketing
- Stripe integration for class signups
- Capacity enforcement (sold out states)
- Refund policy per host

### Recurring event UI for vendors
- Visual recurrence builder (every Tuesday, first Saturday, etc.)
- Bulk edit / cancel single instances of a series

### Reminders
- Push notification 24h before an event the user RSVP'd to
- Push notification 1h before market opens at user's saved market (opt-in)

### Calendar sync
- Subscribe to "all events at my saved market" as an iCal feed
- Subscribe to "all events from vendors I follow"

### Discussion threads
- Per-event comment thread (lightweight Q&A — "is parking available?")
- Host moderation tools

### Cross-vertical event types
- Stays vertical: "host's seasonal recommendations" event ("apple picking starts this weekend")
- Harvest vertical: CSA pickup events, U-pick days

---

## Integration Points

- **Connects to:** `markets`, `businesses` (vendors), `users` (RSVP), `follows` (event float ranking)
- **Used by:** Home Feed (consumer-feed capability), Vendor Profile, Vendor Bulletin (event posts can be bulletin'd to followers)
- **Drives:** Notifications (T3), Email digest (T3)

---

## Open Questions

- Should `vendor_special` and `business_updates` merge into a single capability where "post" can optionally have a date? Probably yes in T2 — keeps the composer simple.
- Does an event need an explicit `host_id` if `vendor_id` already exists? Yes, because community projects can be hosted by markets or the platform itself.
- Do we want a separate `event_signups` table for RSVP, or use `event_attendees`? Naming nit, but `event_attendees(event_id, user_id, status)` is cleanest.
