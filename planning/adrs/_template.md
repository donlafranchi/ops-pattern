---
purpose: Blank ADR scaffold for new architectural decisions.
layer: how
status: reference
---

# ADR-{NNNN}: {Title}

**Status:** Proposed
**Date:** YYYY-MM-DD
**Deciders:** PM
**Scope:** {one sentence — what surface this affects}
**Touches:** {comma-separated list of files / specs / directories affected}

<!-- When applicable:
**Supersedes:** ADR-N
**Superseded by:** ADR-M (added when this ADR is later superseded)
-->

## Decision

{What we decided. Terse. State the current shape only — no "we considered X, Y, Z" preamble in this section.}

## Options considered

{Optional but recommended for non-trivial ADRs. Table form preferred.}

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen** | {description} | Chosen |
| B | {description} | Rejected |

## Trade-offs

{Why the chosen option won. What's hard about it. What rejected options would have cost. This is where future-you understands the why and can judge edge cases.}

## Consequences

- {Each consequence is one bullet. Be specific — name files, name specs, name the constraint.}
- {What downstream work this creates.}
- {What constraint this imposes on future work.}
- {What this forecloses, and at what cost.}

## Action Items

1. [ ] {Concrete follow-up.}
2. [ ] {Concrete follow-up.}
3. [ ] {Add pointer line to `../DECISIONS.md` pointer index.}
4. [ ] {Update home doc cross-reference, if spec-resident or foundation-resident.}

<!-- Delete this comment block before committing:
After PM ratification, flip Status to Accepted and commit.
The file is then immutable — supersede with a new ADR if the decision changes.
-->
