# orient — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | root `CLAUDE.md`, `JOURNAL.md`, `planning/now/bundle-{N}.md` (the active bundle), optionally `AGENTS.md`, `planning/STAGE-LEDGER.md`, `planning/SPEC-PATCHES.md`, `planning/backlog/`, `planning/next/`, `planning/now/`, `playbooks/PLATFORM-PATTERNS.md`, `playbooks/DEVELOPMENT-PATTERNS.md`, `planning/RELEASES.md`, `planning/now/bundle-{N}-checklist.md`, `web/BUILD-LOG.md`, `development/tickets/done/T*.md` (last sub-bundle), `_inbox/` |
| **Writes** | nothing by default. May suggest a JOURNAL entry. In folded prune mode (step 10), writes JOURNAL.md / pattern-doc / archive files only on PM ratification. In folded bundle-resync mode (step 11), writes `planning/now/bundle-{N}-themes.md` / `planning/now/bundle-{N}-checklist.md` only on PM ratification. |
| **Hands to** | whichever pipeline skill the request matches (see routing table) |

Session-start check (project-agnostic):

1. **Read `JOURNAL.md`** at project root — top entry tells you what just changed.
2. **Read the root `CLAUDE.md`** — project facts (stack, repo structure, north stars).
3. **Read the active bundle plan.** Pick the bundle file in `planning/now/` (named `bundle-{N}.md`) — the active bundle lives in the `now/` lane. If more than one bundle plan sits in `now/`, flag as drift and stop.
4. **Confirm the task is in scope.** If the user's request isn't in the bundle's scope, surface that and ask whether to proceed or escalate.
5. **Confirm the task serves a north star.** If you can't name which north star the work serves, ask the user before starting.
6. **Surface stuck approved scenarios.** Glance at `planning/next/`, `planning/now/`, and `planning/backlog/`. If any ticket references a scenario that still sits in `planning/backlog/` (a draft, not yet promoted to `next/`/`now/`), the build firewall is being violated — surface as a blocker. Equally: if any approved scenario in `planning/next/` or `planning/now/` has its `Canonical example:` field pointing at a TODO placeholder section of `use-cases.md`, surface as a blocker.
7. **Drift check (audit-derived, runs every session).** Fixed checklist; flag each failure with its source rule. Do not gate routing — name them, then route.

   | Check | Source |
   |---|---|
   | `planning/next/` and `planning/now/` hold no approved scenario while any `development/tickets/` (incl. `done/`) file references a `Scenario: F###` — H1 firewall vacated | Audit H1 |
   | `web/BUILD-LOG.md` cites a bundle file that doesn't exist — E3 | Audit E3 |
   | `.claude/worktrees/` is non-empty AND not in `.gitignore` — shadow-repo hazard | Audit E8 |
   | `development/DEVIATIONS.md` over 400 lines without a rotation pointer at top — E2 | Audit E2 |
   | `{pending}` or `{commit hash}` placeholders in `development/tickets/done/*.md` Completion sections — H4 | Audit H4 |
   | Retired skill directories present on disk that the routing table doesn't list — H6 | Audit H6 |
   | `planning/SPEC-PATCHES.md` has any open patch older than the current bundle's open date — Build → Product loop not draining | Audit H3 |
   | Any decision cited as live in a ticket but marked superseded in `playbooks/PLATFORM-PATTERNS.md` / `playbooks/DEVELOPMENT-PATTERNS.md` (or by a reversal memo under `playbooks/memos/`) — E6 | Audit E6 |
   | Any F# has artifacts (ticket exists) but no `plan-approved` stamp in STAGE-LEDGER — return-path break | Audit R4 |
   | Any `.md` or `.html` at repo root other than the load-bearing set — anti-sprawl | 2026-05-23 |
   | `_inbox/` non-empty for >7 days — triage backlog | 2026-05-23 |
   | More than one bundle plan (`bundle-{N}.md`) sits in `planning/now/` — only the active bundle belongs in the `now/` lane | 2026-05-27 |
   | A bundle plan sits in `planning/now/` whose work is closed — closed bundles move to the `planning/done/` lane | 2026-05-27 |
   | A bundle artifact (themes / checklist) sits in a lane other than `planning/now/` while its parent bundle is still active | 2026-05-27 |
   | `planning/RELEASES.md` row count does not match the number of `{owning-dir}/archive/vN-{slug}/` archives (post-ADR-25) plus the number of `_attic/YYYY-MM-DD-vN-{slug}/` archives (pre-2026-05-28 grandfather) (drift in the shipped-version index) | 2026-05-27 · ADR-25 |
   | Any `.md` in `planning/` containing roughly 4+ distinct items each pickable independently, regardless of execution state — atomization candidate per [`playbooks/DEVELOPMENT-PATTERNS.md`](../../playbooks/DEVELOPMENT-PATTERNS.md) § Atomize big plans with mixed-state items. Surface; route to `tidy` § sweep-docs finding #7 | DEVELOPMENT-PATTERNS |
   | At v0.1 ship (after `planning/RELEASES.md` marks v0.1 shipped): any `{owning-dir}/archive/` not yet wrapped into `{owning-dir}/archive/v0.1/` — version rollup pending | ADR-25 |

   Report each failure with: check name, offending file(s), one-line fix. Do not attempt the fix.

   **Also scan the kanban lanes (`planning/backlog/`, `planning/next/`, `planning/now/`) for stale items per PM convention — lane membership is the state; PM moves files when ready.**

8. **Surface unsynced sub-bundle.** Glance at `planning/now/bundle-{N}-checklist.md` and the last few `development/tickets/done/T*.md`. If a sub-bundle has closed but `planning/now/bundle-{N}-themes.md` / `planning/now/bundle-{N}-checklist.md` hasn't been touched since, suggest running step 11 (folded bundle-resync) before any new scenario writing.

9. **Registry conformance check (lightweight).** If `REGISTRY.md` exists at project root, verify three things:
   - Every `.md` under `product/`, `planning/`, `development/`, `standards/` (excluding `_attic/`, `web/`, `skills/`, and the load-bearing root set) carries YAML front-matter with `purpose` + `layer` + `status`.
   - Every such doc has a corresponding row in `REGISTRY.md`.
   - No `REGISTRY.md` row points at a missing file.
   Lightweight = name the gaps, don't gate. Skip silently if `REGISTRY.md` does not exist.

10. **Prune JOURNAL if heavy (folded sub-routine).** If `JOURNAL.md` is heavy — working thresholds: >100 lines or >5 dated entries — or if a pattern doc (`playbooks/PLATFORM-PATTERNS.md` / `playbooks/DEVELOPMENT-PATTERNS.md`) is heavy (>250 lines or >10 unfolded entries), offer to prune in this session.

    On PM acceptance, run the prune sub-routine:

    - **Triage mode.** Ask: journal-only, decisions-only, or both. Most common is journal-only.
    - **Inventory.** List every dated JOURNAL entry below the top one; tag each with dominant theme; mark safe-archive candidates (entries that say RESOLVED / DONE / shipped / merged / approved). For the pattern docs: list every active decision in `playbooks/PLATFORM-PATTERNS.md` / `playbooks/DEVELOPMENT-PATTERNS.md`; note its home (pattern doc vs system spec vs foundation doc); note status.
    - **Identify silently-load-bearing decisions.** A decision is silently load-bearing when **all four** hold: (1) forgetting it produces no test/type/runtime error; (2) no active spec carries it; (3) violating it creates contradiction with another live decision; (4) a fresh reader of code alone wouldn't infer it.
    - **Memorialize before archiving.** Pick the *first* home that fits: MAP.md alignment-check line · foundation doc · system spec "Decisions encoded here" footer · new short foundation doc · new cross-cutting ADR. Never memorialize into JOURNAL itself; never into auto-memory.
    - **Rotate the journal.** Keep top entry + pinned "Next session pickup." Archive everything older into `archive/journal/JOURNAL-YYYY-MM.md` at repo root (per ADR-25 — directory-local; root is JOURNAL's home). Refresh "Next session pickup" — verify still live; drop done items; carry forward open ones.
    - **Trim the pattern docs.** Keep full text for cross-cutting decisions with no other home in `playbooks/PLATFORM-PATTERNS.md` / `playbooks/DEVELOPMENT-PATTERNS.md`. Collapse to pointer rows for decisions whose substance is already stated in a spec. Reversed decisions are superseded via a memo under `playbooks/memos/`; archive any retired pattern-doc material to `planning/done/decisions-superseded-YYYY-MM-DD.md` with anchored cross-links (per ADR-25).
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
    - **Propose edits before writing.** RE-TAG: flip emoji + `(re-tagged 2026-MM-DD: {reason})`. RE-SEQUENCE: move bullet between sub-bundle sections in both `planning/now/bundle-{N}-themes.md` and `planning/now/bundle-{N}-checklist.md`; update dependency graph if arrow changed. EXPAND: new 🟢/🟡/⚪ line with one-line rationale.
    - **PM ratifies; apply.** Then write the JOURNAL entry in hybrid form — **plain-English headline + context + structured detail**:

      ```
      ## YYYY-MM-DD — Closed sub-bundle b{N}.{M} after {plain-English one-line summary of the verdict, e.g. "resequencing two work-map items" or "no drift"}

      **Mode:** close-of-sub-bundle.
      **Verdict:** CLEAN | RE-TAG | RE-SEQUENCE | EXPAND | ESCALATE.

      **Drift:**
      - {one line per drift, with the resolved edit or hand-off}

      **Files touched:**
      - planning/now/bundle-{N}-themes.md ({what changed})
      - planning/now/bundle-{N}-checklist.md ({what changed})

      **Hand-off:** none | scope (F### needed for new EXPAND line) | memo (ADR-shaped drift) | explore (new system / capability)
      ```

      Headline-test: a returning reader should know from the headline what closed and whether anything notable shifted, without having to read the verdict line.
    - **Confirm next sub-bundle's readiness.** Dependencies satisfied? Did this resync invalidate any assumptions? Canonical-example claim still honest? Note in JOURNAL if anything looks off.

    Does NOT write: `product/`, `web/`, `development/tickets/`, `planning/next/`, `playbooks/PLATFORM-PATTERNS.md`, `playbooks/DEVELOPMENT-PATTERNS.md`.

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
| Reflect on / merge / prune memory | `consolidate-memory` (Cowork) |
| Self-improvement loop spec (Karpathy loop) | `loop-designer` |

## The PM cycle (read once, internalize)

The pipeline runs in a strict order per feature. Each step has one input and one output. Skipping a step is improvisation.

```
1. explore   →  writes/updates product/systems/{name}.md
                (with Data model implications + canonical anchor)

2. scope     →  writes scenario drafts in planning/backlog/
                (PM reviews, moves approved to planning/next/ or now/)
                Gate A: refuses scenarios whose cited spec sections
                contain unratified absolutes — routes to weigh.

3. review    →  architecture + design + security + a11y pre-flight on
                the approved scenario. Verdict: PROCEED / REVISE /
                EXTEND. Output: review-F{NNN}.md in the scenario's lane.

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
  - `build` never reads `planning/backlog/` (prevents teaching to test).
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
├── planning/                  # Scope — four Kanban lanes (backlog, next, now, done)
├── development/               # Execution (tickets, DEVIATIONS.md)
└── {app}/                     # Code (separate repo if two-repo setup)
```

If any of these are missing, the pipeline structure is incomplete — bootstrap from a current snapshot of this repo's structure rather than from a template (the `scaffold` skill was retired 2026-06-01).

## Hand off

**You produced:** orientation. Possibly an updated `JOURNAL.md` entry if you observed drift. In folded prune mode (step 10): trimmed JOURNAL.md / pattern docs + archive files. In folded resync mode (step 11): updated `planning/now/bundle-{N}-themes.md` + `planning/now/bundle-{N}-checklist.md` + a JOURNAL entry.

**Next skill:** whichever entry in the routing table fits. You do not implement; you route once and step back. If the request is ambiguous, ask one clarifying question rather than guessing — routing the wrong skill costs more than a clarifying question.

## Final report

Default report shape is three lines:

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Drop running narration ("Now doing X." "Starting Y." "Committing Z."). Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, lane counts, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more." The drift-check output is a prime candidate for this discipline: lead with whether anything drifted, withhold the per-item list until PM asks.
