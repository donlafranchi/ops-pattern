# Scenario: Vendor Manages Appearances — Confirm, skip, or add a one-off market appearance

**Feature:** F016
**Severity:** Important
**Bundles:** b1

## Acceptance Criteria

### Given
- The vendor is authenticated and viewing their founder dashboard (T026) or a "Manage appearances" surface linked from their profile
- The vendor has zero or more market affiliations (`market_vendors` rows)
- The system has auto-generated upcoming `market_session` events for the next ~30 days from each market's recurring schedule

### When
- The vendor opens the appearances surface

### Then
- A list of the next 4–6 upcoming sessions is shown, ordered by date
- Each session row displays:
  - Market name + session date + start/end time (e.g., "Folsom Farmers Market · Sat May 2 · 8am–1pm")
  - Current state: **Attending** (default for affiliated markets), **Skipped**, or **Added** (one-off)
  - A primary action: "Skip this week" if attending, "Mark attending" if skipped
- A persistent "+ Add appearance" CTA is visible above or below the list

### And When
- The vendor taps "Skip this week" on an upcoming session

### Then
- The session immediately transitions to **Skipped** state (no page reload)
- A `vendor_appearances` row is written with `status: cancelled`
- The vendor's profile and the market's lineup for that session remove the vendor
- An optional follow-up prompt appears: "Tell your followers? (Bulletin)" — Yes / Not now
  - Yes → opens bulletin compose (T025) pre-filled with "I won't be at [Market] on [Date]"
  - Not now → dismisses the prompt; nothing else happens

### And When
- The vendor taps "Mark attending" on a previously skipped session

### Then
- The session reverts to **Attending** state
- The `vendor_appearances` row is updated to `status: confirmed` (or deleted to fall back to the default-attending inference — either is acceptable)
- The vendor reappears on the profile and market lineup for that session

### And When
- The vendor taps "+ Add appearance"

### Then
- A compose sheet opens with three fields:
  1. **Market** — searchable list of all markets in the system; markets the vendor is already affiliated with appear at the top
  2. **Session date** — populated from the selected market's upcoming sessions; vendor picks one
  3. **Note** (optional, ≤140 chars) — e.g., "Bringing the waffle cart!"
- A "Tell your followers?" toggle is visible (defaults on for one-offs)
- "Add appearance" submits

### And When
- The vendor submits a one-off appearance

### Then
- A `vendor_appearances` row is written with `status: confirmed`, the optional note, and `is_one_off: true`
- The session immediately appears in the vendor's appearances list as **Added**
- The vendor appears on the market's lineup for that session
- If the bulletin toggle was on, a bulletin draft is created (or auto-posted, per T025 behavior) with the appearance note pre-filled

### And When
- A vendor with no market affiliations opens the appearances surface

### Then
- The list is empty
- A short empty state explains: "Add a market appearance to let followers know where to find you"
- The "+ Add appearance" CTA is the primary action

## Edge Cases

- **Skipping a session that already passed:** disabled — past sessions are read-only history
- **Adding a one-off for a session that already passed:** not allowed; date picker excludes past sessions
- **Two markets on the same day:** vendor can confirm both — two-market Saturdays are real and supported
- **Vendor cancels an already-broadcast bulletin appearance:** skipping the session does not retract the original bulletin; vendor must compose a follow-up (out of scope for F016)
- **Recurring popup at a non-affiliated market:** b1 requires re-adding each one-off; recurring one-offs are deferred to b2
- **Race condition (two devices):** last-write-wins on `vendor_appearances` row; the more recent action prevails

## Assumptions

- **New table** `vendor_appearances`:
  - `vendor_id` (uuid, refs vendors)
  - `event_id` (uuid, refs events where event_type = 'market_session')
  - `status` (enum: `confirmed`, `cancelled`)
  - `is_one_off` (boolean — true when vendor isn't in `market_vendors` for the host market)
  - `note` (text, nullable, ≤140 chars)
  - `created_at`, `updated_at` (timestamptz)
  - Unique constraint on (vendor_id, event_id)
- **Default-attending rule:** for any upcoming `market_session` event whose host market is in the vendor's `market_vendors`, the vendor is presumed attending unless a `vendor_appearances` row with `status: cancelled` exists. No row needed for the common "regular vendor shows up as expected" case.
- One-off appearances always require an explicit `vendor_appearances` row.
- Bulletin cross-post is optional and uses the existing T025 compose flow — no new bulletin primitives.
- Surface lives inside the founder dashboard (T026) at `/dashboard/appearances` or as a section on the dashboard homepage. Mobile-first, card layout per DLS (`product/ui/design-language.md`).
- The "next 4–6 sessions" window is a UI default, not a hard cap. A "See all upcoming" link can expand the view.

## Comments

This is the in-app replacement for the Instagram post that says "I'll be at the Davis market this Saturday." The design intent is **by-exception**: a vendor who attends every Saturday at the same market shouldn't have to touch this surface at all — defaults carry them. The work only kicks in when:

1. They're skipping a regular session
2. They're showing up somewhere they don't normally appear

Both of those are exactly the announcements vendors are already making on Instagram. The appearances list + optional bulletin cross-post lets them do it once and have it land in two places (their followers + the market lineup).

Pairs with **F017** (buyer-side display) and depends on **T025** (bulletin compose) for the optional cross-post path. Without F017 there's nowhere for the data to surface; without T025 the cross-post toggle is hidden but the core flow still works.

The `vendor_appearances` table is the structural primitive that makes the **rediscovery** job possible — buyers can scroll a market session's historical lineup and find the waffle cart they remember. That's a buyer-facing concern (F017), but the data model decision lives here.
