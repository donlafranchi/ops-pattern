# R08 — Build the `product/needs/` layer

**Phase:** 8 of 10 · **Repo:** parent · **Risk:** medium (new content) · **Depends on:** R01–R07.

## Objective

The repo has no front door — no page that opens on "who is this for and what do they want." Create `product/needs/` with four docs: two relocated, two new drafts.

`use-cases.md` and `member-journey.md` are moves of existing content. `people.md` and `needs.md` are **new drafts** synthesized from existing docs — they ship for PM refinement, not as finished specs. Do not invent product strategy; extract and organize what the sources already say. When a source is silent, write a marked `[PM: confirm]` placeholder.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Create the folder; relocate the two existing docs

```
mkdir -p product/needs
git mv product/foundation/canonical-examples.md product/needs/use-cases.md
git mv product/foundation/loops.md             product/needs/member-journey.md
```

Add a banner to the top of `product/needs/use-cases.md`:

```
> **Relocated + renamed 2026-05-19** from `foundation/canonical-examples.md`. The 12 real
> use cases here are the working test-case set for every feature. Specs may still say
> "canonical example" as a term; the file is `use-cases.md`.
```

Add a banner to the top of `product/needs/member-journey.md`:

```
> **Relocated + renamed 2026-05-19** from `foundation/loops.md`. The 13 loops are unchanged
> content — "loop" stays valid as spec/schema vocabulary. The doc is renamed because
> "loops" means nothing to a non-builder; "member journey" does.
```

Leave the body of both files otherwise intact.

### 2. Draft `product/needs/people.md`

Read first: `product/needs/use-cases.md`, `planning/scenarios-backlog/F018-brian-declares-run-club.md`, `product/foundation/principles.md` and `design-philosophy.md` (the member-journey reasoning).

Extract the recurring **personas** the use cases are about — use real names where the use cases give them. Likely set (confirm against the actual use cases, do not force it): the Producer/grower, the Convener, the Maker/craftsperson, the Newcomer/wanderer, the Steward, the everyday Member/neighbor.

```
# People — who Movers, Makers & Shakers serves

> **Status: DRAFT 2026-05-19.** First synthesis from use-cases.md + scenarios.
> PM to refine — persona set, names, and emphasis not yet ratified.

## How to read this
One section per persona. A real kind of person, not a market segment.

## <Persona>
- **Who they are:** one or two sentences.
- **What they want:** the goal in their own voice.
- **Where they get stuck today:** the friction the platform removes.
- **Use cases they appear in:** links to needs/use-cases.md.
- **Loops they touch:** loop numbers from needs/member-journey.md.
```

### 3. Draft `product/needs/needs.md`

Read first: `product/foundation/design-philosophy.md` (the member-journey theory), `product/foundation/principles.md`, `product/needs/member-journey.md`, `product/needs/use-cases.md`.

Produce a **ranked list of human needs** in plain voice, each traced to the structure that serves it. Rank by how foundational the need is to the platform's reason for existing; if the sources do not support a confident ranking, order by the loop families (Gathering → Sharing → Trade → Pooling → Federation) and say so.

```
# Needs — what people come here to do

> **Status: DRAFT 2026-05-19.** First synthesis from the foundation docs.
> PM to refine — need set and ranking not yet ratified.

## How to read this
Each entry: a human need in plain voice, then its trace — loop(s), system(s), capability(ies).
This is the bridge from the "why" (foundation) to the "what we built" (systems).

## 1. <Need stated as "I want to ...">
- **Why it matters:** one sentence.
- **Loop(s):** numbers + names from needs/member-journey.md.
- **Served by:** system + capability docs.
- **Persona(s):** links to needs/people.md.
```

### 4. Cross-reference sweep

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `foundation/canonical-examples.md` | `needs/use-cases.md` |
| `canonical-examples.md` | `use-cases.md` |
| `foundation/loops.md` | `needs/member-journey.md` |
| `foundation/loops` | `needs/member-journey` |

This sweep is broad — `canonical-examples.md` and `loops.md` are cited widely (including `skills/pipeline-ticket/templates/ticket.md`, many specs, `CLAUDE.md`, `MAP.md`). Rewrite **file-path references**; leave the *concept terms* "loop" and "canonical example" alone where they are used as vocabulary rather than a path. Keep relative-link depth correct.

### 5. Verification

- `product/needs/` contains exactly four files: `use-cases.md`, `member-journey.md`, `people.md`, `needs.md`.
- `people.md` and `needs.md` carry the `Status: DRAFT` banner.
- `product/foundation/` no longer contains `canonical-examples.md` or `loops.md` — it is down to `principles.md`, `design-philosophy.md`, `policy.md`, `platform-promise.md`, `primitives.md`.
- `rg --glob '!_attic/**' --glob '!web/**' 'foundation/canonical-examples|foundation/loops'` returns zero hits.
- Every link inside the four `needs/` files resolves.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add product/needs/
git status
git commit -m "docs(consolidation): phase 8 — build the product/needs layer"
```

## Completion

Date: {YYYY-MM-DD} · Commit: {hash} · Notes: {list every [PM: confirm] in people.md / needs.md}
