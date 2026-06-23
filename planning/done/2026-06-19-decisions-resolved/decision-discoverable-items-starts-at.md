---
id: how-decision-discoverable-items-starts-at
purpose: Add starts_at to discoverable_items MV now or defer?
layer: how
status: draft
source: SPEC-PATCHES drain 2026-06-19
---

# Decision: starts_at in discoverable_items MV

**Question:** Should `starts_at` (from `item_gatherings.starts_at`) be added to the `discoverable_items` materialized view definition now, or deferred?

**Context:** T105 found that the `discoverable_items` MV has no `starts_at` column. The nearby-items RPC cannot filter out past gatherings or sort by next occurrence without it. Adding the column requires a migration (drop + recreate the MV with the join to `item_gatherings`). Without it, event discovery shows stale past gatherings and cannot sort by "soonest."

**Options:**
- **A:** Add `starts_at` now — requires a migration to rebuild the MV with an `item_gatherings` join. Unblocks gathering filtering and sort-by-next for the explore surface.
- **B:** Defer — nearby-items returns all gatherings unsorted by date. Acceptable if the explore surface ships without a time filter, but will need the migration before any time-aware discovery.

**Pointer:** DEVIATIONS T105 · SPEC-PATCHES line 39
