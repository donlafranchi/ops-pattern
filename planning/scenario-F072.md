---
id: F072
title: A Page owner announces something, with a time on it
status: approved
date: 2026-09-13
depends: [F059, F065]
approved: 2026-09-21 — Don: "I need it built and composed." Composer, time, post address and the audience switch are one piece of work. Absorbs F073.
supersedes: F066, F073
amended: 2026-09-30 — Don: an optional end time; add-to-calendar and default alt text are launch scope. Criterion 6 added; the end time leaves Not this.
---
## Story

Maya's bakery has nothing to say until Thursday, when the sourdough is back. She taps Announce and writes two sentences. She adds Thursday, seven o'clock, and because the bread class is at the church hall rather than her own counter she types that address too. Under the box is a switch for who sees it, sitting on anyone, and she leaves it there. It appears at the top of her Page and in browse, where a member looking for what is on this week reads it, and a stranger sees that the bakery has announced something. Her Saturday "sourdough is back" post has no time at all, and it is no less a post for that. The next morning she fixes a typo in place, and it stays the same announcement.

## Acceptance

1. Only a Page's managing role can announce or edit it afterwards; anyone else sees no control and a direct write is refused. An edit happens **in place** and stays the same announcement. **Deleting is refused.**
2. An announcement appears on its Page **and in browse**, reading as coming from the Page and never as a listing — no price, no buy control, no listing chrome. **One whose start time has passed stops appearing in browse, with no manual cleanup.**
3. The composer takes an **optional date and time** and an **optional address of its own**. With a start time it is returned by a time-windowed read **to the hour, not only to the day**; with none it is still a first-class announcement and is never returned by a time-windowed read. With an address it reads as being there; with none, at its Page's location. **Times are the metro's, never the reader's and never the server's.**
4. The composer carries **one switch for who it reaches**, defaulting to anyone. The words name the people, never a kind of post, and **neither "announcement" nor "bulletin" appears in any label.** Beside the restricted setting sits a live count of the people it would reach, and **at zero that count reads as words, never as "0".**
5. An announcement that fails to save leaves nothing behind — no half-made row on the Page, in browse, or in its Page's history.
6. **An announcement or gathering may carry an optional end time**, after its start. One with a time offers **add-to-calendar**, and its image carries **default alt text built from its title, date and place**. The user-facing label for it stays **"Event"** (2026-09-30).

## Not this

**Recurrence, which is F074** — approved, separate, and not what is being built today. **No announcement renders on the map, dated or not** — the map shows Pages. Replies, threads, comments or any inbox. Scheduling, or sending to a subset. Images. Responses and any reaction count, which are F063. All-day events or multi-day spans. Timezone *selection* by a creator: times are the metro's, which is what criterion 3 says. An edit history or a visible "edited" marker — not ruled either way.

## Why

**Absorbs F073, on Don's instruction, 2026-09-21:** *"I don't need an answer. I need it built and composed. Just get that done."* **He treats the composer and the timestamp as one piece of work**, and the diagnosis that prompted it supports him: `page_posts.starts_at` is already `timestamptz` and indexed, `browse_feed` already compares both window bounds against it without truncating to a day, and the past-dated drop-out already works. **The write handler is the only gap** — `src/actions/group/post.ts` inserts six columns and deliberately skips `starts_at`, deferring to F073. So criterion 3 is one `zod` field, one column in an existing insert, and a composer input. **F073 is marked superseded rather than deleted**, so its approval trail survives; nothing it ruled is lost, and the post-level address stays per his "middle size" ruling of 2026-09-19.

**What criterion 3 still needs that does not exist.** **`timestamptz` normalises to UTC and discards the offset it was written with**, so nothing in the row remembers that seven o'clock meant seven in Sacramento. Rendering with the reader's browser zone shows a Sacramento evening as a New York night. **The metro's zone is `socialus-web` #173**, already open and unblocked; with one metro live a constant is defensible until it lands, and the column is the honest version.

**Criterion 4's count is permitted and its roster is not** — Don, 2026-09-07: *a count is shown to the Page owner, never a roster of who reacted.* The open question in `verbs.md` about a Page owner seeing **who** their audience is stays open and is untouched by a count.

**The restricted setting depends on delivery, which is in `ROADMAP.md` § Cut.** It may be **visible before delivery exists, and not selectable-and-postable** — a creator who addresses forty-two people none of whom receive it has been told something untrue. At launch most Pages have nobody getting updates, so the reason shown is the true one either way. **The anyone setting is complete against what exists.**
