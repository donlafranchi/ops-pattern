---
purpose: The 2026-09-07 legibility pass over product/ and planning/ — what serves the launch, what was archived, and what needs a PM ruling. Grouped by theme so a whole cluster can be killed or kept in one pass.
layer: how
status: active
---

# CLEANUP — product/ and planning/, 2026-09-07

> **Nothing was deleted.** 26 files moved to `planning/archive/` and `product/archive/`, preserving subfolder structure. Every inbound link from a live doc was rewritten to the new path — **zero broken links attributable to this pass** (see § Link repair).
>
> **Nothing in UNSURE was touched.** Those files are where they were, awaiting a ruling.

| Bucket | Count |
|---|---|
| **ON-PATH** | **55** |
| **ARCHIVED** | **26** |
| **UNSURE** | **84** |

---

## ON-PATH — 55

Serves the launch: an organizer signs up, gets a Page with links / bio / what they sell / where to find them, and people find them by browse and map. Listed by theme, not exhaustively annotated — these need no decision.

**The constitution (10)** — `product/foundation/`. Never archivable by rule. `principles` · `people-first` · `primitives` · `policy` · `metrics` · `monetization` · `platform-promise` · `community-health-rubric` · `impact-diagnostic` · **`role-language`** (new today).

**What people need (3)** — `needs/member-journey` (the 13 loops), `needs/use-cases` (the working test-case set), `needs/producer-roadmap` (cited by every producer scenario).

**The systems the launch touches (11)** — `member` · `item` · `groups` · `location` · `places` · `action-layer` · `discovery` · `business-jurisdiction` · `producer-tools` · `payments` · `agent-assistance`. All cited from the root router's authoritative-docs table.

**Design in force (3)** — `ui/design-language` (tokens and recipes), `ui/community-platform` (Home / Explore / You), `ui/design-north-stars` (the "neighbours, not creators" line the role-language doc now rests on).

**Navigation (4)** — `product/MAP` · `product/TRACE` · `templates/idea-intake` · `planning/RELEASES`.

**The plan of record (4)** — `now/initiative-launch` (the launch plan) · `now/bundle-1` (positioning rationale + deferral list survive; scope superseded) · `now/bundle-1-checklist` (the record of the shipped floor) · `planning/DECISIONS` (launch-tier calls).

**Approved and in build (6)** — everything in `planning/next/`: the You producer state and its review, the merged-browse scenario and its review, and the three Explore/nav scenarios. **Protected by rule even where cut** — see the note under § Archived.

**Producer-journey working set (11)** — `backlog/`: the photo-upload decision · the two vendor audits (prior-art, retirement inventory) · the producer-signup comparables · the ratified surfaces decision · the combined F055–F058 review · the storyboards initiative · scenarios F055, F056, F058, **F060** (the new entry-point scenario).

**The ledger (3 files + 31 rows)** — `planning/STAGE-LEDGER` and `planning/stage-ledger/`. Mechanical; leave alone.

---

## ARCHIVED — 26

Moved, not deleted. Structure preserved: `planning/archive/{now,backlog}/`, `product/archive/{ui,exploration,systems}/`.

### Superseded planning spine — 4

- **`planning/archive/SPEC-PATCHES.md`** — the running spec-patch tally. **Self-declares "RETIRED"** in its own frontmatter; replaced by Type A/B deviation routing in the build workflow.
- **`archive/now/mvp-goal.md`** — the b1 north-star definition. **Superseded twice**: by bundle-1 on 2026-09-04, then by the launch plan on 2026-09-07. Its own banner already conceded the first.
- **`archive/now/bundle-1-themes.md`** — the b1/b2/b3 sub-theme sequencer. Superseded by the launch plan's four fortnights.
- **`archive/now/plan-b1-surface-sequence.md`** — the F-numbered build order. Superseded by the same.

### Retired mechanics — 5

- **`archive/backlog/decision-producer-values-declaration.md`** — the values-declaration mechanic. **Cut from launch and confirmed** (`DECISIONS.md`, 2026-09-07). The never-sourced constraint survives the cut and now lives in `DECISIONS.md` and the launch plan, so this is no longer the only record of it.
- **`archive/backlog/decision-preview-deployments.md`** — per-branch preview deploys. Decided: deferred, screenshots stand in.
- **`archive/backlog/decision-polygon-full-res-replay.md`** — when the metro polygon gets a full-resolution replay. The metro vantage point is cut from launch, so the question has no owner.
- **`product/archive/exploration/market-unlock-waitlist.md`** — community-earned market opening as a cold-start strategy. Built on the markets mechanic, which is retired.
- **`product/archive/exploration/accountability.md`** — the four-pillar community-signal report shape. **Explicitly refused** by the vendor prior-art audit as "a judgment the platform made about a person."

### Hoods and the location hierarchy — 5

Deferred out of v1 by name in the bundle; the launch plan cuts the metro vantage point on top.

- **`archive/backlog/plan-location-model-sequence.md`** — the sequencing plan for the whole cluster.
- **`archive/backlog/scenario-F050-*`** — a member keeps a set of hoods on their profile.
- **`archive/backlog/scenario-F051-*`** — the composer asks for an Item's location.
- **`archive/backlog/scenario-F052-BLOCKED-*`** — feed ranks hood then metro. A blocked stub that cannot be written.
- **`archive/backlog/scenario-F053-BLOCKED-*`** — the place switcher becomes a metro switcher. Same.

### Superseded scenarios and surface definitions — 3

- **`archive/backlog/scenario-F031-*`** — adjusting "near me" reach. **Marked "out of v1" on the scoreboard**; with distance removed there is no width to adjust.
- **`archive/backlog/scenario-F047-*`** — You as a personalized return-visit surface. Superseded by the You producer-state scenario now in `next/`.
- **`archive/backlog/audit-surfaces.md`** — a draft defining what each of three tabs does. Superseded by the ratified surfaces decision.

### Impact transparency — 3

The two-layer societal impact score, built to replace the ownership tier — and the ownership tier itself was refused as a platform-assigned judgment. The successor inherits the defect.

- **`product/archive/systems/impact-transparency.md`** (draft spec) · **`archive/backlog/initiative-impact-transparency-next.md`** (spec integration) · **`archive/backlog/initiative-impact-transparency-later.md`** (b2 build).

### Design process artifacts — 4

Deliverables from finished phases, not standards in force.

- **`product/archive/ui/phase-0-ia-wireframes.md`** · **`phase-1-design-foundations.md`** — pre-rebuild phase deliverables.
- **`design-evolution-report.md`** — a summary of a completed palette exploration.
- **`card-feed-design-proposals.md`** — card proposals, self-labelled "not yet ratified," superseded by the ratified always-present media block.

### Absorbed audits — 2

- **`product/archive/exploration/showcase-completeness-audit.md`** — a dated table-by-table audit against the seed, absorbed 2026-09-03.
- **`product/archive/exploration/good-place-homepage-plan.md`** — a technical plan for defaulting home to a showcase place. Superseded by the shipped locality feed.

> **One cluster I could not archive, and you should know why.** The Explore-into-Home merge — the browse scenario and its review — is **on the launch cut list**, but it lives in `planning/next/`, and your rule says never archive anything in `next/`. It stays. If you want it out of the way, the move is to send it back to `backlog/` first; say the word and I'll do it as a separate step.

---

## UNSURE — 84

Grouped so a whole cluster dies or lives in one pass. **Each cluster has one question.**

### 1. The spec-patch backlog — 21 files

`planning/spec-patches/` — twenty individual records of code-vs-spec divergence from June, plus a README describing the drain process.

**What they are:** each is one real gap — a handler referenced but not in the registry, an enum that drifted from the shipped CHECK, `places.msa_code` in code but not in any spec, permissive RLS left open deliberately.
**Why unsure:** the *mechanism* is retired (the tally doc is now archived), but these are **the only record of twenty real divergences**, and at least two are directly on-path — the missing `member.update` handler is exactly what the profile editor needs, and the group-follow substrate gap sits under the follow surface.
**Question:** *Drain these into `backlog/` as decision stubs, archive the ones already fixed in code, or archive the lot and accept re-discovering them?* **My recommendation: keep two, archive eighteen** — I can tell you which two in ten minutes if you want the shortlist.

### 2. The Phase 3 surface set — 10 files

`now/initiative-phase-3.md` plus nine stubs in `backlog/`: the no-login browse index, the Group browse index, the Group create flow, the onboarding Group suggestion, the saved-search composer, stewardships, the thesis page, the Wonder composer, Wonder conversion.

**Why unsure:** none is launch work, none is superseded. They are the post-launch plan, and archiving the plan for what comes next is a different decision from archiving what's dead.
**Question:** *Is Phase 3 still the shape of post-launch, or does the launch reposition rewrite it?* If it rewrites it, all ten go together.

### 3. The location model remainder — 3 files

`scenario-F048` (remove distance, hand off the address) · `scenario-F049` (signup asks for a hood and a metro) · `review-F048-F053` (the cluster review).

**Why unsure:** the other four scenarios in this cluster are archived, but these two are different. **Distance removal is a ratified decision** and the scenario is its fullest record. **The signup scenario touches launch requirement 1** — it is the only doc describing what signup asks for beyond a name.
**Question:** *Does launch signup ask for a locality at all, or does it stay one question and default server-side as it does today?* That answers both files and the review with them.

### 4. Design references — 3 files

`ui/mobile-feed-design` (Airbnb-derived mobile patterns) · `ui/design-steal-sheet` (what to steal from each product and why) · `ui/design-research-thesis` (structural foundation, palette, navigation, spacing).

**Why unsure:** the thesis is cited by shipped tickets and it is one half of a conflict already recorded — the shipped sticky search row cites the thesis, the design language forbids it, and a review called the design language the winner. Archiving the thesis buries one side of a live argument.
**Question:** *Is the design language the single source of truth now, with these three as reference — or is the thesis still normative where the two disagree?*

### 5. Open decision stubs, launch-adjacent — 2 files

- **`decision-profile-event-sourcing`** — should profile edits go through a `member.profile.update` handler? **Directly on-path**: the profile editor in fortnight 3 needs an update handler and none exists.
- **`decision-accent-token-contrast`** — the accent colour is below WCAG AA as text on white. **Accessibility is a mandatory gate on every new surface**, so this blocks work rather than waiting on it.

**Question:** *Promote both into the launch plan as fortnight-1 decisions?* My recommendation: yes, both.

### 6. Open decision stubs, not launch — 7 files

`charcoal-ramp-migration` (when the new neutral ramp replaces live tokens) · `group-follow-substrate` (dedicated table or polymorphic reshape) · `member-public-page-views` (ratify the public member read surface) · `platform-extensibility-posture` (API-first, and when) · `rls-enumeration-closure` (closing member enumeration) · `item-card-media` (ratified — the always-present media block) · `business-identity-impersonation` (what local name scoping doesn't fix).

**Why unsure:** two are security-shaped and one is already ratified, which means it probably belongs in a pattern doc rather than a backlog stub.
**Question:** *Archive the five open ones as post-launch, promote the security one, and move the ratified one into the pattern docs?*

### 7. Process and meta — 6 files

`AGENT-BOUNDS` (when an agent escalates vs decides) · `decision-doc-register` (the register normative docs write in) · `decision-durability-register` (how a reader tells a binding commitment from this version's answer) · `audit-pipeline-automation-gaps` · `audit-gate-c-unrunnable` (the gate that got ticked by eye twice) · `retro-2026-09-03-pipeline`.

**Why unsure:** none of it serves the launch, all of it governs how the pipeline behaves, and the gate-c audit carries **five open PM calls** that are the reason a scenario got ticketed against an unapproved spec twice this month.
**Question:** *Is process improvement paused until 30 October, or does the gate-c audit get its five calls answered first?*

### 8. Exploration — 22 files

`product/exploration/` after four removals: the cooperative-engine set (6), local-stays, mehko-home-kitchen, missing-pets, rising-tide-civic-pride, vetting-and-vouching, affinity-derived-groups, social-attention-to-local-action, market-intelligence, bulletin-intelligence, locally-made, apple-platform-integration, brand-strategy-and-naming, project-arc-overview, mighty-oak-symbol, recruitment-plan, reciprocity-and-goodwill, about-page-draft.

**Why unsure, and my honest read: `exploration/` is already the archive for ideas.** It is named for it, nothing on-path cites it, and moving 22 speculative docs into `product/archive/exploration/` gains legibility nowhere while destroying the signal that these are live ideas rather than dead ones. **I did not move them, and I recommend not moving them.**
**Question:** *Accept that `exploration/` is the idea shelf and leave it — or do you want it thinned?* If thinned, the two I would put first are the cooperative-engine set (six files describing a mechanic deferred indefinitely) and `about-page-draft`, which is the only draft of the /about copy and probably belongs with the thesis-page stub instead.

### 9. Capabilities — 7 files

`product/capabilities/`: event-host, group-create-join, item-respond, item-view, landing-page, member-profile, qr-onboarding.

**Why unsure:** each is a thin one-line capability spec, and each is now **substantially duplicated by a system spec** — member-profile by `systems/member`, item-view and item-respond by `systems/item`, group-create-join by `systems/groups`. The anti-sprawl rule says fold at 70% overlap. But `TRACE.md` traces lineage through them, and qr-onboarding is the live record of an open capability.
**Question:** *Fold the six duplicated ones into their system specs and keep only qr-onboarding — or keep the layer because TRACE depends on it?*

### 10. Loose ends — 3 files

- **`scenario-F043`** — the newcomer end-to-end integration test. Its exit criterion was rewritten to gate on the v1 workstream list, so the scenario is stale in form but the *idea* — one test that proves the journey doesn't get stuck — is exactly what launch needs.
- **`systems/stewardships.md`** — draft; the care-floor surface. Post-launch, not superseded.
- **`templates/idea-intake.md`** — the paste-in template producing pipeline artifacts. Active, unused lately.

**Question:** *Rewrite the integration test against the three launch requirements, or archive it and hand-test?*

---

## Link repair

The 26 moves broke 41 inbound links across live docs. **All 41 were rewritten to their new archive paths**, and the outbound links from the archived files themselves were repaired to their new depth, so the archive reads correctly from inside.

**Zero broken links are attributable to this pass** — verified by resolving every relative `.md` link in the repo against the filesystem.

**Pre-existing breakage found and not fixed — 144 links.** Out of scope for this pass, but worth knowing: `REGISTRY.md` has 11 links pointing at scenarios that were archived to `planning/done/` months ago, the `cooperative-engine` exploration set has 27 links using the wrong relative depth (a copy-paste error, never worked), and the remainder are in completed tickets and the deviations log. **`REGISTRY.md` is the doc catalog and it is the one that matters** — it is currently a catalog that cannot open a fifth of what it lists.

---

## Addendum — 2026-09-07, later the same day

Two further moves, folded in here rather than given their own file.

- **`JOURNAL.md` → `planning/archive/JOURNAL.md`.** Replaced at root by [`STATUS.md`](../STATUS.md), which is overwritten rather than appended and capped at one screen. The journal stays readable as history and carries a banner saying what replaced it. Rationale and the refusal that protects it: `playbooks/DEVELOPMENT-PATTERNS.md` § State lives in one overwritten file.
- **The foundation set was pared from 179 statements to 13** in [`../product/foundation/settled.md`](../product/foundation/settled.md), with four contradictions and five never-ratified claims listed below the line rather than resolved.

**Convention changes that followed, and the ones still owed.** The root `CLAUDE.md` read order and its allowed-root-files rule are updated, and `AGENTS.md`'s session-start reads now point at `STATUS.md` and `settled.md`. **Still owed: ten skill workflows instruct agents to "add a JOURNAL entry."** Those are semantic rewrites, not path substitutions — an append-a-narrative-entry instruction becomes either *update `STATUS.md` in place* or *append to `DECISIONS.md`*, and which one differs per skill. Left undone deliberately rather than sed-replaced into something that reads right and behaves wrong.
