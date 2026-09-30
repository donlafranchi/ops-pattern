---
id: page-kind-event
title: The event-anchored Page kind
status: draft
date: 2026-09-17
---

# `event` — the Page kind for a one-time gathering

**The name is settled; the rest is a draft proposal. Nothing applied.** First document written under the bare-term rule in `product/foundation/nouns.md` § A vague term is not used by itself.

**Don:** *"Add one time gathering as a page kind type. Perhaps it goes in an other category."*

## Settled by Don, 2026-09-15: the Page kind is `event`. Not a catch-all.

**Don: *"Also event is by definition a one time gathering."*** **Event means a one-time gathering; gathering means the recurring one.** Plain English does the work and neither needs teaching.

**The naming question is closed.** `occasion`, `one_off` and `happening` were proposed and are withdrawn. **`event` had been refused on the grounds that the `gathering` entry type used "Event" as its UI label — that was backwards: it protected a label instead of using the word people already understand.** The entry type's label moves to **Gathering** and the collision disappears.

**`model.md` already uses "event" this way**, which supports the ruling rather than conflicting with it: *"The same post with a start and end time is an event"*, and F074 has each occurrence of a series behave as its own event. **An event is one occurrence. That is consistent everywhere the word appears in the product.**

**The catch-all is still refused, and the evidence is already in this repo.**

**Why not "other".** This project has already built a catch-all and retired it. The composer's *"Something else"* free-text field was cut on 2026-09-13, and the reason recorded was that its rows *"sat unread by anything."* `group_category_suggestions` is the table it wrote to, and nothing ever read it. **A catch-all is convenient at the moment of creation and unread forever after** — everything ambiguous lands there, nothing leaves, and the bucket becomes the largest Page kind with the least meaning.

**If a catch-all were taken anyway, what would have to stop it becoming a dumping ground:** a named owner who reviews it on a schedule, a rule that a value leaves the bucket once three Pages share a shape, and a count surfaced somewhere a person looks. **None of those exists, and the three that would have been needed for "Something else" did not exist either.** That is the argument, not a preference.

**Why `event` rather than reusing an existing Page kind.** `event_anchored` looks close and is not: its 1:1 child carries `seeded_by_item_id`, so an event-anchored Page is **a social group that formed out of an existing gathering** — people met at a thing and stayed. A one-time gathering is the opposite shape: one event, no continuing set of people, nothing seeded from it. Filing one under the other would make `seeded_by_item_id` meaningless on most rows.

## Does one new value fix the farmers-market gap too?

**No, and forcing it would be worse than two values.** `model.md` records that a market *"convenes commercial vendors without selling anything itself"* and fits none of the six cleanly. **But a market is a recurring organization** — long-lived, carrying multiples, exactly what a Page is for. A one-time gathering is a single event with no organization behind it. **They fail the existing six for opposite reasons**, and one value covering both would be a catch-all wearing a specific name.

**The market gap stays open and is still Don's to rule on.** Named here so it is not quietly folded in.

## This is the first real test of the tools mapping

**A one-time gathering's whole point is that it gets fewer tools.** Until now, "the Page kind decides which tools it has" has been an intention with nothing to check it against. This is the first Page kind that would look broken if the mapping were missing.

Against Don's baseline ruling — every Page gets announcing and a following list, with messaging later — a first cut:

| Tool | `event` | Why |
|---|---|---|
| Announcing | **yes** | Don's baseline. A host needs to say "moved to the back garden." |
| Following list | **yes** | Don's baseline, though it will hold few people and stop mattering after the date. |
| Responses — who is coming | **yes** | The reason the Page exists. |
| A single date and place | **yes** | The defining field. |
| Recurrence | **no** | A second occurrence is a different Page kind. This is the line between them. |
| Selling — products and services filed under it | **no** | Not what it is for. |
| Business claim, jurisdiction, locality evidence | **no** | No organization to make a claim about. |
| Tags | **open** | A one-off is hard to find without them and clutters the vocabulary with them. Don rules. |

**The mapping itself still does not exist anywhere** — not in schema, not in a document. This proposal is the case for writing it, and `planning/VOCABULARY-PROPOSAL.md` § 4 is where the shape was argued.

## What this touches, and what it costs

**Ratified vocabulary touched:** the **social group** entry in `nouns.md`, which currently says six Page kinds. It would say seven. Nothing else in the spine moves.

**Cheap:** one value on an existing check constraint, and one line in `nouns.md`. **No new table** — `event` needs no 1:1 child, because its fields are a date and a place, both of which already resolve through `locations`.

**Not cheap, and not this proposal:** the tools mapping, and whatever writes a Page's entries. **A Page kind that gets fewer tools is worth nothing until there is a mechanism that gives any Page kind tools at all.**

## Open — Don rules

- **Tags on a one-time gathering**, per the table above.
- **The farmers-market gap**, still unruled.
