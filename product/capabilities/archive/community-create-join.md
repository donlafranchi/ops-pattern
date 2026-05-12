# Community Create and Join

**Tier:** T1
**Bundle:** b1
**Primitive:** Community
**Loops served:** 1, 4

## What a Member can do

A Member creates a Community, browses the Community index, and joins or leaves with one tap. The Drake's Run Club at Drake's — six months of showing up at the bar, and then one Thursday someone says "we should have a name." One Member creates it; the others join. The Gathering Items keep working unchanged. The Community is what they became when they decided they were a group — not what the platform decided they already were.

The platform never auto-creates or auto-assigns any Member to any Community for any reason. This is a hard constraint, not a preference.

## T1 scope (ships at b1)

- Create at `/c/new`: name, kind, description (required); anchor Location and parent Community (optional); discoverability (listed / unlisted / private)
- Browse at `/c`: listed Communities filterable by anchor Location proximity, kind, member count
- Community page at `/c/[slug]`: name, description, member count, steward names, recent Items, join/leave button
- Join: creates `community_memberships` row with `source='explicit'`; toast confirmation
- Leave: sets `left_at`; confirmation prompt before commit
- Soft-membership inference (follows and RSVPs) computed at query time for onboarding suggestions — never written as membership rows
- Geographic suggestion at onboarding: up to 3 nearby listed Communities surfaced as "Groups near you" with one-tap join; skippable; no auto-enrollment
- Dormancy detection: after 90 days of no new explicit members, founder notified, Revive button shown
- Community page publicly viewable for listed/unlisted (no login required to browse)
- Private Communities show only name + "Membership by invitation" to non-members

## Deferred

- Community posting / discussion feeds (b2)
- Stewardship rotation (b2)
- Fund linkage and cooperative capital surfaces (b2/b3)
- `cooperative` kind UI (schema reserved; "Coming soon" label at b1)

## Acceptance signal

A Member creates a Community, a second Member finds it at `/c`, joins with one tap, and the `community_memberships` table has one explicit row — written by user action, not by any platform automation.
