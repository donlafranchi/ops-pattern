---
id: F085
title: /join is a pitch, not a second door
status: draft
date: 2026-09-15
depends: [F081, F082]
---
## Story

Someone gets a link from a neighbour and lands on `/join`. The page is blunt in a way the rest of the app is not: here is what this is for, here is who it needs, here are examples of the kinds of thing people put on it. They already know what they'd offer, so when they sign up — the same signup everyone uses — they are asked the creator question straight away instead of meeting it later at their first Page. Nothing about their arrival is written down. They are a member, identical to every other member, who happened to be told what this was before they joined.

## Acceptance

1. `/join` has **exactly one action, and it is the standard signup** of F081. No other control on the page creates an account or begins one.
2. An account created from `/join` is **byte-identical in shape** to one created anywhere else — same fields, same record, no extra column, no flag, no source marker.
3. **Nothing about having arrived via `/join` is stored on the member.** The intent lives for the length of the visit and no longer.
4. Someone who signed up from `/join` is offered **F082's attestation step immediately after signup** — the same step, not a variant of it, and still only once per member.
5. Declining it leaves them a member exactly as if they had signed up anywhere else, and the step is offered again at their first Page per F082.
6. **No person-noun appears in any user-facing string on the page** — the rule of `product/foundation/nouns.md`, which this surface is not exempt from.

## Not this

The wording — Don writes it. Any stored source, referrer, or campaign field. A second account type, a second creator path, or a change to F082's step. Keeping the page's current claim that signup is "email and password" — F081 settles what signup asks for.

## How it relates to F081 and F082, so nobody reads it as a third flow

**There is one signup and one creator step.** `/join` changes **sequence and framing, not mechanics**: the creator question comes right after signup rather than waiting for a first Page. That is the same shape as F076's waitlist answer — **a property of the visit, not a field on the account** — which is what keeps the no-stored-role rule intact.

**The honest cost of not storing it:** a refresh, a return visit, or finishing signup on another device loses the framing, and the person meets the creator step later like anyone else. That is the price of criterion 3 and it is the right price.

## Copy requirements — not wording

**The heading must not narrow the product to farmers markets.** It currently reads *"Sell at a farmers market? Get listed."* Markets are one example among many; the page's examples are illustrative and must read as illustrative.

**Three person-noun violations are live on this page today** *(2026-09-15)*: the eyebrow **"For vendors"**, the primary button **"Sign up as a vendor →"**, and the heading **"Share with another vendor."** Each is a user-facing string and each fails criterion 6. *(Four further occurrences are in code comments and identifiers, which the rule does not reach.)*

**The page also describes a product that no longer exists** — booths, market schedules, follow-for-market-updates. Broadening the heading alone does not fix that.
