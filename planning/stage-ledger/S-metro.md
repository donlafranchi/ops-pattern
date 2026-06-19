---
id: stage-S-metro
purpose: Pipeline stage for S-metro — Metro polygons.
layer: how
status: active
concept_kind: substrate
stage_current: done
last_activity: 2026-06-18
---

# S-metro — Metro polygons

**Spec contract:** discovery.md § Community-awareness feed; member.md § Place-interest scope; PLATFORM-PATTERNS § metro-polygon overlay (Ratified 2026-06-02)

## Stage history (append-only)

- **2026-05-28** · `product` — substrate scoped, awaiting ratification
- **2026-06-11** · `ticketed` + `building` — T103 (metro-polygons substrate); 27 vitest green; M2 PROCEED; built on branch `t103`
- **2026-06-18** · `done` — merged `t103` → main (`403ca41`)

## Notes

Migration `031_metro_polygons.sql`: `metro_polygons` table (CSA grain) + GiST index + RLS public-read (no client writes) + `resolve_home_metro()` SECURITY INVOKER + grants; `members.home_metro_id` FK + partial index; Sacramento CSA (472) seed + centroid; backfill from active `primary_home` Place centroid. Home-metro resolution wired into `member.place_interest.add/remove` (real path), NOT the spec's nonexistent `member.locality.set`/`home_location_id` path. 3 deviations (locality.set vestigial → SPEC-PATCH; approx-bbox polygon → SPEC-PATCH; static-shape + SQL contract test vs live Vitest, Docker-gated). **Substrate gate for F031 now CLOSED.** Live-DB containment is the downstream Playwright `test`-skill step.
