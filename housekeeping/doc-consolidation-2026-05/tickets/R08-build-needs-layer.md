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

Date: 2026-05-22 · Commit: `325f818` · Notes:

**Four files in `product/needs/` shipped:**

- **`use-cases.md`** — relocated from `foundation/canonical-examples.md` with banner. 12 use cases preserved verbatim; status banner updated to point at sibling `member-journey.md` + foundation peers via parent-relative paths.
- **`member-journey.md`** — relocated from `foundation/loops.md` with banner. 13 loops preserved verbatim; status banner updated to drop the retired `community.md / member.md / initiatives.md / service-provider.md / maker.md` mentions (those specs are retired/merged); replaced with `member.md / item.md / location.md / groups.md` per the current spec set.
- **`people.md`** — new draft synthesizing 8 personas from `use-cases.md` + the b1 scenarios (`F018`, `F025`). Personas: Producer (irregular supply), Convener (recurring host), Newcomer / Wanderer, Steward / Initiator, Backer, Affinity-Group Seeker, Follower (loyalty-shaped), Everyday Neighbor. Plus 4 TBD slots aligned with the `use-cases.md` [TODO] placeholders (Idea-Floater, Mutual-Aid Member, Trades-Pro Seeker, Community Steward).
- **`needs.md`** — new draft synthesizing 13 needs in the order of `member-journey.md`'s 5 loop families (Gathering → Sharing → Trade → Pooling → Federation). Each need traces to: loop, served-by system(s), capability(ies), persona(s), use-case anchor.

**[PM: confirm] items left behind (and there are many — these are drafts, not finished specs):**

In `people.md`:
- The persona list itself is not yet ratified — PM picks which to keep, merge, rename, split.
- The illustrative persona names ("The Producer", "The Convener", etc.) — PM picks naming convention.
- Whether to stack-rank personas globally or per-bundle.
- Whether to enumerate explicit anti-personas (corporate-shell franchise, rollup-acquirer) — those refusals live in `principles.md` Part 2; not duplicated here pending PM call.
- Whether Group-role personas (kind='business' Group steward, kind='interest' Group founder) belong here or in `groups.md`.
- Four persona slots TBD (Idea-Floater, Mutual-Aid Member, Trades-Pro Seeker, Community Steward) — will resolve when the `[TODO]` use-cases #8-11 get filled with real instances.

In `needs.md`:
- The ranking is by loop-family order (the published order in `member-journey.md`); PM may want to re-rank by importance / volume / urgency once data exists.
- Whether to enumerate anti-needs (the engagement-feed scroll, the rank-and-rate browse, the Location-locked complaint surface).
- Three needs (#2 Float an idea, #9 Find a local pro, #12 Steward what we built) name personas as TBD — match the TBD persona slots in people.md and resolve together.
- Need #13 (Federation) has no canonical example anchor in `use-cases.md` (Loop 13 is architectural). PM confirms whether this is OK or whether a federation-shaped use case should be added later.

**Cross-reference sweep — three passes:**

- Pass A: global substitution of `foundation/canonical-examples.md` → `needs/use-cases.md` and `foundation/loops.md` → `needs/member-journey.md` (plus the backticked-label forms ``canonical-examples.md`` → ``use-cases.md`` and ``loops.md`` → ``member-journey.md``).
- Pass B: targeted at `product/foundation/` files for `](member-journey.md)` and `](use-cases.md)` → `](../needs/...)` form — but this caught nothing because Pass A intentionally didn't touch the bare `(loops.md)` / `(canonical-examples.md)` URL forms, so the URLs were still in the old name.
- Pass C: targeted at `product/foundation/` for `](loops.md)` → `](../needs/member-journey.md)` and `](canonical-examples.md)` → `](../needs/use-cases.md)`. This is what actually fixed the foundation-relative links.

Net: 40 files modified, including 5 in `product/foundation/`, 5 in `product/systems/`, 9 in `skills/`, 6 in `planning/`, plus AGENTS.md, CLAUDE.md, product/MAP.md. All live broken refs to the old filenames now resolve.

**Verification.** `foundation/canonical-examples.md` and `foundation/loops.md` return zero live hits in the verification grep (excluding `_attic/`, `planning/history/`, and the new `product/needs/` files which carry intentional provenance banners). `product/foundation/` now contains exactly 5 files (principles, design-philosophy, policy, platform-promise, primitives) — matches ticket verification. `product/needs/` contains exactly 4 files (use-cases, member-journey, people, needs) — matches ticket verification.
