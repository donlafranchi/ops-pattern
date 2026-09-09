# T144: One category, chosen at creation

**Scenario:** F061 — someone creates a page worth showing people
**Status:** Complete
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** T141 (column + capture table). **Blocks:** T147 (composer step sequencing).

**Serves:**
- **Loop:** 9 (Make a living locally), 7 (Buy close) — the category is what search matches and what browse's category facet will eventually filter.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** a self-declared attribute on Page (`groups`), not a platform judgment. **No verification, no shell entity.**

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** review F061. PROCEED.
- [x] **Gate B — clear.** `groups.md:295` (Other/escape-hatch, Ratified), `groups.md:316` (no verification, Ratified).
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec.** `product/systems/groups.md` § *One category, from a fixed list* (line 279+).
- [x] **Governing DLS recipe.** No new component — a radio group, which `design-language.md` already covers as a form pattern; the "Something else" reveal follows the values-field reveal pattern named in T126's notes.

## What changes

One composer step, one handler-side vocabulary constant, one capture-table write, two render sites.

## Acceptance Criteria

- [x] Category step renders the twelve terms in one scrolling column, plus a thirteenth, Something else, visually separated below a border.
- [x] Exactly one selection. The step cannot be skipped and cannot be continued past with nothing chosen (whitespace-only free text included).
- [x] The twelve-term vocabulary is a named TypeScript constant (`PAGE_CATEGORIES`, `src/lib/groups/page-categories.ts`) — `groups.category` stays plain text, `groupActivate`'s Zod schema (`z.enum(PAGE_CATEGORIES)`) is the handler-side validation.
- [x] Selecting Something else reveals a single text input ("In your own words — what do you do?"), inside a `role="status"` region, `autoFocus`, with its own label.
- [x] On publish with a fixed-vocabulary term: `groups.category` is written in the same transaction as the lifecycle-state promotion.
- [x] On publish with Something else and free text: `groups.category` stays null and a row lands in `group_category_suggestions` in that same transaction.
- [x] The typed free text renders on the Page as the Member's own words, no chip, no platform chrome.
- [x] The chosen category (fixed-term case) renders on the public Page as a plain chip. **"Wherever cards render Pages" has no implementation target** — confirmed in code, no Page/Shop card component exists anywhere in this codebase yet. See Completion notes (same gap shape as T142's Gathering-composer finding).
- [x] Test: publish is blocked with neither a fixed term nor free text chosen (both handler-level and composer-level).
- [x] Test: choosing a fixed term writes no row to `group_category_suggestions`.
- [x] Test: Something else with only whitespace is rejected both client-side (composer validate) and server-side (handler trim-check).
- [x] `BUILD-LOG.md` updated.

## Accessibility (M3) — fires, new step

- [x] Native `<input type="radio" name="sell-category">` elements — arrow-key navigation and one tab stop for the whole group are the browser's own radio-group behavior, not hand-rolled. `role="radiogroup"` + `aria-label` name the group.
- [x] The Something-else reveal sits inside `role="status"`, announced on appearance.

## Workflow gates

- [x] **M2 — `engineering:code-review`** before commit. One real bug caught and fixed during build (not a separate pass) — see Completion notes on the "other" selection sentinel.
- [x] **M3 — `design:accessibility-review`** — fires; native radios satisfy the binding note without a custom widget.
- [x] **M4** — no migration (T141 already shipped the column/table; T144 extends `group_events`' consumer, not its schema).
- [x] **DEVIATIONS.md entry** at close.
- [x] **Close-out reconciliation.**

## Notes

- **No admin screen for the capture table.** The index on `normalized_text` is the whole surface — an operator groups and counts by query. Do not build a screen for this ticket.
- **Do not build browse's category facet here.** `groups.md:315` — "Categories on Items are not this." This ticket ships the column and the render on the Page's own surface only.

## Completion — notes

- **Category is deliberately NOT patched via `group.update_draft`.** It lives only in composer state until the final "Create my shop" tap, which sends it straight to `group.activate`. This is the literal reading of "in the same transaction as the Page's publish write," and it avoids a real problem: if category were saved progressively (like `anchorLocationId`/`about`), a Member who tries "Something else," types text, then changes their mind to a fixed term would leave an abandoned `group_category_suggestions` row from the first choice. **Cost: resuming an abandoned draft does not restore the category selection** — the Member re-picks it. Acceptable at this stage; not hidden — see DEVIATIONS.
- **M2 caught a real bug during build, not after:** the first cut of the "Something else" state inferred "is Something else selected" from whether `categoryOtherText` was non-empty. Clearing the text field (a completely ordinary action) silently deselected the radio and collapsed the input. Fixed by widening `category`'s type to `PageCategory | 'other' | null` — `'other'` is now an explicit, independent selection state.
- **Found and fixed a real RLS gap from T141**, not assumed: `group_category_suggestions`' SELECT policy (T141) scopes to the author or the Group's founder. T144 needs the free text shown to **any** public viewer. Fixed by reading it through the action-layer pg pool (`resolvePageCategoryOtherText`) — the same fix-forward pattern T143 used — rather than widening the RLS policy with a migration this ticket's own scope ("M4 — no migration") rules out.
- **"The Page's card wherever cards render Pages" has no implementation target.** Confirmed in code: no Page/Shop card component exists anywhere in `src/components/`. Category renders on the public Shop page only (`ShopPublicPage.tsx`). Same shape as T142's Gathering-composer finding — the scenario assumed a browse/card surface that hasn't shipped yet.

## Completion

Date: 2026-09-08
Commit: `4fb87cf` (web repo — vocabulary, handler, composer step, resolvers, tests) + `1e2aaf4` (parent repo — ticket close-out, DEVIATIONS)
