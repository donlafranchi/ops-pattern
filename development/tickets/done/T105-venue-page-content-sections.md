# T105: Venue page content — "What's happening here" + "What's happening nearby"

**Scenario:** `planning/next/scenario-F033-viewer-finds-venue-page.md`
**Status:** Open
**Bundle:** b1
**Depends on:** T104 (venue page shell — route, header, data fetching, owning-Group resolution)

**Serves:**
- **Loop:** 8 (Follow what you love) — "the standing form of a small public commitment." The content sections are *what* the follower is committing to see. Without them, the follow action has no payoff.
- **Canonical example:** [O1 — A group meets at a regular time and place](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) — a viewer sees Drake's Trivia Night (venue-hosted) distinct from the Thursday Run Club (nearby, different Host).
- **Primitive shape:** Person (viewer) → Location → Group (owning) → Items (venue-hosted); Location → Items (nearby, different Host). No shell entity.

## Workflow gates

- [x] **M2 — `engineering:code-review`** invoked on the diff before commit. Verdict: Approve (no code changes — findings are documented deviations: no item-level `discoverability` column; nearby sort lacks `starts_at`).
- [x] **M3 — `design:accessibility-review`** — new interactive section (expandable nearby). WCAG 2.1 AA PASS (native `<details>`/`<summary>`, `aria-live` empty state, semantic `<a>` cards).
- [ ] **M4 — `engineering:deploy-checklist`** if merging to main with this ticket. **Required before merge** — new migration `033_venue_item_sections.sql` (two RPCs) to apply.
- [x] **DEVIATIONS.md entry** appended at ticket close → [`development/deviations/T105.md`](../deviations/T105.md) (4 deviations + 1 note).

## Acceptance Criteria

### "What's happening here" section

- [ ] Query base tables (NOT the `discoverable_items` MV):
  ```sql
  SELECT i.* FROM items i
  JOIN item_locations il ON il.item_id = i.id
  WHERE il.location_id = :venue_location_id
    AND i.group_id = :owning_group_id
    AND i.state = 'published'
  ORDER BY i.starts_at ASC NULLS LAST
  ```
  _Why: the `discoverable_items` MV only carries `nearest_location_id` (the first-created `item_locations` row). An Item hosted by the owning Group at multiple Locations could have a different Location as its "nearest." The base-table join is the correct path for venue-scoped queries. At b1 scale the query is simple and existing indexes support it._
- [ ] Render each Item using the existing `<ItemCard>` component (same component used in locality feed, Group page, gathering Item page).
  _Why: review-F033 § Reuse — no venue-specific card variant. Consistency across F033/F034/F035 surfaces._
- [ ] Section heading: "What's happening here" — 22px / 600 type slot.
- [ ] Items sorted by next occurrence (ascending). For non-gathering Items (products, services), sort by `created_at DESC` as fallback.
- [ ] Each `<ItemCard>` is a semantic `<a>` wrapping card content, with visible focus ring (`2px --color-focus`). Keyboard-navigable in tab order.

### Empty state — no venue-hosted Items

- [ ] When the owning Group exists but has no published Items at this venue: render **"Nothing scheduled yet."** as the empty state.
  _Why: the empty state must not suggest the viewer should host something — the venue owner creates their own content. The follow CTA (in T104) stays prominent as the viewer's most useful action._
- [ ] Empty-state text uses `aria-live="polite"` region so screen readers announce it on load.

### No-anchored-Group variant (minimal page)

- [ ] When T104's owning-Group resolution returns `null` (no kind='business' Group with `anchor_location_id` matching this Location): **omit the "What's happening here" section entirely.**
- [ ] The page still renders: header, CTAs (Follow + Host), About section, and (if applicable) "What's happening nearby."
  _Why: a public park, community center, or bar without a business Group still has a useful venue page. The section absence is structural (no Group to scope against), not an error._

### "What's happening nearby" expandable section

- [ ] Render as a `<details>`/`<summary>` element (native HTML, free a11y — `aria-expanded` and keyboard Enter/Space toggle built-in).
  _Why: review-F033 § Accessibility recommends native HTML for simplicity at b1. No custom ARIA wiring needed._
- [ ] `<summary>` text: **"What's happening nearby"** — styled as section heading (22px / 600).
- [ ] Default state: **collapsed.** The viewer must actively expand to see nearby Items.
  _Why: the nearby section must not compete with the venue's own "What's happening here" content. Secondary by design — collapsed prevents visual competition._
- [ ] Query the `discoverable_items` MV with GIST index:
  ```sql
  SELECT * FROM discoverable_items
  WHERE ST_DWithin(nearest_location_geography, :venue_geography, :radius_meters)
    AND (group_id != :owning_group_id OR group_id IS NULL)
    AND discoverability = 'public'
  ORDER BY
    ST_Distance(nearest_location_geography, :venue_geography) ASC,
    starts_at ASC NULLS LAST
  LIMIT 20
  ```
  _Why: the MV has a GIST index on `nearest_location_geography`, making the proximity query efficient. The owning Group's Items are excluded (they're already in "What's happening here"). Private and unlisted Items are excluded by the `discoverability = 'public'` filter._
- [ ] Radius: **5000 meters (5 km)** as the default. Implementation decision per scenario § Out of Scope.
  _Why: 5 km captures walkable-to-bikeable distance in the Sacramento launch market — the scale at which "nearby" is meaningful for someone standing at a venue. No user-facing radius control at b1; b2 can tune based on engagement data._
- [ ] Render each nearby Item using the same `<ItemCard>` component.
- [ ] If no nearby Items match, the `<details>` element is **not rendered at all** (no empty expandable).
  _Why: an expandable section that opens to "nothing nearby" is worse than no section. The absence is clean; the presence is a promise._

### Private events exclusion

- [ ] Confirm: Items where `discoverability IN ('private', 'unlisted')` appear in **neither** section.
  - "What's happening here" inherits this from `items.state = 'published'` (draft/archived Items excluded) but must also check discoverability.
  - "What's happening nearby" uses `discoverability = 'public'` filter.
  _Why: the venue page is a public discovery surface. Surfacing private events violates the Host's privacy expectation and the opt-out default in `policy.md`._

### Tab order (a11y)

- [ ] Tab order on the venue page follows the review-F033 recommendation: Follow CTA → Host CTA → first ItemCard in "What's happening here" → expandable nearby toggle → first ItemCard in "What's happening nearby" (if expanded) → About section.
  _Why: the DOM order follows the visual priority order. No `tabindex` hacks needed if the DOM is structured correctly._

### Build artifact

- [ ] `BUILD-LOG.md` updated with T105 status.

## Notes

- **`<ItemCard>` component** is the shared base across F033/F034/F035/locality-feed. Verify it handles all Item kinds (gathering, product, service) with appropriate display. If it currently only handles gatherings, extend it — but that extension is a deviation to log.
- **Nearby query radius** (5 km) is a ticket-level implementation decision. The scenario § Out of Scope explicitly says "the exact radius and ranking are implementation decisions for `ticket`." If 5 km proves too narrow or wide in the launch market, it's a tunable constant, not a schema change.
- **`discoverable_items` MV refresh**: the MV is already refreshed on Item create/update (shipped with T057). No new refresh trigger needed for the nearby query.
- **Multiple owning Groups**: T104 resolves this (first active Group by `created_at`). T105 receives `owning_group_id` from T104's data fetch — no re-resolution needed.
- **Performance at b1 scale**: both queries are simple and well-indexed. The "What's happening here" base-table query hits `item_locations(location_id)` + `items(group_id, state)` — both indexed. The nearby MV query uses the GIST index. No concern at launch-market scale.

## Completion

Date: 2026-06-16
Commit: {pending PM approval}

**Shipped:**
- `033_venue_item_sections.sql` — two `security invoker` RPCs: `venue_hosted_items` (base-table join — items by `group_id` = owning Group, attached to this Location, sorted by `item_gatherings.starts_at` then recency) and `venue_nearby_items` (over `discoverable_items` MV — `ST_DWithin` 5 km, excludes owning Group via `IS DISTINCT FROM`, distance→recency sort, LIMIT 20). — `web/supabase/migrations/`
- `resolveOwningGroup` (deferred from T104) + `getVenueHostedItems` + `getVenueNearbyItems` — `web/src/lib/locations/resolve-venue-items.ts` (+ 9 unit tests).
- `<VenuePublicPage>` extended: "What's happening here" (`<h2>` + `<ItemFeedCard>` grid, or "Nothing scheduled yet." `aria-live` empty state, omitted on the minimal-page variant) + "What's happening nearby" (`<details>`/`<summary>`, collapsed default, rendered only when non-empty). Reuses `<ItemFeedCard>`. (+ 5 unit tests).
- `page.tsx` wiring — resolve owning Group once, fetch both feeds (public, runs for anon).

**Verification:** 48 unit tests pass (resolvers + component); `next build` compiles; eslint + tsc clean; `check:action-layer` OK (291 files). Live-DB RPC assertions are the downstream `test`/deploy step (no local Postgres).

**Deviations:** 4 + 1 note — [`development/deviations/T105.md`](../deviations/T105.md). Key: no `<ItemCard>` existed (reused `<ItemFeedCard>`); no item-level `discoverability` column (MV is already public-only); nearby sort lacks `starts_at` (not in MV).
