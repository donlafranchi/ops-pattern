---
purpose: Explore surfacing emergent Group suggestions from Member taste-overlap on Items, without crossing the auto-assignment refusal.
layer: what
status: exploration
---

# Exploration: Affinity-derived Group suggestions

> **Status:** Exploration, **not b1**. Substrate dependencies (Saves populated at meaningful density, `member_interests` tags in use, the discovery overlap index mature enough to compute Member-Member similarity cheaply) push the earliest plausible ship to **b2+**. Drafted 2026-05-23 under the `explore` skill at PM request; lives here until the data conditions exist to test it on real Members. Pipeline-plan should not scenarioize this until those conditions are met.

> **The constraint this doc is written against.** [`principles.md`](../foundation/principles.md) names auto-assigned Groups as a categorical failure: *"Groups cannot be auto-assigned by geography. … They cannot be created and populated by the platform on behalf of users it suspects share an interest. They are started, joined, stewarded, and dissolved by Members, and by Members alone."* [`groups.md`](../systems/groups.md) line 361 codifies the schema posture: *"the platform may suggest a Group based on follows or attendance (`source='soft_via_follow'`, `'soft_via_attendance'`) but those are surface-level only and do not grant addressability."* This exploration adds a third soft source — `source='soft_via_taste_overlap'` — and argues the boundary.

---

## The shape

When N Members independently save Items from the same handful of authors / kinds / Locations, the platform notices the overlap and surfaces a **prompt** — never a Group, never a roster.

> *"You and 14 other Members have saved many of the same Items from Sacramento makers in the last 90 days. Want to start an interest Group? If you start one, we'll let those Members know it exists. They decide whether to join."*

The prompt has exactly one affordance: **Start a Group** (which deep-links into the b1.1 Group composer, with `kind='interest'` pre-selected and `source='soft_via_taste_overlap'` stamped on the resulting Group). No one is added. No roster exists. The other 14 Members are notified *only after* a Group is created — and only with a one-time "a Group exists that overlaps your saves; here's the page; join if you want" surface. The notification is itself a soft suggestion, surfaced on their next session, not pushed.

The Member who clicks **Start a Group** is the first member. Everyone else has to take an explicit join action against an existing Group. The overlap calculation is decoration on a discovery prompt; it is not a membership predicate.

---

## Where the prompt surfaces

Two candidate surfaces, in order of preference:

1. **The Member's `/you` home, "Things we noticed" section** (b2 surface, currently a placeholder). Low-key, opt-in-to-see, ignored by Members who don't care. The prompt appears alongside other soft signals ("3 Members you follow saved this Item this week" / "the Item you saved last month sold out"). Affinity-overlap is one card among many; the Member chooses whether to engage.
2. **Group browse / discovery tab, "Communities people are starting to want" lane.** When a Member browses Groups in their place context, the platform may surface "groups that don't exist yet but might" alongside groups that do. Lower-pressure than the home surface; the Member came looking for Groups, so a suggestion to start one is on-topic.

**Refused surfaces.** Email, push notification, SMS. Any push surface turns a soft suggestion into a solicitation — converts "we noticed" into "we want you to do this." That tips the design into the engagement-shape principles.md refuses. The prompt must wait for the Member to come to a relevant surface; it cannot chase them.

---

## What triggers the prompt

A candidate cluster qualifies when **all** of the following hold:

- ≥ N Members share ≥ M overlapping saved Items in the last T days. Working defaults: **N = 8, M = 5, T = 90.** These are guesses; the right values are what produces clusters that survive a "would this actually want to be a Group?" sniff test on real data. **Calibration is a b2 design step, not a b1 commitment.**
- The cluster spans **≥ 2 distinct Item authors**. Single-author clusters are fan-bases, not interest Groups — let the producer-side surface handle those.
- No existing kind='interest' Group already serves the cluster's shape (rough overlap test against existing Group descriptions / tags). A suggestion for a Group that already exists should instead surface as *"a Group like this already exists — here it is"* on the same surface, routing to the join flow.
- The cluster has **not been suggested before** within a cooldown window (working default: 180 days). Re-suggesting the same cluster turns a one-time prompt into a nag.

The overlap calculation lives in [`discovery.md`](../systems/discovery.md) (the existing locality-first index already computes per-Item engagement; extending to Member-Member Jaccard / cosine over saved-Item sets is incremental). Compute cadence: batch nightly, not real-time. Cheap, eventually-consistent, no implications for the action layer.

---

## The boundary — "suggested" vs "auto-assigned"

This is the section that earns the doc its place. The PM and `scope` should refuse this exploration if the boundary doesn't hold.

| | Auto-assigned (refused, categorical) | Suggested (this proposal) |
|---|---|---|
| **Who is in the Group?** | The platform's inferred cluster — by geography, follow graph, or save overlap | Only Members who took an explicit join action against a Group that exists |
| **Does the Group exist before any Member acts?** | Yes — the platform created it | No — the platform suggested *starting* it; no Group exists until a Member starts one |
| **Can a Member be addressed because the platform thinks they belong?** | Yes — that's the failure mode | No — addressability requires `group_memberships.source='explicit'` per `groups.md` |
| **Can the suggestion be ignored?** | Not really — the Member is already in the Group | Yes — the prompt is one card on a low-pressure surface; ignoring it costs nothing |
| **Does the suggestion grant any standing, tier, capability, or visibility?** | Yes — the Group exists and the Member is part of it | No — the suggestion is decoration on a discovery surface |
| **What's the schema artifact?** | `group_memberships` row created without Member action | A `group_suggestions` event log entry (audit-only) and, *if* the Member acts, a normal Group composer flow with `source='soft_via_taste_overlap'` recorded on the resulting Group |

The load-bearing distinction: **a suggestion is a prompt to take an action; an auto-assignment is the action itself.** If the platform creates a row in `group_memberships` without the Member explicitly choosing, that's auto-assignment regardless of what the UI calls it. If the platform surfaces a card the Member can click, ignore, or dismiss — and the Group only exists after a Member chooses to start it — that's suggestion.

**The line is drawn at: no Group exists until a Member starts one.** This is stricter than `soft_via_follow` / `soft_via_attendance`, which already exist in `groups.md` (those suggest joining a Group that already exists; this suggests *starting one that doesn't yet*). The strictness is intentional — the closer a feature gets to "the platform made the Group," the more carefully the surface has to refuse to be that thing.

### Tests this proposal passes

- **Decision Test ([`principles.md`](../foundation/principles.md) Part 3):** Does this expand Member options? Yes — surfaces a Group-creation possibility the Member would not have seen otherwise. Could it harm others? Only if it became a nag or a pre-populated roster. The cooldown + the no-push-surface constraints address the nag failure; the "no Group exists until a Member starts one" rule addresses the roster failure.
- **The principles.md Group asymmetry:** *"A Group without Members ceases to exist. … Members can dissolve a Group; a Group cannot dissolve a Member."* This proposal preserves both halves — the suggested Group has zero Members until one starts it; every subsequent join is an explicit Member act.
- **The `groups.md` Nextdoor-pattern test (line 396):** *"Does this proposal want to treat Location-affinity / signal-X as if it were membership (addressable, listable, broadcast-targetable)?"* No — the 14 other Members in the cluster are never listed, never addressed, never told another Member exists in the cluster. They learn the Group exists only after it's started, and only via a soft surface on their next session.

### Failure mode to watch

If the prompt ever shows the Member the *names or count of other specific Members* in the cluster before a Group exists, the design has crossed the line. "You and 14 others" is acceptable (cardinal, anonymous). "You and Sara, Marcus, and 12 others" is not — that's a pre-populated roster in everything but storage, and it would shape the Member's decision around social pressure rather than the Items themselves. **The prompt names Items, not Members.**

---

## What it links into

- **b1.1 Group composer** — the **Start a Group** affordance deep-links into the existing kind='interest' creation flow with `source='soft_via_taste_overlap'` stamped on the resulting `groups` row (additive enum value on `group_memberships.source` per `groups.md` line 361 pattern). The composer itself does not change.
- **Discovery overlap index** ([`discovery.md`](../systems/discovery.md)) — extended to compute Member-Member similarity over saved-Item sets, nightly batch. The Saves substrate already exists in `member.md`; the index is the new piece.
- **The Member's `/you` "Things we noticed" surface** — needs to exist as a soft-signal home. Currently a b2 design placeholder; this exploration is one of several reasons that surface earns its slot.

---

## Bundle mapping

- **b1: nothing ships.** Save event row + `member_interests` tags + the existing `groups.md` soft-source schema pattern are enough substrate. No new tables required at b1 specifically for this feature.
- **b2: the surface ships,** assuming Saves have populated to meaningful density (working threshold: ≥ 100k save events across the active Member set, or whatever density makes the overlap calculation produce non-trivial clusters). The `/you` "Things we noticed" home is a prerequisite.
- **b3: tuning.** Cluster-quality feedback — did the Member start a Group? Did anyone join? Did it survive 90 days? Feeds back into the threshold-calibration loop (and is a candidate `loop-designer` use case).

---

## Data model implications

To enable this feature without backfill pain when b2 arrives, the b1 substrate needs:

- `item_saves` table (or equivalent — verify the exact name against the live `member.md` substrate; if it doesn't exist yet, that's the load-bearing b1 add). Columns at minimum: `id`, `member_id`, `item_id`, `created_at`, `removed_at` (soft, nullable). The event `member.item_saved` / `member.item_unsaved` is already implied by `member.md` line 171's "saves" reference; codify the table + events at b1 even though the suggestion surface ships at b2.
- `group_memberships.source` enum: add `'soft_via_taste_overlap'` to the existing `'explicit' | 'soft_via_follow' | 'soft_via_attendance'` set when the suggestion surface ships (b2). Reserved in spec at b1; added to the enum at b2.
- `group_suggestions` event log (b2). Audit-only. Records `(cluster_hash, member_ids[], item_ids[], suggested_at, dismissed_at, acted_on_at, resulting_group_id)`. Powers the cooldown check and the cluster-quality feedback loop. Not RLS-readable by Members — internal-only.
- No new RLS policies on `groups` or `group_memberships`. The suggestion surface reads from `item_saves` (Member's own rows + aggregate counts via SECURITY DEFINER, matching the `member_location_affinities` pattern in `member.md` line 294). The Group, once created, is governed by the existing `groups.md` policies.

---

## Open questions for `scope` (when this graduates)

1. **What's the right N / M / T threshold?** The defaults (8 / 5 / 90) are guesses. Pre-launch this is unanswerable; b2 should ship with conservative thresholds and an explicit calibration loop.
2. **Does the suggestion show the cluster's Item names, the authors' names, both, or neither?** Trade-off: showing Items grounds the suggestion ("you've all saved these"); showing authors risks looking like the platform is matchmaking around specific producers. Lean toward Items, not authors.
3. **What happens to the suggestion if the Member who would start the Group declines?** Does the next Member in the cluster get the same prompt, or does the cluster go dormant for the cooldown? Default: cooldown the cluster, but surface to the next Member after the window. Open.
4. **Is there a producer-side surface?** Should the Items' authors (the Sacramento makers in the example) know that a cluster of Members are saving across their catalog? Adjacent to this proposal — probably belongs in [`producer-tools.md`](../systems/producer-tools.md) Growth surface, not here.
5. **Cross-cluster contamination.** A Member might appear in multiple clusters (food + music + woodworking). How many simultaneous suggestions can sit on the `/you` surface before the surface becomes noise? Working answer: at most one taste-overlap card at a time; the surface picks the strongest cluster by overlap density.

---

## Refuse-and-reframe candidates

If the PM finds any of the following, the proposal should be refused (or reframed) rather than scenarioized:

- The prompt becomes a notification (email, push). Reframe: keep it on the soft surface only.
- The cluster names other Members. Reframe: cardinal only, never named.
- The "Start a Group" affordance pre-populates members. Reframe: starting creates an empty Group; others must join explicitly.
- The threshold drops low enough that every Member sees a prompt. Reframe: tune the threshold up; a suggestion that fires for everyone isn't a signal.
- A non-Member-initiated path exists (e.g., the platform creates a "draft" Group that needs Member adoption to "activate"). Reframe: the platform does not create Groups, even drafts.

---

## Hand off

When this graduates from exploration, the system home is most likely a section inside [`groups.md`](../systems/groups.md) (alongside the existing `source='soft_via_follow'` / `'soft_via_attendance'` paragraph at line 361), with the overlap-calculation mechanics living in [`discovery.md`](../systems/discovery.md). No standalone system spec needed — this is a surface on top of two existing systems.

**Pipeline-plan should not scenarioize until:**
- The Saves substrate is live at b1 (event log + table).
- The b2 `/you` "Things we noticed" surface has a home.
- The PM has run the principles.md Decision Test on the working draft and signed off.

**Canonical example to add to [`use-cases.md`](../needs/use-cases.md) when this graduates:** *A Member in Sacramento has been saving Items from four local fermenters over six months — kombuchas, krauts, hot sauces, miso. The platform notices that seven other Members have a heavily overlapping save set. On the Member's next visit to `/you`, a soft card appears: "You and seven other Members have saved many of the same things from Sacramento fermenters lately. Want to start a Group? If you do, we'll let them know it exists." The Member clicks **Start a Group**, names it "Sacramento Fermenters' Circle," sets it to kind='interest'. The other seven Members get a soft notification on their next session. Four join; three don't. The Group exists because a Member started it, not because the platform inferred it should."*
