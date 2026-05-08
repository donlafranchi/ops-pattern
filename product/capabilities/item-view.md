# Item View

**Tier:** T1
**Bundle:** b1
**Primitive:** Item
**Loops served:** 3, 7, 8, 9

## What a Member can do

Any visitor — logged in or not — views an Item's public page. The page shows who declared the Item, where it is, what kind it is, and how to respond. The resolve-up section is the structural truth about ownership: whether the person behind the Item is a solo maker, runs multiple locations under a shared label, or is one of many local operators under a franchise name. A newcomer landing on Ferrari Fisheries' wild-caught fish drop can see in one glance that this is one family's operation — and find their other listings.

## T1 scope (ships at b1)

- Public page at `/i/[slug]` — accessible without login
- Kind chip and kind-specific detail section (see item-create.md for per-kind fields)
- Owner line: Member display name linked to `/p/[member-slug]`
- Brand resolve-up (three states): solo → nothing extra; same member_id + same brand_label → "Locally owned" badge + sibling links; different member_ids + same brand_label → "Franchise — local operator" badge
- Attached Location(s) with name and schedule kind
- Community chip if `community_id` is set
- Kind-appropriate response action (Follow / Save / RSVP / "I'd be in")
- Inactive banner for `state=withdrawn` or `fulfilled` (page stays up, no 404)
- Server-side OG metadata for link previews
- Hashtag chips linked to `/h/[hashtag]`

## Deferred

- Item edit history (b2)
- Follow stream (stored at b1; surface at b2)
- Wonder → Gathering conversion UI (b2 — schema reserved)
- Endorsements, reviews (b2 / permanently deferred)

## Acceptance signal

An unauthenticated visitor navigates to `/i/[slug]`, sees the Item details and the correct resolve-up badge, and can tap the response action to be prompted to sign up.
