---
id: spec-patch-2026-06-02-member-update-handler
purpose: Spec patch — profile fields write directly with no `member.update` handler / event.
layer: how
status: open
filed: 2026-06-02
caught_by: T089
deviation_pointer: 2026-06-02 — T089
target_spec: product/systems/member.md
target_section: § Profile
---

# Decide if profile edits should be event-sourced via `member.update` handler

**What's wrong:** F030 onboarding writes profile fields (display_name/handle/bio/pronouns/avatar) directly via the owner-update-RLS client with **no** `member.updated` event (profile edits are not declarations, unlike place-interest/interest, which emit). There is no `member.update` action handler.

**The fix:** Decide whether profile edits should be event-sourced through a `member.update` handler (emitting `member.updated`) or remain direct RLS writes. If the former, assign a substrate ticket.

**Caught by:** T089 during build

**Deviation pointer:** [`development/deviations/T089.md`](../../development/deviations/T089.md) § 2026-06-02 entry
