# F028: Sam (newcomer) lands in the community-awareness feed

**Bundle:** b1
**Sub-bundle:** b1.0 — Show up & be seen
**Work-map item:** b1.0 → 🟢 "Place-interest scope" + 🟢 "Community-awareness feed (per ADR-21)"
**Loops:** 1 (Find your people), 3 (Land here), 8 (Follow what you love)
**Canonical example:** Concerts in the Park — [`use-cases.md` #12](../../product/needs/use-cases.md) (newcomer-to-Sacramento variant)
**Primitive shape:** Person(Sam) → `member_place_interests`(`primary_home=Oak Park`) × `member_interests`(`outdoor`, `live-music`) → community-awareness feed → Items in Place hierarchy + tag overlap
**Status:** backlog

## The Person

Sam just moved to Sacramento for a job. They've signed up for the platform after a friend mentioned it. They've never been to Capitol Mall on a Friday evening. They don't know which parks host concerts. They don't know there's a sourdough exchange every other Saturday. They have *no follow graph* — no Members they follow, no Groups they belong to. The platform exists to make their first week here *easier* — to surface what's happening near them, by Members they don't yet know, in places they haven't yet been.

## The Story

Sam completes onboarding. The locality step asks "Where do you live?" and offers a geolocate-or-pick affordance per ADR-4. They pick **Oak Park** (a neighborhood under Sacramento). Behind the scenes, two writes happen: `members.home_location_id` is set to a Location near Oak Park, and `member_place_interests` lands one row with `(member_id=Sam, place_id=Oak Park, scope_kind='primary_home')`.

The interests step (per `member.md`) asks Sam to tap any tags that resonate — they pick `outdoor`, `live-music`, `coffee`, `vegan-food`. Three taps, no required-field friction.

They land on the home feed. **It has content.** Without following anyone, without joining any Group, they see: a Friday concert at Capitol Mall (gathering, `outdoor`+`live-music` tags), a Saturday morning park run at McKinley Park (gathering, `outdoor`), a Sunday coffee meetup in Curtis Park (gathering, `coffee`), Maya's Sourdough drop at the Saturday market (product, near `vegan-food`-ish by tag adjacency — surfaces lower in the feed). The feed is computed live from their Place-interest set × interest tags × Place-hierarchy traversal (up to city by default — Oak Park traverses to Sacramento). No row says "Sam follows Capitol Mall." The platform inferred relevance from where Sam said they live + what they said they're interested in.

Six tabs in and Sam has a sense of the city. They tap "Add a secondary place" in the locality settings (per F029), add Folsom because that's where their office is, and the feed expands to include the Folsom Plaza Park summer concert series. Zero follow rows still — but their week's calendar suggestions are now meaningful.

## Surfaces

- **Entry point:** Onboarding completion → home feed at `/`. _Why: the awareness feed *is* the platform's locality-first index for the Member; Sam should land in it, not in an empty state that says "follow people to start." Per ADR-21's commitment to computed-from-place-interests, the feed has content from the moment locality lands._
- **Primary action:** No explicit action required — Sam scrolls. Cards surface gatherings (RSVP), products (save), services (contact), and Wonders (interest signal) in mixed order, ranked by the Discovery T1 scorer.
- **Composer / interaction:** N/A for this scenario — Sam is a viewer, not a poster. The interest-tags step in onboarding does write `member_interests` rows but that's covered by the existing onboarding flow.
- **Completion:** Sam has an actionable feed within seconds of onboarding completing. Empty state never appears unless their Place-interest set is genuinely empty (which the onboarding flow prevents by setting `primary_home` from `home_location_id`).
- **Discovery:** This *is* the discovery surface. Anonymous visitors get a similar feed scoped to the IP-geolocated city (no `member_place_interests` row to read; fall back to IP-derived Place); signed-in Members get the personalized feed.

## Data Captured

This scenario is read-heavy — the writes happen at onboarding (already specced):

| User-language field | Schema mapping | When |
|---|---|---|
| Home location | `members.home_location_id` | Onboarding step (existing) |
| Primary home Place | `member_place_interests` row (`scope_kind='primary_home'`) | Derived from `home_location_id`'s `place_id` at onboarding (trigger in `member.locality.set` action handler per ADR-21) |
| Interest tags | `member_interests` rows | Onboarding step (existing per `member.md`) |

Implicit (read by the feed, not written by Sam):
- `places.parent_id` hierarchy (traversal from Oak Park → Sacramento for the default city-depth)
- `item_locations` (Items attach to Locations; Locations resolve to Places)
- `discoverable_items` materialized view (per `discovery.md`)

## Acceptance Criteria

### Onboarding writes the primary_home place-interest

**Given** Sam is completing onboarding; they have set their `home_location_id` to a Location in Oak Park
**When** they confirm the locality step
**Then** a `member_place_interests` row is written with `(member_id=Sam, place_id=Oak Park, scope_kind='primary_home', removed_at=NULL)`. _Why: per ADR-21 — `member.locality.set` action handler maintains the primary_home trigger so the awareness feed has a starting point from the moment locality lands._
**And** `member.place_interest_added` is appended to `member_events` in the same transaction. _Why: same-transaction row+event invariant per ADR-7._

### Awareness feed surfaces locality-matching Items on first land

**Given** Sam has just completed onboarding with `primary_home=Oak Park` and interest tags `outdoor`, `live-music`, `coffee`, `vegan-food`
**And** the database contains: a gathering Item at Capitol Mall (a Location whose `place_id` resolves to Sacramento) with tags `outdoor`+`live-music`; a gathering Item at Drake's (a Location whose `place_id` resolves to West Sacramento — a sibling city, NOT under Sacramento) with tag `live-music`
**When** Sam loads the home feed at `/`
**Then** the Capitol Mall Item is visible in the feed. _Why: Capitol Mall's Place (Sacramento city) is the city-depth ancestor of Oak Park; per `discovery.md` Community-awareness feed Intent, the default traversal is up-to-city. Sam's interest-tag overlap (`outdoor`+`live-music`) ranks it high._
**And** the Drake's Item is **not** visible (or surfaces with lower rank) unless Sam adds West Sacramento or the Sacramento MSA as a secondary Place-interest. _Why: West Sacramento is a sibling city under the MSA, not an ancestor of Oak Park; the default city-depth doesn't reach across cities. The Member chooses MSA-depth opt-in or secondary Places if they want wider scope (per `discovery.md` Intent)._

### Empty Place-interest is structurally prevented

**Given** Sam completes onboarding but skips the locality step (if a skip is permitted by the flow — per `member.md` it shouldn't be, but defense-in-depth)
**Then** the home feed shows an empty state with a primary CTA "Tell us where you live to see what's happening near you," and tapping it routes to the locality settings. _Why: a Member with no Place-interest has no candidate set; the empty state names what's missing instead of showing a generic "no results"._

### Anonymous-visitor fallback

**Given** an anonymous (signed-out) visitor loads `/`
**When** the visitor's IP geolocates to Sacramento
**Then** the feed surfaces with an IP-derived primary_home equivalent (Sacramento city) and a banner "Showing what's happening in Sacramento. Sign up to personalize." _Why: per ADR-4 locality-default Intent — geolocate-then-pick; anonymous visitors get the same computed-feed shape with a less-precise input. No `member_place_interests` row is written for an anonymous visitor; the fallback is read-only._
**And** if IP geolocation is unavailable, the feed surfaces a city picker first ("Where are you?") before any content. _Why: the platform's locality-first commitment per `principles.md` P1 means we never show a generic global feed; we ask once if we have to._

### Adding a secondary Place expands the feed

**Given** Sam has `primary_home=Oak Park` and an active feed
**When** Sam (per F029) adds Folsom as a `secondary` Place-interest
**Then** Items at Locations whose `place_id` resolves to Folsom-or-its-descendants appear in the feed within the next read cycle. _Why: ADR-21's secondary-set is the cross-Place mechanism — Sam works in Folsom; their awareness feed should include Folsom news without forcing them to switch the primary_home._
**And** the order of feed ranking applies tag-overlap + recency + locality-decay equally across primary and secondary scopes (no down-weight for secondary). _Why: secondaries are full citizens of the awareness scope, not second-class; the cap at 5 keeps cost bounded without ranking penalty (per `member.md` Place-interest Intent)._

### MSA-depth opt-in

**Given** Sam has `primary_home=Oak Park` (default city-depth: Sacramento)
**When** Sam opens locality settings and toggles "Include the wider Sacramento MSA in my feed"
**Then** Items at Locations whose `place_id` resolves to any city within the Sacramento MSA (Davis, Roseville, Folsom, West Sacramento, Citrus Heights) appear in the feed. _Why: per `discovery.md` Community-awareness feed Intent — MSA-depth is opt-in because making it the default would dilute the locality signal for everyone, but commuter / cross-city Members benefit from the wider scope when they ask._
**And** the toggle persists in `member_privacy.locality_precision` or an equivalent column. _Why: this is a recurring user preference; the action layer writes it; the awareness feed reads it on every query._

## Edge Cases

- **Sam has interest tags but they don't match any current Items** in their Place-interest set: the feed gracefully degrades — surfaces locality-only matches (Items in Oak Park / Sacramento regardless of tags) ranked below a banner "Not many events tagged outdoor or live-music near you this week. Want to widen your interests or your scope?" _Why: empty-state honesty + actionable affordance, per `discovery.md` cold-start posture._
- **The Place hierarchy has a gap** (e.g., Oak Park's `parent_id` points to Sacramento, but a misconfigured Location with `place_id=Oak Park` would surface even at the city-depth from Curtis Park because both share Sacramento as parent): correct behavior, by design. _Why: the city-depth traversal is what makes neighbors discoverable to each other — Sam in Oak Park seeing Curtis Park content is *exactly* the awareness commitment._
- **Sam's `home_location_id` is changed later** (they move to a different neighborhood): the trigger on `member.locality.set` demotes the prior `primary_home` (sets `removed_at`) and adds a new row. The feed updates within the next read cycle. _Why: F029 covers the management surface; this scenario only asserts that the feed reads current state, not that Sam manages it from the feed._
- **No matching Items at all** in Sam's scope (genuinely empty area at b1 launch): empty state surfaces a "Be the first to post here" affordance routing to the gathering composer. _Why: people-first onboarding — the new Member's first signal shouldn't be "this platform is empty"; it should be "you can be the seed."_

## Assumptions

- The onboarding flow (auth + profile + locality step + interest tags) exists per b1.0 work-map.
- `places` seed data covers Oak Park, Curtis Park, Sacramento, Sacramento MSA, Folsom, Davis, West Sacramento — per `places.md` b1 seed list.
- The `discoverable_items` materialized view (per `discovery.md` T1) reads `item_locations` joined to `locations.place_id` and surfaces the place-ancestry chain.
- Hashtag / `member_interests` controlled vocabulary is seeded at b1 (per `b1-primitives-plan.md` open question on initial vocabulary).
- The Discovery T1 scorer (per `discovery.md`) is the ranking layer; this scenario asserts the **candidate set** is correctly bounded by place-interest traversal — ranking quality is a separate scenario.

## Out of Scope

- **The saved-search composer + fan-out** — b2 per ADR-21; substrate-only at b1 (see substrate-ticket note for `member_saved_searches`).
- **Member-to-Member follow** + follow-stream surface — b1 has follow substrate per `member.md` and follow-stream b2; this scenario doesn't depend on follows.
- **Group joining** as a feed-personalization signal — b1.1 covers Group join; the awareness feed in T1 doesn't yet treat Group membership as a strong feature (T3 per `discovery.md`).
- **LLM-enhanced search and consumer-wants intelligence** — per `discovery.md` *Search as the load-bearing surface* (forward note), this lands in T3.
- **The "discover" page** as a separate locality-first browse surface — b1.4 work-map item; F028 asserts the home-feed behavior, not the explore-page behavior. Likely a sibling scenario at b1.4.
