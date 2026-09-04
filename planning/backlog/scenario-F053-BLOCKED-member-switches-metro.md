---
id: how-f053-blocked-member-switches-metro
purpose: BLOCKED scenario stub — the place switcher becomes a metro switcher. Cannot be written until four open questions are answered.
layer: how
status: blocked
---

# F053: A member switches to another metro — **BLOCKED**

**Bundle:** b2 recommended
**Loops:** 3 (Land here)
**Canonical example:** [C2 — A member organizes awareness across multiple Places](../../product/needs/use-cases.md#c2-a-member-organizes-awareness-across-multiple-places)
**Spec contract:** `community-platform.md` § Metro is the feed's vantage point, § So the switcher is a *metro* switcher
**Status:** **blocked** — not a draft. Do not promote; do not ticket.

## Why this is not a scenario yet

The core shape is ratified and clean: the switcher selects **a metro**, hoods are ranking weights inside it, and a member with three Sacramento hoods sees one entry (Sacramento), not three. That much is writable.

What is not writable is **what the switcher does** — because switching is a state change, and four of the questions about that state have no answer. A switcher scenario that specifies the control but not its consequences produces tickets that invent the consequences.

## What has to be decided first

**Q1 — Can a member browsing another metro create there, or only read?** (`decision-surfaces.md` open question 9.)

This is the one that matters most, and it is not a detail. Posting into a metro you are deliberately visiting is either reasonable — you're moving there, you're hosting there — or it is the beginning of remote spam, and the answer decides whether the switcher is **a read affordance** or **a full context switch**. Those are different features with different blast radii. It also blocks a beat of F051 (what the composer pre-fills while a member is switched away).

**Q2 — What happens to the active metro when a member adds a hood in a new one?** (Open question 4.) Switch to it (they're probably there), stay put (they were mid-task), or ask. F050 pins only the safe half — no *silent* change — which is not a product answer.

**Q3 — What do the inner and outer rings do differently?** (Open question 7.) Ranking band, filter, or rendering only. And can a member's hoods sit in a metro's outer ring without that metro becoming their default? Until this is answered, the switcher's entry list has no defined membership rule at the edges, which is where the whole ring refinement was introduced to help.

**Q4 — Who owns metro boundary definition and maintenance?** (Open question 8.)

This one is different in kind from the other three, and I want to be precise about what it does and does not block.

- It **does not block** a b1/b2 switcher built on the existing seed. `metro_polygons` is seeded from Census CSAs with an approximated Sacramento polygon (`seed_method='approx_bbox'`), and that is enough to ship a switcher for a Sacramento launch.
- It **does block** the two refinements ratified on top of it. `metro_polygons` carries **one** polygon per row at CSA grain, and **CSAs are non-overlapping county aggregations by construction** — so inner/outer rings are not expressible, and deliberate overlap in the dense corridors is not expressible *at all* at this grain. Both need schema and seed work.
- It **is** a real gap regardless: this is now reference data the product depends on for its vantage point, its switcher entries, and its ranking bands, with no named owner and no update cadence. That is an operations question, not a build one, and it will not surface again on its own until something is wrong.

## What I can commit to now

Two criteria follow from the ratified shape with no dependency on Q1–Q4:

**Given** a member with three saved hoods, all inside the Sacramento metro
**When** they open the place switcher
**Then** it shows one entry — Sacramento — not three. _Why: `community-platform.md` § So the switcher is a metro switcher. `ScopePicker` today selects `kind='neighborhood'` places and navigates to `/?place=<slug>`; neighborhood-as-scope is exactly the model this decision replaces, so the failure mode is inheriting the shipped control's grain unchanged._

**Given** a member with hoods in Sacramento and Portland
**When** they open the switcher
**Then** both metros appear, and exactly one is active. There is no union view. _Why: `decision-surfaces.md` § Metro is the vantage point — "merging Sacramento and Portland produces a feed that is about nowhere."_

## One thing to record, not decide

`decision-surfaces.md` notes that the ambient-versus-intentional distinction — the thing that justifies a switcher — **is the same distinction that originally justified Home and Explore as separate tabs**, and that it has now resurfaced twice. The doc says a third occurrence is evidence the merge is wrong and should trigger revisiting it on its merits.

Scoping this scenario is a likely third occurrence. **If the switcher's design pushes back toward a distinct intentional-browse surface, record it against that line before designing around it.** That is the doc's own instruction and it is easy to satisfy accidentally by just building whatever resolves the tension.
