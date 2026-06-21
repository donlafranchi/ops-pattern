# dry-docs — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | all `product/foundation/*.md` (frontmatter `owns:` + content), all non-foundation `.md` files under `product/`, `planning/`, `development/`, `standards/`, `playbooks/`, root load-bearing set |
| **Writes** | nothing in audit mode. In fix mode, edits downstream docs only — never foundation docs. Always with PM ratification. |
| **Hands to** | nothing — PM continues |

---

## Step 0 — Build the concept registry

Shared setup for all modes. Run first.

1. **Read every `.md` in `product/foundation/`.** For each file:
   - Extract `owns:` from frontmatter. Each entry becomes a concept keyed to this file.
   - If no `owns:` field: infer concepts from `##` headers and bolded key terms. Tag these as `inferred` (lower confidence — flag in report).
2. **Build the registry.** A table of `concept → source file → detection patterns`.
   - Detection patterns: the concept name, its common phrasings, and 2–3 signature phrases from the source definition. These are what you'll grep for in downstream docs.
3. **If concept-scoped mode:** filter the registry to the named concept only. If the concept doesn't exist in any foundation doc, stop and suggest `explore` to create a source-of-truth doc first.

---

## Sub-routine A — Audit

Triggered by: "dry audit", "check for restated concepts", "reference duplication check", or as part of `tidy`.

### Steps

1. **Run step 0** (build concept registry).

2. **Scan all non-foundation docs.** Walk every `.md` under `product/` (excluding `product/foundation/`), `planning/`, `development/`, `standards/`, `playbooks/`, and the root load-bearing set (`CLAUDE.md`, `AGENTS.md`, etc.).

3. **For each doc, for each concept in the registry:** search for detection patterns. When found, classify:

   | Classification | Rule | Action |
   |---|---|---|
   | **Pointer** | ≤1 sentence + contains a link or `see {source}` reference | No violation — skip |
   | **Term use** | Uses the concept's name/term without re-explaining | No violation — skip |
   | **Restatement** | 2+ sentences explaining the concept inline | **Violation** |
   | **Table restatement** | Table cell with multi-sentence definition of the concept | **Violation** |

4. **Collect violations.** For each violation, record:
   - Source concept and its foundation doc
   - Downstream file and line number(s)
   - The restated text (abbreviated to first 80 chars + `…`)
   - A suggested pointer replacement (one sentence + link)

5. **Report.** BLUF format:

   ```
   Status: Done — N violations across M files restating K concepts.
   Next: "dry fix" to replace restatements, or "dry fix [concept]" for one at a time.
   Want detail? Say "expand."
   ```

   On expand: violations grouped by source concept. Each group:
   ```
   ## [concept-name] (source: product/foundation/{file}.md)
   - {downstream-file}:{line} — "{abbreviated restatement…}"
     → suggested: "{pointer text with link}"
   ```

---

## Sub-routine B — Fix

Triggered by: "dry fix", "replace restatements with pointers", "DRY the docs".

### Steps

1. **Run sub-routine A first** (or use its cached output if audit was just run in this session).

2. **For each violation, generate the replacement.** Rules for pointer construction:
   - Preserve the contextual sentence — the reader still needs to know *why* the concept matters here.
   - Remove the duplicated explanation — the 2+ sentences that re-define the concept.
   - Add a link to the source: `(see [{concept display name}]({relative path to foundation doc}))` or `(defined in [{foundation doc name}]({path}))`.
   - Match the surrounding doc's voice and formatting.

   Example:
   ```
   BEFORE (violation):
   Groups are assessed against five markers of extraction: regulatory capture,
   information asymmetry, switching costs, value extraction ratio, and
   community displacement. Groups failing three or more markers face
   progressive intervention.

   AFTER (pointer):
   Groups failing the extraction diagnostic (see [impact-diagnostic.md](../foundation/impact-diagnostic.md))
   face progressive intervention.
   ```

3. **Present changes as a diff summary** before writing. Group by downstream file. PM ratifies per-file or all-at-once.

4. **On ratification, apply edits.** Edit each downstream file.

5. **Do NOT commit.** End with:

   ```
   Status: Done — replaced N restatements across M files with pointers to K foundation docs.
   Next: commit when ready.
   Want detail? Say "expand."
   ```

   Followed by commit message + clearlock line (per project convention).

---

## Sub-routine C — Concept-scoped

Triggered by: "dry audit [concept]", "dry fix [concept]".

### Steps

1. **Run step 0** with filter — build registry for the named concept only.
2. If sub-mode is audit → run sub-routine A for that concept.
3. If sub-mode is fix → run sub-routine B for that concept.

This is the mode to use when a foundation doc just changed and you want to verify/update its downstream references without scanning the entire doc tree.

---

## Refusals

- **Refuse to edit a foundation doc.** Foundation docs are the source of truth. If one needs changing, that's `explore` or `weigh`, not this skill.
- **Refuse to fix without PM ratification.** Always show the diff first.
- **Refuse to commit.** Ends with commit message + clearlock for PM.
- **Refuse to create a pointer to a concept with no foundation-doc home.** Route to `explore` to write the source-of-truth doc first.
- **Refuse to flag single-sentence references as violations.** Those are pointers — they're the goal state.

---

## Hand off

**You produced:** depends on mode.

- **audit** — violations report, no files changed.
- **fix** — restatements replaced with pointers, diff summary, commit message for PM.
- **concept-scoped** — same as audit or fix, scoped to one concept.

**Next skill:** none. PM continues.

## Final report

Default report shape:

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Withhold per-file diffs, line numbers, and violation details until PM says "expand."
