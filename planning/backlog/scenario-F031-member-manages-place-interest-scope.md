---
id: how-f031-member-manages-place-interest-scope
purpose: Backlog scenario — the feed scopes to the member's metro market; rural members choose a market.
layer: how
status: draft
---

# F031: A member's feed shows their metro market

**Bundle:** b1
**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly), 8 (Follow what you love)
**Canonical example:** [C2 — A member organizes awareness across multiple Places](../../product/needs/use-cases.md#c2-a-member-organizes-awareness-across-multiple-places) — the Oak-Park-resident-who-works-in-Folsom situation. At b1 this resolves automatically: both Oak Park and Folsom are inside the Sacramento-Roseville CSA, so the metro-scoped feed shows both without manual secondary-place management.
**Primitive shape:** Person → `members.home_metro_id` → `metro_polygons.geography` → feed `ST_Intersects` against discoverable Items.
**Status:** backlog (trimmed from the original 6-criteria scope to metro-only for b1)
**Replaces:** F029 (archived 2026-05-28). Supersedes the original F031 draft which included secondary places, granularity controls, and metro opt-in toggle — all deferred to b2.

## The Person

Someone who signs up in Sacramento. Or someone in a rural area outside any metro who wants to participate in a nearby market. Either way, they need a market — the community they'll discover and support.

## The Story

**Metro member (automatic):** A member signs up, sets their primary home to Oak Park (a Sacramento neighborhood). The `place-interest-add` action handler resolves `home_metro_id` via `resolve_home_metro()` against the Place's centroid. Their feed now shows everything in the Sacramento-Roseville metro — Oak Park, Folsom, Roseville, Davis, all of it. No toggle, no opt-in. Discovery is the default.

**Rural member (choose a market):** A member signs up from a small town that doesn't fall inside any seeded metro polygon. `home_metro_id` resolves to null. During onboarding (or on first feed visit), the platform shows the 2–3 nearest open metros by distance from their primary home's centroid, and the member picks one. That metro becomes their `home_metro_id`. They can change it later from `/you/settings`.

## Surfaces

- **Feed (`/`):** Scoped to the member's `home_metro_id` polygon. The `locality_feed_items` RPC changes from single `p_place_id` + `ST_Intersects` to metro-polygon scope.
- **Rural market picker:** Inline in onboarding (step after primary-home selection) or empty-state CTA on feed when `home_metro_id` is null. Shows nearest open metros with name, rough distance, and member count.
- **Settings (`/you/settings`):** "Your market" row showing current metro, with a "Change" link for rural members who picked manually. Metro-resolved members see it as informational (no change — your home determines your market).

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Home Place | `member_place_interests(scope_kind='primary_home', place_id=...)` | yes (already shipped) |
| Market (derived) | `members.home_metro_id` → `metro_polygons.id` | yes — auto-resolved or member-picked |

Implicit: `member.metro_selected` event when a rural member picks a market manually.

## Acceptance Criteria

### Metro auto-resolution scopes the feed

**Given** a Member whose primary home Place centroid falls inside a seeded metro polygon
**When** they visit the feed at `/`
**Then** the feed shows all discoverable Items whose nearest Location geography intersects the metro polygon; Items outside the metro do not appear; no user action required.

### Rural member selects a market

**Given** a Member whose primary home Place centroid does NOT fall inside any seeded metro polygon (`home_metro_id` IS NULL)
**When** they reach the feed for the first time (or the market-picker surface)
**Then** the platform displays the 2–3 nearest open metros ordered by distance from their home Place centroid, with name and approximate distance; the Member taps one; `home_metro_id` updates; the feed now scopes to that metro.

### Feed query uses metro polygon

**Given** a Member with `home_metro_id` populated (whether auto-resolved or manually selected)
**When** the feed loads
**Then** the `locality_feed_items` RPC (or its replacement) queries against `metro_polygons.geography` via `ST_Intersects`, not against a single Place polygon. Items from any Location inside the metro appear.

## Edge Cases

- **Member changes primary home to a different metro:** `home_metro_id` re-resolves via `resolve_home_metro()` in the `place-interest-add` handler. Feed updates on next load.
- **Member changes primary home to a rural area:** `home_metro_id` goes null. Rural market picker surfaces on next feed visit.
- **Rural member's chosen metro is later un-seeded (admin action):** `home_metro_id` FK cascades to null. Rural picker re-surfaces.
- **No metros seeded at all:** Feed falls back to primary-home Place polygon (current behavior). This is the launch-day state before metro seeds land.

## Assumptions

- `metro_polygons` table + `members.home_metro_id` + `resolve_home_metro()` shipped (migration 031 — done).
- `member_place_interests` table + `place-interest-add` / `place-interest-remove` action handlers shipped (T058–T066 — done).
- Metro polygon seeds expanded from Sacramento-only to Sacramento + Reno + one more NorCal market (Napa-Sonoma or similar). New migration required.
- `locality_feed_items` RPC refactored from single `p_place_id` parameter to metro-polygon-aware query. This is the core code change.

## Out of Scope (deferred to b2)

- Secondary place interests (add/remove/promote Places within or across metros).
- Granularity control (neighborhood ↔ city toggle on primary home).
- `/you/locality` management page.
- Cross-metro feed (seeing items from multiple metros simultaneously).
- Place-interest aggregate insights.
- Saved-search composer surface.

## Capabilities unlocked

- **1. Presence & Findability** — Items appear in the awareness feed scoped to the full metro, not just one neighborhood. A producer in Folsom is discoverable by a member in Oak Park without either of them doing anything.
- **Market selection for rural members** — Nobody is left without a community. Rural members choose their nearest market and participate.
