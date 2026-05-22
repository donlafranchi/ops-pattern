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

### ADR-4: Maker profile is implicit, not claimed

**Status:** Accepted

**Context:**
A Member who makes things (sourdough, candles, jam, knives) is a Maker. Open question: do they explicitly opt in to a "Maker mode" — a toggle in `/you`, a separate onboarding step — or does the platform just notice they're making things and surface Maker affordances accordingly? The CLAUDE.md "people-first" stance argues for the latter; the b1 build sequence had it ambiguous.

**Decision:**
The Maker profile is **implicit and behavior-derived.** A Member becomes a Maker by *posting things for sale or trade that they make.* There is no Maker toggle, no claim flow, no separate onboarding. The Member's profile reveals Maker sections (products, appearance schedule, followers count) only when they have product Items; otherwise those sections do not exist on the page.

The platform should capture *frequency* as a signal of bona-fide-Maker status. A Member who posts one product once is not yet a Maker in any meaningful sense; a Member who posts regularly, appears at recurring Locations, and accumulates followers is. The signal lives as derived data (not a self-asserted role) so it cannot be gamed by claiming an identity without doing the work.

**Consequences:**
- The Member profile renders sections conditionally: Maker affordances appear when product Items exist; they vanish when none do. No empty-state maker sections.
- A `member.maker_signal` derived view is needed (read from event log + `items` count + recurrence). Not a column on `members` — a query/view that ranks Members by Maker activity. Deferred to a separate ticket; not blocking b1.
- "Open a Maker shop" / "Become a Maker" CTAs are not built. The CTA is just "List a product" — listing it makes you one.
- The b1 You — Business tab (per `community-platform.md` C10) is reframed: it appears when the Member has products, not when they flip a switch.
- The `vendor-*` legacy systems still in tree need re-anchoring on this implicit model in Phase 6 of the migration. Do not extend them with explicit-claim assumptions.

**Date:** 2026-05-08

### ADR-5: Locality default is geolocate-then-city-pick, mutable from any surface

**Status:** Accepted

**Context:**
The locality-first index needs to scope to a place. Open question: how does the platform pick the place on first visit? The b1-primitives.md bundle named the question; `community-platform.md` had previously decided against a global location-selector header pill in MVP, on the grounds that "people don't travel enough for friction here."

**Decision:**
The default locality is **the user's geolocation,** if they grant permission. If geolocation is denied or unavailable, the platform prompts for a **city pick** from a list (Sacramento metro and surrounding cities at launch; expandable). The chosen locality is **mutable** — the user can change it at any time, both for moves and for travel. The change affordance is visible from the surfaces that depend on locality (Home, Explore), not buried in `/you` settings only.

This supersedes the earlier `community-platform.md` decision to keep the location selector on `/you` only. The earlier reasoning ("people don't travel enough") understated the move case (a real Member life event) and the visit case (a regular reader visiting family in another city should not have to re-set their default permanently).

**Consequences:**
- Anonymous Home triggers a one-time geolocation prompt on first visit. Decision persists in a cookie.
- Authenticated Members get the same flow on first sign-up; the choice writes to `members.home_location_id` (or equivalent) and remains editable.
- A locality affordance lives in the global header (or near the search bar in the bottom-anchored UI per ADR-3) — visible enough to find, quiet enough to not nag.
- "Travel mode" / multiple saved localities is a T3 concern (per `community-platform.md`); at b1 it's a single mutable scope.
- Privacy: geolocation is requested but never required. The city-pick fallback must always be available.

**Date:** 2026-05-08

### ADR-6: A market is a Gathering Item; "gathering" is broad and varied

**Status:** Accepted

**Context:**
The `community-platform.md` product file lists "Market session" as a distinct feed-card type alongside vendor updates and gatherings. Earlier canonical examples treated the farmers market itself as a Location of `kind=recurring-temporary` with vendors as `Item(kind=product)` attached. Open question: is the recurring market session its own thing, or is it a Gathering?

**Decision:**
**A market is a Gathering Item.** The same primitive that carries the Run Club at Drake's, Barn Movie Night, the dance class at the community center, and the Sunday hike carries the Saturday farmers market. The Item primitive (`kind=gathering`) is broad and covers the full range of recurring real-world meetups people organize:

- Farmers markets
- Swap meets
- Clothes swaps
- Hands-on classes / workshops / skill-shares
- Run clubs, sewing circles, chess meetups, bird-watching outings
- Movie nights, trivia, open mics
- Community projects (volunteer days, repair cafés, fundraisers)

These differ from each other in tone, audience, and what people do — but they're the same shape in the data: a Person hosting a recurring (or one-time) thing at a Location with a schedule.

The distinction between *kinds of gathering* lives in **categories and hashtags** (`item_tags` controlled vocabulary + `item_hashtags` user-generated), not in a separate Item kind. So `#farmers-market`, `#clothes-swap`, `#beekeeping-class` are how a user filters; the underlying schema is one `item_gatherings` row.

**Consequences:**
- The `community-platform.md` "Market session" distinct feed-card type is **removed.** Markets render as gathering cards, like every other gathering. The card may surface different metadata depending on category (a market shows "vendors" if any are linked; a class shows "what to bring") — but the card type is one.
- The `events.md` system spec (currently in tree) should be reread and harmonized with this: events of all kinds are Items of `kind=gathering`. No separate "market" entity. (Per CLAUDE.md "events are Items of kind=gathering" — this ADR formalizes the broader scope.)
- Vendor-at-market modeling: a Maker's *appearance* at a market session can either (a) be a separate Item the Maker declares ("I'll be at Saturday's Folsom market") or (b) be a relationship between the Maker and the market's Gathering Item (RSVP-as-vendor, with a "vendor list" surface on the market page). Both shapes are reasonable; deciding between them is a follow-up scoped to `item.md`.
- A controlled-vocabulary list of gathering categories (farmers-market, swap-meet, class, run-club, movie-night, etc.) is needed before the first gathering is created. Lives in `item_tags`. Sized by the open question in `b1-primitives.md`.

**Date:** 2026-05-08

