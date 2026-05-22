# R07 — Capabilities merge: discovery, shareable, accountability

**Phase:** 7 of 10 · **Repo:** parent · **Risk:** medium (content merge) · **Depends on:** R01–R06.

## Objective

Three overlap fixes in the WHAT layer: the discovery surface specced in three places, a meta-capability sitting on top of two pages, and two exploration docs that are one accountability system. Plus housekeeping: flag the kept BI doc, fix a stale capability.

This is **content work** — clean draft, `[PM: confirm]` for uncertainty, drop nothing unique.

## Steps

Work from the repo root, `/Users/don/Projects/movers-makers-shakers`. Read sources fully first.

### 1. Merge the discovery triangle → `product/ui/community-platform.md`

`product/ui/community-platform.md` (the Home/Explore/You surface spec) already re-specs what `capabilities/consumer-feed.md` and `capabilities/locality-browse.md` own. Fold both capability files into `community-platform.md` — the Home-feed behavior into its Home section, the Explore-catalog behavior into its Explore section. Reconcile any drift (card types, filter copy) toward the most recent version; flag conflicts.

```
git rm product/capabilities/consumer-feed.md
git rm product/capabilities/locality-browse.md
```

### 2. Fold `shareable-listing.md` into the pages it sits on

`capabilities/shareable-listing.md` is a meta-capability ("every entity gets a shareable URL"). Add a short "Shareable URL" subsection to `capabilities/item-view.md` and `capabilities/member-profile.md` capturing the SSR/OG behavior for each. Then:

```
git rm product/capabilities/shareable-listing.md
```

### 3. Fix the stale `member-profile.md`

While in that file: correct the stale URL (`/p/[member-slug]` → `/m/[handle]`) and replace "Communities" with "Groups" to match the live model.

### 4. Merge the accountability exploration docs → `product/exploration/accountability.md`

`exploration/business-accountability.md` and `exploration/community-accountability-model.md` are two takes on one flagging/standing/verification system.

```
git mv product/exploration/business-accountability.md product/exploration/accountability.md
```

Merge `community-accountability-model.md` in; keep both perspectives' unique content; note it stays exploratory (not b1).

```
git rm product/exploration/community-accountability-model.md
```

### 5. Flag the kept BI doc

`product/exploration/business-intelligence-platform.md` stays. Add a banner at its top:

```
> **Kept 2026-05-19 — live candidate, under PM review for inclusion.** This is slated to
> become a tool for producers and makers to improve their operations. Vocabulary here is
> pre-primitives ("business"); read it for intent, not current terms. Related to
> `systems/producer-tools.md`. Not yet an approved system.
```

### 6. Cross-reference sweep

```
rg -l --glob '!_attic/**' --glob '!web/**' 'OLD_PATH' .
```

| OLD | NEW |
|---|---|
| `capabilities/consumer-feed.md` | `ui/community-platform.md` |
| `capabilities/locality-browse.md` | `ui/community-platform.md` |
| `capabilities/shareable-listing.md` | `capabilities/item-view.md` (or `member-profile.md`, per context) |
| `exploration/business-accountability.md` | `exploration/accountability.md` |
| `exploration/community-accountability-model.md` | `exploration/accountability.md` |

### 7. Verification

- `product/capabilities/` no longer contains `consumer-feed.md`, `locality-browse.md`, `shareable-listing.md`.
- `product/exploration/` contains `accountability.md`, `business-intelligence-platform.md` (with banner), `reciprocity-and-goodwill.md` — three files.
- `member-profile.md` uses `/m/[handle]` and "Groups".
- `rg --glob '!_attic/**' --glob '!web/**' 'consumer-feed|locality-browse|shareable-listing|business-accountability|community-accountability-model'` returns zero hits.

## Commit ceremony

```
cd /Users/don/Projects/movers-makers-shakers
git add -u
git add product/exploration/accountability.md
git status
git commit -m "docs(consolidation): phase 7 — merge discovery, fold shareable-listing, merge accountability"
```

## Completion

Date: 2026-05-22 · Commit: `a83bdcb` · Notes:

**Five files folded / merged / removed; one banner added; three broken refs fixed.**

- **Discovery triangle.** `consumer-feed.md` and `locality-browse.md` deleted; the C1 row in `ui/community-platform.md` updated to inline-reference the doc's own T1 Home section; T1 Explore section expanded with the unique implementation details from `locality-browse.md` (`/explore` route, anonymous access, PostGIS `ST_DWithin` against `discoverable_items`, the explicit filter set, URL state, map toggle, pagination, empty state, back-nav restore, deferreds, acceptance signal).
- **Shareable-listing fold.** `shareable-listing.md` deleted; a "Shareable URL" subsection added to `item-view.md` (covering all seven Item kind-specific URLs + SSR/OG + stable slug + anti-spam) and to `member-profile.md` (covering `/m/[handle]` + SSR/OG + Member avatar OG image).
- **`member-profile.md` modernized.** Stale `/p/[member-slug]` URL → `/m/[handle]`. "Explicitly joined Communities" → "Explicitly joined Groups." Acceptance signal updated to `/m/[handle]`.
- **Accountability merge.** `business-accountability.md` renamed to `accountability.md`; `community-accountability-model.md` merged in as a second framing. Per the ticket's "drop nothing unique" rule, both perspectives are preserved verbatim under § Framing 1 (Public-Record Transparency) and § Framing 2 (Community-Driven Four Pillars + Sliding Scale), with a top-of-doc note flagging that the merge is intentionally non-reconciling — PM picks which framing (or blend) becomes the spec when the doc graduates from exploration. A merge-notes section at the bottom names the load-bearing principles both framings honor (no gatekeeping ratings per principles.md Part 5; the four-pillar lens; the action-layer audit trail).
- **BI doc flagged.** `business-intelligence-platform.md` got the "Kept 2026-05-19 — live candidate, under PM review" banner the ticket specifies, with a pointer to `producer-tools.md`.
- **Three broken refs fixed.** `landing-page.md`, `event-host.md`, `group-create-join.md` all had `[Locality Feed](consumer-feed.md)` / `[Locality Browse](locality-browse.md)` style links to the now-deleted capability files. All rewritten to point at `../ui/community-platform.md` (the new home).

**[PM: confirm] items left behind:**

- **Both accountability framings still use pre-primitives "business" vocabulary** throughout — when this graduates from exploration to a system spec, the subject of accountability is the kind='business' Group (and the Members named as owner-role memberships); the language pass goes with the graduation.
- **`accountability.md` is intentionally non-reconciled.** The two framings overlap but address different sub-questions (court records vs. community signals). The doc names the convergence point (Framing 2's b3 row already plugs in Framing 1) but doesn't pre-decide a single shape. PM picks at graduation.
- **`item-view.md` and `member-profile.md` "Shareable URL" subsections** were inserted just before the existing "Deferred" sections to keep the doc structure clean; check that the section order reads naturally to your eye.
- **`landing-page.md` line 21** had a phrase "(the locality feed per [`consumer-feed.md`](consumer-feed.md))" that got mechanically rewritten to "(the locality feed per community-platform.md (in `../ui/`))" — the wording is a little awkward; PM can polish.

**Intentional residual refs (not broken):** the merge-note provenance lines inside `community-platform.md`, `item-view.md`, `member-profile.md`, and `accountability.md` all reference the prior filenames as historical context. `planning/rebuild-plan.md` and `planning/pending-ratifications.md` carry similar historical references. `development/tickets/done/T009-shareable-listing.md` references the archived scenario file (frozen-in-time). All preserved.

**Verification.** All five OLD filenames (`consumer-feed.md`, `locality-browse.md`, `shareable-listing.md`, `business-accountability.md`, `community-accountability-model.md`) return zero **live broken** hits via the cross-reference sweep (excluding intentional provenance + historical-context refs). `product/capabilities/` no longer contains the three retired files. `product/exploration/` contains `accountability.md`, `business-intelligence-platform.md` (with banner), and `reciprocity-and-goodwill.md` — three files as expected.
