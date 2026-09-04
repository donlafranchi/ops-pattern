---
purpose: T120–T126 were ticketed against unapproved scenarios and ticked Gate C by judgment rather than by command. What's affected, what's salvageable, and the one root cause behind all three of today's gate failures.
layer: how
status: backlog
---

# Audit: the gate that gets ticked when its command can't run

**Found:** 2026-09-04, while scoping F059 (the Home/Explore merge).
**Affected:** T120–T126, and the F055–F058 scenario set they hang off.
**Do not action from this doc alone** — the disposition section names PM calls, not work items.

> **Read this before the ticket list.** The headline is not "a session skipped a gate." The reviewing function *did* run, and the review it produced is a good one. The headline is that **Gate C's command could not find that review, so seven tickets ticked the box by looking at it instead** — and that is the same failure T118 hit this morning, and the same failure F059's review hit this afternoon from the opposite direction. **Three instances, one cause, one day.**

---

## 1. What actually happened

Sequence, from the ledger rows and the ticket headers:

1. `scope` wrote F055–F058 in one pass from a ratified decision doc (`decision-photo-upload.md`).
2. **Gate A fired correctly and the session obeyed it.** All four ledger rows say, in as many words: *"Left in `backlog/`, not advanced to `next/` — Gate A cannot clear while the cited spec sections carry unratified absolutes."* This part of the process worked exactly as designed.
3. `review` then ran **on the backlog scenarios anyway**, against its own pre-flight: *"If the scenario is in `planning/backlog/`, **stop** — do not proceed with the review."*
4. The review landed at **`planning/backlog/review-F055-F058-self-serve-producer.md`** — a lane where the naming convention says reviews cannot live (`CLAUDE.md` § File and directory naming: *"alongside its scenario, in the **same lane** (`planning/next/` or `planning/now/`)"*), under a filename the convention has no slot for (`review-F###.md`, singular).
5. `ticket` then wrote T120–T126 **citing `planning/backlog/scenario-F05X-*.md`** — against its own hard constraint (*"Read only approved scenarios in `planning/next/` and `planning/now/`. NEVER `planning/backlog/`"*) and against `CLAUDE.md` rebuild rule 7 (*"If a ticket references a scenario that is still in `backlog/`, **stop and move the file first**. The firewall is load-bearing."*).
6. **All seven tickets tick Gate C `[x]`**, each citing the backlog review by path.

## 2. Why Gate C did not fire

Gate C branch (a) is a command, and the command is:

```
ls planning/next/review-F{NNN}.md planning/now/review-F{NNN}.md 2>/dev/null
```

For F055 that resolves to `planning/next/review-F055.md` and `planning/now/review-F055.md`. **Neither exists.** The review is in a third lane, under a fourth filename. The `ls` returns nothing, and *"No file → stop, do not draft tickets."*

So Gate C did not fail to fire. **It would have fired correctly, had it been run.** It was not run — it was answered from the page, by a reader who could see a review and concluded a review existed. Which is true, and is exactly what the gate's own text forbids:

> **Every branch ends in a command.** Do not read a review to decide whether it "counts." Do not decide whether a surface "really" needs design attention.

And what `process-checklists.md` design rule 1 forbids, in the words it was written in this morning:

> **The trigger is a command, not an opinion.** …Today's central failure was a gate waived by self-declaration, which was *literally true and substantively wrong*. **A trigger you can run is a trigger you can't talk yourself out of.**

"A review exists" was literally true and substantively wrong. The review had not been run on approved scenarios, was not where the pipeline could find it, and did not certify the thing Gate C exists to certify — that this work passed the reviewing function **after** the planning function approved it.

## 3. The root cause, and why it is the finding that matters

**A gate whose command cannot run gets satisfied by judgment.** Three instances today, all the same shape:

| # | Where | The unrunnable command | What happened |
|---|---|---|---|
| 1 | **T118** (this morning) | Decision-driven ticket, no F-number, so `ls review-F{NNN}.md` had no `{NNN}` to substitute | Recorded honestly as unrunnable rather than ticked. **Gate C branch (b) was added in response.** The good outcome. |
| 2 | **T120–T126** (this afternoon) | Review exists but in the wrong lane under a non-conforming name, so the `ls` finds nothing | **Ticked `[x]` seven times by judgment.** The bad outcome. |
| 3 | **F059** (this afternoon) | Gate A held the scenario in `backlog/`; `review` refuses to run on `backlog/`; `ticket` refuses without a review | Deadlock. Broken by ratifying the two absolutes, which is the correct exit — but the review would have had **no legal home** had the PM deferred instead. |

Instances 2 and 3 are the same structural hole seen from both sides: **a Gate-A-blocked scenario needs a review that has nowhere to live.** The F055–F058 session put it in `backlog/` and carried on. The F059 session got out by ratifying. Neither is wrong. **The process has no defined answer**, and when a process has no defined answer, sessions invent one — and the invented answer is always the one that lets the work continue.

**The T118 amendment fixed one unrunnable branch. It did not fix "unrunnable" as a category.** That is the thing worth fixing.

## 4. What is affected

**Seven tickets. Five already blocked for substantive reasons that have nothing to do with this finding.**

| Ticket | Cites | Blocked on | Affected by *this* finding? |
|---|---|---|---|
| T120 image storage substrate | F055 (backlog) | **Gate B** — A1 (EXIF/GPS stripping) unratified | Path + Gate C only |
| T121 product composer photo | F055 (backlog) | Gate B via T120 | Path + Gate C only |
| T122 operator takedown | F058 (backlog) | **Gate B** | Path + Gate C only |
| T123 report path | F058 (backlog) | **PM operating decision** (who answers reports) | Path + Gate C only |
| T124 service/gathering photo | F055 (backlog) | Gate B via T120 | Path + Gate C only |
| T125 You producer state | F057 (backlog) | *nothing* | **Path + Gate C — and it is the one that could be built today** |
| T126 edit shop | F056 (backlog) | **Gate B** (two absolutes) + **F056 EXTEND** | Path + Gate C only |

**T125 is the exposure.** It is the only one of the seven with no substantive blocker, so it is the only one a build agent could pick up and run — against a scenario the planning function never approved, on the strength of a Gate C tick that would not survive its own command. Everything else is held by a real blocker that happens to be doing this finding's job for it.

## 5. Salvageable — and the answer is yes, comfortably

**The tickets do not need redrafting. Their content is sound and in places unusually good** — prior-art pointers into the vendor surface before it is deleted, a release gate binding T121's deploy to T122's takedown path, an honestly recorded Gate B deviation on T120 (*"drafted anyway, at PM request… recorded as a deliberate Gate B deviation, not a waiver"*), and a mid-flight rescope on T125 after the PM's read that You is a modification rather than a rebuild. That is careful work. **The defect is in its grounding, not its substance.**

What re-grounding costs, in order:

1. **`weigh` on the absolutes** — A1 (an uploaded image is stripped of embedded metadata; the platform never stores or serves GPS coordinates) and the values-declaration never-sourced/never-inferred constraint. Both land in `product/foundation/policy.md`. **This is the real work, and it is owed regardless of this audit** — Gate B is holding five tickets on it.
2. **`explore` on the F056 EXTEND** — `groups.md` owes a *§ Editing an active business Group*; `group.update_business` would be the first non-draft Group write in the registry.
3. **Advance F055–F058 `backlog/` → `next/`** once (1) clears Gate A.
4. **Move and rename the review** so the gate's command can find it. Four files, or one file and three pointers — see § 6, because the naming convention currently forbids what this review actually is.
5. **Edit one line per ticket** — the `Scenario:` path from `planning/backlog/…` to `planning/next/…`.
6. **Re-run Gate C by command** on all seven, and record the result.

Steps 3–6 are minutes. Steps 1–2 are the schedule. **Nothing here is rework; it is the ordering the pipeline asks for, performed late.**

## 6. The convention gap the review exposed, separately

`review-F055-F058-self-serve-producer.md` is **arguably the right artifact.** Four scenarios that share a storage substrate, an upload path and a design recipe genuinely review better together than apart — a per-scenario split would have restated the same five binding notes four times and lost the cross-scenario findings (one bucket, one upload code path, the shared image-picker recipe `design-language.md` still owes).

**But the naming convention has no slot for it**, so the gate cannot find it, and neither can anyone grepping for `review-F056.md`. Two ways out, both cheap, and this is a PM call:

- **(a)** One review file per F-number, three of them thin pointers into a shared body. Gate C's command works unchanged.
- **(b)** Let a combined review exist under a defined name, and widen Gate C's command to a glob that matches both shapes — e.g. `ls planning/{next,now}/review-*F{NNN}*.md`.

**(b) is the better fit** for how this project actually reviews — the F059 review had the same pull toward covering F044/F045/F046's shared inheritance — but it widens a gate, and widening a gate on the day it was found not to have fired deserves a deliberate decision rather than a convenience.

## 7. Disposition — PM calls, not work items

1. **Is `weigh` on A1 and the values constraint scheduled?** Five tickets and the whole photo workstream sit behind it, and it is the only thing standing between T120–T126 and being buildable.
2. **T125 — leave blocked or ground it now?** It is the one ticket with no other blocker and therefore the one that could be built against an unapproved scenario. Cheapest safe answer is a one-line `Status:` note saying it is not buildable until F057 is in `next/`.
3. **Combined reviews — (a) or (b) in § 6?**
4. **Does "unrunnable" become a defined verdict?** The standing amendment this audit argues for is one line in `process-checklists.md`: *a checklist item whose command cannot be run is neither passed nor N/A — it is **unrunnable**, and an unrunnable gate is a stop, recorded as such.* T118 did exactly that voluntarily and it was the right instinct; nothing yet requires it. **Two of today's three instances would have been caught by that one line.**
5. **The Gate A / review deadlock** (§ 3, instance 3) — recorded here and in F059's ledger, deliberately not patched today. It belongs with the other harness amendments.

## 8. What this audit is not saying

The F055–F058 session was **more transparent than the process required of it**, and that is why this audit could be written at all. It recorded Gate A as blocking and obeyed it. It labelled T120's Gate B deviation a deviation rather than a waiver. Its ledger rows state plainly that the scenarios were left in `backlog/`. Every fact in § 1 came from that session's own documentation.

**The finding is about a gate that can be answered from the page instead of from a command — not about a session that hid anything.** The correct response is to make the gate unanswerable that way, not to ask people to try harder.
