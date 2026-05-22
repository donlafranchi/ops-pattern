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

Date: {YYYY-MM-DD} · Commit: {hash} · Notes: {list every [PM: confirm] left behind}
