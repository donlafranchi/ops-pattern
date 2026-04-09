# Exploration: Product Identity — What We Are and What We Are Not

## The Question

As we add accountability signals, visit interactions, and community input — are we becoming Yelp? And if not, what's the line?

## What Yelp Is (and why it struggles)

Yelp is a review platform. Its core unit is the subjective opinion: "I had a bad experience." This creates:

- **Noise** — one angry customer can tank a business
- **Manipulation** — fake reviews, extortion, pay-to-play allegations
- **Monetization trap** — the only way to make money is selling visibility to businesses, which poisons trust
- **Adversarial dynamics** — businesses hate it, consumers don't fully trust it

Yelp's fundamental problem: subjective reviews are cheap to create, hard to verify, and easy to weaponize.

## What Main Street Market Is

Main Street Market is an **ownership transparency platform**. The core unit is not opinion — it's **structure**: who owns this business, how is it organized, where does the money go.

| Yelp | Main Street Market |
|---|---|
| "Was my experience good?" | "Who owns this place?" |
| Subjective reviews | Structural facts |
| Individual grievances | Ownership patterns |
| Star ratings | Ownership tiers |
| Any business | Businesses differentiated by ownership |
| Monetizes by selling to businesses | TBD — but NOT by selling visibility |

**The insight: we are not rating businesses. We are classifying them.**

## The Accountability Question

The user wants to know: can we signal when a business treats its employees, customers, or community badly?

This is where it gets dangerous. "Treats people badly" is one step from "I disagree with the owner" — and then we're Yelp with politics.

### Option A: Stay in Our Lane (Recommended for b1-b2)

Don't rate behavior. Rate structure.

The ownership tiers already communicate a lot:
- **Independent (gold)** = money stays here, owner is accountable to this community
- **Mission-driven (warm purple)** = formally committed to stakeholder interests (B Corp, PBC)
- **PE/corporate (flat grey)** = money leaves, decisions made elsewhere

The argument: businesses that exploit workers, cheat customers, or harm their community are *more likely* to be extractive ownership structures. The ownership signal is a proxy for the behavior signal — and it's verifiable without subjective judgment.

A locally-owned business that commits wage theft will lose customers through word of mouth. A PE-owned chain that does it is protected by corporate anonymity. The map fixes the anonymity problem. That might be enough.

### Option B: Community Principles Score (b3, if ever)

If we go beyond ownership structure, the only safe version is:

**Verifiable, categorical, opt-in.**

Not "rate this business 1-5" but:
- Does this business pay a living wage? (verifiable via public commitments or certifications)
- Is this business a certified B Corp? (verifiable)
- Has this business had labor violations? (public record — see business-accountability.md)
- Does this business source locally? (self-reported, community-verified)

These are binary flags, not ratings. They're either true or not. The consumer decides which flags matter to them.

**This is NOT a rating system. It's a transparency checklist.**

Think of it like nutrition labels. The FDA doesn't tell you Oreos are bad. It tells you there are 14g of sugar per serving. You decide.

### Option C: Private Signals (interesting middle ground)

What if the "rating" is private and aggregate?

- Consumers can privately mark: "I stopped going here because of how they treat [employees / customers / community]"
- No public review. No star rating. No comment.
- The platform aggregates these signals invisibly
- When a threshold is crossed (e.g., 20+ people in the same zip code flagged the same business), a small neutral indicator appears: "Community concerns noted"
- Tapping it shows the category breakdown (labor: 12, customer treatment: 8) but NO individual comments
- Business owner can see the signal and respond

This gives consumers a voice without creating a review platform. No individual opinions are ever public. The signal is statistical, not editorial.

## Revenue Model: Don't Be Yelp

Yelp's revenue trap: selling enhanced listings to businesses. This creates a conflict of interest — the platform serves whoever pays, not whoever's best.

Options that don't poison trust:

| Model | How it works | Risk |
|---|---|---|
| **Consumer subscription** | $3-5/mo for premium features (save lists, travel mode, notifications) | Need enough free value to convert |
| **City/region sponsorship** | Local business associations or chambers pay for city-level features | Aligns incentives — they want more independent businesses too |
| **Data licensing** | Anonymized ownership data to researchers, journalists, policymakers | Mission-aligned, but small market |
| **Incubator fees** | Take a small cut of crowdfunded business launches (see incubator exploration) | Only works at scale |
| **Verified badge (business-paid)** | Businesses pay to get ownership independently verified (not for visibility — for trust) | Must be clearly about verification, not ranking |
| **Grants / mission funding** | Foundation grants, economic development funds | Not sustainable alone but good for launch |
| **Local food network transaction fees** | Small % on farm-to-consumer orders (see food network exploration) | Only works in b2+ with transaction layer |

The principle: **consumers are the customer, not businesses.** If the business is the customer, incentives corrupt.

## Recommendation

**b1:** Ownership tiers only. No behavior signals, no ratings, no reviews. The map speaks for itself.

**b2:** Add public record transparency (business-accountability.md) — verifiable actions only. Add mission-driven tier badges. Still no subjective input.

**b3 (maybe):** Explore private aggregate signals (Option C) and/or transparency checklists (Option B). Only if the community is large enough that aggregate signals are meaningful and individual voices can't be weaponized.

**Never:** Public reviews, star ratings, or subjective comment systems. That's Yelp. We're not Yelp.

## The One-Line Test

Before adding any feature, ask: **"Is this about ownership structure and verifiable facts, or about subjective opinions?"**

If it's structure/facts → it belongs.
If it's opinions → it doesn't.
