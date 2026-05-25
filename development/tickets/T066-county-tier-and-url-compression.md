---
purpose: Substrate ticket — apply ADR-0022 (county tier) + ADR-0023 (URL compaction) to the geography substrate pre-commit.
layer: how
status: active
---

# T066 — County tier + URL compaction

**Scenario:** substrate
**Binds to:** [ADR-0022](../../planning/adrs/ADR-0022-url-slug-naming-refinements.md) · [ADR-0023](../../planning/adrs/ADR-0023-url-path-compaction.md) · [`places.md`](../../product/systems/places.md)
**Repo / branch:** `web` / `t65` — uncommitted; this is a pre-commit correction.

## Context

The geography substrate (T058–T064 — places table, reverse-geocoder, place URL routing, affinity retirement, place-interests, saved-searches, items made-at) was built but never committed; it sits as uncommitted working-tree changes on branch `t65`. ADR-0022 and ADR-0023 then refined the place model. This ticket is the correction applied *before* `t65` is committed — no rollback, no fix-forward. Claude Code has implemented; this ticket is the scope of record, the acceptance criteria CC verifies its build against, and the close-out checklist.

## Scope — what changed

**County tier (ADR-0022).**

- `places.kind` enum: `msa` → `county`. The enum is `region / state / county / city / neighborhood`.
- Seed (`017_places.sql`): California (state) → Sacramento County → Sacramento (city) → neighborhoods (Oak Park, Curtis Park, East Sacramento, Midtown, Land Park). West Sacramento is seeded as a separate `city` under Yolo County — not a Sacramento neighborhood.
- Reverse-geocoder maps `county` to Mapbox's `district` admin level (the `types=` parameter).

**URL compaction (ADR-0023).**

- State path segments render as the 2-letter USPS code (`ca`); the state row keeps `display_name` "California", `slug` = `ca`.
- `county` is URL-transparent: it stays in the data hierarchy (`city.parent = county`) but does not occupy a URL segment when a `city` ancestor exists. It renders only for a place with no city (rural/unincorporated) or as a disambiguator.
- City slug uniqueness scopes to the **state**, not the county.
- Canonical form: `/p/ca/sacramento/oak-park`.

**Files (8 core + 1 bonus).**

`supabase/migrations/017_places.sql` · `src/lib/places/resolve-path.ts` · `src/lib/places/reverse-geocode.ts` · `src/app/p/[...slug]/page.tsx` · `evals/phase-1/places.spec.ts` · `evals/phase-1/place-routing.spec.ts` · `tests/migrations-t058.test.ts` · `tests/places-resolve-path.test.ts` — plus `supabase/test-helpers/05_places_polygons.sql` (the polygon helper gained a `p_kind` parameter to disambiguate the Sacramento city/county slug collision; the old 2-arg signature is dropped so callers fail loudly). The bonus file is **accepted** — the city/county name collision is a real consequence of county URL-transparency, and kind-disambiguation is the correct fix.

## Acceptance criteria

- `places.kind` CHECK enum is `region / state / county / city / neighborhood` — no `msa`.
- Seed chain is California → Sacramento County → Sacramento → neighborhoods; West Sacramento is a `city` under Yolo County; the seed-count assertion matches the rows actually seeded.
- `/p/ca/sacramento/oak-park` resolves; the county segment is absent from a city-bearing path; a place with no city renders its county segment.
- City slugs are unique within their state.
- All phase-1 place evals + the `tests/` unit suite pass; `eval:bootstrap` applies cleanly.
- The jurisdiction ZIP-to-metro proximity code is untouched (see Out of scope).

## Out of scope — do not touch

The jurisdiction ZIP-to-metro proximity mechanism: `zip_metro_crosswalk`, `public.zip_is_proximal_to_location()`, and any "MSA" reference in `business-jurisdiction` code. That "MSA" is the metro-proximity crosswalk for the Locally-Owned badge — a separate system that ADR-0022 / ADR-0023 do not change. A blanket `msa`→`county` find-replace there would break it.

## Close-out

1. Log a `DEVIATIONS.md` entry — record the 9th file (`05_places_polygons.sql`) and the `p_kind` signature change as an accepted in-scope deviation.
2. Run the phase-1 place evals + the `tests/` unit suite; confirm green.
3. Lock pre-flight: confirm `web/.git/index.lock` is clear before any git step.
4. Produce a commit summary — repo (`web`), branch (`t65`), file list, suggested message — for the PM to run. Do not `git add` / `git commit`.
5. Branch hygiene: `t65` carries T058–T064 plus this correction. Flag for the PM — one batched geography-substrate commit, or reconstructed per-ticket commits — PM decides.

## Completion

_CC fills in: commit summary, eval results, DEVIATIONS reference._
