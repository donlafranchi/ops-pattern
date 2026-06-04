---
id: how-stage-ledger-dir
purpose: Per-F-number / per-substrate-group stage tracker. Each file is a single concept's stage history; parallel sessions don't collide because each writes only its own file.
layer: how
status: active
---

# stage-ledger/ — per-concept pipeline stage tracker

> Atomized from the legacy `planning/STAGE-LEDGER.md` monolith on 2026-06-03 to remove the parallel-session write-conflict class. Retired entries remain in the monolith; active entries live here as one file per F-number or substrate group.

## How this directory works

**One file per concept.**

- F-numbers — `F{NNN}.md` (e.g. `F030.md`, `F032.md`)
- Substrate groups — `{slug}.md` matching the substrate label (e.g. `S-polygon.md`, `S-metro.md`, `b1x-geography-sprint.md`)

**Each file owns one row of the legacy ledger.** Stage transitions append to the file's body as dated entries — never overwrite. Regressions (`plan-approved` → `plan-backlog`) append a new entry; the prior entry stays visible.

## File format

```markdown
---
id: stage-{F###-or-slug}
purpose: Pipeline stage for {concept}.
layer: how
status: active   # or `retired`
concept_kind: feature  # or `substrate`
stage_current: building
last_activity: 2026-06-03
---

# {F### or substrate slug} — {one-line concept}

**Spec contract:** {file paths the concept derives from, e.g. `member.md`, `discovery.md`}
**Anchor:** {use-cases.md C1, or other north-star pointer}

## Stage history (append-only)

- **2026-05-28** · `plan-backlog` — drafted by `scope`
- **2026-06-02** · `plan-approved` — moved to `planning/next/` by PM
- **2026-06-02** · `ticketed` — T086–T089 written by `ticket`
- **2026-06-02** · `building` — first commit by `build`
- **2026-06-02** · `eval` — Playwright spec authored by `test`
- **2026-06-02** · `done` — evals 4/4 GREEN, merged to main (`t-f030`)

## Notes

{free-form context: what shipped, what's blocked, which forward-deps. Same content as the old "Notes" column.}
```

## Stage enum

| Stage | Set by | Meaning |
|---|---|---|
| `product` | `explore` | System spec exists, no scenario yet |
| `plan-backlog` | `scope` (draft) | Scenario drafted in `planning/backlog/` |
| `plan-approved` | `scope` (approve) | Scenario in `planning/next/` |
| `reviewed` | `review` | `review-F{NNN}.md` exists with verdict PROCEED/REVISE/EXTEND |
| `ticketed` | `ticket` | ≥1 ticket exists referencing this scenario |
| `building` | `build` | First ticket moved past initial commit |
| `eval` | `test` (run mode) | Build complete; running evals |
| `done` | `test` (run mode, pass) | Evals green; concept shipped |
| `deferred` | PM | Explicitly held back; carry the reason inline |

**Substrate concepts** use the same enum minus `plan-*` and `reviewed` (substrate has no scenario).

## Reading the ledger (aggregation)

`orient` and `tidy` glob this directory at session start and surface:

- Any concept in `building` >14 days
- Any file where stage history conflicts with what artifacts exist on disk
- Everything in `deferred`

Aggregation is a directory read, not a single-file write — that's the load-bearing property that lets parallel sessions stamp without colliding.

## Stamping rule

Each pipeline skill writes its own stage transition as the final step of its workflow. Append a dated bullet to the file's "Stage history" section. **Never edit a prior entry** — regressions add new dated rows so round-trips remain visible.

## Substrate lane

Substrate concepts (no F-number) get a slug-named file. The "Spec contract" field names the system spec section(s) + memo(s) that own the substrate's contract; this replaces the scenario's Given/When/Then for substrate work.

## Migration provenance

- Legacy monolith: [`../STAGE-LEDGER.md`](../STAGE-LEDGER.md) — retains retired F-numbers and retired substrate groups in their original tables.
- New files in this dir were migrated 2026-06-03 from the legacy "Features — Active" + "Substrate — Active" tables.

## Maintenance

- **Backfill on first stamp.** When a skill stamps a concept that doesn't have a file, create it with all known prior stages backfilled from artifact dates.
- **Do not delete files.** When a concept retires, set `status: retired` in frontmatter and add a final "retired" entry to the Stage history — the file stays.
- **PM ratifies regressions.** A stage moving backwards triggers a JOURNAL entry alongside the appended history row.
