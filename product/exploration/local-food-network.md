# Exploration: Local Food Network — Know Your Farmer

## Core Idea

Connect consumers directly with local farmers and ranchers. Build the infrastructure so food growers can reach their community without needing to be tech-savvy.

## The Problem

People are waking up to the fact that high-quality food drives high-quality health. Industrial food supply chains are opaque — consumers can't trace where their food comes from, who grew it, or how it was raised. Meanwhile, small farmers and ranchers have no easy way to reach local buyers. Farmers markets are seasonal and limited. CSAs require commitment consumers aren't always ready for. And building a website or managing an online store is not in a farmer's wheelhouse.

This is a market failure: willing buyers, willing sellers, no infrastructure connecting them.

## How It Might Work

### For Consumers

- Browse the map for local food producers (farms, ranches, orchards, apiaries, etc.)
- See what's available: beef, eggs, produce, honey, dairy, etc.
- Filter by distance, product type, growing practices (pasture-raised, organic, regenerative, etc.)
- "Subscribe" to a farm — get notified when seasonal products are available
- Pre-order for pickup or local delivery
- Leave visit notes: "Toured the farm. Kids loved it. Real food from real people."

### For Farmers/Ranchers

- Dead-simple registration — name, location, what you grow, your story
- No e-commerce complexity in v1 — just visibility and connection
- Seasonal availability updates (toggle products on/off)
- Direct messaging or contact form from interested consumers
- Community reputation through visit notes and demand signals

### The Matchmaking Layer

The platform becomes infrastructure for local food economies:

- **Demand signals** — consumers in food deserts or underserved areas signal what they want locally (ties into incubator concept)
- **Buying groups** — neighbors coordinate bulk purchases from a single farm
- **Farm-to-table partnerships** — independent restaurants on the platform connect with local growers
- **Seasonal calendars** — "What's available near me this month?"

## Why This Matters

- Food is the most visceral version of "money staying in the community"
- Health-conscious consumers are a massive and growing market
- Farmers need this more than any other small business category — they're underserved by tech
- "Know your farmer" is culturally resonant across political lines
- Pairs naturally with the Main Street Market mission — same values, different category

## Why This Should Be b2

This isn't a nice-to-have — it's a potential growth engine. Food is:
- High frequency (people eat every day, not every month)
- Emotionally compelling (health, family, community)
- Viral (people share what they eat, where it comes from)
- Underserved by existing platforms (no good "Mapbox for local food" exists)

Pushing this to b2 means the map already exists, auth exists, visit notes exist, the business data model exists. We extend the model for farm-specific fields (products, seasonality, practices) and add the matchmaking layer on top.

## Open Questions

- Do we need a separate product type for farms vs. retail businesses, or extend the existing model?
- How do we handle food safety / regulatory compliance disclaimers?
- Should the platform facilitate transactions or just connections in v1?
- How do we reach farmers who aren't online much? (Community seeders could help here — someone adds their local farm.)
- What's the relationship between this and the community seeding flow?
- Could we partner with existing farmer networks (Farm Bureau, local ag extensions)?

## Potential Bundle

**b2** — strong candidate. Infrastructure exists from b1. Extend business model for food producers, add product/availability fields, seasonal calendar, and farm-to-consumer matching.
