---
purpose: Proposal — collapse three follow substrates into one table. Includes the specific answer on whether a follower would count as a member, and why this must land before bulletins.
layer: how
status: awaiting-ruling
---

# Proposal — one follows table

## First, a correction to what I told you

I said Pages are followed via a group-membership row. **That was half right and it matters which half.**

**Nothing writes a Page follow. The follow button on a Page is a stub** — its own comment says group-follow persistence does not exist and the follows table is member-to-member only. **You cannot follow a Page today at all.**

**What is real is the read direction.** The unified following reader treats *an explicit group membership* as a follow. **So joining a Group makes it appear in your following list** — the conflation exists, but it runs backwards from how I described it.

**Consequence for the question below: the access problem is latent, not live.** There are no follower memberships because nothing creates them. **It becomes live the moment follow-a-Page is implemented the way the reader implies.**

## Does a follower count as a member? Specifically:

**Write permission: no.** Every authorization check is **role-specific**, not membership-generic. Creating an Item requires `role='owner'`. Editing requires owner or steward. Standing presence requires owner, staff or steward. **A `role='member'` row — which is what joining inserts — grants no write anywhere.** That part of the design holds.

**But three things break, and two are access:**

1. **A follower would see the Page's member roster.** The co-member read policy is deliberately generous — its own comment reads *"the Group is yours, see everyone"*, and it returns members **regardless of role and regardless of whether they left.** So a follower of a bakery would be able to enumerate the bakery's people, including former ones. **That is an access bug, not untidiness.**
2. **A follower would gain read access to a Page that isn't public.** Group SELECT is granted to any explicit member via the membership helper. For a listed Page that is moot; **for an unlisted or private Page, following would be a way in.**
3. **The app would think a follower owns a shop.** The check that routes the Sell call-to-action asks only for an active membership in a business Group and filters on kind and lifecycle — **it does not filter on role.** So following a bakery would send your own Sell button to the shop index instead of the setup walkthrough. **A behavioural bug from a role-agnostic query that should have been role-scoped.**

**So: implementing follow-as-membership would create two access problems and one routing bug.** None is live today. **All three are avoided by not doing it.**

## The proposal

**One `follows` table** covering people, Pages and venues: the follower, the subject, when, and a soft-unfollow timestamp. Unique per follower per subject.

**One refinement to the reasoning.** The conclusion that this avoids the no-foreign-key problem is right, but not for the stated reason — **a single polymorphic `subject_id` column still cannot carry a foreign key**, because one column cannot reference three tables.

**The fix is standard and cheap: three nullable foreign-key columns with a CHECK that exactly one is set.** That keeps real referential integrity and real cascade deletes, which is precisely what `demand_signals` had to give up and does not have to be given up here. **So the difference between the two tables is not "the subject exists" — it is that an existing subject can be pointed at properly, and should be.**

## Price — about 1.5 days

- **The data half is trivial.** Person follows copy across one-for-one. **Page follows do not exist, so there is nothing to migrate.** Venue follows currently live as saved searches with a location set — **migrate those out, because a saved search that means "follow" is the same conflation in a third costume.**
- **The read paths are the cost, and it is net code removal.** The unified reader's three-way union collapses to one query; its own comment says its job is stopping the three-substrate distinction leaking into divergent queries. **That job disappears.**
- The follow button stops being a stub. The following list and the You summary read one source. One generalised handler pair replaces the member-only one.

## What it unblocks beyond bulletins

- **Following a Page becomes possible at all** — currently a button that does nothing.
- **The following list stops mislabelling group membership as interest.** Today, joining something makes it look like you followed it.
- **The three role-agnostic membership queries get looked at** while someone is in there — including the Sell routing one, which is a bug whether or not follows change.
- **Any future audience question has one answer.** Bulletins is the first; it will not be the last.

## Must it land before bulletins? Yes — and it is stronger than "building on sand"

**Bulletins' audience is "who follows this Page," and that has no substrate whatsoever.** Not fragmented — **absent.**

**So bulletins cannot be built first.** The alternatives are to invent the audience inside the bulletin work, or to implement follow-as-membership and inherit all three problems above. **Both are worse than doing this first.**

**Effect on the number: bulletins stays 2 days; the prerequisite is 1.5; the pair is 3.5.**

**Recommendation on the trade:** **the follows simplification should land regardless of bulletins.** It closes a latent access problem, fixes a live routing bug, removes code, and is a prerequisite for any audience feature. **Bulletins is the part that does not fit** — and it is a good candidate to sit behind a not-built-yet tap and let Page owners say whether they want it.
