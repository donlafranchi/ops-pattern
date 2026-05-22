# Product: Community Platform (Home, Explore, You)

**One-line description:** The three-page consumer architecture — Home is the locality-aware activity feed, Explore is the searchable catalog, You is your identity and (if you operate in producer capacity) your producer panel.

**Hypothesis:** People feel plugged into their community when they open an app and see what's happening near them — not when they have to search. A locality-aware feed (anchored on Items declared by Members, not on Location-scoped messaging) is the surface that turns one-time discovery into a habit. Members operating in producer capacity get the same surface inverted: a place to broadcast to their followers and a panel that shows who's listening. **This is explicitly not Nextdoor** — see the anti-Nextdoor commitment in [`../foundation/policy.md`](../foundation/policy.md). Locality drives *what shows up*; no surface routes messages by Location.

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
| C1 | [Locality Feed](../capabilities/consumer-feed.md) | T1 | Design | Mixed cards from Items declared in the Member's locality; extend with the Event card type that covers all gathering categories (ADR-5 — `items.kind = 'gathering'`). |
| ~~C2~~ | ~~Business Events~~ | — | **Archived** | Capability rewrote as: Event Items hosted by Members (per ADR-5; schema `items.kind = 'gathering'`). The standalone "business events" framing is retired; original in `capabilities/archive/business-events.md`. |
| ~~C3~~ | ~~Business Updates~~ | — | **Archived** | Capability replaced by [`systems/producer-tools.md`](../systems/producer-tools.md) — Member-authored broadcast to followers, optional kind='business' Group branding. |
| ~~C4~~ | ~~Class / Workshop event type~~ | — | **Resolved by ADR-5** | Events with `category=class` or `category=workshop`. Not a separate kind. |
| ~~C5~~ | ~~Community Project event type~~ | — | **Resolved by ADR-5** | Events with `category=community-project` (or similar). Not a separate kind. |
| ~~C6~~ | ~~Market-as-event~~ | — | **Resolved by ADR-5** | A market is an Event (`items.kind = 'gathering'`). No separate "market" entity or feed-card. |
| C7 | Producer Bulletin (broadcast to followers) | T2 | Proposed | Substack-light; see [`systems/producer-tools.md`](../systems/producer-tools.md). Member-authored; gated on `member_has_standing_presence` (per ADR-12 + ADR-13). |
| C8 | RSVP / "I'm going" | T2 | Proposed | Event social proof, attendee count. |
| C9 | You — Member tab | T1 | Design | Follows, locality, settings. Every Member has the same surface, with selling-tool affordances appearing conditionally per ADR-12 SUPERSEDED 2026-05-12 — visible when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item. |
| C10 | You — Seller section (conditional) | T1 | Design | **Per ADR-12 SUPERSEDED 2026-05-12:** appears when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item. Entered via the "Sell" CTA (which walks the Member through kind='business' Group creation per [`../systems/groups.md`](../systems/groups.md)). List/edit Items, appearance schedule, followers count. To stop selling, the Member ends their owner-role membership; the kind='business' Group enters its 90-day dormancy window per `groups.md`. Full producer panel defers to T2 (see [`../systems/producer-tools.md`](../systems/producer-tools.md)). |
| C11 | Active locality selector | T1 | Design | **Per ADR-4:** geolocate first, city-pick fallback, mutable from any locality-dependent surface. |
| C12 | Following list (folded into You) | T1 | Design | `/following` route deprecated; surfaces as a section on /you. |
| ~~C13~~ | ~~Maker activity signal (derived)~~ | — | **Resolved by ADR-12 SUPERSEDED 2026-05-12** | The derived `maker_signal` from the original ADR-3 was rejected. Standing-tier surfaces gate on `member_has_standing_presence` (per groups.md — the view returns true if the Member has ≥1 active kind='business' Group membership OR steward-role membership in any non-business Group); selling-tool surface visibility gates on the same Group / Item signals (`maker_mode_enabled` is dropped). Curation surfaces (e.g., "Featured Seller of the week") read from those signals plus engagement, not from a behavior-derived score. |

---

## Tier Summary

### T1 — MVP (b1)

**Home (locality feed):** Vertical scroll of mixed cards, scoped by the Member's locality (geolocate → city-pick fallback per ADR-4). Card types in MVP:

- **Event** — one card type covering farmers markets, swap meets, classes, run clubs, movie nights, community projects, etc. (per ADR-5 — "market session" is not a distinct card; it's an Event with `category=farmers-market`). Schema `items.kind = 'gathering'`.
- **Idea** — a Member's open question or curiosity declared as an Item. Schema `items.kind = 'wonder'`.
- **Seller update** — a text post from a Member who has ≥1 active kind='business' Group membership OR at least one product/service Item. The Group / Item state is the explicit gate per ADR-12 SUPERSEDED 2026-05-12.
- **Featured Seller of the week** — curated.
- **Followed-Member float** — content from Members the viewer follows surfaces above general locality content.

Sort = recency + locality scope. No personalization algorithm at T1; simple time + scope.

**The locality-aware-but-not-Location-scoped property is structural:** the feed surfaces Items declared by Members whose `home_location_id` is in the viewer's locality, plus Items attached to Locations in the viewer's locality, plus Items from followed Members regardless of location. There is no surface that lets anyone address "everyone in West Sac" — the anti-Nextdoor commitment in policy.md is honored by absence.

**Explore:** Search, category filter, day filter, locality filter, list/map toggle. Searchable across Items, Members, Locations, and (at b2) Groups. The static rails currently on Home (category grid, Sellers-near-you, markets-near-you) **move to Explore as the empty state** so Home stays feed-first.

**You:** Single tab in MVP (everyone is a Member; selling-tool affordances appear conditionally per ADR-12 SUPERSEDED 2026-05-12):

- **Locality control** (change `home_location_id`; the same control surfaces on locality-dependent pages too — per ADR-4).
- **Followed Members section** (replaces `/following` route).
- **Multi-Location affinities surface** (b2 — the Member's `lives` / `works` / `plays` / `visits` / `follows` / `liked` Locations, per [`../systems/member.md`](../systems/member.md)).
- **Recently viewed.**
- **Notification preferences.**
- **"Sell" CTA** (per ADR-12 SUPERSEDED 2026-05-12) — visible to Members with no active kind='business' Group membership and no kind='product'/'service' Items. Tapping it opens the kind='business' Group creation walkthrough per [`../systems/groups.md`](../systems/groups.md).
- **Conditional Seller section** — renders when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item. List/edit your Items, your appearance schedule, your followers count. To stop selling, the Member ends their owner-role Group membership; the Group enters its 90-day dormancy window per `groups.md` (there is no "pause toggle" — the Group lifecycle is the off-switch).
- **Data export** (per ADR-6 b1 commitment) — `/you/data` JSON export of the Member's full envelope (profile, Items, follows, memberships, Assistant Context). One-tap purge action also lives there.
- **Sign out.**

**Explicitly deferred from MVP:**

- Producer Bulletin (broadcast to followers) — too much net-new infra for b1.
- RSVP — wait for Event volume to justify.
- Producer panel full dashboard (followers growth chart, profile views, insights) — at b1 the Seller section is just list/edit; the full producer-growth surface defers to T2.
- Multiple saved localities ("home + while traveling") — single mutable scope at b1 (ADR-4); multi-scope is T3.

**Note on previously deferred items now resolved by ADR:**

- ~~Class / workshop event type~~ — per ADR-5 these are Events with the right category, not a separate kind.
- ~~Community projects~~ — same: Events with `category=community-project` (or similar).
- ~~Active locality header pill deferred to T3~~ — superseded by ADR-4: locality affordance ships at b1, on locality-dependent surfaces.

### T2 — Core (b2)

**Home:** Add new card types to the feed:

- Producer bulletin posts (rich text, per [`../systems/producer-tools.md`](../systems/producer-tools.md)).
- Group activity (when a Group the Member belongs to declares an Item or posts an update).
- Location-follow activity (when a Location the Member follows hosts a new Item — the Concerts-in-the-Park surface per [`../systems/location.md`](../systems/location.md)).

Add filters at top of feed: All / Events / Ideas / Seller updates / Bulletins.

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

- **DM inbox** — the `member_threads` substrate (per [`../systems/member.md`](../systems/member.md)) surfaces here. Messaging is item-or-group-scoped per the anti-Nextdoor commitment; the inbox renders threads keyed by Item or Group.
- Multiple saved localities ("home" + "while traveling").
- Active locality header pill if/when travel-mode demand becomes real.
- Activity log (the Member's own supports, shares, RSVPs, pledges).

**Producer panel:** Full Etsy/Substack-tier dashboard. See [`../systems/producer-tools.md`](../systems/producer-tools.md) T3.

---

## Open Questions

- Does "Featured Seller of the week" stay manual (curated by PM) or become algorithmic in T2?
- Is there a "post anything" capability for individual Members (beyond producer bulletins), or does the platform's broadcast surface stay producer-gated to avoid the Nextdoor-style noise pattern? Working answer: Ideas are the universal Member-authored broadcast; bulletins are producer-gated. Confirm at T2 surface design.
- Do community projects need a separate "host" entity, or do they always attach to a Member or a Group? Working answer: an Event (`items.kind = 'gathering'`) with `category=community-project` can be hosted by an individual Member or by a Group; no new entity needed.
- Email digest cadence for bulletins — daily? weekly? per-post? Working answer: weekly digest of bulletins from followed producers, but per-bulletin email for opt-in Members. Confirm at T2.

---

## Changelog

**2026-05-11** — Phase 4 cleanup pass. Replaced "Nextdoor-style location-locked feed" hypothesis framing with locality-aware-but-not-Location-scoped framing aligned with the anti-Nextdoor commitment in policy.md. Replaced "Shopper tab" / "Business tab" with "Member tab" / "Producer panel" throughout. Replaced "vendor" references with "Member operating in producer capacity" / "producer Member." Updated C10 to reference kind='business' Group creation walkthrough (per ADR-13) rather than the retired `member-operations.md`. Archived C2 (Business Events) and C3 (Business Updates) as obsolete framings; their successors are gathering Items (per ADR-5) and producer-tools.md respectively. Added Group/Location-follow card types to T2 feed. Added Group panel to T2 You-tab. Added DM inbox to T3 You-tab. Added data export to T1 You-tab (already exists at b1 substrate per ADR-6).

**2026-05-08** — Three ADR alignments. ADR-3: Maker profile is implicit (no toggle); /You renders Maker sections conditionally on product Item activity. C9 renamed to "Member tab"; C10 reframed; C13 added for the derived activity signal. ADR-4: locality default is geolocate-then-city-pick, mutable from any locality-dependent surface — supersedes the prior /you-only decision on C11. ADR-5: a market is a Gathering Item; gathering is broad and varied (farmers markets, swap meets, classes, workshops, community projects, etc.) — C4, C5, C6 resolved as gathering categories rather than separate event types. "Market session" feed-card type removed; one gathering card covers all categories.

**2026-04-25** — Initial product file. Consolidates Home/Explore/You roles, decides location selector lives on /you (not header), defers Bulletin and event-type expansion to T2.
