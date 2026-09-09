---
purpose: Scenario — a member says they're coming to a gathering and can take it back. The write path for a table that ships with four readers and no writer.
layer: how
status: next
---

# F063: Someone says they're coming

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 4 (Gather regularly), 8 (Follow what you love)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → response → Item. **No new table, no new entity, no new event type** — all three already exist and are unused.
**Spec contract:** [`item.md`](../../product/systems/item.md) § Responses · [`action-layer.md`](../../product/systems/action-layer.md) § Same-transaction row+event invariant · [`decisions.md`](../../product/foundation/decisions.md) § 18
**Status:** next — approved 2026-09-07.

## The Person

Rae finds a repair café on Saturday morning, three streets away. The page tells her when it is, where it is, and who's running it. **There is nothing on it she can press.**

She wants to do the smallest thing a person does with an event: say she's coming. **She cannot, and neither can anyone else** — so the host has no idea whether to bring four chairs or forty.

**This is not a page missing a feature. It is a page that misrepresents itself** — it looks like something you respond to.

## The Story

Rae taps **I'm coming**. The control fills in, the count beside it goes from 6 to 7, and nothing else on the page moves.

She changes her mind on Thursday. She taps it again; it empties, the count drops back. **No confirmation dialogue, no "are you sure" — taking it back is as cheap as saying it, which is what makes people willing to say it.**

She taps it twice by accident on a slow connection. **Nothing happens the second time** — the count is still 7.

Her friend, not signed in, taps the same control. He's asked to sign in, and **when he lands back on the page he is already marked as coming** — the tap survived the round trip.

**The host opens their gathering and sees a number.** For the first time, it is a number of people.

## Surfaces

- **Entry point:** the gathering page. **One surface, not three** — *(PM ruling 2026-09-07: you follow Pages, not products or services; following a listing is not a concept this product has.)*
- **Primary action:** one control, two states, no menu.
- **Discovery:** the count renders beside the control, from the read the page already makes.
- **Not here:** notifications to the host, a list of who's coming, calendar export, waitlists, capacity.

## Data captured

| Field | Where | Notes |
|---|---|---|
| The response | `item_responses` — **exists, has four readers and no writer** | `rsvp` and `interest` only. |
| Uniqueness | **new** constraint on `(item_id, member_id, response_kind)` among active rows | **The table shipped without one.** A count that measures taps rather than people measures nothing. |
| The count | `discoverable_items.response_count` — **exists, computed, permanently zero** | Starts meaning something the moment anything writes. |

**Event types already exist** in the constraint — `item.responded` and `item.response_withdrawn`. Nothing has ever emitted them.

**Out of scope and removed rather than deferred:** `follow` and `save` on an Item. **They stay in the `response_kind` vocabulary** — narrowing that constraint is a migration to buy nothing — **but no code path writes them, and a comment at the handler says why.**

## Acceptance criteria

**Given** a signed-in member on a gathering page
**When** they tap the response control
**Then** a response row and an `item_events` row are written **in the same transaction**, and the count increases by one.
*Why: the row-and-event invariant is how every write here stays auditable. Neither may exist without the other.*

**Given** a member who has already responded
**When** they tap again
**Then** the response is withdrawn, the count decreases, and an event records the withdrawal.
**And** no dialogue asks them to confirm.
*Why: a response you cannot cheaply take back is one people hesitate to give.*

**Given** the same member responding twice — double tap, retry, two tabs
**When** the second write arrives
**Then** it is refused **by the unique constraint, not by application code**, and the count is unchanged.
*Why: application-side de-duplication fails exactly when it matters — concurrently. See [`decisions.md`](../../product/foundation/decisions.md) § 18.*

**Given** a signed-out visitor
**When** they tap
**Then** they are routed to sign-in, and **on return their response has been recorded.**
*Why: an intent that evaporates at the sign-in wall is a lost response and a small insult.*

**Given** any gathering page
**When** the count renders
**Then** it counts distinct people, not rows.

**Given** any code path in the application
**When** it writes a response
**Then** the kind is `rsvp` or `interest`. **No path writes `follow` or `save`.**

## What this unblocks — both already in the plan, neither can work without it

- **The browse sort by responses.** A shipped control that orders by a column that is zero for every row, for every item, always. **It works, it does nothing, and nothing tells the member.** This is the first thing that makes it honest.
- **Popularity ordering — *"best is best, and people will tell us what they think is best."*** Priced at half a day on the strength of the count already being in the browse payload. **It is in the payload and it is permanently zero**, so every Page would sit in the no-signal bucket forever and the reserved-share rule would be the only rule that ever fires. **That half-day produces nothing until this ships.**

## Edge cases

- **A gathering that has already happened** still accepts a withdrawal but not a new response. *Nobody is coming to Tuesday on Wednesday.*
- **A member who deletes their account** — the response row cascades with the member; the count re-derives.
- **The host responding to their own gathering** is allowed. They may well be coming.
- **A response to a withdrawn or deleted Item** — refused by the foreign key, which is why the foreign key is the right tool here and a polymorphic subject would not have been.

## Capabilities unlocked

- A host can tell how many people to expect *(the smallest thing that makes hosting worth doing)*.
- The platform has its first real signal of what people want, which is what every ordering decision in the plan assumes exists.
