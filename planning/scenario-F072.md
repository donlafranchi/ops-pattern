---
id: F072
title: A Page owner posts
status: draft
date: 2026-09-13
depends: [F065]
supersedes: F066
---
## Story

Maya's bakery has eleven followers and nothing to say to them until Thursday, when the sourdough is back. She taps Post an update, writes two sentences, posts. It appears at the top of her Page, in the feed of everyone who follows her and everyone in her Group, and in browse — where a stranger who has never heard of her can find it. Rae gives it a thumbs up; Maya sees Rae's name, and anyone looking sees the count.

## Acceptance

1. Only a Page's managing role can post; a member without that role gets no control and a direct write is refused.
2. A post appears on its Page and **in browse**. **It is not delivered to a follower's or a group member's feed** — that half is the Bulletins cut of 2026-09-20 and is out of the launch list.
3. A post is stored in `page_posts`, which carries a nullable reference to a parent post from its first migration.
4. A post can be edited **in place** after posting, by its Page's managing role only; the row keeps its id. **Deleting is refused** — no control exists and a direct write is refused.
5. A post renders as coming from the Page, not as a listing: no price, no buy control, no listing chrome.
6. Posting writes the post row and its event row in the same transaction; neither exists without the other.

## Not this

Times on a post — that is F073, and this scenario's posts carry none. Replies, threads, comments, or any inbox. Scheduling or sending to a subset. Images. Responses, which are F063. An edit history or a visible "edited" marker — not ruled on either way.

**Criterion 2 was narrowed 2026-09-20, and the narrowing is the cut that paid for recurrence.** It used to say a post also appears *"in the feed of every follower and every Group member."* **That delivery half is what "Bulletins" names on the roadmap, and it is what left the launch list** — not the composer, and not posts in browse, both of which stay. **Nothing built is thrown away**: the registry records that `group_memberships` carries the subscription link and *nothing yet reads those rows to show a subscriber their updates*, so the cut removes unbuilt work. **What a Page owner loses is reach to people who already follow them**; what they keep is being findable by strangers, which is the half *What's happening…* depends on.

**Supersedes F066** *(2026-09-13)*. Two of F066's criteria were contradicted by later rulings — it said a post appears *"never in browse or search"*, and that the owner sees *"a count and no identities, ever."* Both are reversed above.
