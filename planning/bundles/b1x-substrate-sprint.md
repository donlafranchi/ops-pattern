---
purpose: Sprint definition — b1.x ADR-20/21 geography substrate. Work breakdown for the CC ticket-writer.
layer: how
status: active
---

# b1.x — Substrate Sprint: ADR-20 + ADR-21 geography layer

**Status:** Drafted 2026-05-25 (Cowork planning handoff). Companion to [`b1-work-map.md`](b1-work-map.md) § b1.x, [`../rebuild-plan.md`](../rebuild-plan.md) Phase 1+ substrate, and [`../STAGE-LEDGER.md`](../STAGE-LEDGER.md) Substrate row *"Phase 1+ — Member↔Geography substrate (ADR-21)."*

## What this is

The work-breakdown grain — one level above `T###`. Each work item below is converted by `ticket` into 2–5 `T###` tickets. This doc fixes the *what*, *the dependency order*, and the *acceptance shape*; the tickets fix the *how*.

- **Substrate lane** (per `CLAUDE.md` rule 14). Every item carries `Scenario: substrate`, binds to a system-spec section + ADR(s), no F-number, no Given/When/Then. **Skips the scenario-approval gate.**
- **Gate B still applies.** Schema + RLS are the canonical Category-2 absolute surface. See Preconditions.
- This is the **first parallel-ticket workflow test** — one clean dependency barrier, two waves, five fan-out items in wave 1.

## Why this sprint, why now

Dependency, not choice. b1.0 ("Show up & be seen") surfaces sit on substrate that does not exist yet: ADR-20's `places` table + place-scoped routing, and ADR-21's `member_place_interests` / `member_saved_searches` / `items.made_at_*`. No place-scoped surface can be built before its substrate lands. This sprint is that substrate.

## Preconditions

| # | Precondition | Owner | Gates | State |
|---|---|---|---|---|
| P1 | **`product/systems/places.md` must exist.** ADR-20 Action Item #1 (write `places.md`) is unchecked. The substrate lane binds tickets to a *spec section* — Lane A has no spec to bind to without it. `ticket` escalation rule: "schema change, no system spec → stop, ask `explore`." ADR-20 § *Action Items* #1 + § *Consequences* enumerate exactly what the spec must contain — this is an extraction, not a design pass. | `explore` | **Lane A only** | **Closed 2026-05-25** — `places.md` already exists (208 lines, T1/T2/T3 + Data model implications + ADR-20 encoding). ADR-20 Action Item #1 checked. |
| P2 | **Confirm ADR-20 intent-check status.** ADR-20 Action Item #7 (`weigh`) is unchecked. ADR-20 carries 3 Category-2 absolutes (places are platform-curated; URLs are locality-scoped; Members keep one global handle). Gate B blocks the `places` ticket if those lack a Ratified Intent tag. ADR-21's absolutes were ratified 2026-05-23 — Lane B is clear. | `weigh` | **A1 (`places`)** | **Closed 2026-05-25** — verdict **CLEAN** ([`planning/history/intent-ADR-20-2026-05-25.md`](../history/intent-ADR-20-2026-05-25.md)). All three Category-2 absolutes carry substantive Intent; ADR-20 Accepted 2026-05-23 supplies the State tag. ADR-20 Action Item #7 checked. |

Lane B ticket-writing can begin immediately — its spec sections (`member.md` § Place-interest scope / § Saved searches, `item.md` § Provenance) landed with the 2026-05-23 spec patches. **Both preconditions closed 2026-05-25; all 7 items are ready for `ticket` fan-out.** Embedded decisions 1, 2, 3 ratified by PM 2026-05-25.

## Work breakdown — 7 items, 2 lanes

### Lane A — ADR-20 places + URL substrate

#### A1 — `places` table  ·  *root, no deps*
**Binds to:** `product/systems/places.md` (P1) + ADR-20 § *The `places` primitive* / § *Schema implications*.
**Ships:** one migration (`017_places.sql` suggested). Self-referential `parent_id` (nullable for top-level); `kind` CHECK enum (`region`, `state`, `msa`, `city`, `neighborhood`); `slug` with `UNIQUE (parent_id, slug)` and the NULL-parent root case handled; optional `polygon geography(Polygon,4326)` (cities/neighborhoods may carry it, regions/states may stay coordinate-free); public-read RLS, **no user INSERT/UPDATE** (platform-curated — writes via action layer / service role only); GIST index on `polygon`. Plus **seed the launch-locality tree** (Sacramento + its neighborhoods per ADR-20 examples) — B2/F028 cannot set a `primary_home` against an empty table.
**Acceptance shape:** schema-shape eval (columns, the self-FK, the kind CHECK); `UNIQUE (parent_id, slug)` rejects a duplicate sibling slug and *allows* the same slug under different parents (the "two Oak Parks" case); RLS matrix — anon SELECT yes, anon/auth INSERT no; seed rows present.
**Open for `places.md` to settle:** whether `places` carries an event log (ADR-20 does not spec one; project principle is "event logs from day one" — `places.md` decides).

#### A2 — reverse-geocoder (lat/lon → place_id)  ·  *depends on A1*
**Binds to:** `places.md` § reverse-geocoding contract (P1) + ADR-20 § *Anchoring rules* / § *Costs* (Mapbox; cache aggressively).
**Ships:** app-layer service. Polygon containment (`ST_Contains`) when the candidate place has a polygon; Mapbox reverse-geocode fallback otherwise; aggressive caching. Called on the "set your home place" geolocate path.
**Acceptance shape:** a known coordinate inside a seeded neighborhood resolves to that neighborhood's `place_id`; a coordinate with only city-level coverage resolves to the city; cache hit on repeat.

#### A3 — place-scoped URL routing skeleton  ·  *depends on A1*
**Binds to:** `places.md` § URL-prefix derivation (P1) + ADR-20 § *URL hierarchy*.
**Ships:** Next.js catch-all `/p/[...slug]` route; place-path resolution (walk the `parent_id` chain to a `places` row); the place landing page route. **Redirect middleware is out of scope** — it depends on the `*_url_history` tables, deferred (see Scope boundary).
**Acceptance shape:** `/p/sacramento/oak-park` resolves to the Oak Park neighborhood row; an unknown path 404s; ancestor slugs resolve in order.

### Lane B — ADR-21 member↔geography substrate

#### B1 — retire `member_location_affinities`  ·  *no deps, parallel-safe*
**Binds to:** ADR-21 § *Supersedes* + `rebuild-plan.md` rule 7.
**Context:** the table **already shipped** as migration `011` (2026-05-17, before ADR-21). ADR-21 retires it in full. Verified clean: nothing FK-references it; the 3 SECURITY DEFINER functions (`member_is_local_to_location`, `count_likes_for_location`, `count_followers_for_location`) are defined only in `011` and have no callers in `web/src`.
**Ships:** one DROP migration — drop the table + the 3 functions. Retire the dead event kinds (`member.location_affinity_added/removed`) from the `member_events` CHECK if present. Cosmetic stale comments in `002`/`010` may be left or patched (not load-bearing).
**Acceptance shape:** post-migration, the table and 3 functions do not exist; full Phase 1 eval suite still green (no consumer breaks).

#### B2 — `member_place_interests` table  ·  *depends on A1 (FK → places)*
**Binds to:** `member.md` § Place-interest scope + ADR-21 + `rebuild-plan.md` Member surface.
**Ships:** one migration. Composite PK `(member_id, place_id, scope_kind)`; `scope_kind` CHECK enum (`primary_home`, `secondary`); unique partial index `(member_id) WHERE scope_kind='primary_home' AND removed_at IS NULL` (exactly one active primary_home); index `(member_id, scope_kind) WHERE removed_at IS NULL`; **owner-only RLS**; soft-delete. Action-layer guard: ≤5 `secondary` per Member (tuneable without migration). Event kinds: `member.place_interest_added/removed/promoted/demoted`.
**Acceptance shape:** the unique-primary-home index rejects a second active primary_home; owner-only RLS matrix (owner sees own rows, other auth member does not, anon does not); the FK to `places` rejects a bad `place_id`.

#### B3 — `member_saved_searches` table  ·  *depends on A1 (FK → places); location_id → locations (exists)*
**Binds to:** `member.md` § Saved searches + ADR-21.
**Ships:** one migration. `id` UUID PK; `member_id`; `label` (1–80 chars); nullable `place_id` + `location_id`; `interest_tags text[]`; `item_kinds text[]`; soft-delete. CHECK: at least one of `place_id`, `location_id`, or non-empty `interest_tags` is set. Indexes: `(member_id) WHERE removed_at IS NULL`, `(place_id) WHERE place_id IS NOT NULL AND removed_at IS NULL`, `(location_id) WHERE location_id IS NOT NULL AND removed_at IS NULL`. **Owner-only RLS.** Action handlers: `member.saved_search.create/.update/.remove`. Event kinds: `member.saved_search.created/.updated/.removed`. **No surface at b1** — the b2 composer + fan-out worker read this substrate.
**Acceptance shape:** the all-filters-null insert is rejected by the CHECK; owner-only RLS matrix; label length CHECK; the 3 action handlers conform (`npm run check:action-layer` clean).

#### B4 — `items.made_at_*` columns  ·  *depends on A1 (FK → places); items table exists (015)*
**Binds to:** `item.md` § Provenance claims — "Locally Made" + ADR-21 + `rebuild-plan.md` rule 8.
**Ships:** one migration altering `items` (015). Add `made_at_place_id` (nullable FK → `places.id`; meaningful only when `kind='product'`); add `made_at_verification_source` (text, default `'none'`, CHECK `IN ('none','self_attested','community_attested','document_supported')` — the rule-8 four-value form; **note the drift:** `rebuild-plan.md` line 148 still shows the older three-value CHECK without `community_attested` — rule 8 is authoritative, flag for a doc-patch). Extend the `item_events` event-kind CHECK to add `item.made_at_set/.made_at_removed/.made_at_verified` (T056 shipped `item_events` without them). **No surface at b1** — the "Locally Made" badge ships with F027.
**Acceptance shape:** the CHECK accepts all four `verification_source` values and rejects a fifth; `made_at_place_id` FK rejects a bad id; the 3 new event kinds are accepted by the `item_events` CHECK.

## Dependency order

```
Wave 0  (start at t0, parallel)        Wave 1  (unblocked when A1 lands, parallel)
┌─────────────────────────┐            ┌──────────────────────────────────────┐
│ A1  places table        │───────────▶│ A2  reverse-geocoder                 │
│ B1  retire affinities   │     │      │ A3  place URL routing skeleton       │
└─────────────────────────┘     │      │ B2  member_place_interests           │
                                ├─────▶│ B3  member_saved_searches            │
                                └─────▶│ B4  items.made_at_* columns          │
                                       └──────────────────────────────────────┘
```

`places` (A1) is the single dependency barrier — `place_id` FKs in B2/B3/B4 and the path resolution in A2/A3 all need it. **B1 is fully independent** of everything (clean parallel-test seed). Migration *file numbers* serialize the FK-bearing items after `017_places.sql`; B1's DROP migration can take any free number. `ticket` finalizes numbering.

**Suggested migrations:** `017_places` · `018_member_place_interests` · `019_member_saved_searches` · `020_items_made_at` · `021_retire_member_location_affinities`. A2 + A3 are app-layer (no migration number).

## Scope boundary — deliberately NOT in this sprint

- **ADR-20 slug-uniqueness rewrites** on `locations` / `groups` / `items` (`UNIQUE (place_id, slug)` etc.), the **`*_url_history`** tables + redirect middleware, and **`group_group_memberships`** — deferred to b1.1/b1.2 substrate, landing alongside the Group + business-Group surfaces that consume them. b1.0 needs only `places` + `/p/` routing + `/m/[handle]` (already global).
- **`member_business_jurisdictions` table** — see Embedded decision #3.
- **All ADR-21/ADR-20 surfaces** — F026–F029 and the b1.0 surfaces ride *on top* of this substrate and flow through the normal scenario gate.

## Embedded decisions — the delta from the roadmap's 6-item list

Research against the live repo changed the shape. Three picks are baked in; flip any with one line.

1. **Added B1 (retire `member_location_affinities`).** The roadmap's 6-item list omitted it. The table already shipped as migration `011`; ADR-21 + `rebuild-plan.md` rule 7 retire it. It belongs in this sprint — STAGE-LEDGER already groups it here. *Assumption: in scope.*
2. **`places.md` written first (P1), not bypassed.** ADR-20 is detailed enough to bind tickets directly, but the substrate-lane contract wants a spec section and ADR-20's own Action Item #1 calls for the spec. Recommended pick: `explore` extracts `places.md` from ADR-20 as Step 0 — fast, and it unblocks Gate-B-clean ticketing. *Assumption: write the spec.*
3. **`member_business_jurisdictions` deferred to b1.2/F026 — NOT in this sprint.** The roadmap (and STAGE-LEDGER) describe a `sos_lookup → community_attested` *enum rename* on this table. The table **does not exist** in the migrations — there is no enum to rename. The honest reframe: when the jurisdiction table is created it is created *with* the correct `verification_source` enum (`self_attested`/`community_attested`/`document_upload`) — a create-it-right, not a rename. Its natural home is b1.2 alongside F026 ("Maya claims Locally Owned"). *Assumption: defer; correct the stale "rename" wording in STAGE-LEDGER + ADR-21 via a doc-patch.* **Counter-option:** pull jurisdiction-table creation into this sprint to keep all ADR-21 substrate together and leave F026 a pure surface.

## Workflow handoff

1. PM confirms this sprint definition (and embedded decisions 1–3).
2. `explore` writes `places.md` (P1); `weigh` confirms ADR-20 (P2).
3. `ticket` fans the 7 items into `T###` tickets — `Scenario: substrate`, binding to the spec contracts above.
4. `build` (parallel CC agents) implements: A1 + B1 first, then A2/A3/B2/B3/B4.
5. `test` verifies; STAGE-LEDGER Substrate row stamped at each transition.

## Sprint exit criterion

`places` exists and is seeded; reverse-geocoder resolves a coordinate to a `place_id`; `/p/[...slug]` resolves a place path; `member_place_interests`, `member_saved_searches`, and `items.made_at_*` exist with RLS + indexes + action handlers + event kinds per spec; `member_location_affinities` and its 3 functions are gone; full eval suite green; `npm run check:action-layer` clean. b1.0's surface work is then unblocked.
