---
id: why-verbs
purpose: The verb × noun matrix — what each verb may do to each noun, and what it deliberately may not. An index, not a spec.
layer: why
status: active
owns:
  - verb-index
---

# The verbs

> **A verb is not one rule. It is a rule per noun it acts on.** Following a Page, a person and a venue are three different things; responding to a gathering and reacting to a bulletin are two.
>
> **The forbidden column is what this document is for.** A verb list says what you can do; the matrix says what you can't, and why. **That is the thing that stopped selling acquiring business-ness.**
>
> **An index. The scenarios hold the detail.** One state per cell, plus a two-word reason where it matters.

**● Built** · **○ Specced, unbuilt** · **✕ Deliberately forbidden** · **— Meaningless** · **⚠ Built with no rules written**

| | Person | Page | Gathering | Product / Service | Venue | Bulletin |
|---|---|---|---|---|---|---|
| **Create** | ● signup | ● | ● | ● | ⚠ fake coords | ○ F066 |
| **Edit** | ○ no editor exists | ○ F056 · save is publish | ⚠ no handler | ⚠ no handler | ⚠ no handler | ✕ post is final |
| **Publish** | — | ● activate | ● | ● | — | ● = posting |
| **Retire** | ○ account delete | ○ handler missing | ⚠ **nobody has decided** | ⚠ **nobody has decided** | — | ✕ |
| **Follow** | ● F032 | **= Join, by design** F042 | ✕ **not a concept** | ✕ **not a concept** | ● F042 · a saved search, **intended** | — |
| **Respond** | — | — | ○ F063 · RSVP | ⚠ *interest* undecided | — | ○ F066 · one reaction |
| **Join / leave** | — | ○ **rules exist, CTA never built** F035 | — | — | — | — |
| **Save** | ⚠ homeless | ⚠ homeless | ⚠ homeless | ⚠ homeless | ⚠ homeless | — |
| **Appear at** | — | ○ Page-level | ● item-level | ● item-level | — | — |
| **Take down** | — | ○ F058 | ○ F058 | ○ F058 | — | ✕ |
| **Signal** | — | — | — | — | — | — |
| **Message** | ✕ **nothing exists** | ✕ | ✕ | ✕ | ✕ | ✕ |

*Signal acts on a category or an unbuilt feature — neither is a noun in this model, which is why its row is empty and its table has no foreign key. Rules: F064.*

## The forbidden cells, with reasons

- **Follow a product or service.** *Ruled 2026-09-07: "people aren't really going to follow products or services."* **Removed as a concept, not deferred.**
- **Edit or delete a bulletin after posting.** A broadcast that can be rewritten after people read it is not a broadcast.
- **Rename an active Page's slug.** The name may change; **the address does not follow it.** A public URL that moves is a broken link someone already shared.
- **Overlapping appearances.** A Page cannot be in two places at once.
- **Message anyone, about anything.** **No messages, threads or comments exist anywhere in the product.** Not a gap in this document — a hole in the product, and the reason volunteering has no reply channel.
- **A follow granting membership, role, read access, or satisfying any "is this person part of this Page" check.** Four refusals, three of which close latent access problems. *(F065.)*

## Who can see whom — 2026-09-08

**A second matrix, because visibility between people is a rule per pair, not per verb.**

| Viewer → sees | Followers of a business | Members of a **social group** | That group's member conversations |
|---|---|---|---|
| **The business itself** | **● allowed** — its own audience, numbers today | — | — |
| **Follower of a business** | ✕ **forbidden** | — | — |
| **Member of a group** | — | **● allowed** — current members only | **allowed** *(when built)* |
| **Follower of a group** | — | ✕ **forbidden** | ✕ **forbidden** |
| **Anyone else, including anonymous** | ✕ **forbidden** | ✕ | ✕ |

**A business Page never shows its followers publicly — to anyone.** *(Ratified 2026-09-08; previously undefined anywhere.)* **A follower list on a business is a customer list, published.** The business may see its own audience; nobody else has a reason to. **This is a different and stronger rule than followers-not-seeing-each-other.**

**"Group" in this table means a social group, not a business.** Where a rule applies to only one, the table says which. *(The two are routinely blurred in older docs; they are different nouns with different rules.)*

> **Intent (Ratified 2026-09-08).** **A follower of a business is a customer, and customers are not an audience for each other.** Following a bakery tells the bakery something; **it does not put you in a room with its other customers, where your interest is legible to strangers.** **A member of a group has joined something, and knowing who else is in it is most of the reason to join.**

**Rules: [F067](../../planning/backlog/scenario-F067-a-follower-and-a-member-are-different-things.md).**

**Former members: you follow a group or you don't.** A member leaves, or the Page owner prunes them. **A stale membership nobody has cleaned up is a tolerated state, not a defect** — pruning is a future feature and nothing waits on it.

**Deferred and recorded, not scoped:** a group's creator accepting and declining members · **private groups** · **private members** — see [`groups.md`](../systems/groups.md) § What does not ship at b1.

### Two findings from the code, 2026-09-08

**The product honours the follower rule today only because the rows do not exist. The database does not enforce it.**

- **The listed-Group roster policy admits anonymous readers to any listed Page's membership rows** — no filter on the Page's kind. **The moment a follower is written as a membership on a business Page, that follower is publicly enumerable.** Today no such row exists, because there is no Join control on a business Page and the follow control is a stub. **A latent breach, not a live one — and the relationship column is the natural place to close it.**
- **Nothing renders a roster anywhere.** The Members section specced in F035 was never built, which is the second reason nothing leaks today. **Two accidents, not a safeguard.**

**The co-member policy needs narrowing.** It returns fellow members **regardless of source and regardless of whether they left** — deliberately, per its own comment: *"the Group is yours, see everyone."* **Don's rule says members see each other; it does not say former members are visible.**

**Nothing depends on the generous version.** The re-join-preserving-role path runs through the handler, which bypasses row-level security; the following list reads only the viewer's own rows. **Adding an active-only filter is safe** and should land with the relationship column rather than on its own.

## What the matrix surfaced

### Filled by mining the shipped scenarios — 2026-09-08

**Three cells marked ⚠ turned out to be governed all along**, by scenarios nobody had re-read:

- **Join / leave a Group is specced in detail.** *Join on community kinds only; **no Join on a business Page** (staff confirmation deferred); writes the kind's default role with `source='explicit'`; the Members section shows listed memberships only; leaving is soft and re-joining revives the row preserving the prior role.* **Every one of those matches the handler code.**
- **Following a Page *is* joining it, by design** — the Group page's control says **Join** and flips to **Member**. Not a conflation that crept in; **a decision, shipped.**
- **Following a venue as a saved search was intended, not inherited.** *Correction: I called it accidental yesterday. The scenario designed it that way and said so.*

**But the Join control was never built.** The only caller of the join handler is the *undo* affordance on the following-management page. **So a member can re-join something they left and cannot join anything else** — and that is the group half of the two loops now in scope.

### Cells nobody had thought about

- **Retire an Item.** The state vocabulary carries *withdrawn* and *closed*; **no handler writes either.** So a producer cannot take down their own listing — only an operator can, and only its photo. **Nobody has decided what retiring an Item means and nothing forces the question.**
- **Take down your own photo versus someone else's.** F058 gives the operator a removal control. **There is no operator concept in the code at all** — no role, no flag, no check. So the distinction the scenario relies on has nothing to stand on yet.

### Asymmetry without a reason — where yesterday's bugs lived

**Confirmed in the code, not assumed.** The resolvers for a product and a service both filter their owning Page to `kind='business'`. **The gathering resolver does not.**

**So a product filed under a non-business Page fails to resolve and a gathering under the same Page renders fine.** Same shape, different behaviour, and the difference is a leftover from the business gate rather than a decision. **Ticketed (T134); recorded here because the asymmetry is the pattern, not the instance** — the same clause appeared in four places and was removed from three.

### Still ungoverned after mining — the real gap list

**Four, down from five, and none of them is join/leave any more.**

- **Save** — never specced anywhere, and homeless since following a listing was ruled out.
- **Retire an Item** — no rule, no handler. **A producer cannot withdraw their own listing.**
- **Edit an Item** — no rule, no handler. Unreachable rather than ungoverned.
- **Create a venue** — built, stamps a hard-coded downtown coordinate, no rule. *(Being fixed in the current stretch.)*

## The biggest hole — changed, 2026-09-08

**Not join/leave any more. It is governed** — [F035](../../planning/done/) states the rules and the handler code matches them.

**The hole is that the Join control was never built.** Rules without a surface: a member can leave a Group and re-join it from their following list, and **cannot join anything they have not already been in.**

**That lands directly on the two loops now in scope.** *Creating or joining a group* is half the remaining product, and **the joining half has no entry point.** Nobody noticed because the rules existed, the handler existed, and the following list made it look reachable.

**Second: retiring an Item.** A producer cannot withdraw their own listing — a real gap in a launch that asks people to put their work in public.
