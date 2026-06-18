---
id: how-t081-service-item-create-arm
purpose: Finish item.create's service arm — write item_services.service_area_geography (PostGIS circle from center+radius) so F040's service composer transacts the full child row.
layer: how
status: open
---

# T081 — `item.create` service arm (`service_area_geography`)

**Scenario:** [F040 — A producer lists a service](../../planning/now/scenario-F040-producer-lists-service.md)
**Binds to:** `product/systems/item.md` § Per-kind typed columns · `product/systems/action-layer.md` § Same-transaction row+event invariant · migration 015 `item_services`
**Status:** Open
**Bundle:** b1 (b1.3 — Item composers)
**Depends on:** T080 (generalized item.create — rate_model/rate_cents arm) · T077 (handler pattern)
**Repo / branch:** web / `t-f040`

## Serves

- F040 Then-clause "Composer writes Item + child in one transaction" — the `item_services` row must carry `service_area_geography`, which T080 left unwired (it only added `rate_model`/`rate_cents`).
- **Loop:** 9 (Find a local pro), 9 (Make a living locally).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — N/A** (no UI; T082 owns the surface).
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **SPEC-PATCHES** for the rate_model vocabulary divergence (see Notes).

## Acceptance Criteria

### `item.create` — `src/actions/item/create.ts`

- [ ] Add optional service-area inputs to `itemCreateInput`: `serviceAreaCenterLat` (number, -90..90), `serviceAreaCenterLon` (number, -180..180), `serviceAreaRadiusMeters` (number > 0). All `.optional()`.
- [ ] Service arm: when all three service-area inputs are present, the `item_services` insert includes `service_area_geography` computed as `st_buffer(st_setsrid(st_makepoint($lon, $lat), 4326)::geography, $radiusMeters)`. When absent, insert without the geography column (stays null).
- [ ] `rate_model` defaults to `'quote'`; `rate_cents` passes through (null = free / quote).
- [ ] No change to product/gathering arms, spine, owner-check, brand_label, location attachment, publish, events.

### Tests — `tests/actions-t081.test.ts`

- [ ] Zod: service input with `serviceAreaCenterLat/Lon/RadiusMeters` parses; out-of-range lat/lon and non-positive radius reject.
- [ ] Source-shape: `create.ts` service arm references `st_buffer` + `st_makepoint` + `service_area_geography`; the no-area branch still inserts `item_services`.

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG T081 line. STAGE-LEDGER F040 row → `building`.

## Notes

- **No migration.** `item_services` (with `service_area_geography geography(Polygon,4326)`) exists in migration 015.
- **rate_model divergence (DEVIATION + SPEC-PATCHES):** F040 Data-Captured lists `flat / hourly / per-session / free`; the shipped CHECK is `hourly / flat / quote / membership`. We honor the durable schema. "per-session" has no schema slot (maps conceptually to `flat`); "free" is modeled as `rate_cents = NULL` (mirrors product's free path), not a `rate_model` value. File a SPEC-PATCHES entry against the scenario's Data-Captured row.
- **DB atomicity / RLS** verified by the F040 Playwright eval against live Supabase, not vitest (same split as T077/T080).
