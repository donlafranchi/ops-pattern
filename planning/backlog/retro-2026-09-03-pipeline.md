---
purpose: Retrospective on the 2026-09-03 session — why the harness did not catch what it should have, and the specific file amendments that would have caught most of it.
layer: how
status: backlog
---

# Retrospective — 2026-09-03

Scope: the nav/Explore ticket run (T112–T117) and the location-model decision session. Docs only. Every claim below was checked against the repo; two of the framings handed to me turned out to be partly wrong and are corrected in place.

---

## 1. What actually happened

Verified timeline, parent + web repos, same day:

| Time | Event |
|---|---|
| 09-02 17:47 | `decision-surfaces.md` affirms Explore as a live tab |
| 09-03 09:16 | T115 merged — filter sheet with a **distance** filter, on **Explore** |
| 09-03 10:17 | Explore **ratified for retirement** as a tab |
| 09-03 13:26 | T116 merged — inline list/map toggle, **on Explore**, 3h09m after its retirement |
| 09-03 15:20 | T115/T116 closed |
| 09-03 15:33 | **Distance removed from the product** |

Two corrections to the brief. The stale-Home claim was **already fixed** this morning (`53e1b6c`), along with the untracked stubs (`62a8e29`) and the 52px nav line (`e4c3ad1`) — and that same commit landed a close-out reconciliation step in `skills/build/workflow.md` §18 and the ticket template. Don't re-fix those. And T115's distance filter could not have been caught by any process: nothing about distance was in question when it was built. That one is the price of deciding fast, not a gate failure.

The 17-commit backlog is real: 20 commits sat between the 09-01 push and today's.

---

## 2. The common cause

Your hypothesis holds, and it is one of three.

**(a) Every gate compares a document to the document above it. Nothing compares anything to reality.** `test` checks code against the scenario's Then-clauses. M2 checks the diff against the ticket. `simplify-review` checks the diff against itself. `close` checks that a branch merged. Not one gate asks *is the ticket still right* or *is the result any good*. This is why thirteen deviations across T115/T117 covered hex validation and pin colour and not one covered what the screen looks like — the deviation form asks "where did you depart from the ticket," and the ticket didn't describe appearance.

Note the inverse, because it's the fix: **every single thing that worked today worked by touching ground truth.** The false Home claim was caught by reading the code. The live `MarketProvider` bug was caught by reading the layout. T117's M2 catches came from reading the diff. The F048–F053 review is good because it checked decisions against what the schema can actually express. Documents checked against documents failed; documents checked against reality held.

**(b) "Mandatory" is asserted in CLAUDE.md and contradicted in the skills that would fire it.** `CLAUDE.md` rebuild rule 1 says `review` is mandatory. `skills/review/workflow.md` opens with *"Optional but recommended."* `skills/scope/workflow.md` step 11 advances a scenario to `next/` with no review check. `skills/ticket/workflow.md` reads a review *"if it exists."* Three of the four places that could stop an unreviewed scenario declare the gate optional. F044 and F045 didn't slip through a gate; there was no gate in the code path.

Same shape on M3. `AGENTS.md` puts M3 **inside `review`** — which was skipped — and the ticket template repeats it as a build-time self-declaration. So T117 was the *second* miss, not the first, and its N/A was literally true and substantively wrong: it reused an existing card on a different surface with different data, which is exactly the composition a design review exists to look at. A gate whose trigger is judged by the party it constrains is not a gate.

**(c) Nothing in the pipeline puts work in front of you.** The terminal state of a ticket is "merged locally, ledger stamped." `git push` appears exactly once in the whole harness — in `skills/build/workflow.md` under **Does NOT run**. No skill deploys, screenshots, or pings you. That's why five days of UI work all landed wrong at once: the feedback interval was 17 commits long. This one is upstream of the other two — with a preview link at the end of every ticket, a missing design review gets caught by your eye in five minutes instead of by an audit in five days.

---

## 3. Amendments

Five changes. The first three would have caught most of today.

### A. Push it where you can see it — `skills/build/workflow.md` (load-bearing)

Replace, in the cheat sheet:

> | **Does NOT run** | `git push`, `git rebase`, anything that rewrites history. …

with:

> | **Does NOT run** | `git rebase`, anything that rewrites history. `git add` + `git commit` fire after PM `y` at ticket close; `git push origin main` fires after PM `y` at step 22. |

And add after step 21 (merge):

> 22. **Ask PM permission to push.** Output verbatim: `Ready to push main to origin? (y/n)`. On **y**, run `git push origin main`. Then output the deployed URL and one line naming what the PM should look at — the surface, not the ticket. A ticket is not closed until the work is reachable by someone who did not build it.

### B. Check the premise before building — `skills/build/workflow.md` step 2 (load-bearing)

Extend the existing scenario lane check with a second clause:

> **Premise check.** Read the surface spec the ticket cites (`product/ui/*.md`, `planning/backlog/decision-*.md`) and check its git log for changes since the ticket was written. If the surface has been retired, merged, superseded, or has an open ratified decision that contradicts the ticket, **stop and surface it** — do not build. Cheap version: `git log --since=<ticket date> -- <spec path>`.

This catches T116 (3h window). It does not catch T115. Say so plainly rather than pretending the rule is stronger than it is.

### C. Make `review` actually mandatory — `skills/review/workflow.md` + `skills/ticket/workflow.md` (load-bearing)

In `review/workflow.md`, replace:

> Optional but recommended for scenarios that introduce any of the following:

with:

> **Mandatory during the rebuild phase** (CLAUDE.md rule 1) for any scenario that introduces or changes a surface a Member sees. Skip only for copy/CTA edits on an existing surface. The trigger list below is what makes it mandatory, not what makes it advisable:

In `ticket/workflow.md`, change the input line from *"`review-F{NNN}.md` … if it exists"* to **required**, and add step 3b:

> **Gate C — review present.** If no `review-F{NNN}.md` exists in the scenario's lane, stop. Do not draft tickets. Route to `review`. A scenario that reached `ticketed` with no review is a rebuild-rule violation; record it in the F-number's stage-ledger file.

### D. Fix the M3 trigger — `skills/ticket/templates/ticket.md` + `AGENTS.md` gate table (load-bearing)

Replace:

> - [ ] **M3 — `design:accessibility-review`** if this ticket introduces a new page or component.

with:

> - [ ] **M3 — `design:accessibility-review` + `design:design-critique`** if this ticket changes what a Member sees: a new page or component, an existing component rendered on a **new surface**, a **new data shape** in an existing component, or the removal or relocation of a control. **"No new component" is not a valid N/A** — the test is whether a Member could notice the difference. If yes, the gate fires.

Mirror the wording in the `AGENTS.md` M1–M4 table, M3 row ("Every new page or component" → "Every change a Member could notice").

### E. Acceptance criteria must name appearance — `skills/ticket/templates/ticket.md` (nice-to-have)

T088 specified `ItemFeedCard` as *"shows title, kind badge, brand/owner, nearest-location label."* That is a data contract. It is the whole reason the card is text-only with no image and no hierarchy, and why no critique of it exists anywhere in the pipeline. Add to the AC section:

> - [ ] {For any ticket that renders a surface: which `design-language.md` recipe governs its appearance. If none fits, that is an `explore` gap — escalate rather than inventing one at build time.}

Separately, file one backlog item: a design critique of `ItemFeedCard`, plus a DLS recipe for it. The generic **Card** recipe doesn't cover a feed card, and three surfaces now share this component.

### F. Two drift-check rows — `skills/orient/workflow.md` step 7 (nice-to-have)

| Check | Source |
|---|---|
| `git log origin/main..main` non-empty in `web/` — shipped work the PM cannot see | 2026-09-03 retro |
| Any open ticket whose cited surface spec changed after the ticket's date — premise drift | 2026-09-03 retro |

---

## 4. What worked, and why

Four things held today, and they share one property: **someone compared a document to ground truth instead of to another document.**

- **The ticket-writer refusing the phantom work item.** The false line said Home queried dead tables; checking the code showed Home renders `LocalityFeed`. The refusal came from the ticket skill's requirement that every *Serves* line resolve to something real — an unfillable lineage field stops the work. Keep that. It's the cheapest gate in the harness.
- **The vendor/market audit.** Found `MarketProvider` firing a dead query on every page load app-wide, and the `?place=` distance-origin defect where Explore measured from the launch default while the feed resolved the Member's actual place — a bug with no visible symptom. Both found by reading code, not docs.
- **The F048–F053 review.** Written into `backlog/` against its own lane rule, with the deviation declared in the first paragraph rather than hidden, because the PM's instruction was not to make it three unreviewed scenarios. That is exactly the right handling of a rule that gets in the way: break it, name it, say when it re-enters convention.
- **Build's escalate-don't-improvise discipline.** T117 refused to invent an item taxonomy and filed a Type B stub instead. M2 caught three real defects pre-commit — hex validation accepting `'0z'` as zero, an unguarded fetch that could strand the tab on "Loading…" forever, a hardcoded accent colour.

The fixes above should not touch any of this. Note that none of them are checklists — they're all "go look at the actual thing." That is the pattern to add more of, not more boxes.

---

## 5. On speed

**Load-bearing: A, B, C, D.** Four edits across four files. Together they add roughly one prompt per ticket (the push) and one gate per scenario (the review). That is not a week.

**Nice-to-have: E, F.** Do them when convenient.

**Some of today's informality was correct, and I'd defend it.** The location model — hoods, geocode-once, metro vantage, distance removal — moved from conversation to ratified decision in six hours, and the record is better for it: every entry in `decision-surfaces.md` carries a State-tagged Intent, supersessions are marked in place rather than left to collide, and a review followed the same day. That *is* the harness — `weigh` and `review` both ran. Skipping the scenario stage during exploration was right; scenarios F048–F053 were written afterwards, once the shape was known, which is cheaper than writing six scenarios against a model that changed four times before lunch.

The failure wasn't that decisions moved fast. It was that the build lane never sampled them. Fix B is the whole answer to that, and it costs one `git log` call.

One thing to hold, though: the distance filter shipped at 09:16 and distance left the product at 15:33. No process catches that. The real defense is not building presentation-layer polish on a surface whose model is under active discussion — which argues for finishing the Home/Explore merge decision *before* the next UI ticket run, not for adding a gate.
