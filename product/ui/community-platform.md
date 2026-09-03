---
id: what-community-platform
purpose: Home / Explore / You three-page consumer architecture.
layer: what
status: active
---

# Product: Community Platform (Home, Explore, You)

**One-line description:** The three-page consumer architecture — Home is the locality-aware activity feed, Explore is the searchable catalog, You is your identity and (if you operate in producer capacity) your producer panel.

**Hypothesis:** People feel plugged into their community when they open an app and see what's happening near them — not when they have to search. A locality-aware feed (anchored on Items declared by Members, not on Location-scoped messaging) is the surface that turns one-time discovery into a habit. Members operating in producer capacity get the same surface inverted: a place to broadcast to their followers and a panel that shows who's listening. **This explicitly is not an anonymous complaint feed** — see the accountable-participation commitment in [`../foundation/policy.md`](../foundation/policy.md). Locality drives *what shows up*; no surface routes messages by Location.

**Bundle Assignment:** b1 (T1 partial — see per-capability breakdown), b2 (T2), b3 (T3)

> **User-facing labels.** This doc uses "Event" for `items.kind = 'gathering'` and "Idea" for `items.kind = 'wonder'` per the platform-wide [Naming conventions](../../CLAUDE.md). Code references the schema name; surfaces render the UI label.

---

## Page roles (architectural decision)

| Page | Job | Mental model | Primary inspiration |
|---|---|---|---|
| **Home** | Locality-aware activity feed of time-stamped Items | "Open the app to see what's happening this week" | Reddit local subs / Instagram local discovery — without the location-locked complaint surface |
| **Explore** | Browse the full catalog — search, filter, map across Items / Members / Locations / Groups | "I'm looking for a thing" | Airbnb search results |
| **You** | Your identity, settings, and (if applicable) your Producer panel | "Manage me" | Etsy / Airbnb profile |

The labels in the nav stay simple ("Home" / "Explore" / "You") because every social app uses these — the *pattern* is what's familiar, not the words.

---

## Capabilities

| ID | Name | Tier | Status | Notes |
|----|------|------|--------|-------|
| C1 | Locality Feed (Home) | T1 | Design | Mixed cards from Items declared in the Member's locality; extend with the Event card type that covers all gathering categories (`items.kind = 'gathering'`). Folded in from the prior `capabilities/consumer-feed.md` on 2026-05-22; spec lives in the T1 Home section below. |
| ~~C2~~ | ~~Business Events~~ | — | **Archived** | Capability rewrote as: Event Items hosted by Members (schema `items.kind = 'gathering'`). The standalone "business events" framing is retired; original in `capabilities/archive/business-events.md`. |
| ~~C3~~ | ~~Business Updates~~ | — | **Archived** | Capability replaced by [`systems/producer-tools.md`](../systems/producer-tools.md) — Member-authored broadcast to followers, optional kind='business' Group branding. |
| ~~C4~~ | ~~Class / Workshop event type~~ | — | **Resolved** | Events with `category=class` or `category=workshop`. Not a separate kind. |
| ~~C5~~ | ~~Community Project event type~~ | — | **Resolved** | Events with `category=community-project` (or similar). Not a separate kind. |
| ~~C6~~ | ~~Market-as-event~~ | — | **Resolved** | A market is an Event (`items.kind = 'gathering'`). No separate "market" entity or feed-card. |
| C7 | Producer Bulletin (broadcast to followers) | T2 | Proposed | Substack-light; see [`systems/producer-tools.md`](../systems/producer-tools.md). Member-authored; gated on `member_has_standing_presence`. |
| C8 | RSVP / "I'm going" | T2 | Proposed | Event social proof, attendee count. |
| C9 | You — Member tab | T1 | Design | Follows, locality, settings. Every Member has the same surface, with selling-tool affordances appearing conditionally — visible when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item. |
| C10 | You — Seller section (conditional) | T1 | Design | Appears when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item. Entered via the "Sell" CTA (which walks the Member through kind='business' Group creation per [`../systems/groups.md`](../systems/groups.md)). List/edit Items, appearance schedule, followers count. To stop selling, the Member ends their owner-role membership; the kind='business' Group enters its 90-day dormancy window per `groups.md`. Full producer panel defers to T2 (see [`../systems/producer-tools.md`](../systems/producer-tools.md)). |
| C11 | Active locality selector | T1 | Design | Geolocate first, city-pick fallback, mutable from any locality-dependent surface. |
| C12 | Following list (folded into You) | T1 | Design | `/following` route deprecated; surfaces as a section on /you. |
| ~~C13~~ | ~~Maker activity signal (derived)~~ | — | **Resolved** | The derived `maker_signal` from the original derived-signal proposal was rejected. Standing-tier surfaces gate on `member_has_standing_presence` (per groups.md — the view returns true if the Member has ≥1 active kind='business' Group membership OR steward-role membership in any non-business Group); selling-tool surface visibility gates on the same Group / Item signals (`maker_mode_enabled` is dropped). Curation surfaces (e.g., "Featured Seller of the week") read from those signals plus engagement, not from a behavior-derived score. |

---

## Tier Summary

### T1 — MVP (b1)

**Home (locality feed):** Vertical scroll of mixed cards, scoped by the Member's locality (geolocate → city-pick fallback). Card types in MVP:

- **Event** — one card type covering farmers markets, swap meets, classes, run clubs, movie nights, community projects, etc. ("market session" is not a distinct card; it's an Event with `category=farmers-market`). Schema `items.kind = 'gathering'`.
- **Idea** — a Member's open question or curiosity declared as an Item. Schema `items.kind = 'wonder'`.
- **Seller update** — a text post from a Member who has ≥1 active kind='business' Group membership OR at least one product/service Item. The Group / Item state is the explicit gate.
- **Featured Seller of the week** — curated.
- **Followed-Member float** — content from Members the viewer follows surfaces above general locality content.

Sort = recency + locality scope. No personalization algorithm at T1; simple time + scope.

**The locality-aware-but-not-Location-scoped property is structural:** the feed surfaces Items declared by Members whose `home_location_id` is in the viewer's locality, plus Items attached to Locations in the viewer's locality, plus Items from followed Members regardless of location. There is no surface that lets anyone address "everyone in West Sac" — the accountable-participation commitment in policy.md is honored by absence.

**Explore (Locality Browse).** Folded in from the prior `capabilities/locality-browse.md` on 2026-05-22.

- Browse at `/explore` **without authentication** — no redirect, no signup wall.
- Proximity ordering against the `discoverable_items` materialized view — base tables never queried on the anonymous read path. *Retired 2026-09-03:* the read-time `ST_DWithin` computation is superseded by the stored place hierarchy, and distance is out of the product entirely (see § Distance is out below); the MV read path itself stands.
- Searchable across Items, Members, Locations, and (at b2) Groups.
- Filters at b1: kind (gathering / product / service / wonder / offer / ask — shipped as the seven-pill row `All · Events · Products · Services · Ideas · Offers · Asks`, T114), category (multi-select), schedule (any / this week / this weekend / recurring). *Distance (1/5/10/25 mi) removed 2026-09-03 — see § Distance is out below; this is a deliberate scope removal of shipped T115 work, not a defect.*
- Active filters as removable chips; filter state reflected in URL for shareable views.
- Map toggle: same result set rendered as kind-color-coded pins; tap pin → compact card → Item page.
- Location prompt (non-modal) when no location is set; geocoding autocomplete for city / neighborhood / zip.
- Pagination at 20; "Show more" at bottom.
- Empty state with "Declare something" CTA when no results.
- Back navigation restores scroll and filter state.
- The static rails currently on Home (category grid, Sellers-near-you, markets-near-you) **move to Explore as the empty state** so Home stays feed-first.

**Explore — deferred:** Personalized / algorithmic ranking (b2); saved searches (b2); full-screen map as a primary route (map is a toggle, not a separate page).

**Ranking — distance bands, nothing excluded (Ratified 2026-09-03).** Items rank by distance band — nearest first, each successive band lower, online / non-physical Items last. This is a **ranking** rule, not a filter rule: distant Items and Items with no Location are present in the results, ordered below local ones. Intent: proximity should drive order, not presence — at launch density a feed that hides rows reads as a dead platform, and a sort key stays retunable where a filter that never returned the row is invisible and un-undoable. Full entry, the implied-but-unratified "Online" question, and the unresolved polygon-boundary / distance-falloff tension: [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Feed ranking.
*Retired 2026-09-03:* this bullet previously deferred the opposite — "Items with no Location (do not appear in the proximity index; keyword-search path at b2)." Superseded by the ranking decision above.

**Distance is out (Ratified 2026-09-03).** **Nothing in the product measures or displays miles.** No radius filter, no mile count on a card, no distance sort. Ordering is **hood → metro → wider → Online**, and that hierarchy is the entire proximity model. **How "how far is it" gets answered: hand off.** The product gives the Member the address — opening in the phone's map app on mobile, copyable on web — because the map app knows the roads, the traffic, and which of the Member's addresses they are actually leaving from. **Design consequence: the address must be present and actionable on any Item that has one** — tap-to-open on mobile, copyable on web. That affordance is load-bearing; it is the only path to a distance answer. **What this deletes** (deliberate scope removal, not defect-fixing): T115's distance filter and chip; the great-circle helper in `explore/filters.ts`; all of `explore/origin.ts` and the `originAvailable` plumbing; the `sort=nearest` option. It also closes two recorded problems by deletion — the polygon-vs-radius tension (no radius remains) and the `?place=` distance-origin defect (nothing measures distance). Full entry: [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Distance is out.

**Location resolution — geocode once, store a hierarchy (Ratified 2026-09-03).** Coordinate math runs once, when an address is entered, resolving to a stored place hierarchy on the Item (neighborhood → city → county → metro → state). All querying reads those stored levels; nothing computes distance at read time. **This retires both** the Place-polygon containment test and the runtime centroid-radius filter — the distance bands above are hierarchy levels, not miles, and "nearby" means same neighborhood, then metro, then state, then online. It is also the fix for the `discoverable_items.nearest_location_id` defect (today the *oldest* attached venue, resolved with no distance math). Full entry: [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Location resolution.

**Online is a location option (Ratified 2026-09-03).** Online is a first-class choice at declare time. Two requirements ride with it: the composer **must warn the Member, at the point of choice, that Online ranks last**, and **Online Items never render on the map** — no pin, no fallback coordinate, no cluster. The warning is the honesty mechanism that makes ranking-last acceptable, not a nice-to-have. Full entry: `decision-surfaces.md` § Online is a location option.

**Location is entered at creation (Ratified 2026-09-03).** Every Item gets a location when it is created, entered by the Member: **a specific address, just a neighborhood, or Online.** What they type is the input to the geocode-once step above — entry and resolution are one pipeline, not two decisions. **Neighborhood-level entry is a privacy mechanism, not a convenience:** it is what lets a Member host an ask at their own house and publish "Riverside" instead of a street address, so the composer must offer it as a peer of the full-address option, never as a degraded fallback. *Supersedes, same day:* an earlier version had venue-less Items inherit the creator's location from `members.home_location_id`; entry at creation reaches the same outcome without depending on that dead column or on member-location collection. Full entry: [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Location is entered at creation.

**The field is required, and pre-filled from the Member's saved hoods (Ratified 2026-09-03).** A Member saves a **set** of neighborhoods — home, work, wherever they spend time — **on their profile**, editable there. The set pre-fills the location field on every creation: pick from the saved set, enter a new address or neighborhood, or Online. **A Member with one saved hood sees a single default, not a picker** — the pick affordance appears only when there is something to pick between. That is what resolves required-field friction against § Create is first class: the field arrives already filled in, so confirming costs nothing and overriding is a choice rather than a chore. Overriding to a full address is how a specific venue is handled — hood-as-default does not mean hood-only precision.

**The saved set is also what should populate Home's place switcher** — two features specified separately are one list. Confirmed against the code: `ScopePicker` today is fed an arbitrary `limit 12` of `kind='neighborhood'` places with no member relation at all, so there is no real source to displace. Confirm the substrate (`member_place_interests` already carries `primary_home` + up to five `secondary`) before ticketing.

**Metro is the feed's vantage point (Ratified 2026-09-03).** A Member saves multiple hoods, but the feed is scoped to **one metro at a time.** Hoods **within** the active metro are all active together and rank to the top of it: **your hoods first, then the rest of the metro, then wider, then Online.** Hoods **across** metros do not union — the Member picks which metro is active and switches; one is the default when hoods span several. This is what gives "nearby" an unambiguous centre now that hoods are plural, and it matches the metro-as-default feed depth already ratified in [`../systems/discovery.md`](../systems/discovery.md) § Community-awareness feed.

**So the switcher is a *metro* switcher — hoods are ranking weights, not switchable scopes.** A Member with three Sacramento hoods sees one switcher entry (Sacramento), not three. **This is a different control than shipped code and several docs describe:** `ScopePicker` today selects a `kind='neighborhood'` place and navigates to `/?place=<slug>`; `LocalityFeed` resolves the vantage point to a single Place; the "city / neighborhood / zip" autocomplete copy below and the "near-me reach control" in [`phase-0-ia-wireframes.md`](phase-0-ia-wireframes.md) both read as neighborhood-level or width-of-scope selection. Flagged, not yet rewritten.

**A metro is a core plus an outer ring, and metros mostly do not overlap (Ratified 2026-09-03).** The edge is a gradient, not a line. Sacramento, Seattle, Portland, Denver all sit in real empty space; overlap is the exception, confined to dense corridors — LA, the Bay Area, the New York area.

**Accepted risk — boundary-straddling, scoped to the dense corridors.** *Revised 2026-09-03; the earlier, broader reading of this risk is superseded.* A Member living twenty minutes from a metro line with home and work hoods on either side is still forced to switch between halves of one ordinary life, and edge-dwellers are exactly who a neighbours product should serve best — but for most of the country there is empty space between metros and no straddling to speak of. The outer ring is part of what handles it: a softer edge is materially different from being told you are in the wrong metro. Still on the books, because in the corridors where it bites it bites hard. Mitigation to consider later: union adjacent metros when a Member's own hoods straddle them. Separately, `members.home_metro_id` is **null outside every seeded CSA** (migration `031`, rural fallback), so rural Members have no metro to be the vantage point; the existing radius fallback is the working answer. **Substrate note:** `metro_polygons` carries one polygon per row at Census CSA grain, and CSAs are non-overlapping by construction — neither rings nor corridor overlap is expressible today.

**Picking a metro is an intentional act, not an ambient one (Ratified 2026-09-03).** Browsing your own hoods is checking what is near you; picking another metro is deliberately looking elsewhere ("what's going on in Portland"). **PM's read, needs confirmation:** that makes it a mode or control on the merged browse surface, **not** an argument for restoring Explore — the merged-surface decision holds. But the ambient-versus-intentional distinction is the same one that originally justified Home and Explore as separate tabs, and it has now resurfaced twice. **A third occurrence is evidence the merge is wrong** and should trigger revisiting it on its merits rather than defending it. Full entry: [`../../planning/backlog/decision-surfaces.md`](../../planning/backlog/decision-surfaces.md) § Metro is the vantage point.

**Build note — this is a default, not inheritance.** The hood is **copied onto the Item at creation and owned by the Item**; the Item must never read through to the Member's profile at display time. A Member who moves, edits, or **deletes** a saved hood must not relocate or orphan their past Items, and a per-Item override is permanent to that Item. Copy the value, do not store a reference.

**The Member picks a hood *and* a metro at signup (Ratified 2026-09-03)** — the metro explicitly, not derived from the hood. Partly redundant with geocoding, and worth it: it gives an unambiguous default and handles both the near-a-boundary hood and the Member who wants a different metro as their default. **Open:** what the active metro does when a hood is added in a new one; whether the geocode-once step is what assigns a hood to its metro; whether hoods are capped. Also open: what the inner and outer rings do differently; who owns metro boundary maintenance now that it is depended-on reference data; and whether a Member browsing another metro can create there or only read. `decision-surfaces.md` § Open questions 4–9.

**UI copy says "hood" (Ratified 2026-09-03).** *Your hoods.* Not "locality," not "area." A voice choice, not a labelling one — copy only; schema and identifiers stay as they are. The "Locality control" bullet below and the "city / neighborhood / zip" autocomplete copy above both go inconsistent when this lands; the sweep waits on the open connotation check in `decision-surfaces.md` § The user-facing word is "hood".

**Acceptance signal (Explore).** An unauthenticated visitor navigates to `/explore`, enters a location, sees a list of nearby Items without being prompted to sign up, and can reach an Item page in two taps.

**You:** Single tab in MVP (everyone is a Member; selling-tool affordances appear conditionally):

- **Locality control** (the same control surfaces on locality-dependent pages too). *Corrected 2026-09-03:* this previously said "change `home_location_id`." That column is dead — never populated, never read (migration `031` header). The live path is the Member's `primary_home` `member_place_interests` row, which drives `members.home_metro_id` via `resolve_home_metro()`. *Superseded 2026-09-03:* a Member's saved **hoods** live on their profile and are edited there — see § Location is entered at creation above. This bullet's label also goes inconsistent under the "hood" copy decision; listed, not yet rewritten.
- **Followed Members section** (replaces `/following` route).
- **Multi-Location affinities surface** (b2 — the Member's `lives` / `works` / `plays` / `visits` / `follows` / `liked` Locations, per [`../systems/member.md`](../systems/member.md)).
- **Recently viewed.**
- **Notification preferences.**
- **"Sell" CTA** — visible to Members with no active kind='business' Group membership and no kind='product'/'service' Items. Tapping it opens the kind='business' Group creation walkthrough per [`../systems/groups.md`](../systems/groups.md).
- **Conditional Seller section** — renders when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item. List/edit your Items, your appearance schedule, your followers count. To stop selling, the Member ends their owner-role Group membership; the Group enters its 90-day dormancy window per `groups.md` (there is no "pause toggle" — the Group lifecycle is the off-switch).
- **Data export** (b1 commitment) — `/you/data` JSON export of the Member's full envelope (profile, Items, follows, memberships, Assistant Context). One-tap purge action also lives there.
- **Sign out.**

**Explicitly deferred from MVP:**

- Producer Bulletin (broadcast to followers) — too much net-new infra for b1.
- RSVP — wait for Event volume to justify.
- Producer panel full dashboard (followers growth chart, profile views, insights) — at b1 the Seller section is just list/edit; the full producer-growth surface defers to T2.
- Multiple saved localities ("home + while traveling") — single mutable scope at b1; multi-scope is T3.

**Note on previously deferred items now resolved:**

- ~~Class / workshop event type~~ — these are Events with the right category, not a separate kind.
- ~~Community projects~~ — same: Events with `category=community-project` (or similar).
- ~~Active locality header pill deferred to T3~~ — superseded: locality affordance ships at b1, on locality-dependent surfaces.

### T2 — Core (b2)

**Home:** Add new card types to the feed:

- Producer bulletin posts (rich text, per [`../systems/producer-tools.md`](../systems/producer-tools.md)).
- Group activity (when a Group the Member belongs to declares an Item or posts an update).
- Location-follow activity (when a Location the Member follows hosts a new Item — the Concerts-in-the-Park surface per [`../systems/location.md`](../systems/location.md)).

Add a **category-based top slider** — a horizontal swipeable tab bar at the top of the Home viewport segmenting the feed by activity intent: Buy (products/services), Do (events/gatherings), Learn (classes/workshops), with additional categories as the Item taxonomy earns them. Replaces the prior "All / Events / Ideas / Seller updates / Bulletins" filter proposal. See design-research-thesis.md §2 for full rationale.
Intent (Ratified 2026-09-02): Intent-first navigation ("things to buy, to do, to learn") rather than content-type filters or feed-mode toggle. Matches the Member's opening question and avoids implying algorithmic personalization the platform doesn't have.

**Explore:** Add Group surfaces (`/g`, `/g/[slug]`) as filterable; calendar view option for Events.

**You:**

- **Producer panel** — see [`../systems/producer-tools.md`](../systems/producer-tools.md) for full T2 scope. Highlights: followers count + growth chart, bulletin composer, simple insights (profile views, new follows this week), Event composer. Surface gated on `member_has_standing_presence` (kind='business' Group steward/owner OR steward-role in any non-business Group).
- **Group panel** — for Members with active Group memberships: a list of Groups, role per Group, quick links to compose for the Group (per `groups.md`).

**Producer Bulletin:** A Member operating in producer capacity composes a post → all their Member-followers receive it (in-app card on Home + email digest). See [`../systems/producer-tools.md`](../systems/producer-tools.md) for tiered scope.

### T3 — Polish (b3)

**Home feed:**

- Personalized ranking algorithm (signal: follows, supports, views, time of day, locality affinity strength).
- Push notifications for high-priority Items (a followed producer published, a followed Location hosts something soon, a Group the Member belongs to has new activity).
- Saved/bookmarked Items.
- Long-form producer stories that take a feed slot.

**You:**

- **DM inbox** — the `member_threads` substrate (per [`../systems/member.md`](../systems/member.md)) surfaces here. Messaging is item-or-group-scoped per the accountable-participation commitment; the inbox renders threads keyed by Item or Group.
- Multiple saved localities ("home" + "while traveling").
- Active locality header pill if/when travel-mode demand becomes real.
- Activity log (the Member's own supports, shares, RSVPs, pledges).

**Producer panel:** Full Etsy/Substack-tier dashboard. See [`../systems/producer-tools.md`](../systems/producer-tools.md) T3.

---

## Open Questions

- Does "Featured Seller of the week" stay manual (curated by PM) or become algorithmic in T2?
- Is there a "post anything" capability for individual Members (beyond producer bulletins), or does the platform's broadcast surface stay producer-gated to avoid the anonymous-complaint-feed noise pattern? Working answer: Ideas are the universal Member-authored broadcast; bulletins are producer-gated. Confirm at T2 surface design.
- Do community projects need a separate "host" entity, or do they always attach to a Member or a Group? Working answer: an Event (`items.kind = 'gathering'`) with `category=community-project` can be hosted by an individual Member or by a Group; no new entity needed.
- Email digest cadence for bulletins — daily? weekly? per-post? Working answer: weekly digest of bulletins from followed producers, but per-bulletin email for opt-in Members. Confirm at T2.

---

## Changelog

**2026-05-11** — Phase 4 cleanup pass. Replaced "anonymous-feed-style location-locked feed" hypothesis framing with locality-aware-but-not-Location-scoped framing aligned with the accountable-participation commitment in policy.md. Replaced "Shopper tab" / "Business tab" with "Member tab" / "Producer panel" throughout. Replaced "vendor" references with "Member operating in producer capacity" / "producer Member." Updated C10 to reference kind='business' Group creation walkthrough rather than the retired `member-operations.md`. Archived C2 (Business Events) and C3 (Business Updates) as obsolete framings; their successors are gathering Items and producer-tools.md respectively. Added Group/Location-follow card types to T2 feed. Added Group panel to T2 You-tab. Added DM inbox to T3 You-tab. Added data export to T1 You-tab (already exists at b1 substrate).

**2026-05-08** — Three decision alignments. Maker profile is implicit (no toggle); /You renders Maker sections conditionally on product Item activity. C9 renamed to "Member tab"; C10 reframed; C13 added for the derived activity signal. Locality default is geolocate-then-city-pick, mutable from any locality-dependent surface — supersedes the prior /you-only decision on C11. A market is a Gathering Item; gathering is broad and varied (farmers markets, swap meets, classes, workshops, community projects, etc.) — C4, C5, C6 resolved as gathering categories rather than separate event types. "Market session" feed-card type removed; one gathering card covers all categories.

**2026-04-25** — Initial product file. Consolidates Home/Explore/You roles, decides location selector lives on /you (not header), defers Bulletin and event-type expansion to T2.
