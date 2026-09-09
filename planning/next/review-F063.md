---
purpose: Review — F063, the response path. Verdict PROCEED with three binding notes.
layer: how
status: next
---

# Review — F063: someone says they're coming

**Scenario:** [`scenario-F063-someone-says-they-are-coming.md`](scenario-F063-someone-says-they-are-coming.md)
**Ticket:** T153 — **written before this scenario existed. See § Process finding.**
**Reviewer:** `review` — 2026-09-07
**Verdict:** **PROCEED.**

## Gates

| Gate | State |
|---|---|
| **Gate A** — unratified absolutes in cited spec | **Clear.** The one absolute this encodes — *a signal is unique per person, enforced by a constraint* — is `decisions.md` § 18, Ratified 2026-09-07. |
| **Gate B** — absolutes the code encodes | **Clear.** |
| **M1** — architecture | Below. |
| **M3** — accessibility | **Fires.** New control. Below. |

## Binding notes

### 1. The constraint is partial, and getting it wrong silently breaks withdrawal

Withdrawal is a **soft** operation — the row stays so the event chain survives. **So the unique constraint must cover active rows only.** A constraint over all rows makes re-responding after a withdrawal fail with a duplicate-key error, which will look like a random bug months later.

**Name the predicate explicitly in the migration and test the withdraw-then-respond-again path.** That sequence is the one a real person does and the one a happy-path test skips.

### 2. The count must not be maintained in two places

`response_count` is computed in the browse index; the gathering page reads its own count. **Two derivations of one number drift, and the drift is invisible because both look right in isolation.**

**One read path for the page's count.** If the index is refreshed on response, say so in the ticket; if it is not, the page count and the browse count will disagree and **that is a known lag, recorded, not a bug discovered later.**

### 3. Leaving `follow` and `save` in the vocabulary needs a comment, not just an omission

The scenario correctly declines to narrow the CHECK constraint — a migration to buy nothing. **But an unused enum value is indistinguishable from a live one to the next reader**, and the next reader will be someone deciding whether to build listing-follows.

**One comment at the handler and one on the column**, both saying the same thing: these are not written, following is a Page-level concept, ruled 2026-09-07.

## Architecture (M1)

- **Nothing new-shaped.** No table, no entity, no event type — all three exist and are unused. **This ticket's whole content is the write path that was never built.**
- **The foreign key is doing real work here**, and the contrast with the demand-signal table is worth stating: a response points at an Item that exists, so it cascades on delete and the count self-heals. **The scenario's edge case about responding to a deleted Item is answered by the schema, not by code.**
- **The transaction boundary is the load-bearing part.** Row and event together, count derived rather than stored on the item. **Do not add a denormalized counter column to `items` to save a join** — that is a third copy of the number, and note 2 already covers two.

## Accessibility (M3)

- **The control is a toggle button with a pressed state**, not a link and not a checkbox styled as a button. The pressed state is exposed to assistive technology, not conveyed by fill colour alone.
- **The count change is announced politely** — someone who cannot see the number move needs to know the tap worked.
- **The accessible name says what it does in both states** — "I'm coming" / "You're coming, tap to withdraw" — rather than a bare icon or a name that stays static while the state flips.
- **The sign-in round trip must not lose focus.** On return the member lands on the control they pressed, not at the top of the page.

## Process finding — the ticket preceded the scenario

**T153 was written before this scenario existed, and it was labelled `substrate`.**

**It is not substrate. The lane's own test is literal: *if a Member can see the change, it is not substrate.*** A button on a gathering page is a surface, and M3 fires on it — which the ticket itself acknowledged, contradicting its own header.

**This is the same failure the build agent caught earlier the same evening** — work briefed with nothing approved underneath it. **It was caught there by the agent refusing; here it was caught by the PM asking.** Recorded rather than smoothed: the correct order was scope, then review, then ticket, and I inverted it twice in one night on the strength of a clear ruling. **A clear ruling is not an approved scenario.**

**Disposition: the ticket is not wrong in content — its lane label is.** Re-point it at F063 and drop `substrate`.

## Verdict

**PROCEED.** Three binding notes, all mechanical. No EXTEND.
