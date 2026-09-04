---
id: how-f048-member-gets-the-address-not-the-mileage
purpose: Backlog scenario — remove every mile, radius, and distance control from the product; the address becomes the answer to "how far is it."
layer: how
status: draft
---

# F048: A member gets the address, not the mileage

**Bundle:** b1
**Sub-bundle:** b1.x-adjacent — a cross-cutting removal that lands before the Home/Explore merge. Not a new theme; it *shrinks* the surface every later theme inherits.
**Work-map item:** Retires the last unchecked producer/newcomer row — "Adjust how wide their 'near me' reach is — *backlog (F031)*". The reach control was a radius control; with distance out there is no width to adjust. This scenario closes that row by deletion rather than by building it.
**Loops:** 3 (Land here), 4 (Gather regularly), 7 (Make and be found)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love); the hand-off beat is [O1 — A group meets at a regular time and place](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) (Drake's Run Club).
**Primitive shape:** Person → browse `discoverable_items` → Item(kind=gathering) → Location(permanent). No schema change; this removes read-time computation and one filter dimension.
**Spec contract:** `community-platform.md` § Distance is out (Ratified 2026-09-03); `decision-surfaces.md` § Distance is out — the hierarchy is the only proximity concept
**Status:** backlog

> **This is a deliberate removal of shipped work, not a defect being fixed.** T115 merged its distance filter on 2026-09-03 and this removes it. The ticket was built correctly to the spec that existed at the time. Say so in the ticket; do not write it up as a bug.

## The Person

A newcomer to Sacramento who set their home to Oak Park. She's scrolling the feed on a Tuesday evening and finds the Thursday run at Drake's. What she actually wants to know is whether she can get there after work — which is a question about her commute, her car, and Thursday traffic, none of which the platform knows. Today the card tells her "2.3 mi," measured from a centroid she never chose to a venue whose coordinates are approximate. It is a precise-looking number that answers nothing, and it sits next to a filter that invites her to narrow her whole world to a five-mile circle drawn around the same arbitrary point.

## The Story

She opens the feed. Cards show what the thing is, when it is, and where it is — Drake's, in Oak Park. No mileage. When she taps into the Run Club page, the venue's address sits under the heading as a real, actionable thing: on her phone it opens Google Maps with Drake's already dropped in, and Maps tells her it's eighteen minutes on Thursday at six. On her laptop the same address is a copyable string she pastes into whatever she uses.

She never looks for a distance filter, because there isn't one. The filter sheet holds kind, category, and schedule — the three things that actually narrow "what could I go do." Where an Item sits relative to her is the feed's job, and the feed already put the near things first.

## Surfaces

- **Entry point:** the browse surface (Home feed and, until the merge, `/explore`) and any Item detail page.
- **Primary action (removal side):** none — the member's experience is the *absence* of controls and numbers.
- **Primary action (addition side):** the address on an Item detail page. On mobile it is a tap target that opens the device's map app; on web it is a copyable string with a copy affordance.
- **Composer / interaction:** the filter bottom sheet (T115) loses its distance section entirely; the sort control loses `nearest`.
- **Completion:** the member lands in their own map app, outside the platform. That is the intended terminus.
- **Discovery:** unchanged — this scenario removes a filter dimension and a displayed number; it does not change which Items are returned.

## Data Captured

No new data. No columns added, no columns dropped. What is removed is **read-time computation** and **one URL parameter's meaning**.

| User-language field | Schema mapping | Required? |
|---|---|---|
| The venue's address (displayed, actionable) | `locations.street_address` (existing, Member-authored free text) | shown when present |

Implicit: no new events. `?distance=` and `?sort=nearest` stop being meaningful URL state.

## Acceptance Criteria

### No mileage renders anywhere

**Given** a member browsing the feed, the Explore list, the map, or any Item detail page
**When** any Item is rendered, with or without an attached Location
**Then** no distance value renders — no "2.3 mi", no "within 5 miles", no proximity badge, no mile count in a card, a chip, a heading, or a tooltip. _Why: `community-platform.md` § Distance is out — "nothing in the product measures or displays miles." The eval should assert on the absence of a mile-unit pattern across rendered output, not on the removal of one specific component, because the number appears in several places and a component-scoped test would pass while a card still shows it._

### The distance filter is gone, and an old link does not resurrect it

**Given** the filter bottom sheet is open
**When** the member reads the sheet top to bottom
**Then** it offers kind, category, and schedule only; there is no distance section, no radius control, and no distance chip can appear in the active-filter chip row.

**Given** a member follows a shared link carrying `?distance=5`
**When** the page loads
**Then** the parameter is ignored, the page renders normally with no error, and the parameter is dropped from the serialized URL state. _Why: T115 shipped shareable filter URLs, so `?distance=` links exist in the wild from the moment it merged. Silently ignoring is the only behaviour that neither errors on a member nor quietly re-enables a control the product no longer has. The eval must check that the URL is rewritten, not just that the filter had no effect — a lingering parameter re-serializes into the next share._

### `sort=nearest` is gone, and an old link falls back

**Given** the sort control is open
**When** the member reads the options
**Then** `nearest` is not among them.

**Given** a member follows a link carrying `?sort=nearest`
**When** the page loads
**Then** the surface renders in its default order and the parameter is dropped. _Why: `nearest` was a client-side proximity ordering competing with the server-side one — `decision-surfaces.md` § The merged surface's two ranking authorities. Leaving it as an accepted-but-inert parameter would preserve exactly the ambiguity this deletion exists to remove._

### The address is present and actionable on mobile

**Given** an Item with an attached Location that has a street address, viewed on a touch device
**When** the member taps the address
**Then** the device's map application opens with that address as the destination. _Why: `community-platform.md` § Distance is out — "the address must be present and actionable on any Item that has one … that affordance is load-bearing; it is the only path to a distance answer." Removing distance without adding this leaves a hole where a real question used to get a bad answer; the eval must verify the hand-off fires, not merely that the address string is present._

### The address is copyable on web

**Given** the same Item viewed on a pointer device
**When** the member uses the copy affordance beside the address
**Then** the full address is placed on the clipboard and the member gets a visible confirmation.

### Online Items offer no address and no pin

**Given** an Item whose location is Online
**When** it renders in the list and on the map
**Then** it shows no address and no hand-off affordance, and it does not appear on the map at all — no pin, no fallback coordinate, no clustered "online" marker. _Why: `decision-surfaces.md` § Online is a location option — "a map pin asserts 'this is here,' and an Online Item is not anywhere." A fallback pin is the one failure mode this criterion exists to catch, and it is invisible unless the eval specifically asserts the pin count excludes Online rows._

### The origin resolution stops running

**Given** the browse surface loads for any member, signed in or out
**When** the page's server-side data fetching completes
**Then** no `places.centroid` read occurs and no coordinate decode runs in the request path. _Why: `origin.ts` exists solely to feed distance math (`decision-surfaces.md` § What this deletes, item 4). Left in place it is dead weight that still carries the `?place=` origin defect, and it would be ported into Home by the merge. This criterion is build-verifiable rather than screen-visible; the ticket writer should assert it at the query layer._

## Edge Cases

- **An Item whose location is a hood, with no street address:** show the hood name; render no hand-off affordance, because there is no address to hand off. This state does not exist until F051 ships; the criterion is forward-compatibility, not current behaviour.
- **A Location whose Member-authored `street_address` is malformed or empty:** show whatever text exists, and suppress the hand-off affordance when the field is empty. The platform does not validate or normalize the address — `location.md` § What does not ship at b1 defers address normalization, and that deferral stands.
- **A member on a device with no map application registered:** the tap falls back to the same copy behaviour as web rather than failing silently.
- **Clipboard access denied by the browser:** the address remains selectable as text; the copy affordance reports failure rather than showing a false success.

## Assumptions

- The distance filter, the great-circle helper, `origin.ts`, and the `originAvailable` plumbing are all live in `web/src/lib/explore/` and `ExploreFilterSheet` as of T115/T116 (recorded in `decision-surfaces.md` § What the shipped Explore code carries into the merge). The ticket writer confirms against code; `scope` does not read `web/`.
- `MarketSelector.tsx` carries its own `haversineMiles` but is already slated for removal under the vendor/market retirement — out of scope here, and the two removals should not be entangled.
- This scenario ships **before** the Home/Explore merge. See `plan-location-model-sequence.md` for why the order is load-bearing rather than a preference.

## Out of Scope

- Ranking by the stored place hierarchy (F052) — this scenario removes distance; it does not install the replacement ordering.
- The Home/Explore merge itself.
- The `sort` control's survival as a whole. `nearest` dies here because it is a distance concept; whether newest / soonest / most-responses earn a control on a locality-ranked feed is `decision-surfaces.md` open question 11 and is not settled by this scenario.
- Retiring F031's scenario file. This deletes the reach control's reason to exist; archiving the F031 scenario is a `close`/`tidy` action, not a build ticket.

## Capabilities unlocked

- **1. Presence & Findability** — realizes the "Now" commitment that a producer's or host's physical location is *actionable* to a member who wants to go there, replacing a computed proximity figure the platform cannot honestly deliver.
- **3. Locality & Trust Signals** — removes a false-precision signal. Nothing in the taxonomy's Now list is lost: the reach/radius control was never a producer capability, and "how far is it" was never a Now bullet.
