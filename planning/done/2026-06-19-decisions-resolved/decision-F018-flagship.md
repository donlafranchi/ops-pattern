---
id: how-f018-flagship-decision
purpose: Decide whether F018 stays the flagship walkthrough or gets replaced.
layer: how
status: proposed
route: scope
source: planning/OPEN-QUESTIONS.md #1 (now archived) → drained 2026-05-30 by reorg-11
risk: medium
---

# F018 flagship walkthrough — re-promote or replace

## What this is

F018 is the project's advertised flagship walkthrough (cited in `AGENTS.md` line 18 → originally at `_attic/2026-05-27/planning-history/F018-pipeline-trace.md`). The scenario is deferred. Its tickets (T036–T040) are in `tickets/archive/`. The trace doc claims "reproducible" — it is not. URLs in the trace (`/i/[slug]`) predate the 2026-05-11 naming pass (now `/e/`).

PM picks one of two paths.

## Options

**Option (a) — Re-promote F018.**
- Move F018 from backlog to `planning/next/`.
- Run `review` on the revised scenario; address the original REVISE punch list.
- Regenerate the pipeline-trace doc against live artifacts under the post-2026-05-11 naming.
- Update `AGENTS.md` line 18 to reference the new trace location.

**Option (b) — Retire F018; replace as flagship.**
- Pick a substitute: either a Phase 1 substrate run (T041–T053 already shipped — full pipeline-trace material exists in BUILD-LOG + DEVIATIONS) or a forthcoming Phase 2 surface scenario.
- Update `AGENTS.md` line 18 to point at the new flagship.
- Archive F018 with a "retired as flagship; see {new flagship}" pointer.

## Why this is decision-bearing

The flagship walkthrough is the canonical example a new contributor (or a new agent session) reads to understand the pipeline end-to-end. The choice between (a) — revive the original scenario as designed — and (b) — pick a more recent, already-shipped artifact — affects what kind of system the canonical example *teaches*: F018 was a member-facing surface walkthrough; the Phase 1 substrate runs are pipeline-discipline walkthroughs. Different teaching value.

## Source

OPEN-QUESTIONS #1, drained 2026-05-30 by reorg-11. The original audit reference (R2, E1) is at `_attic/2026-05-27/2026-05-23-pipeline-coverage/pipeline-process-audit-2026-05-22.md` for trace.
