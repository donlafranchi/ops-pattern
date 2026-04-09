# DECISIONS.md — Architectural Decisions

## Format

```markdown
### ADR-{N}: {Title}

**Status:** Proposed / Accepted / Deprecated

**Context:**
{What problem prompted this decision?}

**Decision:**
{What did we decide and why?}

**Consequences:**
{What are the trade-offs?}

**Date:** {YYYY-MM-DD}
```

---

## Decisions

### ADR-1: Tech Stack Selection

**Status:** Accepted

**Context:**
Need a full-stack framework that supports SSR (for shareable listing URLs with OG metadata), map-heavy UI, and fast mobile-first development.

**Decision:**
Next.js (App Router) + Tailwind + Supabase + Mapbox GL JS. Deploy on Vercel.

**Consequences:**
- Vendor lock-in on Supabase (mitigated: standard Postgres underneath)
- Mapbox has usage-based pricing (free tier generous for MVP)
- Vercel + Next.js is tightly coupled (acceptable trade-off for speed)

**Date:** 2026-04-09

### ADR-2: Build b1 for Local Food Network Extensibility

**Status:** Accepted

**Context:**
Local Food Network ("know your farmer") is a strategic b2 priority. It connects consumers with local farmers, ranchers, and food producers using the same map infrastructure. If b1 bakes in assumptions that only work for retail/service businesses, adding food producers later will require painful schema migrations and refactoring.

**Decision:**
All b1 architecture decisions must account for food producers as a future business type. Specifically:
- **Categories** must be extensible (not a hardcoded enum of retail/service types). Farmers, ranchers, orchards, apiaries, etc. need to fit naturally.
- **Business data model** must support optional fields that don't apply to all types (e.g., seasonal availability, product types, growing practices). Use a flexible metadata/attributes pattern rather than wide tables with nullable columns.
- **Ownership tiers** must work for farms (most are independently owned, family-run, or co-ops — the existing 5-tier model fits well, no changes needed).
- **Registration flow** must be simple enough for someone who isn't tech-savvy. If it works for a farmer, it works for everyone.
- **"I visited here"** must work for farm visits, not just storefronts.

**Consequences:**
- Slightly more abstraction in the data model than a pure retail MVP would need
- Category system needs to be open/taggable rather than a fixed dropdown
- Registration form may need conditional fields by business type (or just keep it minimal and universal)
- No b1 code should reference "store", "shop", or retail-specific language in the schema — use "business" or "listing" as the generic term

**Date:** 2026-04-09

### ADR-3: Bottom-Anchored Mobile-First UI

**Status:** Accepted

**Context:**
The app is map-first and mobile-first. Most users will be on phones. Top-of-screen UI is hard to reach one-handed on modern tall phones. Users expect map app interactions to follow Google Maps / Apple Maps conventions.

**Decision:**
All primary UI controls are anchored to the bottom of the viewport:
- Search bar sits at the bottom, expands upward on focus
- Detail cards slide up from the bottom
- Navigation bar at the bottom (if needed)
- No top-anchored toolbars or search fields
- Follow established UX patterns from Google Maps and Apple Maps so users are instantly familiar

**Consequences:**
- Map takes full viewport — clean, immersive
- Every interactive element is thumb-reachable
- Search suggestions, detail cards, and nav all compete for bottom space — need clear layering/z-index rules
- Desktop layout may need adaptation (bottom-anchored feels odd on wide screens) — but mobile is the priority

**Date:** 2026-04-09
