# T117: Rewire Explore from the dead vendor tables to `discoverable_items`

**Scenario:** substrate
**Status:** Done
**Bundle:** b1
**Depends on:** T114 (kind pills + `?kind=` URL state), T057/T106/T-photo (the MV)
**Blocks:** T115 (filter icon + bottom sheet), T116 (inline list/map toggle)

**Serves:**
- **Spec:** [`product/systems/item.md`](../../product/systems/item.md) § *Discoverable-items MV* — the MV is the public browse index; Explore is its primary consumer.
- **Spec:** [`product/ui/community-platform.md`](../../product/ui/community-platform.md) § *Explore T1*.
- **Deviation resolved:** DEVIATIONS § T114 What (1) — "the kind pills filter a vendor list that has no `items.kind`, so every non-All pill resolves to zero rows." Type B, escalated to PM; this ticket is the answer.
- **Loop:** 3 (Land here), 7 (Make and be found — discovery side).
- **Primitive shape:** Person → `discoverable_items` materialized view → filtered browse. **No schema change.**

## Why this is substrate, not a feature

`/explore` reads `businesses`, `vendor_categories`, and `market_vendors`. None of the three exist in the database any more — the rebuild dropped them, and PostgREST returns `PGRST205` for each. Explore has been rendering an empty vendor list against a 404. Every surface ticket downstream (T115's secondary filters, T116's list/map toggle) assumes a working items-backed result set to filter and toggle. This ticket swaps the read surface; it adds no new user-facing capability beyond making T114's pills do what their AC already promised.

## Read surface

`public.discoverable_items` — a **materialized view**, not a table (migrations 016 → 034 → 036). It is the right read surface: its `WHERE` clause is the public-visibility gate (`state='published'`, not soft-deleted, no Group or a listed-and-undissolved Group), it is `grant select`ed to `anon` + `authenticated`, MVs carry no RLS, and it is already denormalized across items + members + locations + groups so a browse needs exactly one round trip. `idx_discoverable_items_kind` exists for precisely this filter.

## Acceptance Criteria

- [x] `src/lib/explore/items.ts` — `ExploreItem` (extends `FeedItem` so `ItemFeedCard` consumes it unchanged), `EXPLORE_SELECT`, `mapExploreRow`, `fetchExploreItems(client, { kind, limit })`, `searchExploreItems`, `exploreCategoryOptions`.
- [x] `fetchExploreItems` queries `discoverable_items`, orders by `published_at desc`, and applies `.eq('item_kind', kind)` **server-side** when a kind pill is selected — All sends no kind predicate.
  _Why: kind is the primary browse dimension and the MV carries an index for it. Client-side filtering of an unbounded browse index does not scale past the seed set._
- [x] `src/lib/explore/ewkb.ts` — `decodeEwkbPoint(hex)` → `{ longitude, latitude } | null`. PostgREST serializes `geography(Point,4326)` as hex EWKB; there is no PostgREST-readable lat/lng on the MV or on `locations` (see `032_venue_distance.sql` header). Decoding client-side keeps map pins working with **no fourth MV rebuild**.
  _Why: the alternative is a migration that drops and recreates the MV plus six indexes to add two `st_x`/`st_y` columns. A 30-line pure function with unit tests is the smaller, more reversible change for a ticket whose stated shape is "no schema change."_
- [x] `ExplorePage` renders items via the existing `ItemFeedCard`. No new card component.
- [x] The "All" pill shows all 16 published items. Each kind pill filters to that kind: Events → `gathering`, Products → `product`, Services → `service`, Ideas → `wonder`, Offers → `offer`, Asks → `ask`.
- [x] Result count reads in items, not vendors ("12 items", "1 item"), and the empty state offers Clear filters.
- [x] Refetch on kind change keeps the previous result set on screen rather than blanking to "Loading…".
  _Why: a pill tap is a frequent, instant-feeling interaction (T114 AC); a full-list flush on every tap reads as a page load._
- [x] Market and day filters removed from Explore. Both read `markets` / `market_vendors`, which are gone; they can never match. `MarketContext` itself is untouched (Home still consumes it).
- [x] Category filter options derived from the categories actually present in the result set, not from the vendor `CATEGORIES` vocabulary (`bread`, `produce`, `honey-jams`…), which no item uses.
  _Why: items carry a different category vocabulary (`community`, `repair`, `garden`, `food`, `crafts`, `education`, `sustainability`). Inventing an item taxonomy is `explore`'s job, not `build`'s._
- [x] `ExploreMap` takes items and drops pins at the item's nearest approved Location; popup links to the item's canonical Member-scoped URL via `itemHref`.
- [x] Search matches title, description, owner/brand, location label, and category.
- [x] Unit tests green for the EWKB decoder, the items read helper, and the ExplorePage kind-filter wiring.
- [x] `BUILD-LOG.md` updated.

## Workflow gates

- [x] **M2 — `engineering:code-review`** invoked on the diff **before** commit.
- [x] **M3 — `design:accessibility-review`** — N/A; no new page or component (existing `ItemFeedCard`, existing pill tablist).
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration, no schema, no env change.
- [x] **DEVIATIONS.md entry** appended at close.

## Notes

Kind filtering is server-side; search and category stay client-side over the fetched page. That split is deliberate — kind is indexed and coarse, the other two are refinements over an already-narrow set, and T115 will move both into the bottom sheet where it can decide its own fetch strategy.

Map pins use a single accent color rather than a per-kind palette. A seven-color kind ramp is a design decision the DLS does not yet carry, and `PIN_COLORS` is reserved for ownership tiers per `web/CLAUDE.md`. The kind is carried by the popup label instead.

## Completion

Date: 2026-09-02
Commit: `{pending}`
Branch: `t117`

**Shipped.** Explore reads `public.discoverable_items` — the browse index whose own `WHERE` clause is the public-visibility gate — instead of the three retired vendor tables, all of which PostgREST answers with `PGRST205`. Kind filters server-side on the indexed `item_kind`; the All pill sends no predicate. Results render through the existing `ItemFeedCard`, so Explore and the Home locality feed now share one card. Map pins come from a client-side hex-EWKB decoder rather than a fourth rebuild of the MV.

**New:** `src/lib/explore/items.ts` (read helper + `ExploreItem`, which extends `FeedItem` so the card needs no change), `src/lib/explore/ewkb.ts` (PostGIS point decoder). **Rewritten:** `ExplorePage` (vendor query, market filter, day filter and the no-filters `RecruitmentGrid` default all removed), `ExploreMap` (Items instead of Vendors; popup carries the kind label and the canonical Item link).

**Live verification** at 375×812 against the seeded database. Every pill matches the MV's own kind distribution: All 16, Events 3, Products 4, Services 4, Ideas 2, Offers 1, Asks 1. `?kind=` round-trips both directions — tapping Ideas writes `?kind=wonder`; loading `?kind=service` restores the selection and fetches that kind. Kind composes with view (`?kind=gathering&view=map` → 3 pins) and with search (`?q=sourdough` → 1 item). Map view drops 16 pins across all seven kinds, confirming the EWKB decode against real PostgREST output; the pin resolves the DLS token to `rgb(15, 171, 142)` and the popup's View link targets the canonical Member-scoped path.

**Tests:** 51 green across five files — `ExplorePage.test.tsx` (16, including the end-to-end pill→query→results path and a read-failure regression test confirmed red without its fix), `items.test.ts` (16), `ewkb.test.ts` (10), plus T114's `kinds` (5) and `query` (5) untouched. Typecheck clean on the touched files; lint clean on every touched file; production build passes. Full suite matches the `main` baseline exactly — 8 failed / 40 passed on both branches across the script-shelling `ci-enforcement` / `ci-conformance` suites and `EmailFirstSignup` T090.

**Three fixes applied at the M2 gate before commit** — whole-string hex validation (a per-byte `parseInt` reads `'0z'` as 0, not NaN), a `.catch()` so a rejected read falls to the empty state instead of stranding the tab on "Loading…", and the pin colour moved from a hardcoded `#0fab8e` to `var(--color-accent)`.

**One Type B deviation escalated:** 9 of 16 Item detail links 404 — pre-existing `itemHref` behaviour shared with the Home feed, covering Group-filed Items and the four kinds with no detail page. Stub at `planning/backlog/decision-item-canonical-urls.md`, which also carries the wider vendor/market surface retirement (Home is still querying `events` / `businesses` / `markets`).
