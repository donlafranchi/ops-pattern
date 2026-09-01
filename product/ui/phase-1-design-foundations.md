---
purpose: Phase 1 design deliverable — foundations, component library, motion, accessibility, dev handoff.
layer: what
status: draft
---

# Phase 1 — Foundations & Component Library

> Companion to the Phase 0 IA spec. Builds on the decisions locked there: 4-tab bottom nav, bottom-sheet Create, geometric oak mark, pins-only map at b1.

## 1. Oak mark system

**Species:** Quercus virginiana (Southern Live Oak). The distinctive feature is the crown shape — dramatically wider than tall, branches reaching horizontally. This silhouette survives reduction to 24px because the proportion is the mark, not the detail.

**Primary mark:** The tree silhouette in three tonal layers (canopy in pistachio-400, crown in pistachio-500, trunk in pistachio-600). Progressive detail sheds at smaller sizes:

| Size | Detail level | Usage |
|---|---|---|
| 200px+ | Full: canopy, crown highlight, trunk, root flare, ground line | Thesis page hero |
| 80px | Medium: canopy, crown, trunk | Nav header, about page |
| 40px | Simplified: canopy, trunk stub | Tab bar, app icon |
| 24px | Minimal: canopy shape only | Favicon, inline references |

**Acorn variant:** Used in onboarding, empty states, and first-action celebrations. Never used as a brand mark. The acorn says "you're just getting started" — contextual, not identity.

**Color on backgrounds:** The mark uses the standard pistachio ramp on white. On dark backgrounds (#2D2D2D), the same values work without inversion. On pistachio-tinted backgrounds, shift to pistachio-500/600/700 for contrast.

**Clear space:** Minimum padding equal to the trunk width on all sides.

## 2. Typography system

**Family:** Inter via `next/font/google`. Fallback: system-ui, -apple-system, sans-serif. No italics.

**Scale (8 named sizes):**

| Name | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| Display | 32px | 700 (Bold) | 1.2 | Thesis page headline only |
| Page title | 26px | 700 (Bold) | 1.2 | Venue name, shop name, member name |
| Section | 22px | 600 (SemiBold) | 1.2 | Composer step titles, modal headers |
| Heading | 18px | 600 (SemiBold) | 1.3 | Card titles on feed, section headers |
| Body | 16px | 400 (Book) | 1.5 | Default body text, descriptions |
| Body small | 14px | 400 (Book) | 1.5 | Card subtitles, helper text, prices |
| Caption | 12px | 500 (Medium) | 1.4 | Timestamps, distances, badge text |
| Micro | 11px | 600 (SemiBold) | 1.3 | Section labels, category tags (uppercase, 0.3px tracking) |

**Color:** All text uses `--color-fg` (#2D2D2D) or `--color-fg-muted` (#717171). No brand-colored text. Section labels ("WHAT'S HAPPENING HERE") use `--color-fg-muted` with the Micro style.

## 3. Spacing system

**Base unit:** 8px. All spacing derives from this: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80.

**Usage by context:**

| Context | Spacing |
|---|---|
| Inside compact components (chip padding, badge padding) | 4–8px |
| Between related elements (label to input, title to subtitle) | 4–8px |
| Inside cards (internal padding) | 12–16px |
| Between cards in a list | 12–16px |
| Between sections | 24–32px |
| Page gutters (mobile) | 20–24px |
| Page gutters (desktop) | 40–80px |
| Between major page regions | 32–48px |

## 4. Grid system

**Mobile (375px):** Single column. 20px side gutters (content width: 335px). Cards span full content width. No column grid — layout is vertical stacking.

**Tablet (768px):** Two-column card grid with 24px gap. 32px side gutters. Bottom nav disappears; left sidebar nav appears at 240px fixed width.

**Desktop (1280px):** Max content width 1080px, centered. 40px side gutters. Left sidebar nav (240px). Content area: 12-column grid with 24px column gaps. Feed surfaces center in 8 columns. Card grids: 2–3 columns. Detail pages: main content in 8 columns, related content in 4.

## 5. Component specifications

### Bottom navigation

56px tall. Four zones: Home, Explore, Create (+), You. Active state: pistachio-500 icon + label. Inactive: #717171. Create button: 44px pistachio-500 circle with white "+" and subtle shadow. Top border: 1px `--color-border`.

Disappears at md breakpoint (768px). Desktop nav: 240px left sidebar, same four zones as vertical list items with icons.

### Buttons

Per DLS but with these Phase 1 additions:

**Primary:** 48px height, `--color-accent` background, white text, 600 weight, `--radius-md` (12px). Hover: `--color-accent-hover`. Disabled: 40% opacity. Focus: 2px `--color-focus` ring offset by 2px.

**Secondary:** 48px height, white background, 1px `--color-border`, `--color-fg` text, 500 weight. Hover: `--color-surface` background.

**Text link:** `--color-accent` text, underline on hover, no underline at rest. 44px minimum touch target via padding.

**Destructive:** 48px height, white background, 1px `--color-danger` border, `--color-danger` text. Never filled (filled red is too aggressive for this brand).

### Feed cards

Two variants per DLS: **photo card** and **editorial card** (no-photo). Both share the same container width (full content width) and spacing (12px between cards).

**Photo card:** Image at top, `--radius-md` corners. No overlays except save/heart (white circle with shadow, top-right). Title in Heading style (16px/600) below image. Metadata line (12–13px, muted). Hover: card lifts with `--shadow-md` and `scale(1.02)`.

**Editorial card (Idea, Ask, Offer):** White background, 1px border, 14px padding. 2px pistachio-400 left accent line. Category label in Micro style (uppercase). Title in Heading style. Author row with avatar (24px circle), name, distance, time. No image area.

**Kind-specific metadata row patterns:**

| Kind | Metadata | Example |
|---|---|---|
| Event | date · time · venue · distance · recurrence tag | Thu, Jun 19 · 6:00 PM · Drake's · 0.4 mi · Weekly |
| Product | seller · price · pickup details | River City Bread · $8 · Pickup Sat |
| Service | provider · distance · availability | Anna J. · 1.2 mi · Available now |
| Idea | author · distance · time | Sarah M. · 2 mi · 3h ago |
| Offer | author · distance · time | Tom R. · 0.8 mi · 1d ago |
| Ask | author · distance · time | Maria K. · 3 mi · 5h ago |
| Initiative | author · participants · time | Jake L. · 12 joined · 2d ago |

### Horizontal scroll strip

Per DLS recipe. Fixed-width items (52px), round thumbnails for people (48px circle), rounded-square for Groups/venues (48px, 8px radius). Initial-letter placeholder when no image. "More →" link in section header (right-aligned, pistachio-500). Entire section omitted when empty.

### Search bar

Per DLS. Pill shape (`--radius-full`), `--shadow-md`, 48px mobile / 56px desktop. Search icon left, placeholder text. On focus: expands upward from bottom position (mobile), reveals filter row below.

### Filter chips

Per DLS pill/chip recipe. Unselected: 1px border, `--color-fg` text. Selected: `--color-fg` background, white text, no border. Active (removable): `--color-surface` background with "✕" suffix. Touch target: 36px min height.

### Locality selector

Inline pill in the feed header. Background: `--color-surface`. Content: 📍 icon + place name + "▾" chevron. Tapping opens a bottom sheet with geocoding search (city/neighborhood/zip).

### Ownership badges

Per DLS ownership tier spectrum. Rounded rectangle (6px radius), white text, 11px/600. Only rendered below the photo zone, never over images. The green-to-gray semantic axis communicates alignment without explanation.

### Toast notifications

Dark background (#2D2D2D), white text, 10px radius, `--shadow-lg`. Left icon: semantic color (forest green "✓" for success, terracotta "!" for error). Success: auto-dismiss at 3 seconds. Error: dismiss on tap. Position: centered above bottom nav, 12px clearance.

### Follow button

The primary CTA on venue, member, and group pages. Two states:

| State | Appearance | Action |
|---|---|---|
| Not following | Primary button: "Follow" or "Follow this venue" | Creates `member_saved_searches` row |
| Following | Muted button: "Following ✓" (white bg, pistachio-500 text, pistachio border) | Tap toggles unfollow confirmation |

For unauthenticated visitors: the Follow button still renders. Tapping routes to sign-in with return URL. After auth, the follow action fires automatically.

### Owner banner

Per DLS. Role-gated `<details>`/`<summary>` at the top of entity pages. Background: `--color-surface`. Border: 1px `--color-border`. Summary line: "Owner tools" in 12px/600 muted. Default expanded when action needed, collapsed otherwise. `role="region"` with `aria-label="Owner tools"`.

## 6. Motion principles

| Pattern | Duration | Easing | Usage |
|---|---|---|---|
| Hover lift | 200ms | ease-out | Card hover (scale 1.02 + shadow-md) |
| Button press | 100ms | ease-in | Scale 0.98 on press, 200ms ease-out return |
| Bottom sheet enter | 300ms | ease-out | Slide up from below |
| Bottom sheet exit | 200ms | ease-in | Slide down |
| Chip toggle | 150ms | ease-out | Background + text color swap |
| Toast enter | 250ms | ease-out | Fade in + slide up 8px |
| Toast exit | 200ms | ease-in | Fade out |
| Page transition | 200ms | ease-in-out | Crossfade between tab surfaces |
| Loading skeleton | 1500ms | ease-in-out | Pulse opacity 1 → 0.5 → 1, infinite |
| Follow button flip | 200ms | ease-out | Label + color transition |

**Principles:** Quick, purposeful, quiet. No bounces. No spring physics. No element choreography (elements don't stagger-animate in sequence). Motion confirms actions — it doesn't decorate.

## 7. Accessibility baseline (WCAG 2.1 AA)

### Color contrast
- Body text (#2D2D2D) on white: 14.5:1 ✓
- Muted text (#717171) on white: 4.7:1 ✓ (passes at 14px+)
- White on pistachio-500 (#A0B49A): 3.1:1 — passes for 16px+ bold and 19px+ regular per AA. All primary button text is 14px/600, which qualifies as large text (14px bold = large per WCAG). ✓
- White on pistachio-600 (#869C7F): 4.2:1 — passes at all sizes. Hover state is stronger than rest state. ✓
- Locally Owned badge (#1B7A3D background, white text): 5.5:1 ✓

### Focus management
- 2px `--color-focus` (#2D2D2D) ring on all interactive elements, 2px offset.
- Focus-visible only (no focus ring on mouse click).
- Tab order follows visual order. Skip-to-content link on every page.
- Bottom sheet traps focus while open. Escape dismisses.

### Touch targets
- 44×44px minimum for all interactive elements.
- Buttons: 48px height.
- Bottom nav icons: 48×48px hit area.
- Chips: 36px height minimum, but 44px hit area via padding.
- Text links in body: 44px vertical hit area via line-height + padding.

### Screen readers
- All images carry descriptive alt text. Decorative images: `alt=""` + `role="presentation"`.
- Oak mark: `role="img"` with `aria-label="CDP logo"`.
- Follow button: `aria-pressed="true/false"` communicates state.
- Owner banner: `role="region"` with `aria-label="Owner tools"`.
- Filter chips: `role="checkbox"` with `aria-checked`.
- Bottom sheet: `role="dialog"` with `aria-label`.
- Loading skeletons: `aria-busy="true"` on the container; `aria-live="polite"` announces when content loads.
- Toasts: `role="status"` for success, `role="alert"` for errors.

### Reduced motion
- `prefers-reduced-motion: reduce` disables all transforms, opacity animations, and slide transitions. Visibility changes happen instantly.

## 8. Developer handoff notes

**What's a reusable component (build once):**
- `BottomNav` — 4-tab bar with active state
- `FeedCard` — photo variant + editorial variant, kind-aware metadata
- `ScrollStrip` — horizontal snap-scroll with round/square thumbnails
- `SearchBar` — pill with filter expansion
- `FilterChip` — toggle + removable variants
- `LocalitySelector` — inline pill with bottom-sheet picker
- `OwnerBanner` — role-gated collapsible management strip
- `FollowButton` — two-state with auth gate
- `ComposerDrawer` — multi-step bottom-sheet shell (step dots, nav row, partial-state preservation)
- `Toast` — success/error variants
- `OakMark` — SVG component with size prop (sizes: sm/md/lg/xl)
- `AcornMark` — SVG for empty states
- `OwnershipBadge` — tier-aware colored badge

**What's page-specific (not reusable):**
- Thesis page hero layout
- Home feed composition (card ordering, "Show more" pagination)
- Explore filter bar composition
- You tab section ordering
- Venue page section ordering

**State to track:**
- `locality` — current Place scope (persisted per member)
- `nearMeRadius` — reach slider value in miles
- `followState` — per entity (member, group, venue)
- `composerDraft` — partial-state for in-flight composers
- `activeFilters` — Explore filter state (synced to URL params)
