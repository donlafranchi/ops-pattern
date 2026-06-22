---
id: how-decision-group-follow-substrate
purpose: Dedicated group_follows table or polymorphic reshape of member_follows?
layer: how
status: draft
source: SPEC-PATCHES drain 2026-06-19
---

# Decision: Group-follow substrate shape

**Question:** Should group-follow use a dedicated `group_follows` table or a polymorphic reshape of `member_follows` (adding `target_kind`)?

**Context:** T074 found that `member_follows` has a composite PK of `follower_member_id, followed_member_id` — member-to-member only. The F035 scenario needs group-follow (`target_kind='group'`), and F042 (follow-CTA) depends on the same substrate. A dedicated table keeps member_follows simple; a polymorphic reshape consolidates follow logic but widens the PK and complicates RLS.

**Options:**
- **A:** Dedicated `group_follows` table — clean separation, no migration risk to existing member_follows rows, but two follow code paths to maintain.
- **B:** Polymorphic reshape of `member_follows` — add `target_kind` + `target_id`, drop or alias the current PK. Single follow substrate, but migration touches every existing row and RLS policy.

**Pointer:** DEVIATIONS T074 · SPEC-PATCHES line 32
