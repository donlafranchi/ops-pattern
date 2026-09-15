---
id: what-design-language
purpose: Design principles and tokens the code can't self-document — why, not what's already in globals.css or the components.
layer: what
status: active
---

# Design language

White canvas + photography + one signature accent. The chrome disappears so the content speaks.

## Principles — the why, not derivable from the code

1. **One accent color, used sparingly.** Satin Pistachio marks the brand; core surfaces use only two shades of it. Present enough to register, restrained enough to never compete with photos.
2. **Dark neutral text, never brand-colored.** The accent never appears on paragraphs or headings — only on interactive surfaces and accents.
3. **White-dominant canvas.** No tinted backgrounds, no graduated color across components. The feed breathes.
4. **Photography is sacred.** No color pills, frosted badges, or overlays on photo cards. Metadata lives in the text zone below the image, never on top of it.
5. **No color-block cards.** A card without a photo is text-forward and neutral — never a solid-color rectangle.
6. **Hairlines over shadows.** Separation is a 1px border; shadow is reserved for hover lift and overlays.
7. **One typeface, restrained scale.** Inter, four weights, tops out at 32px in product surfaces.
8. **Controls sit where the hand already is** *(restated by Don, 2026-09-13 — this replaces "bottom-anchored, thumb-reachable," which stated the tactic and lost the reason)*.
   - **On a small phone, that means near the bottom**, because it is one-handed operation and the top of the screen is where the thumb cannot reach. **That is the whole point of the rule** — not the bottom edge for its own sake.
   - **On a larger screen it matters less**, because those are usually two-handed. There the aim is the **left and right edges**, where either hand already is, rather than the bottom.
   - **This is an aim, not a prohibition.** Don: *"sites like AllTrails and Airbnb also have very nice layouts even though they don't follow the guideline I just described."* Good products break it and remain good, so a layout that puts a control elsewhere **needs a reason, not an exemption** — and the reason can be as ordinary as "this is where it reads best."
   - The browse search row, which also carries the list/map toggle (2026-09-13), sits at the top. Recorded as a judgment rather than as a violation being tolerated.
9. **No overlay ever carries color or decoration for its own sake** — an overlay exists to hold a state (loading, selected), never to add visual interest a photo or a hairline can't supply.
10. **Filtering controls live in a filter surface, never on the results surface.** *(Ratified 2026-09-12, Don.)* **Zero filter pills** — no pill row, chip row or control strip sits alongside results. A results surface shows results. Sibling of principle 8: both say a control belongs where the thumb and the attention already are, not stapled to the content. **What replaces the pill row is settled the same day: search** — categories stop being a visible control entirely (`../foundation/model.md` § Search is the filter). A Page still declares a category; no surface renders one as a control.

11. **Never show someone a zero counter on their own work.** *(Moved here 2026-09-14 from the retired `../foundation/role-language.md`, where it sat among naming rules; it is a UX rule and always was.)* A gathering nobody has joined reads *"No one's in yet. Be first."* to a visitor and *"Nobody's in yet"* to the host — never "0 RSVPs." A zero on your own thing is a small daily failure notice, and the surfaces are nearly all empty at launch.

## Tokens — the source of truth for what the code should read

Full hex/px values live in `globals.css`; if they disagree, `globals.css` is right and this file is stale — fix the file, don't trust it blind.

- **Brand:** one accent color (Satin Pistachio) at two shades — brand mark and CTA fill. The full ramp is a design-tool resource; product UI reaches for exactly two values from it.
- **Role tokens:** background (white), surface (neutral gray, never green-tinted), body text (near-black, not brand-colored), muted text, hairline border, focus ring.
- **Semantic colors** (success/warning/danger/info) appear only in system feedback — toasts, validation, alerts. Never decorative, never on a card.
- **Ownership-tier spectrum** (badges + map pins only): one semantic axis, green = local, gray/black = extractive. The `pe-corporate` tier desaturates on the card; hover restores full color.
- **Radius, shadow, motion:** defined once in `globals.css`; this doc doesn't duplicate the scale.

## Rules the components must hold, that the components alone won't tell you why

- **The card's media block always renders**, present or absent photo, because a grid whose card height depends on per-row data reads as broken rather than varied. The no-photo state is a neutral field with the kind's glyph — never a color, never an emoji, never a per-kind palette (the one-accent budget doesn't stretch to a seven-color kind ramp, and emoji render inconsistently across platforms).
- **A Page's default art (no photo) is deterministic** — the same Page renders the same gradient-and-letter mark on every load, to every viewer. Placeholder art handsome enough to pass for a real photo misrepresents the place; a photograph-quality placeholder removes the reason to ever add a real one. No stock photography, ever — it depicts somewhere that isn't there.
- **One primary (accent-filled) button per screen.** Two competing primaries is a smell that means the page hasn't decided what it wants the visitor to do.
- **Multi-step composers write progress on advance**, not on final submit — the Member is editing a half-built thing from step one, not filling a buffer. This is what makes "your work is saved" an honest claim rather than a hope.
- **Trust microcopy next to a primary CTA states what's true right now, in the present tense — never a promise about the future.** ("Listing costs nothing," not "no fees, ever." A recipe that generates promise language generates it on every surface that copies the recipe.)
- **An owner-only management affordance renders inline on the real public page**, never as a separate "manage" view — the owner should see what everyone else sees, with controls layered on top.

## Anti-patterns

Two filled-accent buttons side by side. A primary-styled button in a destructive context. Routing to a full auth page from a card action instead of a modal at peak intent. Producer recruitment as the loudest thing on the homepage — it's the smaller audience; consumer signup wins the hierarchy.
