---
id: items-question
title: Whether Items are retired — disputed and unsettled
status: open
date: 2026-09-17
---

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

## Don's model, stated 2026-09-15

> **"Pages are built from kind.items"**

**Items and their kinds are foundational, not legacy.** The kind system is the substrate a Page is composed from — not a parallel listing concept that a post model replaces. **`page_posts` is therefore not a replacement for items.** Whatever it is, it sits alongside or on top of them, and that relationship needs stating rather than assuming.

---

## The code, which nobody can argue with

**Yes — a Page is composed from items in the current schema, explicitly and with intent.**

- **`items.group_id` references `groups(id)`.** A Page is a `groups` row; items point at it. That link is the composition.
- **There is a dedicated index for it:** `idx_items_group_active on public.items (group_id) where deleted_at is null and group_id is not null`. Somebody built for reading a Page's items.
- **The publication rule is written in terms of it.** The RLS policy comment reads: *"anon + auth see published, non-deleted Items where the Item is either standalone (`group_id IS NULL`) or filed under a listed non-dissolved Group."* **Being filed under a Page is one of the two ways an item is public.**
- Twelve source files in `src/actions` and `src/app` read or write items by `group_id`.

**And `page_posts` is wired to nothing at all.**

- **No writer.** Nothing in `src` inserts, updates, or deletes a row.
- **No reader.** The only two mentions of `page_posts` anywhere outside its own migration are comments, and both say it does not exist: `browse-pages.ts` line 14 — *"but `page_posts` does not exist yet"* — and the `browse_pages` RPC's own description — *"Posts are NOT included: browse indexes them too, but page_posts does not exist yet."* **Both were written before the table landed and neither was updated.**
- **`browse_pages` reads `groups` joined to `locations` and `places`. It does not join `items` and it does not join `page_posts`.**
- The existing browse source, `discoverable_items`, is **item-grained** — keyed `unique_idx_discoverable_items (item_id)`.

**Correction to an earlier report:** I described `page_posts` as having "a table, a read path, and no writer." **It has neither a reader nor a writer.** The read path I counted was a comment saying the table did not exist.

**What `page_posts` says about itself**, from its migration, so Don can judge the intent behind it:

> *"OPTIONAL start time. Nullable is the point: an undated post is a first-class post, not a degraded event."*

> *"A post has no life independent of its Page."*

**That second line is compatible with "Pages are built from kind items."** A post that cannot exist without its Page is a component of a Page, which is the same shape as an item filed under one. **What is unstated is whether a post is a kind of item, a sibling of items, or a replacement for them** — the table has no reference to `items` in either direction.

---

## What in `model.md` actually contradicts "Pages are built from kind items"

**This is the distinction that matters, and it should not be blurred.** `model.md`'s passage does two different jobs, and only one of them touches the substrate.

### Compatible — these are about browse indexing, not about what a Page is made of

- *"It is not a separately listed thing that browse indexes."* — a claim about what browse returns.
- *"Browse indexes Pages and posts, not a catalogue of listings."* — browse.
- *"A specific occurrence is its own result, not a filter applied to its Page."* — browse results.
- The whole of § Browse is everything.

**All four are satisfiable with the kind system fully intact.** A Page can be built from kind items while browse returns Pages rather than a catalogue of those items. Those are different layers: what a thing is made of, and what a search gives back.

### Genuinely contradicting — these are substrate claims

- **"That pairing is retired: it depended on Items, which no longer exist."** *(§ What a Page is, 2026-09-12.)* **This is the one sentence in Don's own words that asserts the substrate is gone.** It is an existence claim, not a browse claim, and it is the sharpest evidence for the wider reading. Everything downstream rested on it.
- **"Hosting needs nothing new. A venue's calendar is posts with times, which the post mechanism already gives every organization."** *(§ Venue is not a noun.)* This competes at the mechanism level with `items.kind='gathering'` and `item_gatherings`. Not fatal — a calendar of posts and a gathering item could coexist — but it proposes posts where the kind system already has an answer.

### Not Don's words at all

- The banner atop `nouns.md` — *"there are no Items, and a post carries a time or it doesn't"* — **was written by an agent summarising `model.md`, not by Don.** It is the most absolute statement of the wider reading anywhere in the repo, and it has no authority behind it beyond the summary it was making.

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

## What Don has to settle — three questions, not one

**1. Does "which no longer exist" mean the substrate, or the catalogue?** His 2026-09-15 statement says the substrate stands. If that is what he meant all along, `model.md` § What a Page is needs one clarifying line and the rest of that document is untouched — everything else in it is about browse, and browse and substrate do not conflict.

**2. What is `page_posts`, given items are foundational?** It is an empty table wired to nothing, so this costs nothing to answer either way. Three readings the code permits, none of which it chooses between: a post is a kind of item; a post is a sibling of items, for announcements specifically; or `page_posts` was started as a replacement and should be dropped. **Its own comment — "a post has no life independent of its Page" — is compatible with all three.**

**3. Does hosting use posts or `kind='gathering'`?** `model.md` says a venue's calendar is posts with times. The kind system already has gatherings with dates and a recurrence rule. **Both cannot be the mechanism.**

## What is on hold until he rules

- `planning/ONE-MODEL.md` — the whole transition order rests on the wider reading.
- The claim, made 2026-09-15, that two models are live at once.
- Whether `item.md` is stale.
- Whether `page-kinds.md` survives at all. *(One criticism of it is unrelated to this question and stands either way: it duplicates `item.md`'s kind table.)*
