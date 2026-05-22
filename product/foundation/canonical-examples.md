# Canonical Examples

**Status:** Foundational reference. The working set of real-world situations the platform exists to serve. Read alongside [`loops.md`](loops.md), [`primitives.md`](primitives.md), and [`principles.md`](principles.md). Replaces the prior `founding-scenarios.md` and `mission.md`, both of which predated the loops/primitives reframe.

## What this is

A list of concrete, mostly real situations — drawn from West Sacramento, East Sacramento, and the surrounding region — that the platform is being built to dissolve. Each example names a real friction, the loop(s) it exercises, and the primitive shape it takes in the data model. Together they are the canon: if a feature does not make at least one of these situations meaningfully better, it does not belong in the build.

These are not personas. They are test cases. The Run Club exists. Ferrari Fisheries exists. Cafe Capricho closed last month. The work is to make the next one of each go differently.

## How to use this document

- **Designing a feature?** Find the example(s) the feature would help. If you can't find one, you are designing for a hypothetical user.
- **Scoping a release?** Map the bundle's scenarios back to these examples. Every release must move at least one example meaningfully. Some releases go wide; some go deep — depth over breadth when forced to choose. A release that cannot point at one example it makes meaningfully better is the wrong release. (Revised 2026-05-18 from the earlier "at least two examples" rule, which under-rewarded depth and over-rewarded surface coverage.)
- **Triaging a backlog item?** "Which canonical example does this serve?" is a sharper version of "what loop does this serve?"
- **Stuck on a system spec?** Walk one example through the system end to end. Whatever breaks is the work.

Examples below are tagged with the loop(s) they exercise (per [`loops.md`](loops.md)) and the primitive shape they take (per [`primitives.md`](primitives.md)).

---

## 1. The Unofficial Run Club at Drake's

**Loops:** 1 (Find your people), 4 (Gather regularly)
**Primitive shape:** Person → Item(kind=gathering, recurring) → Location(Drake's, permanent)

Every Thursday evening, a group of runners meets at Drake's in West Sacramento, runs together, and stays for a beer. There is no website. There is no calendar. The way you find out about it is by being there on a Thursday and asking, or by knowing one of the regulars. There is a WhatsApp group, but you have to be invited. There is no Strava club, or there is and it doesn't update.

What the platform does: a public, locality-first page anchored at Drake's, with a recurring time and a clean URL the regulars can chalk on a board, text to a friend, or post in any group chat. A stranger searching the locality for "what's happening near Drake's this week" can find it and show up Thursday. An organizer who is currently doing the platform's work without the platform's tools gets a single shareable link that replaces the three-app sprawl.

**What's notable:** the Run Club works without a Group. It is a Gathering Item at a Location with a recurring schedule. The regulars become a Group (kind='event_anchored' or kind='interest') only if they choose to — and most of the value lands without that choice.

---

## 2. Ferrari Fisheries

**Loops:** 7 (Make and be found), 8 (Follow what you love)
**Primitive shape:** Person → Item(kind=product, irregular) → Location(boat dock or pickup point, recurring-temporary)

A fisherman with a boat catches wild fish off the California coast and sells direct. Supply is irregular — what comes in depends on the catch. He alerts customers by text when he has fish available, where he'll be, and for how long. The window is sometimes hours.

What the platform does: a Maker profile with an irregular-Item shape — a way to declare "I have salmon, today only, here, until 4pm" that pushes to followers. The Item primitive carries the same data shape as a market booth with a recurring schedule, but with a one-time event-style cadence. Following him is the standing form of the texting list — except neighbors can find him without already knowing his number.

**What's notable:** the existing tooling for this (Square, a personal text list, a Squarespace site nobody updates) optimizes for any maker except an irregular one. The platform's Item primitive treats irregular and recurring as the same kind, varying only by schedule. That is what makes Ferrari Fisheries findable in the same surface as the Saturday market.

---

## 3. The Quarterly Dip Vendor

**Loops:** 7 (Make and be found), 8 (Follow what you love)
**Primitive shape:** Person → Item(kind=product, recurring-irregular) → Location(market booth, recurring-temporary, intermittent)

A vendor who makes African-inspired dips and condiments shows up at a Sacramento farmers market sometimes — not every week, not on any schedule the market publishes, not announced on any social channel. If you discovered them once and want to find them again, you check the market each week and hope. Most of the time you miss them.

What the platform does: a Maker profile that lives at the *Maker* level, not the market level. The market lists vendors who appear there; the Maker's profile lists which markets they will be at *next*. Followers see the dip-vendor's next appearance the moment it's declared. The platform makes the vendor's intermittent presence persistent in a way the market itself cannot.

**What's notable:** the market is a Location of kind=recurring-temporary. The vendor's *appearance* at that Location is itself an Item with a date. A buyer following the Maker is following the schedule, not the booth.

---

## 4. The Food Truck Without a Calendar

**Loops:** 7 (Make and be found), 8 (Follow what you love)
**Primitive shape:** Person → Item(kind=service or product, ambulatory) → Location(area + sequence of recurring-temporary stops)

A food truck operator works the Sacramento region. He posts on Instagram occasionally, but not where he'll be next, or only after the fact. His regulars track him by stalking the truck, asking him directly, or stumbling into him. He is not lazy — he's running a business and posting events on Instagram is friction he hasn't built into his week.

What the platform does: a Maker profile where declaring "Tuesday lunch at Cesar Chavez Plaza, Wednesday dinner at Drake's parking lot" is the *core* surface, not an afterthought to a marketing post. Followers get the schedule, the platform shows it on the locality-first map, and the operator does the work he was already doing — just into a tool that compounds it.

**What's notable:** the truck is the inverse of a permanent shop. The Maker is fixed; the Location varies. The Item primitive's flexibility on schedule and Location attachment is what makes this work in the same schema as a maker with one home base.

---

## 5. Barn Movie Night at Drake's

**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly)
**Primitive shape:** Person → Item(kind=gathering, recurring) → Location(Drake's barn, permanent, sub-venue)

Drake's in West Sacramento runs a recurring barn movie night. To know about it, you have to follow Drake's on Instagram, or check Drake's website, or be on a mailing list, or have a friend who knows. To find out about *all* the events like it within ten miles — Barn Movie Night, the running club, the open-mic night at the brewery, the dance class at the community center, the kids' soccer pickup at the park — you would currently have to follow dozens of accounts, scrape dozens of websites, and remember they all exist. Most people give up.

What the platform does: the locality-first index. One page that answers "what's happening near me this week that I could just show up to," populated by gathering Items declared by Persons at Locations. Barn Movie Night is one row. The Run Club is another. The dance class is another. The newcomer who just moved to Bryte and has lost their network can find their footing without first decoding the entire Sacramento social-media graph.

**What's notable:** this is the loop where the platform's value is highest for the user with the *least* prior context — the newcomer (Loop 3). The work is reducing the discovery cost of recurring real-world life to near zero.

---

## 6. Cafe Capricho's Successor

**Loops:** 10 (Start something), 11 (Pool resources), with mentorship and economic-capacity threads
**Primitive shape:** Person → Item(kind=initiative) → Location(the closed cafe, permanent, vacant); pledges from a Group of would-be backers (kind='event_anchored' around this Initiative); mentorship relationships from Persons with relevant experience

Cafe Capricho was an East Sacramento cafe that shut down last month. The owner and her husband retired. The space is a beloved community staple — the kind of room a neighborhood organizes itself around — and now it's empty. Somewhere in Sacramento, there is at least one person who would take it over: an aspiring entrepreneur with the skills and the will, but without the capital, the mentorship, or the certainty that the community would back them. Somewhere in that same neighborhood are dozens of regulars who would back a successor — with money, with patronage commitments, with hours of help — if there were a way to do so.

Today, those two sides do not find each other. The aspiring operator doesn't know the regulars exist as backers. The regulars don't know the operator exists as a candidate. The space gets leased to a chain or sits vacant.

What the platform does: an Initiative — *"Take over Cafe Capricho. Reopen it as a neighborhood cafe under new ownership."* Encouragement signals interest. Pledges accumulate (capital, patronage commitments, hours of help, mentorship from existing operators). A linked Gathering brings the candidate, the regulars, and the experienced mentors into a room. The platform doesn't run the financing — that's where federated infrastructure (a CDFI partner, securities-compliant capital structures) eventually picks up. The platform's job is to make the *coordination* possible: surfacing that the demand is real, finding the candidate, structuring the pledges so a lender can see them.

**What's notable:** this is the loop where the platform's people-first commitment is most directly tested. The same situation modeled by every other directory — an empty commercial space — is invisible to most platforms because there is no business yet. The Initiative primitive is what lets a community organize *around an absence* rather than around an existing listing. It is also where the platform must remain disciplined about its own boundary: surfacing demand and structuring pledges, not lending money.

---

## 7. The Bumble BFF Refugees

**Loops:** 1 (Find your people) — affinity-first, gathering-second
**Primitive shape:** Person → Group(kind=interest, optional anchor Location) → Items(kind=gathering) hosted by Group members

A handful of women in Sacramento are using Bumble BFF — the friend-matching mode of the dating app — to find new friends. The mechanism is one-on-one swiping: match with a stranger, message back and forth, maybe meet for coffee, repeat. After a few rounds several of them notice the obvious — they are all looking for the same thing, they would all like each other, and the one-at-a-time format is friction. They start handing off: when two of them match, instead of starting another DM thread, they point each other to a private Facebook group they spun up for "Sacramento women looking for friends." The group becomes the actual product. The need they had was never online conversation — it was real-world coordination among an affinity set, and the dating-app's one-on-one format made that nearly impossible.

What the platform does: a Group is the native shape for what they spun up in Facebook. A Member starts *Sacramento Women Looking for Friends* — `kind=interest`, anchor Location optional, discoverability `listed`. Other Members find it through the `/g` index, through geographic suggestion when they set their home Location, and through soft-membership inference. One tap to join. Once the Group has critical mass, any Member declares a gathering Item attached to the Group — a Sunday hike, a wine night, a craft fair trip — and other members see it on the Group page and in their locality feed. The Group becomes addressable: future Wonders ("would folks be into a book club?") can scope to the group rather than the whole city.

**What's notable:** every other canonical example has a Group emerging *out of* a recurring Gathering — the Run Club regulars become a Group after months at Drake's. This is the inverse: the Group comes *first*, before any gathering exists, because the affinity is recognized before any one of them has stepped forward to host. The platform's job is to make the affinity declarable as a thing on its own — a page and a join button — so saying "we're a group" doesn't require anyone to also commit to running a Sunday meetup. Once the Group exists, gatherings emerge from inside it; the gathering is no longer a precondition for the group.

This example is also where **Groups cannot be auto-assigned** is most directly tested. The polygon "Sacramento women aged 25–40" is not this Group. The Group is the women who said *we are this group*. Geography is suggestion; the choice is theirs. (See [`groups.md`](../systems/groups.md) — emergent and optional Group formation; the platform never auto-assigns based on polygon or demographic.)

---

## Loop coverage and gaps

The seven examples above cover Loops 1, 3, 4, 7, 8, 10, 11 — with #7 exercising Loop 1 from the inverse direction (affinity-first rather than gathering-first). Example #12 (Concerts in the Park, below) is the eighth filled example and the load-bearing test case for multi-Location belonging and Location-follow surfaces. The canonical set will eventually cover 12 of the 13 loops (Loop 13, federation, is architectural and does not anchor to a single example). Slots #8–#11 below are placeholders to be filled with real situations.

### 8. [TODO: Float an idea — Loop 2]

A Wonder example. Someone in the area has been thinking about starting a Sunday coffee walk, a monthly clothing swap, a beginner pickleball morning, a fermentation skill-share — and doesn't want to commit to hosting before they know there is interest. Fill with a real instance.

### 9. [TODO: Share / Ask — Loops 5 and 6, paired]

A mutual-aid example. Spans both Offer (someone has extra zucchini, a pressure washer, two hours on Saturday) and Ask (someone needs a truck, a stand mixer, help with a faucet). Treat as one example with both surfaces, because in lived experience they are one mutual-aid relationship. Open design tension: see [`exploration/reciprocity-and-goodwill.md`](../exploration/reciprocity-and-goodwill.md).

### 10. [TODO: Find a local pro — Loop 9]

A trusted-tradesperson example. The plumber, vet, mechanic, hairdresser, or piano teacher whose business is mostly word-of-mouth and barely findable online. Fill with a real instance.

### 11. [TODO: Steward what we built — Loop 12]

A community-stewardship example. A garden, tool library, repair café, kitchen co-op, or shared space that is keeping itself alive on group-text-and-spreadsheets energy and would benefit from durable coordination tools. Fill with a real instance.

---

## 12. Concerts in the Park

**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly), 8 (Follow what you love)
**Primitive shape:** Person → `member_location_affinities`(kind=`follows`) → Locations(kind=permanent — parks across the Sacramento MSA) ← Items(kind=gathering, recurring, category=concert) ← Persons(hosts)

A Member loves outdoor live music in the summer. Across the Sacramento MSA, a dozen public parks host concert series — Capitol Mall on Friday evenings, Cesar Chavez Plaza summer noon series, Land Park's amphitheater, William Land Park, McKinley Park rose garden, Old Sacramento waterfront, Davis's Central Park, Folsom's Plaza Park, Roseville's Civic Center plaza. Each series is run by a different host (city Parks & Rec, a nonprofit, a local rotary, a small promoter), publishes on a different website (or Facebook page, or Instagram, or paper flyer), and surfaces in no shared place. Today, the Member learns about most of these by accident — a friend's text, a neighbor's mention, a sign they pass on a walk. They miss most of them.

What the platform does:

1. The Member follows the Locations they care about. Capitol Mall, Cesar Chavez Plaza, Land Park, William Land Park — six Locations, each followed via a `member_location_affinities` row of `affinity_kind='follows'`. The follow surface is one tap from the Location page.
2. Each park's concert series exists as recurring gathering Items (per the gathering composer per `item.md`), attached to that Location via `item_locations`. Hosts post once; the Item carries the date, the band, the cost (free), what to bring.
3. The Member's feed surfaces Items as they get attached to followed Locations — "Friday Concert Series at Capitol Mall: Junior Brown, 6pm, free." Combined with the Member's `member_interests` taste profile (`live-music`, `outdoor`, `summer-evenings`), the platform can compose a saved-search feed: *"outdoor live-music gatherings at Locations I follow in the Sacramento MSA."*
4. At Loop 3 entry — a newcomer who just moved to Sacramento — the locality-first index lets them search "concerts" or "live music" across the MSA without following anything yet. Items of kind=gathering with `category=concert` (or hashtag `#livemusic`) attached to Locations within the MSA polygon surface in one feed. The newcomer follows three parks they like, and now their Friday-evening discovery cost is near zero.

**What's notable:** this example demonstrates three platform mechanics that none of the prior examples exercise as cleanly.

- **Multi-Location belonging.** A Member is structurally allowed to follow many Locations, in many neighborhoods, in many cities — they live in West Sac, work in Folsom, play in midtown, follow parks across the whole MSA. Per `member_location_affinities`, this is the default shape, not the exception. The single `home_location_id` (per ADR-4) is the locality default; the affinities are the Member's actual map.
- **Follow-the-Location, not the host.** The Member doesn't have to track Sacramento Parks & Rec, the nonprofit running Cesar Chavez, the rotary at Folsom, or the dozen others. They follow the *places* they care about; the platform aggregates whoever is hosting whatever, there. This is the inverse of follow-the-Member from Ferrari Fisheries — the Maker is fixed, the Locations vary; here, the Locations are fixed and the hosts vary.
- **Taste profile + MSA-scope browse.** The compositional query — *outdoor live music in summer across the Sacramento MSA* — is the b2/b3 surface that the b1 substrate makes possible. `member_interests` carries the taste tags; `member_location_affinities` carries the Location follows; `item_locations` joins them. At b1, the Member runs the equivalent query manually by visiting each followed Location's page; at b2, a saved-search affordance composes them into one feed; at T3, a natural-language equivalent ("places near me with summer concerts in the park") returns the same answer.
- **Anti-Nextdoor in the affirmative.** A Member can follow Capitol Park and get a feed of *what is happening there*. They cannot get a feed of *what people are saying about there.* No Location wall, no Location DM, no Location-scoped commentary. The same surface that makes the platform useful for finding concerts is structurally incapable of becoming a complaint board. Per the messaging-scope and complaint-downvote commitments in `policy.md`.

This example also names what doesn't yet exist on the platform that the example exercises end-to-end: **Location follow as a substrate at b1 with a surface at b2** (per `member.md` / `location.md`), and the **MSA-scoped index browse** (a refinement of the locality-first index per `discovery.md` — likely a b1 capability via the city-pick polygon, since `area_kind='city'` Locations exist at b1 per `location.md`).

---

## What success looks like

Every example above ends in a recurring relationship, not a one-off transaction:

- The newcomer at Barn Movie Night becomes a regular, then a host of something themselves.
- The Run Club gains members from people who walked past Drake's, not just the ones who already knew.
- Ferrari Fisheries' followers come back when the fish do.
- The dip vendor's intermittent appearances accumulate a real customer base.
- The food truck's schedule stops being a loyalty test.
- Cafe Capricho reopens — under new ownership, with the regulars who saved it as part-owners or guaranteed customers.

The shape of victory is the same in every case: a Person, declaring a thing, at a place — and other people responding, returning, and over time taking on more of the work themselves.

**Buy close. Build community. Build the future together.**
