---
purpose: IA decision awaiting PM ruling — is a Page like a listing? Settles whether a one-time event is a Page of its own or an Item with a date, and prices Page retirement under each answer.
layer: how
status: done
---

# Decision — is a Page similar to a listing?

> **RULED 2026-09-07: no.** A Page is the person or people behind the listing — Page is *who*, Item is *what*. One-time things are Items; long-duration things are Pages. Retirement is in scope and gets built. Canonical definition now lives at [`../../product/foundation/primitives.md`](../../product/foundation/primitives.md) § Page.

**Raised:** 2026-09-07 by the PM, alongside the ruling that people create Pages **sequentially, not simultaneously**, that Pages have varying lifespans — a business for years, a season of selling for months, something short enough to exist only until a one-time event — and that a Page is an **organizing entity**: where conversations happen and items and dates get posted.

**This is an IA decision and it settles before any ticket.** It decides what browse indexes, what the map pins, and what a follower graph is attached to.

## The answer, and the part of the intuition that is right

**No — a Page is *who*, an Item is *what*.** The Page holds many items and dates over time and carries identity and followers; a listing is one thing offered.

**But the intuition points at something real: for a one-time event the two collapse.** There is one occasion, and nothing outlasts it. The distinction that carries the rest of the model has no work to do in that case.

## Recommendation — don't let them collapse

**A one-time event is an Item with a date on someone's Page, not a Page of its own.**

- **The gathering composer already works this way**, and Items already carry their Page. Nothing needs building for the recommended answer.
- **Page proliferation is the cost of the alternative.** If a Page can be a single event, browse and the map end up indexing Pages that are really listings, and **a follower graph on ephemeral Pages is worthless** — following something that ends next Tuesday buys nothing.
- **Conversation attaches to the Item for an event and to the Page for the ongoing entity.** That gives the *conversations happen here* property without making every occasion a Page.

## Three things checked in the code, not assumed

### 1. Conversation attaches to nothing — it does not exist

**There is no messages, threads, comments, conversations, posts or replies table anywhere**, and no surface for any of it. `item_responses` records RSVP / follow / save / interest and **carries no text**.

**So "a Page is where conversations happen" is a direction, not a current property.** Nothing in the build supports conversation on a Page *or* on an Item. **This matters for the decision in a specific way: conversation cannot be the argument for making an event a Page, because it is equally absent from both.** When it is built, where it attaches is a free choice — and attaching it to the Item for events is what this recommendation asks for.

### 2. Retirement is already built — almost entirely

**The substrate exists and five read paths already handle a retired Page correctly.** Verified 2026-09-07:

| What | State today |
|---|---|
| Lifecycle column | `draft` / `active` / `dissolved`, with `dissolved_at`, `dormant_at`, `dissolves_at` alongside |
| Row-level security | Public read requires active **and** listed **and** not dissolved — a retired Page vanishes at the database boundary |
| Browse and the map | The discovery index excludes Items whose Page is dissolved — **the pin and the listing disappear on their own** |
| Public URL | The place-scoped route already returns not-found for a dissolved Page |
| URL derivation | The path function excludes dissolved Pages |
| Following list | Drops rows it can no longer read, so a retired Page leaves a member's list without a cascade |

**What is missing is small: the `group.dissolve` handler and a control to call it.** The event types are already declared; the handler is not written.

### 3. Nothing in the build assumes a Page is permanent

**Checked and not found.** The five paths above all anticipate impermanence. The only thing that persists past retirement is the membership row itself, and the read path already drops it. **This is the opposite of what a proliferation-friendly IA usually costs, and it is what makes the price difference below so lopsided.**

## The price of each answer

### If Pages are durable and events are Items *(recommended)*

**Retirement is near-free and optional for launch.** The dissolve handler plus a confirm control — **half a day to a day** — and nothing else changes, because every read path already behaves. It can ship after launch without leaving anything broken.

### If a Page can be a single event

**Retirement stops being an edge case and becomes the routine end of every Page**, which turns a half-day into a feature:

- **A new state is needed.** `dissolved` removes the public URL, which is right for a shop that closed and wrong for an event that happened — a past event's page should stay readable. That is a fourth lifecycle state and a fourth set of read rules across all five paths above.
- **Browse and the map need a liveness rank.** An index full of Pages that are really single occasions has to sort the live from the finished, which the current index does not do.
- **The follower graph needs a rule** for what following an ephemeral Page means and what happens when it ends.
- **Item ownership needs an answer** — what happens to the Items filed under a Page that was itself one event.
- **Several days, plus the standing cost** of a browse surface whose units are inconsistent.

**The difference is not close.** One answer costs a day and is optional; the other is a feature with a permanent tax on discovery.

## What the PM's ruling buys

- **Durable Pages, events as Items:** the sequential-creation model still holds — a season of selling is a Page that gets retired after months, and that path is nearly built. **A one-time event simply never needs a Page.**
- **Ephemeral Pages:** every occasion becomes an organizing entity with its own address and its own conversation, at the cost of a lifecycle feature and a browse surface that mixes people with occasions.
