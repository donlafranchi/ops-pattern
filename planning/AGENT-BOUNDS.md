---
id: how-agent-bounds
purpose: Three-layer agent-bounds doc — Intent / Bounds / Casebook — that reduces the founder bottleneck by letting agents decide more on their own and escalate sharper.
layer: how
status: active
---

# AGENT BOUNDS — statute & precedent for one human

> Renamed from `JUDGMENT.md` on 2026-05-30 (reorg item 10) — name clarifies this file's purpose vs. `DECISIONS.md`: this defines *the boundaries of agent autonomy*, while `DECISIONS.md` is the ADR pointer index.

> Source concepts: [`_attic/2026-05-27/2026-05-23-pipeline-coverage/human_judgment_document_architecture.html`](../_attic/2026-05-27/2026-05-23-pipeline-coverage/human_judgment_document_architecture.html) (the three layers + refinement loop) and [`_attic/2026-05-27/2026-05-23-pipeline-coverage/agent_response_techniques.html`](../_attic/2026-05-27/2026-05-23-pipeline-coverage/agent_response_techniques.html) (the four moves: triage upstream, constraint-first elicitation, standing defaults, compression contract). Archived once absorbed into this file.
>
> **The problem this solves.** Solo founder. Every decision the agent surfaces is a 30-minute read. The pipeline already filters work downstream well; this file is the **escalation filter** — what should reach the founder, in what shape, and what shouldn't reach them at all.
>
> **Relationship to existing machinery.**
> - **L1 Intent** is already partly here: `product/foundation/principles.md` (P1–P8 + Decision Test + categorical failures) is L1 at the platform-philosophy level. **Ratified absolutes** (the `Intent (Ratified YYYY-MM-DD): ...` lines landed by `weigh`) are L1 at the per-statement level.
> - **L2 Bounds** is what this file adds. ADRs are decisions; bounds are the negative-space envelope around them. A bound says: *within this radius, agents decide alone; outside it, escalate.*
> - **L3 Casebook** is `JOURNAL.md` + `DEVIATIONS.md` + `planning/reviews/F{NNN}-review.md`. They already record cases; they just aren't indexed by topic or scanned for promotion.

---

## The three layers (for this project)

### Layer 1 — Intent (years; rarely changes)

The non-negotiables. Lives in:

- `product/foundation/principles.md` — P1–P8, People-First, Decision Test, categorical failures.
- `product/foundation/policy.md` — the three filters (data sharing, monetary flow, visibility).
- `product/foundation/community-health-rubric.md` — the structured measuring stick.
- Every spec section carrying an `Intent (Ratified YYYY-MM-DD): ...` line.

Don't restate intent here — point at it.

### Layer 2 — Bounds (months; this file owns)

For each topic: an explicit **In** and an explicit **Out**. The negative space (Out) is load-bearing — without it the agent can't tell *"covered, decide alone"* from *"gap, escalate."*

Format per topic:

```
### {topic name}
Source intent: {file:section} (the L1 anchor)
Source casebook: {file glob} (where prior cases live)

In bounds (agent decides, logs the case):
- {default 1, with one-line why}
- {default 2}

Out of bounds (agent stops, surfaces gap):
- {boundary 1, with one-line why}
- {boundary 2}

Last reviewed: YYYY-MM-DD
```

### Layer 3 — Casebook (constant; existing files)

Cases accrue automatically in:

- `JOURNAL.md` — PM-level decisions, dated.
- `DEVIATIONS.md` — build-time drift, per ticket.
- `planning/reviews/F{NNN}-review.md` — review verdicts + rationale.
- `planning/SPEC-PATCHES.md` — spec corrections in flight.
- `planning/STAGE-LEDGER.md` — stage transitions with regressions visible.

No new file needed for L3 — but the promotion pass below indexes them by topic.

---

## The refinement loop

```
Encounter ─▶ Apply ─▶ (Escalate only if gap) ─▶ Refine
```

1. **Encounter.** Agent classifies the situation against the topic manifest below.
2. **Apply.** Try L1 + L2 for that topic. If the bounds cover the situation → decide, log a case in the relevant L3 file. PM never sees it.
3. **Escalate only if gap.** If bounds don't cover → surface to PM as: *topic · closest existing case · what's different now · recommended bound revision*. **Not** "what should I do" — *"here's what isn't covered."*
4. **Refine.** PM's answer becomes a new case. PM signals: *just log it* or *promote to L2*. The doc grows from the gap, not from speculation.

---

## Topic manifest (initial — grows over time)

Each topic anchors L1, L2 (here), and L3 (case files). Topics added when a recurring decision pattern appears in escalations.

| Topic | L1 anchor | L2 owner | L3 source |
|---|---|---|---|
| Schema additions during build | `product/foundation/principles.md` § People-First; ADR-7 | This file § *Schema additions* | `DEVIATIONS.md`, `SPEC-PATCHES.md` |
| Scope creep inside a ticket | `principles.md` § Decision Test; b1 bundle | This file § *Scope* | `DEVIATIONS.md` |
| Absolute language in specs | `principles.md`; `pending-ratifications.md` | `skills/weigh/` | `planning/reviews/` ratification logs |
| Vendor / cost decisions | (none yet — TBD) | This file § *Vendor & cost* | `JOURNAL.md` |
| Naming (UI label vs schema vs URL) | `CLAUDE.md` § Naming conventions | This file § *Naming* | `JOURNAL.md` |
| Commit + branch hygiene | `CLAUDE.md` § Commit Rules | This file § *Commit hygiene* | `DEVIATIONS.md` |

---

## L2 bounds (per topic — populate as patterns emerge)

> Each topic below has the same shape: *In bounds* (agent decides alone), *Out of bounds* (escalate). Empty topics are intentional placeholders — populate them when the first case forces clarity. Premature population is speculation; the audit's whole diagnosis is that hygiene rots when imposed top-down.

### Schema additions
Source intent: `product/foundation/principles.md` § People-First; `planning/adrs/ADR-0007-*.md`
Source casebook: `DEVIATIONS.md`, `SPEC-PATCHES.md`

**In bounds:**
- Add an index, partial-index predicate, or trigger when the migration's acceptance criterion implies it but the spec doesn't list it explicitly — log in DEVIATIONS with `Disposition: flag-for-spec-revision`.
- Reconcile two conflicting state vocabularies inside a single spec section to the one the schema/tests already use — log in DEVIATIONS + open SPEC-PATCH.

**Out of bounds:**
- Add a new column or table not present in the spec's Data model implications. Escalate to `explore`.
- Change an enum's set of valid values (vs. reconciling a typo). Escalate to `scope` for scenario review.
- Introduce a new event type. Escalate.

Last reviewed: 2026-05-23

### Scope
Source intent: `product/foundation/principles.md` § Decision Test; active bundle `b1-primitives-plan.md`
Source casebook: `DEVIATIONS.md`, `JOURNAL.md`

**In bounds:**
- Drop a stretch acceptance criterion when the core ones are green and time is up — log it, surface the dropped item to the next planning pass.

**Out of bounds:**
- Add an acceptance criterion the ticket didn't carry. Escalate.
- Implement a "while we're here" cleanup of unrelated code. Escalate or open a separate ticket.

Last reviewed: 2026-05-23

### Naming
Source intent: `CLAUDE.md` § Naming conventions table
Source casebook: `JOURNAL.md`

**In bounds:**
- Apply the four-column table (schema / URL / UI label / UI verb) to a new entity already covered by an existing kind.

**Out of bounds:**
- Introduce a new entity kind that needs its own row in the table. Escalate to `explore` to propose the row.
- Rename a schema column for clarity. Escalate (durable names per rule 1).

Last reviewed: 2026-05-23

### Commit hygiene
Source intent: `CLAUDE.md` § Commit Rules
Source casebook: `DEVIATIONS.md`

**In bounds:**
- Stage only ticket-related files. Use the one-line `T{NNN}: {title}` format. Backfill commit hash into ticket Completion section immediately on PM confirmation.

**Out of bounds:**
- Commit on behalf of the PM. Escalate (PM owns the git call).
- Skip the lock pre-flight when sandbox is uncertain.

Last reviewed: 2026-05-23

### Vendor & cost
*(placeholder — populate after the first vendor decision creates a case)*

---

## Agent response discipline (from `agent_response_techniques.html`)

Four moves agents apply when shaping any response that includes a decision for the PM. Lifted from the HTML; codified here so every pipeline skill can reference one location.

1. **Triage upstream.** Before surfacing a choice, classify it: *"mine to decide"* (in bounds — decide and log) · *"constraint-bound"* (needs one input from PM — ask the constraint) · *"genuine fork"* (PM judgment required — surface as a fork). Default to *mine to decide* when bounds clearly cover.
2. **Constraint-first elicitation.** If a decision turns on one constraint only the PM knows, **ask the constraint**, then decide. Don't present three options for a 30-minute trade-off read.
3. **Standing defaults.** Check this file (L2 bounds for the relevant topic) before asking. If a default exists, apply it and cite it. If a default should exist but doesn't, recommend the default with the escalation.
4. **Compression contract.** Hard word budget on any response containing a recommendation. BLUF / Minto. Analogy-first on technical content. The PM can ask for expansion; agents shouldn't pre-emptively over-explain.

**Where this lives in the pipeline.** Each pipeline skill's `Hand off` section assumes these. `build` applies #1–#3 inside DEVIATIONS authoring (every disposition is either *in-bounds decision*, *constraint asked*, or *escalated*). `orient` applies #4 when reporting drift-check results.

---

## Maintenance

- **Promotion pass — monthly.** Walk JOURNAL + DEVIATIONS + history/ for entries on the same topic. If ≥3 cases trend the same way, promote to L2 in/out-bounds. PM ratifies the promotion.
- **No speculative bounds.** A bound only exists if it's been earned by a case. Empty topics are honest; speculative topics rot.
- **Sunset stale bounds.** If a bound hasn't been cited in 6 months, the situation may have changed. PM reviews; either renews `Last reviewed` or removes.
- **Topic manifest grows from escalation patterns.** New topic = ≥2 escalations the existing manifest couldn't classify.
