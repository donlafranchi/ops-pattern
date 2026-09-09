# T142: The location step stops inventing a coordinate

**Scenario:** F061 — someone creates a page worth showing people
**Status:** Complete
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** nothing. **Blocks:** T143, T147.

**Serves:**
- **Loop:** 9 (Make a living locally), 7 (Buy close) — a Page that pins to a street it has never been to is a discovery failure before it is a trust failure.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Location, with coordinates derived from what the Member actually gave — an address or a neighbourhood, never invented.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** review F061. PROCEED.
- [x] **Gate B — clear.** `groups.md:234` (address-or-neighbourhood, Ratified 2026-09-07), `groups.md:240` (neighbourhood mode, Ratified 2026-09-07), `groups.md:242` (deterministic scattered point, Ratified 2026-09-07).
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec.** `product/systems/groups.md` §§ *A real place, at the precision its owner chooses* (line 230+). `product/foundation/policy.md` § locality-vs-address separation (referenced, not re-cited).
- [x] **Review binding note 4** — deleting the placeholder coordinate reaches the product, service and gathering composers, which call the same shared location-create action. **Decision made here, not discovered at merge:** those three composers' location steps get the same address-search + neighbourhood-toggle step, reusing this ticket's component. They do not lose the ability to create a Location.

## What changes

The existing geocoder (already used by the retired vendor signup and the admin forms) gets wired into the Page composer's location step for the first time, replacing the hard-coded downtown-Sacramento constant. The same step ships to the three other composers that call the shared location-create action, since the constant lives there.

## Acceptance Criteria

### Address mode
- [x] The location step renders an address combobox. As the Member types, suggestions from the existing geocoder module appear beneath the field.
- [x] Choosing a suggestion settles the field to the full resolved address, shows a small static map thumbnail with a pin on the resolved point, and unlocks Continue. (Continue = the drawer's "Add and select" — this is the inline-add sub-flow, not a standalone step; see Completion notes.)
- [x] An address the geocoder cannot resolve refuses the step: inline message, no Location row written, an offer to try a nearby cross-street or landmark.

### Neighbourhood mode, same step
- [x] Beneath the address field, a visible toggle: "Rather give a neighbourhood?" Swaps to a `<select>` of neighbourhoods sourced from `places` where `kind='neighborhood'`.
- [x] Picking a neighbourhood sets the Location to `kind='area'`, with a point drawn toward the polygon's interior (not uniform across its bbox). No street address stored.
  _Deviation from the literal text: seeded by a fresh id per Location, not "the Page's own id" — see Completion notes, this shared action has no Page/Group id in its input at all._
- [x] The point is identical on every render for a given Location — computed once at creation from that Location's seed, stored as its `geography`, not re-derived.
- [ ] **Page-kind branching (no address field for non-business kinds) — not built.** No composer exists today that collects a Page's own address for a non-business kind; see Completion notes.

### The placeholder coordinate is deleted, not made conditional
- [x] The hard-coded default-coordinate constant in `sellCreateLocationAction` is removed — replaced by a discriminated-union input type that makes omitting both address and neighbourhood a compile error, plus a runtime refusal for any caller that bypasses the type.
- [x] The Sell walkthrough's, Product composer's, and Service composer's "Add a new Location" drawers all use the same `<LocationPlaceFields>` component. **Gathering composer not touched — it has no location-creation step at all** (confirmed in code: Location is pre-attached via a prop, "no picker step at b1"); see Completion notes.
- [x] Test: creating a Location through any of the three composers with neither an address nor a neighbourhood chosen does not produce a row — the save is blocked client-side and the action refuses server-side.

### Rendering
- [x] The resolved address / neighbourhood is exposed as text beside the map thumbnail, not conveyed by the thumbnail alone.

## Accessibility (M3) — fires, new interactive step

- [x] Address field: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`; suggestions are real `<button>`s in a `role="listbox"`/`role="option"` list, individually Tab-reachable. **Partial gap:** no arrow-key navigation or `aria-activedescendant` — see Completion notes.
- [x] Neighbourhood list is a real `<select>`.
- [x] The refusal on an unresolvable address is `role="alert"` + `aria-describedby`, not colour-alone.
- [x] Touch targets (suggestions, mode-toggle links) bumped to a 44px minimum — caught in review, fixed before commit.
- [ ] Colour contrast against the live rendered DOM — not measured (no browser available in this session); relies on existing DLS tokens already used elsewhere in the file.

## Workflow gates

- [x] **M2 — `engineering:code-review`** before commit. Three findings: the post-resize vs. pre-resize size check wasn't this ticket's (that was T120), but a debounce-callback-after-unmount bug was found and fixed here.
- [x] **M3 — `design:accessibility-review`** — ran. Two items named above as gaps (combobox keyboard pattern, unmeasured contrast), one fixed (touch targets).
- [x] **M4** — no migration. Confirmed.
- [x] **DEVIATIONS.md entry** at close.
- [x] **Close-out reconciliation.**

## Notes

- **Reuse, don't fork.** `design-language.md` § Multi-step composer — "one step holds one decision class." Location + neighbourhood-toggle is one decision (where), so it stays one step, not two.
- **No new `places` seeding needed.** Five Sacramento neighbourhood polygons with centroids already exist (`review-F061.md` addendum, "more exists than expected").
- **Do not touch Place/metro resolution code.** Both already resolve geographically from a point; a scattered neighbourhood-mode point needs no special case.

## Completion — notes

- **The resolver's seed is a fresh id, not "the Page's own id."** `sellCreateLocationAction` is the shared Location-create action for the Sell walkthrough AND the Product/Service composers' pickup/center locations — it takes no Page/Group id at all in its input, so deriving from one isn't possible as literally written. Seeding by a fresh `crypto.randomUUID()` per Location preserves both properties the ticket actually cares about — determinism (the point never re-rolls once stored) and no-coincidence (two different Locations in the same neighbourhood don't land on the same point) — without requiring a capability this action doesn't have. Logged in DEVIATIONS as a Type A correction to the ticket's own wording.
- **Gathering composer untouched.** Confirmed in code (not assumed): `GatheringComposer.tsx` has no location-picker step — a Location is pre-attached via a prop, with an explicit comment "no picker step at b1." The ticket's "four composers" framing doesn't match the code; only three composers (Sell/Product/Service) create Locations inline. Logged in DEVIATIONS.
- **The "kind other than business sees only the neighbourhood question" branch is not built.** There is no composer today that collects a Page's own address for a non-business kind — that's `/you/create`/T139 territory (interest-kind Pages), and T139 explicitly does not build an address step. Nothing to wire this into yet; logged as a forward-looking gap in DEVIATIONS, not silently dropped.
- **Combobox keyboard pattern is partial.** Suggestions are real, individually-focusable buttons (Tab reaches every one), but there's no arrow-key navigation or `aria-activedescendant` — the full ARIA 1.2 combobox authoring pattern. Functional, not idiomatic. Logged in DEVIATIONS for a follow-up pass.
- **Colour contrast not measured against a live render** — no browser available in this session. The toggle links and error text reuse DLS tokens (`--color-accent`, `--color-danger`) already in use elsewhere in this codebase; not a new colour choice, but also not independently verified here.

## Completion

Date: 2026-09-08
Commit: {pending}
