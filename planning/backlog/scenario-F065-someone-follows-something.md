---
purpose: Scenario — the rules of the verb "follow". One follows table for people, Pages and venues; following grants nothing.
layer: how
status: backlog
---

# F065: Someone follows something

> **Written and reviewed, deliberately not advanced.** The guard rails for this verb are settled; **the build is not authorised.** This scenario sits in the draft lane because **lane membership is the state and an approved scenario is one the build agent may pick up.** It is not unfinished — it is unscheduled. **Move it to `next/` when the PM schedules the work, not before.**

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 8 (Follow what you love), 1 (Find your people)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → follows → Person | Page | Venue. **One new table replacing three substrates.**
**Spec contract:** [`decision-one-follows-table.md`](decision-one-follows-table.md) · [`member.md`](../../product/systems/member.md) § Follows · [`groups.md`](../../product/systems/groups.md) § Roles per kind
**Status:** backlog — **written and reviewed 2026-09-07; held pending scheduling.**

## The verb's rules

| | |
|---|---|
| **Who can do it** | Any signed-in member. |
| **To what** | A person, a Page, or a venue. **Three subjects, one verb.** |
| **How many times** | Once per subject. Unfollowing is soft and re-following revives. |
| **What it changes** | The follower's own following list; the subject's follower count; **the audience for anything broadcast to followers.** |
| **What it does not change** | **Anything about the subject's permissions, membership, roster, or visibility.** |

### What following deliberately does not do — the guard rail

**Following grants nothing. Four refusals, and three of them close latent access problems:**

1. **No membership.** Following a Page does not make you a member of it. *(Today the following list reads explicit group memberships and presents them as follows — the conflation runs backwards, and this scenario ends it.)*
2. **No role, so no permission.** A follower cannot create, edit, publish or retire anything on the Page they follow.
3. **No read access to a Page that isn't public.** *(As memberships, following would grant SELECT on unlisted and private Pages. That is a way in, and it closes here.)*
4. **It never satisfies a check asking whether someone is part of a Page.** *(As memberships, a follower would appear in the co-member roster — which returns members regardless of role and regardless of whether they left — and would trip the Sell routing check, which filters kind and lifecycle but not role. A follower would be shown a business's staff list and told they own a shop.)*

> **Intent (Ratified 2026-09-07).** **Interest and belonging are different relationships and must not share a row.** A person who wants to hear from a bakery has told you nothing about whether they work there. **Where one record serves both, the weaker claim inherits the stronger one's rights** — which is exactly how a follower ends up reading a staff roster.

## The Person

Rae follows a bakery, a repair collective, and the Saturday market. She wants to hear what they're doing. **She is not joining anything, and nothing about following should suggest she has.**

Today she cannot: **the follow control on a Page is a stub that writes nothing.** Its own comment says the substrate does not exist.

## The Story

Rae taps **Follow** on the bakery's Page. The control fills. **Nothing else about her relationship to the bakery changes** — she cannot see its people, cannot edit it, and her own Sell button still offers to help her start something.

She opens her following list. The bakery is there, alongside a neighbour she follows and the market she goes to. **Three kinds of thing, one list, one place to unfollow.**

She unfollows the market in March and follows it again in June. **It is the same row, revived** — the history is intact.

## Data captured

**One `follows` table:** the follower, **three nullable subject columns with a CHECK that exactly one is set**, when, and a soft-unfollow timestamp. Unique per follower per subject.

**The three nullable foreign keys are the point.** A single polymorphic subject column cannot carry a foreign key — one column cannot reference three tables — so it loses cascade deletes and lets orphans accumulate. **Three real foreign keys keep referential integrity.** *(Contrast [F064](scenario-F064-someone-asks-for-something-that-isnt-built.md), where the subject genuinely has no row and a text key is the honest choice. The difference is not "one table versus many" — it is whether there is anything to point at.)*

**Migrated in:** person follows copy one-for-one; **venue follows come out of saved searches**, because a saved search that means "follow" is the same conflation in a third costume. **Page follows do not exist, so there is nothing to migrate.**

## Acceptance criteria

**Given** a signed-in member on a Page, a member page, or a venue
**When** they follow it
**Then** one row is written with exactly one subject column set, and its event row commits in the same transaction.

**Given** a member following a Page
**When** any authorization, membership, roster or visibility check runs for that Page
**Then** **the follow is invisible to all of them.** The member gains no role, appears in no member list, and can read nothing they could not read before.
*Why: this is the guard rail, and it is tested directly rather than inferred from the absence of code.*

**Given** a member following an unlisted Page
**When** they request it
**Then** **access is unchanged from before they followed.**

**Given** a member who follows a business Page and owns no shop
**When** their Sell control renders
**Then** it offers to help them start something. *(Today's routing check filters kind and lifecycle but not role — this asserts the fix.)*

**Given** a member unfollowing and following again
**When** the second follow lands
**Then** the original row is revived, not duplicated.

**Given** the following list
**When** it renders
**Then** it reads **one table**, not three. *(The unified reader's three-way union is deleted, not extended.)*

## Out of scope

Follower counts shown publicly, mutual-follow anything, follow suggestions, notifying the subject that they were followed, blocking. **Following is quiet in both directions.**

## Capabilities unlocked

- Following a Page becomes possible at all.
- **Any audience question has one answer** — the first is bulletins ([F066](scenario-F066-a-page-owner-posts-to-its-followers.md)); it will not be the last.
- The following list stops presenting group membership as interest.
