# T146: Art on every Page from the first day

**Scenario:** F061 — someone creates a page worth showing people
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** T141 (`groups.photo_url` column, to key off null). Soft-sequenced after T145 for integration, not a hard dependency. **Blocks:** T147.

**Serves:**
- **Loop:** 9 (Make a living locally), 7 (Buy close) — nearly every Page has no photo on day one; this is what the platform looks like, not an edge case.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** a derived rendering, no data written, no entity.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** review F061. PROCEED. Binding note 6: build this early enough in the stretch to be looked at, not on the last day — this ticket is sequenced accordingly (before T147 closes out the composer).
- [x] **Gate B — clear.** `groups.md:307` (deterministic, visibly-not-a-photograph, Ratified 2026-09-07).
- [x] **All three `Serves` lines resolve.**
- [x] **Governing DLS recipe — already written.** `design-language.md` § *Default Page art* (line 395+). Build to this recipe; do not redesign it in the ticket.

## What changes

One rendering component, consumed wherever a photo would render.

## Acceptance Criteria

- [ ] Component derives a stable index from the Page's `id` (a hash, not randomness) into a fixed set of **six** gradient pairs drawn from the design language's neutral/reserved ramp values.
- [ ] Renders a two-stop gradient with the Page name's first character with a glyph, centred, `--color-fg` at 40% opacity, in the display face, sized ~⅓ of the tile's short edge. A name starting with a non-letter uses the first character that has a glyph, or a neutral mark if none exists.
- [ ] **Identical output for the same Page on every render** — no client-side randomness, no time-based variation.
- [ ] Fills the same frame a photograph would (1:1 on a Page, matching whatever aspect the card recipe uses elsewhere), never letterboxed or bordered differently from a real photo.
- [ ] Renders wherever `groups.photo_url` is null: the Page's own public surface and its card wherever Pages are listed.
- [ ] **Owner-only "Add a photo" overlay**: text-link weight, bottom-left, reaching the same picker T145 ships. Renders only for the Member holding the Page's managing role (per `groups.md` § Editing an active Page's `managingRoleForKind` — reuse it, don't hardcode `owner`).
- [ ] Every other viewer sees the art alone — no "no photo" text, no incomplete-looking treatment.
- [ ] Contrast of the letter against either gradient stop clears 3:1.
- [ ] Test: same Page id renders the same gradient index and letter across repeated calls.
- [ ] Test: a Page with `photo_url` set never renders default art (real photo takes precedence unconditionally).
- [ ] `BUILD-LOG.md` updated.

## Accessibility (M3) — fires, new component on every Page

- [ ] Decorative: `alt=""`, `aria-hidden` on the generated art itself — the Page name is already adjacent.
- [ ] The owner's "Add a photo" overlay is a real link with its own accessible name, separately reachable, meeting the 44px minimum.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** — fires.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.

## Notes

- **No stock photography, ever, not as a later upgrade.** Stated flatly in both `groups.md` and the design-language recipe — don't revisit this in build.
- **Build and screenshot this early** (review binding note 6) — the recipe is unreviewed in practice even though it's specified. Surface a screenshot in the ticket's close-out for the PM to look at before T147 wires the whole composer together.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
