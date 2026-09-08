---
id: how-bundle-1
purpose: Scoping definition for SocialUs v1 — positioning, what ships, what defers, the deadline, and the schedule risk against it. Per-feature progress lives in the scoreboard.
layer: how
status: active
---

# Bundle 1 — SocialUs v1

> **SCOPE AND DATE SUPERSEDED 2026-09-07 by [`initiative-launch.md`](initiative-launch.md).** The launch plan repositions v1 from a marketplace to a local discovery app, moves the deadline to **2026-10-30**, and cuts the ten workstreams below to three launch requirements. Where this file and the launch plan disagree about *what ships* or *when*, the launch plan wins. What survives here: the positioning rationale, the deferral list, the data-model commitments, and the success metrics.

> **Supersedes the earlier "Primitives MVP" scope on this file (ratified 2026-09-04).** The primitives substrate and the producer/gatherer/newcomer surfaces built against that scope are shipped and stay shipped — they are the floor v1 stands on, recorded in [`bundle-1-checklist.md`](bundle-1-checklist.md). What changed is the *remaining* scope: v1 is now a named, dated finishing list, not the full fourteen-surface set. Where [`mvp-goal.md`](../archive/now/mvp-goal.md) and this file disagree, this file wins.
>
> Sub-theme sequencer: [`bundle-1-themes.md`](../archive/now/bundle-1-themes.md). Build order: [`plan-b1-surface-sequence.md`](../archive/now/plan-b1-surface-sequence.md).

**Name:** SocialUs. Unchanged — see [`../../PROJECT.md`](../../PROJECT.md).

~~**Deadline: end of September 2026.** Ratified 2026-09-04.~~ **Moved to 2026-10-30** (PM, 2026-09-07) — see [`initiative-launch.md`](initiative-launch.md). The § Schedule risk analysis below is retained because its findings still hold; its arithmetic is against the old date.

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

Full mechanic: [`../backlog/decision-producer-values-declaration.md`](../archive/backlog/decision-producer-values-declaration.md). **The "never sourced, never inferred" constraint requires `weigh` to land as a State-tagged commitment in [`../../product/foundation/policy.md`](../../product/foundation/policy.md) before any ticket encodes the field** (rebuild rule 11, Gate B).

### Consumer response — deferred; a general report path ships instead

**Support and oppose are both deferred, not rejected** (2026-09-04). A voting mechanic only carries information once there are enough buyers and producers for the signal to mean something, and bad actors do not arrive before there is an audience worth targeting. Building voting mechanics for a platform with sixteen items is premature on both counts. The name itself also does much of the filtering work at this stage.

**What v1 gets instead is a general report path** — small, quiet, not specific to politics: a way for any member to tell the operator that something needs looking at, in any context. It is workstream 9 below. It earns its place now, where the voting mechanic does not, because there is currently **no channel at all** for a member to tell the operator anything — a gap that exists from the first user, not the thousandth — and because it is the front door to the claim/verification path that [`../backlog/decision-business-identity-impersonation.md`](../backlog/decision-business-identity-impersonation.md) flagged as needed and unscoped when it established that local name scoping stops squatting but not impersonation. One small feature covers bad actors, impersonation, and general feedback.

---

## What ships in v1

**Ten workstreams** (nine as of 2026-09-04 morning; workstream 10 added the same day with the self-serve producer scope change). Everything already merged stays; this is the remaining list.

1. **Item detail links resolve.** Fix the 404s, **including Group-filed Items.** Events are in v1 and Group-filed rows are part of the broken set, so the Group place-path case is in scope, not deferred with the four unbuildable kinds. Decision open: [`../done/2026-09-04-item-canonical-urls/decision-item-canonical-urls.md`](../done/2026-09-04-item-canonical-urls/decision-item-canonical-urls.md).
2. **Vendor/market retirement finished.** `/register-vendor`, `/vendors/[slug]`, `/you/vendor/*` and the shared-file prunes. Scope + removal order: [`../backlog/audit-vendor-market-retirement.md`](../backlog/audit-vendor-market-retirement.md). **Boundary: the sweep only.** The You producer rebuild it was bundled with is out (see below).
3. **Card fix and populated content.** The Item card renders correctly and carries real products and real producers — not placeholder rows.
4. **Home/Explore merge.** Explore is absorbed into Home; direction already ratified in [`../backlog/decision-surfaces.md`](../backlog/decision-surfaces.md).
5. **Producer minimal profile**, including the values declaration.
6. **Group events.** A gathering can be created and filed under a Group.
7. **Onboarding, empty states, and copy** — including a *"we're looking for help, reach out to join"* line. Journey list and gaps: [`../backlog/initiative-storyboards-v1.md`](../backlog/initiative-storyboards-v1.md).
8. **Metro-level location only.**
9. **A general report path.** A discreet report affordance on Items and producer profiles; no public counter and no visible state; routes to the operator; free text with a light reason rather than a fixed taxonomy — at this stage the operator learns more from what people write than from categories guessed in advance. **Ship condition, not a nicety: a report channel nobody answers is worse than none**, because it teaches members that telling the operator anything is pointless. A real destination and a rough response commitment must exist before it ships. That is an operating commitment from the PM, not an engineering task.

10. **Photo upload, and the self-serve producer journey it completes.** *(Added 2026-09-04 — supersedes this section's nine-item list.)* A member signs themselves up, creates a business, uploads images, and describes what they sell, without anyone doing it for them. Decision, ratify-checklist run, cost and privacy shape: [`../backlog/decision-photo-upload.md`](../backlog/decision-photo-upload.md). Scenarios F055–F058; review [`../next/review-F055-F058-self-serve-producer.md`](../next/review-F055-F058-self-serve-producer.md); tickets T120–T126.

    **Three consequences that change the rest of this file, not just add to it.**
    - **Workstream 9 stops being optional and becomes a precondition.** Photo upload's moderation answer is *"the operator handles it via the report path."* That answer is only true if the path exists — and today there is no report path, no `item.update`, no `item.delete`, and no storage delete. **The report path can no longer be the item that slips**, and its unnamed destination now blocks two workstreams.
    - **Workstream 4 splits.** The You rebuild is load-bearing for the journey (the only door to business creation sits on `/you`, surrounded by the previous product); the Explore→Home fold is not. See § Schedule risk.
    - **Two absolutes need `weigh` before any of it is buildable** — EXIF/GPS stripping and takedown-before-upload. Gate B blocks every upload ticket. Tickets T120–T126 are written and carry the gate unticked.

## What defers out of v1

- **Hoods and the wider location hierarchy rework.** Metros only. This defers the hood half of F049 and all of F050 / F051 / F052 / F053 — consistent with the bundle recommendation already in [`../backlog/plan-location-model-sequence.md`](../archive/backlog/plan-location-model-sequence.md).
- **The four unbuildable kinds** — `ask`, `offer`, `wonder`, `initiative` — and their composers. Schema stays reserved; no composer, no detail page, and browse surfaces do not link them.
- **The You producer rebuild** beyond *create and manage your own things*.
- **Social media content import.**
- **The TikTok-style category top slider.**
- **Preview deployment infrastructure.** Screenshots stand in — see [`../backlog/decision-preview-deployments.md`](../archive/backlog/decision-preview-deployments.md).
- **Support and oppose controls.** Deferred, not rejected — see § Positioning. The support-public / opposition-private shape stands as what to return to when density makes the signal meaningful.

Everything previously deferred to b2/b3 stays deferred: posting surfaces inside Groups, stewardship rotation, pooled capital, follow streams and notifications (stored, not surfaced), reviews and star ratings (permanently deferred), payments rails, verification tiers above Tier 0, and the intelligence layer.

---

## Schedule risk — the 5 Deadly Sins against end of September

Roughly nineteen working days remain, solo, with mandatory `weigh` / `review` / accessibility / code-review gates on anything new. **The in-list does not fit the month as written.** Recording that here rather than discovering it on the 30th.

| Sin | Where it bites |
|---|---|
| **Scope creep** | The vendor sweep touches `/you`, and the You rebuild is explicitly out — the sweep will want to keep going. "Populated content" has no boundary between a seed set and recruiting real producers. Onboarding has no ratified storyboard, so its edges are wherever someone stops. |
| **Gold plating** | The Home/Explore merge invites redesigning the feed while the surface is already open. The card fix invites re-opening the design language a second time. |
| **Missing requirements** | Four of the nine are not past decision stage. The 404 fix has two undecided questions. "Populated content" has no acceptance number. Onboarding's storyboards are at journey-list stage. The report path's destination and response commitment are unnamed — and that is a ship condition, not a detail. |
| **Unrealistic schedule** | **Ten** workstreams, one month, one person — and the newest is the second-largest on the list. This is the binding sin. Deferring support/oppose removed a workstream, the report path put one back, and photo upload added a tenth that is nine to twelve days of work with three `weigh`-gated absolutes in front of it. Deferring 51 file deletions buys one to two days against that. |
| **Poor communication** | Low — solo. No live ambiguity now that support/oppose is settled; the one outstanding item is an operating decision (the report destination), not a communication gap. |

**At risk, in order:** the Home/Explore merge (largest single engineering item, nothing built, reverses three shipped tickets); onboarding and copy (highest value, least defined); populated content (content acquisition wearing an engineering label); group events (needs a create path outside the Sell walkthrough, which is a route problem nobody has scoped).

**The report path is small but not free.** A link, a form, and a destination is genuinely a day or two of engineering — but it needs a scenario, a `review` pass, an accessibility pass on a new form, and the operating commitment settled before it ships. Call it three to four days end to end against the gates, and none of it can start until the destination and the response commitment exist. It is the cheapest item on the list and the only one whose blocker is not engineering.

**Cut order if the month slips** — **revised 2026-09-04 for the enlarged list.** First cut at the top:

1. **Recruiting real producers** — replace with a fixed, defined seed set. Unchanged, and now more urgent: the point of adding upload is that the feed stops looking empty, and a seed set with real photos demonstrates that where a recruitment project does not fit in September.
2. **The Explore→Home fold — half of workstream 4, not all of it.** *This replaces the previous "cut the merge" entry and is the substantive change to this list.* The merge is two things: **(a)** fold Explore's search / pills / map toggle into Home and retire the tab, and **(b)** rebuild `/you` as the production side. **(b) is now load-bearing for the ratified journey; (a) is not.** Keep (b), defer (a). Three tabs stay for v1. **And (b) turned out to be a modification, not a rebuild** — `/you` already computed the producer condition and rendered recruitment in the wrong place, so this is one to one and a half days, not three to four ([`../backlog/audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) § 2.4). This drops the largest single engineering item, drops the one that reverses three tickets merged inside 48 hours (T114, T115, T116), and **un-strands F044 and F045**, which are coherent under three tabs and stranded under two.
3. **Group events — not a cut any more; probably free.** *Revised the same day.* Its blocker was a create path for a gathering outside the Sell walkthrough. The You change's pre-producer invitation covers gatherings by acceptance criterion, so **the route falls out of that ticket rather than needing its own.** Do not cut it and do not staff it separately — verify after the You change ships and close it if it works.
4. **The values declaration's *shape* work** — not the field, not the display. One text column, one textarea, one paragraph on the shop page. No tags, no fixed set, no vocabulary design. In that form it is a day. What actually gates it is `weigh` on the never-sourced absolute — **run that in week one, not week four.**

**The vendor/market retirement deletions move behind the producer journey** *(PM recommendation 2026-09-04, tested and endorsed, then re-timed the same day)*. Not merely "after launch" — **after the producer journey is built**, because the retired code is the reference material for three of its tickets ([`../backlog/audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) § 6). Phases 3–5 — 51 files, the shared-file prunes, the SQL files — are hygiene with no user-perceivable behaviour, and safe to defer now that the dead subtree hangs off `/you` alone. **Two qualifications.** (1) `/following` is a live, routable, vendor-era duplicate of the shipped `/you/following`; it is handled now as a one-line redirect, not as a phase. (2) **Phase 2 is not a delete phase** — it is the You rebuild, it is workstream 4(b), and it cannot be deferred without breaking the journey just ratified. The cut buys one to two days against nine to twelve days of new work: **correct, and not close to sufficient on its own.**

**Protect at all cost:** the 404 fix (done, T119), onboarding and copy, metro-only location, and **the report path** — which has gone from the cheapest item on the list to a precondition for the largest new one.

**Honest read, revised twice on 2026-09-04: six of ten, with group events likely a seventh for free.** The first read said five or six; re-reading the retired vendor surface and rescoping the You change from a rebuild to a modification returned about two days. Still conditional on the same two cheap things happening **in the first week rather than the last**: `weigh` on the three absolutes, and the PM naming the report destination. Both are an hour of decision each and both block days of work. Nothing else on this list is gated that cheaply.

**One open call the re-read surfaced:** no composer collects a category, so every producer-created Item is uncategorized forever, while Explore ships a category filter over that dimension and F045 adds a multi-select to it. Carrying the retired eight-slug taxonomy is about half a day ([`../backlog/audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) § 4). **Carry it, or drop F045's category facet — but do not ship a filter over an empty dimension.**

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
