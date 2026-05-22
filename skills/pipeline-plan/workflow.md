# pipeline-plan — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `product/foundation/*` (mandatory: `canonical-examples.md`, `loops.md`, `primitives.md`), `product/systems/`, `product/capabilities/`, `planning/bundles/{active}.md`, `planning/bundles/bundle-themes.md` (mandatory — sub-bundle sequence), `planning/bundles/b{N}-work-map.md` (mandatory — menu of 🟢/🟡/⚪ work for the active bundle) |
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
7. **`planning/bundles/bundle-themes.md`** — the sub-bundle sequence. Identifies which `b{N}.{M}` is *currently active*. Scenarios for sub-bundles past the active one stay in backlog until the prior sub-bundle ships.
8. **`planning/bundles/b{N}-work-map.md`** — the menu of work for the active bundle, with 🟢 / 🟡 / ⚪ scope tags. Every new scenario must trace to one item on this map. If the scenario doesn't realize a work-map item, either the map needs an entry (escalate to `pipeline-bundle-resync`) or the scenario is out of scope.
9. **`product/systems/{relevant-system}.md`** — the technical spec for the system the scenario touches.

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

1. **Identify the active sub-bundle.** Read `bundle-themes.md` and confirm which `b{N}.{M}` is currently shipping (the next one whose dependencies are all live). Scenarios for later sub-bundles stay in backlog until their turn — write them anyway if useful, but tag them honestly.
2. **Pick the next work-map item.** From `b{N}-work-map.md`, pick a 🟢 (or PM-elevated 🟡) item in the active sub-bundle that does not yet have an F### scenario. One scenario per work-map item; if a work-map item is too big for one scenario, escalate — the work-map item should be split before the scenario is written.
3. **Identify the canonical example.** What real person from `canonical-examples.md` does this scenario serve? Name them. If no example fits, escalate to `pipeline-product` to add one — do not invent a hypothetical "user."
4. **Identify the loop(s).** Which of the 13 loops does this exercise? If you can't name one, the scenario doesn't serve a north star.
5. **Identify the surface.** Where in the app does the persona start? Name a real surface (venue page, Maker page, home feed) — NEVER `/new` with a kind picker.
6. **Identify the primitive shape.** Person → Item(kind=…) → Location(…). If the scenario doesn't fit the primitives, escalate to `pipeline-product`.
7. **Write the scenario** in `planning/scenarios-backlog/F{NNN}-{persona}-{verb}-{object}.md` using `templates/scenario.md`. Fill the `Sub-bundle` and `Work-map item` fields — they are not optional.
8. **Apply the 5 Deadly Sins filter.** Cut, simplify, or escalate.
9. **Gate A — Ratified-Intent precondition (before moving scenario from backlog to approved).** Scan every spec section the scenario cites for absolute-language statements (`Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no X`). For each match, check the line co-located with the bullet:
   - `Intent (Ratified YYYY-MM-DD): ...` or `Intent (Deferred until {trigger}; review by {horizon}): ...` → terminal state. Pass.
   - `Intent: ...` (no parenthetical tag) or no `Intent` line at all → **unratified. Gate A fails.**
   - If Gate A fails, the scenario stays in backlog. Surface the list of unratified absolutes (`file:line` + bullet text) and route to `pipeline-ratify-absolute` for the PM to walk. After ratification, re-run Gate A; on pass, the scenario is eligible for approval.
   - Scope of the scan: only spec sections the scenario *cites or encodes* — not entire foundation docs. A scenario that touches `groups.md § Joining` triggers the gate on that section, not on every absolute in `groups.md`.
10. **PM reviews.** PM moves to `planning/scenarios/` when ready.

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
- **Bundle + sub-bundle tagging required.** Every scenario declares its bundle (b1/b2/b3) AND its sub-bundle (`b1.0`, `b1.3`, etc., from `bundle-themes.md`). Every scenario also names the 🟢/🟡 work-map line it realizes.
- **Surface beats schema.** The Surfaces section is required. If you can name the data fields but not the entry point, you're writing a system spec, not a scenario.

## Co-locate `why` with `what` (per AGENTS.md → PIPELINE-AUDIT F13)

Every non-obvious Given/When/Then clause in a scenario carries its **why** alongside its **what**. Without the *why*, the eval-writer ends up testing the *literal wording* of the clause rather than the *design intent* the clause is approximating — and when the scenario gets revised, the test passes against text that no longer means what the project intends. Same discipline as Intent annotations on system specs (per the [archived intent audit](../../planning/archive/intent-audit-2026-05-12.md), live discipline in the clarify-absolutes / intent-check skills), applied here at the scenario stage.

**Where to apply.** Any clause that encodes a design judgment, not just a mechanical assertion. *"Then the page loads"* is mechanical and obvious — no Why needed. *"Then a primary CTA labeled 'Host something here' is visible below the venue header"* encodes the verb-first composer commitment from `community-platform.md` (entry point is the venue, not `/new` with a kind picker) — needs a Why.

**Format.** Inline italic note immediately after the clause, prefixed `_Why: {one-sentence rationale, anchored to a foundation/system doc or canonical example}._`

**Example.**

> *Without:*
> Then a primary CTA labeled "Host something here" is visible below the venue header.
>
> *With:*
> Then a primary CTA labeled "Host something here" is visible below the venue header. _Why: verb-first composer commitment in `community-platform.md` — the entry point is the venue, not `/new` with a kind picker. Eval should verify the CTA originates on the venue page, not just that the label text appears._

**Verification.** Before handing the scenario to the PM, walk every Then-clause (and any non-obvious Given/When clause). For each one that encodes a design choice, confirm it carries a `Why:` line. If a clause is non-obvious and you can't write the Why in one sentence, the scenario is under-specified — escalate to `pipeline-product` for the missing rationale rather than guessing.

## Hand off

**You produced:** a scenario in `planning/scenarios-backlog/`, with `Why:` annotations on every non-obvious Given/When/Then clause.

**You hand to:** the PM, who reviews and either approves (moves to `planning/scenarios/`) or rejects (annotates and leaves in backlog or archives).

**Once approved, the next skill is `pipeline-ticket`**, which breaks the scenario into implementable tickets. In parallel, `pipeline-eval` (write mode) writes Playwright tests from the scenario before `pipeline-build` starts.
