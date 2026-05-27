# Document inventory — what each doc does, and where they overlap

*Drafted 2026-05-19. Every active doc outside `web/`, boiled to its essence in under 10 words. Built to expose overlap so the doc set can shrink to an essential few.*

Status flags: **live** · **stale** (pre-primitives vocabulary, content outdated) · **superseded / dead** (file exists only to catch links).

---

## Part 1 — The full inventory

### Root

| Doc | What it does (essence) | Status |
|---|---|---|
| `CLAUDE.md` | Project router: facts, primitives, naming rules, skill routing. | live |
| `AGENTS.md` | Defines pipeline roles, firewalls, read/write permissions. | live |
| `JOURNAL.md` | Reverse-chron log of what shipped, what's next. | live |

### product/foundation/ — the "why" layer (9 docs)

| Doc | What it does (essence) | Status |
|---|---|---|
| `foundational-principles.md` | The constitution: P1–P8 plus a binary decision test. | live |
| `community-design-philosophy.md` | Scored rubric grading decisions against community-health theory. | live |
| `people-first.md` | Bans corporate shells; everything traces to a person. | live |
| `loops.md` | The 13 behavioral "loops" the platform must serve. | live |
| `primitives.md` | Defines the Person/Item/Location/Group data spine. | live |
| `policy-framework.md` | Three-filter test for privacy/money/visibility decisions. | live |
| `agent-assistance.md` | Umbrella commitments binding the three agent primitives. | live |
| `canonical-examples.md` | Twelve real situations used as the test-case set. | live |
| `platform-promise.md` | Plain-language public commitments for the thesis page. | live |

### product/MAP.md

| Doc | What it does (essence) | Status |
|---|---|---|
| `MAP.md` | One-sentence-per-system architecture index with consistency checks. | live |

### product/systems/ — the "what we built" layer (13 docs)

| Doc | What it does (essence) | Status |
|---|---|---|
| `member.md` | Anchor primitive: one row per real human. | live |
| `item.md` | One kind-varying entity for everything declared. | live |
| `location.md` | One primitive for venue/area/region; encodes anti-Nextdoor. | live |
| `groups.md` | The people-not-shells primitive replacing community/cooperative/business. | live |
| `action-layer.md` | One transactional write path; vends agent capabilities. | live |
| `discovery.md` | One scoring core for feed, search, notifications. | live |
| `delegation.md` | Scoped, expiring grants letting agents act for members. | live |
| `assistant-context.md` | Member-owned, agent-readable preferences document. | live |
| `skills.md` | Versioned capability bundles a member's assistant subscribes to. | live |
| `payments.md` | Money movement scored by a wealth-circulation rubric. | live |
| `business-jurisdiction.md` | Three-tier "locally owned" verification without exposing addresses. | live |
| `producer-bulletin.md` | Broadcast surface turning follows into subscriptions. | live |
| `producer-growth.md` | Business-intelligence dashboard backing the producer recruitment pitch. | live |

### product/capabilities/ + surfaces/ + ui/ — the "what members can do" layer (13 docs)

| Doc | What it does (essence) | Status |
|---|---|---|
| `capabilities/landing-page.md` | First-visit surface: sign up, log in, browse. | live |
| `capabilities/member-profile.md` | Member's public page: bio, items, follows. | stale (wrong URL, "Communities" wording) |
| `capabilities/item-view.md` | Public item page: owner, location, response action. | live |
| `capabilities/item-respond.md` | Follow/Save/RSVP responses stored uniformly. | live |
| `capabilities/item-create.md` | Records why the unified composer was split. | superseded (self-marked) |
| `capabilities/event-host.md` | Member hosts an event from a venue CTA. | live |
| `capabilities/group-create-join.md` | Create, browse, join, leave groups manually. | live |
| `capabilities/consumer-feed.md` | Home feed of nearby items, locality-scoped. | live |
| `capabilities/locality-browse.md` | Anonymous proximity catalog search at /explore. | live |
| `capabilities/shareable-listing.md` | Every entity gets a stable shareable preview URL. | live |
| `capabilities/qr-onboarding.md` | Member-requestable printable QR card for any item. | live |
| `surfaces/community-platform.md` | Home/Explore/You three-page consumer architecture. | live |
| `ui/design-language.md` | Design tokens, component recipes, CTA patterns. | live |

### product/exploration/ — raw incubation (6 docs)

| Doc | What it does (essence) | Status |
|---|---|---|
| `reciprocity-and-goodwill.md` | Parks the Offer/Ask abuse design question. | live (parked question) |
| `business-accountability.md` | Public-record transparency badges, actions over beliefs. | stale (pre-primitives) |
| `community-accountability-model.md` | BBB-style four-pillar accountability system. | stale (pre-primitives) |
| `local-food-network.md` | Know-your-farmer direct producer-to-consumer network. | stale (pre-primitives) |
| `small-business-incubator.md` | Crowdfund businesses that don't exist yet. | stale (pre-primitives) |
| `business-intelligence-platform.md` | Demand-signal/gap-analysis BI product for retailers. | stale (pre-primitives) |

### product/templates/

| Doc | What it does (essence) | Status |
|---|---|---|
| `templates/idea-intake.md` | Paste-in template producing pipeline artifacts. | live |

### planning/ — the "what ships next" layer (16 docs)

| Doc | What it does (essence) | Status |
|---|---|---|
| `DECISIONS.md` | Pointer index mapping every ADR to status. | live |
| `pending-ratifications.md` | Register of unratified absolutes awaiting decision. | live |
| `PIPELINE-AUDIT.md` | One-time 2026-05-09 audit that drove the pipeline rewrite. | stale (historical) |
| `bundles/b1-primitives.md` | Defines b1 MVP scope in primitive terms. | live |
| `bundles/bundle-themes.md` | Sequences bundles into 1–2 week sub-themes. | live |
| `bundles/b1-work-map.md` | Menu of b1 work tagged core/recommended/defer. | live |
| `bundles/stewardships.md` | Specs the stewardship ship-theme (a misfiled system spec). | live |
| `scenarios-backlog/F018-brian-declares-run-club.md` | The canonical Run Club scenario (deferred). | live |
| `scenarios-backlog/USER-STORY-TEMPLATE.md` | Redirect stub to the real template in skills/. | dead |
| `reviews/F018-review.md` | Architecture/design pre-flight verdict on F018. | live |
| `reviews/agent-assistance-architecture-review-2026-05-09.md` | Architecture critique of the agent-assistance specs. | stale (historical) |
| `reviews/agent-assistance-people-first-review-2026-05-09.md` | Principles critique of the same specs. | stale (historical) |
| `reviews/agent-assistance-planning-filter-review-2026-05-09.md` | Scope critique of the same specs. | stale (historical) |
| `reviews/agent-assistance-security-privacy-review-2026-05-09.md` | Security critique of the same specs. | stale (historical) |
| `handoffs/agent-assistance-2026-05-09.md` | Parks agent-assistance as non-b1; digests the four reviews. | stale (historical) |
| `walkthroughs/F018-pipeline-trace.md` | Traces F018 through every pipeline stage. | live (teaching artifact) |
| `outreach/outreach-list.md` | Founder-recruitment list for Sacramento. | live (operational) |

### planning/adrs/ (16 files)

| Doc | What it does (essence) | Status |
|---|---|---|
| `adrs/README.md` | Defines ADR format, lifecycle, naming convention. | live |
| `adrs/_template.md` | The blank ADR scaffold. | live |
| `adrs/ADR-0001 … ADR-0019` (14) | One ratified architectural decision per file. | live |

### development/

| Doc | What it does (essence) | Status |
|---|---|---|
| `DEVIATIONS.md` | Per-ticket log of implementation-vs-spec drift. | live |
| `tickets/` (set) | Implementation tasks. Mechanical — no overlap problem. | live |

### notes/

| Doc | What it does (essence) | Status |
|---|---|---|
| `migration-to-primitives.md` | The approved clean-slate rebuild plan. | live |
| `cowork-sandbox-git-bug.md` | Documents the git-lock sandbox bug and workaround. | live (devops) |
| `eval-helpers-architecture.md` | Redirect stub to ADR-0018. | dead |

### skills/ (set)

| Doc | What it does (essence) | Status |
|---|---|---|
| `skills/` (17 pipeline skills) | The agent-pipeline tooling. Process, not product docs. | live |

---

## Part 2 — The overlap map

Seven clusters of redundancy. This is where the doc count is inflated.

**1. The decision-rubric triplication (foundation).** `foundational-principles.md`, `community-design-philosophy.md`, and `policy-framework.md` all do one job: give a reader a test to grade a proposal. They already carry "when this conflicts with that, prefer…" clauses — a tell that the boundary isn't clean.

**2. The verbatim copy-paste (foundation).** `people-first.md` repeats the "single Never," the central premise, and the categorical-failures list **word-for-word** from `foundational-principles.md`. Editing one silently desyncs the other. This is the clearest example of a bad name hiding a redundant doc — "people-first" is really one principle, not its own document.

**3. The agent-assistance quad (systems + foundation).** `agent-assistance.md` (foundation) plus `delegation.md`, `assistant-context.md`, `skills.md` (systems) read like four chapters of one system. They re-explain the same standing-tier gate and scope vocabulary repeatedly.

**4. The producer pair (systems).** `producer-bulletin.md` defines bulletin stats; `producer-growth.md` re-specs "bulletin analytics" as a dashboard tab. The same metrics are owned twice.

**5. The discovery-surface triangle (capabilities + surfaces).** `consumer-feed.md`, `locality-browse.md`, and `surfaces/community-platform.md` all describe the same Home feed and Explore catalog. `community-platform.md` re-specs in full what the two capability files already own. `ui/design-language.md` independently re-specs the same Item/venue pages a fourth time.

**6. The agent-assistance review pile (planning).** Four reviews plus one handoff — five files — all examine the same four specs from the same 2026-05-09 session. The handoff explicitly digests the four reviews.

**7. The b1 bundle layering (planning).** `b1-primitives.md`, `bundle-themes.md`, `b1-work-map.md` are intentionally layered (scope → sequence → menu) but each restates the others' "what ships / deferred" lists, so they drift together.

**Plus dead weight to delete outright:** `item-create.md`, `USER-STORY-TEMPLATE.md`, `eval-helpers-architecture.md` (3 dead/superseded), the 4 stale pre-primitives exploration docs, and `PIPELINE-AUDIT.md` (historical). That is 8 docs gone for near-zero cost.

---

## Part 3 — Consolidation proposal: a what / why / how spine

You said you like the **what / why / how** framing and that the priority is tracing a ticket back to all three. That maps cleanly onto three top areas. Loop names stay in the spec layer (per the naming convention) but the human-facing doc gets a name a person understands.

| Area | The question it answers | What lives there |
|---|---|---|
| **WHY** | Why does this platform exist, and what does it refuse? | Principles, the decision test, primitives |
| **WHAT** | Who is it for and what do they do? | People & needs, member goals (the loops, renamed), systems, capabilities |
| **HOW** | How do we decide, sequence, ship, and keep quality? | Architecture decisions, pipeline, bundles, and the cross-cutting standards (safety, security, responsiveness…) |

### WHY — collapse 9 foundation docs toward ~4

- **`principles.md`** — merge `foundational-principles.md` + `people-first.md` + the rubric half of `community-design-philosophy.md`. One constitution, one decision test, one source of truth. (Resolves overlaps 1 and 2.)
- **`primitives.md`** — keep. The data spine.
- **`policy-framework.md`** — keep as the operational three-filter test, or fold into `principles.md` if you want one rubric only.
- **`platform-promise.md`** — keep only as the thin public-voice restatement, explicitly derived from `principles.md`.
- `loops.md` → moves to WHAT and gets renamed (see below). `canonical-examples.md` → moves to WHAT as the situations file. `agent-assistance.md` → moves next to the agent system.

### WHAT — the layer you are missing

- **`needs/`** (new) — `people.md` (personas), `situations.md` (relocated `canonical-examples.md`), `needs.md` (the ranked human needs).
- **`member-goals.md`** — `loops.md` content, renamed. "Loops" means nothing to a person; "what people come here to do" does. The 13 loops survive as content and as spec language; the doc title speaks human.
- **`systems/`** — collapse the agent-assistance quad (4 → 1 with sections) and the producer pair (2 → 1, or keep 2 with analytics owned once). 13 → ~10.
- **`capabilities/`** — collapse the discovery triangle (3 → 1), delete `item-create.md`, fold `shareable-listing.md` into the pages it sits on. 11 + 1 surface → ~7.

### HOW — mostly fine, plus a home for your "100 other things"

- Architecture decisions (`adrs/`, `DECISIONS.md`), pipeline (`AGENTS.md`), sequencing (`bundles/`), drift (`DEVIATIONS.md`), the rebuild plan all stay.
- **`standards/`** (new) — the home for the cross-cutting concern docs you said are coming: safety, security, responsiveness, accessibility, performance. These are *not* "what people do in the app" — they are qualities the build must satisfy. They belong under HOW, referenced by ADRs and reviews. Putting them here keeps them out of the product-narrative layer where they would dilute the human-needs story.
- `PIPELINE-AUDIT.md` → archive (its findings already live in `AGENTS.md`). The agent-assistance review pile → archive as one historical bundle.

### The headline number

Roughly **40 product + planning narrative docs today → about 22–24** consolidated. Eight are dead or stale and leave for free. The rest is merging seven overlap clusters. ADRs, tickets, and skills are untouched — they are mechanical and have no overlap problem.

---

## Part 4 — Decisions for Don

1. **Adopt the what / why / how spine** as the top-level mental model — yes, or a different split?
2. **The big merge** — collapse the three foundation rubrics into one `principles.md`? This is the highest-overlap fix and the highest-value one.
3. **Rename `loops.md`** to something a person understands (e.g. `member-goals.md`) — yes?
4. **A `standards/` area under HOW** for safety/security/responsiveness and the rest — yes, or do you picture those elsewhere?
5. **Delete the 8 dead/stale docs now** (3 dead stubs, 4 stale exploration, PIPELINE-AUDIT) — approve as a free first pass?

**Restated:** the doc count is inflated by seven overlap clusters and eight dead/stale files; a what/why/how spine plus those merges takes ~40 narrative docs down to ~22–24. The five decisions above are the gate. Nothing has been moved or merged yet.
