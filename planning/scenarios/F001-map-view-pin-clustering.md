# Scenario: Map View — Pins cluster at low zoom levels

**Feature:** F001 (product/systems/map-system.md)
**Severity:** Important
**Bundles:** b1

## Acceptance Criteria

### Given
- 20+ businesses exist within a geographic area

### When
- The user zooms out so that multiple pins would overlap

### Then
- Overlapping pins collapse into a cluster indicator showing the count
- Zooming in expands the cluster back into individual pins
- Tapping a cluster zooms into that area

## Edge Cases

- Single-business cluster: shows as individual pin, not a cluster of 1
- Very dense areas (100+ pins): clusters remain performant

## Assumptions

- Uses Mapbox GL JS built-in clustering
- Cluster threshold and radius are configurable
