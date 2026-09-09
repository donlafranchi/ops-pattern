---
purpose: Ruled — the Page as the message board. Bulletins is increment one; the table is page_posts and the first migration carries the parent reference. Board increments are post-launch.
layer: how
status: ruled
---

# The Page as the message board

> **RULED 2026-09-09 — ratified as written.** The table is **`page_posts`, not `bulletins`.** The nullable **`parent_post_id`**, the real **`author_member_id`** and the **`kind`** column all land in the **first** migration.
>
> **The PM's reasoning, in his words: *"I never want to have to do a migration and a rewrite."*** That is the whole of the ruling — the three columns are free today and are what makes the board an increment instead of a rewrite.
>
> **What is ratified is the shape, not the schedule.** Bulletins stays where the 2026-09-08 scope cut put it: in scope, **audience is members not followers**, 2 days, unticketed. **Increment two (members reply) needs no further decision. Increment three (members start posts) still needs the operator concept**, which does not exist anywhere in the code.
>
> Log entry: [`../DECISIONS.md`](../DECISIONS.md) § 2026-09-09 — The Page is the message board.

**PM idea, 2026-09-08: coordination, messaging and polling happen on the Page rather than as separate direct-messaging infrastructure.**

**This is a much smaller thing than messaging, and that is the point.** Every time messaging has come up the answer has been *"nothing exists and it is weeks."* **A Page-scoped board has no inboxes, no direct messages and no per-pair threads** — **one board per Page, scoped to its members.** The membership row that defines the audience already exists and is already read.

## The time-sensitive answer: bulletins is increment one

**A bulletin is a post on the board that members cannot reply to yet.** Not a separate mechanism. **Nothing is thrown away — provided three columns land in the first migration.**

| Column | At launch | Why now and not later |
|---|---|---|
| **`parent_post_id`** — nullable self-reference | **Always null** | **A reply is a post with a parent.** Adding it later is a migration *plus* a rewrite of every read path that assumed a flat list. **This is the one that decides extension versus rewrite.** |
| **`author_member_id`** | Always the managing role, **enforced in the handler** | The schema must not encode *the author is the owner*. **Member posting then relaxes a check rather than adding a column.** |
| **`kind`** — `'bulletin'` now | `'bulletin'` only | A CHECK-constraint change later is a hand-applied production migration. Free today. |

**And name the table `page_posts`, not `bulletins`.** A table called `bulletins` invites a second one called `posts`. **The Page is the board; a bulletin is the first kind of thing posted to it.**

**Responses: `page_post_responses` with a nullable `option_id`.** A reaction today; **a poll vote is the same row pointing at an option.**

**Nothing else about the bulletin scope changes.** Audience is members, only the manager may post, replies are unreachable, the read path is flat. **The board relaxes rules. It does not restructure data.**

## The board — cheapest honest version

**Posts on a Page, visible to members, with replies.** That is it. One level of reply, not a tree — **a nested thread is a different product and needs moderation tools that do not exist.**

**No inbox, no unread state, no mentions, no notifications.** The board is a place you go, not a thing that arrives. *(There is no notification substrate; the feed is the only delivery mechanism this product has.)*

## Who can post — the ordering that keeps moderation tractable

**Owner-only is a noticeboard. Member-posting is a forum.** They are different products, and the difference is not the code — **it is that member-authored text visible to a group needs a removal path, and there is no operator concept anywhere in the code.** No role, no flag, no check. The report path is scoped to items and photos.

**Proposed order, and the reasoning is moderation rather than effort:**

1. **Launch — bulletins.** Manager posts, members read and react.
2. **Board increment one — members reply.** **A reply is bounded by an existing post, and the post's author is a natural first moderator** — they can remove replies to their own post. That is a removal path that needs no operator.
3. **Board increment two — members start posts.** **Needs the operator concept, or an explicit decision that Page managers moderate their own board and that is enough.** Do not ship this before that decision.

**Increment one is where most of the value is.** A member who can reply to *"we're meeting Thursday"* with *"can't make it, is next week on?"* has the coordination Don is describing.

## Polling — same principle, separate substrate, and the distinction matters

**A poll on a Page is the demand-signal idea in a third costume — *do people want this?*** — alongside the category *Other* capture and the idea mechanic. **The principle is already written down** as decision 18: *demand is measured before it is built.*

**But the substrate should not be shared, and the reason is precise:**

| | Demand signals | A poll |
|---|---|---|
| Subject | **Does not exist as a row.** A category nobody has created; a feature nobody has built | **Is a row.** An option the asker wrote |
| Key | Text, **deliberately no foreign key** | A real foreign key, with cascade |
| Option space | **Unbounded** — anyone can type anything | **Bounded** — defined by whoever asked |
| Who defines it | The respondent | The asker |

**Shared principle, separate table.** Merging them would give the demand-signal table a foreign key it must not have, or give polls a text key that loses referential integrity. **The idea is the same; the shapes are opposites.**

**A poll is `page_posts.kind='poll'` plus `page_post_options` plus the existing response table.** Roughly a day on top of the board, because the substrate is already the right shape.

## What it does to the verb matrix — four new verbs

**Post · Reply · Poll · Vote.** None has a cell today.

**And one existing cell changes meaning: `message`.** Today it reads *"nothing exists"* across every noun. **Under this proposal it becomes: forbidden between people, available inside a Page.** That is a better answer than the current one, and it is the honest description of what this product is — **not an anonymous internet platform, a know-and-support-your-community platform.** Conversation scoped to a group you joined is the structural version of that sentence.

## Does the volunteer blocker move? Partly — and be precise

**Yes for group-scoped volunteering.** An ask posted on a Page has a reply channel the moment increment one ships. *"We need hands Saturday"* → *"I can come."* **That is the whole loop, and it needs no messaging.**

**No for open volunteering.** An ask from someone with no Page, or one that should reach beyond a group's members, still has nowhere to land. **The board does not solve reaching strangers; it solves talking to people who already joined.**

**So the honest statement: volunteering becomes tractable *inside a group* and stays blocked *across the neighbourhood.*** **Not scoped in. Flagged, because the blocker genuinely moved and the deferral reasoning should be updated when this is next discussed.**

## Scope

**Post-launch. Not proposed for the 12.5 days of slack.** The whole purpose of this document is that **the three columns above cost nothing today and save a rewrite later.**

**If bulletins ships with `page_posts`, a nullable parent, a real author column and a kind, then the board is an increment.** **If it ships as a `bulletins` table with an implied author and no parent, it is a rewrite.** That is the entire decision, and it is due before the migration is written — not before the feature is scheduled.

> **Answered 2026-09-09: the first form.** `page_posts`, nullable parent, real author column, kind. **The ticket that writes the bulletins migration inherits this as a constraint, not a preference** — a migration that omits the parent reference is a deviation and should be escalated rather than shipped.
