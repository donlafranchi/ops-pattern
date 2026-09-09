---
purpose: Scenario — a member tells us they want something that doesn't exist: a category not on the list, or a feature not built. Captured, counted, never answered with a date.
layer: how
status: approved
---

# F064: Someone asks for something that isn't built

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 2 (Wonder) — the platform doing the thing it asks members to do: put it out there and see who wants it.
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services) — the category half is reached inside creating a Page.
**Primitive shape:** Person → a want, about something that has no row. **One new table, deliberately without a foreign key.**
**Spec contract:** [`decisions.md`](../../product/foundation/decisions.md) § 18 · [`groups.md`](../../product/systems/groups.md) § Other, and why the escape hatch is the instrument · [`promises.md`](../../product/foundation/promises.md)
**Status:** next — approved 2026-09-07.

## The Person

Two people, doing the same thing in two places.

**Priya** is making a Page for a mobile bike-repair round. She reads the twelve categories. **None of them is bikes.** She picks *Something else* and types "bike repair."

**Sam** is browsing and sees an option that says, plainly, that it isn't built yet — volunteering, and putting an idea to the neighbourhood before making it. **He wants both.** He taps.

**Neither is filing a request. Neither expects an answer.** They are telling us something, and today nothing is listening.

## The Story

Priya's typed words appear on her Page as her own description of what she does. **They do not become a filter, a badge, or a category anyone else can pick.** Search matches them, so someone looking for bike repair finds her.

Sam taps the option. It acknowledges: **"Noted. Thanks — that helps us decide what's next."** The control stays acknowledged. **He is not shown how many other people tapped it, and he is not told when it might exist.**

He taps it again out of habit. Nothing changes — **the platform already knows he wants it, and wanting it twice is not wanting it more.**

**The operator opens a console, groups the table by what was asked for, and orders by count.** No screen was built. The list is the answer to *what do people actually want*, which the roadmap has been guessing at.

## Surfaces

- **Entry points:** the category step of the Page composer *(the typed-words half)*, and any surface carrying a not-yet-built option *(the tap half)*. **At launch: volunteering, and the put-an-idea-to-the-neighbourhood mechanic** — both deferred past the MVP by PM ruling, both surfaced rather than hidden.
- **Interaction:** one tap, or one line of text. Acknowledged once.
- **Discovery:** none. **No public count, no leaderboard, no "most requested" page.** *A leaderboard is a roadmap promise with extra steps.*
- **Operator surface:** the database console. **No admin UI, deliberately.**

## Data captured

**One table — `demand_signals`:** who, a subject kind (`category` or `feature`), a subject key, the member's own words where they typed some, and when. Indexed on the key. **Unique per member per subject.**

**The subject key is deliberately not a foreign key.** The thing being asked for does not exist as a row — that is the entire point of the mechanism, and a text key is honest here rather than lossy. *(This is the one place that trade is correct; where the subject does exist — a gathering, a Page — the foreign key is used. See [`decision-a-general-signals-table.md`](../backlog/decision-a-general-signals-table.md).)*

**This table absorbs the category capture.** One table, one migration, two subject kinds.

## Acceptance criteria

**Given** a member choosing *Something else* and typing their own category
**When** the Page is published
**Then** a signal is written **in the same transaction as the Page**, carrying their words.
**And** the words render on their Page and are matchable by search.
**And** no browsable category, filter, or vocabulary entry is created.
*Why: promotion is a deliberate human act. No volume of identical entries promotes itself — [`groups.md`](../../product/systems/groups.md) § Other.*

**Given** a member tapping a not-yet-built option
**When** the tap lands
**Then** a signal is written through the action layer with its event row in the same transaction, and the control shows as acknowledged.

**Given** the same member tapping the same thing again
**When** the second tap arrives
**Then** it is a no-op, **refused by the unique constraint rather than by application code.**
*Why: a count that measures taps rather than people measures nothing.*

**Given** a signed-out visitor tapping
**When** they tap
**Then** they are routed to sign-in and **the signal survives the round trip.**
*Why: an anonymous tap is a lost signal.*

**Given** any string this scenario puts in front of a member
**When** it is reviewed
**Then** **none implies a date, a plan, a commitment, or a position in a queue.**
**And** it is checked against [`promises.md`](../../product/foundation/promises.md), not merely proofread.
*Why: "coming soon" is a promise-shaped roadmap claim, and promise-shaped claims were swept out of this repo on 2026-09-07. One must not walk back in through an empty state.*

**Given** a member who has signalled
**When** the control renders
**Then** **no count is shown to them.**
*Why: a count invites "so when?", which is the question we have no honest answer to. They need to know their tap landed, not how they compare to strangers.*

**Given** the operator
**When** they group the table by subject and count
**Then** they get a ranked list of what people want, **with no screen having been built.**

## Edge cases

- **Two members type the same words in different cases or with different spacing.** A normalised copy is what is counted; nothing de-duplicates at write time.
- **A signal for something that later ships.** The rows stay — **they are the record of why it was built**, which is the whole argument of § 18.
- **A member deletes their account.** Their signals go with them, and counts re-derive. **A want belongs to a person.**
- **Someone types abuse into the free-text field.** It renders on their own Page, so it is reachable by the report path like any other content. **No new moderation surface.**

## Capabilities unlocked

- The vocabulary can grow from evidence instead of anticipation.
- The roadmap can be argued with a count instead of an opinion.
- **The platform holds itself to the standard it asks of members** — test demand before building. *(This is the point, and it is worth more than either mechanic.)*
