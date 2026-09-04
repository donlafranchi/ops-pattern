---
id: how-f050-member-manages-saved-hoods-on-their-profile
purpose: Backlog scenario — a member keeps a set of hoods on their profile; the set is the pre-fill source for creation and the source for the browse switcher.
layer: how
status: draft
---

# F050: A member keeps a set of hoods on their profile

**Bundle:** b2 recommended (see `plan-location-model-sequence.md`)
**Sub-bundle:** n/a at b1 — this is new profile surface plus a substrate call, and nothing in the b1 checklist requires it.
**Work-map item:** No existing checklist row. If the PM elevates this into b1, the checklist needs a "Your hoods" line under *What newcomers can do*; do not ship it against an absent row.
**Loops:** 3 (Land here), 8 (Follow what you love)
**Canonical example:** [C2 — A member organizes awareness across multiple Places](../../product/needs/use-cases.md#c2-a-member-organizes-awareness-across-multiple-places) — the member who lives in Oak Park and works in Folsom, whose life is genuinely in two hoods.
**Primitive shape:** Person → a set of Places at neighborhood grain. **Not** a Person↔Location affinity table — `location.md` § Member records that the six-kind `member_location_affinities` substrate is retired.
**Spec contract:** `community-platform.md` § The field is required, and pre-filled from the Member's saved hoods (Ratified 2026-09-03); `decision-surfaces.md` § A Member has a set of saved hoods, and they pre-fill creation
**Status:** backlog

> **This scenario delivers nothing on its own.** Saved hoods are a *pre-fill source* (F051) and a *switcher source* (F053). Shipped alone, a member curates a list that does nothing. Ship it with F051 or don't ship it. Called out here so the sequencing decision is visible in the scenario rather than only in the plan.

## The Person

She lives in Oak Park and works in Folsom, and both are real to her — she posts a tool-lending offer from her kitchen and a lunch ask from near the office, and a single home address makes one of those two wrong every time. Today the platform holds one place for her and treats the other half of her week as somewhere else.

## The Story

She opens her profile and finds **Your hoods**, with Oak Park in it from signup. She adds Folsom. Two entries, no ceremony, no "primary" star to reason about — the platform already knows which metro centers her feed because she picked one at signup, and both hoods sit inside it anyway.

Months later she moves to Davis. She adds Davis and removes Oak Park. Her feed re-centers; her next post pre-fills to Davis. **The gathering she hosted in Oak Park last spring is still in Oak Park**, on its page, in the index, in anyone's saved link — because an event that happened in Oak Park did not move when she did.

## Surfaces

- **Entry point:** the member's own profile (`/you`), a section titled **Your hoods**.
- **Primary action:** "Add a hood" — the same neighborhood-grain place autocomplete signup uses.
- **Composer / interaction:** a list of saved hoods, each removable. No ordering, no primary/secondary distinction surfaced to the member.
- **Completion:** the member stays on the profile; the change takes effect on the next creation and the next browse.
- **Discovery:** the set feeds the creation pre-fill (F051) and, deduplicated to the metros the hoods resolve to, the browse switcher (F053).

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| A saved hood | a Place at `kind='neighborhood'` — **substrate call, see Assumptions** | at least one |

Implicit: an add event and a remove event, so the set's history is auditable. `resolve_home_metro()` must **not** rewrite the member's stated metro on either (see F049).

## Acceptance Criteria

### The set is visible and editable on the profile

**Given** a member with one saved hood from signup
**When** they open their profile
**Then** a "Your hoods" section lists it and offers "Add a hood."

**Given** the member adds a second hood
**When** the section re-renders
**Then** both are listed and each can be removed.

### Removing the last hood is refused

**Given** a member with exactly one saved hood
**When** they try to remove it
**Then** the removal is refused with a plain explanation that their feed needs a hood. _Why: the hood is the top ranking band and the creation pre-fill source; a member with none falls back to a state that F049 spends a required signup field preventing. Refusing is better than silently re-deriving one, which would be the platform guessing at something it just refused to guess at._

### Adding a hood does not move the member's metro

**Given** a member whose stated metro is Sacramento
**When** they add a hood that resolves to a different metro
**Then** their stated metro is unchanged and their feed still centers on Sacramento. _Why: F049 ratifies the metro as stated rather than derived. **What the platform should offer at that moment — switch, stay, or ask — is `decision-surfaces.md` open question 4 and is not answered.** This criterion pins only the safe half: whatever the answer, it must not happen silently. The eval asserts no silent change; the affordance itself waits on the PM._

### The saved set does not exceed the cap

**Given** a member at the hood cap
**When** they try to add another
**Then** the add is refused with a plain message naming the limit. _Why: unbounded lets a member accumulate a whole metro one hood at a time, which quietly turns a locality product into a national one (`decision-surfaces.md` § What the plural set does to the feed). **The number is not ratified.** `member_place_interests` already caps `secondary` Places at five; `scope` recommends adopting five for consistency rather than inventing a second limit, but the PM sets it — the criterion is testable the moment a number exists._

### Editing the set never touches existing Items

Covered in **F051**, where an Item with a copied hood exists to test against. Stated here so the rule is visible from the surface that triggers it: **the profile set is where the *next* Item's location comes from, never where an *existing* Item's location is read from** (`community-platform.md` § Build note — this is a default, not inheritance).

## Edge Cases

- **A hood the member's metro does not contain.** Allowed — a member may genuinely have a hood in another metro. It simply does not rank in the active metro's feed until they switch (F053).
- **Two members saving the same hood.** No interaction; a saved hood is a private profile fact, not a membership. It must not become an addressability surface — `location.md` § Policy posture is explicit that place-interests are not one.
- **A `places` row that is retired or merged after a member saved it.** Out of scope; place curation lifecycle is `places.md`'s problem and has no ratified answer for downstream member references.

## Assumptions

- **Substrate call, confirm at `review` before ticketing:** whether saved hoods reuse `member_place_interests` (which already carries `primary_home` plus up to five `secondary` Places, with live add/remove handlers) or warrant a new table. `decision-surfaces.md` flags this explicitly as a substrate call, not a product one. Reuse is the cheaper hypothesis and the existing handlers already do metro resolution; the risk is that `primary_home`/`secondary` semantics leak into a set the member is supposed to experience as flat.
- F049 has shipped, so at least one hood exists for every member.

## Out of Scope

- The creation pre-fill itself — F051.
- The browse switcher — F053 (blocked).
- Inferring hoods from browsing behaviour. **Not agreed**, b2+ at the earliest, and `decision-surfaces.md` records that it requires a per-member browse-tracking privacy posture the product has not taken. Anything scoped from this scenario must not assume it.
- Any hood-scoped feed, wall, or message surface. `location.md` § Not a complaint surface and `policy.md` hold the line: messaging is item-or-group scoped, never place-scoped.

## Capabilities unlocked

- **1. Presence & Findability** — a producer who works out of two places (a home kitchen and a stall) can be findable from both without maintaining two accounts.
- **5. Customer & Community Relationships** — nothing new; explicitly *not* an addressability capability, per the policy posture above.
