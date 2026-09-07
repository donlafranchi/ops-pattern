---
purpose: The register every normative doc in this repo writes in — two levels, five words, and a departure mechanic that records rather than asks. Proposal awaiting PM ratification.
layer: how
status: backlog
---

# Decision: the doc register — Rule, Default, and what a departure costs

**Status: proposed 2026-09-04. Pass 1 of three.** Pass 2 shrinks the constitution against this scheme; Pass 3 rewrites `design-language.md` in it. Neither has run.

---

## 1. The register being borrowed

Paraphrased from Google's public engineering-practices and style-guide material. Not quoted — the ideas transfer, the wording is ours.

- **Reasoning is part of the rule, not a footnote.** Google's style guides open by arguing for themselves — what the guide is for, what it deliberately does not cover — before any rule appears. A rule whose reason is unwritten cannot be applied to a case its author did not foresee.
- **A rule has to earn the cost of everyone remembering it.** The C++ guide's stated bar for adding a rule is roughly that: the benefit must be large enough to justify asking every engineer to carry it. This is the bar our constitution has never had.
- **Exceptions are written into the rule.** Where Google's guides know a legitimate exception, they name it in the rule's own text rather than leaving it to argument later.
- **Most text binds nothing.** The Java guide marks its examples non-normative outright. Explanation and illustration are explicitly not requirements.
- **Three-level normative vocabulary where it is used at all** — Google's API design guidance takes must / should / may in the RFC 2119 sense, where *should* means a departure is legitimate provided the implications are understood and weighed.
- **Non-blocking feedback is marked as such.** Code review uses a "Nit:" prefix for comments the author may ignore, and sets the review bar at improving overall code health rather than at perfection.

**What this project takes:** reasoning-in-the-rule, exceptions-in-the-rule, most-text-binds-nothing, and a bar for admission. **What it drops:** `may` — a third level that means "do as you like" is indistinguishable here from unmarked prose, and the PM asked for a small vocabulary.

---

## 2. The scheme

**Two levels and a floor.** Five words total.

| Marker | Force | Departure | Changed by |
|---|---|---|---|
| **Rule** | Binding. Effectively permanent. | **None.** A departure is a defect. | Reversal memo. |
| **Default** | What we do absent a reason not to. | **Legitimate when justified.** Record the reason; do not ask permission. | Evidence, in place. |
| *(unmarked)* | Non-normative. Explanation, context, examples, history. | n/a | n/a |

- **Unmarked prose binds nothing.** This is the load-bearing half of the scheme, because these docs are mostly prose. Today any sufficiently firm sentence reads as a commitment; after this, only a marked one does.
- **"Default" is the word for what the PM called a guideline.** Recommended over "Guideline" for one reason: *guideline* invites "guidelines are optional," while *default* invites "you need a reason to move off it" — which is the behaviour actually wanted. The framework doc says in its own preamble that Defaults are the guidelines. **PM's call; "Guideline" costs nothing but the find-and-replace.**

### The test that assigns the level

Two parts, both required for **Rule**:

1. **You cannot write an honest `Depart when.`** Not "I can't think of one" — no legitimate case exists.
2. **You would revert a release to undo a violation.**

Fail either → **Default**. The forcing function is part 1: *the inability to name a legitimate departure is the entire evidence for Rule-ness*, so writing the field is how the triage happens. Pass 2 runs this test against the whole census.

---

## 3. The exact words the docs will carry

**This is the part that gets copied.** Verb-led heading, then the fields in this order.

### A Default

```
### {Name — verb-led}

**Default.** {What to do. One sentence, imperative.}

**Because.** {Why. One to three sentences. The reasoning that makes it worth having.}

**Depart when.** {The conditions that make departing the right call. Concrete enough to
recognise in front of you.}

**Instead considered.** {Optional. Alternatives weighed and why they lost.}
```

### A Rule

```
### {Name — verb-led}

**Rule.** {What is binding. One sentence.}

**Because.** {Why this cannot be a Default. Name the harm a departure does.}

**Ratified.** YYYY-MM-DD · **Changed by.** Reversal memo.
```

- **A Rule has no `Depart when.`** That absence is the definition, not an omission — do not add the field to soften one.
- **`Because` is mandatory on both.** This is what satisfies "don't lose reasoning": every existing `Intent`, rationale paragraph and rejected alternative has a field to land in, and nothing is deleted in the migration.
- **`Instead considered` is where rejected alternatives survive.** Optional only because many entries have none.

### Recording a departure

One line, where the work lives — the ticket's DEVIATIONS entry, or inline at the departing line in a spec.

```
Departs: {doc} § {section} — {why, one sentence}
```

- **A record, not a request.** Nobody approves it. The cost of departing is that you write the sentence.
- **No new infrastructure.** `DEVIATIONS.md` already carries exactly this discipline and is already mandatory at every ticket close.
- **Departures are the signal that maintains the set.** Three tickets departing from the same Default with the same reason means the Default is wrong or its `Depart when` is too narrow. That is the review trigger, and it is cheaper than a scheduled audit.

---

## 4. What this replaces, and the migration size

Census as of 2026-09-04:

| Today | Count | Becomes |
|---|---|---|
| `Intent (Ratified YYYY-MM-DD)` | **69** | Rule (few) or Default (most). **Pass 2 triages.** |
| `Intent (Deferred until X; review by Y)` | 1 | Unchanged — a deferral is neither level. Stays as an open question with a trigger. |
| `Overturned by: memo` / `: evidence` | 18 | **Near-mechanical:** `memo` → Rule, `evidence` → Default. |
| Pattern entries (`Decision` / `Intent` / `Touches`) | 35 | Relabel: `Decision`→`Default`, `Intent`→`Because`, keep `Touches`, **add `Depart when`.** |
| `decision-*.md` in backlog | 15 | Triaged in Pass 2. |
| `design-language.md` principles | 9 | **Pass 3.** |

- **The durability register was already most of the way here.** Its commitment/bet split maps one-to-one onto Rule/Default. This proposal is not a new system — it is that system given words people will actually use, plus one new required field (`Depart when`) and one new floor (unmarked binds nothing).
- **`Overturned by:` retires into `Changed by.`** on Rules and disappears on Defaults, where the falsifier belongs in `Because` and `Depart when` anyway. One line saved per entry.

---

## 5. Consequences worth knowing before ratifying

- **Gates A and B mostly stop firing, and that is the point.** Both gate on absolute-language statements lacking a State tag. Under this register the fix for a typical untagged absolute is *reword it as a Default with `Because` and `Depart when`* — no `weigh`, no PM ratification, no pipeline stop. `weigh` fires only on Rule candidates, which Pass 2 will make few.
- **It dissolves today's Gate A deadlock.** F059 stalled because Gate A held the scenario in `backlog/`, `review` refuses to run on `backlog/`, and `ticket` refuses without a review. Two of the three statements that caused it would have been Defaults needing no ratification at all.
- **The constitution becomes greppable and therefore countable.** `grep -rc '^\*\*Rule\.\*\*'` is an exact census. Today `grep "Intent (Ratified"` returns 69 and means nothing, because it mixes commitments with bets — which is the complaint the durability register opens with.
- **The two live examples from Pass 3 both resolve here.** Design principle 9 was written as a prohibition, shipped-against, and then agreed with by the PM — a Default whose `Depart when` was never written. The no-photo card rule was overridden inside a day — a Default that had been filed as a prohibition. Neither needed a memo; both needed a field.
- **Honest cost:** ~120 marked statements to triage across Passes 2 and 3. **The launch moving out two months is what makes retroactive migration affordable** rather than migrate-on-touch, and retroactive is the only version that produces an accurate census at the end.

---

## 6. PM calls before Pass 2

1. **"Default" or "Guideline"** as the marker word. Recommendation above; either works.
2. **Retroactive or on-touch.** Recommendation: **retroactive**, given the new date. On-touch leaves the census wrong for months, which is the condition being fixed.
3. **Does `Depart when` become mandatory on all 35 existing pattern entries?** Recommendation: yes — it is the field that does the triage work, and skipping it keeps the ambiguity.
4. **Two levels, or a third for pure taste?** Recommendation: two. Unmarked prose already covers taste, and a third level is where "small vocabulary" starts slipping.
