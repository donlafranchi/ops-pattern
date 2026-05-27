---
purpose: Index of shipped user-visible versions, one line per release.
layer: how
status: active
---

# Releases

The one-line index of every user-visible version that has shipped. Companion to `planning/bundles/` (where in-flight + done bundle plans live) and `_attic/YYYY-MM-DD-vN-{slug}/` (where each shipped release's archived plan + RELEASE.md live).

## Conventions

- **One line per shipped release.** No prose. If a release needs context, link to its `RELEASE.md` in `_attic/`.
- **Order:** newest at top.
- **Format:** `- **vN — {slug}** (shipped YYYY-MM-DD) — one-line summary. [archive](../_attic/YYYY-MM-DD-vN-{slug}/RELEASE.md)`
- **Versioning:** integer-major (`v1`, `v2`, …) follows the bundle number (`b1` ships → `v1`). Decimal sub-bundles (`b1.0`, `b1.1`, …) do not get their own row unless the PM has called them out as a user-visible version cut; otherwise they roll into the parent version. Substrate-only sub-bundles (`b1.x`) never get a row — they have no user-visible surface.
- **No row until shipped.** In-flight bundles live in `planning/bundles/` with `status: active`. The row lands here on merge to main + production deploy, not at the close of a sub-bundle.

## Releases

_No user-visible versions shipped yet. First row lands when b1 (Primitives MVP) deploys to production._

<!--
Template for the first entry:

- **v1 — primitives** (shipped 2026-MM-DD) — Person / Item / Location / Group primitives, place-scoped routing, Member↔Geography substrate. [archive](../_attic/2026-MM-DD-v1-primitives/RELEASE.md)
-->

## How a release row gets written

1. Bundle plan in `planning/bundles/b{N}-{slug}-plan.md` flips `status: active` → `status: done` at merge.
2. `tidy` (sweep-docs mode) proposes:
   - Move the bundle plan + its artifacts (work-map, audit, wrapup, sprints) to `_attic/YYYY-MM-DD-vN-{slug}/`.
   - Author `_attic/YYYY-MM-DD-vN-{slug}/RELEASE.md` summarizing what shipped (scope, scenarios, deviations, metrics).
   - Append the one-line row to this file.
3. PM ratifies; the same `tidy` pass executes all three.

Do not hand-edit this file outside of that flow. Drift between this index and `_attic/YYYY-MM-DD-vN-{slug}/RELEASE.md` defeats the index's purpose.
