---
id: why-model
purpose: The model, in Don's words. The document every other document answers to.
layer: why
status: active
---

# The model

Stated by Don, 2026-09-10. Where any other document disagrees with this one, this one is right and the other is the thing to fix.

## Two kinds of people

**Creators** make Pages about what they do and where they are. **Finders** search — by terms, or by map and date — within their metro.

A creator offers something of value: something to buy, join, visit, or learn about.

## What a Page is

In Don's words (2026-09-12): **a Page is "an organizing entity for something that needs more than one of anything."**

Long-lived, and carrying multiples — multiple meetups, multiple announcements, maybe multiple conversations. That is the test, and it is the one to apply when something new turns up and nobody is sure.

It replaces the older framing, "a Page is *who*; an Item is *what*." That pairing is retired: it depended on Items, which no longer exist, and it answered the wrong question. *Who is behind this* is a fact about a Page, not the reason one exists.

Two things fall straight out of the test, without needing their own rule:

- **Venues are Pages.** A venue is long-lived and hosts many things over time, so it needs more than one of everything. It was previously a separate noun; it isn't.
- **A single occasion is not a Page.** One meetup needs one of everything. It is a post with a time.

A Page carries who they are, what they're about, what they offer, where they'll be, and how to find them. Creators post pictures and edit all of it.

A Page has a street address if it has a specific location, and a neighbourhood if it doesn't — either way it is findable by area on the map. The location is public. Never a home address; if someone enters one anyway, it is shown publicly.

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

Browse finds Pages, and it finds posts that carry a date and a place. In Don's words: *"You're right to include anything with a date and a location. We use a map to tell someone where to go."*

A specific occurrence is its own result, not a filter applied to its Page — this Saturday's farmers market is the thing a finder gets back, at the place it happens. Browse does not index a catalogue of listings.

## One mechanism: posts

A post on a Page with no start and end time is an **announcement**. The same post with a start and end time is an **event**. One table, one composer.

Followers and members receive it either way. The map and date search read the ones that carry times — that is how an event reaches a map.

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

**The organizer sees two lists:** who thumbed up, and who didn't. That is presence or absence of a row, not a state column — a member has responded, or they have not.

**Names are in the list.** **The public sees the count.**

### What it needs

Names mean members need a display name and a face. `display_name` exists and is always populated. **`avatar_url` exists as a column but nothing writes it** — there is no upload surface, so every avatar is empty today. That is new work, and it sits upstream of this.

### What "don't sell visibility" actually forbids

In Don's words (2026-09-12): *"Don't sell visibility means we don't sell visibility to corporations businesses whatever — they haven't earned it. If they're doing well in the community and the community loves them then we need to share that. This is peer pressure for good."*

**The prohibition is on money buying placement. That is the whole of it.**

Genuine community response driving what surfaces is not a loophole in that rule — **it is the intended mechanism.** Earned attention is the product working as designed. A baker the neighbourhood turns up for should rise, and the platform's job is to carry that signal, not to flatten it in the name of fairness.

This has been recorded wrongly twice, both times by an agent narrowing the rule further than Don ever stated it. The first version said a response count must not be "a social signal." The second said displaying a count was fine but ordering by it was forbidden. **The second half of that is also wrong**, and is corrected here: response may drive ordering. What may not is a payment.

### What it needs

Names and faces mean members need a display name and an avatar. `display_name` exists and is always populated. **`avatar_url` exists as a column but nothing writes it** — there is no upload surface, so every avatar is empty today. That is new work, and it sits upstream of this.

## What this reopened

Responding to an event was cut on the reasoning that occurrences of a recurring event did not exist as rows to respond to. They do now, so that reasoning was void — and the response above is what replaced it. Recorded because the cut was reversed by a decision, not by drift.
