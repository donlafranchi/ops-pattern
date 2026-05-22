# ADR-0016: Per-row privacy on `member_location_affinities`; algorithms via privileged paths

**Status:** Accepted
**Date:** 2026-05-11
**Deciders:** PM
**Scope:** Row-level privacy posture on the six `affinity_kind` values in `public.member_location_affinities`; the three named SECURITY DEFINER access patterns; the structural enforcement of the anti-doxxing commitment
**Touches:** `product/systems/member.md` (RLS section + Decisions-encoded header), `product/systems/groups.md` (locally-owned derivation), `product/foundation/policy.md` (anti-doxxing — ADR-9 scope), `product/systems/business-jurisdiction.md` (Tier 0 ZIP verification follows the same pattern), `web/supabase/migrations/` (RLS policies + the three SECURITY DEFINER functions)

## Decision

All six `affinity_kind` values on `public.member_location_affinities` (`lives`, `works`, `plays`, `visits`, `follows`, `liked`) are **owner-only at the row level**. Only the owner (`member_id = auth.uid()`) can `SELECT` their own rows. No public user, anon visitor, or peer Member can `SELECT` another Member's affinity rows under any condition.

Privileged access to the underlying rows is provided through three named patterns:

1. **Aggregate count functions** (`SECURITY DEFINER`): `public.count_likes_for_location(location_id uuid) returns integer` and `public.count_followers_for_location(location_id uuid) returns integer`. Public-callable. Used by Location pages for "N Members liked / follow this place" rollups. Underlying rows remain private.

2. **Locality-derivation function** (`SECURITY DEFINER`): `public.member_is_local_to_location(member_id uuid, location_id uuid) returns boolean`. Reads `lives` and `works` rows internally. Used by `groups.md`'s locally-owned-and-operated derivation. Public-callable. The function is the only path; direct `SELECT` against another Member's `lives`/`works` rows remains blocked.

3. **Backend service reads** (`service_role`): the recommendation engine, embedding pipeline, and other backend services connect with the service-role key, which bypasses RLS. These reads compute over the full row set; outputs to users are anonymized aggregates (similarity-driven recommendations, taste-matched location lists), never per-Member attribution.

## Consequences

- `member.md` RLS section adopts the owner-only posture for `member_location_affinities` and points to this ADR for the SECURITY DEFINER access patterns.
- `groups.md` locally-owned derivation switches from a direct `JOIN` against `member_location_affinities` to a call into `public.member_is_local_to_location()`. The function is the only path; the spec's pseudocode updates accordingly.
- `policy.md` anti-doxxing section is upgraded — the no-Location-messaging commitment and the absence of per-Member location disclosure become structurally enforced by RLS, not by platform discipline.
- Public Location-page rollups call the two count functions. They do not `SELECT` rows.
- Cross-user similarity matching for recommendations operates at the backend-service layer. Raw affinity rows feed the embedding pipeline; embeddings (`member_embeddings`, T041) feed similarity search; outputs to users are anonymized lists of Locations. Per-Member identity never surfaces in a recommendation. **No per-Member opt-out for similarity matching ships** — similarity matching discloses no Member identity to any other Member; the benefit is to many and harms none.
- `product/systems/business-jurisdiction.md` (promoted from exploration 2026-05-11) Tier 0 ZIP verification follows the same SECURITY DEFINER pattern (`public.zip_is_proximal_to_location()`) when it ships.
- Performance: the `SECURITY DEFINER` function-call costs microseconds per locality check. A set-returning variant (`members_local_to_area(area)`) can land at T2+ if hot.
- This ADR forecloses a future per-row "who likes / follows this place" surface. If the platform ever wants to expose that, the change requires either a new SECURITY DEFINER function or relaxing the policy. Reversible but with cost; the foreclosure is the point.

## Action Items

1. [x] Decision ratified 2026-05-11.
2. [x] Pointer line in `../DECISIONS.md` pointer index.
3. [x] `member.md` RLS section updated to reference this ADR.
4. [x] `groups.md` locally-owned derivation updated to call `member_is_local_to_location()`.
5. [x] `policy.md` anti-doxxing section upgraded.
