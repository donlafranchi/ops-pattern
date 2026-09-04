---
id: how-review-f048-f053-location-model
purpose: Rebuild-phase review for the location-model scenario cluster (F048–F053) — architecture, design, Apple legibility, sibling consistency, verdict.
layer: how
status: active
---

# F048–F053 review — the location model

**Scenarios:** [F048](scenario-F048-member-gets-the-address-not-the-mileage.md), [F049](scenario-F049-newcomer-picks-a-hood-and-a-metro-at-signup.md), [F050](scenario-F050-member-manages-saved-hoods-on-their-profile.md), [F051](scenario-F051-member-sets-an-items-location-while-creating-it.md), [F052 (blocked)](scenario-F052-BLOCKED-feed-ranks-by-hood-then-metro.md), [F053 (blocked)](scenario-F053-BLOCKED-member-switches-metro.md)
**Reviewer:** `review`
**Date:** 2026-09-03
**Bundle:** b1 (F048, F049) / b2 (F050, F051, F052, F053) — see `plan-location-model-sequence.md`

**Verdict:** **F048 PROCEED · F049 PROCEED-with-blocked-beat · F050 EXTEND · F051 EXTEND · F052 BLOCKED · F053 BLOCKED**

> **Two deviations from the review contract, both deliberate, both flagged rather than hidden.**
>
> 1. **Lane.** `review`'s pre-flight requires the scenario to be in `next/` or `now/`. These are in `backlog/`. Written here at PM request, because F044 and F045 both shipped without a review and the PM's instruction was not to make it three. This review moves to `next/` with the scenarios on lane advance and gets re-stamped per F-number at that point.
> 2. **One document, six scenarios.** The convention is `review-F###.md` per scenario. These six are one system with one shared schema decision and one shared failure mode; six documents would restate the same architecture check six times. Split them if any scenario advances lanes alone.

---

## Verdict summary

The decisions are internally coherent and the ratification discipline is genuinely good — every entry in `decision-surfaces.md` carries a State-tagged Intent, and the supersessions are marked in place rather than left to collide. **The architecture risk is not in the decisions; it is in the gap between what the decisions say and what the substrate can express.** Three of the six scenarios need schema that doesn't exist, and two ratified refinements (metro rings, corridor overlap) are **not expressible at all** at the current `metro_polygons` grain.

The design risk is narrower and sharper: **one criterion in F051 will pass during build and fail in production** unless it is tested in a specific order. Details under Design check.

**Next skill:** `ticket` for F048 and F049. `explore` for F050/F051 (schema extension). PM decision for F052/F053.

---

## Architecture check

### Systems touched

- `product/systems/item.md` — the Item gains its own stored place hierarchy; § Provenance claims supplies the guard that keeps discovery location out of provenance.
- `product/systems/location.md` — Location stays the venue primitive; the address becomes an actionable surface element. § What does not ship at b1 (address normalization deferral) is load-bearing and unchanged.
- `product/systems/places.md` — the `places` tree is the resolution target. Unchanged by these scenarios; consumed by all of them.
- `product/systems/discovery.md` — § Community-awareness feed's metro default depth (memo-0026) is what F049's metro pick makes explicit rather than derived.
- `product/systems/member.md` — the saved-hood set is new member state.
- `product/ui/community-platform.md` — all six surfaces.

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | **maybe — unresolved** | Saved hoods (F050): reuse `member_place_interests` (`primary_home` + up to five `secondary`, live add/remove handlers, existing metro resolution) or stand up a new table. `decision-surfaces.md` flags this as a substrate call and says "confirm before ticketing." **It is not confirmed.** |
| New columns required? | **yes** | Item-side stored place levels (S-location-hierarchy). Also, probably, a column distinguishing a *stated* metro from a *derived* one (F049) — see Cross-system consistency. |
| New event types required? | **yes** | Hood add / hood remove (F050). The metro pick (F049) needs its own recorded write; `member.place_interest.add` will not carry it correctly. |
| Migration required? | **yes** | New Item columns, a backfill for existing Items, an MV rewrite (`discoverable_items`), and an RPC rewrite (`locality_feed_items`). |
| Forward-tier impact | **one real constraint** | The stored hierarchy is a fixed set of levels per Item. A future T2/T3 that wants a different granularity (sub-neighborhood, block) re-resolves rather than re-queries — acceptable, and the Intent line names it as the accepted cost ("a bad resolution persists until re-resolved"). |
| Shell-entity smell | **clean** | Nothing here introduces an entity owning Items. The Item owns its own location values; the Member owns a set of Places. No vendor, no business, no establishment. |
| Loop fidelity | **matched, with one note** | F048 serves Loop 3 by removing false precision, not by adding a feature — legitimate but unusual; the ticket should not be written as an enhancement. F051 serves Loop 2 (Float an idea) most directly: *"the activation energy is the lowest possible: one sentence, no date, no place, no commitment."* A required location field is a direct tax on that loop, which is exactly why the pre-fill is load-bearing rather than a nicety. **If F051 ships without F050's pre-fill, Loop 2 regresses.** |
| Policy posture present | **yes, and it's the strong point** | Neighborhood-grain entry is analyzed as a privacy mechanism with a State-tagged Intent, and the doc is explicit that behavioural hood inference is **not agreed** and needs a posture the product has never taken. `location.md` § Policy posture already establishes that place-interests are not an addressability surface; the saved-hood set inherits that and must not become one. |

### Cross-system consistency

**1. The stated-vs-derived metro collision — the one to fix before ticketing.** `resolve_home_metro()` is already wired into `member.place_interest.add` / `.remove` and writes `members.home_metro_id` from a Place centroid. F049 ratifies the metro as **stated, not derived**. If the stated value goes into the same column, every later place-interest change silently reverts the member's override — the exact case asking the question was meant to handle. Either the derivation stops writing after signup, or stated and derived need separate homes. **This is a schema question with a product consequence, and it is not answered anywhere.**

**2. `discoverable_items.nearest_location_id` is retired by premise, not by fix.** Today it resolves to the *oldest* attached venue (`order by il.created_at asc limit 1`, migration `034`), with no distance math in the derivation — migration `033` already annotates it as "first-location-only" and routes around it. The stored hierarchy removes the need for a single "nearest" venue entirely. **Good.** But nothing in the cluster says what a *multi-venue* Item stores (the O3 case, a series spanning Places). Flagged; not blocking, because no b1 kind creates one.

**3. The metro-polygon grain cannot express two ratified refinements.** `metro_polygons` carries one `geography(Polygon, 4326)` per row at Census CSA grain. CSAs are **non-overlapping county aggregations by construction.** So: inner/outer rings need a second polygon or ring column, and deliberate corridor overlap is **not representable at this grain at all**. Both refinements were ratified on 2026-09-03 against substrate that cannot hold them. `decision-surfaces.md` flags this correctly as a substrate consequence rather than a blocker to the decision — the review agrees, and adds that it means **no scenario should carry a ring-dependent criterion until the grain question is settled.** F053 correctly carries none.

**4. Rural members lost their fallback today.** `home_metro_id` is null outside every seeded CSA (migration `031`). F031's answer was radius scope with metros ranked by distance. F048 deletes both. The vantage-point rule has no answer for a member with no metro. Recorded in `plan-location-model-sequence.md` as Q3.

**5. The provenance guard holds.** `item.md` § Provenance claims carries a State-tagged Intent (Ratified 2026-05-23) refusing auto-population of `made_at_verification_source` from any other location field. The 2026-09-03 check concluded member-entered location does not trigger it, correctly: where an Item *is* and where a product was *made* are different questions. F051 carries the guard as a testable criterion. Clean.

### Gate A — ratified-absolute scan

Every absolute these scenarios encode carries a State tag in `decision-surfaces.md`: location entry, Online-as-option and its warning, no-map-pin, copy-not-inheritance, hood-and-metro-at-signup, metro-as-vantage-point, distance-is-out, geocode-once. **Gate A passes.**

**One finding, not a block.** The restatements in `community-platform.md` (§ Online is a location option, § Build note — this is a default not inheritance) carry the "Ratified 2026-09-03" marker in their headings but **no co-located `Intent (Ratified …)` line**. The ratification is real and dated at the decision doc; the spec restates the rule without the tag. Under a strict reading of rebuild rule 10 those bullets read as unratified in isolation. **Disposition: `tidy` DRY sweep** — replace the restatements with pointers, or add the co-located tags. Not a pipeline block; flagged so a later Gate B run on the same sections doesn't stop the ticket writer for something already settled.

### Architecture verdict

- **F048 — PROCEED.** No schema. Pure removal plus one presentational affordance.
- **F049 — PROCEED**, conditional on resolving the stated-vs-derived metro column before the ticket is written.
- **F050 — EXTEND.** The saved-hood substrate is undecided. `member.md` needs the resolution written down before tickets open.
- **F051 — EXTEND.** Depends on S-location-hierarchy, which does not exist. `item.md` § Data model implications needs the stored-levels shape.
- **F052 / F053 — BLOCKED**, correctly, by product decisions rather than by architecture.

---

## Design check

### Surfaces touched

| Surface | New? | Notes |
|---|---|---|
| Item detail — address block | **modified** | Gains a tap-to-open (mobile) / copy (web) affordance. Load-bearing, not decoration. |
| Filter bottom sheet (T115) | **modified** | Loses a section. Shrinks. |
| Sort control | **modified** | Loses one option; whole-control survival is Q1. |
| Signup locality step (F030) | **modified** | Gains an explicit metro field. |
| Profile — "Your hoods" | **new** | F050. |
| Every Item composer | **modified** | F051. This is a rework of shipped composers, not only a new field on new ones. |

### Components required

| Component | In the design language? | Notes |
|---|---|---|
| Address block with hand-off affordance | **no** | Needs a DLS entry. Two device behaviours from one component; the mobile hand-off leaves the app, which no existing component does. |
| Place autocomplete at neighborhood grain | partly | Signup has one; F050 and F051 need the same control in two more contexts. Extract rather than triplicate. |
| Removable-list-row ("Your hoods") | yes | Follows the F042 `/you/following` row pattern. |
| Inline warning inside a composer | **no** | The Online warning is not an error, not a toast, not help text. Needs its own entry, and its placement is a ratified requirement rather than a style choice. |

### The one that will pass in build and fail in production

**F051's copy-not-reference criterion.** Reading the member's current hood at render time is cheaper to write, looks identical on every screen, and stays identical until the member edits their profile. A test that creates an Item and asserts its location passes under both implementations.

**The eval must mutate the profile and then re-read the Item, in that order.** F051 states this in the Why line; the review restates it because it is the single highest-value assertion in the cluster and the easiest to write uselessly. `community-platform.md` § Build note says it plainly — "copy the value, do not store a reference" — and adds the reason it needs saying: "however much cheaper it looks."

### CTA placement and copy

| Surface | Copy | Established pattern | Match? |
|---|---|---|---|
| Signup | "Where's your hood?" | New word (Ratified 2026-09-03), pending the connotation check | **conditional** — see below |
| Profile | "Your hoods" / "Add a hood" | Matches `/you` section patterns | yes |
| Composer | pre-filled hood; "Online" as a peer | Verb-first, surface-anchored | yes |
| Composer | the Online ranking warning | No precedent | **new pattern** |

**"Hood" ships before its own check has run.** `decision-surfaces.md` § Open — does "hood" land the way we intend? asks the PM to sanity-check the word with real members across the launch market **before** it ships in copy, noting that the connotations read as warm or as borrowed slang depending on who's reading, "and the second reading is worst precisely where the platform most wants to be trusted." F049 is the first surface that ships the word. **Either run the check before F049 ships, or ship F049 with "neighborhood" and sweep later** — the fallback is a copy change, which is why this is a flag and not a block.

### Empty / loading / error states

- **F048** — the copy affordance must report failure rather than showing a false success when clipboard access is denied. Covered.
- **F049** — the rural dead-end is the missing state, and it is the blocked beat. Covered as a block, not as a state.
- **F050** — last-hood removal is refused with a plain explanation; cap-reached is refused naming the limit. Covered.
- **F051** — geocode failure must not publish an Item with an unresolved location. Covered.

### Design verdict

**PROCEED** for F048 and F049 (with the "hood" copy flag). **PROCEED-with-DLS-additions** for F050 and F051: two new component entries (address hand-off block, inline composer warning) and one extraction (place autocomplete).

---

## Apple legibility

**Two flags.**

1. **The address hand-off is an App Intents candidate and should be shaped as one now.** "Get directions to this Item" is a natural intent, and F048 builds exactly its mechanic. If it ships as an inline `href` with device sniffing, the behaviour is stranded in a component; if it goes through a named action, it maps 1:1 later. Cheap to get right at build, expensive to retrofit.
2. **The stored hierarchy improves entity exposure.** An Item that carries its own place levels can emit stable schema.org location data on a public page without a runtime venue join — better for Spotlight indexing than today's `nearest_location_id`, which points at whichever venue was attached first.

Otherwise clean: no scenario relies on query params for surface identity (F048 explicitly *removes* two params), and the writes all route through named handlers.

---

## Sibling-consistency findings

**Siblings checked:** F044 (list/map toggle), F045 (filter sheet + chips), F046 (nav hide), F031 (near-me reach), F030 (signup), F042 (follow everything).

- **F048 ↔ F045 — direct collision, and F045 loses on purpose.** F045's filter sheet ships a distance section; F048 deletes it. This is a deliberate scope removal of correctly-built work, **not** a defect in F045. The T115 ticket and F045's scenario should both be annotated rather than silently edited, so the record shows a scope change and not a bug.
- **F048 ↔ F031 — F031 is superseded.** Its reach control is a radius control and its rural picker ranks metros by distance. Both mechanisms are gone. F031 should be archived or rewritten during `close`/`tidy`; leaving it in backlog reading as live is a drift-check finding waiting to happen.
- **F049 ↔ F030 — same surface, sequential change.** F049 modifies the locality step F030 shipped. No conflict; the ticket writer reads both.
- **F050 ↔ F042 — shared row pattern.** `/you/following` established the removable-list-row with an inline destructive action. "Your hoods" should match it rather than introduce a second shape on the same page.
- **F051 ↔ every shipped composer — extract the base.** Gathering, product, and service composers each collect a location today. F051 changes what that field *is* for all of them. **PROCEED-with-extract-note:** the first ticket touching any composer extracts a shared location-entry control; three divergent implementations of a field carrying a ratified privacy mechanism is the failure mode.
- **Vocabulary** — consistent. The scenarios use Event / Product / Service / Idea per the naming table, keep "hood" to copy, and keep `places.kind='neighborhood'` in schema references. No layer mixing found.

---

## Recommendations for the ticket writer

1. **Write F048 as a removal.** Its acceptance is mostly absence. Assert on the absence of a mile-unit pattern across rendered output rather than on the removal of a named component — the number appears in several places and a component-scoped test passes while a card still shows it.
2. **Handle the stale URL params explicitly.** `?distance=` and `?sort=nearest` links exist in the wild from the moment T115/T116 merged. Ignore, don't error — and assert the params are *dropped from the serialized URL*, not merely inert. A lingering param re-serializes into the next share.
3. **Resolve the stated-vs-derived metro column before writing F049's ticket.** It is a schema question with a product consequence, and it is the difference between an override that holds and one that silently reverts.
4. **Order the F051 copy-not-reference test as: create Item → mutate profile → re-read Item.** Any other order passes under the wrong implementation.
5. **Assert Online's absence from the map by pin count**, not by checking that no Online pin renders. A fallback coordinate produces a pin that is indistinguishable from a real one unless you count.
6. **Assert the Online warning's adjacency and default visibility**, not the presence of its string. A warning behind a disclosure is not the ratified requirement.
7. **Extract the composer location control in the first ticket that touches any composer.**
8. **Do not touch `MarketSelector.tsx`'s `haversineMiles`** in the F048 ticket. It belongs to the vendor/market retirement; entangling two removals makes both harder to review.
9. **`DEVIATIONS.md` entry is mandatory at every ticket close**, including "no deviations" (rebuild rule 6).

---

## Decisions captured

- The cluster splits into a **precondition** (F048), a **write path** (F049 → F050 → S-hierarchy → F051) that does not touch the feed query, and a **read path** (F052, F053) that does. The write path can run alongside the Home/Explore merge; the read path cannot.
- **F048 is the merge's precondition**, not a preference — it deletes `sort=nearest` (the merge's sharpest ranking conflict), prevents porting dead distance code, and prevents porting the `?place=` origin defect into Home's ranking path.
- **The merge does not need the stored hierarchy.** The hierarchy changes the sort key, not the architecture. Blocking the merge on a substrate migration would be the expensive read of a decision meant to make things cheaper.
- **Q1 (ranking authority) is one question, not two.** F052 and the merge need the same answer; it should be answered at merge scope.
- Two of the PM's four stated open questions — required-field and when-to-ask-for-a-hood — **are already answered in `decision-surfaces.md` § Resolved.**
- **The rural / no-metro path lost its fallback today** and has no ratified replacement. Not on the PM's list; surfaced here.
