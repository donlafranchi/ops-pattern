---
id: why-decisions
purpose: The decisions that constrain every future decision — one line each, and what each rules out. One of the three durable documents.
layer: why
status: active
owns:
  - foundation-decision-set
---

# Decisions

> **One of three durable documents.** The other two are **the model** ([`primitives.md`](primitives.md) — the nouns, and what each deliberately does not have) and **the status** ([`../../STATUS.md`](../../STATUS.md) — what is true right now, one screen, overwritten). **Everything else in this repo either has a lifecycle or is a liability.**
>
> ### The principle
>
> **The code is the source of truth for how the system works. Git is the history.** A document that duplicates either is a liability, because it goes stale silently and someone believes it.
>
> **The evidence is 2026-09-07.** The docs said farmers markets existed when they had been retired. They said Explore browses members when it indexes items only. They said the standing badge was paused when it was one query away from switching on. **Every question that mattered that day was answered by reading the code**, and the documents that claimed to answer them cost time before they were disbelieved.
>
> So the rule for anything written here: **if the code can answer it, do not write it down.** A decision is worth writing because the code cannot tell you *why* it is the way it is, or what was rejected. That is what this file holds and the only thing it holds.
>
> ### What earns a place
>
> **A decision that rules out a whole class of future choices, and that we would have to argue about again if it weren't written down.** Everything else is a dated log entry ([`../../planning/DECISIONS.md`](../../planning/DECISIONS.md), where new rulings land before they are distilled up to here), a craft rule ([`../ui/design-language.md`](../ui/design-language.md)), or one of the three public promises ([`promises.md`](promises.md)).
>
> **179 statements across the foundation and playbook docs read as settled. Seventeen of them actually are.** The rest are not deleted — they are reclassified, and the originals stand where they were.
>
> **Format:** the decision, one line of why if the why is load-bearing, then what it rules out. **The last line is the point.** A decision earns its place by telling someone what not to build.
>
> **Open contradictions and never-ratified claims are at the bottom. They are not settled and are not listed above the line.**

---

## 1. Everything the platform touches serves the people it touches

*Business serves the people doing the work. AI serves the people it acts for. Data serves the people it describes. Capital serves the people it circulates among.*

**Rules out:** any feature whose value to the platform comes at a member's expense, however well implemented.

## 2. Wealth circulates; it is not extracted

The one thing we will not do is take value from people without serving them in return.

**Rules out:** selling member data, taking a cut that grows with someone else's dependence, any revenue line that works better when a member is stuck.

## 3. Paid visibility is not banned — it has to pass the member-benefit gate

*Revised twice on 2026-09-07. The absolute "nobody ever pays for visibility" was withdrawn — nobody had agreed to it. The material then landed as [`promises.md`](promises.md) § **Guideline 1**: visibility is not for sale **by default**, departed from only with a recorded reason that clears the member-benefit gate. **A guideline, not a ban** — the PM wanted wiggle room, not a prohibition.*

**Rules out:** shipping any paid-placement or advertising mechanic without first showing who it benefits on the member side and what the member gives up. An answer of "it funds the platform" is the product half, not the member half, and fails.

## 4. No engagement optimization, anywhere

Ranking may use where you are and what you said you like. It may never use what keeps you scrolling.

**Rules out:** infinite feeds, engagement-derived ranking, streaks, notification loops built to pull people back, and numeric badges that make participation a score.

## 5. The platform never rates, ranks, or labels a person

Only what a person wrote about themselves appears as a claim about them.

**Rules out:** star ratings, reviews, reputation scores, trust levels, ownership tiers, impact scores, and any attribute inferred or imported from an outside dataset.

*Applied 2026-09-07: the **"Active in the community" badge is removed.** A badge derived from holding a role is the platform telling people who counts — the same shape as the ownership tier it already refuses. **No replacement.** Activity could be counted from real activity if a signal were ever wanted; none was asked for, and adding one would re-cross this line from the other side.*

## 6. One word for a person; every role is derived, never stored

**Rules out:** account types, a creator/supporter split, seller-mode toggles, and any column that records what kind of person someone is.

## 7. A business is the people who do its work — there is no business entity

**Rules out:** corporate shells, business accounts separate from people, ownership transfer, succession, and any model where a company outlives the humans in it.

## 8. Groups are joined, never assigned

Being inside a boundary on a map is not consent to be in a group with everyone else inside it.

**Rules out:** geofenced membership, neighborhood feeds you are placed into, and the anonymous-complaint pattern that follows from both.

## 9. In public, locality is coarse; precision stays private

A person's exact location is theirs. Where they sell is a neighborhood, not an address.

**Rules out:** street addresses on public maps, distance-to-you readouts, location-scoped feeds and messaging, and serving a photo carrying the coordinates of the kitchen it was taken in.

## 10. Sharing is opt-in, granular, visible, and revocable

**Rules out:** default-on sharing, pre-checked boxes, consent inferred from terms of service, one opt-in that silently widens another, and any revocation the member has to do work to get.

## 11. The platform records facts about the world; it never performs legal acts or speaks legal language

**Rules out:** entity filings, binding votes, regulated agreements — and, in copy, every word that would make someone wonder whether they need an accountant.

## 12. No venture capital

An exit-aligned owner and a member-aligned platform want different things, and the pressure shows up as growth metrics before it shows up as a decision.

**Rules out:** priced rounds, anything convertible into them, and any revenue plan that only works at venture scale.

## 13. A Page is who; an Item is what

*Ratified 2026-09-07. Full definition in [`primitives.md`](primitives.md) § Page.*

**Rules out:** creating a Page for a single occasion, a browse surface or map that indexes Pages and listings as if they were the same unit, and a follower graph attached to anything ephemeral.

## 14. Measure what happens inside the app; the north star is time and money together

Discretionary hours and adequacy margin must both rise. Anything outside the app we cannot honestly measure, so we do not claim it.

**Rules out:** claimed local-economic-impact figures, multiplier effects, community-health scores presented as measurement, and any growth number treated as the goal rather than an indicator.

## 15. The platform is the technology layer, never the bank

*Lifted 2026-09-07 from the payments spec before it was archived — this was the only place it was written down.* A chartered partner holds money on members' behalf; the platform holds none for itself.

**Rules out:** the platform as deposit-taker for member balances, card numbers stored anywhere on our side, and any rail chosen on speed or cost alone without scoring where the fees end up.

## 16. What an assistant knows belongs to the member, and it never holds the keys

*Lifted 2026-09-07 from the agent-assistance spec before it was archived.* The context a member builds is theirs — exportable, deletable, never trained on. And the assistant never holds the credential it acts under; the capability is minted per turn and applied at the network edge, so it never enters the agent's context.

**Rules out:** training on member context, surfacing it to recommendation systems, showing it to other members or their assistants without explicit per-section opt-in, and any design where a long-lived credential sits inside an agent's reach.

## 17. A point asserts presence; nothing absent may make that assertion

*Ratified 2026-09-07. Mechanics in [`../systems/groups.md`](../systems/groups.md) § Where a Page appears is resolved, not stored.* A shop is at its address every day. A club with nothing scheduled is *of* an area, not *at* a place. Position is resolved at read time, never stored.

**Rules out:** a pin for anything that isn't there, a cached or materialized position, a Page in two places at once, and revealing a private address because a public appearance happened.

---

## Contradictions — two foundation statements that disagree. Not resolved here.

**A. "Neighbours, not strangers or creators" versus "everyone who posts is a creator."**
The design north stars refuse creator framing outright — it is why we carry no reach chrome. The role-language work landed *creator as a feeling the product produces, not a label it applies*, which is a reconciliation, not a ruling. **The question for the PM: is the north star's refusal now scoped to the word-as-label only, or does it still bar the aspiration too?**

**B. ~~"You will never pay for visibility" versus advertising still on the revenue menu.~~ RESOLVED 2026-09-07.**
The promise was removed — it was written into the docs without the PM's consent. Advertising is not banned; any specific mechanic passes the member-benefit gate first. The draft copy that carried it is rewritten. See [`promises.md`](promises.md).

**C. Bottom-anchored controls versus the shipped top search row.**
The design language forbids top-anchored search; the shipped browse surface has one, citing the research thesis. A review called the design language the winner and accepted the violation for one release. **Live, recorded, and expiring — but only if the follow-on chrome work actually happens.**

**D. "Rank, never filter" versus filtering the feed by metro.**
Demoted from a standing commitment to a versioned bet on 2026-09-04 with a revisit trigger. **Recorded as managed rather than resolved** — flagged here so the demotion is not mistaken for agreement.

---

## Never actually decided — treated as settled, ratified nowhere

**This is the finding that matters most.** The repo's own rule says every absolute carries a State tag, and that an untagged absolute is *unratified de-facto* and blocks downstream work. **Almost none of the foundation set carries one.** The thirteen decisions above are stated with the confidence the docs use — that confidence is inherited, not earned, until the PM rules.

Specific items where later documents cite an earlier one as agreement that never happened:

- ~~**"Reviews and star ratings are permanently deferred."**~~ **Resolved 2026-09-07 — kept**, on promise 3. A rating economy makes the platform the arbiter of who gets business, which is extraction in its most familiar form.
- ~~**"A values statement is never sourced or inferred."**~~ **Resolved 2026-09-07 — kept**, on promise 2. A label the platform attaches to a person it can place on a map is benefit-to-product at cost-to-member.
- ~~**"Nothing ships that cannot be taken down."**~~ **Resolved 2026-09-07 — kept on operational grounds, not constitutional ones.** No promise requires it; it stays because serving an image with no way to remove it is an unbounded liability. Recorded as an operations argument, not a principle.
- ~~**"The structure of the company will reflect the structure of the promise — something members own."**~~ **Withdrawn 2026-09-07.** Never consented to, never published. See [`promises.md`](promises.md) § Withdrawn.
- **The flourishing thresholds — 40 discretionary hours, 1.5× adequacy margin.** Presented as working targets in one doc and as the north star's definition everywhere else. **Still open.**

## Expired — describes something we no longer do

- **Locality defaults to geolocation.** Superseded; the shipped behaviour is a launch-locality default and the IP-geolocation step was deferred.
- **County replaces MSA as the geographic tier.** The MSA field is still in the schema and still read by the locality badge.
- **The producer values declaration.** Cut from launch 2026-09-07. The sourcing constraint survives the cut; the mechanic does not.
