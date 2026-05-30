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
- **Active bundle:** [`planning/bundles/b1-primitives-plan.md`](planning/bundles/b1-primitives-plan.md) — Primitives MVP.
- **Active Phase 2 plan:** none ratified; draft in `_inbox/b1-primitives-sequence.md`. Scenarios live in [`planning/scenarios-backlog/`](planning/scenarios-backlog/).
- **Phase 3 plan:** not yet drafted.
- **Decisions home:** [`playbooks/PLATFORM-PATTERNS.md`](playbooks/PLATFORM-PATTERNS.md) (what the platform IS or refuses to be) and [`playbooks/DEVELOPMENT-PATTERNS.md`](playbooks/DEVELOPMENT-PATTERNS.md) (how we build). Each entry: Decision (one sentence), Intent (short paragraph), Touches (one file). New decisions land directly as pattern-doc entries. The `memo` skill writes a memo only when a prior decision needs to be reversed. Format conventions in [`playbooks/writing-docs.md`](playbooks/writing-docs.md) § Pattern-doc entry.

## North Star — The Loops

Every feature must serve at least one of the 13 loops. Source: [`product/needs/member-journey.md`](product/needs/member-journey.md). Five families, in order: Gathering → Sharing → Trade → Pooling → Federation. Activation energy ascends, belief ascends, stake accumulates.

## The Primitives

Source: [`product/foundation/primitives.md`](product/foundation/primitives.md). Three core + one optional.

- **Person (Member)** — a real human. Holds verbs (makes, services, convenes, follows, pledges). Role-as-verb, not role-as-identity. See [`product/systems/member.md`](product/systems/member.md).
- **Item** — anything declared (product, service, gathering, wonder, offer, ask, initiative). One schema, varying by `kind`. See [`product/systems/item.md`](product/systems/item.md).
- **Location** — a physical place (permanent / recurring-temporary / area). Members hold multi-Location affinities (live, work, play, visit, follow, liked) per `member_location_affinities`. **The anti-Nextdoor commitment lives in messaging-scope (item-or-group only) and complaint downvote/removal — not in absence of Member-Location relationships.** See [`product/systems/location.md`](product/systems/location.md).
- **Group** — a named, intentional, self-selected set of People organized to do things together on the platform. Six kinds at b1: five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) + one operate (`business`). Emergent and optional — never auto-assigned. See [`product/systems/groups.md`](product/systems/groups.md).

**Deliberately no Business entity.** Personal businesses are first-class via kind='business' Groups; corporate shells are not modeled. **Cooperative-style coordination (co-owning, voting, distributing) is deferred indefinitely** — kind='business' Groups with multiple owner-role memberships serve the cooperative-shape use case. Same principle for any Group — never owned by a corporate shell, never auto-assigned by geography.

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
4. **"Seller" is the generic UI term for a Member offering goods or services.** It applies whenever a Member has ≥1 active kind='business' Group membership or has posted an `items.kind='product'` / `'service'` row. There is no `maker_mode_enabled` toggle — selling tools surface from Group/Item state. **"Producer"** is preferred in the agricultural and food context — used in `producer-tools.md` and `platform-promise.md`. **"Maker"** survives only as a UI label when the Member specifically self-identifies as such (craftspeople, artisans); it is not a default role.
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
| Pattern entry | A section in `playbooks/{PLATFORM,DEVELOPMENT}-PATTERNS.md` (Decision / Intent / Touches) | "Anchor all primary controls to the bottom of the viewport" | `playbooks/` |
| Reversal memo | `memo-NNNN-{slug}.md` (numbering continues from 0024 — ADR-1 through 0025 retain numbering for git citation stability) | `memo-0024-{slug}.md` | `playbooks/memos/` — only when a prior decision needs to be reversed by user feedback |
| Review | `F###-review.md` (or `intent-{slug}-{date}.md` for intent-checks) | `F018-review.md` | `planning/reviews/` (active dir) → `planning/archive/YYYY-MM-DD-{slug}/` |
| Ticket | `T###-{slug}.md` (no zero-padding) | `T056-items-state-enum.md` | `development/tickets/` (open) → `development/tickets/done/` (wraps to `development/tickets/done/vN/` on shipped-version cut per ADR-25) |
| Bundle plan | `b{N}-{slug}-plan.md` | `b1-primitives-plan.md` | `planning/bundles/` (`status: active`) → `planning/archive/YYYY-MM-DD-{slug}/` (or `planning/archive/vN-{slug}/` if shipped a user-visible version) per ADR-25 |
| Bundle phase / artifact | `b{N}[.{x}]-{slug}-{kind}.md` — kind ∈ {`sprint`, `work-map`, `audit`, `rebuild`, `wrapup`} | `b1.0-foundation-sprint.md`, `b1-primitives-work-map.md`, `b1-primitives-wrapup.md` | `planning/bundles/` (archives with parent bundle to `planning/archive/`) |
| Initiative (non-bundle work package) | `{slug}/` with `README.md` + optional `strategy.md` + `items/` per [ADR-25](planning/adrs/ADR-0025-local-lifecycle-ownership.md) | `phase-3/` | `planning/initiatives/` (active) → `planning/archive/YYYY-MM-DD-{slug}/` when done |
| Proposed work item (atomize output) | `{slug}.md` (flat) or `{plan-slug}/NN-{slug}.md` (grouped under parent plan) — frontmatter carries `route: weigh \| scope \| tidy \| ticket \| explore` | `discoverability-default.md`, `b1-primitives-sequence/01-…` | `planning/proposed/` (PM ratifies → moves to one of the four Kanban lanes) |
| Kanban-staged work item | `{kind}-{slug}.md` (e.g. `audit-orphans.md`, `decision-payment-rail.md`) | `audit-orphans.md` | `planning/now/` (in flight) → `planning/next/` (queued) → `planning/later/` (parked) → `planning/done/` (closed). PM moves files across the four lanes; nothing in a lane carries dated frontmatter — lane membership is the state. |
| Dated work product | `_attic/YYYY-MM-DD-{slug}/` directly | `_attic/2026-MM-DD-some-effort/` | `_attic/` |
| Retired spec | `{owning-dir}/archive/YYYY-MM-DD-{slug}/` with `retired_from:` in frontmatter for provenance | `product/archive/2026-MM-DD-some-spec/some-spec.md` | `{owning-dir}/archive/` |
| Shipped-version release doc | `RELEASE.md` at root of `{owning-dir}/archive/vN-{slug}/` + one line per version in `planning/RELEASES.md` | `planning/archive/v1-primitives/RELEASE.md` | `{owning-dir}/archive/` + `planning/` |
| Untriaged | `_inbox/{name}.{ext}` | `_inbox/some-draft.md` | `_inbox/` |
| Audit | `pipeline-process-audit-YYYY-MM-DD.md` (named at root during the audit; **on absorption, atomize the findings into `planning/proposed/` and archive the audit to `_attic/YYYY-MM-DD-{slug}/`**) | `pipeline-process-audit-2026-05-22.md` | (transient at root) |
| Playbook (decisions in force + how-to-write canon) | `SCREAMING-KEBAB.md` for pattern docs, `kebab-case.md` for how-to-write | `PLATFORM-PATTERNS.md`, `writing-docs.md` | `playbooks/` (reversal memos live under `playbooks/memos/` — see "Reversal memo" row above) |
| Skill | `skills/{kebab-name}/SKILL.md` + `workflow.md` | `skills/build/` | `skills/` |

### Anti-sprawl rules

1. **No root drops.** The only `.md` / `.html` files allowed at repo root are the load-bearing set: `CLAUDE.md`, `AGENTS.md`, `JOURNAL.md`, `MAP.md` (if at root), `TRACE.md` (if at root), `REGISTRY.md`, `BUILD-LOG.md` (symlink). Anything else belongs in `_inbox/` until `doc-home-finder` files it. Drift check flags violations.
2. **Every doc carries frontmatter** (`purpose` / `layer` / `status`) except the load-bearing root set and the symlink. `tidy` enforces. Bundle files additionally carry the kind suffix in the filename — together with `status`, they replace dir-based state tracking. Pattern + lifecycle in [`playbooks/DEVELOPMENT-PATTERNS.md`](playbooks/DEVELOPMENT-PATTERNS.md) § Track bundles by filename kind suffix + status frontmatter.
3. **One doc, one home.** If a new doc would overlap 70%+ with an existing one, fold it in rather than stand it up. `doc-home-finder` recommends.
4. **Dated archives use ISO date prefix** (`YYYY-MM-DD-{slug}`). Never `MM-DD` or `YYYY-MM`. Sorts naturally. Shipped-version archives prefix the slug with `vN-`: `planning/archive/v1-primitives/`.
5. **Renames break cites.** Do not rename a live doc casually — `tidy` proposes, PM ratifies, the same skill updates back-references.
6. **Archives split by kind.** *Retired specs* and *shipped-version release docs* go to directory-local archives — `{owning-dir}/archive/YYYY-MM-DD-{slug}/`; shipped-version cuts wrap each `{owning-dir}/archive/` into `{owning-dir}/archive/vN-{slug}/`, then reset for the next version. *Dated work-products* (atomized inboxes, one-off audits) go to `_attic/YYYY-MM-DD-{slug}/` directly. Provenance lives in frontmatter (`retired_from:` for retired specs; `RETIRED.md` for dated archives). Root `planning/RELEASES.md` cross-indexes shipped versions across directories.

---

## Agent routing — use which skill when

Eleven skills cover the full lifecycle. Each runs in **one tool only** — the hard firewall. Match intent to trigger; invoke the matching skill.

| User says / intent | Skill | Tool |
|---|---|---|
| "what's the state", "where are we", session start, "prune the journal", "resync the work map", "what drifted" | `orient` | Cowork |
| "explore X", "write a system for Y", "what would Z look like" | `explore` | Cowork |
| "scenarios for F###", "approve scenarios", "user story for…" | `scope` | Cowork |
| "weigh this", "is this a close call", "ratify the absolutes in {file}", "audit Intent annotations", "what's the Member view", "what's the platform view", "run the dialectic", "decide or defer on X" | `weigh` | Cowork |
| "review F###", "architecture check", "design review", "security review on F###" | `review` | Cowork |
| "reverse this decision", "user feedback contradicts {pattern entry}", "supersede {memo}", "what's the next memo number" | `memo` | Cowork |
| "atomize the inbox", "atomize `_inbox/{name}.md`", "decompose this plan", "break this plan into proposed items", "materialize the inbox", "intake the plan" | `atomize` | Claude Code |
| "tickets for F###", "break F### into tickets" | `ticket` | Claude Code |
| "tests for F###", "Playwright spec for F###", "run F### tests" | `test` | Claude Code |
| "implement T###", "TDD this", "build T###" | `build` | Claude Code |
| "tidy", "sweep the docs", "anything rotting", "triage the inbox", "audit the skills", "anything to archive" | `tidy` | Cowork |
| "scaffold a new project" | `scaffold` (utility) | Claude Code |
| "I want this to improve itself", "design a self-improvement loop", "Karpathy loop" | `loop-designer` (utility) | Cowork |

Full per-skill firewalls and read/write permissions: [`AGENTS.md`](AGENTS.md). Pipeline patterns + commit choreography: [`playbooks/DEVELOPMENT-PATTERNS.md`](playbooks/DEVELOPMENT-PATTERNS.md) § Pipeline patterns. Close-call rule + the one absolute: [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md).

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
- "Close call between options" → `weigh`. Applies the lexicographic rule from [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md) (member safety → platform health → data protection → mutual benefit reversible).

---

## Rebuild phase — special rules

Active until the b1 user-surface set (F030–F037 — sequence draft in `_inbox/b1-primitives-sequence.md` awaiting triage) is shipped and the b1 bundle archives.

1. **`review` is MANDATORY** on every approved scope. Verdicts: PROCEED / REVISE / EXTEND. Skip only for trivial copy/CTA changes on existing surfaces.
2. **Pattern-doc entry (or system-spec banner) required** before `scope` ratifies any scenario that introduces a new schema, event, table, column, or system. Cross-cutting decisions land in [`playbooks/PLATFORM-PATTERNS.md`](playbooks/PLATFORM-PATTERNS.md) or [`playbooks/DEVELOPMENT-PATTERNS.md`](playbooks/DEVELOPMENT-PATTERNS.md) per the routing rule (what the platform IS vs how we build); single-system decisions go to the spec's status banner.
3. **`engineering:code-review` MANDATORY** on every shipped ticket **before `build` commits** — not after. The verdict + any required fixes land first; the commit captures the reviewed state. This pulls M2 left of commit so issues surface as fix-now (clean first commit), not fix-forward (amend / extra commit churn). `test` (run mode) still happens after commit, but code review no longer waits for it.
4. **`engineering:deploy-checklist` MANDATORY** before any merge to main that includes a Phase 1+ ticket (any ticket that touches the new schema).
5. **`design:accessibility-review` MANDATORY** on any scope that introduces a new page or component.
6. **`DEVIATIONS.md` entry MANDATORY** at the close of every ticket — even a one-line "no deviations." Empty is no longer the default.
7. **No backlog reads.** `build` cannot read `planning/scenarios-backlog/`. If a ticket references a scenario that is still in backlog, **stop and move the file first**. The firewall is load-bearing.
8. **English-only b1.** i18n deferred to b2 entry criterion.
9. **`weigh` MANDATORY** before any new entry lands in `playbooks/PLATFORM-PATTERNS.md` or `playbooks/DEVELOPMENT-PATTERNS.md`, and before `scope` ratifies a scenario whose system-spec changes introduced new absolutist statements. Verdict CLEAN proceeds; PROPOSE proceeds with PM landing the lines; BLOCK pauses the pipeline until the load-bearing rationale lands; ESCALATE routes hardest cases to `weigh`'s ratify sub-routine for interactive adjudication.
10. **Every absolute carries a State tag.** There is no purely-categorical refusal in this project except the one named in `playbooks/DECISION-PATTERNS.md` (wealth circulation over wealth extraction). Every other "Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no" carries a State-tagged `Intent` line co-located with the bullet. The tag is one of `(Ratified YYYY-MM-DD)` or `(Deferred until {trigger}; review by {horizon})`. Absence of the tag means **unratified de-facto** and blocks downstream pipeline. `weigh` is the single skill that walks the PM through unratified absolutes, runs the member + platform advocate sub-routines on Member-shaped tension, applies the lexicographic close-call rule (**member safety → platform health → member data protection → mutual benefit with reversibility**, per [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md)), and lands the State-tagged Intent line.
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
| [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md) | How to make calls — the default, the lexicographic tiebreaker (member safety → platform health → data protection → mutual benefit reversible), the one absolute (wealth circulation over extraction). Read before any close-call decision. |
| [`playbooks/PLATFORM-PATTERNS.md`](playbooks/PLATFORM-PATTERNS.md) | What the platform IS or refuses to be — URL shape, primitives, agent-assistance commitments, policy framework, locality default, anti-Nextdoor framing. Decisions live in force as pattern-doc entries. Read first when looking up "is there a decision about X?" |
| [`playbooks/DEVELOPMENT-PATTERNS.md`](playbooks/DEVELOPMENT-PATTERNS.md) | How we build — action layer, eval helpers, clean-slate rebuild, archive ownership, pipeline patterns, M-gates, bundle lifecycle, anti-patterns. |
| [`playbooks/writing-docs.md`](playbooks/writing-docs.md) | How to write any doc in the repo — where things live, style rules, anti-patterns, templates (capability spec / pattern entry / JOURNAL entry). |
| [`playbooks/repo-tidying.md`](playbooks/repo-tidying.md) | What `tidy` looks for — ten findings, each with a trigger and a disposition. |
| [`planning/STAGE-LEDGER.md`](planning/STAGE-LEDGER.md) | The pipeline stage tracker — one row per F-number + substrate group; stamped by each pipeline skill as the work moves through. Read at session start (router does this). |
| [`planning/SPEC-PATCHES.md`](planning/SPEC-PATCHES.md) | The Build → Product return queue. Build agent appends when it flags a spec; `explore` drains as a gate before each phase opens. Fulfills audit R5. |
| [`planning/AGENT-BOUNDS.md`](planning/AGENT-BOUNDS.md) | The three-layer agent-bounds doc (Intent / Bounds / Casebook) + agent-response discipline. Read when deciding whether to escalate to PM or decide alone. |
| [`product/needs/member-journey.md`](product/needs/member-journey.md) | North-star check — does this serve a loop? |
| [`product/foundation/primitives.md`](product/foundation/primitives.md) | Data-model fit — Person / Item / Location |
| [`product/foundation/principles.md`](product/foundation/principles.md) | Anything that risks treating a business as more important than the people doing the work |
| [`product/systems/agent-assistance.md`](product/systems/agent-assistance.md) | Anything agent-shaped — the umbrella for Delegation / Assistant Context / Skills |
| [`product/needs/use-cases.md`](product/needs/use-cases.md) | Real situations the platform exists to serve. The working test-case set for any feature. |
| [`planning/producer-roadmap.md`](planning/producer-roadmap.md) | Producer/seller capabilities organized by business function — Now (Phase 2) / Later / Won't per category. Read by `scope` before writing any producer-facing scenario; the Won't bullets are PM-ratified scope boundaries. Every scenario's `## Capabilities unlocked` section traces here. |
| [`product/foundation/policy.md`](product/foundation/policy.md) | Any surface touching data sharing, monetary flow, or visibility |
| [`product/systems/item.md`](product/systems/item.md) | Any feature that creates or surfaces a thing-being-declared |
| [`product/systems/groups.md`](product/systems/groups.md) | Anything Group-shaped — Groups, joining, role-per-kind, member lists, addressable scopes, business-Group operating, partnership/co-owner shape. Any feature that risks auto-assigning Members to a Group. |
| [`product/systems/member.md`](product/systems/member.md) | Anything Person-shaped. The anchor primitive of the platform. Includes multi-Location affinities (`member_location_affinities`), DM substrate, taste profile. |
| [`product/systems/location.md`](product/systems/location.md) | Anything place-shaped — permanent / recurring-temporary / area Locations, multi-Location belonging, Location-follow, the Concerts-in-the-Park surface. **The anti-Nextdoor commitment** (no Location-scoped messaging or feeds) is encoded here and in `policy.md`. |
| [`product/systems/action-layer.md`](product/systems/action-layer.md) | Anything write-shaped or runtime-trust-shaped — the action handler contract, same-transaction row+event invariant, scope catalog, scoped capability vending, credential injection at the network edge, confirmation-gate enforcement, Skill sandbox. Read when designing how agents transact on Members' behalf or when adding any new write capability. |
| [`product/systems/producer-tools.md`](product/systems/producer-tools.md) | Two surfaces in one spec — **Bulletin** (Member-authored broadcast to followers; optional kind='business' Group branding; in-app + email delivery; T2/T3 rich composition + scheduling + segmentation) and **Growth** (founder dashboard — followers/activity/profile-health, peer benchmarks, weekly digest, T3 competitive intelligence). Backs the producer recruitment pitch and the platform-promise commitment. |
| [`product/systems/business-jurisdiction.md`](product/systems/business-jurisdiction.md) | Anything locality-claim-shaped for kind='business' Groups — the three-tier verification ladder (Tier 0 self-attested ZIP → Tier 1 SOS-verified → Tier 2 document-uploaded), `member_business_jurisdictions` substrate, the `public.zip_is_proximal_to_location()` derivation path, the public "Claimed / Verified / Documented local owner" badge. The doxxing-prevention design choice (locality ≠ address) lives here. |
| [`product/systems/payments.md`](product/systems/payments.md) | Anything money-movement-shaped — Member→Member, Member→Group, Member→external-identified-recipient commerce; closed-loop ledger + ACH via chartered partner at b2; card on-ramp with friction; stablecoin path gated at T3; the wealth-circulation rubric (fees / float / rail-ownership / lock-in) as the selection process; zero platform transaction fees on Member commerce; platform never custodies for itself. The rail that honors the `bounded_purchase` Delegation scope. |
| [`planning/bundles/b1-primitives-plan.md`](planning/bundles/b1-primitives-plan.md) | What ships in the rebuild MVP and what defers |
| [`planning/bundles/bundle-themes.md`](planning/bundles/bundle-themes.md) | Sub-bundle sequencer — slices each bundle into 1–2-week sub-themes (`b1.0`–`b1.6`, `b2.0`–`b2.6`, `b3.0`–`b3.5`). Read whenever choosing what ships next. Spans b1/b2/b3. |
| [`planning/bundles/b1-primitives-work-map.md`](planning/bundles/b1-primitives-work-map.md) | The menu of work per b1 sub-bundle, tagged 🟢 / 🟡 / ⚪ for scope decisions. The planner picks the next F### scenario from this map. |
| [`product/ui/design-language.md`](product/ui/design-language.md) | Any UI work — DLS tokens, components, CTA placement |
| [`product/ui/community-platform.md`](product/ui/community-platform.md) | Home / Explore / You / feed / discovery |
| [`product/foundation/community-health-rubric.md`](product/foundation/community-health-rubric.md) | The structured measuring stick — score every platform decision against the 5 sections (healthy community attributes, member journey, peer pressure & self-regulation, ownership arc, platform as enabler). When picking *what good looks like*, this wins. |
| [`product/foundation/principles.md`](product/foundation/principles.md) | The constitution — P1–P8 first principles + the People-First Principle + the Decision Test + categorical failures + metrics baseline + privacy/security baseline + monetization hypothesis. Binary pass/fail filter for every proposal. |
| [`standards/`](standards/) | Cross-cutting build qualities — safety, security, accessibility, performance, responsiveness. |
| [`REGISTRY.md`](REGISTRY.md) | Catalog of every narrative doc with its purpose + status, grouped by why / what / how layer. Generated from front-matter. |
| [`product/TRACE.md`](product/TRACE.md) | Feature lineage — every capability traced from human need to ticket. Companion to MAP. |

**Retired specs** live under `_attic/`. Do not cite as live — use the current docs in `product/foundation/`, `product/needs/`, `product/systems/`, `product/ui/`.

**Agent-assistance b1 scope.** [`product/systems/agent-assistance.md`](product/systems/agent-assistance.md) — b1 ships substrate only (`delegations`, `member_self_records`, `skill_subscriptions`, `skills`, `skill_versions` tables; `/you/data` export + purge; audit fields on every event row). The b2+ surfaces (assistant chat panel, Skill catalog at `/skills`, Assistant Context editor) do not gate b1.

> **`groups.md` IS b1** — full surface ships at b1, including all six kinds (place / interest / practice / event_anchored / family / business). Standing-tier gate is defined in `groups.md`: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group.

---

## Commit Rules

**Branch per ticket, worktree per branch.** Every ticket starts on its own branch in its own worktree — from the main `web/` working tree: `git worktree add ../web-t{nnn} -b t{nnn}` (or `git worktree add ../community-t{nnn} -b t{nnn}` from the parent for parent-repo work). All ticket work happens in `../web-t{nnn}/`. PM merges and removes the worktree at ticket close: `cd web && git switch main && git merge --no-ff t{nnn} && git worktree remove ../web-t{nnn} && git branch -d t{nnn}`. Branch name `t{nnn}` is the convention; matches the ticket number, no zero-padding. Worktrees isolate concurrent agents — without them, two agents in the shared `web/` tree can overwrite each other's uncommitted edits.

**Claude Code commits code — always with PM permission.** `build` ends a ticket by asking: "Ready to commit T### on branch t### with message `T###: title`? (y/n)." On `y`, `build` runs the commit. On `n`, PM amends or defers.

**Cowork does not commit code.** When a Cowork-side skill (`weigh`, `memo`, `explore`, `scope`, `review`, `tidy`) edits a doc in the parent repo, the skill ends by handing the PM a commit message and a `clearlock` line to run from the Mac terminal. Format:

```
docs(pipeline): short description

# Run from Mac terminal:
clearlock && cd /Users/don/Projects/community && \
  git add path/to/file && git commit -m "docs(pipeline): short description"
```

The `clearlock` exists because Cowork's sandbox can leave `.git/index.lock` files that wedge subsequent agent calls. The skill provides the line; the PM runs it.

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
