---
id: what-reciprocity-and-goodwill
purpose: Open design question on Offer/Ask reciprocity and goodwill.
layer: what
status: reference
---

# Reciprocity and Goodwill

**Status:** Open design question. Surfaced 2026-05-08 while drafting [`use-cases.md`](../needs/use-cases.md). Not yet a system spec — this doc names the tension, sketches options, and stays out of the way until the question becomes load-bearing for a build.

## The question

The Sharing family of loops — Offer (Loop 5) and Ask (Loop 6) — is the only place on the platform where value moves between Members without money changing hands. Every other surface has a natural anti-abuse mechanic: Trade has price; Pooling has structured pledges with capital partners; Gathering has the cost of showing up. Sharing has no built-in friction. That is what makes it lightweight, and it is also what makes it gameable.

Two design observations push toward needing some reciprocity surface:

1. **Offer and Ask are functionally one mutual-aid relationship**, not two unrelated loops. In lived neighborhoods, the same person both has things and needs things. Treating them as fully decoupled understates how the loop actually works.
2. **Every existing mutual-aid surface — Buy Nothing groups, Nextdoor's "free" section, neighborhood mailing lists — gets gamed by takers.** People who only ask, never give, create predictable resentment that erodes the surface for everyone. The healthy versions of these groups all have some informal reciprocity norm; the platform should consider whether to encode one.

The proposal under consideration: **goodwill points, possibly with an "offer before ask" gate.**

## Why this is hard

The instinct toward gating is correct in spirit but conflicts directly with several existing platform commitments:

**Activation energy is supposed to ascend through the families.** Per [`member-journey.md`](../needs/member-journey.md), Sharing sits between Gathering and Trade specifically because it is light. Gating Ask behind Offer makes the Sharing family heavier than Trade for some Members, inverting the gradient.

**The people who most need help are often the least able to offer first.** A new parent in a hard month, a recently arrived neighbor without a network, someone in a financial or health crisis — these are the canonical Ask cases. A reciprocity gate excludes them by design. That is the failure mode.

**Goodwill points risk reproducing the engagement-game we explicitly avoid.** The platform commits to no engagement-optimized feed, no pay-for-visibility, no rating system. A points balance that determines what you can do is in the same family of mechanics — it gamifies behavior the platform is supposed to keep human.

**Quantified reciprocity erodes the texture of community.** Real neighborhoods have informal tabs that everyone is fuzzy on, on purpose. The fuzziness is the social contract. A precise points system replaces a generative ambiguity with a transactional ledger, and the ledger is what BuyNothing groups deliberately don't keep.

## Possible paths

These are not recommendations — just the design space, narrowed.

**Visible reciprocity history, no gate.** Each Member has a Sharing log: how many times they've offered, how many times they've asked, fulfilled vs. unfulfilled. Visible to themselves and (perhaps) to the recipient of an Ask. No threshold. The transparency itself is the social pressure.

**Soft nudges, no gate.** When a Member is about to post their nth Ask in a window without any Offers in the same period, the platform shows a gentle prompt — *"Anything you've been thinking about offering lately?"* The nudge is the only intervention; the Ask still goes through.

**New-member grace period.** No reciprocity surface for a Member's first 30 / 60 / 90 days. The platform refuses to let the gate exclude newcomers, which is the failure mode that matters most.

**Group-scoped trust, not universal points.** A Group can adopt its own reciprocity norm at the Group level (per [`groups.md`](../systems/groups.md)), and the platform exposes the *tools* without imposing the norm. Some Groups run formal time-banks; some run pure Buy-Nothing-style giving; the platform supports both without making one the default.

**Asymmetric visibility.** Members see their own balance; nobody else does. Pure self-reflection mechanic. No social pressure, no gating, no comparison.

**Decay.** Whatever the surface is, it forgets. A Member's reciprocity record from two years ago does not constrain them today. This is structurally important — an unforgiving ledger is the failure mode of every karma system.

## What this is not

This is not the same problem as fraud prevention, sockpuppet detection, or paid-poster identification. Those are platform-integrity issues with their own tooling (identity verification, behavioral signals, moderation). The reciprocity question is specifically about how to make Sharing durable as a social practice without breaking the lightness that makes it work.

## When this becomes load-bearing

This question does not need to be resolved before the Sharing surfaces ship. The MVP can launch Offer and Ask with no reciprocity mechanic at all and observe whether the abuse pattern materializes at the platform's actual scale. The wrong move is to bolt on a points system because the *abstract* abuse case is easy to imagine. The right move is to build the surface, watch it, and add the lightest intervention that the observed pattern actually requires.

The trigger for reopening this doc:

- The first Community on the platform asks for a reciprocity tool, OR
- The Sharing surface shows a measurable taker-pattern that is suppressing Offers (Members report it; Offer rate declines after Asks accumulate), OR
- A canonical-examples Loop 5/6 example is filled in and the example itself reveals which intervention would have helped.

Until then: the question is named, the failure modes are named, and the platform ships Sharing without a gate.
