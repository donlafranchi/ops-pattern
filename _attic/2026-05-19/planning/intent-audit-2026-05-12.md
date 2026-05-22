# Intent Audit — Statements That Would Benefit From Explicit `Intent:` (ARCHIVED 2026-05-12)

> **ARCHIVED 2026-05-12.** This document's load-bearing content has been encoded into the project's skills and pipeline docs; the document survives here as historical reference. **Do not cite as live policy.** The successors:
>
> | What lived here | Now lives in |
> |---|---|
> | 8 categories of statements needing Intent | [`../../skills/pipeline-intent-check/workflow.md`](../../skills/pipeline-intent-check/workflow.md) §2 (Detect candidates) |
> | "Compress *why* into *what*" framing + two failure modes | [`../../AGENTS.md`](../../AGENTS.md) preamble ("What every gate is guarding against") + [`../PIPELINE-AUDIT.md`](../PIPELINE-AUDIT.md) F13 |
> | No-purely-categorical-refusal principle (2026-05-12 addendum) | [`../../skills/pipeline-clarify-absolutes/SKILL.md`](../../skills/pipeline-clarify-absolutes/SKILL.md) + [`workflow.md`](../../skills/pipeline-clarify-absolutes/workflow.md) |
> | ESCALATE verdict routing Category-2 absolutes | [`../../skills/pipeline-intent-check/workflow.md`](../../skills/pipeline-intent-check/workflow.md) §5 (Assign verdict) |
> | High-value-target Intent lines | Landed in the actual foundation + system specs during the 2026-05-12 audit pass — see [`../../JOURNAL.md`](../../JOURNAL.md) entry for that date |
> | 2026-05-12 reading-(1) vs reading-(2) addendum (revised same-day) | Encoded in `pipeline-clarify-absolutes` (the audit's own corrected addendum below is the historical record of how that correction came about) |
>
> For new work, invoke the skills directly. This document is preserved to make the original framing traceable; it should not be used as the source of truth for any active discipline.

---

**Scope:** The foundation/ and systems/ docs in this project. The pattern applies to the rest of the corpus; specific call-outs below are representative, not exhaustive.

**The problem this addresses.** Most decisions in these docs carry rich rationale, but a specific class of statement compresses the *why* into the *what*. A downstream agent (ticket-writer, build agent, eval) then has to either reconstruct the intent (lossy, drift-prone) or treat the surface fact as the whole story (over-fits the literal wording when it should adapt). Adding short `Intent:` annotations to those statements lets the agent reason about *what the decision is protecting against* rather than just *what the decision says*.

---

## Recommended annotation pattern

Adopt one of these two forms. They're light enough to scatter throughout specs without ceremony.

**Inline form** — for short statements:

```markdown
- `display_name` (required, text, 1–120 chars). The Location's display name.
  **Intent:** 120 caps below "marketing tagline" territory while leaving room for "California Family Fitness Parking Lot" — keep labels declarative, not promotional.
```

**Block form** — for structural decisions:

```markdown
### No `member_roles` table
> **Decision:** Member affordances surface from Group memberships and Item presence, not from a roles enum on the Member row.
> **Intent:** Roles-as-identity is the directory failure mode (Yelp, Angi). If `role` is a column, an agent will eventually filter on it, rank by it, and gate features behind it — at which point the platform has reproduced the thing it was built to refuse. Removing the column makes the failure mode unreachable.
```

The Intent line is the **agent-ergonomic** part: it tells a downstream agent which way to break ties when the literal rule doesn't cover the case in front of them.

---

## Categories of statements that need Intent

These are the patterns to scan for. Anywhere you see one of these shapes, an Intent line is probably missing.

### Category 1 — Numeric thresholds, caps, expiries, defaults

A number appears without justification. The agent can't tell if it's load-bearing (don't change) or a placeholder (adjust freely).

Examples:
- `members.bio` "optional, text up to 500 chars" → why 500?
- `members.display_name` "1–60 chars" → why 60?
- Location `description` "up to 1000 chars" → why 1000?
- Discovery `location_decay` "exp(-distance_miles / 5)" → why 5? Why exp?
- Discovery candidate cap "~500 per request" → why 500?
- "10 miles default" radius → why 10?
- Capability expiry "seconds-to-minutes" → which side of that range, and why?
- Skill payment cap "5–10%" → which is the floor, which is the ceiling, and what's the rationale for the range?
- Group dormancy "90-day" → why 90?

### Category 2 — Refusals, negations, "deliberately no X"

The doc states what is *not* being done. The strong-form reasoning often lives in another doc; the agent reads this doc and doesn't follow the chain. Each negation deserves a one-line Intent so it's locally complete.

Examples:
- "Deliberately no Business entity" — Intent appears in `people-first.md`, but every spec that re-asserts this should carry its own one-line intent.
- "No `location_memberships` table"
- "No `members.maker_mode_enabled` column" (ADR-12 superseded)
- "Locations are not transferred"
- "The kind is set at creation and **does not transition**"
- "Hard deletes never ship"
- "The platform never moves money, never files paperwork, never commits a vote"

### Category 3 — Schema/URL/UI naming splits

The three-layer naming pattern is well-documented at the top of `CLAUDE.md`, but specific mappings (e.g., `gathering` → "Event", `wonder` → "Idea") read as arbitrary aesthetic choices unless the intent is captured at the point of mapping.

Examples:
- Why is the schema name `gathering` but the UI is "Event"? (Intent: schema captures the *recurring civic shape*; "Event" is the everyday word users actually use.)
- Why is `wonder` schema but "Idea" UI? (Intent: "Wonder" was the design verb; "Idea" is the noun a stranger recognizes.)
- Why `/i/[slug]` for wonder and `/initiative/[slug]` full-word for initiative? Stated rationale exists; Intent makes the inheritance rule clear ("preserve legibility over compression when an Item kind carries unusual weight").
- Why "Producer" preferred in ag/food but "Seller" generic? Intent: producer is the receiver-side framing the food vertical recognizes; seller is the platform-wide functional term.

### Category 4 — Tier assignments (T1 vs T2 vs T3)

A feature is parked at T2/T3. Without Intent, the agent can't tell whether deferral is *scope discipline* (could ship earlier but doesn't earn its slot) or *prerequisite-blocked* (literally cannot ship until something else lands).

Examples:
- Sub-venues "schema reserved at b1, surface at T2" — Intent: substrate must exist so b2 doesn't retrofit, but the surface adds complexity without proving the hypothesis.
- Vector embeddings at T3 — Intent: structured-filter search proves the index works; embeddings amplify a working index, they don't substitute for one.
- Group posting surfaces deferred to b2 — Intent: Group existence is the load-bearing primitive; Group *feed* is a behavior surface that can drift into Nextdoor failure mode if shipped before the messaging-scope discipline is bedded in.

### Category 5 — Required vs optional vs nullable

Constraints carry intent about what the platform considers identity-defining vs incidental.

Examples:
- `member_id` required on Location — Intent: every Location has a creator-of-record, so address-drift edits route to someone.
- `home_location_id` nullable on members — Intent: locality is set during onboarding, but a Member who hasn't completed onboarding shouldn't be blocked from existing.
- `category` required on Items — Intent: the locality-first index needs facet filtering to be useful; without category, browse degrades to keyword search.

### Category 6 — Behavioral defaults (boolean defaults, opt-in vs opt-out)

`policy-framework.md` covers the default-private posture in general. Specific defaults still need local Intent because the *general* posture doesn't explain why this particular toggle defaults this particular way.

Examples:
- `Allow direct messages` default `true` — Why is this the exception to default-private? Intent: messaging is the primary trust-building mechanism between Members; defaulting off would suppress the very behavior the platform exists to surface.
- `Show following / followers` default `false` — Intent: follower counts are the seed of social-comparison dynamics; off by default keeps the network from rewarding visibility-chasing.
- `Show items on profile` default `true` — Intent: a Member's Items are the visible work; hiding them by default would defeat the discovery-via-Member pathway.

### Category 7 — Cross-doc structural commitments stated locally

A line like "per ADR-7" or "the anti-Nextdoor commitment" appears. The agent often has the context but doesn't know which *part* of that commitment the current line is enforcing.

Example: `location.md` line 30:
> "Not a complaint surface. This is the structural anti-Nextdoor commitment."

The intent of *this specific statement* — that Location structure itself omits the surfaces that would enable complaint-posting — should be locally explicit. Otherwise the agent might read it as "no complaints allowed anywhere about Locations," which is wrong (a Wonder *about* a Location is fine — that's the platform's affordance).

### Category 8 — "Mirrors" / "Parallels" / "Same as" claims

These claims describe a structural symmetry between two systems. The Intent is *why the symmetry should be preserved* — because if a downstream agent breaks it on one side, the other side's invariants leak.

Examples:
- "mirroring the Item and Group primitives" (Location spine+child) — Intent: keep the three primitives' migration patterns aligned so one set of tools (action handlers, eval patterns, type generators) serves all three.
- "mirrors the no-kind-transitions rule" — Intent: kind change = identity change = new record; never in-place mutation, because event-log continuity assumes identity stability.

---

## High-value targets, file by file

The examples below are the highest-leverage places to add Intent. Listed by file with the statement and a proposed Intent line.

### `foundation/foundational-principles.md`

**P4 — "The line is extraction, not size."**
> **Intent:** Pre-empt the framing trap where "small business good, big business bad" gets read as anti-capitalism. The platform's enemy is extractive structure, not scale per se — a Mondragon-scale federation of cooperatives is squarely the goal.

**Part 3 — "Engagement-as-goal metrics. Optimizing for these violates P1."**
> **Intent:** Time-on-platform is the metric of every directory and social network the platform is structurally refusing to become; naming it as a categorical fail (not a debate) is the only way to keep it out of dashboards by inertia.

**Part 8 — "Earn-before-extract is the design intent."**
> Already labeled — this is the model. Replicate this convention.

### `foundation/people-first.md`

**"There is no Business entity in our schema."**
> **Intent:** A Business row is the single design choice that makes Yelp, Angi, and Google Business behave the way they do. Removing the row removes the place ranking, ads, and corporate-shell impersonation would attach to. Every downstream "shouldn't we just add a businesses table for this one case" is the same proposal in disguise; the schema's job is to make it structurally unavailable.

**"No reviews, no ratings."**
> **Intent:** Star ratings are the lever Yelp/Angi use to charge small operators for visibility. Refusing the surface refuses the business model. Endorsements survive because they're community-anchored (not aggregable into a price-of-visibility column).

### `foundation/loops.md`

**"This platform is not designed to grow like Facebook."**
> **Intent:** Facebook's failure mode is consolidation — every social/economic verb absorbed into one product, optimized for attention. The platform's growth shape is *outward spawning* into federated specialized infrastructure (Mondragon). Naming the anti-pattern explicitly is the way to keep "but we should add X" proposals legible as Facebook-shaped or not.

**Loop 9 — "*the plumber your neighbor used and trusts* — has no clean digital surface."**
> **Intent:** This is the wedge claim. The platform's value is in surfacing a relationship pattern that already works offline; if the digital surface adds friction or breaks the trust pattern, the feature failed even if metrics look fine.

**"Why this order" — three concurrent gradients (activation, belief, stake).**
> **Intent:** The order isn't a roadmap — it's a *constraint on which loops can be shipped before which*. A feature in Loop 11 (Pool) that doesn't lean on Loop 1–9's accumulated participation is asking strangers for capital, which fails. Use the order to spot loop-skipping proposals.

### `foundation/primitives.md`

**"A Location is **not a Group**."**
> **Intent:** Location membership is the Nextdoor failure pattern — geographic auto-inclusion creates a constituency the platform then has to moderate. People *affiliate* with Groups (chosen), and have *affinities* with Locations (multi, soft). The two records exist to keep that distinction load-bearing in the schema.

**"Deliberately no Business entity."**
> See people-first.md treatment above. Local intent at this point: prevent the future "but Items need to FK to something corporate for tax handling" proposal — money flows are Member-to-Member and tax surfaces are a federation handoff (Loop 13), not a schema fix.

**"Build the Item primitive seriously from day one."**
> **Intent:** The temptation to model products-as-fields-on-Maker is the same pattern that produced six separate systems in legacy specs. The Item primitive is what collapses Maker, Run Club, Wonder, and Plumber into one set of code paths. Skipping it at MVP is a one-way ratchet — once the per-feature tables exist, the platform can't unfork them without a migration.

**"Reserved schema for vector embeddings at MVP. Don't build semantic search at v1."**
> **Intent:** Embeddings amplify a working index; they don't fix a broken one. Shipping vector search before structured filter is right would mask whether the index is actually surfacing the right things, and "magic AI search" failures are extremely hard to debug.

### `foundation/policy-framework.md`

**"The opt-out default."**
> **Intent:** The phrase "opt-out default" is the inverse of what every platform that ate its users started with ("opt-in if you care"). Naming it as the *posture* (not a UX preference) is what makes "but the law only requires…" arguments inadmissible — the platform's compliance floor is its own framework, not a regulatory minimum.

**"Three filters" — Q3 "Can this be abused by bad actors?"**
> **Intent:** This filter exists because every prior wave of social platforms passed the first two filters at launch and failed on the third over time. Threat-modeling at design time (rather than after a bad-actor pattern emerges) is cheaper by orders of magnitude.

### `systems/groups.md`

**"The founder is the operating owner for kind='business' Groups, immutably."**
> **Intent:** Transferable operating-ownership is the seam at which "person who started this thing" diverges from "person currently running this thing." Forcing the seam to be a *new Group* (with claimed continuity) keeps the platform from becoming the record-of-truth for off-platform ownership transfers — which is a job the platform is not equipped to do (no escrow, no legal weight, no fraud recourse).

**"Multiple owners are supported via multiple owner-role memberships. … keeps partnerships from forking on the first disagreement."**
> **Intent:** Co-equal authority on routine writes (display_name edits, dissolution) would mean every change requires unanimous consent, which empirically deadlocks. Founder-as-operating-owner is the structural concession to "this is how partnerships actually function" rather than "this is what equality theoretically demands."

**Deferred: "Cooperative-style coordination (co-owning, voting, distributing) is deferred indefinitely."**
> **Intent:** Voting and distributions are *off-platform* verbs (securities law, operating agreements, distribution checks). Modeling them in schema before the platform's relationship to those verbs is clear paints into a corner — once `cooperative_governance_votes` exists, the platform implicitly owns the question of whether the vote is legally binding, which it isn't equipped to answer.

### `systems/item.md`

**"Schema names are durable; URLs and UI labels can evolve."**
> **Intent:** Schema migrations are expensive; UI/URL renames are cheap. Locking schema vocabulary to the most stable concept available at design time (rather than the prettiest user-facing word) keeps future rename work bounded to the surfaces it actually needs to touch.

**`gathering` → "Event" / `wonder` → "Idea" mappings.**
> **Intent:** "Gathering" and "Wonder" were the spec verbs that made the loop discussions legible internally; "Event" and "Idea" are the everyday nouns a non-aligned user recognizes immediately. The split lets the team keep the spec language without imposing it on users.

### `systems/location.md`

**"`label` (required, text, 1–120 chars)."**
> **Intent:** 120 chars is above "name" length (≈40) and below "tagline" length (≈200+) — the upper bound discourages promotional copy in what's meant to be a declarative locator field.

**"Not auto-discovered."**
> **Intent:** Pre-populating from Google Places would make the Location surface look "filled in" at b1 but at the cost of every Location row being a third-party-controlled fact. Forcing Member declaration keeps the deliberate-presence guarantee that everything else in the platform inherits.

**"Locations are not transferred."**
> **Intent:** Transfer flows are the surface adversarial actors use to take over established records. The b1 cost of "creator-of-record can't hand off" is small; the b1 risk of "anyone can claim Drake's by submitting a form" is large. T2 claim flow ships when the verification path is designed.

### `systems/discovery.md`

**"Never rank by business size, follower count alone, or anything that amplifies corporate shells over Members."**
> **Intent:** The discovery surface is the single highest-leverage place a chains-vs-locals bias could enter. Forcing the constraint into the scoring formula (rather than into review process) makes "but it would just be more relevant to rank by popularity" structurally unavailable.

**Scoring weights `w_graph = 1.0, w_loop = 0.6, ...`.**
> **Intent:** Hand-tuned, not config-driven — Intent is to keep weight changes in code review (visible, diffable, reversible) until the platform has enough behavioral data to tune empirically. Config-driven weights would let weights drift without explicit decision.

**"`already_seen_penalty` applied if Item shown ≥3× without engagement."**
> **Intent:** 3× is the threshold below which "haven't decided yet" is plausible and above which "not relevant" is more likely. Catches stale candidates without suppressing slow-burn discovery.

### `systems/action-layer.md`

**"The agent never holds the credential it acts under."**
> **Intent:** Credentials in an agent's context window are credentials in the next prompt-injection payload. Network-layer injection makes the worst-case exfiltration *impossible* rather than *unlikely*, which is the only acceptable posture for a system that has to run safely against adversarial user content.

**"closed-world catalog: every scope a caller might exercise is enumerated in code."**
> **Intent:** Allowlist semantics are what make policy refusals become "unreachable code" rather than "runtime checks that could be bypassed." A future feature requesting a new capability has to add the scope to the catalog *deliberately*, surfacing the policy review at the point of code change.

### `systems/member.md`

**"Real name is **encouraged but not required**."**
> **Intent:** Real names raise trust (Loop 1 traction is faster among neighbors who recognize names) but mandating them blocks the use cases the platform should serve — domestic-violence survivors, people in transition, professionals with reasons to separate identities. Encourage > require keeps both populations onboardable.

**"`public.members.id = auth.users.id` (PK equality, 1:1, lifetime-stable)."**
> **Intent:** Decoupling auth identity from Member identity would let the two drift (orphaned auth rows, multi-Member auth accounts) and require reconciliation tooling. PK equality removes the entire class of bugs by making the relationship structural rather than referential.

### `foundation/agent-assistance.md`

**"Read can be automated; write requires human confirmation."**
> **Intent:** This is the substantive trust commitment, not a UX flourish. An agent that can publish without confirmation can be prompt-injected into publishing on the Member's behalf — which compromises every loop the platform exists to surface. The asymmetry is what lets the platform be genuinely agent-friendly without becoming agent-controlled.

**"Persistence is standing-derived, not toggle-derived."**
> **Intent:** A toggle ("enable advanced assistant context") would let any Member opt into the chains-and-aggregators-level tooling instantly, which collapses the "earn before extract" disposition into a paywall in disguise. Tying depth to demonstrated standing keeps the asymmetric-tooling gift aimed at the people the platform exists to strengthen.

---

## Suggested next step

Pick one foundational file (suggest `foundational-principles.md` since it cascades) and annotate it end-to-end with this pattern. The first pass tells you whether the lightweight Intent line is the right shape, or whether some statements need a longer block-form treatment. Once the convention is settled, the ticket-writer and build-agent CLAUDE.md files can require Intent annotations on any new decisions they produce, which closes the loop on this gap permanently.

A `pipeline-intent-check` skill could verify that any new ADR or system-spec PR carries Intent annotations on statements matching the Category 1–8 patterns above. That's the structural way to keep this from re-accreting.

---

## Addendum (2026-05-12, revised same-day) — every absolute deserves Intent; there is no purely-categorical refusal

The first version of this addendum (drafted earlier 2026-05-12) admitted "categorical refusal" as a valid resting place for some Category-2 statements — i.e., that some "No X" bullets could stand without Intent because the refusal was *truly* categorical. PM ratification later the same day rejected that framing: **there is no purely-categorical refusal in this project.** Every "Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no X" carries a *why*, and that *why* is what a downstream agent needs to reason correctly when the literal wording doesn't cover the case in front of them. The earlier two-readings framework is corrected below.

**The corrected principle.** A Category-2 statement reads in one of two ways relative to the PM's actual stance:

1. *The wording is fine; the why is missing.* The bullet correctly states what's refused. An `Intent:` annotation lands alongside, naming the failure mode the refusal exists to prevent and the shape-specific carve-out (if any) — but no bullet revision is needed. This is the most common case.
2. *The wording is misleading; both bullet and why need revision.* The bullet text encodes a *shape-specific* refusal as if it were *categorical*, in a way that contradicts another spec, a recent ratification, or the PM's actual stance. The bullet itself must be revised to name the specific shape being refused, plus an `Intent:` annotation lands.

What the corrected principle removes: the third-option "no Intent needed; the refusal is categorical and self-evident." That option no longer exists. Every absolute lands with Intent.

**The two case examples that surfaced this.**

- *No Business entity* → the bullet wording was acceptable (the schema does not include a Business row), but the audit's first-pass Intent encoded the refusal as categorical (the row itself is the failure unit). PM's actual stance: the refusal is shape-specific — *impersonal* businesses are refused; personal businesses are first-class as `kind='business'` Groups. Bullet text retained; Intent rewritten; companion paragraph (line 27) updated to current vocabulary.
- *No reviews, no ratings* → bullet wording itself was wrong. The literal "we don't review people" reads as a categorical refusal of the entire review surface; PM's actual stance is shape-specific — *ranking people on a leaderboard* is refused; *reviews of treatment* are exactly the peer-pressure mechanism the platform wants. Bullet text rewritten ("No ranking of people. We review *treatment*, not the person."); Intent rewritten; companion social-capital corollary added.

**The check for `pipeline-intent-check` and `pipeline-clarify-absolutes`.**

When encountering a Category-2 statement (refusal, negation, "deliberately no X"):

1. **Always escalate.** Do not let the absolute pass without Intent. The earlier "this one's categorical, skip it" outcome is removed.
2. **Read cross-spec context first.** Before proposing wording, check whether another spec or recent ratification has softened or qualified this absolute. The `payments.md`-vs-"never moves money" tension is the canonical example.
3. **Form a hypothesis** about what's *actually* being refused. The literal X, or a specific shape of X? What's the failure mode? What's the carve-out, if any?
4. **Propose to the PM** with a question that surfaces the hypothesis ("This reads as categorical refusal of X — is the actual stance categorical, or is it refusing a specific shape of X?"). Do not assume; ask.
5. **Land both** the bullet revision (when needed) and the Intent (always) per PM ratification. Skill: `pipeline-clarify-absolutes` (interactive, per-statement). For batch detection, `pipeline-intent-check` flags Category-2 candidates and routes to clarify-absolutes for ratification.

**Why the two-readings framing was wrong.** It implied that a class of refusals is self-justifying — that the *what* implies the *why* clearly enough for the *why* to be left implicit. In this project, that's never true. Every absolute is a stance against a specific failure mode (Yelp / Angi pattern, Nextdoor pattern, prompt injection, off-platform legal entanglement, extraction-via-impersonality, ranking-via-aggregation, etc.). Naming the failure mode is the discipline; leaving it implicit is the drift. The "categorical" outcome was the loophole, and it's closed.
