---
id: spec-patch-2026-06-18-legacy-you-vendor-tabs-retirement
purpose: Spec patch — the legacy old-schema /you vendor tabs (saved/following on businesses/follows) coexist with F042's new-schema Following surface; they want a retirement ticket once new-schema surfaces are the default.
layer: how
status: open
filed: 2026-06-18
caught_by: T109
deviation_pointer: 2026-06-18 — T109
target_spec: product/ui/community-platform.md
target_section: § /you (You tab) — saved / following / settings
---

# Legacy vendor /you tabs coexist with the new-schema Following surface

**What's wrong:** The `/you` page still carries the pre-rebuild vendor-schema tabs (`saved` = `supports`, `following` = `follows.vendor_id`, over `businesses`). F042 (T108) added the new-schema "Following" card-scroll summary (Members/Groups/Venues via `member_follows`/`group_memberships`/`member_saved_searches`) alongside them — two follow concepts now render on the same page during the rebuild transition.

**The fix:** Once the new-schema surfaces are the default, assign a retirement ticket to remove the legacy `businesses`/`follows`/`supports` tabs from `/you` (and decide the fate of the `saved` concept — it has no new-schema equivalent yet). Update `community-platform.md` § /you to describe the new-schema sections (Following summary → `/you/following`) as canonical.

**Caught by:** T109 during build (the coexistence was a deliberate accepted deviation, not a bug).
