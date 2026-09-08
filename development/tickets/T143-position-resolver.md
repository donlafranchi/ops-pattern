# T143: Where a Page appears is resolved, not stored

**Scenario:** F061 — someone creates a page worth showing people
**Status:** Open
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

- [ ] A single resolver — e.g. `resolvePagePlacements(pageId)` — returns a **list** of placements. Each element carries `{ source, kind }` where `kind` is `'point' | 'area'` and `source` identifies where it came from (`'anchor'` today; `'appearance'` is a legal value the type accepts but nothing yet produces).
  _Why: review binding note 9 — a resolver that returns a single point, or a point-only shape, is a contract change later and every caller breaks with it. Typing the list element by both count and kind from the first commit means the appearances work (not yet scenarioed) adds a branch instead of restructuring the return type._
- [ ] **At launch, before appearances exist, the resolver returns exactly one placement**: the Page's own anchor. `kind: 'point'` if the Page gave a street address; `kind: 'area'` if it gave a neighbourhood.
- [ ] The precedence branch for active appearances is present in the function's structure (a clearly-named early-return or merge step) and **unreachable** — there is no `appearances` table yet, so this branch has nothing to query. It is not deleted or commented out; it is dead code with a comment naming why, so the appearances ticket extends rather than rewrites.
- [ ] **No column, cache, or materialized view stores a Page's resolved position.** The function runs at read time, called from wherever a placement is needed (public Page, card, future map work).
  _Why: an appearance starting or ending changes the answer with no write to the Page; anything precomputed goes stale at that instant with no event to invalidate it on. `review-F061.md` binding note 10._
- [ ] The public Page surface renders a line stating where the Page currently resolves to — the neighbourhood name, or the resolved address — sourced from this function, visible to every viewer including the owner.
- [ ] Test: a Page with an address anchor resolves to one point placement, source `'anchor'`.
- [ ] Test: a Page with a neighbourhood anchor resolves to one area placement, source `'anchor'`, identified by its Place rather than a bare coordinate.
- [ ] Test: the function's return type is asserted (not just its runtime value) to reject a caller that destructures a single object instead of iterating a list — this is the contract T147 and any future map work build against.
- [ ] `BUILD-LOG.md` updated.

## Explicitly not in this ticket

- **Appearances themselves** — the table, the exclusion constraint, the `btree_gist` extension, the handler. Not yet scenarioed. **Recorded here so the design isn't lost:** when that work lands, appearance rows must carry a real time-range column (not schedule detail in JSON) so a `btree_gist` exclusion constraint can refuse an overlapping appearance at creation, checked in the handler first so the refusal can name the conflicting appearance. The resolver's `source: 'appearance'` branch and the "replaces an area, adds to an address" precedence rule (`groups.md:270`) are the contract that ticket must satisfy — this ticket does not build any of it.
- **The map's rendering of an area.** Routed to F062 (`planning/backlog/scenario-F062-the-map-shows-areas-as-well-as-pins.md`), sequenced with browse. This ticket ships the model; F062 ships the render.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3** — fires only for the new public-Page "where you are now" line; the resolver itself is not a surface.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.

## Notes

- **This is the one part of F061 the review calls expensive to retrofit.** Do not simplify the return type "since appearances aren't built yet" — that shortcut is exactly what binding notes 9 and 10 exist to prevent.
- Place/metro resolution is unaffected — both already resolve from a point, and the neighbourhood-mode derived point already satisfies that path (T142).

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
