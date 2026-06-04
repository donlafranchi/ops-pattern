---
id: stage-S-polygon
purpose: Pipeline stage for S-polygon — places polygon + centroid backfill (T076).
layer: how
status: active
concept_kind: substrate
stage_current: building
last_activity: 2026-06-02
---

# S-polygon — places polygon + centroid backfill (T076)

**Spec contract:** places.md § T1 + § Reverse-geocoder; PLATFORM-PATTERNS county tier (ADR-0022) + metro-overlay D3

## Stage history (append-only)

- **2026-06-02** · `ticketed` — T076
- **2026-06-02** · `building` — committed on branch `t76`, not merged; 42 vitest green; M2 PROCEED

## Notes

Adds `places.centroid` + `idx_places_centroid`; backfills launch-market polygons (approx bbox — full-res replay → S-metro) + 3 new cities (Davis/Roseville/Folsom). Greens polygon-seed half of F036 `:266`. 4 deviations logged (approx polygons, Placer pre-exists, no centroid-tiebreak in 022, vitest=JS-geometry not live-DB). SPEC-PATCHES: line-26 (017 polygons) checked off; 3 new entries queued. Live-DB containment is the downstream Playwright `test`-skill step.
