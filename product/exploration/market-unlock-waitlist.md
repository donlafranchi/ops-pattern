---
id: what-market-unlock-waitlist
purpose: Exploration of community-earned market opening as the cold-start strategy.
layer: what
status: exploration
---

# Community-Earned Market Unlock

**Status:** Exploration. Precursor to [Rising Tide](rising-tide-civic-pride.md) — this doc covers how markets open; Rising Tide covers what happens after.

## The concept

The platform doesn't come to you. Your community earns it.

Every market starts closed. No one can browse, post, or transact until the community behind it proves — through recruitment — that there's enough of the right mix of people to sustain a living market on day one. The platform doesn't pick markets and try to seed them. Communities compete to prove demand.

This flips the cold-start problem. Instead of the platform begging for adoption in a chosen city, the platform publishes a set of thresholds and lets communities self-organize to hit them. The person who recruits the 10th producer becomes a local hero — not because the platform awarded points, but because the market opened and everyone knows who made it happen. The unlock IS the reward. No badges. No referral bonuses. No gamification layer. Just: "we did it, and now we have this."

The insight is structural: a community that can self-organize to hit a threshold is a community that will self-organize to sustain a market. The threshold is the proof. Communities that can't hit it aren't ready — and the platform doesn't waste resources trying to force something that doesn't have the energy behind it.

## The mechanic

Someone hears about the platform — word of mouth, a producer who saw it at a market, a news article, a friend's share link. They go to the site. They see a city/place search. They find their place (or nominate it if it doesn't exist yet). They sign up under one of three roles:

**Member** — "I want to discover what's local." The consumer. The person who would shop at the farmers market if they knew it existed, who would join the run club if they could find it, who would buy the hot sauce if they knew their neighbor made it.

**Producer** — "I want to sell or offer something." The maker, the grower, the service provider, the person with a skill and no audience. Maps to `items.kind` in ('product', 'service') and future kind='business' Group creation.

**Organizer** — "I want to convene people." The person who runs the run club, hosts the potluck series, coordinates the tool library, manages the market. Maps to `items.kind = 'gathering'` and future Group stewardship.

Each market has a public progress page showing signups per role and how close each role is to its threshold. The page is the recruitment tool — share it, and the bars move.

Roles are self-declared at signup. A person can hold multiple (a producer who also organizes a market is both). The role is an intent signal, not a commitment — a producer who signs up during the waitlist and never posts a product after launch is fine. The threshold measures *intent density*, not guaranteed participation.

## Threshold design

The unlock requires a balanced mix, not raw volume. A market with 500 members and zero producers is a ghost town with an audience. A market with 50 producers and zero members is a trade show with no buyers. The threshold enforces the mix that makes day one feel alive.

**Working thresholds (exploration — not decided):**

| Role | Threshold | Rationale |
|---|---|---|
| Members | 50 | Enough browsers to make producers feel discovered. Not so many that the empty-shelf problem surfaces. |
| Producers | 10 | Enough variety that a member browsing sees range. A market with 10 stalls feels like a market. |
| Organizers | 3 | The critical piece. Three organizers means at least one person recruited two others who want to convene. That's a network, not a solo act. |

**Why organizers are the bottleneck.** Members are easy — everyone wants to discover local stuff. Producers have built-in motivation — they want customers. Organizers are the scarce resource. Someone who signs up as an organizer is saying "I will do the work of bringing people together." Requiring three means the community has at least a small nucleus of people willing to do that work. If a market can't find three organizers, it's not ready.

**Tradeoffs on threshold height:**

Too high → markets never unlock. The waitlist becomes a graveyard. Energy dies. People who signed up early feel abandoned. The platform gets a reputation for vaporware.

Too low → markets open with too little activity. Day-one experience is empty shelves. Members bounce. Producers get zero engagement. The "launched" market is worse than the waitlist because now it's not aspirational — it's just dead.

**The Goldilocks test:** Can the threshold be hit by one determined champion in 2-3 months of casual effort? If yes, it's in the right range. If it requires a full-time campaign, it's too high. If it's hittable by accident, it's too low.

**Should thresholds vary by market size?**

Probably not at launch. Arguments for variable thresholds (a city of 2M should need more than a city of 50K) are theoretically sound but operationally complex — you need population data, you need to define the place boundary, and you create a legibility problem ("why does Sacramento need 100 members but Davis only needs 30?"). Fixed thresholds are simpler, more legible, and the variation in difficulty is already baked in: hitting 50 members in a college town of 70K is trivially easy; hitting 50 in a rural county of 8K is a genuine achievement. The threshold is the same; the difficulty is geographic.

**Possible future adjustment:** If the platform sees that large metros unlock instantly (no recruitment energy, no champion emergence) while small towns stall forever, consider a two-tier threshold — metro vs. non-metro. But start uniform.

## The landing page

The pre-launch market page is the entire surface. It needs to do four things: explain the concept, capture signups, show progress, and recruit more signups.

**Structure:**

1. **Place header.** City/neighborhood name, maybe a photo. "Sacramento is X% of the way to unlocking." Human, not corporate.

2. **The pitch.** Two sentences max. "This platform opens when your community earns it. Sign up, recruit your neighbors, and unlock local discovery for [Place]." No feature tour. No screenshots. The product doesn't exist yet for this market — don't pretend it does.

3. **Role-tagged signup.** Three buttons or cards: "I want to discover" / "I want to sell or offer" / "I want to convene." Each captures: name, email, role, optional "what I'd offer" freetext for producers/organizers. Minimal friction. No account creation — this is email capture with intent tagging.

4. **Progress display.** Three progress bars, one per role. "23 of 50 members · 6 of 10 producers · 1 of 3 organizers." Real numbers, not percentages. Percentages hide scale; raw counts make the gap tangible. "We need 4 more producers" is a call to action. "We're at 60%" is not.

5. **Who's already here (optional).** First names and role only. "Maya — Producer · Brian — Organizer · 21 others." Social proof without privacy exposure. No last names, no photos, no links. The point is "you're not alone" — not a directory.

6. **Share mechanic.** A "Help unlock [Place]" button that generates a shareable link. The link lands on this same page. See referral mechanics below.

**Standalone or part of the main app?**

Standalone. The main app has authenticated surfaces, navigation, maps — none of which mean anything for a closed market. The waitlist page is a single-purpose conversion surface. Build it as a static page with a form endpoint and a progress query. It can live at the same domain (`/p/[place-slug]` renders the waitlist page when the market is closed, the live market page when it's open) but the implementation is separate from the app shell.

**MVP scope:** This could be a single Next.js page, a `waitlist_signups` table (email, name, place_id, role, referrer_id, created_at), and a count query. No auth, no accounts, no map. Extremely small surface.

## Champion emergence

The people who recruit others to hit the threshold are the platform's champions. The platform doesn't need to find them, vet them, or pay them. They self-identify through action.

The person who shares the link 40 times and gets 15 signups is the champion. The person who walks booth-to-booth at the farmers market getting producers to sign up is the champion. The person who posts in the neighborhood Facebook group is the champion. You don't need to know who they are in advance — the referral data tells you after the fact.

**Recognition without gamification:**

"Founding Member" label — everyone who signed up before unlock gets it. It's a timestamp fact, not an achievement. Permanent, visible on their profile once the market opens. "Joined before launch" is a statement of history, not a reward.

**Early access window** — founding members get 48-72 hours before the market goes public to set up their profiles, post their first items, create their Groups, and populate the market. When the public sees the market for the first time, it's not empty — the founding cohort already made it look alive. This is the real reward: a head start, not a badge.

**Invitation to shape** — the founding organizers (all 3+) get an email: "You helped unlock [Place]. Want to help shape how this community starts? Here are the first decisions to make." This could be as simple as "what should the first community gathering be?" The organizers who did the work get first say — not permanent authority, just first-mover advantage on the community's initial shape.

**What this is NOT:** a "Champion Program." No applications. No tiers. No special permissions beyond the early access window. No ongoing recognition beyond the founding label. The champion's reward is that the market opened and they're known by their neighbors as the person who made it happen. That's enough.

## Referral mechanics

Each signup generates a unique share link. The link is not a "referral code" — it's a URL that, when someone else signs up through it, records the connection. The platform can see who drove signups. The person who signed up can see how many people they brought (optionally — this could be shown or hidden).

**Why unique links matter:** Champion emergence depends on knowing who recruited whom. Without attribution, the platform can't identify its champions after the fact. The link is the minimum viable attribution mechanism.

**No rewards for referrals.** The link is not a referral code in the Uber/Dropbox sense. There is no "invite 5 friends and unlock your account." There is no individual benefit to referring. The benefit is collective: every referral moves the progress bar. The incentive is the unlock itself.

**Role-specific invite links?** Maybe. "Invite a producer" vs. "Invite a member" could pre-fill the role selection and make the pitch specific: "Know someone who sells homemade hot sauce? Get them on here." But this adds complexity to the share flow. Start with a single link; the signup page handles role selection.

**Privacy:** The referral graph is internal. No one sees "Maya recruited 15 people" on a public surface. The platform uses it for champion identification and outreach; it doesn't publish it. If the platform ever surfaces recruitment attribution, it should be opt-in ("Maya helped bring 15 founding members to Oak Park" — only if Maya consents to that being visible).

## New entrant value prop

The platform's value isn't just for established producers. It's for the person who WOULD start selling if they had a way to get discovered.

The hot sauce maker in a saturated market. The person who bakes incredible bread but only sells to friends. The woodworker who does it on weekends and doesn't know if anyone would pay. The person who just moved and has a skill but no network.

These people don't need another marketplace — they need a *local* audience. Etsy has 7 million sellers; their hot sauce disappears on page 400. Instagram requires content creation skills they don't have. The farmers market has a 2-year waitlist. Every existing channel either demands scale, demands content production, or demands physical access they can't get.

**How the waitlist captures this:**

The "I want to sell or offer" signup includes an optional freetext: "What would you offer?" This does two things. First, it gives the platform signal about what the market will look like on day one (10 producers who all sell honey is different from 10 who sell different things). Second, it gives the aspiring producer a low-stakes way to declare intent. Writing "homemade hot sauce" in a form field is the lowest possible activation energy for saying "I'm a producer." It's lower than creating a listing, lower than setting up a booth, lower than posting on Instagram. It's a whisper of intent, and the platform captures it.

**The day-one pitch to new entrants:** "You don't need to be established. You don't need a following. You need 49 neighbors who want to discover what's local, and 9 other people like you. Sign up. The platform opens when your community is ready — and on day one, you're already in the directory."

**The structural advantage:** In a market with 10 producers, every producer is visible. There's no algorithm to game, no paid placement to compete against, no review history to overcome. The new entrant and the established producer start on equal footing. That equality is temporary — as the market grows, discovery dynamics shift — but the waitlist guarantees it at launch.

## Market opening sequence

Thresholds hit. Now what?

**T+0: Threshold crossed.** The system detects the threshold is met. No immediate public action. Internal notification to the platform team. Verification pass: are the signups real? (Basic: email confirmation, duplicate detection, bot filtering. Not extensive — trust but verify.)

**T+1-2 days: Founding member notification.** Every waitlist signup gets an email: "[Place] just unlocked. You're a founding member. Set up starts [date]." The email includes account creation instructions (the waitlist was email-only; now they need real accounts).

**T+3-5 days: Early access window.** Founding members can access the market. Producers set up their profiles and post items. Organizers create Groups and schedule gatherings. Members browse, follow, save. The market populates before anyone outside the founding cohort sees it.

**T+5-7 days: Public launch.** The market page flips from waitlist to live. Anyone can now sign up and browse. The market already has content — producers listed, gatherings scheduled, Groups formed. Day one for the public is not day one for the community. That's the point.

**Optional: Launch gathering.** The founding organizers could host a launch event — a meetup, a market day, a "come meet your neighbors" gathering posted as the first Event on the platform. The platform suggests it; the organizers decide. No platform-imposed launch ceremony.

**The choreography matters because:** the single worst thing that can happen is a public launch to an empty market. The early access window exists entirely to prevent that. The founding cohort's 48-72 hours of setup time is the difference between "wow, look at all this" and "there's nothing here."

## Connection to Rising Tide

The market unlock is the origin story. Rising Tide is the next chapter.

The unlock thresholds become the baseline. "We started with 50 members and 10 producers — look where we are now." The energy that drove recruitment during the waitlist — civic pride, the desire to prove your community has what it takes — is the same energy Rising Tide channels into ongoing vitality. The transition is natural: people who recruited their neighbors to unlock the market are the same people who will care that the market is thriving.

**Specific handoffs:**

The waitlist progress bars become the Rising Tide vitality indicators. "50 members" becomes "Active members this month." "10 producers" becomes "Active producers." The visual language carries over — the same place page, the same progress metaphor, now measuring ongoing health instead of pre-launch recruitment.

The founding member cohort becomes the first data point for every Rising Tide metric. Newcomer landing rate starts measuring from the moment the market opens. Group formation rate starts from zero. The waitlist gave the market its initial population; Rising Tide measures what that population does.

The champion who recruited 15 people during the waitlist is the same person who will notice when the market stalls and do something about it. The platform doesn't need to find that person — the waitlist already found them.

## Anti-patterns

**No MLM mechanics.** "Recruit 5 friends to unlock YOUR account" is multi-level marketing. The unlock is community-level. Maya's account doesn't open because Maya recruited people — the market opens because the community collectively hit the threshold. No individual unlock tied to individual recruitment.

**No artificial scarcity.** The thresholds are real minimums for a functional market. They are not fake bottlenecks designed to manufacture urgency. If the platform could serve a market with 20 members and 5 producers, the threshold should be 20 and 5 — not 50 and 10 with a "limited spots" wrapper.

**No fake progress.** The progress bars show real signups. No inflating numbers, no "we're almost there!" when the market is at 12%. No phantom signups. No rounding up. If the market has 7 of 50 members, it says 7 of 50.

**No paying to skip.** A city can't pay to bypass the threshold. A business can't sponsor an early unlock. The threshold is proof of community energy, and money can't substitute for that. (A business could theoretically pay 50 people to sign up — but those people still signed up, and if they never return after launch, the market will stall on its own. The threshold is necessary, not sufficient.)

**No urgency theater.** No countdown timers. No "only 3 spots left." No "this offer expires." The waitlist is patient. Markets unlock when they're ready. The timeline is the community's, not the platform's.

**No public recruitment leaderboards.** "Top recruiters in Sacramento" is gamification. The referral data stays internal. If champions want to be known, they'll be known by their neighbors — the platform doesn't publish a ranking.

**No geographic lock-in.** A person who signs up for Sacramento's waitlist can also sign up for Davis's. A person who signs up as a member in one market and a producer in another is fine. Markets are independent; participation is not zero-sum.

## Tier mapping

This is probably pre-b1 or a parallel track. The surface is small.

**The build:**

| Component | What | Complexity |
|---|---|---|
| Landing page | Static-ish Next.js page at `/p/[place-slug]` that renders waitlist when market is closed | Low |
| Signup form | Email, name, role(s), optional freetext, place_id, referrer_id | Low |
| `waitlist_signups` table | email, name, place_id, roles (text[]), referrer_signup_id, freetext, created_at, confirmed_at | Low |
| Email confirmation | Standard double-opt-in to filter bots | Low |
| Progress query | `SELECT role, count(*) FROM waitlist_signups WHERE place_id = $1 AND confirmed_at IS NOT NULL GROUP BY role` | Trivial |
| Threshold check | Cron or trigger that fires when all three role counts exceed thresholds for a place | Low |
| Share link | Signup ID or short token appended to the place URL as a query param | Low |
| Admin notification | Email to platform team when a market crosses threshold | Low |
| Founding member email | Triggered email sequence: "you unlocked it" → "set up your account" → "early access starts" | Medium |

**What this does NOT require:** Authentication. Maps. Real-time anything. The Item schema. The Group schema. The Member schema (waitlist signups convert to Members at market open — migration script). This can ship before the main app is ready, or alongside it.

**Estimated scope:** One developer, one week for the MVP (landing page + form + table + progress display + share link). Add another week for the email sequence and founding-member conversion flow. This is small enough to be a side project.

## The Sacramento question

The founder lives in Sacramento. Sacramento locals have a cultural habit of not respecting things that originate locally — "if it's from Sac, it must not be that good." (This is a real and widely acknowledged dynamic in the Sacramento region.)

**Options:**

**Option A: Sacramento is on the waitlist like everyone else.** Treat it identically. If Sacramento hits the threshold, it opens. No special treatment. The risk: Sacramento might unlock first because the founder's network is there, and the first market being the founder's hometown looks like favoritism, not organic demand. The benefit: Sacramento IS the founder's community, and the platform exists to serve communities. Excluding it is perverse.

**Option B: Sacramento is the silent test market.** Open Sacramento without the waitlist mechanic — it's the alpha/beta test market. The founder and a small cohort use it to validate the product. Other markets use the waitlist. Sacramento never appears on any public "first markets" list. The risk: the Sacramento community doesn't get the waitlist energy — no recruitment drive, no founding-member cohort, no civic pride origin story. It's just... there. The benefit: the founder can iterate on the product with real users before the waitlist mechanic matters.

**Option C: Sacramento opens via waitlist, but isn't the first.** The founder seeds 2-3 other markets first (the Rising Tide doc mentions Madison WI, Boise ID, Savannah GA). Those markets prove the mechanic. Sacramento goes on the waitlist after the pattern is established. When Sacramento unlocks, it's one of many — not the first. The risk: the founder's own community waits, which feels wrong. The benefit: credibility. "It works in Madison and Boise, and now it's here" is a stronger pitch than "I built this and launched it in my own city."

**Option D: Hybrid.** Sacramento is the internal dogfood market (Option B). The waitlist launches for external markets (Madison, Boise, Savannah). When the product is validated and the waitlist mechanic is proven, Sacramento re-launches with the waitlist experience — or gets folded into the live platform with a founding-member ceremony retroactively.

**The honest answer:** Option C or D. The founder's instinct is right — launching in your own city first looks parochial. Use Sacramento to test the product privately, and use the waitlist to launch in markets where the platform has no founder advantage. Sacramento joins the public story later, with credibility borrowed from the markets that unlocked first.

## Open threads

- **Threshold numbers.** 50/10/3 is a working guess. Needs validation against real recruitment dynamics. Consider: what if a champion can recruit 50 members easily but 10 producers is brutally hard? The bottleneck determines the timeline.
- **Place granularity.** Is the waitlist per-city or per-neighborhood? Per-city is simpler; per-neighborhood creates inter-neighborhood competition (the Rising Tide dynamic) earlier but fragments the recruitment target. Start per-city; add neighborhood-level once the city unlocks.
- **Role fluidity.** Someone signs up as a member but later realizes they want to sell. Can they add a role? Should they? The waitlist signup isn't a commitment — it's an intent signal. Let people update their role before launch; count the latest declared intent.
- **What happens to markets that stall?** A market at 30/50 members for 6 months. Do you nudge? Do you lower the threshold? Do you let it sit? Probably: periodic email to existing signups ("still X away — know anyone?") but no threshold manipulation. If a market stalls, it stalls. The mechanism is honest.
- **Multiple places per person.** Someone lives in Sacramento but works in Davis. Can they sign up for both? Probably yes — they have genuine community ties to both. No zero-sum constraint.
- **Waitlist-to-account conversion.** The waitlist is email-only. The live platform requires accounts. The conversion flow (waitlist signup → account creation → profile setup) needs design. Probably: magic link in the "you unlocked it" email → account creation form → onboarding flow tailored to their declared role.
- **When does the waitlist page stop being the waitlist page?** After unlock, `/p/[place-slug]` becomes the live market page. The waitlist history could be preserved somewhere ("Sacramento unlocked on [date] with 67 members, 12 producers, and 4 organizers") as a founding-story artifact. Connects to Rising Tide's baseline.
- **Producer freetext as discovery signal.** The "what would you offer?" freetext from producer signups could power a pre-launch "coming soon" preview — "When Sacramento opens, you'll find: sourdough, hot sauce, handmade candles, dog walking, guitar lessons..." This makes the waitlist page more compelling and gives producers early visibility. Privacy consideration: opt-in only.
