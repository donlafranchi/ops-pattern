# ADR-0002: Bottom-anchored, mobile-first UI

**Status:** Accepted
**Date:** 2026-05-08
**Deciders:** PM
**Scope:** Every surface in the web application — composer drawers, search bars, navigation, detail cards, modals, action buttons
**Touches:** [`product/ui/design-language.md`](../../product/ui/design-language.md) (canonical home — Principles #6 + Surface patterns), [`web/CLAUDE.md`](../../web/CLAUDE.md), every Phase 2/3 surface ticket

## Decision

All primary controls anchor to the bottom of the viewport. Specifically:

- The search bar lives at the bottom and expands **upward** on focus.
- Detail cards slide up from below.
- Navigation (when present) sits at the bottom of the viewport, not at the top.
- Action buttons (composer "Publish," confirmation "Send," etc.) anchor to the bottom as sticky elements on mobile; on desktop the same components float in the same screen region.
- No top-anchored toolbars or search fields. The top of the viewport is reserved for content header / breadcrumb only.

The interaction patterns follow Google Maps and Apple Maps deliberately — users arrive already trained on the bottom-card, slide-up, expand-upward model. The full prose lives in [`design-language.md`](../../product/ui/design-language.md) Principles #6 + the Surface patterns section.

Mobile-first; desktop is a layered adaptation of the mobile design, not the priority surface.

## Trade-offs

The dominant alternative — top-anchored search bar plus desktop-first layout — was rejected because the platform's primary use is locality-driven mobile interaction (a Member at a market, a Member outside a venue, a Member opening the app between errands). A top-anchored UI on mobile forces thumb-reach trade-offs every interaction; a bottom-anchored UI on desktop costs nothing because the layout has room to spare. Optimize for the harder constraint.

The Google/Apple Maps reference is structural, not aesthetic. Users opening the app for the first time encounter a familiar interaction pattern — search at the bottom, results expand upward, tap a result to open a detail card that slides up from below. The cognitive cost of learning the app is the cost of learning *this app's content*, not the cost of learning a novel chrome.

The cost: every desktop-first design pattern (e.g., a top navigation bar with persistent links) is structurally unavailable. Desktop-only power-user surfaces (admin dashboards, internal ops tooling) work around the constraint with denser content blocks rather than re-anchored chrome.

## Consequences

- Every Phase 2/3 surface ticket assumes bottom-anchored chrome. The build agent's CLAUDE.md inherits this via [`web/CLAUDE.md`](../../web/CLAUDE.md).
- The Mapbox integration (ADR-1) is the load-bearing visual model — the bottom-card pattern is map-card behavior generalized to non-map surfaces.
- The composer drawer pattern (referenced in F018's design check) is bottom-anchored; the "Host something here" CTA on `/l/[slug]` opens the drawer upward.
- The "Sell" CTA, the "Wonder if…" composer, the "Get a QR card for this" affordance, and every primary action on a venue / Member / Group / Item page follow the same anchor.
- This ADR forecloses a path where the platform adopts a desktop-first or top-anchored chrome at any phase. Reversible at the cost of re-laying every surface — non-trivial but not catastrophic. The foreclosure is the point: one anchor, every screen.

## Action Items

1. [x] Decision ratified at project bootstrap (2026-05-08, pre-mission-clarity era).
2. [x] [`design-language.md`](../../product/ui/design-language.md) Principles #6 + Surface patterns is the user-facing ratification.
3. [x] Pointer line in [`../DECISIONS.md`](../DECISIONS.md) pointer index.
4. [ ] Every new surface ticket in Phase 2/3 cross-references this ADR in its acceptance criteria.
