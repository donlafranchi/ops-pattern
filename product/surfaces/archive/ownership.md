# Product: Ownership Classification

**One-line description:** Categorize businesses by ownership type with visual badges and verification

**Hypothesis:** A simple 6-tier ownership model (independent → mission-driven → PE/corporate) is enough for consumers to make informed choices without requiring deep financial literacy.

**Bundle Assignment:** b1 (T1), b2 (T2), b3 (T3)

**Platform Layer:** Core. Ownership classification is part of the Community Trust layer in `product/systems/platform-core.md`. Currently business-focused (6-tier model), but the trust/badge framework extends to category verticals (e.g., "Local Host" badge for Stays, producer certifications for Harvest).

## Capabilities

| ID | Name | Tier | Status | Scenario Ref |
|----|------|------|--------|--------------|
| C1 | Ownership Badges | T1 | Design | — |
| C2 | Community Flagging | T2 | Design | — |
| C3 | Admin Review Queue | T3 | Design | — |
| C4 | Automated Detection | T3 | Design | — |

## Tier Summary

### T1 (MVP)
Six ownership tiers with fixed pin colors, self-reported during registration, badge on detail card. Includes mission-driven tier for B Corps, PBCs, and companies with demonstrated customer/community commitment.
- C1: Ownership Badges

### T2 (Core)
Community flagging to dispute classification, unverified badge, verification with evidence.
- C2: Community Flagging

### T3 (Polish)
Admin review queue, automated PE acquisition detection, confidence scoring, public API.
- C3: Admin Review Queue
- C4: Automated Detection

## Open Questions

- What qualifies a company for "mission-driven" tier? B Corp certification is clear, but what about Costco (no certification, just good reputation)? Need criteria.
- Should mission-driven tier require evidence (certification link, PBC registration)?
- Should "local franchise" owners be required to disclose the parent brand?
- How do we handle businesses that change ownership after listing?
- What evidence is sufficient to reclassify a listing?

## Changelog

**2026-04-09** — Initial product design
