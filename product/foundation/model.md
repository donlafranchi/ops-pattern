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

## Pages

A Page is a record of a tangible thing, and of who is behind it. Businesses. Groups that meet socially — a run club.

*Unsettled:* whether venues are Pages too, as places where things happen. Raised tentatively, not ruled.

A Page carries who they are, what they're about, what they offer, where they'll be, and how to find them. Creators post pictures and edit all of it.

A Page has a street address if it has a specific location, and a neighbourhood if it doesn't — either way it is findable by area on the map. The location is public. Never a home address; if someone enters one anyway, it is shown publicly.

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

## Saying you're coming

In Don's words: *"about RSVP it can be as simple as a thumbs up in the beginning. Just to give organizers an idea of headcount."*

A thumbs up sits on **an occurrence** — a post carrying a time. Thursday's run, not the run club, and not the Page.

Its purpose is a headcount for the organizer. That is the whole of it:

- It is not a social signal, and it is **not an input to ordering anywhere**. Visibility is not sold, and nothing is ranked by engagement — a count that moved a Page up the results would break both.
- **Names, messaging attendees, capacity limits and waitlists are out.** An organizer who needs more than a number posts an announcement asking people to email a contact. Don named that escape hatch himself, and it is the reason the feature can stay this small.

Two calls that shape it, recommended and awaiting confirmation: **a count only, no names, for launch** — whether a Page owner sees who noticed is a separate, deliberately deferred decision, and a list of names is that same question wearing a different hat. And **signed-in only** — anonymous browse stays, but a thumbs up needs an identity to count once, so an anonymous viewer sees the number and cannot add to it.

## What this reopened

Responding to an event was cut on the reasoning that occurrences of a recurring event did not exist as rows to respond to. They do now, so that reasoning was void — and the thumbs up above is what replaced it. Recorded because the cut was reversed by a decision, not by drift.
