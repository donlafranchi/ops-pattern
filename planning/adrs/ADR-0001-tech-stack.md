---
purpose: ADR-1 — Next.js + Supabase + Mapbox + Vercel stack.
layer: how
status: active
---

# ADR-0001: Tech stack — Next.js + Tailwind v4 + Supabase + Mapbox

**Status:** Accepted
**Date:** 2026-05-08
**Deciders:** PM
**Scope:** The deployable application's framework, language, database, map, test, and deploy choices
**Touches:** [`web/CLAUDE.md`](../../web/CLAUDE.md) (canonical home — "Tech Stack" section), [`web/package.json`](../../web/package.json), [`web/next.config.*`](../../web/), [`web/tsconfig.json`](../../web/), [`web/supabase/`](../../web/supabase/), `CLAUDE.md` (root — "Project Facts" line)

## Decision

The web application ships on:

- **Framework:** Next.js with App Router.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v4 using `@theme inline` tokens defined in `globals.css`.
- **Database / Auth / Realtime:** Supabase (Postgres + Auth + Realtime).
- **Maps:** Mapbox GL JS.
- **Testing:** Playwright for evals; Vitest for unit tests.
- **Deploy:** Vercel.

The full long-form description lives in [`web/CLAUDE.md`](../../web/CLAUDE.md). This ADR is the canonical index entry; the home doc is the load-bearing prose.

## Trade-offs

Each row of the stack was picked for a stack-internal reason — Next.js for the App Router's server-component model, Supabase for the Postgres-plus-Auth-plus-RLS bundle that matches the action-layer architecture in ADR-7, Mapbox for ADR-2's bottom-anchored map-style UI, Tailwind v4 for tokenized design-language reuse, Vercel for zero-friction preview deploys. The cost is a non-trivial vendor-and-tool-chain footprint to keep coherent; the discipline is that swaps happen at ADR-grade only.

The TypeScript + Tailwind v4 token combo is what makes [`design-language.md`](../../product/ui/design-language.md) (the home of ADR-2) a runnable doc rather than a wishlist — every token has a name, every component recipe maps to typed props, and the eval suite can assert on rendered output.

## Consequences

- Every web/-resident ticket assumes this stack. Build-agent CLAUDE.md inherits the constraints.
- Supabase's Postgres dialect is the floor for every migration — Phase 0 already pulls in `pgvector` and `postgis` (per [`planning/rebuild-plan.md`](../../planning/rebuild-plan.md) Phase 0 § 001_extensions.sql).
- Mapbox is the only map vendor at b1 — no Google Maps fallback, no Leaflet shim. The vendor is part of the stack contract.
- A swap of any single row (e.g., Next.js → Remix, Supabase → Neon + Clerk + Ably) triggers a new ADR. Spec banners are not enough — the change is cross-cutting.
- Vendor-portable migration shape: every Phase 1+ migration is plain SQL with Supabase-specific features (RLS, `auth.users`) named explicitly so a future vendor swap can be scoped.

## Action Items

1. [x] Decision ratified at project bootstrap (2026-05-08, pre-mission-clarity era).
2. [x] [`web/CLAUDE.md`](../../web/CLAUDE.md) "Tech Stack" section is the user-facing ratification.
3. [x] Pointer line in [`../DECISIONS.md`](../DECISIONS.md) pointer index.
4. [ ] Any vendor swap below the row level (e.g., Mapbox style version, Supabase plan tier) tracked in commit history only; an ADR is required for a row-level swap.
