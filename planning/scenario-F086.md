---
id: F086
title: Signed in, and the app says so
status: draft
date: 2026-09-15
depends: [F069, F081]
---
## Story

Marcus signs in and opens You — his own private place, shown to nobody else (2026-10-01). Nothing on the screen tells him he is anybody. There is no name, no face, no sign of where he is, and the page is mostly asking him to start selling. What he should see is himself: his name, his photo, the metro he chose, and the things he has made — the hot sauce Page and the monthly swap, both of them, neither picked for him. It is the one surface whose job is to say you are in, and this is what you have.

## Acceptance

1. A signed-in person sees **their display name** on `/you`.
2. They see **their profile photo**, or a deliberate placeholder if they have none — `members.avatar_url` has no write path today and nobody has one.
3. They see **the metro they chose**, named.
4. They see **every Page they hold** and everything filed under those Pages. **None is silently chosen for them** — the same requirement as F069 criterion 3.
5. **No query on `/you` reads a table that does not exist.** Seven do today: `businesses`, `user_preferences`, `supports`, `follows`, `vendor_categories`, `markets`, `market_vendors`.
6. **No person-noun appears in any user-facing string** on the surface, per `product/foundation/nouns.md`.

## Not this

Editing anything. This scenario makes `/you` say who you are; it does not make it a settings screen. Aggregating activity across a person's several Pages — parked by F069 and still parked. The Sell control, which is live and correct and stays as it is. Deciding what happens to the Saved and Following tabs.

## Why

### What this unblocks, and what it takes with it

`/you` is the last thing holding four vendor-era components alive — `RecruitmentGrid`, `VendorCard`, `MarketSelector`, `MarketContext`. **They are reachable only because this page imports them**, which is why they appear in no deletion ticket. Criterion 5 retires all four by consequence.

### Open — nobody has ruled on these

- **Can a person change their photo here?** Criterion 2 only requires it be shown. There is no write path for `avatar_url` anywhere in the app, so "show it" and "let them set it" are different sizes of work and only one is in scope.
- **Does the metro shown here do anything?** F081 has a person pick a metro at signup. Whether `/you` displays it, or is where it gets changed, is unanswered — and changing it is the switcher that `ROADMAP.md` parks until there is a second metro.
- **Saved and Following.** Both are tabs on `/you` today, both fed by dead reads. Whether they survive here is tied up with the `/you/sell` and `/you/following` question, which is an options note, not a ruling.
