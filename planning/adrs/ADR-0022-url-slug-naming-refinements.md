---
purpose: ADR-22 — county tier replaces MSA; entity slugs use a readable + random-suffix format.
layer: how
status: accepted — Ratified 2026-05-25; pipeline-intent-check CLEAN
---

# ADR-0022: URL & slug naming refinements — county tier + entity slug format

**Status:** Accepted
**Date:** 2026-05-25
**Ratified:** 2026-05-25 (pipeline-intent-check verdict CLEAN — see [`../reviews/intent-ADR-0022-2026-05-25.md`](../reviews/intent-ADR-0022-2026-05-25.md))
**Deciders:** PM
**Scope:** The `places.kind` hierarchy tier between `state` and `city`, and the slug format for user-generated entities (Items, Groups, Locations).
**Touches:** [`product/systems/places.md`](../../product/systems/places.md) · [`product/systems/location.md`](../../product/systems/location.md) · [`product/systems/groups.md`](../../product/systems/groups.md) · [`product/systems/item.md`](../../product/systems/item.md) · [`planning/adrs/ADR-0020-locality-scoped-urls.md`](ADR-0020-locality-scoped-urls.md) · `CLAUDE.md` § Naming conventions · `development/tickets/T058`–`T060`
**Amends:** ADR-0020 (the `places.kind` enum and the entity slug format) — ADR-0020's locality-scoped-URL architecture otherwise stands in full.
**Refined by:** ADR-0023 (Accepted 2026-05-25) — URL path compaction (state codes; URL-transparent county tier).

## Decision

Three refinements to the place model and URL naming established by ADR-0020, judged against one design test.

**1. County replaces MSA as the tier between `state` and `city`.** The `places.kind` enum becomes `region`, `state`, `county`, `city`, `neighborhood` (`country` still reserved for the federation horizon). `county` is the schema term and covers every U.S. admin-level-2 equivalent — counties, Louisiana parishes, Alaska boroughs and census areas, and independent cities — all of which carry a stable FIPS county code. The `region` kind stays, and now carries the colloquial multi-county groupings MSAs were being stretched to cover ("the Bay Area," "Sacramento Valley"). MSA is removed as a `kind`.

**2. User-generated entity slugs use a readable + random-suffix format.** Items, Groups, and Locations take the form `{title-derived-slug}-{short-random-suffix}` — e.g. `summer-concert-7gx9`. The readable stem serves humans, search engines, and agents; the random suffix makes the slug collision-proof by construction and non-enumerable. The suffix is applied always, not only on collision. The Member `@handle` remains the single user-*chosen* vanity namespace (regex-constrained, profanity-filtered, moderated per ADR-0020); every other entity slug is system-generated from the entity's title.

**3. Place slugs stay human-readable and consumer-facing.** Reaffirms ADR-0020. Place slugs take no random suffix — the place set is small, platform-curated, and public civic infrastructure; collisions are handled by parent-scoped uniqueness and curation. Opaque place slugs were considered and rejected: readability and scrape-resistance are independent axes, and the random suffix in decision 2 handles enumeration without sacrificing the readability humans and answer-engines rely on.

**Design test.** Every naming and structural pattern is judged against four words — **elegant, helpful, simple, reduce abuse**. County wins on *simple* and *helpful* (one authoritative standard, full coverage). Readable + random suffix wins on *helpful* (human trust, discoverability) and *reduce abuse* (non-enumerable) while staying *elegant*.

**Premise.** Decision 2 and 3 assume the platform intends to be discoverable on the open web and by answer-engines. If the platform later commits to app-only / invite-only distribution, the slug-readability rationale weakens and this ADR should be revisited. See Open question.

## Options considered

### Tier between state and city

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen: county** | U.S. counties / county-equivalents, FIPS-coded. Tiles the entire country with no gaps. | Chosen — full coverage, stable codes, an admin-level-2 equivalent exists in every country (international-ready). |
| B — MSA (status quo) | Census metropolitan/micropolitan statistical areas. | Rejected — ~1,200 rural counties fall outside any CBSA and would have no tier to anchor to; one MSA can swallow a 20M-person, tri-state metro into a single un-navigable tile. "Troublesome" per PM. |
| C — Curated regions over a county backbone | Hand-drawn regions, each a bag of counties. | Rejected for the *kind enum* — curation is a real maintenance cost; the existing `region` kind already covers the colloquial-region need without making it the mandatory tier. |

### Entity slug format

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen: readable + random suffix** | `summer-concert-7gx9`. | Chosen — readable for humans/SEO/agents, non-enumerable, collision-proof. |
| B — Pure readable | `summer-concert`. | Rejected — guessable and walkable; collisions need disambiguation logic. |
| C — Fully opaque | `7gx9k2qp`. | Rejected — looks like a tracking link, weakens SEO and agent grounding, and buys nothing on enumeration-resistance that the random suffix in A doesn't already buy. |

## Trade-offs

**County costs.** Counties are not always the unit people *name* ("I'm in the Bay Area," not "I'm in Alameda County") — mitigated by retaining the `region` kind for colloquial groupings and by the URL hierarchy being skippable (a city can be addressed without naming its county where that reads better). A handful of states use county-equivalents with different local names; the `county` schema value absorbs them uniformly via FIPS, and the UI naming layer can display "Parish" / "Borough" where appropriate. The gain is decisive: every coordinate in the U.S. resolves to exactly one county, which removes the rural-coverage gap MSAs leave.

**Readable + random-suffix costs.** Slugs are slightly longer and carry mild visual noise from the suffix — mitigated by ADR-0020's existing short-link form (`msm.short/[id]`) for SMS/QR contexts, and by the stem still being the legible part. The alternative formats fail harder: pure-readable on enumeration, fully-opaque on trust and discoverability.

The rejected options fail the design test: MSA is not *helpful* (coverage gaps) and not *simple* (metro/micro/CSA/gap taxonomy); fully-opaque slugs are not *helpful* (no trust, no SEO) and only marginally better on *reduce abuse* than the chosen format.

## Consequences

- `product/systems/places.md` — the `kind` enum changes (`msa` → `county`); the "MSA vs metro-area definitions" open question is resolved and closed; T1 seed-set examples update (Sacramento's parent becomes Sacramento County, not the Sacramento–Roseville MSA).
- `planning/adrs/ADR-0020-locality-scoped-urls.md` — gains an "Amended by ADR-0022" pointer on the `kind` enum and the slug-format passages. ADR-0020's URL architecture, parent-scoped uniqueness, and place-curation rule are unchanged.
- `CLAUDE.md` § Naming conventions and the URL examples in `location.md` / `groups.md` — update place-path examples to the county chain.
- **The place/geography substrate is already implemented and sits uncommitted on web branch `t65`.** Tickets T058–T064 (places table, reverse-geocoder, place URL routing, affinity retirement, place-interests, saved-searches, items made-at) were all built but never committed per-ticket — they are uncommitted working-tree changes. MSA is encoded across ~8 files: `supabase/migrations/017_places.sql` (the `kind` CHECK enum and the seeded `sacramento-roseville` row), `src/lib/places/reverse-geocode.ts`, `src/lib/places/resolve-path.ts`, `src/app/p/[...slug]/page.tsx`, `evals/phase-1/places.spec.ts`, `evals/phase-1/place-routing.spec.ts`, `tests/migrations-t058.test.ts`, `tests/places-resolve-path.test.ts`. Because the work is uncommitted, the msa→county change is a clean pre-commit working-tree edit — no rollback, no fix-forward. It must land after this ADR is ratified and before branch `t65` is committed.
- The county switch surfaces a latent seed error: West Sacramento is currently seeded as a `neighborhood` of Sacramento, but it is a separate incorporated city in Yolo County. Under the county model the correct chain is California → Yolo County → West Sacramento (city). The switch *fixes* the exact cross-county case that motivated this review.
- Entity slug generation (Item/Group/Location `*.create` action handlers) gains a random-suffix step; the `UNIQUE` constraints from ADR-0020 still hold and are now satisfied by construction rather than by collision-time mangling.
- **Foreclosed:** MSA as an addressable URL tier. A future need for metro-level browsing is served by a `region`-kind row, not by reintroducing `msa`.

## Open question

- **Open-web discoverability stance.** This ADR's slug-readability decisions presume the platform wants open-web + answer-engine discovery. PM to confirm explicitly. If the platform commits to app-only distribution, decisions 2–3 should be revisited (the abuse-reduction case for opaque slugs strengthens when there is no SEO value to weigh against it).

## Intent annotations

Ratified 2026-05-25 — `pipeline-intent-check` verdict CLEAN ([`../reviews/intent-ADR-0022-2026-05-25.md`](../reviews/intent-ADR-0022-2026-05-25.md)).

- **"County replaces MSA as the tier between state and city."** *Intent:* The place tier must resolve *every* coordinate to exactly one anchor — a hierarchy with holes cannot back a URL namespace or a locality index. MSAs leave ~1,200 rural counties unassigned; counties tile the country completely. The cost of choosing wrong here is a retrofit of the URL tree, so the tier is chosen for total coverage now.
- **"Place slugs stay human-readable; the `@handle` is the only user-chosen vanity namespace."** *Intent:* Readable place slugs make the platform's locality-first claim visible in every share-link and citable by answer-engines; they carry no privacy cost because civic geography is already public. User-*chosen* slugs beyond the handle would open squatting and impersonation — a moderation surface the platform declines to create. System-generated-from-title slugs carry the readability benefit without the moderation cost.

## Action Items

1. [x] Run `pipeline-intent-check` on this ADR (rebuild rule #9) before it lands in `DECISIONS.md`. — CLEAN, 2026-05-25, [`../reviews/intent-ADR-0022-2026-05-25.md`](../reviews/intent-ADR-0022-2026-05-25.md).
2. [x] PM ratifies → flip **Status** to Accepted. — 2026-05-25.
3. [ ] Add the pointer line to [`../DECISIONS.md`](../DECISIONS.md) pointer index; add the "Amended by ADR-0022" note to the ADR-0020 row.
4. [ ] Patch `product/systems/places.md` — `kind` enum, seed examples, close the "MSA vs metro-area" open question.
5. [ ] Annotate `ADR-0020` with the amendment pointer; update `CLAUDE.md` § Naming conventions and the URL examples in `location.md` / `groups.md`.
6. [ ] After ratification, run a Claude Code session to apply the msa→county edit across the ~8 affected files on web branch `t65`, then commit. (See Consequences — the substrate is already built and uncommitted, so this is a pre-commit fix.)
7. [ ] PM confirms the open-web-discoverability premise (Open question above).

