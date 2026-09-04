---
id: how-bundle-1
purpose: Scoping definition for SocialUs v1 — positioning, what ships, what defers, the deadline, and the schedule risk against it. Per-feature progress lives in the scoreboard.
layer: how
status: active
---

# Bundle 1 — SocialUs v1

> **Supersedes the earlier "Primitives MVP" scope on this file (ratified 2026-09-04).** The primitives substrate and the producer/gatherer/newcomer surfaces built against that scope are shipped and stay shipped — they are the floor v1 stands on, recorded in [`bundle-1-checklist.md`](bundle-1-checklist.md). What changed is the *remaining* scope: v1 is now a named, dated finishing list, not the full fourteen-surface set. Where [`mvp-goal.md`](mvp-goal.md) and this file disagree, this file wins.
>
> Sub-theme sequencer: [`bundle-1-themes.md`](bundle-1-themes.md). Build order: [`plan-b1-surface-sequence.md`](plan-b1-surface-sequence.md).

**Name:** SocialUs. Unchanged — see [`../../PROJECT.md`](../../PROJECT.md).

**Deadline: end of September 2026.** Ratified 2026-09-04. See § Schedule risk — the scope below is larger than the date.

## Hypothesis

**Ordinary people will step forward where they live, and their neighbors will show up for them.** Unchanged.

---

## Positioning — versioned, not constitutional

**V1 markets to progressive-leaning locals in one metro.** This is a go-to-market choice about who we seed the platform with and who we talk to. It is a **bet**, held at the version tier, and it is expected to change as the product grows.

**The platform mechanic stays general.** Nobody is barred from joining, nobody is removed for what they declare, and no surface conditions access on a declared value. Audience is focused; the mechanic is open. These are different layers and v1 keeps them different.

### Why the mechanic stays open — the badge has to be able to vary

A values declaration only carries information if it can vary. On a platform where every producer declares the same thing, the badge tells a reader nothing they did not already know from the domain name, and the support signal degrades from *this person backs that producer* to *this person is here*. A uniformly one-sided platform makes its own values badge dead weight. Keeping the mechanic open is therefore not a concession to fairness at the cost of the product — it is what keeps the product's central signal legible.

Focus the audience. Keep the mechanic open.

### "Excluding" was considered and rejected

The alternative on the table was a membership policy — screening or removing people by declared political position. It was rejected for two reasons, both independent and either one sufficient:

1. **It needs staff the project does not have.** A membership policy is only as good as its enforcement, and enforcement means vetting on the way in, an appeals path for contested calls, and ongoing moderation of accusations that someone lied on their declaration. That is a standing operations function. A solo founder cannot run it, and a policy that exists on paper and is unenforced in practice is worse than none — it promises a guarantee the platform will fail to keep.
2. **It is legally exposed.** Political affiliation is a protected characteristic under public-accommodation law in several states and cities. A platform brokering local commerce is squarely the kind of service those statutes reach. "Market to" carries no such exposure; "exclude" does.

Marketing to an audience is reversible in an afternoon. A membership policy is not — it accrues enforcement precedent, banned-account history, and a reputation the platform cannot walk back. On the reversibility rule, marketing wins outright.

*Overturned by: evidence — the seeded metro fills with declarations that do not vary, and the badge stops discriminating between producers.*

### On the constitution — narrow, and deliberately so

**The constitutional tier stays small.** Few items, genuinely durable, constraining as little as possible. The point of a narrow constitution is that it leaves room for the versioned tier to take strong, specific, early positions — like the one above — without every stance hardening into a permanent commitment the project then has to defend or formally reverse.

This is a statement about *how much belongs in the constitutional tier*, not a challenge to the two-tier scheme. It is compatible with, and reinforces, the durability work in [`../backlog/decision-durability-register.md`](../backlog/decision-durability-register.md): a census cap on State-tagged commitments and a default of `Overturned by: evidence` are exactly the mechanisms that keep the constitutional tier from inflating. Bold early positioning lives in the versioned tier by design.

### Producer values declaration

Producers self-declare what they stand for on their profile.

**Self-declared only. Never sourced, never inferred, never attached from voter records, donation databases, or any external dataset.** This is a permanent constraint, not a v1 implementation choice. Items carry locations; a values label the Member did not write, attached to a person the platform can place on a map, is a doxxing vector regardless of how accurate the source is. Self-declaration is what keeps this a values badge rather than a targeting list.

Full mechanic, the consumer-response recommendation, and the open sub-question: [`../backlog/decision-producer-values-declaration.md`](../backlog/decision-producer-values-declaration.md). **The "never sourced, never inferred" constraint requires `weigh` to land as a State-tagged commitment in [`../../product/foundation/policy.md`](../../product/foundation/policy.md) before any ticket encodes the field** (rebuild rule 11, Gate B).

---

## What ships in v1

Eight workstreams. Everything already merged stays; this is the remaining list.

1. **Item detail links resolve.** Fix the 404s, **including Group-filed Items.** Events are in v1 and Group-filed rows are part of the broken set, so the Group place-path case is in scope, not deferred with the four unbuildable kinds. Decision open: [`../backlog/decision-item-canonical-urls.md`](../backlog/decision-item-canonical-urls.md).
2. **Vendor/market retirement finished.** `/register-vendor`, `/vendors/[slug]`, `/you/vendor/*` and the shared-file prunes. Scope + removal order: [`../backlog/audit-vendor-market-retirement.md`](../backlog/audit-vendor-market-retirement.md). **Boundary: the sweep only.** The You producer rebuild it was bundled with is out (see below).
3. **Card fix and populated content.** The Item card renders correctly and carries real products and real producers — not placeholder rows.
4. **Home/Explore merge.** Explore is absorbed into Home; direction already ratified in [`../backlog/decision-surfaces.md`](../backlog/decision-surfaces.md).
5. **Producer minimal profile**, including the values declaration.
6. **Group events.** A gathering can be created and filed under a Group.
7. **Onboarding, empty states, and copy** — including a *"we're looking for help, reach out to join"* line. Journey list and gaps: [`../backlog/initiative-storyboards-v1.md`](../backlog/initiative-storyboards-v1.md).
8. **Metro-level location only.**

## What defers out of v1

- **Hoods and the wider location hierarchy rework.** Metros only. This defers the hood half of F049 and all of F050 / F051 / F052 / F053 — consistent with the bundle recommendation already in [`../backlog/plan-location-model-sequence.md`](../backlog/plan-location-model-sequence.md).
- **The four unbuildable kinds** — `ask`, `offer`, `wonder`, `initiative` — and their composers. Schema stays reserved; no composer, no detail page, and browse surfaces do not link them.
- **The You producer rebuild** beyond *create and manage your own things*.
- **Social media content import.**
- **The TikTok-style category top slider.**
- **Preview deployment infrastructure.** Screenshots stand in — see [`../backlog/decision-preview-deployments.md`](../backlog/decision-preview-deployments.md).

Everything previously deferred to b2/b3 stays deferred: posting surfaces inside Groups, stewardship rotation, pooled capital, follow streams and notifications (stored, not surfaced), reviews and star ratings (permanently deferred), payments rails, verification tiers above Tier 0, and the intelligence layer.

---

## Schedule risk — the 5 Deadly Sins against end of September

Roughly nineteen working days remain, solo, with mandatory `weigh` / `review` / accessibility / code-review gates on anything new. **The in-list does not fit the month as written.** Recording that here rather than discovering it on the 30th.

| Sin | Where it bites |
|---|---|
| **Scope creep** | The vendor sweep touches `/you`, and the You rebuild is explicitly out — the sweep will want to keep going. "Populated content" has no boundary between a seed set and recruiting real producers. Onboarding has no ratified storyboard, so its edges are wherever someone stops. |
| **Gold plating** | The Home/Explore merge invites redesigning the feed while the surface is already open. The card fix invites re-opening the design language a second time. |
| **Missing requirements** | Four of the eight are not past decision stage. The 404 fix has two undecided questions. "Populated content" has no acceptance number. The consumer-response mechanic is unconfirmed. Onboarding's storyboards are at journey-list stage. |
| **Unrealistic schedule** | Eight workstreams, four unscoped, one month, one person. This is the binding sin. |
| **Poor communication** | Low — solo. The one live ambiguity is the unconfirmed support/oppose call, which blocks workstream 5. |

**At risk, in order:** the Home/Explore merge (largest single engineering item, nothing built, reverses three shipped tickets); onboarding and copy (highest value, least defined); populated content (content acquisition wearing an engineering label); group events (needs a create path outside the Sell walkthrough, which is a route problem nobody has scoped).

**Cut order if the month slips** — first cut at the top:

1. **The consumer support mechanic.** Unconfirmed anyway, and a support signal pays off at density v1 will not have. Ship the declaration; add the response later.
2. **Recruiting real producers** — replace with a fixed, defined seed set. Keeps the visual goal, drops an unbounded content project.
3. **The Home/Explore merge.** Keep three tabs for v1 and ship the card fix and content on the surfaces that exist. Nothing else in the list depends on the merge landing.
4. **Group events.** Events stay Member-filed. Note this partly undercuts workstream 1's rationale, which is why it is last, not first.

**Protect at all cost:** the 404 fix (broken links make every other item pointless), onboarding and copy (the PM's own stated priority, and the journey list found that nothing in the app explains what the product is), and metro-only location.

**Honest read: four to five of the eight land by end of September.** Picking which four now is cheaper than finding out on the 30th.

---

## Non-negotiable data-model commitments

Unchanged from the primitives scope and still binding on every ticket:

- **AI-native floor:** pgvector enabled, parallel embedding tables created, `embedding_id` columns reserved.
- **Action layer is the only write surface** — direct controller writes rejected at code review.
- **Same-transaction row+event invariant** — every event row writes in the same transaction as its row; every event carries `acting_member_id` + `via_delegation_id`.
- **Soft delete on every entity** — hard deletes never ship at any tier.
- **System Member seeded** for backfilled / platform-emitted events.
- **No Business entity.** Personal businesses are kind='business' Groups.
- **Groups are emergent, optional, never auto-assigned.**

## Success metrics

Behavioral, not financial: Item-creation rate across kinds; response rate (RSVP / follow / save / "I'd be in"); return-visit rate; cross-kind engagement. Commerce volume is **not** the v1 metric.
