---
id: spec-patch-2026-06-11-locality-set-handler-vestigial
purpose: Spec patch — member.md names a member.locality.set handler + home_location_id derivation path that do not exist; T103 derives home_metro_id from the real place_interest→places.centroid path instead.
layer: how
status: open
filed: 2026-06-11
caught_by: T103
deviation_pointer: 2026-06-11 — T103
target_spec: product/systems/member.md
target_section: § Place-interest scope (line ~151) + § Action handlers (line ~534) + T103 § Handler modification AC
---

# `member.locality.set` / `home_location_id` derivation path is vestigial

**What's wrong:** `member.md` §151 says "`primary_home` is derived from `home_location_id`'s `place_id` at onboarding (the `member.locality.set` action handler maintains the trigger)" and §534 lists "`member.locality.set` — writes `home_location_id`, fires `member.home_location_set`." T103's § Handler modification AC builds on the same assumption (resolve `home_metro_id` after setting `home_location_id`, backfill via `locations.geography`). None of this exists in code: there is no `member.locality.set` handler, no `member.home_location_set` event, and `home_location_id` is a vestigial column never populated (last touched in migration 009). The real locality path is `member.place_interest.add` (scope `primary_home`) → `member_place_interests.place_id` → `places.centroid`.

**The fix:** Reconcile the spec with the shipped model. T103 wired `home_metro_id` derivation into the `primary_home` arm of `place-interest-add.ts` / `place-interest-remove.ts` and backfills from `places.centroid`. Decide whether `member.locality.set` + `home_location_id` are still a wanted future shape (e.g. a private precise-coordinate home distinct from the public Place interest) or should be retired from `member.md` §151/§534. If retired, also update T103's § Handler-modification AC wording (the implemented behavior is correct; only the AC's named handler/column is wrong). The derived-metro behavior itself is shipped and verified.

**Caught by:** T103 during build

**Deviation pointer:** `development/DEVIATIONS.md` § T103 (2026-06-11) — What (1)
