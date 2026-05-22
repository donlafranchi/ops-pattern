# ADR-0005: Markets are Gathering Items — no separate Market entity

**Status:** Accepted
**Date:** 2026-05-08
**Deciders:** PM
**Scope:** How farmers markets, swap meets, classes, workshops, run clubs, movie nights, and every other recurring or one-time community gathering are modeled
**Touches:** [`product/systems/item.md`](../../product/systems/item.md) (canonical home — the `gathering` kind, ADR-5 row in Decisions encoded), [`product/systems/location.md`](../../product/systems/location.md) (a market's physical place is a Location, not a Market entity), [`product/foundation/canonical-examples.md`](../../product/foundation/canonical-examples.md) (the farmers-market wedge use case), `web/supabase/migrations/` Phase 1 `009c_item_gatherings.sql`

## Decision

A market is a Gathering Item. There is no separate `markets` table, no `Market` entity, no `market_*` schema namespace.

"Gathering" is the broad kind — it covers farmers markets, swap meets, repair cafés, classes, workshops, run clubs, movie nights, neighborhood cleanups, and any other real-world meetup at a Location on a schedule. The distinction between *kinds of gathering* lives in:

- **Categories** via `item_tags` (controlled vocabulary): `farmers-market`, `swap-meet`, `class`, `workshop`, `run-club`, `movie-night`, etc.
- **Hashtags** via `item_hashtags` (user-generated, free-form).

A farmers market in West Sacramento is a row in `items` with `kind='gathering'`, a row in `item_gatherings` carrying recurrence + capacity + cost, a row in `item_locations` attaching it to Drake's (or wherever), and one or more `item_tags` rows including `farmers-market`. The composer that creates it is the same Gathering composer that creates the Thursday Run Club.

The "Market session" feed-card type is removed. Markets render as gathering cards. The `/e/[slug]` URL serves all gathering kinds uniformly.

## Trade-offs

The alternative — a dedicated `markets` table with `market_sessions`, `market_vendors`, `market_locations` — was the original schema and was the *reason* the rebuild was needed. Every market-specific concept (vendors, booths, sessions, opening hours, weather closures) reproduces general gathering concepts (Items at Locations on schedules) at a higher specificity. Once the platform has Items + Gatherings + Locations + Groups, the market-specific schema is redundant tax.

The cost of collapsing: a few user-language places where "market" is the natural word lose their structural backing. Mitigated by the controlled-vocabulary `farmers-market` tag carrying the surface filter, and by the Gathering composer's category selector defaulting to "farmers-market" when the composer is opened from a venue page that has a market history.

The deeper trade-off: the platform's wedge is farmers markets, but the platform's primitive is People declaring Items at Locations. The decision says "the wedge does not become the primitive." A wedge-shaped schema would have forced every later kind of gathering (Run Club, repair café, swap meet) to either pretend to be a market or fragment off into its own table. The Item primitive absorbs all of them.

## Consequences

- No `markets` table, no `market_*` event log, no market-only RLS policies. The schema is exactly one table family — Items + the gathering child + Locations + Item↔Location join — for the entire concept space.
- The "Vendor" mental model dissolves at the schema level. A producer at a farmers market is a Member with a kind='business' Group and one or more `kind='product'` Items; the market itself is a separate `kind='gathering'` Item. The two Items reference the same Location.
- The locality-first index ([`/explore`](../../product/ui/community-platform.md)) filters by kind + category uniformly — there is no Markets tab, only the "Browse events" filter with optional `farmers-market` category narrowing.
- Future kinds of gathering ship by adding categories, not tables. A "co-op meeting" gathering is a `kind='gathering'` Item with category `co-op-meeting`; no schema work.
- This ADR forecloses a path where farmers markets get a richer purpose-built data model than the rest of gatherings. Reversible at significant cost (re-extracting market-specific concepts from the generalized schema), and the foreclosure is the point — the platform's grammar is uniform across all gathering kinds.

## Action Items

1. [x] Decision ratified at project bootstrap (2026-05-08, pre-mission-clarity era).
2. [x] [`item.md`](../../product/systems/item.md) gathering kind is the user-facing ratification; the Decisions-encoded ADR-5 row at line 200 carries the summary.
3. [x] Pointer line in [`../DECISIONS.md`](../DECISIONS.md) pointer index.
4. [x] The 2026-05-11 doc cleanup pass archived `vendor-*` specs that assumed a separate Market model.
5. [ ] Phase 1 migration `009c_item_gatherings.sql` implements the gathering child table per [`notes/migration-to-primitives.md`](../../notes/migration-to-primitives.md).
