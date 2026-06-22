---
id: how-decision-rls-enumeration-closure
purpose: Scope and priority for closing direct /rest/v1/members enumeration
layer: how
status: draft
source: SPEC-PATCHES drain 2026-06-19
---

# Decision: RLS enumeration closure for members table

**Question:** What is the scope and priority of a ticket to close direct `/rest/v1/members` enumeration by migrating the two remaining cross-Member base-table reads onto a SECURITY DEFINER projection?

**Context:** T095 Rev 2 narrowed the member RLS surface, but two cross-Member base-table reads remain: (a) Shop "Founded by" lookup (handle/display_name/avatar) and (b) individual-Item attribution. Both need only three columns. Closing direct enumeration requires a SECURITY DEFINER view or function exposing only `handle`, `display_name`, and `avatar_url`, then revoking the broad SELECT on `members` for `anon`/`authenticated` roles.

**Options:**
- **A:** Assign as a high-priority b1 substrate ticket — member enumeration is a security surface; closing it before public launch prevents data scraping of the full members table.
- **B:** Defer to post-b1 — the current RLS policies already filter rows adequately for the shipped surfaces; the enumeration risk is low at launch scale and can be closed in a hardening pass.

**Pointer:** DEVIATIONS T095 · SPEC-PATCHES line 50
