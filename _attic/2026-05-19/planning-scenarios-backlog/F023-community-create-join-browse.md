# Scenario: Community — Create, join, browse, and leave

**Feature:** F019
**Bundle:** b1
**System:** Community
**Loops:** 1, 4, 11 (schema-reserved)
**Status:** backlog

## Summary

A Member creates a Community, browses the Community index, joins and leaves Communities. Communities are emergent and optional — the platform never auto-assigns any Member to any Community for any reason.

## Scenarios

### Member creates a Community

**Given** an authenticated Member navigates to `/c/new`
**When** the create form is submitted with name, kind, description (required), and optional anchor Location
**Then** a `communities` row is created with the Member as founder and first steward, a `community.created` event is logged, the Member is redirected to `/c/[slug]`, and no other Member is enrolled

**Given** the slug derived from the name collides with an existing Community
**When** the form is submitted
**Then** a short random suffix is appended to produce a unique slug; the Member is informed of the final slug on the resulting page

### Member browses Communities

**Given** any user navigates to `/c`
**When** the index loads
**Then** only `listed` Communities are shown, filterable by anchor Location proximity, kind, and member count — unlisted and private Communities are absent

### Community page

**Given** any user navigates to `/c/[slug]` for a listed Community
**When** the page loads
**Then** name, kind, description, anchor Location (if set), parent Community (if set), member count, steward names, and recent Items (`community_id` = this Community) are shown

**Given** an unauthenticated visitor views the page
**When** they tap Join
**Then** the auth gate modal opens: "Sign up to join [Community name]"

**Given** a private Community's slug is visited by a non-member
**When** the page loads
**Then** only the name and "Membership by invitation" copy are shown — no member list, no Items, no description

### Member joins and leaves

**Given** an authenticated Member views `/c/[slug]` and is not yet a member
**When** they tap Join
**Then** a `community_memberships` row is created with `source='explicit'`, a `community.joined` event is logged, the button transitions to "Leave", and a toast confirms "You joined [Community name]"

**Given** an authenticated Member is in a Community and taps Leave
**When** they confirm the prompt
**Then** the membership row is soft-deleted (`left_at` set), a `community.left` event is logged, and the button returns to "Join"

### Community dormancy

**Given** a Community has had no new explicit members in 90 days
**When** the nightly dormancy job runs
**Then** `dormant_at` is set, the founder receives a one-time email, and a "Revive" button appears on the Community page for the founder only

**Given** the founder taps Revive
**When** confirmed
**Then** `dormant_at` is cleared and a `community.revived` event is logged

## Acceptance Criteria

- [ ] Create form requires name, kind, description; anchor Location and parent Community are optional
- [ ] No Community is auto-created by the platform at any point — including backfill, onboarding, or any inference job
- [ ] `communities` table is empty at deploy; Communities exist only when a Member creates one
- [ ] Listed Communities appear in `/c` index; unlisted and private do not
- [ ] Join creates `community_memberships` row with `source='explicit'`; `soft_*` source values are never written at b1
- [ ] Leave sets `left_at`; does not hard-delete the membership row
- [ ] Re-join after leave is allowed; creates a new row with fresh `joined_at`
- [ ] Private Community page shows only name + "Membership by invitation" to non-members
- [ ] Slug collision produces a unique slug without user intervention
- [ ] Unauthenticated Join tap opens auth gate modal

## Out of Scope

- Community posting / discussion feeds (b2)
- Stewardship rotation (b2)
- Fund linkage and cooperative capital surfaces (b2/b3)
- Auto-assignment from geography, follows, or attendance (permanently deferred — hard constraint)
