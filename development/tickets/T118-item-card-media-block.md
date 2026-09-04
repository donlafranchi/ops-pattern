# T118: The Item card always renders a media block

**Scenario:** none — PM design decision (`planning/backlog/decision-item-card-media.md`, ratified 2026-09-04). See § Gate C below; this is not the substrate lane.
**Status:** Done
**Bundle:** b1
**Depends on:** T088 (`ItemFeedCard`), T117 (Explore consumes it)
**Blocks:** nothing

**Serves:**
- **Decision:** [`planning/backlog/decision-item-card-media.md`](../../planning/backlog/decision-item-card-media.md) — Decision A, ratified 2026-09-04. The card renders its media block unconditionally.
- **Spec:** [`product/ui/design-language.md`](../../product/ui/design-language.md) § *Card* → § *Card media block*. Last changed `Fri Sep 4 01:58:15 2026 -0700` — build compares against this.
- **Loop:** 3 (Land here) and 7 (Make and be found) — both are discovery-side loops whose only surface is this card. A grid that reads as broken is a Loop 3 failure before it is an aesthetic one.
- **Primitive shape:** Item → feed card. **No schema change, no new data field.** The placeholder derives from `items.kind`, which every `FeedItem` already carries.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `ls planning/{next,now}/review-F*.md` → **no matches, and none can exist.** This work has no F-number: it originates in a PM design decision, not a scenario, so there is no `review-F{NNN}.md` to look for. Gate C as written presupposes an F-number and is **unrunnable here** — recorded rather than waived, and flagged in the session report as a checklist gap. The reviewing function is not skipped: **checklist 4 fires unambiguously** on this ticket (`git diff --name-only main | grep -E '^src/(app|components)/'` will return `src/components/feed/ItemFeedCard.tsx`), and its `design:design-critique` + `design:accessibility-review` items are the review this work gets.
- [x] **Gate B — ratified absolutes.** The spec sections this ticket encodes are § Card and § Card media block. Every absolute in them carries a State tag as of `6d2c673` + the follow-up commit: the always-renders rule, "No colour, ever," and "no width and no column count" each carry `Intent (Ratified 2026-09-04)`. Two of the three were untagged when first written and were tagged in response to this gate.
- [x] **All three `Serves` lines resolve.** Decision doc exists and is committed; DLS section exists and is committed; Loops 3 and 7 are named in `product/needs/member-journey.md`.
- [x] **Cited spec's last-changed date recorded.** Above.
- [x] **Governing DLS recipe named.** `design-language.md` § Card media block — written for this ticket, so build is not choosing icons or tokens at implementation time.

## What changes

One component, `src/components/feed/ItemFeedCard.tsx`, and its test. Three defects, one coherent fix.

1. **The media block never renders.** It is gated on `photo_url`, and no Item has ever had one — `grep -rn "photo_url" web/supabase/seeds/*.sql` returns a single `item_products` insert whose `photo_urls` is `array[]::text[]` in every row. All 16 published Items render as text on white.
2. **The kind chip is the heaviest thing on the card.** `.chip` is `px-3.5 py-2 text-sm`; the `text-[11px]` override shrinks the font and not the padding, so it renders ~32px tall above a 14px title.
3. **The card has no edge and does not fill its cell.** `.card` is `bg-white rounded-xl` with no border, and the inner `<Link>` is `block`, so it sizes to content while its `<li>` stretches — hence ragged rows.

## Acceptance Criteria

- [x] The 4:3 media block renders on every card. Photo present → `object-cover`, no overlays. Photo absent → the kind field.
- [x] Kind field: `--color-surface` background, centered lucide glyph at 28px / 1.5 stroke in `--color-fg-muted`. No text, no circle, no accent line, no colour.
- [x] Glyph mapping exactly as tabled in the DLS: `gathering`→`CalendarDays`, `product`→`Package`, `service`→`Handshake`, `wonder`→`Lightbulb`, `offer`→`Gift`, `ask`→`HandHeart`, `initiative`→`Flag`. An unknown kind falls back to `Package` rather than rendering an empty field.
- [x] The kind chip is gone. Kind renders as an 11px/600 uppercase `0.08em`-tracked `--color-fg-muted` label, first line of the text zone, on **both** media states.
- [x] Card carries `1px --color-border` at rest; hover keeps the existing shadow + lift.
- [x] Card fills its grid cell (`h-full`, column flex, text zone grows). **No width class and no column-count assumption anywhere in the component** — it renders today in three grids at 2/3, 2/3, and 2/3/4 columns.
- [x] Type scale per DLS § Card: title 15px/600, owner 14px/400 muted, location 13px/400 muted.
- [x] `ItemFeedCard.test.tsx` rewritten. The existing test asserting the media block is *absent* without a photo is the assertion this decision reverses; the replacement asserts it is present, and asserts the correct glyph per kind.
- [x] **Chrome untouched.** No edit to the search bar, filter icon, bottom sheet, kind-pill row, or list/map toggle. `git diff --name-only` must show no file under `src/components/explore/` or the nav.
- [x] Unit tests green, typecheck green, build green.
- [x] `BUILD-LOG.md` updated.

## Workflow gates

- [x] **Checklist 4 — changing a surface.** Fires. All five items, no N/A without a named reason.
- [x] **M2 — `engineering:code-review`** before commit.
- [x] **M3 — `design:accessibility-review`.** Fires (new component state on a rendered surface). Not waivable by "no new component" — that is the T117 failure this checklist exists to close.
- [x] **M4 — `engineering:deploy-checklist`** before merge to main.
- [x] **DEVIATIONS.md entry** at close, including the appearance line checklist 4 requires.

## Explicitly out of scope

- Surrounding chrome (search, filters, map toggle, pill row) — lands on the merged Home surface per `decision-surfaces.md`; building it now builds it twice.
- Per-kind colour. Deferred; a seven-colour ramp is a Principle 1 question.
- Photo upload. This ticket makes the empty case deliberate; it does not fill it.

## Completion

Date: 2026-09-04
Commit: `2e73d88` (merge `fa49587`)
Deployed: https://www.socialus.org — verified live, new markup serving, production build clean.
Screenshots: `_inbox/screenshots/t118-home-feed-375x812.png`, `t118-home-feed-full.png`, `t118-explore-375x812.png` (375×812, production).

All AC met. Checklist 4 run in full: `design:design-critique` and `design:accessibility-review` (M3) both pass with no critical or major findings; screenshots attached above; the DLS recipe named in Serves is the one that shipped; the appearance line is the first paragraph of the DEVIATIONS entry.
