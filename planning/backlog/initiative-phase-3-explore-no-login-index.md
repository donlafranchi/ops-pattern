---
id: how-explore-no-login-index
purpose: Phase 3 item stub — the no-login `/explore` locality-first index.
layer: how
status: stub
---

# Phase 3 — No-login `/explore` locality-first index

## What this is

A public, browseable surface at `/explore` that does not require authentication. Anonymous visitors land here from search engines, shared links, or curiosity; they can filter Items by kind, category, distance, and schedule, and tap through to any public Item / Group / Member / venue page without signing in.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 — *"`/explore` — locality-first index. **No-login browseable.** Filterable by kind, category, distance, schedule. Reads `discoverable_items` materialized view exclusively."*
- Archived rebuild-plan Phase 3 also names the **anonymous Loop 3 path** as a tightly coupled surface ("a newcomer can land on `/explore`, browse Items near a stated point, click an Item, see the Member and Location, read the thesis"). Folded here — they're one surface, not two.
- [`use-cases.md` C1](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — *"the locality-first index. One page that answers 'what's happening near me this week that I could just show up to.'"* C1 anchors the signed-in feed (F030); `/explore` is the anonymous variant.

## Rough shape

- URL: `/explore` — top-level, no place prefix in the URL (the visitor's IP geolocation + a visible scope picker drives what's shown). When a visitor opts a scope, the URL may upgrade to `/explore?place=...&kind=...&distance=...`.
- Reads: `discoverable_items` materialized view exclusively. No base-table reads on the anonymous path.
- Filter affordances: kind (product / service / gathering), category, distance (radius), schedule window ("today" / "this week" / "this month").
- Anti-Nextdoor: no comments, no Location-scoped messaging visible to anon, no notifications. This is a read surface.
- Sign-in CTA: inline ("Make this yours" / "Save your locality") but never blocking.

## Depends on

- F030 (signed-in `/` feed) — the same underlying data pattern; `/explore` shares the `discoverable_items` query but with anon-allowed RLS and the IP-geolocation default.
- RLS on `discoverable_items` allows anon read where Item `state='published'` and discoverability allows. (Phase 1 should have this; verify before scoping.)
- `places` populated to neighborhood depth (already done for Sacramento per Phase 1).

## Advance this by

1. PM decides: one F### scenario or split (e.g., F### = `/explore` core; F### = anonymous Loop 3 deep-link path)?
2. Confirm `discoverable_items` RLS allows anon reads with the expected predicates.
3. Design pass on the filter affordances + scope picker placement (mobile-first, anti-Nextdoor).
4. Decide whether the anonymous path nudges or blocks at any point (default: never blocks).
5. Promote to `planning/backlog/scenario-F###-explore-no-login.md` via `scope` when the design call is made.

## Out of scope for this stub

- Implementation details (composer, URL params, filter UI) — those land in the scenario.
- Whether `/explore` ships before or after the Group browse index — sequencing happens in the Phase 3 strategy pass.
