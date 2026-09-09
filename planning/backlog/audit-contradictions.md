---
purpose: Every live contradiction in the docs, and the register that resolves them — a small vocabulary borrowed from Google's style guides where a rule states a default, its reasoning, and when departing is legitimate.
layer: how
status: backlog
---

# Contradictions, and the register that ends them

**For the ops-pattern revamp, 2026-09-09.**

---

## The problem, in one paragraph

Almost every rule in this repo is written as a prohibition. *No top-anchored search fields. No tinted backgrounds. Never solid-color cards. Rank, never filter.* When a prohibition meets reality, there are only two moves — obey it or violate it — so every ordinary design call becomes a constitutional crisis, and the exits people actually take are *record a violation* or *quietly ignore it*. Both have happened. `decisions.md` puts the scale plainly: **179 statements across the foundation and playbook docs read as settled; seventeen actually are.**

**Nothing here is a bad decision.** The reasoning behind these rules is good and stays. What is wrong is the *grammar* — absolute where it should have been a strong default with a stated reason.

---

## The fix: three levels, five words

Borrowed from how Google writes its style guides and engineering practices. Four ideas transfer:

- **Reasoning lives inside the rule, not in a footnote.** A rule whose reason is unwritten cannot be applied to a case its author never foresaw.
- **A rule must earn the cost of everyone remembering it.** Their stated bar. This repo has never had one.
- **Known exceptions are written into the rule**, not left to argument later.
- **Most text binds nothing.** Their style guides mark examples non-normative outright.

| Marker | Force | Departing |
|---|---|---|
| **Rule** | Binding. Effectively permanent. | Not done. A departure is a defect. Changed only by memo. |
| **Default** | What we do absent a reason not to. | **Legitimate when justified.** Write the reason down. Nobody approves it. |
| *(unmarked)* | Explanation, context, history. Binds nothing. | n/a |

**The floor is the load-bearing part.** These docs are mostly prose. Today any firm sentence reads as binding. After this, only a marked one does.

### The exact words a rule carries

```
### {Name — verb-led}

**Default.** {What to do. One sentence.}

**Because.** {Why. One to three sentences.}

**Depart when.** {The conditions that make departing right. Concrete.}

**Instead considered.** {Optional. Alternatives weighed, and why they lost.}
```

```
### {Name — verb-led}

**Rule.** {What is binding. One sentence.}

**Because.** {Why this cannot be a Default. Name the harm.}

**Ratified.** YYYY-MM-DD · **Changed by.** Reversal memo.
```

Recording a departure — one line, where the work lives (a ticket's DEVIATIONS entry, or inline in the spec):

```
Departs: {doc} § {section} — {why, one sentence}
```

### Two properties worth knowing

- **A Rule has no `Depart when`.** That absence *is* the definition. Never add the field to soften one.
- **The inability to write an honest `Depart when` is the entire test for Rule-ness.** Two parts, both required: no legitimate departure exists, *and* you would revert a release to undo a violation. Fail either → Default. Writing the field is how the triage happens.

---

## The live contradictions

| # | Contradiction | Status | Becomes |
|---|---|---|---|
| 1 | Bottom-anchored controls vs. the shipped top search row | **Live in production** | Default + `Depart when` |
| 2 | The research thesis vs. the design language — no precedence declared | **Root cause of #1** | One line of precedence |
| 3 | "No color block cards" vs. the shipped always-present media block | Amended in place 2026-09-04 | Already the right shape — copy it |
| 4 | "Rank, never filter" vs. filtering the feed by metro | Demoted to a bet 2026-09-04 | Default, revisit trigger stated |
| 5 | "Neighbours, not creators" vs. "everyone who posts is a creator" | **Unresolved — PM call** | Stays a genuine question |
| 6 | Commitments carried into `surfaces.md` in the old register | New, uncommitted | Add `Depart when` |
| 7 | Gate A blocks a scenario; review can't run on a blocked scenario | **Process deadlock, hit twice** | Mostly dissolves |

---

### 1 — Bottom-anchored vs. the shipped top search row

- **The rule:** `design-language.md` principle 9 — *"All primary controls anchor to the bottom of the viewport… No top-anchored toolbars or search fields."*
- **What shipped:** `ExploreSearchBar` is `sticky top-0`, on the browse surface, live now.
- **What happened:** a review called the design language the winner and accepted the violation for one release, expiring only if the follow-on chrome work happens.
- **Why it's the flagship case:** you now want search above the nav — which *agrees with the principle*. The rule was never wrong. It was written as a prohibition when it should have been a default with a named exception, so a legitimate design call had to be filed as a violation.

**Rewritten:**

> **Default.** Anchor primary controls to the bottom of the viewport.
>
> **Because.** Thumb reach on a phone. Google Maps and Apple Maps put mode-switching at the bottom, so it reads as familiar rather than novel.
>
> **Depart when.** The control is for **orientation** rather than **manipulation** — something a person reads to know where they are, rather than taps to change what they see. A search field that also displays the active place is orientation; a filter that changes results is manipulation and stays at the bottom.
>
> **Instead considered.** A fully bottom-anchored search expanding upward on focus. Rejected for the browse surface: it hides the active place, which is the one thing a person needs to see before they trust the results.

That last field resolves the contradiction in one sentence — and it retires it, rather than scheduling its expiry.

---

### 2 — The thesis vs. the design language

- `design-research-thesis.md` §5 and `design-language.md` principle 9 both govern control placement. They disagree, neither cites the other, and **no document says which wins.**
- The shipped top search row cites the thesis. The review that found it cited the design language. Both were correct.
- **The scenario that chose between them (F045) had no review** — so nothing in the pipeline ever put the two documents in the same room.

**Fix — one line at the top of the thesis, no other change:**

> **The thesis explores; the design language governs.** Where they conflict, the design language holds until a decision says otherwise. Nothing here binds on its own.

That is the Google *non-normative* move, and it costs one sentence.

---

### 3 — The card rule, already fixed correctly

- **The rule:** principle 5 — *"Never solid-color rectangles or tinted card backgrounds."* Principle 3 — *"No tinted backgrounds."*
- **What shipped:** an always-present 4:3 media block on `--color-surface` (`#F7F7F7`), including when there is no photo.
- **Why it isn't a violation:** the amendment argued the token's documented purpose covers empty states, and kept the surviving clause — *no colour, ever; no per-kind palette, no accent fill, no emoji.*

**Nothing to change. This is the model for the rest.** It kept the reasoning, narrowed the prohibition to the part that was load-bearing, and named what survives. Do this everywhere else.

---

### 4 — "Rank, never filter" vs. metro filtering

- **The rule as written:** *"This is a ranking rule, not a filter rule… Nothing is excluded from the catalog for being far away."*
- **What ships:** the feed filters by metro. Items outside it are absent.
- **Already handled** — demoted from a standing commitment to a versioned bet on 2026-09-04, reasoning intact, with a revisit trigger (a metro exceeding a few hundred published items).
- **Remaining nit:** `decisions.md` lists it under Contradictions as *"managed rather than resolved."* Under the new register it is simply a **Default** whose `Depart when` reads *"the metro is the whole market and the far band would be empty anyway."* Move it out of the contradictions list.

---

### 5 — Creator framing

- The design north stars refuse creator framing outright — it's why there's no reach chrome.
- The role-language work landed *creator as a feeling the product produces, not a label it applies.*
- **That is a reconciliation, not a ruling.** Open question: is the refusal now scoped to the word-as-label only, or does it still bar the aspiration?

**This one is a real disagreement, not a grammar problem.** The register does not resolve it. It stays on the PM list.

---

### 6 — The new docs inherited the old register

`surfaces.md` (uncommitted) carries eight commitments forward — anonymous browse, no engagement ranking, distance is out, online ranks last, metro vantage point, and others. Good statements, correctly preserved, all in **Ratified + Intent + Overturned by**.

- **No `Depart when` on any of them.** A future session hits the same wall these seven contradictions came from.
- Cheapest fix: keep the shape, add the one field. `Overturned by:` on a Default is doing the same job badly — fold it into `Depart when`.
- Of the eight, likely only **anonymous browse** and **no engagement-derived ranking** survive as Rules. The rest are strong defaults.

---

### 7 — The process deadlock

Not a doc contradiction; a pipeline one, hit twice in one day.

- Gate A holds a scenario in `backlog/` when it cites an unratified absolute.
- `review` refuses to run on a `backlog/` scenario.
- `ticket` refuses to draft without a review.
- **So a scenario with one untagged absolute cannot move at all.** One session escaped by ratifying two statements; another escaped by reviewing anyway and ticking the gate by eye.

**The register mostly dissolves this.** Both gates fire on absolute language lacking a State tag. Under Rule/Default, the fix for a typical untagged absolute is *reword it as a Default with `Because` and `Depart when`* — no ratification, no stop. The gates then fire only on Rule candidates, which are few by construction.

**Two residuals to fix by hand:**

- A review must have a legal home beside a blocked scenario, or blocked scenarios must be reviewable. Pick one.
- **A checklist item whose command cannot be run is neither passed nor N/A — it is *unrunnable*, and that is a stop.** One line. It would have caught two of the three gate failures on 2026-09-04.

---

## What to do in the revamp

1. **Add the register to the writing canon** — the two templates above, verbatim, in `playbooks/writing-docs.md`. That is the part that gets copied.
2. **Declare the non-normative floor.** One line: unmarked prose binds nothing. This retires most of the 179 without touching them.
3. **Rewrite the nine design-language principles** as Defaults with `Because` + `Depart when`. Expect one or two to survive as Rules — probably none.
4. **Add the precedence line to the research thesis.** One sentence, closes #2 and therefore #1's root.
5. **Add `Depart when` to `surfaces.md`'s eight commitments** before it commits, while it's cheap.
6. **Leave the 17 constitutional decisions alone.** `decisions.md` already did the shrink. They are Rules; give them the `Rule` marker and the `Changed by` line and stop.
7. **Move #4 out of the contradictions list** and #5 onto the PM list. What remains in Contradictions should be things that are actually in conflict, not things being managed.

---

## The one thing not to lose

**This is a change of register, not a purge.** Every rejected alternative and every *why* survives — `Because` and `Instead considered` exist precisely so nothing gets deleted in the move. A rule that loses its reasoning has to be re-argued from scratch the next time someone meets a case it didn't anticipate, which is the failure this whole exercise is correcting.
