---
id: F089
title: What people are looking for, told back to the people who could make it
status: draft
date: 2026-09-15
depends: []
---
## Story

Priya repairs bikes at weekends and has never listed anything. She opens the create flow and is told, plainly, that people near her have been looking for bike repair. She has learned something true about her neighbourhood. Meanwhile Sam searches for the same thing, finds nothing, and instead of a blank screen is told that he is not the only one — other people near him have looked for this too. **Nobody has learned anything about Priya or Sam.**

## Acceptance

1. **A search is recorded as a term, a metro, and a month. Nothing else.** No member id, no session id, no device, no IP, no ordering or timestamp finer than the month that could re-associate a row with a person.
2. **Nothing is shown below a floor of ten distinct members** having searched that term in that metro. The floor is a stored number, not a judgement made at read time, and **it is never lowered to make a surface less empty**.
3. **A term is never shown if the term itself identifies someone**, whatever its count — one containing a personal name, a street address, a phone number, or matching any member's display name or handle. **The count is not the only way a person is identified.**
4. **Scoped to one metro.** No cross-metro view, no national aggregate, no drill-down narrower than the metro.
5. **What is shown is a term and a coarse band** — *a few people · dozens · more* — never an exact count, never a trend line, never a date.
6. **No creator sees anything scoped to their own Page.** Not who searched for them, not who found them, not who looked and left.
7. **The aggregates are kept indefinitely** — a count per term, per metro, per month, forever. *(Don, 2026-09-15: "Retention is forever. We want trends.")* **How long a raw row lives before it is counted and dropped is open — see below.**
8. **Nothing here is ever sold, licensed, or shared off-platform.**

## Not this

Any per-creator dashboard. A leaderboard, a "trending" surface, or anything ranked for its own sake. A notification that anyone was searched for. Using this in ordering or ranking. Saved-search contents, which stay owner-only with no exception.

## Why ten, and why the floor never moves

**A count of one is a person. A count of two in a launch metro is very nearly one** — a metro opens at 50 creators and 250 patrons, so two searchers out of 300 is a small enough set that anyone who knows two neighbours can guess. **Ten distinct members is the smallest floor that survives that arithmetic at launch volumes.**

**At launch this will show almost nothing, and that is correct rather than broken.** Don already ruled the principle on 2026-09-15: a search that returns nothing is an honest answer. **The same logic applies here — a surface with nothing to show should say nothing, not lower its floor.** A floor that moves to fill a screen is not a floor.

## Indefinite retention makes the threshold and the term rule permanent

**A consequence worth stating rather than leaving implicit.** With a short retention window, a mistake ages out — a term shown that should not have been stops being visible once its rows expire. **With aggregates kept forever, nothing ages out. Every protection has to hold on the day the row is written, because there is no second chance later.**

**That raises the stakes on criterion 3 specifically** — the rule that a term identifying someone is never shown whatever its count. **It is already the criterion most likely to be dropped as an edge case, and it is now the one with the longest consequence.** A term wrongly admitted to an aggregate is admitted permanently.

## The combination case, which is the one that gets missed

**The threshold protects against counting. It does not protect against the term.** Ten people searching a common phrase is anonymous. Ten people searching a phrase containing somebody's name, or their street, is not — **the term itself carries the identity, and no count fixes that.** Criterion 3 exists for exactly this and is the criterion most likely to be dropped as an edge case.

**Timing is the second half of it.** A term plus a fine-grained date plus local knowledge identifies people. Criteria 1 and 5 hold the granularity to a month and a band, which is what makes the aggregate safe rather than the count alone.

## Purpose limitation — what it must never become

**Don's frame: *"the point is to help creators create and to help our members find what they need locally."* Two purposes, both about matching a need to a person who could meet it.**

**It must not become:** a measure of engagement · anything with the word *trending* on it · a ranked list read for its own sake · an input to ordering, which `model.md` already forbids from carrying anything but locality, recency and declared interest · a reason to send anyone a notification, which the pull-back-notification refusal already covers · a product sold to anyone.

**The test for any future change: does this help somebody decide what to start, or help somebody find what they need nearby?** If neither, it is out, whatever else it would be good for.

## Retention — aggregates forever; raw rows are Don's call

**Settled. Don, 2026-09-15: *"Retention is forever. We want trends."*** **The aggregates are kept indefinitely**, which is what a trend is made of. **There is no privacy cost in that**: an aggregate only exists once it has passed the floor of ten and the term rule, so by construction it contains nothing that identifies anyone.

### The open half, in two lines

**Trends do not need raw rows.** Once a search is counted into its month's aggregate it adds nothing further to any trend. **The only question is whether the individual rows are kept after that, and it is a separate ruling from the one above.**

### The real exposure, which is not what it looks like

**Criterion 1 already strips a raw row of every identifier** — no member id, no session, no device, no IP, no timestamp finer than a month. **So a raw row is already almost an aggregate row.** It cannot be re-associated with a person, and the usual argument about breach surface is weaker here than it first appears.

**What a raw row carries that an aggregate never does is the terms that failed the rules** — the ones below the floor of ten, and the ones criterion 3 refused because the term itself named a person, a street or a phone number. **So the honest question is narrow: do we keep, forever, the search terms that were too identifying to ever be shown?**

### The case for keeping them, stated properly rather than stacked

**These are real arguments and Don should hear them before ruling.**

- **Re-aggregating at a different granularity.** The aggregate is monthly. If a weekly or seasonal view is ever wanted, only raw rows can produce it, and only for the period they still exist. **Deleted history cannot be recovered later.**
- **Correcting a bad aggregation job.** A bug in the aggregator writes wrong counts. With raw rows you recompute; without them the error is permanent and silent.
- **Re-bucketing when terms are normalised.** If *bike repair* and *bicycle repair* are later merged, raw rows can be re-counted. **Aggregates already summed cannot be split apart again.**
- **Applying a stricter sanitisation rule retroactively.** If criterion 3 is ever tightened, raw rows can be re-screened.

**The case against is one sentence:** every argument above is about fixing our own mistakes, not about trends — **and the price is holding the most identifying terms anyone typed, indefinitely, with no surface that will ever show them.**

**A middle option, named because it is the obvious one:** keep raw rows for a bounded window long enough to re-aggregate — twelve months, matching the interaction-record rule — then drop them, keeping the aggregates forever. **That buys most of the correction value with a surface that stops growing.**

**Recommendation: the middle option.** But this is a judgement about how much of our own fallibility to insure against, and that is Don's, not a design question.

## Is this the same mechanism as the signal queue? No.

**They look alike and resolve differently, so keeping them separate is the honest answer.**

The signal queue (F064, F088) captures **a person using a word the product does not know yet** — an unmapped label, an Other description. **It is resolved by adding vocabulary**, and its reader is whoever approves search-dictionary entries.

This captures **a person looking for a thing that does not exist near them.** **It is resolved by somebody starting that thing**, which no operator can do. There is no queue and nobody approves anything.

**And folding them would undo a ruling made today.** Don removed zero-result searches from the signal queue on the grounds that nothing being there is an honest answer. **Routing search demand back into that queue would reintroduce exactly what he cut** — under a different name.

## Still open — Don rules

- **Where it is shown.** The create flow serves the first purpose; a thin search result or an empty state serves the second. **Both are user-facing copy and are his under rule 4.**
- **The bands.** *A few people · dozens · more* is a proposal; the words are his.
- **Whether members are told this is happening**, and where. `policy.md`'s posture argues yes; nothing yet says how.
