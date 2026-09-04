---
purpose: Thinking document on business identity — what local name scoping fixes, what it leaves open, the genuine options for handling impersonation, and which parts have to be answered before the You rebuild.
layer: what
status: draft
---

# Business identity — thinking through impersonation

Not a decision record. This is the material to think with before committing to one.

## Where we already are

Three things were settled today and are not reopened here.

Business names are **local**. They are scoped to a hood or a metro. There is no global namespace and no platform-wide handle, and two businesses in different hoods can share a name without either being wrong.

The reasoning is that **name hoarding is a domain-name dynamic**. It only exists when there is one global namespace with exactly one winner. Scoping names locally removes the incentive rather than policing it — a name claimed in a hood you don't operate in reaches nobody and resells to nobody. That is a stronger fix than a rule against squatting, and it falls out of the location model for free.

A **hashtag-style global handle was considered and rejected**. It rebuilds the global namespace and drags in everything that namespace demands: verification, inactivity expiry, and per-member claim caps. A global handle and a neighbours product pull in opposite directions.

## 1. The problem this doesn't solve

Nothing above stops someone creating **"Joe's Pizza" inside Joe's actual hood** — same name, same place, aimed at the same neighbours.

Local scoping doesn't reduce this. It concentrates it. Squatting a name somewhere you don't operate is now pointless, so the only attack left worth running is the one that reaches real people: standing up a copy where the real business actually is.

Three things are at stake, and they're worth separating because they suggest different fixes.

**A member is misled about who they're dealing with.** They message, show up, pay, or plan around a business that isn't the one they meant. This is the harm that happens fastest and needs the least sophistication to cause.

**A real business's reputation is carried by someone else.** Every bad interaction on the fake page is charged to the real Joe. The victim isn't the person being deceived — it's someone who may not even know the platform exists.

**In a neighbours product the injured party lives nearby.** This is the part that makes it different from a trademark problem. There is no abstract brand here. There is a person with a lease and a phone number two streets over, whose neighbours are now confused about them. That also means the platform has an unusual advantage: the people best placed to know which Joe's Pizza is real are the ones already looking at the page.

Worth being honest about scale. This is a low-frequency, high-damage problem. Most people creating a business page are creating their own. The cost of the fix has to be paid on every honest creation; the benefit only lands on the rare bad one. That asymmetry is what should discipline the options below.

## 2. Options

**A — Do nothing; handle it reactively on report.** No claim step, no proof. When someone reports an impersonation, a human looks and removes it. Cheap to build (a report path and an admin action, both needed anyway). The operating cost is a queue that only exists when someone complains — and at today's volume, that's near zero. The real cost is latency and burden: the harm runs until someone notices, and the person who notices is usually the victim, who has to find the platform, sign up, and explain themselves. It also means the platform has no answer at the moment of confusion, which is exactly when a member needs one.

**B — Lightweight claim; first plausible claimant gets it.** Creating a business page under a name that already exists in that hood requires acknowledging the collision — you're told there's already one, and you either say you're a different business or you're the same one. No proof requested. Cheap to build, near-free to operate, and it converts a silent duplicate into a deliberate one. It stops the accidental and the lazy. It does not stop anyone who is willing to click through. Its real value may be evidentiary rather than preventive: it puts the impersonator on record as having been told.

**C — Verification.** Ask for proof of the business. The problem is that for a small local business there is usually **nothing to ask for**. A sole proprietor selling bread has no registration, no incorporation record, sometimes no business bank account. The proofs that do exist — a state filing, a business licence, a utility bill at a commercial address — are exactly the proofs the smallest and most local operators can't produce, so verification systematically disadvantages the members the platform most wants. Building it is moderate; **operating it is what kills it**. Documents arrive as photos, need a human to read, need an appeals path when rejected, need a retention and deletion posture because they contain personal data, and need someone to be available on a timeline that isn't weeks. Verification schemes almost always die of their queue, not their code.

**D — Community vouching.** Neighbours confirm that this is the business they know. This fits the product's shape better than any corporate proof does — it's the same instinct as the existing locality ladder, where community corroboration is already the intended second signal. It's cheap to operate because the work is distributed, and it produces a signal no document can: whether the people nearby recognise you. Two real weaknesses. It needs enough active members in a hood to mean anything, and **there is no such density today** — a threshold of three vouches is a threshold of three friends when the hood has eleven members. And it favours whoever is already on the platform, which can mean the copy gets vouched before the real business ever signs up.

**E — Ask the disambiguating question instead of adjudicating.** Rather than deciding who is real, show enough that a member can tell: hood, address, and who runs it, on the card and on the page. Cheap, and it fixes the misled-member harm without any claim, proof, or queue. It does nothing for the reputation harm, and it can't help when the impersonator simply copies the real details.

These combine more naturally than they compete. B plus E — a collision prompt at creation and enough context on the surface — is the cheap floor. D is what B and E grow into once there are enough neighbours for a vouch to mean something. A is the backstop underneath all of them, and it's needed regardless.

## 3. The three open questions

**How are two same-named businesses disambiguated in a metro feed?** The metro is the feed's vantage point, so a Sacramento feed can carry two Joe's Pizza cards from different hoods. Showing the hood next to the name is the obvious mechanism, and the objection is that it costs a line on every card to solve a collision most cards don't have. But the hood line may earn its place independently of collisions — in a metro-wide feed, *where* is useful on every card, not just contested ones. If that's true, this question dissolves into a layout decision that was going to be made anyway, and it doesn't need identity to answer it.

**Do local display names still need unique identifiers underneath?** Yes — display names never carry addressing. The question is only the shape, and the specs already answer it: uniqueness per place, not global. That is a design the platform has written down and not built. Today's live behaviour is the old global one, with no place attached, and the create flow quietly appends a random suffix when names collide — which is why two identical business names can be created right now with no warning to anyone. So this isn't an open question so much as unfinished work with a live contradiction underneath it, and it should be scheduled rather than debated.

**Is a multi-location business one identity or several?** This is a different question from an item having several venues; it asks whether the *name* spans hoods, not whether the inventory does. It bears directly on the other two — one identity across three hoods needs a different address shape than three identities that share a name, and it changes what the hood line on a card even means. It's also the question with the least evidence behind it. A real answer needs a real multi-location business on the platform, and there isn't one. Worth designing so that either answer stays available, and not worth choosing now.

## 4. What this touches

**The You surface.** You is being rebuilt as the producer surface, and it's where a business owner sees and manages what they've made. If a claim step exists, this is where an owner sees the state of their claim, and where a real Joe would go after discovering the fake one. It's also the only place a "someone else is using your name" signal could reasonably land.

**The create flow.** The sell walkthrough asks for a brand name as its first step and writes the draft immediately. Today it accepts a duplicate silently. Any option except A changes this step — it's where a collision prompt, a claim, or a vouch request would live, and it's the single highest-leverage place to intervene because it's before the fake page exists.

**Search and the feed.** Home has absorbed search and filtering. Two identical names in one metro is a result-list problem before it's an identity problem, and whatever disambiguation gets chosen shows up here first.

**Share links.** ~~QR cards~~ — *removed 2026-09-03; the platform generates no QR codes (`playbooks/PLATFORM-PATTERNS.md` § No platform-generated QR codes).* **This weakens the argument that followed, and the weakened form should be re-weighed rather than assumed.** The original reasoning: a printable card resolving to a page address is the one place the impersonation harm becomes physical and durable — a card taped to a booth pointing at the wrong Joe — which made settling the address shape urgent, because a printed link can't be migrated. With no platform-generated QR, the durable-physical-artifact case is gone for now; share links are revisable. It returns if producer-generated business QR is ever scoped.

## 5. What can wait

**Before the You rebuild.** Only two things. The address shape underneath display names — because You and the create flow depend on it, and it's already specified and simply unbuilt. (QR cards were a third dependant until 2026-09-03; that pressure is off.) And the cheap floor: a collision prompt at creation, plus a report path. Together those are days of work, not a programme.

**After there are real businesses.** Everything else. Verification, vouching thresholds, the multi-location identity question, and whether hood belongs on every card. There is almost no live data today — a handful of seeded groups, one of them a business — so most of the reasoning above is theoretical, and the parts that need judgement need cases to judge. Building the machinery now means tuning thresholds against no traffic and designing appeals for a queue that's empty.

The one thing worth doing early that isn't obviously urgent: make sure the report path exists and someone actually watches it. Not because volume demands it, but because the first impersonation will happen before any of this is designed, and the only bad outcome is having nowhere for it to go.

> **Answered 2026-09-04 — the report path is in v1.** A general report affordance on Items and producer profiles, routing to the operator, no public state, free text with a light reason. Scoped in [`decision-producer-values-declaration.md`](decision-producer-values-declaration.md) § 3 and listed as workstream 9 in [`../now/bundle-1.md`](../now/bundle-1.md). The *someone actually watches it* half is recorded there as a ship condition on the PM, not an engineering task. This does not decide between options A–E above; it builds the front door every one of them needs.
