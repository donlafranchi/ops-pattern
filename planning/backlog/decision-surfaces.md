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

### The merged surface's two ranking authorities — MOSTLY RESOLVED BY DELETION

*Revised 2026-09-03 by § Distance is out. The version recorded earlier the same day framed this as a live three-way choice; most of it was deleted rather than decided.*

The collision was: Home ranks **server-side** (`locality_feed_items`, hierarchy inside it), Explore ranks **client-side** (T115's `?sort=` re-orders an already-fetched page in `sortExploreItems`), and merging the surfaces gives one list two orderings with the client one winning by running last. The sharpest case was **`sort=nearest`** — a client-side proximity ordering competing directly with the ratified server-side one, measured differently, and silently winning.

**`nearest` is gone with distance.** So is the case where the two authorities disagreed *about the same thing*.

**What survives, and it is a real open question.** `SORT_OPTIONS` still carries **newest**, **starting soonest**, and **most responses**, and all three still re-order the whole fetched page client-side. They no longer contest the hierarchy on *proximity*, but they do still discard it: a Member picking "Newest" gets a list where local-first is gone, which is the one ordering the platform has committed to. The framing question is unchanged and still unanswered — **is "nearby first" a sort value a Member can leave, or the frame every other sort operates within?**

Two shapes remain (the third, "sort is an explicit override for proximity," died with `nearest`):

1. **Server ranks, client re-sorts within a band.** The hierarchy is the outer key; newest / soonest / responses order *inside* each band. Keeps local-first inviolable; the Member's sort does less than the label promises.
2. **Sort is an explicit override.** `?sort=` replaces the hierarchy and the UI says so. Honest; hands the Member a way to switch off the platform's strongest relevance signal.

**Also open: does the `sort` control survive at all?** With `nearest` removed it is three options on a locality-ranked feed, and "Newest" over the whole metro may be a worse default experience than no control. Confirm at merge scope rather than assuming the control transfers.

**Also unresolved and bundled with it:** Explore's filters narrow **the first 100 rows**, not the corpus. `fetchExploreItems` selects `EXPLORE_LIMIT = 100` from `discoverable_items` with no paging, and category / distance / schedule / sort all run client-side over that page; only `kind` filters server-side, on the MV's indexed column. On an unranked catalog "the first 100" was arbitrary. On a hierarchy-ranked feed it is *the hundred nearest*, so a Member filtering to Online would search the page least likely to contain any. Whichever authority wins, filtering probably has to move server-side with it.

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

*Refined 2026-09-03 by § Metro is the vantage point:* the bands are measured **from the active metro**, and the top band is **the Member's saved hoods within it** — hoods first, then the rest of the metro, then wider, then Online. The ladder is unchanged; what changed is that "nearby" now has an unambiguous centre where a plural hood set would otherwise have given it several.

Intent (Ratified 2026-09-03): A hard boundary and a graded falloff could not be reconciled because they answer different questions with different machinery — one asks "is this inside?", the other asks "how far?". A hierarchy answers both with one question: "how many levels up do we have to walk before these two things share an ancestor?" That is legible to a Member ("this is in your neighborhood" beats "this is 2.3 miles away"), cheap at read time, and stable — an Item's neighborhood does not change when the viewer moves, so the same row can be cached, indexed, and paged. It is also the reversible choice: the resolved levels are stored data we can re-derive with a better geocoder or re-band with a different sort key, where read-time distance math bakes the model into every query. The cost is write-time correctness — a bad resolution persists until re-resolved, where a runtime computation is always current. Accepted, because addresses move far less often than viewers do.

**It fixes the "nearest location" defect, and is the fix rather than a workaround.** `discoverable_items` exposes a `nearest_location_id` that is not nearest to anything. The materialized view resolves it with a lateral `select il.location_id from item_locations il where il.item_id = i.id … order by il.created_at asc limit 1` (`web/supabase/migrations/034_discoverable_items_starts_at.sql`) — **the oldest attachment, with no distance math anywhere in the derivation.** A multi-venue Item is pinned to whichever venue happened to be attached first, regardless of where the viewer is standing; migration `033` already annotates the column as "first-location-only" and routes around it. The stored hierarchy removes the premise: an Item does not need a single "nearest" venue, because it carries its own place levels and matching happens between hierarchies, not between points.

**What already exists — do not rebuild it.** The `places` tree (`parent_id`, variable-depth, `region`/`state`/`county`/`city`/`neighborhood`) and `locations.place_id`, reverse-geocoded at Location create via `place_for_coords()`. The `metro_polygons` overlay and `members.home_metro_id` (migration `031`, on `main`). The community-awareness feed already generates candidates from "the attached Location's `place_id` *or any ancestor*" (`discovery.md` § Candidate generation, source 3). **What is new** is storing the resolved levels on the Item itself and making them the only query path — which retires the radius backstop (source 4) and the centroid-radius filter.

**What it does not change.** `location.md` § What does not ship at b1 defers address normalization and geocoding, with a State-tagged Intent (Ratified 2026-05-23). That deferral **stands.** This decision resolves *coordinates* to a *place hierarchy*; it does not normalize, validate, or canonicalize a street address, and it stands up no normalized-address store. `street_address` stays Member-authored free text.

---

## Distance is out — the hierarchy is the only proximity concept — RATIFIED

PM ratified 2026-09-03. **Nothing in the product measures or displays miles.** Sorting is **hood → metro → wider → Online**, and that hierarchy is the entire proximity model. There is no radius, no mile count on a card, no "within 5 miles," no distance sort.

Intent (Ratified 2026-09-03): A mile number is precision the platform cannot honestly deliver and a Member does not actually want. It is measured from a centroid the Member never chose, to a venue whose own coordinates are approximate, and it answers a question ("how far?") that a map app answers better with real roads and real traffic. The hierarchy answers the question people are actually asking — *is this near me, near-ish, or elsewhere* — in words they can act on. Removing distance also removes an entire class of quiet wrongness: every bug below exists only because something had to be measured from somewhere. Reversible in principle, but deliberately not cheap to reverse — the point is to stop treating proximity as arithmetic.

### What this deletes

**This is a deliberate removal of shipped work, not a defect being fixed.** Say so when scoping it.

1. **The distance filter in T115's bottom sheet goes** — `DISTANCE_OPTIONS = [1, 5, 10, 25]`, the radius control, its chip, and the `distance` key in `SecondaryFilters`. T115 merged on 2026-09-03 and this removes part of it days later. That is a scope change, and the ticket was built correctly to the spec that existed.
2. **The polygon-vs-radius tension is gone entirely — closed, not deferred.** It was already resolved in favour of the hierarchy (§ Location resolution); it is now *unfalsifiable*, because **there is no radius left to reconcile a polygon against.** Any doc still framing "hard boundary vs. graded falloff" as open is stale — close it on sight and cite this section.
3. **The `?place=` distance-origin defect is gone.** § What the shipped Explore code carries into the merge recorded a live bug: `fetchExploreOrigin` resolves the launch-locality default while `LocalityFeed` resolves the Member's actual place, so on a merged surface changing place would move the feed and leave "within 5 mi" measuring from somewhere else, with no visible symptom. **It cannot happen if nothing measures distance.** Closed by deletion — cross-referenced there so whoever scopes the merge does not go looking for a wire that no longer needs connecting.
4. **The distance math and the centroid-origin resolution become dead code.** `web/src/lib/explore/filters.ts` — the `toRad` / great-circle helper and the distance-apply path; `web/src/lib/explore/origin.ts` — `fetchExploreOrigin`, `ExploreOrigin`, the `places.centroid` read and the EWKB point decode that exists to feed it; `ExploreFilterSheet`'s `originAvailable` prop and every control disabled by it. **Flag for the merge scope; delete nothing now.** (`MarketSelector.tsx` carries its own `haversineMiles`, but that component is already vendor-era removal per the vendor/market retirement.)

### How distance questions get answered instead — hand off

**If a Member wants to know how far something is, the product gives them the address.** On mobile it opens in the phone's map app; on web it is copyable to paste into a map. The platform does not compute or display the distance itself.

Intent (Ratified 2026-09-03): This is the deliberate answer to "how far is it," not an omission — and it is a better answer. The map app knows the roads, the traffic, the transit, and which of the Member's three saved addresses they are actually leaving from; the platform knows none of that and would be guessing at all four. Handing off is also honest about what the platform is for: it connects neighbours, and routing them is somebody else's competence. **Design consequence:** the address (where the Item has one) has to be present and actionable on the Item surface — a tap-to-open on mobile, a copyable string on web. That affordance is now load-bearing, because it is the only path to a distance answer.

---

## Metro is the feed's vantage point — RATIFIED

PM ratified 2026-09-03. A Member saves multiple hoods, but **the feed is scoped to one metro at a time.**

| Case | Behaviour |
|---|---|
| Several hoods **within one metro** | All active together. The hierarchy ranks *within* that metro: **your hoods first, then the rest of the metro, then wider, then Online.** |
| Hoods **spanning more than one metro** | The Member picks which metro is active and switches between them. **No cross-metro union feed.** |
| Hoods in several metros, none chosen yet | One metro is the default. |

**This closes the plural-hoods fork.** "Nearby" is measured **from the active metro**, not from an ambiguous set of centres. The two-centres problem the plural set created does not arise, because the centre is the metro and hoods are ranking weights inside it.

Intent (Ratified 2026-09-03): The fork was union-feed vs. switcher, and metro-as-vantage-point answers it by making the question smaller. Within a metro a union is obviously right — home and work in the same metro are one life, and asking a Member to switch between them would be absurd. Across metros a union is obviously wrong — merging Sacramento and Portland produces a feed that is about nowhere, and every ranking band below "your hoods" becomes meaningless. Scoping to the metro also lands on the depth the platform already ratified: `discovery.md` § Community-awareness feed makes **metro the default feed depth** (Intent Ratified 2026-09-02, per [memo-0026](../../playbooks/memos/memo-0026-metro-default-feed-depth.md)), for the same critical-mass reason. Reversible: the active metro is one piece of session or profile state, and unioning adjacent metros later (see the risk below) changes a scope query, not the model.

### Consequence — the browse switcher is a *metro* switcher

The place switcher on Home selects **a metro**, not a neighborhood. Hoods are **ranking weights inside the active metro**, not switchable scopes of their own. A Member with three hoods in Sacramento does not see three switcher entries; they see Sacramento, with all three hoods ranked to the top of it.

**This is a different control than the docs currently describe** — flag on sight, do not silently reinterpret:

| Where | What it implies today |
|---|---|
| `web/src/components/feed/ScopePicker.tsx` | Selects a **neighborhood-level place** — options are `kind='neighborhood'` rows, and choosing one navigates to `/?place=<slug>`. Neighborhood-as-scope is exactly the model this decision replaces. |
| `web/src/components/feed/LocalityFeed.tsx` | Resolves the feed's vantage point to a **single Place** (`resolveFeedPlace` from `primary_home`, `?place=`, or IP), then queries from it. The vantage point becomes the metro; the Place-level resolve becomes a ranking input. |
| `product/ui/community-platform.md` § Explore | "Location prompt … geocoding autocomplete for city / neighborhood / zip" — entry-level copy that reads as scope selection. |
| `product/ui/phase-0-ia-wireframes.md:78` | "Near-me reach control … how wide the locality scope extends" (F031) — a *width* control over locality, which a metro switcher is not. |
| § A Member has a set of saved hoods (this doc) | Said the saved set should populate the switcher. Refined: the saved set populates the switcher **as the metros those hoods resolve to**, deduplicated — not as one entry per hood. |

### Metros have inner and outer boundaries, and mostly do not overlap — RATIFIED

PM ratified 2026-09-03, refining the vantage-point rule above.

- **A metro is a dense core plus a looser outer ring**, not a single hard line. The edge is a gradient.
- **Metros mostly do not abut.** Sacramento, Seattle, Portland, Denver all sit in real empty space. **Overlap is the exception**, confined to dense corridors — Los Angeles, the SF Bay Area, the New York area.

Intent (Ratified 2026-09-03): A hard line is the wrong shape for a thing people experience as a gradient, and it is the hard line — not the metro concept — that generated the straddling problem. Modelling the edge as a ring makes the common case (living somewhere loosely attached to a metro) representable instead of forcing it to one side. Reversible: rings are reference data, and a ring with zero width is the current behaviour.

### Accepted risk — boundary-straddling, scoped to the dense corridors

*Revised 2026-09-03. This entry previously recorded straddling as a general risk of metro-shaped scoping. The inner/outer-ring and non-overlap facts above narrow it substantially; the earlier, broader reading is superseded — do not cite it.*

**The case is genuine but it is largely a dense-corridor case.** A Member living twenty minutes from a metro line, with a home hood on one side and a work hood on the other, is still forced to switch between halves of **one ordinary life** — and those Members are exactly the edge-dwellers a neighbours product should serve well. But **for most of the country there is empty space between metros and no straddling to speak of.** Sacramento's nearest neighbour is not twenty minutes away. The risk concentrates where metros actually abut: LA, the Bay Area, the New York area.

**The ring structure is part of what handles it.** An outer ring is a softer edge than a line — a Member near the boundary sits in someone's outer ring rather than being cleanly excluded, which is a materially different experience from being told they are in the wrong metro.

**Still on the books, still an accepted risk**, because in the corridors where it bites it bites hard, and those corridors hold a large share of the U.S. population. **Mitigation to consider later:** union adjacent metros when the Member's own hoods straddle them — the saved set is the signal that, for this Member, the line is not real. Cheap, and it dissolves the corridor case without touching the far case.

**A second boundary case, confirmed in the schema.** `members.home_metro_id` is **null when the Member's Place falls outside every seeded CSA** — migration `031_metro_polygons.sql` documents this as the rural fallback, with F031 reading the null to offer radius scope instead of metro scope. So "metro is the vantage point" has no answer for a rural Member today: there is no metro to be the vantage point. The existing radius fallback is the working answer; whether it survives the retirement of read-time radius (§ Location resolution) is unexamined.

**Substrate note — neither refinement is expressible today.** `metro_polygons` (migration `031`) carries **one** `geography(Polygon, 4326)` per row at **Census CSA grain**. That means (a) there is no inner/outer ring — one polygon, one edge; and (b) **CSAs are non-overlapping county aggregations by construction**, so deliberate overlap in the dense corridors cannot be represented at this grain at all. Both refinements imply schema and seed work — a second polygon or ring column, and a grain or curation change where corridors need to overlap. Flagged as a substrate consequence, not a blocker to the decision.

### Reframe — picking a metro is an intentional act, not an ambient one

A Member browsing **their own hoods** is checking what is near them. A Member picking **a different metro** is deliberately looking elsewhere — *"what's going on in Portland."* Those are different intents, and the switcher serves the second one.

Intent (Ratified 2026-09-03): The default posture is ambient and local; reaching for another metro is a Member stating a purpose. Naming that distinction keeps the switcher from being read as a general-purpose scope control that Members are expected to fiddle with, and keeps the default experience from being designed around a control most people will touch rarely.

**Structurally — PM's read, needs confirmation, not settled:** this is **a mode or control on the single merged browse surface**, not an argument for restoring a separate Explore tab. **The merged-surface decision holds** (§ The two-tab model).

**But note plainly:** the ambient-versus-intentional distinction is *the same distinction* that originally justified Home and Explore as separate tabs. **It has now resurfaced twice** — once as the filter/search controls Home absorbed, and again here as metro switching. Two is a pattern worth naming; it is not yet evidence. **If it resurfaces a third time, that is evidence the merge is wrong**, and the merge should be **revisited on its merits** rather than defended. Record the third occurrence against this line when it happens.

### Open — not answered by this decision

1. **What determines the default metro when hoods span several?** First added, most hoods, or explicitly chosen. Each reads differently to a Member: first-added is arbitrary but stable, most-hoods is inferred and can flip under them, explicit is honest but is another setup step.
2. **Can a Member set a primary metro?** Related to (1) but separable — a primary is a durable answer where a default is a computed one.
3. **What happens to the active metro when a Member adds a hood in a new one?** Switch to it (they are probably there), stay put (they were mid-task), or ask. The first is helpful right up until it is disorienting.
4. **What do the inner and outer rings actually do differently?** Is the outer ring a ranking band (present, ranked below the core), a filter (excluded unless asked for), or only a rendering boundary (drawn differently, behaves identically)? Three different products from the same shape.
5. **Can a Member's hoods sit in a metro's outer ring without that metro becoming their default?** Outer-ring membership is weaker than core membership, and the default-metro rule does not currently distinguish them.
6. **Who owns metro boundary definition and maintenance?** This is now **reference data the product depends on** — the vantage point, the switcher's entries, and the ranking bands all read it. Today it is a Census CSA seed with an approximated Sacramento polygon (`seed_method='approx_bbox'`); rings and corridor overlap make it a curated dataset with no named owner and no update cadence.
7. **Can a Member browsing another metro create there, or only read?** Posting into a metro you are deliberately visiting is either a reasonable thing (you are moving there, you are hosting there) or the beginning of remote spam, and the answer sets whether the switcher is a read affordance or a full context switch.
8. **Is the geocode-once step what assigns a hood to its metro?** Assumed, not confirmed. **What is confirmed:** the mechanism exists and is metro-resolution-from-a-point — `public.resolve_home_metro(point geography)` does `ST_Contains` against `metro_polygons` (smallest-area tiebreak, null outside all polygons), and it is already wired into `member.place_interest.add` / `.remove` to derive `members.home_metro_id` from a Place centroid. What is *not* settled is whether the Item-side and hood-side resolution call that same path at geocode time, or whether metro is derived later from the stored hierarchy. A build call, but it decides where the null-metro case is handled.

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

**Entry at creation reaches the same outcome and needs none of that.** The Item ends up correctly placed either way; inheritance got there by requiring a second, unbuilt system and by guessing, while entry asks the one person who knows. The dead column is **no longer a blocker or a dependency** for Item location, and the question of what a Member with no location set produces does not arise — there is no member-location read on this path. A Member neighborhood does return below as the *pre-fill* for that entry, stored once and copied per Item; see § This is a default, not inheritance for why that is a different thing from what was rejected here.

### Entry and geocode-once are one pipeline

The address or neighborhood the Member types **is the input to the geocode-once step**. Entry resolves once, at creation, into the stored hierarchy (§ Location resolution); every query afterwards reads those stored levels. These are not two decisions that happen to touch — they are the write half and the read half of one path: *Member enters → resolve once → store levels → rank by levels.* A neighborhood entry resolves to a shallower hierarchy than a street address; both store the same shape.

### Checked against the provenance prohibition — no conflict

`item.md` § Provenance claims carries a State-tagged Intent (Ratified 2026-05-23) whose test reads: does the proposal want to auto-populate `made_at_verification_source` from another field — the seller's jurisdiction ZIP, the seller's home Location, the seller's kind='business' Group anchor? If yes, refuse.

**Not triggered.** That prohibition governs the *"Locally Made" provenance claim* — an affirmative statement about where a product was manufactured, carrying an evidence tier that climbs by attestation. Item location answers *where the Item is discoverable from*. Different columns, different questions, different failure modes: a wrong provenance claim is a false advertisement, a wrong discovery location is a bad sort order. Member-entered location strengthens the separation — nothing is being derived from anything.

**The guard that keeps it that way:** the location entry writes the Item's stored discovery hierarchy **only**. It must never write `made_at_place_id` or `made_at_verification_source`, and it must never cause a "Locally Made" badge to render. A Member who enters an address is stating where the Item *is*, not claiming where a product was *made*.

### A Member has a set of saved hoods, and they pre-fill creation — RATIFIED

PM ratified 2026-09-03. **A Member saves a *set* of neighborhoods, not one** — home, work, wherever they actually spend time. The set lives **on their profile** and is editable there. It pre-fills the location field on every creation, and the Member can change it on any individual Item.

**This closes the required-field tension.** Location is required *and* creation stays low-friction, because the two were only in conflict while "required" meant "empty field the Member must fill." The field arrives already filled in; the Member confirms by doing nothing. Overriding is a choice they make when the Item is somewhere else, not a chore they perform every time.

Intent (Ratified 2026-09-03): The friction cost of a required field is paid at *every* creation; the cost of saving your hoods is paid *once*. Trading a recurring cost for a one-time one is the whole move, and it is what lets ask and offer — the lightest-weight kinds, the ones most likely to be abandoned at a form gate — stay genuinely light while still landing in the right place. A *set* rather than a single value because people are not in one place: the same Member posts a tool-lending offer from home and a lunch ask from near work, and a single default makes one of those two wrong every time. Reversible: the set is a pre-fill source, so making the field optional later changes one composer behaviour and no stored data.

**What the composer offers, in order:**

1. **Pick from the saved set** — the common case, no typing.
2. **Enter a new address or neighborhood** — always available, whether or not it gets saved.
3. **Online** — still one of the three choices.

**A Member with one saved hood sees the single-default behaviour.** No picker, no extra step, no list of one. The pick-from-set affordance appears when there is something to pick between. A feature meant to remove friction must not add a tap for the Member who needed it least.

**Overriding to a full address is how a specific venue gets handled.** Hood-as-default does **not** mean hood-only precision. A Member hosting at a real venue overrides the pre-fill with the address; a Member posting from their kitchen leaves the hood in place. The default sets the *common* case, not the *available* one.

### The saved set and the Home place switcher are the same list — CONVERGENCE, needs confirming

Home already carries a place switcher. A Member's saved hoods are the obvious thing to populate it with: **two features specified separately are one list.** The Member curates their hoods once, on their profile, and that curation drives both where they post from and where they browse.

Intent (Ratified 2026-09-03): Asking a Member to maintain two lists of the same places — one for posting, one for browsing — is the platform exposing its own seams. It is also a worse product on both ends: the browse switcher gets a hand-curated set instead of whatever the query returned, and the saved set earns its keep for Members who never create anything.

**What the switcher does today — confirmed, and it is a placeholder.** `ScopePicker` (`web/src/components/feed/ScopePicker.tsx`, T088) is fed by `LocalityFeed`, which sources its options with `select slug, display_name from places where kind = 'neighborhood' … limit 12` — **an arbitrary twelve neighborhood rows, no ordering, no member relation at all**, with the current place prepended. The feed's own vantage point is resolved separately by `resolveFeedPlace` from the Member's `primary_home` place-interest, an explicit `?place=` slug, or IP geolocation. So the convergence is not a conflict to reconcile: the switcher has no real source to displace, and the saved set is a straight upgrade over a `limit 12`. **Still confirm before ticketing** whether `member_place_interests` (which already carries `primary_home` plus up to five `secondary` Places) is the substrate for saved hoods or whether a new one is warranted — that is a substrate call, not a product one.

### Editing the set must not move Items — the ownership rule under pressure

The copy-not-reference rule below matters **more** with a plural, editable set, because deletion is now a real case in a way a single field never made it.

- **Removing a hood from the profile does not orphan the Items created against it.** Those Items keep their own resolved location. Nothing to re-resolve, nothing to fall back to.
- **Editing a hood on the profile does not move past Items.** The Member is editing their *pre-fill source*, not the Items that were once stamped from it.

Both follow from the same rule, and neither is optional: the profile set is where the *next* Item's location comes from, never where an *existing* Item's location is read from.

### Future capability, NOT agreed — inferring hoods from behaviour

**Recorded as a possible future capability, explicitly not part of any decision above.** The platform could infer a Member's hoods from what they actually interact with — noticing which hoods they keep returning to and offering to save them.

**b2 or later.** It has no bearing on the decisions above and must not be assumed by anything scoped from them.

**Flag, plainly: this means tracking browsing behaviour per Member.** That is a privacy posture the product **has not taken a position on**, and it should be decided deliberately — via `weigh`, against `policy.md` and the three-filter test — **before** anything is built, not discovered during a ticket. The platform's existing posture leans the other way: `discovery.md` § Community-awareness feed keeps the feed *computed from the Member's own stated interests* rather than from a stored behavioural graph, with a State-tagged Intent (Ratified 2026-05-23) whose test refuses stored follow-edges that become product surfaces. Per-Member browse history is a larger version of exactly that. **Do not read this paragraph as agreement — it is a flag on a road not yet taken.**

### This is a default, not inheritance — the distinction that will get built wrong

**The hood is copied onto the Item at creation. The Item owns it from then on.** The Item must **not** read through to the Member's profile at display time — not to a single field, and not to the saved set.

Consequences, both required:

- **A Member who moves and updates their hoods does not relocate their past Items.** Those Items stay where they were created. Silent retroactive relocation would be wrong on its face — an event that happened in Oak Park did not move because its host did — and it would quietly rewrite history across every surface that had already shown, linked, or ranked those rows.
- **An override is permanent to that Item.** An Item created at an overridden location keeps that location; a later change to the Member's default does not reach back into it. Same reasoning: the Member made a per-Item statement, and a default must never overwrite a statement.

Read as an implementation instruction: **copy the value, do not store a reference.** Anything that resolves the Member's current neighborhood at render time is the wrong build, however much cheaper it looks.

### Why this is not the inheritance we rejected

This **partially revives the member-location concept** the previous amendment discarded — and the difference is the whole reason one was rejected and this one accepted.

|  | Inheritance (rejected) | Stored default (accepted) |
|---|---|---|
| When the member location is read | At display time, live, on every render | Once, at creation, into the Item's own field |
| What the Item holds | A pointer to the Member | Its own resolved value |
| If the Member moves | Past Items silently relocate | Past Items stay put |
| What it needs to exist | A live, always-populated member-location column | A value asked for once and copied |

Inheritance made every Item's location a *live dependency* on member-location substrate — which is exactly what made it blocked, since `members.home_location_id` is dead (never populated, never read; migration `031_metro_polygons.sql` header). A stored default has no read path at all after creation: the Member picks, the value is copied, and the Item is self-contained from that moment. Whatever the platform ends up storing the saved hoods in, no display surface depends on it — which is also why a plural, editable, deletable set is safe here and would have been a nightmare under inheritance.

### The Member picks a hood **and** a metro at signup — RATIFIED

PM ratified 2026-09-03. **Both, at signup**, and the metro is **picked, not derived from the hood.**

*This closes the open question recorded earlier the same day — signup vs. first creation, with first creation as the PM's initial read. Signup wins:* a hood personalizes the **feed**, which is the surface a Member who never creates anything actually uses. Asking at first creation would leave every consumption-only Member ranked against nothing.

Intent (Ratified 2026-09-03): Asking for the metro explicitly is **partly redundant with geocoding** — a hood resolves to a metro on its own — and it is worth the redundant question anyway. It gives an unambiguous **default** rather than an inferred one, and it handles the two cases inference gets wrong: a hood sitting near a metro boundary (§ Metro is the vantage point → Accepted risk), and a Member who simply wants a *different* metro as their default than the one their hood falls in. One extra tap at signup buys a correct answer in the cases where derivation would be silently wrong, and a Member who states their metro can never be told they are in the wrong one. Reversible: both are profile fields the Member edits later.

**It also settles the default-metro question** for Members whose hoods span several: the metro they picked at signup is the default. See § Metro is the vantage point → Open for what happens when they later add a hood in a new one — still open.

### What the plural set does to the feed — answered in § Metro is the vantage point

*The union-vs-switcher fork recorded here on 2026-09-03 was resolved the same day.* **Metro is the vantage point**: hoods within one metro are all active together; hoods spanning metros switch. See the section below.

Still open: **is there a cap on saved hoods?** Unbounded invites a Member to save a whole metro one neighborhood at a time, which quietly turns the locality product into a national one. `member_place_interests` already caps `secondary` Places at five; whether that is the right number here is unexamined.

---

## The user-facing word is "hood" — RATIFIED

PM ratified 2026-09-03. In UI copy the platform says **hood**. *Your hoods.* Not "neighborhood," not "locality," not "area."

Intent (Ratified 2026-09-03): This is a **voice** decision, not a labelling one. Location is the core primitive a Member touches on every surface — the word for it sets the register for the entire product, the way "tweet" or "pin" did. "Locality" is administrative; "neighborhood" is correct and flat; "hood" is warmer, shorter, and colloquial, and it signals that this is a *neighbours* thing rather than a listings platform. The product is allowed to be a little cheeky, and this is one of the few places where a single word does that work at no cost. Reversible at the price of a copy sweep — no data model, no schema, no URLs.

**Internal naming does not have to follow.** If the code says `neighborhood`, the schema says `places.kind = 'neighborhood'`, and a spec says "locality scope," that is **fine and should not be churned to match.** This decision governs copy, not identifiers. Renaming identifiers to chase a UI word is exactly the kind of drift the three-layer naming pattern in `CLAUDE.md` § Naming conventions exists to prevent — schema names are durable; the UI-label layer translates.

### Open — does "hood" land the way we intend?

Not a blocker; a deliberate check before launch rather than a discovery after it.

"Hood" carries regional and cultural connotations, particularly in US usage, that "neighborhood" does not. Depending on which communities the product lands in, it reads as warm and familiar or as borrowed slang — and the second reading is worst precisely where the platform most wants to be trusted. **The check:** the PM sanity-checks the word with a handful of real Members across the launch market before it ships in copy, rather than reasoning about it internally.

**The fallback is trivially cheap**, which is why this is an open question and not a gate: it is a copy change, not a data-model one. Nothing about the schema, the URLs, or the stored hierarchy depends on which word renders.

### Existing docs that go inconsistent the moment this lands

Listed, **not rewritten** — the sweep waits on the open question above.

| Where | What it says | Layer |
|---|---|---|
| `web/src/components/feed/ScopePicker.tsx:26` | `aria-label="Choose a locality"` | Shipped UI copy — the switcher this decision converges with |
| `web/src/components/feed/LocalityFeed.tsx` | "Near {place}" heading; empty state "We couldn't detect your locality. Pick a Place to see what's nearby." | Shipped UI copy |
| `product/ui/community-platform.md` § You | The "**Locality control**" bullet — the control's own label | Spec naming a UI label |
| `product/ui/community-platform.md` § Explore | "geocoding autocomplete for city / neighborhood / zip" | Spec naming composer copy |
| `product/ui/community-platform.md:10` | "Home is the locality-aware activity feed" | Description prose — borderline, arguably internal |
| `product/ui/phase-0-ia-wireframes.md:78` | "Near-me reach control … how wide the locality scope extends" (F031's user-facing surface) | Spec naming a UI surface |
| `product/ui/card-feed-design-proposals.md:82` | "the locality pill pin dot" | Design prose naming a component |
| `CLAUDE.md` § Naming conventions | The UI-label column carries **Place** for `places` and **Venue** for `locations`. A neighborhood-kind Place surfaced to a Member as a "hood" is a distinction the table does not currently make. | The naming table itself — reconcile here first, since everything else cites it |

The last row is the one to settle first: whichever way it lands, the table is the source the other seven should be swept against.

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

## What the shipped Explore code carries into the merge

Recorded 2026-09-03 from T115 (filter icon + bottom sheet + chips) and T116 (inline list/map toggle), both merged.

**Two directions are in play and they are not in conflict — say which one you mean.** The surviving *tab* is Home; Explore is retired as a tab, per the two-tab model above. The surviving *implementation* is Explore's: `ExplorePage` and `src/lib/explore/*` hold the filtering, the URL state, the MV read and the map, while Home's contribution is one public SQL function (`locality_feed_items`) plus a server component. So the merge is Explore's code rendering under Home's name and Home's ranking rule — not a rewrite of either. This code is inventory for the merge scenario, not salvage.

**Transfers unchanged — no surface knowledge in it.** `src/lib/explore/filters.ts` (the filter model, URL parsing, chip descriptors, week/weekend ranges, apply + sort — **minus the distance filter and the great-circle helper**, per § Distance is out), `query.ts` (serialization), `items.ts` / `ewkb.ts` / `kinds.ts` (the data layer), and `useScrollRestoration` (keyed by an arbitrary string). The three components — `ExploreFilterSheet`, `ActiveFilterChips`, `ListMapToggle` — are presentational and take props; none reads page state.

**Needs rework, and one of them is a live defect.**

- **~~`?place=` would move the feed but not the distance measurement.~~ CLOSED BY DELETION 2026-09-03 — do not scope this.** The defect was real: `fetchExploreOrigin` (T115) calls `resolveFeedPlace(client, {})` with neither `memberPlaceId` nor `requestedSlug`, so Explore's distance origin was always the launch-locality default while `LocalityFeed` resolved the Member's actual place — `?place=` would have moved the ranked feed while "within 5 mi" kept measuring from somewhere else, with no visible symptom. **§ Distance is out removes the measurement entirely, so the collision cannot occur.** Recorded here so the merge does not go looking for a wire that no longer needs connecting.
- **Distance filtering and origin resolution are now dead code to remove, not features to port.** `DISTANCE_OPTIONS` and the `distance` filter, the great-circle helper in `filters.ts`, all of `origin.ts` (`fetchExploreOrigin`, the `places.centroid` read, the EWKB point decode that feeds it), and `ExploreFilterSheet`'s `originAvailable` prop and the controls it disables. Deliberate scope removal of shipped T115 work — see § Distance is out.
- **Two ranking authorities — mostly resolved by deletion.** `sort=nearest` is gone with distance; newest / soonest / responses still re-order client-side. See § Feed ranking → The merged surface's two ranking authorities.
- **`TOGGLE_AFTER_CARDS = 4`.** In `ExplorePage.tsx`; the inline list/map toggle interrupts the card grid after this many cards. Four is not arbitrary — it is the only value in F044's stated 3–5 range that completes a row at both `grid-cols-2` (mobile) and `lg:grid-cols-4`. It does *not* complete a row at the `md:` 3-column band, and no number in the range completes all three. Home's feed renders `max-w-3xl` at a different column count, so the merged grid re-derives this or the toggle lands beside a half-empty row. It is the only constant in either ticket that depends on the surrounding layout.
- **Two tablists already share one results region.** The kind pills (T114) and the view toggle (T116) both point `aria-controls` at `#explore-results`. Defensible at two. The TikTok top-slider above would be a third claimant on the same panel — at that point the region should become a plain labelled `region`, not a tabpanel, since no single tab labels it.
- **`?view=` was deliberately removed** (T116, per F044 § Out of Scope — the list/map view is ephemeral session state). If the merged surface wants a shareable map link, that is a decision to re-open, not an oversight to fix.

**No URL name collisions.** Home's entire public URL surface is `?place=<slug>` — interest tags, `primary_home` and limit are all server-derived and never serialized. Explore owns `q`, `kind`, `category`, `distance`, `schedule`, `sort`. The two sets are disjoint; both collisions above are semantic, not nominal, which is why they would survive a params audit that only checked names.

**Both F044 and F045 shipped without the mandatory `review` gate.** Neither has a `review-F###.md`; both went `plan-approved` → `ticketed` on 2026-09-03. Nothing in either build surfaced an architectural problem review would have caught, but the merge scenario should not repeat it — its blast radius is much larger than a filter sheet's.

---

## Open questions

Raised by the two-tab decision, not answered by it.

1. **Visual balance of the third slot.** The nav previously held three peer tabs. With two tabs and a centered **+**, what carries the third slot's weight — is the + visually dominant (raised, filled, larger), a peer of the two tabs, or does the nav re-center around two wide targets? Affects the 44px proportion decision above.
2. **What the + opens.** A bottom sheet (kind picker, stays in context, cheap to dismiss) or a full page (room for the composer, but a harder exit). The choice sets the cost of abandoning a half-made declaration.
3. **Signed-out You.** You's purpose changed from "your follows and settings" to "what you've made." A signed-out visitor has made nothing. What does the tab show — a sign-in wall, a pitch for creating, or does the nav render differently when signed out?
4. **What happens to the active metro when a Member adds a hood in a new one?** Switch, stay, or ask. See § Metro is the vantage point → Open.
5. **Is the geocode-once step what assigns a hood to its metro?** Assumed, not confirmed — `resolve_home_metro()` already does point→metro containment for `primary_home`, but whether the Item and hood paths call it at geocode time is unsettled, and it decides where the null-metro (rural) case is handled. Same section.
6. **Is there a cap on saved hoods?** Unbounded lets a Member accumulate a whole metro one hood at a time. See § A Member has a set of saved hoods → What the plural set does to the feed.
7. **What do a metro's inner and outer rings do differently — ranking band, filter, or rendering only?** And can a Member's hoods sit in an outer ring without that metro becoming their default? See § Metro is the vantage point → Open.
8. **Who owns metro boundary definition and maintenance?** Reference data the product now depends on, with no named owner and no update cadence. Same section.
9. **Can a Member browsing another metro create there, or only read?** Sets whether the switcher is a read affordance or a full context switch. Same section.
10. **Does "hood" land the way we intend?** Regional and cultural connotations, particularly in US usage. PM sanity-checks with real Members before it ships in copy; fallback is a copy sweep, not a migration. See § The user-facing word is "hood".
11. **Does the `sort` control survive at all, and if it does, which layer owns ranking?** `nearest` died with distance, but newest / soonest / responses still re-order a fetched page client-side and still discard local-first. Confirm at merge scope whether three options on a locality-ranked feed earn a control. If they do: is "nearby first" a sort value a Member can leave, or the frame every other sort works within? See § Feed ranking → The merged surface's two ranking authorities.
12. **Does filtering move server-side with the ranking?** Explore's category / schedule / sort narrow the first 100 rows, not the corpus. Against a hierarchy-ranked feed that page is *the hundred nearest*, so filtering to Online searches the rows least likely to contain any. Same section.
13. **Should inferring hoods from browsing behaviour ever happen?** b2+, and it needs a per-Member browse-tracking privacy posture the product has not taken. **Not agreed** — see § A Member has a set of saved hoods → Future capability, NOT agreed.

**Resolved.**

- *Do Items with no Location appear?* — yes, ranked last; and after creation-entry that state is *Online*, chosen by the creator (2026-09-03). See § Feed ranking.
- *Is "Online" a first-class location option?* — yes, with a required creation-time warning and no map presence (2026-09-03). See § Online is a location option.
- *How do the polygon's hard boundary and the radius's graded falloff coexist?* — they don't; both retire for one stored hierarchy (2026-09-03). See § Location resolution.
- *Where does an Item's location come from?* — the Member enters it at creation: address, neighborhood, or Online (2026-09-03). Supersedes the creator-inheritance answer recorded earlier the same day; the dead `home_location_id` column is no longer a dependency. See § Location is entered at creation.
- *At what grain does an Item's location publish?* — the Member's choice; neighborhood-level entry is the deliberate privacy mechanism, and overriding to a full address is how a specific venue is handled (2026-09-03). See § Location is entered at creation → Neighborhood-level entry.
- *Is location a required field at creation?* — yes, and the friction objection is answered by pre-filling it: the Member saves a set of hoods once, it pre-fills every creation, and they override per Item (2026-09-03). See § A Member has a set of saved hoods.
- *What word does the UI use for a neighborhood?* — "hood" (2026-09-03). Copy only; schema and identifiers stay as they are. See § The user-facing word is "hood".
- *Does the feed union a Member's hoods or switch between them?* — **both, split at the metro line** (2026-09-03): hoods within one metro are active together; hoods across metros switch. "Nearby" is measured from the active metro, and the browse switcher is a *metro* switcher. Carries an accepted risk, **now scoped to the dense corridors** where metros actually abut. See § Metro is the vantage point.
- *Is a metro edge a hard line?* — no; inner core plus outer ring, and metros mostly do not overlap (2026-09-03). Neither refinement is expressible in `metro_polygons` today. Same section.
- *Does the product measure or display distance?* — **no.** No radius, no mile counts, no distance sort; the hierarchy is the only proximity concept, and "how far is it" is answered by handing the Member the address for their map app (2026-09-03). See § Distance is out.
- *When is the Member asked for a hood, and where does their metro come from?* — both picked at **signup**, the metro explicitly rather than derived (2026-09-03). Supersedes the earlier first-creation lean. See § Location is entered at creation → The Member picks a hood and a metro at signup.
- *How do the polygon boundary and the distance radius coexist on the merged surface?* — **moot.** There is no radius left (2026-09-03). See § Distance is out.
- *Does `?place=` move the feed but not the distance origin?* — **cannot happen**; nothing measures distance (2026-09-03). Closed by deletion, not by wiring. Same section.
- *Does an Item's location follow its creator?* — no. The neighborhood is **copied** onto the Item at creation and the Item owns it; a Member who moves does not relocate their past Items (2026-09-03). See § This is a default, not inheritance.
