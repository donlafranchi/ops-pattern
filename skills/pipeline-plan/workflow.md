# pipeline-plan — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `product/foundation/*` (mandatory: `canonical-examples.md`, `loops.md`, `primitives.md`), `product/systems/`, `product/capabilities/`, `planning/bundles/{active}.md` |
| **Writes** | `planning/scenarios-backlog/F{NNN}-{persona}-{verb}-{object}.md`, `planning/bundles/` |
| **Templates** | `templates/scenario.md` (user-story shape — required), `templates/bundle.md` |
| **Does NOT read** | `web/` (code), `development/tickets/`, `planning/scenarios/` (modify-wise — read for reference only) |
| **Calls in** | `planning-filter` (Anthropic) for sprawling-backlog ranking |
| **Hands to** | PM for review → `pipeline-eval` (write mode) and `pipeline-ticket` |

## What you read first (every time)

1. **`product/foundation/canonical-examples.md`** — the working set of real situations the platform exists to serve. Every scenario must anchor here.
2. **`product/foundation/loops.md`** — the 13 loops. Every scenario must serve at least one.
3. **`product/foundation/primitives.md`** — Person / Item / Location / (optional) Community. Every scenario must respect these primitives.
4. **`product/foundation/people-first.md`** — the no-Business-entity / no-pay-for-visibility / no-engagement-feed / no-auto-Community rules. Every scenario must survive these four refusals. If the scenario asks the platform to treat a Business as more important than the people doing the work, reject before writing acceptance criteria.
5. **`product/foundation/policy-framework.md`** — three-filter test, opt-out default. Required reading before approving any scenario that touches privacy, monetary flow, data sharing, agent permissions, or visibility.
6. **`planning/bundles/{active-bundle}.md`** — the current scope. Anything outside the active bundle is deferred, not denied.
7. **`product/systems/{relevant-system}.md`** — the technical spec for the system the scenario touches.

## What you do NOT read
- `web/` (or `{app}/`) — code. The build agent's domain.
- `development/tickets/` — ticket writer's domain.

## The 5 Deadly Sins filter

Apply to every system before approving scenarios from it:

1. **Scope Creep** — cut anything not core to the active bundle's hypothesis.
2. **Gold Plating** — reject over-engineering or perfectionism that delays shipping.
3. **Missing Requirements** — flag underspecification before it reaches dev. If the persona, surfaces, or data captured are vague, the scenario isn't ready.
4. **Unrealistic Schedules** — sequence work in achievable increments. A scenario that produces 5+ tickets is too big — split.
5. **Poor Communication** — every scenario must be unambiguous. If it reads as "the user opens /new and selects a kind," the data primitive leaked into the UX. Rewrite.

## Workflow

1. **Identify the canonical example.** What real person from `canonical-examples.md` does this scenario serve? Name them. If no example fits, escalate to `pipeline-product` to add one — do not invent a hypothetical "user."
2. **Identify the loop(s).** Which of the 13 loops does this exercise? If you can't name one, the scenario doesn't serve a north star.
3. **Identify the surface.** Where in the app does the persona start? Name a real surface (venue page, Maker page, home feed) — NEVER `/new` with a kind picker.
4. **Identify the primitive shape.** Person → Item(kind=…) → Location(…). If the scenario doesn't fit the primitives, escalate to `pipeline-product`.
5. **Write the scenario** in `planning/scenarios-backlog/F{NNN}-{persona}-{verb}-{object}.md` using `templates/scenario.md`.
6. **Apply the 5 Deadly Sins filter.** Cut, simplify, or escalate.
7. **PM reviews.** PM moves to `planning/scenarios/` when ready.

## When to invoke `planning-filter`

If the user hands you a wishlist of capabilities or you're scoping a new bundle, invoke the Anthropic-provided `planning-filter` skill *before* writing scenarios. It turns sprawl into a ranked, testable set. Then write user-story scenarios for the surviving items.

Skip `planning-filter` when you're writing a single scenario for a known feature — it's a backlog-pruning tool, not a per-scenario tool.

## Scenario naming

- **Feature numbers** are sequential, never reused: F001, F002, ... F0NN. Check both `planning/scenarios/` and `planning/scenarios-backlog/` for the highest number.
- **Filename:** `F{NNN}-{persona}-{verb}-{object}.md` — verb is the *user's* verb, not the system's.
  - Good: `F018-brian-declares-run-club.md`
  - Bad: `F018-item-composer.md` (feature-shaped — leaks the data primitive)
- **One feature, multiple scenarios:** reuse the F-number with different persona+verb+object slugs for distinct beats.
- **Title format:** `# F{NNN}: {Persona} {does the thing}`

## Lifecycle

- New scenarios → `planning/scenarios-backlog/`.
- PM approves → moves to `planning/scenarios/`.
- Never write directly to `planning/scenarios/` — everything goes through backlog first.
- Superseded scenarios → `planning/scenarios-backlog/archive/` with a one-line note in the new scenario explaining what it replaced.

## Writing guidelines

- **WHO, WHAT, WHY, not HOW.** "Brian arrives at Drake's venue page and taps 'Host something here'" — yes. "Render a kind-picker component on /new" — no.
- **Testable means testable.** Every Then clause must be verifiable by an automated test or human reviewer. "Has a good experience" is not testable. "A primary CTA labeled 'Host something here' is visible below the venue header" — that's testable.
- **One persona, one journey, one file.** Multiple distinct beats of the same feature → separate files with the same F-number, different slugs.
- **Bundle tagging required.** Every scenario declares its bundle (b1/b2/b3).
- **Surface beats schema.** The Surfaces section is required. If you can name the data fields but not the entry point, you're writing a system spec, not a scenario.

## Hand off

**You produced:** a scenario in `planning/scenarios-backlog/`.

**You hand to:** the PM, who reviews and either approves (moves to `planning/scenarios/`) or rejects (annotates and leaves in backlog or archives).

**Once approved, the next skill is `pipeline-ticket`**, which breaks the scenario into implementable tickets. In parallel, `pipeline-eval` (write mode) writes Playwright tests from the scenario before `pipeline-build` starts.
