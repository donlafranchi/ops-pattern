---
id: vocabulary-proposal
title: Proposed vocabulary for local kinds
status: draft
date: 2026-09-17
---

# Naming the model so it stops drifting

**2026-09-15. A proposal. Nothing renamed, nothing migrated.**

Don's brief: *"Item is too vague of a word. Creators will create pages for whatever Kind they are creating. The page is the organizing entity for other tools and features. If a person has a business where they sell products they could potentially list those as 'Items' etc. What do we need to change to remove this confusion so it never happens again when we have hundreds of employees."*

**Two asks in that, and the second is the bigger one.** The naming is a day's work. Preventing recurrence is a mechanism, and this document argues the mechanism matters more than the words.

---

## 1 · The layers, named

| Layer | Name | Status |
|---|---|---|
| The organizing entity a person creates | **Page** | Settled, `nouns.md`. Unchanged. |
| What they are starting | **Page kind** | Exists as `groups.kind`. Keep the name. |
| What a Page kind offers | **Tools** | Don's own word, 2026-09-15. New, and deliberately not a noun in the schema. |
| The typed things under a Page | *(see § 3)* | The word in dispute. |
| One specific type | **Its own name** — Product, Service, Event, Idea, Offer, Ask, Initiative | Already settled in `item.md` as UI labels. |
| A product offered for sale | **Item** | **Reserved for this, and only this.** |

**The cold-read test each of these passes:** a new employee reads "a Page has a kind, and its kind decides which tools it has" and is not wrong about anything.

---

> **The bare-term rule is now ratified and lives in `product/foundation/nouns.md` § A vague term is never used by itself.** It is not restated here. This document is the proposal behind it; the rule itself has one home.

## 2 · "Item" is reserved, not retired

**Don's sense wins: an Item is a product someone lists for sale.** Not a gathering, not an idea, not an ask.

**So "item" is banned as an umbrella, in prose and in product language, permanently.** That ban is the whole point — the word is comfortable, which is why it leaked into places where a specific type was meant. **A term that is pleasant to reach for and means seven things is a defect, not a convenience.**

---

## 3 · The umbrella — candidates, and why six lose

**The winner: `page_entries`, with "entry" lowercase and descriptive in prose. Never a capitalised noun anyone is taught.**

| Candidate | Verdict |
|---|---|
| **Item** | **Rejected.** Don's own objection, and it is needed for the narrow sense. |
| **Listing** | **Rejected — collides with a ratified ruling.** `model.md` says an offering is *"not a separately listed thing that browse indexes."* The word is contested at the model level, and an ask or an idea is not a listing in any ordinary sense. |
| **Offering** | **Rejected — fatal collision.** `offer` is already one of the seven types. An umbrella that shares a name with one of its members is the exact bug being fixed. |
| **Declaration** | **Rejected on the cold-read test.** Nobody guesses that "declarations" covers a loaf of sourdough and a run club. It also collides with legal and tax usage in a product that already refuses legal language in copy. |
| **Content** | **Rejected — collides with moderation vocabulary in force.** [member-content-takedown] and F078 both use "member-contributed content" with a specific meaning. |
| **Post** | **Rejected — collides with `page_posts`**, and a post is arguably one of the types rather than the category. |
| **Record** | **Rejected.** Collides with database vocabulary in every sentence an engineer writes. |
| **`page_entries` / entry** | **Proposed.** Cold-reads correctly ("the entries under a Page"), collides with no type name and no ratified noun, and still reads right when an eighth type is added. The mild overlap with log "entries" is already owned by the `*_events` tables, which are named for it. |

**And the design point behind the choice: the umbrella should be slightly uncomfortable.** "Item" leaked because it was a pleasure to write. An umbrella nobody enjoys reaching for is one people replace with the specific type, which is what the prose should say anyway.

---

## 4 · How the model changes

**Position: do not merge the two `kind` vocabularies. Make their relationship explicit instead.**

Today there are two, and they are not the same kind of thing:

- **`groups.kind`** — `place · interest · practice · event_anchored · family · business`. What someone is running.
- **`items.kind`** — `product · service · gathering · wonder · offer · ask · initiative`. What sits under it.

**Merging them would be wrong, and Don's own two rulings say why.** *"We can create a page for every kind. It just doesn't require all of the same tools."* **The Page kind is the classification; the types under it are what the tools produce.** Those are different layers, and collapsing them would mean a business that hosts one gathering has changed kind — which contradicts the ratified refusal that a Page never converts into another Page.

**What changes is that the relationship becomes written down and enforced:**

**A Page kind maps to the set of entry types its tools can produce.** That mapping does not exist anywhere today — not in the schema, not in a doc. It is the missing piece that makes "it just doesn't require all of the same tools" a fact rather than an intention. It should start as configuration in one file, not a table: it is a product decision that will change, and a migration per change is the wrong cost.

**Consequences worth stating:**

- **`groups.kind`'s six values need revisiting against Don's ruling that every kind gets a Page.** A one-time gathering fits none of the six cleanly, and `model.md` already records the same gap for a farmers market — *"a market that convenes commercial vendors without selling anything itself fits none of them cleanly. Raised, not ruled."*
- **`page_posts` gets its answer from this.** Announcing is a tool every Page kind has. Whether an announcement is an entry type or a separate table is then a schema question with a clear frame, not an open model question.
- **Nothing about the seven types changes.** They keep their sub-tables, their fields and their UI labels.

---

## 5 · Why it happened, and what stops it at a hundred employees

**A rename prevents nothing. Here is the honest cause.**

**An agent summarised `model.md` into a banner at the top of `nouns.md` — "there are no Items, and a post carries a time or it doesn't" — and the summary acquired the authority of the thing it summarised.** Later agents, including me, read the banner and treated it as a ruling. `model.md`'s actual passage is mostly about what browse indexes; the banner turned it into a claim about the substrate. **Nobody lied and nothing was malicious. A summary sat in an authoritative position and was read as the source.**

**That is the failure mode to design against, and it scales badly: one person can remember which lines are summaries; a hundred cannot.**

### Three mechanisms, in order of value

**1 · One term, one definition, one place. `nouns.md` is the authority and nothing else defines a term.**
Every other document *references*. A doc that redefines a term is the bug. This is the existing "a concept lives in exactly one place" rule applied to vocabulary specifically, which is where it has never been applied.

**2 · A summary is marked as a summary and is never citable.**
Any paraphrase of another document carries a visible marker and the sentence *"Not a ruling. Cite the source or a `DECISIONS.md` line."* **Only the source document and dated decision lines are citable.** The `nouns.md` banner would have been harmless with that marker on it.

**3 · The vocabulary check — extending the lint already specified.**
`nouns.md` § The user-facing string check already fails the build on person-nouns, em dashes, "corner" and corporate transitions in user-facing strings. **Three additions:**

| Check | Catches | Tier |
|---|---|---|
| **Banned umbrella** | `item` / `items` used as an umbrella in docs and prose, outside the reserved product-for-sale sense and outside schema identifiers | fail |
| **Undefined term** | A capitalised model noun in a doc that has no entry in `nouns.md` | fail |
| **Redefinition** | A doc containing a definition sentence for a term `nouns.md` already defines | warn, human look |

The first two are mechanical. **The third is the one that would have caught this drift**, and it is a warn rather than a fail because a definition is hard to detect without false positives.

**What no check catches:** a summary that is accurate today and wrong after the source changes. Mechanism 2 is the only defence, and it is a discipline, not a test.

---

## 6 · Cost, and what waits

**Cheap — do now, one session each.**
Reserve "Item" in `nouns.md` and write the layer table. Mark every summary banner in the repo, starting with the one that caused this. Write the Page-kind-to-tools mapping as configuration.

**Moderate — worth doing before launch.**
The vocabulary check, extending the lint already specified but unbuilt. **The person-noun check is still unbuilt after being specified twice**, which is the argument for doing them together rather than queueing another.

**Expensive — after launch, or never.**
The schema rename of `items` to `page_entries`: 11 tables, 39 indexes, 14 policies, 15 functions, 3 views, 651 occurrences across 47 migrations, plus 101 source files and 51 test files. **Its cost is roughly flat over time**, so there is no urgency premium. **And the user-facing collision it would fix does not exist** — `item.md` already rules that "Item" never reaches a member, so no member will ever meet the ambiguity. **The confusion is internal, and mechanisms 1–3 fix internal confusion more cheaply than a migration does.**

**Recommendation: reserve the word and build the checks now; defer the schema rename indefinitely and revisit only if the internal confusion survives the checks.**
