---
purpose: Review — F057, the You producer state. Split from the combined F055–F058 review on lane move. Verdict PROCEED; two binding notes carry to build.
layer: how
status: next
---

# Review — F057: someone who isn't selling yet finds the way in

**Scenario:** [`scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md`](scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md)
**Ticket:** `development/tickets/T125-you-gains-a-producer-state.md`
**Reviewer:** `review` (2026-09-04) · **split to its own lane 2026-09-07**
**Bundle:** launch ([`../now/initiative-launch.md`](../now/initiative-launch.md))
**Verdict:** **PROCEED.**

> **Why this file exists.** The original review was one document covering F055–F058. F057 advanced to `next/` on 2026-09-07 while its three siblings stayed in `backlog/` behind Gate B, and the naming convention puts a review in the same lane as its scenario. This is the F057 portion, extracted verbatim in substance. **The parent review remains authoritative for F055, F056 and F058** and for the shared reasoning — storage substrate, the upload pipeline, the EXIF argument, the reports lineage: [`../next/review-F055-F058-self-serve-producer.md`](../next/review-F055-F058-self-serve-producer.md).

## Verdict

**PROCEED, unblocked.** F057 was the only scenario in the set carrying no Gate B dependency: it adds no table, no column, no event type, no action handler, and touches no storage. The producer/pre-producer condition is a query the sell index already runs. Its risk profile dropped further on 2026-09-04 when the prior-art pass found the retired page had already computed the right condition and rendered it in the wrong place — which turned a rebuild into a modification.

## Binding notes carried to build

1. **Read the prior art before writing the ticket, and do not delete it first.** `RecruitmentGrid.tsx` is reference material — the card design survives, the Sacramento-and-selling category array does not. The retirement's delete phases stay gated on the shop-editor ticket, not on a date. *(Parent review, note 6.)*
2. **Carry mechanisms, not judgments.** Recruitment-as-empty-state, the completeness nudge, the one-liner — all mechanisms, all fine to carry. The ownership tier, the extractiveness flag, the home address on a public map — all judgments the platform made about a person, none of them come across. **When unsure whether a piece of the old surface should come, that is the test.** *(Parent review, note 7.)*

## Added on the lane move — 2026-09-07

3. **The table dispositions are approved and are now acceptance criteria, not analysis.** Six removals, one repurpose, nothing created. The scenario's § Table disposition is binding: if the build finds it needs a table the disposition says to remove, that is an escalation to the PM, not a judgement call in a ticket.
4. **This scenario must not absorb the producer entry point.** It renders a create path; it does not decide where that path goes. The entry-point fork is companion work, and the two must stay separable so that either can ship first.

## Accessibility (M3)

Run at build, per ticket. Nothing storage- or upload-shaped applies here — the M3 surface is the pre-producer/producer state change on a primary nav destination: focus is not trapped or lost when the page switches state, the recruitment cards are reachable and named in reading order, and the "Start something" control has a real accessible name rather than an icon alone.

## Sibling check

- **The shop editor scenario** depends on this one for the shop row it hangs off. Order is fixed: this first.
- **The vendor sweep** — this scenario rewrites `/you` and adds the `/following` redirect. It explicitly does **not** delete the 51 orphaned files.
- **F044, F045, F046** — untouched. Different surface.
