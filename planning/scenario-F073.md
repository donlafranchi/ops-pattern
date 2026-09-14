---
id: F073
title: A post with a time is an event
status: draft
date: 2026-09-13
depends: [F072]
---
## Story

Maya writes the same way she always does, but this time she adds a start and an end: bread class, Thursday seven till nine. Nothing else about the composer changes. The post now shows up on the map, at the church hall she typed in rather than at her bakery, and a stranger searching for what is on this week finds it. Her Saturday "sourdough is back" post has no times, so it stays an announcement — in browse, in feeds, off the map.

## Acceptance

1. One table and one composer serve both: a post with no start and end time is an announcement, the same post with them is an event. There is no separate kind a creator chooses.
2. A post carries an optional address of its own. Given one, the post resolves there; given none, it resolves to its Page's location.
3. A post with a start time **and** a resolvable place renders on the map, at the post's address when it has one.
4. A post with no start time never renders on the map, whatever address it carries.
5. A post with a start time is findable by a date search; one without is not returned by a date search and still appears in browse.
6. An end time before its start time is refused at the composer and at the handler.
7. A post whose start time has passed stops appearing in browse and on the map, with no manual cleanup.

## Not this

Recurrence — that is F074. Timezone selection: times are the metro's. All-day events, multi-day spans, or a start with no end. Reminders or notifications of any kind.
