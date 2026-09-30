---
id: why-nouns
purpose: The nouns — every entity the product has or will have, what each carries, what each deliberately does not. Spine document: every entry carries its own status and holds both horizons, what ships now and what is intended later. The future version of a noun is a status on its entry here, never a second description elsewhere.
layer: why
status: active
---

# The nouns

> **Agent summary of [`model.md`](model.md), not a ruling. Cite the source or a `DECISIONS.md` line.** *(Marked 2026-09-15: this banner is where the Items drift came from — a paraphrase read as authority. Its claim that "there are no Items" is **disputed by Don and unsettled**; see [`../../planning/ITEMS-QUESTION.md`](../../planning/ITEMS-QUESTION.md).)* Where this document and `model.md` disagree, `model.md` is right — and neither this banner nor any summary of it settles anything.

One of two tracking documents, with `verbs.md` (what may be done to each noun). Together they're the model — what things *are*. `surfaces.md` is where things *show*. Keep the two apart; conflating them is how this project's worst failures happened (a surface decision — Sell as the only create door — silently became a model decision, because one document described both). Postponed nouns are listed here, labelled — leaving them out to keep the launch list clean is how the model stops describing the product.

**Status vocabulary**, used identically in `verbs.md`: **●** live (schema + working surface). **◐** substrate only (table exists, nothing reads/writes it). **○** postponed — ruled in, not scheduled. **✕** refused — deliberately absent, the reason is the entry.

**Two horizons on one entry:** `● now / ○ later` — what ships and what is intended. A concept lives in exactly one place, so the later horizon is a status here, never a second description in `IMAGINE.md` or anywhere else.

**Entry format.** One line when one line says it. When an entry has more to carry, it breaks into **labelled slots** — and the slot names are a closed set, which is what stops this file growing into prose again:

| Slot | Holds |
|---|---|
| **Now** | what ships today |
| **Later** | what it becomes, and why that is not an increment |
| **Blocked** | the specific thing standing in the way |
| **Trigger** | the observable fact that would move Later to Now |
| **Never** | what the entry deliberately excludes |

No other slot names. A thing that fits none of them is either detail for a systems doc or a line for `DECISIONS.md`.

## A vague term is never used by itself

**Don's ruling, 2026-09-15:** *"Item or kind or any other vague term is never to be used by itself."*

**Every term on the list below must be qualified at the point of use.** Not *kind* — **Page kind** or **entry type**. Not *item* — the specific sense, always. This binds docs, scenarios, tickets, commit messages, and any code identifier read as prose.

**The list is short on purpose.** A term earns a place by having caused drift here, or by meaning different things at different layers. Forty words is a list nobody follows.

| Term | Why it qualifies | Qualify as |
|---|---|---|
| **item** | Umbrella over seven unlike things, and the word needed for a product offered for sale. Don named it. | the specific type — Product, Service, Gathering, Idea, Offer, Ask, Initiative — or **entry** for the umbrella |
| **kind** | **Two vocabularies with the same column name**: `groups.kind` has six values, `items.kind` has seven, and they classify different layers. Don named it. | **Page kind** · **entry type** |
| **group** | **The `groups` table holds Pages**, while *Group* in product language means a social group. `verbs.md` records these as *"routinely blurred in older docs and different nouns with different rules."* | **social group** · **business Page** · **group membership** |
| **follower** | `F067`: *"Today 'follower' and 'member' mean the same thing in the code."* Same row, two meanings, diverging behaviour. | **Page follower** · **group member** |

**On the watch list, not yet binding:** *post* (a `page_posts` row versus the act the voice guide refuses), *state* (several columns, several meanings), and **event** — which now carries three senses: the **`event` Page kind** (a one-time gathering, ruled 2026-09-15), **a dated post** (`model.md`, F073), and **an event-log row** (`member_events`, `item_events`, `group_events`, `place_events`, and `item.published`). **The first two are the same idea at two layers and are fine; the third is unrelated and is the one to qualify — say *event-log row*, never a bare *event*.** **They are named here so the list can grow with evidence rather than with suspicion** — add one only when it has demonstrably drifted.

**Prose versus identifiers.** The rule binds **prose**. **It does not rename a schema column** — `groups.kind` stays `groups.kind`, and no check may fail the build on the existing schema. An identifier is exempt where it is an identifier and bound where it is read as prose: a commit message, a comment sentence, a ticket title.

**Where this is enforced:** § The user-facing string check, below. **Where it cannot be:** ordinary English. *"What kind of gathering"* and *"be kind"* are not violations, and no check can reliably tell them from the technical sense — which is why the bare-term check warns rather than fails outside a short list of certain cases.

## The spine

Three core nouns carry every loop: **Person, Item, Location.** A fourth — **social group** — exists for when a set of people decide they're an intentional, self-selected unit. Social groups are emergent and optional; no Member is ever auto-assigned to one. The grammar: people declare things · things attach to places · some people choose to be a social group · other people respond.

**Person** — a real human, one record per human. Holds verbs (makes, hosts, follows) rather than role-as-identity — a Person isn't *a Maker*, a Person *makes things*. Schema name `Member`. Detail: `../systems/member.md`.

**Item** — anything a Person declares: product, service, gathering, idea, offer, ask, initiative. One spine, varying by entry type (`items.kind`). **The word *Item* standing alone as an umbrella is what the rule above forbids; use the specific type.** Detail: `../systems/item.md`.

**Location** — a physical place (permanent, recurring-temporary, or area). No members of its own — for members, you need a social group. Detail: `../systems/location.md`.

**Social group** — a named, self-selected set of people. Six Page kinds: five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) and one operate (`business`). Never auto-assigned by geography or anything else. Detail: `../systems/groups.md`.

## The two sides — patron and creator *(internal vocabulary)*

*(Ratified 2026-09-14, Don: "Creator and patron are shorthand for you and me when discussing the two sides broadly.")*

**These are our words for talking about the product, not the product's words for talking to a member.** A creator is someone who publishes something other people show up for — sells, hosts, organizes. A patron is everyone on the other side. Use them freely in these docs, in scenarios, in tickets, in conversation.

**Never rendered in a user-facing string.** *(Restores `role-language.md`'s rule: no person-noun in front of a member.)* Not in copy, not as a label under a name, not addressing a set of people. A member is addressed as **you**; a set of people is **people**, or named. Everything a person *does* is a verb — make, sell, host, offer, ask, wonder, show up, back, follow, save.

**What was actually overruled** on 2026-09-14 is narrow: the old doc refused to let *us* name the two sides at all, even internally. That refusal is gone. **Its user-facing rule stands unchanged.**

**Neither is a stored type.** Patron is the default state of being a member, not a column; creator derives from the attestation record plus what the person has authored. The pair is vocabulary, not schema — see the `Member` row's "no type, tier, or stored role," which is unchanged by this ruling.

### The user-facing string check — because prose rules have not held

*(2026-09-14, extended 2026-09-15 with the mechanical rules from `voice.md`. Twice a naming ruling has been written wider than Don made it. `LESSONS.md` 17: a rule with no hook is a wish.)*

**Scope, for every rule below:** user-facing strings in `socialus-web` — JSX text nodes, and string literals reaching a rendered prop (`label`, `title`, `placeholder`, `alt`, `aria-label`, `children`). **Never** identifiers, table and column names, routes, imports, comments, test fixtures, or these planning docs. The rule is about what a member reads, not what the code calls things.

**Fails the build:**

| Check | What it catches | From |
|---|---|---|
| **Person-noun** | `vendor · producer · seller · maker · supporter · consumer · patron · creator` as a whole word | this document |
| **Em dash** | any `—` character at all | `voice.md` § Writing mechanics — "No em dashes, anywhere" |
| **"Corner"** | `corner` as a whole word | `voice.md` — reads as forced |
| **Corporate transitions** | `moreover · furthermore · additionally · essentially · in a world where` | `voice.md` |
| **Bare vague term, certain cases** | `item` / `items` as an umbrella, and `kind` immediately followed by a noun it does not qualify, in **docs and prose only — never in schema identifiers** | § A vague term is never used by itself |

**Warns, needs a human look — the pattern is real but the false-positive rate is not zero:**

| Check | What it catches | Why not a hard fail |
|---|---|---|
| **"not just X, but Y"** | `not just` within 60 characters of `but` | Don bans it *as a repeated tic*, not per instance. His own name-sharing line uses it once. |
| **Posting language** | `post · posting · share · sharing` as a verb about a member's own listing | "Share this link" is legitimate; "share a photo" is the failure. Only a reader can tell. |
| **Bare vague term, general** | Any of `item · kind · group · follower` in prose with no approved qualifier nearby | **Ordinary English is indistinguishable from the technical sense.** *"What kind of gathering"* must not fail a build. |

**Not checkable, and recorded as prose so nobody pretends otherwise:** no forced rule of three · CTAs point outward not inward · tone is warm and plainspoken · state things as fact not promise · no release numbers or internal jargon · no named-competitor comparison · real nouns over abstractions. **These live in `voice.md` and are enforced by reading, not by CI.** Saying so is the point — a rule filed as testable that no test holds is how the person-noun rule went unenforced twice.

**Escape hatch:** a line comment naming the dated `DECISIONS.md` ruling that permits it. No ruling, no exception — that is the whole point of moving this out of prose.

**Never** — a person-noun in any user-facing string, these two included. A third internal person-noun without a dated ruling. Producer, seller, maker, vendor, supporter and consumer as anything but spec words; "vendor" was removed from the product once already and is still in the code. Functional words — owner, staff, steward, host, founder — outside the scope of one Page or one gathering; they never become a profile-level identity.

## Page — the canonical definition

*(Ratified 2026-09-07. The UI name for a `groups` row — the line every other doc is checked against.)*

**A Page is the person or people behind the listing. Page is *who*; Item is *what*.** A Page holds many Items and dates over time and carries identity, a name, a face, followers.

**Amended 2026-09-15, Don's direct ruling: every kind gets a Page, including a one-time gathering.** *"We can create a page for every kind. It just doesn't require all of the same tools."* What differs between kinds is the tools the Page offers, never whether it is a Page. **This overrules the earlier "no Page for a single occasion"**, whose reasoning — that browse and the map would index listings as if they were people, and a follower graph on something ephemeral is worthless — is answered by the tools differing rather than the entity differing. **The `Page is who; Item is what` framing above is disputed and unresolved; see `planning/ITEMS-QUESTION.md`. It is not retired.** Pages have varying lifespans and are created sequentially, never simultaneously — a producer who also hosts makes a second Page, never converts the first. A Page may sell, host, or both, and needs no business record to do either — the business record is a claim about the Page, not a permission.

**Three consequences:** the map's unit is the Page, not the thing filed under it — search sourdough and see the bakers, not individual loaves. One Page is one place — a two-location bakery is two Pages, which is why the map needs no cross-location grouping. A Page with no fixed place is found through the Venues it appears at, never pinned at an address it doesn't have. Anything in the past doesn't appear — time-based, automatic, no manual cleanup.

**A Page's address is public if given** *(ratified 2026-09-09)* — a street address if it has a specific location, a neighbourhood otherwise; having premises decides it, not the Page kind. It's a public location, not a private one — the platform won't stop someone entering a home address, but it's shown to anyone who views the Page. The field must say so before anyone types into it.

**A residence's address is public too, at launch** *(Don, 2026-09-30)*. The protection is the option to give a neighbourhood instead of a street. **Revisit** withholding a residence address from anyone not invited or responding once RSVPs (F063) and a residence flag exist. The answering layer inherits whatever the Page surface holds.

## The nouns that ship

| Noun | Status | What it is | **What it deliberately does not have** |
|---|---|---|---|
| **Member** | ● | One real human, one account | No type, tier, or stored role. No platform-awarded badge, rating, or label it didn't write itself. |
| **Page** | ● | The person or people behind the listing | No permanent Page kind that gates anything. No permission granted by its business record. No conversion into another Page. **Its owner picks one or more collections from a curated set of about ten** *(2026-09-19 — reverses the 2026-09-13 "no category a creator picks"; a collection is platform vocabulary the owner selects from, not a second vocabulary they author)*. Overlapping, not exclusive. No collection a creator invents. |
| **Item** *(umbrella — qualify at use)* | ● | One thing offered, or one occasion | No independent existence off a Page. No response counter shown to its author. No date on a product. |
| ~~**Venue**~~ | ✕ | **Not a noun** *(2026-09-12)* — a venue is an organization hosting at a Location. The Page is justified by what the organization is; persistence is `locations.kind` (Harlow's `permanent`, a Saturday market `recurring_temporary`). | No entity of its own, and no Page kind. Anything can host — a bakery running a book club is a venue that evening, on the one Page it already had. |
| **Place** | ● | Platform-curated geography (neighbourhood → state) | No member-facing create surface. Nobody adds a Place. |

## The nouns that are coming — ruled in, not all scheduled

- **Response** `● now / ○ later` *(2026-09-12)* — a member says they are coming to an occurrence.
  - **Now** — a thumbs up or nothing. Presence or absence of a row, not a state column. The organizer sees two lists; names are shown; the public sees the count.
  - **Later** — four states: coming · not coming · seen and undecided · declined. A state column replacing a row's existence — a migration and a rewrite of every read, **not an increment**.
  - **Blocked** — `members.avatar_url` has no write path. The list shows faces; no member has one.
  - **Trigger** — an organizer saying the yes-list alone isn't enough to plan with.
  - **Later** — **confirmed by the organiser**, which makes a response an interaction for F077 *(2026-09-30)*.
- **Tag** ● *(2026-09-12, made the only vocabulary 2026-09-13; status corrected to live 2026-09-19)* — a creator's own word for what their Page is. **Created, not picked from a fixed list, and public.**
  - **Now** — **shipped.** `tags` and `page_tags` exist and are written by `group.activate`; `browse_feed` matches a lens on `tags.normalized` and excludes any tag whose `status` is not `visible`, so a tag taken down stops steering discovery rather than merely disappearing from display. **The only vocabulary a creator authors, and the only thing search matches.**
  - **Later** — editing tags on a live Page. **Written once, at activation** — there is no tag editing after that.
  - **Blocked** — nothing. The old blocker was report-and-takedown, and it **shipped**: `reports`, `report_decisions` and a reviewing surface are on main.
  - **Never** — a tag that orders results, or one the platform assigns. *(The third Never — "a coarse category a creator picks alongside it" — was reversed 2026-09-19. **Collections are exactly that**, and the line is struck rather than reworded so nobody cites it. What survives it: tags stay the only vocabulary a **creator authors**, and the only thing search matches; a collection is a name the platform owns.)*
- **Announcement** ● *(status corrected to live 2026-09-19; named the only word 2026-09-21)* — a Page says what is on. **One noun, one word, everywhere** — in the model, the docs and the product, with no creator-facing synonym and no per-kind vocabulary. **Its audience is a field on it, not a second noun**: public, or only people who get updates. **The post appears in browse** *(ruled 2026-09-12 — flat, not only the dated ones)*. Table is `page_posts`, not `bulletins` (2026-09-09) — the Page is the board, an announcement is the first kind of post. **Editable after posting** *(ruled 2026-09-13 — reverses the earlier no-edit rule)*; **delete still refused**; no inbox, no unread state.
  - **Now** — **shipped.** `page_posts` exists, `group.post_create` and `group.post_edit` write it, and `browse_feed` returns posts and Pages in one result set. **`group_id` is `NOT NULL`** — a post has no existence apart from its Page, which is what lets one query return both without inventing a second identity for the poster.
  - **Later** — a date, a time and its own address on a post (F072), and a series that repeats (F074, unruled). **`ends_at` does not exist** on the table; `starts_at` does, as `timestamptz`, indexed.
- **Consumer** *(2026-09-30)* — the other side from the creator, producer or organizer (the Page's owner or founder): someone who RSVP'd or bought. **Derived from an RSVP or a purchase, not stored.** Internal only, not a user-facing word.
- **Purchase** ○ *(2026-09-30)* — a member bought something from a business Page, confirmed by the seller, dated, with both members on it. **Not tracked yet; parked.** F077's sale half waits on it. Who sees a purchase is deferred with it (2026-09-30).
- **Discussion message** ○ — a reply on a Page's board, one level deep (not a tree). Member-authored top-level posts are a later increment and need an operator concept that doesn't exist yet.
- **Direct message** ○ — one person to another. No substrate exists at all. Never Location-scoped — the accountable-participation commitment is honoured by absence.
- **Idea** `○` *(schema `wonder`)* — someone puts a new thing to the neighbourhood and others signal interest before it exists.
  - **Never** — an expiry, or any conversion into another entry type *(2026-09-15, Don)*. The author creates the new Page themselves and announces or links it from the wonder.
  - **Now** — substrate only.
  - **Blocked** — the signalling / threshold / conversion mechanic is undesigned.
  - *The most distinctive thing in the positioning, and the hardest deferral on the list.*
- **Volunteering** `○` *(schema `offer`/`ask`)* — offering help, or asking for it.
  - **Now** — entry types exist, no composer.
  - **Blocked** — the missing reply channel, not the composer.
- **Appearance** ○ — a Page at a Venue for a bounded time. Cannot overlap in time, refused at creation.
- **Operator** `● now / ○ later` *(status corrected 2026-09-19 — the old line said "nothing exists yet" and three things do)* — whoever can remove someone else's content.
  - **Now** — **a check, and only a check.** `src/actions/_lib/operator.ts` compares the acting member against one env var, `OPERATOR_MEMBER_ID`, and **unset means nobody** — it fails closed, because the failure mode of the alternative is the whole moderation surface open to the internet. `reports`, `report_decisions` and the reviewing surface are on main; a decision is a reversible event.
  - **Later** — delegated reviewers, which is more than one operator and therefore a real identity rather than an env var.
  - **Never** — an operator role stored on a member. **There is still no roles table and no flag** — that part of the old line was right and survives. The singular, definite "the operator" in F058 is what the env var encodes.
- **Poll** ○ — `page_posts.kind='poll'` + `page_post_options`. Deliberately separate substrate from demand signals: a poll option is a row with a foreign key; a demand signal's subject has none, by design.

## Refused, and why

| Not a noun | Why |
|---|---|
| **Business entity** ✕ | No corporate shell between Persons and what they declare — every entry has a named human accountable for it. When a feature seems to want a corporate row: attach it to the Member or the business Group, never a shell. |
| **Role** ✕ | Roles are verbs a Member is doing, surfaced from activity. The moment a `role` enum lands on `members`, the primitive collapses into a directory-of-types. |
| **Follow on a product or service** ✕ | Ruled 2026-09-07 — people don't follow products. Removed as a concept, not deferred. |
| **Location-scoped messaging or feed** ✕ | No surface addresses everyone in a place — accountable participation, honoured by absence. |
| **Bulletin** ✕ | **A delivery mode, not a thing** *(2026-09-21, Don)*. It named one setting of an announcement's audience field — the addressed-and-pushed half — and an announcement is one noun whatever its audience. **Never a noun, an object type, or a label**, and never a creator-facing word: *Announcement* is the word everywhere, in the model, the docs and the product. Distinct from the six rejected role words, which are relations mistaken for things; this is a mode mistaken for one. The only thing ever built under the word is the retired `/you/vendor/bulletins` screen, which tracked *delivered / opened / clicked* — what `metrics.md` refuses. |
| **Cooperative governance** ✕ | Voting and distributions are off-platform verbs (securities law, operating agreements). A business Group with multiple owner-role memberships carries the cooperative *shape* without claiming to answer whether a vote is legally binding. |

**Why no Business entity, concretely:** the closest construct is a `kind='business'` Page — itself a group of Members, not a corporate record. Maya doesn't *have* a business; she's the sole owner-role member of a business Page, and what she files belongs to her. "Business name" on any surface is a business-Page label, not a separate record. This keeps the platform people-first structurally, not rhetorically, and makes cooperative formation a first-class outcome rather than a new entity type. Test for future proposals: does this give a business Page ownership of what is filed under it, or of other Pages, even indirectly? If yes, refuse.

## Who sees what

**The one place for visibility between people.** Filled from the rulings of 2026-09-30. **The default is social norms** — what people would expect socially (Don, 2026-09-30); a case the table doesn't cover is settled by that. `verbs.md` and `policy.md` point here.

**Viewers.** *Signed out* — the general public, *"the one on the street after all the businesses are closed"* (Don). *Stranger* — signed in, no relation to the Page. *Follower* of the Page. *Member* — of this Page; membership is scoped to the Page, there is no MSA-wide community, and business Pages currently have none (2026-09-30). A member gets everything a follower does (2026-09-29). *RSVP'd* — a member of that post, not of the Page: they see inside the post, including the others party to it (2026-09-30). *Runner* — the Page's creator, owner or steward.

● sees · ✕ not currently · ◐ partly, as noted · — cannot arise

| What | Signed out | Stranger | Follower | Member | RSVP'd | Runner |
|---|---|---|---|---|---|---|
| A member's fields: legal name, zip, interests, follows, profile | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ |
| A member's interest tags | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ |
| Front door of any Page, private group Pages included: name, default photo, description, withheld-announcements card | ● | ● | ● | ● | ● | ● |
| The Page's founder or seller, by display name | ✕ | ◐ inside the Page, if its creator shows it | ◐ the same | ◐ the same | ◐ the same | ● |
| Contents (location, tags, posts): business Page | ✕ | ◐ what the owner makes visible to the MSA | ◐ the same, plus followers announcements | — no members | ◐ as a stranger, plus the post | ● |
| Contents: public group Page | ✕ | ● | ● | ● | ● | ● |
| Contents: community-only group Page | ✕ | ✕ | ◐ its announcements | ● | ◐ the post only | ● |
| Contents: private group Page | ✕ | ✕ | — | ● | ◐ the post only | ● |
| How many RSVP'd | ✕ | ● | ● | ● | ● | ● |
| Roster: who the members are | ✕ | ✕ | ✕ | ● current members | ✕ | ● |
| Follow graph: who follows whom | ✕ | ✕ | ✕ | ✕ | ✕ | ◐ their own Page's followers, by name |
| Who RSVP'd to a gathering | ✕ | ✕ | ✕ | ✕ | ◐ its other parties; a one-on-one, only the two | ◐ as host |
| Who bought | — no purchasing in the app yet (`ROADMAP.md` § Later) | — | — | — | — | — |
| A member's legal name | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ |
| Public announcement, from any Page | ◐ one withheld card per Page (F093), "Sign up to see what's happening" | ● | ● | ● | ● | ● |
| Followers announcement | ◐ the same withheld card | ✕ | ● | ● | ✕ | ● |

**Where each cell comes from.** Member fields and interest tags: nobody reads anything about a member, only what they post; a creator may show their own display name and avatar on their Page (2026-09-30). Front door: a business closed for the night — every viewer sees it, private group Pages included, and it doesn't show the founder or seller; the card's words are placeholder copy (2026-09-30). Contents: a signed-in non-member sees the front door plus what the owner makes visible to the MSA; private, community-only and public are group-Page levels; community-only means the Page's own members; business Pages take none and have no members; a private Page has members, not followers (2026-09-15). Roster: a stranger doesn't see it (2026-09-30); current members see each other (2026-09-08). Follow graph: nobody sees who follows whom, and a runner sees who follows their Page (2026-09-30). RSVPs: an RSVP makes someone a member of that post, not the Page; whoever is party to an RSVP sees it — everyone at a gathering of many, only the two at a one-on-one — and a member who didn't RSVP is not party (2026-09-30); the count is the Response entry above. Purchases: deferred until the app has purchasing (2026-09-30). Between people: limits apply only to transactions, where the parties see each other as far as the transaction needs; without a transaction it can be visible (2026-09-30). Legal name: **we currently show it to no member**; it is collected for the platform's protection and seen only by Don and operators, and real names between people who dealt with each other are out of scope until counsel (F077, 2026-09-30). Announcements: the public/followers switch (2026-09-21), no third audience (2026-09-30), a public one reaches everyone whatever the Page's level (2026-09-30), the signed-out card (F093). Don and operators see what the platform collects for its protection (2026-09-30), outside this table.

**Combinations.** A member with several relationships to a Page sees the union of their columns, and nothing extra (2026-09-30). Someone who runs one Page is a stranger to another.

[open-question owner=don raised=2026-09-30] Is the transaction limit what separates a follower from a consumer or member? Don: *"This could be a differentiator for follower vs consumer/member."* A) **Yes, by participation:** a follower sees what the Page shows; a consumer or member also sees the others party to what they took part in, capped by what a transaction needs. B) No: follower and consumer see the same, and only a transaction limits anything. C) Leave it until direct messaging brings the consumer's own visibility setting. *Recommend A;* it is what the RSVP ruling already does.

[open-question owner=don raised=2026-09-30] Now that community-only means the Page's own members, what separates a community-only group Page from a private one? A) **Followers:** a community-only Page can be followed and its announcements reach them; a private Page has members, not followers (2026-09-15). B) Nothing: merge the two levels into one. *Recommend A;* it is the only difference the rulings leave, and the table is filled that way.

### Nouns this needs

- **Purchase** — ○ below: a confirmed purchase is not tracked yet.
- **Confirmed interaction** — a Response confirmed by the organiser, or a Purchase confirmed by the seller, dated, with both members on it (F077, out of scope for now). A state on those two nouns, not a noun of its own.
- **A Page's visibility level** — a field on a group Page, not a noun. It sits on members today and moves (`socialus-web` #246).

## The relationships

**Retired as prose, 2026-09-19. The link model lives in one place and this is not it:** `src/ontology/links.ts` in `socialus-web`, generated to `src/ontology/registry.json` (schema 2) and checked against the handlers by `scripts/ontology-drift.ts`, which runs daily.

[open-question owner=don raised=2026-09-16] Which noun does the paused ontology spike model first — Item or Page? The spike lives outside this repo, at `../socialus-ontology-spike/INTENT.md`.

**Why the paragraph that stood here is gone rather than corrected.** It was the second description of the link model and the one people read to be right, while **nothing checked it** — the failure this repo is named for. It had already drifted: it listed *"Person↔Page: founder/steward/owner/member of"* as one relation, and those are **two links with different meanings**. Ownership is `groups.founder_member_id` — who *started* the Page, which **no permission consults**. Authority is `group_memberships.role` — `owner` or `steward`, which is what every managing check actually reads. They coincide today only because one handler writes both, and **a steward who did not found a Page holds authority under the second and appears under neither of the others**. That link was undeclared until 2026-09-19.

**What to read instead, by question:**

| Question | Where |
|---|---|
| Which relationships are declared, and which are declared-but-unbuilt | `registry.json` → `links`, each with its table, column, writing handlers and `built` flag |
| Which handler writes a given link | that link's `writtenBy` |
| Whether the declaration still matches the code | `scripts/ontology-drift.ts`, daily; its verdict is reported in `STATUS.md`, not re-derived here |
| The shape of the registry at a glance | `STATUS.md` § The ontology — what is declared |

**What stays here, because it is a refusal and not a link:** **the relationship surface is intentionally flat.** There is no Business that owns entries at a Location and employs Persons — see § Refused, and why. A registry can say what exists; only this file says what may never be added.
