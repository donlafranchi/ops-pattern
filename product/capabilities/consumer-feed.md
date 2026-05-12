# Capability: Locality Feed

**Description:** Members see a locality-aware feed of nearby Items — gatherings, Wonders, Maker updates, producer bulletins (T2+) — anchored on the Member's locality but never Location-message-scoped.

**Primitive:** Item (rendered by kind) · Member (author) · Location (locality scope)
**Tier:** T1
**Bundle:** b1
**Loops served:** 1 (Find your people), 3 (Land here), 4 (Gather regularly)

## User story

As a Member, I want to open the app and see what's happening near me — gatherings to attend, Makers to follow, Wonders to engage with — so I can discover the activity in my locality without searching for it.

## Scope

- Home screen renders a feed of Items in the Member's locality (driven by `home_location_id` per ADR-4; geolocate-first with city-pick fallback).
- Card types at b1:
  - **Gathering** (Item with `kind=gathering`, any category — farmers markets, swap meets, classes, run clubs, community projects).
  - **Wonder** (Item with `kind=wonder`).
  - **Maker update** (text post from a Member with `maker_mode_enabled = true` and at least one product/service Item).
  - **Featured Maker of the week** (curated).
  - **Followed-Member float** (content from followed Members surfaces above general locality content).
- Sort: recency + locality scope. No personalization algorithm at T1.
- Filter by card type (Gatherings / Wonders / Maker updates) — pill row at top of feed.
- Filter by category (food, retail, fitness, family, etc.) — driven by Item tags.
- Tap card → Item page (kind-specific URL per `item.md` naming table), Member page (`/m/[handle]`), or Location page (`/l/[slug]`) depending on context.
- "Become a Maker" CTA visible on Home for Members with `maker_mode_enabled = false`.

## Anti-Nextdoor commitment (structural)

This feed is **locality-aware** — content surfaces based on the Member's locality and the locality of the Item — but **never Location-message-scoped**. The feed is anchored on Items declared by Members; there is no surface that lets anyone address "everyone in West Sac." This commitment is structural per [`../foundation/policy-framework.md`](../foundation/policy-framework.md) and enforced by the absence of any Location-scoped messaging handler in the action layer ([`../systems/action-layer.md`](../systems/action-layer.md)).

## Out of scope (deferred)

- Personalized / algorithmic ranking (T3 — signals: follows, supports, views, time of day, locality affinity strength).
- Saved/bookmarked Items (T3).
- Push notifications for new content (T3).
- Producer bulletin cards (T2 — depends on [`../systems/producer-bulletin.md`](../systems/producer-bulletin.md)).
- Group activity cards (T2 — when a Group the Member belongs to declares an Item).
- Location-follow activity cards (T2 — the Concerts-in-the-Park surface per [`../systems/location.md`](../systems/location.md)).

## Related capabilities

- [Locality Browse](locality-browse.md) — search/filter the full catalog (Explore tab).
- [Item View](item-view.md) — destination on card tap.
- [Member Profile](member-profile.md) — destination when a Maker update card is tapped.

## Changelog

**2026-05-11** — Rewrote on Member/Item/Location primitives. Renamed from "Consumer Feed" to "Locality Feed" to make the anchor explicit. Anti-Nextdoor commitment encoded structurally. Card types updated to match current Item kinds. Pre-primitives framing (promotions / business updates / business profile) removed.

**Original (pre-primitives)** — `capabilities/archive/business-promotions.md`, `business-updates.md`, `business-events.md` were the constituent feeds being mixed here; all archived as part of the primitives ratification.
