---
id: agent-answering
purpose: Scoping for an in-app answering layer over SocialUs data, and the thin public tier outside agents get instead. Don's strategy, the substrate that exists, the dependency chain, and the four hard parts. Not a ruling and not a schedule.
status: open
---

# Answering, inside the app

**Paired with the crawler-blocking and thin-public-tier work in `socialus-web`.** That document governs what leaves the building; this one governs what happens inside it. **Neither is complete without the other** — blocking outside agents without being able to answer yourself is a refusal with nothing behind it.

## The strategy, in Don's words

*"My hypothesis is that Google and Bing search are being replaced by agent search and that we don't want to be cut out yet we also don't want to offer up easy information. I'd prefer that we offer up a summary of the kinds of things that we have that are available without any specific detail... I don't want the large language model creators to replace what we're doing and to take what we've gathered and give it away for free."* / *"I want to offer that LLM answering capability inside of our own app."* / *"That's the more important feature."*

**Recorded as a coherent position rather than two separate asks:** if agent search displaces keyword search, and you refuse to be the free data layer under someone else's agent, **then you have to become the agent for your own domain.** Outside agents get a thin summary of *what kinds of things exist here*; the good answers happen inside SocialUs, over data only SocialUs has. **The refusal and the capability are one strategy, and either alone is incoherent** — a thin public tier with no in-app answering is a product that has hidden itself.

**Status note, not a schedule:** *LLM-enhanced natural-language search ("sourdough near me Saturday")* already sits in `ROADMAP.md` § Later, written before this. **Don has now called this "the more important feature."** Moving it is his call and is not made here.

## Is `browse_feed` the tool surface? Partly, and the honest answer is no for the interesting half

**What it genuinely gives, and it is not nothing.** `browse_feed` takes metro or place, Page kinds, result kinds, audience and follow set, tags, a start-time window at both ends, a creation-recency cutoff, a sort and a limit, and returns one discriminated row shape with body, description, tags, start time and location. **For a question that decomposes into filters — *what is on in Oak Park on Thursday evening* — this is already a tool-callable surface and a wrapper is thin.**

**What it cannot do, checked rather than assumed:**

- **There is no text matching anywhere in the schema.** No `tsvector`, no `pg_trgm`, no `ilike` in any migration. `p_tags` matches `tags.normalized` **exactly**. So *sourdough* has no retrieval path at all unless a creator happened to type that exact tag.
- **`pgvector` is installed and unused.** `001_extensions.sql` creates the extension; `item_embeddings` is an **empty reserved table** of `vector(1536)` with no rows and no pipeline, and **it hangs off `items`** — the noun `model.md` says does not exist. **Nothing exists for Pages or for `page_posts`.**
- **Sorting carries no relevance.** The three sorts are recency, soonest and Page-creation-newest. An answering layer needs *best match*, which is a fourth thing.
- **The limit is capped at 100**, which is ample for retrieval and worth knowing.

**So: a thin tool-calling wrapper covers structured questions and nothing else.** Anything expressed in words rather than filters needs a retrieval path that does not exist today — text index, embeddings over the right nouns, or both. **Saying otherwise would be flattering the substrate.** The reserved `item_embeddings` table is not a head start for the same reason its recurrence column was not: it is attached to the wrong noun.

## What it would answer over, which mostly does not exist yet

Stated as a dependency chain, in order:

1. **F059's wiring** — `browse_feed` is live in production with **no caller**; Explore still reads the old Item-grain view.
2. **F072** — a Page owner can post at all. Approved, unbuilt.
3. **F073** — an announcement can carry a date, a time and its own address. Without it there is no *tonight*.
4. **F074** — a series repeats. Without it *what is on this afternoon* is fed by the rarest content in the product.
5. **F071** — search over a Page's own text and tags. Draft, and the nearest existing thing to a retrieval path.
6. **Page editing** — a Page cannot be edited after creation beyond name and description.

**The honest summary: the answering layer is downstream of nearly everything currently in flight.** That is a fact about ordering, not an argument about priority.

## What this does to the parked discovery idea

`IMAGINE.md` § *Discovery that knows what a person is optimizing for* (marked **Priority: higher**) is Don's *"a patio, not tables beside a busy street"* and value-oriented versus quality-oriented reviewing.

**It reframes half of it and leaves the hard half exactly where it was.** Natural language is indeed how that intent gets expressed without anyone building a taxonomy, and the parked entry's first system — *a vocabulary for attributes* — largely dissolves: nobody has to enumerate *quiet*, *patio*, *worth-the-price* if a person can just say it. **That is a real simplification and worth recording.**

**What does not move:** the entry's own load-bearing obstacle was that **the product has no way for anyone to say anything about a Page they do not own**, and every description it holds is creator-supplied. **An answering layer can only answer over what is written.** A brewery will tag itself *patio*; it will never write *patio beside a four-lane road*, and no model can retrieve a sentence nobody wrote. **So the interface half is answered and the data half is untouched** — the entry stays parked, with its trigger unchanged.

## The four hard parts, named

1. **Answering confidently over sparse data.** One metro at launch, and a retrieval layer's failure mode is that it answers anyway. **The bar is that thin data produces a thin answer, not a confident one.**
2. **Hallucinated specifics about real businesses.** This is the serious one, because **the exposure is a real business's reputation and not only ours** — invented hours, invented prices, an invented event. A wrong answer about a made-up thing is embarrassing; a wrong answer about Maya's bakery is something Maya did not consent to. **Grounding every specific in a retrieved row, and declining rather than inferring, is a product requirement here rather than a quality preference.**
3. **Cost per query**, which is unlike every other surface in the product: it is per-use, it scales with curiosity rather than with members, and it is the first thing in SocialUs where a member being engaged costs money.
4. **What the answer is when nothing is on tonight.** The pull toward filling the silence is exactly what `design-language.md` principle 11 and the empty-state rules already refuse elsewhere. **Nothing on is a true and acceptable answer**, and it is the single most likely answer in the first months.

## The line it must not cross

**The answering layer sees only what it retrieves, and it retrieves as the person asking.**

- **`browse_feed` is `security invoker`**, so called as the asking member, RLS and its own predicates apply unchanged — the follower-restricted half is withheld in the database, not by a client. **Any retrieval path added later must hold the same property**, and a `security definer` retrieval function would silently break it.
- **An assistant that leaks what the UI withholds is the worst version of this feature**, and it is worse than not building it: the restriction stops being a rule and becomes a bug that only some people know about.
- **A summarised answer is still a disclosure.** Retrieving a restricted row to *inform* an answer discloses it just as surely as printing it.

**One correction, because a rule is being relied on that does not exist.** The private-residence half of this line — *public places show an address to everyone, private residences only to invited or responding members* — **is not ratified anywhere in this repo.** What is ratified says close to the opposite: `nouns.md` (2026-09-09) — *a Page's address is public if given* — and `model.md` — *"Never a home address, and if someone enters one anyway, it is shown publicly."* **So there is no residence rule for the answering layer to hold; there is a rule that addresses are shown.** If the intended boundary is the one described, **it is a new ruling Don has to make**, and it governs the Page surface first and the answering layer only as a consequence. `policy.md`'s GPS-stripping rule is the nearest thing on the books and is about uploads, not addresses.

## Not in scope here

Which model, self-hosted or API. What the thin public tier contains — that is the `socialus-web` document. Creator-side agent assistance, which is a different thing already named in `product/systems/creator.md` and gated on standing presence; conflating the two would put a member-facing answering surface behind a business-membership gate for no reason.
