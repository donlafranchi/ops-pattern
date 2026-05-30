---
id: what-design-language
purpose: Design tokens, component recipes, CTA patterns.
layer: what
status: active
---

# Main Street DLS

> Neutral chrome + photography + one civic accent. The chrome shuts up so the content speaks.

## Principles

1. **One accent color.** Civic green (`#1B7A3D`) is reserved for primary CTAs and the brand mark. Ownership tier colors live only on badges — never on buttons, links, or backgrounds.
2. **Hairlines over shadows.** Separation comes from 1px borders. Shadows are reserved for hover lift and overlays.
3. **Photography is the surface.** Cards are quiet (no border at rest, no shadow at rest) so images do the emotional work.
4. **Generous whitespace.** 24px page gutters mobile, 40–80px desktop. Components breathe.
5. **One typeface, restrained scale.** Inter, Book/Medium/Bold only. Type scale tops out at 32px in product surfaces.
6. **Bottom-anchored, thumb-reachable.** All primary controls anchor to the bottom of the viewport. Search bar at the bottom expands upward on focus; detail cards slide up from below; nav (when present) sits at the bottom. No top-anchored toolbars or search fields. Mobile-first; desktop adapts but is not the priority. Follow Google Maps / Apple Maps interaction patterns so users are instantly familiar.

## Tokens

### Color

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F7F6F2` | Subtle surface (raised sections, hover) |
| `--color-fg` | `#1A1A1A` | Body text |
| `--color-fg-muted` | `#6B6B6B` | Secondary text, captions |
| `--color-border` | `#E5E3DD` | Hairline separators |
| `--color-accent` | `#0FAB8E` | Primary CTA, brand mark — "Tide" Caribbean green |
| `--color-accent-hover` | `#0A8A72` | CTA hover |
| `--color-accent-tint` | `#E8F7F2` | Soft accent surface (banner backgrounds, hover wash) |
| `--color-focus` | `#1A1A1A` | Focus ring (2px) |

### Ownership tier spectrum (badges + map pins only)

A single semantic axis: **green = local, gray/black = extractive.** Saturation and lightness encode alignment.

| Tier | Hex | Position |
|---|---|---|
| coop | `#0E6B2E` | Most aligned (worker/member owned) |
| independent | `#1B7A3D` | Locally owned & operated |
| mission-driven | `#5A8F66` | B Corp / PBC |
| local-franchise | `#97A89A` | Local owner, national brand |
| challenger | `#B0B0B0` | Pro-competition national |
| pe-corporate | `#2A2A2A` | Extractive — PE / corporate |

Listings tagged `pe-corporate` carry `data-extractive="true"`, which applies `grayscale(0.6)` + `opacity 0.78` so Wall Street fades into the background. Hovering restores full color (the user can still see the listing clearly when they choose to).

### Typography

- Family: **Inter** via `next/font/google`, fallback to system sans.
- Weights: 400 (Book), 500 (Medium), 700 (Bold). No italics.
- Scale (px): 12 / 14 / 16 / 18 / 22 / 26 / 32.
- Body line-height: 1.5. Heading line-height: 1.2.

### Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | Inputs, small chips |
| `--radius-md` | 12px | Cards, buttons, images |
| `--radius-lg` | 16px | Modals, sheets |
| `--radius-full` | 9999px | Pills, search bar, filter chips |

### Shadow

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle lift |
| `--shadow-md` | `0 6px 16px rgba(0,0,0,0.12)` | Card hover, search bar, sheets |
| `--shadow-lg` | `0 12px 32px rgba(0,0,0,0.16)` | Modals |

### Motion

- Hover transitions: 200ms ease-out.
- Cards lift on hover: `transform: scale(1.02)` + `--shadow-md`.
- Links: underline on hover, no color change.

## Component recipes

### Button — primary
- Bg `--color-accent`, text white, radius `--radius-md`, height 48px, weight 500.
- Hover: bg `--color-accent-hover`. Focus: 2px dark ring.

### Button — secondary
- Bg white, 1px `--color-border`, text `--color-fg`, radius `--radius-md`, height 48px, weight 500.
- Hover: bg `--color-surface`.

### Card
- Bg white, no border, no shadow at rest. Image uses `--radius-md` corners.
- Title 16px/500. Subtitle 14px/400 muted. Optional price 14px/600.
- Hover: `--shadow-md` + slight scale.

### Pill / chip
- Radius `--radius-full`, 1px `--color-border`, padding `8px 14px`, 14px text.
- Selected: bg `--color-fg`, text white, no border.

### Search bar
- Single white pill with `--shadow-md`. Internal sections separated by 1px dividers, not gaps.
- 56px tall on desktop, 48px on mobile.

### Input
- Radius `--radius-sm`, 1px `--color-border`, 12px padding.
- Focus: 2px `--color-focus` ring, no color change to border.

### Recurrence picker
A friendly UI for the Member to express a repeating schedule. The picker emits an [RFC 5545 RRULE](https://www.rfc-editor.org/rfc/rfc5545) string, which is what the schema stores (`item_gatherings.recurrence_rule`). The Member never sees the RRULE.

**Inputs the picker presents to the Member:**
- **Frequency** — segmented control: `Once` / `Daily` / `Weekly` / `Monthly`. Default `Weekly` when invoked from the gathering composer; `Once` for one-time events.
- **Day(s)** — visible only when frequency is `Weekly`. Pill row of `Sun Mon Tue Wed Thu Fri Sat` (multi-select); the Member can pick one or more days.
- **Time** — single time input (24h on desktop, native time picker on mobile). Defaults to the current hour rounded up.
- **Until** — radio: `Ongoing` (no end date) or `Until [date]`. Default `Ongoing` for recurring; not shown for `Once`.

**Output:**
- The component emits both the RRULE (for the schema) and a human-readable preview line that it renders below the inputs in `--color-fg-muted`: e.g., *"Every Thursday at 6:00 PM"* or *"Every Tue and Thu at 5:30 PM, until Jun 30."* The preview is what the Member visually verifies.

**Layout:**
- All inputs stack vertically inside whatever container invoked the picker (drawer, modal, or inline form section). Width fills the container.
- Spacing: 16px between rows. The preview line sits 8px below the last input.

**Validation:**
- For `Once` and the first occurrence of any recurring rule, the resolved start datetime must be ≥ now + 5 minutes. Past times produce an inline error: *"Start time is in the past."*
- For `Weekly`, at least one day must be selected.

**Reuse:**
- This component is the canonical recurrence input across all composers that need scheduling (gathering today, future class series, future recurring offers). Do not invent a second one. If a new composer needs scheduling fields the current picker doesn't cover (e.g., monthly-on-the-second-Tuesday), extend this picker — don't fork it.

## CTA placement patterns

Modeled on Airbnb's two-audience pattern (guest + host). Main Street has two member types — **shoppers** (consumers) and **producers** (vendors/businesses) — and signup is the #1 product goal.

### 1. Persistent top-right primary
- Logged out: `[Sign up]` (filled accent) + `[Log in]` (text link)
- Logged in: avatar / "You" entry
- Always visible — never more than one click from converting a browser

### 2. Two-track parallel entry
Producer onboarding gets its own persistent slot in the nav, visually quieter than consumer signup so they never compete.
- Quiet form: text link `List your business →` next to Sign up
- Loud form: full-width editorial section at the bottom of Home / Explore (photo + headline + primary CTA)

### 3. Progressive commitment (peak-intent signup)
Don't ask for signup before the user has felt value. Gate at the moment of intent.
- Browse map / view listings → free, no auth
- **Tap Support / Follow / Save** → opens an auth-gate modal with contextual copy: "Sign up to support [Vendor]"
- This converts engaged users at the moment they want to commit, not before

### 4. One primary per screen
Only one accent-filled button visible at a time. Everything else is `secondary` (white + border) or text link. Two competing primaries is a smell.

### 5. Sticky mobile CTA on profiles
Business and vendor profile pages render the primary action (Support / Follow) sticky at the bottom on mobile, above the BottomNav. Same pattern as Airbnb's reserve bar.

### 6. Hero CTA = the search bar
On Explore, the search bar IS the primary CTA. No competing button. Keeps the surface calm.

### 7. Trust microcopy adjacent to primary CTAs
Place a friction-remover line directly under or next to a primary CTA: "Free, takes 2 minutes" / "No fees, ever" / "You keep every customer." Airbnb pairs CTAs with trust phrases like "Free cancellation."

### 8. Auth modal vs auth route
Use a modal for in-context auth gating (Follow, Support, Save). Use the full `/auth/login` route only for cold starts (clicking Sign in from nav). Modals preserve the user's place; routes lose it.

### Anti-patterns (don't do)
- Two filled-accent buttons side-by-side
- Primary buttons in destructive contexts (delete, remove) — use bordered red instead
- Routing to `/auth/login` from a card action — always modal at peak intent
- Producer recruitment as the loudest CTA on the homepage — it's a smaller audience; consumer signup wins the visual hierarchy

## Surface patterns

Surfaces are pages or recurring page-region templates. Each surface fixes header layout, primary-CTA placement, and the components allowed in its primary scan zone, so the same kind of page feels the same everywhere.

### Venue page (`/l/[slug]`)

The page anyone lands on for a Location — Drake's, the brewery, the community garden, the library. Anonymous-readable. The host's pre-arrival surface; the public face of a place.

**Header (top of page).**
- Hero image — 16:9 on desktop, 4:3 on mobile. `--radius-md` corners. No border, no shadow. Photography-first per design principle #3.
- Venue name in the 26px / 700 type slot.
- Address in 14px / 400 muted, single line. Distance from the viewer (if locality is set) appears on the same line, separated by `·`.
- Hairline (`--color-border`, 1px) below the address row.

**Primary CTA — below the header, above any content sections.**
- Single primary-accent button using the `Button — primary` recipe (height 48, `--color-accent`). One per page (per CTA placement pattern #4).
- Default copy: **"Host something here"**. The label is verb-first and surface-anchored; the user is at *this venue*, intending to do *something here*.
- Tapping invokes the gathering composer drawer (per the gathering-host capability) with the venue pre-attached as the location.
- For unauthenticated visitors: the CTA still renders; tapping routes to `/sign-in?return=/l/[slug]&action=host`. After auth, the composer opens with the venue pre-attached.
- Above the fold on mobile (~640px viewport). Verifiable via snapshot test.

**Sections below the CTA (in order):**
1. **What's happening here** — list of `kind=gathering` Items at this venue with `next_occurrence` ≤ 30 days, sorted by next occurrence. Empty state: *"Nothing scheduled here yet. Be the first."* with a quiet inline link back up to the primary CTA.
2. **About** — venue description, hours, contact, optional link to the venue's external site.
3. **Items here** — Items of other kinds attached to this Location (products available for pickup here, services that operate here).

**What this surface does not have:**
- Two competing primary CTAs. The "Host something here" button is the one primary on the page.
- Producer-recruitment copy. This surface is for hosts and visitors, not for venue-owner onboarding (that's a separate flow).
- Reviews or ratings (per `principles.md`'s no-reviews stance).

### Other surfaces (cross-reference)

- **Member page (`/m/[handle]`)** — the Member's public page (per [`../systems/member.md`](../systems/member.md)); when the Member has ≥1 active kind='business' Group membership OR any kind='product'/'service' Item (per ADR-12 SUPERSEDED 2026-05-12), the page surfaces selling-tool affordances. Header layout follows the same pattern: hero image → name → tagline → primary CTA below the header (label varies by Member context — *"Drop something now"* for irregular Sellers, etc.). The kind='business' Group page (`/g/[slug]`) follows the same pattern with Group identity as the header anchor (per [`../systems/groups.md`](../systems/groups.md)).
- **Item pages (kind-specific URLs: `/e/[slug]` Event · `/p/[slug]` Product · `/s/[slug]` Service · `/i/[slug]` Idea · `/o/[slug]` Offer · `/a/[slug]` Ask · `/initiative/[slug]` Initiative — per [`../../CLAUDE.md`](../../CLAUDE.md) § Naming)** — quiet header (no hero image at b1; reserved for T2 photo-upload), with title in the 26px slot, kind-specific detail rows below. Primary CTAs vary by kind (RSVP for gathering at b2, Follow for product, etc.). At b1 the primary action on a gathering Item is the Share-link affordance.
- **Hashtag page (`/h/[hashtag]`)** — list view of Items carrying that hashtag. No hero. No primary CTA — the search bar at the top is the primary surface (per pattern #6).

## Decisions encoded here

This file is the live home for the following architectural decision. See [`../../planning/DECISIONS.md`](../../planning/DECISIONS.md) for the cross-cutting register; this spec's Principles section *is* the load-bearing ratification.

| ADR | Status | What lives here |
|---|---|---|
| ADR-2 | Accepted | Bottom-anchored, mobile-first, thumb-reachable UI. Primary controls anchor to the viewport bottom; search bar expands upward; detail cards slide up; nav (when present) sits at the bottom. No top-anchored toolbars or search fields. Mobile-first; desktop adapts but is not the priority. Follow Google Maps / Apple Maps interaction patterns. See Principles #6 and Surface patterns throughout. |
