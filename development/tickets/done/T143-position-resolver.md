# T143: Where a Page appears is resolved, not stored

**Scenario:** F061 — someone creates a page worth showing people
**Status:** Complete
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** T142 (needs real address/neighbourhood Locations to resolve against). **Blocks:** T147 (the "where you are now" line ships as part of the composer's review/publish surface and the public Page).

**Serves:**
- **Loop:** 9 (Make a living locally) — an itinerant Page (a truck, a home baker) needs its position told honestly or the map misrepresents it.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** a read-time function over Person → Page → Location(s). **No new entity, no stored position.**

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** review F061. PROCEED, binding notes 9 and 10 govern this ticket directly.
- [x] **Gate B — clear.** `groups.md:253` (point-vs-area assertion, Ratified), `groups.md:261` (address never revealed by appearance, Ratified), `groups.md:268` (no simultaneous placements, Ratified), `groups.md:277` (always shown publicly, Ratified).
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec.** `product/systems/groups.md` § *Where a Page appears is resolved, not stored* (line 246+).

## What changes

One function. No schema, no migration, no cache.

## Acceptance Criteria

- [x] A single resolver — `resolvePagePlacements(groupId)` (`src/lib/groups/resolve-page-placement.ts`) — returns a **list** of placements. Each element carries `{ source, kind, label, lng, lat }` where `kind` is `'point' | 'area'` and `source` is `'anchor'` today; `'appearance'` is a legal value the type accepts but nothing yet produces.
- [x] At launch, before appearances exist, the resolver returns exactly one placement: the Page's own anchor. `kind: 'point'` for a street address, `kind: 'area'` for a neighbourhood.
- [x] The appearance precedence branch (`resolveAppearancePlacements`) is present and unreachable — returns `[]` unconditionally, with a comment naming why, so the appearances ticket extends rather than rewrites.
- [x] No column, cache, or materialized view stores a Page's resolved position — the function runs inside `withTransaction` at call time, on every call.
- [x] The public Page surface (`ShopPublicPage.tsx`) renders `shop.placements[0].label`, visible to every viewer including the owner.
- [x] Test: address anchor → one point placement, source `'anchor'`.
- [x] Test: neighbourhood anchor → one area placement, source `'anchor'`, labelled by its Place name (asserted to not match a coordinate pattern).
- [x] Test: the return type is asserted via `@ts-expect-error` against a single-object destructure — `tsc --noEmit` confirms the line is genuinely a type error, not an unused suppression.
- [x] `BUILD-LOG.md` updated.

## Explicitly not in this ticket

- **Appearances themselves** — the table, the exclusion constraint, the `btree_gist` extension, the handler. Not yet scenarioed. **Recorded here so the design isn't lost:** when that work lands, appearance rows must carry a real time-range column (not schedule detail in JSON) so a `btree_gist` exclusion constraint can refuse an overlapping appearance at creation, checked in the handler first so the refusal can name the conflicting appearance. The resolver's `source: 'appearance'` branch and the "replaces an area, adds to an address" precedence rule (`groups.md:270`) are the contract that ticket must satisfy — this ticket does not build any of it.
- **The map's rendering of an area.** Routed to F062 (`planning/backlog/scenario-F062-the-map-shows-areas-as-well-as-pins.md`), sequenced with browse. This ticket ships the model; F062 ships the render.

## Workflow gates

- [x] **M2 — `engineering:code-review`** before commit. No blocking findings; see Completion notes for one fix-forward to T142.
- [x] **M3** — fired for the "where you are now" line: plain informational text, no interactive element, no new accessibility surface.
- [x] **M4** — no migration. Confirmed.
- [x] **DEVIATIONS.md entry** at close.

## Notes

- **This is the one part of F061 the review calls expensive to retrofit.** Do not simplify the return type "since appearances aren't built yet" — that shortcut is exactly what binding notes 9 and 10 exist to prevent.
- Place/metro resolution is unaffected — both already resolve from a point, and the neighbourhood-mode derived point already satisfies that path (T142).

## Completion — notes

- **Fixed forward into T142:** `sellCreateLocationAction` computed the geocoder's resolved address text for UI confirmation but never persisted it — there was nowhere for this ticket to read it back from for an address-mode Location. Added `description` to the INSERT (the column already existed, unused, nullable). Not a schema change, no migration — using an existing column counts as the code fix this ticket's own scope allows, not new schema.
- **Two credential paths in one resolver function.** `resolveShop()` is otherwise entirely Supabase-client-shaped (session-bound, RLS-respecting); `resolvePagePlacements` reaches for the action-layer pg pool instead, because extracting lng/lat from a `geography` column needs raw `st_x`/`st_y` SQL that PostgREST doesn't expose as a convenient read. This matches existing precedent (`sellActivateAction`'s own place-path resolution does the same) but is worth naming: `locations` already has a public-read RLS policy, so bypassing RLS via the pg pool changes no actual access-control outcome here — the data was already public-read either way.
- **A SQL-side RPC (mirroring `place_for_coords`) would have kept `resolve-shop.ts` single-credential-path, but that requires a new Postgres function — DDL, needing a migration — which this ticket's own scope explicitly rules out ("No schema, no migration, no cache"). The TypeScript-side pg-pool approach was the only option inside scope.**

## Completion

Date: 2026-09-08
Commit: {pending}
