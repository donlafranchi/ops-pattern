---
id: F072
title: A Page owner posts
status: draft
date: 2026-09-13
depends: [F059, F065]
supersedes: F066
---
## Story

Maya's bakery has eleven followers and nothing to say until Thursday, when the sourdough is back. She taps Post an update, writes two sentences, posts. She leaves the switch where it sits, on anyone, and it appears at the top of her Page and in browse, where a stranger who has never heard of her can find it. Next week she flips it the other way for something only her regulars would care about. It is not a listing: no price, nothing to buy, just the bakery saying a thing. The next morning she spots a typo and fixes it in place; the post stays the same post.

## Acceptance

1. Only a Page's managing role can post or edit it afterwards; anyone else sees no control and a direct write is refused. An edit happens **in place** and the post stays the same post. **Deleting is refused.**
2. A post appears on its Page **and in browse**.
3. The composer carries **one switch for who it reaches**, defaulting to anyone. The words name the people, never a kind of post, and **neither "announcement" nor "bulletin" appears in any label.** Beside the restricted setting sits a live count of the people it would reach, and **at zero that count reads as words, never as "0".**
4. A post renders as coming from the Page, not as a listing: no price, no buy control, no listing chrome.
5. A post that fails to save leaves nothing behind — no half-made post on the Page, in browse, or in its Page's history.

## Not this

Times on a post — that is F073, and this scenario's posts carry none. Replies, threads, comments, or any inbox. Scheduling or sending to a subset. Images. Responses and any reaction count, which are F063. An edit history or a visible "edited" marker — not ruled on either way.

**Criterion 2 is narrower than it was, and the narrowing is the cut that paid for recurrence** *(2026-09-20)*. It used to say a post also appears *"in the feed of every follower and every Group member."* **That delivery half is what "Bulletins" names on the roadmap, and it is what left the launch list** — not the composer, and not posts in browse, both of which stay. `surfaces.md` had already priced it: *"the feed function takes no follow input — this is the missing half, and it is larger than the composer."* **Nothing built is discarded**: `group_memberships` carries the subscription link and nothing reads it yet. **What a Page owner loses is reach to people who already follow them**; what they keep is being findable by strangers, which is the half *What's happening…* runs on.

**Criterion 3 is new, 2026-09-21, and two of its three parts have no substrate.** *Announcement is the word everywhere* (Don, same day), so the switch labels people rather than naming a kind of post. **`page_posts` has nowhere to record the audience** — its columns are `id`, `group_id`, `body`, `starts_at`, `location_id`, `lifecycle_state`, `discoverability`, `dissolved_at`, `created_at`, `updated_at`, `parent_post_id`, and that is all of them. **`discoverability` is the near-miss and is not the field**: it answers *can this be found*, `browse_feed` already reads it that way, and a `private` post is hidden from everyone rather than delivered to anyone. **The restricted setting also needs the delivery half, which sits in `ROADMAP.md` § Cut** — recorded here as a dependency.

**Build sequencing, which the switch permits.** The anyone setting is complete against what exists plus F059's wiring. **The restricted setting may be visible before delivery exists, but not selectable-and-postable** — a creator who addresses forty-two people none of whom receive it has been told something untrue by the composer. Visible with its reason shown is honest; silently inert is not. At launch most Pages have nobody getting updates, so the reason shown is the true one either way.

**Criterion 2 is not verifiable until Explore reads `browse_feed`, which is why `depends:` gained F059** *(2026-09-20)*. The function is live in production with **no caller** — Explore still reads the old Item-grain view client-side, so a `page_posts` row cannot surface there today however correctly it is written. **That wiring is F059's remaining half, not new scope**, but this scenario cannot pass without it.

**Supersedes F066** *(2026-09-13)*. Two of F066's criteria were contradicted by later rulings — it said a post appears *"never in browse or search"*, and that the owner sees *"a count and no identities, ever."* Both are reversed above.
