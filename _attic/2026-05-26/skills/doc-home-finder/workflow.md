# doc-home-finder — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | the target doc in `_inbox/` (or root), `REGISTRY.md`, `CLAUDE.md` § "Project-specific authoritative docs", `product/MAP.md`, `product/TRACE.md`, candidate parent docs identified during the walk |
| **Writes** | nothing without PM ratification. On ratify: `git mv` the file; update `REGISTRY.md`; update any back-references in CLAUDE.md / MAP.md / TRACE.md |
| **Templates** | none |
| **Hands to** | nothing — PM continues |

## When to invoke

User says: "triage the inbox", "where should this go", "find a home for this doc", "is this a new file or does it fold into X", "name this properly", "drain `_inbox/`".

Drift check from `pipeline-router` flagged a non-empty `_inbox/` or a stray root-level doc.

## One doc at a time

**Hard rule.** This skill processes one doc per invocation. Batching tempts shallow analysis. If `_inbox/` has five docs, run five passes. The PM ratifies each move before the next begins.

## Workflow

1. **Read the target doc end-to-end.** Frontmatter, intent, scope. If frontmatter is missing or wrong, surface that first — the PM may fix it before the home decision.

2. **Classify the doc's shape.** Pick exactly one:

   | Shape | What it looks like | Likely home |
   |---|---|---|
   | Active spec / system | Describes a system the platform builds | `product/systems/` |
   | Foundation / philosophy | Cross-cutting principles | `product/foundation/` |
   | Capability | One atomic user-facing thing | `product/capabilities/` |
   | UI / surface reference | Component, page, design pattern | `product/ui/` |
   | Need / persona / use case | About who/what the platform serves | `product/needs/` |
   | Exploration / sketch | Pre-system, not yet committed to | `product/exploration/` |
   | Scenario draft | Given/When/Then in flight | `planning/scenarios-backlog/` |
   | ADR proposal | Architectural decision | route to `pipeline-adr`, not this skill |
   | Bundle / sub-bundle | Release scope | `planning/bundles/` |
   | Ticket | Implementation task | `development/tickets/` |
   | Standard / cross-cutting quality | Safety, security, a11y, perf | `standards/` |
   | Meta-work product | Audit, consolidation, absorption pass | `housekeeping/YYYY-MM-DD-{slug}/` |
   | Retired spec | Was once live, now superseded | `_attic/YYYY-MM-DD/{original-path}/` |
   | Process doc that lives elsewhere | Belongs in `skills/` or as a root navigation file | flag — do not move without PM call |

3. **Check for a fold-in candidate.** Before standing the doc up as its own file, ask: *is there an existing doc this should be a section of?* Walk:
   - The MAP.md system list — does an existing system already cover this?
   - The REGISTRY.md catalog — is there a doc with overlapping purpose?
   - If the doc is short (under 200 lines) and a 70%+ topic overlap exists, recommend **fold** over **new file**.

4. **Propose filename per the naming convention** (CLAUDE.md § Naming). For active docs: `kebab-case.md`, no date. For dated work products: `housekeeping/YYYY-MM-DD-{slug}/`. For ADRs: `ADR-NNNN-{slug}.md`. Refuse to invent a filename outside the convention — surface the gap.

5. **Identify references.** Grep the repo for the source doc's current path. List every file that points at it. These need updating after the move.

6. **Present the recommendation as a single block:**

   ```
   Target doc: _inbox/{filename}
   Shape: {one of the table rows}
   Recommendation: {FOLD into {existing path} | NEW FILE at {proposed path}}
   Rename to: {new filename per convention}
   References to update: {list of files}
   REGISTRY action: {add row | update row | no change}
   Frontmatter changes: {any cleanup needed}
   ```

7. **Wait for PM ratification.** Do not move the file until PM says go. On rejection, surface the alternative the PM wants and re-propose.

8. **On ratify, execute the move:**
   - `git mv` the file to the proposed path.
   - Edit references in every file listed.
   - Update `REGISTRY.md`.
   - If the doc is a fold-in, merge the content into the parent doc, then archive the source to `housekeeping/YYYY-MM-DD-folded-{slug}/` (don't just delete — preserve trace).

9. **Confirm clean.** `_inbox/` empty (or one doc lighter). Report what landed.

## Fold-in decision rule

Default to fold-in when any of these hold:

- Source doc is under 200 lines.
- 70%+ topic overlap with an existing doc.
- Source doc references the candidate parent more than 2 times.
- The candidate parent has an explicit extension point (a section that invites additions).

Default to new file when any of these hold:

- Source doc is over 500 lines.
- Source doc introduces a new top-level concept (a new system, a new standard).
- Source doc is dated work-product (audit, absorption pass).
- The candidate parent is already at scannable-weight ceiling (the audit's E2 warning).

In between: surface both options and let PM pick.

## Refusals

- **Refuse to move a doc the PM didn't ratify.** This skill recommends; PM decides.
- **Refuse to invent a filename outside the naming convention.** If the doc shape doesn't fit any convention row, surface the gap — the convention may need extension.
- **Refuse to batch.** One doc per invocation.

## Hand off

**You produced:** one doc filed (or folded), all references updated, REGISTRY.md current.

**Next skill:** none, unless the doc itself triggers downstream pipeline work (e.g. a freshly-filed scenario hands to `pipeline-plan` for ratification). Surface that as a recommendation, don't auto-invoke.
