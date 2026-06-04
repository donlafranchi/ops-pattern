---
id: spec-patch-2026-06-02-schedule-kind-permanent-typo
purpose: Spec patch — F038 scenario specifies `schedule_kind='permanent'` but the CHECK forbids it.
layer: how
status: open
filed: 2026-06-02
caught_by: T077
deviation_pointer: 2026-06-02 — T077
target_spec: planning/now/scenario-F038-producer-lists-product.md
target_section: § Data Captured (Pickup point row)
---

# Patch scenario-F038 Data-Captured row: `schedule_kind='permanent'` → `'ongoing'`

**What's wrong:** scenario-F038 § Data Captured (Pickup point row) specifies `item_locations.schedule_kind='permanent'`, but the shipped `item_locations.schedule_kind` CHECK (T056, `015_items.sql`) permits only `one_time | recurring | ongoing | by_appointment`. `'permanent'` conflates Location *kind* with the Item↔Location *schedule* enum.

**The fix:** Patch the scenario row to `schedule_kind='ongoing'`.

**Caught by:** T077 during build

**Deviation pointer:** [`development/deviations/T077.md`](../../development/deviations/T077.md) § 2026-06-02 entry
