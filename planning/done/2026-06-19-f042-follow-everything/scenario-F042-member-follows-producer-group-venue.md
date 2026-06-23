---
id: how-f042-member-follows-producer-group-venue
purpose: Backlog scenario — cross-cutting follow CTA tested for Group and Venue (Member follow tested in F032).
layer: how
status: approved
---

# F042: A member follows a producer, a group, and a venue

**Bundle:** b1
**Loops:** 8 (Follow what you love)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love).
**Primitive shape:** Person → multiple follow substrates: `member_follows` (Member follow, covered in F032 — referenced here for cross-cutting test), `group_memberships(source='explicit')` (Group follow), `member_saved_searches(location_id)` (Venue follow).
**Status:** approved
**New scenario** — no existing F-number. F032 covers the Member follow path; this scenario covers Group + Venue follow paths and the cross-cutting "Things you follow" management surface.

## The Person

A Member who has built up a small set of things they care about — a baker, a brewery, a Run Club, the venue down the street, a couple of producers. They want one place to see all their follows and unfollow if they lose interest. Today, each follow is a separate substrate (Member follow, Group membership, saved-search); the platform's job is to surface them in one coherent list without leaking the substrate distinction.

## The Story

From the venue page (F033), the Member taps "Follow this venue" → `member_saved_searches` row writes with `location_id` populated. From the business Group page (F035) for a non-business Group (community kind), the Member taps "Join" → `group_memberships(source='explicit')` row writes. From a Member page (F032), the Member taps "Follow" → `member_follows` row writes.

On `/you`, a **"Following" summary section** shows a horizontal card scroll of followed entities (Members, Groups, Venues mixed together, most recent first). Each card shows the entity's display name + thumbnail. A "More" link at the end of the scroll navigates to `/you/following`.

At `/you/following`, the **full management page** breaks follows into three flat sections — **People**, **Groups**, **Venues** — each row labeled with the entity's display name + thumbnail. People rows show an Unfollow affordance; Group rows show a Leave affordance; Venue rows show an Unfollow affordance. Tapping Unfollow on a People row writes `member_follows.unfollowed_at`; `member.unfollowed` event logs. Tapping Leave on a Group row writes `group_memberships.left_at`; `group.member_left` event logs. Tapping Unfollow on a Venue row writes `member_saved_searches.removed_at`; `member.saved_search.removed` event logs.

## Surfaces

- **Entry points (writes):** F032 (Member page Follow), F033 (Venue page "Follow this venue"), F035 (Group page Join for community kinds).
- **Entry point (glance):** `/you` → "Following" summary section (horizontal card scroll, mixed entities, most recent first, "More" link).
- **Entry point (manage):** `/you/following` (full page, three sections: People / Groups / Venues).
- **Primary actions:** Follow (Member / Venue / Group) — covered by the source-page scenarios. Unfollow (People, Venues) and Leave (Groups) — covered by `/you/following`.
- **Composer / interaction:** No composer; list + unfollow/leave affordance per row.
- **Completion:** Stays on `/you/following`; row updates inline.
- **Discovery:** N/A.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Members I follow | `member_follows(follower_member_id, followed_member_id) where unfollowed_at is null` | read at b1; writes covered by F032 |
| Groups I'm in | `group_memberships(member_id, group_id) where left_at is null and source='explicit'` | read at b1; writes covered by F035 |
| Venues I follow | `member_saved_searches(member_id, location_id) where removed_at is null and location_id is not null` | read at b1; writes covered by F033 |

Implicit: on Unfollow/Leave, the appropriate soft-delete handler fires (`member.unfollow`, `group.member_leave`, `member.saved_search.remove`); event log row writes per substrate.

## Acceptance Criteria

### Follow Venue from venue page

**Given** an auth'd Member on a venue page
**When** they tap "Follow this venue"
**Then** a `member_saved_searches` row writes with `(member_id, location_id=venue, label=<venue name>, removed_at=NULL)`; `member.saved_search.created` event logs; CTA flips to "Following." (Same as F033 acceptance — duplicated here for cross-cutting completeness.)

### Join community-kind Group from Group page

**Given** an auth'd Member on a kind='interest' / 'practice' / 'event_anchored' / 'place' / 'family' Group page
**When** they tap "Join"
**Then** a `group_memberships` row writes with `role` per kind's default + `source='explicit'`; `group.member_joined` event logs; CTA flips to "Member." (Same as F035 acceptance.)

### Following summary on /you

**Given** an auth'd Member with follows across Members, Groups, and Venues
**When** they load `/you`
**Then** a "Following" section renders with a horizontal card scroll showing followed entities (mixed, most recent first), each card showing display name + thumbnail. A "More" link at the end navigates to `/you/following`.

### Full follows list at /you/following

**Given** an auth'd Member with follows across Members, Groups, and Venues
**When** they load `/you/following`
**Then** the page surfaces three sections — **People**, **Groups**, **Venues** — each row labeled with the entity's display name + thumbnail. People and Venue rows show "Unfollow"; Group rows show "Leave."

### Unfollow / Leave writes the correct soft-delete + event per substrate

**Given** the Member is on `/you/following`
**When** they tap Unfollow on a People row → `member_follows.unfollowed_at` updates; `member.unfollowed` event logs.
**When** they tap Leave on a Group row → `group_memberships.left_at` updates; `group.member_left` event logs.
**When** they tap Unfollow on a Venue row → `member_saved_searches.removed_at` updates; `member.saved_search.removed` event logs.

**Then** in all three cases, the row disappears from the list (or shows an "Undo" affordance for a few seconds).

### Counts respect privacy gates

**Given** a Group whose listed-vs-private split affects the member count
**When** the Member's `/you/following` page surfaces "follower count" for any followed Group
**Then** the count reflects listed memberships only, matching the public Group page.

## Edge Cases

- **No follows yet:** empty-state ("Nothing followed yet — start exploring.") with a CTA back to `/explore` or `/`.
- **Followed Member soft-deletes:** the row stays in the list as a tombstone (or quietly disappears, depending on UX call); no error.
- **Followed Group `discoverability` changes to private:** the row stays as long as the Member is still a listed member; otherwise hidden.
- **Re-follow after unfollow:** soft-deleted rows are re-activated (clear `unfollowed_at` / `left_at` / `removed_at`) rather than inserting duplicates.

## Assumptions

- F032 (Member follow), F033 (Venue follow), F035 (Group join) ship before or alongside this scenario.
- Phase 1 substrate: `member_follows`, `group_memberships`, `member_saved_searches`; corresponding action handlers and events.
- S-saved-search substrate ticket ships (`member.saved_search.*` handlers + events).

## Out of Scope

- Follow-stream / notification surfaces (where followed entities' new Items aggregate) — b2.
- Mute / notification preferences per followed entity — b2.
- Bulk unfollow / "clear all" — b2.
- Follow recommendations ("people you might want to follow") — b2+.
- Following hashtags or interest tags as standalone subjects — schema-allowed via saved-search; surface deferred to b2.

## Capabilities unlocked

- **5. Customer & Community Relationships** — Members can follow a business Group (writes `group_memberships`).
- **5. Customer & Community Relationships** — Members can follow a venue where the producer operates (saved-search substrate).
- **5. Customer & Community Relationships** — Follow counts visible on public pages (member count on Group page).
- (Consumer-facing — the "Things you follow" management surface lives in the Consumer baseline; not in producer taxonomy categories.)
