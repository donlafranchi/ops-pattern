# System: Ownership Classification

**Purpose:** Categorize businesses by ownership type and display appropriate visual indicators

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

## T1 — MVP Tier

- Six ownership tiers with fixed pin colors:
  - Independent (gold) — single-location, owner-operated
  - Worker-owned / co-op (deep green) — community rooted
  - Local franchise (amber) — local owner, national brand
  - Community challenger (bright blue) — actively competing against a monopoly
  - Mission-driven (warm purple) — B Corps, public benefit corporations, and large companies with demonstrated commitment to customers/community (e.g., Patagonia, REI, Costco). Not independent or local, but playing fair.
  - PE-owned / corporate chain (flat grey) — absent owner, money leaving town
- Self-reported by business owner during registration
- Ownership badge on detail card with tier label
- Mission-driven listings show certification type (B Corp, PBC) or rationale
- PE listings show parent company name + location count if known

## T2 — Core Tier

- Community flagging to dispute classification
- Admin review queue for disputed classifications
- "Community-submitted, unverified" badge for seeded listings
- Verification flow with evidence links (SEC filings, news articles)

## T3 — Polish Tier

- Automated PE acquisition detection (news feeds, SEC filings)
- Confidence scoring for ownership claims
- Historical ownership changes with timeline
- Public ownership API for researchers

## Integration Points

- Connects to: Business Data, Flagging
- Used by: Map System (pin colors), Business Detail (badges)
