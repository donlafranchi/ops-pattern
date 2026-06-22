# T099: Locally Made proximity substrate + public render (F039 read surface)

**Scenario:** `planning/now/scenario-F039-maya-claims-locally-made.md`
**Status:** Deferred
**Bundle:** b1 (sub-bundle b1.4 — Find & follow)
**Depends on:** T064 (`items.made_at_place_id` column + `item.made_at_*` event kinds), T058 (`places`), T062 (`member_place_interests`), T078/T079 (F038 product composer + page).

> **Deferred 2026-06-19.** F039 Locally Made is deferred — the claim needs a cross-category redesign. Branch `t-f039` deleted without merge. Work will need to be rebuilt under a new approach.

**Serves:**
- **Loop:** 7 (Buy close), 9 (Make a living locally).
- **Canonical example:** [P4 — locally-owned, locally-made producer](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) (provenance half).
- **Primitive shape:** Item(kind='product', `made_at_place_id`) → place-hierarchy proximity test against the viewer's `member_place_interests` → "Locally Made" badge. "Made in {place}" provenance line is public regardless of proximity.

## Scope

Read path + the place-hierarchy proximity primitive F039 needs. F037 proximity is ZIP→MSA; F039 proximity is Place-lineage (the made-at Place vs the viewer's place-interest Places).

1. **Migration `web/supabase/migrations/031_place_proximity.sql`** — `public.place_is_proximal_to_any(target_place uuid, viewer_places uuid[]) returns boolean`, `SECURITY DEFINER STABLE`, `set search_path = public`, granted to `authenticated, anon` (mirrors `zip_is_proximal_to_location`, migration 025). Returns true iff the made-at Place shares a lineage with **any** viewer place — i.e. one is an ancestor-or-self of the other (walking `places.parent_id`). Covers self, ancestor (Sacramento city / county), and descendant. Null/empty `viewer_places` → false. No new table, no RLS (reads public-read `places`).

2. **`resolveProduct` extension (`src/lib/items/resolve-product.ts`)** — embed `made_at:places!made_at_place_id(display_name)`; add `madeAtPlaceName: string | null` to `ResolvedProduct`. The "Made in {name}" provenance fact is public.

3. **`resolveMadeLocallyBadge(supabase, { madeAtPlaceId, viewerMemberId })`** — render-time proximity for the current viewer. Returns `false` when `madeAtPlaceId` is null, the viewer is anon (`viewerMemberId` null), or no active `member_place_interests` Place passes proximity. Reads the viewer's own active place-interests (owner-read RLS `member_place_interests_owner_read`) then calls the proximity RPC. Null-safe (RPC error → false, never throws).

4. **`ProductPublicPage` (`src/components/item/ProductPublicPage.tsx`)** — two distinct affordances:
   - **"Made in {madeAtPlaceName}"** line (`data-testid="product-made-in"`) — renders for ALL viewers when `madeAtPlaceName` is set; omitted entirely when null (no negative-space copy).
   - **"Locally Made" badge** (`data-testid="product-made-badge"`) — renders ONLY when the new `madeLocally` prop is true (proximity-gated). Replaces the F038 placeholder that rendered the badge unconditionally on any `madeAtPlaceId`.

5. **Page wiring (`src/app/p/[...slug]/page.tsx`)** — the product dispatch resolves `madeLocally` via `resolveMadeLocallyBadge` (passing the auth user id) and passes it to `ProductPublicPage`.

## Acceptance Criteria

- [ ] **Proximity — self.** `place_is_proximal_to_any(oakPark, [oakPark])` → true.
- [ ] **Proximity — ancestor.** made-at = Oak Park, viewer = Sacramento city / Sacramento county → true.
- [ ] **Proximity — descendant.** made-at = Sacramento city, viewer = Oak Park → true.
- [ ] **Proximity — outside lineage.** made-at = Oak Park, viewer = a place on a different branch (e.g. LA) → false. (Sibling-via-metro is deferred to D3 — see DEVIATIONS.)
- [ ] **Proximity — empty/null viewer set** → false.
- [ ] **Badge — anon.** `resolveMadeLocallyBadge` with `viewerMemberId` null → false.
- [ ] **Badge — null made-at** → false without calling the RPC.
- [ ] **Made-in line — all viewers.** `madeAtPlaceName` set → "Made in {name}" renders regardless of `madeLocally`.
- [ ] **Made-in line — skip path.** `madeAtPlaceId` null → no "Made in" line, no badge.
- [ ] **Badge — proximity-gated.** Badge renders iff `madeLocally` is true.
- [ ] **Tests.** Vitest: proximity-function shape covered by the F039 eval (live DB); `resolveProduct` made-at embed + `ProductPublicPage` render branches (made-in present/absent, badge gated) covered by `*.test.ts(x)`.
- [ ] **M2** `engineering:code-review` before commit. **DEVIATIONS** entry at close.

## Notes

- The F038 eval beat 4 ("Locally Made badge is data-gated") asserted the badge renders for an anon viewer on a `made_at`-set product. Under F039 the badge is proximity-gated, so anon never earns it — that beat is forward-fixed to assert the always-public **"Made in {place}"** line instead (preserves the "data-driven, not dead-render" intent). Documented in DEVIATIONS.
- Scenario beat 3's metro_polygons overlay (D3) is out of scope: same-metro sibling neighborhoods (e.g. East Sacramento vs Oak Park) are NOT proximal under pure lineage. Deferred — F039 ships the hierarchy core.

## Completion

- **Status:** Build complete on branch `t-f039` (web), **not merged**.
- **Date:** 2026-06-04
- **Verification:** F039 eval 6/6 GREEN; F037+F038+F035 14/14 GREEN; 288/288 src unit GREEN; action-layer conformance OK. M2 Approve.
- **Deviations:** `development/deviations/T099.md`.
