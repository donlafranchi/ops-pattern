---
id: what-group-create-join
purpose: Create, browse, join, leave Groups manually.
layer: what
status: active
---

# Capability: Group Create and Join

**Description:** A Member creates a Group, browses the Group index, and joins or leaves with one tap. Groups are emergent and self-selected — never auto-assigned (canonical wording in [`../foundation/primitives.md`](../foundation/primitives.md) § Group).

**Primitive:** Group
**Tier:** T1
**Bundle:** b1
**Loops served:** 1 (Find your people), 4 (Gather regularly), 11 (Pool resources)

## User story

As a Member, I want to declare a Group when a set of people decides they are an intentional unit — the Drake's Run Club after six months of showing up at the bar, the school-parents who want to coordinate carpools, the sourdough nerds in the neighborhood. One Member creates it; the others join. The Gathering Items keep working unchanged; the Group is what they became when they decided they were a unit — not what the platform decided they already were.

The platform never auto-creates or auto-assigns any Member to any Group — a hard constraint this capability inherits, not a local preference (per [`../foundation/primitives.md`](../foundation/primitives.md) § Group).

## T1 scope (ships at b1)

- **Create** at `/g/new`: name, kind (one of `place` / `interest` / `practice` / `event_anchored` / `family` / `business` per [`../systems/groups.md`](../systems/groups.md)), description (required). Optional: anchor Location (geographic gravity, not boundary), parent Group (nesting, not control). Discoverability: listed / unlisted / private.
- **Browse** at `/g`: listed Groups filterable by anchor Location proximity, kind, member count.
- **Group page** at `/g/[slug]`: name, kind, description, anchor Location, member count, steward names, recent Items, join/leave button (membership flow depends on kind — see role-per-kind matrix in `groups.md`).
- **Join:** creates `group_memberships` row with `source='explicit'`; toast confirmation. For kind='business' Groups, joining requires an invitation from an existing owner (per the role-per-kind constraint).
- **Leave:** sets `left_at`; confirmation prompt before commit.
- **Soft-membership inference** (follows, attendance, response activity) computed at query time for onboarding suggestions — *never* written as `group_memberships` rows. Soft signals exist in `group_memberships.source = 'soft_via_follow'` / `'soft_via_attendance'` rows that are invisible to other Members and do not count toward addressability or pooling (per `groups.md`).
- **Geographic suggestion at onboarding:** up to 3 nearby listed Groups (most often kind='place' or kind='interest') surfaced as "Groups near you" with one-tap join. Skippable. No auto-enrollment.
- **Dormancy detection:** after 90 days of no new explicit members for community kinds (`place`, `interest`, `practice`, `event_anchored`, `family`), founder/stewards notified; Revive button shown. Dormancy rules vary by kind per `groups.md`.
- **Privacy posture:**
  - `listed` — publicly browsable at `/g` and viewable at `/g/[slug]` without login.
  - `unlisted` — viewable at `/g/[slug]` if you have the link; not surfaced in `/g`.
  - `private` — shows only name + "Membership by invitation" to non-members.

## Six kinds at b1

Per [`../systems/groups.md`](../systems/groups.md):

- **Affiliate kinds** (5): `place` (the West Sac school parents), `interest` (the sourdough nerds), `practice` (the Tuesday meditation circle), `event_anchored` (the cohort around a specific Initiative), `family`.
- **Operate kinds** (1): `business` (one or more Members operating commercially together — sole proprietors are kind='business' Groups of one).

The create flow walks the Member through kind selection with examples. Kind is locked at create (one-way decision) — moving from affiliate to operate or vice versa requires creating a new Group.

## Deferred (not in b1)

- **Group posting / discussion feeds** (T2) — when shipped, posts are item-or-group-scoped per the accountable-participation commitment.
- **Stewardship rotation** (T2) — explicit handoff flow for primary steward role.
- **Multi-owner partnerships** (T2) — multiple owner-role memberships in kind='business' Groups (sole prop ships at b1; partnership shape ships at T2 via additional owner-role invites).
- **Federation export of Group identity** (T3 — per Loop 13).

**Deferred indefinitely:** cooperative voting / distributions / off-platform legal verbs (see [`../foundation/primitives.md`](../foundation/primitives.md)). Cooperative-shape coordination is served by kind='business' Groups with multiple owner-role memberships; no separate cooperative entity ships. The `cooperative_*` schema reservations from the prior architecture are dropped.

## Acceptance signal

A Member creates a Group at `/g/new` (any kind), a second Member finds it at `/g`, joins with one tap, and the `group_memberships` table has one explicit row — written by user action, not by any platform automation.

## Related capabilities

- [Event Host](event-host.md) — gathering Items can be Group-scoped at b1.
- [Member Profile](member-profile.md) — Member's Group memberships surface on `/m/[handle]` when public.
- [Home — Locality Feed](../ui/community-platform.md) — Group activity surfaces in the locality feed at T2.

## Changelog

**2026-05-11** — Renamed from `community-create-join.md` → `group-create-join.md` and rewrote on the Group primitive per the 2026-05-10 ratification. Replaced `community_memberships` table with `group_memberships`. Updated routes from `/c` to `/g`. Replaced the four-kind list (community / member-operations / cooperative / family) with the six-kind Group list (five affiliate + one operate). Removed the "Coming soon" placeholder for cooperative kind — superseded by kind='business' Group with multiple owner-role memberships. Original capability preserved at `capabilities/archive/community-create-join.md`.
