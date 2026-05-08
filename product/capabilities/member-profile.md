# Member Profile

**Tier:** T1
**Bundle:** b1
**Primitive:** Member
**Loops served:** 3, 7, 9

## What a Member can do

A Member creates and manages their public profile: display name, avatar, bio, and contact preferences. The profile is the face behind every Item the Member declares — it is a person's page, not a business page. Visitors who find Dr. Park's veterinary service or the Drake's Run Club gatherings can navigate to the Member behind those Items and see everything else they've put into the world, grouped by brand label.

## T1 scope (ships at b1)

- Display name, avatar upload, short bio (optional)
- Contact preferences: website URL, Instagram handle, email (each optional; shown on Member page)
- Privacy controls: which contact fields are public
- Soft delete (account deactivation — Items remain attributed, display name becomes "[deleted member]")
- Public page at `/p/[member-slug]`
- Items grouped by `brand_label` on the public page
- Explicitly joined Communities shown as chips
- Self-view: Edit profile, Add new Item, per-Item Edit actions

## Deferred

- Verification badges (T2)
- Direct messaging between Members (b2)
- Member analytics / stakeholder dashboard (T3 / b3)
- Multi-Member management (not applicable — people-first; no business entity)

## Acceptance signal

A visitor navigates to `/p/[slug]` and sees the Member's name, bio, and all active Items without logging in.
