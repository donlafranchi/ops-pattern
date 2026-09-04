---
purpose: One short checklist per kind of work, each with a mechanically-checkable trigger. Replaces the idea of one universal gate list that gets skipped because most of it doesn't apply.
layer: how
status: active
---

# Process checklists

Four checklists. Each fires on an **observable fact**, not a judgment call. Run the one that matches the work in front of you; ignore the rest.

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
- [ ] **List in-flight tickets on the affected surface.** `grep -l "<surface>" development/tickets/*.md`. Every hit is stale as of this ratification. Give each one a disposition **in this session** — pause, re-scope, or accept-and-note. Do not leave it for the build agent to discover. *(This is the item that catches T116, built 3h09m after Explore's retirement.)*
- [ ] **List approved scenarios on the affected surface.** Same grep across `planning/next/` and `planning/now/`. Same dispositions.
- [ ] **Land the State-tagged `Intent` line** on the statement itself — `(Ratified YYYY-MM-DD)` or `(Deferred until {trigger}; review by {horizon})`. Existing `weigh` discipline; it held today.
- [ ] **Mark the supersession in the doc being overridden**, in place — not only asserted in the new doc. Today's `decision-surfaces.md` did this correctly; it is why the retired three-tab model doesn't quietly get re-cited.
- [ ] **Commit it.** An uncommitted decision does not exist. Include the parent-repo push (see checklist 3, last item).

## 2. Writing tickets — `ticket`

**Fires when:** drafting any `development/tickets/T{NNN}-*.md`.

- [ ] **Gate C — review present.** `ls planning/{next,now}/review-F{NNN}.md`. No file → **stop, do not draft**, route to `review`. *(F044 and F045 both reached `ticketed` with no review. Their own ledger rows flag it. This is the check that was missing.)*
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

---

## Deliberately not written

- **A scenario-writing checklist.** `scope` worked on 2026-09-03. F048–F053 are well-anchored and the two blocked ones are correctly marked blocked. Nothing went wrong; no gate earned.
- **An audit checklist.** The vendor/market audit found two live bugs — a dead query firing app-wide and a distance-origin defect with no visible symptom. Audits are already doing the thing the rest of the pipeline needs more of. Adding process here would slow down the part that works.
- **A retirement checklist.** A retirement *is* a decision — checklist 1 covers it, and its second item is the whole point. Executing the deletion is covered by build's close-out reconciliation. Two checklists for one activity is how checklists die.
