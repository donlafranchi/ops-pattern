# F020: Maya finds something to do this week

**Bundle:** b1
**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly)
**Canonical example:** [Barn Movie Night at Drake's](../../product/foundation/canonical-examples.md#5-barn-movie-night-at-drakes) — and the dozens of gatherings around it that share the same discovery problem
**Primitive shape:** Person (visitor) → reads many Items(kind=gathering) attached to Locations near them
**Status:** backlog

## The Person

Maya just moved to Bryte (West Sacramento) two weeks ago. She doesn't know anyone in the neighborhood. She's heard there are things happening — a barn movie night, a running club, a dance class somewhere, a pickup soccer game — but she'd have to follow dozens of Instagram accounts and scrape dozens of websites to find out what's where and when. Most newcomers give up. Maya isn't going to spend her weekend on social-media archaeology.

She wants one page that answers: **what's happening near me this week that I could just show up to?**

## The Story

Maya opens the platform. She doesn't have an account yet — she's anonymous. The home page asks her, gently, where she is — by browser geolocation (with her permission) or a zip-code typed in. She enters **95605** (Bryte).

The page that loads is a list of gatherings within ~10 miles, in the next 7 days, sorted by combined proximity and time-to-event. She sees: Barn Movie Night Friday at Drake's, Run Club Thursday at Drake's, Open mic Saturday at the brewery in Land Park, Mutual Aid potluck Sunday at McKinley Park. Each row shows: title, day/time, venue name with distance, a one-line description.

She taps **Barn Movie Night**. The Item page tells her where, when, what's playing, what to bring (a chair, a blanket), and that it's free. She doesn't need an account to see this. There's a "Remind me" button — if she taps it, she's prompted to make an account so the platform can email her on Friday morning.

She doesn't sign up yet. She just shows up Friday with a folding chair. Next week she comes back to the page. Now there's a "things you've been to" affordance — but at b1 that's deferred. What matters at b1 is that Maya, a stranger to the platform, found something to do this week.

## Surfaces

- **Entry point:** Home (`/`) for anonymous and new-account users — locality-first by default.
- **Locality acquisition:** lightweight — geolocation prompt OR a single zip-code field. No login required to set or use it.
- **Primary surface:** **"This week near you"** — a feed of gathering Items within ~10 miles, in the next 7 days, sorted by a proximity+recency score (defined in [`discovery.md`](../../product/systems/discovery.md), T1 formula).
- **Filtering:** a small filter row above the feed: "Today / This week / This weekend," and a kind chip set ("Free / Family-friendly / Outdoors") — kept tight at b1.
- **Item detail:** `/i/[slug]` — the canonical Item page. Anonymous users can view; the "Remind me" affordance prompts sign-up.
- **Map toggle:** an alternate view switches the feed to a map with pins (b1). Same data, different render.

## Data Captured

This is a **read-only** scenario from Maya's perspective — no Items are created. The data the platform must surface, all from existing tables:

| What Maya sees | Schema source |
|---|---|
| List of gatherings in next 7 days | `discoverable_items` materialized view, filtered `kind='gathering'`, `starts_at` between now and +7d, distance ≤ 10mi |
| Distance from Maya | computed from `locations.geog` and Maya's geolocation/zip centroid, PostGIS `ST_Distance` |
| Title, day/time, description | `items.title`, `item_gatherings.starts_at`, `items.description` |
| Venue name | `locations.name`, joined via `item_locations` |
| Sort order | proximity + time-to-event composite, hand-tuned at T1 per `discovery.md` |
| Reminder ask | new row in `item_responses` (kind=`remind_me`) on sign-up — see assumptions |

What Maya does **not** need: an account, a profile, a Member record. The platform must work for her on first arrival.

## Acceptance Criteria

### Anonymous user sees a locality-first feed on first visit

**Given** an anonymous visitor lands on `/`
**When** the page loads
**Then** a prompt is shown to either share location (browser geolocation) or enter a zip code — the page does not require sign-up

### Setting locality reveals "this week near you"

**Given** the visitor has shared geolocation OR entered a valid zip code
**When** the home feed loads
**Then** the feed shows gathering Items within ~10 miles whose `starts_at` is in the next 7 days, sorted by the T1 discovery score (proximity + time-to-event), with at least 5 items if the area has them

### Each row gives Maya enough to decide whether to tap

**Given** the feed has loaded
**When** Maya scans a row
**Then** the row shows: title, day-and-time in human form ("Thu 6pm"), venue name with distance ("Drake's, 0.4mi"), and a one-line description

### Item page is viewable without an account

**Given** Maya taps a row
**When** `/i/[slug]` loads
**Then** the full Item page renders for the anonymous user — title, description, recurrence, location, what to bring, hashtags — with no sign-in wall

### "Remind me" prompts sign-up but does not block reading

**Given** Maya is on the Item page anonymously
**When** she taps "Remind me"
**Then** a sign-up prompt appears with a return URL; on sign-up, an `item_responses` row (kind=`remind_me`) is created and a reminder email is scheduled for the morning of `starts_at`

### Filters narrow the feed without re-querying the world

**Given** Maya selects "This weekend"
**When** the filter applies
**Then** the feed re-filters to gatherings whose `starts_at` falls Sat 00:00 – Sun 23:59 local time, sort order preserved

### Map toggle renders the same set as pins

**Given** Maya is viewing the feed and toggles to map
**When** the map loads
**Then** every Item in the current feed is rendered as a pin at its venue's coordinates, with the venue name and Item title in the popover

## Edge Cases

- **Geolocation denied AND zip not entered:** show a default fallback (Sacramento centroid) with an explicit notice — "Showing Sacramento. Set your location for a closer view."
- **Zero items in radius:** show "Nothing scheduled within 10 miles in the next 7 days" with a "Widen the search" affordance (expands to 25mi).
- **Item starts in the next hour:** surface it with an "Happening soon" tag.
- **Item is recurring (Run Club every Thursday):** show the next occurrence, not all future occurrences. Only one row per recurring Item.
- **Item has no end time:** show only the start time.
- **Items declared in a different time zone:** display in the viewer's local time zone with a small annotation if it differs.

## Assumptions

- The locality-first index (`discoverable_items` materialized view) is in place and refreshed on Item write — see [`b1-primitives.md`](../bundles/b1-primitives.md).
- `discovery.md` T1 scoring formula is implemented (covered by separate scenarios).
- `item_responses` table supports `kind='remind_me'` (covered by the responses-table scenario).
- Reminder emails are sent via the existing notification cron path (per F012).
- Anonymous browsing is supported for `/`, `/i/[slug]`, `/l/[location-slug]`, `/h/[hashtag]`. Sign-in is required only for actions (post, follow, RSVP, remind-me).
- Maya's location is held in a cookie or localStorage for return visits; it is NOT stored server-side without an account.

## Out of Scope

- Personalized ranking based on prior activity — at T1 the score is locality + time only. T2 adds revealed-preference weights (per `discovery.md`).
- "Things you've been to" history — requires sign-up; b2.
- Friend graph / social proof on rows ("3 people you follow are interested") — b2.
- Push notifications — b2.
- Calendar export from an Item page — b2.
- Searching by free-text query (vs. filter chips) — separate scenario at b1; this story specifically tests the *browse* path, not the *search* path.
