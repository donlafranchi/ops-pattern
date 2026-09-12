---
id: why-messaging-problem
purpose: Why messaging is the surface most likely to break this platform, and the open questions that have to be answered before any of it ships.
layer: why
status: active
---

# The messaging problem

Anonymous messaging between strangers produces vitriol — not as an edge case, but as what the surface does when built without controls. This platform is for people who care about their place; an unwitnessed channel between strangers gets the internet's behavior regardless of the sign on the door. Controls have to exist before messaging does — every platform that added them after already had a constituency for the bad behavior and had lost the people who'd have made it good.

## Direct messaging is coming — ruled, not speculated

*(Don, 2026-09-12.)* Direct messaging **will** be built: between creators and their followers, and within the community. He was explicit that it carries safeguards, and equally explicit that it is not a question of whether.

That changes how the rest of this document should be read. The upper rungs of the ladder below are **stated intent**, not a hypothetical the platform might refuse — the refusal option is off the table, and what remains is when, and with what protections. Nothing here designs those protections; the point is only that "we might never build this" is no longer an available answer.

Unscheduled, undesigned, and nothing about it is in the launch.

## The ladder: reachability and witnessing are two different axes

Messaging widens in rungs — 0 (nothing exists today) → 1 (one manager announces to opted-in members) → 2 (bounded replies) → 3 (member-initiated posts, unbounded subject) → 4 (direct messages, no witness) → 5 (reaching people who never opted in). Rungs 1–3 widen *who may speak*; rung 4 removes *who is watching*. That matters here specifically because the platform's whole enforcement model is peer pressure — visible behavior, visible consequence — and a DM has no witness. The surface most likely to carry abuse is the one the stated enforcement model doesn't reach.

## What code can decide, and what only a person can

Proximity, flag counts, message volume, standing, and account age are all computable. Whether something was *impolite* is not — a politeness classifier is the platform forming a judgment about a person's character, which the no-ranking commitment already refuses. Threats, illegal content, and child-safety are a different, existing flow with human review and must not be merged with ordinary vitriol-handling. The design principle this produces: put the weight on reachability, where code is reliable, and keep the after-the-fact machinery small enough for one person to carry.

**A rung that sits outside the ladder entirely: a contact address in the body of a public announcement.** Named as the organizer's escape hatch when responses were still a bare headcount (2026-09-10): anyone needing more than a number asks people to email a contact. The 2026-09-12 ruling gives responses names and faces, so the hatch is needed less often — but it is still the only way an organizer reaches a responder directly until direct messaging exists, so it stays in use. That is a deliberate, useful pressure valve, and it is also a plain-text address on a public page: scrapeable, not revocable, and reaching the poster by a route none of the controls above touch. Minor rather than blocking — the organizer chose to publish it, which is the difference between this and being made reachable — but the ladder should not read as though it covers every way someone gets contacted, because it does not cover this one.

**The single highest-value, cheapest control available: a block.** A member stops seeing another member — no operator, no threshold, no classifier, reversible, invisible to everyone else. It protects the blocker only, not the next victim, but it's the one control that requires the platform to form no opinion about anyone.

## What the first migration has to carry regardless of which controls ship

A state column on every utterance (not a boolean — the platform must distinguish "the author removed it" from "it was removed"), a flag table keyed uniquely on (utterance, flagger) since distinct-flagger counts can't be reconstructed later, a block table even if nothing reads it yet, a real author reference, and indexed timestamps. No per-member derived score column of any kind — a column invites the feature it would compute. No location column on the thread table, by the same no-Location-messaging commitment that shapes every other system.

**The substrate lands at launch; no surface does.** The message tables exist so a later surface isn't a retrofit, but no UI ships, and the schema is constrained to same-Group threads only — relaxed later with an explicit opt-in for messages from outside a Member's Groups. That constraint is what keeps the moderation surface area at zero for a solo team while the schema is still landing, which is the only reason it's safe to land the tables before any of the controls above are decided. The tables hang off the Member; their shape is specified here, not in `../systems/member.md`.

## Open — Don rules

- **AND, a score, or split the mechanisms** (proximity gates who may speak; flags govern relief after; neither judges politeness)? *No recommendation — the AND as proposed doesn't cover in-neighborhood vitriol, which is the more damaging case.*
- **Who may initiate contact with a stranger at launch** — nobody (all contact runs through a public Item/Page), anyone in-metro, or a request the recipient must accept? *Recommend: nobody, for launch — matches the current shape and costs nothing today.*
- **Does a block ship with the first surface that lets one member address another**, rather than being added later? *Recommend yes — it's the cheapest control in this document.*
- **Is an operator concept in scope before rung 3 (member-initiated posts)?** If not, is "Page managers moderate their own boards" the ruling?
