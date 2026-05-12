# F018 pipeline walk-through — capability to eval-run, with the drops surfaced

**Purpose.** Trace one feature end-to-end through the rewired pipeline, producing a real artifact at every stage, so we can see exactly what each role consumes, what it produces, and what gets dropped between roles.

**Subject.** F018 — *Brian declares the Run Club at Drake's*. Recurring gathering at a permanent venue. Loops 1 + 4. Bundle b1.

**Status.** All artifacts referenced below exist. The walk-through is reproducible: any role in the pipeline can pick up at the next stage and continue.

---

## The trace at a glance

```
Stage 0  product   →  product/capabilities/event-host.md
                       product/systems/item.md  (T1 already covers most of it)

Stage 1  plan      →  planning/scenarios-backlog/F018-brian-declares-run-club.md
                       (PM approves and moves to scenarios/)

Stage 2  review    →  planning/reviews/F018-review.md
                       VERDICT: EXTEND (two small doc additions before ticket)

Stage 2a product   →  product/systems/item.md (extended: item.published semantics,
                                                hashtag autocomplete endpoint,
                                                discoverable_items refresh trigger)
                       product/ui/design-language.md (extended: Venue page surface
                                                                pattern, Recurrence
                                                                picker component)
                       [QR PDF format extension removed 2026-05-08 — QR is
                        vendor-booth-only; gatherings share by URL]
                       Status: ✅ all five additions landed 2026-05-08

Stage 2b review    →  re-review F018 → VERDICT: PROCEED ✅

Stage 3a eval-write→  web/evals/features/F018-brian-declares-run-club.spec.ts
                       (from scenario only; never reads tickets or code)

Stage 3b ticket    →  T036 — item.published event + view refresh
                       T037 — venue-page primary CTA
                       T038 — gathering composer + publish flow
                       T039 — Item page + share-link affordance
                       T040 — gathering surfaces in venue page + locality index

Stage 4  build     →  web/ code + unit tests, ticket Completion sections,
                       BUILD-LOG.md updates, one commit per ticket

Stage 5  eval-run  →  web/evals/results/F018-2026-MM-DD.md
                       Verdict: PASS or FAIL → fix-forward or escalate
```

---

## Stage 0 — Product (capability + system)

### What this stage produces

A user-facing capability + a tiered system spec that supports it.

### Artifacts

- **Capability:** [`product/capabilities/event-host.md`](../../product/capabilities/event-host.md) — *what a Member can do* (host a gathering at a known venue), surface-anchored, with deferrals named.
- **System:** [`product/systems/item.md`](../../product/systems/item.md) — already exists; T1 covers spine + `item_gatherings` child + `item_locations` join + `item_hashtags` + `item_events` + `discoverable_items` view.

### Inputs the role consumes

- `product/foundation/canonical-examples.md` — Brian + Run Club is example #1.
- `product/foundation/loops.md` — Loops 1 (Find your people), 4 (Gather regularly).
- `product/foundation/primitives.md` — Person → Item(kind=gathering) → Location.
- `product/foundation/people-first.md` — surface-shaped, not data-model-shaped.

### What this stage explicitly does NOT produce

- Tickets. Schemas. Code. Tests. Scenarios.

### Hand-off

To `pipeline-plan` — write the user-story-shaped scenario.

---

## Stage 1 — Plan (scenario)

### What this stage produces

A user-story-shaped scenario in `scenarios-backlog/`, ready for PM approval.

### Artifact

- [`planning/scenarios-backlog/F018-brian-declares-run-club.md`](../scenarios-backlog/F018-brian-declares-run-club.md) — Persona, The Story, Surfaces, Data Captured, BDD Acceptance Criteria, Edge Cases, Assumptions, Out of Scope.

### Inputs the role consumes

- The capability from Stage 0.
- `product/systems/item.md` (read fully, write nothing).
- `product/ui/design-language.md` (referenced — surfaces named in user-language).
- `planning/bundles/b1-primitives.md` — confirms F018 is in scope for b1.

### Filter applied

The 5 Deadly Sins. F018 specifically tests:

- **Scope creep** — RSVP, photo upload, multi-occurrence cancel are deferred to b2 and named in Out of Scope. ✓
- **Gold plating** — push notifications are b2 (email-only at b1 elsewhere; F018 doesn't notify at all). ✓
- **Missing requirements** — Surfaces section names every entry point and discovery path. Data Captured table maps user-language fields to schema columns. ✓
- **Unrealistic schedules** — produces ~5 tickets, fits the b1 schema floor. ✓
- **Poor communication** — uses Brian's name and Drake's name; no abstract "user." ✓

### What this stage explicitly does NOT produce

- Tickets, code, tests, schema changes, design components.

### Hand-off

To **PM** for approval. PM moves the file from `scenarios-backlog/` → `scenarios/`. Then to `pipeline-review` (optional but recommended for a scenario that touches multiple systems).

---

## Stage 2 — Review (architecture + design pre-flight)

### What this stage produces

A review document with a verdict (PROCEED / REVISE / EXTEND) and recommendations the ticket writer will read.

### Artifact

- [`planning/reviews/F018-review.md`](../reviews/F018-review.md) — full architecture + design check.

### Verdict

**EXTEND** — three small additions to `product/systems/item.md` and three to `product/ui/design-language.md`. ~30 minutes of doc work each.

### What the review caught (the drops Stage 1 missed)

| Drop | Where it surfaced | Disposition |
|---|---|---|
| New event type `item.published` not in `item.md` | Architecture check | EXTEND `item.md` event list |
| Hashtag autocomplete endpoint not in `item.md` | Architecture check | EXTEND `item.md` API surface |
| `discoverable_items` refresh trigger not in `item.md` | Architecture check | EXTEND migration spec |
| Venue-page primary CTA pattern missing from `design-language.md` | Design check | EXTEND `design-language.md` |
| Recurrence picker component missing from `design-language.md` | Design check | EXTEND `design-language.md` |
| ~~QR PDF format/layout unspecified~~ | Design check | **Resolved 2026-05-08** by scope change — QR removed from gathering scope (vendor-booth only); replaced with share-link affordance using existing button pattern |
| Loading state during composer submit not in scenario | Design check (minor) | Recommend ticket include |
| Network failure on publish not in scenario | Design check (minor) | Recommend ticket include |

**This is the value of the review stage.** Without it, every one of these decisions would have been made implicitly by the build agent at TDD time, baked into code, and locked in. Several would have produced inconsistent UX (each ticket inventing its own loading state) or invisible architectural drift (publish event named differently in three places).

### Inputs the role consumes

- The approved scenario.
- All `product/systems/{name}.md` the scenario touches.
- `product/ui/design-language.md`.
- `planning/DECISIONS.md` (existing ADRs).
- `planning/bundles/{active}.md`.

### What this stage explicitly does NOT produce

- Edits to the scenario. Edits to the systems. Tickets. Code. Tests.

### Hand-off

- **EXTEND** → back to `pipeline-product` to extend `item.md` and `design-language.md`. Then back here for re-review.
- **PROCEED** (after the EXTEND resolves) → to `pipeline-eval` (write mode) and `pipeline-ticket` in parallel.

---

## Stage 2a — Product extends the docs (because the review verdict was EXTEND)

### What this stage produces

Targeted additions to existing system + design docs. Not new files; section additions.

### Artifacts

- `product/systems/item.md` — adds:
  1. `item.published` to the event-type list, with semantics (fired when state moves draft → published, drives discovery refresh and follower fan-out).
  2. `GET /api/hashtags/suggest?q={prefix}` — autocomplete endpoint, capped result count, requires non-empty prefix.
  3. `discoverable_items` materialized view refresh — synchronous trigger on `item.published` at b1; switch to async at T2.
- `product/ui/design-language.md` — adds:
  1. **Venue page** section: header layout + primary-CTA placement (button below header, label "Host something here", uses `<PrimaryButton>`).
  2. **Recurrence picker** component: friendly UI generates RRULE string.
  3. ~~**QR PDF format** for an Item page~~ — removed 2026-05-08: QR is vendor-booth-only. The Item page uses a "Share link" affordance (clipboard + native share sheet) which reuses the existing button pattern; no design-language extension needed.

### Time cost

~30 minutes per doc — small. Strictly cheaper than discovering each gap individually during build and patching after the fact.

### Hand-off

Back to `pipeline-review` — re-review F018 with the extended docs in hand. Verdict expected: **PROCEED**.

---

## Stage 3a — Eval write (Playwright spec from the scenario)

### What this stage produces

One spec file per scenario, mirroring the BDD beats. Written from the scenario only; the eval writer never reads tickets or code (this firewall is what makes the spec a trustworthy oracle).

### Artifact

- [`web/evals/features/F018-brian-declares-run-club.spec.ts`](../../web/evals/features/F018-brian-declares-run-club.spec.ts) — six describe blocks, one per story beat, each with a `Given | When | Then` test.

### What the eval writer assumes about the app

Only what the scenario says. Specifically:

- Drake's exists at `/l/drakes-the-barn` with `kind=permanent`.
- The composer is a drawer (mentioned in the scenario indirectly — design check confirmed).
- A test reset endpoint exists at `/test/reset?seed=f018` — if it doesn't, the eval writer escalates to `pipeline-plan` to add fixture handling to the scenario's Assumptions section.

### What the eval writer does NOT do

- Read `web/src/`. Doesn't know how `<GatheringComposer>` is implemented.
- Read `development/tickets/`. Doesn't know about T036–T040.
- Add `data-testid` attributes — uses semantic selectors (`getByRole`, `getByLabel`). If a test becomes flaky, *the build agent* adds the data-testid; the spec doesn't change.

### Hand-off

To `pipeline-build` — implements without seeing this spec.

---

## Stage 3b — Ticket (break the scenario into ordered units)

### What this stage produces

Five tickets, sequenced by dependencies. Each ticket references the scenario AND the review.

### Artifacts

| Ticket | What | Depends on |
|---|---|---|
| [T036](../../development/tickets/T036-item-published-event-and-refresh.md) | `item.published` event + `discoverable_items` refresh trigger + `publish_item()` SQL function | Phase-1 schema (T030–T035) |
| [T037](../../development/tickets/T037-venue-page-host-cta.md) | `/l/[slug]` venue page primary CTA "Host something here" | design-language EXTEND |
| [T038](../../development/tickets/T038-gathering-composer.md) | Gathering composer drawer + publish flow + autocomplete endpoint | T036, T037 |
| [T039](../../development/tickets/T039-item-page-and-qr.md) | `/i/[slug]` rendering + `<NextOccurrence>` helper + share-link affordance (QR PDF action removed 2026-05-08) | T038 |
| [T040](../../development/tickets/T040-gathering-discovery-surfaces.md) | "What's happening here" on venue page + "this week" filter on locality index | T036, T037–T039 |

### Inputs the role consumes

- The approved scenario.
- The review document — tells it which existing components to reuse, which gaps to flag, which decisions to add to `DECISIONS.md`.
- Existing tickets in `development/tickets/` (for T-numbering).
- `product/systems/item.md` — only the "Data model implications" section.

### Sizing test

Five tickets. Each is one cohesive commit's worth. None is a 5+ scenario by itself. Sizing rule (escalate if 5+ tickets per scenario) is not triggered, but we're at the edge — if a sixth ticket emerged, we'd consider whether to split F018 into two smaller scenarios.

### Hand-off

To `pipeline-build` — implement each ticket via TDD, in dependency order.

---

## Stage 4 — Build (TDD execution, ticket by ticket)

### What this stage produces

Working code, unit tests, an updated ticket Completion section, and a one-line commit per ticket.

### Worked example: T036

The build agent reads:
- `T036-item-published-event-and-refresh.md` — the ticket.
- `F018-brian-declares-run-club.md` — the scenario it serves.
- `product/systems/item.md` — Data model implications section only.
- `BUILD-LOG.md` — current state.

The build agent does NOT read:
- The Playwright spec at `web/evals/features/F018-brian-declares-run-club.spec.ts`.
- Other tickets that reference this scenario.
- `planning/scenarios-backlog/`.

TDD loop:
1. Write a failing migration test: `publish_item` doesn't exist yet → red.
2. Write the migration: add `item.published` to the event enum, write the SQL function, write the trigger.
3. Run migration tests → green.
4. Write a failing integration test: insert draft item, call `publish_item`, assert state changed + event row + view refreshed → red (function exists, but trigger isn't refreshing) → fix trigger → green.
5. Update T036 Completion section with date + commit hash.
6. Move T036 to `development/tickets/done/`.
7. Update `BUILD-LOG.md`.
8. Commit: `T036: item.published event + discoverable_items refresh trigger`.

### Hand-off

To `pipeline-eval` (run mode) — verify F018 evals pass against the new build.

---

## Stage 5 — Eval run (verify against the scenario)

### What this stage produces

A pass/fail report at `web/evals/results/F018-{YYYY-MM-DD}.md`, with each Given/When/Then traced to its outcome.

### Worked example

After all five tickets land, the eval runner executes the F018 spec:

```bash
npm run eval -- --grep "F018"
```

For each test in the spec, the report names:
- The story beat heading (from the scenario).
- Pass / fail / skipped.
- For failures: the exact assertion that failed and the observed value.

### Hand-off

- **PASS** → PM picks the next scenario or ticket. Loop closes.
- **FAIL where the implementation is wrong** → `pipeline-build` fixes forward. Never roll back. Never silently update the test.
- **FAIL where the scenario is wrong** → `pipeline-plan` revises the scenario; cycle restarts at Stage 2 (re-review with the new scenario).

---

## Drops surfaced by this walk-through

The pipeline drops things at every stage if the role's firewall is doing its job. Here's what specifically gets dropped where, and why each drop is intentional or a real gap to fix.

### Intentional drops (information lost on purpose)

| Stage | What the next role doesn't see | Why |
|---|---|---|
| Plan → Eval-write | The product system spec details (kind/child-table mapping). | Eval-write tests user-observable behavior, not implementation. |
| Plan → Ticket | The discovery scoring formula. | Ticket writer sequences, doesn't redesign discovery. |
| Review → Eval-write | The review document. | Eval-write only consumes the scenario — review's component recommendations are for the ticket writer, not the test oracle. |
| Ticket → Build | Other tickets in the F018 set. | Build does one ticket at a time. |
| Eval-write → Build | The eval spec itself. | Build writes its own unit tests against the ticket's checklist; the eval spec is an external oracle, hidden from build. |

### Real gaps surfaced (things that were getting dropped without intent)

This walk-through revealed seven concrete drops the rewired pipeline now catches:

1. **`item.published` event was implicit in F018, not declared in the system spec.** Caught by `pipeline-review`. Without review, the build agent would have invented an event name on the fly.
2. **`discoverable_items` refresh trigger was assumed, not specified.** Caught by review. Without it, the 60-second SLA in F018 would have been a flaky test.
3. **Hashtag autocomplete endpoint was in the scenario but not in any system spec.** Caught by review. Without it, the build agent would have invented an endpoint shape (parameters, response shape, rate limits) that nothing else in the system would conform to.
4. **Venue-page primary CTA pattern missing from `design-language.md`.** Caught by review. Without it, two future scenarios (Maker page, Community page) would invent their own venue-CTA styles, fragmenting the design.
5. **Recurrence picker component missing from the design system.** Caught by review. Without it, the build agent would have built a one-off picker for F018 and a different one for F019/F020 if they need scheduling.
6. ~~**QR PDF format unspecified.**~~ **Resolved 2026-05-08 by scope change.** QR is now vendor-booth-only; gatherings share by URL via a "Share link" affordance. The original review correctly flagged the gap; the gap was closed by removing the requirement, not by extending the spec.
7. **Loading + network-failure states absent from F018.** Caught by review (minor). Without flagging, build's TDD would skip them or implement inconsistently.

### Drops the pipeline still doesn't catch (gaps in the rewired pipeline itself)

A handful of concerns slip through every stage:

- **Cross-feature consistency.** F018 + F019 + F020 each works independently, but no skill checks that the three together produce a coherent set. (E.g., F018's `<GatheringComposer>` and F019's `<DropComposer>` should share a base — nobody's role is to notice that.) **Suggested fix:** add a "scenarios bundle review" trigger to `pipeline-review` for any 2+ scenarios in the same loop family.
- **Performance budget.** F018 says "appears within 60 seconds" but no skill is responsible for a system-wide perf budget (page load, query times, view refresh latency). **Suggested fix:** extend `pipeline-review` architecture check to surface perf SLAs that the scenario implies and verify the system spec accommodates them.
- **Accessibility.** No skill explicitly checks scenarios or designs against accessibility requirements (keyboard navigation, screen reader, color contrast). **Suggested fix:** add an a11y subsection to the `pipeline-review` design check.
- **Internationalization.** All copy is English-first; no skill flags i18n implications (date formatting, recurrence rule rendering across locales, RTL). **Suggested fix:** flag in design check for any scenario with user-facing copy or date rendering.
- **Migration safety.** `pipeline-build` follows TDD but no skill explicitly checks that migrations are reversible, backfill-safe, or compatible with concurrent writes. **Suggested fix:** wire the Anthropic `security-review` skill into `pipeline-build` for any ticket touching migrations.
- **Release notes / external comms.** After eval-run passes, nothing produces user-facing release notes or marketing copy. **Suggested fix:** optional `pipeline-release` skill that consumes the F### + ticket set + eval results and drafts release notes.

---

## How to read this walk-through next time

When the next scenario goes through (F019, F020, or a new persona), re-run this exercise:

1. Trace the scenario through every stage.
2. Identify what each stage produces and what it drops.
3. Check whether the drops are intentional (firewall serving its purpose) or accidental (real gaps).
4. For accidental drops, propose either a workflow change to an existing skill or a new stage / skill.

This walk-through doc itself is a living artifact. Update it when the pipeline shape changes, when a new drop is found, or when a new role is added.

---

## See also

- [`AGENTS.md`](../../AGENTS.md) — the seven roles and their firewalls.
- [`skills/README.md`](../../skills/README.md) — skill list + PM cycle diagram + install command.
- [`JOURNAL.md`](../../JOURNAL.md) — what changed in the pipeline rewire and why.
- [`product/foundation/canonical-examples.md`](../../product/foundation/canonical-examples.md) — the Run Club at Drake's is example #1.
