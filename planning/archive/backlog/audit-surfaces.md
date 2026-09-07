---
purpose: Define what each of the three tabs (Home, Explore, You) does — distinct responsibilities, minimal overlap.
layer: what
status: draft
---

# Surfaces Audit: Home / Explore / You

Three tabs, three jobs, zero overlap. This doc names what each tab is, what it isn't, and what question a Member has when they open it.

---

## Home

**Job:** Show what's happening near you right now, from the people and things you care about.

**Mental model:** "I'm opening the app to see what's new." The Member isn't searching for anything specific — they're checking in. The analog is opening a local newspaper or walking down a street where things are happening.

**What belongs here:**

- Time-stamped feed of Items in the Member's locality (Events, Seller updates, Ideas)
- Followed-Member content floated above general locality content
- Featured Seller of the week (curated)
- Contextual "+" create icon in the header (quiet, top-right)
- At T2: bulletin posts, Group activity, Location-follow activity (Concerts-in-the-Park surface)
- At T2: feed-level filters (All / Events / Ideas / Seller updates / Bulletins)

**What does NOT belong here:**

- Category grids, "Sellers near you" rails, or "Markets near you" carousels (these are Explore's empty state — move them there)
- Search bar or filter controls (that's Explore's job)
- Recruitment pitches ("Start selling!" "Host an event!") — those belong on You
- Profile management, settings, or identity surfaces
- Any static directory-style content

**Loops served:** 1 (Find your people), 3 (Land here), 4 (Gather regularly), 8 (Follow what you love — the feed side). Home is primarily Family 1 (Gathering) and the consumption half of Family 3 (Trade).

---

## Explore

**Job:** Find a specific thing — search, filter, browse the full catalog by location and kind.

**Mental model:** "I'm looking for something." The Member has intent: a plumber, a farmers market this Saturday, sourdough near Oak Park, a run club. They want to query, filter, and drill into results. The analog is walking into a building with a directory and knowing you're looking for something on it.

**What belongs here:**

- Compact search pill at top (location + search + filter icon) — sticky on scroll
- Proximity-sorted results from `discoverable_items` (no auth required)
- Filters: kind (product / service / gathering / wonder), category, distance, schedule
- Active filters as removable chips; filter state in URL for shareable views
- Map toggle (same result set as kind-color-coded pins)
- Kind-filter pills anchored at the bottom, above the nav bar (per design thesis — thumb-reachable)
- Location prompt when none is set
- Static rails (category grid, Sellers-near-you, markets-near-you) as the **empty state** — moved from Home
- At b2: Group surfaces, calendar view for Events, saved searches

**What does NOT belong here:**

- A feed of time-stamped updates (that's Home's job)
- Followed-Member content or personalized recommendations (that's Home)
- Recruitment pitches ("Become a seller!") — Explore is for finding, not for converting
- Profile, settings, or identity management
- Any content that requires authentication to view (Explore is the public front door — no signup wall)

**Loops served:** 3 (Land here), 7 (Make and be found — the discovery side), 9 (Find a local pro). Explore is the consumption surface for Cluster 3 (Browse) — the locality-first index that serves newcomers, curious browsers, and anyone with a specific need.

---

## You

**Job:** Show what's coming up from what you care about — your favorites, your recurring engagement, your identity on the platform.

**Mental model:** "What's mine?" The Member opens You to see upcoming things from people they follow, events they attend, producers they buy from. Secondarily: manage their profile, settings, and (if applicable) selling tools. The analog is checking your own calendar and address book — not reading a magazine.

**What belongs here:**

- **Upcoming from your follows** — next events from followed organizers, next drops from followed producers, recent activity from followed Members. This is the primary content section. The You tab earns daily opens by answering "what's coming up from what I care about."
- **Your follows** — the people, Groups, and Locations you follow, organized as horizontal scroll strips with section headers ("Following," "Your Groups," "Saved Locations"). Replaces the deprecated `/following` route.
- **Recently viewed** — quick re-access to things you've looked at.
- **Locality control** — change `home_location_id` (also available on locality-dependent surfaces elsewhere).
- **Conditional Seller section** — appears when the Member has ≥1 active kind='business' Group membership or kind='product'/'service' Items. List/edit Items, appearance schedule, followers count.
- **"Sell" CTA** — visible only to Members with no active business Group and no product/service Items. Walks them through Group creation.
- **"Create something" entry point** — contextual, kind-aware ("Add a product," "Host another event").
- **Notification preferences.**
- **Data export** (`/you/data`).
- **Sign out.**
- At T2: producer panel (dashboard, bulletin composer, insights), Group panel, multi-Location affinities
- At T3: DM inbox, activity log, multiple saved localities

**What does NOT belong here:**

- Recruitment pitches aimed at converting browsers into sellers (the "Sell" CTA is a quiet affordance, not a banner or campaign)
- Empty category directories ("Events: 0, Products: 0, Services: 0") — if there's nothing to show, show nothing
- A duplicate of the Home feed or the Explore catalog
- Content visible to unauthenticated users (You is the only auth-gated tab)
- General locality discovery content — You shows things from *your* graph, not from the locality at large

**Loops served:** 8 (Follow what you love — the retention side), 7 (Make and be found — the producer-management side). You is where Loop 8's follow investment pays off: the Member followed a baker three weeks ago, and now You shows "Maya posted: fresh sourdough Saturday 8am."

---

## Overlap audit — current production issues

The existing production build has three problems this audit addresses:

**Problem 1: Recruitment pitch appears on both Explore and You.** The "Start selling" pitch is a You-tab affordance (the "Sell" CTA). It should not appear on Explore. Explore is the public catalog — unauthenticated, search-forward, no conversion pressure. Fix: remove from Explore; keep as a quiet CTA on You only.

**Problem 2: Static rails on Home compete with the feed.** Category grids, "Sellers near you," and "Markets near you" are browse-mode content that belongs on Explore (as the empty state or as discovery aids). On Home, they crowd the feed and confuse the tab's job. Fix: move to Explore's empty state; Home is feed-only.

**Problem 3: You tab doesn't surface follow-graph value.** The You tab currently reads as a settings page with a recruitment pitch. It should be the surface that makes following worthwhile — "here's what's coming up from the people you chose to follow." Without this, Loop 8 (Follow what you love) has no payoff surface. Fix: lead with "Upcoming from your follows" as the primary content section.

---

## TikTok top-slider pattern — assessment

The PM raised TikTok's top-slider as a possible alternative: horizontal swipeable tabs at the top of the viewport (like "For You" / "Following" / "Explore") that could replace or supplement the bottom nav.

**Where it fits:** as a *sub-navigation within a tab*, not as a replacement for the bottom nav. Concretely:

- **Home could use a top slider** to toggle between "For You" (the locality feed) and "Following" (content exclusively from followed Members/Groups). This is the TikTok pattern directly — two views of the same content pool, filtered by relationship. It would give the follow graph an immediate, visible payoff without overloading the You tab.
- **Explore already has this** in the form of the bottom-anchored kind-filter pills (Events / Products / Services / Ideas). A top slider would duplicate the function and compete with the search bar for viewport space.
- **You doesn't need it.** The You tab's sections are heterogeneous (follows, settings, seller tools) — a slider implies parallel views of the same content type, which isn't the shape here.

**Recommendation:** Consider a Home-level top slider ("For You" / "Following") as a b2 surface, once the follow graph has enough density to populate a "Following" feed. At b1, the followed-Member float within the single Home feed is sufficient. Do not replace the three-tab bottom nav — the bottom nav is the structural backbone (three irreducible surfaces), and a top slider is a view-mode toggle within one of them.

---

## Summary table

| | Home | Explore | You |
|---|---|---|---|
| **Job** | What's happening near you | Find a specific thing | What's coming up from what you care about |
| **Auth required** | Yes (at b1) | No | Yes |
| **Content shape** | Time-stamped feed | Search results / catalog | Follow-graph payoff + identity management |
| **Primary loops** | 1, 3, 4, 8 | 3, 7, 9 | 7, 8 |
| **User posture** | Ambient — checking in | Intentional — searching | Personal — managing, anticipating |
| **Engagement mode** | Browse what's new | Query what exists | Review what's mine |
