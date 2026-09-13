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

## Not this

Editing a whole series at once — every week differs anyway, so editing one occurrence is the normal case. Cancellation, which is F075. Infinite or unbounded horizons. Exceptions expressed as rules rather than as edits to a row.
