---
id: why-people-first
purpose: The schema-level encoding of "platform serves people" — no impersonal Business entity, no ranking of people, no pay-for-visibility, no engagement-optimized feed.
layer: why
status: active
owns:
  - personal-vs-impersonal-business-distinction
---

# The People-First Principle

> Companion to [`principles.md`](principles.md). The constitution states the principle as one clause: *"Business serves the people who do the work — not shareholders at their detriment."* This doc carries the full corollaries — the schema-level encoding, the test, the rule-ins and rule-outs, and how the principle extends through the relational layer.

---

## The Distinction

This platform is about people connecting. It is not about businesses.

We are not anti-business. A person who makes sourdough and sells it to neighbors is running a business, and we want that business to thrive. A person who runs a hardware store, hosts a guest cottage, plumbs houses, or teaches piano is running a business. We celebrate every one of them. Size is not the issue. **Personality is.**

A business that remains personal — owned, operated, and accountable to a real human or a small group of humans whose names appear on it — is something we treat as a person doing work. A business that has been abstracted away from the people who do the work — a corporate shell, a private-equity rollup, a franchise where the operator has no say — is a different kind of thing entirely. We do not pretend it is the same.

The data model encodes this distinction directly. **There is no impersonal Business entity in our schema** — no business on its own without a person, no business without human social capital behind it. A Person makes Items. An Item has a label the Person chooses to put on it ("Oak Park Sourdough," "Curtis Park Candles," "Folsom Plumbing"). The label is a display field on the Items, not a separate record that owns them. When a cooperative emerges, the cooperative is a `kind='business'` Group with multiple owner-role memberships, anchored to a Location, with Items declared by individual Members operating under the Group's branding — still no shell entity between Persons and the work.

> **Intent.** The end goal is *personal*. Personal businesses are welcome — what the schema refuses is the *impersonal* business shape, because impersonality is the extractive vector (the corporate-shell that hides the human, the rollup that strips operator discretion, the franchise where the operator has no say). A Business row would be the attachment point that lets impersonality re-enter; without the row, every commercial activity has to surface through a Member or through a `kind='business'` Group whose owners are named Members. Future "shouldn't we just add a businesses table" proposals should be read as "let's add a place for impersonal commerce to land," and refused on those terms.
>
> **Tied to Member-anchored social capital.** Per the framework codified in [`../systems/groups.md`](../systems/groups.md), social capital is anchored on the Member primitive — every business is, structurally, the social capital of the human(s) behind it. A "business" without human social capital is a corporate shell; the schema's refusal of the Business entity is the schema's refusal of corporate shells. The two commitments are the same commitment seen from two angles.

---

## The Question Business Groups Exist to Answer

> **Is this local to my community? Does this entity support my community? Should I support it?**

This is the question every Member is implicitly asking when they encounter a business on the platform. It is the question business Groups exist to surface an answer to. Every capability surrounding business Groups — locality-promotion, producer-bulletin, business-jurisdiction verification, accumulated social capital, peer recommendations — is in service of helping Members answer this three-part question. Not in service of helping the business be findable, rank higher, or grow.

The corollary is the test: any feature surrounding business Groups that does not help Members answer "is this local / does it support my community / should I support it" is *extra* — a candidate for refusal regardless of how clever or useful-looking it is. When proposing a new capability, name the way it advances the three-part question. If you cannot, the proposal does not earn its slot.

This is the load-bearing purpose, the load-bearing test, and the load-bearing reason the platform refuses corporate shells: Members cannot reliably answer the three-part question against a corporate shell, because there is no *whom* to evaluate. Personal businesses make the question answerable; impersonal businesses make it impossible.

---

## Why This Matters

**Business serves people, not the other way around.** Every directory we are competing with — Yelp, Angi, Google Business, Facebook Pages — models the business as the primary entity and demotes the human to an attribute. The result is predictable: the platform serves the business that pays the most, the human doing the work becomes invisible behind a corporate listing, and the relationship between buyer and maker degrades into a transaction with a brand. This pattern is the structural reason local commerce feels hollow online. We are not going to reproduce it.

**Personal scales.** A baker who grows from one oven to a small bakery to a cooperative bakery is still a person — or a small group of people — doing work. The platform should make that growth visible (followers, repeat customers, market history) without requiring the baker to convert into a Brand. The same Item primitive that holds the first loaf of sourdough holds the hundredth, and the same Member primitive holds the baker through every stage. Size changes the metadata, not the kind.

**Personal is what fails when extracted.** When a beloved local business gets bought by a national chain, what is lost is not the building or the recipe — it is the personal accountability, the discretion, the ability of the Person doing the work to make a judgment call. Our refusal to model a Business entity is structural insurance against the moment a community-owned thing pretends to still be community-owned after the people are gone. If the Person is gone, the Items lose their author. The platform notices.

---

## What This Rules In

- A maker selling at three markets is a Member with Items attached to three Locations. Personal.
- A cooperative bakery is a `kind='business'` Group with multiple owner-role memberships, anchored to a Location, with Items declared by individual Members under the Group's branding. Personal.
- A national B Corp with a local outlet, where the local outlet has discretion and a named operator, can be modeled as a Member running an Item-of-kind=service. Personal at the Item level.
- A family-owned hardware store with three generations of owners is a Member (or a succession of Members) with Items. Personal.

## What This Rules Out

- A franchise where the operator has no say in pricing, hours, or product is not personal. It does not get a Member treatment; if it is listed at all, it is a label on someone else's Items.
- A private-equity-owned operator pretending to be local is not personal. We do not provide a profile shape that lets it perform locality.
- A "business listing" that has no named human accountable for it is not personal. If no Member's name is on it, it does not exist on this platform.

---

## The Corollaries

This principle is what makes the rest of the architecture make sense.

**No ranking of people. We review treatment, not the person.** When a Member offers a good, service, gathering, or any public-facing thing, the public can convey their experiences with how they were treated. Reviews surface as treatment patterns and structured reports against the four pillars — Customers / Employees / Community / Planet — never as a single star score, never as a leaderboard, never as a price-of-being-found column. The point is peer pressure for good behavior: reward Members who treat others well; surface (without amplifying meanness) the patterns when they don't. Producer-review surfaces are designed in [`../systems/member.md`](../systems/member.md).

> **Intent.** Star ratings as a *ranking surface for people* are the Yelp / Angi failure mode — the column becomes the price-of-being-found column, and the platform's incentives flip to selling visibility to the rated. The platform refuses the *ranking* shape, not the *review* shape. Reviews of how publicly-offering Members treat others are exactly the peer-pressure mechanism the platform wants — they reward good behavior and identify mistreatment without making a leaderboard. Future proposals should be read against the distinction: "compare two sellers head-to-head on a number" is the refusal; "let neighbors share how they were treated" is the design intent.

**Social capital rewards being personal and helpful.** Members who help, host, gather, mentor, and steward accumulate visible standing — not as a number on a public leaderboard, but as a record the Member can point to and that the platform can recognize when standing-tier surfaces unlock (per [`../systems/agent-assistance.md`](../systems/agent-assistance.md) and the social-capital design in [`../systems/member.md`](../systems/member.md)).

> **Intent.** Reviews surface mistreatment; social capital surfaces good treatment. The two together are the platform's peer-pressure mechanism for good behavior. Without the positive pole, the system becomes a complaint surface (Yelp's failure mode); without the negative pole, the system has no accountability. Both, paired, are how the platform encourages the relational behaviors that make community work and discourages meanness without becoming punitive.

**No pay-for-visibility.** A person should not have to pay to be findable in their own community. We do not sell discovery to producers. Revenue flows from buyers, sponsors, and federation partners (see [`monetization.md`](monetization.md)).

**No engagement-optimized feed.** People do not need an algorithm to want to find each other. The locality-first index is enough. Engagement optimization is what consumes humans for advertiser revenue; we are doing the opposite.

**Federation, not consolidation.** When deeper infrastructure is needed (banking, insurance, intelligence), it spawns into separate dedicated platforms (per Loop 13 in [`../needs/member-journey.md`](../needs/member-journey.md)). The platform stays small enough to remain accountable to the people on it.

---

## Groups, Too, Are People-First

The same principle holds at the relational layer. A Group is people deciding they are an intentional unit — never a polygon, never a postal code, never an algorithm grouping accounts that look similar to each other. Groups cannot be auto-assigned by geography. They cannot be owned by a corporate entity. They cannot be created and populated by the platform on behalf of users it suspects share an interest. They are started, joined, stewarded, and dissolved by Members, and by Members alone.

A Group without Members ceases to exist. That asymmetry — Members can dissolve a Group; a Group cannot dissolve a Member — is the structural posture that extends people-first all the way down through the relational layer. Membership is a relationship Members enter into; it is never a status the platform imposes for living somewhere or following someone. Soft affiliations the platform infers (a follow, an RSVP) surface as suggestions; they never become memberships without an explicit choice.

The Drake's Run Club captures the principle in miniature: the Gathering works without a Group. The Group comes into being only if the regulars decide they want to be a "we." If they never do, the Gathering keeps running and nothing is missing. People-first means the platform earns Group membership by being worth choosing — never by inferring you must already belong.

---

## Closing

The data model is a values statement. People declare things. Things attach to places. Other people respond. That is the whole grammar, and the absence of a Business entity in the middle is what keeps the grammar honest.

Every PR, every scenario, every system spec must hold up against this principle. If a feature requires the platform to treat a business as more important than the people who do its work, the feature is wrong, regardless of how clean the implementation looks.

**Buy close. Build community. Build the future together.** And keep the people — every Person, every Member — at the center of the schema.
