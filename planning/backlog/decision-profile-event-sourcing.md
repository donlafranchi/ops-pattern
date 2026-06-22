---
id: how-decision-profile-event-sourcing
purpose: Should profile edits be event-sourced through member.profile.update handler?
layer: how
status: draft
source: SPEC-PATCHES drain 2026-06-19
---

# Decision: Profile edit event-sourcing

**Question:** Should profile edits go through the `member.profile.update` action handler (firing `member.profile_updated`), or are they an exception because "profile edits are not declarations"?

**Context:** T089 found that F030 onboarding writes profile fields directly via owner-update RLS with no event. The spec (`member.md` line 531) defines a `member.profile.update` handler that fires `member.profile_updated`, but the ticket deliberately skipped it because building the handler was out of F030 scope. The gap leaves profile edits as the only write path that bypasses the action layer.

**Options:**
- **A:** Event-source profile edits — assign a substrate ticket to wire `member.profile.update` handler so all writes go through the action layer. Consistent with the spec and the same-transaction row+event invariant.
- **B:** Exempt profile edits — treat them as a non-declaration exception. Direct RLS-gated writes are sufficient; the event is unnecessary overhead for self-edits that have no downstream subscribers.

**Pointer:** DEVIATIONS T089 · SPEC-PATCHES line 41
