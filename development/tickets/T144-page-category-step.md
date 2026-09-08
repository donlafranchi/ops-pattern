# T144: One category, chosen at creation

**Scenario:** `planning/next/scenario-F061-someone-creates-a-page-worth-showing-people.md`
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** T141 (column + capture table). **Blocks:** T147 (composer step sequencing).

**Serves:**
- **Loop:** 9 (Make a living locally), 7 (Buy close) — the category is what search matches and what browse's category facet will eventually filter.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** a self-declared attribute on Page (`groups`), not a platform judgment. **No verification, no shell entity.**

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F061.md`. PROCEED.
- [x] **Gate B — clear.** `groups.md:295` (Other/escape-hatch, Ratified), `groups.md:316` (no verification, Ratified).
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec.** `product/systems/groups.md` § *One category, from a fixed list* (line 279+).
- [x] **Governing DLS recipe.** No new component — a radio group, which `design-language.md` already covers as a form pattern; the "Something else" reveal follows the values-field reveal pattern named in T126's notes.

## What changes

One composer step, one handler-side vocabulary constant, one capture-table write, two render sites.

## Acceptance Criteria

- [ ] Category step renders the twelve terms in one scrolling column, exactly as listed in `groups.md:281`-283 (Food & Drink · Growing · Home & Body · Textiles & Craft · Wood, Metal & Repair · Art & Music · Classes & Workshops · Sport & Outdoors · Community & Mutual Aid · Music & Nightlife · Family & Kids · Faith & Culture), plus a thirteenth, **Something else**, visually separated at the bottom.
- [ ] Exactly one selection. The step cannot be skipped and cannot be continued past with nothing chosen.
- [ ] The twelve-term vocabulary is a **named TypeScript constant**, not a database enum or `CHECK` constraint — the handler validates against it. _Why: review binding note 2 — a term added later is a deploy, not a migration, and migrations are hand-pushed to production right now._
- [ ] Selecting **Something else** reveals a single text input: *"In your own words — what do you do?"* Reveal is announced (M3), input is immediately focusable and has its own label.
- [ ] On publish with a fixed-vocabulary term chosen: `groups.category` is written with that term, in the same transaction as the Page's publish write.
- [ ] On publish with **Something else** and free text: `groups.category` stays null, and a row is written to `group_category_suggestions` (group id, member id, raw text, normalized lowercase copy, `created_at`) in the **same transaction** as the publish write.
  _Why: `groups.md` § Other — the text is captured, not promoted; no volume of identical entries creates a category on its own._
- [ ] The typed free text renders on the Page as the Member's own words — same treatment as F056's values statement (attributed, no platform chrome around it) — and creates no filter, no browsable category.
- [ ] The chosen category (fixed-term case) renders on the public Page and on the Page's card wherever cards render Pages.
- [ ] Test: publish is blocked with neither a fixed term nor free text chosen.
- [ ] Test: choosing a fixed term writes no row to `group_category_suggestions`.
- [ ] Test: choosing Something else with only whitespace is rejected client- and server-side (same normalization rule as F056's values statement).
- [ ] `BUILD-LOG.md` updated.

## Accessibility (M3) — fires, new step

- [ ] The twelve-plus-one options are a real radio group: one accessible group name, arrow-key navigation, one tab stop for the whole set. _Review binding note: "thirteen tappable divs is the failure mode here."_
- [ ] The Something-else reveal is announced via a live region or equivalent, not silent.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** — fires.
- [ ] **M4** — no migration (T141 already shipped it).
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation.**

## Notes

- **No admin screen for the capture table.** The index on `normalized_text` is the whole surface — an operator groups and counts by query. Do not build a screen for this ticket.
- **Do not build browse's category facet here.** `groups.md:315` — "Categories on Items are not this." This ticket ships the column and the render on the Page's own surface only.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
