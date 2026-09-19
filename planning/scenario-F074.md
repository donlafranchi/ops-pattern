---
id: F074
title: A series repeats
status: draft
date: 2026-09-13
depends: [F073]
---
## Story

The run club meets every Thursday from the Sloppy Moose. Sam sets it up once, with a rule rather than a date, and every Thursday for the next three months exists as its own occurrence — each one findable, each one separately editable, because the route changes every week. In February, Thursdays keep appearing without anyone doing anything.

## Acceptance

1. A series is created once, with a recurrence rule; the creator never enters individual dates.
2. Every occurrence is a real row referencing its parent post, not a date computed when someone reads a calendar.
3. **Occurrences exist from today to three months ahead, at all times.** Checked on any day, the furthest occurrence is no less than three months out.
4. The job that maintains that window is idempotent: running it twice in succession creates nothing the first run did not.
5. Editing one occurrence changes that occurrence and no other.
6. Each occurrence behaves as its own event under F073 — its own place on the map, its own date match, its own responses.
7. A member searching by date sees each occurrence separately, never the series as one result.

## Why

**Raised again 2026-09-19, and it reframes the theme rather than extending it.** Don: *"Now what about recurring events? Saturdays in the summer or Tuesdays year round. I'm thinking if someone wants to find what's happening this afternoon without knowing much that they can find these things."* **Every example he has given for What's happening is recurring** — happy hour, trivia night, the farmers market, a brewery's regular music slot. **One-off events are the rarest kind of dated content in a local discovery app**, so a time lens fed only by them returns an empty row most afternoons. **Cutting recurrence does not shrink this theme; it hollows it out.** F091 criterion 3 then hides the rows, and the named set silently does not appear.

**Three sizes, unruled — Don picks.** A) **Full rules** — arbitrary patterns, exceptions as rules, the lot. B) **Simple repeat** — weekly on one or more weekdays, with an optional start and end date, so *Saturdays in the summer* and *Tuesdays year round* are one feature with different bounds. C) **None** — owners repost by hand each week.

**What is already true, checked rather than assumed:** `page_posts.parent_post_id` **exists**, nullable and indexed, added in `20260916003100_page_post_write.sql` against exactly this future. **If occurrences are real rows over a bounded horizon, `browse_feed` needs no change at all** — it reads `page_posts` and filters on `starts_at`, with no concept of a series. **The old Item path has `item_gatherings.recurrence_rule` in RRULE format and it is not a head start**: it hangs off `items`, the noun `model.md` says does not exist, and nothing in the browse path reads it.

**Verified against what actually merged, 2026-09-19.** `browse_feed`'s `p_starts_from`/`p_starts_before` are `timestamptz`, compared with `>=` and `<` and never truncated to a day, so **intra-day windows work today with no query change** — *this afternoon* is two arguments. `page_posts.starts_at` is `timestamptz` and indexed; `parent_post_id` is nullable and partially indexed. **The de-duplication gap is real**: `browse_feed` has no `distinct` and no grouping by parent, so seven occurrences return seven rows (F091 criterion 6).

**The one cost B adds that nothing else was carrying: expansion needs the metro's zone, not just reading does.** F073 criterion 8 already owes a timezone source for *reading* a window. Expanding *every Thursday at seven* by adding 168 hours of UTC drifts an hour across a DST boundary — and **DST ends 2026-11-01, two days after launch**, so the first month of the lens crosses it. Weekly expansion must add a local day, which means the zone exists before the job runs, not before the read does.

**The stack is three unbuilt scenarios deep.** F072 (a Page owner posts) is still `draft`; F073 is approved and unbuilt; F074 sits on both.

**Exceptions are the part that eats the schedule**, and B can ship without them because criterion 5 already makes one occurrence individually editable — a cancelled week is an edit to a row, not a rule. **What an owner does when they need one**: they open that occurrence and cancel it, which is F075. Without F075 the honest answer is that they edit its text to say so, which is ugly and works.

## Not this

Editing a whole series at once — every week differs anyway, so editing one occurrence is the normal case. Cancellation, which is F075. Infinite or unbounded horizons. Exceptions expressed as rules rather than as edits to a row. Replacing an occurrence's row instead of editing it — **edits are in place** *(ruled 2026-09-13)*, which is what keeps its responses attached.
