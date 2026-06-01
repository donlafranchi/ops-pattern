# F{NNN} review — {Persona} {does the thing}

**Scenario:** [`scenario-F{NNN}-{slug}.md`](./scenario-F{NNN}-{slug}.md)
**Reviewer:** review
**Date:** {YYYY-MM-DD}
**Bundle:** b1 / b2 / b3
**Verdict:** PROCEED | REVISE | EXTEND

## Verdict summary

{One sentence. If PROCEED, "fits existing systems and design language with the noted minor recommendations." If REVISE, name what the scenario needs to change. If EXTEND, name what doc needs to grow first.}

**Next skill:** `ticket` (on PROCEED) | `scope` (on REVISE) | `explore` (on EXTEND).

## Architecture check

### Systems touched

- `product/systems/{name}.md` — {how this scenario uses it}
- {repeat for each system}

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | none / list them | {if any: name them and recommend `explore` extend the relevant system spec} |
| New columns required? | none / list them | … |
| New event types required? | none / list them | … |
| Forward-tier impact | clear / flagged | {will any T2/T3 capability be harder after this T1 ships?} |
| Shell-entity smell | clean / flagged | Does any column / relationship / user-facing label introduce an entity that owns Items without being a Person or Community? Names to flag: "vendor," "business," "merchant," "establishment," "operator." If `*_id` columns point to a non-Person/Community entity holding Items, flag EXTEND. |
| Loop fidelity | matched / mismatched | Quote the loop's pain point from `member-journey.md` and write one sentence on how this scenario advances it. If the named loop doesn't match the actual mechanic, flag REVISE. |
| Policy posture present | n/a / present / missing | If the scenario touches privacy / monetary flow / agent permissions / data sharing / visibility, the relevant `product/systems/{name}.md` must carry a Policy posture section per ADR-9. If absent, verdict is EXTEND. |

### Cross-system consistency

- {Each system the scenario touches: does its spec already account for the interaction with the others?}

### Architecture verdict

{PROCEED / REVISE / EXTEND, with a one-line reason.}

## Design check

### Surfaces touched

- `{surface name}` — {existing / new}
- {repeat for each surface}

### Components required

| Component | Exists in design language? | Notes |
|---|---|---|
| {CTA "Host something here"} | yes / no | {if no: recommend adding to `design-language.md` first} |
| {Composer for recurring gathering} | yes / no | … |
| {Item-page share-link affordance} | yes / no | … |

### CTA placement

| Surface | CTA | Established pattern | Match? |
|---|---|---|---|
| Venue page | "Host something here" | {quote design-language section on venue-page primary CTAs} | yes / no |

### Copy & tone

- {Does the scenario's user-facing copy match the voice in root `CLAUDE.md`'s "Language & Framing" section?}

### Empty / loading / error states

- {Does the scenario describe what happens when fields are empty, the network is slow, or the action fails?}

### Design verdict

{PROCEED / REVISE / EXTEND, with a one-line reason.}

## Recommendations for the ticket writer

If verdict is PROCEED:
- {Specific things the ticket writer should know — components to reuse, patterns to follow, edge-case tickets to include.}

If verdict is REVISE or EXTEND:
- {What needs to happen first, who owns it, and the suggested order.}

## Decisions captured

- {Any architectural or design decision this review surfaced that should land as a pattern-doc entry in `playbooks/PLATFORM-PATTERNS.md` (what the platform IS) or `playbooks/DEVELOPMENT-PATTERNS.md` (how we build). Pre-formatted Decision / Intent / Touches snippet if helpful.}
