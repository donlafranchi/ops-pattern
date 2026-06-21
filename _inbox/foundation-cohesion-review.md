---
purpose: Cohesion audit of foundation-layer docs and the new Impact Transparency system spec.
layer: how
status: review
---

# Foundation Cohesion Review

> Audits how foundation-level documents work together as a system, and whether the new Impact Transparency spec creates overlap or fills a gap.

---

## Per-Document Analysis

### 1. `product/foundation/principles.md`

**What question does it answer?** What is the project's reason for existing, and what is the one thing it will never do?

**Depends on:** Nothing. This is the root document — the constitutional bedrock.

**What depends on it:** Everything. Every foundation doc, every system spec, every pattern doc, and Impact Transparency all derive from or cite `principles.md`. The one-clause constitution ("Everything serves people"), Member Flourishing (time to live + money to live), and the single Never (no extraction) propagate through the entire doc tree.

**Overlap with Impact Transparency:** Minimal. `principles.md` states the abstract commitment; IT operationalizes it as a data pipeline. Different layers of the same idea, not competing expressions.

**Gap IT fills:** `principles.md` says "no extraction" but gives no mechanism for helping Members *see* extraction in the world around them. IT fills this — it makes the anti-extraction commitment visible and actionable at the Member surface.

---

### 2. `product/foundation/people-first.md`

**What question does it answer?** What does "business serves people" mean at the schema level, and what does the platform refuse to model?

**Depends on:** `principles.md` (expands one clause), `groups.md` (Group-as-people architecture), `member.md` (social capital design).

**What depends on it:** `primitives.md` (no Business entity rationale), `groups.md` (Group design), `community-health-rubric.md` (reviews treatment, not ranking).

**Overlap with Impact Transparency:** Moderate *tension*, low *duplication*. `people-first.md` frames the axis as **personal vs impersonal** (the baker vs the PE rollup). IT reframes as **helps the many vs helps the few** (behavioral evidence, not structural identity). These are different lenses on the same commitment. The "three-part question" in `people-first.md` — *Is this local? Does it support my community? Should I support it?* — maps to what IT scores, but from a narrower angle (locality-first vs behavior-first).

**Gap IT fills:** `people-first.md` has no answer for the non-local-but-helpful entity. The glass-bottle recycling nonprofit in Louisiana scores high on IT's axis despite failing `people-first.md`'s locality frame. IT widens the lens without contradicting the people-first commitment.

---

### 3. `product/foundation/impact-diagnostic.md`

**What question does it answer?** How do you recognize extraction across any industry, and what can the platform do about it?

**Depends on:** `principles.md` (the one absolute it operationalizes at the conceptual level).

**What depends on it:** `impact-transparency.md` explicitly names itself as "the operational expression of the anti-extraction diagnostic."

**Overlap with Impact Transparency:** **Highest overlap of any pair.** The five diagnostic markers map 1:1 to IT's signal sources:

| anti-extraction marker | IT signal source |
|---|---|
| Profit grows when cost grows | PE ownership + MLR-pattern signals |
| Repair/durability suppressed | Right-to-repair opposition signals |
| Switching costs artificial | Antitrust enforcement signals |
| Information asymmetry captured | Pricing-transparency signals |
| Regulatory capture | Lobbying-spend signals |

However, `impact-diagnostic.md` also contains material IT does *not* touch: the **treatment toolkit** (5 patterns: realign via ownership, restore info symmetry, reduce switching costs, build countervailing power, policy reform) and the **applied-across-industries** section (health insurance, auto, housing, food, broadband, banking, childcare, professional services). These are the platform's *response playbook*, not the scoring system.

**Gap IT fills:** `impact-diagnostic.md` is a conceptual diagnostic — "apply these five markers to any service." IT makes the markers queryable data: government enforcement records, lobbying spend, ownership structure, certification status. The diagnostic becomes a pipeline.

---

### 4. `product/foundation/community-health-rubric.md`

**What question does it answer?** How do you score whether the platform itself is building healthy community?

**Depends on:** `principles.md` (subordinate on conflicts), `policy.md` (anti-Nextdoor commitments), `member-journey.md` (the 13 loops it scores), `primitives.md` (the data spine).

**What depends on it:** Used as a periodic audit tool. Referenced by `CLAUDE.md` as the measuring stick.

**Overlap with Impact Transparency:** **Low.** The rubric scores the *platform's own community health* — an inward-facing measuring stick. IT scores *external organizations' societal impact* — an outward-facing information system. Different subjects, different purposes. The only proximity is rubric section 5d ("Impact measurement — Quantified community impact") which is adjacent but distinct — the rubric wants to measure the platform's aggregate impact; IT wants to score individual entities.

**Gap IT fills:** The rubric helps the PM evaluate the platform. IT helps Members evaluate the world. Complementary, not overlapping.

---

### 5. `product/foundation/policy.md`

**What question does it answer?** What test must every policy surface pass, and what is the platform's default posture?

**Depends on:** `principles.md` (the commitment it operationalizes as process).

**What depends on it:** Every system spec's "Policy posture" section. The anti-Nextdoor commitments (three structural design constraints).

**Overlap with Impact Transparency:** **None.** IT *consumes* the policy framework — its own "Policy posture" section walks the three filters (helpful? harmful? abusable?) and names its mitigations. IT doesn't redefine the framework; it uses it as designed.

**Gap IT fills:** None. `policy.md` is a process framework; IT is a system that follows it.

---

### 6. `product/foundation/primitives.md`

**What question does it answer?** What are the fundamental data entities (Person, Item, Location, Group) and how do the 13 loops collapse into build clusters?

**Depends on:** `principles.md` (people-first), `people-first.md` (no Business entity rationale).

**What depends on it:** All system specs (`member.md`, `item.md`, `location.md`, `groups.md`), all scenarios.

**Overlap with Impact Transparency:** **None.** IT introduces parallel entities (`entity_impact_profiles`, `entity_impact_signals`, etc.) that sit alongside but don't overlap the four primitives. IT's entities represent *external organizations* the platform indexes from public data; the primitives represent *platform participants*. The `entity_group_links` table is the bridge — it maps a platform Group to an indexed external entity.

**Gap IT fills:** `primitives.md` has no concept for representing the external world. IT adds the "public-record entity" as a fifth data shape — not a primitive (not something Members declare) but a scored external profile that enriches discovery.

---

### 7. `product/needs/member-journey.md`

**What question does it answer?** What are the 13 loops Members traverse, in what order, and why does the order matter?

**Depends on:** `principles.md` (implicitly — the Mondragon trajectory is the long-form expression of wealth circulation).

**What depends on it:** `primitives.md` (clusters), `community-health-rubric.md` (section 2 maps to loops), IT (names loops served: 8, 9, Family 4).

**Overlap with Impact Transparency:** **None.** IT names the loops it serves but doesn't redefine or extend them. The relationship is consumer (IT) to authority (member-journey).

**Gap IT fills:** `member-journey.md` describes *what Members do*. IT adds *information transparency* to help Members make better decisions within those loops — particularly Loop 9 (find a local pro) and Loop 8 (follow what you love).

---

### 8. `product/systems/impact-transparency.md`

**What question does it answer?** How does the platform help Members see the societal impact of organizations they patronize, and how does evidence accumulate into a score?

**Depends on:** `impact-diagnostic.md` (the diagnostic it operationalizes), `principles.md` (people-first, no extraction), `policy.md` (data-sourcing posture, three-filter framework), `business-jurisdiction.md` (locality signal input), `groups.md` (business Group profiles consume the score), `design-language.md` (DLS token replacement).

**What depends on it:** Discovery surfaces (search, explore, map), entity profile pages, alternatives section, the "research a company" surface.

**Overlap with other docs:** See per-doc analyses above. The highest overlap is with `impact-diagnostic.md`'s diagnostic half; the most productive tension is with `people-first.md`'s framing axis.

**Gaps it fills:** Makes extraction visible to Members. Broadens the frame from local-vs-corporate to helps-many-vs-helps-few. Introduces non-local-but-helpful surfacing. Adds a Member intelligence layer for collective knowledge.

---

### 9. `playbooks/DECISION-PATTERNS.md`

**What question does it answer?** How do you make calls when options are close, and what is the one categorical commitment?

**Depends on:** `principles.md` (the one absolute originates there; DECISION-PATTERNS names it as the only categorical commitment).

**What depends on it:** Every decision in PLATFORM-PATTERNS and DEVELOPMENT-PATTERNS, the `weigh` skill.

**Overlap with Impact Transparency:** **Conceptual alignment, no duplication.** IT's core axis — "helps the many vs helps the few" — is a direct expression of the wealth-circulation absolute. IT makes the internal decision principle visible to Members as an external scoring system. The two docs are about different audiences: DECISION-PATTERNS guides the PM and agents; IT guides Members.

**Gap IT fills:** DECISION-PATTERNS is inward-facing (how we decide). IT is outward-facing (how Members see). IT extends the wealth-circulation principle from an internal decision rule to a Member-visible information system.

---

### 10. `playbooks/PLATFORM-PATTERNS.md`

**What question does it answer?** What live decisions define what the platform IS or refuses to be?

**Depends on:** `DECISION-PATTERNS.md` (the decision-making framework).

**What depends on it:** Build decisions, scenario scoping, the `weigh` skill.

**Overlap with Impact Transparency:** **None currently.** IT will eventually need a PLATFORM-PATTERNS entry when it ships at b2. No current overlap — appropriate since IT is still draft.

**Gap IT fills:** None. PLATFORM-PATTERNS is a decision register; IT is a system spec.

---

## Relationship Map

```
                    principles.md
                   THE CONSTITUTION
            "Everything serves people.
             No extraction. Ever."
                        │
          ┌─────────────┼──────────────┐
          │             │              │
          ▼             ▼              ▼
    people-first    anti-extraction    DECISION-PATTERNS
    "No impersonal  "5 markers to     "Wealth circulation
     Business        recognize it,     over extraction —
     entity"         5 treatments"     the one absolute"
          │             │              │
          │             │              ▼
          │             │         PLATFORM-PATTERNS
          │             │         (live decisions register)
          │             │
          ▼             ▼
      primitives    ┌───────────────────┐
      Person/Item/  │ IMPACT            │
      Location/     │ TRANSPARENCY      │
      Group         │                   │
          │         │ Operationalizes   │
          │         │ anti-extraction   │
          │         │ diagnostic as     │
          │         │ data pipeline.    │
          │         │                   │
          │         │ Broadens          │
          │         │ people-first      │
          │         │ frame from        │
          │         │ local/personal    │
          │         │ → helps-many/     │
          │         │   helps-few       │
          │         └───────────────────┘
          │                 │
          │    ┌────────────┤
          │    │            │
          ▼    ▼            ▼
      member-journey    policy.md
      13 loops          Three filters +
      (north stars)     opt-out default +
          │             anti-Nextdoor
          │                 │
          ▼                 │
    community-health- ◄─────┘
    rubric.md
    (the platform's own
     measuring stick)
```

**Flow of the one absolute:**

```
principles.md           "No extraction"
       │
       ├──► DECISION-PATTERNS    as internal decision rule
       │         │                  (wealth circulation over extraction)
       │         └──► PLATFORM-PATTERNS    as live architectural decisions
       │
       ├──► anti-extraction      as conceptual diagnostic
       │         │                  (5 markers + 5 treatments)
       │         └──► IMPACT TRANSPARENCY   as Member-visible data pipeline
       │                                      (5 markers → queryable signals)
       │
       └──► people-first         as schema-level encoding
                                    (no Business entity = no extraction vector)
```

---

## Sprawl Risk Assessment

### 1. Are any two docs >70% overlapping?

**No pair exceeds 70%.** The closest pair is `impact-diagnostic.md` ↔ `impact-transparency.md`, but only the diagnostic half of anti-extraction maps to IT. Anti-extraction's treatment toolkit (cooperative formation, countervailing power, policy reform) and its applied-across-industries survey have no counterpart in IT. Estimated overlap: ~40%.

### 2. Is `impact-diagnostic.md` now redundant?

**No. It should stay as the conceptual foundation.** Three reasons:

- **The treatment toolkit is not covered by IT.** IT scores entities; anti-extraction prescribes what the platform can scaffold in response (cooperative formation, info symmetry restoration, switching cost reduction, countervailing power, policy advocacy). These are the platform's long-term intervention playbook — they belong in a foundation doc, not a scoring system spec.

- **The cross-industry application survey has standalone value.** "Health insurance hits all five markers; auto insurance hits three" is a strategic planning tool that IT doesn't replace. It tells the PM which industries have the highest leverage for future platform expansion.

- **Conceptual foundations age differently than system specs.** anti-extraction defines *what extraction is* in terms a non-builder can read. IT defines *how the platform detects and surfaces extraction* in terms a builder needs. Folding the conceptual frame into the system spec would bury the strategic thinking under data-model tables.

**Recommendation:** Add a one-line pointer at the bottom of `impact-diagnostic.md` — *"The diagnostic is operationalized as a data pipeline in [`impact-transparency.md`](../systems/impact-transparency.md)."* — and a reciprocal pointer in IT (already present). The two docs form a conceptual-foundation → operational-system pair, like `principles.md` → `policy.md`.

### 3. Is `people-first.md` still pulling its weight?

**Yes, but it has a framing tension with IT that needs acknowledgment.** `people-first.md` frames the distinction as *personal vs impersonal* — the baker vs the PE rollup, the named human vs the corporate shell. IT reframes as *helps the many vs helps the few* — behavioral evidence, not structural identity.

These are not contradictory. They're concentric:

- **people-first** answers: *What does the schema refuse to model, and why?* (No Business entity → no place for impersonal commerce to land.)
- **IT** answers: *How does the platform help Members evaluate what they encounter in the world?* (Behavioral evidence → the score.)

`people-first.md`'s real load-bearing work is **schema-level**: the absence of the Business entity, the three-part question, the corollaries (no ranking, no pay-for-visibility, no engagement feed). IT doesn't touch any of this. IT operates on external entities that the platform indexes from public data; `people-first.md` governs the internal data model.

The tension is productive, not sprawl-inducing: `people-first.md` says "locally owned is the structural shape we trust"; IT says "locally owned is one positive signal among several." Both are true. The resolution is that `people-first.md` governs what the platform *models*; IT governs what the platform *surfaces about the external world*.

**Recommendation:** Add a short section to `people-first.md` — one paragraph — acknowledging that IT broadens the evaluative frame from locality to behavioral evidence, and that the two coexist: schema-level refusal of impersonal commerce (people-first) + evidence-level scoring of societal impact (IT). This prevents future readers from reading the two docs as contradictory.

### 4. Should Impact Transparency get a foundation-level entry?

**No standalone foundation doc. Yes, a short anchor in `principles.md`.**

IT's axis — "helps the many vs helps the few" — feels like a foundation-level principle. But the *actual* foundation principle it expresses is already stated in two places:

- `principles.md`: "The one thing we will not do is support extraction."
- `DECISION-PATTERNS.md`: "Wealth circulation over wealth extraction — the one absolute."

IT is the *operational system* that makes this principle *visible to Members*. That's a system, not a foundation. Creating a separate foundation doc would be sprawl — it would mean the no-extraction commitment lives in four places (principles, anti-extraction, decision-patterns, and a new foundation-IT doc).

**Recommendation:** Add 2–3 sentences to `principles.md` after the extraction paragraph:

> *The platform makes this commitment visible to Members through Impact Transparency — a data-driven system that scores how organizations' behavior affects society, sourced from public records and verified member intelligence. The scoring system operationalizes the anti-extraction diagnostic ([`impact-diagnostic.md`](impact-diagnostic.md)) and is specified in [`impact-transparency.md`](../systems/impact-transparency.md).*

This gives IT a foundation-level anchor without creating a new doc. The principle lives in `principles.md`; the diagnostic lives in `impact-diagnostic.md`; the system lives in `impact-transparency.md`. Three layers, three homes, one idea.

---

## Recommendation — Tightest Arrangement

**Keep all existing foundation docs. No merges. Three small edits.**

The foundation layer is tighter than it looks. Each doc answers a distinct question:

| Doc | Question | Layer |
|---|---|---|
| `principles.md` | What is the project for, and what will it never do? | Constitutional |
| `people-first.md` | What does "business serves people" mean in the schema? | Schema-level encoding |
| `impact-diagnostic.md` | How do you recognize extraction, and what can the platform do about it? | Conceptual diagnostic + treatment playbook |
| `community-health-rubric.md` | How do you score whether the platform itself builds healthy community? | Inward-facing measuring stick |
| `policy.md` | What test must every policy pass? | Process framework |
| `primitives.md` | What are the fundamental data entities? | Data spine |
| `member-journey.md` | What loops do Members traverse? | North star |

IT sits cleanly as a **system spec** that operationalizes the foundation layer — specifically `impact-diagnostic.md`'s diagnostic and `principles.md`'s one absolute. It does not belong *in* the foundation layer. It belongs where it is, with pointers connecting it to its foundation-level parents.

### The three edits

1. **`principles.md`** — Add a 2–3 sentence anchor after the extraction paragraph, pointing to IT as the Member-facing expression of the anti-extraction commitment. (Gives IT a foundation-level hook without a new doc.)

2. **`impact-diagnostic.md`** — Add a one-line closing pointer: *"The diagnostic is operationalized as a data pipeline in [`impact-transparency.md`](../systems/impact-transparency.md)."* (Connects the conceptual-to-operational pair.)

3. **`people-first.md`** — Add a short paragraph (3–4 sentences) acknowledging that IT broadens the evaluative axis from personal/impersonal to helps-many/helps-few, and that the two coexist: schema-level refusal of impersonal commerce (people-first) + evidence-level scoring of societal impact (IT). (Resolves the framing tension before someone reads the two docs as contradictory.)

### Where "benefits the few → benefits the many" lives as a permanent reference

The phrase is an axis label, not a new principle. The principle it expresses is already permanently housed:

- As a constitutional commitment: `principles.md` — "no extraction"
- As a decision rule: `DECISION-PATTERNS.md` — "wealth circulation over extraction"
- As a conceptual diagnostic: `impact-diagnostic.md` — "five markers"
- As an operational system: `impact-transparency.md` — "1–5 scale"

No new doc needed. The anchor in `principles.md` (edit #1 above) is where future readers will find it at the foundation level.

---

*Review complete. No commits made.*

```
# Run from Mac terminal:
clearlock && cd /Users/don/Projects/community && \
  git add _inbox/foundation-cohesion-review.md && git commit -m "docs(pipeline): foundation cohesion review — IT sprawl audit"
```
