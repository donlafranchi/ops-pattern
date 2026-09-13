---
id: F066
title: A Page owner posts to its followers
status: superseded
date: 2026-09-10
depends: [F065]
approved: 2026-09-07 — guard rails settled, unscheduled build
superseded: 2026-09-13 — by F072, F073, F074, F075
---

> **SUPERSEDED 2026-09-13. Do not build from this file.** Replaced by
> **F072** (a Page owner posts), **F073** (a post with a time is an event),
> **F074** (a series repeats) and **F075** (an occurrence is cancelled).
>
> **Kept rather than deleted because it was approved, and two of its criteria
> were later reversed.** An approved scenario quietly disappearing hides that
> the product changed its mind. The two wrong lines are marked below, in
> place, so the record shows what was approved and what overturned it.
>
> It also predates the one-mechanism model entirely: nothing here knows that
> a post with a start and end time is an event, that occurrences of a series
> are real rows, or that a post can carry its own address.
## Story

Maya's bakery has eleven followers and nothing to say to them until Thursday, when the sourdough is back. She taps Post an update, writes two sentences, posts. It appears at the top of her Page and in each follower's feed, marked as coming from the bakery, not dressed as a listing. Rae taps the one reaction; Maya sees the count go to four, never who.

## Acceptance

1. ~~Only a Page's managing role can post; the post appears on the Page and in every follower's feed, **never in browse or search**.~~ **WRONG — reversed 2026-09-13.** Posts appear in browse, flat. The audience is also wider than followers: members too. See F072 criterion 2.
2. A non-follower's feed never shows the post. *(Still true of Home, which is personal — but it read as an exclusion rule, and browse carries everything. F072 criterion 2 states both halves.)*
3. ~~Any member can react once per post, enforced by a constraint; **the owner sees a count and no identities, ever**.~~ **WRONG — reversed 2026-09-12.** A response is a thumbs up; the organizer sees two lists with names in them, and the public sees the count. See F063, and `DECISIONS.md`.
4. There is no reply path anywhere — no thread, no comment, no inbox.

## Not this

Editing or deleting after posting. Scheduling or segmentation. Images (needs its own upload/takedown path — separate scenario).
