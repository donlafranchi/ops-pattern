---
id: how-idea-intake
purpose: Paste-in template producing pipeline artifacts from raw ideas.
layer: how
status: active
---

# Idea Intake Template

Paste this into any Claude conversation that's exploring an idea for **movers-makers-shakers**. It captures the conversation output in a shape the project pipeline can consume.

## How the pipeline consumes this

```
Idea conversation → exploration / capabilities / systems → backlog → next → tickets → code
                    (this template fills these)            (PM-driven)         (Ticket Writer agent)
```

**Produce in upstream chats:**
- `exploration` (raw, freeform — start here if unclear)
- `capability` (one atomic user-facing action)
- `system` (tiered T1/T2/T3 technical spec — this is the heaviest, most reusable artifact)
- `scenario` (Given/When/Then — only if the system + capability already exist)

**Do NOT produce in upstream chats:**
- Tickets — the Ticket Writer agent generates these from APPROVED scenarios. Stop at scenarios.
- Code — the Build Agent owns this.

## Required guardrails (must include in every artifact)

1. **North star** — name which of the five it serves. If you can't name one, kill the idea or escalate. See `product/foundation/north-stars.md`.
2. **Bundle target** — `b1` (MVP), `b2`, `b3`, or `unbundled` (not yet scheduled).
3. **Data model implications** (systems only) — list tables/columns/event-sourcing patterns to add at MVP even if features are deferred. Retrofit is the failure mode.
4. **Pro-competition language** — see CLAUDE.md "Language & Framing" table.

---

## Template 1 — Exploration (raw idea)

File: `product/exploration/{slug}.md`

```markdown
# Exploration: {Title}

**Status:** Raw — not yet a capability or system
**North star served:** {1–5, name it}
**Spawned from:** {chat date / source / who}

## The idea in one paragraph

{What it is, who it's for, why now.}

## Why this might matter

{Connection to mission, what unlocks if we build it.}

## Open questions

- {question}
- {question}

## Possible shapes

{Could be a capability under {system}, could be a new system, could be vertical-specific…}

## Next step

{e.g. "Promote to capability + draft system spec" or "Park until b2"}
```

---

## Template 2 — Capability (atomic user-facing action)

File: `product/capabilities/{slug}.md`

One capability = one thing a user can do. Keep it small. If it has tiers, it's a system, not a capability.

```markdown
# Capability: {Name}

**Description:** {One sentence. What the user can do, in plain language.}

**Bundles:** {b1 | b2 | b3}

**North star served:** {1–5}

**User Story:**
As a {persona}, I want to {action}, so that {outcome}.

**Scope:**
- {bullet}
- {bullet}

**Out of Scope:**
- {bullet} ({which bundle if deferred})

**Related Capabilities:**
- {capability slug}
- {capability slug}

**Related Systems:**
- {system slug}
```

---

## Template 3 — System (tiered technical spec)

File: `product/systems/{slug}.md`

The most important artifact. Captures T1/T2/T3 evolution and forward-looking data model.

```markdown
# System: {Name}

**Purpose:** {One sentence — what this system does for users + business.}

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

**North stars served:** {1–5, can be multiple}

## T1 — MVP Tier

- {capability bullet}
- {capability bullet}
- {capability bullet}

## T2 — Core Tier

- {what gets added in b2}

## T3 — Polish Tier

- {what gets added in b3}

## Data model implications

> **Required.** List tables, columns, and event-sourcing patterns to add at MVP even if features are deferred to T2/T3. Retrofit is the failure mode that kills small platforms.

- Table `{name}`: columns `{col1}`, `{col2}`, `created_at`, `updated_at`, `deleted_at` (soft delete)
- Event log: `{event_type}` with `{payload shape}`
- Forward-looking: `{column}` (used by T2 {feature})

## Integration Points

- Connects to: {other systems}
- Used by: {surfaces / pages}

## Open questions

- {question that PM/planning must resolve before scenarios get written}
```

---

## Template 4 — Scenario (Given/When/Then)

File: `planning/backlog/scenario-F{NNN}-{slug}.md`

Only write scenarios once the relevant system + capability exist. Scenarios live in `planning/backlog/` until the PM approves them into `planning/next/`.

```markdown
# Scenario: {Feature} — {Specific behavior}

**Feature:** F{NNN} ({system path}, {system path})
**Severity:** {Critical | High | Medium | Low}
**Bundles:** {b1 | b2 | b3}

## Acceptance Criteria

### Given
- {precondition}

### When
- {trigger}

### Then
- {observable outcome}
- {observable outcome}

## Edge Cases

- {case}: {expected behavior}

## Assumptions

- {assumption}

## Comments

{Design rationale, links to design-language.md / community-platform.md patterns referenced.}
```

---

## What the upstream chat should ask the user before producing artifacts

Before generating any artifact, the chat should confirm:

1. **Which north star does this serve?** (If unclear, stop and ask.)
2. **What bundle is this targeting?** (b1 / b2 / b3 / unbundled)
3. **Is this a new system, an extension of an existing one, or a single capability?**
4. **What's the smallest version that proves the hypothesis?** (Forces T1 thinking.)
5. **What gets retrofit-locked if we don't capture it now?** (Forces data model thinking.)

If any of these don't have answers, produce a `Template 1 — Exploration` document instead of jumping to system/capability.

---

## Output handoff

When the upstream chat is done, the user should be able to copy each generated artifact directly into:

| Artifact | Destination |
|---|---|
| Exploration | `product/exploration/` |
| Capability | `product/capabilities/` |
| System | `product/systems/` |
| Scenario (draft) | `planning/backlog/` |

Then add a `JOURNAL.md` entry at the project root noting what came in and from where.
