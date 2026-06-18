---
id: spec-patch-2026-06-02-locations-place-id
purpose: Spec patch — `locations.place_id` exists in code but not documented in location.md.
layer: how
status: open
filed: 2026-06-02
caught_by: T075
deviation_pointer: 2026-06-02 — T075
target_spec: product/systems/location.md
target_section: § (Location schema)
---

# Document `locations.place_id` in location.md + decide population path

**What's wrong:** The `locations` table has no `place_id` column in the spec, but `business-jurisdiction.md` § Proximity computation and T075's `public.zip_is_proximal_to_location()` both assume a `locations.place_id → places.msa_code` join path. T075 added `locations.place_id uuid references places(id)` (nullable, no population path at b1) in `025_zip_metro_crosswalk.sql`.

**The fix:** Document `locations.place_id` in `location.md` (purpose: a Location resolves to a curated Place; powers MSA derivation + variable-depth place-path URLs) and decide the population path (reverse-geocode from `geography` via `place_for_coords()`, or explicit picker at Location create).

**Caught by:** T075 during build

**Deviation pointer:** [`development/deviations/T075.md`](../../development/deviations/T075.md) § 2026-06-02 entry
