---
purpose: Decision — the producer values declaration, its permanent sourcing constraint, the deferral of support/oppose, and the general report path that ships in v1 instead. Carries the one absolute that needs `weigh` before any ticket encodes it.
layer: how
status: backlog
---

# Decision: the producer values declaration and how consumers respond to it

**Raised by:** the v1 positioning ratification, 2026-09-04. Scope context: [`../now/bundle-1.md`](../now/bundle-1.md) § Positioning.
**Type:** B — a real architectural decision.
**Blocks:** v1 workstream 5 (producer minimal profile). Gate B applies — the absolute in § 2 must be ratified by `weigh` before a ticket is drafted.

---

## 1. What was ratified

Producers self-declare what they stand for on their profile. The declaration is part of the v1 producer minimal profile.

The declaration exists because v1's positioning focuses the *audience* — progressive-leaning locals in one metro — while leaving the *mechanic* open to anyone. The badge is what makes that split coherent: it lets a reader see where a producer stands without the platform having to police who is allowed in. It only does that job if it can vary, which is the argument recorded in the bundle for keeping the mechanic open.

## 2. The sourcing constraint — permanent, and it needs `weigh`

> **A values declaration is written by the Member it describes. The platform never sources it, never infers it, and never attaches it from voter registration records, donation databases, purchased consumer files, inferred affinity, or any other external dataset.**

**Why it is permanent rather than a v1 choice.** Items carry locations. A producer with a live Item is a person the platform can place on a map at a known time. A political label attached to that person by the platform — however accurate the source — turns the profile into a targeting record, and the accuracy of the source makes it worse rather than better. Self-declaration is the entire difference between a values badge and a doxxing vector.

**This is a commitment, not a bet.** No observation would justify reversing it; reversing it means deciding to be a different kind of platform. Under the durability scheme it takes `Overturned by: memo` and a State-tagged `Intent`, and it belongs in [`../../product/foundation/policy.md`](../../product/foundation/policy.md), beside the accountable-participation and coarse-location commitments it rhymes with.

**Action required before any ticket:** `weigh` walks this statement and lands the State-tagged Intent in `policy.md`. Rebuild rule 11 Gate B stops ticketing until it does.

## 3. Consumer response — resolved 2026-09-04: both buttons deferred, a report path ships instead

**Support and oppose are both deferred. Deferred, not rejected.**

A voting mechanic only means something once there are enough buyers and producers for the signal to carry information, and bad actors do not arrive before there is an audience worth targeting. Building voting mechanics for a platform with sixteen items is premature on both counts — the signal would be noise and the abuse it defends against has no reason to exist yet. The name itself also does a fair amount of the filtering work at this stage.

The earlier recommendation — support public, opposition private — stands as the *shape* to return to when the mechanic is built. Its reasoning is unchanged and worth keeping: a public oppose control on a small local business with few ratings is a brigading vector, where the same coordination against a support counter merely inflates it. That asymmetry in harm is what justifies the asymmetry in the control, and it will still be true at density.

The count sub-question travels with the deferral. It is not open work today.

*Overturned by: evidence — producer or buyer density reaches a point where members are asking how to signal backing, or the first coordinated-abuse case arrives.*

### What v1 gets instead: a general report path

Not a values feature. Not political. A way for any member to tell the operator that something needs looking at, in any context.

**Minimal scope:**

- A discreet report affordance on Items and on producer profiles.
- **No public counter, no visible state.** Nothing the reported party or any other member can see.
- Routes to the operator — a real destination, not a queue nobody reads.
- **Free text with a light reason, not a fixed taxonomy.** At this stage the operator learns more from what people actually write than from categories guessed in advance. The taxonomy, if one is ever warranted, gets derived from the free text rather than invented ahead of it.

**Why this is worth building now when the voting mechanic is not.** The two look like the same feature deferred at different rates; they are not.

1. **There is currently no channel at all for a member to tell the operator anything.** That gap exists from the first user, not the thousandth. It does not scale into existence the way a voting signal does — it is fully present at zero density, and the cost of not having it is that the first person with something to say has nowhere to say it.
2. **It closes a hole already flagged.** [`decision-business-identity-impersonation.md`](decision-business-identity-impersonation.md) established that local name scoping prevents squatting but **not** impersonation, and named a claim-or-verification path as needed and unscoped. Its own closing line asks for exactly this: *make sure the report path exists and someone actually watches it* — because the first impersonation will happen before any of that is designed, and the only bad outcome is having nowhere for it to go. This is that path's front door.

One small feature — a link, a form, and a destination — covers bad actors, impersonation, and general feedback.

### The operating condition — not a nicety

> **A report channel nobody answers is worse than no report channel.** It teaches members that telling the operator anything is pointless, and that lesson is expensive to unlearn.

**This is an operating commitment from the PM, not an engineering task.** Before the affordance ships, two things must exist: a real destination that a human reads, and a rough response commitment — a stated turnaround the operator intends to keep, however informal. Neither is code. Both are ship conditions.

Treat this as a gate on workstream 9, not as documentation of a risk.

## 4. What this does not decide

- The declaration's shape — free text, a fixed set, or tags. Undecided. **Recommendation on the table:** [`audit-producer-signup-comparables.md`](audit-producer-signup-comparables.md) § 4 argues for free text — every comparable uses a fixed set because fixed sets filter, but a fixed set requires the platform to author the list of politics a producer may claim, which is a cousin of the harm § 2 prevents. Awaiting PM.
- Whether the declaration is visible to logged-out visitors.
- Whether a Group (kind='business') carries a declaration separately from the Member who owns it.

## 5. Next steps

1. **PM names the report destination and the rough response commitment** (§ 3). Ship condition for workstream 9, not a follow-up.
2. `weigh` lands the § 2 commitment in `policy.md`.
3. `scope` writes the producer-minimal-profile scenario and the report-path scenario; `ticket` follows.
4. Revisit support/oppose when the § 3 falsifier fires — not before.
