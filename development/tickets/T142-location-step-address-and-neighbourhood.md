# T142: The location step stops inventing a coordinate

**Scenario:** `planning/next/scenario-F061-someone-creates-a-page-worth-showing-people.md`
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** nothing. **Blocks:** T143, T147.

**Serves:**
- **Loop:** 9 (Make a living locally), 7 (Buy close) — a Page that pins to a street it has never been to is a discovery failure before it is a trust failure.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → Location, with coordinates derived from what the Member actually gave — an address or a neighbourhood, never invented.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F061.md`. PROCEED.
- [x] **Gate B — clear.** `groups.md:234` (address-or-neighbourhood, Ratified 2026-09-07), `groups.md:240` (neighbourhood mode, Ratified 2026-09-07), `groups.md:242` (deterministic scattered point, Ratified 2026-09-07).
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec.** `product/systems/groups.md` §§ *A real place, at the precision its owner chooses* (line 230+). `product/foundation/policy.md` § locality-vs-address separation (referenced, not re-cited).
- [x] **Review binding note 4** — deleting the placeholder coordinate reaches the product, service and gathering composers, which call the same shared location-create action. **Decision made here, not discovered at merge:** those three composers' location steps get the same address-search + neighbourhood-toggle step, reusing this ticket's component. They do not lose the ability to create a Location.

## What changes

The existing geocoder (already used by the retired vendor signup and the admin forms) gets wired into the Page composer's location step for the first time, replacing the hard-coded downtown-Sacramento constant. The same step ships to the three other composers that call the shared location-create action, since the constant lives there.

## Acceptance Criteria

### Address mode
- [ ] The location step renders an address combobox. As the Member types, suggestions from the existing geocoder module appear beneath the field.
- [ ] Choosing a suggestion settles the field to the full resolved address, shows a small static map thumbnail with a pin on the resolved point, and unlocks Continue.
- [ ] An address the geocoder cannot resolve refuses the step: inline message, no Location row written, an offer to try a nearby cross-street or landmark. _Why: the failure this replaces was silent — the step wrote a placeholder point and moved on. Refusing loudly is the whole point (scenario acceptance criteria, § An address becomes coordinates)._

### Neighbourhood mode, same step
- [ ] Beneath the address field, a visible (not hidden behind a setting) toggle: **"Rather give a neighbourhood?"** Tapping it swaps the field for a list of neighbourhoods sourced from `places` where `kind='neighborhood'`.
- [ ] Picking a neighbourhood sets the Location to `kind='area'`, with a point derived deterministically from the Page's own id, drawn toward the polygon's interior (not uniform across its bounding box). No street address is stored on the row.
  _Why: the five seeded polygons are hand-drawn rectangles; a uniform-random point can land in the river. `review-F061.md` binding note 7._
- [ ] The same Page's neighbourhood-mode point is identical on every render — computed from the Page id and the polygon, not stored, not re-rolled.
- [ ] **A Page whose kind implies no fixed premises (`kind` other than `business`, i.e. a club/circle) sees only the neighbourhood question — no address field renders at all.** _Why: "a club with nothing scheduled is not at an address" — `groups.md:279` context; one question instead of two for the Page least likely to have a street address to give._

### The placeholder coordinate is deleted, not made conditional
- [ ] The hard-coded default-coordinate constant in the shared location-create action is **removed**, not wrapped in a fallback branch.
- [ ] The product, service and gathering composers' location steps are updated to use this same step component (address search + neighbourhood toggle). **Decision recorded:** they do not lose Location-creation ability; they gain address search for the first time too.
- [ ] Test: creating a Location through any of the four composers with no address and no neighbourhood chosen does not produce a row with a default or city-centroid point.

### Rendering
- [ ] The resolved address (or neighbourhood name, in area mode) is exposed as text beside the map thumbnail — not conveyed by the thumbnail alone. _Why: M3 — the thumbnail is decorative; sighted-only confirmation fails a screen-reader user._

## Accessibility (M3) — fires, new interactive step

- [ ] Address field is a combobox with a listbox of suggestions: keyboard-reachable, active option announced, usable without ever seeing the map thumbnail.
- [ ] Neighbourhood list is a real listbox/select, not a set of divs.
- [ ] The refusal on an unresolvable address is an error message associated with the field via `aria-describedby`, not colour-alone.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3 — `design:accessibility-review`** — fires. New interactive step across four composers.
- [ ] **M4** — no migration (uses existing `locations.geography`, `locations.kind='area'`, existing `places` rows).
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation.**

## Notes

- **Reuse, don't fork.** `design-language.md` § Multi-step composer — "one step holds one decision class." Location + neighbourhood-toggle is one decision (where), so it stays one step, not two.
- **No new `places` seeding needed.** Five Sacramento neighbourhood polygons with centroids already exist (`review-F061.md` addendum, "more exists than expected").
- **Do not touch Place/metro resolution code.** Both already resolve geographically from a point; a scattered neighbourhood-mode point needs no special case.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
