---
id: why-messaging-problem
purpose: Why messaging is the thing most likely to break this platform, what the mitigations are, and what has to be true before any of it ships. A standing problem statement, not a design.
layer: why
status: active
owns:
  - messaging-abuse-problem
---

# The messaging problem

> **In the PM's words: *"I want the messaging problem described so we can always remember why it's important and try to come up with ways to mitigate the vitriol."*** This document exists to be re-read before every increment, not once.
>
> **It states the problem and lays out the options. It does not choose.** The open questions at the bottom are for the PM.

## The problem

**Anonymous messaging between strangers produces vitriol, and vitriol is the normal condition of the internet.** It is not an edge case, a moderation failure, or a symptom of bad users. It is what the surface does when it is built without controls.

**This platform is for decent people who care about each other and the place they live** ([`what-this-is.md`](what-this-is.md)). **Those two sentences are incompatible.** A product that gives strangers an unwitnessed channel to each other gets the internet's behaviour regardless of who it was built for and what its sign says.

**The controls have to exist before the messaging does.** Every platform that added them afterward failed to — not because the engineering was hard, but because by then the behaviour had a constituency, the moderation cost was already unaffordable, and the people who would have made it good had left. **Retrofitting is the failure mode, and it is the only one this document is trying to prevent.**

This is [`policy.md`](policy.md) Filter 3 — *can this be abused?* — applied to the one surface where the answer is unambiguous.

## The axis: who may speak to whom unprompted, and who is watching

**The product is heading toward messaging in increments.** Each increment widens reachability. **Organise every control decision around this ladder, because each rung is a different problem and they are routinely discussed as one.**

| Rung | Who speaks | To whom | Witnessed? | What the increment adds |
|---|---|---|---|---|
| **0 — today** | nobody | — | — | `message` is forbidden on every noun ([`verbs.md`](verbs.md)). No message, thread or comment exists anywhere. |
| **1 — announcements** | one manager | members who joined | yes, by the group | The audience opted in; the author is one accountable person. **Failure mode is broadcast fatigue, not vitriol.** |
| **2 — replies** | any member | the same members, bounded by a post | yes | **First member-authored text visible to a group.** Standing is membership; the post's author is a natural first moderator. |
| **3 — member-initiated posts** | any member | the same members, unbounded subject | yes | The subject is no longer set by someone with standing. **Needs a removal path that is not the post author.** |
| **4 — direct messages** | any member | one member, privately | **no** | **The step change.** |
| **5 — discussion** | any member | beyond a group's members | partly | Reaching people who did not opt in. **This is where "strangers" enters the model.** |

**Two variables, not one: reachability and witnessing.** Rungs 1–3 widen who may speak. **Rung 4 removes the witnesses.**

**That matters more here than at most platforms, because witnesses are the whole enforcement model.** [`promises.md`](promises.md) § How good faith is enforced ratifies that good faith is held by community and peer pressure rather than platform policing — *"a vendor who claims to be somewhere they are not is seen by their own followers, and the social cost lands immediately."* **Peer pressure requires peers who can see.** A direct message has none. **So the surface most likely to carry abuse is the one the platform's stated enforcement model does not reach at all** — and nothing in the repo currently acknowledges that.

**The practical consequence: rungs 1–3 are governed by an existing commitment. Rung 4 needs its own, and does not have one.**

## The PM's proposed mitigation

**Recorded as his, 2026-09-09, in his framing:**

> **Members pick a neighbourhood and a metro. If someone communicates outside their neighbourhood and metro, AND it is impolite, AND people flag it, then the platform takes action.**

**The substrate is nearly free.** The hood-and-metro pair is already designed ([`planning/backlog/scenario-F049-newcomer-picks-a-hood-and-a-metro-at-signup.md`](../../planning/backlog/scenario-F049-newcomer-picks-a-hood-and-a-metro-at-signup.md)) and is a signup requirement, not a new ask. **The instinct behind it is right and is the same instinct the rest of the product already runs on: locality is the accountability mechanism.**

**Two things to put to the PM rather than smooth over.**

### 1. As stated, those are ANDs — so the neighbour is not covered

**All three conditions must hold for the platform to act. In-area vitriol therefore falls outside the gate entirely.**

**That is the more likely case and the more damaging one.** More likely because local interaction is the entire product — the people a member talks to are, by construction, mostly nearby. More damaging because a hostile stranger three states away is an annoyance, and a hostile neighbour is someone you will see at the market, who may know where you live, and whom you cannot leave.

**Three readings, and they are different products:**

- **A — AND, as stated.** Narrow, cheap, no false positives. **Covers the case that matters least.**
- **B — a score.** Proximity, flag count, volume and account age each contribute; a threshold triggers. Covers the neighbour case. **Costs a tunable nobody can explain to a member, and a number that is one rename away from being a reputation score** — which [`decisions.md`](decisions.md) § 5 forbids.
- **C — split the mechanisms.** Proximity governs **who may speak at all** (reachability, decided before a message is sent). Flags govern **what happens after** (relief, decided by the recipient). **Neither one judges politeness.** This is the shape the rest of this document argues for, and it is not what was proposed.

**Question for the PM: AND, score, or split?**

### 2. "Impolite" is not machine-decidable — flagged and nearby are

**Two of the three conditions are computable and one is not.** Saying so is not a quibble: the AND was written as though all three were the same kind of thing, and the design comes out differently once they are separated.

| Signal | Available to code? | Notes |
|---|---|---|
| **Proximity** — in-hood / in-metro / outside | **Yes**, with a constraint | `member_place_interests` is owner-only RLS and stays that way. The check must be a `SECURITY DEFINER` function returning a boolean — never a join, never a value the client sees. [`policy.md`](policy.md) already names this escape hatch. |
| **Flagged, by how many distinct members** | **Yes** | Only reliable if the flag table has a unique constraint on (utterance, flagger) from the first migration. **Distinct-flagger counts cannot be reconstructed later.** |
| **Volume** — messages, recipients, per window | **Yes**, and it is the strongest pure-code signal | Catches the mass-message pattern *before content matters at all*. Needs only timestamps. |
| **Standing** — prior membership, RSVP, follow, purchase | **Yes** | This is a reachability question, not a moderation one. |
| **Account age, first-hour behaviour** | **Yes** | Weak alone, useful in combination. |
| **Impolite** | **No** | A classifier is the platform forming a judgment about a person's character and acting on it. Adjacent to [`decisions.md`](decisions.md) § 5 at best; a rating with a different name at worst. |
| **Threatening, illegal, child-safety** | **No — and deliberately** | [`policy.md`](policy.md) § 2 already routes these to a separate flow with explicit human review. **Not the same problem as vitriol and must not be merged into it.** |
| **Whether a flagger is retaliating** | **No** | |

> **The line this produces: code can decide who may speak. Only a person can decide whether what was said was acceptable.**
>
> **So put the weight on reachability, where code is reliable, and keep the after-the-fact machinery small enough that a human can carry it.** A design that leans on judging content is a design that needs a moderation function this project has no operators for and no revenue to fund.

## Mitigations worth weighing

**Options with trade-offs. Nothing here is chosen.**

### A — locality as a rate limit, not a gate

Distance does not block; it slows and narrows. Out-of-metro contact is permitted but limited in volume and rate.

**For:** tunable, no hard wall in front of legitimate cross-metro contact — the producer selling two towns over, the person who moved. **Preserves the "help shape this" posture rather than the "prove you belong" one.**
**Against:** invisible limits are unexplainable, and the copy that explains them starts sounding like policing. A member throttled without knowing it concludes the product is broken.

### B — standing before speaking

Speaking requires a prior act: joined the group, RSVP'd, followed, bought something.

**For:** cheap, legible, needs no judgment, and reuses rows that already exist. **Makes the first message the only hard problem.**
**Against:** it excludes the newcomer with nothing yet. **That is [`promises.md`](promises.md) Guideline 2 in a non-money form** — a control that requires accumulation before you may participate is a gate on entry, whatever the currency. Named as a pull below.

### C — who may initiate to a stranger at all

**The reachability question, and the one that most changes the product.**

- **C1 — nobody.** All first contact runs through an Item or a Page: **the public act is the invitation.** Matches [`policy.md`](policy.md) § 1 exactly, costs nothing today, and is the current shape. **Cost:** an ask from someone with no group still has nowhere to land — already recorded as the open half of the volunteering blocker.
- **C2 — anyone in your metro.** Simple, uses substrate that will exist anyway. **Cost:** the neighbour case is precisely the in-metro case, so this protects against the least harmful stranger and none of the harmful ones.
- **C3 — anyone, but first contact is a request the recipient accepts.** Strong and well understood. **Cost:** it builds inbox and unread state, which the product has deliberately refused — *the board is a place you go, not a thing that arrives.*

### D — what a flag does, and who sees it

- **D1 — writes a row and nothing else.** Today's ratified report path. Honest, free, **and gives the flagger no relief whatsoever.**
- **D2 — the flagger stops seeing that member.** A block. **Immediate relief, no judgment, no operator, no threshold, reversible, invisible to everyone else.** **Cost:** does nothing to protect the next person.
- **D3 — N distinct flags reduce circulation pending review.** Matches [`policy.md`](policy.md) § 2's distinct-member threshold. **Cost:** needs a reviewer, and a review queue is a standing operational commitment.
- **D4 — flags are visible.** **Rejected on existing grounds** — a visible flag count on a person is a reputation surface, which promise 3 and [`decisions.md`](decisions.md) § 5 rule out.

> **The observation worth carrying forward: D2 is the highest-value control in this document and the cheapest.** A block needs no operator, no threshold, no classifier and no policy. **It is also the only control here that does not require the platform to form an opinion about anybody.**

### E — who acts

- **Members act.** Block, leave, remove replies to your own post, prune your own group. **Scales to zero operators and is the direct expression of the peer-pressure model.**
- **The platform acts.** There is **no operator concept anywhere in the code** — no role, no flag, no check. Rung 3 cannot ship without one, or without an explicit ruling that Page managers moderate their own boards and that is enough.
- **The line between them is not negotiable at either end.** Members cannot be left to handle threats, illegal content, or child safety; the platform should not be arbitrating rudeness. **Everything in between is the design space.**

### F — what the first migration has to carry

**Same argument the message-board ruling already won — *"I never want to have to do a migration and a rewrite."*** These cost nothing now and cannot be added cheaply later.

| Carry | Why now |
|---|---|
| **A state column on every utterance**, not a `deleted` boolean — `visible` / `hidden_by_author` / `hidden_by_flag` / `removed` | A boolean cannot distinguish *the author took it down* from *it was taken down*, and every later control needs that distinction. |
| **A flag table keyed (utterance, flagger), unique** | **Distinct-flagger counting is unreconstructible after the fact**, and every threshold mechanism in this document depends on it. |
| **A block table (blocker, blocked)** — even if nothing reads it at launch | Adding blocks later means rewriting every read path, not adding a table. |
| **Real author reference on every utterance** | Already ruled for `page_posts`. Extends unchanged. |
| **Timestamps, indexed** | Volume and rate signals are then computable with no new substrate. |
| **No per-member derived score column, of any kind** | [`decisions.md`](decisions.md) § 5. **A column invites the feature.** |

## Against the promises

**Promise 2 is the gate: member benefit weighed against product benefit.** Applied here, it sorts the controls:

- **A block protects the member.** It passes cleanly.
- **A reach throttle protects the platform first** — it reduces the mess someone else has to clean up — **and the member second.** Defensible, but it is a departure and needs the member-benefit line recorded, per [`promises.md`](promises.md) § Making promise 2 a gate.
- **A control that exists only to reduce moderation cost and takes reach from a member fails.** That is the test to apply to anything proposed later.

**Where mitigations and promises pull against each other — named, not resolved:**

- **Standing-based reachability versus Guideline 2 (never price out or exclude the small).** The guideline is written about money, but its shape is *participation must not require prior accumulation.* **Requiring standing before you may speak is that same exclusion in a different currency**, and it falls hardest on exactly the person the platform says it is for: the newcomer with nothing posted yet.
- **Effective controls versus the no-rating commitment.** The strongest abuse controls in the industry are reputation-weighted. **This project has given that up, deliberately and correctly, and the honest consequence is that its controls will be weaker than the state of the art.** Compensating with reachability and blocks rather than pretending otherwise is the trade being made.
- **Peer pressure versus privacy.** Witnessing is the enforcement model; private messages are the surface that needs enforcing. **These cannot both be satisfied — which is the real argument for keeping rung 4 late rather than for solving it.**
- **This is the second arrival of a collision already recorded.** [`promises.md`](promises.md) § Open question asks how community accountability works without becoming the rating economy. **The answer this document leans toward — members act for themselves, the platform does not score anyone — is a candidate answer to that question and should be tested against it rather than decided here.**

## The copy constraint

**No legal or tax language in any user-facing string, ever.** Not *violation*, *terms*, *prohibited*, *liability*, *required by law*, *reported to authorities*, *tax*. **Not in a flag form, not in a block confirmation, not in an empty state, not in an error.**

**It compounds with the constraint already ratified on the report path** ([`policy.md`](policy.md)): the copy must not imply that anyone will look. **So the strings available here are narrow — plain, first-person, no promise of review and no legal register** — and that narrowness is a design input, not an afterthought for whoever writes the microcopy.

## Open questions — for the PM

1. **AND, score, or split the mechanisms** (proximity governs reachability, flags govern relief, neither judges politeness)?
2. **In-area vitriol from a real neighbour — is anything meant to address it?** If nothing does, is that accepted and recorded, or is it the gap to close first?
3. **Who may initiate to a stranger at launch** — C1, C2 or C3?
4. **What does a flag do** — D1, D2 or D3?
5. **Does a block ship with the first surface that lets one member address another**, rather than after?
6. **Is an operator concept in scope before rung 3?** If not, is "Page managers moderate their own boards" the ruling?
