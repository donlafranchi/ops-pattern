# planning/adrs/ — Architectural Decision Records

> Canonical home for every ADR in the project. One file per ADR. Numbered, dated, immutable once accepted. Indexed from [`../DECISIONS.md`](../DECISIONS.md).

## Purpose

This directory holds the long-form text of every Architectural Decision Record. The companion file [`../DECISIONS.md`](../DECISIONS.md) is the canonical **pointer index** — one line per ADR, current status, file path. Agents read DECISIONS.md to navigate; they read files in this directory for the load-bearing text.

The split is deliberate:
- **DECISIONS.md = index.** Fast to scan, easy to grep, fits in agent context. Pointer-only.
- **`planning/adrs/{file}.md` = canonical record.** Full Decision + Consequences + Action Items. Editable until Accepted; immutable after.

When a decision lives primarily in a system spec (precedent: ADR-7 in `action-layer.md`) or a foundation/UI/ops doc (precedent: ADR-2 in `design-language.md`), the canonical text lives in *that* doc — but an ADR file *also* lives here, structured per the template below, to make the decision discoverable from one canonical location. The in-doc text and the ADR file cross-reference each other.

## Filename convention

```
ADR-{NNNN}-{slug}.md
```

- `NNNN` — zero-padded four-digit ADR number, monotonically increasing. Never reused, even for rejected ADRs.
- `slug` — short, kebab-case identifier, matches the topic. Examples: `eval-helpers`, `groups-consolidation`, `affinity-row-privacy`.

Full example: `ADR-0018-eval-helpers.md`.

The number is allocated when the file is created. Check [`../DECISIONS.md`](../DECISIONS.md) pointer index for the next free number. **Never reuse a number.** If an ADR is drafted then rejected, the number is retired (the file stays with Status: Rejected).

## Format — uniform header

Every ADR opens with the same header block, then the body. No "this one has a Date, that one doesn't."

```markdown
# ADR-{NNNN}: {Title}

**Status:** Proposed | Accepted | Superseded (→ ADR-N) | Rejected
**Date:** YYYY-MM-DD
**Deciders:** {who signs off — PM alone in the solo phase}
**Scope:** {one sentence — what surface this affects}
**Touches:** {comma-separated list of files / specs / directories affected}
**Supersedes:** ADR-N (optional, when applicable)
**Superseded by:** ADR-M (added when this ADR is itself superseded)

## Decision

What we decided. Terse. State the *current* shape only — no "we considered X, Y, Z" preamble in the Decision section itself.

## Options considered

Optional but recommended for any non-trivial ADR. Table form preferred:

| Option | Description | Verdict |
|---|---|---|

Or numbered subsections with brief Pros / Cons.

## Trade-offs

Why the chosen option won. What's hard about it. What the rejected options would have cost. This is where future-you (or the next agent) understands the *why* and can judge edge cases.

## Consequences

What downstream work and constraints this creates. Each consequence is one bullet. Be specific — name files, name specs, name the constraint.

## Action Items

Concrete follow-ups. Checkbox format.

1. [ ] {item}
2. [ ] {item}
```

The eval-helpers ADR ([`ADR-0018-eval-helpers.md`](ADR-0018-eval-helpers.md)) is a reference example.

## Lifecycle

```
Proposed → Accepted → Superseded
              ↓
            Rejected (terminal)
```

- **Proposed.** Drafted. Open for revision. Edit freely.
- **Accepted.** Ratified by the PM. **Do not edit** — supersede with a new ADR if the decision changes.
- **Superseded.** A later ADR replaces this one. Add `Superseded by: ADR-M` to the header. The body stays as historical record. The file does not move to archive — the Status banner is the indicator.
- **Rejected.** Drafted then explicitly declined. Status banner flips; the file stays as historical context for "why we didn't do this." Number is retired with the file.

**No silent deprecation.** If a decision is no longer in force, it gets a "Superseded by" link, not deletion. If a decision is no longer relevant, it gets a brief Status update explaining why.

## What belongs here vs. elsewhere

A decision can have a *home doc* (a system spec, foundation doc, UI doc) where its full text lives — and *also* an ADR file here for indexing. The three patterns:

1. **Cross-cutting ADRs** (touch many specs, no single owner). Full text lives in `planning/adrs/`. DECISIONS.md pointer references the file. Examples: ADR-15 (auth PK equality), ADR-16 (affinity privacy), ADR-17 (bounded_purchase), ADR-18 (eval helpers).

2. **Spec-resident ADRs** (decision shapes one primitive or system). Full text lives in the system spec; the spec's status banner is the load-bearing ratification. An ADR file here carries the decision summary + cross-reference to the spec. Examples: ADR-7 (action layer → `action-layer.md`), ADR-13 (Groups consolidation → `groups.md`), ADR-14 (Location architecture → `location.md`).

3. **Foundation/UI/ops ADRs** (decision *is* a foundational principle or tech-stack reality). Full text lives in the home doc; ADR file carries summary + cross-reference. Examples: ADR-1 (tech stack → `web/CLAUDE.md`), ADR-2 (bottom-anchored UI → `design-language.md`), ADR-6 (agent assistance → `agent-assistance.md`), ADR-9 (policy framework → `policy.md`).

In all three patterns, **DECISIONS.md is the single index** and **planning/adrs/ has a file per ADR**. The differentiator is where the load-bearing prose lives.

## How to add a new ADR

1. Check [`../DECISIONS.md`](../DECISIONS.md) for the next free number.
2. Copy [`_template.md`](_template.md) → `ADR-{NNNN}-{slug}.md`.
3. Fill in the header (Status: Proposed, today's date, etc.) and body.
4. If the decision introduces schema, events, components, or absolutes, invoke `pipeline-intent-check` per rebuild-phase rule #9.
5. PM reviews; flip Status to Accepted; commit.
6. Add a pointer line to DECISIONS.md's pointer-index table.
7. If the decision is spec-resident or foundation-resident, also update the home doc (status banner, "Decisions encoded here" footer, or section text).

The `pipeline-adr` skill walks through this — invoke it when writing or ratifying.

## Cross-references

- Every ADR lists the files/specs it touches in the `Touches:` header field.
- Every spec that encodes an ADR carries a "Decisions encoded here" footer naming the ADR(s) by number.
- Every superseded ADR carries `Superseded by: ADR-M` in its header.
- Every superseding ADR carries `Supersedes: ADR-N` in its header.

The arrow goes both ways. Reciprocal links keep the doc graph navigable.

## Archive

Superseded ADRs **stay in this directory** with `Status: Superseded`. They do not move to `../archive/`. The Status banner is sufficient; relocation breaks links.

The `../archive/` directory holds *legacy artifacts* — pre-format ADR text, archived spec files, snapshots of DECISIONS.md from prior cleanups. Not the working canonical record.

## Quarterly retro

Run `pipeline-adr-retro` (or extend `pipeline-prune`) once per quarter:

- Walk every Accepted ADR. Still load-bearing?
- Any spec drift — does the spec still encode the decision the ADR ratified?
- Any pending banners that need to be promoted to written ADRs?
- Any notes/ docs that have matured into architectural decisions and should be promoted?

The retro produces a one-line entry per ADR in JOURNAL.md and any required supersession ADRs.
