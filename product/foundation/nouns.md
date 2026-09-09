---
id: why-nouns
purpose: The nouns — every entity the product has or will have, what each carries, what each deliberately does not, and whether it ships. Replaces primitives.md.
layer: why
status: active
owns:
  - person-member-primitive
  - item-primitive
  - location-primitive
  - group-primitive
  - page-definition
  - no-business-entity
  - noun-index
---

# The nouns

> **One of three tracking documents**, with [`verbs.md`](verbs.md) (what may be done to each noun) and [`../ui/surfaces.md`](../ui/surfaces.md) (where things show). **Together they track what this app does and will do — not only what ships on 30 October.**
>
> **Postponed nouns are in this document, labelled.** A noun that is coming is a fact about the model; leaving it out to keep the launch list clean is how the model stops describing the product. **Every entry carries a status and there is no entry without one.**
>
> **This document is the model — what things *are*. `surfaces.md` is where things *show*.** Keep them apart. **Conflating the two is how this project's worst failures happened** — the Sell door being the only create path was a surface decision that silently became a model decision, and nobody noticed because one document would have described both.

**Where this is heading**, as distinct from what ships:

> A local discovery and community-building platform — the organizing backbone for decent, caring people to find each other, meet up, trade, volunteer, and buy from and sell to their neighbors. Someone with a new idea — a workshop, something homemade, any idea at all — can put it to the community, and others signal real interest before it exists, turning ideas into local economic activity.

**The product is SocialUs.** *Better Together* is a tagline, not a name.

## Status vocabulary

Used identically in all three documents.

- **● Live** — exists in the schema and has a working surface.
- **◐ Substrate only** — the table exists; nothing writes to it, or nothing reads it.
- **○ Postponed** — ruled in, not scheduled. Shape may be settled; build is not.
- **✕ Refused** — deliberately absent. The reason is the entry.

---

## The spine

Three core nouns carry every loop: **Person, Item, Location.** A fourth — **Group** — exists for the moments when a set of people decide they are an intentional, self-selected unit. Groups are emergent and optional: most loops work without them, and **no Member is ever auto-assigned to one.**

**The grammar:** people declare things · things attach to places · some people choose to be a Group · other people respond.

### Person

A real human. One record per human. Holds verbs (makes, services, convenes, stewards, initiates, follows, attends, pledges) rather than role-as-identity. A Person isn't *a Maker* — a Person *makes things*, and that surfaces as Items they hold and memberships they chose.

Schema name **Member**; "Person" is the conceptual term. Detail: [`../systems/member.md`](../systems/member.md).

### Item

Anything a Person declares: a product, a service, a gathering, an idea, an offer, an ask, an initiative. One spine, varying by `kind`, with kind-specific child tables. Each Item has its own page, URL, optional Location attachment, optional schedule. Detail: [`../systems/item.md`](../systems/item.md).

### Location

A physical place — permanent, recurring-temporary, or area. Locations have no members; if you want members, you need a Group. Detail: [`../systems/location.md`](../systems/location.md).

### Group

A named, intentional, self-selected set of people organized to do things together. Six kinds: five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) and one operate (`business`). **Emergent and optional — never auto-assigned by geography or by anything else.** Detail: [`../systems/groups.md`](../systems/groups.md).

---

## Page — the canonical definition

*(Ratified 2026-09-07. The UI name for a `groups` row. This is the line every other doc is checked against.)*

**A Page is the person or people behind the listing. Page is *who*. Item is *what*.**

- **A Page holds many Items and dates over time**, and carries identity, a name, a face and followers. **An Item is one thing offered or one occasion.**
- **One-time things are Items. Long-duration things are Pages.** A one-time event is an Item with a date, filed under a Page. **No Page is ever created for a single occasion.**
- **Pages have varying lifespans** — a business runs for years, a season of selling runs for months and is retired. **People create them sequentially, not simultaneously.**
- **A Page may sell, host, or both**, and needs no business record to do either. **The business record is a claim about the Page, not a permission.**

**Why the line is drawn here.** For a one-time event the two collapse, and the temptation is to let a Page be a single event. **Refused: browse and the map would index Pages that are really listings, and a follower graph on ephemeral Pages is worthless.**

**Three consequences.**

- **The map's unit is the Page.** Search sourdough and see the bakers, not individual loaves.
- **One Page is one place.** A two-location bakery is two Pages. *(Ratified 2026-09-07 — which is why the map needs no grouping: pins are one-per-Page by construction.)*
- **A Page with no fixed place of its own is found through the places it appears at.** A food truck is discovered via the venue's Page, not pinned at an address it does not have.

> **The intent behind the surface, in the PM's words: *we would like people to find themselves on a map.*** Not a feature — the reason the rest is worth building. **Every decision about the map is checked against that sentence.**

**Anything in the past does not appear.** Time-based, automatic, no manual cleanup. An Item with a date drops off once that date passes; an Item with no date never drops off; a gathering with no date at all does not surface, because nothing can tell whether it has happened.

### A Page's address is a public location

*(Ratified 2026-09-09.)* **A Page gets a street address if it has a specific location, or a neighbourhood if it does not.** Having premises is what decides it — not the Page's kind.

> **We mean a PUBLIC location, not a home address. We won't stop someone entering a home address, but it is shown to anyone who views the Page — it does not stay private.**

**Copy consequence, which is a build requirement:** the address field needs wording making public visibility **unmistakable before anyone types into it**, with the neighbourhood alternative visible in the same moment. **No legal or tax language in that string, or any user-facing string — standing rule.**

---

## The nouns that ship

**The "deliberately does not have" column is the load-bearing one.** Nearly every problem found on 2026-09-07 was something quietly acquiring a property it was never meant to have: selling acquiring business-ness, a Page acquiring a permanent kind, a role acquiring a badge.

| Noun | Status | What it is | What it has | **What it deliberately does not have** |
|---|---|---|---|---|
| **Member** | ● | One real human, one account | A handle, a name, a bio, follows, privacy settings | **No type, no tier, no account kind, no stored role.** No badge the platform awards. No rating, score or label it did not write itself. |
| **Page** | ● | The person or people behind the listing | A name, a description, Items, followers, a category, a photo, an address or a neighbourhood, optionally a Venue, optionally a business claim | **No permanent kind that gates anything.** No permission granted by its business record. **No Page for a single occasion.** No conversion into another Page — you make a second one. |
| **Item** | ● | One thing offered, or one occasion | A kind, a title, a description, a Page, a Location attachment, optionally a date | **No independent existence off a Page.** No response counter shown to its author. **No date on a product** — a thing for sale is not an occasion. **No photo yet** — deferred to the Page, which is the unit that carries a face. |
| **Venue** | ● | A physical place, which may host other people's Items | An address, a kind (permanent / recurring-temporary / area), its own public surface, followers | **No owner by default.** No requirement that a Page have one — an itinerant Page has none and is found through the Venues it appears at. |
| **Place** | ● | Platform-curated geography — neighbourhood, city, county, metro, state | A polygon, a hierarchy, a slug that anchors every public URL | **No member-facing create surface.** Nobody adds a Place. |
| **Surface** | — | A screen | A job, and one question it answers | **Not an entity. Nothing is stored about it.** **Never call a screen a Page** — that word is the person or people behind the listing. Listed here only to keep it out. Screens live in [`../ui/surfaces.md`](../ui/surfaces.md). |

## The nouns that are coming

**Ruled in. Not scheduled, or scheduled and unbuilt.** Each is a real part of what this product is; none of them ships on 30 October except where noted.

| Noun | Status | What it is | Shape, where settled | **What it deliberately does not have** |
|---|---|---|---|---|
| **Announcement** | ○ | A creator telling followers and group members what they have upcoming — a sale, an appearance, a new item | **Ruled 2026-09-09.** Table is **`page_posts`, not `bulletins`** — the Page is the board, an announcement is the first kind of thing posted to it. **The nullable `parent_post_id`, a real `author_member_id`, and `kind` all land in the first migration.** PM's reasoning: *"I never want to have to do a migration and a rewrite."* Responses go to `page_post_responses` with a nullable `option_id`. | **No edit and no delete after posting** — a broadcast that can be rewritten after people read it is not a broadcast. **No inbox, no unread state, no mentions, no notifications** — the board is a place you go. |
| **Discussion message** | ○ | A reply on a Page's board — the coordination half of a group | **Board increment one.** A reply is a post with a parent, which is why the parent column lands in the first migration. **One level of reply, not a tree** — a nested thread is a different product and needs moderation tools that do not exist. | **Not a forum yet.** Member-*authored* posts (as opposed to replies) are increment two and **need the operator concept, which does not exist anywhere in the code** — no role, no flag, no check. |
| **Direct message** | ○ | One person writing to another | **No substrate.** `member_threads` is named in the member spec and does not exist in any migration. **Nothing exists: no messages, no threads, no comments.** | **Never Location-scoped.** No surface addresses "everyone in West Sac" — the accountable-participation commitment in [`policy.md`](policy.md) is honoured by absence, and that survives whatever messaging becomes. |
| **Idea** *(schema `wonder`)* | ○ | Someone puts a new thing to the neighbourhood — a workshop, something homemade, any idea at all — and others signal real interest **before it exists** | **Substrate shipped, mechanic deferred.** The `wonder` Item kind exists; the signalling mechanic, threshold logic and tipping-point conversion to a real Item are not designed. **The most distinctive thing in the positioning and the hardest deferral on the list.** | **No interest count that means anything yet** — the response table has no write path. |
| **Volunteering** *(schema `offer` / `ask`)* | ○ | *"We need hands Saturday"* → *"I can come"* | **Kinds exist, no composer.** Blocked by the reply channel, not by the composer. **A Page board unblocks it inside a group; reaching strangers across the neighbourhood stays blocked.** | — |
| **One-time gathering** | ○ | A single occasion with a date | **Postponed 2026-09-08, narrowly.** Recurring gatherings and open meetups ship; one-time occasions do not. The composer's first step already has the seam — three cards, show two. In the data: **rule present → recurring · no rule but a date → one-time · neither → open meetup.** | **No RSVP.** A recurring group's occurrences do not exist as rows, so there is nothing to RSVP to; *"I'm coming to the run club"* is what **membership already says**. |
| **Appearance** | ○ | A Page at a Venue for a bounded time — the food truck at the market | **Position resolver shipped with the branch open** [T143]. **Appearances cannot overlap in time**, refused at creation. Enforcement needs a `btree_gist` exclusion constraint, which needs appearance rows to carry a real time range rather than loose JSON. | **Not scenarioed.** No ticket is appearance-shaped. |
| **Operator** | ○ | Whoever can remove someone else's content | **Nothing exists** — no role, no flag, no check anywhere in the code. The takedown scenario relies on a distinction that has nothing to stand on. | — |
| **Poll** | ○ | *Do people want this?* on a Page | `page_posts.kind='poll'` plus `page_post_options`, reusing the response table. **Separate substrate from demand signals, deliberately**: a poll's options are rows with foreign keys; a demand signal's subject does not exist as a row and must have no foreign key. Same principle, opposite shapes. | — |

**On volunteering, the PM's reasoning, recorded because it changes how the deferral should be read:**

> **"I'm guessing people will find a way to use the pages we offer them now to do whatever they want including hosting and volunteering."**

**Which is the argument for shipping the general thing and watching**, rather than modelling each activity before anyone has tried. A Page, an Item with a date, and a board cover more of the product's surface area than a purpose-built volunteering feature would.

## Refused, and why

| Not a noun | Why |
|---|---|
| **Business entity** ✕ | No corporate shell between Persons and the things they declare. **Every Item has a named human accountable for it.** Money flows Member-to-Member or Member-to-business-Group; tax surfaces are a federation handoff, not a schema fix. **When a feature seems to want a corporate row: attach to the Member, or to the business Group. Never to a shell.** *(Full rationale below.)* |
| **Role** ✕ | Roles are verbs a Member is doing, surfaced from activity. **The moment a `role` enum lands on `members`, the primitive collapses into a directory-of-types.** Same for any "is this a business" boolean. |
| **Follow on a product or service** ✕ | *Ruled 2026-09-07: "people aren't really going to follow products or services."* **Removed as a concept, not deferred.** |
| **Location-scoped messaging or feed** ✕ | No surface addresses everyone in a place. Accountable-participation, honoured by absence. |
| **Cooperative governance** ✕ | Voting and distributions are off-platform verbs — securities law, operating agreements, tax handling. Modelling them in schema implicitly claims the platform can answer whether a vote is legally binding. **Business Groups with multiple owner-role memberships carry the cooperative *shape* without the legal obligations.** |

### Why no Business entity

The closest construct is a `kind='business'` Group, which is itself a Group of Members — not a corporate record.

- Maya doesn't *have* a business called Oak Park Sourdough as a separate record. It is a business Group with Maya as sole owner-role member. **Her Items belong to her**; the Group is the operating context she chose.
- A cooperative bakery isn't an entity that owns Items. It is a business Group with multiple owner-role memberships.
- "Business name" on any surface is a Group label, not a separate record.

**Three reasons it matters.** It keeps the platform people-first structurally rather than rhetorically — there is no place in the schema for an LLC to obscure who is doing the work. It protects against the directory-of-companies failure mode, where the person is invisible behind a corporate listing. And it makes cooperative formation a first-class outcome rather than a new entity type.

> **Intent:** The local restatement here is what prevents future *"but Items need to FK to something corporate for tax handling"* proposals. **Test for future proposals:** does this want to give a Group ownership of Items or other Groups, even indirectly through metadata or proxy Members? If yes, refuse.

**The exception is federated handoff.** At Loop 13 a community fund grows into a CDFI and a cooperative federation grows into a cooperative-services platform. Those platforms have their own entities; this one federates through identity and protocol rather than absorbing their data model.

---

## The relationships

- **Person ↔ Item** — creates, holds, collaborates on, responds to.
- **Item ↔ Location** — anchored at, with optional schedule.
- **Person ↔ Location** — three purpose-owned substrates, not one affinity table: `members.home_location_id` (locality default), `member_place_interests` (community-awareness scope, owner-only), `member_saved_searches` scoped to a location (the follow-this-venue affordance). **None grants addressability.**
- **Person ↔ Person** — follows. **Messages do not exist.**
- **Person ↔ Group** — founder of, steward of, owner of, member of. Soft affiliations are inferred and surface-only; **never written as full membership without consent.**
- **Item ↔ Group** — optionally filed under one Group. `items.group_id` is the filing surface; `items.member_id` is the responsible human, and it is `NOT NULL`.
- **Location ↔ Group** — Groups optionally anchor to a Location for geographic gravity.

**The relationship surface is intentionally flat.** There is no Business that owns Items at a Location and employs Persons.

---

## Where the build and the model disagree

*Open entries carried forward from 2026-09-07 and rechecked 2026-09-09. **These are gaps, not intentions written as if they shipped.***

| Disagreement | State |
|---|---|
| **Four reads still require a Page to be a business** — item creation, the product and service resolvers, the venue's owning-Page lookup | **Partly closed.** Item creation's gate was removed; the gathering resolver never had one, which is the asymmetry that produced two bugs. Product and service resolvers still filter `kind='business'`. Ticketed [T134]. |
| **The venue surface shows only its own Page's Items** — a visiting Page's attachment is stored and not read | **Open.** Ticketed. |
| **The browse index applies no time filter** — past occasions still appear there and on the map | **Open.** |
| **A Page has no image and no editor** — the fields exist and nothing writes them | **In build.** Column and storage substrate shipped [T120, T141]; the composer step and editor are open tickets [T145, T126]. |
| **Conversation attaches to nothing** — no message, thread or comment anywhere | **Open, and now ruled.** *"A Page is where conversations happen"* has a shape as of 2026-09-09 and still has no substrate. |
| **Following delivers nothing** | **New, found 2026-09-09.** `locality_feed_items` takes a place and interest tags and **takes no follow input.** Follows are read on the member surface and the following list only. **Following someone records an intention and nothing else happens.** |
