---
id: why-role-language
purpose: What the platform calls the people on it — one identity noun, verbs for everything else — and why a creator/supporter pair is refused.
layer: why
status: active
---

# Role language

Everyone who puts something on this platform should feel like they made something — including someone who only posted an idea that sparked something else. The word for the other side — the person who shows up, backs, follows — was open; "consumer" is the exact pigeonhole the product exists to escape and "supporter" was the candidate. **The answer is that the second word shouldn't exist.**

## The recommendation: one identity noun, two verb families, no second class

The identity noun is **member** — lowercase, nearly invisible in the interface. Direct address says **you**; third person says **people**, or the person's name. Everything else is a verb, never an umbrella noun: making side — *make · sell · host · offer · ask · wonder*; showing-up side — *show up · back · follow · save · count me in*. "Item" is the database word and never reaches the UI; the same rule applies to people.

**Why not a pair.** YouTube, Patreon, and Substack all named both sides and got behavioral lift from it — but each is a two-class system by design and economics, one side makes and the other pays. This platform's whole hypothesis is that the same person does both. A pair installs the class boundary in the vocabulary and then the product spends forever apologizing for it; it also implies a switch to store, and this project has already made and retired that mistake once (`members.maker_mode_enabled`, still in the schema, written by nothing). "Supporter" also reads as charity toward a struggling producer rather than trade between neighbors — a meaningful mis-set for a platform arguing local commerce is ordinary economic behavior.

**"Creator" survives as a feeling, not a label.** Making someone feel like they made something means showing them the thing with their name on it and showing that someone turned up — not calling them a creator. A noun describing a person is a label the platform assigns; a verb is something they did. Only one of those is earned.

**Functional roles stay small.** `owner`, `staff`, `steward`, `host`, `founder` are scoped to one thing — one Group, one gathering — and already exist in the schema. Keep them lowercase and contextual: "host" on a gathering page, never "you are a host" on a profile.

## The line that survives "attendance is authorship"

The proposal that showing up *is* creating holds for gatherings (a run club is genuinely constituted by turnout) and for ideas (a reply is what converts a wonder into a plan) — but breaks for goods: buying a loaf doesn't co-author the loaf, and claiming it does is false and faintly insulting to the baker. The narrower, truer version: **the platform's unit of value is not the thing, it's the turnout** — an item with no response isn't a smaller success, for a gathering or idea it isn't an event at all. That gets the benefit (showing up isn't lesser) without a symmetry that collapses on the first loaf of bread. The two-class problem doesn't need dissolving by redefinition — it dissolves because the product never asks which class you're in. No stored role, no mode, no badge, no second noun.

## The copy — the real test for whether a word works

- Sign-up: *"See what's happening near you — and add what you're doing."* Not "join a community of creators."
- Create prompt: *"What are you starting?"* → from the name they type on, the interface uses that name, not a category noun.
- Gathering response: *"Count me in"* → *"You're in."* Not "RSVP" (jargon nobody says aloud), not "Attend" (reads like a work calendar invite).
- A gathering with no responses, to a visitor: *"No one's in yet. Be first."* To the host: *"Nobody's in yet"* — never "0 RSVPs"; a zero counter on your own thing is a small daily failure notice.
- Profile header: name, handle, and a line built from verbs — *"Makes hot sauce in Oak Park · Hosts the Tuesday run."* No role badge.
- A Page's people: *"Who's here"* — never "followers," never "audience," never a bare count on a small local thing.

## Rules that follow

1. No noun for a person they didn't choose — their name, their handle, their own words; everything else is a verb.
2. No umbrella noun for either side — not creator, supporter, consumer, or producer-as-label.
3. No stored role, mode, or account type — every role derives from state (a membership, an authored item, a response).
4. Functional roles are scoped and lowercase, never a profile-level identity.
5. No zero-counters on a person's own work.
6. "Producer," "seller," "maker" are spec and category words, not labels rendered under someone's name.
7. A new surface needing a word for a person reaches for a verb or their name. If neither works, that's a signal the surface is modeling a class distinction — escalate rather than coin a new noun.

Nothing here renames a table or requires a migration — this is a naming and copy discipline, not a schema change.
