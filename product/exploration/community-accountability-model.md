# Exploration: Community Accountability Model — BBB With Teeth

## The Framing

The Better Business Bureau had the right idea and the wrong execution. It rates businesses on how they handle complaints — but it's funded by business memberships, so it's toothless. Businesses pay for accreditation. Consumers don't trust it.

Movers, Makers & Shakers can be what the BBB should have been: a community-powered accountability system where the data comes from real people, not from businesses paying for a badge.

## The Four Pillars

Every business has a relationship with four stakeholders:

1. **Customers** — Are you honest, fair, and delivering what you promise?
2. **Employees** — Are you treating your workers with dignity? Paying fairly?
3. **Community** — Are you a good neighbor? Contributing to or extracting from the community?
4. **Planet** — Are you responsible with waste, resources, environmental impact?

These four pillars are the lens through which all community signals flow. Not "was my food cold" — but "is this business treating people and the world right?"

## The Interaction Model

### ❤️ Support (b1)

A heart on every listing. One tap. Means: "This business and the people behind it are worth supporting."

- Aggregate count visible: "❤️ 134"
- Can be removed at any time
- You don't need to visit to support — it's a stance, not a review

**b2+: Why I Support**
In a later version, users can optionally tag their support with a pillar: "I support this business because of how they treat their 🤝 Customers / 👷 Employees / 🏘️ Community / 🌍 Planet." This lets pillar-level sentiment emerge organically without the platform scoring anything. For b1, a simple heart is enough.

### The Report (Structured Accountability)

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

### Business Standing — Sliding Scale

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

### The Elephant Example

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

### What Businesses See (Their Dashboard)

Business owners should have visibility into how they're perceived — this is the "improve" part:

- Total endorsements (hearts) over time
- Report volume by pillar (no individual reports shown — just counts)
- Current standing
- If "Concerns Raised" or worse: the pillar(s) affected and general category
- Ability to submit a response / action plan
- If cleared: a "Resolved" badge they can display

This is the BBB improvement angle: the business gets feedback on WHERE they're falling short (customers? employees? community? planet?) without seeing individual complaints that could lead to retaliation.

## What This Replaces

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

## Bundle Assignment

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
- Public records integration (auto-flag businesses with labor violations, EPA fines, etc.)
- "Resolved" badge for businesses that addressed concerns
- Aggregate pillar scores visible to consumers (opt-in by business? or always visible?)

## Open Questions

- What's the right threshold for "Concerns Raised"? Per-capita in the area, or absolute count?
- Should endorsements be anonymous or show usernames?
- Can a business owner endorse their own business? (Probably not — or it doesn't count toward the total)
- Should "Questionable" businesses still appear on the map with full visibility, or be deprioritized?
- How do we prevent coordinated report campaigns (astroturfing)?
- Should the four pillars ever be visible as separate scores, or always aggregated into a single standing?
- What does the admin review process actually look like? Volunteer moderators? Paid staff? AI-assisted?
