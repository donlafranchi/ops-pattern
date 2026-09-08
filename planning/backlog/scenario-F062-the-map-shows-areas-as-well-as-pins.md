---
purpose: Scenario — the map renders area placements as neighbourhood polygons alongside point placements as pins, so "who is around" and "what is on and where" are visually distinct. Split from F061, which owns the model.
layer: how
status: backlog
---

# F062: The map shows areas as well as pins

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 4 (Gather regularly), 1 (Find your people)
**Primitive shape:** no new entity. A render path for a placement type [F061](../next/scenario-F061-someone-creates-a-page-worth-showing-people.md) already produces.
**Spec contract:** [`groups.md`](../../product/systems/groups.md) § Where a Page appears is resolved, not stored · [`design-language.md`](../../product/ui/design-language.md) — **owes an area recipe before build**
**Status:** backlog — **split out of F061 by review addendum 3, 2026-09-07.**

## Why this is its own scenario

**F061 owns the model: a placement is a point or an area, and the resolver returns which.** F061 explicitly does not build the map.

**This scenario is the render half.** It was split rather than absorbed because F061 is approved and buildable now, and the substrate tickets do not wait on anything a map does.

## The point

**A pin asserts that something is at a place. An area says a group is *of* somewhere without claiming it is anywhere in particular.** A run club with nothing scheduled is not at a location on Tuesday afternoon, and a pin for it sends someone to a street corner.

**Areas read as *who is around*. Pins read as *what is on and where*.** The same distinction the feed carries, delivered geometrically rather than through a filter someone has to find.

## What the code says today

- The map's data source is already GeoJSON, so a polygon is the same pipe — **no new source type.**
- **The source has clustering enabled, and Mapbox clusters point features only.** Polygons in a clustered source do not render correctly. **Areas need their own unclustered source.**
- **Pins are DOM markers, not a symbol layer.** Points and areas are therefore already two unrelated render mechanisms; this is new work, not a marker variant.

## The shape

- **One polygon per neighbourhood, never one per Page.** Several area Pages in one neighbourhood is the normal case, not an edge case; painting the same shape five times gives an opaque blob and a slower map.
- The polygon carries a **count**, and tapping it lists the Pages placed there.
- **A neighbourhood with no area Pages in it is not drawn at all.** The map is not an atlas.
- **Point placements are unaffected** — same markers, same clustering, same behaviour.

## Open, to settle at scope time

- Fill opacity and outline treatment, against a map that must stay readable with both layers on. **Owes a design-language recipe before build.**
- Whether an area is tappable at any zoom, or resolves to its list only above a threshold.
- What a neighbourhood shows when it holds both area Pages and pinned ones.
- **The five neighbourhood outlines are hand-drawn rectangles.** Drawing a rectangle over a real city is more obviously wrong than placing a point inside one. **This scenario may be the thing that forces the true-boundary backfill** — half a day, currently deferred.

## Price

**1 to 1.5 days.** Sequenced with the browse work, not with the Page-creation stretch. **If it does not fit, it defers without blocking anything** — area Pages simply do not appear on the map until it lands, which is the state today.
