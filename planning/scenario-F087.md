---
id: F087
title: One create flow, and what you call it depends on what you are starting
status: draft
date: 2026-09-15
depends: [F060, F069]
---
## Story

Priya wants to convene a Tuesday run. Marcus wants to sell hot sauce. Dana is starting a monthly repair meetup. All three tap the same control and are asked one question first: what are you starting? Priya picks hosting a gathering, Marcus picks opening a shop, Dana picks starting a group. From there each sees a flow written in their own words, offering the tools their thing needs and not the ones it doesn't. Underneath, all three just created a Page. **None of them was ever told to open a shop in order to do something that isn't a shop.**

## Acceptance

1. **Every path through the create flow produces a Page.** There is no second entity, no alternative record, and no path that creates something else.
2. **Purpose is chosen first, from a named set**, before any other field. Nothing is pre-selected and nothing is inferred.
3. **The words shown to the person differ by purpose** — headings, labels, buttons, and the confirmation. Opening a shop, posting a gathering and starting a group read as three different things.
4. **The tools offered differ by purpose.** A purpose's flow omits steps its thing does not need, rather than showing them disabled or skippable.
5. **"Shop" never names the general act.** No string outside the shop purpose calls creating a Page opening a shop, and no person reaches a shop-worded step from a non-shop purpose.
6. **The chosen purpose gates nothing afterwards.** It selects copy and steps at creation and confers no permission, no badge, and no permanent kind — per the Page entry in `product/foundation/nouns.md`.

## Not this

Converting one Page into another — rejected outright since 2026-09-07 and still rejected. Creating two Pages at once; they are made sequentially. The business claim, which remains the friction gate and is separate from the purpose dropdown. Naming the members of the purpose set — that is Don's, and criterion 2 only requires it be named and closed.

## What this dissolves

**"Hosting requires opening a shop first" was never a missing substrate. It was a label on a door.** `WHERE-IT-IS.md` records it as the one awkward thing a person meets today; F060 already ticketed the entry point. This scenario makes the fix general instead of a special case for hosts.

## Checked against what is already approved — no conflict on self-classification

**The dropdown classifies the thing, not the person, and that is exactly what the existing rules ask for.** F060 criterion 2: *"`/you/create`'s first question is what they're starting, not what they are — no self-classification anywhere in the flow."* Don's dropdown asks what they are starting. **The rules it might have collided with are all about the person:** no stored role on a member, no account type, no umbrella noun for a person. None is touched.

**And a prior ruling already asked for this.** `DECISIONS.md`, 2026-09-07: *"Different creation flows per type is correct; nothing ever mutates."* F087 is that ruling built.

## The purposes themselves

**Named, defined, and sized in `product/systems/page-kinds.md`** (draft, 2026-09-15): someone selling, someone with a recurring gathering, and a deliberately thinner one-time gathering. That document carries what each needs at minimum, what it does not need, the schema recommendation, and the full list of what the thin one lacks.

## One real conflict, for Don to rule on

**A one-time gathering.** Don: *"Hosting is essentially a simplified version of creating a group or recurring gathering, for a one-time thing"* — which makes hosting a Page. But `nouns.md` says a Page has **"No Page for a single occasion"**, and `DECISIONS.md` 2026-09-07 says *"A Page is who; an Item is what. One-time events are Items with a date, filed under a Page — no Page is created for a single occasion."* The stated reason was that browse and the map would index listings as if they were people, and a follower graph on something ephemeral is worthless.

**Two readings, and this scenario cannot pick one:** the host purpose creates a Page like the others, reversing that rule; or it creates an Item filed under a Page the person already holds or gets by default, keeping the rule and making hosting the one purpose whose output differs. **Criterion 1 as written assumes the first.** Don rules.
