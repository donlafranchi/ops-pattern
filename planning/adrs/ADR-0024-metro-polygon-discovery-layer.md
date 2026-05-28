# ADR-0024: Metro Polygon as Discovery-Layer Construct

**Status:** Proposed
**Date:** 2026-05-26
**Related:** ADR-0021 (member geography model), ADR-0022 (county replaces MSA in hierarchy), `product/systems/discovery.md`

---

## Context

ADR-0022 removed MSAs from the addressing hierarchy because they don't tile — ~1,200 rural counties have no MSA, and a hierarchy tier must assign every coordinate to exactly one anchor. County replaced MSA as the organizing tier.

That move left two loose ends:

1. The discovery feed's "wider than my city" opt-in lost its natural scope. County is narrower than a metro, and county lines are arbitrary for "what's near me" — a Member in Roseville cares about Sacramento, not Placer County.
2. There is no named, browsable "my metro" scope. Radius and isochrone can approximate it but can't give it a label or a stable shape.

The same MSA geometry that failed as a hierarchy tier works cleanly as a discovery overlay, because the two layers have different obligations: a hierarchy tier must tile; a discovery overlay does not. A rural place simply isn't in any metro polygon and falls back to radius/isochrone — that's a feature, not a gap.

## Decision

Add a **platform-curated metro-polygon layer** as a discovery construct adjacent to the county tree.

**Shape:**
- Separate table holding metro polygons (geometry + name + slug-for-display).
- Places and Locations are "in" a metro by `ST_Contains` against home coordinates — **not** by tree parentage.
- Discovery-only: read by feed generation and the "wider scope" filter. **Never** appears in a URL, addressing path, or as a messaging target.
- Platform-curated. Members cannot create or edit metro polygons.

**Grain:** Curated, seeded from Census **CSA** definitions (Combined Statistical Areas), not strict MSAs. CSAs unify split metros — the Bay Area is one CSA but two MSAs; Greater LA is one CSA but multiple MSAs. Curated-from-Census preserves correctness and leaves room for local hand-tuning where Census disagrees with how residents actually think about their metro.

**Composition with the rest of discovery:** Three discovery geometries, all adjacent to the county tree —
- **Radius** (cheap default, ships now)
- **Metro polygon** (named, coarse, browsable — this ADR)
- **Travel-time isochrone** (precise, personalized — deferred T2/T3)

The metro polygon becomes the target of the feed's "wider scope" opt-in: "Everything in Greater Sacramento."

**`region`-kind's role shrinks.** ADR-0022 left `region` as the home for colloquial metros. With the metro polygon doing that job for discovery, `region` is retained **only** for genuinely URL-browsable regions (e.g., "North Coast" as a curated landing page). If no such use case materializes during b1, `region` drops out of the tree entirely in a follow-up ADR.

## Consequences

**Positive:**
- Completes the two-layer model: county tree owns organizing (addressing, URLs, coverage); discovery layer owns "what's near me" and can hold multiple geometries simultaneously.
- Closes the ADR-0022 gap — feed's "wider than city" scope now has a clean, named target.
- Zero tree contamination, zero URL exposure. Metro membership is a geometric fact, not a parentage claim.
- Passes the design test (elegant, helpful, simple, reduce-abuse): platform-curated read-filter only, never a broadcast surface — consistent with the anti-Nextdoor commitment that place-interests and saved-searches are read by feed generation, never used as messaging targets.

**Negative / accepted trade-offs:**
- Rural places have no metro scope and rely on radius/isochrone for "wider than city." Accepted — that's the correct semantics, not a bug.
- Curation work: someone maintains the metro table when Census redefines CSAs or when locals report a bad polygon. Bounded scope, infrequent edits.
- Adds a third discovery geometry to reason about. Mitigated by shipping radius + metro polygon now and deferring isochrone to T2/T3.

**Out of scope (explicit non-goals):**
- Metros do **not** become messaging targets. No "send to everyone in Greater Sacramento."
- Metros do **not** appear in URLs. Browsing happens through county/city paths; "my metro" is a feed filter, not a destination.
- Members do **not** create or vote on metro definitions.

## Alternatives Considered

**Reuse `region`-kind places as the metro scope.** Rejected: pulls a discovery construct back into the tree, risks making `region` a near-mandatory parent, exposes the metro concept to URLs. Mixes the two layers ADR-0022 cleanly separated.

**Skip the metro polygon; rely on radius/isochrone alone.** Rejected: loses the named, browsable "my metro" scope. Radius can approximate it but can't label it or give a Member a stable, shareable shape — "everything in Greater Sacramento" is a meaningful unit of attention that radius can't express.

**Use strict Census MSAs instead of CSAs.** Rejected: splits the obvious metros (Bay Area, Greater LA, NYC tri-state). CSAs match how residents actually think about their metro; curation room handles the edges.

## Foreclosed by this ADR

- ADR-0022's "Foreclosed: MSA" note is refined: MSAs are foreclosed **as a hierarchy tier**, but their geometry (in CSA-grain, curated form) is the basis for the discovery metro polygon. The two statements are consistent — different layers, different obligations.

## Implementation Notes (advisory — for CC, not binding)

- Schema sketch: `metro_polygons (id, slug, display_name, geometry, csa_source_id, curated_overrides_at)`.
- Feed query: `WHERE ST_Contains((SELECT geometry FROM metro_polygons WHERE id = :member_home_metro), item.coords)`.
- Home-metro resolution: at member home-coordinate save time, compute `home_metro_id = (SELECT id FROM metro_polygons WHERE ST_Contains(geometry, :coords) LIMIT 1)`. Cache on the member row. NULL is a legal value (rural).
- `discovery.md` needs an edit: replace the "MSA-depth opt-in" language with "metro-polygon scope" and document the radius/metro/isochrone trio.

## Decisions Captured

- Metro polygon is a **discovery-layer overlay**, adjacent to the county tree, never in URLs or messaging.
- Grain is **CSA, curated-from-Census**.
- `region`-kind is retained for URL-browsable regions only; revisit dropping it if no use case materializes in b1.

---

**One-line restatement:** Add a platform-curated, CSA-grain metro polygon table as a discovery-only overlay adjacent to the county tree — it completes the two-layer model and gives the feed's "wider than city" opt-in a named target.
