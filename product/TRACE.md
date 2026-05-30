---
purpose: Feature lineage — every capability traced from human need to ticket.
layer: how
status: active
---

# TRACE — feature lineage

> **Companion to [`MAP.md`](MAP.md).** MAP answers *"does the architecture cohere"*; TRACE answers *"where did this feature come from."* Walk any ticket left through this table to its human need. A row with empty Need / Loop cells may be engineering-driven — worth interrogating. The PM adds a row per new scenario.

> **How to use this.** Reading right-to-left: a ticket exists → it implements a feature/scenario → which sits inside a capability → backed by a system → serving a loop → answering a need. If you cannot fill the left columns for a row, the work is engineering-only — not necessarily wrong, but flag it. Reading left-to-right: a need exists → which loops serve it → which systems implement those loops → which capabilities surface them → which scenarios are in flight → which tickets are open.

> **Status legend.** **active** — surface or substrate shipping at b1. **b2/b3** — surface deferred to that bundle; substrate may already exist. **substrate-only** — schema/event log is in place at b1; no UI yet. **draft** — design doc exists but no scenario yet. **backlog** — scenario in `planning/scenarios-backlog/`, not yet approved. **deferred** — explicitly held back. **—** — nothing yet (not omission; absence).

---

## Lineage

| Need | Loop | System | Capability | Feature / Scenario | Ticket | Status |
|---|---|---|---|---|---|---|
| Find my people | 1 | [`systems/groups.md`](systems/groups.md), [`systems/member.md`](systems/member.md), [`systems/discovery.md`](systems/discovery.md) | [`capabilities/group-create-join.md`](capabilities/group-create-join.md), [`capabilities/member-profile.md`](capabilities/member-profile.md) | — | T055 (groups schema), T047–T049 (member substrate) | substrate-only (b1) |
| Float an idea | 2 | [`systems/item.md`](systems/item.md) | Item composer in [`capabilities/item-view.md`](capabilities/item-view.md) | — (use-cases #8 TODO) | T056 (items schema) | substrate-only (b1) |
| Land somewhere new | 3 | [`systems/discovery.md`](systems/discovery.md), [`systems/location.md`](systems/location.md) | [`ui/community-platform.md`](ui/community-platform.md) — Home + Explore | — | T045–T046 (locations schema + RLS), T057 (discoverable_items view) | substrate-only (b1) |
| Gather regularly | 4 | [`systems/item.md`](systems/item.md), [`systems/location.md`](systems/location.md) | [`capabilities/event-host.md`](capabilities/event-host.md) | [F018 — Brian declares the Run Club](../planning/scenarios-backlog/F018-brian-declares-run-club.md) | T056 (items schema) | backlog (F018 deferred) |
| Share what I have | 5 | [`systems/item.md`](systems/item.md) (kind=offer) | Offer surface in [`capabilities/item-view.md`](capabilities/item-view.md), [`capabilities/item-respond.md`](capabilities/item-respond.md) | — (use-cases #9 TODO) | T056 (items schema) | substrate-only (b1) |
| Ask for help | 6 | [`systems/item.md`](systems/item.md) (kind=ask) | Ask surface in [`capabilities/item-view.md`](capabilities/item-view.md), [`capabilities/item-respond.md`](capabilities/item-respond.md) | — (use-cases #9 TODO) | T056 (items schema) | substrate-only (b1) |
| Make and be found | 7 | [`systems/item.md`](systems/item.md), [`systems/groups.md`](systems/groups.md), [`systems/discovery.md`](systems/discovery.md), [`systems/business-jurisdiction.md`](systems/business-jurisdiction.md) | Item composer (product/service kinds) in [`capabilities/item-view.md`](capabilities/item-view.md); Seller section in [`ui/community-platform.md`](ui/community-platform.md); [`systems/producer-tools.md`](systems/producer-tools.md) Bulletin | — | T055 (groups), T056 (items), T057 (discoverable_items) | substrate-only (b1); Bulletin surface b2 |
| Follow what I love | 8 | [`systems/member.md`](systems/member.md) (`member_follows`), [`systems/location.md`](systems/location.md), [`systems/producer-tools.md`](systems/producer-tools.md) | Follow surface in [`capabilities/member-profile.md`](capabilities/member-profile.md); Location-follow per [`systems/location.md`](systems/location.md) | [F025 — Adaeze creates her Member public page](../planning/scenarios-backlog/F025-adaeze-member-public-page.md) | T048 (interests + follows), T049 (location affinities) | substrate-only (b1); surface b2 |
| Find a local pro | 9 | [`systems/item.md`](systems/item.md) (kind=service), [`systems/member.md`](systems/member.md) | Service-Item view in [`capabilities/item-view.md`](capabilities/item-view.md); search via [`ui/community-platform.md`](ui/community-platform.md) Explore | — (use-cases #10 TODO) | — | substrate-only (b1) |
| Start something | 10 | [`systems/item.md`](systems/item.md) (kind=initiative) | — (Initiative composer ships b3) | — | — | schema reserved (b1); surface b3 |
| Pool resources | 11 | [`systems/item.md`](systems/item.md) (kind=initiative + pledge), [`systems/payments.md`](systems/payments.md), [`systems/stewardships.md`](systems/stewardships.md) | — (stewardship UI ships with ship-theme S6.5) | — | — | schema reserved (b1); rail b2; Initiative surface b3 |
| Steward what we built | 12 | [`systems/stewardships.md`](systems/stewardships.md), [`systems/groups.md`](systems/groups.md) | — (capability docs not yet authored) | — (use-cases #11 TODO) | — | draft (ship-theme S6.5 spec'd; not yet bundled) |
| Take what I built with me | 13 | [`systems/agent-assistance.md`](systems/agent-assistance.md) (Delegation + Assistant Context portability), [`systems/action-layer.md`](systems/action-layer.md) (event log invariants), [`systems/member.md`](systems/member.md) (data export) | `/you/data` export + purge (b1 substrate) | — | T050 (member-agent-assistance substrate), T043 (action-layer scaffold) | substrate-only (b1); federation surface b3 |

---

## Engineering-only rows (substrate that doesn't trace cleanly back to a single need)

These are foundational rows — they exist because the architecture needs them, not because one specific need demands them. A row here that grows a need-trace later moves up to the main table.

| What it does | System | Tickets | Status |
|---|---|---|---|
| Action layer — the only write path; vends per-turn capabilities; same-transaction row+event commit. | [`systems/action-layer.md`](systems/action-layer.md) (ADR-7) | T043 (scaffold + member.create), T044 (auth signup hook), T051 (CI enforcement) | active (b1) |
| Event-log substrate — `*_events` tables, partitioned, audit fields on every row. | [`systems/action-layer.md`](systems/action-layer.md) | T041 (extensions + embedding), T043 (action layer scaffold), T052 (Phase 0 eval helpers), T053 (Phase 1 eval helpers) | active (b1) |
| Member-auth PK equality (`members.id = auth.users.id`). | ADR-15, [`systems/member.md`](systems/member.md) | T042 (members floor + system member), T044 (auth signup hook), T047 (Phase 1 FK / privacy / handle history) | active (b1) |
| Member-location affinity privacy (RLS owner-only). | ADR-16, [`systems/member.md`](systems/member.md), [`systems/location.md`](systems/location.md) | T049 (member-location affinities) | active (b1) |

---

## Open lineage gaps

Rows where the trace runs into a `—`. These are the candidates for the next scenario / ticket. Listed in priority order if the PM picks "what should ship next":

1. **Find my people → Group surfaces** — `groups.md` substrate is shipping (T055); no scenario yet for Member-facing Group creation flow. F-number pending.
2. **Gather regularly → Event-host UI** — F018 (Brian declares Run Club) is deferred; rewrite punch list lives in [the F018 review](../_attic/2026-05-27/planning-history/F018-review.md). Picking this up means revising F018 against the post-2026-05-11 naming pass.
3. **Follow what I love → Member-page surface** — F025 (Adaeze) is in the backlog; first scenario for the `/m/[handle]` page surface.
4. **Make and be found → Producer surfaces** — `producer-tools.md` Bulletin and Growth specs exist; no b2 ticketing yet.
5. **Use-cases gaps** — Four `[TODO]` slots in [`needs/use-cases.md`](needs/use-cases.md) (#8 Float an idea, #9 Share/Ask, #10 Find a local pro, #11 Steward what we built). When these get real-instance fills, they unlock new scenarios + role-coverage refinements in [`needs/use-cases.md`](needs/use-cases.md) § Member roles.

---

## How TRACE stays current

- **PM adds a row** when a new scenario lands in `planning/scenarios-backlog/` or graduates to `planning/scenarios/`. Source columns (Need / Loop / System / Capability) inherit from the scenario's anchor; right-hand columns (Feature / Scenario / Ticket / Status) update as the ticket sequence ships.
- **`orient` invokes this doc** when a sub-bundle closes — the work map's 🟢 items have all landed, the TRACE rows tied to them flip to *active*, and the open-gaps list gets refreshed.
- **`orient` mentions TRACE at session start** if the PM asks "what's next" — TRACE's open-gaps list is one good answer.

When a TRACE row would say "engineering-only" or land below the main table without a need-trace, that's a flag — pause and ask: *what need does this serve?* If the answer is "none," the work isn't necessarily wrong, but it's the kind of work that, unwatched, becomes the platform serving itself.
