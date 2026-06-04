---
id: spec-patch-2026-06-02-tiger-polygon-replay
purpose: Spec patch — launch-market polygons shipped as approximations; full-res TIGER replay deferred to S-metro.
layer: how
status: open
filed: 2026-06-02
caught_by: T076
deviation_pointer: 2026-06-02 — T076
target_spec: supabase/migrations/024_places_polygon_centroid_seed.sql + future S-metro ticket
target_section: launch-market polygons
---

# Replay full-res TIGER 2023 + City of Sacramento polygons (S-metro)

**What's wrong:** Launch-market polygons shipped as axis-aligned bounding approximations (`seed_method='approx_bbox'`), not full-resolution TIGER 2023 / City of Sacramento geometry. URLs to the authoritative shapefiles are documented in the 024 header for replay.

**The fix:** When S-metro builds the polygon-library backfill, replay the authoritative shapefiles into `places.geography` to replace the bounding-box approximations.

**Caught by:** T076 during build

**Deviation pointer:** [`development/deviations/T076.md`](../../development/deviations/T076.md) § 2026-06-02 entry
