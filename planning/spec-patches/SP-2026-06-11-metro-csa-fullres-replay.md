---
id: spec-patch-2026-06-11-metro-csa-fullres-replay
purpose: Spec patch — T103 seeds the Sacramento CSA metro polygon as an approx bounding box; full-resolution TIGER 2023 CSA geometry replay deferred (fold with T076's pending place-polygon replay).
layer: how
status: open
filed: 2026-06-11
caught_by: T103
deviation_pointer: 2026-06-11 — T103
target_spec: product/systems/discovery.md
target_section: § Community-awareness feed (metro_polygons overlay) + PLATFORM-PATTERNS § metro-polygon overlay
---

# Sacramento CSA metro polygon is an approx bbox, not full-res TIGER geometry

**What's wrong:** T103 seeds the six-county Sacramento-Roseville CSA (code 472) as a single axis-aligned bounding box (`metadata.seed_method='approx_bbox'`), not the full-resolution TIGER/Line 2023 CSA boundary. Coverage and the smallest-by-area tiebreak are correct for the launch market (verified by `supabase/tests/resolve_home_metro.sql`), but the polygon over-includes corners and lacks the true boundary.

**The fix:** Schedule the authoritative full-resolution CSA replay from TIGER/Line 2023 (`tl_2023_us_csa`), folded with T076's already-queued full-res replay of the launch-market place polygons (`SP-2026-06-02-places-md-tiger-source`). One polygon-library backfill ticket can replay both place + metro geometry. No behavior change for b1; this is a data-fidelity refinement.

**Caught by:** T103 during build

**Deviation pointer:** `development/DEVIATIONS.md` § T103 (2026-06-11) — What (2)
