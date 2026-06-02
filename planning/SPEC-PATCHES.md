---
id: how-spec-patches
purpose: Queue of product/ spec patches flagged by the build agent. Closes the Build → Product return path.
layer: how
status: active
---

# SPEC-PATCHES — open queue

When `build` writes a DEVIATIONS entry with `Disposition: flag-for-spec-revision`, it appends a one-line entry here. `explore` drains the queue as a gate before each bundle phase opens. Empty is the desired state at phase boundaries.

**Entry format.**

```
- [ ] {YYYY-MM-DD} · {spec path} § {section} — {one-line what's wrong}. Caught by T###. DEVIATIONS: {ticket-or-date pointer}.
```

Check the box and append `· landed YYYY-MM-DD ({commit hash})` when product patches; move to the sprint archive on next sprint close.

---

## Open

- [ ] 2026-06-01 · `development/tickets/T073-*.md` § Acceptance line 36 (Locality step writes `member_business_jurisdictions` row) — contradicts `review-F036.md` § cross-system consistency ("F036 does NOT need that substrate"). Two sources of truth diverged; pick one. Implementation chose UI-only at b1 (substrate ships with F037). Caught by T073. DEVIATIONS: 2026-06-01 — T073.
- [ ] 2026-06-01 · `product/systems/action-layer.md` § handler catalog — `location.create` handler is referenced by T073 acceptance but not in the registry. Add to the catalog with input/output shape, or remove the reference from the spec. Caught by T073. DEVIATIONS: 2026-06-01 — T073.
- [x] 2026-06-01 · `supabase/migrations/017_places.sql` — `places.geography` polygons are not seeded; only name + parent hierarchy land. `public.place_for_coords()` returns zero rows for every coordinate as a result, blocking any surface that resolves a place from a Location (T073's `sellActivateAction` URL builder; future surfaces in F035 + the producer feed). Add polygon stamping to the T058 seed OR a follow-up seed migration. Caught by T073b. DEVIATIONS: 2026-06-01 — T073b. · landed 2026-06-02 (T076 — follow-up seed `024_places_polygon_centroid_seed.sql`; approx bounding polygons, full-res replay tracked below).
- [ ] 2026-06-02 · `supabase/migrations/024_places_polygon_centroid_seed.sql` + future **S-metro** ticket — launch-market polygons shipped as axis-aligned bounding approximations (`seed_method='approx_bbox'`), not full-resolution TIGER 2023 / City of Sacramento geometry. Replay the authoritative shapefiles (URLs in the 024 header) into `places.geography` when S-metro builds the polygon-library backfill. Caught by T076. DEVIATIONS: 2026-06-02 — T076.
- [ ] 2026-06-02 · `product/systems/places.md` § Open questions — *Polygon source-of-truth and licensing* — move from "deferred" to "resolved (launch market): Census TIGER/Line 2023 (counties/state/places) + City of Sacramento Open Data (neighbourhoods), all public-domain / open-licence; embedded as approximations pending S-metro full-res replay." Also confirm § T1 seed list matches the 024 rows (no metro/region row per D3; metros live in `metro_polygons`). Caught by T076. DEVIATIONS: 2026-06-02 — T076.
- [ ] 2026-06-02 · `development/tickets/T076-*.md` § AC (reverse-geocode test) cites a "centroid-distance tiebreak in `022_places_reverse_geocode.sql`" that does not exist — `place_for_coords` resolves by `ST_Area` ascending only. T076 adds the `places.centroid` column + GiST index a tiebreak would use, but does not implement one (neighbourhood polygons are seeded non-overlapping instead). Decide whether a centroid-distance tiebreak is wanted in `place_for_coords` for overlapping-polygon cases, and if so assign a ticket. Caught by T076. DEVIATIONS: 2026-06-02 — T076.
- [ ] 2026-06-02 · `planning/now/scenario-F035-rosa-finds-mayas-shop.md` § Data Captured (follow) + `product/systems/member.md` § Follows substrate — scenario describes a `member_follows` row with `target_kind='group'` / `target_id=$group_id`, but the shipped `member_follows` (T048, `010_member_interests_follows.sql`) is member→member only (composite PK `(follower_member_id, followed_member_id)`, no polymorphic target). Group-follow has no substrate. Decide the shape — a dedicated `group_follows` table OR a polymorphic reshape of `member_follows` — and assign it to F042 (the follow-CTA scenario) so the F035 Follow CTA can persist. Caught by T074. DEVIATIONS: 2026-06-02 — T074.
- [ ] 2026-06-02 · `planning/now/scenario-F038-producer-lists-product.md` § Data Captured (Pickup point row) — specifies `item_locations.schedule_kind='permanent'`, but the shipped `item_locations.schedule_kind` CHECK (T056, `015_items.sql`) permits only `one_time | recurring | ongoing | by_appointment`. `'permanent'` conflates Location *kind* with the Item↔Location *schedule* enum. Patch the scenario row to `schedule_kind='ongoing'`. Caught by T077. DEVIATIONS: 2026-06-02 — T077.
- [ ] 2026-06-02 · `planning/now/scenario-F040-producer-lists-service.md` § Data Captured (Pricing model row) + § Edge Cases (Free service) — lists `rate_model` enum as `flat / hourly / per-session / free`, but the shipped `item_services.rate_model` CHECK (T056, `015_items.sql`) is `hourly / flat / quote / membership`. Reconcile: `per-session` has no schema slot (maps to `flat`); `free` is not a `rate_model` value — model it as `rate_cents = NULL` (as the build does). Patch the scenario to the shipped enum + null-rate free, or migrate the enum. Caught by T081. DEVIATIONS: 2026-06-02 — T081.

- [ ] 2026-06-02 · `product/systems/location.md` § (Location schema) — the `locations` table has no `place_id` column, but `business-jurisdiction.md` § Proximity computation and T075's `public.zip_is_proximal_to_location()` both assume a `locations.place_id → places.msa_code` join path. T075 added `locations.place_id uuid references places(id)` (nullable, no population path at b1) in `025_zip_metro_crosswalk.sql`. Document the column in `location.md` (purpose: a Location resolves to a curated Place; powers MSA derivation + variable-depth place-path URLs per ADR-20) and decide the population path (reverse-geocode from `geography` via `place_for_coords()`, or explicit picker at Location create). Caught by T075. DEVIATIONS: 2026-06-02 — T075.
- [ ] 2026-06-02 · `product/systems/places.md` § T1 schema + `product/systems/location.md` § Proximity — `places` had no `msa_code` column, but `business-jurisdiction.md` § Proximity computation requires "the anchor Location's MSA." T075 added `places.msa_code text` (nullable) in `025_zip_metro_crosswalk.sql`, populated for the four CBSA-40900 county subtrees only. Document `places.msa_code` in `places.md` (HUD CBSA code; source = `zip_metro_crosswalk`; nullable until national backfill) and confirm whether the per-Place denormalized `msa_code` is the intended derivation vs. deriving MSA from the Place's ZIP at read time. Caught by T075. DEVIATIONS: 2026-06-02 — T075.

---

**Historical Landed + Rescinded** — `planning/done/b1.x-spec-drain-sprint/spec-patches-landed.md`.
