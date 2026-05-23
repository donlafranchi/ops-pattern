---
purpose: The three Member roles — Member, Producer, Convener — each with the types of people to design for.
layer: what
status: active
---

# People — who Movers, Makers & Shakers serves

> **Finalized 2026-05-23.** Three roles, each defined by the tools and functionality it needs. Every person on the platform is a **Member**; **Producer** and **Convener** are roles a Member takes on (role-as-verb, per [`../foundation/primitives.md`](../foundation/primitives.md)). Replaces the prior eight-persona draft — most of those "personas" were Members in a particular moment, so they collapsed in.

## How to read this

Three roles, not eight personas. A role earns its own section only by needing a distinct set of **tools and functionality**.

Under each role is a list of the **types of people** that role spans. These are not separate personas — they do not each get their own surface, metric, or design treatment. The list exists for coverage: when we design or architect a feature, we read the list and ask *"does this serve all of them?"* — so we don't quietly drop the food truck with no fixed calendar, the homebound neighbor, or the unpaid steward of a tool library. The lists are meant to grow; add a type whenever a new use case surfaces one.

The three roles map onto the platform's verb model (a Member *makes*, *services*, *convenes*, *follows*, *pledges*): **Producer** is the *makes / services* role, **Convener** is the *convenes* role, and **Member** is the base — everyone — including the *follows / pledges* support verbs.

---

## 1. Member

**Who they are:** Anyone on the platform. The base role — every Producer and every Convener is also a Member.

**What they do:** Search, browse, discover. Join Groups, attend gatherings, buy goods and services. Show support — like, follow, share, pledge, convey interest and gratitude. Ask for help and offer it.

**What they need:** The lightest tool set — discovery and search, a profile, joining and following, purchase and pledge, and the support affordances. A Member should get real value without ever creating anything.

**Types of Member to design for:**

- The **newcomer** — recently moved, returned, retired, or newly single; no local network yet. Same needs as any Member, just starting from zero connections.
- The **long-settled neighbor** — lives here, participates casually, shows up, helps when asked.
- The **follower** — has chosen specific Producers or Conveners and wants their updates.
- The **supporter / backer** — pledges money, time, or patronage, sometimes to something that doesn't exist yet (a successor for a closed café).
- The **affinity-seeker** — looking for their people by shared interest or life stage (new parents, a sober community, a hobby).
- The **idea-floater** — has an idea and wants to test interest before committing to host or build it.
- The **help-seeker** — needs something specific: a truck for an hour, a tool, a hand moving, a trusted referral.
- The **giver** — has spare capacity to share: extra produce, an idle tool, a couple of free hours.
- The **service-seeker** — looking to hire a local pro and wants better signal than Yelp or Angi.
- The **event-goer** — comes to gatherings, markets, and concerts; may never post anything.
- The **browser / lurker** — reads and watches, low participation, still counts and still served.
- Less obvious: the **homebound or limited-mobility** Member, the **caregiver** acting on someone else's behalf, the **anonymous guest** browsing before signing up, the **young Member** (age-appropriate surfaces).

---

## 2. Producer

**Who they are:** A Member who offers goods or services. The role runs along a spectrum — a full professional operation at one end, a casual maker or informal teacher in the middle, an unpaid steward at the other. UI labels vary (Seller, Producer, Maker) per the naming conventions in [`../../CLAUDE.md`](../../CLAUDE.md); the role is one role.

**What they do:** Declare and run goods or services. Build an audience, keep followers informed, take orders, get paid — when paid at all.

**What they need:** Listing tools for goods and services, orders and payments, follower and bulletin tools, the Growth dashboard (per [`../systems/producer-tools.md`](../systems/producer-tools.md)). The informal and unpaid end of the spectrum needs a lighter subset of the *same* tools — never a different system.

**Types of Producer to design for:**

Goods:

- The **farmer, grower, or rancher**.
- The **fisher** — irregular, weather-dependent supply.
- The **baker, cook, or food maker** — including the packaged-goods maker (preserves, condiments).
- The **food truck operator** — mobile, no fixed calendar or location.
- The **craftsperson / artisan** — ceramics, woodwork, textiles.

Services:

- The **trades pro** — plumber, electrician, mechanic, handyman — offering services across an area.
- The **professional-service provider** — vet, accountant, hairdresser, music teacher.
- The **care provider** — childcare, pet care, eldercare.
- The **repair / fix-it service**.

Informal and unpaid:

- The **informal maker** — sells crafts casually; not a registered business.
- The **informal teacher** — runs a casual class: a fermentation skill-share, a beginner pickleball morning.
- The **steward** — runs a community resource (tool library, seed library, repair café, community fridge). The unpaid version of a Producer: producer-shaped tools, minus the commerce. See [`../systems/stewardships.md`](../systems/stewardships.md).

Cutting across all of the above:

- The **intermittent / seasonal** Producer — irregular output, no published schedule.
- The **home-based** Producer with no storefront.
- The **multi-location** Producer.
- The **partnership / co-owned** operation — more than one owner.

---

## 3. Convener

**Who they are:** A Member who creates and runs a Group around a shared interest. The *convenes* verb made into a role.

**What they do:** Form a Group, gather people, schedule recurring gatherings, keep the group informed and coordinated.

**What they need:** Group-creation and group-management tools — schedule recurring gatherings, manage membership, broadcast to the Group. Coordination tools, not selling tools. A Convener who also sells is wearing the Producer role too.

**Types of Convener to design for:**

- The **sports / fitness organizer** — a run club, pickup basketball, a cycling group.
- The **faith or practice leader** — a congregation, a meditation circle, a study group.
- The **hobby / interest group organizer** — book club, board games, gardening, photography.
- The **recurring social host** — movie night, potluck, dinner club.
- The **life-stage or support group organizer** — a new-parents group, a newcomers' club, a seniors' daytime group, a recovery circle.
- The **civic or cause organizer** — a neighborhood cleanup, a mutual-aid group.
- The **event-series runner** — a concert series, a seasonal festival.
- Less obvious: the **one-off event host** with no standing Group, and the **Convener who is also a Producer** (a baker who runs a sourdough club).

---

## Notes

- **The lists are living.** Add a type the moment a real use case surfaces one the design would otherwise miss. The point is coverage, not taxonomy.
- **Types are not personas.** They do not each get a doc section, a metric, or a separate surface. They are a checklist held against every feature: *does this serve all of them?*
- **Use cases live in [`use-cases.md`](use-cases.md).** A type plus a situation is a use case — "a trades pro offering services across an area," "a Member floating an idea," "a backer pledging to a successor café." Each use case anchors to one of these three roles.
- **Who the platform does not serve** — the corporate-shell franchise, the rollup-acquirer, the engagement-optimizer — is set out in [`../foundation/principles.md`](../foundation/principles.md) Part 2, not duplicated here.
