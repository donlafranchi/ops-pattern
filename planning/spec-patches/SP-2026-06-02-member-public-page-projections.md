---
id: spec-patch-2026-06-02-member-public-page-projections
purpose: Spec patch — document the public Member-page read surface + ratify listed-membership visibility gate.
layer: how
status: open
filed: 2026-06-02
caught_by: T092
deviation_pointer: 2026-06-02 — T091/T092
target_spec: product/systems/member.md
target_section: § (Member public page / Follows)
---

# Document `/m/[handle]` public read surface + ratify listed-membership gate

**What's wrong:** F032 ships the public `/m/[handle]` read surface, which required migration `029` to add (a) a GRANT on the existing `member_has_standing_presence` view to anon/authenticated and (b) a new privacy-preserving public projection view `public.member_public_group_memberships` (active explicit memberships in non-dissolved, **listed** Groups). Neither is documented in `member.md`.

**The fix:** Document both in `member.md` as the public read surface, and ratify the b1 visibility gate: "listed Group membership surfaces iff `groups.discoverability='listed'`" (vs. a future per-membership / `members.stakeholder_visibility` control, which remain reserved substrate). Also decide whether the standing-badge copy ("Active in the community") is the canonical label.

**Caught by:** T092 during build

**Deviation pointer:** [`development/deviations/T091.md`](../../development/deviations/T091.md), [`development/deviations/T092.md`](../../development/deviations/T092.md) § 2026-06-02 entries
