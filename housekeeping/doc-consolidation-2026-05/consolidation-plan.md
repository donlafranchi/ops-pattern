# Consolidation plan — Doc Consolidation (2026-05)

*Drafted 2026-05-19, updated with PM decisions. The approved plan for the documentation consolidation. Tickets in [`tickets/`](tickets/).*

## What this effort is called and where it lives

This is the **Doc Consolidation** effort. It and its working docs live in `housekeeping/doc-consolidation-2026-05/` — filed away from the platform tree so it doesn't sit in the way of real work. See [`../README.md`](../README.md) for the housekeeping convention.

## What's locked

- **Folder spine:** what / why / how is a **labeling lens**, not new folders. `product/ planning/ development/` stay. Doc *files* get renamed; folders don't.
- **Registry:** a **`REGISTRY.md` catalog plus a per-doc `purpose` front-matter tag**, with a check that flags any doc missing a row.
- **PM decisions (2026-05-19):** naming table approved as proposed except `canonical-examples` → **`use-cases`** (not `situations`); `business-intelligence-platform.md` is **kept** for review, not archived; producer docs **merge** to `producer-tools.md`; `PIPELINE-AUDIT.md` is **archived**; `platform-promise.md` and `policy.md` stay **separate** WHY docs; `cowork-sandbox-git-bug.md` is **archived** (the PM confirmed it described user error, not a real issue).

## The headline

Not mainly a smaller raw count — `needs/` and `standards/` add genuinely missing docs. The win: every doc does **one job**, **no two docs do the same job** (seven overlap clusters dissolved), and a registry **stops sprawl from regrowing**. A doc with no distinct one-line `purpose` is not allowed to exist. The foundation / systems / capabilities narrative set drops from ~33 to ~23.

---

## 1. The what / why / how lens

The lens groups docs for the reader; it does not move folders.

| Lens | The question | Where it lives |
|---|---|---|
| **WHY** | Why we exist, what we refuse, the data spine | `product/foundation/` |
| **WHAT** | Who we serve, what they do, what we built | `product/needs/`, `product/systems/`, `product/capabilities/`, `product/ui/` |
| **HOW** | How we decide, sequence, build, and keep quality | `planning/`, `development/`, `standards/`, the meta-docs |

A ticket traces right-to-left: ticket → feature → capability/system (WHAT) → need (WHAT) → principle/loop (WHY). `TRACE.md` makes that walk visible; that is the intent-audit spine.

---

## 2. The merge map — every current doc, where it goes

### WHY — `product/foundation/` : 9 docs → 5

| Current | Becomes | Action |
|---|---|---|
| `foundational-principles.md` | `principles.md` | **merge** (lead doc) |
| `people-first.md` | `principles.md` | **merge in** — it is one principle, duplicated verbatim today |
| `community-design-philosophy.md` (the rubric/test) | `principles.md` | **merge in** — the decision test consolidates here |
| `community-design-philosophy.md` (the theory) | `design-philosophy.md` | **rename + slim** — keeps the research grounding only |
| `policy-framework.md` | `policy.md` | **rename** — the applied three-filter test |
| `primitives.md` | `primitives.md` | keep |
| `platform-promise.md` | `platform-promise.md` | keep — the public-voice version |
| `agent-assistance.md` | → `systems/agent-assistance.md` | **merge out** — folds into the merged agent system doc |
| `loops.md` | → `needs/member-journey.md` | **rename + move** to WHAT |
| `canonical-examples.md` | → `needs/use-cases.md` | **rename + move** to WHAT |

### WHAT — `product/needs/` : new, 4 docs

| Doc | Action |
|---|---|
| `needs/use-cases.md` | from `canonical-examples.md` — the 12 real use cases |
| `needs/member-journey.md` | from `loops.md` — the 13 modes of participation |
| `needs/people.md` | **new draft** — the personas |
| `needs/needs.md` | **new draft** — the ranked human needs |

### WHAT — `product/systems/` : 13 docs → 11

| Current | Becomes | Action |
|---|---|---|
| `delegation.md` + `assistant-context.md` + `skills.md` + `foundation/agent-assistance.md` | `agent-assistance.md` | **merge 4 → 1**, sectioned |
| `producer-bulletin.md` + `producer-growth.md` | `producer-tools.md` | **merge 2 → 1** |
| `member.md`, `groups.md` | unchanged files | de-dupe the standing-tier text; one owns it, the other links |
| `item.md`, `location.md`, `action-layer.md`, `discovery.md`, `payments.md`, `business-jurisdiction.md` | keep | — |
| `stewardships.md` | `stewardships.md` | arrives from `planning/bundles/` (R02); flagged for system-spec rewrite |

### WHAT — `product/capabilities/` : 11 docs → 7, and `ui/` : 2

| Current | Becomes | Action |
|---|---|---|
| `consumer-feed.md` + `locality-browse.md` | → `ui/community-platform.md` | **merge in** — the discovery surface specced in three places becomes one |
| `shareable-listing.md` | → `item-view.md` + `member-profile.md` | **fold in** — each page notes its shareable URL; standalone doc removed |
| `item-create.md` | → `_attic/` | archived (R01) — self-marked superseded |
| `member-profile.md` | `member-profile.md` | keep — fix stale `/p/` URL + "Communities" wording |
| `item-view.md`, `item-respond.md`, `event-host.md`, `group-create-join.md`, `landing-page.md`, `qr-onboarding.md` | keep | — |
| `ui/design-language.md` | keep | — |
| `ui/community-platform.md` | keep | arrives from `surfaces/` (R02); absorbs feed + browse |

### WHAT — `product/exploration/` : 6 docs → 3

| Current | Becomes | Action |
|---|---|---|
| `business-accountability.md` + `community-accountability-model.md` | `accountability.md` | **merge 2 → 1** — two takes on one system |
| `business-intelligence-platform.md` | `business-intelligence-platform.md` | **keep** — live candidate; banner added flagging it for review as a producer/maker operations-improvement tool |
| `reciprocity-and-goodwill.md` | keep | a live parked design question |
| `local-food-network.md`, `small-business-incubator.md` | → `_attic/` | stale pre-primitives framing |

### HOW — `planning/`, `development/`, `notes/` dissolved, `standards/` new

| Current | Becomes | Action |
|---|---|---|
| `notes/migration-to-primitives.md` | `planning/rebuild-plan.md` | **rename + move** — `notes/` is dissolved |
| `notes/cowork-sandbox-git-bug.md` | → `_attic/` | archived — PM confirmed it was user error, not a real issue |
| `notes/eval-helpers-architecture.md` | → `_attic/` | dead redirect stub |
| `planning/PIPELINE-AUDIT.md` | → `_attic/` | historical — findings already live in AGENTS.md/CLAUDE.md |
| `planning/reviews/` + `handoffs/` + `walkthroughs/` | `planning/history/` | consolidated (R03) |
| `planning/bundles/` (3 docs), `adrs/`, `DECISIONS.md`, `pending-ratifications.md`, `outreach/`, `DEVIATIONS.md` | keep | — |
| (new) | `standards/` | safety, security, accessibility, performance, responsiveness |
| (new) | `product/TRACE.md` | feature lineage |
| (new) | `REGISTRY.md` | the doc catalog |

---

## 3. The naming table (approved)

| # | Old name | New name | Note |
|---|---|---|---|
| 1 | foundational-principles.md (+ people-first + cdp rubric) | `principles.md` | the constitution + decision test |
| 2 | community-design-philosophy.md (theory) | `design-philosophy.md` | research grounding only |
| 3 | policy-framework.md | `policy.md` | the applied three-filter test |
| 4 | platform-promise.md | `platform-promise.md` | unchanged |
| 5 | loops.md | `member-journey.md` | moves to `needs/`; term "loop" still legal in specs |
| 6 | canonical-examples.md | `use-cases.md` | moves to `needs/` — PM red-line |
| 7 | delegation + assistant-context + skills + agent-assistance | `agent-assistance.md` | one system doc |
| 8 | producer-bulletin + producer-growth | `producer-tools.md` | one producer toolkit |
| 9 | migration-to-primitives.md | `rebuild-plan.md` | moves to `planning/` |
| 10 | business-accountability + community-accountability-model | `accountability.md` | merged |
| 11 | (new) | `people.md`, `needs.md`, `TRACE.md`, `REGISTRY.md`, `standards/` | new docs |

---

## 4. The document registry

### Part A — per-doc `purpose` front-matter

Every narrative doc gets a YAML front-matter block at the very top:

```
---
purpose: One line, 12 words or fewer — the single job this doc does.
layer: why | what | how
status: active | draft | reference | historical
---
```

If you cannot write a distinct one-line `purpose`, the doc should not exist — fold it into an existing one. That sentence is the actual sprawl defense.

### Part B — `REGISTRY.md` at the repo root

One catalog, grouped by layer (WHY / WHAT / HOW), each row: doc · purpose · status. Refreshed from the front-matter so it cannot silently drift. `skills/` appears as one grouped row — pipeline tooling, not per-file catalogued.

### Part C — the check

Folded into the existing `pipeline-router` skill (runs at session start). It verifies: every `.md` outside `_attic/`, `housekeeping/`, and `web/` has front-matter with `purpose` + `layer`; every such doc has a `REGISTRY.md` row; no row points at a missing file. A failure surfaces at session start, before sprawl sets in.

---

## 5. Where the "100 other things" go

`standards/` is the home for cross-cutting concerns that are not "what people do in the app" — qualities the build must satisfy. Initial scaffold: `safety.md`, `security.md`, `accessibility.md`, `performance.md`, `responsiveness.md`, each a one-section stub. They sit under the HOW lens and get referenced by ADRs, reviews, and the M-gates. New concern → new `standards/` doc with a registry row.

---

## 6. The 10-phase ticket plan

Each phase is one Claude Code commit — `docs(consolidation): phase N — …`, parent repo, straight to `main`. Merge phases (R05–R08) produce drafts the PM reviews — merging docs is content work, not mechanical.

| Phase | Ticket | Does |
|---|---|---|
| 1 | `R01-consolidate-archives.md` | Sweep `*/archive/` + `item-create.md` + `PIPELINE-AUDIT.md` + 2 stale exploration docs → `_attic/`; commit the housekeeping record too |
| 2 | `R02-relocate-misplaced-files.md` | `stewardships.md` → systems; `community-platform.md` → ui; retire `surfaces/` |
| 3 | `R03-consolidate-planning-history.md` | `reviews/` + `handoffs/` + `walkthroughs/` → `planning/history/` |
| 4 | `R04-dissolve-notes-scaffold-standards.md` | Dissolve `notes/`; create `standards/` with five stubs |
| 5 | `R05-why-merge.md` | `principles.md` (merge 3), `design-philosophy.md`, `policy.md` |
| 6 | `R06-systems-merge.md` | `agent-assistance.md` (merge 4), `producer-tools.md` (merge 2) |
| 7 | `R07-capabilities-merge.md` | Discovery triangle → `community-platform.md`; fold `shareable-listing`; `accountability.md`; flag `business-intelligence-platform.md` |
| 8 | `R08-build-needs-layer.md` | `needs/`: `use-cases.md`, `member-journey.md`, draft `people.md` + `needs.md` |
| 9 | `R09-registry.md` | Front-matter on every doc; `REGISTRY.md`; wire the check into `pipeline-router` |
| 10 | `R10-trace-and-final-sweep.md` | `TRACE.md`; refresh `MAP.md` / `CLAUDE.md` / `AGENTS.md`; final link audit; JOURNAL entry |

Run in order R01 → R10. Each is one revertable commit (`git revert <hash>`).
