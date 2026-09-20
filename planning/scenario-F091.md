---
id: F091
title: What's happening, today and this week
status: approved
date: 2026-09-19
depends: [F059, F073]
approved: 2026-09-19 — Don named the set and ruled the heading is a sentence stem the lens completes.
---
## Story

Rae opens Browse on a Thursday afternoon with no particular plan. Under a heading reading *What's happening…* she finds a row headed *today*, and in it a happy hour starting at four and a guest set at a brewery at seven. She swipes the row sideways for more. Below it, *this week* and *this weekend*. On a quiet Tuesday the *this weekend* row is the only one there, and the heading still reads as a finished sentence. On a week with nothing at all, the heading is gone rather than stranded.

## Acceptance

1. A row returns only posts whose start time falls inside that row's window, soonest first.
2. Windows are computed in the metro's timezone and bound to the hour: *today* is now to end of day, not a whole calendar day already half gone.
3. A row with no results is absent, not empty.
4. **The stem is absent when every row under it is absent.** A heading that opens a sentence no row finishes is a failure, not an empty state.
5. The same link reopens the same rows.
6. **A series appears at most once in a row** — its soonest occurrence inside that window — however many times it recurs inside it. A non-recurring post appears as itself. This is the read side of F074 criterion 6 and lands in the same release as the expansion, never after it.

## Why

**The name is Don's, 2026-09-19, and the ellipsis is load-bearing** — *What's happening…* is a stem each row completes: *today*, *this week*, *this weekend*. Criterion 4 is the cost of that choice. F059's hide-when-empty rule is defined per row, and a stem needs a second rule or it reads as broken rather than as quiet.

**Criterion 1 needs no new query.** `browse_feed` merged 2026-09-19 with `p_starts_from`, `p_starts_before` and `p_sort='soonest'`; a row is one call with two arguments. **The theme is a set of queries, and the queries exist** — what did not exist was any way to create a dated post, which is F073.

**Criterion 6 is the one place that claim breaks, and it is no longer conditional.** `browse_feed` has no de-duplication, so a daily happy hour expanded into occurrence rows returns seven rows in a week window and floods it. **Don ruled recurrence in on 2026-09-20 (F074, simple repeat), so this is live rather than hypothetical** — and he ruled the de-duplication non-optional with it: *a flooded lens reads as broken, not as incomplete.*

**Criterion 2, not "today means a calendar day".** Someone asking at four in the afternoon is asking about this evening.

## Not this

A filter control beside the rows — narrowing is F092, in a modal. A lens for cost or product category: those are the other two axes of F059 criterion 4 and each is waiting on a separate ruling. Ranking by anything but time inside a row. A notification when something is on.
