---
id: F064
title: Someone asks for something that isn't built
status: approved
date: 2026-09-10
depends: []
approved: 2026-09-07
---
## Story

Priya is making a Page for bike repair and none of the labels are hers, so she taps Other and says what she is actually running. Sam taps an option marked "not built yet"; it's acknowledged once, with no count shown and no date implied. Neither of them is told a date, a plan, or where they sit in a queue, and neither hears back.

## Acceptance

1. **One signal table serves three sources** — an unmapped label, an Other description (F088), and a search-dictionary gap — each row carrying which source it came from. *(Amended 2026-09-15. This read: "Free-typed category text renders on the Page as the Member's own words and is search-matchable, without becoming a filter." **That described the twelve categories and the "Something else" field, both retired 2026-09-13** — building it as written would ship a deleted field.)*
2. A tap on a not-yet-built option is acknowledged; a second tap from the same person is a no-op enforced by a constraint.
3. No copy anywhere in this flow implies a date, plan, or queue position.
4. The person who signaled sees no count of how many others did.
5. The operator can group the raw signal table by subject and see a ranked list, with no screen built for it.

## Not this

A public leaderboard or "most requested" surface. Any admin UI for the signal table. Restoring the free-text category field — it was removed deliberately, not lost. Replying to anyone.
