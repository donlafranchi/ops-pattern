# People First

**Status:** Foundational. The single sentence under the loops, the primitives, and every system spec. Read alongside [loops.md](loops.md) and [primitives.md](primitives.md).

## The distinction

This platform is about people connecting. It is not about businesses.

We are not anti-business. A person who makes sourdough and sells it to neighbors is running a business, and we want that business to thrive. A person who runs a hardware store, hosts a guest cottage, plumbs houses, or teaches piano is running a business. We celebrate every one of them. Size is not the issue. **Personality is.**

A business that remains personal — owned, operated, and accountable to a real human or a small group of humans whose names appear on it — is something we treat as a person doing work. A business that has been abstracted away from the people who do the work — a corporate shell, a private-equity rollup, a franchise where the operator has no say — is a different kind of thing entirely. We do not pretend it is the same.

The data model encodes this distinction directly. **There is no Business entity in our schema.** A Person makes Items. An Item has a label the Person chooses to put on it ("Oak Park Sourdough," "Curtis Park Candles," "Folsom Plumbing"). The label is a display field on the Items, not a separate record that owns them. When a cooperative emerges, the cooperative is a Community of Members operating Locations and producing Items together — still no shell entity between Persons and the work.

## Why this matters

**Business serves people, not the other way around.** Every directory we are competing with — Yelp, Angi, Google Business, Facebook Pages — models the business as the primary entity and demotes the human to an attribute. The result is predictable: the platform serves the business that pays the most, the human doing the work becomes invisible behind a corporate listing, and the relationship between buyer and maker degrades into a transaction with a brand. This pattern is the structural reason local commerce feels hollow online. We are not going to reproduce it.

**Personal scales.** A baker who grows from one oven to a small bakery to a cooperative bakery is still a person — or a small group of people — doing work. The platform should make that growth visible (followers, repeat customers, market history) without requiring the baker to convert into a Brand. The same Item primitive that holds the first loaf of sourdough holds the hundredth, and the same Member primitive holds the baker through every stage. Size changes the metadata, not the kind.

**Personal is what fails when extracted.** When a beloved local business gets bought by a national chain, what's lost isn't the building or the recipe — it's the personal accountability, the discretion, the ability of the Person doing the work to make a judgment call. Our refusal to model a Business entity is structural insurance against the moment a community-owned thing pretends to still be community-owned after the people are gone. If the Person is gone, the Items lose their author. The platform notices.

## What this rules in

- A maker selling at three markets is a Member with Items attached to three Locations. Personal.
- A cooperative bakery is a Community of Members with shared Items. Personal.
- A national B Corp with a local outlet, where the local outlet has discretion and a named operator, can be modeled as a Member running an Item-of-kind=service. Personal at the Item level.
- A family-owned hardware store with three generations of owners is a Member (or a succession of Members) with Items. Personal.

## What this rules out

- A franchise where the operator has no say in pricing, hours, or product is not personal. It does not get a Member treatment; if it is listed at all, it is a label on someone else's Items.
- A private-equity-owned operator pretending to be local is not personal. We do not provide a profile shape that lets it perform locality.
- A "business listing" that has no named human accountable for it is not personal. If no Member's name is on it, it does not exist on this platform.

## The corollaries

This principle is what makes the rest of the architecture make sense:

- **No reviews, no ratings.** Reviewing a person feels different than reviewing a business. We chose people; we don't review them. Accountability comes from structured reports against pillars (Customers / Employees / Community / Planet) that surface only as patterns, never as individual public text — never as stars.
- **No pay-for-visibility.** A person should not have to pay to be findable in their own community. We do not sell discovery to producers. Revenue flows from buyers, sponsors, and federation partners.
- **No engagement-optimized feed.** People do not need an algorithm to want to find each other. The locality-first index is enough. Engagement optimization is what consumes humans for advertiser revenue; we are doing the opposite.
- **Federation, not consolidation.** When deeper infrastructure is needed (banking, insurance, intelligence), it spawns into separate dedicated platforms (per Loop 13 in `loops.md`). The platform stays small enough to remain accountable to the people on it.

## Communities, too, are people-first

The same principle holds at the relational layer. A Community is people deciding they are a group — never a polygon, never a postal code, never an algorithm grouping accounts that look similar to each other. Communities cannot be auto-assigned by geography. They cannot be owned by a corporate entity. They cannot be created and populated by the platform on behalf of users it suspects share an interest. They are started, joined, stewarded, and dissolved by Members, and by Members alone.

A Community without Members ceases to exist. That asymmetry — Members can dissolve a Community; a Community cannot dissolve a Member — is the structural posture that extends people-first all the way down through the relational layer. Membership is a relationship Members enter into; it is never a status the platform imposes for living somewhere or following someone. Soft affiliations the platform infers (a follow, an RSVP) surface as suggestions; they never become memberships without an explicit choice.

The Drake's Run Club captures the principle in miniature: the Gathering works without a Community. The Community comes into being only if the regulars decide they want to be a "we." If they never do, the Gathering keeps running and nothing is missing. People-first means the platform earns Community membership by being worth choosing — never by inferring you must already belong.

## Closing

The data model is a values statement. People declare things. Things attach to places. Other people respond. That is the whole grammar, and the absence of a Business entity in the middle is what keeps the grammar honest.

Every PR, every scenario, every system spec must hold up against this principle. If a feature requires the platform to treat a business as more important than the people who do its work, the feature is wrong, regardless of how clean the implementation looks.

**Buy close. Build community. Build the future together.** And keep the people — every Person, every Member — at the center of the schema.
