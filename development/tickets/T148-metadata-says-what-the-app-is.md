# T148: Metadata says what the app is

**Scenario:** substrate — no new user-facing surface. Rewrites strings on surfaces that already ship.
**Status:** Open — buildable.
**Bundle:** launch
**Depends on:** nothing. **Blocks:** nothing.

**Serves:**
- **Loop:** 1 (Find your people) — the site description is the first sentence most people ever read about this product, and today it describes a different product.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
- **Primitive shape:** none — strings only.

## Why this exists

**The site-wide description reads:** *"Follow the makers you meet at your local farmers market. Every dollar you spend here stays here."*

**Two defects in the most-read string in the product.**

1. **It describes a marketplace.** No gathering, no events, no trade — the positioning the launch plan exists to correct, in the one sentence a search result and every shared link renders.
2. **It makes a promise-shaped money claim.** *"Every dollar you spend here stays here"* is the same class of statement removed from page copy on 2026-09-07 — an absolute nobody ratified, about money, in public.

**The promise sweep read page copy and stopped at the component boundary. Metadata was never in scope, so it survived.** That boundary is the actual bug; this ticket closes it.

## What changes

### 1. The root description

Replace it. **Requirements, not a draft — the wording is the deliverable and should be got right rather than fast:**

- Says what the app is: **local discovery — buy, sell, trade and gather.** Gathering is not an afterthought clause.
- **No promise, no absolute, no claim about fees, money, or where dollars go.** Not softened — absent.
- **Under about 155 characters**, so it renders whole in a search result and a link preview rather than truncating mid-clause.
- Present tense, plain words, no marketing cadence.

**A starting point, not a final answer:** *"Find what's for sale and what's happening near you. Buy, sell, trade and gather with people in your own community."* — 118 characters. **Run it past `design:ux-copy` before committing; this is the one string worth a second opinion.**

### 2. Sweep every other metadata surface

**The promise sweep's mistake was scoping to page copy. Do not repeat the boundary — read every `metadata` export in the app.**

Known today, and the build must re-derive the list rather than trust this one:

- `src/app/layout.tsx` — root title and description.
- Per-page titles across the member, product, service and gathering pages — all currently `{thing} — SocialUs`, which is fine and should stay consistent.
- `src/app/vendors/[slug]/page.tsx` and `src/app/business/[slug]/page.tsx` — **retired surfaces with their own OpenGraph blocks. Do not fix their copy; T149 removes them.** If T149 lands first, this is moot.
- **OpenGraph and Twitter card:** currently only two retired pages define `openGraph` at all, and **the root defines none** — so a shared link to the home page falls back to the title and description alone. Adding a root `openGraph` block is in scope; **an image is not** — that waits on the photo work.
- **There is no web manifest in the app.** Confirmed, not assumed: `public/` holds five SVGs and nothing else. **Do not create one in this ticket** — a manifest is a PWA decision, not a copy fix.

### 3. Grep for the class, not the instance

Search the whole of `src/` for money-claim and absolute-shaped language in any string that reaches a user — *free*, *ever*, *never*, *always*, *every dollar*, *no fees*, *stays here*. **Report what turns up even if it looks fine; the point is that nobody has looked at metadata and static strings together.**

## Acceptance Criteria

- [ ] The root description names buying, selling, trading **and gathering**, and contains no promise, absolute, or money claim.
- [ ] It is ≤ 155 characters and renders whole in a search-result preview.
- [ ] Every `metadata` export in `src/app/` has been read; the list is recorded in the ticket's Completion section.
- [ ] A root `openGraph` block exists with title and description. **No image.**
- [ ] The whole-`src/` grep for money and absolute language is run and its results reported, including "nothing found" if that is the answer.
- [ ] No new user-facing string introduces a claim the promises doc does not already carry.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3** — does not fire. No new page or component; string changes to existing exports. **Stated, not waived.**
- [ ] **M4** — does not fire. No migration.
- [ ] **`design:ux-copy`** on the root description. **The one place in this ticket worth a second opinion.**
- [ ] **DEVIATIONS entry**, including one line on whether the grep found anything.

## Notes

- **Do not touch the `— SocialUs` title suffix pattern.** It is consistent and correct.
- **Do not add a manifest, a favicon set, or an OG image.** Each is its own decision.
- **The lesson is worth writing down where it will be read:** a copy sweep scoped to components misses metadata, and metadata is what strangers read first.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
