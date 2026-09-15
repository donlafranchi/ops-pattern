---
id: F089
title: What people are looking for, told back to the people who could make it
status: draft
date: 2026-09-15
depends: []
---
## Story

Forty people in this metro searched for a bike repair place last month and most of them found nothing. Nobody who could fix a bike knows that. Priya, who repairs bikes at weekends and has never listed anything, opens the app and is told plainly: people near you are looking for this. She has learned something true about her neighbourhood, and nobody has learned anything about the forty people.

## Acceptance

1. **A search is recorded as a term, a metro, and a time. Nothing else.** No member id, no session id, no device, no IP, no ordering that would let rows be re-associated with a person.
2. **Nothing renders below a threshold** — a term is shown only once enough distinct searches exist in that metro that no single person is identifiable from it. **The threshold is a number Don sets, not a judgement made at read time.**
3. **What is shown is a term and a rough volume in a metro.** Never who, never when a particular search happened, never a trend line fine enough to single out a day's activity.
4. **No creator sees anything scoped to their own Page** — not who searched for them, not who found them, not who looked and left.
5. **A member is told this is happening**, in plain words, at the point they search or in the same place the other standing facts are stated.
6. **Nothing here is ever sold, licensed, or shared off-platform.** *(Already promise 3; restated because this is the first feature that would tempt it.)*

## Not this

Any per-creator analytics dashboard. Saved-search contents — those are owner-only at the row level with no exception. Retention beyond what the aggregate needs. Notifying anyone that they were searched for. Selling any of it, under any framing.

## This needs a privacy ruling before it can be built

**It is not blocked on design. It is blocked on Don.** Three things in the ratified record point different ways and only he can reconcile them.

**It sits against a standing refusal.** `ROADMAP.md` § Won't lists *"individual visitor-tracking analytics for a producer."* **This scenario is deliberately the aggregate case, not the individual one** — criteria 1 and 4 exist to keep it on the right side of that line. **But the line has never been drawn explicitly, and this is the first thing that stands on it.**

**It sits against the opt-out default.** `policy.md`: any non-essential data collection is **off by default**, and anything benefiting a member at the cost of relaxed protection is **opt-in — visible, granular, revocable**. **A search is not currently collected at all.** So the honest question is whether recording a term-plus-metro with no identifier counts as collecting anything about a person. **A reasonable person could answer either way, and the three-filter test does not settle it.**

**It sits with the platform's own argument for existing.** A neighbourhood that wants something and a person who could provide it not finding each other is the exact failure the product exists to fix. **This is the highest-value thing in the file and the one most likely to be regretted if it is built loosely.**

## What Don has to rule

- **Is a term plus a metro plus a time "member data"?** If yes, this needs opt-in and most of its value goes, because the people who opt out are not the ones being counted.
- **What is the threshold** below which nothing renders?
- **Where does the aggregate line sit**, given the standing refusal of producer analytics? Criteria 1 and 4 are a proposal for where it sits, not a ruling.

## Provenance

**Moved out of `IMAGINE.md` on 2026-09-15**, where it sat as *"Market intelligence — aggregate demand signal surfaced back to producers."* It now has a noun, a verb and a surface, so it leaves the waiting room rather than being copied out of it.
