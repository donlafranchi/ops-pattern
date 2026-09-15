---
id: what-page-kind-tools
purpose: Which tools each Page kind gets, and the finding that seven Page kinds have three distinct tool sets.
layer: what
status: draft
date: 2026-09-15
---

# The tools mapping

**Draft, 2026-09-15. A first cut to react to, not a ruling.** This is the mechanism behind three separate rulings that all assumed it — *"it just doesn't require all of the same tools"*, the baseline every Page gets, and the `event` Page kind. **It has never existed in schema or in a document.**

Written under the bare-term rule in `nouns.md` § A vague term is never used by itself.

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
| **Dormancy** | `groups.md` — 90 days for community kinds, never for business |
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
2. **Business** — adds selling and the business claim, and is the only kind that never goes dormant.
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
