---
id: F088
title: Nothing fits, so the app explains itself and asks what is missing
status: draft
date: 2026-09-15
depends: [F064, F087]
---
## Story

Dana is starting something and none of the labels are hers. She taps Other. Instead of a text box, she gets a page that explains what each kind of thing lets you do — this one can sell, this one repeats, this one happens once and is over. She reads it and realises the second one is close enough, goes back, and picks it. Ravi reads the same page and none of it is right, so he writes a couple of sentences about what he is actually trying to run. Neither of them is told a date, a plan, or where they sit in a queue.

## Acceptance

1. **"Other" stores nothing on the Page.** No kind value, no column, no flag. It opens the explainer, and a person leaves it having picked a real kind or having created nothing.
2. **The explainer describes each kind by what a person can do with it**, not by an internal name. **No occurrence of `community`, `business`, `event`, `family`, or any schema value appears on the page.**
3. **No tool appears on the explainer that the tools mapping does not give that kind, and none the mapping does give is omitted.** The page and `product/systems/page-kind-tools.md` cannot disagree.
4. **Both exits are one step and neither is a dead end:** pick a kind and carry on creating, or describe what is needed in the person's own words and carry on.
5. **What is captured is one row in F064's existing signal table** — the label they typed, what they described, and which kind they picked afterwards if any — tagged with its source. **No second table is created.**
6. **No copy in this flow implies a date, a plan, a queue position, or a reply.** *(Inherits F064 criterion 3.)*

## Not this

Writing the explainer copy — Don writes it; this scenario says what it must convey. A second signal table. An admin screen for any queue. A public "most requested" surface. Any promise of a reply.

## Why

### The triage is the point, not the form

**A capture nobody reads is "Something else" again, and this project retired that on 2026-09-13 because its rows sat unread.** So the reader and the cadence are part of the scenario, not an afterthought.

**Who reads it:** the same person who approves search-dictionary entries. **When:** whenever they do that — one sitting, not a second habit to form. **Two outcomes, and the first is the common one:**

- **Already covered by a kind that exists.** **The fix is a new label, not a new kind.** If three people describe a thing the product already does, that is a labelling failure, and the label layer makes fixing it one row. **This is the outcome that should feel like progress, not like a dismissal.**
- **A genuine gap.** It becomes a scenario, through the ordinary path. Nothing here shortcuts that.

### When it is not about kinds at all

**Some of what arrives will be a bug report, a complaint, or a question. Say so and move on.** The row is acknowledged the same way as any other — once, with no reply implied — and closed. **It is not routed, not answered, and not forwarded**, because there is no support inbox and F064 criterion 3 already forbids implying one exists. **A person who needs an answer has the report path; this is not it.**

### One queue, not three

**Two queues with one person behind them is how both stop being read.**

There are two sources: **an unmapped label** and **this**. *(A third — zero-result searches — was proposed and then ruled out on 2026-09-15: Don's position is that there may genuinely be nothing, and saying so is an honest answer rather than a gap.)* **They are one queue with two sources, and the queue already exists** — F064's signal table is approved, ticketed as `socialus-web` #33, and its criterion 5 already gives the operator a ranked list grouped by subject with no screen built. **Adding a source column is smaller than building a second table, and much smaller than building a third.**

**They share an outcome shape:** each is a person using a word the product does not know yet, and each is resolved by adding vocabulary rather than by building. **The search dictionary's ratified mechanism — an agent proposes, a human approves — is the same mechanism both want**, and it survives the ruling above: the dictionary still grows from the tags creators create, it simply no longer treats an empty search as an input.

### Flagged: F064 criterion 1 is stale

**F064 is approved and its first criterion describes "Something else" and the twelve categories, both retired on 2026-09-13.** The scenario's other four criteria and its signal table are unaffected and are what this scenario depends on. **Criterion 1 needs rewriting or striking before F064 is built; ticket #33 would otherwise implement a retired field.**
