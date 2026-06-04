# T096: Locally Owned badge + owner-claim read path (F037 read surface)

**Scenario:** `planning/now/scenario-F037-maya-claims-locally-owned.md`
**Status:** Open
**Bundle:** b1 (sub-bundle b1.2 — Business Groups & makers)
**Depends on:** T075 (S-jurisdictions substrate — `member_business_jurisdictions`, `zip_metro_crosswalk`, `places.msa_code`, `locations.place_id`, `public.zip_is_proximal_to_location()`), T074 (Shop public page + `resolve-shop.ts`)

**Serves:**
- **Loop:** 7 (Buy close), 9 (Make a living locally).
- **Canonical example:** [P4 — locally-owned, locally-made producer](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges) (jurisdiction half).
- **Primitive shape:** Group(business) active owner(s) → `member_business_jurisdictions`(active) → `public.zip_is_proximal_to_location(zip, anchor_location_id)` → "Claimed local owner" badge (OR-aggregated across owners).

## Scope

Pure read path. Two resolvers in `src/lib/groups/resolve-shop.ts`, both supabase-client-shaped (session-bound, RLS-enforced):

1. **`resolveLocalOwnerBadge(supabase, { groupId, anchorLocationId })`** — replaces the T074 placeholder that returns `null`. Selects active jurisdiction rows for the Group (`member_business_jurisdictions` where `group_id = $` and `removed_at is null` — public-read RLS `mbj_select_public_active`), then for each ZIP calls `public.zip_is_proximal_to_location(zip, anchorLocationId)` via `supabase.rpc`. Returns `{ label: 'Claimed local owner' }` if **any** owner's ZIP passes (OR-aggregation per `business-jurisdiction.md` line 50). Returns `null` when: no active rows, `anchorLocationId` is null, or no ZIP passes proximity. Null-safe throughout (a failed RPC → no badge, never throws).

2. **`resolveOwnerClaim(supabase, { groupId, anchorLocationId, viewerMemberId })`** — backs the owner-only management widget (T097). Returns `null` when `viewerMemberId` is null OR the viewer is not an active owner-role member of the kind='business' Group (checks `group_memberships` via self-read RLS `memberships_select_self`: `member_id = viewer`, `role = 'owner'`, `left_at is null`). When the viewer IS an owner, returns `{ zip: string | null, isProximal: boolean }` — `zip` is the viewer's own active jurisdiction ZIP for this Group (or `null` if they haven't claimed), `isProximal` is the proximity result for that ZIP (false when no ZIP or no anchor).

## Acceptance Criteria

- [ ] **Badge — none.** No active jurisdiction row → `resolveLocalOwnerBadge` returns `null`.
- [ ] **Badge — proximal.** An active row with a ZIP that shares the anchor Location's MSA → returns `{ label: 'Claimed local owner' }`.
- [ ] **Badge — non-proximal.** Active row whose ZIP fails `zip_is_proximal_to_location` → returns `null` (no negative-space badge).
- [ ] **Badge — null anchor.** `anchorLocationId === null` → returns `null` without calling the RPC.
- [ ] **Owner-claim — non-owner / anon.** `viewerMemberId` null or not an active owner → returns `null` (widget not shown).
- [ ] **Owner-claim — owner, no claim.** Owner with no active row → `{ zip: null, isProximal: false }`.
- [ ] **Owner-claim — owner, proximal claim.** Owner with proximal ZIP → `{ zip: '<zip>', isProximal: true }`.
- [ ] **Owner-claim — owner, non-proximal claim.** Owner with non-proximal ZIP → `{ zip: '<zip>', isProximal: false }`.
- [ ] **Tests.** Vitest shape/unit tests for both resolvers (OR-aggregation, null-anchor short-circuit, owner-gating). DB behavior verified by T098 eval.
- [ ] **M2** `engineering:code-review` before commit. **DEVIATIONS** entry at close.

## Notes

- The proximity RPC is granted to `authenticated, anon` (migration 025) and is `SECURITY DEFINER STABLE` — safe to call from the session client.
- OR-aggregation: at b1 Shops are single-owner so the loop is trivial, but the resolver iterates all active owners' rows so multi-owner needs no later change.
- No new schema, no new RLS, no migration — this ticket is read code over T075's substrate.
