---
id: F094
title: Local means the whole metro
status: draft
date: 2026-09-27
depends: [F059, F081]
---
## Story

Maya lives in Midtown and makes hot sauce. Devon runs a Tuesday run club out of Roseville, twenty miles away. To SocialUs they are both local to each other: same metro, same Explore, same "what's happening". Nothing in the app narrows Maya to Midtown, draws a five-kilometre circle around her, or tells her Devon is outside her area. Where Devon's run starts is still shown — that is where it is, not who may see it.

## Acceptance

1. **Every member-facing surface that scopes, ranks or defaults by locality scopes to the metro** — never to a neighbourhood, a city, or a fixed radius. Each row in *Why § Scope* is changed or struck with a reason; none is left silent.
2. **No member-facing string presents locality as tighter than the metro** ("near you", "nearby", "your neighbourhood", "your neighbors") where it is scoping rather than describing. Replacement copy is Don's ([public-is-draft]).
3. **Describing where a thing is stays as fine-grained as its owner gave it** — an address, a neighbourhood label, a service area. Local changes who sees it, not how precisely it is placed.
4. A member's home is their metro (F081 criterion 7). Nothing reads a home place finer than it for scoping.

## Not this

Choosing replacement copy. Neighbourhoods as a finer lens *inside* the metro — F059 already ruled ranking by neighbourhood band out. Multi-metro timezones (`metro-time.ts` hard-codes one). Changing how a Page is placed.

## Why

### Scope — every place the app scopes by locality (`socialus-web` main, 2026-09-27)

| Where | Today | Under this ruling |
|---|---|---|
| Explore / `browse_feed` / withheld announcements | metro | **already metro** — no change |
| Metro picker, "Choose your area" | metro | no change; copy per criterion 2 |
| Browse map | fits to results | no change |
| Venue page "What's happening nearby" (`venue_nearby_items`) | **5 km radius** | **change → metro** |
| Venue "X mi away" (`venue_distance_meters`) | distance from home place | **ask Don** — a label, not a scope; home place goes away (4) |
| Card labels: `neighbourhood` → "Nearby" (`cards/location.ts`, `ExampleBlock`) | relative-to-viewer word | **change** — "Nearby" implies a tighter scope (2) |
| Home feed (`LocalityFeed`, `feed-place.ts`, `locality_feed_items`) | place, neighbourhood-first picker | **unmounted today** — must be metro if ever remounted |
| Home feed / empty-state copy "near you", "nearby" | copy | same as above |
| `MarketSelector` "Nearby" 25 mi (reached from `/you`; legacy `markets` table) | **25-mile radius** | **change → remove or metro** |
| Layout "people near you", `MetroNotCoveredPanel` "what's nearby", onboarding "your neighbors" | copy | **change** (2) |
| `product/foundation/voice.md` samples ("near you", "Browse nearby", "Someone nearby will see it") | house copy | **ask Don** — the house voice uses these words; criterion 2 may mean amending it |
| Onboarding default home (`DEFAULT_HOME_PLACE_ID`) | fictional city | **removed by F081** |
| `member_privacy.locality_precision` | unread by any code | no change; note it exists |
| Local-owner badge (`zip_is_proximal_to_location`) | same MSA as the zip | already metro-grain; see grain note |
| Location create, place search, neighbourhood picker, `resolvePagePlacements` label | where a thing is | **no change** — describing (3) |
| Service radius (`ServiceComposer`) | creator-declared | **no change** — describing (3) |
| Place URL paths, `/p/[...slug]` | state/city/neighbourhood | **no change** — governed by the 2026-09-21 URL rulings |
| `Map.tsx`, `useMapPages`, `MapPreview` viewport + geolocate | no importers | dead code, not in scope |
| `member_saved_searches.place_id` | no UI | not in scope |


**Don, 2026-09-27: "local" meant a neighbourhood or tighter; it now means the whole metro.** At launch density a neighbourhood is empty, and an empty scope teaches a newcomer the app is empty. **The metro is already the unit everything else uses** — waitlist, opening, Explore — so a tighter "local" was a second definition disagreeing with the first.

**Three geographic grains disagree** and a builder will meet them: the zip crosswalk is MSA 40900 (four counties), the metro polygon is CSA 472 (six), places are county/city/neighbourhood. "The metro" in this scenario means the `metro_polygons` row. Whether the crosswalk moves to CSA grain is open (#222).

**Draft, not approved,** because the line between scoping and describing (criterion 3) and the rows it strikes are this document's reading of the ruling, not Don's words.
