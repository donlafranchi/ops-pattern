---
id: how-f032-viewer-finds-member-page-and-follows
purpose: Backlog scenario — a viewer lands on a Member public page and taps follow.
layer: how
status: draft
---

# F032: A viewer finds a member's public page and follows them

**Bundle:** b1
**Loops:** 8 (Follow what you love)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the viewer side. Also seeds P3 (variable-cadence producer).
**Primitive shape:** Person → `members` (read) + `member_follows` (write).
**Status:** backlog
**Replaces:** F025 (archived 2026-05-28). Splits per the reframe — F032 takes the Member page; F035 takes the Group page.

## The Person

A regular at Drake's tapped through to a recurring gathering, saw a host name, and now wants to see what else that person is up to. They click the host's name → land on `/m/[handle]`.

## The Story

The Member page header shows display name, handle, optional photo + bio + pronouns, a standing-presence badge if the Member has ≥1 active kind='business' Group membership OR steward-role membership in any Group. Below the header: a list of Items the Member has authored, grouped by `brand_label` where applicable. Below that: Group memberships, respecting privacy (only listed memberships visible).

A "Follow" CTA sits below the header — auth-gated for write but visible to anon (with a sign-in prompt on tap). On tap by an auth'd Member, a `member_follows` row writes; the CTA flips to "Following" with an unfollow affordance. Place-interests stay private (they're owner-only RLS); they don't surface on the public Member page at b1.

## Surfaces

- **Entry point:** `/m/[handle]` — reachable from any Item authored by that Member, any Group page listing them, any follow CTA across the platform.
- **Primary action:** "Follow" (writes `member_follows`).
- **Composer / interaction:** Read-mostly page; the only write is Follow / Unfollow.
- **Completion:** Stays on `/m/[handle]`; CTA updates to "Following."
- **Discovery:** N/A — this is a read surface for the viewer.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Follow this person | `member_follows(follower_member_id, followed_member_id)` composite PK | yes (write on tap) |

Implicit: `member.followed` event with `acting_member_id = follower`; rendering reads from `members`, `items`, `group_memberships`, `member_has_standing_presence` view.

## Acceptance Criteria

### Anonymous visitor can read the Member page

**Given** an anonymous visitor opens `/m/[handle]`
**When** the page loads
**Then** the page renders the Member's display name, handle, photo, bio, pronouns, standing-presence badge (if applicable), Items, and listed Group memberships; no auth required for read.

### Anonymous follow tap triggers sign-in

**Given** an anonymous visitor taps "Follow"
**When** the tap fires
**Then** the auth flow opens with a return URL set to the current Member page; on successful sign-in, the follow CTA executes and the page reloads with "Following" state.

### Authenticated follow writes a row + event

**Given** an auth'd Member on another Member's page
**When** they tap "Follow"
**Then** a `member_follows` row writes with `(follower_member_id, followed_member_id)`; `member.followed` event logs; CTA flips to "Following" (with an unfollow affordance accessible by tap-and-confirm or menu).

### Privacy gates hold

**Given** the target Member has marked some Group memberships as private (via `members.stakeholder_visibility` or per-membership setting)
**When** a viewer (anon or auth) loads the page
**Then** only listed memberships render in the Group list; private memberships are not visible at all; Place-interests are never surfaced on the public page.

### Soft-deleted Member returns 404

**Given** the target Member's `deleted_at` is non-null
**When** any viewer loads `/m/[handle]`
**Then** the page returns 404 (or a tombstone page if `handle_history` indicates a recent handle change with redirect — see `member.md`).

## Edge Cases

- **Self-view** (viewer is the target Member): "Follow" CTA hidden or replaced with "Edit profile."
- **Member with no Items + no Group memberships:** empty-state Item list ("Nothing posted yet") and empty Group section.
- **Handle changed recently:** redirect from old handle to new for the redirect window per `member.md`.

## Assumptions

- Phase 1 substrate: `members`, `member_follows`, `member_has_standing_presence` view, `items` with `brand_label` for resolve-up rendering.
- The standing-presence badge derivation is implemented per `groups.md`.
- Handle-redirect window decision (currently pending in `pending-ratifications.md`) lands before this scenario goes to `ticket`.

## Out of Scope

- Member page edit UI for the Member themselves — separate edit-profile scenario; deferred or absorbed into F030's onboarding surfaces.
- Follow-stream surface (where followed Members' Items aggregate) — b2.
- Profile customization (cover image, theming) — b2+.
- Public Place-interest surfacing — never planned at b1 (privacy commitment).

## Capabilities unlocked

- **1. Presence & Findability** — Member public page at `/m/[handle]` showing Items and Group memberships.
- **5. Customer & Community Relationships** — members can follow a producer (member-to-member follow).
- **9. Reputation & Social Proof** — standing-presence badge surfaces on member public page (per `member.md`).
