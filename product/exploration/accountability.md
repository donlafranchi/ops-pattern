---
id: what-accountability
purpose: Two framings of accountability: court records and four-pillar community signals.
layer: what
status: reference
---

# Exploration: Accountability

> **Status:** Exploration, not b1. Folded together 2026-05-22 from two prior takes on one system: the public-record transparency framing (formerly `business-accountability.md`) and the community-driven four-pillars + sliding-scale framing (formerly `community-accountability-model.md`). Both perspectives preserved below; the merge is intentionally non-reconciling — the PM picks which framing (or which blend) becomes the system spec when this graduates from exploration.

> **PM direction (2026-05-23).** When this graduates, only **Framing 2 — the community four-pillars model** — is built. Framing 1 is *not* a separate platform feature: the platform does not build court/agency-record integration. Court records survive only as **optional evidence a community member may attach to a concern report** — the "bring receipts" path, which the Framing 2 report flow already supports. The point being encoded: the community has agency, and their work holding each other accountable carries real consequences. The visible output is an **aggregated business accountability profile** — the platform won't necessarily expose individual report details. Its exact shape — and whether it reads as a score, a standing, or a vibe — is deferred to spec time, and must stay within `principles.md`'s refusal of star-ratings and leaderboards.

This doc covers two complementary perspectives on the same problem: **how does the platform surface accountability information about kind='business' Groups (and the Members behind them) without becoming a moral judge, a political arena, or a complaint-attractor?**

The two framings answer different sub-questions:

- **Framing 1 — Public-record transparency.** What's the structural answer for *verifiable government-record actions* (NLRB filings, OSHA violations, EPA fines, wage-theft judgments)? Discrete, court/agency-sourced, statute-of-limitations-bounded.
- **Framing 2 — Community-driven four-pillars + sliding scale.** What's the structural answer for *community signals* (treatment of Customers / Employees / Community / Planet) that are real but don't live in court records? Aggregate, four-pillar-categorized, peer-driven, sliding-scale standing.

When this exploration graduates to a system spec, the question for the PM is whether to ship one framing, both as parallel surfaces, or as a blended single surface.

---

## Framing 1 — Public Record Transparency

> Original draft: `business-accountability.md`. Premise: verifiable public-record actions only — no opinions, no beliefs, no boycott campaigns.

### Core Idea

Give consumers access to verifiable public-record actions taken by businesses, without the platform making moral judgments or becoming a political arena.

### The Problem

Some consumers want to know if a business has a history of actions they find objectionable. Some businesses have exploited workers, committed wage theft, violated environmental regulations, or engaged in deceptive practices — and these are matters of public record, not political opinion. But right now there's no easy way for a consumer to see this at the point of decision.

The danger: any system that tries to label businesses as "good" or "bad" based on values will immediately become a culture war battleground. The platform dies the moment it's perceived as partisan.

### The Principle: Actions, Not Beliefs

The line is: **what did the business DO, not what does the owner BELIEVE.**

| In scope (verifiable actions) | Out of scope (opinions/beliefs) |
|---|---|
| NLRB complaints and rulings | Owner's political donations |
| Wage theft judgments | Owner's social media posts |
| OSHA violations | Owner's religious views |
| Environmental fines (EPA, state) | Owner's party affiliation |
| Consumer protection lawsuits | Boycott campaigns |
| Fraud convictions | Yelp-style grievances |
| Documented labor exploitation | Guilt by association |

The ICE example fits cleanly: a business that exploited undocumented workers and then reported them to avoid paying wages — that's labor fraud, documented in court records. It's not about immigration politics. It's about a business cheating people.

### How It Might Work

#### Public Record Badges (not moral judgments)

Instead of "this business is bad," the platform surfaces: "this business has public records you may want to know about."

- **No public records** — no badge, no indicator (default state)
- **Public records available** — small neutral indicator (not red, not warning-colored). Tap to see specifics.
- Records are categorized by type: labor, environmental, consumer protection, fraud
- Each record links to the actual source (court filing, agency database, news report)
- The platform does NOT interpret or editorialize — it links to the record and lets the consumer decide

#### User-Driven, Not Platform-Driven

The platform doesn't decide what matters. The consumer does.

- Consumers can flag "I found a public record about this business" with a source link
- Community verification: others confirm the source is legitimate
- Admin review confirms the record is real and correctly attributed
- The business owner can respond: "Here's our side / here's what we changed"

This mirrors how the ownership flagging already works (Scenario 5 — PE Watchdog). Same mechanic, different data type.

#### What This Is NOT

- Not a review system (no stars, no opinions)
- Not a boycott tool (no "don't go here" language)
- Not a political scorecard (no donations, no affiliations)
- Not guilt by association (a franchise owner isn't responsible for the parent company's actions — or is that a separate question?)

### The Framing That Keeps It Neutral

**"Transparency, not judgment."**

The platform's position: "We believe consumers deserve access to public information about the businesses they support. We don't tell you what to care about. We give you the facts and let you decide."

This is consistent with the core product message: the free market only works when consumers have information. Ownership data is one kind of information. Public accountability records are another. Same principle.

### Why This Is Hard

- **Weaponization risk**: People will try to flag businesses they disagree with politically, using tenuous "public record" justifications
- **Verification burden**: Every flag needs admin review to confirm it's a real public record, not a hit piece
- **Chilling effect**: Business owners may avoid the platform if they fear being targeted
- **Scope creep**: Where does "public record" end? Lawsuits that were dismissed? Allegations never proven?
- **Response asymmetry**: A flag gets attention; a business owner's response often doesn't

### Possible Guardrails

1. **Only government agency actions and court outcomes** — not allegations, not lawsuits in progress, not news articles alone
2. **Statute of limitations** — records older than X years age off (people and businesses change)
3. **Business owner response is always visible** alongside the record
4. **No aggregation into a "score"** — individual records only, no composite rating
5. **High bar for flagging** — require a direct link to the government/court source
6. **Admin review required** — nothing goes live without verification

### Framing 1 — Open Questions

- Is this b2 or b3? The verification burden is heavy. Might need a dedicated moderation team.
- Should this share the same flagging infrastructure as ownership disputes, or be separate?
- How do we handle chains? If Walmart has an OSHA violation in Texas, does every Walmart pin show it?
- What about sealed records or expunged cases?
- Could we partner with existing public records databases rather than building our own?
- Is "public record" the right framing, or is there something better? ("Business transparency"? "Accountability record"?)

### Framing 1 — Potential Bundle

b3. This needs the flagging/verification infrastructure from the ownership system (also b3), plus careful moderation tooling. Getting this wrong is worse than not having it.

---

## Framing 2 — Community-Driven Four Pillars + Sliding Scale

> Original draft: `community-accountability-model.md`. Premise: "BBB with teeth" — community-powered accountability where the data comes from real people on the four pillars (Customers / Employees / Community / Planet), not from businesses paying for a badge.

### The Framing

The Better Business Bureau had the right idea and the wrong execution. It rates businesses on how they handle complaints — but it's funded by business memberships, so it's toothless. Businesses pay for accreditation. Consumers don't trust it.

Movers, Makers & Shakers can be what the BBB should have been: a community-powered accountability system where the data comes from real people, not from businesses paying for a badge.

### The Four Pillars

Every business has a relationship with four stakeholders:

1. **Customers** — Are you honest, fair, and delivering what you promise?
2. **Employees** — Are you treating your workers with dignity? Paying fairly?
3. **Community** — Are you a good neighbor? Contributing to or extracting from the community?
4. **Planet** — Are you responsible with waste, resources, environmental impact?

These four pillars are the lens through which all community signals flow. Not "was my food cold" — but "is this business treating people and the world right?"

### The Interaction Model

#### ❤️ Support (b1)

A heart on every listing. One tap. Means: "This business and the people behind it are worth supporting."

- Aggregate count visible: "❤️ 134"
- Can be removed at any time
- You don't need to visit to support — it's a stance, not a review

**b2+: Why I Support**
In a later version, users can optionally tag their support with a pillar: "I support this business because of how they treat their 🤝 Customers / 👷 Employees / 🏘️ Community / 🌍 Planet." This lets pillar-level sentiment emerge organically without the platform scoring anything. For b1, a simple heart is enough.

#### The Report (Structured Accountability)

A "Report a concern" button. This is the teeth.

**Step 1: Select a pillar**

| Pillar | What it covers | Example |
|---|---|---|
| 🤝 Customers | Deceptive practices, bait-and-switch, refusal of service, discrimination against customers | Business refuses service to certain groups |
| 👷 Employees | Wage theft, unsafe conditions, exploitation, retaliation, discrimination | Business caught exploiting workers then reporting them to ICE |
| 🏘️ Community | Noise, pollution, displacement, political intimidation, hostile behavior | Business owner harasses neighbors, funds harmful local initiatives |
| 🌍 Planet | Environmental violations, illegal dumping, animal cruelty, resource destruction | Business mistreats elephants in their care |

**Step 2: Describe what happened**

- Required: brief factual description (what, when, who)
- Optional: source link (news article, video, court record, social media post)
- Optional: "I witnessed this personally" checkbox

**Step 3: Submit**

- Report goes into a review queue
- Reporter gets a tracking ID — they can check status
- Report is categorized and timestamped

#### Business Standing — Sliding Scale

Standing is not a set of discrete states — it's a **sliding scale** from Questionable to Exemplary, driven by the ratio of support to verified concerns.

```
Questionable ◄──────────────────────► Exemplary
     │                                    │
  Verified concerns,              High support,
  low support                     no concerns
```

**How it moves:**

- ❤️ Support pushes the needle toward Exemplary
- Verified reports (admin-confirmed) push it toward Questionable
- Unverified reports don't move the needle — volume triggers review, not score changes
- The scale is continuous, not bucketed. No labels like "3 out of 5 stars."

**What's visible to consumers:**

- A simple visual indicator on the listing — warm/cool color tone, or a small gauge. Not a number. Not a letter grade.
- If concerns have been verified: the reason is always shown ("Verified concern: animal cruelty")
- If the business is strongly supported with no concerns: a warm glow / "Community favorite" or "Exemplary" label
- The vast middle (most businesses) shows nothing special — just the heart count

**Key rules:**
- One person can never move the needle. A single report does nothing visible.
- Only verified concerns (admin-confirmed with evidence) affect the scale negatively
- Support is the positive signal; absence of support is neutral, not negative
- Businesses can improve: resolved concerns fade, new support lifts the score
- Old verified concerns age off over time (businesses change)
- The scale is never displayed as a number — it's a vibe, not a score

#### The Elephant Example

Someone sees a TikTok of a business mistreating elephants.

1. They open the business on Movers, Makers & Shakers
2. Tap "Report a concern"
3. Select 🌍 Planet
4. Write: "Business documented on video mistreating elephants in their care. Viral video from [date]."
5. Link the TikTok / news article
6. Submit — get tracking ID

What happens next:
- If this is the only report → nothing visible changes. Report is logged.
- If 50 people report the same thing in a week → "Concerns Raised" amber indicator appears
- Admin opens review → "Under Review"
- Admin verifies via news coverage / animal welfare agency → Standing changes to "Questionable: Verified animal cruelty concerns (🌍 Planet)"
- The reason is specific and factual. Not "people don't like this business." It's "verified animal cruelty."

The business can respond: "We've partnered with [animal welfare org] and changed our practices." If verified, admin can clear the standing.

#### What Businesses See (Their Dashboard)

Business owners should have visibility into how they're perceived — this is the "improve" part:

- Total endorsements (hearts) over time
- Report volume by pillar (no individual reports shown — just counts)
- Current standing
- If "Concerns Raised" or worse: the pillar(s) affected and general category
- Ability to submit a response / action plan
- If cleared: a "Resolved" badge they can display

This is the BBB improvement angle: the business gets feedback on WHERE they're falling short (customers? employees? community? planet?) without seeing individual complaints that could lead to retaliation.

### What This Replaces (from the original draft's b1 list)

| Remove from b1 | Replace with |
|---|---|
| "I visited here" button | ❤️ Endorse button |
| Optional text note | Gone — no public text |
| Visit count on listing | Endorsement count on listing |
| Visit notes on detail card | Gone — no user-generated content |

| Add to b1 | |
|---|---|
| ❤️ Endorse | Public, lightweight, one-tap |
| Report a concern | Private, structured, four pillars |
| Business standing | Good Standing (default), escalation path |

### Framing 2 — Bundle Assignment (as originally drafted)

**b1:**
- ❤️ Endorse button + count
- Report a concern (submit only — reports are collected but standing system is manual/admin-only)
- Basic admin view of report volume

**b2:**
- Automated "Concerns Raised" threshold
- Business owner dashboard (endorsement trends, report pillar breakdown)
- Standing system (Good → Concerns Raised → Under Review → Questionable → Cleared)
- Report tracking for submitters

**b3:**
- Historical standing timeline
- Public records integration (auto-flag businesses with labor violations, EPA fines, etc.) — *this is where Framing 1 plugs in*
- "Resolved" badge for businesses that addressed concerns
- Aggregate pillar scores visible to consumers (opt-in by business? or always visible?)

### Framing 2 — Open Questions

- What's the right threshold for "Concerns Raised"? Per-capita in the area, or absolute count?
- Should endorsements be anonymous or show usernames?
- Can a business owner endorse their own business? (Probably not — or it doesn't count toward the total)
- Should "Questionable" businesses still appear on the map with full visibility, or be deprioritized?
- How do we prevent coordinated report campaigns (astroturfing)?
- Should the four pillars ever be visible as separate scores, or always aggregated into a single standing?
- What does the admin review process actually look like? Volunteer moderators? Paid staff? AI-assisted?

---

## Notes on the merge (for the PM)

- **The two framings are complementary, not in conflict.** Framing 1 handles court/agency records (discrete, verifiable, slow-moving); Framing 2 handles community signals (continuous, peer-driven, faster). Framing 2's b3 row already explicitly anticipates Framing 1 ("Public records integration — auto-flag businesses with labor violations, EPA fines, etc.").
- **Both framings name "post-primitives" vocabulary (`business`, "this business is...") that pre-dates the 2026-05-10 Groups ratification.** When this graduates to a system spec, the subject of accountability is the kind='business' Group (and the Members named as owner-role memberships). Adjust language at spec time.
- **Both framings address the same load-bearing concern from `principles.md` Part 5 (Categorical Failures):** *gatekeeping ratings.* The platform refuses *ranking-of-people-by-stars* (Yelp/Angi). Both framings here are non-ranking: Framing 1 surfaces source-linked records; Framing 2 surfaces a vibe-not-a-score sliding scale. Neither produces a leaderboard, neither produces a price-of-being-found column.
- **Related platform-level commitments to honor at spec time:** the accountable-participation design intent in `policy.md`, the "no ranking of people" corollary in `principles.md` Part 2, and the action-layer audit trail in `action-layer.md` (every report is an action; every admin verification is an action; both flow through the named handlers).
