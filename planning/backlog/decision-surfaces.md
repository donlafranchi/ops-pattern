---
purpose: Two tabs plus a create action (Home, +, You) — what each surface does, what Explore's retirement absorbs, how the merged Home ranks, how a Member enters an Item's location and how it resolves to a stored hierarchy, and what You has to become.
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

**This is a ranking rule, not a filter rule.** A distant Item and an Online Item are both still present in the feed — they sit below the local ones. Nothing is excluded from the catalog for being far away or for being Online.

**Reconciled 2026-09-03 — this is a rule about Online, not about absence.** When this entry was written, "Items with no Location" was a live state and the rule governed it. It no longer is: every Item is given a location at creation, and **Online is the explicit opt-out rather than an absence** (§ Location is entered at creation). So the bottom band is *Online Items*, chosen as such by their creator and warned about it at the time. An Item with genuinely no location should not occur on the create path; if one appears, it is a defect to fix at the source, not a case for the ranker to interpret. Read the two entries as one rule: **items rank by hierarchy proximity, and Online ranks last.**
Intent (Ratified 2026-09-03): Proximity is the strongest relevance signal the platform has, so it should drive *order*. It should not drive *presence*. At launch density, exclusion is the more expensive error — a feed that hides rows looks like a dead platform, while a feed that runs local → distant → online teaches the Member where the edge of their locality actually is and that there is more beyond it. Ranking is also the reversible choice: bands are a sort key we can retune per market as inventory density grows, and the Member can see and scroll past the falloff. A filter that never returned the row is a decision the Member can neither see nor undo.

**What this resolves.** The open question *"do Items with no Location appear?"* — one of the three blocking the Home/Explore merge. **Answer: yes, ranked last** — and, after the creation-entry decision, the state that question was asking about is now *Online*. `product/ui/community-platform.md` § T1 previously deferred it the other way ("Items with no Location — do not appear in the proximity index; keyword-search path at b2"). That line is retired and corrected in place; do not cite it.

### Consequence — "Online" as a first-class location option — RESOLVED 2026-09-03

*This subsection previously read "implied, NOT ratified." Superseded the same day* — Online is now one of the three choices a Member makes at creation, with a required warning and no map presence. See § Online is a location option and § Location is entered at creation.

Why it mattered more than an edge case: several Item kinds — **ask, offer, wonder, initiative** — have no venue of their own. Under creation-entry those are not place-less; they are the Items whose creator most often enters a neighborhood (frequently their own) or picks Online. Either way the choice is made by a person, not left as a gap — which is what makes the warning a requirement rather than a courtesy.

**A separate session is checking the Item location data model** — which kinds carry a Location and which cannot. **Fold its findings in here when they land**; they size the Online band, though they no longer gate any decision.

### Hard boundary vs. graded falloff — RESOLVED 2026-09-03

*This subsection previously left the tension open.* Both mechanisms retire in favour of one stored hierarchy: **nearby means same neighborhood, then metro, then state, then online.** The bands are hierarchy levels, not miles. Full entry, including what the hierarchy replaces and the "nearest location" defect it fixes: § Location resolution — geocode once, store a hierarchy.

---

## Location resolution — geocode once, store a hierarchy — RATIFIED

PM ratified 2026-09-03. Coordinate math runs **once**, at the moment an address is entered. It resolves to a **stored location hierarchy on the Item** — neighborhood, city, county, metro, state, and so on. Every subsequent query reads those stored levels. Nothing computes distance at read time.

**The input is what the Member typed.** This step and § Location is entered at creation are one pipeline, not two decisions: *Member enters address or neighborhood → resolve once → store levels → rank by levels.* A neighborhood entry resolves to a shallower hierarchy than a street address; Online skips resolution entirely.

**What it replaces — both geographic mechanisms, not one.** The unresolved tension in § Feed ranking named two coexisting systems: a Place polygon with a hard in/out boundary (point-in-polygon containment, per [`product/systems/places.md`](../../product/systems/places.md) § Reverse-geocoder) and a distance radius measured from that polygon's centre (the 1/5/10/25 mi filter, `ST_DWithin` against `discoverable_items`). **One hierarchy lookup retires both.** Nearby means *same neighborhood*, then *same metro*, then *same state*, then *online*. The distance bands in § Feed ranking are hierarchy levels — they were never really miles.

Intent (Ratified 2026-09-03): A hard boundary and a graded falloff could not be reconciled because they answer different questions with different machinery — one asks "is this inside?", the other asks "how far?". A hierarchy answers both with one question: "how many levels up do we have to walk before these two things share an ancestor?" That is legible to a Member ("this is in your neighborhood" beats "this is 2.3 miles away"), cheap at read time, and stable — an Item's neighborhood does not change when the viewer moves, so the same row can be cached, indexed, and paged. It is also the reversible choice: the resolved levels are stored data we can re-derive with a better geocoder or re-band with a different sort key, where read-time distance math bakes the model into every query. The cost is write-time correctness — a bad resolution persists until re-resolved, where a runtime computation is always current. Accepted, because addresses move far less often than viewers do.

**It fixes the "nearest location" defect, and is the fix rather than a workaround.** `discoverable_items` exposes a `nearest_location_id` that is not nearest to anything. The materialized view resolves it with a lateral `select il.location_id from item_locations il where il.item_id = i.id … order by il.created_at asc limit 1` (`web/supabase/migrations/034_discoverable_items_starts_at.sql`) — **the oldest attachment, with no distance math anywhere in the derivation.** A multi-venue Item is pinned to whichever venue happened to be attached first, regardless of where the viewer is standing; migration `033` already annotates the column as "first-location-only" and routes around it. The stored hierarchy removes the premise: an Item does not need a single "nearest" venue, because it carries its own place levels and matching happens between hierarchies, not between points.

**What already exists — do not rebuild it.** The `places` tree (`parent_id`, variable-depth, `region`/`state`/`county`/`city`/`neighborhood`) and `locations.place_id`, reverse-geocoded at Location create via `place_for_coords()`. The `metro_polygons` overlay and `members.home_metro_id` (migration `031`, on `main`). The community-awareness feed already generates candidates from "the attached Location's `place_id` *or any ancestor*" (`discovery.md` § Candidate generation, source 3). **What is new** is storing the resolved levels on the Item itself and making them the only query path — which retires the radius backstop (source 4) and the centroid-radius filter.

**What it does not change.** `location.md` § What does not ship at b1 defers address normalization and geocoding, with a State-tagged Intent (Ratified 2026-05-23). That deferral **stands.** This decision resolves *coordinates* to a *place hierarchy*; it does not normalize, validate, or canonicalize a street address, and it stands up no normalized-address store. `street_address` stays Member-authored free text.

---

## Online is a location option, and the warning is a requirement — RATIFIED

PM ratified 2026-09-03. **Online is one of the three choices a Member makes when entering an Item's location** (§ Location is entered at creation) — the explicit opt-out, chosen, not left blank. This closes the question § Feed ranking raised and explicitly left open.

Two consequences ship with it, both **requirements, not polish**:

1. **A creation-time warning.** A Member choosing Online is told, at the moment they choose it, that Online Items rank last. Not in help text, not in a settings note — in the composer, at the point of the choice.
2. **Online Items do not appear on the map at all.** Not a pin at a fallback coordinate, not a clustered "online" marker. Absent.

Intent (Ratified 2026-09-03): Ranking a Member's Item last is a real cost we are imposing, and the warning is the only thing that makes imposing it honest. A producer who picks Online knowing it ranks last has made a trade; a producer who picks Online and then quietly gets no views has been misled by a platform that knew. That is the difference between a ranking rule and a dark pattern, and it costs one line of composer copy. Keeping Online off the map follows from the same honesty: a map pin asserts "this is here," and an Online Item is not anywhere — a fallback pin would be a lie rendered in the most literal surface the platform has. Reversible in both directions: the warning copy is tunable, and if Online inventory ever becomes the thing Members come for, the ranking is a sort key we can retune.

**Why this matters more than an edge case.** Four Item kinds — **ask, offer, wonder, initiative** — have no venue of their own, and their creators reach this choice every time. Online is not a tail case; the warning is shown to a large share of creators, and the alternative sitting right next to it is a neighborhood — which is usually the truer answer and the one the privacy mechanism exists to make safe.

---

## Location is entered at creation — RATIFIED

PM ratified 2026-09-03. **Every Item gets a location when it is created, entered by the Member.** Three choices, the Member's call:

| Choice | What it means | Where it ranks |
|---|---|---|
| **A specific address** | A street address — including the Member's own home. | By hierarchy, from the resolved neighborhood up. |
| **A neighborhood** | Just the neighborhood, no street. | By hierarchy, from the neighborhood up. |
| **Online** | An explicit declaration that the Item is not anywhere. | Last. See § Online is a location option. |

Intent (Ratified 2026-09-03): Asking the Member is the shortest path to a correct answer. Every alternative — inferring, inheriting, defaulting — is the platform guessing at something the Member already knows and could have typed in one field. Entry also puts the Member in control of precision, which is what makes the home-address case workable at all (below). Reversible: an entered location is stored data the Member can change, and the entry surface is one composer field we can restyle, pre-fill, or make optional without touching the model underneath.

### Neighborhood-level entry is the privacy mechanism — not a convenience

Letting a Member enter *just a neighborhood* is deliberate and load-bearing. It is what lets someone host an ask at their own house and publish "Riverside" instead of their street address.

Intent (Ratified 2026-09-03): At-my-house Items — asks, offers, a tool to borrow, a table of extra tomatoes — are among the most ordinary things a neighbor does, and they are exactly the Items whose location is the Member's home. Without a coarse-grained option the platform offers two bad choices: publish your address or don't post. Most people correctly choose don't post, and the platform loses the entire class of neighborly exchange it exists to enable. Neighborhood grain is precise enough to rank and to be useful to someone nearby, and coarse enough that publishing it costs nothing. **This is why the coarse option is not optional** — remove it and the at-my-house case disappears with it. Coordination on the exact spot happens in messaging, between two people who have already agreed to it, which is where an address belongs.

This also holds the line on the b1 no-address-store commitment in `location.md` and `member.md`: a Member who never wants a street address in the system never has to enter one.

### Inheritance was considered and replaced

*Superseded 2026-09-03, same day.* An earlier version of this decision had venue-less Items **inherit the creator's location** from `members.home_location_id`, and was recorded as blocked: that column is dead — never populated, never read; the `member.locality.set` handler that would write it does not exist (migration `031_metro_polygons.sql` header, plus inline notes in `place-interest-add.ts` / `place-interest-remove.ts`). Inheritance therefore required standing up member-location collection at signup or in profile, a new requirement scoped nowhere.

**Entry at creation reaches the same outcome and needs none of that.** The Item ends up correctly placed either way; inheritance got there by requiring a second, unbuilt system and by guessing, while entry asks the one person who knows. The dead column is **no longer a blocker or a dependency** for Item location, and the question of what a Member with no location set produces does not arise — there is no member-location read on this path.

### Entry and geocode-once are one pipeline

The address or neighborhood the Member types **is the input to the geocode-once step**. Entry resolves once, at creation, into the stored hierarchy (§ Location resolution); every query afterwards reads those stored levels. These are not two decisions that happen to touch — they are the write half and the read half of one path: *Member enters → resolve once → store levels → rank by levels.* A neighborhood entry resolves to a shallower hierarchy than a street address; both store the same shape.

### Checked against the provenance prohibition — no conflict

`item.md` § Provenance claims carries a State-tagged Intent (Ratified 2026-05-23) whose test reads: does the proposal want to auto-populate `made_at_verification_source` from another field — the seller's jurisdiction ZIP, the seller's home Location, the seller's kind='business' Group anchor? If yes, refuse.

**Not triggered.** That prohibition governs the *"Locally Made" provenance claim* — an affirmative statement about where a product was manufactured, carrying an evidence tier that climbs by attestation. Item location answers *where the Item is discoverable from*. Different columns, different questions, different failure modes: a wrong provenance claim is a false advertisement, a wrong discovery location is a bad sort order. Member-entered location strengthens the separation — nothing is being derived from anything.

**The guard that keeps it that way:** the location entry writes the Item's stored discovery hierarchy **only**. It must never write `made_at_place_id` or `made_at_verification_source`, and it must never cause a "Locally Made" badge to render. A Member who enters an address is stating where the Item *is*, not claiming where a product was *made*.

### Open — is location a required field at creation?

Not decided here. It follows from "every Item gets a location," but it sits in real tension with § Create is first class: a mandatory field is friction, and **ask and offer are the lightest-weight kinds** — the ones most likely to be abandoned at a form gate, and the ones the platform most wants people to post casually.

Mitigations that would soften a required field without deciding it: **remember the Member's last-used location** and pre-fill it; **default to their neighborhood** once the platform knows it; make Online a single tap rather than a menu dive. Any of these turns "required" into "already filled in," which is a different cost. Recorded, not resolved.

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
4. **Is location a required field at creation?** It follows from "every Item gets a location," but it collides with § Create is first class — a mandatory field is friction, and ask/offer are the lightest-weight kinds. Mitigations that change the cost without deciding it: remember the last-used location, default to the Member's neighborhood once known, make Online one tap. See § Location is entered at creation → Open.

**Resolved.**

- *Do Items with no Location appear?* — yes, ranked last; and after creation-entry that state is *Online*, chosen by the creator (2026-09-03). See § Feed ranking.
- *Is "Online" a first-class location option?* — yes, with a required creation-time warning and no map presence (2026-09-03). See § Online is a location option.
- *How do the polygon's hard boundary and the radius's graded falloff coexist?* — they don't; both retire for one stored hierarchy (2026-09-03). See § Location resolution.
- *Where does an Item's location come from?* — the Member enters it at creation: address, neighborhood, or Online (2026-09-03). Supersedes the creator-inheritance answer recorded earlier the same day; the dead `home_location_id` column is no longer a dependency. See § Location is entered at creation.
- *At what grain does an Item's location publish?* — the Member's choice; neighborhood-level entry is the deliberate privacy mechanism (2026-09-03). See § Location is entered at creation → Neighborhood-level entry.
