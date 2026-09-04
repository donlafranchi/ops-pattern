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

## 3. Amendments, ranked by how much of today they prevent

> **Status as of 2026-09-04 — 1, 2, 3 LANDED. 4 and 5 CUT.**
> Amendment 1 → `skills/build/workflow.md` step 22 (+ cheat-sheet row reversed), two `orient` drift rows, and the parent push added to the `clearlock` line in `CLAUDE.md` and `AGENTS.md`. Amendment 2 → `skills/weigh/workflow.md` sub-routine 4, pointing at checklist 1. Amendment 3 → `skills/ticket/workflow.md` step 3b (Gate C) + `skills/review/workflow.md` "Optional but recommended" replaced with mandatory, plus matching handoff notes in `scope` and `ticket`.
> **Gate C amended 2026-09-04** after its first outing: as originally written it was runnable only on scenario-driven tickets. T118 came from a ratified PM decision, had no F-number and no possible review file, and was not substrate either (it changed a Member-visible card) — so the gate was unrunnable and T118 recorded that rather than waiving it. Gate C now has three branches keyed to the ticket's `Scenario:` field, and `skills/ticket/workflow.md` gained a **Decision lane** as the surface-bearing sibling of the substrate lane.
> Amendments 4 and 5 were cut on PM instruction — few gates over comprehensive ones — and the reasoning plus the observations that would justify revisiting them are recorded in [`playbooks/process-checklists.md`](../../playbooks/process-checklists.md) § Considered and cut. Do not re-derive them as an oversight.
> The false "local-only" line this retro names in §3.1 is corrected in `CLAUDE.md` § Project Facts, and the same claim was traced and fixed in `playbooks/DEVELOPMENT-PATTERNS.md`, the global `~/.claude/CLAUDE.md`, and two scaffold templates.


Checklists live in [`playbooks/process-checklists.md`](../../playbooks/process-checklists.md) — four of them, one per kind of work, each with a trigger you run rather than judge. The amendments below are what makes them fire.

### 1. Push after every merge — `skills/build/workflow.md`

Prevents: the entire feedback failure, and transitively the missing design review, the undesigned card, and the appearance-blind deviations — all of which you would have caught by eye in five minutes with a live URL.

This is an amendment to a stated boundary. The cheat-sheet line currently reads:

> | **Does NOT run** | `git push`, `git rebase`, anything that rewrites history. …

Replace with:

> | **Does NOT run** | `git rebase`, anything that rewrites history. `git add` + `git commit` fire after PM `y` at ticket close; `git push origin main` fires after PM `y` at step 22. |

Add after step 21 (merge):

> 22. **Ask PM permission to push.** Output verbatim: `Ready to push main to origin? (y/n)`. On **y**, run `git push origin main`, then output one line naming the **surface** to look at — not the ticket number.

**What it costs.** `web/.vercel/project.json` links this repo to Vercel, so **pushing `main` deploys to production.** That is the real price and it should be a decision, not a side effect. There are no users yet, so today it is nearly free; it stops being free the moment there are.

**Two gaps the ticket-close push does not cover, both real:**

- **Non-ticket commits.** Six of today's web commits — the QR removal, the `MarketProvider` unhook, the CTA gate — had no ticket, so no ticket close would have pushed them. Add one row to `skills/orient/workflow.md` step 7: *`git log origin/main..main` non-empty in `web/` — shipped work the PM cannot see*. This row earns its place precisely because the push step doesn't cover everything.
- **The parent repo is 32 commits ahead of `origin`.** Every location-model decision made today, and this retrospective, exist only on this Mac. `CLAUDE.md` line 18 calls the parent *"local-only,"* which is false — it has a remote (`ops-pattern`) last pushed 2026-09-02. That stale line is plausibly why nobody pushes it. Correct it, and add the parent push to the `clearlock` line every Cowork skill already hands you.

**Previews are a separate decision, filed as one:** [`planning/backlog/decision-preview-deployments.md`](decision-preview-deployments.md). Short version — `web/.env.vercel.local` already says *"Scope: Preview + Development"* but its values point at the production Supabase project, so previews today would either fail or write against production. That needs a second database, not a config tweak. Recommendation is defer; screenshots stand in.

### 2. The ratify checklist — `skills/weigh/workflow.md`, pointing at checklist 1

Prevents: T116 built on a retired surface, and the distance filter shipping hours before distance left the product. This is the checklist that did not exist, and the two items that matter are new:

> - [ ] **List in-flight tickets on the affected surface.** `grep -l "<surface>" development/tickets/*.md`. Every hit is stale as of this ratification — give each a disposition **in this session**.
> - [ ] **List approved scenarios on the affected surface.** Same grep across `planning/next/` and `planning/now/`.

Nothing today asked what a decision invalidated. Explore's retirement at 10:17 had T116 open against it and said nothing; distance removal at 15:33 had T115's filter merged six hours earlier and said nothing.

### 3. Gate C — review present, `skills/ticket/workflow.md`

Prevents: F044 and F045 reaching `ticketed` with no review, and with it the design review that never ran on either.

Add as step 3b:

> **Gate C — review present.** `ls planning/{next,now}/review-F{NNN}.md`. No file → stop, do not draft tickets, route to `review`.

And fix the contradiction that made it skippable: `skills/review/workflow.md` opens with *"Optional but recommended"* while `CLAUDE.md` rule 1 calls review mandatory. Replace with:

> **Mandatory during the rebuild phase** (CLAUDE.md rule 1) for any scenario that introduces or changes a surface a Member sees. Skip only for copy/CTA edits on an existing surface.

---

**If only three land, those are the three.** The two below are worth doing and I would drop them first.

### 4. Make the M3 trigger mechanical — ticket template + `AGENTS.md`

Replace *"if this ticket introduces a new page or component"* with the grep in checklist 4, plus: *an existing component on a route that did not previously render it, or an existing component receiving a new data shape.* **"No new component" is not a valid N/A.**

Droppable because M3 lives inside `review` per `AGENTS.md`, so Gate C already restores it. This is a second lock on the same door — worth having, not worth trading for either of the first three.

### 5. Premise check in `build` step 2

`git log --since="<ticket Date>" -- <cited spec paths>`. Non-empty → confirm the ticket still stands before writing code.

Droppable because the ratify checklist catches the same failure upstream and cheaper. Keep it only as defence in depth for decisions made in Cowork that never ran checklist 1. It catches T116's three-hour window; it does not catch T115, and no rule does.

### Cut entirely

The appearance clause in acceptance criteria and the second drift-check row both folded into the checklists rather than standing as separate amendments. A scenario-writing checklist and an audit checklist are **not written at all** — `scope` and the audits both worked today, and adding process to the parts that work is how you get a harness nobody runs.

## 4. What worked, and why

Four things held today, and they share one property: **someone compared a document to ground truth instead of to another document.**

- **The ticket-writer refusing the phantom work item.** The false line said Home queried dead tables; checking the code showed Home renders `LocalityFeed`. The refusal came from the ticket skill's requirement that every *Serves* line resolve to something real — an unfillable lineage field stops the work. Keep that. It's the cheapest gate in the harness.
- **The vendor/market audit.** Found `MarketProvider` firing a dead query on every page load app-wide, and the `?place=` distance-origin defect where Explore measured from the launch default while the feed resolved the Member's actual place — a bug with no visible symptom. Both found by reading code, not docs.
- **The F048–F053 review.** Written into `backlog/` against its own lane rule, with the deviation declared in the first paragraph rather than hidden, because the PM's instruction was not to make it three unreviewed scenarios. That is exactly the right handling of a rule that gets in the way: break it, name it, say when it re-enters convention.
- **Build's escalate-don't-improvise discipline.** T117 refused to invent an item taxonomy and filed a Type B stub instead. M2 caught three real defects pre-commit — hex validation accepting `'0z'` as zero, an unguarded fetch that could strand the tab on "Loading…" forever, a hardcoded accent colour.

The fixes above should not touch any of this. Note that none of them are checklists — they're all "go look at the actual thing." That is the pattern to add more of, not more boxes.

---

## 5. On speed

**Keep 1, 2, 3. Drop 4 and 5 if anything has to go.** Together the three add one prompt per ticket (the push), one `ls` per ticket (Gate C), and two greps per decision. That is not a week — it is under a minute per unit of work, and every one of them is "run this command," not "consider whether."

The point of four checklists instead of one list is that no unit of work runs more than one of them. Ratifying a decision runs six items. Building a ticket runs five. Nobody ever reads the twenty they don't need, which is why the twenty get skipped today.

**Nice-to-have: E, F.** Do them when convenient.

**Some of today's informality was correct, and I'd defend it.** The location model — hoods, geocode-once, metro vantage, distance removal — moved from conversation to ratified decision in six hours, and the record is better for it: every entry in `decision-surfaces.md` carries a State-tagged Intent, supersessions are marked in place rather than left to collide, and a review followed the same day. That *is* the harness — `weigh` and `review` both ran. Skipping the scenario stage during exploration was right; scenarios F048–F053 were written afterwards, once the shape was known, which is cheaper than writing six scenarios against a model that changed four times before lunch.

The failure wasn't that decisions moved fast. It was that the build lane never sampled them. Fix B is the whole answer to that, and it costs one `git log` call.

One thing to hold, though: the distance filter shipped at 09:16 and distance left the product at 15:33. No process catches that. The real defense is not building presentation-layer polish on a surface whose model is under active discussion — which argues for finishing the Home/Explore merge decision *before* the next UI ticket run, not for adding a gate.
