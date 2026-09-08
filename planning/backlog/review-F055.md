---
purpose: Review — F055, photos on Items. Split from the combined F055–F058 review on the deferral lane move. Verdict PROCEED, but the scenario is deferred and its substrate has moved to F061.
layer: how
status: backlog
---

# Review — F055: a producer puts a photo on what they sell

**Scenario:** [`scenario-F055-producer-puts-a-photo-on-what-they-sell.md`](scenario-F055-producer-puts-a-photo-on-what-they-sell.md)
**Reviewer:** `review` (2026-09-04) · **split to its own lane 2026-09-07**
**Verdict:** **PROCEED** — **but the scenario is deferred and is not buildable next.**

> **Why this file exists.** The original review was one document covering F055–F058. F055 returned to the draft lane on 2026-09-07 when the PM deferred Item photos; a review travels with its scenario. **The parent review remains authoritative for F056 and for the shared reasoning** — storage substrate, the upload pipeline, the metadata argument: [`../next/review-F055-F058-self-serve-producer.md`](../next/review-F055-F058-self-serve-producer.md).

## Deferral — 2026-09-07

**PM ruling: Pages get photos now, Items get photos later.** The Page is the unit that carries a face; a product does not need one in order to be found.

**This scenario was approved and is not being unapproved.** It is deferred — the reasoning, the acceptance criteria and the binding notes all still hold. It returns to the draft lane because **lane membership is the state**, and an approved-lane scenario is one the build agent may read and start.

## What moved out of it

**The storage bucket and the upload module are no longer F055's.** They are [F061](../next/scenario-F061-someone-creates-a-page-worth-showing-people.md) § Data captured, because Pages now consume them first.

**This makes F055 cheaper, not more expensive.** When it resumes, the bucket, the policies, the upload module, the metadata strip and the picker recipe all exist. What remains is a photo field on three composers that already exist — roughly half a day.

**The bucket is renamed `media`** (F061 review, binding note 1). Any reference in this scenario or its tickets to `item-media` is stale.

## Binding notes that survive the deferral

1. **One bucket, one upload module, every caller.** Now enforced at F061 rather than here.
2. **The metadata test asserts on stored bytes**, not on intent.
3. **The storage API is the enforcement boundary**, not application code.

## Ticket state

**T120 (the substrate ticket) re-binds to F061.** It was never buildable under this scenario — it was blocked at Gate B, which has since cleared, and by the time it cleared the substrate had a different first consumer.

**T121 (the product composer photo field) stays bound here and stays deferred.**
