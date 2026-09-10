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

Browse finds Pages, and it finds posts that carry a time. It does not index a catalogue of listings.

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

## What this reopens

Responding to an event was cut on the reasoning that occurrences of a recurring event did not exist as rows to respond to. They do now, so that reasoning is void.

This does not put responding back in. It removes the argument that kept it out, and that needs a fresh decision rather than a silent reversal.
