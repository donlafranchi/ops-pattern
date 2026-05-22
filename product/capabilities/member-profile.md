---
purpose: Member public page — bio, Items, follows, shareable URL.
layer: what
status: active
---

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
- Public page at `/m/[handle]` (per the [naming conventions](../../CLAUDE.md))
- Items grouped by `brand_label` on the public page
- Explicitly joined Groups shown as chips
- Self-view: Edit profile, Add new Item, per-Item Edit actions

## Shareable URL

The Member page is one of the four shareable entity surfaces (Item / Member / Location / Group). Folded in from the prior `shareable-listing.md` on 2026-05-22.

- Canonical URL: `/m/[handle]`. Stable — once issued, never changes unless the Member explicitly renames the handle (and old handle 301-redirects).
- SSR with full OG / Twitter Card metadata (title, description, image, type).
- OG image: the Member's avatar, with a kind-themed default fallback.
- Rendered content: display name, bio, selling-tool affordances (when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item, per ADR-12 SUPERSEDED 2026-05-12), recent Items.
- Public read for non-private accounts (per RLS on `members`).
- Mobile-responsive (per [`../ui/design-language.md`](../ui/design-language.md)).

**Anti-spam.** Same layered defense as Item pages: no-admin-queue, Member rate limits, content-policy review.

**Deferred:** Custom OG image upload (T2); embed widgets (T3); per-Member short-link aliases (T3).

## Deferred

- Verification badges (T2)
- Direct messaging between Members (b2)
- Member analytics / stakeholder dashboard (T3 / b3)
- Multi-Member management (not applicable — people-first; no business entity)

## Acceptance signal

A visitor navigates to `/m/[handle]` and sees the Member's name, bio, and all active Items without logging in.
