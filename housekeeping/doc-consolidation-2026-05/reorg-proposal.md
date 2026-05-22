# Parent-repo reorganization — decision memo

*Drafted 2026-05-19. Proposal only — nothing has been moved.*

## Recommendation

Do **Option B — moderate restructure**: add a `product/needs/` front door (people, situations, needs), write one `product/TRACE.md` that maps need → system → capability → feature → ticket, move `stewardships.md` out of `bundles/` into `systems/`, fold the orphan `surfaces/` folder into `ui/`, collapse `reviews/` + `handoffs/` + `walkthroughs/` into `planning/history/`, and sweep every scattered `archive/` sub-folder into one dated `_attic/`. Keep the names "foundation / systems / capabilities" — the disorientation is information-architecture, not vocabulary.

## The four options

| Option | Shape | Trade-off |
|---|---|---|
| **A — Index only** | Write `TRACE.md`, move nothing. | Cheapest (~1 hr). Doesn't fix disorientation — orphan folders and the misplaced `stewardships.md` still confuse on read. |
| **B — Moderate restructure** *(recommended)* | Add `needs/` + `TRACE.md`, move stewardships, fold surfaces, consolidate planning history, one attic. | ~4–6 hrs. Touches ~12 cross-references in `CLAUDE.md` / `MAP.md`. Reversible with `git mv`. |
| **C — Rename top tiers** | Option B, plus rename `product → vision`, `planning → release`, `development → build`. | Most "human-readable" names, highest cost (~8–10 hrs). Every `CLAUDE.md` / `AGENTS.md` / skill path reference updates; risks breaking pipeline skills that path-match. |
| **D — Greenfield rewrite** | Move active docs to a fresh tree; archive the rest wholesale. | Cleanest result, 1+ day. Loses the lived navigation patterns and the cross-link web. Overkill — most active docs are healthy. |

## The decision dimensions that actually separate them

| Dimension | A | B | C | D |
|---|---|---|---|---|
| Time cost | ~1 hr | ~4–6 hr | ~8–10 hr | 1+ day |
| Disorientation fixed | Partial | High | High | Highest |
| Reversibility | Trivial | Easy | Moderate | Hard |
| Risk to pipeline skills | None | Low | Medium | High |
| "Human-centered" lift | Low | High | Highest | Highest |

The honest read: B and C produce nearly the same daily experience. C only wins if the *words* `product` / `planning` / `development` genuinely bother you. They cost the most and risk the most because the pipeline skills path-match on those folder names.

---

— stop scroll — everything below is detail —

---

## Why it's disorienting right now

The repo is organized like engineering output — `foundation`, `systems`, `capabilities`, `surfaces`, then `planning`, `development`. It reads bottom-up: primitives first, humans implied. There is no page that opens with *"who is this for and what do they want."* The migration to primitives also left rename-trails everywhere (`vendor-*` → `producer-*`, `community/cooperative/member-operations` → `groups`), orphan folders (`surfaces/` holds one file), a misfiled spec (`stewardships.md` sits in `planning/bundles/` but is system-shaped), and `archive/` sub-folders scattered across six locations.

The fix is small. It is not a new pipeline. It is a missing front door plus cleanup.

## The proposed mental model — five layers, top-down

| Layer | What lives here | Folder | Change |
|---|---|---|---|
| 1. Why | Mission, loops, principles, design philosophy | `product/foundation/` | Keep |
| 2. Who & what they need | Personas, real situations, ranked human needs | `product/needs/` | **New** |
| 3. What we built | Primitives + system specs | `product/systems/` | Keep |
| 4. What members can do | Capabilities — atomic, human-language verbs | `product/capabilities/` | Keep |
| 5. What ships next | Scenarios → tickets → evals | `planning/`, `development/` | Keep |

The `needs/` layer is the single load-bearing change. It is where you walk in. Everything else is cleanup behind it.

## The traceability trick — your "where did this come from" answer

Every system spec gains a three-line lineage header:

```
Serves needs: <needs/...>
Anchored loops: <loops.md L#>
Surfaces capabilities: <capabilities/...>
```

`product/TRACE.md` aggregates those headers into one table — rows are features, columns are Need / Loop / System / Capability / Feature / Ticket / Status. When a ticket appears and the feature feels fuzzy, you walk it backward. If any step in the trace is empty or stale, the feature is engineering-driven and worth interrogating.

**Worked example — the Run Club feature (F018):**

1. **Why** → Loop 1, Gather (`foundation/loops.md`)
2. **Need** → "Find people doing what I want to do, near me" — persona Brian (`needs/needs.md`, `needs/people.md`)
3. **System** → Item kind=gathering + Location (`systems/item.md`, `systems/location.md`)
4. **Capability** → Event-host (`capabilities/event-host.md`)
5. **Feature → ticket** → F018 → gathering-composer ticket (`scenarios/F018-…` → `tickets/T…`)

## The specific moves

| Action | From | To | Why |
|---|---|---|---|
| New | — | `product/needs/people.md` | Personas as a load-bearing doc, not buried in canonical-examples |
| New | — | `product/needs/needs.md` | The ranked "what humans need" list, each with a one-line trace |
| Move | `foundation/canonical-examples.md` | `needs/situations.md` | It's the situations file — belongs in *needs*, not *foundation* |
| New | — | `product/TRACE.md` | One page: need → system → capability → feature → ticket |
| Move | `planning/bundles/stewardships.md` | `product/systems/stewardships.md` | A system spec wearing a bundle hat |
| Move | `product/surfaces/community-platform.md` | `product/ui/community-platform.md` | Fold orphan folder (1 file) into ui/ |
| Consolidate | `planning/{reviews,handoffs,walkthroughs}/` | `planning/history/` | All retrospective process artifacts — one folder is enough |
| Move | `planning/PIPELINE-AUDIT.md` | `notes/process/pipeline-audit.md` | Reflective process doc, not active planning |
| Archive | all `*/archive/` sub-folders | `_attic/2026-05-19/` | One graveyard; drop the noise from the active tree |
| Archive | `capabilities/item-create.md` | `_attic/2026-05-19/` | Already self-marked "superseded by loop-specific capabilities" |
| Decide | capability files | — | Audit each of the 12: promote, add a "Serves" header, or archive |

## What stays untouched

`foundation/` (the constitution — names are well-chosen). The four-tier pipeline (product → planning → development → eval — the structure works; the gap was the missing front door). ADR files, scenarios, tickets, `JOURNAL`, `DECISIONS`, `AGENTS` — all functioning. `skills/`. And `web/` is fully out of scope — parent repo only.

## New docs to write if B is approved

1. `product/needs/people.md` — personas extracted from canonical-examples + scenarios (Brian, Maya, Aaron, the host, the producer, the steward). One paragraph each: who they are, what they want, where they get stuck today.
2. `product/needs/needs.md` — ranked human needs, synthesized from `community-design-philosophy.md` (member journey) + `people-first.md` + `loops.md`. Each need carries a one-line trace.
3. `product/needs/situations.md` — relocated `canonical-examples.md`, each of the 12 gaining a "Persona" and "Need served" header.
4. `product/TRACE.md` — the lineage table.
5. A three-line lineage header pattern landed on each system spec as it's next edited.

## What goes into `_attic/2026-05-19/`

All `product/*/archive/` sub-folders; `planning/scenarios-backlog/archive/` (F001–F024); `planning/bundles/archive/` (pre-primitives bundles); `development/tickets/archive/` (T019–T040); `planning/archive/` (old JOURNAL slices, superseded DECISIONS, food-pivot, intent-audit); `notes/archive/`. Git history preserves the full chain. Anything still referenced from a live doc stays live — only orphans go to the attic.

---

## Decisions you need to make

1. **Path** — A, B (recommended), C, or D.
2. **Stewardships disposition** — move as-is into `systems/`, rewrite as a proper system spec first, or split into "stewardship system" + "stewardships bundle"?
3. **Capability audit** — walk all 12 files now, or queue as a follow-up?
4. **Archive aggressiveness** — single `_attic/2026-05-19/`, or keep per-folder `archive/` as today?
5. **Cross-reference edits** — I update `CLAUDE.md` / `MAP.md` paths as part of the move, or you sweep after?

**Restated recommendation:** Option B — moderate restructure. Add `product/needs/` + `product/TRACE.md`, move stewardships into systems, fold surfaces into ui, consolidate planning history, one attic. Keep the current tier names. The assumption driving the pick: your disorientation is information-architecture, not naming — if renaming the tiers genuinely matters, switch to C and tell me.
