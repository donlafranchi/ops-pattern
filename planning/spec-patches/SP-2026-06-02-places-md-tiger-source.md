---
id: spec-patch-2026-06-02-places-md-tiger-source
purpose: Spec patch — places.md polygon source-of-truth question needs resolution + T1 seed list reconciliation.
layer: how
status: open
filed: 2026-06-02
caught_by: T076
deviation_pointer: 2026-06-02 — T076
target_spec: product/systems/places.md
target_section: § Open questions — Polygon source-of-truth and licensing; § T1 seed list
---

# Resolve polygon source-of-truth in places.md + confirm T1 seed list

**What's wrong:** `places.md` § Open questions lists "Polygon source-of-truth and licensing" as deferred. T076 shipped Census TIGER/Line 2023 (counties/state/places) + City of Sacramento Open Data (neighbourhoods), all public-domain / open-licence — embedded as approximations pending S-metro full-res replay. Also need to confirm § T1 seed list matches the 024 rows (no metro/region row; metros live in `metro_polygons`).

**The fix:** Move the "Polygon source-of-truth and licensing" question from "deferred" to "resolved (launch market): Census TIGER/Line 2023 + City of Sacramento Open Data, all public-domain / open-licence; embedded as approximations pending S-metro full-res replay." Confirm § T1 seed list matches the 024 rows.

**Caught by:** T076 during build

**Deviation pointer:** [`development/deviations/T076.md`](../../development/deviations/T076.md) § 2026-06-02 entry
