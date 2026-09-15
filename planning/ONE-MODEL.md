# Getting to one model

**2026-09-15. The biggest open thing in the project.** Two models are live on `main` at once. This says what has to happen to end up with one, in what order, and what breaks if the order is wrong.

**Verified against `origin/main` @ `4af5ca9`, fetched.**

## Where it stands

| | The retired model | The ratified model |
|---|---|---|
| Ruled | `item.md`, pre-2026-09-10 | **`model.md`, 2026-09-10 — "There are no Items"** |
| Tables | `items` + `item_products` · `item_services` · `item_gatherings` · `item_wonders` | `groups` (Pages) + **`page_posts`** |
| Writers | **three working composers** — product, service, gathering | **none** |
| Readers | the whole of Browse and every listing route | `src/lib/feed/browse-pages.ts`, one file |

**The new model has a table, a read path, and nothing that writes to it.** The old model is what members actually use. **Nothing can be deleted until something else can be written.**

---

## The order, and why it is this order

**An incremental path exists. Do not big-bang this.** A rewrite would have to move composers, reads, the map, search, and seeded data in one change, with no working state in between — against a 30 October launch.

**1. Give Pages the baseline first — announcing, then following.** *(F072 for posting; the follow column below.)*
Nothing else can proceed while `page_posts` has no writer. This is also Don's ruling of 2026-09-15 made real: a Page for every kind, each with announcing and a following list.

**2. Then the one-create-flow walkthrough.** *(F087, with `/you/create` — #25.)*
Once a Page can announce, "post a gathering" can create a Page plus its first post, which is what the ruling describes. Doing this before step 1 produces Pages that can hold nothing.

**3. Then recurrence.** *(F074, see below.)*
A recurring gathering is the one thing the new model genuinely cannot express. It is third because it needs posts to exist first, and because a one-off works without it.

**4. Then move the three composers onto posts.** Product, service and gathering stop writing `items` and start writing `page_posts`.
**This is the step that must come after 1–3 and not before**: moving a composer to a model that cannot yet express what that composer collects loses data. The gathering composer in particular collects a recurrence rule today.

**5. Then migrate existing rows, then retire the `items` tables.**
Seeded content is 16 items. **Confirm the real row count against production before assuming it is only seed data** — that check has not been run and is not runnable from here.

### What breaks if the order is wrong

- **Retiring `items` before step 4** takes down every listing route and the whole of Browse.
- **Moving the gathering composer before step 3** silently drops recurrence — the composer collects a rule the destination table has no column for. **This is the most likely real loss.**
- **Building the walkthrough before step 1** creates Pages with no way to say anything, which is the thing Don's baseline ruling exists to prevent.
- **Deleting the `item_*` child tables before migrating** loses per-kind fields with no equivalent on a post: price, rate model, service area, capacity, what-to-bring.

---

## The baseline, concretely

**Don, 2026-09-15:** *"It would still require an announcement and perhaps a following list and later messaging etc."* Against the current schema, **neither half of the baseline works today.**

**Announcing — the table exists, nothing writes to it.** `page_posts` shipped in PR #85 with body, optional `starts_at`, optional own location, lifecycle and discoverability. What is missing is a composer and a write path. **F072 is the scenario and it is `draft`.**

**A following list — this does not exist at all.** `member_follows` is `follower_member_id` → `followed_member_id`, **both referencing `members`. There is no table in which a Page can be followed.** What a person sees at `/you/following` today is people, not Pages.

**The cheapest way there is already designed.** F067 specifies a `relationship` column on `group_memberships` — *"Joining a group-kind Page writes `relationship: 'member'`; following a business-kind Page writes `relationship: 'follower'` — one query serves both."* That table already exists, already has RLS, and already carries a `source` enum including `soft_via_follow`. **One column on an existing table, not a new one.** F065 and F067 are both written; F065 is approved, F067 is draft.

**Messaging is later and has nothing.** No substrate at all. Named here only so nobody reads the baseline as including it.

---

## Recurrence — the sharpest gap

**`page_posts` has `starts_at` and no recurrence rule.** `item_gatherings` has `recurrence_rule`, and `item.md` § Recurring gatherings designs the behaviour properly: one row whose `starts_at` always holds the *next* occurrence, advanced by a rotation process once the current one passes, so the item stays discoverable without showing a stale date and a follow on the series survives every rotation.

**So a recurring gathering — Don's own named durable kind — cannot be expressed in the ratified model today.**

**What it takes to close it:**

1. A `recurrence_rule` column on `page_posts`, mirroring `item_gatherings`.
2. **The rotation process, which appears to exist nowhere.** `item.md` specifies it; no implementation was found on `origin/main`. **Without it, `starts_at` goes stale and the post drops out of browse the day after its first occurrence** — which is worse than having no recurrence at all, because it looks like it works.
3. A composer field for it, and copy that does not make a person learn what a recurrence rule is.

**Is F074 the right vehicle?** **Partly.** F074 *"A series repeats"* is the right scenario for the member-facing behaviour, and F075 *"An occurrence is cancelled"* is its necessary sibling — a series with no way to cancel one instance is not usable. **But F074 is `draft` and sits behind F072 and F073 in a chain none of which is approved.** Two things to weigh:

- **The rotation process is infrastructure, not a member-facing story**, and scenarios are member-facing. It may belong as a chore alongside F074 rather than inside it.
- **F073 ("a post with a time is an event") is the real prerequisite** and is also draft. Approving F074 without it approves the roof before the walls.

**Recommendation: approve F072 and F073 first, keep F074 as the vehicle for recurrence, and open the rotation process as its own chore.** The column is small; the rotation is the part that will be forgotten.
