# F{NNN}: {Persona} {does the thing}

**Bundle:** b1 / b2 / b3
**Sub-bundle:** b{N}.{M} (e.g. `b1.3`) — must match a sub-bundle in `planning/bundles/bundle-themes.md`. Scenarios outside the active sub-bundle stay in `scenarios-backlog/`.
**Work-map item:** {The 🟢 / 🟡 line from `b{N}-work-map.md` this scenario realizes — e.g. "b1.3 → 🟢 Gathering composer"}
**Loops:** {Loop number(s) from product/needs/member-journey.md}
**Canonical example:** {name + link to product/needs/use-cases.md#section}
**Primitive shape:** {Person → Item(kind=…) → Location(…), per product/foundation/primitives.md}
**Status:** backlog

> **Why this shape?** A scenario is a real person trying to accomplish a real thing. The data model is invisible to them. If a scenario reads as "the user opens `/new` and selects a kind from a picker," the data primitive has leaked into the UX and the ticket writer will build the wrong surface. Anchor on a real person doing a real thing — the surface, the data, and the absence of a wrong picker fall out of the story.

## The Person

{Real or composite name from canonical-examples.md.} {One paragraph: what they want, why, what they do today instead. Concrete language — never "the user."}

## The Story

{2–4 paragraphs describing the persona's path through the platform. Concrete. No data-model jargon. The reader should be able to picture the screens, the buttons, the moment of arrival.}

## Surfaces

- **Entry point:** {Where the persona starts. Name a real surface — venue page, Maker page, home feed. NOT "/new."}
- **Primary action:** {The button label as the persona sees it. Verb-first, surface-anchored — "Host something here," not "Create Item."}
- **Composer / interaction:** {What appears when they take the primary action. Fields, not a kind picker. The surface picks the kind.}
- **Completion:** {Where they land after success. The shareable artifact, if any.}
- **Discovery:** {Where this Item shows up for other people — locality index, follower notifications, venue page, hashtag pages.}

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| {how the persona thinks of it} | {`table.column` from product/systems/} | yes / optional |
| {…} | {…} | … |

Implicit (set by the surface, not asked of the user): {`items.kind = …`, `items.member_id = …`, `state = …`, `item.created` event, etc.}

## Acceptance Criteria

### {Story beat 1 — short heading}

**Given** {persona's starting state, in their terms}
**When** {the action they take}
**Then** {the observable outcome — what they see, what gets created, where it appears. Specific. Testable.}

### {Story beat 2}

**Given** {…}
**When** {…}
**Then** {…}

{Repeat for each distinct beat in the story.}

## Edge Cases

- **{Failure mode in user language}:** {what should happen}
- {…}

## Assumptions

- {Dependency on another scenario or system — name the F### or the system file}
- {Technical assumption the build agent needs to know — auth, prior data, infra}

## Out of Scope

- {Deferred capabilities — name the bundle they'd land in (b2, b3) and link to that bundle file}
