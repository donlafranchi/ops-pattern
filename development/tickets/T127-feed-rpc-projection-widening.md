# T127: The locality feed RPC projects what the browse controls need

**Scenario:** `substrate`
**Status:** Open
**Bundle:** b1 (SocialUs v1), workstream 4
**Depends on:** none

**Serves:**
- **Spec contract:** `product/ui/community-platform.md` § T1 Explore (filters, search, map toggle) — the section that becomes the merged surface's spec. `public.locality_feed_items` is the read path F059 adopts; this ticket is the floor under it.
- **Loop:** 3 (Land here) — the feed read that answers "what's happening near me this week." Search and the schedule filter are how a newcomer narrows it, and neither can run today.
- **Primitive shape:** Person → `discoverable_items` → browse. No shell entity; `metro_polygons` and `places` are reference geography, not owners.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3** — n/a. Substrate: no page, no component, nothing rendered. Exemption stated per Gate C branch (c).
- [ ] **M4 — `engineering:deploy-checklist`** — **required.** This ticket adds a migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

- [ ] New migration `supabase/migrations/037_locality_feed_projection.sql` replaces `public.locality_feed_items` with three added output columns: `description text`, `starts_at timestamptz`, `nearest_location_geography geography`
- [ ] Same migration adds an optional fourth parameter `p_kind text default null`; when non-null the function filters `di.item_kind = p_kind`
- [ ] Function keeps `language sql` / `stable` / `security invoker` / `set search_path = public, extensions`
- [ ] `revoke all` + `grant execute` re-issued for the new signature to `anon, authenticated`; the old three-arg signature is dropped in the same migration so two overloads cannot coexist
- [ ] Existing ordering is unchanged: tag-match-first, then `published_at desc`
- [ ] `comment on function` updated to name the added columns and the kind predicate
- [ ] `FeedItem` in `src/lib/feed/locality-feed.ts` gains `description`, `startsAt`, `longitude`, `latitude`; `getLocalityFeed` accepts and forwards `kind`, and decodes geography via the existing `decodeEwkbPoint`
- [ ] `getLocalityFeed` continues to run `filterBrowsable` then `attachGroupPrefixes` (T119) — order unchanged
- [ ] Unit tests: projection maps all three new columns; null geography decodes to null lon/lat without throwing; `kind` omitted sends null; `kind` present forwards verbatim
- [ ] Migration test asserts the new signature exists and the old one does not
- [ ] BUILD-LOG.md updated

## Notes

**Why this is first and separate.** F059 adopts `locality_feed_items` as the merged surface's read path, but the function projects thirteen columns and Explore's controls need three it does not carry — `description` (free-text search), `starts_at` (the week/weekend schedule filter), `nearest_location_geography` (map pins). Until this lands, "port Explore onto Home's ranking" silently ships a surface whose search, schedule filter and map are all dead. See `planning/next/review-F059.md` § Condition A.

Every column already exists on `discoverable_items` (migrations `016` → `034` → `036`) — this is projection only, no view rebuild, no index change. That is why it is cheap and why it must not be folded into the port ticket, where a migration would make the merge un-revertable in one step.

`p_kind` is included here rather than left client-side because Explore filters kind server-side today on the MV's indexed `item_kind`. Dropping to a client-side kind filter would be a behaviour regression at any inventory density.

**Careful with `filterBrowsable` (T119).** The RPC applies `p_limit` *before* the browsable-kind filter, so a page can come back short. T119 accepted this at b1 volumes and logged it. Do not silently change it here — it is a known, recorded deviation and this ticket is not its fix.

**Gate B — encodes ratified absolutes:**
- `product/ui/community-platform.md` § T1 — ordering is locality + recency with declared-interest-tag boost, no behavioural ranking (Ratified 2026-09-04). This function's `order by` is that statement in code.
