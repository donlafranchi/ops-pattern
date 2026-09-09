---
purpose: Priced — a Page owner posts to its followers, one way, no replies. Two versions at two prices; the cheap one does not solve the problem it is motivated by.
layer: how
status: awaiting-ruling
---

# Bulletins — priced

**A Page owner posts to the people who follow that Page. One-way broadcast. No replies, no threads, no inbox.**

**Correctly separated from messaging.** Messaging does not exist here — no messages, threads, or comments table anywhere — and building it is weeks. **Bulletins are not a step toward it and must not become one.**

## What already exists

- **The audience does not exist.** *Corrected 2026-09-07:* I said followers of a Page are membership rows. **Nothing writes a Page follow at all** — the follow button on a Page is a stub whose own comment says the substrate is absent. **So "who follows this Page" has no answer today**, and that makes the follows simplification a hard prerequisite rather than a tidiness concern. See [`decision-one-follows-table.md`](decision-one-follows-table.md).
- **No delivery substrate of any kind.** No email send, no push, no notifications table. **Correctly out of scope, and it is the crux — see below.**

## Version A — the Page carries it. ~1 day.

A small table, an action handler, a plain composer, and a section on the Page. **Four things, which is why it is a day and not half.**

**The problem: a follower only sees it if they happen to visit the Page.**

**So Version A does not solve the retention problem that motivates it.** The owner posts and nothing reaches anybody. **A broadcast that reaches nobody is worse than no broadcast** — it teaches the owner that posting is pointless, which is the opposite of giving them a reason to come back.

**Stated plainly because the price is tempting and the mechanism is what fails, not the cost.**

## Version B — it lands in the follower's feed. ~2 days.

Version A plus a second source in the home feed and a card for it.

**This is the version that does the thing.** A follower opens the app and sees that someone they follow posted. **No delivery substrate needed — the feed *is* the delivery.**

**The cost is a union in the feed function and one card type.** The feed today is a single RPC over the item index; bulletins are not Items and should not become Items — **making a bulletin an Item would buy the feed for free and pollute browse with announcements**, and browse was just narrowed to Pages and gatherings on purpose.

## Reactions — approved, and they do not come free

**The response path being built for RSVP does not extend to bulletins**, and the reason is one line: **`item_responses` has a foreign key to `items`, and a bulletin is not an Item.**

**Making a bulletin an Item to get reactions free is the same trap as making it an Item to get the feed free** — it would put announcements into the browse index that was just narrowed to Pages and gatherings.

**So: same pattern, different table.** A small `bulletin_responses` with the same shape and the same unique constraint per person. **The handler shape, the button component, the count-not-taps discipline and the accessibility work all copy across** — which is why the increment is small.

**Increment: about a quarter of a day**, on top of the two.

**One reaction only.** No types, no like economy, no ranking of anyone against anyone. **The owner learns what landed; nobody gets a score.**

### The owner sees the count, not who — and that is both cheaper and right

- **Cheaper:** a count is one aggregate on a page the owner already loads. *Who* is a list surface, with its own empty state, ordering and pagination.
- **Right, and this is the stronger reason:** *who reacted* is a list of named people attached to their behaviour, handed to someone with an audience. **A member reacting to a bulletin is telling the owner "this landed," not consenting to be enumerated.**
- **A count is the audience answering. A roster is surveillance of the audience.** Same tap, two different products.

## Recommendation

**Version B or nothing. Not launch scope at 2 days; a strong first candidate for the week after.**

**Reasoning:** the retention argument is real and nobody has addressed it — a Page owner currently has no reason to return once their Page exists. **But Version A buys the appearance of solving it and none of the substance**, and shipping the cheap half would make the expensive half look already done.

**If it goes in, take the whole 2 days.** If it does not fit, **it is the strongest thing to put behind a not-built-yet tap** and let owners tell us whether they want it.

## Not scoped

Editing or deleting a bulletin after posting, character limits beyond a sane maximum, scheduling, segmentation, read receipts, any count of who saw it. **Each of those is how a one-way broadcast turns into a product.**
