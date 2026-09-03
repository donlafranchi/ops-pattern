---
purpose: Two tabs plus a create action (Home, +, You) — what each surface does, what Explore's retirement absorbs, how the merged Home ranks, how location resolves to a stored hierarchy, and what You has to become.
layer: what
status: ratified
---

# Decision: Surface Responsibilities — Home / + / You

Two tabs and a create action. Canonical tab specs live in `product/ui/community-platform.md`; this doc names the problems in production, the fixes, and the You-tab redefinition.

**Superseded 2026-09-03:** this doc previously specified a three-tab model (Home / Explore / You) in which Home was feed-only, Explore owned search and filtering, and You was the follow-graph payoff surface. All three claims are retired. The two-tab model below replaces them.

---

## The two-tab model — RATIFIED

PM ratified 2026-09-03. The bottom nav carries **two tabs and one persistent create action**: Home, +, You.

| Slot | Job | Mental model | Primary loops |
|---|---|---|---|
| **Home** | The consumption side — everything a Member browses, searches, or filters. | "What's out there, and can I find the one thing I want?" | 1, 3, 4, 7, 8, 9 |
| **+** | Create. Always present, never nested. | "I want to put something into this." | 2, 3, 4 |
| **You** | The production/organizing side — what a Member has put into the community and how they manage it. | "What's mine, and what's happening with it?" | 2, 3, 7 |

**Home absorbs Explore entirely.** Search, the kind-filter pills (F045), and the list/map toggle all move onto Home. Home keeps its locality and interest ranking — absorbing the controls does not make Home a neutral catalog. Ambient browsing and intentional searching are the same posture over the same cards; the controls are how a Member narrows, not a second place to go.

**Explore is retired as a tab.** Home and Explore render the same cards over the same catalog; Explore only added controls on top. At current inventory density both tabs show a Member nearly the same thing, which reads as a duplicate rather than as a second mode.
Intent (Ratified 2026-09-03): A second tab has to earn its slot by showing different content, not the same content with a filter bar. Until inventory density is high enough that "browse what's near me" and "find this specific thing" return visibly different results, two tabs over one catalog costs a nav slot and teaches the Member that the app repeats itself. Reversible — if density grows, the filter controls on Home are the seed of a re-split.

**You is not the account page.** It is where a Member creates, organizes, and manages what they've put into the community. Settings live there because they have to live somewhere, not because settings are the tab's job.

---

## Create is first class — RATIFIED

A persistent **+** in the nav, sitting between the two tabs. Not a button buried on You, not a contextual affordance in the Home header.
Intent (Ratified 2026-09-03): We want people to create, and nav placement is the signal. A + in the nav says making things is a first-class act; a + you have to navigate to says creating is something you go somewhere to do. The platform's whole thesis is that Members declare things — the nav should read that way at a glance.

---

## Feed ranking — distance bands, nothing excluded — RATIFIED

PM ratified 2026-09-03. Items on the merged Home surface rank by **distance band**: nearest first, each successive band lower, online / non-physical Items last.

**This is a ranking rule, not a filter rule.** A distant Item and a place-less Item are both still present in the feed — they sit below the local ones. Nothing is excluded from the catalog for being far away or for lacking a physical place.
Intent (Ratified 2026-09-03): Proximity is the strongest relevance signal the platform has, so it should drive *order*. It should not drive *presence*. At launch density, exclusion is the more expensive error — a feed that hides rows looks like a dead platform, while a feed that runs local → distant → online teaches the Member where the edge of their locality actually is and that there is more beyond it. Ranking is also the reversible choice: bands are a sort key we can retune per market as inventory density grows, and the Member can see and scroll past the falloff. A filter that never returned the row is a decision the Member can neither see nor undo.

**What this resolves.** The open question *"do Items with no Location appear?"* — one of the three blocking the Home/Explore merge. **Answer: yes, ranked last.** `product/ui/community-platform.md` § T1 previously deferred it the other way ("Items with no Location — do not appear in the proximity index; keyword-search path at b2"). That line is retired and corrected in place; do not cite it.

### Consequence — "Online" as a first-class location option — RESOLVED 2026-09-03

*This subsection previously read "implied, NOT ratified." Superseded the same day* — Online is now a first-class declare-time choice, with a required creation-time warning and no map presence. See § Online is a location option.

Why it mattered more than an edge case: several Item kinds — **ask, offer, wonder, initiative** — may have no physical place *by nature*, not by omission. If that holds, place-less Items are not a tail; they are a large share of the catalog, and "ranked last" governs the bulk of what a Member sees. That is what makes the creation-time warning a requirement rather than a courtesy.

**A separate session is checking the Item location data model** — which kinds carry a Location, which cannot, and whether the absence is structural or incidental. **Fold its findings in here when they land**; they size the Online band, though they no longer gate the decision.

### Hard boundary vs. graded falloff — RESOLVED 2026-09-03

*This subsection previously left the tension open.* Both mechanisms retire in favour of one stored hierarchy: **nearby means same neighborhood, then metro, then state, then online.** The bands are hierarchy levels, not miles. Full entry, including what the hierarchy replaces and the "nearest location" defect it fixes: § Location resolution — geocode once, store a hierarchy.

---

## Location resolution — geocode once, store a hierarchy — RATIFIED

PM ratified 2026-09-03. Coordinate math runs **once**, at the moment an address is entered. It resolves to a **stored location hierarchy on the Item** — neighborhood, city, county, metro, state, and so on. Every subsequent query reads those stored levels. Nothing computes distance at read time.

**What it replaces — both geographic mechanisms, not one.** The unresolved tension in § Feed ranking named two coexisting systems: a Place polygon with a hard in/out boundary (point-in-polygon containment, per [`product/systems/places.md`](../../product/systems/places.md) § Reverse-geocoder) and a distance radius measured from that polygon's centre (the 1/5/10/25 mi filter, `ST_DWithin` against `discoverable_items`). **One hierarchy lookup retires both.** Nearby means *same neighborhood*, then *same metro*, then *same state*, then *online*. The distance bands in § Feed ranking are hierarchy levels — they were never really miles.

Intent (Ratified 2026-09-03): A hard boundary and a graded falloff could not be reconciled because they answer different questions with different machinery — one asks "is this inside?", the other asks "how far?". A hierarchy answers both with one question: "how many levels up do we have to walk before these two things share an ancestor?" That is legible to a Member ("this is in your neighborhood" beats "this is 2.3 miles away"), cheap at read time, and stable — an Item's neighborhood does not change when the viewer moves, so the same row can be cached, indexed, and paged. It is also the reversible choice: the resolved levels are stored data we can re-derive with a better geocoder or re-band with a different sort key, where read-time distance math bakes the model into every query. The cost is write-time correctness — a bad resolution persists until re-resolved, where a runtime computation is always current. Accepted, because addresses move far less often than viewers do.

**It fixes the "nearest location" defect, and is the fix rather than a workaround.** `discoverable_items` exposes a `nearest_location_id` that is not nearest to anything. The materialized view resolves it with a lateral `select il.location_id from item_locations il where il.item_id = i.id … order by il.created_at asc limit 1` (`web/supabase/migrations/034_discoverable_items_starts_at.sql`) — **the oldest attachment, with no distance math anywhere in the derivation.** A multi-venue Item is pinned to whichever venue happened to be attached first, regardless of where the viewer is standing; migration `033` already annotates the column as "first-location-only" and routes around it. The stored hierarchy removes the premise: an Item does not need a single "nearest" venue, because it carries its own place levels and matching happens between hierarchies, not between points.

**What already exists — do not rebuild it.** The `places` tree (`parent_id`, variable-depth, `region`/`state`/`county`/`city`/`neighborhood`) and `locations.place_id`, reverse-geocoded at Location create via `place_for_coords()`. The `metro_polygons` overlay and `members.home_metro_id` (migration `031`, on `main`). The community-awareness feed already generates candidates from "the attached Location's `place_id` *or any ancestor*" (`discovery.md` § Candidate generation, source 3). **What is new** is storing the resolved levels on the Item itself and making them the only query path — which retires the radius backstop (source 4) and the centroid-radius filter.

**What it does not change.** `location.md` § What does not ship at b1 defers address normalization and geocoding, with a State-tagged Intent (Ratified 2026-05-23). That deferral **stands.** This decision resolves *coordinates* to a *place hierarchy*; it does not normalize, validate, or canonicalize a street address, and it stands up no normalized-address store. `street_address` stays Member-authored free text.

---

## Online is a location option, and the warning is a requirement — RATIFIED

PM ratified 2026-09-03. **Online is a first-class choice at declare time.** This closes the question § Feed ranking raised and explicitly left open.

Two consequences ship with it, both **requirements, not polish**:

1. **A creation-time warning.** A Member choosing Online is told, at the moment they choose it, that Online Items rank last. Not in help text, not in a settings note — in the composer, at the point of the choice.
2. **Online Items do not appear on the map at all.** Not a pin at a fallback coordinate, not a clustered "online" marker. Absent.

Intent (Ratified 2026-09-03): Ranking a Member's Item last is a real cost we are imposing, and the warning is the only thing that makes imposing it honest. A producer who picks Online knowing it ranks last has made a trade; a producer who picks Online and then quietly gets no views has been misled by a platform that knew. That is the difference between a ranking rule and a dark pattern, and it costs one line of composer copy. Keeping Online off the map follows from the same honesty: a map pin asserts "this is here," and an Online Item is not anywhere — a fallback pin would be a lie rendered in the most literal surface the platform has. Reversible in both directions: the warning copy is tunable, and if Online inventory ever becomes the thing Members come for, the ranking is a sort key we can retune.

**Why this matters more than an edge case.** Four Item kinds — **ask, offer, wonder, initiative** — may have no physical place by nature. If that holds, Online is not a tail case; it governs a large share of the catalog, and the warning is shown to a large share of creators.

---

## Items inherit the creator's location — RATIFIED, BLOCKED ON SUBSTRATE

PM ratified 2026-09-03. An Item with no venue of its own **takes the creator's location** — it is neither excluded from the place-scoped index nor silently defaulted to Online.

Intent (Ratified 2026-09-03): The three options for a venue-less Item are exclude it, call it Online, or inherit. Exclusion contradicts the ranking rule above. Calling it Online is a lie the Member never told — an ask posted by someone in Oak Park is an Oak Park ask, and burying it below genuinely-online Items makes the local feed worse for no gain. Inheritance is the only option that keeps the Item where it actually is. Reversible: inherited levels are stored data, replaceable the moment the Member attaches a real venue.

### BLOCKED — there is nothing to inherit from today

**`members.home_location_id` is a dead column.** It exists (`002_members.sql`, FK added in `009_members_phase1.sql`) and it is **never populated and never read**. Migration `031_metro_polygons.sql` says so in its own header: the `member.locality.set` handler that would write it "does not exist and `home_location_id` is never populated." Both `place-interest-add.ts` and `place-interest-remove.ts` carry the same note inline.

**So this decision is not implementable as written.** Making it work requires **collecting a location from Members** — a new product requirement touching signup or profile, currently **scoped nowhere**. That is the dependency, and it is a real one: no scenario, no ticket, no backlog item covers it. Do not read this section as ready for `scope`.

**The partial signal that does exist.** `members.home_metro_id` is populated — backfilled and maintained from the Member's `primary_home` `member_place_interests` row via `resolve_home_metro()` (migration `031`, on `main`), which is the path onboarding actually walks. It is **metro grain only**, which is the coarsest level the ranking hierarchy uses. It could serve as an interim inheritance source; it is not a substitute for deciding what location the platform asks Members for.

### Checked against the provenance prohibition — no conflict

`item.md` § Provenance claims carries a State-tagged Intent (Ratified 2026-05-23) whose test reads: does the proposal want to auto-populate `made_at_verification_source` from another field — "the seller's jurisdiction ZIP, **the seller's home Location**, the seller's kind='business' Group anchor"? If yes, refuse.

**That prohibition is not triggered, and the reading that they are different things is correct.** It governs the *"Locally Made" provenance claim* — an affirmative Member statement about where a product was manufactured, carrying an evidence tier that climbs by attestation. Inheritance governs *where an Item is discoverable from*. Different columns, different questions, different failure modes: a wrong provenance claim is a false advertisement, a wrong discovery location is a bad sort order.

**The guard that keeps it that way:** inheritance writes the Item's stored discovery hierarchy **only**. It must never write `made_at_place_id` or `made_at_verification_source`, and it must never cause a badge to render. If an implementation ever routes creator location into the provenance columns, the 2026-05-23 prohibition applies in full and the answer is refuse.

### Open — not answered by this decision

1. **A Member who has set no location.** Inheritance fires and finds nothing. Does the Item fall to Online, stay unplaced and rank last, block publication until a location is given, or prompt for one inline? Compounded by the blocker above — at b1 this is the *common* case, not the exception.
2. **Is inherited location visible on the Item, and is it editable?** A silently-inherited place a Member cannot see or change is a place they cannot correct.
3. **At what hierarchy level does inheritance land?** A creator's neighborhood may be more precise than they want published — inheriting at neighborhood grain publishes roughly where someone lives. Metro grain is safe and nearly useless for ranking; neighborhood grain is useful and carries a privacy cost. This interacts with `member.md`'s locality-precision privacy enum (`city` / `neighborhood` / `none`) and with the platform's no-address-store commitment.

---

## Anti-patterns per surface

**Home must not contain:** recruitment pitches, profile management, or management controls for the Member's own Items (those belong on You). Home may now contain search, filter pills, the list/map toggle, and discovery rails — the former "feed-only" prohibition is retired.

**You must not contain:** recruitment banners or campaigns (the "Sell" CTA is a quiet affordance, not a pitch), empty category directories ("Events: 0, Products: 0"), a duplicate of the Home catalog, or general locality discovery content. You shows what the Member has made and manages, not what the locality is doing.

---

## Production problems and their fixes

**Problem 1 — Recruitment pitch on Explore.** Resolved by Explore's retirement. The quiet "Sell" CTA lives on You only, visible when the Member has no active business Group.

**Problem 2 — Static rails on Home.** Category grids, "Sellers near you," and "Markets near you" were slated to move to Explore. With Explore retired they stay on Home, as discovery aids or empty state alongside the search and filter controls. Home is no longer feed-only.

**Problem 3 — You tab has no reason to exist.** The You tab currently reads as a settings page with a recruitment grid stapled to the bottom. **Fix:** rebuild it as the production/organizing surface (see below).

---

## What You has to become

As the producer surface, You needs:

- **The Member's own listings** — everything they've declared, across kinds, with state (live / draft / past).
- **Their groups** — the Groups they belong to and the ones they steward, with the management path.
- **Drafts** — unfinished declarations, resumable.
- **Responses / inbound interest** — who replied, who's coming, who asked. The payoff for having made something.
- **The create path** — the same destination the nav **+** reaches, present in context.

**Almost none of this is built.** Today's You is a settings page plus a recruitment grid. This is a rebuild, not a retention — the listings view, the drafts view, the groups management view, and the responses inbox do not exist in any form today.

**Note — follow-graph payoff moves.** The earlier plan made "Upcoming from your follows" the primary You section. Under the two-tab model that content is consumption, and it belongs to Home's ranking. Scenario F047 (`scenario-F047-member-opens-you-and-sees-whats-coming-up.md`) is written against the retired definition and needs rescoping before it advances.

---

## You and the vendor/market retirement are one project

You is the tab still reading pre-rebuild vendor data — Saved, Following, the market picker, the vendor-mode link. Retiring that data guts most of what is currently on the page. Stripping the old vendor surface out of You and rebuilding it as the producer side is **a single coherent piece of work**, not two sequential ones.

Scope inventory: `planning/backlog/audit-vendor-market-retirement.md` — see § 2.1, which already flags `src/app/you/page.tsx` as rewrite-never-delete and names `SellCta` (T073/F036) and `FollowingSummary` (T108/F042) as the two shipped features it solely hosts.
Intent (Ratified 2026-09-03): Sequencing them apart means either a stripped You that shows a Member nothing for a release, or a producer surface built on top of vendor-era reads we are about to delete. One ticket lane, one rewrite.

---

## TikTok top-slider pattern — RATIFIED

PM ratified 2026-09-02 via `weigh` (Option B with amendments). The top slider is a **category-based intent switcher within Home only**, shipping at b2.

**What it is.** A horizontal swipeable tab bar at the top of the Home viewport, segmenting the feed by activity intent: Buy (products/services), Do (events/gatherings), Learn (classes/workshops), with additional categories as the Item taxonomy earns them.
Intent (Ratified 2026-09-02): Category-based ("things to buy, to do, to learn") rather than feed-mode toggle ("For You / Following") because the platform's value is *what's available locally*, not algorithmic personalization. Intent-first navigation matches the Member's opening question ("what can I do this weekend"). A For You / Following toggle implies algorithm density and follow-graph density that won't exist at b2.

**Why Home only.** You's sections are heterogeneous — a slider implies parallel views of the same content type.

**Slider vs. the absorbed Explore controls.** Home now carries both the slider and the kind-filter pills, search, and the list/map toggle. The slider segments intent; the pills filter kind within that segment. Their coexistence is unresolved at the layout level — see open questions.

**Why not a bottom-nav replacement.** The bottom nav is the structural backbone and stays. TikTok itself keeps a bottom nav *and* top tabs — the top slider is a view-mode toggle within a tab, not a replacement. The bottom nav is furniture for the less-digitally-native audience this platform serves.

**Nav proportions (b1).** The bottom nav shrinks from 52px to 44px (compact, TikTok-proportioned, icon-dominant). Full spec in design-research-thesis.md §2.

---

## Open questions

Raised by the two-tab decision, not answered by it.

1. **Visual balance of the third slot.** The nav previously held three peer tabs. With two tabs and a centered **+**, what carries the third slot's weight — is the + visually dominant (raised, filled, larger), a peer of the two tabs, or does the nav re-center around two wide targets? Affects the 44px proportion decision above.
2. **What the + opens.** A bottom sheet (kind picker, stays in context, cheap to dismiss) or a full page (room for the composer, but a harder exit). The choice sets the cost of abandoning a half-made declaration.
3. **Signed-out You.** You's purpose changed from "your follows and settings" to "what you've made." A signed-out visitor has made nothing. What does the tab show — a sign-in wall, a pitch for creating, or does the nav render differently when signed out?
4. **Where does the platform collect a Member's location, and at what grain?** The blocker under § Items inherit the creator's location. Signup, profile, or both; neighborhood, city, or metro. Scoped nowhere today.
5. **What does a Member with no location produce when inheritance fires?** Fall to Online, stay unplaced, block publication, or prompt inline. At b1 this is the common case, not the exception.
6. **Is an Item's inherited location visible and editable on the Item?**
7. **At what hierarchy level does inheritance land?** Neighborhood grain is useful for ranking and publishes roughly where the creator lives; metro grain is safe and nearly useless. Interacts with the locality-precision privacy enum in `member.md`.

**Resolved.**

- *Do Items with no Location appear?* — yes, ranked last (2026-09-03). See § Feed ranking.
- *Is "Online" a first-class location option?* — yes, with a required creation-time warning and no map presence (2026-09-03). See § Online is a location option.
- *How do the polygon's hard boundary and the radius's graded falloff coexist?* — they don't; both retire for one stored hierarchy (2026-09-03). See § Location resolution.
