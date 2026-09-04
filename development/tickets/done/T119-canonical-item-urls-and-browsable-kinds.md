---
purpose: Ticket — emit Group place-path canonical URLs, fix non-business Group attribution, withhold kinds with no detail page.
layer: how
status: done
---

# T119: Canonical Item URLs and browsable-kind withholding

**Scenario:** [`planning/next/scenario-F054-member-taps-an-item-and-lands-on-it.md`](../../planning/next/scenario-F054-member-taps-an-item-and-lands-on-it.md)
**Review:** [`planning/next/review-F054.md`](../../planning/next/review-F054.md) — PROCEED, three binding notes
**Bundle:** b1 (SocialUs v1) — workstream 1
**Date:** 2026-09-04
**Branch:** `t119`

**Serves:**
- **Need** → `product/needs/member-journey.md` Loop 3 (Land here), Loop 8 (Follow what you love)
- **System** → `product/systems/item.md` § URL segments; `product/systems/groups.md` § brand resolve-up
- **Decision** → `playbooks/PLATFORM-PATTERNS.md` § *An Item's canonical URL is its Group place-path when filed…* · § *Browse surfaces link only Item kinds that have a detail page*

**Cited spec last-changed:** `product/systems/item.md` — `git log -1 --format=%ad -- product/systems/item.md`; `playbooks/PLATFORM-PATTERNS.md` — 2026-09-04 (this session).

**Governing DLS recipe:** none new. `design-language.md` § venue sections governs the one empty state added (honest copy, no "be the first" push).

## Problem

Nine of sixteen seeded Items 404 when tapped. Three distinct causes, one of which the decision stub did not find:

1. `itemHref` builds a `/m/<handle>/…` path for every Item. Group-filed Items are rejected by the `/m/` resolvers (`.is('group_id', null)`). **4 rows.**
2. No detail page exists for `ask` / `offer` / `wonder` / `initiative`. **5 rows.**
3. **Not in the stub:** attribution on the Group path reads `items.brand_label`, populated only from `group_businesses.display_name`. A Group event filed under a non-business Group has `brand_label = null` and every resolver returns `null`. The Repair Cafe would 404 *even with the correct URL*. Group events are v1 scope.

## Scope

### 1. Migration — two read-only derivations

New migration `037_group_url_prefixes.sql`.

- `public.place_url_path(p_place_id uuid) returns text` — walks `parent_id` to the root and returns the slash-joined URL path, **skipping `kind='county'` rows**, matching `resolvePlacePath`'s county-transparency rule. Returns null for a missing or soft-deleted Place.
- `public.group_url_prefixes(p_group_ids uuid[]) returns table(group_id uuid, slug text, place_path text)` — joins `groups → locations (anchor_location_id) → places` and calls `place_url_path`. Rows whose chain is incomplete return `place_path = null`.

Both `security invoker`, `stable`, `set search_path`. Grant execute to `anon, authenticated`. **No SECURITY DEFINER** — every table in the chain is anon-readable via RLS (review § Schema fit).

**Do not touch** `discoverable_items`, `locality_feed_items`, `venue_nearby_items`, or `venue_hosted_items`. Deriving live is deliberate: a place rename corrects on next render instead of staling into the MV until an unrelated publish refreshes it.

### 2. `src/lib/feed/item-url.ts` — one home for both decisions

- `BROWSABLE_KINDS = ['product','service','gathering']` + `isBrowsableKind(kind)`. **This is the single list** (review binding note 3). Every read path imports it; no read path writes its own.
- `itemHref` accepts optional `groupSlug` + `groupPlacePath`. Both present and non-empty → `/p/{groupPlacePath}/g/{groupSlug}/{seg}/{slug}-{id8}`. Otherwise the existing `/m/` path, unchanged.
- Update the file header: the "Group-scoped canonical URLs are a later refinement" note is now false.

### 3. `src/lib/feed/group-prefixes.ts` — new

`fetchGroupPrefixes(supabase, groupIds)` → `Map<groupId, {slug, placePath}>`. One RPC call for the distinct non-null `group_id`s in a result set. Empty input → empty map, no call.

### 4. Wire the five read paths

Each collects `group_id`s, fetches prefixes once, filters to browsable kinds, and passes group fields to `itemHref`:

- `src/lib/feed/locality-feed.ts` — `getLocalityFeed`
- `src/lib/explore/items.ts` — `fetchExploreItems`, `searchExploreItems` (filter in the PostgREST query via `.in('item_kind', BROWSABLE_KINDS)`)
- `src/lib/member/resolve-member-page.ts` — add `group_id` to the select; filter via `.in('kind', BROWSABLE_KINDS)`
- `src/lib/locations/resolve-venue-items.ts` — hosted + nearby

RPC-backed paths filter in TypeScript (the RPC applies its limit first). At 16 seeded rows this cannot under-fill; **note it in DEVIATIONS** rather than leaving it implicit.

### 5. Attribution fallback — all three resolvers

`resolve-product.ts`, `resolve-service.ts`, `resolve-gathering.ts`: on the Group branch, `attribution.name = row.brand_label ?? group.name`, and stop returning `null` when `brand_label` is null. Requires selecting the Group's `name` alongside its `id` in the scope lookup. Uniform across all three (review binding note 2).

### 6. Empty state

Member page item list: when the filter empties it, render honest copy — no "be the first" push, per `design-language.md`. Must be text, not an empty container (review § Accessibility: a silent empty list does not announce).

## Out of scope

- Detail pages or composers for the four withheld kinds.
- Any `id8` in the Group URL segment.
- MV or feed-RPC changes.
- The vendor/market retirement sweep.

## Acceptance

Mirrors F054's seven criteria. The pass mark: **eleven Items render, zero 404**, across feed / Explore list / Explore map / Member page / venue page.

## Test plan (TDD — tests first)

**Unit (vitest):**
- `item-url.test.ts` — group path built when both fields present; `/m/` fallback when either is missing/empty; slug + id8 unchanged; `isBrowsableKind` covers all seven kinds.
- `group-prefixes.test.ts` — batches distinct ids; no RPC on empty input; null `place_path` maps to no prefix.
- Resolver tests — Group branch resolves with `brand_label = null`, crediting `groups.name`; business Groups still credit `brand_label`.
- Read-path tests — the four withheld kinds absent; the three browsable kinds present.

**Migration (vitest, live DB):** `place_url_path` skips the county tier and round-trips against `resolvePlacePath`; `group_url_prefixes` returns null `place_path` for a Group with no anchor Location.

**Eval (Playwright):** extend F038/F034 rather than adding a spec — a Group-filed product and a Group-filed gathering under a **non-business** Group both resolve from the feed link.

## Gates

- **M2** `engineering:code-review` — before commit.
- **M3** `design:accessibility-review` — ran in review-F054; re-confirm the two named checks at build.
- **M4** `engineering:deploy-checklist` — before merge (migration present).
- **DEVIATIONS entry** — mandatory.
