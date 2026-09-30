---
id: what-page-kind-tools
purpose: Which tools each Page kind gets, and the finding that seven Page kinds have three distinct tool sets.
layer: what
status: draft
date: 2026-09-15
---

# The tools mapping

**Draft, 2026-09-15. A first cut to react to, not a ruling.** This is the mechanism behind three separate rulings that all assumed it — *"it just doesn't require all of the same tools"*, the baseline every Page gets, and the `event` Page kind. **It has not existed in schema or in a document.**

Written under the bare-term rule in `nouns.md` § A vague term is not used by itself.

## The tool list, derived not invented

Every tool below exists in the schema, in an approved scenario, or in a ratified ruling. Nothing here is imagined.

| Tool | Where it comes from |
|---|---|
| **Announcing** | `page_posts` |
| **Page following** | F065, F067 — a `relationship` column on `group_memberships` |
| **Group membership** | `group_memberships`, with `explicit` and `soft_via_*` sources |
| **Entries** — product · service · gathering · idea · offer · ask · initiative | `items.kind` and its child tables |
| **Responses** | `item_responses` |
| **Recurrence** | `item_gatherings.recurrence_rule`, and the rotation process `item.md` specifies |
| **Business claim** | `group_businesses`, `member_business_jurisdictions`, the Locally-Owned badge |
| **Tags** | the `page_tags` migration; *"tags are the only vocabulary"* |
| **Location anchor** | `groups.anchor_location_id`, address or neighbourhood |
| **Appearances** | `groups.md` — an appearance at a venue takes precedence over the anchor |
| **Photo, or art that admits it isn't one** | F070 |
| **Dormancy** | `groups.md` — 90 days for community kinds, none for business |
| **Messaging** | nothing. Named because Don's baseline says "later" |

## The mapping

**●** needed · **✕** not needed · **◐** open

| Tool | place | interest | practice | event_anchored | family | business | **event** |
|---|---|---|---|---|---|---|---|
| Announcing | ● | ● | ● | ● | ● | ● | ● |
| Page following | ● | ● | ● | ● | **✕** | ● | ● |
| Group membership | ● | ● | ● | ● | ● | ● | **✕** |
| Entry: gathering | ● | ● | ● | ● | ● | ● | ● |
| Entry: product | ◐ | ◐ | ◐ | ◐ | ✕ | ● | ✕ |
| Entry: service | ◐ | ◐ | ◐ | ◐ | ✕ | ● | ✕ |
| Entry: idea | ● | ● | ● | ● | ◐ | ◐ | ✕ |
| Entry: offer / ask | ● | ● | ● | ● | ● | ◐ | ✕ |
| Entry: initiative | ● | ● | ● | ● | ✕ | ◐ | ✕ |
| Responses | ● | ● | ● | ● | ● | ● | ● |
| Recurrence | ● | ● | ● | ● | ● | ● | **✕** |
| Business claim | ✕ | ✕ | ✕ | ✕ | ✕ | ● | ✕ |
| Tags | ● | ● | ● | ● | ✕ | ● | ◐ |
| Location anchor | ● | ● | ● | ● | ✕ | ● | ● |
| Appearances | ◐ | ◐ | ◐ | ◐ | ✕ | ● | ✕ |
| Photo or default art | ● | ● | ● | ● | ● | ● | ● |
| Dormancy | ● | ● | ● | ● | ● | **✕** | ◐ |
| Messaging | later | later | later | later | later | later | later |

### What would settle each open cell

- **Selling from a community-kind Page** *(product, service on the five affiliate kinds)* — a run club selling singlets is the real case and it is not hypothetical. **Settled by whether a community-kind Page selling a thing needs a business claim.** The 2026-09-07 ruling *"nothing gates selling"* says it does not, which argues for **●** — but nobody has said so about these kinds specifically.
- **Ideas, offers, asks, initiatives on a business Page** — settled by whether a bakery asking for help is acting as a business or as a person. No ruling exists.
- **Ideas on a family Page** — settled by whether a family Page is a coordination surface or only a private roster.
- **Tags on an event** — a one-off is hard to find without them and clutters the vocabulary with them. In `PAGE-KIND-OCCASION.md`, unruled.
- **Appearances for community kinds** — settled by whether a book club that meets at a different pub each month is an appearance or just a post with its own address. `page_posts` already carries a post-level location, which argues **✕**.
- **Dormancy on an event** — an event is over the day after it happens. Whether that is dormancy, dissolution, or simply dropping out of browse on the existing past-date rule.

## The finding: seven Page kinds, three tool sets

**`place`, `interest`, `practice` and `event_anchored` want identical tools. Every cell in those four columns is the same.**

What actually separates them is **what the social group is about** — a neighbourhood, a topic, a craft, an event people met at. **That is what tags are for**, and tags are already ratified as the only vocabulary. `event_anchored` additionally carries `seeded_by_item_id`, but that is provenance — a record of where the social group came from — not a tool anyone uses.

**`family` is the community set minus discoverability.** Its real difference is one `BEFORE INSERT` trigger defaulting it to private. Every tool it loses, it loses because nobody outside can see it, not because a family cannot do it.

**So the honest count is three distinct tool sets:**

1. **Community** — the five affiliate kinds. `family` is this set with privacy on.
2. **Business** — adds selling and the business claim, and is the only kind that doesn't go dormant.
3. **Event** — loses recurrence, group membership and everything commercial.

**That is evidence the four community kinds should merge.** Four values that produce one tool set are four ways to get the same Page and one more decision at creation that buys the person nothing — the same argument that retired the twelve categories. **The counter-argument, and it is real:** `event_anchored`'s child table exists and is referenced by a deferred foreign key, and `family`'s private default is load-bearing. **Merging is a recommendation, not a conclusion, and it is Don's call.**

## Don's baseline, checked across all seven

**The ruling: every Page gets announcing and a following list, with messaging later.** *(2026-09-15.)*

**Announcing is coherent on all seven.** Even an event needs it — *"moved to the back garden"* is the case.

**A following list is coherent on six and makes no sense on one.** **A family Page should not have Page followers.** It defaults to private, and the whole point of the kind is that outsiders cannot see it; a follow relationship on it is either meaningless or a privacy hole. **Family joins, it is not followed.** `group_memberships` already gives it joining, which is the right shape.

**One more thing the baseline exposes:** an event gets Page following but not group membership, and a family gets the reverse. **Those two tools have been treated as one thing in every discussion so far, and they are not** — F067 already says so at the schema level, one `relationship` column with two values. The baseline should read **"announcing, and either following or joining"**, not "announcing and a following list".

## What is real

**Exists and works:** group membership · entries of every type · tags · location anchor · business claim · dormancy.

**Exists as a table with no writer:** announcing (`page_posts`, no reader either) · responses (`item_responses`, four readers and no writer) · recurrence (the column exists; **the rotation process that `item.md` specifies appears nowhere**).

**Specified and unbuilt:** Page following — **there is no table in which a Page can be followed**; `member_follows` is member-to-member. F065 approved, F067 draft · photo and default art, F070 ticketed · appearances, scoped at ~1.5 days.

**Neither specified nor built:** messaging · the mapping in this document, as anything a machine reads.

**So of eighteen tools, six work, three are half-built, three are specified, and the seventh row of the table — the `event` Page kind itself — does not exist yet either.** The mapping is worth writing down now because it is cheap and because three rulings already depend on it. **It is not worth building as configuration until something gives any Page kind a tool at all.**

---

# Proposal: merge the four community Page kinds into one

**Draft, 2026-09-15. Acting on this document's own finding rather than leaving it a remark.**

**The four — `place`, `interest`, `practice`, `event_anchored` — produce an identical tool set. Every cell in those four columns matches.** Four values that yield one set of tools are four ways to get the same Page and one more decision at creation that buys the person nothing. **That is the argument that already retired the twelve categories**, applied to the layer above.

## What the merged Page kind is called

**`community`.** Not invented — `groups.md` already calls these four *"community kinds"* in prose, and `discovery.md` and the dormancy rule both use the term. **The word is already doing the job informally; this makes it the value.**

Rejected: `social` (a family Page is social too, and family does not merge) · `group` (a listed vague term, and the `groups` table holds every Page kind) · `interest` (promoting one of the four over its siblings).

**Result: four Page kinds — `community`, `family`, `business`, `event`.**

## What happens to the child table

**`group_event_anchored` survives and stops being coupled to a Page kind.** It holds one meaningful column, `seeded_by_item_id` — a record of the gathering a social group formed out of. That is **provenance, not a tool**, and it is true of some community Pages and not others, which is exactly what a nullable 1:1 child is for.

**It should be renamed**, because its current name is doubly misleading after this ruling: it says "event", which now means a one-time gathering Page kind, and it describes a social group seeded by a gathering — **which is usually a recurring one, the opposite of an event.** **Recommendation: `group_seeded_by`.** Not applied — see the flag below.

**The deferred foreign key is unaffected.** `group_event_anchored.seeded_by_item_id` still has no constraint, still points at `items`, and the merge changes nothing about it.

## What is lost

**Honestly, three things, and two of them are already solved elsewhere.**

1. **The ability to query "all practice Pages."** **Already solved by tags**, which are ratified as the only vocabulary and are the creator's own words rather than four buckets someone chose for them.
2. **A signal at creation about what the Page is for.** **Already solved by the create walkthrough** — F087 asks what you are starting, and the answer selects copy and tools. A person picking between "a neighbourhood group" and "an interest group" is being asked to classify a thing the product then does nothing different with.
3. **Genuinely lost: four values' worth of historical intent.** Somebody chose those four for reasons, and the reasons are not written down anywhere this document could find. **That is the real cost of merging, and it is an argument for asking rather than assuming.**

**Not lost:** `family`'s private-by-default trigger, which is untouched because family does not merge. It is the one community-shaped kind with a load-bearing difference.

## Cost

**Cheap in schema:** one check constraint, and a data migration over rows whose count is small — the seeded database has three social groups.

**Not cheap:** every read path that branches on Page kind, and `member_has_standing_presence`, which is defined as *"≥1 business owner/staff membership OR steward role in any non-business Group"* — that survives a merge unchanged, but it should be verified rather than assumed.

**Recommendation: do not merge before launch.** It buys the person nothing they would notice, it touches a view that gates standing, and the four values are harmless while the create walkthrough is what a person actually meets. **Merge when the walkthrough ships and the four prove to be one question nobody can answer.**

## Flagged, not applied: `event_anchored` is now a misleading name

**Independent of the merge.** The value means *a social group that formed out of a gathering people met at* — and if that gathering was recurring, "event" is now precisely the wrong word for it, since **event means one-time as of Don's ruling today.**

**Recommendation: rename the value to `seeded` and the child table to `group_seeded_by`.** **Not renamed unilaterally** — it is a schema value with a deferred foreign key attached, and the merge above would retire the value anyway. **If the merge happens, this fixes itself; if it does not, the rename is worth doing on its own.**

---

# Proposal: a label layer in front of the Page kind

**Draft, 2026-09-15.** Don: *"For all the types that are similar, we should let people choose based on their terms, but then it just directs them to whatever we're calling it behind the scenes so they don't need to guess based on an incomplete list of options."*

**The person picks a label in their own words — run club, book club, neighbourhood group, farmers market, supper club, congregation. That label maps to a Page kind. They don't see our taxonomy or guess which of our words their thing is.**

**A label names what someone is starting, not what it is about.** *(Guard added 2026-09-15 — Don: "We don't need categories for kinds.")* *Run club* and *supper club* are labels. **"House and home", "Art and artists", "Outdoor goods" are subject matter and are not labels** — subject matter is what tags already carry, freely and without approval. **A subject list entering the label mapping would be a category layer over Page kinds arriving through the back door**, which is the thing the ruling refuses.

## Shape: many labels, one Page kind

**Many-to-one.** Dozens of labels map to `community`; a handful to `business`; a handful to `event`; `family` gets its own few. **The label is what the person chose and what the interface says back to them. The Page kind is what decides tools.**

## Where the mapping lives: a table, and this is the decision that matters

**Labels will be added constantly. That single fact rules out the other two options.**

| Option | Cost to add a label | Verdict |
|---|---|---|
| **A table** | one row | **Proposed.** |
| A configuration file | a pull request and a deploy | **Rejected** — a deploy per label means labels stop being added, and the list goes stale exactly the way an incomplete list of options does. That is the problem this exists to solve. |
| Seeded data, edited by migration | a migration and a deploy | **Rejected**, same reason, plus migration history noise. |

**And this shape is already ratified here, so it is not a new pattern.** The search dictionary was settled on 2026-09-13 as **an LLM agent proposing entries and a human approving them**, growing from what creators actually write. **The label mapping is the same mechanism on a different vocabulary, and it should reuse it rather than inventing a second approval queue.**

**The label is member-authored text other people see, so [member-content-takedown] applies** — no production without a report-and-takedown path — exactly as it does for tags.

## What happens when a label is not in the mapping

**This is the case that needs an answer rather than a shrug.**

**The Page is created. The label is kept as the person typed it. It maps to the default Page kind for the shape of thing they were starting, and it enters the same proposal queue the search dictionary uses.** A human maps it later; nothing about the person's Page changes when they do, because the tools came from the kind and the kind was already assigned.

**Why that is safe and "Something else" was not.** *"Something else"* was retired on 2026-09-13 because its rows *"sat unread by anything"* — **it mapped to nothing and did nothing.** A label maps to a real Page kind and does real work the moment it is typed: the Page exists, it has tools, it is findable. **The mapping is an improvement to vocabulary, not a prerequisite for the Page working.** That is the whole difference, and it is structural rather than a promise to be diligent.

**One guard worth writing down:** the queue must be read by something. The search-dictionary decision already names the reader — an agent proposes, a human approves — so **the label queue inherits a reader rather than needing a new one.** *(That reader survives the 2026-09-15 ruling that a zero-result search is not a signal: the dictionary still grows from creators' tags, which was always its first and better input.)* A queue with no named reader is how "Something else" died.

## This dissolves the merge argument rather than answering it

**The case for four community Page kinds was not that they behave differently — this document showed they do not. It was that four words give a person more recognition than one.** A label layer gives more recognition than four ever could, without a taxonomy to guess at.

**So merge behind the scenes and multiply labels in front.** Four kinds become `community`; run club, book club, neighbourhood watch, quilting circle, congregation and everything else become labels pointing at it. **The person gets their own word. The system gets one tool set to reason about.**

## It closes the farmers-market gap

**`model.md` records that a market "convenes commercial vendors without selling anything itself" and fits none of the six Page kinds cleanly. Under this proposal it does not need to: a farmers market is a label.**

**Which kind it points at is a real question and a small one** — `community`, since a market convenes people and the market itself sells nothing, while each vendor holds their own `business` Page. **The gap closes because the market didn't have to be a kind; it had to be a word.**

## What this costs

**Cheap:** the table, and a seed list of labels. The mapping is read once at creation and not again.

**Not cheap, and not new:** the approval queue needs a surface, and **the operator concept still does not exist in the code** — the same blocker the search dictionary already carries. **Both should be built once, for both vocabularies.**

**Answered 2026-09-15, and it turns the escape hatch into the research mechanism:** an **Other** option opens an explainer describing the kinds by what each lets you do, from which a person either picks the closest or says what is missing. **Nothing is stored as "other".** Written as **F088**, which also takes the position that the unmapped-label queue, the Other queue and the search dictionary are **one queue with three sources**, reusing F064's approved signal table.

**This document is what the explainer must agree with** — F088 criterion 3 forbids the page from showing a tool the mapping does not grant, or omitting one it does.

**Still open — Don rules:** whether a person may type a label freely or picks from a suggested list with free text as the fallback. **Free typing gets the recognition he is after; a suggested list gets a cleaner vocabulary.** The search dictionary faced the same choice and took both — suggestions up front, free text accepted, an agent proposing from what people actually wrote.
