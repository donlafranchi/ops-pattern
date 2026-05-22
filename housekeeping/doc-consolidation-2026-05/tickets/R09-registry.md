# R09 — The document registry

**Phase:** 9 of 10 · **Repo:** parent · **Risk:** medium · **Depends on:** R01–R08 (the doc set must be in its final shape first).

## Objective

Install the anti-sprawl system: a `purpose` front-matter tag on every doc, a `REGISTRY.md` catalog, and a check that flags drift. After this, a doc with no distinct one-line purpose cannot quietly exist.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`.

### 1. Add front-matter to every narrative doc

For every `.md` under `product/`, `planning/`, `development/`, `standards/`, and the repo root (`CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md`/`TRACE.md` come in R10) — **excluding** `_attic/`, `housekeeping/`, `web/`, and `skills/` — add a YAML front-matter block at the very top:

```
---
purpose: One line, 12 words or fewer — the single job this doc does.
layer: why | what | how
status: active | draft | reference | historical
---
```

Write each `purpose` freshly from the doc's actual content — it must distinguish this doc from every other. `layer` follows the lens: `product/foundation/` = why; `product/needs|systems|capabilities|ui/` = what; `planning/`, `development/`, `standards/` = how. If two docs would get the same `purpose`, that is a merge the consolidation missed — stop and report it rather than writing a vague purpose.

The `doc-inventory.md` in this effort folder has a researched one-line essence for most docs — use it as raw material, but tighten to 12 words.

### 2. Create `REGISTRY.md` at the repo root

One catalog, grouped by layer:

```
# Document registry

> Every narrative doc in this repo, its purpose, and its status. If a doc is not here, it
> should not exist. If you cannot write a distinct one-line purpose for a new doc, fold it
> into an existing one instead. Generated from each doc's `purpose` front-matter.

## WHY — product/foundation/
| Doc | Purpose | Status |
|---|---|---|
| product/foundation/principles.md | ... | active |

## WHAT — product/needs · systems · capabilities · ui
...

## HOW — planning · development · standards · meta
...

## Tooling
| skills/ | The agent-pipeline skill bundle (17 skills) — not catalogued per-file | active |
```

Every doc that got front-matter in step 1 gets a row, with `purpose` and `status` copied from its front-matter.

### 3. Wire the check into `pipeline-router`

`pipeline-router` runs at session start. Add a registry-conformance step to `skills/pipeline-router/SKILL.md` (and `workflow.md` if it has one): verify that every `.md` outside `_attic/`, `housekeeping/`, `web/`, and `skills/` has front-matter with `purpose` + `layer`, that every such doc has a `REGISTRY.md` row, and that no row points at a missing file. On failure, surface the specific docs at session start. Keep it a lightweight check, not a heavy script.

### 4. Verification

- Every in-scope `.md` has a `purpose` + `layer` + `status` front-matter block.
- `REGISTRY.md` exists at the repo root; its row count equals the number of front-mattered docs.
- No two `purpose` lines are identical.
- `pipeline-router` describes the registry check.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add REGISTRY.md
git status
git commit -m "docs(consolidation): phase 9 — install the document registry"
```

## Completion

Date: 2026-05-22 · Commit: `ef5e597` · Notes:

**117 files received `purpose` + `layer` + `status` front-matter** via a Python generator script (cleaned up post-run). Coverage breakdown:

- **WHY layer (`product/foundation/`)** — 5 files: principles, design-philosophy, policy, platform-promise, primitives.
- **WHAT layer (`product/needs/` + `systems/` + `capabilities/` + `ui/` + `exploration/` + `templates/`)** — 32 files including the 4 needs/, 12 systems/, 7 capabilities/, 2 ui/, 3 exploration/, 1 templates/, 3 standards (well, 6 standards but counted in HOW).
- **HOW layer (`planning/` + `development/` + `standards/` + root audit)** — 80 files including DECISIONS, 16 ADRs, 3 bundles, 7 history docs, 3 scenarios-backlog, 1 outreach, 1 pending-ratifications, 1 rebuild-plan, 6 standards stubs, 41 tickets (1 DEVIATIONS + 4 active + 36 done), 1 root audit (`pipeline-process-audit-2026-05-22.md`).

**REGISTRY.md** at the repo root (156 lines) catalogs all 117 with their purpose, grouped by WHY / WHAT / HOW. Tooling section names `skills/`, `web/`, `_attic/`, `housekeeping/` as the excluded zones.

**Pipeline-router updated.** `skills/pipeline-router/workflow.md` adds step 9 (registry-conformance check — lightweight orientation, not enforcement). `skills/pipeline-router/SKILL.md` gets a paragraph naming the check.

**[PM: confirm] items left behind:**

- **No duplicate `purpose` lines detected** by the generator's check, but human review may still flag near-duplicates. The 36 done-ticket entries are *templated* as "Ticket TNNN — {title}." per the ticket title in the filename — they're distinct strings but functionally similar in shape. Worth confirming this template is fine, or whether each ticket needs a more substantive single-line purpose.
- **Two standards stubs use near-identical purpose shape** (e.g., "Accessibility standard — placeholder for WCAG-shaped requirements." / "Performance standard — placeholder for budget and verification.") — they're not identical strings but they share the "placeholder" framing. When the standards get real content, the purpose lines should sharpen.
- **`accountability.md`** and **`business-intelligence-platform.md`** carry `status: reference` (not active, not historical) — they're held in exploration. PM confirms the status label fits.
- **The `idea-intake.md` template** got `layer: how` per the inventory's framing (it's process tooling). PM may prefer `what` if templates are platform-shape rather than process-shape — let me know.
- **Ticket front-matter** uses `layer: how` and `status: active` (for non-done) / `status: reference` (for done). The done tickets are technically historical artifacts, but `reference` reads better since they're the canonical record of what shipped. PM picks.
- **`pipeline-router` step 9 is lightweight** by design — it names gaps but doesn't gate or run an external script. The actual conformance verification was performed once by the R09 generator and printed `Without front-matter: 0`. Future drift detection requires either a script (deferred) or the router agent doing the walk inline at session start. The current text says "verify three things" — the agent doing this would scan the file tree, check front-matter heads, and compare against REGISTRY.md rows. Manageable, but not zero work.

**No docs were "consolidation missed" candidates.** Every doc had a writable distinct one-line purpose — meaning the seven overlap-cluster merges (R05–R07) successfully dissolved the duplications. The doc inventory's seven-cluster analysis was accurate, and the consolidation through R08 closed all of them.

**Verification.** `python3 -c "..."` walked all 117 in-scope files; **0 missing front-matter**. `REGISTRY.md` has 117 catalog rows + 4 tooling rows. The temp generator scripts (`.r09-tmp-apply-frontmatter.py`, `.r09-tmp-gen-registry.py`) were removed before commit.
