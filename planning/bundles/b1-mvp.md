# Bundle: b1 MVP

**Release:** Beta

**Hypothesis:** If consumers can see ownership status on a map, they'll choose independent businesses — and business owners will self-register to be discovered.

**Success Metrics:**
- 50+ businesses registered in first target city within 30 days
- 3+ businesses receive community support (hearts) within 60 days
- Average registration time under 5 minutes

## Scope

### Included (In This Bundle)

**Features:**
- F001: Map View — colored pins by ownership tier, pan/zoom, location-aware, bottom-nav search by category/location
- F002: Business Detail — card with name, address, category, ownership badge, story
- F003: Business Registration — self-service form, ownership selector, pin activation
- F004: Shareable Listings — SSR detail pages with OG metadata
- F005: Community Signals — ❤️ Support button + Report a concern (with pillar and reason)

**Systems:**
- Map System — T1 only
- Business Data — T1 only
- Ownership Classification — T1 only
- Auth — T1 only (basic Supabase email auth)

### Deferred (Out of Scope)

- Community seeding / nominate flow (b2)
- Claim listing flow (b2)
- Ownership filters / saved lists (b2)
- Travel / city browse mode (b2)
- Flagging / admin review queue (b3)
- Contributor notifications (b3)
- Full-text search across business names/descriptions (b2)
- Rich media (photos, hours, etc.)

## Migration Trigger

When 3+ cities have 20+ listings each, ship b2 with community seeding and filters.
