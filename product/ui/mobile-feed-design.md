---
id: mobile-feed-design
purpose: Mobile feed layout patterns derived from Airbnb mobile (June 2026 screenshot). Governs Home screen card layout, scroll behavior, and color discipline.
layer: what
status: proposal
---

# Mobile Feed Design

> **Status: proposal.** Derived from a real Airbnb mobile screenshot (June 2026) and mockup iterations. Supersedes the desktop-derived assumptions in `card-feed-design-proposals.md` for anything mobile-specific. Validated proposals graduate to `design-language.md`.

## The core insight

Airbnb's mobile feed is **not a vertical card stack**. It's a series of **horizontal scroll carousels** organized by section. This is the single biggest structural difference from our v1–v2 mockups, which stacked full-width cards vertically. Everything else — card sizing, color restraint, whitespace — follows from this layout decision.

## What the Airbnb mobile feed actually looks like

Observed from a full-page mobile screenshot (390px viewport, June 2026):

1. **Search bar at top** — rounded, full-width, prominent. "Start your search" placeholder.
2. **Horizontal tab row** — category filters (Homes, Experiences, Services). Small text, underlined active state.
3. **Section-based layout** — the feed is a vertical scroll of labeled sections, each containing a horizontal carousel:
   - "Popular homes in South Lake Tahoe →"
   - "Earn Airbnb credit at featured hotels"
   - "Available in Lake Tahoe this weekend"
   - "Stay in San Diego"
4. **Each section is a horizontal scroll row** — 2 cards visible, a third peeking ~30% from the right edge. The peek is the scroll affordance — no dots, no arrows needed.
5. **Cards are small** — approximately 160–170px wide, roughly square photo (slightly landscape), 3–4 lines of text below.
6. **"Guest favorite" badge floats on the image** — small, high-contrast, only on select cards. Heart icon top-right. Otherwise the image is clean.
7. **Text below each card:** title (1 line, 600 weight), price + duration, star rating + review count.
8. **Background is pure white.** No warm off-white, no tinted surface — white.
9. **Almost zero brand color.** Airbnb's Rausch Red appears on heart icons and a few action elements. The feed itself is monochrome — black text, white background, photography provides all the color.
10. **Section headers** — bold, 16–18px, with a "→" link for "Show all." Clean separation between sections using whitespace alone (no dividers).
11. **Footer content** — "Inspiration for future getaways" section uses a text-only grid (city + type), no images. Support/Hosting/Airbnb footer links in plain text.

## What this means for m·m·s

### Layout: sections + horizontal carousels

The Home screen should be a vertical scroll of horizontal carousel sections, not a vertical card stack.

Proposed sections for b1 (order TBD):

- **Happening this week** — upcoming events near the user's locality. Cards show: photo, event name, date/time, distance.
- **Near you** — mixed-kind items sorted by proximity. Cards show: photo or colored block, title, kind label, distance.
- **Sellers & makers** — active kind='business' Group members or product/service listers. Cards show: avatar/product photo, seller name, category.
- **Ideas & asks** — wonders and asks from the community. Cards show: colored block with avatar, title, reply count.
- **Groups** — active groups near the user. Cards show: group avatar/photo, name, member count.

Each section: bold header + "See all →" link, horizontal scroll, 2 cards visible + peek.

### Card sizing

- Card width: **~165px** (fits 2 cards + peek + gutters in 390px viewport)
- Photo aspect ratio: **1:1 or 4:3** — square reads cleanest at small size
- Text block: 3–4 lines below the photo
- Inter-card gap within a row: **12px**
- Section vertical spacing: **32–40px**

### Color discipline

- Background: **white (#FFFFFF)** or near-white. Not the warm Canvas (#FAFAF7) — that's for detail pages and the You tab, not the feed.
- Accent color appears in exactly **two places** in the feed: the active bottom-nav tab and CTA buttons (if any appear in the feed). Everything else is black/gray text on white.
- Photography and author-specific colors (avatars, banners) provide visual interest. The platform chrome is invisible.

### Phone outline

The mockup phone frame should use **near-black (#111111 or #1A1A1A)**, not the brand's Oak Green. The phone is a device simulation, not a brand surface.

### What carries forward from v2

These v2 changes remain valid regardless of layout:

- **Tags off images** — kind labels belong in the text zone, not overlaid on photos
- **Card containment** — at small card size, a subtle border or shadow helps cards read as objects (even more important when cards are side by side in a row)
- **Minimal accent color** — validated by the mobile screenshot; Airbnb is even more restrained than v2
- **Carousel dots on individual cards** — less critical with horizontal-scroll sections (the section peek provides the scroll signal), but still useful for multi-photo cards in detail view
- **Attribution / social proof line** — still valuable in the text block beneath each card

### What v2 got wrong

- **Vertical full-width card stack** — the entire layout model was desktop-derived. Mobile Airbnb doesn't do this.
- **Colored banner headers on text cards** — trying to unify card silhouette by adding a gradient banner. With horizontal carousels and small cards, the silhouette problem disappears — all cards in a section are the same size by definition.
- **Warm off-white feed background** — Airbnb mobile is white. The warm Canvas is a nice brand touch but it muddies the feed at scale. Save it for detail pages.
- **Phone outline color** — using Oak Green (#3F4D3C) for the phone border made the mockup itself feel branded. It should be neutral — a phone is a phone.

## WCAG note

WCAG (Web Content Accessibility Guidelines) AA is a readability standard requiring minimum contrast between text and its background — 4.5:1 for body text, 3:1 for large text. Our pistachio button color (#869C7F or #A0B49A) with white text doesn't meet this threshold. Fix: darken the button to 700 (#6D8367) or use dark text on a lighter pistachio background.

## Validation path

1. Build v3 mockup with horizontal carousel sections, small cards, white background, black phone frame.
2. Compare v2 (vertical stack) vs v3 (carousels) side by side.
3. Validated patterns graduate to `design-language.md`. Conflicting DLS principles (e.g., "Photography is the surface" may need reframing for small cards) route through `weigh`.

## Sources

- Airbnb mobile screenshot, June 2026 (captured by PM)
- Prior analysis: [`card-feed-design-proposals.md`](card-feed-design-proposals.md)
