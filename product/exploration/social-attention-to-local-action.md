---
id: explore-social-integration
purpose: Exploration — how TikTok, Instagram, and other social platforms integrate with the platform as distribution, credibility, and discovery channels.
layer: what
status: exploration
---

# Social Integration — TikTok, Instagram, and the platform

> **Status:** Exploration. Not scoped, not scheduled. Earliest bundle: b2 (requires b1 feed, follows, and item surfaces first).

## The relationship

TikTok and Instagram are where attention already lives. This platform is where local action happens. Rather than competing for attention, the platform can convert social engagement into local connections. The two sides complement each other: social platforms get engagement from local content (which performs well algorithmically), and this platform gets traffic from social audiences. Producers get reach without paying for ads — their social content is the marketing, and the platform is where the conversion happens.

## Channel 1: Find It Locally (member → platform)

A member sees something they love on TikTok — a dress, a piece of pottery, a dog-friendly beach, a fermented hot sauce. They share the link with the platform. The platform extracts the category signal from Open Graph metadata (title, description, hashtags) and answers: **"Here's who makes or sells something like it near you."**

The benefit is concrete: the member says "I want this" and the platform responds with a local connection. Every shared link is a search query expressed as a reference object.

**How it works:**

1. Member pastes a URL into a "Find it locally" input.
2. Platform resolves the URL and fetches OG metadata. Extracts category signals (keywords, hashtags, inferred item kinds).
3. Platform shows the member what it understood: "Looks like you're interested in **handmade dresses**. Find local sellers?" Member confirms, edits, or dismisses.
4. On confirmation, matches against local Items by tags/kinds within the member's place-interest scope.
5. If no match, records the signal as latent demand via saved-search substrate. "We'll let you know if someone near you starts selling this."

**For producers:** Aggregated and anonymized demand signals surface on the producer dashboard — "12 people in your area searched for handmade jewelry this month." Demand they'd otherwise have no way to see.

**For cold start:** A new member pastes 3–4 links and instantly has a taste profile richer than weeks of browsing. Solves the empty-feed problem on day one.

**Signal accumulation:** Extracted signals feed `member_interests` (taste profile). The member can see and edit accumulated interests at any time. The platform proposes; the member confirms.

## Channel 2: Smart links (platform → social)

Producers already create content on TikTok and Instagram. The platform gives them a smart link to put in their bio or caption — a URL that resolves to their Shop page, where viewers can follow them, see what they sell, find where they'll be this Saturday.

TikTok is the megaphone; the platform is the storefront. The producer maintains one content library (on social) and one local presence (on the platform).

## Channel 3: Social embeds on platform pages (social → platform)

A producer's Shop page or Item page could pull their latest TT/IG post via oEmbed (both platforms support the API). The producer pastes their profile URL once, and their Shop page stays fresh with content they're already creating elsewhere.

This keeps platform pages engaging without requiring producers to create platform-specific content. The social post serves as social proof on a page that has a different purpose (local discovery and transaction).

## Channel 4: Share-out cards (platform → social)

When a member finds a great local product or event, the platform generates a share card — a branded image with the item name, producer, and a short link back to the platform. Optimized for TT/IG stories.

The member posts it to their social feed, their followers tap through, and they land on the platform. This is the viral loop: platform → social → new member → platform. The share card is the social-native version. (A print version was explored as the QR card, F041, and removed 2026-09-03 — see `playbooks/PLATFORM-PATTERNS.md` § *No platform-generated QR codes*.)

## Channel 5: Event invite embeds (social → platform)

A gathering host records a 15-second invite on TT/IG and links it to the event page. The platform surfaces "Watch the invite" as an embed on the event page. Lowers the friction of "what's this event actually like?" without the platform building a video player or content moderation system.

## Channel 6: Social proof indicators (social → platform)

When the locality feed shows an Item, it could include a social engagement indicator if the producer's linked TT post has high engagement. The producer opts into this by linking their post. It's social proof the way a restaurant puts press clippings in the window.

## The two discovery modes

Combined with the locality feed, the taste profile (built partly from shared links) powers two complementary views:

1. **Local feed filtered by interests** (the daily view). Things near me I'd care about. The Sacramento farmers market surfaces here because it's local AND matches food interests.

2. **Interest feed filtered by proximity** (the exploration view). Things I'd care about, sorted nearest-first, no geographic ceiling. The dog-friendly beach in Italy surfaces here — not because it's local, but because it's the nearest instance of something the member loves, even if "nearest" means across the world.

The first mode is b1's locality feed enhanced. The second is new territory.

## Current posture

For now, the platform doesn't plan to host video content, connect to members' social accounts, or build a content feed that overlaps with TT/IG. The channels above use social platforms as distribution and credibility partners rather than competing with them. That said, this is a posture, not a permanent decision — if a clear member benefit emerges from deeper integration, it's worth revisiting.

## Substrate decisions for b1

Nothing here gates b1, but two b1 substrates are load-bearing:

1. **`member_interests`** (taste profile, planned for b1 per `member.md`). The controlled-vocabulary tag list that shared-link signals write to. ✓
2. **`member_saved_searches`** (shipped T102). The "notify me later" path for no-match signals. ✓

No b1 changes needed. All channels are additive to existing substrate.

## Open questions

- **OG metadata quality.** TikTok's OG tags are minimal; Instagram's better; YouTube's rich. How much signal can the platform reliably extract? Needs prototyping.
- **Category taxonomy.** The `member_interests` vocabulary needs to map "handmade dress" and "vintage clothing" to the same neighborhood. Tag hierarchy or embedding similarity? b2 design decision.
- **Producer demand dashboard.** Aggregated demand signals need a privacy-by-design pass (three-filter test) before surfacing to producers.
- **oEmbed reliability.** TT/IG embed APIs have rate limits and can change terms. The platform should degrade gracefully if an embed fails.
- **Non-English metadata.** The dog beach in Italy has Italian OG tags. Extract what we can, let the member edit.

## Loops served

- **Loop 8 (Follow what you love):** Shared link = follow-intent. "Notify me when someone local sells this" = a follow.
- **Loop 9 (Buy close):** Direct match → local purchase.
- **Loop 2 (Wonder):** "I saw this and wondered if anyone near me does it." The no-match path.

## Related docs

- [`member.md` § Taste profile](../systems/member.md) — the substrate shared-link signals write to.
- [`member.md` § Saved searches](../systems/member.md) — the "notify me later" substrate.
- [`producer-tools.md`](../systems/producer-tools.md) — the demand-signal dashboard.
- [`policy.md`](../foundation/policy.md) — aggregated demand signals need the three-filter privacy test.
