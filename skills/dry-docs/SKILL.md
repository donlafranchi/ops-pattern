---
id: how-dry-docs-skill
name: dry-docs
description: DRY enforcement across documentation. Three modes — audit (scan for inline restatements of foundation-owned concepts in downstream docs), fix (replace restatements with pointers to the source-of-truth doc), concept-scoped (audit or fix for a single concept). Use when the user says "dry audit", "dry fix", "check for restated concepts", "reference duplication check", "reduce doc duplication", "single source of truth", "concept ownership", "why do we restate this everywhere", "reference architecture", "DRY the docs", "dry fix [concept]", "dry audit [concept]", "how many places restate X", "foundation concept drift", or when a foundation doc just changed and downstream references need updating. Reads all `product/foundation/` docs, their `owns:` frontmatter, and all non-foundation `.md` files. Writes nothing without PM ratification.
---

> **Deprecated.** Folded into `tidy` (sweep-dry mode). This skill is deprecated and will be removed. Use `tidy sweep-dry` instead.

# dry-docs

Define once in the source-of-truth doc, point everywhere else. Reduces the cost of foundational changes — when "ownership tiers" becomes "impact transparency," you update one doc and verify pointers, not 217 inline restatements across 94 files.

**The one question.** *Is this concept explained here, or pointed to from here?*

## Modes

| Mode | Trigger | Modifies files |
|---|---|---|
| **audit** | "dry audit", "check for restated concepts", "reference duplication check", part of `tidy` | No — report only |
| **fix** | "dry fix", "replace restatements with pointers", "DRY the docs" | Yes — with PM ratification |
| **concept-scoped** | "dry audit [concept]", "dry fix [concept]" | Depends on sub-mode |

When the user says just "dry docs" without a mode hint: default to audit.

## What counts as a violation

- **Violation:** A downstream doc re-explains a concept in 2+ sentences when the concept is authoritatively defined in a foundation doc. Example: `groups.md` spending a paragraph explaining the five extraction markers.
- **Not a violation:** A one-sentence contextual reference with a link. Example: "Groups failing the impact diagnostic (see `impact-diagnostic.md`) do not receive discovery promotion."
- **Not a violation:** Using a concept's term without re-explaining it. The word "extraction" in a sentence is fine; a paragraph defining what extraction means is not.
- **Not a violation:** The source-of-truth doc itself.
- **Edge case — tables:** A cell that names a concept and links to its source is fine. A cell with a multi-sentence definition is a violation.

## Foundation doc contract

Each foundation doc should carry an `owns:` field in its frontmatter listing concepts it's the source of truth for:

```yaml
---
owns:
  - five-markers-of-extraction
  - extraction-diagnostic
  - treatment-toolkit
---
```

The skill also works without `owns:` by inferring concepts from headers and key terms — but `owns:` makes it precise.

## When NOT to use

- The doc in question IS a foundation doc — it's the source, not a restater.
- The restatement is a single sentence or less — that's a pointer, not a violation.
- The concept isn't defined in any foundation doc — no source of truth exists yet; write one first via `explore`.

## Integration points

- **`tidy`** — audit mode should run as part of `tidy`'s sweep-docs. (The `tidy` workflow may add a finding category for concept restatements.)
- **`orient`** — session-start drift check could flag: "N foundation concepts have downstream restatements" as a drift indicator.

## Workflow

See [`workflow.md`](workflow.md) for each mode's sub-routine.

## Related skills

- `tidy` — anti-sprawl sweeper; dry-docs audit is a natural addition to sweep-docs.
- `orient` — session-start drift; concept restatement count as a drift signal.
- `explore` — if a concept has no foundation-doc home, route to explore to create one.
- `weigh` — if a foundation concept is changing (not just its downstream references), weigh the change first.

## Hand off

**You produced:** depends on mode.

- **audit** — a violations report grouped by source concept, with line numbers and suggested pointers. No files changed.
- **fix** — restatements replaced with pointers, diff summary, commit message for PM. Does not commit.
- **concept-scoped** — same as audit or fix, but scoped to one concept.

**Next skill:** none. PM continues, or chains with `tidy` / `explore`.
