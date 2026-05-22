# System: Community Impact

**Purpose:** Surface which businesses keep wealth circulating locally, and give businesses and consumers ways to communicate without the toxicity of reviews and public shaming

**North star:** Circulating wealth over extracting wealth, rebuilding Main Street

**Bundles:** b1 (T1), b2 (T2), b3 (T3)

---

## The Two Problems This System Solves

### 1. Visibility for local businesses
Small, locally owned businesses can't outspend chains on marketing. This system gives them a signal — a badge that says "your money stays here." The more local the business, the stronger the signal.

### 2. Safe community communication
Yelp rewards negativity and public shaming. Nextdoor devolves into feuds. We need two-way communication between businesses and their communities that:
- Lets businesses talk TO their community (promotions, events, updates)
- Lets consumers talk BACK without weaponizing feedback
- Builds trust over time, not in one hot take

---

## Locality Score (Not Automated)

This is NOT a self-reported badge. It's a set of facts the business provides during registration that we display transparently. No algorithm. No score. Just honest answers.

### Registration Questions

1. **Who owns this business?** (name, not hidden behind an LLC)
2. **Where does the owner live?** (same city / same county / same state / out of state)
3. **How long has this business been here?** (years at this location)
4. **Is this your only location?** (single / 2-5 / 6+ locations)
5. **Is this business part of a franchise or chain?** (yes/no, which one)
6. **Is this business owned by an investment firm or holding company?** (yes/no, which one)

### What We Display

We show the answers, not a judgment. The consumer decides.

**Example — Kingdom Coffee Roasters:**
> Owned by Jake & Maria Chen · Lives in Folsom · Here since 2018 · Single location · Independent

**Example — Peet's Coffee:**
> Owned by JAB Holding Company · Headquarters: Luxembourg · 350+ locations · Private equity

The contrast speaks for itself. No labels needed.

### Pin Colors (Simplified)

| Situation | Color | When |
|-----------|-------|------|
| Local owner, lives in community | Green | Owner lives in same city/county, not a chain |
| Regional or franchise | Amber | Multi-location or franchise but owner is in-state |
| Corporate / PE / absentee | Gray | Out-of-state ownership, holding company, or 6+ locations |

These derive directly from the registration answers. No manual curation, no subjective judgment. If you own one shop and live in town, you're green. That's it.

---

## Business → Community Communication

Businesses talk to their community through three content types. This is the business's microphone — their way to be seen without paying for ads.

### Promotions
Time-limited deals. "15% off this weekend." Has start/end dates, auto-expires. Drives foot traffic.

### Events
Things happening at the business. "Live music Friday 7pm." Has date/time. Builds community.

### Updates
General news. "New seasonal menu is here." "We're hiring." "Thank you for 10 years." No expiration.

All three show in the consumer feed, on the business profile, and can be shared. The business controls the message. No intermediary.

---

## Community → Business Communication

This is the hard part. How do consumers talk back without creating Yelp?

### What We Allow

**Endorse (❤️)** — One tap. "I support this business and what it stands for." Not a visit log, not a rating. A stance. Public count, anonymous individually. This is the positive signal.

**Ask a Question** — Consumer submits a question to the business. Business can respond. Both sides are identified (no anonymous sniping). Questions and answers are visible on the business profile. Business can choose not to answer — silence is its own signal.

Example:
> Q: "Do you source your beans locally?" — Sarah M.
> A: "We roast in-house and source from three direct-trade farms." — Kingdom Coffee

This creates accountability without reviews. The business speaks for itself.

**Report a Concern** — Private. Not public. Consumer selects a pillar (Customers, Employees, Community, Planet), describes the concern. Goes to the business owner first (not the public). If unresolved, escalates to platform review. Volume + pattern triggers visibility — one report does nothing. This prevents weaponization.

### What We Don't Allow (Ever)

- Star ratings
- Public text reviews
- Anonymous comments
- "Tips" or "warnings" visible to other consumers
- Ranking businesses against each other
- Any feature where one person's bad day can damage a business's reputation

### Why This Works

**Yelp's problem:** Anyone can write anything, anonymously, and it's permanent and public. One angry customer can tank a small business.

**Nextdoor's problem:** Public forums devolve into tribal arguments. Businesses get dragged into neighborhood politics.

**Our model:** Businesses have a microphone (promotions, events, updates). Consumers have a heart (endorse) and a direct line (questions). Concerns are private and pattern-based. No one person has outsized power.

---

## T1 — MVP Tier

- Registration collects locality facts (owner name, location, tenure, locations count)
- Pin color derived from locality answers (green/amber/gray)
- Locality facts displayed on business profile (transparent, not scored)
- Endorse button (❤️ with count)
- Report a Concern (private, pillar-based, goes to platform review)
- Promotions, events, updates (business posts to community)

## T2 — Core Tier

- Ask a Question (consumer → business, public Q&A on profile)
- Business owner notification when endorsed or asked a question
- Concern escalation flow (business sees concern first, can respond)
- Pattern detection on concerns (3+ on same pillar → platform review)
- "Verified Local" indicator for businesses with 3+ years + single location + endorsements

## T3 — Polish Tier

- Community scorecards (aggregate signals, not individual reviews)
- Business analytics (views, endorsements, question engagement)
- Automated locality verification (business registration records, public data)
- "Local spotlight" — editorial/algorithmic featuring of active community builders

---

## Integration Points

- Connects to: Business Data, Auth
- Used by: Map System (pin colors), Consumer Feed (badges on cards), Business Profile (locality facts, Q&A, endorsements)
