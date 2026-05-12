# Pipeline Audit — 2026-05-09

> One-time architectural audit of the agent pipeline ahead of the primitives migration. Written for a solo founder. Top stated risk: **architectural mistakes**.
>
> **Banner (2026-05-10):** Several references in this audit assume the prior 7-phase migration plan with dual-write and a Phase 5 sunset window. The 2026-05-10 PM decision to rebuild on a clean slate (no live data; no dual-write; four phases instead of seven) supersedes those assumptions. The pipeline-process findings (review gates, accessibility, ADRs, code-review at ticket close, deploy checklist on schema-touching merges, DEVIATIONS.md discipline) survive the reframe unchanged. References to "Phase 5" should read as "Phase 4 of the rebuild plan." References to "dual-write" no longer apply (see ADR-10 rewrite 2026-05-10). References to T028-T050 are historical — those tickets are STALE-banned and the rebuild plan re-allocates T-numbers. See [`../notes/migration-to-primitives.md`](../notes/migration-to-primitives.md) for the current plan.

---

## TL;DR

**The pipeline is well-designed. It is being mis-operated.**

Seven agent roles are defined in `AGENTS.md` with explicit firewalls, gates, and escalation contacts. That is more rigor than most teams ship. But the surface that a fresh agent reads first — the root `CLAUDE.md` — advertises only six of those roles, never names two of them (`pipeline-review`, `pipeline-ticket`), and provides no explicit "use which agent when" routing. The downstream gates (PM-approves-scenario, eval-write-before-build, drift-into-DEVIATIONS.md) are bypassed in practice because nothing enforces them on a solo team.

For an architecturally risky migration, this combination is dangerous. Recommendations:

1. **Rewrite `CLAUDE.md`** — explicit routing table, skill triggers per stage, ADR/design gates, migration-phase rules. (Done in this pass.)
2. **Promote `pipeline-review` from optional to mandatory** for the entire migration window. Every scenario in Phases 1–5 of `notes/migration-to-primitives.md` touches Person/Item/Location.
3. **Add four solo-team multipliers** as gates between existing stages: ADR-required, code-review-after-build, accessibility-review-on-new-surface, deploy-checklist-before-push. Each maps to a Cowork plugin skill that the project does not currently invoke.
4. **Install the Cowork plugin skills locally** so the project's pipeline can actually call them from any Claude Code session, not just inside Cowork. Setup script: `skills/install.sh` (extended).
5. **Fix the four known-bad operational states** — F018 still in backlog while tickets reference it; T028–T040 drafted before migration plan approved; `web/BUILD-LOG.md` two weeks stale; `DEVIATIONS.md` empty across 24 shipped tickets.
6. **Write `product/systems/member.md` before opening T028.** Person is the anchor primitive and has no spec.

The rest of this document is the evidence and the plan.

---

## What I read

- Root `CLAUDE.md`, `JOURNAL.md` (top 120 lines), `AGENTS.md`, `skills/README.md`
- `notes/migration-to-primitives.md`, `planning/bundles/b1-primitives.md`
- Survey of `product/`, `planning/`, `development/`, `web/` directories and their stale/orphan files
- Catalog of installed Cowork plugin skills (engineering / design / product-management / brand-voice / anthropic-skills) against the project's pipeline stages

---

## Findings

### Severity legend

- 🔴 **Critical** — blocks the migration or causes architectural drift now
- 🟡 **Significant** — drift accumulates if unaddressed; fix this cycle
- 🟢 **Polish** — fix opportunistically

### F1 🔴 Root `CLAUDE.md` is wrong about which agents exist

The router file lists six skills (`pipeline-router`, `pipeline-product`, `pipeline-plan`, `pipeline-build`, `pipeline-eval`, `pipeline-scaffold`). `AGENTS.md` defines seven roles. Two real, project-resident skills are never named in `CLAUDE.md`: **`pipeline-review`** (architecture + design pre-flight) and **`pipeline-ticket`** (sequencer). The first agent a session loads has incorrect intel about its toolkit.

**Impact:** any fresh agent that reads `CLAUDE.md` first — every router invocation — will not know to route to review or ticket. The five-stage mental model the file teaches doesn't match the seven-stage pipeline in AGENTS.md.

**Fix:** rewrite. Done in this audit.

### F2 🔴 No explicit "which agent when" routing in `CLAUDE.md`

The current `CLAUDE.md` table is "Authoritative docs by topic" — useful for context, but it doesn't tell an agent which *skill* to invoke when the user says "write tickets for F019" or "review F022" or "Aaron's fish drop went viral, we need to ship now." The skill-trigger guidance exists in `skills/README.md` but the router file doesn't link to it or summarize it.

**Impact:** the router skill works because it reads multiple files; ad-hoc agent invocations don't. A solo PM throwing "implement T029" at a fresh session relies on the request matching a skill description, not on explicit routing rules.

**Fix:** new "Agent routing" section with a one-line-per-trigger table.

### F3 🔴 `pipeline-review` is optional in a migration where it should be mandatory

`AGENTS.md` says review is "optional but strongly recommended for any scenario that introduces a new surface, component, event type, or schema." Every approved scenario in Phases 1–5 of the migration introduces all four. The migration is twelve to seventeen weeks of architectural change. "Optional" is the wrong default.

**Impact:** the cross-system check (does this fit existing systems? does the design language hold?) is precisely where architectural mistakes get caught. Skipping it during a re-architecture inverts the value.

**Fix:** the new `CLAUDE.md` declares review **mandatory until Phase 5 of the migration completes**, with one explicit exception (trivial copy/CTA changes on existing surfaces).

### F4 🔴 F018 is approved-but-stuck-in-backlog; tickets reference it

JOURNAL 2026-05-08: "PM should promote `F018-brian-declares-run-club.md` from `scenarios-backlog/` to `scenarios/` so the build agent reads it from the approved location." Two days later it has not moved. Tickets T036–T040 reference F018. Per `pipeline-build`'s firewall (does NOT read scenarios-backlog), those tickets are technically unimplementable. The information firewall exists exactly to prevent teaching to test, and it is being violated by a missing file move.

**Impact:** the firewall rule is the load-bearing piece that makes the entire pipeline trustworthy. One quiet violation now teaches the agent that the rule is advisory.

**Fix:** the new `CLAUDE.md` adds a router-stage check for "approved-but-unmoved" scenarios. Operationally: move F018 to `scenarios/` immediately.

### F5 🔴 T028–T040 drafted before the migration plan was approved

`notes/migration-to-primitives.md` says: "Status: Plan, awaiting PM approval. Authoritative once approved." `development/tickets/` already contains T028 through T040. The PM-approves-the-plan gate has been silently bypassed, exactly as the F018 file move was bypassed.

**Impact:** the gate is supposed to force a PM to read the migration plan, kick the tires, and *say yes* before tickets exist. If tickets exist before approval, the act of approving becomes a rubber stamp.

**Fix:** explicit "approve the migration plan before T028 opens" item in the new CLAUDE.md's migration section. Operationally: read the plan, approve it (single line in JOURNAL), then keep the tickets.

### F6 🟡 No `product/systems/member.md` despite Person being the anchor primitive

CLAUDE.md, b1-primitives.md, ADR-3, and the migration plan all reference "the Member primitive." `product/systems/` has specs for Item, Community, Discovery, Events — but not Member. JOURNAL has flagged this as the top of the open work list since 2026-05-08.

**Impact:** every downstream agent (planning, review, ticket, build) is reading a footnote instead of a spec when it needs to know what a Member is. The migration's first-class entity is undefined.

**Fix:** write `product/systems/member.md` before T028 opens. Use `pipeline-product` (the project's writer) anchored by `product-management:write-spec` (the Cowork skill that structures problem→spec). Tier the doc T1/T2/T3 like the others. This is **the highest-leverage hour of work** in this entire migration.

### F7 🟡 Six known pipeline gaps named in JOURNAL, all unaddressed

From the F018 walkthrough retro: cross-feature consistency, performance budget, accessibility, internationalization, migration safety, release notes. JOURNAL flags them; nothing claims them. Each is a category of architectural mistake the migration is exposed to.

**Impact:** a re-architecture is the single best moment to install a perf budget and an a11y bar. After ship, retrofitting them is 10× the cost.

**Fix:** map each gap to a Cowork plugin skill that becomes a stage gate (table below). Each gap gets a one-page checklist owned by the appropriate skill. Pick at most three to land in this migration; defer the rest.

### F8 🟡 `DEVIATIONS.md` empty across 24 shipped tickets and a vocabulary pivot

The schema went from "businesses + vendors + markets" to "Members + Items + Locations + Communities." Twenty-four tickets shipped through that transition. Drift across tickets is a near-certainty; the file that captures it is empty.

**Impact:** without a captured drift log, the build agent's "escalate over improvise" rule has no surface to write to. Drift goes into JOURNAL prose, where it gets buried, or into nothing at all.

**Fix:** the new `CLAUDE.md` makes a single-line entry mandatory at the close of every ticket — even if the entry is "no deviations." Empty is no longer the default. `pipeline-build` skill's workflow already supports this; the rule just needs to be enforced.

### F9 🟡 `web/BUILD-LOG.md` two weeks stale; references an archived bundle path

Last update 2026-04-25. Points to a bundle file that has since been archived. The build status surface has fallen behind the rest of the project.

**Impact:** the build agent reads BUILD-LOG to orient. Reading a stale file with a broken link is worse than reading nothing.

**Fix:** mandate that every `pipeline-build` ticket close updates `BUILD-LOG.md`. Operationally: a fast cleanup pass, fix the bundle link, mark T019/T020 status, note the migration freeze.

### F10 🟢 No root `BUILD-LOG.md` symlink

Global scaffold spec: `mainstreetmarket/BUILD-LOG.md → web/BUILD-LOG.md`. Missing. Trivial fix.

**Fix:** `ln -s web/BUILD-LOG.md BUILD-LOG.md` from project root.

### F11 🟢 Worktree shadow at `.claude/worktrees/sweet-visvesvaraya-0853c0/`

Contains parallel CLAUDE.md files (root, product, planning, development) — relics of agent worktrees that were never cleaned up. If any agent ever picks up a path inside that tree, it reads stale instructions.

**Fix:** add `.claude/worktrees/` to .gitignore (if not already), and remove the directory after confirming no in-flight worktree.

### F12 🟢 Skills not yet installed globally on the user's machine

JOURNAL flags `./skills/install.sh` as still pending. The project-resident `pipeline-*` skills exist in tree but aren't symlinked into `~/.claude/skills/`. Cowork sessions read them via the project context; bare Claude Code sessions don't see them.

**Fix:** run `./skills/install.sh`. Then extend it to also install the Cowork plugin skills the new pipeline relies on. (Done in this pass — see "External skills setup" below.)

---

## Re-architected pipeline

Same shape. New gates. The change is **operational rigor**, not structural rewrite.

```
                                     ┌─────────────────────────────────────┐
                                     │ ADR gate                            │
                                     │ before any new schema/event/system  │
                                     └─────────────────────────────────────┘
                                                       │
  Router → Product → Plan → Review (mandatory in migration) → ┐
                                                              │
                                                         Eval-write ┐
                                                         Ticket    ─┼→ Build → Code Review → Eval-run
                                                                    │             │              │
                                                              (parallel)    (solo-team       on fail:
                                                                            multiplier)      fix forward
                                                                                              or revise
```

### Stages and the skills that run them

| Stage | Project skill (process) | External skills (called in) | Gate |
|---|---|---|---|
| **0. Router** | `pipeline-router` | `anthropic-skills:consolidate-memory` (occasional) | Reads root CLAUDE / JOURNAL / bundle. Surfaces approved-but-unmoved scenarios and stale BUILD-LOG. |
| **1. Product** | `pipeline-product` | `product-management:write-spec` (when writing a system spec from a problem statement); `product-management:product-brainstorming` (when exploring); `product-management:competitive-brief` (rare, for differentiation work); `engineering:system-design` (when the spec needs an interface/data-model section); `engineering:architecture` (writes the ADR alongside the system spec) | **ADR gate**: any new schema/event/component/system requires an ADR appended to `planning/DECISIONS.md` before plan stage starts. |
| **2. Plan** | `pipeline-plan` | `anthropic-skills:planning-filter` (when ranking a sprawling backlog) | 5 Deadly Sins filter. PM moves backlog → scenarios manually. |
| **2.5. Review** | `pipeline-review` | `design:design-critique`, `design:design-system`, `design:accessibility-review` (each on the relevant surface); `engineering:architecture` (re-evaluates ADR fit) | **Mandatory until Phase 5 of migration completes.** Verdicts PROCEED / REVISE / EXTEND. |
| **3. Eval-write** | `pipeline-eval` (write mode) | `engineering:testing-strategy` (when scenario has non-obvious test surface — auth, RLS, realtime, migration safety) | Runs *before* build. Reads scenario only. Never reads code. |
| **4. Ticket** | `pipeline-ticket` | (none — pure sequencing) | Reads scenario + review. Never reads code or backlog. |
| **5. Build** | `pipeline-build` | `engineering:debug` (during reproduction); `anthropic-skills:docx`/`pptx`/`xlsx`/`pdf` (non-code deliverables) | One ticket. TDD. Append to `DEVIATIONS.md` (even if "no deviations"). Update `BUILD-LOG.md`. |
| **5.5. Code review** | (gate, not stage) | `engineering:code-review` (mandatory on every shipped ticket) | **New solo-team multiplier.** Catches what a teammate would catch. Runs after build, before eval-run. |
| **5.7. Pre-deploy** | (gate, before any prod push) | `engineering:deploy-checklist` (mandatory before merge to main when migration changes are involved) | **New solo-team multiplier.** Captures rollback triggers and migration safety. |
| **6. Eval-run** | `pipeline-eval` (run mode) | (none) | Pass → PM picks next. Fail → fix forward (build) or revise (plan). |

### Six pipeline gaps → assigned skills

| Gap | Owner skill | Phase |
|---|---|---|
| Cross-feature consistency | `pipeline-review` (extended brief) | every migration scenario |
| Performance budget | `engineering:testing-strategy` (build-time perf check) + `engineering:code-review` | adopt now, enforce by Phase 4 |
| Accessibility | `design:accessibility-review` | mandatory on every new surface; first-pass audit on existing surfaces in Phase 5 |
| Internationalization | **defer to b2** — too expensive for migration; capture the rule (English-only b1) explicitly | b2 entry criterion |
| Migration safety | `engineering:testing-strategy` + `engineering:deploy-checklist` | mandatory on T028, T034–T035, T047–T050 |
| Release notes | `engineering:documentation` | mandatory on Phase 5 sunset and Phase 6 cleanup |

Pick three for this migration: **a11y, migration safety, perf budget**. Defer i18n (English-only is fine for b1). Defer release notes until Phase 5. Cross-feature consistency rolls into the mandatory review.

---

## Solo-team multipliers

Four gates that compensate for not having a teammate. Each is a Cowork plugin skill the project does not currently invoke.

### M1 ADR gate (before plan)

Trigger: any system spec introduces a new schema/event/component, or any scenario implies one.
Skill: `engineering:architecture`.
Output: an ADR entry in `planning/DECISIONS.md` (existing convention; ADRs 1–9 already there).
Why it matters: the migration is twelve weeks of architectural decisions. ADRs *during* the migration are 100× cheaper than ADRs *after* the migration.

### M2 Code review (after build, before eval-run)

Trigger: every shipped ticket.
Skill: `engineering:code-review`.
Output: review notes attached to the ticket, fixed before eval-run runs.
Why it matters: a build agent's TDD pass catches correctness; a reviewer catches N+1, RLS holes, missing edge cases, and the kind of "this works but reads wrong" that becomes tech debt. Without a teammate, this skill is your reviewer.

### M3 Accessibility review (on every new surface)

Trigger: any scenario that introduces a new page, component, or interaction.
Skill: `design:accessibility-review`.
Output: WCAG 2.1 AA findings appended to the scenario's review file.
Why it matters: a11y is the single named gap most easily lost during a re-architecture. Surfaces ship, ship, ship — and the bar gets tested at the end. Get it right *as* surfaces land.

### M4 Deploy checklist (before any production push touching the migration)

Trigger: any push to main that includes T028+ tickets.
Skill: `engineering:deploy-checklist`.
Output: pre-deploy checklist + named rollback triggers in the PR body.
Why it matters: schema migrations are the single highest-incident-risk operation a small team performs. A solo founder cannot afford to discover the rollback strategy mid-incident.

These four gates plus the existing pipeline give you *six* checkpoints between scenario approval and production. That is enough rigor to ship the migration without a teammate.

---

## Risk register — architectural mistakes

Threat-ranked list of architectural mistake patterns this migration is exposed to, and which gate catches each.

| Risk | Caught by | Likelihood | Severity |
|---|---|---|---|
| Schema/event design diverges from `item.md` / `community.md` | M1 (ADR) + Review | High | High |
| Member spec written ad-hoc inside a feature instead of as a system | F6 fix (write `member.md` first) | High | High |
| RLS hole or auth hole introduced during dual-write | M2 (code review) + `security-review` skill | Medium | Critical |
| New surface ships without a11y consideration | M3 (a11y review) | High | Medium |
| Schema migration runs without a rollback plan | M4 (deploy checklist) | Medium | Critical |
| Build agent improvises a fix instead of escalating | DEVIATIONS.md mandatory entry (F8 fix) | Medium | Medium |
| Vocabulary pivot leaves "vendor-shaped" code in the new schema | Phase 6 cleanup + lint rule on legacy names | Medium | Medium |
| Information firewall violation (build reads backlog) | F4 fix + router-stage check for stuck files | Low (now) | High |
| Performance regression from materialized view refresh patterns | Perf budget + `engineering:testing-strategy` | Medium | Medium |
| Cross-feature inconsistency (e.g., recurrence picker forks per surface) | Review (mandatory) + design-system skill | Medium | Medium |

The migration's biggest single risk is **shipping `member.md` as a footnote instead of a spec.** Address F6 first.

---

## External skills setup

The project's pipeline now references skills that live in Cowork plugins, not in the project tree. The project's `skills/install.sh` symlinks the project's own pipeline skills into `~/.claude/skills/`, but does not install the plugin skills the new pipeline calls.

The plugin skills the new pipeline depends on:

| Plugin | Skills used |
|---|---|
| `engineering` | `architecture`, `code-review`, `debug`, `deploy-checklist`, `documentation`, `system-design`, `testing-strategy`, `tech-debt`, `incident-response` |
| `design` | `accessibility-review`, `design-critique`, `design-handoff`, `design-system`, `ux-copy` |
| `product-management` | `write-spec`, `product-brainstorming`, `competitive-brief`, `synthesize-research`, `metrics-review` |
| `anthropic-skills` (already wired in many setups) | `planning-filter`, `pipeline-ticket` (overlaps with project's own; ours wins), `consolidate-memory`, `docx`, `pptx`, `xlsx`, `pdf` |

These are installed via Claude Code's plugin marketplace. The project's `skills/install.sh` is being extended to also run the plugin installs so a single command sets up the full pipeline on a fresh machine.

`brand-voice` plugin is installed in Cowork but **not used** by the development pipeline. Leave it where it is. Use it for marketing/launch content separately.

---

## Action plan, sequenced

These are not pipeline tickets — they are operational fixes. Run them in order before opening T028.

1. **Run `./skills/install.sh`** (extended) to install both project skills and Cowork plugin skills globally. (15 min)
2. **Move `F018-brian-declares-run-club.md` from `scenarios-backlog/` to `scenarios/`.** (1 min)
3. **Refresh `web/BUILD-LOG.md`** — current ticket statuses, fix the broken bundle link, note migration freeze. (15 min)
4. **Add the root `BUILD-LOG.md` symlink** — `ln -s web/BUILD-LOG.md BUILD-LOG.md` from project root. (1 min)
5. **Approve `notes/migration-to-primitives.md`** — JOURNAL entry "migration plan approved YYYY-MM-DD" + change file header from "awaiting approval" to "approved." (15 min)
6. **Write `product/systems/member.md`** using `pipeline-product` + `product-management:write-spec` + `engineering:system-design`. T1/T2/T3 tiered like the others. (2–4 hours — the most important hours of this migration)
7. **Write ADR-10 for the migration's transactional model** (dual-write strategy, event sourcing, refresh semantics) using `engineering:architecture`. (1–2 hours)
8. **Promote review to mandatory** for the migration window. Update `AGENTS.md` § 2.5 and root `CLAUDE.md` accordingly. (Done in this pass.)
9. **Audit existing scenarios F018–F024** through the new mandatory-review lens. (Half a day; F018 already done. F019–F024 still need it.)
10. **Open T028.**

Total: about a working day before any new tickets open. That day is the cheapest insurance you'll buy on this migration.

---

## What this audit is not

- It is not a critique of the system specs or the loops or the primitives. Those are well thought through. This is purely process.
- It is not a recommendation to add more agents or stages. Seven is enough. The fix is operational rigor, not more structure.
- It is not a replacement for `AGENTS.md`. AGENTS.md remains the authoritative pipeline spec. This audit explains how to *use* AGENTS.md in the migration phase.

---

## See also

- [`AGENTS.md`](../AGENTS.md) — pipeline spec
- [`skills/README.md`](../skills/README.md) — skill index
- [`skills/EXTERNAL-SKILLS.md`](../skills/EXTERNAL-SKILLS.md) — Cowork plugin skills the pipeline calls
- [`notes/migration-to-primitives.md`](../notes/migration-to-primitives.md) — what's being migrated
- [`DECISIONS.md`](DECISIONS.md) — ADR log (ADR-10 to be written)
