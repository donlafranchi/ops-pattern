---
purpose: Ratifies an always-present media block on ItemFeedCard, overriding the design language's no-photo editorial card recipe; records the shipped code, tickets, and scenarios the reversal touches.
layer: what
status: ratified
---

# Decision: the Item card always renders a media block

PM ratified 2026-09-04. Referred to in session as **Decision A**.

## What was decided

`ItemFeedCard` renders its 4:3 media block **unconditionally** — the photo when the Item has one, a neutral kind field when it does not. The grid keeps a constant card shape and a constant row rhythm regardless of how many Items carry photos.

Intent (Ratified 2026-09-04): A feed whose card shape depends on per-row data has no shape at all. At current inventory — 16 published Items, zero photos — the conditional media block never renders, so every card collapses to unstyled text and the grid reads as a list of links rather than a catalog. The always-present holder is what makes the grid legible before the inventory arrives, and it is what keeps it legible afterwards, when photo coverage will be partial for a long time and a mixed grid of tall and short cards would be worse than either uniform state. Reversible: the placeholder branch is one conditional in one component; if photo coverage ever approaches complete, deleting it restores the prior behaviour with no data migration and no other surface affected.

## What in the design language this overrides

`product/ui/design-language.md` § Card, two bullets:

1. **"Bg white, no border, no shadow at rest."** Overridden — the card now carries a `1px --color-border` hairline at rest. The no-border rule was written for a card whose photo supplied its own edge. A card that may have no photo needs the border to exist as an object, and Principle 6 ("hairlines over shadows") already prefers exactly this.
2. **"No-photo cards: … editorial layout … No tinted backgrounds, no colored badges, no decorative emoji circles."** Overridden in its *layout* clause, upheld in its *colour* clause. There is no separate editorial no-photo card any more; there is one card with two media states. The prohibition on tint, colour, and decoration survives intact and constrains what the placeholder is allowed to be — see below.

Both bullets are marked superseded in place in `design-language.md`; the replacement recipe lands in the same section.

## Principles 3 and 5 are not overridden

The retro named this decision as conflicting with Principle 3 (white-dominant canvas, "no tinted backgrounds") and Principle 5 ("no color block cards"). The ratified placeholder does not conflict with either, because it is **not tinted and not a colour block**:

- The field is `--color-surface` (`#F7F7F7`), a neutral gray whose documented use in the token table is *"hover states, text-forward card backgrounds, empty states."* A no-photo media block is an empty state. This is the token being used for its stated purpose, not a new tint.
- No accent, no kind-colour ramp, no per-kind palette. A seven-colour kind ramp would violate Principle 1 and is explicitly not what was ratified.

The conflict the retro identified was real against the *emoji-circle* shape of the remembered `VendorCard`. It is not real against the ratified recipe. See § Why not the emoji.

## Item 1 — what already ships that this contradicts

`grep -rln "ItemFeedCard" web/src`:

| File | Disposition |
|---|---|
| `src/components/feed/ItemFeedCard.tsx` | **The change.** Media block made unconditional; kind chip replaced by an editorial label; card given a hairline and made fill-height. |
| `src/components/feed/ItemFeedCard.test.tsx` | Rewritten — existing tests assert the media block is *absent* without a photo. That assertion is what this decision reverses. |
| `src/components/feed/LocalityFeed.tsx` | Consumer, `grid-cols-2 sm:grid-cols-3`. Unchanged; card must not assume its column count. |
| `src/components/ExplorePage.tsx` | Consumer, `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`. Unchanged. |
| `src/components/venue/VenuePublicPage.tsx` | Consumer, `grid-cols-2 md:grid-cols-3`. Unchanged. |
| `src/lib/explore/items.ts`, `src/lib/locations/resolve-venue-items.ts` | Data mappers onto `FeedItem`. Unchanged — no new field is required; the placeholder derives from `kind`, which every row already carries. |

Three live consumers at three different column counts. That is the reason the card is specified to fill its cell rather than to size itself, and the reason no fixed width appears anywhere in the recipe.

## Item 2 — in-flight tickets on the affected surface

`grep -rln "ItemFeedCard\|/explore\|LocalityFeed" development/tickets/*.md` → T113, T114, T115, T116, T117.

**All five are `Status: Done`.** `development/tickets/` currently holds no open ticket at all (T110–T117, all Done or Complete); they are unclosed rather than in flight. So the disposition for every hit is **accept-and-note**, not pause:

| Ticket | Overlap | Disposition |
|---|---|---|
| T117 — Explore rewire | Its AC reads *"`ExplorePage` renders items via the existing `ItemFeedCard`. No new card component."* Still true after this change. | Accept. No re-scope. |
| T114 — kind-filter pill row | Chrome around the grid, not the card. | Accept. Explicitly out of scope this session. |
| T115 — filter icon + bottom sheet | Chrome. | Accept. |
| T116 — inline list/map toggle | Chrome, rendered *between* grid cells. Unaffected by a card that fills its own cell. | Accept. |
| T113 — scroll-to-hide nav | No card contact. | Accept. |

Noted but out of scope: **T117 waived M3 with "N/A; no new page or component"** and its Completion commit is still `{pending}`. The first is the precise failure mode checklist 4 was written to close; the second is a drift item for `orient`. Neither blocks this decision.

## Item 3 — approved scenarios on the affected surface

`grep` across `planning/next/` and `planning/now/` → F044, F045, F046, plus the bundle-1 tracking docs.

**None of the three specifies the card's interior.** Each was read, not just matched:

| Scenario | What it actually governs | Disposition |
|---|---|---|
| F044 — inline list/map toggle | The toggle's placement *between* result cards, and card gaps. Says nothing about card contents. | Unaffected. |
| F045 — filter icon + bottom sheet | The **filter** chips below the search bar. Note the collision of vocabulary: F045's "chips" are removable secondary-filter chips in the chrome; the chip this decision deletes is the kind chip *inside* the card. Different elements. | Unaffected. |
| F046 — scroll-to-hide nav | Nav chrome. | Unaffected. |

No approved scenario is invalidated. No scenario needs to move lanes.

## Why not the emoji

The remembered `VendorCard` (`git show ac4b377:src/components/VendorCard.tsx`) centred a 3xl category emoji on `--color-surface`. The PM remembers it working, and it did — but it is the wrong thing to carry forward, for three reasons that are about the current context rather than about taste:

1. **Its vocabulary was categories, not kinds.** `CATEGORIES` was the vendor taxonomy (`bread`, `produce`, `honey-jams`). T117 already established that no Item uses it and that inventing an Item taxonomy is `explore`'s job. The seven kinds are the vocabulary that exists.
2. **Emoji are not ours to art-direct.** They render as full-colour platform glyphs — a different colour vocabulary per operating system, on a canvas whose first principle is one accent used sparingly. This is the clause of the no-photo recipe that survives the override.
3. **`lucide-react` is already a dependency** and is already used across the nav, buttons, and eleven other components. A line glyph in `--color-fg-muted` gives the same at-a-glance kind recognition with no new dependency, no new art, and no colour.

The mapping is a naming decision, not invented artwork, and it is recorded in the design language so build is not choosing icons at implementation time.

## What this does *not* decide

- **Nothing in the surrounding chrome.** Search, filters, the map toggle, and the kind-pill row are untouched. They land on the merged Home surface per `decision-surfaces.md`; rebuilding them now would rebuild them twice.
- **No per-kind colour.** Deferred indefinitely; a seven-colour ramp is a Principle 1 question, and T117's map pins already deferred the same question for the same reason.
- **No photo-upload path.** This decision makes the empty case look deliberate. It does not address why there are no photos.
