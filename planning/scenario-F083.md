---
id: F083
title: The argument reaches people a few sentences at a time, never as a wall
status: draft
date: 2026-09-15
depends: []
---
## Story

Maya signs up and reads two sentences about why this exists. She doesn't read them again. Later, on an empty Browse, there's one more; at the foot of a Page she's following, another. Over a week she has met the whole argument without ever being handed it — and she has never seen a page whose job was to explain the product to her. Part of it was never said in words at all: the name sounds like "socialist," and the domain is a .org, and both of those were doing the work before she read a line.

## Acceptance

1. No single surface carries more than **three sentences and fifty words** of premise copy.
2. Premise copy appears on **at least four distinct surfaces**, and the same string never appears on two of them.
3. **No surface exists whose purpose is to explain the premise** — no manifesto, no about page, no values page, no interstitial, no modal.
4. Every premise string is Don's own written language. No agent writes premise copy, and no string is paraphrased from the raw material below.
5. Changing any premise string is **one edit in one place**, touching no component file.
6. No premise string explains the name or the domain.

## Not this

Writing the premise copy — Don writes it himself, from audio being transcribed separately. Deciding where the strings live: three options are in § Why § Open — Don rules, unresolved. Migrating the app's other copy; this scenario covers premise copy only. Any surface that argues at length, however well.

## Why

### Raw material — Don's premise, NOT copy

*His words, 2026-09-15, recorded verbatim as source material. **This is not final copy and may not be shipped as written** — criterion 4 requires his own written language, which this is not yet.*

> Regular working people are getting squeezed in every direction; the government has been helping the people doing the squeezing; this is the antidote to that; we have to do this ourselves and we have to do it together.

**His stated constraints, in his words:** *"Keep it short wherever people see it. No manifesto about all the ills being corrected."* · *"A few sentences at a time, spread throughout the app."* · *"Some of it is already said by other means"* — the name sounds like "socialist," the domain is a .org. He expects to update the language frequently.

### Open

[open-question owner=don raised=2026-09-15] Where do the premise strings live, given Don expects to update them often? Copy is inline in the components today — roughly **458 user-facing strings across 50 files** by grep, which is why changing a sentence is currently a developer task. F083 criterion 5 requires one edit in one place; it does not say where.

| | **A · typed copy module** | **B · database + editing screen** | **C · content files at build time** |
|---|---|---|---|
| **What it is** | One typed file in the repo; components import keys instead of holding strings | A table plus an admin screen; text read at runtime | Markdown or JSON in the repo, read at build |
| **Cost to build** | ~0.5–1 day, premise strings only | ~3–4 days — table, RLS, editing screen, cache invalidation, missing-key fallback | ~1–1.5 days |
| **Cost to Don per edit** | He can't do it himself — still a code change, a PR and a deploy. But it is one file, so an agent turns it round in minutes | He edits in the app. No deploy, no agent, no wait | A commit and a deploy, but the file is prose, not code — editable from a phone on GitHub's web editor |
| **What it forecloses** | Nothing. The keys become the table's rows if B is built later | Adds a runtime dependency on the database for text; a missing row is a blank surface unless the fallback is built; **needs an operator concept the code does not have** | Little. Sits between the two and converts to either |

*Recommend **A now.*** It is the cheapest thing that satisfies criterion 5, and it is the precursor to B rather than a detour from it — the work is not thrown away. **What it does not give him is self-service**, and if editing without an agent is the actual requirement, that is B and should be priced as B rather than reached by increments. **C is the honest middle** and worth taking instead of A if he wants to edit from a phone before the operator concept exists.
