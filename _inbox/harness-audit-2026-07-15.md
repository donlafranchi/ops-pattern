---
purpose: LLM harness audit — inventory, scoring, gaps, fixes.
layer: how
status: draft
---

# Harness Audit — 2026-07-15

Audit of the LLM agent harness for the Project (CDP). Inventory of actual artifacts, scored against six harness-quality checks, with prioritized gaps and smallest fixes.

---

## 1. Inventory

### System Prompts (agent identity + rules)

| Artifact | Location | Status |
|---|---|---|
| Root router | `CLAUDE.md` (~800 lines) | Exists, git-tracked. Contains skill routing table, rebuild-phase rules, naming conventions, commit rules, report shape. |
| Agent pipeline | `AGENTS.md` (393 lines) | Exists, git-tracked. 12 skills defined with read/write firewalls, tool assignments, gates, escalation. |
| App-specific | `web/CLAUDE.md` (86 lines) | Exists, tracked in web repo. Tech stack, commands, directory structure, API-route CI rules. |
| Skill identity (SKILL.md) | `skills/{name}/SKILL.md` (16 files) | Exists for all 16 skills (atomize, build, close, dry-docs, explore, loop-designer, memo, orient, review, scope, simplify-review, sync, test, ticket, tidy, weigh). All git-tracked. |
| Skill workflows | `skills/{name}/workflow.md` (14 files) | Exists for 14 of 16 skills. Missing for `loop-designer` and `simplify-review`. All git-tracked. |
| Skill templates | `skills/{name}/templates/` | Present for explore (3), build (1), scope (2), test (2), ticket (1), memo (1), review (1). |
| External-skill manifest | `skills/EXTERNAL-SKILLS.md` | Exists. Documents 4 plugin suites (engineering, design, product-management, anthropic-skills) with install instructions. |
| Nested CLAUDE.md | product/, planning/, development/ | **None.** By design: "Process lives in skills, not nested CLAUDE.md files." |
| Global user instructions | `~/.claude/...CLAUDE.md` | Exists. Defines the tiered agent pipeline pattern, scaffolding rules, output style. |

### Context / Memory (session-scoped + persistent)

| Artifact | Location | Status |
|---|---|---|
| Session log | `JOURNAL.md` | Exists, git-tracked. 30-day rotation policy, entries archived to `planning/done/`. |
| Pipeline stage tracker | `planning/STAGE-LEDGER.md` + `planning/stage-ledger/*.md` (20 per-file entries) | Exists, git-tracked. Monolith frozen 2026-06-03; canonical state in per-file entries. |
| Build progress | `web/BUILD-LOG.md` (symlinked from root) | Exists, tracked in web repo. **No rotation policy — append-only, header paragraph is ~2500 chars of dense text.** |
| Active work | `planning/now/` (6 files: bundle-1.md, checklist, themes, + initiative files) | Exists, git-tracked. |
| Architecture map | `product/MAP.md` | Exists, git-tracked. One sentence per system. |
| Feature lineage | `product/TRACE.md` | Exists, git-tracked. Need-to-ticket trace table + lineage gap list. |
| Doc catalog | `REGISTRY.md` | Exists, git-tracked. Grouped by layer (foundation / needs / systems / capabilities / ui). |
| User auto-memory | `MEMORY.md` (3 entries) | Exists. Email, current date, decision-format preference. |
| Memory curation | `consolidate-memory` (Anthropic skill) | Referenced in CLAUDE.md as "invoke once a month." **No schedule, no trigger, no evidence of execution.** |

### Tool / Skill Definitions

| Category | Count | Status |
|---|---|---|
| Project skills (in routing table) | 12 | orient, explore, scope, weigh, review, memo, atomize, ticket, test, build, sync, tidy — all have SKILL.md + workflow.md. |
| Project skills (NOT in routing table) | 4 | `close` (in routing table as of recent update), `dry-docs` (not referenced), `simplify-review` (referenced only in build workflow), `loop-designer` (in routing table, no workflow.md). |
| External plugin skills | 4 suites, ~24 skills | engineering (9), design (5), product-management (5), anthropic-skills (6). Documented in EXTERNAL-SKILLS.md. |
| Playbooks (how-to procedures) | 6 files | PLATFORM-PATTERNS, DEVELOPMENT-PATTERNS, DECISION-PATTERNS, writing-docs, repo-tidying, deployment-pipeline. All git-tracked. |

### Eval Harness (automated scoring)

| Artifact | Location | Status |
|---|---|---|
| Feature evals (Playwright) | `web/evals/features/` (11 specs: F030-F042, missing F031/F039) | Exists, tracked in web repo. Each traces Given/When/Then from approved scenarios. |
| Phase evals (Playwright) | `web/evals/phase-0/` (1 spec), `web/evals/phase-1/` (12 specs) | Exists. Schema-level substrate verification. |
| Eval results | `web/evals/results/` (7 dated markdown files) | Exists. Pass/fail per beat with scenario traceability. |
| Eval fixtures | `web/evals/fixtures/` (11 files) | Exists. Per-feature test data. |
| Unit tests (Vitest) | `web/tests/` (53+ files) + `web/src/**/*.test.*` (36+ files) | Exists. ~900+ tests. Mix of action tests, CI enforcement, domain logic. |
| Mutation testing | `stryker.config.mjs` | Exists. 58% baseline score. Local-only, no CI gate. |
| Harness conformance | **None** | **Missing. No automated check that the harness itself (routing table, skill inventory, CLAUDE.md/AGENTS.md consistency) is self-consistent.** |

### Trace / Logging (reasoning capture)

| Artifact | Location | Status |
|---|---|---|
| Implementation drift | `development/DEVIATIONS.md` (monolith, frozen) + `development/deviations/*.md` (43+ per-ticket files) | Exists. Mandatory per ticket — "even a one-line 'no deviations.'" Carries Why + Impact + Escalation. |
| Stage transitions | `planning/STAGE-LEDGER.md` + per-file entries | Exists. Timestamps per stage; regressions append, never overwrite. Round-trips visible. |
| Review reasoning | `planning/{now,next}/review-F{NNN}.md` | Exists for reviewed features. Architecture + design + security verdicts with rationale. |
| Commit traceability | `T{NNN}: {Title}` format | In use. Every commit references a ticket. |
| Pipeline cost traces | `_audit/` (run.jsonl + report.html per feature) | Exists but **untracked in git.** Contains token-usage data per pipeline run. |
| Session pointers | `JOURNAL.md` | Exists. Points to durable docs; includes commit hashes. |
| Test intent preservation | `// Why:` comments in eval specs | Documented discipline in test workflow. |

### Version Control on the Harness

| Artifact | Tracked | Repo |
|---|---|---|
| CLAUDE.md | Yes (10+ modification commits) | Parent |
| AGENTS.md | Yes | Parent |
| All skills/ (SKILL.md, workflow.md, templates/) | Yes | Parent |
| All playbooks/ | Yes | Parent |
| JOURNAL.md, REGISTRY.md, MAP.md, TRACE.md | Yes | Parent |
| planning/ (stage-ledger, scenarios, bundles) | Yes | Parent |
| development/ (tickets, deviations) | Yes | Parent |
| web/CLAUDE.md, BUILD-LOG.md | Yes | Web |
| web/evals/ | Yes | Web |
| _audit/ (pipeline traces) | **No** | Untracked |

---

## 2. Scoring

### Single job per agent — PASS

Each of the 16 skills has a clear "one question" (named in the SKILL.md) and enforced read/write firewalls. The tool firewall is hard: Cowork-side skills never touch code; Claude Code skills never edit specs. The folded sub-routines (security inside review; user-voice inside explore; prune+resync inside orient) share reads with their parent and serve the same question.

`build` has accumulated the most steps (20 in workflow.md), but these are sequential stages of one TDD cycle, not parallel concerns.

### Two-layer prompt — PARTIAL

**What works:** There is a clear stable base (CLAUDE.md architecture + AGENTS.md pipeline + SKILL.md identity) and a session-scoped layer (JOURNAL.md, STAGE-LEDGER, BUILD-LOG). JOURNAL.md has a 30-day rotation. DEVIATIONS and STAGE-LEDGER were atomized to per-file entries to prevent monolith bloat.

**What doesn't:** CLAUDE.md contains a 14-rule "Rebuild phase -- special rules" section that is explicitly temporary ("active until b1 ships") but lives inline in the stable router. No expiry mechanism. BUILD-LOG.md has no rotation policy and its header paragraph is already a dense wall of text. The temporal rules will outlive b1 unless someone remembers to remove them.

### Score-before-optimize — PARTIAL

**What's scored automatically:**
- Feature correctness: Playwright evals with pass/fail per Given/When/Then clause (11 feature specs).
- Regression: Vitest unit tests (~900+).
- Coverage quality: Stryker mutation testing (58% baseline).
- CI enforcement: 4 rules checked by dedicated test files.

**What's not scored automatically:**
- Harness self-consistency: no check that the routing table matches the skills/ directory, that every SKILL.md has a workflow.md, or that AGENTS.md and CLAUDE.md agree on skill lists.
- Context size: no alert when BUILD-LOG.md or CLAUDE.md exceeds a threshold.
- Memory freshness: consolidate-memory is "once a month" with no trigger.
- Skill usage: tidy's sweep-skills mode can audit but only fires on human request.

### Traces over outcomes — PASS

This is the project's strongest harness quality. DEVIATIONS captures the WHY (mandatory, per-ticket, with Impact + Escalation sections). STAGE-LEDGER preserves regressions as appended entries. Review files record architectural reasoning. The `// Why:` comment discipline in test specs prevents silent test drift. JOURNAL entries point to durable docs rather than restating facts. Commit messages carry ticket numbers.

The one gap: `_audit/run.jsonl` files capture full pipeline traces (token usage per step) but are untracked in git, so they could be lost on a machine wipe.

### Tool minimality — MOSTLY PASS

12 skills in the routing table, each with a clear trigger. External skills are documented with install instructions.

**Drift found:**
- `dry-docs` exists in skills/ but is not referenced in CLAUDE.md or AGENTS.md. Candidate for absorption into `tidy` (sweep-docs mode) or promotion to the routing table.
- `simplify-review` is referenced only in build's workflow (step 14) but not in the routing table. It functions as a build sub-routine. Should be documented as such or promoted.
- `loop-designer` is in the routing table but has no workflow.md. Either a placeholder or under-documented.
- `close` is referenced in the routing table but not in the AGENTS.md detailed section. Partial documentation.

### Context size discipline — PARTIAL

**Curated on a schedule:** JOURNAL.md (30-day rotation, enforced by orient). DEVIATIONS (atomized at phase boundary). STAGE-LEDGER (atomized to per-file).

**Append-only, no cap:** BUILD-LOG.md. Its "Last updated" paragraph is a single run-on block of ~2500 characters and growing. Every agent reading it pays the full context cost.

**Temporal rules baked into stable file:** CLAUDE.md rebuild-phase rules (14 items) are temporary but have no expiry trigger.

**Memory:** 3 entries currently; consolidation instruction exists but no automation.

---

## 3. Top 5 Gaps

### Gap 1 — No automated harness self-consistency check

**Severity: Highest.** The harness cannot detect its own drift. The routing table in CLAUDE.md lists 12 skills; AGENTS.md has detailed sections for 12 skills; skills/ contains 16 directories. Three skills (dry-docs, simplify-review, loop-designer) are in varying states of documentation. There is no script that checks: (a) every routing-table entry has a matching skills/ directory, (b) every skills/ directory appears in the routing table or is explicitly tagged as a sub-routine, (c) every SKILL.md has a workflow.md, (d) CLAUDE.md and AGENTS.md agree on skill lists and read/write firewalls.

**Why it blocks self-improvement:** Without automated conformance checking, harness edits (adding a skill, renaming a stage, changing a firewall) can silently break the pipeline's coherence. The `tidy` sweep-skills mode can catch some of this, but it's manual, advisory, and guarded behind a quiescence check that prevents it from running during active work.

**Smallest fix:** A shell script (`scripts/harness-conformance.sh`) that: (1) extracts skill names from the CLAUDE.md routing table, (2) lists skills/ directories, (3) checks each direction for mismatches, (4) verifies SKILL.md + workflow.md presence per skill, (5) exits non-zero on any finding. Add it to orient's drift checklist. ~50 lines.

### Gap 2 — BUILD-LOG.md has no rotation policy

**Severity: High.** BUILD-LOG.md is append-only. Its header paragraph is a single dense block covering every ticket shipped in the current bundle. Unlike JOURNAL.md (30-day rotation) and DEVIATIONS.md (phase-boundary rotation), BUILD-LOG.md has no archive trigger. Every agent that reads it — build, sync, orient, test — pays the full context cost of every prior ticket's ship notes, even though only the current ticket matters.

**Why it matters:** Context window is the scarcest resource in the pipeline. A 3000-word BUILD-LOG.md means 3000 words less for the actual ticket + scenario + system spec that the agent needs to read.

**Smallest fix:** Add a rotation policy to BUILD-LOG.md's header: "At each bundle close, the current `Last updated` block archives to `web/BUILD-LOG-archive-b{N}.md` and resets. The Progress table stays cumulative." Mirror the JOURNAL.md pattern. Add the size check to the proposed conformance script.

### Gap 3 — `_audit/` pipeline traces are untracked

**Severity: Medium.** The `_audit/` directory contains per-feature `run.jsonl` files (full pipeline traces with token usage) and `report.html` files (cost reports). These are the only artifacts that capture step-by-step pipeline execution cost. They are untracked in git and would be lost on a machine wipe, OS reinstall, or repo re-clone.

**Why it matters:** Pipeline traces are the data source for optimizing agent efficiency. Without them, questions like "how many tokens does the build skill use per ticket" and "which skill is the most expensive" can only be answered by re-running the pipeline with instrumentation.

**Smallest fix:** Add `_audit/*.jsonl` and `_audit/*.html` to git tracking (they are small text/HTML files, not build artifacts). Add `_audit/node_modules/` to `.gitignore`. Alternatively, if the traces are too large for git, document the `_audit/` tooling in a README so it can be reproduced.

### Gap 4 — Temporal rules in CLAUDE.md have no expiry mechanism

**Severity: Medium.** The "Rebuild phase -- special rules" section contains 15 numbered rules that are "active until the b1 user-surface set is shipped and the b1 bundle archives." These rules are load-bearing today but will become dead weight after b1 ships. There is no mechanism to detect when b1 has shipped and flag these for removal.

**Why it matters:** After b1, agents will still read and apply these rules (adding review gates, DEVIATIONS entries, STAGE-LEDGER stamps) even when they no longer apply. The rules aren't harmful post-b1, but they add context cost and cognitive overhead to every agent invocation.

**Smallest fix:** Add a check to orient's drift checklist: "If `planning/now/bundle-1.md` has moved to `planning/done/`, flag the rebuild-phase rules in CLAUDE.md for removal." One line in the orient workflow.

### Gap 5 — Skill routing-table drift (3 undocumented, 1 under-documented)

**Severity: Low.** Four skills are in inconsistent documentation states:
- `dry-docs` — has SKILL.md + workflow.md, not in routing table, not in AGENTS.md. Ghost skill.
- `simplify-review` — has SKILL.md (no workflow.md), referenced only in build's workflow step 14, not in routing table. Undocumented sub-routine.
- `loop-designer` — in routing table, has SKILL.md, no workflow.md. Under-documented.
- `close` — in routing table, has SKILL.md + workflow.md, not in AGENTS.md detailed section.

**Why it matters:** A new agent session encountering "dry docs" or "simplify this diff" has no routing guidance. The routing table is the agent's decision tree; unlisted skills are invisible to it.

**Smallest fix:** For each: either add it to the routing table with a trigger phrase, or document it as a sub-routine of its parent skill (dry-docs as a tidy sub-routine, simplify-review as a build sub-routine). Update AGENTS.md to match. The conformance script from Gap 1 would prevent this from recurring.

---

## 4. Fix First

**Gap 1 — the harness conformance script.** It is the only fix that prevents the other gaps from recurring. A script that checks routing-table-to-skills consistency would have caught Gap 5 (routing drift) automatically. Adding a BUILD-LOG size check to the script surfaces Gap 2. Adding an orient-checklist update surfaces Gap 4. The script is small (~50 lines of shell), reversible (no existing files modified), immediately useful (run it once, see findings), and composable (add new checks as new gaps appear).

Once the conformance script exists, every subsequent harness edit — adding a skill, changing a firewall, editing the routing table — gets an automated smoke test. That is the self-improvement loop the harness currently lacks.
