---
id: card-feed-design-proposals
purpose: Proposed card/feed visual-hierarchy changes to test against mockups — not yet ratified into the DLS.
layer: what
status: proposal
---

# Card & Feed Design Proposals

> **Status: proposals, not canon.** This document is a set of changes to *test*, not rules in force. Nothing here is ratified into [`design-language.md`](design-language.md). Each proposal is a hypothesis to validate against mockups before any of it earns a place in the style guide. When a proposal is validated, fold the resulting rule into `design-language.md` and strike it here; until then, treat these as candidate directions only.

These proposals come from comparing the b1 pistachio mockup (`mockup-mobile-b1-pistachio.html`) against Airbnb's current mobile design system. The question driving them: **why does our feed feel image-first when we want it to feel content-first?**

## The viewport math

On a 390 × 844px mobile viewport (status bar, top bar, bottom nav subtracted), our scrollable zone is **658px**.

| | Image height | Total card | Cards visible | Image as % of card |
|---|---|---|---|---|
| **Ours (4:3)** | 262px | 335px | ~2.0 | 78% |
| **Airbnb (1:1)** | 350px | 422px | ~1.6 | 83% |
| **If we used 16:10** | 219px | 291px | ~2.3 | 75% |

Counterintuitive finding: Airbnb's images are *taller* than ours (1:1 vs 4:3). Their images take up *more* viewport, not less. They show fewer cards per screen. Yet their feed feels brand-first and ours feels image-first. Aspect ratio is not the problem — **everything around the image is the problem.**

## Seven things Airbnb does that we don't

Each subsection pairs an observation with a proposed change. The proposed changes are candidates to mock up and compare — not decisions.

### 1. One card format. No exceptions.

Every card in Airbnb's feed is image-on-top, text-below. Same shape, same rhythm, same scan pattern. Your eye learns the card template in 2 seconds and then stops processing "what kind of card is this?" — it just reads the content.

**What we do:** We interleave photo cards (335px tall) with text-only cards (180px tall). A photo card is **1.9x taller** than a text card. This creates a visual seesaw — tall, short, tall, short — that makes the big images feel even bigger by contrast. The eye keeps re-parsing card types instead of scanning content.

**Proposed change:** Give every card the same silhouette. The text-only cards (ideas, seller updates) should have a thumbnail area — either a small square image, an icon, or a colored block — that makes them the same visual width-to-height proportion as photo cards. The point isn't that every card needs a big photo; it's that every card needs the same *shape*.

### 2. The image is interactive, not decorative.

Airbnb puts an image **carousel** on every card — pagination dots at the bottom, swipeable. This transforms the image from "a picture you look at" to "a surface you interact with." Your brain categorizes it differently: it's a mini-gallery, not a banner.

**What we do:** Single static image per card. The image has no interactive affordance. It reads as a hero banner — which is exactly why it dominates. There's nothing to do with it except look at it.

**Proposed change:** Even at b1, add carousel dots to photo cards (even if there's only one photo initially). The dots signal "this is content you browse" rather than "this is a decoration we chose." When real photos arrive, support 2-3 per card. Carousel depth is a differentiator for sellers.

### 3. Nothing sits on the image except a heart.

Airbnb's image zone is sacred. The only overlay is a heart icon (top-right, for saving). No category tags, no badges, no labels. The photograph is uninterrupted. "Guest favorite" appears as a minimal badge *above* the image or in a very small floating chip, not a stamped overlay.

**What we do:** We float kind-tags (Event · Sat, ★ Featured this week, Idea) over the image on a frosted-glass pill. These are well-designed individually but collectively they make every image feel busy. The tag competes with the image for attention inside the image's own space. Three cards visible = three different colored tags floating on three different images = visual chaos.

**Proposed change:** Move the kind indicator *below* the image, in the text zone. A small colored dot or icon + label at the start of the meta line (where we already say "Maker · West Sac · ..."). The image stays clean; the kind still communicates. For Featured, consider a thin colored top-border on the card rather than a badge overlaid on the photo.

### 4. The text block pulls its weight.

Airbnb packs 4-5 lines of genuinely useful info beneath the image: title (600 weight), location, dates/availability, price per night (bold), rating with star count. The text is informationally dense — there's real decision-making content here. The text isn't subordinate to the image; it's a co-equal partner.

**What we do:** Two lines — title (17px/600) and one line of meta (13px/muted). The text block is about 50px total. Against a 262px image, it's dwarfed. The meta is thin: "Saturday · 8am – 1pm · Bridge District · 0.4 mi" is useful but it's the only line. The text feels like a caption, not content.

**Proposed change:** Add a third line of content. Options: a host/group attribution line ("Hosted by West Sac Market Collective"), a follower/attendee count ("12 going · 3 friends follow"), or a freshness signal ("Updated 2h ago"). Increase the title to 600 weight at 16px (Airbnb's approach — slightly smaller but same weight, reads as more authoritative because it's closer to the meta in size, creating a tighter text block rather than a big title + tiny caption).

### 5. Cards have containment. Whitespace alone doesn't work.

Airbnb uses a three-layer shadow on cards: a 1px border-ring at 0.02 opacity, a soft 6px blur at 0.04, and a primary 8px blur at 0.10. This creates a warm "lifted paper" effect that visually contains each card as a distinct object. Cards don't bleed into each other.

**What we do:** No shadows at rest. Cards are separated by 20px of white space and nothing else. On a phone screen, 20px of #FAFAF7 between two colorful images reads as "gap in a continuous feed" rather than "boundary between distinct objects." The images dominate because there's no container asserting itself as a visual object between them.

> **Tension with current canon:** `design-language.md` Principle 2 ("Hairlines over shadows") and Principle 3 ("Cards are quiet — no border at rest, no shadow at rest") deliberately reject card containment. This proposal argues that the no-containment rule is part of why images dominate. Validating it means revisiting those principles — not a CSS tweak. Flag for `weigh` if it tests well.

**Proposed change:** Add the pistachio equivalent of Airbnb's containment — not the same shadow (that's their brand), but a visual boundary. Options, in order of subtlety:

- A 1px border in `--color-border` (#E5E5DF) around each card (lightest touch)
- A two-layer shadow: `0 0 0 1px rgba(63,77,60,0.04), 0 2px 8px rgba(63,77,60,0.06)` (uses the Oak Green base for warm green-tinted shadows)
- Increase inter-card spacing to 28-32px (breathing room)

All three can combine. The shadow is the most effective at making cards feel like distinct objects.

### 6. Brand color is invisible in the feed.

Rausch Red (#ff385c) appears on the Airbnb search button, the favorited heart, and primary CTAs — that's it. The feed itself is monochrome: near-black text (#222222) on white. The photography provides 100% of the color in the listing grid. This means brand-controlled surfaces (header, nav, CTAs) are the only things with intentional color, and they read as the brand layer hovering above the content layer.

**What we do (pistachio version):** The accent appears on the bottom-nav active tab, the locality pill pin dot, the logo mark dots, the You-tab avatar, the sell CTA button, the sell CTA tint block, the selected-option border in the composer, and the detail-kind label. That's 8+ touchpoints of green distributed across the feed. Each one is small, but together they create a "green haze" that competes with the card imagery for visual attention.

**Proposed change:** Reduce accent color in the feed to exactly two places: (a) primary CTA buttons and (b) the active bottom-nav tab icon. Everything else goes neutral:

- Logo mark dots → `--color-fg-muted` or `--color-border` (they're punctuation, not brand signals)
- Locality pill pin → `--color-fg` (it's a location indicator, not a brand moment)
- Avatars → content-specific colors they already have (remove the default accent-colored avatar)
- Detail-kind label → `--color-fg-muted` uppercase, not accent-colored
- Sell CTA tint block → `--color-surface` (a neutral surface, not a green-tinted one)

This concentrates the pistachio into moments of action (buttons, taps) and lets the feed be content-colored.

### 7. Generous radius creates warmth without weight.

Airbnb uses 20px border-radius on cards and 8-14px on images — significantly more rounded than our 12px. The generous rounding creates a soft, organic feel that says "this is a friendly container" rather than "this is a rectangular frame around a photograph." The rounder the container, the more the container itself registers as a design element, and the less the image fills your visual field edge-to-edge.

**What we do:** 12px radius on both cards and images. This is close to a sharp rectangle. The image feels like it goes nearly edge-to-edge within the card. There's minimal "card shape" to assert itself as a container.

**Proposed change:** Increase image radius to 14-16px. This clips more of the image corners, makes the photo feel "held" rather than "displayed," and adds visible card shape even when the card itself has no border or shadow. On text cards, keep the current 12px radius for the container.

## Summary: ranked by hypothesized impact

Impact is estimated, not measured. Mockup validation is what promotes any row from proposal to canon.

| # | Proposed change | Effort | Hypothesized impact on "images dominating" |
|---|---|---|---|
| 1 | Unify card silhouette (give text cards a thumbnail zone) | Medium | High — eliminates the tall/short seesaw |
| 2 | Move kind-tags off the image into the text zone | Low | High — cleans every image in the feed |
| 3 | Add card containment (border or light shadow) | Low | High — cards become objects, not smears |
| 4 | Reduce accent color to CTAs + active nav only | Low | Medium — eliminates competing color focal points |
| 5 | Add a third line to the text block | Low | Medium — text competes better with image |
| 6 | Increase inter-card spacing to 28-32px | Trivial | Medium — cards breathe |
| 7 | Add carousel dots to photo cards | Low | Medium — reframes image as interactive content |
| 8 | Increase image border-radius to 14-16px | Trivial | Low-Medium — image feels more contained |

The top three changes together are hypothesized to transform the feed. None require redesign — they're CSS and layout adjustments to the existing mockup, which is exactly why they're cheap to test.

## What NOT to copy from Airbnb

- **Don't go to 1:1 images.** Airbnb can afford screen-filling photos because their content is homogeneous (all rental listings). Our feed mixes events, products, ideas, services — we need more vertical density, not less.
- **Don't adopt their shadow spec verbatim.** Three-layer shadows are an Airbnb signature. Our pistachio palette should produce its own containment language — probably simpler (one shadow layer + a hair border).
- **Don't suppress photography.** The goal isn't smaller images. It's a feed where the images serve the cards rather than overwhelming them. Airbnb's images are huge and they work because everything around them is disciplined.

## How to validate

These proposals graduate to `design-language.md` only after a mockup test. Suggested path:

1. Build a comparison mockup applying proposals 1–3 (the high-impact trio) to `mockup-mobile-b1-pistachio.html`.
2. Set the variant side-by-side against the current pistachio mockup at 390px width.
3. Judge against the design intent: does the feed read content-first? Do cards register as distinct objects? Is the image still doing emotional work?
4. For any proposal that conflicts with current DLS canon (notably proposal 5 vs. the no-containment principles), route the validated result through `weigh` before amending `design-language.md`.

## Sources

- [Airbnb DESIGN.md — VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/airbnb/DESIGN.md)
- [Airbnb's Use of Spacing Creates a Calm UI — Medium](https://medium.com/@kvividsnaps/airbnbs-use-of-spacing-creates-a-calm-ui-d04be85dc3e4)
- [Design System Analysis: Airbnb — getdesign.md](https://getdesign.md/airbnb/design-md)
- [From homes to haircuts: Airbnb's new app — It's Nice That](https://www.itsnicethat.com/articles/airbnb-app-redesign-140525)
