---
id: how-registry
purpose: Human-scannable catalog of every project doc — what it is, what it does, where it lives.
layer: how
status: active
---

# Document Registry

> 150+ docs. Organized for scanning, not for machines. Re-generate counts after doc add/remove.
> Every narrative doc carries a stable YAML `id:` (`why-` / `what-` / `how-`). Refs may use either the file path or the id; both resolve here.

---

## Start here — PM reading list

The short list. Review these regularly — when making scope calls, evaluating features, or returning after time away.

| What it is | Doc | Why you need it |
|---|---|---|
| Constitution | [principles.md](product/foundation/principles.md) | P1–P8, the People-First Principle, the Decision Test, the one absolute |
| Data spine | [primitives.md](product/foundation/primitives.md) | Person / Item / Location / Group — every feature traces here |
| North star | [member-journey.md](product/needs/member-journey.md) | The 13 loops in 5 families — does this feature serve a loop? |
| Architecture map | [MAP.md](product/MAP.md) | One sentence per system, 100k-foot view |
| MVP scope | [bundle-1.md](planning/now/bundle-1.md) | What's in b1 and what defers |
| MVP scoreboard | [bundle-1-checklist.md](planning/now/bundle-1-checklist.md) | One-page progress check — glance at this Monday morning |
| Pipeline tracker | [STAGE-LEDGER.md](planning/STAGE-LEDGER.md) | One row per feature, which pipeline stage it's at |
| Platform decisions | [PLATFORM-PATTERNS.md](playbooks/PLATFORM-PATTERNS.md) | What the platform IS or refuses to be — check before any scope call |
| Build decisions | [DEVELOPMENT-PATTERNS.md](playbooks/DEVELOPMENT-PATTERNS.md) | How we build — commit rules, pipeline patterns, M-gates |
| Brand strategy | [brand-strategy-and-naming.md](product/exploration/brand-strategy-and-naming.md) | Voice, mascot, naming territories, structural criteria for the name |
| Feature lineage | [TRACE.md](product/TRACE.md) | Every capability traced from need to ticket |

---

# Foundation

The constitution, commitments, and policy filter.

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Constitution | [principles.md](product/foundation/principles.md) | P1–P8, People-First Principle, Decision Test, categorical failures | active |
| Rubric | [community-health-rubric.md](product/foundation/community-health-rubric.md) | Scored 0–3 audit grading platform decisions against community-health theory | active |
| Public commitments | [platform-promise.md](product/foundation/platform-promise.md) | What the platform commits to and refuses, in plain language for the thesis page | active |
| Policy filter | [policy.md](product/foundation/policy.md) | Three-filter test (helpful? harmless? abuse-resistant?), opt-out default, accountable-participation | active |
| Data spine | [primitives.md](product/foundation/primitives.md) | Person, Item, Location, Group — everything the platform does is one of these | active |

---

# Needs & Journey

Who the platform serves, what they want, how they move through it.

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Loop map | [member-journey.md](product/needs/member-journey.md) | 13 loops in 5 families (Gathering → Sharing → Trade → Pooling → Federation) | active |
| Test cases | [use-cases.md](product/needs/use-cases.md) | 12 real situations the platform exists to dissolve | active |
| Producer roadmap | [producer-roadmap.md](product/needs/producer-roadmap.md) | Producer capabilities by business function — Now / Later / Won't per category | active |

---

# Systems

The core technical specs — one per major subsystem.

### Primitives

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Member spec | [member.md](product/systems/member.md) | Anchor primitive — one row per real human, multi-location affinities, DM substrate | active |
| Item spec | [item.md](product/systems/item.md) | One kind-varying entity for everything Members declare | active |
| Location spec | [location.md](product/systems/location.md) | Permanent / recurring-temporary / area places; accountable-participation encoded | active |
| Group spec | [groups.md](product/systems/groups.md) | Self-selected sets of People organized to do things together; six kinds at b1 | active |
| Place spec | [places.md](product/systems/places.md) | Hierarchical platform-curated geographic scopes; locality URLs | active |

### Infrastructure

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Action layer | [action-layer.md](product/systems/action-layer.md) | Single transactional write path; same-tx row+event; scoped capability vending | active |
| Discovery | [discovery.md](product/systems/discovery.md) | One scoring core for feed, search, and notifications | active |
| Agent assistance | [agent-assistance.md](product/systems/agent-assistance.md) | Delegation + Assistant Context + Skills with five umbrella commitments | active |
| Payments | [payments.md](product/systems/payments.md) | Money movement scored by wealth-circulation rubric; zero platform tx fees | active |

### Extended systems

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Producer tools | [producer-tools.md](product/systems/producer-tools.md) | Bulletin broadcast + Growth dashboard for producers | active |
| Business jurisdiction | [business-jurisdiction.md](product/systems/business-jurisdiction.md) | Three-tier locally-owned verification without exposing addresses | active |
| Stewardships | [stewardships.md](product/systems/stewardships.md) | Care-floor surface — Groups looking after shared things together | draft |

---

# Capabilities

Atomic user-facing capabilities — one doc each.

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Event hosting | [event-host.md](product/capabilities/event-host.md) | Members host events from a venue-page CTA | active |
| Group create/join | [group-create-join.md](product/capabilities/group-create-join.md) | Create, browse, join, leave Groups manually | active |
| Item response | [item-respond.md](product/capabilities/item-respond.md) | Follow / Save / RSVP responses stored uniformly per Item kind | active |
| Item page | [item-view.md](product/capabilities/item-view.md) | Public Item page — owner, location, kind-appropriate response action | active |
| Landing page | [landing-page.md](product/capabilities/landing-page.md) | First-visit surface — sign up, log in, browse as guest | active |
| Member profile | [member-profile.md](product/capabilities/member-profile.md) | Member public page — bio, Items, follows, shareable URL | active |
| Producer QR | [qr-onboarding.md](product/capabilities/qr-onboarding.md) | Producer-generated QR for a business — open, unscoped; platform-generated QR ratified out | open |

---

# UI & Design

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Design language | [design-language.md](product/ui/design-language.md) | DLS tokens, six principles, component recipes, CTA patterns | active |
| Design north stars | [design-north-stars.md](product/ui/design-north-stars.md) | Airbnb (style) + TikTok (partial UX) as the big-picture references; where they conflict; the case-by-case rule | active |
| Consumer architecture | [community-platform.md](product/ui/community-platform.md) | Home / Explore / You three-page consumer architecture | active |

---

# Explorations

Ideas under investigation — not scoped, not scheduled.

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Brand strategy | [brand-strategy-and-naming.md](product/exploration/brand-strategy-and-naming.md) | Voice, mascot, naming territories, structural criteria for the platform name | exploration |
| Social integration | [social-attention-to-local-action.md](product/exploration/social-attention-to-local-action.md) | TikTok/Instagram channels — converting social attention to local action | exploration |
| Local stays | [local-stays.md](product/exploration/local-stays.md) | Short-term rentals as a platform surface — the anti-Airbnb thesis | exploration |
| Affinity groups | [affinity-derived-groups.md](product/exploration/affinity-derived-groups.md) | Surfacing Group suggestions from Member taste-overlap without auto-assignment | exploration |
| Market intelligence | [market-intelligence.md](product/exploration/market-intelligence.md) | Aggregate demand signal surfaced to producers | draft |
| Home kitchens | [mehko-home-kitchen.md](product/exploration/mehko-home-kitchen.md) | MEHKOs as early-adopter producer segment, Sacramento outreach playbook | exploration |
| Accountability | [accountability.md](product/exploration/accountability.md) | Court records and four-pillar community signals | reference |
| Missing pets | [missing-pets.md](product/exploration/missing-pets.md) | Whether the platform can help find missing pets without a community-post surface | exploration |
| Reciprocity | [reciprocity-and-goodwill.md](product/exploration/reciprocity-and-goodwill.md) | Open design question on Offer/Ask reciprocity and goodwill | reference |
| Vetting & vouching | [vetting-and-vouching.md](product/exploration/vetting-and-vouching.md) | Community-powered vetting and vouching for producers and products | exploration |
| Locally made | [locally-made.md](product/exploration/locally-made.md) | Locally Made provenance badge — paused, proximity model unresolved | exploration |

---

# Planning — Active Bundle

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| MVP overview | [bundle-1.md](planning/now/bundle-1.md) | b1 Primitives MVP — hypothesis, what's in, what defers, success metrics | active |
| Scoreboard | [bundle-1-checklist.md](planning/now/bundle-1-checklist.md) | One-page progress check for b1, in human terms | active |
| Sub-themes | [bundle-1-themes.md](planning/now/bundle-1-themes.md) | 1–2 week slices per bundle (b1.0–b1.6, b2, b3) | active |
| Surface sequence | [plan-b1-surface-sequence.md](planning/now/plan-b1-surface-sequence.md) | Active sequence for remaining b1 user-surface work | queued |
| Phase 3 overview | [initiative-phase-3.md](planning/now/initiative-phase-3.md) | Nine candidate Phase 3 items, each a standalone backlog stub | active |
| Sell walkthrough | [scenario-F036-...md](planning/now/scenario-F036-member-creates-business-group-via-sell-walkthrough.md) | In-build scenario — Sell walkthrough creates a business Group | draft |

---

# Planning — Pipeline Tracking

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Stage ledger | [STAGE-LEDGER.md](planning/STAGE-LEDGER.md) | One row per feature — which pipeline stage it's at | active |
| Spec patches | [SPEC-PATCHES.md](planning/SPEC-PATCHES.md) | Build → Product return queue — specs flagged during build | active |
| Releases index | [RELEASES.md](planning/RELEASES.md) | One-line index of every shipped version | active |
| Agent bounds | [AGENT-BOUNDS.md](planning/AGENT-BOUNDS.md) | Intent / Bounds / Casebook — what agents can decide alone vs escalate | active |

---

# Planning — Scenarios (approved, ready for build)

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Follows surface | [scenario-F042-...md](planning/next/scenario-F042-member-follows-producer-group-venue.md) | Member follows producer, Group, venue — two-level `/you` + `/you/following` | approved |
| Venue page | [review-F042.md](planning/next/review-F042.md) | Review for F042 — PROCEED | active |
| Reorg: YAML IDs | [reorg-12-yaml-doc-ids.md](planning/done/2026-05-30-reorg-yaml-doc-ids/reorg-12-yaml-doc-ids.md) | Inject stable YAML id fields into doc front-matter | ratified |

---

# Planning — Scenarios (backlog)

Drafts not yet approved. The build agent cannot read these.

| What it is | Doc | Scenario | Status |
|---|---|---|---|
| Run club | [scenario-F018-...md](planning/done/2026-06-02-backlog-cleanup/scenario-F018-brian-declares-run-club.md) | Brian declares the Run Club gathering at Drake's | draft |
| Signup flow | [scenario-F030-...md](planning/now/scenario-F030-newcomer-signs-up-and-lands-in-feed.md) | Newcomer signs up, picks locality + interests, lands in feed | draft |
| Place-interest scope | [scenario-F031-...md](planning/backlog/scenario-F031-member-manages-place-interest-scope.md) | Member tunes awareness scope with secondary Place-interests | draft |
| Member page | [scenario-F032-...md](planning/now/scenario-F032-viewer-finds-member-page-and-follows.md) | Viewer finds Member page, taps follow | draft |
| Venue page | [scenario-F033-...md](planning/backlog/scenario-F033-viewer-finds-venue-page.md) | Viewer finds venue page, sees what's happening there | draft |
| Recurring gathering | [scenario-F034-...md](planning/now/scenario-F034-member-hosts-recurring-gathering.md) | Member hosts recurring gathering at an existing venue | draft |
| Group page | [scenario-F035-...md](planning/done/2026-06-02-backlog-cleanup/scenario-F035-viewer-finds-group-page.md) | Viewer finds Group page (community + business kinds) | draft |
| Locally owned | [scenario-F037-...md](planning/done/2026-06-02-superseded-producer-scenarios/scenario-F037-producer-claims-locally-owned.md) | Producer claims Tier 0 Locally Owned badge | draft |
| List product | [scenario-F038-...md](planning/now/scenario-F038-producer-lists-product.md) | Producer lists a product via the composer | draft |
| Locally made | [scenario-F039-...md](planning/done/2026-06-02-superseded-producer-scenarios/scenario-F039-producer-claims-locally-made.md) | Producer claims Locally Made provenance badge (deferred) | draft |
| List service | [scenario-F040-...md](planning/now/scenario-F040-producer-lists-service.md) | Producer lists a service via the composer | draft |
| QR card | [scenario-F041-...md](planning/done/2026-06-18-f041-qr-card/scenario-F041-producer-generates-qr-card.md) | Producer generates a print-quality QR card | retired 2026-09-03 |
| Integration test | [scenario-F043-...md](planning/backlog/scenario-F043-newcomer-completes-journey-under-target.md) | Newcomer completes full journey under 90s target | draft |
| F018 decision | [decision-F018-flagship.md](planning/backlog/decision-F018-flagship.md) | Whether F018 stays the flagship walkthrough | proposed |
| Story template | [USER-STORY-TEMPLATE.md](planning/done/2026-06-02-backlog-cleanup/USER-STORY-TEMPLATE.md) | Redirect to the real scenario template in skills/ | reference |

---

# Planning — Phase 3 Stubs

Future work items — not yet scenarios.

| What it is | Doc | Status |
|---|---|---|
| No-login explore index | [initiative-phase-3-explore-no-login-index.md](planning/backlog/initiative-phase-3-explore-no-login-index.md) | stub |
| Group browse index | [initiative-phase-3-group-browse-index.md](planning/backlog/initiative-phase-3-group-browse-index.md) | stub |
| Group create flow | [initiative-phase-3-group-create-flow.md](planning/backlog/initiative-phase-3-group-create-flow.md) | stub |
| Onboarding group suggestion | [initiative-phase-3-onboarding-group-suggestion.md](planning/backlog/initiative-phase-3-onboarding-group-suggestion.md) | stub |
| Saved-search composer | [initiative-phase-3-saved-search-composer.md](planning/backlog/initiative-phase-3-saved-search-composer.md) | stub |
| Stewardships surface | [initiative-phase-3-stewardships.md](planning/backlog/initiative-phase-3-stewardships.md) | stub |
| Thesis page | [initiative-phase-3-thesis-page.md](planning/backlog/initiative-phase-3-thesis-page.md) | stub |
| Wonder composer | [initiative-phase-3-wonder-composer.md](planning/backlog/initiative-phase-3-wonder-composer.md) | stub |
| Wonder conversion | [initiative-phase-3-wonder-conversion.md](planning/backlog/initiative-phase-3-wonder-conversion.md) | stub |

---

# Planning — Archived

| What it is | Doc | Status |
|---|---|---|
| b1 primitives plan | [b1-primitives-plan.md](planning/done/2026-06-01-bundles-atomized/b1-primitives-plan.md) | active |
| b1 work map | [b1-primitives-work-map.md](planning/done/2026-06-01-bundles-atomized/b1-primitives-work-map.md) | active |

---

# Playbooks

Decisions in force and how-to-write canon.

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Platform decisions | [PLATFORM-PATTERNS.md](playbooks/PLATFORM-PATTERNS.md) | What the platform IS or refuses to be | active |
| Build decisions | [DEVELOPMENT-PATTERNS.md](playbooks/DEVELOPMENT-PATTERNS.md) | How we build — pipeline patterns, M-gates, anti-patterns | active |
| Decision-making | [DECISION-PATTERNS.md](playbooks/DECISION-PATTERNS.md) | The close-call rule, the lexicographic tiebreaker, the one absolute | active |
| Deployment pipeline | [deployment-pipeline.md](playbooks/deployment-pipeline.md) | Local → staging → production go-live path | draft |
| Writing docs | [writing-docs.md](playbooks/writing-docs.md) | How to write any doc in this repo — where things live, style rules, templates | active |
| Repo tidying | [repo-tidying.md](playbooks/repo-tidying.md) | What tidy looks for — ten findings with triggers and dispositions | active |

---

# Standards

Cross-cutting build qualities. All placeholders pending real content.

| What it is | Doc | Status |
|---|---|---|
| Overview | [README.md](standards/README.md) | reference |
| Safety | [safety.md](standards/safety.md) | draft |
| Security | [security.md](standards/security.md) | draft |
| Accessibility | [accessibility.md](standards/accessibility.md) | draft |
| Performance | [performance.md](standards/performance.md) | draft |
| Responsiveness | [responsiveness.md](standards/responsiveness.md) | draft |

---

# Development — Open Tickets

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Report shape | [T067-report-shape.md](development/tickets/T067-report-shape.md) | Install the BLUF report shape across pipeline-skill surfaces | active |
| Follows reader + /you summary | [T108-...md](development/tickets/done/T108-unified-follows-reader-and-you-summary.md) | Unified follows data reader + `/you` summary card scroll | open |
| /you/following page | [T109-...md](development/tickets/done/T109-you-following-management-page.md) | Full management page with People/Groups/Venues sections | open |

---

# Development — Completed Tickets

58 completed tickets in [`development/tickets/done/`](development/tickets/done/).

<details>
<summary>Full list (click to expand)</summary>

| Ticket | What it built |
|---|---|
| T001 | Project init |
| T002 | Database schema |
| T003 | Auth |
| T004 | Map view colored pins |
| T005 | Pin clustering |
| T006 | Map search |
| T007 | Business detail card |
| T008 | Business registration |
| T009 | Shareable listing |
| T010 | Support button |
| T011 | Report concern |
| T012 | Market schema |
| T013 | Bottom navigation |
| T014 | Home feed |
| T015 | Explore search map |
| T016 | Market selection modal |
| T017 | Vendor profile update |
| T018 | Follow vendor |
| T021 | Tide accent and CTA patterns |
| T022 | Foundational schema |
| T023 | You page restructure |
| T024 | Events driven home feed |
| T025 | Vendor bulletin compose |
| T026 | Vendor founder dashboard |
| T041 | Extensions and embedding tables |
| T042 | Members floor and system member |
| T043 | Action layer scaffold and member create |
| T044 | Auth signup hook |
| T045 | Locations schema |
| T046 | Locations RLS fixes |
| T047 | Members phase 1 — FK, privacy, handle history |
| T048 | Member interests and follows |
| T049 | Member location affinities |
| T050 | Member agent assistance substrate |
| T051 | Action layer CI enforcement |
| T052 | Phase 0 eval helpers |
| T053 | Phase 1 eval helpers |
| T054 | Member delegations scopes check fix |
| T055 | Groups schema |
| T056 | Items schema |
| T057 | Discoverable items |
| T065 | Stryker mutation testing |
| T066 | County tier and URL compression |

</details>

---

# Pipeline — Skills

Internal pipeline skills. Agents read these; humans generally don't need to.

| Skill | Path |
|---|---|
| atomize | [skills/atomize/SKILL.md](skills/atomize/SKILL.md) |
| build | [skills/build/SKILL.md](skills/build/SKILL.md) |
| explore | [skills/explore/SKILL.md](skills/explore/SKILL.md) |
| loop-designer | [skills/loop-designer/SKILL.md](skills/loop-designer/SKILL.md) |
| memo | [skills/memo/SKILL.md](skills/memo/SKILL.md) |
| orient | [skills/orient/SKILL.md](skills/orient/SKILL.md) |
| review | [skills/review/SKILL.md](skills/review/SKILL.md) |
| scope | [skills/scope/SKILL.md](skills/scope/SKILL.md) |
| test | [skills/test/SKILL.md](skills/test/SKILL.md) |
| ticket | [skills/ticket/SKILL.md](skills/ticket/SKILL.md) |
| tidy | [skills/tidy/SKILL.md](skills/tidy/SKILL.md) |
| weigh | [skills/weigh/SKILL.md](skills/weigh/SKILL.md) |

---

# Reference — Process & Navigation

| What it is | Doc | Purpose | Status |
|---|---|---|---|
| Architecture map | [MAP.md](product/MAP.md) | One sentence per system — the 100k-foot view | active |
| Feature lineage | [TRACE.md](product/TRACE.md) | Every capability traced from need to ticket | active |
| Pipeline rules | [AGENTS.md](AGENTS.md) | Read/write firewalls, gates, escalation contacts | active |
| Deviations log | [DEVIATIONS.md](development/DEVIATIONS.md) | Per-ticket implementation-vs-spec drift | active |
| Idea intake | [idea-intake.md](product/templates/idea-intake.md) | Paste-in template producing pipeline artifacts from raw ideas | active |
