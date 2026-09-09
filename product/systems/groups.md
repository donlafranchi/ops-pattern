---
id: what-groups
purpose: Self-selected sets of people organized to do things together — why it's people, never a corporate shape.
layer: what
status: active
---

# Groups (Pages)

A Group is a set of people organized around something — shared place, interest, practice, event, household, or commercial operation. The shape varies with the something; that it's *people, not a person* never does. The platform models no Business entity: a Group cannot sign, own, be delegated to, or outlive its last member, and money flows are visible and accountable to identified people, never to a shell. This is the structural refusal that lets the platform represent how people actually organize — partnerships of equals, families, sole proprietors — without forcing the corporate costume US law would otherwise impose.

**The platform drives on-platform verbs and records off-platform facts — it never performs a legally-binding act.** A Group operating as an LLC can declare that fact and the platform mirrors it; the platform doesn't file the paperwork, execute a binding governance vote, or sign a regulated agreement on anyone's behalf. This is why cooperative coordination (voting, distributions, treasury) stays out of scope — co-owning and voting are off-platform verbs the platform isn't equipped to adjudicate (no escrow, no legal weight, no fraud recourse), and modeling them would make the platform the record-of-truth for acts it can't authenticate or unwind. `kind='business'` Groups with multiple owner-role memberships already carry the cooperative *shape*; the governance tooling waits for documented real-world demand, most likely arriving as a federation handoff rather than a schema patch.

## Six kinds, two verb families

**Affiliate** (community kinds — `place`, `interest`, `practice`, `event_anchored`, `family`): members gather, share, follow, attend, host. **Operate** (`business`): members make, sell, serve, host commercially. A sole proprietor is a business Group of one; the platform doesn't differentiate by member count, because the question a business Group exists to answer — *is this local, does it support my community, should I support it* — has the same answer whether one owner or three. Forcing self-categorization by count would impose a costume the people-first stance refuses.

## Ownership is membership — nothing else

Every business Group has ≥1 active `owner` membership; owners are co-equal on member-management and dissolution, staff can post on the Group's behalf but can't manage the roster or dissolve it. Adding someone to the membership row **is** the access grant; removing it **is** the revoke — there is no separate concept of "operating owner," "handoff," or "succession" anywhere in the schema. If owners disagree, that's a conversation between them, not platform machinery. The Locally-Owned badge is OR-aggregated across all active owners — one local owner is sufficient evidence, because a partnership with one local and two non-local owners is still locally-owned in the way that matters for a support decision; requiring unanimity would lose the partnership case, and privileging a founder specifically would break the moment ownership transfers.

**Locality is computed at query time, never stored** — a stored flag would represent locality as of whenever it was last computed, and every jurisdiction change (an owner's ZIP update, an owner leaving) would need a recompute trigger; a missed trigger lies. Computing fresh eliminates that whole class of staleness by construction. Multi-location operations need multiple Groups (Bob's two franchises are two Groups, each tested independently against its own anchor) — there's no single "is this business local" answer once a business has more than one location.

## No kind transitions — dissolve and recreate instead

A Group never changes kind. A run club that wants to formalize as an LLC ends the old Group and starts a new one; items re-file at the member's discretion, and a self-reported founding date lets the new Group claim continuity without the platform having to verify or enforce a lineage link. This is simpler than maintaining transition machinery (role-mapping per kind pair, audit semantics) for a case that's undemonstrated at this scale — the door stays open to revisit if a specific harmful case ever argues for in-place transitions, particularly once a Group has accumulated enough infrastructure and customer base that dissolve-and-recreate becomes genuinely costly.

**Reputation travels with the person, not the Group.** Whatever recognition a member has earned follows them across every Group they've held membership in, founder or participant alike — Group-anchored reputation would let trust be sold without the conduct that earned it, and a hybrid (transfer with a conduct commitment) needs adjudication machinery the platform doesn't have.

## What a business Group persists through

**No auto-dormancy, no auto-dissolution, ever** — a business Group exists as long as ≥1 active owner does. Inactivity only ever affects *surfacing* (a discovery-layer demotion, per `discovery.md`), never lifecycle state, never a public "inactive" label. Adjudicating whether an off-platform business is "really" dormant needs signals the platform doesn't have (sales records, owner intent); separating *does it exist* (membership) from *does anyone see it in promoted surfaces* (discovery) keeps the platform from mis-handling a call it can't make well. Community-kind Groups keep an ordinary 90-day dormancy-then-dissolution window with unlimited member-initiated extension — life gets messy and the platform shouldn't force busywork over it.

## What a Page carries at creation, and why each piece is shaped the way it is

**Location: an address or a neighbourhood, never a guessed fallback.** A Page that pins somewhere its founder didn't choose is worse than one with no pin — it's a confident wrong answer, and the misrepresented person is the one who gets asked about it. No code path may invent a coordinate; an unresolvable address refuses loudly rather than defaulting to something approximate. Neighbourhood mode exists because a platform that only accepts street addresses selects against exactly the members who most need to participate without publishing where they live — a home-based business, an itinerant seller. The derived point inside a neighbourhood polygon is deterministic (the same Page always resolves to the same point) and drawn toward the polygon's interior, never uniformly across its bounding box, so an approximate outline doesn't drop someone in a river.

**Position is resolved at read time, never stored.** A point asserts something is at a place; a club with nothing scheduled isn't anywhere in particular, so its Page shows as an area, not a pin — the same distinction the feed already carries (areas read as *who's around*, pins read as *what's on and where*), delivered geometrically. An active appearance at a Venue takes precedence and is always a point, for exactly as long as the appearance lasts, then falls back to the anchor with no cleanup step — the same mechanism that drops a finished gathering from the feed. Appearances can't overlap in time; a Page is people, and people are in one place at a time. An appearance *replaces* an area anchor (the truck moved) but *adds to* an address anchor (the bakery's shop didn't go anywhere just because there's also a market stall today).

**One category from a maintained list of twelve, plus a real escape hatch.** The "Other" option's free text is captured, never auto-promoted into the vocabulary — a category with forty identical "Other" entries tells the operator exactly which term is missing, which is the entire value of not forcing a fit. Promotion is always a deliberate human act reading the table, never a volume threshold that fires on its own.

**A photo, or art that admits it isn't one.** Nearly every Page has no photo on day one, so the placeholder is the platform's actual appearance, not an edge case — it must be deterministic (the same art every load) and visibly not a photograph, because a placeholder handsome enough to pass for one both misrepresents the place and removes the reason to ever add a real photo. Stock photography is refused outright for the same reason twice over.

**No verification of any kind on any of this.** A category, a location, a photo — each is a claim its owner makes, the same way every other field on a Page is. Trust here is the members', not the platform's.

## Selling tools have no toggle

There is no maker-mode flag. Selling tools surface from Group and Item state alone: a member with an active business Group has the full toolset surfaced ambiently; a member without one sees the universal composer, and tapping Sell for the first time is what triggers the business-Group walkthrough. To stop selling, end the owner membership — there's no separate off switch. **Seller** is the generic term; **Producer** is preferred in food/ag contexts; **Maker** survives only where someone specifically self-identifies that way.

## Editing an active Page — save is publish

The Page's managing role (owner on a business Page, steward on every other kind) can edit name, description, tagline, image, and the "where they'll be next" line — never the slug, the kind, the lifecycle state, or the founder record. **The slug never follows a name change**, deliberately: people text each other links, and an address that silently moves when someone fixes a typo breaks every link already shared with no redirect. There's no draft state for an edit — it publishes immediately, because a pending-review copy of a public address earns nothing for a six-field form. Legal or tax-shaped fields (entity type, formation date) may exist as storage for an off-platform fact, but no editor surfaces them and no copy refers to them.

## Business identity is local, not global

Business names are scoped to a hood or metro — there's no global namespace and no platform-wide handle, so two businesses in different hoods may share a name. This removes the incentive for name-hoarding rather than policing it (a name claimed somewhere you don't operate reaches nobody). A global handle was considered and rejected — it rebuilds exactly the namespace-contention problem local scoping exists to avoid, and pulls against the neighbours-not-strangers shape of the product. What local scoping does *not* solve is impersonation within a hood (someone opening a second "Joe's Pizza" in Joe's own neighbourhood) — a verification path for that is unscoped; the business-jurisdiction ladder answers "is this owner local," not "is this the real one."

## No-personhood guarantees, enforced at two layers

Schema: every Item has a non-null owning Member — Items are never headless, corporate-only, or filed by someone who isn't operating the Group they're filed under. Groups can't hold Delegations (only a Member can consent, and only a Member has a context to withdraw one from) — Group-coordination agents are platform-curated and invoked under an operator's own Delegation, not Member-invented, because letting members grant Group-scoped authority to agents they built themselves leaves the rest of the Group unprotected against a badly-scoped one. Action layer: no write may construct a corporate-shell-shaped relationship by composing otherwise-legal operations — Item-to-Group ownership, Group-to-Group ownership, or any proxy pattern that ends with a non-human entity as the accountable party.

## Public-face attribution

A business Group is the public face for commerce; the member behind it is a separately-gated personal identity. Items filed under a Group attribute to the Group ("Sold by ..."), never to the filing member's personal handle — the member is still named on the Group's "Founded by" line and still carries the accountability (their social capital is on the line), but the *link* to their personal profile is conditional on their own discoverability setting. This is deliberate: selling publicly is consent to attribution, not consent to personal discoverability, and a Group is always public-by-default so an Item's visibility never depends on whether its filer opted into being found.

## Policy posture

Members are never auto-assigned to a Group by geography, follow graph, or attendance — joining is always explicit. The platform may *suggest* a candidate Group from soft signals, but a suggestion carries no addressability; a member becomes reachable through a Group only by actually joining it. This is the same accountable-participation refusal that shapes the rest of the platform, applied to Group membership specifically — auto-enrollment with addressability is the anonymous-complaint-feed pattern arriving through a different door.

No algorithmic Group recommendation beyond geography and follow-graph, and no engagement-ranked Group discovery feed — both are refused as the engagement-optimization failure mode applied to Groups. Static, relationship-derived suggestions answer what a member actually asks ("what's near me," "what do people I know do"); a feed designed to keep someone scrolling through Groups is a different product.

## What this rules out

Cooperative governance tooling before documented real-world demand. A stored locality flag of any kind — locality is a live derivation, never a column that can drift. Group-to-Group or Group-to-Item ownership through any composed write path. Auto-assignment to a Group's addressable roster without explicit opt-in. An engagement-ranked Group discovery feed.
