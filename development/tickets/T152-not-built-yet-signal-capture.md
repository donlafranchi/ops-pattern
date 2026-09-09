# T152: "We haven't built this yet — want it?"

**Scenario:** F064 — someone asks for something that is not built
**Status:** Open — buildable.

> **Lane corrected 2026-09-07.** This ticket was written before its scenario and labelled `substrate`. **It is not substrate — the lane's own test is literal: if a Member can see the change, it is not substrate**, and this ticket's own M3 line contradicted its header. Now bound to F064, reviewed PROCEED. Content unchanged; the header was wrong.
**Bundle:** launch
**Depends on:** nothing. **Folds into:** the Page-identity migration (T141) — same migration, one hand-applied push.

**Serves:**
- **Loop:** 2 (Wonder) — the platform's own version of the thing it asks members to do: put it out there and see who wants it.
- **Canonical example:** n/a — mechanism.
- **Primitive shape:** none. A tap, a person, a timestamp.

## Why

**Volunteering and the idea mechanic are both deferred past the MVP.** They stay visible as options that say plainly they are not built, and **a tap registers that someone wants them.**

**The reason to surface rather than hide: the sign tells people where this is going, and the honest version of that is asking whether they want to go there.** Every tap is a data point the roadmap currently guesses at.

## What changes

### 1. One table

**`demand_signals`** — who asked, a subject kind (`'category'` or `'feature'`), a subject key, the member's own words when they typed some, and when. Indexed on the key, queryable in the console, **no admin UI.** Grouping and counting it is the surface.

> **Amended 2026-09-07 by the signals proposal** ([`../../planning/backlog/decision-a-general-signals-table.md`](../../planning/backlog/decision-a-general-signals-table.md)). **This table absorbs the category *Other* capture** — the two are the same record wearing two hats: *a person, a thing that does not exist as a row, a moment, one per person.* **One table instead of two, in one migration.** The subject key is deliberately **not** a foreign key, because the subject does not exist — that is the whole point of the mechanism.
>
> **It does not absorb RSVP, follows, or saves.** Those point at rows that exist and belong on their own substrates. **Adding them would couple the gathering page's write path to a roadmap-tap constraint** — see the proposal for the full reasoning.

**One signal per member per key.** A unique constraint, so a count means *people* and not *taps*. **This is the constraint `item_responses` was built without, and the reason its counts could never have been trusted.**

### 2. One handler

Through the action layer like every other write, with its event row in the same transaction. **Small, but it does not get a side door.**

### 3. One component, reused

Renders a not-yet-built affordance and records the tap. **Drop it anywhere appetite is worth testing** — that is the whole point of building it as a component rather than twice.

**States:** untapped, tapped, and signed-out. **Signed-out prompts sign-in rather than silently discarding** — an anonymous tap is a lost signal.

### 4. The copy — the hard part of this ticket

**Honest, and it never implies a date.**

- **Not** *"coming soon."* Not *"on the roadmap."* Not *"in development."* **A promise-shaped roadmap claim is exactly what was swept out of this repo on 2026-09-07** and it must not walk back in through an empty state.
- **Closer to:** *"We haven't built this yet. Want it?"* → after tapping: *"Noted. Thanks — that helps us decide what's next."*
- **Do not show a count.** A count invites *"so when?"*, which is the question we have no honest answer to. **The member needs to know their tap landed, not how they compare to strangers.**
- **Run `design:ux-copy`.** The wording carries the whole ticket; the code is trivial.

## Acceptance Criteria

- [ ] `demand_signals` exists with both subject kinds, indexed on the key, unique per (member, subject_kind, subject_key).
- [ ] Feature subject keys come from a **named constant in code**, never a string built at the call site — a typo silently splits one count into two (review F064, binding note 2).
- [ ] The category signal writes **in the same transaction as the Page**; the feature tap is its own transaction. Two write paths, deliberately (review F064, binding note 3).
- [ ] A second tap by the same member is a no-op, not a second row.
- [ ] The write goes through the action layer with its event row in the same transaction.
- [ ] The component renders in all three states and is used in at least two places — volunteering and the idea mechanic.
- [ ] **No user-facing string implies a date, a plan, or a commitment.** Reviewed against `promises.md`, not just proofread.
- [ ] Signed-out taps route to sign-in and the signal survives the round trip.
- [ ] Grouping the table by key and counting gives a ranked list of what people want, with no screen built.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3 `design:accessibility-review`** — **fires.** New component. The tapped state must be announced, not conveyed by colour alone.
- [ ] **M4** — fires if the migration ships separately rather than folded into T141.
- [ ] **`design:ux-copy`** — mandatory here, not optional.
- [ ] **DEVIATIONS entry.**

## Price

**Half a day.** The table-plus-write-plus-console-query pattern is being built anyway for the category capture; **this is the same pattern with a different key**, and folding the table into T141's migration means no extra production push.

**The estimate is for the mechanism. The copy is where the time actually goes** — and it should.

## Notes

- **Do not let this grow.** No voting, no comments on signals, no leaderboard, no "most requested" page. **A leaderboard is a roadmap promise with extra steps.**
- **Reuse it deliberately.** Anything anyone argues about building is a candidate for a tap instead of an argument.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
