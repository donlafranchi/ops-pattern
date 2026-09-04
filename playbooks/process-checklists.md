---
purpose: One short checklist per kind of work, each with a mechanically-checkable trigger. Replaces the idea of one universal gate list that gets skipped because most of it doesn't apply.
layer: how
status: active
---

# Process checklists

Five checklists. Each fires on an **observable fact**, not a judgment call. Run the one that matches the work in front of you; ignore the rest.

## Design rules these follow

1. **The trigger is a command, not an opinion.** "Fires when `git diff --name-only` touches `src/app/**`" — not "fires when the change is significant." Today's central failure was a gate waived by self-declaration ("no new component"), which was *literally true and substantively wrong*. A trigger you can run is a trigger you can't talk yourself out of.
2. **No bare N/A.** If an item genuinely doesn't apply, name the file, line, or command output that makes it not apply. The word "N/A" on its own is not an answer.
3. **Six items maximum.** A checklist nobody runs catches nothing.
4. **Every item is "go look at a specific thing."** Not "consider whether." The only checks that worked on 2026-09-03 were the ones that compared a document to ground truth.

---

## 1. Ratifying a decision — `weigh`, or any conversation that ends in a decision doc

**Fires when:** you are about to write or amend a `Decision:` line, a State-tagged `Intent`, or any entry in `playbooks/PLATFORM-PATTERNS.md` / `DEVELOPMENT-PATTERNS.md` / a `planning/backlog/decision-*.md`.

This is the checklist that did not exist on 2026-09-03, and the one that would have caught the most. Decisions went from conversation to decision doc with nothing checking them against shipped code or in-flight work.

- [ ] **Name what already ships that this contradicts.** Grep `web/src` for the thing being changed. Write the file list into the decision doc. *(Retiring Explore: `src/app/explore/`, `src/lib/explore/*` — two shipped tickets' worth of code.)*
- [ ] **List in-flight tickets on the affected surface.** `grep -l "<surface>" development/tickets/*.md | xargs grep -L -iE '^\*\*Status:\*\* *(Done|Complete)'` — the `xargs grep -L` drops tickets already marked Done/Complete, which the bare `grep -l` does not. Every surviving hit is stale as of this ratification. Give each one a disposition **in this session** — pause, re-scope, or accept-and-note. Do not leave it for the build agent to discover. *(This is the item that catches T116, built 3h09m after Explore's retirement. The status filter was added 2026-09-04: `development/tickets/` holds nine closed-but-unarchived tickets, so the unfiltered grep returned eight already-done hits for one live one — noise that trains you to skim the list.)*
- [ ] **List approved scenarios on the affected surface.** Same grep across `planning/next/` and `planning/now/`. Same dispositions.
- [ ] **Land the State-tagged `Intent` line** on the statement itself — `(Ratified YYYY-MM-DD)` or `(Deferred until {trigger}; review by {horizon})`. Existing `weigh` discipline; it held today.
- [ ] **Mark the supersession in the doc being overridden**, in place — not only asserted in the new doc. Today's `decision-surfaces.md` did this correctly; it is why the retired three-tab model doesn't quietly get re-cited.
- [ ] **Commit it.** An uncommitted decision does not exist. Include the parent-repo push (see checklist 3, last item).

## 2. Writing tickets — `ticket`

**Fires when:** drafting any `development/tickets/T{NNN}-*.md`.

- [ ] **Gate C — review present, or checklist 4 fired.** Which branch applies is set by the ticket's `Scenario:` field, not by judgment:
  - **Scenario-driven** → `ls planning/{next,now}/review-F{NNN}.md`. No file → **stop, do not draft**, route to `review`. *(F044 and F045 both reached `ticketed` with no review. Their own ledger rows flag it. This is the check that was missing.)*
  - **Decision-driven** (`Scenario: decision`, no F-number) → the `ls` is unrunnable, not failed. **Checklist 4 fires instead, and is mandatory**; name `design:design-critique` and `design:accessibility-review` (M3) in the ticket. *(T118 hit this on the first outing of these checklists: a ratified design decision, a Member-visible card, no F-number, and not substrate either. It recorded the gap instead of ticking the box — which is the only reason it got fixed rather than becoming the waiver everyone cites. A gate nobody can run is how gates get waived.)*
  - **Substrate** (`Scenario: substrate`, no surface) → exempt, and **say so in the ticket's Notes.** An unstated exemption looks exactly like a forgotten gate.
- [ ] **Gate B — ratified absolutes.** Existing step 3. Unchanged.
- [ ] **All three `Serves` lines resolve to something real.** Existing rule, and it earned its keep today — an unfillable lineage field is what stopped a phantom work item built on a false premise.
- [ ] **Record the cited surface spec's last-changed date** in the ticket: `git log -1 --format=%ad -- <spec path>`. Build compares against it.
- [ ] **If the ticket renders anything a Member sees, name the governing `design-language.md` recipe.** No recipe fits → that is an `explore` gap; escalate rather than inventing one at build time. *(T088 specified `ItemFeedCard` as a list of fields with no recipe. That is why three surfaces now share a card nobody ever designed.)*

## 3. Building a ticket — `build`

**Fires when:** implementing any ticket.

- [ ] **Scenario lane check.** Existing step 2. Unchanged.
- [ ] **Premise check.** `git log --since="<ticket Date>" -- <cited spec paths>`. Empty → proceed. Non-empty → read the changes and confirm the ticket still stands before writing code.
- [ ] **M2 `engineering:code-review` before the commit.** Existing. It caught three real defects today.
- [ ] **Close-out reconciliation.** Existing step 18 (landed 2026-09-03). Stubs committed; invalidated text corrected.
- [ ] **Push after merge, and say what to look at.** `git push origin main`, then one line naming the *surface* the PM should open — not the ticket number. A ticket is not closed until the work is reachable by someone who did not build it.

## 4. Changing a surface — `review`, and the M3 gate

**Fires when** any of these is true — run the command, don't judge:

```
git diff --name-only main | grep -E '^src/(app|components)/'
```

…returns anything, **or** an existing component is rendered on a route that did not previously render it, **or** an existing component receives a new data shape.

That last pair is the T117 case: no new component, no new page, and a rebuilt surface. "No new component" is not a valid N/A.

- [ ] **`design:design-critique`** on the surface as composed — not on the component in isolation.
- [ ] **`design:accessibility-review`** (M3).
- [ ] **Screenshot at 375×812**, attached to the ticket's Completion section.
- [ ] **The DLS recipe named in the ticket actually governs what shipped.** If it drifted, that is a deviation.
- [ ] **One line in the DEVIATIONS entry about appearance.** "No appearance change" is valid only if the screenshot says so. *(T115 and T117 logged thirteen deviations between them — hex validation, pin colour, scroll restoration — and not one about what the screen looks like, because nothing asked.)*

## 5. Reacting to the deployed app — the PM has looked at it and wants it changed

**Fires when:** a change request's evidence is a screen. "This looks worse," "we want image-rich cards," "put the search box above the nav," "go back to how it was." The tell is that the request cites something seen, not a scenario, a ticket, or a spec line — and no scenario or ticket exists for it yet.

This runs **before** `scope`, not instead of it. Its whole job is to make sure the scenario that gets written describes a real defect and a real fix. On 2026-09-03 the first instinct — the PM's and mine both — was to start building; the card diagnosis then showed the premise was largely wrong.

- [ ] **Pin what was actually on screen.** `cd web && git log origin/main..main --oneline`. Non-empty → the PM was not looking at HEAD; name the gap before diagnosing anything. Record the URL, the viewport, and whether signed in. *(Today this returns two commits — the QR removal and a gitignore — so "what's deployed" and "what's on this Mac" were different screens.)*
- [ ] **Reproduce it and screenshot it.** Same URL, same viewport, attached to the request doc. A request with no screenshot is a memory, not an observation, and memories of one's own product are unreliable in a specific direction: they remember the demo.
- [ ] **Separate the complaint from the proposed remedy, and write the complaint first.** What is on screen that shouldn't be, or absent that should be. The PM's remedy is a hypothesis about the cause and gets checked like one. *(Today's remedy — richer cards — assumed a richer card had regressed. `grep -n "photo_url" web/supabase/seeds/*.sql` returns one line, an `item_products` insert with `array[]::text[]` in every row: no seeded Item has ever had a photo. There was nothing to restore.)*
- [ ] **If the request is "go back to how it was," name the commit.** `git log --oneline -- <surface path>` and identify the state being remembered. No such state → say so plainly and in writing: this is new design, not a restoration, and it gets scoped as new design. *(The remembered good design was a recruitment grid with no real inventory behind it. Restoring it would have restored the emptiness with it.)*
- [ ] **List what the request reverses or relocates.** `grep -rln "<surface or component>" development/tickets/*.md planning/next/*.md planning/now/*.md`. Every hit is shipped or approved work this request contradicts; give each a disposition in this session. *(Today: T114's kind-filter pill row and T116's inline list/map toggle are reversed outright; T115's filter sheet is relocated. All three merged within the previous 48 hours.)*
- [ ] **Check the request against `product/ui/design-language.md`, and quote the line.** Where they conflict, the DLS holds until a decision says otherwise — taste that overrides the design language is a decision doc, not a ticket. *(Today: an always-present image placeholder against DLS principles 3 and 5 and the no-photo card recipe — "no tinted backgrounds, no colored badges, no decorative emoji circles." Both positions are defensible. Nothing in the process made them meet.)*

---

## Considered and cut — do not re-derive

The 2026-09-03 retrospective ranked five amendments. **1, 2, and 3 landed on 2026-09-04** — push-after-merge (`skills/build/workflow.md` step 22 + two `orient` drift rows + the parent push in the `clearlock` line), the ratify checklist wired into `skills/weigh/workflow.md`, and Gate C in `skills/ticket/workflow.md` step 3b with the matching fix to `skills/review/workflow.md`.

**Amendments 4 and 5 were cut deliberately.** They are recorded here because a later audit will otherwise find the gap and file it as an oversight. It is not one — it is a standing preference for **few gates over comprehensive ones**, and re-adding these without new evidence reverses a PM decision rather than fixing a miss.

- **4 — Mechanical M3 trigger** (ticket template + `AGENTS.md`): replace *"if this ticket introduces a new page or component"* with a grep, plus *an existing component on a route that did not previously render it, or an existing component receiving a new data shape*, and rule that "no new component" is not a valid N/A. **Cut as redundant, and still cut:** M3 lives inside `review` per `AGENTS.md`, and Gate C makes `review` unskippable — so the door this would lock is already locked. A second lock on the same door costs a step on every ticket and buys nothing until the first lock fails.
  **Note (2026-09-04):** Gate C's branch (b) now uses exactly amendment 4's grep — including its "existing component on a new route / with a new data shape" clause — as the **decision-lane** trigger, and makes M3 mandatory and named there. That is the mechanism landing where it was actually needed (work with no F-number, where the missing review file used to take M3 with it silently) rather than as a blanket second check on every ticket. Amendment 4 as written — a template-wide replacement — remains cut.
- **5 — Premise check in `build` step 2**: `git log --since="<ticket Date>" -- <cited spec paths>`; non-empty means confirm the ticket still stands before writing code. **Cut as redundant and later:** the ratify checklist catches the same failure upstream and cheaper — at the moment the decision is made, when the disposition is obvious, rather than days later when a build agent has to reconstruct intent. It also does not catch the case that hurt most: T115's distance filter, where nothing about distance was in question when it was built.

**What would justify revisiting.** Amendment 4 earns its place if a scenario reaches `ticket` with a `review-F{NNN}.md` present that nonetheless skipped M3 — that is Gate C holding while M3 leaks, which is the failure this was insurance against. Amendment 5 earns its place if a ticket is built against a spec that changed after the ticket was written *and* checklist 1 was run on that decision — meaning the upstream catch fired and missed. Absent one of those two observations, leave both cut.

The retrospective's own summary is the standing guidance: *"Keep 1, 2, 3. Drop 4 and 5 if anything has to go."* Also cut there, and still cut: the appearance clause in acceptance criteria and a second drift-check row, both folded into these checklists instead.

## Deliberately not written

- **A scenario-writing checklist.** `scope` worked on 2026-09-03. F048–F053 are well-anchored and the two blocked ones are correctly marked blocked. Nothing went wrong; no gate earned.
- **An audit checklist.** The vendor/market audit found two live bugs — a dead query firing app-wide and a distance-origin defect with no visible symptom. Audits are already doing the thing the rest of the pipeline needs more of. Adding process here would slow down the part that works.
- **A retirement checklist.** A retirement *is* a decision — checklist 1 covers it, and its second item is the whole point. Executing the deletion is covered by build's close-out reconciliation. Two checklists for one activity is how checklists die.
- **A "did the PM like it" step inside `build`.** Checklist 5 fires on the PM's reaction; it does not solicit one. Build's job ends at a pushed surface and a line saying what to open (checklist 3). Asking the build agent to also ask for an opinion turns every ticket into a review meeting.
