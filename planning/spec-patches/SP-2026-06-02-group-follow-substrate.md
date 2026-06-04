---
id: spec-patch-2026-06-02-group-follow-substrate
purpose: Spec patch — `member_follows` is member→member only; group-follow has no substrate.
layer: how
status: open
filed: 2026-06-02
caught_by: T074
deviation_pointer: 2026-06-02 — T074
target_spec: planning/now/scenario-F035-rosa-finds-mayas-shop.md + product/systems/member.md
target_section: § Data Captured (follow) + § Follows substrate
---

# Group-follow has no substrate — decide shape (group_follows or polymorphic reshape)

**What's wrong:** scenario-F035 describes a `member_follows` row with `target_kind='group'` / `target_id=$group_id`, but the shipped `member_follows` (T048, `010_member_interests_follows.sql`) is member→member only (composite PK `(follower_member_id, followed_member_id)`, no polymorphic target). Group-follow has no substrate.

**The fix:** Decide the shape — a dedicated `group_follows` table OR a polymorphic reshape of `member_follows` — and assign it to F042 (the follow-CTA scenario) so the F035 Follow CTA can persist.

**Caught by:** T074 during build

**Deviation pointer:** [`development/deviations/T074.md`](../../development/deviations/T074.md) § 2026-06-02 entry
