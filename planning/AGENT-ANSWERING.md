---
id: agent-answering
purpose: What must not be foreclosed before 2026-10-30 so that in-app answering stays cheap afterwards. A constraints list, not a build plan.
status: prepare-only
---

# Answering, inside the app — prepare, don't build

> **Not for launch.** Don, 2026-09-21: *"This isn't something we're adding for [launch], but it is something I'd like to prepare for for the next version after [launch]."* **The next version after 2026-10-30, and not backlog for it.** Nothing here is a ticket, and nothing here competes for the launch list.

**The strategy it serves** *(Don, 2026-09-21, and the dated line is in `DECISIONS.md`)*: if agent search replaces keyword search, SocialUs becomes the agent for its own domain rather than the free data layer under someone else's. Outside agents get a thin summary of what kinds of things exist here; the good answers happen inside, over data only SocialUs has. **The outward half is the crawler-blocking and thin-public-tier work in `socialus-web`** — the refusal and the capability are one strategy, and each is incoherent alone.

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

**Open and not answered here:** whether a private residence's address is withheld, and from whom — `DECISIONS.md` § Open. **It governs the Page surface first**, and the answering layer can only inherit a line somebody has drawn.
