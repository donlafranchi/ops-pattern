# Main Street Market — Founding Scenarios

> These scenarios define the core user intents for the Main Street Market product.
> They are written for the Scenario Writer tier — unconstrained, human-readable, and focused on *intent not implementation*.
> Each scenario flows downstream: Design → Planning → Development → Evaluation.

---

## Scenario 1 — The Consumer

**Title:** Maria finds a vet that's still independent

**Narrative:**
Maria's golden retriever needs a checkup. Her old vet retired two years ago and the practice was bought by a company she's never heard of. Prices went up, the staff turned over, and it doesn't feel the same. A friend mentions Main Street Market. Maria opens it on her phone, sees a map of her area, and immediately notices the difference — some pins are bright and warm, others are flat grey. She taps a grey one near her house: "Acquired by NVA (National Veterinary Associates) in 2021. Private equity backed. 400+ locations nationwide." She taps a gold one a few miles away: "Sunrise Animal Clinic. Owned by Dr. Patricia Nguyen since 2009. Independent, single location." Maria books with Dr. Nguyen. On the way out she taps "I visited here" and leaves a note: "Still the real thing."

**What success looks like:**
Maria found what she was looking for in under two minutes without knowing anything about private equity before she opened the app.

**Core capability:** Map search + ownership badges

**Key features:**
- Map view with colored pins by ownership tier
- Business detail card
- Ownership tier labels
- "I visited here" interaction

---

## Scenario 2 — The Business Owner

**Title:** Carlos lists his hardware store before someone else defines him

**Narrative:**
Carlos has run a hardware store in his neighborhood for eleven years. A Home Depot opened nearby three years ago and a private equity-backed chain called TrueValue Express opened six months ago. His regulars stay loyal but new customers assume he's part of a chain because he has a professional sign and a clean store. He finds Main Street Market through a local business association newsletter. Registration takes five minutes: business name, address, category, ownership type, a short story in his own words. He selects "Independently owned, single location" and writes: "Family owned since 2014. We know your name when you walk in." His pin goes live on the map in gold. Within a week three new customers mention they found him there specifically because they were looking for something not corporate-owned. Carlos shares his listing on his Facebook page with the caption: "We're still here and we're still ours."

**What success looks like:**
Carlos got discoverable by his ideal customer without a marketing budget, a tech team, or a complicated onboarding flow.

**Core capability:** Business self-registration

**Key features:**
- Registration form
- Ownership type selector
- Story / about field
- Pin activation on submission
- Shareable listing URL

---

## Scenario 3 — The Community Organizer / Seeders

**Title:** Darnell seeds his city before the app has critical mass

**Narrative:**
Darnell runs a local buy-local newsletter in his mid-sized city. He discovers Main Street Market and immediately sees the problem: his city has zero listings yet. Rather than waiting, he uses the "seed your city" flow — a lightweight tool that lets trusted community members add businesses they personally know to be independently owned, flagged as "community-submitted, unverified." He adds fourteen businesses in an afternoon: two coffee shops, a bookstore, a family-owned tire shop, a worker-owned food co-op, and a locally-owned urgent care clinic. Each listing shows a small "submitted by community" badge until the owner claims it. Three of the fourteen owners find their listing within a week and claim it, adding their own story and photos. Darnell shares the map in his newsletter. Two hundred people open it in the first 48 hours. His city now has a living map.

**What success looks like:**
A motivated community member can bootstrap a city from zero to useful without needing the business owners to act first.

**Core capability:** Community seeding

**Key features:**
- Seed / nominate a business flow
- "Community-submitted, unverified" badge
- Claim listing flow for business owners
- City bootstrap with zero listings state

---

## Scenario 4 — The Traveler

**Title:** Jen uses the map in Puerto Rico instead of Google

**Narrative:**
Jen is traveling to San Juan for a week. Before she leaves she opens Main Street Market, drops the map to San Juan, and filters to "locally owned only." She saves five restaurants, two coffee shops, and a boutique hotel — all gold or green pins, all locally owned. At dinner the first night she opens the app to find somewhere for dessert nearby. The map shows a bright blue pin two blocks away — a new listing tagged "Community Challenger: local bakery competing with Cinnabon in the mall across the street." She goes. It's the best meal decision of the trip. When she gets home she adds a note to three of the listings: "Visited. Still the real thing."

**What success looks like:**
A traveler with values alignment can plan an entire local-first trip using the map the same way they'd use Google Maps — except every result reflects the kind of economy they want to support.

**Core capability:** Travel / browse mode

**Key features:**
- Filter by ownership type
- Save / bookmark a list of businesses
- Travel context (browse by city or region)
- "Visited" note / check-in

---

## Scenario 5 — The PE Watchdog (power user)

**Title:** Robert flags a dental chain that's been quietly acquired

**Narrative:**
Robert is a semi-retired accountant who reads a lot of business news. He's been using Main Street Market for a month and has noticed that a dental practice in his neighborhood recently changed its name subtly and started advertising aggressively — a classic post-acquisition pattern. He searches it on the app, finds it listed as "Independent." He taps "Flag this listing" and submits: "Name changed from Eastside Dental to Smile Brands affiliate in Q1 2024. SEC filing linked." An admin reviews it within 48 hours, verifies via the linked filing, and changes the pin to grey with a note: "Acquired by Smile Brands (PE-backed, 400+ locations) 2024." Robert gets a notification: "Your flag was verified. Thank you." He's contributed something real. He flags two more that week.

**What success looks like:**
The map stays accurate over time because motivated users have a lightweight, trusted mechanism to keep it honest — without requiring a full-time staff to maintain it.

**Core capability:** Flagging + verification

**Key features:**
- Flag a listing flow
- Admin review queue
- Update listing ownership status
- Contributor notification on flag resolution

---

## Pin Color Reference

| Ownership type | Color | Meaning |
|---|---|---|
| Independently owned, single location | Gold | Thriving, alive, local |
| Worker-owned / co-op | Deep green | Community rooted |
| Local franchise (community owner) | Amber | Local owner, national brand |
| Community challenger | Bright blue | Actively competing against a monopoly |
| Mission-driven (B Corp, PBC, honorable mention) | Warm purple | Not local, but playing fair |
| PE-owned / corporate chain | Flat grey | Absent owner, money leaving town |

---

## Capability → Feature Map

| Scenario | User | Core capability | Key features |
|---|---|---|---|
| 1 | Consumer | Map search + ownership badges | Map view, pin colors, detail card, ownership labels |
| 2 | Business owner | Self-registration | Registration form, ownership selector, story field, pin activation |
| 3 | Community organizer | Community seeding | Seed flow, unverified badge, claim listing, city bootstrap |
| 4 | Traveler | Travel / browse mode | Ownership filter, save list, travel context, visited note |
| 5 | PE watchdog | Flagging + verification | Flag flow, admin queue, listing update, contributor notification |

---

## Language and Framing Notes

These scenarios and all downstream features should be framed using **pro-competition, pro-free-market language.** This product is for all Americans regardless of political affiliation.

| Avoid | Use instead |
|---|---|
| Oligarchy | Rigged market / crony capitalism |
| Corporate greed | Market consolidation |
| Anti-capitalist | Pro-competition / pro-free-market |
| Progressive values | American values / community values |
| Resist | Take back / reclaim |
| PE is bad | Wall Street buying Main Street |
| Ethical spending | Smart spending / voting with your wallet |

**Core message:** The free market only works when there's real competition. Private equity doesn't win through better products or lower prices — it wins by eliminating choice. Main Street Market helps people find businesses where their money stays in the community and competition is still alive.
