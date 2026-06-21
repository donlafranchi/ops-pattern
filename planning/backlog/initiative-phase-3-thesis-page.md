---
id: how-thesis-page
purpose: Phase 3 item stub — the `/why` thesis page.
layer: how
status: stub
---

# Phase 3 — `/why` thesis page

## What this is

A public, static page at `/why` that states the platform's thesis: the problem it exists to dissolve, the antidote it proposes, what it commits to, what it refuses. Footer link from every page. The page that earns the right to ask people to step forward.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 — *"`/why` — thesis page. Static content. Links from every page footer. Uses content from `use-cases.md`, `principles.md`, `member-journey.md` distilled."*
- The b1 strategy doc treats this as doc-only work, not a scenario.

## Rough shape

- URL: `/why` — anonymous-readable, no auth.
- Content: ~3–6 short sections distilled from:
  - [`product/foundation/principles.md`](../../product/foundation/principles.md) — the constitution; "what good looks like."
  - [`product/needs/member-journey.md`](../../product/needs/member-journey.md) — the 13 loops; "the path."
  - [`product/needs/use-cases.md`](../../product/needs/use-cases.md) — situations the platform exists to serve.
  - [`product/foundation/platform-promise.md`](../../product/foundation/platform-promise.md) — public-voice commitments (if this doc exists at the time of writing).
- Section shape:
  - **The squeeze.** Plain-language description of the problem (market consolidation, attention economy, the loss of locally rooted commerce + community).
  - **The antidote.** People-first, place-anchored, no advertising, no ranking of people.
  - **What we commit to.** The non-negotiables — no platform fees on Member commerce, no Location-scoped messaging (accountable-participation), no ratings of people, no sale of attention.
  - **What we refuse to do.** A short list — sells ads, ranks people, custodies money for itself, treats business as more important than the people doing the work.
  - **How to step forward.** Sign up, declare something, join a Group, host a gathering. Each verb links to the relevant surface.
- Anti-pattern: long manifesto-style prose. Keep each section short and scannable. The thesis is the floor; the platform is the demonstration.

## Depends on

- Final ratification of `platform-promise.md` (per the b1 plan; check if this doc is complete).
- Footer slot in the global layout — added as part of this work.

## Advance this by

1. PM decides: is this a `scope`-driven scenario, or is it `explore`-driven content authoring with no F-number? (Likely the latter — it's content, not surface.)
2. Decide tone — first-person ("we believe…") or third-person ("the platform commits to…"). Affects voice.
3. Confirm the source docs are stable (no major reframes pending).
4. Author the page content (Cowork session, not a scenario).
5. Add footer-link wiring to global layout (this part could be a small ticket).

## Out of scope for this stub

- Marketing site / landing-page redesign — separate concern.
- Translated versions — i18n is deferred to b2 entry criterion per CLAUDE.md.
- Per-locality customization — same thesis everywhere.
