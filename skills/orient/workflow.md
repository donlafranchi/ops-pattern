# orient — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | root `CLAUDE.md`, `JOURNAL.md`, `planning/bundles/b{N}-{slug}-plan.md` (the file with `status: active`), optionally `AGENTS.md`, `planning/STAGE-LEDGER.md`, `planning/SPEC-PATCHES.md`, `planning/OPEN-QUESTIONS.md`, `planning/DECISIONS.md`, `planning/RELEASES.md`, `planning/bundles/b{N}-{slug}-work-map.md`, `web/BUILD-LOG.md`, `development/tickets/done/T*.md` (last sub-bundle), `_inbox/` |
| **Writes** | nothing by default. May suggest a JOURNAL entry. In folded prune mode (step 10), writes JOURNAL.md / DECISIONS.md / archive files only on PM ratification. In folded bundle-resync mode (step 11), writes `bundle-themes.md` / `b{N}-{slug}-work-map.md` only on PM ratification. |
| **Hands to** | whichever pipeline skill the request matches (see routing table) |

Session-start check (project-agnostic):

1. **Read `JOURNAL.md`** at project root — top entry tells you what just changed.
2. **Read the root `CLAUDE.md`** — project facts (stack, repo structure, north stars).
3. **Read the active bundle plan.** Pick the file in `planning/bundles/` whose frontmatter carries `status: active` and whose name matches `b{N}-{slug}-plan.md`. Directory placement no longer signals state — `status:` does. If multiple plan files carry `status: active`, flag as drift and stop.
4. **Confirm the task is in scope.** If the user's request isn't in the bundle's scope, surface that and ask whether to proceed or escalate.
5. **Confirm the task serves a north star.** If you can't name which north star the work serves, ask the user before starting.
6. **Surface stuck approved scenarios.** Glance at `planning/scenarios/` and `planning/scenarios-backlog/`. If any approved scenario in tickets references a backlog file (`planning/scenarios-backlog/F###`), the build firewall is being violated — surface as a blocker. Equally: if any scenario in `planning/scenarios/` has its `Canonical example:` field pointing at a TODO placeholder section of `use-cases.md`, surface as a blocker.
7. **Drift check (audit-derived, runs every session).** Fixed checklist; flag each failure with its source rule. Do not gate routing — name them, then route.

   | Check | Source |
   |---|---|
   | `planning/scenarios/` is empty while any `development/tickets/` (incl. `done/`) file references a `Scenario: F###` — H1 firewall vacated | Audit H1 |
   | `web/BUILD-LOG.md` cites a bundle file that doesn't exist — E3 | Audit E3 |
   | `.claude/worktrees/` is non-empty AND not in `.gitignore` — shadow-repo hazard | Audit E8 |
   | `development/DEVIATIONS.md` over 400 lines without a rotation pointer at top — E2 | Audit E2 |
   | `{pending}` or `{commit hash}` placeholders in `development/tickets/done/*.md` Completion sections — H4 | Audit H4 |
   | Retired skill directories present on disk that the routing table doesn't list — H6 | Audit H6 |
   | `planning/SPEC-PATCHES.md` has any open patch older than the current bundle's open date — Build → Product loop not draining | Audit H3 |
   | Any ADR cited as live in a ticket but marked `superseded` in `planning/DECISIONS.md` — E6 | Audit E6 |
   | Any F# has artifacts (ticket exists) but no `plan-approved` stamp in STAGE-LEDGER — return-path break | Audit R4 |
   | Any `.md` or `.html` at repo root other than the load-bearing set — anti-sprawl | 2026-05-23 |
   | `_inbox/` non-empty for >7 days — triage backlog | 2026-05-23 |
   | `planning/bundles/done/` exists on disk — directory-as-state retired in favor of `status:` field | 2026-05-27 |
   | Any file in `planning/bundles/` missing `status:` in frontmatter, or carrying a value outside {`active`, `done`, `deferred`} | 2026-05-27 |
   | Any file in `planning/bundles/` whose name does not match `b{N}-{slug}-plan.md` or `b{N}[.{x}]-{slug}-{kind}.md` (kind ∈ {sprint, work-map, audit, rebuild, wrapup}), excluding cross-bundle sequencers like `bundle-themes.md` | 2026-05-27 |
   | `planning/RELEASES.md` row count does not match the number of `_attic/YYYY-MM-DD-vN-{slug}/` archives (drift in the shipped-version index) | 2026-05-27 |

   Report each failure with: check name, offending file(s), one-line fix. Do not attempt the fix.

   **Also surface any `planning/OPEN-QUESTIONS.md` entry older than 14 days.**

8. **Surface unsynced sub-bundle.** Glance at `planning/bundles/b{N}-{slug}-work-map.md` and the last few `development/tickets/done/T*.md`. If a sub-bundle has closed but `bundle-themes.md` / `b{N}-{slug}-work-map.md` hasn't been touched since, suggest running step 11 (folded bundle-resync) before any new scenario writing.

9. **Registry conformance check (lightweight).** If `REGISTRY.md` exists at project root, verify three things:
   - Every `.md` under `product/`, `planning/`, `development/`, `standards/` (excluding `_attic/`, `housekeeping/`, `web/`, `skills/`, and the load-bearing root set) carries YAML front-matter with `purpose` + `layer` + `status`.
   - Every such doc has a corresponding row in `REGISTRY.md`.
   - No `REGISTRY.md` row points at a missing file.
   Lightweight = name the gaps, don't gate. Skip silently if `REGISTRY.md` does not exist.

10. **Prune JOURNAL if heavy (folded sub-routine).** If `JOURNAL.md` is heavy — working thresholds: >100 lines or >5 dated entries — or if `DECISIONS.md` is heavy (>250 lines or >10 unfolded ADRs), offer to prune in this session.

    On PM acceptance, run the prune sub-routine:

    - **Triage mode.** Ask: journal-only, decisions-only, or both. Most common is journal-only.
    - **Inventory.** List every dated JOURNAL entry below the top one; tag each with dominant theme; mark safe-archive candidates (entries that say RESOLVED / DONE / shipped / merged / approved). For DECISIONS: list every active ADR; note its home (this file vs system spec vs foundation doc); note status.
    - **Identify silently-load-bearing decisions.** A decision is silently load-bearing when **all four** hold: (1) forgetting it produces no test/type/runtime error; (2) no active spec carries it; (3) violating it creates contradiction with another live decision; (4) a fresh reader of code alone wouldn't infer it.
    - **Memorialize before archiving.** Pick the *first* home that fits: MAP.md alignment-check line · foundation doc · system spec "Decisions encoded here" footer · new short foundation doc · new cross-cutting ADR. Never memorialize into JOURNAL itself; never into auto-memory.
    - **Rotate the journal.** Keep top entry + pinned "Next session pickup." Archive everything older into `_attic/journal/JOURNAL-YYYY-MM.md`. Refresh "Next session pickup" — verify still live; drop done items; carry forward open ones.
    - **Trim DECISIONS.** Keep full text for cross-cutting ADRs with no other home. Collapse to pointer rows for ADRs whose decision is already stated in a spec. Archive SUPERSEDED ADRs in full to `_attic/decisions/DECISIONS-superseded-YYYY-MM-DD.md` with anchored cross-links.
    - **Update MAP.md** if memorialization added an alignment check; confirm no contradiction with existing checks.
    - **Verify.** All links resolve; live files pass 30-second scan; every memorialized invariant has a home doc.
    - **Surface diff; do not auto-commit.** Commit message: `docs(pipeline): prune {what} — archive {dated file(s)}, memorialize {N} invariants`.

    Don'ts: don't delete entries (always archive); don't memorialize decisions already enforced by code; don't add alignment checks unless absence creates real contradiction risk; don't touch active scenarios / tickets / BUILD-LOG.md / DEVIATIONS.md; don't run during an open scenario phase.

11. **Resync work-map if sub-bundle closed (folded sub-routine).** If step 8 flagged an unsynced sub-bundle, offer to resync now.

    On PM acceptance, run the resync sub-routine:

    - **Frame.** Confirm which sub-bundle closed and the mode: *close-of-sub-bundle* (full sync), *mid-flight* (single deviation), or *full-bundle audit*.
    - **Inventory shipped vs predicted.** Build a small table: each work-map item × predicted tag × tag-at-ship × tickets produced × deviations. Drift surfaces in fan-out, deviations, drop/add.
    - **Diagnose the drift per row:**
      - *Tag drift* (predicted 🟡, shipped 🟢 or vice versa) → **RE-TAG**.
      - *Sequence drift* (shipped in different sub-bundle) → **RE-SEQUENCE** (only if no hard-dep violation).
      - *Hidden work* (tickets implemented something not on map) → **EXPAND**.
      - *Phantom work* (map predicted, sub-bundle didn't ship and didn't drop) → flag PM; retire if legit-dropped; escalate to `scope` if forgotten.
      - *Structural drift* (ticket produced ADR-shape) → **ESCALATE** to `memo` / `explore`.
    - **Propose edits before writing.** RE-TAG: flip emoji + `(re-tagged 2026-MM-DD: {reason})`. RE-SEQUENCE: move bullet between sub-bundle sections in both `bundle-themes.md` and `b{N}-{slug}-work-map.md`; update dependency graph if arrow changed. EXPAND: new 🟢/🟡/⚪ line with one-line rationale.
    - **PM ratifies; apply.** Then write the JOURNAL entry:

      ```
      ## YYYY-MM-DD — orient (bundle-resync): b{N}.{M} close

      **Mode:** close-of-sub-bundle.
      **Verdict:** CLEAN | RE-TAG | RE-SEQUENCE | EXPAND | ESCALATE.

      **Drift:**
      - {one line per drift, with the resolved edit or hand-off}

      **Files touched:**
      - planning/bundles/bundle-themes.md ({what changed})
      - planning/bundles/b{N}-{slug}-work-map.md ({what changed})

      **Hand-off:** none | scope (F### needed for new EXPAND line) | memo (ADR-shaped drift) | explore (new system / capability)
      ```
    - **Confirm next sub-bundle's readiness.** Dependencies satisfied? Did this resync invalidate any assumptions? Canonical-example claim still honest? Note in JOURNAL if anything looks off.

    Does NOT write: `product/`, `web/`, `development/tickets/`, `planning/scenarios/`, `planning/DECISIONS.md`.

12. **Route.**

After the orientation pass, route via the table below.

## Routing table

| If the user wants to... | Invoke skill |
|---|---|
| Explore, ideate, write a system / capability / product file | `explore` |
| Scope a release, write/approve scenarios, filter the backlog | `scope` |
| Weigh a close call, ratify absolutes, intent-check, run the dialectic | `weigh` |
| Architecture / design / security / a11y pre-flight on a scenario | `review` |
| Memo a decision (ADR-shaped) | `memo` |
| Break an approved scenario into tickets | `ticket` |
| Implement a ticket via TDD | `build` |
| Write or run acceptance tests | `test` |
| Triage `_inbox/`, sweep docs, audit skills, anything anti-sprawl | `tidy` |
| Set up a brand-new project with this pipeline | `scaffold` |
| Reflect on / merge / prune memory | `consolidate-memory` (Cowork) |
| Self-improvement loop spec (Karpathy loop) | `loop-designer` |

## The PM cycle (read once, internalize)

The pipeline runs in a strict order per feature. Each step has one input and one output. Skipping a step is improvisation.

```
1. explore   →  writes/updates product/systems/{name}.md
                (with Data model implications + canonical anchor)

2. scope     →  writes scenarios in planning/scenarios-backlog/
                (PM reviews, moves approved to planning/scenarios/)
                Gate A: refuses scenarios whose cited spec sections
                contain unratified absolutes — routes to weigh.

3. review    →  architecture + design + security + a11y pre-flight on
                the approved scenario. Verdict: PROCEED / REVISE /
                EXTEND. Output: planning/reviews/F{NNN}-review.md.

4. test      →  writes Playwright tests from the approved scenario
   (write)      BEFORE build — firewall against teaching to test.
                Reads scenario only, never review or code.

5. ticket    →  breaks approved scenario into ordered, session-sized
                tickets in development/tickets/. Reads scenario AND
                review document. Gate B: refuses tickets whose touched
                specs contain unratified absolutes — routes to weigh.

6. build     →  implements one ticket at a time via TDD.
                Runs M2 (code review) BEFORE commit. Commits to app
                repo with PM permission. Updates BUILD-LOG.md.

7. test      →  runs the F### tests against the new build.
   (run)        Reports pass/fail with scenario traceability.
```

**Steps 4 (test-write) and 5 (ticket) run in parallel** — both consume the approved scenario, eyes-closed to each other. Both feed step 6 (build).

**Key rule:** tests are written *before* build (against the scenario only — test writer never reads code) and *run* after build. This separation makes the pipeline trustworthy.

## Pipeline reference

```
Explore (dream) → Scope (filter) → Test-write (oracle) → Ticket (sequence) → Build (execute) → Test-run (verify)
```

- **Information firewalls:** each role has explicit can-read / cannot-read sets.
  - `build` never reads `planning/scenarios-backlog/` (prevents teaching to test).
  - `test` (write mode) never reads code (prevents test-to-implementation matching).
  - `ticket` never reads code (prevents "fixing" the spec via the codebase).
- **Unidirectional flow:** upstream agents never implement; downstream agents never redesign.
- **Escalation over improvisation:** divergence from spec → document and escalate, do not autonomously redesign.

## Expected project layout

```
{project}/
├── CLAUDE.md                  # Thin project facts only
├── JOURNAL.md                 # Reverse-chron PM log
├── AGENTS.md                  # Pipeline definition
├── product/                   # Vision (foundation, exploration, capabilities, systems, products)
├── planning/                  # Scope (bundles, scenarios, scenarios-backlog, DECISIONS.md)
├── development/               # Execution (tickets, DEVIATIONS.md)
└── {app}/                     # Code (separate repo if two-repo setup)
```

If any of these are missing, suggest `scaffold`.

## Hand off

**You produced:** orientation. Possibly an updated `JOURNAL.md` entry if you observed drift. In folded prune mode (step 10): trimmed JOURNAL.md / DECISIONS.md + archive files. In folded resync mode (step 11): updated `bundle-themes.md` + `b{N}-{slug}-work-map.md` + a JOURNAL entry.

**Next skill:** whichever entry in the routing table fits. You do not implement; you route once and step back. If the request is ambiguous, ask one clarifying question rather than guessing — routing the wrong skill costs more than a clarifying question.
