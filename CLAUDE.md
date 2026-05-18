# Main Street Market

> Solo founder. Re-architecture in flight. Process lives in skills, not nested CLAUDE.md files.
> First time in this repo? Read this file end-to-end, then [`product/MAP.md`](product/MAP.md) (100k-foot architecture map — one sentence per system), then [`AGENTS.md`](AGENTS.md), then [`JOURNAL.md`](JOURNAL.md).

## Project Facts

- **What it is:** A coordination layer for collective action in a place. People declare things — products, services, gatherings, ideas — at locations. Other people respond. Farmers markets are the wedge; the platform is broader. **People-first, not business-first.** See [`product/foundation/people-first.md`](product/foundation/people-first.md).
- **Stack:** Next.js (App Router), TypeScript, Tailwind v4 (`@theme inline` tokens), Supabase (Postgres + Auth + Realtime), Mapbox GL JS, Playwright (evals), Vitest (unit), Vercel.
- **Repo structure:** Two-repo. Parent `mainstreetmarket/` is local-only (product, planning, development docs). `web/` is a separate git repo pushed to GitHub.
- **App path:** `./web`
- **Active bundle:** [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) (Primitives MVP).
- **Active rebuild:** [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) — clean-slate rebuild on Person / Item / Location / Group primitives. Filename retained for git history; the doc is now the rebuild plan, not a migration plan (no live data; no dual-write).
- **Pipeline audit:** [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) (read once at session start when revisiting process).

## North Star — The Loops

Every feature must serve at least one of the 13 loops. Source: [`product/foundation/loops.md`](product/foundation/loops.md). Five families, in order: Gathering → Sharing → Trade → Pooling → Federation. Activation energy ascends, belief ascends, stake accumulates.

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

| Schema (durable) | URL (public, single-letter where possible) | UI label (user-facing) | UI verb (CTAs) |
|---|---|---|---|
| `members` | `/m/[handle]` | Member · Seller (when ≥1 active kind='business' Group membership or kind='product'/'service' Item) · Producer (ag/food context) | Sign up · Sell · Offer |
| `groups` | `/g/[slug]` | Group · Shop (kind='business') · Circle (kind='interest'/'practice') | Start a group · Join |
| `locations` | `/l/[slug]` | Place · Venue | Add a place |
| `items.kind = 'gathering'` | `/e/[slug]` | **Event** | Host |
| `items.kind = 'product'` | `/p/[slug]` | Product | Sell · Share |
| `items.kind = 'service'` | `/s/[slug]` | Service | Offer |
| `items.kind = 'wonder'` | `/i/[slug]` | **Idea** | Wonder · Float |
| `items.kind = 'offer'` | `/o/[slug]` | Offer | Offer up |
| `items.kind = 'ask'` | `/a/[slug]` | Ask | Ask |
| `items.kind = 'initiative'` | `/initiative/[slug]` | Initiative | Lead · Start |
| `member_self_records` | n/a (not a public surface) | **Assistant Context** | Edit · Teach |

### Rules

1. **Schema names are durable.** Don't rename `gathering` → `event` or `wonder` → `idea` in code; the URL and UI layers handle the translation. Same with `member_self_record` → "Assistant Context." This isolates schema migrations from naming evolution.
2. **"Declare" is the spec/conceptual verb only.** "Person declares Item" is correct in `primitives.md`, `loops.md`, and system specs. UI never says "declare an item" — UI uses the kind-specific verb (Host, Sell, Offer, Wonder, Ask, Lead).
3. **No umbrella word for Items in UI copy.** "Item" is the database term. In the UI, always use the specific kind: Event, Product, Service, Idea, Offer, Ask, Initiative. The Explore tab can use kind-specific filter copy ("Browse events," "Browse what's for sale") rather than "Browse items."
4. **"Seller" is the generic UI term for a Member offering goods or services.** It applies whenever a Member has ≥1 active kind='business' Group membership or has posted an `items.kind='product'` / `'service'` row. There is no `maker_mode_enabled` toggle (dropped per `agent-commerce-and-project-amendments.md` §6, ratified 2026-05-12). **"Producer"** is preferred in the agricultural and food context — used in `producer-bulletin.md`, `producer-growth.md`, and `platform-promise.md`. **"Maker"** survives only as a UI label when the Member specifically self-identifies as such (craftspeople, artisans); it is not a default role.
5. **Loop names stay conceptual.** Loop 2 is "Wonder," Loop 4 is "Gather regularly." Loop names are durable spec language; they don't migrate to the new UI labels.

### When in doubt

- Writing a spec or doc → use the schema term in code references; use the UI label in prose meant for users.
- Writing a URL → use the URL column.
- Writing UI copy or composer CTAs → use the UI label as the noun and the UI verb as the action.
- Naming a new entity → propose all four columns at once.

---

## Agent routing — use which skill when

Pipeline-skills triggers (project-resident, in [`skills/`](skills/)). Match the user's intent to the trigger; invoke the matching skill.

| User says / intent | Skill | Stage |
|---|---|---|
| "what's the state of this project", "where are we", session start | `pipeline-router` | 0 |
| "explore X", "write a system for Y", "what would Z look like" | `pipeline-product` | 1 |
| "write scenarios for F###", "approve scenarios", "user story for…" | `pipeline-plan` | 2 |
| "review F###", "architecture check", "design review F###" | `pipeline-review` | 2.5 |
| "write evals for F###", "Playwright spec for F###" | `pipeline-eval` (write) | 3 |
| "audit the absolutes F### would encode", "before tickets, review the absolutes", "is this absolute earned at ticket-time", "decide or defer the absolute before code" | `pipeline-review-absolute` | 3.5 |
| "write tickets for F###", "break F### into tickets" | `pipeline-ticket` | 4 |
| "implement T###", "TDD this", "build T###" | `pipeline-build` | 5 |
| "run evals for F###", "verify F### passes" | `pipeline-eval` (run) | 6 |
| "scaffold a new project" | `pipeline-scaffold` | — |
| "prune the journal", "DECISIONS.md is heavy", "what should we memorialize", "rotate the journal" | `pipeline-prune` | meta |
| "intent check on F###/system X/ADR-N", "audit Intent annotations", "scan DECISIONS for intent gaps" | `pipeline-intent-check` | meta |
| "clarify the absolutes in {file}", "review every never-statement", "every absolute needs intent", "go over the won't/doesn't statements" | `pipeline-clarify-absolutes` | meta |
| "review this absolute", "should this be an absolute", "audit our absolutes", "is this earned", "decide or defer on X", "review F### intents" | `pipeline-review-absolute` | meta / 3.5 (ticket-time) |
| "what's the Member view on this", "advocate for the Member", "what does the Member lose here" | `pipeline-member-advocate` | meta |
| "what's the platform view on this", "advocate for the platform", "what does the platform need here", "run the dialectic" | `pipeline-platform-advocate` | meta |
| "I want this to improve itself", "design a self-improvement loop", "Karpathy loop / meta-agent harness", "this should keep getting better on its own" | `loop-designer` | meta |

Full per-skill firewalls and read/write permissions: [`AGENTS.md`](AGENTS.md).

### Solo-team multipliers (Cowork plugin skills) — when to call them in

A solo founder doesn't have a teammate to catch what TDD misses. These skills are mandatory gates at specific points in the pipeline. They live as installed Cowork plugins; setup at [`skills/EXTERNAL-SKILLS.md`](skills/EXTERNAL-SKILLS.md).

| Trigger | Skill | Stage gate |
|---|---|---|
| Writing a system spec that introduces new schema/event/component | `engineering:architecture` (writes ADR) + `engineering:system-design` | **M1 — before plan** |
| Turning a problem statement into a system spec | `product-management:write-spec` | inside Stage 1 |
| Brainstorming a problem space without a target solution | `product-management:product-brainstorming` | inside Stage 1 |
| Filtering a sprawling backlog | `anthropic-skills:planning-filter` | inside Stage 2 |
| Reviewing UI of any new surface in a scenario | `design:design-critique` + `design:design-system` | inside Stage 2.5 |
| Reviewing a11y of any new surface | `design:accessibility-review` | **M3 — inside Stage 2.5, mandatory on every new surface** |
| Writing UX microcopy / CTAs / empty states | `design:ux-copy` | inside Stage 2.5 or 5 |
| Designing the test surface for non-obvious areas (auth, RLS, realtime, migrations) | `engineering:testing-strategy` | inside Stage 3 |
| Reviewing a shipped ticket before commit | `engineering:code-review` | **M2 — after build, before commit, on every ticket** |
| Pre-deploy verification (any push to main touching the migration) | `engineering:deploy-checklist` | **M4 — before merge to main** |
| Reproducing a bug or stack trace | `engineering:debug` | inside Stage 5 |
| Triaging an incident | `engineering:incident-response` | out-of-band |
| Writing a runbook, README, or API docs | `engineering:documentation` | inside Stage 5 or out-of-band |
| Categorizing tech debt | `engineering:tech-debt` | quarterly, out-of-band |
| Non-code deliverable (deck, doc, sheet, PDF) | `anthropic-skills:pptx` / `docx` / `xlsx` / `pdf` | inside Stage 5 |

Memory hygiene: invoke `anthropic-skills:consolidate-memory` once a month or after a vocabulary pivot.

### Routing rules of thumb

- "I want to design something new" → `pipeline-product`. Never start at plan or ticket.
- "I want to ship something" → start at `pipeline-router`. Don't skip to build.
- "I have a bug / production thing / ambiguity in a ticket" → escalate per `AGENTS.md` § Escalation Contacts. Build agent does not redesign.
- "Two skills could fit" → prefer the **earlier** stage. Cheaper to catch at plan than at build.

---

## Rebuild phase — special rules

Active until Phase 4 of [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) (the rebuild plan) completes.

1. **`pipeline-review` is MANDATORY** on every approved scenario. Verdicts: PROCEED / REVISE / EXTEND. Skip only for trivial copy/CTA changes on existing surfaces.
2. **ADR or system-spec banner required** before `pipeline-plan` ratifies any scenario that introduces a new schema, event, table, column, or system. Cross-cutting decisions go to [`planning/DECISIONS.md`](planning/DECISIONS.md); single-system decisions go to the spec's status banner per the new DECISIONS.md format. The action-layer and event-log invariants live in ADR-10.
3. **`engineering:code-review` MANDATORY** on every shipped ticket **before the build commits to the app repo** — not after. The verdict + any required fixes land first; the commit captures the reviewed state. This pulls M2 left of commit so issues surface as fix-now (clean first commit), not fix-forward (amend / extra commit churn). Eval (run mode) still happens after commit, but code review no longer waits for it.
4. **`engineering:deploy-checklist` MANDATORY** before any merge to main that includes a Phase 1+ ticket (any ticket that touches the new schema).
5. **`design:accessibility-review` MANDATORY** on any scenario that introduces a new page or component.
6. **`DEVIATIONS.md` entry MANDATORY** at the close of every ticket — even a one-line "no deviations." Empty is no longer the default.
7. **No backlog reads.** `pipeline-build` cannot read `planning/scenarios-backlog/`. If a ticket references a scenario that is still in backlog, **stop and move the file first**. The firewall is load-bearing.
8. **English-only b1.** i18n deferred to b2 entry criterion.
9. **`pipeline-intent-check` MANDATORY** before any new ADR lands in `planning/DECISIONS.md` and before `pipeline-plan` ratifies a scenario whose system-spec changes introduced new statements matching Categories 1–8 from [`intent-audit.md`](planning/archive/intent-audit-2026-05-12.md) (archived; live discipline lives in the skills). Verdict CLEAN proceeds; PROPOSE proceeds with PM landing the lines; BLOCK pauses the pipeline until the load-bearing rationale lands; ESCALATE routes Category-2 candidates to `pipeline-clarify-absolutes` for interactive ratification. The audit's eight categories are the bounded surface — the check does not hunt rationale outside them.
10. **Every Category-2 absolute lands with PM-ratified Intent.** Per `intent-audit.md`'s revised addendum (2026-05-12, archived at [`planning/archive/intent-audit-2026-05-12.md`](planning/archive/intent-audit-2026-05-12.md)), there is no purely-categorical refusal in this project — every "Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no" carries a *why*, and that *why* is what a downstream agent needs to reason correctly when the literal wording doesn't cover the case. `pipeline-clarify-absolutes` is the interactive skill that walks the PM through each absolute and lands the bullet revision (when needed) + `Intent:` annotation.
11. **`pipeline-review-absolute` MANDATORY at ticket-time** when the scenario for which tickets are about to be written encodes one or more Category-2 absolutes in code (schema constraints, RLS policies, action-handler refusals, UI affordance removals). `pipeline-ticket` pauses, lists the absolutes the tickets will encode, and invokes `pipeline-review-absolute` per absolute. Verdicts: Ratify → tickets proceed; Revise → bullet text + Intent revised in the source spec first, then tickets; Defer → ticket(s) that encode the absolute are removed from the slice with a trigger logged in `planning/DEFERRED.md`; Reject → the scenario returns to `pipeline-plan`. Rationale: the cheapest place to catch an unearned absolute is *before* code encodes it, not at spec-authoring time when the cost is still notional. The absolute is real when a ticket is about to write the constraint that enforces it.

---

## Project-specific authoritative docs

Read before working in the named area. The pipeline skills already know to read these; this list is for human navigation.

| Doc | Use when |
|---|---|
| [`product/MAP.md`](product/MAP.md) | Anytime you need the 100k-foot view — one sentence per system, alignment-check list at the bottom |
| [`AGENTS.md`](AGENTS.md) | Anything pipeline — read/write firewalls, gates, escalation |
| [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) | Process questions; understanding why the gates exist |
| [`product/foundation/loops.md`](product/foundation/loops.md) | North-star check — does this serve a loop? |
| [`product/foundation/primitives.md`](product/foundation/primitives.md) | Data-model fit — Person / Item / Location |
| [`product/foundation/people-first.md`](product/foundation/people-first.md) | Anything that risks treating a business as more important than the people doing the work |
| [`product/foundation/agent-assistance.md`](product/foundation/agent-assistance.md) | Anything agent-shaped — the umbrella for Delegation / Assistant Context / Skills |
| [`product/foundation/canonical-examples.md`](product/foundation/canonical-examples.md) | Real situations the platform exists to serve. The working test-case set for any feature. |
| [`product/foundation/policy-framework.md`](product/foundation/policy-framework.md) | Any surface touching data sharing, monetary flow, or visibility |
| [`product/systems/item.md`](product/systems/item.md) | Any feature that creates or surfaces a thing-being-declared |
| [`product/systems/groups.md`](product/systems/groups.md) | Anything Group-shaped — Groups, joining, role-per-kind, member lists, addressable scopes, business-Group operating, partnership/co-owner shape. **Supersedes `community.md` / `member-operations.md` / `cooperative.md` per the 2026-05-10 ratification.** Any feature that risks auto-assigning Members to a Group. |
| [`product/systems/member.md`](product/systems/member.md) | Anything Person-shaped. The anchor primitive of the platform. Includes multi-Location affinities (`member_location_affinities`), DM substrate, taste profile. (Maker mode retired 2026-05-12 per amendment §6 — selling tools surface from Group/Item state.) |
| [`product/systems/location.md`](product/systems/location.md) | Anything place-shaped — permanent / recurring-temporary / area Locations, multi-Location belonging, Location-follow, the Concerts-in-the-Park surface. **The anti-Nextdoor commitment** (no Location-scoped messaging or feeds) is encoded here and in `policy-framework.md`. |
| [`product/systems/action-layer.md`](product/systems/action-layer.md) | Anything write-shaped or runtime-trust-shaped — the action handler contract, same-transaction row+event invariant, scope catalog, scoped capability vending, credential injection at the network edge, confirmation-gate enforcement, Skill sandbox. **Owns ADR-7.** Read when designing how agents transact on Members' behalf or when adding any new write capability. |
| [`product/systems/producer-bulletin.md`](product/systems/producer-bulletin.md) | Anything broadcast-to-followers — Member-authored bulletins, optional kind='business' Group branding, in-app + email delivery, rate limits, mute/unsubscribe, T2/T3 rich composition + scheduling + segmentation. Re-anchored from `vendor-bulletin.md` on 2026-05-11. |
| [`product/systems/producer-growth.md`](product/systems/producer-growth.md) | Anything producer-dashboard-shaped or BI-shaped — the founder dashboard, followers/activity/profile-health surfaces, peer benchmarks, weekly digest, T3 competitive intelligence. Backs the producer recruitment pitch and the platform-promise commitment. Re-anchored from `vendor-intelligence.md` on 2026-05-11. |
| [`product/systems/business-jurisdiction.md`](product/systems/business-jurisdiction.md) | Anything locality-claim-shaped for kind='business' Groups — the three-tier verification ladder (Tier 0 self-attested ZIP → Tier 1 SOS-verified → Tier 2 document-uploaded), `member_business_jurisdictions` substrate, the `public.zip_is_proximal_to_location()` derivation path, the public "Claimed / Verified / Documented local owner" badge. **Promoted from `product/exploration/locally-owned-verification.md` on 2026-05-11** — that doc is now historical context only. The doxxing-prevention design choice (locality ≠ address) lives here. |
| [`product/systems/payments.md`](product/systems/payments.md) | Anything money-movement-shaped — Member→Member, Member→Group, Member→external-identified-recipient commerce; closed-loop ledger + ACH via chartered partner at b2; card on-ramp with friction; stablecoin path gated at T3; the wealth-circulation rubric (fees / float / rail-ownership / lock-in) as the selection process; zero platform transaction fees on Member commerce; platform never custodies for itself. **Drafted 2026-05-12** companion to `agent-commerce-and-project-amendments.md`. The rail that honors the `bounded_purchase` Delegation scope (ADR-17). |
| [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) | What ships in the rebuild MVP and what defers |
| [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) | The rebuild plan — four phases, clean-slate, ticket sequencing. Filename retained for git history; the plan supersedes the prior 7-phase migration. |
| [`product/ui/design-language.md`](product/ui/design-language.md) | Any UI work — DLS tokens, components, CTA placement |
| [`product/surfaces/community-platform.md`](product/surfaces/community-platform.md) | Home / Explore / You / feed / discovery |
| [`product/foundation/community-design-philosophy.md`](product/foundation/community-design-philosophy.md) | The structured measuring stick — score every platform decision against the 5 sections (healthy community attributes, member journey, peer pressure & self-regulation, ownership arc, platform as enabler). When picking *what good looks like*, this wins. |
| [`product/foundation/foundational-principles.md`](product/foundation/foundational-principles.md) | The constitution — P1–P8 first principles + the Decision Test + categorical failures + metrics baseline + privacy/security baseline + monetization hypothesis. Binary pass/fail filter for every proposal. |

**Retired specs** (archived 2026-05-11 — Phase 4 cleanup): `product/systems/community.md`, `product/systems/member-operations.md`, `product/systems/cooperative.md` now live in [`product/systems/archive/`](product/systems/archive/). Do not cite as live — use `groups.md`.

**Producer-shaped systems** (2026-05-11 re-anchor). The prior vendor-shaped specs were rewritten on Members + kind='business' Groups: `vendor-bulletin.md` → [`producer-bulletin.md`](product/systems/producer-bulletin.md); `vendor-intelligence.md` → [`producer-growth.md`](product/systems/producer-growth.md). `vendor-self-service.md` was retired as superseded (Location concerns live in [`location.md`](product/systems/location.md); profile-completeness lives in `producer-growth.md` T1; the no-admin-queue principle is platform-wide). Originals in [`product/systems/archive/`](product/systems/archive/) for historical reference. Do not cite the vendor-* specs as live.

**Forward-looking, NOT b1** (do not gate b1 on these): `product/systems/delegation.md`, `assistant-context.md`, `skills.md`. See [`planning/handoffs/agent-assistance-2026-05-09.md`](planning/handoffs/agent-assistance-2026-05-09.md) for the seven open decisions parked there.

> **`groups.md` IS b1** — full surface ships at b1, including all six kinds (place / interest / practice / event_anchored / family / business). Standing-tier gate is defined in `groups.md`: ≥1 active membership in kind='business' Group OR steward-role membership in any non-business Group. ADR status: see [`planning/DECISIONS.md`](planning/DECISIONS.md) for the current register and the system-resident pointer index; superseded ADRs live in [`planning/archive/`](planning/archive/).

---

## Commit Rules

- Working in `web/` → commit to web repo (`cd web && git commit`).
- Working in `product/`, `planning/`, `development/` → commit to parent repo.
- Never cross-commit.
- Format: `T{NNN}: {title}` — one-line, no body, no co-author tag.
- Pipeline-doc changes (this file, AGENTS.md, PIPELINE-AUDIT.md) commit with `docs(pipeline): {what}` — no T-number.

## Language & Framing

Pro-competition, pro-free-market language. For all Americans.

| Avoid | Use instead |
|---|---|
| Oligarchy / corporate greed | Rigged market / market consolidation |
| Anti-capitalist / progressive values | Pro-competition / American values |
| Resist | Take back / reclaim |
| Ethical spending | Smart spending / voting with your wallet |
