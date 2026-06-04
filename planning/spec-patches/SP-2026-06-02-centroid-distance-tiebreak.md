---
id: spec-patch-2026-06-02-centroid-distance-tiebreak
purpose: Spec patch — T076 AC references a centroid-distance tiebreak in 022 that does not exist.
layer: how
status: open
filed: 2026-06-02
caught_by: T076
deviation_pointer: 2026-06-02 — T076
target_spec: development/tickets/T076-*.md
target_section: § AC (reverse-geocode test)
---

# Decide on centroid-distance tiebreak in place_for_coords

**What's wrong:** T076 § AC cites a "centroid-distance tiebreak in `022_places_reverse_geocode.sql`" that does not exist — `place_for_coords` resolves by `ST_Area` ascending only. T076 adds the `places.centroid` column + GiST index a tiebreak would use, but does not implement one (neighbourhood polygons are seeded non-overlapping instead).

**The fix:** Decide whether a centroid-distance tiebreak is wanted in `place_for_coords` for overlapping-polygon cases. If yes, assign a ticket and update 022 (or 024+) to add the tiebreak. If no, update the T076 AC to remove the reference.

**Caught by:** T076 during build

**Deviation pointer:** [`development/deviations/T076.md`](../../development/deviations/T076.md) § 2026-06-02 entry
