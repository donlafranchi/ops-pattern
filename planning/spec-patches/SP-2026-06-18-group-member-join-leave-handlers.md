---
id: spec-patch-2026-06-18-group-member-join-leave-handlers
purpose: Spec patch — T109 built the missing group.member_leave / group.member_join handlers (assumed shipped); F035 must adopt them and add a fresh-join invite/visibility gate before exposing a public Join CTA.
layer: how
status: open
filed: 2026-06-18
caught_by: T109
deviation_pointer: 2026-06-18 — T109
target_spec: product/systems/groups.md
target_section: § Membership (join/leave handlers) + planning/now/scenario-F035-rosa-finds-mayas-shop.md
---

# group.member_join / group.member_leave shipped in T109; F035 must adopt + gate fresh joins

**What's wrong:** T109's ticket assumed group join/leave handlers were already shipped (by "T070 group-membership"). They were not — `group/` had only create/update-draft/activate, with `group.member_joined` fired solely for the founder inside `group.create`. T109 built `group.member_leave` (soft `left_at` + `group.member_left` event) and `group.member_join` (upsert: fresh insert role='member'; re-join clears `left_at`, preserves role), plus `joinGroupAction`/`leaveGroupAction` wrappers.

**Two follow-ups for F035 (the Group Join CTA, still in `now/`):**
1. **Adopt these handlers** — F035's Join CTA should call `group.member_join`, not invent its own write path. Its scenario's "no new server actions" assumption now holds because T109 built them.
2. **Add a fresh-join invite/visibility gate to `group.member_join`** — the handler currently only checks the Group exists and isn't dissolved. It does NOT gate a fresh join by Group kind/discoverability (a `private`/`family` Group could be joined uninvited). Safe in F042 (only reached via Undo, which re-activates an existing membership), but F035 exposes fresh joins and MUST add the kind/discoverability/invite rules before shipping.

Also: document the join/leave handlers in `groups.md` § Membership and correct the T109 ticket note ("no new server actions" was wrong).

**Caught by:** T109 during build.
