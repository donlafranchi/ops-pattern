# System: {Name}

**Purpose:** {What this system does}

**Bundles:** b1 (T1 tier), b2 (T2 tier), b3 (T3 tier)

## T1 — MVP Tier
{Minimal viable version}

## T2 — Core Tier
{Standard behavior}

## T3 — Polish Tier
{Advanced features, optimizations, edge cases}

## Data model implications (build with this in mind from day one)
{Tables, columns, event-sourcing patterns to add at MVP even if features ship later. Examples: event tables for analytics, soft-delete via `*_at` timestamps, denormalized rollup tables, referrer columns on view rows. These are cheap at MVP and impossible to backfill.}

## Policy posture (required if this system touches privacy, monetary flow, data sharing, agent permissions, or visibility)

Per `product/foundation/policy.md`. If this system touches none of those surfaces, write `N/A — no policy surface.`

1. **Default state.** State the protective default — almost always off / closed / private.
2. **Available opt-ins.** List what a Member can choose to enable, with scope and granularity.
3. **Three-filter analysis.** For each opt-in, in writing:
   - Is this helpful economically or socially to community members?
   - Does it harm anyone else (other Members, non-participants, the broader public)?
   - Can this be abused by bad actors? Name the mitigation (cap, audit, time-bound, transparency, granularity).
4. **Visibility & revocation.** Where does the Member see this opt-in? How do they revoke it? Is it time-bounded?

## Integration Points
- Connects to: {other systems}
- Used by: {capabilities}
