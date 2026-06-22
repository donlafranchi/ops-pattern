---
id: how-decision-member-public-page-views
purpose: Document and ratify the public member page read surface and standing badge copy
layer: how
status: draft
source: SPEC-PATCHES drain 2026-06-19
---

# Decision: Member public page views and standing badge

**Question:** (a) Document both `member_has_standing_presence` and `member_public_group_memberships` in `member.md` as the public read surface; (b) ratify the visibility gate "listed Group membership surfaces iff `groups.discoverability='listed'`"; (c) decide standing-badge canonical copy.

**Context:** T092 shipped two new views for the public `/m/[handle]` surface: a GRANT on `member_has_standing_presence` and a new `member_public_group_memberships` view. These are load-bearing for the member public page but are not yet documented in the member spec. The visibility gate (only listed-discoverability Groups appear) is enforced in SQL but not ratified in prose. The standing badge needs canonical copy — "Active in the community" is the placeholder.

**Options:**
- **A:** Document both views in `member.md` § public read surface, ratify the `discoverability='listed'` gate as a pattern-doc entry, and choose badge copy now.
- **B:** Document the views but defer the badge copy decision to the design pass — ship with the placeholder and revisit when the design language for badges is settled.

**Pointer:** DEVIATIONS T091/T092 · SPEC-PATCHES line 48
