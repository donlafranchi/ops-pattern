---
purpose: Finding — item_responses is a table nothing writes to, and four shipped things silently depend on it. RSVP is the defect; the rest is the blast radius.
layer: how
status: awaiting-ruling
---

# Finding — nobody can respond to anything

**Found 2026-09-07** while pricing the idea mechanic. **Recorded as a defect finding, not a feature request.**

## The fact

**`item_responses` has no write path anywhere in the application.** No action handler, no button, no API route. The table ships with an index and a comment and **no unique constraint**, so even if something wrote to it, one person could respond fifty times and the count would say fifty.

**It is read in four places. It is written in none.**

## What silently does not work

**None of these looks broken. That is the problem — each one renders as though it works.**

1. **RSVP on a gathering.** **A member cannot say they are coming to anything.** Gatherings ship, they have public pages, and the response the whole surface implies cannot be recorded. **This is the gather half of the positioning, and it is a defect rather than a gap.**
2. **Follow or save a listing.** Following a *person*, a *Page* or a *venue* works — different table, built, fine. **Following the product or service itself does not**, and that is what the follow-what-you-love loop describes.
3. **A shipped sort option that sorts by nothing.** The browse filters offer sorting by responses. **`response_count` is computed from `item_responses`, so it is zero for every row, for every item, always.** The control works, the ordering is a no-op, and nothing tells the member.
4. **The popularity ordering designed this afternoon has no data source.** *"Best is best, and people will tell us what they think is best"* was priced at half a day on the strength of `response_count` already being in the browse payload. **It is in the payload and it is always zero.** Every Page sits in the no-signal bucket permanently, so the reserved-share cold-start rule would be the *only* rule, forever. **The half-day estimate stands; what it produces is nothing until responses can be written.**

**Not affected:** initiative pledges are reserved at b1 by design, and the idea mechanic's interest count is deferred with the mechanic.

## The recommendation

**Build the response path, and do not defer it with the features that would have reused it.**

**~1 day:** the respond and unrespond handlers with their event rows in the same transaction, a unique constraint per member per item per response kind, the denormalized counts kept honest, and one button with its tapped and signed-out states.

**Why it is not a feature:** a gathering page with no way to say you are coming is not a page missing a feature — **it is a page that misrepresents itself.** Someone looks at it, sees an event, and has no way to act. The launch requirement is that consumers can find producers; **finding something you then cannot respond to is half a product.**

**What it buys beyond RSVP:** listing follows start working, the responses sort stops lying, and the popularity ordering gets the data it was designed against. **Four things off one day.**

## Not decided here

**The deferral of volunteering and the idea mechanic is ruled and is not in question.** This is the narrower claim that **RSVP travels in a different bucket from both**, and that the shared path underneath it is owed regardless of what happens to them.
