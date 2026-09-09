---
id: why-role-language
purpose: Settles what the platform calls the people on it. One identity noun, verbs for everything else — and the reasoning that rules out a creator/supporter pair. Every copy decision gets checked against this.
layer: why
status: active
owns:
  - person-role-vocabulary
  - creator-supporter-refusal
---

# Role Language

> Companion to [`people-first.md`](people-first.md) and [`nouns.md`](nouns.md). Those settle what the platform *is*. This settles what it *calls the people on it* — and, more usefully, what it refuses to call them.
>
> **Scope: naming and philosophy. No table renames, no schema changes.** Where a recommendation here would imply one, it is named and priced in § What this costs rather than executed.

---

## The question

Everyone who puts something on this platform should feel like they made something — including the person who only posted an idea that sparked something else. The word for the other side of that — the person who shows up, backs, buys, follows — was open. "Consumer" was ruled out: extractive, and it is the exact pigeonhole the product exists to escape. "Supporter" was the candidate.

**The answer is that the second word should not exist.**

---

## What is already load-bearing — check this before proposing a fourth word

The vocabulary is not empty. It is already crowded, and part of the problem is that nobody counted.

**In the schema, and therefore durable:**

- **`members`** — the account primitive. One row per human. The identity noun, and the only one.
- **`group_memberships.role`** — free text, 1–60 chars, validated in the action layer, not the database. Live values: `owner`, `staff`, `steward`, `member`.
- **`item_gatherings.host_member_id`** — *host* is a schema-level role, scoped to one gathering.
- **`groups.founder_member_id`** — *founder* is a schema-level label, and `groups.md` already calls it historical: it confers no ongoing authority.
- **`members.maker_mode_enabled`** — **a stored role flag that should not exist.** The naming conventions state in as many words that there is no such toggle; selling tools surface from Group and Item state. The column is still there, nothing writes it, and `member.maker_mode_changed` still sits in five event-type CHECK constraints. See § What this costs.

**In specs and UI, ungoverned:**

- **Person** — the conceptual name for the Member primitive. Spec-only.
- **Producer** — used in the agricultural and food context; owns two spec docs.
- **Seller** — sanctioned as "the generic UI term for a Member offering goods or services."
- **Maker** — survives only where a Member self-identifies as one.
- **Consumer** — appears in the use-case set and in four planning docs, including the launch plan.
- **Operator** — the platform operator. Not a Member role; leave it alone.

**That is one identity noun, four functional roles, and five ungoverned labels for the same human.** A creator/supporter pair would make it seven. The problem to solve is not a missing word.

**One live conflict worth naming.** The design north stars already say *"Neighbours, not strangers or creators"* — TikTok carries reach chrome because creators compete for an audience, and we deliberately don't. That is a shipped position, and it is in tension with wanting people to feel like creators. The resolution is in § The recommendation: *creator* is a feeling the product produces, not a badge it hands out.

---

## The recommendation

### One identity noun. Two verb families. No second class.

**The identity noun is `member`** — lowercase, in the schema, and nearly invisible in the interface. In direct address the product says **you**. In the third person it says **people**, or it says their name. "Member" appears in the UI only where a legal or structural sense is unavoidable.

**Everything else is a verb.** What someone is doing right now, not what they are.

| Making side — always the specific verb, never an umbrella | Showing-up side |
|---|---|
| make · sell · host · offer · ask · wonder | show up · back · follow · save · count me in |

There is no umbrella noun for either column, deliberately. "Item" is the database word and never reaches the UI; the same rule now applies to people. A person hosting a run club is *hosting a run club*. A person who said they're coming *is in*.

### Why not a pair

The case for `creator` / `supporter` is real: YouTube, Patreon and Substack all named the two sides and all got behavioural lift from it. **But every one of those platforms is a two-class system by design and by economics** — one side makes, the other side pays, and the class boundary is the business model. Ours is the opposite claim. The whole hypothesis is that the same person does both, and that moving between them is the point.

Three specific failures:

1. **A pair installs the class boundary in the vocabulary, and then the product spends forever apologising for it.** Once the words exist, every surface has to decide which one you are. That decision is the two-class system, arriving through the copy deck instead of the schema.
2. **A pair implies a switch.** Two identity nouns need somewhere to be stored, or a mode to toggle between them. **The project has already made and retired that mistake once** — `maker_mode_enabled` is still in the members table as its fossil. Roles derive from state; they are not declared and stored.
3. **"Supporter" is donation-flavoured.** It reads as charity toward a struggling small producer rather than trade between neighbours. On a platform arguing for local commerce as ordinary economic behaviour, that is a meaningful mis-set.

**"Creator" survives as a feeling, not a label.** The way to make someone feel like they made something is not to call them a creator; it is to show them the thing with their name on it, and to show them that someone turned up for it. Nouns describing people are labels the platform assigns. Verbs are things people did. Only one of those is earned.

### The functional roles stay, and stay small

`owner`, `staff`, `steward`, `host`, `founder` are **scoped to one thing** — one Group, one gathering. They are jobs, not identities, and they already exist in the schema. Keep them, keep them lowercase, and keep them contextual: *"host"* on a gathering page, never *"you are a host"* on a profile.

---

## Pressure-testing "attendance is authorship"

The proposed line: *a gathering doesn't exist without the people who show up — so showing up is creating, and the two-class problem dissolves.*

**It holds for gatherings.** A run club with one person is a person running. The event is genuinely constituted by turnout; the RSVP is not consumption of a thing that already existed, it is part of what makes the thing exist. This is not a stretch.

**It holds for ideas.** Someone replying "I'd be in" to a wonder is what converts an idea into a plan. That is the platform's own loop shape — wonder becomes gathering — and the conversion is performed by the responder, not the author.

**It breaks for goods, and it breaks badly.** Buying a loaf of bread does not co-author the loaf. Claiming it does is false, and it is faintly insulting to the baker, and everyone can feel it. **A principle that is true two-thirds of the time and flattering the rest of the time is not a principle — it is a slogan**, and it will get quoted back in the one case where it is wrong.

**So the line is right about the target and wrong about the mechanism.** Keep the narrower, truer version:

> **The platform's unit of value is not the thing. It is the turnout.**
> An Item with no response is not a smaller success — for a gathering or an idea, it is not an event at all. Responding is therefore a first-class act with its own name, not the absence of creating.

That gets the whole benefit — showing up is not lesser — without asserting a symmetry that collapses on the first loaf of bread. **And the two-class problem does not need dissolving by redefinition. It dissolves by the product never asking which class you are in.** No stored role, no mode, no badge, no second noun. That is a structural answer, and it survives contact with a schema in a way a redefinition would not.

---

## The copy — the real test

A word that only works in a manifesto is the wrong word. These are the strings.

**Sign-up.** *"See what's happening near you — and add what you're doing."*
Both halves in one line, in that order. Not "join a community of creators."

**Create prompt** (`/you/create`). *"What are you starting?"* → **Something I make or sell** · **Something I host** · **Both**
Then: *"What should we call it?"* — and from that point the interface uses the name they typed, not a category noun.

**Follow button.** *"Follow"* → *"Following"*. Already a verb. Unchanged.

**Gathering response.** *"Count me in"* → *"You're in."*
Not "RSVP" — jargon, and nobody says it out loud. Not "Attend" — it reads like a calendar invite from work. **No "RSVP" string exists in the interface yet**, so this is a decision to make rather than a change to land.

**Gathering with no responses — to a visitor.** *"No one's in yet. Be first."*
**To the host.** *"Nobody's in yet."* Not *"0 RSVPs"* — a zero counter on your own thing is a small daily failure notice.

**Profile header.** Name, `@handle`, and a line built from verbs — *"Makes hot sauce in Oak Park · Hosts the Tuesday run."* **No role badge.** The existing *"Active in the community"* standing chip is fine and stays: it describes participation, not a class.

**Your own page, empty.** *"Nothing here yet. What are you starting?"*
**Someone else's page, empty.** *"Nothing here yet."* No prompting a stranger about someone else's silence.

**Browse, empty.** *"Nothing here yet. Be the first — host something, or put up something you make."*
Not *"try another filter"* alone. An empty local product is an invitation or it is a dead end, and the current copy picks dead end.

**Pre-producer invitation.** Heading: *"No one's doing this in Oak Park yet."* Card: *"Start here — it's free."*
Absence framed as a vacancy, which is what it is.

**A Page's people.** *"Who's here"* — never "followers," never "audience," never a count on a small local thing.

---

## Rules that follow

1. **No noun for a person that the person did not choose.** Their name, their handle, their own words. Everything else is a verb.
2. **No umbrella noun for either side.** Not creator, not supporter, not consumer, not producer-as-a-label. Use the specific verb.
3. **No stored role.** No mode, no account type, no toggle. Every role derives from state — a Group membership, an authored Item, a response.
4. **Functional roles are scoped and lowercase.** *host* of this gathering, *owner* of this Page. Never a profile-level identity.
5. **No zero-counters on a person's own work.** *"Nobody's in yet"* beats *"0 RSVPs"*, always.
6. **"Producer," "seller" and "maker" are spec and category words, not labels rendered on a human.** They may name a doc, a filter, or a recruitment lane. They may not appear under someone's name.
7. **When a new surface needs a word for a person, the answer is a verb or their name.** If neither works, that is a signal the surface is modelling a class distinction — escalate rather than coin.

---

## What this costs

**Nothing renames.** `members` stays. `groups` stays. `group_memberships.role` stays. No migration is required by this document.

**One live drift it exposes, priced but not executed.** `members.maker_mode_enabled` is a stored role flag contradicting rule 3, contradicting the naming conventions, and written by nothing. Dropping the column and retiring `member.maker_mode_changed` from the five event-type CHECK constraints is **one forward migration, roughly an hour**. It is not urgent and it is not free to leave: the next person to read the schema will reasonably conclude that maker mode is a feature.

**One doc amendment.** The naming-conventions table in `CLAUDE.md` gains the Page row and a role-language row, and its "Member · Seller · Producer" UI-label cell narrows per rule 6. Doc change, no code.

**One sweep, already funded.** The violations below fold into the launch copy pass rather than becoming their own workstream.

---

## Violations in the current surface

Folded into the launch copy pass — [`../../planning/now/initiative-launch.md`](../../planning/now/initiative-launch.md) fortnight 4.

**Class nouns rendered on people**

- `/join` — *"For vendors," "Sign up as a vendor," "Share with another vendor."* (The money promises on this page were removed 2026-09-07.) The page is addressed to a class.
- `/you` signed out — *"Sign in to follow vendors and save your market," "Are you a business owner?"* Both ask the reader to self-classify before they have done anything.
- Sign-in CTA, app-wide — *"List your business."*
- `/you` signed in — *"Switch to vendor mode."* A mode switch, which is rule 3 rendered as a link.

**Umbrella nouns in the spec layer**

- *"Consumer"* in the use-case set, the impact diagnostic, and four planning docs **including the launch plan I wrote.** Replace with the verb or with *"people."*
- The naming-conventions UI-label cell offering *Member · Seller · Producer* as person labels.

**Empty states that describe absence instead of inviting**

- Browse — *"Nothing here yet — try another filter."*
- Member page — *"Nothing posted yet."* Correct for a visitor, wrong on your own page.
- Feed empty — widens the locality and never invites.

**Not yet written, so decide rather than fix**

- No *"RSVP"* string exists in the interface. Ship *"Count me in."*
- No response counter exists. Do not add one to a person's own work.
