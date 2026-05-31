---
id: explore-pooled-commitment
purpose: A "I'll join if N others do" primitive — the substrate that turns atomized Member intent into collective force.
layer: what
status: draft
---

# 01 — Pooled Commitment Engine

> The substrate. Every other exploration in this set depends on Members being able to commit conditionally and trigger together when threshold hits.

---

## Practical-to-begin

A simple conditional-commitment primitive attached to any Item. When a Member encounters an Item kind that supports pooling — a CSA share, a bulk-order line, a workshop, an Initiative — they can declare *"I'll join if N others do."* The platform shows the current commitment count publicly; the threshold and deadline are set by the Item author. When the threshold hits, all committers fire together: payment is requested, signups are confirmed, the event is announced.

Six-to-twelve-month shipping looks like:

- Conditional pledge attached to existing kinds (`offer`, `gathering`, `initiative`).
- Public counter, private list (the count is the social proof; the names stay private until threshold).
- Hard deadline; soft cancel until that deadline; binding when threshold + deadline both clear.
- One-tap commit, one-tap retract. No friction.

That is enough to ship CSAs ("50 shares unlock the season"), bulk goods ("the price of a 50-unit case unlocks at 50 commits"), workshops ("the class runs if 10 commit"), and neighborhood services ("the cleaner takes 5 nearby clients or doesn't").

## Ambitious-for-the-goal

This becomes the platform's mechanism for converting expressed interest into committed action — the engine behind every other initiative.

- *Capital formation.* 200 Members commit to fund a member-owned grocery if it reaches threshold. Reg CF crowdfunding gates on the commitment count.
- *Insurance pooling.* 1,000 Members commit to a community emergency fund. The pool exists once committed; payouts work via Member governance.
- *Policy coordination.* 10,000 Members commit to support a right-to-repair bill in their state. The campaign launches at threshold.
- *Federation formation.* Cooperatives commit to join a federation once the founding bylaws are ratified. The federation exists the moment threshold clears.
- *Land trust formation.* 25 households commit to a co-housing project once the site is identified. The CLT incorporates at threshold.

The leverage emerges because each Member's commitment is *conditional on others making the same commitment* — no one bears the social risk of being first, but everyone gets the benefit of going together.

## Why it serves the mandate

This is the lightweight form of countervailing power (treatment pattern 4 in [`anti-extraction.md`](../../product/foundation/anti-extraction.md)) and the substrate for cooperative formation (treatment pattern 1). It costs the platform almost nothing to ship; it gives Members the structural ability to do collectively what they cannot do alone.

On the Flourishing Index: commitment threshold mechanics let Members trade *time spent organizing* for *outcome unlocked at no individual risk* — they save time *and* gain access to better-priced goods, services, and group leverage. Both dimensions improve.

## Open questions

- **Commitment model.** Soft pledge (cancellable until firing) vs. hard commitment (binding when threshold hits) vs. layered (soft until last-mile, then hard). The right shape probably varies by Item kind — CSAs want hard at deadline, workshops can stay soft.
- **Privacy.** Public N counter, private list of committers — but how does a Member trust the count is real? Cryptographic commitment? Optional public list per Item?
- **Schema.** Is this a property on existing Item kinds, or a new `pooled_commitment` substrate row that any Item can reference?
- **Failure modes.** What happens if 49 of 50 commit and deadline passes? Auto-extend? Refund-only? Author-decides?
- **Abuse vectors.** Bot pledges to inflate counter; pledges followed by mass-retract right before threshold; Members signing up the same neighbor 20 times.

## Where this connects

- [`anti-extraction.md`](../../product/foundation/anti-extraction.md) — treatment patterns 1 and 4.
- [`item.md`](../../product/systems/item.md) — adds pooling capability to Item kinds.
- [`member.md`](../../product/systems/member.md) — commitment surfaces in Member profile.
- Every other exploration in this set depends on this one shipping first.
