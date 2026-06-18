---
id: stage-S-jurisdictions
purpose: Pipeline stage for S-jurisdictions — `member_business_jurisdictions` Tier 0 + `made_at`.
layer: how
status: active
concept_kind: substrate
stage_current: built
last_activity: 2026-06-02
---

# S-jurisdictions — `member_business_jurisdictions` Tier 0 + `made_at`

**Spec contract:** business-jurisdiction.md; item.md Provenance

## Stage history (append-only)

- **2026-05-28** · `product` — substrate scoped
- **2026-06-02** · `ticketed` — T075
- **2026-06-02** · `built` — committed on branch `t75`, not merged; 40 vitest green; live-DB migration + SQL-contract validation; M2 PROCEED — crosswalk RLS + inline-seed fixed before commit

## Notes

Tier 0 (`verification_source='self_attested'`) `member_business_jurisdictions` table + RLS public-read + 2 handlers (`member.business_jurisdiction.set` / `.remove`) + `zip_metro_crosswalk` (90-row Sacramento seed) + `public.zip_is_proximal_to_location()`. `items.made_at_place_id` already shipped (020); the *provenance claim surface* is F039's, not this ticket's. Added `places.msa_code` + `locations.place_id` (spec assumed them — 2 SPEC-PATCHES filed). **Substrate gate for F037 + F039 now CLOSED** (both stay in `planning/backlog/`; PM promotes). F036 `:266` jurisdiction half greens on next eval re-run.
