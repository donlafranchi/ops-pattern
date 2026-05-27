---
name: weigh
description: Tech-lead judgment-call skill. Forces one question — "which option stays reversible, and who bears the cost" — on every close call, every unratified absolute, and every Intent-shaped gap. Folds four prior skills (intent-check, ratify-absolute, member-advocate, platform-advocate) into one walk. Use when the user says "weigh this", "is this a close call", "ratify the absolutes in {file}", "audit Intent annotations", "what's the Member view", "what's the platform view", "run the dialectic on F###", "decide or defer on X", or when scope/ticket gates surface unratified absolutes. Applies the lexicographic close-call rule from DECISION-PATTERNS.md (member safety → platform health → data protection → mutual benefit with reversibility). Refuses to batch-process; refuses to land an absolute without per-statement PM ratification; refuses Defer without an observable trigger. Reads the target file, principles.md, policy.md, related foundation/system docs. Writes State-tagged `Intent` lines directly to the source file on PM ratification, plus a JOURNAL entry per session; for Intent-scan mode, writes a one-shot review file under `planning/reviews/`.
---

# weigh

The single skill for judgment calls — close calls, unratified absolutes, missing Intent annotations, and the member/platform dialectic. Replaces and consolidates `pipeline-intent-check`, `pipeline-ratify-absolute`, `pipeline-member-advocate`, and `pipeline-platform-advocate`.

**The one question.** *Which option stays reversible, and who bears the cost?* Architected for revisability over being right the first time.

**The close-call rule (lexicographic).** Per [`DECISION-PATTERNS.md`](../../meta/cowork-pipeline/DECISION-PATTERNS.md):

1. **Member safety** — physical, financial, reputational, psychological.
2. **Platform health** — the platform's continued ability to keep serving Members.
3. **Member data protection** — minimization, consent, control, deletion.
4. **Mutual benefit with reversibility** — fall back to the default; pick the option that serves the most parties and can be undone.

Apply level-by-level; only move down when the prior level can't separate the options. The single project-wide absolute (wealth circulation over wealth extraction) overrides every level when implicated. Everything else is a default with named exceptions.

## When to use

- **Close-call adjudication** — "weigh option A vs B", "is this a close call", "decide or defer on X."
- **Absolute ratification** — "ratify the absolutes in {file}", "review every never-statement", "every absolute needs Intent", "is this absolute earned."
- **Intent-scan** — "audit Intent annotations in {file}", "did this spec get the Intent treatment", "scan DECISIONS for intent gaps."
- **Dialectic on demand** — "what's the Member view", "what's the platform view", "run the dialectic on this statement."
- **Gate calls from upstream skills** — `scope` Gate A or `ticket` Gate B refused to proceed because cited spec sections contained unratified absolutes.

## When NOT to use

- During an open ticket implementation or active TDD — surface the request, defer until the phase closes.
- For statements that aren't decisions (descriptive prose, schema invariants, naming) — route to `tidy` if it's a doc-hygiene question, or proceed without weigh.
- For batch processing without PM ratification — refuses to land without per-statement confirmation.
- To replace PM judgment. The skill structures the adjudication; it does not adjudicate.

## The State marker

Every ratified absolute carries one State, encoded co-located with the bullet:

| Line | State |
|---|---|
| no `Intent:` line | **Unratified de-facto** — blocks downstream pipeline |
| `Intent: {why}` (no parenthetical) | **Drafted** — blocks downstream pipeline |
| `Intent (Ratified YYYY-MM-DD): {why}` | **Ratified** — terminal |
| `Intent (Deferred until {trigger}; review by {date \| bundle gate}): {interim posture}` | **Deferred** — terminal until trigger fires |

Rejected absolutes are removed; the JOURNAL entry records the removal. No `Intent (Rejected)` tag.

## Modes (four sub-routines)

The workflow chains four sub-routines. Most invocations use one or two; full chain runs only on whole-file ratification.

1. **Scan** — locate candidates (Intent-check categories 1–8 from the archived intent audit; absolute-language shapes).
2. **Dialectic** — invoke the Member view + Platform view bullets on any statement with Member-shaped tension.
3. **Ratify** — apply the lexicographic close-call rule per statement; PM confirms one of Ratify / Defer / Revise / Reject.
4. **Stamp** — write the State-tagged `Intent` line to the source file; append JOURNAL entry.

See [`workflow.md`](workflow.md) for the sub-routine sequencing.

## Hand off

**You produced:** State-tagged `Intent` line(s) landed in the source file(s) on each ratified statement; absolutes removed for Rejected; JOURNAL entry summarizing what was ratified / deferred / revised / rejected with `file:line` pointers. For Intent-scan mode without ratification: a review file at `planning/reviews/intent-{target}-{YYYY-MM-DD}.md`.

**Next skill:** none. PM owns what comes next. Common follow-ups: re-run weigh on the same file to confirm; `scope` or `ticket` re-runs the gate it previously failed.
