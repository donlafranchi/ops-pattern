---
purpose: Project router — facts, primitives, naming rules, agent routing, commit rules.
layer: how
status: active
---

# Movers, Makers & Shakers

> Solo founder. Re-architecture in flight. Process lives in skills, not nested CLAUDE.md files.
> First time in this repo? Read this file end-to-end, then [`product/MAP.md`](product/MAP.md) (100k-foot architecture map — one sentence per system), then [`product/TRACE.md`](product/TRACE.md) (feature lineage), then [`REGISTRY.md`](REGISTRY.md) (doc catalog), then [`AGENTS.md`](AGENTS.md), then [`JOURNAL.md`](JOURNAL.md).

## Project Facts

- **What it is:** A coordination layer for collective action in a place. People declare things — products, services, gatherings, ideas — at locations. Other people respond. Farmers markets are the wedge; the platform is broader. **People-first, not business-first.** See [`product/foundation/principles.md`](product/foundation/principles.md).
- **Stack:** Next.js (App Router), TypeScript, Tailwind v4 (`@theme inline` tokens), Supabase (Postgres + Auth + Realtime), Mapbox GL JS, Playwright (evals), Vitest (unit), Vercel.
- **Repo structure:** Two-repo. Parent `movers-makers-shakers/` is local-only (product, planning, development docs). `web/` is a separate git repo pushed to GitHub.
- **App path:** `./web`
- **Active bundle:** [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) (Primitives MVP).
- **Active rebuild:** [`planning/rebuild-plan.md`](planning/rebuild-plan.md) — clean-slate rebuild on Person / Item / Location / Group primitives. Filename retained for git history; the doc is now the rebuild plan, not a migration plan (no live data; no dual-write).
- **Pipeline audit history:** the 2026-05-09 audit was the load-bearing one; its findings live in this file and `AGENTS.md`. The original is archived at [`_attic/2026-05-19/planning/PIPELINE-AUDIT.md`](_attic/2026-05-19/planning/PIPELINE-AUDIT.md) for trace; the 2026-05-22 follow-up audit lives at [`_attic/2026-05-27/2026-05-23-pipeline-coverage/pipeline-process-audit-2026-05-22.md`](_attic/2026-05-27/2026-05-23-pipeline-coverage/pipeline-process-audit-2026-05-22.md) — its R1–R10 findings were absorbed into the pipeline on 2026-05-23 (STAGE-LEDGER, SPEC-PATCHES, JUDGMENT, OPEN-QUESTIONS, the router drift check, the substrate lane, the sibling-scenario check, and the DEVIATIONS rotation policy). Read either only when revisiting process history.
- **Memo home:** [`planning/adrs/`](planning/adrs/) — one file per decision memo (formerly ADR), indexed from [`planning/DECISIONS.md`](planning/DECISIONS.md). Existing ADR-1 through ADR-23 retain numbering for citation stability; new entries use the `memo` skill and continue from memo-0024 onward. Format and lifecycle in [`planning/adrs/README.md`](planning/adrs/README.md).

## North Star — The Loops

Every feature must serve at least one of the 13 loops. Source: [`product/needs/member-journey.md`](product/needs/member-journey.md). Five families, in order: Gathering → Sharing → Trade → Pooling → Federation. Activation energy ascends, belief ascends, stake accumulates.

## The Primitives

Source: [`product/foundation/primitives.md`](product/foundation/primitives.md). Three core + one optional.

- **Person (Member)** — a real human. Holds verbs (makes, services, convenes, follows, pledges). Role-as-verb, not role-as-identity. See [`product/systems/member.md`](product/systems/member.md).
- **Item** — anything declared (product, service, gathering, wonder, offer, ask, initiative). One schema, varying by `kind`. See [`product/systems/item.md`](product/systems/item.md).
- **Location** — a physical place (permanent / recurring-temporary / area). Members hold multi-Location affinities (live, work, play, visit, follow, liked) per `member_location_affinities`. **The anti-Nextdoor commitment lives in messaging-scope (item-or-group only) and complaint downvote/removal — not in absence of Member-Location relationships.** See [`product/systems/location.md`](product/systems/location.md).
- **Group** — a named, intentional, self-selected set of People organized to do things together on the platform. Six kinds at b1: five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) + one operate (`business`). Emergent and optional — never auto-assigned. **Supersedes the prior Community / Member Operations / Cooperative split per the 2026-05-10 Groups ratification.** See [`product/systems/groups.md`](product/systems/groups.md).

**Deliberately no Business entity.** Personal businesses are first-class via kind='business' Groups; corporate shells are not modeled. **Cooperative-style coordination (co-owning, voting, distributing) is deferred indefinitely** — kind='business' Groups with multiple owner-role memberships serve the cooperative-shape use case; the `cooperative_*` schema reservations from the prior ADR-11 are dropped. Same principle for any Group — never owned by a corporate shell, never auto-assigned by geography.

---

## Naming conventions

The platform uses a three-layer naming pattern. Each layer has a distinct purpose; mixing them is the most common source of doc/code drift. The mapping below is load-bearing — when you touch any spec, surface, or copy, match the right layer.

| Schema (durable) | URL (public — place-scoped per ADR-20) | UI label (user-facing) | UI verb (CTAs) |
|---|---|---|---|
| `members` | `/m/[handle]` (global — not place-scoped) | Member · Seller (when ≥1 active kind='business' Group membership or kind='product'/'service' Item) · Producer (ag/food context) | Sign up · Sell · Offer |
| `places` | `/p/[…place path]` | **Place** | — (platform-curated; no Member create surface) |
| `groups` | `/p/[…place path]/g/[slug]` | Group · Shop (kind='business') · Circle (kind='interest'/'practice') | Start a group · Join |
| `locations` | `/p/[…place path]/l/[slug]` | Venue | Add a place |
| `items.kind = 'gathering'` | `…/e/[slug]` | **Event** | Host |
| `items.kind = 'product'` | `…/p/[slug]` | Product | Sell · Share |
| `items.kind = 'service'` | `…/s/[slug]` | Service | Offer |
| `items.kind = 'wonder'` | `…/i/[slug]` | **Idea** | Wonder · Float |
| `items.kind = 'offer'` | `…/o/[slug]` | Offer | Offer up |
| `items.kind = 'ask'` | `…/a/[slug]` | Ask | Ask |
| `items.kind = 'initiative'` | `…/initiative/[slug]` | Initiative | Lead · Start |
| `member_self_records` | n/a (not a public surface) | **Assistant Context** | Edit · Teach |

### Rules

1. **Schema names are durable.** Don't rename `gathering` → `event` or `wonder` → `idea` in code; the URL and UI layers handle the translation. Same with `member_self_record` → "Assistant Context." This isolates schema migrations from naming evolution.
2. **"Declare" is the spec/conceptual verb only.** "Person declares Item" is correct in `primitives.md`, `member-journey.md`, and system specs. UI never says "declare an item" — UI uses the kind-specific verb (Host, Sell, Offer, Wonder, Ask, Lead).
3. **No umbrella word for Items in UI copy.** "Item" is the database term. In the UI, always use the specific kind: Event, Product, Service, Idea, Offer, Ask, Initiative. The Explore tab can use kind-specific filter copy ("Browse events," "Browse what's for sale") rather than "Browse items."
4. **"Seller" is the generic UI term for a Member offering goods or services.** It applies whenever a Member has ≥1 active kind='business' Group membership or has posted an `items.kind='product'` / `'service'` row. There is no `maker_mode_enabled` toggle (dropped per `agent-commerce-and-project-amendments.md` §6, ratified 2026-05-12). **"Producer"** is preferred in the agricultural and food context — used in `producer-tools.md`, `producer-tools.md`, and `platform-promise.md`. **"Maker"** survives only as a UI label when the Member specifically self-identifies as such (craftspeople, artisans); it is not a default role.
5. **Loop names stay conceptual.** Loop 2 is "Wonder," Loop 4 is "Gather regularly." Loop names are durable spec language; they don't migrate to the new UI labels.
6. **URLs are place-scoped (ADR-20).** Every public URL except the Member page nests under a variable-depth place path — `/p/[…ancestor place slugs]/[place slug]`. Groups append `/g/[slug]`, Locations append `/l/[slug]`. Items take the resource segment (`/e/`, `/p/`, `/s/`, `/i/`, `/o/`, `/a/`, `/initiative/`) appended to either their Group's place path (`/p/[…place]/g/[group-slug]/p/[slug]`) or — for Items not filed under a Group — the owner's Member path (`/m/[handle]/p/[slug]`). The Member page (`/m/[handle]`) is the one intentionally global namespace: the handle is the auth identity and must survive relocation. Outer `/p/` (place) and inner `/p/` (product) are positionally unambiguous. Places are platform-curated — there is no Member-facing create surface for a `places` row; the UI label "Place" belongs to `places`, while a specific Location is a "Venue."

### When in doubt

- Writing a spec or doc → use the schema term in code references; use the UI label in prose meant for users.
- Writing a URL → use the URL column.
- Writing UI copy or composer CTAs → use the UI label as the noun and the UI verb as the action.
- Naming a new entity → propose all four columns at once.

### File and directory naming

A separate set of rules from entity naming — these govern *where docs live* and *what they're called*. Anti-sprawl. Enforced by `tidy` and the `orient` drift check.

| Kind | Pattern | Example | Lives in |
|---|---|---|---|
| Active spec / system | `kebab-case.md`, no date | `groups.md` | `product/systems/`, `product/foundation/`, `product/ui/`, etc. |
| ADR | `ADR-NNNN-{slug}.md` (4-digit, zero-padded) | `ADR-0019-clean-slate-rebuild.md` | `planning/adrs/` |
| Scenario | `F###-{slug}.md` | `F018-brian-declares-run-club.md` | `planning/scenarios-backlog/` (draft) → `planning/scenarios/` (approved) |
| Review | `F###-review.md` (or `intent-{slug}-{date}.md` for intent-checks) | `F018-review.md` | `planning/reviews/` (active dir; older reviews archived to `_attic/`) |
| Ticket | `T###-{slug}.md` (no zero-padding) | `T056-items-state-enum.md` | `development/tickets/` (open) → `development/tickets/done/` |
| Bundle plan | `b{N}-{slug}-plan.md` | `b1-primitives-plan.md` | `planning/bundles/` (`status: active`) → `_attic/YYYY-MM-DD-{slug}/` (or `_attic/YYYY-MM-DD-vN-{slug}/` if shipped a user-visible version) |
| Bundle phase / artifact | `b{N}[.{x}]-{slug}-{kind}.md` — kind ∈ {`sprint`, `work-map`, `audit`, `rebuild`, `wrapup`} | `b1.0-foundation-sprint.md`, `b1-primitives-work-map.md`, `b1-primitives-wrapup.md` | `planning/bundles/` (archives with parent bundle) |
| Dated work product | `housekeeping/YYYY-MM-DD-{slug}/` (in-flight) → `_attic/YYYY-MM-DD-{slug}/` (archived on close) | `housekeeping/2026-MM-DD-{slug}/` | `housekeeping/` |
| Retired spec | `_attic/YYYY-MM-DD-{slug}/` with `retired_from:` in frontmatter for provenance (legacy entries under `_attic/YYYY-MM-DD/{original-path}` grandfathered) | `_attic/2026-05-27-community-spec/community.md` | `_attic/` |
| Shipped-version release doc | `RELEASE.md` at root of `_attic/YYYY-MM-DD-vN-{slug}/` + one line per version in `planning/RELEASES.md` | `_attic/2026-MM-DD-v1-primitives/RELEASE.md` | `_attic/` + `planning/` |
| Untriaged | `_inbox/{name}.{ext}` | `_inbox/some-draft.md` | `_inbox/` |
| Audit | `pipeline-process-audit-YYYY-MM-DD.md` (named at root during the audit; **moved to `housekeeping/YYYY-MM-DD-{slug}/` on absorption, then to `_attic/{date}/` on close**) | `pipeline-process-audit-2026-05-22.md` | (transient at root) |
| Pipeline meta (process docs about how to build) | `meta/{slug}/` | `meta/cowork-pipeline/` | `meta/` |
| Skill | `skills/{kebab-name}/SKILL.md` + `workflow.md` | `skills/build/` | `skills/` |

### Anti-sprawl rules

1. **No root drops.** The only `.md` / `.html` files allowed at repo root are the load-bearing set: `CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md` (if at root), `TRACE.md` (if at root), `REGISTRY.md`, `BUILD-LOG.md` (symlink). Anything else belongs in `_inbox/` until `doc-home-finder` files it. Drift check flags violations.
2. **Every doc carries frontmatter** (`purpose` / `layer` / `status`) except the load-bearing root set and the symlink. `tidy` enforces. Bundle files additionally carry the kind suffix in the filename — together with `status`, they replace dir-based state tracking. Pattern + lifecycle in [`meta/cowork-pipeline/DEV-PATTERN.md`](meta/cowork-pipeline/DEV-PATTERN.md) § The bundle lifecycle.
3. **One doc, one home.** If a new doc would overlap 70%+ with an existing one, fold it in rather than stand it up. `doc-home-finder` recommends.
4. **Dated archives use ISO date prefix** (`YYYY-MM-DD-{slug}`). Never `MM-DD` or `YYYY-MM`. Sorts naturally. Shipped-version archives prefix the slug with `vN-`: `_attic/YYYY-MM-DD-v1-primitives/`.
5. **Renames break cites.** Do not rename a live doc casually — `tidy` proposes, PM ratifies, the same skill updates back-references.
6. **Archive shape is unified.** Everything that retires moves to `_attic/YYYY-MM-DD-{slug}/`. Shipped bundles use `_attic/YYYY-MM-DD-vN-{slug}/`. Provenance lives in frontmatter (`retired_from:` for retired specs; bundle artifacts inherit context from their parent plan). Legacy `_attic/YYYY-MM-DD/{original-path}` entries are grandfathered — do not retroactively reshape. `planning/bundles/done/` is retired in favor of `status: done` + archival to `_attic/`.

---

## Agent routing — use which skill when

Ten skills cover the full lifecycle. Each runs in **one tool only** — the hard firewall. Match intent to trigger; invoke the matching skill.

| User says / intent | Skill | Tool |
|---|---|---|
| "what's the state", "where are we", session start, "prune the journal", "resync the work map", "what drifted" | `orient` | Cowork |
| "explore X", "write a system for Y", "what would Z look like" | `explore` | Cowork |
| "scenarios for F###", "approve scenarios", "user story for…" | `scope` | Cowork |
| "weigh this", "is this a close call", "ratify the absolutes in {file}", "audit Intent annotations", "what's the Member view", "what's the platform view", "run the dialectic", "decide or defer on X" | `weigh` | Cowork |
| "review F###", "architecture check", "design review", "security review on F###" | `review` | Cowork |
| "memo this decision", "record this", "supersede {memo}", "what's the next memo number" | `memo` | Cowork |
| "tickets for F###", "break F### into tickets" | `ticket` | Claude Code |
| "tests for F###", "Playwright spec for F###", "run F### tests" | `test` | Claude Code |
| "implement T###", "TDD this", "build T###" | `build` | Claude Code |
| "tidy", "sweep the docs", "anything rotting", "triage the inbox", "audit the skills", "anything to archive" | `tidy` | Cowork |
| "scaffold a new project" | `scaffold` (utility) | Claude Code |
| "I want this to improve itself", "design a self-improvement loop", "Karpathy loop" | `loop-designer` (utility) | Cowork |

Full per-skill firewalls and read/write permissions: [`AGENTS.md`](AGENTS.md). Working pattern + commit choreography: [`meta/cowork-pipeline/DEV-PATTERN.md`](meta/cowork-pipeline/DEV-PATTERN.md). Close-call rule + the one absolute: [`meta/cowork-pipeline/DECISION-PATTERNS.md`](meta/cowork-pipeline/DECISION-PATTERNS.md).

### Solo-team multipliers (Cowork plugin skills) — when to call them in

A solo founder doesn't have a teammate to catch what TDD misses. These skills are mandatory gates at specific points in the pipeline. They live as installed Cowork plugins; setup at [`skills/EXTERNAL-SKILLS.md`](skills/EXTERNAL-SKILLS.md).

| Trigger | Plugin skill | Fires inside | Gate |
|---|---|---|---|
| New schema/event/component in a system spec | `engineering:architecture` + `engineering:system-design` | `review` | **M1** |
| Turning a problem statement into a system spec | `product-management:write-spec` | `explore` | — |
| Brainstorming a problem space | `product-management:product-brainstorming` | `explore` | — |
| Filtering a sprawling backlog | `anthropic-skills:planning-filter` | `scope` | — |
| Reviewing UI of any new surface | `design:design-critique` + `design:design-system` | `review` | — |
| Accessibility on any new surface | `design:accessibility-review` | `review` | **M3** (mandatory) |
| UX microcopy / CTAs / empty states | `design:ux-copy` | `review` or `build` | — |
| Test surface for non-obvious areas (auth, RLS, realtime, migrations) | `engineering:testing-strategy` | `test` (write) | — |
| Code-review a shipped ticket | `engineering:code-review` | `build`, **before** commit | **M2** (mandatory) |
| Pre-deploy verification | `engineering:deploy-checklist` | before merge to main | **M4** (mandatory) |
| Reproducing a bug or stack trace | `engineering:debug` | `build` | — |
| Triaging an incident | `engineering:incident-response` | out-of-band | — |
| Runbook, README, or API docs | `engineering:documentation` | `build` or out-of-band | — |
| Categorizing tech debt | `engineering:tech-debt` | quarterly, out-of-band | — |
| Non-code deliverable (deck, doc, sheet, PDF) | `anthropic-skills:pptx` / `docx` / `xlsx` / `pdf` | `build` | — |

Memory hygiene: invoke `anthropic-skills:consolidate-memory` once a month or after a vocabulary pivot.

### Routing rules of thumb

- "I want to design something new" → `explore`. Don't start at `scope` or `ticket`.
- "I want to ship something" → start at `orient`. Don't skip to `build`.
- "I have a bug / production thing / ambiguity in a ticket" → escalate per `AGENTS.md` § Escalation contacts. `build` does not redesign.
- "Two skills could fit" → prefer the **earlier** stage. Cheaper to catch at `scope` than at `build`.
- "Close call between options" → `weigh`. Applies the lexicographic rule from DECISION-PATTERNS (member safety → platform health → data protection → mutual benefit reversible).

---

## Rebuild phase — special rules

Active until Phase 4 of [`planning/rebuild-plan.md`](planning/rebuild-plan.md) completes.

1. **`review` is MANDATORY** on every approved scope. Verdicts: PROCEED / REVISE / EXTEND. Skip only for trivial copy/CTA changes on existing surfaces.
2. **Memo (or system-spec banner) required** before `scope` ratifies any scenario that introduces a new schema, event, table, column, or system. Cross-cutting decisions go to [`planning/DECISIONS.md`](planning/DECISIONS.md); single-system decisions go to the spec's status banner. The action-layer and event-log invariants live in ADR-10 (historical numbering retained for the existing memo set; new decisions continue from memo-0024 onward).
3. **`engineering:code-review` MANDATORY** on every shipped ticket **before `build` commits** — not after. The verdict + any required fixes land first; the commit captures the reviewed state. This pulls M2 left of commit so issues surface as fix-now (clean first commit), not fix-forward (amend / extra commit churn). `test` (run mode) still happens after commit, but code review no longer waits for it.
4. **`engineering:deploy-checklist` MANDATORY** before any merge to main that includes a Phase 1+ ticket (any ticket that touches the new schema).
5. **`design:accessibility-review` MANDATORY** on any scope that introduces a new page or component.
6. **`DEVIATIONS.md` entry MANDATORY** at the close of every ticket — even a one-line "no deviations." Empty is no longer the default.
7. **No backlog reads.** `build` cannot read `planning/scenarios-backlog/`. If a ticket references a scenario that is still in backlog, **stop and move the file first**. The firewall is load-bearing.
8. **English-only b1.** i18n deferred to b2 entry criterion.
9. **`weigh` MANDATORY** before any new memo lands in `planning/DECISIONS.md` and before `scope` ratifies a scenario whose system-spec changes introduced new statements matching Categories 1–8 from [`intent-audit.md`](_attic/2026-05-19/planning/intent-audit-2026-05-12.md) (archived; live discipline lives in the `weigh` skill). Verdict CLEAN proceeds; PROPOSE proceeds with PM landing the lines; BLOCK pauses the pipeline until the load-bearing rationale lands; ESCALATE routes Category-2 candidates to `weigh`'s ratify sub-routine for interactive adjudication.
10. **Every absolute carries a State tag.** There is no purely-categorical refusal in this project except the one named in DECISION-PATTERNS (wealth circulation over wealth extraction). Every other "Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no" carries a State-tagged `Intent` line co-located with the bullet. The tag is one of `(Ratified YYYY-MM-DD)` or `(Deferred until {trigger}; review by {horizon})`. Absence of the tag means **unratified de-facto** and blocks downstream pipeline. `weigh` is the single skill that walks the PM through unratified absolutes, runs the member + platform advocate sub-routines on Member-shaped tension, applies the lexicographic close-call rule (**member safety → platform health → member data protection → mutual benefit with reversibility**, per [`meta/cowork-pipeline/DECISION-PATTERNS.md`](meta/cowork-pipeline/DECISION-PATTERNS.md)), and lands the State-tagged Intent line.
11. **Two gates enforce rule 10, both before code.**
    - **Gate A — `scope`.** A scenario cannot move from `scenarios-backlog/` to `scenarios/` if the spec sections it cites contain unratified absolutes the scenario would encode. PM runs `weigh` on those absolutes first; then `scope` approves.
    - **Gate B — `ticket`.** A ticket cannot be drafted if any spec section the ticket would *encode in code* (schema, RLS, action-handler, UI affordance removal) contains unratified absolutes. `ticket` stops, surfaces the unratified statements, and routes to `weigh`. After ratification, ticketing resumes.
    - By the time tickets reach `build`, every absolute the code will encode already carries a Ratified or Deferred State tag with PM-approved Intent. The cheapest place to catch an unearned absolute is before code encodes it.
12. **STAGE-LEDGER stamp MANDATORY at every pipeline-skill handoff.** Each skill (`scope`, `review`, `ticket`, `build`, `test`) appends or updates the relevant row in [`planning/STAGE-LEDGER.md`](planning/STAGE-LEDGER.md) as the final step of its workflow. Regressions append new dated entries rather than overwriting — round-trips (two-cycle reviews) must remain visible.
13. **SPEC-PATCHES queue MANDATORY when build flags a spec.** Whenever `build` writes a DEVIATIONS entry with `Disposition: flag-for-spec-revision`, it also appends an entry to [`planning/SPEC-PATCHES.md`](planning/SPEC-PATCHES.md). `explore` drains the queue as a gate before each phase opens. Closes the Build → Product return loop.
14. **Substrate-ticket lane LEGALIZED.** Tickets with no user-facing surface (schema, RLS, action-handler scaffolding, test helpers) carry `Scenario: substrate` and bind to a system spec section + memo(s) instead of a Given/When/Then. Full contract in the `ticket` workflow § Substrate lane.
15. **Drift check at every session start.** `orient` runs the drift checklist — empty `scenarios/` with live ticket refs, stale BUILD-LOG bundle links, worktree shadows, oversize DEVIATIONS, `{pending}` commit hashes, retired skill dirs, stalled SPEC-PATCHES, superseded-memo citations, stalled STAGE-LEDGER rows. Flags only — does not gate.

---

## Project-specific authoritative docs

Read before working in the named area. The pipeline skills already know to read these; this list is for human navigation.

| Doc | Use when |
|---|---|
| [`product/MAP.md`](product/MAP.md) | Anytime you need the 100k-foot view — one sentence per system, alignment-check list at the bottom |
| [`product/TRACE.md`](product/TRACE.md) | Trace any ticket back to its need — feature lineage table |
| [`REGISTRY.md`](REGISTRY.md) | What docs exist and what each one does — the catalog |
| [`AGENTS.md`](AGENTS.md) | Anything pipeline — read/write firewalls, gates, escalation |
| [`planning/DECISIONS.md`](planning/DECISIONS.md) | The ADR pointer index — every architectural decision, current status, file path. Read first when looking up any "is there a decision about X?" |
| [`planning/adrs/`](planning/adrs/) | The canonical home for every ADR. Format and lifecycle in [`adrs/README.md`](planning/adrs/README.md). |
| [`planning/STAGE-LEDGER.md`](planning/STAGE-LEDGER.md) | The pipeline stage tracker — one row per F-number + substrate group; stamped by each pipeline skill as the work moves through. Read at session start (router does this). Fulfills `pipeline-process-audit-2026-05-22.md` R4. |
| [`planning/SPEC-PATCHES.md`](planning/SPEC-PATCHES.md) | The Build → Product return queue. Build agent appends when it flags a spec; `explore` drains as a gate before each phase opens. Fulfills audit R5. |
| [`planning/JUDGMENT.md`](planning/JUDGMENT.md) | The three-layer judgment doc (Intent / Bounds / Casebook) + agent-response discipline. Read when deciding whether to escalate to PM or decide alone. |
| [`planning/OPEN-QUESTIONS.md`](planning/OPEN-QUESTIONS.md) | PM-decision queue surfaced by the latest pipeline audit + the auto-coverage pass. Items requiring PM judgment that no agent can resolve. |
| [`product/needs/member-journey.md`](product/needs/member-journey.md) | North-star check — does this serve a loop? |
| [`product/foundation/primitives.md`](product/foundation/primitives.md) | Data-model fit — Person / Item / Location |
| [`product/foundation/principles.md`](product/foundation/principles.md) | Anything that risks treating a business as more important than the people doing the work |
| [`product/systems/agent-assistance.md`](product/systems/agent-assistance.md) | Anything agent-shaped — the umbrella for Delegation / Assistant Context / Skills |
| [`product/needs/use-cases.md`](product/needs/use-cases.md) | Real situations the platform exists to serve. The working test-case set for any feature. |
| [`product/foundation/policy.md`](product/foundation/policy.md) | Any surface touching data sharing, monetary flow, or visibility |
| [`product/systems/item.md`](product/systems/item.md) | Any feature that creates or surfaces a thing-being-declared |
| [`product/systems/groups.md`](product/systems/groups.md) | Anything Group-shaped — Groups, joining, role-per-kind, member lists, addressable scopes, business-Group operating, partnership/co-owner shape. **Supersedes `community.md` / `member-operations.md` / `cooperative.md` per the 2026-05-10 ratification.** Any feature that risks auto-assigning Members to a Group. |
| [`product/systems/member.md`](product/systems/member.md) | Anything Person-shaped. The anchor primitive of the platform. Includes multi-Location affinities (`member_location_affinities`), DM substrate, taste profile. (Maker mode retired 2026-05-12 per amendment §6 — selling tools surface from Group/Item state.) |
| [`product/systems/location.md`](product/systems/location.md) | Anything place-shaped — permanent / recurring-temporary / area Locations, multi-Location belonging, Location-follow, the Concerts-in-the-Park surface. **The anti-Nextdoor commitment** (no Location-scoped messaging or feeds) is encoded here and in `policy.md`. |
| [`product/systems/action-layer.md`](product/systems/action-layer.md) | Anything write-shaped or runtime-trust-shaped — the action handler contract, same-transaction row+event invariant, scope catalog, scoped capability vending, credential injection at the network edge, confirmation-gate enforcement, Skill sandbox. **Owns ADR-7.** Read when designing how agents transact on Members' behalf or when adding any new write capability. |
| [`product/systems/producer-tools.md`](product/systems/producer-tools.md) | Two surfaces in one spec — **Bulletin** (Member-authored broadcast to followers; optional kind='business' Group branding; in-app + email delivery; T2/T3 rich composition + scheduling + segmentation) and **Growth** (founder dashboard — followers/activity/profile-health, peer benchmarks, weekly digest, T3 competitive intelligence). Folded together from the prior `producer-bulletin.md` + `producer-growth.md` on 2026-05-22. Backs the producer recruitment pitch and the platform-promise commitment. |
| [`product/systems/business-jurisdiction.md`](product/systems/business-jurisdiction.md) | Anything locality-claim-shaped for kind='business' Groups — the three-tier verification ladder (Tier 0 self-attested ZIP → Tier 1 SOS-verified → Tier 2 document-uploaded), `member_business_jurisdictions` substrate, the `public.zip_is_proximal_to_location()` derivation path, the public "Claimed / Verified / Documented local owner" badge. **Promoted from `_attic/2026-05-19/product-exploration/locally-owned-verification.md` on 2026-05-11** (archived 2026-05-18) — that doc is now historical context only. The doxxing-prevention design choice (locality ≠ address) lives here. |
| [`product/systems/payments.md`](product/systems/payments.md) | Anything money-movement-shaped — Member→Member, Member→Group, Member→external-identified-recipient commerce; closed-loop ledger + ACH via chartered partner at b2; card on-ramp with friction; stablecoin path gated at T3; the wealth-circulation rubric (fees / float / rail-ownership / lock-in) as the selection process; zero platform transaction fees on Member commerce; platform never custodies for itself. **Drafted 2026-05-12** companion to `agent-commerce-and-project-amendments.md`. The rail that honors the `bounded_purchase` Delegation scope (ADR-17). |
| [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) | What ships in the rebuild MVP and what defers |
| [`planning/bundles/bundle-themes.md`](planning/bundles/bundle-themes.md) | Sub-bundle sequencer — slices each bundle into 1–2-week sub-themes (`b1.0`–`b1.6`, `b2.0`–`b2.6`, `b3.0`–`b3.5`). Read whenever choosing what ships next. Spans b1/b2/b3. |
| [`planning/bundles/b1-work-map.md`](planning/bundles/b1-work-map.md) | The menu of work per b1 sub-bundle, tagged 🟢 / 🟡 / ⚪ for scope decisions. The planner picks the next F### scenario from this map. |
| [`planning/rebuild-plan.md`](planning/rebuild-plan.md) | The rebuild plan — four phases, clean-slate, ticket sequencing. Filename retained for git history; the plan supersedes the prior 7-phase migration. |
| [`product/ui/design-language.md`](product/ui/design-language.md) | Any UI work — DLS tokens, components, CTA placement |
| [`product/ui/community-platform.md`](product/ui/community-platform.md) | Home / Explore / You / feed / discovery |
| [`product/foundation/design-philosophy.md`](product/foundation/design-philosophy.md) | The structured measuring stick — score every platform decision against the 5 sections (healthy community attributes, member journey, peer pressure & self-regulation, ownership arc, platform as enabler). When picking *what good looks like*, this wins. |
| [`product/foundation/principles.md`](product/foundation/principles.md) | The constitution — P1–P8 first principles + the People-First Principle + the Decision Test + categorical failures + metrics baseline + privacy/security baseline + monetization hypothesis. Binary pass/fail filter for every proposal. |
| [`product/needs/people.md`](product/needs/people.md) | DRAFT — personas the platform serves (Producer, Convener, Newcomer, Steward, Backer, Affinity-Seeker, Follower, Everyday Neighbor). |
| [`product/needs/needs.md`](product/needs/needs.md) | DRAFT — 13 human needs in plain voice, each traced to loop / system / capability / persona. |
| [`standards/`](standards/) | Cross-cutting build qualities — safety, security, accessibility, performance, responsiveness. Stubs scaffolded 2026-05-19. |
| [`REGISTRY.md`](REGISTRY.md) | Catalog of every narrative doc with its purpose + status, grouped by why / what / how layer. Generated from front-matter. |
| [`product/TRACE.md`](product/TRACE.md) | Feature lineage — every capability traced from human need to ticket. Companion to MAP. |

**Retired specs** — every doc retired in the 2026-05 consolidations lives under [`_attic/2026-05-19/`](_attic/2026-05-19/). Notable retired/superseded paths now archived there: `community.md`, `member-operations.md`, `cooperative.md`, `vendor-bulletin.md`, `vendor-intelligence.md`, `vendor-self-service.md` (2026-05-11 Phase 4); `foundational-principles.md`, `people-first.md`, `community-design-philosophy.md`, `policy-framework.md`, `foundation/agent-assistance.md`, `delegation.md`, `assistant-context.md`, `skills.md`, `producer-bulletin.md`, `producer-growth.md`, `consumer-feed.md`, `locality-browse.md`, `shareable-listing.md`, `canonical-examples.md`, `loops.md`, `business-accountability.md`, `community-accountability-model.md`, `PIPELINE-AUDIT.md`, `notes/` (2026-05-22 doc consolidation, R01–R10). Do not cite as live — use the current docs in `product/foundation/`, `product/needs/`, `product/systems/`, `product/ui/`.

**Producer-shaped systems** (historical context). The prior vendor-shaped specs were first re-anchored on Members + kind='business' Groups (2026-05-11) as `producer-bulletin.md` + `producer-growth.md`, then folded together into [`producer-tools.md`](product/systems/producer-tools.md) (2026-05-22, R06). `vendor-self-service.md` was retired as superseded — Location concerns live in [`location.md`](product/systems/location.md); profile-completeness in `producer-tools.md` § Growth T1; the no-admin-queue principle is platform-wide. All originals in [`_attic/2026-05-19/product-systems/`](_attic/2026-05-19/product-systems/) for trace.

**Forward-looking, NOT b1** (do not gate b1 on these): the b2+ surfaces inside [`product/systems/agent-assistance.md`](product/systems/agent-assistance.md) — the assistant chat panel, the Skill catalog at `/skills`, the Assistant Context editor, the three Assistant Context update pathways. b1 ships substrate only (`delegations`, `member_self_records`, `skill_subscriptions`, `skills`, `skill_versions` tables; `/you/data` export + purge; audit fields on every event row). See [`_attic/2026-05-27/planning-history/agent-assistance-2026-05-09.md`](_attic/2026-05-27/planning-history/agent-assistance-2026-05-09.md) for the seven open decisions parked there.

> **`groups.md` IS b1** — full surface ships at b1, including all six kinds (place / interest / practice / event_anchored / family / business). Standing-tier gate is defined in `groups.md`: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group. ADR status: see [`planning/DECISIONS.md`](planning/DECISIONS.md) for the current register and the system-resident pointer index; superseded ADRs live in [`_attic/2026-05-19/planning/`](_attic/2026-05-19/planning/).

---

## Commit Rules

**Branch per ticket, worktree per branch.** Every ticket starts on its own branch in its own worktree — from the main `web/` working tree: `git worktree add ../web-t{nnn} -b t{nnn}` (or `git worktree add ../community-t{nnn} -b t{nnn}` from the parent for parent-repo work). All ticket work happens in `../web-t{nnn}/`. PM merges and removes the worktree at ticket close: `cd web && git switch main && git merge --no-ff t{nnn} && git worktree remove ../web-t{nnn} && git branch -d t{nnn}`. Branch name `t{nnn}` is the convention; matches the ticket number, no zero-padding. Worktrees isolate concurrent agents — without them, two agents in the shared `web/` tree can overwrite each other's uncommitted edits (observed 2026-05-26: a T058–T066 commit landed on top of T065's pending edits and blew them away; the T065 agent had to re-apply them).

**Claude Code commits code — always with PM permission.** `build` ends a ticket by asking: "Ready to commit T### on branch t### with message `T###: title`? (y/n)." On `y`, `build` runs the commit. On `n`, PM amends or defers. Past pattern (PM commits everything from the Mac terminal) was a workaround for Cowork's sandbox git-lock bug; Claude Code's shell does not have that bug and should own its commits.

**Cowork does not commit code.** When a Cowork-side skill (`weigh`, `memo`, `explore`, `scope`, `review`, `tidy`) edits a doc in the parent repo, the skill ends by handing the PM a commit message and a `clearlock` line to run from the Mac terminal. Format:

```
docs(pipeline): short description

# Run from Mac terminal:
clearlock && cd /Users/don/Projects/community && \
  git add path/to/file && git commit -m "docs(pipeline): short description"
```

The `clearlock` exists because Cowork's sandbox can leave `.git/index.lock` files that wedge subsequent agent calls (see [`_attic/2026-05-19/notes/cowork-sandbox-git-bug.md`](_attic/2026-05-19/notes/cowork-sandbox-git-bug.md)). The skill provides the line; the PM runs it.

**Lock pre-flight (Claude Code).** Before any read-or-write work, `build` runs `ls web/.git/index.lock web/.git/worktrees/*/index.lock .git/index.lock .git/worktrees/*/index.lock 2>/dev/null`. If any prints a path, stop and ask the PM to run `clearlock` first. Do not attempt to remove the lock — the sandbox lacks the permission. The PM's `clearlock` shell function must include the parent + web `.git/worktrees/*/index.lock` glob to cover worktree-resident locks (the lock for `../web-t{nnn}` lives at `web/.git/worktrees/t{nnn}/index.lock`, not in the worktree itself).

**Format.** `T{NNN}: {title}` — one-line, no body, no co-author tag.

**Where to commit.**
- Working in `web/` → web repo.
- Working in `product/`, `planning/`, `development/`, `skills/` → parent repo.
- Never cross-commit.

**Pipeline-doc changes** (this file, AGENTS.md, MAP.md, TRACE.md, REGISTRY.md, skill workflows) commit with `docs(pipeline): {what}` — no T-number.

## Language & Framing

Pro-competition, pro-free-market language. For all Americans.

| Avoid | Use instead |
|---|---|
| Oligarchy / corporate greed | Rigged market / market consolidation |
| Anti-capitalist / progressive values | Pro-competition / American values |
| Resist | Take back / reclaim |
| Ethical spending | Smart spending / voting with your wallet |
