---
id: what-item-view
purpose: Public Item page — owner, location, kind-appropriate response action.
layer: what
status: active
---

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

## Shareable URL

The Item page is one of the four shareable entity surfaces (Item / Member / Location / Group). Folded in from the prior `shareable-listing.md` on 2026-05-22.

- Kind-specific URL per [`../systems/item.md`](../systems/item.md): `/e/[slug]` Event · `/p/[slug]` Product · `/s/[slug]` Service · `/i/[slug]` Idea · `/o/[slug]` Offer · `/a/[slug]` Ask · `/initiative/[slug]` Initiative.
- SSR with full OG / Twitter Card metadata (title, description, image, type).
- OG image: kind-themed default at b1; T2 promotes to Member-uploaded photo.
- Stable slug — once issued, never changes unless the Member explicitly renames the Item (and old slug 301-redirects).
- Public read for non-private entities (per RLS rules on `items`).
- Mobile-responsive (per [`../ui/design-language.md`](../ui/design-language.md)).

**Anti-spam.** Stable shareable URLs are a vector for SEO-style listing creation; the [no-admin-queue principle](../systems/location.md) (Members enter their own data) + Member rate limits (per [`../systems/member.md`](../systems/member.md)) + content-policy review (per [`../foundation/policy.md`](../foundation/policy.md)) are the layered defenses.

**Deferred (shareable URL):** Custom OG image upload per entity (T2 — depends on photo upload); embed widgets for external sites (T3); per-entity short-link aliases (T3).

## Deferred

- Item edit history (b2)
- Follow stream (stored at b1; surface at b2)
- Wonder → Gathering conversion UI (b2 — schema reserved)
- Endorsements, reviews (b2 / permanently deferred)

## Acceptance signal

An unauthenticated visitor navigates to the Item's kind-specific URL, sees the Item details and the correct resolve-up badge, and can tap the response action to be prompted to sign up.
