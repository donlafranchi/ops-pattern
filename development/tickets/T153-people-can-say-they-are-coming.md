# T153: People can say they're coming

**Scenario:** F063 — someone says they are coming
**Status:** Open — buildable.

> **Lane corrected 2026-09-07.** This ticket was written before its scenario and labelled `substrate`. **It is not substrate — the lane's own test is literal: if a Member can see the change, it is not substrate**, and this ticket's own M3 line contradicted its header. Now bound to F063, reviewed PROCEED. Content unchanged; the header was wrong.
**Bundle:** launch
**Depends on:** nothing. **Unblocks:** the popularity ordering already in the plan, which currently has no data source.

**Serves:**
- **Loop:** 4 (Gather regularly) — a gathering nobody can say they're coming to is the gather half of the product not working.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** Person → response → Item. **No new table.**

## The defect

**`item_responses` has no write path anywhere.** No handler, no button, no route. **It is read in four places and written in none**, and it ships without a unique constraint — so even once something wrote to it, one person could respond fifty times and the count would read fifty.

**A gathering page with no way to say you're coming does not lack a feature. It misrepresents itself.**

## Scope — narrowed by the following ruling

**In:** `rsvp` and `interest`.

**Out, and removed rather than deferred:** `follow` and `save` **on an Item.** *(PM ruling 2026-09-07: you follow Pages — businesses, groups, and non-business creators. Following a product or a service is not a concept this product has.)*

**What that actually removes is smaller than it sounds, and worth stating honestly:**

- **Nothing is deleted from the codebase** — the listing-follow path was never built. **The removal is conceptual: it comes out of the plan, not out of the code.**
- **`response_kind` keeps `follow` and `save` in its CHECK vocabulary.** Do not narrow the constraint in this ticket — that is a migration to buy nothing. **Nothing writes them; leave them unwritten and drop them from the vocabulary whenever that constraint is next touched for another reason.** Record the intent so a future reader doesn't assume they're live.
- **The real saving is surfaces not built:** one response control on the gathering page instead of three across gathering, product and service pages, and no listing entries to fold into the following list.

## What changes

- **`item.respond` and `item.withdraw_response` handlers**, each writing its row and its `item_events` row in the same transaction. The event kinds already exist in the constraint — `item.responded` and `item.response_withdrawn`.
- **A unique constraint** per `(item_id, member_id, response_kind)` among active rows. **A count that measures taps rather than people measures nothing.**
- **One control on the gathering page** — tapped, untapped, and signed-out. Signed-out prompts sign-in and the intent survives the round trip.
- **The count renders where the response does**, from the same read the page already makes.

## Acceptance Criteria

- [ ] A signed-in member can say they're coming to a gathering, and can withdraw.
- [ ] A second RSVP from the same member is a no-op, **enforced by the constraint, not by application code.**
- [ ] Row and event commit in the same transaction; neither can exist without the other.
- [ ] The count on the page reflects people, not taps, and updates after a response.
- [ ] Signed-out tap routes to sign-in and completes afterward.
- [ ] **No `follow` or `save` response is written by any code path**, and a comment at the handler says why.
- [ ] `BUILD-LOG.md` updated.

## What this fixes beyond RSVP

- **The browse sort by responses stops lying.** It is a shipped control ordering by a column that is currently zero for every row, with nothing telling the member.
- **The popularity ordering already in the plan gets its data.** It was priced at half a day against `response_count` being in the browse payload. It is in the payload and it is permanently zero.

## Workflow gates

- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3 `design:accessibility-review`** — fires. New control; the tapped state must be announced, not colour-only.
- [ ] **M4** — fires. New constraint is a migration. **Fold it into the Page-identity migration if that has not shipped.**
- [ ] **DEVIATIONS entry.**

## Price

**About three-quarters of a day.** The handler pair and the constraint dominate; the following ruling takes out two of three surfaces, which is a real reduction but a small one.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
