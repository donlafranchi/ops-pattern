---
id: how-f051-member-sets-an-items-location-while-creating-it
purpose: Backlog scenario — the composer asks for the Item's location (hood, address, or Online), pre-filled from saved hoods, copied onto the Item and owned by it.
layer: how
status: draft
---

# F051: A member sets an Item's location while creating it

**Bundle:** b2 recommended — **conditional b1** if Wonder (b1.5) ships inside b1. See `plan-location-model-sequence.md`.
**Sub-bundle:** b1.5 if elevated (Wonder is the first b1 kind with no venue of its own); otherwise b2.1 alongside Offer/Ask.
**Work-map item:** No existing checklist row. Elevating this into b1 requires adding one — the b1 checklist's producer and gatherer rows all describe Items that attach to a Location, which is precisely the case this scenario is *not* about.
**Loops:** 2 (Float an idea), 4 (Gather regularly), 7 (Make and be found)
**Canonical example:** [O4 — A member floats an idea to test interest before committing to host](../../product/needs/use-cases.md#o4-a-member-floats-an-idea-to-test-interest-before-committing-to-host) for the hood-only case; [O1 — A group meets at a regular time and place](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) (Drake's) for the address-override case.
**Primitive shape:** Person → Item(any kind) → a location the Member entered, resolved once into stored place levels on the Item. **Not** Person → Item → live read of Person's place.
**Spec contract:** `community-platform.md` § Location is entered at creation, § The field is required and pre-filled, § Online is a location option, § Build note — this is a default, not inheritance; `item.md` § Provenance claims (the guard); `decision-surfaces.md` § Location is entered at creation
**Status:** backlog — **one beat blocked.** Creating while browsing another metro has no ratified answer; see § Blocked beat.

## The Person

He's been thinking about a Sunday coffee walk in his neighborhood but doesn't want to commit to hosting before he knows if anyone would come. So he floats it. There is no venue — there's no *anything* yet, that's the whole point of floating it — but the idea is unmistakably about **his** neighborhood, and if it surfaces to people across the metro instead of to the people who'd actually walk, it dies of irrelevance rather than of disinterest.

The second person here is hosting an ask at her own house: a table of extra tomatoes, come take some. The location is her home address, and she is not publishing her home address to a public index. Without a coarser option she picks the only safe choice available, which is not to post.

## The Story

He taps **+**, writes one sentence about the coffee walk, and sees the location field already filled in with **Oak Park** — his one saved hood. He doesn't touch it. Done.

She writes her tomatoes ask and sees the same pre-filled **Oak Park**. That is exactly what she wants published: precise enough that a neighbor two streets over sees it, coarse enough that her address stays hers. Where the tomatoes actually are gets worked out in a message with the one person who's coming.

The third person is hosting the Thursday run at Drake's, which is a real place with a real address. She taps the pre-filled hood, types Drake's address over it, and the Item is anchored there — the pre-fill set her common case, not her only case.

The fourth is running a class over video. He picks **Online**, and right there, next to the choice as he makes it, the composer tells him plainly that Online posts rank below local ones. He picks it anyway, knowing.

## Surfaces

- **Entry point:** any Item composer, reached from **+** or from a surface-anchored CTA.
- **Primary action:** the location field, pre-filled.
- **Composer / interaction:** three peers — (1) the saved hood, pre-filled; a pick-from-set control appears **only** when the member has more than one; (2) enter an address or a hood; (3) **Online**, carrying its warning inline.
- **Completion:** the Item's public page shows the location at the grain the member chose.
- **Discovery:** the Item's stored place levels are what every browse query reads (F052).

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Where is this? | the Item's own stored place hierarchy — hood / city / county / metro / state, resolved once at creation (**substrate group S-location-hierarchy**) | yes |
| A street address, when given | the attached Location's `street_address` (Member-authored free text; unnormalized) | optional |
| Online | an explicit value on the Item, not an absence | — |

Implicit: `items.kind` and `member_id` set by the surface. Resolution runs **once**, at write. The Item stores values, **never a pointer to the member's profile**.

## Acceptance Criteria

### One saved hood means no picker

**Given** a member with exactly one saved hood
**When** they open any composer
**Then** the location field is pre-filled with that hood and **no picker, list, or extra step appears**. _Why: `decision-surfaces.md` § A Member has a set of saved hoods — "a feature meant to remove friction must not add a tap for the Member who needed it least." A list of one is the specific failure this criterion exists to catch, and it is the natural thing to build if the picker is written first and the single case treated as a degenerate instance of it._

### Two or more hoods means a pick-from-set

**Given** a member with two or more saved hoods
**When** they open a composer
**Then** one is pre-filled and the others are selectable without typing.

### The address override is a peer, not a fallback

**Given** any composer with a pre-filled hood
**When** the member wants a specific address
**Then** entering one is available directly, at the same level of prominence as the pre-fill, and replaces it. _Why: `community-platform.md` § Location is entered at creation — the coarse and the precise option are peers; "hood-as-default does not mean hood-only precision." If the address path is nested behind an "advanced" or "change" affordance, every venue-anchored Item pays a friction tax the decision did not impose._

### Hood-only entry publishes no address

**Given** a member who leaves the pre-filled hood in place
**When** the Item's public page renders to anyone
**Then** the location shown is the hood, and no street address is stored or displayed. _Why: this is the privacy mechanism, not a convenience — `decision-surfaces.md` § Neighborhood-level entry is the privacy mechanism. It is what makes the at-my-house case (the tomatoes ask) possible at all. An implementation that quietly geocodes the hood to a representative street address and stores it defeats the entire decision while passing a test that only checks the rendered label._

### Online carries its warning at the point of choice

**Given** a member choosing Online
**When** they select it
**Then** a plain-language warning that Online posts rank below local ones is visible **in the composer, adjacent to the choice** — not in help text, a tooltip, a settings note, or a post-submit confirmation. _Why: `decision-surfaces.md` § Online is a location option — "the warning is the only thing that makes imposing it honest … that is the difference between a ranking rule and a dark pattern." Placement is the criterion, not existence; a warning the member does not see at the moment of the trade is not a warning. The eval must assert on adjacency and default visibility, not on the string being present in the DOM._

### Online Items never render on the map

**Given** an Item whose location is Online
**When** the map renders
**Then** it is absent — no pin, no fallback coordinate, no clustered "online" marker. _Why: a pin asserts "this is here," and an Online Item is not anywhere. Also asserted in F048; kept here because F051 is where the Online value is first created and a fallback coordinate is most likely to be introduced._

### Location cannot be left empty

**Given** a member who clears the location field and enters nothing
**When** they try to publish
**Then** they cannot, and the field is identified. _Why: `decision-surfaces.md` records "is location required?" as **resolved: yes** — the friction objection is answered by the pre-fill, not by making the field optional. An Item with genuinely no location "should not occur on the create path; if one appears, it is a defect to fix at the source, not a case for the ranker to interpret."_

### Editing a saved hood does not move past Items

**Given** an Item created against the hood "Oak Park"
**When** the member edits or removes Oak Park from their profile's saved set
**Then** the Item still shows Oak Park, still ranks from Oak Park, and its stored place levels are unchanged. _Why: `community-platform.md` § Build note — "copy the value, do not store a reference." This is the single criterion most likely to pass by accident during build and fail in production: reading through to the profile is cheaper to write and looks identical until the member edits their profile. The eval must mutate the profile and then re-read the Item, in that order._

### An override is permanent to that Item

**Given** an Item created with an address that overrode the pre-fill
**When** the member later changes their saved hoods
**Then** the Item keeps its address. _Why: same rule, second direction. A default must never overwrite a statement._

### The entered location never becomes a provenance claim

**Given** a member entering any address on any Item
**When** the Item is stored and rendered
**Then** `made_at_place_id` and `made_at_verification_source` are untouched and no "Locally Made" badge renders. _Why: `item.md` § Provenance claims carries a State-tagged Intent (Ratified 2026-05-23) refusing auto-population of provenance from any other location field; the 2026-09-03 check confirms member-entered location does not trigger it **provided this guard holds**. Where the Item *is* and where a product was *made* are different questions with different failure modes — one is a bad sort order, the other is a false advertisement._

## Blocked beat — creating while browsing another metro

**A member who has switched to Portland taps + . What pre-fills?** Their Sacramento hood, which is wrong for what they're doing, or Portland, which means the switcher silently changed where they post from.

`decision-surfaces.md` open question 9 is explicit that this is unanswered and that the answer "sets whether the switcher is a read affordance or a full context switch" — and it names the real risk on the other side: "the beginning of remote spam."

**This does not block the rest of the scenario**, because the switcher itself is F053 and also blocked. If F051 ships before F053, the case cannot arise and the criterion is unnecessary. If they ship together, this must be answered first.

## Edge Cases

- **A member with zero saved hoods** (possible only if F050's last-hood refusal is not yet built, or for accounts predating F049): the composer falls back to "enter an address or a hood," with no pre-fill. It must not derive one from anything.
- **An address that geocodes to nothing.** Resolution fails; the member is told, and can fall back to a hood. The Item is not published with an unresolved location. Handled in the substrate group, surfaced here.
- **A hood with no `places` row** (`places.md` — some neighborhoods have no recognized boundary): resolves to the parent city and stores a shallower hierarchy. Legal, not an error.
- **An Item attached to multiple venues** (O3, the multi-venue series): out of scope. The stored hierarchy removes the "nearest venue" premise, but which levels a multi-venue Item stores is a substrate question, not a composer one.

## Assumptions

- F050 has shipped, so a saved set exists to pre-fill from. Without it this scenario is a required empty field on every composer — the exact friction the pre-fill decision exists to remove.
- **Substrate group S-location-hierarchy has shipped**, so there is somewhere to resolve into. See `plan-location-model-sequence.md`.
- Existing venue-anchored composers (gathering, product, service) already collect a Location. This scenario changes what that field *is* — from "pick a venue" to "enter a location, at your chosen grain" — which is a rework of shipped composers, not only a new field on new ones. The ticket writer should scope that rework explicitly.

## Out of Scope

- Address normalization, validation, or canonicalization. `location.md` § What does not ship at b1 defers it with a State-tagged Intent (Ratified 2026-05-23) and **that deferral stands**. `street_address` remains Member-authored free text.
- Ranking the resulting Items — F052 (blocked).
- Editing an Item's location after creation. Not addressed by any decision ratified today; if a member can edit it, the copy-not-reference rule needs a companion rule about what an edit means.

## Capabilities unlocked

- **1. Presence & Findability** — a producer or host controls the grain at which they are findable, which is what makes a home-based producer findable at all.
- **3. Locality & Trust Signals** — the Item's locality is member-stated, keeping it structurally separate from the verification ladder in `business-jurisdiction.md`. No new trust claim is created here, deliberately.
