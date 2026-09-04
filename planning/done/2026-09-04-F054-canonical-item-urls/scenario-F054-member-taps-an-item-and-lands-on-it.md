---
purpose: Scenario — every Item shown on a browse surface opens its own page. Fixes the 9-of-16 404 rate by emitting Group place-path URLs and withholding kinds with no page.
layer: how
status: done
---

# F054: A member taps something in the feed and lands on it

**Bundle:** b1 (SocialUs v1) — workstream 1, "Item detail links resolve"
**Sub-bundle:** b1.4
**Work-map item:** bundle-1.md § Scope #1 — *"Fix the 404s, including Group-filed Items."* Protected item; the bundle names it first in "protect at all cost."
**Loops:** 3 (Land here), 7 (Make and be found — discovery side), 8 (Follow what you love)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → Item (no schema change to `items`; two read-only SQL helpers added)
**Spec contract:** `playbooks/PLATFORM-PATTERNS.md` § *An Item's canonical URL is its Group place-path when filed, its Member path when not* · § *Browse surfaces link only Item kinds that have a detail page* · `CLAUDE.md` § Naming conventions (URL column)
**Status:** next

## The Person

Anyone on Home, Explore, the map, a Member page, or a venue page. They are not signed in and they do not need to be. They see a card, it looks like a thing they might want, and they tap it.

Today that works seven times out of sixteen. Nine cards open a 404. Four of them are the Items filed under a Group — which is to say, the ones with a business or a club behind them, the most credible things on the surface. The other five are kinds the product cannot yet display at all.

## The Story

Rosa opens Home. She sees a sourdough loaf from The Good Loaf, a bike tune-up, a Repair Cafe next Saturday. She taps the loaf and gets the loaf — its price, where to pick it up, and the bakery's name linking through to the bakery. She taps the Repair Cafe and gets the Repair Cafe, with its next date and "Repair Cafe Regulars" credited above it. She backs out and taps the bike tune-up, which nobody filed under anything, and gets it on the mechanic's own page.

What she does not see anywhere is the solar co-buy, the free plums, or the folding-table request. Those kinds are not built. They are not on the surface pretending to be.

## Surfaces

- **Entry points:** Home feed, Explore list, Explore map pin, Member page item list, venue page item sections. All five build links through the same helper.
- **Primary action:** Tap a card.
- **Completion:** The Item's own page renders. No redirect hop, no interstitial.

## Data Captured

None. This scenario writes nothing. It adds two read-only SQL helpers (`place_url_path`, `group_url_prefixes`) and changes what existing read paths select.

## Acceptance Criteria

### A Group-filed Item opens at its Group place-path

**Given** a published Item filed under a Group whose anchor Location resolves to a Place
**When** a member taps its card on any browse surface
**Then** the link is `/p/[…place]/g/[group-slug]/[kind-seg]/[title-slug]-[id8]` and the Item page renders. _Why: `CLAUDE.md` § Naming conventions makes the Group place-path canonical for Group-filed Items. The route already existed; only the link was wrong._

### The place path is real, not decorative

**Given** a Group anchored to a Location in a neighborhood inside a city inside a state
**When** the canonical URL is built
**Then** the place segments are that Location's Place and its URL-form ancestors, county tier skipped, matching what `resolvePlacePath` would resolve back. _Why: no resolver reads these segments, so nothing forces them to be true — which is exactly why they must be built from real data rather than assembled from whatever is nearby. A canonical URL that lies about where something is will be shared and quoted._

### A Group event resolves even though its Group is not a business

**Given** a `gathering` Item filed under a non-business Group (`event_anchored`, `interest`, `place`, `practice`)
**When** the Item page loads at the Group place-path
**Then** the page renders and credits the Group by its name. _Why: `brand_label` is populated only for business Groups, and the resolver returned null without it — so Group events 404 at the resolver even with a correct URL. Group events are in v1 scope; every one of them will be filed under a non-business Group._

### An Item with no Group filing keeps its Member path

**Given** a published Item with no `group_id`
**When** a member taps its card
**Then** the link is `/m/[handle]/[kind-seg]/[title-slug]-[id8]`, unchanged from today. _Why: the Member handle is the one intentionally global namespace; individually-sold Items hang off it. This path already works and must not regress._

### A Group with no resolvable Place falls back rather than breaking

**Given** a Group-filed Item whose Group has no anchor Location, or whose Location has no `place_id`
**When** the canonical URL is built
**Then** it falls back to the Member path and resolves. _Why: `locations.place_id` is nullable and was backfilled for seeded rows only. A missing join must degrade to a working link, never to a malformed one._

### Kinds with no detail page do not appear on browse surfaces

**Given** published Items of kind `ask`, `offer`, `wonder`, or `initiative`
**When** any browse surface renders — feed, Explore list, Explore map, Member page, venue page
**Then** those Items are absent, and their database rows are unchanged. _Why: a dead-end page for an Ask misrepresents the product, because an Ask exists to be answered and no response handler exists for any kind. Withholding is honest and is one line to reverse._

### Nothing that resolves today stops resolving

**Given** the sixteen seeded showcase Items
**When** every card on every browse surface is followed
**Then** eleven render their own page and zero 404. _Why: this is the whole point. The pass mark is zero broken links among what is shown, not a higher count of things shown._

## Out of scope

- Detail pages or composers for the four withheld kinds — deferred to v2 per `bundle-1.md` § Out.
- The response/reply substrate those kinds need.
- Adding an `id8` to the Group URL segment — deferred with local name scoping; see the pattern entry's State tag.
- The vendor/market retirement sweep — its own audit.
- Any change to `items`, the materialized view, or the three feed RPCs.

## Capabilities unlocked

- A shared link to any visible Item resolves for the person who receives it, signed in or not.
- Group-filed Items become reachable, which is the precondition for Group events (workstream 6) being worth building.
