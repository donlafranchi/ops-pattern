---
id: why-model
purpose: The model, in Don's words. The document every other document answers to.
layer: why
status: active
---

# The model

Stated by Don, 2026-09-10. Where any other document disagrees with this one, this one is right and the other is the thing to fix.

## Two kinds of people

- **Creators** make Pages about what they do and where they are.
- **Finders** search — by terms, or by map and date — within their metro.

A creator offers something of value: something to buy, join, visit, or learn about.

## What a Page is

In Don's words (2026-09-12): **a Page is "an organizing entity for something that needs more than one of anything."**

Long-lived, and carrying multiples — multiple meetups, multiple announcements, maybe multiple conversations. That is the test, and it is the one to apply when something new turns up and nobody is sure.

It replaces the older framing, "a Page is *who*; an Item is *what*." That pairing is retired: it depended on Items, which no longer exist, and it answered the wrong question. *Who is behind this* is a fact about a Page, not the reason one exists.

Two things fall straight out of the test, without needing their own rule:

- **Venues are Pages.** A venue is long-lived and hosts many things over time, so it needs more than one of everything. It was previously a separate noun; it isn't.
- **A single occasion is not a Page.** One meetup needs one of everything. It is a post with a time.

**A Page carries:**

- who they are
- what they're about
- what they offer
- where they'll be
- how to find them

Creators post pictures and edit all of it.

**Location:**

- A **street address** if it has a specific location.
- A **neighbourhood** if it doesn't.
- Either way, findable by area on the map.
- **The location is public.** Never a home address — and if someone enters one anyway, it is shown publicly.

**A post can carry its own address**, separate from its Page's. A Page appears where its Page-level location says, and a post appears where the post says — which is how an itinerant Page's event reaches the map at the place it actually happens.

## Dropping a pin

A creator can set a location by dropping a pin on the map, for the places that have no street address — a meeting point in West Sacramento, a trailhead, a corner of a park.

**The creator decides the precision. The platform does not snap, round, or coarsen it.** *(Provisional — read from a transcription artifact and being confirmed with Don. Everything below follows from it either way.)*

That makes the copy the only thing standing between a creator and pinning their own house. So it is not advisory:

- **The warning appears at the moment of placement**, not after, and says the pin is public.
- **The place is confirmed back before it is saved** — "you've placed this in Midtown" — so nobody discovers later what they published.

Both are required. With no snapping and no guard in the data, they are the guard.

## There are no Items

What a creator offers is described on their Page and in their posts. It is not a separately listed thing that browse indexes.

A specific occurrence is its own result, not a filter applied to its Page — this Saturday's farmers market is the thing a finder gets back, at the place it happens. Browse indexes Pages and posts, not a catalogue of listings.

## Browse is everything

In Don's words (2026-09-12): **"browse is everything, why wouldn't it be all kinds of things?"**

Browse is the universal surface. It carries everything the platform holds.

**The default is inclusion.** Anything excluded needs a reason, recorded. Inclusion needs no justification — that is the direction of the burden, and it is the whole of the principle. A thing is in browse because it exists; a thing is out of browse because someone wrote down why.

Good reasons exist and are not weakened by this. A member who has not opted into discoverability is not in search — that is consent, and it is recorded. A draft is not published, so there is nothing to carry. What the principle forbids is the unrecorded exclusion: a thing kept out of browse because an earlier model had no room for it, or because nobody asked.

**Posts appearing in browse is an instance of this, not a separate rule.** Flat — not only the dated ones, not only the ones with a place. An earlier line said browse finds "posts that carry a date and a place"; that came from Don speaking about the map — *"You're right to include anything with a date and a location. We use a map to tell someone where to go."* **It still holds for the map**, where a post needs a place to be a pin and a time to be an event. It was read as a filter on browse, which it never was.

**What this does not settle.** Browse carrying everything makes a result list a mixture — a Page, an event next Saturday, an undated *"50% off today"*. **How that list reads and how it orders is open.** What is not open, and is not to be reopened, is what may enter it.

## Search is the filter

*(Ruled 2026-09-12.)* **Categories stop being a visible control.** A Page still declares one and it still orders nothing, but no surface renders it as a pill, a chip, or a filter. **Search is how a finder narrows.**

**A curated dictionary of search terms maps to categories, built up front.** *"Sourdough"* leads to Food & Drink; *"homemade soap"* to Home & Body. So a search returns Pages that never contain the word searched for — which is the point. At launch volumes the words a member types and the words a creator wrote will rarely be the same, and the dictionary closes that gap from the finder's side.

**Page creators get tips on how to be found** — the same gap closed from the creator's side.

**Creators pick or submit tags, and submissions grow the dictionary** *(2026-09-12)*. Don: *"we are going to write the dictionary and start it with farmers market items. and then we need to allow page creators to pick or submit tags so we can grow that reference list."* Tags are what a creator calls their own thing; the dictionary is what a stranger might type for it. **Search matches both.**

**An open tag field is member-contributed content**, so rule 1 applies: it does not reach production without a report-and-takedown path. Moderation is part of the cost of tags, not an extra.

**Not embeddings.** `item_embeddings` and `member_embeddings` exist, hold zero rows, and nothing reads them. A curated dictionary is cheaper, controllable, inspectable, and has no model to train or drift. **Revisit when the dictionary stops scaling** — when maintaining it becomes a recurring cost somebody notices, or when searches that should match are missing because nobody thought of the term. Not because the tables happen to be there.

## Why Home and Browse both exist

In Don's words (2026-09-12): **"Browse is everything, Home is personalized so items the member's personal interests don't get buried in browse."**

**Two surfaces, two jobs, and the second is the reason the first can afford to be complete.**

- **Browse is complete.** Everything the platform holds, findable. **Not ranked by the member's interests** — completeness is its job, and interest-ranking a complete surface is how a member stops trusting that it is complete.
- **Home is personal.** What this member cares about, surfaced so it is not lost in the completeness. The personalization exists **because** browse is exhaustive: without it, a member's own interests are a handful of rows in everything.

Neither can do the other's job. A complete surface that quietly favours your interests is not complete; a personal surface that shows everything is not personal. **This is the reason both exist**, and until now nothing stated it.

### Personalized means interests, not engagement

**A hard distinction, because one word covers two things and only one of them is allowed.**

- **Allowed — and the whole point:** the member's own **declared interests**, and where they are. Home surfaces what they said they care about, near them. That is personalization on facts the member volunteered about themselves.
- **Allowed:** genuine community response. Earned attention is the intended mechanism *(2026-09-12)* — a baker the neighbourhood turns up for should rise.
- **Never:** what keeps someone scrolling. No watch-time, no dwell-time, no engagement objective. And never payment — nobody buys placement.

**"Home is personalized" is not licence for a feed algorithm.** It is licence for exactly one thing: showing a member what they told the platform they like, where they are. Anything reading behaviour back at them is a different product and is refused elsewhere in this tree.

## One mechanism: posts

- A post with **no** start and end time is an **announcement**.
- The same post **with** a start and end time is an **event**.
- One table, one composer.
- Followers and members receive it either way.
- The map and date search read the ones that carry times — that is how an event reaches a map.

## Recurring events

A series carries a rule — the run club meets every Thursday in West Sacramento. Each occurrence is a real row, generated ahead of time, not computed when someone reads the calendar. Rows, because every occurrence is individually editable: the run club runs a different route every week.

- **A rolling three-month horizon, topped up nightly.** The job asks whether occurrences exist from today out to three months and inserts only the missing ones. Running it twice changes nothing; most nights it inserts nothing or one row.
- **Cancelling is a state on the occurrence, never a deletion.** A deleted occurrence comes back the next night, because the top-up job cannot tell it apart from one that was never created. An occurrence can be cancelled from its own controls.
- **Editing one occurrence ships. Editing a whole series does not.** Every week differs anyway, so editing one occurrence is the normal case, not the exception.

## Where the scheduling job runs

A scheduled function in the app, written in TypeScript, reviewed like any other change and covered by tests. Not a database job.

The reasoning generalises: **put logic where it can be tested and reviewed; put constraints where they cannot be bypassed.** Generating occurrences is logic — it belongs in the app. Cancellation state is a constraint — it belongs in the schema.

## Responding to an event

**A thumbs up, or nothing.** There is no declined state and no seen-and-undecided state — those were Don painting the bigger picture, not a spec, and they are not what ships.

**The organizer sees two lists:** who thumbed up, and who didn't.

**Names are in the list.** **The public sees the count.**

### What "don't sell visibility" actually forbids

In Don's words (2026-09-12): *"Don't sell visibility means we don't sell visibility to corporations businesses whatever — they haven't earned it. If they're doing well in the community and the community loves them then we need to share that. This is peer pressure for good."*

**The prohibition is on money buying placement. That is the whole of it.**

Genuine community response driving what surfaces is not a loophole in that rule — **it is the intended mechanism.** Earned attention is the product working as designed. A baker the neighbourhood turns up for should rise, and the platform's job is to carry that signal, not to flatten it in the name of fairness.

This has been recorded wrongly twice, both times by an agent narrowing the rule further than Don ever stated it. The first version said a response count must not be "a social signal." The second said displaying a count was fine but ordering by it was forbidden. **The second half of that is also wrong**, and is corrected here: response may drive ordering. What may not is a payment.

## What this reopened

Responding to an event was cut on the reasoning that occurrences of a recurring event did not exist as rows to respond to. They do now, so that reasoning was void — and the response above is what replaced it. Recorded because the cut was reversed by a decision, not by drift.
