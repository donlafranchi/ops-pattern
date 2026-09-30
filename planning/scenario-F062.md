---
id: F062
title: The map shows areas, not just pins
status: draft
date: 2026-09-10
depends: [F061]
---
## Story

A run club with nothing scheduled isn't at a street corner on Tuesday afternoon — a pin for it would send someone to the wrong place. The map instead shades the neighbourhood it belongs to; tapping the shaded area lists every Page placed there, while Pages with a real address keep their ordinary pins.

## Acceptance

1. A neighbourhood with ≥1 area-placed Page renders as one shaded polygon (not one per Page), carrying a count.
2. Tapping a shaded area lists the Pages placed there.
3. A neighbourhood with no area Pages isn't drawn at all.
4. Point-placed Pages render exactly as they do today — unaffected.

## Not this

True neighbourhood boundaries (still hand-drawn rectangles) — a separate backfill. Fill/outline styling beyond a basic recipe.
