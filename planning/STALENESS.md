---
id: staleness
title: One staleness rule for every entry that can go quiet
status: draft
date: 2026-09-17
---

# Staleness — one rule for everything

**Draft, 2026-09-15.** Don: **"We should date these things and not display things that haven't had any interaction in 90 days. Or show them last."**

**A general rule, not a wonder rule.** It answers the same problem for every entry that can go quiet.

## The rule

**Everything carries a last-interaction date.** A Page, a post, a product, a service, a gathering, a wonder.

**Nothing quiet for 90 days is hidden. It sorts last.** Don offered both; this is the one to take.

- **Hiding something without telling its author is how people find out their listing was invisible for a month.** Sorting last is visible, reversible and honest.
- **`model.md` already rules the same way:** *"Browse is everything… The default is inclusion. Anything excluded needs a reason, recorded."* **Quiet is not a reason to exclude; it is a reason to rank below things that are not.**
- **Sorting last fails softly.** If the date is wrong, something appears lower than it should. If hiding is wrong, something disappears.

**The author can see it has gone quiet, and only the author can.** One line on their own Page, not on a public surface — quiet is not a label the platform hangs on somebody in front of other people.

**Bringing it back is one action: edit it, or announce something on it.** No separate "renew" button, no confirmation, nothing to learn. **Doing the ordinary thing is the revival.**

## What counts as interaction — ruled 2026-09-15

**Don: *"If the author updates it. Or a user interacts with the page more than viewing."*** **Two rules: any deliberate act by the author, and any deliberate act by anyone else. Viewing is neither.**

**The enumeration, because "more than viewing" has to be a list someone can implement.**

| Act | Counts | Exists today |
|---|---|---|
| Author edits the Page | **yes** | yes — `groups.updated_at` |
| Author edits an entry | **yes** | yes — `items.updated_at` |
| Author announces something on the Page | **yes** | **no** — `page_posts` has no writer |
| Someone responds: interest · rsvp · save · pledge · purchase · support | **yes** | values exist in `item_responses.response_kind`; **no writer** |
| Someone joins a social group | **yes** | `group_memberships` exists; **the join control is missing** |
| Someone follows a Page | **yes** | **no** — `member_follows` is member-to-member only |
| Someone views it | **no** | n/a |
| It appeared in a search result | **no** | n/a |

**Which events write `last_interaction_at`: the ones that already exist.** Every write goes through a named action handler that commits the data row and its `*_events` row in the same transaction (`action-layer.md`). **The handler sets the date; nothing separate watches for it, and no job runs.** Half the acts above have no handler yet, which is the same list of missing writers already tracked elsewhere.

**The ordering rule in `surfaces.md` stands unchanged.** Don had raised removing it; his answer here keeps views out of ordering by itself, so nothing needs to change there.

## It fits the ordering rule

**Confirmed rather than assumed.** `surfaces.md`: *"Ordering is locality and recency, with the Member's own declared interest tags as a boost — and may also carry genuine community response."*

**Last-interaction sorting is permitted twice over** — it is recency, and if interaction means responses it is genuine community response, which Don ratified on 2026-09-12. **The only thing the rule forbids is what keeps you scrolling, which is precisely why views are out.**

## It replaces the wonder expiry rather than sitting beside it

**Same idea, done generally and done better.** The expiry Don cut on 2026-09-15 **deleted** a wonder after 90 days. **This demotes it after 90 quiet days and lets the author revive it by doing something ordinary.**

**So the removal stands and this is the better version** — one rule for every entry instead of a mechanism bolted onto one of them, and nothing is destroyed.

## Cost

**A `last_interaction_at` column on the things that can go quiet, written by whatever already writes an interaction**, and one clause in the ordering. **No new surface and no job to run** — staleness is computed at read time from a date, the same way locality already is.

**Settled: 90 days, one number everywhere.** A per-type table is a config surface nobody maintains, and **the seasonal producer is already answered by the design — sorting last is not hiding, and one edit brings it back.** The cost of being stale is low enough not to need a second number.
