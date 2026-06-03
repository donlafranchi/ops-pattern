---
id: how-t087-locality-feed-query
purpose: Locality-first feed query — a SQL function over discoverable_items filtered by place-polygon containment + interest-tag boost, plus the TS read helper and widen-locality fallback.
layer: how
status: open
---

# T087 — Locality feed query (`locality_feed_items` SQL fn + read helper)

**Scenario:** [F030 — A newcomer signs up and lands in the feed](../../planning/now/scenario-F030-newcomer-signs-up-and-lands-in-feed.md)
**Binds to:** migration 016 (`discoverable_items` MV) · 017 (`places` geography) · ADR-20 (place hierarchy) · `product/systems/location.md` (anti-Nextdoor: no Location feed — this is a *Place* feed)
**Status:** Open
**Bundle:** b1 (b1.4 — Newcomer entry)
**Depends on:** T057 (discoverable_items, anon-readable) · T058 (places)
**Repo / branch:** web / `t-f030`

## Serves

- F030 AC "Feed re-renders against the chosen scope" — Items matching `member_place_interests` × `member_interests` ordered by recency + locality.
- F030 AC "Empty-state widen-locality" — escalate to the parent Place.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **DEVIATIONS.md entry** at close.

## Acceptance Criteria

### Migration — `supabase/migrations/027_locality_feed.sql`

- [ ] `public.locality_feed_items(p_place_id uuid, p_tags text[] default null, p_limit int default 50)` returns the discoverable_items columns the card needs (`item_id, member_handle, member_display_name, item_kind, title, category, brand_label, group_id, nearest_location_label, response_count, primary_tag, published_at`).
- [ ] Filter: `st_intersects(di.nearest_location_geography, p.geography)` against the chosen place's polygon (descendant Places are inside the polygon, so containment covers the hierarchy without recursion). Items with null `nearest_location_geography` are excluded.
- [ ] Order: tag-match first (`primary_tag = any(p_tags)` when `p_tags` non-null/non-empty) then `published_at desc`. No tags → pure recency. Tags never hard-filter (cold-start).
- [ ] `stable`, `security invoker` (discoverable_items + places are both anon-readable); `grant execute … to anon, authenticated`.

### Read helper — `src/lib/feed/locality-feed.ts`

- [ ] `getLocalityFeed(supabase, { placeId, interestTags?, limit? })` → `Promise<FeedItem[]>` — calls `supabase.rpc('locality_feed_items', …)`, maps rows to `FeedItem`. `normalizeTags(tags)` lowercases + dedupes + drops invalid; empty → null. `clampLimit(n)` → 1..100, default 50.
- [ ] `widenLocality(supabase, placeId)` → `Promise<{ placeId, displayName } | null>` — resolves the parent Place (`places.parent_id`); null at the root. Used by the empty-state CTA.
- [ ] `FeedItem` type exported.

### Tests — `tests/feed-locality.test.ts`

- [ ] `normalizeTags` / `clampLimit` pure-logic cases.
- [ ] `getLocalityFeed` against a fake `{ rpc }` client — passes normalized args; maps rows; returns `[]` on null data.
- [ ] `widenLocality` against a fake `{ from }` client — returns parent, null at root.
- [ ] Migration source-shape: contains `st_intersects`, `order by`, `grant execute`, `to anon`.

### BUILD-LOG

- [ ] BUILD-LOG T087 line.

## Notes

- The Place feed (not Location feed) is the anti-Nextdoor boundary — the function keys off a `places` polygon, never a per-Location subscription.
- Requires `places.geography` polygons to be seeded for matches; the F030 eval fixture seeds its own place polygon so it does not depend on the unmerged T076 region seed.

## Completion

Date: 2026-06-02
Commit: `b12fbd6` (branch `t-f030`, web repo; unmerged per task)
Status: Build complete. 9/9 T087 vitest GREEN; conformance OK; tsc/eslint clean.
Notes: Migration `027_locality_feed.sql` (`public.locality_feed_items` — `st_intersects` against the Place polygon, tag-boost then recency, `stable`/`security invoker`, granted anon+authenticated). `src/lib/feed/locality-feed.ts` (`getLocalityFeed` via rpc, `widenLocality`, `normalizeTags`/`clampLimit`). M2 self-review PROCEED. DEVIATIONS 2026-06-02 (SQL function vs `.from()`). Live PostGIS behaviour verified by the F030 eval downstream.
