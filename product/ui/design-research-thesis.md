---
purpose: Design research thesis — structural foundation, palette, navigation, spacing, and PWA patterns for the wireframe revision.
layer: what
status: active
---

# Design Research Thesis

> Airbnb as structural DNA. Charcoal + pistachio. Three tabs. Breathing room. This document is the brief for revising the Phase 0 wireframes — specific enough to design against, grounded in research.

## 1. Airbnb as structural foundation

Airbnb is the right structural ancestor for this app. Not because we're a marketplace (we're a coordination layer), but because Airbnb solved the same core UX problem: browse beautiful things in places, with locality as the organizing principle. The app's 2025 redesign — rebuilding around three pillars (Homes, Experiences, Services) — proves the pattern scales beyond one category.

### What to steal

**The search-forward header.** Airbnb's mobile Explore surface puts a compact search pill at the top of the viewport — location on the left, a subtle divider, and a filter-sliders icon on the right. The search bar *is* the hero CTA on any browse surface. No competing buttons, no visual noise above the content. The location selector sits inside or adjacent to the search bar, not as a separate component — one line, one tap to refine. Our Explore page should mirror this: compact search pill at the top with the location name visible, a filter icon (three-slider glyph) to the right, and nothing else in that row.

**Photography as the design.** Airbnb never puts UI chrome over photos — no colored pills, no gradient overlays, no badges on images. The save/heart icon is the only overlay, rendered as a white stroke with a subtle shadow so it reads on any background. Our DLS already encodes this (Principle #4: photography is sacred). The thesis reinforces it: the photo *is* the card. Everything else lives in the text zone below.

**The one-primary rule.** Only one accent-filled button per screen. Everything else is secondary (white + border) or a text link. Airbnb enforces this ruthlessly — the Reserve button on a listing page is the single visual anchor. Our DLS has this as CTA pattern #4; the wireframe revision should audit every screen for violations.

**Hairline separators, not shadows.** Airbnb uses 1px `#EBEBEB` dividers between content sections. Shadows are reserved for elevated surfaces (search bar, modals, bottom sheets). Our DLS already specifies this, but the wireframes need to make separator placement explicit — every section boundary gets a hairline, every card boundary gets whitespace, and the two never substitute for each other.

**The sticky bottom CTA bar.** On detail pages (listing, experience), Airbnb anchors the primary action to the bottom of the viewport in a thin strip — price on the left, Reserve button on the right, with a hairline separator above. Our venue page and shop page should use this pattern for Follow: a sticky strip at the bottom with the Follow button and trust microcopy, separated from the content above by a hairline.

### What to adapt

**Category browsing.** Airbnb's horizontal icon-category row (Beachfront, Cabins, Treehouses) was a signature pattern — they removed it in April 2025 to make room for their Services expansion. We should learn from the pattern but not replicate it: our kind-filter chips (Events, Products, Services, Ideas) serve the same function but should live as scrollable pills anchored to the bottom of the Explore viewport, above the bottom nav — not at the top competing with the search bar. This is the user's feedback verbatim: "the pills should be at the bottom not top."

**Three-pillar organization.** Airbnb restructured around Homes / Experiences / Services as top-level navigation pillars. We don't need pillars — our taxonomy is flatter (everything is an Item with a `kind`). The kind-filter pills on Explore do the same work without the structural overhead. Don't import the pillar pattern; it solves a multi-product problem we don't have.

### What to skip

**The super-app trajectory.** Airbnb's 2025 redesign leans into being a super-app — booking stays, services, and experiences in one place. The visual language followed: 3D skeuomorphic icons, Pixar-inspired depth, animated transitions. This is the opposite of our brand. We are Are.na-calm, not Airbnb-animated. Skip the dimensional icons, the spring physics, the playful illustration system. Our motion principles are "quick, purposeful, quiet — no bounces."

**Modal-heavy flows.** Airbnb's search expansion (tapping the search bar opens a full-screen modal with stepped inputs) is engineered for a complex booking query (location + dates + guests + price). Our search is simpler — location + kind + distance. A bottom-sheet expansion or inline filter reveal is proportionate to our query complexity. Don't import the full-screen search takeover.

**The guest/host split.** Airbnb separates guest and host into different app modes (the "Switch to hosting" toggle). We explicitly reject this split — the DLS and `member.md` encode that every Person is one primitive, with selling tools appearing conditionally. Don't import mode-switching.

---

## 2. Three-item bottom nav

The user's feedback is clear: "I prefer odd number items instead of even. So 4 at the bottom doesn't work and 5 is too many." Three tabs.

### Why three works

The research supports this. Bottom navigation best practices recommend 3-5 destinations, with 3 being the minimum for a consumer app. Three tabs mean larger touch targets (the full width divided by three gives ~125px per zone on a 375px screen, well above the 44px minimum), less cognitive load, and a visually balanced bar. The odd number creates a natural center point — the eye rests on the middle tab.

Three-tab examples in the wild: Google Maps (Explore, Go, Saved), Apple Weather (single-surface with tab-like segmented control), and numerous utility apps. The pattern reads as focused and confident — this app knows what it is.

### Which three

**Home · Explore · You.**

These are the three irreducible surfaces:

- **Home** — "What's happening near me." The locality feed. The ambient surface a Member opens every day. Answers: what's new, what's coming up, who's doing what nearby.
- **Explore** — "I'm looking for a thing." The search-forward catalog. The surface a newcomer or a curious browser uses. Answers: what exists in this place.
- **You** — "My stuff." Identity, follows, Groups, selling tools, settings. The only auth-gated tab. Answers: who am I here, what am I connected to.

Home and Explore are the two modes of engagement (ambient vs. intentional). You is the identity anchor. Every other surface in the app is reachable from one of these three — a venue page is a tap from Explore or Home, a Group page is a tap from You or Explore, the thesis page is a link from the footer or the pre-auth landing.

### What about Create?

Create is not a tab. It's an action, and actions don't belong in navigation.

The Phase 0 wireframes put Create as a fourth tab (the "+" icon in the bottom bar). The user's feedback — "the plus button is very much out of place at the bottom" — confirms the instinct: a persistent Create button in the nav bar implies the app is about creating content. This app is about coordination. Most Members, most of the time, are browsing and following — not creating. The Create action should be available but not omnipresent. See §6 for where it goes.

### Visual treatment

The bottom nav should be the quietest structural element on screen. Airbnb's approach: icon + label for each tab, active state in the brand color, inactive in a muted gray. No background fills, no pills behind the active tab. A single 1px hairline at the top of the bar separates it from the content.

Recommended spec:

- **Height:** 52px (slimmer than the Phase 1 spec's 56px — save 4px of content area; Airbnb uses ~50px).
- **Icon size:** 24px outlined icons, 1.5px stroke weight.
- **Label:** 10px/500 (Inter Medium), 4px below the icon.
- **Active state:** Icon and label in `--color-charcoal` (#3C3C3C) — the new dark anchor, not pistachio. Active icon transitions to filled variant.
- **Inactive state:** Icon and label in `--color-fg-muted` (#717171).
- **Top border:** 1px `--color-border` (#EBEBEB).
- **Background:** White (#FFFFFF), no blur, no transparency.
- **Safe area:** Bottom padding respects `env(safe-area-inset-bottom)` for PWA standalone mode on notched devices.

Why charcoal for the active state instead of pistachio: the "paucity of color" principle. The nav bar is structural — it should communicate state (which tab am I on?) without drawing the eye. A dark charcoal active icon is unambiguous but quiet. Pistachio is reserved for CTAs and brand moments. If the nav bar uses pistachio, the accent loses its power by appearing on every screen at all times.

---

## 3. Charcoal + pistachio palette

The user's feedback: "Add a charcoal to complement the pistachio green" and "We want simplicity and a paucity of color use."

### The principle

One accent color (pistachio), one anchor neutral (charcoal), and white. That's the entire palette for product surfaces. Everything else — semantic colors for system feedback, the ownership tier spectrum — exists as a system resource but never touches the core browse-and-follow experience.

This mirrors the best minimal app palettes: Stripe uses monochrome (#061b31 on #ffffff) with a single purple (#533afd) for interactive elements. Linear uses near-black text on white with a single blue for active states. The research confirms: "minimalist palettes pair best with neutrals plus one deep anchor, giving clarity and enough contrast to create hierarchy."

### Charcoal definition

Charcoal is not `#2D2D2D` (the current `--color-fg`). It's a distinct, warmer dark that sits between black and medium gray — structured enough for text, soft enough to avoid the harshness of near-black on white screens for hours of reading.

Recommended values:

| Token | Hex | Role |
|---|---|---|
| `--color-charcoal-900` | `#2B2B2B` | Headings, primary text — replaces current `--color-fg`. The anchor. |
| `--color-charcoal-700` | `#3C3C3C` | Active nav icons, active chip fill, secondary emphasis. |
| `--color-charcoal-500` | `#555555` | Tertiary text, icon default states. |
| `--color-charcoal-300` | `#8A8A8A` | Placeholder text, disabled states. |
| `--color-charcoal-100` | `#E8E8E8` | Hairline borders (slightly warmer than the current #EBEBEB). |
| `--color-charcoal-50` | `#F5F5F5` | Subtle surface backgrounds — hover states, editorial card fills. |

The existing pistachio ramp remains unchanged. The charcoal ramp replaces the scattered gray values (the current `--color-fg`, `--color-fg-muted`, `--color-border`, `--color-surface`) with a unified tonal family. The result: every neutral in the app belongs to one charcoal scale, and every accent belongs to one pistachio scale. Two families, no orphans.

### Usage discipline — the paucity rule

"Paucity of color" means pistachio appears on a screen in at most two places: (1) the primary CTA button fill, and (2) one accent mark (a brand line, the oak mark, or a selected-state indicator). If pistachio appears in three or more roles on a single screen, one of them is wrong.

Charcoal carries the structural weight: text, icons, borders, active nav state, chip fills. White carries the spatial weight: backgrounds, card surfaces, breathing room. Pistachio carries the intentional weight: "tap this," "this is the brand," "this is where your eye should land for the action."

Screen-by-screen audit rule: screenshot any screen, desaturate it. If the hierarchy is still clear in grayscale, the color usage is correct. If you can't tell what's primary without the pistachio, the layout is doing too much work with color and not enough with typography and spacing.

### Contrast verification

- Charcoal-900 (#2B2B2B) on white: ~14:1 — exceeds AA at all sizes.
- Charcoal-700 (#3C3C3C) on white: ~10.5:1 — exceeds AA at all sizes.
- Charcoal-500 (#555555) on white: ~7.5:1 — exceeds AA at all sizes.
- Charcoal-300 (#8A8A8A) on white: ~3.5:1 — passes AA for large text only. Use for placeholder/disabled only (never body text).
- White on pistachio-500 (#A0B49A): 3.1:1 — passes for 16px+ bold (our button text is 14px/600 which qualifies as large text per WCAG). Unchanged.

---

## 4. Spacing and breathing room

The user's feedback: "We want separators and spacing and breathing room."

### Philosophy

Breathing room is not the absence of content — it's the presence of intention. Every gap in the layout is a decision about what groups together and what doesn't. The three reference apps — Airbnb, Linear, Stripe — all use spacing as their primary hierarchy tool, not color or weight.

Linear's approach is instructive: they tested configurations ranging from very condensed to spacious, settling on an 8px base scale (8, 16, 32, 64). Stripe sticks to a strict 4px/8px grid — no custom values like 10px or 18px. Both prove that a constrained spacing scale, used consistently, creates the "polished, airy feel" without any individual gap being large. It's the consistency that reads as spacious, not the absolute size.

### The spacing scale (revised)

Keep the 8px base unit. Remove the 4px and 12px steps for most product surfaces — they create density. The revised scale for page-level layout:

| Step | Value | Usage |
|---|---|---|
| xs | 8px | Inside compact elements (chip padding, badge internal, icon-to-label). |
| sm | 16px | Between related elements (title to subtitle, label to input, icon to text in a row). |
| md | 24px | Inside cards (internal padding). Between cards in a list. Page side gutters (mobile). |
| lg | 32px | Between content sections on a page. Below section headers. |
| xl | 48px | Between major page regions (e.g., hero to first section, last section to footer). |
| 2xl | 64px | Page top/bottom padding. Desktop side gutters. |

The key change from Phase 1: the minimum gap between cards goes from 12px to 24px. The minimum gap between sections goes from 24px to 32px. These are the two adjustments that create the most visible breathing room.

### Separator pattern

Three types of separation, used in strict hierarchy:

1. **Whitespace only** (most common). Between cards in a feed, between items in a list, between components in a section. The gap *is* the separator. No line needed. Use the spacing scale above.

2. **Hairline** (structural boundaries). Between page regions — the header and the content, the content and the bottom nav, the search bar area and the results, each section of a detail page. 1px `--color-charcoal-100` (#E8E8E8), full bleed (edge to edge, no gutters). Hairlines say "this is a different zone."

3. **Section header** (content boundaries within a page). A text label in the Micro style (11px/600, uppercase, `--color-charcoal-500`, 0.3px tracking) with 32px above it and 16px below it. Section headers say "here's a new group of content." Examples: "WHAT'S HAPPENING HERE" on a venue page, "FOLLOWING" on the /you page, "EVENTS" in an Explore filter view.

What this means concretely: the Phase 0 wireframes use `├─────────────────────────┤` lines between sections. In the hi-fi revision, most of those become 32px whitespace gaps with a section header. Only the structural boundaries (header-to-content, content-to-nav, CTA strip) get hairlines.

### Card spacing

Photo cards: 24px vertical gap between cards. No horizontal border, no shadow at rest. The card is just a photo + text block floating in white space. The whitespace between cards is what makes each card feel like a distinct object — not a border or a shadow.

Editorial cards (no photo): 24px vertical gap. 1px `--color-charcoal-100` border. 24px internal padding. The border distinguishes editorial cards from the surrounding whitespace because without a photo, the card boundary is ambiguous.

### Page gutters

Mobile: 24px side gutters (increased from 20px in Phase 1 — an extra 4px per side doesn't lose content but adds perceptible air). Desktop: 48-64px. The content never touches the screen edge.

---

## 5. Explore page — bottom pills, top-right location + search/filter

The user's feedback: "For explore the pills should be at the bottom not top" and "The location should need off to the right top along with a search with filter button etc like Airbnb."

### Top zone: search + location + filter

The Explore page header should mirror Airbnb's compact search structure:

```
┌──────────────────────────────────────┐
│  📍 West Sacramento    🔍  ⫸ Filter │
└──────────────────────────────────────┘
```

One row. Three elements:

1. **Location pill** (left). The current locality — "West Sacramento" or "Near me" for geolocation. Tapping opens a bottom-sheet location picker (the existing Locality Selector component). The 📍 icon is a visual anchor; the place name is the readable label.

2. **Search icon** (center-right). A magnifying glass. Tapping expands the search bar (either inline expansion or a bottom-sheet with a text input + recent searches). The search icon is the affordance; the expanded state is the input.

3. **Filter button** (right). The three-slider icon (Airbnb's established pattern — universally recognized as "filters"). Tapping opens a bottom-sheet with the full filter set: kind, distance, schedule, sort. A dot indicator on the filter icon when filters are active.

This row is sticky — it stays at the top as the user scrolls results. It's compact (48px height), separated from the results below by a hairline.

### Bottom zone: kind-filter pills

The kind-filter pills (Events, Products, Services, Ideas, Offers, Asks) anchor above the bottom nav, not below the search bar. This is a departure from the standard pattern (most apps put filter chips below the search bar at the top of the results area), and it's the right call for this app:

**Why bottom:** Thumb reachability. The pills are a frequent-tap interaction — the user switches between kind views often. Anchoring them to the bottom puts them in the natural thumb zone. The top of the screen is for orientation (where am I, what am I searching for); the bottom is for manipulation (tap to change the view). This follows the DLS Principle #9 (bottom-anchored, thumb-reachable) and the Google Maps / Apple Maps pattern where mode-switching controls sit at the bottom.

**Implementation:** A horizontally scrollable pill row, 44px tall, anchored just above the bottom nav bar. The row has its own 1px hairline top border to separate it from the results above. Selected pill: `--color-charcoal-700` fill with white text. Unselected: white fill with 1px `--color-charcoal-100` border, `--color-charcoal-900` text. An "All" pill at the far left (default selection) shows the unfiltered view.

**Scroll behavior:** The pills remain fixed at the bottom while the results scroll behind them. The results area occupies the space between the top search row and the bottom pill row. This creates a clean sandwich: orientation at the top, content in the middle, manipulation at the bottom.

### Revised Explore wireframe

```
┌─────────────────────────┐
│ 📍 West Sac    🔍  ⫸   │  ← sticky top: location + search + filter
├─────────────────────────┤
│                         │
│ ┌───────────────────┐   │  ← scrollable results
│ │ [  Photo  ]       │   │
│ │ Thursday Run Club  │   │
│ │ Drake's · 0.4 mi  │   │
│ └───────────────────┘   │
│                         │
│ ┌───────────────────┐   │
│ │ [  Photo  ]       │   │
│ │ Honey from Yolo   │   │
│ │ Farmer Sarah · 3mi│   │
│ └───────────────────┘   │
│                         │
│     [List] · [Map]      │  ← toggle (inline, scrolls with content)
│                         │
├─────────────────────────┤
│[All][Events][Products]..│  ← fixed bottom: kind-filter pills
├─────────────────────────┤
│   Home · Explore · You  │  ← bottom nav
└─────────────────────────┘
```

---

## 6. Where Create lives

The Create action leaves the bottom nav. It needs a new home — one that's accessible but not omnipresent, intentional but not hidden.

### Recommendation: contextual header action + /you entry point

Two placement points, each serving a different user posture:

**1. Page-level header action (contextual).** On the Home feed, a "+" icon appears in the top-right corner of the page header, next to the notification bell or settings gear (whichever exists). Tapping opens the existing bottom-sheet kind picker (Host · Sell · Offer · Float). This is the contextual create — the user is already browsing their locality feed, sees something that sparks an idea, and taps to create. The icon is small, quiet, and present only on surfaces where creation makes sense (Home, Explore, venue pages, group pages). It does not appear on You, Settings, Item detail pages, or the thesis page.

This is the pattern used by Instagram (the "+" in the top header bar), Twitter/X (the floating compose button that appears contextually), and most content-creation apps that separate creation from navigation.

**2. /you page entry point (intentional).** The /you page gets a prominent "Create something" card — a secondary-style button or editorial card in the seller-tools section area, below the Follow strips. This is the intentional create — the user goes to their profile, sees their existing creations, and decides to add another. The CTA copy is kind-aware: if the Member has no business Group, it reads "Start selling" or "Host an event." If they already have a Group, it reads "Add a product" or "Host another event."

**Why not a floating action button (FAB)?** The FAB pattern (Material Design's signature circle in the bottom-right corner) is engagement-bait. It screams "create content!" on every screen. Our platform is people-first, not content-first. Most Members are browsing and following. The Create action should be present for the people who want it and invisible for the people who don't. A contextual header icon + a /you entry point achieves this.

**Why not a prominent CTA on Explore?** Explore is for finding things, not for creating them. The search bar is the hero CTA on Explore (per CTA pattern #6). Adding a Create button to Explore would violate the one-primary-per-screen rule.

---

## 7. Separator and whitespace patterns from reference apps

### Airbnb

Airbnb's separation vocabulary is narrow and consistent. Between listings in search results: whitespace only (16-20px), no dividers. Between page sections on a listing detail: full-bleed 1px hairline in #EBEBEB. Between the sticky price bar and content: 1px hairline + subtle shadow on the bar. Between the search header and results: 1px hairline. That's it — four contexts, two techniques (whitespace and hairline), zero decorative dividers.

The absence of dividers between cards is what makes the feed feel open. Each card is a self-contained unit with its own photo and text block. The whitespace is sufficient to separate them because the photos create their own visual boundaries.

### Linear

Linear's separation strategy relies almost entirely on whitespace and typography. Issues in a list are separated by 1px hairlines — but the hairlines are so subtle (#E8E8E8 on white) that they read as texture, not structure. Section breaks are created by extra whitespace (32px+) and a section header in a distinct type style (smaller, muted, uppercase). The sidebar navigation uses no dividers at all — items are separated by 4px of vertical space and grouped by section headers.

What to steal: the confidence to let whitespace do the work. Linear never uses a thick border, a colored divider, or a shadowed separator. The restraint is the design.

### Stripe

Stripe's documentation and product pages use a three-layer separation system: (1) the grid itself creates implicit columns and gutters that group related content, (2) hairline borders (1px, very light gray) create explicit section boundaries, and (3) generous vertical whitespace (48-64px) between major page blocks creates the "chapter break" rhythm that makes long pages scannable. Typography hierarchy (the variable-weight sohne-var at different sizes) handles within-section grouping.

What to steal: the idea that spacing should be *rhythmic*. Every major section break is the same height. Every card gap is the same height. Every sub-section gap is the same height. When you establish a rhythm and hold it, the page feels composed without any explicit design chrome.

### Are.na

Are.na's approach is the most radical in the reference set: almost no chrome at all. Blocks in a channel are separated by a thin hairline border on the block container — but the blocks themselves are just content (text, images, links) with minimal padding. The feed is calm because there's nothing to look at except the content. No badges, no reaction counts, no timestamps competing with the content, no colored elements.

What to steal: the proof that a near-zero-chrome approach works for community engagement. People return to Are.na not because the app is visually stimulating, but because the content is worth seeing. "The calm-feed proof that quiet works."

---

## 8. PWA-specific considerations

This app is a PWA. It runs in the browser and — when installed — in standalone mode without browser chrome. Both modes must work flawlessly, and the design must account for the differences.

### Standalone mode viewport

When a PWA runs in standalone mode, the browser's URL bar and toolbar disappear. On iOS, the status bar (time, battery, signal) overlaps the app content unless the app accounts for it. On Android, the system navigation bar (back, home, recent) occupies space at the bottom.

The CSS environment variables `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, `env(safe-area-inset-right)` provide the inset values. The design must use these:

- **Top safe area:** The page header (oak mark + location selector on Home; search bar on Explore) must pad its top edge by `env(safe-area-inset-top)` so content doesn't slide under the status bar.
- **Bottom safe area:** The bottom nav bar must pad its bottom edge by `env(safe-area-inset-bottom)` so it doesn't collide with the iPhone home indicator or Android gesture bar. This typically adds 34px on iPhone (notch models) and 0-48px on Android depending on device.
- **Left/right safe areas:** Relevant only in landscape on notched iPhones. At b1 we're portrait-first, but the page gutters (24px) are already wider than the typical 44px left/right inset, so no special handling needed.

### No native back button

In standalone mode, there's no browser back button. The app must provide its own navigation:

- **Gesture-based back:** On iOS, swipe-from-left-edge navigates back natively in standalone PWAs. On Android, the system back button/gesture still works. Both should be tested.
- **In-app back arrow:** Detail pages (venue, item, member, group) should render a back arrow (←) in the top-left corner. Tab surfaces (Home, Explore, You) don't need one — they're top-level.
- **No "stuck" states:** Every surface must be reachable from the three-tab nav within two taps. The bottom nav is always visible on tab surfaces. On detail pages, the back arrow returns to the referring tab. If the user deep-links into a detail page (from a shared URL or QR code), the back arrow returns to Home (the default context).

### Install prompt

PWAs can prompt the user to "Add to Home Screen" — the `beforeinstallprompt` event. The design should include a quiet install prompt on the /you page (a dismissible card: "Add to your home screen for the full experience") rather than a pop-up modal on first visit. The prompt appears after the user has visited at least twice (repeat engagement = genuine interest). The prompt card uses the secondary button style — no accent fill, no urgency.

### Performance perception

PWAs load from a web server, not from local storage. Perceived performance matters more than native apps because the user's expectations are calibrated to "website" speed, not "app" speed.

Design mitigations:

- **Skeleton screens.** Every surface renders a skeleton (pulsing gray blocks at the correct layout dimensions) within 100ms of navigation. The skeleton matches the final layout so there's no layout shift when content loads.
- **Optimistic state updates.** Follow, unfollow, and save actions update the UI immediately (icon state flips, toast fires) and reconcile with the server in the background. The user never waits for a network round-trip on a tap-to-toggle action.
- **Image lazy loading.** Photos load with `loading="lazy"` and a pistachio-50-tinted placeholder. The placeholder is so subtle it reads as whitespace, not as a broken image.

### Thumb zones

Steven Hoober's mobile interaction research (updated data) confirms: 75% of phone interactions use a single thumb, with the comfortable reach zone being the bottom third of the screen plus a curve along the dominant-hand side. The uncomfortable zone is the top-left and top-right corners.

This validates:

- Bottom nav at the bottom (thumb-friendly).
- Kind-filter pills at the bottom on Explore (thumb-friendly).
- The search bar at the top is an acceptable exception — it's a tap-to-expand interaction, not a frequent-toggle interaction. The user taps it once to initiate a search, then the expanded input is in the center of the screen.
- The "+" create icon in the top-right header is a reach — but it's an infrequent action, and the alternative placement (/you entry point) is fully thumb-reachable.

---

## 9. Modern app design principles — distilled

From the research across Airbnb, Linear, Stripe, Are.na, Letterboxd, and current mobile UX literature, nine principles emerge that apply directly to this app:

**1. Content is the design.** The platform surfaces things people declared — events, products, ideas. The UI's job is to present those things clearly and get out of the way. Substack's reader-first hierarchy, Are.na's near-zero chrome, Airbnb's photography-forward cards: the pattern is consistent. Strip the interface until the only things visible are content, navigation, and the one action the user can take.

**2. One color, used sparingly.** Stripe's purple, Airbnb's Rausch Red, our pistachio. A single accent color used for primary CTAs and brand moments. Everything else is neutral (charcoal/white). The accent's power comes from its rarity.

**3. Spacing is hierarchy.** Linear's 8px scale, Stripe's 4px/8px grid, Airbnb's consistent card gaps. Spacing communicates "these things belong together" and "this is a new section" more effectively than borders, colors, or weight changes. A consistent spacing rhythm makes the page feel designed without any visible design elements.

**4. The nav bar is furniture.** It should be structurally present and visually quiet — like a chair in a room. You know it's there, you use it constantly, and you never look at it. Dark neutral active state, muted inactive state, no brand color, no decorative elements. The nav bar is not a design moment; it's infrastructure.

**5. Fewer items, more confidence.** Three tabs instead of five. One accent instead of three. One type family instead of two. Constraint signals confidence — the app knows what it is and doesn't hedge. "Paucity" is a feature, not a limitation.

**6. Hairlines, not shadows.** Shadows are for elevation (sheets, modals, floating elements). Flat surfaces separate with hairlines or whitespace. Mixing the two — a card with both a border and a shadow — creates visual confusion about the element's z-position. Pick one per context and hold it.

**7. Bottom for action, top for orientation.** The user looks at the top of the screen to understand where they are (location, search context, page title). They tap at the bottom to change what they're seeing (nav tabs, filter pills, primary CTAs on detail pages). This maps to natural hand posture and matches the patterns established by Maps, Airbnb, and iOS system apps.

**8. Intentional density.** "Breathing room" doesn't mean "spread everything out." It means giving each element the space it needs to be parsed independently. A tight card with 16px internal padding can feel spacious if the card has 24px of open air around it. A sparse card with 32px internal padding can feel cramped if it's butted against the next card with 8px between them. The air *between* elements matters more than the air *inside* them.

**9. Calm over engagement.** No red notification badges. No infinite scroll. No "you have 3 unread" counters. No pull-to-refresh that feels like a slot machine. The app opens, shows what's happening, and waits. The member decides when to engage further. This is the Are.na principle: "No engagement bait, no red badges, no infinite scroll — and people still come back."

---

## Appendix: wireframe revision checklist

For the designer revising the Phase 0 wireframes against this thesis:

### Every screen

- [ ] Bottom nav shows three tabs: Home, Explore, You — no Create tab, no "+" icon in the nav bar
- [ ] Active nav state uses `--color-charcoal-700`, not pistachio
- [ ] Nav bar height is 52px + `env(safe-area-inset-bottom)` padding
- [ ] Page side gutters are 24px minimum
- [ ] Between-card gaps are 24px minimum
- [ ] Between-section gaps are 32px minimum
- [ ] Pistachio appears in at most two roles per screen (CTA fill + one accent)
- [ ] No color over photos — save/heart icon is the only exception
- [ ] Structural boundaries use 1px hairlines; content boundaries use whitespace + section headers

### Home

- [ ] Oak mark top-left, "+" create icon top-right (contextual, quiet)
- [ ] Location selector below the header row (or integrated into it)
- [ ] Feed cards separated by 24px whitespace, no divider lines between cards
- [ ] "Show more" pagination at the bottom, not infinite scroll

### Explore

- [ ] Top row: compact search pill with location name (left), search icon (center-right), filter icon (right)
- [ ] No filter chips at the top of the page
- [ ] Kind-filter pills anchored at the bottom, above the nav bar
- [ ] List/Map toggle inline with content (scrolls with results), not fixed
- [ ] Results area fills the space between top search row and bottom pill row

### You

- [ ] Profile section at top
- [ ] Follow strips (horizontal scroll) with section headers and "More →" links
- [ ] "Create something" card or entry point in the appropriate section
- [ ] Sell CTA for members without a business Group
- [ ] Settings/sign-out at the bottom

### Detail pages (venue, shop, item, member, group)

- [ ] Back arrow (←) top-left
- [ ] No bottom nav — or: bottom nav still visible but detail content scrolls behind it (choose one approach and hold it)
- [ ] Primary CTA as sticky bottom strip (Follow, RSVP, etc.) with hairline separator above
- [ ] Sections separated by 32px whitespace + section headers in Micro style
