# T135: Browse drops past gatherings and carries the Page's own name

**Scenario:** F060 — someone starts something without opening a shop (bundled fix — PM-approved directly alongside F060's ticket set, same session, 2026-09-07; not derived from F060's own Given/When/Then, riding the same "a Page renders correctly wherever it's read" concern as T134)
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`), track A
**Depends on:** none

**Serves:**
- **Loop:** 1 (Gather), 7 (Make and be found) — a stale gathering in browse results is a dead end; a Page with no name in browse results is the same "renders blank" failure T134 fixes elsewhere, in the one place T134 doesn't reach.
- **Primitive shape:** no schema change — both fixes are query-shape corrections over the existing `discoverable_items` view.

**Two independent bugs, same file (`src/lib/explore/items.ts`), same ticket because both are small and both touch `fetchExploreItems`/`EXPLORE_SELECT`:**

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M4** — no migration (both columns — `starts_at`, `group_name` or equivalent — already exist on `discoverable_items`, confirmed present per `034_discoverable_items_starts_at.sql` and the MV's existing `starts_at` projection in `EXPLORE_SELECT`).
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

**Past gatherings drop off:**
- [ ] `fetchExploreItems` (`src/lib/explore/items.ts:85-104`) adds a filter so a `kind='gathering'` Item whose `starts_at` has passed does not appear in the returned page. Non-gathering kinds (no `starts_at` semantics, or null `starts_at`) are unaffected.
- [ ] The client-side `week`/`weekend` filters in `src/lib/explore/filters.ts:201-226` are unchanged — they narrow an already-correct page; they are not the fix.
- [ ] Test: a published gathering with `starts_at` in the past is absent from `fetchExploreItems`'s result; one with `starts_at` in the future is present; a non-gathering Item with no `starts_at` is present regardless.

**The Page's own name travels with the card:**
- [ ] `EXPLORE_SELECT` (`src/lib/explore/items.ts:27-30`) adds the Group's own name (not just `group_id`) to the selected columns.
- [ ] `mapExploreRow` and `ExploreItem`/`ExploreRow` carry the new field through to `ItemFeedCard`'s existing name-fallback path.
- [ ] A browse card for an Item filed under a non-business Group shows that Group's own name rather than falling back to the filing Member's name (today's silent degrade, per `ItemFeedCard.tsx:42`) once T134 makes non-business Pages resolvable — the two tickets are independent to build but the visible fix is only complete once both have landed.
- [ ] Test: a browse row for an Item filed under a non-business Group renders the Group's name, not the Member's.
- [ ] BUILD-LOG.md updated.

## Notes

**Not in scope:** `nearby_discoverable_items` (the venue-nearby widget's own upcoming-only filter) — already correct, untouched. `locality_feed_items`'s own projection gaps — that's F059's ticket, not this one.
