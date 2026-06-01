---
id: how-bundle-1
purpose: Slim scoping overview for the b1 Primitives MVP — hypothesis, what's in, what defers, success metrics. Per-feature detail lives in the scoreboard.
layer: how
status: active
---

# Bundle 1 — Primitives MVP

> The smallest expression of the platform that proves the central hypothesis. Per-feature progress: [`bundle-1-checklist.md`](bundle-1-checklist.md). Narrative + non-negotiables: [`mvp-goal.md`](mvp-goal.md). Sub-theme sequencer: [`bundle-1-themes.md`](bundle-1-themes.md).

## Hypothesis

**Ordinary people will step forward where they live, and their neighbors will show up for them.** Everything in b1 either serves that hypothesis or is deliberately out of scope.

## What ships — one line each

- **Person (Member T1).** Profile, auth, privacy controls, multi-Location affinities, direct messaging within shared scopes, soft delete.
- **Item (T1).** Four kinds — `product`, `service`, `gathering`, `wonder`. Spine + kind-specific child tables, public page at a stable URL, Location attachments with optional schedules, uniform responses (RSVP / follow / save / "I'd be in") in `item_responses`.
- **Location (T1).** Permanent / recurring-temporary / area. Public page, coordinates, PostGIS proximity. The anti-Nextdoor commitment lives in messaging scope, not in absence of Member-Location relationships.
- **Group (T1, full surface).** All six kinds — five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) + one operate (`business`). Emergent and optional; create / join / leave / page / index / role-per-kind validation / event log. kind='business' absorbs personal-business, partnership, and cooperative-shape use cases.
- **Locality-first index.** A single no-login surface browsing Items, Persons, and Locations near a stated point, filterable by kind / category / distance / schedule.
- **Person-Item creation flows.** Create any of the four kinds in under 90 seconds, including Location attachment and schedule.
- **Item response surfaces.** Kind-appropriate actions on every Item page.
- **The thesis page.** Linked from every page; names the squeeze, the antidote, and the platform's commitments.

Loop coverage: six loops fully reachable (1, 2, 3, 4, 7, 9), one partial (8 — Follow stores but the stream defers), six deferred.

## What defers

- Posting surfaces inside Groups (feeds, discussion) → b2.
- Stewardship rotation, pooled-capital / capital-flow surfaces → b2/b3. **Cooperative-style coordination deferred until real-world need + explicit user prioritization** — no `cooperative_*` schema at b1.
- Initiatives, Offer, Ask — reserved at the schema level only.
- Follow streams, notifications, persistent feeds — stored at b1, surfaced at b2.
- Reviews / ratings — permanently deferred (endorsements at Service Provider T2 instead).
- Payments / commerce rails — transaction is off-platform at b1.
- Verification badges, stakeholder dashboard surface, vector/semantic search + AI chat, intelligence layer — b2/b3 (schema floor laid at b1).

## Non-negotiable data-model commitments

- **AI-native floor:** pgvector enabled, parallel embedding tables created, `embedding_id` columns reserved.
- **Action layer is the only write surface** (per the action-layer spec) — direct controller writes rejected at code review.
- **Same-transaction row+event invariant** — every event row writes in the same transaction as its row; every event carries `acting_member_id` + `via_delegation_id`.
- **Soft delete on every entity** — hard deletes never ship at any tier.
- **System Member seeded** for backfilled / platform-emitted events.

## Success metrics

Behavioral, not financial: Item-creation rate across kinds; response rate (RSVP / follow / save / "I'd be in"); return-visit rate; cross-kind engagement (someone who came for a gathering discovers a maker). Commerce volume is **not** the b1 metric.
