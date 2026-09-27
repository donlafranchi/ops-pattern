---
id: agent-answering
purpose: In-app answering over SocialUs data — the argument for it, what the project looked like when it was decided, and what must not be foreclosed before launch. A constraints list, not a build plan.
status: prepare-only
discussed: 2026-09-21
horizon: the version after launch (launch is 2026-10-30)
---

# Answering, inside the app — prepare, don't build

> **Not for launch.** Don, 2026-09-21, verbatim: *"This isn't something we're adding for [launch], but it is something I'd like to prepare for for the next version after [launch]."* And on why it is written down at all: *"I also want the information captured so we can build off of it when the time comes. Lastly date it so we have a reference for where we were when it was discussed."*
>
> **The version after 2026-10-30, and not backlog for it.** Nothing here is a ticket and nothing here competes for the launch list. **The post-launch milestone in `socialus-web` is where the work will hang; its name is pending and belongs in this line once it exists.**

## The argument, so a later reader can disagree with it

**Written out as premises rather than as a conclusion, because the premises are the part that may stop being true.** Don's words are quoted; the chain is his, stated in steps.

1. **Premise — agent search is replacing keyword search.** *"My hypothesis is that Google and Bing search are being replaced by agent search."* **He calls it a hypothesis and it is one.** Nothing in this document tests it, and if it is wrong the rest does not follow: a product that blocks crawlers in a world where crawlers still send the traffic has simply taken itself off the map.
2. **Premise — being the data layer under someone else's agent is not a business.** *"I don't want the large language model creators to replace what we're doing and to take what we've gathered and give it away for free."* The claim is that a model answering from SocialUs data substitutes for SocialUs rather than referring to it.
3. **Therefore the public tier is thin.** *"We don't want to be cut out yet we also don't want to offer up easy information. I'd prefer that we offer up a summary of the kinds of things that we have that are available without any specific detail."* **Who exists, yes. What is happening, no.** Enough to be discoverable, not enough to be substituted for.
4. **Therefore the answering happens inside.** *"I want to offer that LLM answering capability inside of our own app."* **This is the step that makes 3 honest rather than merely defensive** — thinning the public tier without answering well internally is a product that has hidden itself. The two are one strategy and each is incoherent alone.
5. **The bet underneath all four:** that data only SocialUs holds is worth more answered in one place than indexed everywhere. **That is a bet about the data being distinctive**, and it is weakest at launch when there is least of it.

**The outward half is the crawler-blocking and thin-public-tier work in `socialus-web`.** This document is the inward half.

## Where the project was on 2026-09-21

**Recorded because half of this will not hold by the time anyone builds the capability, and a later reader needs to know which constraints the reasoning leaned on.** Taken from the repos, not from memory.

| | On 2026-09-21 | Load-bearing for the argument? |
|---|---|---|
| **Days to launch** | **39.** Launch 2026-10-30, one metro | Yes — point 5's weakness is a launch-time fact |
| **The browse query** | `browse_feed` merged 2026-09-19 (#161) **and wired the same week**: `/explore` is server-rendered through `src/app/explore/load.ts` as of #174. Migration applied to production separately *(reported by the app session, not verified from here)* | Yes — constraints 1 and 4 describe this query |
| **The personal half** | **Deliberately not wired.** `load.ts` holds `audience` at `public`; F059 criterion 2b is its own ticket. The SQL already withholds on the follow set — only the caller is missing | Yes — constraint 1 is about exactly this seam |
| **Announcements** | **Cannot carry a time** (F073 approved, unbuilt) and **cannot repeat** (F074 approved 2026-09-20, unbuilt). **No member can post at all** — F072 is approved and unbuilt, so no member-authored posts exist | Yes — there is nothing to answer *tonight* with |
| **Pages** | **Editable**, name and description only, via an owner bar on the live Page (#158, merged). No tag or collection editing exists | Partly — corrects a common assumption that Pages are immutable |
| **Post subject matter** | **No `post_tags` table.** A post carries its *Page's* tags | Yes — constraint 3 |
| **Text and vector retrieval** | **Neither exists.** No `tsvector`, `pg_trgm` or `ilike` in any migration. `pgvector` installed, `item_embeddings` empty and attached to the retired `items` noun | Yes — this is why it is not a thin wrapper |
| **Addresses** | **URL scheme ruled the same day**: slug plus a short non-sequential ID, no geography in a canonical URL, no member identity derivable from one (`planning/URL-IDENTITY.md`) | Yes — the public/private line and the no-geography rule both bear on the thin tier |
| **Member identity** | **Two leaks open**: `member_public_group_memberships` granted to `anon` joins `member_id` to a Page; `groups.founder_member_id` appears `anon`-selectable | Yes — an answering layer inherits whatever is public |
| **Follower delivery** | **Bulletins in `ROADMAP.md` § Cut** (2026-09-20). The subscription link exists in `group_memberships` and nothing reads it | Yes — constraint 5, the public/private line |
| **Metros** | One live; seeds pending for nearby markets *(reported, not verified from here)* | Yes — point 5 |

**The two facts most likely to age badly:** *no member can post at all* and *no retrieval path exists*. **If both have changed by the time this is read, re-check the argument's step 5 first** — the bet that the data is distinctive is the one that gets stronger with content and was weakest on this date.

## What must not be foreclosed

**Five constraints. Each is cheap to hold now and expensive to retrofit.**

1. **Privacy is enforced in the data layer, never in a component.** `browse_feed` is `security invoker` and withholds the follower-restricted half **in its own predicate**, so anything reading through it inherits the rule for free — an assistant included. **If withholding ever migrates into a component, a future assistant bypasses it silently**, because it will not be reading through the component. **This is invisible until it is violated**, which is why it is written down rather than trusted. The same property binds any retrieval path added later: a `security definer` retrieval function breaks it without failing anything.

2. **A summarised answer is a disclosure.** Retrieving a restricted row to *inform* an answer discloses it as surely as printing it. Anything designed now that assumes "we only show what we retrieved" should assume the stronger form.

3. **Structured fields over prose, wherever the choice comes up.** Times, addresses and tags as columns are what makes retrieval good later; the same facts buried in `body` are not retrievable without inventing a parser for them. **F073 (a post's own address and its start time) and F074 (repeats as rows) already push the right way.** **Where it is currently going wrong: a post has no tags of its own** — there is no `post_tags` table, so `browse_feed` gives a post *its Page's* tags. A bakery's Page tagged `bread` says nothing about which post is the bread class. That is subject matter living in prose because there is nowhere else to put it.

4. **The query's parameter surface is an asset — do not narrow it.** `browse_feed` takes scope, kinds, result kinds, audience, follow set, tags, a start-window at both ends, a creation cutoff, a sort and a limit. **That shape is close to a tool definition already.** Anything that collapses it back toward one hardcoded call — a convenience wrapper that fixes the sort, a caller that always passes the same three arguments — takes the asset away. **Related and worth keeping general: F092's query parser**, which turns typed words into structured filters, is the same job an answering layer does at the front end.

5. **The thin public tier draws the line the assistant will inherit.** The public/private split being decided now in `socialus-web` is not only about crawlers. **Whatever is public to an outside agent is public to everyone**, and whatever is withheld is what the internal assistant will have to be trusted with. **That decision should be made knowing an internal assistant is coming**, not on the assumption that withheld means unused.

## What is honestly missing, so nobody mistakes the substrate for a head start

- **No text matching exists anywhere.** No `tsvector`, no `pg_trgm`, no `ilike` in any migration; `p_tags` matches `tags.normalized` exactly. *Sourdough* has no retrieval path unless a creator typed that exact tag.
- **`pgvector` is installed and unused.** `item_embeddings` is an empty `vector(1536)` table with no rows and no pipeline, **hanging off `items`** — the noun `model.md` says does not exist. Nothing exists for Pages or `page_posts`. **Same trap as the zoneless RRULE columns: reserved substrate on the wrong noun is not a head start.**
- **No relevance sort.** Recency, soonest and newest are the three; *best match* is a fourth thing.

## The hard parts, recorded once so they are not rediscovered

**Hallucinated specifics about real businesses is the serious one**, because the exposure is a business's reputation rather than ours — invented hours, invented prices, an invented event. **Grounding every specific in a retrieved row, and declining rather than inferring, is a product requirement here and not a quality preference.** The others, briefly: thin data must produce a thin answer rather than a confident one; *nothing on tonight* is a true and acceptable answer and will be the common one for months; and cost is per-query, which makes it **the first thing in SocialUs where a member being engaged costs money**.

## Related and not folded in

`IMAGINE.md` § *Discovery that knows what a person is optimizing for* — natural language dissolves its attribute-vocabulary problem and leaves its real one untouched, because nothing lets anyone say anything about a Page they do not own. Reframe recorded there; the entry stays parked.

**Open and not answered here:** whether a private residence's address is withheld, and from whom — marked in `product/foundation/nouns.md` § Page. **It governs the Page surface first**, and the answering layer can only inherit a line somebody has drawn.

## Reading this later

**Start with the argument, not the constraints.** The five constraints are cheap engineering hygiene and will mostly still be right. **The argument is the part that expires** — check step 1 first, because if agent search did not displace keyword search, steps 2 through 4 do not follow and the thin public tier is a self-inflicted wound rather than a defence. **Then check the table**, which says what was true on the day and marks which rows the reasoning leaned on.
