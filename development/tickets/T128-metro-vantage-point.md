# T128: The feed's vantage point becomes a metro

**Scenario:** `substrate`
**Status:** Open
**Bundle:** b1 (SocialUs v1), workstream 8 — **dependency of workstream 4**
**Depends on:** T127

**Serves:**
- **Spec contract:** `product/ui/community-platform.md` § T1 → "Metro is the feed's vantage point" (Ratified 2026-09-03); `planning/backlog/decision-surfaces.md` § Metro is the vantage point, as amended 2026-09-04 ("v1 filters by metro").
- **Loop:** 3 (Land here) — the loop's pain point is a newcomer wanting "what's happening within walking distance this week." Metro is the grain at which that question has enough inventory to answer at all; `discovery.md` already ratified metro as the default feed depth (memo-0026).
- **Primitive shape:** Person → `metro_polygons` (reference geography) → `discoverable_items` → browse. No shell entity.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3** — n/a. Substrate: read path and resolver only; the switcher UI that consumes this is T129. Exemption stated per Gate C branch (c).
- [ ] **M4 — `engineering:deploy-checklist`** — **required.** Migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

- [ ] New migration `supabase/migrations/038_metro_feed.sql` adds `public.metro_feed_items(p_metro_id uuid, p_tags text[] default null, p_limit int default 50, p_kind text default null)` returning the same column set as T127's `locality_feed_items`
- [ ] The function selects from `public.discoverable_items` joined to `public.metro_polygons` on `p_metro_id`, filtering `st_intersects(di.nearest_location_geography, mp.geography)` — metro grain, not place grain
- [ ] Ordering identical to `locality_feed_items`: tag-match-first, then `published_at desc`
- [ ] `security invoker`, `set search_path = public, extensions`, `stable`; granted to `anon, authenticated`
- [ ] New `src/lib/feed/feed-metro.ts` exporting `resolveFeedMetro(client, { memberMetroId, requestedSlug })` with precedence **requestedSlug → memberMetroId → default metro** — an explicit request wins
- [ ] `DEFAULT_METRO_SLUG` constant, resolving to the seeded Sacramento CSA, used when neither an explicit request nor a Member metro resolves
- [ ] `listFeedMetros(client)` returns the seeded metros (id, slug, name) for the switcher, ordered by name
- [ ] `getMetroFeed(client, opts)` read helper mirrors `getLocalityFeed`'s shape, running `filterBrowsable` then `attachGroupPrefixes`
- [ ] Unit tests: precedence order across all four combinations; unknown requested slug falls through rather than returning empty; a Member with null `home_metro_id` lands on the default metro, not on a blank feed; metro list returns seeded rows
- [ ] BUILD-LOG.md updated

## Notes

**This is not a parameter change and the sizing depends on knowing that.** `locality_feed_items` intersects `places.geography`, and `places.kind` is constrained to `region / state / county / city / neighborhood` (migration `017`) — **there is no metro value in the enum.** Metro is a separate overlay table with its own polygon (migration `031`, one approximate Sacramento CSA at `seed_method='approx_bbox'`). So metro-grain filtering is a second function against a different table, not a configured call of the first. See `planning/next/review-F059.md` § Condition B.

**`locality_feed_items` stays.** Do not delete or repoint it — the venue page and other place-grain reads still use place grain. This ticket adds a metro path alongside it; F059’s surface consumes the metro one.

**The precedence inversion is deliberate and it is a behaviour change.** `resolveFeedPlace` today returns on `memberPlaceId` *before* it reads `requestedSlug`, which is why the shipped scope picker does nothing for a signed-in Member with a home set. `resolveFeedMetro` inverts it: an explicit request beats a stored default, because a Member who taps the switcher or follows a shared link has stated an intent that a stored preference should not override. Mirror this into `resolveFeedPlace` only if T129 finds it needs to — do not refactor the place path speculatively here.

**The rural hole is real and this ticket only papers it.** `members.home_metro_id` is null outside every seeded CSA (migration `031`, documented as the rural fallback), F031's radius answer is out of v1 with distance removed, and **there is exactly one seeded metro.** The default-metro constant keeps the surface non-blank; it does not make the feed relevant to someone in another state. That is a known v1 limitation of a one-metro launch, not a defect to solve here — record it in DEVIATIONS and leave it.

**Gate B — encodes ratified absolutes:**
- `product/ui/community-platform.md` § T1 — "the feed is scoped to one metro at a time," "no cross-metro union feed" (Ratified 2026-09-03).
- `planning/backlog/decision-surfaces.md` § Feed ranking → Amended 2026-09-04 — v1 filters by metro; the "rank, never filter" entry is demoted to a versioned bet and is **not** encoded here.
