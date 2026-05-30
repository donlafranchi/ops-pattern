# Intent check — ADR-21 and the seven spec patches

**Date:** 2026-05-23
**Target:** [`planning/adrs/ADR-0021-member-geography-substrate-split.md`](../adrs/ADR-0021-member-geography-substrate-split.md) · [`product/systems/member.md`](../../product/systems/member.md) · [`product/systems/location.md`](../../product/systems/location.md) · [`product/systems/places.md`](../../product/systems/places.md) · [`product/systems/business-jurisdiction.md`](../../product/systems/business-jurisdiction.md) · [`product/systems/groups.md`](../../product/systems/groups.md) · [`product/systems/discovery.md`](../../product/systems/discovery.md) · [`product/systems/item.md`](../../product/systems/item.md)
**Verdict:** **ESCALATE + PROPOSE**

**Summary.** Scanned ADR-0021 and the seven spec patches that landed alongside it for unannotated Category 1–8 statements introduced by the redesign. Found **3 Category-2 absolutes** that need `pipeline-ratify-absolute` interactive ratification (the refusal shapes the substrate split *encodes*), **4 Category-1 numeric thresholds** that need substantive Intent (the `≤5 secondary` cap, the `1–80 char` saved-search label range, the community-awareness feed default traversal depth, and the Tier-0 self-attested floor), **2 Category-5/6 constraint statements** (the unique-primary-home partial index; the `made_at_verification_source='none'` default), and **2 Category-7 cross-doc commitments** stated locally (the "per ADR-21" + "per ADR-16's posture carried forward" references that need their *local contribution* named). Pre-existing Intent annotations in `groups.md` Locality and promotion, `places.md` curation, and `business-jurisdiction.md` Tier 0 already cover the largest absolutes by inheritance; the flags below are the *new* surface ADR-21 introduced.

ESCALATE blocks `pipeline-plan` scenarioization until the 3 Category-2 absolutes carry State-tagged Intent via `pipeline-ratify-absolute`. PROPOSE flags can be landed in-line by the PM without the interactive walk.

---

## Category 2 escalations (refusals — route to `pipeline-ratify-absolute`)

These statements are absolute-language refusals introduced or re-stated by ADR-21. Per the archived intent audit's revised addendum, *every* Category-2 absolute carries PM-ratified Intent with a State tag (`Ratified YYYY-MM-DD` or `Deferred until {trigger}; review by {horizon}`). Detection here; ratification through `pipeline-ratify-absolute`.

### E1. `product/systems/member.md` — *Not a Location* paragraph

> "Per ADR-21 (2026-05-23), a Member's relationships to geography are recorded across three purpose-owned substrates rather than one fused six-kind table … Members do not have stored addresses."

**Why flagged.** Restates the project's standing "no stored addresses for Members" refusal *and* introduces the new "no fused six-kind table" structural refusal. Both are load-bearing — they govern how every future geography-shaped feature must land (split substrates, never re-fuse). Intent must name the failure mode the refusal protects against and carry a State tag.

**Surface text to walk.** *"Members do not have stored addresses"* (carried forward from prior member.md) + *"recorded across three purpose-owned substrates rather than one fused six-kind table"* (new).

### E2. `product/systems/business-jurisdiction.md` — *What this system is* paragraph (post-patch)

> "This Business Jurisdiction system is the **only signal** for the locally-owned claim."

**Why flagged.** Newly absolute under ADR-21 — the prior wording was "a *second signal* alongside affinity." Now it is *the* signal, full stop. Refuses the prior dual-path (affinity + jurisdiction). Load-bearing for every future locally-owned surface and every adjacent spec (groups.md derivation reads only this substrate). Needs Intent + State tag.

**Surface text to walk.** *"This Business Jurisdiction system is the only signal for the locally-owned claim."*

### E3. `product/systems/discovery.md` — *Community-awareness feed* section

> "No per-Location follow row participates in feed generation — that substrate retired with ADR-21."

**Why flagged.** A structural refusal stated in the operational doc (`discovery.md`) rather than only in the ADR. Governs all future feed-generation proposals: any later "but if we just stored a follow row for performance" must re-derive against the refusal, which requires Intent + State tag to be ratified-vs-incidental.

**Surface text to walk.** *"No per-Location follow row participates in feed generation."*

---

## Category 1 — Numeric thresholds (propose Intent)

### 1. `product/systems/member.md` — Place-interest scope

> "One `primary_home` Place plus up to 5 `secondary` Places."

**Why flagged.** A specific cap. The exploration documented the rationale ("the cap exists so feed-cost stays bounded"), but the spec-resident text states the number without naming the trade-off. Downstream agents tuning the cap need to know which side matters.

**Proposed Intent.**
> **Intent:** 5 is a hand-tune to bound the community-awareness feed candidate-set cost — Place-interests are the outer scope of the feed query, and unbounded cardinality would let a Member with 50 secondaries cause join-cost regressions across the index. Adjust upward only when the feed query is reshaped to absorb wider cardinality cheaply; adjust downward only when measurable Members hit the cap and pick a different scope to drop.

**Load-bearing?** No — the cap is a performance hand-tune, not a structural commitment. A downstream agent that raises it without reshaping the feed query would degrade performance but not violate any commitment.

### 2. `product/systems/member.md` — Saved searches label

> "`label` (Member-authored, 1–80 chars)"

**Why flagged.** Number-range constraint without rationale; sits in the same shape as the handle / display-name length constraints elsewhere in `member.md` that *do* carry Intent.

**Proposed Intent.**
> **Intent:** 80 chars sits above "tag" length (≈40) and below "description" length (≈200+) — long enough for an intent label ("Concerts in the parks I like — Sacramento MSA") but short enough that the surface stays scannable in a list-of-subscriptions UI. The lower bound (1) prevents empty labels because the label *is* the Member's reason for the subscription, surfaced in their notification settings.

**Load-bearing?** No.

### 3. `product/systems/discovery.md` — Community-awareness feed

> "Default traversal depth is *up to city* (a Member with `primary_home=Oak Park` sees Items in Oak Park and in Sacramento-the-city by default); MSA-depth opt-in is a Member setting."

**Why flagged.** A specific policy default (depth = city, not MSA, not state) presented as a working answer. Decision needs Intent so a future surface adjustment knows which side matters.

**Proposed Intent.**
> **Intent:** *City* is the default depth because Items at that scope are still *legibly local* to a Member — a Member with primary_home in Oak Park recognizes Sacramento-the-city as their place; MSA is one step too wide for "the neighborhood feed I check daily" framing and risks diluting the locality signal with cross-city noise. MSA-depth opt-in exists because *some* Members (commuters, cross-city families) genuinely want the wider scope; making it the default would lower the noise-floor for everyone. State-never depth is excluded by the same reasoning carried further.

**Load-bearing?** No — adjustable as Member feedback comes in; structural shape (depth as a setting, not as code) is what matters.

### 4. `planning/adrs/ADR-0021-member-geography-substrate-split.md` Trade-offs section — Tier 0 floor

> "Tier 0 self-attested is the b1 floor."

**Why flagged.** A specific evidence-tier choice (Tier 0 ships; Tiers 1 / 2 defer). Tier-assignment shape (Category 4) crossing into Cat-1 numeric — the b1 floor is the *number* of tiers.

**Proposed Intent.**
> **Intent:** Tier 0 (self-attested) is the b1 floor because the public evidence-tier *itself* is the platform's transparency answer — "Claimed local owner" is materially weaker than "Verified" or "Documented" on the surface, and competitive pressure pushes Members up the ladder without the platform requiring it. Tier 1 (SOS API) and Tier 2 (document upload) defer to b2+ because they carry integration / review costs the platform can't absorb pre-revenue; the floor is what makes the surface honest in the meantime.

**Load-bearing?** Yes — this is the policy posture that lets the platform ship the locally-owned badge at b1 without an evidence pipeline. Load-bearing in the sense that *removing* Tier 0 would force shipping Tier 1/2 at b1 or scrapping the badge surface entirely.

---

## Category 5 — Required vs optional vs nullable (propose Intent)

### 5. `product/systems/member.md` — Place-interest unique partial index

> "Unique partial index `(member_id) where scope_kind='primary_home' and removed_at is null` enforces exactly one active primary_home per Member."

**Why flagged.** A structural constraint (exactly one primary_home) stated at the DDL layer. Identity-vs-incidental: this is the *identity* shape — a Member has one home scope, multiple secondary scopes. The constraint encodes the conceptual model directly.

**Proposed Intent.**
> **Intent:** Exactly-one `primary_home` is the identity shape per Member — "where the awareness feed defaults from" is singular by definition; multiple primary_homes would be ambiguous about which one drives the default traversal. Secondaries are multi because cross-Place interest *is* multi (work city + home city + hometown). The unique partial index encodes the conceptual asymmetry at the schema layer rather than at the action handler, so the constraint can't drift out of sync with the model.

**Load-bearing?** Yes — a downstream agent that "for performance" stored multiple primary_home rows and picked one at query time would silently contradict the spec's identity claim.

---

## Category 6 — Behavioral defaults (propose Intent)

### 6. `product/systems/item.md` — Provenance default

> "`items.made_at_verification_source` enum — values: `none` (default for all rows), `self_attested`, `document_supported`."

**Why flagged.** Default-value choice with policy implications: every kind='product' Item starts with no provenance claim. Opt-in shape. Sits in the same posture as ADR-9's opt-out default for privacy fields, but here the *opt-in* default applies because the badge is a Member-affirmative claim.

**Proposed Intent.**
> **Intent:** Default `'none'` because the "Locally Made" badge is a Member-affirmative *claim*, not a platform inference. Defaulting to `self_attested` (or auto-deriving from the seller's jurisdiction ZIP) would either lie about the evidence level or quietly conflate ownership with provenance — the exact conflation ADR-21's substrate split exists to prevent. The Member declares the claim; the platform stores it with its honest tier.

**Load-bearing?** Yes — a future feature that auto-populates `made_at_verification_source` from any other field would re-merge the two signals ADR-21 separated.

---

## Category 7 — Cross-doc structural commitments stated locally (propose Intent)

### 7. `product/systems/member.md` — Decisions encoded line

> "ADR-16 **PARTIALLY SUPERSEDED by ADR-21** 2026-05-23 — the per-row-privacy posture … survives and applies to `member_place_interests` and `member_saved_searches`."

**Why flagged.** A "per ADR-N" reference that points to two ADRs, claims one supersedes the other in scope, and uses the result as the load-bearing rationale for the spec's RLS posture. The *local* contribution — what `member.md` enforces vs. what the ADRs commit — is implicit.

**Proposed Intent.**
> **Intent:** ADR-16's owner-only-RLS posture is enforced *here* by the RLS clauses on `member_place_interests` and `member_saved_searches` (owner-only SELECT, action-handler-only writes); the broader doxxing-prevention commitment is enforced across `business-jurisdiction.md` (jurisdiction substrate is *public* by deliberate contrast), `policy.md` (no Location-scoped messaging), and `discovery.md` (the community-awareness feed reads but never exposes Place-interests). ADR-21 supersedes ADR-16 in *scope* (table dissolves) but not in *posture* (owner-only RLS persists on the new substrates).

**Load-bearing?** Yes — without this Intent, a future spec editor could read "ADR-16 partially superseded" and conclude the privacy posture was relaxed, when in fact it was carried forward.

### 8. `product/systems/business-jurisdiction.md` — *Note on the retired affinity substrate* paragraph

> "Per ADR-21 (2026-05-23), the six-kind `member_location_affinities` table is retired entirely … The locally-owned derivation now reads `member_business_jurisdictions` exclusively."

**Why flagged.** Same shape as #7 — a "per ADR-21" reference where the *local* contribution (this spec is the *only* substrate, by construction) is the load-bearing claim. Important to surface because `groups.md`'s pseudocode depends on the local exclusivity, not on the cross-doc commitment.

**Proposed Intent.**
> **Intent:** ADR-21's exclusivity claim is enforced *here* by `member_business_jurisdictions` being the only substrate the `groups.md` locality-derivation pseudocode reads — the prior `member_is_local_to_location()` function path that read `lives`/`works` affinity rows is gone. The broader substrate-split commitment lives across `member.md` (private substrates), `discovery.md` (feed reads place-interests), and `item.md` (provenance claims). This spec owns *seller-locality-derivation*; the other geography substrates own *Member-awareness* and *product-provenance*.

**Load-bearing?** Yes — a future spec that re-introduced an alternate locally-owned path (e.g., reading Group memberships for locality inference) would silently contradict the exclusivity claim ADR-21 ratified.

---

## Notes for the PM

- **Three Category-2 escalations.** The ESCALATE verdict is what blocks `pipeline-plan`. Walk E1 / E2 / E3 through `pipeline-ratify-absolute` before any scenario writing. All three are likely Ratified (not Deferred) — the redesign is the ratification — but the State tag and substantive Intent need to land in the spec text per rule #10 in `CLAUDE.md`.
- **Five PROPOSE flags are landable in-line.** Items 1, 2, 3, 4, 6 can be added directly under the relevant statement; items 5, 7, 8 are bigger and might want a sentence-pass before landing.
- **Pre-existing Intent annotations were not re-flagged.** The patches preserved (and in some cases strengthened) the existing Intent blocks in `groups.md` Locality and promotion, `places.md` curation, `business-jurisdiction.md` Tier 0 three-filter analysis, and `policy.md` anti-Nextdoor. Those remain CLEAN.
- **One pattern to consider consolidating.** Flags 7 and 8 are the same Category-7 shape applied to two different docs — both are "per ADR-21 + per (partially-superseded) ADR-16" cross-references. If the PM lands a slightly-longer canonical Intent in one spec, the other can cite it shorter ("see `member.md` Decisions encoded for the local-vs-cross-doc decomposition").

## Re-run after

PM walks E1, E2, E3 through `pipeline-ratify-absolute`; lands proposed Intent lines for 1–8 (or revises). Then re-run this skill on the same target set until verdict is CLEAN. Only then does `pipeline-plan` proceed.
