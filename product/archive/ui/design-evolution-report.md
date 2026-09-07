---
purpose: Summary of the b1 mobile design exploration — from Airbnb palette through pistachio direction.
layer: what
status: active
---

# Design Evolution — b1 Mobile Feed

## Starting point

Began with a literal Airbnb-derived palette: warm neutrals, a multi-shade green ramp applied across surfaces, Oak Green (`#3F4D3C`) for headings and section text, pistachio tints on card backgrounds, colored pills over photos, and gradient color-block cards for non-photo items.

## What we tried and killed

**Oak Green text.** Used pistachio-900 as a heading color. Competing with photo content and making the feed feel branded rather than content-forward. Killed — all text uses dark neutral (#2D2D2D) now.

**Pistachio ramp in UI.** Used pistachio-50 through pistachio-300 as tinted backgrounds, selected-state fills, and card washes. Created a green haze across the interface. Killed — the ramp exists as a system resource but core surfaces only use pistachio-400 (brand mark) and pistachio-500 (CTA fill).

**Photo overlays.** Colored pills, frosted badges, and tier markers over card images. Dirty photos. Killed — photography is sacred per the Airbnb model.

**Color-block cards.** Ideas and Asks rendered as solid-colored gradient rectangles with white text. Created a card-dominance problem: the colored blocks competed with photo cards for visual weight, making the feed feel heavy. Killed — replaced with neutral grey cards.

## What we landed on

**Three card types, clear hierarchy:**
1. **Photo cards** — photography leads. Clean image, no overlays (except the heart icon). Metadata below. Featured badge uses a pistachio-outlined white pill.
2. **Grey cards** — for items without photos (Ideas, Asks). Light neutral grey (#F0F0F0) background. Editorial typography: uppercase kind label, bold title, author row. No color.
3. **Promo/CTA cards** — white background with pistachio left-border accent. CTA button on white.

**Pistachio used liberally, but only on white.** Satin Pistachio (#BACBB5) lacks the saturation pop of Airbnb's Rausch Red, so it needs more surface area to register as a brand color. It works on: logo dots, locality pin, section accent lines, active filter chips, "Show all" links, Featured badge outlines, CTA buttons, selected-state borders, step-progress dots, input focus rings, map pins, and detail-page kind labels. It never sits on grey, on photos, or on any other tinted surface.

**White-dominant canvas.** Pure white page background. Grey surfaces (cards, surfaces) are neutral — not green-tinted. The brand registers through pistachio touchpoints scattered across a clean white field.

## Principles that emerged

1. **One accent, many touchpoints.** A low-saturation brand color needs quantity to compensate for intensity. Spread it across interactive and decorative surfaces, but always on white.
2. **Grey is the safe card.** When there's no photo, a neutral grey card with strong typography is better than a colored block. It doesn't compete with the photo cards and creates visual rhythm.
3. **Photography > decoration.** Photos are the highest-value content in a local-commerce feed. Every design decision should make them more prominent, not less.
4. **Let content define color.** Photo cards bring their own palette (honey bread, green farms, sunset sky). The UI stays neutral so the content colors lead.
5. **Phone frame is neutral.** Near-black (#1A1A1A), not brand-colored. The frame is infrastructure, not branding.

## File inventory

All mockups archived in `product/ui/mockups/`:

| File | What it shows |
|---|---|
| `mockup-mobile-b1.html` | Original Airbnb-derived palette |
| `mockup-mobile-b1-original.html` | First full mobile mockup (pre-pistachio) |
| `mockup-mobile-b1-pistachio.html` | First pistachio swap |
| `mockup-mobile-b1-pistachio-v2.html` | Reduced ramp, removed Oak Green text |
| `mockup-mobile-b1-pistachio-v3.html` | Horizontal carousels, minimal pistachio |
| `mockup-mobile-b1-comparison.html` | Side-by-side comparison view |
| `design-comparison.html` | Airbnb vs CDP comparison |
| `design-comparison-v2.html` | Revised comparison after palette simplification |
| `mockup-mobile-final.html` | **Final direction** — grey cards, liberal pistachio on white |
