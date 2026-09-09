---
purpose: Scenario — the rules of the verb "post a bulletin". One-way broadcast from a Page to its followers, landing in their feed. Not messaging.
layer: how
status: backlog
---

# F066: A Page owner posts to its followers

> **Written and reviewed, deliberately not advanced.** The guard rails for this verb are settled; **the build is not authorised.** This scenario sits in the draft lane because **lane membership is the state and an approved scenario is one the build agent may pick up.** It is not unfinished — it is unscheduled.
>
> **It also has a hard dependency: [F065](scenario-F065-someone-follows-something.md).** The audience for a bulletin is *who follows this Page*, and **that has no substrate at all today** — not fragmented, absent. **This cannot be built first at any price.**

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 8 (Follow what you love), 9 (Make a living locally)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
**Primitive shape:** Page → bulletin → its followers' feeds. **Not an Item.**
**Spec contract:** [`decision-bulletins.md`](decision-bulletins.md) · [`decision-one-follows-table.md`](decision-one-follows-table.md)
**Status:** backlog — **written and reviewed 2026-09-07; held pending scheduling.**

## The verb's rules

| | |
|---|---|
| **Who can do it** | The managing role of the Page — owner for a business, steward otherwise. **Followers cannot post. Members who are not managers cannot post.** |
| **To what** | The Page's own followers. **No other audience is addressable.** |
| **How many times** | Unlimited, and deliberately unthrottled at launch. *(If it becomes a firehose that is a real problem with real evidence, which is better than a limit invented now.)* |
| **What it changes** | A post appears in each follower's feed and on the Page. |
| **What it does not change** | Nothing about the follower's relationship to the Page, and nothing about what the Page can see about them beyond a count. |

### What a bulletin deliberately is not — the guard rail

**This is one-way broadcast and every refusal below exists to stop it becoming messaging:**

- **No replies.** No threads, no comments, no inbox, no direct messages.
- **No delivery outside the app.** No email, no push. **There is no notification substrate and this does not build one** — the feed *is* the delivery.
- **Not an Item.** *(Making a bulletin an Item would buy the feed and reactions for free and put announcements into a browse index that was just narrowed to Pages and gatherings on purpose. The free thing is the wrong thing.)*
- **No roster of who reacted.** The owner sees a count.
- **No segmentation, scheduling, read receipts, or open rates.** *(Each is how a neighbourhood broadcast becomes a marketing tool.)*

> **Intent (Ratified 2026-09-07).** **A count is the audience answering. A roster is surveillance of the audience.** Same tap, two different products. A member reacting is telling the owner *this landed* — not consenting to be enumerated by someone who has an audience and whose goodwill they may depend on.

## Amended 2026-09-08 — the PM described this directly

> *"A post is a section at the top of the Page that announces something — an upcoming sale, an event, an appearance. People interact with it simply: a like, an 'I'll be there', or a small set of one-click options."*

**Three changes to the scope above:**

1. **The primary surface is a section at the top of the Page**, not the feed. **The feed placement stays** — it is what reaches people who are not looking — **but the Page section is where a post lives**, and it is the cheaper half. *(A Page with a current announcement at the top is a Page worth returning to.)*
2. **The audience is followers *and* members** — one query, two words, per [F067](scenario-F067-a-follower-and-a-member-are-different-things.md).
3. **Interaction is a small fixed set, chosen by the post, not a single reaction.**

### The interaction set — fixed is cheaper and right at launch

**A fixed set per post kind, not an author-defined one:**

- An announcement takes **a like** — *"noticed."*
- Something with a date or a place takes **"I'll be there."**

**Author-defined options are a poll, and a poll needs an options table, a composer step and a results surface.** *(That is the [message-board](decision-page-as-message-board.md) increment, and the response row already carries the nullable option column that makes it an extension.)*

**So: fixed now, author-defined later, same substrate.** **The cost of fixed is one column on the response row; the cost of author-defined is a table and a step.**

**One thing the fixed set must not become: a reaction palette.** Two options that mean something beat six that mean nothing, and a spread of faces is an engagement mechanic wearing a friendly costume.

## The Person

Maya's bakery Page exists and eleven people follow it. **She has no reason to open the app again.** She has something to say on Thursday — the sourdough is back, the Saturday stall moved — and nowhere to say it.

## The Story

From her Page, Maya taps **Post an update**, types two sentences, and posts.

**Rae opens the app and sees it in her feed**, between a gathering and a Page she follows — **marked as coming from the bakery, not dressed as a listing.**

Rae taps the one reaction. **Maya sees the count go to four.** She does not see who, and Rae was not asked to be seen.

Maya taps the reaction on her own bulletin out of curiosity. It counts once, like anyone.

## Data captured

**One table, and its name is `page_posts` — not `bulletins`.** *(A table called `bulletins` invites a second one called `posts` six weeks later. The Page is the board; a bulletin is the first kind of thing posted to it.)*

**Three columns exist from the first migration and decide whether the message board is an extension or a rewrite:**

| Column | At launch | Why it must be there now |
|---|---|---|
| `parent_post_id` — nullable self-reference | **Always null.** Nothing writes it. | **A reply is a post with a parent.** Adding this later means a migration plus a rewrite of every read path to handle a tree where it assumed a list. **This is the load-bearing one.** |
| `author_member_id` | Always the Page's manager, enforced **in the handler** | **The schema must not assume the author is the owner.** Member posting relaxes a handler check; it must never need a column added. |
| `kind` — `'bulletin'` now, `'post'` and `'poll'` later | `'bulletin'` only | Free now; a CHECK-constraint migration later, applied to production by hand. |

**Plus `page_post_responses`** — post, member, kind, **and a nullable `option_id`.** Reactions today; **a poll vote is the same row with an option set**, so polling extends rather than replaces.

**Everything else stays as scoped.** The audience is members, the handler restricts posting to the managing role, replies are unreachable, and the read path returns a flat list. **The board relaxes rules; it does not restructure data.**

*(Table names above amended 2026-09-08 to make the Page-as-message-board an extension. See [`decision-page-as-message-board.md`](decision-page-as-message-board.md).)*

**Reactions do not reuse the item response table.** It has a foreign key to items and a bulletin is not an item. **Same pattern, different table** — the handler shape, the control, the count-not-taps discipline and the accessibility work all copy across, which is why the increment is small and why this is not an argument for making bulletins Items.

## Acceptance criteria

**Given** the managing role of a Page
**When** they post a bulletin
**Then** it is written with its event row in the same transaction and appears on the Page.

**Given** a member who follows that Page
**When** their feed renders
**Then** the bulletin appears in it, **visually distinct from a listing and attributed to the Page.**

**Given** a member who does **not** follow the Page
**When** their feed renders
**Then** the bulletin is absent. **A bulletin is never a discovery surface** — it does not enter browse, search, or the map.

**Given** a member who is a follower but not a manager
**When** they attempt to post
**Then** refused. **Given** a member who is a manager, **then** allowed. *(Role, not membership — see [F065](scenario-F065-someone-follows-something.md).)*

**Given** any member
**When** they react
**Then** one per person, enforced by constraint; a second is a no-op.

**Given** the Page's owner
**When** they view a bulletin
**Then** they see **a count and no identities**, and no surface anywhere exposes who reacted.

**Given** anyone at all
**When** they look for a way to reply
**Then** **there is none.**

## Out of scope

Editing or deleting after posting, character limits beyond a sane maximum, drafts, scheduling, segmentation, attachments, images. **Images are the one worth naming: a bulletin with a photo needs the upload path, the metadata strip and the takedown route — that is a separate scenario, not a field.**

## Capabilities unlocked

- **A Page owner has a reason to come back**, which is the retention problem nobody has addressed.
- Following becomes worth doing — today it delivers nothing.
