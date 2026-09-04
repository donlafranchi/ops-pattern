---
id: how-f049-newcomer-picks-a-hood-and-a-metro-at-signup
purpose: Backlog scenario — signup asks for a hood and, explicitly, a metro; both become durable profile state.
layer: how
status: draft
---

# F049: A newcomer picks a hood and a metro at signup

**Bundle:** b1
**Sub-bundle:** b1.0 (Show up & be seen) — extends the shipped signup flow (F030) rather than adding a theme.
**Work-map item:** "Sign up and land in a populated feed" — currently checked. This scenario changes *how* the feed gets populated: from a single derived place to an explicit hood + metro pair.
**Loops:** 3 (Land here)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the newcomer to Sacramento who sets Oak Park and immediately sees things nearby.
**Primitive shape:** Person → `member_place_interests`(`primary_home`, `place_id` at neighborhood grain) + an explicitly-picked metro → feed vantage point.
**Spec contract:** `community-platform.md` § The Member picks a hood *and* a metro at signup (Ratified 2026-09-03); `decision-surfaces.md` § Location is entered at creation → The Member picks a hood and a metro at signup; `discovery.md` § Community-awareness feed (metro default depth, memo-0026)
**Status:** backlog — **one beat blocked.** The rural / no-metro path has no ratified answer; see § Blocked beat.

## The Person

Someone who just downloaded the thing because a neighbor mentioned it. He lives in Oak Park. He does not think of himself as living in "the Sacramento-Roseville Combined Statistical Area," but he does think of himself as living in Sacramento, and he'd have no trouble saying so. What he wants from signup is to be done with signup.

## The Story

He finishes the account step and the platform asks him one geography question in two parts on one screen: **where's your hood?** He types "Oak Park" and picks it from the autocomplete. Underneath, a metro field has already filled itself in with **Sacramento** — because Oak Park is in it — with a note that this is where his feed will be centered and a control to change it if that's wrong. It isn't wrong, so he doesn't touch it, and he's through.

The next person through this screen lives in Davis but works downtown and thinks of herself as a Sacramento person. Her hood resolves to a metro too, and it happens to be the right one. The third person lives in a hood right at the Stockton/Sacramento line, where derivation would have picked wrong; the pre-filled metro is a suggestion he overrides in one tap, and from then on the platform can never tell him he's in the wrong metro, because he's the one who said.

## Surfaces

- **Entry point:** the existing signup flow (F030), at the step that currently collects the home locality.
- **Primary action:** "Where's your hood?" — a place autocomplete at neighborhood grain.
- **Composer / interaction:** a second field, **metro**, on the same screen, pre-filled from the hood's resolution and editable. Not a separate step, not a modal, not buried in settings.
- **Completion:** the member lands in a feed centered on the metro they picked, with their hood ranked to the top of it (the ranking half is F052).
- **Discovery:** the picked metro is the vantage point for every browse surface from that moment.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Your hood | `member_place_interests(scope_kind='primary_home', place_id → places.kind='neighborhood')` | yes |
| Your metro | the member's default metro — `members.home_metro_id` if that column is the chosen home; **substrate call, see Assumptions** | yes |

Implicit: `member.place_interest.add` fires for the hood (existing handler). The metro pick needs its own recorded write so that a member-stated metro is distinguishable from a derived one — the whole point of asking.

## Acceptance Criteria

### Signup asks for a hood, in those words

**Given** a new member reaching the locality step of signup
**When** the step renders
**Then** the field asks for a **hood** and the copy uses "hood" rather than "neighborhood," "locality," or "area." _Why: `decision-surfaces.md` § The user-facing word is "hood" — this is a voice decision, and signup is the first place a member meets the word. It is copy only: `places.kind` stays `'neighborhood'` and no identifier changes, per `CLAUDE.md` § Naming conventions (schema names are durable)._

### The metro is asked explicitly, pre-filled, and overridable

**Given** the member has selected a hood that resolves to a seeded metro
**When** the metro field renders
**Then** it is pre-filled with the resolved metro, visibly labelled as the place their feed will be centered on, and changeable in one interaction without leaving the screen. _Why: `decision-surfaces.md` § The Member picks a hood and a metro at signup — the redundant question is deliberate. It buys an unambiguous default in the two cases derivation gets wrong: a hood near a metro line, and a member who wants a different metro than the one their hood falls in. If the field is read-only, or hidden when derivation succeeds, the decision has been implemented as derivation with extra steps and both cases regress._

### A stated metro is not overwritten by derivation

**Given** a member who overrode the pre-filled metro at signup
**When** any later process that derives a metro from a place runs — adding a place interest, re-resolving a hood, a backfill
**Then** the member's stated metro is unchanged. _Why: `resolve_home_metro()` is already wired into `member.place_interest.add` / `.remove` and derives the metro from a Place centroid. If it keeps writing after signup, the override silently reverts and the member is told they are in the wrong metro — the exact failure asking the question was meant to prevent. The eval must exercise a place-interest change after an override, not just check the value immediately post-signup._

### Both are editable later, from the profile

**Given** a member who has completed signup
**When** they open their profile
**Then** their hood and their metro are both visible and editable there. _Why: the Intent line on this decision rests on reversibility — "both are profile fields the Member edits later." A signup-only capture makes a one-tap decision permanent, which is a heavier commitment than the decision was ratified as._

### Signup cannot be completed without both

**Given** a member at the locality step with either field empty
**When** they try to continue
**Then** they cannot, and the empty field is identified. _Why: the metro is the feed's vantage point and the hood is the top ranking band; a member missing either lands in a feed with no centre. Required here is cheap — it is one screen, once — which is exactly the trade `decision-surfaces.md` § A Member has a set of saved hoods makes: pay the friction once at signup so creation stays free._

## Blocked beat — the rural member has no answer

**A member whose hood falls outside every seeded metro cannot complete this screen, and nothing ratified today says what should happen.**

`members.home_metro_id` is null outside every seeded CSA — migration `031` documents this as the rural fallback. The working answer, per F031, was to offer a **radius scope** instead of a metro, and to rank the nearest open metros **by distance from the member's home centroid**. F048 deletes both mechanisms. `decision-surfaces.md` says plainly that whether the radius fallback survives is "unexamined."

So the criterion cannot be written. Three shapes, each a different product:

1. **Pick from a list of all open metros**, unordered or alphabetical — honest, works with no distance math, asks a rural member to know which metro is "theirs."
2. **Seed coarser metro polygons that cover the rural gaps**, so every hood resolves to something — no new UI, but it makes "metro" mean something different in rural areas and lands squarely on the unowned-reference-data question.
3. **Allow a null metro and center the feed on the hood's parent city or county** — no picker at all; needs the ranking rule to define what "wider" means with no metro band.

**This does not block the rest of the scenario** — the Sacramento launch market is entirely inside a seeded CSA, so every other criterion is testable today. It blocks *shipping signup to anyone outside one*, which is a launch-scope question rather than a build one.

## Edge Cases

- **A hood with no `places` row.** Some neighborhoods have no universally recognized boundary and get no `neighborhood` row at all (`places.md` § Granularities can be skipped). The autocomplete must let the member land on the parent city, and the composer pre-fill (F051) must tolerate a city-grain hood.
- **A member who picks a metro their hood is not in.** Allowed and deliberate — that is the override case. Nothing warns them; they said what they meant.
- **A member who changes their hood later to one in a different metro.** What happens to the active metro is `decision-surfaces.md` open question 4 and is out of scope here; F049 covers signup only.

## Assumptions

- The signup flow and the `primary_home` place-interest path shipped with F030 and are live.
- **Substrate call, confirm before ticketing:** whether the member-stated metro lands in `members.home_metro_id` (which today holds a *derived* value) or in a new column that distinguishes stated from derived. Writing a stated value into the derived column is what makes the no-overwrite criterion above hard to hold. Flagged for `review`, not decided here.
- F050 (saved hoods as a set) may ship after this. This scenario captures **one** hood; the plural set is F050's job and does not gate signup.

## Out of Scope

- The plural saved-hood set and its management surface — F050.
- The metro switcher — F053 (blocked).
- Hierarchy ranking of the resulting feed — F052 (blocked).
- Inferring hoods from browsing behaviour — b2+ at the earliest, and `decision-surfaces.md` records it as **not agreed**, needing a privacy posture the product has not taken.

## Capabilities unlocked

- **1. Presence & Findability** — a member is placed in a locality from their first session, which is the precondition for every "Now" bullet in the category.
