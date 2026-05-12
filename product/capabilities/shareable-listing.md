# Capability: Shareable Entity Pages

**Description:** Every Item, Member, Location, and Group has a stable, shareable URL with SSR metadata that previews well on social platforms, messaging apps, and email clients.

**Primitive:** Item · Member · Location · Group (all rendered to public pages at b1)
**Tier:** T1
**Bundle:** b1
**Loops served:** 9 (Refer), implicitly underpins every loop with a public surface

## User story

As a Member, I want to share a link to my Item, my page, a Location I love, or a Group I belong to, so that the platform's content can travel across the wider web and bring new Members into my locality's activity.

## Scope

Public entity pages with SSR + OpenGraph metadata at b1:

- **Item pages** — kind-specific URLs (`/e/[slug]` Event · `/p/[slug]` Product · `/s/[slug]` Service · `/i/[slug]` Idea · `/o/[slug]` Offer · `/a/[slug]` Ask · `/initiative/[slug]` Initiative; per [`../systems/item.md`](../systems/item.md)). Renders the Item's title, description, kind-specific details, attached Location, and author Member. OG image: kind-themed default at b1 (T2 promotes to Member-uploaded photo).
- **Member page** — `/m/[handle]`. Renders the Member's display name, bio, Maker affordances (when `maker_mode_enabled = true`), recent Items. OG image: Member's avatar or kind-themed default.
- **Location page** — `/l/[slug]`. Renders the Location's name, kind (permanent / recurring-temporary / area), description, address (for kind=permanent), recent Items hosted here. OG image: Location's primary photo (T2) or kind-themed default (b1).
- **Group page** — `/g/[slug]` (b2 ships the surface; the slug + URL contract is locked at b1). Renders the Group's name, kind, description, anchor Location, member count (when public), recent Items.

All pages:

- Mobile-responsive (per [`../ui/design-language.md`](../ui/design-language.md)).
- SSR with full OG / Twitter Card metadata (title, description, image, type).
- Stable slug — once issued, never changes unless the maintainer explicitly renames the entity (and old slug 301-redirects).
- Public read for non-private entities (per RLS rules on each spine).

## Anti-spam consideration

Stable shareable URLs are a vector for SEO-style listing creation; the [no-admin-queue principle](../systems/location.md) (Members enter their own data) + Member rate limits (per [`../systems/member.md`](../systems/member.md)) + content-policy review (per [`../foundation/policy-framework.md`](../foundation/policy-framework.md)) are the layered defenses.

## Out of scope (deferred)

- Custom OG image upload per entity (T2 — depends on photo upload).
- Embed widgets for external sites ("Embed this Item on your site" — T3).
- Per-entity short-link aliases (e.g., `mst.us/[code]` — T3).

## Related capabilities

- [Item View](item-view.md), [Member Profile](member-profile.md) — the underlying detail surfaces.
- [QR Card (Item-on-demand)](qr-onboarding.md) — the physical-world counterpart for Items.

## Changelog

**2026-05-11** — Rewrote on the four primitive surfaces. Replaced "Business has a unique URL" with "every Item, Member, Location, and Group has a stable URL." Updated route from `/business/{slug}` to the canonical `/i/`, `/m/`, `/l/`, `/g/` routes. Added anti-spam note pointing at the no-admin-queue + rate-limit + policy-review defense.
