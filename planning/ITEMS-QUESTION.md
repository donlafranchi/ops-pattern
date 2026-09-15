# The Items question — for Don to settle

**2026-09-15. Nothing has been changed in code. This document exists so Don can read his own words and rule.**

## What actually happened, precisely

**No migration was applied. No code was changed. Not one commit was made to `socialus-web`.** All seven Item kinds and all four sub-tables are intact on `origin/main`, with working composers for product, service and gathering. The `items` table, `item_products`, `item_services`, `item_gatherings`, `item_wonders`, `item_locations`, `item_responses`, `item_tags`, `item_hashtags` and `item_events` are all present and unmodified.

**Only planning documents were touched, and all of it is restored:** `page-kinds.md` was deleted and is back; `nouns.md`'s amendment is reverted to its prior wording; `item.md`'s "superseded" banner now reads "in dispute". **Everything downstream of the retired-Items reading is pending, not settled.**

**Don's ruling that a Page can exist for every kind is NOT in dispute** — he gave it directly, it stands, and it is recorded in `nouns.md` and F087.

---

## The text, in full — Don's own words, 2026-09-10

> *From `product/foundation/model.md`, whose header reads: "The model, in Don's words. The document every other document answers to. Stated by Don, 2026-09-10. Where any other document disagrees with this one, this one is right and the other is the thing to fix."*

### The section itself

> ## There are no Items
>
> What a creator offers is described on their Page and in their posts. It is not a separately listed thing that browse indexes.
>
> A specific occurrence is its own result, not a filter applied to its Page — this Saturday's farmers market is the thing a finder gets back, at the place it happens. Browse indexes Pages and posts, not a catalogue of listings.

### The surrounding lines that were read alongside it

**From § What a Page is:**

> In Don's words (2026-09-12): **a Page is "an organizing entity for something that needs more than one of anything."**
>
> It replaces the older framing, "a Page is *who*; an Item is *what*." That pairing is retired: it depended on Items, which no longer exist, and it answered the wrong question.

**From § Venue is not a noun:**

> **Hosting needs nothing new.** A venue's calendar is posts with times, which the post mechanism already gives every organization.

**And the banner at the top of `nouns.md`, written by an agent, not by Don:**

> **Superseded in part by `model.md` (2026-09-10).** Don restated the model directly: there are no Items, and a post carries a time or it doesn't.

---

## What each document claims

| | `model.md` (Don, 2026-09-10) | `item.md` (undated, pre-09-10) |
|---|---|---|
| **The unit** | Pages and posts. "Browse indexes Pages and posts, not a catalogue of listings." | One `items` row varying by `kind`. |
| **Kinds** | Not mentioned. The word "kind" appears about `groups.kind` only. | Seven, each with a schema name, a UI label and a UI verb. |
| **Where an offering lives** | "described on their Page and in their posts" | An Item row of `kind='product'` or `'service'`. |
| **An occurrence** | "A specific occurrence is its own result" — a post with a time. | An Item of `kind='gathering'` with `starts_at`. |
| **Recurrence** | Not mentioned. `page_posts` has no recurrence column. | Fully designed: one row, `starts_at` holds the next occurrence, advanced by a rotation process. |

## Where they actually collide — and where they do not

**They collide on one thing: what browse indexes, and therefore what a listing is.** `model.md` says a creator's offering is *described* on a Page and in posts and is "not a separately listed thing that browse indexes." `item.md` says every declared thing is an indexed row. **Both cannot be true of the same offering at the same time.**

**They do not collide on kinds as a concept.** `model.md` never argues against kinds. It does not mention `wonder`, `offer`, `ask` or `initiative` at all, in any form. **Its argument is about the shape of what browse returns, not about whether a declared thing has a type.**

**What would have to be true for both to stand:** that "Items" in `model.md` means *separately-indexed listing rows* — the catalogue — and not *the kinds foundation*. Under that reading, `model.md` retires the catalogue and says an offering is described rather than listed, while `item.md`'s kind vocabulary survives and attaches to whatever the durable thing turns out to be. **The sentence "it depended on Items, which no longer exist" is the line that reading has to account for**, and it is the sharpest evidence for the wider reading.

**The honest summary: the wider reading is defensible from the text, and the narrower one is defensible from what the text is arguing about.** Only Don knows which he meant.

## The two possibilities, stated plainly

1. **He meant something narrower than the sentence reads** — the catalogue of separately-indexed listings goes, the kinds foundation stays. Then `item.md` needs its indexing claims corrected and its kind vocabulary kept, and `model.md` needs one clarifying line.
2. **The sentence has been read correctly and he has since changed his mind.** Then `model.md` needs a dated amendment saying so, and the transition plan in `ONE-MODEL.md` is withdrawn.

**Either is fine and both are his.** Nothing else should move until he says which.

## What is on hold until he rules

- `planning/ONE-MODEL.md` — the whole transition order rests on the wider reading.
- The claim in `WHERE-IT-IS.md` that two models are live at once.
- Whether `item.md` is stale.
- Whether `page-kinds.md` survives at all. *(One criticism of it is unrelated to this question and stands either way: it duplicates `item.md`'s kind table.)*
