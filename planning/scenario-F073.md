---
id: F073
title: An announcement carries a date, a time and its own place
status: superseded
date: 2026-09-13
depends: [F072]
approved: 2026-09-19 — Don ruled the middle size: a date, a time and a post-level address, and no map pin.
superseded: 2026-09-21 — folded into F072, which builds the composer and the timestamp as one piece of work. Nothing here was reversed; the end-time criterion moved to F072 § Not this.
---
**Superseded 2026-09-21 — do not build from this file. Its content is F072 criteria 2 and 3.** Kept for the approval trail, not as a second description. *(Don: "I need it built and composed." The composer and the time are one ticket, and two scenarios describing one composer is how this repo has failed before.)*

## Story

**Superseded whole — folded into F072.** [superseded-by 2026-09-21: The composer and the timestamp]

Maya writes the same way she always does, but this time she adds a start and an end: bread class, Thursday seven till nine, at the church hall rather than her bakery. Nothing else about the composer changes. A stranger looking for what is on this week finds it, at the address she typed. Her Saturday "sourdough is back" post has no times, so it stays an announcement — in browse, in feeds, and answering no question about when.

## Acceptance

1. One table and one composer serve both: a post with no start time is an announcement, the same post with one is an event. There is no separate kind a creator chooses.
2. A post carries an optional address of its own. Given one, the post reads as being there; given none, it reads as being at its Page's location.
3. A post's start and end are stored as instants and a post with a start time is returned by a time window that contains it, to the hour, not only to the day.
4. **No post renders on the map, dated or not.** The map shows Pages.
5. A post with a start time is returned by a time-windowed read; one without is never returned by a time-windowed read and still appears in browse.
6. An end time before its start time is refused at the composer and at the handler.
7. A post whose start time has passed stops appearing in browse, with no manual cleanup.
8. A time window is computed in the metro's own timezone, not the reader's and not the server's. A reader in another timezone browsing this metro gets this metro's afternoon.

## Why

**The middle of three sizes** *(Don, 2026-09-19)*. The largest was this plus the map pin; the smallest dropped the post-level address and resolved every post to its Page. The map is most of the cost and Browse is a list before it is a map, so the pin goes and the address stays — which keeps the case the smallest size breaks, a Page hosting somewhere that is not its own address.

**Criterion 3 exists because "this afternoon" is the question.** `page_posts.starts_at` is already `timestamptz` and `browse_feed`'s window parameters are already `timestamptz`, so intra-day windows need no schema or query change. Stated as a criterion anyway, because a composer that captures only a date would satisfy every other line here and answer none of the question.

**Criterion 8 now gates F074 as well, and therefore comes first.** *(2026-09-20, with Don's ruling of simple repeat.)* This scenario needs the metro's zone to *read* a window; expansion needs the same missing column to *write* one, because adding a fixed number of hours to a weekly series drifts an hour across a daylight-saving change — and **daylight saving ends 2026-11-01, two days after launch.** Nothing expands occurrences before the zone exists.

**Criterion 8 is not free and is the one thing here with no substrate.** There is **no timezone column anywhere in the schema** — verified across every migration. Something must supply the metro's zone before a window boundary can be computed, and a reader's browser is the wrong source: F059 criterion 7 has a member switch metros, so the reader is routinely not in the metro they are reading.

**`ends_at` does not exist on `page_posts` either.** The table has `starts_at` and `location_id` and no end. Criterion 6 needs the column.

## Not this

A map pin for a post — cut 2026-09-19, and it is the difference between this and the larger size. Recurrence, which is F074. Timezone *selection* by a creator: times are the metro's, which is what criterion 8 says. All-day events, multi-day spans, or a start with no end. Reminders or notifications of any kind.
