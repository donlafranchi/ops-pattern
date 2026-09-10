---
id: index-product
purpose: One-line-per-doc index of the product docs, with settled rules only and no rationale attached.
layer: index
status: needs-review
---

> **Needs review.** Marked 2026-09-09. Accurate as a map, not yet verified line-by-line against every source doc. Known gaps are in **Open Actions** at the bottom — read that before trusting a bullet. Scoped to `product/` only; the repo's root `README.md` is a different, generated file (`scripts/view.sh`) covering scenario and build status.

# Ops-Pattern product docs — index

One line per doc, then the settled rules with no rationale attached — read the real file only when you need the "why." Layers: **why** (foundation) argues a decision once, **what** (systems) states its settled shape, **ui** is where things show, **needs** is why it matters, **planning/backlog** is working evidence.

## Why — foundation/

**`foundation/principles.md`** — the constitution.
- Everything serves people; measured as Member Flourishing: time to live + money to live, both must rise.
- Every proposal passes one test: does it net-move both up?
- The one absolute refusal: extraction — value taken from people without serving them back.

**`foundation/people-first.md`** — why there's no Business entity.
- No impersonal Business entity in the data model, ever.
- A Person makes Items; a brand name is a label, not a record that owns anything.
- A cooperative = a business Group with multiple owner-role members, not a new entity type.
- No ranking of people — a review is of the treatment, never a single score or leaderboard.
- Groups are started/joined/dissolved by members only — never auto-assigned, never corporately owned.
- Deeper infrastructure (banking, insurance) spins off to separate federated platforms, never absorbed.

**`foundation/role-language.md`** — the word "member" and nothing else.
- One identity noun: "member." Everything else is a verb (sell, host, follow, ask) — never a role label.
- No paired terms (creator/supporter) — refused; the same person does both sides.
- "Creator" is a feeling the product gives, never a stored label or noun in the UI.
- Functional roles (owner, staff, steward, host, founder) stay scoped to one Group or gathering — never shown as a person-level identity.

**`foundation/policy.md`** — the three-filter test.
- Every privacy/revenue/data-sharing default passes 3 questions in order: helpful to members? harmful to anyone else (including non-participants)? abusable by a bad actor?
- Default posture for non-essential sharing: **off.** Opt-ins must be visible, granular, revocable, time-bounded where stakes warrant it.
- Messaging stays scoped to an Item or a Group — never a Location.
- A Member's private geography (place-interests, saved searches) is owner-only at the row level, no exceptions, ever.
- Uploaded images: metadata (GPS) stripped before storage; a takedown path exists before the first upload is accepted.

**`foundation/messaging-problem.md`** — open questions, not a spec yet.
- Messaging is the platform's single highest-risk surface — controls must exist before any of it ships, not retrofitted after.
- A block (mute one member, no operator involved) is the cheapest control and the one this doc recommends shipping first.
- No per-member "politeness" or derived score column of any kind, ever.
- **Still open:** whether reachability rules alone gate speech, or combine with a flagging system; who may initiate contact with a stranger at launch; whether an operator/moderator role exists before member-initiated posts do.

**`foundation/nouns.md`** — the entity list.
- Three core nouns: Person (schema name: Member), Item, Location. Group is a fourth, optional and emergent.
- Page = the person/people behind a listing (the UI name for a Group row). Item = what's declared. Never conflate the two.
- Refused as nouns: Business entity, Role, Follow-a-product-or-service, Location-scoped messaging or feed, Cooperative governance as a feature.

**`foundation/verbs.md`** — the permission matrix.
- One matrix: what each verb (create/edit/follow/join/message/etc.) may do to each noun — a ✕ cell is a permanent refusal, not a backlog item.
- Following a Page = joining it. Products and services can never be followed.
- No messaging at large, anywhere — only inside a Page you've joined, once that ships.
- A follow never grants membership, a role, or read access to anything.

## What — systems/ (settled shape of each entity/mechanism)

**`systems/member.md`** — the identity primitive. *(split landed — see Open Actions below)*
- One row per real human, lifetime-stable. No stored role column, no street address by default.
- Real names encouraged, never required.
- Discoverability (search/directory/autocomplete visibility) defaults off — independent of whether the Member's own posts/hosting/founding still carry their name (they always do).
- Geography lives in 3 owner-only substrates (locality default, private awareness scope, saved searches) — never a message send-to target.
- Direct-message and agent-assistance (Delegations) tables exist from day one with no UI yet.

**`systems/creator.md`** *(new)* — the pattern for one-off/ongoing selling and hosting.
- No stored business/creator entity — status is a Group-membership fact only, never a Member-row flag.
- No promote-to-recurring flow — a one-off (a garage sale, a single class) never auto-upgrades into a Page; want it permanent, create one yourself.
- "Archive" = a single flag that drops a Page from map findability. Not a lifecycle state machine, no separate reactivate flow.

**`systems/groups.md`** — the Group/Page entity.
- A business Group needs ≥1 active owner; owners are co-equal — no "operating owner" or succession concept anywhere.
- Locally-Owned badge is computed fresh every time, OR-aggregated across all active owners — never a stored flag.
- No kind transitions — a Group that wants to formalize dissolves and a new one is created; items re-file at the member's discretion.
- No auto-dormancy, no auto-dissolution — inactivity only demotes surfacing, never changes lifecycle state or adds a public label.
- Reputation follows the person, never the Group.
- Business names are scoped to a hood/metro — no global namespace.
- Members are never auto-assigned to a Group; joining is always explicit.

**`systems/item.md`** — the one universal entity for anything declared.
- One schema, varying only by `kind` (product/service/gathering/idea/offer/ask/initiative) — never separate systems per kind.
- "Item" is schema-only — the UI always shows the specific kind, never the word "Item."
- Provenance ("Locally Made") and jurisdiction ("Locally Owned") are separate claims, never auto-derived from each other.

**`systems/location.md`** — physical places.
- Three kinds, fixed at creation, never transitioning: permanent, recurring-temporary, area.
- Not a Page, not civic geography, not a complaint/messaging surface, not a Person, never auto-populated from third-party data.
- No ownership transfer — only a future claim-if-inactive flow, not yet built.

**`systems/discovery.md`** — the one ranking engine.
- One scoring core for feed, search, and notifications — never a separate watch-time optimizer.
- Never rank by business size or follower count, ever.
- No "verified business" boost — personal businesses are first-class.
- Communities/Groups are never auto-assigned to a member's feed.
- Locality feed is computed at query time from private interests — no stored follow-edge table.
- Inactive businesses get a surfacing-weight demotion only — never archived, hidden, or publicly labeled.

**`systems/business-jurisdiction.md`** — the "locally owned" verification ladder.
- Three tiers: self-attested → community-attested → document-verified. Only the tier and a ZIP render publicly, never the document or address.
- OR-aggregation across all active owners — any one local owner qualifies the whole Group.
- Never auto-derived from a Member's home location — must be explicitly declared.

**`systems/action-layer.md`** — the one write path.
- Every write (web, mobile, agents, future federation peers) goes through one named, validated handler — no parallel write paths, ever.
- Agent capabilities are short-lived, single-scope, minted server-side — the model never sees the credential itself.
- Publishing or context-changing actions require a fresh human confirmation tap, never minted by an agent or Skill.
- No long-lived agent credentials, no uncatalogued scopes, no service-role SQL outside the handler library.

## Where things show — ui/

**`ui/surfaces.md`** — the single source of truth for "does it actually work."
- Every screen is tagged live / live-but-hollow (reads tables that don't exist) / residue (dead pre-rebuild route) / postponed.
- 10+ table names referenced in shipped code have no migration behind them — any surface reading one is silently broken.
- This file is the spec; `audit-route-inventory.md` is only the evidence trail behind it and goes stale on every route change.

## Why it matters — needs/

**`needs/use-cases.md`** — the real scenarios.
- Every feature must trace back to a real local scenario, not a persona.
- Three roles, not account types: Member (default — anyone), Producer (spectrum from full pro to casual maker), Convener (runs a Group).
- Tiers: MVP (ships b1), Deferred b2+ (problem is settled, design isn't), Deferred far-horizon (kept so the shape isn't forgotten).

**`needs/member-journey.md`** — the loop order.
- 13 engagement loops in strict dependency order — a deeper loop assumes every loop above it already works in practice.
- Federation (spinning off banking/insurance to separate platforms) is the platform's ceiling — the structural answer to "what stops this becoming Facebook."

## In progress — planning/backlog/

> **Neither file below exists in this repo.** `ui/surfaces.md` links to both and those links are dead. The entries are kept so the review pass decides whether to restore them from git or drop the citations. See Open Actions.

**`planning/backlog/audit-route-inventory.md`** — evidence, not spec.
- Route-by-route read of the live codebase against the migrations. Goes stale on every route change.

**`planning/backlog/decision-surfaces.md`** — the reasoning behind specific surface calls.
- Full detail on location resolution, ranking inputs, metro-as-vantage-point, and similar — `surfaces.md` only summarizes these.

## Open Actions

Marked for the review pass. Nothing below has been acted on.

1. **Verify every bullet against its source doc.** This index was written from a content plan, not derived from the files. Treat each bullet as a claim to check, not a citation.
2. **`planning/backlog/` does not exist.** Neither `audit-route-inventory.md` nor `decision-surfaces.md` is in the tree, and `ui/surfaces.md` carries three dead links to them. Decide: restore from git history, or drop the citations and fold what's still needed into `surfaces.md`.
3. **Seven docs sit in `product/` but not in this index** — `foundation/what-this-is.md`, `foundation/promises.md`, `foundation/metrics.md`, `foundation/monetization.md`, `foundation/impact-diagnostic.md`, `systems/places.md`, `ui/design-language.md`. Add or deliberately exclude each.
4. **Cooperative and federation material is the too-complex-for-now block.** The settled *refusals* stay as index bullets — no Business entity, cooperative governance refused as a feature, federation-not-absorption as the ceiling. The speculative build-out is `foundation/impact-diagnostic.md`'s pool/form/federate stack and its sector-by-sector cooperative plans; `IMAGINE.md` already carries that as **The cooperative engine (5 sketches)**, so it needs no new entry — only a decision on whether the doc stays in `product/`. Deleting anything from `product/` runs through the yes/no pause in `skills/trim/`.
5. **`systems/member.md`'s split has landed** (commit `c4226d0`): `creator.md` holds selling, standing presence, and archive; the DM shape moved to `foundation/messaging-problem.md`; Social capital moved to `IMAGINE.md`. The bullets above already reflect the post-split file.
