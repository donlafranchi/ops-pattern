# T005: Pin Clustering at Low Zoom Levels

**Scenario:** planning/scenarios/F001-map-view-pin-clustering.md
**Status:** Open

## Acceptance Criteria

- [ ] Overlapping pins collapse into a cluster indicator showing the count
- [ ] Zooming in expands clusters back into individual pins
- [ ] Tapping a cluster zooms the map into that area
- [ ] Single-business areas show as individual pin, never a cluster of 1
- [ ] Dense areas (100+ pins) remain performant
- [ ] Cluster threshold and radius are configurable
- [ ] Tests passing
- [ ] BUILD-LOG.md updated

## Notes

Use Mapbox GL JS built-in clustering on the GeoJSON source created in T004. Add to the existing source config:
```js
cluster: true,
clusterMaxZoom: 14,
clusterRadius: 50,
```

Add a cluster layer (circle with count text) alongside the existing pin layer. Use `['has', 'point_count']` filter to distinguish clusters from individual pins.

On cluster click: use `getClusterExpansionZoom()` to determine the target zoom, then `flyTo()`.

This modifies the map component from T004 — not a new component.

## Completion

Date:
Commit:
