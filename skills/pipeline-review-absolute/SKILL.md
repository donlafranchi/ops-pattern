---
name: pipeline-review-absolute
description: Structured review of an absolute / Intent statement, producing one of four outcomes — ratify, revise, defer, or reject — under a lexicographic decision rule (platform-survival hard gate first, then maximize net member benefit). Orchestrates pipeline-member-advocate and pipeline-platform-advocate, surfaces all three views (member-individual, member-community, platform), and applies the rule explicitly with reasoning the PM can audit. Use when the PM says "review this absolute", "should this be an absolute", "audit our absolutes", "review F### intents", "is this earned", "decide or defer on X", or when reviewing absolutes authored by another agent. Handles two modes: proposed (new absolute being considered) and audit (existing absolute being re-examined). Deferral is first-class and requires an explicit trigger condition. Reads people-first.md, policy-framework.md, foundational-principles.md, the target spec, and any cited foundation docs. Writes a review record only on PM request; default is inline output.
---

# pipeline-review-absolute

The structured-review surface for absolutes. Orchestrates the two advocates, applies a lexicographic decision rule, and produces one of four outcomes the PM can act on or shelve with a trigger.

This skill exists because dialectic alone — two bullets, PM eyeballs it — works for one decision at a time but doesn't scale to **auditing a backlog of agent-authored absolutes** or to **deferring wisely with a re-open condition**. The two advocates remain the source of truth for the views; this skill is the rule-applier on top.

**The PM still adjudicates.** This skill structures the adjudication; it does not replace it. The decision-rule reasoning is offered as a recommendation with explicit gates, and the PM can override any step with cause logged.

## When to use

- "Review this absolute" / "should this be an absolute" / "is this earned"
- "Audit our absolutes" / "review F### intents" / batch review of agent-authored absolutes
- "Decide or defer on X" — when the PM wants the deferral analysis explicit
- After `pipeline-clarify-absolutes` surfaces a tension but a decision is needed, not just dialectic

## When NOT to use

- For statements with no member-vs-platform tension. Most structural commitments (internal-consistency rules, naming conventions, schema invariants) don't need this review. Route those to `pipeline-review` instead.
- As a one-shot replacement for the two advocates. This skill *invokes* them; their output is its input.
- To make calls the PM should make. The skill recommends; the PM ratifies.

## The two modes

**Mode A — Proposed.** An absolute is being considered for the first time (new spec, new Intent during clarification, new policy posture). Starting question: *should this be ratified as an absolute?*

**Mode B — Audit.** An existing absolute (often agent-authored) is under review. Starting question: *is this absolute earned, and should it remain?*

The decision rule is the same in both modes. The framing of the four outcomes differs:
- **Mode A:** Ratify / Revise / Defer / Reject
- **Mode B:** Keep / Revise / Defer-and-soften / Remove

## The decision rule (lexicographic)

Apply in order. Do not collapse into a single score.

### Gate 1 — Platform survival (hard)

*Does ratifying this absolute threaten the platform's ability to exist — its utility OR its financial durability?*

Read the platform-advocate bullet. Ask:
- Does this absolute foreclose a revenue line the platform needs to remain durable (no-VC posture per `foundational-principles.md`)?
- Does this absolute prevent a function the platform must perform (federation, agent-native navigability, business-jurisdiction verification, payments)?
- Does this absolute make the platform unable to deliver on P1 / P4 / P5 over a horizon longer than the deferral window allows?

If **yes** to any of these → the absolute fails Gate 1. Outcomes available: **Revise** (find a wording that preserves the Member protection without foreclosing platform durability) or **Reject** (the absolute as drafted is mission-incompatible). **Cannot ratify or defer as-is.** A deferred absolute that would kill the platform if ratified is still a future kill; deferral doesn't fix Gate 1 failures.

If **no** → proceed to maximization.

### Maximization — Net member benefit

*Among options that pass Gate 1, which choice maximizes net member benefit — individual AND community — with neither lens taking significant harm?*

Read the member-advocate bullet(s). Two cases:

**Member-vs-platform shape (one bullet).** Compare ratify vs. revise vs. defer:
- If ratifying produces clear member benefit and no significant offsetting platform harm → **Ratify**.
- If ratifying helps members but the wording overreaches and causes avoidable platform-utility loss → **Revise** with proposed wording.
- If the member benefit depends on facts not yet knowable → **Defer** with trigger.

**One-Member-vs-many-Members shape (two bullets).** This is where the skill earns its keep. The individual-bullet and community-bullet may pull opposite directions. The rule:
- Look for the option where **neither lens takes significant harm**. That option, if it exists, wins.
- If every available option causes significant harm to one lens or the other, choose the one where the harm is **reversible** over the one where it isn't. (Reputation damage to an individual: hard to reverse. Community trust damage from one bad actor going unchecked: also hard, but typically slower to set in.)
- If still tied, **Defer** is honest. State explicitly: *the trade-off cannot be resolved without [signal X]; re-open when [trigger].*

### Trigger conditions for Defer (required when deferring)

A deferred absolute is not a punt — it's a structured re-entry. The trigger must be:
- **Observable.** A real-world signal the platform or PM can detect.
- **Specific.** Not "when we know more" but "when MAU > N" or "when first federation peer goes live" or "when ≥3 instances of [behavior] observed."
- **Bounded.** A fallback time horizon attached (e.g., "or 12 months from b1 ship, whichever first") so deferral doesn't become permanent silence.

Common trigger shapes for this platform:
- User-base size (MAU, weekly active sellers, weekly active gatherings)
- Capability shipped (federation, payments, business-jurisdiction verification, T3 community-authored skills)
- Partner milestone (first CDFI partnership, first federation peer)
- Market signal (first instance of [observed behavior], N reports of [issue])
- Bundle gate (decide at b2 ratification; decide at b3)

If no trigger can be stated, the decision cannot be deferred — it must be ratified, revised, or rejected now.

## Workflow

1. **Confirm mode.** Proposed or audit.
2. **Confirm tension shape.** Member-vs-platform, one-vs-many, or none. If none, exit with note: "no dialectic needed, route to `pipeline-review`."
3. **Invoke advocates.** Run `pipeline-member-advocate` and `pipeline-platform-advocate` per their skills. Collect bullets.
4. **Apply Gate 1.** Survival check, with reasoning.
5. **Apply maximization.** Net benefit reasoning, with reasoning.
6. **Determine outcome.** One of the four. If Revise, draft proposed wording. If Defer, state trigger.
7. **Produce review record** in the output format below.

## Output format

Produce this inline. Concise. The PM reads it and decides.

```markdown
## Absolute under review
{statement, with source — spec path or scenario F###}

## Mode
Proposed | Audit

## Tension shape
Member-vs-platform | One-Member-vs-many-Members | None

## Three views
- **Member view (individual):** {bullet from member-advocate}
- **Member view (community):** {bullet from member-advocate — only if one-vs-many}
- **Platform view:** {bullet from platform-advocate}

## Gate 1 — Platform survival
Pass | Fail | {one-line reason}

## Net member benefit
Net positive (both lenses) | Net positive (one lens, no significant harm to other) | Mixed (significant harm to one lens) | Net negative | Cannot resolve without further signal

{one-line reason}

## Recommended outcome
Ratify | Revise | Defer | Reject  (Mode A)
Keep   | Revise | Defer-and-soften | Remove  (Mode B)

### If Revise
**Proposed wording:** {minimal edit that preserves Member protection AND passes Gate 1}

### If Defer
**Trigger:** {specific, observable signal that re-opens the decision}
**Fallback horizon:** {date or bundle gate}
**Interim posture:** {what the platform does in the meantime — typically the protective default}

### If Reject / Remove
**Reason:** {why this absolute fails the rule with no acceptable revision}

## PM action requested
Ratify recommendation | Override (with cause) | Hold for more input | Schedule for {trigger}
```

## Audit mode specifics

When auditing an existing agent-authored absolute, add one section at the top:

```markdown
## Provenance
Authored by: {agent name / unknown}
Date: {if recoverable}
Originating context: {scenario / spec / journal entry}
Was this ratified by the PM, or has it been operating as a de-facto absolute?
```

Distinguish **PM-ratified** absolutes (must clear a higher bar to remove — has standing) from **de-facto** absolutes (agent-introduced, never explicitly approved — can be removed on clear Gate-1 fail or significant member harm without prejudice).

For batch audits, produce one record per absolute. Sort the output: rejects/removes first, defers second, revises third, ratifies/keeps last. This puts attention where it belongs.

## Constraints (hard)

- **No scalar scores.** Surface tension texture, not numbers. The advocates' bullets carry the texture; flattening them defeats the purpose.
- **No deferral without a trigger.** "Decide later" without an observable signal is a punt. Refuse and force the trigger conversation.
- **No Gate-1 deferral.** If ratifying would kill the platform, deferring doesn't save it. Revise or reject.
- **No file writes by default.** Inline output to the PM. The PM may request a written record in `planning/DECISIONS.md` or the relevant spec banner; do that only on explicit ask.
- **Override always available.** The skill recommends; the PM can override any step. Log the override reason if the PM chooses to write the record.

## Pairing

Invokes `pipeline-member-advocate` and `pipeline-platform-advocate`. Both must produce bullets before this skill applies the rule. Never short-circuit by skipping an advocate.

## Hand off

**Default:** inline review record consumed by the PM.

**On PM request:** the review record is written to one of:
- The relevant spec's "Policy posture" or "Decisions encoded here" section (single-system decisions)
- `planning/DECISIONS.md` as an ADR (cross-cutting decisions)
- A defer log (forthcoming — `planning/DEFERRED.md` or equivalent) for deferred absolutes, indexed by trigger so re-entry is automatic when the trigger fires

## Related skills

- `pipeline-member-advocate` — produces the Member view bullet(s)
- `pipeline-platform-advocate` — produces the Platform view bullet
- `pipeline-clarify-absolutes` — upstream surfacer of tension; this skill is its downstream decision-applier
- `pipeline-review` — for non-absolute architecture review
- `pipeline-router` — call this if you're unsure whether the statement is an absolute at all
