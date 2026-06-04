---
id: spec-patch-2026-06-02-places-msa-code
purpose: Spec patch — `places.msa_code` exists in code but not documented in places.md or location.md.
layer: how
status: open
filed: 2026-06-02
caught_by: T075
deviation_pointer: 2026-06-02 — T075
target_spec: product/systems/places.md + product/systems/location.md
target_section: places.md § T1 schema + location.md § Proximity
---

# Document `places.msa_code` + confirm derivation semantics

**What's wrong:** `places` had no `msa_code` column in spec, but `business-jurisdiction.md` § Proximity computation requires "the anchor Location's MSA." T075 added `places.msa_code text` (nullable) in `025_zip_metro_crosswalk.sql`, populated for the four CBSA-40900 county subtrees only.

**The fix:** Document `places.msa_code` in `places.md` (HUD CBSA code; source = `zip_metro_crosswalk`; nullable until national backfill) and confirm whether the per-Place denormalized `msa_code` is the intended derivation vs. deriving MSA from the Place's ZIP at read time.

**Caught by:** T075 during build

**Deviation pointer:** [`development/deviations/T075.md`](../../development/deviations/T075.md) § 2026-06-02 entry
