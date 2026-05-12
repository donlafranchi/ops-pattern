# Item View

**Tier:** T1
**Bundle:** b1
**Primitive:** Item
**Loops served:** 3, 7, 8, 9

## What a Member can do

Any visitor — logged in or not — views an Item's public page. The page shows who declared the Item, where it is, what kind it is, and how to respond. The resolve-up section is the structural truth about ownership: whether the person behind the Item is a solo maker, runs multiple locations under a shared label, or is one of many local operators under a franchise name. A newcomer landing on Ferrari Fisheries' wild-caught fish drop can see in one glance that this is one family's operation — and find their other listings.

## T1 scope (ships at b1)

- Public page at the Item's kind-specific URL (`/e/[slug]` Event · `/p/[slug]` Product · `/s/[slug]` Service · `/i/[slug]` Idea · `/o/[slug]` Offer · `/a/[slug]` Ask · `/initiative/[slug]` Initiative — per [`../systems/item.md`](../systems/item.md) naming table) — accessible without login
- Kind chip and kind-specific detail section (see item-create.md for per-kind fields)
- Owner line: Member display name linked to `/m/[handle]`
- Brand resolve-up (three states): solo → nothing extra; same member_id + same kind='business' Group → "Locally owned" badge + sibling links; different member_ids + same kind='business' Group → "Franchise — local operator" badge
- Attached Location(s) with name and schedule kind
- Group chip if `group_id` is set (per [`groups.md`](../systems/groups.md) — replaces the prior `community_id` reference per the 2026-05-10 ratification)
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

An unauthenticated visitor navigates to the Item's kind-specific URL, sees the Item details and the correct resolve-up badge, and can tap the response action to be prompted to sign up.
