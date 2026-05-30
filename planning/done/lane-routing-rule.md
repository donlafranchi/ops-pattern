---
purpose: Ratify the rule that decides whether atomize/Code output lands in planning/proposed/ or planning/next/.
layer: how
status: ratified
route: weigh
source: Cowork session 2026-05-30 — atomize-shipping thread, surfaced during the doc-stitching audit response.
risk: medium
---

# Lane routing — proposed vs. next

## PM ratification — 2026-05-30

PM approved the routing rule, the standing-approval scope, and the 6 actions. **Rejected:** any stale-time-limit on the kanban lanes — drop the existing ~2-week staleness flag from `planning/proposed/README.md` and do not introduce a max-dwell-time on `planning/next/`. Lane membership is the state; PM moves files when ready, no auto-flag for dwell time. Open question #2 (next/ max-dwell) answered no; #1 (standing-approval boundary) and #3 (which playbook) defer to the executing `weigh` invocation.

## What this is

A pattern-doc decision about how `atomize` (and PM/Code-drafted stubs) choose between `planning/proposed/` and `planning/next/` at write time. Today the implicit rule is "everything lands in `proposed/`, PM promotes to `next/` after ratify." That works for decision-bearing items but adds a no-value PM-ratify gate to mechanical sweeps where the content is drafted and the pattern is standing-approved.

## Proposed rule

Lane choice at write time depends on whether PM ratification adds a real call.

- **Decision-bearing item** (close-call, route choice, unratified absolute, scope tradeoff, new pattern entry, scenario tradeoff, system-spec change) → `planning/proposed/`. PM has to think.
- **Mechanical item with drafted content and standing PM approval** (doc-cite cleanup, frontmatter fix, archive move, drift sweep, link rewrite) → `planning/next/` directly. PM just needs a time slot.
- **When in doubt, `proposed/`.** The cost of a missed ratify gate exceeds the cost of an extra one.

## Standing-approval scope (proposed)

Mechanical items eligible for direct-to-`next/` landing:

- Doc-cite cleanups when both source and destination paths are explicit in the draft.
- Frontmatter fixes (missing `purpose:` / `layer:` / `status:`) on docs already in their correct home.
- Archive moves following ADR-25's directory-local archive convention.
- Drift sweeps that execute a previously-ratified rename or move.
- Link rewrites after a previously-ratified path change.

Items that ALWAYS pass through `proposed/`:

- New pattern entries in `playbooks/PLATFORM-PATTERNS.md` or `DEVELOPMENT-PATTERNS.md`.
- Scope or scenario tradeoffs.
- System-spec changes (any edit to `product/systems/` or `product/foundation/`).
- Anything introducing a new absolute statement.
- Anything touching `playbooks/` content (vs. mechanical formatting fixes).
- Anything `atomize`'s routing rules already send to `weigh`, `scope`, or `explore`.

In atomize's routing-table terms: `route: tidy | ticket` *may* land in `next/` if the content is drafted and the pattern is mechanical. `route: weigh | scope | explore` always lands in `proposed/`.

## Why this matters

The doc-stitching pass triggered by Code's audit is the first real test. It has two decision-bearing items (this rule and the ADR-dir question) plus three mechanical README rewrites. Under the implicit "everything to proposed/" rule, PM ratifies all five. Under the proposed rule, PM ratifies the two decisions; the three mechanical fixes land in `next/` and execute when PM time-slots them. That's a 60% reduction in ratify-gates on items where PM ratification adds no real call.

This pattern repeats every time an audit surfaces a mix of decisions and mechanical fixes. Codifying once removes the case-by-case routing question on every future audit.

## Actions (if PM ratifies)

1. Add a "When proposed vs. next" section to `planning/proposed/README.md` naming the rule and the standing-approval set.
2. Create `planning/next/README.md` with the inverse framing — "what already-ratified work belongs here, including directly-landed mechanical sweeps."
3. Extend `skills/atomize/SKILL.md` § Routing rules with a final column ("Landing lane") so the routing table answers both downstream-skill AND landing-lane in one pass.
4. Add a corresponding section to `skills/atomize/workflow.md` § Routing rules.
5. Land the ratified pattern as a new entry in `playbooks/DEVELOPMENT-PATTERNS.md` titled "Route work items by ratification need, not by lane default" with the Decision / Intent / Touches format. The pattern doc is the long-term home; the proposed/, next/, and atomize edits implement the pattern.
6. After the entry lands, archive this stub to the appropriate retirement path per ADR-25.

## Side effects

- Updates `planning/proposed/README.md` and the (new) `planning/next/README.md` so future contributors see the rule on first read.
- Updates `skills/atomize/SKILL.md` + `workflow.md` so atomize lands stubs in the right lane on first try.
- Lands one new entry in `playbooks/DEVELOPMENT-PATTERNS.md` — the long-term home for this kind of build-process pattern.
- Unblocks the doc-stitching pass: the three mechanical README rewrites become direct-to-`next/` work; only the ADR-dir question stays in `proposed/`.

## Risk

Medium. The risk is granting standing approval too broadly and having a mechanical sweep land badly without PM sight before execution. The mitigation is the explicit standing-approval scope (doc-cite cleanup, frontmatter fix, archive move, drift sweep, link rewrite) and the "when in doubt, `proposed/`" tiebreaker. Standing approval can be revoked or narrowed in a future memo if any class of "mechanical" sweep proves consequential.

## Open questions for weigh

- Does the standing-approval set capture the right boundary, or should it be narrower (e.g., exclude drift sweeps)?
- Should `next/` carry a max-dwell-time before items either execute or get demoted to `later/`? `proposed/` already has a ~2-week staleness flag.
- Does this pattern entry land in `DEVELOPMENT-PATTERNS.md` (recommended — it's a build-process pattern) or `PLATFORM-PATTERNS.md`?

## Source

Surfaced in Cowork session 2026-05-30 during the atomize-shipping thread, immediately after Claude Code's audit of the four-step intake flow. The audit recommended a 4-item doc-stitching pass; the routing question (where do those 4 items land?) is itself a decision that needed a stub.
