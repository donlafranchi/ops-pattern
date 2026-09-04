---
purpose: Decision — the producer values declaration, its permanent sourcing constraint, and the recommended consumer-response mechanic. Carries the one absolute that needs `weigh` before any ticket encodes it.
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

## 3. Consumer response — recommended, pending PM confirmation

**Not ratified.** The PM proposed two buttons: support and oppose. The recommendation put to him instead:

> **Support is public. Opposition is private.** One button to back a producer, and a report path that routes to the operator rather than to a public counter.

**Why.** A public oppose control on a small local business that has just declared a political position is a brigading vector. With few ratings — which is every producer on a v1-scale platform — a handful of coordinated clicks buries someone, and the platform has no density to dilute it and no moderation staff to adjudicate it. The same coordination against a public support counter merely inflates it; against a public oppose counter it destroys a livelihood. The asymmetry in harm justifies the asymmetry in the control.

Routing opposition to the operator keeps the signal — genuine complaints still arrive, and they arrive somewhere a human can weigh them — without turning it into a public scoreboard anyone can pile onto.

**Open sub-question:** does the support signal display a count at all? [`../../product/ui/design-language.md`](../../product/ui/design-language.md) Principle 4 keeps badges and metadata off photo cards, and the surface-calm posture rules against numeric engagement badges. A count is the obvious design and the one most at odds with the design language. Options: no count; a coarse band; count visible only to the producer. Unresolved — decide before the profile surface is ticketed.

*Overturned by: evidence — support signals go unused at v1 density, or producers report that a private report path leaves genuine complaints invisible.*

## 4. What this does not decide

- The declaration's shape — free text, a fixed set, or tags. Undecided.
- Whether the declaration is visible to logged-out visitors.
- Whether a Group (kind='business') carries a declaration separately from the Member who owns it.

## 5. Next steps

1. PM confirms or overrides the support-public / opposition-private recommendation (§ 3).
2. PM decides the count sub-question (§ 3).
3. `weigh` lands the § 2 commitment in `policy.md`.
4. `scope` writes the producer-minimal-profile scenario; `ticket` follows.
