---
id: why-nouns
purpose: The nouns — every entity the product has or will have, what each carries, what each deliberately does not. Spine document: every entry carries its own status and holds both horizons, what ships now and what is intended later. The future version of a noun is a status on its entry here, never a second description elsewhere.
layer: why
status: active
---

# The nouns

> **Superseded in part by [`model.md`](model.md) (2026-09-10).** Don restated the model directly: there are no Items, and a post carries a time or it doesn't. The conflicts below are known and unfixed — this document has not yet been reconciled. Where the two disagree, `model.md` is right.

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
| **item** | Umbrella over seven unlike things, and the word needed for a product offered for sale. Don named it. | the specific type — Product, Service, Event, Idea, Offer, Ask, Initiative — or **entry** for the umbrella |
| **kind** | **Two vocabularies with the same column name**: `groups.kind` has six values, `items.kind` has seven, and they classify different layers. Don named it. | **Page kind** · **entry type** |
| **group** | **The `groups` table holds Pages**, while *Group* in product language means a social group. `verbs.md` records these as *"routinely blurred in older docs and different nouns with different rules."* | **social group** · **business Page** · **group membership** |
| **follower** | `F067`: *"Today 'follower' and 'member' mean the same thing in the code."* Same row, two meanings, diverging behaviour. | **Page follower** · **group member** |

**On the watch list, not yet binding:** *post* (a `page_posts` row versus the act the voice guide refuses) and *state* (several columns, several meanings). **They are named here so the list can grow with evidence rather than with suspicion** — add one only when it has demonstrably drifted.

**Prose versus identifiers.** The rule binds **prose**. **It does not rename a schema column** — `groups.kind` stays `groups.kind`, and no check may fail the build on the existing schema. An identifier is exempt where it is an identifier and bound where it is read as prose: a commit message, a comment sentence, a ticket title.

**Where this is enforced:** § The user-facing string check, below. **Where it cannot be:** ordinary English. *"What kind of gathering"* and *"be kind"* are not violations, and no check can reliably tell them from the technical sense — which is why the bare-term check warns rather than fails outside a short list of certain cases.

## The spine

Three core nouns carry every loop: **Person, Item, Location.** A fourth — **Group** — exists for when a set of people decide they're an intentional, self-selected unit. Groups are emergent and optional; no Member is ever auto-assigned to one. The grammar: people declare things · things attach to places · some people choose to be a Group · other people respond.

**Person** — a real human, one record per human. Holds verbs (makes, hosts, follows) rather than role-as-identity — a Person isn't *a Maker*, a Person *makes things*. Schema name `Member`. Detail: `../systems/member.md`.

**Item** — anything a Person declares: product, service, gathering, idea, offer, ask, initiative. One spine, varying by `kind`. Detail: `../systems/item.md`.

**Location** — a physical place (permanent, recurring-temporary, or area). No members of its own — for members, you need a Group. Detail: `../systems/location.md`.

**Group** — a named, self-selected set of people. Six kinds: five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) and one operate (`business`). Never auto-assigned by geography or anything else. Detail: `../systems/groups.md`.

## The two sides — patron and creator *(internal vocabulary)*

*(Ratified 2026-09-14, Don: "Creator and patron are shorthand for you and me when discussing the two sides broadly.")*

**These are our words for talking about the product, not the product's words for talking to a member.** A creator is someone who publishes something other people show up for — sells, hosts, organizes. A patron is everyone on the other side. Use them freely in these docs, in scenarios, in tickets, in conversation.

**Never rendered in a user-facing string.** *(Restores `role-language.md`'s rule: no person-noun in front of a member.)* Not in copy, not as a label under a name, not addressing a group. A member is addressed as **you**; a set of people is **people**, or named. Everything a person *does* is a verb — make, sell, host, offer, ask, wonder, show up, back, follow, save.

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

**Never** — a person-noun in any user-facing string, these two included. A third internal person-noun without a dated ruling. Producer, seller, maker, vendor, supporter and consumer as anything but spec words; "vendor" was removed from the product once already and is still in the code. Functional words — owner, staff, steward, host, founder — outside the scope of one Group or one gathering; they never become a profile-level identity.

## Page — the canonical definition

*(Ratified 2026-09-07. The UI name for a `groups` row — the line every other doc is checked against.)*

**A Page is the person or people behind the listing. Page is *who*; Item is *what*.** A Page holds many Items and dates over time and carries identity, a name, a face, followers.

**Amended 2026-09-15, Don's direct ruling: every kind gets a Page, including a one-time gathering.** *"We can create a page for every kind. It just doesn't require all of the same tools."* What differs between kinds is the tools the Page offers, never whether it is a Page. **This overrules the earlier "no Page for a single occasion"**, whose reasoning — that browse and the map would index listings as if they were people, and a follower graph on something ephemeral is worthless — is answered by the tools differing rather than the entity differing. **The `Page is who; Item is what` framing above is disputed and unresolved; see `planning/ITEMS-QUESTION.md`. It is not retired.** Pages have varying lifespans and are created sequentially, never simultaneously — a producer who also hosts makes a second Page, never converts the first. A Page may sell, host, or both, and needs no business record to do either — the business record is a claim about the Page, not a permission.

**Three consequences:** the map's unit is the Page, not the Item — search sourdough and see the bakers, not individual loaves. One Page is one place — a two-location bakery is two Pages, which is why the map needs no cross-location grouping. A Page with no fixed place is found through the Venues it appears at, never pinned at an address it doesn't have. Anything in the past doesn't appear — time-based, automatic, no manual cleanup.

**A Page's address is public if given** *(ratified 2026-09-09)* — a street address if it has a specific location, a neighbourhood otherwise; having premises decides it, not the Page's kind. It's a public location, not a private one — the platform won't stop someone entering a home address, but it's shown to anyone who views the Page. The field must say so before anyone types into it.

## The nouns that ship

| Noun | Status | What it is | **What it deliberately does not have** |
|---|---|---|---|
| **Member** | ● | One real human, one account | No type, tier, or stored role. No platform-awarded badge, rating, or label it didn't write itself. |
| **Page** | ● | The person or people behind the listing | No permanent kind that gates anything. No permission granted by its business record. No conversion into another Page. **No category a creator picks** *(2026-09-13 — tags are the only vocabulary)*. |
| **Item** | ● | One thing offered, or one occasion | No independent existence off a Page. No response counter shown to its author. No date on a product. |
| ~~**Venue**~~ | ✕ | **Not a noun** *(2026-09-12)* — a venue is an organization hosting at a Location. The Page is justified by what the organization is; persistence is `locations.kind` (Harlow's `permanent`, a Saturday market `recurring_temporary`). | No entity of its own, and no Page kind. Anything can host — a bakery running a book club is a venue that evening, on the one Page it already had. |
| **Place** | ● | Platform-curated geography (neighbourhood → state) | No member-facing create surface. Nobody adds a Place. |

## The nouns that are coming — ruled in, not all scheduled

- **Response** `● now / ○ later` *(2026-09-12)* — a member says they are coming to an occurrence.
  - **Now** — a thumbs up or nothing. Presence or absence of a row, not a state column. The organizer sees two lists; names are shown; the public sees the count.
  - **Later** — four states: coming · not coming · seen and undecided · declined. A state column replacing a row's existence — a migration and a rewrite of every read, **not an increment**.
  - **Blocked** — `members.avatar_url` has no write path. The list shows faces; no member has one.
  - **Trigger** — an organizer saying the yes-list alone isn't enough to plan with.
- **Tag** ○ *(2026-09-12, made the only vocabulary 2026-09-13)* — a creator's own word for what their Page is. **Created, not picked from a fixed list, and public.**
  - **Now** — nothing. No store, no composer field, no moderation path. A Page carries `groups.category` from the retired twelve; that column has no live writer once the category step goes.
  - **Later** — **the only vocabulary.** What search matches, and what a coarse grouping is derived from if one is ever needed.
  - **Blocked** — **report-and-takedown, which does not exist.** A public tag is member-contributed content other members see, so rule 1 bars it from production without one. There is no `reports` table and no operator concept in the code; F058 is the work and it is unbuilt.
  - **Never** — a tag that orders results, one the platform assigns, or a coarse category a creator picks alongside it.
- **Announcement** ○ — a Page tells its followers and members what's upcoming, **and the post appears in browse** *(ruled 2026-09-12 — flat, not only the dated ones)*. Table is `page_posts`, not `bulletins` (2026-09-09) — the Page is the board, an announcement is the first kind of post. **Editable after posting** *(ruled 2026-09-13 — reverses the earlier no-edit rule)*; **delete still refused**; no inbox, no unread state.
- **Discussion message** ○ — a reply on a Page's board, one level deep (not a tree). Member-authored top-level posts are a later increment and need an operator concept that doesn't exist yet.
- **Direct message** ○ — one person to another. No substrate exists at all. Never Location-scoped — the accountable-participation commitment is honoured by absence.
- **Idea** `○` *(schema `wonder`)* — someone puts a new thing to the neighbourhood and others signal interest before it exists.
  - **Now** — substrate only.
  - **Blocked** — the signalling / threshold / conversion mechanic is undesigned.
  - *The most distinctive thing in the positioning, and the hardest deferral on the list.*
- **Volunteering** `○` *(schema `offer`/`ask`)* — offering help, or asking for it.
  - **Now** — kinds exist, no composer.
  - **Blocked** — the missing reply channel, not the composer.
- **Appearance** ○ — a Page at a Venue for a bounded time. Cannot overlap in time, refused at creation.
- **Operator** ○ — whoever can remove someone else's content. Nothing exists yet — no role, no flag, no check.
- **Poll** ○ — `page_posts.kind='poll'` + `page_post_options`. Deliberately separate substrate from demand signals: a poll option is a row with a foreign key; a demand signal's subject has none, by design.

## Refused, and why

| Not a noun | Why |
|---|---|
| **Business entity** ✕ | No corporate shell between Persons and what they declare — every Item has a named human accountable for it. When a feature seems to want a corporate row: attach it to the Member or the business Group, never a shell. |
| **Role** ✕ | Roles are verbs a Member is doing, surfaced from activity. The moment a `role` enum lands on `members`, the primitive collapses into a directory-of-types. |
| **Follow on a product or service** ✕ | Ruled 2026-09-07 — people don't follow products. Removed as a concept, not deferred. |
| **Location-scoped messaging or feed** ✕ | No surface addresses everyone in a place — accountable participation, honoured by absence. |
| **Cooperative governance** ✕ | Voting and distributions are off-platform verbs (securities law, operating agreements). A business Group with multiple owner-role memberships carries the cooperative *shape* without claiming to answer whether a vote is legally binding. |

**Why no Business entity, concretely:** the closest construct is a `kind='business'` Group — itself a Group of Members, not a corporate record. Maya doesn't *have* a business; she's the sole owner-role member of a business Group, and her Items belong to her. "Business name" on any surface is a Group label, not a separate record. This keeps the platform people-first structurally, not rhetorically, and makes cooperative formation a first-class outcome rather than a new entity type. Test for future proposals: does this give a Group ownership of Items or other Groups, even indirectly? If yes, refuse.

## The relationships

Person↔Item: creates, holds, responds to. Item↔Location: anchored at. Person↔Location: three purpose-owned substrates (locality default, private community-awareness scope, saved-search follow) — none grants addressability. Person↔Person: follows only; messages don't exist yet. Person↔Group: founder/steward/owner/member of; soft affiliations are inferred and surface-only, never written as membership without consent. Item↔Group: optionally filed under one Group, but `items.member_id` (the responsible human) is always `NOT NULL`. The relationship surface is intentionally flat — there is no Business that owns Items at a Location and employs Persons.
