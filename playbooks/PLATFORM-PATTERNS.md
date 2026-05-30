---
purpose: Platform decisions in force, with their intent.
layer: how
status: active
---

# Platform patterns

Decisions about what the platform IS or refuses to be. URL shape, primitives, agent-assistance commitments, policy framework, locality default, anti-Nextdoor framing.

Each entry follows the pattern-doc shape: Decision (one sentence), Intent (one short paragraph naming what it protects against), Touches (one file or capability that owns the implementation). The decision is live by virtue of being in this doc — no status field, no editorial trail. If a decision becomes inoperative, the entry comes out.

> Sister docs: [DECISION-PATTERNS](DECISION-PATTERNS.md) for how new decisions get made, [DEVELOPMENT-PATTERNS](DEVELOPMENT-PATTERNS.md) for how-we-build decisions.

---

### Anchor all primary controls to the bottom of the viewport

**Decision.** All primary controls — search, navigation, action buttons, detail cards — anchor to the bottom of the viewport; the top is reserved for content header or breadcrumb only.

**Intent.** The platform's primary use is locality-driven mobile interaction — a Member at a market, outside a venue, between errands. Mobile-first is the active constraint that picks the chrome; a richer desktop surface is on the roadmap for when user growth and Member needs justify the second design pass. Top-anchored chrome on mobile forces thumb-reach trade-offs every interaction; bottom-anchored chrome on desktop costs nothing because the layout has room. The Google/Apple Maps pattern is structural, not aesthetic — users arrive already trained on bottom-card, slide-up, expand-upward, so the cognitive cost of learning the app is the cost of learning its content, not a novel chrome.

**Touches.** `product/ui/design-language.md`

---

### Default locality to geolocation, fall back to city-pick, keep it mutable everywhere

**Decision.** The default locality is the user's geolocation if granted; the fallback is a city-pick from the launch metro and surrounding cities; locality is mutable from every surface that depends on it, not buried in `/you`.

**Intent.** Locality is a high-frequency context, not a setting. Geolocation gives the platform a useful default the moment a user lands; the city-pick fallback preserves privacy for users who deny geolocation, which is requested but never required; mutability everywhere supports both moves and travel without forcing a Member into a settings page mid-flow. Multi-Location belonging is a separate substrate; this decision concerns only the single mutable locality scope.

**Touches.** `product/systems/member.md`

---

### Model markets as Gathering Items, not a separate entity

**Decision.** A market is a `kind='gathering'` Item; there is no `markets` table, no Market entity, no `market_*` schema namespace. "Kinds of gathering" are distinguished by controlled-vocabulary `item_tags` and free-form `item_hashtags`.

**Intent.** The platform's wedge is farmers markets, but the platform's primitive is People declaring Items at Locations. A wedge-shaped schema would force every later kind of gathering — run club, repair café, swap meet, movie night — to either pretend to be a market or fragment into its own table. The Item primitive absorbs all of them with one composer, one URL grammar, one set of RLS policies. The wedge does not become the primitive.

**Touches.** `product/systems/item.md`

---

### Build agent assistance into the substrate from day one

**Decision.** Agent assistance is first-class on three primitives — Delegation, Assistant Context (`member_self_records`), and Skills — bound by five commitments: loop-shaped not role-shaped; persistence is standing-derived not toggle-derived; reads can be automated, writes require human confirmation; Member-owned never platform-owned; federation-portable. Substrate ships at b1, surfaces at b2, federation interop at b3.

**Intent.** The action layer, the bounded-purchase delegation, and the Member-geography substrate privacy all encode agent-aware invariants at the substrate level — retrofitting agent-awareness later would mean rewriting the substrate. The five commitments prevent specific failure modes: role-bound persistence models the Member as a vector of roles rather than a person; agent writes without confirmation create unconsented mediation between the Member and the platform; platform-owned context invites training, sale, or behavior-shaping. Member-owned context is the structural prevention, not a privacy toggle.

**Touches.** `product/systems/agent-assistance.md`

---

### Evaluate every policy surface against the three-filter test with opt-out default

**Decision.** Every policy surface (data sharing, revenue, monetary flow, visibility, agent action, complaint handling, content moderation) is evaluated against three filters — Helpful, Harmless, Abuse-resistant — answered concretely in the spec, ships with the Member opted-out by default, and carries an anti-Nextdoor posture (no Location-scoped messaging, no Location wall, no Location feed) even while Member↔Location relationships remain productive substrate.

**Intent.** Case-by-case policy reasoning fragments the platform's promise to Members — a Member who opts out of cross-Member analytics needs to know they opted out of *everything* cross-Member, not the seven surfaces the platform happened to remember to gate. Three filters plus opt-out default give the Member one mental model. The anti-Nextdoor commitments target the specific failure mode of complaint-magnet location-locked feeds, not Member-Location relationships themselves; productive substrate (Concerts-in-the-Park feed, locality-promotion in Groups) survives with its own per-surface three-filter analysis.

**Touches.** `product/foundation/policy.md`

---

### Consolidate Community / Member Operations / Cooperative into one Group primitive

**Decision.** Group replaces three predecessor primitives via spine + child architecture; six kinds at b1 — five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) self-selected and never auto-assigned, plus one operate (`business`) that absorbs sole proprietors, partnerships, and cooperative-shape operations identically at the schema level; kind locked at create.

**Intent.** Three predecessor specs each modeled a slice of multi-Person coordination with overlapping concepts and divergent vocabularies — three places to look for "how do groups of people work here," three event-log namespaces, three migration paths. Consolidation gives the platform one answer with one primitive, one home, one set of rules. Cooperative-coordination mechanics (voting, distributions, governance) defer until real-world demand emerges — kind='business' Groups with multiple owner-role memberships are the foundation; coordination tooling lands when need is documented, not speculatively.

**Touches.** `product/systems/groups.md`

---

### Model Location as spine + child tables per kind, three kinds at b1

**Decision.** Location uses a spine + child architecture — `locations` spine with PostGIS Point on all kinds plus three b1 child tables (`location_permanent`, `location_recurring_temporary`, `location_areas`); kind locked at create; every Location row exists because a Member added it (no auto-population from third-party sources at b1).

**Intent.** Per-kind separate tables would fragment Member↔Location and Item↔Location relationships across three foreign-key targets, forcing UNIONs across three tables for every locality query. A single table with kind-discriminator columns would let the schema lie about which fields apply when. Spine + child puts kind-specific fields in their child table while every locality query gets one query path through the spine. Auto-population from third-party sources is foreclosed at b1 because it would break the deliberate-presence guarantee the rest of the platform inherits.

**Touches.** `product/systems/location.md`

---

### Authorize agent-mediated one-time purchases via the `bounded_purchase` Delegation scope

**Decision.** A new monetary-flow Delegation scope (`bounded_purchase`) authorizes a Member's assistant (or subscribed Skill) to find and complete one-time purchases within Member-stated bounds — caps per transaction and per period, recipient scope, category scope, reversibility window, first-recipient confirmation, local-preference flag — schema-enforced at the action layer with per-execution audit, immutable by the agent (only the Member can change via re-grant).

**Intent.** The earlier "categorically not delegable for one-time payments" framing closed off productive use cases (an agent finding local eggs and buying them within Member-stated caps) without giving the Member control. Schema-enforced caps let the Member grant bounded authority that the action layer mechanically refuses to exceed, with a reversibility window for buyer's-remorse and a first-recipient-confirmation gate for new payees. The platform never custodies the funds for itself; the rail honoring the scope is the closed-loop ledger plus chartered-partner ACH per the payments architecture.

**Touches.** `product/systems/agent-assistance.md`

---

### Scope public URLs to place hierarchy; Member handle is the global namespace

**Decision.** Public URLs are locality-scoped wherever a place is the most stable anchor — Locations, Groups, and Group-anchored Items nest under a variable-depth place path with parent-scoped slug uniqueness (`places UNIQUE (parent_id, slug)`); Members keep a single global handle (the auth identity); Item-kind segments are single-letter per kind. `places` is a platform-curated hierarchical primitive distinct from Member-declared Locations.

**Intent.** Locality-first is the platform's foundational commitment; URLs are the most public expression of it. Place hierarchy is how people actually think about geography, and modeling it directly in URLs aligns the information architecture with everyday speech. Parent-scoped slug uniqueness lets two Oak Parks (Sacramento, Illinois) exist as distinct places without name mangling — the hierarchy carries the disambiguation. Platform-curated places preserve the URL namespace from one Member declaring their block a city; user-declared geographic scope routes through `locations.kind='area'` instead. The Member handle stays global because the Member is the auth identity — Members move between neighborhoods, cities, countries without losing identity.

**Touches.** `product/systems/places.md`

---

### Split Member↔geography into three purpose-owned substrates

**Decision.** Retire `member_location_affinities` and its six-kind enum; replace with three substrates each carrying its right unit, lifecycle, and RLS posture — `member_business_jurisdictions` (seller locality, public, ZIP-grain with attestation ladder), `member_place_interests` (community awareness, private, Place-shaped, primary_home plus up-to-5 secondary), `member_saved_searches` (follow-as-subscription, private, labeled filter set). Add `items.made_at_place_id` for Item-level provenance ("Locally Made" badge as sibling to jurisdiction's "Locally Owned"). Private substrates are owner-only at the row level.

**Intent.** The six-kind enum fused three threads with different shapes — seller locality (public claim with public evidence), community awareness (private attention scope, Place-shaped not Location-shaped), and follow (a subscription naturally saved-search-shaped). Single-table compression forced the private/public mismatch through a SECURITY DEFINER escape hatch and kept named functions whose consumers never materialized. Split substrates remove the boundary-crossing escape hatch and give future geographic features a clear question at design time — *which substrate owns this?* The doxxing-prevention guarantee survives unchanged: the platform never exposes another Member's geographic attention scope.

**Touches.** `product/systems/member.md`

---

### Replace MSA with county; use readable + random-suffix slugs for user-generated entities

**Decision.** `places.kind` enum becomes `region`, `state`, `county`, `city`, `neighborhood` — `county` replaces `msa` as the tier between state and city (FIPS-coded, total U.S. coverage including rural). Items, Groups, and Locations get system-generated slugs of the form `{title-derived}-{short-random-suffix}` applied always (not only on collision). Place slugs stay human-readable with parent-scoped uniqueness; the Member `@handle` is the only user-chosen vanity namespace.

**Intent.** A hierarchy tier must resolve every coordinate to exactly one anchor — MSAs leave roughly 1,200 rural counties unassigned and let one MSA swallow tri-state metros into a single un-navigable tile. Counties tile the country completely with stable FIPS codes and admin-level-2 equivalents in every country (international-ready). The readable stem on entity slugs serves humans, search engines, and agents; the random suffix makes collisions impossible by construction and slugs non-enumerable, so the platform doesn't add collision-time mangling or expose enumeration as a scrape surface. User-chosen slugs beyond the handle would open squatting and impersonation — a moderation surface the platform declines to create.

**Touches.** `product/systems/places.md`

---

### Layer metro polygons over the place tree as a discovery overlay, not a hierarchy tier

**Decision.** A platform-curated metro-polygon layer (CSA-grain, seeded from Census, hand-tunable) sits adjacent to the county tree as a discovery construct — Places and Locations are "in" a metro by `ST_Contains` against their coordinates, not by tree parentage. The polygon is read by feed generation and the "wider scope" filter only; metros never appear in URLs, never become messaging targets, and Members cannot create or edit them. Rural places have no metro and fall back to radius/isochrone for "wider than city" scope.

**Intent.** Treating MSAs as a hierarchy tier failed because hierarchy tiers must tile every coordinate — roughly 1,200 rural counties have no MSA, so the hierarchy left holes a URL namespace can't tolerate. The same MSA geometry works cleanly as a discovery overlay because discovery has different obligations: feeds don't need to tile, they just need to answer "what's near me" with a named, shareable shape. Keeping the metro layer adjacent to the county tree (not parented to it) preserves the two-layer separation: county tree owns addressing and URLs; the discovery layer owns "what's near me" and can carry multiple geometries (radius + metro polygon now, travel-time isochrone deferred). Metros stay read-only filters because they're a feed scope, not a destination — consistent with the anti-Nextdoor commitment.

**Touches.** `product/systems/discovery.md`

---

### Compact place URLs with state codes and a URL-transparent county tier

**Decision.** Render public place-scoped URLs as `/p/{state-code}/{city}/{neighborhood}` — state place rows use the 2-letter USPS code as slug; the `county` tier stays in the data model but is omitted from the rendered path (the URL builder skips county ancestors; the resolver resolves city as a transitive descendant of state); city slug uniqueness is scoped to state for URL purposes, with the county segment available as disambiguator. Data model is unchanged.

**Intent.** Counties earn their place in the data model — they're the tier that delivers the total-coverage guarantee. They don't earn a place in the URL because counties are tiers people resolve through, not navigate by; rendering them produced URL repeats when county and city share a name (Sacramento County / Sacramento) and doubled URL length. USPS state codes cost nothing in readability that full names would buy and save 8–10 characters on every URL the platform issues. Rural places with no city ancestor still render the county in their path — coverage is untouched.

**Touches.** `product/systems/places.md`
