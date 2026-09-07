---
purpose: Scenario — one producer entry point. /you/sell forks into /you/create, which asks what someone is starting rather than assuming they are opening a shop. Hosting requires no business Group and no shop.
layer: how
status: next
---

# F060: Someone starts something without opening a shop

**Bundle:** launch ([`../now/initiative-launch.md`](../now/initiative-launch.md)) — track A
**Loops:** 1 (Gather), 2 (Declare something), 7 (Make and be found)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services), and the run-club case it does not cover
**Primitive shape:** Person → Group (any kind) → Item. **No new entity, no new table, no new kind value.**
**Spec contract:** [`groups.md`](../../product/systems/groups.md) § Standing tier + § Casual vs ongoing commercial · [`role-language.md`](../../product/foundation/role-language.md) · [`PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) § No legal or tax language reaches a person
**Depends on:** [F057](scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md) — this scenario decides where F057's create path goes; F057 must not decide it.
**Status:** next — reviewed 2026-09-07, **PROCEED with one EXTEND** ([`review-F060.md`](review-F060.md)). The EXTEND blocks only the ticket that writes a Group kind value or the spine columns.

> **This is a conformance fix, not a design change.** [`groups.md`](../../product/systems/groups.md) already states that a Member without a business Group sees the universal composer — gathering, wonder, ask, offer — and that the shop walkthrough is triggered only by the Sell verb. The build shipped the business path and never built the other one. What follows restores what the spec already says.

## The Person

**Priya convenes a run on Tuesday mornings.** Eleven people come. She has never sold anything and does not intend to. She wants the run to be findable so the twelfth person can turn up.

Today she cannot do this. The only route to the gathering composer is `/you/sell`, gated on owning an active business Group, so **to publish a run she must first open a shop.** The failure is not even a friendly wall — filing anything under a Group that is not a business throws an authorization error.

**Marcus makes hot sauce and also hosts a monthly swap.** He is one person doing two things, and the product currently makes him be two kinds of person to do them.

## The Story

**Priya taps the create control.** One question: **"What are you starting?"** Three answers — *Something I make or sell* · *Something I host* · *Both*. She picks **host**.

*"What should we call it?"* She types **Oak Park Tuesday Run**. From that moment the interface says *Oak Park Tuesday Run*, not "your Page," not "your group," not "your business." She adds where it meets and when. It is live, it has a public address, and it has her name on it.

**Nothing has asked her whether she is a business.** Nothing has asked for a ZIP code to check a locality badge she does not want, an entity type, or a state of formation. Nothing has used the word *vendor*, *seller*, or *tax*.

**Marcus picks Both.** He gets one Page carrying the hot sauce and the swap, one name, one address. He does not have two accounts and does not switch modes.

**Priya, six months later, starts selling club singlets.** That is a change to her Page, not a second identity — and it is out of scope here, flagged in `groups.md` as the community-to-commercial transition. **What this scenario must not do is make that transition impossible by construction.**

## Surfaces

- **`/you/sell` becomes `/you/create`.** Not a rename — a fork. `/you/sell` redirects.
- **`/you/create`** is the single producer entry point: the three-way question, then naming, then the existing composers.
- **The create affordance** in the nav and **the invitation on `/you`** both point here. F057 renders the control; this scenario owns its destination.
- **The recruitment invitation** gains a hosting lane and a service lane alongside the making lanes.
- **`/join`** stops being vendor recruitment and becomes what the product is.

## Data captured

**No new table, no new column on a new entity, no new kind value, no new event type.** The branch answer maps onto Group kinds that already exist:

| Answer | `groups.kind` | Why |
|---|---|---|
| Something I make or sell | `business` | Carries the brand label, the shop page, and the locality badge. The word *business* never appears in the UI. |
| Something I host | `interest` | Neutral, already in the enum, already handled by the non-business activation path. Not `event_anchored` — that kind is for a Group seeded by a specific gathering, which is a different origin story. |
| Both | `business` | A business-kind Page can host once the item-create clause is dropped. One Page, both verbs. |

**Three columns move.** `tagline`, `image_url` and the free-text `where_next` line were scoped onto `group_businesses`. **They move to the `groups` spine** so a run club can have a picture and a one-liner too. The shop-editor ticket's migration is unwritten, so this is a redirection, not rework — and it stops being free the moment that migration lands.

## What actually blocks this today — four branches, one of them the wall

Verified in code and against the production database, 2026-09-07.

1. **The wall: `item.create` requires the filing Group to be a business.** One clause — `and g.kind = 'business'` — inside the owner-authorization query. A gathering cannot be filed under a run club at all. **Delete the kind condition; keep the ownership condition.**
2. **A non-business Group has no public page.** The group-page resolver filters to `kind='business'`, so a run club 404s. Generalize it; render the business-specific fields when present.
3. **Products and services filed under a non-business Group 404** for the same reason, in their own resolvers. Gatherings already resolve correctly — that fix landed with the canonical-URL work and is the pattern to copy.
4. **The standing badge asks non-business Groups for a `steward` role, and group creation assigns founders `owner`.** So a run club founder silently gets no badge. Amend the view to accept `owner` on non-business Groups.

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

### One person, two verbs, one Page

**Given** a Member who chose *Both*
**When** they add a product and host a gathering
**Then** both are filed under the same Page and appear on the same public address, with no mode switch and no second account. _Why: the hypothesis is that the same person does both. If the product needs two containers for that, it has conceded the two-class model in the schema._

### The invitation names hosting as a first-class way in

**Given** the pre-producer invitation on `/you`
**When** it renders
**Then** its lanes include hosting and services alongside making, and at least one worked example is a gathering. _Why: the shipped grid is ten selling categories hardcoded to one metro. A person who convenes rather than sells sees nothing that looks like them, which is the positioning defect in one component._

### The old route does not strand anyone

**Given** any inbound link to `/you/sell`
**When** it is followed
**Then** it redirects to `/you/create`, preserving any query string. _Why: it is the destination of the shipped sell CTA and of `/join`; removing it without a redirect leaves a live route unreachable._

## Scope boundary

**In:** the fork and the three-way question, the four code branches above, the three columns moving to the Group spine, the recruitment lanes, `/join`'s rewrite, the redirect.

**Out:** the community-to-commercial transition (a Page changing kind — flagged in `groups.md`, not designed); Group kinds beyond `business` and `interest` at the create surface; the values declaration (cut); the shop editor itself (its own scenario); the Explore-into-Home merge; anything that would rename a table.

**Explicitly not decided here:** what the nav's create affordance looks like. This scenario owns where it goes, not what it is.
