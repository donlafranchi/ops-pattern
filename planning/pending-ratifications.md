# Pending Ratifications

> **Source:** `agent-commerce-and-project-amendments.md` §0, §7, §10 — the "almost no Never" posture. The single "Never" of the project is extraction-over-circulation. All other absolute language is flagged here for user ratification.
>
> **Posture:** When the build agent encounters any of these while making other changes, flag — do not silently change. The user reviews and decides in a future deep dive.
>
> **Status legend:** `PENDING` = awaiting user decision · `KEEP` = ratified as absolute · `SOFTEN` = user has directed softening · `RESCIND` = user has rescinded.

---

## §7a — Numeric defaults, caps, thresholds

| Item | Source | Current value | Status | Decision |
|---|---|---|---|---|
| Default Delegation expiry | `product/systems/delegation.md` | 90 days | PENDING |  |
| k-anonymity floor for aggregate analysis | `product/systems/assistant-context.md`, ADR-9 | N >= 10 | PENDING |  |
| Platform-mediated Skill payment cap | `product/systems/skills.md`, ADR-9 | 5–10% range | PENDING |  |
| `recurring_payment` Delegation default expiry | `product/systems/delegation.md` | 1-year default, max 2 years | PENDING |  |
| Soft-delete revival window | `product/systems/member.md` | 30 days | PENDING |  |
| Rejected Assistant Context inference cooldown | `product/systems/assistant-context.md` | 90 days | PENDING |  |
| Handle redirect after handle change | `product/systems/member.md` | 90 days | PENDING |  |
| Active-member natural group size threshold | `product/foundation/design-philosophy.md` | ~50 | PENDING |  |

## §7b — Working answers to open questions

| Question | Source | Working answer | Status | Decision |
|---|---|---|---|---|
| Cooperative-Member Delegations | `product/systems/delegation.md` | Each Member grants individually; union of grants | PENDING |  |
| Anonymous Loop 3 traffic | `product/systems/delegation.md` | Assistants allowed with read-only public-data scopes, no Delegation needed | PENDING |  |
| Account merge | `product/systems/member.md` | Same email = same Member | PENDING |  |
| Cooperative Skill ownership | `product/systems/skills.md` | The Community is the author | PENDING |  |
| Markets data model | `product/systems/location.md`, ADR-5 | Location of `kind=recurring_temporary`, not Item `kind=gathering` | PENDING |  |
| Real-name escalation | `product/systems/member.md` | Deferred to b2 moderation surface | PENDING |  |
| Avatar moderation | `product/systems/member.md` | Deferred to community report | PENDING |  |
| Address normalization | `product/systems/location.md` | Deferred | PENDING |  |
| City picker source | `product/systems/location.md` | Platform-curated at launch | PENDING |  |

## §7c — Structural enumerations

| Enumeration | Source | Current values | Status | Decision |
|---|---|---|---|---|
| Group kinds at b1 | `product/systems/groups.md`, ADR-13 | place, interest, practice, event_anchored, family, business | PENDING — is `family` right? what about `congregation`? |  |
| Person<->Location affinity kinds | `product/systems/member.md`, `location.md` | lives, works, plays, visits, follows, liked | PENDING — same question |  |
| Location kinds | `product/systems/location.md`, ADR-14 pending | permanent, recurring_temporary, area | PENDING |  |
| Standing-tier gate | `product/systems/groups.md` | >=1 active membership in kind='business' Group OR steward-role membership in any non-business Group | PENDING |  |
| ADR-16 per-row privacy | `product/systems/member.md` | RLS owner-only on `member_location_affinities` | PENDING — privacy intent confirmed (§4a), implementation worth deep-dive |  |

## §9 — Equal community priority review (2026-05-12 pass)

Per `agent-commerce-and-project-amendments.md` §9 (every community matters equally). The build agent did a tonal pass across `product/systems/discovery.md` and the locality-related surfaces — no inadvertent prioritization signals found. Flagged below for the user's review:

| File | Line | Reference | Note | Status |
|---|---|---|---|---|
| `product/systems/groups.md` | 326 | "likely 25–50 miles for the Sacramento area" (locality proximity threshold) | Launch-region calibration, not preferential routing. Confirm OK. | PENDING |
| `product/systems/member.md` | 54 | "Sacramento metro + surrounding cities at launch" (city picker source) | Launch seed data, not preferential surfacing. Confirm OK. | PENDING |
| `product/systems/location.md` | 176, 223 | Sacramento metro polygon seed data | Launch seed data, not preferential surfacing. Confirm OK. | PENDING |
| `product/foundation/canonical-examples.md` | (multiple) | Sacramento as canonical first-Community example | Per §9: Sacramento is the canonical example because of the user's direct relationships, not an architectural preference. OK as-is unless user wants explicit disclaimer added. | PENDING |
| `product/systems/discovery.md` | — | grep for "popularity", "activity volume", "larger", "denser" returned no matches | No inadvertent volume-based ranking found at the spec level. | CLEAR |

## §6b — Maker rename vocabulary (PARTIALLY RATIFIED 2026-05-12)

User ratified: **Seller** for the generic commercial role; **Producer** preferred in agricultural/food context (already used in `producer-bulletin.md` / `producer-growth.md`). Build agent applies this rename across specs.

## §8b — bounded_purchase scope shape (RATIFIED 2026-05-12)

User ratified the scope shape as written in `agent-commerce-and-project-amendments.md` §8b. Build agent integrates Group C.

---

## Project-wide flagged absolute-language occurrences

Each entry below is a candidate "Never / Permanent / Categorical / Indefinite / Forever / Always / Perpetual" occurrence. The user reviews each and decides KEEP / SOFTEN / RESCIND. Trivial uses (list-of-examples, mundane "never been clearer," DB column generated-always-as, RFC verbiage, etc.) are grouped or omitted rather than enumerated.

### product/foundation/

**`principles.md`** — the constitution itself; these are the meta-statements about absolute language and so are KEEP-by-construction. Listed for completeness:
- L19–23: The single "Never" subsection — defines the only absolute commitment. KEEP.
- L31: "These two commitments sit directly under the single 'Never'..." KEEP.
- L76: "## Part 3: Categorical Failures" — section heading frames the next list as binary fails. PENDING.
- L85: "Founder-as-CEO patterns inside chapters. **Permanent** admin / owner roles that calcify community governance."
- L171: "### Anti-Metrics — explicitly never optimized for"
- L191: "**Member interests and experience flags are never publicly visible.** Per the Member system, they're used only by platform alerting and facilitator suggestions."
- L217: "Profile-view counts are aggregate-only — never identity-revealing — to discourage stalker-style surveillance."
- L238: "**Ads of any kind.** Categorical fail per Part 3."
- L239: "**Data sales or licensing.** Categorical fail."
- L300: "...weakening a categorical failure..." — process language, not commitment. Trivial.

**`principles.md`** — also a meta-doc.
- L5–17: The single "Never" subsection — meta-statement. KEEP.
- L54: "Accountability comes from structured reports against pillars... that surface only as patterns, never as individual public text — never as stars."
- L61: "A Community is people deciding they are a group — never a polygon, never a postal code, never an algorithm grouping accounts that look similar to each other. Communities cannot be auto-assigned by geography. They cannot be owned by a corporate entity."
- L63: "Membership is a relationship Members enter into; it is never a status the platform imposes for living somewhere or following someone."
- L65: "People-first means the platform earns Community membership by being worth choosing — never by inferring you must already belong."

**`policy.md`**
- L9: "well-meaning over-strictness on one side ('never share anything, ever, with anyone')" — characterizing a posture to reject. Trivial.
- L39: "...the platform never assumes durability."
- L45: "...no Business entity, no role-as-identity, no engagement-optimized feed, no pay-for-visibility, no auto-assigned Communities. Those are categorical refusals at the data-model and incentive level, and they remain in force."
- L52: "The framework refuses it categorically: defaults are the protective posture, period."
- L74: "The platform never silently expands what it does with existing opt-ins."
- L88: "Three forward-looking commitments encode the platform's structural response to Nextdoor's complaint-attractor failure mode. The commitments are categorical refusals at the policy and product-design level..."
- L90: "### 1. Messaging is item-or-group only — never Location-scoped"
- L92: "**No surface in the platform is ever Location-scoped.** No Location wall, no Location feed, no Location DM... but never used to construct a send-to list." — Per §4a, scheduled to soften under Group B5.
- L96: "...by `member_location_affinities` being owner-only — no peer Member, anon visitor, or query path can `SELECT` another Member's affinity rows under any condition... never per-Member identity..."
- L104: "The platform takes action only when content crosses categorical lines (illegal, threatening, child-safety)..."

**`primitives.md`**
- L33: long line; "...A Person is a real human..." — context: discusses the Person primitive. Includes "...never auto-assigned..." re Groups (mirrored at L122).
- L54: "Members join and leave on their own. The platform never auto-assigns based on polygon — that is the explicit refusal of Nextdoor's pattern."
- L58: "...deferred indefinitely per ADR-11 (superseded — see DECISIONS.md)."
- L86: long line about Item primitive — trivial.
- L88: "Soft affiliations are inferred (following, attendance) and surface-only; they are never written as full membership without consent."
- L161: "the platform builds Maker, Run Club, Wonder, and Plumber as four separate systems and discovers too late that they were always one." — trivial discovery language.
- L163: "The fourth primitive, Group, exists for the moments when people decide they are an intentional unit; it is emergent, optional, and never imposed."

**`canonical-examples.md`**
- L25, L70, L77, L90, L142: enum value `permanent` in primitive-shape annotations. Trivial.
- L107: long line about a canonical example.
- L113: "...the platform never auto-assigns based on polygon or demographic." — commitment-bearing.

**`agent-assistance.md`**
- L41: "Money flows are the strictest tier. One-time payments and pledges are categorically not delegable." — RESCIND per §8a (Group C10 work).
- L45: long line; covers the five umbrella commitments.
- L47: "### 4. Member-owned, never platform-owned" — section heading.
- L49: "The Assistant Context is the Member's property... never trained on, never input to recommendation surfaces, never visible to other Members or their assistants..."
- L51: "Skill subscriptions are equally Member-owned. The platform-curated catalog is free forever..."
- L85: ADR-6 entry summarizing "Member-owned, never platform-owned" — meta-reference.

**`platform-promise.md`**
- L23, L29: "...have always depended on..." / "...have always pooled labor..." — historical-context language. Trivial.
- L39: "Your relationships with your customers belong to you. Followers, contact lists, engagement data — yours. Exportable, portable, never sold, never gated behind a paywall designed to lock you in."
- L41: "**You will never pay for visibility.** No sponsored placement, no pay-to-rank, no auction for the top of the feed."

**`design-philosophy.md`**
- L155: "Reputation can recover — past mistakes don't **permanently** brand someone" — design-criterion in a checklist, anti-permanence framing.
- L168: "...the same way healthy neighborhoods, cooperatives, and professional communities have always worked." — historical claim. Trivial.
- L299: "**Community land trusts** — Collectively owned land held for permanent community benefit..." — example. Trivial.
- L351: "the platform should never create lock-in that prevents communities from being self-sufficient."
- L459: long line.

**`loops.md`**
- L65, L101: long lines (Loop description prose).

**`canonical-examples.md`** (already covered above).

**`agent-assistance.md`** (already covered above).

### product/systems/

**`member.md`** — heaviest concentration; the spec is in active edit.
- L23: long line.
- L55: "Privacy: never shared with other Members, never visible on the Member's public profile."
- L94: "...Members never reach business-Group creation by accident."
- L137: "Hard delete never ships at any tier (per b1-primitives.md)."
- L231: long line; covers ADR-9 follow-visibility scope shift; uses "never" in commitment-bearing way re cross-community discovery.
- L295: "They are never used as a *send-to* target." (re Location affinities — anti-Nextdoor)
- L303: "**Per-Member identity never surfaces in a recommendation.**"
- L318: "**Open product question — re-claimable handles?** ...permanently retires any handle a Member has used..."
- L320: "**(a) Permanently retired.** Keeps the composite PK. Encodes 'your old handle is yours forever, even after you change away from it'..."
- L352: SQL comment — "hard delete of a Member is never permitted"
- L393: "...`delegation.grant` (never delegable)..."
- L404: "The audit field is **populated by the action handler, never by the caller** (per ADR-7)."
- L489: "row-owner always; ..." — RLS shorthand. Trivial.
- L495: "**Never visible to other Members or their assistants. Never input to recommendation surfaces. Never trained on.** Per ADR-6 and ADR-9." — Per §3, the broader "permanently deferred" framing on reviews is being rescinded; these three "never"s on the Assistant Context substrate may still hold but should be reviewed.
- L507: "...The platform never auto-reverts, never nags to make public."
- L526: "...the home Location itself is never shown publicly even at the highest precision setting."
- L532: "...The platform never auto-flips Maker mode on for any Member based on behavior..." — §6c rescinds Maker mode entirely; this whole paragraph dies in Group B7.
- L539: "**Assistant Context (per ADR-6 and ADR-9) — never visible to other Members, never trained on, never feed input. Permanent commitments.**"
- L540: "Categorical refusal of feed input *for other Members* is permanent."
- L542: "**Delegation scopes — confirmation-required for publish-tier; categorically not delegable for one-time payments and pledges. Per ADR-6 and ADR-9.**" — RESCIND per §8a (Group C11).
- L586: "Reviews, ratings on Members. Permanently deferred (per `principles.md`)." — RESCIND per §3 (Group B4).
- L623–625: "...never paint into a corner." / "ship empty, fill later, never paint into a corner." — design-heuristic language.

**`groups.md`**
- L5: long line.
- L13: "**Deferred indefinitely:** Cooperative-style coordination..." — §2 corrected framing; SOFTEN authorized.
- L27: "Items always belong to Members. Money flows Member-to-Member directly. A Group cannot sign, own, be delegated to, or outlive its last Member." — §5 softens the money-flow part; "always belong to Members" stays.
- L37: "**The platform never moves money, never files paperwork, never commits a vote.**"
- L77: long line.
- L98: "The Group is the *commitment* surface; the Item is always available without it." — design-statement. Trivial.
- L144: "They were always layered..." — historical claim. Trivial.
- L230: "...operating-ownership is the founder's permanently."
- L279: "`items.member_id` is NOT NULL. Items always belong to Members."
- L289: "**Default:** Members are not auto-assigned to Groups. The platform never enrolls based on geography, follow graph, or attendance. Joining is always explicit..."
- L298: "Cooperative-style coordination (co-owning, voting, distributing) — deferred indefinitely; not in scope." — §2; SOFTEN authorized.
- L310: "Items always belong to their Member, never to the Group."
- L330: "...The founder's role as operating owner is permanent under the new model..."
- L342: "Items always FK to Members. Money flows Member-to-Member directly. Groups can't sign or own. They dissolve when their people leave."
- L344: long line.
- L359: "| ADR-11 | **SUPERSEDED** 2026-05-10 | Cooperative-style coordination (co-owning, voting, distributing) **deferred indefinitely**..." — §2 ADR re-write authorized.

**`delegation.md`**
- L15: "The platform itself never holds an open delegation against a Member; that asymmetry is the load-bearing trust commitment."
- L37: "...always empty at b1; non-empty at b2..." — trivial.
- L46: "...the Member always presses publish." — KEEP per architecture review (load-bearing trust line).
- L47: "...one-time payments and pledges remain Member-direct, never via Delegation." — RESCIND per §8a.
- L86: "**Scope vocabulary (b1 published, additive forever):**" — schema-evolution commitment.
- L94: "...one-time payments and pledges remain Member-direct, never delegated." — RESCIND per §8a.
- L108: "Confirmation scopes (publish-tier) are *always* gated on per-action human confirmation... This is permanent, not opt-in: the publish moment stays human." — KEEP (publish-tier confirmation invariant).
- L109: "One-time payments and pledges are *categorically* not delegable. Permanent. The Member performs every one-time monetary action directly." — RESCIND per §8a (Group C9).
- L130: long line.
- L134: long line.
- L165: ADR-9 status row — "One-time payments and pledges remain categorically not delegable." — RESCIND per §8a.

**`assistant-context.md`**
- L13: "...never visible to other Members, never visible to other Members' assistants, never input to the discovery feed, never used as training data by the platform."
- L91: example refusal text: "never use 'artisan'" — example data. Trivial.
- L137–138: long lines.
- L139: "The categorical refusal of feed input *for other Members* remains permanent."
- L151: long line.
- L169: "...two, with explicit user-controlled sync at T3, never automatic."
- L179: long line.
- L180: "| ADR-9 (Assistant Context portion) | Accepted | ... Categorical refusal of feed input *for other Members* is permanent. |"

**`skills.md`**
- L48: "...additive forever, stable from b1."
- L70: "Scope additions in a new version *always* require re-confirm..."
- L81: "Suggestions, never auto-subscriptions."
- L137: "...a Skill that requests scopes it never uses..."
- L146: "**Platform-curated Skills are free, always.** The platform never charges Members for capability published by the platform itself... (This default is permanent, not opt-in.)"
- L151: "...governance commitment to never raise without 90-day notice and re-opt-in..."
- L154: "Free Skills authored by community/peer/federation never trigger this option..."
- L166: long line.
- L185: "...this Skill asked for X but never used it..."
- L187: "Member-level revoke is always available..."
- L198: "| ADR-9 (Skills portion) | Accepted | Platform-curated Skills remain free permanently... No paid promotion ever. |"

**`action-layer.md`**
- L3, L15, L25, L47, L49, L51, L85, L116: handful of "never"s, all commitment-bearing re credential injection and the credential-never-touches-agent invariant. KEEP-shape per architecture; flagged for explicit ratification.
- L25: "The action layer never accepts a long-lived secret as proof of authority... the model/agent never sees a refreshable credential."
- L39: "Some scopes are categorically gated on per-action Member confirmation, regardless of what Delegation grants the caller holds."
- L49: "...cannot exfiltrate credentials the agent never had."
- L51: "The agent's tool runtime never sees the credential."
- L85: "Agent tool runtimes never receive credentials."
- L116: "**Credentials never traverse agent context.** The edge mints and applies; the agent never holds."

**`item.md`**
- L25: "...the UI always uses the specific kind." — process language. Trivial.
- L83: "**Categorical recommendation surfaces** — *'you follow these makers; here are similar Items in your area'* — driven by Item embeddings plus Person history." — "categorical" used in classification sense. Trivial.
- L94: "...cooperative-style coordination is deferred indefinitely per `groups.md`..." — §2 SOFTEN authorized.
- L101: "...JSONB — small, for fields not worth a column and never queried..."
- L117, L122: long lines.

**`location.md`**
- L5, L13, L15: enum-value `permanent` in primitive description. Trivial.
- L30: long line.
- L32: "The platform never collapses them into a single 'business listing' record — that is the directory failure mode named in `principles.md`."
- L37, L39, L53, L56, L63, L67, L99, L119, L128, L156, L158, L184, L186, L201, L241: enum-value `permanent` references; mostly trivial. (L184 and L204 carry commitment-bearing "never" — see below.)
- L61: "Soft-delete via `deleted_at`. Hard deletes never ship."
- L128: SQL comment — "small extras, never queried." Trivial.
- L184: "Soft pointer, never an address."
- L204: "Stranger walks down the index and never encounters Maya's home."

**`business-jurisdiction.md`**
- L25: long line.
- L92: "The verification source is shown; the document itself is **never** shown publicly."
- L119: SQL — "generated always as (..." — trivial DDL.
- L150: "Member-on-self only; never delegable to a third party (per ADR-9 categorical refusal of delegating identity claims)."
- L169: long line.
- L174: "The Member's home address is still never disclosed..."
- L179: "The document blob is never publicly accessible."
- L236: long line.

**`producer-bulletin.md`**
- L11, L141: long lines.
- L52: "...references a permanent or recurring-temporary Location..." — enum value. Trivial.
- L69: "...the producer sees segment sizes and behavior, never individual follower identity beyond what `member_follows` already exposes."
- L77: "...item-or-group-scoped, never Location-scoped..."
- L84: "...never names another producer."
- L93: "...required, never null" — schema annotation. Trivial.
- L122: "Bulletins are author-scoped (Member or co-author Members), never Location-scoped..."
- L161: "...probably always free; the platform's value comes from producers staying..."

**`producer-growth.md`**
- L20: "Anonymized aggregates only; never names another producer."
- L32: "...the Member is never trapped on the platform."
- L53: "Visible only to the producer themselves; never surfaced to consumers and never used for ranking..."
- L82: "Always anonymized aggregates — no individual producer comparison..."
- L123: "### Revenue context (Member-supplied, never required)"
- L125: "**Never required, never shared with any other Member or third party, never sold.**"
- L137: "...The pay-for-visibility refusal in [`principles.md`](../foundation/principles.md) applies here categorically."
- L140: "**No named-competitor benchmarking.** Anonymized peer aggregates only. Never 'here's how Sally's Bakery compares to yours.'"
- L175: "...the producer never sees individual follower demographics beyond what `member_follows` and `home_location_id` already expose."
- L180: "...followers are never identified..."
- L181: "**Revenue context (T3).** Opt-in, Member-owned, never shared."
- L216: "...Member never trapped..."
- L224: ADR-9 cross-ref — "...categorical refusal of ad sales / demographics / data sales / named-competitor benchmarks."

**`discovery.md`**
- L13: "Never rank by business size, follower count alone, or anything that amplifies corporate shells over Members." — §9 review surface.
- L15: "Communities are emergent — never auto-assign a Member to a Community-scoped feed."
- L91: "...holdout group always on T1 weights for regression detection." — A/B harness detail. Trivial.
- L110: "...soft signals (follows, attendance) compute at query time only and never write membership rows."

**`events.md`**
- L7: "Events are first-class from the start so we never retrofit them."

**`archive/`** (community.md, cooperative.md, member-operations.md, vendor-*.md) — all archived per CLAUDE.md instructions. Not scanned for ratification; superseded by live specs.

### product/surfaces/

**`community-platform.md`**
- L131: "Do community projects need a separate 'host' entity, or do they always attach to a Member or a Group? Working answer..." — open-question prose. Trivial.

**`archive/marketplace-format.md`** — archived; not in scope.

### product/ui/

**`design-language.md`**
- L7: "**One accent color.** Civic green (`#1B7A3D`) is reserved for primary CTAs and the brand mark. Ownership tier colors live only on badges — never on buttons, links, or backgrounds."
- L103: "The Member never sees the RRULE." — trivial.
- L132: "Always visible — never more than one click from converting a browser"
- L135: "...so they never compete."
- L163: "...always modal at peak intent"

### product/capabilities/

**`item-create.md`**
- L18: "...the persona should never see the four-way choice."

**`item-view.md`**
- L30: "Endorsements, reviews (b2 / permanently deferred)" — Per §3, RESCIND the permanently-deferred framing.

**`consumer-feed.md`**
- L3: "...anchored on the Member's locality but never Location-message-scoped."
- L31: long line.

**`event-host.md`**
- L13: "...never from a generic `/new` route."
- L21: "...the user never sees `kind`."

**`group-create-join.md`**
- L3: "Groups are emergent and self-selected — never auto-assigned by polygon or attendance."
- L14: "The platform never auto-creates or auto-assigns any Member to any Group for any reason. This is a hard constraint, not a preference."
- L23: "...*never* written as `group_memberships` rows..."
- L47: "**Deferred indefinitely:** cooperative voting / distributions / off-platform legal verbs..." — §2 SOFTEN authorized.

**`locality-browse.md`**
- L15: "...base tables never queried on the anonymous read path"

**`shareable-listing.md`**
- L20: enum-value `permanent` reference. Trivial.
- L27: "Stable slug — once issued, never changes unless the maintainer explicitly renames the entity..."

**`archive/`** (stays-*, community-signals, business-detail-view, platform-cross-vertical-links, community-create-join) — archived; not in scope.

### product/exploration/

**`reciprocity-and-goodwill.md`**
- L12: "...People who only ask, never give, create predictable resentment..." — describing observed dynamics. Trivial.

**`community-accountability-model.md`**
- L79: "...the reason is always shown..."
- L84: "One person can never move the needle. A single report does nothing visible." — design commitment.
- L89: "The scale is never displayed as a number — it's a vibe, not a score"
- L156: "...opt-in by business? or always visible?" — open question. Trivial.
- L165: "Should the four pillars ever be visible as separate scores, or always aggregated into a single standing?" — open question. Trivial.

**`business-accountability.md`**
- L72: "Allegations never proven?" — example category. Trivial.
- L79: "**Business owner response is always visible** alongside the record"

**`business-intelligence-platform.md`**
- L75: "Pricing should never exclude a small business from surviving."
- L103: "Never sell individual consumer data — only aggregated, anonymized signals"
- L167: "...a $100K revenue business never pays the same as a $2M one"
- L203: "Average fee as % of revenue: ensure fees never become predatory"

**`_attic/2026-05-19/product-exploration/locally-owned-verification.md`** (archived 2026-05-18 — content promoted to `business-jurisdiction.md`)
- L98: "The platform never asks for or stores a street address as locality evidence."

**`local-food-network.md`**
- L9: "...CSAs require commitment consumers aren't always ready for..." — observational. Trivial.

**`archive/`** (food-pivot-scenarios, thesis, community-signals, original-scenarios) — archived; not in scope.

### planning/

**`DECISIONS.md`**
- L57: "...outputs to users are anonymized aggregates..., never per-Member attribution."
- L65: "Per-Member identity never surfaces in a recommendation."
- L117: "Privacy: geolocation is requested but never required. The city-pick fallback must always be available."
- L137: long line.

**`PIPELINE-AUDIT.md`**
- L13: long line.
- L47: "...are never named in `CLAUDE.md`..." — process observation. Trivial.
- L125: "...relics of agent worktrees that were never cleaned up." — Trivial.
- L165: "Reads scenario only. Never reads code."
- L166: "Reads scenario + review. Never reads code or backlog."

**`bundles/b1-primitives.md`**
- L23, L25, L105: long lines.
- L66: "**Cooperative-style coordination is deferred indefinitely** per the Groups ratification — no `cooperative_*` schema lands at b1." — §2 SOFTEN authorized.
- L70: "**Reviews, ratings.** Permanently deferred (per `service-provider.md` Comments — community-anchored endorsements at T2 instead, no star ratings ever)." — §3 RESCIND authorized (Group B4 ripple).
- L91: "...cooperative-style coordination is deferred indefinitely per `groups.md`..."
- L102: "...cooperative coordination deferred indefinitely per `groups.md`..."
- L115: "**Soft delete on every entity.** Hard deletes never ship at any tier."

**`scenarios/F018-brian-declares-run-club.md`**
- L6: "Primitive shape: Person -> Item(kind=gathering, recurring) -> Location(Drake's, permanent)" — enum value. Trivial.
- L26: "**Primary action button:** 'Host something here.' (verb-first, surface-anchored — never 'Create Item.')"

**`reviews/F018-review.md`**
- L115: enum-value `permanent` for fixtures. Trivial.

**`reviews/agent-assistance-architecture-review-2026-05-09.md`**
- L13: "...The line 'the Member always presses publish' is the structural commitment..."
- L15: "**Money-flow scopes do not exist** (`delegation.md` T2 + ADR-6). Categorical exclusion of monetary action from Delegation..." — RESCIND per §8a (review will be stale once Group C lands).
- L16: long line — `member_self_records` never visible to other Members.
- L35, L40, L48: long lines.

**`reviews/agent-assistance-planning-filter-review-2026-05-09.md`**
- L88: "**To b3 or defer indefinitely:**" — backlog category language.

**`reviews/agent-assistance-security-privacy-review-2026-05-09.md`**
- L14: "Self-Record never visible to other Members..." — implementation hardening.
- L15: "Self-Record never used as training data..."
- L20, L22, L31, L41, L45, L69: long lines.
- L27: "...scope additions always require re-confirm..."

**`reviews/agent-assistance-people-first-review-2026-05-09.md`**
- L21, L27, L82, L84: long lines.
- L58: "No money flow (pledges are categorically not delegable, correctly)." — review-of-record; superseded by §8a.

**`handoffs/agent-assistance-2026-05-09.md`**
- L42: "...'never visible to other Members' should be enforced via RLS + separate Postgres role + CI assertion; ...cross-Member sharing of `voice` / `tastes` / `refusals` should be categorically removed..."

**`walkthroughs/F018-pipeline-trace.md`**
- L5, L207: enum-value `permanent`. Trivial.
- L36: "...never reads tickets or code" — firewall description. KEEP-by-construction.
- L197: "...the eval writer never reads tickets or code (this firewall is what makes the spec a trustworthy oracle)."
- L313: "Never roll back. Never silently update the test." — KEEP-by-construction (TDD firewall).

**`archive/`** (JOURNAL-pre-mission-clarity, JOURNAL-2026-05, DECISIONS-pre-mission-clarity, DECISIONS-superseded, b2-community-pre-loops, F005, F012, F017, F018-item-composer, F019, F022, F023, F024, F001, PRE-PRIMITIVES-AUDIT, plans/food-pivot-execution) — archived; not in scope. Notable preserved-by-history occurrences:
- `archive/JOURNAL-pre-mission-clarity-2026-05-08.md` L246, L248, L323–L325, L342, L589, L759, L760: historical "never" commitments around community/business design — preserved as record, not live.
- `archive/DECISIONS-superseded-2026-05-10.md` L87: "Deferred indefinitely." re cooperative — superseded.

**Out of scope per task instructions:** all `scenarios-backlog/archive/*`, all `bundles/archive/*`, all `archive/*` under planning. Trivial / historical-record occurrences in those files are not enumerated above.

---

## § — Backlog: T2/T3 deferral classification sweep (post-T1)

**Status:** DEFERRED until T1 is in production. Per user direction 2026-05-12 — T2/T3 hygiene doesn't move T1 forward; back-catalog waits.

**The work.** Walk every spec in `product/foundation/`, `product/systems/`, `product/surfaces/`, and `planning/bundles/`; pull every T2 / T3 / b2 / b3 / "deferred" / "reserved" reference; classify each as **scope-discipline** (could ship earlier; doesn't earn its slot), **prerequisite-blocked** (literally can't ship until X lands), **mixed**, or **ambiguous**. Land Intent annotations per the convention in [the archived intent audit](archive/intent-audit-2026-05-12.md) Category 4 (live discipline lives in `pipeline-intent-check` workflow).

**Why this matters (when bandwidth opens).** Scope-discipline deferrals are easy promotions when capacity allows; prerequisite-blocked ones aren't. Without classification, every T2/T3 entry reads as ambiguous and the PM has to re-derive the deferral reason on each revisit. The `pipeline-intent-check` skill catches new deferrals going forward; this backlog item handles the back-catalog.

**Scope estimate.** Surface unknown — likely 50–100+ deferrals across the corpus. Approach options when picked up: full inventory first (planning artifact only), inventory + annotate the unambiguous ones, sample the high-leverage specs end-to-end, or run `pipeline-intent-check` spec-by-spec.

**Trigger to re-open.** T1 in production. Or sooner if a T2/T3 deferral surfaces a real PM ambiguity during T1 work.

## Notes

- The single "Never" of the project — **extractive wealth over circulative wealth** — is RATIFIED and does not appear in this log.
- Items in §7a/§7b/§7c stay as-is in their source specs until ratified here; the build agent does not edit them.
- For each unflagged absolute-language occurrence encountered in future edits, append a row to the "Project-wide flagged" sections.
- `member.md` L532 (auto-flip Maker mode), L542 (one-time-payments categorically-not-delegable), L586 (reviews permanently deferred), `delegation.md` L47/L94/L109/L165 (one-time-payments categorically-not-delegable), `agent-assistance.md` L41 (same), and `policy.md` ADR-9 status row are tracked as authorized-RESCIND under Groups B4/B7 and C9–C12 of the amendments doc; this file flags them for completeness, but the build agent does not need re-ratification to act on them — the amendments doc is the authority.
- `policy.md` §1, §2, §3 categorical language is tracked as authorized-SOFTEN under Group B5; same treatment as above.
- `groups.md` L13, L298, L359, `b1-primitives.md` L66/L91/L102, `primitives.md` L58, `MAP.md` L59, `capabilities/group-create-join.md` L47, `archive/cooperative.md` L3/L13 — "deferred indefinitely" re cooperative coordination — tracked as authorized-SOFTEN under Group B3 per §2.
