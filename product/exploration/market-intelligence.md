---
purpose: Platform-wide demand-intelligence — aggregate market signal surfaced to producers.
layer: what
status: draft
---

# Exploration: Market Intelligence

> **Status: exploration, not b1.** Captures PM direction (2026-05-23). A new system, distinct from [`../systems/producer-tools.md`](../systems/producer-tools.md) — see "Why it is distinct" below. Not yet a system spec; `explore` writes that when the system is scoped to a bundle. Draws on a prior raw brainstorm, now archived at `_attic/2026-05-19/product-exploration/business-intelligence-platform.md`.

## What it is

A platform-wide demand-intelligence system. The platform already sees what people search for, save, and respond well to. Market Intelligence is the layer that **aggregates that behavior across every community** and turns it into market intelligence handed back to producers: what people are looking for, what is gaining traction, and where demand is going unmet.

The model is Amazon's, pointed the other way. Amazon's search box is its single best read on what customers want next — and it keeps that read. Here the same read is given *back to the people doing the work*, so a one-person operation gets the market sense a chain's analytics department takes for granted.

## Why it is distinct from Producer Tools

Two different systems — conflating them was the mistake this doc corrects:

- **Producer Tools** ([`producer-tools.md`](../systems/producer-tools.md)) — tools for what an individual seller needs to run their own thing. The seller's own dashboard: *my* followers, *my* bulletins, *my* engagement, *my* profile. Sourced from that producer's own audience.
- **Market Intelligence** (this doc) — platform-wide data collection that produces market signal, sourced from *everyone's* behavior across *all* communities. It tells a producer about demand and opportunity beyond their own audience.

Producer Tools answers *"how is my thing doing?"* Market Intelligence answers *"what should I consider doing?"*

## Core ideas (PM direction, 2026-05-23)

1. **Search as the demand signal.** Treat platform search the way Amazon treats its search box — the clearest standing read of what people want. Capture it, anonymized and aggregate.
2. **Cross-community transfer.** A demand signal in one community is a usable hint for another when the two are similar enough. What sells or gets searched in Community A informs Community B.
3. **Opportunity surfacing.** Turn the aggregate into producer-facing intelligence: what is popular, what is unmet (gap analysis — locals search for X, nobody offers it), and what one community offers to good reception that another could adopt.

## Guardrails (from the foundation docs — load-bearing here)

Because this system collects behavior platform-wide, the privacy and anti-extraction commitments are not optional:

- Anonymized, aggregated signals only — never individual consumer data; a k-anonymity floor (consistent with [`agent-assistance.md`](../systems/agent-assistance.md)).
- No demographic targeting of individuals. "Similar communities" is judged at the community / locality level, not by profiling people.
- No pay-to-rank, no selling discovery — Market Intelligence informs producers, it never sells visibility (per [`principles.md`](../foundation/principles.md)).
- Circulating wealth, not extracting it — the intelligence goes to the small producer to help them compete; the platform does not hoard it or resell it.

## Substrate already in the plan

The raw capture is partly specced: [`producer-tools.md`](../systems/producer-tools.md) Growth and [`discovery.md`](../systems/discovery.md) plan a `search.queried` event (anonymized query + locality + timestamp) in the discovery event log. Market Intelligence is the system that *aggregates that substrate across communities* and adds cross-community transfer — a new read-and-aggregate layer, not a new capture mechanism.

## Open questions

- **Name.** "Market Intelligence" vs "Demand Intelligence" vs "Demand Signals" — PM call.
- **Surface.** Its own surface, or a panel in the producer dashboard? It is sourced differently from Producer Tools, but a producer may want both in one place.
- **"Similar community" model.** What makes two communities similar enough to transfer demand between them — and what is off-limits (no individual profiling).
- **Monetization.** The archived brainstorm proposed paid BI tiers; `producer-tools.md` leans free. Open — weigh against the wealth-circulation rubric.
- **Bundle.** Later than b1; sequence when `explore` picks it up.
