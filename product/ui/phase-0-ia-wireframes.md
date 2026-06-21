---
purpose: Phase 0 design deliverable — IA, wireframes, rationale, open questions.
layer: what
status: draft
---

# Phase 0 — Structure

> Movers, Makers & Shakers PWA design pass. Gated deliverable — Phase 1 (foundations + hi-fi) follows on approval.

## Information Architecture

### Navigation model — 4-tab bottom bar

Mobile-first PWA. Bottom tab bar with four zones: **Home** · **Explore** · **Create** · **You**. Thumb-reachable per DLS Principle #9 (bottom-anchored, Google Maps / Apple Maps patterns).

The Create tab is not a "+" floating action button — it opens a bottom sheet with a kind picker (Host · Sell · Offer · Float an idea). This gives the action weight and intentionality without the engagement-bait of a persistent floating circle. Auth-gated: tapping Create while logged out routes to sign-in with return.

Desktop: the same four zones render as a left sidebar nav. The bottom bar disappears at the `md` breakpoint (768px). Content area centers at max-width 1080px.

### Page inventory (day-one)

**Tab surfaces (4):**

| Surface | Route | Auth | Primary job |
|---|---|---|---|
| Home | `/` | No (limited) | Locality feed — what's happening near me this week |
| Explore | `/explore` | No | Searchable catalog — I'm looking for a thing |
| Create | (bottom sheet) | Yes | Declare something — host, sell, offer, float |
| You | `/you` | Yes | Identity, follows, locality, selling tools, settings |

**Standalone pages (12):**

| Surface | Route pattern | Auth | Variants |
|---|---|---|---|
| Item page | `/p/.../e/[slug]` (event), `/p/.../p/[slug]` (product), etc. | No | 7 kinds: event, product, service, idea, offer, ask, initiative |
| Member page | `/m/[handle]` | No | With/without seller section |
| Group page | `/p/.../g/[slug]` | No | 6 kinds; Shop variant for kind='business' |
| Venue page | `/p/.../l/[slug]` | No | With/without anchored business Group |
| Place page | `/p/[...slugs]` | No | Variable-depth geography |
| Following (full) | `/you/following` | Yes | Unified view: people, Groups, venues |
| Sell walkthrough | (modal/drawer) | Yes | Multi-step composer → creates biz Group |
| QR card | `/qr/[item-id]` | Yes | Printable, any Item kind |
| Thesis page | `/about` | No | Pre-auth landing + in-app about |
| Auth | `/auth/login`, `/auth/signup` | — | Route form + in-context modal form |
| Onboarding | (post-signup flow) | Yes | 3 steps: name, photo, locality |
| Hashtag | `/h/[tag]` | No | List view of tagged Items |
| Settings | `/you/settings` | Yes | Notifications, data export, sign out |

**Total day-one surface count:** 16 unique pages/flows (4 tab + 12 standalone).

---

## Surface rationale

### Home (locality feed)

The feed shows time-stamped Items scoped by the viewer's locality — events, ideas, seller updates, followed-member floats. No algorithm at b1; sort is recency + locality scope. This is the "open the app and see what's happening" surface.

**Why this shape:** The feed is locality-aware but not Location-scoped — it surfaces Items from Members whose home is nearby, plus Items at nearby Locations, plus Items from followed Members regardless of location. This is structurally different from an anonymous neighborhood feed: there is no surface that addresses "everyone in West Sac." The accountable-participation commitment is honored by absence. The feed is calm by design: no infinite scroll, no red notification badges. Pagination at 20 with "Show more" — the viewer decides when to see more, not an algorithm.

### Explore

Airbnb-style search results. Browse without authentication. Filters: kind, category, distance, schedule. Map toggle shows the same results as kind-color-coded pins. Filter state persists in the URL for shareable views.

**Why this shape:** Explore is the answer to "I'm looking for a thing." No auth wall — an unauthenticated visitor can land on `/explore`, enter a location, and reach an Item page in two taps. This serves Loop 3 (Land here) directly: a newcomer who just moved to a neighborhood and lost their network can browse everything within walking distance without signing up. The search bar is the hero CTA on this surface — no competing button. Map is a toggle, not a separate page (full-screen map defers to b2).

### Create (bottom sheet)

A bottom-sheet kind picker that opens from the Create tab. Four options at b1: Host an event, Sell a product/service, Offer a service, Float an idea. Each opens the appropriate multi-step composer.

**Why this shape:** The Create action is intentional, not ambient. A bottom sheet (not a floating button) gives the action weight — you're declaring something to your community, not posting to a feed. Auth-gated because everything you create carries your identity (identity-floor principle). The kind picker uses plain language ("Host an event" not "Create gathering item") per the naming conventions.

### You

Single tab for every Member. Profile at top, followed by horizontal scroll strips for Following (people, Groups, venues), the near-me reach control, and conditional selling-tool affordances. The selling section renders when the Member has ≥1 active kind='business' Group membership or any product/service Item — no toggle, no mode switch.

**Why this shape:** /you is a single surface, not two tabs (consumer vs producer), because every Member is the same primitive — a Person who may also do things commercially. The selling tools appear when the conditions are met, not when a mode is toggled. This avoids the identity-split that Etsy creates between "shopper me" and "seller me." The Follow scroll strips serve F042 — a glanceable "everything I follow" summary with a "More →" link to the full view. Near-me reach control is the user-facing surface for F031 — how wide the locality scope extends.

### Item pages (7 kind variants)

One structural template, varying by kind. Quiet header (no hero image at b1), title in the 26px slot, kind-specific detail rows below. The primary CTA varies by kind — Share for events at b1 (RSVP defers to b2), Follow for products/services. Every Item page has a shareable URL and a QR-card link.

**Why this shape:** Items are the platform's core primitive — everything a Person declares. One page template with kind-specific variations keeps the platform feeling like one place instead of seven apps. No reviews or star ratings anywhere — endorsements only (the brief's no-reviews principle). The quiet header (no hero image) is deliberate at b1 — photo upload defers to T2, and a text-forward layout is more honest than a placeholder image.

### Member page

A Person's public page at `/m/[handle]`. Name, photo, locality, bio, and a list of their Items. When the Member has ≥1 business Group or product/service Items, selling affordances surface (their shop, their products). Follow button is the primary CTA.

**Why this shape:** The Member page is the anchor primitive's public face. The handle is the one intentionally global namespace — it survives relocation. Selling affordances appear conditionally, not in a separate "shop page" — because a Person who makes sourdough is still a Person, not a Business. This is the people-first principle in page form: businesses are expressed as Groups people belong to, never treated as first-class actors with their own identity.

### Group page (6 kinds)

A Group's public page. Header: Group name, kind label, anchor Location (if any), member count. Content: Items posted by the Group, member list (role-visible). For kind='business' Groups, the page is the "Shop" — it shows the business's products/services, the Locally Owned badge (if claimed), and the owner banner (role-gated management strip).

**Why this shape:** Groups are emergent, not prerequisite — the page exists because people chose to form a unit. The Shop variant of kind='business' is where producer identity lives in the UI, but it's structurally a Group page with business affordances, not a separate entity. This is the "no Business entity" principle in page form. The owner banner (management widgets above the public content) means the owner always sees the real public page — no separate "manage" view that drifts from what visitors see.

### Venue page

A Location's public page. Hero image, venue name, address with distance, "Follow this venue" as primary CTA, "Host something here" as secondary. Sections: what's happening here (the venue's own Items), what's happening nearby (expandable), about.

**Why this shape:** The venue page is the physical-place primitive's public face. Follow is primary because most venue-page visitors are consuming (Loop 8 — Follow what you love). Host is secondary because most visitors aren't organizers. No reviews, no ratings — the venue's value is shown through what happens there, not through star scores. This avoids the Yelp failure pattern where aggregated anonymous reviews become the venue's identity.

### Thesis page

The oak story. Pre-auth, this is the landing page — the first thing a cold visitor sees. Post-auth, it's an in-app "about" page accessible from the footer. It explains what the platform is, why it exists, and what the oak symbolizes: a living ecosystem rooted in place, sheltering without owning, growing slowly and outward. Quercus virginiana — the wide-branching live oak — as the visual centerpiece.

**Why this shape:** The thesis page replaces a traditional "about" page because this platform has a thesis — ordinary people stepping forward where they live. The oak makes the thesis visual and visceral instead of textual. Pre-auth, it converts by conviction ("this is worth joining") not by feature-list ("here's what you can do"). Post-auth, it reminds Members why they're here — hope, agency, can-do.

### Sell walkthrough

Multi-step composer that creates a kind='business' Group. Steps: name your shop, describe it, anchor it to a Location (with inline add-new), optional Tier 0 locality claim (ZIP for Locally Owned badge). Final step promotes the Group from draft to active and redirects to the new Shop page.

**Why this shape:** The Sell walkthrough follows the DLS multi-step composer recipe exactly — bottom-anchored drawer, step dots, partial-state preservation, resume-on-return. This is the producer on-ramp (Loop 7 — Make and be found). The optional locality step means the Locally Owned badge is available but not required — no friction for makers who don't have a storefront address.

### Following (full view)

Unified view of everything the Member follows — people, Groups, venues — in one paginated list with section headers. Linked from the /you scroll strip's "More →".

**Why this shape:** F042. One place to see all your standing relationships on the platform. Follow is the only behavioral signal that matters early (per member-journey.md, Loop 8). The unified view makes the scope of the Member's engagement visible to them — not scattered across three separate lists.

### QR card

Printable card for any Item. Shows the Item's QR code (linking to its URL), the Item name, the Member/Group name, and the oak mark. Designed for print: a card the maker tapes to their booth, the organizer chalks next to a sign, the café pins by the register.

**Why this shape:** QR bridges the physical-digital gap. A stranger walking past a booth can scan the code and land on the maker's page — that's Loop 1 (Find your people) and Loop 7 (Make and be found) in one gesture. The card is printable, not shareable-as-image — it's designed for the physical world, not for social media resharing.

---

## Lo-fi wireframes

### Mobile wireframes (375px)

#### Home
```
┌─────────────────────────┐
│  🌳 Movers Makers       │  ← oak mark, top-left
│       & Shakers         │
├─────────────────────────┤
│  📍 West Sacramento ▾   │  ← locality selector
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │ [  Photo  16:9  ] │   │  ← Event card
│ │ Thu Jun 19 · 6pm  │   │
│ │ Run Club at Drake's│   │
│ │ 0.4 mi · Weekly   │   │
│ └───────────────────┘   │
│                         │
│ ┌───────────────────┐   │
│ │ 💡 Idea           │   │  ← Idea card (no photo)
│ │ Anyone want to do │   │
│ │ a clothing swap?  │   │
│ │ Sarah M. · 2 mi   │   │
│ └───────────────────┘   │
│                         │
│ ┌───────────────────┐   │
│ │ [  Photo  16:9  ] │   │  ← Product card
│ │ Sourdough loaves  │   │
│ │ River City Bread   │   │
│ │ $8 · Pickup Sat   │   │
│ └───────────────────┘   │
│                         │
│    [ Show more ]        │  ← not infinite scroll
├─────────────────────────┤
│ Home  Explore  +  You   │  ← bottom nav
└─────────────────────────┘
```

#### Explore
```
┌─────────────────────────┐
│                         │
│  ┌───────────────────┐  │
│  │ 🔍 Search near me │  │  ← search bar (bottom on
│  └───────────────────┘  │     focus, per DLS #9)
│                         │
│  [Events] [Products]    │  ← filter chips
│  [Services] [Ideas]     │
│  [< 5mi ✕] [This week] │  ← active filters
│                         │
│ ┌───────────────────┐   │
│ │ [  Photo  ]       │   │
│ │ Thursday Run Club  │   │
│ │ Drake's · 0.4 mi  │   │
│ └───────────────────┘   │
│ ┌───────────────────┐   │
│ │ [  Photo  ]       │   │
│ │ Honey from Yolo   │   │
│ │ Farmer Sarah · 3mi│   │
│ └───────────────────┘   │
│                         │
│     [List] · [Map]      │  ← toggle
│                         │
├─────────────────────────┤
│ Home  Explore  +  You   │
└─────────────────────────┘
```

#### You
```
┌─────────────────────────┐
│                         │
│  [Photo]  Don L.        │
│  West Sacramento        │
│  [Edit profile]         │
│                         │
├─────────────────────────┤
│  Following         More→│
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐   │  ← horizontal scroll
│  │AJ│ │RB│ │TM│ │..│   │     strip (people)
│  └──┘ └──┘ └──┘ └──┘   │
│                         │
│  Groups            More→│
│  ┌──┐ ┌──┐ ┌──┐        │
│  │RC│ │WS│ │..│         │
│  └──┘ └──┘ └──┘         │
│                         │
│  Venues            More→│
│  ┌──┐ ┌──┐              │
│  │Dr│ │CM│              │
│  └──┘ └──┘              │
├─────────────────────────┤
│  Near me: [——●———] 10mi│  ← reach slider
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │ 🛒 Sell           │  │  ← CTA if no biz Group
│  │ List your business│  │
│  │ Free, takes 2 min │  │
│  └───────────────────┘  │
├─────────────────────────┤
│  [Settings] [Data]      │
│  [Sign out]             │
├─────────────────────────┤
│ Home  Explore  +  You   │
└─────────────────────────┘
```

#### Venue page
```
┌─────────────────────────┐
│  ← Back                 │
│                         │
│  ┌───────────────────┐  │
│  │   [Hero photo]    │  │  ← 4:3 mobile
│  │      16:9         │  │
│  └───────────────────┘  │
│                         │
│  Drake's Brewing Co.    │  ← 26px/700
│  1933 Davis St · 0.4 mi│  ← 14px/400 muted
│  ─────────────────────  │
│                         │
│  [  Follow this venue ] │  ← primary CTA
│  [ Host something here ]│  ← secondary CTA
│                         │
├─ What's happening here ─┤
│  ┌───────────────────┐  │
│  │ Thursday Run Club  │  │
│  │ Every Thu · 6pm   │  │
│  └───────────────────┘  │
│                         │
├─ What's happening nearby┤  ← collapsed <details>
│  ▸ 3 events within 1 mi│
│                         │
├─ About ─────────────────┤
│  Craft brewery with...  │
│  Permanent · Accessible │
│                         │
├─────────────────────────┤
│ Home  Explore  +  You   │
└─────────────────────────┘
```

#### Shop page (kind='business' Group)
```
┌─────────────────────────┐
│  ← Back                 │
│                         │
│  ┌─ Owner tools ──────┐ │  ← role-gated banner
│  │ Locally Owned ✓     │ │     (owner only)
│  │ ZIP: 95605          │ │
│  └─────────────────────┘ │
│                         │
│  River City Bread       │  ← 26px/700
│  🏷️ Locally Owned      │  ← badge
│  West Sacramento        │
│  ─────────────────────  │
│                         │
│  [  Follow  ]           │  ← primary CTA
│                         │
├─ Products ──────────────┤
│  ┌───────────────────┐  │
│  │ [Photo]           │  │
│  │ Sourdough Boule   │  │
│  │ $8 · Pickup Sat   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ [Photo]           │  │
│  │ Olive Focaccia    │  │
│  │ $12 · Pickup Sat  │  │
│  └───────────────────┘  │
│                         │
├─ About ─────────────────┤
│  Artisan bakery...      │
│  📍 1933 Davis St       │
│                         │
├─────────────────────────┤
│ Home  Explore  +  You   │
└─────────────────────────┘
```

#### Thesis page (pre-auth landing)
```
┌─────────────────────────┐
│                         │
│       🌳                │  ← Quercus virginiana
│                         │     silhouette mark
│  Small acorn.           │
│  Deep roots.            │
│  Wide reach.            │
│                         │
│  A coordination layer   │
│  for collective action  │
│  in a place.            │
│                         │
│  [ See what's nearby ]  │  ← primary (→ /explore)
│  [ Sign up ]            │  ← secondary
│                         │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │ What people do    │  │  ← scroll section
│  │ here              │  │
│  │                   │  │
│  │ Host · Sell       │  │
│  │ Offer · Float     │  │
│  │ Follow · Gather   │  │
│  └───────────────────┘  │
│                         │
│  Every oak starts as    │
│  an acorn. Every        │
│  community starts with  │
│  one person stepping    │
│  forward.               │
│                         │
│  [  Sign up — free  ]   │  ← repeat CTA at bottom
│  Free, takes 2 minutes  │  ← trust microcopy
│                         │
└─────────────────────────┘
```

---

## Three open structural questions

**Q1: Create tab behavior — bottom sheet vs. dedicated route?**

I've designed Create as a bottom sheet that overlays the current surface (no route change, no navigation loss). The alternative is a dedicated `/create` route that replaces the current view. The bottom sheet feels better for mobile (preserves context, thumb-reachable, feels like a natural extension of the nav) but has implications for deep-linking — you can't share a link to "the create sheet." My recommendation is bottom sheet at b1 with a `/create` route added at b2 for deep-link support.

**Q2: Thesis page — oak illustration style?**

The Quercus virginiana silhouette is the centerpiece of the thesis page and the app mark (top-left of every screen). I see two directions: (A) a detailed botanical illustration — real, textured, naturalistic, like something from a field guide; or (B) a clean geometric silhouette — the distinctive wide-branching live oak shape reduced to a mark, like the Apple or Airbnb logo. Option B scales better (works at 16px favicon size, works in the bottom nav, works on a QR card). Option A is more emotionally resonant on the thesis page but breaks down at small sizes. My recommendation: B for the mark (used everywhere), A as a hero illustration (thesis page only).

**Q3: Map interaction depth at b1?**

The Explore surface has a list/map toggle. When the map is active, how much can the viewer do? Three options: (A) pins only — tap a pin, see a compact card, tap the card to go to the Item page; (B) pins + pan-to-search — moving the map re-queries for the visible area; (C) pins + pan-to-search + cluster expansion. My recommendation: A at b1. B and C add significant engineering and UX complexity (debounced re-queries, cluster logic, "search this area" button). The map at b1 is a visualization of the list results, not a primary discovery surface. Promote to B at b2 when map-first discovery becomes a priority.

---

## What Phase 1 will deliver (on approval)

1. **Typography system** — full scale, weight usage, line heights, heading/body/caption hierarchy
2. **Iconography** — Quercus virginiana mark + 12-icon sample in the proposed style (outlined, rounded, earthy)
3. **Spacing/grid** — 8px base unit, column grid, component spacing rules
4. **Motion principles** — transitions, micro-interactions, loading states
5. **Accessibility baseline** — WCAG 2.1 AA color contrast, focus management, touch targets, screen reader annotations
6. **Component library** — nav, cards (7 kind variants), feed item, location header, group header, profile header, follow button, RSVP control, endorsement chip, business badges, QR card template, empty states, forms, modals, toasts
7. **Hi-fi mockups** — every surface above at mobile (375px) and desktop (1280px) breakpoints, using the pistachio palette and oak mark
8. **Developer handoff** — per-screen annotations: what's a component, what's a one-off, what state is shown
