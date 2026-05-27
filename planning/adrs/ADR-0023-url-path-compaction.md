---
purpose: ADR-23 — compact place URLs via state codes and a URL-transparent county tier.
layer: how
status: accepted — Ratified 2026-05-25; pipeline-intent-check CLEAN
---

# ADR-0023: URL path compaction — state codes and a URL-transparent county tier

**Status:** Accepted
**Date:** 2026-05-25
**Ratified:** 2026-05-25 (pipeline-intent-check verdict CLEAN — see [`../reviews/intent-ADR-0023-2026-05-25.md`](../reviews/intent-ADR-0023-2026-05-25.md))
**Deciders:** PM
**Scope:** The rendered form of public place-scoped URLs. Data model unchanged.
**Touches:** [`product/systems/places.md`](../../product/systems/places.md) · [`product/systems/location.md`](../../product/systems/location.md) · [`product/systems/groups.md`](../../product/systems/groups.md) · `CLAUDE.md` § Naming conventions · [`ADR-0020`](ADR-0020-locality-scoped-urls.md) · [`ADR-0022`](ADR-0022-url-slug-naming-refinements.md) · web branch `t65` (`resolve-path.ts`, `reverse-geocode.ts`, `/p/[...slug]` route, `017_places.sql`, place evals + tests)
**Amends:** ADR-0020 (URL rendering and city slug-uniqueness scope).
**Refines:** ADR-0022 (the `county` tier ADR-0022 introduced is made URL-transparent).

## Decision

Compact the place-scoped URL on two axes. The `places` data model — every tier, every `parent_id` — is unchanged; this ADR governs only how a place renders into a path and resolves back.

**1. State place rows use the 2-letter USPS code as `slug`.** `california` → `ca`, `oregon` → `or`. `display_name` keeps the full name for UI. URLs render `/p/ca/...`.

**2. The `county` tier is URL-transparent.** `county` remains a full tier in the `places` hierarchy (`city.parent_id` points to a `county` row) — that is what delivers ADR-0022's total-coverage guarantee and lets rural/unincorporated places resolve. But the rendered URL **omits `county`-kind segments**: the URL builder skips county ancestors, and the path resolver resolves a `city` segment as a transitive descendant of the `state` (through the county hop). A `county` segment appears in a URL only when the leaf place has no `city` ancestor (an unincorporated/rural place — nothing to skip to) or as a collision disambiguator.

**3. City slug uniqueness for URL purposes is scoped to the `state`, not the `county`.** Because the county is omitted from the path, `/p/ca/{city}` must resolve unambiguously. This amends ADR-0020's `places UNIQUE (parent_id, slug)` for `city` rows — a `city` slug must be unique within its `state` ancestor. Incorporated U.S. city names are generally unique within a state; the rare intra-state collision includes the `county` segment or takes a disambiguating suffix.

**Canonical form:** `/p/{state-code}/{city}/{neighborhood}` — e.g. `/p/ca/sacramento/oak-park`, replacing the full-depth `/p/california/sacramento-county/sacramento/oak-park`.

**Design test.** Judged against *elegant, helpful, simple, reduce abuse*: compaction wins on *elegant* (no redundant repeats — the prior form rendered `sacramento/sacramento` because county and city share a name) and *helpful* (a short, scannable, shareable URL) while staying readable.

## Options considered

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen: state codes + URL-transparent county** | `/p/ca/sacramento/oak-park`. County stays in the data model, omitted from the path. | Chosen — shortest, removes the county/city name-repeat, county still does its coverage job. |
| B — Full names, full depth (status quo) | `/p/california/sacramento-county/sacramento/oak-park`. | Rejected — long; renders redundant repeats when county and city share a name. |
| C — Numeric FIPS county code | `/p/ca/067/sacramento/...`. | Rejected — opaque; breaks ADR-0022's "place slugs stay human-readable." |
| D — Abbreviated county slug | `/p/ca/sacramento-co/sacramento/...`. | Rejected — no standard county abbreviation exists; still carries a segment for an infrastructural tier. |

## Trade-offs

The win is length and legibility: roughly half the characters, and the county/city name-repeat disappears. Counties keep doing the job ADR-0022 chose them for — total coverage and rural resolution — they simply stop costing a URL segment, because a county is a tier people *resolve through*, not one they *navigate by*.

The costs are real but contained. The path resolver gains one transitive step (resolve `city` under `state`, skipping the county hop) rather than a flat parent-by-parent walk. City slug-uniqueness moves from county-scoped to state-scoped; this is a stricter constraint, satisfied by reality (incorporated city names are near-always unique within a state) with the county segment available as the disambiguator for the rare exception. Rural places with no `city` still render the county in their path — coverage is untouched.

## Consequences

- `product/systems/places.md` — gains a "URL rendering" note: state `slug` = 2-letter code; `county` is URL-transparent; `city` slug unique within `state`. The data-model sections (kind enum, `parent_id`, polygons) are unchanged.
- `CLAUDE.md` § Naming conventions and the URL examples in `ADR-0020` / `location.md` / `groups.md` — update to the compact form.
- Web branch `t65` — `017_places.sql` (state-row slugs become codes; city slug-uniqueness constraint), `src/lib/places/resolve-path.ts` (transitive city resolution), the URL builder (skip county ancestors), `src/app/p/[...slug]/page.tsx`, and the place evals/tests (paths → compact form). **These were handed to a Claude Code session 2026-05-25 as part of the consolidated 8-item change set on `t65`** — see Action Items.
- **Sequencing note:** Claude Code is implementing this compaction *ahead of* this ADR's ratification (the PM handed it the change set on 2026-05-25). Fast-track the intent-check and ratification so the record is not trailing the code at commit time.

## Intent annotations

Ratified 2026-05-25 — `pipeline-intent-check` verdict CLEAN ([`../reviews/intent-ADR-0023-2026-05-25.md`](../reviews/intent-ADR-0023-2026-05-25.md)).

- **"The `county` tier is URL-transparent."** *Intent:* A county earns its place in the *data model* — it is the tier that makes every coordinate resolve to exactly one anchor (ADR-0022's coverage guarantee). It does not earn a place in the *URL*, because a county is not a unit people navigate by; forcing it into the path doubled URL length and produced redundant repeats when a county and its seat share a name (Sacramento County / Sacramento). Keeping county in the hierarchy and out of the rendered path serves coverage and legibility at once. Re-introduce a county segment in the URL only for places with no `city` ancestor, or to disambiguate.
- **"State place rows use the 2-letter USPS code as `slug`."** *Intent:* USPS state codes are universal, stable, and unambiguous; for a U.S.-launch platform they cost nothing in readability that full names would buy, and save ~8–10 characters on every URL the platform issues. The full name is preserved in `display_name` for UI surfaces.

## Action Items

1. [x] Run `pipeline-intent-check` on this ADR (rebuild rule #9); then add the pointer line to [`../DECISIONS.md`](../DECISIONS.md). — CLEAN, 2026-05-25, [`../reviews/intent-ADR-0023-2026-05-25.md`](../reviews/intent-ADR-0023-2026-05-25.md); DECISIONS.md pointer landed.
2. [x] PM ratifies → flip **Status** to Accepted. — 2026-05-25.
3. [ ] Patch `places.md` (URL-rendering note), `CLAUDE.md` § Naming conventions, `ADR-0020` (amendment pointer), and URL examples in `location.md` / `groups.md`.
4. [x] Web implementation handed to Claude Code 2026-05-25 — consolidated 8-item change set on branch `t65`, pre-commit. Ahead of ratification; fast-track items 1–2.

