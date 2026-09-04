---
id: how-f052-blocked-feed-ranks-by-hood-then-metro
purpose: BLOCKED scenario stub — the feed ranks hood, then metro, then wider, then Online. Cannot be written until the ranking-authority question is answered.
layer: how
status: blocked
---

# F052: The feed ranks hood, then metro, then wider, then Online — **BLOCKED**

**Bundle:** b2 recommended
**Loops:** 3 (Land here), 4 (Gather regularly), 7 (Make and be found)
**Canonical example:** [C1](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love), [C2](../../product/needs/use-cases.md#c2-a-member-organizes-awareness-across-multiple-places)
**Spec contract:** `community-platform.md` § Ranking, § Location resolution, § Metro is the feed's vantage point
**Status:** **blocked** — not a draft. Do not promote; do not ticket.

## Why this is not a scenario yet

The ranking rule itself is ratified and unambiguous: **hoods within the active metro first, then the rest of the metro, then wider, then Online.** That is not the problem.

The problem is that **a binary acceptance criterion about feed order cannot be written while a second ordering authority can legally overwrite it.** The criterion would read "Then Items appear in hood → metro → wider → Online order," and the honest answer today is "unless the member picked a sort, in which case the whole page is re-ordered client-side and local-first is gone." A test asserting the first clause would pass on a fixture with no sort applied and tell us nothing about the shipped product.

This is the same question the Home/Explore merge has to answer. It is one decision, not two.

## What has to be decided first

**Q1 — Does the `sort` control survive at all, and if it does, which layer owns ranking?** (`decision-surfaces.md` open question 11.)

`nearest` died with distance (F048). What survives is **newest**, **starting soonest**, and **most responses**, all of which re-order the entire fetched page client-side and all of which discard local-first — the one ordering the platform has committed to. Three answers, three different products:

| Option | What a member gets | Cost |
|---|---|---|
| **Drop the sort control** | One ordering, always. Simplest thing that could work. | Loses "what's happening soonest," which is a genuinely different question from "what's near me." |
| **Server ranks, client re-sorts within a band** | Local-first is inviolable; newest/soonest order *inside* each band. | The sort does less than its label promises, and on a sparse feed a member may not perceive it working at all. |
| **Sort is an explicit override** | Honest — the UI says the sort replaces locality. | Hands the member a switch that turns off the platform's strongest relevance signal, on a surface whose entire premise is locality. |

**Q2 — Does filtering move server-side with the ranking?** (`decision-surfaces.md` open question 12.)

Today Explore selects 100 rows and filters client-side. On an unranked catalog "the first 100" was arbitrary. On a hierarchy-ranked feed it is **the hundred nearest** — so a member filtering to Online searches exactly the rows least likely to contain any, and gets an empty result that is a lie. **This one is not really optional:** whichever way Q1 lands, filtering has to move with the ranking or the filters return wrong answers. It is closer to a consequence to be scoped than a question to be answered, but it needs to be said out loud before someone builds the ranking and leaves the filters where they are.

**Q3 — What do a metro's inner and outer rings actually do?** (`decision-surfaces.md` open question 7.) A ranking band below the core, a filter that excludes unless asked for, or a rendering distinction only. This one blocks only the criteria that mention ring membership; the core-metro criteria are writable without it. It is the least urgent of the three.

## What I can commit to now

One criterion is safe regardless of how Q1–Q3 land, because it follows from a ratified rule with no competing authority:

**Given** any browse surface with results
**When** results render in the platform's default ordering
**Then** every Online Item appears below every Item with a physical location. _Why: `decision-surfaces.md` § Feed ranking — "items rank by hierarchy proximity, and Online ranks last." This is what the creation-time warning (F051) promises the member, and it is the only part of the ordering that survives every option above._

That is one criterion. It is not a scenario.

## Recommendation

Answer **Q1 as part of scoping the Home/Explore merge**, not separately and not here. The merge cannot proceed without it either, and answering it twice in two places is how the two surfaces end up with two answers again.
