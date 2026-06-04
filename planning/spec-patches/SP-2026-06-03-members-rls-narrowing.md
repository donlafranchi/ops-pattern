---
id: spec-patch-2026-06-03-members-rls-narrowing
purpose: Spec patch — `members_public_read` deliberately left permissive after T095 Rev 1+2; remaining cross-Member reads need projection migration.
layer: how
status: open
filed: 2026-06-03
caught_by: T095
deviation_pointer: 2026-06-03 — T095
target_spec: product/systems/member.md
target_section: § RLS sketch + § Privacy controls
---

# Migrate remaining two cross-Member attribution paths onto a SECURITY DEFINER projection

**What's wrong:** T095 deliberately left `members_public_read` permissive. **Revision 2 narrowed the surface**: Group-attribution for items removed the embed of `owner:members!member_id(...)` from product/service/gathering resolvers for Group-filed items (the common case). Two cross-Member base-table reads remain at b1: (a) the Shop "Founded by" lookup (handle/display/avatar), (b) individual-Item attribution (gathering hosted as Member with no Group). Decision (b) on attribution semantics is now resolved at code: a non-discoverable Member's outputs still attribute by handle + display_name (plain text, no link); selling publicly is consent to attribution. Decision (a) — fully closing direct `/rest/v1/members` enumeration — needs the two remaining attribution paths migrated onto a SECURITY DEFINER projection exposing only handle/display_name/avatar (narrower than Revision 1's projection would have been).

**The fix:** Migrate Shop "Founded by" lookup and individual-Item attribution onto a SECURITY DEFINER projection exposing only handle/display_name/avatar. Then tighten `members_public_read` to close direct `/rest/v1/members` enumeration.

**Caught by:** T095 Rev. 1 + scoped down by T095 Rev. 2 during build

**Deviation pointer:** [`development/deviations/T095.md`](../../development/deviations/T095.md) § 2026-06-03 entry
