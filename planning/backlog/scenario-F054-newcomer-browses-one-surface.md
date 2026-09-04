---
purpose: Scenario — Explore is absorbed into Home. One browse surface at `/`, server-ranked, carrying Explore's search, filters, map and URL state. Two-tab nav plus create.
layer: how
status: backlog
---

# F054: A newcomer browses one surface instead of two

**Bundle:** b1 (SocialUs v1)
**Sub-bundle:** post-`b1.4` — v1 finishing list, not a themed slice. The `b1.0`–`b1.6` sequence in [`bundle-1-themes.md`](../now/bundle-1-themes.md) predates the v1 rescope and has no slot for this; the bundle's workstream list is the live sequencer.
**Work-map item:** [`bundle-1.md`](../now/bundle-1.md) § What ships in v1 → **workstream 4, "Home/Explore merge."** No `bundle-1-checklist.md` row exists yet — the checklist's own v1 note says the eight remaining workstreams live in the bundle "until they are scoped into scenarios." This is that scoping; the checklist gains a row when this advances.
**Loops:** 1 (Land here), 3 (Find what's near), 7 (Make and be found — discovery side)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → `discoverable_items` (via `locality_feed_items`) → browse. No new table, one function migration.
**Spec contract:** [`decision-surfaces.md`](decision-surfaces.md) § The two-tab model · § Feed ranking · § Distance is out · § Metro is the vantage point · § What the shipped Explore code carries into the merge; [`community-platform.md`](../../product/ui/community-platform.md) § T1 Home + § T1 Explore
**Status:** backlog — **Gate A not clear.** Two unratified absolutes below.

---

## The Person

The C1 newcomer to Sacramento. They opened the app last week, set Oak Park as their home, and have been back twice. Both times they did the same thing: opened Home, scrolled the same dozen cards, tapped Explore because it looked like the place where you find things, and scrolled the same dozen cards again in a different grid. Nothing was hidden on one and shown on the other. The second tab taught them the app repeats itself.

What they actually want is one place to look, that opens on what's near them, and that lets them narrow when they have something specific in mind.

## The Story

They open the app and land on the browse surface — the same cards they saw last week, ordered nearest-first, with a search row across the top and a row of kind pills in the thumb zone. There is no Explore tab any more. The nav has two tabs and a create button between them.

They want to see what's on this weekend. They tap the filter icon, pick "This weekend," and the sheet closes; a chip appears saying so and the results narrow. They tap "Events" in the pill row and the list narrows again. They tap Map, and the same results become pins.

Then a friend sends them a link to what's happening in Midtown. It opens on the browse surface, scoped to Midtown, with the friend's filters intact. They scroll a while, tap into a gathering, then hit back — and land exactly where they left off, still in Midtown, still filtered.

The old `/explore` bookmark on their phone still works. It lands them on the same surface with the same filters.

## Surfaces

- **Entry point:** `/` — the merged browse surface. It is what the Home tab opens and what `/explore` redirects to.
- **Primary action:** narrowing what's on screen — search, kind pills, filter sheet, place switcher.
- **Interaction:** the shipped Explore chrome, unchanged in appearance: sticky search row with filter icon, removable active-filter chips, seven kind pills anchored above the nav, inline List/Map toggle, filter bottom sheet.
- **Completion:** an Item card tapped through to its page, with the browse state restored on back.
- **Discovery:** unchanged — this scenario moves where browsing lives, not what is browsable.

## Data Captured

No Member-authored data. One read-path change:

| Concern | Schema mapping | Change |
|---|---|---|
| Feed rows | `public.locality_feed_items(p_place_id, p_tags, p_limit)` | Extend `RETURNS TABLE` with `description`, `starts_at`, `nearest_location_geography`; add optional `p_kind` |
| Browse index | `public.discoverable_items` | Unchanged — the columns already exist on the view |

Implicit: no event rows, no writes, no new table, no RLS change.

## Acceptance Criteria

### One browse surface, at Home's address

**Given** a signed-out visitor opens `/`
**When** the page renders
**Then** they get the search row, the kind pills, the filter icon, the active-filter chips and the List/Map toggle — the whole Explore control set — over the locality-ranked feed, with no sign-in prompt blocking the results. _Why: `decision-surfaces.md` § The two-tab model — "Home absorbs Explore entirely… the controls are how a Member narrows, not a second place to go." The signed-out clause preserves `community-platform.md` § T1 Explore's anonymous-browse commitment, which the merge is the moment that either survives or silently breaks: Home is server-rendered behind an auth read and Explore is auth-blind._

### The signup banner survives the merge

**Given** a signed-out visitor on `/`
**When** the page renders
**Then** the "Make this yours" signup banner is present above the results; **and given** a signed-in Member, it is absent. _Why: Home's auth branch is the personalization the merge must not drop on the floor. Explore renders identically for everyone; taking Explore's implementation wholesale would silently retire the only signup affordance on the platform's landing surface._

### The server ranks; the client does not re-order

**Given** the merged surface has fetched a page of results
**When** any filter, search term, or kind pill is applied
**Then** the surviving rows stay in the order the server returned them, and no client-side sort runs. The sort control is gone: `SORT_OPTIONS`, the `?sort=` parameter, the "Sorted by…" chip and `sortExploreItems` are all removed. _Why: `decision-surfaces.md` § Feed ranking → "The merged surface's two ranking authorities" leaves this open and asks it be confirmed at merge scope. Confirming it as removal rather than as a server-side port: `nearest` died with distance, and the three survivors — newest, soonest, most responses — each discard local-first, which is the one ordering the platform has committed to. A control that silently switches off the platform's strongest relevance signal is worse than no control, and the schedule filter already does the job "starting soonest" was doing for events. Reversible: `?sort=` can return as a server-side outer key in v2 without re-litigating the merge._

### Filters narrow; they do not re-order

**Given** results on screen
**When** the newcomer sets a category, a schedule window, or a search term
**Then** the matching rows remain, the rest are removed, and the relative order of what remains is unchanged. _Why: this is the observable form of the rule above, and it is the clause the eval should test — "no client sort ran" is not directly observable, but "order preserved under filtering" is._

### The place switcher moves the feed for a signed-in Member

**Given** a signed-in Member whose home is Oak Park
**When** they choose a different place in the switcher
**Then** the feed re-ranks around the chosen place. _Why: today it does not. `resolveFeedPlace` returns on `memberPlaceId` before it ever reads `requestedSlug` (`src/lib/feed/feed-place.ts`), so `?place=` is inert for exactly the Members who have a home set — the switcher works only for signed-out visitors. The merged surface makes the switcher load-bearing (`decision-surfaces.md` § Metro is the vantage point), so the precedence has to inverit: an explicit request beats a stored default. This is a live defect, not a new capability._

### A shared link survives the first filter change

**Given** a link to `/?place=midtown&kind=gathering`
**When** the page loads and its filter effect writes the URL back
**Then** `place` is still in the query string. _Why: `exploreQueryString` builds a fresh `URLSearchParams` from the six keys it knows and `router.replace`s the result, so any parameter it does not know about is erased on the first write. On `/explore` that set was empty; on `/` it is `?place=`, the switcher's entire state. The merged serializer must preserve unknown parameters rather than reconstruct the string._

### Back from an Item restores the browse position

**Given** the newcomer has scrolled well down the results and tapped into an Item
**When** they navigate back
**Then** they return to the scroll position they left, with the same place and the same filters. _Why: shipped behaviour (T115), and the reason `useScrollRestoration` exists — results arrive after an async read, so the browser's own restoration fires against a one-viewport page._

### Switching place does not restore the previous place's scroll

**Given** the newcomer is scrolled deep into Oak Park's results
**When** they switch the place switcher to Midtown
**Then** the new results start at the top. _Why: `useScrollRestoration` is keyed to the literal string `'explore'` and guards restoration behind a `useRef` that is never reset, so one key covers every place and the restore fires at most once per mount. On a surface that has both a switcher and restoration, that combination lands a Member at Oak Park's scroll depth inside Midtown's results. The key must carry the place, and the once-only guard must reset when the key changes._

### The old address still works

**Given** a bookmark or an internal link to `/explore?kind=gathering&schedule=weekend`
**When** it is opened
**Then** it redirects to `/?kind=gathering&schedule=weekend` with the query string intact. _Why: the SEO cost is nil — no sitemap, no robots file, no route metadata on `/explore` — but internal links exist (`src/app/you/page.tsx`, `src/components/follows/FollowingManager.tsx`) and the surface has been live and linkable. A redirect that drops the query silently discards the Member's filters._

### Two tabs and a create button

**Given** any surface with the bottom nav
**When** it renders
**Then** the nav shows two tabs — the browse surface and You — with a create affordance between them, and no Explore tab. _Why: `decision-surfaces.md` § The two-tab model and § Create is first class. The Explore tab must go with the route; leaving a third tab pointing at a redirect is the version of this that ships by accident._

## Edge Cases

- **Signed-in Member with no home set:** falls through to the requested place, then to the launch default — the existing `resolveFeedPlace` chain, minus the precedence defect above.
- **No resolvable place at all:** the existing picker-first state (`data-testid="feed-no-place"`) renders, with the controls suppressed — there is nothing to filter.
- **Empty result set:** the existing Explore empty state ("Nothing here yet — try another filter" + Clear filters) wins over Home's widen-locality empty state, because on a surface with filters the likely cause is the filter, not the locality. The widen-locality CTA moves into it as a secondary line.
- **Filter sheet open when the nav auto-hides:** unchanged — `NavVisibilityProvider` already pauses on `[aria-modal="true"]`.
- **Desktop:** the kind pill row is `md:hidden` today and the desktop top nav is a separate component; the merged surface must not leave desktop without a kind filter.

## Assumptions

- `discoverable_items` already carries `description`, `starts_at`, `nearest_location_geography`, `photo_url` — confirmed; `locality_feed_items` simply does not project them.
- The vendor/market retirement (v1 workstream 2) owns `/vendors/[slug]` and `EventCard`'s `/explore?market=` links. This scenario does not delete them; it must not be blocked by them either.
- `src/components/HomeFeed.tsx` has no importers — it is dead code that links to `/explore`. Deleting it is housekeeping inside this scenario, not a behaviour change.

## Out of Scope

- **The new chrome.** A search box above the nav, a filter button at its right edge, and a floating map button replacing the inline toggle. **This is the immediate follow-on and it reverses T114's pill row and T116's inline toggle** — the merge lands first so the chrome is rebuilt once, not twice. It needs its own scenario and its own `review`.
- **The ranking rewrite.** Metro vantage point, hoods-first bands, "nothing excluded, Online last" — v1 workstream 8, not this. This scenario adopts `locality_feed_items` as the ranking authority *as it behaves today* and extends only its projection. See § Known contradiction below.
- **Server-side filtering.** Category, schedule and search still refine a fetched page. At v1 inventory the page is the corpus; the ceiling is recorded, not built against.
- **What the `+` opens.** `decision-surfaces.md` § Open questions 2 is unresolved. This scenario puts the button in the nav pointing at the existing create entry (`/you/sell`); the composer sheet is a separate piece of work.
- **The You rebuild** — v1 explicitly defers it beyond create-and-manage.
- **Persisting the list/map view across sessions** (b2, per F044).

## Known contradiction — flagged, not resolved here

`locality_feed_items` **excludes**: `where di.nearest_location_geography is not null and st_intersects(di.nearest_location_geography, p.geography)`. Anything without a location geography, and anything outside the place polygon, is absent from the feed entirely.

`decision-surfaces.md` § Feed ranking ratified the opposite — *"This is a ranking rule, not a filter rule… Nothing is excluded from the catalog for being far away or for being Online."*

The shipped function contradicts the ratified rule today, on Home, before this merge touches anything. Merging does not create the contradiction and this scenario does not fix it — that is workstream 8's ranking rewrite. It is recorded here because the merge is the moment the contradiction becomes *visible*: today a Member who wants the excluded rows can go to Explore, which reads the MV directly with no polygon test. After the merge there is nowhere else to look, so the merged surface will show strictly fewer items than Explore does now.

**This is a real product regression in v1 unless workstream 8 lands with or before the merge, or the polygon test is relaxed as part of it.** Sized in the review.

## Gate A — two unratified absolutes

Both are in `product/ui/community-platform.md` § T1, both are encoded by this scenario, and neither carries a State-tagged `Intent` line. Per rebuild rule 11, this scenario cannot advance to `next/` until `weigh` walks them.

1. **`community-platform.md:70`** — *"Browse at `/explore` **without authentication** — no redirect, no signup wall."* Encoded by the first acceptance criterion. The merge is precisely where an anonymous-browse commitment written against an auth-blind route meets a server-rendered auth-aware one.
2. **`community-platform.md:64`** — *"Sort = recency + locality scope. **No personalization algorithm at T1**; simple time + scope."* Encoded by the ranking-authority criterion — and already drifted, since `locality_feed_items` boosts rows matching the Member's interest tags, which is a personalization signal by any ordinary reading.

## Capabilities unlocked

- **Presence & Findability** — no new capability. This consolidates the existing locality-first browse surface onto one address and retires the duplicate.
