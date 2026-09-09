---
purpose: Scenario — one producer entry point. /you/sell forks into /you/create, which asks what someone is starting rather than assuming they are opening a shop. Hosting requires no business Group and no shop.
layer: how
status: building
---

# F060: Someone starts something without opening a shop

**Bundle:** launch ([`../now/initiative-launch.md`](../now/initiative-launch.md)) — track A
**Loops:** 1 (Gather), 2 (Declare something), 7 (Make and be found)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services), and the run-club case it does not cover
**Primitive shape:** Person → Group (any kind) → Item. **No new entity, no new table, no new kind value.**
**Spec contract:** [`groups.md`](../../product/systems/groups.md) § Standing tier + § Casual vs ongoing commercial · [`role-language.md`](../../product/foundation/role-language.md) · [`PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) § No legal or tax language reaches a person
**Depends on:** [F057](scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md) — this scenario decides where F057's create path goes; F057 must not decide it.
**Open against this scenario:** whether a one-time event is a Page or an Item with a date — [`../backlog/decision-page-vs-listing.md`](../backlog/decision-page-vs-listing.md). **Unresolved; must not be ticketed until it is ruled.** *(The "Both" question was ruled 2026-09-07 — dropped; the scenario reflects it.)*
**Status:** next — reviewed 2026-09-07, **PROCEED with one EXTEND** ([`review-F060.md`](review-F060.md)). The EXTEND blocks only the ticket that writes a Group kind value or the spine columns.

> **This is a conformance fix, not a design change.** [`groups.md`](../../product/systems/groups.md) already states that a Member without a business Group sees the universal composer — gathering, wonder, ask, offer — and that the shop walkthrough is triggered only by the Sell verb. The build shipped the business path and never built the other one. What follows restores what the spec already says.

## The Person

**Priya convenes a run on Tuesday mornings.** Eleven people come. She has never sold anything and does not intend to. She wants the run to be findable so the twelfth person can turn up.

Today she cannot do this. The only route to the gathering composer is `/you/sell`, gated on owning an active business Group, so **to publish a run she must first open a shop.** The failure is not even a friendly wall — filing anything under a Group that is not a business throws an authorization error.

**Marcus makes hot sauce and also hosts a monthly swap.** He is one person doing two things, and the product currently makes him be two kinds of person to do them.

## The Story

**Priya taps the create control.** One question: **"What are you starting?"** Two answers — *Something I make or sell* · *Something I host*. She picks **host**.

*"What should we call it?"* She types **Oak Park Tuesday Run**. From that moment the interface says *Oak Park Tuesday Run*, not "your Page," not "your group," not "your business." She adds where it meets and when. It is live, it has a public address, and it has her name on it.

**Nothing has asked her whether she is a business.** Nothing has asked for a ZIP code to check a locality badge she does not want, an entity type, or a state of formation. Nothing has used the word *vendor*, *seller*, or *tax*.

**Marcus, who makes hot sauce and hosts a monthly swap, starts with the hot sauce.** When he is ready to run the swap he comes back and starts a second Page — one tap from the end of the first, not a trip back to the beginning. **Two Pages, one account, no mode switch.** *("Both" was dropped 2026-09-07: selling and hosting have different creation processes, and one Page doing both leaks business friction onto the hosting side — the inversion this scenario exists to fix.)*

**Priya, six months later, starts selling club singlets.** She goes back to the create control and starts a second Page — a business one, with the extra steps that come with claiming to be a local business. **The run club stays exactly as it is.** She now holds two Pages and that is the ordinary case, not an edge case.

**Conversion is rejected outright** *(PM, 2026-09-07)*. Turning the run club into a business destroys the run club, and people have several irons in the fire. **Creating a second Page is the model; mutating the first one is not a deferred feature, it is the wrong mechanic.**

## Surfaces

- **`/you/sell` becomes `/you/create`.** Not a rename — a fork. `/you/sell` redirects.
- **`/you/create`** is the single producer entry point: the three-way question, then naming, then the existing composers.
- **The create affordance** in the nav and **the invitation on `/you`** both point here. F057 renders the control; this scenario owns its destination.
- **The recruitment invitation** gains a hosting lane and a service lane alongside the making lanes.
- **`/join`** stops being vendor recruitment and becomes what the product is.

## Data captured

**No new table, no new column on a new entity, no new kind value, no new event type.**

### The lock belongs to the claim, not to the Page — ratified 2026-09-07

**The original intent of the friction has been inverted by the current build, and this scenario un-inverts it.** Verification, locality claims and gating exist to make it harder for a large business to pass itself off as small and local. **They were never meant to make a person hosting a run club prove anything.** Today they sit in front of everyone, because the only door is the shop walkthrough.

So the rule is: **the business shape, and everything that comes with it, is the price of claiming to be a local business. Nothing else carries any of it.**

| Answer | What is created | What it costs the Member |
|---|---|---|
| Something I host | A Page. `groups.kind = 'interest'`. | Nothing. No ZIP, no locality claim, no verification, no badge, no lock. |
| Something I make or sell | A Page. `groups.kind = 'interest'`. | Nothing. **Selling is not the same as being a business** — a person selling jam is not thereby claiming to be a local business. |
| Both | One Page, same as above. | Nothing. |
| *(Later, deliberately)* I am a local business | The same Page acquires a `group_businesses` row and a jurisdiction claim. | The ZIP, the claim, the verification ladder, the badge — **and the lock.** |

**`groups.kind` stops being the gate and becomes a descriptive label.** The gate is the presence of a business claim — the `group_businesses` child row. This is a smaller change than it sounds: every one of the four branches below already required touching each `kind='business'` read, so the edit is swapping the predicate rather than adding one.

### Many Pages per person — ratified 2026-09-07

**A person holds as many Pages as they have things going on.** A business and a run club and a supper club, simultaneously, with no limit implied. **Different creation processes per type are correct and expected** — a business Page asks more questions than a group Page, and that is the friction landing where it belongs.

**This makes the lock question disappear rather than answer it.** Nothing ever needs to mutate, because nobody ever converts: a second Page is the normal path. The Groups spec's kind-immutability rule is not worked around, not amended, and not tested — it is simply never reached.

**The schema already allows this and imposes no limit** — `group_memberships` is many-to-many, `groups.founder_member_id` carries no unique constraint, and the jurisdiction claim is keyed per Page. Verified 2026-09-07.

**Two gates, not one — confirmed against the schema.** A `group_businesses` row means *this is a business*, and it is what gates selling, the public-page resolvers, and the item-create clause. A locality claim means *this business says it belongs to this place*, and it gates the local-owner badge and nothing else. **The decisive evidence: the walkthrough's ZIP step is skippable, so a business with no locality claim is a state the shipped product already produces.** Conflating the two would make every business that skipped that step invisible.

**Three columns move.** `tagline`, `image_url` and the free-text `where_next` line were scoped onto `group_businesses`. **They move to the `groups` spine** so a run club has a picture and a one-liner too. The shop-editor ticket's migration is unwritten, so this is a redirection, not rework — and it stops being free the moment that migration lands.

## What actually blocks this today — four branches, one of them the wall

Verified in code and against the production database, 2026-09-07.

1. **The wall: `item.create` requires the filing Group to be a business.** One clause — `and g.kind = 'business'` — inside the owner-authorization query. A gathering cannot be filed under a run club at all. **Delete the kind condition; keep the ownership condition.**
2. **A non-business Group has no public page.** The group-page resolver filters to `kind='business'`, so a run club 404s. Generalize it; render the business-specific fields when present.
3. **Products and services filed under a non-business Group 404** for the same reason, in their own resolvers. Gatherings already resolve correctly — that fix landed with the canonical-URL work and is the pattern to copy.
4. ~~**The standing badge asks non-business Groups for a `steward` role.**~~ **PAUSED 2026-09-07 — badge work is out of scope.** Do not ticket it, do not migrate it. Recorded because it is real and will resurface: a run-club founder silently earns no standing badge, and the underlying cause is a role-vocabulary divergence between spec and code that is being handled separately.

**Nothing else branches.** No row-level security policy reads Group kind. Neither feed function does. Browse filters the *Item's* kind, not the Group's. Follow is kind-agnostic. Place-scoped URL derivation is kind-agnostic. The card's brand label already falls back to the Group's own name.

## Acceptance criteria

### Hosting requires no shop

**Given** a Member with no Group of any kind
**When** they choose *Something I host*, name it, and publish a gathering under it
**Then** the gathering is created, published, and reachable at its public address. _Why: this is the whole scenario. Today it throws an authorization error, and a person hosting a run club must first walk through Sell and open a shop — the People-First Principle inverted._

### The question is what you are starting, not what you are

**Given** `/you/create`
**When** it renders
**Then** the first question is *"What are you starting?"* with three answers, and **no question anywhere in the flow asks the Member to classify themselves as a business, a seller, a vendor, or a producer.** _Why: [`role-language.md`](../../product/foundation/role-language.md) rule 1. Asking someone to self-classify before they have done anything is the pigeonhole, and it is the reason the run-club organizer leaves._

### The entity's own name carries it

**Given** a named Page
**When** any surface refers to it
**Then** it uses the name the Member typed. The noun *Page* appears only in help text where no name is available. **The strings *business*, *shop*, *vendor*, *seller* and *listing* do not appear as labels for the entity anywhere in the flow.** _Why: verifiable by grep. A word the platform assigns is a class; a name the person typed is theirs._

### No legal or tax language, anywhere in the flow

**Given** the whole of `/you/create` and the composers behind it
**When** every string is read
**Then** none of them contains *sole proprietorship*, *LLC*, *EIN*, *DBA*, *incorporate*, *register your business*, *legal entity*, *formation*, or *tax*, and **no form field collects entity type, state of formation, or formation date.** _Why: [`PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) § No legal or tax language reaches a person (Ratified 2026-09-07). The harm is a chilling effect at the exact moment the platform is lowering activation energy._

### A non-business Page is a real page

**Given** a published Group of a non-business kind
**When** a signed-out visitor opens its public address
**Then** it renders — name, description, image, tagline, what's filed under it — rather than 404ing. _Why: a run club that cannot be linked to cannot be shared, and link-sharing is the platform's distribution channel._

### Starting a second Page is one tap, and the first is untouched

**Given** a Member who has just created a Page
**When** creation completes
**Then** *start another* is offered in a line, returning to the question with the name step ready — **not a redirect to the beginning** — and the Page just created is unchanged by whatever is created next. _Why: dropping *Both* means a person who sells and hosts manages two Pages instead of one, which is real friction on exactly the small producer the platform exists to protect. **This criterion is the mitigation and is not optional** — cut it and the case for dropping *Both* gets materially worse._

### The invitation names hosting as a first-class way in

**Given** the pre-producer invitation on `/you`
**When** it renders
**Then** its lanes include hosting and services alongside making, and at least one worked example is a gathering. _Why: the shipped grid is ten selling categories hardcoded to one metro. A person who convenes rather than sells sees nothing that looks like them, which is the positioning defect in one component._

### The old route does not strand anyone

**Given** any inbound link to `/you/sell`
**When** it is followed
**Then** it redirects to `/you/create`, preserving any query string. _Why: it is the destination of the shipped sell CTA and of `/join`; removing it without a redirect leaves a live route unreachable._

### Nothing gates selling

**Given** any Page, with or without a business record
**When** its owner lists a product or a service under it
**Then** it is created and published exactly as a gathering would be. _Why: **listing something for sale is not a business activity.** A person selling jam, a kid selling bracelets, someone clearing out records — none of them is a business, and none should have to say they are. Corrected 2026-09-07: the earlier version of this criterion made the business record gate selling, which reinstated the conflation this scenario exists to remove._

### The business record is a claim, not a permission

**Given** a Page with a business record
**When** any surface reads it
**Then** the record grants nothing that a Page without one lacks. Its only effects are the heavier creation process that produced it, and the brand label it supplies for display. _Why: the friction attaches to the **claim** — "I am a business" is what a large business would want to fake, which is the whole reason friction exists. A permission the record unlocks would be a reason to acquire it dishonestly._

### The locality claim gates the badge and nothing else

**Given** a Page with a business record and **no** locality claim
**When** it renders
**Then** it works in every respect and carries no local-owner badge. _Why: the walkthrough's ZIP step is skippable, so a business with no locality claim is a state the shipped product already produces. It is a further claim on top of the business claim, not a synonym for it._

### Holding several Pages is ordinary, not an edge case

**Given** a Member who already holds one Page
**When** they create another, and when any producer surface then renders
**Then** every Page they hold is listed — none is treated as *the* Page, and no surface silently picks one. _Why: three shipped reads currently assume a single Page and one of them says so in a comment ("multi-draft is a pathological state"). Under this ruling it is the normal state, and a surface that quietly chooses for the Member loses their work without telling them._

## Multi-Page consequences in the current build — audited 2026-09-07

Three reads assume one Page per person. **All three are in scope here; none is a rewrite.**

1. **Draft resume keeps the most recent draft and discards the rest.** Its own comment calls multiple drafts pathological. Two drafts in flight is now normal. *(Same file, same edit, as the business-row predicate swap.)*
2. **The Sell CTA's branching reads business-only.** "No shop → walkthrough" is wrong for a Member who holds a run-club Page and no business Page.
3. **The You scenario writes "the shop row" singular.** A list, not a row — a scenario copy fix, not code.

**What does not break, and was checked rather than assumed:** the schema imposes no limit (memberships are many-to-many, the founder column carries no unique constraint, the jurisdiction claim is keyed per Page); the sell index already iterates rather than assuming one; **no switch-context surface exists**; no notifications exist; Items carry their Page individually.

## Scope boundary

**In:** the fork and the three-way question, **branches 1–3** above, the three columns moving to the Group spine, the recruitment lanes, `/join`'s rewrite, the redirect.

**Out:** the standing badge (paused 2026-09-07); the business-claim surface itself — this scenario establishes that claiming is a separate later act and does not build it; **conversion of one Page into another, which is rejected rather than deferred**; aggregating messages or activity across a person's several Pages (see § Parked); Group kinds beyond `business` and `interest` at the create surface; the values declaration (cut); the shop editor itself (its own scenario); the Explore-into-Home merge; anything that would rename a table.

**Explicitly not decided here:** what the nav's create affordance looks like. This scenario owns where it goes, not what it is.

## Parked — raised, not decided, not in launch

**Aggregating messages and activity across a person's several Pages.** Raised by the PM on 2026-09-07 alongside the many-Pages ruling and deliberately not scoped.

**It becomes real the moment anyone holds two Pages**, which under this scenario is the ordinary case rather than the exception — so it is not a distant problem, it is a near one. A person with a business Page and a run club will have two inboxes, two activity streams and no single place that answers *what happened today*. **Recorded now so that when it surfaces it reads as an anticipated consequence rather than a surprise.**

**Not scoped into launch.** No messaging surface exists yet, which is the only reason this is not already a defect.

