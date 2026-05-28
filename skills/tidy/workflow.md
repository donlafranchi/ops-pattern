# tidy — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | mode-dependent — see each sub-routine |
| **Writes** | nothing without PM ratification |
| **Sub-routines** | triage-inbox · sweep-docs · sweep-skills (each callable independently) |
| **Hands to** | nothing — PM continues |

## Picking a mode

1. If user named a mode (triage / sweep-docs / sweep-skills), use it.
2. If user said just "tidy" and `_inbox/` is non-empty → default to triage-inbox.
3. If user said just "tidy" and `_inbox/` is empty → ask: sweep-docs or sweep-skills (or both).
4. If user said "tidy everything" during a quiet maintenance window → run triage-inbox first, then sweep-docs, then sweep-skills.

---

## Sub-routine A — triage-inbox

Drain `_inbox/`, one doc at a time. Decides where each untriaged doc belongs, or whether it should fold into an existing doc.

### Reads
- The target doc in `_inbox/` (or root).
- `REGISTRY.md`, `CLAUDE.md` § "Project-specific authoritative docs", `product/MAP.md`, `product/TRACE.md`.
- Candidate parent docs identified during the walk.

### Hard rule

One doc per invocation. Batching tempts shallow analysis. Five docs in `_inbox/` = five passes. PM ratifies each move before the next begins.

### Steps

1. **Read the target doc end-to-end.** Frontmatter, intent, scope. If frontmatter is missing or wrong, surface that first.

2. **Classify the doc's shape.** Pick one:

   | Shape | Likely home |
   |---|---|
   | Active spec / system | `product/systems/` |
   | Foundation / philosophy | `product/foundation/` |
   | Capability | `product/capabilities/` |
   | UI / surface reference | `product/ui/` |
   | Need / persona / use case | `product/needs/` |
   | Exploration / sketch | `product/exploration/` |
   | Scenario draft | `planning/scenarios-backlog/` |
   | ADR proposal | route to `memo`, not this skill |
   | Bundle / sub-bundle | `planning/bundles/` |
   | Ticket | `development/tickets/` |
   | Standard / cross-cutting quality | `standards/` |
   | Meta-work product | `housekeeping/YYYY-MM-DD-{slug}/` |
   | Retired spec | `_attic/YYYY-MM-DD/{original-path}/` |
   | Process doc that lives elsewhere | flag — do not move without PM call |

3. **Check for fold-in candidate.** Before standing the doc up: is there an existing doc this should be a section of? Walk MAP.md + REGISTRY.md. If the doc is short (<200 lines) and 70%+ topic overlap exists, recommend **fold** over **new file**.

4. **Propose filename per CLAUDE.md § Naming.** `kebab-case.md` for active; `ADR-NNNN-{slug}.md` for ADRs; `housekeeping/YYYY-MM-DD-{slug}/` for dated work products. Refuse to invent a filename outside the convention.

5. **Identify references.** Grep for the doc's current path. List every file that points at it.

6. **Present recommendation as one block:**

   ```
   Target doc: _inbox/{filename}
   Shape: {one of the table rows}
   Recommendation: {FOLD into {existing path} | NEW FILE at {proposed path}}
   Rename to: {new filename per convention}
   References to update: {list of files}
   REGISTRY action: {add row | update row | no change}
   Frontmatter changes: {any cleanup needed}
   ```

7. **Wait for PM ratification.** Do not move until PM says go.

8. **On ratify, execute:**
   - `git mv` to proposed path.
   - Edit references.
   - Update `REGISTRY.md`.
   - For fold-in: merge content into parent, archive source to `housekeeping/YYYY-MM-DD-folded-{slug}/` (preserve trace).

9. **Confirm clean.** Report what landed.

### Fold-in default rules

Default to fold-in when any hold: source <200 lines · 70%+ topic overlap · source references the candidate parent >2× · candidate has an explicit extension point.

Default to new file when any hold: source >500 lines · introduces a new top-level concept · is a dated work-product · parent is already at scannable-weight ceiling.

In between: surface both options, PM picks.

---

## Sub-routine B — sweep-docs

Periodic sweep of the documentation tree. Finds doc rot. **Requires quiescence guard.**

### Reads
- Every `.md` and `.html` under `product/`, `planning/`, `development/`, `standards/`, `housekeeping/`, and root.
- `REGISTRY.md`, `product/MAP.md`, `product/TRACE.md`, `CLAUDE.md`, `git log`.

### Seven findings categories

Walk in order. Report per category.

**1. Untracked root docs.** `ls *.md *.html` at root. Allowed: `CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md` (if at root), `TRACE.md` (same), `REGISTRY.md`, `BUILD-LOG.md` (symlink). Anything else → propose move to `_inbox/` or directly to a home if obvious.

**2. Frontmatter validity.** For every `.md` under `product/`, `planning/`, `development/`, `standards/`, `housekeeping/`: has YAML frontmatter? `purpose:`, `layer:` (∈ {why, what, how}), `status:` (∈ {draft, active, deferred, complete, historical, triage}). Surface per-file violations.

**3. REGISTRY drift.** Every doc that should be in REGISTRY has a row; every row points at an existing file; every row's `purpose` matches frontmatter.

**4. Naming consistency.** Check active specs `kebab-case.md`; dated work products `housekeeping/YYYY-MM-DD-{slug}/`; ADRs `ADR-NNNN-{slug}.md`; tickets `T###-{slug}.md`; reviews `F###-review.md`. Propose renames — don't auto-rename.

**4a. Bundle filename + status convention.** Walk `planning/bundles/`:
- Every file matches `b{N}-{slug}-plan.md` (bundle plan), `b{N}[.{x}]-{slug}-{kind}.md` with kind ∈ {`sprint`, `work-map`, `audit`, `rebuild`, `wrapup`}, or is a cross-bundle sequencer (no `b{N}` prefix — currently only `bundle-themes.md`).
- Every file carries `status:` in frontmatter ∈ {`active`, `done`, `deferred`}.
- `planning/bundles/done/` must not exist. State lives in `status:`, not in directory placement. If present → propose `rmdir` (after confirming empty; if non-empty, move contents up + set their `status: done` first).
- Every file with `status: done` either lives at `planning/bundles/{file}.md` (still cited by active work) OR has been archived to `_attic/YYYY-MM-DD-vN-{slug}/` with a row in `planning/RELEASES.md`. Surface drift in either direction.
- Every shipped user-visible version has a one-line row in `planning/RELEASES.md` pointing at its `{owning-dir}/archive/vN-{slug}/RELEASE.md` per ADR-25 (pre-2026-05-28 versions cite `_attic/YYYY-MM-DD-vN-{slug}/RELEASE.md` and are grandfathered). Surface missing rows.

**5. Completed housekeeping efforts.** Walk `housekeeping/*/README.md`. Status `complete` AND no modification in >30 days → propose archive to `housekeeping/archive/YYYY-MM-DD-{slug}/` (per ADR-25). Don't auto-move.

**6. Propagation check.** For every doc under `product/` and `planning/`: get last-modified date; grep for cites; if any cite source is older than the cited file's last mod → surface as possible propagation gap. Reverse check: every cite in CLAUDE.md / AGENTS.md / MAP.md / TRACE.md / REGISTRY.md points at an existing file.

**7. Plan docs that should atomize (any execution state).** Walk `planning/`, `housekeeping/`, and root for `.md` files that contain roughly 4+ distinct items where each could be picked up independently. Execution state does not gate the finding — a freshly-landed 4-item plan and a half-completed 4-item plan are both candidates per [`meta/cowork-pipeline/DEV-PATTERN.md`](../../meta/cowork-pipeline/DEV-PATTERN.md) § Atomize big plans with mixed-state items § When to atomize.

Detection heuristics (any 2 of):
- Heading or list-item pattern signaling multiple items (`### 1. …`, `### 2. …` or numbered tables of items).
- Status markers inline (`☑ DONE`, `☐ TODO`, `**Status:** N/A`, `**Status:** ☐ TODO`) — present OR absent. Absent on a 4+ item plan still trips.
- File length over ~150 lines with an explicit item count in the header (e.g., "12 items," "8 items").
- A `## Summary` or `## Checklist` table summarizing per-item state.

For each candidate, propose:
- Atomize → one stub per item in `{plan-area}/items/`, original archived to `{plan-area}/archive/YYYY-MM-DD-{slug}/` (per ADR-25 — directory-local archives). Use the stub shape in DEV-PATTERN § Atomize big plans § The mechanics.
- Or: skip (the plan is a coherent reference, items are tightly sequenced, or meta-content is load-bearing without a durable home yet).

Do not auto-atomize. The mechanics are PM-ratified per-doc — atomization changes how the work is tracked and may need to land a meta-content home first.

### Report shape

Single document, eight sections (1, 2, 3, 4, 4a, 5, 6, 7). Each finding: file(s), one-line description, proposed action. PM ratifies (or skips) each.

### Execution

For each ratified finding:
- Frontmatter fixes → edit in place.
- File moves → `git mv` + update REGISTRY + grep-and-update back-references.
- Archive moves → `git mv` to `{owning-dir}/archive/YYYY-MM-DD-{slug}/` per ADR-25 + leave one-line stub if anything cites the original. (Pre-2026-05-28 archives at `_attic/` are grandfathered — do not retroactively move.)
- Propagation acks → no file change; optional JOURNAL entry.

Commit at end: `docs(housekeeping): {YYYY-MM-DD} doc sweep — {N} findings landed`.

---

## Sub-routine C — sweep-skills

Periodic sweep of `skills/`. Audits every skill workflow against the live pipeline contract. **Requires quiescence guard.**

### Reads
- Every `SKILL.md` and `workflow.md` under `skills/`.
- `CLAUDE.md` (especially § Agent routing + § Rebuild phase rules).
- `AGENTS.md`, `REGISTRY.md`, `skills/README.md`, `skills/install.sh`.
- `~/.claude/skills/` for symlink integrity.

### Eight findings categories

**1. Retired-skill dirs on disk.** `ls skills/` → cross-reference against CLAUDE.md § Agent routing + AGENTS.md. Any skill not listed → propose move to `_attic/{date}/retired-skills/`.

**2. Global symlink integrity.** `ls -la ~/.claude/skills/` → broken symlink → propose `rm` + re-run `skills/install.sh`. Symlinks pointing at `_attic/` skills → remove.

**3. New-mandatory-step coverage.** For every rule in CLAUDE.md § Rebuild phase rules tagged `MANDATORY`, identify enforcing skills. Confirm each enforcing skill's workflow contains the step.

Example checks (extend as new rules land):
- STAGE-LEDGER stamp → `scope`, `review`, `ticket`, `build`, `test`.
- SPEC-PATCHES append → `build` Hand off.
- Substrate lane contract → `ticket`.
- Drift check → `orient`.
- Gate A (unratified absolutes) → `scope`.
- Gate B (unratified absolutes pre-ticket) → `ticket`.
- Sibling-scenario check → `review`.

**4. Broken doc cites in skills.** For every link/path reference inside a skill workflow, confirm target exists. Common drift: skills citing `_attic/2026-05-19/...` for files that moved.

**5. Cross-skill cite integrity.** For every "see `{skill}`" / "route to `{skill}`", confirm the named skill still exists. Skills citing retired siblings → propose update.

**6. Routing table sync.** CLAUDE.md § Agent routing table. Every named skill exists; every skill in `skills/` (non-meta) appears; each row's trigger matches the skill's SKILL.md description.

**7. SKILL.md description currency.** Does each description still match what workflow.md does? Trigger phrases match current user vocabulary? Surface drift — do not auto-rewrite (descriptions are part of the trigger surface).

**8. Duplicate / overlapping skills.** Pairs whose descriptions overlap significantly.

### Report shape

One document, eight sections. PM ratifies each.

### Execution

For each ratified finding:
- Workflow edits → edit in place.
- Retired-skill moves → `git mv skills/{name} _attic/{date}/retired-skills/{name}` + remove global symlink + update CLAUDE.md routing table + update `skills/README.md`.
- Routing-table edits → edit CLAUDE.md.
- Description edits → edit SKILL.md.

Commit at end: `docs(skills): {YYYY-MM-DD} skills sweep — {N} findings landed`.

---

## Refusals (all modes)

- **Refuse to proceed if the quiescence guard fails** (sweep modes only; triage runs anytime).
- **Refuse to auto-rename docs.** Renames break cites; propose, don't execute.
- **Refuse to delete.** Always archive, never delete.
- **Refuse to act on a finding without PM ratification.**
- **Refuse to batch in triage-inbox.** One doc per invocation.
- **Refuse to rewrite a SKILL.md description without PM ratification.**
- **Refuse to add new mandatory steps to a skill unless the rule is already in CLAUDE.md or AGENTS.md.**

## Hand off

**You produced:** see SKILL.md § Hand off — mode-dependent.

**Next skill:** none. PM continues, or chains tidy modes.
