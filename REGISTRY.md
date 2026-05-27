---
purpose: Catalog of every narrative doc, grouped by why / what / how layer.
layer: how
status: active
---

# Document registry

> Every narrative doc in this repo, its purpose, and its status.
> If a doc is not here, it should not exist. If you cannot write a distinct one-line purpose for a new doc, fold it into an existing one instead.
> Generated from each doc's `purpose` front-matter. Re-generate by re-running the R09 generator (or by hand on small changes).

**Meta / navigational docs** are catalogued in a dedicated Meta section at the bottom — they're the navigation, not the content.

**Total catalogued:** 117 narrative docs by layer + 6 meta / navigational docs = 123 docs. **Excluded:** everything under `_attic/`, `housekeeping/`, `web/`, `skills/`.

## WHY — product/foundation/

| Doc | Purpose | Status |
|---|---|---|
| `product/foundation/design-philosophy.md` | Scored 0–3 rubric grading platform decisions against community-health theory. | active |
| `product/foundation/platform-promise.md` | Public-voice commitments derived from the principles, for the thesis page. | active |
| `product/foundation/policy.md` | Three-filter test for privacy, revenue, monetary, data-sharing decisions. | active |
| `product/foundation/primitives.md` | Defines the Person, Item, Location, and Group data spine. | active |
| `product/foundation/principles.md` | Constitution: P1–P8, People-First Principle, Decision Test, categorical failures. | active |

## WHAT — product/needs · systems · capabilities · ui · exploration · templates

| Doc | Purpose | Status |
|---|---|---|
| `product/capabilities/event-host.md` | Members host events from a venue-page CTA. | active |
| `product/capabilities/group-create-join.md` | Create, browse, join, leave Groups manually. | active |
| `product/capabilities/item-respond.md` | Follow / Save / RSVP responses stored uniformly per Item kind. | active |
| `product/capabilities/item-view.md` | Public Item page — owner, location, kind-appropriate response action. | active |
| `product/capabilities/landing-page.md` | First-visit surface — sign up, log in, browse as guest. | active |
| `product/capabilities/member-profile.md` | Member public page — bio, Items, follows, shareable URL. | active |
| `product/capabilities/qr-onboarding.md` | Member-requestable printable QR card for any Item. | active |
| `product/exploration/accountability.md` | Two framings of accountability: court records and four-pillar community signals. | reference |
| `product/exploration/affinity-derived-groups.md` | b2+ exploration — Groups suggested from interest + Saved-search overlap. | exploration |
| `product/exploration/local-stays.md` | Short-term rentals as a platform surface — anti-Airbnb thesis. | exploration |
| `product/exploration/market-intelligence.md` | Platform-wide market-intelligence direction (separate from producer-tools). | exploration |
| `product/exploration/member-geography-redesign.md` | Source-of-record for the member↔geography substrate split (drove ADR-21). | exploration |
| `product/exploration/reciprocity-and-goodwill.md` | Open design question on Offer/Ask reciprocity and goodwill. | reference |
| `product/needs/member-journey.md` | The 13 loops Members move through, in five families. | active |
| `product/needs/needs.md` | Ranked human needs traced to systems, capabilities, and personas. | draft |
| `product/needs/people.md` | Personas the platform serves — one role per section. | draft |
| `product/needs/use-cases.md` | Twelve real situations the platform exists to dissolve. | active |
| `product/systems/action-layer.md` | One transactional write path; vends agent capabilities per turn. | active |
| `product/systems/agent-assistance.md` | Delegation + Assistant Context + Skills with five umbrella commitments. | active |
| `product/systems/business-jurisdiction.md` | Three-tier locally-owned verification without exposing addresses. | active |
| `product/systems/discovery.md` | One scoring core for feed, search, and notifications. | active |
| `product/systems/groups.md` | Self-selected sets of People organized to do things together. | active |
| `product/systems/item.md` | One kind-varying entity for everything Members declare. | active |
| `product/systems/location.md` | Permanent / recurring-temporary / area places; anti-Nextdoor encoded. | active |
| `product/systems/member.md` | Anchor primitive — one row per real human. | active |
| `product/systems/payments.md` | Money movement scored by a wealth-circulation rubric. | active |
| `product/systems/places.md` | Places primitive — recognized geographic scope for locality URLs. | active |
| `product/systems/producer-tools.md` | Bulletin broadcast and Growth dashboard for producer-capacity Members. | active |
| `product/systems/stewardships.md` | Care-floor surface — Groups looking after shared things together. | draft |
| `product/ui/community-platform.md` | Home / Explore / You three-page consumer architecture. | active |
| `product/ui/design-language.md` | Design tokens, component recipes, CTA patterns. | active |

## HOW — planning · development · standards · meta

| Doc | Purpose | Status |
|---|---|---|
| `development/DEVIATIONS.md` | Per-ticket log of implementation-vs-spec drift across the build. | active |
| `development/tickets/T054-member-delegations-scopes-check-fix.md` | Ticket T054 — member delegations scopes check fix. | active |
| `development/tickets/T055-groups-schema.md` | Ticket T055 — groups schema. | active |
| `development/tickets/T056-items-schema.md` | Ticket T056 — items schema. | active |
| `development/tickets/T057-discoverable-items.md` | Ticket T057 — discoverable items. | active |
| `development/tickets/done/T001-project-init.md` | Ticket T001 — project init. | reference |
| `development/tickets/done/T002-database-schema.md` | Ticket T002 — database schema. | reference |
| `development/tickets/done/T003-auth.md` | Ticket T003 — auth. | reference |
| `development/tickets/done/T004-map-view-colored-pins.md` | Ticket T004 — map view colored pins. | reference |
| `development/tickets/done/T005-pin-clustering.md` | Ticket T005 — pin clustering. | reference |
| `development/tickets/done/T006-map-search.md` | Ticket T006 — map search. | reference |
| `development/tickets/done/T007-business-detail-card.md` | Ticket T007 — business detail card. | reference |
| `development/tickets/done/T008-business-registration.md` | Ticket T008 — business registration. | reference |
| `development/tickets/done/T009-shareable-listing.md` | Ticket T009 — shareable listing. | reference |
| `development/tickets/done/T010-support-button.md` | Ticket T010 — support button. | reference |
| `development/tickets/done/T011-report-concern.md` | Ticket T011 — report concern. | reference |
| `development/tickets/done/T012-market-schema.md` | Ticket T012 — market schema. | reference |
| `development/tickets/done/T013-bottom-navigation.md` | Ticket T013 — bottom navigation. | reference |
| `development/tickets/done/T014-home-feed.md` | Ticket T014 — home feed. | reference |
| `development/tickets/done/T015-explore-search-map.md` | Ticket T015 — explore search map. | reference |
| `development/tickets/done/T016-market-selection-modal.md` | Ticket T016 — market selection modal. | reference |
| `development/tickets/done/T017-vendor-profile-update.md` | Ticket T017 — vendor profile update. | reference |
| `development/tickets/done/T018-follow-vendor.md` | Ticket T018 — follow vendor. | reference |
| `development/tickets/done/T021-tide-accent-and-cta-patterns.md` | Ticket T021 — tide accent and cta patterns. | reference |
| `development/tickets/done/T022-foundational-schema.md` | Ticket T022 — foundational schema. | reference |
| `development/tickets/done/T023-you-page-restructure.md` | Ticket T023 — you page restructure. | reference |
| `development/tickets/done/T024-events-driven-home-feed.md` | Ticket T024 — events driven home feed. | reference |
| `development/tickets/done/T025-vendor-bulletin-compose.md` | Ticket T025 — vendor bulletin compose. | reference |
| `development/tickets/done/T026-vendor-founder-dashboard.md` | Ticket T026 — vendor founder dashboard. | reference |
| `development/tickets/done/T041-extensions-and-embedding-tables.md` | Ticket T041 — extensions and embedding tables. | reference |
| `development/tickets/done/T042-members-floor-and-system-member.md` | Ticket T042 — members floor and system member. | reference |
| `development/tickets/done/T043-action-layer-scaffold-and-member-create.md` | Ticket T043 — action layer scaffold and member create. | reference |
| `development/tickets/done/T044-auth-signup-hook.md` | Ticket T044 — auth signup hook. | reference |
| `development/tickets/done/T045-locations-schema.md` | Ticket T045 — locations schema. | reference |
| `development/tickets/done/T046-locations-rls-fixes.md` | Ticket T046 — locations rls fixes. | reference |
| `development/tickets/done/T047-members-phase1-fk-privacy-handle-history.md` | Ticket T047 — members phase1 fk privacy handle history. | reference |
| `development/tickets/done/T048-member-interests-and-follows.md` | Ticket T048 — member interests and follows. | reference |
| `development/tickets/done/T049-member-location-affinities.md` | Ticket T049 — member location affinities. | reference |
| `development/tickets/done/T050-member-agent-assistance-substrate.md` | Ticket T050 — member agent assistance substrate. | reference |
| `development/tickets/done/T051-action-layer-ci-enforcement.md` | Ticket T051 — action layer ci enforcement. | reference |
| `development/tickets/done/T052-phase-0-eval-helpers.md` | Ticket T052 — phase 0 eval helpers. | reference |
| `development/tickets/done/T053-phase-1-eval-helpers.md` | Ticket T053 — phase 1 eval helpers. | reference |
| `planning/DECISIONS.md` | Pointer index mapping every ADR to status and home. | active |
| `planning/adrs/ADR-0001-tech-stack.md` | ADR-1 — Next.js + Supabase + Mapbox + Vercel stack. | active |
| `planning/adrs/ADR-0002-bottom-anchored-ui.md` | ADR-2 — bottom-anchored UI for mobile thumb reachability. | active |
| `planning/adrs/ADR-0004-locality-default.md` | ADR-4 — locality default is geolocate-then-city-pick, mutable. | active |
| `planning/adrs/ADR-0005-markets-as-gathering-items.md` | ADR-5 — markets are gathering Items, not a separate kind. | active |
| `planning/adrs/ADR-0006-agent-assistance.md` | ADR-6 — agent assistance is first-class with three primitives. | active |
| `planning/adrs/ADR-0007-action-layer.md` | ADR-7 — action layer is the only write path. | active |
| `planning/adrs/ADR-0009-policy-framework.md` | ADR-9 — three-filter test + opt-out default + anti-Nextdoor. | active |
| `planning/adrs/ADR-0013-groups-consolidation.md` | ADR-13 — Groups supersedes community/cooperative/business split. | active |
| `planning/adrs/ADR-0014-location-spine-child.md` | ADR-14 — Location spine + child tables per kind. | active |
| `planning/adrs/ADR-0015-members-auth-pk-equality.md` | ADR-15 — members.id equals auth.users.id (same UUID). | active |
| `planning/adrs/ADR-0016-affinity-row-privacy.md` | ADR-16 — RLS owner-only on member_location_affinities; aggregate functions only. | active |
| `planning/adrs/ADR-0017-bounded-purchase-scope.md` | ADR-17 — bounded_purchase Delegation scope for agent-mediated one-time purchases. | active |
| `planning/adrs/ADR-0018-eval-helpers.md` | ADR-18 — eval-helpers package and bootstrap pattern. | active |
| `planning/adrs/ADR-0019-clean-slate-rebuild.md` | ADR-19 — clean-slate rebuild on primitives (no dual-write migration). | active |
| `planning/adrs/ADR-0020-locality-scoped-urls.md` | ADR-20 — locality-scoped URL namespacing for Groups. | active |
| `planning/adrs/ADR-0021-member-geography-substrate-split.md` | ADR-21 — three purpose-owned substrates replacing member_location_affinities. | active |
| `planning/adrs/ADR-0022-url-slug-naming-refinements.md` | ADR-22 — county replaces MSA; entity slugs gain a random suffix. | active |
| `planning/adrs/ADR-0023-url-path-compaction.md` | ADR-23 — 2-letter state codes; URL-transparent county tier. | active |
| `planning/adrs/README.md` | Defines ADR format, lifecycle, and naming convention. | reference |
| `planning/adrs/_template.md` | Blank ADR scaffold for new architectural decisions. | reference |
| `planning/bundles/b1-primitives-plan.md` | Defines b1 MVP scope in primitive terms. | active |
| `planning/bundles/b1-primitives-work-map.md` | Menu of b1 work tagged core / recommended / defer. | active |
| `planning/bundles/bundle-themes.md` | Sequences each bundle into 1–2 week sub-themes. | active |
| `planning/bundles/b1.x-substrate-sprint.md` | Completed b1.x geography substrate sprint (closed 2026-05-25). | complete |
| `planning/reviews/intent-ADR-20-2026-05-25.md` | Intent-check verdict for ADR-20 (CLEAN). | reference |
| `planning/reviews/intent-ADR-21-and-spec-patches-2026-05-23.md` | Intent-check verdict covering ADR-21 + same-day spec patches. | reference |
| `planning/reviews/intent-ADR-21-and-spec-patches-2026-05-23-recheck.md` | Re-check after ratifications landed. | reference |
| `planning/reviews/intent-ADR-0022-2026-05-25.md` | Intent-check verdict for ADR-22. | reference |
| `planning/reviews/intent-ADR-0023-2026-05-25.md` | Intent-check verdict for ADR-23. | reference |
| `planning/outreach/outreach-list.md` | Founder-recruitment list for Sacramento. | active |
| `planning/pending-ratifications.md` | Register of unratified absolutes awaiting PM decision. | active |
| `planning/rebuild-plan.md` | The approved clean-slate rebuild plan on primitives. | active |
| `planning/scenarios-backlog/F018-brian-declares-run-club.md` | Backlog scenario — Brian declares the Run Club gathering at Drake's. | draft |
| `planning/scenarios-backlog/F025-adaeze-member-public-page.md` | Backlog scenario — Adaeze creates her Member public page. | draft |
| `planning/scenarios-backlog/USER-STORY-TEMPLATE.md` | Redirect stub to the real scenario template in skills/. | reference |
| `product/templates/idea-intake.md` | Paste-in template producing pipeline artifacts from raw ideas. | active |
| `standards/README.md` | Standards layer — cross-cutting qualities the build must satisfy. | reference |
| `standards/accessibility.md` | Accessibility standard — placeholder for WCAG-shaped requirements. | draft |
| `standards/performance.md` | Performance standard — placeholder for budget and verification. | draft |
| `standards/responsiveness.md` | Responsiveness standard — placeholder for layout breakpoint rules. | draft |
| `standards/safety.md` | Safety standard — placeholder for safety-floor requirements. | draft |
| `standards/security.md` | Security standard — placeholder for threat-model and audit. | draft |

## Meta — root navigational docs

| Doc | Purpose | Status |
|---|---|---|
| `CLAUDE.md` | Project router — facts, primitives, naming rules, agent routing, commit rules. | active |
| `AGENTS.md` | Pipeline definition — agent roles, firewalls, gates, escalation. | active |
| `JOURNAL.md` | PM reverse-chronological log — what shipped, what changed, what's next. | active |
| `product/MAP.md` | 100k-foot architecture index — one sentence per system, with alignment checks. | active |
| `product/TRACE.md` | Feature lineage — every capability traced from human need to ticket. | active |
| `REGISTRY.md` | Catalog of every narrative doc, grouped by why / what / how layer. | active |

## Tooling

| Path | Purpose | Status |
|---|---|---|
| `skills/` | The agent-pipeline skill bundle — process tooling, not catalogued per-file. | active |
| `web/` | The deployable app (separate git repo) — not catalogued. | active |
| `_attic/2026-05-19/` | Historical archive from the 2026-05 doc consolidation — not catalogued. | historical |
| `_attic/2026-05-27/doc-consolidation-2026-05/` | The R01–R10 effort folder — not catalogued. | reference |
