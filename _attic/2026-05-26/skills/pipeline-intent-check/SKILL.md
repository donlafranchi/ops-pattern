---
name: pipeline-intent-check
description: Verify that new ADRs, foundation docs, and system specs carry `Intent:` annotations on the statement shapes a downstream agent can't interpret without them (Categories 1–8 from the archived intent audit at `_attic/2026-05-19/planning/intent-audit-2026-05-12.md`, encoded directly in this skill's workflow §2). Use when the user says "intent check", "audit intent annotations", "did this spec get the Intent treatment", "review F### for missing intent", "scan DECISIONS for intent gaps", or as a gate before merging any pipeline-doc change. Reads the archived intent audit, the target file(s), and `planning/DECISIONS.md` for ADR cross-refs. Writes a one-shot review file under `planning/history/intent-{target}-{YYYY-MM-DD}.md`. Out-of-band — does not run during an open pipeline phase. Refuses to write Intent lines itself; flags + proposes shapes for the PM to ratify.
---

# pipeline-intent-check

Project-resident quality skill. Inspects ADRs, foundation docs, and system specs for missing `Intent:` annotations on the eight statement shapes catalogued in [`intent-audit.md`](../../_attic/2026-05-19/planning/intent-audit-2026-05-12.md), and emits a punch list the PM (or the originating skill) can act on.

The point of the convention: a downstream agent (ticket-writer, build agent, eval) reading a spec needs to reason about *what the decision is protecting against*, not just *what the decision says*. Without Intent, the literal wording becomes the whole story — over-fits the surface, drifts on edge cases. With Intent, the agent can break ties correctly when the rule doesn't cover the case in front of it.

## When to use

- User says "intent check on F###" / "intent check on systems/X" / "audit intent on the foundation docs."
- After `pipeline-product` writes or extends a system spec (gate before `pipeline-plan`).
- After a new ADR lands in `planning/DECISIONS.md`.
- Before merging any pipeline-doc change touching foundation/ or systems/.
- During a `pipeline-prune` pass, if a memorialized invariant lands without Intent.

## When NOT to use

- During an open scenario phase or active TDD on a ticket — surface the request, defer until the phase closes.
- On scenarios in `planning/scenarios/` — scenarios carry acceptance criteria, not Intent annotations. The check is for *decision* documents, not test surfaces.
- On code or BUILD-LOG.md.
- To *write* the Intent lines. This skill flags + proposes shapes; the PM ratifies and lands the wording.

## Workflow

See [`workflow.md`](workflow.md).

## Related skills

- `pipeline-router` — orient before invoking; confirm no open phase is in flight.
- `pipeline-prune` — memorialized invariants from prune passes are themselves Category-2/Category-7 candidates and should be intent-checked before they're considered settled.
- `pipeline-review` — the architecture/design pre-flight that should *call* this skill on any review whose verdict introduces new schema, scopes, or refusals.
- `consolidate-memory` (Cowork, out-of-band) — analogous reflective pass over auto-memory; same out-of-band posture.

## Hand off

**You produced:** a review file at `planning/history/intent-{target}-{YYYY-MM-DD}.md` listing each Category-1–8 statement that lacks an Intent annotation, with a proposed Intent shape for each. Verdict at the top: **CLEAN** (nothing to add), **PROPOSE** (Intent lines suggested, PM ratifies), or **BLOCK** (load-bearing decision shipped without rationale; pause downstream pipeline until landed).

**Next skill:** none if CLEAN. PM (or the originating skill: `pipeline-product` for new specs, `pipeline-prune` for memorialized invariants) lands the proposed Intent lines verbatim or revised. After landing, re-run this skill until verdict is CLEAN.
