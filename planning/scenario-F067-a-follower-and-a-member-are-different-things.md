---
purpose: Scenario — the language and data for the follower/member distinction, put in place while the behaviour is still identical, so it can diverge without a migration.
layer: how
status: draft
---

# F067: A follower and a member are different things

> **Written, not scheduled.** Draft lane means unscheduled, not unfinished.

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 8 (Follow what you love), 1 (Find your people)
**Primitive shape:** Person → relationship → Page. **One row, one new column.**
**Spec contract:** [`groups.md`](../../product/systems/groups.md) § Roles per kind · F035 § Join CTA · [`decision-one-follows-table.md`](decision-one-follows-table.md)
**Status:** backlog.

## The PM's instruction, and it is the whole scenario

> *"A follower of a business is different from a member of a group. Members of a group want updates regularly, in order to attend. Right now that difference is very thin or non-existent — but the language should be in place for groups today, so the distinction can grow and differentiate later."*

**So: two words, one behaviour, today. Deliberately.**

## The verb's rules

| | |
|---|---|
| **Who** | Any signed-in member. |
| **To what** | A Page. **The Page's kind decides which word applies** — a business Page has **followers**, a group Page has **members**. |
| **How many times** | Once. Leaving is soft; returning revives the row. |
| **What it changes today** | **Nothing behavioural.** Both receive the Page's posts; both appear in the audience count; neither gains a role. |
| **What it changes tomorrow** | Whatever we decide members get that followers do not. **The column is where that decision will land.** |

## The difference stopped being language — 2026-09-08

**PM ruling. This is the first real behavioural difference, and it is the reason the column exists.**

| | Followers of a business | Members of a group |
|---|---|---|
| See each other | **No.** *"Customers don't need to see other customers."* | **Yes.** |
| See member conversations *(when built)* | **No** — including followers of a group | **Yes.** |
| Admitted by | Anyone, immediately | **Accept / decline by the group's creator — deferred, see below.** |

> **Intent (Ratified 2026-09-08).** **A follower of a business is a customer, and customers are not an audience for each other.** A person who follows a bakery has told the bakery something; **they have not joined a room with the bakery's other customers, and putting them in one exposes a purchase interest to strangers.** **A member of a group has joined something, and knowing who else is in it is most of the reason to join.**
>
> **So the column is no longer bookkeeping.** It answers *who can see whom*, and shortly *who can read what*.

**Note the third row is a follower of a *group*, not of a business.** A group may have both; **only its members see its conversations.**

### Four rulings added 2026-09-08

- **A business Page never shows its followers publicly.** *(PM: "Followers don't need to be shown publicly for business purposes, except to the business itself if warranted.")* **Not the same rule as followers-can't-see-each-other — this one says nobody can, including anonymous visitors.** It was undefined anywhere until now, which is why it is written here.
- **A group's members could one day appear in a members list.** Different rule, different noun. **When the PM says "group" he means a social group, not a business** — the docs must not blur the two, and where a rule applies to only one, it says which.
- **Former members: you follow a group or you don't.** Leaving is done by the member, or the member is pruned by the Page owner. *(PM: "sometimes a member won't leave and the owner won't know, and that's acceptable.")* **A stale membership is a tolerated state, not a defect** — pruning is a future feature and nothing waits on it.
- **Deferred, recorded so it is not rediscovered as a gap: a group's creator accepting and declining members.** *(PM, 2026-09-08: "later, group creators will be able to accept and decline members."* Not scoped. It implies a pending state on the relationship row — **worth knowing when that column is designed, and not worth building now.**)*

## The recommendation — one row with a relationship type, not two tables

**One column on the existing membership row:** `relationship`, `'member'` or `'follower'`, **defaulted from the Page's kind.**

**Why not two separate things:**

- **The distinction today is what the person intends, not what the system does.** Two tables would mean two write paths, two read paths, two unfollow verbs and two audience queries — **for zero behavioural difference.**
- **When they diverge, the divergence will be in what the relationship grants**, not in what it *is*. That is a policy branch on a column, not a different entity.
- **It maps onto a rule that already ships.** F035 already says Join appears on community kinds only and never on a business Page. **The product already behaves as though these are two relationships; it just has one word for them.**

**Why store it rather than derive it from the Page kind:** derived cannot diverge. **A Page that changes what it is, or a business that wants members, would have nowhere to say so.** Storing it costs one column and one default.

## What two names for one behaviour costs today — stated, because it is a real cost

- **The copy must differ everywhere**: Follow / Following / *followers* on a business Page; Join / Member / *members* on a group. Two label sets, one audience query.
- **The honesty cost: a member may reasonably expect something a follower does not get, and today they get the same thing.** **That is the price of putting the language in early, and it is worth naming rather than glossing.** The mitigation is copy that describes the relationship rather than promising a benefit — *"You're a member"*, not *"You'll be notified."*

**What it buys:** no migration and no backfill when they diverge, and — the larger benefit — **the words teach the distinction from day one**, so when members get something followers do not, nobody has to be re-taught.

## Acceptance criteria

**Given** a member joining a group Page
**When** the row is written
**Then** `relationship = 'member'`, and every surface calls them a **member**.

**Given** a member following a business Page
**When** the row is written
**Then** `relationship = 'follower'`, and every surface calls them a **follower**.

**Given** either relationship
**When** anything reads the audience
**Then** **one query serves both**, and the relationship value affects the label, not the result.

**Given** a follower of a business Page
**When** any surface renders people
**Then** **no other follower of that Page is visible to them** — not a roster, not a count broken down by person, not a card scroll.

**Given** a business Page viewed by anyone at all — a follower, a stranger, an anonymous visitor
**When** the Page renders
**Then** **its followers are not shown.** Not a roster, not names, not avatars. **A count, if anything, and only where it earns its place.**
*Why: a follower list on a business is a customer list, published. The business may see its own audience; nobody else has a reason to.*

**Given** a **social group** Page — not a business
**When** the members section renders
**Then** **the group's current members are visible**, and **members who have left are not.**

**Given** a follower of a group Page *(when conversations exist)*
**When** they view the Page
**Then** **member conversations are absent** — not locked, not teased, absent.

**Given** either relationship
**When** any authorization or role check runs
**Then** **it is unaffected.** *(The follow guard rails hold for both — no role, no membership rights, no read access to an unlisted Page. See [F065](scenario-F065-someone-follows-something.md).)*

**Given** a Page's audience count
**When** it renders
**Then** it is labelled with the right word for that Page's kind, **and counts people, not rows.**

## Out of scope

Converting one relationship into the other, a Page choosing which word it uses, mixed audiences on one Page, and any benefit that members get and followers do not. **All of those are the divergence this scenario exists to make cheap — none of them is this scenario.**
