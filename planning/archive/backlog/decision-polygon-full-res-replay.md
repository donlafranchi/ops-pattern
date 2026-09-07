---
id: how-decision-polygon-full-res-replay
purpose: When does the S-metro full-resolution polygon replay get assigned?
layer: how
status: draft
source: SPEC-PATCHES drain 2026-06-19
---

# Decision: Full-resolution polygon replay priority

**Question:** When does the S-metro full-resolution polygon ticket get assigned, and what is its priority relative to b1 user-surface work?

**Context:** T076 shipped launch-market polygons as axis-aligned bounding approximations (`seed_method='approx_bbox'`). Full-resolution TIGER 2023 / City of Sacramento geometry needs a replay to replace the approximations. The approximations are functional for MVP but visually imprecise and will produce incorrect containment queries at boundary edges.

**Options:**
- **A:** Assign the S-metro replay ticket now, prioritized within b1 — accurate geometry is a data-quality prerequisite for location-scoped features (nearby items, place boundaries).
- **B:** Defer to post-b1 — the bounding approximations are good enough for MVP; full-res geometry is a polish concern that doesn't block user-surface shipping.

**Pointer:** DEVIATIONS T076 · SPEC-PATCHES line 29
