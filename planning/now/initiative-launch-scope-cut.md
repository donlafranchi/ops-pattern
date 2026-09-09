---
purpose: The 2026-09-08 scope cut — every plan item walked against the two surviving loops. In, out, ambiguous.
layer: how
status: active
---

# Scope cut — two loops only

**PM ruling 2026-09-08. Everything that is not one of these two loops is postponed:**

- **A. Selling a product or service**, and the activities around that loop.
- **B. Creating or joining a group**, and the activities around that loop.

**Explicitly out: volunteering, posting an idea, and anything else outside those two.**

> **"And the related activities" is doing a lot of work in that sentence, and it was not read generously.** The test applied below: **something is a related activity when the loop cannot function without it, not when it would be nice alongside it.** Where a thing relates only by association, it is out. **Every place that call was made is marked.**

## IN — 24.5 days

| Item | Days | Why it's in |
|---|---|---|
| Page identity migration | 0.5 | **A Page is a `groups` row. Creating a Page *is* creating a group.** Loop B. *(Already shipped.)* |
| Location step — address, neighbourhood, resolver | 2.5 | A Page that pins to the wrong place cannot be found. Loop B. **In flight now.** |
| Category step, with the *Other* capture | 0.5 | What the Page offers. Loops A and B. |
| Photo step + Page-photo takedown | 1.5 | Page identity. Loop B. |
| Default art | 0.5 | Every Page has a face on day one. Loop B. |
| Composer resume + honest save copy | 0.5 | Loop B. |
| Dead producer page + create entry point | 2.5 | **The door to both loops.** Currently dead. |
| Search, Pages only | 2 | The other half of loop A — a consumer finding a seller. Launch requirement 3. |
| Browse rebuilt around Pages | 2 | Same. *(Reduced from 2.5 — the gatherings half is ambiguous, below.)* |
| Report path + operator image takedown | 1.5 | **A related activity kept deliberately.** Not a loop — but a ratified precondition: *the platform never serves an image it cannot take down*, and photos are in scope. **Cutting it would mean cutting photos.** |
| Metadata rewrite + retired vendor routes | 0.75 | The retired routes are dead selling surfaces; the metadata describes the product. Loop A. |
| Sell-routing role bug | 0.25 | **A live defect in loop A** — a membership check that filters kind and lifecycle but not role. **Extracted from the follows work so it doesn't leave with it.** |
| Test harness — fail-loudly, write-safe gate | 0.75 | **A related activity kept deliberately.** It is what verifies the storage rules that Page photos depend on. **Infrastructure under in-scope work, not a loop.** |
| Migration drift check — remaining half | 0.25 | Same reasoning. |
| Onboarding, empty states, copy pass | 2.5 | **Rescoped to the two loops.** A person still finishes signup without being told what this is for. |
| Seed content | 0.5 | Loop A and B both need something to look at. |
| **The Join control** | **0.75** | **Added 2026-09-08.** *Creating or joining a group* is half the remaining product and **the joining half has no entry point.** See below. |
| **Bulletins to members** | **2** | **Re-scoped 2026-09-08. The audience is members, not followers — so the follows dependency disappears entirely.** Loop B. |
| What the dogfood loop surfaces | 2 | Held open. |

## OUT — 5 days returned

| Item | Days | Why it's out |
|---|---|---|
| **Follows simplification** | 1.25 | Following is explicitly **not** joining — we ruled that yesterday, and the whole point of F065 is that following grants no membership. **So it cannot be the joining loop.** *(The live routing bug is extracted and kept, above.)* |
| **The response path / RSVP** | 0.75 | **Stays out, and now for a structural reason rather than a scope one.** A recurring group's occurrences **do not exist as rows** — the recurrence is a string, and nothing materialises instances. So an RSVP could only attach to the gathering as a whole, and *"I'm coming to the run club"* is what **membership already says.** **There is nothing to RSVP to.** |
| **Popularity ordering** | 0.5 | An ordering refinement, and **it has no data source once responses go.** It would produce nothing. |
| **Consequence to handle, not to build:** with responses out for good, **the shipped browse control that sorts by responses orders by a permanently-zero column.** It must be **removed**, not left in place — a control that silently does nothing is worse than a missing one. **Minutes, folded into the browse work.** | — | |
| **Feature-tap signals** | 0.25 | **About unbuilt features, which are by definition in neither loop** — and the two it surfaces are the two explicitly cut. |

## AMBIGUOUS — named, not resolved

### 1. Gatherings — RULED OUT 2026-09-08, with the premise corrected

> **The ruling stands. The premise behind it does not, and the difference changes what leaves.**
>
> **Gatherings are the most completely built Item kind in the product.** `item_gatherings` carries a recurrence rule, capacity, cost, what-to-bring, a host, and an RSVP cutoff — **more columns than product or service.** The composer handles recurrence in ten places. The page, the resolver and the URL slot all ship. **The scenario for *recurring* gatherings was written, reviewed and closed** — so *"a one-time meetup instead of a recurring one"* describes the opposite of what was built.
>
> **What was never built is the loop around them:** nobody can RSVP, nobody is notified, and nothing brings a gathering back to anyone. **That is the correct thing to cut, and cutting it is what the ruling achieves.**
>
> **So the cut saves almost nothing in days** — the browse simplification was already deducted when this ambiguity was first flagged, and RSVP was already out. **What it costs is the word *gather*.** See the positioning note below.
>
> **What survives without gatherings:** appearances at a venue *(a truck at a market is a product or service attached to a location — loop A, and it never depended on gathering infrastructure)*, the position resolver *(built around appearances, not dates)*, and the sixteen production items *(gatherings among them keep their pages and URLs; browse simply stops indexing them — no cleanup, no withdrawal)*. **The feed's upcoming-only time filter becomes dead code rather than a cost.**

### CORRECTED 2026-09-08 — the cut is narrower than it was read

**PM: *"gatherings didn't get cut. Hosting a single-time gathering is postponed. We want regular recurring groups to be able to create a page and to post bulletins."***

**So: recurring groups in, one-time occasions postponed, bulletins back in and addressed to members.**

**The seam is real and the composer already has it.** Its first step offers three cards — **One-time event · Recurring gathering · Open meetup.** Postponing one-time means showing two cards instead of three.

**But the seam is two columns, not one.** A recurrence rule alone would postpone open meetups too, since they carry no rule and no date. The distinction in the data is: **rule present → recurring · no rule but a date → one-time · neither → open meetup.**

**Enforcement is as cheap as expected, and cheaper than validation: don't offer the option.** A state that cannot be chosen cannot be created; one defensive line in the handler covers the rest. **Nothing structural.**

**Open meetup is not named in the ruling and I am not deciding it.** *"Drop in anytime, no fixed schedule"* is a standing arrangement rather than an occasion, so it sits with recurring rather than with one-time. **Lean: keep it. Flagged.**

### The positioning consequence, answered plainly — and it changed

**Under the corrected cut, "gather" is honestly in the product — by announcement rather than by RSVP.**

**What the app delivers:** a recurring group has a Page, people join it, the organiser tells members when and where it meets, and members see it in their feed. **That is gathering. It is coordinated by the organiser telling people, which is how most recurring things actually work.**

**What is still absent, stated so nobody is surprised:** nobody can reply to anything, and **there are no one-time occasions.** So the honest claim is *"find your group and know when it meets"* — **not *"organise an occasion."*** That is a smaller claim than the word usually carries, and it is a true one.

### 1b. Gatherings — the original ambiguity, retained for the record

**Hosting a gathering is neither selling a product or service nor creating or joining a group.** On a strict reading it is out, and with it goes RSVP, the gathering half of browse, and the gathering composer's place in the plan.

**The argument for keeping it: a Page *is* a group, and a gathering is how a group does the thing it exists to do.** A run club that never meets is not a group. On that reading, hosting is loop B's central activity rather than an association.

**The argument against: that is exactly the generous reading the ruling warns about.** *Creating or joining* a group is not *everything a group subsequently does.*

**I lean: keep gatherings, but only as a Page activity** — a Page hosts; a person with no Page does not.

**Why this needs Don and not me: reading it the other way returns the product to marketplace-only, which is the precise defect the launch exists to correct.** *"Buy, sell, trade **and gather**"* is the positioning, and the first thing flagged in the original brief was that events must not be a tab bolted onto a marketplace. **A scope cut that removes gathering is a positioning change wearing a scheduling costume.**

### 2. Search across gatherings

Follows the gathering call. **Scoped to Pages either way**, so no cost difference — recorded so it isn't reopened.

### 3. Join / leave a Group — RESOLVED, and it is in

**Corrected 2026-09-08: joining is not ungoverned.** [F035](../done/) specs it in detail — Join on community kinds only, **no Join on a business Page**, writes the kind's default role with `source='explicit'`, Members section shows listed memberships only. **The handler code matches every line of it.**

**What is missing is the control.** The only caller of the join handler is the *undo* affordance on the following list, so **a member can re-join something they left and cannot join anything else.**

**No new scenario needed.** The granularity rule says a noun performing a verb needs a scenario — **and this one has an approved, closed one.** This is a ticket against F035, not scope work.

**Price: 0.75 day.** The control on the Group page with its three states — anonymous *(visible, prompts sign-in)*, joinable, joined *(flips to Member, offers Leave)* — plus the kind gate that keeps it off business Pages, and M3 on a new control. **Handler, rules, read paths and the page all exist.**

**Not costed above because nobody has scoped it.** **It moved from "biggest hole in the matrix" to "in scope and unspecified" with this ruling**, which is a bigger change than it looks.

## The number

| | |
|---|---|
| Before the cut | 26.75 |
| Two-loop cut | −5 |
| Gatherings ruled out | −0 · *the browse deduction was already taken when the ambiguity was flagged* |
| The Join control, newly found | +0.75 |
| **Bulletins to members** — back in, cheaper | **+2** |
| One-time gatherings postponed | **−0** · *possibly −0.25; it removes a branch* |
| **Total** | **24.5** |
| Available to 30 October | ~37 |
| **Slack** | **~12.5 days, about 34%** |

**Gatherings going subtracts nothing further** — the browse simplification was deducted in advance when the ambiguity was first flagged, and RSVP was already out. **The ruling confirms a deduction already taken.**

**The slack is now genuinely comfortable rather than nominally adequate** — which matters given that two estimates yesterday were wrong in the same direction.

## Nothing in flight is affected

**Checked, not assumed.** The only active branch is the location step — address search and neighbourhood mode — which is **squarely in loop B and is the largest in-scope item.** The migration and storage substrate merged before the cut and both remain in scope.

**One artefact of timing worth knowing:** the shipped migration already created the demand-signal table with both subject kinds. **The feature-tap kind now has no writer. That costs nothing and splitting the table would cost more than leaving it** — one unused enum value, documented.
